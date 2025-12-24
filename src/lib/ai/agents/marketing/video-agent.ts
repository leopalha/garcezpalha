/**
 * Video Agent
 * Responsible for video content creation and optimization
 */

import { EnhancedBaseAgent } from '../core/enhanced-base-agent'
import type { AgentRole, AgentContext, EnhancedAgentConfig } from '../core/agent-types'
import {
  VIDEO_AGENT_SYSTEM_PROMPT,
  REELS_SCRIPT_PROMPT,
  YOUTUBE_SCRIPT_PROMPT,
  WEBINAR_SCRIPT_PROMPT,
  STORIES_SCRIPT_PROMPT,
  TESTIMONIAL_SCRIPT_PROMPT,
  VIDEO_SEO_PROMPT,
  CONTENT_REPURPOSE_PROMPT,
  VIDEO_SERIES_PROMPT,
  CONTENT_CALENDAR_VIDEO_PROMPT,
  getOptimalDuration,
  getVideoSpecs,
  getHookTemplates,
  getCTATemplates,
} from '../../prompts/marketing/video-prompts'

// =============================================================================
// TYPES
// =============================================================================

export type VideoPlatform = 'reels' | 'shorts' | 'tiktok' | 'youtube' | 'stories' | 'linkedin' | 'webinar'
export type VideoType = 'educational' | 'testimonial' | 'promotional' | 'behind_scenes' | 'qa'

export interface ScriptSegment {
  text: string
  duration: number
  visualNotes?: string
}

export interface ReelsScript {
  title: string
  hook: string
  duration: number
  script: {
    intro: ScriptSegment
    body: ScriptSegment[]
    cta: ScriptSegment
  }
  hashtags: string[]
  captionText: string
  thumbnailIdea: string
  musicSuggestion: string
  trendRelevance: string
}

export interface YouTubeChapter {
  title: string
  timestamp: string
  content: string
  duration: number
  bRoll: string[]
  graphics: string[]
}

export interface YouTubeScript {
  title: string
  description: string
  duration: number
  targetKeywords: string[]
  script: {
    intro: {
      hook: string
      channelIntro: string
      topicIntro: string
      duration: number
    }
    chapters: YouTubeChapter[]
    conclusion: {
      summary: string
      cta: string
      endScreen: string
      duration: number
    }
  }
  thumbnailConcepts: Array<{
    concept: string
    text: string
    emotion: string
  }>
  tags: string[]
  endScreenVideos: string[]
}

export interface WebinarStructure {
  title: string
  subtitle: string
  duration: number
  targetAudience: string
  learningObjectives: string[]
  structure: {
    welcome: { duration: number; content: string; slides: number }
    introduction: { duration: number; speakerBio: string; topicOverview: string; slides: number }
    mainContent: Array<{
      section: string
      duration: number
      keyPoints: string[]
      examples: string[]
      slides: number
    }>
    qAndA: {
      duration: number
      anticipatedQuestions: Array<{ question: string; answer: string }>
    }
    closing: {
      duration: number
      summary: string
      cta: string
      nextSteps: string[]
    }
  }
  slideDeck: {
    totalSlides: number
    slideOutline: Array<{
      slideNumber: number
      title: string
      bulletPoints: string[]
      visualSuggestion: string
    }>
  }
  promotionalAssets: {
    emailSubject: string
    emailBody: string
    socialPost: string
    landingPageCopy: string
  }
}

export interface Story {
  storyNumber: number
  type: 'text' | 'video' | 'poll' | 'quiz' | 'countdown'
  duration: number
  content: {
    text: string
    voiceOver: string
    visualDescription: string
    interactiveElement: Record<string, unknown> | null
  }
  sticker: string | null
  music: string | null
}

export interface StoriesSeries {
  topic: string
  totalStories: number
  stories: Story[]
  callToAction: {
    type: 'swipeUp' | 'dm' | 'link' | 'poll'
    text: string
    destination: string
  }
  bestTimeToPost: string
}

