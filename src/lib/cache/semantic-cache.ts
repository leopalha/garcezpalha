/**
 * Semantic Cache for LLM - D7-009
 * Cache AI responses based on semantic similarity to reduce costs and latency
 */

import { createLogger } from '@/lib/logger'
import { createClient } from 'redis'

const logger = createLogger('semantic-cache')

// ============================================================================
// TYPES
// ============================================================================

export interface CacheEntry {
  query: string
  response: string
  embedding: number[]
  model: string
  metadata: Record<string, any>
  createdAt: number
  hits: number
  lastAccessedAt: number
}

export interface SemanticCacheConfig {
  similarityThreshold: number // 0.0 to 1.0 (0.95 = 95% similar)
  ttl: number // Time to live in seconds
  maxEntries: number // Max cache entries before eviction
  enableCostTracking: boolean
}

// ============================================================================
// REDIS CLIENT
// ============================================================================

let redisClient: ReturnType<typeof createClient> | null = null

async function getRedisClient() {
  if (redisClient && redisClient.isReady) {
    return redisClient
  }

  redisClient = createClient({
    socket: {
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT || '6379'),
    },
    password: process.env.REDIS_PASSWORD,
  })

  redisClient.on('error', (err: Error) => {
    logger.error('[Redis] Connection error:', err)
  })

  await redisClient.connect()
  logger.info('[Redis] Connected for semantic cache')

  return redisClient
}

// ============================================================================
// EMBEDDING UTILITIES
// ============================================================================

/**
 * Generate embedding for text using OpenAI
 * In production, consider using a smaller/faster embedding model
 */
export async function generateEmbedding(text: string): Promise<number[]> {
  try {
    const openaiApiKey = process.env.OPENAI_API_KEY

    if (!openaiApiKey) {
      logger.warn('[Embedding] OpenAI API key not configured, using mock embedding')
      return generateMockEmbedding(text)
    }

    const response = await fetch('https://api.openai.com/v1/embeddings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${openaiApiKey}`,
      },
      body: JSON.stringify({
        model: 'text-embedding-3-small', // Cheaper and faster than ada-002
        input: text,
      }),
    })

    if (!response.ok) {
      throw new Error(`OpenAI embedding failed: ${response.statusText}`)
    }

    const data = await response.json()
    return data.data[0].embedding
  } catch (error) {
    logger.error('[Embedding] Failed to generate embedding:', error)
    return generateMockEmbedding(text)
  }
}

/**
 * Mock embedding for development/fallback
 */
function generateMockEmbedding(text: string): number[] {
  // Simple hash-based mock embedding (1536 dimensions like text-embedding-3-small)
  const embedding = new Array(1536).fill(0)

  for (let i = 0; i < text.length; i++) {
    const charCode = text.charCodeAt(i)
    const index = charCode % 1536
    embedding[index] += Math.sin(charCode) * 0.1
  }

  // Normalize
  const magnitude = Math.sqrt(embedding.reduce((sum, val) => sum + val * val, 0))
  return embedding.map((val) => val / magnitude)
}

/**
 * Calculate cosine similarity between two embeddings
 */
export function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length) {
    throw new Error('Embeddings must have same dimensions')
  }

  let dotProduct = 0
  let magnitudeA = 0
  let magnitudeB = 0

  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i]
    magnitudeA += a[i] * a[i]
    magnitudeB += b[i] * b[i]
  }

  magnitudeA = Math.sqrt(magnitudeA)
  magnitudeB = Math.sqrt(magnitudeB)

  if (magnitudeA === 0 || magnitudeB === 0) {
    return 0
  }

  return dotProduct / (magnitudeA * magnitudeB)
}

// ============================================================================
// SEMANTIC CACHE CLASS
// ============================================================================

export class SemanticCache {
  private config: SemanticCacheConfig

  constructor(config: Partial<SemanticCacheConfig> = {}) {
    this.config = {
      similarityThreshold: config.similarityThreshold || 0.95,
      ttl: config.ttl || 86400, // 24 hours default
      maxEntries: config.maxEntries || 10000,
      enableCostTracking: config.enableCostTracking !== false,
    }

    logger.info('[SemanticCache] Initialized', this.config)
  }

