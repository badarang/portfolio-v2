#!/usr/bin/env node
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, extname, resolve } from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import ffmpeg from "ffmpeg-static";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");

const posts = {
  9: {
    slug: "valorant-shader-clarity-part1",
    tags: ["Riot Games", "Valorant", "Shader", "Gameplay Clarity"],
  },
  10: {
    slug: "valorant-shader-clarity-part2",
    tags: ["Riot Games", "Valorant", "Shader", "Gameplay Clarity"],
  },
  11: {
    slug: "renata-champion-refactoring",
    tags: ["Riot Games", "League of Legends", "Refactoring"],
  },
  13: {
    slug: "unity-dots-performance-comparison",
    tags: ["Unity", "DOTS", "Optimization", "ECS"],
  },
  14: {
    slug: "unity-dots-practical-concepts",
    tags: ["Unity", "DOTS", "ECS"],
  },
  15: {
    slug: "unity-dots-struct-ecb",
    tags: ["Unity", "DOTS", "ECS", "EntityCommandBuffer"],
  },
};

const htmlEntityMap = {
  amp: "&",
  lt: "<",
  gt: ">",
  quot: '"',
  apos: "'",
  nbsp: " ",
  times: "x",
  theta: "θ",
  deg: "°",
  middot: "·",
};

function decodeEntities(text = "") {
  return text
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCharCode(parseInt(n, 16)))
    .replace(/&([a-z]+);/gi, (_, n) => htmlEntityMap[n] ?? `&${n};`);
}

function cleanText(html = "") {
  return decodeEntities(
    html
      .replace(/<br\s*\/?>/gi, "\n")
      .replace(/<a\b[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/gi, (_, href, label) => {
        const text = cleanText(label).trim();
        return text ? `[${text}](${decodeEntities(href)})` : decodeEntities(href);
      })
      .replace(/<(b|strong)\b[^>]*>([\s\S]*?)<\/\1>/gi, "**$2**")
      .replace(/<(i|em)\b[^>]*>([\s\S]*?)<\/\1>/gi, "*$2*")
      .replace(/<span\b[^>]*>/gi, "")
      .replace(/<\/span>/gi, "")
      .replace(/<[^>]+>/g, "")
  )
    .replace(/\u00a0/g, " ")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function titleFrom(html) {
  return decodeEntities(html.match(/<meta property="og:title" content="([^"]+)"/)?.[1] ?? "");
}

function dateFrom(html) {
  return html.match(/"datePublished":"([^"]+)"/)?.[1] ?? "";
}

function descriptionFrom(html) {
  return cleanText(html.match(/<meta name="description" content="([^"]+)"/)?.[1] ?? "").slice(0, 180);
}

function articleHtmlFrom(html) {
  return (
    html.match(/<div class="tt_article_useless_p_margin contents_style">([\s\S]*?)<\/div><div class="container_postbtn/)?.[1] ??
    html.match(/<div class="tt_article_useless_p_margin contents_style">([\s\S]*?)<div class="wrap_btn"/)?.[1] ??
    ""
  );
}

function mediaUrlsFrom(html) {
  const urls = [];
  for (const m of html.matchAll(/data-url="([^"]+)"/g)) {
    const url = decodeEntities(m[1]);
    if (url.includes("blog.kakaocdn.net") && !urls.includes(url)) urls.push(url);
  }
  for (const m of html.matchAll(/<img\b[^>]*src="([^"]+)"/g)) {
    const url = decodeEntities(m[1]);
    if (url.includes("blog.kakaocdn.net") && !urls.includes(url)) urls.push(url);
  }
  return urls;
}

function sourceExt(url) {
  const clean = url.split("?")[0].toLowerCase();
  const ext = extname(clean);
  if (ext === ".gif") return ".gif";
  if (ext === ".jpg" || ext === ".jpeg") return ".jpg";
  return ".png";
}

async function download(url, out) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`download failed ${res.status}: ${url}`);
  const buf = Buffer.from(await res.arrayBuffer());
  writeFileSync(out, buf);
}

function runFfmpeg(args) {
  const result = spawnSync(ffmpeg, args, { stdio: "inherit" });
  if (result.status) throw new Error(`ffmpeg failed: ${args.join(" ")}`);
}

async function prepareMedia(id, html) {
  const urls = mediaUrlsFrom(html);
  const dir = resolve(root, "public", "blog", `tistory-${id}`);
  mkdirSync(dir, { recursive: true });
  const map = new Map();

  for (let i = 0; i < urls.length; i++) {
    const url = urls[i];
    const idx = String(i + 1).padStart(2, "0");
    const ext = sourceExt(url);
    const tmp = resolve(dir, `source-${idx}${ext}`);
    const out = resolve(dir, `media-${idx}.webp`);
    await download(url, tmp);
    if (ext === ".gif") {
      runFfmpeg([
        "-y",
        "-i",
        tmp,
        "-vf",
        "scale=min(900\\,iw):-2:flags=lanczos,fps=12",
        "-c:v",
        "libwebp",
        "-quality",
        "72",
        "-compression_level",
        "6",
        "-loop",
        "0",
        "-an",
        out,
      ]);
    } else {
      runFfmpeg([
        "-y",
        "-i",
        tmp,
        "-vf",
        "scale=min(1100\\,iw):-2:flags=lanczos",
        "-c:v",
        "libwebp",
        "-quality",
        "78",
        "-compression_level",
        "6",
        out,
      ]);
    }
    map.set(url, `/blog/tistory-${id}/media-${idx}.webp`);
  }
  return map;
}

