/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "custom-green": "#ecfaec",
        "dark-green": "#166639",
        "custom-black": "#202020",
      },
      fontFamily: {
        sans: ["Poppins", "sans-serif"],
        serif: ["Allura", "serif"],
        'inter': ['Inter', 'sans-serif'],
      },
      animation: {
        kenburns: "kenburns 15s ease-in-out infinite both",
      },
      keyframes: {
        kenburns: {
          "0%": { transform: "scale(1) translate(0, 0)" },
          "100%": { transform: "scale(1.15) translate(-2%, 2%)" },
        },
      },
    },
  },
  plugins: [],
};
