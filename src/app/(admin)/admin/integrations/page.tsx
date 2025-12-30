'use client'

import { useState } from 'react'
import { AdminPageHeader } from '@/components/admin/AdminPageHeader'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Settings, CheckCircle2, XCircle, AlertCircle, RefreshCw } from 'lucide-react'
import Link from 'next/link'

interface Integration {
  id: string
  name: string
  description: string
  category: 'email' | 'payment' | 'signature' | 'calendar' | 'ai' | 'communication'
  status: 'connected' | 'disconnected' | 'error' | 'warning'
  lastChecked?: string
  errorMessage?: string
  config: {
    apiKey?: boolean
    webhook?: boolean
    oauth?: boolean
  }
  metrics?: {
    requestsToday: number
    successRate: number
    avgResponseTime: number
  }
}

const INTEGRATIONS: Integration[] = [
  {
    id: 'resend',
    name: 'Resend',
    description: 'Envio de emails transacionais e marketing',
    category: 'email',
    status: 'connected',
    lastChecked: '2024-12-30T11:30:00Z',
    config: {
      apiKey: true,
      webhook: true,
    },
    metrics: {
      requestsToday: 156,
      successRate: 99.8,
      avgResponseTime: 234,
    },
  },
  {
    id: 'whatsapp',
    name: 'WhatsApp Business API',
    description: 'Mensagens WhatsApp via Meta Cloud API',
    category: 'communication',
    status: 'connected',
    lastChecked: '2024-12-30T11:25:00Z',
    config: {
      apiKey: true,
      webhook: true,
    },
    metrics: {
      requestsToday: 89,
      successRate: 98.5,
      avgResponseTime: 456,
    },
  },
  {
    id: 'mercadopago',
    name: 'Mercado Pago',
    description: 'Pagamentos via PIX, cartão e boleto',
    category: 'payment',
    status: 'connected',
    lastChecked: '2024-12-30T11:20:00Z',
    config: {
      apiKey: true,
      webhook: true,
    },
    metrics: {
      requestsToday: 23,
      successRate: 100,
      avgResponseTime: 678,
    },
  },
  {
    id: 'clicksign',
    name: 'ClickSign',
    description: 'Assinatura digital de contratos',
    category: 'signature',
    status: 'warning',
    lastChecked: '2024-12-30T10:00:00Z',
    errorMessage: 'API key expira em 7 dias',
    config: {
      apiKey: true,
      webhook: true,
    },
    metrics: {
      requestsToday: 12,
      successRate: 95.2,
      avgResponseTime: 1234,
    },
  },
  {
    id: 'google-calendar',
    name: 'Google Calendar',
    description: 'Agendamento de consultas',
    category: 'calendar',
    status: 'connected',
    lastChecked: '2024-12-30T11:15:00Z',
    config: {
      oauth: true,
      webhook: false,
    },
    metrics: {
      requestsToday: 45,
      successRate: 99.1,
      avgResponseTime: 345,
    },
  },
  {
    id: 'google-gmail',
    name: 'Gmail API',
    description: 'Leitura e envio de emails via Gmail',
    category: 'email',
    status: 'connected',
    lastChecked: '2024-12-30T11:10:00Z',
    config: {
      oauth: true,
    },
    metrics: {
      requestsToday: 234,
      successRate: 99.6,
      avgResponseTime: 289,
    },
  },
  {
    id: 'groq',
    name: 'Groq API',
    description: 'Inferência rápida com Llama 3.3',
    category: 'ai',
    status: 'connected',
    lastChecked: '2024-12-30T11:32:00Z',
    config: {
      apiKey: true,
    },
    metrics: {
      requestsToday: 567,
      successRate: 99.9,
      avgResponseTime: 1234,
    },
  },
  {
    id: 'openai',
    name: 'OpenAI API',
    description: 'GPT-4 Turbo para agentes verticais',
    category: 'ai',
    status: 'disconnected',
    lastChecked: '2024-12-29T18:00:00Z',
    errorMessage: 'API key não configurada',
    config: {
      apiKey: false,
    },
  },
]

