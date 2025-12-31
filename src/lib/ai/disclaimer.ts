/**
 * AI Response Disclaimer System
 * P1-009: Automatic disclaimer for OAB compliance
 *
 * All AI-generated legal content must include a disclaimer stating that:
 * - This is not legal advice
 * - Consult a licensed lawyer for specific cases
 * - OAB regulations compliance
 */

export const AI_DISCLAIMER = `

---

⚖️ **Aviso Legal Importante**

Esta resposta foi gerada por inteligência artificial e tem **caráter meramente informativo e educacional**. Não constitui aconselhamento jurídico, consultoria legal ou qualquer tipo de orientação profissional específica para seu caso.

**Para questões jurídicas específicas:**
- Consulte sempre um advogado devidamente inscrito na OAB
- Cada caso possui particularidades que apenas um profissional pode avaliar adequadamente
- A Garcez Palha conecta você com advogados especializados para análise detalhada

💡 **Quer falar com um advogado especializado?** [Agende uma consulta gratuita](/contato)
`

export const SHORT_DISCLAIMER = `\n\n⚖️ *Esta é uma orientação geral por IA. Para aconselhamento jurídico específico, consulte um advogado inscrito na OAB.*`

export const VOICE_DISCLAIMER = `Importante: Esta orientação é gerada por IA com fins informativos. Para questões específicas, consulte um advogado inscrito na OAB.`

/**
 * Add disclaimer to AI response
 */
export function addDisclaimer(
  content: string,
  format: 'full' | 'short' | 'voice' = 'full'
): string {
  // Don't add duplicate disclaimers
  if (content.includes('⚖️') || content.includes('Aviso Legal')) {
    return content
  }

  switch (format) {
    case 'full':
      return content + AI_DISCLAIMER
    case 'short':
      return content + SHORT_DISCLAIMER
    case 'voice':
      return content + '\n\n' + VOICE_DISCLAIMER
    default:
      return content + AI_DISCLAIMER
  }
}

/**
 * Check if content already has a disclaimer
 */
export function hasDisclaimer(content: string): boolean {
  return (
    content.includes('⚖️') ||
    content.includes('Aviso Legal') ||
    content.includes('OAB') ||
    content.includes('aconselhamento jurídico')
  )
}

/**
 * Remove disclaimer from content (for editing)
 */
export function removeDisclaimer(content: string): string {
  return content
    .replace(AI_DISCLAIMER, '')
    .replace(SHORT_DISCLAIMER, '')
    .replace(VOICE_DISCLAIMER, '')
    .trim()
}

/**
 * Disclaimer configuration per product type
 */
export const DISCLAIMER_CONFIG: Record<string, {
  enabled: boolean
  format: 'full' | 'short' | 'voice'
  customText?: string
}> = {
  // Legal products - always full disclaimer
  'banc-revisao-contrato': { enabled: true, format: 'full' },
  'consumidor-negativacao': { enabled: true, format: 'full' },
  'trabalhista-calculo': { enabled: true, format: 'full' },
  'previdenciario-aposentadoria': { enabled: true, format: 'full' },

  // General legal consultation - full disclaimer
  'consulta-juridica': { enabled: true, format: 'full' },
  'analise-contrato': { enabled: true, format: 'full' },

  // Quick questions - short disclaimer
  'duvida-rapida': { enabled: true, format: 'short' },
  'orientacao-geral': { enabled: true, format: 'short' },

  // Voice interactions - voice disclaimer
  'atendimento-voz': { enabled: true, format: 'voice' },

  // Non-legal products - disabled
  'tutorial': { enabled: false, format: 'short' },
  'demo': { enabled: false, format: 'short' },
}

/**
 * Get disclaimer for specific product
 */
export function getProductDisclaimer(productId?: string): string | null {
  if (!productId) {
    return AI_DISCLAIMER // Default to full disclaimer
  }

  const config = DISCLAIMER_CONFIG[productId]
  if (!config || !config.enabled) {
    return null
  }

  if (config.customText) {
    return '\n\n' + config.customText
  }

  switch (config.format) {
    case 'full':
      return AI_DISCLAIMER
    case 'short':
      return SHORT_DISCLAIMER
    case 'voice':
      return VOICE_DISCLAIMER
    default:
      return AI_DISCLAIMER
  }
}

/**
 * Wrap AI response with disclaimer
 */
export function wrapWithDisclaimer(
  content: string,
  options: {
    productId?: string
    mode?: 'chat' | 'agent-flow' | 'realtime-voice'
    forceDisclaimer?: boolean
  } = {}
): string {
  // Skip if already has disclaimer
  if (!options.forceDisclaimer && hasDisclaimer(content)) {
    return content
  }

  // Determine format based on mode
  let format: 'full' | 'short' | 'voice' = 'full'
  if (options.mode === 'realtime-voice') {
    format = 'voice'
  } else if (options.mode === 'chat') {
    format = 'short'
  }

  // Get product-specific disclaimer
  if (options.productId) {
    const productDisclaimer = getProductDisclaimer(options.productId)
    if (productDisclaimer === null) {
      return content // Disclaimer disabled for this product
    }
    return content + productDisclaimer
  }

  // Default disclaimer
  return addDisclaimer(content, format)
}
