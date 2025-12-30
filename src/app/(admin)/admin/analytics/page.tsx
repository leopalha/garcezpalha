'use client'

import { useState, useEffect, useCallback } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Eye,
  Users,
  TrendingUp,
  AlertCircle,
  Activity,
  RefreshCw,
  Download,
  Clock,
} from 'lucide-react'

// TypeScript Types
interface PageViewMetrics {
  last24h: number
  last7d: number
  last30d: number
}

interface ConversionRates {
  leads: number
  payments: number
}

interface TopPage {
  path: string
  views: number
  uniqueVisitors: number
}

interface AnalyticsData {
  pageViews: PageViewMetrics
  uniqueVisitors: PageViewMetrics
  conversionRates: ConversionRates
  topPages: TopPage[]
}

interface ErrorSummary {
  total: number
  critical: number
  warning: number
  info: number
  recentErrors: Array<{
    id: string
    message: string
    timestamp: string
    severity: 'critical' | 'warning' | 'info'
  }>
}

interface HealthStatus {
  status: 'healthy' | 'degraded' | 'unhealthy'
  uptime: number
  services: Array<{
    name: string
    status: 'up' | 'down' | 'degraded'
    responseTime: number
  }>
  lastChecked: string
}

type TimeRange = '24h' | '7d' | '30d'

