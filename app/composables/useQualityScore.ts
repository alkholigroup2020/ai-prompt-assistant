import type { FormInput, QualityScoreBreakdown } from '~/types'

export interface Suggestion {
  id: string
  type: 'critical' | 'important' | 'minor'
  category: 'clarity' | 'specificity' | 'context' | 'structure' | 'completeness'
  message: string
  action?: {
    label: string
    field: string
    value: string
  }
}

interface QualityAnalysis {
  score: number
  breakdown: QualityScoreBreakdown
  completeness: number
  suggestions: Suggestion[]
  isComplete: boolean
}

/**
 * Composable for calculating real-time prompt quality scores
 */
export function useQualityScore() {
  /**
   * Calculate quality score for form input
   */
  function calculate(input: FormInput): QualityAnalysis {
    const breakdown = calculateBreakdown(input)
    const completeness = calculateCompleteness(input)
    const suggestions = generateSuggestions(input, breakdown, completeness)

    // Overall score is weighted average of breakdown scores
    const score = Math.round(
      (breakdown.clarity * 0.25 +
        breakdown.specificity * 0.25 +
        breakdown.context * 0.2 +
        breakdown.structure * 0.15 +
        breakdown.completeness * 0.15) *
        100
    )

    return {
      score: Math.max(0, Math.min(100, score)),
      breakdown,
      completeness,
      suggestions,
      isComplete: completeness === 100,
    }
  }

  /**
   * Calculate detailed score breakdown
   */
  function calculateBreakdown(input: FormInput): QualityScoreBreakdown {
    return {
      clarity: calculateClarity(input),
      specificity: calculateSpecificity(input),
      context: calculateContext(input),
      structure: calculateStructure(input),
      completeness: calculateCompletenessScore(input),
    }
  }

  /**
   * Calculate clarity score (0-1)
   */
  function calculateClarity(input: FormInput): number {
    let score = 0

    // Role is clear
    if (input.role && input.role.length >= 3) {
      score += 0.3
    }

    // Audience is clear
    if (input.audience && input.audience.length >= 3) {
      score += 0.3
    }

    // Tone is specified
    if (input.tone) {
      score += 0.2
    }

    // Output format is specified
    if (input.outputFormat) {
      score += 0.2
    }

    return score
  }

  /**
   * Calculate specificity score (0-1)
   */
  function calculateSpecificity(input: FormInput): number {
    let score = 0

    // Task is detailed (min 50 chars for good specificity)
    if (input.task) {
      if (input.task.length >= 200) {
        score += 0.5
      } else if (input.task.length >= 100) {
        score += 0.35
      } else if (input.task.length >= 50) {
        score += 0.2
      }
    }

    // Constraints are specified
    if (input.constraints && input.constraints.length > 0) {
      score += 0.3
    }

    // Examples provided
    if (input.examples && input.examples.length >= 20) {
      score += 0.2
    }

    return score
  }

  /**
   * Calculate context score (0-1)
   */
  function calculateContext(input: FormInput): number {
    let score = 0.3 // Base score for having basic info

    // Additional context provided
    if (input.context && input.context.length >= 50) {
      score += 0.4
    } else if (input.context && input.context.length >= 20) {
      score += 0.2
    }

    // Examples add context
    if (input.examples && input.examples.length >= 50) {
      score += 0.3
    } else if (input.examples && input.examples.length >= 20) {
      score += 0.15
    }

    return Math.min(1, score)
  }

  /**
   * Calculate structure score (0-1)
   */
  function calculateStructure(input: FormInput): number {
    let score = 0.4 // Base score for using the form

    // Well-structured task (check for organization indicators)
    if (input.task) {
      const hasNumbering = /\d+\.|[a-z]\)/i.test(input.task)
      const hasBullets = /[-*•]/.test(input.task)
      const hasNewlines = /\n/.test(input.task)

      if (hasNumbering || hasBullets) {
        score += 0.2
      }
      if (hasNewlines) {
        score += 0.1
      }
    }

    // Multiple fields filled
    const filledFields = [
      input.role,
      input.audience,
      input.task,
      input.tone,
      input.outputFormat,
      input.constraints?.length,
      input.examples,
      input.context,
    ].filter(Boolean).length

    score += (filledFields / 8) * 0.3

    return Math.min(1, score)
  }

  /**
   * Calculate completeness score (0-1)
   */
  function calculateCompletenessScore(input: FormInput): number {
    const requiredFields = [
      input.role,
      input.audience,
      input.task,
      input.tone,
      input.outputFormat,
    ]

    const optionalFields = [
      input.constraints?.length,
      input.examples,
      input.context,
    ]

    const requiredFilled = requiredFields.filter(Boolean).length
    const optionalFilled = optionalFields.filter(Boolean).length

    // Required fields are 70% of completeness
    const requiredScore = (requiredFilled / requiredFields.length) * 0.7

    // Optional fields are 30% of completeness
    const optionalScore = (optionalFilled / optionalFields.length) * 0.3

    return requiredScore + optionalScore
  }

  /**
   * Calculate overall completeness percentage
   */
  function calculateCompleteness(input: FormInput): number {
    const totalFields = 8
    const filledFields = [
      input.role,
      input.audience,
      input.task,
      input.tone,
      input.outputFormat,
      input.constraints?.length,
      input.examples,
      input.context,
    ].filter(Boolean).length

    return Math.round((filledFields / totalFields) * 100)
  }

  /**
   * Generate improvement suggestions
   */
  function generateSuggestions(
    input: FormInput,
    breakdown: QualityScoreBreakdown,
    completeness: number
  ): Suggestion[] {
    const suggestions: Suggestion[] = []
    let suggestionId = 1

    // Clarity suggestions
    if (breakdown.clarity < 0.7) {
      if (!input.role || input.role.length < 3) {
        suggestions.push({
          id: `suggestion-${suggestionId++}`,
          type: 'important',
          category: 'clarity',
          message: 'Add a clear role to improve clarity'
        })
      }
      if (!input.audience || input.audience.length < 3) {
        suggestions.push({
          id: `suggestion-${suggestionId++}`,
          type: 'important',
          category: 'clarity',
          message: 'Specify your target audience for better results'
        })
      }
      if (!input.tone) {
        suggestions.push({
          id: `suggestion-${suggestionId++}`,
          type: 'minor',
          category: 'clarity',
          message: 'Select a tone to guide the AI\'s response style'
        })
      }
      if (!input.outputFormat) {
        suggestions.push({
          id: `suggestion-${suggestionId++}`,
          type: 'minor',
          category: 'clarity',
          message: 'Choose an output format to structure the response'
        })
      }
    }

    // Specificity suggestions
    if (breakdown.specificity < 0.7) {
      if (!input.task || input.task.length < 50) {
        suggestions.push({
          id: `suggestion-${suggestionId++}`,
          type: 'critical',
          category: 'specificity',
          message: 'Add more details to your task description'
        })
      }
      if (!input.constraints || input.constraints.length === 0) {
        suggestions.push({
          id: `suggestion-${suggestionId++}`,
          type: 'minor',
          category: 'specificity',
          message: 'Add constraints to better define the scope'
        })
      }
      if (!input.examples) {
        suggestions.push({
          id: `suggestion-${suggestionId++}`,
          type: 'minor',
          category: 'specificity',
          message: 'Include examples to clarify your expectations'
        })
      }
    }

    // Context suggestions
    if (breakdown.context < 0.7) {
      if (!input.context || input.context.length < 50) {
        suggestions.push({
          id: `suggestion-${suggestionId++}`,
          type: 'minor',
          category: 'context',
          message: 'Provide additional context or background information'
        })
      }
      if (!input.examples || input.examples.length < 50) {
        suggestions.push({
          id: `suggestion-${suggestionId++}`,
          type: 'minor',
          category: 'context',
          message: 'Add more detailed examples to improve context'
        })
      }
    }

    // Structure suggestions
    if (breakdown.structure < 0.7) {
      suggestions.push({
        id: `suggestion-${suggestionId++}`,
        type: 'minor',
        category: 'structure',
        message: 'Consider organizing your task with bullet points or numbering'
      })
    }

    // Completeness suggestions
    if (completeness < 80) {
      suggestions.push({
        id: `suggestion-${suggestionId++}`,
        type: 'minor',
        category: 'completeness',
        message: 'Fill in more optional fields for a comprehensive prompt'
      })
    }

    // Limit to 5 most important suggestions
    return suggestions.slice(0, 5)
  }

  /**
   * Get quality rating label
   */
  function getRatingLabel(score: number): string {
    if (score >= 90) return 'Excellent'
    if (score >= 75) return 'Good'
    if (score >= 60) return 'Fair'
    if (score >= 40) return 'Needs Improvement'
    return 'Poor'
  }

  /**
   * Get color for score
   */
  function getScoreColor(score: number): string {
    if (score >= 75) return 'emerald' // Good to excellent
    if (score >= 50) return 'yellow' // Fair
    return 'red' // Needs improvement
  }

  return {
    calculate,
    calculateBreakdown,
    calculateCompleteness,
    generateSuggestions,
    getRatingLabel,
    getScoreColor,
  }
}
