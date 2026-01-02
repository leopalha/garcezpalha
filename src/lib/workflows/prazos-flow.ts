/**
 * Fluxo de Prazos (Deadline Tracking)
 * Sistema detecta prazos → Calendar → Email alerts → WhatsApp reminders
 */

import { createClient } from '@/lib/supabase/server'
import { googleCalendar } from '@/lib/calendar/google-calendar-service'
import { sendEmail, sendWhatsApp } from '@/lib/notifications/notification-service'

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
  const supabase = await createClient()

  // Buscar dados do usuário (email e telefone)
  const { data: user } = await supabase
    .from('profiles')
    .select('email, phone, full_name')
    .eq('id', params.userId)
    .single()

  if (!user?.email) {
    console.warn('[Prazos] User not found or no email:', params.userId)
    return
  }

  const deadlineFormatted = formatDate(params.deadlineDate)

  // Enviar Email
  const emailHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background-color: #dc2626; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
        <h2 style="margin: 0;">⚠️ Novo Prazo Cadastrado</h2>
      </div>
      <div style="padding: 30px; background-color: #f9fafb;">
        <p>Olá <strong>${user.full_name || 'Advogado'}</strong>,</p>
        <p>Um novo prazo crítico foi cadastrado e atribuído a você:</p>
        <div style="background-color: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #dc2626;">
          <p style="margin: 5px 0;"><strong>📋 Processo:</strong> ${params.caseNumber || 'N/A'}</p>
          <p style="margin: 5px 0;"><strong>📅 Data:</strong> ${deadlineFormatted}</p>
          <p style="margin: 5px 0;"><strong>📝 Descrição:</strong> ${params.description}</p>
        </div>
        <div style="background-color: #fef2f2; padding: 15px; border-radius: 6px; margin: 20px 0;">
          <p style="margin: 0; color: #991b1b; font-size: 14px;">
            ⏰ <strong>Lembretes Automáticos:</strong> Você receberá notificações por email e WhatsApp antes do vencimento do prazo.
          </p>
        </div>
        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
        <p style="color: #9ca3af; font-size: 12px;">
          <strong>Garcez Palha Advocacia</strong><br/>
          Sistema de Gestão de Prazos
        </p>
      </div>
    </div>
  `

  const emailSent = await sendEmail({
    to: user.email,
    subject: `⚠️ Novo Prazo: ${params.caseNumber || 'Processo'} - ${params.description}`,
    html: emailHtml,
  })

  if (emailSent) {
    console.log('[Prazos] ✅ Email enviado para:', user.email)
  } else {
    console.error('[Prazos] ❌ Falha ao enviar email para:', user.email)
  }

  // Enviar WhatsApp (se telefone disponível)
  if (user.phone) {
    const whatsappMessage = `⚠️ *NOVO PRAZO CADASTRADO*

Olá ${user.full_name || 'Advogado'}! 👋

Um prazo crítico foi atribuído a você:

📋 *Processo:* ${params.caseNumber || 'N/A'}
📅 *Data:* ${deadlineFormatted}
📝 *Descrição:* ${params.description}

⏰ Você receberá lembretes automáticos antes do vencimento.

