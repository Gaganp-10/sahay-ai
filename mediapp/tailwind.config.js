/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        medi: {
          blue: '#00C6FF',
          blueDeep: '#0072FF',
          mint: '#00F5A0',
          red: '#FF6B6B',
          purple: '#A78BFA',
          dark: '#050B18',
          card: 'rgba(255,255,255,0.04)',
        }
      },
      fontFamily: {
        display: ['Syne', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        mono: ['DM Mono', 'monospace'],
      },
      backdropBlur: { xl: '20px' },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        'spin-slow': 'spin 3s linear infinite',
        'dash': 'dash 2s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        dash: {
          'to': { strokeDashoffset: 0 },
        }
      }
    }
  },
  plugins: [],
}
