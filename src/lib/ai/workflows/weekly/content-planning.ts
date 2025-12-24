/**
 * Content Planning Workflow
 * Weekly content strategy and calendar planning
 * CMO-led planning with Content and Social agents
 */

import type {
  WorkflowConfig,
  WorkflowExecution,
  WorkflowResult,
  WorkflowStep,
  ContentPlanningInput,
  ContentPlanningOutput,
} from '../types'
import { getCMOAgent } from '../../agents/executive/cmo-agent'
import { getContentAgent } from '../../agents/marketing/content-agent'
import { createSocialAgent, type ScheduledPost } from '../../agents/marketing/social-agent'
import { createSEOAgent } from '../../agents/marketing/seo-agent'
import { createAgentLogger } from '../../agents/core/agent-logger'

// =============================================================================
// WORKFLOW CONFIGURATION
// =============================================================================

export const CONTENT_PLANNING_CONFIG: WorkflowConfig = {
  id: 'content-planning',
  name: 'Content Planning',
  description: 'Planejamento semanal de conteúdo e calendário editorial',
  frequency: 'weekly',
  priority: 'high',
  enabled: true,
  schedule: '0 14 * * 5', // Sextas às 14h
  timeout: 480000, // 8 minutos
  retryOnFailure: true,
  maxRetries: 2,
  notifyOnComplete: true,
  notifyOnFailure: true,
}

// =============================================================================
// CONSTANTS
// =============================================================================

const DEFAULT_CHANNELS = ['instagram', 'linkedin', 'blog']
const DAYS_OF_WEEK = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado']

const CHANNEL_POST_FREQUENCY: Record<string, number> = {
  instagram: 7, // 1 por dia
  linkedin: 5, // 5 por semana
  blog: 2, // 2 por semana
  facebook: 5,
  twitter: 14, // 2 por dia
}

const CONTENT_PILLARS = [
  'Educacional - Dicas e Explicações Legais',
  'Cases - Histórias de Sucesso',
  'Tendências - Novidades Jurídicas',
  'Bastidores - Dia a Dia do Escritório',
  'Institucional - Valores e Equipe',
]

// =============================================================================
// WORKFLOW IMPLEMENTATION
// =============================================================================

const logger = createAgentLogger('cmo', 'marketing')

export class ContentPlanningWorkflow {
  private execution: WorkflowExecution | null = null
  private steps: WorkflowStep[] = []

