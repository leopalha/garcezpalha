'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Save, Loader2 } from 'lucide-react'
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ErrorAlert } from '@/components/ui/error-alert'
import Link from 'next/link'

export default function NovoProcessoPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const [formData, setFormData] = useState({
    client_id: '',
    service_type: '',
    description: '',
    case_number: '',
    court: '',
    value: '',
    current_phase: '',
    next_step: '',
  })

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      // Prepare data
      const processData = {
        client_id: formData.client_id,
        service_type: formData.service_type,
        description: formData.description || undefined,
        case_number: formData.case_number || undefined,
        court: formData.court || undefined,
        value: formData.value ? parseFloat(formData.value) : undefined,
        current_phase: formData.current_phase || undefined,
        next_step: formData.next_step || undefined,
      }

      const response = await fetch('/api/admin/processes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(processData)
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Erro ao criar processo')
      }

      const process = await response.json()

      // Redirect to process details
      router.push(`/admin/processos/gestao/${process.id}`)
    } catch (err) {
      console.error('Error creating process:', err)
      setError(err instanceof Error ? err : new Error('Erro desconhecido'))
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/admin/processos/gestao">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Novo Processo</h1>
          <p className="text-muted-foreground">
            Cadastre um novo processo jurídico
          </p>
        </div>
      </div>

      {error && <ErrorAlert error={error} />}

      <form onSubmit={handleSubmit}>
        <div className="grid gap-6">
          {/* Informações do Cliente */}
          <Card>
            <CardHeader>
              <CardTitle>Informações do Cliente</CardTitle>
              <CardDescription>
                Selecione o cliente para este processo
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="client_id">
                  Cliente <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="client_id"
                  placeholder="UUID do cliente"
                  value={formData.client_id}
                  onChange={(e) => setFormData({ ...formData, client_id: e.target.value })}
                  required
                />
                <p className="text-sm text-muted-foreground">
                  Temporariamente, insira o UUID do cliente. Um seletor será adicionado em breve.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Dados do Processo */}
          <Card>
            <CardHeader>
              <CardTitle>Dados do Processo</CardTitle>
              <CardDescription>
                Informações básicas sobre o processo jurídico
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="service_type">
                    Tipo de Serviço <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={formData.service_type}
                    onValueChange={(value) => setFormData({ ...formData, service_type: value })}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Divórcio Consensual">Divórcio Consensual</SelectItem>
                      <SelectItem value="Divórcio Litigioso">Divórcio Litigioso</SelectItem>
                      <SelectItem value="Inventário">Inventário</SelectItem>
                      <SelectItem value="Usucapião">Usucapião</SelectItem>
                      <SelectItem value="Ação Trabalhista">Ação Trabalhista</SelectItem>
                      <SelectItem value="Ação de Cobrança">Ação de Cobrança</SelectItem>
                      <SelectItem value="Direito do Consumidor">Direito do Consumidor</SelectItem>
                      <SelectItem value="Ação Civil">Ação Civil</SelectItem>
                      <SelectItem value="Ação Penal">Ação Penal</SelectItem>
                      <SelectItem value="Consultoria Jurídica">Consultoria Jurídica</SelectItem>
                      <SelectItem value="Outro">Outro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="case_number">Número do Processo</Label>
                  <Input
                    id="case_number"
                    placeholder="0000000-00.0000.0.00.0000"
                    value={formData.case_number}
                    onChange={(e) => setFormData({ ...formData, case_number: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="court">Tribunal / Vara</Label>
                  <Input
                    id="court"
                    placeholder="Ex: 1ª Vara Cível - Comarca de São Paulo"
                    value={formData.court}
                    onChange={(e) => setFormData({ ...formData, court: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="value">Valor da Causa (R$)</Label>
                  <Input
                    id="value"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={formData.value}
                    onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  placeholder="Descreva o caso e seus principais pontos..."
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
            </CardContent>
          </Card>

          {/* Andamento */}
          <Card>
            <CardHeader>
              <CardTitle>Andamento Processual</CardTitle>
              <CardDescription>
                Fase atual e próximos passos
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="current_phase">Fase Atual</Label>
                <Input
                  id="current_phase"
                  placeholder="Ex: Coleta de documentos"
                  value={formData.current_phase}
                  onChange={(e) => setFormData({ ...formData, current_phase: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="next_step">Próximo Passo</Label>
                <Textarea
                  id="next_step"
                  placeholder="Ex: Aguardando envio de RG e comprovante de residência pelo cliente"
                  rows={3}
                  value={formData.next_step}
                  onChange={(e) => setFormData({ ...formData, next_step: e.target.value })}
                />
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full md:w-auto"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Criando...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Criar Processo
                </>
              )}
            </Button>

            <Link href="/admin/processos/gestao">
              <Button type="button" variant="outline">
                Cancelar
              </Button>
            </Link>
          </div>
        </div>
      </form>
    </div>
  )
}
