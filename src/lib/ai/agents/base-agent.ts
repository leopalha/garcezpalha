/**
 * Base Agent Class
 * Foundation for all specialized AI agents
 * Updated with Circuit Breaker Pattern for resilience (P0-002)
 */

import { getOpenAI } from '../openai-client'
import { callLLMWithFallback } from '@/lib/resilience/openai-breaker'
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
   * P0-002: Uses Circuit Breaker with automatic fallback chain
   * GPT-4 → GPT-3.5 → Groq → Pre-programmed responses
   */
  async chat(
    userMessage: string,
    conversationHistory: Message[] = [],
    context?: AgentContext
  ): Promise<AgentResponse> {
    try {
      // Build messages array
      const messages: Message[] = [
        { role: 'system', content: this.systemPrompt },
        ...conversationHistory,
        { role: 'user', content: userMessage },
      ]

      // P0-002: Use Circuit Breaker with automatic fallback
      const content = await callLLMWithFallback({
        model: this.config.model,
        messages: messages.map(m => ({ role: m.role, content: m.content })),
        temperature: this.config.temperature,
        max_tokens: this.config.maxTokens,
      })

      return {
        content: content || '',
        tokensUsed: undefined, // Circuit breaker doesn't track tokens yet
        model: this.config.model,
        finishReason: 'stop',
      }
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
