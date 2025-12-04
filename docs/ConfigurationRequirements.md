# Configuration & Deployment Requirements

## Environment Variables

### Required Variables
```env
# API Keys
GEMINI_API_KEY=                   # Google AI Studio API key
NUXT_PUBLIC_GEMINI_MODEL=gemini-pro

# Supabase (Optional for analytics)
SUPABASE_URL=                     # Your project URL
SUPABASE_ANON_KEY=                # Public anonymous key

# Application
NUXT_PUBLIC_APP_URL=              # Production URL
NUXT_PUBLIC_APP_NAME="AI Prompt Assistant"
NUXT_PUBLIC_COMPANY="Alkholi Group"

# Rate Limiting
RATE_LIMIT_WINDOW=60000           # 60 seconds in ms
RATE_LIMIT_MAX_REQUESTS=60       # Max requests per window

# Feature Flags
ENABLE_ANALYTICS=false            # Toggle Supabase analytics
ENABLE_EXPORT=true                # Toggle export feature
ENABLE_QUALITY_SCORE=true        # Toggle quality scoring

# Development
NODE_ENV=production
DEBUG=false
```

### Optional Variables
```env
# Performance
CACHE_TTL=3600                    # Cache TTL in seconds
MAX_PAYLOAD_SIZE=1048576          # 1MB in bytes

# Monitoring (future)
SENTRY_DSN=                       # Error tracking
GOOGLE_ANALYTICS_ID=              # Analytics
```

## Nuxt Configuration

### nuxt.config.ts Requirements
```typescript
{
  // Framework
  devtools: { enabled: true },
  ssr: true,                       // Server-side rendering
  nitro: {
    preset: 'vercel-edge'          // For Vercel deployment
  },
  
  // Modules
  modules: [
    '@nuxt/ui',                    // UI components
    '@nuxtjs/i18n',                // Internationalization
    '@nuxtjs/google-fonts',        // Font loading
    '@vueuse/nuxt',                // Utilities
    '@nuxtjs/tailwindcss'          // Styling
  ],
  
  // UI Configuration
  ui: {
    primary: 'emerald',
    gray: 'slate',
    icons: ['heroicons', 'lucide']
  },
  
  // i18n Configuration
  i18n: {
    locales: [
      { code: 'en', iso: 'en-US', file: 'en.json', dir: 'ltr' },
      { code: 'ar', iso: 'ar-SA', file: 'ar.json', dir: 'rtl' }
    ],
    defaultLocale: 'en',
    strategy: 'prefix_except_default'
  },
  
  // Google Fonts
  googleFonts: {
    families: {
      Inter: [400, 500, 600, 700, 800],
      'IBM Plex Sans Arabic': [400, 500, 600, 700]
    }
  },
  
  // Runtime Config
  runtimeConfig: {
    geminiApiKey: '',              // Private
    supabaseUrl: '',               // Private
    supabaseKey: '',               // Private
    public: {
      appUrl: '',                  // Public
      appName: '',                 // Public
      geminiModel: ''              // Public
    }
  }
}
```

## Tailwind Configuration

### tailwind.config.js
```javascript
{
  theme: {
    extend: {
      colors: {
        'navy': {
          DEFAULT: '#000046',
          50: '#e6e6f0',
          100: '#b3b3d1',
          200: '#8080b3',
          300: '#4d4d94',
          400: '#1a1a75',
          500: '#000046',
          600: '#00003a',
          700: '#00002e',
          800: '#000022',
          900: '#000016'
        },
        'emerald': {
          DEFAULT: '#45cf7b',
          50: '#e8f9ee',
          100: '#b8ecc9',
          200: '#88dfa4',
          300: '#58d27f',
          400: '#45cf7b',
          500: '#32bc68',
          600: '#28a055',
          700: '#1e8442',
          800: '#14682f',
          900: '#0a4c1c'
        }
      },
      fontFamily: {
        'sans': ['Inter', 'system-ui', 'sans-serif'],
        'arabic': ['IBM Plex Sans Arabic', 'Arial', 'sans-serif']
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'pulse-soft': 'pulseSoft 2s infinite'
      }
    }
  }
}
```

## Deployment Configuration

### Vercel Settings
```json
{
  "buildCommand": "nuxt build",
  "outputDirectory": ".output",
  "devCommand": "nuxt dev",
  "installCommand": "npm install",
  "framework": "nuxtjs",
  "nodeVersion": "20.x",
  "regions": ["iad1"],             // US East for lower latency
  "functions": {
    "api/enhance-prompt.ts": {
      "maxDuration": 30             // 30 seconds timeout
    }
  }
}
```

### Package.json Scripts
```json
{
  "scripts": {
    "dev": "nuxt dev",
    "build": "nuxt build",
    "preview": "nuxt preview",
    "postinstall": "nuxt prepare",
    "lint": "eslint .",
    "test": "vitest",
    "test:ui": "vitest --ui",
    "type-check": "nuxt typecheck"
  }
}
```

## Security Headers

### Headers Configuration
```javascript
{
  'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline' *.google-analytics.com; style-src 'self' 'unsafe-inline' fonts.googleapis.com; font-src 'self' fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' *.googleapis.com *.supabase.co",
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()'
}
```

## Performance Budgets

### Lighthouse Targets
- Performance: > 95
- Accessibility: > 95  
- Best Practices: > 95
- SEO: > 95

### Bundle Size Limits
- Initial JS: < 150KB
- Initial CSS: < 50KB
- Total page weight: < 500KB
- Time to Interactive: < 3s
- First Contentful Paint: < 1s

## Dependencies

### Core Dependencies
```json
{
  "dependencies": {
    "nuxt": "^4.0.0",
    "@nuxt/ui": "^3.0.0",
    "@google/generative-ai": "^0.1.0",
    "@supabase/supabase-js": "^2.39.0",
    "@nuxtjs/i18n": "^8.0.0",
    "@vueuse/nuxt": "^10.7.0"
  },
  "devDependencies": {
    "@nuxtjs/tailwindcss": "^6.10.0",
    "@nuxtjs/google-fonts": "^3.0.0",
    "vitest": "^1.0.0",
    "eslint": "^8.50.0",
    "typescript": "^5.3.0"
  }
}
```

## Monitoring & Logging

### Application Logs
- Log level: INFO in production
- Structured logging (JSON format)
- Include request ID in all logs
- Sanitize sensitive data
- Rotate logs daily

### Metrics to Track
- API response times
- Error rates by endpoint
- Gemini API usage
- Quality scores distribution
- User session duration

## Backup & Recovery

### Data Backup
- Local storage: Browser managed
- Supabase: Automatic daily backups
- Export user data on request

### Disaster Recovery
- Multi-region deployment ready
- Database failover strategy
- CDN for static assets
- Error page fallbacks

## Testing Requirements

### Test Coverage
- Unit tests: > 80%
- Integration tests: Critical paths
- E2E tests: Main user flows
- Accessibility tests: WCAG 2.1 AA
- Performance tests: Load testing

### Testing Tools
- Vitest for unit tests
- Playwright for E2E
- Lighthouse for performance
- axe-core for accessibility

## Development Workflow

### Git Branching
- main: Production branch
- develop: Development branch
- feature/*: Feature branches
- hotfix/*: Emergency fixes

### CI/CD Pipeline
1. Lint and type check
2. Run tests
3. Build application
4. Deploy to staging
5. Run E2E tests
6. Deploy to production

### Code Quality
- ESLint configuration
- Prettier for formatting
- Husky for pre-commit hooks
- Conventional commits
