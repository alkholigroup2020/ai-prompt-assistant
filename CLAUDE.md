# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**AI Prompt Assistant** is an intelligent web application that transforms rough ideas into powerful, production-ready AI prompts for Alkholi Group employees. Built with Nuxt 4, Vue 3, and @nuxt/ui, it guides users through creating effective prompts for any AI tool (ChatGPT, Claude, Gemini, etc.).

**Tech Stack**: Nuxt 4 (SSR), Vue 3, TypeScript, Tailwind CSS, Google Gemini API (free tier)

## Development Commands

```bash
# Install dependencies
npm install

# Development server (http://localhost:3000)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Type checking
nuxt typecheck

# Linting
eslint .
```

## 🚨 CRITICAL: TypeScript & ESLint Validation Protocol

**MANDATORY**: At the end of EVERY task that involves code creation or modification, you MUST run the following validation checks and fix ALL errors before considering the task complete.

### Validation Commands (Run in Order)

1. **TypeScript Type Checking** (MUST pass with zero errors)

   ```bash
   npx nuxt typecheck
   ```

2. **ESLint Validation** (MUST pass with zero errors)

   ```bash
   npx eslint server/ app/
   ```

3. **Specific File Check** (if only certain files were modified)
   ```bash
   npx eslint path/to/file1.ts path/to/file2.ts
   ```

### Common TypeScript/ESLint Errors & Solutions

#### 1. **Avoid `any` Type** ❌

**Error**: `Unexpected any. Specify a different type @typescript-eslint/no-explicit-any`

**Bad**:

```typescript
function processData(data: any) {}
function parseResponse(response: any): any {}
```

**Good**:

```typescript
function processData(data: unknown) {}
function parseResponse(response: string): ParsedResponse {}

// For complex objects, use Record or create an interface
function validateInput(data: unknown) {
  const input = data as Record<string, unknown>
  // ... validation
}
```

**Solution Pattern**:

- Use `unknown` for truly unknown types
- Use `Record<string, unknown>` for object types
- Create proper interfaces for complex structures
- Use type guards to narrow types

#### 2. **Unused Variables** ❌

**Error**: `'variable' is defined but never used @typescript-eslint/no-unused-vars`

**Bad**:

```typescript
const startTime = Date.now();
// variable never used

catch (error) {
  // error variable unused
  console.log('Failed');
}
```

**Good**:

```typescript
// Actually use the variable
const startTime = Date.now();
const elapsed = Date.now() - startTime;

// Prefix with underscore if intentionally unused
catch (_error) {
  console.log('Failed');
}

// Or use empty catch if truly not needed
catch {
  console.log('Failed');
}
```

#### 3. **Type Assertions** ❌

**Error**: `Conversion of type X to type Y may be a mistake`

**Bad**:

```typescript
return sanitized as FormInput // Direct assertion may fail
```

**Good**:

```typescript
return sanitized as unknown as FormInput // Double assertion for complex types
```

**Pattern**: When converting between incompatible types, use double assertion through `unknown`

#### 4. **Property Access on Union Types** ❌

**Error**: `Property 'code' does not exist on type 'Error'`

**Bad**:

```typescript
function logError(error: Error | { code?: string }) {
  console.log(error.code) // Error: Property doesn't exist on Error
}
```

**Good**:

```typescript
function logError(error: Error | { code?: string }) {
  const code = 'code' in error ? error.code : 'UNKNOWN'
  console.log(code)
}
```

**Pattern**: Use `in` operator or type guards to safely access properties

#### 5. **Array/Object Access with Potential Undefined** ❌

**Error**: `Object is possibly 'undefined'`

**Bad**:

```typescript
const match = text.match(/pattern/)
return match[1] // match could be null

const item = array[0]
return item.property // item could be undefined
```

**Good**:

```typescript
const match = text.match(/pattern/)
if (match && match[1]) {
  return match[1]
}

const item = array[0]
if (item) {
  return item.property
}

// Or use optional chaining
return array[0]?.property
```

#### 6. **String vs Number in Headers** ❌

**Error**: `Argument of type 'string' is not assignable to parameter of type 'number'`

**Bad**:

```typescript
setHeader(event, 'Access-Control-Max-Age', '86400') // String instead of number
```

**Good**:

```typescript
setHeader(event, 'Access-Control-Max-Age', 86400) // Correct number type
```

