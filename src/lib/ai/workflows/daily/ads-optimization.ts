/**
 * Ads Optimization Workflow
 * Daily optimization of paid advertising campaigns
 * Uses Ads Agent for campaign analysis and CMO Agent for strategy
 */

import type {
  WorkflowConfig,
  WorkflowExecution,
  WorkflowResult,
  WorkflowStep,
  AdsOptimizationInput,
  AdsOptimizationOutput,
} from '../types'
import { getCMOAgent } from '../../agents/executive/cmo-agent'
import { getAdsAgent, type CampaignPerformanceData } from '../../agents/marketing/ads-agent'
import { createAgentLogger } from '../../agents/core/agent-logger'

// =============================================================================
// WORKFLOW CONFIGURATION
// =============================================================================

export const ADS_OPTIMIZATION_CONFIG: WorkflowConfig = {
  id: 'ads-optimization',
  name: 'Ads Optimization',
  description: 'Otimização diária de campanhas de tráfego pago',
  frequency: 'daily',
  priority: 'high',
  enabled: true,
  schedule: '0 6 * * *', // 6h todos os dias
  timeout: 300000, // 5 minutos
  retryOnFailure: true,
  maxRetries: 2,
  notifyOnComplete: true,
  notifyOnFailure: true,
}

// =============================================================================
// CONSTANTS
// =============================================================================

const DEFAULT_CAMPAIGNS = ['google_search', 'google_display', 'meta_feed', 'meta_stories']
const MAXIMUM_BUDGET_CHANGE_PERCENT = 30 // Max 30% change per day

// =============================================================================
// WORKFLOW IMPLEMENTATION
// =============================================================================

const logger = createAgentLogger('ads', 'marketing')

export class AdsOptimizationWorkflow {
  private execution: WorkflowExecution | null = null
  private steps: WorkflowStep[] = []

