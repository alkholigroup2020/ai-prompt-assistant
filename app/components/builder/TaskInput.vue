<template>
  <div class="space-y-4">
    <UFormField
      :label="$t('builder.task.label')"
      :error="validationError"
      required
    >
      <template #hint>
        <div class="flex items-center gap-2">
          <span
            :class="{
              'text-error': isOverLimit || isUnderLimit,
              'text-success': isWithinLimit,
              'text-muted': !taskValue
            }"
            class="text-xs font-medium"
          >
            {{ characterCount }} / {{ CHAR_LIMITS.TASK_MAX }}
          </span>
        </div>
      </template>

      <div class="relative">
        <UTextarea
          v-model="taskValue"
          :placeholder="$t('builder.task.placeholder')"
          :rows="5"
          autoresize
          :maxrows="12"
          size="lg"
          class="w-full"
          :highlight="isError"
          @input="handleTaskChange"
          @blur="handleBlur"
        />

        <!-- Progress indicator bar at bottom of textarea -->
        <div class="absolute bottom-0 left-0 right-0 h-1 bg-gray-200 dark:bg-gray-700 rounded-b-md overflow-hidden">
          <div
            class="h-full transition-all duration-300 ease-out"
            :class="{
              'bg-emerald-500': isWithinLimit,
              'bg-amber-500': characterCount > 0 && characterCount < CHAR_LIMITS.TASK_MIN,
              'bg-red-500': isOverLimit
            }"
            :style="{ width: `${progressPercentage}%` }"
          />
        </div>
      </div>

      <template #help>
        <div v-if="!validationError" class="flex items-center gap-1.5 text-muted">
          <UIcon name="i-heroicons-information-circle" class="size-4 shrink-0" />
          <span>{{ $t('builder.task.helpText') }}</span>
        </div>
      </template>
    </UFormField>

    <!-- Example Prompts Selector -->
    <div class="p-4 bg-emerald-50/50 dark:bg-emerald-900/10 rounded-xl border border-emerald-200/50 dark:border-emerald-800/30">
      <div class="flex items-center gap-2 mb-3">
        <div class="p-1.5 bg-emerald-100 dark:bg-emerald-800/30 rounded-lg">
          <UIcon name="i-heroicons-light-bulb" class="size-4 text-emerald-600 dark:text-emerald-400" />
        </div>
        <span class="text-sm font-semibold text-emerald-900 dark:text-emerald-100">
          {{ $t('builder.task.examplesTitle') }}
        </span>
      </div>
      <USelectMenu
        v-model="selectedExample"
        :items="exampleCategories"
        :placeholder="$t('builder.task.examplesPlaceholder')"
        :search-input="{ placeholder: $t('builder.task.examplesSearchPlaceholder') }"
        icon="i-heroicons-sparkles"
        size="lg"
        class="w-full"
        :ui="{
          base: 'ps-14',
          trailingIcon: 'group-data-[state=open]:rotate-180 transition-transform duration-200',
          leadingIcon: 'text-emerald-500',
        }"
        @update:model-value="handleExampleSelect"
      />
      <p class="mt-2 text-xs text-emerald-700 dark:text-emerald-300">
        <UIcon name="i-heroicons-information-circle" class="size-3.5 inline-block" />
        {{ $t('builder.task.examplesHint') }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useFormStore } from '~/stores/form'
import { useI18n } from 'vue-i18n'
import { CHAR_LIMITS } from '~/utils/validators'

interface ExampleItem {
  label: string
  value: string
  icon: string
}

const { t } = useI18n()
const formStore = useFormStore()

// Task value
const taskValue = ref('')

// Selected example (for USelectMenu)
const selectedExample = ref<ExampleItem | undefined>(undefined)

// Character count
const characterCount = computed(() => taskValue.value.length)

// Progress percentage (capped at 100%)
const progressPercentage = computed(() => {
  const percentage = (characterCount.value / CHAR_LIMITS.TASK_MAX) * 100
  return Math.min(Math.round(percentage), 100)
})

// Validation states
const isUnderLimit = computed(
  () => characterCount.value > 0 && characterCount.value < CHAR_LIMITS.TASK_MIN
)
const isOverLimit = computed(() => characterCount.value > CHAR_LIMITS.TASK_MAX)
const isWithinLimit = computed(
  () =>
    characterCount.value >= CHAR_LIMITS.TASK_MIN &&
    characterCount.value <= CHAR_LIMITS.TASK_MAX
)
const isError = computed(() => !!validationError.value)

// Validation error from store
const validationError = computed(() => formStore.validationErrors.task)

