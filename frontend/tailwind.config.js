/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // 👈 This line is CRITICAL for dark mode to work!
  theme: {
    extend: {},
  },
  plugins: [],
}