export default defineAppConfig({
  ui: {
    colors: {
      primary: 'emerald',
      secondary: 'navy',
      success: 'green',
      info: 'blue',
      warning: 'yellow',
      error: 'red',
      neutral: 'slate'
    },
    // Override toaster position to appear below navbar (top-20 = 80px)
    toaster: {
      compoundVariants: [{
        position: ['top-left', 'top-center', 'top-right'],
        class: {
          viewport: 'top-20'
        }
      }]
    },
    // Override badge styles for better contrast (WCAG AA compliance)
    badge: {
      default: {
        size: {
          xs: 'text-xs px-1.5 py-0.5', // Changed from text-[8px] to text-xs (12px minimum)
          sm: 'text-xs px-2 py-1'
        },
        color: {
          // Override primary badge to use darker emerald-700 for better contrast
          primary: {
            solid: 'bg-emerald-700 text-white ring-1 ring-emerald-700',
            soft: 'bg-emerald-100 text-emerald-800 ring-1 ring-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:ring-emerald-800'
          },
          emerald: {
            solid: 'bg-emerald-700 text-white ring-1 ring-emerald-700',
            soft: 'bg-emerald-100 text-emerald-800 ring-1 ring-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:ring-emerald-800'
          }
        }
      }
    }
  }
})
