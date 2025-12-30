// Redis Cache Helpers
// Garcez Palha - Cache-Aside Pattern
// MANUS v7.0 (29/12/2025)

import { getRedisClient } from './client'

interface CacheOptions {
  ttl?: number // Time to live in seconds
  prefix?: string
}

/**
 * Generic cache-aside pattern implementation
 * 1. Try cache first
 * 2. On miss, fetch from source
 * 3. Store in cache for future requests
 */
export async function getCached<T>(
  key: string,
  fallback: () => Promise<T>,
  options: CacheOptions = {}
): Promise<T> {
  const { ttl = 3600, prefix = '' } = options
  const fullKey = prefix ? `${prefix}:${key}` : key

  try {
    const redis = getRedisClient()

    // Check if connected
    if (redis.status !== 'ready') {
      console.warn('[Redis] Not connected, falling back to source')
      return await fallback()
    }

    // 1. Try cache first
    const cached = await redis.get(fullKey)

    if (cached) {
      console.log(`✅ Cache HIT: ${fullKey}`)
      return JSON.parse(cached) as T
    }

    console.log(`❌ Cache MISS: ${fullKey}`)

    // 2. Fallback to source
    const data = await fallback()

    // 3. Store in cache (fire and forget)
    redis
      .setex(fullKey, ttl, JSON.stringify(data))
      .catch((err) => console.error('[Redis] Cache write failed:', err))

    return data
  } catch (error) {
    console.error('[Redis] Cache error, fallback to source:', error)
    // Always fallback to source on any Redis error
    return await fallback()
  }
}

/**
 * Set value in cache with TTL
 */
export async function setCache<T>(
  key: string,
  value: T,
  ttl: number = 3600
): Promise<void> {
  try {
    const redis = getRedisClient()

    if (redis.status === 'ready') {
      await redis.setex(key, ttl, JSON.stringify(value))
    }
  } catch (error) {
    console.error('[Redis] Set cache failed:', error)
  }
}

/**
 * Get value from cache
 */
export async function getCache<T>(key: string): Promise<T | null> {
  try {
    const redis = getRedisClient()

    if (redis.status !== 'ready') {
      return null
    }

    const cached = await redis.get(key)

    if (!cached) return null

    return JSON.parse(cached) as T
  } catch (error) {
    console.error('[Redis] Get cache failed:', error)
    return null
  }
}

/**
 * Invalidate single cache key
 */
export async function invalidateCache(key: string): Promise<void> {
  try {
    const redis = getRedisClient()

    if (redis.status === 'ready') {
      await redis.del(key)
      console.log(`🗑️  Cache invalidated: ${key}`)
    }
  } catch (error) {
    console.error('[Redis] Invalidate cache failed:', error)
  }
}

/**
 * Invalidate cache by pattern
 * WARNING: Use sparingly, can be slow on large datasets
 */
export async function invalidateCachePattern(pattern: string): Promise<void> {
  try {
    const redis = getRedisClient()

    if (redis.status !== 'ready') {
      return
    }

    // Get all keys matching pattern
    const keys = await redis.keys(pattern)

    if (keys.length > 0) {
      await redis.del(...keys)
      console.log(`🗑️  Cache pattern invalidated: ${pattern} (${keys.length} keys)`)
    }
  } catch (error) {
    console.error('[Redis] Invalidate pattern failed:', error)
  }
}

/**
 * Clear all cache (use with caution!)
 */
export async function clearAllCache(): Promise<void> {
  try {
    const redis = getRedisClient()

    if (redis.status === 'ready') {
      await redis.flushdb()
      console.log('🗑️  All cache cleared')
    }
  } catch (error) {
    console.error('[Redis] Clear all cache failed:', error)
  }
}

// TTL Strategy (in seconds)
export const TTL_STRATEGY = {
  products: 3600, // 1 hour (changes rarely)
  agents: 86400, // 24 hours (static)
  conversations: 300, // 5 minutes (active data)
  leads: 600, // 10 minutes (moderate)
  sessions: 1800, // 30 minutes (security)
  analytics: 600, // 10 minutes
  static: 86400, // 24 hours
  dynamic: 300, // 5 minutes
} as const

export default getCached
