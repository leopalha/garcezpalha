/**
 * Appointment Automation Service
 *
 * Automated reminders and follow-ups for appointments
 *
 * Features:
 * - Reminders 24h before appointment (email)
 * - Reminders 2h before appointment (WhatsApp)
 * - Follow-up 3 days after ("Como foi?")
 * - NPS survey 7 days after (satisfaction)
 * - Upsell offer 30 days after (new services)
 * - Sync appointments to Google Calendar
 *
 * OAB Compliance: All messages include disclaimer
 */

import { createClient } from '@/lib/supabase/server'
import { googleCalendar } from '@/lib/calendar/google-calendar-service'
import { whatsappCloudAPI } from '@/lib/whatsapp/cloud-api'
import { emailService } from '@/lib/email/email-service'

interface Appointment {
  id: string
  client_name: string
  client_email: string
  client_phone?: string
  service_type: string
  scheduled_at: Date
  status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled' | 'no_show'
  reminder_24h_sent: boolean
  reminder_2h_sent: boolean
  followup_3d_sent: boolean
  nps_7d_sent: boolean
  upsell_30d_sent: boolean
  google_calendar_event_id?: string
}

class AppointmentAutomationService {
  private readonly OAB_DISCLAIMER = `\n\n⚠️ Esta é uma mensagem automática. Não substitui consulta jurídica. Para dúvidas, entre em contato com seu advogado.`

  /**
   * Send 24h reminder (email)
   */
  async send24hReminder(appointment: Appointment): Promise<boolean> {
    try {
      console.log(`[Appointment] Sending 24h reminder for ${appointment.id}`)

      const dateStr = appointment.scheduled_at.toLocaleDateString('pt-BR')
      const timeStr = appointment.scheduled_at.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })

