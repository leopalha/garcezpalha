import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

/**
 * GET /api/marketing/ab-tests/[id]
 * Busca detalhes de um A/B test específico
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient()
    const { id } = params

    // Get test
    const { data: test, error } = await supabase
      .from('email_ab_tests')
      .select('*')
      .eq('id', id)
      .single()

    if (error || !test) {
      return NextResponse.json(
        { error: 'A/B test not found' },
        { status: 404 }
      )
    }

    // Get stats
    const { data: stats } = await supabase
      .rpc('calculate_ab_test_stats', { test_id: id })

    // Get assignments count
    const { count: assignmentsCount } = await supabase
      .from('email_ab_test_assignments')
      .select('id', { count: 'exact', head: true })
      .eq('ab_test_id', id)

    return NextResponse.json({
      id: test.id,
      sequence_id: test.sequence_id,
      step_id: test.step_id,
      test_name: test.test_name,
      test_type: test.test_type,
      variant_a: test.variant_a,
      variant_b: test.variant_b,
      test_metric: test.test_metric,
      split_ratio: test.split_ratio,
      min_sample_size: test.min_sample_size,
      winner: test.winner,
      status: test.status,
      stats: stats || {
        variant_a: { sends: 0, opens: 0, clicks: 0, conversions: 0, rate: 0 },
        variant_b: { sends: 0, opens: 0, clicks: 0, conversions: 0, rate: 0 },
        difference: 0,
        winner: 'none',
        total_sends: 0,
        min_sample_reached: false,
      },
      assignments_count: assignmentsCount || 0,
      created_at: test.created_at,
      started_at: test.started_at,
      completed_at: test.completed_at,
      p_value: test.p_value,
      statistical_significance: test.statistical_significance,
    })
  } catch (error) {
    console.error('Error fetching A/B test:', error)
    return NextResponse.json(
      { error: 'Failed to fetch A/B test' },
      { status: 500 }
    )
  }
}

/**
 * PATCH /api/marketing/ab-tests/[id]
 * Atualiza um A/B test (status, winner manual)
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient()
    const { id } = params
    const body = await request.json()

    const { status, winner } = body

    const updateData: any = {
      updated_at: new Date().toISOString(),
    }

    if (status !== undefined) {
      updateData.status = status

      // If completing the test, set completed_at
      if (status === 'completed') {
        updateData.completed_at = new Date().toISOString()
      }
    }

    if (winner !== undefined) {
      updateData.winner = winner
    }

    const { data, error } = await supabase
      .from('email_ab_tests')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      throw error
    }

    return NextResponse.json({
      test: {
        id: data.id,
        status: data.status,
        winner: data.winner,
        updated_at: data.updated_at,
      },
    })
  } catch (error) {
    console.error('Error updating A/B test:', error)
    return NextResponse.json(
      { error: 'Failed to update A/B test' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/marketing/ab-tests/[id]
 * Deleta um A/B test
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient()
    const { id } = params

    // Check if test can be deleted (not running)
    const { data: test } = await supabase
      .from('email_ab_tests')
      .select('status')
      .eq('id', id)
      .single()

    if (test?.status === 'running') {
      return NextResponse.json(
        { error: 'Cannot delete running test. Pause it first.' },
        { status: 400 }
      )
    }

    // Delete test (assignments will cascade)
    const { error } = await supabase
      .from('email_ab_tests')
      .delete()
      .eq('id', id)

    if (error) {
      throw error
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting A/B test:', error)
    return NextResponse.json(
      { error: 'Failed to delete A/B test' },
      { status: 500 }
    )
  }
}
