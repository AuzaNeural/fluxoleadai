/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        bg: '#000000',
        surface: {
          DEFAULT: '#0d0d0d',
          2: '#141313',
          3: '#1a1818',
        },
        line: {
          DEFAULT: '#2a2a2a',
          strong: '#3b3b3b',
        },
        border: {
          DEFAULT: '#2a2a2a',
          strong: '#3b3b3b',
        },
        fg: {
          DEFAULT: '#fafafa',
          2: '#b9b9b9',
          3: '#929292',
        },
        accent: {
          DEFAULT: '#fa2600',
          2: '#ff4d01',
          glow: '#ff3911',
          soft: '#ff7f5f',
          tint: '#ffc6ae',
        },
        success: {
          DEFAULT: '#3ccf7a',
        },
        danger: {
          DEFAULT: '#ff4d5e',
        },
        warning: {
          DEFAULT: '#f5b544',
        },
        info: {
          DEFAULT: '#6aa7ff',
        },
        dark: {
          bg: '#0a0a0a',
          card: '#121212',
          cardHover: '#181818',
          border: '#262626',
          borderHover: '#383838',
          textMuted: '#9ca3af',
        },
        brand: {
          orange: '#ff5500',
          orangeDark: '#e04000',
          orangeLight: '#ff7733',
          glow: 'rgba(255, 85, 0, 0.4)',
        }
      },
      boxShadow: {
        'glow-orange': '0 0 25px -5px rgba(255, 85, 0, 0.5), 0 0 10px -5px rgba(255, 85, 0, 0.3)',
        'glow-orange-lg': '0 0 40px -5px rgba(255, 85, 0, 0.6), 0 0 15px -3px rgba(255, 85, 0, 0.4)',
        'card-glow': '0 4px 20px -2px rgba(0, 0, 0, 0.5)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [],
}
