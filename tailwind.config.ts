import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "odyan-slate-950": "#050814",
        "odyan-slate-900": "#080c1c",
        "odyan-slate-800": "#0f172a",
        "odyan-slate-700": "#1e293b",
        "odyan-slate-600": "#334155",
        "odyan-slate-400": "#9ca3af",
        "odyan-slate-100": "#e5e7eb",
        "odyan-slate-50": "#f9fafb",

        "odyan-primary-50": "#e6fbf7",
        "odyan-primary-100": "#c0f6ea",
        "odyan-primary-300": "#5eead4",
        "odyan-primary-500": "#14b8a6",
        "odyan-primary-600": "#0f766e",
        "odyan-primary-900": "#022c22",

        "odyan-iris-500": "#3b82f6",

        "odyan-success-500": "#22c55e",
        "odyan-warning-500": "#eab308",
        "odyan-danger-500": "#ef4444",
        "odyan-info-500": "#0ea5e9",
      },
      fontFamily: {
        sans: [
          "Inter",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "sans-serif",
        ],
      },
      borderRadius: {
        sm: "0.25rem",
        md: "0.5rem",
        lg: "0.75rem",
        xl: "1rem",
        "2xl": "1.25rem",
        full: "9999px",
      },
      boxShadow: {
        odyan: "0 10px 30px rgba(15, 23, 42, 0.45)",
        "odyan-soft": "0 4px 16px rgba(15, 23, 42, 0.5)",
        "odyan-subtle": "0 1px 3px rgba(15, 23, 42, 0.7)",
      },
    },
  },
  plugins: [],
};

export default config;
