/**
 * Lead Statistics API Route
 * Returns aggregated statistics for the dashboard
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getLeadStatistics } from '@/lib/leads/lead-database'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()

    // Check authentication
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check admin/lawyer role
    const userRole = user.user_metadata?.role
    if (userRole !== 'admin' && userRole !== 'lawyer') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

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

    return NextResponse.json(stats)
  } catch (error: any) {
    console.error('[API /admin/leads/stats] Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
