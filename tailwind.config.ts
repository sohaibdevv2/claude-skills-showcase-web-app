import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        warm: {
          bg: "#F7F5F2",
          text: "#2C2416",
          pink: "#E8B4BC",
          green: "#9CAF88",
          blue: "#7BA3BC",
          coral: "#D4896C",
          lavender: "#C4B5D4",
        },
      },
      fontFamily: {
        serif: ["'Freight Text Pro'", "Georgia", "serif"],
        sans: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
