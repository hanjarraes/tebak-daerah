/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'at-green':  '#5BAD4E',
        'at-sky':    '#87CEEB',
        'at-yellow': '#FFD966',
        'at-blue':   '#4A90D9',
        'at-red':    '#E05A4E',
        'at-purple': '#9B59B6',
        'at-brown':  '#8B6914',
        'at-cream':  '#FFF8E7',
        'at-black':  '#1A1A1A',
      },
      fontFamily: {
        'bubblegum': ['"Bubblegum Sans"', 'cursive'],
        'patrick':   ['"Patrick Hand"', 'cursive'],
      },
      borderWidth: {
        '3': '3px',
      },
    },
  },
  plugins: [],
}
