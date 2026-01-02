'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { EmptyState } from '@/components/ui/empty-state'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  FileText,
  Plus,
  Eye,
  Edit,
  Copy,
  Trash2,
  ExternalLink,
  TrendingUp,
  Users,
  MousePointerClick,
  BarChart3,
  Sparkles,
  Globe,
  Play,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import Link from 'next/link'

type LandingStatus = 'draft' | 'published' | 'archived'

interface LandingPage {
  id: string
  title: string
  product: string
  productId: string
  status: LandingStatus
  url: string
  views: number
  leads: number
  conversionRate: number
  hasVSL: boolean
  createdAt: string
  publishedAt: string | null
  template: string
}

const mockLandingPages: LandingPage[] = [
  {
    id: '1',
    title: 'Resolva seu Problema de Usucapião em 60 Dias',
    product: 'Usucapião Extraordinária',
    productId: '1',
    status: 'published',
    url: 'https://silvaadvogados.com.br/usucapiao',
    views: 1234,
    leads: 45,
    conversionRate: 3.65,
    hasVSL: true,
    createdAt: '2024-01-10T10:00:00',
    publishedAt: '2024-01-10T14:30:00',
    template: 'VSL Hero + Benefits',
  },
  {
    id: '2',
    title: 'Desbloqueio de Conta Bancária Rápido',
    product: 'Desbloqueio de Conta Bancária',
    productId: '2',
    status: 'published',
    url: 'https://silvaadvogados.com.br/desbloqueio',
    views: 2456,
    leads: 78,
    conversionRate: 3.18,
    hasVSL: false,
    createdAt: '2024-01-08T09:00:00',
    publishedAt: '2024-01-08T16:00:00',
    template: 'Simple Hero + Form',
  },
  {
    id: '3',
    title: 'Plano de Saúde Negou? Saiba o que Fazer',
    product: 'Plano de Saúde Negado',
    productId: '3',
    status: 'published',
    url: 'https://silvaadvogados.com.br/plano-saude',
    views: 1876,
    leads: 62,
    conversionRate: 3.31,
    hasVSL: true,
    createdAt: '2024-01-05T11:00:00',
    publishedAt: '2024-01-05T18:00:00',
    template: 'VSL Hero + Benefits',
  },
  {
    id: '4',
    title: 'Defesa Criminal Especializada',
    product: 'Defesa Criminal',
    productId: '4',
    status: 'draft',
    url: '',
    views: 0,
    leads: 0,
    conversionRate: 0,
    hasVSL: false,
    createdAt: '2024-01-15T14:00:00',
    publishedAt: null,
    template: 'Authority + Testimonials',
  },
]

const statusConfig: Record<LandingStatus, { label: string; color: string; bgColor: string }> = {
  draft: { label: 'Rascunho', color: 'text-gray-700', bgColor: 'bg-gray-100' },
  published: { label: 'Publicada', color: 'text-green-700', bgColor: 'bg-green-100' },
  archived: { label: 'Arquivada', color: 'text-orange-700', bgColor: 'bg-orange-100' },
}

