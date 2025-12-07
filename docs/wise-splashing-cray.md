# Email Checker & Enhancer - Implementation Plan

## Overview

Add a new feature that allows users to paste email drafts and get AI-enhanced versions with grammar/spelling corrections, improved clarity, tone adjustment, and suggested subject lines.

**Key decisions:**
- New dedicated page at `/email-checker`
- Features: Tone selector, Subject line generator, Side-by-side comparison
- Default output language matches app language (EN/AR)
- Single-page experience (no navigation to results)

---

## Architecture

```
NEW FILES:
├── app/pages/email-checker.vue           # Main page (~300 lines)
├── app/components/email/                 # Email components
│   ├── EmailInput.vue                    # Draft textarea (~120 lines)
│   ├── OutputLanguageSelector.vue        # EN/AR toggle (~80 lines)
│   ├── ToneSelector.vue                  # Tone options (~100 lines)
│   └── EmailComparison.vue               # Side-by-side display (~200 lines)
├── app/composables/useEmailEnhancement.ts # State management (~120 lines)
├── server/api/enhance-email.post.ts      # API endpoint (~150 lines)
└── server/utils/email-prompts.ts         # Gemini prompt builder (~100 lines)

MODIFIED FILES:
├── app/components/layout/Header.vue      # Add nav link (+5 lines)
├── i18n/locales/en.json                  # English translations (+80 keys)
└── i18n/locales/ar.json                  # Arabic translations (+80 keys)

TOTAL: ~1,250 lines
```

---

## Implementation Phases

### Phase 1: Types & API (~250 lines)

**1.1 Create email types** (`app/types/email.ts`)
```typescript
interface EmailEnhanceRequest {
  emailDraft: string           // Required, 10-5000 chars
  outputLanguage: 'en' | 'ar'  // Required
  tone?: 'professional' | 'friendly' | 'formal' | 'casual'
}

interface EmailEnhanceResponse {
  success: boolean
  data?: {
    enhancedEmail: string
    suggestedSubject?: string
    improvements: string[]
    metadata: {
      originalLength: number
      enhancedLength: number
      processingTime: number
      language: string
    }
  }
  error?: { code: string; message: string }
}
```

**1.2 Create Gemini prompt builder** (`server/utils/email-prompts.ts`)
- Build structured prompt for email enhancement
- Include language-specific instructions (like existing `buildEnhancementPrompt`)
- Request JSON response with enhancedEmail, suggestedSubject, improvements

**1.3 Create API endpoint** (`server/api/enhance-email.post.ts`)
- Reuse rate limiting from `server/utils/rate-limit.ts`
- Reuse validation patterns from `server/utils/validation.ts`
- Call Gemini API with email-specific prompt
- Parse and return structured response

---

### Phase 2: Composable (~120 lines)

**Create** `app/composables/useEmailEnhancement.ts`

Follow pattern from `app/composables/useEnhancement.ts`:
- Use `useState` for persistent state across navigations
- State: `{ loading, error, result, originalEmail }`
- Methods: `enhance(input)`, `clear()`
- Computed: `hasResult`, `enhancedEmail`, `suggestedSubject`, `improvements`, `isLoading`

---

### Phase 3: Components (~500 lines)

**3.1 EmailInput.vue** (~120 lines)
- Large auto-resize `UTextarea` for email draft
- Character counter (10-5000 chars) with color-coded progress
- Placeholder with example text
- RTL support for Arabic input

**3.2 OutputLanguageSelector.vue** (~80 lines)
- Two toggle buttons: English / العربية
- Default to current app locale (`useI18n().locale`)
- Clear visual indication of selected language

**3.3 ToneSelector.vue** (~100 lines)
- 4 card-style options: Professional (default), Friendly, Formal, Casual
- Optional selection (can proceed without selecting)
- Icons for each tone

**3.4 EmailComparison.vue** (~200 lines)
- Follow pattern from `app/components/results/Comparison.vue`
- Two-column grid (original vs enhanced)
- Word/character stats
- Copy button on enhanced side
- Subject line display if generated
- Improvements list

---

### Phase 4: Main Page (~300 lines)

**Create** `app/pages/email-checker.vue`

