# Dynamic Example Prompts System Guide

This guide explains how the dynamic example prompts system works on the Builder page and provides step-by-step instructions for adding, editing, or removing roles and audiences.

---

## Table of Contents

1. [System Overview](#system-overview)
2. [Architecture & File Structure](#architecture--file-structure)
3. [How It Works](#how-it-works)
4. [Adding a New Role](#adding-a-new-role)
5. [Adding a New Audience](#adding-a-new-audience)
6. [Editing Examples](#editing-examples)
7. [Deleting a Role](#deleting-a-role)
8. [Deleting an Audience](#deleting-an-audience)
9. [Translation Guidelines](#translation-guidelines)
10. [Troubleshooting](#troubleshooting)

---

## System Overview

The Dynamic Example Prompts system provides context-aware example prompts based on the user's selected **Role** and **Target Audience**.

### Key Features

- **500 unique examples**: 9 roles × 9 audiences × 5 examples per combination + additional combinations
- **Progressive filtering**: Examples update when EITHER role OR audience changes
- **Bilingual support**: Full English and Arabic translations
- **Smart visibility**: Examples hide when "Other" is selected for either field
- **Scalable design**: Easy to add new roles or audiences

### Current Statistics

| Metric | Count |
|--------|-------|
| Roles | 9 |
| Audiences | 9 |
| Examples per combination | 5 |
| Total examples | 405 (9 × 9 × 5) |

---

## Architecture & File Structure

```
app/
├── types/
│   └── examples.ts              # TypeScript type definitions
├── data/
│   └── examples-matrix.ts       # Examples metadata (IDs, icons, translation keys)
├── composables/
│   └── useExamplePrompts.ts     # Selection logic & filtering
└── components/
    └── builder/
        └── ExamplePromptsSelector.vue  # UI component

i18n/
└── locales/
    └── examples/
        ├── en.json              # English translations (405 examples)
        └── ar.json              # Arabic translations (405 examples)
```

### File Responsibilities

| File | Purpose |
|------|---------|
| `types/examples.ts` | Defines `RoleId`, `AudienceId`, and interface types |
| `data/examples-matrix.ts` | Contains `VALID_ROLES`, `VALID_AUDIENCES`, and `examplesMatrix` |
| `composables/useExamplePrompts.ts` | Handles filtering logic based on form selections |
| `ExamplePromptsSelector.vue` | Renders the dropdown UI component |
| `i18n/locales/examples/*.json` | Contains actual example text translations |

---

## How It Works

### Selection Logic

The system has 4 states based on user selections:

| Role | Audience | Behavior |
|------|----------|----------|
| Selected | Selected | Show 5 specific examples for that exact combination |
| Selected | Empty | Show 5 sampled examples (1 from each audience for that role) |
| Empty | Selected | Show 5 sampled examples (1 from each role for that audience) |
| Empty | Empty | Hide examples section |
| "Other" | Any | Hide examples section |
| Any | "Other" | Hide examples section |

### Data Flow

```
User selects Role/Audience
        ↓
useFormStore (Pinia) updates formData
        ↓
useExamplePrompts composable reacts
        ↓
Filters examplesMatrix based on selection
        ↓
Translates using t(translationKey)
        ↓
ExamplePromptsSelector renders dropdown
```

---

## Adding a New Role

Adding a new role requires changes to **5 files**. Follow these steps exactly:

### Step 1: Update Type Definitions

**File:** `app/types/examples.ts`

Add the new role ID to the `RoleId` type:

```typescript
export type RoleId =
  | 'software-engineer'
  | 'product-manager'
  | 'data-analyst'
  | 'marketing-specialist'
  | 'designer'
  | 'business-analyst'
  | 'content-writer'
  | 'project-manager'
  | 'researcher'
  | 'new-role-id'        // ← Add your new role here (kebab-case)
```

### Step 2: Update Valid Roles Array

**File:** `app/data/examples-matrix.ts`

Add the new role to the `VALID_ROLES` array:

```typescript
export const VALID_ROLES: RoleId[] = [
  'software-engineer',
  'product-manager',
  'data-analyst',
  'marketing-specialist',
  'designer',
  'business-analyst',
  'content-writer',
  'project-manager',
  'researcher',
  'new-role-id',        // ← Add here
]
```

### Step 3: Add Examples Matrix Entry

**File:** `app/data/examples-matrix.ts`

Add a complete entry for the new role with examples for ALL 9 audiences:

```typescript
export const examplesMatrix: ExamplesMatrix = {
  // ... existing roles ...

  // ═══════════════════════════════════════════════════════════════════════════
  // NEW ROLE NAME (IN CAPS)
  // ═══════════════════════════════════════════════════════════════════════════
  'new-role-id': {
    'technical-team': [
      ex('new-role-id', 'technical-team', 0, 'i-heroicons-icon-name'),
      ex('new-role-id', 'technical-team', 1, 'i-heroicons-icon-name'),
      ex('new-role-id', 'technical-team', 2, 'i-heroicons-icon-name'),
      ex('new-role-id', 'technical-team', 3, 'i-heroicons-icon-name'),
      ex('new-role-id', 'technical-team', 4, 'i-heroicons-icon-name'),
    ],
    'executives': [
      ex('new-role-id', 'executives', 0, 'i-heroicons-icon-name'),
      ex('new-role-id', 'executives', 1, 'i-heroicons-icon-name'),
      ex('new-role-id', 'executives', 2, 'i-heroicons-icon-name'),
      ex('new-role-id', 'executives', 3, 'i-heroicons-icon-name'),
      ex('new-role-id', 'executives', 4, 'i-heroicons-icon-name'),
    ],
    'clients': [
      // ... 5 examples
    ],
    'general-public': [
      // ... 5 examples
    ],
    'students': [
      // ... 5 examples
    ],
    'experts': [
      // ... 5 examples
    ],
    'beginners': [
      // ... 5 examples
    ],
    'stakeholders': [
      // ... 5 examples
    ],
    'team-members': [
      // ... 5 examples
    ],
  },
}
```

**Icon Reference:** Use Heroicons from https://heroicons.com/ with prefix `i-heroicons-`

### Step 4: Add English Translations

**File:** `i18n/locales/examples/en.json`

Add translations for all 45 new examples (9 audiences × 5 examples):

```json
{
  "examples": {
    "new-role-id": {
      "technical-team": {
        "0": "First example text for technical team...",
        "1": "Second example text for technical team...",
        "2": "Third example text for technical team...",
        "3": "Fourth example text for technical team...",
        "4": "Fifth example text for technical team..."
      },
      "executives": {
        "0": "First example text for executives...",
        "1": "Second example text for executives...",
        "2": "Third example text for executives...",
        "3": "Fourth example text for executives...",
        "4": "Fifth example text for executives..."
      },
      "clients": { /* ... */ },
      "general-public": { /* ... */ },
      "students": { /* ... */ },
      "experts": { /* ... */ },
      "beginners": { /* ... */ },
      "stakeholders": { /* ... */ },
      "team-members": { /* ... */ }
    }
  }
}
```

### Step 5: Add Arabic Translations

**File:** `i18n/locales/examples/ar.json`

Add the same structure with Arabic translations:

```json
{
  "examples": {
    "new-role-id": {
      "technical-team": {
        "0": "النص العربي للمثال الأول...",
        "1": "النص العربي للمثال الثاني...",
        "2": "النص العربي للمثال الثالث...",
        "3": "النص العربي للمثال الرابع...",
        "4": "النص العربي للمثال الخامس..."
      }
      // ... repeat for all audiences
    }
  }
}
```

### Step 6: Update RoleSelector Component

**File:** `app/components/builder/RoleSelector.vue`

Add the new role to the roles array with its label translation key.

---

## Adding a New Audience

Adding a new audience requires changes to **5 files** plus updating ALL existing role entries.

### Step 1: Update Type Definitions

**File:** `app/types/examples.ts`

```typescript
export type AudienceId =
  | 'technical-team'
  | 'executives'
  | 'clients'
  | 'general-public'
  | 'students'
  | 'experts'
  | 'beginners'
  | 'stakeholders'
  | 'team-members'
  | 'new-audience-id'    // ← Add your new audience (kebab-case)
```

### Step 2: Update Valid Audiences Array

**File:** `app/data/examples-matrix.ts`

```typescript
export const VALID_AUDIENCES: AudienceId[] = [
  'technical-team',
  'executives',
  'clients',
  'general-public',
  'students',
  'experts',
  'beginners',
  'stakeholders',
  'team-members',
  'new-audience-id',    // ← Add here
]
```

### Step 3: Add Examples for ALL Roles

**File:** `app/data/examples-matrix.ts`

You must add 5 examples for the new audience in EVERY existing role:

```typescript
'software-engineer': {
  // ... existing audiences ...
  'new-audience-id': [
    ex('software-engineer', 'new-audience-id', 0, 'i-heroicons-icon'),
    ex('software-engineer', 'new-audience-id', 1, 'i-heroicons-icon'),
    ex('software-engineer', 'new-audience-id', 2, 'i-heroicons-icon'),
    ex('software-engineer', 'new-audience-id', 3, 'i-heroicons-icon'),
    ex('software-engineer', 'new-audience-id', 4, 'i-heroicons-icon'),
  ],
},
'product-manager': {
  // ... existing audiences ...
  'new-audience-id': [
    // ... 5 examples
  ],
},
// ... repeat for ALL 9 roles
```

### Step 4: Add English Translations

**File:** `i18n/locales/examples/en.json`

Add translations for the new audience under EVERY role:

```json
{
  "examples": {
    "software-engineer": {
      "new-audience-id": {
        "0": "Example 1...",
        "1": "Example 2...",
        "2": "Example 3...",
        "3": "Example 4...",
        "4": "Example 5..."
      }
    },
    "product-manager": {
      "new-audience-id": { /* ... */ }
    }
    // ... repeat for all roles
  }
}
```

### Step 5: Add Arabic Translations

**File:** `i18n/locales/examples/ar.json`

Same structure with Arabic text.

### Step 6: Update AudienceSelector Component

**File:** `app/components/builder/AudienceSelector.vue`

Add the new audience to the audiences array.

---

## Editing Examples

### Editing Example Text

To change the text of an existing example:

1. **English:** Edit `i18n/locales/examples/en.json`
2. **Arabic:** Edit `i18n/locales/examples/ar.json`

Find the example by its path: `examples.{role-id}.{audience-id}.{index}`

```json
{
  "examples": {
    "software-engineer": {
      "technical-team": {
        "0": "Edit this text to change the first example"
      }
    }
  }
}
```

### Changing an Example's Icon

Edit `app/data/examples-matrix.ts` and find the specific example:

```typescript
'software-engineer': {
  'technical-team': [
    ex('software-engineer', 'technical-team', 0, 'i-heroicons-new-icon'), // ← Change icon here
    // ...
  ],
},
```

Browse icons at: https://heroicons.com/

---

## Deleting a Role

To remove a role completely:

### Step 1: Remove from Type Definition

**File:** `app/types/examples.ts`

Remove the role from `RoleId` type.

### Step 2: Remove from Valid Roles

**File:** `app/data/examples-matrix.ts`

Remove from `VALID_ROLES` array.

### Step 3: Remove Matrix Entry

**File:** `app/data/examples-matrix.ts`

Delete the entire role block from `examplesMatrix`.

### Step 4: Remove Translations

**Files:** `i18n/locales/examples/en.json` and `ar.json`

Remove the role's translation block from both files.

### Step 5: Update RoleSelector

Remove the role from the RoleSelector component.

---

## Deleting an Audience

To remove an audience completely:

### Step 1: Remove from Type Definition

**File:** `app/types/examples.ts`

Remove the audience from `AudienceId` type.

### Step 2: Remove from Valid Audiences

**File:** `app/data/examples-matrix.ts`

Remove from `VALID_AUDIENCES` array.

### Step 3: Remove from ALL Roles

**File:** `app/data/examples-matrix.ts`

Remove the audience entry from EVERY role in `examplesMatrix`.

### Step 4: Remove Translations

**Files:** `i18n/locales/examples/en.json` and `ar.json`

Remove the audience's translations from every role in both files.

### Step 5: Update AudienceSelector

Remove the audience from the AudienceSelector component.

---

## Translation Guidelines

### Key Format

Translation keys follow this pattern:
```
examples.{role-id}.{audience-id}.{index}
```

Example: `examples.software-engineer.executives.2`

### Writing Good Examples

1. **Be specific**: Examples should be actionable task descriptions
2. **Match the context**: Consider both role AND audience when writing
3. **Keep it concise**: Aim for 10-20 words per example
4. **Use action verbs**: Start with verbs like "Write", "Create", "Analyze", "Review"
5. **Be bilingual-aware**: Ensure Arabic translations convey the same meaning

### Example Quality Checklist

- [ ] Does this example make sense for this role?
- [ ] Is it appropriate for this audience's expertise level?
- [ ] Is it actionable (can be directly used as a prompt)?
- [ ] Is it specific enough to be useful?
- [ ] Is the Arabic translation accurate and natural?

---

## Troubleshooting

### Examples not showing

1. Check if role/audience is set to "Other" (examples hide when "Other" is selected)
2. Verify the role/audience ID matches exactly in all files
3. Check browser console for translation key errors

### Translation key not found

Error: `examples.new-role.audience.0` not found

**Solution:** Ensure the translation exists in BOTH `en.json` and `ar.json`

### TypeScript errors after adding role/audience

Error: `Type '"new-role"' is not assignable to type 'RoleId'`

**Solution:** Add the new ID to the type definition in `types/examples.ts`

### Examples not updating when selection changes

1. Clear browser cache and reload
2. Restart the development server
3. Check that `VALID_ROLES` and `VALID_AUDIENCES` arrays include the new IDs

### Icon not displaying

1. Verify the icon name uses the `i-heroicons-` prefix
2. Check that the icon exists at https://heroicons.com/
3. Use kebab-case for icon names (e.g., `i-heroicons-academic-cap`)

---

## Quick Reference: Files to Edit

### Adding a Role (5 files + 45 new examples)

| File | Action |
|------|--------|
| `app/types/examples.ts` | Add to `RoleId` type |
| `app/data/examples-matrix.ts` | Add to `VALID_ROLES` + full matrix entry |
| `i18n/locales/examples/en.json` | Add 45 English translations |
| `i18n/locales/examples/ar.json` | Add 45 Arabic translations |
| `app/components/builder/RoleSelector.vue` | Add role option |

### Adding an Audience (5 files + 45 new examples)

| File | Action |
|------|--------|
| `app/types/examples.ts` | Add to `AudienceId` type |
| `app/data/examples-matrix.ts` | Add to `VALID_AUDIENCES` + entry in ALL roles |
| `i18n/locales/examples/en.json` | Add translations under ALL roles |
| `i18n/locales/examples/ar.json` | Add translations under ALL roles |
| `app/components/builder/AudienceSelector.vue` | Add audience option |

---

## Summary

The Dynamic Example Prompts system is designed to be:

- **Type-safe**: TypeScript ensures all IDs are valid
- **Scalable**: Adding roles/audiences follows a predictable pattern
- **Bilingual**: Full English and Arabic support
- **Maintainable**: Clear separation between data, logic, and UI

When making changes, always update ALL related files to keep the system in sync.
