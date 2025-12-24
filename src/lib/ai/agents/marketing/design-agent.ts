/**
 * Design Agent
 * Responsible for visual content creation and brand design specifications
 */

import { EnhancedBaseAgent } from '../core/enhanced-base-agent'
import type { AgentRole, AgentContext, EnhancedAgentConfig } from '../core/agent-types'
import {
  DESIGN_AGENT_SYSTEM_PROMPT,
  INSTAGRAM_POST_DESIGN_PROMPT,
  LINKEDIN_POST_DESIGN_PROMPT,
  STORIES_DESIGN_PROMPT,
  THUMBNAIL_DESIGN_PROMPT,
  EBOOK_COVER_PROMPT,
  INFOGRAPHIC_DESIGN_PROMPT,
  BRAND_TEMPLATE_PROMPT,
  PRESENTATION_TEMPLATE_PROMPT,
  getBrandColors,
  getFontPairings,
  getPlatformDimensions,
  getLegalIcons,
  getImageStyleGuide,
} from '../../prompts/marketing/design-prompts'

// =============================================================================
// TYPES
// =============================================================================

export type DesignFormat = 'square' | 'portrait' | 'landscape' | 'vertical' | 'horizontal'
export type LayoutType = 'text_heavy' | 'image_focus' | 'split' | 'quote' | 'infographic'
export type ElementType = 'text' | 'image' | 'icon' | 'shape' | 'logo' | 'chart'

export interface DesignElement {
  type: ElementType
  position: { x: string; y: string }
  size: { width: string; height: string }
  content: string
  style: {
    font?: string
    fontSize?: string
    fontWeight?: string
    color?: string
    backgroundColor?: string
    opacity?: number
    effects?: string[]
  }
}

export interface InstagramPostDesign {
  concept: string
  format: 'square' | 'portrait' | 'carousel'
  dimensions: { width: number; height: number }
  layout: {
    type: LayoutType
    grid: string
    focalPoint: string
  }
  elements: DesignElement[]
  colorScheme: {
    primary: string
    secondary: string
    accent: string
    background: string
  }
  typography: {
    headline: { font: string; size: string; weight: string }
    subheadline: { font: string; size: string; weight: string }
    body: { font: string; size: string; weight: string }
  }
  imageGuidelines: {
    style: string
    mood: string
    subjects: string[]
    avoidElements: string[]
  }
  carouselSlides: Array<{
    slideNumber: number
    purpose: string
    mainElement: string
    text: string
  }> | null
  dallePrompt: string
  canvaTemplate: string
}

export interface LinkedInPostDesign {
  concept: string
  format: 'square' | 'landscape' | 'document'
  dimensions: { width: number; height: number }
  professionalTone: {
    level: 'formal' | 'professional_casual' | 'thought_leadership'
    visualCues: string[]
  }
  layout: {
    type: 'data_driven' | 'quote' | 'insight' | 'case_study' | 'tips'
    structure: string
  }
  elements: Array<{
    type: string
    position: string
    content: string
    style: Record<string, unknown>
  }>
  brandElements: {
    logoPlacement: string
    brandColors: string[]
    professionalImagery: string[]
  }
  documentSlides: Array<{
    slideNumber: number
    title: string
    content: string
    visualElement: string
  }> | null
  dallePrompt: string
}

export interface StoriesDesign {
  concept: string
  dimensions: { width: number; height: number }
  storiesSequence: Array<{
    storyNumber: number
    type: 'intro' | 'content' | 'engagement' | 'cta'
    layout: {
      backgroundType: 'solid' | 'gradient' | 'image' | 'video'
      backgroundValue: string
      textPlacement: 'top' | 'center' | 'bottom'
    }
    elements: Array<{
      type: 'text' | 'sticker' | 'poll' | 'quiz' | 'countdown' | 'link'
      content: string
      position: string
      style: Record<string, unknown>
    }>
    animation: string
    transitionToNext: string
  }>
  brandConsistency: {
    fontUsed: string
    colorsUsed: string[]
    logoPresence: boolean
  }
  interactiveElements: Array<{
    type: string
    purpose: string
    placement: string
  }>
}

export interface ThumbnailDesign {
  concept: string
  dimensions: { width: number; height: number }
  layout: {
    type: 'face_focus' | 'text_focus' | 'split' | 'dramatic'
    focalPoint: string
    textPlacement: string
  }
  text: {
    headline: string
    font: string
    size: string
    color: string
    outline: string
    shadow: string
  }
  imageElements: {
    mainSubject: string
    expression: string
    background: string
    props: string[]
  }
  colorStrategy: {
    dominant: string
    accent: string
    contrast: 'high' | 'medium'
  }
  emotionalTrigger: string
  clickBaitLevel: 'subtle' | 'moderate' | 'strong'
  abTestVariants: Array<{
    variant: 'A' | 'B' | 'C'
    change: string
    hypothesis: string
  }>
  dallePrompt: string
}

