import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

interface SourcePerformance {
  source: string
  sourceName: string
  leads: number
  qualified: number
  converted: number
  revenue: number
  qualificationRate: number
  conversionRate: number
  averageRevenue: number
  roi: number
  cost: number
}

interface SourcePerformanceResponse {
  sources: SourcePerformance[]
  totals: {
    leads: number
    revenue: number
    averageConversion: number
  }
  bestPerforming: {
    byLeads: string
    byConversion: string
    byRevenue: string
  }
}

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)
    const days = parseInt(searchParams.get('days') || '30')

    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)

    // Get all leads with their status
    const { data: leads, error: leadsError } = await supabase
      .from('leads')
      .select('*')
      .gte('created_at', startDate.toISOString())

    if (leadsError) {
      throw leadsError
    }

    // Get clients to track conversions
    const { data: clients, error: clientsError } = await supabase
      .from('clients')
      .select('lead_id, lifetime_value')
      .gte('created_at', startDate.toISOString())

    if (clientsError) {
      throw clientsError
    }

    // Create map of lead_id to revenue
    const leadRevenue: Record<string, number> = {}
    clients?.forEach((client) => {
      if (client.lead_id) {
        leadRevenue[client.lead_id] = client.lifetime_value || 0
      }
    })

    // Group by source
    const sourceMap: Record<string, {
      leads: number
      qualified: number
      converted: number
      revenue: number
    }> = {}

    leads?.forEach((lead) => {
      const source = lead.source || 'unknown'

      if (!sourceMap[source]) {
        sourceMap[source] = { leads: 0, qualified: 0, converted: 0, revenue: 0 }
      }

      sourceMap[source].leads += 1

      if (lead.status === 'qualified' || lead.status === 'converted') {
        sourceMap[source].qualified += 1
      }

      if (lead.status === 'converted') {
        sourceMap[source].converted += 1
        sourceMap[source].revenue += leadRevenue[lead.id] || 0
      }
    })

    // Estimated costs per source (would come from marketing budget in real app)
    const sourceCosts: Record<string, number> = {
      website: 500,     // SEO/hosting costs
      whatsapp: 200,    // WhatsApp Business API
      gmail: 100,       // Gmail monitoring
      referral: 0,      // Organic
      ads: 2000,        // Paid ads
      unknown: 0,
    }

    // Calculate performance metrics
    const sources: SourcePerformance[] = Object.entries(sourceMap)
      .map(([source, data]) => {
        const qualificationRate = data.leads > 0 ? (data.qualified / data.leads) * 100 : 0
        const conversionRate = data.leads > 0 ? (data.converted / data.leads) * 100 : 0
        const averageRevenue = data.converted > 0 ? data.revenue / data.converted : 0
        const cost = sourceCosts[source] || 0
        const roi = cost > 0 ? ((data.revenue - cost) / cost) * 100 : 0

        return {
          source,
          sourceName: formatSourceName(source),
          leads: data.leads,
          qualified: data.qualified,
          converted: data.converted,
          revenue: data.revenue,
          qualificationRate,
          conversionRate,
          averageRevenue,
          roi,
          cost,
        }
      })
      .sort((a, b) => b.revenue - a.revenue)

    // Calculate totals
    const totals = {
      leads: sources.reduce((sum, s) => sum + s.leads, 0),
      revenue: sources.reduce((sum, s) => sum + s.revenue, 0),
      averageConversion: sources.length > 0
        ? sources.reduce((sum, s) => sum + s.conversionRate, 0) / sources.length
        : 0,
    }

    // Find best performing sources
    const bestByLeads = sources.reduce((best, s) => s.leads > best.leads ? s : best, sources[0])
    const bestByConversion = sources.reduce((best, s) => s.conversionRate > best.conversionRate ? s : best, sources[0])
    const bestByRevenue = sources.reduce((best, s) => s.revenue > best.revenue ? s : best, sources[0])

    const response: SourcePerformanceResponse = {
      sources,
      totals,
      bestPerforming: {
        byLeads: bestByLeads?.sourceName || 'N/A',
        byConversion: bestByConversion?.sourceName || 'N/A',
        byRevenue: bestByRevenue?.sourceName || 'N/A',
      },
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Error fetching source performance:', error)
    return NextResponse.json(
      { error: 'Failed to fetch source performance' },
      { status: 500 }
    )
  }
}

function formatSourceName(source: string): string {
  const nameMap: Record<string, string> = {
    website: 'Website',
    whatsapp: 'WhatsApp',
    gmail: 'Gmail',
    referral: 'Indicação',
    ads: 'Anúncios',
    chatbot: 'Chatbot',
    unknown: 'Não Identificado',
  }

  return nameMap[source] || source
}
