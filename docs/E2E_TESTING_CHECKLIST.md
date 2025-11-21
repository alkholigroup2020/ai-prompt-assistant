# AI Prompt Assistant - End-to-End Testing Checklist

**Version**: 1.0 MVP
**Last Updated**: 2025-11-19
**Production URL**: https://ai-prompt-assistant-nu.vercel.app

---

## Testing Prerequisites

- [ ] Access to production deployment URL
- [ ] Test on Chrome, Firefox, Safari, and Edge browsers
- [ ] Test on mobile devices (iOS Safari, Chrome Mobile)
- [ ] Test with desktop viewports: 1920x1080, 1366x768
- [ ] Test with tablet viewport: 768x1024
- [ ] Test with mobile viewports: 375x667, 414x896
- [ ] Gemini API key configured in Vercel environment variables
- [ ] Deployment protection disabled for public access

---

## 1. Landing Page (`/`)

### Hero Section
- [ ] Page loads within 3 seconds
- [ ] Hero headline displays correctly in English
- [ ] Hero subheadline is visible and readable
- [ ] "Get Started" CTA button is visible and clickable
- [ ] "Browse Templates" button is visible and clickable
- [ ] Animated sparkles icon displays
- [ ] Trust indicators show (AI-powered, bilingual, 20+ templates)
- [ ] Background gradient (navy/emerald) renders correctly

### Value Propositions Section
- [ ] All 4 value proposition cards display
  - [ ] "80% Better Results" card with icon
  - [ ] "3x Faster" card with icon
  - [ ] "20+ Templates" card with icon
  - [ ] "2 Languages" card with icon
- [ ] Cards are responsive (1 column mobile, 2 on tablet, 4 on desktop)
- [ ] Hover effects work on desktop
- [ ] Card icons display correctly

### How It Works Section
- [ ] Section title "How It Works" displays
- [ ] All 3 steps are visible:
  - [ ] Step 1: Describe Your Task (with step badge "1")
  - [ ] Step 2: Get Enhanced Prompt (with step badge "2")
  - [ ] Step 3: Copy & Use (with step badge "3")
- [ ] Step arrows display on desktop (between steps)
- [ ] Icons display for each step
- [ ] Responsive layout works (stacks on mobile)

### Templates Preview Section
- [ ] Section title "Popular Templates" displays
- [ ] 4 featured template cards show
- [ ] Each card displays:
  - [ ] Category badge (Business, Technical, etc.)
  - [ ] Template title
  - [ ] Template description
  - [ ] Difficulty indicator
  - [ ] "Use Template" button
- [ ] "View All Templates" button is visible
- [ ] Cards are clickable/hoverable

### Final CTA Section
- [ ] Section displays with emerald gradient background
- [ ] CTA headline is visible
- [ ] "Start Building Now" button works
- [ ] Hover effects function

### Navigation
- [ ] Header logo links to homepage
- [ ] Navigation menu items work:
  - [ ] Home
  - [ ] Builder
  - [ ] Templates
- [ ] Language switcher (EN/AR) is visible
- [ ] Theme toggle (light/dark) is visible
- [ ] Footer displays with company info
- [ ] All footer links are clickable

### SEO & Meta Tags
- [ ] Page title displays correctly in browser tab
- [ ] Meta description is present (view source)
- [ ] Open Graph tags present for social sharing
- [ ] Twitter Card meta tags present

---

## 2. Prompt Builder Page (`/builder`)

### Page Layout
- [ ] Page loads successfully
- [ ] Two-column layout on desktop (form left, preview right)
- [ ] Layout stacks on mobile (form first, then preview)
- [ ] Progress indicator displays at top (0-100%)
- [ ] Page title "AI Prompt Builder" displays

### Form Section 1: Basic Information

#### Role Selector
- [ ] Role dropdown displays with label "Your Role"
- [ ] Dropdown opens showing 10+ role options:
  - [ ] Content Writer
  - [ ] Developer
  - [ ] Designer
  - [ ] Manager
  - [ ] Marketer
  - [ ] Student
  - [ ] Researcher
  - [ ] Analyst
  - [ ] Executive
  - [ ] Consultant
  - [ ] Other (custom input)
- [ ] Each role has an icon
- [ ] "Other" option shows text input
- [ ] Validation error displays if left empty
- [ ] Tooltip/help text displays on hover

#### Audience Selector
- [ ] Audience dropdown displays with label "Target Audience"
- [ ] Dropdown shows 10+ audience options:
  - [ ] General Public
  - [ ] Professionals
  - [ ] Students
  - [ ] Technical Experts
  - [ ] Business Leaders
  - [ ] Children
  - [ ] Seniors
  - [ ] Team Members
  - [ ] Customers
  - [ ] Stakeholders
  - [ ] Other (custom input)
- [ ] "Other" option shows text input
- [ ] Validation error displays if left empty
- [ ] Help text displays

#### Task Input
- [ ] Large textarea displays with label "What do you want to accomplish?"
- [ ] Character counter displays (10-1000 characters)
- [ ] Counter updates in real-time as you type
- [ ] Counter is color-coded:
  - [ ] Red when <10 characters
  - [ ] Yellow when 10-50 characters
  - [ ] Green when 50+ characters
- [ ] Validation error shows if <10 or >1000 characters
- [ ] Textarea auto-resizes as you type
- [ ] Placeholder text displays helpful example
- [ ] Progress percentage shows (current/max)

### Form Section 2: Style & Format

#### Tone Selector
- [ ] Section displays with label "Tone"
- [ ] 9 tone option cards/buttons display:
  - [ ] Professional
  - [ ] Friendly
  - [ ] Formal
  - [ ] Casual
  - [ ] Technical
  - [ ] Creative
  - [ ] Persuasive
  - [ ] Educational
  - [ ] Empathetic
- [ ] Cards arranged in responsive grid (2-3 columns)
- [ ] Selected tone is highlighted/checked
- [ ] Each tone has a description
- [ ] Cards have hover effects
- [ ] Keyboard navigation works (arrow keys)
- [ ] Radio group semantics work (only one selected)

#### Output Format Selector
- [ ] Format dropdown displays with label "Output Format"
- [ ] Dropdown shows 14+ format options:
  - [ ] Paragraph
  - [ ] Bullet Points
  - [ ] Numbered List
  - [ ] Step-by-Step Guide
  - [ ] Email
  - [ ] Report
  - [ ] Summary
  - [ ] Code
  - [ ] Table
  - [ ] Outline
  - [ ] Script
  - [ ] FAQ
  - [ ] Checklist
  - [ ] Comparison
  - [ ] Other (custom input)