function mediaPathFor(block, mediaMap) {
  const candidates = [];
  for (const m of block.matchAll(/data-url="([^"]+)"/g)) candidates.push(decodeEntities(m[1]));
  for (const m of block.matchAll(/src="([^"]+)"/g)) candidates.push(decodeEntities(m[1]));
  for (const url of candidates) {
    if (mediaMap.has(url)) return mediaMap.get(url);
  }
  return null;
}

function convertArticle(id, html, mediaMap) {
  const article = articleHtmlFrom(html);
  const blocks =
    article.match(
      /<p>\s*<figure[\s\S]*?<\/figure>\s*<\/p>|<figure[\s\S]*?<\/figure>|<pre[\s\S]*?<\/pre>|<h2[\s\S]*?<\/h2>|<h3[\s\S]*?<\/h3>|<h4[\s\S]*?<\/h4>|<ul[\s\S]*?<\/ul>|<ol[\s\S]*?<\/ol>|<table[\s\S]*?<\/table>|<p\b[\s\S]*?<\/p>/gi
    ) ?? [];
  const out = [];
  let mediaIndex = 0;

  for (const block of blocks) {
    if (/<figure\b/i.test(block)) {
      const video = block.match(/data-video-url="([^"]+)"/)?.[1];
      if (video) {
        const yt = video.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]{11})/)?.[1];
        if (yt) {
          out.push(`<div class="blog-embed">\n  <iframe src="https://www.youtube.com/embed/${yt}" title="video" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>\n</div>`);
        }
        continue;
      }
      const path = mediaPathFor(block, mediaMap);
      if (path) {
        mediaIndex++;
        out.push(`<img class="blog-media-wide" src="${path}" alt="티스토리 ${id} 이미지 ${mediaIndex}" loading="lazy" />`);
      }
      continue;
    }

    if (/^<h2/i.test(block)) {
      const text = cleanText(block)
        .replace(/^\s*[✅🧱🍳🚀📦🔍🧩🧾🧪⚙️]+\s*/u, "")
        .replace(/^\*\*(.*)\*\*$/, "$1");
      if (text) out.push(`## ${text}`);
      continue;
    }
    if (/^<h3|^<h4/i.test(block)) {
      const text = cleanText(block).replace(/^\*\*(.*)\*\*$/, "$1");
      if (text) out.push(`### ${text}`);
      continue;
    }
    if (/^<pre/i.test(block)) {
      const code = cleanText(block).replace(/^\s*\d+\s*/gm, "");
      out.push(`\`\`\`csharp\n${code}\n\`\`\``);
      continue;
    }
    if (/^<ul|^<ol/i.test(block)) {
      const items = [...block.matchAll(/<li[\s\S]*?<\/li>/gi)]
        .map((m) => cleanText(m[0]))
        .filter(Boolean)
        .map((text) => `- ${text.replace(/^[-–—]\s*/, "")}`);
      if (items.length) out.push(items.join("\n"));
      continue;
    }
    if (/^<table/i.test(block)) {
      out.push(block);
      continue;
    }

    const text = cleanText(block);
    if (!text) continue;
    if (/^[-–—]+$/.test(text)) out.push("---");
    else out.push(text);
  }

  return out.join("\n\n").replace(/\n{3,}/g, "\n\n").trim();
}

async function main() {
  const ids = process.argv.slice(2);
  if (!ids.length) {
    console.error("usage: node scripts/import-tistory.mjs <id...>");
    process.exit(1);
  }
  for (const id of ids) {
    const cfg = posts[id];
    if (!cfg) throw new Error(`missing config for ${id}`);
    const htmlPath = resolve("C:/tmp", `tistory${id}.html`);
    if (!existsSync(htmlPath)) throw new Error(`missing ${htmlPath}`);
    const html = readFileSync(htmlPath, "utf8");
    const mediaMap = await prepareMedia(id, html);
    const title = titleFrom(html);
    const date = dateFrom(html);
    const excerpt = descriptionFrom(html);
    const body = convertArticle(id, html, mediaMap);
    const md = [
      `TITLE: ${title}`,
      `SLUG: ${cfg.slug}`,
      `TAGS: ${cfg.tags.join(", ")}`,
      `EXCERPT: ${excerpt}`,
      "PUBLISHED: true",
      date ? `PUBLISHED_AT: ${date}` : "",
      "---",
      "",
      body,
      "",
    ]
      .filter((line) => line !== "")
      .join("\n");
    const outPath = resolve(root, "content", "posts", `${cfg.slug}.md`);
    writeFileSync(outPath, md, "utf8");
    console.log(`wrote ${outPath}`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
