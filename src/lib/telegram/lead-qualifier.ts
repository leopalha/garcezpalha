/**
 * Telegram Lead Qualifier
 *
 * AI-powered lead qualification for Telegram conversations
 */

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''
const supabase = createClient(supabaseUrl, supabaseServiceKey)

interface QualificationResult {
  score: number // 0-100
  reason: string
  isQualified: boolean
  intent?: string
  entities?: {
    name?: string
    email?: string
    phone?: string
    service?: string
  }
  sentiment?: 'positive' | 'neutral' | 'negative'
}

class TelegramLeadQualifier {
  /**
   * Check if configured
   */
  isConfigured(): boolean {
    return !!supabaseUrl && !!supabaseServiceKey && supabaseUrl !== '' && supabaseServiceKey !== ''
  }

  /**
   * Qualify a conversation based on message history
   */
  async qualifyConversation(conversationId: string): Promise<QualificationResult> {
    if (!this.isConfigured()) {
      return {
        score: 0,
        reason: 'Database not configured',
        isQualified: false
      }
    }

    try {
      // Get conversation messages
      const { data: messages, error } = await supabase
        .from('telegram_messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('telegram_date', { ascending: true })

      if (error || !messages || messages.length === 0) {
        return {
          score: 0,
          reason: 'No messages found',
          isQualified: false
        }
      }

      // Calculate score based on various factors
      let score = 0
      const factors: string[] = []
      const entities: any = {}

      // Factor 1: Number of messages (engagement)
      const messageCount = messages.length
      if (messageCount >= 3) {
        score += 20
        factors.push('Engaged conversation (3+ messages)')
      } else if (messageCount >= 2) {
        score += 10
        factors.push('Initial engagement')
      }

      // Factor 2: Contact information provided
      const allText = messages.map(m => m.text || '').join(' ')

      // Phone patterns (Brazilian)
      const phoneRegex = /(?:\+55\s?)?(?:\(?\d{2}\)?[\s-]?)?\d{4,5}[\s-]?\d{4}/g
      const phones = allText.match(phoneRegex)
      if (phones && phones.length > 0) {
        score += 25
        factors.push('Phone number provided')
        entities.phone = phones[0]
      }

      // Email pattern
      const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g
      const emails = allText.match(emailRegex)
      if (emails && emails.length > 0) {
        score += 25
        factors.push('Email provided')
        entities.email = emails[0]
      }

      // Factor 3: Service interest keywords
      const serviceKeywords = [
        { keywords: ['imobiliário', 'imovel', 'propriedade', 'compra', 'venda', 'aluguel'], service: 'Direito Imobiliário', score: 15 },
        { keywords: ['criminal', 'defesa', 'processo', 'policia', 'delegacia', 'habeas corpus', 'advogado criminal', 'acusação', 'denúncia'], service: 'Direito Criminal', score: 15 },
        { keywords: ['perícia', 'documento', 'autenticidade', 'falsificação'], service: 'Perícia de Documentos', score: 15 },
        { keywords: ['avaliação', 'avaliar', 'valor', 'preço'], service: 'Avaliação de Imóveis', score: 15 },
        { keywords: ['médica', 'médico', 'saúde', 'laudo'], service: 'Perícia Médica', score: 15 },
        { keywords: ['secretaria', 'secretário', 'remoto', 'virtual'], service: 'Secretaria Remota', score: 15 },
        { keywords: ['trabalhista', 'trabalho', 'demissão', 'fgts', 'rescisão'], service: 'Direito Trabalhista', score: 15 },
        { keywords: ['consumidor', 'compra', 'produto', 'serviço defeituoso'], service: 'Direito do Consumidor', score: 15 },
        { keywords: ['civil', 'contrato', 'divórcio', 'inventário'], service: 'Direito Civil', score: 15 },
      ]

      for (const { keywords, service, score: serviceScore } of serviceKeywords) {
        const found = keywords.some(kw => allText.toLowerCase().includes(kw))
        if (found) {
          score += serviceScore
          factors.push(`Interest in ${service}`)
          entities.service = service
          break // Only count one service
        }
      }

      // Factor 4: Intent signals
      const urgencyKeywords = ['urgente', 'rápido', 'preciso', 'ajuda', 'quando', 'hoje', 'agora']
      const hasUrgency = urgencyKeywords.some(kw => allText.toLowerCase().includes(kw))
      if (hasUrgency) {
        score += 10
        factors.push('Urgency indicated')
      }

      // Factor 5: Questions about services
      const questionWords = ['como', 'quanto', 'quando', 'onde', 'qual', 'vocês', 'fazer', 'contratar']
      const hasQuestions = questionWords.some(qw => allText.toLowerCase().includes(qw))
      if (hasQuestions) {
        score += 10
        factors.push('Asked questions about services')
      }

      // Factor 6: Positive sentiment
      const positiveWords = ['obrigado', 'agradeço', 'ótimo', 'excelente', 'perfeito', 'sim', 'gostaria', 'interesse']
      const negativeWords = ['não', 'nunca', 'ruim', 'péssimo', 'cancelar']

      const positiveCount = positiveWords.filter(pw => allText.toLowerCase().includes(pw)).length
      const negativeCount = negativeWords.filter(nw => allText.toLowerCase().includes(nw)).length

      let sentiment: 'positive' | 'neutral' | 'negative' = 'neutral'
      if (positiveCount > negativeCount) {
        score += 5
        sentiment = 'positive'
        factors.push('Positive sentiment')
      } else if (negativeCount > positiveCount) {
        score -= 5
        sentiment = 'negative'
        factors.push('Negative sentiment')
      }

      // Cap score at 100
      score = Math.min(100, Math.max(0, score))

      return {
        score,
        reason: factors.join('; '),
        isQualified: score >= 70,
        entities,
        sentiment
      }
    } catch (error) {
      console.error('Error in qualifyConversation:', error)
      return {
        score: 0,
        reason: 'Error during qualification',
        isQualified: false
      }
    }
  }

  /**
   * Detect intent from a single message
   */
  detectIntent(text: string): string {
    const lowerText = text.toLowerCase()

    // Greetings
    if (/^(oi|olá|ola|hey|hello|bom dia|boa tarde|boa noite|e aí)/.test(lowerText)) {
      return 'greeting'
    }

    // Help requests
    if (/(ajuda|help|ajudar|socorro|duvida|dúvida)/.test(lowerText)) {
      return 'help_request'
    }

    // Service inquiry
    if (/(serviço|serviços|oferece|fazem|trabalham|atuam)/.test(lowerText)) {
      return 'services_inquiry'
    }

    // Contact info request
    if (/(contato|telefone|email|endereço|falar|ligar)/.test(lowerText)) {
      return 'contact_request'
    }

    // Pricing inquiry
    if (/(preço|valor|quanto custa|custo|honorário|cobram)/.test(lowerText)) {
      return 'pricing_inquiry'
    }

    // Booking/appointment
    if (/(agendar|agenda|consulta|reunião|conversar|encontro|visita)/.test(lowerText)) {
      return 'booking_request'
    }

    // Complaint
    if (/(problema|reclamação|insatisfeito|ruim|péssimo|erro)/.test(lowerText)) {
      return 'complaint'
    }

    // Gratitude
    if (/(obrigado|obrigada|agradeço|valeu|thanks)/.test(lowerText)) {
      return 'gratitude'
    }

    return 'general_inquiry'
  }

  /**
   * Extract entities from text
   */
  extractEntities(text: string): Record<string, any> {
    const entities: Record<string, any> = {}

    // Phone
    const phoneRegex = /(?:\+55\s?)?(?:\(?\d{2}\)?[\s-]?)?\d{4,5}[\s-]?\d{4}/g
    const phones = text.match(phoneRegex)
    if (phones && phones.length > 0) {
      entities.phone = phones[0].replace(/[\s()-]/g, '')
    }

    // Email
    const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g
    const emails = text.match(emailRegex)
    if (emails && emails.length > 0) {
      entities.email = emails[0].toLowerCase()
    }

    // Name (simple heuristic - capitalized words)
    const nameRegex = /(?:me chamo|meu nome é|sou|eu sou)\s+([A-ZÀ-Ú][a-zà-ú]+(?:\s+[A-ZÀ-Ú][a-zà-ú]+)*)/i
    const nameMatch = text.match(nameRegex)
    if (nameMatch && nameMatch[1]) {
      entities.name = nameMatch[1]
    }

    return entities
  }
}

// Export singleton
const telegramLeadQualifier = new TelegramLeadQualifier()
export default telegramLeadQualifier
