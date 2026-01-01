import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { analyticsLeadsQuerySchema } from '@/lib/validations/admin-schemas'
import { ZodError } from 'zod'

/**
 * Analytics Interfaces
 */
interface ProductStats {
  productId: string
  productName: string
  total: number
  hot: number
  warm: number
  cold: number
  veryCold: number
  converted: number
  avgScore: number
  conversionRate: number
  scores?: number[]
}

interface SourceStats {
  source: string
  total: number
  converted: number
  avgScore: number
  conversionRate: number
  scores?: number[]
}

interface TimeSeriesData {
  date: string
  total: number
  hot: number
  warm: number
  cold: number
  veryCold: number
  converted: number
  avgScore: number
  scores?: number[]
}

interface QualifiedLead {
  created_at: string
  category: 'hot' | 'warm' | 'cold' | 'very-cold'
  status: 'new' | 'in-progress' | 'converted' | 'lost'
  product_id: string
  product_name: string
  source: string
  score_total: number
  score_urgency: number
  score_probability: number
  score_complexity: number
}

/**
 * GET /api/admin/analytics/leads
 * Get analytics data for qualified leads
 */
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

    // Validate query parameters with Zod
    const searchParams = request.nextUrl.searchParams
    const queryParams = analyticsLeadsQuerySchema.parse({
      period: searchParams.get('period') || '30',
      groupBy: searchParams.get('groupBy') || 'day'
    })

    const period = queryParams.period
    const groupBy = queryParams.groupBy

    // Calculate date range
    const endDate = new Date()
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - parseInt(period))

    // Fetch all leads in period
    const { data: leads, error } = await supabase
      .from('qualified_leads')
      .select('*')
      .gte('created_at', startDate.toISOString())
      .lte('created_at', endDate.toISOString())
      .order('created_at', { ascending: true })

    if (error) {
      console.error('[API /admin/analytics/leads] Error:', error)
      return NextResponse.json({ error: error instanceof Error ? error.message : String(error) }, { status: 500 })
    }

    // Calculate metrics
    const totalLeads = leads?.length || 0
    const hotLeads = leads?.filter((l) => l.category === 'hot').length || 0
    const warmLeads = leads?.filter((l) => l.category === 'warm').length || 0
    const coldLeads = leads?.filter((l) => l.category === 'cold').length || 0
    const veryColdLeads = leads?.filter((l) => l.category === 'very-cold').length || 0

    const convertedLeads = leads?.filter((l) => l.status === 'converted').length || 0
    const inProgressLeads = leads?.filter((l) => l.status === 'in-progress').length || 0
    const lostLeads = leads?.filter((l) => l.status === 'lost').length || 0
    const newLeads = leads?.filter((l) => l.status === 'new').length || 0

    const conversionRate = totalLeads > 0 ? (convertedLeads / totalLeads) * 100 : 0
    const hotConversionRate =
      hotLeads > 0
        ? (leads?.filter((l) => l.category === 'hot' && l.status === 'converted').length! /
            hotLeads) *
          100
        : 0

    // Group by product
    const productStats: Record<string, ProductStats> =
      leads?.reduce(
        (acc, lead) => {
          if (!acc[lead.product_id]) {
            acc[lead.product_id] = {
              productId: lead.product_id,
              productName: lead.product_name,
              total: 0,
              hot: 0,
              warm: 0,
              cold: 0,
              veryCold: 0,
              converted: 0,
              avgScore: 0,
              conversionRate: 0,
              scores: [],
            }
          }

          acc[lead.product_id].total++
          acc[lead.product_id].scores!.push(lead.score_total)

          if (lead.category === 'hot') acc[lead.product_id].hot++
          if (lead.category === 'warm') acc[lead.product_id].warm++
          if (lead.category === 'cold') acc[lead.product_id].cold++
          if (lead.category === 'very-cold') acc[lead.product_id].veryCold++
          if (lead.status === 'converted') acc[lead.product_id].converted++

          return acc
        },
        {} as Record<string, ProductStats>
      ) || {}

    // Calculate average scores per product
    Object.values(productStats).forEach((stat) => {
      if (stat.scores && stat.scores.length > 0) {
        stat.avgScore =
          stat.scores.reduce((sum: number, score: number) => sum + score, 0) / stat.scores.length
      }
      stat.conversionRate = stat.total > 0 ? (stat.converted / stat.total) * 100 : 0
      delete stat.scores
    })

    // Group by source
    const sourceStats: Record<string, SourceStats> =
      leads?.reduce(
        (acc, lead) => {
          if (!acc[lead.source]) {
            acc[lead.source] = {
              source: lead.source,
              total: 0,
              converted: 0,
              avgScore: 0,
              conversionRate: 0,
              scores: [],
            }
          }

          acc[lead.source].total++
          acc[lead.source].scores!.push(lead.score_total)
          if (lead.status === 'converted') acc[lead.source].converted++

          return acc
        },
        {} as Record<string, SourceStats>
      ) || {}

    // Calculate average scores per source
    Object.values(sourceStats).forEach((stat) => {
      if (stat.scores && stat.scores.length > 0) {
        stat.avgScore =
          stat.scores.reduce((sum: number, score: number) => sum + score, 0) / stat.scores.length
      }
      stat.conversionRate = stat.total > 0 ? (stat.converted / stat.total) * 100 : 0
      delete stat.scores
    })

    // Time series data
    const timeSeriesData = generateTimeSeries(leads || [], groupBy, startDate, endDate)

    // Score distribution
    const scoreDistribution = {
      '0-24': leads?.filter((l) => l.score_total >= 0 && l.score_total <= 24).length || 0,
      '25-49': leads?.filter((l) => l.score_total >= 25 && l.score_total <= 49).length || 0,
      '50-74': leads?.filter((l) => l.score_total >= 50 && l.score_total <= 74).length || 0,
      '75-100': leads?.filter((l) => l.score_total >= 75 && l.score_total <= 100).length || 0,
    }

    // Average scores
    const totalScore = leads?.reduce((sum, lead) => sum + lead.score_total, 0) || 0
    const avgTotalScore = totalLeads > 0 ? totalScore / totalLeads : 0

    const avgUrgency =
      totalLeads > 0
        ? leads?.reduce((sum, lead) => sum + lead.score_urgency, 0)! / totalLeads
        : 0
    const avgProbability =
      totalLeads > 0
        ? leads?.reduce((sum, lead) => sum + lead.score_probability, 0)! / totalLeads
        : 0
    const avgComplexity =
      totalLeads > 0
        ? leads?.reduce((sum, lead) => sum + lead.score_complexity, 0)! / totalLeads
        : 0

    return NextResponse.json({
      period: {
        days: parseInt(period),
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
      },
      overview: {
        totalLeads,
        hotLeads,
        warmLeads,
        coldLeads,
        veryColdLeads,
        convertedLeads,
        inProgressLeads,
        lostLeads,
        newLeads,
        conversionRate: Math.round(conversionRate * 100) / 100,
        hotConversionRate: Math.round(hotConversionRate * 100) / 100,
      },
      scores: {
        avgTotalScore: Math.round(avgTotalScore * 100) / 100,
        avgUrgency: Math.round(avgUrgency * 100) / 100,
        avgProbability: Math.round(avgProbability * 100) / 100,
        avgComplexity: Math.round(avgComplexity * 100) / 100,
        distribution: scoreDistribution,
      },
      byProduct: Object.values(productStats).sort((a, b) => b.total - a.total),
      bySource: Object.values(sourceStats).sort((a, b) => b.total - a.total),
      timeSeries: timeSeriesData,
    })
  } catch (error) {
    // Handle Zod validation errors
    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          details: error.errors.map((err) => ({
            field: err.path.join('.'),
            message: err.message
          }))
        },
        { status: 400 }
      )
    }

    console.error('[API /admin/analytics/leads] Error:', error)
    return NextResponse.json(
      { error: 'Internal server error', message: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    )
  }
}

