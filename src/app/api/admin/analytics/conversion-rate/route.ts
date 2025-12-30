import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export const runtime = 'edge'

interface ConversionFunnel {
  stage: string
  count: number
  percentage: number
  dropoffRate: number
}

interface ConversionRateResponse {
  overall: {
    totalLeads: number
    totalClients: number
    totalRevenue: number
    conversionRate: number
    averageTimeToConvert: number
  }
  funnel: ConversionFunnel[]
  byTimeRange: {
    last7days: number
    last30days: number
    last90days: number
  }
  bySource: Record<string, {
    rate: number
    count: number
  }>
  trends: Array<{
    date: string
    rate: number
  }>
}

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()

    // Define time ranges
    const now = new Date()
    const last7d = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    const last30d = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
    const last90d = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000)

    // Get all leads
    const { data: allLeads, error: leadsError } = await supabase
      .from('leads')
      .select('*')
      .gte('created_at', last90d.toISOString())

    if (leadsError) {
      throw leadsError
    }

    // Get all clients
    const { data: allClients, error: clientsError } = await supabase
      .from('clients')
      .select('lead_id, lifetime_value, created_at')
      .gte('created_at', last90d.toISOString())

    if (clientsError) {
      throw clientsError
    }

    // Overall metrics
    const totalLeads = allLeads?.length || 0
    const totalClients = allClients?.length || 0
    const totalRevenue = allClients?.reduce((sum, c) => sum + (c.lifetime_value || 0), 0) || 0
    const conversionRate = totalLeads > 0 ? (totalClients / totalLeads) * 100 : 0

    // Calculate average time to convert
    let totalConversionTime = 0
    let conversionsWithTime = 0

    allClients?.forEach((client) => {
      const lead = allLeads?.find((l) => l.id === client.lead_id)
      if (lead) {
        const leadDate = new Date(lead.created_at)
        const clientDate = new Date(client.created_at)
        const diffDays = (clientDate.getTime() - leadDate.getTime()) / (1000 * 60 * 60 * 24)
        totalConversionTime += diffDays
        conversionsWithTime += 1
      }
    })

    const averageTimeToConvert = conversionsWithTime > 0
      ? totalConversionTime / conversionsWithTime
      : 0

    // Funnel stages
    const stages = {
      total: totalLeads,
      contacted: allLeads?.filter((l) =>
        ['contacted', 'qualified', 'converted'].includes(l.status)
      ).length || 0,
      qualified: allLeads?.filter((l) =>
        ['qualified', 'converted'].includes(l.status)
      ).length || 0,
      converted: allLeads?.filter((l) => l.status === 'converted').length || 0,
    }

    const funnel: ConversionFunnel[] = [
      {
        stage: 'Leads',
        count: stages.total,
        percentage: 100,
        dropoffRate: 0,
      },
      {
        stage: 'Contatados',
        count: stages.contacted,
        percentage: stages.total > 0 ? (stages.contacted / stages.total) * 100 : 0,
        dropoffRate: stages.total > 0 ? ((stages.total - stages.contacted) / stages.total) * 100 : 0,
      },
      {
        stage: 'Qualificados',
        count: stages.qualified,
        percentage: stages.total > 0 ? (stages.qualified / stages.total) * 100 : 0,
        dropoffRate: stages.contacted > 0 ? ((stages.contacted - stages.qualified) / stages.contacted) * 100 : 0,
      },
      {
        stage: 'Convertidos',
        count: stages.converted,
        percentage: stages.total > 0 ? (stages.converted / stages.total) * 100 : 0,
        dropoffRate: stages.qualified > 0 ? ((stages.qualified - stages.converted) / stages.qualified) * 100 : 0,
      },
    ]

    // Conversion rate by time range
    const leads7d = allLeads?.filter((l) => new Date(l.created_at) >= last7d).length || 0
    const clients7d = allClients?.filter((c) => new Date(c.created_at) >= last7d).length || 0

    const leads30d = allLeads?.filter((l) => new Date(l.created_at) >= last30d).length || 0
    const clients30d = allClients?.filter((c) => new Date(c.created_at) >= last30d).length || 0

    const byTimeRange = {
      last7days: leads7d > 0 ? (clients7d / leads7d) * 100 : 0,
      last30days: leads30d > 0 ? (clients30d / leads30d) * 100 : 0,
      last90days: conversionRate,
    }

    // Conversion rate by source
    const sourceMap: Record<string, { leads: number; clients: number }> = {}

    allLeads?.forEach((lead) => {
      const source = lead.source || 'unknown'
      if (!sourceMap[source]) {
        sourceMap[source] = { leads: 0, clients: 0 }
      }
      sourceMap[source].leads += 1

      if (lead.status === 'converted') {
        sourceMap[source].clients += 1
      }
    })

    const bySource: Record<string, { rate: number; count: number }> = {}
    Object.entries(sourceMap).forEach(([source, data]) => {
      bySource[source] = {
        rate: data.leads > 0 ? (data.clients / data.leads) * 100 : 0,
        count: data.clients,
      }
    })

    // Trends (daily conversion rate for last 30 days)
    const dailyData: Record<string, { leads: number; conversions: number }> = {}

    allLeads?.filter((l) => new Date(l.created_at) >= last30d).forEach((lead) => {
      const date = new Date(lead.created_at).toISOString().split('T')[0]
      if (!dailyData[date]) {
        dailyData[date] = { leads: 0, conversions: 0 }
      }
      dailyData[date].leads += 1
      if (lead.status === 'converted') {
        dailyData[date].conversions += 1
      }
    })

    const trends = Object.entries(dailyData)
      .map(([date, data]) => ({
        date,
        rate: data.leads > 0 ? (data.conversions / data.leads) * 100 : 0,
      }))
      .sort((a, b) => a.date.localeCompare(b.date))

    const response: ConversionRateResponse = {
      overall: {
        totalLeads,
        totalClients,
        totalRevenue,
        conversionRate,
        averageTimeToConvert,
      },
      funnel,
      byTimeRange,
      bySource,
      trends,
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Error fetching conversion rate:', error)
    return NextResponse.json(
      { error: 'Failed to fetch conversion rate' },
      { status: 500 }
    )
  }
}
