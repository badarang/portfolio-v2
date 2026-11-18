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

function PhilosophyCard({ p, index }) {
  const a = accent[p.accent];
  return (
    <Reveal delay={index * 0.07} className="h-full">
      <div className="flex h-full flex-col">
        <MediaWindow src={p.media} accent={p.accent} title={p.title} />
        <h3 className={`mt-5 font-display text-2xl font-bold sm:text-3xl ${a.text}`}>{p.title}</h3>
        <p className="mt-1 text-base font-semibold text-white">{p.kr}</p>
        <p className="mt-2 text-sm leading-6 text-muted">
          <LineBreakText text={p.desc} />
        </p>
      </div>
    </Reveal>
  );
}

export default function Philosophy() {
  const { content } = useI18n();
  const { philosophy, ui } = content;

  return (
    <section id="philosophy" className="container-px py-24">
      <SectionHeader
        eyebrow={ui.philosophy.eyebrow}
        title={ui.philosophy.title}
      />

      <div className="mt-12 grid gap-10 lg:grid-cols-3 lg:gap-6">
        {philosophy.map((p, i) => (
          <PhilosophyCard key={p.key} p={p} index={i} />
        ))}
      </div>
    </section>
  );
}
