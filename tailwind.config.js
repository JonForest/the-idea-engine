const colors = require('tailwindcss/colors');

module.exports = {
  purge: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {},
    colors: {
      red: colors.red,
      gray: colors.gray,
      green: colors.green,
      purple: colors.purple,
      orange: colors.orange,
    },
    animation: {
      pulse: "pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite;"
    },
    keyframes: {
      pulse: {
        '0%, 100%': {
          opacity: 0,
        },
        '50%': {
          opacity: 1,
        },
      },
    },
  },
  variants: {
    extend: {
      boxShadow: ['active'],
    },
  },
  plugins: [require('@tailwindcss/forms')],
};
