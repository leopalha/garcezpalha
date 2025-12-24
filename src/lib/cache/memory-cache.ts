/**
 * In-Memory Cache with TTL
 *
 * Lightweight caching solution for frequently accessed data
 * Automatically cleans up expired entries
 */

interface CacheEntry<T> {
  value: T
  expiresAt: number
}

class MemoryCache {
  private cache: Map<string, CacheEntry<unknown>> = new Map()
  private cleanupInterval: NodeJS.Timeout | null = null

  constructor() {
    // Start cleanup interval (every 5 minutes)
    if (typeof setInterval !== 'undefined') {
      this.cleanupInterval = setInterval(() => {
        this.cleanup()
      }, 5 * 60 * 1000)
    }
  }

  /**
   * Get value from cache
   */
  get<T>(key: string): T | null {
    const entry = this.cache.get(key)

    if (!entry) {
      return null
    }

    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key)
      return null
    }

    return entry.value as T
  }

  /**
   * Set value in cache with TTL (in seconds)
   */
  set<T>(key: string, value: T, ttlSeconds: number = 300): void {
    this.cache.set(key, {
      value,
      expiresAt: Date.now() + ttlSeconds * 1000,
    })
  }

  /**
   * Check if key exists and is not expired
   */
  has(key: string): boolean {
    const entry = this.cache.get(key)
    if (!entry) return false
    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key)
      return false
    }
    return true
  }

  /**
   * Delete a key from cache
   */
  delete(key: string): boolean {
    return this.cache.delete(key)
  }

  /**
   * Delete all keys matching a prefix
   */
  deleteByPrefix(prefix: string): number {
    let deleted = 0
    for (const key of this.cache.keys()) {
      if (key.startsWith(prefix)) {
        this.cache.delete(key)
        deleted++
      }
    }
    return deleted
  }

  /**
   * Clear all cache entries
   */
  clear(): void {
    this.cache.clear()
  }

  /**
   * Get cache stats
   */
  stats(): { size: number; keys: string[] } {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys()),
    }
  }

  /**
   * Get or set with factory function
   */
  async getOrSet<T>(
    key: string,
    factory: () => Promise<T>,
    ttlSeconds: number = 300
  ): Promise<T> {
    const cached = this.get<T>(key)
    if (cached !== null) {
      return cached
    }

    const value = await factory()
    this.set(key, value, ttlSeconds)
    return value
  }

  /**
   * Cleanup expired entries
   */
  private cleanup(): void {
    const now = Date.now()
    for (const [key, entry] of this.cache.entries()) {
      if (now > entry.expiresAt) {
        this.cache.delete(key)
      }
    }
  }

  /**
   * Stop cleanup interval
   */
  destroy(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval)
      this.cleanupInterval = null
    }
    this.cache.clear()
  }
}

// Singleton instance
export const memoryCache = new MemoryCache()

/**
 * Cache key generators for consistent naming
 */
export const cacheKeys = {
  lead: (id: string) => `lead:${id}`,
  leadsList: (userId: string, page: number) => `leads:${userId}:page${page}`,
  client: (id: string) => `client:${id}`,
  clientsList: (userId: string) => `clients:${userId}`,
  proposal: (leadId: string) => `proposal:${leadId}`,
  dashboard: (userId: string) => `dashboard:${userId}`,
  metrics: (period: string) => `metrics:${period}`,
  product: (id: string) => `product:${id}`,
  productsList: () => 'products:all',
}

/**
 * Default TTL values (in seconds)
 */
export const cacheTTL = {
  SHORT: 60,        // 1 minute
  MEDIUM: 300,      // 5 minutes
  LONG: 900,        // 15 minutes
  HOUR: 3600,       // 1 hour
  DAY: 86400,       // 24 hours
}

/**
 * Decorator for caching async function results
 */
export function cached<T>(
  keyGenerator: (...args: any[]) => string,
  ttlSeconds: number = cacheTTL.MEDIUM
) {
  return function (
    _target: any,
    _propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value

    descriptor.value = async function (...args: any[]) {
      const key = keyGenerator(...args)
      const cached = memoryCache.get<T>(key)

      if (cached !== null) {
        return cached
      }

      const result = await originalMethod.apply(this, args)
      memoryCache.set(key, result, ttlSeconds)
      return result
    }

    return descriptor
  }
}
