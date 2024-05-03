/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],

  theme: {
    extend: {
      colors: {
        "custom-blue-100": '#F6F8FA',
      },
      borderWidth: {
        '0.6': '0.6px',
      },
      borderColor: theme => ({
        ...theme('colors'),
        'custom-border': '#E2E4EB',
      }),
    },
  },
  plugins: [],
}