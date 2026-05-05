import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eef7ee',
          100: '#d5eed1',
          200: '#b4dfad',
          300: '#8dc281',
          400: '#63a459',
          500: '#3e8538',
          600: '#2f6a2d',
          700: '#265326',
          800: '#234822',
          900: '#203f1f',
        },
      },
      boxShadow: {
        soft: '0 20px 50px rgba(15, 23, 42, 0.08)',
        'soft-hover': '0 30px 60px rgba(15, 23, 42, 0.12)',
        card: '0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.025)',
      },
      animation: {
        'fade-slide-up': 'fadeSlideUp 0.3s ease-out',
        shake: 'shake 0.3s ease-in-out',
      },
      keyframes: {
        fadeSlideUp: {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '25%': { transform: 'translateX(-5px)' },
          '75%': { transform: 'translateX(5px)' },
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
