<template>
  <div class="space-y-3">
    <UFormField
      :label="$t('builder.role.label')"
      :help="!validationError ? $t('builder.role.helpText') : undefined"
      :error="validationError"
      required
      :ui="{
        label: isFieldEmpty && formStore.isDirty ? 'text-red-500 dark:text-red-400' : ''
      }"
    >
      <USelectMenu
        v-model="selectedRole"
        :items="roleItems"
        :placeholder="$t('builder.role.placeholder')"
        :icon="selectedRole?.icon ?? 'i-heroicons-user'"
        :search-input="{ placeholder: $t('builder.role.placeholder') }"
        size="lg"
        class="w-full"
        :ui="{
          base: 'ps-14',
          trailingIcon: 'group-data-[state=open]:rotate-180 transition-transform duration-200',
          leadingIcon: 'text-emerald-500',
        }"
        @update:model-value="handleRoleChange"
      />
    </UFormField>

    <!-- Other Role Input (shown when "Other" is selected) -->
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
          :label="$t('builder.role.otherLabel')"
          :help="$t('builder.role.otherHelp')"
        >
          <UInput
            v-model="otherRoleValue"
            :placeholder="$t('builder.role.otherPlaceholder')"
            size="lg"
            class="w-full"
            leading-icon="i-heroicons-pencil-square"
            :ui="{ base: 'ps-14', leadingIcon: 'text-emerald-500' }"
            @input="handleOtherRoleChange"
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

interface RoleItem {
  label: string
  value: string
  icon: string
}

const { t } = useI18n()
const formStore = useFormStore()

// Role items with icons (for USelectMenu)
const roleItems = computed<RoleItem[]>(() => [
  {
    label: t('builder.role.options.hrSpecialist.label'),
    value: 'hr-specialist',
    icon: 'i-heroicons-users',
  },
  {
    label: t('builder.role.options.productManager.label'),
    value: 'product-manager',
    icon: 'i-heroicons-clipboard-document-list',
  },
  {
    label: t('builder.role.options.dataAnalyst.label'),
    value: 'data-analyst',
    icon: 'i-heroicons-chart-bar',
  },
  {
    label: t('builder.role.options.marketingSpecialist.label'),
    value: 'marketing-specialist',
    icon: 'i-heroicons-megaphone',
  },
  {
    label: t('builder.role.options.designer.label'),
    value: 'designer',
    icon: 'i-heroicons-paint-brush',
  },
  {
    label: t('builder.role.options.businessAnalyst.label'),
    value: 'business-analyst',
    icon: 'i-heroicons-presentation-chart-line',
  },
  {
    label: t('builder.role.options.contentWriter.label'),
    value: 'content-writer',
    icon: 'i-heroicons-pencil-square',
  },
  {
    label: t('builder.role.options.projectManager.label'),
    value: 'project-manager',
    icon: 'i-heroicons-user-group',
  },
  {
    label: t('builder.role.options.researcher.label'),
    value: 'researcher',
    icon: 'i-heroicons-magnifying-glass',
  },
  {
    label: t('builder.role.options.other.label'),
    value: 'other',
    icon: 'i-heroicons-ellipsis-horizontal-circle',
  },
])

// Selected role (full object for USelectMenu)
const selectedRole = ref<RoleItem | undefined>(undefined)
const otherRoleValue = ref('')

// Check if "Other" is selected
const isOtherSelected = computed(() => selectedRole.value?.value === 'other')

// Validation error from store
const validationError = computed(() => formStore.validationErrors.role)

// Check if field is required but empty (for label styling)
const isFieldEmpty = computed(() => !formStore.formData.role || formStore.formData.role.trim().length === 0)

// Initialize from store and handle reset
watch(
  () => formStore.formData.role,
  (newRole) => {
    if (!newRole) {
      // Handle reset: clear the selection
      selectedRole.value = undefined
      otherRoleValue.value = ''
    } else if (!selectedRole.value || selectedRole.value.value !== newRole) {
      const item = roleItems.value.find(opt => opt.value === newRole)
      if (item) {
        selectedRole.value = item
      }
    }
  },
  { immediate: true }
)

watch(
  () => formStore.formData.roleOther,
  (newRoleOther) => {
    if (newRoleOther && !otherRoleValue.value) {
      otherRoleValue.value = newRoleOther
    }
  },
  { immediate: true }
)

// Handle role change
const handleRoleChange = (value: RoleItem | undefined) => {
  if (value) {
    if (value.value === 'other') {
      formStore.updateField('role', 'other')
      formStore.updateField('roleOther', otherRoleValue.value)
    } else {
      formStore.updateField('role', value.value)
      formStore.updateField('roleOther', undefined)
      otherRoleValue.value = ''
    }
    formStore.validateField('role')
  }
}

// Handle other role input
const handleOtherRoleChange = () => {
  formStore.updateField('roleOther', otherRoleValue.value)
  formStore.validateField('role')
}
</script>
