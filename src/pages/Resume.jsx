import { useEffect, useMemo, useState } from "react";
import { useI18n } from "../i18n";

/**
 * Resume viewer page.
 *
 * Loads a standalone resume HTML file (with its own light theme, fonts,
 * and F2 → PDF export script) inside an iframe. The file shown depends on
 * the active i18n language:
 *   ko          → /resume/ko.html
 *   en/zh/ja    → /resume/en.html  (English version, used as fallback)
 *
 * Visual goal: the A4 paper floats on the dark canvas with no wrapper
 * surface around it. To achieve that:
 *   - The iframe document declares its body transparent.
 *   - When it detects it's inside a parent (window.parent !== window) it
 *     posts its content height via window.postMessage so we can resize
 *     the iframe to fit exactly — no internal scrollbar.
 *   - We can also tell it to run its F2 export through postMessage
 *     ({ type: "export-pdf" }) so the toolbar Download button just works.
 */
export default function Resume() {
  const { language, setLanguage, content } = useI18n();
  const { ui } = content;

  // ko gets its own file; everything else falls back to en.
  const resumeLang = language === "ko" ? "ko" : "en";
  const resumeSrc = `/resume/${resumeLang}.html`;

  const labels = useMemo(() => {
    switch (language) {
      case "ko":
        return { title: "이력서", download: "PDF 다운로드" };
      case "zh":
        return { title: "简历", download: "下载 PDF" };
      case "ja":
        return { title: "履歴書", download: "PDF をダウンロード" };
      default:
        return { title: "Resume", download: "Download PDF" };
    }
  }, [language]);

  // Reset scroll when opening the page.
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  // Bust the iframe cache when switching language so the right doc loads.
  const [reloadKey, setReloadKey] = useState(0);
  useEffect(() => {
    setReloadKey((value) => value + 1);
  }, [resumeLang]);

  // Dynamic height driven by the iframe document (no internal scrollbar).
  const [frameHeight, setFrameHeight] = useState(1280);

  useEffect(() => {
    const onMessage = (event) => {
      if (!event?.data || event.data.type !== "resume-height") return;
      const next = Number(event.data.height);
      if (Number.isFinite(next) && next > 200) {
        setFrameHeight(Math.ceil(next + 48));
      }
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  // Tell the iframe to run its bundled PDF export.
  const triggerDownload = () => {
    const iframe = document.getElementById("resume-frame");
    iframe?.contentWindow?.postMessage({ type: "export-pdf" }, "*");
  };

  return (
    <div className="min-h-screen bg-ink pb-16 pt-24 sm:pt-28">
      <div className="container-px">
        {/* Header / toolbar */}
        <div className="mb-6 flex flex-col gap-4 sm:mb-10 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.32em] text-simple">
              {labels.title}
            </p>
            <h1 className="mt-2 font-display text-3xl font-bold text-white sm:text-4xl">
              {language === "ko"
                ? "오해인 · 게임플레이 프로그래머"
                : "Haein Oh · Rapid Gameplay Programmer"}
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="flex rounded-full border border-line bg-card p-1">
              <button
                type="button"
                onClick={() => setLanguage("ko")}
                className={`h-8 rounded-full px-3 text-xs font-bold transition ${
                  resumeLang === "ko"
                    ? "bg-white text-ink"
                    : "text-muted hover:text-white"
                }`}
              >
                한국어
              </button>
              <button
                type="button"
                onClick={() => setLanguage("en")}
                className={`h-8 rounded-full px-3 text-xs font-bold transition ${
                  resumeLang === "en"
                    ? "bg-white text-ink"
                    : "text-muted hover:text-white"
                }`}
              >
                English
              </button>
            </div>

            <button
              type="button"
              onClick={triggerDownload}
              className="inline-flex h-9 items-center gap-2 rounded-full bg-white px-4 text-xs font-semibold text-ink transition hover:bg-hook hover:text-white"
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
                <path d="M12 3v12" />
                <path d="M7 10l5 5 5-5" />
                <path d="M5 21h14" />
              </svg>
              {labels.download}
            </button>
          </div>
        </div>

        {/* A4 paper floating on the dark canvas — iframe has no wrapper bg. */}
        <iframe
          key={reloadKey}
          id="resume-frame"
          src={resumeSrc}
          title={labels.title}
          scrolling="no"
          allowTransparency="true"
          className="block w-full"
          style={{
            border: 0,
            background: "transparent",
            colorScheme: "light",
            height: frameHeight,
          }}
        />
      </div>
    </div>
  );
}
