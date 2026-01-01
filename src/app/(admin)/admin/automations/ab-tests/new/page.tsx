'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { ArrowLeft, Plus, Trash2 } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface Variant {
  name: string
  subject: string
}

export default function NewABTestPage() {
  const router = useRouter()
  const supabase = createClient()

  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    sequenceId: 'welcome-sequence',
    stepId: 'welcome-1',
    minSampleSize: 100,
    confidenceLevel: 0.95,
  })

  const [variants, setVariants] = useState<Variant[]>([
    { name: 'Control', subject: '' },
    { name: 'Variant A', subject: '' },
  ])

  function addVariant() {
    const nextLetter = String.fromCharCode(65 + variants.length - 1) // B, C, D...
    setVariants([...variants, { name: `Variant ${nextLetter}`, subject: '' }])
  }

  function removeVariant(index: number) {
    if (variants.length <= 2) {
      alert('Você precisa de pelo menos 2 variantes')
      return
    }
    setVariants(variants.filter((_, i) => i !== index))
  }

  function updateVariant(index: number, field: keyof Variant, value: string) {
    const updated = [...variants]
    updated[index][field] = value
    setVariants(updated)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    try {
      // Validações
      if (!formData.name || !formData.description) {
        throw new Error('Preencha todos os campos obrigatórios')
      }

      if (variants.some(v => !v.subject)) {
        throw new Error('Preencha o subject de todas as variantes')
      }

      // Calcular traffic split igualmente
      const trafficSplit = variants.map(() => 100 / variants.length)

      // Criar teste A/B
      const { data: test, error: testError } = await supabase
        .from('ab_tests')
        .insert({
          name: formData.name,
          description: formData.description,
          sequence_id: formData.sequenceId,
          step_id: formData.stepId,
          status: 'draft',
          config: {
            trafficSplit,
            minSampleSize: formData.minSampleSize,
            confidenceLevel: formData.confidenceLevel,
          },
        })
        .select()
        .single()

      if (testError) throw testError

      // Criar variantes
      const variantsData = variants.map((variant) => ({
        test_id: test.id,
        name: variant.name,
        subject: variant.subject,
      }))

      const { error: variantsError } = await supabase
        .from('ab_test_variants')
        .insert(variantsData)

      if (variantsError) throw variantsError

      alert('Teste A/B criado com sucesso!')
      router.push(`/admin/automations/ab-tests/${test.id}`)
    } catch (error: any) {
      console.error('Error creating A/B test:', error)
      alert(error.message || 'Erro ao criar teste A/B')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <Link href="/admin/automations/ab-tests">
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar para Testes A/B
          </Button>
        </Link>

        <h1 className="text-3xl font-bold text-gray-900">Criar Novo Teste A/B</h1>
        <p className="text-gray-600 mt-2">
          Configure um teste A/B para otimizar suas taxas de abertura
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Basic Info */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Informações Básicas</CardTitle>
            <CardDescription>
              Nome e descrição do teste
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="name">Nome do Teste *</Label>
              <Input
                id="name"
                placeholder="Ex: Teste A/B - Welcome Email Subject"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
              />
            </div>

            <div>
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                placeholder="Descreva o objetivo deste teste..."
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="sequenceId">Sequência *</Label>
                <Input
                  id="sequenceId"
                  placeholder="welcome-sequence"
                  value={formData.sequenceId}
                  onChange={(e) =>
                    setFormData({ ...formData, sequenceId: e.target.value })
                  }
                  required
                />
              </div>

              <div>
                <Label htmlFor="stepId">Step *</Label>
                <Input
                  id="stepId"
                  placeholder="welcome-1"
                  value={formData.stepId}
                  onChange={(e) =>
                    setFormData({ ...formData, stepId: e.target.value })
                  }
                  required
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Variants */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Variantes</CardTitle>
                <CardDescription>
                  Adicione 2 ou mais variantes para testar (mínimo: 2)
                </CardDescription>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addVariant}
              >
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Variante
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {variants.map((variant, index) => (
              <div
                key={index}
                className="border rounded-lg p-4 relative"
              >
                {variants.length > 2 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute top-2 right-2"
                    onClick={() => removeVariant(index)}
                  >
                    <Trash2 className="h-4 w-4 text-red-600" />
                  </Button>
                )}

                <div className="space-y-3">
                  <div>
                    <Label>Nome da Variante</Label>
                    <Input
                      value={variant.name}
                      onChange={(e) =>
                        updateVariant(index, 'name', e.target.value)
                      }
                      placeholder="Ex: Control, Variant A"
                    />
                  </div>

                  <div>
                    <Label>Subject Line *</Label>
                    <Input
                      value={variant.subject}
                      onChange={(e) =>
                        updateVariant(index, 'subject', e.target.value)
                      }
                      placeholder="Ex: {{firstName}}, bem-vindo à Garcez Palha!"
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Use {'{{firstName}}'} para personalização
                    </p>
                  </div>
                </div>

                <div className="mt-3 text-sm text-gray-600">
                  Traffic: {(100 / variants.length).toFixed(1)}%
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Configuration */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Configuração do Teste</CardTitle>
            <CardDescription>
              Parâmetros estatísticos para validação
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="minSampleSize">
                  Amostra Mínima por Variante
                </Label>
                <Input
                  id="minSampleSize"
                  type="number"
                  min="50"
                  value={formData.minSampleSize}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      minSampleSize: parseInt(e.target.value),
                    })
                  }
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  Recomendado: 100+ para resultados confiáveis
                </p>
              </div>

              <div>
                <Label htmlFor="confidenceLevel">Nível de Confiança</Label>
                <select
                  id="confidenceLevel"
                  className="w-full border rounded px-3 py-2"
                  value={formData.confidenceLevel}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      confidenceLevel: parseFloat(e.target.value),
                    })
                  }
                >
                  <option value="0.90">90%</option>
                  <option value="0.95">95% (Recomendado)</option>
                  <option value="0.99">99%</option>
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  95% é o padrão da indústria
                </p>
              </div>
            </div>

            <div className="p-4 bg-blue-50 rounded border border-blue-200">
              <div className="text-sm font-medium text-blue-900 mb-2">
                Como funciona:
              </div>
              <ul className="text-sm text-blue-700 space-y-1 list-disc list-inside">
                <li>
                  Tráfego dividido igualmente entre variantes (
                  {(100 / variants.length).toFixed(1)}% cada)
                </li>
                <li>
                  Mínimo de {formData.minSampleSize} emails por variante
                </li>
                <li>
                  Vencedor declarado ao atingir {(formData.confidenceLevel * 100).toFixed(0)}% de
                  confiança estatística
                </li>
                <li>
                  Usa Z-test para comparar taxas de conversão
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex justify-end gap-3">
          <Link href="/admin/automations/ab-tests">
            <Button type="button" variant="outline">
              Cancelar
            </Button>
          </Link>
          <Button type="submit" disabled={loading}>
            {loading ? 'Criando...' : 'Criar Teste A/B'}
          </Button>
        </div>
      </form>
    </div>
  )
}
