/**
 * GET /api/monitoring/health
 * Health check endpoint with monitoring stats
 */

import { NextRequest, NextResponse } from 'next/server'
import { getSystemHealth } from '@/lib/monitoring'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const health = getSystemHealth()

    return NextResponse.json({
      ...health,
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      version: process.env.npm_package_version || '1.0.0',
    })
  } catch (error) {
    return NextResponse.json(
      {
        status: 'error',
        message: 'Health check failed',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    )
  }
}
