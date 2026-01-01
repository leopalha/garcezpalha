'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  FlaskConical,
  Plus,
  Search,
  Trophy,
  TrendingUp,
  BarChart3,
  Pause,
  Play,
  Trash2,
  Loader2,
  Eye,
} from 'lucide-react'
import Link from 'next/link'
import { useToast } from '@/components/ui/use-toast'

interface ABTest {
  id: string
  sequence_id: string
  test_name: string
  test_type: 'subject' | 'content' | 'both'
  test_metric: string
  status: 'running' | 'completed' | 'paused'
  winner?: string
  stats: {
    variant_a: { sends: number; rate: number }
    variant_b: { sends: number; rate: number }
    difference: number
    total_sends: number
    min_sample_reached: boolean
  }
  created_at: string
}

const statusConfig = {
  running: { label: 'Em Execução', color: 'bg-blue-100 text-blue-700 border-blue-200', icon: Play },
  completed: { label: 'Finalizado', color: 'bg-green-100 text-green-700 border-green-200', icon: Trophy },
  paused: { label: 'Pausado', color: 'bg-yellow-100 text-yellow-700 border-yellow-200', icon: Pause },
}

const typeConfig = {
  subject: { label: 'Subject Line', icon: FlaskConical },
  content: { label: 'Conteúdo', icon: BarChart3 },
  both: { label: 'Subject + Conteúdo', icon: TrendingUp },
}

