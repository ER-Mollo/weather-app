/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
    "./src/app/**/*.{js,ts,jsx,tsx}",
    "./src/styles/**/*.css", // Ensure Tailwind scans your styles
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
