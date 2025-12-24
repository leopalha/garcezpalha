/**
 * Design Agent Prompts
 * Prompts for visual content creation and brand design
 */

// =============================================================================
// SYSTEM PROMPT
// =============================================================================

export const DESIGN_AGENT_SYSTEM_PROMPT = `Você é o Agente de Design do escritório Garcez Palha Advogados, especializado em:
- Criação de assets visuais para redes sociais
- Design de materiais de marketing jurídico
- Identidade visual consistente
- Thumbnails e capas para vídeos
- Infográficos jurídicos

CONTEXTO DO ESCRITÓRIO:
- Áreas: Imobiliário, Família, Empresarial, Trabalhista, Consumidor
- Público: Pessoas físicas e empresas em Lisboa/Portugal
- Identidade: Profissional, confiável, moderno

PALETA DE CORES GARCEZ PALHA:
- Primária: #1E3A5F (Azul escuro - confiança)
- Secundária: #D4AF37 (Dourado - excelência)
- Accent: #4A90A4 (Azul claro - acessibilidade)
- Neutros: #FFFFFF, #F5F5F5, #333333

TIPOGRAFIA:
- Headlines: Playfair Display (serifada, elegante)
- Body: Inter ou Open Sans (sans-serif, legível)

ESTILO VISUAL:
- Clean e minimalista
- Profissional mas não intimidador
- Uso de ícones legais (balança, martelo, documentos)
- Fotos reais quando possível (não stock genérico)

COMPLIANCE OAB:
- Evitar promessas de resultados
- Tom informativo
- Identificação clara do escritório

Responda sempre em português de Portugal.
Forneça especificações técnicas precisas.`

// =============================================================================
// SOCIAL MEDIA DESIGN PROMPTS
// =============================================================================

export const INSTAGRAM_POST_DESIGN_PROMPT = `Crie especificações de design para post do Instagram.

FORMATO JSON:
{
  "concept": "string",
  "format": "square" | "portrait" | "carousel",
  "dimensions": { "width": number, "height": number },
  "layout": {
    "type": "text_heavy" | "image_focus" | "split" | "quote" | "infographic",
    "grid": "string",
    "focalPoint": "string"
  },
  "elements": [{
    "type": "text" | "image" | "icon" | "shape" | "logo",
    "position": { "x": "string", "y": "string" },
    "size": { "width": "string", "height": "string" },
    "content": "string",
    "style": {
      "font": "string",
      "fontSize": "string",
      "fontWeight": "string",
      "color": "string",
      "backgroundColor": "string",
      "opacity": number,
      "effects": ["string"]
    }
  }],
  "colorScheme": {
    "primary": "string",
    "secondary": "string",
    "accent": "string",
    "background": "string"
  },
  "typography": {
    "headline": { "font": "string", "size": "string", "weight": "string" },
    "subheadline": { "font": "string", "size": "string", "weight": "string" },
    "body": { "font": "string", "size": "string", "weight": "string" }
  },
  "imageGuidelines": {
    "style": "string",
    "mood": "string",
    "subjects": ["string"],
    "avoidElements": ["string"]
  },
  "carouselSlides": [{
    "slideNumber": number,
    "purpose": "string",
    "mainElement": "string",
    "text": "string"
  }] | null,
  "dallePrompt": "string",
  "canvaTemplate": "string"
}`

export const LINKEDIN_POST_DESIGN_PROMPT = `Crie especificações de design para post do LinkedIn.

FORMATO JSON:
{
  "concept": "string",
  "format": "square" | "landscape" | "document",
  "dimensions": { "width": number, "height": number },
  "professionalTone": {
    "level": "formal" | "professional_casual" | "thought_leadership",
    "visualCues": ["string"]
  },
  "layout": {
    "type": "data_driven" | "quote" | "insight" | "case_study" | "tips",
    "structure": "string"
  },
  "elements": [{
    "type": "string",
    "position": "string",
    "content": "string",
    "style": object
  }],
  "brandElements": {
    "logoPlacement": "string",
    "brandColors": ["string"],
    "professionalImagery": ["string"]
  },
  "documentSlides": [{
    "slideNumber": number,
    "title": "string",
    "content": "string",
    "visualElement": "string"
  }] | null,
  "dallePrompt": "string"
}`

export const STORIES_DESIGN_PROMPT = `Crie especificações de design para Stories.

FORMATO JSON:
{
  "concept": "string",
  "dimensions": { "width": 1080, "height": 1920 },
  "storiesSequence": [{
    "storyNumber": number,
    "type": "intro" | "content" | "engagement" | "cta",
    "layout": {
      "backgroundType": "solid" | "gradient" | "image" | "video",
      "backgroundValue": "string",
      "textPlacement": "top" | "center" | "bottom"
    },
    "elements": [{
      "type": "text" | "sticker" | "poll" | "quiz" | "countdown" | "link",
      "content": "string",
      "position": "string",
      "style": object
    }],
    "animation": "string",
    "transitionToNext": "string"
  }],
  "brandConsistency": {
    "fontUsed": "string",
    "colorsUsed": ["string"],
    "logoPresence": boolean
  },
  "interactiveElements": [{
    "type": "string",
    "purpose": "string",
    "placement": "string"
  }]
}`

