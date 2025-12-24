'use client'

/**
 * PÁGINA DE EXEMPLO - CheckoutModal
 *
 * Esta página demonstra diferentes formas de usar o CheckoutModal
 * em uma aplicação real.
 */

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckoutModal } from '@/components/checkout/checkout-modal'
import { SERVICES } from '@/types/checkout'
import { Check, Shield, Clock, ArrowRight } from 'lucide-react'

export default function ExemploCheckoutModalPage() {
  const [checkoutOpen, setCheckoutOpen] = useState(false)
  const [selectedServiceId, setSelectedServiceId] = useState<string>()

  // Alguns serviços em destaque
  const featuredServices = SERVICES.slice(0, 6)

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Header */}
      <div className="bg-navy-900 text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">Exemplo de Checkout Modal</h1>
          <p className="text-xl text-gray-300">
            Demonstração de como integrar o CheckoutModal em suas páginas
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Section 1: Botão Simples */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6">1. Botão Simples (sem serviço)</h2>
          <p className="text-muted-foreground mb-6">
            Usuário escolhe o serviço dentro do modal (Step 1)
          </p>

          <Button
            size="lg"
            onClick={() => {
              setSelectedServiceId(undefined)
              setCheckoutOpen(true)
            }}
          >
            Abrir Checkout Completo
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </section>

        {/* Section 2: Cards com Serviços */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6">2. Cards de Serviços</h2>
          <p className="text-muted-foreground mb-6">
            Usuário clica em "Contratar" e vai direto para Step 2
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredServices.map((service) => (
              <Card key={service.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-xl">{service.name}</CardTitle>
                  <CardDescription className="line-clamp-2">
                    {service.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Price */}
                  <div className="text-3xl font-bold text-navy-900">
                    R$ {(service.price / 100).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </div>

                  {/* Features */}
                  <ul className="space-y-2">
                    {service.features.slice(0, 3).map((feature, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span className="text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Delivery */}
                  {service.estimatedDelivery && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      {service.estimatedDelivery}
                    </div>
                  )}

                  {/* CTA Button */}
                  <Button
                    className="w-full"
                    onClick={() => {
                      setSelectedServiceId(service.id)
                      setCheckoutOpen(true)
                    }}
                  >
                    Contratar Agora
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Section 3: Hero Section Example */}
        <section className="mb-16">
          <Card className="bg-gradient-to-br from-gold-50 to-gold-100 border-gold-200">
            <CardContent className="py-12 px-8 text-center">
              <Shield className="w-16 h-16 text-gold-600 mx-auto mb-4" />
              <h2 className="text-3xl font-bold mb-4">
                Proteja Seus Direitos Agora
              </h2>
              <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                Checkout rápido e seguro. Complete sua contratação em menos de 3 minutos.
              </p>
              <Button
                size="lg"
                className="bg-gold-600 hover:bg-gold-700"
                onClick={() => {
                  setSelectedServiceId('desbloqueio-conta')
                  setCheckoutOpen(true)
                }}
              >
                Contratar Desbloqueio de Conta
              </Button>
            </CardContent>
          </Card>
        </section>

        {/* Section 4: Lista Compacta */}
        <section>
          <h2 className="text-3xl font-bold mb-6">3. Lista Compacta</h2>
          <p className="text-muted-foreground mb-6">
            Ideal para páginas de listagem de serviços
          </p>

          <div className="space-y-4">
            {SERVICES.slice(6, 12).map((service) => (
              <Card key={service.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <CardTitle className="text-lg mb-2">{service.name}</CardTitle>
                      <CardDescription>{service.description}</CardDescription>
                    </div>
                    <div className="text-right space-y-2">
                      <div className="text-2xl font-bold text-navy-900">
                        R$ {(service.price / 100).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </div>
                      <Button
                        size="sm"
                        onClick={() => {
                          setSelectedServiceId(service.id)
                          setCheckoutOpen(true)
                        }}
                      >
                        Contratar
                      </Button>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </section>

        {/* Trust Badges */}
        <section className="mt-16 border-t pt-12">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <Shield className="w-12 h-12 text-green-600 mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Pagamento Seguro</h3>
              <p className="text-sm text-muted-foreground">
                Criptografia SSL e proteção de dados
              </p>
            </div>
            <div>
              <Check className="w-12 h-12 text-blue-600 mx-auto mb-3" />
              <h3 className="font-semibold mb-2">OAB Verificado</h3>
              <p className="text-sm text-muted-foreground">
                Profissionais registrados OAB/RJ 219.390
              </p>
            </div>
            <div>
              <Clock className="w-12 h-12 text-purple-600 mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Entrega Rápida</h3>
              <p className="text-sm text-muted-foreground">
                Prazos definidos e garantidos
              </p>
            </div>
          </div>
        </section>
      </div>

      {/* CheckoutModal - Component único para toda a página */}
      <CheckoutModal
        open={checkoutOpen}
        onOpenChange={setCheckoutOpen}
        serviceId={selectedServiceId}
        onSuccess={() => {
          console.log('Checkout completo! Serviço:', selectedServiceId)
          // Aqui você pode:
          // - Mostrar modal de sucesso
          // - Redirecionar para página de confirmação
          // - Atualizar analytics
          // - Enviar evento para tracking
          setCheckoutOpen(false)
        }}
      />
    </div>
  )
}
