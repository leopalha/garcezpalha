'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Clock, TrendingUp, Brain, Search } from 'lucide-react'
import {
  sendTimeOptimizer,
  type SendTimeRecommendation,
} from '@/lib/ml/send-time-optimizer'

const DAY_NAMES = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado']

export default function SendTimeOptimizationPage() {
  const [loading, setLoading] = useState(false)
  const [leadId, setLeadId] = useState('')
  const [recommendation, setRecommendation] = useState<SendTimeRecommendation | null>(null)
  const [performance, setPerformance] = useState<any>(null)

  useEffect(() => {
    loadPerformance()
  }, [])

  async function loadPerformance() {
    try {
      const report = await sendTimeOptimizer.generatePerformanceReport()
      setPerformance(report)
    } catch (error) {
      console.error('Error loading performance:', error)
    }
  }

  async function handleSearch() {
    if (!leadId.trim()) return

    setLoading(true)
    try {
      const rec = await sendTimeOptimizer.getRecommendation(leadId)
      setRecommendation(rec)
    } catch (error: any) {
      console.error('Error getting recommendation:', error)
      alert(error.message || 'Erro ao buscar recomendação')
    } finally {
      setLoading(false)
    }
  }

  function getConfidenceColor(confidence: number): string {
    if (confidence >= 80) return 'bg-green-500'
    if (confidence >= 60) return 'bg-yellow-500'
    return 'bg-gray-500'
  }

  function getBasedOnLabel(basedOn: string): string {
    switch (basedOn) {
      case 'individual':
        return 'Dados Individuais'
      case 'segment':
        return 'Dados do Segmento'
      case 'global':
        return 'Média Global'
      default:
        return basedOn
    }
  }

  return (
    <div className="container mx-auto py-8 px-4">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
          <Brain className="h-8 w-8 text-purple-600" />
          Otimização de Horários de Envio
        </h1>
        <p className="text-gray-600 mt-2">
          Machine learning para determinar o melhor horário de envio para cada lead
        </p>
      </div>

      {/* Performance Overview */}
      {performance && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">
                Total de Emails Analisados
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{performance.totalEmails}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">
                Acurácia do Modelo
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">
                {performance.accuracy}%
              </div>
              <div className="text-xs text-gray-600 mt-1">
                {performance.correctPredictions} previsões corretas
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">
                Confiança Média
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">
                {performance.avgConfidence}%
              </div>
              <div className="text-xs text-gray-600 mt-1">Nível de certeza</div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Search Lead */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Buscar Recomendação para Lead</CardTitle>
          <CardDescription>
            Digite o ID do lead para ver o horário ideal de envio
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-3">
            <Input
              placeholder="ID do lead (UUID)"
              value={leadId}
              onChange={(e) => setLeadId(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
            <Button onClick={handleSearch} disabled={loading || !leadId.trim()}>
              <Search className="h-4 w-4 mr-2" />
              {loading ? 'Buscando...' : 'Buscar'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recommendation Result */}
      {recommendation && (
        <Card className="border-purple-200">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-purple-600" />
                  Recomendação de Envio
                </CardTitle>
                <CardDescription>Lead: {recommendation.leadId}</CardDescription>
              </div>
              <Badge className={getConfidenceColor(recommendation.confidence)}>
                {recommendation.confidence}% confiança
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Recommended Time */}
              <div className="p-6 bg-purple-50 rounded-lg border border-purple-200">
                <div className="text-sm font-medium text-purple-700 mb-2">
                  Melhor Horário de Envio
                </div>
                <div className="text-4xl font-bold text-purple-900 mb-1">
                  {DAY_NAMES[recommendation.recommendedDayOfWeek]}
                </div>
                <div className="text-2xl font-bold text-purple-600">
                  {recommendation.recommendedHour}:00h
                </div>
              </div>

              {/* Data Source */}
              <div className="p-6 bg-blue-50 rounded-lg border border-blue-200">
                <div className="text-sm font-medium text-blue-700 mb-2">
                  Baseado em
                </div>
                <div className="text-2xl font-bold text-blue-900 mb-3">
                  {getBasedOnLabel(recommendation.basedOn)}
                </div>
                <div className="text-sm text-blue-700 space-y-1">
                  <div>
                    📧 {recommendation.stats.totalEmails} emails enviados
                  </div>
                  <div>
                    ✉️ {recommendation.stats.totalOpens} abertos
                  </div>
                </div>
              </div>
            </div>

            {/* Details */}
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded border border-gray-200">
                <div className="text-sm font-medium text-gray-700 mb-3">
                  Como funciona:
                </div>
                <div className="text-sm text-gray-600 space-y-2">
                  {recommendation.basedOn === 'individual' && (
                    <div className="flex items-start gap-2">
                      <TrendingUp className="h-4 w-4 text-green-600 mt-0.5" />
                      <div>
                        <strong className="text-green-600">Dados Individuais:</strong> Este lead
                        tem histórico suficiente ({recommendation.stats.totalEmails}+ emails). A
                        recomendação é baseada nos horários em que ELE especificamente mais abre
                        emails.
                      </div>
                    </div>
                  )}

                  {recommendation.basedOn === 'segment' && (
                    <div className="flex items-start gap-2">
                      <TrendingUp className="h-4 w-4 text-yellow-600 mt-0.5" />
                      <div>
                        <strong className="text-yellow-600">Dados do Segmento:</strong> Este
                        lead não tem histórico suficiente, então usamos dados de leads similares
                        no mesmo segmento. Confiança moderada.
                      </div>
                    </div>
                  )}

                  {recommendation.basedOn === 'global' && (
                    <div className="flex items-start gap-2">
                      <TrendingUp className="h-4 w-4 text-blue-600 mt-0.5" />
                      <div>
                        <strong className="text-blue-600">Média Global:</strong> Usando
                        estatísticas de toda a base de leads. Recomendação baseada em padrões
                        gerais de email marketing.
                      </div>
                    </div>
                  )}

                  <div className="pt-3 border-t mt-3">
                    <strong>Confiança ({recommendation.confidence}%):</strong>
                    <ul className="list-disc list-inside mt-2 space-y-1">
                      {recommendation.confidence >= 90 && (
                        <li>Altíssima confiança - 50+ emails individuais analisados</li>
                      )}
                      {recommendation.confidence >= 75 && recommendation.confidence < 90 && (
                        <li>Alta confiança - 20+ emails individuais analisados</li>
                      )}
                      {recommendation.confidence >= 60 && recommendation.confidence < 75 && (
                        <li>Confiança moderada - dados do segmento (200+ emails)</li>
                      )}
                      {recommendation.confidence < 60 && (
                        <li>Confiança baixa - baseado em média global</li>
                      )}
                    </ul>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-green-50 rounded border border-green-200">
                <div className="text-sm font-medium text-green-700 mb-2">
                  ✅ Próxima ação:
                </div>
                <div className="text-sm text-green-700">
                  Ao agendar o próximo email para este lead, o sistema automaticamente usará esta
                  recomendação. O email será enviado na próxima{' '}
                  <strong>{DAY_NAMES[recommendation.recommendedDayOfWeek]}</strong> às{' '}
                  <strong>{recommendation.recommendedHour}:00h</strong>.
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* How It Works */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Como Funciona o ML de Otimização</CardTitle>
          <CardDescription>Algoritmo de aprendizado incremental</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 text-sm text-gray-700">
            <div>
              <strong className="text-purple-600">1. Coleta de Dados:</strong>
              <p className="ml-4 mt-1">
                O sistema registra quando cada email é enviado (dia da semana + hora) e quando é
                aberto. Isso gera um histórico de comportamento para cada lead.
              </p>
            </div>

            <div>
              <strong className="text-purple-600">2. Análise por Lead:</strong>
              <p className="ml-4 mt-1">
                Para leads com 10+ emails, calculamos a taxa de abertura por hora e dia da semana.
                Identificamos padrões: "Este lead sempre abre emails às terças 10h".
              </p>
            </div>

            <div>
              <strong className="text-purple-600">3. Fallback por Segmento:</strong>
              <p className="ml-4 mt-1">
                Se não há dados individuais suficientes, usamos médias do segmento (Hot Leads, Cold
                Leads, etc). Leads similares tendem a ter comportamentos similares.
              </p>
            </div>

            <div>
              <strong className="text-purple-600">4. Fallback Global:</strong>
              <p className="ml-4 mt-1">
                Se nem o segmento tem dados, usamos médias de toda a base. Baseado em estudos de
                email marketing: Terça/Quinta às 10h-14h são melhores horários.
              </p>
            </div>

            <div>
              <strong className="text-purple-600">5. Aprendizado Contínuo:</strong>
              <p className="ml-4 mt-1">
                A cada novo email aberto, o modelo se atualiza. Quanto mais dados, maior a
                confiança e precisão das recomendações.
              </p>
            </div>

            <div className="p-4 bg-blue-50 rounded border border-blue-200 mt-4">
              <div className="font-medium text-blue-900 mb-2">📊 Métricas de Sucesso:</div>
              <ul className="list-disc list-inside space-y-1 text-blue-700">
                <li>
                  <strong>Acurácia:</strong> % de emails enviados no horário recomendado que foram
                  abertos
                </li>
                <li>
                  <strong>Confiança:</strong> Baseada em quantidade de dados (mais dados = mais
                  confiança)
                </li>
                <li>
                  <strong>Score:</strong> Open rate × volume de dados (penaliza predições com
                  poucos dados)
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
