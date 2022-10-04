// const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      typography: {
        DEFAULT: {
          css: {
            'h1, h2, h3': {
              color: '#BDD5E9'
            },
            h1: {
              fontSize: '32px'
            }, 
            h2: {
              fontSize: '28px',
              margin: '1em 0'
            }, 
            h3: {
              fontSize: '22px'
            }, 
            'pre > h2, pre > h3': {
              marginBottom: '1.5em!important'
            }
          }
        }
      },
      colors: {
        primary_green: '#008579',
        primary_blue: '#03143F',
        secondary_lightblue: '#BDD5E9',
        seondary_purple: '#5F597F',
        secondary_dark: '#2B2B2B',
        secondary_blue: '#0B349E',
        secondary_red: '#AC3428',
        secondary_pink: '#FFC0CB',
      },
      fontFamily: {
        sans: ['Utopia Std', 'sans-serif'],
        serif: ['Poppins', 'sans-serif'],
        primary: ['Utopia Std', 'sans-serif'],
        secondary: ['Poppins', 'sans-serif'],
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    require('tailwind-scrollbar'),
  ],
}