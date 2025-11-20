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
  // Business Templates
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
      { key: '{{recipient_name}}', label: 'Recipient Name', type: 'text', required: true, placeholder: 'John Smith' },
      { key: '{{topic}}', label: 'Email Topic', type: 'text', required: true, placeholder: 'Project timeline inquiry' },
      { key: '{{tone}}', label: 'Tone', type: 'select', required: true, options: ['formal', 'friendly', 'professional', 'casual'] },
      { key: '{{key_points}}', label: 'Key Points', type: 'text', required: true, placeholder: 'Updated timeline, next steps' }
    ],
    examples: [],
    usageCount: 145,
    rating: 4.5,
    lastUpdated: new Date('2025-11-01'),
    createdAt: new Date('2025-10-15'),
    version: '1.0'
  },
  {
    id: 'meeting-agenda-001',
    category: 'business' as TemplateCategory,
    title: 'Meeting Agenda Creator',
    description: 'Create structured agendas for business meetings',
    tags: ['meeting', 'agenda', 'planning', 'business'],
    difficulty: 'beginner' as TemplateDifficulty,
    estimatedTime: '3 minutes',
    basePrompt: 'Create a meeting agenda for {{meeting_type}} with {{participants}}. Duration: {{duration}}. Main topics: {{topics}}.',
    variables: [
      { key: '{{meeting_type}}', label: 'Meeting Type', type: 'text', required: true, placeholder: 'Team standup' },
      { key: '{{participants}}', label: 'Participants', type: 'text', required: true, placeholder: 'Development team' },
      { key: '{{duration}}', label: 'Duration', type: 'select', required: true, options: ['15 min', '30 min', '1 hour', '2 hours'] },
      { key: '{{topics}}', label: 'Topics', type: 'text', required: true, placeholder: 'Sprint review, blockers' }
    ],
    examples: [],
    usageCount: 98,
    rating: 4.3,
    lastUpdated: new Date('2025-11-12'),
    createdAt: new Date('2025-10-18'),
    version: '1.0'
  },
  {
    id: 'project-proposal-001',
    category: 'business' as TemplateCategory,
    title: 'Project Proposal',
    description: 'Draft comprehensive project proposals',
    tags: ['proposal', 'project', 'planning', 'business'],
    difficulty: 'intermediate' as TemplateDifficulty,
    estimatedTime: '10 minutes',
    basePrompt: 'Create a project proposal for {{project_name}}. Objective: {{objective}}. Budget: {{budget}}. Timeline: {{timeline}}.',
    variables: [
      { key: '{{project_name}}', label: 'Project Name', type: 'text', required: true, placeholder: 'Mobile App Development' },
      { key: '{{objective}}', label: 'Objective', type: 'text', required: true, placeholder: 'Launch iOS/Android app' },
      { key: '{{budget}}', label: 'Budget', type: 'text', required: true, placeholder: '$50,000' },
      { key: '{{timeline}}', label: 'Timeline', type: 'text', required: true, placeholder: '6 months' }
    ],
    examples: [],
    usageCount: 67,
    rating: 4.7,
    lastUpdated: new Date('2025-11-10'),
    createdAt: new Date('2025-10-22'),
    version: '1.0'
  },

  // Technical Templates
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
      { key: '{{language}}', label: 'Programming Language', type: 'select', required: true, options: ['JavaScript', 'TypeScript', 'Python', 'Java'] },
      { key: '{{focus_areas}}', label: 'Focus Areas', type: 'text', required: true, placeholder: 'Performance, Security' },
      { key: '{{improvement_type}}', label: 'Improvement Type', type: 'text', required: true, placeholder: 'optimization, refactoring' }
    ],
    examples: [],
    usageCount: 89,
    rating: 4.8,
    lastUpdated: new Date('2025-11-10'),
    createdAt: new Date('2025-10-20'),
    version: '1.1'
  },
  {
    id: 'api-documentation-001',
    category: 'technical' as TemplateCategory,
    title: 'API Documentation',
    description: 'Create clear API endpoint documentation',
    tags: ['api', 'documentation', 'technical', 'backend'],
    difficulty: 'intermediate' as TemplateDifficulty,
    estimatedTime: '7 minutes',
    basePrompt: 'Document API endpoint {{endpoint}} that {{purpose}}. Method: {{method}}. Parameters: {{parameters}}.',
    variables: [
      { key: '{{endpoint}}', label: 'Endpoint', type: 'text', required: true, placeholder: '/api/users' },
      { key: '{{purpose}}', label: 'Purpose', type: 'text', required: true, placeholder: 'Creates a new user' },
      { key: '{{method}}', label: 'HTTP Method', type: 'select', required: true, options: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'] },
      { key: '{{parameters}}', label: 'Parameters', type: 'text', required: true, placeholder: 'name, email, role' }
    ],
    examples: [],
    usageCount: 76,
    rating: 4.6,
    lastUpdated: new Date('2025-11-14'),
    createdAt: new Date('2025-10-28'),
    version: '1.0'
  },
  {
    id: 'bug-report-001',
    category: 'technical' as TemplateCategory,
    title: 'Bug Report',
    description: 'Create detailed bug reports for development teams',
    tags: ['bug', 'issue', 'technical', 'qa'],
    difficulty: 'beginner' as TemplateDifficulty,
    estimatedTime: '4 minutes',
    basePrompt: 'Report bug: {{bug_description}}. Steps to reproduce: {{steps}}. Expected: {{expected}}. Actual: {{actual}}.',
    variables: [
      { key: '{{bug_description}}', label: 'Bug Description', type: 'text', required: true, placeholder: 'Login button not working' },
      { key: '{{steps}}', label: 'Steps to Reproduce', type: 'text', required: true, placeholder: '1. Navigate to login, 2. Click button' },
      { key: '{{expected}}', label: 'Expected Result', type: 'text', required: true, placeholder: 'User should be logged in' },
      { key: '{{actual}}', label: 'Actual Result', type: 'text', required: true, placeholder: 'Nothing happens' }
    ],
    examples: [],
    usageCount: 112,
    rating: 4.4,
    lastUpdated: new Date('2025-11-16'),
    createdAt: new Date('2025-11-01'),
    version: '1.0'
  },

  // Creative Templates
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
      { key: '{{topic}}', label: 'Blog Topic', type: 'text', required: true, placeholder: 'AI in modern business' },
      { key: '{{audience}}', label: 'Target Audience', type: 'text', required: true, placeholder: 'business professionals' },
      { key: '{{sections}}', label: 'Number of Sections', type: 'select', required: true, options: ['3', '5', '7', '10'] },
      { key: '{{word_count}}', label: 'Target Word Count', type: 'select', required: true, options: ['500', '1000', '1500', '2000'] }
    ],
    examples: [],
    usageCount: 203,
    rating: 4.6,
    lastUpdated: new Date('2025-11-15'),
    createdAt: new Date('2025-10-25'),
    version: '1.0'
  },
  {
    id: 'social-media-001',
    category: 'creative' as TemplateCategory,
    title: 'Social Media Post',
    description: 'Generate engaging social media content',
    tags: ['social', 'marketing', 'content', 'creative'],
    difficulty: 'beginner' as TemplateDifficulty,
    estimatedTime: '2 minutes',
    basePrompt: 'Create a {{platform}} post about {{topic}}. Tone: {{tone}}. Include {{hashtags}} relevant hashtags.',
    variables: [
      { key: '{{platform}}', label: 'Platform', type: 'select', required: true, options: ['LinkedIn', 'Twitter', 'Facebook', 'Instagram'] },
      { key: '{{topic}}', label: 'Topic', type: 'text', required: true, placeholder: 'Product launch announcement' },
      { key: '{{tone}}', label: 'Tone', type: 'select', required: true, options: ['professional', 'casual', 'enthusiastic', 'informative'] },
      { key: '{{hashtags}}', label: 'Number of Hashtags', type: 'select', required: true, options: ['3', '5', '10'] }
    ],
    examples: [],
    usageCount: 187,
    rating: 4.5,
    lastUpdated: new Date('2025-11-17'),
    createdAt: new Date('2025-11-05'),
    version: '1.0'
  },
  {
    id: 'storytelling-001',
    category: 'creative' as TemplateCategory,
    title: 'Brand Storytelling',
    description: 'Craft compelling brand narratives',
    tags: ['story', 'brand', 'narrative', 'creative'],
    difficulty: 'advanced' as TemplateDifficulty,
    estimatedTime: '15 minutes',
    basePrompt: 'Create a brand story for {{company}} in {{industry}}. Key values: {{values}}. Target emotion: {{emotion}}.',
    variables: [
      { key: '{{company}}', label: 'Company Name', type: 'text', required: true, placeholder: 'Alkholi Group' },
      { key: '{{industry}}', label: 'Industry', type: 'text', required: true, placeholder: 'Technology consulting' },
      { key: '{{values}}', label: 'Core Values', type: 'text', required: true, placeholder: 'Innovation, integrity, excellence' },
      { key: '{{emotion}}', label: 'Target Emotion', type: 'select', required: true, options: ['trust', 'excitement', 'inspiration', 'confidence'] }
    ],
    examples: [],
    usageCount: 54,
    rating: 4.9,
    lastUpdated: new Date('2025-11-11'),
    createdAt: new Date('2025-10-30'),
    version: '1.0'
  },

  // Analysis Templates
  {
    id: 'data-analysis-001',
    category: 'analysis' as TemplateCategory,
    title: 'Data Analysis Report',
    description: 'Generate insights from data analysis',
    tags: ['data', 'analysis', 'insights', 'reporting'],
    difficulty: 'intermediate' as TemplateDifficulty,
    estimatedTime: '8 minutes',
    basePrompt: 'Analyze {{data_type}} data for {{period}}. Focus on {{metrics}}. Identify {{insights_count}} key insights.',
    variables: [
      { key: '{{data_type}}', label: 'Data Type', type: 'text', required: true, placeholder: 'Sales performance' },
      { key: '{{period}}', label: 'Time Period', type: 'select', required: true, options: ['Last week', 'Last month', 'Last quarter', 'Last year'] },
      { key: '{{metrics}}', label: 'Key Metrics', type: 'text', required: true, placeholder: 'Revenue, conversion rate, customer acquisition' },
      { key: '{{insights_count}}', label: 'Number of Insights', type: 'select', required: true, options: ['3', '5', '7'] }
    ],
    examples: [],
    usageCount: 92,
    rating: 4.7,
    lastUpdated: new Date('2025-11-13'),
    createdAt: new Date('2025-10-27'),
    version: '1.0'
  },
  {
    id: 'competitor-analysis-001',
    category: 'analysis' as TemplateCategory,
    title: 'Competitor Analysis',
    description: 'Analyze competitor strategies and positioning',
    tags: ['competitor', 'analysis', 'market', 'strategy'],
    difficulty: 'advanced' as TemplateDifficulty,
    estimatedTime: '12 minutes',
    basePrompt: 'Analyze competitor {{competitor}} in {{market}}. Compare {{aspects}}. Identify opportunities.',
    variables: [
      { key: '{{competitor}}', label: 'Competitor Name', type: 'text', required: true, placeholder: 'Competitor Inc.' },
      { key: '{{market}}', label: 'Market/Industry', type: 'text', required: true, placeholder: 'SaaS solutions' },
      { key: '{{aspects}}', label: 'Comparison Aspects', type: 'text', required: true, placeholder: 'Pricing, features, marketing' }
    ],
    examples: [],
    usageCount: 73,
    rating: 4.8,
    lastUpdated: new Date('2025-11-09'),
    createdAt: new Date('2025-10-24'),
    version: '1.0'
  },

  // Communication Templates
  {
    id: 'presentation-outline-001',
    category: 'communication' as TemplateCategory,
    title: 'Presentation Outline',
    description: 'Structure engaging presentations',
    tags: ['presentation', 'slides', 'communication', 'public speaking'],
    difficulty: 'intermediate' as TemplateDifficulty,
    estimatedTime: '6 minutes',
    basePrompt: 'Create presentation outline for {{topic}}. Audience: {{audience}}. Duration: {{duration}}. Slides: {{slides}}.',
    variables: [
      { key: '{{topic}}', label: 'Presentation Topic', type: 'text', required: true, placeholder: 'Q4 Business Review' },
      { key: '{{audience}}', label: 'Audience', type: 'text', required: true, placeholder: 'Executive team' },
      { key: '{{duration}}', label: 'Duration', type: 'select', required: true, options: ['10 min', '20 min', '30 min', '60 min'] },
      { key: '{{slides}}', label: 'Number of Slides', type: 'select', required: true, options: ['5', '10', '15', '20'] }
    ],
    examples: [],
    usageCount: 118,
    rating: 4.6,
    lastUpdated: new Date('2025-11-14'),
    createdAt: new Date('2025-10-29'),
    version: '1.0'
  },
  {
    id: 'announcement-001',
    category: 'communication' as TemplateCategory,
    title: 'Company Announcement',
    description: 'Draft internal company announcements',
    tags: ['announcement', 'internal', 'communication', 'company'],
    difficulty: 'beginner' as TemplateDifficulty,
    estimatedTime: '4 minutes',
    basePrompt: 'Draft announcement about {{news}} for {{recipients}}. Tone: {{tone}}. Key details: {{details}}.',
    variables: [
      { key: '{{news}}', label: 'News/Update', type: 'text', required: true, placeholder: 'New office opening' },
      { key: '{{recipients}}', label: 'Recipients', type: 'text', required: true, placeholder: 'All employees' },
      { key: '{{tone}}', label: 'Tone', type: 'select', required: true, options: ['formal', 'casual', 'enthusiastic', 'neutral'] },
      { key: '{{details}}', label: 'Key Details', type: 'text', required: true, placeholder: 'Location, date, benefits' }
    ],
    examples: [],
    usageCount: 85,
    rating: 4.4,
    lastUpdated: new Date('2025-11-16'),
    createdAt: new Date('2025-11-02'),
    version: '1.0'
  },

  // Research Templates
  {
    id: 'research-summary-001',
    category: 'research' as TemplateCategory,
    title: 'Research Summary',
    description: 'Summarize research findings effectively',
    tags: ['research', 'summary', 'academic', 'analysis'],
    difficulty: 'intermediate' as TemplateDifficulty,
    estimatedTime: '10 minutes',
    basePrompt: 'Summarize research on {{topic}}. Key findings: {{findings}}. Methodology: {{methodology}}. Implications: {{implications}}.',
    variables: [
      { key: '{{topic}}', label: 'Research Topic', type: 'text', required: true, placeholder: 'AI in healthcare' },
      { key: '{{findings}}', label: 'Key Findings', type: 'text', required: true, placeholder: 'Improved diagnosis accuracy by 25%' },
      { key: '{{methodology}}', label: 'Methodology', type: 'text', required: true, placeholder: 'Quantitative analysis of 1000 cases' },
      { key: '{{implications}}', label: 'Implications', type: 'text', required: true, placeholder: 'Better patient outcomes' }
    ],
    examples: [],
    usageCount: 64,
    rating: 4.7,
    lastUpdated: new Date('2025-11-12'),
    createdAt: new Date('2025-10-26'),
    version: '1.0'
  },
  {
    id: 'literature-review-001',
    category: 'research' as TemplateCategory,
    title: 'Literature Review',
    description: 'Structure comprehensive literature reviews',
    tags: ['literature', 'review', 'research', 'academic'],
    difficulty: 'advanced' as TemplateDifficulty,
    estimatedTime: '20 minutes',
    basePrompt: 'Create literature review on {{topic}}. Sources: {{sources}}. Themes: {{themes}}. Research gap: {{gap}}.',
    variables: [
      { key: '{{topic}}', label: 'Research Topic', type: 'text', required: true, placeholder: 'Machine learning applications' },
      { key: '{{sources}}', label: 'Number of Sources', type: 'select', required: true, options: ['10', '20', '30', '50'] },
      { key: '{{themes}}', label: 'Key Themes', type: 'text', required: true, placeholder: 'Accuracy, efficiency, scalability' },
      { key: '{{gap}}', label: 'Research Gap', type: 'text', required: true, placeholder: 'Limited studies on small datasets' }
    ],
    examples: [],
    usageCount: 41,
    rating: 4.9,
    lastUpdated: new Date('2025-11-08'),
    createdAt: new Date('2025-10-21'),
    version: '1.0'
  },

  // Marketing Templates
  {
    id: 'email-campaign-001',
    category: 'marketing' as TemplateCategory,
    title: 'Email Marketing Campaign',
    description: 'Design effective email marketing campaigns',
    tags: ['email', 'marketing', 'campaign', 'promotion'],
    difficulty: 'intermediate' as TemplateDifficulty,
    estimatedTime: '8 minutes',
    basePrompt: 'Create email campaign for {{product}}. Goal: {{goal}}. Audience: {{audience}}. CTA: {{cta}}.',
    variables: [
      { key: '{{product}}', label: 'Product/Service', type: 'text', required: true, placeholder: 'Premium subscription' },
      { key: '{{goal}}', label: 'Campaign Goal', type: 'select', required: true, options: ['Conversions', 'Awareness', 'Engagement', 'Retention'] },
      { key: '{{audience}}', label: 'Target Audience', type: 'text', required: true, placeholder: 'Existing free users' },
      { key: '{{cta}}', label: 'Call to Action', type: 'text', required: true, placeholder: 'Upgrade now' }
    ],
    examples: [],
    usageCount: 94,
    rating: 4.5,
    lastUpdated: new Date('2025-11-15'),
    createdAt: new Date('2025-11-03'),
    version: '1.0'
  },
  {
    id: 'product-launch-001',
    category: 'marketing' as TemplateCategory,
    title: 'Product Launch Plan',
    description: 'Plan comprehensive product launch strategies',
    tags: ['product', 'launch', 'marketing', 'strategy'],
    difficulty: 'advanced' as TemplateDifficulty,
    estimatedTime: '15 minutes',
    basePrompt: 'Plan launch for {{product}} targeting {{market}}. Budget: {{budget}}. Timeline: {{timeline}}. Channels: {{channels}}.',
    variables: [
      { key: '{{product}}', label: 'Product Name', type: 'text', required: true, placeholder: 'AI Prompt Assistant' },
      { key: '{{market}}', label: 'Target Market', type: 'text', required: true, placeholder: 'Small businesses' },
      { key: '{{budget}}', label: 'Budget', type: 'text', required: true, placeholder: '$10,000' },
      { key: '{{timeline}}', label: 'Timeline', type: 'select', required: true, options: ['1 month', '3 months', '6 months'] },
      { key: '{{channels}}', label: 'Marketing Channels', type: 'text', required: true, placeholder: 'Social media, email, content' }
    ],
    examples: [],
    usageCount: 56,
    rating: 4.8,
    lastUpdated: new Date('2025-11-10'),
    createdAt: new Date('2025-10-23'),
    version: '1.0'
  },

  // HR Templates
  {
    id: 'job-description-001',
    category: 'hr' as TemplateCategory,
    title: 'Job Description',
    description: 'Write clear and compelling job descriptions',
    tags: ['hr', 'recruitment', 'hiring', 'job'],
    difficulty: 'beginner' as TemplateDifficulty,
    estimatedTime: '5 minutes',
    basePrompt: 'Create job description for {{role}} at {{company}}. Experience: {{experience}}. Key skills: {{skills}}.',
    variables: [
      { key: '{{role}}', label: 'Job Role', type: 'text', required: true, placeholder: 'Senior Software Engineer' },
      { key: '{{company}}', label: 'Company Name', type: 'text', required: true, placeholder: 'Alkholi Group' },
      { key: '{{experience}}', label: 'Experience Level', type: 'select', required: true, options: ['Entry level', '2-3 years', '5+ years', '10+ years'] },
      { key: '{{skills}}', label: 'Key Skills', type: 'text', required: true, placeholder: 'React, Node.js, TypeScript' }
    ],
    examples: [],
    usageCount: 107,
    rating: 4.5,
    lastUpdated: new Date('2025-11-14'),
    createdAt: new Date('2025-10-31'),
    version: '1.0'
  },
  {
    id: 'performance-review-001',
    category: 'hr' as TemplateCategory,
    title: 'Performance Review',
    description: 'Structure constructive performance reviews',
    tags: ['hr', 'review', 'performance', 'feedback'],
    difficulty: 'intermediate' as TemplateDifficulty,
    estimatedTime: '10 minutes',
    basePrompt: 'Write performance review for {{employee}} in {{role}}. Period: {{period}}. Achievements: {{achievements}}. Areas for improvement: {{improvements}}.',
    variables: [
      { key: '{{employee}}', label: 'Employee Name', type: 'text', required: true, placeholder: 'John Doe' },
      { key: '{{role}}', label: 'Job Role', type: 'text', required: true, placeholder: 'Marketing Manager' },
      { key: '{{period}}', label: 'Review Period', type: 'select', required: true, options: ['Q1', 'Q2', 'Q3', 'Q4', 'Annual'] },
      { key: '{{achievements}}', label: 'Key Achievements', type: 'text', required: true, placeholder: 'Led successful campaign' },
      { key: '{{improvements}}', label: 'Improvement Areas', type: 'text', required: true, placeholder: 'Time management' }
    ],
    examples: [],
    usageCount: 79,
    rating: 4.6,
    lastUpdated: new Date('2025-11-11'),
    createdAt: new Date('2025-10-28'),
    version: '1.0'
  },

  // Sales Templates
  {
    id: 'sales-pitch-001',
    category: 'sales' as TemplateCategory,
    title: 'Sales Pitch',
    description: 'Craft persuasive sales pitches',
    tags: ['sales', 'pitch', 'presentation', 'persuasion'],
    difficulty: 'intermediate' as TemplateDifficulty,
    estimatedTime: '7 minutes',
    basePrompt: 'Create sales pitch for {{product}} to {{prospect}}. Pain points: {{pain_points}}. Value proposition: {{value}}.',
    variables: [
      { key: '{{product}}', label: 'Product/Service', type: 'text', required: true, placeholder: 'CRM software' },
      { key: '{{prospect}}', label: 'Prospect Type', type: 'text', required: true, placeholder: 'Mid-size businesses' },
      { key: '{{pain_points}}', label: 'Pain Points', type: 'text', required: true, placeholder: 'Disorganized customer data' },
      { key: '{{value}}', label: 'Value Proposition', type: 'text', required: true, placeholder: 'Increase sales by 30%' }
    ],
    examples: [],
    usageCount: 101,
    rating: 4.7,
    lastUpdated: new Date('2025-11-13'),
    createdAt: new Date('2025-11-01'),
    version: '1.0'
  },
  {
    id: 'proposal-template-001',
    category: 'sales' as TemplateCategory,
    title: 'Sales Proposal',
    description: 'Write winning sales proposals',
    tags: ['sales', 'proposal', 'business', 'deal'],
    difficulty: 'advanced' as TemplateDifficulty,
    estimatedTime: '12 minutes',
    basePrompt: 'Draft sales proposal for {{client}} for {{solution}}. Investment: {{price}}. ROI: {{roi}}. Timeline: {{timeline}}.',
    variables: [
      { key: '{{client}}', label: 'Client Name', type: 'text', required: true, placeholder: 'ABC Corporation' },
      { key: '{{solution}}', label: 'Solution', type: 'text', required: true, placeholder: 'Enterprise software package' },
      { key: '{{price}}', label: 'Investment', type: 'text', required: true, placeholder: '$50,000' },
      { key: '{{roi}}', label: 'Expected ROI', type: 'text', required: true, placeholder: '200% in first year' },
      { key: '{{timeline}}', label: 'Implementation Timeline', type: 'text', required: true, placeholder: '3 months' }
    ],
    examples: [],
    usageCount: 68,
    rating: 4.8,
    lastUpdated: new Date('2025-11-09'),
    createdAt: new Date('2025-10-25'),
    version: '1.0'
  },

  // Customer Service Templates
  {
    id: 'support-response-001',
    category: 'customer_service' as TemplateCategory,
    title: 'Customer Support Response',
    description: 'Respond to customer inquiries professionally',
    tags: ['support', 'customer', 'service', 'response'],
    difficulty: 'beginner' as TemplateDifficulty,
    estimatedTime: '3 minutes',
    basePrompt: 'Respond to customer {{issue}} with {{tone}}. Solution: {{solution}}. Follow-up: {{followup}}.',
    variables: [
      { key: '{{issue}}', label: 'Customer Issue', type: 'text', required: true, placeholder: 'Cannot access account' },
      { key: '{{tone}}', label: 'Response Tone', type: 'select', required: true, options: ['empathetic', 'professional', 'friendly', 'apologetic'] },
      { key: '{{solution}}', label: 'Solution Provided', type: 'text', required: true, placeholder: 'Reset password link sent' },
      { key: '{{followup}}', label: 'Follow-up Action', type: 'text', required: true, placeholder: 'Check back in 24 hours' }
    ],
    examples: [],
    usageCount: 156,
    rating: 4.6,
    lastUpdated: new Date('2025-11-17'),
    createdAt: new Date('2025-11-06'),
    version: '1.0'
  },
  {
    id: 'feedback-request-001',
    category: 'customer_service' as TemplateCategory,
    title: 'Customer Feedback Request',
    description: 'Request customer feedback effectively',
    tags: ['feedback', 'survey', 'customer', 'satisfaction'],
    difficulty: 'beginner' as TemplateDifficulty,
    estimatedTime: '4 minutes',
    basePrompt: 'Request feedback from {{customer}} about {{interaction}}. Incentive: {{incentive}}. Survey type: {{survey_type}}.',
    variables: [
      { key: '{{customer}}', label: 'Customer Segment', type: 'text', required: true, placeholder: 'Recent purchasers' },
      { key: '{{interaction}}', label: 'Interaction Type', type: 'select', required: true, options: ['Purchase', 'Support call', 'Product use', 'Service experience'] },
      { key: '{{incentive}}', label: 'Incentive', type: 'text', required: true, placeholder: '10% discount code' },
      { key: '{{survey_type}}', label: 'Survey Type', type: 'select', required: true, options: ['Quick poll', 'Detailed survey', 'NPS', 'Rating'] }
    ],
    examples: [],
    usageCount: 88,
    rating: 4.4,
    lastUpdated: new Date('2025-11-15'),
    createdAt: new Date('2025-11-04'),
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
