<template>
  <UModal v-model:open="isOpen">
    <template #content>
      <div class="p-6">
        <!-- Header with Icon -->
        <div class="flex items-start gap-4">
          <div
            class="flex-shrink-0 w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center"
          >
            <UIcon
              name="i-heroicons-exclamation-triangle"
              class="w-6 h-6 text-amber-600 dark:text-amber-400"
            />
          </div>
          <div class="flex-1 min-w-0">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              {{ $t('builder.resetModal.title') }}
            </h3>
            <p class="text-sm text-gray-600 dark:text-gray-400">
              {{ $t('builder.resetModal.message') }}
            </p>
          </div>
        </div>

        <!-- Warning Box -->
        <div
          class="mt-4 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg"
        >
          <div class="flex items-center gap-2">
            <UIcon
              name="i-heroicons-information-circle"
              class="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0"
            />
            <p class="text-sm text-amber-800 dark:text-amber-200">
              {{ $t('builder.resetModal.warning') }}
            </p>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="mt-6 flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
          <UButton
            variant="outline"
            size="lg"
            class="cursor-pointer"
            @click="handleCancel"
          >
            {{ $t('builder.resetModal.cancel') }}
          </UButton>
          <UButton
            color="neutral"
            variant="solid"
            size="lg"
            class="cursor-pointer bg-red-600 hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-700 text-white"
            @click="handleConfirm"
          >
            <template #leading>
              <UIcon name="i-heroicons-arrow-path" />
            </template>
            {{ $t('builder.resetModal.confirm') }}
          </UButton>
        </div>
      </div>
    </template>
  </UModal>
</template>

<script setup lang="ts">
const props = defineProps<{
  modelValue: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  confirm: []
  cancel: []
}>()

// Two-way binding for modal open state
const isOpen = computed({
  get: () => props.modelValue,
  set: (value: boolean) => emit('update:modelValue', value)
})

// Handle confirm action
const handleConfirm = () => {
  emit('confirm')
  isOpen.value = false
}

// Handle cancel action
const handleCancel = () => {
  emit('cancel')
  isOpen.value = false
}
</script>
