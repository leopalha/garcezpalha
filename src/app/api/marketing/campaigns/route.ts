import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

interface CampaignStats {
  subscribers: number
  sent: number
  opened: number
  clicked: number
  converted: number
  openRate: number
  clickRate: number
  conversionRate: number
}

interface Campaign {
  id: string
  name: string
  description: string
  type: 'email_sequence' | 'one_time' | 'ab_test'
  status: 'draft' | 'active' | 'paused' | 'completed'
  stats: CampaignStats
  schedule: {
    startDate: string
    endDate?: string
  }
  created_at: string
  updated_at: string
}

/**
 * GET /api/marketing/campaigns
 * Lista todas as campanhas de marketing com estatísticas
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()

    // Get email sequences (our current campaigns)
    const { data: sequences, error } = await supabase
      .from('email_sequences')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      throw error
    }

    // Enrich with stats
    const campaignsWithStats = await Promise.all(
      (sequences || []).map(async (sequence: any) => {
        // Count subscriptions
        const { count: subscribersCount } = await supabase
          .from('email_sequence_subscriptions')
          .select('id', { count: 'exact', head: true })
          .eq('sequence_id', sequence.id)

        // Count sends
        const { count: sendsCount } = await supabase
          .from('email_sequence_sends')
          .select('id', { count: 'exact', head: true })
          .eq('sequence_id', sequence.id)
          .not('sent_at', 'is', null)

        // Count opens
        const { count: opensCount } = await supabase
          .from('email_events')
          .select('id', { count: 'exact', head: true })
          .eq('sequence_id', sequence.id)
          .eq('event_type', 'opened')

        // Count clicks
        const { count: clicksCount } = await supabase
          .from('email_events')
          .select('id', { count: 'exact', head: true })
          .eq('sequence_id', sequence.id)
          .eq('event_type', 'clicked')

        // Count conversions (leads that converted after receiving emails from this sequence)
        const { data: sequenceLeads } = await supabase
          .from('email_sequence_subscriptions')
          .select('lead_id')
          .eq('sequence_id', sequence.id)

        const leadIds = sequenceLeads?.map((s: any) => s.lead_id) || []

        let conversionsCount = 0
        if (leadIds.length > 0) {
          const { count } = await supabase
            .from('leads')
            .select('id', { count: 'exact', head: true })
            .in('id', leadIds)
            .eq('status', 'converted')

          conversionsCount = count || 0
        }

        const subscribers = subscribersCount || 0
        const sent = sendsCount || 0
        const opened = opensCount || 0
        const clicked = clicksCount || 0
        const converted = conversionsCount

        const stats: CampaignStats = {
          subscribers,
          sent,
          opened,
          clicked,
          converted,
          openRate: sent > 0 ? (opened / sent) * 100 : 0,
          clickRate: sent > 0 ? (clicked / sent) * 100 : 0,
          conversionRate: subscribers > 0 ? (converted / subscribers) * 100 : 0,
        }

        const campaign: Campaign = {
          id: sequence.id,
          name: sequence.name,
          description: sequence.description,
          type: sequence.type || 'email_sequence',
          status: sequence.status || 'draft',
          stats,
          schedule: {
            startDate: sequence.created_at,
            endDate: sequence.end_date,
          },
          created_at: sequence.created_at,
          updated_at: sequence.updated_at,
        }

        return campaign
      })
    )

    return NextResponse.json({
      campaigns: campaignsWithStats,
      total: campaignsWithStats.length,
    })
  } catch (error) {
    console.error('Error fetching campaigns:', error)
    return NextResponse.json(
      { error: 'Failed to fetch campaigns' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/marketing/campaigns
 * Cria uma nova campanha de marketing
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const body = await request.json()

    const { name, description, type, steps, settings } = body

    // Validate required fields
    if (!name || !type) {
      return NextResponse.json(
        { error: 'Name and type are required' },
        { status: 400 }
      )
    }

    // Create email sequence
    const { data: sequence, error } = await supabase
      .from('email_sequences')
      .insert({
        name,
        description: description || '',
        type,
        status: 'draft',
        settings: settings || {},
      })
      .select()
      .single()

    if (error) {
      throw error
    }

    // Create sequence steps if provided
    if (steps && steps.length > 0) {
      const stepsToInsert = steps.map((step: any, index: number) => ({
        sequence_id: sequence.id,
        step_number: index + 1,
        name: step.name,
        subject: step.subject,
        body: step.body,
        delay_days: step.delayDays || 0,
        delay_hours: step.delayHours || 0,
        conditions: step.conditions || null,
      }))

      await supabase
        .from('email_sequence_steps')
        .insert(stepsToInsert)
    }

    return NextResponse.json({
      campaign: {
        id: sequence.id,
        name: sequence.name,
        description: sequence.description,
        type: sequence.type,
        status: sequence.status,
        created_at: sequence.created_at,
      },
    })
  } catch (error) {
    console.error('Error creating campaign:', error)
    return NextResponse.json(
      { error: 'Failed to create campaign' },
      { status: 500 }
    )
  }
}
