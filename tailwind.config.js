/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'bounce': 'bounce 1s ease-in-out',
        'ping': 'ping 1s cubic-bezier(0, 0, 0.2, 1)',
        'pulse': 'pulse 1s cubic-bezier(0.4, 0, 0.6, 1)'
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        }
      }
    }
  },
  plugins: [],
}