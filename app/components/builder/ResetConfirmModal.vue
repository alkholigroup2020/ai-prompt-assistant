<template>
  <UModal v-model:open="isOpen">
    <template #content>
      <!-- Gradient Header Background -->
      <div class="relative overflow-hidden bg-gradient-to-br from-red-50 via-orange-50 to-amber-50 dark:from-red-950/40 dark:via-orange-950/40 dark:to-amber-950/40">
        <!-- Decorative Elements -->
        <div class="absolute inset-0 bg-grid-pattern opacity-5" />
        <div class="absolute -top-24 -right-24 w-48 h-48 bg-red-500/10 rounded-full blur-3xl" />
        <div class="absolute -bottom-24 -left-24 w-48 h-48 bg-orange-500/10 rounded-full blur-3xl" />

        <!-- Content -->
        <div class="relative p-8 text-center">
          <!-- Large Animated Icon -->
          <div class="flex justify-center mb-6">
            <div class="relative">
              <!-- Pulsing Background Rings -->
              <div class="absolute inset-0 animate-ping-slow">
                <div class="w-24 h-24 rounded-full bg-red-400/30 dark:bg-red-600/30" />
              </div>
              <div class="absolute inset-0 animate-pulse-slow">
                <div class="w-24 h-24 rounded-full bg-red-400/20 dark:bg-red-600/20" />
              </div>

              <!-- Icon Circle -->
              <div class="relative w-24 h-24 rounded-full bg-gradient-to-br from-red-500 to-orange-600 dark:from-red-600 dark:to-orange-700 flex items-center justify-center shadow-2xl shadow-red-500/50 dark:shadow-red-900/50 transform hover:scale-105 transition-transform duration-300">
                <UIcon
                  name="i-heroicons-arrow-path"
                  class="w-12 h-12 text-white animate-spin-slow"
                />
              </div>
            </div>
          </div>

          <!-- Title -->
          <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-3">
            {{ $t('builder.resetModal.title') }}
          </h3>

          <!-- Message -->
          <p class="text-base text-gray-700 dark:text-gray-300 max-w-md mx-auto">
            {{ $t('builder.resetModal.message') }}
          </p>
        </div>
      </div>

      <!-- Action Buttons Section -->
      <div class="p-6 bg-white dark:bg-gray-900">
        <div class="grid grid-cols-2 gap-3">
          <!-- Cancel Button (Left) -->
          <UButton
            variant="outline"
            size="lg"
            block
            class="cursor-pointer min-h-[44px] font-semibold border-2 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200 hover:scale-105 active:scale-95"
            @click="handleCancel"
          >
            <template #leading>
              <UIcon name="i-heroicons-x-mark" class="w-5 h-5" />
            </template>
            {{ $t('builder.resetModal.cancel') }}
          </UButton>

          <!-- Reset Button (Right) -->
          <UButton
            color="neutral"
            variant="solid"
            size="lg"
            block
            class="cursor-pointer min-h-[44px] font-semibold bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 dark:from-red-600 dark:to-orange-600 dark:hover:from-red-700 dark:hover:to-orange-700 text-white shadow-lg shadow-red-500/30 dark:shadow-red-900/30 transition-all duration-200 hover:scale-105 active:scale-95 hover:shadow-xl"
            @click="handleConfirm"
          >
            <template #leading>
              <UIcon name="i-heroicons-arrow-path" class="w-5 h-5" />
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

<style scoped>
/* Grid Pattern Background */
.bg-grid-pattern {
  background-image:
    linear-gradient(to right, currentColor 1px, transparent 1px),
    linear-gradient(to bottom, currentColor 1px, transparent 1px);
  background-size: 20px 20px;
}

/* Custom Animations */
@keyframes ping-slow {
  0% {
    transform: scale(1);
    opacity: 1;
  }
  75%, 100% {
    transform: scale(1.5);
    opacity: 0;
  }
}

@keyframes pulse-slow {
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.6;
    transform: scale(1.15);
  }
}

@keyframes spin-slow {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.animate-ping-slow {
  animation: ping-slow 2s cubic-bezier(0, 0, 0.2, 1) infinite;
}

.animate-pulse-slow {
  animation: pulse-slow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

.animate-spin-slow {
  animation: spin-slow 3s linear infinite;
}
</style>
