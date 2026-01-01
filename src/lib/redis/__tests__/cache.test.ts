// Redis Cache Helpers - Unit Tests
// Garcez Palha - MANUS v7.0 (29/12/2025)

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { getCached, setCache, getCache, invalidateCache, TTL_STRATEGY } from '../cache'
import { getRedisClient } from '../client'

// Mock Redis client
vi.mock('../client', () => ({
  getRedisClient: vi.fn(),
}))

describe('Redis Cache Helpers', () => {
  let mockRedis: any

  beforeEach(() => {
    // Reset mocks
    mockRedis = {
      status: 'ready',
      get: vi.fn(),
      setex: vi.fn().mockResolvedValue('OK'),
      del: vi.fn().mockResolvedValue(1),
      keys: vi.fn().mockResolvedValue([]),
      flushdb: vi.fn().mockResolvedValue('OK'),
    }

    ;(getRedisClient as any).mockReturnValue(mockRedis)
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  describe('getCached', () => {
    it('should return cached data on cache hit', async () => {
      const cachedData = { id: 1, name: 'Test' }
      mockRedis.get.mockResolvedValue(JSON.stringify(cachedData))

      const fallback = vi.fn()
      const result = await getCached('test:key', fallback, { ttl: 60 })

      expect(result).toEqual(cachedData)
      expect(mockRedis.get).toHaveBeenCalledWith('test:key')
      expect(fallback).not.toHaveBeenCalled()
    })

    it('should fetch from fallback on cache miss', async () => {
      mockRedis.get.mockResolvedValue(null)

      const fallbackData = { id: 2, name: 'Fallback' }
      const fallback = vi.fn().mockResolvedValue(fallbackData)

      const result = await getCached('test:key', fallback, { ttl: 60 })

      expect(result).toEqual(fallbackData)
      expect(mockRedis.get).toHaveBeenCalledWith('test:key')
      expect(fallback).toHaveBeenCalled()
      expect(mockRedis.setex).toHaveBeenCalledWith(
        'test:key',
        60,
        JSON.stringify(fallbackData)
      )
    })

    it('should use default TTL when not provided', async () => {
      mockRedis.get.mockResolvedValue(null)

      const fallbackData = { test: 'data' }
      const fallback = vi.fn().mockResolvedValue(fallbackData)

      await getCached('test:key', fallback)

      expect(mockRedis.setex).toHaveBeenCalledWith(
        'test:key',
        3600, // Default TTL
        JSON.stringify(fallbackData)
      )
    })

    it('should add prefix when provided', async () => {
      mockRedis.get.mockResolvedValue(null)

      const fallback = vi.fn().mockResolvedValue({ test: 'data' })

      await getCached('key', fallback, { prefix: 'product' })

      expect(mockRedis.get).toHaveBeenCalledWith('product:key')
    })

    it('should fallback to source on Redis error', async () => {
      mockRedis.get.mockRejectedValue(new Error('Redis error'))

      const fallbackData = { id: 3, name: 'Error fallback' }
      const fallback = vi.fn().mockResolvedValue(fallbackData)

      const result = await getCached('test:key', fallback)

      expect(result).toEqual(fallbackData)
      expect(fallback).toHaveBeenCalled()
    })

    it('should fallback to source when Redis not ready', async () => {
      mockRedis.status = 'disconnected'

      const fallbackData = { id: 4, name: 'Not ready fallback' }
      const fallback = vi.fn().mockResolvedValue(fallbackData)

      const result = await getCached('test:key', fallback)

      expect(result).toEqual(fallbackData)
      expect(mockRedis.get).not.toHaveBeenCalled()
    })
  })

  describe('setCache', () => {
    it('should set value in cache with TTL', async () => {
      const data = { id: 1, value: 'test' }

      await setCache('test:key', data, 300)

      expect(mockRedis.setex).toHaveBeenCalledWith(
        'test:key',
        300,
        JSON.stringify(data)
      )
    })

    it('should use default TTL when not provided', async () => {
      const data = { id: 1 }

      await setCache('test:key', data)

      expect(mockRedis.setex).toHaveBeenCalledWith(
        'test:key',
        3600,
        JSON.stringify(data)
      )
    })

    it('should handle Redis errors gracefully', async () => {
      mockRedis.setex.mockRejectedValue(new Error('Set failed'))

      // Should not throw
      await expect(setCache('test:key', { data: 'test' })).resolves.toBeUndefined()
    })
  })

  describe('getCache', () => {
    it('should return parsed data from cache', async () => {
      const data = { id: 1, name: 'Test' }
      mockRedis.get.mockResolvedValue(JSON.stringify(data))

      const result = await getCache('test:key')

      expect(result).toEqual(data)
      expect(mockRedis.get).toHaveBeenCalledWith('test:key')
    })

    it('should return null on cache miss', async () => {
      mockRedis.get.mockResolvedValue(null)

      const result = await getCache('test:key')

      expect(result).toBeNull()
    })

    it('should return null when Redis not ready', async () => {
      mockRedis.status = 'disconnected'

      const result = await getCache('test:key')

      expect(result).toBeNull()
      expect(mockRedis.get).not.toHaveBeenCalled()
    })

    it('should handle Redis errors and return null', async () => {
      mockRedis.get.mockRejectedValue(new Error('Get failed'))

      const result = await getCache('test:key')

      expect(result).toBeNull()
    })
  })

  describe('invalidateCache', () => {
    it('should delete cache key', async () => {
      await invalidateCache('test:key')

      expect(mockRedis.del).toHaveBeenCalledWith('test:key')
    })

    it('should handle Redis errors gracefully', async () => {
      mockRedis.del.mockRejectedValue(new Error('Delete failed'))

      // Should not throw
      await expect(invalidateCache('test:key')).resolves.toBeUndefined()
    })

    it('should not attempt delete when Redis not ready', async () => {
      mockRedis.status = 'disconnected'

      await invalidateCache('test:key')

      expect(mockRedis.del).not.toHaveBeenCalled()
    })
  })

  describe('TTL_STRATEGY', () => {
    it('should have correct TTL values', () => {
      expect(TTL_STRATEGY.products).toBe(3600) // 1 hour
      expect(TTL_STRATEGY.agents).toBe(86400) // 24 hours
      expect(TTL_STRATEGY.conversations).toBe(300) // 5 minutes
      expect(TTL_STRATEGY.sessions).toBe(1800) // 30 minutes
    })
  })
})
