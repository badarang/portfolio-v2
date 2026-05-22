import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useI18n } from "../i18n";

export default function Navbar() {
  const { content, language, languages, setLanguage } = useI18n();
  const { profile, ui } = content;
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [theme, setTheme] = useState(() => {
    if (typeof window === "undefined") return "dark";
    return (
      window.localStorage.getItem("theme") ||
      document.documentElement.dataset.theme ||
      "dark"
    );
  });
  const location = useLocation();
  const navigate = useNavigate();
  const onHome = location.pathname === "/";
  const links = [
    { id: "career", label: ui.nav.career },
    { path: "/blog", label: ui.nav.blog },
    { id: "activities", label: ui.nav.activities },
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    window.localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((current) => (current === "dark" ? "light" : "dark"));
  };

  // 홈에 있으면 해당 섹션으로 스크롤, 아니면 홈으로 이동 후 스크롤.
  const goToSection = (id) => {
    setOpen(false);
    if (onHome) {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    } else {
      navigate(`/#${id}`);
    }
  };

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled || open
          ? "border-b border-line bg-surface shadow-card"
          : "border-b border-transparent"
      }`}
    >
      <nav className="container-px flex h-16 items-center justify-between">
        <Link
          to="/"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="group flex min-w-0 shrink-0 items-center gap-2.5"
        >
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-white/15 bg-white shadow-[0_0_22px_rgba(34,211,238,0.2)]">
            <img
              src="/icons/badarang-runner.png"
              alt=""
              aria-hidden="true"
              className="h-7 w-7 object-contain"
            />
          </span>
          <span className="flex min-w-0 items-center gap-2">
            <span className="font-display text-lg font-bold text-white">
              {profile.name}
            </span>
          </span>
        </Link>

        <ul className="hidden min-w-0 items-center gap-3 lg:flex">
          {links.map((l) => (
            <li key={l.id || l.path} className="flex items-center gap-3">
              {l.path ? (
                <button
                  onClick={() => {
                    setOpen(false);
                    navigate(l.path);
                  }}
                  className="whitespace-nowrap text-sm font-medium text-soft transition-colors hover:text-white"
                >
                  {l.label}
                </button>
              ) : (
                <button
                  onClick={() => goToSection(l.id)}
                  className="whitespace-nowrap text-sm font-medium text-soft transition-colors hover:text-white"
                >
                  {l.label}
                </button>
              )}
              <span className="text-line">|</span>
            </li>
          ))}
          <li className="flex items-center gap-3">
            <a
              href={profile.links.linkedin}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 whitespace-nowrap text-sm font-medium text-soft transition-colors hover:text-white"
            >
              <span
                aria-hidden="true"
                className="grid h-4 w-4 place-items-center rounded-[3px] bg-[#0A66C2] text-[0.62rem] font-black leading-none text-white"
              >
                in
              </span>
              LinkedIn
            </a>
            <span className="text-line">|</span>
          </li>
          <li className="flex items-center gap-3">
            <a
              href={profile.links.github}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 whitespace-nowrap text-sm font-medium text-soft transition-colors hover:text-white"
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
            <span className="text-line">|</span>
          </li>
          <li className="flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className="grid h-9 w-9 place-items-center rounded-full border border-line bg-card text-soft transition hover:border-simple hover:text-white"
              aria-label={theme === "dark" ? ui.theme.light : ui.theme.dark}
              title={theme === "dark" ? ui.theme.light : ui.theme.dark}
            >
              {theme === "dark" ? (
                <svg
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                  className="h-[18px] w-[18px]"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                >
                  <circle cx="12" cy="12" r="4" />
                  <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
                </svg>
              ) : (
                <svg
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                  className="h-[18px] w-[18px]"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                >
                  <path d="M20.5 14.5A8.5 8.5 0 0 1 9.5 3.5 7 7 0 1 0 20.5 14.5Z" />
                </svg>
              )}
            </button>
            <span className="text-line">|</span>
          </li>
          <li className="flex items-center gap-3">
            <div className="flex rounded-full border border-line bg-card p-1">
              {languages.map((item) => (
                <button
                  key={item.code}
                  type="button"
                  onClick={() => setLanguage(item.code)}
                  className={`h-7 min-w-8 rounded-full px-2 text-[0.68rem] font-black transition ${
                    language === item.code
                      ? "bg-white text-ink"
                      : "text-muted hover:text-white"
                  }`}
                  aria-label={`${ui.language}: ${item.label}`}
                >
                  {item.short}
                </button>
              ))}
            </div>
            <span className="text-line">|</span>
          </li>
          <li>
            <button
              onClick={() => goToSection("contact")}
              className="whitespace-nowrap rounded-full bg-white px-4 py-1.5 text-sm font-semibold text-ink transition hover:bg-hook hover:text-white"
            >
              {ui.nav.contact}
            </button>
          </li>
        </ul>

        <button
          className="lg:hidden"
          aria-label="menu"
          onClick={() => setOpen((v) => !v)}
        >
          <div className="space-y-1.5">
            <span className="block h-0.5 w-6 bg-strong" />
            <span className="block h-0.5 w-6 bg-strong" />
            <span className="block h-0.5 w-4 bg-strong" />
          </div>
        </button>
      </nav>

      {open && (
        <div className="max-h-[calc(100dvh-4rem)] overflow-y-auto border-t border-line bg-surface px-6 py-5 shadow-card lg:hidden">
          <ul className="flex flex-col gap-4 text-base font-semibold">
            {links.map((l) => (
              <li key={l.id || l.path}>
                {l.path ? (
                  <button
                    onClick={() => {
                      setOpen(false);
                      navigate(l.path);
                    }}
                    className="text-strong hover:text-simple"
                  >
                    {l.label}
                  </button>
                ) : (
                  <button
                    onClick={() => goToSection(l.id)}
                    className="text-strong hover:text-simple"
                  >
                    {l.label}
                  </button>
                )}
              </li>
            ))}
            <li>
              <a
                href={profile.links.linkedin}
                target="_blank"
                rel="noreferrer"
                onClick={() => setOpen(false)}
                className="inline-flex items-center gap-2 text-strong hover:text-simple"
              >
                <span
                  aria-hidden="true"
                  className="grid h-4 w-4 place-items-center rounded-[3px] bg-[#0A66C2] text-[0.62rem] font-black leading-none text-white"
                >
                  in
                </span>
                LinkedIn
              </a>
            </li>
            <li>
              <a
                href={profile.links.github}
                target="_blank"
                rel="noreferrer"
                onClick={() => setOpen(false)}
                className="inline-flex items-center gap-2 text-strong hover:text-simple"
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
            </li>
            <li>
              <button
                onClick={toggleTheme}
                className="inline-flex items-center gap-2 text-strong hover:text-simple"
              >
                {theme === "dark" ? (
                  <svg
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                  >
                    <circle cx="12" cy="12" r="4" />
                    <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
                  </svg>
                ) : (
                  <svg
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                  >
                    <path d="M20.5 14.5A8.5 8.5 0 0 1 9.5 3.5 7 7 0 1 0 20.5 14.5Z" />
                  </svg>
                )}
                {theme === "dark" ? ui.theme.light : ui.theme.dark}
              </button>
            </li>
            <li>
              <div className="flex w-fit rounded-full border border-line bg-card p-1">
                {languages.map((item) => (
                  <button
                    key={item.code}
                    type="button"
                    onClick={() => setLanguage(item.code)}
                    className={`h-8 min-w-9 rounded-full px-2 text-xs font-black transition ${
                      language === item.code
                        ? "bg-white text-ink"
                        : "text-muted hover:text-white"
                    }`}
                    aria-label={`${ui.language}: ${item.label}`}
                  >
                    {item.short}
                  </button>
                ))}
              </div>
            </li>
            <li>
              <button
                onClick={() => goToSection("contact")}
                className="text-strong hover:text-simple"
              >
                {ui.nav.contact}
              </button>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
