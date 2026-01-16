/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#2563EB', // A nice academic blue
        secondary: '#475569', // Slate gray for text
        background: '#F8FAFC', // Very light gray background
        card: '#FFFFFF', // White for cards
      }
    },
  },
  plugins: [],
}
