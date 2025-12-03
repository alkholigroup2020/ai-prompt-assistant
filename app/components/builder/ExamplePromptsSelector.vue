<template>
  <Transition
    enter-active-class="transition duration-300 ease-out"
    enter-from-class="opacity-0 -translate-y-2"
    enter-to-class="opacity-100 translate-y-0"
    leave-active-class="transition duration-200 ease-in"
    leave-from-class="opacity-100 translate-y-0"
    leave-to-class="opacity-0 -translate-y-2"
  >
    <div
      v-if="showExamples && examplesCount > 0"
      class="p-4 bg-emerald-50/50 dark:bg-emerald-900/10 rounded-xl border border-emerald-200/50 dark:border-emerald-800/30"
    >
      <div class="flex items-center gap-2 mb-3">
        <div class="p-1.5 bg-emerald-100 dark:bg-emerald-800/30 rounded-lg">
          <UIcon name="i-heroicons-light-bulb" class="size-4 text-emerald-600 dark:text-emerald-400" />
        </div>
        <span class="text-sm font-semibold text-emerald-900 dark:text-emerald-100">
          {{ $t('builder.task.examplesTitle') }}
        </span>
        <span class="text-xs text-emerald-600 dark:text-emerald-400">
          ({{ examplesCount }})
        </span>
      </div>

      <USelectMenu
        :key="selectorKey"
        v-model="selectedExample"
        :items="currentExamples"
        :placeholder="$t('builder.task.examplesPlaceholder')"
        :search-input="{ placeholder: $t('builder.task.examplesSearchPlaceholder') }"
        icon="i-heroicons-sparkles"
        size="lg"
        class="w-full cursor-pointer"
        :ui="{
          base: 'ps-14',
          trailingIcon: 'group-data-[state=open]:rotate-180 transition-transform duration-200',
          leadingIcon: 'text-emerald-500',
        }"
        @update:model-value="handleExampleSelect"
      />

    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useExamplePrompts } from '~/composables/useExamplePrompts'
import type { ExampleItem } from '~/types/examples'

const emit = defineEmits<{
  (e: 'select', value: string): void
}>()

const { showExamples, currentExamples, examplesCount } = useExamplePrompts()

const selectedExample = ref<ExampleItem | undefined>(undefined)
const selectorKey = ref(0)

// Reset selection when examples change
watch(currentExamples, () => {
  selectedExample.value = undefined
  selectorKey.value++
})

const handleExampleSelect = (value: ExampleItem | undefined) => {
  if (value) {
    emit('select', value.label)
    selectedExample.value = undefined
  }
}
</script>
