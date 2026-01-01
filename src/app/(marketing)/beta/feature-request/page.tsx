/**
 * Feature Request Form
 * Beta testers can suggest new features
 */

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/card'
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
import { Lightbulb } from 'lucide-react'
import { trackEvent } from '@/lib/analytics/ga4'

export default function FeatureRequestPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    title: '',
    problem: '',
    solution: '',
    priority: 'medium',
    useCase: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      trackEvent('feature_request_submit', {
        priority: formData.priority,
      })

      const res = await fetch('/api/beta/feature-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Erro ao enviar sugestão')
      }

      trackEvent('feature_request_success', { priority: formData.priority })
      router.push('/beta/feature-request/success')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido')
      trackEvent('feature_request_error', {
        error: err instanceof Error ? err.message : 'unknown',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-500/5 via-background to-amber-500/5 py-12">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-yellow-500/10 text-yellow-600 px-4 py-2 rounded-full mb-4">
            <Lightbulb className="w-4 h-4" />
            <span className="text-sm font-medium">Feature Request</span>
          </div>
          <h1 className="text-4xl font-bold mb-2">Sugerir Funcionalidade</h1>
          <p className="text-muted-foreground">
            Sua ideia pode se tornar realidade!
          </p>
        </div>

        <Card className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="title">Título da Funcionalidade *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, title: e.target.value }))
                }
                placeholder="Ex: Exportar relatórios em PDF"
                required
              />
            </div>

            <div>
              <Label htmlFor="problem">Qual problema isso resolve? *</Label>
              <Textarea
                id="problem"
                value={formData.problem}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, problem: e.target.value }))
                }
                rows={4}
                placeholder="Descreva o problema ou necessidade que você tem..."
                required
              />
              <p className="text-xs text-muted-foreground mt-1">
                Quanto mais específico, melhor conseguimos entender sua necessidade
              </p>
            </div>

            <div>
              <Label htmlFor="solution">Solução Proposta *</Label>
              <Textarea
                id="solution"
                value={formData.solution}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, solution: e.target.value }))
                }
                rows={4}
                placeholder="Como você imagina que isso funcionaria?"
                required
              />
            </div>

            <div>
              <Label htmlFor="useCase">Casos de Uso (opcional)</Label>
              <Textarea
                id="useCase"
                value={formData.useCase}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, useCase: e.target.value }))
                }
                rows={3}
                placeholder="Descreva cenários reais onde isso seria útil..."
              />
            </div>

            <div>
              <Label htmlFor="priority">Prioridade Percebida</Label>
              <Select
                value={formData.priority}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, priority: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="critical">🔴 Crítico - Bloqueador para uso</SelectItem>
                  <SelectItem value="high">🟠 Alto - Muito importante</SelectItem>
                  <SelectItem value="medium">🟡 Médio - Seria útil</SelectItem>
                  <SelectItem value="low">🟢 Baixo - Nice to have</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {error && (
              <div className="bg-destructive/10 text-destructive p-4 rounded-lg">
                {error}
              </div>
            )}

            <Button
              type="submit"
              className="w-full"
              size="lg"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Enviando...' : 'Enviar Sugestão'}
            </Button>

            <p className="text-xs text-center text-muted-foreground">
              Analisaremos sua sugestão e você receberá feedback em até 7 dias.
              Features aprovadas entram no roadmap com seu nome nos créditos!
            </p>
          </form>
        </Card>
      </div>
    </div>
  )
}
