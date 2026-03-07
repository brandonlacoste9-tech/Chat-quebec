import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        quebec: {
          blue: "#003DA5",
          gold: "#FFD700",
          dark: "#0f172a",
          light: "#f8fafc",
          accent: "#2563eb",
        },
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
  plugins: [],
} satisfies Config;
