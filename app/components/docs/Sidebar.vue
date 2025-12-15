<template>
  <nav aria-label="Documentation navigation">
    <!-- Navigation Sections -->
    <div class="space-y-6">
      <div v-for="section in sections" :key="section.id">
        <!-- Section Header -->
        <button
          type="button"
          class="flex items-center justify-between w-full text-left cursor-pointer group"
          :aria-expanded="expandedSections.includes(section.id)"
          @click="toggleSection(section.id)"
        >
          <div class="flex items-center gap-2">
            <UIcon
              :name="section.icon"
              class="w-5 h-5 text-emerald-600 dark:text-emerald-400"
            />
            <span class="font-semibold text-gray-900 dark:text-white">
              {{ section.title }}
            </span>
          </div>
          <UIcon
            name="i-heroicons-chevron-down"
            class="w-4 h-4 text-gray-400 transition-transform duration-200"
            :class="{ 'rotate-180': expandedSections.includes(section.id) }"
          />
        </button>

        <!-- Section Items -->
        <Transition name="accordion">
          <ul
            v-if="expandedSections.includes(section.id)"
            class="mt-2 ms-7 space-y-1"
          >
            <li v-for="item in section.items" :key="item.id">
              <a
                :href="`#${item.id}`"
                class="block py-1.5 px-3 text-sm rounded-md transition-colors cursor-pointer"
                :class="[
                  activeSection === item.id
                    ? 'bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 font-medium'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700/50'
                ]"
                @click="handleNavClick"
              >
                {{ item.title }}
              </a>
            </li>
          </ul>
        </Transition>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
interface NavItem {
  id: string
  title: string
}

interface NavSection {
  id: string
  title: string
  icon: string
  items: NavItem[]
}

const props = defineProps<{
  sections: NavSection[]
  activeSection?: string
}>()

// Get mobile nav control from layout
const docsLayout = inject<{ closeMobileNav: () => void }>('docsLayout', {
  closeMobileNav: () => {}
})

// Track expanded sections - initialize with first section expanded
const getInitialExpandedSections = (): string[] => {
  const firstSection = props.sections[0]
  return firstSection ? [firstSection.id] : []
}
const expandedSections = ref<string[]>(getInitialExpandedSections())

// Toggle section expansion
const toggleSection = (sectionId: string) => {
  const index = expandedSections.value.indexOf(sectionId)
  if (index === -1) {
    expandedSections.value.push(sectionId)
  } else {
    expandedSections.value.splice(index, 1)
  }
}

// Handle navigation click (close mobile nav)
const handleNavClick = () => {
  docsLayout.closeMobileNav()
}

// Auto-expand section when active item changes
watch(() => props.activeSection, (newActive) => {
  if (newActive) {
    const parentSection = props.sections.find(s =>
      s.items.some(item => item.id === newActive)
    )
    if (parentSection && !expandedSections.value.includes(parentSection.id)) {
      expandedSections.value.push(parentSection.id)
    }
  }
}, { immediate: true })
</script>

<style scoped>
.accordion-enter-active,
.accordion-leave-active {
  transition: all 0.2s ease;
  overflow: hidden;
}

.accordion-enter-from,
.accordion-leave-to {
  opacity: 0;
  max-height: 0;
}

.accordion-enter-to,
.accordion-leave-from {
  opacity: 1;
  max-height: 500px;
}
</style>
