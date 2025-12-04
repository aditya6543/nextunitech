/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f3e8ff',
          100: '#e9d5ff',
          200: '#d8b4fe',
          300: '#c084fc',
          400: '#a855f7',
          500: '#6b21a8',
          600: '#7e22ce',
          700: '#6b21a8',
          800: '#5b21b6',
          900: '#4a148c',
        },
        background: {
          dark: '#121212',
          light: '#f4f4f4',
        },
      },
      backgroundImage: {
        'gradient-start': 'linear-gradient(135deg, #6b21a8, #4a148c, #311b92)',
      },
      animation: {
        'gradient-x': 'gradient-x 15s ease infinite',
      },
      keyframes: {
        'gradient-x': {
          '0%': { 'background-position': '0% 50%' },
          '50%': { 'background-position': '100% 50%' },
          '100%': { 'background-position': '0% 50%' },
        },
      },
    },
  },
  plugins: [],
};
