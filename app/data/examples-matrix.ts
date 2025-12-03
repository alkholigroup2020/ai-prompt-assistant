/**
 * Examples Matrix - 500 role-audience specific example prompts
 * 10 roles × 10 audiences × 5 examples = 500 total
 */

import type { ExamplesMatrix, RoleId, AudienceId, ExamplePrompt } from '~/types/examples'

/**
 * List of all valid role IDs (excludes 'other')
 */
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
]

/**
 * List of all valid audience IDs (excludes 'other')
 */
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
]

/**
 * Helper to create an example prompt entry
 */
function ex(
  role: RoleId,
  audience: AudienceId,
  index: number,
  icon: string
): ExamplePrompt {
  return {
    id: `${role}.${audience}.${index}`,
    translationKey: `examples.${role}.${audience}.${index}`,
    icon,
  }
}

/**
 * Full examples matrix: 10 roles × 10 audiences × 5 examples = 500 examples
 */
export const examplesMatrix: ExamplesMatrix = {
  // ═══════════════════════════════════════════════════════════════════════════
  // SOFTWARE ENGINEER
  // ═══════════════════════════════════════════════════════════════════════════
  'software-engineer': {
    'technical-team': [
      ex('software-engineer', 'technical-team', 0, 'i-heroicons-code-bracket'),
      ex('software-engineer', 'technical-team', 1, 'i-heroicons-bug-ant'),
      ex('software-engineer', 'technical-team', 2, 'i-heroicons-document-text'),
      ex('software-engineer', 'technical-team', 3, 'i-heroicons-arrow-path'),
      ex('software-engineer', 'technical-team', 4, 'i-heroicons-shield-check'),
    ],
    'executives': [
      ex('software-engineer', 'executives', 0, 'i-heroicons-presentation-chart-line'),
      ex('software-engineer', 'executives', 1, 'i-heroicons-clock'),
      ex('software-engineer', 'executives', 2, 'i-heroicons-shield-exclamation'),
      ex('software-engineer', 'executives', 3, 'i-heroicons-currency-dollar'),
      ex('software-engineer', 'executives', 4, 'i-heroicons-arrow-trending-up'),
    ],
    'clients': [
      ex('software-engineer', 'clients', 0, 'i-heroicons-document-check'),
      ex('software-engineer', 'clients', 1, 'i-heroicons-clock'),
      ex('software-engineer', 'clients', 2, 'i-heroicons-light-bulb'),
      ex('software-engineer', 'clients', 3, 'i-heroicons-question-mark-circle'),
      ex('software-engineer', 'clients', 4, 'i-heroicons-check-badge'),
    ],
    'general-public': [
      ex('software-engineer', 'general-public', 0, 'i-heroicons-light-bulb'),
      ex('software-engineer', 'general-public', 1, 'i-heroicons-device-phone-mobile'),
      ex('software-engineer', 'general-public', 2, 'i-heroicons-shield-check'),
      ex('software-engineer', 'general-public', 3, 'i-heroicons-question-mark-circle'),
      ex('software-engineer', 'general-public', 4, 'i-heroicons-sparkles'),
    ],
    'students': [
      ex('software-engineer', 'students', 0, 'i-heroicons-academic-cap'),
      ex('software-engineer', 'students', 1, 'i-heroicons-book-open'),
      ex('software-engineer', 'students', 2, 'i-heroicons-puzzle-piece'),
      ex('software-engineer', 'students', 3, 'i-heroicons-arrow-path'),
      ex('software-engineer', 'students', 4, 'i-heroicons-light-bulb'),
    ],
    'experts': [
      ex('software-engineer', 'experts', 0, 'i-heroicons-cpu-chip'),
      ex('software-engineer', 'experts', 1, 'i-heroicons-server-stack'),
      ex('software-engineer', 'experts', 2, 'i-heroicons-chart-bar'),
      ex('software-engineer', 'experts', 3, 'i-heroicons-shield-exclamation'),
      ex('software-engineer', 'experts', 4, 'i-heroicons-code-bracket-square'),
    ],
    'beginners': [
      ex('software-engineer', 'beginners', 0, 'i-heroicons-light-bulb'),
      ex('software-engineer', 'beginners', 1, 'i-heroicons-puzzle-piece'),
      ex('software-engineer', 'beginners', 2, 'i-heroicons-book-open'),
      ex('software-engineer', 'beginners', 3, 'i-heroicons-check-circle'),
      ex('software-engineer', 'beginners', 4, 'i-heroicons-arrow-right'),
    ],
    'stakeholders': [
      ex('software-engineer', 'stakeholders', 0, 'i-heroicons-chart-bar'),
      ex('software-engineer', 'stakeholders', 1, 'i-heroicons-calendar'),
      ex('software-engineer', 'stakeholders', 2, 'i-heroicons-exclamation-triangle'),
      ex('software-engineer', 'stakeholders', 3, 'i-heroicons-check-badge'),
      ex('software-engineer', 'stakeholders', 4, 'i-heroicons-arrow-trending-up'),
    ],
    'team-members': [
      ex('software-engineer', 'team-members', 0, 'i-heroicons-user-group'),
      ex('software-engineer', 'team-members', 1, 'i-heroicons-chat-bubble-left-right'),
      ex('software-engineer', 'team-members', 2, 'i-heroicons-clipboard-document-list'),
      ex('software-engineer', 'team-members', 3, 'i-heroicons-light-bulb'),
      ex('software-engineer', 'team-members', 4, 'i-heroicons-hand-raised'),
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // PRODUCT MANAGER
  // ═══════════════════════════════════════════════════════════════════════════
  'product-manager': {
    'technical-team': [
      ex('product-manager', 'technical-team', 0, 'i-heroicons-clipboard-document-list'),
      ex('product-manager', 'technical-team', 1, 'i-heroicons-chat-bubble-left-right'),
      ex('product-manager', 'technical-team', 2, 'i-heroicons-scale'),
      ex('product-manager', 'technical-team', 3, 'i-heroicons-calendar'),
      ex('product-manager', 'technical-team', 4, 'i-heroicons-flag'),
    ],
    'executives': [
      ex('product-manager', 'executives', 0, 'i-heroicons-presentation-chart-line'),
      ex('product-manager', 'executives', 1, 'i-heroicons-chart-bar'),
      ex('product-manager', 'executives', 2, 'i-heroicons-map'),
      ex('product-manager', 'executives', 3, 'i-heroicons-currency-dollar'),
      ex('product-manager', 'executives', 4, 'i-heroicons-trophy'),
    ],
    'clients': [
      ex('product-manager', 'clients', 0, 'i-heroicons-sparkles'),
      ex('product-manager', 'clients', 1, 'i-heroicons-calendar'),
      ex('product-manager', 'clients', 2, 'i-heroicons-chat-bubble-left-ellipsis'),
      ex('product-manager', 'clients', 3, 'i-heroicons-document-text'),
      ex('product-manager', 'clients', 4, 'i-heroicons-hand-thumb-up'),
    ],
    'general-public': [
      ex('product-manager', 'general-public', 0, 'i-heroicons-megaphone'),
      ex('product-manager', 'general-public', 1, 'i-heroicons-newspaper'),
      ex('product-manager', 'general-public', 2, 'i-heroicons-light-bulb'),
      ex('product-manager', 'general-public', 3, 'i-heroicons-question-mark-circle'),
      ex('product-manager', 'general-public', 4, 'i-heroicons-sparkles'),
    ],
    'students': [
      ex('product-manager', 'students', 0, 'i-heroicons-academic-cap'),
      ex('product-manager', 'students', 1, 'i-heroicons-book-open'),
      ex('product-manager', 'students', 2, 'i-heroicons-puzzle-piece'),
      ex('product-manager', 'students', 3, 'i-heroicons-light-bulb'),
      ex('product-manager', 'students', 4, 'i-heroicons-briefcase'),
    ],
    'experts': [
      ex('product-manager', 'experts', 0, 'i-heroicons-chart-pie'),
      ex('product-manager', 'experts', 1, 'i-heroicons-beaker'),
      ex('product-manager', 'experts', 2, 'i-heroicons-arrow-trending-up'),
      ex('product-manager', 'experts', 3, 'i-heroicons-cog-6-tooth'),
      ex('product-manager', 'experts', 4, 'i-heroicons-globe-alt'),
    ],
    'beginners': [
      ex('product-manager', 'beginners', 0, 'i-heroicons-light-bulb'),
      ex('product-manager', 'beginners', 1, 'i-heroicons-book-open'),
      ex('product-manager', 'beginners', 2, 'i-heroicons-puzzle-piece'),
      ex('product-manager', 'beginners', 3, 'i-heroicons-check-circle'),
      ex('product-manager', 'beginners', 4, 'i-heroicons-arrow-right'),
    ],
    'stakeholders': [
      ex('product-manager', 'stakeholders', 0, 'i-heroicons-chart-bar'),
      ex('product-manager', 'stakeholders', 1, 'i-heroicons-map'),
      ex('product-manager', 'stakeholders', 2, 'i-heroicons-banknotes'),
      ex('product-manager', 'stakeholders', 3, 'i-heroicons-flag'),
      ex('product-manager', 'stakeholders', 4, 'i-heroicons-check-badge'),
    ],
    'team-members': [
      ex('product-manager', 'team-members', 0, 'i-heroicons-clipboard-document-check'),
      ex('product-manager', 'team-members', 1, 'i-heroicons-calendar-days'),
      ex('product-manager', 'team-members', 2, 'i-heroicons-chat-bubble-left-right'),
      ex('product-manager', 'team-members', 3, 'i-heroicons-flag'),
      ex('product-manager', 'team-members', 4, 'i-heroicons-user-group'),
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // DATA ANALYST
  // ═══════════════════════════════════════════════════════════════════════════
  'data-analyst': {
    'technical-team': [
      ex('data-analyst', 'technical-team', 0, 'i-heroicons-circle-stack'),
      ex('data-analyst', 'technical-team', 1, 'i-heroicons-code-bracket'),
      ex('data-analyst', 'technical-team', 2, 'i-heroicons-document-text'),
      ex('data-analyst', 'technical-team', 3, 'i-heroicons-arrow-path'),
      ex('data-analyst', 'technical-team', 4, 'i-heroicons-server'),
    ],
    'executives': [
      ex('data-analyst', 'executives', 0, 'i-heroicons-presentation-chart-bar'),
      ex('data-analyst', 'executives', 1, 'i-heroicons-chart-pie'),
      ex('data-analyst', 'executives', 2, 'i-heroicons-arrow-trending-up'),
      ex('data-analyst', 'executives', 3, 'i-heroicons-light-bulb'),
      ex('data-analyst', 'executives', 4, 'i-heroicons-document-chart-bar'),
    ],
    'clients': [
      ex('data-analyst', 'clients', 0, 'i-heroicons-chart-bar'),
      ex('data-analyst', 'clients', 1, 'i-heroicons-document-text'),
      ex('data-analyst', 'clients', 2, 'i-heroicons-light-bulb'),
      ex('data-analyst', 'clients', 3, 'i-heroicons-arrow-trending-up'),
      ex('data-analyst', 'clients', 4, 'i-heroicons-check-badge'),
    ],
    'general-public': [
      ex('data-analyst', 'general-public', 0, 'i-heroicons-chart-bar'),
      ex('data-analyst', 'general-public', 1, 'i-heroicons-newspaper'),
      ex('data-analyst', 'general-public', 2, 'i-heroicons-light-bulb'),
      ex('data-analyst', 'general-public', 3, 'i-heroicons-photo'),
      ex('data-analyst', 'general-public', 4, 'i-heroicons-question-mark-circle'),
    ],
    'students': [
      ex('data-analyst', 'students', 0, 'i-heroicons-academic-cap'),
      ex('data-analyst', 'students', 1, 'i-heroicons-book-open'),
      ex('data-analyst', 'students', 2, 'i-heroicons-calculator'),
      ex('data-analyst', 'students', 3, 'i-heroicons-chart-bar'),
      ex('data-analyst', 'students', 4, 'i-heroicons-puzzle-piece'),
    ],
    'experts': [
      ex('data-analyst', 'experts', 0, 'i-heroicons-cpu-chip'),
      ex('data-analyst', 'experts', 1, 'i-heroicons-chart-bar-square'),
      ex('data-analyst', 'experts', 2, 'i-heroicons-beaker'),
      ex('data-analyst', 'experts', 3, 'i-heroicons-cog-6-tooth'),
      ex('data-analyst', 'experts', 4, 'i-heroicons-variable'),
    ],
    'beginners': [
      ex('data-analyst', 'beginners', 0, 'i-heroicons-light-bulb'),
      ex('data-analyst', 'beginners', 1, 'i-heroicons-chart-bar'),
      ex('data-analyst', 'beginners', 2, 'i-heroicons-book-open'),
      ex('data-analyst', 'beginners', 3, 'i-heroicons-calculator'),
      ex('data-analyst', 'beginners', 4, 'i-heroicons-puzzle-piece'),
    ],
    'stakeholders': [
      ex('data-analyst', 'stakeholders', 0, 'i-heroicons-presentation-chart-line'),
      ex('data-analyst', 'stakeholders', 1, 'i-heroicons-document-chart-bar'),
      ex('data-analyst', 'stakeholders', 2, 'i-heroicons-arrow-trending-up'),
      ex('data-analyst', 'stakeholders', 3, 'i-heroicons-flag'),
      ex('data-analyst', 'stakeholders', 4, 'i-heroicons-light-bulb'),
    ],
    'team-members': [
      ex('data-analyst', 'team-members', 0, 'i-heroicons-clipboard-document-list'),
      ex('data-analyst', 'team-members', 1, 'i-heroicons-chart-bar'),
      ex('data-analyst', 'team-members', 2, 'i-heroicons-document-text'),
      ex('data-analyst', 'team-members', 3, 'i-heroicons-share'),
      ex('data-analyst', 'team-members', 4, 'i-heroicons-light-bulb'),
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // MARKETING SPECIALIST
  // ═══════════════════════════════════════════════════════════════════════════
  'marketing-specialist': {
    'technical-team': [
      ex('marketing-specialist', 'technical-team', 0, 'i-heroicons-clipboard-document-list'),
      ex('marketing-specialist', 'technical-team', 1, 'i-heroicons-chart-bar'),
      ex('marketing-specialist', 'technical-team', 2, 'i-heroicons-cog-6-tooth'),
      ex('marketing-specialist', 'technical-team', 3, 'i-heroicons-link'),
      ex('marketing-specialist', 'technical-team', 4, 'i-heroicons-bug-ant'),
    ],
    'executives': [
      ex('marketing-specialist', 'executives', 0, 'i-heroicons-presentation-chart-line'),
      ex('marketing-specialist', 'executives', 1, 'i-heroicons-currency-dollar'),
      ex('marketing-specialist', 'executives', 2, 'i-heroicons-chart-pie'),
      ex('marketing-specialist', 'executives', 3, 'i-heroicons-trophy'),
      ex('marketing-specialist', 'executives', 4, 'i-heroicons-map'),
    ],
    'clients': [
      ex('marketing-specialist', 'clients', 0, 'i-heroicons-sparkles'),
      ex('marketing-specialist', 'clients', 1, 'i-heroicons-megaphone'),
      ex('marketing-specialist', 'clients', 2, 'i-heroicons-chart-bar'),
      ex('marketing-specialist', 'clients', 3, 'i-heroicons-document-text'),
      ex('marketing-specialist', 'clients', 4, 'i-heroicons-rocket-launch'),
    ],
    'general-public': [
      ex('marketing-specialist', 'general-public', 0, 'i-heroicons-megaphone'),
      ex('marketing-specialist', 'general-public', 1, 'i-heroicons-heart'),
      ex('marketing-specialist', 'general-public', 2, 'i-heroicons-newspaper'),
      ex('marketing-specialist', 'general-public', 3, 'i-heroicons-hashtag'),
      ex('marketing-specialist', 'general-public', 4, 'i-heroicons-video-camera'),
    ],
    'students': [
      ex('marketing-specialist', 'students', 0, 'i-heroicons-academic-cap'),
      ex('marketing-specialist', 'students', 1, 'i-heroicons-book-open'),
      ex('marketing-specialist', 'students', 2, 'i-heroicons-light-bulb'),
      ex('marketing-specialist', 'students', 3, 'i-heroicons-briefcase'),
      ex('marketing-specialist', 'students', 4, 'i-heroicons-sparkles'),
    ],
    'experts': [
      ex('marketing-specialist', 'experts', 0, 'i-heroicons-chart-bar-square'),
      ex('marketing-specialist', 'experts', 1, 'i-heroicons-beaker'),
      ex('marketing-specialist', 'experts', 2, 'i-heroicons-arrow-trending-up'),
      ex('marketing-specialist', 'experts', 3, 'i-heroicons-globe-alt'),
      ex('marketing-specialist', 'experts', 4, 'i-heroicons-cog-6-tooth'),
    ],
    'beginners': [
      ex('marketing-specialist', 'beginners', 0, 'i-heroicons-light-bulb'),
      ex('marketing-specialist', 'beginners', 1, 'i-heroicons-book-open'),
      ex('marketing-specialist', 'beginners', 2, 'i-heroicons-megaphone'),
      ex('marketing-specialist', 'beginners', 3, 'i-heroicons-hashtag'),
      ex('marketing-specialist', 'beginners', 4, 'i-heroicons-check-circle'),
    ],
    'stakeholders': [
      ex('marketing-specialist', 'stakeholders', 0, 'i-heroicons-chart-bar'),
      ex('marketing-specialist', 'stakeholders', 1, 'i-heroicons-currency-dollar'),
      ex('marketing-specialist', 'stakeholders', 2, 'i-heroicons-arrow-trending-up'),
      ex('marketing-specialist', 'stakeholders', 3, 'i-heroicons-calendar'),
      ex('marketing-specialist', 'stakeholders', 4, 'i-heroicons-flag'),
    ],
    'team-members': [
      ex('marketing-specialist', 'team-members', 0, 'i-heroicons-clipboard-document-list'),
      ex('marketing-specialist', 'team-members', 1, 'i-heroicons-calendar-days'),
      ex('marketing-specialist', 'team-members', 2, 'i-heroicons-chat-bubble-left-right'),
      ex('marketing-specialist', 'team-members', 3, 'i-heroicons-pencil-square'),
      ex('marketing-specialist', 'team-members', 4, 'i-heroicons-photo'),
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // DESIGNER
  // ═══════════════════════════════════════════════════════════════════════════
  'designer': {
    'technical-team': [
      ex('designer', 'technical-team', 0, 'i-heroicons-document-text'),
      ex('designer', 'technical-team', 1, 'i-heroicons-swatch'),
      ex('designer', 'technical-team', 2, 'i-heroicons-device-phone-mobile'),
      ex('designer', 'technical-team', 3, 'i-heroicons-cursor-arrow-rays'),
      ex('designer', 'technical-team', 4, 'i-heroicons-chat-bubble-left-right'),
    ],
    'executives': [
      ex('designer', 'executives', 0, 'i-heroicons-presentation-chart-line'),
      ex('designer', 'executives', 1, 'i-heroicons-swatch'),
      ex('designer', 'executives', 2, 'i-heroicons-chart-bar'),
      ex('designer', 'executives', 3, 'i-heroicons-currency-dollar'),
      ex('designer', 'executives', 4, 'i-heroicons-sparkles'),
    ],
    'clients': [
      ex('designer', 'clients', 0, 'i-heroicons-photo'),
      ex('designer', 'clients', 1, 'i-heroicons-swatch'),
      ex('designer', 'clients', 2, 'i-heroicons-cursor-arrow-rays'),
      ex('designer', 'clients', 3, 'i-heroicons-document-text'),
      ex('designer', 'clients', 4, 'i-heroicons-arrow-path'),
    ],
    'general-public': [
      ex('designer', 'general-public', 0, 'i-heroicons-paint-brush'),
      ex('designer', 'general-public', 1, 'i-heroicons-swatch'),
      ex('designer', 'general-public', 2, 'i-heroicons-eye'),
      ex('designer', 'general-public', 3, 'i-heroicons-sparkles'),
      ex('designer', 'general-public', 4, 'i-heroicons-light-bulb'),
    ],
    'students': [
      ex('designer', 'students', 0, 'i-heroicons-academic-cap'),
      ex('designer', 'students', 1, 'i-heroicons-paint-brush'),
      ex('designer', 'students', 2, 'i-heroicons-book-open'),
      ex('designer', 'students', 3, 'i-heroicons-swatch'),
      ex('designer', 'students', 4, 'i-heroicons-briefcase'),
    ],
    'experts': [
      ex('designer', 'experts', 0, 'i-heroicons-beaker'),
      ex('designer', 'experts', 1, 'i-heroicons-cpu-chip'),
      ex('designer', 'experts', 2, 'i-heroicons-chart-bar'),
      ex('designer', 'experts', 3, 'i-heroicons-cog-6-tooth'),
      ex('designer', 'experts', 4, 'i-heroicons-arrow-trending-up'),
    ],
    'beginners': [
      ex('designer', 'beginners', 0, 'i-heroicons-light-bulb'),
      ex('designer', 'beginners', 1, 'i-heroicons-paint-brush'),
      ex('designer', 'beginners', 2, 'i-heroicons-swatch'),
      ex('designer', 'beginners', 3, 'i-heroicons-book-open'),
      ex('designer', 'beginners', 4, 'i-heroicons-check-circle'),
    ],
    'stakeholders': [
      ex('designer', 'stakeholders', 0, 'i-heroicons-presentation-chart-line'),
      ex('designer', 'stakeholders', 1, 'i-heroicons-swatch'),
      ex('designer', 'stakeholders', 2, 'i-heroicons-chart-bar'),
      ex('designer', 'stakeholders', 3, 'i-heroicons-calendar'),
      ex('designer', 'stakeholders', 4, 'i-heroicons-flag'),
    ],
    'team-members': [
      ex('designer', 'team-members', 0, 'i-heroicons-swatch'),
      ex('designer', 'team-members', 1, 'i-heroicons-document-text'),
      ex('designer', 'team-members', 2, 'i-heroicons-chat-bubble-left-right'),
      ex('designer', 'team-members', 3, 'i-heroicons-photo'),
      ex('designer', 'team-members', 4, 'i-heroicons-arrow-path'),
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // BUSINESS ANALYST
  // ═══════════════════════════════════════════════════════════════════════════
  'business-analyst': {
    'technical-team': [
      ex('business-analyst', 'technical-team', 0, 'i-heroicons-document-text'),
      ex('business-analyst', 'technical-team', 1, 'i-heroicons-clipboard-document-list'),
      ex('business-analyst', 'technical-team', 2, 'i-heroicons-arrows-pointing-out'),
      ex('business-analyst', 'technical-team', 3, 'i-heroicons-check-circle'),
      ex('business-analyst', 'technical-team', 4, 'i-heroicons-chat-bubble-left-right'),
    ],
    'executives': [
      ex('business-analyst', 'executives', 0, 'i-heroicons-presentation-chart-bar'),
      ex('business-analyst', 'executives', 1, 'i-heroicons-currency-dollar'),
      ex('business-analyst', 'executives', 2, 'i-heroicons-scale'),
      ex('business-analyst', 'executives', 3, 'i-heroicons-map'),
      ex('business-analyst', 'executives', 4, 'i-heroicons-light-bulb'),
    ],
    'clients': [
      ex('business-analyst', 'clients', 0, 'i-heroicons-document-text'),
      ex('business-analyst', 'clients', 1, 'i-heroicons-clipboard-document-check'),
      ex('business-analyst', 'clients', 2, 'i-heroicons-chart-bar'),
      ex('business-analyst', 'clients', 3, 'i-heroicons-light-bulb'),
      ex('business-analyst', 'clients', 4, 'i-heroicons-calendar'),
    ],
    'general-public': [
      ex('business-analyst', 'general-public', 0, 'i-heroicons-light-bulb'),
      ex('business-analyst', 'general-public', 1, 'i-heroicons-chart-bar'),
      ex('business-analyst', 'general-public', 2, 'i-heroicons-newspaper'),
      ex('business-analyst', 'general-public', 3, 'i-heroicons-building-office'),
      ex('business-analyst', 'general-public', 4, 'i-heroicons-question-mark-circle'),
    ],
    'students': [
      ex('business-analyst', 'students', 0, 'i-heroicons-academic-cap'),
      ex('business-analyst', 'students', 1, 'i-heroicons-book-open'),
      ex('business-analyst', 'students', 2, 'i-heroicons-briefcase'),
      ex('business-analyst', 'students', 3, 'i-heroicons-chart-bar'),
      ex('business-analyst', 'students', 4, 'i-heroicons-light-bulb'),
    ],
    'experts': [
      ex('business-analyst', 'experts', 0, 'i-heroicons-chart-bar-square'),
      ex('business-analyst', 'experts', 1, 'i-heroicons-cog-6-tooth'),
      ex('business-analyst', 'experts', 2, 'i-heroicons-beaker'),
      ex('business-analyst', 'experts', 3, 'i-heroicons-arrow-trending-up'),
      ex('business-analyst', 'experts', 4, 'i-heroicons-globe-alt'),
    ],
    'beginners': [
      ex('business-analyst', 'beginners', 0, 'i-heroicons-light-bulb'),
      ex('business-analyst', 'beginners', 1, 'i-heroicons-book-open'),
      ex('business-analyst', 'beginners', 2, 'i-heroicons-chart-bar'),
      ex('business-analyst', 'beginners', 3, 'i-heroicons-briefcase'),
      ex('business-analyst', 'beginners', 4, 'i-heroicons-check-circle'),
    ],
    'stakeholders': [
      ex('business-analyst', 'stakeholders', 0, 'i-heroicons-presentation-chart-line'),
      ex('business-analyst', 'stakeholders', 1, 'i-heroicons-document-chart-bar'),
      ex('business-analyst', 'stakeholders', 2, 'i-heroicons-scale'),
      ex('business-analyst', 'stakeholders', 3, 'i-heroicons-flag'),
      ex('business-analyst', 'stakeholders', 4, 'i-heroicons-check-badge'),
    ],
    'team-members': [
      ex('business-analyst', 'team-members', 0, 'i-heroicons-clipboard-document-list'),
      ex('business-analyst', 'team-members', 1, 'i-heroicons-document-text'),
      ex('business-analyst', 'team-members', 2, 'i-heroicons-arrows-pointing-out'),
      ex('business-analyst', 'team-members', 3, 'i-heroicons-chat-bubble-left-right'),
      ex('business-analyst', 'team-members', 4, 'i-heroicons-user-group'),
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // CONTENT WRITER
  // ═══════════════════════════════════════════════════════════════════════════
  'content-writer': {
    'technical-team': [
      ex('content-writer', 'technical-team', 0, 'i-heroicons-document-text'),
      ex('content-writer', 'technical-team', 1, 'i-heroicons-code-bracket'),
      ex('content-writer', 'technical-team', 2, 'i-heroicons-book-open'),
      ex('content-writer', 'technical-team', 3, 'i-heroicons-clipboard-document-list'),
      ex('content-writer', 'technical-team', 4, 'i-heroicons-chat-bubble-left-right'),
    ],
    'executives': [
      ex('content-writer', 'executives', 0, 'i-heroicons-document-text'),
      ex('content-writer', 'executives', 1, 'i-heroicons-presentation-chart-line'),
      ex('content-writer', 'executives', 2, 'i-heroicons-envelope'),
      ex('content-writer', 'executives', 3, 'i-heroicons-megaphone'),
      ex('content-writer', 'executives', 4, 'i-heroicons-newspaper'),
    ],
    'clients': [
      ex('content-writer', 'clients', 0, 'i-heroicons-envelope'),
      ex('content-writer', 'clients', 1, 'i-heroicons-document-text'),
      ex('content-writer', 'clients', 2, 'i-heroicons-sparkles'),
      ex('content-writer', 'clients', 3, 'i-heroicons-megaphone'),
      ex('content-writer', 'clients', 4, 'i-heroicons-chat-bubble-left'),
    ],
    'general-public': [
      ex('content-writer', 'general-public', 0, 'i-heroicons-newspaper'),
      ex('content-writer', 'general-public', 1, 'i-heroicons-heart'),
      ex('content-writer', 'general-public', 2, 'i-heroicons-hashtag'),
      ex('content-writer', 'general-public', 3, 'i-heroicons-megaphone'),
      ex('content-writer', 'general-public', 4, 'i-heroicons-video-camera'),
    ],
    'students': [
      ex('content-writer', 'students', 0, 'i-heroicons-academic-cap'),
      ex('content-writer', 'students', 1, 'i-heroicons-book-open'),
      ex('content-writer', 'students', 2, 'i-heroicons-pencil-square'),
      ex('content-writer', 'students', 3, 'i-heroicons-light-bulb'),
      ex('content-writer', 'students', 4, 'i-heroicons-document-text'),
    ],
    'experts': [
      ex('content-writer', 'experts', 0, 'i-heroicons-document-text'),
      ex('content-writer', 'experts', 1, 'i-heroicons-beaker'),
      ex('content-writer', 'experts', 2, 'i-heroicons-newspaper'),
      ex('content-writer', 'experts', 3, 'i-heroicons-chart-bar'),
      ex('content-writer', 'experts', 4, 'i-heroicons-book-open'),
    ],
    'beginners': [
      ex('content-writer', 'beginners', 0, 'i-heroicons-light-bulb'),
      ex('content-writer', 'beginners', 1, 'i-heroicons-pencil-square'),
      ex('content-writer', 'beginners', 2, 'i-heroicons-book-open'),
      ex('content-writer', 'beginners', 3, 'i-heroicons-document-text'),
      ex('content-writer', 'beginners', 4, 'i-heroicons-check-circle'),
    ],
    'stakeholders': [
      ex('content-writer', 'stakeholders', 0, 'i-heroicons-document-text'),
      ex('content-writer', 'stakeholders', 1, 'i-heroicons-newspaper'),
      ex('content-writer', 'stakeholders', 2, 'i-heroicons-megaphone'),
      ex('content-writer', 'stakeholders', 3, 'i-heroicons-envelope'),
      ex('content-writer', 'stakeholders', 4, 'i-heroicons-presentation-chart-line'),
    ],
    'team-members': [
      ex('content-writer', 'team-members', 0, 'i-heroicons-pencil-square'),
      ex('content-writer', 'team-members', 1, 'i-heroicons-document-text'),
      ex('content-writer', 'team-members', 2, 'i-heroicons-clipboard-document-list'),
      ex('content-writer', 'team-members', 3, 'i-heroicons-chat-bubble-left-right'),
      ex('content-writer', 'team-members', 4, 'i-heroicons-calendar'),
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // PROJECT MANAGER
  // ═══════════════════════════════════════════════════════════════════════════
  'project-manager': {
    'technical-team': [
      ex('project-manager', 'technical-team', 0, 'i-heroicons-clipboard-document-list'),
      ex('project-manager', 'technical-team', 1, 'i-heroicons-calendar-days'),
      ex('project-manager', 'technical-team', 2, 'i-heroicons-exclamation-triangle'),
      ex('project-manager', 'technical-team', 3, 'i-heroicons-user-group'),
      ex('project-manager', 'technical-team', 4, 'i-heroicons-chat-bubble-left-right'),
    ],
    'executives': [
      ex('project-manager', 'executives', 0, 'i-heroicons-presentation-chart-line'),
      ex('project-manager', 'executives', 1, 'i-heroicons-currency-dollar'),
      ex('project-manager', 'executives', 2, 'i-heroicons-exclamation-triangle'),
      ex('project-manager', 'executives', 3, 'i-heroicons-calendar'),
      ex('project-manager', 'executives', 4, 'i-heroicons-flag'),
    ],
    'clients': [
      ex('project-manager', 'clients', 0, 'i-heroicons-document-text'),
      ex('project-manager', 'clients', 1, 'i-heroicons-calendar'),
      ex('project-manager', 'clients', 2, 'i-heroicons-chat-bubble-left'),
      ex('project-manager', 'clients', 3, 'i-heroicons-check-badge'),
      ex('project-manager', 'clients', 4, 'i-heroicons-envelope'),
    ],
    'general-public': [
      ex('project-manager', 'general-public', 0, 'i-heroicons-light-bulb'),
      ex('project-manager', 'general-public', 1, 'i-heroicons-newspaper'),
      ex('project-manager', 'general-public', 2, 'i-heroicons-megaphone'),
      ex('project-manager', 'general-public', 3, 'i-heroicons-calendar'),
      ex('project-manager', 'general-public', 4, 'i-heroicons-user-group'),
    ],
    'students': [
      ex('project-manager', 'students', 0, 'i-heroicons-academic-cap'),
      ex('project-manager', 'students', 1, 'i-heroicons-book-open'),
      ex('project-manager', 'students', 2, 'i-heroicons-briefcase'),
      ex('project-manager', 'students', 3, 'i-heroicons-calendar'),
      ex('project-manager', 'students', 4, 'i-heroicons-light-bulb'),
    ],
    'experts': [
      ex('project-manager', 'experts', 0, 'i-heroicons-cog-6-tooth'),
      ex('project-manager', 'experts', 1, 'i-heroicons-chart-bar'),
      ex('project-manager', 'experts', 2, 'i-heroicons-beaker'),
      ex('project-manager', 'experts', 3, 'i-heroicons-arrow-trending-up'),
      ex('project-manager', 'experts', 4, 'i-heroicons-scale'),
    ],
    'beginners': [
      ex('project-manager', 'beginners', 0, 'i-heroicons-light-bulb'),
      ex('project-manager', 'beginners', 1, 'i-heroicons-calendar'),
      ex('project-manager', 'beginners', 2, 'i-heroicons-book-open'),
      ex('project-manager', 'beginners', 3, 'i-heroicons-clipboard-document-list'),
      ex('project-manager', 'beginners', 4, 'i-heroicons-check-circle'),
    ],
    'stakeholders': [
      ex('project-manager', 'stakeholders', 0, 'i-heroicons-presentation-chart-line'),
      ex('project-manager', 'stakeholders', 1, 'i-heroicons-calendar'),
      ex('project-manager', 'stakeholders', 2, 'i-heroicons-exclamation-triangle'),
      ex('project-manager', 'stakeholders', 3, 'i-heroicons-flag'),
      ex('project-manager', 'stakeholders', 4, 'i-heroicons-banknotes'),
    ],
    'team-members': [
      ex('project-manager', 'team-members', 0, 'i-heroicons-clipboard-document-check'),
      ex('project-manager', 'team-members', 1, 'i-heroicons-calendar-days'),
      ex('project-manager', 'team-members', 2, 'i-heroicons-user-group'),
      ex('project-manager', 'team-members', 3, 'i-heroicons-chat-bubble-left-right'),
      ex('project-manager', 'team-members', 4, 'i-heroicons-hand-raised'),
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // RESEARCHER
  // ═══════════════════════════════════════════════════════════════════════════
  'researcher': {
    'technical-team': [
      ex('researcher', 'technical-team', 0, 'i-heroicons-document-text'),
      ex('researcher', 'technical-team', 1, 'i-heroicons-beaker'),
      ex('researcher', 'technical-team', 2, 'i-heroicons-chart-bar'),
      ex('researcher', 'technical-team', 3, 'i-heroicons-clipboard-document-list'),
      ex('researcher', 'technical-team', 4, 'i-heroicons-code-bracket'),
    ],
    'executives': [
      ex('researcher', 'executives', 0, 'i-heroicons-presentation-chart-bar'),
      ex('researcher', 'executives', 1, 'i-heroicons-light-bulb'),
      ex('researcher', 'executives', 2, 'i-heroicons-currency-dollar'),
      ex('researcher', 'executives', 3, 'i-heroicons-document-text'),
      ex('researcher', 'executives', 4, 'i-heroicons-arrow-trending-up'),
    ],
    'clients': [
      ex('researcher', 'clients', 0, 'i-heroicons-document-text'),
      ex('researcher', 'clients', 1, 'i-heroicons-chart-bar'),
      ex('researcher', 'clients', 2, 'i-heroicons-light-bulb'),
      ex('researcher', 'clients', 3, 'i-heroicons-presentation-chart-line'),
      ex('researcher', 'clients', 4, 'i-heroicons-check-badge'),
    ],
    'general-public': [
      ex('researcher', 'general-public', 0, 'i-heroicons-newspaper'),
      ex('researcher', 'general-public', 1, 'i-heroicons-light-bulb'),
      ex('researcher', 'general-public', 2, 'i-heroicons-question-mark-circle'),
      ex('researcher', 'general-public', 3, 'i-heroicons-megaphone'),
      ex('researcher', 'general-public', 4, 'i-heroicons-chart-bar'),
    ],
    'students': [
      ex('researcher', 'students', 0, 'i-heroicons-academic-cap'),
      ex('researcher', 'students', 1, 'i-heroicons-book-open'),
      ex('researcher', 'students', 2, 'i-heroicons-beaker'),
      ex('researcher', 'students', 3, 'i-heroicons-light-bulb'),
      ex('researcher', 'students', 4, 'i-heroicons-document-text'),
    ],
    'experts': [
      ex('researcher', 'experts', 0, 'i-heroicons-beaker'),
      ex('researcher', 'experts', 1, 'i-heroicons-document-text'),
      ex('researcher', 'experts', 2, 'i-heroicons-chart-bar-square'),
      ex('researcher', 'experts', 3, 'i-heroicons-magnifying-glass'),
      ex('researcher', 'experts', 4, 'i-heroicons-arrow-trending-up'),
    ],
    'beginners': [
      ex('researcher', 'beginners', 0, 'i-heroicons-light-bulb'),
      ex('researcher', 'beginners', 1, 'i-heroicons-book-open'),
      ex('researcher', 'beginners', 2, 'i-heroicons-beaker'),
      ex('researcher', 'beginners', 3, 'i-heroicons-question-mark-circle'),
      ex('researcher', 'beginners', 4, 'i-heroicons-check-circle'),
    ],
    'stakeholders': [
      ex('researcher', 'stakeholders', 0, 'i-heroicons-presentation-chart-line'),
      ex('researcher', 'stakeholders', 1, 'i-heroicons-document-chart-bar'),
      ex('researcher', 'stakeholders', 2, 'i-heroicons-light-bulb'),
      ex('researcher', 'stakeholders', 3, 'i-heroicons-flag'),
      ex('researcher', 'stakeholders', 4, 'i-heroicons-banknotes'),
    ],
    'team-members': [
      ex('researcher', 'team-members', 0, 'i-heroicons-document-text'),
      ex('researcher', 'team-members', 1, 'i-heroicons-beaker'),
      ex('researcher', 'team-members', 2, 'i-heroicons-share'),
      ex('researcher', 'team-members', 3, 'i-heroicons-chat-bubble-left-right'),
      ex('researcher', 'team-members', 4, 'i-heroicons-clipboard-document-list'),
    ],
  },
}
