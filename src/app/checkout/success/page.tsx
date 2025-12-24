'use client'

import { CheckCircle2, Download, Home, Mail, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useEffect, useState, Suspense } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

interface OrderDetails {
  id: string
  service_name: string
  amount: number
  customer_name: string
  customer_email: string
  status: string
  created_at: string
  paid_at: string | null
}

function CheckoutSuccessContent() {
  const searchParams = useSearchParams()
  const orderId = searchParams.get('order_id')
  const sessionId = searchParams.get('session_id')

  const [order, setOrder] = useState<OrderDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchOrderDetails() {
      if (!orderId && !sessionId) {
        setLoading(false)
        return
      }

      try {
        const params = new URLSearchParams()
        if (orderId) params.append('order_id', orderId)
        if (sessionId) params.append('session_id', sessionId)

        const response = await fetch(`/api/checkout/order?${params}`)
        if (response.ok) {
          const data = await response.json()
          setOrder(data.order)
        }
      } catch {
        setError('Não foi possível carregar os detalhes do pedido')
      } finally {
        setLoading(false)
      }
    }

    fetchOrderDetails()
  }, [orderId, sessionId])

  const orderNumber = order?.id?.slice(0, 8).toUpperCase() ||
    '2025-' + Math.random().toString(36).substring(7).toUpperCase()

  const orderDate = order?.created_at
    ? new Date(order.created_at).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      })
    : new Date().toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      })

  const serviceName = order?.service_name || 'Serviço Jurídico'
  const amount = order?.amount
    ? (order.amount / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
    : null

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-navy-600" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 flex items-center justify-center py-12">
      <div className="container mx-auto px-4 max-w-2xl">
        <Card>
          <CardHeader className="text-center space-y-4 pb-8">
            <div className="flex justify-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle2 className="w-12 h-12 text-green-600" />
              </div>
            </div>

            <div>
              <CardTitle className="text-3xl font-bold text-navy-900">
                Pagamento Confirmado!
              </CardTitle>
              <CardDescription className="text-lg mt-2">
                Seu pedido foi recebido e está sendo processado
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Order Details */}
            <div className="bg-muted/50 rounded-lg p-6 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Número do Pedido</span>
                <span className="font-mono font-semibold">{orderNumber}</span>
              </div>
              <Separator />
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Data</span>
                <span className="font-semibold">{orderDate}</span>
              </div>
              <Separator />
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Serviço</span>
                <span className="font-semibold">{serviceName}</span>
              </div>
              {amount && (
                <>
                  <Separator />
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Valor</span>
                    <span className="font-semibold text-green-600">{amount}</span>
                  </div>
                </>
              )}
            </div>

            {error && (
              <div className="bg-yellow-50 text-yellow-800 p-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* Next Steps */}
            <div className="space-y-4">
              <h3 className="font-semibold text-navy-900">Próximos Passos</h3>

              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                  <Mail className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-sm">Confirmação por E-mail</p>
                    <p className="text-sm text-muted-foreground">
                      Você receberá um e-mail de confirmação com todos os detalhes do serviço contratado
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-purple-50 rounded-lg">
                  <Download className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-sm">Contrato de Serviço</p>
                    <p className="text-sm text-muted-foreground">
                      O contrato será enviado em até 24 horas para assinatura eletrônica
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                  <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-sm">Início do Atendimento</p>
                    <p className="text-sm text-muted-foreground">
                      Nossa equipe entrará em contato em até 2 dias úteis para iniciar o serviço
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Info */}
            <div className="bg-gold-50 rounded-lg p-4 space-y-2">
              <p className="font-semibold text-navy-900">Precisa de ajuda?</p>
              <div className="text-sm text-muted-foreground space-y-1">
                <p>📞 Telefone: (21) 3495-3046 / (21) 97503-0018</p>
                <p>✉️ E-mail: contato@garcezpalha.com</p>
                <p>⏰ Horário: Segunda a sexta, 9h às 18h</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid gap-3 pt-4">
              <Button asChild size="lg" className="w-full">
                <Link href="/dashboard">
                  <Home className="w-4 h-4 mr-2" />
                  Ir para Dashboard
                </Link>
              </Button>

              <Button asChild variant="outline" size="lg" className="w-full">
                <Link href="/">
                  Voltar para Início
                </Link>
              </Button>
            </div>

            {/* Footer Message */}
            <div className="text-center text-sm text-muted-foreground pt-4 border-t">
              <p>
                Obrigado por confiar no escritório Garcez Palha.
                <br />
                Estamos ansiosos para atendê-lo!
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-navy-600" />
      </div>
    }>
      <CheckoutSuccessContent />
    </Suspense>
  )
}
