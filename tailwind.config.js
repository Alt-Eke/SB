/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'lexend': ['Lexend', 'sans-serif'],
      },
      colors: {
        navy: {
          DEFAULT: 'rgb(8, 44, 108)',
          light: 'rgba(8, 44, 108, 0.8)',
          lighter: 'rgba(8, 44, 108, 0.1)',
          subtle: 'rgba(8, 44, 108, 0.05)',
        },
        red: {
          DEFAULT: '#e63946',
          light: 'rgba(230, 57, 70, 0.1)',
        },
        custom: {
          white: '#ffffff',
          'off-white': '#f8f9fa',
          'light-gray': '#e9ecef',
          'medium-gray': '#dee2e6',
          'dark-gray': '#6c757d',
          'text-dark': '#212529',
        },
      },
    },
  },
  plugins: [],
}
