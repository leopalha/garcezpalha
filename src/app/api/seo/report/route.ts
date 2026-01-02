/**
 * SEO Reporting API
 * Generate monthly SEO performance reports
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { createSEOAgent } from '@/lib/ai/agents/marketing/seo-agent'
import { logger } from '@/lib/logger'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

interface MonthlyReportRequest {
  month: string
  year: number
  organicSessions: number
  previousMonthSessions: number
  rankings: {
    tracked: number
    top3: number
    top10: number
    improved: number
    declined: number
  }
  backlinks: {
    new: number
    lost: number
    totalRDs: number
    da: number
  }
  leads: {
    current: number
    previous: number
  }
  activities: Array<{ activity: string; result: string }>
}

// POST - Generate monthly report
export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as MonthlyReportRequest

    const {
      month,
      year,
      organicSessions,
      previousMonthSessions,
      rankings,
      backlinks,
      leads,
      activities,
    } = body

    if (!month || !year || !organicSessions) {
      return NextResponse.json(
        { error: 'month, year, and organicSessions are required' },
        { status: 400 }
      )
    }

    const seoAgent = createSEOAgent()

    const report = await seoAgent.generateMonthlyReport({
      month,
      year,
      organicSessions,
      previousMonthSessions: previousMonthSessions || 0,
      rankings: rankings || {
        tracked: 0,
        top3: 0,
        top10: 0,
        improved: 0,
        declined: 0,
      },
      backlinks: backlinks || {
        new: 0,
        lost: 0,
        totalRDs: 0,
        da: 0,
      },
      leads: leads || {
        current: 0,
        previous: 0,
      },
      activities: activities || [],
    })

    // Save report
    const { data: savedReport, error: saveError } = await supabase
      .from('seo_reports')
      .insert({
        report_type: 'monthly',
        period_month: month,
        period_year: year,
        summary: report.executiveSummary,
        organic_sessions: report.trafficOverview.organicSessions,
        session_change: report.trafficOverview.changePercent,
        keywords_top3: report.rankings.top3,
        keywords_top10: report.rankings.top10,
        organic_leads: report.conversions.organicLeads,
        domain_authority: report.backlinks.domainAuthority,
        report_data: report,
        created_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (saveError) {
      logger.error('Error saving report:', saveError)
      return NextResponse.json({
        success: true,
        report,
        saved: false,
      })
    }

    return NextResponse.json({
      success: true,
      report,
      saved: true,
      reportId: savedReport.id,
    })

  } catch (error) {
    logger.error('Report generation error:', error)
    return NextResponse.json(
      { error: 'Failed to generate report', details: (error as Error).message },
      { status: 500 }
    )
  }
}

// GET - Get saved reports
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const year = searchParams.get('year')
    const limit = parseInt(searchParams.get('limit') || '12')
    const offset = parseInt(searchParams.get('offset') || '0')

    let query = supabase
      .from('seo_reports')
      .select('*', { count: 'exact' })
      .order('period_year', { ascending: false })
      .order('period_month', { ascending: false })
      .range(offset, offset + limit - 1)

    if (year) {
      query = query.eq('period_year', parseInt(year))
    }

    const { data, error, count } = await query

    if (error) {
      return NextResponse.json(
        { error: 'Failed to fetch reports', details: error instanceof Error ? error.message : String(error) },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data,
      pagination: {
        total: count,
        limit,
        offset,
        hasMore: (count || 0) > offset + limit,
      },
    })

  } catch (error) {
    logger.error('Report fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch reports', details: (error as Error).message },
      { status: 500 }
    )
  }
}
