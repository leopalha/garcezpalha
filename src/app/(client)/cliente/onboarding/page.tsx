'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { Check, ChevronRight, ChevronLeft, Upload, Calendar, User, FileText, Sparkles, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Progress } from '@/components/ui/progress'
import { cn } from '@/lib/utils'

const ONBOARDING_STEPS = [
  {
    id: 1,
    title: 'Bem-vindo!',
    description: 'Vamos configurar sua conta em alguns passos simples',
    icon: Sparkles
  },
  {
    id: 2,
    title: 'Complete seu Perfil',
    description: 'Informações pessoais básicas',
    icon: User
  },
  {
    id: 3,
    title: 'Sobre seu Caso',
    description: 'Conte-nos um pouco sobre o que você precisa',
    icon: FileText
  },
  {
    id: 4,
    title: 'Documentos Iniciais',
    description: 'Faça upload dos documentos básicos',
    icon: Upload
  },
  {
    id: 5,
    title: 'Agende sua Primeira Conversa',
    description: 'Fale com seu advogado',
    icon: Calendar
  },
  {
    id: 6,
    title: 'Tudo Pronto!',
    description: 'Conheça a plataforma',
    icon: Check
  }
]

interface OnboardingData {
  // Step 2: Profile
  phone?: string
  address?: string
  city?: string
  state?: string
  cep?: string

  // Step 3: Case info
  caseDescription?: string
  urgencyLevel?: 'low' | 'medium' | 'high'

  // Step 4: Documents
  uploadedDocs: string[]

  // Step 5: Meeting
  preferredDate?: string
  preferredTime?: string
  meetingNotes?: string
}

