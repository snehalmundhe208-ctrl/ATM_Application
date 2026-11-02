/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#E88745',
          light: '#F2A066',
          dark: '#CF6F2E',
          50: '#FDF7F2',
          100: '#FBECE3',
          200: '#F7D4BE',
          500: '#E88745',
          600: '#D9732F',
          700: '#B6591E',
        },
        cream: {
          DEFAULT: '#FFF8F0',
          50: '#FFFCF8',
          100: '#FFF8F0',
          200: '#F9EFE4',
          300: '#F5EEE6',
        },
        beige: {
          DEFAULT: '#F5EEE6',
          light: '#FAF5EE',
          dark: '#E8DDD2',
        },
        charcoal: {
          DEFAULT: '#292929',
          light: '#4A4A4A',
          muted: '#737373',
          dark: '#1C1C1C',
        },
        atm: {
          success: '#2E7D32',
          successBg: '#E8F5E9',
          error: '#D32F2F',
          errorBg: '#FFEBEE',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', '"Liberation Mono"', '"Courier New"', 'monospace'],
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(41, 41, 41, 0.05), 0 2px 6px -1px rgba(41, 41, 41, 0.03)',
        'soft-lg': '0 10px 30px -4px rgba(41, 41, 41, 0.08), 0 4px 10px -2px rgba(41, 41, 41, 0.04)',
        'keypad': '0 4px 0 #CF6F2E, 0 6px 12px rgba(0,0,0,0.1)',
        'keypad-pressed': '0 1px 0 #CF6F2E, 0 2px 4px rgba(0,0,0,0.1)',
        'receipt': '0 15px 35px rgba(0,0,0,0.12), 0 5px 15px rgba(0,0,0,0.06)',
      }
    },
  },
  plugins: [],
}
