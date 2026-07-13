#!/usr/bin/env node
/**
 * Notion → 자체 블로그(Supabase) 동기화 CLI.
 *
 * Notion 데이터베이스의 각 행(page)을 마크다운으로 변환해 posts 테이블에 upsert 한다.
 * 본문 이미지는 Notion 서명 URL(1시간 만료)을 그대로 쓸 수 없으므로,
 * Supabase Storage(blog-images 버킷)에 다시 올리고 안정적인 public URL 로 바꾼다.
 *
 * 사용법:
 *   node scripts/notion-sync.mjs            # DB 전체 동기화
 *   node scripts/notion-sync.mjs <slug>     # 특정 slug 한 개만
 *   node scripts/notion-sync.mjs --dry-run  # DB만 조회, 쓰기 없음
 *
 * 환경변수 (portfolio-v2/.env.publish 또는 셸 env):
 *   NOTION_TOKEN=secret_xxx                 # Notion 내부 통합(integration) 토큰
 *   NOTION_DATABASE_ID=xxxxxxxx...          # 블로그 DB id (URL 에서 추출)
 *   SUPABASE_URL=...
 *   SUPABASE_SERVICE_ROLE_KEY=...           # service_role 키 (절대 커밋 금지!)
 *
 * Notion DB 속성(property) 규칙:
 *   - title 타입 속성        → 글 제목 (속성 이름은 무관, 타입으로 인식)
 *   - "Slug" (rich text)     → URL. 비우면 제목에서 자동 생성
 *   - "Tags" (multi-select)  → 태그 (블로그 카테고리 필터에 연결)
 *   - "Excerpt" (rich text)  → 목록용 한 줄 요약
 *   - "Published" (checkbox) → 체크해야 블로그에 노출
 *   - "Published At" (date)  → 발행일. 비우면 최초 발행 시각 자동 기록
 *   - "Video" (url)          → YouTube 등 embed (선택)
 *   페이지 커버 이미지 → cover_url 로 사용 (선택)
 */
