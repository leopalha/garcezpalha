'use client'

import { useState } from 'react'
import { AdminPageHeader } from '@/components/admin/AdminPageHeader'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Search, AlertCircle, Info, AlertTriangle, CheckCircle2, XCircle } from 'lucide-react'

interface LogEntry {
  id: string
  timestamp: string
  level: 'info' | 'warning' | 'error' | 'success'
  category: string
  service: string
  message: string
  metadata?: Record<string, any>
  userId?: string
  userEmail?: string
}

const MOCK_LOGS: LogEntry[] = [
  {
    id: '1',
    timestamp: '2024-12-30T11:45:23Z',
    level: 'info',
    category: 'email',
    service: 'resend',
    message: 'Email sent successfully',
    metadata: {
      to: 'cliente@example.com',
      template: 'welcome-email',
      emailId: 're_abc123',
    },
    userId: 'user_123',
    userEmail: 'admin@garcezpalha.com.br',
  },
  {
    id: '2',
    timestamp: '2024-12-30T11:44:15Z',
    level: 'success',
    category: 'agent',
    service: 'groq',
    message: 'Agent response generated',
    metadata: {
      agentId: 'real-estate',
      tokensUsed: 234,
      durationMs: 1234,
    },
    userId: 'user_456',
    userEmail: 'lead@example.com',
  },
  {
    id: '3',
    timestamp: '2024-12-30T11:43:02Z',
    level: 'warning',
    category: 'integration',
    service: 'clicksign',
    message: 'API key expires in 7 days',
    metadata: {
      expiresAt: '2025-01-06',
      integrationId: 'clicksign',
    },
  },
  {
    id: '4',
    timestamp: '2024-12-30T11:42:45Z',
    level: 'error',
    category: 'payment',
    service: 'mercadopago',
    message: 'Payment webhook failed',
    metadata: {
      orderId: 'order_789',
      error: 'Invalid signature',
      statusCode: 401,
    },
  },
  {
    id: '5',
    timestamp: '2024-12-30T11:41:30Z',
    level: 'info',
    category: 'automation',
    service: 'email-sequence',
    message: 'Email sequence started',
    metadata: {
      sequenceId: 'welcome-sequence',
      leadId: 'lead_123',
      stepNumber: 1,
    },
  },
  {
    id: '6',
    timestamp: '2024-12-30T11:40:12Z',
    level: 'success',
    category: 'document',
    service: 'pdf-generator',
    message: 'Contract generated successfully',
    metadata: {
      documentId: 'doc_456',
      type: 'contract',
      pages: 12,
    },
  },
  {
    id: '7',
    timestamp: '2024-12-30T11:39:05Z',
    level: 'warning',
    category: 'database',
    service: 'supabase',
    message: 'Slow query detected',
    metadata: {
      query: 'SELECT * FROM leads WHERE...',
      durationMs: 2345,
      threshold: 1000,
    },
  },
  {
    id: '8',
    timestamp: '2024-12-30T11:38:20Z',
    level: 'error',
    category: 'agent',
    service: 'openai',
    message: 'API rate limit exceeded',
    metadata: {
      agentId: 'ceo',
      statusCode: 429,
      retryAfter: 60,
    },
  },
]

