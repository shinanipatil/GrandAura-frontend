/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        gold: {
          50: '#FBF7ED',
          100: '#F5EBD4',
          200: '#E8D4A8',
          300: '#D4B87A',
          400: '#C9A227',
          500: '#B8860B',
          600: '#9A7209',
          700: '#7A5A07',
        },
        luxury: {
          dark: '#0D0D0D',
          charcoal: '#1A1A1A',
          cream: '#F5F0E8',
          burgundy: '#4A0E0E',
          wine: '#722F37',
        },
      },
      fontFamily: {
        display: ['Cormorant Garamond', 'Georgia', 'serif'],
        body: ['Montserrat', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out',
        'slide-up': 'slideUp 0.6s ease-out',
      },
      keyframes: {
        fadeIn: { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        slideUp: { '0%': { opacity: '0', transform: 'translateY(20px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
      },
    },
  },
  plugins: [],
};
