<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'

const { t } = useI18n()
const router = useRouter()

// SEO meta tags
useHead({
  title: computed(() => t('landing.meta.title')),
  meta: [
    {
      name: 'description',
      content: computed(() => t('landing.meta.description'))
    },
    {
      name: 'keywords',
      content: computed(() => t('landing.meta.keywords'))
    },
    // Open Graph
    {
      property: 'og:title',
      content: computed(() => t('landing.meta.title'))
    },
    {
      property: 'og:description',
      content: computed(() => t('landing.meta.description'))
    },
    {
      property: 'og:type',
      content: 'website'
    },
    // Twitter Card
    {
      name: 'twitter:card',
      content: 'summary_large_image'
    },
    {
      name: 'twitter:title',
      content: computed(() => t('landing.meta.title'))
    },
    {
      name: 'twitter:description',
      content: computed(() => t('landing.meta.description'))
    }
  ]
})

// Popular templates data (preview)
const popularTemplates = computed(() => [
  {
    id: 'email-reply',
    title: t('landing.templates.emailReply'),
    icon: 'envelope',
    category: 'business'
  },
  {
    id: 'data-analysis',
    title: t('landing.templates.dataAnalysis'),
    icon: 'chart-bar',
    category: 'analysis'
  },
  {
    id: 'code-review',
    title: t('landing.templates.codeReview'),
    icon: 'code-bracket',
    category: 'technical'
  },
  {
    id: 'sales-pitch',
    title: t('landing.templates.salesPitch'),
    icon: 'presentation-chart-line',
    category: 'business'
  }
])

// Navigation handlers
const handleGetStarted = (): void => {
  router.push('/builder')
}

const handleViewTemplates = (): void => {
  router.push('/templates')
}

const handleTemplateClick = (templateId: string): void => {
  router.push(`/templates/${templateId}`)
}
</script>

