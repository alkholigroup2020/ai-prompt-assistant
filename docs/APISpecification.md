# API Specification

## Base Configuration
- Base URL: `/api`
- Content-Type: `application/json`
- Rate Limiting: 60 requests per minute
- Timeout: 30 seconds

## Endpoints

### 1. POST /api/enhance-prompt
Enhances a user's prompt using AI.

#### Request
```typescript
{
  // Required fields
  role: string;                    // min: 2, max: 100
  audience: string;                // min: 2, max: 100
  task: string;                    // min: 10, max: 1000
  
  // Optional fields
  tone?: string;                   // default: "professional"
  outputFormat?: string;           // default: "paragraph"
  constraints?: string[];          // max: 10 items
  examples?: string;               // max: 3000
  context?: string;                // max: 1500
  enhancementLevel?: 'quick' | 'detailed'; // default: "quick"
  language?: 'en' | 'ar';          // default: "en"
}
```

#### Response - Success (200)
```typescript
{
  success: true,
  data: {
    shortTitle: string,            // max: 60
    enhancedPrompt: string,
    qualityScore: number,          // 0-100
    improvements: string[],        // What was improved
    suggestions?: string[],        // Additional tips
    alternativeVersions?: {
      concise?: string,
      detailed?: string,
      technical?: string
    }
  },
  metadata: {
    processingTime: number,        // milliseconds
    enhancementLevel: string,
    originalLength: number,
    enhancedLength: number,
    language: string,
    requestId: string              // For tracking
  }
}
```

#### Response - Validation Error (400)
```typescript
{
  success: false,
  error: {
    code: "VALIDATION_ERROR",
    message: "Invalid input provided",
    details: {
      field: string,
      issue: string
    }[]
  }
}
```

#### Response - Rate Limit (429)
```typescript
{
  success: false,
  error: {
    code: "RATE_LIMIT_EXCEEDED",
    message: "Too many requests",
    retryAfter: number             // seconds
  }
}
```

#### Response - Server Error (500)
```typescript
{
  success: false,
  error: {
    code: "INTERNAL_ERROR",
    message: "Unable to process request",
    requestId: string
  }
}
```

### 2. POST /api/analyze-prompt
Analyzes prompt quality without enhancement.

#### Request
```typescript
{
  prompt: string                   // The prompt to analyze
}
```

#### Response (200)
```typescript
{
  success: true,
  data: {
    qualityScore: number,          // 0-100
    analysis: {
      clarity: number,
      specificity: number,
      context: number,
      structure: number,
      completeness: number
    },
    issues: string[],              // Problems found
    suggestions: string[]          // How to improve
  }
}
```

### 3. POST /api/export
Exports enhanced prompt in various formats.

#### Request
```typescript
{
  prompt: string,
  format: 'txt' | 'md' | 'json' | 'docx',
  metadata?: {
    title?: string,
    timestamp?: boolean,
    includeAnalysis?: boolean
  }
}
```

#### Response (200)
Returns file download or base64 encoded content.

### 4. GET /api/health
Health check endpoint.

#### Response (200)
```typescript
{
  status: "healthy",
  version: "1.0.0",
  timestamp: string
}
```

## Error Codes Reference
| Code | Description | Action |
|------|-------------|--------|
| VALIDATION_ERROR | Invalid input | Check field requirements |
| RATE_LIMIT_EXCEEDED | Too many requests | Wait and retry |
| GEMINI_API_ERROR | AI service issue | Retry with backoff |
| TIMEOUT | Request took too long | Simplify prompt |
| INTERNAL_ERROR | Server error | Contact support |

## Rate Limiting Strategy
- Window: 60 seconds sliding window
- Limit: 60 requests per window
- Headers: X-RateLimit-Limit, X-RateLimit-Remaining, X-RateLimit-Reset
- Backoff: Exponential backoff recommended

## Security Measures
- Input sanitization for XSS prevention
- SQL injection prevention (parameterized queries)
- Rate limiting per session
- Request size limits
- Timeout protection
- No sensitive data logging
