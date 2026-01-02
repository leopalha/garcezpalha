/**
 * Circuit Breaker for OpenAI API
 * Fallback strategy: GPT-4 → GPT-3.5 → Groq → Pre-programmed responses
 */

import { createCircuitBreaker } from './circuit-breaker'
import { logger } from '@/lib/logger'
import OpenAI from 'openai'

// Lazy-loaded clients to avoid build-time errors
let openai: OpenAI | null = null
let groq: OpenAI | null = null

function getOpenAI(): OpenAI {
  if (!openai) {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY not configured')
    }
    openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    })
  }
  return openai
}

function getGroq(): OpenAI | null {
  if (groq === null && process.env.GROQ_API_KEY) {
    groq = new OpenAI({
      apiKey: process.env.GROQ_API_KEY,
      baseURL: 'https://api.groq.com/openai/v1',
    })
  }
  return groq
}

// Types
interface ChatCompletionParams {
  model: string
  messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }>
  temperature?: number
  max_tokens?: number
}

/**
 * Primary: GPT-4
 */
async function callGPT4(params: ChatCompletionParams) {
  logger.info('Calling GPT-4', { model: params.model })

  const response = await getOpenAI().chat.completions.create({
    ...params,
    model: params.model || 'gpt-4-turbo-preview',
  })

  return response.choices[0].message.content
}

/**
 * Fallback 1: GPT-3.5 (faster, cheaper)
 */
async function callGPT35(params: ChatCompletionParams) {
  logger.warn('Fallback to GPT-3.5', { originalModel: params.model })

  const response = await getOpenAI().chat.completions.create({
    ...params,
    model: 'gpt-3.5-turbo',
  })

  return response.choices[0].message.content
}

/**
 * Fallback 2: Groq Llama 3 (ultra-fast, free)
 */
async function callGroq(params: ChatCompletionParams) {
  const groqClient = getGroq()
  if (!groqClient) {
    throw new Error('Groq not configured')
  }

  logger.warn('Fallback to Groq Llama 3', { originalModel: params.model })

  const response = await groqClient.chat.completions.create({
    ...params,
    model: 'llama3-70b-8192',
  })

  return response.choices[0].message.content
}

/**
 * Fallback 3: Pre-programmed responses (last resort)
 */
async function getPreprogrammedResponse(params: ChatCompletionParams) {
  logger.error('All LLM providers failed, using pre-programmed response')

  // Extract intent from messages
  const lastMessage = params.messages[params.messages.length - 1]?.content || ''

  // Simple keyword-based responses
  if (lastMessage.toLowerCase().includes('prazo')) {
    return 'No momento estamos com problemas técnicos. Por favor, entre em contato pelo telefone (11) 1234-5678 para informações sobre prazos.'
  }

  if (lastMessage.toLowerCase().includes('documento')) {
    return 'Estamos processando sua solicitação de documentos. Em breve entraremos em contato.'
  }

  if (lastMessage.toLowerCase().includes('pagamento')) {
    return 'Para questões sobre pagamento, por favor entre em contato com nosso financeiro pelo email financeiro@garcezpalha.com.br'
  }

  // Default fallback
  return 'Agradecemos seu contato. No momento estamos com instabilidade técnica. Por favor, tente novamente em alguns minutos ou entre em contato pelo telefone (11) 1234-5678.'
}

/**
 * Circuit Breaker for GPT-4
 */
export const gpt4Breaker = createCircuitBreaker(
  callGPT4,
  {
    name: 'openai-gpt4',
    timeout: 30000, // 30s (GPT-4 pode ser lento)
    errorThresholdPercentage: 50,
    resetTimeout: 60000, // 1min
    volumeThreshold: 3,
  },
  async (params) => {
    // Fallback to GPT-3.5
    try {
      return await gpt35Breaker.fire(params)
    } catch (error) {
      logger.error('GPT-3.5 fallback failed', { error })
      throw error
    }
  }
)

/**
 * Circuit Breaker for GPT-3.5
 */
export const gpt35Breaker = createCircuitBreaker(
  callGPT35,
  {
    name: 'openai-gpt35',
    timeout: 15000, // 15s
    errorThresholdPercentage: 50,
    resetTimeout: 30000, // 30s
    volumeThreshold: 3,
  },
  async (params) => {
    // Fallback to Groq if available
    if (getGroq()) {
      try {
        return await groqBreaker?.fire(params)
      } catch (error) {
        logger.error('Groq fallback failed', { error })
      }
    }

    // Last resort: pre-programmed
    return await getPreprogrammedResponse(params)
  }
)

/**
 * Circuit Breaker for Groq (lazy-loaded)
 */
let _groqBreaker: ReturnType<typeof createCircuitBreaker<ChatCompletionParams, string | null>> | null = null

export const groqBreaker = {
  fire: async (params: ChatCompletionParams) => {
    if (!_groqBreaker && getGroq()) {
      _groqBreaker = createCircuitBreaker(
        callGroq,
        {
          name: 'groq-llama3',
          timeout: 10000, // 10s (Groq is fast)
          errorThresholdPercentage: 50,
          resetTimeout: 30000,
          volumeThreshold: 3,
        },
        getPreprogrammedResponse
      )
    }
    if (!_groqBreaker) {
      throw new Error('Groq not configured')
    }
    return _groqBreaker.fire(params)
  },
  get status() {
    return _groqBreaker?.status || { stats: null }
  }
}

/**
 * Smart LLM Call with automatic fallback
 */
export async function callLLMWithFallback(
  params: ChatCompletionParams
): Promise<string | null> {
  try {
    // Try GPT-4 first (circuit breaker handles fallback chain)
    const response = await gpt4Breaker.fire(params)
    return response
  } catch (error) {
    logger.error('All LLM providers failed', { error })
    // Return pre-programmed as last resort
    return await getPreprogrammedResponse(params)
  }
}

/**
 * Get LLM Circuit Breaker Stats
 */
export function getLLMCircuitBreakerStats() {
  return {
    gpt4: gpt4Breaker.status.stats,
    gpt35: gpt35Breaker.status.stats,
    groq: groqBreaker?.status.stats || null,
  }
}
