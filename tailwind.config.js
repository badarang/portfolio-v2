/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      screens: {
        xs: "450px",
      },
      colors: {
        // Theme tokens. Values are defined in src/index.css for dark/light mode.
        ink: "rgb(var(--color-ink) / <alpha-value>)",
        surface: "rgb(var(--color-surface) / <alpha-value>)",
        card: "rgb(var(--color-card) / <alpha-value>)",
        line: "rgb(var(--color-line) / <alpha-value>)",
        muted: "rgb(var(--color-muted) / <alpha-value>)",
        soft: "rgb(var(--color-soft) / <alpha-value>)",
        strong: "rgb(var(--color-strong) / <alpha-value>)",
        // Accents — Hook (magenta), Simple (cyan), Juicy (lime)
        hook: "#ff3d81",
        simple: "#22d3ee",
        juicy: "#a3e635",
        gold: "#fbbf24",
      },
      fontFamily: {
        sans: ["Space Grotesk", "Pretendard", "Inter", "system-ui", "sans-serif"],
        display: ["Space Grotesk", "Pretendard", "sans-serif"],
        mono: ["JetBrains Mono", "ui-monospace", "monospace"],
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(255,255,255,0.06), 0 18px 50px -12px rgba(255,61,129,0.25)",
        card: "0 10px 40px -16px rgba(0,0,0,0.7)",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "0% 50%" },
          "100%": { backgroundPosition: "200% 50%" },
        },
        "pulse-ring": {
          "0%": { transform: "scale(0.9)", opacity: "0.7" },
          "100%": { transform: "scale(1.6)", opacity: "0" },
        },
        wave: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
      animation: {
        float: "float 4s ease-in-out infinite",
        shimmer: "shimmer 6s linear infinite",
        "pulse-ring": "pulse-ring 1.8s ease-out infinite",
        wave: "wave 14s linear infinite",
      },
    },
  },
  plugins: [],
};
