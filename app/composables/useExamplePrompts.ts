/**
 * Composable for dynamic example prompts based on role-audience selection
 * Provides filtered examples and visibility state based on form selections
 */

import { computed, type ComputedRef } from 'vue'
import { useFormStore } from '~/stores/form'
import { useI18n } from 'vue-i18n'
import { examplesMatrix, VALID_ROLES, VALID_AUDIENCES } from '~/data/examples-matrix'
import type { RoleId, AudienceId, ExampleItem } from '~/types/examples'

interface UseExamplePromptsReturn {
  /** Whether examples section should be visible */
  showExamples: ComputedRef<boolean>
  /** Current examples to display based on role/audience selection */
  currentExamples: ComputedRef<ExampleItem[]>
  /** Whether role is selected and valid (not 'other') */
  hasValidRole: ComputedRef<boolean>
  /** Whether audience is selected and valid (not 'other') */
  hasValidAudience: ComputedRef<boolean>
  /** Total count of available examples */
  examplesCount: ComputedRef<number>
}

/**
 * Hook for managing dynamic example prompts
 *
 * Selection Logic:
 * - Both role AND audience selected: Show 5 specific examples for that combination
 * - Only role selected: Show 5 sampled examples (1 from each audience)
 * - Only audience selected: Show 5 sampled examples (1 from each role)
 * - Neither selected: Hide examples section
 * - Either set to 'other': Hide examples section
 */
export function useExamplePrompts(): UseExamplePromptsReturn {
  const formStore = useFormStore()
  const { t } = useI18n()

  // Check if role is valid (selected and not 'other')
  const hasValidRole = computed(() => {
    const role = formStore.formData.role
    return !!role && role !== 'other' && VALID_ROLES.includes(role as RoleId)
  })

  // Check if audience is valid (selected and not 'other')
  const hasValidAudience = computed(() => {
    const audience = formStore.formData.audience
    return !!audience && audience !== 'other' && VALID_AUDIENCES.includes(audience as AudienceId)
  })

  // Hide examples when either field is 'other' or neither is selected
  const showExamples = computed(() => {
    const role = formStore.formData.role
    const audience = formStore.formData.audience

    // Hide if either is explicitly set to 'other'
    if (role === 'other' || audience === 'other') {
      return false
    }

    // Show if at least one valid selection exists
    return hasValidRole.value || hasValidAudience.value
  })

  // Get current examples based on selection state
  const currentExamples = computed<ExampleItem[]>(() => {
    const role = formStore.formData.role as RoleId
    const audience = formStore.formData.audience as AudienceId

    // CASE 1: Both role AND audience selected - Show specific 5 examples
    if (hasValidRole.value && hasValidAudience.value) {
      const examples = examplesMatrix[role]?.[audience] || []
      return examples.map((example) => ({
        id: example.id,
        label: t(example.translationKey),
        value: example.id,
        icon: example.icon,
      }))
    }

    // CASE 2: Only role selected - Sample 1 example from each audience (up to 5)
    if (hasValidRole.value && !hasValidAudience.value) {
      const roleExamples = examplesMatrix[role]
      if (!roleExamples) return []

      const collected: ExampleItem[] = []
      for (const aud of VALID_AUDIENCES) {
        const example = roleExamples[aud]?.[0]
        if (example && collected.length < 5) {
          collected.push({
            id: example.id,
            label: t(example.translationKey),
            value: example.id,
            icon: example.icon,
          })
        }
      }
      return collected
    }

    // CASE 3: Only audience selected - Sample 1 example from each role (up to 5)
    if (!hasValidRole.value && hasValidAudience.value) {
      const collected: ExampleItem[] = []
      for (const r of VALID_ROLES) {
        const example = examplesMatrix[r]?.[audience]?.[0]
        if (example && collected.length < 5) {
          collected.push({
            id: example.id,
            label: t(example.translationKey),
            value: example.id,
            icon: example.icon,
          })
        }
      }
      return collected
    }

    // CASE 4: Neither selected
    return []
  })

  const examplesCount = computed(() => currentExamples.value.length)

  return {
    showExamples,
    currentExamples,
    hasValidRole,
    hasValidAudience,
    examplesCount,
  }
}
