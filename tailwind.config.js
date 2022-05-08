module.exports = {
  content: ['./components/**/*.{js,vue,ts}', './layouts/**/*.vue', './pages/**/*.vue', './plugins/**/*.{js,ts}', './nuxt.config.{js,ts}'],
  theme: {
    fontFamily: {
      sans: ['Inter', 'ui-sans-serif', 'system-ui', 'Segoe UI', 'sans-serif'],
    },
    extend: {
      colors: {
        primary: {
          50: '#d7f2ff',
          100: '##c3ebff',
          200: '#9cdeff',
          300: '#75D1FF',
          400: '#3abdff',
          500: '#36A5DD',
          600: '#2291ca',
          700: '#114965',
          800: '#092533',
          900: '#061822',
        },
        bg: {
          50: '#e1e4e5',
          100: '#c2c7ca',
          200: '#78848a',
          300: '#6f7a80',
          400: '#5d666b',
          500: '#40464a',
          600: '#2f3436',
          700: '#1d2021',
          800: '#141617',
          900: '#0b0c0c',
        },
      },
    },
  },
  plugins: [],
}
