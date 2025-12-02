# Gemini API Fix - December 2024

## Issue Summary

The AI Prompt Assistant was failing to enhance prompts with a **502 Bad Gateway** error on the builder page. The API endpoint `/api/enhance-prompt` was returning errors when trying to communicate with Google's Gemini API.

## Root Cause

**Google retired all Gemini 1.0 and 1.5 models** as of late 2024. The application was configured to use `gemini-pro` (later changed to `gemini-1.5-flash`), which no longer exist.

### Error Messages Observed

```
[GoogleGenerativeAI Error]: Error fetching from https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent:
[404 Not Found] models/gemini-pro is not found for API version v1beta, or is not supported for generateContent.
```

```
[GoogleGenerativeAI Error]: Error fetching from https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent:
[404 Not Found] models/gemini-1.5-flash is not found for API version v1beta
```

## Solution

### 1. Updated Gemini Model Name

Changed the model from deprecated names to `gemini-2.0-flash` which is currently supported.

**File**: `server/utils/gemini.ts`

**Before**:
```typescript
const modelName = config.public.geminiModel || 'gemini-pro';
```

**After**:
```typescript
// Use gemini-2.0-flash (Gemini 1.0 and 1.5 models are retired)
const modelName = 'gemini-2.0-flash';
```

### 2. Runtime Config Issue

During debugging, we discovered that Nuxt's runtime config wasn't properly reading the `NUXT_PUBLIC_GEMINI_MODEL` environment variable from `.env`. Even with the correct value in `.env`, the runtime config was returning stale/cached values.

**Workaround**: Hardcoded the model name directly in the code since all Gemini 1.x models are retired anyway and `gemini-2.0-flash` is the recommended model.

### 3. Updated `.env` and `.env.example`

**File**: `.env` and `.env.example`

```env
# Gemini Model to Use
# Options: gemini-2.0-flash, gemini-2.5-flash, gemini-2.5-flash-lite
# Note: Gemini 1.0 and 1.5 models are retired
NUXT_PUBLIC_GEMINI_MODEL=gemini-2.0-flash
```

## Files Modified

| File | Change |
|------|--------|
| `server/utils/gemini.ts` | Changed model to `gemini-2.0-flash` in `enhancePrompt()` and `checkGeminiConnection()` functions |
| `.env` | Updated `NUXT_PUBLIC_GEMINI_MODEL=gemini-2.0-flash` |
| `.env.example` | Updated model options and added note about retired models |

## Verification

### API Test (curl)
```bash
curl -s -X POST http://localhost:5000/api/enhance-prompt \
  -H "Content-Type: application/json" \
  -d '{"role":"Software Engineer","audience":"Technical Team","task":"Write a code review","tone":"professional","outputFormat":"paragraph","constraints":[],"enhancementLevel":"quick","language":"en"}'
```

**Result**: `{"success": true, "data": {...}}`

### Browser Test
1. Navigate to `/builder`
2. Fill in Role, Audience, and Task Description
3. Click "Quick Polish" button
4. Successfully navigates to `/results` page with enhanced prompt

## Current Working Model

As of December 2024, the following Gemini models are available:
- `gemini-2.0-flash` (recommended - fast and capable)
- `gemini-2.5-flash` (if available)
- `gemini-2.5-flash-lite` (lightweight option)

## References

- [Google AI Studio - Model Info](https://ai.google.dev/gemini-api/docs/models)
- [Gemini API Documentation](https://ai.google.dev/gemini-api/docs)

## Date Fixed

**December 1, 2025**

## Notes

- The Nuxt runtime config caching issue may need further investigation if dynamic model switching is required in the future
- Consider adding a model availability check on startup to catch similar issues early
- The API key (`GEMINI_API_KEY`) was verified to be working correctly - only the model name was the issue
