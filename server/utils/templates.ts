/**
 * Templates Utility
 * Manages prompt templates (mock data for now, will be replaced with actual data in Phase 7)
 */

import type {
  PromptTemplate,
  TemplateCategory,
  TemplateDifficulty,
  TemplateFilters
} from '~/types/template';

/**
 * Mock templates data (will be replaced with actual templates in Phase 7)
 */
const mockTemplates: PromptTemplate[] = [
  {
    id: 'email-reply-001',
    category: 'business' as TemplateCategory,
    title: 'Professional Email Reply',
    description: 'Generate a professional email response to common business inquiries',
    tags: ['email', 'business', 'communication', 'professional'],
    difficulty: 'beginner' as TemplateDifficulty,
    estimatedTime: '2 minutes',
    basePrompt: 'Draft a professional email reply to {{recipient_name}} regarding {{topic}}. The tone should be {{tone}} and include {{key_points}}.',
    variables: [
      {
        key: '{{recipient_name}}',
        label: 'Recipient Name',
        type: 'text',
        required: true,
        placeholder: 'John Smith'
      },
      {
        key: '{{topic}}',
        label: 'Email Topic',
        type: 'text',
        required: true,
        placeholder: 'Project timeline inquiry'
      },
      {
        key: '{{tone}}',
        label: 'Tone',
        type: 'select',
        required: true,
        options: ['formal', 'friendly', 'professional', 'casual']
      },
      {
        key: '{{key_points}}',
        label: 'Key Points',
        type: 'text',
        required: true,
        placeholder: 'Updated timeline, next steps, contact information'
      }
    ],
    examples: [
      {
        title: 'Project Status Inquiry',
        description: 'Response to a client asking about project status',
        input: {
          recipient_name: 'Sarah Johnson',
          topic: 'Website redesign project status',
          tone: 'professional',
          key_points: 'Current progress, upcoming milestones, expected completion date'
        },
        output: 'Dear Sarah Johnson, Thank you for your inquiry about the website redesign project status...'
      }
    ],
    usageCount: 145,
    rating: 4.5,
    lastUpdated: new Date('2025-11-01'),
    createdAt: new Date('2025-10-15'),
    version: '1.0'
  },
  {
    id: 'code-review-001',
    category: 'technical' as TemplateCategory,
    title: 'Code Review Guidelines',
    description: 'Generate comprehensive code review comments and suggestions',
    tags: ['code', 'review', 'technical', 'development'],
    difficulty: 'intermediate' as TemplateDifficulty,
    estimatedTime: '5 minutes',
    basePrompt: 'Provide a detailed code review for {{language}} code focusing on {{focus_areas}}. Include suggestions for {{improvement_type}}.',
    variables: [
      {
        key: '{{language}}',
        label: 'Programming Language',
        type: 'select',
        required: true,
        options: ['JavaScript', 'TypeScript', 'Python', 'Java', 'C#', 'Go', 'Rust']
      },
      {
        key: '{{focus_areas}}',
        label: 'Focus Areas',
        type: 'multiselect',
        required: true,
        options: ['Performance', 'Security', 'Readability', 'Best Practices', 'Testing']
      },
      {
        key: '{{improvement_type}}',
        label: 'Improvement Type',
        type: 'text',
        required: true,
        placeholder: 'optimization, refactoring, error handling'
      }
    ],
    examples: [],
    usageCount: 89,
    rating: 4.8,
    lastUpdated: new Date('2025-11-10'),
    createdAt: new Date('2025-10-20'),
    version: '1.1'
  },
  {
    id: 'blog-post-001',
    category: 'creative' as TemplateCategory,
    title: 'Blog Post Outline',
    description: 'Create a structured outline for blog posts',
    tags: ['blog', 'writing', 'content', 'outline'],
    difficulty: 'beginner' as TemplateDifficulty,
    estimatedTime: '3 minutes',
    basePrompt: 'Create a blog post outline about {{topic}} for {{audience}}. Include {{sections}} main sections and target {{word_count}} words.',
    variables: [
      {
        key: '{{topic}}',
        label: 'Blog Topic',
        type: 'text',
        required: true,
        placeholder: 'AI in modern business'
      },
      {
        key: '{{audience}}',
        label: 'Target Audience',
        type: 'text',
        required: true,
        placeholder: 'business professionals'
      },
      {
        key: '{{sections}}',
        label: 'Number of Sections',
        type: 'select',
        required: true,
        options: ['3', '5', '7', '10']
      },
      {
        key: '{{word_count}}',
        label: 'Target Word Count',
        type: 'select',
        required: true,
        options: ['500', '1000', '1500', '2000']
      }
    ],
    examples: [],
    usageCount: 203,
    rating: 4.6,
    lastUpdated: new Date('2025-11-15'),
    createdAt: new Date('2025-10-25'),
    version: '1.0'
  }
];

/**
 * Get all templates with filtering and pagination
 */
export function getTemplates(
  filters?: TemplateFilters,
  page = 1,
  pageSize = 20
): {
  templates: PromptTemplate[];
  total: number;
  page: number;
  pageSize: number;
} {
  let filtered = [...mockTemplates];

  // Apply category filter
  if (filters?.category) {
    filtered = filtered.filter(t => t.category === filters.category);
  }

  // Apply difficulty filter
  if (filters?.difficulty) {
    filtered = filtered.filter(t => t.difficulty === filters.difficulty);
  }

  // Apply tags filter
  if (filters?.tags && filters.tags.length > 0) {
    filtered = filtered.filter(t =>
      filters.tags!.some(tag => t.tags.includes(tag))
    );
  }

  // Apply search filter
  if (filters?.search) {
    const searchLower = filters.search.toLowerCase();
    filtered = filtered.filter(t =>
      t.title.toLowerCase().includes(searchLower) ||
      t.description.toLowerCase().includes(searchLower) ||
      t.tags.some(tag => tag.toLowerCase().includes(searchLower))
    );
  }

  // Apply sorting
  if (filters?.sortBy) {
    const order = filters.sortOrder === 'desc' ? -1 : 1;

    filtered.sort((a, b) => {
      switch (filters.sortBy) {
        case 'popular':
          return (b.usageCount - a.usageCount) * order;
        case 'rating':
          return (b.rating - a.rating) * order;
        case 'recent':
          return (b.lastUpdated.getTime() - a.lastUpdated.getTime()) * order;
        case 'title':
          return a.title.localeCompare(b.title) * order;
        default:
          return 0;
      }
    });
  }

  // Calculate pagination
  const total = filtered.length;
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  const paginatedTemplates = filtered.slice(start, end);

  return {
    templates: paginatedTemplates,
    total,
    page,
    pageSize
  };
}

/**
 * Get a single template by ID
 */
export function getTemplateById(id: string): PromptTemplate | null {
  return mockTemplates.find(t => t.id === id) || null;
}

/**
 * Search templates
 */
export function searchTemplates(query: string): PromptTemplate[] {
  const queryLower = query.toLowerCase();

  return mockTemplates.filter(t =>
    t.title.toLowerCase().includes(queryLower) ||
    t.description.toLowerCase().includes(queryLower) ||
    t.tags.some(tag => tag.toLowerCase().includes(queryLower))
  );
}