export default function AnalyticsDashboard() {
  const [timeRange, setTimeRange] = useState<TimeRange>('7d')
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null)
  const [errorSummary, setErrorSummary] = useState<ErrorSummary | null>(null)
  const [healthStatus, setHealthStatus] = useState<HealthStatus | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date())

  // Fetch real analytics data from API
  const fetchAnalyticsData = useCallback(async (): Promise<AnalyticsData> => {
    const response = await fetch('/api/admin/analytics/overview')
    if (!response.ok) {
      throw new Error('Failed to fetch analytics data')
    }
    return response.json()
  }, [])

  const fetchErrorSummary = useCallback(async (): Promise<ErrorSummary> => {
    const response = await fetch('/api/admin/analytics/errors')
    if (!response.ok) {
      throw new Error('Failed to fetch error summary')
    }
    return response.json()
  }, [])

  const fetchHealthStatus = useCallback(async (): Promise<HealthStatus> => {
    const response = await fetch('/api/admin/analytics/health')
    if (!response.ok) {
      throw new Error('Failed to fetch health status')
    }
    return response.json()
  }, [])

  const fetchAllData = useCallback(async () => {
    setIsLoading(true)
    try {
      const [analytics, errors, health] = await Promise.all([
        fetchAnalyticsData(),
        fetchErrorSummary(),
        fetchHealthStatus(),
      ])
      setAnalyticsData(analytics)
      setErrorSummary(errors)
      setHealthStatus(health)
      setLastRefresh(new Date())
    } catch (error) {
      console.error('Failed to fetch analytics data:', error)
    } finally {
      setIsLoading(false)
    }
  }, [fetchAnalyticsData, fetchErrorSummary, fetchHealthStatus])

  const handleRefresh = async () => {
    setIsRefreshing(true)
    await fetchAllData()
    setIsRefreshing(false)
  }

  const handleExport = () => {
    const exportData = {
      timestamp: new Date().toISOString(),
      timeRange,
      analytics: analyticsData,
      errors: errorSummary,
      health: healthStatus,
    }
    console.log('Exporting analytics data:', exportData)
    alert('Data exported to console. Check browser developer tools.')
  }

  useEffect(() => {
    fetchAllData()
  }, [fetchAllData])

  const getPageViewsByRange = () => {
    if (!analyticsData) return 0
    switch (timeRange) {
      case '24h':
        return analyticsData.pageViews.last24h
      case '7d':
        return analyticsData.pageViews.last7d
      case '30d':
        return analyticsData.pageViews.last30d
    }
  }

  const getUniqueVisitorsByRange = () => {
    if (!analyticsData) return 0
    switch (timeRange) {
      case '24h':
        return analyticsData.uniqueVisitors.last24h
      case '7d':
        return analyticsData.uniqueVisitors.last7d
      case '30d':
        return analyticsData.uniqueVisitors.last30d
    }
  }

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('pt-BR').format(Math.round(num))
  }

  const formatTimeAgo = (timestamp: string) => {
    const diff = Date.now() - new Date(timestamp).getTime()
    const minutes = Math.floor(diff / 60000)
    if (minutes < 60) return `${minutes}m atrás`
    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `${hours}h atrás`
    return `${Math.floor(hours / 24)}d atrás`
  }

  const getSeverityColor = (severity: 'critical' | 'warning' | 'info') => {
    switch (severity) {
      case 'critical':
        return 'destructive'
      case 'warning':
        return 'secondary'
      case 'info':
        return 'outline'
    }
  }

  const getStatusColor = (status: 'up' | 'down' | 'degraded') => {
    switch (status) {
      case 'up':
        return 'bg-green-500'
      case 'down':
        return 'bg-red-500'
      case 'degraded':
        return 'bg-yellow-500'
    }
  }

  const getHealthStatusColor = (status: 'healthy' | 'degraded' | 'unhealthy') => {
    switch (status) {
      case 'healthy':
        return 'default'
      case 'degraded':
        return 'secondary'
      case 'unhealthy':
        return 'destructive'
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center h-64">
          <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Analytics Dashboard</h1>
          <p className="text-muted-foreground">
            Monitor de performance e saúde do sistema
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {/* Time Range Selector */}
          <div className="flex gap-1 bg-muted p-1 rounded-lg">
            {(['24h', '7d', '30d'] as TimeRange[]).map((range) => (
              <Button
                key={range}
                variant={timeRange === range ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setTimeRange(range)}
              >
                {range}
              </Button>
            ))}
          </div>

          {/* Refresh Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            Atualizar
          </Button>

          {/* Export Button */}
          <Button variant="outline" size="sm" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
        </div>
      </div>

      {/* Last Refresh Info */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Clock className="h-4 w-4" />
        Última atualização: {lastRefresh.toLocaleTimeString('pt-BR')}
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Visualizações de Página</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(getPageViewsByRange())}</div>
            <p className="text-xs text-muted-foreground">
              Últimas {timeRange === '24h' ? '24 horas' : timeRange === '7d' ? '7 dias' : '30 dias'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Visitantes Únicos</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(getUniqueVisitorsByRange())}</div>
            <p className="text-xs text-muted-foreground">
              Últimas {timeRange === '24h' ? '24 horas' : timeRange === '7d' ? '7 dias' : '30 dias'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Conversão (Leads)</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData?.conversionRates.leads}%</div>
            <p className="text-xs text-muted-foreground">Visitantes para leads</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Conversão (Pagamentos)</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData?.conversionRates.payments}%</div>
            <p className="text-xs text-muted-foreground">Leads para pagamentos</p>
          </CardContent>
        </Card>
      </div>

      {/* Middle Row */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Top Pages */}
        <Card>
          <CardHeader>
            <CardTitle>Top Páginas</CardTitle>
            <CardDescription>
              Páginas mais visitadas ({timeRange})
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analyticsData?.topPages.map((page, index) => {
                const maxViews = analyticsData.topPages[0].views
                const percentage = (page.views / maxViews) * 100

                return (
                  <div key={page.path} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-muted-foreground">
                          #{index + 1}
                        </span>
                        <span className="text-sm font-medium">{page.path}</span>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {formatNumber(page.views)} views
                      </span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {formatNumber(page.uniqueVisitors)} visitantes únicos
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Error Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              Resumo de Erros
            </CardTitle>
            <CardDescription>
              Erros e alertas do sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Error Stats */}
              <div className="grid grid-cols-4 gap-2">
                <div className="text-center p-2 bg-muted rounded-lg">
                  <div className="text-lg font-bold">{errorSummary?.total}</div>
                  <div className="text-xs text-muted-foreground">Total</div>
                </div>
                <div className="text-center p-2 bg-red-50 dark:bg-red-950 rounded-lg">
                  <div className="text-lg font-bold text-red-600">{errorSummary?.critical}</div>
                  <div className="text-xs text-muted-foreground">Críticos</div>
                </div>
                <div className="text-center p-2 bg-yellow-50 dark:bg-yellow-950 rounded-lg">
                  <div className="text-lg font-bold text-yellow-600">{errorSummary?.warning}</div>
                  <div className="text-xs text-muted-foreground">Avisos</div>
                </div>
                <div className="text-center p-2 bg-blue-50 dark:bg-blue-950 rounded-lg">
                  <div className="text-lg font-bold text-blue-600">{errorSummary?.info}</div>
                  <div className="text-xs text-muted-foreground">Info</div>
                </div>
              </div>

              {/* Recent Errors */}
              <div className="space-y-3">
                <h4 className="text-sm font-medium">Erros Recentes</h4>
                {errorSummary?.recentErrors.map((error) => (
                  <div
                    key={error.id}
                    className="flex items-start justify-between p-2 bg-muted/50 rounded-lg"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Badge variant={getSeverityColor(error.severity)}>
                          {error.severity}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {formatTimeAgo(error.timestamp)}
                        </span>
                      </div>
                      <p className="text-sm">{error.message}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* API Health Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Status de Saúde da API
          </CardTitle>
          <CardDescription>
            Monitoramento em tempo real dos serviços
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Overall Status */}
            <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-3">
                <div
                  className={`h-3 w-3 rounded-full ${
                    healthStatus?.status === 'healthy'
                      ? 'bg-green-500'
                      : healthStatus?.status === 'degraded'
                      ? 'bg-yellow-500'
                      : 'bg-red-500'
                  }`}
                />
                <span className="font-medium">Status Geral</span>
              </div>
              <div className="flex items-center gap-4">
                <Badge variant={getHealthStatusColor(healthStatus?.status || 'healthy')}>
                  {healthStatus?.status === 'healthy'
                    ? 'Saudável'
                    : healthStatus?.status === 'degraded'
                    ? 'Degradado'
                    : 'Indisponível'}
                </Badge>
                <span className="text-sm text-muted-foreground">
                  Uptime: {healthStatus?.uptime}%
                </span>
              </div>
            </div>

            {/* Services */}
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
              {healthStatus?.services.map((service) => (
                <div
                  key={service.name}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex items-center gap-2">
                    <div className={`h-2 w-2 rounded-full ${getStatusColor(service.status)}`} />
                    <span className="text-sm font-medium">{service.name}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">{service.responseTime}ms</div>
                    <div className="text-xs text-muted-foreground">
                      {service.status === 'up'
                        ? 'Online'
                        : service.status === 'degraded'
                        ? 'Lento'
                        : 'Offline'}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Response Time Chart */}
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Tempo de Resposta dos Serviços</h4>
              <div className="space-y-3">
                {healthStatus?.services.map((service) => {
                  const maxResponseTime = Math.max(...(healthStatus?.services.map(s => s.responseTime) || [1]))
                  const percentage = (service.responseTime / maxResponseTime) * 100

                  return (
                    <div key={service.name} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>{service.name}</span>
                        <span className="text-muted-foreground">{service.responseTime}ms</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all duration-500 ${
                            service.responseTime < 100
                              ? 'bg-green-500'
                              : service.responseTime < 500
                              ? 'bg-yellow-500'
                              : 'bg-red-500'
                          }`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