#### 7. **Missing Return Type Annotations** ⚠️

**Best Practice**: Always define return types for exported functions

**Good**:

```typescript
export function validateInput(data: unknown): {
  valid: boolean
  sanitized?: FormInput
  error?: ValidationError
} {
  // implementation
}
```

### TypeScript Best Practices for This Project

1. **Create Interfaces for Complex Types**

   ```typescript
   interface ExportMetadata {
     title?: string
     timestamp?: boolean
     qualityScore?: number
   }

   function exportData(data: string, metadata?: ExportMetadata) {}
   ```

2. **Use Type Guards**

   ```typescript
   function isFormInput(data: unknown): data is FormInput {
     return typeof data === 'object' && data !== null && 'role' in data
   }
   ```

3. **Prefer `unknown` over `any`**

   - `unknown` is type-safe and requires type checking
   - `any` bypasses type checking (avoid at all costs)

4. **Use Proper Type Imports**

   ```typescript
   import type { FormInput, EnhancementResponse } from '~/types'
   ```

5. **Handle Nullable Values**
   ```typescript
   // Use optional chaining and nullish coalescing
   const value = config.public.appUrl ?? 'http://localhost:3000'
   const header = getHeader(event, 'x-session-id') ?? 'anonymous'
   ```

## 🚫 CRITICAL: Common Nuxt Pitfalls to Avoid

### 1. **NEVER use `useI18n()` in Nuxt Plugins** ❌

**Error**: `SyntaxError: Must be called at the top of a setup function`

**Problem**: Vue composables like `useI18n()`, `useRoute()`, `useRouter()` cannot be called directly in Nuxt plugins. They must be called at the top of a component's setup function.

**Bad** ❌:
```typescript
// ❌ app/plugins/preferences.client.ts
export default defineNuxtPlugin(() => {
  const { locale } = useI18n() // ERROR: Cannot call useI18n() here!

  // This will cause hydration errors and 500 server crashes
})
```

**Good** ✅:
```typescript
// ✅ app/plugins/preferences.client.ts
export default defineNuxtPlugin((nuxtApp) => {
  // Access i18n through nuxtApp context instead
  const i18n = nuxtApp.$i18n

  if (!i18n) {
    console.warn('i18n is not available')
    return
  }

  // Now you can use i18n safely
  i18n.setLocale('en')

  // Watch for changes
  watch(() => i18n.locale.value, (newLocale) => {
    console.log('Locale changed:', newLocale)
  })
})
```

**Why This Matters**:
- Using composables incorrectly in plugins causes **hydration mismatches**
- Results in **500 Server Errors** on page refresh
- Breaks SSR (Server-Side Rendering)
- Makes the app unstable and unusable

**Available through nuxtApp context**:
- `nuxtApp.$i18n` - i18n instance
- `nuxtApp.$router` - Vue Router instance
- `nuxtApp.$pinia` - Pinia store
- `nuxtApp.$config` - Runtime config

**When to use composables vs nuxtApp**:
- ✅ **In components**: Use `useI18n()`, `useRouter()`, `useRoute()`
- ✅ **In composables**: Use `useI18n()`, `useRouter()`, `useRoute()`
- ❌ **In plugins**: Use `nuxtApp.$i18n`, `nuxtApp.$router`, etc.

### 2. **Component Auto-Import Naming** ❌

Nuxt auto-imports components from nested folders with **folder prefix**:

```
app/components/builder/RoleSelector.vue    → <BuilderRoleSelector />
app/components/ui/Card.vue                 → <UiCard />
app/components/TopLevel.vue                → <TopLevel />
```

