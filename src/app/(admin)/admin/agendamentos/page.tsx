'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Calendar as CalendarIcon,
  Clock,
  User,
  Video,
  MapPin,
  Plus,
  ChevronLeft,
  ChevronRight,
  Loader2,
  RefreshCw,
} from 'lucide-react'
import { trpc } from '@/lib/trpc/client'
import { NewAppointmentDialog } from '@/components/admin/appointments/new-appointment-dialog'
import { ErrorAlert } from '@/components/ui/error-alert'
import { EmptyState } from '@/components/ui/empty-state'

type Appointment = {
  id: string
  client_id: string
  lawyer_id: string
  title: string
  description: string | null
  appointment_type: 'consultation' | 'meeting' | 'court' | 'other'
  scheduled_at: string
  duration_minutes: number
  status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled' | 'no_show'
  meeting_link: string | null
  location: string | null
  notes: string | null
  created_at: string
  updated_at: string
}

// Extended appointment with client name
type AppointmentWithClient = Appointment & {
  client_name: string
  time: string
  date: string
}

const mockAppointments: AppointmentWithClient[] = [
  {
    id: '1',
    client_id: '1',
    lawyer_id: '1',
    client_name: 'Roberto Mendes',
    title: 'Consulta Inicial - Usucapião',
    description: null,
    appointment_type: 'consultation',
    date: new Date().toISOString().split('T')[0],
    time: '09:00',
    scheduled_at: new Date().toISOString(),
    duration_minutes: 60,
    status: 'confirmed',
    location: 'Escritório',
    meeting_link: null,
    notes: 'Primeira consulta sobre processo de usucapião urbano',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '2',
    client_id: '2',
    lawyer_id: '1',
    client_name: 'Fernanda Souza',
    title: 'Perícia Médica - Acompanhamento',
    description: null,
    appointment_type: 'meeting',
    date: new Date().toISOString().split('T')[0],
    time: '11:00',
    scheduled_at: new Date().toISOString(),
    duration_minutes: 45,
    status: 'scheduled',
    location: 'Online',
    meeting_link: 'https://meet.google.com/abc-defg-hij',
    notes: 'Discussão dos resultados da perícia',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '3',
    client_id: '3',
    lawyer_id: '1',
    client_name: 'André Carvalho',
    title: 'Audiência TJ/RJ',
    description: null,
    appointment_type: 'court',
    date: new Date().toISOString().split('T')[0],
    time: '14:00',
    scheduled_at: new Date().toISOString(),
    duration_minutes: 120,
    status: 'confirmed',
    location: 'Tribunal de Justiça - 5ª Vara Cível',
    meeting_link: null,
    notes: 'Audiência de instrução e julgamento',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '4',
    client_id: '4',
    lawyer_id: '1',
    client_name: 'Lucia Pereira',
    title: 'Assinatura de Contrato',
    description: null,
    appointment_type: 'meeting',
    date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    time: '10:00',
    scheduled_at: new Date(Date.now() + 86400000).toISOString(),
    duration_minutes: 30,
    status: 'scheduled',
    location: 'Escritório',
    meeting_link: null,
    notes: 'Assinatura do contrato de honorários',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
]

const typeConfig = {
  consultation: { label: 'Consulta', color: 'bg-blue-500 text-white' },
  meeting: { label: 'Reunião', color: 'bg-green-500 text-white' },
  court: { label: 'Audiência', color: 'bg-red-500 text-white' },
  other: { label: 'Outro', color: 'bg-gray-500 text-white' },
}

const statusConfig = {
  scheduled: { label: 'Agendado', color: 'bg-yellow-100 text-yellow-800' },
  confirmed: { label: 'Confirmado', color: 'bg-green-100 text-green-800' },
  completed: { label: 'Concluído', color: 'bg-blue-100 text-blue-800' },
  cancelled: { label: 'Cancelado', color: 'bg-red-100 text-red-800' },
  no_show: { label: 'Não Compareceu', color: 'bg-slate-200 text-slate-800' },
}

const hours = Array.from({ length: 12 }, (_, i) => i + 8) // 8h às 19h

export default function AgendamentosPage() {
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [viewMode, setViewMode] = useState<'day' | 'week'>('day')
  const [useMockData, setUseMockData] = useState(false)
  const [showNewDialog, setShowNewDialog] = useState(false)

  // Calculate week start/end dates
  const getWeekDates = (date: Date) => {
    const start = new Date(date)
    const day = start.getDay()
    const diff = start.getDate() - day // Get Sunday
    start.setDate(diff)
    start.setHours(0, 0, 0, 0)

    const end = new Date(start)
    end.setDate(start.getDate() + 6)
    end.setHours(23, 59, 59, 999)

    return { start, end }
  }

  const weekDates = getWeekDates(selectedDate)

  // Fetch appointments from tRPC
  const selectedDateStr = selectedDate.toISOString().split('T')[0]
  const fromDate = viewMode === 'week'
    ? weekDates.start.toISOString()
    : `${selectedDateStr}T00:00:00Z`
  const toDate = viewMode === 'week'
    ? weekDates.end.toISOString()
    : `${selectedDateStr}T23:59:59Z`

  const {
    data: appointmentsData,
    isLoading,
    error,
    refetch,
  } = trpc.appointments.list.useQuery(
    {
      from_date: fromDate,
      to_date: toDate,
      limit: 100,
      offset: 0,
    },
    { retry: false, enabled: !useMockData }
  )

  // Don't auto-fallback to mock data - show error instead
  // useEffect(() => {
  //   if (error) {
  //     console.log('Database not configured, using mock data')
  //     setUseMockData(true)
  //   }
  // }, [error])

  // Map database appointments to AppointmentWithClient
  const appointments: AppointmentWithClient[] = useMockData
    ? mockAppointments
    : (appointmentsData?.appointments || []).map((apt) => {
        const scheduledDate = new Date(apt.scheduled_at)
        return {
          ...apt,
          client_name: 'Cliente',
          date: scheduledDate.toISOString().split('T')[0],
          time: scheduledDate.toLocaleTimeString('pt-BR', {
            hour: '2-digit',
            minute: '2-digit',
          }),
        }
      })

  const todayAppointments = appointments.filter((apt) => apt.date === selectedDateStr)

  const formatDate = (date: Date) => {
    if (viewMode === 'week') {
      const { start, end } = getWeekDates(date)
      const startStr = start.toLocaleDateString('pt-BR', {
        day: 'numeric',
        month: 'short',
      })
      const endStr = end.toLocaleDateString('pt-BR', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      })
      return `${startStr} - ${endStr}`
    }
    return date.toLocaleDateString('pt-BR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
  }

  const navigateDate = (direction: 'prev' | 'next') => {
    const newDate = new Date(selectedDate)
    if (viewMode === 'day') {
      newDate.setDate(newDate.getDate() + (direction === 'next' ? 1 : -1))
    } else {
      newDate.setDate(newDate.getDate() + (direction === 'next' ? 7 : -7))
    }
    setSelectedDate(newDate)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Agendamentos</h2>
          <p className="text-muted-foreground">
            Gerencie sua agenda de compromissos
            {useMockData && (
              <span className="ml-2 text-xs bg-amber-200 text-amber-900 px-2 py-0.5 rounded">
                Modo Demo
              </span>
            )}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="icon" onClick={() => refetch()} disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          </Button>
          <Button onClick={() => setShowNewDialog(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Novo Agendamento
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{todayAppointments.length}</div>
            <p className="text-xs text-muted-foreground">Compromissos Hoje</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">
              {todayAppointments.filter((a) => a.status === 'confirmed').length}
            </div>
            <p className="text-xs text-muted-foreground">Confirmados</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">
              {todayAppointments.reduce((acc, a) => acc + a.duration_minutes, 0)} min
            </div>
            <p className="text-xs text-muted-foreground">Tempo Total</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{appointments.length}</div>
            <p className="text-xs text-muted-foreground">Esta Semana</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Calendar View */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Agenda</CardTitle>
                <div className="flex items-center gap-2">
                  <Button
                    variant={viewMode === 'day' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setViewMode('day')}
                  >
                    Dia
                  </Button>
                  <Button
                    variant={viewMode === 'week' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setViewMode('week')}
                  >
                    Semana
                  </Button>
                </div>
              </div>
              <div className="flex items-center justify-between mt-4">
                <Button variant="outline" size="icon" onClick={() => navigateDate('prev')}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <h3 className="font-medium capitalize">{formatDate(selectedDate)}</h3>
                <Button variant="outline" size="icon" onClick={() => navigateDate('next')}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {isLoading && !useMockData ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : error && !useMockData ? (
                <ErrorAlert
                  error={error.message || 'Erro ao carregar agendamentos'}
                  retry={() => {
                    setUseMockData(false)
                    refetch()
                  }}
                  title="Erro ao carregar agendamentos"
                />
              ) : todayAppointments.length === 0 ? (
                <EmptyState
                  icon={CalendarIcon}
                  title="Nenhum agendamento hoje"
                  description="Não há agendamentos para o dia selecionado."
                  action={
                    <Button onClick={() => setShowNewDialog(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Novo Agendamento
                    </Button>
                  }
                />
              ) : (
                <>
                  {/* Day View */}
                  {viewMode === 'day' && (
                    <div className="space-y-2">
                      {hours.map((hour) => {
                        const hourAppointments = todayAppointments.filter(
                          (apt) => parseInt(apt.time.split(':')[0]) === hour
                        )
                        return (
                          <div key={hour} className="flex gap-4">
                            <div className="w-16 text-sm text-muted-foreground py-2">
                              {hour}:00
                            </div>
                            <div className="flex-1 min-h-[60px] border-l pl-4">
                              {hourAppointments.map((apt) => (
                                <div
                                  key={apt.id}
                                  className={`p-3 rounded-lg mb-2 border-l-4 bg-card shadow-sm ${
                                    typeConfig[apt.appointment_type].color
                                  } border-l-current`}
                                >
                                  <div className="flex items-start justify-between">
                                    <div>
                                      <p className="font-medium text-sm">{apt.title}</p>
                                      <p className="text-xs text-muted-foreground">
                                        {apt.client_name}
                                      </p>
                                    </div>
                                    <span
                                      className={`text-xs px-2 py-1 rounded ${
                                        statusConfig[apt.status].color
                                      }`}
                                    >
                                      {statusConfig[apt.status].label}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                                    <span className="flex items-center gap-1">
                                      <Clock className="h-3 w-3" />
                                      {apt.time} ({apt.duration_minutes}min)
                                    </span>
                                    {apt.location && (
                                      <span className="flex items-center gap-1">
                                        {apt.location === 'Online' ? (
                                          <Video className="h-3 w-3" />
                                        ) : (
                                          <MapPin className="h-3 w-3" />
                                        )}
                                        {apt.location}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              ))}
                              {hourAppointments.length === 0 && (
                                <div className="h-full border border-dashed rounded-lg" />
                              )}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}

                  {/* Week View */}
                  {viewMode === 'week' && (
                    <div className="overflow-x-auto">
                      <div className="grid grid-cols-8 gap-px bg-border min-w-[900px]">
                        {/* Header Row */}
                        <div className="bg-background p-2 text-sm font-medium text-muted-foreground">
                          Hora
                        </div>
                        {Array.from({ length: 7 }, (_, i) => {
                          const date = new Date(weekDates.start)
                          date.setDate(date.getDate() + i)
                          const isToday = date.toDateString() === new Date().toDateString()
                          return (
                            <div
                              key={i}
                              className={`bg-background p-2 text-sm font-medium text-center ${
                                isToday ? 'bg-primary/10 text-primary' : ''
                              }`}
                            >
                              <div className="text-xs text-muted-foreground">
                                {date.toLocaleDateString('pt-BR', { weekday: 'short' })}
                              </div>
                              <div className={`text-lg ${isToday ? 'font-bold' : ''}`}>
                                {date.getDate()}
                              </div>
                            </div>
                          )
                        })}

                        {/* Time Grid */}
                        {hours.map((hour) => (
                          <>
                            <div
                              key={`time-${hour}`}
                              className="bg-background p-2 text-sm text-muted-foreground border-t"
                            >
                              {hour}:00
                            </div>
                            {Array.from({ length: 7 }, (_, dayIndex) => {
                              const date = new Date(weekDates.start)
                              date.setDate(date.getDate() + dayIndex)
                              const dateStr = date.toISOString().split('T')[0]

                              const dayAppointments = appointments.filter(
                                (apt) =>
                                  apt.date === dateStr && parseInt(apt.time.split(':')[0]) === hour
                              )

                              return (
                                <div
                                  key={`${hour}-${dayIndex}`}
                                  className="bg-background border-t min-h-[80px] p-1"
                                >
                                  {dayAppointments.map((apt) => (
                                    <div
                                      key={apt.id}
                                      className={`p-2 rounded mb-1 text-xs border-l-2 ${
                                        typeConfig[apt.appointment_type].color
                                      } border-l-current bg-card shadow-sm hover:shadow-md transition-shadow cursor-pointer`}
                                      title={`${apt.title} - ${apt.client_name}`}
                                    >
                                      <div className="font-medium truncate">{apt.title}</div>
                                      <div className="text-muted-foreground truncate text-[10px]">
                                        {apt.time} ({apt.duration_minutes}m)
                                      </div>
                                      <div className="text-muted-foreground truncate text-[10px]">
                                        {apt.client_name}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              )
                            })}
                          </>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Today's Schedule */}
        <Card>
          <CardHeader>
            <CardTitle>Próximos Compromissos</CardTitle>
            <CardDescription>Sua agenda para hoje</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {todayAppointments.length > 0 ? (
                todayAppointments.map((apt) => (
                  <div key={apt.id} className="p-3 border rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-3 h-3 rounded-full ${
                            typeConfig[apt.appointment_type].color
                          }`}
                        />
                        <span className="font-medium text-sm">{apt.time}</span>
                      </div>
                      <span
                        className={`text-xs px-2 py-1 rounded ${statusConfig[apt.status].color}`}
                      >
                        {statusConfig[apt.status].label}
                      </span>
                    </div>
                    <p className="font-medium">{apt.title}</p>
                    <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                      <User className="h-3 w-3" />
                      {apt.client_name}
                    </div>
                    {apt.location && (
                      <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                        {apt.location === 'Online' ? (
                          <Video className="h-3 w-3" />
                        ) : (
                          <MapPin className="h-3 w-3" />
                        )}
                        {apt.location}
                      </div>
                    )}
                    {apt.notes && (
                      <p className="text-xs text-muted-foreground mt-2 bg-muted p-2 rounded">
                        {apt.notes}
                      </p>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <CalendarIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Nenhum compromisso para este dia</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <NewAppointmentDialog
        open={showNewDialog}
        onOpenChange={setShowNewDialog}
        onSuccess={() => refetch()}
      />
    </div>
  )
}
