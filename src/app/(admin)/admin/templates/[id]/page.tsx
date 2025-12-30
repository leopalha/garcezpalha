'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { AdminPageHeader } from '@/components/admin/AdminPageHeader'
import { TemplateEditor } from '@/components/admin/TemplateEditor'
import { Card, CardContent } from '@/components/ui/card'
import { useToast } from '@/components/ui/use-toast'
import { Loader2 } from 'lucide-react'

// Template metadata (same as in templates/page.tsx)
const TEMPLATE_METADATA: Record<string, any> = {
  'welcome-email': {
    id: 'welcome-email',
    name: 'Email de Boas-vindas',
    type: 'email',
    category: 'Onboarding',
    description: 'Primeiro email enviado após cadastro de novo lead',
    subject: 'Bem-vindo ao Garcez Palha!',
    variables: ['name', 'email', 'service'],
  },
  'appointment-confirmation': {
    id: 'appointment-confirmation',
    name: 'Confirmação de Agendamento',
    type: 'email',
    category: 'Agendamento',
    description: 'Email de confirmação com link do Google Meet',
    subject: 'Sua consulta foi agendada - Garcez Palha',
    variables: ['name', 'date', 'time', 'meetLink', 'lawyerName'],
  },
  'contract-signed': {
    id: 'contract-signed',
    name: 'Contrato Assinado',
    type: 'email',
    category: 'Contratos',
    description: 'Notificação de contrato assinado com próximos passos',
    subject: 'Contrato assinado com sucesso',
    variables: ['name', 'contractType', 'signedDate'],
  },
  'lead-notification': {
    id: 'lead-notification',
    name: 'Notificação de Novo Lead',
    type: 'email',
    category: 'Admin',
    description: 'Alerta para admin quando novo lead qualificado entra',
    subject: 'Novo lead qualificado - {leadName}',
    variables: ['leadName', 'leadEmail', 'leadPhone', 'service', 'qualificationScore'],
  },
  'payment-receipt': {
    id: 'payment-receipt',
    name: 'Recibo de Pagamento',
    type: 'email',
    category: 'Financeiro',
    description: 'Confirmação de pagamento recebido',
    subject: 'Recibo de pagamento - Garcez Palha',
    variables: ['name', 'amount', 'paymentDate', 'paymentMethod', 'invoiceNumber'],
  },
  'payment-reminder': {
    id: 'payment-reminder',
    name: 'Lembrete de Pagamento',
    type: 'email',
    category: 'Financeiro',
    description: 'Lembrete com 4 níveis de urgência e QR Code PIX',
    subject: 'Lembrete: Fatura vencendo em {daysUntilDue} dias',
    variables: ['name', 'amount', 'dueDate', 'daysUntilDue', 'pixQrCode', 'urgencyLevel'],
  },
  'nps-feedback': {
    id: 'nps-feedback',
    name: 'Pesquisa NPS',
    type: 'email',
    category: 'Feedback',
    description: 'Solicitação de feedback com escala 0-10',
    subject: 'Conte-nos sobre sua experiência',
    variables: ['name', 'service', 'surveyLink'],
  },
  'partner-welcome': {
    id: 'partner-welcome',
    name: 'Boas-vindas Parceiro',
    type: 'email',
    category: 'Parcerias',
    description: 'Email de onboarding para novos parceiros',
    subject: 'Bem-vindo à rede de parceiros Garcez Palha',
    variables: ['partnerName', 'commissionRate', 'dashboardLink'],
  },
}

export default function TemplateEditPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const [template, setTemplate] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const templateId = params.id as string

  useEffect(() => {
    loadTemplate()
  }, [templateId])

  const loadTemplate = async () => {
    setLoading(true)
    try {
      // Get metadata
      const metadata = TEMPLATE_METADATA[templateId]
      if (!metadata) {
        toast({
          title: 'Template não encontrado',
          description: 'O template solicitado não existe.',
          variant: 'destructive',
        })
        router.push('/admin/templates')
        return
      }

      // Load actual template content
      // For now, we'll use a placeholder. In production, this would fetch from API
      const response = await fetch(`/api/admin/templates/${templateId}`)
      if (response.ok) {
        const data = await response.json()
        setTemplate({ ...metadata, content: data.content })
      } else {
        // Fallback: load template file content as HTML
        setTemplate({
          ...metadata,
          content: `<h2>Bem-vindo(a), {{name}}!</h2>
<p>Obrigado por se cadastrar na plataforma Garcez Palha. Estamos honrados em ter você conosco.</p>
<p>Somos uma das mais antigas e respeitadas firmas jurídicas do Brasil, com mais de 364 anos de tradição em serviços jurídicos de excelência.</p>
<h3>O que você pode fazer agora:</h3>
<ul>
  <li>Agendar uma consulta gratuita com nossos especialistas</li>
  <li>Explorar nossos serviços jurídicos completos</li>
  <li>Acompanhar o andamento de seus processos</li>
  <li>Entrar em contato direto via WhatsApp</li>
</ul>
<p>Sua conta foi criada com o email: <strong>{{email}}</strong></p>
<p style="text-align: center; margin: 30px 0;">
  <a href="https://garcezpalha.com.br/contato" style="display: inline-block; padding: 12px 30px; background-color: #1E3A8A; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: 600;">Agendar Consulta</a>
</p>
<p>Se tiver qualquer dúvida, nossa equipe de atendimento está disponível de segunda a sexta, das 9h às 18h. Responderemos em até 24 horas úteis.</p>
<p style="margin-top: 30px;">Atenciosamente,<br><strong>Equipe Garcez Palha</strong></p>`,
        })
      }
    } catch (error) {
      console.error('Error loading template:', error)
      toast({
        title: 'Erro ao carregar template',
        description: 'Não foi possível carregar o template. Tente novamente.',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async (updatedTemplate: any) => {
    setSaving(true)
    try {
      const response = await fetch(`/api/admin/templates/${templateId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedTemplate),
      })

      if (response.ok) {
        toast({
          title: 'Template salvo',
          description: 'O template foi atualizado com sucesso.',
        })
        router.push('/admin/templates')
      } else {
        throw new Error('Failed to save template')
      }
    } catch (error) {
      console.error('Error saving template:', error)
      toast({
        title: 'Erro ao salvar',
        description: 'Não foi possível salvar o template. Tente novamente.',
        variant: 'destructive',
      })
    } finally {
      setSaving(false)
    }
  }

  const handlePreview = () => {
    router.push(`/admin/templates/${templateId}/preview`)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!template) {
    return null
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title={`Editar: ${template.name}`}
        description={`Tipo: ${template.type === 'email' ? 'Email' : template.type === 'whatsapp' ? 'WhatsApp' : 'Contrato'} • Categoria: ${template.category}`}
        breadcrumbs={[
          { label: 'Templates', href: '/admin/templates' },
          { label: template.name, href: `/admin/templates/${templateId}` },
        ]}
      />

      <Card>
        <CardContent className="pt-6">
          {saving && (
            <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
              <span className="text-sm text-blue-700 dark:text-blue-300">Salvando template...</span>
            </div>
          )}

          <TemplateEditor template={template} onSave={handleSave} onPreview={handlePreview} />
        </CardContent>
      </Card>
    </div>
  )
}
