/**
 * Lead Dashboard API Route
 * Returns dashboard data including charts and activity
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import {
  getLeadStatistics,
  getConversionFunnel,
} from '@/lib/leads/lead-database'
import { ZodError } from 'zod'
import { logger } from '@/lib/logger'

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

    // Get category distribution
    const stats = await getLeadStatistics()
    const categoryDistribution = {
      hot: stats.hotLeads,
      warm: stats.warmLeads,
      cold: stats.coldLeads,
      unqualified: stats.unqualifiedLeads,
    }

    // Get conversion funnel
    const conversionFunnel = await getConversionFunnel()

    // Get recent activity from lead_interactions
    const { data: recentInteractions } = await supabase
      .from('lead_interactions')
      .select('id, type, message, created_at')
      .order('created_at', { ascending: false })
      .limit(10)

    const recentActivity =
      recentInteractions?.map((interaction) => ({
        id: interaction.id,
        type: interaction.type,
        description: interaction.message,
        timestamp: interaction.created_at,
      })) || []

    const dashboardData = {
      categoryDistribution,
      conversionFunnel,
      recentActivity,
    }

    return NextResponse.json(dashboardData)
  } catch (error) {
    // Handle Zod validation errors
    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          details: error.issues.map((err) => ({
            field: err.path.join('.'),
            message: err.message
          }))
        },
        { status: 400 }
      )
    }

    logger.error('[API /admin/leads/dashboard] Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
