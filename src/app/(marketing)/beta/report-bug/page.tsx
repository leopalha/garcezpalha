/**
 * Bug Report Form
 * Beta testers can report bugs
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
import { Bug, Upload } from 'lucide-react'
import { trackEvent } from '@/lib/analytics/ga4'

export default function BugReportPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    steps: '',
    severity: 'medium',
    page: '',
    screenshot: null as File | null,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      trackEvent('bug_report_submit', {
        severity: formData.severity,
        page: formData.page,
      })

      const formDataToSend = new FormData()
      Object.entries(formData).forEach(([key, value]) => {
        if (value) formDataToSend.append(key, value)
      })

      const res = await fetch('/api/beta/report-bug', {
        method: 'POST',
        body: formDataToSend,
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Erro ao enviar report')
      }

      trackEvent('bug_report_success', { severity: formData.severity })
      router.push('/beta/report-bug/success')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido')
      trackEvent('bug_report_error', {
        error: err instanceof Error ? err.message : 'unknown',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-500/5 via-background to-orange-500/5 py-12">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-red-500/10 text-red-600 px-4 py-2 rounded-full mb-4">
            <Bug className="w-4 h-4" />
            <span className="text-sm font-medium">Bug Report</span>
          </div>
          <h1 className="text-4xl font-bold mb-2">Reportar Bug</h1>
          <p className="text-muted-foreground">
            Encontrou um problema? Nos ajude a corrigir!
          </p>
        </div>

        <Card className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="title">Título do Bug *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, title: e.target.value }))
                }
                placeholder="Ex: Chat não carrega mensagens antigas"
                required
              />
            </div>

            <div>
              <Label htmlFor="severity">Severidade *</Label>
              <Select
                value={formData.severity}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, severity: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="critical">🔴 Crítico - Sistema travado</SelectItem>
                  <SelectItem value="high">🟠 Alto - Feature não funciona</SelectItem>
                  <SelectItem value="medium">🟡 Médio - Comportamento estranho</SelectItem>
                  <SelectItem value="low">🟢 Baixo - Problema visual</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="page">Página/Funcionalidade Afetada *</Label>
              <Input
                id="page"
                value={formData.page}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, page: e.target.value }))
                }
                placeholder="Ex: /dashboard ou Chat IA"
                required
              />
            </div>

            <div>
              <Label htmlFor="description">Descrição Detalhada *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, description: e.target.value }))
                }
                rows={4}
                placeholder="O que aconteceu? O que você esperava que acontecesse?"
                required
              />
            </div>

            <div>
              <Label htmlFor="steps">Passos para Reproduzir *</Label>
              <Textarea
                id="steps"
                value={formData.steps}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, steps: e.target.value }))
                }
                rows={6}
                placeholder={"1. Abri a página...\n2. Cliquei em...\n3. Esperava que... mas..."}
                required
              />
            </div>

            <div>
              <Label htmlFor="screenshot">Screenshot/Vídeo (opcional)</Label>
              <div className="mt-2">
                <label
                  htmlFor="screenshot"
                  className="flex items-center justify-center gap-2 border-2 border-dashed rounded-lg p-6 cursor-pointer hover:bg-accent"
                >
                  <Upload className="w-5 h-5 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    {formData.screenshot
                      ? formData.screenshot.name
                      : 'Clique para fazer upload'}
                  </span>
                  <input
                    id="screenshot"
                    type="file"
                    accept="image/*,video/*"
                    className="hidden"
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        screenshot: e.target.files?.[0] || null,
                      }))
                    }
                  />
                </label>
              </div>
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
              {isSubmitting ? 'Enviando...' : 'Enviar Bug Report'}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  )
}
