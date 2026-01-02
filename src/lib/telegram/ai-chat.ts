/**
 * Telegram AI Chat Service
 *
 * OpenRouter API powered chatbot for Telegram conversations
 *
 * OpenRouter provides unified access to multiple LLM providers
 * with better pricing and fallback support.
 *
 * Base URL: https://openrouter.ai/api/v1
 * API Key format: sk-or-v1-*
 */

import OpenAI from 'openai'

// Lazy-loaded OpenAI client to avoid build-time initialization errors
let openaiClient: OpenAI | null = null
function getOpenAI(): OpenAI | null {
  if (openaiClient === null && process.env.OPENAI_API_KEY) {
    openaiClient = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
      baseURL: 'https://openrouter.ai/api/v1',
      defaultHeaders: {
        'HTTP-Referer': 'https://garcezpalha.com',
        'X-Title': 'Garcez Palha - Consultoria Jurídica',
      },
    })
  }
  return openaiClient
}

interface ChatMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

interface AIResponse {
  text: string
  intent?: string
  shouldQualify?: boolean
  suggestedAction?: 'escalate' | 'continue' | 'close'
}

class TelegramAIChatService {
  private systemPrompt = `Você é um assistente virtual da Garcez Palha Consultoria Jurídica & Pericial.

⚠️ DISCLAIMER OBRIGATÓRIO OAB (SEMPRE INCLUIR NA PRIMEIRA MENSAGEM):
"⚠️ Este chatbot fornece informações gerais. Não substitui consulta jurídica formal. Análise do caso será feita por advogado habilitado (OAB/RJ 219.390)."

COMPLIANCE OAB - REGRAS CRÍTICAS:
- NÃO dê orientações jurídicas específicas ou aconselhamento legal
- NÃO informe preços fixos (use apenas "valor de referência sujeito a análise do caso")
- SEMPRE direcione casos complexos para consulta com advogado
- Lembre o usuário periodicamente (a cada 5 mensagens) que esta é uma conversa preliminar

INFORMAÇÕES DA CONSULTORIA:
- Nome: Garcez Palha - Consultoria Jurídica & Pericial
- Advogado: Dr. Leonardo Mendonça Palha da Silva (OAB/RJ 219.390)
- Telefone: +55 21 99535-4010
- Email: contato@garcezpalha.com
- Website: https://garcezpalha.com

SERVIÇOS OFERECIDOS:
1. Direito Imobiliário - Compra, venda, locação, regularização de imóveis
2. Direito Criminal - Defesa criminal, habeas corpus, recursos, acompanhamento de inquéritos
3. Perícia de Documentos - Análise de autenticidade de documentos
4. Avaliação de Imóveis - Avaliações técnicas para diversos fins
5. Perícia Médica - Laudos e avaliações médico-legais
6. Secretaria Remota - Serviços de secretariado jurídico à distância
7. Direito Trabalhista - Questões trabalhistas e previdenciárias
8. Direito do Consumidor - Defesa do consumidor
9. Direito Civil - Contratos, família, sucessões

HISTÓRIA:
O escritório Garcez Palha possui tradição familiar desde 1661, com mais de 364 anos de experiência jurídica transmitida através de gerações.

SUA FUNÇÃO:
- Seja cordial, profissional e prestativo
- Responda perguntas sobre os serviços do escritório
- Colete informações relevantes (nome, telefone, email, tipo de serviço)
- Qualifique leads identificando: interesse claro em serviços, urgência, informações de contato
- Sugira agendar uma consulta quando o lead demonstrar interesse
- Mantenha respostas concisas (máximo 3 parágrafos)
- Use linguagem formal mas acessível
- Forneça apenas informações gerais sobre serviços

QUANDO ENCAMINHAR PARA HUMANO:
- Casos complexos que requerem análise jurídica
- Cliente insistente em falar com advogado
- Situações de urgência extrema
- Reclamações ou insatisfação
- Qualquer pedido de orientação jurídica específica

IMPORTANTE:
- Sempre pergunte o nome da pessoa no início da conversa
- Peça telefone ou email para contato
- Identifique qual serviço a pessoa precisa
- Seja empático e mostre que a pessoa está sendo ouvida
- NUNCA prometa resultados específicos em casos jurídicos`

  /**
   * Check if OpenAI is configured
   */
  isConfigured(): boolean {
    return getOpenAI() !== null
  }

