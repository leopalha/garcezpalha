'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { AdminPageHeader } from '@/components/admin/AdminPageHeader'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/components/ui/use-toast'
import { Loader2, Send, Edit } from 'lucide-react'
import Link from 'next/link'

// Same metadata as edit page
const TEMPLATE_METADATA: Record<string, any> = {
  'welcome-email': {
    id: 'welcome-email',
    name: 'Email de Boas-vindas',
    variables: ['name', 'email', 'service'],
  },
  'appointment-confirmation': {
    id: 'appointment-confirmation',
    name: 'Confirmação de Agendamento',
    variables: ['name', 'date', 'time', 'meetLink', 'lawyerName'],
  },
  'contract-signed': {
    id: 'contract-signed',
    name: 'Contrato Assinado',
    variables: ['name', 'contractType', 'signedDate'],
  },
  'lead-notification': {
    id: 'lead-notification',
    name: 'Notificação de Novo Lead',
    variables: ['leadName', 'leadEmail', 'leadPhone', 'service', 'qualificationScore'],
  },
  'payment-receipt': {
    id: 'payment-receipt',
    name: 'Recibo de Pagamento',
    variables: ['name', 'amount', 'paymentDate', 'paymentMethod', 'invoiceNumber'],
  },
  'payment-reminder': {
    id: 'payment-reminder',
    name: 'Lembrete de Pagamento',
    variables: ['name', 'amount', 'dueDate', 'daysUntilDue', 'pixQrCode', 'urgencyLevel'],
  },
  'nps-feedback': {
    id: 'nps-feedback',
    name: 'Pesquisa NPS',
    variables: ['name', 'service', 'surveyLink'],
  },
  'partner-welcome': {
    id: 'partner-welcome',
    name: 'Boas-vindas Parceiro',
    variables: ['partnerName', 'commissionRate', 'dashboardLink'],
  },
}

