// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  // SSR Configuration
  ssr: true,

  // Deployment preset for Vercel Edge
  nitro: {
    preset: 'vercel-edge',
  },

  // Dev server configuration - hardcoded to port 3000
  devServer: {
    port: 5000,
    host: 'localhost',
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
    '@nuxt/fonts',
    '@vueuse/nuxt',
    '@pinia/nuxt',
  ],

  // @nuxt/ui Configuration
  ui: {
    theme: {
      colors: ['emerald', 'navy'],
    },
  },

  // i18n Configuration
  i18n: {
    langDir: 'locales',
    locales: [
      {
        code: 'en',
        iso: 'en-US',
        name: 'English',
        file: 'en.json',
      },
      {
        code: 'ar',
        iso: 'ar-SA',
        name: 'العربية',
        file: 'ar.json',
      },
    ],
    defaultLocale: 'en',
    strategy: 'prefix_except_default',
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_redirected',
      redirectOn: 'root',
    },
  },

  // Nuxt Fonts Configuration
  fonts: {
    families: [
      // English font
      { name: 'Inter', provider: 'google', weights: [400, 500, 600, 700] },
      // Arabic font - El Messiri
      { name: 'El Messiri', provider: 'google', weights: [400, 500, 600, 700] },
    ],
    defaults: {
      weights: [400, 500, 600, 700],
      styles: ['normal'],
      preload: true,
    },
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
      enableExport: process.env.ENABLE_EXPORT !== 'false',
    },
  },

  // CSS Configuration
  css: ['~/assets/css/main.css'],

  // TypeScript Configuration
  typescript: {
    strict: true,
    // Disable type checking in dev mode to avoid Nuxt UI slot typing errors
    // Type checking still runs during build and via `nuxt typecheck` command
    typeCheck: process.env.NODE_ENV === 'production' ? true : false,
  },

  // Vite Configuration for Code Splitting
  vite: {
    build: {
      // Enable minification (esbuild is default and faster than terser)
      minify: 'esbuild',
      // Target modern browsers for smaller bundle sizes
      target: 'es2020',
      // Enable CSS code splitting
      cssCodeSplit: true,
      // Optimize chunk splitting
      rollupOptions: {
        output: {
          manualChunks(id) {
            // Split node_modules into vendor chunks
            if (id.includes('node_modules')) {
              // VueUse utilities
              if (id.includes('@vueuse')) {
                return 'vueuse-vendor'
              }
              // Core Vue packages
              if (id.includes('vue-router') || id.includes('vue-i18n')) {
                return 'vue-vendor'
              }
              // Don't manually chunk @nuxt packages (they're handled by Nuxt)
              if (id.includes('@nuxt')) {
                return undefined
              }
            }
          },
        },
        // Tree-shaking optimization
        treeshake: {
          moduleSideEffects: 'no-external',
          propertyReadSideEffects: false,
          tryCatchDeoptimization: false,
        },
      },
      // Set chunk size warnings
      chunkSizeWarningLimit: 500,
      // Report compressed size for better bundle analysis
      reportCompressedSize: true,
      // Source maps for production debugging (set to false for smaller bundles)
      sourcemap: false,
    },
    optimizeDeps: {
      include: ['vue', 'vue-router', 'vue-i18n'],
    },
  },

  // Route Rules for static generation and caching
  routeRules: {
    // Static pages - prerender at build time
    '/': { prerender: true },

    // Templates can be cached client-side
    '/templates': { swr: 3600 }, // Cache for 1 hour
    '/templates/**': { swr: 3600 },

    // Builder and results are dynamic, no caching
    '/builder': { ssr: true },
    '/results': { ssr: true },
  },

  // Experimental features
  experimental: {
    // Enable payload extraction for better performance
    payloadExtraction: true,

    // Component islands for partial hydration
    componentIslands: true,
  },

  // App Configuration
  app: {
    head: {
      // Charset and viewport meta tags
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',

      // Resource hints for better loading performance
      link: [
        // Preconnect to Google Fonts
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: 'anonymous' },

        // DNS prefetch for Gemini API (for faster API connections)
        { rel: 'dns-prefetch', href: 'https://generativelanguage.googleapis.com' },
      ],

      // Script loading configuration
      script: [
        // Scripts will be automatically deferred by Nuxt 4
        // This is just a placeholder for any future third-party scripts
      ],
    },
  },

  // Build configuration for script optimization
  build: {
    // Analyze bundle size (set to true for development analysis)
    analyze: false,

    // Transpile configuration
    transpile: [],
  },
})
