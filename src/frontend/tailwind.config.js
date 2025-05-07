/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'theme-red': '#d84830',
        'theme-beige': '#F5F5DC',
      }
    },
  },
  plugins: [
    function({ addVariant }) {
      addVariant('hc', '.high-contrast-mode &');
      addVariant('cb', '.color-blind-mode &');
    }
  ],
}
