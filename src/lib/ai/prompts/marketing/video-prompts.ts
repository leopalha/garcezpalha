/**
 * Video Agent Prompts
 * Prompts for video content creation and optimization
 */

// =============================================================================
// SYSTEM PROMPT
// =============================================================================

export const VIDEO_AGENT_SYSTEM_PROMPT = `Você é o Agente de Vídeo do escritório Garcez Palha Advogados, especializado em:
- Criação de scripts para vídeos educativos jurídicos
- Roteiros para Reels, Shorts e TikTok
- Vídeos institucionais e depoimentos
- Webinars e conteúdo educacional longo

CONTEXTO DO ESCRITÓRIO:
- Áreas: Imobiliário, Família, Empresarial, Trabalhista, Consumidor
- Público: Pessoas físicas e empresas em Lisboa/Portugal
- Tom: Profissional mas acessível, educativo
- Objetivo: Educar e gerar leads qualificados

FORMATOS DE VÍDEO:
1. Reels/Shorts (15-60s): Dicas rápidas, mitos jurídicos, curiosidades
2. YouTube (5-15min): Tutoriais, explicações detalhadas
3. Webinars (30-60min): Temas aprofundados com Q&A
4. Stories (15s): Behind the scenes, atualizações rápidas
5. Depoimentos (1-3min): Casos de sucesso (sem violar sigilo)

ESTRUTURA IDEAL:
1. Hook nos primeiros 3 segundos
2. Problema/dor do espectador
3. Solução/informação jurídica
4. CTA claro (consulta, seguir, etc.)

COMPLIANCE OAB:
- Não prometer resultados
- Tom educativo, não comercial agressivo
- Identificar como advogado
- Não denegrir colegas

Responda sempre em português de Portugal.
Foque em conteúdo que gera valor e leads.`

// =============================================================================
// SCRIPT PROMPTS
// =============================================================================

export const REELS_SCRIPT_PROMPT = `Crie um script para Reels/Shorts sobre o tema jurídico especificado.

REQUISITOS:
- Duração: 30-60 segundos
- Hook forte nos primeiros 3 segundos
- Linguagem simples e acessível
- CTA no final

FORMATO JSON:
{
  "title": "string",
  "hook": "string (primeiros 3 segundos)",
  "duration": number (segundos),
  "script": {
    "intro": { "text": "string", "duration": number, "visualNotes": "string" },
    "body": [{ "text": "string", "duration": number, "visualNotes": "string" }],
    "cta": { "text": "string", "duration": number, "visualNotes": "string" }
  },
  "hashtags": ["string"],
  "captionText": "string",
  "thumbnailIdea": "string",
  "musicSuggestion": "string",
  "trendRelevance": "string"
}`

export const YOUTUBE_SCRIPT_PROMPT = `Crie um script completo para vídeo do YouTube sobre o tema jurídico.

ESTRUTURA:
1. Intro (hook + apresentação)
2. Corpo (problema, contexto, solução)
3. Exemplos práticos
4. Conclusão + CTA

FORMATO JSON:
{
  "title": "string",
  "description": "string (para YouTube)",
  "duration": number (minutos),
  "targetKeywords": ["string"],
  "script": {
    "intro": {
      "hook": "string",
      "channelIntro": "string",
      "topicIntro": "string",
      "duration": number
    },
    "chapters": [{
      "title": "string",
      "timestamp": "string",
      "content": "string",
      "duration": number,
      "bRoll": ["string"],
      "graphics": ["string"]
    }],
    "conclusion": {
      "summary": "string",
      "cta": "string",
      "endScreen": "string",
      "duration": number
    }
  },
  "thumbnailConcepts": [{
    "concept": "string",
    "text": "string",
    "emotion": "string"
  }],
  "tags": ["string"],
  "endScreenVideos": ["string"]
}`

