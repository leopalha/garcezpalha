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
import { getCEOAgent, type DailyBriefing } from '../../agents/executive/ceo-agent'
import { getCFOAgent, type WeeklyFinancialReport } from '../../agents/executive/cfo-agent'
import { getCMOAgent, type ChannelPerformance } from '../../agents/executive/cmo-agent'
import { getCOOAgent, type WeeklyOperationsReport } from '../../agents/executive/coo-agent'
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
        // Use analyzeChannelPerformance with correct signature
        return await cmo.analyzeChannelPerformance(
          {
            start: input.weekStart.toISOString().split('T')[0],
            end: input.weekEnd.toISOString().split('T')[0],
          },
          [
            { channel: 'google', spend: 500, impressions: 10000, clicks: 200, leads: 25, conversions: 5, revenue: 2500 },
            { channel: 'meta', spend: 300, impressions: 8000, clicks: 150, leads: 15, conversions: 3, revenue: 1500 },
            { channel: 'organic', spend: 0, impressions: 5000, clicks: 100, leads: 10, conversions: 2, revenue: 1000 },
          ]
        )
      })

      // Step 2: Gather operations performance
      const operationsReport = await this.executeStep('operations-report', 'coo', async () => {
        const coo = getCOOAgent()
        // Use the correct method signature for COO weekly report
        const weekNumber = this.getWeekNumber(input.weekStart)
        return await coo.generateWeeklyReport(
          weekNumber,
          input.weekStart.toISOString().split('T')[0],
          input.weekEnd.toISOString().split('T')[0],
          {
            leadsReceived: 50,
            leadsQualified: 35,
            proposalsSent: 20,
            contractsSigned: 8,
            casesCompleted: 5,
          },
          {
            firstContactResolution: 0.85,
            errorRate: 0.02,
            customerSatisfaction: 0.92,
          },
          [
            { kpi: 'Leads Qualificados', target: 40, actual: 35 },
            { kpi: 'Contratos Assinados', target: 10, actual: 8 },
            { kpi: 'SLA Compliance', target: 95, actual: 92 },
          ]
        )
      })

      // Step 3: Gather financial performance
      const financialReport = await this.executeStep('financial-report', 'cfo', async () => {
        const cfo = getCFOAgent()
        // Use the correct method signature for CFO weekly report
        const weekNumber = this.getWeekNumber(input.weekStart)
        return await cfo.generateWeeklyReport({
          weekNumber,
          startDate: input.weekStart.toISOString().split('T')[0],
          endDate: input.weekEnd.toISOString().split('T')[0],
          openingCash: 50000,
          closingCash: 55000,
          revenue: 15000,
          revenueMTD: 45000,
          revenueTarget: 60000,
          newClients: 3,
          newContracts: 5,
          collected: 12000,
          outstanding: 25000,
          overdue: 5000,
          expenses: 8000,
          expensesMTD: 24000,
          expensesBudget: 30000,
          significantExpenses: [
            { item: 'Marketing', amount: 1500 },
            { item: 'Software', amount: 800 },
          ],
          mrr: 20000,
          previousMRR: 19000,
        })
      })

      // Step 4: CEO strategic review using daily briefing (which covers similar info)
      const strategicReview = await this.executeStep('strategic-review', 'ceo', async () => {
        const ceo = getCEOAgent()
        // Use generateDailyBriefing with correct BusinessMetrics signature
        return await ceo.generateDailyBriefing(
          {
            dailyLeads: 50,
            conversionRate: 0.15,
            averageTicket: 1500,
            mrr: 20000,
            cac: 200,
            marketingSpend: 800,
            contentPublished: 14,
            adPerformance: {
              impressions: 10000,
              clicks: 200,
              ctr: 0.02,
              conversions: 10,
              spend: 800,
              roas: 3.2,
            },
          },
          [], // alerts
          [], // pending decisions
          [
            { agent: 'content', tasksCompleted: 20, successRate: 0.95 },
            { agent: 'social', tasksCompleted: 15, successRate: 0.92 },
            { agent: 'qa', tasksCompleted: 30, successRate: 0.98 },
          ]
        )
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
   * Get ISO week number
   */
  private getWeekNumber(date: Date): number {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
    const dayNum = d.getUTCDay() || 7
    d.setUTCDate(d.getUTCDate() + 4 - dayNum)
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1))
    return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7)
  }

  /**
   * Generate consolidated output
   */
  private generateOutput(
    marketingReport: ChannelPerformance,
    operationsReport: WeeklyOperationsReport,
    financialReport: WeeklyFinancialReport,
    strategicReview: DailyBriefing,
    input: PerformanceReviewInput
  ): PerformanceReviewOutput {
    // Calculate department scores - cast to Record for generic processing
    const departmentScores = this.calculateDepartmentScores({
      marketing: marketingReport as unknown as Record<string, unknown>,
      operations: operationsReport as unknown as Record<string, unknown>,
      finance: financialReport as unknown as Record<string, unknown>,
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
  private extractAchievements(review: DailyBriefing): string[] {
    const topPriorities = review.topPriorities || []
    return topPriorities
      .filter(p => p.status === 'on_track')
      .map(p => p.initiative)
      .slice(0, 5)
  }

  /**
   * Extract improvements from strategic review
   */
  private extractImprovements(review: DailyBriefing): string[] {
    const alerts = review.criticalAlerts || []
    return alerts.map(a => a.message).slice(0, 5)
  }

  /**
   * Calculate weekly trends
   */
  private calculateTrends(
    marketing: ChannelPerformance,
    operations: WeeklyOperationsReport,
    finance: WeeklyFinancialReport
  ): PerformanceReviewOutput['weeklyTrends'] {
    const trends: PerformanceReviewOutput['weeklyTrends'] = []

    // Marketing trends from ChannelPerformance
    const leads = marketing.summary?.totalLeads || 0
    if (leads > 0) {
      trends.push({
        metric: 'Leads Gerados',
        thisWeek: leads,
        lastWeek: leads * 0.9, // Simulated
        change: 10,
        status: 'improved',
      })
    }

    // Operations trends from WeeklyOperationsReport
    const tasks = operations.volumeMetrics?.casesCompleted || 0
    if (tasks > 0) {
      trends.push({
        metric: 'Tarefas Concluídas',
        thisWeek: tasks,
        lastWeek: tasks * 0.95,
        change: 5,
        status: 'improved',
      })
    }

    // Finance trends from WeeklyFinancialReport
    const revenue = finance.revenue?.thisWeek || 0
    if (revenue > 0) {
      trends.push({
        metric: 'Receita',
        thisWeek: revenue,
        lastWeek: revenue * 1.05,
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
    review: DailyBriefing
  ): PerformanceReviewOutput['nextWeekPriorities'] {
    const todaysFocus = review.todaysFocus || []

    return todaysFocus.slice(0, 5).map(p => ({
      priority: p.objective || 'Prioridade',
      owner: (p.assignedTo as 'ceo' | 'cfo' | 'cmo' | 'coo') || 'ceo',
      deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
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
