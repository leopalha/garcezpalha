import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { googleCalendar } from '@/lib/calendar/google-calendar-service'
import { createClient } from '@/lib/supabase/server'
import { logger } from '@/lib/logger'

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET })
    if (!token || (token.role !== 'admin' && token.role !== 'lawyer')) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const { deadlineId } = await request.json()

    if (!deadlineId) {
      return NextResponse.json({ error: 'ID do prazo não fornecido' }, { status: 400 })
    }

    // Check if Google Calendar is configured
    if (!googleCalendar.isConfigured()) {
      return NextResponse.json({
        error: 'Google Calendar não configurado',
        message: 'Configure as credenciais do Google Calendar nas variáveis de ambiente.',
        configured: false,
      }, { status: 503 })
    }

    // Get deadline data from database
    const supabase = await createClient()
    const { data: deadline, error: fetchError } = await supabase
      .from('process_deadlines')
      .select(`
        *,
        alert:process_alerts(
          process_number,
          tribunal
        )
      `)
      .eq('id', deadlineId)
      .single()

    if (fetchError || !deadline) {
      return NextResponse.json({ error: 'Prazo não encontrado' }, { status: 404 })
    }

    // Sync to Google Calendar
    const eventId = await googleCalendar.syncDeadline(
      deadline.id,
      deadline.alert?.process_number || 'Processo não identificado',
      deadline.deadline_type || 'Prazo Processual',
      new Date(deadline.due_date),
      deadline.description || '',
      deadline.status as 'pending' | 'completed' | 'cancelled' | 'expired'
    )

    if (eventId) {
      return NextResponse.json({
        success: true,
        eventId,
        message: 'Prazo sincronizado com Google Calendar!',
      })
    } else {
      return NextResponse.json({
        success: false,
        message: 'Prazo removido do calendário (status não é pendente)',
      })
    }
  } catch (error) {
    logger.error('Calendar sync error:', error)
    return NextResponse.json(
      { error: 'Erro ao sincronizar com Google Calendar' },
      { status: 500 }
    )
  }
}
