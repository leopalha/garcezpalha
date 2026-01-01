import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { ZodError } from 'zod'

export const dynamic = 'force-dynamic'

interface LeadsStats {
  total: number
  byStatus: {
    new: number
    contacted: number
    qualified: number
    converted: number
    lost: number
  }
  bySource: {
    website: number
    whatsapp: number
    gmail: number
    referral: number
    ads: number
  }
  recent: Array<{
    date: string
    count: number
  }>
  conversionFunnel: {
    total: number
    contacted: number
    qualified: number
    converted: number
    contactedRate: number
    qualifiedRate: number
    convertedRate: number
  }
}

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)
    const days = parseInt(searchParams.get('days') || '30')

    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)

    // Get all leads within time range
    const { data: leads, error } = await supabase
      .from('leads')
      .select('*')
      .gte('created_at', startDate.toISOString())
      .order('created_at', { ascending: false })

    if (error) {
      throw error
    }

    // Calculate stats
    const byStatus = {
      new: leads?.filter((l) => l.status === 'new').length || 0,
      contacted: leads?.filter((l) => l.status === 'contacted').length || 0,
      qualified: leads?.filter((l) => l.status === 'qualified').length || 0,
      converted: leads?.filter((l) => l.status === 'converted').length || 0,
      lost: leads?.filter((l) => l.status === 'lost').length || 0,
    }

    const bySource = {
      website: leads?.filter((l) => l.source === 'website').length || 0,
      whatsapp: leads?.filter((l) => l.source === 'whatsapp').length || 0,
      gmail: leads?.filter((l) => l.source === 'gmail').length || 0,
      referral: leads?.filter((l) => l.source === 'referral').length || 0,
      ads: leads?.filter((l) => l.source === 'ads').length || 0,
    }

    // Group by date for chart
    const leadsByDate: Record<string, number> = {}
    leads?.forEach((lead) => {
      const date = new Date(lead.created_at).toISOString().split('T')[0]
      leadsByDate[date] = (leadsByDate[date] || 0) + 1
    })

    const recent = Object.entries(leadsByDate)
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => a.date.localeCompare(b.date))
      .slice(-30) // Last 30 days

    // Conversion funnel
    const total = leads?.length || 0
    const contacted = byStatus.contacted + byStatus.qualified + byStatus.converted
    const qualified = byStatus.qualified + byStatus.converted
    const converted = byStatus.converted

    const stats: LeadsStats = {
      total,
      byStatus,
      bySource,
      recent,
      conversionFunnel: {
        total,
        contacted,
        qualified,
        converted,
        contactedRate: total > 0 ? (contacted / total) * 100 : 0,
        qualifiedRate: total > 0 ? (qualified / total) * 100 : 0,
        convertedRate: total > 0 ? (converted / total) * 100 : 0,
      },
    }

    return NextResponse.json(stats)
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

    console.error('Error fetching leads stats:', error)
    return NextResponse.json(
      { error: 'Failed to fetch leads stats' },
      { status: 500 }
    )
  }
}
