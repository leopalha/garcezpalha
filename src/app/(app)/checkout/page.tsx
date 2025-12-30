'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/components/ui/use-toast'
import {
  ArrowLeft,
  ArrowRight,
  CreditCard,
  QrCode,
  Loader2,
  Check,
  Package,
  Sparkles,
} from 'lucide-react'
import { formatPhone, formatCpfCnpj } from '@/lib/formatting/br-formats'
import Link from 'next/link'

// Tipos dos planos
type PlanId = 'starter' | 'pro' | 'enterprise'

interface Plan {
  id: PlanId
  name: string
  price: number
  billingPeriod: 'monthly'
  features: string[]
  badge?: string
}

const PLANS: Record<PlanId, Plan> = {
  starter: {
    id: 'starter',
    name: 'Starter',
    price: 49700, // R$ 497
    billingPeriod: 'monthly',
    features: [
      '1 Agent IA Especializado (ou Genérico)',
      'Até 10 produtos',
      '100 conversas IA/mês',
      'CRM básico',
      'Landing pages ilimitadas',
      'Suporte por email',
    ],
  },
  pro: {
    id: 'pro',
    name: 'Pro',
    price: 99700, // R$ 997
    billingPeriod: 'monthly',
    badge: 'Mais Popular',
    features: [
      '3 Agents IA Especializados + Genérico',
      'Produtos ilimitados',
      '500 conversas IA/mês',
      'CRM avançado + automações',
      'Marketing automation',
      'Landing pages + VSL',
      'White-label (domínio próprio)',
      'Suporte prioritário',
    ],
  },
  enterprise: {
    id: 'enterprise',
    name: 'Enterprise',
    price: 199700, // R$ 1.997
    billingPeriod: 'monthly',
    badge: 'Completo',
    features: [
      'Todos os nichos + Agent Genérico',
      'Tudo ilimitado',
      '2.000 conversas IA/mês',
      'Multi-usuário (até 5)',
      'API access',
      'White-label completo',
      'Onboarding dedicado',
      'Suporte via WhatsApp',
      'Custom branding',
    ],
  },
}

// Add-ons opcionais
interface Addon {
  id: string
  name: string
  price: number
  description: string
}

const ADDONS: Addon[] = [
  {
    id: 'nicho-extra',
    name: 'Nicho Extra',
    price: 9700, // R$ 97/mês
    description: 'Agent IA especializado adicional',
  },
  {
    id: 'catalogo',
    name: 'Catálogo Garcez Palha',
    price: 29700, // R$ 297/mês
    description: '57 produtos prontos para clonar',
  },
]

interface CheckoutFormData {
  // Dados pessoais
  name: string
  email: string
  phone: string
  cpfCnpj: string

  // Dados da empresa
  companyName: string

  // Método de pagamento
  paymentMethod: 'credit_card' | 'pix' | 'boleto'
}

type Step = 'plan' | 'addons' | 'details' | 'payment'

