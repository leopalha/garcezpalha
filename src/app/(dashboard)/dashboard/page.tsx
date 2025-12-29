import { StatsCard } from '@/components/dashboard/stats-card'
import { ProcessCard } from '@/components/dashboard/process-card'
import { FileText, Calendar, Upload, CreditCard, AlertCircle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'

interface ProcessAlertDB {
  id: string
  process_number?: string | null
  description?: string | null
  status?: string | null
  deadline_date?: string | null
  created_at: string
  tribunal?: string | null
}

export default async function DashboardPage() {
  const supabase = await createClient()

  // Fetch real data from Supabase
  const [processesResult, deadlinesResult, documentsResult, invoicesResult] = await Promise.all([
    supabase.from('process_alerts').select('*', { count: 'exact' }),
    supabase.from('process_alerts').select('*').gte('deadline_date', new Date().toISOString()).lte('deadline_date', new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()),
    supabase.from('process_documents').select('*', { count: 'exact' }),
    supabase.from('invoices').select('*', { count: 'exact' }).eq('status', 'pending'),
  ])

  const stats = {
    processes: processesResult.count || 0,
    upcomingDeadlines: deadlinesResult.data?.length || 0,
    documents: documentsResult.count || 0,
    pendingPayments: invoicesResult.count || 0,
  }

  // Get recent processes (limit 2)
  const { data: recentProcessesData } = await supabase
    .from('process_alerts')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(2)

  const recentProcesses = (recentProcessesData || []).map((p: ProcessAlertDB) => ({
    id: p.id,
    number: p.process_number,
    title: p.description || 'Processo sem descrição',
    status: p.status as 'active' | 'pending' | 'completed',
    nextDeadline: p.deadline_date ? new Date(p.deadline_date).toLocaleDateString('pt-BR') : undefined,
    lastUpdate: new Date(p.created_at).toLocaleDateString('pt-BR'),
    court: p.tribunal || 'Não informado',
  }))

  // Get upcoming deadlines
  const { data: upcomingDeadlinesData } = await supabase
    .from('process_alerts')
    .select('*')
    .not('deadline_date', 'is', null)
    .gte('deadline_date', new Date().toISOString())
    .order('deadline_date', { ascending: true })
    .limit(2)

  const upcomingDeadlines = (upcomingDeadlinesData || []).map((d: ProcessAlertDB) => {
    const deadlineDate = new Date(d.deadline_date!)
    const today = new Date()
    const daysRemaining = Math.ceil((deadlineDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

    return {
      id: d.id,
      title: d.description || 'Prazo sem descrição',
      date: deadlineDate.toLocaleDateString('pt-BR'),
      daysRemaining,
      processNumber: d.process_number,
    }
  })

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Processos Ativos"
            value={stats.processes}
            description="Processos em andamento"
            icon={FileText}
          />
          <StatsCard
            title="Prazos Próximos"
            value={stats.upcomingDeadlines}
            description="Nos próximos 7 dias"
            icon={Calendar}
          />
          <StatsCard
            title="Documentos"
            value={stats.documents}
            description="Total de documentos"
            icon={Upload}
          />
          <StatsCard
            title="Pagamentos Pendentes"
            value={stats.pendingPayments}
            description="Aguardando pagamento"
            icon={CreditCard}
          />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
          {/* Recent Processes */}
          <Card>
            <CardHeader>
              <CardTitle>Processos Recentes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentProcesses.map((process) => (
                <ProcessCard key={process.id} {...process} />
              ))}
              <Button asChild variant="outline" className="w-full">
                <Link href="/dashboard/processos">Ver Todos os Processos</Link>
              </Button>
            </CardContent>
          </Card>

          {/* Upcoming Deadlines */}
          <Card>
            <CardHeader>
              <CardTitle>Próximos Prazos</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {upcomingDeadlines.map((deadline) => (
                <div
                  key={deadline.id}
                  className="flex items-start gap-4 rounded-lg border p-4"
                >
                  <div className="flex-shrink-0">
                    {deadline.daysRemaining <= 3 ? (
                      <AlertCircle className="h-5 w-5 text-red-500" />
                    ) : (
                      <Calendar className="h-5 w-5 text-orange-500" />
                    )}
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium">{deadline.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {deadline.processNumber}
                    </p>
                    <p className="text-xs">
                      <span
                        className={
                          deadline.daysRemaining <= 3
                            ? 'text-red-600 font-medium'
                            : 'text-orange-600'
                        }
                      >
                        {deadline.daysRemaining} {deadline.daysRemaining === 1 ? 'dia' : 'dias'} restantes
                      </span>
                      {' · '}
                      <span className="text-muted-foreground">{deadline.date}</span>
                    </p>
                  </div>
                </div>
              ))}
              <Button asChild variant="outline" className="w-full">
                <Link href="/dashboard/prazos">Ver Todos os Prazos</Link>
              </Button>
            </CardContent>
          </Card>
      </div>

      {/* Quick Actions */}
      <Card>
          <CardHeader>
            <CardTitle>Ações Rápidas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <Button asChild variant="outline" className="h-20 flex-col gap-2">
                <Link href="/dashboard/documentos">
                  <Upload className="h-6 w-6" />
                  <span>Enviar Documento</span>
                </Link>
              </Button>
              <Button asChild variant="outline" className="h-20 flex-col gap-2">
                <Link href="/dashboard/processos">
                  <FileText className="h-6 w-6" />
                  <span>Ver Processos</span>
                </Link>
              </Button>
              <Button asChild variant="outline" className="h-20 flex-col gap-2">
                <Link href="/dashboard/pagamentos">
                  <CreditCard className="h-6 w-6" />
                  <span>Pagamentos</span>
                </Link>
              </Button>
            </div>
          </CardContent>
      </Card>
    </div>
  )
}
