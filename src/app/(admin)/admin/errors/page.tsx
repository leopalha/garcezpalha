'use client'

import { useState } from 'react'
import { AdminPageHeader } from '@/components/admin/AdminPageHeader'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { AlertCircle, XCircle, TrendingDown, Clock } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface ErrorEntry {
  id: string
  timestamp: string
  type: string
  message: string
  stack?: string
  service: string
  endpoint?: string
  statusCode?: number
  count: number
  lastOccurrence: string
  resolved: boolean
  userId?: string
}

const MOCK_ERRORS: ErrorEntry[] = [
  {
    id: '1',
    timestamp: '2024-12-30T11:42:45Z',
    type: 'WebhookError',
    message: 'Payment webhook failed: Invalid signature',
    stack: `WebhookError: Invalid signature
    at verifySignature (webhook.ts:45)
    at POST /api/webhooks/mercadopago (route.ts:23)
    at processRequest (server.ts:156)`,
    service: 'mercadopago',
    endpoint: '/api/webhooks/mercadopago',
    statusCode: 401,
    count: 3,
    lastOccurrence: '2024-12-30T11:42:45Z',
    resolved: false,
  },
  {
    id: '2',
    timestamp: '2024-12-30T11:38:20Z',
    type: 'RateLimitError',
    message: 'API rate limit exceeded',
    stack: `RateLimitError: Rate limit exceeded
    at callOpenAI (openai-client.ts:67)
    at generateResponse (ceo-agent.ts:89)
    at POST /api/admin/agents/ceo/test (route.ts:45)`,
    service: 'openai',
    endpoint: '/api/admin/agents/ceo/test',
    statusCode: 429,
    count: 12,
    lastOccurrence: '2024-12-30T11:38:20Z',
    resolved: false,
  },
  {
    id: '3',
    timestamp: '2024-12-30T10:15:30Z',
    type: 'DatabaseError',
    message: 'Connection pool exhausted',
    stack: `DatabaseError: Connection pool exhausted
    at getConnection (pool.ts:123)
    at query (supabase-client.ts:45)
    at GET /api/admin/leads (route.ts:34)`,
    service: 'supabase',
    endpoint: '/api/admin/leads',
    statusCode: 500,
    count: 1,
    lastOccurrence: '2024-12-30T10:15:30Z',
    resolved: true,
  },
  {
    id: '4',
    timestamp: '2024-12-30T09:22:15Z',
    type: 'ValidationError',
    message: 'Invalid email format',
    service: 'resend',
    endpoint: '/api/admin/templates/send-test',
    statusCode: 400,
    count: 5,
    lastOccurrence: '2024-12-30T11:30:12Z',
    resolved: false,
  },
  {
    id: '5',
    timestamp: '2024-12-30T08:45:00Z',
    type: 'TimeoutError',
    message: 'Request timeout after 30s',
    stack: `TimeoutError: Request timeout
    at fetch (http-client.ts:89)
    at checkRegistry (registry-connector.ts:34)
    at analyzeProperty (real-estate-agent.ts:123)`,
    service: 'registry-api',
    endpoint: '/api/agents/real-estate',
    statusCode: 408,
    count: 2,
    lastOccurrence: '2024-12-30T08:45:00Z',
    resolved: true,
  },
]

