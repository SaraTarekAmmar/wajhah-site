/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html'],
  theme: {
    extend: {
      colors: {
        ink: '#07140f',
        panel: '#0c2019',
        panel2: '#0f2a20',
        line: 'rgba(255,255,255,.08)',
        lime: '#8CE562',
        mint: '#4ADE80',
        teal: '#1FA384',
      },
      fontFamily: {
        ar: ['Tajawal', 'sans-serif'],
        en: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
