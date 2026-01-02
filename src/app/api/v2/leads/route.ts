/**
 * Leads API v2 - Using CQRS Pattern
 * Demonstrates separation of commands and queries
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { commandBus, queryBus } from '@/lib/cqrs'
import {
  CreateLeadHandler,
  QualifyLeadHandler,
  ConvertLeadHandler,
  GetLeadByIdHandler,
  ListLeadsHandler,
  GetLeadStatsHandler,
} from '@/lib/cqrs/handlers/leads'
import { createLogger } from '@/lib/logger'

const logger = createLogger('api:v2:leads')

export const dynamic = 'force-dynamic'

// Register handlers on module load
commandBus.register('CreateLead', new CreateLeadHandler())
commandBus.register('QualifyLead', new QualifyLeadHandler())
commandBus.register('ConvertLead', new ConvertLeadHandler())

queryBus.register('GetLeadById', new GetLeadByIdHandler())
queryBus.register('ListLeads', new ListLeadsHandler())
queryBus.register('GetLeadStats', new GetLeadStatsHandler())

// ============================================================================
// POST /api/v2/leads - Create Lead (Command)
// ============================================================================

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    // Get current user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()

    // Execute command via CQRS
    const result = await commandBus.execute({
      type: 'CreateLead',
      payload: {
        name: body.name,
        email: body.email,
        phone: body.phone,
        source: body.source || 'api',
        productId: body.productId,
        metadata: body.metadata,
      },
      metadata: {
        userId: user.id,
        timestamp: Date.now(),
      },
    })

    logger.info('[POST /api/v2/leads] Lead created', { leadId: (result as { id: string }).id })

    return NextResponse.json(result, { status: 201 })
  } catch (error) {
    logger.error('[POST /api/v2/leads] Error:', error)

    return NextResponse.json(
      {
        error: 'Failed to create lead',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

// ============================================================================
// GET /api/v2/leads - List Leads (Query)
// ============================================================================

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()

    // Get current user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Parse query params
    const searchParams = request.nextUrl.searchParams
    const status = searchParams.get('status') || undefined
    const source = searchParams.get('source') || undefined
    const assignedTo = searchParams.get('assignedTo') || undefined
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')

    // Execute query via CQRS
    const leads = await queryBus.execute({
      type: 'ListLeads',
      params: {
        status,
        source,
        assignedTo,
        limit,
        offset,
      },
      metadata: {
        userId: user.id,
        useCache: true, // Enable caching for list queries
      },
    })

    logger.info('[GET /api/v2/leads] Leads listed', { count: (leads as unknown[]).length })

    return NextResponse.json({ leads })
  } catch (error) {
    logger.error('[GET /api/v2/leads] Error:', error)

    return NextResponse.json(
      {
        error: 'Failed to list leads',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
