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
</script>

<template>
  <UApp>
    <NuxtPage />
  </UApp>
</template>
