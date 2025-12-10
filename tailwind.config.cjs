/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{ts,tsx,js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          navy: '#215681',
          blue: '#4A86B7',
          green: '#5CBF88',
          amber: '#E3A857',
          offWhite: '#F7F9FC',
          charcoal: '#1F2A35',
          slate: '#334155',
        },
      },
    },
  },
  plugins: [],
};
