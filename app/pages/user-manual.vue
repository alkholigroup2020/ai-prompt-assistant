<script setup lang="ts">
definePageMeta({
  layout: 'docs',
})

const { t } = useI18n()

// SEO
useHead({
  title: () => t('userManual.meta.title'),
  meta: [{ name: 'description', content: () => t('userManual.meta.description') }],
})

useSeoMeta({
  title: () => t('userManual.meta.title'),
  description: () => t('userManual.meta.description'),
})

// Navigation sections for sidebar
const navSections = computed(() => [
  {
    id: 'getting-started',
    title: t('userManual.nav.gettingStarted'),
    icon: 'i-heroicons-rocket-launch',
    items: [
      { id: 'what-is', title: t('userManual.nav.whatIs') },
      { id: 'quick-start', title: t('userManual.nav.quickStart') },
    ],
  },
  {
    id: 'prompt-builder',
    title: t('userManual.nav.promptBuilder'),
    icon: 'i-heroicons-sparkles',
    items: [
      { id: 'builder-overview', title: t('userManual.nav.builderOverview') },
      { id: 'role-selection', title: t('userManual.nav.roleSelection') },
      { id: 'audience-task', title: t('userManual.nav.audienceTask') },
      { id: 'tone-format', title: t('userManual.nav.toneFormat') },
      { id: 'constraints', title: t('userManual.nav.constraints') },
      { id: 'quality-score', title: t('userManual.nav.qualityScore') },
      { id: 'keyboard-shortcuts', title: t('userManual.nav.keyboardShortcuts') },
    ],
  },
  {
    id: 'email-enhancer',
    title: t('userManual.nav.emailEnhancer'),
    icon: 'i-heroicons-envelope',
    items: [
      { id: 'email-overview', title: t('userManual.nav.emailOverview') },
      { id: 'email-workflow', title: t('userManual.nav.emailWorkflow') },
    ],
  },
  {
    id: 'results',
    title: t('userManual.nav.results'),
    icon: 'i-heroicons-document-check',
    items: [
      { id: 'results-overview', title: t('userManual.nav.resultsOverview') },
      { id: 'export-options', title: t('userManual.nav.exportOptions') },
    ],
  },
  {
    id: 'tips',
    title: t('userManual.nav.tips'),
    icon: 'i-heroicons-light-bulb',
    items: [
      { id: 'best-practices', title: t('userManual.nav.bestPractices') },
      { id: 'troubleshooting', title: t('userManual.nav.troubleshooting') },
    ],
  },
])

// Active section tracking for scroll spy
const activeSection = ref('what-is')

// All section IDs for scroll spy
const sectionIds = computed(() =>
  navSections.value.flatMap((section) => section.items.map((item) => item.id))
)

// Scroll spy using Intersection Observer
onMounted(() => {
  const observerOptions = {
    root: null,
    rootMargin: '-100px 0px -66%',
    threshold: 0,
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        activeSection.value = entry.target.id
      }
    })
  }, observerOptions)

  sectionIds.value.forEach((id) => {
    const element = document.getElementById(id)
    if (element) {
      observer.observe(element)
    }
  })

  onUnmounted(() => {
    observer.disconnect()
  })
})

// Keyboard shortcuts data
const keyboardShortcuts = computed(() => [
  { keys: ['Ctrl', 'Enter'], action: t('userManual.shortcuts.quickEnhance') },
  { keys: ['Ctrl', 'Shift', 'Enter'], action: t('userManual.shortcuts.deepEnhance') },
  { keys: ['Ctrl', 'S'], action: t('userManual.shortcuts.saveDraft') },
  { keys: ['Ctrl', 'R'], action: t('userManual.shortcuts.resetForm') },
  { keys: ['Esc'], action: t('userManual.shortcuts.clearFocus') },
])

// Check if mobile sidebar portal exists (to prevent Teleport errors on navigation)
const portalExists = ref(false)
onMounted(() => {
  portalExists.value = !!document.getElementById('mobile-sidebar-portal')
})
</script>

