'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Search,
  Calendar,
  AlertTriangle,
  CheckCircle,
  Clock,
  XCircle,
  Loader2,
  RefreshCw,
  CalendarPlus,
  Bell,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

type ProcessDeadline = {
  id: string
  deadline_type: string
  due_date: string
  description: string
  status: 'pending' | 'completed' | 'expired' | 'cancelled'
  reminder_sent: boolean
  google_calendar_event_id?: string
  alert: {
    process_number: string
    tribunal: string
    priority: string
  }
  created_at: string
}

const statusConfig = {
  pending: {
    label: 'Pendente',
    color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    icon: Clock,
  },
  completed: {
    label: 'Cumprido',
    color: 'bg-green-100 text-green-800 border-green-200',
    icon: CheckCircle,
  },
  expired: {
    label: 'Vencido',
    color: 'bg-red-100 text-red-800 border-red-200',
    icon: AlertTriangle,
  },
  cancelled: {
    label: 'Cancelado',
    color: 'bg-gray-100 text-gray-800 border-gray-200',
    icon: XCircle,
  },
}

const urgencyConfig = {
  urgent: { label: 'Hoje/Amanhã', color: 'bg-red-500 text-white', days: 1 },
  high: { label: '2-3 dias', color: 'bg-orange-500 text-white', days: 3 },
  medium: { label: '4-7 dias', color: 'bg-yellow-500 text-white', days: 7 },
  normal: { label: '> 7 dias', color: 'bg-blue-500 text-white', days: 999 },
}

