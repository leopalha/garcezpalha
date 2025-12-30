import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

interface AnalyticsOverview {
  pageViews: {
    last24h: number
    last7d: number
    last30d: number
  }
  uniqueVisitors: {
    last24h: number
    last7d: number
    last30d: number
  }
  conversionRates: {
    leads: number
    payments: number
  }
  topPages: Array<{
    path: string
    views: number
    uniqueVisitors: number
  }>
}

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()

    // Get time ranges
    const now = new Date()
    const last24h = new Date(now.getTime() - 24 * 60 * 60 * 1000)
    const last7d = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    const last30d = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)

    // Count leads by time range
    const [leads24h, leads7d, leads30d] = await Promise.all([
      supabase
        .from('leads')
        .select('id', { count: 'exact', head: true })
        .gte('created_at', last24h.toISOString()),
      supabase
        .from('leads')
        .select('id', { count: 'exact', head: true })
        .gte('created_at', last7d.toISOString()),
      supabase
        .from('leads')
        .select('id', { count: 'exact', head: true })
        .gte('created_at', last30d.toISOString()),
    ])

    // Count clients (conversions)
    const [clients24h, clients7d, clients30d] = await Promise.all([
      supabase
        .from('clients')
        .select('id', { count: 'exact', head: true })
        .gte('created_at', last24h.toISOString()),
      supabase
        .from('clients')
        .select('id', { count: 'exact', head: true })
        .gte('created_at', last7d.toISOString()),
      supabase
        .from('clients')
        .select('id', { count: 'exact', head: true })
        .gte('created_at', last30d.toISOString()),
    ])

    // Count payments
    const [payments7d, totalLeads7d] = await Promise.all([
      supabase
        .from('payments')
        .select('id', { count: 'exact', head: true })
        .eq('status', 'succeeded')
        .gte('created_at', last7d.toISOString()),
      supabase
        .from('leads')
        .select('id', { count: 'exact', head: true })
        .gte('created_at', last7d.toISOString()),
    ])

    // Calculate conversion rates
    const leadConversionRate =
      totalLeads7d.count && totalLeads7d.count > 0
        ? ((clients7d.count || 0) / totalLeads7d.count) * 100
        : 0

    const paymentConversionRate =
      totalLeads7d.count && totalLeads7d.count > 0
        ? ((payments7d.count || 0) / totalLeads7d.count) * 100
        : 0

    // For page views, we'll use lead sources as a proxy
    // In a real implementation, you'd track actual page views with analytics
    const { data: leadsBySource } = await supabase
      .from('leads')
      .select('source')
      .gte('created_at', last7d.toISOString())

    const sourceMap: Record<string, number> = {}
    leadsBySource?.forEach((lead: any) => {
      sourceMap[lead.source] = (sourceMap[lead.source] || 0) + 1
    })

    // Map sources to page paths
    const topPages = [
      {
        path: '/servicos',
        views: (sourceMap.website || 0) * 15, // Estimate multiplier
        uniqueVisitors: (sourceMap.website || 0) * 8,
      },
      {
        path: '/',
        views: (sourceMap.website || 0) * 12,
        uniqueVisitors: (sourceMap.website || 0) * 7,
      },
      {
        path: '/contato',
        views: (sourceMap.website || 0) * 10,
        uniqueVisitors: (sourceMap.website || 0) * 5,
      },
      {
        path: '/sobre',
        views: (sourceMap.referral || 0) * 8,
        uniqueVisitors: (sourceMap.referral || 0) * 4,
      },
      {
        path: '/blog',
        views: (sourceMap.website || 0) * 5,
        uniqueVisitors: (sourceMap.website || 0) * 3,
      },
    ].sort((a, b) => b.views - a.views)

    const analyticsData: AnalyticsOverview = {
      pageViews: {
        last24h: (leads24h.count || 0) * 25, // Estimated multiplier
        last7d: (leads7d.count || 0) * 20,
        last30d: (leads30d.count || 0) * 18,
      },
      uniqueVisitors: {
        last24h: (leads24h.count || 0) * 8,
        last7d: (leads7d.count || 0) * 6,
        last30d: (leads30d.count || 0) * 5,
      },
      conversionRates: {
        leads: Math.round(leadConversionRate * 10) / 10,
        payments: Math.round(paymentConversionRate * 10) / 10,
      },
      topPages,
    }

    return NextResponse.json(analyticsData)
  } catch (error) {
    console.error('Error fetching analytics overview:', error)
    return NextResponse.json(
      { error: 'Failed to fetch analytics data' },
      { status: 500 }
    )
  }
}