export const WEBINAR_SCRIPT_PROMPT = `Crie estrutura e script para webinar jurídico.

FORMATO JSON:
{
  "title": "string",
  "subtitle": "string",
  "duration": number (minutos),
  "targetAudience": "string",
  "learningObjectives": ["string"],
  "structure": {
    "welcome": {
      "duration": number,
      "content": "string",
      "slides": number
    },
    "introduction": {
      "duration": number,
      "speakerBio": "string",
      "topicOverview": "string",
      "slides": number
    },
    "mainContent": [{
      "section": "string",
      "duration": number,
      "keyPoints": ["string"],
      "examples": ["string"],
      "slides": number
    }],
    "qAndA": {
      "duration": number,
      "anticipatedQuestions": [{
        "question": "string",
        "answer": "string"
      }]
    },
    "closing": {
      "duration": number,
      "summary": "string",
      "cta": "string",
      "nextSteps": ["string"]
    }
  },
  "slideDeck": {
    "totalSlides": number,
    "slideOutline": [{
      "slideNumber": number,
      "title": "string",
      "bulletPoints": ["string"],
      "visualSuggestion": "string"
    }]
  },
  "promotionalAssets": {
    "emailSubject": "string",
    "emailBody": "string",
    "socialPost": "string",
    "landingPageCopy": "string"
  }
}`

export const STORIES_SCRIPT_PROMPT = `Crie uma série de Stories sobre o tema jurídico.

FORMATO JSON:
{
  "topic": "string",
  "totalStories": number,
  "stories": [{
    "storyNumber": number,
    "type": "text" | "video" | "poll" | "quiz" | "countdown",
    "duration": number (segundos),
    "content": {
      "text": "string",
      "voiceOver": "string",
      "visualDescription": "string",
      "interactiveElement": object | null
    },
    "sticker": "string" | null,
    "music": "string" | null
  }],
  "callToAction": {
    "type": "swipeUp" | "dm" | "link" | "poll",
    "text": "string",
    "destination": "string"
  },
  "bestTimeToPost": "string"
}`

export const TESTIMONIAL_SCRIPT_PROMPT = `Crie roteiro para vídeo de depoimento/caso de sucesso.

IMPORTANTE: Não violar sigilo profissional - usar casos genéricos ou com autorização.

FORMATO JSON:
{
  "title": "string",
  "duration": number (segundos),
  "approach": "actor" | "real_client" | "animated" | "lawyer_narration",
  "script": {
    "opening": {
      "situation": "string",
      "emotion": "string",
      "duration": number
    },
    "problem": {
      "challenge": "string",
      "impact": "string",
      "duration": number
    },
    "solution": {
      "approach": "string",
      "process": "string",
      "duration": number
    },
    "result": {
      "outcome": "string",
      "benefit": "string",
      "duration": number
    },
    "recommendation": {
      "message": "string",
      "cta": "string",
      "duration": number
    }
  },
  "bRollSuggestions": ["string"],
  "musicMood": "string",
  "legalDisclaimer": "string"
}`

// =============================================================================
// OPTIMIZATION PROMPTS
// =============================================================================

export const VIDEO_SEO_PROMPT = `Otimize os metadados do vídeo para SEO no YouTube.

FORMATO JSON:
{
  "optimizedTitle": "string (max 60 chars)",
  "description": {
    "hook": "string (primeiras 2 linhas)",
    "fullDescription": "string",
    "timestamps": [{ "time": "string", "label": "string" }],
    "links": ["string"],
    "hashtags": ["string"]
  },
  "tags": ["string"] (max 500 chars total),
  "category": "string",
  "thumbnailSpecs": {
    "text": "string (max 5 palavras)",
    "emotion": "string",
    "colorScheme": "string",
    "elements": ["string"]
  },
  "endScreenStrategy": {
    "videoToPromote": "string",
    "playlistToPromote": "string",
    "subscribePosition": "string"
  },
  "cardsSuggestions": [{
    "timestamp": "string",
    "type": "video" | "playlist" | "link",
    "content": "string"
  }]
}`

export const CONTENT_REPURPOSE_PROMPT = `Sugira como reaproveitar o conteúdo de vídeo para outros formatos.

FORMATO JSON:
{
  "originalVideo": {
    "title": "string",
    "duration": number,
    "platform": "string"
  },
  "repurposeOptions": [{
    "format": "reels" | "shorts" | "tiktok" | "carousel" | "blog" | "podcast" | "newsletter",
    "title": "string",
    "description": "string",
    "adaptations": ["string"],
    "estimatedTime": "string",
    "platform": "string"
  }],
  "clipSuggestions": [{
    "timestamp": { "start": "string", "end": "string" },
    "clipTitle": "string",
    "platform": "string",
    "hook": "string"
  }],
  "quotesForSocial": [{
    "quote": "string",
    "visualStyle": "string",
    "platform": "string"
  }]
}`

// =============================================================================
// SERIES & PLANNING PROMPTS
// =============================================================================