  /**
   * Generate AI response for a message
   */
  async generateResponse(
    userMessage: string,
    conversationHistory: { direction: 'incoming' | 'outgoing', text: string }[],
    userName: string = 'Cliente'
  ): Promise<AIResponse> {
    if (!this.isConfigured()) {
      // Fallback response when OpenAI is not configured
      return {
        text: `Olá ${userName}! 👋\n\nObrigado por entrar em contato com o Garcez Palha.\n\nNo momento, nosso atendimento automatizado está em manutenção. Por favor, entre em contato através do nosso telefone +55 21 99535-4010 ou email contato@garcezpalha.com.\n\nTeremos prazer em atendê-lo!`,
        intent: 'fallback',
        suggestedAction: 'continue'
      }
    }

    try {
      // Build conversation messages for OpenAI
      const messages: ChatMessage[] = [
        {
          role: 'system',
          content: this.systemPrompt
        }
      ]

      // Add conversation history (last 10 messages)
      const recentHistory = conversationHistory.slice(-10)
      for (const msg of recentHistory) {
        messages.push({
          role: msg.direction === 'incoming' ? 'user' : 'assistant',
          content: msg.text || ''
        })
      }

      // Add current user message
      messages.push({
        role: 'user',
        content: userMessage
      })

      // Call OpenAI API
      const openai = getOpenAI()
      const completion = await openai!.chat.completions.create({
        model: 'gpt-4-turbo-preview',
        messages: messages,
        temperature: 0.7,
        max_tokens: 300,
        presence_penalty: 0.1,
        frequency_penalty: 0.1,
      })

      const responseText = completion.choices[0]?.message?.content || 'Desculpe, não consegui processar sua mensagem.'

      // Analyze response for intent and actions
      const lowerResponse = responseText.toLowerCase()
      let intent = 'general'
      let suggestedAction: 'escalate' | 'continue' | 'close' = 'continue'
      let shouldQualify = false

      if (lowerResponse.includes('agendar') || lowerResponse.includes('consulta')) {
        intent = 'booking'
        shouldQualify = true
      } else if (lowerResponse.includes('advogado') || lowerResponse.includes('especialista')) {
        intent = 'escalation'
        suggestedAction = 'escalate'
      } else if (lowerResponse.includes('obrigad') || lowerResponse.includes('até')) {
        intent = 'closing'
        suggestedAction = 'close'
      }

      // Check if we have contact info
      const hasContactInfo = /(?:\+55\s?)?(?:\(?\d{2}\)?[\s-]?)?\d{4,5}[\s-]?\d{4}/.test(userMessage) ||
        /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/.test(userMessage)

      if (hasContactInfo) {
        shouldQualify = true
      }

      return {
        text: responseText,
        intent,
        shouldQualify,
        suggestedAction
      }

    } catch (error: any) {
      console.error('OpenAI API Error:', error)

      // Fallback on error
      return {
        text: `Desculpe, estou com dificuldades técnicas no momento. Por favor, entre em contato através do telefone +55 21 99535-4010 ou email contato@garcezpalha.com. Teremos prazer em atendê-lo!`,
        intent: 'error',
        suggestedAction: 'continue'
      }
    }
  }

  /**
   * Generate a quick response for common queries
   */
  getQuickResponse(intent: string, userName: string = 'Cliente'): string {
    const responses: Record<string, string> = {
      greeting: `Olá ${userName}! 👋\n\nBem-vindo ao Garcez Palha - Escritório de Advocacia.\n\nComo posso ajudá-lo hoje?`,

      services: `⚖️ *Nossos Serviços:*\n\n` +
        `• Direito Imobiliário\n` +
        `• Direito Criminal\n` +
        `• Direito Civil\n` +
        `• Direito Trabalhista\n` +
        `• Direito do Consumidor\n` +
        `• Perícia de Documentos\n` +
        `• Avaliação de Imóveis\n` +
        `• Perícia Médica\n` +
        `• Secretaria Remota\n\n` +
        `Qual serviço você precisa?`,

      contact: `📞 *Contato:*\n\n` +
        `Email: contato@garcezpalha.com\n` +
        `Telefone: +55 21 99535-4010\n` +
        `Site: https://garcezpalha.com\n\n` +
        `Ficaremos felizes em atendê-lo!`,

      pricing: `Os valores variam de acordo com o serviço e complexidade do caso.\n\n` +
        `Para um orçamento personalizado, por favor informe:\n` +
        `• Tipo de serviço que precisa\n` +
        `• Breve descrição do caso\n` +
        `• Seu telefone para contato\n\n` +
        `Podemos agendar uma consulta inicial sem compromisso!`,

      booking: `Ótimo! Para agendar sua consulta, preciso de algumas informações:\n\n` +
        `• Seu nome completo\n` +
        `• Telefone de contato\n` +
        `• Tipo de serviço que precisa\n` +
        `• Horário de sua preferência (manhã/tarde)\n\n` +
        `Retornaremos em breve para confirmar!`
    }

    return responses[intent] || responses['greeting']
  }

  /**
   * Determine if message is a simple command
   */
  isSimpleCommand(text: string): { isCommand: boolean, intent?: string } {
    const lowerText = text.toLowerCase().trim()

    const commandMap: Record<string, string> = {
      'oi': 'greeting',
      'olá': 'greeting',
      'ola': 'greeting',
      'bom dia': 'greeting',
      'boa tarde': 'greeting',
      'boa noite': 'greeting',
      'serviços': 'services',
      'servicos': 'services',
      'contato': 'contact',
      'telefone': 'contact',
      'email': 'contact',
      'preço': 'pricing',
      'preco': 'pricing',
      'valor': 'pricing',
      'quanto custa': 'pricing',
      'agendar': 'booking',
      'consulta': 'booking'
    }

    const intent = commandMap[lowerText]
    return {
      isCommand: !!intent,
      intent
    }
  }
}

// Export singleton
const telegramAIChatService = new TelegramAIChatService()
export default telegramAIChatService
