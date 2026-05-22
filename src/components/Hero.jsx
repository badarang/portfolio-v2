import { Suspense, lazy, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useI18n } from "../i18n";
import Waves from "./Waves";
import FloatingIcons from "./FloatingIcons";
import heroPreview from "../assets/project/project21.png";

// 3D 캔버스는 무거우니 lazy-load — 첫 페인트를 막지 않게.
const Computers3D = lazy(() => import("./canvas/Computers3D"));

const accentFor = {
  Fun: "text-hook",
  Fast: "text-simple",
  Juicy: "text-juicy",
};

export default function Hero() {
  const { content } = useI18n();
  const { profile, ui } = content;
  const [wordIndex, setWordIndex] = useState(0);
  const [useLightHero, setUseLightHero] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(max-width: 767px), (pointer: coarse)").matches;
  });
  const activeWord = profile.slogan[wordIndex];

  useEffect(() => {
    const timer = window.setInterval(() => {
      setWordIndex((current) => (current + 1) % profile.slogan.length);
    }, 1000);

    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px), (pointer: coarse)");
    const update = () => setUseLightHero(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const scrollTo = (id) =>
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <section className="relative flex min-h-screen items-start overflow-hidden bg-ink lg:items-center">
      {/* 감각적 배경: 그라데이션 글로우 + 그리드 */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -left-32 top-20 h-96 w-96 rounded-full bg-hook/20 blur-[120px]" />
        <div className="absolute right-0 top-40 h-96 w-96 rounded-full bg-simple/20 blur-[120px]" />
        <div className="absolute bottom-0 left-1/3 h-80 w-80 rounded-full bg-juicy/10 blur-[120px]" />
        <div className="absolute left-1/2 top-1/2 h-[34rem] w-[54rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-simple/[0.06] blur-[150px]" />
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
      </div>

      {/* 배경 파도 + 둥둥 떠다니는 아이콘 */}
      <Waves />
      <FloatingIcons />
      <div className="hero-scanlines pointer-events-none absolute inset-0 z-[1]" />

      <div className="container-px relative z-10 grid min-h-screen items-start gap-8 pb-20 pt-28 sm:py-28 lg:grid-cols-2 lg:items-center lg:pb-36 lg:pt-20">
        {/* 좌측: 카피 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="hero-type relative z-20 flex w-[76%] min-w-0 flex-col items-start gap-4 sm:w-full sm:gap-6"
        >
          <span className="inline-flex items-center gap-2.5 rounded-full border border-white/15 bg-white/[0.07] px-2.5 py-2 pr-4 text-xs font-bold text-white shadow-glow backdrop-blur sm:text-base">
            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-white shadow-[0_0_18px_rgba(255,255,255,0.25)]">
              <img
                src="/icons/badarang-runner.png"
                alt=""
                aria-hidden="true"
                className="h-6 w-6 object-contain"
              />
            </span>
            {profile.role}
          </span>

          <h1 className="font-display font-bold leading-[0.9] tracking-normal text-white">
            <span className="block whitespace-nowrap text-[clamp(3rem,13vw,7.75rem)]">
              {profile.realName}
            </span>
            <span className="mt-3 block whitespace-nowrap text-[clamp(2rem,8.6vw,5.85rem)] xs:text-[clamp(2.4rem,8.4vw,5.85rem)]">
              Make It{" "}
              <motion.span
                key={activeWord}
                data-text={activeWord}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.18 }}
                className={`change-glitch relative inline-block min-w-[5.1ch] ${accentFor[activeWord]}`}
              >
                {activeWord}
              </motion.span>
            </span>
          </h1>

          <div className="relative max-w-3xl text-base font-semibold leading-7 text-white sm:text-xl sm:leading-9">
            <ul className="space-y-1.5">
              {ui.hero.bullets.map((item) => (
                <li key={item} className="flex items-center gap-2.5">
                  <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-simple" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-2 grid w-full max-w-[44rem] grid-cols-2 gap-3 sm:flex sm:w-auto sm:max-w-none sm:flex-nowrap">
            <button
              onClick={() => scrollTo("career")}
              className="inline-flex min-h-12 items-center justify-center whitespace-nowrap rounded-full bg-white px-5 py-3 text-sm font-semibold text-ink transition hover:bg-hook hover:text-white sm:min-w-[9.5rem] sm:px-6"
            >
              {ui.hero.primary}
            </button>
            <a
              href={profile.links.linkedin}
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-12 items-center justify-center gap-2 whitespace-nowrap rounded-full border border-line px-5 py-3 text-sm font-semibold text-soft transition hover:border-[#0A66C2] hover:text-white sm:min-w-[8.25rem] sm:px-6"
            >
              <span
                aria-hidden="true"
                className="grid h-4 w-4 place-items-center rounded-[3px] bg-[#0A66C2] text-[0.62rem] font-black leading-none text-white"
              >
                in
              </span>
              LinkedIn
            </a>
            <a
              href={profile.links.github}
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-12 items-center justify-center gap-2 whitespace-nowrap rounded-full border border-line px-5 py-3 text-sm font-semibold text-soft transition hover:border-white hover:text-white sm:min-w-[8.25rem] sm:px-6"
            >
              <svg
                viewBox="0 0 24 24"
                aria-hidden="true"
                className="h-4 w-4 fill-current"
              >
                <path d="M12 .5a12 12 0 0 0-3.79 23.39c.6.11.82-.26.82-.58v-2.03c-3.34.73-4.04-1.41-4.04-1.41-.55-1.38-1.33-1.75-1.33-1.75-1.09-.75.08-.73.08-.73 1.2.08 1.84 1.24 1.84 1.24 1.07 1.83 2.8 1.3 3.49.99.11-.77.42-1.3.76-1.6-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.12-.3-.54-1.53.12-3.18 0 0 1.01-.32 3.3 1.23a11.45 11.45 0 0 1 6 0c2.29-1.55 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.77.84 1.23 1.91 1.23 3.22 0 4.61-2.81 5.63-5.49 5.93.43.37.81 1.1.81 2.22v3.29c0 .32.22.7.83.58A12 12 0 0 0 12 .5Z" />
              </svg>
              GitHub
            </a>
            <button
              onClick={() => scrollTo("contact")}
              className="inline-flex min-h-12 items-center justify-center whitespace-nowrap rounded-full border border-line px-5 py-3 text-sm font-semibold text-soft transition hover:border-white hover:text-white sm:min-w-[8.25rem] sm:px-6"
            >
              {ui.nav.contact}
            </button>
          </div>
        </motion.div>

        {/* 우측: 3D 모델 */}
        <div className="hero-model-shell pointer-events-none absolute bottom-[10%] right-[2%] z-10 h-[38vh] w-[88%] sm:pointer-events-auto sm:relative sm:bottom-auto sm:right-auto sm:h-[460px] sm:w-full lg:h-[600px]">
          <div className="pointer-events-none absolute left-1/2 top-1/2 h-[78%] w-[88%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-simple/[0.14] blur-[90px]" />
          <div className="pointer-events-none absolute bottom-[14%] left-[10%] h-20 w-[78%] rounded-full bg-hook/[0.16] blur-[55px]" />
          {useLightHero ? (
            <MobileHeroScene image={heroPreview} />
          ) : (
            <Suspense
              fallback={
                <div className="grid h-full place-items-center text-sm text-muted">
                  <span className="animate-pulse">{ui.hero.loading3d}</span>
                </div>
              }
            >
              <Computers3D />
            </Suspense>
          )}
        </div>
      </div>

      {/* 스크롤 유도 */}
      <button
        onClick={() => scrollTo("philosophy")}
        className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2"
        aria-label={ui.hero.scrollDown}
      >
        <div className="flex h-10 w-6 items-start justify-center rounded-full border-2 border-line p-1.5">
          <motion.span
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="h-1.5 w-1.5 rounded-full bg-muted"
          />
        </div>
      </button>
    </section>
  );
}

function MobileHeroScene({ image }) {
  return (
    <div className="mobile-hero-scene" aria-hidden="true">
      <div className="mobile-hero-desk">
        <div className="mobile-hero-monitor">
          <img src={image} alt="" loading="eager" decoding="async" />
        </div>
        <div className="mobile-hero-keyboard" />
        <div className="mobile-hero-pad" />
        <img
          src="/icons/badarang-runner.png"
          alt=""
          className="mobile-hero-character"
          loading="eager"
          decoding="async"
        />
      </div>
    </div>
  );
}