export default function ClientOnboardingPage() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const [currentStep, setCurrentStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [onboardingData, setOnboardingData] = useState<OnboardingData>({
    uploadedDocs: []
  })

  // Check if user has already completed onboarding
  useEffect(() => {
    const checkOnboardingStatus = async () => {
      if (session?.user?.id) {
        try {
          const response = await fetch('/api/client/onboarding/status')
          if (response.ok) {
            const data = await response.json()
            if (data.completed) {
              // Already completed, redirect to dashboard
              router.push('/cliente/dashboard')
            }
          }
        } catch (error) {
          console.error('Error checking onboarding status:', error)
        }
      }
    }

    if (status === 'authenticated') {
      checkOnboardingStatus()
    } else if (status === 'unauthenticated') {
      router.push('/auth/signin')
    }
  }, [session, status, router])

  const updateData = (updates: Partial<OnboardingData>) => {
    setOnboardingData(prev => ({ ...prev, ...updates }))
  }

  const handleNext = async () => {
    if (currentStep < ONBOARDING_STEPS.length) {
      // Save progress before moving to next step
      await saveProgress()
      setCurrentStep(prev => prev + 1)
    } else {
      // Final step - complete onboarding
      await completeOnboarding()
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1)
    }
  }

  const saveProgress = async () => {
    try {
      setIsSaving(true)
      await fetch('/api/client/onboarding/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          step: currentStep,
          data: onboardingData
        })
      })
    } catch (error) {
      console.error('Error saving progress:', error)
    } finally {
      setIsSaving(false)
    }
  }

  const completeOnboarding = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/client/onboarding/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(onboardingData)
      })

      if (response.ok) {
        router.push('/cliente/dashboard?onboarding=complete')
      } else {
        throw new Error('Failed to complete onboarding')
      }
    } catch (error) {
      console.error('Error completing onboarding:', error)
      alert('Erro ao finalizar onboarding. Tente novamente.')
    } finally {
      setIsLoading(false)
    }
  }

  const progress = (currentStep / ONBOARDING_STEPS.length) * 100

  if (status === 'loading' || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-muted-foreground">
              Etapa {currentStep} de {ONBOARDING_STEPS.length}
            </span>
            <span className="text-sm font-medium text-primary">
              {Math.round(progress)}% completo
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Steps Indicator */}
        <div className="flex justify-between mb-8 overflow-x-auto pb-4">
          {ONBOARDING_STEPS.map((step, index) => {
            const Icon = step.icon
            const isActive = currentStep === step.id
            const isCompleted = currentStep > step.id

            return (
              <div
                key={step.id}
                className={cn(
                  'flex flex-col items-center min-w-[100px] relative',
                  index !== ONBOARDING_STEPS.length - 1 && 'after:content-[""] after:absolute after:top-5 after:left-[60%] after:w-full after:h-[2px] after:bg-border'
                )}
              >
                <div
                  className={cn(
                    'w-10 h-10 rounded-full flex items-center justify-center mb-2 transition-colors relative z-10',
                    isActive && 'bg-primary text-primary-foreground',
                    isCompleted && 'bg-primary text-primary-foreground',
                    !isActive && !isCompleted && 'bg-muted text-muted-foreground'
                  )}
                >
                  {isCompleted ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    <Icon className="w-5 h-5" />
                  )}
                </div>
                <span className={cn(
                  'text-xs text-center font-medium',
                  isActive && 'text-foreground',
                  !isActive && 'text-muted-foreground'
                )}>
                  {step.title}
                </span>
              </div>
            )
          })}
        </div>

        {/* Step Content */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-2xl">
              {ONBOARDING_STEPS[currentStep - 1].title}
            </CardTitle>
            <CardDescription>
              {ONBOARDING_STEPS[currentStep - 1].description}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Step 1: Welcome */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <div className="bg-primary/10 rounded-lg p-6 text-center">
                  <Sparkles className="w-12 h-12 text-primary mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">
                    Bem-vindo ao Garcez Palha!
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Obrigado por confiar em nós. Vamos configurar tudo em poucos minutos
                    para que você possa acompanhar seu caso de forma simples e transparente.
                  </p>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div className="text-center p-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-2">
                      <FileText className="w-6 h-6 text-primary" />
                    </div>
                    <h4 className="font-medium mb-1">Acompanhe seu Caso</h4>
                    <p className="text-sm text-muted-foreground">
                      Veja o status e próximos passos em tempo real
                    </p>
                  </div>

                  <div className="text-center p-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-2">
                      <User className="w-6 h-6 text-primary" />
                    </div>
                    <h4 className="font-medium mb-1">Fale com seu Advogado</h4>
                    <p className="text-sm text-muted-foreground">
                      Chat direto e agendamento de reuniões
                    </p>
                  </div>

                  <div className="text-center p-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-2">
                      <Upload className="w-6 h-6 text-primary" />
                    </div>
                    <h4 className="font-medium mb-1">Envie Documentos</h4>
                    <p className="text-sm text-muted-foreground">
                      Upload seguro e organizado por caso
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Profile */}
            {currentStep === 2 && (
              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Telefone *</Label>
                    <Input
                      id="phone"
                      placeholder="(00) 00000-0000"
                      value={onboardingData.phone || ''}
                      onChange={(e) => updateData({ phone: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cep">CEP</Label>
                    <Input
                      id="cep"
                      placeholder="00000-000"
                      value={onboardingData.cep || ''}
                      onChange={(e) => updateData({ cep: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Endereço Completo</Label>
                  <Input
                    id="address"
                    placeholder="Rua, número, complemento"
                    value={onboardingData.address || ''}
                    onChange={(e) => updateData({ address: e.target.value })}
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">Cidade</Label>
                    <Input
                      id="city"
                      placeholder="São Paulo"
                      value={onboardingData.city || ''}
                      onChange={(e) => updateData({ city: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="state">Estado</Label>
                    <Input
                      id="state"
                      placeholder="SP"
                      maxLength={2}
                      value={onboardingData.state || ''}
                      onChange={(e) => updateData({ state: e.target.value.toUpperCase() })}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Case Info */}
            {currentStep === 3 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="caseDescription">
                    Conte-nos um pouco sobre o que você precisa *
                  </Label>
                  <Textarea
                    id="caseDescription"
                    placeholder="Descreva brevemente sua situação e o que você espera do nosso trabalho..."
                    rows={6}
                    value={onboardingData.caseDescription || ''}
                    onChange={(e) => updateData({ caseDescription: e.target.value })}
                  />
                  <p className="text-sm text-muted-foreground">
                    Não se preocupe, você poderá fornecer mais detalhes depois. Isso nos ajuda a preparar melhor para a primeira conversa.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label>Qual o nível de urgência?</Label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['low', 'medium', 'high'] as const).map((level) => (
                      <Button
                        key={level}
                        type="button"
                        variant={onboardingData.urgencyLevel === level ? 'default' : 'outline'}
                        onClick={() => updateData({ urgencyLevel: level })}
                        className="justify-center"
                      >
                        {level === 'low' && 'Baixa'}
                        {level === 'medium' && 'Média'}
                        {level === 'high' && 'Alta'}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Documents */}
            {currentStep === 4 && (
              <div className="space-y-4">
                <div className="bg-muted rounded-lg p-4">
                  <h4 className="font-medium mb-2">Documentos Recomendados:</h4>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>• RG ou CNH (frente e verso)</li>
                    <li>• CPF</li>
                    <li>• Comprovante de residência</li>
                    <li>• Qualquer documento relacionado ao seu caso</li>
                  </ul>
                  <p className="text-xs text-muted-foreground mt-3">
                    Não se preocupe se não tiver todos agora. Você poderá enviar mais documentos depois.
                  </p>
                </div>

                <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer">
                  <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                  <h4 className="font-medium mb-1">Arraste arquivos aqui</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    ou clique para selecionar
                  </p>
                  <Button variant="outline" size="sm">
                    Selecionar Arquivos
                  </Button>
                  <p className="text-xs text-muted-foreground mt-3">
                    PDF, JPG ou PNG • Máximo 10MB por arquivo
                  </p>
                </div>

                {onboardingData.uploadedDocs.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-medium">Arquivos Enviados:</h4>
                    {onboardingData.uploadedDocs.map((doc, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm">{doc}</span>
                        </div>
                        <Check className="w-4 h-4 text-green-600" />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Step 5: Schedule Meeting */}
            {currentStep === 5 && (
              <div className="space-y-4">
                <div className="bg-primary/10 rounded-lg p-4 mb-4">
                  <h4 className="font-medium mb-2">Primeira Conversa com seu Advogado</h4>
                  <p className="text-sm text-muted-foreground">
                    Vamos agendar uma videochamada de 30 minutos para entender melhor seu caso
                    e explicar os próximos passos.
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="preferredDate">Data Preferida</Label>
                    <Input
                      id="preferredDate"
                      type="date"
                      min={new Date().toISOString().split('T')[0]}
                      value={onboardingData.preferredDate || ''}
                      onChange={(e) => updateData({ preferredDate: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="preferredTime">Horário Preferido</Label>
                    <Input
                      id="preferredTime"
                      type="time"
                      value={onboardingData.preferredTime || ''}
                      onChange={(e) => updateData({ preferredTime: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="meetingNotes">
                    Há algo específico que você gostaria de discutir? (opcional)
                  </Label>
                  <Textarea
                    id="meetingNotes"
                    placeholder="Ex: Tenho dúvidas sobre prazos, custos, documentação necessária..."
                    rows={4}
                    value={onboardingData.meetingNotes || ''}
                    onChange={(e) => updateData({ meetingNotes: e.target.value })}
                  />
                </div>

                <div className="bg-muted rounded-lg p-4">
                  <p className="text-sm text-muted-foreground">
                    <strong>Importante:</strong> Você receberá um email de confirmação com o link
                    da videochamada e instruções. O advogado entrará em contato caso precise
                    ajustar o horário.
                  </p>
                </div>
              </div>
            )}

            {/* Step 6: Complete */}
            {currentStep === 6 && (
              <div className="space-y-4 text-center">
                <div className="bg-green-50 dark:bg-green-950/20 rounded-lg p-8">
                  <div className="w-16 h-16 bg-green-100 dark:bg-green-900/40 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Check className="w-8 h-8 text-green-600 dark:text-green-400" />
                  </div>
                  <h3 className="text-2xl font-bold mb-2">Tudo Pronto!</h3>
                  <p className="text-muted-foreground mb-6">
                    Sua conta está configurada. Agora você pode acompanhar tudo pela plataforma.
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-4 text-left">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <FileText className="w-5 h-5 text-primary" />
                        Dashboard do Cliente
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        Veja o status do seu caso, próximos passos e documentos pendentes
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <User className="w-5 h-5 text-primary" />
                        Chat com Advogado
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        Envie mensagens e tire dúvidas diretamente com seu advogado
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Upload className="w-5 h-5 text-primary" />
                        Gestão de Documentos
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        Envie e visualize documentos de forma organizada e segura
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-primary" />
                        Notificações
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        Receba alertas sobre prazos, atualizações e mensagens
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 1 || isLoading}
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            {isSaving && (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Salvando...</span>
              </>
            )}
          </div>

          <Button
            onClick={handleNext}
            disabled={isLoading || isSaving}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Finalizando...
              </>
            ) : currentStep === ONBOARDING_STEPS.length ? (
              <>
                Ir para Dashboard
                <Check className="w-4 h-4 ml-2" />
              </>
            ) : (
              <>
                Próximo
                <ChevronRight className="w-4 h-4 ml-2" />
              </>
            )}
          </Button>
        </div>

        {/* Progress Indicator */}
        <div className="mt-6 text-center text-sm text-muted-foreground">
          Seu progresso é salvo automaticamente
        </div>
      </div>
    </div>
  )
}
