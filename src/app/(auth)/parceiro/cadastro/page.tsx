'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Loader2,
  AlertCircle,
  CheckCircle,
  Users,
  DollarSign,
  TrendingUp,
  Gift,
} from 'lucide-react'

type FormStep = 'info' | 'details' | 'terms' | 'success'

export default function PartnerRegistrationPage() {
  const router = useRouter()
  const [step, setStep] = useState<FormStep>('info')
  const [isLoading, setIsLoading] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const [termsAccepted, setTermsAccepted] = useState(false)

  const [formData, setFormData] = useState({
    // Step 1: Basic Info
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    // Step 2: Details
    document: '',
    company: '',
    city: '',
    state: '',
    referralSource: '',
    experience: '',
    // Step 3: Terms
    agreedToTerms: false,
    agreedToPrivacy: false,
  })

  const handleStep1Submit = (e: React.FormEvent) => {
    e.preventDefault()
    setFormError(null)

    if (formData.password !== formData.confirmPassword) {
      setFormError('As senhas não coincidem')
      return
    }

    if (formData.password.length < 8) {
      setFormError('A senha deve ter pelo menos 8 caracteres')
      return
    }

    setStep('details')
  }

  const handleStep2Submit = (e: React.FormEvent) => {
    e.preventDefault()
    setFormError(null)

    if (!formData.document) {
      setFormError('CPF/CNPJ é obrigatório')
      return
    }

    setStep('terms')
  }

  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError(null)

    if (!termsAccepted) {
      setFormError('Você precisa aceitar os termos para continuar')
      return
    }

    setIsLoading(true)

    try {
      // In a real app, this would call an API to create the partner account
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Simulate success
      setStep('success')
    } catch {
      setFormError('Erro ao criar conta. Tente novamente.')
    } finally {
      setIsLoading(false)
    }
  }

  const benefits = [
    {
      icon: DollarSign,
      title: 'Comissões Atrativas',
      description: 'Ganhe 10% de comissão por cada cliente convertido',
    },
    {
      icon: TrendingUp,
      title: 'Pagamentos Pontuais',
      description: 'Receba suas comissões no dia 15 de cada mês',
    },
    {
      icon: Users,
      title: 'Suporte Dedicado',
      description: 'Equipe de suporte exclusiva para parceiros',
    },
    {
      icon: Gift,
      title: 'Materiais de Marketing',
      description: 'Acesso a banners, textos e recursos promocionais',
    },
  ]

  if (step === 'success') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted/30 p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl">Cadastro Realizado!</CardTitle>
            <CardDescription>
              Sua solicitação de parceria foi enviada com sucesso
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-center">
            <p className="text-sm text-muted-foreground">
              Nossa equipe irá analisar seu cadastro e você receberá um email em até 48 horas
              com o status da sua aprovação.
            </p>
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm">
                <strong>Próximos passos:</strong>
              </p>
              <ul className="text-sm text-left mt-2 space-y-1">
                <li>1. Verificação dos dados cadastrais</li>
                <li>2. Análise do perfil de parceria</li>
                <li>3. Email de confirmação com acesso ao portal</li>
              </ul>
            </div>
            <Button onClick={() => router.push('/login')} className="w-full">
              Ir para Login
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <Link href="/" className="inline-block mb-4">
            <h1 className="text-3xl font-display font-bold">
              <span className="text-primary">Garcez</span>
              <span className="text-secondary"> Palha</span>
            </h1>
          </Link>
          <h2 className="text-2xl font-bold">Programa de Parceiros</h2>
          <p className="text-muted-foreground mt-2">
            Indique clientes e ganhe comissões atrativas
          </p>
        </div>

        {/* Benefits */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {benefits.map((benefit) => (
            <Card key={benefit.title} className="text-center">
              <CardContent className="pt-6">
                <benefit.icon className="h-8 w-8 mx-auto mb-2 text-primary" />
                <p className="font-medium text-sm">{benefit.title}</p>
                <p className="text-xs text-muted-foreground mt-1">{benefit.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Progress Indicator */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center gap-2">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step === 'info' || step === 'details' || step === 'terms'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground'
              }`}
            >
              1
            </div>
            <div className="w-12 h-1 bg-muted">
              <div
                className={`h-full bg-primary transition-all ${
                  step === 'details' || step === 'terms' ? 'w-full' : 'w-0'
                }`}
              />
            </div>
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step === 'details' || step === 'terms'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground'
              }`}
            >
              2
            </div>
            <div className="w-12 h-1 bg-muted">
              <div
                className={`h-full bg-primary transition-all ${
                  step === 'terms' ? 'w-full' : 'w-0'
                }`}
              />
            </div>
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step === 'terms'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground'
              }`}
            >
              3
            </div>
          </div>
        </div>

        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>
              {step === 'info' && 'Informações Básicas'}
              {step === 'details' && 'Detalhes do Parceiro'}
              {step === 'terms' && 'Termos e Condições'}
            </CardTitle>
            <CardDescription>
              {step === 'info' && 'Preencha seus dados de contato'}
              {step === 'details' && 'Informações adicionais sobre você'}
              {step === 'terms' && 'Revise e aceite os termos do programa'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {formError && (
              <div className="bg-destructive/10 text-destructive p-3 rounded-lg flex items-center gap-2 text-sm mb-4">
                <AlertCircle className="h-4 w-4" />
                <span>{formError}</span>
              </div>
            )}

            {step === 'info' && (
              <form onSubmit={handleStep1Submit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome Completo</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    placeholder="Seu nome completo"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    placeholder="seu@email.com"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Telefone</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    required
                    placeholder="(21) 99999-0000"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Senha</Label>
                  <Input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                    placeholder="Mínimo 8 caracteres"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirmar Senha</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) =>
                      setFormData({ ...formData, confirmPassword: e.target.value })
                    }
                    required
                    placeholder="Repita a senha"
                  />
                </div>

                <Button type="submit" className="w-full">
                  Continuar
                </Button>
              </form>
            )}

            {step === 'details' && (
              <form onSubmit={handleStep2Submit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="document">CPF/CNPJ</Label>
                  <Input
                    id="document"
                    value={formData.document}
                    onChange={(e) => setFormData({ ...formData, document: e.target.value })}
                    required
                    placeholder="000.000.000-00"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="company">Empresa (opcional)</Label>
                  <Input
                    id="company"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    placeholder="Nome da sua empresa"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">Cidade</Label>
                    <Input
                      id="city"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      required
                      placeholder="Sua cidade"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">Estado</Label>
                    <Input
                      id="state"
                      value={formData.state}
                      onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                      required
                      placeholder="UF"
                      maxLength={2}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="referralSource">Como conheceu nosso programa?</Label>
                  <Input
                    id="referralSource"
                    value={formData.referralSource}
                    onChange={(e) =>
                      setFormData({ ...formData, referralSource: e.target.value })
                    }
                    placeholder="Ex: Google, indicação de amigo, redes sociais..."
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="experience">Experiência com indicações</Label>
                  <Textarea
                    id="experience"
                    value={formData.experience}
                    onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                    placeholder="Conte-nos sobre sua experiência com indicações ou por que deseja ser parceiro..."
                    rows={4}
                  />
                </div>

                <div className="flex gap-2">
                  <Button type="button" variant="outline" onClick={() => setStep('info')}>
                    Voltar
                  </Button>
                  <Button type="submit" className="flex-1">
                    Continuar
                  </Button>
                </div>
              </form>
            )}

            {step === 'terms' && (
              <form onSubmit={handleFinalSubmit} className="space-y-4">
                <div className="p-4 bg-muted rounded-lg max-h-60 overflow-y-auto text-sm">
                  <h4 className="font-semibold mb-2">Termos do Programa de Parceiros</h4>
                  <p className="mb-2">
                    Ao se cadastrar como parceiro da Garcez Palha, você concorda com os seguintes
                    termos:
                  </p>
                  <ul className="list-disc pl-4 space-y-1">
                    <li>
                      Você receberá 10% de comissão sobre o valor do contrato de cada cliente
                      convertido através do seu link de indicação.
                    </li>
                    <li>
                      As comissões são pagas mensalmente, no dia 15, para valores acumulados acima
                      de R$ 100,00.
                    </li>
                    <li>
                      Você se compromete a não fazer promessas falsas ou enganosas sobre nossos
                      serviços.
                    </li>
                    <li>
                      O descumprimento dos termos pode resultar no cancelamento da parceria e
                      perda de comissões pendentes.
                    </li>
                    <li>
                      A Garcez Palha se reserva o direito de modificar os termos do programa com
                      aviso prévio de 30 dias.
                    </li>
                  </ul>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="terms"
                      checked={formData.agreedToTerms}
                      onCheckedChange={(checked: boolean | 'indeterminate') =>
                        setFormData({ ...formData, agreedToTerms: checked as boolean })
                      }
                    />
                    <label htmlFor="terms" className="text-sm">
                      Li e aceito os{' '}
                      <Link href="/termos" className="text-primary hover:underline">
                        Termos de Uso
                      </Link>{' '}
                      do programa de parceiros
                    </label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="privacy"
                      checked={formData.agreedToPrivacy}
                      onCheckedChange={(checked: boolean | 'indeterminate') =>
                        setFormData({ ...formData, agreedToPrivacy: checked as boolean })
                      }
                    />
                    <label htmlFor="privacy" className="text-sm">
                      Li e aceito a{' '}
                      <Link href="/privacidade" className="text-primary hover:underline">
                        Política de Privacidade
                      </Link>
                    </label>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button type="button" variant="outline" onClick={() => setStep('details')}>
                    Voltar
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1"
                    disabled={
                      isLoading || !formData.agreedToTerms || !formData.agreedToPrivacy
                    }
                    onClick={() => setTermsAccepted(true)}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Criando conta...
                      </>
                    ) : (
                      'Finalizar Cadastro'
                    )}
                  </Button>
                </div>
              </form>
            )}

            <div className="mt-6 pt-6 border-t text-center text-sm">
              <span className="text-muted-foreground">Já é parceiro? </span>
              <Link href="/login" className="text-primary hover:underline font-medium">
                Faça login
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
