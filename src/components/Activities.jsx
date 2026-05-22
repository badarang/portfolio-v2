import { useI18n } from "../i18n";
import SectionHeader from "./SectionHeader";
import Reveal from "./Reveal";

const sourceIcon = {
  YouTube: { icon: "https://cdn.simpleicons.org/youtube/FF0033" },
  "KRAFTON JUNGLE": { mark: "K" },
  "Smilegate Future Lab": { mark: "S" },
  "Pinpoint News · ETNews": {
    icon: "https://cdn.simpleicons.org/googlenews/4285F4",
  },
  "Gyeonggi News": { mark: "G" },
};

const fallbackThumb = {
  "KRAFTON JUNGLE":
    "linear-gradient(135deg, rgba(34,211,238,0.32), rgba(255,61,129,0.22))",
  "Smilegate Future Lab":
    "linear-gradient(135deg, rgba(255,61,129,0.32), rgba(163,230,53,0.22))",
  "Pinpoint News · ETNews":
    "linear-gradient(135deg, rgba(163,230,53,0.3), rgba(34,211,238,0.2))",
  "Gyeonggi News":
    "linear-gradient(135deg, rgba(255,255,255,0.12), rgba(34,211,238,0.18))",
};

function ExternalIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-4 w-4 shrink-0"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
    >
      <path d="M7 17 17 7" />
      <path d="M9 7h8v8" />
    </svg>
  );
}

function SourceMark({ source }) {
  const visual = sourceIcon[source];
  return (
    <span className="inline-flex min-w-0 items-center gap-1.5 text-xs text-muted">
      {visual?.icon ? (
        <img
          src={visual.icon}
          alt=""
          loading="lazy"
          className="h-3.5 w-3.5 shrink-0 rounded-[2px] object-cover"
        />
      ) : visual?.mark ? (
        <span className="grid h-3.5 w-3.5 shrink-0 place-items-center rounded-[3px] bg-white/[0.12] text-[0.55rem] font-black text-white">
          {visual.mark}
        </span>
      ) : null}
      <span className="truncate">{source}</span>
    </span>
  );
}

function BookmarkCard({ item, index }) {
  const href = item.url;
  const thumbnail = item.youtubeId
    ? `https://img.youtube.com/vi/${item.youtubeId}/maxresdefault.jpg`
    : "";
  const image = item.thumbnail || (item.youtubeId ? thumbnail : "");
  const bg = fallbackThumb[item.source] ?? fallbackThumb["Gyeonggi News"];

  return (
    <Reveal delay={index * 0.06}>
      <a
        href={href}
        target="_blank"
        rel="noreferrer"
        className="dark-panel group relative block min-h-[124px] overflow-hidden rounded-xl border border-line bg-card shadow-card transition hover:-translate-y-1 hover:border-simple/55 sm:min-h-[132px]"
      >
        <div
          className="absolute inset-y-0 right-0 w-[48%] bg-surface opacity-80 transition duration-500 group-hover:opacity-100 sm:w-[42%]"
          style={!image ? { background: bg } : undefined}
        >
          {image ? (
            <img
              src={image}
              alt=""
              loading="lazy"
              className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="grid h-full place-items-center">
              <span className="font-mono text-3xl font-black uppercase text-white/70">
                {item.source.slice(0, 2)}
              </span>
            </div>
          )}
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-card via-card/95 via-[58%] to-card/12" />
        <div className="absolute inset-y-0 right-0 w-[48%] bg-gradient-to-l from-transparent via-card/10 to-card sm:w-[42%]" />

        <div className="relative z-10 flex min-h-[124px] flex-col p-4 pr-[32%] sm:min-h-[132px] sm:p-5 sm:pr-[36%]">
          <div className="mb-2 flex items-center justify-between gap-3">
              <span className="rounded-full border border-line bg-surface px-2.5 py-1 font-mono text-[0.62rem] font-bold uppercase tracking-[0.12em] text-hook">
                {item.type}
              </span>
              <ExternalIcon />
            </div>
            <h3 className="line-clamp-1 font-display text-lg font-bold leading-tight text-white group-hover:text-simple">
              {item.title}
            </h3>
            <p className="mt-2 line-clamp-2 max-w-2xl text-sm leading-6 text-soft">
              {item.desc}
            </p>
            <div className="mt-auto flex min-w-0 items-center justify-between gap-3 pt-4">
              <SourceMark source={item.source} />
              <span className="shrink-0 rounded-full bg-white/[0.06] px-2 py-1 text-[0.65rem] font-bold text-muted">
                {item.label}
              </span>
            </div>
        </div>
      </a>
    </Reveal>
  );
}

export default function Activities() {
  const { content } = useI18n();
  const { activityFeature, activities, ui } = content;
  const bookmarks = [activityFeature, ...activities];
  const shouldScroll = bookmarks.length >= 5;

  return (
    <section id="activities" className="container-px py-24">
      <SectionHeader
        eyebrow={ui.activities.eyebrow}
        title={ui.activities.title}
        desc={ui.activities.desc}
      />

      <div
        className={`mt-12 grid gap-4 ${
          shouldScroll
            ? "max-h-[760px] overflow-y-auto pr-2 [scrollbar-width:thin] [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-line [&::-webkit-scrollbar-track]:bg-transparent"
            : ""
        }`}
      >
        {bookmarks.map((item, index) => (
          <BookmarkCard
            key={item.title}
            item={item}
            index={index}
          />
        ))}
      </div>
    </section>
  );
}