  /**
   * Execute ads optimization workflow
   */
  async execute(input: AdsOptimizationInput): Promise<WorkflowResult> {
    const startTime = Date.now()

    this.execution = {
      id: `exec_${Date.now()}`,
      workflowId: ADS_OPTIMIZATION_CONFIG.id,
      status: 'running',
      steps: [],
      startedAt: new Date(),
      triggeredBy: 'schedule',
    }

    logger.info('workflow-start', 'Ads Optimization iniciando', {
      date: input.date,
      budget: input.budget,
    })

    try {
      // Step 1: Get campaign performance data and analyze each
      const performanceAnalysis = await this.executeStep('get-performance', 'ads', async () => {
        const ads = getAdsAgent()

        // Build simulated performance data for analysis
        // In production, this would come from Google/Meta APIs
        const performanceData: CampaignPerformanceData[] = input.campaigns.map((campaign, index) => ({
          campaignName: campaign,
          platform: campaign.includes('google') ? 'google' as const : 'meta' as const,
          spend: (input.budget / input.campaigns.length) * 0.8 * (0.9 + Math.random() * 0.2),
          impressions: Math.floor(10000 + Math.random() * 5000),
          clicks: Math.floor(100 + Math.random() * 150),
          conversions: Math.floor(5 + Math.random() * 10),
          cpc: 2 + Math.random() * 3,
          cpl: 30 + Math.random() * 50,
          ctr: 1 + Math.random() * 2,
          conversionRate: 3 + Math.random() * 5,
          roas: 1.5 + Math.random() * 3,
        }))

        // Analyze each campaign using the correct method signature
        const analyses = await Promise.all(
          performanceData.map(data =>
            ads.optimizeCampaign(data, 'direito civil')
          )
        )

        return { performanceData, analyses }
      })

      // Step 2: Get budget optimization recommendations from CMO
      const budgetAnalysis = await this.executeStep('analyze-budget', 'cmo', async () => {
        const cmo = getCMOAgent()
        const totalSpend = performanceAnalysis.performanceData.reduce((sum, p) => sum + p.spend, 0)
        const totalRevenue = performanceAnalysis.performanceData.reduce((sum, p) => sum + (p.roas || 1) * p.spend, 0)

        // Use CMO's optimizeBudgetAllocation method
        return await cmo.optimizeBudgetAllocation(
          input.budget,
          {
            start: this.getYesterday(input.date).toISOString().split('T')[0],
            end: input.date.toISOString().split('T')[0],
          },
          performanceAnalysis.performanceData.map(p => ({
            channel: p.campaignName,
            spend: p.spend,
            leads: p.conversions,
            conversions: Math.floor(p.conversions * 0.3),
            revenue: (p.roas || 1) * p.spend,
          }))
        )
      })

      // Step 3: Generate keyword analysis for Google campaigns
      const keywordAnalysis = await this.executeStep('analyze-keywords', 'ads', async () => {
        const ads = getAdsAgent()

        // Simulate keyword data
        const keywords = [
          { keyword: 'advogado trabalhista', matchType: 'phrase', impressions: 1500, clicks: 45, conversions: 3, cpc: 2.5, qualityScore: 8 },
          { keyword: 'consulta advogado', matchType: 'broad', impressions: 2000, clicks: 30, conversions: 1, cpc: 1.8, qualityScore: 6 },
          { keyword: 'direito do trabalho', matchType: 'exact', impressions: 800, clicks: 25, conversions: 2, cpc: 3.0, qualityScore: 9 },
        ]

        return await ads.analyzeKeywords(keywords, 'trabalhista')
      })

      // Step 4: Filter and apply approved changes
      const approvedChanges = await this.executeStep('approve-changes', 'cmo', async () => {
        return this.filterApprovedChanges(
          budgetAnalysis.recommendation.allocation,
          input.budget
        )
      })

      // Step 5: Format results
      const appliedChanges = await this.executeStep('apply-optimizations', 'ads', async () => {
        return this.applyOptimizations(approvedChanges)
      })

      // Format output
      const output = this.formatOutput(
        appliedChanges,
        performanceAnalysis.performanceData,
        keywordAnalysis,
        input
      )

      this.execution.status = 'completed'
      this.execution.completedAt = new Date()
      this.execution.duration = Date.now() - startTime

      logger.info('workflow-complete', 'Ads Optimization concluído', {
        duration: this.execution.duration,
        changesApplied: appliedChanges.length,
      })

      return {
        success: true,
        summary: `${appliedChanges.length} otimizações aplicadas. ROAS atual: ${output.performanceSummary.roas.toFixed(2)}`,
        outputs: { optimization: output },
        metrics: {
          stepsCompleted: this.steps.filter(s => s.status === 'completed').length,
          stepsFailed: this.steps.filter(s => s.status === 'failed').length,
          totalDuration: this.execution.duration,
          agentsUsed: ['ads', 'cmo'],
        },
        nextActions: this.generateNextActions(output),
      }
    } catch (error) {
      this.execution.status = 'failed'
      this.execution.error = error instanceof Error ? error.message : 'Unknown error'
      this.execution.completedAt = new Date()
      this.execution.duration = Date.now() - startTime

      logger.error('workflow-failed', 'Ads Optimization falhou', error as Error)

      return {
        success: false,
        summary: `Erro na otimização: ${this.execution.error}`,
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
    agent: 'ads' | 'cfo' | 'cmo',
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
   * Get yesterday's date
   */
  private getYesterday(date: Date): Date {
    const yesterday = new Date(date)
    yesterday.setDate(yesterday.getDate() - 1)
    return yesterday
  }

  /**
   * Filter changes that are within approval limits
   */
  private filterApprovedChanges(
    recommendations: Array<{
      channel: string
      currentBudget: number
      recommendedBudget: number
      change: number
      changePercent: number
      rationale: string
    }>,
    totalBudget: number
  ): Array<{
    campaignId: string
    campaignName: string
    action: 'increase_budget' | 'decrease_budget' | 'pause' | 'reactivate' | 'adjust_bid'
    currentValue: number
    newValue: number
    reason: string
    expectedImpact: string
  }> {
    const maxChange = totalBudget * (MAXIMUM_BUDGET_CHANGE_PERCENT / 100)

    return recommendations
      .filter(rec => Math.abs(rec.change) <= maxChange)
      .map(rec => ({
        campaignId: `campaign_${rec.channel}`,
        campaignName: rec.channel,
        action: rec.change > 0 ? 'increase_budget' as const : 'decrease_budget' as const,
        currentValue: rec.currentBudget,
        newValue: rec.recommendedBudget,
        reason: rec.rationale,
        expectedImpact: `${rec.changePercent > 0 ? '+' : ''}${rec.changePercent.toFixed(1)}% budget change`,
      }))
  }

  /**
   * Apply optimizations (simulated)
   */
  private applyOptimizations(
    changes: Array<{
      campaignId: string
      campaignName: string
      action: 'increase_budget' | 'decrease_budget' | 'pause' | 'reactivate' | 'adjust_bid'
      currentValue: number
      newValue: number
      reason: string
      expectedImpact: string
    }>
  ): Array<{
    campaignId: string
    campaignName: string
    action: 'increase_budget' | 'decrease_budget' | 'pause' | 'reactivate' | 'adjust_bid'
    currentValue: number
    newValue: number
    reason: string
    expectedImpact: string
    applied: boolean
    appliedAt: string
  }> {
    // In production, this would call Google/Meta APIs
    return changes.map(change => ({
      ...change,
      applied: true,
      appliedAt: new Date().toISOString(),
    }))
  }

  /**
   * Format output
   */
  private formatOutput(
    appliedChanges: Array<{
      campaignId: string
      campaignName: string
      action: 'increase_budget' | 'decrease_budget' | 'pause' | 'reactivate' | 'adjust_bid'
      currentValue: number
      newValue: number
      reason: string
      expectedImpact: string
    }>,
    performanceData: CampaignPerformanceData[],
    keywordAnalysis: Awaited<ReturnType<ReturnType<typeof getAdsAgent>['analyzeKeywords']>>,
    input: AdsOptimizationInput
  ): AdsOptimizationOutput {
    // Calculate performance summary
    let totalSpend = 0
    let totalConversions = 0
    let totalClicks = 0
    let totalROAS = 0

    for (const campaign of performanceData) {
      totalSpend += campaign.spend
      totalConversions += campaign.conversions
      totalClicks += campaign.clicks
      totalROAS += campaign.roas || 0
    }

    const averageCPC = totalClicks > 0 ? totalSpend / totalClicks : 0
    const roas = performanceData.length > 0 ? totalROAS / performanceData.length : 0

    return {
      date: input.date.toISOString().split('T')[0],
      campaignAdjustments: appliedChanges,
      keywordOptimizations: keywordAnalysis.newKeywords.slice(0, 5).map(kw => ({
        keyword: kw.keyword,
        action: 'add' as const,
        reason: kw.rationale,
      })),
      budgetAllocation: performanceData.map(p => ({
        platform: p.platform,
        currentBudget: p.spend,
        recommendedBudget: p.spend * (p.roas && p.roas > 2 ? 1.1 : 0.9),
        reason: p.roas && p.roas > 2 ? 'ROAS acima da meta' : 'ROAS abaixo da meta',
      })),
      performanceSummary: {
        totalSpend,
        totalConversions,
        averageCPC,
        roas,
      },
    }
  }

  /**
   * Generate next actions
   */
  private generateNextActions(output: AdsOptimizationOutput) {
    const actions = []

    // Alert if ROAS is below target
    if (output.performanceSummary.roas < 2.0) {
      actions.push({
        type: 'escalate' as const,
        target: 'cmo',
        payload: {
          issue: 'ROAS abaixo do mínimo',
          currentROAS: output.performanceSummary.roas,
          targetROAS: 3.0,
        },
        priority: 'high' as const,
      })
    }

    // Schedule weekly report
    actions.push({
      type: 'schedule' as const,
      target: 'weekly-ads-report',
      payload: { date: output.date },
      priority: 'medium' as const,
    })

    return actions
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
      logger.info('workflow-cancelled', 'Ads Optimization cancelado')
    }
  }
}

// =============================================================================
// FACTORY FUNCTIONS
// =============================================================================

/**
 * Create ads optimization workflow
 */
export function createAdsOptimizationWorkflow(): AdsOptimizationWorkflow {
  return new AdsOptimizationWorkflow()
}

/**
 * Execute ads optimization with default options
 */
export async function executeAdsOptimization(
  options?: Partial<AdsOptimizationInput>
): Promise<WorkflowResult> {
  const workflow = createAdsOptimizationWorkflow()

  const input: AdsOptimizationInput = {
    date: options?.date || new Date(),
    campaigns: options?.campaigns || DEFAULT_CAMPAIGNS,
    budget: options?.budget || 500, // €500 default daily budget
    targetROAS: options?.targetROAS || 3.0,
  }

  return workflow.execute(input)
}
