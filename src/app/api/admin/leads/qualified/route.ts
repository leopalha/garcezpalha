import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { qualifiedLeadCreateSchema } from '@/lib/validations/admin-schemas'
import { ZodError } from 'zod'
import { PerformanceTimer, trackApiCall, trackError, trackConversion } from '@/lib/monitoring/observability'

/**
 * Database type definitions
 */
interface QualifiedLeadDB {
  id: string
  client_name: string
  phone?: string
  product_id: string
  product_name: string
  score_total: number
  score_urgency: number
  score_probability: number
  score_complexity: number
  category: string
  answers?: unknown[]
  created_at: string
  source: string
  status?: string
}

/**
 * GET /api/admin/leads/qualified
 * Get all qualified leads with filtering
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()

    // Check authentication
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get query parameters
    const searchParams = request.nextUrl.searchParams
    const filter = searchParams.get('filter') || 'all'

    // Build query
    let query = supabase
      .from('qualified_leads')
      .select('*')
      .order('created_at', { ascending: false })

    // Apply filters
    if (filter === 'hot') {
      query = query.eq('category', 'hot')
    } else if (filter === 'warm') {
      query = query.eq('category', 'warm')
    } else if (filter === 'new') {
      query = query.eq('status', 'new')
    } else if (filter === 'today') {
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      query = query.gte('created_at', today.toISOString())
    } else if (filter === 'week') {
      const weekAgo = new Date()
      weekAgo.setDate(weekAgo.getDate() - 7)
      query = query.gte('created_at', weekAgo.toISOString())
    }

    const { data: leads, error } = await query

    if (error) {
      console.error('[API /admin/leads/qualified] Error:', error)
      return NextResponse.json({ error: error instanceof Error ? error.message : String(error) }, { status: 500 })
    }

    // Format leads
    const formattedLeads = leads?.map((lead: QualifiedLeadDB) => ({
      id: lead.id,
      clientName: lead.client_name,
      phone: lead.phone,
      productId: lead.product_id,
      productName: lead.product_name,
      score: {
        total: lead.score_total,
        urgency: lead.score_urgency,
        probability: lead.score_probability,
        complexity: lead.score_complexity,
        category: lead.category,
      },
      answers: lead.answers || [],
      createdAt: lead.created_at,
      source: lead.source,
      status: lead.status || 'new',
    })) || []

    return NextResponse.json({
      leads: formattedLeads,
      total: formattedLeads.length,
    })
  } catch (error) {
    console.error('[API /admin/leads/qualified] Error:', error)
    return NextResponse.json(
      { error: 'Internal server error', message: error instanceof Error ? error instanceof Error ? error.message : String(error) : String(error) },
      { status: 500 }
    )
  }
}

/**
 * POST /api/admin/leads/qualified
 * Create a new qualified lead
 */
export async function POST(request: NextRequest) {
  const timer = new PerformanceTimer('POST /api/admin/leads/qualified')

  try {
    const supabase = await createClient()

    // Parse and validate request body with Zod
    const rawBody = await request.json()
    const body = qualifiedLeadCreateSchema.parse(rawBody)

    // Insert into database
    const { data: lead, error } = await supabase
      .from('qualified_leads')
      .insert([
        {
          client_name: body.clientName,
          phone: body.phone,
          email: body.email,
          product_id: body.productId,
          product_name: body.productName,
          score_total: body.score.total,
          score_urgency: body.score.urgency,
          score_probability: body.score.probability,
          score_complexity: body.score.complexity,
          category: body.score.category,
          answers: body.answers || [],
          reasoning: body.score.reasoning || [],
          source: body.source,
          session_id: body.sessionId,
          status: 'new',
          metadata: body.metadata || {},
        },
      ])
      .select()
      .single()

    if (error) {
      console.error('[API /admin/leads/qualified POST] Error:', error)
      return NextResponse.json({ error: error instanceof Error ? error.message : String(error) }, { status: 500 })
    }

    // Format response
    const formattedLead = {
      id: lead.id,
      clientName: lead.client_name,
      phone: lead.phone,
      email: lead.email,
      productId: lead.product_id,
      productName: lead.product_name,
      score: {
        total: lead.score_total,
        urgency: lead.score_urgency,
        probability: lead.score_probability,
        complexity: lead.score_complexity,
        category: lead.category,
        reasoning: lead.reasoning,
      },
      answers: lead.answers,
      createdAt: lead.created_at,
      source: lead.source,
      status: lead.status,
    }

    const duration = timer.end()
    trackApiCall('/api/admin/leads/qualified', duration, 201, { leadId: lead.id, category: lead.category })
    trackConversion('qualified_lead_created', undefined, { category: lead.category, productId: lead.product_id })

    return NextResponse.json(
      { lead: formattedLead, message: 'Lead created successfully' },
      { status: 201 }
    )
  } catch (error) {
    timer.end()

    // Handle Zod validation errors
    if (error instanceof ZodError) {
      trackError(error as Error, { endpoint: '/api/admin/leads/qualified', type: 'validation' })
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

    trackError(error as Error, { endpoint: '/api/admin/leads/qualified', method: 'POST' })
    console.error('[API /admin/leads/qualified POST] Error:', error)
    return NextResponse.json(
      { error: 'Internal server error', message: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    )
  }
}
