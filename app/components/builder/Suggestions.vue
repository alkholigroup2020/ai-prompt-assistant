<script setup lang="ts">
interface Suggestion {
  id: string
  type: 'critical' | 'important' | 'minor'
  category: 'clarity' | 'specificity' | 'context' | 'structure' | 'completeness'
  message: string
  action?: {
    label: string
    field: string
    value: string
  }
}

interface Props {
  suggestions: Suggestion[]
  allowApply?: boolean
  allowDismiss?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  allowApply: true,
  allowDismiss: true,
})

const emit = defineEmits<{
  apply: [suggestion: Suggestion]
  dismiss: [suggestionId: string]
}>()

const { t } = useI18n()

// Local state for dismissed suggestions
const dismissedIds = ref<Set<string>>(new Set())

// Filter out dismissed suggestions
const visibleSuggestions = computed(() => {
  return props.suggestions.filter((s) => !dismissedIds.value.has(s.id))
})

// Group suggestions by priority
const groupedSuggestions = computed(() => {
  const critical = visibleSuggestions.value.filter((s) => s.type === 'critical')
  const important = visibleSuggestions.value.filter((s) => s.type === 'important')
  const minor = visibleSuggestions.value.filter((s) => s.type === 'minor')

  return { critical, important, minor }
})

// Get icon based on suggestion type
const getIcon = (type: Suggestion['type']): string => {
  switch (type) {
    case 'critical':
      return 'i-heroicons-exclamation-triangle'
    case 'important':
      return 'i-heroicons-exclamation-circle'
    case 'minor':
      return 'i-heroicons-information-circle'
  }
}

// Get color classes based on suggestion type
const getTypeColor = (type: Suggestion['type']) => {
  switch (type) {
    case 'critical':
      return {
        bg: 'bg-red-50 dark:bg-red-950',
        border: 'border-red-200 dark:border-red-900',
        icon: 'text-red-600 dark:text-red-400',
        text: 'text-red-900 dark:text-red-100',
      }
    case 'important':
      return {
        bg: 'bg-yellow-50 dark:bg-yellow-950',
        border: 'border-yellow-200 dark:border-yellow-900',
        icon: 'text-yellow-600 dark:text-yellow-400',
        text: 'text-yellow-900 dark:text-yellow-100',
      }
    case 'minor':
      return {
        bg: 'bg-blue-50 dark:bg-blue-950',
        border: 'border-blue-200 dark:border-blue-900',
        icon: 'text-blue-600 dark:text-blue-400',
        text: 'text-blue-900 dark:text-blue-100',
      }
  }
}

// Get category icon
const getCategoryIcon = (category: Suggestion['category']): string => {
  switch (category) {
    case 'clarity':
      return 'i-heroicons-light-bulb'
    case 'specificity':
      return 'i-heroicons-magnifying-glass'
    case 'context':
      return 'i-heroicons-document-text'
    case 'structure':
      return 'i-heroicons-squares-2x2'
    case 'completeness':
      return 'i-heroicons-check-circle'
  }
}

// Handle applying a suggestion
const applySuggestion = (suggestion: Suggestion) => {
  if (props.allowApply && suggestion.action) {
    emit('apply', suggestion)
    dismissSuggestion(suggestion.id)
  }
}

// Handle dismissing a suggestion
const dismissSuggestion = (id: string) => {
  if (props.allowDismiss) {
    dismissedIds.value.add(id)
    emit('dismiss', id)
  }
}

// Count of visible suggestions
const totalCount = computed(() => visibleSuggestions.value.length)
</script>