export interface EbookCoverDesign {
  title: string
  subtitle: string
  dimensions: { width: number; height: number }
  layout: {
    style: 'modern' | 'classic' | 'minimalist' | 'bold'
    titlePlacement: string
    imageArea: string
  }
  coverElements: {
    title: {
      text: string
      font: string
      size: string
      color: string
      treatment: string
    }
    subtitle: {
      text: string
      font: string
      size: string
      color: string
    }
    authorArea: {
      name: string
      credentials: string
      placement: string
    }
    visualElement: {
      type: 'illustration' | 'photo' | 'abstract' | 'icon'
      description: string
      placement: string
    }
    branding: {
      logo: boolean
      logoPlacement: string
      tagline: string
    }
  }
  colorPalette: {
    background: string
    primary: string
    secondary: string
    accent: string
  }
  mood: string
  targetAudience: string
  dallePrompt: string
  mockupStyles: string[]
}

export interface InfographicDesign {
  title: string
  topic: string
  format: 'vertical' | 'horizontal' | 'square'
  dimensions: { width: number; height: number }
  structure: {
    sections: Array<{
      sectionNumber: number
      title: string
      type: 'header' | 'stats' | 'process' | 'comparison' | 'timeline' | 'tips' | 'cta'
      content: {
        mainPoint: string
        supportingData: string[]
        visualRepresentation: string
      }
      height: string
    }>
  }
  visualElements: {
    icons: Array<{
      description: string
      style: 'outline' | 'filled' | 'duotone'
      placement: string
    }>
    charts: Array<{
      type: 'pie' | 'bar' | 'line' | 'donut' | 'comparison'
      data: Record<string, unknown>
      placement: string
    }>
    illustrations: Array<{
      description: string
      style: string
      placement: string
    }>
  }
  dataVisualization: Array<{
    dataPoint: string
    value: string
    visualStyle: 'number_highlight' | 'icon_repeat' | 'progress_bar' | 'comparison'
  }>
  flowDiagram: {
    type: 'linear' | 'branching' | 'circular' | null
    steps: string[]
  } | null
  colorCoding: {
    purpose: string
    scheme: Array<{
      meaning: string
      color: string
    }>
  }
  typography: {
    hierarchy: Array<{
      level: 'h1' | 'h2' | 'h3' | 'body' | 'caption'
      font: string
      size: string
      weight: string
    }>
  }
  footer: {
    source: string
    branding: string
    cta: string
  }
  dallePrompt: string
}

// =============================================================================
// DESIGN AGENT CLASS
// =============================================================================

export class DesignAgent extends EnhancedBaseAgent {
  constructor(config?: Partial<EnhancedAgentConfig>) {
    super(DESIGN_AGENT_SYSTEM_PROMPT, 'design', {
      timeout: 90000,
      ...config,
    })
  }

  get name(): string {
    return 'Design Agent'
  }

  get role(): AgentRole {
    return 'design'
  }

  isRelevant(input: string): boolean {
    const keywords = [
      'design', 'visual', 'imagem', 'image', 'thumbnail',
      'infográfico', 'infographic', 'template', 'brand',
      'logo', 'capa', 'cover', 'post', 'carousel',
      'cores', 'colors', 'fonte', 'font', 'layout',
    ]
    const lowerInput = input.toLowerCase()
    return keywords.some(keyword => lowerInput.includes(keyword))
  }

  // ===========================================================================
  // SOCIAL MEDIA DESIGN
  // ===========================================================================

  /**
   * Design Instagram post
   */
  async designInstagramPost(
    topic: string,
    legalArea: string,
    format: 'square' | 'portrait' | 'carousel' = 'square',
    context?: AgentContext
  ): Promise<InstagramPostDesign> {
    const dimensions = getPlatformDimensions(format === 'portrait' ? 'instagram-portrait' : 'instagram-post')
    const brandColors = getBrandColors()

    const prompt = `
${INSTAGRAM_POST_DESIGN_PROMPT}

TEMA: ${topic}
ÁREA JURÍDICA: ${legalArea}
FORMATO: ${format}
DIMENSÕES: ${dimensions.width}x${dimensions.height}

CORES DA MARCA:
- Primária: ${brandColors.primary}
- Secundária: ${brandColors.secondary}
- Accent: ${brandColors.accent}

Crie especificações de design no formato JSON especificado.
`

    const response = await this.processStructured<InstagramPostDesign>(prompt, context)
    return response
  }

