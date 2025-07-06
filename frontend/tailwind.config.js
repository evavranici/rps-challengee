/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
     "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
       colors: {
        'back-btn': '#38A5B3', // 'rgb(56,165,179)
      },
    },
  },
  plugins: [],
}