export const VIDEO_SERIES_PROMPT = `Crie um plano para série de vídeos sobre o tema.

FORMATO JSON:
{
  "seriesTitle": "string",
  "seriesDescription": "string",
  "totalEpisodes": number,
  "releaseFrequency": "string",
  "targetAudience": "string",
  "episodes": [{
    "episodeNumber": number,
    "title": "string",
    "description": "string",
    "duration": number,
    "keyTopics": ["string"],
    "cta": "string",
    "thumbnailConcept": "string"
  }],
  "promotionStrategy": {
    "prelaunch": ["string"],
    "duringRelease": ["string"],
    "postSeries": ["string"]
  },
  "crossPromotion": {
    "otherPlatforms": ["string"],
    "emailMarketing": "string",
    "paidPromotion": "string"
  }
}`

export const CONTENT_CALENDAR_VIDEO_PROMPT = `Crie um calendário de conteúdo de vídeo para o mês.

FORMATO JSON:
{
  "month": "string",
  "year": number,
  "theme": "string",
  "goals": ["string"],
  "weeks": [{
    "weekNumber": number,
    "focus": "string",
    "content": [{
      "day": "string",
      "platform": "string",
      "type": "reels" | "youtube" | "stories" | "live",
      "topic": "string",
      "duration": number,
      "status": "idea" | "scripted" | "filmed" | "edited" | "scheduled"
    }]
  }],
  "monthlyMetrics": {
    "videoGoal": number,
    "viewsGoal": number,
    "engagementGoal": number,
    "leadsGoal": number
  },
  "resources": {
    "equipmentNeeded": ["string"],
    "locationsNeeded": ["string"],
    "guestsNeeded": ["string"]
  }
}`

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Get optimal video duration by platform
 */
export function getOptimalDuration(platform: string): { min: number; max: number; ideal: number } {
  const durations: Record<string, { min: number; max: number; ideal: number }> = {
    reels: { min: 15, max: 90, ideal: 30 },
    shorts: { min: 15, max: 60, ideal: 45 },
    tiktok: { min: 15, max: 180, ideal: 60 },
    youtube: { min: 300, max: 1200, ideal: 600 },
    stories: { min: 5, max: 15, ideal: 10 },
    webinar: { min: 1800, max: 5400, ideal: 3600 },
  }
  return durations[platform.toLowerCase()] || { min: 60, max: 600, ideal: 180 }
}

/**
 * Get video specs by platform
 */
export function getVideoSpecs(platform: string): {
  aspectRatio: string
  resolution: string
  format: string
} {
  const specs: Record<string, { aspectRatio: string; resolution: string; format: string }> = {
    reels: { aspectRatio: '9:16', resolution: '1080x1920', format: 'MP4' },
    shorts: { aspectRatio: '9:16', resolution: '1080x1920', format: 'MP4' },
    tiktok: { aspectRatio: '9:16', resolution: '1080x1920', format: 'MP4' },
    youtube: { aspectRatio: '16:9', resolution: '1920x1080', format: 'MP4' },
    stories: { aspectRatio: '9:16', resolution: '1080x1920', format: 'MP4' },
    linkedin: { aspectRatio: '1:1', resolution: '1080x1080', format: 'MP4' },
  }
  return specs[platform.toLowerCase()] || { aspectRatio: '16:9', resolution: '1920x1080', format: 'MP4' }
}

/**
 * Get hook templates by style
 */
export function getHookTemplates(): string[] {
  return [
    'Você sabia que {facto surpreendente}?',
    'O erro que 90% das pessoas cometem com {tema}...',
    'Pare de fazer isto se você {situação}!',
    '{Número} coisas que ninguém te conta sobre {tema}',
    'A verdade sobre {tema} que os advogados não revelam',
    'Se você {situação}, precisa ver isto até o final',
    'Isto pode salvar você de {problema}',
    'O segredo para {benefício} que poucos conhecem',
  ]
}

/**
 * Get CTA templates for videos
 */
export function getCTATemplates(): string[] {
  return [
    'Agende uma consulta gratuita pelo link na bio',
    'Salve este vídeo para consultar depois',
    'Marque alguém que precisa ver isto',
    'Siga para mais dicas jurídicas',
    'Comente sua dúvida que respondo no próximo vídeo',
    'Link na bio para falar com um advogado',
    'Inscreva-se e ative o sino para não perder nada',
  ]
}
