import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export const runtime = 'edge'

/**
 * Get lead score by ID
 */

export async function GET(
  request: NextRequest,
  { params }: { params: { leadId: string } }
) {
  try {
    const { leadId } = params
    const supabase = await createClient()

    // Get lead with score
    const { data: lead, error } = await supabase
      .from('leads')
      .select('id, full_name, email, lead_score, qualification_status, metadata')
      .eq('id', leadId)
      .single()

    if (error || !lead) {
      return NextResponse.json(
        { error: 'Lead not found' },
        { status: 404 }
      )
    }

    // Get agent decision for this lead
    const { data: decision } = await supabase
      .from('agent_decisions')
      .select('*')
      .eq('lead_id', leadId)
      .eq('agent_id', 'marketing-lead-agent')
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    return NextResponse.json({
      leadId: lead.id,
      fullName: lead.full_name,
      email: lead.email,
      score: lead.lead_score,
      qualificationStatus: lead.qualification_status,
      scoreBreakdown: lead.metadata?.score_breakdown,
      classification: lead.metadata?.classification,
      priority: lead.metadata?.priority,
      reasons: lead.metadata?.reasons,
      recommendations: lead.metadata?.recommendations,
      decision: decision ? {
        timestamp: decision.created_at,
        confidence: decision.confidence_score,
        inputData: decision.input_data,
        outputData: decision.output_data,
      } : undefined,
    })
  } catch (error) {
    console.error('Error fetching lead score:', error)
    return NextResponse.json(
      { error: 'Failed to fetch lead score' },
      { status: 500 }
    )
  }
}
