/**
 * Lead Statistics Cards
 * Display key metrics for lead qualification pipeline
 */

'use client'

import { useEffect, useState } from 'react'
import { TrendingUp, Users, DollarSign, CheckCircle } from 'lucide-react'

interface LeadStats {
  total: number
  hot: number
  warm: number
  cold: number
  converted: number
  totalValue: number
  conversionRate: number
  avgScore: number
}

export function LeadStatsCards() {
  const [stats, setStats] = useState<LeadStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  async function fetchStats() {
    try {
      const response = await fetch('/api/admin/leads/stats')
      if (response.ok) {
        const data = await response.json()
        setStats(data)
      }
    } catch (error) {
      console.error('Error fetching lead stats:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading || !stats) {
    return <StatsCardsSkeleton />
  }

  const cards: StatCardProps[] = [
    {
      title: 'Total de Leads',
      value: stats.total.toString(),
      change: '+12% este mês',
      trend: 'up' as const,
      icon: Users,
      color: 'blue' as const,
    },
    {
      title: 'Hot Leads',
      value: stats.hot.toString(),
      subtitle: `${stats.warm} warm | ${stats.cold} cold`,
      icon: TrendingUp,
      color: 'red' as const,
    },
    {
      title: 'Taxa de Conversão',
      value: `${stats.conversionRate.toFixed(1)}%`,
      change: '+3.2% vs mês anterior',
      trend: 'up' as const,
      icon: CheckCircle,
      color: 'green' as const,
    },
    {
      title: 'Valor Estimado',
      value: `R$ ${(stats.totalValue / 100).toLocaleString('pt-BR')}`,
      subtitle: `${stats.converted} convertidos`,
      icon: DollarSign,
      color: 'yellow' as const,
    },
  ]

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card, index) => (
        <StatCard key={index} {...card} />
      ))}
    </div>
  )
}

interface StatCardProps {
  title: string
  value: string
  subtitle?: string
  change?: string
  trend?: 'up' | 'down'
  icon: React.ComponentType<{ className?: string }>
  color: 'blue' | 'red' | 'green' | 'yellow'
}

function StatCard({ title, value, subtitle, change, trend, icon: Icon, color }: StatCardProps) {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400',
    red: 'bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400',
    green: 'bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400',
    yellow: 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-400',
  }

  return (
    <div className="rounded-lg bg-white p-6 shadow transition-shadow hover:shadow-md dark:bg-gray-800">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
          <p className="mt-2 text-3xl font-semibold text-gray-900 dark:text-white">{value}</p>
          {subtitle && (
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{subtitle}</p>
          )}
          {change && (
            <p
              className={`mt-2 text-sm ${
                trend === 'up' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
              }`}
            >
              {change}
            </p>
          )}
        </div>
        <div className={`rounded-lg p-3 ${colorClasses[color]}`}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </div>
  )
}

function StatsCardsSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {[1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className="animate-pulse rounded-lg bg-white p-6 shadow dark:bg-gray-800"
        >
          <div className="h-4 w-24 rounded bg-gray-200 dark:bg-gray-700" />
          <div className="mt-4 h-8 w-16 rounded bg-gray-200 dark:bg-gray-700" />
        </div>
      ))}
    </div>
  )
}
