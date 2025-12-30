// Redis Client Singleton
// Garcez Palha - Redis Cache Strategy Phase 1
// MANUS v7.0 (29/12/2025)

import { Redis } from 'ioredis'

// Singleton pattern
let redis: Redis | null = null

export function getRedisClient(): Redis {
  if (!redis) {
    // Support REDIS_URL (Railway, Upstash) or individual vars (Docker)
    if (process.env.REDIS_URL) {
      redis = new Redis(process.env.REDIS_URL, {
        retryStrategy: (times) => {
          const delay = Math.min(times * 50, 2000)
          return delay
        },
        reconnectOnError: (err) => {
          const targetError = 'READONLY'
          if (err.message.includes(targetError)) {
            return true // Reconnect on READONLY error
          }
          return false
        },
        lazyConnect: process.env.NODE_ENV === 'development',
        // Railway uses self-signed certificates
        tls: process.env.REDIS_URL.startsWith('rediss://') ? {
          rejectUnauthorized: false
        } : undefined
      })
    } else {
      redis = new Redis({
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT || '6379'),
        password: process.env.REDIS_PASSWORD,
        db: 0,
        retryStrategy: (times) => {
          const delay = Math.min(times * 50, 2000)
          return delay
        },
        reconnectOnError: (err) => {
          const targetError = 'READONLY'
          if (err.message.includes(targetError)) {
            return true // Reconnect on READONLY error
          }
          return false
        },
        // Disable in development if Redis not available
        lazyConnect: process.env.NODE_ENV === 'development',
      })
    }

    redis.on('connect', () => {
      console.log('✅ Redis connected')
    })

    redis.on('error', (err) => {
      console.error('❌ Redis error:', err)
    })

    redis.on('reconnecting', () => {
      console.log('🔄 Redis reconnecting...')
    })
  }

  return redis
}

// Graceful shutdown
if (typeof process !== 'undefined') {
  process.on('SIGTERM', async () => {
    if (redis) {
      await redis.quit()
      console.log('👋 Redis connection closed')
    }
  })

  process.on('SIGINT', async () => {
    if (redis) {
      await redis.quit()
      console.log('👋 Redis connection closed')
    }
  })
}

export default getRedisClient
