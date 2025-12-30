/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",       // if using App Router
    "./pages/**/*.{js,ts,jsx,tsx}",     // if using Pages Router
    "./components/**/*.{js,ts,jsx,tsx}" // all components
  ],
  theme: {
    extend: {
      colors:{
        primary:"#afb88d",
        secondary:"#73321F",
        secondary_mid:"#C75735",
        secondary_light:"#E9BBAD"
      }
    },
  },
  plugins: [],
}
