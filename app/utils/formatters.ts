/**
 * Formatting utilities for display and presentation
 * Provides consistent formatting for scores, dates, file sizes, and text
 */

/**
 * Format quality score with label
 * @param score - Quality score (0-100)
 * @returns Formatted score with label
 */
export function formatQualityScore(score: number): string {
  const roundedScore = Math.round(score)
  return `${roundedScore}/100`
}

/**
 * Get quality score label
 * @param score - Quality score (0-100)
 * @returns Label describing the score quality
 */
export function getQualityScoreLabel(score: number): string {
  if (score >= 90) return 'Excellent'
  if (score >= 75) return 'Good'
  if (score >= 60) return 'Fair'
  if (score >= 40) return 'Needs Improvement'
  return 'Poor'
}

/**
 * Get quality score color class (for Tailwind CSS)
 * @param score - Quality score (0-100)
 * @returns Tailwind color class
 */
export function getQualityScoreColor(score: number): string {
  if (score >= 75) return 'text-emerald-700'
  if (score >= 60) return 'text-yellow-700'
  return 'text-red-700'
}

/**
 * Get quality score background color class (for Tailwind CSS)
 * @param score - Quality score (0-100)
 * @returns Tailwind background color class
 */
export function getQualityScoreBgColor(score: number): string {
  if (score >= 75) return 'bg-emerald-100'
  if (score >= 60) return 'bg-yellow-100'
  return 'bg-red-100'
}

/**
 * Format timestamp to relative time (e.g., "2 minutes ago", "yesterday")
 * @param date - Date to format
 * @param locale - Locale for formatting (default: 'en')
 * @returns Relative time string
 */
export function formatRelativeTime(date: Date | string, locale = 'en'): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  const now = new Date()
  const diffMs = now.getTime() - dateObj.getTime()
  const diffSec = Math.floor(diffMs / 1000)
  const diffMin = Math.floor(diffSec / 60)
  const diffHour = Math.floor(diffMin / 60)
  const diffDay = Math.floor(diffHour / 24)

  // Just now (< 1 minute)
  if (diffSec < 60) {
    return locale === 'ar' ? 'الآن' : 'just now'
  }

  // Minutes ago
  if (diffMin < 60) {
    if (locale === 'ar') {
      return diffMin === 1 ? 'منذ دقيقة' : `منذ ${diffMin} دقائق`
    }
    return diffMin === 1 ? '1 minute ago' : `${diffMin} minutes ago`
  }

  // Hours ago
  if (diffHour < 24) {
    if (locale === 'ar') {
      return diffHour === 1 ? 'منذ ساعة' : `منذ ${diffHour} ساعات`
    }
    return diffHour === 1 ? '1 hour ago' : `${diffHour} hours ago`
  }

  // Days ago
  if (diffDay < 7) {
    if (locale === 'ar') {
      return diffDay === 1 ? 'منذ يوم' : `منذ ${diffDay} أيام`
    }
    return diffDay === 1 ? 'yesterday' : `${diffDay} days ago`
  }

  // Absolute date for older items
  return formatAbsoluteDate(dateObj, locale)
}

/**
 * Format timestamp to absolute date (e.g., "Nov 17, 2025" or "12:30 PM")
 * @param date - Date to format
 * @param locale - Locale for formatting (default: 'en')
 * @param includeTime - Whether to include time (default: false)
 * @returns Formatted date string
 */
export function formatAbsoluteDate(
  date: Date | string,
  locale = 'en',
  includeTime = false
): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date

  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }

  if (includeTime) {
    options.hour = '2-digit'
    options.minute = '2-digit'
  }

  return dateObj.toLocaleDateString(locale === 'ar' ? 'ar-SA' : 'en-US', options)
}

/**
 * Format file size from bytes to human-readable format
 * @param bytes - File size in bytes
 * @param decimals - Number of decimal places (default: 2)
 * @returns Formatted file size (e.g., "1.5 KB", "2.3 MB")
 */
export function formatFileSize(bytes: number, decimals = 2): string {
  if (bytes === 0) return '0 Bytes'

  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']

  const i = Math.floor(Math.log(bytes) / Math.log(k))
  const size = Number.parseFloat((bytes / k ** i).toFixed(dm))

  return `${size} ${sizes[i]}`
}

/**
 * Truncate text to specified length with ellipsis
 * @param text - Text to truncate
 * @param maxLength - Maximum length before truncation
 * @param suffix - Suffix to add when truncated (default: '...')
 * @returns Truncated text
 */