export default function ABTestsPage() {
  const { toast } = useToast()
  const [tests, setTests] = useState<ABTest[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState<'all' | ABTest['status']>('all')

  useEffect(() => {
    fetchTests()
  }, [])

  async function fetchTests() {
    try {
      setLoading(true)
      const res = await fetch('/api/marketing/ab-tests')
      if (!res.ok) throw new Error('Failed to fetch A/B tests')
      const data = await res.json()
      setTests(data.tests || [])
    } catch (error) {
      console.error('Error fetching A/B tests:', error)
      toast({
        title: 'Erro ao carregar testes',
        description: 'Não foi possível carregar os testes A/B.',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const filteredTests = tests.filter((test) => {
    const matchesSearch = test.test_name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = filterStatus === 'all' || test.status === filterStatus
    return matchesSearch && matchesStatus
  })

  const stats = {
    total: tests.length,
    running: tests.filter(t => t.status === 'running').length,
    completed: tests.filter(t => t.status === 'completed').length,
    avgImprovement: tests.filter(t => t.status === 'completed').length > 0
      ? tests.filter(t => t.status === 'completed').reduce((sum, t) => sum + (t.stats?.difference || 0), 0) / tests.filter(t => t.status === 'completed').length
      : 0,
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Testes A/B</h2>
          <p className="text-muted-foreground">
            Otimize suas campanhas com testes A/B de subject lines e conteúdo
          </p>
        </div>
        <Button asChild size="lg">
          <Link href="/admin/marketing/ab-tests/novo">
            <Plus className="h-4 w-4 mr-2" />
            Novo Teste A/B
          </Link>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Testes</CardTitle>
            <FlaskConical className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? '...' : stats.total}</div>
            <p className="text-xs text-muted-foreground">
              {stats.running} em execução
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Finalizados</CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? '...' : stats.completed}</div>
            <p className="text-xs text-green-600">
              Com resultados conclusivos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Melhoria Média</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? '...' : `+${stats.avgImprovement.toFixed(1)}%`}
            </div>
            <p className="text-xs text-muted-foreground">
              Aumento na métrica testada
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Sucesso</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? '...' : stats.completed > 0 ? '100%' : '0%'}
            </div>
            <p className="text-xs text-muted-foreground">
              Testes com vencedor claro
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
                  placeholder="Buscar testes..."
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
                variant={filterStatus === 'running' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterStatus('running')}
              >
                Em Execução
              </Button>
              <Button
                variant={filterStatus === 'completed' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterStatus('completed')}
              >
                Finalizados
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
              {filteredTests.length === 0 ? (
                <div className="text-center py-12">
                  <FlaskConical className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">
                    {tests.length === 0 ? 'Nenhum teste A/B criado ainda' : 'Nenhum teste encontrado'}
                  </p>
                  {tests.length === 0 ? (
                    <Button asChild className="mt-4">
                      <Link href="/admin/marketing/ab-tests/novo">Criar Primeiro Teste</Link>
                    </Button>
                  ) : (
                    <Button variant="outline" className="mt-4" onClick={() => setSearchQuery('')}>
                      Limpar filtros
                    </Button>
                  )}
                </div>
              ) : (
                filteredTests.map((test) => {
                  const StatusIcon = statusConfig[test.status].icon
                  const TypeIcon = typeConfig[test.test_type].icon

                  return (
                    <Card key={test.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="pt-6">
                        <div className="flex items-start gap-4">
                          {/* Test Icon */}
                          <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                            <TypeIcon className="h-6 w-6 text-primary" />
                          </div>

                          {/* Test Info */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-4 mb-2">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <h3 className="font-semibold text-lg">{test.test_name}</h3>
                                  <Badge
                                    variant="outline"
                                    className={statusConfig[test.status].color}
                                  >
                                    <StatusIcon className="h-3 w-3 mr-1" />
                                    {statusConfig[test.status].label}
                                  </Badge>
                                  <Badge variant="outline">
                                    {typeConfig[test.test_type].label}
                                  </Badge>
                                </div>
                                <p className="text-sm text-muted-foreground">
                                  Testando: {test.test_metric.replace('_', ' ')}
                                </p>
                              </div>

                              {/* Winner Badge */}
                              {test.winner && test.winner !== 'no_clear_winner' && (
                                <Badge className="bg-yellow-500">
                                  <Trophy className="h-3 w-3 mr-1" />
                                  Variante {test.winner.toUpperCase()} Venceu
                                </Badge>
                              )}
                            </div>

                            {/* Progress & Results */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 pt-4 border-t">
                              <div>
                                <p className="text-xs text-muted-foreground mb-1">Total Enviado</p>
                                <p className="text-sm font-semibold">
                                  {test.stats?.total_sends || 0}
                                </p>
                              </div>
                              <div>
                                <p className="text-xs text-muted-foreground mb-1">Variante A</p>
                                <p className="text-sm font-semibold text-blue-600">
                                  {test.stats?.variant_a?.rate?.toFixed(1) || 0}%
                                </p>
                              </div>
                              <div>
                                <p className="text-xs text-muted-foreground mb-1">Variante B</p>
                                <p className="text-sm font-semibold text-purple-600">
                                  {test.stats?.variant_b?.rate?.toFixed(1) || 0}%
                                </p>
                              </div>
                              <div>
                                <p className="text-xs text-muted-foreground mb-1">Diferença</p>
                                <p className="text-sm font-semibold text-green-600">
                                  +{test.stats?.difference?.toFixed(1) || 0}%
                                </p>
                              </div>
                            </div>

                            {/* Progress Bar */}
                            {test.status === 'running' && (
                              <div className="mt-4">
                                <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                                  <span>Progresso</span>
                                  <span>{test.stats?.min_sample_reached ? 'Amostra mínima atingida' : 'Coletando dados...'}</span>
                                </div>
                                <div className="h-2 bg-muted rounded-full overflow-hidden">
                                  <div
                                    className="h-full bg-primary"
                                    style={{ width: test.stats?.min_sample_reached ? '100%' : '50%' }}
                                  />
                                </div>
                              </div>
                            )}

                            {/* Actions */}
                            <div className="flex gap-2 mt-4">
                              <Button size="sm" variant="outline" asChild>
                                <Link href={`/admin/marketing/ab-tests/${test.id}`}>
                                  <Eye className="h-3 w-3 mr-1" />
                                  Ver Resultados
                                </Link>
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
