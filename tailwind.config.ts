import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          teal: "#00C4B3",
          navy: "#002D74",
          yellow: "#FFC629",
          midnight: "#0C1A2A",
        },
      },
      fontFamily: {
        display: [
          '"SF Pro Display"',
          '"SF Pro Text"',
          "-apple-system",
          "BlinkMacSystemFont",
          '"Segoe UI"',
          "sans-serif",
        ],
        body: [
          '"SF Pro Text"',
          "-apple-system",
          "BlinkMacSystemFont",
          '"Segoe UI"',
          "sans-serif",
        ],
      },
      borderRadius: {
        xl: "16px",
      },
      boxShadow: {
        subtle: "0 8px 24px rgba(0, 0, 0, 0.12)",
      },
      backgroundImage: {
        "brand-gradient": "linear-gradient(135deg, #002D74 0%, #0C1A2A 100%)",
      },
    },
  },
  plugins: [],
};

export default config;
