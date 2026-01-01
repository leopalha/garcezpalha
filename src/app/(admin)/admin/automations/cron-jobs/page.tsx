'use client'

/**
 * Admin Cron Jobs Management
 * Monitor and manage all scheduled jobs (Inngest functions)
 */

import { useState } from 'react'
import { AdminPageHeader } from '@/components/admin/AdminPageHeader'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
  Clock,
  Search,
  Play,
  Pause,
  AlertCircle,
  CheckCircle2,
  XCircle,
  TrendingUp,
  Activity
} from 'lucide-react'

interface CronJob {
  id: string
  name: string
  description: string
  schedule: string
  scheduleHuman: string
  status: 'active' | 'paused' | 'error'
  lastRun?: {
    timestamp: string
    duration: number
    status: 'success' | 'failed'
    error?: string
  }
  nextRun: string
  stats: {
    totalRuns: number
    successfulRuns: number
    failedRuns: number
    avgDuration: number
  }
}

const CRON_JOBS: CronJob[] = [
  {
    id: 'process-email-sequences',
    name: 'Process Email Sequences',
    description: 'Processa e envia emails agendados das sequências',
    schedule: '*/15 * * * *',
    scheduleHuman: 'A cada 15 minutos',
    status: 'active',
    lastRun: {
      timestamp: '2024-12-30T12:00:00Z',
      duration: 2341,
      status: 'success',
    },
    nextRun: '2024-12-30T12:15:00Z',
    stats: {
      totalRuns: 2880,
      successfulRuns: 2876,
      failedRuns: 4,
      avgDuration: 2156,
    },
  },
  {
    id: 'generate-sequence-report',
    name: 'Generate Sequence Report',
    description: 'Gera relatório diário de métricas das sequências',
    schedule: '0 9 * * *',
    scheduleHuman: 'Diariamente às 9h',
    status: 'active',
    lastRun: {
      timestamp: '2024-12-30T09:00:00Z',
      duration: 1523,
      status: 'success',
    },
    nextRun: '2024-12-31T09:00:00Z',
    stats: {
      totalRuns: 30,
      successfulRuns: 30,
      failedRuns: 0,
      avgDuration: 1456,
    },
  },
  {
    id: 'process-monitor-cron',
    name: 'Process Monitor',
    description: 'Monitora processos judiciais e envia alertas',
    schedule: '*/30 * * * *',
    scheduleHuman: 'A cada 30 minutos',
    status: 'active',
    lastRun: {
      timestamp: '2024-12-30T11:30:00Z',
      duration: 3456,
      status: 'success',
    },
    nextRun: '2024-12-30T12:00:00Z',
    stats: {
      totalRuns: 1440,
      successfulRuns: 1438,
      failedRuns: 2,
      avgDuration: 3234,
    },
  },
  {
    id: 'whatsapp-follow-up',
    name: 'WhatsApp Follow-up',
    description: 'Envia follow-ups automáticos via WhatsApp',
    schedule: '0 10,14,18 * * *',
    scheduleHuman: 'Às 10h, 14h e 18h',
    status: 'active',
    lastRun: {
      timestamp: '2024-12-30T10:00:00Z',
      duration: 876,
      status: 'success',
    },
    nextRun: '2024-12-30T14:00:00Z',
    stats: {
      totalRuns: 90,
      successfulRuns: 87,
      failedRuns: 3,
      avgDuration: 934,
    },
  },
  {
    id: 'lead-scoring-update',
    name: 'Lead Scoring Update',
    description: 'Recalcula scores de todos os leads',
    schedule: '0 2 * * *',
    scheduleHuman: 'Diariamente às 2h',
    status: 'active',
    lastRun: {
      timestamp: '2024-12-30T02:00:00Z',
      duration: 5678,
      status: 'success',
    },
    nextRun: '2024-12-31T02:00:00Z',
    stats: {
      totalRuns: 30,
      successfulRuns: 29,
      failedRuns: 1,
      avgDuration: 5234,
    },
  },
  {
    id: 'cleanup-old-logs',
    name: 'Cleanup Old Logs',
    description: 'Remove logs com mais de 90 dias',
    schedule: '0 3 * * 0',
    scheduleHuman: 'Semanalmente aos domingos às 3h',
    status: 'active',
    lastRun: {
      timestamp: '2024-12-29T03:00:00Z',
      duration: 12345,
      status: 'success',
    },
    nextRun: '2025-01-05T03:00:00Z',
    stats: {
      totalRuns: 4,
      successfulRuns: 4,
      failedRuns: 0,
      avgDuration: 11234,
    },
  },
]

