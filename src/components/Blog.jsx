import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { fetchPublishedPosts } from "../lib/posts";
import { externalBlogPosts } from "../data/externalBlogPosts";
import { useI18n } from "../i18n";
import SectionHeader from "./SectionHeader";
import Reveal from "./Reveal";

const categoryFilters = [
  {
    key: "game-dev",
    labels: {
      ko: "게임개발",
      en: "Game Dev",
      zh: "游戏开发",
      ja: "ゲーム開発",
    },
    tags: [
      "게임개발",
      "Unity",
      "LÖVE",
      "Indie Game",
      "인디게임",
      "Game Feel",
      "Gameplay Clarity",
      "Hook Simple Juicy",
      "Multiplayer",
      "Optimization",
      "Refactoring",
      "Riot Games",
      "League of Legends",
    ],
  },
  {
    key: "graphics",
    labels: {
      ko: "그래픽스",
      en: "Graphics",
      zh: "图形学",
      ja: "グラフィックス",
    },
    tags: ["Graphics", "Shader", "Shading", "Raytracing", "Valorant"],
  },
  {
    key: "data-performance",
    labels: {
      ko: "데이터/성능",
      en: "Data/Performance",
      zh: "数据/性能",
      ja: "データ/性能",
    },
    tags: [
      "데이터 시각화",
      "Data-Oriented",
      "DOTS",
      "ECS",
      "EntityCommandBuffer",
      "Burst",
      "Benchmark",
      "Infrastructure",
      "Performance",
      "Supabase",
    ],
  },
  {
    key: "retrospective",
    labels: {
      ko: "회고",
      en: "Retrospective",
      zh: "复盘",
      ja: "振り返り",
    },
    tags: [
      "버닝비버",
      "스마일게이트 멤버십",
      "애니멀 점핑",
      "유저 피드백",
      "전시 후기",
    ],
  },
];

const allCategoryLabels = {
  ko: "전체",
  en: "All",
  zh: "全部",
  ja: "すべて",
};

function normalizeTag(tag) {
  return String(tag).trim().toLowerCase();
}

function getPostTime(post) {
  const time = post.published_at ? new Date(post.published_at).getTime() : 0;
  return Number.isFinite(time) ? time : 0;
}

function getMoaiSeriesOrder(post) {
  if (!post.slug?.startsWith("moai-wanna-slam-devlog-")) return null;
  const slugMatch = post.slug.match(/devlog-(\d+)/);
  if (slugMatch) return Number(slugMatch[1]);
  const titleMatch = post.title?.match(/\]\s*(\d+)\./);
  return titleMatch ? Number(titleMatch[1]) : null;
}

function isSpecialPost(post) {
  return (post.tags ?? []).some((tag) => normalizeTag(tag) === "special");
}

const specialPinnedSlugs = [
  "moai-wanna-slam-devlog-00-series-retrospective",
  "renata-champion-refactoring",
  "unity-dots-understanding",
];

const customThumbnailBySlug = {
  "moai-wanna-slam-devlog-00-series-retrospective": "/blog/moai-devlog00-hook-thumbnail.mp4",
  "moai-wanna-slam-devlog-01-hook-simple-juicy": "/blog/moai-devlog00-bookmark-01.gif",
  "moai-wanna-slam-devlog-02-love-client-structure": "/blog/moai-wanna-slam-movement-tuning.gif",
  "moai-wanna-slam-devlog-03-websocket-authoritative-server": "/blog/moai-wanna-slam-connection-flow.gif",
  "moai-wanna-slam-devlog-04-fullstack-architecture": "/blog/moai-devlog4-runtime-architecture-flow-v3.gif",
  "moai-wanna-slam-devlog-05-reinforcement-learning-review": "/blog/moai-devlog00-bookmark-05.gif",
  "moai-wanna-slam-devlog-06-mobile-shader-troubleshooting": "/blog/moai-devlog6-uv-stability.gif",
  "moai-wanna-slam-devlog-07-mobile-network-lag-troubleshooting": "/blog/moai-wanna-slam-correction-strategy.gif",
  "moai-wanna-slam-devlog-08-benchmark-infrastructure": "/blog/moai-wanna-slam-ai-matchup-heatmap-basic-map-50.png",
  "sgm-feedback-summary": "/blog/sgm-feedback/03-upload-demo.gif",
};

