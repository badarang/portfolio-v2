import { useI18n } from "../i18n";
import SectionHeader from "./SectionHeader";
import Reveal from "./Reveal";
import MediaWindow from "./MediaWindow";

const accent = {
  hook: {
    text: "text-hook",
    dot: "bg-hook",
    line: "from-hook",
    border: "border-hook/35",
    panel: "bg-hook/[0.045]",
    chip: "border-hook/35 bg-hook/[0.08] text-hook",
  },
  simple: {
    text: "text-simple",
    dot: "bg-simple",
    line: "from-simple",
    border: "border-simple/35",
    panel: "bg-simple/[0.045]",
    chip: "border-simple/35 bg-simple/[0.08] text-simple",
  },
  juicy: {
    text: "text-juicy",
    dot: "bg-juicy",
    line: "from-juicy",
    border: "border-juicy/35",
    panel: "bg-juicy/[0.045]",
    chip: "border-juicy/35 bg-juicy/[0.08] text-juicy",
  },
};

function SectionList({ title, items, tone }) {
  if (!items?.length) return null;

  return (
    <div className={`rounded-xl border ${tone.border} ${tone.panel} p-3.5`}>
      <h4 className="font-display text-xs font-bold uppercase tracking-[0.16em] text-white">
        {title}
      </h4>
      <ul className="mt-2.5 space-y-1.5">
        {items.map((item) => (
          <li key={item} className="flex gap-2.5 text-[0.83rem] leading-[1.45] text-soft">
            <span className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${tone.dot}`} />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function CompanyHeader({ c, tone, labels }) {
  const hasRealPeriod = c.period && !c.period.includes("(");

  return (
    <div className="flex flex-wrap items-start justify-between gap-5">
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
          <div className="flex items-center gap-3">
            {c.logo && (
              <span className="grid h-11 w-11 shrink-0 place-items-center overflow-hidden rounded-full border border-white/10 bg-white p-1.5">
                <img
                  src={c.logo}
                  alt=""
                  className="h-full w-full rounded-full object-contain"
                />
              </span>
            )}
            <span className="font-display text-lg font-bold text-white">
              {c.company}
            </span>
          </div>
          <span className={`h-2 w-2 rounded-full ${tone.dot}`} />
          <span className="text-sm font-semibold text-muted">{c.location}</span>
        </div>
        <h3 className="mt-3 font-display text-2xl font-bold leading-tight text-white sm:text-[1.65rem]">
          {c.role}
        </h3>
        {hasRealPeriod && (
          <p className="mt-2 text-sm font-medium text-muted">{c.period}</p>
        )}
      </div>
      {c.link && (
        <a
          href={c.link}
          target="_blank"
          rel="noreferrer"
          className={`rounded-full border px-3.5 py-1.5 text-sm font-bold transition hover:bg-white hover:text-ink ${tone.border} ${tone.text}`}
        >
          {labels.company}
        </a>
      )}
    </div>
  );
}

function Environment({ tech, tone, labels }) {
  if (!tech?.length) return null;

  return (
    <div>
      <h4 className="font-display text-xs font-bold uppercase tracking-[0.16em] text-white">
        {labels.environment}
      </h4>
      <div className="mt-2.5 flex flex-wrap gap-2">
        {tech.map((item) => (
          <span
            key={item}
            className={`rounded-full border px-2.5 py-1 text-xs font-bold ${tone.chip}`}
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

function CompanyBlock({ c, labels }) {
  const tone = accent[c.accent] ?? accent.simple;
  const hasMedia = Boolean(c.media);

  const Info = (
    <article className={`relative rounded-2xl border border-white/10 bg-white/[0.035] p-5 shadow-card backdrop-blur-sm sm:p-5`}>
      <div className={`absolute inset-x-6 top-0 h-px bg-gradient-to-r ${tone.line} via-white/35 to-transparent`} />
      <CompanyHeader c={c} tone={tone} labels={labels} />

      {c.headline && (
        <p className="mt-4 max-w-3xl text-[0.95rem] font-semibold leading-6 text-white">
          {c.headline}
        </p>
      )}

      <div className={`${c.headline ? "mt-4" : "mt-5"} grid gap-3.5 md:grid-cols-2`}>
        <SectionList title={labels.impact} items={c.impact} tone={tone} />
        <SectionList title={labels.workAreas} items={c.workAreas} tone={tone} />
      </div>

      <div className="mt-4">
        <Environment tech={c.tech} tone={tone} labels={labels} />
      </div>
    </article>
  );

  return (
    <Reveal delay={0.05}>
      {hasMedia ? (
        <div className="grid items-center gap-8 lg:grid-cols-[minmax(0,1.08fr)_minmax(360px,0.92fr)] lg:gap-12">
          {Info}
          <MediaWindow
            src={c.media}
            accent={c.accent}
            variant="natural"
            thumbnailZoom={c.thumbnailZoom}
            thumbnailPosition={c.thumbnailPosition}
          />
        </div>
      ) : (
        <div className="max-w-5xl">{Info}</div>
      )}
    </Reveal>
  );
}

export default function Professional() {
  const { content } = useI18n();
  const { professional, ui } = content;

  return (
    <section id="career" className="container-px py-24">
      <SectionHeader
        eyebrow={ui.professional.eyebrow}
        title={ui.professional.title}
      />
      <div className="mt-14 flex flex-col gap-16 lg:gap-24">
        {professional.map((c) => (
          <CompanyBlock key={c.company} c={c} labels={ui.professional} />
        ))}
      </div>
    </section>
  );
}
