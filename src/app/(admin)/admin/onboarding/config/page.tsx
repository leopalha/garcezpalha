'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  ArrowLeft,
  Plus,
  Trash2,
  GripVertical,
  Save,
  Eye,
  Settings2,
  Loader2,
} from 'lucide-react'
import { useToast } from '@/components/ui/use-toast'

interface OnboardingStep {
  id: string
  order: number
  type: 'question' | 'info' | 'conditional'
  title: string
  description?: string
  field_name: string
  field_type: 'text' | 'email' | 'phone' | 'select' | 'multiselect' | 'textarea'
  options?: string[]
  required: boolean
  condition?: {
    field: string
    operator: 'equals' | 'not_equals' | 'contains'
    value: string
  }
}

interface OnboardingConfig {
  id?: string
  name: string
  description: string
  active: boolean
  steps: OnboardingStep[]
}

export default function OnboardingConfigPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [previewMode, setPreviewMode] = useState(false)
  const [config, setConfig] = useState<OnboardingConfig>({
    name: 'Onboarding Padrão',
    description: 'Fluxo de onboarding para novos clientes',
    active: true,
    steps: [
      {
        id: '1',
        order: 1,
        type: 'question',
        title: 'Qual seu nome completo?',
        field_name: 'full_name',
        field_type: 'text',
        required: true,
      },
      {
        id: '2',
        order: 2,
        type: 'question',
        title: 'Qual seu email?',
        field_name: 'email',
        field_type: 'email',
        required: true,
      },
    ],
  })

  useEffect(() => {
    fetchConfig()
  }, [])

  async function fetchConfig() {
    try {
      setLoading(true)
      // TODO: Fetch from API
      // const res = await fetch('/api/admin/onboarding/config')
      // const data = await res.json()
      // setConfig(data)

      // Mock delay
      await new Promise((resolve) => setTimeout(resolve, 500))
    } catch (error) {
      console.error('Error fetching config:', error)
    } finally {
      setLoading(false)
    }
  }

  async function handleSave() {
    try {
      setSaving(true)

      // TODO: Save to API
      // const res = await fetch('/api/admin/onboarding/config', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(config),
      // })

      // Mock delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: 'Configuração salva!',
        description: 'O fluxo de onboarding foi atualizado.',
      })
    } catch (error) {
      toast({
        title: 'Erro ao salvar',
        description: 'Não foi possível salvar a configuração.',
        variant: 'destructive',
      })
    } finally {
      setSaving(false)
    }
  }

  function addStep() {
    const newStep: OnboardingStep = {
      id: Date.now().toString(),
      order: config.steps.length + 1,
      type: 'question',
      title: 'Nova pergunta',
      field_name: `field_${config.steps.length + 1}`,
      field_type: 'text',
      required: false,
    }

    setConfig((prev) => ({
      ...prev,
      steps: [...prev.steps, newStep],
    }))
  }

  function removeStep(id: string) {
    setConfig((prev) => ({
      ...prev,
      steps: prev.steps.filter((s) => s.id !== id).map((s, idx) => ({ ...s, order: idx + 1 })),
    }))
  }

  function updateStep(id: string, updates: Partial<OnboardingStep>) {
    setConfig((prev) => ({
      ...prev,
      steps: prev.steps.map((s) => (s.id === id ? { ...s, ...updates } : s)),
    }))
  }

  function moveStep(id: string, direction: 'up' | 'down') {
    const index = config.steps.findIndex((s) => s.id === id)
    if (index === -1) return

    const newSteps = [...config.steps]
    const targetIndex = direction === 'up' ? index - 1 : index + 1

    if (targetIndex < 0 || targetIndex >= newSteps.length) return

    ;[newSteps[index], newSteps[targetIndex]] = [newSteps[targetIndex], newSteps[index]]

    setConfig((prev) => ({
      ...prev,
      steps: newSteps.map((s, idx) => ({ ...s, order: idx + 1 })),
    }))
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Configuração de Onboarding</h1>
            <p className="text-muted-foreground">
              Configure o fluxo de perguntas para novos clientes
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => setPreviewMode(!previewMode)}>
            <Eye className="h-4 w-4 mr-2" />
            {previewMode ? 'Editar' : 'Preview'}
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Salvando...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Salvar
              </>
            )}
          </Button>
        </div>
      </div>

      {!previewMode ? (
        <>
          {/* Config Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings2 className="h-5 w-5" />
                Configurações Gerais
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome do Fluxo</Label>
                  <Input
                    id="name"
                    value={config.name}
                    onChange={(e) => setConfig((prev) => ({ ...prev, name: e.target.value }))}
                  />
                </div>
                <div className="flex items-center gap-3 pt-8">
                  <Switch
                    id="active"
                    checked={config.active}
                    onCheckedChange={(checked) =>
                      setConfig((prev) => ({ ...prev, active: checked }))
                    }
                  />
                  <Label htmlFor="active" className="cursor-pointer">
                    Fluxo Ativo
                  </Label>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  value={config.description}
                  onChange={(e) =>
                    setConfig((prev) => ({ ...prev, description: e.target.value }))
                  }
                  rows={2}
                />
              </div>
            </CardContent>
          </Card>

          {/* Steps */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Etapas do Onboarding ({config.steps.length})</CardTitle>
                <Button onClick={addStep} size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar Etapa
                </Button>
              </div>
              <CardDescription>
                Arraste para reordenar ou clique para editar
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {config.steps.map((step, index) => (
                  <div key={step.id} className="border rounded-lg p-4">
                    <div className="flex items-start gap-4">
                      {/* Drag Handle */}
                      <div className="flex flex-col gap-1 pt-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => moveStep(step.id, 'up')}
                          disabled={index === 0}
                          className="h-6 w-6 p-0"
                        >
                          <GripVertical className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => moveStep(step.id, 'down')}
                          disabled={index === config.steps.length - 1}
                          className="h-6 w-6 p-0"
                        >
                          <GripVertical className="h-4 w-4" />
                        </Button>
                      </div>

                      {/* Step Config */}
                      <div className="flex-1 space-y-3">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">Etapa {step.order}</Badge>
                          {step.required && <Badge variant="destructive">Obrigatório</Badge>}
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-2">
                            <Label>Título da Pergunta</Label>
                            <Input
                              value={step.title}
                              onChange={(e) => updateStep(step.id, { title: e.target.value })}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Nome do Campo</Label>
                            <Input
                              value={step.field_name}
                              onChange={(e) =>
                                updateStep(step.id, { field_name: e.target.value })
                              }
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-3 gap-3">
                          <div className="space-y-2">
                            <Label>Tipo de Campo</Label>
                            <Select
                              value={step.field_type}
                              onValueChange={(value: any) =>
                                updateStep(step.id, { field_type: value })
                              }
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="text">Texto</SelectItem>
                                <SelectItem value="email">Email</SelectItem>
                                <SelectItem value="phone">Telefone</SelectItem>
                                <SelectItem value="select">Seleção Única</SelectItem>
                                <SelectItem value="multiselect">Seleção Múltipla</SelectItem>
                                <SelectItem value="textarea">Texto Longo</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label>Tipo de Etapa</Label>
                            <Select
                              value={step.type}
                              onValueChange={(value: any) => updateStep(step.id, { type: value })}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="question">Pergunta</SelectItem>
                                <SelectItem value="info">Informação</SelectItem>
                                <SelectItem value="conditional">Condicional</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="flex items-center gap-2 pt-8">
                            <Switch
                              checked={step.required}
                              onCheckedChange={(checked) =>
                                updateStep(step.id, { required: checked })
                              }
                            />
                            <Label>Obrigatório</Label>
                          </div>
                        </div>

                        {(step.field_type === 'select' || step.field_type === 'multiselect') && (
                          <div className="space-y-2">
                            <Label>Opções (uma por linha)</Label>
                            <Textarea
                              placeholder="Opção 1&#10;Opção 2&#10;Opção 3"
                              value={step.options?.join('\n') || ''}
                              onChange={(e) =>
                                updateStep(step.id, {
                                  options: e.target.value.split('\n').filter((o) => o.trim()),
                                })
                              }
                              rows={3}
                            />
                          </div>
                        )}

                        {step.description && (
                          <div className="space-y-2">
                            <Label>Descrição/Ajuda</Label>
                            <Input
                              value={step.description}
                              onChange={(e) =>
                                updateStep(step.id, { description: e.target.value })
                              }
                            />
                          </div>
                        )}
                      </div>

                      {/* Delete Button */}
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeStep(step.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}

                {config.steps.length === 0 && (
                  <div className="text-center py-12 text-muted-foreground">
                    <p className="mb-4">Nenhuma etapa configurada</p>
                    <Button onClick={addStep} variant="outline">
                      <Plus className="h-4 w-4 mr-2" />
                      Adicionar Primeira Etapa
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Preview do Onboarding</CardTitle>
            <CardDescription>Como o cliente verá o fluxo</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="max-w-2xl mx-auto space-y-6">
              {config.steps.map((step) => (
                <div key={step.id} className="space-y-2">
                  <Label>
                    {step.title}
                    {step.required && <span className="text-destructive ml-1">*</span>}
                  </Label>
                  {step.field_type === 'textarea' ? (
                    <Textarea placeholder="Sua resposta..." disabled />
                  ) : step.field_type === 'select' ? (
                    <Select disabled>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione..." />
                      </SelectTrigger>
                      <SelectContent>
                        {step.options?.map((opt) => (
                          <SelectItem key={opt} value={opt}>
                            {opt}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <Input type={step.field_type} placeholder="Sua resposta..." disabled />
                  )}
                  {step.description && (
                    <p className="text-sm text-muted-foreground">{step.description}</p>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
