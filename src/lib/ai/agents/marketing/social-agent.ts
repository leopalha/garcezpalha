/**
 * Social Agent
 * Responsible for social media management, scheduling, and engagement optimization
 */

import { EnhancedBaseAgent } from '../core/enhanced-base-agent'
import type { AgentRole, AgentContext, EnhancedAgentConfig } from '../core/agent-types'
import {
  SOCIAL_AGENT_SYSTEM_PROMPT,
  COMMENT_RESPONSE_PROMPT,
  ENGAGEMENT_ANALYSIS_PROMPT,
  SCHEDULE_OPTIMIZATION_PROMPT,
  HASHTAG_STRATEGY_PROMPT,
  INSTAGRAM_OPTIMIZATION_PROMPT,
  LINKEDIN_OPTIMIZATION_PROMPT,
  getOptimalTimes,
  getHashtagLimits,
  isOptimalTime,
} from '../../prompts/marketing/social-prompts'

// =============================================================================
// TYPES
// =============================================================================

export type SocialPlatform = 'instagram' | 'linkedin' | 'facebook' | 'twitter' | 'tiktok'

export interface Comment {
  id: string
  platform: SocialPlatform
  postId: string
  author: string
  content: string
  timestamp: string
  sentiment?: 'positive' | 'neutral' | 'negative' | 'spam'
}

export interface CommentResponse {
  response: string
  shouldReply: boolean
  reason: string
  sentiment: 'positive' | 'neutral' | 'negative' | 'spam'
  suggestDM: boolean
}

export interface EngagementMetrics {
  postId: string
  platform: SocialPlatform
  impressions: number
  reach: number
  engagements: number
  likes: number
  comments: number
  shares: number
  saves: number
  clicks: number
  engagementRate: number
}

export interface EngagementAnalysis {
  summary: string
  topPerformingContent: Array<{
    postId: string
    type: 'carrossel' | 'reel' | 'post' | 'story' | 'article'
    engagement_rate: number
    insights: string
  }>
  lowPerformingContent: Array<{
    postId: string
    type: string
    engagement_rate: number
    insights: string
  }>
  recommendations: Array<{
    area: 'horário' | 'formato' | 'tema' | 'hashtags'
    suggestion: string
    expectedImpact: 'alto' | 'médio' | 'baixo'
  }>
  optimalPostingTimes: Record<string, string[]>
  hashtagSuggestions: string[]
}

export interface ScheduledPost {
  id: string
  platform: SocialPlatform
  content: string
  scheduledFor: string
  status: 'draft' | 'scheduled' | 'published' | 'failed'
}

export interface ScheduleOptimization {
  optimizedSchedule: Array<{
    postId: string
    originalTime: string
    suggestedTime: string
    reason: string
    platform: SocialPlatform
  }>
  conflicts: Array<{
    date: string
    reason: string
    recommendation: string
  }>
}

export interface HashtagStrategy {
  instagram: {
    popular: string[]
    medium: string[]
    niche: string[]
    location: string[]
  }
  linkedin: string[]
  twitter: string[]
  facebook?: string[]
}

export interface PlatformOptimization {
  optimizedCaption?: string
  optimizedContent?: string
  suggestedFormat: string
  hookScore?: number
  readabilityScore?: number
  professionalTone?: number
  engagementPotential?: number
  improvements: string[]
}

// =============================================================================
// SOCIAL AGENT CLASS
// =============================================================================

export class SocialAgent extends EnhancedBaseAgent {
  constructor(config?: Partial<EnhancedAgentConfig>) {
    super(SOCIAL_AGENT_SYSTEM_PROMPT, 'social', {
      timeout: 60000,
      ...config,
    })
  }

  get name(): string {
    return 'Social Agent'
  }

  get role(): AgentRole {
    return 'social'
  }

  isRelevant(input: string): boolean {
    const keywords = [
      'social', 'rede', 'instagram', 'linkedin', 'facebook', 'twitter',
      'post', 'publicar', 'agendar', 'schedule', 'engajamento', 'engagement',
      'comentário', 'comment', 'hashtag', 'stories', 'reels',
    ]
    const lowerInput = input.toLowerCase()
    return keywords.some(keyword => lowerInput.includes(keyword))
  }

  // ===========================================================================
  // COMMENT MANAGEMENT
  // ===========================================================================