export function truncateText(text: string, maxLength: number, suffix = '...'): string {
  if (text.length <= maxLength) {
    return text
  }

  return text.slice(0, maxLength - suffix.length).trim() + suffix
}

/**
 * Truncate text at word boundary
 * @param text - Text to truncate
 * @param maxLength - Maximum length before truncation
 * @param suffix - Suffix to add when truncated (default: '...')
 * @returns Truncated text at word boundary
 */
export function truncateAtWord(text: string, maxLength: number, suffix = '...'): string {
  if (text.length <= maxLength) {
    return text
  }

  const truncated = text.slice(0, maxLength - suffix.length)
  const lastSpace = truncated.lastIndexOf(' ')

  if (lastSpace > 0) {
    return truncated.slice(0, lastSpace).trim() + suffix
  }

  return truncated.trim() + suffix
}

/**
 * Format number with thousands separator
 * @param num - Number to format
 * @param locale - Locale for formatting (default: 'en')
 * @returns Formatted number
 */
export function formatNumber(num: number, locale = 'en'): string {
  return num.toLocaleString(locale === 'ar' ? 'ar-SA' : 'en-US')
}

/**
 * Format percentage
 * @param value - Value (0-1 or 0-100)
 * @param isDecimal - Whether value is decimal (0-1) or percentage (0-100)
 * @param decimals - Number of decimal places (default: 0)
 * @returns Formatted percentage
 */
export function formatPercentage(value: number, isDecimal = false, decimals = 0): string {
  const percentage = isDecimal ? value * 100 : value
  return `${percentage.toFixed(decimals)}%`
}

/**
 * Format duration in milliseconds to human-readable format
 * @param ms - Duration in milliseconds
 * @returns Formatted duration (e.g., "1.5s", "250ms")
 */
export function formatDuration(ms: number): string {
  if (ms < 1000) {
    return `${Math.round(ms)}ms`
  }

  const seconds = ms / 1000
  if (seconds < 60) {
    return `${seconds.toFixed(1)}s`
  }

  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = Math.round(seconds % 60)
  return remainingSeconds > 0 ? `${minutes}m ${remainingSeconds}s` : `${minutes}m`
}

/**
 * Format word count
 * @param text - Text to count words
 * @returns Word count
 */
export function getWordCount(text: string): number {
  return text.trim().split(/\s+/).filter(word => word.length > 0).length
}

/**
 * Format character count with limit
 * @param text - Text to count
 * @param limit - Character limit
 * @returns Formatted count (e.g., "150/1000")
 */
export function formatCharCount(text: string, limit: number): string {
  return `${text.length}/${limit}`
}

/**
 * Get text excerpt (first N characters with ellipsis if needed)
 * @param text - Full text
 * @param length - Desired excerpt length
 * @returns Excerpt
 */
export function getExcerpt(text: string, length = 100): string {
  return truncateAtWord(text, length)
}

/**
 * Pluralize word based on count
 * @param count - Count to check
 * @param singular - Singular form
 * @param plural - Plural form (optional, defaults to singular + 's')
 * @returns Pluralized word
 */
export function pluralize(count: number, singular: string, plural?: string): string {
  if (count === 1) {
    return singular
  }
  return plural || `${singular}s`
}

/**
 * Format list with proper separators and conjunctions
 * @param items - Array of items to format
 * @param locale - Locale for formatting (default: 'en')
 * @returns Formatted list (e.g., "A, B, and C")
 */
export function formatList(items: string[], locale = 'en'): string {
  if (items.length === 0) return ''
  if (items.length === 1) return items[0] || ''
  if (items.length === 2) {
    const conjunction = locale === 'ar' ? 'و' : 'and'
    return `${items[0] || ''} ${conjunction} ${items[1] || ''}`
  }

  const conjunction = locale === 'ar' ? 'و' : 'and'
  const lastItem = items[items.length - 1] || ''
  const otherItems = items.slice(0, -1).join(', ')
  return `${otherItems}, ${conjunction} ${lastItem}`
}

/**
 * Capitalize first letter of string
 * @param text - Text to capitalize
 * @returns Capitalized text
 */
export function capitalize(text: string): string {
  if (!text) return ''
  return text.charAt(0).toUpperCase() + text.slice(1)
}

/**
 * Convert string to title case
 * @param text - Text to convert
 * @returns Title cased text
 */
export function toTitleCase(text: string): string {
  return text
    .toLowerCase()
    .split(' ')
    .map(word => capitalize(word))
    .join(' ')
}
