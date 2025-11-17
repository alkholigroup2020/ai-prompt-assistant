/**
 * CORS Middleware
 * Handles Cross-Origin Resource Sharing (CORS) headers
 */

export default defineEventHandler((event) => {
  const config = useRuntimeConfig();
  const origin = getHeader(event, 'origin');

  // Get allowed origins from config or use default
  const allowedOrigins = [
    config.public.appUrl || 'http://localhost:3000',
    'http://localhost:3000'
  ];

  // Check if origin is allowed
  const isAllowedOrigin = origin && allowedOrigins.includes(origin);

  // Set CORS headers
  if (isAllowedOrigin) {
    setHeader(event, 'Access-Control-Allow-Origin', origin);
  }

  setHeader(event, 'Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  setHeader(event, 'Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Session-ID');
  setHeader(event, 'Access-Control-Allow-Credentials', 'true');
  setHeader(event, 'Access-Control-Max-Age', 86400); // 24 hours

  // Handle preflight requests
  if (event.node.req.method === 'OPTIONS') {
    setResponseStatus(event, 204);
    return '';
  }
});
