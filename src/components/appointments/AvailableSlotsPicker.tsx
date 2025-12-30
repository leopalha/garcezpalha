'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Calendar, Clock, Loader2, CheckCircle2 } from 'lucide-react'

interface TimeSlot {
  start: string
  end: string
}

interface AvailableSlotsPickerProps {
  leadId: string
  onBookingComplete?: (appointmentData: {
    appointmentId?: string
    calendarEventId: string
    calendarLink?: string
    meetingLink?: string
  }) => void
  className?: string
}

export function AvailableSlotsPicker({
  leadId,
  onBookingComplete,
  className = '',
}: AvailableSlotsPickerProps) {
  const [slots, setSlots] = useState<TimeSlot[]>([])
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null)
  const [loading, setLoading] = useState(true)
  const [booking, setBooking] = useState(false)
  const [booked, setBooked] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Fetch available slots on mount
  useEffect(() => {
    fetchAvailableSlots()
  }, [])

  const fetchAvailableSlots = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/calendar/available-slots?daysAhead=7&slotDuration=60')

      if (!response.ok) {
        throw new Error('Erro ao buscar horários disponíveis')
      }

      const data = await response.json()
      setSlots(data)
    } catch (err) {
      console.error('Error fetching slots:', err)
      setError('Não foi possível carregar os horários disponíveis. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  const handleSelectSlot = (slot: TimeSlot) => {
    setSelectedSlot(slot)
  }

  const handleConfirmBooking = async () => {
    if (!selectedSlot) return

    setBooking(true)
    setError(null)

    try {
      const response = await fetch('/api/calendar/book-appointment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slotStart: selectedSlot.start,
          slotEnd: selectedSlot.end,
          leadId,
          appointmentType: 'consultation',
        }),
      })

      if (!response.ok) {
        throw new Error('Erro ao confirmar agendamento')
      }

      const data = await response.json()
      setBooked(true)

      if (onBookingComplete) {
        onBookingComplete(data)
      }
    } catch (err) {
      console.error('Error booking appointment:', err)
      setError('Não foi possível confirmar o agendamento. Tente novamente.')
    } finally {
      setBooking(false)
    }
  }

  const formatSlotDate = (isoString: string) => {
    const date = new Date(isoString)
    return date.toLocaleDateString('pt-BR', {
      weekday: 'long',
      day: '2-digit',
      month: 'long',
    })
  }

  const formatSlotTime = (isoString: string) => {
    const date = new Date(isoString)
    return date.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  if (loading) {
    return (
      <Card className={className}>
        <CardContent className="flex items-center justify-center py-12">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
            <p className="text-sm text-muted-foreground">Buscando horários disponíveis...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (booked) {
    return (
      <Card className={`${className} border-green-200 bg-green-50`}>
        <CardContent className="py-12">
          <div className="text-center">
            <CheckCircle2 className="w-12 h-12 text-green-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-green-900 mb-2">
              Agendamento Confirmado!
            </h3>
            <p className="text-sm text-green-700 mb-4">
              Você receberá um email de confirmação com todos os detalhes.
            </p>
            <div className="bg-white p-4 rounded-lg border border-green-200 inline-block">
              <p className="text-sm font-medium text-gray-900 mb-1">
                {formatSlotDate(selectedSlot?.start || '')}
              </p>
              <p className="text-lg font-bold text-green-700">
                {formatSlotTime(selectedSlot?.start || '')}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className={`${className} border-red-200 bg-red-50`}>
        <CardContent className="py-8">
          <div className="text-center">
            <p className="text-sm text-red-700 mb-4">{error}</p>
            <Button onClick={fetchAvailableSlots} variant="outline" size="sm">
              Tentar Novamente
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (slots.length === 0) {
    return (
      <Card className={className}>
        <CardContent className="py-12">
          <div className="text-center">
            <Calendar className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
            <p className="text-sm text-muted-foreground mb-4">
              Não há horários disponíveis nos próximos 7 dias.
            </p>
            <p className="text-xs text-muted-foreground">
              Entre em contato conosco para agendar um horário alternativo.
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={className}>
      <CardContent className="pt-6">
        <div className="mb-4">
          <h3 className="font-semibold text-lg mb-1">Escolha um horário</h3>
          <p className="text-sm text-muted-foreground">
            Selecione o melhor horário para sua consulta
          </p>
        </div>

        <div className="space-y-3 mb-6">
          {slots.map((slot, index) => {
            const isSelected = selectedSlot?.start === slot.start
            const slotDate = formatSlotDate(slot.start)
            const slotTime = formatSlotTime(slot.start)

            return (
              <button
                key={index}
                onClick={() => handleSelectSlot(slot)}
                className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                  isSelected
                    ? 'border-primary bg-primary/5 shadow-sm'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        isSelected ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      <Calendar className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-medium text-sm capitalize">{slotDate}</p>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground mt-0.5">
                        <Clock className="w-3 h-3" />
                        <span>{slotTime}</span>
                        <span className="mx-1">•</span>
                        <span>1 hora</span>
                      </div>
                    </div>
                  </div>
                  {isSelected && (
                    <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
                  )}
                </div>
              </button>
            )
          })}
        </div>

        {selectedSlot && (
          <Button
            onClick={handleConfirmBooking}
            disabled={booking}
            size="lg"
            className="w-full"
          >
            {booking ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Confirmando...
              </>
            ) : (
              <>
                <CheckCircle2 className="w-5 h-5 mr-2" />
                Confirmar Agendamento
              </>
            )}
          </Button>
        )}

        {!selectedSlot && (
          <p className="text-xs text-center text-muted-foreground">
            Selecione um horário acima para continuar
          </p>
        )}
      </CardContent>
    </Card>
  )
}
