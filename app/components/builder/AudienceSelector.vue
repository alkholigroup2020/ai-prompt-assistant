<template>
  <div class="space-y-3">
    <UFormField
      :label="$t('builder.audience.label')"
      :help="!validationError ? $t('builder.audience.helpText') : undefined"
      :error="validationError"
      required
    >
      <USelectMenu
        v-model="selectedAudience"
        :items="audienceItems"
        :placeholder="$t('builder.audience.placeholder')"
        :icon="selectedAudience?.icon ?? 'i-heroicons-users'"
        :search-input="{ placeholder: $t('builder.audience.placeholder') }"
        size="lg"
        class="w-full"
        :ui="{
          base: 'ps-14',
          trailingIcon: 'group-data-[state=open]:rotate-180 transition-transform duration-200',
          leadingIcon: 'text-emerald-500',
        }"
        @update:model-value="handleAudienceChange"
      />
    </UFormField>

    <!-- Other Audience Input (shown when "Other" is selected) -->
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0 -translate-y-1"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-1"
    >
      <div v-if="isOtherSelected" class="pl-1">
        <UFormField
          :label="$t('builder.audience.otherLabel')"
          :help="$t('builder.audience.otherHelp')"
        >
          <UInput
            v-model="otherAudienceValue"
            :placeholder="$t('builder.audience.otherPlaceholder')"
            size="lg"
            class="w-full"
            leading-icon="i-heroicons-pencil-square"
            :ui="{ base: 'ps-14', leadingIcon: 'text-emerald-500' }"
            @input="handleOtherAudienceChange"
          />
        </UFormField>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useFormStore } from '~/stores/form'
import { useI18n } from 'vue-i18n'

interface AudienceItem {
  label: string
  value: string
  icon: string
}

const { t } = useI18n()
const formStore = useFormStore()

// Audience items with icons (for USelectMenu)
const audienceItems = computed<AudienceItem[]>(() => [
  {
    label: t('builder.audience.options.technicalTeam.label'),
    value: 'technical-team',
    icon: 'i-heroicons-cpu-chip',
  },
  {
    label: t('builder.audience.options.executives.label'),
    value: 'executives',
    icon: 'i-heroicons-building-office',
  },
  {
    label: t('builder.audience.options.clients.label'),
    value: 'clients',
    icon: 'i-heroicons-users',
  },
  {
    label: t('builder.audience.options.generalPublic.label'),
    value: 'general-public',
    icon: 'i-heroicons-globe-alt',
  },
  {
    label: t('builder.audience.options.students.label'),
    value: 'students',
    icon: 'i-heroicons-academic-cap',
  },
  {
    label: t('builder.audience.options.experts.label'),
    value: 'experts',
    icon: 'i-heroicons-star',
  },
  {
    label: t('builder.audience.options.beginners.label'),
    value: 'beginners',
    icon: 'i-heroicons-light-bulb',
  },
  {
    label: t('builder.audience.options.stakeholders.label'),
    value: 'stakeholders',
    icon: 'i-heroicons-briefcase',
  },
  {
    label: t('builder.audience.options.teamMembers.label'),
    value: 'team-members',
    icon: 'i-heroicons-user-group',
  },
  {
    label: t('builder.audience.options.other.label'),
    value: 'other',
    icon: 'i-heroicons-ellipsis-horizontal-circle',
  },
])

// Selected audience (full object for USelectMenu)
const selectedAudience = ref<AudienceItem | undefined>(undefined)
const otherAudienceValue = ref('')

// Check if "Other" is selected
const isOtherSelected = computed(() => selectedAudience.value?.value === 'other')

// Validation error from store
const validationError = computed(() => formStore.validationErrors.audience)

// Initialize from store
watch(
  () => formStore.formData.audience,
  (newAudience) => {
    if (newAudience && (!selectedAudience.value || selectedAudience.value.value !== newAudience)) {
      const item = audienceItems.value.find((opt) => opt.value === newAudience)
      if (item) {
        selectedAudience.value = item
      }
    }
  },
  { immediate: true }
)

watch(
  () => formStore.formData.audienceOther,
  (newAudienceOther) => {
    if (newAudienceOther && !otherAudienceValue.value) {
      otherAudienceValue.value = newAudienceOther
    }
  },
  { immediate: true }
)

// Handle audience change
const handleAudienceChange = (value: AudienceItem | undefined) => {
  if (value) {
    if (value.value === 'other') {
      formStore.updateField('audience', 'other')
      formStore.updateField('audienceOther', otherAudienceValue.value)
    } else {
      formStore.updateField('audience', value.value)
      formStore.updateField('audienceOther', undefined)
      otherAudienceValue.value = ''
    }
    formStore.validateField('audience')
  }
}

// Handle other audience input
const handleOtherAudienceChange = () => {
  formStore.updateField('audienceOther', otherAudienceValue.value)
  formStore.validateField('audience')
}
</script>
