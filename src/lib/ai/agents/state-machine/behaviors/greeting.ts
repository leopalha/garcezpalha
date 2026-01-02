/**
 * Greeting State Behavior
 * Initial state when conversation starts
 */

import { StateBehavior, ConversationData } from '../types'
import OpenAI from 'openai'

// Lazy-loaded OpenAI client to avoid build-time initialization errors
let openaiClient: OpenAI | null = null
function getOpenAI(): OpenAI {
  if (!openaiClient) {
    const apiKey = process.env.OPENAI_API_KEY || process.env.OPENROUTER_API_KEY
    if (!apiKey) {
      throw new Error('OPENAI_API_KEY or OPENROUTER_API_KEY not configured')
    }
    openaiClient = new OpenAI({
      apiKey,
      baseURL: process.env.OPENROUTER_API_KEY
        ? 'https://openrouter.ai/api/v1'
        : undefined,
    })
  }
  return openaiClient
}

export class GreetingBehavior implements StateBehavior {
  state = 'greeting' as const

  async onEnter(data: ConversationData): Promise<ConversationData> {
    console.log('[Greeting] Conversation started')
    return data
  }

  async handleMessage(
    message: string,
    data: ConversationData
  ): Promise<{
    response: string
    nextState?: 'identifying' | 'escalated' | 'abandoned'
    data: ConversationData
  }> {
    // Generate personalized greeting response
    const response = await this.generateGreetingResponse(message, data)

    // Check if we can already identify the user's intent
    const hasIntent = this.detectIntent(message)

    return {
      response,
      nextState: hasIntent ? 'identifying' : undefined,
      data,
    }
  }

  private async generateGreetingResponse(
    message: string,
    data: ConversationData
  ): Promise<string> {
    const systemPrompt = `Você é um assistente jurídico da Garcez Palha, escritório com 364 anos de tradição.

Seu objetivo nesta fase é:
1. Dar boas-vindas calorosas
2. Apresentar-se brevemente
3. Perguntar como pode ajudar
4. Ser profissional mas acolhedor

IMPORTANTE:
- Sempre inclua disclaimer OAB ao final
- Nunca garanta resultados
- Seja breve (máx 3 parágrafos)
- Use emojis com moderação

OAB Disclaimer obrigatório:
"As informações fornecidas têm caráter orientativo e não substituem consulta jurídica formal. OAB/RJ 219.390."`

    try {
      const completion = await getOpenAI().chat.completions.create({
        model: process.env.OPENROUTER_API_KEY
          ? 'anthropic/claude-3.5-sonnet'
          : 'gpt-4-turbo-preview',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: message },
        ],
        temperature: 0.7,
        max_tokens: 300,
      })

      return completion.choices[0]?.message?.content || this.getDefaultGreeting()
    } catch (error) {
      console.error('[Greeting] OpenAI error:', error)
      return this.getDefaultGreeting()
    }
  }

  private getDefaultGreeting(): string {
    return `Olá! 👋 Bem-vindo à Garcez Palha.

Sou seu assistente jurídico virtual e estou aqui para ajudá-lo. Com 364 anos de tradição, oferecemos soluções jurídicas especializadas em diversas áreas.

Como posso ajudá-lo hoje?

_As informações fornecidas têm caráter orientativo e não substituem consulta jurídica formal. OAB/RJ 219.390._`
  }

  private detectIntent(message: string): boolean {
    const lowerMessage = message.toLowerCase()

    // Keywords that indicate clear intent
    const intentKeywords = [
      'preciso', 'quero', 'gostaria', 'tenho um problema',
      'ajuda com', 'consulta sobre', 'contrato', 'processo',
      'ação', 'advogado', 'jurídico', 'legal',
      'imóvel', 'trabalhista', 'criminal', 'cível',
    ]

    return intentKeywords.some(keyword => lowerMessage.includes(keyword))
  }
}
