import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useI18n } from "../i18n";
import SmashStage from "./next/SmashStage";
import { scrollToSection } from "../lib/scrollToSection";

// 메인 Hero.
// 직접 만든 게임의 영상이 배경에 은은하게 깔리고, 왼쪽은 그라디언트로 덮어 글이 읽히게 한다.

const accentFor = { Fun: "text-hook", Fast: "text-simple", Juicy: "text-juicy" };
const WORDS = ["Fun", "Fast", "Juicy"];

const copy = {
  ko: {
    eyebrow: "FOUNDER, A4Room | Game Builder",
    creds: [
      { name: "ex-Halfbrick", icon: "/companies/halfbrick.jpg" },
      { name: "ex-111%", icon: "/companies/111percent.svg" },
      { name: "OVERDARE", icon: "/companies/krafton.png", dark: true },
    ],
    note: "100만+ 다운로드 게임 라이브 서비스",
    primary: "A4Room 게임 보기",
    secondary: "여기까지 온 이야기",
    stage: {
      start: "Ready",
      alt: "스틱맨이 주먹, 망치, 칼, 총으로 벽을 부수는 흑백 픽셀 애니메이션",
      cleared: "Necro Rumble · Just a Game About Trolling",
      soundOn: "Sound on",
      soundOff: "Sound off",
    },
  },
  en: {
    eyebrow: "FOUNDER, A4Room | Game Builder",
    creds: [
      { name: "ex-Halfbrick", icon: "/companies/halfbrick.jpg" },
      { name: "ex-111%", icon: "/companies/111percent.svg" },
      { name: "OVERDARE", icon: "/companies/krafton.png", dark: true },
    ],
    note: "Live ops on a 1M+ download game",
    primary: "See A4Room games",
    secondary: "How I got here",
    stage: {
      start: "Ready",
      alt: "Black and white pixel animation of a stickman breaking a wall with fists, a hammer, a sword and guns",
      cleared: "Necro Rumble · Just a Game About Trolling",
      soundOn: "Sound on",
      soundOff: "Sound off",
    },
  },
};

// 글자 하나하나를 따로 감싸서 타격의 충격이 글자 단위로 전달되게 한다.
function Chars({ text, shotLast = false, step = false }) {
  const chars = [...text];
  return chars.map((ch, i) =>
    ch === " " ? (
      " "
    ) : (
      <span
        key={`${ch}-${i}`}
        data-jolt
        data-jolt-shot={shotLast && i === chars.length - 1 ? "" : undefined}
        data-jolt-step={step ? "" : undefined}
        className="inline-block"
      >
        {ch}
      </span>
    )
  );
}

