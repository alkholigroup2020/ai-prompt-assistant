# Deployment Runbook

**AI Prompt Assistant** - Deployment Guide for Vercel
**Version**: 1.0 (MVP)
**Last Updated**: 2025-11-19

---

## Pre-Deployment Checklist

### Code Quality
- [x] TypeScript type check passes (`npx nuxt typecheck`) - ✅ No errors
- [x] ESLint validation passes (`npx eslint server/ app/`) - ✅ No errors
- [x] Unit tests passing (validators, formatters): 167/167 tests ✅
- [ ] E2E tests passing (Playwright): Review test results
- [x] Error logging reviewed and secure ✅

### Environment Configuration
- [x] `.env` file configured locally with all required variables
- [ ] Vercel environment variables configured (see below)
- [x] GEMINI_API_KEY obtained from Google AI Studio
- [x] Build configuration verified (`nuxt.config.ts` set to `vercel-edge`)

### Performance & Security
- [ ] Lighthouse audit completed (target: >90 all scores)
- [ ] Accessibility audit completed (axe-core)
- [x] Security headers configured
- [x] Rate limiting implemented and tested
- [x] Input validation and XSS prevention enabled

### Testing
- [ ] Tested on Chrome, Firefox, Safari, Edge
- [ ] Tested on mobile devices (375px, 768px, 1024px)
- [x] Error handling tested and logged correctly

---

## Environment Variables

### Required Environment Variables

Configure these in Vercel Dashboard (Settings → Environment Variables):

```bash
# Google Gemini API
GEMINI_API_KEY=[Your Gemini API Key from Google AI Studio]
NUXT_PUBLIC_GEMINI_MODEL=gemini-pro

# Application URL (Production)
NUXT_PUBLIC_APP_URL=https://your-app.vercel.app

# Rate Limiting
RATE_LIMIT_WINDOW=60000
RATE_LIMIT_MAX_REQUESTS=60

# Feature Flags (Optional)
ENABLE_ANALYTICS=false
ENABLE_TEMPLATES=true
ENABLE_EXPORT=true
```

### Getting Gemini API Key

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with Google account
3. Click "Create API Key"
4. Copy the key and store it securely
5. Add to Vercel environment variables

---

## Deployment Steps

### Step 1: Prepare for Deployment

```bash
# 1. Ensure you're on the main branch
git checkout main
git pull origin main

# 2. Run final checks
npx nuxt typecheck
npx eslint server/ app/

# 3. Test production build locally
npm run build
npm run preview
# Visit http://localhost:3000 and test functionality

# 4. Verify environment variables
cat .env  # Ensure all required variables are set
```

### Step 2: Deploy to Vercel Preview

```bash
# Install Vercel CLI (if not already installed)
npm i -g vercel

# Link project to Vercel (first time only)
vercel link

# Deploy to preview environment
vercel

# Vercel will provide a preview URL
# Example: https://ai-prompt-assistant-xyz123.vercel.app
```

### Step 3: Test Preview Deployment

Visit the preview URL and test:

- [ ] Landing page loads correctly
- [ ] Navigate to Builder page
- [ ] Fill out form and submit
- [ ] Verify enhancement works (check Gemini API integration)
- [ ] Test template selection
- [ ] Test export functionality (TXT, MD, JSON)
- [ ] Test language switching (EN/AR)
- [ ] Test on mobile browser
- [ ] Check browser console for errors
- [ ] Verify rate limiting (try >60 requests/minute)

### Step 4: Deploy to Production

```bash
# Deploy to production (only after preview testing passes)
vercel --prod

# Vercel will provide production URL
# Example: https://ai-prompt-assistant.vercel.app
```

### Step 5: Post-Deployment Verification

```bash
# Test production URL
curl https://your-app.vercel.app/api/health

# Expected response:
# {"status":"ok","version":"1.0.0","timestamp":"2025-11-19T..."}
```

Manual testing checklist:

- [ ] Test all user flows in production
- [ ] Test API endpoints work correctly
- [ ] Test rate limiting (should return 429 after 60 requests)
- [ ] Test error handling (invalid inputs)
- [ ] Test mobile experience (iOS Safari, Chrome Mobile)
- [ ] Test language switching and RTL layout
- [ ] Monitor error logs in Vercel dashboard

