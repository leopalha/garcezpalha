import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { logger } from '@/lib/logger'

export const dynamic = 'force-dynamic'

interface ABTestVariant {
  subject?: string
  body?: string
}

interface ABTest {
  id: string
  sequence_id: string
  step_id?: string
  test_name: string
  test_type: 'subject' | 'content' | 'both'
  variant_a: ABTestVariant
  variant_b: ABTestVariant
  test_metric: 'open_rate' | 'click_rate' | 'conversion_rate'
  split_ratio: number
  min_sample_size: number
  winner?: string
  status: 'running' | 'completed' | 'paused'
  stats: {
    variant_a: {
      sends: number
      opens: number
      clicks: number
      conversions: number
      rate: number
    }
    variant_b: {
      sends: number
      opens: number
      clicks: number
      conversions: number
      rate: number
    }
    difference: number
    winner: string
    total_sends: number
    min_sample_reached: boolean
  }
  created_at: string
  started_at: string
  completed_at?: string
}

/**
 * GET /api/marketing/ab-tests
 * Lista todos os A/B tests com estatísticas
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)
    const sequenceId = searchParams.get('sequence_id')
    const status = searchParams.get('status')

    let query = supabase
      .from('email_ab_tests')
      .select('*')
      .order('created_at', { ascending: false })

    if (sequenceId) {
      query = query.eq('sequence_id', sequenceId)
    }

    if (status) {
      query = query.eq('status', status)
    }

    const { data: tests, error } = await query

    if (error) {
      throw error
    }

    // Calculate stats for each test
    const testsWithStats = await Promise.all(
      (tests || []).map(async (test: any) => {
        // Call PostgreSQL function to calculate stats
        const { data: stats } = await supabase
          .rpc('calculate_ab_test_stats', { test_id: test.id })

        return {
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
          created_at: test.created_at,
          started_at: test.started_at,
          completed_at: test.completed_at,
        } as ABTest
      })
    )

    return NextResponse.json({
      tests: testsWithStats,
      total: testsWithStats.length,
    })
  } catch (error) {
    logger.error('Error fetching A/B tests:', error)
    return NextResponse.json(
      { error: 'Failed to fetch A/B tests' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/marketing/ab-tests
 * Cria um novo A/B test
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const body = await request.json()

    const {
      sequence_id,
      step_id,
      test_name,
      test_type,
      variant_a,
      variant_b,
      test_metric,
      split_ratio,
      min_sample_size,
    } = body

    // Validate required fields
    if (!sequence_id || !test_name || !test_type || !variant_a || !variant_b || !test_metric) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Validate variants based on test type
    if (test_type === 'subject' && (!variant_a.subject || !variant_b.subject)) {
      return NextResponse.json(
        { error: 'Subject is required for subject tests' },
        { status: 400 }
      )
    }

    if (test_type === 'content' && (!variant_a.body || !variant_b.body)) {
      return NextResponse.json(
        { error: 'Body is required for content tests' },
        { status: 400 }
      )
    }

    if (test_type === 'both' && (!variant_a.subject || !variant_a.body || !variant_b.subject || !variant_b.body)) {
      return NextResponse.json(
        { error: 'Both subject and body are required for combined tests' },
        { status: 400 }
      )
    }

    // Create A/B test
    const { data: test, error } = await supabase
      .from('email_ab_tests')
      .insert({
        sequence_id,
        step_id: step_id || null,
        test_name,
        test_type,
        variant_a,
        variant_b,
        test_metric,
        split_ratio: split_ratio || 50,
        min_sample_size: min_sample_size || 100,
        status: 'running',
      })
      .select()
      .single()

    if (error) {
      throw error
    }

    return NextResponse.json({
      test: {
        id: test.id,
        sequence_id: test.sequence_id,
        test_name: test.test_name,
        status: test.status,
        created_at: test.created_at,
      },
    })
  } catch (error) {
    logger.error('Error creating A/B test:', error)
    return NextResponse.json(
      { error: 'Failed to create A/B test' },
      { status: 500 }
    )
  }
}
