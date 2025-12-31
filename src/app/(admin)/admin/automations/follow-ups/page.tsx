'use client'

/**
 * Admin Follow-ups Management
 * Gerencia regras automáticas de follow-up para leads
 */

import { useState } from 'react'
import { AdminPageHeader } from '@/components/admin/AdminPageHeader'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
  MessageCircle,
  Mail,
  Clock,
  Plus,
  Search,
  Edit,
  Play,
  Pause,
  Users,
  CheckCircle2
} from 'lucide-react'
import Link from 'next/link'

interface FollowUpRule {
  id: string
  name: string
  description: string
  trigger: {
    type: 'lead_created' | 'form_submitted' | 'email_opened' | 'no_response' | 'inactive'
    condition: string
  }
  action: {
    type: 'email' | 'whatsapp' | 'sms'
    delay: number
    delayUnit: 'hours' | 'days'
    templateId: string
  }
  status: 'active' | 'paused'
  stats: {
    triggered: number
    sent: number
    responseRate: number
  }
  createdAt: string
}

const FOLLOW_UP_RULES: FollowUpRule[] = [
  {
    id: 'new-lead-whatsapp',
    name: 'WhatsApp Imediato - Novo Lead',
    description: 'Envia WhatsApp automático quando novo lead qualificado se cadastra',
    trigger: {
      type: 'lead_created',
      condition: 'score >= 70',
    },
    action: {
      type: 'whatsapp',
      delay: 5,
      delayUnit: 'hours',
      templateId: 'whatsapp-new-lead',
    },
    status: 'active',
    stats: {
      triggered: 234,
      sent: 231,
      responseRate: 42.3,
    },
    createdAt: '2024-12-15',
  },
  {
    id: 'email-opened-follow-up',
    name: 'Follow-up após Abertura de Email',
    description: 'Envia email adicional 24h após lead abrir o primeiro email',
    trigger: {
      type: 'email_opened',
      condition: 'first_email_opened',
    },
    action: {
      type: 'email',
      delay: 24,
      delayUnit: 'hours',
      templateId: 'follow-up-email-opened',
    },
    status: 'active',
    stats: {
      triggered: 645,
      sent: 642,
      responseRate: 28.5,
    },
    createdAt: '2024-12-10',
  },
  {
    id: 'no-response-3-days',
    name: 'Re-engajamento 3 Dias Sem Resposta',
    description: 'Email de reengajamento após 3 dias sem interação',
    trigger: {
      type: 'no_response',
      condition: 'days_since_last_interaction >= 3',
    },
    action: {
      type: 'email',
      delay: 72,
      delayUnit: 'hours',
      templateId: 'reengagement-3-days',
    },
    status: 'active',
    stats: {
      triggered: 156,
      sent: 153,
      responseRate: 15.2,
    },
    createdAt: '2024-12-05',
  },
  {
    id: 'form-submitted-confirmation',
    name: 'Confirmação de Formulário',
    description: 'Email de confirmação automático após preenchimento de formulário',
    trigger: {
      type: 'form_submitted',
      condition: 'any_form',
    },
    action: {
      type: 'email',
      delay: 1,
      delayUnit: 'hours',
      templateId: 'form-confirmation',
    },
    status: 'active',
    stats: {
      triggered: 892,
      sent: 889,
      responseRate: 65.8,
    },
    createdAt: '2024-11-20',
  },
  {
    id: 'inactive-30-days',
    name: 'Reativação de Lead Inativo (30 dias)',
    description: 'Tenta reativar leads sem interação há 30+ dias',
    trigger: {
      type: 'inactive',
      condition: 'days_since_last_interaction >= 30',
    },
    action: {
      type: 'email',
      delay: 0,
      delayUnit: 'hours',
      templateId: 'reactivation-30-days',
    },
    status: 'paused',
    stats: {
      triggered: 67,
      sent: 65,
      responseRate: 8.9,
    },
    createdAt: '2024-10-15',
  },
]

