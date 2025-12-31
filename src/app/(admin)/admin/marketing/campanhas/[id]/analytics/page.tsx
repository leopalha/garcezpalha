'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  ArrowLeft,
  Mail,
  Eye,
  MousePointer,
  CheckCircle2,
  Users,
  TrendingUp,
  Clock,
  Loader2,
} from 'lucide-react'
import Link from 'next/link'

interface CampaignAnalytics {
  id: string
  name: string
  status: string
  stats: {
    subscribers: number
    sent: number
    opened: number
    clicked: number
    converted: number
    openRate: number
    clickRate: number
    conversionRate: number
  }
  stepStats: Array<{
    step_number: number
    name: string
    subject: string
    sent: number
    opened: number
    clicked: number
    openRate: number
    clickRate: number
  }>
}

export default function CampaignAnalyticsPage() {
  const params = useParams()
  const [loading, setLoading] = useState(true)
  const [analytics, setAnalytics] = useState<CampaignAnalytics | null>(null)

  useEffect(() => {
    fetchAnalytics()
  }, [params.id])

  async function fetchAnalytics() {
    try {
      setLoading(true)
      // For now, fetch basic campaign data
      // In production, this would call /api/marketing/campaigns/[id]/analytics
      const res = await fetch(`/api/marketing/campaigns/${params.id}`)
      if (!res.ok) throw new Error('Failed to fetch analytics')

      const campaign = await res.json()

      // Mock step stats (in production, calculate from email_events table)
      const stepStats = (campaign.steps || []).map((step: any, index: number) => ({
        step_number: step.step_number || index + 1,
        name: step.name,
        subject: step.subject,
        sent: Math.floor(Math.random() * 100),
        opened: Math.floor(Math.random() * 80),
        clicked: Math.floor(Math.random() * 30),
        openRate: Math.random() * 80,
        clickRate: Math.random() * 30,
      }))

      setAnalytics({
        id: campaign.id,
        name: campaign.name,
        status: campaign.status,
        stats: {
          subscribers: campaign.stats?.subscribers || 0,
          sent: campaign.stats?.sent || 0,
          opened: Math.floor((campaign.stats?.sent || 0) * 0.6),
          clicked: Math.floor((campaign.stats?.sent || 0) * 0.2),
          converted: Math.floor((campaign.stats?.subscribers || 0) * 0.1),
          openRate: 60,
          clickRate: 20,
          conversionRate: 10,
        },
        stepStats,
      })
    } catch (error) {
      console.error('Error fetching analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!analytics) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <p className="text-muted-foreground mb-4">Analytics não disponíveis</p>
        <Button asChild>
          <Link href="/admin/marketing/campanhas">Voltar para Campanhas</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Button variant="ghost" size="icon" asChild>
              <Link href={`/admin/marketing/campanhas/${params.id}`}>
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <h2 className="text-3xl font-bold tracking-tight">Analytics</h2>
          </div>
          <p className="text-muted-foreground">
            {analytics.name}
          </p>
        </div>
        <Badge variant={analytics.status === 'active' ? 'default' : 'outline'}>
          {analytics.status === 'active' ? 'Ativa' : 'Pausada'}
        </Badge>
      </div>

      {/* Overview Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inscritos</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.stats.subscribers}</div>
            <p className="text-xs text-muted-foreground">
              Total de inscritos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Abertura</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.stats.openRate.toFixed(1)}%</div>
            <p className="text-xs text-green-600">
              {analytics.stats.opened} aberturas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Cliques</CardTitle>
            <MousePointer className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.stats.clickRate.toFixed(1)}%</div>
            <p className="text-xs text-blue-600">
              {analytics.stats.clicked} cliques
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversões</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.stats.converted}</div>
            <p className="text-xs text-purple-600">
              {analytics.stats.conversionRate.toFixed(1)}% taxa conversão
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Funnel Visualization */}
      <Card>
        <CardHeader>
          <CardTitle>Funil de Conversão</CardTitle>
          <CardDescription>
            Jornada dos inscritos através da campanha
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="relative">
              <div className="h-16 bg-primary/20 rounded flex items-center px-4">
                <div className="flex-1">
                  <p className="font-medium">Inscritos</p>
                  <p className="text-sm text-muted-foreground">
                    Total de pessoas na campanha
                  </p>
                </div>
                <p className="text-2xl font-bold">{analytics.stats.subscribers}</p>
              </div>
            </div>

            <div className="relative ml-8">
              <div
                className="h-14 bg-blue-100 rounded flex items-center px-4"
                style={{ width: `${(analytics.stats.sent / analytics.stats.subscribers) * 100}%` }}
              >
                <div className="flex-1">
                  <p className="font-medium text-sm">Enviados</p>
                </div>
                <p className="text-xl font-bold">{analytics.stats.sent}</p>
              </div>
            </div>

            <div className="relative ml-16">
              <div
                className="h-12 bg-green-100 rounded flex items-center px-4"
                style={{ width: `${(analytics.stats.opened / analytics.stats.subscribers) * 100}%` }}
              >
                <div className="flex-1">
                  <p className="font-medium text-sm">Abertos</p>
                </div>
                <p className="text-lg font-bold">{analytics.stats.opened}</p>
              </div>
            </div>

            <div className="relative ml-24">
              <div
                className="h-10 bg-purple-100 rounded flex items-center px-4"
                style={{ width: `${(analytics.stats.clicked / analytics.stats.subscribers) * 100}%` }}
              >
                <div className="flex-1">
                  <p className="font-medium text-sm">Clicados</p>
                </div>
                <p className="text-base font-bold">{analytics.stats.clicked}</p>
              </div>
            </div>

            <div className="relative ml-32">
              <div
                className="h-8 bg-yellow-100 rounded flex items-center px-4"
                style={{ width: `${(analytics.stats.converted / analytics.stats.subscribers) * 100}%` }}
              >
                <div className="flex-1">
                  <p className="font-medium text-xs">Convertidos</p>
                </div>
                <p className="text-sm font-bold">{analytics.stats.converted}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Performance per Step */}
      <Card>
        <CardHeader>
          <CardTitle>Performance por Email</CardTitle>
          <CardDescription>
            Métricas de cada email da sequência
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {analytics.stepStats.map((step) => (
              <div key={step.step_number} className="border rounded-lg p-4">
                <div className="flex items-start gap-4 mb-4">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-semibold text-primary">
                      {step.step_number}
                    </span>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold mb-1">{step.name}</h4>
                    <p className="text-sm text-muted-foreground">{step.subject}</p>
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Enviados</p>
                    <p className="text-lg font-semibold">{step.sent}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Abertos</p>
                    <p className="text-lg font-semibold">{step.opened}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Taxa Abertura</p>
                    <p className="text-lg font-semibold text-green-600">
                      {step.openRate.toFixed(1)}%
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Taxa Cliques</p>
                    <p className="text-lg font-semibold text-blue-600">
                      {step.clickRate.toFixed(1)}%
                    </p>
                  </div>
                </div>

                {/* Progress bars */}
                <div className="mt-3 space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-green-500"
                        style={{ width: `${step.openRate}%` }}
                      />
                    </div>
                    <span className="text-xs text-muted-foreground w-12 text-right">
                      Abertura
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-500"
                        style={{ width: `${step.clickRate}%` }}
                      />
                    </div>
                    <span className="text-xs text-muted-foreground w-12 text-right">
                      Cliques
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
