'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Plus, Play, Pause, BarChart3, Trophy } from 'lucide-react'
import Link from 'next/link'

interface ABTest {
  id: string
  name: string
  description: string
  sequence_id: string
  step_id: string
  status: 'draft' | 'running' | 'paused' | 'completed'
  config: {
    trafficSplit: number[]
    minSampleSize: number
    confidenceLevel: number
  }
  results?: {
    winner?: string
    confidence: number
    conclusionDate?: string
  }
  created_at: string
  updated_at: string
  variants?: ABTestVariant[]
}

interface ABTestVariant {
  id: string
  name: string
  subject: string
  stats: {
    sent: number
    delivered: number
    opened: number
    clicked: number
    converted: number
    openRate: number
    clickRate: number
    conversionRate: number
  }
}

export default function ABTestsPage() {
  const [tests, setTests] = useState<ABTest[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    loadTests()
  }, [])

  async function loadTests() {
    try {
      const { data, error } = await supabase
        .from('ab_tests')
        .select(`
          *,
          variants:ab_test_variants(*)
        `)
        .order('created_at', { ascending: false })

      if (error) throw error
      setTests(data || [])
    } catch (error) {
      console.error('Error loading A/B tests:', error)
    } finally {
      setLoading(false)
    }
  }

  async function toggleTestStatus(testId: string, currentStatus: string) {
    const newStatus = currentStatus === 'running' ? 'paused' : 'running'

    try {
      const { error } = await supabase
        .from('ab_tests')
        .update({ status: newStatus })
        .eq('id', testId)

      if (error) throw error
      loadTests()
    } catch (error) {
      console.error('Error updating test status:', error)
    }
  }

  function getStatusColor(status: string) {
    switch (status) {
      case 'draft':
        return 'bg-gray-500'
      case 'running':
        return 'bg-green-500'
      case 'paused':
        return 'bg-yellow-500'
      case 'completed':
        return 'bg-blue-500'
      default:
        return 'bg-gray-500'
    }
  }

  function getStatusLabel(status: string) {
    switch (status) {
      case 'draft':
        return 'Rascunho'
      case 'running':
        return 'Rodando'
      case 'paused':
        return 'Pausado'
      case 'completed':
        return 'Concluído'
      default:
        return status
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando testes A/B...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 px-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Testes A/B</h1>
          <p className="text-gray-600 mt-2">
            Gerencie testes de subject lines e otimize suas taxas de abertura
          </p>
        </div>
        <Link href="/admin/automations/ab-tests/new">
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Novo Teste A/B
          </Button>
        </Link>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total de Testes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{tests.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">
              Rodando
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">
              {tests.filter(t => t.status === 'running').length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">
              Pausados
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-yellow-600">
              {tests.filter(t => t.status === 'paused').length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">
              Concluídos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">
              {tests.filter(t => t.status === 'completed').length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tests List */}
      {tests.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Nenhum teste A/B criado ainda
            </h3>
            <p className="text-gray-600 mb-6">
              Crie seu primeiro teste para otimizar suas taxas de abertura
            </p>
            <Link href="/admin/automations/ab-tests/new">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Criar Primeiro Teste
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {tests.map((test) => (
            <Card key={test.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <CardTitle>{test.name}</CardTitle>
                      <Badge className={getStatusColor(test.status)}>
                        {getStatusLabel(test.status)}
                      </Badge>
                      {test.results?.winner && (
                        <Badge className="bg-purple-500">
                          <Trophy className="h-3 w-3 mr-1" />
                          Vencedor Declarado
                        </Badge>
                      )}
                    </div>
                    <CardDescription>{test.description}</CardDescription>
                    <div className="mt-2 text-sm text-gray-600">
                      Sequência: <span className="font-medium">{test.sequence_id}</span> •
                      Step: <span className="font-medium">{test.step_id}</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    {test.status !== 'completed' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleTestStatus(test.id, test.status)}
                      >
                        {test.status === 'running' ? (
                          <>
                            <Pause className="h-4 w-4 mr-2" />
                            Pausar
                          </>
                        ) : (
                          <>
                            <Play className="h-4 w-4 mr-2" />
                            Iniciar
                          </>
                        )}
                      </Button>
                    )}
                    <Link href={`/admin/automations/ab-tests/${test.id}`}>
                      <Button size="sm">Ver Detalhes</Button>
                    </Link>
                  </div>
                </div>
              </CardHeader>

              {test.variants && test.variants.length > 0 && (
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {test.variants.map((variant) => (
                      <div
                        key={variant.id}
                        className={`border rounded-lg p-4 ${
                          test.results?.winner === variant.id
                            ? 'border-purple-500 bg-purple-50'
                            : 'border-gray-200'
                        }`}
                      >
                        <div className="flex justify-between items-start mb-3">
                          <div className="font-medium">{variant.name}</div>
                          {test.results?.winner === variant.id && (
                            <Trophy className="h-5 w-5 text-purple-600" />
                          )}
                        </div>

                        <div className="text-sm text-gray-600 mb-4">
                          <strong>Subject:</strong> {variant.subject}
                        </div>

                        <div className="grid grid-cols-3 gap-4 text-center">
                          <div>
                            <div className="text-2xl font-bold text-blue-600">
                              {variant.stats.openRate.toFixed(1)}%
                            </div>
                            <div className="text-xs text-gray-600">Open Rate</div>
                            <div className="text-xs text-gray-500">
                              {variant.stats.opened}/{variant.stats.delivered}
                            </div>
                          </div>
                          <div>
                            <div className="text-2xl font-bold text-green-600">
                              {variant.stats.clickRate.toFixed(1)}%
                            </div>
                            <div className="text-xs text-gray-600">Click Rate</div>
                            <div className="text-xs text-gray-500">
                              {variant.stats.clicked}/{variant.stats.delivered}
                            </div>
                          </div>
                          <div>
                            <div className="text-2xl font-bold text-purple-600">
                              {variant.stats.conversionRate.toFixed(1)}%
                            </div>
                            <div className="text-xs text-gray-600">Conversion</div>
                            <div className="text-xs text-gray-500">
                              {variant.stats.converted}/{variant.stats.delivered}
                            </div>
                          </div>
                        </div>

                        <div className="mt-3 text-xs text-gray-500 text-center">
                          {variant.stats.sent} enviados
                        </div>
                      </div>
                    ))}
                  </div>

                  {test.results?.confidence && (
                    <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="text-sm font-medium text-blue-900">
                        Confiança Estatística: {(test.results.confidence * 100).toFixed(1)}%
                      </div>
                      <div className="text-xs text-blue-700 mt-1">
                        {test.results.confidence >= 0.95
                          ? '✅ Resultado significativo (95%+ confiança)'
                          : '⏳ Continue testando para atingir 95% de confiança'}
                      </div>
                    </div>
                  )}
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
