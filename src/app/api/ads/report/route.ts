/**
 * Ads Reporting API
 * Generate AI-powered ads performance reports
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { createAdsAgent, CampaignPerformanceData } from '@/lib/ai/agents/marketing/ads-agent'
import { logger } from '@/lib/logger'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

interface WeeklyReportRequest {
  campaigns: CampaignPerformanceData[]
  previousWeek: {
    spend: number
    conversions: number
    cpl: number
  }
  actionsThisWeek?: Array<{ action: string; result: string }>
}

interface LeadQualityRequest {
  leads: Array<{
    source: string
    campaign: string
    count: number
    qualityScore: number
    convertedToClient: number
    averageValue?: number
  }>
  landingPages?: Array<{
    url: string
    bounceRate: number
    conversionRate: number
  }>
}

// POST - Generate reports
export async function POST(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const type = searchParams.get('type') || 'weekly'

    const adsAgent = createAdsAgent()

    switch (type) {
      case 'weekly': {
        const body = await request.json() as WeeklyReportRequest
        const { campaigns, previousWeek, actionsThisWeek } = body

        if (!campaigns || !previousWeek) {
          return NextResponse.json(
            { error: 'campaigns and previousWeek are required' },
            { status: 400 }
          )
        }

        const report = await adsAgent.generateWeeklyReport({
          campaigns,
          previousWeek,
          actionsThisWeek,
        })

        // Save report to database
        const { error: saveError } = await supabase
          .from('ad_reports')
          .insert({
            report_type: 'weekly',
            period_start: report.period.start,
            period_end: report.period.end,
            summary: report.executiveSummary,
            metrics: report.overallMetrics,
            report_data: report,
            created_at: new Date().toISOString(),
          })

        if (saveError) {
          logger.error('Error saving report:', saveError)
        }

        return NextResponse.json({
          success: true,
          report,
        })
      }

      case 'lead-quality': {
        const body = await request.json() as LeadQualityRequest
        const { leads, landingPages } = body

        if (!leads) {
          return NextResponse.json(
            { error: 'leads data is required' },
            { status: 400 }
          )
        }

        const analysis = await adsAgent.analyzeLeadQuality(leads, landingPages)

        return NextResponse.json({
          success: true,
          analysis,
        })
      }

      default:
        return NextResponse.json(
          { error: `Unknown report type: ${type}` },
          { status: 400 }
        )
    }

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
    const type = searchParams.get('type')
    const limit = parseInt(searchParams.get('limit') || '10')
    const offset = parseInt(searchParams.get('offset') || '0')

    let query = supabase
      .from('ad_reports')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (type) {
      query = query.eq('report_type', type)
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
