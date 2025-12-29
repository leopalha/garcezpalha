/**
 * Fluxo de Prazos (Deadline Tracking)
 * Sistema detecta prazos → Calendar → Email alerts → WhatsApp reminders
 */

import { createClient } from '@/lib/supabase/server'
import { googleCalendar } from '@/lib/calendar/google-calendar-service'

/**
 * Database type definitions
 */
interface Processo {
  id: string
  numero_processo?: string
  client?: {
    full_name?: string
  }
}

interface Deadline {
  id: string
  deadline_date: string
  description: string
  case_id: string
  status: string
}

interface DeadlineReminder {
  id: string
  deadline_id: string
  reminder_time: string
  channel: string
  status: string
  recipient_id?: string
  deadline: Deadline
}

export interface PrazosInput {
  caseId: string
  deadlineType: string // 'prazo_judicial', 'prazo_administrativo', 'prazo_interno'
  deadlineDate: string // ISO date
  description: string
  notifyBefore?: number[] // Days before to notify [7, 3, 1]
  assignedTo?: string // User ID
}

export interface PrazosOutput {
  deadlineId: string
  calendarEventId?: string
  remindersScheduled: number
  success: boolean
}

/**
 * Executa fluxo completo de gestão de prazos
 */
export async function executePrazosFlow(
  input: PrazosInput
): Promise<PrazosOutput> {
  const supabase = await createClient()

  // 1. Buscar dados do caso
  const { data: processo } = await supabase
    .from('processos')
    .select('*, client:clients!processos_client_id_fkey (*)')
    .eq('id', input.caseId)
    .single()

  if (!processo) {
    throw new Error('Case not found')
  }

  // 2. Criar prazo no banco
  const { data: deadline, error } = await supabase
    .from('deadlines')
    .insert({
      case_id: input.caseId,
      deadline_type: input.deadlineType,
      deadline_date: input.deadlineDate,
      description: input.description,
      status: 'pending',
      assigned_to: input.assignedTo || null,
      notified_at: null,
    })
    .select()
    .single()

  if (error || !deadline) {
    throw new Error('Failed to create deadline')
  }

  // 3. Criar evento no Google Calendar
  let calendarEventId: string | undefined

  if (googleCalendar.isConfigured()) {
    const deadlineDateTime = new Date(input.deadlineDate)

    calendarEventId = (await googleCalendar.createDeadlineEvent({
      deadlineId: deadline.id,
      summary: `⚖️ ${input.deadlineType.toUpperCase()} - ${processo.numero_processo || 'N/A'}`,
      description: `
📋 Processo: ${processo.numero_processo || 'N/A'}
👤 Cliente: ${processo.client?.full_name || 'N/A'}
📝 Descrição: ${input.description}

⚠️ PRAZO CRÍTICO - Revisar com antecedência
      `.trim(),
      startDate: deadlineDateTime,
      endDate: new Date(deadlineDateTime.getTime() + 60 * 60 * 1000), // 1 hour
      reminders: input.notifyBefore || [7, 3, 1], // Days before
    })) || undefined

    if (calendarEventId) {
      await supabase
        .from('deadlines')
        .update({ google_calendar_event_id: calendarEventId })
        .eq('id', deadline.id)
    }
  }

  // 4. Agendar lembretes automáticos
  const notifyBefore = input.notifyBefore || [7, 3, 1]
  const remindersScheduled = await agendarLembretesPrazos(
    deadline.id,
    input.deadlineDate,
    notifyBefore,
    processo,
    input.assignedTo
  )

  // 5. Notificar advogado responsável imediatamente
  if (input.assignedTo) {
    await notificarAdvogadoNovoPrazo({
      deadlineId: deadline.id,
      userId: input.assignedTo,
      deadlineDate: input.deadlineDate,
      description: input.description,
      caseNumber: processo.numero_processo,
    })
  }

  return {
    deadlineId: deadline.id,
    calendarEventId,
    remindersScheduled,
    success: true,
  }
}

/**
 * Agenda lembretes automáticos para o prazo
 */
async function agendarLembretesPrazos(
  deadlineId: string,
  deadlineDate: string,
  notifyBefore: number[],
  processo: Processo,
  assignedTo?: string
): Promise<number> {
  const supabase = await createClient()
  const deadlineDateTime = new Date(deadlineDate)

  const reminders = []

  for (const daysBefore of notifyBefore) {
    const reminderTime = new Date(deadlineDateTime)
    reminderTime.setDate(reminderTime.getDate() - daysBefore)
    reminderTime.setHours(9, 0, 0, 0) // 9h da manhã

    // Email reminder
    reminders.push({
      deadline_id: deadlineId,
      reminder_time: reminderTime.toISOString(),
      channel: 'email',
      status: 'pending',
      recipient_id: assignedTo,
    })

    // WhatsApp reminder (apenas 1 dia antes)
    if (daysBefore === 1) {
      reminders.push({
        deadline_id: deadlineId,
        reminder_time: reminderTime.toISOString(),
        channel: 'whatsapp',
        status: 'pending',
        recipient_id: assignedTo,
      })
    }
  }

  await supabase.from('deadline_reminders').insert(reminders)

  console.log('[Prazos] ⏰ Lembretes agendados:', {
    deadlineId,
    count: reminders.length,
    notifyBefore,
  })

  return reminders.length
}

/**
 * Notifica advogado sobre novo prazo crítico
 */
