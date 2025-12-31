'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import {
  ArrowLeft,
  Save,
  Loader2,
  Mail,
  Clock,
  Plus,
  Trash2,
  Play,
  Pause,
} from 'lucide-react'
import { useToast } from '@/components/ui/use-toast'
import Link from 'next/link'

interface EmailStep {
  id: string
  name: string
  subject: string
  body: string
  delay_days: number
  delay_hours: number
  step_number: number
}

interface Campaign {
  id: string
  name: string
  description: string
  type: string
  status: string
  steps: EmailStep[]
  stats: {
    subscribers: number
    sent: number
  }
}

export default function EditCampaignPage() {
  const router = useRouter()
  const params = useParams()
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [campaign, setCampaign] = useState<Campaign | null>(null)

  const [editingStep, setEditingStep] = useState({
    name: '',
    subject: '',
    body: '',
    delay_days: 0,
    delay_hours: 0,
  })

  useEffect(() => {
    fetchCampaign()
  }, [params.id])

  async function fetchCampaign() {
    try {
      setLoading(true)
      const res = await fetch(`/api/marketing/campaigns/${params.id}`)
      if (!res.ok) throw new Error('Failed to fetch campaign')
      const data = await res.json()
      setCampaign(data)
    } catch (error) {
      console.error('Error fetching campaign:', error)
      toast({
        title: 'Erro ao carregar campanha',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  async function saveCampaign() {
    if (!campaign) return

    try {
      setSaving(true)
      const res = await fetch(`/api/marketing/campaigns/${params.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: campaign.name,
          description: campaign.description,
        }),
      })

      if (!res.ok) throw new Error('Failed to update campaign')

      toast({
        title: 'Campanha atualizada',
        description: 'As alterações foram salvas com sucesso.',
      })
    } catch (error) {
      toast({
        title: 'Erro ao salvar',
        variant: 'destructive',
      })
    } finally {
      setSaving(false)
    }
  }

  async function toggleStatus() {
    if (!campaign) return

    const newStatus = campaign.status === 'active' ? 'paused' : 'active'

    try {
      const res = await fetch(`/api/marketing/campaigns/${params.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })

      if (!res.ok) throw new Error('Failed to update status')

      setCampaign((prev) => prev ? { ...prev, status: newStatus } : null)

      toast({
        title: newStatus === 'active' ? 'Campanha ativada' : 'Campanha pausada',
      })
    } catch (error) {
      toast({
        title: 'Erro ao atualizar status',
        variant: 'destructive',
      })
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!campaign) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <p className="text-muted-foreground mb-4">Campanha não encontrada</p>
        <Button asChild>
          <Link href="/admin/marketing/campanhas">Voltar para Campanhas</Link>
        </Button>
      </div>
    )
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
            <h2 className="text-3xl font-bold tracking-tight">Editar Campanha</h2>
          </div>
          <p className="text-muted-foreground">
            Edite as informações e sequência de emails
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant={campaign.status === 'active' ? 'outline' : 'default'}
            onClick={toggleStatus}
          >
            {campaign.status === 'active' ? (
              <>
                <Pause className="h-4 w-4 mr-2" />
                Pausar
              </>
            ) : (
              <>
                <Play className="h-4 w-4 mr-2" />
                Ativar
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Status Card */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Status</p>
              <Badge variant={campaign.status === 'active' ? 'default' : 'outline'}>
                {campaign.status === 'active' ? 'Ativa' : 'Pausada'}
              </Badge>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Inscritos</p>
              <p className="text-2xl font-bold">{campaign.stats?.subscribers || 0}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Enviados</p>
              <p className="text-2xl font-bold">{campaign.stats?.sent || 0}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Total Emails</p>
              <p className="text-2xl font-bold">{campaign.steps?.length || 0}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Basic Info */}
      <Card>
        <CardHeader>
          <CardTitle>Informações Básicas</CardTitle>
          <CardDescription>Nome e descrição da campanha</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome da Campanha</Label>
            <Input
              id="name"
              value={campaign.name}
              onChange={(e) =>
                setCampaign((prev) => prev ? { ...prev, name: e.target.value } : null)
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              value={campaign.description}
              onChange={(e) =>
                setCampaign((prev) =>
                  prev ? { ...prev, description: e.target.value } : null
                )
              }
              rows={3}
            />
          </div>

          <Button onClick={saveCampaign} disabled={saving}>
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Salvando...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Salvar Alterações
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Email Sequence */}
      <Card>
        <CardHeader>
          <CardTitle>Sequência de Emails ({campaign.steps?.length || 0})</CardTitle>
          <CardDescription>
            Emails configurados nesta campanha
          </CardDescription>
        </CardHeader>
        <CardContent>
          {campaign.steps && campaign.steps.length > 0 ? (
            <div className="space-y-4">
              {campaign.steps
                .sort((a, b) => a.step_number - b.step_number)
                .map((step, index) => (
                  <div
                    key={step.id}
                    className="flex items-start gap-4 p-4 border rounded-lg"
                  >
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-semibold text-primary">
                        {step.step_number}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold">{step.name}</h4>
                        {(step.delay_days > 0 || step.delay_hours > 0) && (
                          <Badge variant="outline" className="gap-1">
                            <Clock className="h-3 w-3" />
                            {step.delay_days > 0 && `${step.delay_days}d `}
                            {step.delay_hours > 0 && `${step.delay_hours}h`}
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
                    <Mail className="h-5 w-5 text-muted-foreground" />
                  </div>
                ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Mail className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Nenhum email configurado ainda</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Warning for Active Campaigns */}
      {campaign.status === 'active' && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <div className="h-5 w-5 rounded-full bg-yellow-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-white text-xs font-bold">!</span>
              </div>
              <div>
                <p className="font-medium text-yellow-900 mb-1">
                  Campanha Ativa
                </p>
                <p className="text-sm text-yellow-800">
                  Esta campanha está ativa e enviando emails. Modificações na sequência não afetarão emails já agendados.
                  Para fazer alterações significativas, pause a campanha primeiro.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
