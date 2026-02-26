/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./lib/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        midos: {
          50: "#e0f2f1",
          100: "#b2dfdb",
          200: "#80cbc4",
          300: "#4db6ac",
          400: "#26a69a",
          500: "#009688",
          600: "#00897b",
          700: "#00796b",
          800: "#00695c",
          900: "#004d40",
        },
        penguin: {
          bg: "#0a1628",
          surface: "#1a2940",
          border: "#263238",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      animation: {
        float: "float 3s ease-in-out infinite",
        wave: "wave 1.5s ease-in-out infinite",
        aurora: "aurora 12s ease-in-out infinite",
        "aurora-morph": "aurora-morph 8s ease infinite",
        "penguin-slide": "penguin-slide 3.5s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
