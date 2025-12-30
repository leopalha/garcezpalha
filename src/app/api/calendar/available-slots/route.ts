import { NextRequest, NextResponse } from 'next/server'
import { google } from 'googleapis'

const calendar = google.calendar('v3')

/**
 * API: GET /api/calendar/available-slots
 *
 * Busca horários disponíveis no Google Calendar do advogado
 *
 * Query params:
 * - lawyerId: ID do advogado (opcional, padrão: primary)
 * - daysAhead: Quantos dias à frente buscar (padrão: 7)
 * - slotDuration: Duração do slot em minutos (padrão: 60)
 *
 * Response:
 * [
 *   { start: "2024-12-30T09:00:00-03:00", end: "2024-12-30T10:00:00-03:00" },
 *   { start: "2024-12-30T11:00:00-03:00", end: "2024-12-30T12:00:00-03:00" },
 *   ...
 * ]
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const daysAhead = parseInt(searchParams.get('daysAhead') || '7')
    const slotDuration = parseInt(searchParams.get('slotDuration') || '60')

    // Initialize OAuth2 client
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CALENDAR_CLIENT_ID || process.env.GMAIL_CLIENT_ID,
      process.env.GOOGLE_CALENDAR_CLIENT_SECRET || process.env.GMAIL_CLIENT_SECRET,
      'https://developers.google.com/oauthplayground'
    )

    oauth2Client.setCredentials({
      refresh_token:
        process.env.GOOGLE_CALENDAR_REFRESH_TOKEN || process.env.GMAIL_REFRESH_TOKEN,
    })

    // Calculate date range (next 7 days, business hours only)
    const now = new Date()
    const timeMin = new Date(now)
    timeMin.setHours(9, 0, 0, 0) // Start at 9 AM today

    const timeMax = new Date(now)
    timeMax.setDate(timeMax.getDate() + daysAhead)
    timeMax.setHours(18, 0, 0, 0) // End at 6 PM in 7 days

    // Fetch busy periods from Google Calendar
    const response = await calendar.freebusy.query({
      auth: oauth2Client,
      requestBody: {
        timeMin: timeMin.toISOString(),
        timeMax: timeMax.toISOString(),
        items: [{ id: 'primary' }],
      },
    })

    const busySlots = response.data.calendars?.primary?.busy || []

    // Generate all possible business hour slots
    const availableSlots = generateAvailableSlots(
      timeMin,
      timeMax,
      busySlots,
      slotDuration
    )

    // Return first 5 available slots
    return NextResponse.json(availableSlots.slice(0, 5))
  } catch (error) {
    console.error('Error fetching available slots:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar horários disponíveis' },
      { status: 500 }
    )
  }
}

/**
 * Generate available time slots excluding busy periods
 */
function generateAvailableSlots(
  timeMin: Date,
  timeMax: Date,
  busySlots: Array<{ start: string; end: string }>,
  slotDuration: number
): Array<{ start: string; end: string }> {
  const available: Array<{ start: string; end: string }> = []

  let currentDate = new Date(timeMin)

  // Iterate through each day
  while (currentDate < timeMax) {
    const dayOfWeek = currentDate.getDay()

    // Skip weekends (Saturday = 6, Sunday = 0)
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      currentDate.setDate(currentDate.getDate() + 1)
      currentDate.setHours(9, 0, 0, 0)
      continue
    }

    // Generate slots for business hours (9 AM - 6 PM)
    let slotStart = new Date(currentDate)
    slotStart.setHours(9, 0, 0, 0)

    const dayEnd = new Date(currentDate)
    dayEnd.setHours(18, 0, 0, 0)

    while (slotStart < dayEnd) {
      const slotEnd = new Date(slotStart)
      slotEnd.setMinutes(slotEnd.getMinutes() + slotDuration)

      // Check if slot overlaps with any busy period
      const isAvailable = !busySlots.some((busy) => {
        const busyStart = new Date(busy.start)
        const busyEnd = new Date(busy.end)

        return (
          (slotStart >= busyStart && slotStart < busyEnd) || // Slot starts during busy
          (slotEnd > busyStart && slotEnd <= busyEnd) || // Slot ends during busy
          (slotStart <= busyStart && slotEnd >= busyEnd) // Slot contains busy
        )
      })

      if (isAvailable && slotStart > new Date()) {
        // Only include future slots
        available.push({
          start: slotStart.toISOString(),
          end: slotEnd.toISOString(),
        })
      }

      // Move to next slot
      slotStart.setMinutes(slotStart.getMinutes() + slotDuration)
    }

    // Move to next day
    currentDate.setDate(currentDate.getDate() + 1)
    currentDate.setHours(9, 0, 0, 0)
  }

  return available
}
