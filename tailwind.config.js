/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./*.html",
    "./*.js",
    "./**/*.html",
    "./**/*.js"
  ],
  safelist: [
    "text-3xl",
    "font-bold",
    "text-blue-600",
    "text-gray-600",
    "mt-2",
    "p-4"
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