- [ ] Each format has an icon
- [ ] "Other" option shows text input

### Form Section 3: Constraints

#### Constraints Selector
- [ ] Section displays with label "Constraints"
- [ ] 10 constraint checkboxes display:
  - [ ] Keep it concise
  - [ ] Be detailed
  - [ ] Use simple language
  - [ ] Include examples
  - [ ] Avoid jargon
  - [ ] Use technical terms
  - [ ] Add citations
  - [ ] Conversational style
  - [ ] Data-driven
  - [ ] Time-sensitive
- [ ] Multiple checkboxes can be selected
- [ ] "Other" option has textarea for custom constraints
- [ ] Each constraint has tooltip explaining it
- [ ] Selection is persistent when navigating away

### Form Section 4: Advanced Options

#### Advanced Options (Collapsible)
- [ ] "Advanced Options" section is collapsible
- [ ] Click to expand/collapse works
- [ ] Collapse icon rotates (chevron down/up)
- [ ] Enter/Space key toggles collapse
- [ ] `aria-expanded` attribute changes

#### Examples Input (within Advanced)
- [ ] Textarea displays with label "Examples (optional)"
- [ ] Character counter displays (max 500 characters)
- [ ] Placeholder text shows helpful guidance
- [ ] Input is optional (no validation error when empty)

#### Context Input (within Advanced)
- [ ] Textarea displays with label "Additional Context (optional)"
- [ ] Character counter displays (max 500 characters)
- [ ] Placeholder text displays
- [ ] Input is optional

#### Enhancement Level Toggle
- [ ] Two toggle buttons display:
  - [ ] "Quick Polish" (default)
  - [ ] "Deep Enhancement"
- [ ] Only one can be selected (radio behavior)
- [ ] Selected option is visually highlighted
- [ ] Keyboard navigation works (arrow keys)

### Live Preview Panel (Right Sidebar)

#### Preview Card
- [ ] Preview panel is sticky on desktop
- [ ] "Your Prompt Preview" title displays
- [ ] Preview updates in real-time as you type
- [ ] Word count displays (e.g., "0 words")
- [ ] Character count displays (e.g., "0 characters")
- [ ] Preview text shows formatted prompt
- [ ] Preview is scrollable if content is long

#### Quality Score Display
- [ ] Circular progress indicator displays (0-100)
- [ ] Score updates in real-time
- [ ] Score is color-coded:
  - [ ] Red (0-39): Poor
  - [ ] Yellow (40-69): Fair
  - [ ] Green (70-100): Good
- [ ] Quality label displays (Poor/Fair/Good/Excellent)
- [ ] Animation is smooth (60fps)

#### Quality Breakdown
- [ ] Breakdown section displays with "Quality Breakdown" title
- [ ] 5 metric bars display:
  - [ ] Clarity (progress bar)
  - [ ] Specificity (progress bar)
  - [ ] Context (progress bar)
  - [ ] Structure (progress bar)
  - [ ] Completeness (progress bar)
- [ ] Each bar has an icon
- [ ] Bars animate smoothly
- [ ] Percentage displays for each metric

#### Improvement Suggestions
- [ ] Suggestions section displays with title
- [ ] Suggestions list updates based on form input
- [ ] Suggestions are grouped by priority:
  - [ ] Critical (red badge)
  - [ ] Important (yellow badge)
  - [ ] Minor (blue badge)
- [ ] Each suggestion has an icon
- [ ] Suggestions are dismissible (X button)
- [ ] Empty state shows when no suggestions

### Enhancement Buttons
- [ ] Two enhancement buttons display:
  - [ ] "Quick Polish" button (primary style)
  - [ ] "Deep Enhancement" button (secondary style)
- [ ] Buttons are disabled if form is invalid
- [ ] Buttons show loading spinner during API call
- [ ] Hover effects work
- [ ] Buttons have proper ARIA labels

### Auto-save Functionality
- [ ] Auto-save status indicator displays
- [ ] Shows "Saved" or "Saving..." status
- [ ] Draft saves every 10 seconds automatically
- [ ] Draft persists on page reload
- [ ] Draft can be cleared

### Keyboard Shortcuts
- [ ] `Ctrl+Enter` triggers Quick Polish
- [ ] `Ctrl+Shift+Enter` triggers Deep Enhancement
- [ ] `Ctrl+S` manually saves draft
- [ ] `Ctrl+R` resets form
- [ ] `Esc` clears focus from current input
- [ ] Shortcuts are documented (visible on page or tooltip)

### Form Validation
- [ ] Required fields show error if empty
- [ ] Character limits are enforced
- [ ] Error messages display below invalid fields
- [ ] Error messages are announced to screen readers
- [ ] Form cannot be submitted if invalid
- [ ] Validation happens on blur and on submit

### API Integration
- [ ] Clicking "Quick Polish" makes API call
- [ ] Clicking "Deep Enhancement" makes API call
- [ ] Loading spinner displays during API call
- [ ] Success redirects to `/results` page
- [ ] Error displays toast notification
- [ ] Rate limiting (60 req/min) is enforced
- [ ] Toast shows error message if API fails

---

## 3. Results Page (`/results`)

### Page Load & Redirect
- [ ] Page displays enhanced prompt results
- [ ] Redirects to `/builder` if no results (direct access)
- [ ] Results persist on page reload (from localStorage)

### Success Header
- [ ] Success message displays with checkmark icon
- [ ] Congratulatory message is visible
- [ ] Quality score badge displays (Good/Excellent/etc.)

### Quality Score Display
- [ ] Large circular quality score indicator (0-100)
- [ ] Score is color-coded (red/yellow/green)
- [ ] Quality rating label displays
- [ ] Animation plays on mount

### Action Buttons Section
- [ ] "Copy to Clipboard" button displays
  - [ ] Click copies enhanced prompt
  - [ ] Success toast shows "Copied!"
  - [ ] Button shows checkmark temporarily
  - [ ] `aria-live` announces success
- [ ] "Download" button displays with format dropdown
  - [ ] Dropdown shows TXT, MD, JSON options
  - [ ] Each format downloads correctly
  - [ ] Downloaded files have proper formatting
  - [ ] Filenames are meaningful (e.g., `enhanced-prompt.txt`)
