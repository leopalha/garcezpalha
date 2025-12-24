/**
 * Rate Limiter
 *
 * Token bucket algorithm for API rate limiting
 * Protects against abuse and ensures fair usage
 */

interface RateLimitEntry {
  tokens: number
  lastRefill: number
}

interface RateLimitConfig {
  maxTokens: number      // Max requests in window
  refillRate: number     // Tokens per second
  windowMs: number       // Window size in ms
}

class RateLimiter {
  private limits: Map<string, RateLimitEntry> = new Map()
  private config: RateLimitConfig

  constructor(config: Partial<RateLimitConfig> = {}) {
    this.config = {
      maxTokens: config.maxTokens ?? 100,
      refillRate: config.refillRate ?? 10,
      windowMs: config.windowMs ?? 60000,
    }
  }

  /**
   * Check if request should be allowed
   */
  check(key: string): { allowed: boolean; remaining: number; resetIn: number } {
    const now = Date.now()
    let entry = this.limits.get(key)

    if (!entry) {
      entry = {
        tokens: this.config.maxTokens,
        lastRefill: now,
      }
      this.limits.set(key, entry)
    }

    // Refill tokens based on time passed
    const timePassed = now - entry.lastRefill
    const tokensToAdd = Math.floor(timePassed / 1000) * this.config.refillRate
    entry.tokens = Math.min(this.config.maxTokens, entry.tokens + tokensToAdd)
    entry.lastRefill = now

    // Check if request is allowed
    if (entry.tokens > 0) {
      entry.tokens--
      return {
        allowed: true,
        remaining: entry.tokens,
        resetIn: Math.ceil((this.config.maxTokens - entry.tokens) / this.config.refillRate),
      }
    }

    return {
      allowed: false,
      remaining: 0,
      resetIn: Math.ceil(this.config.maxTokens / this.config.refillRate),
    }
  }

  /**
   * Reset rate limit for a key
   */
  reset(key: string): void {
    this.limits.delete(key)
  }

  /**
   * Get current status for a key
   */
  status(key: string): { tokens: number; maxTokens: number } | null {
    const entry = this.limits.get(key)
    if (!entry) return null
    return {
      tokens: entry.tokens,
      maxTokens: this.config.maxTokens,
    }
  }
}

// Pre-configured limiters for different use cases
export const rateLimiters = {
  // General API: 100 requests per minute
  api: new RateLimiter({ maxTokens: 100, refillRate: 2, windowMs: 60000 }),

  // Auth endpoints: 5 attempts per minute
  auth: new RateLimiter({ maxTokens: 5, refillRate: 0.1, windowMs: 60000 }),

  // Webhook endpoints: 1000 per minute (external services)
  webhook: new RateLimiter({ maxTokens: 1000, refillRate: 20, windowMs: 60000 }),

  // AI endpoints: 20 per minute (expensive operations)
  ai: new RateLimiter({ maxTokens: 20, refillRate: 0.5, windowMs: 60000 }),

  // Document uploads: 10 per minute
  upload: new RateLimiter({ maxTokens: 10, refillRate: 0.2, windowMs: 60000 }),

  // SMS/WhatsApp: 30 per minute
  messaging: new RateLimiter({ maxTokens: 30, refillRate: 0.5, windowMs: 60000 }),
}

/**
 * Rate limit key generators
 */
export const rateLimitKeys = {
  byIP: (ip: string) => `ip:${ip}`,
  byUser: (userId: string) => `user:${userId}`,
  byEndpoint: (endpoint: string, ip: string) => `endpoint:${endpoint}:${ip}`,
  byPhone: (phone: string) => `phone:${phone}`,
}

/**
 * Express/Next.js middleware helper
 */
export function checkRateLimit(
  limiter: RateLimiter,
  key: string
): {
  allowed: boolean
  headers: Record<string, string>
} {
  const result = limiter.check(key)

  return {
    allowed: result.allowed,
    headers: {
      'X-RateLimit-Remaining': result.remaining.toString(),
      'X-RateLimit-Reset': result.resetIn.toString(),
    },
  }
}

/**
 * Rate limit response for blocked requests
 */
export function rateLimitResponse() {
  return new Response(
    JSON.stringify({
      error: 'Too Many Requests',
      message: 'Rate limit exceeded. Please try again later.',
    }),
    {
      status: 429,
      headers: {
        'Content-Type': 'application/json',
        'Retry-After': '60',
      },
    }
  )
}

export { RateLimiter }
