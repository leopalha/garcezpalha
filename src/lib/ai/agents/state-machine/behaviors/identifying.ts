/**
 * Identifying State Behavior
 * Identifies user's problem and needs
 */

import { StateBehavior, ConversationData } from '../types'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || process.env.OPENROUTER_API_KEY,
  baseURL: process.env.OPENROUTER_API_KEY
    ? 'https://openrouter.ai/api/v1'
    : undefined,
})

export class IdentifyingBehavior implements StateBehavior {
  state = 'identifying' as const

  async handleMessage(
    message: string,
    data: ConversationData
  ): Promise<{
    response: string
    nextState?: 'classifying' | 'escalated' | 'abandoned'
    data: ConversationData
  }> {
    // Extract information from message
    const extracted = await this.extractInformation(message, data)

    // Update client info
    data.client = {
      ...data.client,
      ...extracted.clientInfo,
    }

    // Check if we have enough info to classify
    const hasEnoughInfo = this.hasEnoughInformation(extracted, data)

    let response: string
    let nextState: 'classifying' | undefined = undefined

    if (hasEnoughInfo) {
      response = `Entendi! Você precisa de ajuda com **${extracted.problemSummary}**.

Vou analisar sua situação e conectá-lo com o especialista mais adequado.`
      nextState = 'classifying'
    } else {
      response = await this.askClarifyingQuestions(extracted, data)
    }

    return {
      response,
      nextState,
      data,
    }
  }

  private async extractInformation(
    message: string,
    data: ConversationData
  ): Promise<{
    clientInfo: Partial<typeof data.client>
    problemSummary: string
    keywords: string[]
    hasEnoughDetail: boolean
  }> {
    const systemPrompt = `Você é um assistente que extrai informações estruturadas de mensagens de clientes.

Analise a mensagem e extraia:
1. Nome do cliente (se mencionado)
2. Email (se mencionado)
3. Telefone (se mencionado)
4. Cidade/Estado (se mencionado)
5. Resumo do problema em 1 frase
6. Keywords relevantes
7. Se há detalhes suficientes para classificar

Retorne no formato JSON:
{
  "name": "Nome" ou null,
  "email": "email@exemplo.com" ou null,
  "phone": "+5511999999999" ou null,
  "city": "Cidade" ou null,
  "state": "UF" ou null,
  "problemSummary": "resumo breve",
  "keywords": ["palavra1", "palavra2"],
  "hasEnoughDetail": true/false
}`

    try {
      const completion = await openai.chat.completions.create({
        model: process.env.OPENROUTER_API_KEY
          ? 'anthropic/claude-3.5-sonnet'
          : 'gpt-4-turbo-preview',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: message },
        ],
        temperature: 0.3,
        response_format: { type: 'json_object' },
      })

      const result = JSON.parse(completion.choices[0]?.message?.content || '{}')

      return {
        clientInfo: {
          name: result.name || undefined,
          email: result.email || undefined,
          phone: result.phone || undefined,
          city: result.city || undefined,
          state: result.state || undefined,
        },
        problemSummary: result.problemSummary || 'questão jurídica',
        keywords: result.keywords || [],
        hasEnoughDetail: result.hasEnoughDetail || false,
      }
    } catch (error) {
      console.error('[Identifying] Extraction error:', error)
      return {
        clientInfo: {},
        problemSummary: 'questão jurídica',
        keywords: [],
        hasEnoughDetail: false,
      }
    }
  }

  private hasEnoughInformation(
    extracted: Awaited<ReturnType<typeof this.extractInformation>>,
    data: ConversationData
  ): boolean {
    // Need either enough detail in message or specific keywords
    return extracted.hasEnoughDetail || extracted.keywords.length >= 2
  }

  private async askClarifyingQuestions(
    extracted: Awaited<ReturnType<typeof this.extractInformation>>,
    data: ConversationData
  ): Promise<string> {
    const systemPrompt = `Você é um assistente jurídico que faz perguntas de esclarecimento.

O cliente mencionou: "${extracted.problemSummary}"
Keywords identificadas: ${extracted.keywords.join(', ')}

Faça 1-2 perguntas específicas para entender melhor:
- Qual é o contexto?
- O que já aconteceu?
- Qual é o objetivo?

Seja empático e profissional. Máximo 2 parágrafos.`

    try {
      const completion = await openai.chat.completions.create({
        model: process.env.OPENROUTER_API_KEY
          ? 'anthropic/claude-3.5-sonnet'
          : 'gpt-4-turbo-preview',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Problema: ${extracted.problemSummary}` },
        ],
        temperature: 0.7,
        max_tokens: 200,
      })

      return completion.choices[0]?.message?.content || this.getDefaultQuestion()
    } catch (error) {
      console.error('[Identifying] Question generation error:', error)
      return this.getDefaultQuestion()
    }
  }

  private getDefaultQuestion(): string {
    return `Para eu poder te ajudar melhor, preciso entender alguns detalhes:

• Você pode me contar um pouco mais sobre sua situação?
• Quando isso aconteceu?
• Qual é o seu principal objetivo?`
  }
}
