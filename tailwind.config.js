/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './app/components/**/*.{js,vue,ts}',
    './app/layouts/**/*.vue',
    './app/pages/**/*.vue',
    './app/plugins/**/*.{js,ts}',
    './app.vue',
    './app/app.vue',
    './app/error.vue',
  ],
  // Enable RTL support with directionality variants
  future: {
    hoverOnlyWhenSupported: true,
  },
  theme: {
    extend: {
      colors: {
        // Custom Navy Color Palette
        navy: {
          50: '#e6e6f0',
          100: '#b3b3d6',
          200: '#8080bd',
          300: '#4d4da3',
          400: '#26268f',
          500: '#000046', // Primary navy
          600: '#00003f',
          700: '#000036',
          800: '#00002e',
          900: '#000020',
        },
        // Custom Emerald Color Palette (Primary)
        emerald: {
          50: '#f0fdf5',
          100: '#dcfce8',
          200: '#bbf7d1',
          300: '#86efac',
          400: '#4ade80',
          500: '#45cf7b', // Primary emerald
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
        },
      },
      fontFamily: {
        sans: ['Inter', 'IBM Plex Sans Arabic', 'sans-serif'],
        arabic: ['IBM Plex Sans Arabic', 'sans-serif'],
      },
      spacing: {
        // 8px grid system
        0: '0',
        1: '8px',
        2: '16px',
        3: '24px',
        4: '32px',
        5: '40px',
        6: '48px',
        7: '56px',
        8: '64px',
        9: '72px',
        10: '80px',
        11: '88px',
        12: '96px',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'slide-down': 'slideDown 0.4s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
      borderRadius: {
        DEFAULT: '8px',
        sm: '4px',
        md: '8px',
        lg: '12px',
        xl: '16px',
        '2xl': '24px',
        full: '9999px',
      },
    },
  },
  plugins: [],
}
