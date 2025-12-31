'use client'

/**
 * Security Audit Dashboard
 * P1-012: Monitor security events, metrics, and audit logs
 */

import { useEffect, useState } from 'react'
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
import {
  Search,
  Shield,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Activity,
  Users,
  Lock,
  Download,
  RefreshCw,
} from 'lucide-react'

interface SecurityMetrics {
  totalEvents: number
  failedLogins: number
  suspiciousRequests: number
  twoFactorEvents: number
  successfulActions: number
  failedActions: number
  successRate: number
}

interface TwoFactorAdoption {
  totalUsers: number
  users2FAEnabled: number
  adoptionRate: number
  adminsTotal: number
  admins2FAEnabled: number
  adminAdoptionRate: number
}

interface AuditLog {
  id: string
  created_at: string
  event_type: string
  resource_type: string | null
  resource_id: string | null
  user_id: string | null
  tenant_id: string
  ip_address: string | null
  user_agent: string | null
  success: boolean
  metadata: Record<string, any> | null
}

export default function SecurityDashboardPage() {
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [period, setPeriod] = useState('24h')

  // Metrics
  const [metrics, setMetrics] = useState<SecurityMetrics | null>(null)
  const [twoFactorAdoption, setTwoFactorAdoption] = useState<TwoFactorAdoption | null>(null)

  // Audit logs
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([])
  const [filteredLogs, setFilteredLogs] = useState<AuditLog[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedEventType, setSelectedEventType] = useState<string>('all')
  const [selectedSuccess, setSelectedSuccess] = useState<string>('all')
  const [totalLogs, setTotalLogs] = useState(0)
  const [currentPage, setCurrentPage] = useState(0)
  const pageSize = 20

  useEffect(() => {
    loadData()
  }, [period])

  useEffect(() => {
    filterLogs()
  }, [auditLogs, searchQuery, selectedEventType, selectedSuccess])

  const loadData = async () => {
    setLoading(true)
    try {
      await Promise.all([loadMetrics(), loadAuditLogs()])
    } catch (error) {
      console.error('Failed to load security data:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadMetrics = async () => {
    try {
      const response = await fetch(`/api/admin/security/metrics?period=${period}`)
      if (!response.ok) throw new Error('Failed to fetch metrics')
      const data = await response.json()
      setMetrics(data.metrics)
      setTwoFactorAdoption(data.twoFactorAdoption)
    } catch (error) {
      console.error('Failed to load metrics:', error)
    }
  }

  const loadAuditLogs = async (offset = 0) => {
    try {
      const response = await fetch(
        `/api/admin/security/audit-logs?limit=${pageSize}&offset=${offset}`
      )
      if (!response.ok) throw new Error('Failed to fetch audit logs')
      const data = await response.json()
      setAuditLogs(data.logs || [])
      setTotalLogs(data.total || 0)
    } catch (error) {
      console.error('Failed to load audit logs:', error)
    }
  }

  const handleRefresh = async () => {
    setRefreshing(true)
    await loadData()
    setRefreshing(false)
  }

  const filterLogs = () => {
    let filtered = auditLogs

    if (selectedEventType !== 'all') {
      filtered = filtered.filter((log) => log.event_type === selectedEventType)
    }

    if (selectedSuccess !== 'all') {
      filtered = filtered.filter((log) => log.success === (selectedSuccess === 'true'))
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (log) =>
          log.event_type.toLowerCase().includes(query) ||
          log.resource_type?.toLowerCase().includes(query) ||
          log.ip_address?.toLowerCase().includes(query) ||
          JSON.stringify(log.metadata).toLowerCase().includes(query)
      )
    }

    setFilteredLogs(filtered)
  }

  const handleExport = () => {
    // Export audit logs to CSV
    const csv = [
      ['Timestamp', 'Event Type', 'Resource Type', 'Success', 'IP Address', 'User Agent'].join(
        ','
      ),
      ...filteredLogs.map((log) =>
        [
          log.created_at,
          log.event_type,
          log.resource_type || '',
          log.success ? 'Success' : 'Failed',
          log.ip_address || '',
          log.user_agent || '',
        ].join(',')
      ),
    ].join('\n')

    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `security-audit-${new Date().toISOString()}.csv`
    a.click()
  }

  const eventTypes = Array.from(new Set(auditLogs.map((log) => log.event_type)))

  const getStatusBadge = (success: boolean) => {
    if (success) {
      return (
        <Badge variant="default" className="bg-green-600">
          <CheckCircle2 className="h-3 w-3 mr-1" />
          Sucesso
        </Badge>
      )
    }
    return (
      <Badge variant="destructive">
        <XCircle className="h-3 w-3 mr-1" />
        Falha
      </Badge>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <RefreshCw className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Painel de Segurança"
        description="Monitore eventos de segurança, métricas e logs de auditoria"
        onRefresh={handleRefresh}
        refreshing={refreshing}
      />

      {/* Period Selector */}
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium">Período:</span>
        <Select value={period} onValueChange={setPeriod}>
          <SelectTrigger className="w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="24h">Últimas 24 horas</SelectItem>
            <SelectItem value="7d">Últimos 7 dias</SelectItem>
            <SelectItem value="30d">Últimos 30 dias</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Security Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Eventos</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics?.totalEvents.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Taxa de sucesso: {metrics?.successRate.toFixed(1)}%
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Logins Falhados</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {metrics?.failedLogins.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">tentativas sem sucesso</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Requisições Suspeitas</CardTitle>
            <Shield className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {metrics?.suspiciousRequests.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">bloqueadas ou sinalizadas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Eventos 2FA</CardTitle>
            <Lock className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {metrics?.twoFactorEvents.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">verificações e alterações</p>
          </CardContent>
        </Card>
      </div>

      {/* 2FA Adoption */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Adoção de 2FA - Usuários
            </CardTitle>
            <CardDescription>Estatísticas de autenticação de dois fatores</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Taxa de Adoção</span>
                  <span className="text-sm font-bold">
                    {twoFactorAdoption?.adoptionRate.toFixed(1)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${twoFactorAdoption?.adoptionRate || 0}%` }}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Total de Usuários</p>
                  <p className="text-2xl font-bold">{twoFactorAdoption?.totalUsers}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Com 2FA Ativo</p>
                  <p className="text-2xl font-bold text-green-600">
                    {twoFactorAdoption?.users2FAEnabled}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Adoção de 2FA - Administradores
            </CardTitle>
            <CardDescription>2FA obrigatório para admins</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Taxa de Adoção</span>
                  <span className="text-sm font-bold">
                    {twoFactorAdoption?.adminAdoptionRate.toFixed(1)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-600 h-2 rounded-full"
                    style={{ width: `${twoFactorAdoption?.adminAdoptionRate || 0}%` }}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Total de Admins</p>
                  <p className="text-2xl font-bold">{twoFactorAdoption?.adminsTotal}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Com 2FA Ativo</p>
                  <p className="text-2xl font-bold text-green-600">
                    {twoFactorAdoption?.admins2FAEnabled}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Audit Logs */}
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Logs de Auditoria</CardTitle>
                <CardDescription>
                  {filteredLogs.length} de {totalLogs.toLocaleString()} eventos
                </CardDescription>
              </div>
              <Button onClick={handleExport} variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Exportar CSV
              </Button>
            </div>

            {/* Filters */}
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar em logs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8"
                />
              </div>

              <Select value={selectedEventType} onValueChange={setSelectedEventType}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Tipo de Evento" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os Eventos</SelectItem>
                  {eventTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedSuccess} onValueChange={setSelectedSuccess}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="true">Sucesso</SelectItem>
                  <SelectItem value="false">Falha</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="space-y-3">
            {filteredLogs.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">
                  Nenhum log encontrado com os filtros aplicados.
                </p>
              </div>
            ) : (
              filteredLogs.map((log) => (
                <div
                  key={log.id}
                  className={`p-4 border rounded-lg ${
                    log.success
                      ? 'bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800'
                      : 'bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800'
                  }`}
                >
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="outline" className="text-xs">
                          {log.event_type}
                        </Badge>
                        {getStatusBadge(log.success)}
                      </div>
                      {log.resource_type && (
                        <p className="text-sm text-muted-foreground">
                          Recurso: {log.resource_type}
                          {log.resource_id && ` (${log.resource_id.substring(0, 8)}...)`}
                        </p>
                      )}
                    </div>
                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                      {new Date(log.created_at).toLocaleString('pt-BR')}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                    {log.ip_address && (
                      <span className="flex items-center gap-1">
                        <Shield className="h-3 w-3" />
                        {log.ip_address}
                      </span>
                    )}
                    {log.user_id && (
                      <span className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {log.user_id.substring(0, 8)}...
                      </span>
                    )}
                  </div>

                  {log.metadata && Object.keys(log.metadata).length > 0 && (
                    <details className="mt-2">
                      <summary className="text-xs cursor-pointer text-muted-foreground hover:text-foreground">
                        Ver metadados
                      </summary>
                      <pre className="mt-2 p-2 bg-muted rounded text-xs overflow-x-auto">
                        {JSON.stringify(log.metadata, null, 2)}
                      </pre>
                    </details>
                  )}
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
