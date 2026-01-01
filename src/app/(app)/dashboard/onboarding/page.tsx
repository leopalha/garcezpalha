'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Check, ArrowRight, ArrowLeft, Home, Gavel, Heart,
  Briefcase, Users, Car, Globe, Bot, Sparkles,
  Upload, Palette, Building2, CheckCircle2
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useAnalytics } from '@/hooks/use-analytics'
import { useEffect, useState as useReactState } from 'react'

const NICHOS_DISPONIVEIS = [
  {
    id: 'imobiliario',
    name: 'Direito Imobiliário',
    icon: Home,
    agent: 'RealEstateAgent',
    description: 'Usucapião, Regularização, Holdings Familiares',
    color: 'from-blue-500 to-cyan-500',
    questionsCount: 47,
    templatesCount: 8,
    conversaoMedia: '21%'
  },
  {
    id: 'criminal',
    name: 'Direito Criminal',
    icon: Gavel,
    agent: 'CriminalLawAgent',
    description: 'Habeas Corpus, Defesas, Recursos',
    color: 'from-red-500 to-orange-500',
    questionsCount: 52,
    templatesCount: 12,
    conversaoMedia: '18%'
  },
  {
    id: 'saude',
    name: 'Direito da Saúde',
    icon: Heart,
    agent: 'MedicalExpertiseAgent',
    description: 'Planos de Saúde, INSS, BPC-LOAS',
    color: 'from-pink-500 to-rose-500',
    questionsCount: 38,
    templatesCount: 6,
    conversaoMedia: '24%'
  },
  {
    id: 'trabalhista',
    name: 'Direito Trabalhista',
    icon: Briefcase,
    agent: 'LaborAgent',
    description: 'Rescisões, Horas Extras, Assédio',
    color: 'from-amber-500 to-yellow-500',
    questionsCount: 43,
    templatesCount: 9,
    conversaoMedia: '19%'
  },
  {
    id: 'consumidor',
    name: 'Direito do Consumidor',
    icon: Users,
    agent: 'ConsumerAgent',
    description: 'Negativações, Golpes, Cobranças Abusivas',
    color: 'from-green-500 to-emerald-500',
    questionsCount: 35,
    templatesCount: 7,
    conversaoMedia: '22%'
  },
  {
    id: 'transito',
    name: 'Direito de Trânsito',
    icon: Car,
    agent: 'TrafficAgent',
    description: 'Multas, CNH, Recursos',
    color: 'from-violet-500 to-purple-500',
    questionsCount: 28,
    templatesCount: 5,
    conversaoMedia: '16%'
  },
]

type Step = 'welcome' | 'choose-mode' | 'select-nicho' | 'setup-brand' | 'complete'