  /**
   * Analyze a comment and generate appropriate response
   */
  async analyzeComment(comment: Comment, context?: AgentContext): Promise<CommentResponse> {
    const prompt = `
${COMMENT_RESPONSE_PROMPT}

COMENTÁRIO PARA ANÁLISE:
- Plataforma: ${comment.platform}
- Autor: ${comment.author}
- Conteúdo: "${comment.content}"
- Data/Hora: ${comment.timestamp}

Analise e forneça a resposta no formato JSON especificado.
`

    const response = await this.processStructured<CommentResponse>(prompt, context)
    return response
  }

  /**
   * Batch analyze multiple comments
   */
  async analyzeComments(comments: Comment[]): Promise<Map<string, CommentResponse>> {
    const results = new Map<string, CommentResponse>()

    // Process in batches to avoid rate limits
    const batchSize = 5
    for (let i = 0; i < comments.length; i += batchSize) {
      const batch = comments.slice(i, i + batchSize)
      const promises = batch.map((comment) => this.analyzeComment(comment))
      const responses = await Promise.all(promises)

      batch.forEach((comment, index) => {
        results.set(comment.id, responses[index])
      })
    }

    return results
  }

  // ===========================================================================
  // ENGAGEMENT ANALYSIS
  // ===========================================================================

  /**
   * Analyze engagement metrics and provide recommendations
   */
  async analyzeEngagement(
    metrics: EngagementMetrics[],
    period: '7d' | '30d' | '90d' = '30d',
    context?: AgentContext
  ): Promise<EngagementAnalysis> {
    const prompt = `
${ENGAGEMENT_ANALYSIS_PROMPT}

DADOS DE ENGAJAMENTO (últimos ${period === '7d' ? '7 dias' : period === '30d' ? '30 dias' : '90 dias'}):

${metrics
  .map(
    (m) => `
Post ID: ${m.postId}
- Plataforma: ${m.platform}
- Impressões: ${m.impressions}
- Alcance: ${m.reach}
- Engajamentos: ${m.engagements}
- Likes: ${m.likes}
- Comentários: ${m.comments}
- Compartilhamentos: ${m.shares}
- Salvamentos: ${m.saves}
- Cliques: ${m.clicks}
- Taxa de Engajamento: ${(m.engagementRate * 100).toFixed(2)}%
`
  )
  .join('\n')}

Analise os dados e forneça recomendações no formato JSON especificado.
`

    const response = await this.processStructured<EngagementAnalysis>(prompt, context)
    return response
  }

  // ===========================================================================
  // SCHEDULING OPTIMIZATION
  // ===========================================================================

  /**
   * Optimize posting schedule based on historical data
   */
  async optimizeSchedule(
    posts: ScheduledPost[],
    historicalMetrics?: EngagementMetrics[],
    context?: AgentContext
  ): Promise<ScheduleOptimization> {
    const historicalContext = historicalMetrics
      ? `
DADOS HISTÓRICOS DE ENGAJAMENTO:
${historicalMetrics
  .slice(0, 20)
  .map(
    (m) => `- ${m.platform}: Post ${m.postId} às ${new Date(m.postId).getHours()}h - Taxa: ${(m.engagementRate * 100).toFixed(2)}%`
  )
  .join('\n')}
`
      : ''

    const prompt = `
${SCHEDULE_OPTIMIZATION_PROMPT}

POSTS AGENDADOS:
${posts
  .map(
    (p) => `
- ID: ${p.id}
- Plataforma: ${p.platform}
- Agendado para: ${p.scheduledFor}
- Status: ${p.status}
`
  )
  .join('\n')}

${historicalContext}

Otimize o agendamento e forneça sugestões no formato JSON especificado.
`

    const response = await this.processStructured<ScheduleOptimization>(prompt, context)
    return response
  }

  /**
   * Get optimal posting times for a platform
   */
  getOptimalPostingTimes(platform: SocialPlatform): string[] {
    return getOptimalTimes(platform)
  }

  /**
   * Check if a specific time is optimal for posting
   */
  isOptimalPostingTime(platform: SocialPlatform, hour: number): boolean {
    return isOptimalTime(platform, hour)
  }

  // ===========================================================================
  // HASHTAG STRATEGY
  // ===========================================================================

  /**
   * Generate hashtag strategy for content
   */
  async generateHashtagStrategy(
    content: string,
    platform: SocialPlatform,
    legalArea?: string,
    context?: AgentContext
  ): Promise<HashtagStrategy> {
    const prompt = `
${HASHTAG_STRATEGY_PROMPT}

CONTEÚDO:
"${content}"

PLATAFORMA PRINCIPAL: ${platform}
${legalArea ? `ÁREA JURÍDICA: ${legalArea}` : ''}

Gere a estratégia de hashtags no formato JSON especificado.
`

    const response = await this.processStructured<HashtagStrategy>(prompt, context)
    return response
  }

