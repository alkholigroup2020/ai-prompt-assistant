/**
 * Cache Middleware
 * Sets HTTP caching headers for optimal performance
 * Configures cache strategies for different resource types
 */

export default defineEventHandler((event) => {
  const path = event.path || '';

  // Static assets (images, fonts, etc.) - Cache for 1 year
  if (
    path.match(/\.(jpg|jpeg|png|gif|svg|webp|ico|woff|woff2|ttf|eot)$/)
  ) {
    setHeader(
      event,
      'Cache-Control',
      'public, max-age=31536000, immutable'
    );
    return;
  }

  // JavaScript and CSS bundles - Cache for 1 year (content-hashed by Nuxt)
  if (path.match(/\.(js|css)$/) && path.includes('/_nuxt/')) {
    setHeader(
      event,
      'Cache-Control',
      'public, max-age=31536000, immutable'
    );
    return;
  }

  // Health check - Cache for 1 minute
  if (path === '/api/health') {
    setHeader(
      event,
      'Cache-Control',
      'public, max-age=60, stale-while-revalidate=120'
    );
    return;
  }

  // Enhancement and analysis APIs - No cache (user-specific, dynamic content)
  if (
    path.startsWith('/api/enhance-prompt') ||
    path.startsWith('/api/analyze-prompt') ||
    path.startsWith('/api/export')
  ) {
    setHeader(
      event,
      'Cache-Control',
      'no-cache, no-store, must-revalidate, max-age=0'
    );
    setHeader(event, 'Pragma', 'no-cache');
    setHeader(event, 'Expires', '0');
    return;
  }

  // HTML pages - Cache with revalidation (5 minutes)
  if (
    path === '/' ||
    path.startsWith('/builder') ||
    path.startsWith('/results')
  ) {
    setHeader(
      event,
      'Cache-Control',
      'public, max-age=300, stale-while-revalidate=600'
    );
    return;
  }

  // Default - Short cache with revalidation (1 minute)
  setHeader(
    event,
    'Cache-Control',
    'public, max-age=60, stale-while-revalidate=120'
  );
});
