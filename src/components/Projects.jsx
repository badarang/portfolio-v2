import { motion } from "framer-motion";
import { useState } from "react";
import { useI18n } from "../i18n";
import SectionHeader from "./SectionHeader";
import Reveal from "./Reveal";
import MediaWindow from "./MediaWindow";

function TiltedCard({ children, className = "" }) {
  const [style, setStyle] = useState({});

  const onMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setStyle({
      transform: `perspective(1200px) rotateX(${(-y * 4).toFixed(2)}deg) rotateY(${(x * 5).toFixed(2)}deg) translateY(-4px)`,
    });
  };

  return (
    <motion.div
      onMouseMove={onMove}
      onMouseLeave={() => setStyle({})}
      style={style}
      className={`transition-transform duration-200 ease-out will-change-transform ${className}`}
    >
      {children}
    </motion.div>
  );
}

function ProjectCard({ p, big = false }) {
  return (
    <motion.a
      href={p.link}
      target="_blank"
      rel="noreferrer"
      whileHover={{ y: -6 }}
      className="card-surface group block overflow-hidden"
    >
      <div className={`relative overflow-hidden bg-ink ${big ? "aspect-[16/10]" : "aspect-video"}`}>
        <img
          src={p.image}
          alt={p.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-transparent to-transparent" />
        {p.badge && (
          <span className="absolute left-3 top-3 rounded-full bg-ink/80 px-3 py-1 text-xs font-semibold text-juicy backdrop-blur">
            {p.badge}
          </span>
        )}
      </div>
      <div className="relative -mt-px bg-card p-5">
        <h3 className={`font-display font-bold text-white ${big ? "text-2xl" : "text-lg"}`}>
          {p.name}
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-muted line-clamp-2">
          {p.desc}
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {p.tags.map((t) => (
            <span key={t} className="text-xs font-medium text-simple">
              #{t}
            </span>
          ))}
        </div>
      </div>
    </motion.a>
  );
}

function FeaturedProject({ p, index, labels }) {
  const isSteam = p.platform === "Steam";
  const isYouTube = p.platform === "YouTube";
  const mainIcon = isSteam
    ? "https://cdn.simpleicons.org/steam/111111"
    : isYouTube
      ? "https://cdn.simpleicons.org/youtube/FF0033"
      : null;

  return (
    <TiltedCard className="dark-panel card-surface group overflow-hidden">
      <div className="grid gap-0 lg:grid-cols-[0.92fr_1.08fr]">
        <div className="relative flex min-h-[320px] flex-col justify-between overflow-hidden border-b border-line/70 bg-card p-6 sm:p-7 lg:border-b-0 lg:border-r">
          <img
            src={p.image}
            alt=""
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-[0.1] grayscale transition duration-500 group-hover:opacity-[0.16]"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-card via-card/92 to-card/70" />

          <div className="relative z-10">
            <div className="mb-6 flex items-center justify-between gap-4">
              <span className="font-mono text-xs font-bold text-muted">
                Featured 0{index + 1}
              </span>
              {p.badge && (
                <span className="rounded-full border border-simple/30 bg-simple/[0.08] px-3 py-1 text-xs font-bold text-simple">
                  {p.badge}
                </span>
              )}
            </div>

            <h3 className="font-display text-3xl font-bold leading-tight text-white sm:text-4xl">
              {p.name}
            </h3>
            {p.period && (
              <p className="mt-2 text-sm font-semibold text-muted">
                {p.period}
              </p>
            )}
            {p.desc && (
              <p className="mt-4 max-w-xl text-base leading-relaxed text-soft">
                {p.desc}
              </p>
            )}

            {p.highlights?.length > 0 && (
              <ul className="mt-6 grid gap-3 text-base font-semibold leading-relaxed text-soft">
                {p.highlights.map((item) => (
                  <li
                    key={typeof item === "string" ? item : `${item.metric}-${item.text}`}
                    className="flex gap-3"
                  >
                    <span className="mt-[0.6em] h-2 w-2 shrink-0 rounded-full bg-gold shadow-[0_0_14px_rgba(251,191,36,0.65)]" />
                    {typeof item === "string" ? (
                      <span>{item}</span>
                    ) : (
                      <span>
                        <strong className="mr-2 text-lg font-black text-gold">{item.metric}</strong>
                        {item.text}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            )}

            {p.tags.length > 0 && (
              <div className="mt-5 flex flex-wrap gap-2">
                {p.tags.map((t) => (
                  <span
                    key={t}
                    className="rounded-full border border-line bg-ink/45 px-3 py-1 text-xs font-bold text-simple"
                  >
                    #{t}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="relative z-10 mt-8 flex flex-wrap items-center gap-3">
            <a
              href={p.link}
              target="_blank"
              rel="noreferrer"
              className={`inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-bold transition ${
                isSteam
                  ? "bg-white text-ink hover:bg-simple"
                  : "border border-white/20 bg-white/[0.06] text-white hover:border-simple hover:text-simple"
              }`}
            >
              {mainIcon && (
                <img
                  src={mainIcon}
                  alt=""
                  aria-hidden="true"
                  className="h-4 w-4 shrink-0"
                />
              )}
              <span>{p.storeLabel || labels.open}</span>
              <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden>
                <path d="M14 3h7v7h-2V6.41l-9.29 9.3-1.42-1.42 9.3-9.29H14V3Z" />
                <path d="M5 5h6v2H7v10h10v-4h2v6H5V5Z" />
              </svg>
            </a>
            {p.secondaryLinks?.map((link) => (
              <a
                key={link.url}
                href={link.url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-4 py-2.5 text-sm font-bold text-muted transition hover:border-simple hover:text-simple"
              >
                <img
                  src="https://cdn.simpleicons.org/github/ffffff"
                  alt=""
                  aria-hidden="true"
                  className="h-4 w-4 shrink-0 opacity-85"
                />
                {link.label}
              </a>
            ))}
          </div>
        </div>

        <div className="bg-black/20 p-4 sm:p-5">
          <MediaWindow
            src={p.video || p.image}
            title={p.name}
            accent={index % 2 === 0 ? "hook" : "juicy"}
            variant="natural"
            thumbnailZoom={1.04}
          />
        </div>
      </div>
    </TiltedCard>
  );
}

export default function Projects() {
  const { content } = useI18n();
  const { projects, ui } = content;
  const featured = projects.filter((p) => p.featured);
  const rest = projects.filter((p) => !p.featured);

  return (
    <section id="projects" className="container-px py-24">
      <SectionHeader
        eyebrow={ui.projects.eyebrow}
        title={ui.projects.title}
      />

      <div className="mt-12 grid gap-6">
        {featured.map((p, i) => (
          <Reveal key={p.name} delay={i * 0.1}>
            <FeaturedProject p={p} index={i} labels={ui.projects} />
          </Reveal>
        ))}
      </div>

      <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {rest.map((p, i) => (
          <Reveal key={p.name} delay={(i % 3) * 0.06}>
            <ProjectCard p={p} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}