- [ ] "Share" button displays (if implemented)
  - [ ] Generates shareable URL
  - [ ] Copies URL to clipboard
- [ ] "Create New Prompt" button displays
  - [ ] Navigates back to `/builder`
  - [ ] Clears previous form data

### Comparison View (Side-by-Side)
- [ ] Section displays "Before & After" or similar title
- [ ] Original prompt displays on left
  - [ ] Label "Original Prompt" visible
  - [ ] Full original text displays
  - [ ] Word count displays
  - [ ] Character count displays
- [ ] Enhanced prompt displays on right
  - [ ] Label "Enhanced Prompt" visible
  - [ ] Full enhanced text displays
  - [ ] Word count displays
  - [ ] Character count displays
- [ ] Improvement percentage displays (e.g., "+150% more detailed")
- [ ] Layout is responsive (stacks on mobile)
- [ ] Text is scrollable if long

### Improvements List
- [ ] "Improvements Made" section displays
- [ ] List of improvements shows with checkmarks
- [ ] Improvements are grouped by category:
  - [ ] Structure improvements
  - [ ] Clarity improvements
  - [ ] Context additions
  - [ ] Format adjustments
- [ ] Each improvement has an icon
- [ ] Details are expandable (if applicable)
- [ ] Empty state shows if no improvements

### Alternative Versions (Tabs)
- [ ] "Alternative Versions" section displays
- [ ] 3 tabs are visible:
  - [ ] "Concise" version tab
  - [ ] "Detailed" version tab
  - [ ] "Technical" version tab
- [ ] Clicking tabs switches content
- [ ] Active tab is highlighted
- [ ] Each version displays different text
- [ ] Copy button on each version
- [ ] Word/character stats for each version

### Next Steps Card
- [ ] "What's Next?" or similar section displays
- [ ] Suggestion to copy and use prompt
- [ ] Button to "Create Another Prompt"
- [ ] Button to "Browse Templates"

### Pro Tips Section
- [ ] "Pro Tips" section displays (optional)
- [ ] 3-4 usage tips show with icons
- [ ] Tips are helpful and actionable

### History Persistence
- [ ] Result is automatically saved to history (localStorage)
- [ ] User stats are updated (prompt count, avg quality score)
- [ ] Save happens on page mount

---

## 4. Templates Page (`/templates`)

### Template Gallery (Index)

#### Page Layout
- [ ] Page loads successfully
- [ ] Page title "Prompt Templates" displays
- [ ] Page description/subtitle displays
- [ ] Responsive grid layout (1 column mobile, 2 tablet, 3 desktop)

#### Search & Filters
- [ ] Search input displays with placeholder
- [ ] Search works in real-time (filters templates)
- [ ] Category filter dropdown displays
  - [ ] Shows all 5 categories:
    - [ ] Business
    - [ ] Technical
    - [ ] Creative
    - [ ] Analysis
    - [ ] Communication
  - [ ] "All Categories" option
  - [ ] Selection filters templates
- [ ] Difficulty filter displays
  - [ ] Shows 3 difficulty levels:
    - [ ] Beginner
    - [ ] Intermediate
    - [ ] Advanced
  - [ ] "All Levels" option
  - [ ] Selection filters templates
- [ ] Sort dropdown displays
  - [ ] Sort by: Most Popular
  - [ ] Sort by: Newest
  - [ ] Sort by: Difficulty
  - [ ] Sort by: A-Z
- [ ] Active filters display (with clear button)
- [ ] "Clear All Filters" button works

#### Template Cards (25 Templates)
- [ ] All 25 templates display (when no filters)
- [ ] Each card shows:
  - [ ] Template title
  - [ ] Category badge (color-coded)
  - [ ] Difficulty badge (beginner/intermediate/advanced)
  - [ ] Short description
  - [ ] Star rating (0-5 stars)
  - [ ] Estimated time (e.g., "5 min")
  - [ ] Usage count (e.g., "Used 150 times")
  - [ ] "New" or "Popular" tag (if applicable)
- [ ] Hover effects work (lift/shadow)
- [ ] Cards are clickable
- [ ] "Use Template" button on each card
  - [ ] Navigates to template detail page
  - [ ] Or applies template directly to builder

#### Pagination
- [ ] Pagination displays at bottom
- [ ] Shows current page and total pages (e.g., "Page 1 of 3")
- [ ] "Previous" button works (disabled on first page)
- [ ] "Next" button works (disabled on last page)
- [ ] Page numbers are clickable (if shown)
- [ ] 12 templates per page (default)

#### Loading States
- [ ] Skeleton loading cards display while fetching
- [ ] 6 skeleton cards match real card structure
- [ ] Pulse animation on skeletons
- [ ] Loading spinner (if applicable)

#### Empty States
- [ ] Empty state shows when no templates match filters
- [ ] Message: "No templates found" or similar
- [ ] Suggestion to clear filters
- [ ] "Clear Filters" button

### Template Detail Page (`/templates/[id]`)

#### Page Load
- [ ] Page loads with template ID from URL
- [ ] Loading state displays while fetching
- [ ] Error state shows if template not found
- [ ] Breadcrumb navigation shows (Templates > Category > Template Name)

#### Template Header
- [ ] Template title displays prominently
- [ ] Category badge displays
- [ ] Difficulty indicator displays
- [ ] Star rating displays
- [ ] Estimated time displays
- [ ] Usage count displays
- [ ] "Back to Templates" button works

#### Template Description
- [ ] Full description displays
- [ ] Formatting is preserved (bold, lists, etc.)
- [ ] Description is readable and well-structured

#### Variable Input Fields
- [ ] All template variables show as input fields
- [ ] Each input has:
  - [ ] Label (from variable definition)
  - [ ] Placeholder text
  - [ ] Help text/description
  - [ ] Character limit indicator (if applicable)
  - [ ] Required indicator (if required)
- [ ] Different input types supported:
  - [ ] Text input (single line)
  - [ ] Textarea (multi-line)
  - [ ] Select dropdown (options)
  - [ ] Multi-select (multiple options)
- [ ] Real-time validation
- [ ] Error messages for invalid inputs

#### Live Preview Panel
- [ ] Preview section displays
- [ ] Shows prompt with {{variable}} substitution
- [ ] Updates in real-time as variables change
- [ ] Preview is formatted correctly

#### Examples Gallery (if applicable)
- [ ] Example outputs display
- [ ] Multiple examples show (2-3)
- [ ] Each example has:
  - [ ] Example input values
  - [ ] Example output prompt
