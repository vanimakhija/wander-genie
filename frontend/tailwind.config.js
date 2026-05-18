/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
        },
      },
      animation: {
        'fade-up':    'fadeUp 0.55s ease-out forwards',
        'fade-in':    'fadeIn 0.4s ease-out forwards',
        shimmer:      'shimmer 1.8s infinite linear',
        'spin-slow':  'spin 7s linear infinite',
        pulse2:       'pulse 2.5s cubic-bezier(0.4,0,0.6,1) infinite',
        glow:         'glow 3s ease-in-out infinite',
      },
      keyframes: {
        fadeUp:  { '0%': { opacity: '0', transform: 'translateY(20px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
        fadeIn:  { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        shimmer: { '0%': { backgroundPosition: '-200% 0' }, '100%': { backgroundPosition: '200% 0' } },
        glow:    { '0%,100%': { opacity: '0.35' }, '50%': { opacity: '0.75' } },
      },
      boxShadow: {
        glass:      '0 8px 32px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.08)',
        'glow-brand': '0 0 35px rgba(14,165,233,0.25)',
      },
    },
  },
  plugins: [],
}
