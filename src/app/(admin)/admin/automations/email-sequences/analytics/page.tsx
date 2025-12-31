'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts'
import { Mail, TrendingUp, Users, DollarSign, MousePointerClick } from 'lucide-react'

interface SequenceStats {
  sequenceId: string
  sequenceName: string
  totalSubscribers: number
  activeSubscribers: number
  completedSubscribers: number
  unsubscribedSubscribers: number
  totalSent: number
  totalOpened: number
  totalClicked: number
  totalConverted: number
  openRate: number
  clickRate: number
  conversionRate: number
  revenue: number
}

interface StepPerformance {
  stepNumber: number
  stepId: string
  subject: string
  sent: number
  opened: number
  clicked: number
  converted: number
  openRate: number
  clickRate: number
  conversionRate: number
}

interface FunnelData {
  stage: string
  count: number
  percentage: number
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6']

export default function EmailSequenceAnalyticsPage() {
  const [loading, setLoading] = useState(true)
  const [sequences, setSequences] = useState<SequenceStats[]>([])
  const [selectedSequence, setSelectedSequence] = useState<string | null>(null)
  const [stepPerformance, setStepPerformance] = useState<StepPerformance[]>([])
  const [funnelData, setFunnelData] = useState<FunnelData[]>([])
  const supabase = createClient()

  useEffect(() => {
    loadSequenceStats()
  }, [])

  useEffect(() => {
    if (selectedSequence) {
      loadStepPerformance(selectedSequence)
      loadFunnelData(selectedSequence)
    }
  }, [selectedSequence])

  async function loadSequenceStats() {
    try {
      // Buscar todas as sequências
      const { data: sequencesData, error: seqError } = await supabase
        .from('email_sequences')
        .select('id, name, status')

      if (seqError) throw seqError

      const stats: SequenceStats[] = []

      for (const seq of sequencesData || []) {
        // Contar subscribers por status
        const { data: subs } = await supabase
          .from('email_sequence_subscriptions')
          .select('status')
          .eq('sequence_id', seq.id)

        const total = subs?.length || 0
        const active = subs?.filter(s => s.status === 'active').length || 0
        const completed = subs?.filter(s => s.status === 'completed').length || 0
        const unsubscribed = subs?.filter(s => s.status === 'unsubscribed').length || 0

        // Contar envios
        const { data: sends } = await supabase
          .from('email_sequence_sends')
          .select('opened_at, clicked_at, bounced_at, unsubscribed_at')
          .eq('subscription_id', 'subscription_id') // TODO: Join correto

        const totalSent = sends?.length || 0
        const totalOpened = sends?.filter(s => s.opened_at).length || 0
        const totalClicked = sends?.filter(s => s.clicked_at).length || 0
        const totalConverted = 0 // TODO: Implementar tracking de conversão

        stats.push({
          sequenceId: seq.id,
          sequenceName: seq.name,
          totalSubscribers: total,
          activeSubscribers: active,
          completedSubscribers: completed,
          unsubscribedSubscribers: unsubscribed,
          totalSent,
          totalOpened,
          totalClicked,
          totalConverted,
          openRate: totalSent > 0 ? (totalOpened / totalSent) * 100 : 0,
          clickRate: totalSent > 0 ? (totalClicked / totalSent) * 100 : 0,
          conversionRate: totalSent > 0 ? (totalConverted / totalSent) * 100 : 0,
          revenue: 0, // TODO: Calcular receita real
        })
      }

      setSequences(stats)
      if (stats.length > 0 && !selectedSequence) {
        setSelectedSequence(stats[0].sequenceId)
      }
    } catch (error) {
      console.error('Error loading sequence stats:', error)
    } finally {
      setLoading(false)
    }
  }

  async function loadStepPerformance(sequenceId: string) {
    try {
      const { data: steps, error } = await supabase
        .from('email_sequence_steps')
        .select('*')
        .eq('sequence_id', sequenceId)
        .order('step_number', { ascending: true })

      if (error) throw error

      // TODO: Calcular performance real de cada step
      const performance: StepPerformance[] = (steps || []).map((step) => ({
        stepNumber: step.step_number,
        stepId: step.id,
        subject: step.subject,
        sent: Math.floor(Math.random() * 1000), // Mock data
        opened: Math.floor(Math.random() * 500),
        clicked: Math.floor(Math.random() * 100),
        converted: Math.floor(Math.random() * 50),
        openRate: Math.random() * 50 + 20,
        clickRate: Math.random() * 20 + 5,
        conversionRate: Math.random() * 10 + 2,
      }))

      setStepPerformance(performance)
    } catch (error) {
      console.error('Error loading step performance:', error)
    }
  }

  async function loadFunnelData(sequenceId: string) {
    try {
      const { data: subs } = await supabase
        .from('email_sequence_subscriptions')
        .select('status')
        .eq('sequence_id', sequenceId)

      const total = subs?.length || 1 // Avoid division by zero

      const funnel: FunnelData[] = [
        {
          stage: 'Inscritos',
          count: total,
          percentage: 100,
        },
        {
          stage: 'Ativos',
          count: subs?.filter(s => s.status === 'active').length || 0,
          percentage: ((subs?.filter(s => s.status === 'active').length || 0) / total) * 100,
        },
        {
          stage: 'Engajados',
          count: Math.floor(total * 0.4), // Mock
          percentage: 40,
        },
        {
          stage: 'Convertidos',
          count: Math.floor(total * 0.15), // Mock
          percentage: 15,
        },
        {
          stage: 'Clientes',
          count: Math.floor(total * 0.08), // Mock
          percentage: 8,
        },
      ]

      setFunnelData(funnel)
    } catch (error) {
      console.error('Error loading funnel data:', error)
    }
  }

  const selectedSeqStats = sequences.find(s => s.sequenceId === selectedSequence)

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando analytics...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 px-4">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Analytics de Sequências</h1>
        <p className="text-gray-600 mt-2">
          Métricas detalhadas de performance das sequências de email
        </p>
      </div>

      {/* Sequence Selector */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Selecione uma sequência:
        </label>
        <select
          className="border rounded px-4 py-2 w-full md:w-96"
          value={selectedSequence || ''}
          onChange={(e) => setSelectedSequence(e.target.value)}
        >
          {sequences.map((seq) => (
            <option key={seq.sequenceId} value={seq.sequenceId}>
              {seq.sequenceName}
            </option>
          ))}
        </select>
      </div>

      {selectedSeqStats && (
        <>
          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Subscribers
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{selectedSeqStats.totalSubscribers}</div>
                <div className="text-xs text-gray-600 mt-1">
                  {selectedSeqStats.activeSubscribers} ativos
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Open Rate
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-600">
                  {selectedSeqStats.openRate.toFixed(1)}%
                </div>
                <div className="text-xs text-gray-600 mt-1">
                  {selectedSeqStats.totalOpened}/{selectedSeqStats.totalSent} abertos
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                  <MousePointerClick className="h-4 w-4" />
                  Click Rate
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600">
                  {selectedSeqStats.clickRate.toFixed(1)}%
                </div>
                <div className="text-xs text-gray-600 mt-1">
                  {selectedSeqStats.totalClicked}/{selectedSeqStats.totalSent} cliques
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Conversion
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-purple-600">
                  {selectedSeqStats.conversionRate.toFixed(1)}%
                </div>
                <div className="text-xs text-gray-600 mt-1">
                  {selectedSeqStats.totalConverted} conversões
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  Receita
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600">
                  R$ {selectedSeqStats.revenue.toLocaleString()}
                </div>
                <div className="text-xs text-gray-600 mt-1">MRR gerado</div>
              </CardContent>
            </Card>
          </div>

          {/* Step Performance Chart */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Performance por Step</CardTitle>
              <CardDescription>
                Taxa de abertura, clique e conversão de cada email da sequência
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={stepPerformance}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="stepNumber" label={{ value: 'Step', position: 'insideBottom', offset: -5 }} />
                  <YAxis label={{ value: 'Taxa (%)', angle: -90, position: 'insideLeft' }} />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="openRate"
                    stroke="#3b82f6"
                    name="Open Rate"
                    strokeWidth={2}
                  />
                  <Line
                    type="monotone"
                    dataKey="clickRate"
                    stroke="#10b981"
                    name="Click Rate"
                    strokeWidth={2}
                  />
                  <Line
                    type="monotone"
                    dataKey="conversionRate"
                    stroke="#8b5cf6"
                    name="Conversion Rate"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            {/* Subscriber Status Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Distribuição de Subscribers</CardTitle>
                <CardDescription>Status atual dos inscritos na sequência</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'Ativos', value: selectedSeqStats.activeSubscribers },
                        { name: 'Completados', value: selectedSeqStats.completedSubscribers },
                        { name: 'Cancelados', value: selectedSeqStats.unsubscribedSubscribers },
                      ]}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {[0, 1, 2].map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Conversion Funnel */}
            <Card>
              <CardHeader>
                <CardTitle>Funil de Conversão</CardTitle>
                <CardDescription>Jornada do inscrito até cliente</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={funnelData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="stage" type="category" width={100} />
                    <Tooltip />
                    <Bar dataKey="count" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Step Detail Table */}
          <Card>
            <CardHeader>
              <CardTitle>Detalhes por Email</CardTitle>
              <CardDescription>Performance individual de cada email da sequência</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4">Step</th>
                      <th className="text-left py-3 px-4">Subject</th>
                      <th className="text-right py-3 px-4">Enviados</th>
                      <th className="text-right py-3 px-4">Open Rate</th>
                      <th className="text-right py-3 px-4">Click Rate</th>
                      <th className="text-right py-3 px-4">Conversão</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stepPerformance.map((step) => (
                      <tr key={step.stepId} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4 font-medium">#{step.stepNumber}</td>
                        <td className="py-3 px-4">{step.subject}</td>
                        <td className="text-right py-3 px-4">{step.sent}</td>
                        <td className="text-right py-3 px-4">
                          <span className="text-blue-600 font-medium">
                            {step.openRate.toFixed(1)}%
                          </span>
                          <div className="text-xs text-gray-500">
                            {step.opened}/{step.sent}
                          </div>
                        </td>
                        <td className="text-right py-3 px-4">
                          <span className="text-green-600 font-medium">
                            {step.clickRate.toFixed(1)}%
                          </span>
                          <div className="text-xs text-gray-500">
                            {step.clicked}/{step.sent}
                          </div>
                        </td>
                        <td className="text-right py-3 px-4">
                          <span className="text-purple-600 font-medium">
                            {step.conversionRate.toFixed(1)}%
                          </span>
                          <div className="text-xs text-gray-500">
                            {step.converted}/{step.sent}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
