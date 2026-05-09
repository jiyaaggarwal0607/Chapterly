/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        serif: ['Merriweather', 'Georgia', 'serif']
      },
      colors: {
        ink: '#17201f',
        paper: '#faf8f3',
        sage: '#6b8f71',
        oxblood: '#7c2f2f',
        brass: '#b5823a'
      },
      boxShadow: {
        soft: '0 18px 50px rgba(23, 32, 31, 0.10)'
      }
    }
  },
  plugins: []
};
