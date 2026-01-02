/**
 * Lead Statistics API Route
 * Returns aggregated statistics for the dashboard
 */

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/options'
import { createClient } from '@/lib/supabase/server'
import { getLeadStatistics } from '@/lib/leads/lead-database'
import { createLogger } from '@/lib/logger'

const logger = createLogger('api:admin:leads:stats')

// Cache stats for 5 minutes (300 seconds)
export const revalidate = 300

export async function GET(request: NextRequest) {
  try {
    logger.info('Fetching lead statistics')

    // Check authentication using next-auth
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      logger.warn('Lead stats fetch failed - unauthorized')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check admin/lawyer role
    const userRole = session.user.role
    if (userRole !== 'admin' && userRole !== 'lawyer') {
      logger.warn('Lead stats fetch failed - insufficient permissions', { userId: session.user.id, role: userRole })
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    logger.info('Computing lead statistics', { userId: session.user.id })

    const supabase = await createClient()

    // Get real statistics from database
    const dbStats = await getLeadStatistics()

    // Calculate additional metrics
    const { data: leadsData } = await supabase
      .from('leads')
      .select('score_total, estimated_value')

    const avgScore =
      leadsData && leadsData.length > 0
        ? Math.round(
            leadsData.reduce((sum, lead) => sum + lead.score_total, 0) /
              leadsData.length
          )
        : 0

    const totalValue =
      leadsData && leadsData.length > 0
        ? leadsData.reduce(
            (sum, lead) => sum + (lead.estimated_value || 0),
            0
          )
        : 0

    const stats = {
      total: dbStats.totalLeads,
      hot: dbStats.hotLeads,
      warm: dbStats.warmLeads,
      cold: dbStats.coldLeads,
      converted: dbStats.convertedLeads,
      totalValue,
      conversionRate: dbStats.conversionRate,
      avgScore,
    }

    logger.info('Lead statistics computed successfully', { userId: session.user.id, total: stats.total, status: 200 })

    return NextResponse.json(stats)
  } catch (error) {
    logger.error('Lead statistics fetch failed', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
