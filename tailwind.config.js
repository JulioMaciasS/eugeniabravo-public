/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      animation: {
        spin: 'spin 1s linear infinite',
      },
      keyframes: {
        spin: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
      },
      colors: {
        navy: {
          50: '#f5f7fa',
          100: '#eaeef4',
          200: '#d1dbe6',
          300: '#a7bcd1',
          400: '#7797b9',
          500: '#5577a1',
          600: '#435f87',
          700: '#384d6d',
          800: '#31425b',
          900: '#2c394d',
        },
        gold: {
          50: '#fdfaf4',
          100: '#fbf5e8',
          200: '#f5e7c5',
          300: '#efd5a1',
          400: '#e4b86c',
          500: '#d99b37',
          600: '#c17d1f',
          700: '#a1611b',
          800: '#834d1c',
          900: '#6b3f1b',
        },
      },
      fontFamily: {
        sans: ['Montserrat', 'system-ui', 'sans-serif'],
        lora: ['Lora', 'serif'],
        inter: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
    screens: {
      xs: '480px',
      ...require('tailwindcss/defaultTheme').screens,
    },
  },
  plugins: [],
};