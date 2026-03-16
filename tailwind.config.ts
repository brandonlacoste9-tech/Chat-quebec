import type { Config } from "tailwindcss";
import typography from '@tailwindcss/typography';

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        cognac: {
          DEFAULT: "var(--cognac)",
          l: "var(--cognac-l)",
        },
        gold: {
          DEFAULT: "var(--gold)",
          l: "var(--gold-l)",
          d: "var(--gold-d)",
        },
        bark: {
          DEFAULT: "var(--bark)",
          l: "var(--bark-l)",
          ll: "var(--bark-ll)",
          mid: "var(--bark-mid)",
        },
        text: {
          main: "var(--text-main)",
          muted: "var(--text-muted)",
          dim: "var(--text-dim)",
        },
        border: {
          parlons: "var(--border-parlons)",
          hot: "var(--border-hot)",
        },
      },
      fontFamily: {
        playfair: ["'Playfair Display'", "serif"],
        barlow: ["'Barlow'", "sans-serif"],
        "barlow-cond": ["'Barlow Condensed'", "sans-serif"],
      },
      animation: {
        respiration: "respiration 3s ease-in-out infinite",
      },
      keyframes: {
        respiration: {
          "0%, 100%": { transform: "scale(1)", opacity: "0.8" },
          "50%": { transform: "scale(1.05)", opacity: "1" },
        },
      },
    },
  },
  plugins: [
    typography,
  ],
} satisfies Config;