export default function OnboardingPage() {
  const router = useRouter()
  const { trackOnboarding } = useAnalytics()
  const [step, setStep] = useState<Step>('welcome')
  const [selectedMode, setSelectedMode] = useState<'nicho' | 'generico' | null>(null)
  const [selectedNicho, setSelectedNicho] = useState<string | null>(null)
  const [startTime] = useState(Date.now())
  const [brandSetup, setBrandSetup] = useState({
    nome: '',
    logo: null as File | null,
    corPrimaria: '#2563eb',
    corSecundaria: '#6366f1'
  })

  const TOTAL_STEPS = 5 // welcome, choose-mode, select-nicho, setup-brand, complete
  const getCurrentStepNumber = () => {
    const steps: Step[] = ['welcome', 'choose-mode', 'select-nicho', 'setup-brand', 'complete']
    return steps.indexOf(step) + 1
  }

  const handleNext = () => {
    if (step === 'welcome') setStep('choose-mode')
    else if (step === 'choose-mode') {
      if (selectedMode === 'nicho') setStep('select-nicho')
      else setStep('setup-brand')
    }
    else if (step === 'select-nicho') setStep('setup-brand')
    else if (step === 'setup-brand') setStep('complete')
  }

  const handleBack = () => {
    if (step === 'choose-mode') setStep('welcome')
    else if (step === 'select-nicho') setStep('choose-mode')
    else if (step === 'setup-brand') {
      if (selectedMode === 'nicho') setStep('select-nicho')
      else setStep('choose-mode')
    }
  }

  const handleComplete = () => {
    // Aqui você salvaria no backend
    // Redireciona para o painel administrativo
    router.push('/admin')
  }

  const canProceed = () => {
    if (step === 'welcome') return true
    if (step === 'choose-mode') return selectedMode !== null
    if (step === 'select-nicho') return selectedNicho !== null
    if (step === 'setup-brand') return brandSetup.nome.length > 0
    return false
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Progress Bar */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-slate-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center">
                <span className="text-white font-bold text-xl">GP</span>
              </div>
              <span className="font-bold">Configuração Inicial</span>
            </div>
            <Badge variant="secondary">
              {step === 'welcome' && 'Passo 1/4'}
              {step === 'choose-mode' && 'Passo 2/4'}
              {step === 'select-nicho' && 'Passo 3/4'}
              {step === 'setup-brand' && 'Passo 4/4'}
              {step === 'complete' && 'Completo!'}
            </Badge>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-blue-600 to-indigo-600 h-2 rounded-full transition-all duration-500"
              style={{
                width: step === 'welcome' ? '25%' :
                       step === 'choose-mode' ? '50%' :
                       step === 'select-nicho' ? '75%' :
                       step === 'setup-brand' ? '90%' : '100%'
              }}
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="pt-32 pb-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">

            {/* STEP 1: Welcome */}
            {step === 'welcome' && (
              <div className="text-center">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center mx-auto mb-6">
                  <Sparkles className="w-10 h-10 text-blue-600" />
                </div>
                <h1 className="text-4xl md:text-5xl font-bold mb-4">
                  Bem-vindo à Garcez Palha!
                </h1>
                <p className="text-xl text-muted-foreground mb-8">
                  Vamos configurar sua plataforma em menos de 60 segundos.
                  <br />
                  <strong>Tudo já vem pronto pra você começar a capturar leads HOJE.</strong>
                </p>

                <Card className="border-2 border-blue-200 bg-blue-50/50 mb-8">
                  <CardContent className="p-8">
                    <h3 className="font-bold text-lg mb-4">O que vamos fazer:</h3>
                    <div className="grid md:grid-cols-2 gap-4 text-left">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center flex-shrink-0 mt-0.5">
                          1
                        </div>
                        <div>
                          <p className="font-semibold">Escolher modo de operação</p>
                          <p className="text-sm text-muted-foreground">Nicho específico ou genérico</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center flex-shrink-0 mt-0.5">
                          2
                        </div>
                        <div>
                          <p className="font-semibold">Selecionar sua área (opcional)</p>
                          <p className="text-sm text-muted-foreground">Agent IA já vem configurado</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center flex-shrink-0 mt-0.5">
                          3
                        </div>
                        <div>
                          <p className="font-semibold">Configurar sua marca</p>
                          <p className="text-sm text-muted-foreground">Logo, cores e nome</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center flex-shrink-0 mt-0.5">
                          4
                        </div>
                        <div>
                          <p className="font-semibold">Começar a capturar leads!</p>
                          <p className="text-sm text-muted-foreground">Plataforma 100% pronta</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Button size="lg" onClick={handleNext} className="bg-gradient-to-r from-blue-600 to-indigo-600 text-lg px-12">
                  Vamos Começar
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            )}

            {/* STEP 2: Choose Mode */}
            {step === 'choose-mode' && (
              <div>
                <div className="text-center mb-12">
                  <h2 className="text-4xl font-bold mb-4">Como você quer começar?</h2>
                  <p className="text-xl text-muted-foreground">
                    Escolha o modelo que faz mais sentido para seu escritório
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  <Card
                    className={`cursor-pointer transition-all hover:shadow-lg ${
                      selectedMode === 'nicho' ? 'border-blue-500 border-2 shadow-lg' : ''
                    }`}
                    onClick={() => setSelectedMode('nicho')}
                  >
                    <CardContent className="p-8">
                      {selectedMode === 'nicho' && (
                        <Badge className="mb-4 bg-blue-600 text-white">
                          <Check className="w-4 h-4 mr-1" />
                          Selecionado
                        </Badge>
                      )}
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center mb-6">
                        <Bot className="w-8 h-8 text-blue-600" />
                      </div>
                      <h3 className="text-2xl font-bold mb-3">Nicho Especializado</h3>
                      <Badge className="mb-4 bg-green-100 text-green-700 border-green-200">
                        Recomendado
                      </Badge>
                      <p className="text-muted-foreground mb-6">
                        Perfeito se você atua principalmente em 1 área específica do direito.
                      </p>

                      <div className="space-y-3 mb-6">
                        <div className="flex items-start gap-2">
                          <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">Agent IA já treinado na sua área</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">Perguntas especializadas pré-configuradas</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">Templates de propostas prontos</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">Maior taxa de conversão (18-24%)</span>
                        </div>
                      </div>

                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <p className="text-sm text-blue-900">
                          <strong>Exemplo:</strong> Se você escolher "Imobiliário",
                          o Agent já sabe perguntar sobre tempo de posse, documentação,
                          tipo de imóvel, etc.
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card
                    className={`cursor-pointer transition-all hover:shadow-lg ${
                      selectedMode === 'generico' ? 'border-slate-500 border-2 shadow-lg' : ''
                    }`}
                    onClick={() => setSelectedMode('generico')}
                  >
                    <CardContent className="p-8">
                      {selectedMode === 'generico' && (
                        <Badge className="mb-4 bg-slate-600 text-white">
                          <Check className="w-4 h-4 mr-1" />
                          Selecionado
                        </Badge>
                      )}
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center mb-6">
                        <Globe className="w-8 h-8 text-slate-600" />
                      </div>
                      <h3 className="text-2xl font-bold mb-3">Agent Genérico</h3>
                      <p className="text-muted-foreground mb-6">
                        Ideal para advogados generalistas que atendem diversas áreas.
                      </p>

                      <div className="space-y-3 mb-6">
                        <div className="flex items-start gap-2">
                          <Check className="w-5 h-5 text-slate-600 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">Atende qualquer área do direito</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <Check className="w-5 h-5 text-slate-600 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">Você cria suas próprias perguntas</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <Check className="w-5 h-5 text-slate-600 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">Total flexibilidade e controle</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <Check className="w-5 h-5 text-slate-600 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">Bom para quem quer personalizar tudo</span>
                        </div>
                      </div>

                      <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                        <p className="text-sm text-slate-700">
                          <strong>Exemplo:</strong> Agent faz perguntas genéricas como
                          "Qual seu problema jurídico?" e você define o fluxo depois.
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="flex items-center justify-between mt-12">
                  <Button variant="outline" onClick={handleBack}>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Voltar
                  </Button>
                  <Button
                    size="lg"
                    onClick={handleNext}
                    disabled={!canProceed()}
                    className="bg-gradient-to-r from-blue-600 to-indigo-600"
                  >
                    Continuar
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </div>
              </div>
            )}

            {/* STEP 3: Select Nicho */}
            {step === 'select-nicho' && selectedMode === 'nicho' && (
              <div>
                <div className="text-center mb-12">
                  <Badge className="mb-4 bg-blue-100 text-blue-700 border-blue-200 px-4 py-2">
                    Incluído no Seu Plano
                  </Badge>
                  <h2 className="text-4xl font-bold mb-4">Escolha Sua Área de Atuação</h2>
                  <p className="text-xl text-muted-foreground">
                    Selecione o nicho principal do seu escritório
                  </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {NICHOS_DISPONIVEIS.map((nicho) => {
                    const Icon = nicho.icon
                    const isSelected = selectedNicho === nicho.id

                    return (
                      <Card
                        key={nicho.id}
                        className={`cursor-pointer transition-all hover:shadow-lg ${
                          isSelected ? 'border-blue-500 border-2 shadow-lg' : ''
                        }`}
                        onClick={() => setSelectedNicho(nicho.id)}
                      >
                        <CardContent className="p-6">
                          {isSelected && (
                            <Badge className="mb-3 bg-blue-600 text-white">
                              <Check className="w-3 h-3 mr-1" />
                              Selecionado
                            </Badge>
                          )}
                          <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${nicho.color} flex items-center justify-center mb-4`}>
                            <Icon className="w-7 h-7 text-white" />
                          </div>
                          <h3 className="font-bold text-lg mb-2">{nicho.name}</h3>
                          <p className="text-sm text-muted-foreground mb-4">
                            {nicho.description}
                          </p>

                          <div className="space-y-2 text-sm">
                            <div className="flex items-center justify-between">
                              <span className="text-muted-foreground">Agent IA:</span>
                              <Badge variant="secondary" className="text-xs">
                                {nicho.agent}
                              </Badge>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-muted-foreground">Perguntas:</span>
                              <span className="font-semibold">{nicho.questionsCount}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-muted-foreground">Templates:</span>
                              <span className="font-semibold">{nicho.templatesCount}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-muted-foreground">Conversão média:</span>
                              <span className="font-semibold text-green-600">{nicho.conversaoMedia}</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>

                <div className="flex items-center justify-between mt-12">
                  <Button variant="outline" onClick={handleBack}>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Voltar
                  </Button>
                  <Button
                    size="lg"
                    onClick={handleNext}
                    disabled={!canProceed()}
                    className="bg-gradient-to-r from-blue-600 to-indigo-600"
                  >
                    Continuar
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </div>
              </div>
            )}

            {/* STEP 4: Setup Brand */}
            {step === 'setup-brand' && (
              <div>
                <div className="text-center mb-12">
                  <h2 className="text-4xl font-bold mb-4">Configure Sua Marca</h2>
                  <p className="text-xl text-muted-foreground">
                    Personalize a aparência da sua plataforma
                  </p>
                </div>

                <Card>
                  <CardContent className="p-8">
                    <div className="space-y-6">
                      <div>
                        <Label htmlFor="nome">Nome do Escritório *</Label>
                        <Input
                          id="nome"
                          placeholder="Ex: Silva & Associados"
                          value={brandSetup.nome}
                          onChange={(e) => setBrandSetup({...brandSetup, nome: e.target.value})}
                          className="mt-2"
                        />
                      </div>

                      <div>
                        <Label>Logo (opcional)</Label>
                        <div className="mt-2 border-2 border-dashed border-slate-300 rounded-lg p-8 text-center hover:border-blue-500 transition cursor-pointer">
                          <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                          <p className="text-sm text-muted-foreground">
                            Clique para fazer upload ou arraste aqui
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            PNG, JPG ou SVG até 2MB
                          </p>
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <Label htmlFor="cor-primaria">Cor Primária</Label>
                          <div className="mt-2 flex items-center gap-3">
                            <input
                              type="color"
                              id="cor-primaria"
                              value={brandSetup.corPrimaria}
                              onChange={(e) => setBrandSetup({...brandSetup, corPrimaria: e.target.value})}
                              className="w-16 h-16 rounded-lg cursor-pointer"
                            />
                            <div>
                              <p className="font-mono text-sm">{brandSetup.corPrimaria}</p>
                              <p className="text-xs text-muted-foreground">Botões, links, destaques</p>
                            </div>
                          </div>
                        </div>

                        <div>
                          <Label htmlFor="cor-secundaria">Cor Secundária</Label>
                          <div className="mt-2 flex items-center gap-3">
                            <input
                              type="color"
                              id="cor-secundaria"
                              value={brandSetup.corSecundaria}
                              onChange={(e) => setBrandSetup({...brandSetup, corSecundaria: e.target.value})}
                              className="w-16 h-16 rounded-lg cursor-pointer"
                            />
                            <div>
                              <p className="font-mono text-sm">{brandSetup.corSecundaria}</p>
                              <p className="text-xs text-muted-foreground">Acentos, hover states</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="bg-slate-50 border border-slate-200 rounded-lg p-6 mt-8">
                        <p className="font-semibold mb-3 flex items-center gap-2">
                          <Palette className="w-5 h-5" />
                          Preview
                        </p>
                        <div className="space-y-3">
                          <div
                            className="rounded-lg p-4 text-white font-semibold"
                            style={{backgroundColor: brandSetup.corPrimaria}}
                          >
                            Botão Primário
                          </div>
                          <div
                            className="rounded-lg p-4 text-white font-semibold"
                            style={{backgroundColor: brandSetup.corSecundaria}}
                          >
                            Botão Secundário
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="flex items-center justify-between mt-12">
                  <Button variant="outline" onClick={handleBack}>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Voltar
                  </Button>
                  <Button
                    size="lg"
                    onClick={handleNext}
                    disabled={!canProceed()}
                    className="bg-gradient-to-r from-blue-600 to-indigo-600"
                  >
                    Finalizar
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </div>
              </div>
            )}

            {/* STEP 5: Complete */}
            {step === 'complete' && (
              <div className="text-center">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-green-100 to-emerald-100 flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 className="w-12 h-12 text-green-600" />
                </div>
                <h1 className="text-4xl md:text-5xl font-bold mb-4">
                  Tudo Pronto!
                </h1>
                <p className="text-xl text-muted-foreground mb-8">
                  Sua plataforma está configurada e pronta para capturar leads.
                </p>

                <Card className="border-2 border-green-200 bg-green-50/50 mb-8">
                  <CardContent className="p-8">
                    <h3 className="font-bold text-lg mb-4">O que foi configurado:</h3>
                    <div className="grid md:grid-cols-2 gap-6 text-left">
                      <div className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="font-semibold">Agent IA Ativo</p>
                          <p className="text-sm text-muted-foreground">
                            {selectedMode === 'nicho'
                              ? `${NICHOS_DISPONIVEIS.find(n => n.id === selectedNicho)?.name} configurado`
                              : 'Agent Genérico pronto'
                            }
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="font-semibold">Marca Configurada</p>
                          <p className="text-sm text-muted-foreground">{brandSetup.nome}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="font-semibold">Dashboard Ativo</p>
                          <p className="text-sm text-muted-foreground">CRM + Analytics prontos</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="font-semibold">Ferramentas Liberadas</p>
                          <p className="text-sm text-muted-foreground">Criar produtos, landing pages</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Button
                    size="lg"
                    onClick={handleComplete}
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 text-lg px-12"
                  >
                    Acessar Dashboard
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                  <Button size="lg" variant="outline">
                    Ver Tutorial Rápido (2min)
                  </Button>
                </div>

                <p className="text-sm text-muted-foreground mt-8">
                  Precisa de ajuda? Acesse nossa{' '}
                  <a href="/docs" className="text-blue-600 hover:underline">
                    documentação completa
                  </a>
                  {' '}ou fale conosco no WhatsApp.
                </p>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  )
}
