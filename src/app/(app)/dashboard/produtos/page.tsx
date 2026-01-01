'use client'

import { useState, useEffect } from 'react'
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
  Loader2,
} from 'lucide-react'
import Link from 'next/link'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useToast } from '@/components/ui/use-toast'

interface Product {
  id: string
  name: string
  category: string
  status: string
  price: number
  questions: any[]
  stats: {
    leads: number
    conversionRate: number
    revenue: number
  }
  created_at: string
  updated_at: string
}


const statusConfig = {
  published: { label: 'Ativo', color: 'bg-green-100 text-green-700 border-green-200' },
  draft: { label: 'Rascunho', color: 'bg-gray-100 text-gray-700 border-gray-200' },
  archived: { label: 'Arquivado', color: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
}

export default function ProductsPage() {
  const { toast } = useToast()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState<'all' | 'published' | 'draft' | 'archived'>('all')

  useEffect(() => {
    fetchProducts()
  }, [])

  async function fetchProducts() {
    try {
      setLoading(true)
      const res = await fetch('/api/app/products')
      if (!res.ok) throw new Error('Failed to fetch products')
      const data = await res.json()
      setProducts(data.products || [])
    } catch (error) {
      console.error('Error fetching products:', error)
      toast({
        title: 'Erro ao carregar produtos',
        description: 'Não foi possível carregar a lista de produtos.',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = filterStatus === 'all' || product.status === filterStatus
    return matchesSearch && matchesStatus
  })

  const stats = {
    total: products.length,
    published: products.filter(p => p.status === 'published').length,
    draft: products.filter(p => p.status === 'draft').length,
    totalLeads: products.reduce((sum, p) => sum + (p.stats?.leads || 0), 0),
    totalRevenue: products.reduce((sum, p) => sum + (p.stats?.revenue || 0), 0),
    averageConversion: products.filter(p => p.status === 'published').length > 0
      ? products.filter(p => p.status === 'published').reduce((sum, p) => sum + (p.stats?.conversionRate || 0), 0) / products.filter(p => p.status === 'published').length
      : 0
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
          <Link href="/dashboard/produtos/novo">
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
            <div className="text-2xl font-bold">{loading ? '...' : stats.total}</div>
            <p className="text-xs text-muted-foreground">
              {stats.published} ativos, {stats.draft} rascunhos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Leads</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? '...' : stats.totalLeads}</div>
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
              {loading ? '...' : `R$ ${stats.totalRevenue.toLocaleString('pt-BR')}`}
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
              {loading ? '...' : `${stats.averageConversion.toFixed(1)}%`}
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
                variant={filterStatus === 'published' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterStatus('published')}
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
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <div className="space-y-4">
              {filteredProducts.length === 0 ? (
                <div className="text-center py-12">
                  <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">
                    {products.length === 0 ? 'Nenhum produto criado ainda' : 'Nenhum produto encontrado'}
                  </p>
                  {products.length === 0 ? (
                    <Button asChild className="mt-4">
                      <Link href="/dashboard/produtos/novo">Criar Primeiro Produto</Link>
                    </Button>
                  ) : (
                    <Button variant="outline" className="mt-4" onClick={() => setSearchQuery('')}>
                      Limpar filtros
                    </Button>
                  )}
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
                              <span>{product.category || 'Sem categoria'}</span>
                              <span>•</span>
                              <span>R$ {product.price?.toLocaleString('pt-BR') || '0'}</span>
                              <span>•</span>
                              <span>{product.questions?.length || 0} perguntas</span>
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
                                <Link href={`/dashboard/produtos/${product.id}`}>
                                  <Edit className="h-4 w-4 mr-2" />
                                  Editar
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem asChild>
                                <Link href={`/dashboard/produtos/${product.id}/preview`}>
                                  <Eye className="h-4 w-4 mr-2" />
                                  Visualizar
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Copy className="h-4 w-4 mr-2" />
                                Duplicar
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <ExternalLink className="h-4 w-4 mr-2" />
                                Abrir Landing Page
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-destructive">
                                <Trash2 className="h-4 w-4 mr-2" />
                                Excluir
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>

                        {/* Metrics */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 pt-4 border-t">
                          <div>
                            <p className="text-xs text-muted-foreground mb-1">Leads</p>
                            <p className="text-sm font-semibold flex items-center gap-1">
                              <Users className="h-3 w-3" />
                              {product.stats?.leads || 0}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground mb-1">Conversão</p>
                            <p className="text-sm font-semibold flex items-center gap-1">
                              <TrendingUp className="h-3 w-3" />
                              {product.stats?.conversionRate?.toFixed(1) || 0}%
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground mb-1">Receita</p>
                            <p className="text-sm font-semibold text-green-600">
                              R$ {product.stats?.revenue?.toLocaleString('pt-BR') || '0'}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground mb-1">Criado em</p>
                            <p className="text-sm font-semibold">
                              {new Date(product.created_at).toLocaleDateString('pt-BR')}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