<template>
  <div class="space-y-4">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-2">
        <UIcon name="i-heroicons-sparkles" class="h-5 w-5 text-emerald-500" />
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
          {{ t('quality.suggestions.title') }}
        </h3>
        <UBadge v-if="totalCount > 0" color="emerald" variant="soft">
          {{ totalCount }}
        </UBadge>
      </div>
    </div>

    <!-- Empty State -->
    <div
      v-if="totalCount === 0"
      class="rounded-lg border border-emerald-200 bg-emerald-50 p-6 text-center dark:border-emerald-900 dark:bg-emerald-950"
    >
      <UIcon
        name="i-heroicons-check-badge"
        class="mx-auto mb-2 h-12 w-12 text-emerald-500"
      />
      <p class="text-sm font-medium text-emerald-900 dark:text-emerald-100">
        {{ t('quality.suggestions.noSuggestions') }}
      </p>
      <p class="mt-1 text-xs text-emerald-700 dark:text-emerald-300">
        {{ t('quality.suggestions.noSuggestionsDesc') }}
      </p>
    </div>

    <!-- Critical Suggestions -->
    <div v-if="groupedSuggestions.critical.length > 0" class="space-y-2">
      <h4 class="text-xs font-semibold uppercase tracking-wider text-red-600 dark:text-red-400">
        {{ t('quality.suggestions.critical') }}
      </h4>
      <div
        v-for="suggestion in groupedSuggestions.critical"
        :key="suggestion.id"
        :class="[
          getTypeColor(suggestion.type).bg,
          getTypeColor(suggestion.type).border,
        ]"
        class="rounded-lg border p-3 transition-all hover:shadow-md"
      >
        <div class="flex items-start gap-3">
          <!-- Type Icon -->
          <UIcon
            :name="getIcon(suggestion.type)"
            :class="getTypeColor(suggestion.type).icon"
            class="h-5 w-5 flex-shrink-0"
          />

          <!-- Content -->
          <div class="flex-1">
            <div class="flex items-center gap-2">
              <UIcon
                :name="getCategoryIcon(suggestion.category)"
                class="h-4 w-4"
                :class="getTypeColor(suggestion.type).icon"
              />
              <p
                :class="getTypeColor(suggestion.type).text"
                class="text-sm font-medium"
              >
                {{ suggestion.message }}
              </p>
            </div>

            <!-- Action Button -->
            <div v-if="suggestion.action && allowApply" class="mt-2">
              <UButton
                size="xs"
                color="neutral"
                @click="applySuggestion(suggestion)"
              >
                {{ suggestion.action.label }}
              </UButton>
            </div>
          </div>

          <!-- Dismiss Button -->
          <UButton
            v-if="allowDismiss"
            icon="i-heroicons-x-mark"
            color="neutral"
            variant="ghost"
            size="xs"
            @click="dismissSuggestion(suggestion.id)"
          />
        </div>
      </div>
    </div>

    <!-- Important Suggestions -->
    <div v-if="groupedSuggestions.important.length > 0" class="space-y-2">
      <h4 class="text-xs font-semibold uppercase tracking-wider text-yellow-600 dark:text-yellow-400">
        {{ t('quality.suggestions.important') }}
      </h4>
      <div
        v-for="suggestion in groupedSuggestions.important"
        :key="suggestion.id"
        :class="[
          getTypeColor(suggestion.type).bg,
          getTypeColor(suggestion.type).border,
        ]"
        class="rounded-lg border p-3 transition-all hover:shadow-md"
      >
        <div class="flex items-start gap-3">
          <UIcon
            :name="getIcon(suggestion.type)"
            :class="getTypeColor(suggestion.type).icon"
            class="h-5 w-5 flex-shrink-0"
          />

          <div class="flex-1">
            <div class="flex items-center gap-2">
              <UIcon
                :name="getCategoryIcon(suggestion.category)"
                class="h-4 w-4"
                :class="getTypeColor(suggestion.type).icon"
              />
              <p
                :class="getTypeColor(suggestion.type).text"
                class="text-sm font-medium"
              >
                {{ suggestion.message }}
              </p>
            </div>

            <div v-if="suggestion.action && allowApply" class="mt-2">
              <UButton
                size="xs"
                color="neutral"
                @click="applySuggestion(suggestion)"
              >
                {{ suggestion.action.label }}
              </UButton>
            </div>
          </div>

          <UButton
            v-if="allowDismiss"
            icon="i-heroicons-x-mark"
            color="neutral"
            variant="ghost"
            size="xs"
            @click="dismissSuggestion(suggestion.id)"
          />
        </div>
      </div>
    </div>

    <!-- Minor Suggestions -->
    <div v-if="groupedSuggestions.minor.length > 0" class="space-y-2">
      <h4 class="text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400">
        {{ t('quality.suggestions.minor') }}
      </h4>
      <div
        v-for="suggestion in groupedSuggestions.minor"
        :key="suggestion.id"
        :class="[
          getTypeColor(suggestion.type).bg,
          getTypeColor(suggestion.type).border,
        ]"
        class="rounded-lg border p-3 transition-all hover:shadow-md"
      >
        <div class="flex items-start gap-3">
          <UIcon
            :name="getIcon(suggestion.type)"
            :class="getTypeColor(suggestion.type).icon"
            class="h-5 w-5 flex-shrink-0"
          />

          <div class="flex-1">
            <div class="flex items-center gap-2">
              <UIcon
                :name="getCategoryIcon(suggestion.category)"
                class="h-4 w-4"
                :class="getTypeColor(suggestion.type).icon"
              />
              <p
                :class="getTypeColor(suggestion.type).text"
                class="text-sm font-medium"
              >
                {{ suggestion.message }}
              </p>
            </div>

            <div v-if="suggestion.action && allowApply" class="mt-2">
              <UButton
                size="xs"
                color="neutral"
                @click="applySuggestion(suggestion)"
              >
                {{ suggestion.action.label }}
              </UButton>
            </div>
          </div>

          <UButton
            v-if="allowDismiss"
            icon="i-heroicons-x-mark"
            color="neutral"
            variant="ghost"
            size="xs"
            @click="dismissSuggestion(suggestion.id)"
          />
        </div>
      </div>
    </div>
  </div>
</template>
