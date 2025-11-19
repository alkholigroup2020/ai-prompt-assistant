# Security Headers Testing Guide

## Overview

This document explains how to verify the security headers implementation for the AI Prompt Assistant application.

## Implemented Security Headers

All required security headers have been implemented in `/server/middleware/security.ts`:

### 1. Content Security Policy (CSP)
**Header**: `Content-Security-Policy`

**Value**:
```
default-src 'self';
script-src 'self' 'unsafe-inline' 'unsafe-eval' https://fonts.googleapis.com;
style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
font-src 'self' https://fonts.gstatic.com;
img-src 'self' data: https:;
connect-src 'self' https://generativelanguage.googleapis.com;
frame-ancestors 'none';
base-uri 'self';
form-action 'self'
```

**Purpose**: Prevents XSS attacks by restricting which resources can be loaded.

### 2. X-Frame-Options
**Header**: `X-Frame-Options: DENY`

**Purpose**: Prevents clickjacking attacks by blocking the page from being embedded in iframes.

### 3. X-Content-Type-Options
**Header**: `X-Content-Type-Options: nosniff`

**Purpose**: Prevents MIME type sniffing, ensuring browsers respect declared content types.

### 4. Referrer-Policy
**Header**: `Referrer-Policy: strict-origin-when-cross-origin`

**Purpose**: Controls referrer information sent with requests to protect user privacy.

### 5. Permissions-Policy
**Header**: `Permissions-Policy`

**Value**: `camera=(), microphone=(), geolocation=(), payment=(), usb=(), magnetometer=(), gyroscope=(), accelerometer=()`

**Purpose**: Disables unnecessary browser features and APIs.

### Additional Security Headers

#### X-XSS-Protection
**Header**: `X-XSS-Protection: 1; mode=block`

**Purpose**: Enables legacy browser XSS filtering.

#### Strict-Transport-Security (HSTS)
**Header**: `Strict-Transport-Security: max-age=31536000; includeSubDomains; preload`

**Purpose**: Forces HTTPS connections (production only).

#### X-Powered-By
**Header**: `X-Powered-By: ` (empty)

**Purpose**: Removes technology stack information to reduce attack surface.

---

## Local Testing

### Test with cURL

```bash
# Test homepage headers
curl -I http://localhost:3000

# Test API endpoint headers
curl -I http://localhost:3000/api/templates
```

### Test with Browser DevTools

1. Open the application in Chrome/Firefox
2. Open DevTools (F12)
3. Go to Network tab
4. Refresh the page
5. Click on the first request (document)
6. View Response Headers
7. Verify all security headers are present

### Expected Output

You should see the following headers in the response:

```
content-security-policy: default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://fonts.googleapis.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' https://generativelanguage.googleapis.com; frame-ancestors 'none'; base-uri 'self'; form-action 'self'
x-frame-options: DENY
x-content-type-options: nosniff
x-xss-protection: 1; mode=block
referrer-policy: strict-origin-when-cross-origin
permissions-policy: camera=(), microphone=(), geolocation=(), payment=(), usb=(), magnetometer=(), gyroscope=(), accelerometer=()
```

---

## Production Testing with Mozilla Observatory

**Important**: Mozilla Observatory requires a publicly accessible URL. Test this after deployment to Vercel.

### Steps to Test

1. **Deploy to production** (or use preview deployment)
   ```bash
   vercel --prod
   ```

2. **Visit Mozilla Observatory**
   - URL: https://observatory.mozilla.org/

3. **Enter your production URL**
   - Example: `https://ai-prompt-assistant.vercel.app`

4. **Click "Scan Me"**

5. **Review the results**
   - **Target Score**: A+ or A
   - **Required Checks**:
     - ✅ Content Security Policy implemented
     - ✅ X-Frame-Options set to DENY or SAMEORIGIN
     - ✅ X-Content-Type-Options set to nosniff
     - ✅ Referrer-Policy implemented
     - ✅ Strict-Transport-Security (HTTPS only)

### Expected Mozilla Observatory Score

With the current implementation, you should achieve:
- **Grade**: A or A+
- **Score**: 90-100/100

### Common Issues and Fixes

#### Issue: CSP warnings about 'unsafe-inline' or 'unsafe-eval'

**Reason**: Required for Nuxt 4 SSR and Vue 3 reactivity. This is acceptable for MVP.

**Future Fix**: Implement nonce-based CSP in post-MVP (Phase E).

#### Issue: Missing Subresource Integrity (SRI)

**Reason**: Nuxt auto-bundling doesn't support SRI out of the box.

**Future Fix**: Add SRI support for critical external resources in post-MVP.

#### Issue: HSTS not detected

**Reason**: HSTS is only enabled on HTTPS URLs (production).

**Solution**: Ensure `NUXT_PUBLIC_APP_URL` starts with `https://` in production environment variables.

---

## Alternative Testing Tools

### 1. SecurityHeaders.com
- URL: https://securityheaders.com/
- Quick scan with detailed explanations
- Target score: A or A+

### 2. OWASP ZAP (Advanced)
```bash
# Install OWASP ZAP
# Run automated scan
zaproxy -quickurl http://localhost:3000 -quickout report.html
```

### 3. Helmet.js Validation (Node.js)
```bash
npm install helmet
```

Then create a test script to validate headers match Helmet.js best practices.

---

## Verification Checklist

Before deployment:

- [x] Content Security Policy (CSP) implemented
- [x] X-Frame-Options set to DENY
- [x] X-Content-Type-Options set to nosniff
- [x] Referrer-Policy set to strict-origin-when-cross-origin
- [x] Permissions-Policy disables camera, microphone, and other unused features
- [x] X-XSS-Protection enabled (legacy browser support)
- [x] HSTS configured for HTTPS (production)
- [x] X-Powered-By removed/customized
- [x] Headers work on all routes (pages and API endpoints)
- [ ] Mozilla Observatory scan completed (requires public URL)
- [ ] Security grade A or A+ achieved

---

## Post-Deployment Testing

After deploying to production:

1. Run Mozilla Observatory scan
2. Run SecurityHeaders.com scan
3. Verify HSTS is active (HTTPS only)
4. Check CSP violations in browser console (should be none)
5. Test frame-busting (try embedding in iframe)
6. Verify referrer policy in network requests

---

## Security Headers Maintenance

### When to Update CSP

Update CSP directives when:
- Adding new third-party scripts
- Integrating new APIs
- Adding image/font CDNs
- Enabling new browser features

### How to Update

Edit `/server/middleware/security.ts` and modify the `cspDirectives` array:

```typescript
const cspDirectives = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' https://your-new-cdn.com",
  // ... add more directives
].join('; ');
```

### Testing After Updates

1. Clear browser cache
2. Hard refresh (Ctrl+Shift+R)
3. Check browser console for CSP violations
4. Verify functionality is not broken
5. Re-run Mozilla Observatory scan

---

## Resources

- [MDN: Content Security Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP)
- [OWASP Security Headers](https://owasp.org/www-project-secure-headers/)
- [Mozilla Observatory Documentation](https://github.com/mozilla/http-observatory/blob/master/httpobs/docs/api.md)
- [Helmet.js Best Practices](https://helmetjs.github.io/)

---

## Notes

- All security headers are MVP-critical and must remain enabled
- CSP allows 'unsafe-inline' and 'unsafe-eval' for Nuxt SSR compatibility
- Headers are applied via server middleware to all routes automatically
- HSTS preload list submission should be done post-MVP after stability confirmation
