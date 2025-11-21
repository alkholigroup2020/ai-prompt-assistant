<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <div class="container mx-auto px-4 py-8 max-w-7xl">
      <!-- Loading State -->
      <div v-if="loading" class="flex items-center justify-center py-16">
        <div class="text-center">
          <UIcon name="i-heroicons-arrow-path" class="w-12 h-12 text-emerald-500 animate-spin mx-auto mb-4" />
          <p class="text-gray-600 dark:text-gray-400">{{ $t('templates.grid.loading') }}</p>
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="flex flex-col items-center justify-center py-16 text-center">
        <UIcon name="i-heroicons-exclamation-triangle" class="w-16 h-16 text-red-500 mb-4" />
        <h2 class="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
          {{ $t('common.error') }}
        </h2>
        <p class="text-gray-600 dark:text-gray-400 mb-6">
          Failed to load template. The template may not exist or there was a server error.
        </p>
        <div class="flex gap-3">
          <UButton color="neutral" variant="outline" @click="router.push(localePath('/templates'))">
            <UIcon name="i-heroicons-arrow-left" class="w-5 h-5" />
            {{ $t('templates.detail.backToGallery') }}
          </UButton>
          <UButton color="emerald" variant="solid" @click="loadTemplate">
            <UIcon name="i-heroicons-arrow-path" class="w-5 h-5" />
            {{ $t('common.retry') || 'Try Again' }}
          </UButton>
        </div>
      </div>

      <!-- Template Detail - Lazy Loaded -->
      <ClientOnly>
        <LazyTemplatesTemplateDetail
          v-if="template"
          :template="template"
          @apply="handleApplyTemplate"
          @back="handleBack"
        />
        <template #fallback>
          <!-- Loading skeleton -->
          <div class="animate-pulse space-y-6">
            <div class="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
            <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full" />
            <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6" />
            <div class="h-64 bg-gray-200 dark:bg-gray-700 rounded" />
          </div>
        </template>
      </ClientOnly>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useTemplates } from '~/composables/useTemplates';
import { useFormStore } from '~/stores/form';
import { useToast } from '#ui/composables/useToast';
import type { PromptTemplate } from '~/types/template';
import { ToneOption } from '~/types/form';

const route = useRoute();
const router = useRouter();
const localePath = useLocalePath();
const toast = useToast();
const formStore = useFormStore();
const { state, fetchTemplate } = useTemplates();

// Template state (cast to writable type for component compatibility)
const template = computed<PromptTemplate | null>(() =>
  state.currentTemplate ? (state.currentTemplate as unknown as PromptTemplate) : null
);
const loading = computed(() => state.loading);
const error = ref<boolean>(false);

// SEO Meta Tags (dynamic based on template)
useHead(() => ({
  title: template.value
    ? `${template.value.title} - Template | AI Prompt Assistant`
    : 'Template Details - AI Prompt Assistant',
  meta: [
    {
      name: 'description',
      content: template.value?.description || 'View and customize this AI prompt template',
    },
    {
      name: 'keywords',
      content: template.value?.tags.join(', ') || 'AI prompt template',
    },
    // Open Graph
    {
      property: 'og:title',
      content: template.value
        ? `${template.value.title} - Template`
        : 'Template Details',
    },
    {
      property: 'og:description',
      content: template.value?.description || 'AI prompt template details',
    },
    { property: 'og:type', content: 'article' },
    // Twitter Card
    { name: 'twitter:card', content: 'summary' },
    {
      name: 'twitter:title',
      content: template.value?.title || 'Template Details',
    },
    {
      name: 'twitter:description',
      content: template.value?.description || 'AI prompt template',
    },
  ],
}));

/**
 * Load template by ID
 */
const loadTemplate = async (): Promise<void> => {
  const templateId = route.params.id as string;

  if (!templateId) {
    error.value = true;
    return;
  }

  try {
    error.value = false;
    await fetchTemplate(templateId);

    // Check if template was loaded
    if (!template.value) {
      error.value = true;
    }
  } catch (err) {
    console.error('Failed to load template:', err);
    error.value = true;
  }
};

// Load template on mount
onMounted(() => {
  loadTemplate();
});

/**
 * Handle apply template - Fill form with template values and navigate to builder
 */
const handleApplyTemplate = async (
  appliedTemplate: PromptTemplate,
  variables: Record<string, string>
): Promise<void> => {
  try {
    // Generate the final prompt by replacing variables in the base prompt
    let finalPrompt = appliedTemplate.basePrompt;

    // Replace all variables with their values
    Object.entries(variables).forEach(([key, value]) => {
      const regex = new RegExp(`{{${key}}}`, 'g');
      finalPrompt = finalPrompt.replace(regex, value);
    });

    // Update form store with the generated prompt as the task
    formStore.updateField('task', finalPrompt);

    // Optionally set other fields based on template metadata
    if (appliedTemplate.category === 'business') {
      formStore.updateField('tone', ToneOption.PROFESSIONAL);
    } else if (appliedTemplate.category === 'creative') {
      formStore.updateField('tone', ToneOption.CREATIVE);
    } else if (appliedTemplate.category === 'technical') {
      formStore.updateField('tone', ToneOption.TECHNICAL);
    }

    // Show success message
    toast.add({
      title: 'Template Applied',
      description: `${appliedTemplate.title} has been applied to the prompt builder.`,
      color: 'emerald',
    });

    // Navigate to builder page
    await router.push(localePath('/builder'));
  } catch (err) {
    console.error('Failed to apply template:', err);
    toast.add({
      title: 'Error',
      description: 'Failed to apply template. Please try again.',
      color: 'primary',
    });
  }
};

/**
 * Handle back button - Navigate to templates page
 */
const handleBack = async (): Promise<void> => {
  await router.push(localePath('/templates'));
};
</script>
