import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        "bounce-slow": "bounce 2.5s infinite",
      },
    },
  },
  plugins: [],
};
export default config;
