import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/options'
import { createLogger } from '@/lib/logger'
import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'
import { formatZodErrors } from '@/lib/zod-helpers'

const logger = createLogger('api:admin:security-events')

const createSecurityEventSchema = z.object({
  event_type: z.enum(['failed_login', 'suspicious_activity', 'data_breach', 'unauthorized_access', 'brute_force', 'sql_injection', 'xss_attempt']),
  severity: z.enum(['low', 'medium', 'high', 'critical']).default('medium'),
  description: z.string().min(1),
  metadata: z.record(z.string(), z.any()).optional(),
  user_id: z.string().uuid().optional(),
  user_email: z.string().email().optional()
})

/**
 * POST /api/admin/security-events
 * Create security event (admin only or automated system)
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const supabase = await createClient()

    // Check if user is admin
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', session.user.id)
      .single()

    if (!profile || profile.role !== 'admin') {
      return NextResponse.json({ error: 'Acesso negado' }, { status: 403 })
    }

    const body = await request.json()
    const validatedData = createSecurityEventSchema.parse(body)

    const ipAddress = request.headers.get('x-forwarded-for') ||
      request.headers.get('x-real-ip') ||
      'unknown'
    const userAgent = request.headers.get('user-agent') || 'unknown'

    logger.warn('Security event created', {
      eventType: validatedData.event_type,
      severity: validatedData.severity,
      userId: validatedData.user_id
    })

    const { data: event, error: createError } = await supabase
      .from('security_events')
      .insert({
        event_type: validatedData.event_type,
        severity: validatedData.severity,
        description: validatedData.description,
        metadata: validatedData.metadata || {},
        user_id: validatedData.user_id || null,
        user_email: validatedData.user_email || null,
        ip_address: ipAddress,
        user_agent: userAgent,
        status: 'open'
      })
      .select()
      .single()

    if (createError) {
      logger.error('Error creating security event', createError)
      throw createError
    }

    // If critical, send alert (in production, integrate with PagerDuty, Discord, etc)
    if (validatedData.severity === 'critical') {
      logger.error('CRITICAL SECURITY EVENT', {
        eventId: event.id,
        type: validatedData.event_type,
        description: validatedData.description
      })
      // TODO: Send alert to admins
    }

    return NextResponse.json({ event }, { status: 201 })

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        error: 'Dados inválidos',
        details: formatZodErrors(error),
      }, { status: 400 })
    }

    logger.error('Error in security events', error)
    return NextResponse.json({ error: 'Erro ao criar evento de segurança' }, { status: 500 })
  }
}

/**
 * GET /api/admin/security-events
 * List security events (admin only)
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const supabase = await createClient()

    // Check if user is admin
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', session.user.id)
      .single()

    if (!profile || profile.role !== 'admin') {
      return NextResponse.json({ error: 'Acesso negado' }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const eventType = searchParams.get('event_type')
    const severity = searchParams.get('severity')
    const status = searchParams.get('status')
    const limit = parseInt(searchParams.get('limit') || '100')

    let query = supabase
      .from('security_events')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit)

    if (eventType) {
      query = query.eq('event_type', eventType)
    }

    if (severity) {
      query = query.eq('severity', severity)
    }

    if (status) {
      query = query.eq('status', status)
    }

    const { data: events, error } = await query

    if (error) throw error

    return NextResponse.json({ events: events || [] })

  } catch (error) {
    logger.error('Error fetching security events', error)
    return NextResponse.json({ error: 'Erro ao buscar eventos de segurança' }, { status: 500 })
  }
}

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
