/**
 * Content Agent
 * Autonomous content generation for multiple platforms
 * Handles blog posts, social media, newsletters, and video scripts
 */

import { EnhancedBaseAgent } from '../core/enhanced-base-agent'
import type {
  AgentRole,
  EnhancedAgentConfig,
  ContentRequest,
  GeneratedContent,
  ContentType,
  SocialPlatform,
  AgentContext,
} from '../core/agent-types'
import {
  CONTENT_AGENT_SYSTEM_PROMPT,
  buildContentPrompt,
  getPromptForPlatform,
  INSTAGRAM_POST_PROMPT,
  LINKEDIN_POST_PROMPT,
  BLOG_ARTICLE_PROMPT,
  NEWSLETTER_PROMPT,
  VIDEO_SCRIPT_PROMPT,
  CONTENT_CALENDAR_PROMPT,
  TOPIC_IDEAS_PROMPT,
} from '../../prompts/marketing/content-prompts'

// =============================================================================
// CONTENT AGENT
// =============================================================================

export class ContentAgent extends EnhancedBaseAgent {
  constructor(config?: Partial<EnhancedAgentConfig>) {
    super(CONTENT_AGENT_SYSTEM_PROMPT, 'content', {
      temperature: 0.8, // More creative for content
      ...config,
    })
  }

  get name(): string {
    return 'Content Agent'
  }

  get role(): AgentRole {
    return 'content'
  }

  isRelevant(input: string): boolean {
    const keywords = [
      'post', 'artigo', 'article', 'blog', 'newsletter',
      'texto', 'copy', 'conteúdo', 'content', 'escrever',
      'write', 'criar', 'create', 'gerar', 'generate',
      'instagram', 'linkedin', 'social', 'publicar', 'publish',
    ]
    const lowerInput = input.toLowerCase()
    return keywords.some(keyword => lowerInput.includes(keyword))
  }

  // =============================================================================
  // SOCIAL MEDIA METHODS
  // =============================================================================

  /**
   * Generate Instagram post
   */
  async generateInstagramPost(
    topic: string,
    legalArea?: string,
    context?: AgentContext
  ): Promise<InstagramPost> {
    const prompt = buildContentPrompt('instagram', topic, legalArea)

    const response = await this.processStructured<InstagramPost>(
      prompt,
      context,
      isInstagramPost
    )

    this.logger.logContentGeneration('instagram-post', 'instagram')

    return response
  }

  /**
   * Generate LinkedIn post
   */
  async generateLinkedInPost(
    topic: string,
    legalArea?: string,
    context?: AgentContext
  ): Promise<LinkedInPost> {
    const prompt = buildContentPrompt('linkedin', topic, legalArea)

    const response = await this.processStructured<LinkedInPost>(
      prompt,
      context,
      isLinkedInPost
    )

    this.logger.logContentGeneration('linkedin-post', 'linkedin')

    return response
  }

  /**
   * Generate social post for any platform
   */
  async generateSocialPost(
    platform: SocialPlatform,
    topic: string,
    options?: {
      legalArea?: string
      tone?: 'professional' | 'casual' | 'educational' | 'promotional'
      maxLength?: number
      includeHashtags?: boolean
      includeCTA?: boolean
    }
  ): Promise<SocialPost> {
    const fullPrompt = [
      buildContentPrompt(platform, topic, options?.legalArea),
      options?.tone ? `\nTOM: ${options.tone}` : '',
      options?.maxLength ? `\nTAMANHO MÁXIMO: ${options.maxLength} caracteres` : '',
      options?.includeHashtags === false ? '\nNÃO incluir hashtags' : '',
      options?.includeCTA === false ? '\nNÃO incluir CTA' : '',
    ].join('')

    const response = await this.chat(fullPrompt)

    try {
      const parsed = JSON.parse(response.content)
      this.logger.logContentGeneration('social-post', platform)
      return {
        platform,
        ...parsed,
        generatedAt: new Date(),
        status: 'draft',
      }
    } catch {
      // Return raw content if not JSON
      return {
        platform,
        content: response.content,
        generatedAt: new Date(),
        status: 'draft',
      }
    }
  }

  // =============================================================================
  // BLOG METHODS
  // =============================================================================

  /**
   * Generate blog article
   */
  async generateBlogArticle(
    topic: string,
    options?: {
      legalArea?: string
      targetKeywords?: string[]
      minWords?: number
      includeFA?: boolean
    }
  ): Promise<BlogArticle> {
    const additionalContext = [
      options?.targetKeywords ? `Keywords alvo: ${options.targetKeywords.join(', ')}` : '',
      options?.minWords ? `Mínimo de palavras: ${options.minWords}` : '',
      options?.includeFA !== false ? 'Incluir seção de FAQ' : '',
    ].filter(Boolean).join('\n')

    const prompt = buildContentPrompt('blog', topic, options?.legalArea, additionalContext)

    const response = await this.processStructured<BlogArticle>(
      prompt,
      undefined,
      isBlogArticle
    )

    this.logger.logContentGeneration('blog-article', undefined, response.content?.length)

    return response
  }

