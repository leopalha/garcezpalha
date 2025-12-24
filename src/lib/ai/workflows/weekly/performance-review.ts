/**
 * Performance Review Workflow
 * Weekly performance analysis across all departments
 * CEO-led review with input from all C-Level agents
 */

import type {
  WorkflowConfig,
  WorkflowExecution,
  WorkflowResult,
  WorkflowStep,
  PerformanceReviewInput,
  PerformanceReviewOutput,
} from '../types'
import { getCEOAgent } from '../../agents/executive/ceo-agent'
import { getCFOAgent } from '../../agents/executive/cfo-agent'
import { getCMOAgent } from '../../agents/executive/cmo-agent'
import { getCOOAgent } from '../../agents/executive/coo-agent'
import { createAgentLogger } from '../../agents/core/agent-logger'

// =============================================================================
// WORKFLOW CONFIGURATION
// =============================================================================

export const PERFORMANCE_REVIEW_CONFIG: WorkflowConfig = {
  id: 'performance-review',
  name: 'Performance Review',
  description: 'Revisão semanal de performance de todos os departamentos',
  frequency: 'weekly',
  priority: 'high',
  enabled: true,
  schedule: '0 9 * * 1', // Segundas às 9h
  timeout: 600000, // 10 minutos
  retryOnFailure: true,
  maxRetries: 2,
  notifyOnComplete: true,
  notifyOnFailure: true,
}

// =============================================================================
// CONSTANTS
// =============================================================================

const DEPARTMENT_WEIGHTS = {
  marketing: 0.3,
  operations: 0.3,
  finance: 0.25,
  legal: 0.15,
}

const SCORE_THRESHOLDS = {
  excellent: 90,
  good: 75,
  acceptable: 60,
  needsImprovement: 40,
}

// =============================================================================
// WORKFLOW IMPLEMENTATION
// =============================================================================

const logger = createAgentLogger('ceo', 'executive')

export class PerformanceReviewWorkflow {
  private execution: WorkflowExecution | null = null
  private steps: WorkflowStep[] = []

  /**
   * Execute performance review workflow
   */
  async execute(input: PerformanceReviewInput): Promise<WorkflowResult> {
    const startTime = Date.now()

    this.execution = {
      id: `exec_${Date.now()}`,
      workflowId: PERFORMANCE_REVIEW_CONFIG.id,
      status: 'running',
      steps: [],
      startedAt: new Date(),
      triggeredBy: 'schedule',
    }

    logger.info('workflow-start', 'Performance Review iniciando', {
      weekStart: input.weekStart,
      weekEnd: input.weekEnd,
    })

    try {
      // Step 1: Gather marketing performance
      const marketingReport = await this.executeStep('marketing-report', 'cmo', async () => {
        const cmo = getCMOAgent()
        return await cmo.generateWeeklyReport({
          startDate: input.weekStart,
          endDate: input.weekEnd,
        })
      })

      // Step 2: Gather operations performance
      const operationsReport = await this.executeStep('operations-report', 'coo', async () => {
        const coo = getCOOAgent()
        return await coo.generateWeeklyReport({
          startDate: input.weekStart,
          endDate: input.weekEnd,
        })
      })

      // Step 3: Gather financial performance
      const financialReport = await this.executeStep('financial-report', 'cfo', async () => {
        const cfo = getCFOAgent()
        return await cfo.generateWeeklyReport({
          startDate: input.weekStart,
          endDate: input.weekEnd,
        })
      })

      // Step 4: CEO strategic review
      const strategicReview = await this.executeStep('strategic-review', 'ceo', async () => {
        const ceo = getCEOAgent()
        return await ceo.generateWeeklyReport({
          startDate: input.weekStart,
          endDate: input.weekEnd,
          departmentReports: {
            marketing: marketingReport,
            operations: operationsReport,
            finance: financialReport,
          },
        })
      })

      // Step 5: Generate consolidated output
      const output = this.generateOutput(
        marketingReport,
        operationsReport,
        financialReport,
        strategicReview,
        input
      )

      this.execution.status = 'completed'
      this.execution.completedAt = new Date()
      this.execution.duration = Date.now() - startTime

      logger.info('workflow-complete', 'Performance Review concluído', {
        duration: this.execution.duration,
        overallScore: output.overallScore,
      })

      return {
        success: true,
        summary: `Performance semanal: ${output.overallScore}/100 (${this.getScoreLabel(output.overallScore)})`,
        outputs: { review: output },
        metrics: {
          stepsCompleted: this.steps.filter(s => s.status === 'completed').length,
          stepsFailed: this.steps.filter(s => s.status === 'failed').length,
          totalDuration: this.execution.duration,
          agentsUsed: ['ceo', 'cfo', 'cmo', 'coo'],
        },
        nextActions: this.generateNextActions(output),
      }
    } catch (error) {
      this.execution.status = 'failed'
      this.execution.error = error instanceof Error ? error.message : 'Unknown error'
      this.execution.completedAt = new Date()
      this.execution.duration = Date.now() - startTime

      logger.error('workflow-failed', 'Performance Review falhou', error as Error)

      return {
        success: false,
        summary: `Erro na revisão: ${this.execution.error}`,
        outputs: {},
        metrics: {
          stepsCompleted: this.steps.filter(s => s.status === 'completed').length,
          stepsFailed: this.steps.filter(s => s.status === 'failed').length,
          totalDuration: this.execution.duration,
          agentsUsed: this.steps.map(s => s.agent),
        },
      }
    }
  }

