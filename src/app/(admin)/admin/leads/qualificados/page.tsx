'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'

interface QualifiedLead {
  id: string
  clientName: string
  phone: string
  productId: string
  productName: string
  score: {
    total: number
    urgency: number
    probability: number
    complexity: number
    category: 'hot' | 'warm' | 'cold' | 'very-cold'
  }
  answers: any[]
  createdAt: string
  source: 'whatsapp' | 'website' | 'phone' | 'email'
  status: 'new' | 'contacted' | 'in-progress' | 'converted' | 'lost'
}

export default function QualifiedLeadsPage() {
  const [leads, setLeads] = useState<QualifiedLead[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<string>('all')
  const [search, setSearch] = useState('')

  useEffect(() => {
    loadLeads()
  }, [filter])

  const loadLeads = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/admin/leads/qualified?filter=${filter}`)
      const data = await response.json()
      setLeads(data.leads || [])
    } catch (error) {
      console.error('Error loading leads:', error)
    } finally {
      setLoading(false)
    }
  }

  const getCategoryBadge = (category: string) => {
    switch (category) {
      case 'hot':
        return <Badge className="bg-red-500">🔥 Quente</Badge>
      case 'warm':
        return <Badge className="bg-orange-500">☀️ Morno</Badge>
      case 'cold':
        return <Badge className="bg-blue-500">❄️ Frio</Badge>
      case 'very-cold':
        return <Badge className="bg-slate-500">🧊 Muito Frio</Badge>
      default:
        return <Badge>Indefinido</Badge>
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'new':
        return <Badge variant="outline">Novo</Badge>
      case 'contacted':
        return <Badge className="bg-blue-600">Contatado</Badge>
      case 'in-progress':
        return <Badge className="bg-yellow-600">Em Andamento</Badge>
      case 'converted':
        return <Badge className="bg-green-600">Convertido</Badge>
      case 'lost':
        return <Badge variant="destructive">Perdido</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getSourceIcon = (source: string) => {
    switch (source) {
      case 'whatsapp':
        return '💬'
      case 'website':
        return '🌐'
      case 'phone':
        return '📞'
      case 'email':
        return '✉️'
      default:
        return '📋'
    }
  }

  const updateLeadStatus = async (leadId: string, newStatus: string) => {
    try {
      await fetch(`/api/admin/leads/qualified/${leadId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })
      loadLeads()
    } catch (error) {
      console.error('Error updating lead:', error)
    }
  }

  const filteredLeads = leads.filter((lead) => {
    if (search) {
      const searchLower = search.toLowerCase()
      return (
        lead.clientName?.toLowerCase().includes(searchLower) ||
        lead.phone?.includes(search) ||
        lead.productName?.toLowerCase().includes(searchLower)
      )
    }
    return true
  })

  const stats = {
    total: leads.length,
    hot: leads.filter((l) => l.score.category === 'hot').length,
    warm: leads.filter((l) => l.score.category === 'warm').length,
    cold: leads.filter((l) => l.score.category === 'cold').length,
    converted: leads.filter((l) => l.status === 'converted').length,
  }

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Leads Qualificados</h1>
        <p className="text-muted-foreground">
          Gestão de leads qualificados pelo sistema automático
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">🔥 Quentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">{stats.hot}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">☀️ Mornos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-500">{stats.warm}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">❄️ Frios</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-500">{stats.cold}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">✅ Convertidos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">{stats.converted}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            <div>
              <CardTitle>Filtros</CardTitle>
              <CardDescription>Filtre e pesquise leads</CardDescription>
            </div>
            <div className="flex gap-2 w-full md:w-auto">
              <Input
                placeholder="Buscar por nome, telefone..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full md:w-64"
              />
              <Select value={filter} onValueChange={setFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="hot">🔥 Quentes</SelectItem>
                  <SelectItem value="warm">☀️ Mornos</SelectItem>
                  <SelectItem value="new">Novos</SelectItem>
                  <SelectItem value="today">Hoje</SelectItem>
                  <SelectItem value="week">Esta Semana</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Leads Table */}
      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-8 text-center text-muted-foreground">
              Carregando leads...
            </div>
          ) : filteredLeads.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              Nenhum lead encontrado
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Produto</TableHead>
                  <TableHead>Score</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead>Origem</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLeads.map((lead) => (
                  <TableRow key={lead.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{lead.clientName || 'Sem nome'}</div>
                        <div className="text-sm text-muted-foreground">{lead.phone}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{lead.productName}</div>
                      <div className="text-sm text-muted-foreground">{lead.productId}</div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="font-bold text-lg">{lead.score.total}/100</div>
                        <div className="text-xs space-y-0.5">
                          <div>U: {lead.score.urgency}</div>
                          <div>P: {lead.score.probability}</div>
                          <div>C: {lead.score.complexity}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{getCategoryBadge(lead.score.category)}</TableCell>
                    <TableCell>
                      <span className="text-xl">{getSourceIcon(lead.source)}</span>
                    </TableCell>
                    <TableCell>{getStatusBadge(lead.status)}</TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {new Date(lead.createdAt).toLocaleDateString('pt-BR')}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {new Date(lead.createdAt).toLocaleTimeString('pt-BR')}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            // View details
                            window.location.href = `/admin/leads/qualificados/${lead.id}`
                          }}
                        >
                          Ver
                        </Button>
                        {lead.status === 'new' && (
                          <Button
                            size="sm"
                            onClick={() => updateLeadStatus(lead.id, 'contacted')}
                          >
                            Contatar
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
