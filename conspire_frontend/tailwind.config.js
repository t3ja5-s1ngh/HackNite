/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        noir: "#050505",
        sinRed: "#8b0000",
      },
    },
  },
  plugins: [],
};
