import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/options'
import { createLogger } from '@/lib/logger'
import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'
import { formatZodErrors } from '@/lib/zod-helpers'

const logger = createLogger('api:appointments')

const createAppointmentSchema = z.object({
  clientId: z.string().uuid().optional(),
  clientName: z.string().min(1).optional(),
  clientEmail: z.string().email().optional(),
  title: z.string().min(1, 'Título obrigatório'),
  description: z.string().optional(),
  scheduledAt: z.string(), // ISO date string
  durationMinutes: z.number().min(15).max(480).default(60),
  location: z.string().optional(),
  appointmentType: z.enum(['consultation', 'hearing', 'meeting', 'other']).default('consultation'),
  notes: z.string().optional(),
})

/**
 * POST /api/appointments
 * Create a new appointment
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const supabase = await createClient()

    const body = await request.json()
    const validatedData = createAppointmentSchema.parse(body)

    logger.info('Creating appointment', { userId: session.user.id })

    // Check if user is admin or lawyer
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', session.user.id)
      .single()

    if (!profile || !['admin', 'lawyer'].includes(profile.role)) {
      return NextResponse.json({ error: 'Acesso negado. Apenas advogados podem criar agendamentos.' }, { status: 403 })
    }

    // If clientId not provided but name/email provided, try to find or create client
    let clientId = validatedData.clientId

    if (!clientId && (validatedData.clientName || validatedData.clientEmail)) {
      if (!validatedData.clientEmail) {
        return NextResponse.json({
          error: 'Email do cliente é obrigatório quando não há clientId'
        }, { status: 400 })
      }

      // Try to find existing client by email
      const { data: existingClient } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', validatedData.clientEmail)
        .eq('role', 'client')
        .single()

      if (existingClient) {
        clientId = existingClient.id
      } else if (validatedData.clientName) {
        // Create new client profile
        const { data: newClient, error: clientError } = await supabase
          .from('profiles')
          .insert({
            email: validatedData.clientEmail,
            name: validatedData.clientName,
            role: 'client',
          })
          .select('id')
          .single()

        if (clientError) {
          logger.error('Error creating client profile', clientError)
          return NextResponse.json({
            error: 'Erro ao criar perfil do cliente'
          }, { status: 500 })
        }

        clientId = newClient.id
      }
    }

    if (!clientId) {
      return NextResponse.json({
        error: 'Cliente obrigatório. Forneça clientId ou clientName + clientEmail.'
      }, { status: 400 })
    }

    // Create appointment
    const { data: appointment, error: createError } = await supabase
      .from('appointments')
      .insert({
        client_id: clientId,
        lawyer_id: session.user.id,
        title: validatedData.title,
        description: validatedData.description || null,
        scheduled_at: validatedData.scheduledAt,
        duration_minutes: validatedData.durationMinutes,
        location: validatedData.location || null,
        appointment_type: validatedData.appointmentType,
        notes: validatedData.notes || null,
        status: 'scheduled',
      })
      .select()
      .single()

    if (createError) {
      logger.error('Error creating appointment', createError)
      throw createError
    }

    logger.info('Appointment created successfully', { appointmentId: appointment.id })

    return NextResponse.json({
      success: true,
      appointment,
      message: 'Agendamento criado com sucesso'
    }, { status: 201 })

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        error: 'Dados inválidos',
        details: formatZodErrors(error),
      }, { status: 400 })
    }

    logger.error('Error in POST appointments', error)
    return NextResponse.json({
      error: 'Erro ao criar agendamento'
    }, { status: 500 })
  }
}

/**
 * GET /api/appointments
 * List appointments for current user
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const supabase = await createClient()

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')

    logger.info('Fetching appointments', { userId: session.user.id })

    let query = supabase
      .from('appointments')
      .select(`
        *,
        client:profiles!appointments_client_id_fkey(id, name, email),
        lawyer:profiles!appointments_lawyer_id_fkey(id, name, email)
      `)
      .or(`client_id.eq.${session.user.id},lawyer_id.eq.${session.user.id}`)
      .order('scheduled_at', { ascending: true })

    if (status) {
      query = query.eq('status', status)
    }

    if (startDate) {
      query = query.gte('scheduled_at', startDate)
    }

    if (endDate) {
      query = query.lte('scheduled_at', endDate)
    }

    const { data: appointments, error } = await query

    if (error) {
      logger.error('Error fetching appointments', error)
      throw error
    }

    return NextResponse.json({
      success: true,
      appointments: appointments || []
    })

  } catch (error) {
    logger.error('Error in GET appointments', error)
    return NextResponse.json({
      error: 'Erro ao buscar agendamentos'
    }, { status: 500 })
  }
}

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