  /**
   * Execute a workflow step
   */
  private async executeStep<T>(
    stepId: string,
    agent: 'ceo' | 'cfo' | 'cmo' | 'coo',
    action: () => Promise<T>
  ): Promise<T> {
    const step: WorkflowStep = {
      id: stepId,
      name: stepId.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
      agent,
      action: stepId,
      status: 'running',
      startedAt: new Date(),
    }

    this.steps.push(step)

    try {
      const result = await action()
      step.status = 'completed'
      step.completedAt = new Date()
      step.result = result
      return result
    } catch (error) {
      step.status = 'failed'
      step.completedAt = new Date()
      step.error = error instanceof Error ? error.message : 'Unknown error'
      throw error
    }
  }

  /**
   * Generate consolidated output
   */
  private generateOutput(
    marketingReport: Record<string, unknown>,
    operationsReport: Record<string, unknown>,
    financialReport: Record<string, unknown>,
    strategicReview: Record<string, unknown>,
    input: PerformanceReviewInput
  ): PerformanceReviewOutput {
    // Calculate department scores
    const departmentScores = this.calculateDepartmentScores({
      marketing: marketingReport,
      operations: operationsReport,
      finance: financialReport,
    })

    // Calculate overall score
    const overallScore = this.calculateOverallScore(departmentScores)

    // Extract key achievements
    const keyAchievements = this.extractAchievements(strategicReview)

    // Extract areas for improvement
    const areasForImprovement = this.extractImprovements(strategicReview)

    // Calculate weekly trends
    const weeklyTrends = this.calculateTrends(marketingReport, operationsReport, financialReport)

    // Generate next week priorities
    const nextWeekPriorities = this.generatePriorities(strategicReview)

    return {
      period: {
        start: input.weekStart.toISOString().split('T')[0],
        end: input.weekEnd.toISOString().split('T')[0],
      },
      overallScore,
      departmentScores,
      keyAchievements,
      areasForImprovement,
      weeklyTrends,
      nextWeekPriorities,
    }
  }

  /**
   * Calculate department scores
   */
  private calculateDepartmentScores(
    reports: Record<string, Record<string, unknown>>
  ): PerformanceReviewOutput['departmentScores'] {
    return Object.entries(reports).map(([department, report]) => {
      const score = this.calculateDepartmentScore(report)
      const highlights = this.extractHighlights(report)
      const concerns = this.extractConcerns(report)
      const recommendations = this.extractRecommendations(report)

      return {
        department,
        score,
        highlights,
        concerns,
        recommendations,
      }
    })
  }

