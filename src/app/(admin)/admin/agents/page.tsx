'use client'

import { useState } from 'react'
import { AdminPageHeader } from '@/components/admin/AdminPageHeader'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Brain, Settings, Play, Search, TrendingUp, AlertCircle } from 'lucide-react'
import Link from 'next/link'
import type { AgentRole, AgentCategory } from '@/lib/ai/agents/core/agent-types'

interface Agent {
  id: string
  role: AgentRole
  category: AgentCategory
  name: string
  description: string
  status: 'active' | 'inactive' | 'error'
  model: string
  temperature: number
  totalCalls: number
  successRate: number
  avgResponseTime: number
  lastUsed?: string
}

const AGENTS: Agent[] = [
  // Legal Agents (8)
  {
    id: 'real-estate',
    role: 'real-estate',
    category: 'legal',
    name: 'Especialista em Imóveis',
    description: 'Contratos, usucapião, registro de imóveis',
    status: 'active',
    model: 'gpt-4-turbo',
    temperature: 0.3,
    totalCalls: 1234,
    successRate: 98.5,
    avgResponseTime: 2.3,
    lastUsed: '2024-12-30T10:30:00Z',
  },
  {
    id: 'forensics',
    role: 'forensics',
    category: 'legal',
    name: 'Perícia Grafotécnica',
    description: 'Análise de assinaturas e documentos',
    status: 'active',
    model: 'gpt-4-turbo',
    temperature: 0.3,
    totalCalls: 456,
    successRate: 99.1,
    avgResponseTime: 1.8,
    lastUsed: '2024-12-30T09:15:00Z',
  },
  {
    id: 'valuation',
    role: 'valuation',
    category: 'legal',
    name: 'Avaliação de Imóveis',
    description: 'Perícia avaliativa NBR 14653',
    status: 'active',
    model: 'gpt-4-turbo',
    temperature: 0.3,
    totalCalls: 789,
    successRate: 97.8,
    avgResponseTime: 3.1,
    lastUsed: '2024-12-30T08:45:00Z',
  },
  {
    id: 'medical',
    role: 'medical',
    category: 'legal',
    name: 'Perícia Médica',
    description: 'Avaliação de lesões e incapacidades',
    status: 'active',
    model: 'gpt-4-turbo',
    temperature: 0.3,
    totalCalls: 234,
    successRate: 96.5,
    avgResponseTime: 2.7,
    lastUsed: '2024-12-29T16:20:00Z',
  },
  {
    id: 'criminal',
    role: 'criminal',
    category: 'legal',
    name: 'Direito Criminal',
    description: 'Análise penal, defesa criminal',
    status: 'active',
    model: 'gpt-4-turbo',
    temperature: 0.3,
    totalCalls: 567,
    successRate: 99.3,
    avgResponseTime: 2.1,
    lastUsed: '2024-12-30T11:00:00Z',
  },
  {
    id: 'financial-protection',
    role: 'financial-protection',
    category: 'legal',
    name: 'Proteção Financeira',
    description: 'Bloqueio PIX, fraudes bancárias',
    status: 'active',
    model: 'gpt-4-turbo',
    temperature: 0.3,
    totalCalls: 890,
    successRate: 98.2,
    avgResponseTime: 1.5,
    lastUsed: '2024-12-30T10:00:00Z',
  },
  {
    id: 'health-insurance',
    role: 'health-insurance',
    category: 'legal',
    name: 'Planos de Saúde',
    description: 'Negativas de cobertura, ANS',
    status: 'active',
    model: 'gpt-4-turbo',
    temperature: 0.3,
    totalCalls: 345,
    successRate: 97.5,
    avgResponseTime: 2.2,
    lastUsed: '2024-12-30T09:30:00Z',
  },
  {
    id: 'social-security',
    role: 'social-security',
    category: 'legal',
    name: 'Previdenciário',
    description: 'Aposentadoria, benefícios INSS',
    status: 'active',
    model: 'gpt-4-turbo',
    temperature: 0.3,
    totalCalls: 678,
    successRate: 98.8,
    avgResponseTime: 2.4,
    lastUsed: '2024-12-30T08:00:00Z',
  },

  // Executive Agents (4)
  {
    id: 'ceo',
    role: 'ceo',
    category: 'executive',
    name: 'CEO Agent',
    description: 'Estratégia e decisões executivas',
    status: 'active',
    model: 'gpt-4-turbo',
    temperature: 0.5,
    totalCalls: 156,
    successRate: 100,
    avgResponseTime: 3.5,
    lastUsed: '2024-12-30T07:00:00Z',
  },
  {
    id: 'cmo',
    role: 'cmo',
    category: 'executive',
    name: 'CMO Agent',
    description: 'Estratégia de marketing e crescimento',
    status: 'active',
    model: 'gpt-4-turbo',
    temperature: 0.5,
    totalCalls: 234,
    successRate: 99.5,
    avgResponseTime: 2.8,
    lastUsed: '2024-12-30T06:30:00Z',
  },
  {
    id: 'coo',
    role: 'coo',
    category: 'executive',
    name: 'COO Agent',
    description: 'Operações e eficiência',
    status: 'active',
    model: 'gpt-4-turbo',
    temperature: 0.5,
    totalCalls: 189,
    successRate: 98.9,
    avgResponseTime: 2.5,
    lastUsed: '2024-12-30T05:45:00Z',
  },
  {
    id: 'cfo',
    role: 'cfo',
    category: 'executive',
    name: 'CFO Agent',
    description: 'Financeiro e orçamento',
    status: 'active',
    model: 'gpt-4-turbo',
    temperature: 0.5,
    totalCalls: 145,
    successRate: 99.3,
    avgResponseTime: 2.1,
    lastUsed: '2024-12-30T07:15:00Z',
  },

  // Marketing Agents (6)
  {
    id: 'content',
    role: 'content',
    category: 'marketing',
    name: 'Content Agent',
    description: 'Criação de conteúdo educativo',
    status: 'active',
    model: 'gpt-4-turbo',
    temperature: 0.8,
    totalCalls: 456,
    successRate: 97.2,
    avgResponseTime: 3.2,
    lastUsed: '2024-12-30T10:45:00Z',
  },
  {
    id: 'social',
    role: 'social',
    category: 'marketing',
    name: 'Social Media Agent',
    description: 'Posts para redes sociais',
    status: 'active',
    model: 'gpt-4-turbo',
    temperature: 0.8,
    totalCalls: 789,
    successRate: 96.8,
    avgResponseTime: 2.1,
    lastUsed: '2024-12-30T11:30:00Z',
  },
  {
    id: 'ads',
    role: 'ads',
    category: 'marketing',
    name: 'Ads Agent',
    description: 'Criação e otimização de anúncios',
    status: 'active',
    model: 'gpt-4-turbo',
    temperature: 0.8,
    totalCalls: 345,
    successRate: 98.1,
    avgResponseTime: 2.4,
    lastUsed: '2024-12-30T09:00:00Z',
  },
  {
    id: 'seo',
    role: 'seo',
    category: 'marketing',
    name: 'SEO Agent',
    description: 'Otimização para buscadores',
    status: 'active',
    model: 'gpt-4-turbo',
    temperature: 0.8,
    totalCalls: 234,
    successRate: 97.9,
    avgResponseTime: 2.8,
    lastUsed: '2024-12-30T08:30:00Z',
  },
  {
    id: 'video',
    role: 'video',
    category: 'marketing',
    name: 'Video Agent',
    description: 'Roteiros de vídeo e YouTube',
    status: 'active',
    model: 'gpt-4-turbo',
    temperature: 0.8,
    totalCalls: 123,
    successRate: 95.9,
    avgResponseTime: 3.8,
    lastUsed: '2024-12-29T14:00:00Z',
  },
  {
    id: 'design',
    role: 'design',
    category: 'marketing',
    name: 'Design Agent',
    description: 'Layouts e assets visuais',
    status: 'active',
    model: 'gpt-4-turbo',
    temperature: 0.8,
    totalCalls: 167,
    successRate: 96.4,
    avgResponseTime: 3.1,
    lastUsed: '2024-12-30T07:45:00Z',
  },

  // Operations Agents (2)
  {
    id: 'qa',
    role: 'qa',
    category: 'operations',
    name: 'Quality Assurance Agent',
    description: 'Revisão de documentos e qualidade',
    status: 'active',
    model: 'gpt-4-turbo',
    temperature: 0.4,
    totalCalls: 567,
    successRate: 99.6,
    avgResponseTime: 1.9,
    lastUsed: '2024-12-30T11:15:00Z',
  },
  {
    id: 'admin',
    role: 'admin',
    category: 'operations',
    name: 'Admin Agent',
    description: 'Gestão administrativa e triagem',
    status: 'active',
    model: 'gpt-4-turbo',
    temperature: 0.4,
    totalCalls: 890,
    successRate: 98.7,
    avgResponseTime: 1.6,
    lastUsed: '2024-12-30T10:50:00Z',
  },

  // Intelligence Agents (2)
  {
    id: 'pricing',
    role: 'pricing',
    category: 'intelligence',
    name: 'Pricing Agent',
    description: 'Otimização de preços',
    status: 'active',
    model: 'gpt-4-turbo',
    temperature: 0.6,
    totalCalls: 234,
    successRate: 97.9,
    avgResponseTime: 2.3,
    lastUsed: '2024-12-30T06:00:00Z',
  },
  {
    id: 'market-intel',
    role: 'market-intel',
    category: 'intelligence',
    name: 'Market Intelligence Agent',
    description: 'Análise de mercado e concorrência',
    status: 'active',
    model: 'gpt-4-turbo',
    temperature: 0.6,
    totalCalls: 156,
    successRate: 98.7,
    avgResponseTime: 3.1,
    lastUsed: '2024-12-29T18:00:00Z',
  },
]