_Garcez Palha - Sistema de Gestão de Prazos_`

    const whatsappSent = await sendWhatsApp({
      to: user.phone,
      message: whatsappMessage,
    })

    if (whatsappSent) {
      console.log('[Prazos] ✅ WhatsApp enviado para:', user.phone)
    } else {
      console.error('[Prazos] ❌ Falha ao enviar WhatsApp para:', user.phone)
    }
  }

  console.log('[Prazos] ✅ Notificação de novo prazo enviada')
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
  const supabase = await createClient()
  const deadline = reminder.deadline
  const daysUntil = Math.ceil(
    (new Date(deadline.deadline_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
  )

  // Buscar dados do usuário e processo
  const { data: user } = await supabase
    .from('profiles')
    .select('email, full_name')
    .eq('id', reminder.recipient_id || '')
    .single()

  const { data: caso } = await supabase
    .from('processos')
    .select('numero_processo, client:clients!processos_client_id_fkey (full_name)')
    .eq('id', deadline.case_id)
    .single()

  if (!user?.email) {
    console.warn('[Prazos] User not found for reminder:', reminder.id)
    return
  }

  const urgencyColor = daysUntil <= 1 ? '#dc2626' : daysUntil <= 3 ? '#f59e0b' : '#2563eb'
  const urgencyText = daysUntil <= 1 ? 'URGENTE' : daysUntil <= 3 ? 'IMPORTANTE' : 'AVISO'

  const emailHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background-color: ${urgencyColor}; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
        <h2 style="margin: 0;">⏰ ${urgencyText}: Prazo em ${daysUntil} dia(s)</h2>
      </div>
      <div style="padding: 30px; background-color: #f9fafb;">
        <p>Olá <strong>${user.full_name || 'Advogado'}</strong>,</p>
        <p>Este é um lembrete automático de prazo próximo ao vencimento:</p>
        <div style="background-color: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid ${urgencyColor};">
          <p style="margin: 5px 0;"><strong>📋 Processo:</strong> ${caso?.numero_processo || 'N/A'}</p>
          <p style="margin: 5px 0;"><strong>👤 Cliente:</strong> ${Array.isArray(caso?.client) ? caso?.client[0]?.full_name : 'N/A'}</p>
          <p style="margin: 5px 0;"><strong>📅 Vencimento:</strong> ${formatDate(deadline.deadline_date)}</p>
          <p style="margin: 5px 0;"><strong>📝 Descrição:</strong> ${deadline.description}</p>
          <p style="margin: 15px 0 5px 0; font-size: 20px; color: ${urgencyColor};">
            <strong>⏳ Faltam ${daysUntil} dia(s)</strong>
          </p>
        </div>
        ${daysUntil <= 1 ? `
        <div style="background-color: #fef2f2; padding: 15px; border-radius: 6px; margin: 20px 0; border: 2px solid #dc2626;">
          <p style="margin: 0; color: #991b1b; font-size: 16px; font-weight: bold;">
            🚨 ATENÇÃO: Prazo vence AMANHÃ! Tome as providências necessárias imediatamente.
          </p>
        </div>
        ` : ''}
        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
        <p style="color: #9ca3af; font-size: 12px;">
          <strong>Garcez Palha Advocacia</strong><br/>
          Sistema de Gestão de Prazos - Lembrete Automático
        </p>
      </div>
    </div>
  `

  const emailSent = await sendEmail({
    to: user.email,
    subject: `⏰ ${urgencyText}: Prazo em ${daysUntil} dia(s) - ${deadline.description}`,
    html: emailHtml,
  })

  if (emailSent) {
    console.log('[Prazos] ✅ Email lembrete enviado:', {
      deadlineId: deadline.id,
      daysUntil,
      to: user.email,
    })
  } else {
    console.error('[Prazos] ❌ Falha ao enviar email lembrete:', user.email)
    throw new Error('Failed to send email reminder')
  }
}

/**
 * Envia WhatsApp de lembrete
 */
async function enviarWhatsAppLembrete(reminder: DeadlineReminder): Promise<void> {
  const supabase = await createClient()
  const deadline = reminder.deadline
  const daysUntil = Math.ceil(
    (new Date(deadline.deadline_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
  )

  // Buscar dados do usuário e processo
  const { data: user } = await supabase
    .from('profiles')
    .select('phone, full_name')
    .eq('id', reminder.recipient_id || '')
    .single()

  const { data: caso } = await supabase
    .from('processos')
    .select('numero_processo, client:clients!processos_client_id_fkey (full_name)')
    .eq('id', deadline.case_id)
    .single()

  if (!user?.phone) {
    console.warn('[Prazos] User has no phone for WhatsApp reminder:', reminder.id)
    return
  }

  const urgencyEmoji = daysUntil <= 1 ? '🚨' : '⚠️'
  const deadlineFormatted = formatDate(deadline.deadline_date)

  const whatsappMessage = `${urgencyEmoji} *LEMBRETE DE PRAZO*

Olá ${user.full_name || 'Advogado'}!

${daysUntil <= 1 ? '🚨 *PRAZO VENCE AMANHÃ!*' : `⏰ Faltam *${daysUntil} dia(s)* para o vencimento`}

📋 *Processo:* ${caso?.numero_processo || 'N/A'}
👤 *Cliente:* ${Array.isArray(caso?.client) ? caso?.client[0]?.full_name : 'N/A'}
📅 *Vencimento:* ${deadlineFormatted}
📝 *Descrição:* ${deadline.description}

${daysUntil <= 1 ? '⚠️ *Tome as providências necessárias IMEDIATAMENTE!*' : '💡 Prepare-se com antecedência'}

_Garcez Palha - Sistema de Gestão de Prazos_`

  const whatsappSent = await sendWhatsApp({
    to: user.phone,
    message: whatsappMessage,
  })

  if (whatsappSent) {
    console.log('[Prazos] ✅ WhatsApp lembrete enviado:', {
      deadlineId: deadline.id,
      daysUntil,
      to: user.phone,
    })
  } else {
    console.error('[Prazos] ❌ Falha ao enviar WhatsApp lembrete:', user.phone)
    throw new Error('Failed to send WhatsApp reminder')
  }
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
