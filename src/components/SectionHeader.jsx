import Reveal from "./Reveal";

export default function SectionHeader({ eyebrow, title, desc, align = "left" }) {
  const center = align === "center";
  return (
    <Reveal className={center ? "text-center" : ""}>
      {eyebrow && (
        <p className="mb-3 font-mono text-xs uppercase tracking-[0.25em] text-hook">
          {eyebrow}
        </p>
      )}
      <h2 className="font-display text-3xl font-bold text-white sm:text-4xl">
        {title}
      </h2>
      {desc && (
        <p
          className={`mt-4 max-w-2xl text-muted ${center ? "mx-auto" : ""}`}
        >
          {desc}
        </p>
      )}
    </Reveal>
  );
}
