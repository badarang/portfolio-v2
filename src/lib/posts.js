import { supabase, isSupabaseConfigured } from "./supabase";
import { externalBlogPosts } from "../data/externalBlogPosts";

// 블로그 글을 읽고 조회수를 올리는 데이터 액세스 레이어.
// posts 테이블 스키마는 ../../supabase/schema.sql 참고.

function escapeHtml(value = "") {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function stripPublisherMeta(raw = "") {
  const normalized = raw.replace(/\r\n/g, "\n");
  const marker = normalized.indexOf("\n---");
  if (marker === -1) return normalized.trim();
  return normalized.slice(marker + 4).trim();
}

function transformExternalDraft(raw, assetBase) {
  let markdown = stripPublisherMeta(raw);

  markdown = markdown.replace(
    /\[IMAGE:\s*([^\]]+)]\n\[IMAGE_CAPTION:\s*([^\]]+)]/g,
    (_, fileName, caption) => {
      const src = `${assetBase}/${fileName.trim()}`;
      const safeCaption = escapeHtml(caption.trim());
      return `<figure class="blog-figure"><img src="${src}" alt="${safeCaption}" class="blog-media-wide" /><figcaption>${safeCaption}</figcaption></figure>`;
    }
  );

  markdown = markdown.replace(/\[IMAGE:\s*([^\]]+)]/g, (_, fileName) => {
    const src = `${assetBase}/${fileName.trim()}`;
    return `<img src="${src}" alt="" class="blog-media-wide" />`;
  });

  markdown = markdown.replace(/%\[(https?:\/\/[^\]]+)]/g, (_, url) => {
    return `<div class="blog-embed"><iframe src="${url}" title="Embedded content" loading="lazy" allowfullscreen></iframe></div>`;
  });

  return markdown;
}

async function hydrateLocalPost(post) {
  if (!post.content_url) return post;

  const response = await fetch(post.content_url);
  if (!response.ok) return post;

  const raw = await response.text();
  return {
    ...post,
    content_md: transformExternalDraft(raw, post.asset_base),
  };
}

export async function fetchPublishedPosts() {
  if (!isSupabaseConfigured) return { data: [], configured: false };
  const { data, error } = await supabase
    .from("posts")
    .select("id, slug, title, excerpt, cover_url, tags, video_url, content_md, views, published_at")
    .eq("published", true)
    .order("published_at", { ascending: false });
  if (error) throw error;
  return { data: data ?? [], configured: true };
}

export async function fetchPostBySlug(slug) {
  const localPost = externalBlogPosts.find((post) => post.slug === slug);
  if (localPost) return hydrateLocalPost(localPost);

  if (!isSupabaseConfigured) return null;
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("slug", slug)
    .eq("published", true)
    .single();
  if (error) throw error;
  return data;
}

// 조회수 +1 (스키마의 increment_post_views RPC 사용)
export async function incrementViews(slug) {
  if (externalBlogPosts.some((post) => post.slug === slug)) return;
  if (!isSupabaseConfigured) return;
  const { error } = await supabase.rpc("increment_post_views", { post_slug: slug });
  if (error) console.warn("조회수 증가 실패:", error.message);
}
