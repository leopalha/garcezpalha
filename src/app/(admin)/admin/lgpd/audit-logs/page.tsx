'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  FileText,
  Search,
  Download,
  Filter,
  Eye,
  Database,
  Edit,
  Trash,
  UserPlus,
  Loader2,
} from 'lucide-react'
import { ErrorAlert } from '@/components/ui/error-alert'
import { EmptyState } from '@/components/ui/empty-state'

type AuditLog = {
  id: string
  user_id: string
  user: {
    full_name: string
    email: string
  } | null
  action: string
  resource_type: string
  resource_id: string | null
  ip_address: string
  user_agent: string
  details: Record<string, any>
  created_at: string
}

const actionLabels: Record<string, { label: string; icon: any; color: string }> = {
  CREATE: { label: 'Criado', icon: UserPlus, color: 'text-green-600' },
  UPDATE: { label: 'Atualizado', icon: Edit, color: 'text-blue-600' },
  DELETE: { label: 'Excluído', icon: Trash, color: 'text-red-600' },
  VIEW: { label: 'Visualizado', icon: Eye, color: 'text-gray-600' },
  EXPORT: { label: 'Exportado', icon: Download, color: 'text-purple-600' },
  ACCESS: { label: 'Acesso', icon: Database, color: 'text-yellow-600' },
}

export default function AuditLogsPage() {
  const [logs, setLogs] = useState<AuditLog[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterAction, setFilterAction] = useState<string>('all')
  const [filterResource, setFilterResource] = useState<string>('all')
  const [dateRange, setDateRange] = useState<'today' | 'week' | 'month' | 'all'>('week')

  useEffect(() => {
    fetchLogs()
  }, [filterAction, filterResource, dateRange])

  async function fetchLogs() {
    setLoading(true)
    setError(null)
    try {
      const params = new URLSearchParams()
      if (filterAction !== 'all') params.set('action', filterAction)
      if (filterResource !== 'all') params.set('resource_type', filterResource)
      if (dateRange !== 'all') params.set('range', dateRange)
      params.set('limit', '100')

      const response = await fetch(`/api/admin/audit-logs?${params}`)
      if (!response.ok) throw new Error('Erro ao carregar logs de auditoria')

      const data = await response.json()
      setLogs(data.logs || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar logs')
    } finally {
      setLoading(false)
    }
  }

  async function exportLogs() {
    try {
      const response = await fetch('/api/admin/audit-logs/export')
      if (!response.ok) throw new Error('Erro ao exportar')

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `audit-logs-${new Date().toISOString().split('T')[0]}.csv`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (err) {
      setError('Erro ao exportar logs')
    }
  }

  const filteredLogs = logs.filter((log) =>
    (log.user?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.user?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.ip_address.includes(searchTerm) ||
    log.action.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Logs de Auditoria</h1>
          <p className="text-muted-foreground mt-1">
            Rastreamento completo de ações do sistema para conformidade LGPD
          </p>
        </div>

        <Button onClick={exportLogs}>
          <Download className="h-4 w-4 mr-2" />
          Exportar Logs
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por usuário, IP ou ação..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>

        <Select value={filterAction} onValueChange={setFilterAction}>
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Ação" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas Ações</SelectItem>
            <SelectItem value="CREATE">Criação</SelectItem>
            <SelectItem value="UPDATE">Atualização</SelectItem>
            <SelectItem value="DELETE">Exclusão</SelectItem>
            <SelectItem value="VIEW">Visualização</SelectItem>
            <SelectItem value="EXPORT">Exportação</SelectItem>
          </SelectContent>
        </Select>

        <Select value={filterResource} onValueChange={setFilterResource}>
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Recurso" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos Recursos</SelectItem>
            <SelectItem value="client">Cliente</SelectItem>
            <SelectItem value="case">Caso</SelectItem>
            <SelectItem value="document">Documento</SelectItem>
            <SelectItem value="invoice">Fatura</SelectItem>
            <SelectItem value="user">Usuário</SelectItem>
          </SelectContent>
        </Select>

        <Select value={dateRange} onValueChange={(val: any) => setDateRange(val)}>
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Período" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="today">Hoje</SelectItem>
            <SelectItem value="week">Última Semana</SelectItem>
            <SelectItem value="month">Último Mês</SelectItem>
            <SelectItem value="all">Todos</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Error Alert */}
      {error && <ErrorAlert error={error} retry={fetchLogs} />}

      {/* Logs Table */}
      {filteredLogs.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="Nenhum log encontrado"
          description={
            searchTerm || filterAction !== 'all' || filterResource !== 'all'
              ? 'Tente ajustar os filtros'
              : 'Nenhum log de auditoria registrado'
          }
        />
      ) : (
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data/Hora</TableHead>
                <TableHead>Usuário</TableHead>
                <TableHead>Ação</TableHead>
                <TableHead>Recurso</TableHead>
                <TableHead>IP Address</TableHead>
                <TableHead>Detalhes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLogs.map((log) => {
                const actionConfig = actionLabels[log.action] || {
                  label: log.action,
                  icon: FileText,
                  color: 'text-gray-600',
                }
                const ActionIcon = actionConfig.icon

                return (
                  <TableRow key={log.id}>
                    <TableCell>
                      <div className="text-sm">
                        {new Date(log.created_at).toLocaleString('pt-BR')}
                      </div>
                    </TableCell>
                    <TableCell>
                      {log.user ? (
                        <div>
                          <div className="font-medium text-sm">{log.user.full_name}</div>
                          <div className="text-xs text-muted-foreground">{log.user.email}</div>
                        </div>
                      ) : (
                        <span className="text-muted-foreground text-sm">Sistema</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="gap-1">
                        <ActionIcon className={`h-3 w-3 ${actionConfig.color}`} />
                        {actionConfig.label}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div className="font-medium capitalize">{log.resource_type}</div>
                        {log.resource_id && (
                          <div className="text-xs text-muted-foreground font-mono">
                            {log.resource_id.slice(0, 8)}...
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <code className="text-xs bg-muted px-2 py-1 rounded">{log.ip_address}</code>
                    </TableCell>
                    <TableCell>
                      {Object.keys(log.details).length > 0 && (
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </Card>
      )}
    </div>
  )
}
