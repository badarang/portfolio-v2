#!/usr/bin/env node
/**
 * 자체 블로그(Supabase) 발행 CLI.
 *
 * 사용법:
 *   node scripts/publish.mjs upsert <파일.md>     # 글 생성/수정 (slug 기준)
 *   node scripts/publish.mjs publish <slug>        # 발행 (published=true)
 *   node scripts/publish.mjs unpublish <slug>      # 발행 취소
 *   node scripts/publish.mjs delete <slug>         # 삭제
 *   node scripts/publish.mjs list                  # 전체 목록
 *
 * 환경변수 (portfolio-v2/.env.publish 또는 셸 env):
 *   SUPABASE_URL=...
 *   SUPABASE_SERVICE_ROLE_KEY=...      # service_role 키 (절대 커밋 금지!)
 *
 * 글 파일 형식 (markdown + 상단 메타데이터, '---' 로 본문과 구분):
 *   TITLE: 글 제목
 *   SLUG: my-post           # 생략 시 제목에서 자동 생성
 *   TAGS: 게임개발, 회고
 *   EXCERPT: 한 줄 요약
 *   COVER: https://.../cover.png
 *   VIDEO: https://youtu.be/xxxx
 *   PUBLISHED: true
 *   PUBLISHED_AT: 2024-12-02T00:04:00+09:00
 *   ---
 *   # 본문 (마크다운)
 *   ...
 */
import { readFileSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { createClient } from "@supabase/supabase-js";

const __dirname = dirname(fileURLToPath(import.meta.url));

// .env.publish 를 직접 로드 (의존성 없이 간단 파서)
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

const URL = process.env.SUPABASE_URL;
const KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!URL || !KEY) {
  console.error(
    "❌ SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY 가 필요합니다.\n" +
      "   portfolio-v2/.env.publish 에 설정하세요 (.env.publish.example 참고)."
  );
  process.exit(1);
}
const db = createClient(URL, KEY, { auth: { persistSession: false } });

const slugify = (s) =>
  s
    .toLowerCase()
    .trim()
    .replace(/[^\w가-힣\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 80);

function parsePostFile(path) {
  const raw = readFileSync(resolve(path), "utf8");
  const idx = raw.indexOf("\n---");
  const head = idx === -1 ? raw : raw.slice(0, idx);
  const body = idx === -1 ? "" : raw.slice(idx + 4).replace(/^\s*\n/, "");
  const meta = {};
  for (const line of head.split("\n")) {
    const m = line.match(/^([A-Z_]+):\s*(.*)$/);
    if (m) meta[m[1].toLowerCase()] = m[2].trim();
  }
  if (!meta.title) throw new Error("TITLE 이 필요합니다.");
  return {
    slug: meta.slug || slugify(meta.title),
    title: meta.title,
    excerpt: meta.excerpt || null,
    cover_url: meta.cover || null,
    video_url: meta.video || null,
    tags: meta.tags ? meta.tags.split(",").map((t) => t.trim()).filter(Boolean) : [],
    content_md: body,
    published: /^(true|1|yes)$/i.test(meta.published || ""),
    published_at: meta.published_at || null,
  };
}

async function upsert(path) {
  const post = parsePostFile(path);
  if (post.published && !post.published_at) post.published_at = new Date().toISOString();
  if (!post.published) post.published_at = null;
  const { data, error } = await db
    .from("posts")
    .upsert(post, { onConflict: "slug" })
    .select("slug, title, published")
    .single();
  if (error) throw error;
  console.log(
    `✅ ${data.published ? "발행" : "저장"} 완료: "${data.title}"  →  /blog/${data.slug}`
  );
}

async function setPublished(slug, value) {
  const patch = { published: value };
  if (value) patch.published_at = new Date().toISOString();
  const { data, error } = await db
    .from("posts")
    .update(patch)
    .eq("slug", slug)
    .select("slug, title")
    .single();
  if (error) throw error;
  console.log(`✅ ${value ? "발행" : "발행취소"}: "${data.title}"`);
}

async function remove(slug) {
  const { error } = await db.from("posts").delete().eq("slug", slug);
  if (error) throw error;
  console.log(`🗑️  삭제 완료: ${slug}`);
}

async function list() {
  const { data, error } = await db
    .from("posts")
    .select("slug, title, published, views, published_at")
    .order("created_at", { ascending: false });
  if (error) throw error;
  if (!data.length) return console.log("(글 없음)");
  for (const p of data) {
    console.log(
      `${p.published ? "🟢" : "⚪"} ${p.title}  [${p.slug}]  👁${p.views}`
    );
  }
}

const [cmd, arg] = process.argv.slice(2);
try {
  if (cmd === "upsert" && arg) await upsert(arg);
  else if (cmd === "publish" && arg) await setPublished(arg, true);
  else if (cmd === "unpublish" && arg) await setPublished(arg, false);
  else if (cmd === "delete" && arg) await remove(arg);
  else if (cmd === "list") await list();
  else {
    console.log("사용법: upsert <file.md> | publish <slug> | unpublish <slug> | delete <slug> | list");
    process.exit(1);
  }
} catch (e) {
  console.error("❌ 오류:", e.message);
  process.exit(1);
}
