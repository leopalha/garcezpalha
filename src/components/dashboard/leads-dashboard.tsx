/**
 * Leads Dashboard
 * Main dashboard with charts and visualizations
 */

'use client'

import { useEffect, useState } from 'react'
import { BarChart3, PieChart, Activity } from 'lucide-react'
import { EmptyState } from '@/components/ui/empty-state'

interface DashboardData {
  categoryDistribution: {
    hot: number
    warm: number
    cold: number
    unqualified: number
  }
  conversionFunnel: {
    started: number
    qualified: number
    proposal: number
    payment: number
    converted: number
  }
  recentActivity: Array<{
    id: string
    type: string
    description: string
    timestamp: string
  }>
}

export function LeadsDashboard() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  async function fetchDashboardData() {
    try {
      const response = await fetch('/api/admin/leads/dashboard')
      if (response.ok) {
        const dashboardData = await response.json()
        setData(dashboardData)
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading || !data) {
    return <DashboardSkeleton />
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      {/* Category Distribution */}
      <CategoryDistributionChart data={data.categoryDistribution} />

      {/* Conversion Funnel */}
      <ConversionFunnelChart data={data.conversionFunnel} />

      {/* Recent Activity */}
      <RecentActivityList activity={data.recentActivity} />
    </div>
  )
}

function CategoryDistributionChart({ data }: { data: DashboardData['categoryDistribution'] }) {
  const total = data.hot + data.warm + data.cold + data.unqualified
  const percentages = {
    hot: ((data.hot / total) * 100).toFixed(1),
    warm: ((data.warm / total) * 100).toFixed(1),
    cold: ((data.cold / total) * 100).toFixed(1),
    unqualified: ((data.unqualified / total) * 100).toFixed(1),
  }

  const categories = [
    { name: 'Hot', value: data.hot, percentage: percentages.hot, color: 'bg-red-500' },
    { name: 'Warm', value: data.warm, percentage: percentages.warm, color: 'bg-yellow-500' },
    { name: 'Cold', value: data.cold, percentage: percentages.cold, color: 'bg-blue-500' },
    { name: 'Unqualified', value: data.unqualified, percentage: percentages.unqualified, color: 'bg-gray-400' },
  ]

  return (
    <div className="rounded-lg bg-white p-6 shadow dark:bg-gray-800">
      <div className="mb-4 flex items-center gap-2">
        <PieChart className="h-5 w-5 text-gray-600 dark:text-gray-400" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Distribuição por Categoria
        </h3>
      </div>

      <div className="space-y-4">
        {categories.map((category) => (
          <div key={category.name}>
            <div className="mb-1 flex items-center justify-between text-sm">
              <span className="font-medium text-gray-700 dark:text-gray-300">{category.name}</span>
              <span className="text-gray-600 dark:text-gray-400">
                {category.value} ({category.percentage}%)
              </span>
            </div>
            <div className="h-2 w-full rounded-full bg-gray-200 dark:bg-gray-700">
              <div
                className={`h-2 rounded-full ${category.color}`}
                style={{ width: `${category.percentage}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function ConversionFunnelChart({ data }: { data: DashboardData['conversionFunnel'] }) {
  const stages = [
    { name: 'Iniciados', value: data.started, percentage: 100 },
    { name: 'Qualificados', value: data.qualified, percentage: (data.qualified / data.started) * 100 },
    { name: 'Proposta Enviada', value: data.proposal, percentage: (data.proposal / data.started) * 100 },
    { name: 'Pagamento', value: data.payment, percentage: (data.payment / data.started) * 100 },
    { name: 'Convertidos', value: data.converted, percentage: (data.converted / data.started) * 100 },
  ]

  return (
    <div className="rounded-lg bg-white p-6 shadow dark:bg-gray-800">
      <div className="mb-4 flex items-center gap-2">
        <BarChart3 className="h-5 w-5 text-gray-600 dark:text-gray-400" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Funil de Conversão
        </h3>
      </div>

      <div className="space-y-3">
        {stages.map((stage, index) => (
          <div key={stage.name} className="relative">
            <div className="mb-1 flex items-center justify-between text-sm">
              <span className="font-medium text-gray-700 dark:text-gray-300">{stage.name}</span>
              <span className="text-gray-600 dark:text-gray-400">
                {stage.value} ({stage.percentage.toFixed(1)}%)
              </span>
            </div>
            <div className="h-8 rounded-lg bg-gray-200 dark:bg-gray-700">
              <div
                className="flex h-full items-center rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 px-3 text-xs font-semibold text-white transition-all"
                style={{ width: `${Math.max(stage.percentage, 10)}%` }}
              >
                {stage.percentage >= 20 && `${stage.percentage.toFixed(0)}%`}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 rounded-lg bg-blue-50 p-3 dark:bg-blue-900/20">
        <p className="text-sm text-blue-900 dark:text-blue-200">
          <strong>Taxa de Conversão:</strong> {((data.converted / data.started) * 100).toFixed(1)}%
        </p>
      </div>
    </div>
  )
}

function RecentActivityList({ activity }: { activity: DashboardData['recentActivity'] }) {
  return (
    <div className="rounded-lg bg-white p-6 shadow dark:bg-gray-800 lg:col-span-2">
      <div className="mb-4 flex items-center gap-2">
        <Activity className="h-5 w-5 text-gray-600 dark:text-gray-400" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Atividade Recente
        </h3>
      </div>

      {activity.length === 0 ? (
        <EmptyState
          icon={Activity}
          title="Nenhuma atividade recente"
          description="Atividades aparecerão aqui quando houver interações com seus leads"
        />
      ) : (
        <div className="space-y-3">
          {activity.map((item) => (
            <div
              key={item.id}
              className="flex items-start gap-3 rounded-lg border border-gray-200 p-3 dark:border-gray-700"
            >
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {item.description}
                </p>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  {new Date(item.timestamp).toLocaleString('pt-BR')}
                </p>
              </div>
              <span className={`rounded-full px-2 py-1 text-xs font-medium ${getActivityTypeBadge(item.type)}`}>
                {item.type}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function getActivityTypeBadge(type: string): string {
  const badges: Record<string, string> = {
    started: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
    qualified: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
    proposal: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400',
    converted: 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400',
  }
  return badges[type] || 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
}

function DashboardSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      {[1, 2].map((i) => (
        <div
          key={i}
          className="animate-pulse rounded-lg bg-white p-6 shadow dark:bg-gray-800"
        >
          <div className="h-4 w-32 rounded bg-gray-200 dark:bg-gray-700" />
          <div className="mt-4 h-64 rounded bg-gray-200 dark:bg-gray-700" />
        </div>
      ))}
    </div>
  )
}