  // =============================================================================
  // NEWSLETTER METHODS
  // =============================================================================

  /**
   * Generate newsletter
   */
  async generateNewsletter(
    topic: string,
    options?: {
      subscriberName?: string
      previousTopics?: string[]
      promotionalContent?: boolean
    }
  ): Promise<Newsletter> {
    const additionalContext = [
      options?.subscriberName ? `Nome do assinante: ${options.subscriberName}` : '',
      options?.previousTopics ? `Últimos temas: ${options.previousTopics.join(', ')}` : '',
      options?.promotionalContent ? 'Incluir conteúdo promocional sutil' : '',
    ].filter(Boolean).join('\n')

    const prompt = buildContentPrompt('newsletter', topic, undefined, additionalContext)

    const response = await this.processStructured<Newsletter>(
      prompt,
      undefined,
      isNewsletter
    )

    this.logger.logContentGeneration('newsletter')

    return response
  }

  // =============================================================================
  // VIDEO SCRIPT METHODS
  // =============================================================================

  /**
   * Generate video script (Reels/Shorts)
   */
  async generateVideoScript(
    topic: string,
    options?: {
      duration?: '15' | '30' | '60' | '90'
      style?: 'educational' | 'storytelling' | 'tips' | 'case-study'
      legalArea?: string
    }
  ): Promise<VideoScript> {
    const additionalContext = [
      options?.duration ? `Duração: ${options.duration} segundos` : '',
      options?.style ? `Estilo: ${options.style}` : '',
    ].filter(Boolean).join('\n')

    const prompt = buildContentPrompt('video', topic, options?.legalArea, additionalContext)

    const response = await this.processStructured<VideoScript>(
      prompt,
      undefined,
      isVideoScript
    )

    this.logger.logContentGeneration('video-script')

    return response
  }

  // =============================================================================
  // PLANNING METHODS
  // =============================================================================

  /**
   * Generate content calendar for the week
   */
  async generateContentCalendar(
    options?: {
      platforms?: SocialPlatform[]
      legalAreas?: string[]
      startDate?: Date
      campaigns?: string[]
    }
  ): Promise<ContentCalendar> {
    const startDate = options?.startDate || new Date()

    const additionalContext = [
      options?.platforms ? `Plataformas: ${options.platforms.join(', ')}` : '',
      options?.legalAreas ? `Áreas jurídicas foco: ${options.legalAreas.join(', ')}` : '',
      `Data início: ${startDate.toISOString().split('T')[0]}`,
      options?.campaigns ? `Campanhas ativas: ${options.campaigns.join(', ')}` : '',
    ].filter(Boolean).join('\n')

    const prompt = [
      CONTENT_AGENT_SYSTEM_PROMPT,
      '',
      CONTENT_CALENDAR_PROMPT,
      '',
      additionalContext,
    ].join('\n')

    const response = await this.processStructured<ContentCalendar>(prompt)

    this.logger.info('calendar', 'Generated content calendar', {
      weekStartDate: startDate,
      platforms: options?.platforms,
    })

    return response
  }

  /**
   * Generate topic ideas for a legal area
   */
  async generateTopicIdeas(
    legalArea: string,
    count: number = 10,
    platforms?: SocialPlatform[]
  ): Promise<TopicIdeas> {
    const additionalContext = [
      `Gerar ${count} ideias de conteúdo`,
      platforms ? `Plataformas foco: ${platforms.join(', ')}` : '',
    ].filter(Boolean).join('\n')

    const prompt = [
      CONTENT_AGENT_SYSTEM_PROMPT,
      '',
      TOPIC_IDEAS_PROMPT,
      '',
      `ÁREA JURÍDICA: ${legalArea}`,
      '',
      additionalContext,
    ].join('\n')

    const response = await this.processStructured<TopicIdeas>(prompt)

    this.logger.info('topics', `Generated ${count} topic ideas for ${legalArea}`)

    return response
  }

  // =============================================================================
  // BATCH GENERATION
  // =============================================================================

  /**
   * Generate content for multiple platforms at once
   */
  async generateMultiPlatformContent(
    topic: string,
    platforms: SocialPlatform[],
    legalArea?: string
  ): Promise<Map<SocialPlatform, SocialPost>> {
    const results = new Map<SocialPlatform, SocialPost>()

    // Generate in parallel for efficiency
    const promises = platforms.map(async platform => {
      const content = await this.generateSocialPost(platform, topic, { legalArea })
      results.set(platform, content)
    })

    await Promise.all(promises)

    this.logger.info('batch', `Generated content for ${platforms.length} platforms`, {
      topic,
      platforms,
    })

    return results
  }