export default function IntegrationsPage() {
  const [integrations] = useState<Integration[]>(INTEGRATIONS)
  const [loading, setLoading] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<'all' | Integration['category']>('all')

  const filteredIntegrations =
    selectedCategory === 'all'
      ? integrations
      : integrations.filter((i) => i.category === selectedCategory)

  const handleRefresh = async () => {
    setLoading(true)
    // TODO: Fetch integrations status from API
    setTimeout(() => setLoading(false), 1000)
  }

  const getStatusIcon = (status: Integration['status']) => {
    switch (status) {
      case 'connected':
        return <CheckCircle2 className="h-4 w-4 text-green-600" />
      case 'disconnected':
        return <XCircle className="h-4 w-4 text-red-600" />
      case 'error':
        return <XCircle className="h-4 w-4 text-red-600" />
      case 'warning':
        return <AlertCircle className="h-4 w-4 text-yellow-600" />
    }
  }

  const getStatusColor = (status: Integration['status']) => {
    switch (status) {
      case 'connected':
        return 'default'
      case 'disconnected':
        return 'destructive'
      case 'error':
        return 'destructive'
      case 'warning':
        return 'secondary'
    }
  }

  const getCategoryColor = (category: Integration['category']) => {
    switch (category) {
      case 'email':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
      case 'payment':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'signature':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
      case 'calendar':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
      case 'ai':
        return 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200'
      case 'communication':
        return 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200'
    }
  }

  const stats = {
    total: integrations.length,
    connected: integrations.filter((i) => i.status === 'connected').length,
    disconnected: integrations.filter((i) => i.status === 'disconnected').length,
    warnings: integrations.filter((i) => i.status === 'warning').length,
    errors: integrations.filter((i) => i.status === 'error').length,
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Gerenciamento de Integrações"
        description="Configure e monitore todas as integrações da plataforma"
        onRefresh={handleRefresh}
        refreshing={loading}
      />

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">integrações disponíveis</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conectadas</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.connected}</div>
            <p className="text-xs text-muted-foreground">funcionando normalmente</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avisos</CardTitle>
            <AlertCircle className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.warnings}</div>
            <p className="text-xs text-muted-foreground">requerem atenção</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Desconectadas</CardTitle>
            <XCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {stats.disconnected + stats.errors}
            </div>
            <p className="text-xs text-muted-foreground">precisam configuração</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <CardTitle>Integrações</CardTitle>
              <CardDescription>
                {filteredIntegrations.length} integração(ões) encontrada(s)
              </CardDescription>
            </div>

            <div className="flex gap-1 bg-muted p-1 rounded-lg overflow-x-auto">
              {(['all', 'email', 'payment', 'signature', 'calendar', 'ai', 'communication'] as const).map(
                (cat) => (
                  <Button
                    key={cat}
                    variant={selectedCategory === cat ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setSelectedCategory(cat)}
                    className="whitespace-nowrap"
                  >
                    {cat === 'all'
                      ? 'Todas'
                      : cat === 'email'
                      ? 'Email'
                      : cat === 'payment'
                      ? 'Pagamento'
                      : cat === 'signature'
                      ? 'Assinatura'
                      : cat === 'calendar'
                      ? 'Calendário'
                      : cat === 'ai'
                      ? 'IA'
                      : 'Comunicação'}
                  </Button>
                )
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            {filteredIntegrations.map((integration) => (
              <Card key={integration.id} className="hover:bg-muted/50 transition-colors">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(integration.status)}
                      <div>
                        <CardTitle className="text-base">{integration.name}</CardTitle>
                        <CardDescription className="text-xs mt-1">
                          {integration.description}
                        </CardDescription>
                      </div>
                    </div>
                    <Badge variant={getStatusColor(integration.status)} className="text-xs">
                      {integration.status === 'connected'
                        ? 'Conectado'
                        : integration.status === 'disconnected'
                        ? 'Desconectado'
                        : integration.status === 'warning'
                        ? 'Aviso'
                        : 'Erro'}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {/* Category */}
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className={getCategoryColor(integration.category)}>
                      {integration.category}
                    </Badge>
                  </div>

                  {/* Config */}
                  <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                    {integration.config.apiKey !== undefined && (
                      <span>
                        API Key:{' '}
                        {integration.config.apiKey ? (
                          <span className="text-green-600">✓</span>
                        ) : (
                          <span className="text-red-600">✗</span>
                        )}
                      </span>
                    )}
                    {integration.config.webhook !== undefined && (
                      <>
                        <span>•</span>
                        <span>
                          Webhook:{' '}
                          {integration.config.webhook ? (
                            <span className="text-green-600">✓</span>
                          ) : (
                            <span className="text-red-600">✗</span>
                          )}
                        </span>
                      </>
                    )}
                    {integration.config.oauth !== undefined && (
                      <>
                        <span>•</span>
                        <span>
                          OAuth:{' '}
                          {integration.config.oauth ? (
                            <span className="text-green-600">✓</span>
                          ) : (
                            <span className="text-red-600">✗</span>
                          )}
                        </span>
                      </>
                    )}
                  </div>

                  {/* Metrics */}
                  {integration.metrics && (
                    <div className="grid grid-cols-3 gap-2 pt-2 border-t text-xs">
                      <div>
                        <p className="text-muted-foreground">Hoje</p>
                        <p className="font-medium">{integration.metrics.requestsToday}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Sucesso</p>
                        <p className="font-medium">{integration.metrics.successRate}%</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Latência</p>
                        <p className="font-medium">{integration.metrics.avgResponseTime}ms</p>
                      </div>
                    </div>
                  )}

                  {/* Error Message */}
                  {integration.errorMessage && (
                    <div className="p-2 bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800 rounded text-xs text-yellow-800 dark:text-yellow-200">
                      {integration.errorMessage}
                    </div>
                  )}

                  {/* Last Checked */}
                  {integration.lastChecked && (
                    <p className="text-xs text-muted-foreground">
                      Última verificação:{' '}
                      {new Date(integration.lastChecked).toLocaleString('pt-BR')}
                    </p>
                  )}

                  {/* Actions */}
                  <Button variant="outline" size="sm" className="w-full" asChild>
                    <Link href={`/admin/integrations/${integration.id}`}>
                      <Settings className="h-4 w-4 mr-2" />
                      Configurar
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredIntegrations.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                Nenhuma integração encontrada nesta categoria.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
