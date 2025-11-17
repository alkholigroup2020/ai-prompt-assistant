<template>
  <div class="space-y-2">
    <label
      for="role-select"
      class="block text-sm font-medium text-gray-700 dark:text-gray-300"
    >
      {{ $t('builder.role.label') }}
      <span class="text-red-500">*</span>
    </label>

    <USelectMenu
      id="role-select"
      v-model="selectedRole"
      :options="roleOptions"
      :placeholder="$t('builder.role.placeholder')"
      :ui="{ base: 'w-full' }"
      @update:model-value="handleRoleChange"
    >
      <!-- @ts-expect-error - Nuxt UI slot typing limitation -->
      <template #label>
        <div v-if="selectedRole" class="flex items-center gap-2">
          <UIcon :name="getRoleIcon(selectedRole.value)" class="w-5 h-5" />
          <span>{{ selectedRole.label }}</span>
        </div>
        <span v-else class="text-gray-500">{{ $t('builder.role.placeholder') }}</span>
      </template>

      <!-- @ts-expect-error - Nuxt UI slot typing limitation -->
      <template #option="{ option }">
        <div class="flex items-center gap-3 py-1">
          <UIcon :name="getRoleIcon(option.value)" class="w-5 h-5 text-emerald-500" />
          <div class="flex-1">
            <div class="font-medium">{{ option.label }}</div>
            <div class="text-xs text-gray-500 dark:text-gray-400">
              {{ option.description }}
            </div>
          </div>
        </div>
      </template>
    </USelectMenu>

    <!-- Other Role Input (shown when "Other" is selected) -->
    <div v-if="isOtherSelected" class="mt-3">
      <UInput
        id="role-other"
        v-model="otherRoleValue"
        :placeholder="$t('builder.role.otherPlaceholder')"
        :ui="{ base: 'w-full' }"
        @input="handleOtherRoleChange"
      />
    </div>

    <!-- Validation Error -->
    <p v-if="validationError" class="text-sm text-red-600 dark:text-red-400 mt-1">
      <UIcon name="i-heroicons-exclamation-circle" class="w-4 h-4 inline" />
      {{ validationError }}
    </p>

    <!-- Help Text -->
    <p v-else class="text-sm text-gray-500 dark:text-gray-400 mt-1">
      {{ $t('builder.role.helpText') }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useFormStore } from '~/stores/form';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const formStore = useFormStore();

// Role options with icons and descriptions
const roleOptions = computed(() => [
  {
    value: 'software-engineer',
    label: t('builder.role.options.softwareEngineer.label'),
    description: t('builder.role.options.softwareEngineer.description'),
  },
  {
    value: 'product-manager',
    label: t('builder.role.options.productManager.label'),
    description: t('builder.role.options.productManager.description'),
  },
  {
    value: 'data-analyst',
    label: t('builder.role.options.dataAnalyst.label'),
    description: t('builder.role.options.dataAnalyst.description'),
  },
  {
    value: 'marketing-specialist',
    label: t('builder.role.options.marketingSpecialist.label'),
    description: t('builder.role.options.marketingSpecialist.description'),
  },
  {
    value: 'designer',
    label: t('builder.role.options.designer.label'),
    description: t('builder.role.options.designer.description'),
  },
  {
    value: 'business-analyst',
    label: t('builder.role.options.businessAnalyst.label'),
    description: t('builder.role.options.businessAnalyst.description'),
  },
  {
    value: 'content-writer',
    label: t('builder.role.options.contentWriter.label'),
    description: t('builder.role.options.contentWriter.description'),
  },
  {
    value: 'project-manager',
    label: t('builder.role.options.projectManager.label'),
    description: t('builder.role.options.projectManager.description'),
  },
  {
    value: 'researcher',
    label: t('builder.role.options.researcher.label'),
    description: t('builder.role.options.researcher.description'),
  },
  {
    value: 'other',
    label: t('builder.role.options.other.label'),
    description: t('builder.role.options.other.description'),
  },
]);

// Icon mapping for roles
const getRoleIcon = (roleValue: string): string => {
  const iconMap: Record<string, string> = {
    'software-engineer': 'i-heroicons-code-bracket',
    'product-manager': 'i-heroicons-clipboard-document-list',
    'data-analyst': 'i-heroicons-chart-bar',
    'marketing-specialist': 'i-heroicons-megaphone',
    'designer': 'i-heroicons-paint-brush',
    'business-analyst': 'i-heroicons-presentation-chart-line',
    'content-writer': 'i-heroicons-pencil-square',
    'project-manager': 'i-heroicons-user-group',
    'researcher': 'i-heroicons-magnifying-glass',
    'other': 'i-heroicons-ellipsis-horizontal-circle',
  };
  return iconMap[roleValue] || 'i-heroicons-user';
};

// Selected role state
const selectedRole = ref<{ value: string; label: string; description: string } | null>(null);
const otherRoleValue = ref('');

// Check if "Other" is selected
const isOtherSelected = computed(() => selectedRole.value?.value === 'other');

// Validation error from store
const validationError = computed(() => formStore.validationErrors.role);

// Initialize from store
watch(() => formStore.formData.role, (newRole) => {
  if (newRole && !selectedRole.value) {
    const option = roleOptions.value.find(opt => opt.value === newRole);
    if (option) {
      selectedRole.value = option;
    }
  }
}, { immediate: true });

watch(() => formStore.formData.roleOther, (newRoleOther) => {
  if (newRoleOther && !otherRoleValue.value) {
    otherRoleValue.value = newRoleOther;
  }
}, { immediate: true });

// Handle role change
const handleRoleChange = (value: unknown) => {
  const option = value as { value: string; label: string } | null;
  if (option && typeof option === 'object' && 'value' in option) {
    if (option.value === 'other') {
      formStore.updateField('role', 'other');
      formStore.updateField('roleOther', otherRoleValue.value);
    } else {
      formStore.updateField('role', option.value);
      formStore.updateField('roleOther', undefined);
      otherRoleValue.value = '';
    }
    formStore.validateField('role');
  }
};

// Handle other role input
const handleOtherRoleChange = () => {
  formStore.updateField('roleOther', otherRoleValue.value);
  formStore.validateField('role');
};
</script>