  /**
   * Repurpose existing content for a new platform
   */
  async repurposeContent(
    originalContent: string,
    originalPlatform: string,
    targetPlatform: SocialPlatform
  ): Promise<SocialPost> {
    const prompt = [
      CONTENT_AGENT_SYSTEM_PROMPT,
      '',
      getPromptForPlatform(targetPlatform),
      '',
      `CONTEÚDO ORIGINAL (${originalPlatform}):`,
      originalContent,
      '',
      `Adapte este conteúdo para ${targetPlatform}, mantendo a mensagem central mas otimizando para o formato da plataforma.`,
    ].join('\n')

    const response = await this.chat(prompt)

    try {
      const parsed = JSON.parse(response.content)
      this.logger.info('repurpose', `Repurposed content from ${originalPlatform} to ${targetPlatform}`)
      return {
        platform: targetPlatform,
        ...parsed,
        generatedAt: new Date(),
        status: 'draft',
        repurposedFrom: originalPlatform,
      }
    } catch {
      return {
        platform: targetPlatform,
        content: response.content,
        generatedAt: new Date(),
        status: 'draft',
        repurposedFrom: originalPlatform,
      }
    }
  }
}

// =============================================================================
// TYPE DEFINITIONS
// =============================================================================

export interface InstagramPost {
  caption: string
  hashtags: string[]
  cta: string
  imageIdea?: string
  carouselIdeas?: string[]
  bestTimeToPost?: string
}

export interface LinkedInPost {
  content: string
  hashtags: string[]
  cta: string
  format: 'text' | 'article' | 'document' | 'poll'
  targetAudience?: string
}

export interface SocialPost {
  platform: SocialPlatform
  content?: string
  caption?: string
  hashtags?: string[]
  cta?: string
  generatedAt: Date
  status: 'draft' | 'scheduled' | 'published'
  repurposedFrom?: string
  [key: string]: unknown
}

export interface BlogArticle {
  title: string
  metaDescription: string
  slug: string
  content: string
  excerpt: string
  categories: string[]
  tags: string[]
  keywords: string[]
  readingTime: number
  faq?: Array<{ question: string; answer: string }>
}

export interface Newsletter {
  subject: string
  preheader: string
  greeting: string
  sections: Array<{
    title: string
    content: string
    cta?: { text: string; url: string }
  }>
  closing: string
  signature: string
}

export interface VideoScript {
  title: string
  duration: string
  hook: string
  script: Array<{
    timestamp: string
    narration: string
    visual: string
    onScreenText?: string
  }>
  cta: string
  captions: string
  music?: string
  tags: string[]
}

export interface ContentCalendar {
  weekStartDate: string
  theme?: string
  posts: Array<{
    day: string
    date: string
    platform: SocialPlatform
    type: string
    topic: string
    brief: string
    bestTime: string
    priority: 'high' | 'medium' | 'low'
  }>
  campaigns?: Array<{
    name: string
    goal: string
    platforms: SocialPlatform[]
    duration: string
  }>
  notes?: string
}

export interface TopicIdeas {
  legalArea: string
  ideas: Array<{
    topic: string
    angle: string
    platforms: SocialPlatform[]
    contentTypes: string[]
    keywords: string[]
    urgency: 'evergreen' | 'timely'
    difficulty: 'easy' | 'medium' | 'hard'
    estimatedEngagement: 'alto' | 'médio' | 'baixo'
  }>
  trendsToWatch?: string[]
  seasonalOpportunities?: string[]
}

// =============================================================================
// TYPE GUARDS
// =============================================================================

function isInstagramPost(value: unknown): value is InstagramPost {
  const v = value as InstagramPost
  return (
    typeof v === 'object' &&
    v !== null &&
    typeof v.caption === 'string' &&
    Array.isArray(v.hashtags)
  )
}

function isLinkedInPost(value: unknown): value is LinkedInPost {
  const v = value as LinkedInPost
  return (
    typeof v === 'object' &&
    v !== null &&
    typeof v.content === 'string'
  )
}

function isBlogArticle(value: unknown): value is BlogArticle {
  const v = value as BlogArticle
  return (
    typeof v === 'object' &&
    v !== null &&
    typeof v.title === 'string' &&
    typeof v.content === 'string'
  )
}

function isNewsletter(value: unknown): value is Newsletter {
  const v = value as Newsletter
  return (
    typeof v === 'object' &&
    v !== null &&
    typeof v.subject === 'string' &&
    Array.isArray(v.sections)
  )
}

function isVideoScript(value: unknown): value is VideoScript {
  const v = value as VideoScript
  return (
    typeof v === 'object' &&
    v !== null &&
    typeof v.title === 'string' &&
    Array.isArray(v.script)
  )
}

// =============================================================================
// SINGLETON
// =============================================================================

let contentAgentInstance: ContentAgent | null = null

export function getContentAgent(config?: Partial<EnhancedAgentConfig>): ContentAgent {
  if (!contentAgentInstance) {
    contentAgentInstance = new ContentAgent(config)
  }
  return contentAgentInstance
}
