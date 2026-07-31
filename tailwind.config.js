/** @type {import('tailwindcss').Config} */
/**
 * Qualift brand toolkit v1 — indigo leads, matcha = success only,
 * apricot = warm callouts (always #78350F text), ink text, warm white bg, sand borders.
 * Existing component classes (purple-*, teal-*, coral-*) are remapped to brand
 * colors so the whole app reskins from this single file.
 */
module.exports = {
  content: ['./app/**/*.{js,jsx}', './components/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Lead — indigo. purple-400 = brand indigo #4F46E5, purple-600 = hover #4338CA (kit spec)
        purple: { 50:'#EEF2FF', 100:'#E0E7FF', 200:'#C7D2FE', 400:'#4F46E5', 600:'#4338CA', 800:'#3730A3', 900:'#312E81' },
        // Success — matcha ("you're in" green, success/confirmation states only)
        teal:   { 50:'#EAF2EB', 100:'#D5E5D8', 400:'#618B68', 600:'#4D6E53', 700:'#4D6E53', 800:'#3A5440' },
        // Warm callouts — apricot (always dark #78350F text, never white)
        coral:  { 50:'#FDF3E3', 100:'#FAE3BC', 200:'#F7CF8C', 400:'#F59E0B', 600:'#B45309', 700:'#78350F', 800:'#78350F' },
        amber:  { 50:'#FDF3E3', 400:'#F59E0B', 800:'#78350F' },
        // Warm neutrals — ink (#1E1B2E) text, sand (#E7E0D5) borders, warm white surfaces
        gray: {
          50:'#FAF6EF', 100:'#F3EDE1', 200:'#E7E0D5', 300:'#D8CFC0',
          400:'#A69D8D', 500:'#7C7365', 600:'#5C5548', 700:'#453F51',
          800:'#2E2A3D', 900:'#1E1B2E',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['"Bricolage Grotesque"', 'Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: { DEFAULT: '8px', lg: '12px', xl: '16px' },
    },
  },
  plugins: [],
}
