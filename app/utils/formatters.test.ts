/**
 * Unit tests for formatting utilities
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import {
  formatQualityScore,
  getQualityScoreLabel,
  getQualityScoreColor,
  getQualityScoreBgColor,
  formatRelativeTime,
  formatAbsoluteDate,
  formatFileSize,
  truncateText,
  truncateAtWord,
  formatNumber,
  formatPercentage,
  formatDuration,
  getWordCount,
  formatCharCount,
  getExcerpt,
  pluralize,
  formatList,
  capitalize,
  toTitleCase,
} from './formatters'

describe('formatters', () => {
  describe('formatQualityScore', () => {
    it('should format score with /100', () => {
      expect(formatQualityScore(85)).toBe('85/100')
    })

    it('should round decimal scores', () => {
      expect(formatQualityScore(85.7)).toBe('86/100')
      expect(formatQualityScore(85.4)).toBe('85/100')
    })

    it('should handle edge cases', () => {
      expect(formatQualityScore(0)).toBe('0/100')
      expect(formatQualityScore(100)).toBe('100/100')
    })
  })

  describe('getQualityScoreLabel', () => {
    it('should return "Excellent" for 90+', () => {
      expect(getQualityScoreLabel(90)).toBe('Excellent')
      expect(getQualityScoreLabel(95)).toBe('Excellent')
      expect(getQualityScoreLabel(100)).toBe('Excellent')
    })

    it('should return "Good" for 75-89', () => {
      expect(getQualityScoreLabel(75)).toBe('Good')
      expect(getQualityScoreLabel(80)).toBe('Good')
      expect(getQualityScoreLabel(89)).toBe('Good')
    })

    it('should return "Fair" for 60-74', () => {
      expect(getQualityScoreLabel(60)).toBe('Fair')
      expect(getQualityScoreLabel(65)).toBe('Fair')
      expect(getQualityScoreLabel(74)).toBe('Fair')
    })

    it('should return "Needs Improvement" for 40-59', () => {
      expect(getQualityScoreLabel(40)).toBe('Needs Improvement')
      expect(getQualityScoreLabel(50)).toBe('Needs Improvement')
      expect(getQualityScoreLabel(59)).toBe('Needs Improvement')
    })

    it('should return "Poor" for below 40', () => {
      expect(getQualityScoreLabel(0)).toBe('Poor')
      expect(getQualityScoreLabel(20)).toBe('Poor')
      expect(getQualityScoreLabel(39)).toBe('Poor')
    })
  })

  describe('getQualityScoreColor', () => {
    it('should return emerald for 75+', () => {
      expect(getQualityScoreColor(75)).toBe('text-emerald-700')
      expect(getQualityScoreColor(90)).toBe('text-emerald-700')
    })

    it('should return yellow for 60-74', () => {
      expect(getQualityScoreColor(60)).toBe('text-yellow-700')
      expect(getQualityScoreColor(70)).toBe('text-yellow-700')
    })

    it('should return red for below 60', () => {
      expect(getQualityScoreColor(0)).toBe('text-red-700')
      expect(getQualityScoreColor(50)).toBe('text-red-700')
      expect(getQualityScoreColor(59)).toBe('text-red-700')
    })
  })

  describe('getQualityScoreBgColor', () => {
    it('should return correct background colors', () => {
      expect(getQualityScoreBgColor(80)).toBe('bg-emerald-100')
      expect(getQualityScoreBgColor(65)).toBe('bg-yellow-100')
      expect(getQualityScoreBgColor(40)).toBe('bg-red-100')
    })
  })

  describe('formatRelativeTime', () => {
    beforeEach(() => {
      // Mock the current time
      vi.useFakeTimers()
      vi.setSystemTime(new Date('2025-11-18T12:00:00Z'))
    })

    afterEach(() => {
      vi.useRealTimers()
    })

    it('should return "just now" for recent times (EN)', () => {
      const date = new Date('2025-11-18T11:59:30Z')
      expect(formatRelativeTime(date, 'en')).toBe('just now')
    })

    it('should return minutes ago (EN)', () => {
      const date1 = new Date('2025-11-18T11:59:00Z')
      expect(formatRelativeTime(date1, 'en')).toBe('1 minute ago')

      const date5 = new Date('2025-11-18T11:55:00Z')
      expect(formatRelativeTime(date5, 'en')).toBe('5 minutes ago')
    })

    it('should return hours ago (EN)', () => {
      const date1 = new Date('2025-11-18T11:00:00Z')
      expect(formatRelativeTime(date1, 'en')).toBe('1 hour ago')

      const date5 = new Date('2025-11-18T07:00:00Z')
      expect(formatRelativeTime(date5, 'en')).toBe('5 hours ago')
    })

    it('should return days ago (EN)', () => {
      const yesterday = new Date('2025-11-17T12:00:00Z')
      expect(formatRelativeTime(yesterday, 'en')).toBe('yesterday')

      const date3 = new Date('2025-11-15T12:00:00Z')
      expect(formatRelativeTime(date3, 'en')).toBe('3 days ago')
    })

    it('should return absolute date for older items', () => {
      const oldDate = new Date('2025-11-10T12:00:00Z')
      const result = formatRelativeTime(oldDate, 'en')
      expect(result).toContain('Nov')
    })

    it('should handle Arabic locale', () => {
      const date = new Date('2025-11-18T11:59:30Z')
      expect(formatRelativeTime(date, 'ar')).toBe('الآن')

      const date1min = new Date('2025-11-18T11:59:00Z')
      expect(formatRelativeTime(date1min, 'ar')).toBe('منذ دقيقة')

      const date5min = new Date('2025-11-18T11:55:00Z')
      expect(formatRelativeTime(date5min, 'ar')).toContain('منذ')
    })

    it('should accept string dates', () => {
      const dateString = '2025-11-18T11:59:00Z'
      expect(formatRelativeTime(dateString, 'en')).toBe('1 minute ago')
    })
  })

  describe('formatAbsoluteDate', () => {
    it('should format date without time', () => {
      const date = new Date('2025-11-18T12:30:00Z')
      const result = formatAbsoluteDate(date, 'en', false)
      expect(result).toContain('Nov')
      expect(result).toContain('18')
      expect(result).toContain('2025')
    })

    it('should format date with time', () => {
      const date = new Date('2025-11-18T12:30:00Z')
      const result = formatAbsoluteDate(date, 'en', true)
      expect(result).toContain('Nov')
      expect(result).toContain('18')
      expect(result).toContain('2025')
    })

    it('should accept string dates', () => {
      const dateString = '2025-11-18T12:30:00Z'
      const result = formatAbsoluteDate(dateString, 'en', false)
      expect(result).toContain('2025')
    })
  })

  describe('formatFileSize', () => {
    it('should format bytes', () => {
      expect(formatFileSize(0)).toBe('0 Bytes')
      expect(formatFileSize(500)).toBe('500 Bytes')
    })

    it('should format KB', () => {
      expect(formatFileSize(1024)).toBe('1 KB')
      expect(formatFileSize(1536)).toBe('1.5 KB')
    })

    it('should format MB', () => {
      expect(formatFileSize(1024 * 1024)).toBe('1 MB')
      expect(formatFileSize(2.5 * 1024 * 1024)).toBe('2.5 MB')
    })

    it('should format GB', () => {
      expect(formatFileSize(1024 * 1024 * 1024)).toBe('1 GB')
    })

    it('should respect decimals parameter', () => {
      expect(formatFileSize(1536, 0)).toBe('2 KB')
      expect(formatFileSize(1536, 1)).toBe('1.5 KB')
    })
  })

  describe('truncateText', () => {
    it('should not truncate short text', () => {
      expect(truncateText('Hello', 10)).toBe('Hello')
    })

    it('should truncate long text', () => {
      expect(truncateText('Hello World', 8)).toBe('Hello...')
    })

    it('should trim whitespace before adding suffix', () => {
      expect(truncateText('Hello World', 7)).toBe('Hell...')
    })

    it('should use custom suffix', () => {
      expect(truncateText('Hello World', 8, '…')).toBe('Hello W…')
    })

    it('should handle exact length', () => {
      expect(truncateText('Hello', 5)).toBe('Hello')
    })
  })

  describe('truncateAtWord', () => {
    it('should not truncate short text', () => {
      expect(truncateAtWord('Hello World', 20)).toBe('Hello World')
    })

    it('should truncate at word boundary', () => {
      // 12 chars - 3 (suffix) = 9 chars max, "Hello Wor" -> last space at 5 -> "Hello..."
      expect(truncateAtWord('Hello World Test', 12)).toBe('Hello...')
    })

    it('should truncate mid-word if no space found', () => {
      expect(truncateAtWord('HelloWorld', 8)).toBe('Hello...')
    })

    it('should use custom suffix', () => {
      // 12 chars - 1 (suffix) = 11 chars max, "Hello World" has space at index 5, so it truncates to "Hello…"
      expect(truncateAtWord('Hello World Test', 12, '…')).toBe('Hello…')
    })
  })

  describe('formatNumber', () => {
    it('should format numbers with commas (EN)', () => {
      expect(formatNumber(1000, 'en')).toBe('1,000')
      expect(formatNumber(1000000, 'en')).toBe('1,000,000')
    })

    it('should handle small numbers', () => {
      expect(formatNumber(42, 'en')).toBe('42')
    })

    it('should format for Arabic locale', () => {
      const result = formatNumber(1000, 'ar')
      expect(result).toBeTruthy()
    })
  })

  describe('formatPercentage', () => {
    it('should format percentage (0-100)', () => {
      expect(formatPercentage(50, false, 0)).toBe('50%')
      expect(formatPercentage(75.5, false, 1)).toBe('75.5%')
    })

    it('should format decimal (0-1)', () => {
      expect(formatPercentage(0.5, true, 0)).toBe('50%')
      expect(formatPercentage(0.755, true, 1)).toBe('75.5%')
    })

    it('should respect decimals parameter', () => {
      expect(formatPercentage(75.789, false, 0)).toBe('76%')
      expect(formatPercentage(75.789, false, 2)).toBe('75.79%')
    })
  })

  describe('formatDuration', () => {
    it('should format milliseconds', () => {
      expect(formatDuration(250)).toBe('250ms')
      expect(formatDuration(999)).toBe('999ms')
    })

    it('should format seconds', () => {
      expect(formatDuration(1000)).toBe('1.0s')
      expect(formatDuration(1500)).toBe('1.5s')
      expect(formatDuration(5000)).toBe('5.0s')
    })

    it('should format minutes and seconds', () => {
      expect(formatDuration(60000)).toBe('1m')
      expect(formatDuration(90000)).toBe('1m 30s')
      expect(formatDuration(125000)).toBe('2m 5s')
    })

    it('should handle exact minutes', () => {
      expect(formatDuration(120000)).toBe('2m')
    })
  })

  describe('getWordCount', () => {
    it('should count words correctly', () => {
      expect(getWordCount('Hello World')).toBe(2)
      expect(getWordCount('This is a test')).toBe(4)
    })

    it('should handle multiple spaces', () => {
      expect(getWordCount('Hello  World')).toBe(2)
      expect(getWordCount('  Hello   World  ')).toBe(2)
    })

    it('should handle empty string', () => {
      expect(getWordCount('')).toBe(0)
      expect(getWordCount('   ')).toBe(0)
    })

    it('should handle single word', () => {
      expect(getWordCount('Hello')).toBe(1)
    })
  })

  describe('formatCharCount', () => {
    it('should format character count with limit', () => {
      expect(formatCharCount('Hello', 100)).toBe('5/100')
      expect(formatCharCount('Hello World', 50)).toBe('11/50')
    })

    it('should handle empty string', () => {
      expect(formatCharCount('', 100)).toBe('0/100')
    })

    it('should handle count at limit', () => {
      expect(formatCharCount('Hello', 5)).toBe('5/5')
    })
  })

  describe('getExcerpt', () => {
    it('should return short text as-is', () => {
      expect(getExcerpt('Hello', 100)).toBe('Hello')
    })

    it('should truncate long text at word boundary', () => {
      const longText = 'This is a very long text that needs to be truncated at a reasonable word boundary'
      const result = getExcerpt(longText, 30)
      expect(result).toContain('...')
      expect(result.length).toBeLessThanOrEqual(33)
    })

    it('should use default length of 100', () => {
      const longText = 'A'.repeat(200)
      const result = getExcerpt(longText)
      expect(result.length).toBeLessThanOrEqual(103)
    })
  })

  describe('pluralize', () => {
    it('should return singular for count of 1', () => {
      expect(pluralize(1, 'item')).toBe('item')
    })

    it('should return plural for count other than 1', () => {
      expect(pluralize(0, 'item')).toBe('items')
      expect(pluralize(2, 'item')).toBe('items')
      expect(pluralize(5, 'item')).toBe('items')
    })

    it('should use custom plural form', () => {
      expect(pluralize(2, 'child', 'children')).toBe('children')
      expect(pluralize(1, 'child', 'children')).toBe('child')
    })

    it('should handle irregular plurals', () => {
      expect(pluralize(2, 'person', 'people')).toBe('people')
      expect(pluralize(0, 'mouse', 'mice')).toBe('mice')
    })
  })

  describe('formatList', () => {
    it('should handle empty array', () => {
      expect(formatList([])).toBe('')
    })

    it('should handle single item', () => {
      expect(formatList(['Apple'])).toBe('Apple')
    })

    it('should handle two items (EN)', () => {
      expect(formatList(['Apple', 'Banana'], 'en')).toBe('Apple and Banana')
    })

    it('should handle two items (AR)', () => {
      expect(formatList(['Apple', 'Banana'], 'ar')).toBe('Apple و Banana')
    })

    it('should handle three or more items (EN)', () => {
      expect(formatList(['Apple', 'Banana', 'Cherry'], 'en')).toBe('Apple, Banana, and Cherry')
    })

    it('should handle three or more items (AR)', () => {
      expect(formatList(['Apple', 'Banana', 'Cherry'], 'ar')).toBe('Apple, Banana, و Cherry')
    })

    it('should handle many items', () => {
      const items = ['A', 'B', 'C', 'D', 'E']
      expect(formatList(items, 'en')).toBe('A, B, C, D, and E')
    })
  })

  describe('capitalize', () => {
    it('should capitalize first letter', () => {
      expect(capitalize('hello')).toBe('Hello')
      expect(capitalize('world')).toBe('World')
    })

    it('should handle already capitalized', () => {
      expect(capitalize('Hello')).toBe('Hello')
    })

    it('should handle single character', () => {
      expect(capitalize('a')).toBe('A')
    })

    it('should handle empty string', () => {
      expect(capitalize('')).toBe('')
    })

    it('should only capitalize first letter', () => {
      expect(capitalize('hELLO')).toBe('HELLO')
    })
  })

  describe('toTitleCase', () => {
    it('should convert to title case', () => {
      expect(toTitleCase('hello world')).toBe('Hello World')
      expect(toTitleCase('the quick brown fox')).toBe('The Quick Brown Fox')
    })

    it('should handle already title case', () => {
      expect(toTitleCase('Hello World')).toBe('Hello World')
    })

    it('should handle all caps', () => {
      expect(toTitleCase('HELLO WORLD')).toBe('Hello World')
    })

    it('should handle single word', () => {
      expect(toTitleCase('hello')).toBe('Hello')
    })

    it('should handle mixed case', () => {
      expect(toTitleCase('hElLo WoRlD')).toBe('Hello World')
    })
  })
})
