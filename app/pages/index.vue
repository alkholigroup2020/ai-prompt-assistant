<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'

const { t } = useI18n()
const router = useRouter()
const localePath = useLocalePath()

// SEO meta tags
useHead({
  title: computed(() => t('landing.meta.title')),
  meta: [
    {
      name: 'description',
      content: computed(() => t('landing.meta.description')),
    },
    {
      name: 'keywords',
      content: computed(() => t('landing.meta.keywords')),
    },
    // Open Graph
    {
      property: 'og:title',
      content: computed(() => t('landing.meta.title')),
    },
    {
      property: 'og:description',
      content: computed(() => t('landing.meta.description')),
    },
    {
      property: 'og:type',
      content: 'website',
    },
    // Twitter Card
    {
      name: 'twitter:card',
      content: 'summary_large_image',
    },
    {
      name: 'twitter:title',
      content: computed(() => t('landing.meta.title')),
    },
    {
      name: 'twitter:description',
      content: computed(() => t('landing.meta.description')),
    },
  ],
})

// Navigation handlers
const handleGetStarted = (): void => {
  router.push(localePath('/builder'))
}
</script>

<template>
  <div class="landing-page">
    <!-- Hero Section -->
    <section
      id="hero"
      class="relative overflow-hidden bg-linear-to-br from-navy-900 via-navy-800 to-emerald-900 text-white"
    >
      <div
        class="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-24 md:py-32 lg:py-40"
      >
        <div class="text-center">
          <!-- Animated Icon -->
          <div class="mb-6 sm:mb-8 flex justify-center">
            <div class="animate-bounce bg-emerald-500/20 p-4 sm:p-6 backdrop-blur-sm rounded-[30%]">
              <UIcon
                name="i-heroicons-sparkles"
                class="h-12 w-12 sm:h-16 sm:w-16 text-emerald-400"
              />
            </div>
          </div>

          <!-- Headline -->
          <h1
            class="mb-4 sm:mb-6 text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight px-2"
          >
            {{ t('landing.hero.headline') }}
          </h1>

          <!-- Subheadline -->
          <p
            class="mx-auto mb-6 sm:mb-12 max-w-3xl text-base sm:text-lg md:text-xl lg:text-2xl text-gray-200 px-4"
          >
            {{ t('landing.hero.subheadline') }}
          </p>

          <!-- CTA Buttons -->
          <div class="flex flex-col items-center justify-center gap-4 sm:gap-5 sm:flex-row px-4">
            <!-- Primary CTA: Start Building -->
            <button
              type="button"
              class="cursor-pointer group relative w-full sm:w-auto inline-flex items-center justify-center gap-3 overflow-hidden px-8 py-4 rounded-xl bg-gradient-to-r from-emerald-500 via-emerald-600 to-emerald-700 text-white font-semibold text-lg shadow-lg shadow-emerald-500/30 hover:shadow-2xl hover:shadow-emerald-400/60 transition-all duration-300 hover:scale-105 active:scale-95"
              @click="handleGetStarted"
            >
              <!-- Icon -->
              <UIcon
                name="i-heroicons-rocket-launch"
                class="relative z-10 h-6 w-6 transition-transform group-hover:rotate-12"
              />
              <!-- Text -->
              <span class="relative z-10 whitespace-nowrap">{{ t('landing.hero.ctaStart') }}</span>
              <!-- Shine effect -->
              <div
                class="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-1000 group-hover:translate-x-full"
              />
            </button>

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
      </div>
    </section>

    <!-- Value Propositions Section -->
    <section id="value-props" class="bg-gray-50 py-12 sm:py-16 md:py-20 lg:py-24 dark:bg-gray-900">
      <div class="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <!-- Section Header -->
        <div class="mb-8 sm:mb-10 md:mb-12 text-center">
          <h2
            class="mb-3 sm:mb-4 text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white"
          >
            {{ t('landing.valueProps.title') }}
          </h2>
          <p class="mx-auto max-w-2xl text-base sm:text-lg text-gray-600 dark:text-gray-400 px-4">
            {{ t('landing.valueProps.subtitle') }}
          </p>
        </div>

        <!-- Value Cards -->
        <div class="grid gap-6 sm:gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <!-- Card 1: Better Results -->
          <div
            class="group rounded-xl border border-gray-200 bg-white p-8 text-center shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg dark:border-gray-700 dark:bg-gray-800"
          >
            <div
              class="mb-4 flex justify-center text-emerald-500 transition-transform group-hover:scale-110"
            >
              <UIcon name="i-heroicons-arrow-trending-up" class="h-12 w-12" />
            </div>
            <div class="mb-2 text-4xl font-bold text-emerald-700 dark:text-emerald-400">80%</div>
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
            <div class="mb-2 text-4xl font-bold text-emerald-700 dark:text-emerald-400">3x</div>
            <h3 class="mb-2 font-semibold text-gray-900 dark:text-white">
              {{ t('landing.valueProps.fasterWriting.title') }}
            </h3>
            <p class="text-sm text-gray-600 dark:text-gray-400">
              {{ t('landing.valueProps.fasterWriting.description') }}
            </p>
          </div>

          <!-- Card 3: Bilingual Support -->
          <div
            class="group rounded-xl border border-gray-200 bg-white p-8 text-center shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg dark:border-gray-700 dark:bg-gray-800"
          >
            <div
              class="mb-4 flex justify-center text-emerald-500 transition-transform group-hover:scale-110"
            >
              <UIcon name="i-heroicons-language" class="h-12 w-12" />
            </div>
            <div class="mb-2 text-4xl font-bold text-emerald-700 dark:text-emerald-400">2</div>
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

    <!-- Email Feature Section -->
    <section
      id="email-feature"
      class="relative overflow-hidden bg-gradient-to-br from-slate-900 via-gray-900 to-slate-900 py-16 dark:from-slate-950 dark:via-gray-950 dark:to-slate-950 sm:py-24"
    >
      <!-- Background decoration -->
      <div class="absolute inset-0 -z-10">
        <div class="absolute right-0 top-0 h-96 w-96 rounded-full bg-emerald-500/10 blur-3xl" />
        <div class="absolute left-0 bottom-0 h-96 w-96 rounded-full bg-emerald-500/10 blur-3xl" />
        <!-- Grid pattern overlay -->
        <div
          class="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.02)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,#000,transparent)]"
        />
      </div>

      <div class="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div class="grid items-center gap-12 lg:grid-cols-5 lg:gap-16">
          <!-- Content Side (60%) -->
          <div class="text-center lg:col-span-3 lg:text-start">
            <!-- Headline -->
            <h2 class="text-3xl font-bold text-white sm:text-4xl md:text-5xl">
              {{ t('landing.emailFeature.title') }}
            </h2>

            <!-- Subtitle -->
            <p class="mt-2 text-xl font-medium text-emerald-400">
              {{ t('landing.emailFeature.subtitle') }}
            </p>

            <!-- Description -->
            <p class="mt-4 text-lg text-gray-300">
              {{ t('landing.emailFeature.description') }}
            </p>

            <!-- Benefits -->
            <ul class="mt-8 space-y-4">
              <li class="flex items-center gap-3 justify-center lg:justify-start">
                <div class="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-900/50">
                  <UIcon name="i-heroicons-check-circle" class="h-5 w-5 text-emerald-400" />
                </div>
                <span class="text-gray-300">{{ t('landing.emailFeature.benefits.grammar') }}</span>
              </li>
              <li class="flex items-center gap-3 justify-center lg:justify-start">
                <div class="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-900/50">
                  <UIcon name="i-heroicons-check-circle" class="h-5 w-5 text-emerald-400" />
                </div>
                <span class="text-gray-300">{{ t('landing.emailFeature.benefits.tone') }}</span>
              </li>
              <li class="flex items-center gap-3 justify-center lg:justify-start">
                <div class="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-900/50">
                  <UIcon name="i-heroicons-check-circle" class="h-5 w-5 text-emerald-400" />
                </div>
                <span class="text-gray-300">{{ t('landing.emailFeature.benefits.bilingual') }}</span>
              </li>
            </ul>

            <!-- CTA Button -->
            <div class="mt-10">
              <NuxtLink
                :to="localePath('/email-checker')"
                class="cursor-pointer group relative inline-flex items-center gap-3 overflow-hidden rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 px-8 py-4 text-lg font-semibold text-white shadow-lg shadow-emerald-500/30 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-emerald-500/40 active:scale-95"
              >
                <UIcon
                  name="i-heroicons-envelope"
                  class="relative z-10 h-6 w-6 transition-transform group-hover:rotate-6"
                />
                <span class="relative z-10">{{ t('landing.emailFeature.cta') }}</span>
                <!-- Shine effect -->
                <div
                  class="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-1000 group-hover:translate-x-full"
                />
              </NuxtLink>
            </div>
          </div>

          <!-- Visual Side (40%) -->
          <div class="relative flex items-center justify-center lg:col-span-2">
            <!-- Large Email Icon Container -->
            <div class="relative">
              <!-- Outer glow ring -->
              <div class="absolute inset-0 animate-pulse rounded-full bg-emerald-400/20 blur-2xl" />

              <!-- Icon container -->
              <div class="relative rounded-3xl border border-gray-700/50 bg-gradient-to-br from-gray-800/80 to-gray-900/80 p-12 shadow-2xl backdrop-blur-sm sm:p-16">
                <UIcon
                  name="i-heroicons-envelope"
                  class="h-32 w-32 text-emerald-400 sm:h-40 sm:w-40"
                />

                <!-- Decorative elements -->
                <div class="absolute -right-4 -top-4 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500 text-white shadow-lg">
                  <UIcon name="i-heroicons-sparkles" class="h-6 w-6" />
                </div>
                <div class="absolute -bottom-4 -left-4 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500 text-white shadow-lg">
                  <UIcon name="i-heroicons-check" class="h-6 w-6" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- How It Works Section -->
    <section
      id="how-it-works"
      class="bg-gray-50 py-16 dark:bg-gray-900 sm:py-24"
    >

      <div class="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <!-- Section Header -->
        <div class="mb-16 text-center">
          <h2 class="mb-4 text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl md:text-5xl">
            {{ t('landing.howItWorks.title') }}
          </h2>
          <p class="mx-auto max-w-2xl text-lg text-gray-600 dark:text-gray-300 sm:text-xl">
            {{ t('landing.howItWorks.subtitle') }}
          </p>
        </div>

        <!-- Steps Container -->
        <div class="relative mx-auto max-w-6xl">
          <!-- Steps Grid -->
          <div class="grid gap-12 lg:grid-cols-3 lg:gap-8 px-3 sm:px-24 md:px-36 lg:px-0">
            <!-- Step 1: Tell Us Your Goal -->
            <div class="group relative flex flex-col">
              <!-- Step Number Badge -->
              <div class="mb-6 flex justify-center">
                <div
                  class="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 text-2xl font-bold text-white transition-all group-hover:scale-110"
                >
                  1
                </div>
              </div>

              <!-- Card -->
              <div
                class="relative flex-1 rounded-xl border border-gray-200 bg-white p-8 py-12 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg dark:border-gray-700 dark:bg-gray-800"
              >
                <!-- Icon Container -->
                <div class="mb-6 flex justify-center">
                  <UIcon
                    name="i-heroicons-pencil-square"
                    class="h-16 w-16 text-emerald-500 transition-transform group-hover:scale-110"
                  />
                </div>

                <!-- Title -->
                <h3 class="mb-3 text-center text-xl font-bold text-gray-900 dark:text-white sm:text-2xl">
                  {{ t('landing.howItWorks.step1.title') }}
                </h3>

                <!-- Description -->
                <p class="text-center leading-relaxed text-gray-600 dark:text-gray-400">
                  {{ t('landing.howItWorks.step1.description') }}
                </p>
              </div>
            </div>

            <!-- Step 2: We Enhance Your Prompt -->
            <div class="group relative flex flex-col">
              <!-- Step Number Badge -->
              <div class="mb-6 flex justify-center">
                <div
                  class="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 text-2xl font-bold text-white transition-all group-hover:scale-110"
                >
                  2
                </div>
              </div>

              <!-- Card -->
              <div
                class="relative flex-1 rounded-xl border border-gray-200 bg-white p-8 py-12 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg dark:border-gray-700 dark:bg-gray-800"
              >
                <!-- Icon Container -->
                <div class="mb-6 flex justify-center">
                  <UIcon
                    name="i-heroicons-sparkles"
                    class="h-16 w-16 text-emerald-500 transition-transform group-hover:scale-110"
                  />
                </div>

                <!-- Title -->
                <h3 class="mb-3 text-center text-xl font-bold text-gray-900 dark:text-white sm:text-2xl">
                  {{ t('landing.howItWorks.step2.title') }}
                </h3>

                <!-- Description -->
                <p class="text-center leading-relaxed text-gray-600 dark:text-gray-400">
                  {{ t('landing.howItWorks.step2.description') }}
                </p>
              </div>
            </div>

            <!-- Step 3: Copy & Use Anywhere -->
            <div class="group relative flex flex-col">
              <!-- Step Number Badge -->
              <div class="mb-6 flex justify-center">
                <div
                  class="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 text-2xl font-bold text-white transition-all group-hover:scale-110"
                >
                  3
                </div>
              </div>

              <!-- Card -->
              <div
                class="relative flex-1 rounded-xl border border-gray-200 bg-white p-8 py-12 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg dark:border-gray-700 dark:bg-gray-800"
              >
                <!-- Icon Container -->
                <div class="mb-6 flex justify-center">
                  <UIcon
                    name="i-heroicons-clipboard-document-check"
                    class="h-16 w-16 text-emerald-500 transition-transform group-hover:scale-110"
                  />
                </div>

                <!-- Title -->
                <h3 class="mb-3 text-center text-xl font-bold text-gray-900 dark:text-white sm:text-2xl">
                  {{ t('landing.howItWorks.step3.title') }}
                </h3>

                <!-- Description -->
                <p class="text-center leading-relaxed text-gray-600 dark:text-gray-400">
                  {{ t('landing.howItWorks.step3.description') }}
                </p>

                <!-- Success checkmark decoration -->
                <div
                  class="absolute -bottom-2 -end-2 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 opacity-0 shadow-lg transition-all group-hover:scale-110 group-hover:opacity-100"
                >
                  <UIcon name="i-heroicons-check" class="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
          </div>

          <!-- CTA Button -->
          <div class="mt-16 text-center">
            <button
              type="button"
              class="cursor-pointer group relative inline-flex items-center gap-3 overflow-hidden rounded-xl bg-gradient-to-r from-emerald-500 via-emerald-600 to-emerald-700 px-8 py-4 text-lg font-semibold text-white shadow-lg shadow-emerald-500/30 hover:shadow-2xl hover:shadow-emerald-400/60 transition-all duration-300 hover:scale-105 active:scale-95"
              @click="handleGetStarted"
            >
              <!-- Icon -->
              <UIcon
                name="i-heroicons-rocket-launch"
                class="relative z-10 h-6 w-6 transition-transform group-hover:rotate-12"
              />
              <!-- Text -->
              <span class="relative z-10">{{ t('landing.howItWorks.cta') }}</span>
              <!-- Shine effect -->
              <div
                class="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-1000 group-hover:translate-x-full"
              />
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- Final CTA Section -->
    <section
      id="final-cta"
      class="bg-gradient-to-r from-emerald-600 to-emerald-700 py-16 text-white dark:from-emerald-700 dark:to-emerald-800"
    >
      <div class="container mx-auto max-w-7xl px-4 text-center">
        <h2 class="mb-4 text-3xl font-bold sm:text-4xl">
          {{ t('landing.finalCta.title') }}
        </h2>
        <p class="mx-auto mb-8 max-w-2xl text-lg text-emerald-100">
          {{ t('landing.finalCta.subtitle') }}
        </p>
        <button
          type="button"
          class="cursor-pointer group relative px-8 py-3 rounded-xl bg-white/10 backdrop-blur-md text-white font-semibold text-lg border-2 border-white/30 hover:bg-white/20 hover:border-white/50 transition-all duration-300 hover:scale-105 active:scale-95"
          @click="handleGetStarted"
        >
          <div class="relative flex items-center justify-center gap-3">
            <UIcon
              name="i-heroicons-rocket-launch"
              class="h-6 w-6 group-hover:rotate-12 transition-transform duration-300"
            />
            <span class="whitespace-nowrap">{{ t('landing.finalCta.cta') }}</span>
          </div>
        </button>
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
