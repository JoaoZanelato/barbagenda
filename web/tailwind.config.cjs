/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        gold: {
          400: "#FCD34D",
          500: "#D4AF37",
          600: "#B5952F",
          900: "#423608",
        },
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"), 
  ],
};