export default function CronJobsPage() {
  const [jobs] = useState<CronJob[]>(CRON_JOBS)
  const [filteredJobs, setFilteredJobs] = useState<CronJob[]>(jobs)
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    const filtered = jobs.filter(
      (j) =>
        j.name.toLowerCase().includes(query.toLowerCase()) ||
        j.description.toLowerCase().includes(query.toLowerCase())
    )
    setFilteredJobs(filtered)
  }

  const handleRefresh = async () => {
    setLoading(true)
    // TODO: Fetch jobs from API
    setTimeout(() => setLoading(false), 1000)
  }

  const getStatusIcon = (status: CronJob['status']) => {
    switch (status) {
      case 'active':
        return <CheckCircle2 className="h-4 w-4 text-green-600" />
      case 'paused':
        return <Pause className="h-4 w-4 text-yellow-600" />
      case 'error':
        return <XCircle className="h-4 w-4 text-red-600" />
    }
  }

  const getStatusColor = (status: CronJob['status']) => {
    switch (status) {
      case 'active':
        return 'default'
      case 'paused':
        return 'secondary'
      case 'error':
        return 'destructive'
    }
  }

  const formatDuration = (ms: number) => {
    if (ms < 1000) return `${ms}ms`
    return `${(ms / 1000).toFixed(1)}s`
  }

  const totalStats = {
    totalJobs: jobs.length,
    activeJobs: jobs.filter((j) => j.status === 'active').length,
    totalRuns: jobs.reduce((acc, j) => acc + j.stats.totalRuns, 0),
    avgSuccessRate: (
      (jobs.reduce((acc, j) => acc + j.stats.successfulRuns, 0) /
        jobs.reduce((acc, j) => acc + j.stats.totalRuns, 0)) *
      100
    ).toFixed(1),
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Cron Jobs"
        description="Monitore e gerencie tarefas agendadas (Inngest)"
        onRefresh={handleRefresh}
        refreshing={loading}
      />

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Jobs</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalStats.totalJobs}</div>
            <p className="text-xs text-muted-foreground">
              {totalStats.activeJobs} ativos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Execuções</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalStats.totalRuns.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">últimos 30 dias</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Sucesso</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{totalStats.avgSuccessRate}%</div>
            <p className="text-xs text-muted-foreground">média geral</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Status do Sistema</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">Saudável</div>
            <p className="text-xs text-muted-foreground">todos os jobs rodando</p>
          </CardContent>
        </Card>
      </div>

      {/* Jobs List */}
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <CardTitle>Tarefas Agendadas</CardTitle>
              <CardDescription>
                {filteredJobs.length} job(s) encontrado(s)
              </CardDescription>
            </div>

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar jobs..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-8 w-full sm:w-[300px]"
              />
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="space-y-3">
            {filteredJobs.map((job) => (
              <div
                key={job.id}
                className="flex items-start justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex-1">
                  {/* Header */}
                  <div className="flex items-center gap-3 mb-2">
                    {getStatusIcon(job.status)}
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{job.name}</h3>
                        <Badge variant={getStatusColor(job.status)}>
                          {job.status === 'active' ? 'Ativo' : job.status === 'paused' ? 'Pausado' : 'Erro'}
                        </Badge>
                        <Badge variant="outline" className="font-mono text-xs">
                          {job.schedule}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {job.description} • {job.scheduleHuman}
                      </p>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mt-3">
                    <div>
                      <p className="text-xs text-muted-foreground">Última Execução</p>
                      <p className="text-sm font-medium">
                        {job.lastRun
                          ? new Date(job.lastRun.timestamp).toLocaleString('pt-BR')
                          : 'Nunca'}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Próxima Execução</p>
                      <p className="text-sm font-medium">
                        {new Date(job.nextRun).toLocaleString('pt-BR')}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Taxa de Sucesso</p>
                      <p className="text-sm font-medium text-green-600">
                        {((job.stats.successfulRuns / job.stats.totalRuns) * 100).toFixed(1)}%
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Duração Média</p>
                      <p className="text-sm font-medium">
                        {formatDuration(job.stats.avgDuration)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Total de Runs</p>
                      <p className="text-sm font-medium">
                        {job.stats.totalRuns.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 ml-4">
                  <Button variant="outline" size="sm">
                    <Play className="h-4 w-4" />
                  </Button>
                  {job.status === 'active' ? (
                    <Button variant="outline" size="sm">
                      <Pause className="h-4 w-4" />
                    </Button>
                  ) : (
                    <Button variant="default" size="sm">
                      <Play className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            ))}

            {filteredJobs.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">
                  Nenhum cron job encontrado.
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Info Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-blue-600" />
            Sobre Cron Jobs
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <p>
            <strong>Inngest:</strong> Sistema de orquestração de eventos usado para agendar e executar cron jobs de forma confiável.
          </p>
          <p>
            <strong>Dashboard:</strong> Acesse{' '}
            <a href="https://app.inngest.com" target="_blank" rel="noopener" className="text-blue-600 hover:underline">
              app.inngest.com
            </a>{' '}
            para ver logs detalhados e métricas de cada execução.
          </p>
          <p>
            <strong>Free Tier:</strong> 50,000 step runs/mês grátis. Uso atual estimado: ~4,600 runs/mês (9%).
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