- [ ] Examples are formatted and readable

#### Action Buttons
- [ ] "Apply Template" button displays
  - [ ] Validates required fields
  - [ ] Navigates to `/builder` with pre-filled form
  - [ ] Form fields populated from template variables
  - [ ] Tone is auto-set based on category
  - [ ] Success toast displays
- [ ] "Back to Templates" button works
- [ ] "Copy Base Prompt" button (optional)

---

## 5. Error Pages

### 404 Page (Page Not Found)
- [ ] Displays when accessing invalid URL (e.g., `/invalid-page`)
- [ ] Error code "404" displays prominently
- [ ] Blue color theme (not red)
- [ ] Friendly error title: "Page Not Found"
- [ ] Error message explains what happened
- [ ] Description suggests next steps
- [ ] Action buttons display:
  - [ ] "Go Home" button (navigates to `/`)
  - [ ] "Go Back" button (browser back)
  - [ ] "Browse Templates" button
  - [ ] "Start Building" button
- [ ] Suggestions section with 4 quick links
- [ ] Icon displays (404 illustration or similar)

### 500 Page (Server Error)
- [ ] Displays on server error
- [ ] Error code "500" displays prominently
- [ ] Red color theme
- [ ] Error title: "Something Went Wrong"
- [ ] Error message is user-friendly
- [ ] Description explains the issue
- [ ] Action buttons display:
  - [ ] "Go Home" button
  - [ ] "Try Again" button (refreshes page)
  - [ ] "Report Issue" button (optional)
- [ ] Support contact info displays

### Generic Error Page
- [ ] Displays for other errors (non-404/500)
- [ ] Yellow/amber color theme
- [ ] Generic error icon
- [ ] Error title displays
- [ ] Error message displays
- [ ] Suggestions section

### Error Page Features (All)
- [ ] Layout uses default template (header/footer)
- [ ] Responsive design works
- [ ] All buttons are functional
- [ ] SEO meta tags include `noindex, nofollow`
- [ ] Error pages work in both EN and AR

---

## 6. Internationalization (i18n) & RTL

### Language Switching (EN/AR)

#### Language Switcher
- [ ] Language toggle button in header
- [ ] Shows current language (EN or AR)
- [ ] Click toggles between EN and AR
- [ ] Globe icon or flag icon displays
- [ ] Accessible via keyboard (Tab + Enter)

#### URL Updates
- [ ] English URLs have no prefix (e.g., `/builder`)
- [ ] Arabic URLs have `/ar` prefix (e.g., `/ar/builder`)
- [ ] URL updates when language switches
- [ ] Browser URL bar reflects current language
- [ ] Direct access to `/ar/builder` works

#### Content Translation
- [ ] All static text translates (navigation, buttons, labels)
- [ ] Form labels translate
- [ ] Error messages translate
- [ ] Tooltips translate
- [ ] Footer text translates
- [ ] Page titles translate
- [ ] Template content translates

#### Persistence
- [ ] Language preference saves to localStorage
- [ ] Preference persists on page reload
- [ ] Preference persists across sessions
- [ ] Cookie is set (if applicable)

### RTL (Right-to-Left) Support

#### Layout Direction
- [ ] HTML `dir` attribute changes to `rtl` for Arabic
- [ ] `lang` attribute changes to `ar` for Arabic
- [ ] All text aligns to the right
- [ ] Reading flow is right-to-left

#### UI Adjustments
- [ ] Navigation menu flips (logo on right)
- [ ] Form labels align to right
- [ ] Input text aligns to right
- [ ] Buttons remain readable
- [ ] Icons flip correctly (arrows, chevrons)
- [ ] Progress bars fill right-to-left
- [ ] Dropdown arrows position correctly
- [ ] Modal close button positions on left

#### Responsive Behavior
- [ ] Mobile menu opens from right side
- [ ] Grid columns flow correctly
- [ ] Flex layouts reverse correctly
- [ ] Margins/padding adjust (start/end not left/right)

#### Typography
- [ ] Arabic font loads (IBM Plex Sans Arabic)
- [ ] Font size is readable
- [ ] Line height is appropriate
- [ ] Text doesn't overflow containers

### Translation Coverage
- [ ] Landing page fully translates
- [ ] Builder page fully translates (all form fields)
- [ ] Results page fully translates
- [ ] Templates page fully translates
- [ ] Error pages fully translate
- [ ] Toast notifications translate
- [ ] Validation messages translate
- [ ] Quality score labels translate
- [ ] Keyboard shortcut hints translate

---

## 7. Dark Mode / Theme Switching

### Theme Toggle
- [ ] Theme toggle button in header
- [ ] Shows sun icon (light mode) or moon icon (dark mode)
- [ ] Click toggles between light and dark
- [ ] Keyboard accessible (Tab + Enter)
- [ ] `aria-label` describes current theme

### Theme Modes
- [ ] Three modes supported:
  - [ ] Light mode
  - [ ] Dark mode
  - [ ] Auto (system preference)
- [ ] Cycle through modes: light → dark → auto → light

