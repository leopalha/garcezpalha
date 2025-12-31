'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Trophy, TrendingUp, Users, Mail, MousePointerClick } from 'lucide-react'
import Link from 'next/link'
import { useParams } from 'next/navigation'

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
    improvement?: {
      openRate: number
      clickRate: number
      conversionRate: number
    }
    conclusionDate?: string
  }
  created_at: string
  updated_at: string
}

interface ABTestVariant {
  id: string
  test_id: string
  name: string
  subject: string
  content?: string
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
  created_at: string
}

interface Assignment {
  id: string
  lead: {
    id: string
    email: string
    name: string
  }
  variant: {
    name: string
  }
  events: {
    delivered?: string
    opened?: string
    clicked?: string
    converted?: string
  }
  assigned_at: string
}

export default function ABTestDetailPage() {
  const params = useParams()
  const testId = params.id as string

  const [test, setTest] = useState<ABTest | null>(null)
  const [variants, setVariants] = useState<ABTestVariant[]>([])
  const [assignments, setAssignments] = useState<Assignment[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    if (testId) {
      loadTestDetails()
    }
  }, [testId])

  async function loadTestDetails() {
    try {
      // Carregar teste
      const { data: testData, error: testError } = await supabase
        .from('ab_tests')
        .select('*')
        .eq('id', testId)
        .single()

      if (testError) throw testError
      setTest(testData)

      // Carregar variantes
      const { data: variantsData, error: variantsError } = await supabase
        .from('ab_test_variants')
        .select('*')
        .eq('test_id', testId)
        .order('created_at', { ascending: true })

      if (variantsError) throw variantsError
      setVariants(variantsData || [])

      // Carregar assignments recentes
      const { data: assignmentsData, error: assignmentsError } = await supabase
        .from('ab_test_assignments')
        .select(`
          id,
          events,
          assigned_at,
          lead:leads(id, email, name),
          variant:ab_test_variants(name)
        `)
        .eq('test_id', testId)
        .order('assigned_at', { ascending: false })
        .limit(100)

      if (assignmentsError) throw assignmentsError

      // Transform Supabase array response to expected format
      const transformedAssignments = (assignmentsData || []).map((assignment: any) => ({
        id: assignment.id,
        assigned_at: assignment.assigned_at,
        events: assignment.events,
        lead: Array.isArray(assignment.lead) ? assignment.lead[0] : assignment.lead,
        variant: Array.isArray(assignment.variant) ? assignment.variant[0] : assignment.variant,
      }))

      setAssignments(transformedAssignments)
    } catch (error) {
      console.error('Error loading test details:', error)
    } finally {
      setLoading(false)
    }
  }

  function getWinnerVariant() {
    if (!test?.results?.winner) return null
    return variants.find(v => v.id === test.results?.winner)
  }

  function getLoserVariant() {
    if (!test?.results?.winner) return null
    return variants.find(v => v.id !== test.results?.winner)
  }

  if (loading || !test) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando detalhes do teste...</p>
        </div>
      </div>
    )
  }

  const winner = getWinnerVariant()
  const loser = getLoserVariant()

  return (
    <div className="container mx-auto py-8 px-4">
      {/* Header */}
      <div className="mb-8">
        <Link href="/admin/automations/ab-tests">
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar para Testes A/B
          </Button>
        </Link>

        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{test.name}</h1>
            <p className="text-gray-600 mt-2">{test.description}</p>
            <div className="mt-3 flex gap-4 text-sm text-gray-600">
              <span>
                Sequência: <strong>{test.sequence_id}</strong>
              </span>
              <span>•</span>
              <span>
                Step: <strong>{test.step_id}</strong>
              </span>
            </div>
          </div>

          <Badge
            className={
              test.status === 'running'
                ? 'bg-green-500'
                : test.status === 'completed'
                  ? 'bg-blue-500'
                  : 'bg-gray-500'
            }
          >
            {test.status === 'running'
              ? 'Rodando'
              : test.status === 'completed'
                ? 'Concluído'
                : test.status === 'paused'
                  ? 'Pausado'
                  : 'Rascunho'}
          </Badge>
        </div>
      </div>

      {/* Winner Banner */}
      {winner && test.results && (
        <Card className="mb-8 border-purple-500 bg-purple-50">
          <CardHeader>
            <div className="flex items-center gap-3">
              <Trophy className="h-6 w-6 text-purple-600" />
              <div>
                <CardTitle className="text-purple-900">
                  Vencedor: {winner.name}
                </CardTitle>
                <CardDescription className="text-purple-700">
                  Confiança: {((test.results.confidence || 0) * 100).toFixed(1)}%
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  +{test.results.improvement?.openRate.toFixed(1)}%
                </div>
                <div className="text-sm text-purple-700">Open Rate</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  +{test.results.improvement?.clickRate.toFixed(1)}%
                </div>
                <div className="text-sm text-purple-700">Click Rate</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  +{test.results.improvement?.conversionRate.toFixed(1)}%
                </div>
                <div className="text-sm text-purple-700">Conversion Rate</div>
              </div>
            </div>

            <div className="mt-4 p-4 bg-white rounded border border-purple-200">
              <div className="text-sm font-medium text-purple-900 mb-2">
                Recomendação:
              </div>
              <div className="text-sm text-purple-700">
                {(test.results.confidence || 0) >= 0.95
                  ? `Use "${winner.subject}" permanentemente. Ele tem ${test.results.improvement?.conversionRate.toFixed(1)}% melhor taxa de conversão com 95%+ de confiança.`
                  : `"${winner.subject}" está performando melhor, mas continue testando para atingir 95% de confiança.`}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Variants Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {variants.map((variant) => (
          <Card
            key={variant.id}
            className={
              winner?.id === variant.id
                ? 'border-purple-500 shadow-lg'
                : ''
            }
          >
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    {variant.name}
                    {winner?.id === variant.id && (
                      <Trophy className="h-5 w-5 text-purple-600" />
                    )}
                  </CardTitle>
                  <CardDescription className="mt-2">
                    <strong>Subject:</strong> {variant.subject}
                  </CardDescription>
                </div>
                <div className="text-sm text-gray-600">
                  {test.config.trafficSplit[variants.indexOf(variant)]}% traffic
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="text-center p-4 bg-gray-50 rounded">
                  <Mail className="h-5 w-5 text-gray-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-900">
                    {variant.stats.sent}
                  </div>
                  <div className="text-xs text-gray-600">Enviados</div>
                </div>

                <div className="text-center p-4 bg-blue-50 rounded">
                  <Users className="h-5 w-5 text-blue-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-blue-600">
                    {variant.stats.openRate.toFixed(1)}%
                  </div>
                  <div className="text-xs text-blue-700">Open Rate</div>
                  <div className="text-xs text-gray-500">
                    {variant.stats.opened}/{variant.stats.delivered}
                  </div>
                </div>

                <div className="text-center p-4 bg-green-50 rounded">
                  <MousePointerClick className="h-5 w-5 text-green-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-green-600">
                    {variant.stats.clickRate.toFixed(1)}%
                  </div>
                  <div className="text-xs text-green-700">Click Rate</div>
                  <div className="text-xs text-gray-500">
                    {variant.stats.clicked}/{variant.stats.delivered}
                  </div>
                </div>

                <div className="text-center p-4 bg-purple-50 rounded">
                  <TrendingUp className="h-5 w-5 text-purple-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-purple-600">
                    {variant.stats.conversionRate.toFixed(1)}%
                  </div>
                  <div className="text-xs text-purple-700">Conversion</div>
                  <div className="text-xs text-gray-500">
                    {variant.stats.converted}/{variant.stats.delivered}
                  </div>
                </div>
              </div>

              {/* Progress to Min Sample */}
              <div className="mt-4">
                <div className="flex justify-between text-xs text-gray-600 mb-1">
                  <span>Progresso para amostra mínima</span>
                  <span>
                    {variant.stats.sent}/{test.config.minSampleSize}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${
                      winner?.id === variant.id
                        ? 'bg-purple-600'
                        : 'bg-blue-600'
                    }`}
                    style={{
                      width: `${Math.min((variant.stats.sent / test.config.minSampleSize) * 100, 100)}%`,
                    }}
                  ></div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Test Configuration */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Configuração do Teste</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-6">
            <div>
              <div className="text-sm text-gray-600">Traffic Split</div>
              <div className="text-lg font-medium">
                {test.config.trafficSplit.join('% / ')}%
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Amostra Mínima</div>
              <div className="text-lg font-medium">
                {test.config.minSampleSize} por variante
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Nível de Confiança</div>
              <div className="text-lg font-medium">
                {(test.config.confidenceLevel * 100).toFixed(0)}%
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Assignments */}
      <Card>
        <CardHeader>
          <CardTitle>Atribuições Recentes</CardTitle>
          <CardDescription>
            Últimas 100 atribuições de variantes para leads
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">Lead</th>
                  <th className="text-left py-3 px-4">Variante</th>
                  <th className="text-center py-3 px-4">Entregue</th>
                  <th className="text-center py-3 px-4">Abriu</th>
                  <th className="text-center py-3 px-4">Clicou</th>
                  <th className="text-center py-3 px-4">Converteu</th>
                  <th className="text-right py-3 px-4">Atribuído em</th>
                </tr>
              </thead>
              <tbody>
                {assignments.map((assignment) => (
                  <tr key={assignment.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div className="font-medium">{assignment.lead?.name}</div>
                      <div className="text-xs text-gray-500">
                        {assignment.lead?.email}
                      </div>
                    </td>
                    <td className="py-3 px-4">{assignment.variant?.name}</td>
                    <td className="text-center py-3 px-4">
                      {assignment.events?.delivered ? '✅' : '⏳'}
                    </td>
                    <td className="text-center py-3 px-4">
                      {assignment.events?.opened ? '✅' : '-'}
                    </td>
                    <td className="text-center py-3 px-4">
                      {assignment.events?.clicked ? '✅' : '-'}
                    </td>
                    <td className="text-center py-3 px-4">
                      {assignment.events?.converted ? '✅' : '-'}
                    </td>
                    <td className="text-right py-3 px-4 text-gray-500">
                      {new Date(assignment.assigned_at).toLocaleDateString('pt-BR')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
