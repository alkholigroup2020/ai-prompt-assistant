<script setup lang="ts">
const { t } = useI18n()
const localePath = useLocalePath()

useHead({
  title: () => t('privacy.meta.title'),
  meta: [{ name: 'description', content: () => t('privacy.meta.description') }],
})

useSeoMeta({
  title: () => t('privacy.meta.title'),
  description: () => t('privacy.meta.description'),
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
        <span>{{ t('privacy.backToHome') }}</span>
      </NuxtLink>

      <!-- Page Header -->
      <div class="text-center mb-12">
        <div
          class="inline-flex items-center justify-center w-20 h-20 bg-emerald-100 dark:bg-emerald-950 rounded-full mb-6"
        >
          <UIcon
            name="i-heroicons-shield-check"
            class="w-10 h-10 text-emerald-700 dark:text-emerald-400"
          />
        </div>
        <h1 class="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
          {{ t('privacy.title') }}
        </h1>
        <p class="text-gray-600 dark:text-gray-400">
          {{ t('privacy.lastUpdated', { date: '2025-01-01' }) }}
        </p>
      </div>

      <!-- Content Card -->
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-8 sm:p-12">
        <!-- Introduction -->
        <section class="mb-10">
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            {{ t('privacy.sections.intro.title') }}
          </h2>
          <p class="text-gray-600 dark:text-gray-400 leading-relaxed">
            {{ t('privacy.sections.intro.content') }}
          </p>
        </section>

        <!-- Data Collection -->
        <section class="mb-10">
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            {{ t('privacy.sections.dataCollection.title') }}
          </h2>
          <p class="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
            {{ t('privacy.sections.dataCollection.content') }}
          </p>
          <ul class="list-disc list-inside text-gray-600 dark:text-gray-400 space-y-2 ms-4">
            <li>{{ t('privacy.sections.dataCollection.items.prompts') }}</li>
            <li>{{ t('privacy.sections.dataCollection.items.preferences') }}</li>
            <li>{{ t('privacy.sections.dataCollection.items.usage') }}</li>
          </ul>
        </section>

        <!-- Data Usage -->
        <section class="mb-10">
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            {{ t('privacy.sections.dataUsage.title') }}
          </h2>
          <p class="text-gray-600 dark:text-gray-400 leading-relaxed">
            {{ t('privacy.sections.dataUsage.content') }}
          </p>
        </section>

        <!-- Data Storage -->
        <section class="mb-10">
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            {{ t('privacy.sections.dataStorage.title') }}
          </h2>
          <p class="text-gray-600 dark:text-gray-400 leading-relaxed">
            {{ t('privacy.sections.dataStorage.content') }}
          </p>
        </section>

        <!-- Contact -->
        <section>
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            {{ t('privacy.sections.contact.title') }}
          </h2>
          <p class="text-gray-600 dark:text-gray-400 leading-relaxed">
            {{ t('privacy.sections.contact.content') }}
          </p>
        </section>
      </div>
    </div>
  </div>
</template>
