/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cyber: {
          dark: '#0a0a12',
          card: '#121225',
          neonCyan: '#00f0ff',
          neonPink: '#ff007f',
          neonGreen: '#39ff14',
        }
      }
    },
  },
  plugins: [],
}