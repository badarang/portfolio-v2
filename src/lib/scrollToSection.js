export function scrollToSection(id, options = {}) {
  if (typeof window === "undefined") return;

  const target = document.getElementById(id);
  if (!target) return;

  const isMobile = window.matchMedia("(max-width: 768px)").matches;
  const sectionPaddingOffset = isMobile ? 64 : 40;
  const perSectionOffset = {
    activities: isMobile ? 36 : 48,
  };
  const top =
    target.getBoundingClientRect().top +
    window.scrollY +
    sectionPaddingOffset +
    (perSectionOffset[id] ?? 0);

  window.scrollTo({
    top: Math.max(top, 0),
    behavior: options.behavior ?? "smooth",
  });
}
