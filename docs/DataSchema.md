# Data Schema & Models

## Input Form Schema

### FormInput Interface
```typescript
interface FormInput {
  // Core Fields
  role: string;                    // User's role/profession
  roleOther?: string;              // Custom role if "other" selected
  audience: string;                // Target audience for output
  audienceOther?: string;          // Custom audience if "other" selected
  task: string;                    // Main task description (10-1000 chars)
  
  // Enhancement Options
  tone: ToneOption;                // Writing tone
  outputFormat: OutputFormat;      // Desired output structure
  outputFormatOther?: string;      // Custom format if "other"
  
  // Advanced Options
  constraints: Constraint[];       // Array of selected constraints
  constraintsOther?: string;       // Additional custom constraints
  examples?: string;               // Optional examples (max 3000 chars)
  context?: string;                // Additional context (max 1500 chars)
  
  // Enhancement Settings
  enhancementLevel: 'quick' | 'detailed';  // Quick polish vs deep enhancement
  language: 'en' | 'ar';          // Interface language
  
  // Metadata
  timestamp: Date;                 // Submission time
  sessionId: string;              // Anonymous session tracking
}

// Enums
enum ToneOption {
  PROFESSIONAL = 'professional',
  FRIENDLY = 'friendly',
  FORMAL = 'formal',
  CASUAL = 'casual',
  PERSUASIVE = 'persuasive',
  INFORMATIVE = 'informative',
  CREATIVE = 'creative',
  TECHNICAL = 'technical',
  EMPATHETIC = 'empathetic'
}

enum OutputFormat {
  PARAGRAPH = 'paragraph',
  BULLET_POINTS = 'bullets',
  NUMBERED_LIST = 'numbered',
  EMAIL = 'email',
  REPORT = 'report',
  PRESENTATION = 'presentation',
  CODE_COMMENTS = 'code_comments',
  SOCIAL_POST = 'social_post',
  EXECUTIVE_SUMMARY = 'executive_summary',
  TABLE = 'table',
  DIALOGUE = 'dialogue',
  STEP_BY_STEP = 'steps',
  FAQ = 'faq',
  OTHER = 'other'
}

enum Constraint {
  WORD_LIMIT_100 = 'max_100_words',
  WORD_LIMIT_300 = 'max_300_words',
  WORD_LIMIT_500 = 'max_500_words',
  INCLUDE_CITATIONS = 'citations',
  USE_PROVIDED_DATA = 'provided_data_only',
  NO_JARGON = 'no_jargon',
  TECHNICAL_DETAIL = 'technical_detail',
  BEGINNER_FRIENDLY = 'beginner_friendly',
  ACTION_ORIENTED = 'action_oriented',
  DATA_DRIVEN = 'data_driven'
}
```

### API Response Schema
```typescript
interface EnhancementResponse {
  success: boolean;
  data: {
    shortTitle: string;           // Max 60 chars
    enhancedPrompt: string;       // The enhanced prompt
    qualityScore: number;         // 0-100 quality rating
    improvements: string[];       // List of improvements made
    suggestions?: string[];       // Additional suggestions
    alternativeVersions?: {       // Optional alternative phrasings
      concise: string;
      detailed: string;
      technical?: string;
    };
  };
  metadata: {
    processingTime: number;       // milliseconds
    enhancementLevel: string;
    originalLength: number;
    enhancedLength: number;
    language: string;
  };
  error?: {
    code: string;
    message: string;
    retryAfter?: number;
  };
}
```

### Template Schema
```typescript
interface PromptTemplate {
  id: string;
  category: TemplateCategory;
  title: string;
  description: string;
  tags: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: string;        // e.g., "2 minutes"
  
  // Template Structure
  basePrompt: string;
  variables: TemplateVariable[];
  examples: TemplateExample[];
  
  // Metadata
  usageCount: number;
  rating: number;
  lastUpdated: Date;
}

interface TemplateVariable {
  key: string;                  // e.g., "{{product_name}}"
  label: string;
  type: 'text' | 'select' | 'multiselect';
  required: boolean;
  placeholder?: string;
  options?: string[];
  maxLength?: number;
}

enum TemplateCategory {
  BUSINESS = 'business',
  TECHNICAL = 'technical',
  CREATIVE = 'creative',
  ANALYSIS = 'analysis',
  COMMUNICATION = 'communication',
  RESEARCH = 'research',
  MARKETING = 'marketing',
  HR = 'hr',
  SALES = 'sales',
  CUSTOMER_SERVICE = 'customer_service'
}
```

### Local Storage Schema
```typescript
interface LocalData {
  // User Preferences
  preferences: {
    language: 'en' | 'ar';
    theme: 'light' | 'dark' | 'auto';
    defaultTone: ToneOption;
    defaultFormat: OutputFormat;
    tooltipsEnabled: boolean;
  };
  
  // Draft Management
  currentDraft?: FormInput;
  lastSaved: Date;
  
  // History (Last 10)
  recentPrompts: {
    id: string;
    timestamp: Date;
    input: FormInput;
    output: EnhancementResponse;
    starred: boolean;
  }[];
  
  // Statistics
  stats: {
    totalPrompts: number;
    totalSaved: number;
    favoriteTemplate?: string;
    averageQualityScore: number;
  };
}
```

### Database Schema (Supabase) - Optional Analytics
```sql
-- Analytics table (no personal data)
CREATE TABLE prompt_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Request data (anonymized)
  session_id VARCHAR(100),
  role_category VARCHAR(50),
  audience_type VARCHAR(50),
  task_length INTEGER,
  tone VARCHAR(50),
  output_format VARCHAR(50),
  constraints_count INTEGER,
  enhancement_level VARCHAR(20),
  language CHAR(2),
  
  -- Response data
  success BOOLEAN,
  quality_score INTEGER,
  processing_time INTEGER,
  error_code VARCHAR(50),
  
  -- Engagement metrics
  copied BOOLEAN DEFAULT FALSE,
  exported BOOLEAN DEFAULT FALSE,
  time_on_page INTEGER
);

-- Templates usage
CREATE TABLE template_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id VARCHAR(100),
  used_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  session_id VARCHAR(100),
  completed BOOLEAN
);
```
