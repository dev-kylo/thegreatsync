// const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      typography: {
        DEFAULT: {
          css: { 
            h1 : {
              fontSize: '36px!important',
              paddingTop: '1rem'
            },
            h2: {
              fontSize: '32px!important',
              margin: '1.2rem 0!important',
              lineHeight: '1!important',
              fontWeight: '800',
            }, 
            h3: {
              fontSize: '22px'
            }, 
            'pre > h2, pre > h3': {
              marginBottom: '1.5em!important'
            },
            'code:before': {
              content: 'l!important'
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
        code_bg: '#011627',
        offwhite: '#dfe8f0'
      },
      // fontFamily: {
      //   sans: ['Utopia Std', 'sans-serif'],
      //   serif: ['Poppins', 'sans-serif'],
      //   primary: ['Utopia Std', 'sans-serif'],
      //   secondary: ['Poppins', 'sans-serif'],
      //   mono: ['Menlo', 'Monaco', 'Consolas', 'Courier New', 'monospace'],
      // },
    },
  },
  plugins: [],
}