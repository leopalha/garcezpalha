/**
 * Lead Score Calculator
 * Calculates lead quality score based on qualification answers
 */

import type {
  QuestionAnswer,
  LeadScore,
  LeadCategory,
  ScoringRule,
} from './types'

/**
 * Calculate lead score from answers
 */
export function calculateLeadScore(
  answers: QuestionAnswer[],
  rules: ScoringRule[]
): LeadScore {
  // Initialize scores
  let urgency = 50
  let probability = 50
  let complexity = 50
  const reasoning: string[] = []

  // Apply scoring rules
  for (const rule of rules) {
    if (rule.condition(answers)) {
      if (rule.impact.urgency !== undefined) {
        urgency = Math.max(0, Math.min(100, urgency + rule.impact.urgency))
      }
      if (rule.impact.probability !== undefined) {
        probability = Math.max(0, Math.min(100, probability + rule.impact.probability))
      }
      if (rule.impact.complexity !== undefined) {
        complexity = Math.max(0, Math.min(100, complexity + rule.impact.complexity))
      }
      reasoning.push(rule.description)
    }
  }

  // Calculate total score (weighted average)
  const total = Math.round(
    urgency * 0.4 +        // Urgency has highest weight (40%)
    probability * 0.35 +   // Probability second (35%)
    complexity * 0.25      // Complexity third (25%)
  )

  // Determine category
  const category = categorizeScore(total)

  return {
    total,
    urgency,
    probability,
    complexity,
    category,
    reasoning,
  }
}

/**
 * Categorize lead based on total score
 */
export function categorizeScore(score: number): LeadCategory {
  if (score >= 80) return 'hot'
  if (score >= 60) return 'warm'
  if (score >= 40) return 'cold'
  return 'unqualified'
}

/**
 * Get answer value by question ID
 */
export function getAnswerValue(
  answers: QuestionAnswer[],
  questionId: string
): string | number | boolean | string[] | undefined {
  return answers.find(a => a.questionId === questionId)?.value
}

/**
 * Check if answer equals a specific value
 */
export function answerEquals(
  answers: QuestionAnswer[],
  questionId: string,
  expectedValue: string | number | boolean
): boolean {
  const value = getAnswerValue(answers, questionId)
  return value === expectedValue
}

/**
 * Check if answer is one of multiple values
 */
export function answerIn(
  answers: QuestionAnswer[],
  questionId: string,
  expectedValues: Array<string | number | boolean>
): boolean {
  const value = getAnswerValue(answers, questionId)
  return expectedValues.includes(value as never)
}

/**
 * Check if numeric answer is within range
 */
export function answerInRange(
  answers: QuestionAnswer[],
  questionId: string,
  min: number,
  max: number
): boolean {
  const value = getAnswerValue(answers, questionId)
  return typeof value === 'number' && value >= min && value <= max
}

/**
 * Check if answer is greater than value
 */
export function answerGreaterThan(
  answers: QuestionAnswer[],
  questionId: string,
  threshold: number
): boolean {
  const value = getAnswerValue(answers, questionId)
  return typeof value === 'number' && value > threshold
}

/**
 * Check if answer contains text
 */
export function answerContains(
  answers: QuestionAnswer[],
  questionId: string,
  searchText: string
): boolean {
  const value = getAnswerValue(answers, questionId)
  if (typeof value === 'string') {
    return value.toLowerCase().includes(searchText.toLowerCase())
  }
  if (Array.isArray(value)) {
    return value.some(v =>
      String(v).toLowerCase().includes(searchText.toLowerCase())
    )
  }
  return false
}

/**
 * Count how many questions were answered
 */
export function countAnsweredQuestions(answers: QuestionAnswer[]): number {
  return answers.filter(a => a.value !== undefined && a.value !== '').length
}

/**
 * Check if all required questions were answered
 */
export function areRequiredQuestionsAnswered(
  answers: QuestionAnswer[],
  requiredQuestionIds: string[]
): boolean {
  return requiredQuestionIds.every(id =>
    answers.some(a => a.questionId === id && a.value !== undefined && a.value !== '')
  )
}

/**
 * Calculate completion percentage
 */
export function calculateCompletionPercentage(
  answers: QuestionAnswer[],
  totalQuestions: number
): number {
  if (totalQuestions === 0) return 100
  const answered = countAnsweredQuestions(answers)
  return Math.round((answered / totalQuestions) * 100)
}

/**
 * Get score interpretation message
 */
export function getScoreInterpretation(score: LeadScore): string {
  switch (score.category) {
    case 'hot':
      return `Cliente altamente qualificado (${score.total}/100). ${
        score.urgency >= 80 ? 'Urgência máxima - atender imediatamente!' : 'Caso promissor com alta conversão esperada.'
      }`
    case 'warm':
      return `Cliente qualificado (${score.total}/100). ${
        score.urgency >= 60 ? 'Possui urgência - agendar consulta em 24-48h.' : 'Bom potencial - acompanhar de perto.'
      }`
    case 'cold':
      return `Cliente com potencial limitado (${score.total}/100). ${
        score.complexity >= 60 ? 'Caso complexo - avaliar viabilidade.' : 'Necessita nutrição de lead.'
      }`
    case 'unqualified':
      return `Cliente não qualificado (${score.total}/100). ${
        score.probability < 30 ? 'Baixa chance de conversão.' : 'Não atende critérios mínimos.'
      }`
  }
}

/**
 * Estimate case value based on score and product
 */
export function estimateCaseValue(
  score: LeadScore,
  basePrice: number
): { estimatedValue: number; estimatedFee: number } {
  // Adjust multiplier based on complexity and probability
  let multiplier = 1.0

  // Complexity adjustment (higher complexity = higher value)
  if (score.complexity >= 80) multiplier *= 1.5
  else if (score.complexity >= 60) multiplier *= 1.3
  else if (score.complexity >= 40) multiplier *= 1.1

  // Probability adjustment (higher probability = closer to base price)
  if (score.probability >= 80) multiplier *= 1.0
  else if (score.probability >= 60) multiplier *= 0.9
  else if (score.probability >= 40) multiplier *= 0.8
  else multiplier *= 0.7

  const estimatedFee = Math.round(basePrice * multiplier)
  const estimatedValue = Math.round(estimatedFee * 2) // Assume 2x fee for case value

  return {
    estimatedValue,
    estimatedFee,
  }
}
