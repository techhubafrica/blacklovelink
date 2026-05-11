/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: { display: ["Inter", "sans-serif"] },
      colors: {
        brand: { DEFAULT: "#c0392b", dark: "#2ecc71" },
      },
    },
  },
  plugins: [],
};