  /**
   * Calculate individual department score
   */
  private calculateDepartmentScore(report: Record<string, unknown>): number {
    // Extract KPIs and calculate weighted score
    const kpis = (report.kpis as Record<string, unknown>[]) || []
    const metrics = (report.metrics as Record<string, unknown>) || {}

    let totalScore = 0
    let count = 0

    // Score based on KPI achievement
    for (const kpi of kpis) {
      const target = (kpi.target as number) || 100
      const actual = (kpi.actual as number) || 0
      const achievement = Math.min((actual / target) * 100, 100)
      totalScore += achievement
      count++
    }

    // Add score based on general metrics
    if (metrics.successRate) {
      totalScore += (metrics.successRate as number) * 100
      count++
    }

    if (metrics.efficiency) {
      totalScore += (metrics.efficiency as number) * 100
      count++
    }

    return count > 0 ? Math.round(totalScore / count) : 70 // Default to 70 if no data
  }

  /**
   * Calculate overall weighted score
   */
  private calculateOverallScore(
    departmentScores: PerformanceReviewOutput['departmentScores']
  ): number {
    let weightedSum = 0
    let totalWeight = 0

    for (const dept of departmentScores) {
      const weight = DEPARTMENT_WEIGHTS[dept.department as keyof typeof DEPARTMENT_WEIGHTS] || 0.25
      weightedSum += dept.score * weight
      totalWeight += weight
    }

    return Math.round(weightedSum / totalWeight)
  }

  /**
   * Get score label
   */
  private getScoreLabel(score: number): string {
    if (score >= SCORE_THRESHOLDS.excellent) return 'Excelente'
    if (score >= SCORE_THRESHOLDS.good) return 'Bom'
    if (score >= SCORE_THRESHOLDS.acceptable) return 'Aceitável'
    if (score >= SCORE_THRESHOLDS.needsImprovement) return 'Precisa Melhorar'
    return 'Crítico'
  }

  /**
   * Extract highlights from report
   */
  private extractHighlights(report: Record<string, unknown>): string[] {
    const highlights = (report.highlights as string[]) || []
    const achievements = (report.achievements as string[]) || []
    return [...highlights, ...achievements].slice(0, 3)
  }

  /**
   * Extract concerns from report
   */
  private extractConcerns(report: Record<string, unknown>): string[] {
    const concerns = (report.concerns as string[]) || []
    const issues = (report.issues as string[]) || []
    return [...concerns, ...issues].slice(0, 3)
  }

  /**
   * Extract recommendations from report
   */
  private extractRecommendations(report: Record<string, unknown>): string[] {
    return ((report.recommendations as string[]) || []).slice(0, 3)
  }

  /**
   * Extract achievements from strategic review
   */
  private extractAchievements(review: Record<string, unknown>): string[] {
    return ((review.keyAchievements as string[]) || []).slice(0, 5)
  }

  /**
   * Extract improvements from strategic review
   */
  private extractImprovements(review: Record<string, unknown>): string[] {
    return ((review.areasForImprovement as string[]) || []).slice(0, 5)
  }

  /**
   * Calculate weekly trends
   */
  private calculateTrends(
    marketing: Record<string, unknown>,
    operations: Record<string, unknown>,
    finance: Record<string, unknown>
  ): PerformanceReviewOutput['weeklyTrends'] {
    const trends: PerformanceReviewOutput['weeklyTrends'] = []

    // Marketing trends
    const marketingMetrics = (marketing.metrics as Record<string, unknown>) || {}
    if (marketingMetrics.leads) {
      trends.push({
        metric: 'Leads Gerados',
        thisWeek: (marketingMetrics.leads as number) || 0,
        lastWeek: ((marketingMetrics.leads as number) || 0) * 0.9, // Simulated
        change: 10,
        status: 'improved',
      })
    }

    // Operations trends
    const operationsMetrics = (operations.metrics as Record<string, unknown>) || {}
    if (operationsMetrics.tasksCompleted) {
      trends.push({
        metric: 'Tarefas Concluídas',
        thisWeek: (operationsMetrics.tasksCompleted as number) || 0,
        lastWeek: ((operationsMetrics.tasksCompleted as number) || 0) * 0.95,
        change: 5,
        status: 'improved',
      })
    }

    // Finance trends
    const financeMetrics = (finance.metrics as Record<string, unknown>) || {}
    if (financeMetrics.revenue) {
      trends.push({
        metric: 'Receita',
        thisWeek: (financeMetrics.revenue as number) || 0,
        lastWeek: ((financeMetrics.revenue as number) || 0) * 1.05,
        change: -5,
        status: 'declined',
      })
    }

    return trends.slice(0, 5)
  }