export default function TemplatePreviewPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const [template, setTemplate] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [previewHtml, setPreviewHtml] = useState('')
  const [testEmail, setTestEmail] = useState('')
  const [sending, setSending] = useState(false)

  // Variable values for preview
  const [variableValues, setVariableValues] = useState<Record<string, string>>({})

  const templateId = params.id as string

  useEffect(() => {
    loadTemplate()
  }, [templateId])

  const loadTemplate = async () => {
    setLoading(true)
    try {
      const metadata = TEMPLATE_METADATA[templateId]
      if (!metadata) {
        toast({
          title: 'Template não encontrado',
          variant: 'destructive',
        })
        router.push('/admin/templates')
        return
      }

      // Load template content
      const response = await fetch(`/api/admin/templates/${templateId}`)
      if (response.ok) {
        const data = await response.json()
        setTemplate({ ...metadata, content: data.content })

        // Initialize variable values with defaults
        const defaults: Record<string, string> = {}
        metadata.variables.forEach((v: string) => {
          defaults[v] = getDefaultValue(v)
        })
        setVariableValues(defaults)

        // Generate initial preview
        generatePreview({ ...metadata, content: data.content }, defaults)
      } else {
        // Fallback content
        const fallbackContent = `<h2>Bem-vindo(a), {{name}}!</h2><p>Template preview content...</p>`
        setTemplate({ ...metadata, content: fallbackContent })
        generatePreview({ ...metadata, content: fallbackContent }, {})
      }
    } catch (error) {
      console.error('Error loading template:', error)
      toast({
        title: 'Erro ao carregar template',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const getDefaultValue = (variable: string): string => {
    const defaults: Record<string, string> = {
      name: 'João Silva',
      email: 'joao.silva@example.com',
      service: 'Direito Bancário',
      date: new Date().toLocaleDateString('pt-BR'),
      time: '14:00',
      meetLink: 'https://meet.google.com/abc-defg-hij',
      lawyerName: 'Dr. Carlos Garcez',
      contractType: 'Prestação de Serviços Jurídicos',
      signedDate: new Date().toLocaleDateString('pt-BR'),
      leadName: 'Maria Santos',
      leadEmail: 'maria@example.com',
      leadPhone: '(11) 98765-4321',
      qualificationScore: '85',
      amount: 'R$ 2.500,00',
      paymentDate: new Date().toLocaleDateString('pt-BR'),
      paymentMethod: 'PIX',
      invoiceNumber: '2024-001',
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('pt-BR'),
      daysUntilDue: '7',
      pixQrCode: '[QR CODE]',
      urgencyLevel: 'normal',
      surveyLink: 'https://garcezpalha.com.br/nps/abc123',
      partnerName: 'Empresa Parceira Ltda',
      commissionRate: '15%',
      dashboardLink: 'https://garcezpalha.com.br/parceiros',
    }
    return defaults[variable] || `{{${variable}}}`
  }

  const generatePreview = (tmpl: any, values: Record<string, string>) => {
    let html = tmpl.content

    // Replace all variables
    Object.entries(values).forEach(([key, value]) => {
      const regex = new RegExp(`{{${key}}}`, 'g')
      html = html.replace(regex, value)
    })

    // Wrap in email template structure
    const fullHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f4f4f5;">
          <div style="max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <div style="padding: 30px; background-color: #1E3A8A; border-radius: 8px 8px 0 0; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: bold;">
                Garcez<span style="color: #D4AF37;"> Palha</span>
              </h1>
              <p style="margin: 5px 0 0; color: #94a3b8; font-size: 14px;">267 Anos de Tradição Jurídica</p>
            </div>
            <div style="padding: 40px 30px;">
              ${html}
            </div>
            <div style="padding: 20px 30px; background-color: #f8fafc; border-radius: 0 0 8px 8px; text-align: center; border-top: 1px solid #e2e8f0;">
              <p style="margin: 0 0 10px; color: #64748b; font-size: 12px; line-height: 1.5;">
                Garcez Palha - Advocacia e Perícia<br>
                Rua do Ouvidor, 121 - Centro, Rio de Janeiro - RJ<br>
                CEP: 20040-030 | Tel: (21) 3500-0000
              </p>
            </div>
          </div>
        </body>
      </html>
    `

    setPreviewHtml(fullHtml)
  }

  const handleVariableChange = (variable: string, value: string) => {
    const newValues = { ...variableValues, [variable]: value }
    setVariableValues(newValues)
    if (template) {
      generatePreview(template, newValues)
    }
  }

  const handleSendTest = async () => {
    if (!testEmail) {
      toast({
        title: 'Email obrigatório',
        description: 'Digite um email para enviar o teste.',
        variant: 'destructive',
      })
      return
    }

    setSending(true)
    try {
      const response = await fetch('/api/admin/templates/send-test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          templateId,
          to: testEmail,
          variables: variableValues,
        }),
      })

      if (response.ok) {
        toast({
          title: 'Email de teste enviado',
          description: `O email foi enviado para ${testEmail}`,
        })
        setTestEmail('')
      } else {
        throw new Error('Failed to send test email')
      }
    } catch (error) {
      console.error('Error sending test email:', error)
      toast({
        title: 'Erro ao enviar',
        description: 'Não foi possível enviar o email de teste.',
        variant: 'destructive',
      })
    } finally {
      setSending(false)
    }
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
        title={`Preview: ${template.name}`}
        description="Visualize e teste o template antes de usar"
        breadcrumbs={[
          { label: 'Templates', href: '/admin/templates' },
          { label: template.name, href: `/admin/templates/${templateId}` },
          { label: 'Preview', href: `/admin/templates/${templateId}/preview` },
        ]}
        action={
          <Button asChild>
            <Link href={`/admin/templates/${templateId}`}>
              <Edit className="h-4 w-4 mr-2" />
              Editar Template
            </Link>
          </Button>
        }
      />

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Variables Panel */}
        <Card>
          <CardHeader>
            <CardTitle>Variáveis de Teste</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {template.variables.map((variable: string) => (
              <div key={variable} className="space-y-2">
                <Label htmlFor={variable} className="text-xs font-mono">
                  {`{{${variable}}}`}
                </Label>
                <Input
                  id={variable}
                  value={variableValues[variable] || ''}
                  onChange={(e) => handleVariableChange(variable, e.target.value)}
                  placeholder={`Digite ${variable}...`}
                />
              </div>
            ))}

            <div className="pt-4 border-t">
              <Label htmlFor="test-email">Enviar Email de Teste</Label>
              <div className="flex gap-2 mt-2">
                <Input
                  id="test-email"
                  type="email"
                  value={testEmail}
                  onChange={(e) => setTestEmail(e.target.value)}
                  placeholder="seu@email.com"
                />
                <Button onClick={handleSendTest} disabled={sending}>
                  {sending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Preview Panel */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Preview do Email</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="border rounded-lg overflow-hidden bg-gray-50">
              <iframe
                srcDoc={previewHtml}
                className="w-full h-[600px] bg-white"
                title="Email Preview"
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