---

## Monitoring & Logs

### Vercel Dashboard

1. Navigate to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project
3. Go to "Logs" tab
4. Monitor for errors and performance issues

### Error Logging

Errors are logged in structured JSON format:

```json
{
  "requestId": "uuid",
  "statusCode": 500,
  "path": "/api/enhance-prompt",
  "timestamp": "2025-11-19T...",
  "error": {
    "message": "sanitized error message",
    "code": "ERROR_CODE"
  }
}
```

**Note**: Stack traces are NEVER logged for security. Use local development tools or debugger for detailed debugging.

### Gemini API Quotas

- **Free Tier**: 60 requests/minute
- Monitor usage in [Google AI Studio](https://makersuite.google.com/)
- Rate limiting configured at application level (60 req/min per session)

---

## Rollback Procedure

### Quick Rollback

If issues are detected in production:

```bash
# Option 1: Redeploy previous version via Vercel Dashboard
# 1. Go to Deployments tab
# 2. Find last working deployment
# 3. Click "..." → "Promote to Production"

# Option 2: Rollback via CLI
vercel rollback [deployment-url]
```

### Full Rollback

```bash
# 1. Revert to previous commit
git revert HEAD
git push origin main

# 2. Vercel will auto-deploy the reverted version
# Or manually trigger: vercel --prod
```

---

## Troubleshooting

### Common Issues

#### 1. Build Fails

**Symptom**: Build fails during deployment

**Solution**:
```bash
# Check TypeScript errors
npx nuxt typecheck

# Check ESLint errors
npx eslint server/ app/

# Test build locally
npm run build
```

#### 2. API Not Working

**Symptom**: `/api/enhance-prompt` returns 500 error

**Possible Causes**:
- Missing `GEMINI_API_KEY` environment variable
- Invalid API key
- Gemini API quota exceeded

**Solution**:
1. Verify environment variables in Vercel Dashboard
2. Check Gemini API key is correct
3. Monitor Gemini API quotas

#### 3. Rate Limiting Not Working

**Symptom**: Users not rate-limited after 60 requests

**Solution**:
1. Check `RATE_LIMIT_WINDOW` and `RATE_LIMIT_MAX_REQUESTS` are set correctly
2. Verify rate limit middleware is loaded
3. Check server logs for rate limit violations

#### 4. CORS Errors

**Symptom**: Browser console shows CORS errors

**Solution**:
- Verify `NUXT_PUBLIC_APP_URL` matches production URL
- Check CORS middleware configuration in `server/middleware/cors.ts`

---

## Performance Optimization

### Lighthouse Targets

- Performance: >95
- Accessibility: >90
- Best Practices: >90
- SEO: >80

### Monitoring

Use these tools to monitor performance:

- [Vercel Analytics](https://vercel.com/analytics)
- [Google Lighthouse](https://developers.google.com/web/tools/lighthouse)
- [WebPageTest](https://www.webpagetest.org/)

---

## Security Checklist

- [x] Input validation enabled (all user inputs)
- [x] XSS prevention (HTML escaping)
- [x] Security headers configured (CSP, X-Frame-Options, etc.)
- [x] Rate limiting implemented (60 req/min)
- [x] Error messages sanitized (no stack traces, paths, or sensitive data)
- [x] API keys never exposed to client
- [ ] SSL/TLS enabled (automatic via Vercel)

---

## Support & Contacts

### Technical Issues

- GitHub Issues: [Project Repository Issues](https://github.com/your-org/ai-prompt-assistant/issues)
- Email: support@alkholigroup.com

### API Issues

- Google Gemini API Support: [Google AI Studio](https://makersuite.google.com/app/apikey)
- Vercel Support: [Vercel Help](https://vercel.com/help)

---

## Version History

| Version | Date       | Changes                          | Deployed By |
|---------|------------|----------------------------------|-------------|
| 1.0.0   | 2025-11-19 | Initial MVP deployment           | [Your Name] |

---

## Next Steps (Post-MVP)

After successful MVP deployment:

1. Monitor usage and collect user feedback
2. Address critical bugs within 24 hours
3. Plan Phase 2 enhancements (see PostReleaseEnhancements.md)
4. Set up analytics (if enabled)
5. Create user documentation/guide

---

**End of Deployment Runbook**
