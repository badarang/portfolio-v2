import { useI18n } from "../i18n";
import SectionHeader from "./SectionHeader";
import Reveal from "./Reveal";

const icons = [
  {
    label: "Launch",
    path: "M5 19l4-4m0 0l6-6m-6 6l-2-5 5 2 6-6-2 7-6 6z",
  },
  {
    label: "Fix",
    path: "M14 7l3 3m0 0l-7 7-4 1 1-4 7-7m3 3l2-2a2 2 0 0 0-3-3l-2 2m-8 14h12",
  },
  {
    label: "Team",
    path: "M8 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm8 0a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM3 20a5 5 0 0 1 10 0m-2 0a5 5 0 0 1 10 0",
  },
];

function Icon({ path, label }) {
  return (
    <svg
      aria-label={label}
      className="h-5 w-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.8"
    >
      <path d={path} />
    </svg>
  );
}

export default function Testimonials() {
  const { content } = useI18n();
  const { testimonials, ui } = content;
  const testimonial = testimonials[0];

  return (
    <section id="testimonials" className="container-px py-18 sm:py-24">
      <SectionHeader
        eyebrow={ui.testimonials.eyebrow}
        title={ui.testimonials.title}
        desc={ui.testimonials.desc}
      />

      <Reveal delay={0.05}>
        <article className="relative mt-10 overflow-hidden rounded-2xl border border-line bg-card shadow-card">
          <div className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-hook via-simple to-transparent" />
          <div className="absolute -right-16 -top-16 h-44 w-44 rounded-full bg-simple/10 blur-[70px]" />
          <div className="absolute -bottom-20 left-10 h-44 w-44 rounded-full bg-hook/10 blur-[70px]" />

          <div className="relative grid gap-0 lg:grid-cols-[0.72fr_1.28fr]">
            <div className="border-b border-line bg-surface/70 p-6 sm:p-7 lg:border-b-0 lg:border-r">
              <div className="flex items-center gap-4">
                <div className="grid h-14 w-14 shrink-0 place-items-center overflow-hidden rounded-2xl border border-white/15 bg-white shadow-glow">
                  <img
                    src="/companies/halfbrick.jpg"
                    alt="Halfbrick"
                    loading="lazy"
                    className="h-full w-full object-cover"
                  />
                </div>
                <div>
                  <p className="font-mono text-[0.68rem] font-bold uppercase tracking-[0.18em] text-hook">
                    {testimonial.company} Reference
                  </p>
                  <h3 className="mt-1 font-display text-2xl font-bold leading-tight text-white">
                    {testimonial.name}
                  </h3>
                  <p className="mt-1 text-sm font-medium text-soft">
                    {testimonial.role}
                  </p>
                </div>
              </div>

              <p className="mt-6 rounded-lg border border-line bg-card/70 px-4 py-3 font-mono text-xs font-bold uppercase tracking-[0.14em] text-muted">
                {ui.testimonials.label}
              </p>

              <a
                href={testimonial.linkedin}
                target="_blank"
                rel="noreferrer"
                className="mt-4 inline-flex h-12 items-center gap-2.5 rounded-full bg-white px-5 text-sm font-bold text-ink shadow-[0_12px_30px_rgba(0,0,0,0.22)] transition hover:bg-[#0A66C2] hover:text-white"
              >
                <svg
                  aria-hidden="true"
                  className="h-5 w-5 shrink-0"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M20.45 20.45h-3.56v-5.58c0-1.33-.02-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.95v5.67H9.34V8.98h3.42v1.57h.05a3.75 3.75 0 0 1 3.37-1.85c3.61 0 4.27 2.37 4.27 5.46v6.29zM5.32 7.41a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zm1.78 13.04H3.54V8.98H7.1v11.47z" />
                </svg>
                <span className="whitespace-nowrap">{ui.testimonials.linkedin}</span>
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
              </a>
            </div>

            <div className="p-6 sm:p-7">
              <div className="flex items-start gap-4">
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-simple/40 bg-simple/10 text-simple">
                  <svg
                    aria-label="Quote"
                    className="h-5 w-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M8.4 6.2C5.8 7.8 4.5 9.9 4.5 12.6V18h6v-6H7.8c.1-1.5.9-2.8 2.4-4L8.4 6.2zm9 0c-2.6 1.6-3.9 3.7-3.9 6.4V18h6v-6h-2.7c.1-1.5.9-2.8 2.4-4l-1.8-1.8z" />
                  </svg>
                </div>
                <blockquote className="max-w-3xl text-lg font-semibold leading-relaxed text-white sm:text-xl">
                  “{testimonial.highlight}”
                </blockquote>
              </div>

              <ul className="mt-6 grid gap-3 text-sm font-semibold text-white sm:grid-cols-3">
                {testimonial.points.map((point, index) => (
                  <li
                    key={point}
                    className="group min-h-28 rounded-xl border border-line bg-surface/80 p-4 transition hover:border-simple/60 hover:bg-white/[0.06]"
                  >
                    <div className="mb-4 grid h-9 w-9 place-items-center rounded-lg border border-white/10 bg-card text-simple group-hover:text-hook">
                      <Icon {...icons[index]} />
                    </div>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </article>
      </Reveal>
    </section>
  );
}
