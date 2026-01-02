import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/options'
import { createLogger } from '@/lib/logger'
import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'
import { formatZodErrors } from '@/lib/zod-helpers'

const logger = createLogger('api:admin:lawyers:id')

const updateLawyerSchema = z.object({
  full_name: z.string().min(3).max(100).optional(),
  phone: z.string().min(10).optional(),
  oab_number: z.string().min(3).optional(),
  oab_state: z.string().length(2).toUpperCase().optional(),
  specialties: z.array(z.enum([
    'civil', 'criminal', 'family', 'labor', 'corporate',
    'tax', 'real_estate', 'immigration', 'general'
  ])).optional(),
  bio: z.string().optional(),
  location: z.string().optional(),
  status: z.enum(['active', 'inactive', 'on_leave']).optional(),
  role: z.enum(['admin', 'lawyer']).optional(),
})

/**
 * GET /api/admin/lawyers/[id]
 * Get detailed information about a lawyer
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Auth check
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      logger.warn('Unauthorized access attempt')
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      )
    }

    const lawyerId = params.id

    const supabase = await createClient()

    // Check if user is admin
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', session.user.id)
      .single()

    if (profile?.role !== 'admin') {
      logger.warn('Non-admin tried to access lawyer details', {
        userId: session.user.id,
        role: profile?.role
      })
      return NextResponse.json(
        { error: 'Acesso negado' },
        { status: 403 }
      )
    }

    logger.info('Fetching lawyer details', {
      userId: session.user.id,
      lawyerId
    })

    // Get lawyer profile
    const { data: lawyer, error: lawyerError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', lawyerId)
      .single()

    if (lawyerError || !lawyer) {
      logger.warn('Lawyer not found', { lawyerId })
      return NextResponse.json(
        { error: 'Advogado não encontrado' },
        { status: 404 }
      )
    }

    // Get lawyer's cases with client info
    const { data: cases, error: casesError } = await supabase
      .from('cases')
      .select(`
        id,
        service_type,
        status,
        progress,
        created_at,
        updated_at,
        client:profiles!cases_client_id_fkey(full_name)
      `)
      .eq('lawyer_id', lawyerId)
      .order('created_at', { ascending: false })

    // Calculate statistics
    const activeCases = cases?.filter(c =>
      ['aguardando_documentos', 'em_analise', 'em_andamento'].includes(c.status)
    ) || []

    const completedCases = cases?.filter(c => c.status === 'concluido') || []
    const totalCases = cases?.length || 0

    const workloadPercentage = Math.min(
      Math.round((activeCases.length / 20) * 100),
      100
    )

    const successRate = totalCases > 0
      ? Math.round((completedCases.length / totalCases) * 100)
      : 0

    // Calculate average case duration (mock for now)
    const avgCaseDuration = 45 // days - TODO: calculate from actual data

    // Client satisfaction (mock for now)
    const clientSatisfaction = 4.5 // out of 5 - TODO: get from reviews

    // Format cases for response
    const formattedCases = cases?.map(c => ({
      id: c.id,
      service_type: c.service_type,
      status: c.status,
      progress: c.progress,
      client_name: (c.client as any)?.full_name || 'Cliente',
      created_at: c.created_at,
      updated_at: c.updated_at
    })) || []

    const response = {
      id: lawyer.id,
      full_name: lawyer.full_name,
      email: lawyer.email,
      phone: lawyer.phone,
      oab_number: lawyer.oab_number,
      oab_state: lawyer.oab_state,
      avatar_url: lawyer.avatar_url,
      specialties: lawyer.specialties || [],
      status: lawyer.status || 'active',
      role: lawyer.role,
      bio: lawyer.bio,
      location: lawyer.location,
      active_cases: activeCases.length,
      completed_cases: completedCases.length,
      total_cases: totalCases,
      workload_percentage: workloadPercentage,
      success_rate: successRate,
      avg_case_duration: avgCaseDuration,
      client_satisfaction: clientSatisfaction,
      cases: formattedCases,
      joined_at: lawyer.created_at,
      last_active: lawyer.updated_at
    }

    logger.info('Lawyer details retrieved successfully', {
      userId: session.user.id,
      lawyerId
    })

    return NextResponse.json(response)

  } catch (error) {
    logger.error('Error in lawyer GET', error)
    return NextResponse.json(
      { error: 'Erro ao carregar dados do advogado' },
      { status: 500 }
    )
  }
}

/**
 * PATCH /api/admin/lawyers/[id]
 * Update lawyer information
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Auth check
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      logger.warn('Unauthorized update attempt')
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      )
    }

    const lawyerId = params.id

    const supabase = await createClient()

    // Check if user is admin
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', session.user.id)
      .single()

    if (profile?.role !== 'admin') {
      logger.warn('Non-admin tried to update lawyer', {
        userId: session.user.id,
        role: profile?.role
      })
      return NextResponse.json(
        { error: 'Acesso negado' },
        { status: 403 }
      )
    }

    // Parse and validate request body
    const body = await request.json()
    const validatedData = updateLawyerSchema.parse(body)

    logger.info('Updating lawyer', {
      userId: session.user.id,
      lawyerId,
      updates: Object.keys(validatedData)
    })

    // Update lawyer
    const { data: lawyer, error: updateError } = await supabase
      .from('profiles')
      .update({
        ...validatedData,
        updated_at: new Date().toISOString()
      })
      .eq('id', lawyerId)
      .select()
      .single()

    if (updateError) {
      logger.error('Error updating lawyer', { error: updateError })
      throw new Error('Failed to update lawyer')
    }

    logger.info('Lawyer updated successfully', {
      userId: session.user.id,
      lawyerId
    })

    return NextResponse.json(lawyer)

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: 'Dados inválidos',
          details: formatZodErrors(error),
        },
        { status: 400 }
      )
    }

    logger.error('Error in lawyer PATCH', error)
    return NextResponse.json(
      { error: 'Erro ao atualizar advogado' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/admin/lawyers/[id]
 * Remove a lawyer (admin only)
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Auth check
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      logger.warn('Unauthorized delete attempt')
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      )
    }

    const lawyerId = params.id

    const supabase = await createClient()

    // Check if user is admin
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', session.user.id)
      .single()

    if (profile?.role !== 'admin') {
      logger.warn('Non-admin tried to delete lawyer', {
        userId: session.user.id,
        role: profile?.role
      })
      return NextResponse.json(
        { error: 'Acesso negado' },
        { status: 403 }
      )
    }

    // Check if lawyer has active cases
    const { count: activeCases } = await supabase
      .from('cases')
      .select('*', { count: 'exact', head: true })
      .eq('lawyer_id', lawyerId)
      .in('status', ['aguardando_documentos', 'em_analise', 'em_andamento'])

    if ((activeCases || 0) > 0) {
      return NextResponse.json(
        {
          error: 'Não é possível remover advogado com casos ativos',
          details: `Este advogado possui ${activeCases} caso(s) ativo(s). Reatribua os casos antes de remover.`
        },
        { status: 400 }
      )
    }

    logger.info('Deleting lawyer', {
      userId: session.user.id,
      lawyerId
    })

    // Soft delete: mark as inactive instead of deleting
    const { error: updateError } = await supabase
      .from('profiles')
      .update({
        status: 'inactive',
        updated_at: new Date().toISOString()
      })
      .eq('id', lawyerId)

    if (updateError) {
      logger.error('Error deleting lawyer', { error: updateError })
      throw new Error('Failed to delete lawyer')
    }

    logger.info('Lawyer deleted successfully', {
      userId: session.user.id,
      lawyerId
    })

    return NextResponse.json({ success: true })

  } catch (error) {
    logger.error('Error in lawyer DELETE', error)
    return NextResponse.json(
      { error: 'Erro ao remover advogado' },
      { status: 500 }
    )
  }
}

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
