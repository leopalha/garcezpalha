/**
 * Question Engine
 * Manages the flow of qualification questions
 */

import type {
  QualificationQuestion,
  QuestionAnswer,
  QualificationContext,
} from './types'

/**
 * Question Engine manages question flow and conditional logic
 */
export class QuestionEngine {
  private questions: QualificationQuestion[]
  private answers: QuestionAnswer[]
  private context: QualificationContext

  constructor(
    questions: QualificationQuestion[],
    context: QualificationContext,
    existingAnswers: QuestionAnswer[] = []
  ) {
    this.questions = questions
    this.context = context
    this.answers = existingAnswers
  }

  /**
   * Get the next question to ask based on current answers
   */
  getNextQuestion(): QualificationQuestion | null {
    // Filter out already answered questions
    const answeredIds = new Set(this.answers.map(a => a.questionId))

    // Find next unanswered question that meets conditional requirements
    for (const question of this.questions) {
      // Skip if already answered
      if (answeredIds.has(question.id)) continue

      // Check conditional logic
      if (question.conditionalOn) {
        const conditionMet = this.isConditionMet(question.conditionalOn)
        if (!conditionMet) continue
      }

      return question
    }

    return null // All questions answered or no more applicable questions
  }

  /**
   * Get all applicable questions (considering conditionals)
   */
  getApplicableQuestions(): QualificationQuestion[] {
    return this.questions.filter(q => {
      if (!q.conditionalOn) return true
      return this.isConditionMet(q.conditionalOn)
    })
  }

  /**
   * Get required questions that haven't been answered yet
   */
  getRequiredUnanswered(): QualificationQuestion[] {
    const answeredIds = new Set(this.answers.map(a => a.questionId))

    return this.getApplicableQuestions().filter(
      q => q.priority === 'required' && !answeredIds.has(q.id)
    )
  }

  /**
   * Get important questions that haven't been answered yet
   */
  getImportantUnanswered(): QualificationQuestion[] {
    const answeredIds = new Set(this.answers.map(a => a.questionId))

    return this.getApplicableQuestions().filter(
      q => q.priority === 'important' && !answeredIds.has(q.id)
    )
  }

  /**
   * Get optional questions that haven't been answered yet
   */
  getOptionalUnanswered(): QualificationQuestion[] {
    const answeredIds = new Set(this.answers.map(a => a.questionId))

    return this.getApplicableQuestions().filter(
      q => q.priority === 'optional' && !answeredIds.has(q.id)
    )
  }

  /**
   * Add an answer and update state
   */
  addAnswer(answer: QuestionAnswer): void {
    // Remove existing answer for this question if any
    this.answers = this.answers.filter(a => a.questionId !== answer.questionId)

    // Add new answer
    this.answers.push(answer)
  }

  /**
   * Validate an answer against question rules
   */
  validateAnswer(
    questionId: string,
    value: string | number | boolean | string[]
  ): { valid: boolean; error?: string } {
    const question = this.questions.find(q => q.id === questionId)
    if (!question) {
      return { valid: false, error: 'Question not found' }
    }

    // Check if required
    if (question.validation?.required && (value === undefined || value === '')) {
      return { valid: false, error: 'This question is required' }
    }

    // Numeric validations
    if (typeof value === 'number' && question.validation) {
      if (question.validation.min !== undefined && value < question.validation.min) {
        return { valid: false, error: `Minimum value is ${question.validation.min}` }
      }
      if (question.validation.max !== undefined && value > question.validation.max) {
        return { valid: false, error: `Maximum value is ${question.validation.max}` }
      }
    }

    // Pattern validation (for strings)
    if (typeof value === 'string' && question.validation?.pattern) {
      const regex = new RegExp(question.validation.pattern)
      if (!regex.test(value)) {
        return { valid: false, error: 'Invalid format' }
      }
    }

    // Choice validation
    if (
      (question.type === 'single-choice' || question.type === 'multi-choice') &&
      question.options
    ) {
      const validValues = question.options.map(o => o.value)

      if (question.type === 'single-choice') {
        if (!validValues.includes(value as string)) {
          return { valid: false, error: 'Invalid option selected' }
        }
      }

      if (question.type === 'multi-choice' && Array.isArray(value)) {
        const allValid = value.every(v => validValues.includes(v))
        if (!allValid) {
          return { valid: false, error: 'One or more invalid options selected' }
        }
      }
    }

    return { valid: true }
  }

  /**
   * Check if a conditional requirement is met
   */
  private isConditionMet(condition: {
    questionId: string
    expectedValue: string | string[]
  }): boolean {
    const answer = this.answers.find(a => a.questionId === condition.questionId)
    if (!answer) return false

    if (Array.isArray(condition.expectedValue)) {
      return condition.expectedValue.includes(answer.value as string)
    }

    return answer.value === condition.expectedValue
  }

  /**
   * Check if qualification is complete
   */
  isComplete(): boolean {
    // Must answer all required questions
    const requiredUnanswered = this.getRequiredUnanswered()
    return requiredUnanswered.length === 0
  }

  /**
   * Get completion progress
   */
  getProgress(): {
    answered: number
    total: number
    required: number
    requiredAnswered: number
    percentage: number
  } {
    const applicable = this.getApplicableQuestions()
    const required = applicable.filter(q => q.priority === 'required')
    const answeredIds = new Set(this.answers.map(a => a.questionId))

    const answered = applicable.filter(q => answeredIds.has(q.id)).length
    const requiredAnswered = required.filter(q => answeredIds.has(q.id)).length

    return {
      answered,
      total: applicable.length,
      required: required.length,
      requiredAnswered,
      percentage: applicable.length > 0 ? Math.round((answered / applicable.length) * 100) : 100,
    }
  }

  /**
   * Get all answers
   */
  getAnswers(): QuestionAnswer[] {
    return [...this.answers]
  }

  /**
   * Get answer for specific question
   */
  getAnswer(questionId: string): QuestionAnswer | undefined {
    return this.answers.find(a => a.questionId === questionId)
  }

  /**
   * Get question by ID
   */
  getQuestion(questionId: string): QualificationQuestion | undefined {
    return this.questions.find(q => q.id === questionId)
  }

  /**
   * Get all questions
   */
  getAllQuestions(): QualificationQuestion[] {
    return [...this.questions]
  }

  /**
   * Export state for persistence
   */
  exportState(): {
    questions: QualificationQuestion[]
    answers: QuestionAnswer[]
    context: QualificationContext
  } {
    return {
      questions: this.questions,
      answers: this.answers,
      context: this.context,
    }
  }

  /**
   * Import state from persistence
   */
  static importState(state: {
    questions: QualificationQuestion[]
    answers: QuestionAnswer[]
    context: QualificationContext
  }): QuestionEngine {
    return new QuestionEngine(state.questions, state.context, state.answers)
  }
}

/**
 * Helper to create a question engine for a product
 */
export function createQuestionEngineForProduct(
  productId: string,
  questions: QualificationQuestion[],
  context: QualificationContext
): QuestionEngine {
  return new QuestionEngine(questions, context)
}

/**
 * Helper to resume a qualification session
 */
export function resumeQualificationSession(
  questions: QualificationQuestion[],
  existingAnswers: QuestionAnswer[],
  context: QualificationContext
): QuestionEngine {
  return new QuestionEngine(questions, context, existingAnswers)
}