export interface TestimonialScript {
  title: string
  duration: number
  approach: 'actor' | 'real_client' | 'animated' | 'lawyer_narration'
  script: {
    opening: { situation: string; emotion: string; duration: number }
    problem: { challenge: string; impact: string; duration: number }
    solution: { approach: string; process: string; duration: number }
    result: { outcome: string; benefit: string; duration: number }
    recommendation: { message: string; cta: string; duration: number }
  }
  bRollSuggestions: string[]
  musicMood: string
  legalDisclaimer: string
}

export interface VideoSEO {
  optimizedTitle: string
  description: {
    hook: string
    fullDescription: string
    timestamps: Array<{ time: string; label: string }>
    links: string[]
    hashtags: string[]
  }
  tags: string[]
  category: string
  thumbnailSpecs: {
    text: string
    emotion: string
    colorScheme: string
    elements: string[]
  }
  endScreenStrategy: {
    videoToPromote: string
    playlistToPromote: string
    subscribePosition: string
  }
  cardsSuggestions: Array<{
    timestamp: string
    type: 'video' | 'playlist' | 'link'
    content: string
  }>
}

export interface VideoSeries {
  seriesTitle: string
  seriesDescription: string
  totalEpisodes: number
  releaseFrequency: string
  targetAudience: string
  episodes: Array<{
    episodeNumber: number
    title: string
    description: string
    duration: number
    keyTopics: string[]
    cta: string
    thumbnailConcept: string
  }>
  promotionStrategy: {
    prelaunch: string[]
    duringRelease: string[]
    postSeries: string[]
  }
  crossPromotion: {
    otherPlatforms: string[]
    emailMarketing: string
    paidPromotion: string
  }
}

export interface VideoCalendar {
  month: string
  year: number
  theme: string
  goals: string[]
  weeks: Array<{
    weekNumber: number
    focus: string
    content: Array<{
      day: string
      platform: string
      type: 'reels' | 'youtube' | 'stories' | 'live'
      topic: string
      duration: number
      status: 'idea' | 'scripted' | 'filmed' | 'edited' | 'scheduled'
    }>
  }>
  monthlyMetrics: {
    videoGoal: number
    viewsGoal: number
    engagementGoal: number
    leadsGoal: number
  }
  resources: {
    equipmentNeeded: string[]
    locationsNeeded: string[]
    guestsNeeded: string[]
  }
}

// =============================================================================
// VIDEO AGENT CLASS
// =============================================================================

export class VideoAgent extends EnhancedBaseAgent {
  constructor(config?: Partial<EnhancedAgentConfig>) {
    super(VIDEO_AGENT_SYSTEM_PROMPT, 'video', {
      timeout: 90000,
      ...config,
    })
  }

  get name(): string {
    return 'Video Agent'
  }

  get role(): AgentRole {
    return 'video'
  }

  isRelevant(input: string): boolean {
    const keywords = [
      'vídeo', 'video', 'reels', 'shorts', 'tiktok', 'youtube',
      'script', 'roteiro', 'webinar', 'stories', 'live',
      'thumbnail', 'edição', 'gravação', 'filmagem',
    ]
    const lowerInput = input.toLowerCase()
    return keywords.some(keyword => lowerInput.includes(keyword))
  }

  // ===========================================================================
  // SCRIPT GENERATION
  // ===========================================================================

  /**
   * Generate Reels/Shorts script
   */
  async generateReelsScript(
    topic: string,
    legalArea: string,
    context?: AgentContext
  ): Promise<ReelsScript> {
    const duration = getOptimalDuration('reels')
    const specs = getVideoSpecs('reels')
    const hooks = getHookTemplates()

    const prompt = `
${REELS_SCRIPT_PROMPT}

TEMA: ${topic}
ÁREA JURÍDICA: ${legalArea}

ESPECIFICAÇÕES:
- Duração ideal: ${duration.ideal} segundos
- Formato: ${specs.aspectRatio} (${specs.resolution})
- Estilo: Educativo e envolvente

EXEMPLOS DE HOOKS:
${hooks.slice(0, 3).join('\n')}

Crie um script para Reels no formato JSON especificado.
`

    const response = await this.processStructured<ReelsScript>(prompt, context)
    return response
  }