  /**
   * Get hashtag limits for a platform
   */
  getHashtagLimits(platform: SocialPlatform): { min: number; max: number } {
    return getHashtagLimits(platform)
  }

  // ===========================================================================
  // PLATFORM-SPECIFIC OPTIMIZATION
  // ===========================================================================

  /**
   * Optimize content for Instagram
   */
  async optimizeForInstagram(
    content: string,
    contentType: 'post' | 'carrossel' | 'reel' | 'story',
    context?: AgentContext
  ): Promise<PlatformOptimization> {
    const prompt = `
${INSTAGRAM_OPTIMIZATION_PROMPT}

CONTEÚDO ORIGINAL:
"${content}"

TIPO DE CONTEÚDO: ${contentType}

Otimize para Instagram e forneça no formato JSON especificado.
`

    const response = await this.processStructured<PlatformOptimization>(prompt, context)
    return response
  }

  /**
   * Optimize content for LinkedIn
   */
  async optimizeForLinkedIn(
    content: string,
    contentType: 'text' | 'article' | 'document' | 'poll',
    context?: AgentContext
  ): Promise<PlatformOptimization> {
    const prompt = `
${LINKEDIN_OPTIMIZATION_PROMPT}

CONTEÚDO ORIGINAL:
"${content}"

TIPO DE CONTEÚDO: ${contentType}

Otimize para LinkedIn e forneça no formato JSON especificado.
`

    const response = await this.processStructured<PlatformOptimization>(prompt, context)
    return response
  }

  /**
   * Optimize content for any platform
   */
  async optimizeForPlatform(
    content: string,
    platform: SocialPlatform,
    contentType: string,
    context?: AgentContext
  ): Promise<PlatformOptimization> {
    switch (platform) {
      case 'instagram':
        return this.optimizeForInstagram(content, contentType as 'post' | 'carrossel' | 'reel' | 'story', context)
      case 'linkedin':
        return this.optimizeForLinkedIn(content, contentType as 'text' | 'article' | 'document' | 'poll', context)
      default:
        // Generic optimization for other platforms
        const prompt = `
Otimize o seguinte conteúdo para ${platform}:

"${content}"

Considere:
1. Limites de caracteres da plataforma
2. Melhores práticas de engajamento
3. Tom apropriado para a plataforma
4. CTAs efetivos

Forneça resposta em JSON:
{
  "optimizedContent": "conteúdo otimizado",
  "suggestedFormat": "formato sugerido",
  "engagementPotential": 0-10,
  "improvements": ["melhoria 1", "melhoria 2"]
}
`
        return this.processStructured<PlatformOptimization>(prompt, context)
    }
  }

  // ===========================================================================
  // CONTENT ADAPTATION
  // ===========================================================================

  /**
   * Adapt content from one platform to another
   */
  async adaptContent(
    content: string,
    fromPlatform: SocialPlatform,
    toPlatform: SocialPlatform,
    context?: AgentContext
  ): Promise<{ adaptedContent: string; changes: string[] }> {
    const prompt = `
Adapte o seguinte conteúdo de ${fromPlatform} para ${toPlatform}.

CONTEÚDO ORIGINAL (${fromPlatform}):
"${content}"

CONSIDERAÇÕES:
- Limites de caracteres de ${toPlatform}
- Tom e estilo apropriados para ${toPlatform}
- Hashtags adequadas para ${toPlatform}
- Emojis (mais para Instagram/Facebook, menos para LinkedIn)
- CTAs específicos da plataforma

Forneça resposta em JSON:
{
  "adaptedContent": "conteúdo adaptado",
  "changes": ["mudança 1", "mudança 2"]
}
`

    const response = await this.processStructured<{ adaptedContent: string; changes: string[] }>(prompt, context)
    return response
  }

  /**
   * Create multi-platform content from a single piece
   */
  async createMultiPlatformContent(
    content: string,
    sourcePlatform: SocialPlatform,
    targetPlatforms: SocialPlatform[]
  ): Promise<Record<SocialPlatform, string>> {
    const results: Record<string, string> = {
      [sourcePlatform]: content,
    }

    for (const platform of targetPlatforms) {
      if (platform !== sourcePlatform) {
        const adapted = await this.adaptContent(content, sourcePlatform, platform)
        results[platform] = adapted.adaptedContent
      }
    }

    return results as Record<SocialPlatform, string>
  }

