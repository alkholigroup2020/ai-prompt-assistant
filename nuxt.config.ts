// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  // SSR Configuration
  ssr: true,

  // Deployment preset for Vercel Edge
  nitro: {
    preset: 'vercel-edge'
  },

  // Modules
  modules: [
    '@nuxt/eslint',
    '@nuxt/hints',
    '@nuxt/image',
    '@nuxt/ui',
    '@nuxt/test-utils',
    'nuxt-mcp',
    '@nuxtjs/i18n',
    '@nuxtjs/google-fonts',
    '@vueuse/nuxt',
    '@nuxtjs/tailwindcss'
  ],

  // @nuxt/ui Configuration
  ui: {
    theme: {
      colors: ['emerald', 'navy']
    }
  },

  // i18n Configuration
  i18n: {
    locales: [
      {
        code: 'en',
        iso: 'en-US',
        name: 'English',
        file: 'en.json',
        dir: 'ltr'
      },
      {
        code: 'ar',
        iso: 'ar-SA',
        name: 'العربية',
        file: 'ar.json',
        dir: 'rtl'
      }
    ],
    defaultLocale: 'en',
    strategy: 'prefix_except_default',
    langDir: 'locales',
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_redirected',
      redirectOn: 'root'
    }
  },

  // Google Fonts Configuration
  googleFonts: {
    families: {
      Inter: [400, 500, 600, 700],
      'IBM Plex Sans Arabic': [400, 500, 600, 700]
    },
    display: 'swap',
    preload: true
  },

  // Runtime Configuration
  runtimeConfig: {
    // Server-only secrets
    geminiApiKey: process.env.GEMINI_API_KEY,
    rateLimitWindow: process.env.RATE_LIMIT_WINDOW || '60000',
    rateLimitMaxRequests: process.env.RATE_LIMIT_MAX_REQUESTS || '60',

    // Optional analytics
    supabaseUrl: process.env.SUPABASE_URL || '',
    supabaseAnonKey: process.env.SUPABASE_ANON_KEY || '',

    // Public runtime config (exposed to client)
    public: {
      geminiModel: process.env.NUXT_PUBLIC_GEMINI_MODEL || 'gemini-pro',
      appUrl: process.env.NUXT_PUBLIC_APP_URL || 'http://localhost:3000',
      enableAnalytics: process.env.ENABLE_ANALYTICS === 'true',
      enableTemplates: process.env.ENABLE_TEMPLATES !== 'false',
      enableExport: process.env.ENABLE_EXPORT !== 'false'
    }
  },

  // CSS Configuration
  css: ['~/assets/css/main.css'],

  // TypeScript Configuration
  typescript: {
    strict: true,
    typeCheck: true
  }
})