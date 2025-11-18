/**
 * Composable for RTL (Right-to-Left) support
 * Provides utilities for working with RTL layouts and text direction
 */
export function useRTL() {
  const { locale } = useI18n()

  /**
   * Check if current locale uses RTL direction
   */
  const isRTL = computed(() => locale.value === 'ar')

  /**
   * Get current text direction
   */
  const direction = computed(() => isRTL.value ? 'rtl' : 'ltr')

  /**
   * Get opposite direction
   */
  const oppositeDirection = computed(() => isRTL.value ? 'ltr' : 'rtl')

  /**
   * Get logical start position (left in LTR, right in RTL)
   */
  const startPosition = computed(() => isRTL.value ? 'right' : 'left')

  /**
   * Get logical end position (right in LTR, left in RTL)
   */
  const endPosition = computed(() => isRTL.value ? 'left' : 'right')

  /**
   * Get class for flipping directional icons
   */
  const iconFlipClass = computed(() => isRTL.value ? 'icon-flip' : '')

  /**
   * Get appropriate slide animation class
   * @param slideDirection - 'left' or 'right'
   */
  function getSlideAnimationClass(slideDirection: 'left' | 'right'): string {
    return `slide-in-${slideDirection}`
  }

  /**
   * Get logical margin/padding classes
   * Converts physical directions to logical ones (start/end)
   * @param side - 'left' or 'right'
   * @param type - 'margin' or 'padding'
   * @param size - size value (e.g., '1', '2', '3')
   */
  function getLogicalSpacingClass(
    side: 'left' | 'right',
    type: 'margin' | 'padding',
    size: string
  ): string {
    const prefix = type === 'margin' ? 'm' : 'p'
    const logicalSide = side === 'left' ? 's' : 'e'
    return `${prefix}${logicalSide}-${size}`
  }

  /**
   * Get text alignment class (start/end instead of left/right)
   * @param align - 'left', 'right', 'center'
   */
  function getTextAlignClass(align: 'left' | 'right' | 'center'): string {
    if (align === 'center') return 'text-center'
    return align === 'left' ? 'text-start' : 'text-end'
  }

  /**
   * Flip a numeric value for RTL (useful for transforms)
   * @param value - numeric value to flip
   */
  function flipForRTL(value: number): number {
    return isRTL.value ? -value : value
  }

  /**
   * Get flex direction class that respects RTL
   * @param direction - 'row' or 'row-reverse'
   */
  function getFlexDirectionClass(direction: 'row' | 'row-reverse'): string {
    if (isRTL.value) {
      return direction === 'row' ? 'flex-row-reverse' : 'flex-row'
    }
    return direction === 'row' ? 'flex-row' : 'flex-row-reverse'
  }

  /**
   * Get RTL-aware directional icon name
   * Flips left/right directional icons in RTL mode
   * @param iconName - Heroicons icon name
   */
  function getDirectionalIcon(iconName: string): string {
    if (!isRTL.value) return iconName

    // Map of icons that should be flipped in RTL
    const iconMap: Record<string, string> = {
      'i-heroicons-arrow-left': 'i-heroicons-arrow-right',
      'i-heroicons-arrow-right': 'i-heroicons-arrow-left',
      'i-heroicons-chevron-left': 'i-heroicons-chevron-right',
      'i-heroicons-chevron-right': 'i-heroicons-chevron-left',
      'i-heroicons-arrow-long-left': 'i-heroicons-arrow-long-right',
      'i-heroicons-arrow-long-right': 'i-heroicons-arrow-long-left',
      'i-heroicons-arrow-small-left': 'i-heroicons-arrow-small-right',
      'i-heroicons-arrow-small-right': 'i-heroicons-arrow-small-left'
    }

    return iconMap[iconName] || iconName
  }

  /**
   * Get pagination icon names (prev/next) that respect RTL
   */
  const paginationIcons = computed(() => ({
    prev: isRTL.value ? 'i-heroicons-chevron-right' : 'i-heroicons-chevron-left',
    next: isRTL.value ? 'i-heroicons-chevron-left' : 'i-heroicons-chevron-right'
  }))

  /**
   * Get back icon that respects RTL
   */
  const backIcon = computed(() =>
    isRTL.value ? 'i-heroicons-arrow-right' : 'i-heroicons-arrow-left'
  )

  /**
   * Get forward icon that respects RTL
   */
  const forwardIcon = computed(() =>
    isRTL.value ? 'i-heroicons-arrow-left' : 'i-heroicons-arrow-right'
  )

  return {
    isRTL,
    direction,
    oppositeDirection,
    startPosition,
    endPosition,
    iconFlipClass,
    paginationIcons,
    backIcon,
    forwardIcon,
    getSlideAnimationClass,
    getLogicalSpacingClass,
    getTextAlignClass,
    flipForRTL,
    getFlexDirectionClass,
    getDirectionalIcon
  }
}
