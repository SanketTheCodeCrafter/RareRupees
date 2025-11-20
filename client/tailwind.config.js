// tailwind.config.js
import { defineConfig } from "tailwindcss";

export default defineConfig({
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        accent: "#00d1c1",
        lime: "#9ef76e",
        bg1: "#05070a",
        bg2: "#071014",
        textMain: "#e6f7f5",
        muted: "#9aa7b2",
      },
      boxShadow: {
        card: "0 8px 30px rgba(0,0,0,0.6)",
        glow: "0 8px 40px rgba(0,209,193,0.06)",
      },
      borderRadius: {
        smooth: "14px",
      },
      transitionTimingFunction: {
        smooth: "cubic-bezier(.2,.9,.25,1)",
      },
    },
  },
  safelist: [
    // debug helper — will force classes into generated CSS
    "text-accent",
    "bg-accent",
  ],
  plugins: [],
});