  /**
   * Design LinkedIn post
   */
  async designLinkedInPost(
    topic: string,
    legalArea: string,
    format: 'square' | 'landscape' | 'document' = 'landscape',
    context?: AgentContext
  ): Promise<LinkedInPostDesign> {
    const dimensions = getPlatformDimensions(format === 'square' ? 'linkedin-square' : 'linkedin-post')
    const brandColors = getBrandColors()

    const prompt = `
${LINKEDIN_POST_DESIGN_PROMPT}

TEMA: ${topic}
ÁREA JURÍDICA: ${legalArea}
FORMATO: ${format}
DIMENSÕES: ${dimensions.width}x${dimensions.height}

CORES DA MARCA:
- Primária: ${brandColors.primary}
- Secundária: ${brandColors.secondary}
- Accent: ${brandColors.accent}

Crie especificações de design profissional no formato JSON especificado.
`

    const response = await this.processStructured<LinkedInPostDesign>(prompt, context)
    return response
  }

  /**
   * Design Stories sequence
   */
  async designStories(
    topic: string,
    numberOfStories: number = 5,
    context?: AgentContext
  ): Promise<StoriesDesign> {
    const dimensions = getPlatformDimensions('instagram-story')
    const brandColors = getBrandColors()

    const prompt = `
${STORIES_DESIGN_PROMPT}

TEMA: ${topic}
NÚMERO DE STORIES: ${numberOfStories}
DIMENSÕES: ${dimensions.width}x${dimensions.height}

CORES DA MARCA:
- Primária: ${brandColors.primary}
- Secundária: ${brandColors.secondary}

Crie especificações de design para Stories no formato JSON especificado.
`

    const response = await this.processStructured<StoriesDesign>(prompt, context)
    return response
  }

  // ===========================================================================
  // THUMBNAIL & COVER DESIGN
  // ===========================================================================

  /**
   * Design video thumbnail
   */
  async designThumbnail(
    videoTitle: string,
    videoTopic: string,
    style: 'face_focus' | 'text_focus' | 'split' | 'dramatic' = 'text_focus',
    context?: AgentContext
  ): Promise<ThumbnailDesign> {
    const dimensions = getPlatformDimensions('youtube-thumbnail')
    const brandColors = getBrandColors()

    const prompt = `
${THUMBNAIL_DESIGN_PROMPT}

TÍTULO DO VÍDEO: ${videoTitle}
TEMA: ${videoTopic}
ESTILO: ${style}
DIMENSÕES: ${dimensions.width}x${dimensions.height}

CORES DA MARCA:
- Primária: ${brandColors.primary}
- Secundária: ${brandColors.secondary}

Crie especificações de thumbnail no formato JSON especificado.
`

    const response = await this.processStructured<ThumbnailDesign>(prompt, context)
    return response
  }

  /**
   * Design eBook/Lead Magnet cover
   */
  async designEbookCover(
    title: string,
    subtitle: string,
    legalArea: string,
    style: 'modern' | 'classic' | 'minimalist' | 'bold' = 'modern',
    context?: AgentContext
  ): Promise<EbookCoverDesign> {
    const dimensions = getPlatformDimensions('ebook-cover')
    const brandColors = getBrandColors()

    const prompt = `
${EBOOK_COVER_PROMPT}

TÍTULO: ${title}
SUBTÍTULO: ${subtitle}
ÁREA JURÍDICA: ${legalArea}
ESTILO: ${style}
DIMENSÕES: ${dimensions.width}x${dimensions.height}

CORES DA MARCA:
- Primária: ${brandColors.primary}
- Secundária: ${brandColors.secondary}

Crie especificações de capa de eBook no formato JSON especificado.
`

    const response = await this.processStructured<EbookCoverDesign>(prompt, context)
    return response
  }

  // ===========================================================================
  // INFOGRAPHIC DESIGN
  // ===========================================================================

  /**
   * Design infographic
   */
  async designInfographic(
    topic: string,
    dataPoints: string[],
    legalArea: string,
    format: 'vertical' | 'horizontal' | 'square' = 'vertical',
    context?: AgentContext
  ): Promise<InfographicDesign> {
    const dimensions = format === 'vertical'
      ? { width: 800, height: 2000 }
      : format === 'horizontal'
        ? { width: 2000, height: 800 }
        : { width: 1200, height: 1200 }

    const brandColors = getBrandColors()
    const legalIcons = getLegalIcons()

    const prompt = `
${INFOGRAPHIC_DESIGN_PROMPT}

TEMA: ${topic}
ÁREA JURÍDICA: ${legalArea}
FORMATO: ${format}
DIMENSÕES: ${dimensions.width}x${dimensions.height}

DADOS A INCLUIR:
${dataPoints.map((d, i) => `${i + 1}. ${d}`).join('\n')}

CORES DA MARCA:
- Primária: ${brandColors.primary}
- Secundária: ${brandColors.secondary}

ÍCONES LEGAIS DISPONÍVEIS:
${legalIcons.join(', ')}

Crie especificações de infográfico no formato JSON especificado.
`

    const response = await this.processStructured<InfographicDesign>(prompt, context)
    return response
  }

