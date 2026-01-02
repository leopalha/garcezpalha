/**
 * Advanced Analytics API
 *
 * Provides business metrics endpoints for dashboard
 */

import { NextRequest, NextResponse } from 'next/server'
import { advancedMetrics } from '@/lib/analytics/advanced-metrics'
import { logger } from '@/lib/logger'

export const dynamic = 'force-dynamic'

/**
 * GET /api/analytics/advanced
 *
 * Query params:
 * - period: '7d' | '30d' | '90d' (default: '30d')
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const period = searchParams.get('period') || '30d'

    // Calculate date range
    const endDate = new Date()
    const startDate = new Date()

    switch (period) {
      case '7d':
        startDate.setDate(startDate.getDate() - 7)
        break
      case '90d':
        startDate.setDate(startDate.getDate() - 90)
        break
      case '30d':
      default:
        startDate.setDate(startDate.getDate() - 30)
        break
    }

    // Calculate all metrics
    const [metrics, partnerPerformance, funnel] = await Promise.all([
      advancedMetrics.calculateMetrics({ startDate, endDate }),
      advancedMetrics.getPartnerPerformance({ startDate, endDate }),
      advancedMetrics.getSalesFunnel({ startDate, endDate }),
    ])

    return NextResponse.json(
      {
        period,
        dateRange: {
          start: startDate.toISOString(),
          end: endDate.toISOString(),
        },
        metrics,
        partnerPerformance,
        funnel,
      },
      { status: 200 }
    )
  } catch (error) {
    logger.error('[Analytics API] Error:', error)
    return NextResponse.json(
      {
        error: 'Internal server error',
        message: error instanceof Error ? error instanceof Error ? error.message : String(error) : String(error),
      },
      { status: 500 }
    )
  }
}
