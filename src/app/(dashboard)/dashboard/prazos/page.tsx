import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Calendar,
  Clock,
  AlertTriangle,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  MapPin,
} from 'lucide-react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'

interface ProcessAlertDB {
  id: string
  process_number?: string | null
  description?: string | null
  deadline_date: string
  update_type?: string | null
  tribunal?: string | null
  status?: string | null
  created_at: string
}

export default async function PrazosPage() {
  const session = await getServerSession(authOptions)
  const supabase = await createClient()

  // Fetch real deadlines from database
  const { data: deadlinesData } = await supabase
    .from('process_alerts')
    .select('*')
    .not('deadline_date', 'is', null)
    .gte('deadline_date', new Date().toISOString())
    .order('deadline_date', { ascending: true })

  const deadlines = (deadlinesData || []).map((d: ProcessAlertDB) => {
    const deadlineDate = new Date(d.deadline_date)
    const today = new Date()
    const daysUntil = Math.ceil((deadlineDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

    return {
      id: d.id,
      title: d.description || 'Prazo sem descrição',
      type: d.update_type || 'Prazo Processual',
      date: deadlineDate.toLocaleDateString('pt-BR'),
      time: deadlineDate.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      process: {
        number: d.process_number,
        title: d.description || 'Processo',
      },
      location: d.tribunal || null,
      description: d.description || '',
      daysUntil,
      status: d.status,
    }
  })

  const upcomingThisWeek = deadlines.filter(d => d.daysUntil <= 7)
  const upcomingNextWeek = deadlines.filter(d => d.daysUntil > 7 && d.daysUntil <= 14)
  const upcomingLater = deadlines.filter(d => d.daysUntil > 14)

  const getUrgencyColor = (daysUntil: number) => {
    if (daysUntil <= 3) return 'bg-red-100 border-red-300'
    if (daysUntil <= 7) return 'bg-orange-100 border-orange-300'
    return 'bg-blue-100 border-blue-300'
  }

  const getUrgencyBadge = (daysUntil: number): "destructive" | "outline" | "secondary" => {
    if (daysUntil <= 3) return 'destructive'
    if (daysUntil <= 7) return 'outline'
    return 'secondary'
  }

  const getUrgencyIcon = (daysUntil: number) => {
    if (daysUntil <= 3) return <AlertTriangle className="h-4 w-4" />
    return <Clock className="h-4 w-4" />
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">
            Prazos e Audiências
          </h2>
          <p className="text-gray-600 mt-1">
            Acompanhe todos os seus compromissos processuais
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Esta Semana</p>
                <p className="text-2xl font-bold text-orange-600 mt-1">
                  {upcomingThisWeek.length}
                </p>
              </div>
              <AlertTriangle className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Próxima Semana</p>
                <p className="text-2xl font-bold text-blue-600 mt-1">
                  {upcomingNextWeek.length}
                </p>
              </div>
              <Clock className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {deadlines.length}
                </p>
              </div>
              <Calendar className="h-8 w-8 text-gray-900" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Mini Calendar */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Novembro 2025</CardTitle>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-2 text-center">
            {/* Week days */}
            {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map((day) => (
              <div key={day} className="text-xs font-medium text-gray-500 py-2">
                {day}
              </div>
            ))}

            {/* Days */}
            {Array.from({ length: 30 }, (_, i) => i + 1).map((day) => {
              const hasDeadline = [25, 30].includes(day)
              return (
                <div
                  key={day}
                  className={`
                    p-2 text-sm rounded-lg cursor-pointer
                    ${hasDeadline ? 'bg-orange-100 font-bold text-orange-900' : 'hover:bg-gray-100'}
                    ${day === 20 ? 'bg-primary-600 text-white' : ''}
                  `}
                >
                  {day}
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Upcoming Deadlines */}
      <div className="space-y-6">
        {/* This Week */}
        {upcomingThisWeek.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Esta Semana
            </h3>
            <div className="space-y-3">
              {upcomingThisWeek.map((deadline) => (
                <Card
                  key={deadline.id}
                  className={`border-2 ${getUrgencyColor(deadline.daysUntil)}`}
                >
                  <CardContent className="pt-6">
                    <div className="flex flex-col lg:flex-row lg:items-start gap-4">
                      <div className="flex-1">
                        <div className="flex items-start gap-3">
                          <div className="w-12 h-12 rounded-lg bg-white border border-gray-200 flex items-center justify-center flex-shrink-0">
                            <Calendar className="h-6 w-6 text-primary-600" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <h4 className="font-semibold text-lg text-gray-900">
                                    {deadline.title}
                                  </h4>
                                  <Badge variant={getUrgencyBadge(deadline.daysUntil)}>
                                    {getUrgencyIcon(deadline.daysUntil)}
                                    <span className="ml-1">
                                      {deadline.daysUntil} {deadline.daysUntil === 1 ? 'dia' : 'dias'}
                                    </span>
                                  </Badge>
                                </div>
                                <p className="text-sm text-gray-600 mt-1">
                                  {deadline.description}
                                </p>
                                {deadline.process.number && (
                                  <Link
                                    href={`/dashboard/processos/${deadline.process.number.split('-')[0]}`}
                                    className="text-sm text-primary-600 hover:text-primary-700 mt-2 inline-block"
                                  >
                                    {deadline.process.number} - {deadline.process.title}
                                  </Link>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="lg:min-w-[250px] space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          <span className="font-medium text-gray-900">
                            {deadline.date} às {deadline.time}
                          </span>
                        </div>
                        {deadline.location && (
                          <div className="flex items-center gap-2 text-sm">
                            <MapPin className="h-4 w-4 text-gray-400" />
                            <span className="text-gray-600">{deadline.location}</span>
                          </div>
                        )}
                        <Badge variant="outline" className="mt-2">
                          {deadline.type}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Next Week */}
        {upcomingNextWeek.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Próxima Semana
            </h3>
            <div className="space-y-3">
              {upcomingNextWeek.map((deadline) => (
                <Card key={deadline.id}>
                  <CardContent className="pt-6">
                    <div className="flex flex-col lg:flex-row lg:items-start gap-4">
                      <div className="flex-1">
                        <div className="flex items-start gap-3">
                          <div className="w-12 h-12 rounded-lg bg-primary-100 flex items-center justify-center flex-shrink-0">
                            <Calendar className="h-6 w-6 text-primary-600" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <h4 className="font-semibold text-lg text-gray-900">
                                    {deadline.title}
                                  </h4>
                                  <Badge variant="secondary">
                                    <Clock className="h-4 w-4 mr-1" />
                                    {deadline.daysUntil} dias
                                  </Badge>
                                </div>
                                <p className="text-sm text-gray-600 mt-1">
                                  {deadline.description}
                                </p>
                                {deadline.process.number && (
                                  <Link
                                    href={`/dashboard/processos/${deadline.process.number.split('-')[0]}`}
                                    className="text-sm text-primary-600 hover:text-primary-700 mt-2 inline-block"
                                  >
                                    {deadline.process.number} - {deadline.process.title}
                                  </Link>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="lg:min-w-[250px] space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          <span className="font-medium text-gray-900">
                            {deadline.date} às {deadline.time}
                          </span>
                        </div>
                        {deadline.location && (
                          <div className="flex items-center gap-2 text-sm">
                            <MapPin className="h-4 w-4 text-gray-400" />
                            <span className="text-gray-600">{deadline.location}</span>
                          </div>
                        )}
                        <Badge variant="outline" className="mt-2">
                          {deadline.type}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
