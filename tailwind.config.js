/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx}', './components/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        purple: { 50:'#EEEDFE', 100:'#CECBF6', 200:'#AFA9EC', 400:'#7F77DD', 600:'#534AB7', 800:'#3C3489', 900:'#26215C' },
        teal:   { 50:'#E1F5EE', 100:'#9FE1CB', 400:'#1D9E75', 600:'#0F6E56', 800:'#085041' },
        coral:  { 50:'#FAECE7', 100:'#F5C4B3', 400:'#D85A30', 600:'#993C1D', 800:'#712B13' },
        amber:  { 50:'#FEF9EE', 400:'#F0C97B', 800:'#92560A' },
      },
      fontFamily: { sans: ['Inter', 'system-ui', 'sans-serif'] },
      borderRadius: { DEFAULT: '8px', lg: '12px', xl: '16px' },
    },
  },
  plugins: [],
}
