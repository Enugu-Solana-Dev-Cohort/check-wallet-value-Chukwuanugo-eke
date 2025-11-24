/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        solana: {
          purple: '#9945FF',
          green: '#14F195',
          blue: '#00D4FF',
          pink: '#DC1FFF',
        }
      },
      animation: {
        'float': 'float 20s ease-in-out infinite',
        'float-slow': 'float 25s ease-in-out infinite',
        'float-slower': 'float 30s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translate(0, 0) rotate(0deg)' },
          '25%': { transform: 'translate(100px, -100px) rotate(90deg)' },
          '50%': { transform: 'translate(200px, 50px) rotate(180deg)' },
          '75%': { transform: 'translate(-50px, 100px) rotate(270deg)' },
        },
        glow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(153, 69, 255, 0.5)' },
          '50%': { boxShadow: '0 0 40px rgba(153, 69, 255, 0.8), 0 0 60px rgba(153, 69, 255, 0.6)' },
        }
      }
    },
  },
  plugins: [],
}
