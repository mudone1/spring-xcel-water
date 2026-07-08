import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        sbBg: "#05101e",
        sbSurf: "#091628",
        sbAct: "#0e2340",
        sbAcc: "#1a5fcb",
        sbText: "#8ab0d8",
        sbMuted: "#1e3a5a",
        sbBrd: "#0e2035",
        bg: "#f0f4fa",
        surf: "#ffffff",
        surf2: "#f5f8fd",
        brd: "#dce5f0",
        brd2: "#b8c8df",
        txt: "#0a1220",
        txt2: "#3a4e6a",
        txt3: "#7a94b0",
        grn: "#1040a0",
        grnM: "#1a5fcb",
        grnL: "#dce8fb",
        grnXl: "#eef4fe",
        red: "#7a1c1c",
        redM: "#c03838",
        redL: "#fce6e6",
      },
      borderRadius: {
        r: "9px",
        rLg: "15px",
        rXl: "20px",
      },
      fontFamily: {
        sans: ["'DM Sans'", "sans-serif"],
        mono: ["'DM Mono'", "monospace"],
      },
    },
  },
  plugins: [],
};

export default config;
