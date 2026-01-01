'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
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
import { ArrowLeft, Save, Loader2, FlaskConical } from 'lucide-react'
import { useToast } from '@/components/ui/use-toast'
import Link from 'next/link'

interface Campaign {
  id: string
  name: string
}

export default function NewABTestPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [saving, setSaving] = useState(false)
  const [campaigns, setCampaigns] = useState<Campaign[]>([])

  const [formData, setFormData] = useState({
    sequence_id: '',
    test_name: '',
    test_type: 'subject' as 'subject' | 'content' | 'both',
    test_metric: 'open_rate',
    variant_a_subject: '',
    variant_a_body: '',
    variant_b_subject: '',
    variant_b_body: '',
    split_ratio: 50,
    min_sample_size: 100,
  })

  useEffect(() => {
    fetchCampaigns()
  }, [])

  async function fetchCampaigns() {
    try {
      const res = await fetch('/api/marketing/campaigns')
      if (!res.ok) throw new Error('Failed to fetch campaigns')
      const data = await res.json()
      setCampaigns(data.campaigns || [])
    } catch (error) {
      console.error('Error fetching campaigns:', error)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (!formData.sequence_id || !formData.test_name) {
      toast({
        title: 'Campos obrigatórios',
        description: 'Preencha o nome do teste e selecione uma campanha.',
        variant: 'destructive',
      })
      return
    }

    try {
      setSaving(true)

      const variant_a: any = {}
      const variant_b: any = {}

      if (formData.test_type === 'subject' || formData.test_type === 'both') {
        variant_a.subject = formData.variant_a_subject
        variant_b.subject = formData.variant_b_subject
      }

      if (formData.test_type === 'content' || formData.test_type === 'both') {
        variant_a.body = formData.variant_a_body
        variant_b.body = formData.variant_b_body
      }

      const res = await fetch('/api/marketing/ab-tests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sequence_id: formData.sequence_id,
          test_name: formData.test_name,
          test_type: formData.test_type,
          test_metric: formData.test_metric,
          variant_a,
          variant_b,
          split_ratio: formData.split_ratio,
          min_sample_size: formData.min_sample_size,
        }),
      })

      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.error || 'Failed to create test')
      }

      toast({
        title: 'Teste A/B criado!',
        description: 'Seu teste foi criado e está em execução.',
      })

      router.push('/admin/marketing/ab-tests')
    } catch (error: any) {
      toast({
        title: 'Erro ao criar teste',
        description: error.message,
        variant: 'destructive',
      })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/admin/marketing/ab-tests">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h2 className="text-3xl font-bold tracking-tight">Novo Teste A/B</h2>
        </div>
        <p className="text-muted-foreground">
          Crie um teste A/B para otimizar suas campanhas de email
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          {/* Basic Info */}
          <Card>
            <CardHeader>
              <CardTitle>Configuração Básica</CardTitle>
              <CardDescription>
                Informações gerais do teste A/B
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="test_name">Nome do Teste *</Label>
                <Input
                  id="test_name"
                  placeholder="Ex: Teste Subject Line - Email Boas-Vindas"
                  value={formData.test_name}
                  onChange={(e) => setFormData({ ...formData, test_name: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="sequence_id">Campanha *</Label>
                <Select
                  value={formData.sequence_id}
                  onValueChange={(value) => setFormData({ ...formData, sequence_id: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma campanha" />
                  </SelectTrigger>
                  <SelectContent>
                    {campaigns.map((campaign) => (
                      <SelectItem key={campaign.id} value={campaign.id}>
                        {campaign.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="test_type">O que testar *</Label>
                  <Select
                    value={formData.test_type}
                    onValueChange={(value: any) => setFormData({ ...formData, test_type: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="subject">Subject Line</SelectItem>
                      <SelectItem value="content">Conteúdo do Email</SelectItem>
                      <SelectItem value="both">Ambos</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="test_metric">Métrica de Sucesso *</Label>
                  <Select
                    value={formData.test_metric}
                    onValueChange={(value) => setFormData({ ...formData, test_metric: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="open_rate">Taxa de Abertura</SelectItem>
                      <SelectItem value="click_rate">Taxa de Cliques</SelectItem>
                      <SelectItem value="conversion_rate">Taxa de Conversão</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="split_ratio">Split (% Variante A)</Label>
                  <Input
                    id="split_ratio"
                    type="number"
                    min="10"
                    max="90"
                    value={formData.split_ratio}
                    onChange={(e) => setFormData({ ...formData, split_ratio: parseInt(e.target.value) })}
                  />
                  <p className="text-xs text-muted-foreground">
                    Variante B receberá {100 - formData.split_ratio}%
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="min_sample_size">Amostra Mínima</Label>
                  <Input
                    id="min_sample_size"
                    type="number"
                    min="50"
                    value={formData.min_sample_size}
                    onChange={(e) => setFormData({ ...formData, min_sample_size: parseInt(e.target.value) })}
                  />
                  <p className="text-xs text-muted-foreground">
                    Total de envios antes de declarar vencedor
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Variants */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Variant A */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                    <span className="text-sm font-semibold text-blue-600">A</span>
                  </div>
                  Variante A
                </CardTitle>
                <CardDescription>Versão original ou controle</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {(formData.test_type === 'subject' || formData.test_type === 'both') && (
                  <div className="space-y-2">
                    <Label htmlFor="variant_a_subject">Subject Line *</Label>
                    <Input
                      id="variant_a_subject"
                      placeholder="Ex: Bem-vindo à nossa plataforma!"
                      value={formData.variant_a_subject}
                      onChange={(e) => setFormData({ ...formData, variant_a_subject: e.target.value })}
                      required
                    />
                  </div>
                )}

                {(formData.test_type === 'content' || formData.test_type === 'both') && (
                  <div className="space-y-2">
                    <Label htmlFor="variant_a_body">Conteúdo *</Label>
                    <Textarea
                      id="variant_a_body"
                      placeholder="Digite o conteúdo da Variante A..."
                      value={formData.variant_a_body}
                      onChange={(e) => setFormData({ ...formData, variant_a_body: e.target.value })}
                      rows={6}
                      required
                    />
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Variant B */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center">
                    <span className="text-sm font-semibold text-purple-600">B</span>
                  </div>
                  Variante B
                </CardTitle>
                <CardDescription>Versão alternativa para testar</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {(formData.test_type === 'subject' || formData.test_type === 'both') && (
                  <div className="space-y-2">
                    <Label htmlFor="variant_b_subject">Subject Line *</Label>
                    <Input
                      id="variant_b_subject"
                      placeholder="Ex: Comece em 5 minutos!"
                      value={formData.variant_b_subject}
                      onChange={(e) => setFormData({ ...formData, variant_b_subject: e.target.value })}
                      required
                    />
                  </div>
                )}

                {(formData.test_type === 'content' || formData.test_type === 'both') && (
                  <div className="space-y-2">
                    <Label htmlFor="variant_b_body">Conteúdo *</Label>
                    <Textarea
                      id="variant_b_body"
                      placeholder="Digite o conteúdo da Variante B..."
                      value={formData.variant_b_body}
                      onChange={(e) => setFormData({ ...formData, variant_b_body: e.target.value })}
                      rows={6}
                      required
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Submit */}
          <Card>
            <CardContent className="pt-6">
              <Button type="submit" size="lg" disabled={saving} className="w-full">
                {saving ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Criando Teste...
                  </>
                ) : (
                  <>
                    <FlaskConical className="h-4 w-4 mr-2" />
                    Criar Teste A/B
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
      </form>
    </div>
  )
}
