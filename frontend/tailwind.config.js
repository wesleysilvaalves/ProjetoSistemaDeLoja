/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',  // Adicione esta linha
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Poppins', 'sans-serif'], // define Poppins como fonte padrão
      },
    },
  },
  plugins: [],
}