export default function FollowUpsPage() {
  const [rules] = useState<FollowUpRule[]>(FOLLOW_UP_RULES)
  const [filteredRules, setFilteredRules] = useState<FollowUpRule[]>(rules)
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    const filtered = rules.filter(
      (r) =>
        r.name.toLowerCase().includes(query.toLowerCase()) ||
        r.description.toLowerCase().includes(query.toLowerCase())
    )
    setFilteredRules(filtered)
  }

  const handleRefresh = async () => {
    setLoading(true)
    // TODO: Fetch rules from API
    setTimeout(() => setLoading(false), 1000)
  }

  const getActionIcon = (type: FollowUpRule['action']['type']) => {
    switch (type) {
      case 'email':
        return <Mail className="h-4 w-4" />
      case 'whatsapp':
        return <MessageCircle className="h-4 w-4" />
      case 'sms':
        return <MessageCircle className="h-4 w-4" />
    }
  }

  const getActionColor = (type: FollowUpRule['action']['type']) => {
    switch (type) {
      case 'email':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
      case 'whatsapp':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'sms':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
    }
  }

  const getStatusColor = (status: FollowUpRule['status']) => {
    switch (status) {
      case 'active':
        return 'default'
      case 'paused':
        return 'secondary'
    }
  }

  const totalStats = {
    totalRules: rules.length,
    activeRules: rules.filter((r) => r.status === 'active').length,
    totalSent: rules.reduce((acc, r) => acc + r.stats.sent, 0),
    avgResponseRate: (
      rules.reduce((acc, r) => acc + r.stats.responseRate, 0) / rules.length
    ).toFixed(1),
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Follow-ups Automáticos"
        description="Gerencie regras de follow-up baseadas em gatilhos"
        onRefresh={handleRefresh}
        refreshing={loading}
        action={
          <Button asChild>
            <Link href="/admin/automations/follow-ups/new">
              <Plus className="h-4 w-4 mr-2" />
              Nova Regra
            </Link>
          </Button>
        }
      />

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Regras</CardTitle>
            <MessageCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalStats.totalRules}</div>
            <p className="text-xs text-muted-foreground">
              {totalStats.activeRules} ativas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Mensagens Enviadas</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalStats.totalSent}</div>
            <p className="text-xs text-muted-foreground">últimos 30 dias</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Resposta</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{totalStats.avgResponseRate}%</div>
            <p className="text-xs text-muted-foreground">média geral</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Performance</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">Excelente</div>
            <p className="text-xs text-muted-foreground">acima da média</p>
          </CardContent>
        </Card>
      </div>

      {/* Rules List */}
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <CardTitle>Regras de Follow-up</CardTitle>
              <CardDescription>
                {filteredRules.length} regra(s) encontrada(s)
              </CardDescription>
            </div>

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar regras..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-8 w-full sm:w-[300px]"
              />
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="space-y-3">
            {filteredRules.map((rule) => (
              <div
                key={rule.id}
                className="flex items-start justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex-1">
                  {/* Header */}
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`p-2 rounded-lg ${getActionColor(rule.action.type)}`}>
                      {getActionIcon(rule.action.type)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold">{rule.name}</h3>
                        <Badge variant={getStatusColor(rule.status)}>
                          {rule.status === 'active' ? 'Ativa' : 'Pausada'}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {rule.description}
                      </p>
                    </div>
                  </div>

                  {/* Trigger & Action */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3 p-3 bg-muted/30 rounded-lg">
                    <div>
                      <p className="text-xs font-medium text-muted-foreground mb-1">
                        GATILHO
                      </p>
                      <div className="flex items-center gap-2">
                        <Clock className="h-3 w-3 text-muted-foreground" />
                        <span className="text-sm">{rule.trigger.condition}</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-muted-foreground mb-1">
                        AÇÃO
                      </p>
                      <div className="flex items-center gap-2">
                        {getActionIcon(rule.action.type)}
                        <span className="text-sm capitalize">
                          {rule.action.type} após {rule.action.delay} {rule.action.delayUnit === 'hours' ? 'horas' : 'dias'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                    <span>{rule.stats.triggered} gatilhos</span>
                    <span>•</span>
                    <span>{rule.stats.sent} enviados</span>
                    <span>•</span>
                    <span className="text-green-600 font-medium">
                      {rule.stats.responseRate}% taxa de resposta
                    </span>
                    <span>•</span>
                    <span>Criado em {new Date(rule.createdAt).toLocaleDateString('pt-BR')}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2 ml-4">
                  {rule.status === 'active' ? (
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
                    <Link href={`/admin/automations/follow-ups/${rule.id}`}>
                      <Edit className="h-4 w-4 mr-2" />
                      Editar
                    </Link>
                  </Button>
                </div>
              </div>
            ))}

            {filteredRules.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">
                  Nenhuma regra encontrada.
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