export default function FounderHero() {
  const { language } = useI18n();
  const t = copy[language] ?? copy.en;
  const reduced = useReducedMotion();
  const videoRef = useRef(null);
  const [wordIndex, setWordIndex] = useState(0);
  const [videoReady, setVideoReady] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const word = WORDS[wordIndex];

  useEffect(() => {
    if (reduced) return undefined;
    const timer = window.setInterval(
      () => setWordIndex((i) => (i + 1) % WORDS.length),
      1000
    );
    return () => window.clearInterval(timer);
  }, [reduced]);

  // 화면 밖으로 나가면 영상을 멈춰 배터리와 CPU를 아낀다.
  useEffect(() => {
    const video = videoRef.current;
    if (!video || reduced || !("IntersectionObserver" in window)) return undefined;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) video.play().catch(() => {});
      else video.pause();
    });
    observer.observe(video);
    return () => observer.disconnect();
  }, [reduced]);

  const press = reduced
    ? {}
    : {
        whileTap: { scale: 0.92 },
        whileHover: { y: -3 },
        transition: { type: "spring", stiffness: 500, damping: 14 },
      };

  return (
    <section className="relative isolate min-h-screen overflow-hidden bg-[#0b0b0c] text-white">
      {/* 배경: 게임 영상 */}
      <div className="absolute inset-0 -z-10">
        <img
          src="/hero/reel-v2-poster.jpg"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover"
        />
        {!reduced && (
          <video
            ref={videoRef}
            src="/hero/reel-v2.mp4"
            poster="/hero/reel-v2-poster.jpg"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            aria-hidden="true"
            onCanPlay={() => setVideoReady(true)}
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${
              videoReady ? "opacity-100" : "opacity-0"
            }`}
          />
        )}
        {/* 전체를 살짝 가라앉히고, 글이 있는 쪽과 아래쪽을 어둡게 덮는다 */}
        <div
          className={`absolute inset-0 bg-[#0b0b0c] transition-opacity duration-700 ${
            revealed ? "opacity-20" : "opacity-[0.78]"
          }`}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0b0b0c]/85 via-[#0b0b0c]/60 to-[#0b0b0c]/40 lg:bg-gradient-to-r lg:from-[#0b0b0c] lg:via-[#0b0b0c]/70 lg:to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-56 bg-gradient-to-t from-[#0b0b0c] to-transparent" />
        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-[#0b0b0c]/90 to-transparent" />
      </div>

      {!reduced && (
        <SmashStage labels={t.stage} onReveal={setRevealed} />
      )}

      <div
        className="container-px relative z-10 flex min-h-screen flex-col justify-center pb-[23rem] pt-28 sm:pb-64 lg:pb-20"
      >
        <motion.div
          initial={reduced ? false : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.2, 0.8, 0.2, 1] }}
          className="min-w-0 max-w-2xl"
        >
          <p data-jolt="0.35" className="text-xs font-semibold tracking-[0.08em] text-white/60 sm:text-sm">
            {t.eyebrow}
          </p>

          <h1 className="mt-6 font-display font-bold leading-[0.92] tracking-tight">
            <span className="block whitespace-nowrap text-[clamp(3rem,7.4vw,6.6rem)]">
              <Chars text="Haein Oh" shotLast step />
            </span>
            <span className="mt-2 block whitespace-nowrap text-[clamp(2rem,6vw,4.6rem)]">
              <Chars text="Make It" />{" "}
              <span data-jolt className="inline-block">
              <motion.span
                key={word}
                data-text={word}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.18 }}
                className={`change-glitch relative inline-block min-w-[5.1ch] ${accentFor[word]}`}
              >
                {word}
              </motion.span>
              </span>
            </span>
          </h1>

          <ul className="mt-7 flex max-w-xl flex-wrap items-center gap-x-5 gap-y-2 text-sm font-semibold text-white/85 sm:text-base">
            {t.creds.map((c) => (
              <li key={c.name} data-jolt="0.6" className="flex items-center gap-2">
                <span
                  className={`grid h-6 w-6 shrink-0 place-items-center overflow-hidden rounded-md ${
                    c.dark ? "bg-black" : "bg-white"
                  }`}
                >
                  <img src={c.icon} alt="" className="h-full w-full object-contain" />
                </span>
                {c.name}
              </li>
            ))}
          </ul>
          <p data-jolt="0.5" className="mt-2 max-w-xl text-sm text-white/60 sm:text-base">
            {t.note}
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <span data-jolt="0.8" className="inline-block">
            <motion.a
              {...press}
              href="https://a4room.com"
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-12 items-center gap-2 rounded-full bg-white px-6 text-sm font-bold text-[#0b0b0c]"
            >
              {t.primary}
              <span aria-hidden="true">→</span>
            </motion.a>
            </span>
            <span data-jolt="0.8" className="inline-block">
            <motion.button
              {...press}
              type="button"
              onClick={() => scrollToSection("story")}
              className="inline-flex min-h-12 items-center rounded-full border border-white/25 bg-white/[0.06] px-6 text-sm font-bold text-white backdrop-blur-sm"
            >
              {t.secondary}
            </motion.button>
            </span>
          </div>

        </motion.div>
      </div>

    </section>
  );
}
