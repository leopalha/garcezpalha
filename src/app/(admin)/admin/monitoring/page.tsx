'use client'

/**
 * Monitoring Dashboard
 * Real-time monitoring of API performance, errors, and business metrics
 */

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Activity, AlertTriangle, CheckCircle, TrendingUp, Clock, Zap } from 'lucide-react'

export default function MonitoringDashboard() {
  // Simulated monitoring data (in production, fetch from real monitoring API)
  const apiMetrics = [
    {
      endpoint: '/api/contact',
      avgDuration: 145,
      requests24h: 234,
      errors24h: 2,
      successRate: 99.1,
      status: 'healthy' as const,
    },
    {
      endpoint: '/api/chat/agent-flow',
      avgDuration: 892,
      requests24h: 1567,
      errors24h: 12,
      successRate: 99.2,
      status: 'healthy' as const,
    },
    {
      endpoint: '/api/whatsapp-cloud/webhook',
      avgDuration: 234,
      requests24h: 3421,
      errors24h: 5,
      successRate: 99.8,
      status: 'healthy' as const,
    },
    {
      endpoint: '/api/mercadopago/webhook',
      avgDuration: 456,
      requests24h: 89,
      errors24h: 0,
      successRate: 100,
      status: 'healthy' as const,
    },
    {
      endpoint: '/api/admin/leads/qualified',
      avgDuration: 312,
      requests24h: 156,
      errors24h: 1,
      successRate: 99.3,
      status: 'healthy' as const,
    },
  ]

  const businessMetrics = {
    leads24h: 234,
    conversions24h: 45,
    conversionRate: 19.2,
    revenue24h: 125000,
  }

  const recentErrors = [
    {
      id: 1,
      endpoint: '/api/chat/agent-flow',
      error: 'Timeout connecting to OpenAI',
      timestamp: '2026-01-01 02:45:12',
      severity: 'warning' as const,
    },
    {
      id: 2,
      endpoint: '/api/contact',
      error: 'Validation error: invalid email',
      timestamp: '2026-01-01 01:23:45',
      severity: 'info' as const,
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Monitoring Dashboard</h1>
        <p className="text-muted-foreground">
          Real-time monitoring of system health and performance
        </p>
      </div>

      {/* System Status */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Requests (24h)</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {apiMetrics.reduce((sum, m) => sum + m.requests24h, 0).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">Across all endpoints</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Health</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">99.7%</div>
            <p className="text-xs text-muted-foreground">Average success rate</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Response Time</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">387ms</div>
            <p className="text-xs text-muted-foreground">Across monitored APIs</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Errors (24h)</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {apiMetrics.reduce((sum, m) => sum + m.errors24h, 0)}
            </div>
            <p className="text-xs text-muted-foreground">Low error rate</p>
          </CardContent>
        </Card>
      </div>

      {/* Business Metrics */}
      <Card>
        <CardHeader>
          <CardTitle>Business Metrics (24h)</CardTitle>
          <CardDescription>Key performance indicators</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Leads</p>
              <p className="text-2xl font-bold">{businessMetrics.leads24h}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Conversions</p>
              <p className="text-2xl font-bold">{businessMetrics.conversions24h}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Conversion Rate</p>
              <p className="text-2xl font-bold flex items-center gap-1">
                {businessMetrics.conversionRate}%
                <TrendingUp className="h-4 w-4 text-green-600" />
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Revenue</p>
              <p className="text-2xl font-bold">
                R$ {(businessMetrics.revenue24h / 100).toLocaleString('pt-BR', {
                  minimumFractionDigits: 2,
                })}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* API Endpoints Performance */}
      <Card>
        <CardHeader>
          <CardTitle>API Endpoints Performance</CardTitle>
          <CardDescription>Monitored endpoints with real-time metrics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {apiMetrics.map((metric) => (
              <div
                key={metric.endpoint}
                className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
              >
                <div className="flex-1">
                  <p className="font-mono text-sm font-medium">{metric.endpoint}</p>
                  <div className="flex gap-4 mt-1 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {metric.avgDuration}ms avg
                    </span>
                    <span>{metric.requests24h.toLocaleString()} requests</span>
                    <span className="text-red-600">{metric.errors24h} errors</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={metric.successRate >= 99 ? 'default' : 'destructive'}>
                    {metric.successRate}% success
                  </Badge>
                  <Badge
                    variant={metric.status === 'healthy' ? 'default' : 'destructive'}
                    className="bg-green-600"
                  >
                    {metric.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Errors */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Errors</CardTitle>
          <CardDescription>Latest errors and warnings from monitored endpoints</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentErrors.map((error) => (
              <Alert key={error.id} variant={error.severity === 'warning' ? 'destructive' : 'default'}>
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle className="font-mono text-sm">{error.endpoint}</AlertTitle>
                <AlertDescription>
                  <p>{error.error}</p>
                  <p className="text-xs text-muted-foreground mt-1">{error.timestamp}</p>
                </AlertDescription>
              </Alert>
            ))}
            {recentErrors.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">
                No recent errors. System running smoothly! 🎉
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Monitoring Coverage */}
      <Card>
        <CardHeader>
          <CardTitle>Monitoring Coverage</CardTitle>
          <CardDescription>APIs with integrated monitoring</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2 md:grid-cols-2">
            <div>
              <p className="text-sm font-medium mb-2">Core APIs (14/14 monitored)</p>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>✅ Contact Form</li>
                <li>✅ Chat Agent Flow</li>
                <li>✅ Chat Assistant</li>
                <li>✅ WhatsApp Webhook</li>
                <li>✅ Mercado Pago Webhook</li>
                <li>✅ Stripe Webhook</li>
                <li>✅ User Signup</li>
              </ul>
            </div>
            <div>
              <p className="text-sm font-medium mb-2">Business APIs</p>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>✅ Qualified Leads</li>
                <li>✅ Document Generation</li>
                <li>✅ Follow-ups Processing</li>
                <li>✅ Analytics Overview</li>
                <li>✅ Admin APIs</li>
                <li>✅ Authentication</li>
                <li>✅ Webhooks</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