  /**
   * Generate YouTube video script
   */
  async generateYouTubeScript(
    topic: string,
    legalArea: string,
    targetDuration: number = 10,
    context?: AgentContext
  ): Promise<YouTubeScript> {
    const specs = getVideoSpecs('youtube')

    const prompt = `
${YOUTUBE_SCRIPT_PROMPT}

TEMA: ${topic}
ÁREA JURÍDICA: ${legalArea}
DURAÇÃO ALVO: ${targetDuration} minutos

ESPECIFICAÇÕES:
- Formato: ${specs.aspectRatio} (${specs.resolution})
- Estilo: Educativo, profissional, SEO-otimizado

Crie um script completo para YouTube no formato JSON especificado.
`

    const response = await this.processStructured<YouTubeScript>(prompt, context)
    return response
  }

  /**
   * Generate webinar structure and script
   */
  async generateWebinarStructure(
    topic: string,
    legalArea: string,
    duration: number = 60,
    context?: AgentContext
  ): Promise<WebinarStructure> {
    const prompt = `
${WEBINAR_SCRIPT_PROMPT}

TEMA: ${topic}
ÁREA JURÍDICA: ${legalArea}
DURAÇÃO: ${duration} minutos

Crie estrutura completa para webinar no formato JSON especificado.
`

    const response = await this.processStructured<WebinarStructure>(prompt, context)
    return response
  }

  /**
   * Generate Stories series
   */
  async generateStoriesSeries(
    topic: string,
    numberOfStories: number = 5,
    context?: AgentContext
  ): Promise<StoriesSeries> {
    const prompt = `
${STORIES_SCRIPT_PROMPT}

TEMA: ${topic}
NÚMERO DE STORIES: ${numberOfStories}

Crie uma série de Stories no formato JSON especificado.
`

    const response = await this.processStructured<StoriesSeries>(prompt, context)
    return response
  }

  /**
   * Generate testimonial video script
   */
  async generateTestimonialScript(
    caseType: string,
    legalArea: string,
    approach: 'actor' | 'real_client' | 'animated' | 'lawyer_narration' = 'lawyer_narration',
    context?: AgentContext
  ): Promise<TestimonialScript> {
    const prompt = `
${TESTIMONIAL_SCRIPT_PROMPT}

TIPO DE CASO: ${caseType}
ÁREA JURÍDICA: ${legalArea}
ABORDAGEM: ${approach}

IMPORTANTE: Não violar sigilo profissional. Use casos genéricos ou hipotéticos.

Crie um roteiro de depoimento no formato JSON especificado.
`

    const response = await this.processStructured<TestimonialScript>(prompt, context)
    return response
  }

  // ===========================================================================
  // OPTIMIZATION
  // ===========================================================================

  /**
   * Optimize video for SEO
   */
  async optimizeVideoSEO(
    title: string,
    description: string,
    targetKeywords: string[],
    context?: AgentContext
  ): Promise<VideoSEO> {
    const prompt = `
${VIDEO_SEO_PROMPT}

TÍTULO ATUAL: ${title}
DESCRIÇÃO ATUAL: ${description}
KEYWORDS ALVO: ${targetKeywords.join(', ')}

Otimize os metadados do vídeo no formato JSON especificado.
`

    const response = await this.processStructured<VideoSEO>(prompt, context)
    return response
  }

