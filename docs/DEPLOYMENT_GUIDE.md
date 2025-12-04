# Deployment Guide - AI Prompt Assistant

This guide covers deploying the AI Prompt Assistant to Vercel with Edge Functions.

---

## Prerequisites

- ✅ Vercel CLI installed globally (`npm i -g vercel`)
- ✅ Vercel account (sign up at [vercel.com](https://vercel.com))
- ✅ Google Gemini API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
- ✅ All tests passing (`npm run test`, `npm run test:e2e`)
- ✅ No TypeScript errors (`npx nuxt typecheck`)
- ✅ No ESLint errors (`npx eslint server/ app/`)

---

## Step 1: Vercel Account Setup

### 1.1 Create/Login to Vercel Account

1. Visit [vercel.com/signup](https://vercel.com/signup)
2. Sign up with GitHub, GitLab, or Bitbucket
3. Verify your email address

### 1.2 Link Project to Vercel

```bash
# Navigate to project directory
cd D:\WebDev\AKG_Websites\ai-prompt-assistant

# Login to Vercel CLI
vercel login

# Link project to Vercel
vercel link
```

**Interactive prompts:**
- Setup and deploy? **No** (we'll configure first)
- Which scope? Select your account/team
- Link to existing project? **No** (for first deployment)
- Project name? `ai-prompt-assistant` (or your preference)
- Directory? `.` (current directory)

This creates a `.vercel` directory with project configuration.

---

## Step 2: Configure Environment Variables

### 2.1 Required Environment Variables

Set these in **Vercel Dashboard** → **Project Settings** → **Environment Variables**:

| Variable Name | Value | Environment |
|---------------|-------|-------------|
| `GEMINI_API_KEY` | Your Google AI API key | Production, Preview |
| `NUXT_PUBLIC_GEMINI_MODEL` | `gemini-pro` | Production, Preview |
| `NUXT_PUBLIC_APP_URL` | Your production URL (e.g., `https://ai-prompts.vercel.app`) | Production |
| `NUXT_PUBLIC_APP_URL` | Your preview URL (e.g., `https://ai-prompts-git-*.vercel.app`) | Preview |
| `RATE_LIMIT_WINDOW` | `60000` (60 seconds in ms) | Production, Preview |
| `RATE_LIMIT_MAX_REQUESTS` | `60` | Production, Preview |
| `ENABLE_ANALYTICS` | `false` (or `true` if using Supabase) | Production, Preview |
| `ENABLE_EXPORT` | `true` | Production, Preview |

### 2.2 Optional Analytics Variables (if using Supabase)

| Variable Name | Value | Environment |
|---------------|-------|-------------|
| `SUPABASE_URL` | Your Supabase project URL | Production, Preview |
| `SUPABASE_ANON_KEY` | Your Supabase anon key | Production, Preview |

### 2.3 Set Environment Variables via CLI (Alternative)

```bash
# Production environment
vercel env add GEMINI_API_KEY production
vercel env add NUXT_PUBLIC_GEMINI_MODEL production
vercel env add NUXT_PUBLIC_APP_URL production
vercel env add RATE_LIMIT_WINDOW production
vercel env add RATE_LIMIT_MAX_REQUESTS production

# Preview environment
vercel env add GEMINI_API_KEY preview
vercel env add NUXT_PUBLIC_GEMINI_MODEL preview
# ... repeat for all variables
```

---

## Step 3: Build Configuration Verification

### 3.1 Verify nuxt.config.ts

Ensure `nuxt.config.ts` has the correct Vercel Edge preset:

```typescript
export default defineNuxtConfig({
  nitro: {
    preset: 'vercel-edge'
  }
})
```

✅ **Already configured in this project**

### 3.2 Verify vercel.json

The `vercel.json` file should include:

```json
{
  "buildCommand": "npm run build",
  "framework": "nuxtjs",
  "outputDirectory": ".output/public",
  "regions": ["iad1"]
}
```

✅ **Already configured in this project**

### 3.3 Test Local Production Build

```bash
# Build for production
npm run build

# Preview production build locally
npm run preview

# Test the preview at http://localhost:3000
```

**Checklist:**
- [ ] Build completes without errors
- [ ] All pages load correctly
- [ ] API endpoints respond (test `/api/health`)
- [ ] Export functionality works
- [ ] Language switching works (EN/AR)

---

## Step 4: Preview Deployment

### 4.1 Deploy to Preview Environment

```bash
# Deploy to preview (not production yet)
vercel
```

This creates a **preview deployment** with a temporary URL like:
`https://ai-prompt-assistant-abc123.vercel.app`

### 4.2 Test Preview Deployment

Test all critical user flows:

- [ ] **Landing Page** → Navigate and check all sections
- [ ] **Form Submission** → Fill form → Enhance prompt → View results
- [ ] **Export Functionality** → Export as TXT, MD, JSON
- [ ] **Copy to Clipboard** → Test copy button with success feedback
- [ ] **Language Switching** → Switch EN ↔ AR, verify RTL layout
- [ ] **Mobile Responsiveness** → Test on mobile device or DevTools
- [ ] **API Health Check** → Visit `/api/health`
- [ ] **Rate Limiting** → Test by sending 61+ requests/minute

### 4.3 Check Vercel Logs

```bash
# View deployment logs
vercel logs [deployment-url]

# Or check in Vercel Dashboard → Deployments → [Preview URL] → Logs
```

---

## Step 5: Production Deployment

### 5.1 Deploy to Production

```bash
# Deploy to production (live domain)
vercel --prod
```

### 5.2 Verify Production Deployment

1. **Check Deployment Status:**
   - Visit Vercel Dashboard → Deployments
   - Ensure status is "Ready" (green checkmark)
   - Note the production URL

2. **Test Production URL:**
   - Visit your production URL
   - Run through all user flows (same as preview testing)
   - Check `/api/health` endpoint
   - Test rate limiting

3. **Run Lighthouse Audit:**
   ```bash
   # Install Lighthouse if not already installed
   npm i -g lighthouse

   # Run audit on production URL
   lighthouse https://your-production-url.vercel.app --view
   ```

   **Target Scores:**
   - Performance: > 90
   - Accessibility: > 90
   - Best Practices: > 90
   - SEO: > 80

---

## Step 6: Custom Domain (Optional)

### 6.1 Add Custom Domain in Vercel

1. Go to Vercel Dashboard → Project → Settings → Domains
2. Click "Add Domain"
3. Enter your domain (e.g., `ai-prompts.alkholi.com`)
4. Follow DNS configuration instructions

### 6.2 Configure DNS Records

**Option A: Vercel Nameservers (Recommended)**
- Point your domain's nameservers to Vercel's nameservers
- Vercel will handle all DNS configuration automatically

**Option B: Custom DNS (A/CNAME Records)**
- Add A record: `76.76.21.21` (Vercel's IP)
- Or CNAME record: `cname.vercel-dns.com`

### 6.3 SSL Certificate

✅ **Automatic:** Vercel provisions SSL certificates automatically (Let's Encrypt)
- Wait 1-5 minutes for SSL to be active
- Verify HTTPS is working

---

## Step 7: Post-Deployment Monitoring

### 7.1 Monitor First 48 Hours

1. **Check Error Logs:**
   ```bash
   vercel logs --prod
   ```
   - Look for 500 errors, rate limit violations, API failures

2. **Monitor Gemini API Usage:**
   - Visit [Google Cloud Console](https://console.cloud.google.com)
   - Check API quotas (free tier: 60 requests/minute)
   - Set up quota alerts if needed

3. **Monitor Vercel Analytics:**
   - Vercel Dashboard → Analytics
   - Check page views, response times, errors

### 7.2 Performance Monitoring

- **Vercel Analytics:** Real User Monitoring (RUM) included
- **Google Analytics:** (Optional) Add GA4 tracking
- **Sentry:** (Optional) Add error tracking

---

## Step 8: CI/CD Setup (Automatic Deployments)

### 8.1 Connect Git Repository

1. Vercel Dashboard → Project → Settings → Git
2. Connect to GitHub/GitLab/Bitbucket
3. Choose repository and branch

### 8.2 Configure Auto-Deployments

**Production Branch:** `main` or `master`
- Every push → automatic production deployment

**Preview Branches:** All other branches
- Every push → automatic preview deployment
- PR comments include preview URL

### 8.3 Deployment Hooks (Optional)

```bash
# Get deployment hook URL from Vercel Dashboard → Settings → Git → Deploy Hooks

# Trigger deployment via webhook
curl -X POST https://api.vercel.com/v1/integrations/deploy/[HOOK_ID]
```

---

## Rollback Procedure

### In Case of Issues

```bash
# List recent deployments
vercel ls

# Promote a previous deployment to production
vercel promote [deployment-url]
```

**Or via Vercel Dashboard:**
1. Go to Deployments
2. Find working deployment
3. Click "..." → "Promote to Production"

---

## Troubleshooting

### Build Failures

**Issue:** Build fails with TypeScript errors
```bash
# Fix: Run typecheck locally
npx nuxt typecheck

# Fix all errors before deploying
```

**Issue:** Build fails with ESLint errors
```bash
# Fix: Run ESLint locally
npx eslint server/ app/

# Fix all errors before deploying
```

### Runtime Errors

**Issue:** 500 Server Error
```bash
# Check logs
vercel logs --prod

# Common causes:
# - Missing environment variables (GEMINI_API_KEY)
# - Invalid API key
# - Gemini API quota exceeded
```

**Issue:** API requests fail with CORS errors
- Check `/server/middleware/cors.ts`
- Ensure `NUXT_PUBLIC_APP_URL` matches your domain

**Issue:** Rate limiting not working
- Verify `RATE_LIMIT_WINDOW` and `RATE_LIMIT_MAX_REQUESTS` are set
- Check `/server/utils/rate-limit.ts`

### Performance Issues

**Issue:** Slow response times
- Check Vercel Analytics → Functions tab
- Optimize API calls (Gemini API timeout)
- Enable caching for API responses

**Issue:** Large bundle size
```bash
# Analyze bundle
npm run build

# Check .output directory size
du -sh .output
```

---

## Deployment Checklist

### Pre-Deployment

- [ ] All tests passing (`npm run test`, `npm run test:e2e`)
- [ ] TypeScript check passes (`npx nuxt typecheck`)
- [ ] ESLint check passes (`npx eslint server/ app/`)
- [ ] Lighthouse audit scores > 90
- [ ] Local production build successful (`npm run build`)
- [ ] Preview build tested (`npm run preview`)

### Vercel Configuration

- [ ] Vercel CLI installed
- [ ] Project linked to Vercel (`vercel link`)
- [ ] Environment variables set (Production + Preview)
- [ ] `vercel.json` configured
- [ ] `.vercelignore` created
- [ ] Nuxt config has `preset: 'vercel-edge'`

### Post-Deployment

- [ ] Production URL accessible
- [ ] All pages loading correctly
- [ ] API endpoints responding
- [ ] Export functionality working
- [ ] Language switching working
- [ ] Mobile responsive
- [ ] SSL certificate active (HTTPS)
- [ ] Error monitoring active
- [ ] Performance metrics within targets

### User Communication

- [ ] Create user guide (1-2 pages)
- [ ] Announce to Alkholi Group employees
- [ ] Set up support channel (email/Slack)
- [ ] Collect initial feedback

---

## Quick Reference Commands

```bash
# Login to Vercel
vercel login

# Link project
vercel link

# Deploy to preview
vercel

# Deploy to production
vercel --prod

# View logs
vercel logs --prod

# List deployments
vercel ls

# Promote deployment
vercel promote [url]

# Remove deployment
vercel rm [deployment-name]

# Environment variables
vercel env ls
vercel env add [name] [environment]
vercel env rm [name] [environment]
```

---

## Support & Resources

- **Vercel Documentation:** [vercel.com/docs](https://vercel.com/docs)
- **Nuxt Deployment Guide:** [nuxt.com/docs/getting-started/deployment](https://nuxt.com/docs/getting-started/deployment)
- **Vercel Edge Functions:** [vercel.com/docs/functions/edge-functions](https://vercel.com/docs/functions/edge-functions)
- **Gemini API Docs:** [ai.google.dev/docs](https://ai.google.dev/docs)

---

**Last Updated:** 2025-11-19
**Project:** AI Prompt Assistant v1.0
**Deployment Target:** Vercel Edge Functions
