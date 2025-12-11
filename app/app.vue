<script setup lang="ts">
const { locale } = useI18n()

// Watch for locale changes and update HTML attributes
watchEffect(() => {
  const dir = locale.value === 'ar' ? 'rtl' : 'ltr'
  const lang = locale.value

  if (import.meta.client) {
    document.documentElement.setAttribute('dir', dir)
    document.documentElement.setAttribute('lang', lang)
  }
})

// Set initial values on server-side
useHead({
  htmlAttrs: {
    dir: computed(() => locale.value === 'ar' ? 'rtl' : 'ltr'),
    lang: computed(() => locale.value)
  }
})

// Dynamic toast position based on locale (top-right for EN, top-left for AR)
// Offset 80px from top to appear below navbar (h-16 = 64px + 16px padding)
const toasterConfig = computed(() => ({
  position: (locale.value === 'ar' ? 'top-left' : 'top-right') as 'top-left' | 'top-right',
  offset: 80
}))
</script>

<template>
  <UApp :toaster="toasterConfig">
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </UApp>
</template>
