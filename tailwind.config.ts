import type { Config } from "tailwindcss";

/**
 * RETO design tokens exposed to Tailwind (theme.extend).
 * The single source of truth stays the CSS variables in
 * src/app/globals.css (ported verbatim from _design/design-tokens.css);
 * every token below references its CSS variable so the palette never forks.
 */
const config: Config = {
  content: ["./src/**/*.{ts,tsx,js,jsx,mdx}"],
  theme: {
    extend: {
      colors: {
        bg: "var(--bg)",
        surface: {
          1: "var(--surface-1)",
          2: "var(--surface-2)",
          3: "var(--surface-3)",
          inset: "var(--surface-inset)",
        },
        ink: {
          DEFAULT: "var(--ink)",
          2: "var(--ink-2)",
          3: "var(--ink-3)",
          4: "var(--ink-4)",
          "on-light": "var(--ink-on-light)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          ink: "var(--accent-ink)",
          dim: "var(--accent-dim)",
        },
        line: {
          DEFAULT: "var(--line)",
          soft: "var(--line-soft)",
          strong: "var(--line-strong)",
          hover: "var(--line-hover)",
        },
        positive: "var(--positive)",
        warning: "var(--warning)",
      },
      fontFamily: {
        sans: ["var(--font-sans)"],
        mono: ["var(--font-mono)"],
      },
      fontSize: {
        display: ["var(--fs-display)", { lineHeight: "0.94", letterSpacing: "var(--tracking-display)" }],
        h1: ["var(--fs-h1)", { lineHeight: "1" }],
        h2: ["var(--fs-h2)", { lineHeight: "1.05" }],
        h3: ["var(--fs-h3)", { lineHeight: "1.2" }],
        "body-lg": "var(--fs-body-lg)",
        body: "var(--fs-body)",
        sm: "var(--fs-sm)",
        label: "var(--fs-label)",
        micro: "var(--fs-micro)",
      },
      letterSpacing: {
        display: "var(--tracking-display)",
        tight: "var(--tracking-tight)",
        label: "var(--tracking-label)",
        mono: "var(--tracking-mono)",
      },
      borderRadius: {
        xs: "var(--r-xs)",
        sm: "var(--r-sm)",
        md: "var(--r-md)",
        lg: "var(--r-lg)",
        pill: "var(--r-pill)",
      },
      boxShadow: {
        card: "var(--shadow-card)",
        pop: "var(--shadow-pop)",
      },
      backgroundImage: {
        irid: "var(--irid)",
        "irid-soft": "var(--irid-soft)",
      },
      transitionTimingFunction: {
        brand: "var(--ease)",
      },
      maxWidth: {
        shell: "1320px",
      },
    },
  },
  plugins: [],
};

export default config;