async function notificarAdvogadoNovoPrazo(params: {
  deadlineId: string
  userId: string
  deadlineDate: string
  description: string
  caseNumber?: string
}): Promise<void> {
  // TODO: Integrar com Resend para email
  // TODO: Integrar com WhatsApp API para notificação push

  console.log('[Prazos] 📧 Notificação enviada para advogado:', {
    userId: params.userId,
    deadline: params.deadlineDate,
    case: params.caseNumber,
  })

  // Mock email template:
  const emailTemplate = `
    Novo Prazo Cadastrado

    Processo: ${params.caseNumber || 'N/A'}
    Data: ${formatDate(params.deadlineDate)}
    Descrição: ${params.description}

    Você receberá lembretes automáticos antes do vencimento.
  `

  console.log('[Prazos] Email template:', emailTemplate)
}

/**
 * Cron job: Processa lembretes pendentes
 * Deve rodar a cada 1 hora
 */
export async function processarLembretesPendentes(): Promise<{
  processed: number
  sent: number
  failed: number
}> {
  const supabase = await createClient()
  const now = new Date()

  // Buscar lembretes pendentes que já passaram do horário
  const { data: reminders } = await supabase
    .from('deadline_reminders')
    .select('*, deadline:deadlines!deadline_reminders_deadline_id_fkey (*)')
    .eq('status', 'pending')
    .lte('reminder_time', now.toISOString())
    .limit(100)

  if (!reminders || reminders.length === 0) {
    return { processed: 0, sent: 0, failed: 0 }
  }

  let sent = 0
  let failed = 0

  for (const reminder of reminders) {
    try {
      if (reminder.channel === 'email') {
        await enviarEmailLembrete(reminder)
      } else if (reminder.channel === 'whatsapp') {
        await enviarWhatsAppLembrete(reminder)
      }

      // Marcar como enviado
      await supabase
        .from('deadline_reminders')
        .update({
          status: 'sent',
          sent_at: new Date().toISOString(),
        })
        .eq('id', reminder.id)

      sent++
    } catch (error) {
      console.error('[Prazos] Erro ao enviar lembrete:', error)
      await supabase
        .from('deadline_reminders')
        .update({ status: 'failed' })
        .eq('id', reminder.id)
      failed++
    }
  }

  console.log('[Prazos] ✅ Lembretes processados:', {
    total: reminders.length,
    sent,
    failed,
  })

  return {
    processed: reminders.length,
    sent,
    failed,
  }
}

/**
 * Envia email de lembrete
 */
async function enviarEmailLembrete(reminder: DeadlineReminder): Promise<void> {
  const deadline = reminder.deadline
  const daysUntil = Math.ceil(
    (new Date(deadline.deadline_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
  )

  console.log('[Prazos] 📧 Email lembrete:', {
    deadlineId: deadline.id,
    daysUntil,
    recipientId: reminder.recipient_id,
  })

  // TODO: Integrar com Resend
  // await resend.emails.send({
  //   to: recipientEmail,
  //   subject: `⚠️ Prazo em ${daysUntil} dia(s): ${deadline.description}`,
  //   html: emailTemplate
  // })
}

/**
 * Envia WhatsApp de lembrete
 */
async function enviarWhatsAppLembrete(reminder: DeadlineReminder): Promise<void> {
  const deadline = reminder.deadline

  console.log('[Prazos] 📱 WhatsApp lembrete:', {
    deadlineId: deadline.id,
    recipientId: reminder.recipient_id,
  })

  // TODO: Integrar com WhatsApp Cloud API
  // await whatsapp.sendMessage({
  //   to: recipientPhone,
  //   message: `⚠️ LEMBRETE: Prazo AMANHÃ!\n${deadline.description}`
  // })
}

/**
 * Marca prazo como cumprido
 */
export async function marcarPrazoCumprido(
  deadlineId: string
): Promise<{ success: boolean }> {
  const supabase = await createClient()

  const { error } = await supabase
    .from('deadlines')
    .update({
      status: 'completed',
      completed_at: new Date().toISOString(),
    })
    .eq('id', deadlineId)

  if (error) {
    throw new Error('Failed to mark deadline as completed')
  }

  // Cancelar lembretes pendentes
  await supabase
    .from('deadline_reminders')
    .update({ status: 'cancelled' })
    .eq('deadline_id', deadlineId)
    .eq('status', 'pending')

  console.log('[Prazos] ✅ Prazo cumprido:', deadlineId)

  return { success: true }
}

/**
 * Lista prazos próximos (próximos 30 dias)
 */
export async function listarPrazosProximos(
  userId?: string
): Promise<any[]> {
  const supabase = await createClient()
  const today = new Date()
  const thirtyDaysFromNow = new Date()
  thirtyDaysFromNow.setDate(today.getDate() + 30)

  let query = supabase
    .from('deadlines')
    .select('*, case:processos!deadlines_case_id_fkey (numero_processo, client:clients!processos_client_id_fkey (full_name))')
    .eq('status', 'pending')
    .gte('deadline_date', today.toISOString())
    .lte('deadline_date', thirtyDaysFromNow.toISOString())
    .order('deadline_date', { ascending: true })

  if (userId) {
    query = query.eq('assigned_to', userId)
  }

  const { data: deadlines } = await query

  return deadlines || []
}

/**
 * Função helper
 */
function formatDate(isoDate: string): string {
  return new Date(isoDate).toLocaleDateString('pt-BR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}
