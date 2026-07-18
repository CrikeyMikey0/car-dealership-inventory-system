/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f8fafc',
          100: '#f1f5f9',
          500: '#3b82f6',
          900: '#0f172a',
        },
        white: '#fcfcfc',
        black: '#0a0a0a',
      },
    },
  },
  plugins: [],
};
