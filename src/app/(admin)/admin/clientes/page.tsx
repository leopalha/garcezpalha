'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Search,
  UserPlus,
  Mail,
  Phone,
  MapPin,
  DollarSign,
  FileText,
  Loader2,
  RefreshCw,
} from 'lucide-react'
import { trpc } from '@/lib/trpc/client'

type Client = {
  id: string
  user_id: string | null
  lead_id: string | null
  company_name: string | null
  cpf_cnpj: string | null
  address: string | null
  city: string | null
  state: string | null
  zip_code: string | null
  status: 'active' | 'inactive' | 'archived'
  assigned_lawyer: string | null
  total_cases: number
  lifetime_value: number
  created_at: string
  updated_at: string
}

// Extended client with name from profiles (mock for now)
type ClientWithProfile = Client & {
  full_name: string
  email: string
  phone: string
}

const mockClients: ClientWithProfile[] = [
  {
    id: '1',
    user_id: null,
    lead_id: null,
    full_name: 'Roberto Mendes',
    email: 'roberto@mendes.com',
    phone: '(21) 99999-0001',
    company_name: 'Mendes Incorporadora',
    cpf_cnpj: '12.345.678/0001-90',
    address: 'Av. Rio Branco, 156',
    city: 'Rio de Janeiro',
    state: 'RJ',
    zip_code: '20040-003',
    status: 'active',
    assigned_lawyer: null,
    total_cases: 3,
    lifetime_value: 45000,
    created_at: '2023-06-15T10:00:00Z',
    updated_at: '2023-06-15T10:00:00Z',
  },
  {
    id: '2',
    user_id: null,
    lead_id: null,
    full_name: 'Fernanda Souza',
    email: 'fernanda.souza@gmail.com',
    phone: '(21) 98888-0002',
    company_name: null,
    cpf_cnpj: '123.456.789-00',
    address: 'Rua das Laranjeiras, 400',
    city: 'Rio de Janeiro',
    state: 'RJ',
    zip_code: '22240-005',
    status: 'active',
    assigned_lawyer: null,
    total_cases: 1,
    lifetime_value: 12000,
    created_at: '2023-09-20T14:30:00Z',
    updated_at: '2023-09-20T14:30:00Z',
  },
  {
    id: '3',
    user_id: null,
    lead_id: null,
    full_name: 'André Carvalho',
    email: 'andre@carvalho.adv.br',
    phone: '(21) 97777-0003',
    company_name: 'Carvalho & Associados',
    cpf_cnpj: '98.765.432/0001-10',
    address: 'Rua México, 90',
    city: 'Rio de Janeiro',
    state: 'RJ',
    zip_code: '20031-141',
    status: 'active',
    assigned_lawyer: null,
    total_cases: 5,
    lifetime_value: 78000,
    created_at: '2023-03-10T09:00:00Z',
    updated_at: '2023-03-10T09:00:00Z',
  },
  {
    id: '4',
    user_id: null,
    lead_id: null,
    full_name: 'Lucia Pereira',
    email: 'lucia.pereira@email.com',
    phone: '(21) 96666-0004',
    company_name: null,
    cpf_cnpj: '987.654.321-00',
    address: 'Rua Voluntários da Pátria, 88',
    city: 'Rio de Janeiro',
    state: 'RJ',
    zip_code: '22270-010',
    status: 'inactive',
    assigned_lawyer: null,
    total_cases: 2,
    lifetime_value: 25000,
    created_at: '2023-01-05T11:00:00Z',
    updated_at: '2023-01-05T11:00:00Z',
  },
]

const statusColors = {
  active: 'bg-green-100 text-green-800 border-green-200',
  inactive: 'bg-slate-200 text-slate-800 border-slate-300',
  archived: 'bg-red-100 text-red-800 border-red-200',
}

const statusLabels = {
  active: 'Ativo',
  inactive: 'Inativo',
  archived: 'Arquivado',
}

