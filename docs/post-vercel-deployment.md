📋 Required Configuration Steps (Post-Deployment)

1. Add Environment Variables

Go to: https://vercel.com/alkholi-group/ai-prompt-assistant/settings/environment-variables

Add these variables for both Production and Preview:
GEMINI_API_KEY=<your-google-ai-studio-api-key>
NUXT_PUBLIC_GEMINI_MODEL=gemini-pro
NUXT_PUBLIC_APP_URL=https://ai-prompt-assistant-nu.vercel.app
RATE_LIMIT_WINDOW=60000
RATE_LIMIT_MAX_REQUESTS=60
ENABLE_EXPORT=true
ENABLE_ANALYTICS=false

2. Disable SSO Protection (Make Public)

Go to: https://vercel.com/alkholi-group/ai-prompt-assistant/settings/deployment-protection

- Select "Disabled" under Deployment Protection
- This will allow public access without requiring login

3. Redeploy (After Adding Variables)

vercel --prod --scope alkholi-group