      const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #1a365d; color: white; padding: 20px; text-align: center;">
            <h1 style="margin: 0; font-size: 24px;">📅 Lembrete de Consulta</h1>
            <p style="margin: 5px 0 0; opacity: 0.9;">Amanhã!</p>
          </div>
          <div style="padding: 30px; background: #f7f8fa;">
            <p>Olá <strong>${appointment.client_name}</strong>,</p>
            <p>Lembrete da sua consulta agendada:</p>
            <div style="background: white; border-radius: 8px; padding: 20px; margin: 20px 0; border-left: 4px solid #c9a227;">
              <p style="margin: 0 0 10px;">📅 <strong>Data:</strong> ${dateStr}</p>
              <p style="margin: 0 0 10px;">🕐 <strong>Horário:</strong> ${timeStr}</p>
              <p style="margin: 0 0 10px;">📋 <strong>Serviço:</strong> ${appointment.service_type}</p>
              <p style="margin: 0 0 10px;">📍 <strong>Local:</strong> Av. das Américas 13685, Barra da Tijuca, Rio de Janeiro/RJ</p>
              <p style="margin: 0;">📞 <strong>Telefone:</strong> (21) 99535-4010</p>
            </div>
            <p style="color: #666;">Caso precise reagendar, entre em contato conosco.</p>
            <div style="background: #fef3c7; border-radius: 6px; padding: 15px; margin-top: 20px; font-size: 14px; color: #92400e;">
              ⚠️ Esta é uma mensagem automática. Não substitui consulta jurídica. Para dúvidas, entre em contato com seu advogado.
            </div>
          </div>
          <div style="background: #1a365d; color: white; padding: 15px; text-align: center; font-size: 12px;">
            <p style="margin: 0;">Garcez Palha - Consultoria Jurídica & Pericial</p>
            <p style="margin: 5px 0 0;">📞 (21) 99535-4010 | contato@garcezpalha.com</p>
          </div>
        </div>
      `
      const text = `Olá ${appointment.client_name},\n\nLembrete da sua consulta agendada:\n\n📅 Data: ${dateStr}\n🕐 Horário: ${timeStr}\n📋 Serviço: ${appointment.service_type}\n📍 Local: Av. das Américas 13685, Barra da Tijuca, Rio de Janeiro/RJ\n📞 Telefone: (21) 99535-4010\n\nCaso precise reagendar, entre em contato conosco.\n\n⚠️ Esta é uma mensagem automática. Não substitui consulta jurídica.\n\nGarcez Palha - (21) 99535-4010`

      const sent = await emailService.sendCustomEmail({
        to: appointment.client_email,
        subject: `Lembrete: Consulta amanhã - ${appointment.service_type}`,
        html,
        text,
        tags: ['appointment', 'reminder-24h'],
        metadata: { appointmentId: appointment.id },
      })

      if (sent) {
        const supabase = await createClient()
        await supabase
          .from('appointments')
          .update({ reminder_24h_sent: true })
          .eq('id', appointment.id)
      }

      return sent
    } catch (error) {
      console.error('[Appointment] Error sending 24h reminder:', error)
      return false
    }
  }

  /**
   * Send 2h reminder (WhatsApp)
   */
  async send2hReminder(appointment: Appointment): Promise<boolean> {
    if (!appointment.client_phone || !whatsappCloudAPI.isConfigured()) {
      return false
    }

    try {
      console.log(`[Appointment] Sending 2h WhatsApp reminder for ${appointment.id}`)

      const message = `📅 *Lembrete de Consulta*

Olá ${appointment.client_name},

Sua consulta é daqui a 2 horas!

🕐 Horário: ${appointment.scheduled_at.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
📋 Serviço: ${appointment.service_type}

📍 Endereço:
Av. das Américas 13685
Barra da Tijuca, Rio de Janeiro/RJ

Qualquer dúvida, ligue: (21) 99535-4010
${this.OAB_DISCLAIMER}

Nos vemos em breve! 👋`

      await whatsappCloudAPI.sendMessage(appointment.client_phone, message, true)

      // Mark reminder as sent
      const supabase = await createClient()
      await supabase
        .from('appointments')
        .update({ reminder_2h_sent: true })
        .eq('id', appointment.id)

      return true
    } catch (error) {
      console.error('[Appointment] Error sending 2h reminder:', error)
      return false
    }
  }

  /**
   * Send follow-up 3 days after ("Como foi?")
   */
  async send3dFollowup(appointment: Appointment): Promise<boolean> {
    try {
      console.log(`[Appointment] Sending 3-day follow-up for ${appointment.id}`)

      const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #1a365d; color: white; padding: 20px; text-align: center;">
            <h1 style="margin: 0; font-size: 24px;">Como foi sua consulta?</h1>
          </div>
          <div style="padding: 30px; background: #f7f8fa;">
            <p>Olá <strong>${appointment.client_name}</strong>,</p>
            <p>Esperamos que sua consulta sobre <strong>${appointment.service_type}</strong> tenha sido produtiva!</p>
            <p>Gostaríamos muito de saber como foi sua experiência:</p>
            <ul style="color: #333;">
              <li>Todas as suas dúvidas foram esclarecidas?</li>
              <li>Precisa de algum acompanhamento adicional?</li>
              <li>Há algo mais em que possamos ajudá-lo?</li>
            </ul>
            <p style="text-align: center; margin: 30px 0;">
              <a href="mailto:contato@garcezpalha.com?subject=Feedback - ${appointment.service_type}" style="display: inline-block; background: #c9a227; color: white; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-weight: bold;">Responder por Email</a>
            </p>
            <p style="color: #666; text-align: center;">Ou ligue: (21) 99535-4010</p>
            <div style="background: #fef3c7; border-radius: 6px; padding: 15px; margin-top: 20px; font-size: 14px; color: #92400e;">
              ⚠️ Esta é uma mensagem automática. Não substitui consulta jurídica.
            </div>
          </div>
          <div style="background: #1a365d; color: white; padding: 15px; text-align: center; font-size: 12px;">
            <p style="margin: 0;">Garcez Palha - Consultoria Jurídica & Pericial</p>
          </div>
        </div>
      `
      const text = `Olá ${appointment.client_name},\n\nEsperamos que sua consulta sobre ${appointment.service_type} tenha sido produtiva!\n\nGostaríamos muito de saber como foi sua experiência:\n- Todas as suas dúvidas foram esclarecidas?\n- Precisa de algum acompanhamento adicional?\n- Há algo mais em que possamos ajudá-lo?\n\nResponda este email ou ligue: (21) 99535-4010\n\nGarcez Palha`

      const sent = await emailService.sendCustomEmail({
        to: appointment.client_email,
        subject: `Como foi sua consulta? - Garcez Palha`,
        html,
        text,
        tags: ['appointment', 'followup-3d'],
        metadata: { appointmentId: appointment.id },
      })

      if (sent) {
        const supabase = await createClient()
        await supabase
          .from('appointments')
          .update({ followup_3d_sent: true })
          .eq('id', appointment.id)
      }

      return sent
    } catch (error) {
      console.error('[Appointment] Error sending 3-day follow-up:', error)
      return false
    }
  }

  /**
   * Send NPS survey 7 days after
   */
  async send7dNPS(appointment: Appointment): Promise<boolean> {
    try {
      console.log(`[Appointment] Sending 7-day NPS for ${appointment.id}`)

      const npsLink = `https://garcezpalha.com/nps/${appointment.id}`

      const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #c9a227; color: white; padding: 20px; text-align: center;">
            <h1 style="margin: 0; font-size: 24px;">Avalie nossos serviços</h1>
          </div>
          <div style="padding: 30px; background: #f7f8fa;">
            <p>Olá <strong>${appointment.client_name}</strong>,</p>
            <p>Em uma escala de 0 a 10, quanto você recomendaria nossos serviços a um amigo ou colega?</p>
            <p style="text-align: center; margin: 30px 0;">
              <a href="${npsLink}" style="display: inline-block; background: #1a365d; color: white; text-decoration: none; padding: 15px 30px; border-radius: 6px; font-weight: bold; font-size: 18px;">Avaliar Agora</a>
            </p>
            <p style="color: #666; text-align: center;">Sua opinião é muito importante para nós!</p>
          </div>
          <div style="background: #1a365d; color: white; padding: 15px; text-align: center; font-size: 12px;">
            <p style="margin: 0;">Garcez Palha - Consultoria Jurídica & Pericial</p>
          </div>
        </div>
      `
      const text = `Olá ${appointment.client_name},\n\nEm uma escala de 0 a 10, quanto você recomendaria nossos serviços a um amigo ou colega?\n\nClique aqui para avaliar: ${npsLink}\n\nSua opinião é muito importante para nós!\n\nGarcez Palha`

      const sent = await emailService.sendCustomEmail({
        to: appointment.client_email,
        subject: `Avalie nossa consultoria - Garcez Palha`,
        html,
        text,
        tags: ['appointment', 'nps-7d'],
        metadata: { appointmentId: appointment.id },
      })

      if (sent) {
        const supabase = await createClient()
        await supabase
          .from('appointments')
          .update({ nps_7d_sent: true })
          .eq('id', appointment.id)
      }

      return sent
    } catch (error) {
      console.error('[Appointment] Error sending 7-day NPS:', error)
      return false
    }
  }

  /**
   * Send upsell offer 30 days after
   */
  async send30dUpsell(appointment: Appointment): Promise<boolean> {
    try {
      console.log(`[Appointment] Sending 30-day upsell for ${appointment.id}`)

      const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #1a365d; color: white; padding: 20px; text-align: center;">
            <h1 style="margin: 0; font-size: 24px;">Conheça nossos outros serviços</h1>
          </div>
          <div style="padding: 30px; background: #f7f8fa;">
            <p>Olá <strong>${appointment.client_name}</strong>,</p>
            <p>Além de <strong>${appointment.service_type}</strong>, também oferecemos:</p>
            <div style="background: white; border-radius: 8px; padding: 20px; margin: 20px 0;">
              <p style="margin: 10px 0;">📋 <strong>Direito Imobiliário</strong> - Compra, venda, locação</p>
              <p style="margin: 10px 0;">⚖️ <strong>Direito Criminal</strong> - Defesa e recursos</p>
              <p style="margin: 10px 0;">📄 <strong>Perícia de Documentos</strong> - Análise de autenticidade</p>
              <p style="margin: 10px 0;">🏠 <strong>Avaliação de Imóveis</strong> - Laudos técnicos</p>
              <p style="margin: 10px 0;">🩺 <strong>Perícia Médica</strong> - Avaliações médico-legais</p>
              <p style="margin: 10px 0;">💼 <strong>Secretaria Remota</strong> - Serviços jurídicos à distância</p>
            </div>
            <p style="text-align: center; margin: 30px 0;">
              <a href="https://garcezpalha.com/servicos" style="display: inline-block; background: #c9a227; color: white; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-weight: bold;">Ver Todos os Serviços</a>
            </p>
            <p style="color: #666; text-align: center;">📞 (21) 99535-4010 | contato@garcezpalha.com</p>
            <div style="background: #fef3c7; border-radius: 6px; padding: 15px; margin-top: 20px; font-size: 14px; color: #92400e;">
              ⚠️ Esta é uma mensagem automática. Não substitui consulta jurídica.
            </div>
          </div>
          <div style="background: #1a365d; color: white; padding: 15px; text-align: center; font-size: 12px;">
            <p style="margin: 0;">Garcez Palha - Consultoria Jurídica & Pericial</p>
          </div>
        </div>
      `
      const text = `Olá ${appointment.client_name},\n\nAlém de ${appointment.service_type}, também oferecemos:\n\n📋 Direito Imobiliário\n⚖️ Direito Criminal\n📄 Perícia de Documentos\n🏠 Avaliação de Imóveis\n🩺 Perícia Médica\n💼 Secretaria Remota\n\nCaso precise de algum desses serviços, estamos à disposição!\n\n📞 (21) 99535-4010\n📧 contato@garcezpalha.com\n\nGarcez Palha`

      const sent = await emailService.sendCustomEmail({
        to: appointment.client_email,
        subject: `Outros serviços que podem te ajudar - Garcez Palha`,
        html,
        text,
        tags: ['appointment', 'upsell-30d'],
        metadata: { appointmentId: appointment.id },
      })

      if (sent) {
        const supabase = await createClient()
        await supabase
          .from('appointments')
          .update({ upsell_30d_sent: true })
          .eq('id', appointment.id)
      }

      return sent
    } catch (error) {
      console.error('[Appointment] Error sending 30-day upsell:', error)
      return false
    }
  }

  /**
   * Sync appointment to Google Calendar
   */
  async syncToCalendar(appointment: Appointment): Promise<string | null> {
    if (!googleCalendar.isConfigured()) {
      return null
    }

    try {
      const endDate = new Date(appointment.scheduled_at)
      endDate.setHours(endDate.getHours() + 1) // 1 hour duration

      const eventId = await googleCalendar.createDeadlineEvent({
        deadlineId: appointment.id,
        summary: `Consulta: ${appointment.client_name} - ${appointment.service_type}`,
        description: `
          Cliente: ${appointment.client_name}
          Email: ${appointment.client_email}
          Telefone: ${appointment.client_phone || 'N/A'}
          Serviço: ${appointment.service_type}
        `,
        startDate: appointment.scheduled_at,
        endDate,
        reminders: [1], // 1 day before (in hours: 24)
      })

      if (eventId) {
        const supabase = await createClient()
        await supabase
          .from('appointments')
          .update({ google_calendar_event_id: eventId })
          .eq('id', appointment.id)
      }

      return eventId
    } catch (error) {
      console.error('[Appointment] Error syncing to calendar:', error)
      return null
    }
  }

  /**
   * Run all automated reminders and follow-ups (called by cron job)
   */
  async processAutomations(): Promise<{
    success: boolean
    reminders24h: number
    reminders2h: number
    followups3d: number
    nps7d: number
    upsell30d: number
  }> {
    const supabase = await createClient()

    try {
      console.log('[Appointment Automation] Starting automation cycle...')

      let reminders24h = 0
      let reminders2h = 0
      let followups3d = 0
      let nps7d = 0
      let upsell30d = 0

      // Get all appointments
      const { data: appointments, error } = await supabase
        .from('appointments')
        .select('*')
        .in('status', ['scheduled', 'confirmed', 'completed'])

      if (error) throw error

      const now = new Date()

      for (const appt of appointments || []) {
        const scheduledAt = new Date(appt.scheduled_at)
        const hoursDiff = (scheduledAt.getTime() - now.getTime()) / (1000 * 60 * 60)
        const daysSince = (now.getTime() - scheduledAt.getTime()) / (1000 * 60 * 60 * 24)

        // 24h reminder (email)
        if (
          !appt.reminder_24h_sent &&
          hoursDiff >= 23 &&
          hoursDiff <= 25 &&
          ['scheduled', 'confirmed'].includes(appt.status)
        ) {
          if (await this.send24hReminder(appt)) reminders24h++
        }

        // 2h reminder (WhatsApp)
        if (
          !appt.reminder_2h_sent &&
          hoursDiff >= 1.5 &&
          hoursDiff <= 2.5 &&
          ['scheduled', 'confirmed'].includes(appt.status)
        ) {
          if (await this.send2hReminder(appt)) reminders2h++
        }

        // 3-day follow-up
        if (
          !appt.followup_3d_sent &&
          daysSince >= 3 &&
          daysSince <= 4 &&
          appt.status === 'completed'
        ) {
          if (await this.send3dFollowup(appt)) followups3d++
        }

        // 7-day NPS
        if (
          !appt.nps_7d_sent &&
          daysSince >= 7 &&
          daysSince <= 8 &&
          appt.status === 'completed'
        ) {
          if (await this.send7dNPS(appt)) nps7d++
        }

        // 30-day upsell
        if (
          !appt.upsell_30d_sent &&
          daysSince >= 30 &&
          daysSince <= 31 &&
          appt.status === 'completed'
        ) {
          if (await this.send30dUpsell(appt)) upsell30d++
        }
      }

      console.log('[Appointment Automation] Cycle complete:', {
        reminders24h,
        reminders2h,
        followups3d,
        nps7d,
        upsell30d,
      })

      return {
        success: true,
        reminders24h,
        reminders2h,
        followups3d,
        nps7d,
        upsell30d,
      }
    } catch (error) {
      console.error('[Appointment Automation] Error:', error)
      return {
        success: false,
        reminders24h: 0,
        reminders2h: 0,
        followups3d: 0,
        nps7d: 0,
        upsell30d: 0,
      }
    }
  }
}

// Export singleton
export const appointmentAutomation = new AppointmentAutomationService()
