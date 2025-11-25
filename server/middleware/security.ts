/**
 * Security Middleware
 * Sets security-related HTTP headers to protect against common web vulnerabilities
 */

export default defineEventHandler((event) => {
  const config = useRuntimeConfig();

  // Check if in development mode
  const isDevelopment = process.env.NODE_ENV === 'development';

  // Content Security Policy (CSP)
  // Restricts resources the page can load to prevent XSS attacks
  const cspDirectives = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://fonts.googleapis.com",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data: https:",
    "connect-src 'self' https://generativelanguage.googleapis.com" + (isDevelopment ? " ws: wss:" : ""),
    // Allow frames from same origin in development (for Nuxt devtools)
    "frame-src 'self'" + (isDevelopment ? " http://localhost:* ws://localhost:*" : ""),
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'"
  ].join('; ');

  setHeader(event, 'Content-Security-Policy', cspDirectives);

  // X-Frame-Options
  // Prevents clickjacking attacks by controlling whether the page can be framed
  setHeader(event, 'X-Frame-Options', 'DENY');

  // X-Content-Type-Options
  // Prevents MIME type sniffing
  setHeader(event, 'X-Content-Type-Options', 'nosniff');

  // X-XSS-Protection
  // Enables browser's XSS filtering (legacy browsers)
  setHeader(event, 'X-XSS-Protection', '1; mode=block');

  // Referrer-Policy
  // Controls how much referrer information is sent with requests
  setHeader(event, 'Referrer-Policy', 'strict-origin-when-cross-origin');

  // Permissions-Policy
  // Controls which browser features and APIs can be used
  const permissionsPolicy = [
    'camera=()',
    'microphone=()',
    'geolocation=()',
    'payment=()',
    'usb=()',
    'magnetometer=()',
    'gyroscope=()',
    'accelerometer=()'
  ].join(', ');

  setHeader(event, 'Permissions-Policy', permissionsPolicy);

  // Strict-Transport-Security (HSTS)
  // Forces HTTPS connections (only in production)
  if (config.public.appUrl?.startsWith('https://')) {
    setHeader(event, 'Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  }

  // X-Powered-By
  // Remove or customize to avoid revealing technology stack
  setHeader(event, 'X-Powered-By', '');

  // Request size limit (1MB)
  const contentLength = getHeader(event, 'content-length');
  if (contentLength && parseInt(contentLength) > 1024 * 1024) {
    throw createError({
      statusCode: 413,
      statusMessage: 'Payload Too Large',
      data: {
        success: false,
        error: {
          code: 'PAYLOAD_TOO_LARGE',
          message: 'Request body exceeds maximum size of 1MB'
        }
      }
    });
  }
});
