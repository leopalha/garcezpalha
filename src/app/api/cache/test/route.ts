// Redis Cache Test API Route
// Test cache functionality
// MANUS v7.0 (29/12/2025)

import { NextRequest, NextResponse } from 'next/server'
import { getCached, REDIS_KEYS, TTL_STRATEGY } from '@/lib/redis'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const testType = searchParams.get('type') || 'basic'

  try {
    switch (testType) {
      case 'basic':
        return await testBasicCache()

      case 'miss':
        return await testCacheMiss()

      case 'performance':
        return await testPerformance()

      default:
        return NextResponse.json(
          {
            error: 'Invalid test type',
            available: ['basic', 'miss', 'performance'],
          },
          { status: 400 }
        )
    }
  } catch (error) {
    return NextResponse.json(
      {
        error: 'Test failed',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

async function testBasicCache() {
  const start = Date.now()

  const data = await getCached(
    'test:basic',
    async () => {
      // Simulate slow database query
      await new Promise((resolve) => setTimeout(resolve, 100))
      return {
        message: 'Hello from Redis Cache!',
        timestamp: Date.now(),
        source: 'database',
      }
    },
    { ttl: 60 }
  )

  const duration = Date.now() - start

  return NextResponse.json({
    success: true,
    data,
    meta: {
      duration: `${duration}ms`,
      cached: duration < 50, // If < 50ms, likely from cache
      testType: 'basic',
    },
  })
}

async function testCacheMiss() {
  const key = `test:miss:${Date.now()}`

  const start = Date.now()

  const data = await getCached(
    key,
    async () => {
      await new Promise((resolve) => setTimeout(resolve, 100))
      return {
        message: 'Cache miss - fetched from source',
        key,
      }
    },
    { ttl: 10 }
  )

  const duration = Date.now() - start

  return NextResponse.json({
    success: true,
    data,
    meta: {
      duration: `${duration}ms`,
      expectedCacheMiss: true,
      testType: 'miss',
    },
  })
}

async function testPerformance() {
  const results = []

  // First call - should hit database
  const start1 = Date.now()
  await getCached(
    'test:performance',
    async () => {
      await new Promise((resolve) => setTimeout(resolve, 100))
      return { iteration: 1 }
    },
    { ttl: 60 }
  )
  const duration1 = Date.now() - start1

  // Second call - should hit cache
  const start2 = Date.now()
  await getCached(
    'test:performance',
    async () => {
      await new Promise((resolve) => setTimeout(resolve, 100))
      return { iteration: 2 }
    },
    { ttl: 60 }
  )
  const duration2 = Date.now() - start2

  // Third call - should hit cache
  const start3 = Date.now()
  await getCached(
    'test:performance',
    async () => {
      await new Promise((resolve) => setTimeout(resolve, 100))
      return { iteration: 3 }
    },
    { ttl: 60 }
  )
  const duration3 = Date.now() - start3

  const improvement = Math.round(((duration1 - duration2) / duration1) * 100)

  return NextResponse.json({
    success: true,
    results: {
      firstCall: `${duration1}ms (cache miss)`,
      secondCall: `${duration2}ms (cache hit)`,
      thirdCall: `${duration3}ms (cache hit)`,
      improvement: `${improvement}% faster`,
    },
    meta: {
      testType: 'performance',
      redisWorking: duration2 < duration1 && duration3 < duration1,
    },
  })
}