<template>
  <div class="landing-page">
    <!-- Hero Section -->
    <section
      id="hero"
      class="relative overflow-hidden bg-gradient-to-br from-navy-900 via-navy-800 to-emerald-900 text-white"
    >
      <div class="container mx-auto px-4 py-24 sm:py-32 md:py-40">
        <div class="text-center">
          <!-- Animated Icon -->
          <div class="mb-8 flex justify-center">
            <div
              class="animate-bounce rounded-full bg-emerald-500/20 p-6 backdrop-blur-sm"
            >
              <UIcon
                name="i-heroicons-sparkles"
                class="h-16 w-16 text-emerald-400"
              />
            </div>
          </div>

          <!-- Headline -->
          <h1
            class="mb-6 text-4xl font-bold leading-tight sm:text-5xl md:text-6xl lg:text-7xl"
          >
            {{ t('landing.hero.headline') }}
          </h1>

          <!-- Subheadline -->
          <p
            class="mx-auto mb-8 max-w-3xl text-lg text-gray-200 sm:text-xl md:text-2xl"
          >
            {{ t('landing.hero.subheadline') }}
          </p>

          <!-- CTA Buttons -->
          <div
            class="flex flex-col items-center justify-center gap-4 sm:flex-row"
          >
            <UButton
              size="xl"
              color="emerald"
              variant="solid"
              @click="handleGetStarted"
            >
              <template #leading>
                <UIcon name="i-heroicons-rocket-launch" />
              </template>
              {{ t('landing.hero.ctaStart') }}
            </UButton>

            <UButton
              size="xl"
              color="neutral"
              variant="outline"
              @click="handleViewTemplates"
            >
              <template #leading>
                <UIcon name="i-heroicons-squares-2x2" />
              </template>
              {{ t('landing.hero.ctaTemplates') }}
            </UButton>
          </div>

          <!-- Trust Indicators -->
          <div class="mt-12 flex items-center justify-center gap-2 text-sm text-gray-300">
            <UIcon name="i-heroicons-shield-check" class="h-5 w-5" />
            <span>{{ t('landing.hero.trust') }}</span>
          </div>
        </div>
      </div>

      <!-- Decorative Elements -->
      <div class="absolute inset-0 -z-10 overflow-hidden">
        <div
          class="absolute left-1/2 top-0 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-500/10 blur-3xl"
        />
        <div
          class="absolute bottom-0 right-0 h-96 w-96 translate-x-1/2 translate-y-1/2 rounded-full bg-navy-500/10 blur-3xl"
        />
      </div>
    </section>

    <!-- Value Propositions Section -->
    <section id="value-props" class="bg-white py-16 dark:bg-gray-900 sm:py-24">
      <div class="container mx-auto px-4">
        <!-- Section Header -->
        <div class="mb-12 text-center">
          <h2
            class="mb-4 text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl"
          >
            {{ t('landing.valueProps.title') }}
          </h2>
          <p class="mx-auto max-w-2xl text-lg text-gray-600 dark:text-gray-400">
            {{ t('landing.valueProps.subtitle') }}
          </p>
        </div>

        <!-- Value Cards -->
        <div class="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <!-- Card 1: Better Results -->
          <div
            class="group rounded-xl border border-gray-200 bg-white p-8 text-center shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg dark:border-gray-700 dark:bg-gray-800"
          >
            <div
              class="mb-4 flex justify-center text-emerald-500 transition-transform group-hover:scale-110"
            >
              <UIcon name="i-heroicons-arrow-trending-up" class="h-12 w-12" />
            </div>
            <div
              class="mb-2 text-4xl font-bold text-emerald-600 dark:text-emerald-400"
            >
              80%
            </div>
            <h3 class="mb-2 font-semibold text-gray-900 dark:text-white">
              {{ t('landing.valueProps.betterResults.title') }}
            </h3>
            <p class="text-sm text-gray-600 dark:text-gray-400">
              {{ t('landing.valueProps.betterResults.description') }}
            </p>
          </div>

          <!-- Card 2: Faster Writing -->
          <div
            class="group rounded-xl border border-gray-200 bg-white p-8 text-center shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg dark:border-gray-700 dark:bg-gray-800"
          >
            <div
              class="mb-4 flex justify-center text-emerald-500 transition-transform group-hover:scale-110"
            >
              <UIcon name="i-heroicons-bolt" class="h-12 w-12" />
            </div>
            <div
              class="mb-2 text-4xl font-bold text-emerald-600 dark:text-emerald-400"
            >
              3x
            </div>
            <h3 class="mb-2 font-semibold text-gray-900 dark:text-white">
              {{ t('landing.valueProps.fasterWriting.title') }}
            </h3>
            <p class="text-sm text-gray-600 dark:text-gray-400">
              {{ t('landing.valueProps.fasterWriting.description') }}
            </p>
          </div>

          <!-- Card 3: Ready Templates -->
          <div
            class="group rounded-xl border border-gray-200 bg-white p-8 text-center shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg dark:border-gray-700 dark:bg-gray-800"
          >
            <div
              class="mb-4 flex justify-center text-emerald-500 transition-transform group-hover:scale-110"
            >
              <UIcon name="i-heroicons-document-duplicate" class="h-12 w-12" />
            </div>
            <div
              class="mb-2 text-4xl font-bold text-emerald-600 dark:text-emerald-400"
            >
              20+
            </div>
            <h3 class="mb-2 font-semibold text-gray-900 dark:text-white">
              {{ t('landing.valueProps.templates.title') }}
            </h3>
            <p class="text-sm text-gray-600 dark:text-gray-400">
              {{ t('landing.valueProps.templates.description') }}
            </p>
          </div>

          <!-- Card 4: Bilingual Support -->
          <div
            class="group rounded-xl border border-gray-200 bg-white p-8 text-center shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg dark:border-gray-700 dark:bg-gray-800"
          >
            <div
              class="mb-4 flex justify-center text-emerald-500 transition-transform group-hover:scale-110"
            >
              <UIcon name="i-heroicons-language" class="h-12 w-12" />
            </div>
            <div
              class="mb-2 text-4xl font-bold text-emerald-600 dark:text-emerald-400"
            >
              2
            </div>
            <h3 class="mb-2 font-semibold text-gray-900 dark:text-white">
              {{ t('landing.valueProps.bilingual.title') }}
            </h3>
            <p class="text-sm text-gray-600 dark:text-gray-400">
              {{ t('landing.valueProps.bilingual.description') }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- How It Works Section -->
    <section id="how-it-works" class="bg-gray-50 py-16 dark:bg-gray-800 sm:py-24">
      <div class="container mx-auto px-4">
        <!-- Section Header -->
        <div class="mb-12 text-center">
          <h2
            class="mb-4 text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl"
          >
            {{ t('landing.howItWorks.title') }}
          </h2>
          <p class="mx-auto max-w-2xl text-lg text-gray-600 dark:text-gray-400">
            {{ t('landing.howItWorks.subtitle') }}
          </p>
        </div>

        <!-- Steps -->
        <div class="grid gap-8 md:grid-cols-3">
          <!-- Step 1 -->
          <div class="relative text-center">
            <div
              class="mb-6 flex justify-center rounded-full bg-emerald-100 p-6 dark:bg-emerald-900/30"
            >
              <UIcon
                name="i-heroicons-pencil-square"
                class="h-12 w-12 text-emerald-600 dark:text-emerald-400"
              />
            </div>
            <div
              class="mb-4 inline-block rounded-full bg-emerald-500 px-4 py-1 text-sm font-semibold text-white"
            >
              {{ t('landing.howItWorks.step') }} 1
            </div>
            <h3 class="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
              {{ t('landing.howItWorks.step1.title') }}
            </h3>
            <p class="text-gray-600 dark:text-gray-400">
              {{ t('landing.howItWorks.step1.description') }}
            </p>

            <!-- Arrow for desktop -->
            <div
              class="absolute right-0 top-16 hidden translate-x-1/2 md:block"
            >
              <UIcon
                name="i-heroicons-arrow-right"
                class="h-8 w-8 text-emerald-400"
              />
            </div>
          </div>

          <!-- Step 2 -->
          <div class="relative text-center">
            <div
              class="mb-6 flex justify-center rounded-full bg-emerald-100 p-6 dark:bg-emerald-900/30"
            >
              <UIcon
                name="i-heroicons-sparkles"
                class="h-12 w-12 text-emerald-600 dark:text-emerald-400"
              />
            </div>
            <div
              class="mb-4 inline-block rounded-full bg-emerald-500 px-4 py-1 text-sm font-semibold text-white"
            >
              {{ t('landing.howItWorks.step') }} 2
            </div>
            <h3 class="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
              {{ t('landing.howItWorks.step2.title') }}
            </h3>
            <p class="text-gray-600 dark:text-gray-400">
              {{ t('landing.howItWorks.step2.description') }}
            </p>

            <!-- Arrow for desktop -->
            <div
              class="absolute right-0 top-16 hidden translate-x-1/2 md:block"
            >
              <UIcon
                name="i-heroicons-arrow-right"
                class="h-8 w-8 text-emerald-400"
              />
            </div>
          </div>

          <!-- Step 3 -->
          <div class="text-center">
            <div
              class="mb-6 flex justify-center rounded-full bg-emerald-100 p-6 dark:bg-emerald-900/30"
            >
              <UIcon
                name="i-heroicons-clipboard-document-check"
                class="h-12 w-12 text-emerald-600 dark:text-emerald-400"
              />
            </div>
            <div
              class="mb-4 inline-block rounded-full bg-emerald-500 px-4 py-1 text-sm font-semibold text-white"
            >
              {{ t('landing.howItWorks.step') }} 3
            </div>
            <h3 class="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
              {{ t('landing.howItWorks.step3.title') }}
            </h3>
            <p class="text-gray-600 dark:text-gray-400">
              {{ t('landing.howItWorks.step3.description') }}
            </p>
          </div>
        </div>

        <!-- CTA Button -->
        <div class="mt-12 text-center">
          <UButton
            size="lg"
            color="emerald"
            variant="solid"
            @click="handleGetStarted"
          >
            <template #leading>
              <UIcon name="i-heroicons-rocket-launch" />
            </template>
            {{ t('landing.howItWorks.cta') }}
          </UButton>
        </div>
      </div>
    </section>

    <!-- Popular Templates Section -->
    <section id="templates-preview" class="bg-white py-16 dark:bg-gray-900 sm:py-24">
      <div class="container mx-auto px-4">
        <!-- Section Header -->
        <div class="mb-12 flex items-center justify-between">
          <div>
            <h2
              class="mb-2 text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl"
            >
              {{ t('landing.templatesPreview.title') }}
            </h2>
            <p class="text-lg text-gray-600 dark:text-gray-400">
              {{ t('landing.templatesPreview.subtitle') }}
            </p>
          </div>
          <UButton
            color="emerald"
            variant="outline"
            @click="handleViewTemplates"
          >
            {{ t('landing.templatesPreview.viewAll') }}
            <template #trailing>
              <UIcon name="i-heroicons-arrow-right" />
            </template>
          </UButton>
        </div>

        <!-- Template Cards -->
        <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div
            v-for="template in popularTemplates"
            :key="template.id"
            class="group cursor-pointer rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg dark:border-gray-700 dark:bg-gray-800"
            @click="handleTemplateClick(template.id)"
          >
            <div
              class="mb-4 flex h-16 w-16 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600 transition-colors group-hover:bg-emerald-500 group-hover:text-white dark:bg-emerald-900/30 dark:text-emerald-400"
            >
              <UIcon :name="`i-heroicons-${template.icon}`" class="h-8 w-8" />
            </div>
            <h3 class="mb-2 font-semibold text-gray-900 dark:text-white">
              {{ template.title }}
            </h3>
            <UBadge :color="template.category === 'business' ? 'primary' : template.category === 'technical' ? 'navy' : 'emerald'" size="xs">
              {{ t(`templates.categories.${template.category}`) }}
            </UBadge>
          </div>
        </div>
      </div>
    </section>

    <!-- Final CTA Section -->
    <section
      id="final-cta"
      class="bg-gradient-to-r from-emerald-600 to-emerald-700 py-16 text-white dark:from-emerald-700 dark:to-emerald-800"
    >
      <div class="container mx-auto px-4 text-center">
        <h2 class="mb-4 text-3xl font-bold sm:text-4xl">
          {{ t('landing.finalCta.title') }}
        </h2>
        <p class="mx-auto mb-8 max-w-2xl text-lg text-emerald-100">
          {{ t('landing.finalCta.subtitle') }}
        </p>
        <UButton
          size="xl"
          color="neutral"
          variant="solid"
          @click="handleGetStarted"
        >
          <template #leading>
            <UIcon name="i-heroicons-rocket-launch" />
          </template>
          {{ t('landing.finalCta.cta') }}
        </UButton>
      </div>
    </section>
  </div>
</template>

<style scoped>
.landing-page {
  scroll-behavior: smooth;
}

/* Smooth scroll animations */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in-up {
  animation: fadeInUp 0.6s ease-out;
}
</style>
