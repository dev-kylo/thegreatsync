module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
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
        sans: ['Graphik', 'sans-serif'],
        serif: ['Merriweather', 'serif'],
        primary: ['Graphik', 'sans-serif'],
        secondary: ['Poppins', 'sans-serif']
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}