/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme')
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,vue}",
  ],
  theme: {
    extend: {},
    screens: {
      'tall': {'raw': '(min-height: 800px)'},
      ...defaultTheme.screens,
    },
  },
  plugins: [],
}
