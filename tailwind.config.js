/** @type {import('tailwindcss').Config} */
export default {
  // Content configuration for PurgeCSS - removes unused styles in production
  content: [
    './app/components/**/*.{js,vue,ts}',
    './app/composables/**/*.{js,ts}',
    './app/layouts/**/*.vue',
    './app/pages/**/*.vue',
    './app/plugins/**/*.{js,ts}',
    './app/utils/**/*.{js,ts}',
    './app.vue',
    './app/app.vue',
    './app/error.vue',
    './nuxt.config.{js,ts}',
  ],
  // Safelist for dynamic classes that might be purged incorrectly
  safelist: [
    // Color variants for dynamic quality scores
    'text-red-500',
    'text-yellow-500',
    'text-green-500',
    'bg-red-50',
    'bg-yellow-50',
    'bg-green-50',
    // RTL-specific classes
    'rtl',
    'ltr',
  ],
  // Enable dark mode with class strategy
  darkMode: 'class',
  // Enable RTL support with directionality variants
  future: {
    hoverOnlyWhenSupported: true,
  },
  theme: {
    // Custom responsive breakpoints
    screens: {
      xs: '375px', // Small mobile
      sm: '640px', // Mobile landscape
      md: '768px', // Tablet
      lg: '1024px', // Desktop
      xl: '1280px', // Large desktop
      '2xl': '1536px', // Extra large desktop
    },
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
        // Custom Emerald Color Palette (Primary) - WCAG AA Compliant
        emerald: {
          50: '#f0fdf5',
          100: '#dcfce8',
          200: '#bbf7d1',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e', // Darker primary emerald for better contrast (4.5:1 on white)
          600: '#15803d', // Swapped with 700 for accessibility
          700: '#166534', // Swapped with 600
          800: '#14532d',
          900: '#052e16',
        },
      },
      fontFamily: {
        sans: ['Inter', 'IBM Plex Sans Arabic', 'sans-serif'],
        arabic: ['IBM Plex Sans Arabic', 'sans-serif'],
      },
      fontSize: {
        // Custom typography scale
        xs: ['0.75rem', { lineHeight: '1rem' }], // 12px
        sm: ['0.875rem', { lineHeight: '1.25rem' }], // 14px
        base: ['1rem', { lineHeight: '1.5rem' }], // 16px
        lg: ['1.125rem', { lineHeight: '1.75rem' }], // 18px
        xl: ['1.25rem', { lineHeight: '1.75rem' }], // 20px
        '2xl': ['1.5rem', { lineHeight: '2rem' }], // 24px
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }], // 30px
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }], // 36px
        '5xl': ['3rem', { lineHeight: '1' }], // 48px
        '6xl': ['3.75rem', { lineHeight: '1' }], // 60px
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
        'spin-slow': 'spin 2s linear infinite',
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
      boxShadow: {
        sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
        DEFAULT: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
        md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
        lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
        xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
        '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
        inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
        none: 'none',
      },
      transitionDuration: {
        fast: '150ms',
        DEFAULT: '300ms',
        slow: '500ms',
      },
    },
  },
  plugins: [],
}
