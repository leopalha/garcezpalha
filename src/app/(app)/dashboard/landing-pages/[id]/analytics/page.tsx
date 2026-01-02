'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  Eye,
  MousePointerClick,
  Users,
  Calendar,
  BarChart3,
  Clock,
  Globe,
  Smartphone,
  Monitor,
  Tablet,
} from 'lucide-react'

interface AnalyticsData {
  landingPageId: string
  landingPageTitle: string
  product: string
  totalViews: number
  uniqueVisitors: number
  totalLeads: number
  conversionRate: number
  avgTimeOnPage: number
  bounceRate: number
  viewsChange: number
  leadsChange: number
  conversionChange: number
  trafficSources: Array<{ source: string; visits: number; percentage: number }>
  deviceBreakdown: Array<{ device: string; visits: number; percentage: number }>
  dailyStats: Array<{ date: string; views: number; leads: number }>
}

export default function LandingPageAnalyticsPage() {
  const params = useParams()
  const router = useRouter()
  const landingPageId = params.id as string

  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [period, setPeriod] = useState<'7d' | '30d' | '90d'>('30d')

  useEffect(() => {
    fetchAnalytics()
  }, [landingPageId, period])

  const fetchAnalytics = async () => {
    setLoading(true)
    try {
      // Mock data - in production this would fetch from analytics API
      const mockAnalytics: AnalyticsData = {
        landingPageId,
        landingPageTitle: 'Resolva seu Problema de Usucapião em 60 Dias',
        product: 'Usucapião Extraordinária',
        totalViews: 2456,
        uniqueVisitors: 1834,
        totalLeads: 78,
        conversionRate: 3.18,
        avgTimeOnPage: 245, // seconds
        bounceRate: 42.5,
        viewsChange: 12.5,
        leadsChange: 8.3,
        conversionChange: -2.1,
        trafficSources: [
          { source: 'Google Ads', visits: 1245, percentage: 50.7 },
          { source: 'Facebook Ads', visits: 689, percentage: 28.1 },
          { source: 'Orgânico', visits: 345, percentage: 14.1 },
          { source: 'Direto', visits: 177, percentage: 7.1 },
        ],
        deviceBreakdown: [
          { device: 'Mobile', visits: 1474, percentage: 60.0 },
          { device: 'Desktop', visits: 736, percentage: 30.0 },
          { device: 'Tablet', visits: 246, percentage: 10.0 },
        ],
        dailyStats: Array.from({ length: 30 }, (_, i) => ({
          date: new Date(Date.now() - (29 - i) * 86400000).toISOString().split('T')[0],
          views: Math.floor(Math.random() * 100) + 50,
          leads: Math.floor(Math.random() * 5) + 1,
        })),
      }

      setAnalytics(mockAnalytics)
    } catch (error) {
      console.error('Error fetching analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}m ${secs}s`
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <BarChart3 className="w-8 h-8 animate-pulse text-primary" />
      </div>
    )
  }

  if (!analytics) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardHeader>
            <CardTitle>Analytics não encontrados</CardTitle>
          </CardHeader>
          <CardContent>
            <Button onClick={() => router.push('/dashboard/landing-pages')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar para Landing Pages
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const StatCard = ({
    title,
    value,
    change,
    icon: Icon,
    subtitle,
  }: {
    title: string
    value: string | number
    change?: number
    icon: any
    subtitle?: string
  }) => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {subtitle && <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>}
        {change !== undefined && (
          <p className="text-xs flex items-center gap-1 mt-1">
            {change >= 0 ? (
              <>
                <TrendingUp className="h-3 w-3 text-green-600" />
                <span className="text-green-600">+{change.toFixed(1)}%</span>
              </>
            ) : (
              <>
                <TrendingDown className="h-3 w-3 text-red-600" />
                <span className="text-red-600">{change.toFixed(1)}%</span>
              </>
            )}
            <span className="text-muted-foreground">vs período anterior</span>
          </p>
        )}
      </CardContent>
    </Card>
  )

  return (
    <div className="container mx-auto py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => router.push('/dashboard/landing-pages')}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <BarChart3 className="h-8 w-8 text-primary" />
              Analytics
            </h1>
            <p className="text-muted-foreground mt-1">{analytics.landingPageTitle}</p>
            <Badge variant="outline" className="mt-2">{analytics.product}</Badge>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant={period === '7d' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setPeriod('7d')}
          >
            7 dias
          </Button>
          <Button
            variant={period === '30d' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setPeriod('30d')}
          >
            30 dias
          </Button>
          <Button
            variant={period === '90d' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setPeriod('90d')}
          >
            90 dias
          </Button>
        </div>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total de Visitas"
          value={analytics.totalViews.toLocaleString('pt-BR')}
          change={analytics.viewsChange}
          icon={Eye}
          subtitle={`${analytics.uniqueVisitors.toLocaleString('pt-BR')} visitantes únicos`}
        />
        <StatCard
          title="Leads Gerados"
          value={analytics.totalLeads}
          change={analytics.leadsChange}
          icon={Users}
        />
        <StatCard
          title="Taxa de Conversão"
          value={`${analytics.conversionRate.toFixed(2)}%`}
          change={analytics.conversionChange}
          icon={MousePointerClick}
        />
        <StatCard
          title="Tempo Médio na Página"
          value={formatTime(analytics.avgTimeOnPage)}
          icon={Clock}
          subtitle={`Taxa de rejeição: ${analytics.bounceRate.toFixed(1)}%`}
        />
      </div>

      {/* Traffic Sources */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Fontes de Tráfego
          </CardTitle>
          <CardDescription>De onde vêm seus visitantes</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {analytics.trafficSources.map((source) => (
              <div key={source.source}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">{source.source}</span>
                  <span className="text-sm text-muted-foreground">
                    {source.visits.toLocaleString('pt-BR')} visitas ({source.percentage.toFixed(1)}%)
                  </span>
                </div>
                <div className="w-full bg-secondary rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full transition-all"
                    style={{ width: `${source.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Device Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Smartphone className="h-5 w-5" />
            Dispositivos
          </CardTitle>
          <CardDescription>Distribuição por tipo de dispositivo</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {analytics.deviceBreakdown.map((device) => {
              const Icon =
                device.device === 'Mobile'
                  ? Smartphone
                  : device.device === 'Desktop'
                  ? Monitor
                  : Tablet
              return (
                <div
                  key={device.device}
                  className="flex flex-col items-center p-4 border rounded-lg"
                >
                  <Icon className="h-8 w-8 text-primary mb-2" />
                  <p className="font-semibold">{device.device}</p>
                  <p className="text-2xl font-bold mt-2">{device.percentage.toFixed(1)}%</p>
                  <p className="text-sm text-muted-foreground">
                    {device.visits.toLocaleString('pt-BR')} visitas
                  </p>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Daily Stats Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Performance Diária
          </CardTitle>
          <CardDescription>Últimos 30 dias de atividade</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="max-h-[400px] overflow-y-auto">
            <table className="w-full">
              <thead className="sticky top-0 bg-background border-b">
                <tr className="text-left">
                  <th className="pb-2 font-semibold">Data</th>
                  <th className="pb-2 font-semibold text-right">Visitas</th>
                  <th className="pb-2 font-semibold text-right">Leads</th>
                  <th className="pb-2 font-semibold text-right">Conversão</th>
                </tr>
              </thead>
              <tbody>
                {analytics.dailyStats.slice().reverse().map((day) => {
                  const convRate = day.views > 0 ? (day.leads / day.views) * 100 : 0
                  return (
                    <tr key={day.date} className="border-b last:border-0">
                      <td className="py-2">
                        {new Date(day.date).toLocaleDateString('pt-BR', {
                          day: '2-digit',
                          month: 'short',
                        })}
                      </td>
                      <td className="py-2 text-right">{day.views}</td>
                      <td className="py-2 text-right">{day.leads}</td>
                      <td className="py-2 text-right">{convRate.toFixed(2)}%</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
