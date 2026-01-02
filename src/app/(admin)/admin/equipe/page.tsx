'use client'

import { useState, useEffect } from 'react'
import { Plus, Search, Filter, MoreVertical, Eye, Edit, Trash2, Loader2, UserPlus, Scale, FileText, Users, TrendingUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
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
import { cn } from '@/lib/utils'

type LawyerStatus = 'active' | 'inactive' | 'on_leave'
type LawyerSpecialty = 'civil' | 'criminal' | 'family' | 'labor' | 'corporate' | 'tax' | 'real_estate' | 'immigration' | 'general'

interface Lawyer {
  id: string
  full_name: string
  email: string
  phone: string
  oab_number: string
  oab_state: string
  avatar_url: string | null
  specialties: LawyerSpecialty[]
  status: LawyerStatus
  role: 'admin' | 'lawyer'

  // Stats
  active_cases: number
  completed_cases: number
  total_cases: number
  workload_percentage: number
  success_rate: number

  // Dates
  joined_at: string
  last_active: string
}

const statusConfig: Record<LawyerStatus, { label: string; color: string }> = {
  active: {
    label: 'Ativo',
    color: 'bg-green-100 text-green-800 border-green-300'
  },
  inactive: {
    label: 'Inativo',
    color: 'bg-gray-100 text-gray-800 border-gray-300'
  },
  on_leave: {
    label: 'Afastado',
    color: 'bg-yellow-100 text-yellow-800 border-yellow-300'
  }
}

const specialtyLabels: Record<LawyerSpecialty, string> = {
  civil: 'Cível',
  criminal: 'Criminal',
  family: 'Família',
  labor: 'Trabalhista',
  corporate: 'Empresarial',
  tax: 'Tributário',
  real_estate: 'Imobiliário',
  immigration: 'Imigração',
  general: 'Geral'
}

export default function EquipePage() {
  const [lawyers, setLawyers] = useState<Lawyer[]>([])
  const [filteredLawyers, setFilteredLawyers] = useState<Lawyer[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [specialtyFilter, setSpecialtyFilter] = useState<string>('all')
  const [activeTab, setActiveTab] = useState<'all' | 'active' | 'inactive'>('all')

  useEffect(() => {
    loadLawyers()
  }, [])

  useEffect(() => {
    filterLawyers()
  }, [searchTerm, statusFilter, specialtyFilter, activeTab, lawyers])

  async function loadLawyers() {
    try {
      setIsLoading(true)
      setError(null)

      const response = await fetch('/api/admin/lawyers')

      if (!response.ok) {
        throw new Error('Erro ao carregar equipe')
      }

      const data = await response.json()
      setLawyers(data.lawyers || [])
    } catch (err) {
      console.error('Error loading lawyers:', err)
      setError(err instanceof Error ? err : new Error('Erro desconhecido'))
    } finally {
      setIsLoading(false)
    }
  }

  function filterLawyers() {
    let filtered = lawyers

    // Filter by tab (active/inactive)
    if (activeTab === 'active') {
      filtered = filtered.filter(l => l.status === 'active')
    } else if (activeTab === 'inactive') {
      filtered = filtered.filter(l => l.status === 'inactive' || l.status === 'on_leave')
    }

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(l => l.status === statusFilter)
    }

    // Filter by specialty
    if (specialtyFilter !== 'all') {
      filtered = filtered.filter(l =>
        l.specialties.includes(specialtyFilter as LawyerSpecialty)
      )
    }

    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(l =>
        l.full_name.toLowerCase().includes(term) ||
        l.email.toLowerCase().includes(term) ||
        l.oab_number.toLowerCase().includes(term)
      )
    }

    setFilteredLawyers(filtered)
  }

  async function handleDeleteLawyer(id: string, name: string) {
    if (!confirm(`Tem certeza que deseja remover ${name} da equipe?`)) {
      return
    }

    try {
      const response = await fetch(`/api/admin/lawyers/${id}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        throw new Error('Erro ao remover advogado')
      }

      // Remove from local state
      setLawyers(prev => prev.filter(l => l.id !== id))
    } catch (err) {
      console.error('Error deleting lawyer:', err)
      alert('Erro ao remover advogado da equipe')
    }
  }

  const stats = {
    total: lawyers.length,
    active: lawyers.filter(l => l.status === 'active').length,
    onLeave: lawyers.filter(l => l.status === 'on_leave').length,
    avgWorkload: lawyers.length > 0
      ? Math.round(lawyers.reduce((sum, l) => sum + l.workload_percentage, 0) / lawyers.length)
      : 0,
    totalActiveCases: lawyers.reduce((sum, l) => sum + l.active_cases, 0),
    avgSuccessRate: lawyers.length > 0
      ? Math.round(lawyers.reduce((sum, l) => sum + l.success_rate, 0) / lawyers.length)
      : 0
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Gestão de Equipe</h1>
            <p className="text-muted-foreground">
              Gerencie advogados e atribuição de casos
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
            <h1 className="text-3xl font-bold tracking-tight">Gestão de Equipe</h1>
            <p className="text-muted-foreground">
              Gerencie advogados e atribuição de casos
            </p>
          </div>
        </div>

        <ErrorAlert error={error} retry={loadLawyers} />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gestão de Equipe</h1>
          <p className="text-muted-foreground">
            Gerencie advogados e atribuição de casos
          </p>
        </div>

        <Link href="/admin/equipe/novo">
          <Button>
            <UserPlus className="h-4 w-4 mr-2" />
            Adicionar Advogado
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Advogados</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">
              {stats.active} ativos, {stats.onLeave} afastados
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Casos Ativos</CardTitle>
            <Scale className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalActiveCases}</div>
            <p className="text-xs text-muted-foreground">
              Em andamento na equipe
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Carga Média</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.avgWorkload}%</div>
            <p className="text-xs text-muted-foreground">
              Capacidade utilizada
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Sucesso</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.avgSuccessRate}%</div>
            <p className="text-xs text-muted-foreground">
              Média da equipe
            </p>
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
                  placeholder="Buscar por nome, email ou OAB..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Status</SelectItem>
                <SelectItem value="active">Ativo</SelectItem>
                <SelectItem value="inactive">Inativo</SelectItem>
                <SelectItem value="on_leave">Afastado</SelectItem>
              </SelectContent>
            </Select>

            <Select value={specialtyFilter} onValueChange={setSpecialtyFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Especialidade" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                {Object.entries(specialtyLabels).map(([key, label]) => (
                  <SelectItem key={key} value={key}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'all' | 'active' | 'inactive')}>
        <TabsList>
          <TabsTrigger value="all">
            Todos ({lawyers.length})
          </TabsTrigger>
          <TabsTrigger value="active">
            Ativos ({lawyers.filter(l => l.status === 'active').length})
          </TabsTrigger>
          <TabsTrigger value="inactive">
            Inativos ({lawyers.filter(l => l.status !== 'active').length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          {filteredLawyers.length === 0 ? (
            <EmptyState
              icon={Users}
              title="Nenhum advogado encontrado"
              description={
                searchTerm || statusFilter !== 'all' || specialtyFilter !== 'all'
                  ? 'Tente ajustar os filtros de busca'
                  : 'Adicione advogados à sua equipe clicando no botão "Adicionar Advogado"'
              }
            />
          ) : (
            <Card>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Advogado</TableHead>
                    <TableHead>OAB</TableHead>
                    <TableHead>Especialidades</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Casos Ativos</TableHead>
                    <TableHead>Carga</TableHead>
                    <TableHead>Sucesso</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLawyers.map((lawyer) => (
                    <TableRow key={lawyer.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage src={lawyer.avatar_url || undefined} />
                            <AvatarFallback>
                              {lawyer.full_name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{lawyer.full_name}</p>
                            <p className="text-sm text-muted-foreground">{lawyer.email}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-mono text-sm">
                          {lawyer.oab_number}/{lawyer.oab_state}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {lawyer.specialties.slice(0, 2).map((spec) => (
                            <Badge key={spec} variant="secondary" className="text-xs">
                              {specialtyLabels[spec]}
                            </Badge>
                          ))}
                          {lawyer.specialties.length > 2 && (
                            <Badge variant="secondary" className="text-xs">
                              +{lawyer.specialties.length - 2}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={cn('border', statusConfig[lawyer.status].color)}
                        >
                          {statusConfig[lawyer.status].label}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-center">
                          <div className="font-semibold">{lawyer.active_cases}</div>
                          <div className="text-xs text-muted-foreground">
                            de {lawyer.total_cases} total
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-gray-200 rounded-full h-2 max-w-[80px]">
                            <div
                              className={cn(
                                'rounded-full h-2 transition-all',
                                lawyer.workload_percentage >= 90 ? 'bg-red-500' :
                                lawyer.workload_percentage >= 70 ? 'bg-yellow-500' :
                                'bg-green-500'
                              )}
                              style={{ width: `${Math.min(lawyer.workload_percentage, 100)}%` }}
                            />
                          </div>
                          <span className="text-sm text-muted-foreground w-12 text-right">
                            {lawyer.workload_percentage}%
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-center font-medium text-green-600">
                          {lawyer.success_rate}%
                        </div>
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
                              <Link href={`/admin/equipe/${lawyer.id}`}>
                                <Eye className="h-4 w-4 mr-2" />
                                Ver Perfil
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link href={`/admin/equipe/${lawyer.id}/editar`}>
                                <Edit className="h-4 w-4 mr-2" />
                                Editar
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-red-600"
                              onClick={() => handleDeleteLawyer(lawyer.id, lawyer.full_name)}
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Remover da Equipe
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
