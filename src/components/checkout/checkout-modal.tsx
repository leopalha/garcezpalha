'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { ServiceSelector } from '@/components/checkout/service-selector'
import { OrderSummary } from '@/components/checkout/order-summary'
import { Service, getServiceById, CheckoutFormData } from '@/types/checkout'
import { ArrowLeft, ArrowRight, CreditCard, QrCode, Loader2, X } from 'lucide-react'
import { useToast } from '@/components/ui/use-toast'
import { cn } from '@/lib/utils'

interface CheckoutModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  serviceId?: string
  onSuccess?: () => void
}

export function CheckoutModal({ open, onOpenChange, serviceId, onSuccess }: CheckoutModalProps) {
  const { toast } = useToast()

  // Initialize selected service from serviceId prop
  const [selectedService, setSelectedService] = useState<Service | null>(
    serviceId ? getServiceById(serviceId) || null : null
  )

  // Determine initial step based on whether serviceId is provided
  const [step, setStep] = useState<'service' | 'details' | 'payment'>(
    serviceId ? 'details' : 'service'
  )

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
  const [isProcessing, setIsProcessing] = useState(false)

  // Reset state when modal opens/closes or serviceId changes
  useEffect(() => {
    if (open) {
      const service = serviceId ? getServiceById(serviceId) || null : null
      setSelectedService(service)
      setStep(serviceId ? 'details' : 'service')
      setFormData({
        name: '',
        email: '',
        phone: '',
        cpfCnpj: '',
        serviceDescription: '',
        urgency: 'normal',
        paymentMethod: 'credit_card',
      })
      setEmailError('')
      setIsProcessing(false)
    }
  }, [open, serviceId])

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

  // Phone mask: (21) 99999-9999
  const formatPhone = (value: string): string => {
    const numbers = value.replace(/\D/g, '')
    if (numbers.length <= 2) return `(${numbers}`
    if (numbers.length <= 7) return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`
  }

  // CPF/CNPJ mask
  const formatCpfCnpj = (value: string): string => {
    const numbers = value.replace(/\D/g, '')
    if (numbers.length <= 11) {
      // CPF: 123.456.789-00
      if (numbers.length <= 3) return numbers
      if (numbers.length <= 6) return `${numbers.slice(0, 3)}.${numbers.slice(3)}`
      if (numbers.length <= 9) return `${numbers.slice(0, 3)}.${numbers.slice(3, 6)}.${numbers.slice(6)}`
      return `${numbers.slice(0, 3)}.${numbers.slice(3, 6)}.${numbers.slice(6, 9)}-${numbers.slice(9, 11)}`
    } else {
      // CNPJ: 12.345.678/0001-00
      if (numbers.length <= 2) return numbers
      if (numbers.length <= 5) return `${numbers.slice(0, 2)}.${numbers.slice(2)}`
      if (numbers.length <= 8) return `${numbers.slice(0, 2)}.${numbers.slice(2, 5)}.${numbers.slice(5)}`
      if (numbers.length <= 12) return `${numbers.slice(0, 2)}.${numbers.slice(2, 5)}.${numbers.slice(5, 8)}/${numbers.slice(8)}`
      return `${numbers.slice(0, 2)}.${numbers.slice(2, 5)}.${numbers.slice(5, 8)}/${numbers.slice(8, 12)}-${numbers.slice(12, 14)}`
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

      setStep('payment')
    }
  }

  const handlePrevStep = () => {
    if (step === 'details' && !serviceId) {
      // Only allow going back to service selection if no serviceId was provided
      setStep('service')
    } else if (step === 'payment') {
      setStep('details')
    }
  }

  const handleSubmit = async () => {
    if (!selectedService) return

    setIsProcessing(true)

    try {
      if (formData.paymentMethod === 'credit_card') {
        // Stripe Checkout
        const response = await fetch('/api/stripe/create-session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            serviceId: selectedService.id,
            serviceName: selectedService.name,
            amount: selectedService.price / 100, // Convert from centavos to reais
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

        // Close modal and redirect to Stripe Checkout
        onOpenChange(false)
        window.location.href = url
      } else if (formData.paymentMethod === 'pix') {
        // MercadoPago PIX
        const response = await fetch('/api/mercadopago/create-payment', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            serviceId: selectedService.id,
            serviceName: selectedService.name,
            amount: selectedService.price / 100, // Convert from centavos to reais
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

        // Show PIX QR Code
        toast({
          title: 'PIX Gerado!',
          description: 'Escaneie o QR Code para realizar o pagamento.',
        })

        // Call success callback and close modal
        if (onSuccess) {
          onSuccess()
        }
        onOpenChange(false)
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

  // Calculate current step number for progress indicator
  const getCurrentStepNumber = () => {
    if (step === 'service') return 1
    if (step === 'details') return 2
    if (step === 'payment') return 3
    return 1
  }

  const getTotalSteps = () => {
    return serviceId ? 2 : 3 // Skip step 1 if serviceId is provided
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto p-0">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-background border-b px-6 py-4">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-navy-900">
              Checkout Seguro
            </DialogTitle>
            <DialogDescription>
              Complete sua contratação de serviço jurídico
            </DialogDescription>
          </DialogHeader>

          {/* Progress Indicator */}
          <div className="mt-4">
            <div className="flex items-center justify-center gap-2">
              <Step
                number={serviceId ? 1 : 1}
                label={serviceId ? 'Detalhes' : 'Serviço'}
                active={step === (serviceId ? 'details' : 'service')}
                completed={step !== (serviceId ? 'details' : 'service')}
              />
              {!serviceId && (
                <>
                  <div className="h-0.5 w-12 bg-gray-300" />
                  <Step
                    number={2}
                    label="Detalhes"
                    active={step === 'details'}
                    completed={step === 'payment'}
                  />
                </>
              )}
              <div className="h-0.5 w-12 bg-gray-300" />
              <Step
                number={serviceId ? 2 : 3}
                label="Pagamento"
                active={step === 'payment'}
                completed={false}
              />
            </div>
            <div className="text-center mt-2 text-sm text-muted-foreground">
              Passo {getCurrentStepNumber()} de {getTotalSteps()}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 py-6">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column - Forms */}
            <div className="lg:col-span-2 space-y-6">
              {/* Step 1: Service Selection */}
              {step === 'service' && !serviceId && (
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
              <div className="flex justify-between pt-4">
                {(step !== 'service' && (step !== 'details' || !serviceId)) && (
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
              <OrderSummary service={selectedService} />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
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
    <div className="flex flex-col items-center gap-1">
      <div
        className={cn(
          'w-8 h-8 rounded-full flex items-center justify-center font-semibold text-xs',
          active ? 'bg-gold-500 text-white' : completed ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-600'
        )}
      >
        {number}
      </div>
      <span className={cn('text-xs', active ? 'font-semibold text-navy-900' : 'text-muted-foreground')}>
        {label}
      </span>
    </div>
  )
}
