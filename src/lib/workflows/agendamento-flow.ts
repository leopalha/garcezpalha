/**
 * Fluxo de Agendamento
 * Agent sugere horários → Calendar sync → Email confirm → Reminders
 */

import { createClient } from '@/lib/supabase/server'
import { googleCalendar } from '@/lib/calendar/google-calendar-service'

/**
 * Database type definitions
 */
interface Lead {
  id: string
  client_name: string
  email?: string
  phone?: string
}

export interface AgendamentoInput {
  leadId: string
  serviceType: string
  preferredDates?: string[] // ISO dates
  notes?: string
}

export interface AgendamentoOutput {
  appointmentId: string
  scheduledDate: string
  scheduledTime: string
  calendarEventId?: string
  confirmationSent: boolean
}

/**
 * Executa fluxo completo de agendamento
 */
export async function executeAgendamentoFlow(
  input: AgendamentoInput
): Promise<AgendamentoOutput> {
  const supabase = await createClient()

  // 1. Buscar dados do lead
  const { data: lead } = await supabase
    .from('leads')
    .select('*')
    .eq('id', input.leadId)
    .single()

  if (!lead) {
    throw new Error('Lead not found')
  }

  // 2. Sugerir horários disponíveis
  const availableSlots = await getAvailableTimeSlots(input.preferredDates)

  // 3. Selecionar melhor horário (primeiro disponível ou preferência do lead)
  const selectedSlot = availableSlots[0]
  if (!selectedSlot) {
    throw new Error('No available time slots')
  }

  // 4. Criar agendamento no banco
  const { data: appointment, error } = await supabase
    .from('appointments')
    .insert({
      lead_id: input.leadId,
      user_id: null, // Lead ainda não é cliente
      appointment_type: input.serviceType,
      scheduled_date: selectedSlot.date,
      scheduled_time: selectedSlot.time,
      status: 'scheduled',
      location: 'Google Meet', // ou presencial
      notes: input.notes || '',
    })
    .select()
    .single()

  if (error || !appointment) {
    throw new Error('Failed to create appointment')
  }

  // 5. Criar evento no Google Calendar
  let calendarEventId: string | undefined

  if (googleCalendar.isConfigured()) {
    calendarEventId = (await googleCalendar.createDeadlineEvent({
      deadlineId: appointment.id,
      summary: `Reunião - ${lead.full_name} - ${input.serviceType}`,
      description: `Lead: ${lead.full_name}\nEmail: ${lead.email}\nTelefone: ${lead.phone}\n\n${input.notes || ''}`,
      startDate: new Date(`${selectedSlot.date}T${selectedSlot.time}`),
      endDate: new Date(`${selectedSlot.date}T${addOneHour(selectedSlot.time)}`),
      reminders: [1, 0], // 24h e no momento
    })) || undefined

    if (calendarEventId) {
      await supabase
        .from('appointments')
        .update({ google_calendar_event_id: calendarEventId })
        .eq('id', appointment.id)
    }
  }

  // 6. Enviar confirmação por email
  await enviarConfirmacaoAgendamento({
    leadName: lead.full_name,
    leadEmail: lead.email,
    serviceType: input.serviceType,
    date: selectedSlot.date,
    time: selectedSlot.time,
    location: 'Google Meet',
  })

  // 7. Agendar lembretes automáticos
  await agendarLembretes(appointment.id, lead, selectedSlot)

  return {
    appointmentId: appointment.id,
    scheduledDate: selectedSlot.date,
    scheduledTime: selectedSlot.time,
    calendarEventId,
    confirmationSent: true,
  }
}

/**
 * Busca horários disponíveis
 */
async function getAvailableTimeSlots(
  preferredDates?: string[]
): Promise<Array<{ date: string; time: string }>> {
  // TODO: Integrar com Google Calendar API para verificar disponibilidade real

  // Mock: Retorna horários de segunda a sexta, 9h às 18h
  const slots = []
  const today = new Date()

  for (let i = 1; i <= 7; i++) {
    const date = new Date(today)
    date.setDate(today.getDate() + i)

    // Skip weekends
    if (date.getDay() === 0 || date.getDay() === 6) continue

    // Add morning and afternoon slots
    slots.push({
      date: date.toISOString().split('T')[0],
      time: '10:00',
    })
    slots.push({
      date: date.toISOString().split('T')[0],
      time: '14:00',
    })
    slots.push({
      date: date.toISOString().split('T')[0],
      time: '16:00',
    })
  }

  return slots
}

/**
 * Envia email de confirmação
 */
async function enviarConfirmacaoAgendamento(params: {
  leadName: string
  leadEmail: string
  serviceType: string
  date: string
  time: string
  location: string
}): Promise<void> {
  const { emailService } = await import('@/lib/email/email-service')

  console.log('[Agendamento] 📧 Enviando confirmação para:', params.leadEmail)

  const formattedDate = formatDate(params.date)

  await emailService.sendAppointmentConfirmation({
    to: params.leadEmail,
    name: params.leadName,
    date: formattedDate,
    time: params.time,
    service: params.serviceType,
    location: params.location,
  })

  console.log('[Agendamento] ✅ Confirmação enviada com sucesso')
}

/**
 * Agenda lembretes automáticos (24h e 2h antes)
 */
async function agendarLembretes(
  appointmentId: string,
  lead: Lead,
  slot: { date: string; time: string }
): Promise<void> {
  // TODO: Implementar via cron job ou sistema de filas
  // Criar registros na tabela de reminders que serão processados por cron

  const supabase = await createClient()

  const appointmentDateTime = new Date(`${slot.date}T${slot.time}`)

  // Lembrete 24h antes
  const reminder24h = new Date(appointmentDateTime)
  reminder24h.setHours(reminder24h.getHours() - 24)

  // Lembrete 2h antes
  const reminder2h = new Date(appointmentDateTime)
  reminder2h.setHours(reminder2h.getHours() - 2)

  await supabase.from('appointment_reminders').insert([
    {
      appointment_id: appointmentId,
      reminder_time: reminder24h.toISOString(),
      channel: 'email',
      status: 'pending',
    },
    {
      appointment_id: appointmentId,
      reminder_time: reminder2h.toISOString(),
      channel: 'whatsapp',
      status: 'pending',
    },
  ])

  console.log('[Agendamento] ⏰ Lembretes agendados:', {
    email24h: reminder24h,
    whatsapp2h: reminder2h,
  })
}

/**
 * Função helper
 */
function addOneHour(time: string): string {
  const [hours, minutes] = time.split(':').map(Number)
  const newHours = (hours + 1) % 24
  return `${String(newHours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`
}

function formatDate(isoDate: string): string {
  return new Date(isoDate).toLocaleDateString('pt-BR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}
