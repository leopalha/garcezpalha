'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Mail,
  ArrowLeft,
  ArrowRight,
  Check,
  Plus,
  Trash2,
  Clock,
  Eye,
  Save,
  Loader2,
} from 'lucide-react'
import { useToast } from '@/components/ui/use-toast'
import Link from 'next/link'

interface EmailStep {
  id: string
  name: string
  subject: string
  body: string
  delayDays: number
  delayHours: number
}

interface CampaignData {
  name: string
  description: string
  type: 'email_sequence' | 'one_time' | 'ab_test'
  steps: EmailStep[]
}

const steps = [
  { id: 1, name: 'Informações Básicas', icon: Mail },
  { id: 2, name: 'Sequência de Emails', icon: Mail },
  { id: 3, name: 'Revisão', icon: Eye },
]

export default function NovaCampanhaPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [currentStep, setCurrentStep] = useState(1)
  const [saving, setSaving] = useState(false)

  const [campaignData, setCampaignData] = useState<CampaignData>({
    name: '',
    description: '',
    type: 'email_sequence',
    steps: [],
  })

  const [editingStep, setEditingStep] = useState<EmailStep>({
    id: Date.now().toString(),
    name: '',
    subject: '',
    body: '',
    delayDays: 0,
    delayHours: 0,
  })

  function updateCampaignField(field: keyof CampaignData, value: any) {
    setCampaignData((prev) => ({ ...prev, [field]: value }))
  }

  function addStep() {
    if (!editingStep.name || !editingStep.subject || !editingStep.body) {
      toast({
        title: 'Campos obrigatórios',
        description: 'Preencha nome, assunto e corpo do email.',
        variant: 'destructive',
      })
      return
    }

    setCampaignData((prev) => ({
      ...prev,
      steps: [...prev.steps, { ...editingStep, id: Date.now().toString() }],
    }))

    // Reset editing step
    setEditingStep({
      id: Date.now().toString(),
      name: '',
      subject: '',
      body: '',
      delayDays: 0,
      delayHours: 0,
    })

    toast({
      title: 'Email adicionado',
      description: 'Email adicionado à sequência com sucesso.',
    })
  }

  function removeStep(stepId: string) {
    setCampaignData((prev) => ({
      ...prev,
      steps: prev.steps.filter((s) => s.id !== stepId),
    }))

    toast({
      title: 'Email removido',
      description: 'Email removido da sequência.',
    })
  }

  function canGoNext() {
    if (currentStep === 1) {
      return campaignData.name && campaignData.description && campaignData.type
    }
    if (currentStep === 2) {
      return campaignData.steps.length > 0
    }
    return true
  }

  async function saveCampaign() {
    try {
      setSaving(true)

      const res = await fetch('/api/marketing/campaigns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: campaignData.name,
          description: campaignData.description,
          type: campaignData.type,
          steps: campaignData.steps,
        }),
      })

      if (!res.ok) {
        throw new Error('Failed to create campaign')
      }

      const data = await res.json()

      toast({
        title: 'Campanha criada!',
        description: 'Sua campanha foi criada com sucesso.',
      })

      router.push('/admin/marketing/campanhas')
    } catch (error) {
      console.error('Error creating campaign:', error)
      toast({
        title: 'Erro ao criar campanha',
        description: 'Não foi possível criar a campanha.',
        variant: 'destructive',
      })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/admin/marketing/campanhas">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <h2 className="text-3xl font-bold tracking-tight">Nova Campanha</h2>
          </div>
          <p className="text-muted-foreground">
            Crie uma nova campanha de email marketing
          </p>
        </div>
      </div>

      {/* Progress Steps */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => {
              const StepIcon = step.icon
              const isActive = currentStep === step.id
              const isCompleted = currentStep > step.id

              return (
                <div key={step.id} className="flex items-center flex-1">
                  <div className="flex flex-col items-center gap-2">
                    <div
                      className={`h-10 w-10 rounded-full flex items-center justify-center border-2 ${
                        isActive
                          ? 'bg-primary border-primary text-primary-foreground'
                          : isCompleted
                          ? 'bg-green-500 border-green-500 text-white'
                          : 'bg-muted border-muted-foreground/20 text-muted-foreground'
                      }`}
                    >
                      {isCompleted ? (
                        <Check className="h-5 w-5" />
                      ) : (
                        <StepIcon className="h-5 w-5" />
                      )}
                    </div>
                    <span
                      className={`text-xs font-medium ${
                        isActive
                          ? 'text-primary'
                          : isCompleted
                          ? 'text-green-600'
                          : 'text-muted-foreground'
                      }`}
                    >
                      {step.name}
                    </span>
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={`flex-1 h-0.5 mx-4 ${
                        isCompleted ? 'bg-green-500' : 'bg-muted'
                      }`}
                    />
                  )}
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Step 1: Basic Info */}
      {currentStep === 1 && (
        <Card>
          <CardHeader>
            <CardTitle>Informações Básicas</CardTitle>
            <CardDescription>
              Configure as informações básicas da sua campanha
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Nome da Campanha *</Label>
              <Input
                id="name"
                placeholder="Ex: Sequência de Boas-Vindas"
                value={campaignData.name}
                onChange={(e) => updateCampaignField('name', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                placeholder="Descreva o objetivo desta campanha..."
                value={campaignData.description}
                onChange={(e) => updateCampaignField('description', e.target.value)}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Tipo de Campanha *</Label>
              <Select
                value={campaignData.type}
                onValueChange={(value) =>
                  updateCampaignField('type', value as CampaignData['type'])
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="email_sequence">
                    Sequência de Emails
                  </SelectItem>
                  <SelectItem value="one_time">Envio Único</SelectItem>
                  <SelectItem value="ab_test">Teste A/B</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                {campaignData.type === 'email_sequence' &&
                  'Série de emails automáticos com delays configuráveis'}
                {campaignData.type === 'one_time' &&
                  'Envio único para todos os inscritos'}
                {campaignData.type === 'ab_test' &&
                  'Teste A/B para otimizar performance'}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 2: Email Sequence */}
      {currentStep === 2 && (
        <div className="space-y-6">
          {/* Steps List */}
          {campaignData.steps.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Emails da Sequência ({campaignData.steps.length})</CardTitle>
                <CardDescription>
                  Emails que serão enviados nesta campanha
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {campaignData.steps.map((step, index) => (
                    <div
                      key={step.id}
                      className="flex items-start gap-4 p-4 border rounded-lg"
                    >
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <span className="text-sm font-semibold text-primary">
                          {index + 1}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold">{step.name}</h4>
                          {(step.delayDays > 0 || step.delayHours > 0) && (
                            <Badge variant="outline" className="gap-1">
                              <Clock className="h-3 w-3" />
                              {step.delayDays > 0 && `${step.delayDays}d `}
                              {step.delayHours > 0 && `${step.delayHours}h`}
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          Assunto: {step.subject}
                        </p>
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {step.body.replace(/<[^>]*>/g, '').substring(0, 150)}...
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeStep(step.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Add New Step */}
          <Card>
            <CardHeader>
              <CardTitle>
                {campaignData.steps.length === 0 ? 'Primeiro Email' : 'Adicionar Email'}
              </CardTitle>
              <CardDescription>
                Configure o conteúdo e timing do email
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="step-name">Nome do Email *</Label>
                <Input
                  id="step-name"
                  placeholder="Ex: Email de Boas-Vindas"
                  value={editingStep.name}
                  onChange={(e) =>
                    setEditingStep((prev) => ({ ...prev, name: e.target.value }))
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="subject">Assunto *</Label>
                <Input
                  id="subject"
                  placeholder="Ex: Bem-vindo! Vamos começar?"
                  value={editingStep.subject}
                  onChange={(e) =>
                    setEditingStep((prev) => ({ ...prev, subject: e.target.value }))
                  }
                />
                <p className="text-xs text-muted-foreground">
                  Use variáveis: {'{'}{'{'} firstName {'}'}{'}'}, {'{'}{'{'} companyName {'}'}{'}'}, {'{'}{'{'} productName {'}'}{'}'}
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="body">Corpo do Email *</Label>
                <Textarea
                  id="body"
                  placeholder="Digite o conteúdo do email..."
                  value={editingStep.body}
                  onChange={(e) =>
                    setEditingStep((prev) => ({ ...prev, body: e.target.value }))
                  }
                  rows={8}
                />
                <p className="text-xs text-muted-foreground">
                  Suporta HTML básico e variáveis de template
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="delay-days">Delay (Dias)</Label>
                  <Input
                    id="delay-days"
                    type="number"
                    min="0"
                    value={editingStep.delayDays}
                    onChange={(e) =>
                      setEditingStep((prev) => ({
                        ...prev,
                        delayDays: parseInt(e.target.value) || 0,
                      }))
                    }
                  />
                  <p className="text-xs text-muted-foreground">
                    Dias após o email anterior
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="delay-hours">Delay (Horas)</Label>
                  <Input
                    id="delay-hours"
                    type="number"
                    min="0"
                    max="23"
                    value={editingStep.delayHours}
                    onChange={(e) =>
                      setEditingStep((prev) => ({
                        ...prev,
                        delayHours: parseInt(e.target.value) || 0,
                      }))
                    }
                  />
                  <p className="text-xs text-muted-foreground">
                    {editingStep.delayDays === 0 && editingStep.delayHours === 0
                      ? 'Envio imediato'
                      : `Enviar ${editingStep.delayDays}d ${editingStep.delayHours}h após anterior`}
                  </p>
                </div>
              </div>

              <Button onClick={addStep} className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Email à Sequência
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Step 3: Review */}
      {currentStep === 3 && (
        <Card>
          <CardHeader>
            <CardTitle>Revisão</CardTitle>
            <CardDescription>Revise os detalhes antes de criar a campanha</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-4 p-4 bg-muted rounded-lg">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">
                  Nome da Campanha
                </p>
                <p className="font-semibold">{campaignData.name}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">
                  Tipo
                </p>
                <Badge>
                  {campaignData.type === 'email_sequence' && 'Sequência de Emails'}
                  {campaignData.type === 'one_time' && 'Envio Único'}
                  {campaignData.type === 'ab_test' && 'Teste A/B'}
                </Badge>
              </div>
              <div className="col-span-2">
                <p className="text-sm font-medium text-muted-foreground mb-1">
                  Descrição
                </p>
                <p>{campaignData.description}</p>
              </div>
              <div className="col-span-2">
                <p className="text-sm font-medium text-muted-foreground mb-1">
                  Total de Emails
                </p>
                <p className="font-semibold text-2xl">{campaignData.steps.length}</p>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Sequência de Emails:</h4>
              <div className="space-y-3">
                {campaignData.steps.map((step, index) => (
                  <div key={step.id} className="flex items-start gap-3 p-3 border rounded">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-semibold text-primary">
                        {index + 1}
                      </span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-medium">{step.name}</p>
                        {(step.delayDays > 0 || step.delayHours > 0) && (
                          <Badge variant="outline" className="gap-1 text-xs">
                            <Clock className="h-3 w-3" />
                            {step.delayDays > 0 && `${step.delayDays}d `}
                            {step.delayHours > 0 && `${step.delayHours}h`}
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {step.subject}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Navigation */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              onClick={() => setCurrentStep((prev) => Math.max(1, prev - 1))}
              disabled={currentStep === 1}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>

            <div className="flex gap-2">
              {currentStep < steps.length && (
                <Button
                  onClick={() => setCurrentStep((prev) => prev + 1)}
                  disabled={!canGoNext()}
                >
                  Próximo
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              )}

              {currentStep === steps.length && (
                <Button onClick={saveCampaign} disabled={saving}>
                  {saving ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Salvando...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Criar Campanha
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
