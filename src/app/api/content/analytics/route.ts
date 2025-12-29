/**
 * Content Analytics API
 * Performance metrics and insights for published content
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { createSocialAgent } from '@/lib/ai/agents/marketing/social-agent'

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// Get content analytics
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const period = searchParams.get('period') as '7d' | '30d' | '90d' || '30d'
    const platform = searchParams.get('platform')
    const contentType = searchParams.get('contentType')
    const groupBy = searchParams.get('groupBy') || 'date' // date, platform, contentType, legalArea

    // Calculate date range
    const endDate = new Date()
    const startDate = new Date()
    switch (period) {
      case '7d':
        startDate.setDate(endDate.getDate() - 7)
        break
      case '30d':
        startDate.setDate(endDate.getDate() - 30)
        break
      case '90d':
        startDate.setDate(endDate.getDate() - 90)
        break
    }

    // Fetch from content_analytics view
    let query = supabase
      .from('content_analytics')
      .select('*')
      .gte('date', startDate.toISOString().split('T')[0])
      .lte('date', endDate.toISOString().split('T')[0])

    if (platform) query = query.eq('platform', platform)
    if (contentType) query = query.eq('content_type', contentType)

    const { data: analytics, error } = await query

    if (error) {
      // If view doesn't exist, fetch raw data
      const { data: rawData, error: rawError } = await supabase
        .from('scheduled_posts')
        .select('*')
        .eq('status', 'published')
        .gte('published_at', startDate.toISOString())
        .lte('published_at', endDate.toISOString())

      if (rawError) {
        return NextResponse.json(
          { error: 'Failed to fetch analytics', details: rawError.message },
          { status: 500 }
        )
      }

      // Calculate basic analytics from raw data
      const totalPosts = rawData?.length || 0
      const byPlatform: Record<string, number> = {}
      const byContentType: Record<string, number> = {}
      let totalImpressions = 0
      let totalEngagements = 0

      rawData?.forEach((post) => {
        byPlatform[post.platform] = (byPlatform[post.platform] || 0) + 1
        byContentType[post.content_type] = (byContentType[post.content_type] || 0) + 1

        const metrics = post.metrics || {}
        totalImpressions += metrics.impressions || 0
        totalEngagements += metrics.engagements || 0
      })

      return NextResponse.json({
        success: true,
        period,
        summary: {
          totalPosts,
          totalImpressions,
          totalEngagements,
          avgEngagementRate: totalImpressions > 0 ? (totalEngagements / totalImpressions) * 100 : 0,
        },
        byPlatform,
        byContentType,
        raw: rawData,
      })
    }

    // Aggregate analytics data
    const summary = {
      totalPosts: analytics?.reduce((sum, a) => sum + (a.total_posts || 0), 0) || 0,
      publishedCount: analytics?.reduce((sum, a) => sum + (a.published_count || 0), 0) || 0,
      failedCount: analytics?.reduce((sum, a) => sum + (a.failed_count || 0), 0) || 0,
      totalImpressions: analytics?.reduce((sum, a) => sum + (a.total_impressions || 0), 0) || 0,
      totalEngagements: analytics?.reduce((sum, a) => sum + (a.total_engagements || 0), 0) || 0,
      totalClicks: analytics?.reduce((sum, a) => sum + (a.total_clicks || 0), 0) || 0,
      avgEngagementRate: 0,
      avgTokensUsed: 0,
    }

    if (summary.totalImpressions > 0) {
      summary.avgEngagementRate = (summary.totalEngagements / summary.totalImpressions) * 100
    }

    const tokenCounts = analytics?.filter((a) => a.avg_tokens_used).map((a) => a.avg_tokens_used) || []
    if (tokenCounts.length > 0) {
      summary.avgTokensUsed = tokenCounts.reduce((a, b) => a + b, 0) / tokenCounts.length
    }

    // Group data
    const grouped: Record<string, typeof analytics> = {}
    analytics?.forEach((item) => {
      let key: string
      switch (groupBy) {
        case 'platform':
          key = item.platform
          break
        case 'contentType':
          key = item.content_type
          break
        case 'legalArea':
          key = item.legal_area || 'unspecified'
          break
        default:
          key = item.date
      }
      if (!grouped[key]) grouped[key] = []
      grouped[key].push(item)
    })

    return NextResponse.json({
      success: true,
      period,
      dateRange: {
        start: startDate.toISOString().split('T')[0],
        end: endDate.toISOString().split('T')[0],
      },
      summary,
      grouped,
      raw: analytics,
    })

  } catch (error) {
    console.error('Analytics fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch analytics', details: (error as Error).message },
      { status: 500 }
    )
  }
}

// Update content metrics (called after publishing)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const { contentId, metrics } = body

    if (!contentId || !metrics) {
      return NextResponse.json(
        { error: 'contentId and metrics are required' },
        { status: 400 }
      )
    }

    // Validate metrics structure
    const validMetrics = {
      impressions: metrics.impressions || 0,
      reach: metrics.reach || 0,
      engagements: metrics.engagements || 0,
      likes: metrics.likes || 0,
      comments: metrics.comments || 0,
      shares: metrics.shares || 0,
      saves: metrics.saves || 0,
      clicks: metrics.clicks || 0,
      updatedAt: new Date().toISOString(),
    }

    const { data, error } = await supabase
      .from('scheduled_posts')
      .update({
        metrics: validMetrics,
      })
      .eq('id', contentId)
      .select()
      .single()

    if (error) {
      return NextResponse.json(
        { error: 'Failed to update metrics', details: error instanceof Error ? error.message : String(error) },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data,
    })

  } catch (error) {
    console.error('Metrics update error:', error)
    return NextResponse.json(
      { error: 'Failed to update metrics', details: (error as Error).message },
      { status: 500 }
    )
  }
}

// Get engagement analysis with AI insights
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()

    const { period = '30d' } = body

    // Calculate date range
    const endDate = new Date()
    const startDate = new Date()
    switch (period as '7d' | '30d' | '90d') {
      case '7d':
        startDate.setDate(endDate.getDate() - 7)
        break
      case '30d':
        startDate.setDate(endDate.getDate() - 30)
        break
      case '90d':
        startDate.setDate(endDate.getDate() - 90)
        break
    }

    // Fetch published content with metrics
    const { data: contents, error } = await supabase
      .from('scheduled_posts')
      .select('*')
      .eq('status', 'published')
      .not('metrics', 'is', null)
      .gte('published_at', startDate.toISOString())
      .lte('published_at', endDate.toISOString())

    if (error || !contents || contents.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'No published content with metrics found',
        analysis: null,
      })
    }

    // Prepare metrics for Social Agent analysis
    const metrics = contents.map((c) => ({
      postId: c.id,
      platform: c.platform as 'instagram' | 'linkedin' | 'facebook' | 'twitter' | 'tiktok',
      impressions: c.metrics?.impressions || 0,
      reach: c.metrics?.reach || 0,
      engagements: c.metrics?.engagements || 0,
      likes: c.metrics?.likes || 0,
      comments: c.metrics?.comments || 0,
      shares: c.metrics?.shares || 0,
      saves: c.metrics?.saves || 0,
      clicks: c.metrics?.clicks || 0,
      engagementRate: c.metrics?.impressions > 0
        ? (c.metrics?.engagements || 0) / c.metrics.impressions
        : 0,
    }))

    // Get AI analysis
    const socialAgent = createSocialAgent()
    const analysis = await socialAgent.analyzeEngagement(metrics, period as '7d' | '30d' | '90d')

    // Generate performance report
    const report = await socialAgent.generatePerformanceReport(metrics, period as '7d' | '30d' | '90d')

    return NextResponse.json({
      success: true,
      period,
      contentCount: contents.length,
      analysis,
      report,
    })

  } catch (error) {
    console.error('Engagement analysis error:', error)
    return NextResponse.json(
      { error: 'Failed to analyze engagement', details: (error as Error).message },
      { status: 500 }
    )
  }
}
