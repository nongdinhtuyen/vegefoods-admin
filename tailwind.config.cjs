/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      backgroundColor: {
        primary: '#82ae46',
      },
      colors: {
        primary: '#82ae46',
      },
      borderColor: {
        primary: '#82ae46',
      },
      width: {
        modal: 448,
      },
      maxWidth: {
        container: 1140,
      },
      gridTemplateColumns: {
        auto: 'auto 1fr',
      },
    },
  },
  plugins: [],
  corePlugins: {
    preflight: false, // <== disable this!
  },
};
