'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Search,
  Filter,
  MoreHorizontal,
  Mail,
  Phone,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Loader2,
  RefreshCw,
} from 'lucide-react'
import { trpc } from '@/lib/trpc/client'

type Lead = {
  id: string
  full_name: string
  email: string
  phone: string
  company: string | null
  service_interest: string
  message: string | null
  source: 'website' | 'whatsapp' | 'chatbot' | 'referral'
  status: 'new' | 'contacted' | 'qualified' | 'converted' | 'lost'
  assigned_to: string | null
  created_at: string
  updated_at: string
}

const statusConfig = {
  new: { label: 'Novo', color: 'bg-blue-100 text-blue-800 border-blue-200' },
  contacted: { label: 'Contatado', color: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
  qualified: { label: 'Qualificado', color: 'bg-green-100 text-green-800 border-green-200' },
  converted: { label: 'Convertido', color: 'bg-purple-100 text-purple-800 border-purple-200' },
  lost: { label: 'Perdido', color: 'bg-red-100 text-red-800 border-red-200' },
}

const sourceConfig = {
  website: { label: 'Website', color: 'bg-slate-200 text-slate-900' },
  whatsapp: { label: 'WhatsApp', color: 'bg-green-100 text-green-800' },
  chatbot: { label: 'Chatbot', color: 'bg-blue-100 text-blue-800' },
  referral: { label: 'Indicação', color: 'bg-orange-100 text-orange-800' },
}

// Mock data fallback when database is not configured
const mockLeads: Lead[] = [
  {
    id: '1',
    full_name: 'Maria Silva Santos',
    email: 'maria.silva@email.com',
    phone: '(21) 99999-1111',
    company: null,
    service_interest: 'Direito Imobiliário',
    source: 'website',
    status: 'new',
    assigned_to: null,
    created_at: new Date(Date.now() - 3600000).toISOString(),
    updated_at: new Date(Date.now() - 3600000).toISOString(),
    message: 'Preciso de ajuda com contrato de compra e venda de imóvel',
  },
  {
    id: '2',
    full_name: 'João Carlos Oliveira',
    email: 'joao.carlos@email.com',
    phone: '(21) 98888-2222',
    company: 'Oliveira Construções',
    service_interest: 'Perícia Médica',
    source: 'whatsapp',
    status: 'contacted',
    assigned_to: null,
    created_at: new Date(Date.now() - 7200000).toISOString(),
    updated_at: new Date(Date.now() - 7200000).toISOString(),
    message: 'Sofri acidente de trabalho e preciso de perícia',
  },
  {
    id: '3',
    full_name: 'Ana Paula Costa',
    email: 'ana.costa@email.com',
    phone: '(21) 97777-3333',
    company: null,
    service_interest: 'Avaliação de Imóveis',
    source: 'chatbot',
    status: 'qualified',
    assigned_to: null,
    created_at: new Date(Date.now() - 86400000).toISOString(),
    updated_at: new Date(Date.now() - 86400000).toISOString(),
    message: 'Preciso avaliar apartamento para inventário',
  },
  {
    id: '4',
    full_name: 'Carlos Eduardo Lima',
    email: 'carlos.lima@email.com',
    phone: '(21) 96666-4444',
    company: 'Lima Advocacia',
    service_interest: 'Perícia Documental',
    source: 'referral',
    status: 'converted',
    assigned_to: null,
    created_at: new Date(Date.now() - 172800000).toISOString(),
    updated_at: new Date(Date.now() - 172800000).toISOString(),
    message: 'Indicado pelo Dr. Roberto para análise de assinaturas',
  },
  {
    id: '5',
    full_name: 'Patricia Almeida',
    email: 'patricia.almeida@email.com',
    phone: '(21) 95555-5555',
    company: null,
    service_interest: 'Secretária Remota',
    source: 'website',
    status: 'new',
    assigned_to: null,
    created_at: new Date(Date.now() - 259200000).toISOString(),
    updated_at: new Date(Date.now() - 259200000).toISOString(),
    message: 'Interessada no plano premium de automação',
  },
]

export default function LeadsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null)
  const [page, setPage] = useState(0)
  const [useMockData, setUseMockData] = useState(false)
  const pageSize = 20

  // Fetch leads from tRPC
  const {
    data: leadsData,
    isLoading,
    error,
    refetch,
  } = trpc.leads.list.useQuery(
    {
      status: statusFilter !== 'all' ? (statusFilter as Lead['status']) : undefined,
      limit: pageSize,
      offset: page * pageSize,
    },
    {
      retry: false,
      enabled: !useMockData,
    }
  )

  // Update status mutation
  const updateStatusMutation = trpc.leads.updateStatus.useMutation({
    onSuccess: () => {
      refetch()
    },
  })

  // Handle errors by falling back to mock data
  useEffect(() => {
    if (error) {
      console.log('Database not configured, using mock data')
      setUseMockData(true)
    }
  }, [error])

  const leads = useMockData ? mockLeads : leadsData?.leads || []
  const totalLeads = useMockData ? mockLeads.length : leadsData?.total || 0

  // Client-side filtering for mock data
  const filteredLeads = useMockData
    ? leads.filter((lead) => {
        const matchesSearch =
          lead.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          lead.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          lead.service_interest.toLowerCase().includes(searchQuery.toLowerCase())

        const matchesStatus = statusFilter === 'all' || lead.status === statusFilter

        return matchesSearch && matchesStatus
      })
    : leads.filter((lead) => {
        // Only search filter for real data (status is filtered server-side)
        if (!searchQuery) return true
        return (
          lead.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          lead.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          lead.service_interest.toLowerCase().includes(searchQuery.toLowerCase())
        )
      })

  const handleStatusChange = (leadId: string, newStatus: Lead['status']) => {
    if (useMockData) {
      // Update mock data locally
      const leadIndex = mockLeads.findIndex((l) => l.id === leadId)
      if (leadIndex !== -1) {
        mockLeads[leadIndex].status = newStatus
        if (selectedLead?.id === leadId) {
          setSelectedLead({ ...selectedLead, status: newStatus })
        }
      }
    } else {
      updateStatusMutation.mutate({ id: leadId, status: newStatus })
    }
  }

  // Count leads by status
  const statusCounts = useMockData
    ? Object.keys(statusConfig).reduce(
        (acc, status) => {
          acc[status] = mockLeads.filter((l) => l.status === status).length
          return acc
        },
        {} as Record<string, number>
      )
    : {}

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Leads</h2>
          <p className="text-muted-foreground">
            Gerencie seus potenciais clientes
            {useMockData && (
              <span className="ml-2 text-xs bg-amber-200 text-amber-900 px-2 py-0.5 rounded">
                Modo Demo
              </span>
            )}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="icon" onClick={() => refetch()} disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          </Button>
          <Button>Exportar CSV</Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nome, email ou serviço..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value)
                  setPage(0)
                }}
                className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="all">Todos os Status</option>
                <option value="new">Novo</option>
                <option value="contacted">Contatado</option>
                <option value="qualified">Qualificado</option>
                <option value="converted">Convertido</option>
                <option value="lost">Perdido</option>
              </select>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-5">
        {Object.entries(statusConfig).map(([key, config]) => {
          const count = useMockData
            ? statusCounts[key] || 0
            : filteredLeads.filter((l) => l.status === key).length
          return (
            <Card
              key={key}
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => setStatusFilter(key)}
            >
              <CardContent className="pt-4">
                <div className="text-2xl font-bold">{count}</div>
                <p className="text-xs text-muted-foreground">{config.label}</p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Leads List */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>
                Lista de Leads ({filteredLeads.length}
                {!useMockData && ` de ${totalLeads}`})
              </CardTitle>
              <CardDescription>Clique em um lead para ver detalhes</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading && !useMockData ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredLeads.map((lead) => (
                    <div
                      key={lead.id}
                      onClick={() => setSelectedLead(lead)}
                      className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                        selectedLead?.id === lead.id
                          ? 'border-primary bg-primary/5'
                          : 'hover:bg-muted'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <p className="font-medium">{lead.full_name}</p>
                          <p className="text-sm text-muted-foreground">{lead.service_interest}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span
                            className={`inline-flex items-center rounded-full border px-2 py-1 text-xs font-medium ${
                              statusConfig[lead.status as keyof typeof statusConfig].color
                            }`}
                          >
                            {statusConfig[lead.status as keyof typeof statusConfig].label}
                          </span>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="mt-2 flex items-center gap-4 text-xs text-muted-foreground">
                        <span className={`px-2 py-0.5 rounded ${sourceConfig[lead.source as keyof typeof sourceConfig].color}`}>
                          {sourceConfig[lead.source as keyof typeof sourceConfig].label}
                        </span>
                        <span>
                          {new Date(lead.created_at).toLocaleDateString('pt-BR', {
                            day: '2-digit',
                            month: 'short',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>
                    </div>
                  ))}

                  {filteredLeads.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      <p>Nenhum lead encontrado</p>
                    </div>
                  )}
                </div>
              )}

              {/* Pagination */}
              <div className="flex items-center justify-between mt-6">
                <p className="text-sm text-muted-foreground">
                  Mostrando {filteredLeads.length} de {totalLeads} leads
                </p>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page === 0}
                    onClick={() => setPage((p) => p - 1)}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <span className="text-sm">Página {page + 1}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={
                      useMockData ? true : (page + 1) * pageSize >= totalLeads
                    }
                    onClick={() => setPage((p) => p + 1)}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Lead Details */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Detalhes do Lead</CardTitle>
              <CardDescription>
                {selectedLead ? 'Informações completas' : 'Selecione um lead'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {selectedLead ? (
                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold text-lg">{selectedLead.full_name}</h3>
                    <span
                      className={`inline-flex items-center rounded-full border px-2 py-1 text-xs font-medium mt-2 ${
                        statusConfig[selectedLead.status].color
                      }`}
                    >
                      {statusConfig[selectedLead.status].label}
                    </span>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <a
                        href={`mailto:${selectedLead.email}`}
                        className="text-sm hover:text-primary"
                      >
                        {selectedLead.email}
                      </a>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <a
                        href={`tel:${selectedLead.phone}`}
                        className="text-sm hover:text-primary"
                      >
                        {selectedLead.phone}
                      </a>
                    </div>
                    <div className="flex items-center gap-3">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">
                        {new Date(selectedLead.created_at).toLocaleDateString('pt-BR', {
                          day: '2-digit',
                          month: 'long',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                  </div>

                  {selectedLead.company && (
                    <div>
                      <p className="text-sm font-medium mb-2">Empresa</p>
                      <p className="text-sm text-muted-foreground">{selectedLead.company}</p>
                    </div>
                  )}

                  <div>
                    <p className="text-sm font-medium mb-2">Serviço de Interesse</p>
                    <p className="text-sm text-muted-foreground">{selectedLead.service_interest}</p>
                  </div>

                  {selectedLead.message && (
                    <div>
                      <p className="text-sm font-medium mb-2">Mensagem</p>
                      <p className="text-sm text-muted-foreground bg-muted p-3 rounded-lg">
                        {selectedLead.message}
                      </p>
                    </div>
                  )}

                  <div>
                    <p className="text-sm font-medium mb-2">Origem</p>
                    <span
                      className={`px-2 py-1 rounded text-xs ${sourceConfig[selectedLead.source].color}`}
                    >
                      {sourceConfig[selectedLead.source].label}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm font-medium">Ações</p>
                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(`mailto:${selectedLead.email}`, '_blank')}
                      >
                        Enviar Email
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(`tel:${selectedLead.phone}`, '_blank')}
                      >
                        Ligar
                      </Button>
                      <Button variant="outline" size="sm">
                        Agendar
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleStatusChange(selectedLead.id, 'converted')}
                        disabled={
                          selectedLead.status === 'converted' || updateStatusMutation.isPending
                        }
                      >
                        {updateStatusMutation.isPending ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          'Converter'
                        )}
                      </Button>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-medium mb-2">Atualizar Status</p>
                    <select
                      value={selectedLead.status}
                      onChange={(e) =>
                        handleStatusChange(selectedLead.id, e.target.value as Lead['status'])
                      }
                      className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                      disabled={updateStatusMutation.isPending}
                    >
                      <option value="new">Novo</option>
                      <option value="contacted">Contatado</option>
                      <option value="qualified">Qualificado</option>
                      <option value="converted">Convertido</option>
                      <option value="lost">Perdido</option>
                    </select>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <p>Selecione um lead na lista para ver os detalhes</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
