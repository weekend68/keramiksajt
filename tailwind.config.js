/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        warm: {
          white: '#FAF8F3',
          black: '#3C3530',
          gray: '#78716C',
          beige: '#F5EDE4',
          amber: {
            50: '#FEF3C7',
            600: '#F59E0B',
          }
        }
      },
      fontFamily: {
        serif: ['Georgia', 'Times New Roman', 'serif'],
      }
    },
  },
  plugins: [],
}