  /**
   * Execute content planning workflow
   */
  async execute(input: ContentPlanningInput): Promise<WorkflowResult> {
    const startTime = Date.now()

    this.execution = {
      id: `exec_${Date.now()}`,
      workflowId: CONTENT_PLANNING_CONFIG.id,
      status: 'running',
      steps: [],
      startedAt: new Date(),
      triggeredBy: 'schedule',
    }

    logger.info('workflow-start', 'Content Planning iniciando', {
      weekStart: input.weekStart,
    })

    try {
      // Step 1: Analyze channel performance using CMO
      const performanceAnalysis = await this.executeStep('analyze-performance', 'cmo', async () => {
        const cmo = getCMOAgent()
        // Use correct CMO method for channel analysis
        return await cmo.analyzeChannelPerformance(
          {
            start: this.getPreviousWeekStart(input.weekStart).toISOString().split('T')[0],
            end: input.weekStart.toISOString().split('T')[0],
          },
          input.channels.map(channel => ({
            channel,
            leads: Math.floor(10 + Math.random() * 20),
            spend: Math.floor(100 + Math.random() * 300),
            impressions: Math.floor(5000 + Math.random() * 10000),
            clicks: Math.floor(100 + Math.random() * 200),
            conversions: Math.floor(2 + Math.random() * 10),
            revenue: Math.floor(500 + Math.random() * 1500),
          }))
        )
      })

      // Step 2: Get SEO recommendations
      const seoRecommendations = await this.executeStep('seo-recommendations', 'seo', async () => {
        const seo = createSEOAgent()
        // Use researchKeywords method with correct signature
        return await seo.researchKeywords('direito imobiliário')
      })

      // Step 3: Coordinate content calendar with CMO
      const contentCalendar = await this.executeStep('plan-calendar', 'cmo', async () => {
        const cmo = getCMOAgent()
        const month = input.weekStart.toLocaleString('pt-BR', { month: 'long' })
        const year = input.weekStart.getFullYear()
        const theme = input.themes?.[0] || 'Conteúdo jurídico educativo'
        const goals = ['Engajamento', 'Autoridade', 'Geração de leads']

        return await cmo.coordinateContentCalendar(month, year, theme, goals)
      })

      // Step 4: Generate content ideas with Content Agent
      const contentIdeas = await this.executeStep('generate-ideas', 'content', async () => {
        const content = getContentAgent()
        const ideas = []

        // Generate ideas for each channel
        for (const channel of input.channels.slice(0, 2)) {
          if (channel === 'instagram') {
            const post = await content.generateInstagramPost(
              'Dica jurídica da semana',
              'geral'
            )
            ideas.push({ channel, content: post, type: 'post' })
          } else if (channel === 'linkedin') {
            const post = await content.generateLinkedInPost(
              'Insight jurídico profissional',
              'empresarial'
            )
            ideas.push({ channel, content: post, type: 'article' })
          }
        }

        return ideas
      })

      // Step 5: Optimize posting schedule
      const optimizedSchedule = await this.executeStep('optimize-schedule', 'social', async () => {
        const social = createSocialAgent()

        // Convert content calendar to scheduled posts
        const posts: ScheduledPost[] = []
        const weekEnd = this.getWeekEnd(input.weekStart)

        for (let i = 0; i < 7; i++) {
          const date = new Date(input.weekStart)
          date.setDate(date.getDate() + i)

          for (const channel of input.channels) {
            const platform = channel as 'instagram' | 'linkedin' | 'facebook' | 'twitter' | 'tiktok'
            if (['instagram', 'linkedin', 'facebook', 'twitter', 'tiktok'].includes(channel)) {
              posts.push({
                id: `post_${date.toISOString().split('T')[0]}_${channel}`,
                platform,
                content: `Conteúdo para ${channel}`,
                scheduledFor: `${date.toISOString().split('T')[0]}T12:00:00`,
                status: 'draft',
              })
            }
          }
        }

        return await social.optimizeSchedule(posts)
      })

      // Format output
      const output = this.formatOutput(
        contentCalendar,
        optimizedSchedule,
        performanceAnalysis,
        input
      )

      this.execution.status = 'completed'
      this.execution.completedAt = new Date()
      this.execution.duration = Date.now() - startTime

      logger.info('workflow-complete', 'Content Planning concluído', {
        duration: this.execution.duration,
        postsPlanned: this.countTotalPosts(output.contentCalendar),
      })

      return {
        success: true,
        summary: `${this.countTotalPosts(output.contentCalendar)} posts planejados para a semana`,
        outputs: { planning: output },
        metrics: {
          stepsCompleted: this.steps.filter(s => s.status === 'completed').length,
          stepsFailed: this.steps.filter(s => s.status === 'failed').length,
          totalDuration: this.execution.duration,
          agentsUsed: ['cmo', 'content', 'social', 'seo'],
        },
        nextActions: this.generateNextActions(output),
      }
    } catch (error) {
      this.execution.status = 'failed'
      this.execution.error = error instanceof Error ? error.message : 'Unknown error'
      this.execution.completedAt = new Date()
      this.execution.duration = Date.now() - startTime

      logger.error('workflow-failed', 'Content Planning falhou', error as Error)

      return {
        success: false,
        summary: `Erro no planejamento: ${this.execution.error}`,
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
    agent: 'cmo' | 'content' | 'social' | 'seo',
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
   * Get week end date
   */
  private getWeekEnd(weekStart: Date): Date {
    const end = new Date(weekStart)
    end.setDate(end.getDate() + 6)
    return end
  }

  /**
   * Get previous week start date
   */
  private getPreviousWeekStart(weekStart: Date): Date {
    const prev = new Date(weekStart)
    prev.setDate(prev.getDate() - 7)
    return prev
  }

  /**
   * Get top keywords for SEO
   */
  private async getTopKeywords(): Promise<string[]> {
    // In production, this would fetch from analytics/database
    return [
      'advogado imobiliário',
      'usucapião',
      'holding familiar',
      'plano de saúde negado',
      'aposentadoria INSS',
      'inventário',
      'regularização imóvel',
    ]
  }

  /**
   * Format workflow output
   */
  private formatOutput(
    contentCalendar: Awaited<ReturnType<ReturnType<typeof getCMOAgent>['coordinateContentCalendar']>>,
    optimizedSchedule: Awaited<ReturnType<ReturnType<typeof createSocialAgent>['optimizeSchedule']>>,
    performanceAnalysis: Awaited<ReturnType<ReturnType<typeof getCMOAgent>['analyzeChannelPerformance']>>,
    input: ContentPlanningInput
  ): ContentPlanningOutput {
    const weekStart = input.weekStart
    const weekEnd = this.getWeekEnd(weekStart)

    // Build content calendar by day
    const calendar = this.buildWeeklyCalendar(weekStart, contentCalendar, optimizedSchedule)

    // Calculate channel strategy
    const channelStrategy = this.buildChannelStrategy(input.channels, performanceAnalysis)

    // Calculate resource needs
    const resourceNeeds = this.calculateResourceNeeds(calendar)

    return {
      period: {
        start: weekStart.toISOString().split('T')[0],
        end: weekEnd.toISOString().split('T')[0],
      },
      weeklyTheme: contentCalendar.theme || this.getRandomPillar(),
      contentCalendar: calendar,
      channelStrategy,
      resourceNeeds,
    }
  }

  /**
   * Build weekly calendar structure
   */
  private buildWeeklyCalendar(
    weekStart: Date,
    contentCalendar: Awaited<ReturnType<ReturnType<typeof getCMOAgent>['coordinateContentCalendar']>>,
    optimizedSchedule: Awaited<ReturnType<ReturnType<typeof createSocialAgent>['optimizeSchedule']>>
  ): ContentPlanningOutput['contentCalendar'] {
    const calendar: ContentPlanningOutput['contentCalendar'] = []

    for (let i = 0; i < 7; i++) {
      const date = new Date(weekStart)
      date.setDate(date.getDate() + i)
      const dateStr = date.toISOString().split('T')[0]

      // Get posts from optimized schedule for this day
      const daySchedule = (optimizedSchedule.optimizedSchedule || []).filter(s => {
        return s.suggestedTime?.startsWith(dateStr)
      })

      // Get posts from content calendar weeks
      const calendarPosts: Array<{ channel: string; type: string; topic: string }> = []
      for (const week of contentCalendar.weeks || []) {
        for (const content of week.content || []) {
          if (content.day === dateStr) {
            calendarPosts.push({
              channel: content.channel,
              type: content.type,
              topic: content.topic,
            })
          }
        }
      }

      const formattedPosts = [...calendarPosts].map(p => ({
        channel: p.channel || 'instagram',
        time: '12:00',
        contentType: p.type || 'post',
        topic: p.topic || 'Conteúdo',
        brief: '',
        status: 'planned' as const,
      }))

      // Add from optimized schedule
      for (const s of daySchedule) {
        formattedPosts.push({
          channel: s.platform || 'instagram',
          time: s.suggestedTime?.split('T')[1]?.substring(0, 5) || '12:00',
          contentType: 'post',
          topic: s.reason || 'Post otimizado',
          brief: '',
          status: 'planned' as const,
        })
      }

      // Ensure minimum posts per day based on channel frequency
      if (formattedPosts.length === 0 && i >= 1 && i <= 5) {
        // Add placeholder for weekdays
        formattedPosts.push({
          channel: 'instagram',
          time: '12:00',
          contentType: 'post',
          topic: `${CONTENT_PILLARS[i % CONTENT_PILLARS.length]}`,
          brief: 'A definir',
          status: 'planned' as const,
        })
      }

      calendar.push({
        day: DAYS_OF_WEEK[date.getDay()],
        date: dateStr,
        posts: formattedPosts,
      })
    }

    return calendar
  }

  /**
   * Build channel strategy
   */
  private buildChannelStrategy(
    channels: string[],
    performanceAnalysis: Awaited<ReturnType<ReturnType<typeof getCMOAgent>['analyzeChannelPerformance']>>
  ): ContentPlanningOutput['channelStrategy'] {
    const channelMetrics = performanceAnalysis.byChannel || []

    return channels.map(channel => {
      const channelData = channelMetrics.find((m: { channel: string }) => m.channel === channel)
      const metrics = channelData?.metrics

      return {
        channel,
        postsPlanned: CHANNEL_POST_FREQUENCY[channel] || 5,
        focusAreas: this.getChannelFocusAreas(channel),
        targetMetrics: [
          { metric: 'Engajamento', target: (metrics?.roas || 5) * 1.1 },
          { metric: 'Alcance', target: (metrics?.leads || 1000) * 1.15 },
        ],
      }
    })
  }

  /**
   * Get focus areas by channel
   */
  private getChannelFocusAreas(channel: string): string[] {
    switch (channel) {
      case 'instagram':
        return ['Carrosséis educativos', 'Reels curtos', 'Stories interativos']
      case 'linkedin':
        return ['Artigos de opinião', 'Cases de sucesso', 'Networking']
      case 'blog':
        return ['SEO', 'Guias completos', 'FAQ jurídico']
      default:
        return ['Conteúdo educativo', 'Engajamento']
    }
  }

  /**
   * Calculate resource needs
   */
  private calculateResourceNeeds(
    calendar: ContentPlanningOutput['contentCalendar']
  ): ContentPlanningOutput['resourceNeeds'] {
    let copyCount = 0
    let designCount = 0
    let videoCount = 0
    let reviewCount = 0

    for (const day of calendar) {
      for (const post of day.posts) {
        copyCount++
        reviewCount++

        if (post.contentType === 'carousel' || post.contentType === 'post') {
          designCount++
        }
        if (post.contentType === 'reel' || post.contentType === 'video') {
          videoCount++
        }
      }
    }

    const weekEnd = new Date()
    weekEnd.setDate(weekEnd.getDate() + 7)
    const deadline = weekEnd.toISOString().split('T')[0]

    return [
      { type: 'copy', quantity: copyCount, deadline },
      { type: 'design', quantity: designCount, deadline },
      { type: 'video', quantity: videoCount, deadline },
      { type: 'review', quantity: reviewCount, deadline },
    ]
  }

  /**
   * Count total posts
   */
  private countTotalPosts(calendar: ContentPlanningOutput['contentCalendar']): number {
    return calendar.reduce((total, day) => total + day.posts.length, 0)
  }

  /**
   * Get random content pillar
   */
  private getRandomPillar(): string {
    return CONTENT_PILLARS[Math.floor(Math.random() * CONTENT_PILLARS.length)]
  }

  /**
   * Generate next actions
   */
  private generateNextActions(output: ContentPlanningOutput) {
    const actions = []

    // Notify about planning completion
    actions.push({
      type: 'notify' as const,
      target: 'telegram',
      payload: {
        message: this.formatTelegramMessage(output),
        recipients: ['admin'],
      },
      priority: 'medium' as const,
    })

    // Schedule content generation
    for (const resource of output.resourceNeeds) {
      if (resource.quantity > 0) {
        actions.push({
          type: 'schedule' as const,
          target: `generate-${resource.type}`,
          payload: {
            quantity: resource.quantity,
            deadline: resource.deadline,
          },
          priority: 'high' as const,
        })
      }
    }

    return actions
  }

  /**
   * Format Telegram message
   */
  private formatTelegramMessage(output: ContentPlanningOutput): string {
    const lines = [
      `📅 *Planejamento de Conteúdo*`,
      `${output.period.start} a ${output.period.end}`,
      '',
      `🎯 *Tema da Semana:*`,
      output.weeklyTheme,
      '',
      '*Posts por Canal:*',
    ]

    for (const strategy of output.channelStrategy) {
      lines.push(`• ${strategy.channel}: ${strategy.postsPlanned} posts`)
    }

    lines.push('')
    lines.push('*Recursos Necessários:*')

    for (const resource of output.resourceNeeds) {
      if (resource.quantity > 0) {
        const emoji = resource.type === 'copy' ? '✍️' : resource.type === 'design' ? '🎨' : resource.type === 'video' ? '🎬' : '✅'
        lines.push(`${emoji} ${resource.type}: ${resource.quantity}`)
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
      logger.info('workflow-cancelled', 'Content Planning cancelado')
    }
  }
}

// =============================================================================
// FACTORY FUNCTIONS
// =============================================================================

/**
 * Create content planning workflow
 */
export function createContentPlanningWorkflow(): ContentPlanningWorkflow {
  return new ContentPlanningWorkflow()
}

/**
 * Execute content planning with default options
 */
export async function executeContentPlanning(
  options?: Partial<ContentPlanningInput>
): Promise<WorkflowResult> {
  const workflow = createContentPlanningWorkflow()

  const today = new Date()
  const nextMonday = new Date(today)
  nextMonday.setDate(today.getDate() + ((8 - today.getDay()) % 7 || 7))

  const input: ContentPlanningInput = {
    weekStart: options?.weekStart || nextMonday,
    channels: options?.channels || DEFAULT_CHANNELS,
    themes: options?.themes,
    specialDates: options?.specialDates,
  }

  return workflow.execute(input)
}