function getSpecialPinnedOrder(post) {
  const index = specialPinnedSlugs.indexOf(post.slug);
  return index === -1 ? null : index;
}

function sortPostsForIndex(posts) {
  return [...posts].sort((a, b) => {
    const aMoaiOrder = getMoaiSeriesOrder(a);
    const bMoaiOrder = getMoaiSeriesOrder(b);
    if (aMoaiOrder != null && bMoaiOrder != null) {
      return aMoaiOrder - bMoaiOrder;
    }
    return getPostTime(b) - getPostTime(a);
  });
}

function sortSpecialPosts(posts) {
  return [...posts].filter(isSpecialPost).sort((a, b) => {
    const aPinned = getSpecialPinnedOrder(a);
    const bPinned = getSpecialPinnedOrder(b);
    if (aPinned != null && bPinned != null) return aPinned - bPinned;
    if (aPinned != null) return -1;
    if (bPinned != null) return 1;
    return getPostTime(b) - getPostTime(a);
  });
}

function postMatchesCategory(post, category) {
  const postTags = new Set((post.tags ?? []).map(normalizeTag));
  return category.tags.some((tag) => postTags.has(normalizeTag(tag)));
}

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

function isStaticThumbnail(src = "") {
  return /\.(?:png|jpe?g|webp|avif|svg)(?:[?#].*)?$/i.test(src);
}

function isVideoThumbnail(src = "") {
  return /\.(?:mp4|webm|mov)(?:[?#].*)?$/i.test(src);
}

function isGifThumbnail(src = "") {
  return /\.gif(?:[?#].*)?$/i.test(src);
}

function isAnimatedThumbnail(src = "") {
  return /\.(?:gif|mp4|webm|mov)(?:[?#].*)?$/i.test(src);
}

const transparentPixel =
  "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";

function extractMediaFromMarkdown(markdown = "") {
  const markdownImages = [...markdown.matchAll(/!\[[^\]]*]\(([^)\s]+)(?:\s+"[^"]*")?\)/g)].map(
    (match) => match[1]
  );
  const htmlImages = [...markdown.matchAll(/<img[^>]+src=["']([^"']+)["'][^>]*>/gi)].map(
    (match) => match[1]
  );
  const images = [...markdownImages, ...htmlImages];
  const staticImage = images.find(isStaticThumbnail);
  return staticImage || "";
}

function getPostThumbnail(post) {
  if (customThumbnailBySlug[post.slug]) return customThumbnailBySlug[post.slug];
  if (
    post.thumbnail_url &&
    (isStaticThumbnail(post.thumbnail_url) || isAnimatedThumbnail(post.thumbnail_url))
  ) {
    return post.thumbnail_url;
  }
  if (
    post.cover_url &&
    (isStaticThumbnail(post.cover_url) || isAnimatedThumbnail(post.cover_url))
  ) {
    return post.cover_url;
  }
  const media = extractMediaFromMarkdown(post.content_md);
  if (media) return media;
  const youtubeId = getYouTubeId(post.video_url);
  if (youtubeId) return `https://i.ytimg.com/vi/${youtubeId}/maxresdefault.jpg`;
  return "";
}

function getPostThumbnailFallback(post) {
  if (post.slug === "moai-wanna-slam-devlog-00-series-retrospective") {
    return "/blog/moai-devlog00-hook-thumbnail.jpg";
  }
  if (post.cover_url && isStaticThumbnail(post.cover_url)) return post.cover_url;
  const media = extractMediaFromMarkdown(post.content_md);
  if (media) return media;
  const youtubeId = getYouTubeId(post.video_url);
  if (youtubeId) return `https://i.ytimg.com/vi/${youtubeId}/maxresdefault.jpg`;
  return "";
}

function LazyCardThumbnail({ src, fallback }) {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!ref.current) return undefined;
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { rootMargin: "160px 0px", threshold: 0.05 }
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVideoThumbnail(src) || !ref.current) return;
    if (isVisible) {
      ref.current.play?.().catch(() => {});
    } else {
      ref.current.pause?.();
    }
  }, [isVisible, src]);

  const className = "h-full w-full object-cover transition duration-500 group-hover:scale-105";

  if (isVideoThumbnail(src)) {
    return (
      <video
        ref={ref}
        src={isVisible ? src : undefined}
        poster={fallback || undefined}
        loop
        muted
        playsInline
        preload="metadata"
        className={className}
      />
    );
  }

  if (isGifThumbnail(src)) {
    return (
      <img
        ref={ref}
        src={isVisible ? src : transparentPixel}
        alt=""
        loading="lazy"
        className={className}
      />
    );
  }

  return <img ref={ref} src={src} alt="" loading="lazy" className={className} />;
}

function BlogPostRow({ post, index, locale, labels }) {
  const thumbnail = getPostThumbnail(post);
  const fallbackThumbnail = getPostThumbnailFallback(post);
  const dateLabel = post.published_at ? formatDate(post.published_at, locale) : post.source;
  const rowContent = (
    <>
      <div className="absolute inset-y-0 right-0 w-[48%] bg-surface opacity-80 transition duration-500 group-hover:opacity-100 sm:w-[42%]">
        {thumbnail ? (
          <LazyCardThumbnail src={thumbnail} fallback={fallbackThumbnail} />
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
  const { content, language, languageMeta } = useI18n();
  const { ui } = content;
  const [state, setState] = useState({ loading: true, posts: [], configured: true });
  const [selectedCategory, setSelectedCategory] = useState("all");
  const isPreview = mode === "preview";
  const posts = sortPostsForIndex([...externalBlogPosts, ...state.posts]);
  const specialPosts = sortSpecialPosts(posts);
  const categories = useMemo(() => {
    return categoryFilters.filter((category) =>
      posts.some((post) => postMatchesCategory(post, category))
    );
  }, [posts]);
  const selectedFilter = categories.find((category) => category.key === selectedCategory);
  const filteredPosts =
    selectedCategory === "all"
      ? posts
      : posts.filter((post) => selectedFilter && postMatchesCategory(post, selectedFilter));
  const visiblePosts = isPreview
    ? (specialPosts.length > 0 ? specialPosts : posts).slice(0, 3)
    : filteredPosts;

  useEffect(() => {
    if (selectedCategory !== "all" && !selectedFilter) {
      setSelectedCategory("all");
    }
  }, [selectedCategory, selectedFilter]);

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
          <>
            {!isPreview && categories.length > 0 && (
              <div className="mb-8 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedCategory("all")}
                  className={`rounded-full border px-4 py-2 text-sm font-bold transition ${
                    selectedCategory === "all"
                      ? "border-simple bg-simple text-ink"
                      : "border-line bg-card text-muted hover:border-simple/60 hover:text-white"
                  }`}
                >
                  {allCategoryLabels[language] ?? allCategoryLabels.en}
                </button>
                {categories.map((category) => (
                  <button
                    key={category.key}
                    type="button"
                    onClick={() => setSelectedCategory(category.key)}
                    className={`rounded-full border px-4 py-2 text-sm font-bold transition ${
                      selectedCategory === category.key
                        ? "border-simple bg-simple text-ink"
                        : "border-line bg-card text-muted hover:border-simple/60 hover:text-white"
                    }`}
                  >
                    {category.labels[language] ?? category.labels.en}
                  </button>
                ))}
              </div>
            )}

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
          </>
        )}
      </div>
    </section>
  );
}