import { readFileSync, writeFileSync, existsSync, unlinkSync } from "node:fs";
import { resolve, dirname, extname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { createHash } from "node:crypto";
import { tmpdir } from "node:os";
import { execFileSync } from "node:child_process";
import { createClient } from "@supabase/supabase-js";
import { Client } from "@notionhq/client";
import { NotionToMarkdown } from "notion-to-md";
import ffmpegPath from "ffmpeg-static";

const __dirname = dirname(fileURLToPath(import.meta.url));

// .env.publish 직접 로드 (의존성 없이 간단 파서) — publish.mjs 와 동일 규칙
function loadEnv() {
  const envPath = resolve(__dirname, "..", ".env.publish");
  if (existsSync(envPath)) {
    for (const line of readFileSync(envPath, "utf8").split("\n")) {
      const m = line.match(/^\s*([A-Z_]+)\s*=\s*(.*)\s*$/);
      if (m) process.env[m[1]] ??= m[2].replace(/^["']|["']$/g, "");
    }
  }
}
loadEnv();

const NOTION_TOKEN = process.env.NOTION_TOKEN;
const NOTION_DATABASE_ID = process.env.NOTION_DATABASE_ID;
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const BUCKET = "blog-images";

function requireEnv() {
  const missing = [];
  if (!NOTION_TOKEN) missing.push("NOTION_TOKEN");
  if (!NOTION_DATABASE_ID) missing.push("NOTION_DATABASE_ID");
  if (!SUPABASE_URL) missing.push("SUPABASE_URL");
  if (!SUPABASE_KEY) missing.push("SUPABASE_SERVICE_ROLE_KEY");
  if (missing.length) {
    console.error(
      `❌ 환경변수 누락: ${missing.join(", ")}\n` +
        "   portfolio-v2/.env.publish 에 설정하세요 (.env.publish.example 참고)."
    );
    process.exit(1);
  }
}

const notion = new Client({ auth: NOTION_TOKEN });
const n2m = new NotionToMarkdown({ notionClient: notion, config: { parseChildPages: false } });
const db = createClient(SUPABASE_URL, SUPABASE_KEY, { auth: { persistSession: false } });

const slugify = (s = "") =>
  s
    .toLowerCase()
    .trim()
    .replace(/[^\w가-힣\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 80);

// ---- Notion 속성 추출 헬퍼 ------------------------------------------------

function plainText(rich = []) {
  return rich.map((r) => r.plain_text).join("").trim();
}

function readProps(page) {
  const props = page.properties ?? {};
  const out = { title: "", slug: "", excerpt: "", tags: [], published: false, publishedAt: null, video: null };

  for (const [name, prop] of Object.entries(props)) {
    const key = name.trim().toLowerCase();
    switch (prop.type) {
      case "title":
        out.title = plainText(prop.title);
        break;
      case "rich_text":
        if (key === "slug") out.slug = plainText(prop.rich_text);
        else if (key === "excerpt") out.excerpt = plainText(prop.rich_text);
        break;
      case "multi_select":
        if (key === "tags") out.tags = prop.multi_select.map((o) => o.name);
        break;
      case "select":
        if (key === "tags" && prop.select) out.tags = [prop.select.name];
        break;
      case "checkbox":
        if (key === "published") out.published = prop.checkbox;
        break;
      case "date":
        if (key === "published at" || key === "published_at" || key === "date")
          out.publishedAt = prop.date?.start ?? null;
        break;
      case "url":
        if (key === "video") out.video = prop.url || null;
        break;
      default:
        break;
    }
  }
  if (!out.slug) out.slug = slugify(out.title);
  return out;
}

function pageCoverUrl(page) {
  const cover = page.cover;
  if (!cover) return null;
  return cover.type === "external" ? cover.external?.url : cover.file?.url;
}

// ---- 이미지 재호스팅 + 자동 압축 (Notion → Supabase Storage) ---------------
//
// 저장 용량을 아끼려고 업로드 전에 압축한다:
//   · GIF        → MP4 (약 10배 감소, 마크다운도 <video> 로 치환)
//   · 큰 이미지  → 가로 1600px 로 다운스케일 재인코딩 (더 작아질 때만 채택)

const IMAGE_COMPRESS_THRESHOLD = 400 * 1024; // 이보다 큰 정적 이미지만 재인코딩
const MAX_IMAGE_WIDTH = 1600;

const CONTENT_TYPE = {
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".webp": "image/webp",
  ".avif": "image/avif",
  ".svg": "image/svg+xml",
  ".mp4": "video/mp4",
  ".webm": "video/webm",
  ".mov": "video/quicktime",
};

// Notion/S3 서명 URL 여부. query string 이 만료되므로 반드시 재호스팅한다.
function isNotionAsset(url = "") {
  return /(amazonaws\.com|notion\.so|notion-static\.com)/i.test(url);
}

function hashOf(url) {
  return createHash("sha1").update(url.split("?")[0]).digest("hex").slice(0, 12);
}

function ffmpeg(args) {
  execFileSync(ffmpegPath, ["-y", "-loglevel", "error", ...args], { stdio: "ignore" });
}

const uploadCache = new Map(); // url → { kind, url }

async function ensureBucket() {
  const { data } = await db.storage.getBucket(BUCKET);
  if (data) return;
  const { error } = await db.storage.createBucket(BUCKET, {
    public: true,
    fileSizeLimit: "25MB",
  });
  if (error && !/already exists/i.test(error.message)) throw error;
  console.log(`📦 Storage 버킷 생성: ${BUCKET} (public)`);
}

async function existsInStorage(path) {
  const dir = path.slice(0, path.lastIndexOf("/"));
  const file = path.slice(path.lastIndexOf("/") + 1);
  const { data } = await db.storage.from(BUCKET).list(dir, { search: file });
  return data?.some((f) => f.name === file) ?? false;
}

function publicUrlOf(path) {
  return db.storage.from(BUCKET).getPublicUrl(path).data.publicUrl;
}

async function uploadBuffer(path, buffer) {
  const contentType = CONTENT_TYPE[extname(path).toLowerCase()] || "application/octet-stream";
  const { error } = await db.storage.from(BUCKET).upload(path, buffer, { contentType, upsert: true });
  if (error) throw error;
  console.log(`   ⬆︎ ${path} (${(buffer.length / 1024).toFixed(0)} KB)`);
}

// GIF → MP4. 반환: 압축된 mp4 버퍼
function gifToMp4(inputBuf, hash) {
  const inPath = join(tmpdir(), `notion-${hash}-in.gif`);
  const outPath = join(tmpdir(), `notion-${hash}-out.mp4`);
  try {
    writeFileSync(inPath, inputBuf);
    ffmpeg([
      "-i", inPath,
      "-movflags", "+faststart",
      "-pix_fmt", "yuv420p",
      "-vf", "scale=trunc(iw/2)*2:trunc(ih/2)*2",
      "-an",
      outPath,
    ]);
    return readFileSync(outPath);
  } finally {
    for (const p of [inPath, outPath]) if (existsSync(p)) unlinkSync(p);
  }
}

// 큰 정적 이미지 다운스케일 재인코딩. 더 작아질 때만 반환, 아니면 null
function shrinkImage(inputBuf, ext, hash) {
  const inPath = join(tmpdir(), `notion-${hash}-in${ext}`);
  const outPath = join(tmpdir(), `notion-${hash}-out${ext}`);
  try {
    writeFileSync(inPath, inputBuf);
    const args = ["-i", inPath, "-vf", `scale='min(${MAX_IMAGE_WIDTH},iw)':-2`];
    if (/\.jpe?g$/i.test(ext)) args.push("-q:v", "3");
    args.push(outPath);
    ffmpeg(args);
    const out = readFileSync(outPath);
    return out.length < inputBuf.length ? out : null;
  } catch {
    return null; // 인코딩 실패 시 원본 유지
  } finally {
    for (const p of [inPath, outPath]) if (existsSync(p)) unlinkSync(p);
  }
}

// 단일 자산 재호스팅. 반환: { kind: 'image'|'video', url }
//   opts.coverMode: 커버 이미지용 — GIF 를 mp4 로 바꾸지 않고 이미지로 유지
async function rehostAsset(url, slug, opts = {}) {
  if (uploadCache.has(url)) return uploadCache.get(url);

  const hash = hashOf(url);
  let ext = extname(url.split("?")[0]).toLowerCase();
  if (!/^\.(png|jpe?g|gif|webp|avif|svg|mp4|webm|mov)$/.test(ext)) ext = ".png";
  const isGif = ext === ".gif";
  const isVideo = /\.(mp4|webm|mov)$/i.test(ext);
  const convertGif = isGif && !opts.coverMode;

  const outExt = convertGif ? ".mp4" : ext;
  const path = `notion/${slug}/${hash}${outExt}`;
  const kind = convertGif || isVideo ? "video" : "image";

  // 이미 올라간 파일이면 다운로드/인코딩까지 전부 skip (경로가 URL 해시로 고정)
  if (await existsInStorage(path)) {
    const result = { kind, url: publicUrlOf(path) };
    uploadCache.set(url, result);
    return result;
  }

  const res = await fetch(url);
  if (!res.ok) throw new Error(`자산 다운로드 실패 (${res.status}): ${url}`);
  let buf = Buffer.from(await res.arrayBuffer());

  if (convertGif) {
    const before = buf.length;
    buf = gifToMp4(buf, hash);
    console.log(`   🎞  GIF→MP4 ${(before / 1024).toFixed(0)}KB → ${(buf.length / 1024).toFixed(0)}KB`);
  } else if (kind === "image" && !/\.svg$/.test(ext) && buf.length > IMAGE_COMPRESS_THRESHOLD) {
    const smaller = shrinkImage(buf, ext, hash);
    if (smaller) {
      console.log(`   🗜  압축 ${(buf.length / 1024).toFixed(0)}KB → ${(smaller.length / 1024).toFixed(0)}KB`);
      buf = smaller;
    }
  }

  await uploadBuffer(path, buf);
  const result = { kind, url: publicUrlOf(path) };
  uploadCache.set(url, result);
  return result;
}

// 마크다운/HTML 안의 모든 Notion 이미지를 재호스팅 URL 로 치환.
// GIF 는 <video> 태그로 바꿔 기존 LazyMarkdownVideo 렌더러와 연결한다.
async function rewriteMedia(markdown, slug) {
  const matches = new Map(); // fullMatch → url
  const patterns = [
    /!\[[^\]]*]\((https?:\/\/[^)\s]+)(?:\s+"[^"]*")?\)/g, // ![alt](url)
    /<img[^>]+src=["'](https?:\/\/[^"']+)["'][^>]*>/gi, // <img src="url">
  ];
  for (const re of patterns) {
    for (const m of markdown.matchAll(re)) {
      if (isNotionAsset(m[1])) matches.set(m[0], m[1]);
    }
  }

  let out = markdown;
  for (const [fullMatch, url] of matches) {
    const asset = await rehostAsset(url, slug);
    const replacement =
      asset.kind === "video"
        ? `<video src="${asset.url}" autoplay loop muted playsinline preload="metadata"></video>`
        : fullMatch.split(url).join(asset.url); // 이미지: alt 유지한 채 URL 만 교체
    out = out.split(fullMatch).join(replacement);
  }
  return out;
}

// ---- Notion → 마크다운 ----------------------------------------------------

async function pageToMarkdown(pageId) {
  const blocks = await n2m.pageToMarkdown(pageId);
  const md = n2m.toMarkdownString(blocks);
  return (md.parent || "").trim();
}

// ---- DB upsert ------------------------------------------------------------

async function upsertPost(post, dryRun) {
  if (dryRun) {
    console.log(`   (dry-run) ${post.published ? "발행" : "저장"} 예정: ${post.slug}`);
    return;
  }
  if (post.published && !post.published_at) {
    const { data: existing } = await db
      .from("posts")
      .select("published_at")
      .eq("slug", post.slug)
      .maybeSingle();
    post.published_at = existing?.published_at || new Date().toISOString();
  }
  if (!post.published) post.published_at = null;

  const { data, error } = await db
    .from("posts")
    .upsert(post, { onConflict: "slug" })
    .select("slug, title, published")
    .single();
  if (error) throw error;
  console.log(`   ✅ ${data.published ? "발행" : "저장"}: "${data.title}" → /blog/${data.slug}`);
}

// ---- Notion DB 조회 -------------------------------------------------------

async function queryDatabase() {
  const pages = [];
  let cursor;
  do {
    const res = await notion.databases.query({
      database_id: NOTION_DATABASE_ID,
      start_cursor: cursor,
      page_size: 100,
    });
    pages.push(...res.results);
    cursor = res.has_more ? res.next_cursor : undefined;
  } while (cursor);
  return pages;
}

// ---- 메인 -----------------------------------------------------------------

async function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes("--dry-run");
  const onlySlug = args.find((a) => !a.startsWith("--")) || null;

  requireEnv();
  if (!dryRun) await ensureBucket();

  const pages = await queryDatabase();
  console.log(`🔎 Notion DB 페이지 ${pages.length}개 발견\n`);

  let done = 0;
  let skipped = 0;
  for (const page of pages) {
    const meta = readProps(page);
    if (!meta.title) {
      skipped++;
      continue;
    }
    if (onlySlug && meta.slug !== onlySlug) continue;

    console.log(`• ${meta.title}  [${meta.slug}]`);

    let content = await pageToMarkdown(page.id);
    content = await rewriteMedia(content, meta.slug);

    let cover = pageCoverUrl(page);
    if (cover && isNotionAsset(cover)) {
      cover = (await rehostAsset(cover, meta.slug, { coverMode: true })).url;
    }

    await upsertPost(
      {
        slug: meta.slug,
        title: meta.title,
        excerpt: meta.excerpt || null,
        cover_url: cover || null,
        video_url: meta.video || null,
        tags: meta.tags,
        content_md: content,
        published: meta.published,
        published_at: meta.publishedAt,
      },
      dryRun
    );
    done++;
  }

  console.log(`\n동기화 완료: ${done}개 처리${skipped ? `, ${skipped}개 건너뜀(제목 없음)` : ""}.`);
  if (onlySlug && done === 0) console.log(`⚠️  slug "${onlySlug}" 에 해당하는 페이지를 못 찾았어요.`);
}

main().catch((e) => {
  console.error("❌ 오류:", e.message);
  process.exit(1);
});