// =============================================================================
// THUMBNAIL & COVER PROMPTS
// =============================================================================

export const THUMBNAIL_DESIGN_PROMPT = `Crie especificações de design para thumbnail de vídeo.

REQUISITOS:
- Alta visibilidade em tamanhos pequenos
- Texto legível (max 5 palavras)
- Expressão facial se houver pessoa
- Contraste forte

FORMATO JSON:
{
  "concept": "string",
  "dimensions": { "width": 1280, "height": 720 },
  "layout": {
    "type": "face_focus" | "text_focus" | "split" | "dramatic",
    "focalPoint": "string",
    "textPlacement": "string"
  },
  "text": {
    "headline": "string (max 5 palavras)",
    "font": "string",
    "size": "string",
    "color": "string",
    "outline": "string",
    "shadow": "string"
  },
  "imageElements": {
    "mainSubject": "string",
    "expression": "string",
    "background": "string",
    "props": ["string"]
  },
  "colorStrategy": {
    "dominant": "string",
    "accent": "string",
    "contrast": "high" | "medium"
  },
  "emotionalTrigger": "string",
  "clickBaitLevel": "subtle" | "moderate" | "strong",
  "abTestVariants": [{
    "variant": "A" | "B" | "C",
    "change": "string",
    "hypothesis": "string"
  }],
  "dallePrompt": "string"
}`

export const EBOOK_COVER_PROMPT = `Crie especificações de design para capa de eBook/Lead Magnet.

FORMATO JSON:
{
  "title": "string",
  "subtitle": "string",
  "dimensions": { "width": 1600, "height": 2400 },
  "layout": {
    "style": "modern" | "classic" | "minimalist" | "bold",
    "titlePlacement": "string",
    "imageArea": "string"
  },
  "coverElements": {
    "title": {
      "text": "string",
      "font": "string",
      "size": "string",
      "color": "string",
      "treatment": "string"
    },
    "subtitle": {
      "text": "string",
      "font": "string",
      "size": "string",
      "color": "string"
    },
    "authorArea": {
      "name": "string",
      "credentials": "string",
      "placement": "string"
    },
    "visualElement": {
      "type": "illustration" | "photo" | "abstract" | "icon",
      "description": "string",
      "placement": "string"
    },
    "branding": {
      "logo": boolean,
      "logoPlacement": "string",
      "tagline": "string"
    }
  },
  "colorPalette": {
    "background": "string",
    "primary": "string",
    "secondary": "string",
    "accent": "string"
  },
  "mood": "string",
  "targetAudience": "string",
  "dallePrompt": "string",
  "mockupStyles": ["string"]
}`

// =============================================================================
// INFOGRAPHIC PROMPTS
// =============================================================================

export const INFOGRAPHIC_DESIGN_PROMPT = `Crie especificações de design para infográfico jurídico.

FORMATO JSON:
{
  "title": "string",
  "topic": "string",
  "format": "vertical" | "horizontal" | "square",
  "dimensions": { "width": number, "height": number },
  "structure": {
    "sections": [{
      "sectionNumber": number,
      "title": "string",
      "type": "header" | "stats" | "process" | "comparison" | "timeline" | "tips" | "cta",
      "content": {
        "mainPoint": "string",
        "supportingData": ["string"],
        "visualRepresentation": "string"
      },
      "height": "string"
    }]
  },
  "visualElements": {
    "icons": [{
      "description": "string",
      "style": "outline" | "filled" | "duotone",
      "placement": "string"
    }],
    "charts": [{
      "type": "pie" | "bar" | "line" | "donut" | "comparison",
      "data": object,
      "placement": "string"
    }],
    "illustrations": [{
      "description": "string",
      "style": "string",
      "placement": "string"
    }]
  },
  "dataVisualization": [{
    "dataPoint": "string",
    "value": "string",
    "visualStyle": "number_highlight" | "icon_repeat" | "progress_bar" | "comparison"
  }],
  "flowDiagram": {
    "type": "linear" | "branching" | "circular" | null,
    "steps": ["string"]
  },
  "colorCoding": {
    "purpose": "string",
    "scheme": [{
      "meaning": "string",
      "color": "string"
    }]
  },
  "typography": {
    "hierarchy": [{
      "level": "h1" | "h2" | "h3" | "body" | "caption",
      "font": "string",
      "size": "string",
      "weight": "string"
    }]
  },
  "footer": {
    "source": "string",
    "branding": "string",
    "cta": "string"
  },
  "dallePrompt": "string"
}`

// =============================================================================
// BRAND ASSETS PROMPTS
// =============================================================================

