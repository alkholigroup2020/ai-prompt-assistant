# Theme System Guide

This guide explains how the theme system works in the AI Prompt Assistant and how to re-enable light mode if needed.

## Current State: Dark Mode Only

The application is currently configured to run in **dark mode only**. The theme toggle button is hidden, and the app always applies the dark theme regardless of user preferences.

---

## How to Re-enable Theme Switching

To restore the ability for users to switch between light and dark modes, make these two changes:

### Step 1: Enable Theme Logic

**File:** `app/stores/preferences.ts` (line 15)

```typescript
// Change this:
const FORCE_DARK_MODE = true;

// To this:
const FORCE_DARK_MODE = false;
```

### Step 2: Show Theme Toggle Button

**File:** `app/components/layout/Header.vue` (line 56)

```vue
<!-- Change this: -->
<UButton
  v-if="false"
  ...

<!-- To this: -->
<UButton
  v-if="true"
  ...
```

### Optional: Change Default Theme

**File:** `app/types/storage.ts` (line 101)

```typescript
// Current default (dark):
theme: 'dark',

// Change to light if preferred:
theme: 'light',
```

---

## How the Theme System Works

### Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                      Theme Flow                              │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  User clicks toggle    →   preferences store   →   HTML     │
│  (Header.vue)              (toggleTheme)           <html>   │
│                                ↓                   class    │
│                           applyTheme()                      │
│                                ↓                            │
│                    document.documentElement                 │
│                    .classList.add/remove('dark')            │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Key Files

| File | Purpose |
|------|---------|
| `app/stores/preferences.ts` | Theme state management, persistence, and application |
| `app/components/layout/Header.vue` | Theme toggle button UI |
| `app/types/storage.ts` | Default preferences and type definitions |
| `app/plugins/preferences.client.ts` | Initializes theme on app load |
| `tailwind.config.js` | Dark mode strategy configuration |
| `app/assets/css/main.css` | CSS variables for light/dark themes |

### Theme Types

The system supports three theme options (defined in `app/types/storage.ts`):

```typescript
type Theme = 'light' | 'dark' | 'auto';
```

- **`light`**: Always use light theme
- **`dark`**: Always use dark theme
- **`auto`**: Follow system preference (`prefers-color-scheme`)

### Preferences Store (`app/stores/preferences.ts`)

The Pinia store manages theme state with these key methods:

```typescript
// Getters
isDarkMode      // Returns true if dark mode is active
currentTheme    // Returns current theme setting ('light' | 'dark' | 'auto')

// Actions
setTheme(theme)   // Set specific theme
toggleTheme()     // Toggle between light and dark
applyTheme()      // Apply theme to DOM (adds/removes 'dark' class)
initialize()      // Load preferences and apply theme on startup
```

### How Dark Mode is Applied

1. **Tailwind CSS Strategy**: Uses class-based dark mode (`darkMode: 'class'` in `tailwind.config.js`)

2. **DOM Manipulation**: The `applyTheme()` method adds or removes the `dark` class on `<html>`:
   ```typescript
   document.documentElement.classList.add('dark');    // Enable dark
   document.documentElement.classList.remove('dark'); // Enable light
   ```

3. **CSS Styling**: Components use Tailwind's `dark:` prefix:
   ```vue
   <div class="bg-white dark:bg-gray-900">
   <span class="text-gray-700 dark:text-gray-300">
   ```

### CSS Variables

Custom CSS variables adjust based on theme (`app/assets/css/main.css`):

```css
/* Light mode */
:root {
  --primary-emerald: #45cf7b;
  --primary-navy: #000046;
}

/* Dark mode */
.dark {
  --primary-emerald: #4ade80;
  --primary-navy: #1e3a8a;
}
```

### Persistence

Theme preference is stored in localStorage under the key `aipa_preferences`:

```json
{
  "theme": "dark",
  "language": "en",
  ...
}
```

### Auto Theme (System Preference)

When theme is set to `'auto'`, the system listens for OS theme changes:

```typescript
// In initialize()
if (this.preferences.theme === 'auto') {
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  mediaQuery.addEventListener('change', () => {
    this.applyTheme();
  });
}
```

---

## Component Dark Mode Patterns

When styling components, follow these patterns:

### Background Colors
```vue
<div class="bg-white dark:bg-gray-800">
<div class="bg-gray-50 dark:bg-gray-900">
<div class="bg-gray-100 dark:bg-gray-950">
```

### Text Colors
```vue
<span class="text-gray-900 dark:text-white">        <!-- Primary text -->
<span class="text-gray-700 dark:text-gray-300">    <!-- Secondary text -->
<span class="text-gray-500 dark:text-gray-400">    <!-- Muted text -->
```

### Borders
```vue
<div class="border-gray-200 dark:border-gray-700">
<div class="border-gray-300 dark:border-gray-600">
```

### Interactive States
```vue
<button class="hover:bg-gray-100 dark:hover:bg-gray-800">
<a class="hover:text-emerald-600 dark:hover:text-emerald-400">
```

### Focus States
```vue
<input class="focus:ring-emerald-500 dark:focus:ring-emerald-400">
```

---

## WCAG Accessibility

The theme system is designed for WCAG 2.1 AA compliance:

- **Light mode**: Emerald-700 (#15803d) on white = 5.1:1 contrast ratio
- **Dark mode**: Emerald-300 (#86efac) on gray-900 = 7.8:1 contrast ratio
- **Navy**: Navy-500 (#000046) on white = 15.2:1 contrast ratio (AAA)

---

## Troubleshooting

### Theme not applying on page load
- Ensure `preferences.client.ts` plugin is loading
- Check browser console for errors
- Verify localStorage is accessible

### Flash of wrong theme (FOUC)
- The theme is applied client-side after hydration
- Consider adding a script in `app.vue` head to apply theme earlier

### Theme toggle not working
- Check if `FORCE_DARK_MODE` is set to `true`
- Verify the toggle button's `v-if` condition
- Check browser console for JavaScript errors

---

## Quick Reference

| Task | File | Line | Change |
|------|------|------|--------|
| Force dark mode | `preferences.ts` | 15 | `FORCE_DARK_MODE = true` |
| Allow switching | `preferences.ts` | 15 | `FORCE_DARK_MODE = false` |
| Show toggle | `Header.vue` | 56 | `v-if="true"` |
| Hide toggle | `Header.vue` | 56 | `v-if="false"` |
| Default to dark | `storage.ts` | 101 | `theme: 'dark'` |
| Default to light | `storage.ts` | 101 | `theme: 'light'` |
