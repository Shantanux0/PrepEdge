/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        neonGreen: "#050505",
        darkBg: "#0a0a0a",
      },
      fontFamily: {
        sans: ["Poppins", "sans-serif"], // nice clean font
      },
    },
  },
  plugins: [],
}