/**
 * Generate time series data grouped by day, week, or month
 */
function generateTimeSeries(
  leads: QualifiedLead[],
  groupBy: string,
  startDate: Date,
  endDate: Date
): TimeSeriesData[] {
  const data: Record<string, TimeSeriesData> = {}

  // Initialize all periods with zero values
  const current = new Date(startDate)
  while (current <= endDate) {
    const key = formatDateKey(current, groupBy)
    data[key] = {
      date: key,
      total: 0,
      hot: 0,
      warm: 0,
      cold: 0,
      veryCold: 0,
      converted: 0,
      avgScore: 0,
      scores: [],
    }

    // Increment current date based on groupBy
    if (groupBy === 'day') {
      current.setDate(current.getDate() + 1)
    } else if (groupBy === 'week') {
      current.setDate(current.getDate() + 7)
    } else if (groupBy === 'month') {
      current.setMonth(current.getMonth() + 1)
    }
  }

  // Populate with actual data
  leads.forEach((lead) => {
    const leadDate = new Date(lead.created_at)
    const key = formatDateKey(leadDate, groupBy)

    if (data[key]) {
      data[key].total++
      data[key].scores!.push(lead.score_total)

      if (lead.category === 'hot') data[key].hot++
      if (lead.category === 'warm') data[key].warm++
      if (lead.category === 'cold') data[key].cold++
      if (lead.category === 'very-cold') data[key].veryCold++
      if (lead.status === 'converted') data[key].converted++
    }
  })

  // Calculate averages
  Object.values(data).forEach((item: TimeSeriesData) => {
    if (item.scores && item.scores.length > 0) {
      item.avgScore =
        Math.round(
          (item.scores.reduce((sum: number, score: number) => sum + score, 0) / item.scores.length) *
            100
        ) / 100
    }
    delete item.scores
  })

  return Object.values(data)
}

/**
 * Format date as key based on groupBy
 */
function formatDateKey(date: Date, groupBy: string): string {
  if (groupBy === 'day') {
    return date.toISOString().split('T')[0]
  } else if (groupBy === 'week') {
    // Get the Monday of the week
    const monday = new Date(date)
    const day = monday.getDay()
    const diff = monday.getDate() - day + (day === 0 ? -6 : 1)
    monday.setDate(diff)
    return monday.toISOString().split('T')[0]
  } else if (groupBy === 'month') {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
  }
  return date.toISOString()
}
