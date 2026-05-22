import { useEffect, useRef, useState } from "react";
import { useI18n } from "../i18n";

// 미디어를 두 가지 스타일로 보여준다.
//  - variant="window"  : 글래스 윈도우 프레임(신호등 + 타이틀바)  ← Philosophy
//  - variant="natural" : 가장자리가 그라데이션으로 녹아드는 자연스러운 스타일 ← Professional
// src 종류 자동 판별: YouTube URL → 임베드(클릭 시 재생), .mp4 → 무음 자동재생, 그 외 → 이미지.
// MP4 는 화면에 보일 때만 로드·재생. YouTube 는 썸네일만 먼저 → 클릭 시 플레이어 로드(가장 가벼움).
const accentText = { hook: "text-hook", simple: "text-simple", juicy: "text-juicy" };
const accentRing = { hook: "from-hook/60", simple: "from-simple/60", juicy: "from-juicy/60" };
const accentGlow = { hook: "bg-hook/25", simple: "bg-simple/25", juicy: "bg-juicy/25" };
// 썸네일이 없을 때(일부공개 등) 보여줄 액센트 커버
const accentCover = {
  hook: "from-hook/40 via-hook/10 to-ink",
  simple: "from-simple/40 via-simple/10 to-ink",
  juicy: "from-juicy/40 via-juicy/10 to-ink",
};

const fadeMask =
  "radial-gradient(ellipse 92% 92% at 50% 50%, #000 68%, transparent 100%)";

function getYouTubeId(url) {
  if (!url) return null;
  const m = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([\w-]{11})/
  );
  return m ? m[1] : null;
}

export default function MediaWindow({
  src,
  title,
  accent = "simple",
  variant = "window",
  thumbnailZoom = 1.14,
  thumbnailPosition = "center center",
}) {
  const { content } = useI18n();
  const [failed, setFailed] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [thumbOk, setThumbOk] = useState(true);
  const [thumbType, setThumbType] = useState("maxresdefault");
  const videoRef = useRef(null);
  const ytId = getYouTubeId(src);
  const isYouTube = Boolean(ytId);
  const isVideo = !isYouTube && src && src.toLowerCase().endsWith(".mp4");
  const text = accentText[accent] ?? accentText.simple;
  const ring = accentRing[accent] ?? accentRing.simple;
  const glow = accentGlow[accent] ?? accentGlow.simple;
  const cover = accentCover[accent] ?? accentCover.simple;
  const thumbSrc = ytId
    ? `https://i.ytimg.com/vi/${ytId}/${thumbType}.jpg`
    : "";

  useEffect(() => {
    const el = videoRef.current;
    if (!el || !isVideo) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (el.preload !== "auto") el.preload = "auto";
          el.play().catch(() => {});
        } else {
          el.pause();
        }
      },
      { threshold: 0.25 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [isVideo, src]);

  const inner = (objectClass) => {
    if (!src || failed) {
      return (
        <span className="text-center text-sm text-muted">
          {content.ui.media.placeholder}
          <br />
          <code className="text-xs text-soft">{src}</code>
        </span>
      );
    }
    if (isYouTube) {
      return playing ? (
        <iframe
          className="h-full w-full"
          src={`https://www.youtube.com/embed/${ytId}?autoplay=1&mute=1&rel=0&playsinline=1`}
          title={title || "video"}
          allow="autoplay; encrypted-media; picture-in-picture"
          allowFullScreen
        />
      ) : (
        <button
          type="button"
          onClick={() => setPlaying(true)}
          className="group relative h-full w-full"
          aria-label={content.ui.media.playVideo}
        >
          {thumbOk ? (
            <img
              src={thumbSrc}
              // 일부공개 등으로 썸네일이 없으면 YouTube 가 120×90 회색 placeholder 를 반환(HTTP 200).
              // naturalWidth 로 감지해 액센트 커버로 대체한다.
              onLoad={(e) => {
                if (e.currentTarget.naturalWidth <= 120) {
                  if (thumbType === "maxresdefault") {
                    setThumbType("hqdefault");
                  } else {
                    setThumbOk(false);
                  }
                }
              }}
              onError={() => {
                if (thumbType === "maxresdefault") {
                  setThumbType("hqdefault");
                } else {
                  setThumbOk(false);
                }
              }}
              alt=""
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-500"
              style={{
                objectPosition: thumbnailPosition,
                transform: `scale(${thumbnailZoom})`,
              }}
            />
          ) : (
            <div className={`h-full w-full bg-gradient-to-br ${cover}`} />
          )}
          <span className="absolute inset-0 grid place-items-center bg-black/20 transition group-hover:bg-black/35">
            <span className="grid h-16 w-16 place-items-center rounded-full bg-white/90 shadow-lg transition group-hover:scale-110">
              <svg viewBox="0 0 24 24" className="ml-1 h-6 w-6 fill-ink">
                <path d="M8 5v14l11-7z" />
              </svg>
            </span>
          </span>
        </button>
      );
    }
    if (isVideo) {
      return (
        <video
          ref={videoRef}
          src={src}
          loop
          muted
          playsInline
          preload="none"
          onError={() => setFailed(true)}
          className={`h-full w-full ${objectClass}`}
        />
      );
    }
    return (
      <img
        src={src}
        alt=""
        loading="lazy"
        onError={() => setFailed(true)}
        className={`h-full w-full ${objectClass}`}
      />
    );
  };

  // 자연스러운 스타일: 프레임 없이 가장자리가 배경에 녹아듦
  if (variant === "natural") {
    return (
      <div className="relative w-full">
        <div className={`absolute inset-6 -z-10 rounded-[2rem] blur-3xl ${glow}`} />
        <div
          className="grid aspect-video place-items-center overflow-hidden rounded-2xl"
          style={{ WebkitMaskImage: fadeMask, maskImage: fadeMask }}
        >
          {inner("object-cover")}
        </div>
      </div>
    );
  }

  // 글래스 윈도우 스타일
  return (
    <div className="relative w-full">
      <div className={`absolute inset-4 -z-10 rounded-3xl blur-3xl ${glow}`} />
      <div className={`rounded-2xl bg-gradient-to-br ${ring} via-white/10 to-transparent p-px shadow-glow`}>
        <div className="overflow-hidden rounded-[15px] border border-white/5 bg-ink/70 backdrop-blur-sm">
          <div className="flex items-center justify-between border-b border-white/10 bg-white/[0.04] px-4 py-2.5">
            <div className="flex items-center gap-1.5">
              <span className="h-3 w-3 rounded-full bg-hook" />
              <span className="h-3 w-3 rounded-full bg-simple" />
              <span className="h-3 w-3 rounded-full bg-juicy" />
            </div>
            {title && (
              <span className={`font-mono text-xs font-semibold ${text}`}>
                {title} <span className="opacity-60">▸</span>
              </span>
            )}
          </div>
          <div className="grid aspect-video place-items-center bg-black/40">
            {inner("object-contain")}
          </div>
        </div>
      </div>
    </div>
  );
}