  /**
   * Get cached response if similar query exists
   */
  async get(query: string, model: string): Promise<string | null> {
    try {
      const redis = await getRedisClient()
      const queryEmbedding = await generateEmbedding(query)

      // Get all cache entries for this model
      const cacheKey = `semantic-cache:${model}:*`
      const keys = await redis.keys(cacheKey)

      if (keys.length === 0) {
        logger.debug('[SemanticCache] No cache entries found', { model })
        return null
      }

      let bestMatch: CacheEntry | null = null
      let bestSimilarity = 0

      // Find most similar cached query
      for (const key of keys) {
        const entryJson = await redis.get(key)
        if (!entryJson) continue

        const entry: CacheEntry = JSON.parse(entryJson)
        const similarity = cosineSimilarity(queryEmbedding, entry.embedding)

        if (similarity > bestSimilarity) {
          bestSimilarity = similarity
          bestMatch = entry
        }
      }

      // Check if similarity meets threshold
      if (bestMatch && bestSimilarity >= this.config.similarityThreshold) {
        logger.info('[SemanticCache] Cache HIT', {
          similarity: bestSimilarity.toFixed(4),
          query: query.substring(0, 100),
          cachedQuery: bestMatch.query.substring(0, 100),
        })

        // Update hit count and last accessed time
        bestMatch.hits++
        bestMatch.lastAccessedAt = Date.now()

        const entryKey = `semantic-cache:${model}:${this._hashQuery(bestMatch.query)}`
        await redis.setEx(entryKey, this.config.ttl, JSON.stringify(bestMatch))

        // Track cost savings
        if (this.config.enableCostTracking) {
          await this._trackCostSavings(model, query, bestMatch.response)
        }

        return bestMatch.response
      }

      logger.debug('[SemanticCache] Cache MISS', {
        bestSimilarity: bestSimilarity.toFixed(4),
        threshold: this.config.similarityThreshold,
      })

      return null
    } catch (error) {
      logger.error('[SemanticCache] Error getting cache:', error)
      return null // Fail gracefully
    }
  }

  /**
   * Store new cache entry
   */
  async set(
    query: string,
    response: string,
    model: string,
    metadata: Record<string, any> = {}
  ): Promise<void> {
    try {
      const redis = await getRedisClient()
      const queryEmbedding = await generateEmbedding(query)

      const entry: CacheEntry = {
        query,
        response,
        embedding: queryEmbedding,
        model,
        metadata,
        createdAt: Date.now(),
        hits: 0,
        lastAccessedAt: Date.now(),
      }

      const cacheKey = `semantic-cache:${model}:${this._hashQuery(query)}`
      await redis.setEx(cacheKey, this.config.ttl, JSON.stringify(entry))

      logger.debug('[SemanticCache] Cached response', {
        query: query.substring(0, 100),
        model,
      })

      // Enforce max entries limit
      await this._enforceMaxEntries(model)
    } catch (error) {
      logger.error('[SemanticCache] Error setting cache:', error)
    }
  }

  /**
   * Clear all cache entries
   */
  async clear(model?: string): Promise<void> {
    try {
      const redis = await getRedisClient()
      const pattern = model ? `semantic-cache:${model}:*` : 'semantic-cache:*'
      const keys = await redis.keys(pattern)

      if (keys.length > 0) {
        await redis.del(keys)
        logger.info('[SemanticCache] Cleared cache', { model, count: keys.length })
      }
    } catch (error) {
      logger.error('[SemanticCache] Error clearing cache:', error)
    }
  }

  /**
   * Get cache statistics
   */
  async getStats(model?: string): Promise<{
    totalEntries: number
    totalHits: number
    avgHitsPerEntry: number
    oldestEntry: number | null
    newestEntry: number | null
  }> {
    try {
      const redis = await getRedisClient()
      const pattern = model ? `semantic-cache:${model}:*` : 'semantic-cache:*'
      const keys = await redis.keys(pattern)

      let totalHits = 0
      let oldestEntry: number | null = null
      let newestEntry: number | null = null

      for (const key of keys) {
        const entryJson = await redis.get(key)
        if (!entryJson) continue

        const entry: CacheEntry = JSON.parse(entryJson)
        totalHits += entry.hits

        if (oldestEntry === null || entry.createdAt < oldestEntry) {
          oldestEntry = entry.createdAt
        }

        if (newestEntry === null || entry.createdAt > newestEntry) {
          newestEntry = entry.createdAt
        }
      }

      return {
        totalEntries: keys.length,
        totalHits,
        avgHitsPerEntry: keys.length > 0 ? totalHits / keys.length : 0,
        oldestEntry,
        newestEntry,
      }
    } catch (error) {
      logger.error('[SemanticCache] Error getting stats:', error)
      return {
        totalEntries: 0,
        totalHits: 0,
        avgHitsPerEntry: 0,
        oldestEntry: null,
        newestEntry: null,
      }
    }
  }

