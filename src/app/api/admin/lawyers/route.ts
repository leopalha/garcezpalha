import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/options'
import { createLogger } from '@/lib/logger'
import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'
import { formatZodErrors } from '@/lib/zod-helpers'

const logger = createLogger('api:admin:lawyers')

const createLawyerSchema = z.object({
  email: z.string().email('Email inválido'),
  full_name: z.string().min(3, 'Nome muito curto').max(100),
  phone: z.string().min(10, 'Telefone inválido'),
  oab_number: z.string().min(3, 'Número OAB inválido'),
  oab_state: z.string().length(2, 'Estado deve ter 2 letras').toUpperCase(),
  specialties: z.array(z.enum([
    'civil', 'criminal', 'family', 'labor', 'corporate',
    'tax', 'real_estate', 'immigration', 'general'
  ])).min(1, 'Selecione pelo menos uma especialidade'),
  bio: z.string().optional(),
  location: z.string().optional(),
  role: z.enum(['admin', 'lawyer']).default('lawyer'),
})

/**
 * GET /api/admin/lawyers
 * List all lawyers with statistics
 */
export async function GET(request: NextRequest) {
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

    const supabase = await createClient()

    // Check if user is admin
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', session.user.id)
      .single()

    if (profile?.role !== 'admin') {
      logger.warn('Non-admin tried to access lawyers list', {
        userId: session.user.id,
        role: profile?.role
      })
      return NextResponse.json(
        { error: 'Acesso negado' },
        { status: 403 }
      )
    }

    logger.info('Fetching lawyers list', { userId: session.user.id })

    // Get all lawyers and admins
    const { data: lawyers, error: lawyersError } = await supabase
      .from('profiles')
      .select('*')
      .in('role', ['admin', 'lawyer'])
      .order('full_name', { ascending: true })

    if (lawyersError) {
      logger.error('Error fetching lawyers', { error: lawyersError })
      throw new Error('Failed to fetch lawyers')
    }

    // Calculate statistics for each lawyer
    const lawyersWithStats = await Promise.all(
      (lawyers || []).map(async (lawyer) => {
        // Count active cases
        const { count: activeCases } = await supabase
          .from('cases')
          .select('*', { count: 'exact', head: true })
          .eq('lawyer_id', lawyer.id)
          .in('status', ['aguardando_documentos', 'em_analise', 'em_andamento'])

        // Count completed cases
        const { count: completedCases } = await supabase
          .from('cases')
          .select('*', { count: 'exact', head: true })
          .eq('lawyer_id', lawyer.id)
          .eq('status', 'concluido')

        // Count total cases
        const { count: totalCases } = await supabase
          .from('cases')
          .select('*', { count: 'exact', head: true })
          .eq('lawyer_id', lawyer.id)

        // Calculate workload percentage (max 20 cases = 100%)
        const workloadPercentage = Math.min(
          Math.round(((activeCases || 0) / 20) * 100),
          100
        )

        // Calculate success rate
        const successRate = (totalCases || 0) > 0
          ? Math.round(((completedCases || 0) / (totalCases || 1)) * 100)
          : 0

        return {
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
          active_cases: activeCases || 0,
          completed_cases: completedCases || 0,
          total_cases: totalCases || 0,
          workload_percentage: workloadPercentage,
          success_rate: successRate,
          joined_at: lawyer.created_at,
          last_active: lawyer.updated_at
        }
      })
    )

    logger.info('Lawyers retrieved successfully', {
      userId: session.user.id,
      count: lawyersWithStats.length
    })

    return NextResponse.json({
      lawyers: lawyersWithStats
    })

  } catch (error) {
    logger.error('Error in lawyers GET', error)
    return NextResponse.json(
      { error: 'Erro ao carregar advogados' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/admin/lawyers
 * Create a new lawyer account
 */
export async function POST(request: NextRequest) {
  try {
    // Auth check
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      logger.warn('Unauthorized lawyer creation attempt')
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      )
    }

    const supabase = await createClient()

    // Check if user is admin
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', session.user.id)
      .single()

    if (profile?.role !== 'admin') {
      logger.warn('Non-admin tried to create lawyer', {
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
    const validatedData = createLawyerSchema.parse(body)

    logger.info('Creating new lawyer', {
      userId: session.user.id,
      lawyerEmail: validatedData.email
    })

    // Check if email already exists
    const { data: existingUser } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', validatedData.email)
      .single()

    if (existingUser) {
      return NextResponse.json(
        { error: 'Email já está em uso' },
        { status: 400 }
      )
    }

    // Create lawyer profile
    // Note: In production, this would create an auth user first
    // For now, we create a profile that can be linked later
    const { data: lawyer, error: createError } = await supabase
      .from('profiles')
      .insert({
        email: validatedData.email,
        full_name: validatedData.full_name,
        phone: validatedData.phone,
        oab_number: validatedData.oab_number,
        oab_state: validatedData.oab_state,
        specialties: validatedData.specialties,
        bio: validatedData.bio,
        location: validatedData.location,
        role: validatedData.role,
        status: 'active'
      })
      .select()
      .single()

    if (createError) {
      logger.error('Error creating lawyer', { error: createError })
      throw new Error('Failed to create lawyer')
    }

    logger.info('Lawyer created successfully', {
      userId: session.user.id,
      lawyerId: lawyer.id
    })

    // TODO: Send invitation email with credentials

    return NextResponse.json(lawyer, { status: 201 })

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

    logger.error('Error in lawyers POST', error)
    return NextResponse.json(
      { error: 'Erro ao criar advogado' },
      { status: 500 }
    )
  }
}

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
