/**
 * Examples Matrix - 500 role-audience specific example prompts
 * 10 roles × 10 audiences × 5 examples = 500 total
 */

import type { ExamplesMatrix, RoleId, AudienceId, ExamplePrompt } from '~/types/examples'

/**
 * List of all valid role IDs (excludes 'other')
 */
export const VALID_ROLES: RoleId[] = [
  'hr-specialist',
  'expert-accountant',
  'data-analyst',
  'marketing-specialist',
  'procurement-specialist',
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
  // HR SPECIALIST
  // ═══════════════════════════════════════════════════════════════════════════
  'hr-specialist': {
    'technical-team': [
      ex('hr-specialist', 'technical-team', 0, 'i-heroicons-user-plus'),
      ex('hr-specialist', 'technical-team', 1, 'i-heroicons-document-text'),
      ex('hr-specialist', 'technical-team', 2, 'i-heroicons-academic-cap'),
      ex('hr-specialist', 'technical-team', 3, 'i-heroicons-clipboard-document-check'),
      ex('hr-specialist', 'technical-team', 4, 'i-heroicons-chat-bubble-left-right'),
    ],
    'executives': [
      ex('hr-specialist', 'executives', 0, 'i-heroicons-presentation-chart-line'),
      ex('hr-specialist', 'executives', 1, 'i-heroicons-users'),
      ex('hr-specialist', 'executives', 2, 'i-heroicons-currency-dollar'),
      ex('hr-specialist', 'executives', 3, 'i-heroicons-arrow-trending-up'),
      ex('hr-specialist', 'executives', 4, 'i-heroicons-shield-check'),
    ],
    'clients': [
      ex('hr-specialist', 'clients', 0, 'i-heroicons-document-text'),
      ex('hr-specialist', 'clients', 1, 'i-heroicons-briefcase'),
      ex('hr-specialist', 'clients', 2, 'i-heroicons-user-group'),
      ex('hr-specialist', 'clients', 3, 'i-heroicons-clipboard-document-list'),
      ex('hr-specialist', 'clients', 4, 'i-heroicons-check-badge'),
    ],
    'general-public': [
      ex('hr-specialist', 'general-public', 0, 'i-heroicons-briefcase'),
      ex('hr-specialist', 'general-public', 1, 'i-heroicons-light-bulb'),
      ex('hr-specialist', 'general-public', 2, 'i-heroicons-heart'),
      ex('hr-specialist', 'general-public', 3, 'i-heroicons-question-mark-circle'),
      ex('hr-specialist', 'general-public', 4, 'i-heroicons-user-group'),
    ],
    'students': [
      ex('hr-specialist', 'students', 0, 'i-heroicons-academic-cap'),
      ex('hr-specialist', 'students', 1, 'i-heroicons-book-open'),
      ex('hr-specialist', 'students', 2, 'i-heroicons-briefcase'),
      ex('hr-specialist', 'students', 3, 'i-heroicons-document-text'),
      ex('hr-specialist', 'students', 4, 'i-heroicons-light-bulb'),
    ],
    'experts': [
      ex('hr-specialist', 'experts', 0, 'i-heroicons-chart-bar'),
      ex('hr-specialist', 'experts', 1, 'i-heroicons-scale'),
      ex('hr-specialist', 'experts', 2, 'i-heroicons-cog-6-tooth'),
      ex('hr-specialist', 'experts', 3, 'i-heroicons-globe-alt'),
      ex('hr-specialist', 'experts', 4, 'i-heroicons-arrow-trending-up'),
    ],
    'beginners': [
      ex('hr-specialist', 'beginners', 0, 'i-heroicons-light-bulb'),
      ex('hr-specialist', 'beginners', 1, 'i-heroicons-users'),
      ex('hr-specialist', 'beginners', 2, 'i-heroicons-book-open'),
      ex('hr-specialist', 'beginners', 3, 'i-heroicons-briefcase'),
      ex('hr-specialist', 'beginners', 4, 'i-heroicons-check-circle'),
    ],
    'stakeholders': [
      ex('hr-specialist', 'stakeholders', 0, 'i-heroicons-presentation-chart-line'),
      ex('hr-specialist', 'stakeholders', 1, 'i-heroicons-users'),
      ex('hr-specialist', 'stakeholders', 2, 'i-heroicons-currency-dollar'),
      ex('hr-specialist', 'stakeholders', 3, 'i-heroicons-flag'),
      ex('hr-specialist', 'stakeholders', 4, 'i-heroicons-clipboard-document-check'),
    ],
    'team-members': [
      ex('hr-specialist', 'team-members', 0, 'i-heroicons-user-group'),
      ex('hr-specialist', 'team-members', 1, 'i-heroicons-document-text'),
      ex('hr-specialist', 'team-members', 2, 'i-heroicons-calendar'),
      ex('hr-specialist', 'team-members', 3, 'i-heroicons-chat-bubble-left-right'),
      ex('hr-specialist', 'team-members', 4, 'i-heroicons-heart'),
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // EXPERT ACCOUNTANT
  // ═══════════════════════════════════════════════════════════════════════════
  'expert-accountant': {
    'technical-team': [
      ex('expert-accountant', 'technical-team', 0, 'i-heroicons-calculator'),
      ex('expert-accountant', 'technical-team', 1, 'i-heroicons-document-text'),
      ex('expert-accountant', 'technical-team', 2, 'i-heroicons-clipboard-document-check'),
      ex('expert-accountant', 'technical-team', 3, 'i-heroicons-cog-6-tooth'),
      ex('expert-accountant', 'technical-team', 4, 'i-heroicons-chart-bar'),
    ],
    'executives': [
      ex('expert-accountant', 'executives', 0, 'i-heroicons-presentation-chart-line'),
      ex('expert-accountant', 'executives', 1, 'i-heroicons-banknotes'),
      ex('expert-accountant', 'executives', 2, 'i-heroicons-currency-dollar'),
      ex('expert-accountant', 'executives', 3, 'i-heroicons-arrow-trending-up'),
      ex('expert-accountant', 'executives', 4, 'i-heroicons-shield-check'),
    ],
    'clients': [
      ex('expert-accountant', 'clients', 0, 'i-heroicons-document-text'),
      ex('expert-accountant', 'clients', 1, 'i-heroicons-calculator'),
      ex('expert-accountant', 'clients', 2, 'i-heroicons-banknotes'),
      ex('expert-accountant', 'clients', 3, 'i-heroicons-clipboard-document-list'),
      ex('expert-accountant', 'clients', 4, 'i-heroicons-check-badge'),
    ],
    'general-public': [
      ex('expert-accountant', 'general-public', 0, 'i-heroicons-banknotes'),
      ex('expert-accountant', 'general-public', 1, 'i-heroicons-light-bulb'),
      ex('expert-accountant', 'general-public', 2, 'i-heroicons-calculator'),
      ex('expert-accountant', 'general-public', 3, 'i-heroicons-question-mark-circle'),
      ex('expert-accountant', 'general-public', 4, 'i-heroicons-document-text'),
    ],
    'students': [
      ex('expert-accountant', 'students', 0, 'i-heroicons-academic-cap'),
      ex('expert-accountant', 'students', 1, 'i-heroicons-book-open'),
      ex('expert-accountant', 'students', 2, 'i-heroicons-calculator'),
      ex('expert-accountant', 'students', 3, 'i-heroicons-briefcase'),
      ex('expert-accountant', 'students', 4, 'i-heroicons-light-bulb'),
    ],
    'experts': [
      ex('expert-accountant', 'experts', 0, 'i-heroicons-scale'),
      ex('expert-accountant', 'experts', 1, 'i-heroicons-chart-bar'),
      ex('expert-accountant', 'experts', 2, 'i-heroicons-shield-check'),
      ex('expert-accountant', 'experts', 3, 'i-heroicons-globe-alt'),
      ex('expert-accountant', 'experts', 4, 'i-heroicons-cog-6-tooth'),
    ],
    'beginners': [
      ex('expert-accountant', 'beginners', 0, 'i-heroicons-light-bulb'),
      ex('expert-accountant', 'beginners', 1, 'i-heroicons-calculator'),
      ex('expert-accountant', 'beginners', 2, 'i-heroicons-book-open'),
      ex('expert-accountant', 'beginners', 3, 'i-heroicons-banknotes'),
      ex('expert-accountant', 'beginners', 4, 'i-heroicons-check-circle'),
    ],
    'stakeholders': [
      ex('expert-accountant', 'stakeholders', 0, 'i-heroicons-presentation-chart-line'),
      ex('expert-accountant', 'stakeholders', 1, 'i-heroicons-banknotes'),
      ex('expert-accountant', 'stakeholders', 2, 'i-heroicons-document-chart-bar'),
      ex('expert-accountant', 'stakeholders', 3, 'i-heroicons-shield-check'),
      ex('expert-accountant', 'stakeholders', 4, 'i-heroicons-flag'),
    ],
    'team-members': [
      ex('expert-accountant', 'team-members', 0, 'i-heroicons-clipboard-document-check'),
      ex('expert-accountant', 'team-members', 1, 'i-heroicons-document-text'),
      ex('expert-accountant', 'team-members', 2, 'i-heroicons-calendar'),
      ex('expert-accountant', 'team-members', 3, 'i-heroicons-calculator'),
      ex('expert-accountant', 'team-members', 4, 'i-heroicons-chat-bubble-left-right'),
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
  // PROCUREMENT SPECIALIST
  // ═══════════════════════════════════════════════════════════════════════════
  'procurement-specialist': {
    'technical-team': [
      ex('procurement-specialist', 'technical-team', 0, 'i-heroicons-document-text'),
      ex('procurement-specialist', 'technical-team', 1, 'i-heroicons-clipboard-document-check'),
      ex('procurement-specialist', 'technical-team', 2, 'i-heroicons-shopping-cart'),
      ex('procurement-specialist', 'technical-team', 3, 'i-heroicons-truck'),
      ex('procurement-specialist', 'technical-team', 4, 'i-heroicons-chat-bubble-left-right'),
    ],
    'executives': [
      ex('procurement-specialist', 'executives', 0, 'i-heroicons-presentation-chart-line'),
      ex('procurement-specialist', 'executives', 1, 'i-heroicons-banknotes'),
      ex('procurement-specialist', 'executives', 2, 'i-heroicons-arrow-trending-down'),
      ex('procurement-specialist', 'executives', 3, 'i-heroicons-shield-check'),
      ex('procurement-specialist', 'executives', 4, 'i-heroicons-building-storefront'),
    ],
    'clients': [
      ex('procurement-specialist', 'clients', 0, 'i-heroicons-document-text'),
      ex('procurement-specialist', 'clients', 1, 'i-heroicons-scale'),
      ex('procurement-specialist', 'clients', 2, 'i-heroicons-clipboard-document-list'),
      ex('procurement-specialist', 'clients', 3, 'i-heroicons-truck'),
      ex('procurement-specialist', 'clients', 4, 'i-heroicons-check-badge'),
    ],
    'general-public': [
      ex('procurement-specialist', 'general-public', 0, 'i-heroicons-shopping-cart'),
      ex('procurement-specialist', 'general-public', 1, 'i-heroicons-light-bulb'),
      ex('procurement-specialist', 'general-public', 2, 'i-heroicons-banknotes'),
      ex('procurement-specialist', 'general-public', 3, 'i-heroicons-question-mark-circle'),
      ex('procurement-specialist', 'general-public', 4, 'i-heroicons-building-storefront'),
    ],
    'students': [
      ex('procurement-specialist', 'students', 0, 'i-heroicons-academic-cap'),
      ex('procurement-specialist', 'students', 1, 'i-heroicons-book-open'),
      ex('procurement-specialist', 'students', 2, 'i-heroicons-briefcase'),
      ex('procurement-specialist', 'students', 3, 'i-heroicons-shopping-cart'),
      ex('procurement-specialist', 'students', 4, 'i-heroicons-light-bulb'),
    ],
    'experts': [
      ex('procurement-specialist', 'experts', 0, 'i-heroicons-chart-bar'),
      ex('procurement-specialist', 'experts', 1, 'i-heroicons-globe-alt'),
      ex('procurement-specialist', 'experts', 2, 'i-heroicons-scale'),
      ex('procurement-specialist', 'experts', 3, 'i-heroicons-cog-6-tooth'),
      ex('procurement-specialist', 'experts', 4, 'i-heroicons-arrow-trending-up'),
    ],
    'beginners': [
      ex('procurement-specialist', 'beginners', 0, 'i-heroicons-light-bulb'),
      ex('procurement-specialist', 'beginners', 1, 'i-heroicons-shopping-cart'),
      ex('procurement-specialist', 'beginners', 2, 'i-heroicons-book-open'),
      ex('procurement-specialist', 'beginners', 3, 'i-heroicons-document-text'),
      ex('procurement-specialist', 'beginners', 4, 'i-heroicons-check-circle'),
    ],
    'stakeholders': [
      ex('procurement-specialist', 'stakeholders', 0, 'i-heroicons-presentation-chart-line'),
      ex('procurement-specialist', 'stakeholders', 1, 'i-heroicons-banknotes'),
      ex('procurement-specialist', 'stakeholders', 2, 'i-heroicons-building-storefront'),
      ex('procurement-specialist', 'stakeholders', 3, 'i-heroicons-flag'),
      ex('procurement-specialist', 'stakeholders', 4, 'i-heroicons-clipboard-document-check'),
    ],
    'team-members': [
      ex('procurement-specialist', 'team-members', 0, 'i-heroicons-clipboard-document-list'),
      ex('procurement-specialist', 'team-members', 1, 'i-heroicons-document-text'),
      ex('procurement-specialist', 'team-members', 2, 'i-heroicons-calendar'),
      ex('procurement-specialist', 'team-members', 3, 'i-heroicons-chat-bubble-left-right'),
      ex('procurement-specialist', 'team-members', 4, 'i-heroicons-shopping-cart'),
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