  // ===========================================================================
  // TRENDING & INSIGHTS
  // ===========================================================================

  /**
   * Analyze trending topics for legal content
   */
  async analyzeTrendingTopics(
    platform: SocialPlatform,
    legalAreas: string[],
    context?: AgentContext
  ): Promise<{
    trends: Array<{ topic: string; relevance: number; suggestion: string }>
    recommendedContent: string[]
  }> {
    const prompt = `
Analise tendências atuais para conteúdo jurídico em ${platform}.

ÁREAS JURÍDICAS DE FOCO:
${legalAreas.map((area) => `- ${area}`).join('\n')}

Considere:
1. Temas em alta nas redes sociais
2. Mudanças legislativas recentes
3. Dúvidas comuns do público
4. Datas comemorativas relevantes

Forneça resposta em JSON:
{
  "trends": [
    {
      "topic": "tema em alta",
      "relevance": 0-10,
      "suggestion": "como abordar o tema"
    }
  ],
  "recommendedContent": [
    "ideia de conteúdo 1",
    "ideia de conteúdo 2"
  ]
}
`

    const response = await this.processStructured<{
      trends: Array<{ topic: string; relevance: number; suggestion: string }>
      recommendedContent: string[]
    }>(prompt, context)

    return response
  }

  // ===========================================================================
  // REPORTING
  // ===========================================================================

  /**
   * Generate social media performance report
   */
  async generatePerformanceReport(
    metrics: EngagementMetrics[],
    period: '7d' | '30d' | '90d',
    context?: AgentContext
  ): Promise<{
    summary: string
    highlights: string[]
    concerns: string[]
    recommendations: string[]
    metrics: {
      totalImpressions: number
      totalEngagements: number
      avgEngagementRate: number
      topPlatform: SocialPlatform
      topContentType: string
    }
  }> {
    const totalImpressions = metrics.reduce((sum, m) => sum + m.impressions, 0)
    const totalEngagements = metrics.reduce((sum, m) => sum + m.engagements, 0)
    const avgEngagementRate = metrics.length > 0
      ? metrics.reduce((sum, m) => sum + m.engagementRate, 0) / metrics.length
      : 0

    // Find top platform
    const platformEngagement: Record<string, number> = {}
    metrics.forEach((m) => {
      platformEngagement[m.platform] = (platformEngagement[m.platform] || 0) + m.engagements
    })
    const topPlatform = Object.entries(platformEngagement).sort(([, a], [, b]) => b - a)[0]?.[0] as SocialPlatform || 'instagram'

    const prompt = `
Gere um relatório de performance de redes sociais.

PERÍODO: ${period === '7d' ? '7 dias' : period === '30d' ? '30 dias' : '90 dias'}

MÉTRICAS AGREGADAS:
- Total de Impressões: ${totalImpressions.toLocaleString('pt-BR')}
- Total de Engajamentos: ${totalEngagements.toLocaleString('pt-BR')}
- Taxa Média de Engajamento: ${(avgEngagementRate * 100).toFixed(2)}%
- Posts Analisados: ${metrics.length}

DADOS POR POST:
${metrics
  .slice(0, 10)
  .map(
    (m) =>
      `- ${m.platform}: ${m.impressions} impressões, ${m.engagements} engajamentos (${(m.engagementRate * 100).toFixed(2)}%)`
  )
  .join('\n')}

Forneça análise em JSON:
{
  "summary": "resumo executivo do período",
  "highlights": ["destaque positivo 1", "destaque positivo 2"],
  "concerns": ["ponto de atenção 1", "ponto de atenção 2"],
  "recommendations": ["recomendação 1", "recomendação 2"]
}
`

    const analysis = await this.processStructured<{
      summary: string
      highlights: string[]
      concerns: string[]
      recommendations: string[]
    }>(prompt, context)

    return {
      ...analysis,
      metrics: {
        totalImpressions,
        totalEngagements,
        avgEngagementRate,
        topPlatform,
        topContentType: 'post',
      },
    }
  }
}

// =============================================================================
// FACTORY FUNCTION
// =============================================================================

/**
 * Create a new Social Agent instance
 */
export function createSocialAgent(config?: Partial<EnhancedAgentConfig>): SocialAgent {
  return new SocialAgent(config)
}

// =============================================================================
// EXPORTS
// =============================================================================

export {
  getOptimalTimes,
  getHashtagLimits,
  isOptimalTime,
}
