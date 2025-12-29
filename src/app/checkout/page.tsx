'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ServiceSelector } from '@/components/checkout/service-selector'
import { OrderSummary } from '@/components/checkout/order-summary'
import { Service, CheckoutFormData } from '@/types/checkout'
import { getSolutionById, formatCurrency, getSolutionPrice, getSolutionFullName } from '@/lib/products/checkout-adapter'
import { ArrowLeft, ArrowRight, CreditCard, QrCode, Loader2 } from 'lucide-react'
import { useToast } from '@/components/ui/use-toast'
import { formatPhone, formatCpfCnpj } from '@/lib/formatting/br-formats'

export default function CheckoutPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()

  // Get product from URL if provided (novo padrão ?product=)
  const productIdFromUrl = searchParams?.get('product')
  const variantIdFromUrl = searchParams?.get('variant')
  const serviceIdFromUrl = searchParams?.get('service') // Manter compatibilidade

  // Buscar produto correto (prioriza ?product= sobre ?service=)
  const productId = productIdFromUrl || serviceIdFromUrl
  const [selectedService, setSelectedService] = useState<Service | null>(
    productId ? getSolutionById(productId) : null
  )

  // Estado para variante selecionada
  const [selectedVariant, setSelectedVariant] = useState<string | null>(variantIdFromUrl || null)

  // Se veio de um produto VSL, pula a etapa de seleção
  const initialStep = productId ? 'details' : 'service'
  const [step, setStep] = useState<'service' | 'details' | 'payment'>(initialStep)
  const [formData, setFormData] = useState<CheckoutFormData>({
    name: '',
    email: '',
    phone: '',
    cpfCnpj: '',
    serviceDescription: '',
    urgency: 'normal',
    paymentMethod: 'credit_card',
  })
  const [emailError, setEmailError] = useState<string>('')

  // Email validation function
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^(?!\.)(?!.*\.\.)([A-Za-z0-9_'+\-\.]*)[A-Za-z0-9_+-]@([A-Za-z0-9][A-Za-z0-9\-]*\.)+[A-Za-z]{2,}$/
    return emailRegex.test(email)
  }

  // Handle email change with validation
  const handleEmailChange = (email: string) => {
    setFormData({ ...formData, email })
    if (email && !validateEmail(email)) {
      setEmailError('Email inválido. Use o formato: exemplo@dominio.com')
    } else {
      setEmailError('')
    }
  }

  const handlePhoneChange = (value: string) => {
    const formatted = formatPhone(value)
    setFormData({ ...formData, phone: formatted })
  }

  const handleCpfCnpjChange = (value: string) => {
    const formatted = formatCpfCnpj(value)
    setFormData({ ...formData, cpfCnpj: formatted })
  }

  const handleSelectService = (service: Service) => {
    setSelectedService(service)
  }

  const handleNextStep = () => {
    if (step === 'service') {
      if (!selectedService) {
        toast({
          title: 'Selecione um serviço',
          description: 'Por favor, escolha um serviço para continuar.',
          variant: 'destructive',
        })
        return
      }
      setStep('details')
    } else if (step === 'details') {
      // Validate required fields
      if (!formData.name || !formData.email || !formData.phone || !formData.cpfCnpj) {
        toast({
          title: 'Campos obrigatórios',
          description: 'Por favor, preencha todos os campos obrigatórios.',
          variant: 'destructive',
        })
        return
      }

      // Validate email format
      if (!validateEmail(formData.email)) {
        toast({
          title: 'Email inválido',
          description: 'Por favor, insira um email válido no formato: exemplo@dominio.com',
          variant: 'destructive',
        })
        return
      }

      // Validate variant selection if service has variants
      if (selectedService?.hasVariants && !selectedVariant) {
        toast({
          title: 'Selecione uma modalidade',
          description: 'Este serviço requer a seleção de uma modalidade específica.',
          variant: 'destructive',
        })
        return
      }

      setStep('payment')
    }
  }

  const handlePrevStep = () => {
    if (step === 'details') {
      setStep('service')
    } else if (step === 'payment') {
      setStep('details')
    }
  }

  const [isProcessing, setIsProcessing] = useState(false)

  const handleSubmit = async () => {
    if (!selectedService) return

    setIsProcessing(true)

    // Calcular preço correto baseado em variante (se houver)
    const finalPrice = getSolutionPrice(selectedService.id, selectedVariant || undefined)
    const fullServiceName = getSolutionFullName(selectedService.id, selectedVariant || undefined)

    try {
      if (formData.paymentMethod === 'credit_card') {
        // Stripe Checkout
        const response = await fetch('/api/stripe/create-session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            productId: selectedService.id,
            variantId: selectedVariant || null,
            serviceId: selectedService.id, // Manter compatibilidade
            serviceName: fullServiceName,
            amount: finalPrice / 100, // Convert from centavos to reais
            customerName: formData.name,
            customerEmail: formData.email,
            customerPhone: formData.phone,
            customerCpfCnpj: formData.cpfCnpj,
            description: formData.serviceDescription,
            urgency: formData.urgency,
          }),
        })

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}))
          throw new Error(errorData.error || 'Erro ao criar sessão de pagamento')
        }

        const { url } = await response.json()

        // Redirect to Stripe Checkout
        window.location.href = url
      } else if (formData.paymentMethod === 'pix') {
        // MercadoPago PIX
        const response = await fetch('/api/mercadopago/create-payment', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            productId: selectedService.id,
            variantId: selectedVariant || null,
            serviceId: selectedService.id, // Manter compatibilidade
            serviceName: fullServiceName,
            amount: finalPrice / 100, // Convert from centavos to reais
            customerName: formData.name,
            customerEmail: formData.email,
            customerPhone: formData.phone,
            customerCpfCnpj: formData.cpfCnpj,
            description: formData.serviceDescription,
            urgency: formData.urgency,
          }),
        })

        if (!response.ok) {
          throw new Error('Erro ao gerar PIX')
        }

        const { qrCode, qrCodeBase64 } = await response.json()

        // Show PIX QR Code (we'll create a modal for this)
        toast({
          title: 'PIX Gerado!',
          description: 'Escaneie o QR Code para realizar o pagamento.',
        })

        // For now, redirect to success (later we'll add a modal)
        setTimeout(() => {
          router.push('/checkout/success')
        }, 2000)
      }
    } catch (error) {
      console.error('Payment error:', error)
      toast({
        title: 'Erro no pagamento',
        description: error instanceof Error ? error.message : 'Tente novamente mais tarde.',
        variant: 'destructive',
      })
      setIsProcessing(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>

          <h1 className="text-4xl font-bold text-navy-900">Checkout</h1>
          <p className="text-muted-foreground mt-2">
            Complete sua contratação de serviço jurídico
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center gap-4">
            <Step number={1} label="Serviço" active={step === 'service'} completed={step !== 'service'} />
            <div className="h-0.5 w-16 bg-gray-300" />
            <Step number={2} label="Detalhes" active={step === 'details'} completed={step === 'payment'} />
            <div className="h-0.5 w-16 bg-gray-300" />
            <Step number={3} label="Pagamento" active={step === 'payment'} completed={false} />
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Forms */}
          <div className="lg:col-span-2 space-y-6">
            {/* Step 1: Service Selection */}
            {step === 'service' && (
              <ServiceSelector
                selectedServiceId={selectedService?.id || null}
                onSelectService={handleSelectService}
              />
            )}

            {/* Step 2: Client Details */}
            {step === 'details' && (
              <Card>
                <CardHeader>
                  <CardTitle>Seus Dados</CardTitle>
                  <CardDescription>
                    Preencha suas informações para prosseguir
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nome Completo *</Label>
                      <Input
                        id="name"
                        placeholder="João da Silva"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">E-mail *</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="joao@exemplo.com"
                        value={formData.email}
                        onChange={(e) => handleEmailChange(e.target.value)}
                        className={emailError ? 'border-red-500' : ''}
                      />
                      {emailError && (
                        <p className="text-sm text-red-600">{emailError}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Telefone *</Label>
                      <Input
                        id="phone"
                        placeholder="(21) 99999-9999"
                        value={formData.phone}
                        onChange={(e) => handlePhoneChange(e.target.value)}
                        maxLength={15}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="cpfCnpj">CPF/CNPJ *</Label>
                      <Input
                        id="cpfCnpj"
                        placeholder="000.000.000-00 ou 00.000.000/0000-00"
                        value={formData.cpfCnpj}
                        onChange={(e) => handleCpfCnpjChange(e.target.value)}
                        maxLength={18}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Descrição do Caso (opcional)</Label>
                    <Textarea
                      id="description"
                      placeholder="Descreva brevemente seu caso ou necessidade..."
                      rows={4}
                      value={formData.serviceDescription}
                      onChange={(e) => setFormData({ ...formData, serviceDescription: e.target.value })}
                    />
                  </div>

                  {/* Variant Selector */}
                  {selectedService?.hasVariants && selectedService.variants && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Label className="text-base">Selecione a Modalidade *</Label>
                        {!selectedVariant && (
                          <span className="text-xs text-red-600">Seleção obrigatória</span>
                        )}
                      </div>
                      <RadioGroup
                        value={selectedVariant || ''}
                        onValueChange={(value) => setSelectedVariant(value)}
                      >
                        {selectedService.variants.map((variant) => (
                          <Card
                            key={variant.id}
                            className={`cursor-pointer transition-all ${
                              selectedVariant === variant.id
                                ? 'border-gold-500 border-2 bg-gold-50/30'
                                : 'hover:border-gray-300 hover:bg-muted/30'
                            }`}
                            onClick={() => setSelectedVariant(variant.id)}
                          >
                            <CardHeader className="flex flex-row items-start space-y-0 space-x-3 p-4">
                              <RadioGroupItem value={variant.id} id={variant.id} className="mt-1" />
                              <div className="flex-1 space-y-1">
                                <Label
                                  htmlFor={variant.id}
                                  className="font-semibold cursor-pointer text-navy-900"
                                >
                                  {variant.name}
                                </Label>
                                <p className="text-sm text-muted-foreground">
                                  {variant.description}
                                </p>
                                <div className="flex items-center justify-between pt-2">
                                  <span className="text-lg font-bold text-gold-600">
                                    {formatCurrency(variant.price)}
                                  </span>
                                  {variant.estimatedDelivery && (
                                    <span className="text-xs text-muted-foreground">
                                      {variant.estimatedDelivery}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </CardHeader>
                          </Card>
                        ))}
                      </RadioGroup>
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label>Urgência</Label>
                    <RadioGroup
                      value={formData.urgency}
                      onValueChange={(value) => setFormData({ ...formData, urgency: value as any })}
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="normal" id="normal" />
                        <Label htmlFor="normal" className="font-normal cursor-pointer">
                          Normal (prazo padrão)
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="urgent" id="urgent" />
                        <Label htmlFor="urgent" className="font-normal cursor-pointer">
                          Urgente (+30% no valor)
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 3: Payment */}
            {step === 'payment' && (
              <Card>
                <CardHeader>
                  <CardTitle>Forma de Pagamento</CardTitle>
                  <CardDescription>
                    Escolha como deseja realizar o pagamento
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <RadioGroup
                    value={formData.paymentMethod}
                    onValueChange={(value) => setFormData({ ...formData, paymentMethod: value as any })}
                  >
                    <Card className="cursor-pointer hover:bg-muted/50 transition">
                      <CardHeader className="flex flex-row items-center space-y-0 space-x-4">
                        <RadioGroupItem value="credit_card" id="credit_card" />
                        <div className="flex-1">
                          <Label htmlFor="credit_card" className="font-semibold cursor-pointer flex items-center gap-2">
                            <CreditCard className="w-5 h-5" />
                            Cartão de Crédito
                          </Label>
                          <p className="text-sm text-muted-foreground">
                            Pagamento processado via Stripe
                          </p>
                        </div>
                      </CardHeader>
                    </Card>

                    <Card className="cursor-pointer hover:bg-muted/50 transition">
                      <CardHeader className="flex flex-row items-center space-y-0 space-x-4">
                        <RadioGroupItem value="pix" id="pix" />
                        <div className="flex-1">
                          <Label htmlFor="pix" className="font-semibold cursor-pointer flex items-center gap-2">
                            <QrCode className="w-5 h-5" />
                            PIX
                          </Label>
                          <p className="text-sm text-muted-foreground">
                            Pagamento instantâneo via QR Code
                          </p>
                        </div>
                      </CardHeader>
                    </Card>
                  </RadioGroup>

                  <div className="pt-4">
                    <Button
                      onClick={handleSubmit}
                      className="w-full"
                      size="lg"
                      disabled={isProcessing}
                    >
                      {isProcessing && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                      {isProcessing ? 'Processando pagamento...' : 'Finalizar Pagamento'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between">
              {step !== 'service' && (
                <Button variant="outline" onClick={handlePrevStep}>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Voltar
                </Button>
              )}

              {step !== 'payment' && (
                <Button onClick={handleNextStep} className="ml-auto">
                  Próximo
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              )}
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-1">
            <OrderSummary service={selectedService} variantId={selectedVariant} />
          </div>
        </div>
      </div>
    </div>
  )
}

// Helper component for progress steps
function Step({
  number,
  label,
  active,
  completed,
}: {
  number: number
  label: string
  active: boolean
  completed: boolean
}) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className={`
          w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm
          ${active ? 'bg-gold-500 text-white' : completed ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-600'}
        `}
      >
        {number}
      </div>
      <span className={`text-sm ${active ? 'font-semibold text-navy-900' : 'text-muted-foreground'}`}>
        {label}
      </span>
    </div>
  )
}
