'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import {
  Mail,
  Phone,
  Calendar,
  FileText,
  DollarSign,
  ArrowLeft,
  Loader2,
  Send,
  CheckCircle2,
} from 'lucide-react'
import { trpc } from '@/lib/trpc/client'
import { DocumentsList } from '@/components/admin/documents/DocumentsList'

export default function LeadDetailPage() {
  const params = useParams()
  const router = useRouter()
  const leadId = params.id as string

  const [generatingProposal, setGeneratingProposal] = useState(false)
  const [sendingPayment, setSendingPayment] = useState(false)
  const [proposal, setProposal] = useState<{
    id: string
    text: string
    pricing: { fixed: number; successFee?: number }
  } | null>(null)

  // Fetch lead data
  const { data: lead, isLoading, error } = trpc.leads.getById.useQuery({ id: leadId })

  const handleGenerateProposal = async () => {
    if (!lead) return

    setGeneratingProposal(true)
    try {
      const response = await fetch('/api/admin/proposals/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          leadId: lead.id,
          caseType: lead.service_interest,
          clientName: lead.full_name,
        }),
      })

      if (!response.ok) throw new Error('Erro ao gerar proposta')

      const data = await response.json()
      setProposal(data)
    } catch (error) {
      console.error('Error generating proposal:', error)
      alert('Erro ao gerar proposta. Tente novamente.')
    } finally {
      setGeneratingProposal(false)
    }
  }

  const handleSendProposal = async () => {
    if (!proposal) return

    setSendingPayment(true)
    try {
      const response = await fetch('/api/admin/proposals/send-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          proposalId: proposal.id,
          leadId: lead?.id,
        }),
      })

      if (!response.ok) throw new Error('Erro ao enviar proposta')

      const data = await response.json()
      alert(
        `Proposta enviada com sucesso!\n\nLink de pagamento: ${data.paymentLink}\n\nO cliente receberá 2 emails:\n1. Proposta comercial\n2. Link para pagamento PIX`
      )
      router.push('/admin/leads')
    } catch (error) {
      console.error('Error sending proposal:', error)
      alert('Erro ao enviar proposta. Tente novamente.')
    } finally {
      setSendingPayment(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  if (error || !lead) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardHeader>
            <CardTitle>Lead não encontrado</CardTitle>
            <CardDescription>O lead solicitado não existe ou foi removido.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => router.push('/admin/leads')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar para Leads
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const statusColors = {
    new: 'bg-blue-100 text-blue-800',
    contacted: 'bg-yellow-100 text-yellow-800',
    qualified: 'bg-green-100 text-green-800',
    converted: 'bg-purple-100 text-purple-800',
    lost: 'bg-red-100 text-red-800',
  }

  return (
    <div className="container mx-auto py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => router.push('/admin/leads')}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{lead.full_name}</h1>
            <p className="text-muted-foreground">Lead #{lead.id.slice(0, 8)}</p>
          </div>
        </div>
        <div className={`px-4 py-2 rounded-full text-sm font-semibold ${statusColors[lead.status]}`}>
          {lead.status.toUpperCase()}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Lead Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Contact Info */}
          <Card>
            <CardHeader>
              <CardTitle>Informações de Contato</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">{lead.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Telefone</p>
                  <p className="font-medium">{lead.phone}</p>
                </div>
              </div>
              {lead.company && (
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Empresa</p>
                    <p className="font-medium">{lead.company}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Service Interest & Message */}
          <Card>
            <CardHeader>
              <CardTitle>Interesse e Mensagem</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Serviço de Interesse</p>
                <p className="font-medium text-lg">{lead.service_interest}</p>
              </div>
              {lead.message && (
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Mensagem</p>
                  <div className="bg-muted p-4 rounded-lg">
                    <p className="whitespace-pre-wrap">{lead.message}</p>
                  </div>
                </div>
              )}
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="w-4 h-4" />
                <span>
                  Recebido em {new Date(lead.created_at).toLocaleDateString('pt-BR')} às{' '}
                  {new Date(lead.created_at).toLocaleTimeString('pt-BR')}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Proposal Generator */}
          {!proposal && (
            <Card>
              <CardHeader>
                <CardTitle>Gerar Proposta Comercial</CardTitle>
                <CardDescription>
                  Use IA para gerar uma proposta profissional personalizada para este lead
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  onClick={handleGenerateProposal}
                  disabled={generatingProposal}
                  size="lg"
                  className="w-full"
                >
                  {generatingProposal ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Gerando Proposta...
                    </>
                  ) : (
                    <>
                      <FileText className="w-5 h-5 mr-2" />
                      Gerar Proposta Automática
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Proposal Preview */}
          {proposal && (
            <Card className="border-green-200 bg-green-50/50">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-green-900">Proposta Gerada</CardTitle>
                    <CardDescription>Revise antes de enviar ao cliente</CardDescription>
                  </div>
                  <CheckCircle2 className="w-6 h-6 text-green-600" />
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-white p-6 rounded-lg border border-green-200">
                  <Textarea
                    value={proposal.text}
                    onChange={(e) => setProposal({ ...proposal, text: e.target.value })}
                    rows={12}
                    className="font-mono text-sm resize-none"
                  />
                </div>

                <div className="bg-white p-4 rounded-lg border border-green-200">
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <DollarSign className="w-4 h-4" />
                    Valores
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Honorários Fixos:</span>
                      <span className="font-semibold">
                        {proposal.pricing.fixed.toLocaleString('pt-BR', {
                          style: 'currency',
                          currency: 'BRL',
                        })}
                      </span>
                    </div>
                    {proposal.pricing.successFee && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Taxa de Êxito:</span>
                        <span className="font-semibold">{proposal.pricing.successFee}%</span>
                      </div>
                    )}
                  </div>
                </div>

                <Button
                  onClick={handleSendProposal}
                  disabled={sendingPayment}
                  size="lg"
                  className="w-full bg-green-600 hover:bg-green-700"
                >
                  {sendingPayment ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5 mr-2" />
                      Enviar Proposta + Link de Pagamento
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Documents Section */}
          <DocumentsList leadId={leadId} />
        </div>

        {/* Right Column - Timeline & Actions */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Informações Adicionais</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Origem</p>
                <p className="font-medium capitalize">{lead.source}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Criado em</p>
                <p className="font-medium">
                  {new Date(lead.created_at).toLocaleDateString('pt-BR', {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric',
                  })}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Última atualização</p>
                <p className="font-medium">
                  {new Date(lead.updated_at).toLocaleDateString('pt-BR', {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric',
                  })}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Ações Rápidas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start" asChild>
                <a href={`mailto:${lead.email}`}>
                  <Mail className="w-4 h-4 mr-2" />
                  Enviar Email
                </a>
              </Button>
              <Button variant="outline" className="w-full justify-start" asChild>
                <a href={`tel:${lead.phone}`}>
                  <Phone className="w-4 h-4 mr-2" />
                  Ligar
                </a>
              </Button>
              <Button variant="outline" className="w-full justify-start" asChild>
                <a
                  href={`https://wa.me/${lead.phone.replace(/\D/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Phone className="w-4 h-4 mr-2" />
                  WhatsApp
                </a>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