export default function LogsPage() {
  const [logs] = useState<LogEntry[]>(MOCK_LOGS)
  const [filteredLogs, setFilteredLogs] = useState<LogEntry[]>(logs)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedLevel, setSelectedLevel] = useState<'all' | LogEntry['level']>('all')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [loading, setLoading] = useState(false)

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    filterLogs(query, selectedLevel, selectedCategory)
  }

  const handleLevelChange = (level: 'all' | LogEntry['level']) => {
    setSelectedLevel(level)
    filterLogs(searchQuery, level, selectedCategory)
  }

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category)
    filterLogs(searchQuery, selectedLevel, category)
  }

  const filterLogs = (query: string, level: 'all' | LogEntry['level'], category: string) => {
    let filtered = logs

    if (level !== 'all') {
      filtered = filtered.filter((l) => l.level === level)
    }

    if (category !== 'all') {
      filtered = filtered.filter((l) => l.category === category)
    }

    if (query) {
      filtered = filtered.filter(
        (l) =>
          l.message.toLowerCase().includes(query.toLowerCase()) ||
          l.service.toLowerCase().includes(query.toLowerCase()) ||
          l.category.toLowerCase().includes(query.toLowerCase())
      )
    }

    setFilteredLogs(filtered)
  }

  const handleRefresh = async () => {
    setLoading(true)
    // TODO: Fetch logs from API
    setTimeout(() => setLoading(false), 1000)
  }

  const getLevelIcon = (level: LogEntry['level']) => {
    switch (level) {
      case 'info':
        return <Info className="h-4 w-4 text-blue-600" />
      case 'success':
        return <CheckCircle2 className="h-4 w-4 text-green-600" />
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />
      case 'error':
        return <XCircle className="h-4 w-4 text-red-600" />
    }
  }

  const getLevelColor = (level: LogEntry['level']) => {
    switch (level) {
      case 'info':
        return 'bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800'
      case 'success':
        return 'bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800'
      case 'warning':
        return 'bg-yellow-50 dark:bg-yellow-950 border-yellow-200 dark:border-yellow-800'
      case 'error':
        return 'bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800'
    }
  }

  const getLevelBadgeColor = (level: LogEntry['level']) => {
    switch (level) {
      case 'info':
        return 'default'
      case 'success':
        return 'default'
      case 'warning':
        return 'secondary'
      case 'error':
        return 'destructive'
    }
  }

  const categories = Array.from(new Set(logs.map((l) => l.category)))

  const stats = {
    total: logs.length,
    info: logs.filter((l) => l.level === 'info').length,
    success: logs.filter((l) => l.level === 'success').length,
    warning: logs.filter((l) => l.level === 'warning').length,
    error: logs.filter((l) => l.level === 'error').length,
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Logs do Sistema"
        description="Monitore todas as atividades e eventos da plataforma"
        onRefresh={handleRefresh}
        refreshing={loading}
      />

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">eventos registrados</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Info</CardTitle>
            <Info className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.info}</div>
            <p className="text-xs text-muted-foreground">informativos</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sucesso</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.success}</div>
            <p className="text-xs text-muted-foreground">bem-sucedidos</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avisos</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.warning}</div>
            <p className="text-xs text-muted-foreground">requerem atenção</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Erros</CardTitle>
            <XCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.error}</div>
            <p className="text-xs text-muted-foreground">precisam correção</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4">
            <div>
              <CardTitle>Logs</CardTitle>
              <CardDescription>{filteredLogs.length} evento(s) encontrado(s)</CardDescription>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              {/* Search */}
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar logs..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-8"
                />
              </div>

              <div className="flex gap-2">
                {/* Level Filter */}
                <Select value={selectedLevel} onValueChange={handleLevelChange}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Nível" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="info">Info</SelectItem>
                    <SelectItem value="success">Sucesso</SelectItem>
                    <SelectItem value="warning">Avisos</SelectItem>
                    <SelectItem value="error">Erros</SelectItem>
                  </SelectContent>
                </Select>

                {/* Category Filter */}
                <Select value={selectedCategory} onValueChange={handleCategoryChange}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas</SelectItem>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="space-y-3">
            {filteredLogs.map((log) => (
              <div
                key={log.id}
                className={`p-4 border rounded-lg ${getLevelColor(log.level)}`}
              >
                <div className="flex items-start justify-between gap-4 mb-2">
                  <div className="flex items-center gap-2">
                    {getLevelIcon(log.level)}
                    <span className="font-medium">{log.message}</span>
                  </div>
                  <Badge variant={getLevelBadgeColor(log.level)} className="text-xs">
                    {log.level}
                  </Badge>
                </div>

                <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground mb-2">
                  <span>{new Date(log.timestamp).toLocaleString('pt-BR')}</span>
                  <span>•</span>
                  <Badge variant="outline" className="text-xs">
                    {log.category}
                  </Badge>
                  <span>•</span>
                  <span>{log.service}</span>
                  {log.userEmail && (
                    <>
                      <span>•</span>
                      <span>{log.userEmail}</span>
                    </>
                  )}
                </div>

                {log.metadata && (
                  <details className="mt-2">
                    <summary className="text-xs cursor-pointer text-muted-foreground hover:text-foreground">
                      Ver detalhes
                    </summary>
                    <pre className="mt-2 p-2 bg-muted rounded text-xs overflow-x-auto">
                      {JSON.stringify(log.metadata, null, 2)}
                    </pre>
                  </details>
                )}
              </div>
            ))}

            {filteredLogs.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">
                  Nenhum log encontrado com os filtros aplicados.
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
