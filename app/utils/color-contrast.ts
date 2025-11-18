/**
 * Color Contrast Utility
 * Calculates WCAG 2.1 AA contrast ratios and validates accessibility
 */

/**
 * Convert hex color to RGB
 */
function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  if (!result || !result[1] || !result[2] || !result[3]) {
    return null
  }
  return {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16),
  }
}

/**
 * Calculate relative luminance
 * Based on WCAG 2.1 formula
 */
function getLuminance(r: number, g: number, b: number): number {
  const convertComponent = (val: number): number => {
    const sRGB = val / 255
    return sRGB <= 0.03928 ? sRGB / 12.92 : Math.pow((sRGB + 0.055) / 1.055, 2.4)
  }

  const rs = convertComponent(r)
  const gs = convertComponent(g)
  const bs = convertComponent(b)

  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs
}

/**
 * Calculate contrast ratio between two colors
 * Returns a ratio from 1:1 to 21:1
 */
export function getContrastRatio(color1: string, color2: string): number {
  const rgb1 = hexToRgb(color1)
  const rgb2 = hexToRgb(color2)

  if (!rgb1 || !rgb2) {
    console.warn('Invalid color format provided')
    return 1
  }

  const lum1 = getLuminance(rgb1.r, rgb1.g, rgb1.b)
  const lum2 = getLuminance(rgb2.r, rgb2.g, rgb2.b)

  const lighter = Math.max(lum1, lum2)
  const darker = Math.min(lum1, lum2)

  return (lighter + 0.05) / (darker + 0.05)
}

/**
 * Check if contrast ratio meets WCAG AA standards
 */
export function meetsWCAGAA(
  foreground: string,
  background: string,
  options: {
    large?: boolean // Large text (18pt+ or 14pt+ bold)
    ui?: boolean // UI elements and graphics
  } = {}
): { passes: boolean; ratio: number; required: number; level: 'AAA' | 'AA' | 'FAIL' } {
  const ratio = getContrastRatio(foreground, background)

  let required = 4.5 // Normal text AA
  if (options.large) {
    required = 3.0 // Large text AA
  } else if (options.ui) {
    required = 3.0 // UI elements AA
  }

  const passes = ratio >= required

  // Check for AAA compliance (7:1 for normal, 4.5:1 for large)
  const aaaRequired = options.large ? 4.5 : 7.0
  const passesAAA = ratio >= aaaRequired

  return {
    passes,
    ratio: Math.round(ratio * 100) / 100,
    required,
    level: passesAAA ? 'AAA' : passes ? 'AA' : 'FAIL',
  }
}

/**
 * Get a list of color combinations that need review
 */
