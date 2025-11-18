<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <div class="container mx-auto px-4 py-8 max-w-7xl">
      <!-- Page Header -->
      <div class="mb-8">
        <h1 class="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3">
          {{ $t('templates.title') }}
        </h1>
        <p class="text-lg text-gray-600 dark:text-gray-400">
          {{ $t('templates.description') }}
        </p>
      </div>

      <!-- Template Grid Component -->
      <TemplateGrid
        :templates="templates"
        :loading="loading"
        :page-size="12"
        @use-template="handleUseTemplate"
        @view-details="handleViewDetails"
        @template-click="handleTemplateClick"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useTemplates } from '~/composables/useTemplates';
import { useToast } from '#ui/composables/useToast';
import type { PromptTemplate } from '~/types/template';

// SEO Meta Tags
useHead({
  title: 'Templates - AI Prompt Assistant',
  meta: [
    {
      name: 'description',
      content: 'Browse our collection of 20+ ready-to-use AI prompt templates. Find templates for business, technical writing, creative content, data analysis, and more.',
    },
    {
      name: 'keywords',
      content: 'AI prompt templates, ChatGPT templates, Claude templates, prompt library, business templates, technical templates',
    },
    // Open Graph
    { property: 'og:title', content: 'Templates - AI Prompt Assistant' },
    {
      property: 'og:description',
      content: 'Browse our collection of 20+ ready-to-use AI prompt templates for any use case.',
    },
    { property: 'og:type', content: 'website' },
    // Twitter Card
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: 'Templates - AI Prompt Assistant' },
    {
      name: 'twitter:description',
      content: 'Browse our collection of 20+ ready-to-use AI prompt templates.',
    },
  ],
});

const router = useRouter();
const toast = useToast();
const { state, fetchTemplates } = useTemplates();

// Template state
const templates = computed(() => state.templates);
const loading = computed(() => state.loading);

// Load templates on mount
onMounted(async () => {
  try {
    await fetchTemplates();
  } catch {
    toast.add({
      title: 'Error',
      description: 'Failed to load templates. Please try again.',
      color: 'primary',
    });
  }
});

/**
 * Handle use template - Apply template to form and navigate to builder
 */
const handleUseTemplate = async (template: PromptTemplate) => {
  try {
    // Navigate to template detail page for customization
    await router.push(`/templates/${template.id}`);
  } catch {
    toast.add({
      title: 'Error',
      description: 'Failed to load template. Please try again.',
      color: 'primary',
    });
  }
};

/**
 * Handle view details - Navigate to template detail page
 */
const handleViewDetails = async (template: PromptTemplate) => {
  try {
    await router.push(`/templates/${template.id}`);
  } catch {
    toast.add({
      title: 'Error',
      description: 'Failed to load template details. Please try again.',
      color: 'primary',
    });
  }
};

/**
 * Handle template click - Navigate to detail page
 */
const handleTemplateClick = async (template: PromptTemplate) => {
  await handleViewDetails(template);
};
</script>
