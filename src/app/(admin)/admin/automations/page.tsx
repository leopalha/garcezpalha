'use client'

import { useState } from 'react'
import { AdminPageHeader } from '@/components/admin/AdminPageHeader'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Settings, Play, Pause, Clock, CheckCircle2 } from 'lucide-react'
import Link from 'next/link'

interface Automation {
  id: string
  name: string
  description: string
  type: 'email-sequence' | 'follow-up' | 'escalation' | 'cron-job'
  enabled: boolean
  schedule?: string
  lastRun?: string
  nextRun?: string
  successRate: number
  totalRuns: number
}

const AUTOMATIONS: Automation[] = [
  // Email Sequences
  {
    id: 'welcome-sequence',
    name: 'Sequência de Boas-vindas',
    description: '4 emails ao longo de 14 dias para novos leads',
    type: 'email-sequence',
    enabled: true,
    lastRun: '2024-12-30T11:00:00Z',
    nextRun: '2024-12-30T12:00:00Z',
    successRate: 98.5,
    totalRuns: 1247,
  },
  {
    id: 'appointment-reminder',
    name: 'Lembrete de Consulta',
    description: 'Email 24h e 1h antes da consulta',
    type: 'email-sequence',
    enabled: true,
    lastRun: '2024-12-30T10:30:00Z',
    nextRun: '2024-12-30T11:30:00Z',
    successRate: 99.2,
    totalRuns: 583,
  },
  {
    id: 'payment-reminder',
    name: 'Lembrete de Pagamento',
    description: '4 níveis de urgência: 7, 3, 1 dia antes e vencido',
    type: 'email-sequence',
    enabled: true,
    lastRun: '2024-12-30T09:00:00Z',
    nextRun: '2024-12-30T13:00:00Z',
    successRate: 97.8,
    totalRuns: 231,
  },

  // Follow-ups
  {
    id: 'lead-follow-up',
    name: 'Follow-up de Leads',
    description: 'Contato automático com leads sem resposta há 3 dias',
    type: 'follow-up',
    enabled: true,
    schedule: 'Diário às 10:00',
    lastRun: '2024-12-30T10:00:00Z',
    nextRun: '2024-12-31T10:00:00Z',
    successRate: 85.3,
    totalRuns: 456,
  },
  {
    id: 'contract-follow-up',
    name: 'Follow-up de Contratos',
    description: 'Lembrete para contratos não assinados há 5 dias',
    type: 'follow-up',
    enabled: true,
    schedule: 'Diário às 14:00',
    lastRun: '2024-12-30T14:00:00Z',
    nextRun: '2024-12-31T14:00:00Z',
    successRate: 92.1,
    totalRuns: 123,
  },

  // Escalation
  {
    id: 'urgent-lead-escalation',
    name: 'Escalação de Leads Urgentes',
    description: 'Notifica advogado senior para leads qualificados não atendidos em 2h',
    type: 'escalation',
    enabled: true,
    schedule: 'A cada 30 minutos',
    lastRun: '2024-12-30T11:30:00Z',
    nextRun: '2024-12-30T12:00:00Z',
    successRate: 100,
    totalRuns: 45,
  },
  {
    id: 'payment-failure-escalation',
    name: 'Escalação de Falha de Pagamento',
    description: 'Alerta financeiro para pagamentos recusados 3x',
    type: 'escalation',
    enabled: true,
    schedule: 'Em tempo real',
    lastRun: '2024-12-30T09:45:00Z',
    successRate: 100,
    totalRuns: 12,
  },

  // Cron Jobs
  {
    id: 'daily-metrics',
    name: 'Cálculo de Métricas Diárias',
    description: 'Consolida métricas de conversão, receita e performance',
    type: 'cron-job',
    enabled: true,
    schedule: 'Diário às 00:00',
    lastRun: '2024-12-30T00:00:00Z',
    nextRun: '2024-12-31T00:00:00Z',
    successRate: 100,
    totalRuns: 90,
  },
  {
    id: 'weekly-report',
    name: 'Relatório Semanal',
    description: 'Envia relatório executivo para CEO/CMO/CFO',
    type: 'cron-job',
    enabled: true,
    schedule: 'Segunda às 08:00',
    lastRun: '2024-12-30T08:00:00Z',
    nextRun: '2025-01-06T08:00:00Z',
    successRate: 100,
    totalRuns: 13,
  },
  {
    id: 'backup-database',
    name: 'Backup do Banco de Dados',
    description: 'Backup completo do Supabase',
    type: 'cron-job',
    enabled: true,
    schedule: 'Diário às 03:00',
    lastRun: '2024-12-30T03:00:00Z',
    nextRun: '2024-12-31T03:00:00Z',
    successRate: 100,
    totalRuns: 90,
  },
  {
    id: 'cleanup-logs',
    name: 'Limpeza de Logs',
    description: 'Remove logs com mais de 30 dias',
    type: 'cron-job',
    enabled: true,
    schedule: 'Semanal (Domingo às 02:00)',
    lastRun: '2024-12-29T02:00:00Z',
    nextRun: '2025-01-05T02:00:00Z',
    successRate: 100,
    totalRuns: 13,
  },
]