export default function ClientesPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedClient, setSelectedClient] = useState<ClientWithProfile | null>(null)
  const [useMockData, setUseMockData] = useState(false)

  // Fetch clients from tRPC
  const {
    data: clientsData,
    isLoading,
    error,
    refetch,
  } = trpc.clients.list.useQuery(
    { limit: 100, offset: 0 },
    { retry: false, enabled: !useMockData }
  )

  // Handle errors by falling back to mock data
  useEffect(() => {
    if (error) {
      console.log('Database not configured, using mock data')
      setUseMockData(true)
    }
  }, [error])

  // Map database clients to ClientWithProfile (in real app, this would join with profiles)
  const clients: ClientWithProfile[] = useMockData
    ? mockClients
    : (clientsData?.clients || []).map((client) => ({
        ...client,
        full_name: client.company_name || 'Cliente',
        email: 'email@example.com',
        phone: '(21) 99999-0000',
      }))

  const filteredClients = clients.filter(
    (client) =>
      client.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.company_name?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const totalRevenue = clients.reduce((acc, c) => acc + c.lifetime_value, 0)
  const activeClients = clients.filter((c) => c.status === 'active').length
  const totalCases = clients.reduce((acc, c) => acc + c.total_cases, 0)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Clientes</h2>
          <p className="text-muted-foreground">
            Gerencie sua base de clientes
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
          <Button>
            <UserPlus className="h-4 w-4 mr-2" />
            Novo Cliente
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{clients.length}</div>
            <p className="text-xs text-muted-foreground">Total de Clientes</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{activeClients}</div>
            <p className="text-xs text-muted-foreground">Clientes Ativos</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{totalCases}</div>
            <p className="text-xs text-muted-foreground">Total de Casos</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">R$ {totalRevenue.toLocaleString('pt-BR')}</div>
            <p className="text-xs text-muted-foreground">Receita Total</p>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar cliente por nome, email ou empresa..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Client List */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Lista de Clientes</CardTitle>
              <CardDescription>{filteredClients.length} clientes encontrados</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading && !useMockData ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredClients.map((client) => (
                    <div
                      key={client.id}
                      onClick={() => setSelectedClient(client)}
                      className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                        selectedClient?.id === client.id
                          ? 'border-primary bg-primary/5'
                          : 'hover:bg-muted'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-medium">{client.full_name}</p>
                          {client.company_name && (
                            <p className="text-sm text-muted-foreground">{client.company_name}</p>
                          )}
                        </div>
                        <span
                          className={`inline-flex items-center rounded-full border px-2 py-1 text-xs font-medium ${
                            statusColors[client.status]
                          }`}
                        >
                          {statusLabels[client.status]}
                        </span>
                      </div>
                      <div className="mt-2 flex items-center gap-4 text-sm text-muted-foreground">
                        <span>{client.total_cases} casos</span>
                        <span>R$ {client.lifetime_value.toLocaleString('pt-BR')}</span>
                      </div>
                    </div>
                  ))}

                  {filteredClients.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      <p>Nenhum cliente encontrado</p>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Client Details */}
        <Card>
          <CardHeader>
            <CardTitle>Detalhes do Cliente</CardTitle>
          </CardHeader>
          <CardContent>
            {selectedClient ? (
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-lg">{selectedClient.full_name}</h3>
                  {selectedClient.company_name && (
                    <p className="text-sm text-muted-foreground">{selectedClient.company_name}</p>
                  )}
                  <span
                    className={`inline-flex items-center rounded-full border px-2 py-1 text-xs font-medium mt-2 ${
                      statusColors[selectedClient.status]
                    }`}
                  >
                    {statusLabels[selectedClient.status]}
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <a
                      href={`mailto:${selectedClient.email}`}
                      className="text-sm hover:text-primary"
                    >
                      {selectedClient.email}
                    </a>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <a
                      href={`tel:${selectedClient.phone}`}
                      className="text-sm hover:text-primary"
                    >
                      {selectedClient.phone}
                    </a>
                  </div>
                  {selectedClient.address && (
                    <div className="flex items-center gap-3">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">
                        {selectedClient.address}, {selectedClient.city}/{selectedClient.state}
                      </span>
                    </div>
                  )}
                  {selectedClient.cpf_cnpj && (
                    <div className="flex items-center gap-3">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{selectedClient.cpf_cnpj}</span>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-muted rounded-lg">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-primary" />
                      <span className="text-sm font-medium">Casos</span>
                    </div>
                    <p className="text-2xl font-bold mt-1">{selectedClient.total_cases}</p>
                  </div>
                  <div className="p-3 bg-muted rounded-lg">
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-primary" />
                      <span className="text-sm font-medium">Valor</span>
                    </div>
                    <p className="text-lg font-bold mt-1">
                      R$ {selectedClient.lifetime_value.toLocaleString('pt-BR')}
                    </p>
                  </div>
                </div>

                <div className="text-xs text-muted-foreground">
                  Cliente desde{' '}
                  {new Date(selectedClient.created_at).toLocaleDateString('pt-BR', {
                    month: 'long',
                    year: 'numeric',
                  })}
                </div>

                <div className="space-y-2">
                  <Button className="w-full">Ver Casos</Button>
                  <Button variant="outline" className="w-full">
                    Editar Cliente
                  </Button>
                  <Button variant="outline" className="w-full">
                    Nova Fatura
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <p>Selecione um cliente</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
