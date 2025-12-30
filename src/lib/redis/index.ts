// Redis Library Main Export
// Garcez Palha - Redis Cache Strategy
// MANUS v7.0 (29/12/2025)

export { getRedisClient, default as redis } from './client'
export { getCached, setCache, getCache, invalidateCache, invalidateCachePattern, clearAllCache, TTL_STRATEGY } from './cache'
export { REDIS_KEYS } from './keys'

// Re-export types
export type { Redis } from 'ioredis'
