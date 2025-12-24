'use client'

import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

interface LeadsTimeSeriesData {
  date: string
  total: number
  hot: number
  warm: number
  cold: number
  converted: number
}

interface CategoryDistributionData {
  name: string
  value: number
  percentage: number
}

interface LeadsChartProps {
  data: LeadsTimeSeriesData[]
  type?: 'line' | 'bar'
}

interface CategoryChartProps {
  data: CategoryDistributionData[]
}

const COLORS = {
  hot: '#ef4444', // red-500
  warm: '#f59e0b', // amber-500
  cold: '#3b82f6', // blue-500
  veryCold: '#6b7280', // gray-500
  converted: '#10b981', // green-500
}

const PIE_COLORS = ['#ef4444', '#f59e0b', '#3b82f6', '#6b7280']

export function LeadsTimeSeriesChart({ data, type = 'line' }: LeadsChartProps) {
  const ChartComponent = type === 'line' ? LineChart : BarChart

  return (
    <ResponsiveContainer width="100%" height={350}>
      <ChartComponent data={data}>
        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
        <XAxis
          dataKey="date"
          className="text-xs"
          tick={{ fill: 'currentColor' }}
        />
        <YAxis className="text-xs" tick={{ fill: 'currentColor' }} />
        <Tooltip
          contentStyle={{
            backgroundColor: 'hsl(var(--background))',
            border: '1px solid hsl(var(--border))',
            borderRadius: '8px',
          }}
        />
        <Legend />
        {type === 'line' ? (
          <>
            <Line
              type="monotone"
              dataKey="total"
              stroke="hsl(var(--primary))"
              strokeWidth={2}
              name="Total"
            />
            <Line
              type="monotone"
              dataKey="hot"
              stroke={COLORS.hot}
              strokeWidth={2}
              name="Hot"
            />
            <Line
              type="monotone"
              dataKey="warm"
              stroke={COLORS.warm}
              strokeWidth={2}
              name="Warm"
            />
            <Line
              type="monotone"
              dataKey="cold"
              stroke={COLORS.cold}
              strokeWidth={2}
              name="Cold"
            />
            <Line
              type="monotone"
              dataKey="converted"
              stroke={COLORS.converted}
              strokeWidth={2}
              name="Converted"
              strokeDasharray="5 5"
            />
          </>
        ) : (
          <>
            <Bar dataKey="hot" fill={COLORS.hot} name="Hot" />
            <Bar dataKey="warm" fill={COLORS.warm} name="Warm" />
            <Bar dataKey="cold" fill={COLORS.cold} name="Cold" />
            <Bar dataKey="converted" fill={COLORS.converted} name="Converted" />
          </>
        )}
      </ChartComponent>
    </ResponsiveContainer>
  )
}

export function CategoryDistributionChart({ data }: CategoryChartProps) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data as any}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={(props: any) => `${props.name}: ${props.percentage}%`}
          outerRadius={100}
          fill="#8884d8"
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            backgroundColor: 'hsl(var(--background))',
            border: '1px solid hsl(var(--border))',
            borderRadius: '8px',
          }}
        />
      </PieChart>
    </ResponsiveContainer>
  )
}

interface ConversionFunnelData {
  stage: string
  count: number
  percentage: number
}

interface ConversionFunnelChartProps {
  data: ConversionFunnelData[]
}

export function ConversionFunnelChart({ data }: ConversionFunnelChartProps) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart
        data={data}
        layout="vertical"
        margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
        <XAxis type="number" className="text-xs" />
        <YAxis
          dataKey="stage"
          type="category"
          className="text-xs"
          tick={{ fill: 'currentColor' }}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: 'hsl(var(--background))',
            border: '1px solid hsl(var(--border))',
            borderRadius: '8px',
          }}
          formatter={(value: any, name: any, props: any) => [
            `${value} (${props?.payload?.percentage || 0}%)`,
            'Count',
          ]}
        />
        <Bar dataKey="count" fill="hsl(var(--primary))">
          {data.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={`hsl(var(--primary) / ${1 - index * 0.15})`}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}
