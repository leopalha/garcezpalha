'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Package,
  FileQuestion,
  FileText,
  Sparkles,
  Eye,
  Plus,
  Trash2,
  GripVertical,
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Badge } from '@/components/ui/badge'

type Step = 'info' | 'questions' | 'proposal' | 'landing' | 'review'

type Question = {
  id: string
  text: string
  type: 'text' | 'select' | 'multiselect' | 'number' | 'date'
  options?: string[]
  required: boolean
  order: number
}

const QUESTION_TYPES = [
  { value: 'text', label: 'Texto Livre' },
  { value: 'select', label: 'Seleção Única' },
  { value: 'multiselect', label: 'Seleção Múltipla' },
  { value: 'number', label: 'Número' },
  { value: 'date', label: 'Data' },
]

export default function NewProductPage() {
  const router = useRouter()
  const [step, setStep] = useState<Step>('info')
  const [isSaving, setIsSaving] = useState(false)

  // Product Info
  const [productInfo, setProductInfo] = useState({
    name: '',
    category: '',
    description: '',
    price: '',
    estimatedTime: '',
  })

  // Questions
  const [questions, setQuestions] = useState<Question[]>([
    {
      id: '1',
      text: 'Qual é o seu nome completo?',
      type: 'text',
      required: true,
      order: 1,
    },
    {
      id: '2',
      text: 'Qual é o seu email?',
      type: 'text',
      required: true,
      order: 2,
    },
    {
      id: '3',
      text: 'Qual é o seu telefone?',
      type: 'text',
      required: true,
      order: 3,
    },
  ])

  // Proposal
  const [proposalSettings, setProposalSettings] = useState({
    autoGenerate: true,
    template: '',
    includeEstimate: true,
    includeTimeline: true,
    includeLegalBasis: true,
  })

  // Landing Page
  const [landingSettings, setLandingSettings] = useState({
    createLanding: true,
    headline: '',
    subheadline: '',
    benefits: ['', '', ''],
    cta: 'Solicitar Análise Gratuita',
    includeVSL: false,
  })

  const addQuestion = () => {
    const newQuestion: Question = {
      id: Date.now().toString(),
      text: '',
      type: 'text',
      required: false,
      order: questions.length + 1,
    }
    setQuestions([...questions, newQuestion])
  }

  const removeQuestion = (id: string) => {
    setQuestions(questions.filter((q) => q.id !== id))
  }

  const updateQuestion = (id: string, updates: Partial<Question>) => {
    setQuestions(questions.map((q) => (q.id === id ? { ...q, ...updates } : q)))
  }

  const addBenefit = () => {
    setLandingSettings({
      ...landingSettings,
      benefits: [...landingSettings.benefits, ''],
    })
  }

  const updateBenefit = (index: number, value: string) => {
    const newBenefits = [...landingSettings.benefits]
    newBenefits[index] = value
    setLandingSettings({ ...landingSettings, benefits: newBenefits })
  }

  const removeBenefit = (index: number) => {
    setLandingSettings({
      ...landingSettings,
      benefits: landingSettings.benefits.filter((_, i) => i !== index),
    })
  }

  const canProceed = () => {
    switch (step) {
      case 'info':
        return productInfo.name && productInfo.category && productInfo.price
      case 'questions':
        return questions.every((q) => q.text.trim() !== '')
      case 'proposal':
        return true
      case 'landing':
        return (
          !landingSettings.createLanding ||
          (landingSettings.headline && landingSettings.subheadline)
        )
      case 'review':
        return true
      default:
        return false
    }
  }

  const handleSave = async (status: 'draft' | 'active') => {
    setIsSaving(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setIsSaving(false)
    router.push('/dashboard/produtos')
  }

  const progressPercentage = {
    info: 20,
    questions: 40,
    proposal: 60,
    landing: 80,
    review: 100,
  }[step]

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1">
          <h2 className="text-3xl font-bold tracking-tight">Criar Novo Produto</h2>
          <p className="text-muted-foreground">Configure seu produto em 5 passos simples</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-muted rounded-full h-2 overflow-hidden">
        <div
          className="bg-primary h-full transition-all duration-300"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>

      {/* Steps Navigation */}
      <div className="flex items-center justify-between">
        {[
          { id: 'info', label: 'Informações', icon: Package },
          { id: 'questions', label: 'Perguntas', icon: FileQuestion },
          { id: 'proposal', label: 'Proposta', icon: FileText },
          { id: 'landing', label: 'Landing Page', icon: Sparkles },
          { id: 'review', label: 'Revisar', icon: Eye },
        ].map((s, index) => {
          const Icon = s.icon
          const isActive = step === s.id
          const isCompleted =
            ['info', 'questions', 'proposal', 'landing', 'review'].indexOf(step) > index
          return (
            <div
              key={s.id}
              className={`flex flex-col items-center flex-1 ${
                index > 0 ? 'border-l-2' : ''
              } ${isCompleted ? 'border-primary' : 'border-muted'}`}
            >
              <div
                className={`h-10 w-10 rounded-full flex items-center justify-center mb-2 ${
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : isCompleted
                    ? 'bg-primary/20 text-primary'
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                {isCompleted ? <Check className="h-5 w-5" /> : <Icon className="h-5 w-5" />}
              </div>
              <p
                className={`text-xs font-medium ${
                  isActive ? 'text-foreground' : 'text-muted-foreground'
                }`}
              >
                {s.label}
              </p>
            </div>
          )
        })}
      </div>

      {/* Step Content */}
      <Card>
        <CardContent className="pt-6">
          {/* STEP 1: Info */}
          {step === 'info' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-2xl font-semibold mb-2">Informações Básicas</h3>
                <p className="text-muted-foreground">
                  Defina as informações principais do seu produto ou serviço
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Nome do Produto *</Label>
                  <Input
                    id="name"
                    placeholder="Ex: Usucapião Extraordinária"
                    value={productInfo.name}
                    onChange={(e) => setProductInfo({ ...productInfo, name: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="category">Categoria *</Label>
                  <Select
                    value={productInfo.category}
                    onValueChange={(value) => setProductInfo({ ...productInfo, category: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma categoria" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="imobiliario">Direito Imobiliário</SelectItem>
                      <SelectItem value="familia">Direito de Família</SelectItem>
                      <SelectItem value="criminal">Direito Criminal</SelectItem>
                      <SelectItem value="trabalhista">Direito Trabalhista</SelectItem>
                      <SelectItem value="consumidor">Direito do Consumidor</SelectItem>
                      <SelectItem value="transito">Direito de Trânsito</SelectItem>
                      <SelectItem value="outros">Outros</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="description">Descrição</Label>
                  <Textarea
                    id="description"
                    placeholder="Descreva brevemente o serviço oferecido..."
                    rows={4}
                    value={productInfo.description}
                    onChange={(e) =>
                      setProductInfo({ ...productInfo, description: e.target.value })
                    }
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Esta descrição será usada na landing page e propostas
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="price">Preço (R$) *</Label>
                    <Input
                      id="price"
                      type="number"
                      placeholder="3500"
                      value={productInfo.price}
                      onChange={(e) => setProductInfo({ ...productInfo, price: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="estimatedTime">Prazo Estimado</Label>
                    <Input
                      id="estimatedTime"
                      placeholder="Ex: 30 a 60 dias"
                      value={productInfo.estimatedTime}
                      onChange={(e) =>
                        setProductInfo({ ...productInfo, estimatedTime: e.target.value })
                      }
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Questions - Continua igual ao que criamos antes... */}
          {step === 'questions' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-2xl font-semibold mb-2">Perguntas de Qualificação</h3>
                <p className="text-muted-foreground">
                  Configure as perguntas que seu Agent IA fará para qualificar o lead
                </p>
              </div>

              <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <div className="flex gap-3">
                  <Sparkles className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                      Integração com Agent IA
                    </p>
                    <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                      Estas perguntas serão usadas pelo Agent IA em conversas automáticas.
                      Recomendamos 8-15 perguntas para uma qualificação eficiente.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                {questions.map((question, index) => (
                  <Card key={question.id}>
                    <CardContent className="pt-6">
                      <div className="flex gap-3">
                        <div className="cursor-move pt-2">
                          <GripVertical className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <div className="flex-1 space-y-3">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <Label>Pergunta {index + 1}</Label>
                              <Input
                                placeholder="Digite a pergunta..."
                                value={question.text}
                                onChange={(e) =>
                                  updateQuestion(question.id, { text: e.target.value })
                                }
                                className="mt-1"
                              />
                            </div>
                            {index >= 3 && (
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => removeQuestion(question.id)}
                              >
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            )}
                          </div>

                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <Label className="text-xs">Tipo de Resposta</Label>
                              <Select
                                value={question.type}
                                onValueChange={(value: any) =>
                                  updateQuestion(question.id, { type: value })
                                }
                              >
                                <SelectTrigger className="mt-1">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {QUESTION_TYPES.map((type) => (
                                    <SelectItem key={type.value} value={type.value}>
                                      {type.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="flex items-end">
                              <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={question.required}
                                  onChange={(e) =>
                                    updateQuestion(question.id, {
                                      required: e.target.checked,
                                    })
                                  }
                                  className="rounded border-gray-300"
                                />
                                <span className="text-sm">Obrigatória</span>
                              </label>
                            </div>
                          </div>

                          {(question.type === 'select' || question.type === 'multiselect') && (
                            <div>
                              <Label className="text-xs">Opções (uma por linha)</Label>
                              <Textarea
                                placeholder="Opção 1&#10;Opção 2&#10;Opção 3"
                                rows={3}
                                className="mt-1 text-sm"
                                value={question.options?.join('\n') || ''}
                                onChange={(e) => {
                                  const options = e.target.value
                                    .split('\n')
                                    .map((opt) => opt.trim())
                                    .filter((opt) => opt.length > 0)
                                  updateQuestion(question.id, { options })
                                }}
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                <Button variant="outline" className="w-full" onClick={addQuestion}>
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar Pergunta
                </Button>
              </div>
            </div>
          )}

          {/* STEP 3: Proposal */}
          {step === 'proposal' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-2xl font-semibold mb-2">Configuração da Proposta</h3>
                <p className="text-muted-foreground">
                  Defina como as propostas serão geradas para este produto
                </p>
              </div>

              <div className="space-y-4">
                <Card className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20 border-purple-200 dark:border-purple-800">
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-3">
                      <div className="h-10 w-10 rounded-lg bg-purple-100 dark:bg-purple-900 flex items-center justify-center flex-shrink-0">
                        <Sparkles className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold">Geração Automática com IA</h4>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={proposalSettings.autoGenerate}
                              onChange={(e) =>
                                setProposalSettings({
                                  ...proposalSettings,
                                  autoGenerate: e.target.checked,
                                })
                              }
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                          </label>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          O Agent IA gerará automaticamente propostas personalizadas baseadas nas
                          respostas do cliente
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div>
                  <Label>Template da Proposta</Label>
                  <Textarea
                    placeholder="Personalize o template da proposta... Use variáveis como {nome_cliente}, {servico}, {valor}"
                    rows={8}
                    value={proposalSettings.template}
                    onChange={(e) =>
                      setProposalSettings({ ...proposalSettings, template: e.target.value })
                    }
                    className="font-mono text-sm"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Deixe em branco para usar o template padrão gerado por IA
                  </p>
                </div>

                <div className="space-y-3">
                  <Label>Incluir na Proposta</Label>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={proposalSettings.includeEstimate}
                        onChange={(e) =>
                          setProposalSettings({
                            ...proposalSettings,
                            includeEstimate: e.target.checked,
                          })
                        }
                        className="rounded border-gray-300"
                      />
                      <span className="text-sm">Estimativa de custos detalhada</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={proposalSettings.includeTimeline}
                        onChange={(e) =>
                          setProposalSettings({
                            ...proposalSettings,
                            includeTimeline: e.target.checked,
                          })
                        }
                        className="rounded border-gray-300"
                      />
                      <span className="text-sm">Cronograma estimado</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={proposalSettings.includeLegalBasis}
                        onChange={(e) =>
                          setProposalSettings({
                            ...proposalSettings,
                            includeLegalBasis: e.target.checked,
                          })
                        }
                        className="rounded border-gray-300"
                      />
                      <span className="text-sm">Fundamentação legal</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: Landing Page */}
          {step === 'landing' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-2xl font-semibold mb-2">Landing Page</h3>
                <p className="text-muted-foreground">
                  Configure a página de captura para este produto
                </p>
              </div>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold mb-1">Criar Landing Page</h4>
                      <p className="text-sm text-muted-foreground">
                        Gere automaticamente uma página de vendas otimizada
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={landingSettings.createLanding}
                        onChange={(e) =>
                          setLandingSettings({
                            ...landingSettings,
                            createLanding: e.target.checked,
                          })
                        }
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>
                </CardContent>
              </Card>

              {landingSettings.createLanding && (
                <div className="space-y-4">
                  <div>
                    <Label>Título Principal *</Label>
                    <Input
                      placeholder="Ex: Resolva seu Problema de Usucapião em 60 Dias"
                      value={landingSettings.headline}
                      onChange={(e) =>
                        setLandingSettings({ ...landingSettings, headline: e.target.value })
                      }
                    />
                  </div>

                  <div>
                    <Label>Subtítulo *</Label>
                    <Input
                      placeholder="Ex: Regularize seu imóvel com segurança jurídica total"
                      value={landingSettings.subheadline}
                      onChange={(e) =>
                        setLandingSettings({ ...landingSettings, subheadline: e.target.value })
                      }
                    />
                  </div>

                  <div>
                    <Label>Benefícios Principais</Label>
                    <div className="space-y-2 mt-2">
                      {landingSettings.benefits.map((benefit, index) => (
                        <div key={index} className="flex gap-2">
                          <Input
                            placeholder={`Benefício ${index + 1}`}
                            value={benefit}
                            onChange={(e) => updateBenefit(index, e.target.value)}
                          />
                          {landingSettings.benefits.length > 3 && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => removeBenefit(index)}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          )}
                        </div>
                      ))}
                      <Button variant="outline" size="sm" onClick={addBenefit}>
                        <Plus className="h-4 w-4 mr-2" />
                        Adicionar Benefício
                      </Button>
                    </div>
                  </div>

                  <div>
                    <Label>Texto do Botão</Label>
                    <Input
                      placeholder="Ex: Solicitar Análise Gratuita"
                      value={landingSettings.cta}
                      onChange={(e) =>
                        setLandingSettings({ ...landingSettings, cta: e.target.value })
                      }
                    />
                  </div>

                  <Card className="bg-purple-50 dark:bg-purple-950/20 border-purple-200 dark:border-purple-800">
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-semibold mb-1">Incluir VSL (Video Sales Letter)</h4>
                          <p className="text-sm text-muted-foreground">
                            Adicione um vídeo de vendas à landing page
                          </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={landingSettings.includeVSL}
                            onChange={(e) =>
                              setLandingSettings({
                                ...landingSettings,
                                includeVSL: e.target.checked,
                              })
                            }
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                        </label>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          )}

          {/* STEP 5: Review */}
          {step === 'review' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-2xl font-semibold mb-2">Revisar e Publicar</h3>
                <p className="text-muted-foreground">
                  Confira todas as configurações antes de salvar
                </p>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Informações do Produto</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Nome</p>
                      <p className="font-medium">{productInfo.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Categoria</p>
                      <p className="font-medium">{productInfo.category}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Preço</p>
                      <p className="font-medium">R$ {productInfo.price}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Prazo</p>
                      <p className="font-medium">{productInfo.estimatedTime || '-'}</p>
                    </div>
                  </div>
                  {productInfo.description && (
                    <div>
                      <p className="text-sm text-muted-foreground">Descrição</p>
                      <p className="text-sm">{productInfo.description}</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Perguntas de Qualificação</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {questions.map((q, i) => (
                      <div key={q.id} className="flex items-start gap-2 text-sm">
                        <Badge variant="outline" className="mt-0.5">
                          {i + 1}
                        </Badge>
                        <p className="flex-1">{q.text}</p>
                        {q.required && (
                          <Badge variant="secondary" className="text-xs">
                            Obrigatória
                          </Badge>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Configurações</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Geração automática de propostas</span>
                    {proposalSettings.autoGenerate ? (
                      <Badge variant="default">Ativado</Badge>
                    ) : (
                      <Badge variant="outline">Desativado</Badge>
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Landing Page</span>
                    {landingSettings.createLanding ? (
                      <Badge variant="default">Sim</Badge>
                    ) : (
                      <Badge variant="outline">Não</Badge>
                    )}
                  </div>
                  {landingSettings.createLanding && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm">VSL incluído</span>
                      {landingSettings.includeVSL ? (
                        <Badge variant="default">Sim</Badge>
                      ) : (
                        <Badge variant="outline">Não</Badge>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t">
            {step !== 'info' && (
              <Button
                variant="outline"
                onClick={() => {
                  const steps: Step[] = ['info', 'questions', 'proposal', 'landing', 'review']
                  const currentIndex = steps.indexOf(step)
                  if (currentIndex > 0) setStep(steps[currentIndex - 1])
                }}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar
              </Button>
            )}
            {step === 'info' && <div />}

            {step !== 'review' ? (
              <Button
                onClick={() => {
                  const steps: Step[] = ['info', 'questions', 'proposal', 'landing', 'review']
                  const currentIndex = steps.indexOf(step)
                  if (currentIndex < steps.length - 1) setStep(steps[currentIndex + 1])
                }}
                disabled={!canProceed()}
              >
                Continuar
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            ) : (
              <>
                <Button variant="outline" onClick={() => handleSave('draft')} disabled={isSaving}>
                  Salvar como Rascunho
                </Button>
                <Button onClick={() => handleSave('active')} disabled={isSaving}>
                  {isSaving ? 'Publicando...' : 'Publicar Produto'}
                  <Check className="h-4 w-4 ml-2" />
                </Button>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
