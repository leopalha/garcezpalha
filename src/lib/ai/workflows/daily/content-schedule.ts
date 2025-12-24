/**
 * Content Schedule Workflow
 * Daily content scheduling and generation coordination
 * Orchestrates Content, Social agents for daily content management
 */

import type {
  WorkflowConfig,
  WorkflowExecution,
  WorkflowResult,
  WorkflowStep,
  ContentScheduleInput,
  ContentScheduleOutput,
} from '../types'
import { getCMOAgent } from '../../agents/executive/cmo-agent'
import { getContentAgent } from '../../agents/marketing/content-agent'
import { createSocialAgent, type ScheduledPost, type EngagementMetrics } from '../../agents/marketing/social-agent'
import { createAgentLogger } from '../../agents/core/agent-logger'

// =============================================================================
// WORKFLOW CONFIGURATION
// =============================================================================

export const CONTENT_SCHEDULE_CONFIG: WorkflowConfig = {
  id: 'content-schedule',
  name: 'Content Schedule',
  description: 'Agenda e coordena publicações de conteúdo para o dia',
  frequency: 'daily',
  priority: 'high',
  enabled: true,
  schedule: '0 7 * * *', // 7h todos os dias
  timeout: 180000, // 3 minutos
  retryOnFailure: true,
  maxRetries: 2,
  notifyOnComplete: false,
  notifyOnFailure: true,
}

// =============================================================================
// CONSTANTS
// =============================================================================

const DEFAULT_CHANNELS = ['instagram', 'linkedin', 'blog']
const DEFAULT_CONTENT_TYPES = ['post', 'article', 'story', 'carousel']

const OPTIMAL_POSTING_TIMES: Record<string, string[]> = {
  instagram: ['09:00', '12:00', '18:00', '21:00'],
  linkedin: ['08:00', '12:00', '17:00'],
  blog: ['10:00'],
  facebook: ['09:00', '13:00', '16:00'],
  twitter: ['08:00', '12:00', '17:00', '20:00'],
}

// =============================================================================
// WORKFLOW IMPLEMENTATION
// =============================================================================

const logger = createAgentLogger('cmo', 'marketing')

export class ContentScheduleWorkflow {
  private execution: WorkflowExecution | null = null
  private steps: WorkflowStep[] = []

