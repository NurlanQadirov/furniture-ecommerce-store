import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'custom-green': '#ecfaec',
        'dark-green': '#166639',
        'custom-black': '#202020',
      },
      fontFamily: {
        sans: ['var(--font-poppins)', 'sans-serif'],
        serif: ['var(--font-allura)', 'serif'],
        inter: ['var(--font-inter)', 'sans-serif'],
      },
      animation: {
        kenburns: 'kenburns 15s ease-in-out infinite both',
      },
      keyframes: {
        kenburns: {
          '0%': { transform: 'scale(1) translate(0, 0)' },
          '100%': { transform: 'scale(1.15) translate(-2%, 2%)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