export default function AutomationsPage() {
  const [automations, setAutomations] = useState<Automation[]>(AUTOMATIONS)
  const [selectedType, setSelectedType] = useState<'all' | Automation['type']>('all')
  const [loading, setLoading] = useState(false)

  const filteredAutomations =
    selectedType === 'all'
      ? automations
      : automations.filter((a) => a.type === selectedType)

  const handleRefresh = async () => {
    setLoading(true)
    // TODO: Fetch automations from API
    setTimeout(() => setLoading(false), 1000)
  }

  const handleToggle = async (id: string, enabled: boolean) => {
    setAutomations((prev) =>
      prev.map((a) => (a.id === id ? { ...a, enabled } : a))
    )
    // TODO: Update automation status in API
  }

  const getTypeColor = (type: Automation['type']) => {
    switch (type) {
      case 'email-sequence':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
      case 'follow-up':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'escalation':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
      case 'cron-job':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
    }
  }

  const getTypeLabel = (type: Automation['type']) => {
    switch (type) {
      case 'email-sequence':
        return 'Email Sequence'
      case 'follow-up':
        return 'Follow-up'
      case 'escalation':
        return 'Escalação'
      case 'cron-job':
        return 'Cron Job'
    }
  }

  const stats = {
    total: automations.length,
    enabled: automations.filter((a) => a.enabled).length,
    disabled: automations.filter((a) => !a.enabled).length,
    avgSuccessRate: (
      automations.reduce((acc, a) => acc + a.successRate, 0) / automations.length
    ).toFixed(1),
    totalRuns: automations.reduce((acc, a) => acc + a.totalRuns, 0),
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Automações"
        description="Configure e monitore automações e cron jobs da plataforma"
        onRefresh={handleRefresh}
        refreshing={loading}
      />

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total</CardTitle>
            <Settings className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">automações configuradas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ativas</CardTitle>
            <Play className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.enabled}</div>
            <p className="text-xs text-muted-foreground">em execução</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Sucesso</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.avgSuccessRate}%</div>
            <p className="text-xs text-muted-foreground">média geral</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Execuções</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalRuns.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">últimos 30 dias</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <CardTitle>Automações</CardTitle>
              <CardDescription>
                {filteredAutomations.length} automação(ões) encontrada(s)
              </CardDescription>
            </div>

            <div className="flex gap-1 bg-muted p-1 rounded-lg overflow-x-auto">
              {(['all', 'email-sequence', 'follow-up', 'escalation', 'cron-job'] as const).map(
                (type) => (
                  <Button
                    key={type}
                    variant={selectedType === type ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setSelectedType(type)}
                    className="whitespace-nowrap"
                  >
                    {type === 'all' ? 'Todas' : getTypeLabel(type)}
                  </Button>
                )
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="space-y-3">
            {filteredAutomations.map((automation) => (
              <Card key={automation.id} className="hover:bg-muted/50 transition-colors">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline" className={getTypeColor(automation.type)}>
                          {getTypeLabel(automation.type)}
                        </Badge>
                        <Badge variant={automation.enabled ? 'default' : 'secondary'}>
                          {automation.enabled ? 'Ativo' : 'Pausado'}
                        </Badge>
                      </div>
                      <CardTitle className="text-base">{automation.name}</CardTitle>
                      <CardDescription className="mt-1">
                        {automation.description}
                      </CardDescription>
                    </div>

                    <Switch
                      checked={automation.enabled}
                      onCheckedChange={(checked) => handleToggle(automation.id, checked)}
                    />
                  </div>
                </CardHeader>

                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    {automation.schedule && (
                      <div>
                        <p className="text-muted-foreground">Agenda</p>
                        <p className="font-medium">{automation.schedule}</p>
                      </div>
                    )}

                    {automation.lastRun && (
                      <div>
                        <p className="text-muted-foreground">Última Execução</p>
                        <p className="font-medium">
                          {new Date(automation.lastRun).toLocaleString('pt-BR', {
                            day: '2-digit',
                            month: '2-digit',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                      </div>
                    )}

                    {automation.nextRun && (
                      <div>
                        <p className="text-muted-foreground">Próxima Execução</p>
                        <p className="font-medium">
                          {new Date(automation.nextRun).toLocaleString('pt-BR', {
                            day: '2-digit',
                            month: '2-digit',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                      </div>
                    )}

                    <div>
                      <p className="text-muted-foreground">Taxa de Sucesso</p>
                      <p className="font-medium text-green-600">{automation.successRate}%</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-4 pt-4 border-t">
                    <p className="text-xs text-muted-foreground">
                      {automation.totalRuns} execuções nos últimos 30 dias
                    </p>

                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/admin/automations/${automation.id}`}>
                        <Settings className="h-4 w-4 mr-2" />
                        Configurar
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}

            {filteredAutomations.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">
                  Nenhuma automação encontrada nesta categoria.
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
