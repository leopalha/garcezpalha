'use client'

/**
 * Admin Email Sequences Management
 * Gerencia sequências de email (welcome, nurture, reengagement, upsell)
 */

import { useState, useEffect } from 'react'
import { AdminPageHeader } from '@/components/admin/AdminPageHeader'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
  Mail,
  Plus,
  Search,
  Play,
  Pause,
  Edit,
  Copy,
  Trash2,
  TrendingUp,
  Users,
  Send,
  Eye
} from 'lucide-react'
import Link from 'next/link'

interface EmailSequence {
  id: string
  name: string
  description: string
  status: 'active' | 'paused' | 'archived'
  totalSteps: number
  subscribers: {
    active: number
    completed: number
    unsubscribed: number
  }
  metrics: {
    sent: number
    opened: number
    clicked: number
    openRate: number
    clickRate: number
  }
  createdAt: string
  lastModified: string
}

const SEQUENCES: EmailSequence[] = [
  {
    id: 'welcome-sequence',
    name: 'Sequência de Boas-Vindas',
    description: 'Emails automáticos para novos leads (4 emails em 14 dias)',
    status: 'active',
    totalSteps: 4,
    subscribers: {
      active: 234,
      completed: 156,
      unsubscribed: 12,
    },
    metrics: {
      sent: 892,
      opened: 645,
      clicked: 234,
      openRate: 72.3,
      clickRate: 26.2,
    },
    createdAt: '2024-12-01',
    lastModified: '2024-12-30',
  },
  {
    id: 'nurture-sequence',
    name: 'Nutrição de Leads',
    description: 'Conteúdo educativo para leads não qualificados',
    status: 'active',
    totalSteps: 6,
    subscribers: {
      active: 456,
      completed: 89,
      unsubscribed: 23,
    },
    metrics: {
      sent: 1567,
      opened: 1023,
      clicked: 345,
      openRate: 65.2,
      clickRate: 22.0,
    },
    createdAt: '2024-11-15',
    lastModified: '2024-12-28',
  },
  {
    id: 'reengagement-sequence',
    name: 'Reativação de Leads Inativos',
    description: 'Reconquistar leads que não interagem há 30+ dias',
    status: 'paused',
    totalSteps: 3,
    subscribers: {
      active: 67,
      completed: 234,
      unsubscribed: 45,
    },
    metrics: {
      sent: 456,
      opened: 178,
      clicked: 45,
      openRate: 39.0,
      clickRate: 9.9,
    },
    createdAt: '2024-10-20',
    lastModified: '2024-12-15',
  },
]

export default function EmailSequencesPage() {
  const [sequences] = useState<EmailSequence[]>(SEQUENCES)
  const [filteredSequences, setFilteredSequences] = useState<EmailSequence[]>(sequences)
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    let filtered = sequences

    if (searchQuery) {
      filtered = filtered.filter(
        (s) =>
          s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    setFilteredSequences(filtered)
  }, [searchQuery, sequences])

  const handleRefresh = async () => {
    setLoading(true)
    // TODO: Fetch sequences from API
    setTimeout(() => setLoading(false), 1000)
  }

  const getStatusColor = (status: EmailSequence['status']) => {
    switch (status) {
      case 'active':
        return 'default'
      case 'paused':
        return 'secondary'
      case 'archived':
        return 'outline'
    }
  }

  const totalStats = {
    totalSequences: sequences.length,
    activeSequences: sequences.filter((s) => s.status === 'active').length,
    totalSubscribers: sequences.reduce((acc, s) => acc + s.subscribers.active, 0),
    avgOpenRate: (
      sequences.reduce((acc, s) => acc + s.metrics.openRate, 0) / sequences.length
    ).toFixed(1),
    avgClickRate: (
      sequences.reduce((acc, s) => acc + s.metrics.clickRate, 0) / sequences.length
    ).toFixed(1),
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Sequências de Email"
        description="Gerencie sequências automáticas de email marketing"
        onRefresh={handleRefresh}
        refreshing={loading}
        action={
          <Button asChild>
            <Link href="/admin/automations/email-sequences/new">
              <Plus className="h-4 w-4 mr-2" />
              Nova Sequência
            </Link>
          </Button>
        }
      />

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalStats.totalSequences}</div>
            <p className="text-xs text-muted-foreground">
              {totalStats.activeSequences} ativas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inscritos</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalStats.totalSubscribers}</div>
            <p className="text-xs text-muted-foreground">recebendo emails</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Abertura</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalStats.avgOpenRate}%</div>
            <p className="text-xs text-muted-foreground">média geral</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Clique</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalStats.avgClickRate}%</div>
            <p className="text-xs text-muted-foreground">média geral</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Performance</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">Excelente</div>
            <p className="text-xs text-muted-foreground">acima da média do setor</p>
          </CardContent>
        </Card>
      </div>

      {/* Sequences List */}
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <CardTitle>Sequências</CardTitle>
              <CardDescription>
                {filteredSequences.length} sequência(s) encontrada(s)
              </CardDescription>
            </div>

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar sequências..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 w-full sm:w-[300px]"
              />
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="space-y-4">
            {filteredSequences.map((sequence) => (
              <div
                key={sequence.id}
                className="flex items-start justify-between p-6 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex-1">
                  {/* Header */}
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
                      <Mail className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-lg">{sequence.name}</h3>
                        <Badge variant={getStatusColor(sequence.status)}>
                          {sequence.status === 'active' ? 'Ativa' : sequence.status === 'paused' ? 'Pausada' : 'Arquivada'}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {sequence.description}
                      </p>
                    </div>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 p-4 bg-muted/30 rounded-lg">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Steps</p>
                      <p className="font-semibold">{sequence.totalSteps} emails</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Inscritos Ativos</p>
                      <p className="font-semibold">{sequence.subscribers.active}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Taxa de Abertura</p>
                      <p className="font-semibold text-green-600">{sequence.metrics.openRate}%</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Taxa de Clique</p>
                      <p className="font-semibold text-blue-600">{sequence.metrics.clickRate}%</p>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                    <span>{sequence.metrics.sent} emails enviados</span>
                    <span>•</span>
                    <span>{sequence.subscribers.completed} completaram</span>
                    <span>•</span>
                    <span>{sequence.subscribers.unsubscribed} cancelaram</span>
                    <span>•</span>
                    <span>Modificado em {new Date(sequence.lastModified).toLocaleDateString('pt-BR')}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2 ml-6">
                  {sequence.status === 'active' ? (
                    <Button variant="outline" size="sm">
                      <Pause className="h-4 w-4 mr-2" />
                      Pausar
                    </Button>
                  ) : (
                    <Button variant="outline" size="sm">
                      <Play className="h-4 w-4 mr-2" />
                      Ativar
                    </Button>
                  )}
                  <Button variant="default" size="sm" asChild>
                    <Link href={`/admin/automations/email-sequences/${sequence.id}`}>
                      <Edit className="h-4 w-4 mr-2" />
                      Editar
                    </Link>
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Copy className="h-4 w-4 mr-2" />
                    Duplicar
                  </Button>
                </div>
              </div>
            ))}

            {filteredSequences.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">
                  Nenhuma sequência encontrada.
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
