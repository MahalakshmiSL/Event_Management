/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary:   "#b5651d",
        "primary-dark": "#8B4513",
        "primary-light": "#d4845a",
        dark:      "#2c2416",
        "dark-2":  "#3d3020",
        "dark-3":  "#4a3828",
        cream:     "#f5f0e8",
        "cream-2": "#ede5d8",
        gold:      "#c9912a",
      },
      fontFamily: {
        serif: ["Playfair Display", "Georgia", "serif"],
        sans:  ["Inter", "sans-serif"],
      },
      backgroundImage: {
        "hero-gradient": "linear-gradient(to bottom, rgba(0,0,0,0.55), rgba(0,0,0,0.75))",
      },
    },
  },
  plugins: [],
};