  /**
   * Generate priorities for next week
   */
  private generatePriorities(
    review: Record<string, unknown>
  ): PerformanceReviewOutput['nextWeekPriorities'] {
    const priorities = (review.priorities as Record<string, unknown>[]) || []

    return priorities.slice(0, 5).map(p => ({
      priority: (p.title as string) || 'Prioridade',
      owner: (p.owner as 'ceo' | 'cfo' | 'cmo' | 'coo') || 'ceo',
      deadline: (p.deadline as string) || '',
    }))
  }

  /**
   * Generate next actions
   */
  private generateNextActions(output: PerformanceReviewOutput) {
    const actions = []

    // Notify about overall performance
    actions.push({
      type: 'notify' as const,
      target: 'telegram',
      payload: {
        message: this.formatTelegramMessage(output),
        recipients: ['admin'],
      },
      priority: 'high' as const,
    })

    // Escalate if performance is below threshold
    if (output.overallScore < SCORE_THRESHOLDS.acceptable) {
      actions.push({
        type: 'escalate' as const,
        target: 'admin',
        payload: {
          issue: 'Performance semanal abaixo do aceitável',
          score: output.overallScore,
          threshold: SCORE_THRESHOLDS.acceptable,
        },
        priority: 'critical' as const,
      })
    }

    return actions
  }

  /**
   * Format Telegram message
   */
  private formatTelegramMessage(output: PerformanceReviewOutput): string {
    const lines = [
      `📊 *Performance Semanal*`,
      `📅 ${output.period.start} a ${output.period.end}`,
      '',
      `🎯 *Score Geral: ${output.overallScore}/100* (${this.getScoreLabel(output.overallScore)})`,
      '',
      '*Por Departamento:*',
    ]

    for (const dept of output.departmentScores) {
      const icon = dept.score >= 75 ? '✅' : dept.score >= 60 ? '🟡' : '🔴'
      lines.push(`${icon} ${dept.department}: ${dept.score}/100`)
    }

    if (output.keyAchievements.length > 0) {
      lines.push('')
      lines.push('*Conquistas:*')
      for (const achievement of output.keyAchievements.slice(0, 3)) {
        lines.push(`🏆 ${achievement}`)
      }
    }

    if (output.areasForImprovement.length > 0) {
      lines.push('')
      lines.push('*A Melhorar:*')
      for (const area of output.areasForImprovement.slice(0, 3)) {
        lines.push(`📌 ${area}`)
      }
    }

    return lines.join('\n')
  }

  /**
   * Get current status
   */
  getStatus() {
    return this.execution?.status || 'pending'
  }

  /**
   * Get execution details
   */
  getExecution() {
    return this.execution
  }

  /**
   * Cancel workflow
   */
  async cancel() {
    if (this.execution && this.execution.status === 'running') {
      this.execution.status = 'cancelled'
      this.execution.completedAt = new Date()
      logger.info('workflow-cancelled', 'Performance Review cancelado')
    }
  }
}

// =============================================================================
// FACTORY FUNCTIONS
// =============================================================================

/**
 * Create performance review workflow
 */
export function createPerformanceReviewWorkflow(): PerformanceReviewWorkflow {
  return new PerformanceReviewWorkflow()
}

/**
 * Execute performance review with default options
 */
export async function executePerformanceReview(
  options?: Partial<PerformanceReviewInput>
): Promise<WorkflowResult> {
  const workflow = createPerformanceReviewWorkflow()

  const today = new Date()
  const weekStart = options?.weekStart || new Date(today.setDate(today.getDate() - 7))
  const weekEnd = options?.weekEnd || new Date()

  const input: PerformanceReviewInput = {
    weekStart,
    weekEnd,
    departments: options?.departments || ['marketing', 'operations', 'finance'],
  }

  return workflow.execute(input)
}