export default function LandingPagesPage() {
  const [landingPages, setLandingPages] = useState<LandingPage[]>(mockLandingPages)
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')

  const stats = {
    total: landingPages.length,
    published: landingPages.filter((lp) => lp.status === 'published').length,
    totalViews: landingPages.reduce((acc, lp) => acc + lp.views, 0),
    totalLeads: landingPages.reduce((acc, lp) => acc + lp.leads, 0),
    avgConversion: (
      landingPages
        .filter((lp) => lp.status === 'published')
        .reduce((acc, lp) => acc + lp.conversionRate, 0) /
      landingPages.filter((lp) => lp.status === 'published').length
    ).toFixed(2),
  }

  const filteredPages = landingPages.filter((page) => {
    const matchesSearch =
      page.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      page.product.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === 'all' || page.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-'
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    })
  }

  const handleCopyLandingPage = (page: LandingPage) => {
    const copiedPage: LandingPage = {
      ...page,
      id: Math.random().toString(36).substring(7),
      title: `${page.title} (Cópia)`,
      status: 'draft',
      url: '',
      views: 0,
      leads: 0,
      conversionRate: 0,
      publishedAt: null,
      createdAt: new Date().toISOString(),
    }

    setLandingPages([copiedPage, ...landingPages])

    // Show success message (you can add toast here if available)
    alert(`Landing page "${page.title}" foi duplicada com sucesso!`)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <FileText className="h-8 w-8 text-primary" />
            Landing Pages
          </h1>
          <p className="text-muted-foreground mt-1">
            Gerencie suas páginas de captura e conversão
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/produtos/novo">
            <Plus className="h-4 w-4 mr-2" />
            Nova Landing Page
          </Link>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total de Páginas</p>
                <p className="text-3xl font-bold mt-1">{stats.total}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <div className="mt-4">
              <Badge variant="secondary" className="text-xs">
                {stats.published} publicadas
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total de Visitas</p>
                <p className="text-3xl font-bold mt-1">{stats.totalViews.toLocaleString('pt-BR')}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                <Eye className="h-6 w-6 text-purple-600" />
              </div>
            </div>
            <div className="mt-4 text-sm text-muted-foreground">
              Últimos 30 dias
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Leads Gerados</p>
                <p className="text-3xl font-bold mt-1">{stats.totalLeads}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                <Users className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <div className="mt-4 text-sm text-muted-foreground">
              Conversões totais
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Taxa Média</p>
                <p className="text-3xl font-bold mt-1">{stats.avgConversion}%</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
            <div className="mt-4 text-sm text-muted-foreground">
              De conversão
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              placeholder="Buscar por título ou produto..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Status</SelectItem>
                <SelectItem value="draft">Rascunho</SelectItem>
                <SelectItem value="published">Publicadas</SelectItem>
                <SelectItem value="archived">Arquivadas</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Landing Pages List */}
      <div className="space-y-4">
        {filteredPages.length === 0 ? (
          <EmptyState
            icon={FileText}
            title="Nenhuma landing page encontrada"
            description="Crie sua primeira landing page para começar a capturar leads"
            action={<Button asChild><Link href="/dashboard/produtos/novo"><Plus className="h-4 w-4 mr-2" />Criar Landing Page</Link></Button>}
          />
        ) : (
          filteredPages.map((page) => (
            <Card key={page.id} className="hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                  {/* Page Info - 5 cols */}
                  <div className="lg:col-span-5 space-y-2">
                    <div className="flex items-start gap-3">
                      <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-primary/20 to-blue-500/20 flex items-center justify-center flex-shrink-0">
                        <Globe className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold truncate">{page.title}</h3>
                        <p className="text-sm text-muted-foreground">{page.product}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge
                            variant="secondary"
                            className={cn(
                              'text-xs',
                              statusConfig[page.status].bgColor,
                              statusConfig[page.status].color
                            )}
                          >
                            {statusConfig[page.status].label}
                          </Badge>
                          {page.hasVSL && (
                            <Badge variant="outline" className="text-xs">
                              <Play className="h-3 w-3 mr-1" />
                              VSL
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Metrics - 4 cols */}
                  <div className="lg:col-span-4 grid grid-cols-3 gap-4">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Visitas</p>
                      <p className="text-lg font-semibold">{page.views.toLocaleString('pt-BR')}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Leads</p>
                      <p className="text-lg font-semibold">{page.leads}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Taxa</p>
                      <p
                        className={cn(
                          'text-lg font-semibold',
                          page.conversionRate >= 3 ? 'text-green-600' : 'text-yellow-600'
                        )}
                      >
                        {page.conversionRate.toFixed(2)}%
                      </p>
                    </div>
                  </div>

                  {/* Actions - 3 cols */}
                  <div className="lg:col-span-3 flex items-center justify-end gap-2">
                    {page.status === 'published' && (
                      <Button variant="outline" size="sm" asChild>
                        <a href={page.url} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-4 w-4 mr-1" />
                          Visitar
                        </a>
                      </Button>
                    )}
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/dashboard/landing-pages/${page.id}/analytics`}>
                        <BarChart3 className="h-4 w-4 mr-1" />
                        Analytics
                      </Link>
                    </Button>
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/dashboard/landing-pages/${page.id}/editar`}>
                        <Edit className="h-4 w-4 mr-1" />
                        Editar
                      </Link>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleCopyLandingPage(page)}
                      title="Duplicar landing page"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Additional Info */}
                <div className="mt-4 pt-4 border-t flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center gap-4">
                    <span>Template: {page.template}</span>
                    <span>•</span>
                    <span>Criada: {formatDate(page.createdAt)}</span>
                    {page.publishedAt && (
                      <>
                        <span>•</span>
                        <span>Publicada: {formatDate(page.publishedAt)}</span>
                      </>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Tips Card */}
      <Card className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20 border-purple-200 dark:border-purple-800">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <div className="h-10 w-10 rounded-lg bg-purple-100 dark:bg-purple-900 flex items-center justify-center flex-shrink-0">
              <Sparkles className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <h4 className="font-semibold mb-2">Dicas para Landing Pages de Alto Conversão</h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• Use headlines claras que comuniquem o benefício principal em 3-5 segundos</li>
                <li>• Adicione VSL (Video Sales Letter) para aumentar conversão em até 80%</li>
                <li>• Inclua prova social (depoimentos) de clientes reais</li>
                <li>• Mantenha o formulário simples - máximo 3-5 campos iniciais</li>
                <li>• Teste diferentes CTAs (Calls-to-Action) e cores de botão</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
