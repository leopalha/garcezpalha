/**
 * Base Agent Class
 * Foundation for all specialized AI agents
 */

import { getOpenAI } from '../openai-client'
import type {
  Message,
  AgentResponse,
  AgentConfig,
  AgentContext,
} from './types'
import { DEFAULT_MODEL, GROQ_DEFAULT_MODEL, DEFAULT_TEMPERATURE, DEFAULT_MAX_TOKENS } from './types'

export abstract class BaseAgent {
  protected systemPrompt: string
  protected config: Required<AgentConfig>

  constructor(systemPrompt: string, config: Partial<AgentConfig> = {}) {
    this.systemPrompt = systemPrompt

    // Auto-detect model based on available API key
    const defaultModel = this.getDefaultModel()

    this.config = {
      model: config.model || defaultModel,
      temperature: config.temperature ?? DEFAULT_TEMPERATURE,
      maxTokens: config.maxTokens || DEFAULT_MAX_TOKENS,
      stream: config.stream ?? false,
    }
  }

  /**
   * Get the appropriate default model based on configured API
   */
  private getDefaultModel(): string {
    // If OPENAI_API_KEY is set, use OpenAI model
    if (process.env.OPENAI_API_KEY) {
      return DEFAULT_MODEL // gpt-4-turbo
    }
    // If only GROQ_API_KEY is set, use Groq model
    if (process.env.GROQ_API_KEY) {
      return GROQ_DEFAULT_MODEL // llama-3.3-70b-versatile
    }
    // Fallback to OpenAI model name
    return DEFAULT_MODEL
  }

  /**
   * Main method to process user input and generate response
   */
  async chat(
    userMessage: string,
    conversationHistory: Message[] = [],
    context?: AgentContext
  ): Promise<AgentResponse> {
    try {
      const openai = getOpenAI()

      // Build messages array
      const messages: Message[] = [
        { role: 'system', content: this.systemPrompt },
        ...conversationHistory,
        { role: 'user', content: userMessage },
      ]

      // Call OpenAI API (never stream for now)
      const completion = await openai.chat.completions.create({
        model: this.config.model,
        messages: messages as any,
        temperature: this.config.temperature,
        max_tokens: this.config.maxTokens,
        stream: false, // Always false to ensure proper type
      })

      // Type assertion since we know stream is false
      if ('choices' in completion && Array.isArray(completion.choices)) {
        const response = completion.choices[0]
        const content = response.message?.content || ''

        return {
          content,
          tokensUsed: 'usage' in completion ? completion.usage?.total_tokens : undefined,
          model: 'model' in completion ? completion.model : this.config.model,
          finishReason: response.finish_reason || undefined,
        }
      }

      throw new Error('Invalid completion response format')
    } catch (error) {
      console.error('[BaseAgent] Error generating response:', error)
      throw new Error(
        `Failed to generate AI response: ${error instanceof Error ? error.message : 'Unknown error'}`
      )
    }
  }

  /**
   * Process a specific task with optional context
   */
  async processTask(
    taskPrompt: string,
    userInput: string,
    context?: AgentContext
  ): Promise<AgentResponse> {
    const fullPrompt = `${taskPrompt}\n\n${userInput}`
    return this.chat(fullPrompt, [], context)
  }

  /**
   * Validate if input is appropriate for this agent
   */
  abstract isRelevant(input: string): boolean

  /**
   * Get agent name/type
   */
  abstract get name(): string
}
