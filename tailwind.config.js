const colors = require('tailwindcss/colors')

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
    }
  },
  variants: {
    extend: {
      boxShadow: ['active']
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
