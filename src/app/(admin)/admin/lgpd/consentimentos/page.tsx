'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  CheckCircle,
  XCircle,
  Clock,
  Search,
  Download,
  Eye,
  Shield,
  UserCheck,
  AlertTriangle,
  Loader2,
} from 'lucide-react'
import { ErrorAlert } from '@/components/ui/error-alert'
import { EmptyState } from '@/components/ui/empty-state'

type Consent = {
  id: string
  client_id: string
  client: {
    full_name: string
    email: string
  }
  consent_type: string
  purpose: string
  granted: boolean
  granted_at: string | null
  revoked: boolean
  revoked_at: string | null
  expires_at: string | null
  ip_address: string
  user_agent: string
  created_at: string
}

type ConsentStats = {
  total: number
  granted: number
  revoked: number
  expired: number
  pending: number
}

const consentTypeLabels: Record<string, string> = {
  data_processing: 'Processamento de Dados',
  marketing: 'Marketing e Comunicações',
  data_sharing: 'Compartilhamento de Dados',
  profiling: 'Perfilamento',
  sensitive_data: 'Dados Sensíveis',
  biometric_data: 'Dados Biométricos',
  location_tracking: 'Rastreamento de Localização',
}

export default function ConsentimentosPage() {
  const [consents, setConsents] = useState<Consent[]>([])
  const [stats, setStats] = useState<ConsentStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<string>('all')

  useEffect(() => {
    fetchConsents()
    fetchStats()
  }, [filterStatus])

  async function fetchConsents() {
    setLoading(true)
    setError(null)
    try {
      const params = new URLSearchParams()
      if (filterStatus !== 'all') params.set('status', filterStatus)
      params.set('limit', '100')

      const response = await fetch(`/api/admin/lgpd/consents?${params}`)
      if (!response.ok) throw new Error('Erro ao carregar consentimentos')

      const data = await response.json()
      setConsents(data.consents || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar consentimentos')
    } finally {
      setLoading(false)
    }
  }

  async function fetchStats() {
    try {
      const response = await fetch('/api/admin/lgpd/consents/stats')
      if (!response.ok) return

      const data = await response.json()
      setStats(data)
    } catch (err) {
      console.error('Error fetching stats:', err)
    }
  }

  async function exportConsents() {
    try {
      const response = await fetch('/api/admin/lgpd/consents/export')
      if (!response.ok) throw new Error('Erro ao exportar')

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `consentimentos-${new Date().toISOString().split('T')[0]}.csv`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (err) {
      setError('Erro ao exportar consentimentos')
    }
  }

  const filteredConsents = consents.filter((consent) =>
    consent.client.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    consent.client.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  function getStatusBadge(consent: Consent) {
    if (consent.revoked) {
      return <Badge variant="destructive" className="gap-1"><XCircle className="h-3 w-3" />Revogado</Badge>
    }
    if (consent.expires_at && new Date(consent.expires_at) < new Date()) {
      return <Badge variant="secondary" className="gap-1"><Clock className="h-3 w-3" />Expirado</Badge>
    }
    if (consent.granted) {
      return <Badge variant="default" className="gap-1"><CheckCircle className="h-3 w-3" />Ativo</Badge>
    }
    return <Badge variant="outline" className="gap-1"><AlertTriangle className="h-3 w-3" />Pendente</Badge>
  }

  if (loading && !stats) {
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
          <h1 className="text-3xl font-bold tracking-tight">Gestão de Consentimentos LGPD</h1>
          <p className="text-muted-foreground mt-1">
            Controle e auditoria de consentimentos de clientes
          </p>
        </div>

        <Button onClick={exportConsents}>
          <Download className="h-4 w-4 mr-2" />
          Exportar CSV
        </Button>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Shield className="h-4 w-4 text-blue-600" />
                Total
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
              <p className="text-xs text-muted-foreground mt-1">Consentimentos</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <UserCheck className="h-4 w-4 text-green-600" />
                Ativos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.granted}</div>
              <p className="text-xs text-muted-foreground mt-1">Consentimentos ativos</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <XCircle className="h-4 w-4 text-red-600" />
                Revogados
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{stats.revoked}</div>
              <p className="text-xs text-muted-foreground mt-1">Revogações</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Clock className="h-4 w-4 text-orange-600" />
                Expirados
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{stats.expired}</div>
              <p className="text-xs text-muted-foreground mt-1">Vencidos</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-yellow-600" />
                Pendentes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
              <p className="text-xs text-muted-foreground mt-1">Aguardando</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters */}
      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nome ou email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>

        <div className="flex gap-2">
          <Button
            variant={filterStatus === 'all' ? 'default' : 'outline'}
            onClick={() => setFilterStatus('all')}
            size="sm"
          >
            Todos
          </Button>
          <Button
            variant={filterStatus === 'granted' ? 'default' : 'outline'}
            onClick={() => setFilterStatus('granted')}
            size="sm"
          >
            Ativos
          </Button>
          <Button
            variant={filterStatus === 'revoked' ? 'default' : 'outline'}
            onClick={() => setFilterStatus('revoked')}
            size="sm"
          >
            Revogados
          </Button>
        </div>
      </div>

      {/* Error Alert */}
      {error && <ErrorAlert error={error} retry={fetchConsents} />}

      {/* Consents Table */}
      {filteredConsents.length === 0 ? (
        <EmptyState
          icon={Shield}
          title="Nenhum consentimento encontrado"
          description={
            searchTerm
              ? `Nenhum consentimento corresponde à busca "${searchTerm}"`
              : 'Nenhum consentimento registrado ainda'
          }
        />
      ) : (
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Cliente</TableHead>
                <TableHead>Tipo de Consentimento</TableHead>
                <TableHead>Finalidade</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Data de Concessão</TableHead>
                <TableHead>Expira em</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredConsents.map((consent) => (
                <TableRow key={consent.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{consent.client.full_name}</div>
                      <div className="text-sm text-muted-foreground">{consent.client.email}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {consentTypeLabels[consent.consent_type] || consent.consent_type}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="max-w-xs truncate text-sm">{consent.purpose}</div>
                  </TableCell>
                  <TableCell>{getStatusBadge(consent)}</TableCell>
                  <TableCell>
                    {consent.granted_at
                      ? new Date(consent.granted_at).toLocaleDateString('pt-BR')
                      : '-'}
                  </TableCell>
                  <TableCell>
                    {consent.expires_at
                      ? new Date(consent.expires_at).toLocaleDateString('pt-BR')
                      : 'Sem expiração'}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}
    </div>
  )
}
