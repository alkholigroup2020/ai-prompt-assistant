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

## MCP Servers (Model Context Protocol)

This project has the following MCP servers installed and configured:

### Active MCP Servers

1. **Filesystem MCP** (`@modelcontextprotocol/server-filesystem`)

   - **Status**: ✓ Connected
   - **Purpose**: Secure file operations within the project directory
   - **Usage**: Read, write, search, and modify files safely
   - **Scope**: `D:/WebDev/AKG_Websites/ai-prompt-assistant`

2. **Memory MCP** (`@modelcontextprotocol/server-memory`)

   - **Status**: ✓ Connected
   - **Purpose**: Knowledge graph-based persistent memory system
   - **Usage**: Store and retrieve project context, prompt templates, user preferences across sessions
   - **Storage**: JSON-based with nodes and relationships

3. **Fetch MCP** (`mcp-server-fetch-typescript`)

   - **Status**: ✓ Connected
   - **Purpose**: Web content fetching and conversion
   - **Usage**: Fetch API documentation, example prompts, research materials
   - **Formats**: HTML, JSON, Markdown, plain text

4. **Puppeteer MCP** (`@modelcontextprotocol/server-puppeteer`)

   - **Status**: ✓ Connected
   - **Purpose**: Browser automation for testing and web scraping
   - **Usage**: Automated testing, screenshots, form filling, data extraction
   - **Features**: Full-page/element screenshots, JS execution, console monitoring

5. **Nuxt MCP** (`nuxt-mcp`)
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
4. **Template Library**: 20+ pre-built templates, category-based organization
5. **Results Experience**: Side-by-side comparison, one-click copy, multiple export formats (TXT, MD, JSON)

### API Endpoints (To Be Implemented)

All endpoints under `/api/`:

- **POST /api/enhance-prompt**: Main enhancement endpoint using Gemini API

  - Accepts: role, audience, task, tone, outputFormat, constraints, examples, context, enhancementLevel, language
  - Returns: enhancedPrompt, qualityScore, improvements, suggestions, alternativeVersions
  - Rate limit: 60 requests/minute (Gemini free tier)
  - Timeout: 30 seconds

- **GET /api/templates**: Retrieve prompt templates
- **GET /api/templates/:id**: Get specific template
- **POST /api/analyze-prompt**: Analyze prompt quality without enhancement
- **POST /api/export**: Export prompts in various formats
- **GET /api/health**: Health check

### Data Models

Key TypeScript interfaces are defined in `docs/DataSchema.md`:

- **FormInput**: User input form structure with role, audience, task, tone, outputFormat, constraints, etc.
- **EnhancementResponse**: API response structure with enhancedPrompt, qualityScore, improvements, metadata
- **PromptTemplate**: Template structure with category, variables, examples, difficulty level
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
GEMINI_API_KEY=                   # Google AI Studio API key
NUXT_PUBLIC_GEMINI_MODEL=gemini-pro
NUXT_PUBLIC_APP_URL=              # Production URL
RATE_LIMIT_WINDOW=60000           # 60 seconds in ms
RATE_LIMIT_MAX_REQUESTS=60        # Gemini free tier limit
```

Optional:

```env
SUPABASE_URL=                     # For analytics (optional)
SUPABASE_ANON_KEY=
ENABLE_ANALYTICS=false
ENABLE_TEMPLATES=true
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
- Rate limiting per session (60 requests/minute)
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
- Uses Gemini API free tier with 60 requests/minute limit
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
