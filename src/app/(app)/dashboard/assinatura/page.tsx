'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  DollarSign,
  CreditCard,
  Calendar,
  Download,
  CheckCircle,
  XCircle,
  Clock,
  TrendingUp,
  Package,
  Zap,
  Crown,
  ArrowRight,
  AlertCircle,
  FileText,
  Receipt,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import Link from 'next/link'

type PlanId = 'starter' | 'pro' | 'enterprise'
type BillingCycle = 'monthly' | 'yearly'
type PaymentStatus = 'active' | 'past_due' | 'canceled' | 'trialing'

interface CurrentPlan {
  id: PlanId
  name: string
  price: number
  billingCycle: BillingCycle
  status: PaymentStatus
  nextBillingDate: string
  cancelAtPeriodEnd: boolean
  trialEndsAt: string | null
}

interface Invoice {
  id: string
  date: string
  amount: number
  status: 'paid' | 'pending' | 'failed'
  description: string
  invoiceUrl: string
}

interface UsageStats {
  products: { current: number; limit: number }
  agents: { current: number; limit: number }
  conversations: { current: number; limit: number }
  storage: { current: number; limit: number }
}

const mockCurrentPlan: CurrentPlan = {
  id: 'pro',
  name: 'Pro',
  price: 99700,
  billingCycle: 'monthly',
  status: 'active',
  nextBillingDate: '2024-02-15',
  cancelAtPeriodEnd: false,
  trialEndsAt: null,
}

const mockInvoices: Invoice[] = [
  {
    id: 'INV-2024-001',
    date: '2024-01-15',
    amount: 99700,
    status: 'paid',
    description: 'Plano Pro - Janeiro 2024',
    invoiceUrl: '#',
  },
  {
    id: 'INV-2023-012',
    date: '2023-12-15',
    amount: 99700,
    status: 'paid',
    description: 'Plano Pro - Dezembro 2023',
    invoiceUrl: '#',
  },
  {
    id: 'INV-2023-011',
    date: '2023-11-15',
    amount: 99700,
    status: 'paid',
    description: 'Plano Pro - Novembro 2023',
    invoiceUrl: '#',
  },
  {
    id: 'INV-2023-010',
    date: '2023-10-15',
    amount: 49700,
    status: 'paid',
    description: 'Plano Starter - Outubro 2023',
    invoiceUrl: '#',
  },
]

const mockUsage: UsageStats = {
  products: { current: 12, limit: -1 }, // -1 = unlimited
  agents: { current: 3, limit: 3 },
  conversations: { current: 847, limit: 5000 },
  storage: { current: 2.4, limit: 10 }, // GB
}

const plans = [
  {
    id: 'starter' as PlanId,
    name: 'Starter',
    price: 49700,
    yearlyPrice: 497000,
    features: [
      '1 Agent IA Especializado',
      'Até 10 produtos',
      '100 conversas IA/mês',
      '2 GB de armazenamento',
      'Suporte por email',
    ],
    limitations: ['Sem white-label', 'Sem VSL'],
  },
  {
    id: 'pro' as PlanId,
    name: 'Pro',
    price: 99700,
    yearlyPrice: 997000,
    popular: true,
    features: [
      '3 Agents IA Especializados',
      'Produtos ilimitados',
      '5.000 conversas IA/mês',
      '10 GB de armazenamento',
      'White-label completo',
      'VSL e landing pages avançadas',
      'Suporte prioritário',
    ],
    limitations: [],
  },
  {
    id: 'enterprise' as PlanId,
    name: 'Enterprise',
    price: 249700,
    yearlyPrice: 2497000,
    features: [
      'Agents IA ilimitados',
      'Produtos ilimitados',
      'Conversas IA ilimitadas',
      '100 GB de armazenamento',
      'White-label + marca removida',
      'API access',
      'Suporte 24/7 dedicado',
      'Treinamento personalizado',
    ],
    limitations: [],
  },
]

const statusConfig: Record<
  PaymentStatus,
  { label: string; color: string; icon: React.ElementType }
> = {
  active: { label: 'Ativa', color: 'text-green-600', icon: CheckCircle },
  past_due: { label: 'Vencida', color: 'text-red-600', icon: AlertCircle },
  canceled: { label: 'Cancelada', color: 'text-gray-600', icon: XCircle },
  trialing: { label: 'Trial', color: 'text-blue-600', icon: Clock },
}

