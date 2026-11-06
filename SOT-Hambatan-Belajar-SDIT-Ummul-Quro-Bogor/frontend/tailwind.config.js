/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx,html}'],
  theme: {
    extend: {
      colors: {
        primary: { DEFAULT: '#15803D', dark: '#166534', light: '#DCFCE7' },
        accent:  { DEFAULT: '#F97316', light: '#FFEDD5' },
        amber:   { DEFAULT: '#F59E0B', dark: '#D97706', light: '#FEF3C7' },
        navy:    { DEFAULT: '#1E3A5F', dark: '#162D4A', light: '#E8EEF4' },
        sage:    { DEFAULT: '#E8F0E5', dark: '#D1E2CC', light: '#F4F8F3' },
        ink:     '#1F2937',
        muted:   '#64748B',
        surface: '#FFFFFF',
        page:    '#F8FAFC',
        border:  '#E2E8F0',
        info:    '#0369A1',
        warning: '#B45309',
        danger:  '#B91C1C',
      },
      fontFamily: { sans: ['Inter', 'system-ui', 'sans-serif'] },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'float-delayed': 'float 6s ease-in-out 2s infinite',
        'slide-up': 'slideUp 0.6s ease-out both',
        'slide-up-delayed': 'slideUp 0.6s ease-out 0.15s both',
        'slide-up-delayed-2': 'slideUp 0.6s ease-out 0.3s both',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(24px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};
