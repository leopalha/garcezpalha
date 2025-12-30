'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Package,
  Plus,
  Search,
  Eye,
  Edit,
  Trash2,
  MoreVertical,
  Users,
  TrendingUp,
  FileText,
  Copy,
  ExternalLink,
  DollarSign,
  MessageSquare,
} from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

// Mock products data
const mockProducts = [
  {
    id: '1',
    name: 'Usucapião Extraordinária',
    category: 'Imobiliário',
    status: 'active',
    price: 3500,
    questions: 12,
    leads: 45,
    conversion: 28.5,
    revenue: 12500,
    views: 234,
    lastUpdated: '2024-01-15',
    hasLandingPage: true,
    hasVSL: true,
  },
  {
    id: '2',
    name: 'Regularização de Imóvel',
    category: 'Imobiliário',
    status: 'active',
    price: 2800,
    questions: 10,
    leads: 38,
    conversion: 21.2,
    revenue: 9800,
    views: 189,
    lastUpdated: '2024-01-14',
    hasLandingPage: true,
    hasVSL: false,
  },
  {
    id: '3',
    name: 'Holding Familiar',
    category: 'Imobiliário',
    status: 'draft',
    price: 5000,
    questions: 8,
    leads: 0,
    conversion: 0,
    revenue: 0,
    views: 0,
    lastUpdated: '2024-01-13',
    hasLandingPage: false,
    hasVSL: false,
  },
  {
    id: '4',
    name: 'Regularização de Inventário',
    category: 'Família',
    status: 'active',
    price: 4200,
    questions: 15,
    leads: 28,
    conversion: 32.1,
    revenue: 8900,
    views: 156,
    lastUpdated: '2024-01-12',
    hasLandingPage: true,
    hasVSL: true,
  },
  {
    id: '5',
    name: 'Planejamento Sucessório',
    category: 'Família',
    status: 'paused',
    price: 6000,
    questions: 18,
    leads: 12,
    conversion: 25.0,
    revenue: 3000,
    views: 87,
    lastUpdated: '2024-01-10',
    hasLandingPage: true,
    hasVSL: false,
  },
  {
    id: '6',
    name: 'Divórcio Consensual',
    category: 'Família',
    status: 'active',
    price: 2500,
    questions: 14,
    leads: 52,
    conversion: 19.2,
    revenue: 10000,
    views: 312,
    lastUpdated: '2024-01-11',
    hasLandingPage: true,
    hasVSL: true,
  },
]

const statusConfig = {
  active: { label: 'Ativo', color: 'bg-green-100 text-green-700 border-green-200' },
  draft: { label: 'Rascunho', color: 'bg-gray-100 text-gray-700 border-gray-200' },
  paused: { label: 'Pausado', color: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
}

export default function ProductsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'draft' | 'paused'>('all')

  const filteredProducts = mockProducts.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = filterStatus === 'all' || product.status === filterStatus
    return matchesSearch && matchesStatus
  })

  const stats = {
    total: mockProducts.length,
    active: mockProducts.filter(p => p.status === 'active').length,
    draft: mockProducts.filter(p => p.status === 'draft').length,
    totalLeads: mockProducts.reduce((sum, p) => sum + p.leads, 0),
    totalRevenue: mockProducts.reduce((sum, p) => sum + p.revenue, 0),
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Produtos</h2>
          <p className="text-muted-foreground">
            Gerencie seus produtos e serviços jurídicos
          </p>
        </div>
        <Button asChild size="lg">
          <Link href="/app/dashboard/produtos/novo">
            <Plus className="h-4 w-4 mr-2" />
            Criar Produto
          </Link>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Produtos</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">
              {stats.active} ativos, {stats.draft} rascunhos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Leads</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalLeads}</div>
            <p className="text-xs text-green-600">
              De todos os produtos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Receita Total</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              R$ {stats.totalRevenue.toLocaleString('pt-BR')}
            </div>
            <p className="text-xs text-muted-foreground">
              Últimos 30 dias
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversão Média</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(mockProducts.reduce((sum, p) => sum + p.conversion, 0) / mockProducts.filter(p => p.status === 'active').length).toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground">
              Produtos ativos
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            <div className="flex-1 w-full md:w-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar produtos..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant={filterStatus === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterStatus('all')}
              >
                Todos
              </Button>
              <Button
                variant={filterStatus === 'active' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterStatus('active')}
              >
                Ativos
              </Button>
              <Button
                variant={filterStatus === 'draft' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterStatus('draft')}
              >
                Rascunhos
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredProducts.length === 0 ? (
              <div className="text-center py-12">
                <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">Nenhum produto encontrado</p>
                <Button variant="outline" className="mt-4" onClick={() => setSearchQuery('')}>
                  Limpar filtros
                </Button>
              </div>
            ) : (
              filteredProducts.map((product) => (
                <Card key={product.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      {/* Product Icon */}
                      <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Package className="h-6 w-6 text-primary" />
                      </div>

                      {/* Product Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4 mb-2">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-semibold text-lg">{product.name}</h3>
                              <Badge
                                variant="outline"
                                className={statusConfig[product.status as keyof typeof statusConfig].color}
                              >
                                {statusConfig[product.status as keyof typeof statusConfig].label}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <span>{product.category}</span>
                              <span>•</span>
                              <span>R$ {product.price.toLocaleString('pt-BR')}</span>
                              <span>•</span>
                              <span>{product.questions} perguntas</span>
                            </div>
                          </div>

                          {/* Actions */}
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem asChild>
                                <Link href={`/app/dashboard/produtos/${product.id}`}>
                                  <Edit className="h-4 w-4 mr-2" />
                                  Editar
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem asChild>
                                <Link href={`/app/dashboard/produtos/${product.id}/preview`}>
                                  <Eye className="h-4 w-4 mr-2" />
                                  Visualizar
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Copy className="h-4 w-4 mr-2" />
                                Duplicar
                              </DropdownMenuItem>
                              {product.hasLandingPage && (
                                <DropdownMenuItem>
                                  <ExternalLink className="h-4 w-4 mr-2" />
                                  Abrir Landing Page
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-destructive">
                                <Trash2 className="h-4 w-4 mr-2" />
                                Excluir
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>

                        {/* Metrics */}
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-4 pt-4 border-t">
                          <div>
                            <p className="text-xs text-muted-foreground mb-1">Visualizações</p>
                            <p className="text-sm font-semibold flex items-center gap-1">
                              <Eye className="h-3 w-3" />
                              {product.views}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground mb-1">Leads</p>
                            <p className="text-sm font-semibold flex items-center gap-1">
                              <Users className="h-3 w-3" />
                              {product.leads}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground mb-1">Conversão</p>
                            <p className="text-sm font-semibold flex items-center gap-1">
                              <TrendingUp className="h-3 w-3" />
                              {product.conversion}%
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground mb-1">Receita</p>
                            <p className="text-sm font-semibold text-green-600">
                              R$ {product.revenue.toLocaleString('pt-BR')}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground mb-1">Recursos</p>
                            <div className="flex items-center gap-1">
                              {product.hasLandingPage && (
                                <FileText className="h-3 w-3 text-blue-600" title="Landing Page" />
                              )}
                              {product.hasVSL && (
                                <MessageSquare className="h-3 w-3 text-purple-600" title="VSL" />
                              )}
                              {!product.hasLandingPage && !product.hasVSL && (
                                <span className="text-xs text-muted-foreground">-</span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