export default function AppCheckoutPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()

  // Get plan from URL
  const planIdFromUrl = searchParams?.get('plan') as PlanId | null
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(
    planIdFromUrl && PLANS[planIdFromUrl] ? PLANS[planIdFromUrl] : null
  )
  const [selectedAddons, setSelectedAddons] = useState<string[]>([])

  const initialStep: Step = planIdFromUrl ? 'addons' : 'plan'
  const [step, setStep] = useState<Step>(initialStep)
  const [isProcessing, setIsProcessing] = useState(false)

  const [formData, setFormData] = useState<CheckoutFormData>({
    name: '',
    email: '',
    phone: '',
    cpfCnpj: '',
    companyName: '',
    paymentMethod: 'credit_card',
  })

  const [emailError, setEmailError] = useState<string>('')

  // Email validation
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^(?!\.)(?!.*\.\.)([A-Za-z0-9_'+\-\.]*)[A-Za-z0-9_+-]@([A-Za-z0-9][A-Za-z0-9\-]*\.)+[A-Za-z]{2,}$/
    return emailRegex.test(email)
  }

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

  const toggleAddon = (addonId: string) => {
    setSelectedAddons(prev =>
      prev.includes(addonId)
        ? prev.filter(id => id !== addonId)
        : [...prev, addonId]
    )
  }

  // Calculate total
  const calculateTotal = () => {
    if (!selectedPlan) return 0
    const planPrice = selectedPlan.price
    const addonsPrice = selectedAddons.reduce((sum, addonId) => {
      const addon = ADDONS.find(a => a.id === addonId)
      return sum + (addon?.price || 0)
    }, 0)
    return planPrice + addonsPrice
  }

  const formatCurrency = (cents: number): string => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(cents / 100)
  }

  const handleNextStep = () => {
    if (step === 'plan') {
      if (!selectedPlan) {
        toast({
          title: 'Selecione um plano',
          description: 'Por favor, escolha um plano para continuar.',
          variant: 'destructive',
        })
        return
      }
      setStep('addons')
    } else if (step === 'addons') {
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
      if (emailError) {
        toast({
          title: 'Email inválido',
          description: 'Por favor, corrija o email antes de continuar.',
          variant: 'destructive',
        })
        return
      }
      setStep('payment')
    }
  }

  const handlePreviousStep = () => {
    if (step === 'payment') setStep('details')
    else if (step === 'details') setStep('addons')
    else if (step === 'addons') setStep('plan')
  }

  const handleSubmit = async () => {
    setIsProcessing(true)

    try {
      // TODO: Create Stripe checkout session or process payment
      // For now, simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))

      // Redirect to success page
      router.push('/app/checkout/success')
    } catch (error) {
      toast({
        title: 'Erro no pagamento',
        description: 'Ocorreu um erro ao processar seu pagamento. Tente novamente.',
        variant: 'destructive',
      })
      setIsProcessing(false)
    }
  }

  const progressPercentage = {
    plan: 25,
    addons: 50,
    details: 75,
    payment: 100,
  }[step]

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted py-12">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/app" className="inline-block mb-4">
            <div className="font-display text-2xl font-bold">
              <span className="text-primary">Garcez</span>
              <span className="text-secondary"> Palha</span>
            </div>
          </Link>
          <h1 className="text-3xl font-bold mb-2">Finalize sua Assinatura</h1>
          <p className="text-muted-foreground">
            Configure sua plataforma jurídica digital em minutos
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="bg-muted rounded-full h-2 overflow-hidden">
            <div
              className="bg-primary h-full transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
          <div className="flex justify-between mt-2 text-xs text-muted-foreground">
            <span className={step === 'plan' ? 'font-semibold text-foreground' : ''}>
              1. Plano
            </span>
            <span className={step === 'addons' ? 'font-semibold text-foreground' : ''}>
              2. Add-ons
            </span>
            <span className={step === 'details' ? 'font-semibold text-foreground' : ''}>
              3. Dados
            </span>
            <span className={step === 'payment' ? 'font-semibold text-foreground' : ''}>
              4. Pagamento
            </span>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="pt-6">
                {/* STEP 1: Select Plan */}
                {step === 'plan' && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-2xl font-bold mb-2">Escolha seu Plano</h2>
                      <p className="text-muted-foreground">
                        Selecione o plano ideal para seu escritório
                      </p>
                    </div>

                    <div className="grid gap-4">
                      {Object.values(PLANS).map((plan) => (
                        <Card
                          key={plan.id}
                          className={`cursor-pointer transition-all ${
                            selectedPlan?.id === plan.id
                              ? 'border-primary ring-2 ring-primary'
                              : 'hover:border-primary/50'
                          }`}
                          onClick={() => setSelectedPlan(plan)}
                        >
                          <CardContent className="pt-6">
                            <div className="flex items-start justify-between mb-4">
                              <div>
                                <div className="flex items-center gap-2 mb-1">
                                  <h3 className="text-xl font-bold">{plan.name}</h3>
                                  {plan.badge && (
                                    <Badge variant="secondary">{plan.badge}</Badge>
                                  )}
                                </div>
                                <div className="text-3xl font-bold text-primary">
                                  {formatCurrency(plan.price)}
                                  <span className="text-base text-muted-foreground font-normal">
                                    /mês
                                  </span>
                                </div>
                              </div>
                              <div
                                className={`h-6 w-6 rounded-full border-2 flex items-center justify-center ${
                                  selectedPlan?.id === plan.id
                                    ? 'border-primary bg-primary'
                                    : 'border-muted-foreground/30'
                                }`}
                              >
                                {selectedPlan?.id === plan.id && (
                                  <Check className="h-4 w-4 text-primary-foreground" />
                                )}
                              </div>
                            </div>
                            <ul className="space-y-2">
                              {plan.features.map((feature, i) => (
                                <li key={i} className="flex items-start gap-2 text-sm">
                                  <Check className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                                  <span>{feature}</span>
                                </li>
                              ))}
                            </ul>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}

                {/* STEP 2: Add-ons */}
                {step === 'addons' && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-2xl font-bold mb-2">Add-ons Opcionais</h2>
                      <p className="text-muted-foreground">
                        Potencialize sua plataforma com recursos extras
                      </p>
                    </div>

                    <div className="grid gap-4">
                      {ADDONS.map((addon) => (
                        <Card
                          key={addon.id}
                          className={`cursor-pointer transition-all ${
                            selectedAddons.includes(addon.id)
                              ? 'border-primary ring-2 ring-primary'
                              : 'hover:border-primary/50'
                          }`}
                          onClick={() => toggleAddon(addon.id)}
                        >
                          <CardContent className="pt-6">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <Sparkles className="h-5 w-5 text-primary" />
                                  <h3 className="font-semibold">{addon.name}</h3>
                                </div>
                                <p className="text-sm text-muted-foreground mb-3">
                                  {addon.description}
                                </p>
                                <p className="text-lg font-bold text-primary">
                                  +{formatCurrency(addon.price)}/mês
                                </p>
                              </div>
                              <div
                                className={`h-6 w-6 rounded-full border-2 flex items-center justify-center ${
                                  selectedAddons.includes(addon.id)
                                    ? 'border-primary bg-primary'
                                    : 'border-muted-foreground/30'
                                }`}
                              >
                                {selectedAddons.includes(addon.id) && (
                                  <Check className="h-4 w-4 text-primary-foreground" />
                                )}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>

                    <div className="bg-muted/50 rounded-lg p-4">
                      <p className="text-sm text-muted-foreground">
                        💡 <strong>Dica:</strong> Você pode adicionar ou remover add-ons a qualquer
                        momento no painel de controle
                      </p>
                    </div>
                  </div>
                )}

                {/* STEP 3: Details */}
                {step === 'details' && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-2xl font-bold mb-2">Seus Dados</h2>
                      <p className="text-muted-foreground">
                        Precisamos de algumas informações para criar sua conta
                      </p>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="name">Nome Completo *</Label>
                        <Input
                          id="name"
                          placeholder="João Silva"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                      </div>

                      <div>
                        <Label htmlFor="email">Email *</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="joao@email.com"
                          value={formData.email}
                          onChange={(e) => handleEmailChange(e.target.value)}
                        />
                        {emailError && (
                          <p className="text-xs text-destructive mt-1">{emailError}</p>
                        )}
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="phone">Telefone *</Label>
                          <Input
                            id="phone"
                            placeholder="(11) 98765-4321"
                            value={formData.phone}
                            onChange={(e) => handlePhoneChange(e.target.value)}
                          />
                        </div>

                        <div>
                          <Label htmlFor="cpfCnpj">CPF ou CNPJ *</Label>
                          <Input
                            id="cpfCnpj"
                            placeholder="000.000.000-00"
                            value={formData.cpfCnpj}
                            onChange={(e) => handleCpfCnpjChange(e.target.value)}
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="companyName">Nome do Escritório (opcional)</Label>
                        <Input
                          id="companyName"
                          placeholder="Silva & Advogados"
                          value={formData.companyName}
                          onChange={(e) =>
                            setFormData({ ...formData, companyName: e.target.value })
                          }
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          Será usado como nome da sua plataforma
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 4: Payment */}
                {step === 'payment' && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-2xl font-bold mb-2">Forma de Pagamento</h2>
                      <p className="text-muted-foreground">
                        Escolha como deseja pagar sua assinatura
                      </p>
                    </div>

                    <RadioGroup
                      value={formData.paymentMethod}
                      onValueChange={(value) =>
                        setFormData({
                          ...formData,
                          paymentMethod: value as 'credit_card' | 'pix' | 'boleto',
                        })
                      }
                    >
                      <Card
                        className={`cursor-pointer ${
                          formData.paymentMethod === 'credit_card' ? 'border-primary' : ''
                        }`}
                        onClick={() =>
                          setFormData({ ...formData, paymentMethod: 'credit_card' })
                        }
                      >
                        <CardContent className="pt-6">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <CreditCard className="h-5 w-5 text-primary" />
                              <div>
                                <p className="font-medium">Cartão de Crédito</p>
                                <p className="text-sm text-muted-foreground">
                                  Recorrência automática
                                </p>
                              </div>
                            </div>
                            <RadioGroupItem value="credit_card" />
                          </div>
                        </CardContent>
                      </Card>

                      <Card
                        className={`cursor-pointer ${
                          formData.paymentMethod === 'pix' ? 'border-primary' : ''
                        }`}
                        onClick={() => setFormData({ ...formData, paymentMethod: 'pix' })}
                      >
                        <CardContent className="pt-6">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <QrCode className="h-5 w-5 text-primary" />
                              <div>
                                <p className="font-medium">PIX</p>
                                <p className="text-sm text-muted-foreground">
                                  Pagamento instantâneo
                                </p>
                              </div>
                            </div>
                            <RadioGroupItem value="pix" />
                          </div>
                        </CardContent>
                      </Card>

                      <Card
                        className={`cursor-pointer ${
                          formData.paymentMethod === 'boleto' ? 'border-primary' : ''
                        }`}
                        onClick={() => setFormData({ ...formData, paymentMethod: 'boleto' })}
                      >
                        <CardContent className="pt-6">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <Package className="h-5 w-5 text-primary" />
                              <div>
                                <p className="font-medium">Boleto Bancário</p>
                                <p className="text-sm text-muted-foreground">
                                  Vencimento em 3 dias
                                </p>
                              </div>
                            </div>
                            <RadioGroupItem value="boleto" />
                          </div>
                        </CardContent>
                      </Card>
                    </RadioGroup>

                    <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                      <p className="text-sm text-blue-900 dark:text-blue-100">
                        <strong>🔒 Pagamento Seguro</strong>
                        <br />
                        Seus dados são protegidos com criptografia de ponta a ponta. Processamos
                        pagamentos via Stripe, certificado PCI-DSS nível 1.
                      </p>
                    </div>
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex items-center justify-between mt-8 pt-6 border-t">
                  {step !== 'plan' && (
                    <Button variant="outline" onClick={handlePreviousStep}>
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Voltar
                    </Button>
                  )}
                  {step === 'plan' && <div />}

                  {step !== 'payment' ? (
                    <Button onClick={handleNextStep}>
                      Continuar
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  ) : (
                    <Button onClick={handleSubmit} disabled={isProcessing} size="lg">
                      {isProcessing ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Processando...
                        </>
                      ) : (
                        <>
                          Finalizar Assinatura
                          <ArrowRight className="h-4 w-4 ml-2" />
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>Resumo do Pedido</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {selectedPlan && (
                  <>
                    <div className="pb-4 border-b">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-semibold">{selectedPlan.name}</p>
                          <p className="text-xs text-muted-foreground">Assinatura mensal</p>
                        </div>
                        <p className="font-semibold">{formatCurrency(selectedPlan.price)}</p>
                      </div>
                    </div>

                    {selectedAddons.length > 0 && (
                      <div className="pb-4 border-b space-y-2">
                        <p className="text-sm font-medium text-muted-foreground">Add-ons:</p>
                        {selectedAddons.map((addonId) => {
                          const addon = ADDONS.find((a) => a.id === addonId)
                          if (!addon) return null
                          return (
                            <div key={addonId} className="flex justify-between text-sm">
                              <span>{addon.name}</span>
                              <span>{formatCurrency(addon.price)}</span>
                            </div>
                          )
                        })}
                      </div>
                    )}

                    <div className="pt-4 border-t">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-semibold">Total Mensal</span>
                        <span className="text-2xl font-bold text-primary">
                          {formatCurrency(calculateTotal())}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Renovação automática. Cancele quando quiser.
                      </p>
                    </div>

                    <div className="bg-green-50 dark:bg-green-950/20 rounded-lg p-3">
                      <p className="text-sm text-green-900 dark:text-green-100">
                        ✅ <strong>7 dias de garantia</strong>
                        <br />
                        <span className="text-xs">
                          Não gostou? Devolvemos 100% do valor em até 7 dias
                        </span>
                      </p>
                    </div>
                  </>
                )}

                {!selectedPlan && (
                  <p className="text-sm text-muted-foreground text-center py-8">
                    Selecione um plano para ver o resumo
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
