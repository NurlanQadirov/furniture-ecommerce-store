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
        // The home page's "architectural luxury" palette. Namespaced so the
        // rest of the site keeps its green-and-white identity untouched.
        lux: {
          sand: '#FDFBF7',
          cashmere: '#F4EFEA',
          linen: '#E8E0D6',
          obsidian: '#0F0E0C',
          espresso: '#1C1916',
          amber: '#D97706',
          olive: '#556B2F',
          moss: '#2D3A29',
          brass: '#B08D57',
          stone: '#8A8279',
        },
      },
      fontFamily: {
        sans: ['var(--font-poppins)', 'sans-serif'],
        serif: ['var(--font-allura)', 'serif'],
        inter: ['var(--font-inter)', 'sans-serif'],
        // Only defined inside the home page wrapper; see components/home/fonts.ts.
        display: ['var(--font-display)', 'Georgia', 'serif'],
        spec: ['var(--font-spec)', 'ui-monospace', 'monospace'],
      },
      animation: {
        kenburns: 'kenburns 15s ease-in-out infinite both',
        'lux-pulse': 'lux-pulse 2.6s cubic-bezier(0.22, 1, 0.36, 1) infinite',
        'lux-scroll': 'lux-scroll 2.2s cubic-bezier(0.65, 0, 0.35, 1) infinite',
      },
      keyframes: {
        // Transform and opacity only, so both run on the compositor.
        'lux-pulse': {
          '0%': { transform: 'scale(0.75)', opacity: '0.9' },
          '100%': { transform: 'scale(1.9)', opacity: '0' },
        },
        'lux-scroll': {
          '0%': { transform: 'scaleY(0)', transformOrigin: 'top' },
          '45%': { transform: 'scaleY(1)', transformOrigin: 'top' },
          '55%': { transform: 'scaleY(1)', transformOrigin: 'bottom' },
          '100%': { transform: 'scaleY(0)', transformOrigin: 'bottom' },
        },
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
