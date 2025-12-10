# Plan: Overcome Gemini API 5 RPM Rate Limit

## Problem Statement
- `gemini-2.5-flash` works but has only **5 RPM** (requests/minute) and **20 RPD** (requests/day)
- Other Gemini models (`gemini-2.0-flash`, etc.) return `limit: 0` errors
- App needs to support ~100 employees
- Must stay free (no paid tier)
- Single Google account only (no key rotation)

## Chosen Solution: Groq + Client UI + Request Queue

Based on user requirements:
1. **Groq as Primary Provider** - 30 RPM free tier (6x more than Gemini)
2. **Client Rate Limit UI** - Show remaining requests, cooldown timer
3. **Request Queue** - Queue requests instead of immediate rejection

### Combined Rate Limits After Implementation
| Provider | RPM | RPD | Role |
|----------|-----|-----|------|
| Groq (llama-3.3-70b) | 30 | 14,400 | Primary |
| Gemini (gemini-2.5-flash) | 5 | 20 | Fallback |
| **Effective Total** | **35** | **14,420** | Combined |

### Capacity Planning (~100 Users)

**Per-User Rate Limit:** 5 requests/minute

| Scenario | Concurrent Users | Requests/Min | AI Capacity (35 RPM) | Status |
|----------|-----------------|--------------|----------------------|--------|
| Light usage | 5 users | 25 | ✅ Under capacity | OK |
| Normal usage | 7 users | 35 | ✅ At capacity | OK |
| Peak usage | 10 users | 50 | ⚠️ Over capacity | Queue needed |
| Heavy usage | 20 users | 100 | ❌ Over capacity | Queue critical |

**Key Insight:** If more than ~7 users are actively making requests simultaneously, the AI providers' 35 RPM limit will be exceeded. This is why Phase 3 (Request Queue) may still be needed for peak usage times.

---

## Implementation Plan

### Phase 1: Groq Integration (~2 hours)

**Goal:** Add Groq as primary AI provider with Gemini as fallback

#### 1.1 Install Groq SDK
```bash
pnpm add groq-sdk
```

#### 1.2 Create Groq Utility
**New file:** `server/utils/groq.ts`
- Initialize Groq client with API key
- Build enhancement prompt (adapt from Gemini format)
- Parse JSON response
- Error handling with proper typing

#### 1.3 Create Multi-Provider Service
**New file:** `server/utils/ai-provider.ts`
- Abstract interface for AI providers
- Provider selection logic (Groq first, Gemini fallback)
- Rate limit tracking per provider
- Automatic failover on errors

#### 1.4 Update API Endpoints
**Modify:** `server/api/enhance-prompt.post.ts`
**Modify:** `server/api/enhance-email.post.ts`
- Use new multi-provider service
- Return provider info in response metadata

#### 1.5 Environment Configuration
**Modify:** `.env.example`, `nuxt.config.ts`
```env
# Groq API (Primary - 30 RPM free)
GROQ_API_KEY=gsk_...

# Gemini API (Fallback - 5 RPM free)
GEMINI_API_KEY=AIzaSy...
```

### Phase 2: Client Rate Limit UI (~1 hour)

**Goal:** Show users their rate limit status and prevent excessive requests

#### 2.1 Rate Limit Store
**New file:** `app/stores/rateLimit.ts`
- Track remaining requests from API headers
- Calculate reset time
- Provide reactive state for UI

#### 2.2 Rate Limit Indicator Component
**New file:** `app/components/RateLimitIndicator.vue`
- Display "X requests remaining"
- Show cooldown timer when low
- Warning states (yellow < 5, red < 2)
- Tooltip with reset time

#### 2.3 Update Form Components
**Modify:** `app/components/builder/*.vue`
**Modify:** `app/pages/email-checker.vue`
- Add RateLimitIndicator to forms
- Disable submit when limit reached
- Show "Please wait X seconds" message

#### 2.4 API Response Headers
**Modify:** `app/composables/useApi.ts`
- Extract `X-RateLimit-*` headers
- Update rate limit store on each response

### Phase 3: Request Queue (~2-3 hours)

**Goal:** Queue requests instead of rejecting, process at controlled rate

#### 3.1 Queue Data Structure
**New file:** `server/utils/request-queue.ts`
- In-memory queue with request tracking
- Unique request IDs
- Status: pending, processing, completed, failed
- Result storage with TTL

#### 3.2 Queue Processing
- Process requests at 4/minute (safely under 5 RPM limit)
- FIFO ordering
- Timeout handling (30s per request)
- Cleanup completed requests after 5 minutes

#### 3.3 New API Endpoints
**New file:** `server/api/queue/submit.post.ts`
- Accept enhancement request
- Add to queue
- Return request ID immediately

**New file:** `server/api/queue/status/[id].get.ts`
- Check status by request ID
- Return: pending (position in queue), processing, completed (with result), failed (with error)

#### 3.4 Client-Side Polling
**Modify:** `app/composables/useEnhancement.ts`
**Modify:** `app/composables/useEmailEnhancement.ts`
- Submit to queue endpoint
- Poll status every 2 seconds
- Show queue position to user
- Handle completion/failure

#### 3.5 Queue Status UI
**New file:** `app/components/QueueStatus.vue`
- "Your request is #X in queue"
- Estimated wait time
- Processing spinner
- Cancel button (optional)

---

## Files to Create/Modify

### New Files (6)
```
server/utils/groq.ts              # Groq API integration
server/utils/ai-provider.ts       # Multi-provider service
server/utils/request-queue.ts     # Request queue logic
server/api/queue/submit.post.ts   # Queue submission endpoint
server/api/queue/status/[id].get.ts  # Queue status endpoint
app/stores/rateLimit.ts           # Rate limit state
app/components/RateLimitIndicator.vue  # Rate limit UI
app/components/QueueStatus.vue    # Queue status UI
```

### Modified Files (7)
```
server/api/enhance-prompt.post.ts  # Use multi-provider
server/api/enhance-email.post.ts   # Use multi-provider
app/composables/useApi.ts          # Extract rate limit headers
app/composables/useEnhancement.ts  # Queue integration
app/composables/useEmailEnhancement.ts  # Queue integration
nuxt.config.ts                     # Add Groq config
.env.example                       # Add Groq key
```

---

## Environment Variables

```env
# Primary AI Provider - Groq (30 RPM free tier)
GROQ_API_KEY=gsk_xxxxxxxxxxxx

# Fallback AI Provider - Gemini (5 RPM free tier)
GEMINI_API_KEY=AIzaSyxxxxxxxxxx

# Provider Priority (comma-separated)
AI_PROVIDER_PRIORITY=groq,gemini
```

---

## Estimated Effort

| Phase | Component | Time |
|-------|-----------|------|
| 1 | Groq Integration | 2 hours |
| 2 | Client Rate Limit UI | 1 hour |
| 3 | Request Queue | 2-3 hours |
| | **Total** | **5-6 hours** |

---

## Next Steps

1. Get Groq API key from https://console.groq.com/keys (free)
2. Implement Phase 1 (Groq integration)
3. Test with both providers
4. Implement Phase 2 (Rate limit UI)
5. Implement Phase 3 (Request queue) if needed
