import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

/**
 * GET /api/marketing/campaigns/[id]
 * Busca detalhes de uma campanha específica
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient()
    const { id } = params

    // Get sequence
    const { data: sequence, error } = await supabase
      .from('email_sequences')
      .select('*')
      .eq('id', id)
      .single()

    if (error || !sequence) {
      return NextResponse.json(
        { error: 'Campaign not found' },
        { status: 404 }
      )
    }

    // Get steps
    const { data: steps } = await supabase
      .from('email_sequence_steps')
      .select('*')
      .eq('sequence_id', id)
      .order('step_number', { ascending: true })

    // Get stats
    const { count: subscribersCount } = await supabase
      .from('email_sequence_subscriptions')
      .select('id', { count: 'exact', head: true })
      .eq('sequence_id', id)

    const { count: sendsCount } = await supabase
      .from('email_sequence_sends')
      .select('id', { count: 'exact', head: true })
      .eq('sequence_id', id)
      .not('sent_at', 'is', null)

    const campaign = {
      id: sequence.id,
      name: sequence.name,
      description: sequence.description,
      type: sequence.type,
      status: sequence.status,
      steps: steps || [],
      settings: sequence.settings || {},
      stats: {
        subscribers: subscribersCount || 0,
        sent: sendsCount || 0,
      },
      created_at: sequence.created_at,
      updated_at: sequence.updated_at,
    }

    return NextResponse.json(campaign)
  } catch (error) {
    console.error('Error fetching campaign:', error)
    return NextResponse.json(
      { error: 'Failed to fetch campaign' },
      { status: 500 }
    )
  }
}

/**
 * PATCH /api/marketing/campaigns/[id]
 * Atualiza uma campanha (status, nome, descrição, etc)
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient()
    const { id } = params
    const body = await request.json()

    const { name, description, status, settings } = body

    const updateData: any = {
      updated_at: new Date().toISOString(),
    }

    if (name !== undefined) updateData.name = name
    if (description !== undefined) updateData.description = description
    if (status !== undefined) updateData.status = status
    if (settings !== undefined) updateData.settings = settings

    const { data, error } = await supabase
      .from('email_sequences')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      throw error
    }

    return NextResponse.json({
      campaign: {
        id: data.id,
        name: data.name,
        description: data.description,
        type: data.type,
        status: data.status,
        updated_at: data.updated_at,
      },
    })
  } catch (error) {
    console.error('Error updating campaign:', error)
    return NextResponse.json(
      { error: 'Failed to update campaign' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/marketing/campaigns/[id]
 * Deleta uma campanha
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient()
    const { id } = params

    // Check if campaign can be deleted (not active)
    const { data: sequence } = await supabase
      .from('email_sequences')
      .select('status')
      .eq('id', id)
      .single()

    if (sequence?.status === 'active') {
      return NextResponse.json(
        { error: 'Cannot delete active campaign. Pause it first.' },
        { status: 400 }
      )
    }

    // Delete associated steps first
    await supabase
      .from('email_sequence_steps')
      .delete()
      .eq('sequence_id', id)

    // Delete campaign
    const { error } = await supabase
      .from('email_sequences')
      .delete()
      .eq('id', id)

    if (error) {
      throw error
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting campaign:', error)
    return NextResponse.json(
      { error: 'Failed to delete campaign' },
      { status: 500 }
    )
  }
}
