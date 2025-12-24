import { NextRequest, NextResponse } from 'next/server'
import { LRUCache } from 'lru-cache'

type Options = {
  uniqueTokenPerInterval?: number
  interval?: number
}

export class RateLimiter {
  private tokenCache: LRUCache<string, number[]>
  private interval: number

  constructor(options?: Options) {
    this.interval = options?.interval || 60000 // 1 minute default
    this.tokenCache = new LRUCache({
      max: options?.uniqueTokenPerInterval || 500,
      ttl: this.interval,
    })
  }

  check(limit: number, token: string): { success: boolean; remaining: number; reset: number } {
    const now = Date.now()
    const tokenCount = this.tokenCache.get(token) || []
    const currentUsage = tokenCount.filter((timestamp) => now - timestamp < this.interval)

    if (currentUsage.length >= limit) {
      const oldestRequest = Math.min(...currentUsage)
      const resetTime = oldestRequest + this.interval

      return {
        success: false,
        remaining: 0,
        reset: Math.ceil((resetTime - now) / 1000),
      }
    }

    currentUsage.push(now)
    this.tokenCache.set(token, currentUsage)

    return {
      success: true,
      remaining: limit - currentUsage.length,
      reset: Math.ceil(this.interval / 1000),
    }
  }
}

// Create rate limiters for different purposes
export const rateLimiters = {
  api: new RateLimiter({ uniqueTokenPerInterval: 500, interval: 60000 }), // 60 req/min
  auth: new RateLimiter({ uniqueTokenPerInterval: 500, interval: 900000 }), // 15 min window
  contact: new RateLimiter({ uniqueTokenPerInterval: 500, interval: 3600000 }), // 1 hour window
  chat: new RateLimiter({ uniqueTokenPerInterval: 500, interval: 60000 }), // 60 sec window
}

// Get client identifier from request
function getClientId(request: NextRequest): string {
  // Try to get the real IP from various headers
  const forwardedFor = request.headers.get('x-forwarded-for')
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim()
  }

  const realIp = request.headers.get('x-real-ip')
  if (realIp) {
    return realIp
  }

  // Fallback to a combination of headers for fingerprinting
  const userAgent = request.headers.get('user-agent') || 'unknown'
  const acceptLanguage = request.headers.get('accept-language') || 'unknown'

  // Create a simple hash
  const fingerprint = `${userAgent}-${acceptLanguage}`
  let hash = 0
  for (let i = 0; i < fingerprint.length; i++) {
    const char = fingerprint.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash = hash & hash
  }

  return `fp-${hash.toString(36)}`
}

// Rate limit middleware for API routes
export function withRateLimit(
  handler: (request: NextRequest) => Promise<NextResponse>,
  options: {
    type?: 'api' | 'auth' | 'contact' | 'chat'
    limit?: number
  } = {}
) {
  const limiterType = options.type || 'api'
  const limiter = rateLimiters[limiterType]
  const limit = options.limit || getDefaultLimit(limiterType)

  return async (request: NextRequest) => {
    const clientId = getClientId(request)
    const { success, remaining, reset } = limiter.check(limit, clientId)

    if (!success) {
      return NextResponse.json(
        {
          error: 'Too many requests',
          message: `Rate limit exceeded. Try again in ${reset} seconds.`,
          retryAfter: reset,
        },
        {
          status: 429,
          headers: {
            'X-RateLimit-Limit': limit.toString(),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': reset.toString(),
            'Retry-After': reset.toString(),
          },
        }
      )
    }

    const response = await handler(request)

    // Add rate limit headers to successful responses
    response.headers.set('X-RateLimit-Limit', limit.toString())
    response.headers.set('X-RateLimit-Remaining', remaining.toString())
    response.headers.set('X-RateLimit-Reset', reset.toString())

    return response
  }
}

function getDefaultLimit(type: string): number {
  switch (type) {
    case 'api':
      return 60 // 60 requests per minute
    case 'auth':
      return 5 // 5 login attempts per 15 minutes
    case 'contact':
      return 3 // 3 contact form submissions per hour
    case 'chat':
      return 20 // 20 chat messages per minute
    default:
      return 60
  }
}

// Simple rate limit check for use in API routes
export function checkRateLimit(
  request: NextRequest,
  type: 'api' | 'auth' | 'contact' | 'chat' = 'api',
  customLimit?: number
): {
  success: boolean
  remaining: number
  reset: number
  headers: Record<string, string>
} {
  const limiter = rateLimiters[type]
  const limit = customLimit || getDefaultLimit(type)
  const clientId = getClientId(request)
  const result = limiter.check(limit, clientId)

  return {
    ...result,
    headers: {
      'X-RateLimit-Limit': limit.toString(),
      'X-RateLimit-Remaining': result.remaining.toString(),
      'X-RateLimit-Reset': result.reset.toString(),
    },
  }
}