<template>
  <div class="flex">
    <!-- Left Sidebar (Desktop) -->
    <aside
      class="hidden lg:block w-72 xl:w-80 flex-shrink-0 border-e border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
    >
      <div class="sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto p-6">
        <DocsSidebar :sections="navSections" :active-section="activeSection" />
      </div>
    </aside>

    <!-- Mobile Sidebar (Teleport to layout drawer) -->
    <ClientOnly>
      <Teleport v-if="portalExists" to="#mobile-sidebar-portal">
        <DocsSidebar :sections="navSections" :active-section="activeSection" />
      </Teleport>
    </ClientOnly>

    <!-- Main Content -->
    <div class="flex-1 min-w-0">
      <div class="max-w-4xl 2xl:max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <!-- Page Header -->
        <div class="mb-12 text-center lg:text-start">
          <div
            class="inline-flex items-center justify-center w-16 h-16 bg-emerald-100 dark:bg-emerald-950 rounded-full mb-6"
          >
            <UIcon
              name="i-heroicons-book-open"
              class="w-8 h-8 text-emerald-700 dark:text-emerald-400"
            />
          </div>
          <h1 class="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {{ t('userManual.title') }}
          </h1>
          <p class="text-lg text-gray-600 dark:text-gray-400 max-w-2xl">
            {{ t('userManual.subtitle') }}
          </p>
        </div>

        <!-- ==================== GETTING STARTED ==================== -->

        <DocsSection id="what-is" :title="t('userManual.whatIs.title')">
          <p class="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
            {{ t('userManual.whatIs.intro') }}
          </p>
          <p class="text-gray-600 dark:text-gray-400 leading-relaxed">
            {{ t('userManual.whatIs.description') }}
          </p>

          <DocsCallout type="info" :title="t('userManual.whatIs.aiToolsTitle')">
            {{ t('userManual.whatIs.aiToolsContent') }}
          </DocsCallout>
        </DocsSection>

        <DocsSection id="quick-start" :title="t('userManual.quickStart.title')">
          <p class="text-gray-600 dark:text-gray-400 leading-relaxed mb-6">
            {{ t('userManual.quickStart.intro') }}
          </p>

          <!-- Quick Start Steps -->
          <div class="space-y-6">
            <!-- Step 1 -->
            <div class="flex gap-4">
              <div
                class="flex-shrink-0 w-10 h-10 bg-emerald-100 dark:bg-emerald-900/50 rounded-full flex items-center justify-center"
              >
                <span class="text-emerald-700 dark:text-emerald-400 font-bold">1</span>
              </div>
              <div>
                <h4 class="font-semibold text-gray-900 dark:text-white mb-1">
                  {{ t('userManual.quickStart.step1.title') }}
                </h4>
                <p class="text-gray-600 dark:text-gray-400 text-sm">
                  {{ t('userManual.quickStart.step1.description') }}
                </p>
              </div>
            </div>

            <!-- Step 2 -->
            <div class="flex gap-4">
              <div
                class="flex-shrink-0 w-10 h-10 bg-emerald-100 dark:bg-emerald-900/50 rounded-full flex items-center justify-center"
              >
                <span class="text-emerald-700 dark:text-emerald-400 font-bold">2</span>
              </div>
              <div>
                <h4 class="font-semibold text-gray-900 dark:text-white mb-1">
                  {{ t('userManual.quickStart.step2.title') }}
                </h4>
                <p class="text-gray-600 dark:text-gray-400 text-sm">
                  {{ t('userManual.quickStart.step2.description') }}
                </p>
              </div>
            </div>

            <!-- Step 3 -->
            <div class="flex gap-4">
              <div
                class="flex-shrink-0 w-10 h-10 bg-emerald-100 dark:bg-emerald-900/50 rounded-full flex items-center justify-center"
              >
                <span class="text-emerald-700 dark:text-emerald-400 font-bold">3</span>
              </div>
              <div>
                <h4 class="font-semibold text-gray-900 dark:text-white mb-1">
                  {{ t('userManual.quickStart.step3.title') }}
                </h4>
                <p class="text-gray-600 dark:text-gray-400 text-sm">
                  {{ t('userManual.quickStart.step3.description') }}
                </p>
              </div>
            </div>
          </div>
        </DocsSection>

        <!-- ==================== PROMPT BUILDER ==================== -->

        <DocsSection id="builder-overview" :title="t('userManual.builderOverview.title')">
          <p class="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
            {{ t('userManual.builderOverview.intro') }}
          </p>

          <DocsScreenshot
            src="/images/docs/builder-overview.png"
            :alt="t('userManual.builderOverview.screenshotAlt')"
            :caption="t('userManual.builderOverview.screenshotCaption')"
          />

          <p class="text-gray-600 dark:text-gray-400 leading-relaxed">
            {{ t('userManual.builderOverview.description') }}
          </p>

          <DocsCallout type="tip" :title="t('userManual.builderOverview.tipTitle')">
            {{ t('userManual.builderOverview.tipContent') }}
          </DocsCallout>
        </DocsSection>

        <DocsSection id="role-selection" :title="t('userManual.roleSelection.title')" :level="3">
          <p class="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
            {{ t('userManual.roleSelection.intro') }}
          </p>

          <!-- Roles Grid -->
          <div class="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
            <div
              v-for="role in [
                'bizDev',
                'hr',
                'accountant',
                'procurement',
                'marketing',
                'projectManager',
                'dataAnalyst',
                'businessAnalyst',
                'contentWriter',
                'other',
              ]"
              :key="role"
              class="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg text-sm"
            >
              <UIcon
                name="i-heroicons-user"
                class="w-4 h-4 text-emerald-600 dark:text-emerald-400"
              />
              <span class="text-gray-700 dark:text-gray-300">{{
                t(`userManual.roleSelection.roles.${role}`)
              }}</span>
            </div>
          </div>

          <DocsCallout type="tip">
            {{ t('userManual.roleSelection.customTip') }}
          </DocsCallout>
        </DocsSection>

        <DocsSection id="audience-task" :title="t('userManual.audienceTask.title')" :level="3">
          <p class="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
            {{ t('userManual.audienceTask.audienceIntro') }}
          </p>

          <p class="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
            {{ t('userManual.audienceTask.taskIntro') }}
          </p>

          <DocsCallout type="warning" :title="t('userManual.audienceTask.warningTitle')">
            {{ t('userManual.audienceTask.warningContent') }}
          </DocsCallout>
        </DocsSection>

        <DocsSection id="tone-format" :title="t('userManual.toneFormat.title')" :level="3">
          <p class="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
            {{ t('userManual.toneFormat.toneIntro') }}
          </p>

          <!-- Tones Grid -->
          <div class="grid grid-cols-3 gap-2 mb-6">
            <div
              v-for="tone in [
                'professional',
                'friendly',
                'formal',
                'casual',
                'persuasive',
                'informative',
                'creative',
                'technical',
                'empathetic',
              ]"
              :key="tone"
              class="p-2 bg-gray-50 dark:bg-gray-800 rounded text-center text-sm text-gray-700 dark:text-gray-300"
            >
              {{ t(`userManual.toneFormat.tones.${tone}`) }}
            </div>
          </div>

          <p class="text-gray-600 dark:text-gray-400 leading-relaxed">
            {{ t('userManual.toneFormat.formatIntro') }}
          </p>
        </DocsSection>

        <DocsSection id="constraints" :title="t('userManual.constraints.title')" :level="3">
          <p class="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
            {{ t('userManual.constraints.intro') }}
          </p>

          <div class="space-y-3 mb-4">
            <h4 class="font-medium text-gray-900 dark:text-white">
              {{ t('userManual.constraints.wordLimitsTitle') }}
            </h4>
            <ul class="list-disc list-inside text-gray-600 dark:text-gray-400 space-y-1 ms-4">
              <li>{{ t('userManual.constraints.noLimit') }}</li>
              <li>{{ t('userManual.constraints.max100') }}</li>
              <li>{{ t('userManual.constraints.max300') }}</li>
              <li>{{ t('userManual.constraints.max500') }}</li>
            </ul>
          </div>

          <div class="space-y-3">
            <h4 class="font-medium text-gray-900 dark:text-white">
              {{ t('userManual.constraints.otherTitle') }}
            </h4>
            <p class="text-gray-600 dark:text-gray-400 text-sm">
              {{ t('userManual.constraints.otherDescription') }}
            </p>
          </div>
        </DocsSection>

        <DocsSection id="quality-score" :title="t('userManual.qualityScore.title')" :level="3">
          <p class="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
            {{ t('userManual.qualityScore.intro') }}
          </p>

          <DocsScreenshot
            src="/images/docs/quality-score.png"
            :alt="t('userManual.qualityScore.screenshotAlt')"
            size="small"
          />

          <!-- Score Levels -->
          <div class="space-y-2 mt-6">
            <div class="flex items-center gap-3">
              <div class="w-3 h-3 rounded-full bg-emerald-500" />
              <span class="text-gray-700 dark:text-gray-300 text-sm">
                <strong>90-100:</strong> {{ t('userManual.qualityScore.excellent') }}
              </span>
            </div>
            <div class="flex items-center gap-3">
              <div class="w-3 h-3 rounded-full bg-emerald-400" />
              <span class="text-gray-700 dark:text-gray-300 text-sm">
                <strong>80-89:</strong> {{ t('userManual.qualityScore.veryGood') }}
              </span>
            </div>
            <div class="flex items-center gap-3">
              <div class="w-3 h-3 rounded-full bg-yellow-500" />
              <span class="text-gray-700 dark:text-gray-300 text-sm">
                <strong>60-79:</strong> {{ t('userManual.qualityScore.good') }}
              </span>
            </div>
            <div class="flex items-center gap-3">
              <div class="w-3 h-3 rounded-full bg-red-500" />
              <span class="text-gray-700 dark:text-gray-300 text-sm">
                <strong>&lt;60:</strong> {{ t('userManual.qualityScore.needsWork') }}
              </span>
            </div>
          </div>
        </DocsSection>

        <DocsSection
          id="keyboard-shortcuts"
          :title="t('userManual.keyboardShortcuts.title')"
          :level="3"
        >
          <p class="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
            {{ t('userManual.keyboardShortcuts.intro') }}
          </p>

          <div class="space-y-2">
            <DocsKeyboardShortcut
              v-for="shortcut in keyboardShortcuts"
              :key="shortcut.action"
              :keys="shortcut.keys"
              :action="shortcut.action"
            />
          </div>
        </DocsSection>

        <!-- ==================== EMAIL ENHANCER ==================== -->

        <DocsSection id="email-overview" :title="t('userManual.emailOverview.title')">
          <p class="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
            {{ t('userManual.emailOverview.intro') }}
          </p>

          <DocsScreenshot
            src="/images/docs/email-enhancer.png"
            :alt="t('userManual.emailOverview.screenshotAlt')"
            :caption="t('userManual.emailOverview.screenshotCaption')"
          />

          <DocsCallout type="tip" :title="t('userManual.emailOverview.tipTitle')">
            {{ t('userManual.emailOverview.tipContent') }}
          </DocsCallout>
        </DocsSection>

        <DocsSection id="email-workflow" :title="t('userManual.emailWorkflow.title')" :level="3">
          <div class="space-y-6">
            <!-- Step 1: Write Draft -->
            <div>
              <h4 class="font-semibold text-gray-900 dark:text-white mb-2">
                {{ t('userManual.emailWorkflow.step1.title') }}
              </h4>
              <p class="text-gray-600 dark:text-gray-400 text-sm">
                {{ t('userManual.emailWorkflow.step1.description') }}
              </p>
            </div>

            <!-- Step 2: Language Selection -->
            <div>
              <h4 class="font-semibold text-gray-900 dark:text-white mb-2">
                {{ t('userManual.emailWorkflow.step2.title') }}
              </h4>
              <p class="text-gray-600 dark:text-gray-400 text-sm">
                {{ t('userManual.emailWorkflow.step2.description') }}
              </p>
            </div>

            <!-- Step 3: Tone Selection -->
            <div>
              <h4 class="font-semibold text-gray-900 dark:text-white mb-2">
                {{ t('userManual.emailWorkflow.step3.title') }}
              </h4>
              <p class="text-gray-600 dark:text-gray-400 text-sm">
                {{ t('userManual.emailWorkflow.step3.description') }}
              </p>
            </div>

            <!-- Step 4: Get Results -->
            <div>
              <h4 class="font-semibold text-gray-900 dark:text-white mb-2">
                {{ t('userManual.emailWorkflow.step4.title') }}
              </h4>
              <p class="text-gray-600 dark:text-gray-400 text-sm">
                {{ t('userManual.emailWorkflow.step4.description') }}
              </p>
            </div>
          </div>
        </DocsSection>

        <!-- ==================== RESULTS ==================== -->

        <DocsSection id="results-overview" :title="t('userManual.resultsOverview.title')">
          <p class="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
            {{ t('userManual.resultsOverview.intro') }}
          </p>

          <DocsScreenshot
            src="/images/docs/results-page.png"
            :alt="t('userManual.resultsOverview.screenshotAlt')"
            :caption="t('userManual.resultsOverview.screenshotCaption')"
          />

          <p class="text-gray-600 dark:text-gray-400 leading-relaxed">
            {{ t('userManual.resultsOverview.description') }}
          </p>
        </DocsSection>

        <DocsSection id="export-options" :title="t('userManual.exportOptions.title')" :level="3">
          <p class="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
            {{ t('userManual.exportOptions.intro') }}
          </p>

          <div class="space-y-4">
            <!-- TXT -->
            <div class="flex items-start gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <UIcon
                name="i-heroicons-document-text"
                class="w-6 h-6 text-emerald-600 dark:text-emerald-400 flex-shrink-0"
              />
              <div>
                <h4 class="font-medium text-gray-900 dark:text-white">
                  {{ t('userManual.exportOptions.txt.title') }}
                </h4>
                <p class="text-gray-600 dark:text-gray-400 text-sm">
                  {{ t('userManual.exportOptions.txt.description') }}
                </p>
              </div>
            </div>

            <!-- MD -->
            <div class="flex items-start gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <UIcon
                name="i-heroicons-document"
                class="w-6 h-6 text-emerald-600 dark:text-emerald-400 flex-shrink-0"
              />
              <div>
                <h4 class="font-medium text-gray-900 dark:text-white">
                  {{ t('userManual.exportOptions.md.title') }}
                </h4>
                <p class="text-gray-600 dark:text-gray-400 text-sm">
                  {{ t('userManual.exportOptions.md.description') }}
                </p>
              </div>
            </div>

            <!-- JSON -->
            <div class="flex items-start gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <UIcon
                name="i-heroicons-code-bracket"
                class="w-6 h-6 text-emerald-600 dark:text-emerald-400 flex-shrink-0"
              />
              <div>
                <h4 class="font-medium text-gray-900 dark:text-white">
                  {{ t('userManual.exportOptions.json.title') }}
                </h4>
                <p class="text-gray-600 dark:text-gray-400 text-sm">
                  {{ t('userManual.exportOptions.json.description') }}
                </p>
              </div>
            </div>
          </div>
        </DocsSection>

        <!-- ==================== TIPS ==================== -->

        <DocsSection id="best-practices" :title="t('userManual.bestPractices.title')">
          <p class="text-gray-600 dark:text-gray-400 leading-relaxed mb-6">
            {{ t('userManual.bestPractices.intro') }}
          </p>

          <ul class="space-y-4">
            <li class="flex items-start gap-3">
              <UIcon
                name="i-heroicons-check-circle"
                class="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5"
              />
              <span class="text-gray-600 dark:text-gray-400">{{
                t('userManual.bestPractices.tip1')
              }}</span>
            </li>
            <li class="flex items-start gap-3">
              <UIcon
                name="i-heroicons-check-circle"
                class="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5"
              />
              <span class="text-gray-600 dark:text-gray-400">{{
                t('userManual.bestPractices.tip2')
              }}</span>
            </li>
            <li class="flex items-start gap-3">
              <UIcon
                name="i-heroicons-check-circle"
                class="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5"
              />
              <span class="text-gray-600 dark:text-gray-400">{{
                t('userManual.bestPractices.tip3')
              }}</span>
            </li>
            <li class="flex items-start gap-3">
              <UIcon
                name="i-heroicons-check-circle"
                class="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5"
              />
              <span class="text-gray-600 dark:text-gray-400">{{
                t('userManual.bestPractices.tip4')
              }}</span>
            </li>
            <li class="flex items-start gap-3">
              <UIcon
                name="i-heroicons-check-circle"
                class="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5"
              />
              <span class="text-gray-600 dark:text-gray-400">{{
                t('userManual.bestPractices.tip5')
              }}</span>
            </li>
          </ul>
        </DocsSection>

        <DocsSection id="troubleshooting" :title="t('userManual.troubleshooting.title')" :level="3">
          <div class="space-y-6">
            <!-- Rate Limit -->
            <div>
              <h4 class="font-semibold text-gray-900 dark:text-white mb-2">
                {{ t('userManual.troubleshooting.rateLimit.title') }}
              </h4>
              <p class="text-gray-600 dark:text-gray-400 text-sm mb-2">
                {{ t('userManual.troubleshooting.rateLimit.description') }}
              </p>
              <DocsCallout type="info">
                {{ t('userManual.troubleshooting.rateLimit.solution') }}
              </DocsCallout>
            </div>

            <!-- Draft Lost -->
            <div>
              <h4 class="font-semibold text-gray-900 dark:text-white mb-2">
                {{ t('userManual.troubleshooting.draftLost.title') }}
              </h4>
              <p class="text-gray-600 dark:text-gray-400 text-sm">
                {{ t('userManual.troubleshooting.draftLost.description') }}
              </p>
            </div>

            <!-- Enhancement Failed -->
            <div>
              <h4 class="font-semibold text-gray-900 dark:text-white mb-2">
                {{ t('userManual.troubleshooting.enhancementFailed.title') }}
              </h4>
              <p class="text-gray-600 dark:text-gray-400 text-sm">
                {{ t('userManual.troubleshooting.enhancementFailed.description') }}
              </p>
            </div>
          </div>
        </DocsSection>

        <!-- ==================== FOOTER ==================== -->

        <div class="mt-16 pt-8 border-t border-gray-200 dark:border-gray-700">
          <p class="text-sm text-gray-500 dark:text-gray-400 text-center">
            {{ t('userManual.footer.helpText') }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