### Visual Changes (Dark Mode)
- [ ] Background changes to dark gray (#111827 or similar)
- [ ] Text changes to light gray/white
- [ ] Cards have darker background (#1f2937 or similar)
- [ ] Borders are visible (lighter gray)
- [ ] Primary color (emerald) adjusts (#4ade80 in dark)
- [ ] Shadows adjust for dark backgrounds
- [ ] Focus indicators remain visible
- [ ] Links remain readable

### Component Coverage
- [ ] Header adapts to dark mode
- [ ] Footer adapts to dark mode
- [ ] Landing page adapts
- [ ] Builder form adapts
- [ ] Results page adapts
- [ ] Templates page adapts
- [ ] Error pages adapt
- [ ] Modals adapt
- [ ] Toasts adapt
- [ ] Buttons adapt (all variants)

### Contrast & Accessibility
- [ ] Text contrast meets WCAG AA (4.5:1 minimum)
- [ ] Interactive elements contrast meets AA (3:1 minimum)
- [ ] Focus indicators are visible
- [ ] No color-only information

### Persistence
- [ ] Theme preference saves to localStorage
- [ ] Preference persists on page reload
- [ ] Preference persists across sessions
- [ ] Auto mode detects system preference
- [ ] System preference changes are detected (if auto mode)

---

## 8. Accessibility (WCAG 2.1 AA)

### Keyboard Navigation
- [ ] All interactive elements are keyboard accessible
- [ ] Tab key moves focus logically
- [ ] Shift+Tab moves focus backward
- [ ] Enter/Space activates buttons
- [ ] Escape closes modals/dropdowns
- [ ] Arrow keys navigate:
  - [ ] Tone selector (radio group)
  - [ ] Tabs (alternative versions)
  - [ ] Dropdown options
- [ ] Focus indicators are visible (2-3px outline)
- [ ] Focus is never trapped unintentionally
- [ ] Skip to main content link works (Shift+Tab on load)

### Screen Reader Support
- [ ] All images have alt text (or `aria-hidden="true"` for decorative)
- [ ] All buttons have descriptive labels or `aria-label`
- [ ] Form inputs have associated labels (`<label for="">`)
- [ ] Error messages announced (`aria-live="polite"` and `role="alert"`)
- [ ] Loading states announced (`aria-busy="true"`)
- [ ] Success messages announced (toast with `aria-live="polite"`)
- [ ] Modal has `role="dialog"` and `aria-modal="true"`
- [ ] Radio groups have `role="radiogroup"` and `aria-label`
- [ ] Checkboxes have proper labels
- [ ] Tabs have `role="tablist"` / `role="tab"` / `role="tabpanel"`

### Semantic HTML
- [ ] Proper heading hierarchy (h1 → h2 → h3, no skips)
- [ ] `<header>`, `<nav>`, `<main>`, `<footer>` landmarks
- [ ] Buttons use `<button>` not `<div>` with click handlers
- [ ] Links use `<a>` elements
- [ ] Lists use `<ul>`, `<ol>`, `<li>`
- [ ] Forms use `<form>`, `<label>`, `<input>` elements

### Color & Contrast
- [ ] Text contrast ≥ 4.5:1 (normal text, WCAG AA)
- [ ] Large text contrast ≥ 3:1 (WCAG AA)
- [ ] UI components contrast ≥ 3:1 (WCAG AA)
- [ ] Focus indicators contrast ≥ 3:1
- [ ] Information not conveyed by color alone
  - [ ] Links have underline or other indicator
  - [ ] Status uses icons + color
  - [ ] Validation uses text + color
- [ ] Dark mode maintains contrast ratios

### Testing Tools
- [ ] Run axe DevTools (browser extension)
  - [ ] Zero critical issues
  - [ ] Zero serious issues
  - [ ] Minimal moderate/minor issues
- [ ] Run Lighthouse Accessibility audit
  - [ ] Score ≥ 90 (target: 96 as achieved)
- [ ] Test keyboard-only navigation (unplug mouse)
  - [ ] Complete full user flow without mouse
- [ ] Test with screen reader (NVDA, JAWS, or VoiceOver)
  - [ ] Navigate landing page
  - [ ] Fill out builder form
  - [ ] Navigate results page

---

## 9. Performance

### Load Performance
- [ ] First Contentful Paint (FCP) < 1.5 seconds
- [ ] Largest Contentful Paint (LCP) < 2.5 seconds
- [ ] Time to Interactive (TTI) < 3.5 seconds
- [ ] Total Blocking Time (TBT) < 300ms
- [ ] Cumulative Layout Shift (CLS) < 0.1

### Lighthouse Audit
- [ ] Performance score ≥ 90
- [ ] Accessibility score ≥ 90 (target: 96)
- [ ] Best Practices score ≥ 90 (target: 100)
- [ ] SEO score ≥ 80 (target: 100)

### Bundle Sizes
- [ ] Initial JS bundle < 150KB (gzipped)
- [ ] Main chunk < 80KB (gzipped)
- [ ] CSS bundle < 40KB (gzipped)
- [ ] Total page weight < 500KB (first load)

### Optimization Features
- [ ] Code splitting (pages load separately)
- [ ] Lazy loading (templates, heavy components)
- [ ] Image optimization (if images used)
- [ ] Font optimization (swap strategy)
- [ ] CSS purging (Tailwind unused styles removed)
- [ ] Minification (JS, CSS)
- [ ] Compression (gzip/brotli on Vercel)

### Caching
- [ ] Static assets cached (1 year)
- [ ] Templates API cached (1 hour)
- [ ] Templates cached in localStorage (24 hours)
- [ ] API responses cached in memory (when applicable)
- [ ] Cache-Control headers set correctly

### Loading States
- [ ] Spinners display during API calls
- [ ] Skeleton screens for template gallery
- [ ] Progress indicators for long operations
- [ ] No content jumps (layout shift)

---

## 10. Security

### Input Validation & Sanitization
- [ ] XSS prevention (HTML entities escaped)
- [ ] Script tags removed from user input
- [ ] Event handlers removed (onclick, onerror, etc.)
- [ ] Dangerous URLs blocked (javascript:, data:)
- [ ] SQL injection patterns detected
- [ ] NoSQL injection patterns detected
- [ ] Path traversal blocked (../)
- [ ] Prototype pollution prevented (__proto__)
- [ ] Null bytes removed
- [ ] Control characters removed

### Rate Limiting
- [ ] Enhance endpoint: 60 requests/minute enforced
- [ ] Analyze endpoint: 120 requests/minute enforced
- [ ] Export endpoint: 100 requests/minute enforced
- [ ] Rate limit headers returned:
  - [ ] `X-RateLimit-Limit`
  - [ ] `X-RateLimit-Remaining`
  - [ ] `X-RateLimit-Reset`
- [ ] 429 status returned when exceeded
- [ ] `Retry-After` header included
- [ ] Rate limits tracked per session ID
- [ ] Fallback to IP address if no session

### Security Headers (via Security Observatory / securityheaders.com)
- [ ] Content-Security-Policy (CSP) set
  - [ ] `default-src 'self'`
  - [ ] `script-src` allows Google Fonts
  - [ ] `style-src` allows Google Fonts
  - [ ] `font-src` allows gstatic
  - [ ] `connect-src` allows Gemini API
  - [ ] `frame-ancestors 'none'`
- [ ] X-Frame-Options: DENY
- [ ] X-Content-Type-Options: nosniff
- [ ] Referrer-Policy: strict-origin-when-cross-origin
- [ ] Permissions-Policy (disables camera, microphone, etc.)
- [ ] Strict-Transport-Security (HSTS) in production
- [ ] X-XSS-Protection: 1; mode=block

### Error Handling
- [ ] No stack traces exposed to client
- [ ] Generic error messages to users
- [ ] Detailed errors logged server-side (sanitized)
- [ ] No API keys in client-side code
- [ ] No sensitive data in error responses
- [ ] Request IDs for tracking (not sensitive data)

### Manual Security Testing
- [ ] Inject `<script>alert('XSS')</script>` into form fields
  - [ ] Script does not execute
  - [ ] Text is escaped and displayed as plain text
- [ ] Test SQL injection: `' OR '1'='1`
  - [ ] Input is sanitized or rejected
- [ ] Test NoSQL injection: `{"$ne": null}`
  - [ ] Input is sanitized or rejected
- [ ] Test path traversal: `../../etc/passwd`
  - [ ] Input is sanitized or rejected
- [ ] Exceed rate limit (send 61 requests in 1 minute)
  - [ ] 429 error returned
  - [ ] Rate limit headers included
- [ ] Check browser console for errors
  - [ ] No exposed API keys
  - [ ] No sensitive data logged

---

## 11. API Integration (Gemini AI)

### Environment Configuration
- [ ] `GEMINI_API_KEY` set in Vercel environment variables
- [ ] `NUXT_PUBLIC_GEMINI_MODEL` set to `gemini-pro`
- [ ] API key not exposed in client-side code
- [ ] API key not in Git repository

### Enhance Prompt Endpoint (`/api/enhance-prompt`)
- [ ] POST request succeeds with valid input
- [ ] Returns enhanced prompt text
- [ ] Returns quality score (0-100)
- [ ] Returns improvements array
- [ ] Returns suggestions array
- [ ] Returns alternative versions (concise, detailed, technical)
- [ ] Request completes within 5 seconds (most of the time)
- [ ] Timeout after 30 seconds (Vercel limit)
- [ ] Returns request ID for tracking
- [ ] Handles API errors gracefully

### API Error Handling
- [ ] Invalid API key returns 500 error
- [ ] Gemini quota exceeded returns 429 error
- [ ] Timeout returns 408 or 500 error
- [ ] Network error returns 500 error
- [ ] Validation error returns 400 error
- [ ] Error messages are user-friendly
- [ ] Toast notification displays on error

### Rate Limiting
- [ ] 60 requests per minute per session
- [ ] 61st request returns 429 status
- [ ] Rate limit headers returned
- [ ] Client-side respects rate limit
- [ ] Retry after time is communicated

### API Response Format
- [ ] Response is valid JSON
- [ ] All expected fields present:
  - [ ] `enhancedPrompt`
  - [ ] `qualityScore`
  - [ ] `improvements` (array)
  - [ ] `suggestions` (array)
  - [ ] `alternativeVersions` (object with 3 versions)
  - [ ] `metadata` (timestamps, requestId)
- [ ] Response matches TypeScript interface

---

## 12. Export Functionality

### Export Formats

#### TXT Export
- [ ] Download button shows "Download as TXT"
- [ ] Click downloads `.txt` file
- [ ] Filename: `enhanced-prompt-YYYY-MM-DD.txt`
- [ ] File contains enhanced prompt text
- [ ] File includes metadata header (title, date, quality score)
- [ ] File is plain text format (no formatting)
- [ ] File is readable in Notepad/TextEdit

#### Markdown (MD) Export
- [ ] Download button shows "Download as MD"
- [ ] Click downloads `.md` file
- [ ] Filename: `enhanced-prompt-YYYY-MM-DD.md`
- [ ] File contains Markdown-formatted prompt
- [ ] File includes frontmatter (metadata)
- [ ] File has proper headings (`# Title`)
- [ ] File has formatted lists (if applicable)
- [ ] File is readable in Markdown editors

#### JSON Export
- [ ] Download button shows "Download as JSON"
- [ ] Click downloads `.json` file
- [ ] Filename: `enhanced-prompt-YYYY-MM-DD.json`
- [ ] File contains valid JSON
- [ ] JSON includes all prompt data:
  - [ ] `originalPrompt`
  - [ ] `enhancedPrompt`
  - [ ] `qualityScore`
  - [ ] `improvements`
  - [ ] `metadata` (timestamp, version)
- [ ] JSON is pretty-printed (indented)
- [ ] JSON is valid (can be parsed)

### Export API Endpoint (`/api/export`)
- [ ] POST request with format and content succeeds
- [ ] Returns file with correct Content-Type header:
  - [ ] TXT: `text/plain`
  - [ ] MD: `text/markdown`
  - [ ] JSON: `application/json`
- [ ] Returns Content-Disposition header with filename
- [ ] File downloads automatically in browser
- [ ] Rate limiting enforced (100 req/min)

### Copy to Clipboard
- [ ] "Copy to Clipboard" button displays
- [ ] Click copies enhanced prompt text
- [ ] Success toast shows "Copied to clipboard!"
- [ ] Clipboard contains full prompt text
- [ ] Works on desktop (Chrome, Firefox, Safari, Edge)
- [ ] Works on mobile (iOS Safari, Chrome Mobile)
- [ ] Fallback for older browsers

---

## 13. Local Storage & Data Persistence

### Draft Auto-save
- [ ] Draft saves every 10 seconds automatically
- [ ] Draft saves on form field change (debounced)
- [ ] Draft includes all form fields:
  - [ ] Role, audience, task
  - [ ] Tone, output format, constraints
  - [ ] Examples, context
  - [ ] Enhancement level
- [ ] Draft persists on page reload
- [ ] Draft loads on page mount
- [ ] "Draft restored" message displays (toast or text)
- [ ] Draft can be manually cleared

### Prompt History
- [ ] Last 10 prompts saved to history
- [ ] History includes:
  - [ ] Original prompt
  - [ ] Enhanced prompt
  - [ ] Quality score
  - [ ] Timestamp
- [ ] Oldest prompts automatically removed (keep last 10)
- [ ] History accessible (if history page implemented)
- [ ] History persists across sessions

### User Preferences
- [ ] Language preference saved (en/ar)
- [ ] Theme preference saved (light/dark/auto)
- [ ] Preferences persist across sessions
- [ ] Preferences load on page mount
- [ ] Preferences apply automatically

### User Stats
- [ ] Total prompts enhanced count tracked
- [ ] Average quality score calculated
- [ ] Stats persist across sessions
- [ ] Stats displayed (if stats page implemented)

### Local Storage Limits
- [ ] No errors when localStorage is full
- [ ] Graceful degradation if localStorage unavailable
- [ ] SSR-safe (no errors during server-side rendering)

---

## 14. Responsive Design

### Mobile (375px - 767px)

#### General Layout
- [ ] All pages adapt to mobile viewport
- [ ] No horizontal scrolling
- [ ] Touch targets ≥ 44px (buttons, links)
- [ ] Text is readable (minimum 16px font size)
- [ ] Images/icons scale correctly
- [ ] Navigation is accessible

#### Header (Mobile)
- [ ] Header is responsive
- [ ] Logo displays (may be smaller)
- [ ] Hamburger menu icon displays
- [ ] Click hamburger opens mobile menu
- [ ] Mobile menu slides in from right (EN) or left (AR)
- [ ] Mobile menu includes all navigation links
- [ ] Language switcher in menu
- [ ] Theme toggle in menu
- [ ] Close button (X) closes menu
- [ ] ESC key closes menu

#### Landing Page (Mobile)
- [ ] Hero section stacks vertically
- [ ] Hero headline is readable
- [ ] CTA buttons stack vertically (full width)
- [ ] Value prop cards stack (1 column)
- [ ] How it works section stacks
- [ ] Template preview cards stack
- [ ] Final CTA section is readable

#### Builder Page (Mobile)
- [ ] Form and preview stack vertically (form first)
- [ ] Form sections are full width
- [ ] Role/audience dropdowns are touch-friendly
- [ ] Task textarea is large enough
- [ ] Tone selector cards stack (1-2 columns)
- [ ] Enhancement buttons stack vertically (full width)
- [ ] Preview panel is accessible below form
- [ ] Quality score is visible
- [ ] Progress bar is visible

#### Results Page (Mobile)
- [ ] Comparison stacks vertically (original, then enhanced)
- [ ] Action buttons stack or wrap
- [ ] Alternative version tabs work
- [ ] Improvements list is readable

#### Templates Page (Mobile)
- [ ] Template cards stack (1 column)
- [ ] Search bar is full width
- [ ] Filters stack or collapse
- [ ] Pagination is touch-friendly

#### Footer (Mobile)
- [ ] Footer links stack vertically or in 2 columns
- [ ] Footer is readable

### Tablet (768px - 1023px)

#### General Layout
- [ ] All pages adapt to tablet viewport
- [ ] Two-column layouts work
- [ ] Touch targets remain ≥ 44px

#### Builder Page (Tablet)
- [ ] Form and preview may be side-by-side (if space)
- [ ] Or stacked with larger widths

#### Templates Page (Tablet)
- [ ] Template cards in 2 columns
- [ ] Filters display in row

### Desktop (1024px+)

#### General Layout
- [ ] All pages use full width (max-width constraints)
- [ ] Multi-column layouts display correctly
- [ ] Hover effects work (on mouse-enabled devices)

#### Builder Page (Desktop)
- [ ] Two-column layout (form left, preview right 30%)
- [ ] Preview is sticky (stays visible on scroll)

#### Templates Page (Desktop)
- [ ] Template cards in 3 columns
- [ ] Filters in horizontal row

### Orientation (Landscape)
- [ ] Pages work in landscape orientation (mobile/tablet)
- [ ] No layout breaks

### Touch Interactions
- [ ] Tap works on all interactive elements
- [ ] No hover-only features (unless mouse-enabled device)
- [ ] Swipe interactions (if implemented)

---

## 15. Cross-Browser Testing

### Chrome (Latest)
- [ ] All pages load and function correctly
- [ ] Forms submit successfully
- [ ] Styles render correctly
- [ ] Animations work smoothly
- [ ] Developer console shows no errors

### Firefox (Latest)
- [ ] All pages load and function correctly
- [ ] Forms submit successfully
- [ ] Styles render correctly
- [ ] Animations work smoothly
- [ ] Browser console shows no errors

### Safari (Latest)
- [ ] All pages load and function correctly
- [ ] Forms submit successfully
- [ ] Styles render correctly
- [ ] Animations work smoothly (Safari sometimes has issues)
- [ ] Web Inspector shows no errors
- [ ] Clipboard API works (copy to clipboard)

### Edge (Latest)
- [ ] All pages load and function correctly
- [ ] Forms submit successfully
- [ ] Styles render correctly
- [ ] Animations work smoothly
- [ ] Developer console shows no errors

### Mobile Browsers

#### iOS Safari (iPhone)
- [ ] All pages load and function correctly
- [ ] Touch interactions work
- [ ] Forms are usable (no zoom on focus)
- [ ] Clipboard works
- [ ] Download works or prompts correctly

#### Chrome Mobile (Android)
- [ ] All pages load and function correctly
- [ ] Touch interactions work
- [ ] Forms are usable
- [ ] Clipboard works
- [ ] Download works

---

## 16. SEO & Meta Tags

### Homepage (`/`)
- [ ] `<title>` tag present and descriptive
- [ ] Meta description present (150-160 characters)
- [ ] Meta keywords present (optional but nice)
- [ ] Open Graph tags:
  - [ ] `og:title`
  - [ ] `og:description`
  - [ ] `og:image`
  - [ ] `og:url`
  - [ ] `og:type`
- [ ] Twitter Card tags:
  - [ ] `twitter:card`
  - [ ] `twitter:title`
  - [ ] `twitter:description`
  - [ ] `twitter:image`
- [ ] Canonical URL set
- [ ] Language alternates (en, ar)

### Builder, Results, Templates Pages
- [ ] Each page has unique `<title>`
- [ ] Each page has unique meta description
- [ ] Results page has `noindex, nofollow` (user-specific)
- [ ] Builder page has descriptive meta
- [ ] Templates page has descriptive meta

### Structured Data (Optional)
- [ ] JSON-LD schema (if implemented)
- [ ] BreadcrumbList schema (templates)

### Sitemap & Robots.txt
- [ ] `robots.txt` exists in `/public/`
- [ ] `sitemap.xml` generated (if applicable)
- [ ] Sitemap submitted to Google Search Console (optional)

---

## 17. Edge Cases & Error Scenarios

### Network Errors
- [ ] No internet connection shows error message
- [ ] Slow connection shows loading state (doesn't timeout early)
- [ ] Timeout (30s) shows error message
- [ ] Retry button works after failure

### Form Edge Cases
- [ ] Empty form submission blocked (validation)
- [ ] Extremely long input (>1000 chars) blocked
- [ ] Special characters in input don't break form
- [ ] Unicode characters (emojis, Arabic) handled correctly
- [ ] Copy-pasting large text works
- [ ] Rapid typing doesn't cause issues

### Browser Edge Cases
- [ ] LocalStorage disabled (private browsing) doesn't crash app
- [ ] Cookies disabled doesn't crash app
- [ ] JavaScript disabled shows fallback (or fails gracefully)
- [ ] Ad blockers don't break functionality
- [ ] Browser extensions don't conflict

### API Edge Cases
- [ ] Invalid API key returns error (not crash)
- [ ] Quota exceeded shows friendly message
- [ ] Malformed API response doesn't crash app
- [ ] Empty API response handled

### Session Edge Cases
- [ ] Session expired (if applicable) prompts re-login
- [ ] Multiple tabs open don't conflict
- [ ] Preferences sync across tabs (or don't conflict)

---

## 18. Post-Deployment Verification

### Production URL Access
- [ ] URL loads without errors
- [ ] SSL certificate is valid (HTTPS)
- [ ] No mixed content warnings
- [ ] Deployment protection disabled (public access)

### Environment Variables
- [ ] `GEMINI_API_KEY` set in Vercel dashboard
- [ ] `NUXT_PUBLIC_APP_URL` set correctly
- [ ] `RATE_LIMIT_WINDOW` and `RATE_LIMIT_MAX_REQUESTS` set
- [ ] All required env vars present in Production environment

### API Connectivity
- [ ] Gemini API key is valid (test enhance endpoint)
- [ ] API requests succeed (not 401/403)
- [ ] Rate limiting works in production

### Vercel Dashboard
- [ ] Deployment status: Ready
- [ ] Build logs show no errors
- [ ] Function logs show no errors (check after testing)
- [ ] Analytics enabled (if using Vercel Analytics)

### Monitoring (First 48 Hours)
- [ ] Check error logs daily
- [ ] Monitor Gemini API usage (ensure within quota)
- [ ] Check rate limiting effectiveness (any 429 errors?)
- [ ] Monitor performance (Vercel Analytics or Lighthouse)
- [ ] Collect user feedback

---

## 19. User Acceptance Testing (UAT)

### User Flow 1: Quick Enhancement
1. [ ] Land on homepage
2. [ ] Click "Get Started"
3. [ ] Fill out basic info (role, audience, task)
4. [ ] Select tone (e.g., Professional)
5. [ ] Click "Quick Polish"
6. [ ] See results page with enhanced prompt
7. [ ] Copy to clipboard
8. [ ] Verify clipboard contains text
9. [ ] Success!

### User Flow 2: Deep Enhancement with Template
1. [ ] Land on homepage
2. [ ] Click "Browse Templates"
3. [ ] Select a template (e.g., "Email Reply")
4. [ ] Fill out template variables
5. [ ] Click "Apply Template"
6. [ ] Redirected to builder with pre-filled form
7. [ ] Click "Deep Enhancement"
8. [ ] See results page
9. [ ] Download as Markdown
10. [ ] Success!

### User Flow 3: Language Switching
1. [ ] Load homepage in English
2. [ ] Click language switcher (EN → AR)
3. [ ] Page reloads in Arabic
4. [ ] URL shows `/ar` prefix
5. [ ] Layout is RTL (right-to-left)
6. [ ] Navigate to Builder (`/ar/builder`)
7. [ ] Form labels are in Arabic
8. [ ] Switch back to English
9. [ ] URL returns to `/builder` (no `/ar`)
10. [ ] Success!

### User Flow 4: Mobile Experience
1. [ ] Open site on mobile (375px width)
2. [ ] Navigate to Builder
3. [ ] Fill out form (should be usable)
4. [ ] Enhance prompt
5. [ ] View results (readable on mobile)
6. [ ] Copy to clipboard on mobile
7. [ ] Success!

---

## 20. Known Issues & Limitations (MVP)

Document any known issues or limitations found during testing:

### TypeScript Warnings (Non-Critical)
- [ ] 10 TypeScript errors from Nuxt UI slot typing (framework-specific, no runtime impact)
- [ ] These are expected and do not affect functionality

### Feature Limitations (By Design)
- [ ] No user authentication (public access)
- [ ] No prompt history page (stored locally only)
- [ ] No analytics dashboard (future)
- [ ] Rate limiting per session (not per user)
- [ ] Gemini API free tier (60 req/min limit)

### Browser-Specific Issues (If Any)
- [ ] (Document any browser-specific issues found)

### Mobile Issues (If Any)
- [ ] (Document any mobile-specific issues found)

---

## Testing Sign-Off

Once all critical items are checked and verified:

- [ ] **All critical features working**: ✅
- [ ] **No critical bugs**: ✅
- [ ] **Performance targets met**: Lighthouse ≥ 90 (all metrics)
- [ ] **Accessibility verified**: WCAG 2.1 AA (score 96)
- [ ] **Security verified**: Headers and input validation working
- [ ] **Cross-browser tested**: Chrome, Firefox, Safari, Edge
- [ ] **Mobile tested**: iOS and Android
- [ ] **API integration working**: Gemini API connected
- [ ] **Ready for launch**: ✅

**Tested By**: ___________________________
**Date**: ___________________________
**Sign-off**: ___________________________

---

## Appendix: Testing Tools & Resources

### Browser DevTools
- Chrome DevTools: F12 or Cmd+Option+I
- Firefox Developer Tools: F12
- Safari Web Inspector: Cmd+Option+I
- Edge DevTools: F12

### Lighthouse
- Run in Chrome DevTools > Lighthouse tab
- Or use CLI: `npx lighthouse https://your-url.vercel.app --view`

### Accessibility Testing
- axe DevTools: https://www.deque.com/axe/devtools/
- WAVE: https://wave.webaim.org/
- Screen readers: NVDA (Windows), JAWS (Windows), VoiceOver (Mac/iOS)

### Security Testing
- Mozilla Observatory: https://observatory.mozilla.org/
- SecurityHeaders.com: https://securityheaders.com/
- OWASP ZAP: https://www.zaproxy.org/

### Performance Testing
- WebPageTest: https://www.webpagetest.org/
- GTmetrix: https://gtmetrix.com/

### Mobile Testing
- Chrome DevTools Device Emulation
- BrowserStack: https://www.browserstack.com/
- Real devices (best option)

### API Testing
- Postman: https://www.postman.com/
- curl commands
- Vercel Function Logs

---

**End of Checklist**