  // ===========================================================================
  // BRAND TEMPLATES
  // ===========================================================================

  /**
   * Create brand template specifications
   */
  async createBrandTemplate(
    templateType: string,
    purpose: string,
    platform: string,
    context?: AgentContext
  ): Promise<{
    templateName: string
    purpose: string
    dimensions: { width: number; height: number }
    editableAreas: Array<{
      name: string
      type: 'text' | 'image' | 'color'
      position: { x: string; y: string }
      constraints: Record<string, unknown>
    }>
    fixedElements: Array<{
      type: string
      position: string
      value: string
    }>
    styleGuide: Record<string, unknown>
    variations: Array<{ name: string; changes: string[] }>
  }> {
    const dimensions = getPlatformDimensions(platform)
    const brandColors = getBrandColors()
    const fonts = getFontPairings()

    const prompt = `
${BRAND_TEMPLATE_PROMPT}

TIPO: ${templateType}
PROPÓSITO: ${purpose}
PLATAFORMA: ${platform}
DIMENSÕES: ${dimensions.width}x${dimensions.height}

CORES DA MARCA:
- Primária: ${brandColors.primary}
- Secundária: ${brandColors.secondary}

FONTES RECOMENDADAS:
${fonts.map(f => `- ${f.headline} + ${f.body} (${f.style})`).join('\n')}

Crie especificações de template no formato JSON especificado.
`

    const response = await this.processStructured<{
      templateName: string
      purpose: string
      dimensions: { width: number; height: number }
      editableAreas: Array<{
        name: string
        type: 'text' | 'image' | 'color'
        position: { x: string; y: string }
        constraints: Record<string, unknown>
      }>
      fixedElements: Array<{
        type: string
        position: string
        value: string
      }>
      styleGuide: Record<string, unknown>
      variations: Array<{ name: string; changes: string[] }>
    }>(prompt, context)

    return response
  }

  /**
   * Create presentation template specifications
   */
  async createPresentationTemplate(
    purpose: string,
    slideCount: number = 10,
    context?: AgentContext
  ): Promise<{
    templateName: string
    purpose: string
    slideCount: number
    dimensions: { width: number; height: number }
    masterSlides: Array<{
      name: string
      type: string
      layout: Record<string, unknown>
      placeholders: Array<{
        name: string
        type: string
        position: string
        size: string
      }>
    }>
    brandElements: Record<string, unknown>
  }> {
    const dimensions = getPlatformDimensions('presentation')
    const brandColors = getBrandColors()

    const prompt = `
${PRESENTATION_TEMPLATE_PROMPT}

PROPÓSITO: ${purpose}
NÚMERO DE SLIDES: ${slideCount}
DIMENSÕES: ${dimensions.width}x${dimensions.height}

CORES DA MARCA:
- Primária: ${brandColors.primary}
- Secundária: ${brandColors.secondary}

Crie especificações de template de apresentação no formato JSON especificado.
`

    const response = await this.processStructured<{
      templateName: string
      purpose: string
      slideCount: number
      dimensions: { width: number; height: number }
      masterSlides: Array<{
        name: string
        type: string
        layout: Record<string, unknown>
        placeholders: Array<{
          name: string
          type: string
          position: string
          size: string
        }>
      }>
      brandElements: Record<string, unknown>
    }>(prompt, context)

    return response
  }

  // ===========================================================================
  // HELPER METHODS
  // ===========================================================================

  /**
   * Get brand colors
   */
  getBrandColors() {
    return getBrandColors()
  }

  /**
   * Get font pairings
   */
  getFontPairings() {
    return getFontPairings()
  }

  /**
   * Get dimensions for platform
   */
  getDimensions(platform: string) {
    return getPlatformDimensions(platform)
  }

  /**
   * Get legal icons
   */
  getLegalIcons(): string[] {
    return getLegalIcons()
  }

  /**
   * Get image style guide
   */
  getImageStyleGuide() {
    return getImageStyleGuide()
  }
}

// =============================================================================
// FACTORY FUNCTION
// =============================================================================

/**
 * Create a new Design Agent instance
 */
export function createDesignAgent(config?: Partial<EnhancedAgentConfig>): DesignAgent {
  return new DesignAgent(config)
}

// Singleton instance
let designAgentInstance: DesignAgent | null = null

/**
 * Get singleton Design Agent instance
 */
export function getDesignAgent(): DesignAgent {
  if (!designAgentInstance) {
    designAgentInstance = createDesignAgent()
  }
  return designAgentInstance
}

// =============================================================================
// EXPORTS
// =============================================================================

export { getBrandColors, getFontPairings, getPlatformDimensions, getLegalIcons, getImageStyleGuide }
