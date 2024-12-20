/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        'fade-in-LTR': 'fadeInLTR 1s ease-in-out forwards',
        'fade-in-RTL': 'fadeInRTL 1s ease-in-out forwards',
        'fade-in-TtB': 'fadeInTtB 1s ease-in-out forwards',
        'fade-in-BtT': 'fadeInBtT 1s ease-in-out forwards'
      },
      keyframes: {
        fadeInLTR: {
          '0%': {opacity: '0', transform: 'translateX(-50px) scale(0.95)'},
          '100%': {opacity: '100', transform: 'translateX(0) scale(1)'}
        },
        fadeInRTL: {
          '0%': {opacity: '0', transform: 'translateX(50px) scale(0.95)'},
          '100%': {opacity: '100', transform: 'translateX(0) scale(1)'}
        },
        fadeInTtB: {
          '0%': {transform: 'translateY(-100px)'},
          '100%': {transform: 'translateY(0)'}
        },
        fadeInBtT: {
          '0%': {transform: 'translateY(100px)'},
          '100%': {transform: 'translateY(0)'}
        },
      }
    },
  },
  plugins: [],
}

