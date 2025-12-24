/**
 * Enhanced Base Agent
 * Advanced base class for all AI agents with logging, metrics, and error handling
 */

import { getOpenAI } from '../../openai-client'
import type {
  AgentRole,
  AgentCategory,
  Message,
  AgentContext,
  EnhancedAgentConfig,
  EnhancedAgentResponse,
  DEFAULT_MODEL,
  GROQ_DEFAULT_MODEL,
  DEFAULT_TEMPERATURE,
  DEFAULT_MAX_TOKENS,
} from './agent-types'
import { TEMPERATURE_PRESETS } from './agent-types'
import { AgentLogger, createAgentLogger, getCategoryForAgent } from './agent-logger'
import { createMetricsTracker, trackOperation } from './agent-metrics'

// =============================================================================
// DEFAULT CONFIGURATION
// =============================================================================

const DEFAULT_RETRY_CONFIG = {
  maxAttempts: 3,
  delayMs: 1000,
  backoffMultiplier: 2,
}

const DEFAULT_TIMEOUT = 30000 // 30 seconds

// =============================================================================
// ENHANCED BASE AGENT
// =============================================================================

export abstract class EnhancedBaseAgent {
  protected systemPrompt: string
  protected config: Required<EnhancedAgentConfig>
  protected logger: AgentLogger
  protected metrics: ReturnType<typeof createMetricsTracker>
  protected category: AgentCategory

  constructor(
    systemPrompt: string,
    role: AgentRole,
    config: Partial<EnhancedAgentConfig> = {}
  ) {
    this.systemPrompt = systemPrompt
    this.category = getCategoryForAgent(role)

    // Initialize configuration with defaults
    const defaultModel = this.getDefaultModel()
    const defaultTemperature = TEMPERATURE_PRESETS[this.category] || 0.7

    this.config = {
      model: config.model || defaultModel,
      temperature: config.temperature ?? defaultTemperature,
      maxTokens: config.maxTokens || 4000,
      stream: config.stream ?? false,
      enableLogging: config.enableLogging ?? true,
      enableMetrics: config.enableMetrics ?? true,
      retry: config.retry || DEFAULT_RETRY_CONFIG,
      timeout: config.timeout || DEFAULT_TIMEOUT,
      tags: config.tags || [],
    }

    // Initialize logging and metrics
    this.logger = createAgentLogger(role, this.category)
    this.metrics = createMetricsTracker(role, this.category)
  }

  // =============================================================================
  // ABSTRACT METHODS
  // =============================================================================

  /** Get agent name */
  abstract get name(): string

  /** Get agent role */
  abstract get role(): AgentRole

  /** Check if input is relevant to this agent */
  abstract isRelevant(input: string): boolean

  // =============================================================================
  // MAIN CHAT METHOD
  // =============================================================================

  /**
   * Main method to process user input and generate response
   */
  async chat(
    userMessage: string,
    conversationHistory: Message[] = [],
    context?: AgentContext
  ): Promise<EnhancedAgentResponse> {
    const startTime = Date.now()
    const requestId = generateRequestId()

    // Create logger with request context
    const logger = this.logger.withContext({
      requestId,
      conversationId: context?.conversationId,
      userId: context?.userId,
    })

    logger.info('chat', `Processing message: ${truncate(userMessage, 100)}`)

    try {
      const response = await this.executeWithRetry(
        () => this.callOpenAI(userMessage, conversationHistory, context),
        logger
      )

      const durationMs = Date.now() - startTime

      // Record metrics
      if (this.config.enableMetrics) {
        this.metrics.recordResponseTime(durationMs)
        this.metrics.recordSuccess()
        if (response.tokensUsed) {
          // Estimate prompt vs completion tokens (rough split)
          const promptTokens = Math.round(response.tokensUsed * 0.6)
          const completionTokens = response.tokensUsed - promptTokens
          this.metrics.recordTokens(promptTokens, completionTokens)
        }
      }

      logger.logWithDuration('info', 'chat', 'Response generated successfully', durationMs, {
        tokensUsed: response.tokensUsed,
        contentLength: response.content.length,
      })

      return {
        ...response,
        agentRole: this.role,
        durationMs,
        confidence: this.calculateConfidence(userMessage, response.content),
        requiresApproval: this.shouldRequireApproval(response.content),
      }
    } catch (error) {
      const durationMs = Date.now() - startTime

      // Record error metrics
      if (this.config.enableMetrics) {
        this.metrics.recordError(error instanceof Error ? error.name : 'Unknown')
      }

      logger.error('chat', 'Failed to generate response', error as Error, {
        durationMs,
        messageLength: userMessage.length,
      })

      throw error
    }
  }

  // =============================================================================
  // TASK PROCESSING
  // =============================================================================

  /**
   * Process a specific task with custom prompt
   */
  async processTask(
    taskPrompt: string,
    userInput: string,
    context?: AgentContext
  ): Promise<EnhancedAgentResponse> {
    const fullPrompt = `${taskPrompt}\n\n${userInput}`
    return this.chat(fullPrompt, [], context)
  }