export default function AssinaturaPage() {
  const [billingCycle, setBillingCycle] = useState<BillingCycle>('monthly')

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value / 100)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    })
  }

  const getUsagePercent = (current: number, limit: number) => {
    if (limit === -1) return 0 // unlimited
    return (current / limit) * 100
  }

  const StatusIcon = statusConfig[mockCurrentPlan.status].icon

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Assinatura & Pagamentos</h1>
          <p className="text-muted-foreground mt-1">
            Gerencie seu plano, pagamentos e faturas
          </p>
        </div>
      </div>

      {/* Current Plan Status */}
      <Card className="border-2 border-primary">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Plano Atual
              </CardTitle>
              <CardDescription>Seu plano e status de pagamento</CardDescription>
            </div>
            <Badge
              variant="secondary"
              className={cn('text-sm', statusConfig[mockCurrentPlan.status].color)}
            >
              <StatusIcon className="h-3 w-3 mr-1" />
              {statusConfig[mockCurrentPlan.status].label}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Plano</p>
              <p className="text-2xl font-bold">{mockCurrentPlan.name}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Valor</p>
              <p className="text-2xl font-bold">{formatCurrency(mockCurrentPlan.price)}</p>
              <p className="text-xs text-muted-foreground">por mês</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Próximo Pagamento</p>
              <p className="text-lg font-semibold">
                {formatDate(mockCurrentPlan.nextBillingDate)}
              </p>
            </div>
            <div className="flex items-end">
              <Button variant="outline" className="w-full">
                <CreditCard className="h-4 w-4 mr-2" />
                Atualizar Cartão
              </Button>
            </div>
          </div>

          {mockCurrentPlan.cancelAtPeriodEnd && (
            <div className="mt-6 bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-yellow-600" />
                <p className="text-sm font-medium text-yellow-900 dark:text-yellow-100">
                  Sua assinatura será cancelada em {formatDate(mockCurrentPlan.nextBillingDate)}
                </p>
              </div>
              <p className="text-xs text-yellow-700 dark:text-yellow-300 mt-1 ml-7">
                Você ainda pode usar todos os recursos até essa data. Renove para continuar.
              </p>
              <Button size="sm" className="mt-3 ml-7">
                Reativar Assinatura
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Usage Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Uso do Plano
          </CardTitle>
          <CardDescription>Acompanhe o uso dos recursos inclusos</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Products */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Package className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Produtos</span>
                </div>
                <span className="text-sm text-muted-foreground">
                  {mockUsage.products.current}
                  {mockUsage.products.limit === -1 ? ' / ilimitado' : ` / ${mockUsage.products.limit}`}
                </span>
              </div>
              {mockUsage.products.limit !== -1 && (
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className={cn(
                      'h-2 rounded-full transition-all',
                      getUsagePercent(mockUsage.products.current, mockUsage.products.limit) >= 90
                        ? 'bg-red-500'
                        : getUsagePercent(mockUsage.products.current, mockUsage.products.limit) >= 70
                          ? 'bg-yellow-500'
                          : 'bg-green-500'
                    )}
                    style={{
                      width: `${getUsagePercent(mockUsage.products.current, mockUsage.products.limit)}%`,
                    }}
                  />
                </div>
              )}
            </div>

            {/* Agents */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Agents IA</span>
                </div>
                <span className="text-sm text-muted-foreground">
                  {mockUsage.agents.current} / {mockUsage.agents.limit}
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className={cn(
                    'h-2 rounded-full transition-all',
                    getUsagePercent(mockUsage.agents.current, mockUsage.agents.limit) >= 90
                      ? 'bg-red-500'
                      : getUsagePercent(mockUsage.agents.current, mockUsage.agents.limit) >= 70
                        ? 'bg-yellow-500'
                        : 'bg-blue-500'
                  )}
                  style={{
                    width: `${getUsagePercent(mockUsage.agents.current, mockUsage.agents.limit)}%`,
                  }}
                />
              </div>
            </div>

            {/* Conversations */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Conversas IA (este mês)</span>
                </div>
                <span className="text-sm text-muted-foreground">
                  {mockUsage.conversations.current} / {mockUsage.conversations.limit.toLocaleString('pt-BR')}
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-purple-500 h-2 rounded-full transition-all"
                  style={{
                    width: `${getUsagePercent(mockUsage.conversations.current, mockUsage.conversations.limit)}%`,
                  }}
                />
              </div>
            </div>

            {/* Storage */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Download className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Armazenamento</span>
                </div>
                <span className="text-sm text-muted-foreground">
                  {mockUsage.storage.current} GB / {mockUsage.storage.limit} GB
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-yellow-500 h-2 rounded-full transition-all"
                  style={{
                    width: `${getUsagePercent(mockUsage.storage.current, mockUsage.storage.limit)}%`,
                  }}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Available Plans */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Planos Disponíveis</h2>
          <div className="flex items-center gap-2 bg-muted rounded-lg p-1">
            <Button
              variant={billingCycle === 'monthly' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setBillingCycle('monthly')}
            >
              Mensal
            </Button>
            <Button
              variant={billingCycle === 'yearly' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setBillingCycle('yearly')}
            >
              Anual
              <Badge variant="secondary" className="ml-2 bg-green-100 text-green-700">
                -20%
              </Badge>
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan) => {
            const price = billingCycle === 'monthly' ? plan.price : plan.yearlyPrice / 12
            const isCurrentPlan = plan.id === mockCurrentPlan.id

            return (
              <Card
                key={plan.id}
                className={cn(
                  'relative',
                  plan.popular && 'border-2 border-primary',
                  isCurrentPlan && 'bg-muted/50'
                )}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge className="bg-primary text-primary-foreground">
                      <Crown className="h-3 w-3 mr-1" />
                      Mais Popular
                    </Badge>
                  </div>
                )}

                <CardHeader>
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <div className="mt-4">
                    <span className="text-4xl font-bold">{formatCurrency(price)}</span>
                    <span className="text-muted-foreground">/mês</span>
                  </div>
                  {billingCycle === 'yearly' && (
                    <p className="text-sm text-muted-foreground">
                      Cobrado anualmente: {formatCurrency(plan.yearlyPrice)}
                    </p>
                  )}
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    {plan.features.map((feature, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                    {plan.limitations.map((limitation, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <XCircle className="h-4 w-4 text-gray-400 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-muted-foreground">{limitation}</span>
                      </div>
                    ))}
                  </div>

                  {isCurrentPlan ? (
                    <Button variant="outline" className="w-full" disabled>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Plano Atual
                    </Button>
                  ) : (
                    <Button className="w-full" asChild>
                      <Link href={`/app/checkout?plan=${plan.id}&cycle=${billingCycle}`}>
                        {plan.id === 'enterprise' ? 'Falar com Vendas' : 'Fazer Upgrade'}
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Link>
                    </Button>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>

      {/* Invoices */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Receipt className="h-5 w-5" />
                Histórico de Faturas
              </CardTitle>
              <CardDescription>Todas as suas faturas e recibos</CardDescription>
            </div>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Exportar Todas
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {mockInvoices.map((invoice) => (
              <div
                key={invoice.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={cn(
                      'h-10 w-10 rounded-full flex items-center justify-center',
                      invoice.status === 'paid'
                        ? 'bg-green-100 dark:bg-green-900/30'
                        : invoice.status === 'pending'
                          ? 'bg-yellow-100 dark:bg-yellow-900/30'
                          : 'bg-red-100 dark:bg-red-900/30'
                    )}
                  >
                    {invoice.status === 'paid' ? (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    ) : invoice.status === 'pending' ? (
                      <Clock className="h-5 w-5 text-yellow-600" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-600" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium">{invoice.description}</p>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <span>{invoice.id}</span>
                      <span>•</span>
                      <span>{formatDate(invoice.date)}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <p className="text-lg font-semibold">{formatCurrency(invoice.amount)}</p>
                  <Button variant="ghost" size="sm" asChild>
                    <a href={invoice.invoiceUrl} target="_blank" rel="noopener noreferrer">
                      <Download className="h-4 w-4" />
                    </a>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-red-200 dark:border-red-800">
        <CardHeader>
          <CardTitle className="text-red-600 flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            Zona de Perigo
          </CardTitle>
          <CardDescription>Ações irreversíveis relacionadas à sua conta</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 border border-red-200 dark:border-red-800 rounded-lg">
            <div>
              <p className="font-medium">Cancelar Assinatura</p>
              <p className="text-sm text-muted-foreground">
                Você perderá acesso aos recursos premium ao fim do período de cobrança
              </p>
            </div>
            <Button variant="destructive" size="sm">
              Cancelar
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