export default function PrazosPage() {
  const [deadlines, setDeadlines] = useState<ProcessDeadline[]>([])
  const [filteredDeadlines, setFilteredDeadlines] = useState<ProcessDeadline[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('pending')
  const [urgencyFilter, setUrgencyFilter] = useState<string>('all')

  const supabase = createClient()

  useEffect(() => {
    fetchDeadlines()
  }, [])

  useEffect(() => {
    filterDeadlines()
  }, [searchTerm, statusFilter, urgencyFilter, deadlines])

  async function fetchDeadlines() {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('process_deadlines')
        .select(
          `
          *,
          alert:process_alerts(
            process_number,
            tribunal,
            priority
          )
        `
        )
        .order('due_date', { ascending: true })
        .limit(200)

      if (error) throw error

      setDeadlines(data || [])
    } catch (error) {
      console.error('Error fetching deadlines:', error)
      setDeadlines(getMockDeadlines())
    } finally {
      setLoading(false)
    }
  }

  function filterDeadlines() {
    let filtered = [...deadlines]

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (deadline) =>
          deadline.alert?.process_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
          deadline.deadline_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
          deadline.description?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter((deadline) => deadline.status === statusFilter)
    }

    // Filter by urgency
    if (urgencyFilter !== 'all') {
      filtered = filtered.filter((deadline) => {
        const daysRemaining = getDaysRemaining(deadline.due_date)
        const config = urgencyConfig[urgencyFilter as keyof typeof urgencyConfig]
        return daysRemaining <= config.days
      })
    }

    setFilteredDeadlines(filtered)
  }

  function getMockDeadlines(): ProcessDeadline[] {
    return [
      {
        id: '1',
        deadline_type: 'Apresentar Contrarrazões',
        due_date: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
        description: 'Prazo de 15 dias para apresentar contrarrazões ao recurso...',
        status: 'pending',
        reminder_sent: true,
        alert: {
          process_number: '0123456-78.2023.8.19.0001',
          tribunal: 'TJ-RJ',
          priority: 'high',
        },
        created_at: new Date().toISOString(),
      },
      {
        id: '2',
        deadline_type: 'Interpor Recurso',
        due_date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
        description: 'Prazo para interpor recurso contra sentença...',
        status: 'pending',
        reminder_sent: false,
        alert: {
          process_number: '9876543-21.2023.4.02.5101',
          tribunal: 'TRF2',
          priority: 'urgent',
        },
        created_at: new Date().toISOString(),
      },
      {
        id: '3',
        deadline_type: 'Apresentar Manifestação',
        due_date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
        description: 'Manifestação sobre documentos apresentados pela parte contrária...',
        status: 'pending',
        reminder_sent: false,
        alert: {
          process_number: '5555555-55.2023.8.19.0000',
          tribunal: 'TJ-RJ',
          priority: 'normal',
        },
        created_at: new Date().toISOString(),
      },
    ]
  }

  function getDaysRemaining(dueDate: string): number {
    const due = new Date(dueDate)
    const today = new Date()
    const diff = due.getTime() - today.getTime()
    return Math.ceil(diff / (1000 * 60 * 60 * 24))
  }

  function getUrgencyBadge(dueDate: string) {
    const days = getDaysRemaining(dueDate)

    if (days <= 1) {
      return { ...urgencyConfig.urgent, days }
    } else if (days <= 3) {
      return { ...urgencyConfig.high, days }
    } else if (days <= 7) {
      return { ...urgencyConfig.medium, days }
    } else {
      return { ...urgencyConfig.normal, days }
    }
  }

  async function updateStatus(deadlineId: string, newStatus: ProcessDeadline['status']) {
    try {
      const { error } = await supabase
        .from('process_deadlines')
        .update({ status: newStatus })
        .eq('id', deadlineId)

      if (error) throw error

      await fetchDeadlines()
    } catch (error) {
      console.error('Error updating status:', error)
    }
  }

  async function syncToCalendar(deadlineId: string) {
    try {
      const response = await fetch('/api/calendar/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ deadlineId }),
      })

      const data = await response.json()

      if (!response.ok) {
        if (data.configured === false) {
          alert('Google Calendar não configurado. Configure as credenciais do Google nas variáveis de ambiente.')
        } else {
          alert(data.error || 'Erro ao sincronizar com calendário')
        }
        return
      }

      alert(data.message || 'Sincronizado com sucesso!')
      await fetchDeadlines() // Refresh to show updated status
    } catch (error) {
      console.error('Calendar sync error:', error)
      alert('Erro ao sincronizar com Google Calendar')
    }
  }

  const stats = {
    pending: deadlines.filter((d) => d.status === 'pending').length,
    urgent: deadlines.filter(
      (d) => d.status === 'pending' && getDaysRemaining(d.due_date) <= 1
    ).length,
    thisWeek: deadlines.filter(
      (d) => d.status === 'pending' && getDaysRemaining(d.due_date) <= 7
    ).length,
    total: deadlines.length,
  }

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Prazos Processuais</h1>
          <p className="text-muted-foreground mt-1">
            Monitoramento automático de prazos com lembretes e sync Google Calendar
          </p>
        </div>
        <Button onClick={fetchDeadlines} disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Carregando...
            </>
          ) : (
            <>
              <RefreshCw className="mr-2 h-4 w-4" />
              Atualizar
            </>
          )}
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-red-500" />
              Urgentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.urgent}</div>
            <p className="text-xs text-muted-foreground">Hoje/Amanhã</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Calendar className="h-4 w-4 text-orange-500" />
              Esta Semana
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{stats.thisWeek}</div>
            <p className="text-xs text-muted-foreground">Próximos 7 dias</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Clock className="h-4 w-4 text-yellow-500" />
              Pendentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pending}</div>
            <p className="text-xs text-muted-foreground">Aguardando cumprimento</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              Total
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">Todos os prazos</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por número do processo, tipo de prazo..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant={statusFilter === 'pending' ? 'default' : 'outline'}
                onClick={() => setStatusFilter('pending')}
                size="sm"
              >
                Pendentes
              </Button>
              <Button
                variant={statusFilter === 'completed' ? 'default' : 'outline'}
                onClick={() => setStatusFilter('completed')}
                size="sm"
              >
                Cumpridos
              </Button>
              <Button
                variant={statusFilter === 'expired' ? 'default' : 'outline'}
                onClick={() => setStatusFilter('expired')}
                size="sm"
              >
                Vencidos
              </Button>
              <Button
                variant={statusFilter === 'all' ? 'default' : 'outline'}
                onClick={() => setStatusFilter('all')}
                size="sm"
              >
                Todos
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Deadlines List */}
      <div className="space-y-4">
        {loading ? (
          <Card>
            <CardContent className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </CardContent>
          </Card>
        ) : filteredDeadlines.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <p className="text-muted-foreground">Nenhum prazo encontrado</p>
            </CardContent>
          </Card>
        ) : (
          filteredDeadlines.map((deadline) => {
            const urgency = getUrgencyBadge(deadline.due_date)
            const StatusIcon = statusConfig[deadline.status].icon

            return (
              <Card key={deadline.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <CardTitle className="text-lg">{deadline.deadline_type}</CardTitle>
                        <Badge className={urgency.color}>
                          {urgency.days <= 0
                            ? 'VENCIDO'
                            : `${urgency.days} ${urgency.days === 1 ? 'dia' : 'dias'}`}
                        </Badge>
                        {deadline.reminder_sent && (
                          <Badge variant="outline" className="flex items-center gap-1">
                            <Bell className="h-3 w-3" />
                            Lembrete enviado
                          </Badge>
                        )}
                      </div>
                      <CardDescription className="flex items-center gap-4 text-sm">
                        <span className="font-medium">{deadline.alert?.process_number}</span>
                        <span>•</span>
                        <span>{deadline.alert?.tribunal}</span>
                        <span>•</span>
                        <span>
                          Vence:{' '}
                          {new Date(deadline.due_date).toLocaleDateString('pt-BR', {
                            day: '2-digit',
                            month: 'long',
                            year: 'numeric',
                          })}
                        </span>
                      </CardDescription>
                    </div>
                    <Badge
                      className={`${statusConfig[deadline.status].color} flex items-center gap-1`}
                    >
                      <StatusIcon className="h-3 w-3" />
                      {statusConfig[deadline.status].label}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Description */}
                  {deadline.description && (
                    <p className="text-sm text-muted-foreground">{deadline.description}</p>
                  )}

                  {/* Actions */}
                  <div className="flex flex-wrap gap-2">
                    {deadline.status === 'pending' && (
                      <>
                        <Button
                          variant="default"
                          size="sm"
                          onClick={() => updateStatus(deadline.id, 'completed')}
                        >
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Marcar como Cumprido
                        </Button>

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => syncToCalendar(deadline.id)}
                          disabled={!!deadline.google_calendar_event_id}
                        >
                          <CalendarPlus className="h-4 w-4 mr-2" />
                          {deadline.google_calendar_event_id
                            ? 'Sincronizado'
                            : 'Adicionar ao Calendar'}
                        </Button>

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateStatus(deadline.id, 'cancelled')}
                        >
                          Cancelar
                        </Button>
                      </>
                    )}

                    {deadline.status === 'completed' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateStatus(deadline.id, 'pending')}
                      >
                        Reabrir
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            )
          })
        )}
      </div>
    </div>
  )
}
