/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {

      boxShadow: {
        'right': '4px 0 6px -1px rgba(0, 0, 0, 0.1), 4px 0 4px -1px rgba(0, 0, 0, 0.06)',
      }

    },
  },
  plugins: [
    require('tailwind-scrollbar'),
  ],
}