  /**
   * Execute the content schedule workflow
   */
  async execute(input: ContentScheduleInput): Promise<WorkflowResult> {
    const startTime = Date.now()

    this.execution = {
      id: `exec_${Date.now()}`,
      workflowId: CONTENT_SCHEDULE_CONFIG.id,
      status: 'running',
      steps: [],
      startedAt: new Date(),
      triggeredBy: 'schedule',
    }

    logger.info('workflow-start', 'Content Schedule iniciando', { date: input.date })

    try {
      // Step 1: Get content calendar coordination from CMO
      const calendarData = await this.executeStep('check-calendar', 'cmo', async () => {
        const cmo = getCMOAgent()
        const now = input.date
        const month = now.toLocaleString('pt-BR', { month: 'long' })
        const year = now.getFullYear()

        return await cmo.coordinateContentCalendar(
          month,
          year,
          'Conteúdo jurídico educativo',
          ['Engajamento', 'Autoridade', 'Geração de leads']
        )
      })

      // Step 2: Identify content gaps
      const gaps = await this.executeStep('identify-gaps', 'content', async () => {
        return this.identifyContentGaps(calendarData, input)
      })

      // Step 3: Generate missing content
      const generatedContent = await this.executeStep('generate-content', 'content', async () => {
        if (gaps.length === 0) return []
        const content = getContentAgent()
        return await this.generateMissingContent(content, gaps)
      })

      // Step 4: Optimize posting schedule
      const optimizedSchedule = await this.executeStep('optimize-schedule', 'social', async () => {
        const social = createSocialAgent()

        // Convert existing content to ScheduledPost format
        const existingPosts: ScheduledPost[] = this.convertToScheduledPosts(calendarData, input.date)

        // Add generated content as scheduled posts
        const newPosts: ScheduledPost[] = generatedContent.map((item, index) => ({
          id: `new_${Date.now()}_${index}`,
          platform: item.channel as 'instagram' | 'linkedin' | 'facebook' | 'twitter' | 'tiktok',
          content: typeof item.content === 'string' ? item.content : JSON.stringify(item.content),
          scheduledFor: `${input.date.toISOString().split('T')[0]}T${item.time}:00`,
          status: 'draft' as const,
        }))

        const allPosts = [...existingPosts, ...newPosts]

        return await social.optimizeSchedule(allPosts)
      })

      // Step 5: Schedule posts
      const scheduledPosts = await this.executeStep('schedule-posts', 'social', async () => {
        return this.schedulePosts(optimizedSchedule)
      })

      // Format output
      const output = this.formatOutput(scheduledPosts, gaps, input)

      this.execution.status = 'completed'
      this.execution.completedAt = new Date()
      this.execution.duration = Date.now() - startTime

      logger.info('workflow-complete', 'Content Schedule concluído', {
        duration: this.execution.duration,
        postsScheduled: scheduledPosts.length,
        gapsIdentified: gaps.length,
      })

      return {
        success: true,
        summary: `${scheduledPosts.length} posts agendados para ${input.date.toLocaleDateString('pt-BR')}`,
        outputs: { schedule: output },
        metrics: {
          stepsCompleted: this.steps.filter(s => s.status === 'completed').length,
          stepsFailed: this.steps.filter(s => s.status === 'failed').length,
          totalDuration: this.execution.duration,
          agentsUsed: ['cmo', 'content', 'social'],
        },
      }
    } catch (error) {
      this.execution.status = 'failed'
      this.execution.error = error instanceof Error ? error.message : 'Unknown error'
      this.execution.completedAt = new Date()
      this.execution.duration = Date.now() - startTime

      logger.error('workflow-failed', 'Content Schedule falhou', error as Error)

      return {
        success: false,
        summary: `Erro ao agendar conteúdo: ${this.execution.error}`,
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
    agent: 'cmo' | 'content' | 'social',
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
   * Convert calendar data to ScheduledPost format
   */
  private convertToScheduledPosts(
    calendarData: Awaited<ReturnType<ReturnType<typeof getCMOAgent>['coordinateContentCalendar']>>,
    date: Date
  ): ScheduledPost[] {
    const posts: ScheduledPost[] = []
    const dateStr = date.toISOString().split('T')[0]

    // Extract posts from weeks array
    for (const week of calendarData.weeks || []) {
      for (const content of week.content || []) {
        if (content.day === dateStr || content.status === 'planned') {
          posts.push({
            id: `cal_${Date.now()}_${posts.length}`,
            platform: content.channel as 'instagram' | 'linkedin' | 'facebook' | 'twitter' | 'tiktok',
            content: content.topic,
            scheduledFor: `${dateStr}T12:00:00`,
            status: content.status === 'published' ? 'published' : 'scheduled',
          })
        }
      }
    }

    return posts
  }

  /**
   * Identify content gaps for the day
   */
  private identifyContentGaps(
    calendarData: Awaited<ReturnType<ReturnType<typeof getCMOAgent>['coordinateContentCalendar']>>,
    input: ContentScheduleInput
  ): Array<{ channel: string; reason: string; suggestion: string }> {
    const gaps: Array<{ channel: string; reason: string; suggestion: string }> = []

    // Get today's content from calendar
    const todayContent: Array<{ channel: string; type: string }> = []
    for (const week of calendarData.weeks || []) {
      for (const content of week.content || []) {
        todayContent.push({ channel: content.channel, type: content.type })
      }
    }

    for (const channel of input.channels) {
      const channelContent = todayContent.filter(c => c.channel === channel)
      const optimalTimes = OPTIMAL_POSTING_TIMES[channel] || ['12:00']

      // Check if we have enough posts
      const minPosts = channel === 'blog' ? 1 : 2
      if (channelContent.length < minPosts) {
        gaps.push({
          channel,
          reason: `Apenas ${channelContent.length} post(s) agendado(s), mínimo recomendado: ${minPosts}`,
          suggestion: `Gerar ${minPosts - channelContent.length} post(s) adicional(is) para ${channel}`,
        })
      }
    }

    return gaps
  }

  /**
   * Generate missing content using Content Agent
   */
  private async generateMissingContent(
    contentAgent: ReturnType<typeof getContentAgent>,
    gaps: Array<{ channel: string; reason: string; suggestion: string }>
  ): Promise<Array<{ channel: string; content: unknown; time: string }>> {
    const generated: Array<{ channel: string; content: unknown; time: string }> = []

    // Group gaps by channel
    const gapsByChannel = gaps.reduce((acc, gap) => {
      if (!acc[gap.channel]) acc[gap.channel] = []
      acc[gap.channel].push(gap)
      return acc
    }, {} as Record<string, typeof gaps>)

    for (const [channel, channelGaps] of Object.entries(gapsByChannel)) {
      // Generate one post per channel gap
      if (channelGaps.length > 0) {
        const optimalTimes = OPTIMAL_POSTING_TIMES[channel] || ['12:00']
        const time = optimalTimes[0]

        try {
          let content
          if (channel === 'instagram') {
            // Uses correct signature: generateInstagramPost(topic, legalArea?, context?)
            content = await contentAgent.generateInstagramPost(
              'Dica jurídica do dia',
              'geral'
            )
          } else if (channel === 'linkedin') {
            // Uses correct signature: generateLinkedInPost(topic, legalArea?, context?)
            content = await contentAgent.generateLinkedInPost(
              'Insight jurídico profissional',
              'empresarial'
            )
          } else if (channel === 'blog') {
            // Uses correct signature: generateBlogArticle(topic, options?)
            content = await contentAgent.generateBlogArticle(
              'Artigo jurídico',
              {
                legalArea: 'geral',
                minWords: 800,
                includeFA: true,
              }
            )
          }

          if (content) {
            generated.push({ channel, content, time })
          }
        } catch (error) {
          logger.warn('content-generation-failed', `Falha ao gerar conteúdo para ${channel}`, { error })
        }
      }
    }

    return generated
  }

  /**
   * Schedule posts from optimization result
   */
  private schedulePosts(
    optimizedSchedule: Awaited<ReturnType<ReturnType<typeof createSocialAgent>['optimizeSchedule']>>
  ): Array<{ id: string; time: string; channel: string; contentType: string; title: string; status: string }> {
    return (optimizedSchedule.optimizedSchedule || []).map((item, index) => ({
      id: item.postId || `post_${Date.now()}_${index}`,
      time: item.suggestedTime || '12:00',
      channel: item.platform || 'instagram',
      contentType: 'post',
      title: `Post agendado para ${item.suggestedTime}`,
      status: 'ready',
    }))
  }

  /**
   * Format workflow output
   */
  private formatOutput(
    scheduledPosts: Array<{ id: string; time: string; channel: string; contentType: string; title: string; status: string }>,
    gaps: Array<{ channel: string; reason: string; suggestion: string }>,
    input: ContentScheduleInput
  ): ContentScheduleOutput {
    return {
      date: input.date.toISOString().split('T')[0],
      scheduledPosts: scheduledPosts.map(p => ({
        ...p,
        status: p.status as 'ready' | 'pending_approval' | 'generating',
      })),
      contentGaps: gaps,
      generationTasks: gaps.slice(0, 3).map(gap => ({
        contentType: 'post',
        channel: gap.channel,
        topic: gap.suggestion,
        deadline: input.date.toISOString(),
      })),
    }
  }

  /**
   * Get current status
   */
  getStatus() {
    return this.execution?.status || 'pending'
  }

  /**
   * Get current execution
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
      logger.info('workflow-cancelled', 'Content Schedule cancelado')
    }
  }
}

// =============================================================================
// FACTORY FUNCTIONS
// =============================================================================

/**
 * Create content schedule workflow
 */
export function createContentScheduleWorkflow(): ContentScheduleWorkflow {
  return new ContentScheduleWorkflow()
}

/**
 * Execute content schedule with default options
 */
export async function executeContentSchedule(
  options?: Partial<ContentScheduleInput>
): Promise<WorkflowResult> {
  const workflow = createContentScheduleWorkflow()

  const input: ContentScheduleInput = {
    date: options?.date || new Date(),
    channels: options?.channels || DEFAULT_CHANNELS,
    contentTypes: options?.contentTypes || DEFAULT_CONTENT_TYPES,
  }

  return workflow.execute(input)
}
