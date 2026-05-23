import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useI18n } from "../i18n";
import Waves from "./Waves";
import FloatingIcons from "./FloatingIcons";
import { scrollToSection } from "../lib/scrollToSection";

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
  const [isMobile, setIsMobile] = useState(false);
  const [shouldMount3d, setShouldMount3d] = useState(false);
  const modelShellRef = useRef(null);
  const activeWord = profile.slogan[wordIndex];

  useEffect(() => {
    const timer = window.setInterval(() => {
      setWordIndex((current) => (current + 1) % profile.slogan.length);
    }, 1000);

    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 768px)");
    setIsMobile(mq.matches);
    const onChange = (e) => setIsMobile(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    if (isMobile) {
      setShouldMount3d(false);
      return undefined;
    }

    if (shouldMount3d) return undefined;

    const target = modelShellRef.current;
    if (!target) return undefined;

    let timeoutId;
    let idleId;
    const scheduleMount = () => {
      if (shouldMount3d) return;
      if ("requestIdleCallback" in window) {
        idleId = window.requestIdleCallback(() => setShouldMount3d(true), {
          timeout: 1200,
        });
      } else {
        timeoutId = window.setTimeout(() => setShouldMount3d(true), 350);
      }
    };

    if (!("IntersectionObserver" in window)) {
      scheduleMount();
      return () => {
        window.clearTimeout(timeoutId);
        if (idleId && "cancelIdleCallback" in window) {
          window.cancelIdleCallback(idleId);
        }
      };
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          scheduleMount();
          observer.disconnect();
        }
      },
      { rootMargin: "160px 0px" }
    );

    observer.observe(target);

    return () => {
      observer.disconnect();
      window.clearTimeout(timeoutId);
      if (idleId && "cancelIdleCallback" in window) {
        window.cancelIdleCallback(idleId);
      }
    };
  }, [isMobile, shouldMount3d]);

  const scrollTo = (id) => scrollToSection(id);

  return (
    <section className="relative flex min-h-screen items-start overflow-hidden bg-ink lg:items-center">
      {/* 감각적 배경: 그라데이션 글로우 + 그리드 */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -left-32 top-20 hidden h-96 w-96 rounded-full bg-hook/20 blur-[120px] sm:block" />
        <div className="absolute right-0 top-40 hidden h-96 w-96 rounded-full bg-simple/20 blur-[120px] sm:block" />
        <div className="absolute bottom-0 left-1/3 hidden h-80 w-80 rounded-full bg-juicy/10 blur-[120px] sm:block" />
        <div className="absolute left-1/2 top-1/2 hidden h-[34rem] w-[54rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-simple/[0.06] blur-[150px] sm:block" />
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
      {!isMobile && <Waves />}
      {!isMobile && <FloatingIcons />}
      <div className="hero-scanlines pointer-events-none absolute inset-0 z-[1] hidden sm:block" />

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
                src="/icons/profile-haein.jpg"
                alt=""
                aria-hidden="true"
                className="h-full w-full rounded-full object-cover"
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

          <div className="mt-2 flex w-full max-w-[26rem] flex-col gap-2.5 sm:max-w-none">
            {/* Row 1: Primary CTA + social */}
            <div className="grid w-full grid-cols-3 gap-2 sm:flex sm:w-auto sm:flex-nowrap sm:gap-2.5">
              <button
                onClick={() => scrollTo("career")}
                className="hero-cta-3d hero-cta-primary col-span-3 inline-flex min-h-11 items-center justify-center whitespace-nowrap rounded-full px-4 text-[0.82rem] font-bold sm:col-span-1 xs:text-sm sm:min-w-[10rem] sm:px-6"
              >
                <span className="sm:hidden">{ui.hero.primaryMobile ?? ui.hero.primary}</span>
                <span className="hidden sm:inline">{ui.hero.primary}</span>
              </button>
              <a
                href={profile.links.linkedin}
                target="_blank"
                rel="noreferrer"
                className="hero-cta-3d hero-cta-ghost group inline-flex min-h-11 items-center justify-center gap-1.5 whitespace-nowrap rounded-full px-3 text-[0.78rem] font-semibold xs:text-sm sm:min-w-[8rem] sm:px-5"
              >
                <span
                  aria-hidden="true"
                  className="hero-linkedin-mark grid h-4 w-4 place-items-center rounded-[3px] bg-[#0A66C2] text-[0.6rem] font-black leading-none text-white"
                >
                  in
                </span>
                LinkedIn
              </a>
              <a
                href={profile.links.github}
                target="_blank"
                rel="noreferrer"
                className="hero-cta-3d hero-cta-ghost inline-flex min-h-11 items-center justify-center gap-1.5 whitespace-nowrap rounded-full px-3 text-[0.78rem] font-semibold xs:text-sm sm:min-w-[8rem] sm:px-5"
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
            </div>

            {/* Row 2: Resume + Contact */}
            <div className="grid w-full grid-cols-2 gap-2 sm:flex sm:w-auto sm:flex-nowrap sm:gap-2.5">
              <Link
                to="/resume"
                className="hero-cta-3d hero-cta-accent inline-flex min-h-11 items-center justify-center gap-1.5 whitespace-nowrap rounded-full px-3 text-[0.78rem] font-bold xs:text-sm sm:min-w-[8rem] sm:px-5"
              >
                <svg
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M7 3h7l5 5v13H7z" />
                  <path d="M14 3v5h5" />
                  <path d="M10 13h6M10 17h6" />
                </svg>
                {ui.nav.resume ?? "Resume"}
              </Link>
              <button
                onClick={() => scrollTo("contact")}
                className="hero-cta-3d hero-cta-ghost inline-flex min-h-11 items-center justify-center gap-1.5 whitespace-nowrap rounded-full px-3 text-[0.78rem] font-semibold xs:text-sm sm:min-w-[8rem] sm:px-5"
              >
                <svg
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M4 6h16v12H4z" />
                  <path d="M4 6l8 7 8-7" />
                </svg>
                {ui.nav.contact}
              </button>
            </div>
          </div>
        </motion.div>

        {/* 우측: 3D 모델 */}
        <div
          ref={modelShellRef}
          className="hero-model-shell pointer-events-none absolute bottom-[10%] right-[2%] z-10 h-[38vh] w-[88%] sm:pointer-events-auto sm:relative sm:bottom-auto sm:right-auto sm:h-[460px] sm:w-full lg:h-[600px]"
        >
          <div className="pointer-events-none absolute left-1/2 top-1/2 h-[58%] w-[70%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-simple/[0.08] blur-[42px] sm:h-[78%] sm:w-[88%] sm:bg-simple/[0.14] sm:blur-[90px]" />
          <div className="pointer-events-none absolute bottom-[14%] left-[10%] h-14 w-[60%] rounded-full bg-hook/[0.08] blur-[30px] sm:h-20 sm:w-[78%] sm:bg-hook/[0.16] sm:blur-[55px]" />
          {isMobile ? (
            <div className="absolute inset-0 flex items-center justify-end pr-2 opacity-90">
              <div className="relative h-24 w-32 rounded-2xl border border-white/10 bg-white/[0.06] shadow-glow backdrop-blur-md">
                <span className="absolute left-5 top-5 h-3 w-3 rounded-full bg-simple shadow-[0_0_18px_rgba(34,211,238,0.7)]" />
                <span className="absolute left-10 top-5 h-2 w-12 rounded-full bg-white/70" />
                <span className="absolute left-10 top-10 h-2 w-8 rounded-full bg-white/35" />
                <span className="absolute bottom-4 right-4 h-9 w-9 rounded-full border border-hook/40 bg-hook/15" />
              </div>
            </div>
          ) : shouldMount3d ? (
            <Suspense
              fallback={
                <div className="grid h-full place-items-center text-sm text-muted">
                  <span className="animate-pulse">{ui.hero.loading3d}</span>
                </div>
              }
            >
              <Computers3D />
            </Suspense>
          ) : null}
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
