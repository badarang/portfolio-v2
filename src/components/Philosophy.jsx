import { motion } from "framer-motion";
import { useI18n } from "../i18n";
import SectionHeader from "./SectionHeader";
import Reveal from "./Reveal";
import MediaWindow from "./MediaWindow";
import project19 from "../assets/project/project19.png";
import project20 from "../assets/project/project20.png";
import project21 from "../assets/project/project21.png";
import project18 from "../assets/project/project18.png";
import project15 from "../assets/project/project15.png";
import fxPolish from "../assets/strength/fx-polish.png";
import optimization from "../assets/strength/optimization.png";

const accent = {
  hook: { text: "text-hook", num: "from-hook/30 text-hook" },
  simple: { text: "text-simple", num: "from-simple/30 text-simple" },
  juicy: { text: "text-juicy", num: "from-juicy/30 text-juicy" },
};

const strengthVisuals = [
  { image: project19, mode: "wide" },
  { logo: "https://cdn.simpleicons.org/unity/ffffff", mode: "logo" },
  { image: fxPolish },
  { image: project21 },
  { image: optimization },
  { image: project15 },
  { image: project18 },
];

function LineBreakText({ text }) {
  const lines = text.split("<br>");

  return lines.map((line, i) => (
    <span key={`${line}-${i}`}>
      {line}
      {i < lines.length - 1 && <br />}
    </span>
  ));
}

function ValueVfx({ type }) {
  if (type === "hook") {
    return (
      <div className="philosophy-vfx philosophy-vfx-hook" aria-hidden="true">
        <svg className="vfx-hook-svg" viewBox="0 0 96 150">
          <path className="vfx-hook-rope" d="M46 0 C46 32 48 54 46 78" />
          <path className="vfx-hook-shape" d="M46 77 C47 104 36 119 25 113 C15 108 17 92 29 91" />
          <path className="vfx-hook-point" d="M28 91 L42 94 L31 103" />
          <path className="vfx-hook-barb" d="M45 82 C53 88 60 90 68 87" />
        </svg>
      </div>
    );
  }

  if (type === "simple") {
    return (
      <div className="philosophy-vfx philosophy-vfx-simple" aria-hidden="true">
        <svg className="vfx-simple-symbol" viewBox="0 0 140 140">
          <rect className="vfx-simple-frame" x="38" y="38" width="64" height="64" rx="18" />
          <circle className="vfx-simple-core" cx="70" cy="70" r="9" />
          <path className="vfx-simple-corner vfx-simple-corner-a" d="M26 50 V30 H46" />
          <path className="vfx-simple-corner vfx-simple-corner-b" d="M94 30 H114 V50" />
          <path className="vfx-simple-corner vfx-simple-corner-c" d="M114 90 V110 H94" />
          <path className="vfx-simple-corner vfx-simple-corner-d" d="M46 110 H26 V90" />
        </svg>
      </div>
    );
  }

  return (
    <div className="philosophy-vfx philosophy-vfx-juicy" aria-hidden="true">
      <span className="vfx-juicy-ring vfx-juicy-ring-a" />
      <span className="vfx-juicy-ring vfx-juicy-ring-b" />
      <span className="vfx-juicy-bubble vfx-juicy-bubble-a" />
      <span className="vfx-juicy-bubble vfx-juicy-bubble-b" />
      <span className="vfx-juicy-bubble vfx-juicy-bubble-c" />
    </div>
  );
}

function PhilosophyRow({ p, index }) {
  const a = accent[p.accent];
  const textLeft = p.textSide === "left";

  const Text = (
    <div className={textLeft ? "lg:pr-6" : "lg:order-2 lg:pl-6"}>
      <div
        className={`mb-5 inline-grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br to-transparent font-display text-xl font-bold ${a.num}`}
      >
        {index + 1}
      </div>
      <h3 className={`font-display text-3xl font-bold sm:text-4xl ${a.text}`}>
        {p.title}
      </h3>
      <p className="mt-1 text-base font-medium text-muted">{p.kr}</p>
      <p className="mt-4 max-w-md text-soft">
        <LineBreakText text={p.desc} />
      </p>
    </div>
  );

  const Media = (
    <div className={textLeft ? "" : "lg:order-1"}>
      <MediaWindow src={p.media} accent={p.accent} title={p.title} />
    </div>
  );

  return (
    <Reveal delay={0.05}>
      <div className={`philosophy-row philosophy-row-${p.accent} relative grid items-center gap-6 lg:grid-cols-2 lg:gap-10`}>
        <ValueVfx type={p.accent} />
        {Text}
        {Media}
      </div>
    </Reveal>
  );
}

