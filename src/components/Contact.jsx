import { useState } from "react";
import Reveal from "./Reveal";
import { useI18n } from "../i18n";

const cardClass =
  "group flex w-full items-center justify-between gap-3 rounded-xl border border-line bg-surface px-3 py-4 text-left transition-colors hover:border-white sm:px-5";

function Icon({ type }) {
  if (type === "linkedin") {
    return (
      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-[#0A66C2] text-sm font-black leading-none text-white">
        in
      </span>
    );
  }

  if (type === "github") {
    return (
      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-white/10 bg-white/[0.06] text-white">
        <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5 fill-current">
          <path d="M12 .5a12 12 0 0 0-3.79 23.39c.6.11.82-.26.82-.58v-2.03c-3.34.73-4.04-1.41-4.04-1.41-.55-1.38-1.33-1.75-1.33-1.75-1.09-.75.08-.73.08-.73 1.2.08 1.84 1.24 1.84 1.24 1.07 1.83 2.8 1.3 3.49.99.11-.77.42-1.3.76-1.6-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.12-.3-.54-1.53.12-3.18 0 0 1.01-.32 3.3 1.23a11.45 11.45 0 0 1 6 0c2.29-1.55 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.77.84 1.23 1.91 1.23 3.22 0 4.61-2.81 5.63-5.49 5.93.43.37.81 1.1.81 2.22v3.29c0 .32.22.7.83.58A12 12 0 0 0 12 .5Z" />
        </svg>
      </span>
    );
  }

  if (type === "itch") {
    return (
      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-[#fa5c5c] text-xs font-black leading-none text-white">
        itch
      </span>
    );
  }

  return (
    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-simple/30 bg-simple/[0.1] text-simple">
      <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5 fill-none stroke-current stroke-2">
        <path d="M4 6h16v12H4z" />
        <path d="m4 7 8 6 8-6" />
      </svg>
    </span>
  );
}

function CopyIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5 fill-none stroke-current stroke-2">
      <path d="M8 8h10v12H8z" />
      <path d="M6 16H4V4h12v2" />
    </svg>
  );
}

function ActionIcon({ type }) {
  return (
    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-white/10 bg-white/[0.04] text-muted transition group-hover:border-white/20 group-hover:text-white">
      {type === "copy" ? (
        <CopyIcon />
      ) : (
        <svg
          viewBox="0 0 24 24"
          aria-hidden="true"
          className="h-5 w-5 fill-none stroke-current stroke-2 transition-transform group-hover:translate-x-0.5"
        >
          <path d="M5 12h14" />
          <path d="m13 6 6 6-6 6" />
        </svg>
      )}
    </span>
  );
}

const confettiPieces = [
  ["#22d3ee", -90, -72, -18],
  ["#ff3d81", -68, -96, 20],
  ["#a3e635", -46, -78, 58],
  ["#fbbf24", -24, -108, -38],
  ["#ffffff", -8, -88, 12],
  ["#22d3ee", 16, -112, 44],
  ["#ff3d81", 36, -82, -24],
  ["#a3e635", 58, -100, 30],
  ["#fbbf24", 82, -70, -52],
  ["#ffffff", 98, -94, 18],
  ["#22d3ee", -110, -42, 42],
  ["#ff3d81", 114, -48, -30],
];

function CopyToast({ burst }) {
  const { content } = useI18n();

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-16 z-50 flex justify-center">
      <div className="relative">
        <div key={burst} className="absolute left-1/2 top-1/2 h-1 w-1">
          {confettiPieces.map(([color, x, y, rotate], index) => (
            <span
              key={`${burst}-${index}`}
              className="copy-confetti absolute h-2 w-1 rounded-[2px]"
              style={{
                "--x": `${x}px`,
                "--y": `${y}px`,
                "--r": `${rotate}deg`,
                "--delay": `${index * 18}ms`,
                backgroundColor: color,
              }}
            />
          ))}
        </div>
        <div className="rounded-full border border-simple/40 bg-ink/95 px-5 py-2.5 text-sm font-bold text-white shadow-glow backdrop-blur">
          {content.ui.contact.copied}
        </div>
      </div>
    </div>
  );
}

export default function Contact() {
  const { content } = useI18n();
  const { profile, ui } = content;
  const [copied, setCopied] = useState(false);
  const [burst, setBurst] = useState(0);
  const channels = [
    { label: "Email", value: profile.links.emailAddress, copy: profile.links.emailAddress, icon: "mail" },
    { label: "LinkedIn", value: "Haein Oh", href: profile.links.linkedin, icon: "linkedin" },
    { label: "GitHub", value: "github.com/badarang", href: profile.links.github, icon: "github" },
    { label: "itch.io", value: "badarang.itch.io", href: profile.links.itch, icon: "itch" },
  ];

  const copyEmail = async () => {
    await navigator.clipboard.writeText(profile.links.emailAddress);
    setBurst((value) => value + 1);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1400);
  };

  return (
    <section id="contact" className="container-px py-24">
      <div className="card-surface relative overflow-hidden p-4 sm:p-14">
        <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-hook/20 blur-[100px]" />

        <div className="grid gap-4 sm:grid-cols-2">
          {channels.map((c, i) => (
            <Reveal key={c.label} delay={(i % 2) * 0.08}>
              {c.copy ? (
                <button type="button" onClick={copyEmail} className={cardClass}>
                  <span className="flex min-w-0 items-center gap-4">
                    <Icon type={c.icon} />
                    <span className="min-w-0">
                      <span className="block text-xs uppercase tracking-wider text-muted">
                        {c.label}
                      </span>
                      <span className="block truncate font-medium text-white">{c.value}</span>
                    </span>
                  </span>
                  <ActionIcon type="copy" />
                </button>
              ) : (
                <a
                  href={c.href}
                  target={c.href.startsWith("http") ? "_blank" : undefined}
                  rel="noreferrer"
                  className={cardClass}
                >
                  <span className="flex min-w-0 items-center gap-4">
                    <Icon type={c.icon} />
                    <span className="min-w-0">
                      <span className="block text-xs uppercase tracking-wider text-muted">
                        {c.label}
                      </span>
                      <span className="block truncate font-medium text-white">{c.value}</span>
                    </span>
                  </span>
                  <ActionIcon />
                </a>
              )}
            </Reveal>
          ))}
        </div>
      </div>

      {copied && <CopyToast burst={burst} />}

      <footer className="mt-16 border-t border-line pt-8 text-center text-sm text-muted">
        © {new Date().getFullYear()} Haein Oh. {ui.contact.footer}
      </footer>
    </section>
  );
}
