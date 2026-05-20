/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        cinzel: ['Cinzel', 'serif'],
        uncial: ['Uncial Antiqua', 'cursive'],
        lora: ['Lora', 'serif'],
      },
      colors: {
        obsidian: '#0a0a0f',
        'blood-dark': '#1a0505',
        'gold-dim': '#b8860b',
        'gold-bright': '#ffd700',
        'ember': '#c0392b',
        'frost': '#a8d8ea',
        'mist': '#8fa8b8',
        'parchment': '#f4e4c1',
        'shadow': '#1e1e2e',
      },
      animation: {
        'slide-up': 'slideUp 0.5s ease-out',
        'fade-in': 'fadeIn 0.8s ease-out',
        'text-glow': 'textGlow 2s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