  /**
   * Enforce max entries limit by evicting least recently used
   */
  private async _enforceMaxEntries(model: string): Promise<void> {
    try {
      const redis = await getRedisClient()
      const pattern = `semantic-cache:${model}:*`
      const keys = await redis.keys(pattern)

      if (keys.length <= this.config.maxEntries) {
        return
      }

      // Get all entries with last accessed time
      const entries: Array<{ key: string; lastAccessedAt: number }> = []

      for (const key of keys) {
        const entryJson = await redis.get(key)
        if (!entryJson) continue

        const entry: CacheEntry = JSON.parse(entryJson)
        entries.push({ key, lastAccessedAt: entry.lastAccessedAt })
      }

      // Sort by last accessed (oldest first)
      entries.sort((a, b) => a.lastAccessedAt - b.lastAccessedAt)

      // Delete oldest entries
      const toDelete = entries.slice(0, entries.length - this.config.maxEntries)
      if (toDelete.length > 0) {
        await redis.del(toDelete.map((e) => e.key))
        logger.info('[SemanticCache] Evicted old entries', {
          model,
          count: toDelete.length,
        })
      }
    } catch (error) {
      logger.error('[SemanticCache] Error enforcing max entries:', error)
    }
  }

  /**
   * Track cost savings from cache hits
   */
  private async _trackCostSavings(
    model: string,
    query: string,
    response: string
  ): Promise<void> {
    try {
      const redis = await getRedisClient()

      // Estimate cost based on tokens (rough estimation)
      const inputTokens = Math.ceil(query.length / 4)
      const outputTokens = Math.ceil(response.length / 4)

      // Cost per 1K tokens (approximate)
      const costs: Record<string, { input: number; output: number }> = {
        'gpt-4o': { input: 0.0025, output: 0.01 },
        'gpt-4o-mini': { input: 0.00015, output: 0.0006 },
        'gpt-3.5-turbo': { input: 0.0005, output: 0.0015 },
      }

      const modelCost = costs[model] || costs['gpt-4o-mini']
      const savedCost =
        (inputTokens / 1000) * modelCost.input + (outputTokens / 1000) * modelCost.output

      // Increment total savings
      await redis.incrByFloat('semantic-cache:cost-savings', savedCost)

      logger.debug('[SemanticCache] Cost savings tracked', {
        model,
        savedCost: savedCost.toFixed(4),
      })
    } catch (error) {
      logger.error('[SemanticCache] Error tracking cost savings:', error)
    }
  }

  /**
   * Get total cost savings
   */
  async getCostSavings(): Promise<number> {
    try {
      const redis = await getRedisClient()
      const savings = await redis.get('semantic-cache:cost-savings')
      return savings ? parseFloat(savings) : 0
    } catch (error) {
      logger.error('[SemanticCache] Error getting cost savings:', error)
      return 0
    }
  }

  /**
   * Simple hash for query key
   */
  private _hashQuery(query: string): string {
    let hash = 0
    for (let i = 0; i < query.length; i++) {
      const char = query.charCodeAt(i)
      hash = (hash << 5) - hash + char
      hash = hash & hash
    }
    return Math.abs(hash).toString(36)
  }
}

// ============================================================================
// DEFAULT INSTANCE
// ============================================================================

export const semanticCache = new SemanticCache()

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Wrapper for OpenAI chat completion with semantic caching
 */
export async function cachedChatCompletion(
  messages: Array<{ role: string; content: string }>,
  model: string = 'gpt-4o-mini',
  options: {
    temperature?: number
    maxTokens?: number
    useCache?: boolean
  } = {}
): Promise<string> {
  const { temperature = 0.7, maxTokens = 1000, useCache = true } = options

  // Create cache key from messages
  const queryKey = messages.map((m) => `${m.role}:${m.content}`).join('\n')

  // Check cache first
  if (useCache) {
    const cached = await semanticCache.get(queryKey, model)
    if (cached) {
      return cached
    }
  }

  // Make actual API call
  const openaiApiKey = process.env.OPENAI_API_KEY
  if (!openaiApiKey) {
    throw new Error('OpenAI API key not configured')
  }

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${openaiApiKey}`,
    },
    body: JSON.stringify({
      model,
      messages,
      temperature,
      max_tokens: maxTokens,
    }),
  })

  if (!response.ok) {
    throw new Error(`OpenAI API failed: ${response.statusText}`)
  }

  const data = await response.json()
  const completion = data.choices[0].message.content

  // Cache the response
  if (useCache) {
    await semanticCache.set(queryKey, completion, model, {
      temperature,
      maxTokens,
      timestamp: Date.now(),
    })
  }

  return completion
}
