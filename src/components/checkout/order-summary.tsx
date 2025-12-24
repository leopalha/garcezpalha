'use client'

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { Service, formatCurrency } from '@/types/checkout'
import { Building2, Clock, Shield } from 'lucide-react'

interface OrderSummaryProps {
  service: Service | null
  discount?: number
}

export function OrderSummary({ service, discount = 0 }: OrderSummaryProps) {
  if (!service) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Resumo do Pedido</CardTitle>
          <CardDescription>Selecione um serviço para continuar</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-12 text-muted-foreground">
            <p>Nenhum serviço selecionado</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  const subtotal = service.price
  const discountAmount = Math.floor(subtotal * (discount / 100))
  const total = subtotal - discountAmount

  return (
    <Card className="sticky top-6">
      <CardHeader>
        <CardTitle>Resumo do Pedido</CardTitle>
        <CardDescription>Confira os detalhes do serviço selecionado</CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Selected Service */}
        <div className="space-y-2">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <h4 className="font-semibold text-navy-900">{service.name}</h4>
              <p className="text-sm text-muted-foreground mt-1">{service.description}</p>
            </div>
            <Badge variant="secondary" className="flex-shrink-0">
              {service.category}
            </Badge>
          </div>

          {/* Estimated Delivery */}
          {service.estimatedDelivery && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="w-4 h-4" />
              <span>Prazo: {service.estimatedDelivery}</span>
            </div>
          )}
        </div>

        <Separator />

        {/* Price Breakdown */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Subtotal</span>
            <span className="font-medium">{formatCurrency(subtotal)}</span>
          </div>

          {discount > 0 && (
            <div className="flex justify-between text-sm text-green-600">
              <span>Desconto ({discount}%)</span>
              <span>-{formatCurrency(discountAmount)}</span>
            </div>
          )}

          <Separator />

          <div className="flex justify-between">
            <span className="font-semibold text-navy-900">Total</span>
            <span className="text-2xl font-bold text-navy-900">{formatCurrency(total)}</span>
          </div>

          {service.category === 'automacao' && (
            <p className="text-xs text-muted-foreground text-center">
              Cobrança recorrente mensal
            </p>
          )}
        </div>

        <Separator />

        {/* Trust Badges */}
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <Shield className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium">Pagamento Seguro</p>
              <p className="text-xs text-muted-foreground">
                Seus dados estão protegidos com criptografia SSL
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Building2 className="w-5 h-5 text-navy-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium">OAB/RJ 219.390</p>
              <p className="text-xs text-muted-foreground">
                Profissionais registrados e experientes
              </p>
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="bg-muted/50">
        <div className="w-full text-xs text-center text-muted-foreground">
          <p>
            Ao continuar, você concorda com nossos{' '}
            <a href="/termos" className="underline hover:text-navy-900">
              Termos de Serviço
            </a>{' '}
            e{' '}
            <a href="/privacidade" className="underline hover:text-navy-900">
              Política de Privacidade
            </a>
          </p>
        </div>
      </CardFooter>
    </Card>
  )
}