**Layout:**
```
┌─────────────────────────────────────┐
│ Header: "Email Checker & Enhancer"  │
│ Subtitle description                │
├─────────────────────────────────────┤
│ [EmailInput] - Paste your draft     │
├─────────────────────────────────────┤
│ [Settings Row]                      │
│ [OutputLanguageSelector] [ToneSelector]│
├─────────────────────────────────────┤
│ [Enhance Email Button]              │
├─────────────────────────────────────┤
│ [EmailComparison] (after enhance)   │
│ - Original | Enhanced               │
│ - Subject line suggestion           │
│ - Improvements list                 │
└─────────────────────────────────────┘
```

**States:**
- Empty: Show input form with placeholder
- Loading: Disable inputs, show spinner on button
- Success: Show comparison below form
- Error: Toast notification + inline error

---

### Phase 5: i18n & Navigation (~90 lines)

**5.1 Add translations** to `i18n/locales/en.json` and `ar.json`:
```json
"emailChecker": {
  "meta": { "title": "...", "description": "..." },
  "title": "Email Checker & Enhancer",
  "subtitle": "Check grammar, fix spelling, and improve your emails",
  "input": { "label": "...", "placeholder": "...", "helpText": "..." },
  "language": { "label": "...", "helpText": "..." },
  "tone": { "label": "...", "options": { ... } },
  "actions": { "enhance": "...", "enhancing": "...", "copy": "...", "newEmail": "..." },
  "results": { "title": "...", "original": "...", "enhanced": "...", "subject": "...", "improvements": "..." }
}
```

**5.2 Update Header.vue** - Add navigation link:
```vue
{ label: t('nav.emailChecker'), to: localePath('/email-checker') }
```

---

### Phase 6: Testing & Validation

1. Run `npx nuxt typecheck` - must pass
2. Run `npx eslint server/ app/` - must pass
3. Manual testing:
   - EN email → EN output
   - EN email → AR output (translation)
   - AR email → AR output
   - AR email → EN output (translation)
   - All 4 tones
   - Copy to clipboard
   - RTL layout in Arabic
   - Dark mode
   - Mobile responsive

---

## Critical Files to Reference

| File | Purpose |
|------|---------|
| `server/utils/gemini.ts` | Gemini API patterns, prompt building |
| `app/composables/useEnhancement.ts` | State management pattern |
| `app/components/results/Comparison.vue` | Side-by-side UI pattern |
| `server/api/enhance-prompt.post.ts` | API endpoint pattern |
| `app/components/builder/TaskInput.vue` | Textarea with counter pattern |
| `app/components/builder/ToneSelector.vue` | Tone selection pattern |

---

## API Design

**POST /api/enhance-email**

Request:
```json
{
  "emailDraft": "Hi John, I wanted to ask about the project...",
  "outputLanguage": "en",
  "tone": "professional"
}
```

Response:
```json
{
  "success": true,
  "data": {
    "enhancedEmail": "Dear John,\n\nI hope this message finds you well. I am writing to inquire about...",
    "suggestedSubject": "Inquiry Regarding Project Status",
    "improvements": [
      "Added professional greeting",
      "Improved sentence structure",
      "Added polite closing"
    ],
    "metadata": {
      "originalLength": 45,
      "enhancedLength": 120,
      "processingTime": 1250,
      "language": "en"
    }
  }
}
```

---

## Gemini Prompt Structure

```
You are a professional email editor. Your task is to enhance the following email.

**Requirements:**
1. Fix all grammar and spelling errors
2. Improve clarity and readability
3. Maintain the original intent and meaning
4. Use a {tone} tone
5. Respond ENTIRELY in {language}
6. If no subject line exists, suggest one

**Original Email:**
{emailDraft}

**Required Response Format (JSON):**
{
  "enhancedEmail": "The fully corrected email",
  "suggestedSubject": "Suggested subject line",
  "improvements": ["List of improvements made"]
}

Respond ONLY with valid JSON.
```

---

## Checklist

- [ ] Phase 1: Types & API endpoint
- [ ] Phase 2: useEmailEnhancement composable
- [ ] Phase 3: Email components (4 files)
- [ ] Phase 4: email-checker.vue page
- [ ] Phase 5: i18n translations + header nav
- [ ] Phase 6: TypeScript + ESLint validation
- [ ] Phase 7: Manual testing all scenarios