// Example prompts organized by category
const exampleCategories = computed<ExampleItem[][]>(() => [
  // HR & People Management
  [
    { label: t('builder.task.examples.hr.jobDescription'), value: 'hr-job-description', icon: 'i-heroicons-briefcase' },
    { label: t('builder.task.examples.hr.interviewQuestions'), value: 'hr-interview-questions', icon: 'i-heroicons-chat-bubble-left-right' },
    { label: t('builder.task.examples.hr.performanceReview'), value: 'hr-performance-review', icon: 'i-heroicons-clipboard-document-check' },
    { label: t('builder.task.examples.hr.onboarding'), value: 'hr-onboarding', icon: 'i-heroicons-user-plus' },
    { label: t('builder.task.examples.hr.policyDraft'), value: 'hr-policy-draft', icon: 'i-heroicons-document-text' },
    { label: t('builder.task.examples.hr.trainingPlan'), value: 'hr-training-plan', icon: 'i-heroicons-academic-cap' },
  ],
  // Finance & Accounting
  [
    { label: t('builder.task.examples.finance.budgetProposal'), value: 'finance-budget-proposal', icon: 'i-heroicons-calculator' },
    { label: t('builder.task.examples.finance.expenseReport'), value: 'finance-expense-report', icon: 'i-heroicons-receipt-percent' },
    { label: t('builder.task.examples.finance.financialSummary'), value: 'finance-financial-summary', icon: 'i-heroicons-chart-bar' },
    { label: t('builder.task.examples.finance.invoiceReminder'), value: 'finance-invoice-reminder', icon: 'i-heroicons-envelope' },
    { label: t('builder.task.examples.finance.costAnalysis'), value: 'finance-cost-analysis', icon: 'i-heroicons-chart-pie' },
    { label: t('builder.task.examples.finance.paymentTerms'), value: 'finance-payment-terms', icon: 'i-heroicons-banknotes' },
  ],
  // Business Development
  [
    { label: t('builder.task.examples.bizdev.partnershipProposal'), value: 'bizdev-partnership-proposal', icon: 'i-heroicons-handshake' },
    { label: t('builder.task.examples.bizdev.marketResearch'), value: 'bizdev-market-research', icon: 'i-heroicons-magnifying-glass' },
    { label: t('builder.task.examples.bizdev.businessPlan'), value: 'bizdev-business-plan', icon: 'i-heroicons-clipboard-document-list' },
    { label: t('builder.task.examples.bizdev.competitorAnalysis'), value: 'bizdev-competitor-analysis', icon: 'i-heroicons-scale' },
    { label: t('builder.task.examples.bizdev.expansionStrategy'), value: 'bizdev-expansion-strategy', icon: 'i-heroicons-globe-alt' },
    { label: t('builder.task.examples.bizdev.swotAnalysis'), value: 'bizdev-swot-analysis', icon: 'i-heroicons-squares-2x2' },
  ],
  // Sales & Customer Relations
  [
    { label: t('builder.task.examples.sales.salesPitch'), value: 'sales-sales-pitch', icon: 'i-heroicons-presentation-chart-line' },
    { label: t('builder.task.examples.sales.followUpEmail'), value: 'sales-follow-up-email', icon: 'i-heroicons-envelope' },
    { label: t('builder.task.examples.sales.productDescription'), value: 'sales-product-description', icon: 'i-heroicons-shopping-bag' },
    { label: t('builder.task.examples.sales.customerResponse'), value: 'sales-customer-response', icon: 'i-heroicons-chat-bubble-left' },
    { label: t('builder.task.examples.sales.quotation'), value: 'sales-quotation', icon: 'i-heroicons-document-currency-dollar' },
    { label: t('builder.task.examples.sales.thankYouNote'), value: 'sales-thank-you-note', icon: 'i-heroicons-heart' },
  ],
  // Administration & Operations
  [
    { label: t('builder.task.examples.admin.meetingAgenda'), value: 'admin-meeting-agenda', icon: 'i-heroicons-calendar' },
    { label: t('builder.task.examples.admin.meetingMinutes'), value: 'admin-meeting-minutes', icon: 'i-heroicons-document' },
    { label: t('builder.task.examples.admin.processDocumentation'), value: 'admin-process-documentation', icon: 'i-heroicons-clipboard-document' },
    { label: t('builder.task.examples.admin.announcementDraft'), value: 'admin-announcement-draft', icon: 'i-heroicons-megaphone' },
    { label: t('builder.task.examples.admin.eventPlanning'), value: 'admin-event-planning', icon: 'i-heroicons-calendar-days' },
    { label: t('builder.task.examples.admin.supplierEmail'), value: 'admin-supplier-email', icon: 'i-heroicons-truck' },
  ],
  // Communication & Writing
  [
    { label: t('builder.task.examples.writing.professionalEmail'), value: 'writing-professional-email', icon: 'i-heroicons-envelope' },
    { label: t('builder.task.examples.writing.reportSummary'), value: 'writing-report-summary', icon: 'i-heroicons-document-text' },
    { label: t('builder.task.examples.writing.presentation'), value: 'writing-presentation', icon: 'i-heroicons-presentation-chart-bar' },
    { label: t('builder.task.examples.writing.memo'), value: 'writing-memo', icon: 'i-heroicons-document' },
    { label: t('builder.task.examples.writing.newsletter'), value: 'writing-newsletter', icon: 'i-heroicons-newspaper' },
    { label: t('builder.task.examples.writing.letterDraft'), value: 'writing-letter-draft', icon: 'i-heroicons-pencil-square' },
  ],
])

// Initialize from store
watch(
  () => formStore.formData.task,
  (newTask) => {
    if (newTask && newTask !== taskValue.value) {
      taskValue.value = newTask
    }
  },
  { immediate: true }
)

// Handle task change
const handleTaskChange = () => {
  formStore.updateField('task', taskValue.value)
}

// Handle blur event (validate on blur)
const handleBlur = () => {
  formStore.validateField('task')
}

// Handle example selection
const handleExampleSelect = (value: ExampleItem | undefined) => {
  if (value) {
    taskValue.value = value.label
    formStore.updateField('task', value.label)
    formStore.validateField('task')
    // Reset selection after applying
    selectedExample.value = undefined
  }
}
</script>
