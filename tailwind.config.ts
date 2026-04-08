import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    container: {
      center: true,
      padding: "1.5rem",
      screens: {
        "2xl": "1280px",
      },
    },
    extend: {
      colors: {
        brand: {
          50: "#eef2ff",
          100: "#e0e7ff",
          200: "#c7d2fe",
          300: "#a5b4fc",
          400: "#818cf8",
          500: "#6366f1",
          600: "#4f46e5",
          700: "#4338ca",
          800: "#3730a3",
          900: "#312e81",
        },
      },
      fontFamily: {
        sans: [
          "Inter",
          "-apple-system",
          "BlinkMacSystemFont",
          "system-ui",
          "Segoe UI",
          "Roboto",
          "Helvetica Neue",
          "Arial",
          "sans-serif",
        ],
        mono: [
          "ui-monospace",
          "SFMono-Regular",
          "Menlo",
          "Monaco",
          "monospace",
        ],
      },
      borderRadius: {
        "4xl": "2rem",
      },
      backdropBlur: {
        "3xl": "64px",
      },
      keyframes: {
        fadeIn: {
          from: { opacity: "0", transform: "translateY(4px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "100%": { transform: "translateX(100%)" },
        },
        pulseGlow: {
          "0%, 100%": { boxShadow: "0 0 0 0 rgba(99, 102, 241, 0.5)" },
          "50%": { boxShadow: "0 0 0 8px rgba(99, 102, 241, 0)" },
        },
      },
      animation: {
        "fade-in": "fadeIn 0.4s ease-out both",
        shimmer: "shimmer 1.6s infinite",
        "pulse-glow": "pulseGlow 2s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
