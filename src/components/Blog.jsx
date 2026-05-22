import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { fetchPublishedPosts } from "../lib/posts";
import { externalBlogPosts } from "../data/externalBlogPosts";
import { useI18n } from "../i18n";
import SectionHeader from "./SectionHeader";
import Reveal from "./Reveal";

function formatDate(d, locale) {
  if (!d) return "";
  return new Date(d).toLocaleDateString(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function getYouTubeId(url) {
  if (!url) return null;
  const match = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([\w-]{11})/
  );
  return match ? match[1] : null;
}

function extractMediaFromMarkdown(markdown = "") {
  const markdownImages = [...markdown.matchAll(/!\[[^\]]*]\(([^)\s]+)(?:\s+"[^"]*")?\)/g)].map(
    (match) => match[1]
  );
  const htmlImages = [...markdown.matchAll(/<img[^>]+src=["']([^"']+)["'][^>]*>/gi)].map(
    (match) => match[1]
  );
  const htmlVideos = [...markdown.matchAll(/<video[^>]+src=["']([^"']+)["'][^>]*>/gi)].map(
    (match) => match[1]
  );
  const media = [...markdownImages, ...htmlImages, ...htmlVideos];
  const gif = media.find((src) => /\.gif(?:[?#].*)?$/i.test(src));
  const image = media.find((src) => /\.(?:png|jpe?g|webp|avif)(?:[?#].*)?$/i.test(src));
  return gif || image || media[0] || "";
}

function getPostThumbnail(post) {
  if (post.thumbnail_url) return post.thumbnail_url;
  if (post.cover_url) return post.cover_url;
  const media = extractMediaFromMarkdown(post.content_md);
  if (media) return media;
  const youtubeId = getYouTubeId(post.video_url);
  if (youtubeId) return `https://i.ytimg.com/vi/${youtubeId}/maxresdefault.jpg`;
  return "";
}

function BlogPostRow({ post, index, locale, labels }) {
  const thumbnail = getPostThumbnail(post);
  const dateLabel = post.published_at ? formatDate(post.published_at, locale) : post.source;
  const rowContent = (
    <>
      <div className="absolute inset-y-0 right-0 w-[48%] bg-surface opacity-80 transition duration-500 group-hover:opacity-100 sm:w-[42%]">
        {thumbnail ? (
          <img
            src={thumbnail}
            alt=""
            loading="lazy"
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-simple/25 via-surface to-juicy/25 p-5 text-right">
            <div className="max-w-[12rem] font-display text-xl font-black leading-tight text-white/70">
              {post.title}
            </div>
          </div>
        )}
      </div>
      <div className="absolute inset-0 bg-gradient-to-r from-card via-card/95 via-[58%] to-card/12" />
      <div className="absolute inset-y-0 right-0 w-[48%] bg-gradient-to-l from-transparent via-card/10 to-card sm:w-[42%]" />

      <div className="relative z-10 flex min-h-[122px] flex-col p-4 pr-[32%] sm:min-h-[132px] sm:p-5 sm:pr-[36%]">
        <div className="mb-2 flex min-w-0 flex-wrap items-center gap-2">
          {(post.tags ?? []).slice(0, 2).map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-line bg-surface px-2.5 py-1 text-[0.65rem] font-bold text-simple"
            >
              #{tag}
            </span>
          ))}
        </div>
        <h3 className="line-clamp-1 font-display text-lg font-bold leading-tight text-white group-hover:text-simple">
          {post.title}
        </h3>
        {post.excerpt && (
          <p className="mt-2 line-clamp-2 max-w-2xl text-sm leading-6 text-soft">
            {post.excerpt}
          </p>
        )}
        <div className="mt-auto flex items-center justify-between gap-3 pt-4 text-xs text-muted">
          <span>{dateLabel}</span>
          {post.views != null ? (
            <span className="shrink-0">{labels.views} {post.views}</span>
          ) : null}
        </div>
      </div>
    </>
  );

  return (
    <Reveal delay={(index % 3) * 0.06}>
      <motion.div whileHover={{ y: -4 }} className="h-full">
        <Link
          to={`/blog/${post.slug}`}
          className="group relative block min-h-[122px] overflow-hidden rounded-xl border border-line bg-card shadow-card transition hover:border-simple/55 sm:min-h-[132px]"
        >
          {rowContent}
        </Link>
      </motion.div>
    </Reveal>
  );
}

export default function Blog({ mode = "preview" }) {
  const { content, languageMeta } = useI18n();
  const { ui } = content;
  const [state, setState] = useState({ loading: true, posts: [], configured: true });
  const isPreview = mode === "preview";
  const posts = [...externalBlogPosts, ...state.posts];
  const visiblePosts = isPreview ? posts.slice(0, 3) : posts;

  useEffect(() => {
    let alive = true;
    fetchPublishedPosts()
      .then(({ data, configured }) => {
        if (alive) setState({ loading: false, posts: data, configured });
      })
      .catch((e) => {
        console.error(e);
        if (alive) setState({ loading: false, posts: [], configured: true });
      });
    return () => {
      alive = false;
    };
  }, []);

  return (
    <section id="blog" className={`container-px ${isPreview ? "py-24" : "py-28"}`}>
      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <SectionHeader
          eyebrow={ui.blog.eyebrow}
          title={ui.blog.title}
          desc={isPreview ? ui.blog.desc : ui.blog.indexDesc}
        />
        {isPreview && (
          <Link
            to="/blog"
            className="inline-flex h-12 w-fit shrink-0 items-center justify-center gap-2 rounded-full border border-line bg-white px-5 text-sm font-bold text-ink transition hover:bg-hook hover:text-white"
          >
            {ui.blog.viewAll}
            <svg
              viewBox="0 0 24 24"
              aria-hidden="true"
              className="h-4 w-4 fill-current"
            >
              <path d="M14 3h7v7h-2V6.41l-9.29 9.3-1.42-1.42 9.3-9.29H14V3Z" />
              <path d="M5 5h6v2H7v10h10v-4h2v6H5V5Z" />
            </svg>
          </Link>
        )}
      </div>

      <div className="mt-12">
        {state.loading && <p className="text-muted">{ui.blog.loading}</p>}

        {!state.loading && !state.configured && posts.length === 0 && (
          <div className="card-surface p-8 text-center">
            <p className="text-soft">{ui.blog.closed}</p>
            <p className="mt-2 text-sm text-muted">
              {ui.blog.configured}
            </p>
          </div>
        )}

        {!state.loading && state.configured && posts.length === 0 && (
          <div className="card-surface p-8 text-center">
            <p className="text-soft">{ui.blog.empty}</p>
          </div>
        )}

        {!state.loading && posts.length > 0 && (
          <div className="grid gap-4">
            {visiblePosts.map((post, i) => (
              <BlogPostRow
                key={post.id}
                post={post}
                index={i}
                locale={languageMeta.locale}
                labels={ui.blog}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
