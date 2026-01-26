/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // Nossa paleta personalizada
        gold: {
          400: "#FCD34D", // Amarelo claro
          500: "#D4AF37", // O Dourado Clássico (Metallic Gold)
          600: "#B5952F", // Dourado escuro (para hover)
          900: "#423608", // Dourado quase preto
        },
      },
    },
  },
  plugins: [],
};
