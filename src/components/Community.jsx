import { useI18n } from "../i18n";
import SectionHeader from "./SectionHeader";
import Reveal from "./Reveal";

const accentClasses = {
  hook: "border-hook/45 text-hook",
  simple: "border-simple/45 text-simple",
  juicy: "border-juicy/45 text-juicy",
  gold: "border-gold/45 text-gold",
};

function CommunityCard({ card, index }) {
  const accent = accentClasses[card.accent] ?? accentClasses.simple;

  return (
    <Reveal delay={index * 0.07}>
      <article className="dark-panel card-surface flex h-full flex-col overflow-hidden p-5 sm:p-6">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <p className={`mb-2 font-mono text-xs font-bold uppercase tracking-[0.18em] ${accent}`}>
              {card.stat}
            </p>
            <h3 className="font-display text-xl font-bold text-white">
              {card.title}
            </h3>
          </div>
          <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl border bg-white/[0.04] font-mono text-xs font-black ${accent}`}>
            {String(index + 1).padStart(2, "0")}
          </span>
        </div>

        <p className="text-sm leading-6 text-soft">{card.desc}</p>

        <div className="mt-6 grid gap-3">
          {card.items.map((item) => (
            <div key={item.title} className="rounded-lg border border-line bg-ink/35 p-4">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h4 className="font-semibold text-white">{item.title}</h4>
                {item.period && (
                  <span className="font-mono text-[0.68rem] font-bold uppercase tracking-[0.08em] text-muted">
                    {item.period}
                  </span>
                )}
              </div>
              <p className="mt-2 text-sm leading-6 text-muted">{item.desc}</p>
            </div>
          ))}
        </div>
      </article>
    </Reveal>
  );
}

export default function Community() {
  const { content } = useI18n();
  const { community, ui } = content;

  return (
    <section id="community" className="container-px py-24">
      <SectionHeader
        eyebrow={ui.community.eyebrow}
        title={ui.community.title}
        desc={ui.community.desc}
      />

      {community.proofLine && (
        <Reveal delay={0.05}>
          <div className="mt-8 rounded-2xl border border-simple/25 bg-simple/[0.06] p-5 text-base font-semibold leading-7 text-soft sm:p-6">
            {community.proofLine}
          </div>
        </Reveal>
      )}

      <div className="mt-8 grid gap-5 lg:grid-cols-2">
        {community.cards.map((card, index) => (
          <CommunityCard key={card.title} card={card} index={index} />
        ))}
      </div>
    </section>
  );
}
