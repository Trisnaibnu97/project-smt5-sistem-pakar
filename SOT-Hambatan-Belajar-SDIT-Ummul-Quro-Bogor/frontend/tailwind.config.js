/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx,html}'],
  theme: {
    extend: {
      colors: {
        primary: { DEFAULT: '#15803D', dark: '#166534', light: '#DCFCE7' },
        accent:  { DEFAULT: '#F97316', light: '#FFEDD5' },
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
    },
  },
  plugins: [],
};