  /**
   * Suggest content repurposing
   */
  async suggestRepurposing(
    videoTitle: string,
    videoDuration: number,
    platform: string,
    context?: AgentContext
  ): Promise<{
    originalVideo: { title: string; duration: number; platform: string }
    repurposeOptions: Array<{
      format: string
      title: string
      description: string
      adaptations: string[]
      estimatedTime: string
      platform: string
    }>
    clipSuggestions: Array<{
      timestamp: { start: string; end: string }
      clipTitle: string
      platform: string
      hook: string
    }>
    quotesForSocial: Array<{
      quote: string
      visualStyle: string
      platform: string
    }>
  }> {
    const prompt = `
${CONTENT_REPURPOSE_PROMPT}

VÍDEO ORIGINAL:
- Título: ${videoTitle}
- Duração: ${videoDuration} minutos
- Plataforma: ${platform}

Sugira formas de reaproveitar o conteúdo no formato JSON especificado.
`

    const response = await this.processStructured<{
      originalVideo: { title: string; duration: number; platform: string }
      repurposeOptions: Array<{
        format: string
        title: string
        description: string
        adaptations: string[]
        estimatedTime: string
        platform: string
      }>
      clipSuggestions: Array<{
        timestamp: { start: string; end: string }
        clipTitle: string
        platform: string
        hook: string
      }>
      quotesForSocial: Array<{
        quote: string
        visualStyle: string
        platform: string
      }>
    }>(prompt, context)

    return response
  }

  // ===========================================================================
  // PLANNING
  // ===========================================================================

  /**
   * Plan a video series
   */
  async planVideoSeries(
    topic: string,
    legalArea: string,
    numberOfEpisodes: number = 5,
    context?: AgentContext
  ): Promise<VideoSeries> {
    const prompt = `
${VIDEO_SERIES_PROMPT}

TEMA DA SÉRIE: ${topic}
ÁREA JURÍDICA: ${legalArea}
NÚMERO DE EPISÓDIOS: ${numberOfEpisodes}

Crie um plano de série de vídeos no formato JSON especificado.
`

    const response = await this.processStructured<VideoSeries>(prompt, context)
    return response
  }

  /**
   * Create monthly video content calendar
   */
  async createVideoCalendar(
    month: string,
    year: number,
    legalAreas: string[],
    context?: AgentContext
  ): Promise<VideoCalendar> {
    const prompt = `
${CONTENT_CALENDAR_VIDEO_PROMPT}

MÊS: ${month}
ANO: ${year}
ÁREAS JURÍDICAS: ${legalAreas.join(', ')}

Crie um calendário de conteúdo de vídeo no formato JSON especificado.
`

    const response = await this.processStructured<VideoCalendar>(prompt, context)
    return response
  }

  // ===========================================================================
  // HELPER METHODS
  // ===========================================================================

  /**
   * Get optimal duration for platform
   */
  getOptimalDuration(platform: string) {
    return getOptimalDuration(platform)
  }

  /**
   * Get video specifications for platform
   */
  getVideoSpecs(platform: string) {
    return getVideoSpecs(platform)
  }

  /**
   * Get hook templates
   */
  getHookTemplates(): string[] {
    return getHookTemplates()
  }

  /**
   * Get CTA templates
   */
  getCTATemplates(): string[] {
    return getCTATemplates()
  }
}

// =============================================================================
// FACTORY FUNCTION
// =============================================================================

/**
 * Create a new Video Agent instance
 */
export function createVideoAgent(config?: Partial<EnhancedAgentConfig>): VideoAgent {
  return new VideoAgent(config)
}

// Singleton instance
let videoAgentInstance: VideoAgent | null = null

/**
 * Get singleton Video Agent instance
 */
export function getVideoAgent(): VideoAgent {
  if (!videoAgentInstance) {
    videoAgentInstance = createVideoAgent()
  }
  return videoAgentInstance
}

// =============================================================================
// EXPORTS
// =============================================================================

export { getOptimalDuration, getVideoSpecs, getHookTemplates, getCTATemplates }