export default function AgentsPage() {
  const [agents] = useState<Agent[]>(AGENTS)
  const [filteredAgents, setFilteredAgents] = useState<Agent[]>(agents)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<'all' | AgentCategory>('all')
  const [loading, setLoading] = useState(false)

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    filterAgents(query, selectedCategory)
  }

  const handleCategoryChange = (category: 'all' | AgentCategory) => {
    setSelectedCategory(category)
    filterAgents(searchQuery, category)
  }

  const filterAgents = (query: string, category: 'all' | AgentCategory) => {
    let filtered = agents

    if (category !== 'all') {
      filtered = filtered.filter((a) => a.category === category)
    }

    if (query) {
      filtered = filtered.filter(
        (a) =>
          a.name.toLowerCase().includes(query.toLowerCase()) ||
          a.description.toLowerCase().includes(query.toLowerCase())
      )
    }

    setFilteredAgents(filtered)
  }

  const handleRefresh = async () => {
    setLoading(true)
    // TODO: Fetch agents from API
    setTimeout(() => setLoading(false), 1000)
  }

  const getCategoryColor = (category: AgentCategory) => {
    switch (category) {
      case 'legal':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
      case 'executive':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
      case 'marketing':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'operations':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
      case 'intelligence':
        return 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200'
    }
  }

  const getStatusColor = (status: Agent['status']) => {
    switch (status) {
      case 'active':
        return 'default'
      case 'inactive':
        return 'secondary'
      case 'error':
        return 'destructive'
    }
  }

  const stats = {
    total: agents.length,
    legal: agents.filter((a) => a.category === 'legal').length,
    executive: agents.filter((a) => a.category === 'executive').length,
    marketing: agents.filter((a) => a.category === 'marketing').length,
    operations: agents.filter((a) => a.category === 'operations').length,
    intelligence: agents.filter((a) => a.category === 'intelligence').length,
    active: agents.filter((a) => a.status === 'active').length,
    avgSuccessRate: (
      agents.reduce((acc, a) => acc + a.successRate, 0) / agents.length
    ).toFixed(1),
    totalCalls: agents.reduce((acc, a) => acc + a.totalCalls, 0),
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Gerenciamento de Agentes IA"
        description="Configure e monitore os 24 agentes verticais da plataforma"
        onRefresh={handleRefresh}
        refreshing={loading}
      />

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Agentes</CardTitle>
            <Brain className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">{stats.active} ativos</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Sucesso</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.avgSuccessRate}%</div>
            <p className="text-xs text-muted-foreground">média geral</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Chamadas</CardTitle>
            <Play className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalCalls.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">últimos 30 dias</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Status do Sistema</CardTitle>
            <AlertCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">Operacional</div>
            <p className="text-xs text-muted-foreground">todos os agentes online</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <CardTitle>Agentes</CardTitle>
              <CardDescription>
                {filteredAgents.length} agente(s) encontrado(s)
              </CardDescription>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar agentes..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-8 w-full sm:w-[250px]"
                />
              </div>

              {/* Category Filter */}
              <div className="flex gap-1 bg-muted p-1 rounded-lg overflow-x-auto">
                {(['all', 'legal', 'executive', 'marketing', 'operations', 'intelligence'] as const).map(
                  (cat) => (
                    <Button
                      key={cat}
                      variant={selectedCategory === cat ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => handleCategoryChange(cat)}
                      className="whitespace-nowrap"
                    >
                      {cat === 'all'
                        ? 'Todos'
                        : cat === 'legal'
                        ? 'Legal'
                        : cat === 'executive'
                        ? 'Executivo'
                        : cat === 'marketing'
                        ? 'Marketing'
                        : cat === 'operations'
                        ? 'Operações'
                        : 'Inteligência'}
                    </Button>
                  )
                )}
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="space-y-3">
            {filteredAgents.map((agent) => (
              <div
                key={agent.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-start gap-4 flex-1">
                  {/* Icon */}
                  <div className={`p-2 rounded-lg ${getCategoryColor(agent.category)}`}>
                    <Brain className="h-4 w-4" />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-medium truncate">{agent.name}</h3>
                      <Badge variant={getStatusColor(agent.status)}>
                        {agent.status === 'active'
                          ? 'Ativo'
                          : agent.status === 'inactive'
                          ? 'Inativo'
                          : 'Erro'}
                      </Badge>
                      <Badge variant="outline" className="font-mono text-xs">
                        {agent.model}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      {agent.description}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>Temp: {agent.temperature}</span>
                      <span>•</span>
                      <span>{agent.totalCalls} chamadas</span>
                      <span>•</span>
                      <span>{agent.successRate}% sucesso</span>
                      <span>•</span>
                      <span>{agent.avgResponseTime}s tempo médio</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/admin/agents/${agent.id}/playground`}>
                      <Play className="h-4 w-4 mr-2" />
                      Testar
                    </Link>
                  </Button>
                  <Button variant="default" size="sm" asChild>
                    <Link href={`/admin/agents/${agent.id}`}>
                      <Settings className="h-4 w-4 mr-2" />
                      Configurar
                    </Link>
                  </Button>
                </div>
              </div>
            ))}

            {filteredAgents.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">
                  Nenhum agente encontrado com os filtros aplicados.
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