  /**
   * Process with structured output
   */
  async processStructured<T>(
    prompt: string,
    context?: AgentContext,
    validator?: (result: unknown) => result is T
  ): Promise<T> {
    const response = await this.chat(prompt, [], context)

    try {
      const parsed = JSON.parse(response.content)

      if (validator && !validator(parsed)) {
        throw new Error('Invalid response structure')
      }

      return parsed as T
    } catch (error) {
      this.logger.error('processStructured', 'Failed to parse JSON response', error as Error, {
        content: truncate(response.content, 200),
      })
      throw new Error('Failed to parse AI response as JSON')
    }
  }

  // =============================================================================
  // OPENAI CALL
  // =============================================================================

  private async callOpenAI(
    userMessage: string,
    conversationHistory: Message[],
    _context?: AgentContext
  ): Promise<EnhancedAgentResponse> {
    const openai = getOpenAI()

    const messages: Message[] = [
      { role: 'system', content: this.systemPrompt },
      ...conversationHistory,
      { role: 'user', content: userMessage },
    ]

    const completion = await openai.chat.completions.create({
      model: this.config.model,
      messages: messages as any,
      temperature: this.config.temperature,
      max_tokens: this.config.maxTokens,
      stream: false,
    })

    if ('choices' in completion && Array.isArray(completion.choices)) {
      const response = completion.choices[0]
      const content = response.message?.content || ''

      return {
        content,
        tokensUsed: 'usage' in completion ? completion.usage?.total_tokens : undefined,
        model: 'model' in completion ? completion.model : this.config.model,
        finishReason: response.finish_reason || undefined,
        agentRole: this.role,
        durationMs: 0, // Will be set by caller
        confidence: 0, // Will be set by caller
      }
    }

    throw new Error('Invalid completion response format')
  }

  // =============================================================================
  // RETRY LOGIC
  // =============================================================================

  private async executeWithRetry<T>(
    operation: () => Promise<T>,
    logger: AgentLogger
  ): Promise<T> {
    const { maxAttempts, delayMs, backoffMultiplier } = this.config.retry
    let lastError: Error | undefined

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        return await this.executeWithTimeout(operation)
      } catch (error) {
        lastError = error as Error

        // Don't retry on certain errors
        if (this.isNonRetryableError(lastError)) {
          throw lastError
        }

        if (attempt < maxAttempts) {
          const delay = delayMs * Math.pow(backoffMultiplier, attempt - 1)
          logger.warn('retry', `Attempt ${attempt} failed, retrying in ${delay}ms`, {
            error: lastError.message,
            nextAttempt: attempt + 1,
          })
          await sleep(delay)
        }
      }
    }

    throw lastError
  }

  private async executeWithTimeout<T>(operation: () => Promise<T>): Promise<T> {
    return Promise.race([
      operation(),
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('Operation timed out')), this.config.timeout)
      ),
    ])
  }

  private isNonRetryableError(error: Error): boolean {
    // Don't retry authentication errors or invalid requests
    return (
      error.message.includes('401') ||
      error.message.includes('403') ||
      error.message.includes('Invalid')
    )
  }

  // =============================================================================
  // HELPER METHODS
  // =============================================================================

  /**
   * Get appropriate default model based on API key
   */
  private getDefaultModel(): string {
    if (process.env.OPENAI_API_KEY) {
      return 'gpt-4-turbo'
    }
    if (process.env.GROQ_API_KEY) {
      return 'llama-3.3-70b-versatile'
    }
    return 'gpt-4-turbo'
  }

  /**
   * Calculate confidence based on input relevance
   */
  protected calculateConfidence(input: string, response: string): number {
    const isRelevant = this.isRelevant(input)
    const hasSubstantiveResponse = response.length > 100

    if (!isRelevant) return 0.3
    if (!hasSubstantiveResponse) return 0.5

    // More sophisticated confidence could be added here
    return 0.8
  }

  /**
   * Check if response requires human approval
   */
  protected shouldRequireApproval(_content: string): boolean {
    // Override in subclasses for specific approval logic
    return false
  }

  /**
   * Update system prompt
   */
  protected setSystemPrompt(prompt: string): void {
    this.systemPrompt = prompt
  }

  /**
   * Get current configuration
   */
  getConfig(): Readonly<EnhancedAgentConfig> {
    return { ...this.config }
  }

  /**
   * Update configuration
   */
  updateConfig(updates: Partial<EnhancedAgentConfig>): void {
    this.config = { ...this.config, ...updates }
  }
}

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

function generateRequestId(): string {
  return `req_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
}

function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str
  return str.substring(0, maxLength - 3) + '...'
}

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

// =============================================================================
// FACTORY FOR SIMPLE AGENTS
// =============================================================================

/**
 * Create a simple agent from a system prompt
 */
export function createSimpleAgent(
  name: string,
  role: AgentRole,
  systemPrompt: string,
  relevanceKeywords: string[],
  config?: Partial<EnhancedAgentConfig>
): EnhancedBaseAgent {
  return new (class extends EnhancedBaseAgent {
    get name() {
      return name
    }

    get role(): AgentRole {
      return role
    }

    isRelevant(input: string): boolean {
      const lowerInput = input.toLowerCase()
      return relevanceKeywords.some(keyword => lowerInput.includes(keyword.toLowerCase()))
    }
  })(systemPrompt, role, config)
}