export function getContrastReport(): Array<{
  name: string
  foreground: string
  background: string
  ratio: number
  passes: boolean
  level: 'AAA' | 'AA' | 'FAIL'
}> {
  const colors = {
    // Primary colors
    emerald: '#45cf7b',
    navy: '#000046',
    white: '#ffffff',
    black: '#000000',

    // Grayscale
    gray50: '#f9fafb',
    gray100: '#f3f4f6',
    gray200: '#e5e7eb',
    gray300: '#d1d5db',
    gray400: '#9ca3af',
    gray500: '#6b7280',
    gray600: '#4b5563',
    gray700: '#374151',
    gray800: '#1f2937',
    gray900: '#111827',

    // Emerald shades
    emerald50: '#f0fdf5',
    emerald100: '#dcfce8',
    emerald200: '#bbf7d1',
    emerald300: '#86efac',
    emerald400: '#4ade80',
    emerald500: '#45cf7b',
    emerald600: '#16a34a',
    emerald700: '#15803d',
    emerald800: '#166534',
    emerald900: '#14532d',

    // Navy shades
    navy50: '#e6e6f0',
    navy100: '#b3b3d6',
    navy200: '#8080bd',
    navy300: '#4d4da3',
    navy400: '#26268f',
    navy500: '#000046',
    navy600: '#00003f',
    navy700: '#000036',
    navy800: '#00002e',
    navy900: '#000020',
  }

  const combinations = [
    // Primary combinations
    { name: 'Emerald on White', foreground: colors.emerald, background: colors.white },
    { name: 'Navy on White', foreground: colors.navy, background: colors.white },
    { name: 'White on Emerald', foreground: colors.white, background: colors.emerald },
    { name: 'White on Navy', foreground: colors.white, background: colors.navy },

    // Text on backgrounds
    { name: 'Gray900 on White', foreground: colors.gray900, background: colors.white },
    { name: 'Gray800 on White', foreground: colors.gray800, background: colors.white },
    { name: 'Gray700 on White', foreground: colors.gray700, background: colors.white },
    { name: 'Gray600 on White', foreground: colors.gray600, background: colors.white },
    { name: 'Gray500 on White', foreground: colors.gray500, background: colors.white },

    // Dark mode combinations
    { name: 'White on Gray900', foreground: colors.white, background: colors.gray900 },
    { name: 'Gray100 on Gray900', foreground: colors.gray100, background: colors.gray900 },
    { name: 'Gray200 on Gray800', foreground: colors.gray200, background: colors.gray800 },

    // Button combinations
    { name: 'White on Emerald600', foreground: colors.white, background: colors.emerald600 },
    { name: 'White on Emerald700', foreground: colors.white, background: colors.emerald700 },

    // Links and interactive elements
    { name: 'Emerald600 on White', foreground: colors.emerald600, background: colors.white },
    { name: 'Emerald700 on White', foreground: colors.emerald700, background: colors.white },
    { name: 'Navy500 on Gray50', foreground: colors.navy500, background: colors.gray50 },
  ]

  return combinations.map((combo) => {
    const result = meetsWCAGAA(combo.foreground, combo.background)
    return {
      name: combo.name,
      foreground: combo.foreground,
      background: combo.background,
      ratio: result.ratio,
      passes: result.passes,
      level: result.level,
    }
  })
}

/**
 * Suggest an accessible alternative color
 */
export function suggestAccessibleColor(
  foreground: string,
  background: string,
  targetRatio: number = 4.5
): string | null {
  const bgRgb = hexToRgb(background)
  if (!bgRgb) return null

  const bgLum = getLuminance(bgRgb.r, bgRgb.g, bgRgb.b)

  // Calculate target luminance for foreground
  // Using: ratio = (lighter + 0.05) / (darker + 0.05)
  let targetLum: number

  if (bgLum > 0.5) {
    // Light background - need darker foreground
    targetLum = (bgLum + 0.05) / targetRatio - 0.05
  } else {
    // Dark background - need lighter foreground
    targetLum = targetRatio * (bgLum + 0.05) - 0.05
  }

  // Convert target luminance to RGB (simplified approach)
  const intensity = targetLum <= 0.03928 ? targetLum * 12.92 : Math.pow((targetLum + 0.055) / 1.055, 1 / 2.4)
  const value = Math.round(intensity * 255)
  const hex = value.toString(16).padStart(2, '0')

  return `#${hex}${hex}${hex}`
}

/**
 * Log contrast report to console (for development)
 */
export function logContrastReport(): void {
  const report = getContrastReport()

  console.group('🎨 Color Contrast Report (WCAG 2.1 AA)')
  console.log('Target: 4.5:1 for normal text, 3:1 for large text/UI elements')
  console.log('')

  const failing = report.filter((r) => !r.passes)
  const passing = report.filter((r) => r.passes)

  if (failing.length > 0) {
    console.group(`❌ Failing (${failing.length})`)
    failing.forEach((item) => {
      console.log(`${item.name}: ${item.ratio}:1 (${item.level})`)
    })
    console.groupEnd()
    console.log('')
  }

  if (passing.length > 0) {
    console.group(`✅ Passing (${passing.length})`)
    passing.forEach((item) => {
      console.log(`${item.name}: ${item.ratio}:1 (${item.level})`)
    })
    console.groupEnd()
  }

  console.groupEnd()
}
