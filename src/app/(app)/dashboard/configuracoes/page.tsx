'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import {
  Settings,
  User,
  Bell,
  Lock,
  CreditCard,
  Zap,
  Mail,
  Shield,
  Key,
  Save,
  AlertCircle,
  Check,
  ExternalLink,
  Database,
  Cloud,
  Loader2,
  MessageSquare,
  Download,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useSession } from 'next-auth/react'
import { useToast } from '@/components/ui/use-toast'

interface APISettings {
  profile: {
    name: string
    email: string
    phone: string
    avatar: string
    bio: string
    oab: string
    specialization: string
  }
  notifications: {
    emailNewLeads: boolean
    emailConversations: boolean
    emailPayments: boolean
    whatsappNotifications: boolean
    desktopNotifications: boolean
    weeklyReport: boolean
  }
  integrations: {
    googleCalendarConnected: boolean
    gmailConnected: boolean
    whatsappConnected: boolean
    stripeConnected: boolean
  }
  security: {
    twoFactorEnabled: boolean
    lastPasswordChange: string
  }
}

interface IntegrationStatus {
  name: string
  icon: React.ElementType
  connected: boolean
  description: string
  key: keyof APISettings['integrations']
}

export default function ConfiguracoesPage() {
  const { data: session } = useSession()
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)
  const [settings, setSettings] = useState<APISettings | null>(null)

  // Password change modal
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [passwordData, setPasswordData] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' })
  const [changingPassword, setChangingPassword] = useState(false)

  // Export data loading
  const [exporting, setExporting] = useState(false)

  // 2FA modal
  const [show2FAModal, setShow2FAModal] = useState(false)
  const [twoFAStep, setTwoFAStep] = useState<'setup' | 'verify'>('setup')
  const [twoFAData, setTwoFAData] = useState<{ secret: string; qrCode: string } | null>(null)
  const [verificationCode, setVerificationCode] = useState('')
  const [enabling2FA, setEnabling2FA] = useState(false)

  // OAuth integrations
  const [connectingIntegration, setConnectingIntegration] = useState<string | null>(null)
  const [showWhatsAppModal, setShowWhatsAppModal] = useState(false)
  const [showStripeModal, setShowStripeModal] = useState(false)
  const [whatsAppData, setWhatsAppData] = useState({ phoneNumber: '', apiToken: '', businessAccountId: '' })
  const [stripeData, setStripeData] = useState({ apiKey: '' })

  useEffect(() => {
    fetchSettings()
  }, [])

  async function fetchSettings() {
    try {
      setLoading(true)
      const res = await fetch('/api/dashboard/configuracoes/seguranca')
      if (!res.ok) throw new Error('Failed to fetch settings')
      const data = await res.json()
      setSettings(data)
    } catch (error) {
      console.error('Error fetching settings:', error)
      toast({
        title: 'Erro ao carregar configurações',
        description: 'Não foi possível carregar suas configurações.',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  async function handleChangePassword() {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({
        title: 'Senhas não conferem',
        description: 'A nova senha e a confirmação devem ser iguais.',
        variant: 'destructive',
      })
      return
    }

    if (passwordData.newPassword.length < 8) {
      toast({
        title: 'Senha fraca',
        description: 'A senha deve ter pelo menos 8 caracteres.',
        variant: 'destructive',
      })
      return
    }

    try {
      setChangingPassword(true)
      const res = await fetch('/api/user/password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Erro ao alterar senha')
      }

      toast({
        title: 'Senha alterada!',
        description: 'Sua senha foi alterada com sucesso.',
      })

      setShowPasswordModal(false)
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' })
      fetchSettings() // Refresh to update last password change date
    } catch (error: any) {
      toast({
        title: 'Erro ao alterar senha',
        description: error.message,
        variant: 'destructive',
      })
    } finally {
      setChangingPassword(false)
    }
  }

  async function handleExportData() {
    try {
      setExporting(true)
      const res = await fetch('/api/user/export')

      if (!res.ok) {
        throw new Error('Erro ao exportar dados')
      }

      // Download the file
      const blob = await res.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `garcez-palha-dados-${new Date().toISOString().split('T')[0]}.json`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)

      toast({
        title: 'Dados exportados!',
        description: 'Seus dados foram exportados com sucesso.',
      })
    } catch (error: any) {
      toast({
        title: 'Erro ao exportar dados',
        description: error.message,
        variant: 'destructive',
      })
    } finally {
      setExporting(false)
    }
  }

  async function handleSetup2FA() {
    try {
      setEnabling2FA(true)
      setTwoFAStep('setup')
      setShow2FAModal(true)

      const res = await fetch('/api/auth/2fa/setup', {
        method: 'POST',
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Erro ao configurar 2FA')
      }

      const data = await res.json()
      setTwoFAData({ secret: data.secret, qrCode: data.qrCode })
      setTwoFAStep('verify')
    } catch (error: any) {
      toast({
        title: 'Erro ao configurar 2FA',
        description: error.message,
        variant: 'destructive',
      })
      setShow2FAModal(false)
    } finally {
      setEnabling2FA(false)
    }
  }

  async function handleVerify2FA() {
    if (!verificationCode || verificationCode.length !== 6) {
      toast({
        title: 'Código inválido',
        description: 'Digite o código de 6 dígitos do seu aplicativo autenticador.',
        variant: 'destructive',
      })
      return
    }

    try {
      setEnabling2FA(true)

      const res = await fetch('/api/auth/2fa/verify-setup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: verificationCode }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Código de verificação inválido')
      }

      toast({
        title: '2FA Ativado!',
        description: 'Autenticação em dois fatores ativada com sucesso.',
      })

      setShow2FAModal(false)
      setVerificationCode('')
      setTwoFAData(null)
      fetchSettings() // Refresh to update 2FA status
    } catch (error: any) {
      toast({
        title: 'Erro na verificação',
        description: error.message,
        variant: 'destructive',
      })
    } finally {
      setEnabling2FA(false)
    }
  }

  async function handleDisable2FA() {
    const confirm = window.confirm(
      'Tem certeza que deseja desativar a autenticação em dois fatores?\n\n' +
      'Isso tornará sua conta menos segura.'
    )

    if (!confirm) return

    try {
      setEnabling2FA(true)

      const res = await fetch('/api/auth/2fa/disable', {
        method: 'POST',
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Erro ao desativar 2FA')
      }

      toast({
        title: '2FA Desativado',
        description: 'Autenticação em dois fatores desativada.',
      })

      fetchSettings() // Refresh
    } catch (error: any) {
      toast({
        title: 'Erro ao desativar 2FA',
        description: error.message,
        variant: 'destructive',
      })
    } finally {
      setEnabling2FA(false)
    }
  }

  async function handleConnectGoogle() {
    try {
      setConnectingIntegration('google')

      const res = await fetch('/api/integrations/google/auth')
      if (!res.ok) throw new Error('Erro ao iniciar OAuth')

      const data = await res.json()

      // Redirect to Google OAuth
      window.location.href = data.authUrl
    } catch (error: any) {
      toast({
        title: 'Erro ao conectar Google',
        description: error.message,
        variant: 'destructive',
      })
      setConnectingIntegration(null)
    }
  }

  async function handleConnectWhatsApp() {
    if (!whatsAppData.phoneNumber || !whatsAppData.apiToken) {
      toast({
        title: 'Campos obrigatórios',
        description: 'Preencha o número e o token da API',
        variant: 'destructive',
      })
      return
    }

    try {
      setConnectingIntegration('whatsapp')

      const res = await fetch('/api/integrations/whatsapp/connect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(whatsAppData),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Erro ao conectar WhatsApp')
      }

      toast({
        title: 'WhatsApp Conectado!',
        description: 'WhatsApp Business conectado com sucesso.',
      })

      setShowWhatsAppModal(false)
      setWhatsAppData({ phoneNumber: '', apiToken: '', businessAccountId: '' })
      fetchSettings()
    } catch (error: any) {
      toast({
        title: 'Erro ao conectar WhatsApp',
        description: error.message,
        variant: 'destructive',
      })
    } finally {
      setConnectingIntegration(null)
    }
  }

  async function handleConnectStripe() {
    try {
      setConnectingIntegration('stripe')

      if (stripeData.apiKey) {
        // Use API key method
        const res = await fetch('/api/integrations/stripe/connect', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ apiKey: stripeData.apiKey }),
        })

        if (!res.ok) {
          const data = await res.json()
          throw new Error(data.error || 'Erro ao conectar Stripe')
        }

        toast({
          title: 'Stripe Conectado!',
          description: 'Stripe conectado com sucesso.',
        })

        setShowStripeModal(false)
        setStripeData({ apiKey: '' })
        fetchSettings()
      } else {
        // Use OAuth method
        const res = await fetch('/api/integrations/stripe/connect')
        if (!res.ok) throw new Error('Erro ao iniciar OAuth')

        const data = await res.json()
        window.location.href = data.authUrl
      }
    } catch (error: any) {
      toast({
        title: 'Erro ao conectar Stripe',
        description: error.message,
        variant: 'destructive',
      })
    } finally {
      setConnectingIntegration(null)
    }
  }

  async function handleDisconnectIntegration(provider: string) {
    const confirm = window.confirm(
      `Tem certeza que deseja desconectar ${provider}?`
    )

    if (!confirm) return

    try {
      setConnectingIntegration(provider)

      const endpoint = provider === 'google'
        ? '/api/integrations/google/callback'
        : provider === 'whatsapp'
        ? '/api/integrations/whatsapp/connect'
        : '/api/integrations/stripe/connect'

      const res = await fetch(endpoint, { method: 'DELETE' })

      if (!res.ok) throw new Error('Erro ao desconectar')

      toast({
        title: 'Desconectado!',
        description: `${provider} desconectado com sucesso.`,
      })

      fetchSettings()
    } catch (error: any) {
      toast({
        title: 'Erro ao desconectar',
        description: error.message,
        variant: 'destructive',
      })
    } finally {
      setConnectingIntegration(null)
    }
  }

  async function handleDeleteAccount() {
    // Double confirmation for account deletion
    const firstConfirm = confirm(
      'ATENÇÃO: Esta ação solicitará a exclusão permanente da sua conta.\n\n' +
      'Você tem certeza que deseja continuar?'
    )

    if (!firstConfirm) return

    const secondConfirm = confirm(
      'ÚLTIMA CONFIRMAÇÃO:\n\n' +
      'Todos os seus dados serão marcados para exclusão.\n' +
      'Você terá 30 dias para cancelar esta solicitação.\n\n' +
      'Digite "EXCLUIR" abaixo para confirmar.'
    )

    if (!secondConfirm) return

    // Ask user to type EXCLUIR to confirm
    const confirmation = prompt('Digite "EXCLUIR" para confirmar a exclusão da conta:')

    if (confirmation !== 'EXCLUIR') {
      toast({
        title: 'Exclusão cancelada',
        description: 'A confirmação não foi digitada corretamente.',
        variant: 'default',
      })
      return
    }

    try {
      setSaving(true)
      const res = await fetch('/api/compliance/data-deletion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reason: 'Solicitação de exclusão pelo usuário via configurações'
        })
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Erro ao solicitar exclusão')
      }

      toast({
        title: 'Solicitação enviada',
        description: data.message || 'Sua conta será excluída em 30 dias. Você receberá um email de confirmação.',
      })

      // Redirect to home after 3 seconds
      setTimeout(() => {
        window.location.href = '/'
      }, 3000)
    } catch (error: any) {
      toast({
        title: 'Erro ao solicitar exclusão',
        description: error.message,
        variant: 'destructive',
      })
    } finally {
      setSaving(false)
    }
  }

  const integrations: IntegrationStatus[] = [
    {
      name: 'Google Calendar',
      icon: Database,
      connected: settings?.integrations.googleCalendarConnected || false,
      description: 'Sincronização de agendamentos',
      key: 'googleCalendarConnected',
    },
    {
      name: 'Gmail',
      icon: Mail,
      connected: settings?.integrations.gmailConnected || false,
      description: 'Envio de emails',
      key: 'gmailConnected',
    },
    {
      name: 'WhatsApp Business',
      icon: Mail,
      connected: settings?.integrations.whatsappConnected || false,
      description: 'Envio de mensagens automáticas',
      key: 'whatsappConnected',
    },
    {
      name: 'Stripe/MercadoPago',
      icon: CreditCard,
      connected: settings?.integrations.stripeConnected || false,
      description: 'Processamento de pagamentos',
      key: 'stripeConnected',
    },
  ]

  const updateProfile = (key: keyof APISettings['profile'], value: string) => {
    if (!settings) return
    setSettings({
      ...settings,
      profile: { ...settings.profile, [key]: value },
    })
    setHasChanges(true)
  }

  const updateNotification = (key: keyof APISettings['notifications'], value: boolean) => {
    if (!settings) return
    setSettings({
      ...settings,
      notifications: { ...settings.notifications, [key]: value },
    })
    setHasChanges(true)
  }

  const handleSave = async () => {
    if (!settings) return

    try {
      setSaving(true)
      const res = await fetch('/api/dashboard/configuracoes/seguranca', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      })

      if (!res.ok) throw new Error('Failed to save settings')

      const updated = await res.json()
      setSettings(updated)
      setHasChanges(false)

      toast({
        title: 'Configurações salvas',
        description: 'Suas configurações foram atualizadas com sucesso.',
      })
    } catch (error) {
      console.error('Error saving settings:', error)
      toast({
        title: 'Erro ao salvar',
        description: 'Não foi possível salvar as configurações.',
        variant: 'destructive',
      })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!settings) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <p className="text-muted-foreground">Não foi possível carregar as configurações</p>
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Settings className="h-8 w-8 text-primary" />
            Configurações
          </h1>
          <p className="text-muted-foreground mt-1">
            Gerencie suas preferências e integrações
          </p>
        </div>
        <Button onClick={handleSave} disabled={!hasChanges || saving}>
          {saving ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Save className="h-4 w-4 mr-2" />
          )}
          {saving ? 'Salvando...' : 'Salvar Alterações'}
        </Button>
      </div>

      {hasChanges && (
        <div className="bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 flex items-center gap-3">
          <AlertCircle className="h-5 w-5 text-yellow-600" />
          <p className="text-sm font-medium text-yellow-900 dark:text-yellow-100">
            Você tem alterações não salvas
          </p>
        </div>
      )}

      {/* User Profile */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Perfil do Usuário
          </CardTitle>
          <CardDescription>Suas informações pessoais e preferências</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome Completo</Label>
              <Input
                id="name"
                value={settings.profile.name}
                onChange={(e) => updateProfile('name', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={settings.profile.email}
                disabled
                className="bg-muted"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Telefone</Label>
              <Input
                id="phone"
                value={settings.profile.phone}
                onChange={(e) => updateProfile('phone', e.target.value)}
                placeholder="(11) 98765-4321"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="oab">OAB</Label>
              <Input
                id="oab"
                value={settings.profile.oab}
                onChange={(e) => updateProfile('oab', e.target.value)}
                placeholder="OAB/SP 123456"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="specialization">Especialização</Label>
            <Input
              id="specialization"
              value={settings.profile.specialization}
              onChange={(e) => updateProfile('specialization', e.target.value)}
              placeholder="Direito Civil, Família, Trabalhista..."
            />
          </div>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notificações
          </CardTitle>
          <CardDescription>Configure quando você quer ser notificado</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <Label htmlFor="email-new-leads" className="text-base cursor-pointer">
                    Email - Novos Leads
                  </Label>
                </div>
                <p className="text-sm text-muted-foreground">
                  Receba email sempre que um novo lead entrar
                </p>
              </div>
              <Switch
                id="email-new-leads"
                checked={settings.notifications.emailNewLeads}
                onCheckedChange={(v) => updateNotification('emailNewLeads', v)}
              />
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4 text-muted-foreground" />
                  <Label htmlFor="email-conversations" className="text-base cursor-pointer">
                    Email - Conversas
                  </Label>
                </div>
                <p className="text-sm text-muted-foreground">
                  Notificações de novas conversas com leads
                </p>
              </div>
              <Switch
                id="email-conversations"
                checked={settings.notifications.emailConversations}
                onCheckedChange={(v) => updateNotification('emailConversations', v)}
              />
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4 text-muted-foreground" />
                  <Label htmlFor="email-payments" className="text-base cursor-pointer">
                    Email - Pagamentos
                  </Label>
                </div>
                <p className="text-sm text-muted-foreground">
                  Confirmação quando um pagamento for aprovado
                </p>
              </div>
              <Switch
                id="email-payments"
                checked={settings.notifications.emailPayments}
                onCheckedChange={(v) => updateNotification('emailPayments', v)}
              />
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <Bell className="h-4 w-4 text-muted-foreground" />
                  <Label htmlFor="whatsapp-notifications" className="text-base cursor-pointer">
                    WhatsApp - Notificações
                  </Label>
                </div>
                <p className="text-sm text-muted-foreground">
                  Receber notificações via WhatsApp
                </p>
              </div>
              <Switch
                id="whatsapp-notifications"
                checked={settings.notifications.whatsappNotifications}
                onCheckedChange={(v) => updateNotification('whatsappNotifications', v)}
              />
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <Bell className="h-4 w-4 text-muted-foreground" />
                  <Label htmlFor="desktop-notifications" className="text-base cursor-pointer">
                    Desktop - Notificações Push
                  </Label>
                </div>
                <p className="text-sm text-muted-foreground">
                  Notificação push no navegador
                </p>
              </div>
              <Switch
                id="desktop-notifications"
                checked={settings.notifications.desktopNotifications}
                onCheckedChange={(v) => updateNotification('desktopNotifications', v)}
              />
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <Label htmlFor="weekly-report" className="text-base cursor-pointer">
                    Relatório Semanal
                  </Label>
                </div>
                <p className="text-sm text-muted-foreground">
                  Receba um email com o resumo semanal
                </p>
              </div>
              <Switch
                id="weekly-report"
                checked={settings.notifications.weeklyReport}
                onCheckedChange={(v) => updateNotification('weeklyReport', v)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Integrations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Integrações
          </CardTitle>
          <CardDescription>Conecte serviços externos à sua plataforma</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {integrations.map((integration) => {
              const Icon = integration.icon
              return (
                <div
                  key={integration.name}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        'h-10 w-10 rounded-lg flex items-center justify-center',
                        integration.connected
                          ? 'bg-green-100 dark:bg-green-900/30'
                          : 'bg-gray-100 dark:bg-gray-900/30'
                      )}
                    >
                      <Icon
                        className={cn(
                          'h-5 w-5',
                          integration.connected ? 'text-green-600' : 'text-gray-600'
                        )}
                      />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{integration.name}</p>
                        {integration.connected ? (
                          <Badge variant="secondary" className="bg-green-100 text-green-700 text-xs">
                            <Check className="h-3 w-3 mr-1" />
                            Conectado
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-xs">
                            Desconectado
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{integration.description}</p>
                    </div>
                  </div>
                  <Button
                    variant={integration.connected ? 'outline' : 'default'}
                    size="sm"
                    onClick={() => {
                      if (integration.connected) {
                        const provider = integration.name.includes('Google') ? 'google'
                          : integration.name.includes('WhatsApp') ? 'whatsapp'
                          : 'stripe'
                        handleDisconnectIntegration(provider)
                      } else {
                        if (integration.name.includes('Google')) {
                          handleConnectGoogle()
                        } else if (integration.name.includes('WhatsApp')) {
                          setShowWhatsAppModal(true)
                        } else {
                          setShowStripeModal(true)
                        }
                      }
                    }}
                    disabled={connectingIntegration !== null}
                  >
                    {connectingIntegration === (
                      integration.name.includes('Google') ? 'google'
                      : integration.name.includes('WhatsApp') ? 'whatsapp'
                      : 'stripe'
                    ) ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Conectando...
                      </>
                    ) : (
                      integration.connected ? 'Desconectar' : 'Conectar'
                    )}
                  </Button>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Security */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5" />
            Segurança
          </CardTitle>
          <CardDescription>Proteja sua conta e dados</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <Key className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="font-medium">Alterar Senha</p>
                <p className="text-sm text-muted-foreground">
                  Última alteração: {settings.security.lastPasswordChange
                    ? new Date(settings.security.lastPasswordChange).toLocaleDateString('pt-BR')
                    : 'Nunca'}
                </p>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={() => setShowPasswordModal(true)}>
              Alterar
            </Button>
          </div>

          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                <Shield className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="font-medium">Autenticação em Dois Fatores (2FA)</p>
                <p className="text-sm text-muted-foreground">
                  {settings.security.twoFactorEnabled
                    ? 'Ativado - Sua conta está protegida'
                    : 'Adicione uma camada extra de segurança'}
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                if (settings.security.twoFactorEnabled) {
                  handleDisable2FA()
                } else {
                  handleSetup2FA()
                }
              }}
              disabled={enabling2FA}
            >
              {enabling2FA ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  {settings.security.twoFactorEnabled ? 'Desativando...' : 'Ativando...'}
                </>
              ) : (
                settings.security.twoFactorEnabled ? 'Desativar' : 'Ativar'
              )}
            </Button>
          </div>

          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                <Database className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="font-medium">Exportar Dados</p>
                <p className="text-sm text-muted-foreground">
                  Download de todos os seus dados em JSON
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportData}
              disabled={exporting}
            >
              {exporting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Exportando...
                </>
              ) : (
                <>
                  <Download className="h-4 w-4 mr-2" />
                  Exportar
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-red-200 dark:border-red-800">
        <CardHeader>
          <CardTitle className="text-red-600 flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            Zona de Perigo
          </CardTitle>
          <CardDescription>Ações irreversíveis relacionadas à sua conta</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 border border-red-200 dark:border-red-800 rounded-lg">
            <div>
              <p className="font-medium">Excluir Conta</p>
              <p className="text-sm text-muted-foreground">
                Solicite a exclusão permanente da sua conta e todos os dados (período de graça de 30 dias)
              </p>
            </div>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleDeleteAccount}
              disabled={saving}
            >
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Processando...
                </>
              ) : (
                'Excluir'
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Password Change Modal */}
      <Dialog open={showPasswordModal} onOpenChange={setShowPasswordModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Alterar Senha</DialogTitle>
            <DialogDescription>
              Digite sua senha atual e escolha uma nova senha.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Senha Atual</Label>
              <Input
                id="currentPassword"
                type="password"
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                placeholder="Digite sua senha atual"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="newPassword">Nova Senha</Label>
              <Input
                id="newPassword"
                type="password"
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                placeholder="Mínimo 8 caracteres"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmar Nova Senha</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                placeholder="Digite novamente a nova senha"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPasswordModal(false)} disabled={changingPassword}>
              Cancelar
            </Button>
            <Button onClick={handleChangePassword} disabled={changingPassword}>
              {changingPassword ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Alterando...
                </>
              ) : (
                'Alterar Senha'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 2FA Setup Modal */}
      <Dialog open={show2FAModal} onOpenChange={(open) => {
        setShow2FAModal(open)
        if (!open) {
          setVerificationCode('')
          setTwoFAData(null)
          setTwoFAStep('setup')
        }
      }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Configurar Autenticação em Dois Fatores</DialogTitle>
            <DialogDescription>
              {twoFAStep === 'setup'
                ? 'Gerando QR code...'
                : 'Escaneie o QR code com seu aplicativo autenticador'}
            </DialogDescription>
          </DialogHeader>

          {twoFAStep === 'verify' && twoFAData && (
            <div className="space-y-4 py-4">
              {/* QR Code */}
              <div className="flex justify-center">
                <div className="border-2 border-gray-200 p-4 rounded-lg">
                  <img src={twoFAData.qrCode} alt="QR Code 2FA" className="w-48 h-48" />
                </div>
              </div>

              {/* Secret Key (manual entry) */}
              <div className="space-y-2">
                <Label className="text-sm text-muted-foreground">
                  Ou insira manualmente a chave:
                </Label>
                <div className="flex items-center gap-2 p-2 bg-muted rounded-md">
                  <code className="flex-1 text-sm font-mono break-all">
                    {twoFAData.secret}
                  </code>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      navigator.clipboard.writeText(twoFAData.secret)
                      toast({
                        title: 'Copiado!',
                        description: 'Chave copiada para a área de transferência.',
                      })
                    }}
                  >
                    Copiar
                  </Button>
                </div>
              </div>

              {/* Verification Code Input */}
              <div className="space-y-2">
                <Label htmlFor="verificationCode">
                  Código de Verificação
                </Label>
                <Input
                  id="verificationCode"
                  type="text"
                  maxLength={6}
                  placeholder="000000"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ''))}
                  className="text-center text-2xl tracking-widest font-mono"
                />
                <p className="text-xs text-muted-foreground">
                  Digite o código de 6 dígitos exibido no seu aplicativo autenticador
                  (Google Authenticator, Authy, 1Password, etc.)
                </p>
              </div>
            </div>
          )}

          {twoFAStep === 'setup' && (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShow2FAModal(false)}
              disabled={enabling2FA}
            >
              Cancelar
            </Button>
            {twoFAStep === 'verify' && (
              <Button
                onClick={handleVerify2FA}
                disabled={enabling2FA || verificationCode.length !== 6}
              >
                {enabling2FA ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Verificando...
                  </>
                ) : (
                  'Ativar 2FA'
                )}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* WhatsApp Connection Modal */}
      <Dialog open={showWhatsAppModal} onOpenChange={setShowWhatsAppModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Conectar WhatsApp Business</DialogTitle>
            <DialogDescription>
              Configure sua conta do WhatsApp Business API
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="whatsapp-phone">Número de Telefone</Label>
              <Input
                id="whatsapp-phone"
                placeholder="+55 11 99999-9999"
                value={whatsAppData.phoneNumber}
                onChange={(e) => setWhatsAppData(prev => ({ ...prev, phoneNumber: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="whatsapp-token">API Token</Label>
              <Input
                id="whatsapp-token"
                type="password"
                placeholder="EAA..."
                value={whatsAppData.apiToken}
                onChange={(e) => setWhatsAppData(prev => ({ ...prev, apiToken: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="whatsapp-business-id">Business Account ID (Opcional)</Label>
              <Input
                id="whatsapp-business-id"
                placeholder="123456789"
                value={whatsAppData.businessAccountId}
                onChange={(e) => setWhatsAppData(prev => ({ ...prev, businessAccountId: e.target.value }))}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowWhatsAppModal(false)}>
              Cancelar
            </Button>
            <Button onClick={handleConnectWhatsApp} disabled={connectingIntegration === 'whatsapp'}>
              {connectingIntegration === 'whatsapp' ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Conectando...
                </>
              ) : (
                'Conectar'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Stripe Connection Modal */}
      <Dialog open={showStripeModal} onOpenChange={setShowStripeModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Conectar Stripe</DialogTitle>
            <DialogDescription>
              Escolha como deseja conectar sua conta Stripe
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="stripe-key">API Key (Método Direto)</Label>
              <Input
                id="stripe-key"
                type="password"
                placeholder="sk_test_..."
                value={stripeData.apiKey}
                onChange={(e) => setStripeData({ apiKey: e.target.value })}
              />
              <p className="text-xs text-muted-foreground">
                Ou deixe em branco para usar OAuth (recomendado)
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowStripeModal(false)}>
              Cancelar
            </Button>
            <Button onClick={handleConnectStripe} disabled={connectingIntegration === 'stripe'}>
              {connectingIntegration === 'stripe' ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Conectando...
                </>
              ) : (
                'Conectar'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
