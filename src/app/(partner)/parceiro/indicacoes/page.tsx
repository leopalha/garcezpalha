'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Search,
  Filter,
  CheckCircle,
  Clock,
  XCircle,
  DollarSign,
  Calendar,
  ArrowUpDown,
} from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

type ReferralStatus = 'pending' | 'qualified' | 'converted' | 'rejected' | 'paid'

type Referral = {
  id: string
  name: string
  email: string
  phone: string
  status: ReferralStatus
  createdAt: string
  qualifiedAt: string | null
  convertedAt: string | null
  commission: number | null
  paidAt: string | null
  caseType: string
  notes: string
}

const mockReferrals: Referral[] = [
  {
    id: '1',
    name: 'Maria Silva',
    email: 'maria.silva@email.com',
    phone: '(21) 99999-1111',
    status: 'converted',
    createdAt: '2024-01-15T10:00:00Z',
    qualifiedAt: '2024-01-16T14:00:00Z',
    convertedAt: '2024-01-20T09:00:00Z',
    commission: 2500,
    paidAt: null,
    caseType: 'Trabalhista',
    notes: 'Cliente muito satisfeito',
  },
  {
    id: '2',
    name: 'João Santos',
    email: 'joao.santos@email.com',
    phone: '(21) 98888-2222',
    status: 'qualified',
    createdAt: '2024-01-14T08:30:00Z',
    qualifiedAt: '2024-01-15T16:00:00Z',
    convertedAt: null,
    commission: null,
    paidAt: null,
    caseType: 'Cível',
    notes: 'Em negociação',
  },
  {
    id: '3',
    name: 'Ana Costa',
    email: 'ana.costa@email.com',
    phone: '(21) 97777-3333',
    status: 'pending',
    createdAt: '2024-01-13T11:00:00Z',
    qualifiedAt: null,
    convertedAt: null,
    commission: null,
    paidAt: null,
    caseType: 'Família',
    notes: 'Aguardando contato inicial',
  },
  {
    id: '4',
    name: 'Pedro Oliveira',
    email: 'pedro.oliveira@email.com',
    phone: '(21) 96666-4444',
    status: 'paid',
    createdAt: '2024-01-10T09:00:00Z',
    qualifiedAt: '2024-01-11T10:00:00Z',
    convertedAt: '2024-01-12T15:00:00Z',
    commission: 3200,
    paidAt: '2024-01-15T12:00:00Z',
    caseType: 'Criminal',
    notes: 'Comissão paga',
  },
  {
    id: '5',
    name: 'Carla Ferreira',
    email: 'carla.ferreira@email.com',
    phone: '(21) 95555-5555',
    status: 'rejected',
    createdAt: '2024-01-08T14:00:00Z',
    qualifiedAt: null,
    convertedAt: null,
    commission: null,
    paidAt: null,
    caseType: 'Trabalhista',
    notes: 'Não atende critérios mínimos',
  },
  {
    id: '6',
    name: 'Lucas Mendes',
    email: 'lucas.mendes@email.com',
    phone: '(21) 94444-6666',
    status: 'converted',
    createdAt: '2024-01-05T13:00:00Z',
    qualifiedAt: '2024-01-06T11:00:00Z',
    convertedAt: '2024-01-08T16:00:00Z',
    commission: 1800,
    paidAt: null,
    caseType: 'Imobiliário',
    notes: 'Contrato assinado',
  },
]

const statusConfig: Record<ReferralStatus, { label: string; color: string; icon: React.ElementType }> = {
  pending: { label: 'Pendente', color: 'bg-yellow-100 text-yellow-800', icon: Clock },
  qualified: { label: 'Qualificado', color: 'bg-blue-100 text-blue-800', icon: CheckCircle },
  converted: { label: 'Convertido', color: 'bg-green-100 text-green-800', icon: CheckCircle },
  rejected: { label: 'Rejeitado', color: 'bg-red-100 text-red-800', icon: XCircle },
  paid: { label: 'Pago', color: 'bg-purple-100 text-purple-800', icon: DollarSign },
}