**Bad** ❌: `<RoleSelector />` `<Card />` (won't work for nested components)
**Good** ✅: `<BuilderRoleSelector />` `<UiCard />`

**Rule**: Components in `app/components/[folder]/ComponentName.vue` must be referenced as `<FolderComponentName />`.

### 3. **Always Use `localePath()` for Navigation** ❌

**CRITICAL**: All navigation links must use `localePath()` to maintain the current language when navigating between pages.

**Problem**: Using plain paths causes the app to switch to the default language (English) when navigating.

**Bad** ❌:
```vue
<!-- Components -->
<NuxtLink to="/builder">Builder</NuxtLink>

<!-- JavaScript -->
router.push('/results')
await navigateTo('/builder')
```

**Good** ✅:
```vue
<!-- Components -->
<NuxtLink :to="localePath('/builder')">Builder</NuxtLink>

<!-- JavaScript -->
const localePath = useLocalePath()
router.push(localePath('/results'))
await navigateTo(localePath('/builder'))
```

**Where to use**:
- ✅ All `<NuxtLink>` components (`:to="localePath('/path')"`)
- ✅ All `router.push()` calls
- ✅ All `navigateTo()` calls
- ✅ Logo/home links

**Why This Matters**:
- Prevents language switching when navigating between pages
- Maintains user's language preference throughout the app
- Required for proper bilingual (EN/AR) support

### Error Fixing Workflow

1. **Run type check**: `npx nuxt typecheck`
2. **Read error messages carefully**: Note file name, line number, and error type
3. **Fix errors one file at a time**: Start with the file that has the most errors
4. **Apply the appropriate solution pattern** from the list above
5. **Re-run type check** after each fix
6. **Run ESLint**: `npx eslint server/ app/`
7. **Fix any linting errors** using the patterns above
8. **Final verification**: Run both checks again to ensure zero errors

### Pre-Commit Checklist

Before considering ANY task complete:

- [ ] Run `npx nuxt typecheck` - **MUST PASS**
- [ ] Run `npx eslint server/ app/` - **MUST PASS**
- [ ] No `any` types in the code
- [ ] No unused variables (unless prefixed with `_`)
- [ ] All functions have return type annotations
- [ ] Proper error handling with type-safe access
- [ ] All property accesses are safe (use `in` operator or optional chaining)

**REMEMBER**: TypeScript errors = Production bugs. Zero tolerance for type errors!

## 📝 MANDATORY: Task Completion Logging

**CRITICAL**: After completing ANY significant task (features, components, pages, utilities, fixes), you MUST update the task completion log with a concise summary.

### When to Update the Log

Update `docs/TASK_COMPLETION_LOG.md` after completing:

- ✅ New features or major functionality
- ✅ Component development (one or more components)
- ✅ Page creation or major updates
- ✅ API endpoint implementation
- ✅ Utility function creation
- ✅ Major bug fixes or refactoring
- ✅ Configuration changes affecting the project

**DO NOT** log minor changes like:

- ❌ Small typo fixes
- ❌ Minor formatting adjustments
- ❌ Documentation-only updates (unless major)
- ❌ Dependency updates alone

### Log Entry Format

Each log entry MUST follow this **highly condensed** format (1-2 paragraphs maximum):

```markdown
## Phase X.Y: [Phase Name]

**Status**: ✅ Completed | **Date**: YYYY-MM-DD

[Single comprehensive paragraph summarizing: what was built (~line count), key components/files with main features in parentheses, technical implementation highlights, and notable features. Include specific numbers, file names, and technologies. Mention any important notes like TypeScript errors, validation results, or known limitations at the end.]
```

### Log Entry Template

```markdown
## Phase X.Y: [Descriptive Phase Name]

**Status**: ✅ Completed | **Date**: 2025-MM-DD

Built [X components/pages/utilities] (~Y lines total) with [Z+ translations if applicable]: ComponentName1 (feature1, feature2, feature3 with specific details), ComponentName2 (feature1 with numbers/specs, feature2), and ComponentName3 (feature1, feature2). [Add technical implementation: integrates X composables, uses Y technology, includes Z features]. [Add key features: responsive design, dark mode, RTL support, accessibility, etc.]. [Add any notes: TypeScript errors, validation results, known limitations].
```

### Examples of Good Log Entries

**Example 1 - Components:**

```markdown
## Phase 5.2: Form Components

**Status**: ✅ Completed | **Date**: 2025-11-17

Built 7 form components (~1,300 lines) with 600+ bilingual translations: RoleSelector (10 roles + "Other", custom icons), AudienceSelector (10 audiences + "Other"), TaskInput (auto-resize textarea, character counter 10-1000, color-coded progress), ToneSelector (9 tone cards with responsive grid), OutputFormatSelector (14 formats + "Other"), ConstraintsSelector (10 checkboxes with multi-select, "Other" textarea), and AdvancedOptions (collapsible, enhancement level toggle, examples/context textareas with character limits). All components feature real-time validation, Pinia store integration, dark mode, RTL support, and accessibility. Note: 6 TypeScript errors from Nuxt UI slot typing limitations (framework-specific, no runtime impact).
```

### Writing Guidelines for Token Optimization

1. **Use parentheses for details** instead of bullet points or separate lines
2. **Combine related information** using commas and conjunctions
3. **Use specific numbers** (~X lines, Y+ translations, Z components)
4. **Abbreviate where clear** (EN/AR, TXT/MD/JSON, RTL, SEO, ARIA)
5. **Group features** by category (all components, all features, all tech)
6. **Avoid redundant words** like "successfully", "implemented", "created" when "built" suffices
7. **Use forward slashes** for alternatives (light/dark, EN/AR)
8. **Keep to 1-2 paragraphs** maximum per phase
9. **Mention file names** with extensions (ComponentName.vue, utils.ts)
10. **End with notable info** (validation results, known issues, TypeScript errors)

### Update Workflow

After completing a task:

1. ✅ **Validate code** (TypeScript + ESLint checks pass)
2. ✅ **Open** `docs/TASK_COMPLETION_LOG.md`
3. ✅ **Add new phase section** at the end of the file (before any existing "Next Steps")
4. ✅ **Write 1-2 paragraph summary** following the format above
5. ✅ **Include key metrics**: line counts, file counts, translation counts
6. ✅ **List main files/components** created or modified
7. ✅ **Mention key technologies** and integration points
8. ✅ **Note validation results** or known limitations
9. ✅ **Add horizontal separator** (`---`) after entry
10. ✅ **Save file** and confirm update

## MCP Servers (Model Context Protocol)

This project has the following MCP servers installed and configured:

### Active MCP Servers

1. **Filesystem MCP** (`@modelcontextprotocol/server-filesystem`)

   - **Status**: ✓ Connected
   - **Purpose**: Secure file operations within the project directory
   - **Usage**: Read, write, search, and modify files safely
   - **Scope**: `D:/WebDev/AKG_Websites/ai-prompt-assistant`

2. **Puppeteer MCP** (`puppeteer-mcp-server`)

   - **Status**: ✓ Connected
   - **Purpose**: Browser automation for testing and web scraping
   - **Usage**: Web automation, screenshots, form filling, data extraction, page navigation
   - **Features**: Browser control, screenshot capture, element interaction, JavaScript execution, console monitoring

3. **Nuxt MCP** (`nuxt-mcp`)
   - **Status**: ✓ Installed as npm module
   - **Purpose**: Helps AI understand Nuxt app structure and auto-imports
   - **Endpoint**: `http://localhost:3000/__mcp/sse` (when dev server is running)
   - **Features**: Project introspection, component listing, auto-import discovery

### MCP Server Management

```bash
# List all installed MCP servers
claude mcp list

# Test a specific server
claude mcp get [server-name]

# Remove a server
claude mcp remove [server-name] -s local
```

### Configuration Location

MCP servers are configured in:

- Windows: `C:\Users\[username]\.claude.json`
- Project-scoped configuration is stored locally

## Project Architecture

### Core Structure

- **app/**: Application source code (Pages, Components, Composables, Layouts)
- **public/**: Static assets (favicon, robots.txt)
- **docs/**: Product requirements, API specs, data schemas, and configuration requirements
- **server/api/**: Server API routes (Nitro-powered)

### Directory Structure Conventions

```
/app/                   # Frontend (Nuxt 4 uses /app/ not /src/)
  /assets/css/          # Tailwind CSS v4 theme config
  /components/          # Auto-imported Vue components (organized by feature)
  /composables/         # Auto-imported composables (useApi, useAuth, etc.)
  /layouts/             # Layout templates
  /middleware/          # Client-side route guards
  /pages/               # Auto-routing pages
  /plugins/             # Vue plugins
  /stores/              # Pinia stores
  /utils/               # Client utilities
  app.vue               # Root component

/server/                # Backend (Nitro/H3)
  /api/                 # API endpoints (RESTful routes)
  /middleware/          # Server middleware (auth, location-access)
  /utils/               # Server utilities (WAC, validation)

/prisma/                # Database schema & migrations (when configured)
/docs/          # Documentation (PRD, tasks, guides)
```

### Key Features to Implement

1. **Smart Prompt Builder**: Interactive form with real-time guidance, context-aware suggestions, character limit optimizer
2. **Prompt Enhancement Engine**: Two modes (Quick Polish / Deep Enhancement) using Gemini API
3. **Prompt Quality Analyzer**: Real-time quality score (0-100), improvement suggestions, completeness indicators
4. **Results Experience**: Side-by-side comparison, one-click copy, multiple export formats (TXT, MD, JSON)

### API Endpoints (To Be Implemented)

All endpoints under `/api/`:

- **POST /api/enhance-prompt**: Main enhancement endpoint using Gemini API

  - Accepts: role, audience, task, tone, outputFormat, constraints, examples, context, enhancementLevel, language
  - Returns: enhancedPrompt, qualityScore, improvements, suggestions, alternativeVersions
  - Rate limit: 5 requests/minute per user (via queue system)
  - Timeout: 30 seconds

- **POST /api/analyze-prompt**: Analyze prompt quality without enhancement
- **POST /api/export**: Export prompts in various formats
- **GET /api/health**: Health check

### Data Models

Key TypeScript interfaces are defined in `docs/DataSchema.md`:

- **FormInput**: User input form structure with role, audience, task, tone, outputFormat, constraints, etc.
- **EnhancementResponse**: API response structure with enhancedPrompt, qualityScore, improvements, metadata
- **LocalData**: Local storage schema for preferences, drafts, history, and statistics

### Modules & Configuration

Current Nuxt modules in use:

- `@nuxt/eslint`: Code linting
- `@nuxt/hints`: Development hints
- `@nuxt/image`: Image optimization
- `@nuxt/ui`: UI component library (Tailwind-based)
- `@nuxt/test-utils`: Testing utilities
- `nuxt-mcp`: MCP server integration for AI-assisted development

**Required additions** (per ConfigurationRequirements.md):

- `@nuxtjs/i18n`: Bilingual support (English/Arabic)
- `@nuxtjs/google-fonts`: Inter & IBM Plex Sans Arabic fonts
- `@vueuse/nuxt`: Composition API utilities

### Environment Variables

Required for production:

```env
GROQ_API_KEY=                     # Groq API key (primary provider)
GEMINI_API_KEY=                   # Google AI Studio API key (fallback)
NUXT_PUBLIC_GEMINI_MODEL=gemini-pro
NUXT_PUBLIC_APP_URL=              # Production URL
```

Optional:

```env
SUPABASE_URL=                     # For analytics (optional)
SUPABASE_ANON_KEY=
ENABLE_ANALYTICS=false
ENABLE_EXPORT=true
```

### Styling & Design

- **Primary Color**: Emerald (#45cf7b)
- **Secondary Color**: Navy (#000046)
- **Fonts**: Inter (Latin), IBM Plex Sans Arabic
- **Bilingual**: LTR (English) and RTL (Arabic) support required
- **Target**: WCAG 2.1 AA compliance, responsive design

### Performance Targets

- Response time: < 2 seconds for enhancement
- Lighthouse Performance: > 95
- Initial JS: < 150KB
- First Contentful Paint: < 1s
- Time to Interactive: < 3s

### Security Considerations

- Input sanitization for XSS prevention
- Rate limiting per user (5 requests/minute via queue)
- No sensitive data storage or logging
- Request size limits (max 1MB payload)
- Timeout protection (30s max)

### Deployment

- **Platform**: Vercel (Edge Functions)
- **Preset**: vercel-edge
- **Node Version**: 20.x
- **SSR**: Enabled
- **Output Directory**: `.output`

## Development Notes

- This is an MVP (Version 1.0) with no user authentication
- Uses Groq (primary) + Gemini (fallback) with 5 requests/minute per user limit
- Client-side processing where possible to minimize server costs
- Zero operational cost target
- Target users: Up to 100 Alkholi Group employees
- Auto-save drafts every 10 seconds to local storage
- Store last 10 prompts in local storage for history

## Important Documentation

Refer to these files for detailed specifications:

- `docs/PRD.md`: Product requirements, feature set, success metrics
- `docs/APISpecification.md`: Complete API contract and error handling
- `docs/DataSchema.md`: TypeScript interfaces and data models
- `docs/ConfigurationRequirements.md`: Environment setup, dependencies, deployment config
- `docs/UIUXWireframes.md`: Interface design specifications
- `docs/DevelopmentTasks.md`: MVP development phases (Phases 1-15)
- `docs/PostReleaseEnhancements.md`: Post-MVP enhancements and future features
- `docs/TASK_COMPLETION_LOG.md`: Completed tasks and implementation history
- The dev server is always running on http://localhost:5000/