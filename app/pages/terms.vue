<script setup lang="ts">
const { t } = useI18n()
const localePath = useLocalePath()

useHead({
  title: () => t('terms.meta.title'),
  meta: [{ name: 'description', content: () => t('terms.meta.description') }],
})

useSeoMeta({
  title: () => t('terms.meta.title'),
  description: () => t('terms.meta.description'),
})
</script>

<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
    <div class="container mx-auto max-w-4xl px-4">
      <!-- Back Link -->
      <NuxtLink
        :to="localePath('/')"
        class="inline-flex items-center gap-2 text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 mb-8 cursor-pointer"
      >
        <UIcon name="i-heroicons-arrow-left" class="w-5 h-5 rtl:rotate-180" />
        <span>{{ t('terms.backToHome') }}</span>
      </NuxtLink>

      <!-- Page Header -->
      <div class="text-center mb-12">
        <div
          class="inline-flex items-center justify-center w-20 h-20 bg-emerald-100 dark:bg-emerald-950 rounded-full mb-6"
        >
          <UIcon
            name="i-heroicons-document-text"
            class="w-10 h-10 text-emerald-700 dark:text-emerald-400"
          />
        </div>
        <h1 class="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
          {{ t('terms.title') }}
        </h1>
        <p class="text-gray-600 dark:text-gray-400">
          {{ t('terms.lastUpdated', { date: '2025-01-01' }) }}
        </p>
      </div>

      <!-- Content Card -->
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-8 sm:p-12">
        <!-- Acceptance -->
        <section class="mb-10">
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            {{ t('terms.sections.acceptance.title') }}
          </h2>
          <p class="text-gray-600 dark:text-gray-400 leading-relaxed">
            {{ t('terms.sections.acceptance.content') }}
          </p>
        </section>

        <!-- Service Description -->
        <section class="mb-10">
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            {{ t('terms.sections.service.title') }}
          </h2>
          <p class="text-gray-600 dark:text-gray-400 leading-relaxed">
            {{ t('terms.sections.service.content') }}
          </p>
        </section>

        <!-- User Responsibilities -->
        <section class="mb-10">
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            {{ t('terms.sections.responsibilities.title') }}
          </h2>
          <p class="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
            {{ t('terms.sections.responsibilities.content') }}
          </p>
          <ul class="list-disc list-inside text-gray-600 dark:text-gray-400 space-y-2 ms-4">
            <li>{{ t('terms.sections.responsibilities.items.appropriate') }}</li>
            <li>{{ t('terms.sections.responsibilities.items.legal') }}</li>
            <li>{{ t('terms.sections.responsibilities.items.respect') }}</li>
          </ul>
        </section>

        <!-- Intellectual Property -->
        <section class="mb-10">
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            {{ t('terms.sections.ip.title') }}
          </h2>
          <p class="text-gray-600 dark:text-gray-400 leading-relaxed">
            {{ t('terms.sections.ip.content') }}
          </p>
        </section>

        <!-- Disclaimer -->
        <section class="mb-10">
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            {{ t('terms.sections.disclaimer.title') }}
          </h2>
          <p class="text-gray-600 dark:text-gray-400 leading-relaxed">
            {{ t('terms.sections.disclaimer.content') }}
          </p>
        </section>

        <!-- Contact -->
        <section>
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            {{ t('terms.sections.contact.title') }}
          </h2>
          <p class="text-gray-600 dark:text-gray-400 leading-relaxed">
            {{ t('terms.sections.contact.content') }}
          </p>
        </section>
      </div>
    </div>
  </div>
</template>
