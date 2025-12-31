import { NextRequest, NextResponse } from 'next/server'
import { google } from 'googleapis'
import { createRouteHandlerClient } from '@/lib/supabase/route-handler'
import { sendEmail } from '@/lib/email/send'

const calendar = google.calendar('v3')

/**
 * API: POST /api/calendar/book-appointment
 *
 * Cria evento no Google Calendar e envia confirmação por email
 *
 * Body:
 * {
 *   slotStart: "2024-12-30T09:00:00-03:00",
 *   slotEnd: "2024-12-30T10:00:00-03:00",
 *   leadId: "uuid",
 *   appointmentType: "consultation" | "meeting",
 *   title?: string,
 *   description?: string
 * }
 *
 * Response:
 * {
 *   appointmentId: "uuid",
 *   calendarEventId: "google_event_id",
 *   calendarLink: "https://calendar.google.com/...",
 *   meetingLink?: "https://meet.google.com/..."
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { slotStart, slotEnd, leadId, appointmentType, title, description } = body

    if (!slotStart || !slotEnd || !leadId) {
      return NextResponse.json(
        { error: 'slotStart, slotEnd e leadId são obrigatórios' },
        { status: 400 }
      )
    }

    const supabase = createRouteHandlerClient()

    // 1. Fetch lead data
    const { data: lead, error: leadError } = await supabase
      .from('leads')
      .select('*')
      .eq('id', leadId)
      .single()

    if (leadError || !lead) {
      console.error('Error fetching lead:', leadError)
      return NextResponse.json({ error: 'Lead não encontrado' }, { status: 404 })
    }

    // 2. Get authenticated user (lawyer)
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })
    }

    // 3. Initialize OAuth2 client
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CALENDAR_CLIENT_ID || process.env.GMAIL_CLIENT_ID,
      process.env.GOOGLE_CALENDAR_CLIENT_SECRET || process.env.GMAIL_CLIENT_SECRET,
      'https://developers.google.com/oauthplayground'
    )

    oauth2Client.setCredentials({
      refresh_token:
        process.env.GOOGLE_CALENDAR_REFRESH_TOKEN || process.env.GMAIL_REFRESH_TOKEN,
    })

    const leadAny = lead as any

    // 4. Create Google Calendar event
    const eventTitle =
      title || `${appointmentType === 'consultation' ? 'Consulta' : 'Reunião'} - ${leadAny.full_name}`
    const eventDescription =
      description ||
      `Cliente: ${leadAny.full_name}\nEmail: ${leadAny.email}\nTelefone: ${leadAny.phone}\nServiço: ${leadAny.service_interest}`

    const calendarEvent = {
      summary: eventTitle,
      description: eventDescription,
      start: {
        dateTime: slotStart,
        timeZone: 'America/Sao_Paulo',
      },
      end: {
        dateTime: slotStart,
        timeZone: 'America/Sao_Paulo',
      },
      attendees: [
        {
          email: leadAny.email,
          displayName: leadAny.full_name,
          responseStatus: 'needsAction',
        },
      ],
      reminders: {
        useDefault: false,
        overrides: [
          { method: 'email', minutes: 24 * 60 }, // 1 day before
          { method: 'popup', minutes: 30 }, // 30 minutes before
        ],
      },
      conferenceData: {
        createRequest: {
          requestId: `${leadId}-${Date.now()}`,
          conferenceSolutionKey: { type: 'hangoutsMeet' },
        },
      },
      colorId: '9', // Blue for appointments
    }

    const calendarResponse = await calendar.events.insert({
      auth: oauth2Client,
      calendarId: 'primary',
      conferenceDataVersion: 1,
      requestBody: calendarEvent,
      sendUpdates: 'all', // Send email to attendees
    })

    const calendarEventId = calendarResponse.data.id
    const calendarLink = calendarResponse.data.htmlLink
    const meetingLink = calendarResponse.data.hangoutLink

    if (!calendarEventId) {
      throw new Error('Failed to create calendar event')
    }

    // 5. Save appointment to database
    const startDate = new Date(slotStart)
    const endDate = new Date(slotEnd)
    const durationMinutes = Math.round((endDate.getTime() - startDate.getTime()) / 60000)

    const { data: appointment, error: appointmentError } = await (supabase as any)
      .from('appointments')
      .insert({
        client_id: leadId,
        lawyer_id: user.id,
        title: eventTitle,
        description: eventDescription,
        appointment_type: appointmentType || 'consultation',
        scheduled_at: slotStart,
        duration_minutes: durationMinutes,
        status: 'scheduled',
        meeting_link: meetingLink || null,
        google_calendar_event_id: calendarEventId,
      })
      .select()
      .single()

    if (appointmentError) {
      console.error('Error saving appointment to database:', appointmentError)
      // Don't fail the request, calendar event is already created
    }

    // 6. Send confirmation email to client
    await sendEmail({
      to: leadAny.email || '',
      subject: `Agendamento Confirmado - ${eventTitle}`,
      html: generateAppointmentConfirmationEmail({
        clientName: leadAny.full_name,
        appointmentTitle: eventTitle,
        appointmentDate: startDate.toLocaleDateString('pt-BR', {
          weekday: 'long',
          day: '2-digit',
          month: 'long',
          year: 'numeric',
        }),
        appointmentTime: startDate.toLocaleTimeString('pt-BR', {
          hour: '2-digit',
          minute: '2-digit',
        }),
        duration: durationMinutes,
        meetingLink,
        calendarLink,
      }),
    })

    // 7. Update conversation state to scheduled
    const { data: conversation } = await supabase
      .from('conversations')
      .select('id')
      .eq('lead_id', leadId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    if (conversation) {
      await supabase
        .from('conversations')
        .update({
          state: 'scheduled',
          updated_at: new Date().toISOString(),
        })
        .eq('id', conversation.id)
    }

    return NextResponse.json({
      success: true,
      appointmentId: appointment?.id,
      calendarEventId,
      calendarLink,
      meetingLink,
    })
  } catch (error) {
    console.error('Error booking appointment:', error)
    return NextResponse.json(
      { error: 'Erro ao criar agendamento' },
      { status: 500 }
    )
  }
}

function generateAppointmentConfirmationEmail(data: {
  clientName: string
  appointmentTitle: string
  appointmentDate: string
  appointmentTime: string
  duration: number
  meetingLink?: string | null
  calendarLink?: string | null
}) {
  const meetingSection = data.meetingLink
    ? `
    <div style="background: #e3f2fd; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center;">
      <p style="margin: 0 0 10px 0; font-size: 14px; color: #1976d2;">
        <strong>📹 Reunião Online</strong>
      </p>
      <a href="${data.meetingLink}"
         style="display: inline-block; background: #1976d2; color: white; padding: 12px 30px;
                text-decoration: none; border-radius: 6px; font-weight: bold;">
        Entrar na Reunião
      </a>
      <p style="margin: 10px 0 0 0; font-size: 12px; color: #666;">
        Link: <a href="${data.meetingLink}" style="color: #1976d2;">${data.meetingLink}</a>
      </p>
    </div>
    `
    : ''

  const calendarButton = data.calendarLink
    ? `
    <a href="${data.calendarLink}"
       style="display: inline-block; background: #d4af37; color: white; padding: 12px 30px;
              text-decoration: none; border-radius: 6px; font-weight: bold; margin: 10px 0;">
      📅 Adicionar ao Calendário
    </a>
    `
    : ''

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #1a1a1a; color: white; padding: 30px 20px; text-align: center; }
    .content { padding: 30px 20px; background: #f9f9f9; }
    .appointment-box { background: white; padding: 25px; border-left: 4px solid #d4af37; margin: 20px 0; }
    .footer { text-align: center; padding: 20px; font-size: 12px; color: #666; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>✅ Agendamento Confirmado</h1>
    </div>
    <div class="content">
      <h2>Olá, ${data.clientName}!</h2>
      <p>Seu agendamento foi confirmado com sucesso.</p>

      <div class="appointment-box">
        <h3 style="margin-top: 0; color: #d4af37;">📋 ${data.appointmentTitle}</h3>

        <p style="font-size: 16px; margin: 15px 0;">
          <strong>📅 Data:</strong> ${data.appointmentDate}
        </p>

        <p style="font-size: 16px; margin: 15px 0;">
          <strong>🕐 Horário:</strong> ${data.appointmentTime}
        </p>

        <p style="font-size: 16px; margin: 15px 0;">
          <strong>⏱️ Duração:</strong> ${data.duration} minutos
        </p>
      </div>

      ${meetingSection}

      <div style="text-align: center; margin: 30px 0;">
        ${calendarButton}
      </div>

      <div style="background: #fff3cd; padding: 15px; border-radius: 6px; margin: 20px 0;">
        <p style="margin: 0; font-size: 14px;">
          <strong>⏰ Lembretes:</strong><br>
          Você receberá lembretes automáticos:<br>
          • 1 dia antes (email)<br>
          • 30 minutos antes (notificação)
        </p>
      </div>

      <p><strong>📝 Preparação:</strong></p>
      <ul>
        <li>Separe documentos relevantes para o caso</li>
        <li>Anote suas dúvidas principais</li>
        <li>Chegue com 5 minutos de antecedência (online ou presencial)</li>
      </ul>

      <p>Qualquer dúvida ou necessidade de reagendamento, entre em contato conosco.</p>

      <p>Atenciosamente,<br><strong>Equipe Garcez Palha</strong></p>
    </div>
    <div class="footer">
      <p>Garcez Palha Advocacia | OAB/SP XXXXX</p>
      <p>contato@garcezpalha.com.br | (11) 9999-9999</p>
    </div>
  </div>
</body>
</html>
  `
}