export default function ErrorsPage() {
  const [errors] = useState<ErrorEntry[]>(MOCK_ERRORS)
  const [filteredErrors, setFilteredErrors] = useState<ErrorEntry[]>(errors)
  const [selectedType, setSelectedType] = useState<string>('all')
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'unresolved' | 'resolved'>('all')
  const [loading, setLoading] = useState(false)

  const handleTypeChange = (type: string) => {
    setSelectedType(type)
    filterErrors(type, selectedStatus)
  }

  const handleStatusChange = (status: 'all' | 'unresolved' | 'resolved') => {
    setSelectedStatus(status)
    filterErrors(selectedType, status)
  }

  const filterErrors = (type: string, status: 'all' | 'unresolved' | 'resolved') => {
    let filtered = errors

    if (type !== 'all') {
      filtered = filtered.filter((e) => e.type === type)
    }

    if (status === 'unresolved') {
      filtered = filtered.filter((e) => !e.resolved)
    } else if (status === 'resolved') {
      filtered = filtered.filter((e) => e.resolved)
    }

    setFilteredErrors(filtered)
  }

  const handleRefresh = async () => {
    setLoading(true)
    // TODO: Fetch errors from API
    setTimeout(() => setLoading(false), 1000)
  }

  const errorTypes = Array.from(new Set(errors.map((e) => e.type)))

  const stats = {
    total: errors.length,
    unresolved: errors.filter((e) => !e.resolved).length,
    resolved: errors.filter((e) => e.resolved).length,
    totalOccurrences: errors.reduce((acc, e) => acc + e.count, 0),
    last24h: errors.filter(
      (e) => new Date(e.lastOccurrence) > new Date(Date.now() - 24 * 60 * 60 * 1000)
    ).length,
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Monitoramento de Erros"
        description="Rastreie e resolva erros da plataforma"
        onRefresh={handleRefresh}
        refreshing={loading}
      />

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Erros</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">tipos únicos</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Não Resolvidos</CardTitle>
            <XCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.unresolved}</div>
            <p className="text-xs text-muted-foreground">requerem ação</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ocorrências</CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalOccurrences}</div>
            <p className="text-xs text-muted-foreground">total de eventos</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Últimas 24h</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.last24h}</div>
            <p className="text-xs text-muted-foreground">erros recentes</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4">
            <div>
              <CardTitle>Erros</CardTitle>
              <CardDescription>{filteredErrors.length} erro(s) encontrado(s)</CardDescription>
            </div>

            <div className="flex gap-2">
              {/* Type Filter */}
              <Select value={selectedType} onValueChange={handleTypeChange}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Tipo de Erro" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os Tipos</SelectItem>
                  {errorTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Status Filter */}
              <Select value={selectedStatus} onValueChange={handleStatusChange}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="unresolved">Não Resolvidos</SelectItem>
                  <SelectItem value="resolved">Resolvidos</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="space-y-4">
            {filteredErrors.map((error) => (
              <Card
                key={error.id}
                className={error.resolved ? 'opacity-60' : 'border-red-200 dark:border-red-800'}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant={error.resolved ? 'outline' : 'destructive'}>
                          {error.type}
                        </Badge>
                        {error.statusCode && (
                          <Badge variant="secondary" className="font-mono text-xs">
                            {error.statusCode}
                          </Badge>
                        )}
                        <Badge variant={error.resolved ? 'default' : 'secondary'}>
                          {error.resolved ? 'Resolvido' : 'Ativo'}
                        </Badge>
                      </div>
                      <CardTitle className="text-base">{error.message}</CardTitle>
                      <CardDescription className="mt-2 space-y-1">
                        <div className="flex items-center gap-2 text-xs">
                          <span>Serviço: {error.service}</span>
                          {error.endpoint && (
                            <>
                              <span>•</span>
                              <span className="font-mono">{error.endpoint}</span>
                            </>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-xs">
                          <span>Primeira ocorrência: {new Date(error.timestamp).toLocaleString('pt-BR')}</span>
                          <span>•</span>
                          <span>Última: {new Date(error.lastOccurrence).toLocaleString('pt-BR')}</span>
                          <span>•</span>
                          <span className="font-medium">{error.count} ocorrência(s)</span>
                        </div>
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>

                {error.stack && (
                  <CardContent>
                    <details>
                      <summary className="text-sm cursor-pointer text-muted-foreground hover:text-foreground mb-2">
                        Ver stack trace
                      </summary>
                      <pre className="p-3 bg-muted rounded text-xs overflow-x-auto font-mono">
                        {error.stack}
                      </pre>
                    </details>

                    {!error.resolved && (
                      <div className="mt-3 pt-3 border-t">
                        <Button variant="outline" size="sm">
                          Marcar como Resolvido
                        </Button>
                      </div>
                    )}
                  </CardContent>
                )}
              </Card>
            ))}

            {filteredErrors.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">
                  Nenhum erro encontrado com os filtros aplicados.
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
