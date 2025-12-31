'use client'

import { useState, useEffect } from 'react'
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
  Loader2,
  ExternalLink,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { useToast } from '@/components/ui/use-toast'

type PlanId = 'starter' | 'pro' | 'enterprise'
type BillingCycle = 'monthly' | 'yearly'
type PaymentStatus = 'active' | 'past_due' | 'canceled' | 'trialing'

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
  const { toast } = useToast()
  const [billingCycle, setBillingCycle] = useState<BillingCycle>('monthly')
  const [loading, setLoading] = useState(true)
  const [subscription, setSubscription] = useState<any>(null)
  const [usage, setUsage] = useState<any>(null)
  const [limits, setLimits] = useState<any>(null)
  const [invoices, setInvoices] = useState<any[]>([])
  const [canceling, setCanceling] = useState(false)

  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
    try {
      setLoading(true)

      // Fetch subscription and usage
      const [subRes, invoicesRes] = await Promise.all([
        fetch('/api/subscriptions/current'),
        fetch('/api/subscriptions/invoices'),
      ])

      if (subRes.ok) {
        const subData = await subRes.json()
        setSubscription(subData.subscription)
        setUsage(subData.usage)
        setLimits(subData.limits)
      }

      if (invoicesRes.ok) {
        const invoicesData = await invoicesRes.json()
        setInvoices(invoicesData.invoices || [])
      }
    } catch (error) {
      console.error('Error fetching data:', error)
      toast({
        title: 'Erro ao carregar dados',
        description: 'Não foi possível carregar os dados da assinatura.',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  async function handleCancelSubscription() {
    try {
      setCanceling(true)
      const res = await fetch('/api/subscriptions/cancel', {
        method: 'POST',
      })

      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.error || 'Failed to cancel')
      }

      const data = await res.json()
      toast({
        title: 'Assinatura cancelada',
        description: `Sua assinatura será cancelada em ${formatDate(data.cancel_at)}`,
      })

      await fetchData()
    } catch (error: any) {
      toast({
        title: 'Erro ao cancelar',
        description: error.message,
        variant: 'destructive',
      })
    } finally {
      setCanceling(false)
    }
  }

  async function handleReactivateSubscription() {
    try {
      setCanceling(true)
      const res = await fetch('/api/subscriptions/cancel', {
        method: 'DELETE',
      })

      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.error || 'Failed to reactivate')
      }

      toast({
        title: 'Assinatura reativada',
        description: 'Sua assinatura foi reativada com sucesso!',
      })

      await fetchData()
    } catch (error: any) {
      toast({
        title: 'Erro ao reativar',
        description: error.message,
        variant: 'destructive',
      })
    } finally {
      setCanceling(false)
    }
  }

  async function handleManagePayment() {
    try {
      const res = await fetch('/api/stripe/portal', {
        method: 'POST',
      })

      if (!res.ok) {
        throw new Error('Failed to create portal session')
      }

      const data = await res.json()
      window.location.href = data.url
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Não foi possível abrir o portal de pagamento.',
        variant: 'destructive',
      })
    }
  }

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
    if (limit === null || limit === -1) return 0 // unlimited
    return Math.min((current / limit) * 100, 100)
  }

  const currentPlan = subscription
    ? {
        id: subscription.plan_id,
        name:
          subscription.plan_id === 'starter'
            ? 'Starter'
            : subscription.plan_id === 'pro'
              ? 'Pro'
              : 'Enterprise',
        status: subscription.status,
        nextBillingDate: subscription.current_period_end,
        cancelAtPeriodEnd: subscription.cancel_at_period_end,
      }
    : null

  const StatusIcon = currentPlan
    ? statusConfig[currentPlan.status as PaymentStatus]?.icon || Clock
    : Clock

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

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
      {currentPlan ? (
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
                className={cn('text-sm', statusConfig[currentPlan.status as PaymentStatus].color)}
              >
                <StatusIcon className="h-3 w-3 mr-1" />
                {statusConfig[currentPlan.status as PaymentStatus].label}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Plano</p>
                <p className="text-2xl font-bold">{currentPlan.name}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Ciclo</p>
                <p className="text-lg font-semibold">
                  {subscription.billing_cycle === 'yearly' ? 'Anual' : 'Mensal'}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Próximo Pagamento</p>
                <p className="text-lg font-semibold">
                  {formatDate(currentPlan.nextBillingDate)}
                </p>
              </div>
              <div className="flex items-end">
                <Button variant="outline" className="w-full" onClick={handleManagePayment}>
                  <CreditCard className="h-4 w-4 mr-2" />
                  Gerenciar Pagamento
                </Button>
              </div>
            </div>

            {currentPlan.cancelAtPeriodEnd && (
              <div className="mt-6 bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-yellow-600" />
                  <p className="text-sm font-medium text-yellow-900 dark:text-yellow-100">
                    Sua assinatura será cancelada em {formatDate(currentPlan.nextBillingDate)}
                  </p>
                </div>
                <p className="text-xs text-yellow-700 dark:text-yellow-300 mt-1 ml-7">
                  Você ainda pode usar todos os recursos até essa data. Renove para continuar.
                </p>
                <Button
                  size="sm"
                  className="mt-3 ml-7"
                  onClick={handleReactivateSubscription}
                  disabled={canceling}
                >
                  {canceling ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Reativar Assinatura'}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      ) : (
        <Card className="border-2 border-dashed">
          <CardContent className="pt-6 text-center py-12">
            <Package className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">Nenhuma assinatura ativa</h3>
            <p className="text-muted-foreground mb-6">
              Escolha um plano abaixo para começar a usar todos os recursos
            </p>
          </CardContent>
        </Card>
      )}

      {/* Usage Stats */}
      {usage && limits && (
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
                    {usage.products}
                    {limits.max_products === null ? ' / ilimitado' : ` / ${limits.max_products}`}
                  </span>
                </div>
                {limits.max_products !== null && (
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className={cn(
                        'h-2 rounded-full transition-all',
                        getUsagePercent(usage.products, limits.max_products) >= 90
                          ? 'bg-red-500'
                          : getUsagePercent(usage.products, limits.max_products) >= 70
                            ? 'bg-yellow-500'
                            : 'bg-green-500'
                      )}
                      style={{
                        width: `${getUsagePercent(usage.products, limits.max_products)}%`,
                      }}
                    />
                  </div>
                )}
              </div>

              {/* Leads */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Zap className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Leads (este mês)</span>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {usage.leads}
                    {limits.max_leads === null ? ' / ilimitado' : ` / ${limits.max_leads}`}
                  </span>
                </div>
                {limits.max_leads !== null && (
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className={cn(
                        'h-2 rounded-full transition-all',
                        getUsagePercent(usage.leads, limits.max_leads) >= 90
                          ? 'bg-red-500'
                          : getUsagePercent(usage.leads, limits.max_leads) >= 70
                            ? 'bg-yellow-500'
                            : 'bg-blue-500'
                      )}
                      style={{
                        width: `${getUsagePercent(usage.leads, limits.max_leads)}%`,
                      }}
                    />
                  </div>
                )}
              </div>

              {/* Conversations */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Conversas IA (este mês)</span>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {usage.conversations}
                    {limits.max_conversations === null
                      ? ' / ilimitado'
                      : ` / ${limits.max_conversations.toLocaleString('pt-BR')}`}
                  </span>
                </div>
                {limits.max_conversations !== null && (
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-purple-500 h-2 rounded-full transition-all"
                      style={{
                        width: `${getUsagePercent(usage.conversations, limits.max_conversations)}%`,
                      }}
                    />
                  </div>
                )}
              </div>

              {/* Emails */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Download className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Emails (este mês)</span>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {usage.emails}
                    {limits.max_emails_per_month === null
                      ? ' / ilimitado'
                      : ` / ${limits.max_emails_per_month.toLocaleString('pt-BR')}`}
                  </span>
                </div>
                {limits.max_emails_per_month !== null && (
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-yellow-500 h-2 rounded-full transition-all"
                      style={{
                        width: `${getUsagePercent(usage.emails, limits.max_emails_per_month)}%`,
                      }}
                    />
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

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
            const isCurrentPlan = subscription && plan.id === subscription.plan_id

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
                      <Link href={`/checkout?plan=${plan.id}&cycle=${billingCycle}`}>
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
          </div>
        </CardHeader>
        <CardContent>
          {invoices.length === 0 ? (
            <div className="text-center py-12">
              <Receipt className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">Nenhuma fatura encontrada</p>
            </div>
          ) : (
            <div className="space-y-3">
              {invoices.map((invoice) => (
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
                          : invoice.status === 'open'
                            ? 'bg-yellow-100 dark:bg-yellow-900/30'
                            : 'bg-red-100 dark:bg-red-900/30'
                      )}
                    >
                      {invoice.status === 'paid' ? (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      ) : invoice.status === 'open' ? (
                        <Clock className="h-5 w-5 text-yellow-600" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-600" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium">
                        Pagamento - {invoice.period_start ? formatDate(invoice.period_start) : ''}
                      </p>
                      <div className="flex items-center gap-3 text-sm text-muted-foreground">
                        <span>{invoice.stripe_invoice_id?.slice(0, 20)}...</span>
                        <span>•</span>
                        <span>{invoice.paid_at ? formatDate(invoice.paid_at) : formatDate(invoice.created_at)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <p className="text-lg font-semibold">
                      {formatCurrency(invoice.amount_paid || invoice.amount_due)}
                    </p>
                    {invoice.invoice_pdf && (
                      <Button variant="ghost" size="sm" asChild>
                        <a href={invoice.invoice_pdf} target="_blank" rel="noopener noreferrer">
                          <Download className="h-4 w-4" />
                        </a>
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Danger Zone */}
      {currentPlan && !currentPlan.cancelAtPeriodEnd && (
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
              <Button
                variant="destructive"
                size="sm"
                onClick={handleCancelSubscription}
                disabled={canceling}
              >
                {canceling ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                Cancelar
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