function StrengthList({ strengths }) {
  return (
    <div className="mt-8 grid grid-cols-2 gap-2 sm:mt-10 sm:gap-3 lg:grid-cols-3">
      {strengths.map((s, index) => {
        const visual = strengthVisuals[index];
        return (
        <motion.div
          key={s.title}
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ delay: index * 0.06, duration: 0.35 }}
          className={`strength-card group relative min-h-[8rem] overflow-hidden border border-line/80 bg-card/70 p-3 transition hover:border-simple/45 hover:bg-card sm:p-5 ${
            index === 0 ? "col-span-2 lg:col-span-3" : ""
          }`}
        >
          {visual?.image && (
            <>
              <img
                src={visual.image}
                alt=""
                aria-hidden="true"
                className={`pointer-events-none absolute inset-0 h-full w-full object-cover grayscale ${
                  index === 0 ? "opacity-[0.16]" : "opacity-[0.2]"
                } ${visual.mode === "icon" ? "object-contain p-8 opacity-[0.16]" : ""}`}
              />
              <div
                className={`pointer-events-none absolute inset-0 ${
                  index === 0
                    ? "bg-gradient-to-r from-card via-card/84 to-card/35"
                    : "bg-gradient-to-br from-card via-card/78 to-card/28"
                }`}
              />
            </>
          )}
          {visual?.logo && (
            <>
              <img
                src={visual.logo}
                alt=""
                aria-hidden="true"
                className="pointer-events-none absolute right-4 top-4 h-28 w-28 opacity-[0.18]"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-card via-card/76 to-card/25" />
            </>
          )}
          <div className="relative z-10 flex h-full flex-col">
          <div className="flex items-start justify-between gap-2 sm:gap-4">
            <span className="font-mono text-[0.68rem] font-bold text-muted">
              0{index + 1}
            </span>
            <span className={`bg-gradient-to-r from-simple to-juicy bg-clip-text font-display font-bold leading-none text-transparent ${
              index === 0 ? "text-3xl sm:text-6xl" : "text-lg xs:text-xl sm:text-2xl"
            }`}>
              {s.stat}
            </span>
          </div>

          <h4 className={`mt-3 font-display font-bold leading-tight text-white sm:mt-5 ${
            index === 0 ? "text-xl sm:text-4xl" : "text-[0.95rem] xs:text-base sm:text-xl"
          }`}>
            {s.title}
          </h4>
          <p className={`mt-1.5 line-clamp-2 leading-5 text-soft sm:mt-2 sm:line-clamp-none sm:leading-relaxed ${
            index === 0 ? "max-w-3xl text-sm sm:text-lg" : "text-xs sm:text-sm"
          }`}>
            {s.desc}
          </p>
          <div className="mt-auto pt-3">
            <div className="h-px w-10 bg-gradient-to-r from-hook via-simple to-transparent opacity-70 transition-all group-hover:w-16 sm:w-12 sm:group-hover:w-20" />
          </div>
          </div>
        </motion.div>
        );
      })}
    </div>
  );
}

function TechStackGroups({ techGroups }) {
  return (
    <div className="mt-8 grid gap-2 md:gap-3 md:grid-cols-2 xl:grid-cols-5">
      {techGroups.map((group, index) => (
        <motion.div
          key={group.title}
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ delay: index * 0.05, duration: 0.35 }}
          className="relative overflow-hidden rounded-xl border border-line/80 bg-surface/70 p-4 md:p-5"
        >
          <div className="absolute -right-10 -top-10 h-24 w-24 rounded-full bg-simple/10 blur-[45px]" />
          <p className="relative font-display text-base font-bold text-white md:text-lg">
            {group.title}
          </p>
          <ul className="relative mt-3 flex flex-wrap gap-2 md:mt-4 md:grid">
            {group.items.map((item) => (
              <li
                key={item.name}
                className="inline-flex min-h-9 w-auto items-center gap-2 rounded-lg border border-line bg-card px-2.5 py-1.5 text-xs font-bold text-soft transition hover:border-simple/50 hover:text-white md:flex md:min-h-11 md:w-full md:gap-3 md:px-3 md:py-2 md:text-sm"
              >
                <span className="tech-icon-badge grid h-6 w-6 shrink-0 place-items-center rounded-md border border-white/10 bg-white/[0.04] text-[0.62rem] font-black text-white md:h-7 md:w-7 md:text-[0.68rem]">
                  {item.icon ? (
                    <img
                      src={item.icon}
                      alt=""
                      loading="lazy"
                      className="tech-icon-img h-3.5 w-3.5 object-contain md:h-4 md:w-4"
                    />
                  ) : (
                    item.mark
                  )}
                </span>
                <span>{item.name}</span>
              </li>
            ))}
          </ul>
        </motion.div>
      ))}
    </div>
  );
}

export default function Philosophy() {
  const { content } = useI18n();
  const { philosophy, strengths, techGroups, ui } = content;

  return (
    <section id="philosophy" className="container-px py-24">
      <SectionHeader
        eyebrow={ui.philosophy.eyebrow}
        title={ui.philosophy.title}
      />

      <div className="mt-14 flex flex-col gap-16 lg:gap-20">
        {philosophy.map((p, i) => (
          <PhilosophyRow key={p.key} p={p} index={i} />
        ))}
      </div>

      {/* 강점 / 셀프 브랜딩 */}
      <div className="mt-24">
        <SectionHeader
          eyebrow={ui.why.eyebrow}
          title={ui.why.title}
        />
        <Reveal delay={0.05}>
          <StrengthList strengths={strengths} />
        </Reveal>
        <Reveal delay={0.08}>
          <TechStackGroups techGroups={techGroups} />
        </Reveal>
      </div>
    </section>
  );
}