export default function IndicacoesPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [sortBy, setSortBy] = useState<string>('date')

  const filteredReferrals = mockReferrals
    .filter((referral) => {
      const matchesSearch =
        referral.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        referral.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        referral.phone.includes(searchQuery)
      const matchesStatus = statusFilter === 'all' || referral.status === statusFilter
      return matchesSearch && matchesStatus
    })
    .sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      } else if (sortBy === 'name') {
        return a.name.localeCompare(b.name)
      } else if (sortBy === 'status') {
        return a.status.localeCompare(b.status)
      }
      return 0
    })

  const stats = {
    total: mockReferrals.length,
    pending: mockReferrals.filter((r) => r.status === 'pending').length,
    qualified: mockReferrals.filter((r) => r.status === 'qualified').length,
    converted: mockReferrals.filter((r) => r.status === 'converted' || r.status === 'paid').length,
    rejected: mockReferrals.filter((r) => r.status === 'rejected').length,
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Indicações</h2>
        <p className="text-muted-foreground">
          Acompanhe todas as suas indicações e seus status
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-5">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">Total</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
            <p className="text-xs text-muted-foreground">Pendentes</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-blue-600">{stats.qualified}</div>
            <p className="text-xs text-muted-foreground">Qualificados</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-green-600">{stats.converted}</div>
            <p className="text-xs text-muted-foreground">Convertidos</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-red-600">{stats.rejected}</div>
            <p className="text-xs text-muted-foreground">Rejeitados</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nome, email ou telefone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os Status</SelectItem>
                  <SelectItem value="pending">Pendente</SelectItem>
                  <SelectItem value="qualified">Qualificado</SelectItem>
                  <SelectItem value="converted">Convertido</SelectItem>
                  <SelectItem value="paid">Pago</SelectItem>
                  <SelectItem value="rejected">Rejeitado</SelectItem>
                </SelectContent>
              </Select>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[180px]">
                  <ArrowUpDown className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Ordenar" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date">Data</SelectItem>
                  <SelectItem value="name">Nome</SelectItem>
                  <SelectItem value="status">Status</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Referrals List */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Indicações</CardTitle>
          <CardDescription>{filteredReferrals.length} indicações encontradas</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredReferrals.map((referral) => {
              const StatusIcon = statusConfig[referral.status].icon
              return (
                <div
                  key={referral.id}
                  className="p-4 border rounded-lg hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold">{referral.name}</h4>
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium ${
                            statusConfig[referral.status].color
                          }`}
                        >
                          <StatusIcon className="h-3 w-3" />
                          {statusConfig[referral.status].label}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">{referral.email}</p>
                      <p className="text-sm text-muted-foreground">{referral.phone}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">{referral.caseType}</p>
                      {referral.commission && (
                        <p className="text-lg font-bold text-green-600">
                          R$ {referral.commission.toLocaleString('pt-BR')}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="mt-3 pt-3 border-t">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                      <div>
                        <p className="text-muted-foreground">Indicado em</p>
                        <p className="font-medium flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(referral.createdAt).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                      {referral.qualifiedAt && (
                        <div>
                          <p className="text-muted-foreground">Qualificado em</p>
                          <p className="font-medium">
                            {new Date(referral.qualifiedAt).toLocaleDateString('pt-BR')}
                          </p>
                        </div>
                      )}
                      {referral.convertedAt && (
                        <div>
                          <p className="text-muted-foreground">Convertido em</p>
                          <p className="font-medium">
                            {new Date(referral.convertedAt).toLocaleDateString('pt-BR')}
                          </p>
                        </div>
                      )}
                      {referral.paidAt && (
                        <div>
                          <p className="text-muted-foreground">Pago em</p>
                          <p className="font-medium text-green-600">
                            {new Date(referral.paidAt).toLocaleDateString('pt-BR')}
                          </p>
                        </div>
                      )}
                    </div>
                    {referral.notes && (
                      <p className="mt-2 text-xs text-muted-foreground italic">
                        &quot;{referral.notes}&quot;
                      </p>
                    )}
                  </div>
                </div>
              )
            })}

            {filteredReferrals.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <p>Nenhuma indicação encontrada</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
