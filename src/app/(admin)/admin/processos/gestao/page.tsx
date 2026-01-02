'use client'

import { useState, useEffect } from 'react'
import { Plus, Search, Filter, MoreVertical, Eye, Edit, Trash2, Loader2, Calendar, User, Scale, FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ErrorAlert } from '@/components/ui/error-alert'
import { EmptyState } from '@/components/ui/empty-state'
import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { cn } from '@/lib/utils'

type ProcessStatus = 'aguardando_documentos' | 'em_analise' | 'em_andamento' | 'concluido' | 'cancelado'

type Process = {
  id: string
  client_id: string
  lawyer_id: string
  service_type: string
  status: ProcessStatus
  case_number: string | null
  court: string | null
  description: string | null
  current_phase: string | null
  progress: number
  next_step: string | null
  value: number | null
  created_at: string
  updated_at: string
  completed_at: string | null
  // Joined data
  client?: {
    full_name: string
    email: string
  }
  lawyer?: {
    full_name: string
  }
}

const statusConfig: Record<ProcessStatus, { label: string; color: string }> = {
  aguardando_documentos: {
    label: 'Aguardando Documentos',
    color: 'bg-yellow-100 text-yellow-800 border-yellow-300'
  },
  em_analise: {
    label: 'Em Análise',
    color: 'bg-blue-100 text-blue-800 border-blue-300'
  },
  em_andamento: {
    label: 'Em Andamento',
    color: 'bg-green-100 text-green-800 border-green-300'
  },
  concluido: {
    label: 'Concluído',
    color: 'bg-gray-100 text-gray-800 border-gray-300'
  },
  cancelado: {
    label: 'Cancelado',
    color: 'bg-red-100 text-red-800 border-red-300'
  }
}

export default function GestaoProcessosPage() {
  const [processes, setProcesses] = useState<Process[]>([])
  const [filteredProcesses, setFilteredProcesses] = useState<Process[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [activeTab, setActiveTab] = useState<'ativos' | 'concluidos'>('ativos')

  useEffect(() => {
    loadProcesses()
  }, [])

  useEffect(() => {
    filterProcesses()
  }, [searchTerm, statusFilter, activeTab, processes])

  async function loadProcesses() {
    try {
      setIsLoading(true)
      setError(null)

      const response = await fetch('/api/admin/processes')

      if (!response.ok) {
        throw new Error('Erro ao carregar processos')
      }

      const data = await response.json()
      setProcesses(data.processes || [])
    } catch (err) {
      console.error('Error loading processes:', err)
      setError(err instanceof Error ? err : new Error('Erro desconhecido'))
    } finally {
      setIsLoading(false)
    }
  }

  function filterProcesses() {
    let filtered = processes

    // Filter by tab (active/completed)
    if (activeTab === 'ativos') {
      filtered = filtered.filter(p =>
        p.status !== 'concluido' && p.status !== 'cancelado'
      )
    } else {
      filtered = filtered.filter(p =>
        p.status === 'concluido' || p.status === 'cancelado'
      )
    }

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(p => p.status === statusFilter)
    }

    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(p =>
        p.service_type.toLowerCase().includes(term) ||
        p.case_number?.toLowerCase().includes(term) ||
        p.client?.full_name.toLowerCase().includes(term) ||
        p.client?.email.toLowerCase().includes(term)
      )
    }

    setFilteredProcesses(filtered)
  }

  async function handleDeleteProcess(id: string) {
    if (!confirm('Tem certeza que deseja excluir este processo?')) {
      return
    }

    try {
      const response = await fetch(`/api/admin/processes/${id}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        throw new Error('Erro ao excluir processo')
      }

      // Remove from local state
      setProcesses(prev => prev.filter(p => p.id !== id))
    } catch (err) {
      console.error('Error deleting process:', err)
      alert('Erro ao excluir processo')
    }
  }

  const stats = {
    total: processes.length,
    ativos: processes.filter(p => p.status === 'em_andamento').length,
    aguardando: processes.filter(p => p.status === 'aguardando_documentos').length,
    concluidos: processes.filter(p => p.status === 'concluido').length,
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Gestão de Processos</h1>
            <p className="text-muted-foreground">
              Gerencie todos os processos jurídicos
            </p>
          </div>
        </div>

        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Gestão de Processos</h1>
            <p className="text-muted-foreground">
              Gerencie todos os processos jurídicos
            </p>
          </div>
        </div>

        <ErrorAlert error={error} retry={loadProcesses} />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gestão de Processos</h1>
          <p className="text-muted-foreground">
            Gerencie todos os processos jurídicos
          </p>
        </div>

        <Link href="/admin/processos/gestao/novo">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Novo Processo
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Processos</CardTitle>
            <Scale className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Em Andamento</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.ativos}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Aguardando Docs</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.aguardando}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Concluídos</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-600">{stats.concluidos}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por número, cliente, tipo..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[200px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Status</SelectItem>
                <SelectItem value="aguardando_documentos">Aguardando Docs</SelectItem>
                <SelectItem value="em_analise">Em Análise</SelectItem>
                <SelectItem value="em_andamento">Em Andamento</SelectItem>
                <SelectItem value="concluido">Concluído</SelectItem>
                <SelectItem value="cancelado">Cancelado</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'ativos' | 'concluidos')}>
        <TabsList>
          <TabsTrigger value="ativos">
            Ativos ({processes.filter(p => p.status !== 'concluido' && p.status !== 'cancelado').length})
          </TabsTrigger>
          <TabsTrigger value="concluidos">
            Concluídos ({processes.filter(p => p.status === 'concluido' || p.status === 'cancelado').length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          {filteredProcesses.length === 0 ? (
            <EmptyState
              icon={Scale}
              title="Nenhum processo encontrado"
              description={
                searchTerm || statusFilter !== 'all'
                  ? 'Tente ajustar os filtros de busca'
                  : 'Crie seu primeiro processo clicando no botão "Novo Processo"'
              }
            />
          ) : (
            <Card>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Número do Processo</TableHead>
                    <TableHead>Tipo de Serviço</TableHead>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Progresso</TableHead>
                    <TableHead>Atualizado</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProcesses.map((process) => (
                    <TableRow key={process.id}>
                      <TableCell className="font-medium">
                        {process.case_number || (
                          <span className="text-muted-foreground italic">
                            Não distribuído
                          </span>
                        )}
                      </TableCell>
                      <TableCell>{process.service_type}</TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-medium">{process.client?.full_name}</span>
                          <span className="text-sm text-muted-foreground">
                            {process.client?.email}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={cn('border', statusConfig[process.status].color)}
                        >
                          {statusConfig[process.status].label}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-gray-200 rounded-full h-2 max-w-[100px]">
                            <div
                              className="bg-primary rounded-full h-2 transition-all"
                              style={{ width: `${process.progress}%` }}
                            />
                          </div>
                          <span className="text-sm text-muted-foreground w-12">
                            {process.progress}%
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {formatDistanceToNow(new Date(process.updated_at), {
                          addSuffix: true,
                          locale: ptBR
                        })}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Ações</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem asChild>
                              <Link href={`/admin/processos/gestao/${process.id}`}>
                                <Eye className="h-4 w-4 mr-2" />
                                Ver Detalhes
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link href={`/admin/processos/gestao/${process.id}/editar`}>
                                <Edit className="h-4 w-4 mr-2" />
                                Editar
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-red-600"
                              onClick={() => handleDeleteProcess(process.id)}
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Excluir
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