export const BRAND_TEMPLATE_PROMPT = `Crie especificações para template de marca reutilizável.

FORMATO JSON:
{
  "templateName": "string",
  "purpose": "string",
  "dimensions": { "width": number, "height": number },
  "editableAreas": [{
    "name": "string",
    "type": "text" | "image" | "color",
    "position": { "x": "string", "y": "string" },
    "size": { "width": "string", "height": "string" },
    "constraints": {
      "maxCharacters": number,
      "fontOptions": ["string"],
      "colorOptions": ["string"]
    },
    "defaultValue": "string"
  }],
  "fixedElements": [{
    "type": "logo" | "pattern" | "shape" | "text",
    "position": "string",
    "value": "string"
  }],
  "styleGuide": {
    "colorPalette": {
      "primary": "string",
      "secondary": "string",
      "accent": "string",
      "neutral": "string"
    },
    "typography": {
      "headlineFont": "string",
      "bodyFont": "string"
    },
    "spacing": {
      "margin": "string",
      "padding": "string"
    }
  },
  "variations": [{
    "name": "string",
    "changes": ["string"]
  }],
  "exportFormats": ["png", "jpg", "pdf", "svg"],
  "canvaLink": "string",
  "figmaLink": "string"
}`

export const PRESENTATION_TEMPLATE_PROMPT = `Crie especificações para template de apresentação.

FORMATO JSON:
{
  "templateName": "string",
  "purpose": "string",
  "slideCount": number,
  "dimensions": { "width": 1920, "height": 1080 },
  "masterSlides": [{
    "name": "string",
    "type": "title" | "section" | "content" | "two_column" | "image" | "data" | "quote" | "closing",
    "layout": {
      "grid": "string",
      "contentAreas": ["string"]
    },
    "placeholders": [{
      "name": "string",
      "type": "text" | "image" | "chart" | "icon",
      "position": "string",
      "size": "string"
    }],
    "fixedElements": ["string"]
  }],
  "brandElements": {
    "logoPlacement": "string",
    "colorAccents": ["string"],
    "footerContent": "string"
  },
  "transitionStyle": "string",
  "animationGuidelines": ["string"]
}`

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Get brand colors
 */
export function getBrandColors(): {
  primary: string
  secondary: string
  accent: string
  neutrals: string[]
} {
  return {
    primary: '#1E3A5F',
    secondary: '#D4AF37',
    accent: '#4A90A4',
    neutrals: ['#FFFFFF', '#F5F5F5', '#E0E0E0', '#333333'],
  }
}

/**
 * Get font pairings
 */
export function getFontPairings(): Array<{
  headline: string
  body: string
  style: string
}> {
  return [
    { headline: 'Playfair Display', body: 'Inter', style: 'elegant' },
    { headline: 'Montserrat', body: 'Open Sans', style: 'modern' },
    { headline: 'Lora', body: 'Roboto', style: 'classic' },
    { headline: 'Poppins', body: 'Nunito', style: 'friendly' },
  ]
}

/**
 * Get dimensions for different platforms
 */
export function getPlatformDimensions(platform: string): {
  width: number
  height: number
  aspectRatio: string
} {
  const dimensions: Record<string, { width: number; height: number; aspectRatio: string }> = {
    'instagram-post': { width: 1080, height: 1080, aspectRatio: '1:1' },
    'instagram-portrait': { width: 1080, height: 1350, aspectRatio: '4:5' },
    'instagram-story': { width: 1080, height: 1920, aspectRatio: '9:16' },
    'linkedin-post': { width: 1200, height: 627, aspectRatio: '1.91:1' },
    'linkedin-square': { width: 1200, height: 1200, aspectRatio: '1:1' },
    'facebook-post': { width: 1200, height: 630, aspectRatio: '1.91:1' },
    'youtube-thumbnail': { width: 1280, height: 720, aspectRatio: '16:9' },
    'twitter-post': { width: 1200, height: 675, aspectRatio: '16:9' },
    'pinterest': { width: 1000, height: 1500, aspectRatio: '2:3' },
    'ebook-cover': { width: 1600, height: 2400, aspectRatio: '2:3' },
    'presentation': { width: 1920, height: 1080, aspectRatio: '16:9' },
  }
  return dimensions[platform] || { width: 1080, height: 1080, aspectRatio: '1:1' }
}

/**
 * Get legal icons commonly used
 */
export function getLegalIcons(): string[] {
  return [
    'balança da justiça',
    'martelo de juiz',
    'livro de leis',
    'documento legal',
    'aperto de mãos',
    'escudo de proteção',
    'casa (imobiliário)',
    'família (direito família)',
    'briefcase (empresarial)',
    'pessoa com documento',
    'contrato assinado',
    'chave (propriedade)',
  ]
}

/**
 * Get image style guidelines
 */
export function getImageStyleGuide(): {
  preferred: string[]
  avoid: string[]
  mood: string[]
} {
  return {
    preferred: [
      'Fotos reais de profissionais',
      'Escritórios modernos',
      'Reuniões profissionais',
      'Lisboa e Portugal',
      'Documentos e tecnologia',
    ],
    avoid: [
      'Stock photos genéricos',
      'Clichês visuais (martelo closeup)',
      'Imagens de tribunais americanos',
      'Fotos muito posadas',
      'Imagens de baixa qualidade',
    ],
    mood: [
      'Confiança',
      'Profissionalismo',
      'Acessibilidade',
      'Modernidade',
      'Competência',
    ],
  }
}
