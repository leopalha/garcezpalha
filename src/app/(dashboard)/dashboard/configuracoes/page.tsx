'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import {
  User,
  Bell,
  Lock,
  Mail,
  Phone,
  MapPin,
  Save,
  Loader2,
} from 'lucide-react'
import { useToast } from '@/components/ui/use-toast'
import { createBrowserClient } from '@supabase/ssr'

export default function ConfiguracoesPage() {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: '',
    document: '',
    address: '',
    neighborhood: '',
    city: '',
    state: '',
    zipCode: '',
  })

  const [notifications, setNotifications] = useState({
    emailProcessUpdates: true,
    emailDeadlines: true,
    emailPayments: true,
    smsDeadlines: false,
    whatsappUpdates: true,
  })

  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: '',
  })

  // Fetch user data on mount
  useEffect(() => {
    async function fetchUserData() {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
          // Get profile from users table
          const { data: userData } = await supabase
            .from('users')
            .select('*')
            .eq('id', user.id)
            .single()

          if (userData) {
            setProfile({
              name: userData.name || user.user_metadata?.name || '',
              email: user.email || '',
              phone: userData.phone || '',
              document: userData.cpf || '',
              address: userData.address || '',
              neighborhood: userData.neighborhood || '',
              city: userData.city || '',
              state: userData.state || '',
              zipCode: userData.zip_code || '',
            })

            // Get notification preferences if stored
            if (userData.notification_preferences) {
              setNotifications(prev => ({
                ...prev,
                ...userData.notification_preferences,
              }))
            }
          }
        }
      } catch (error) {
        console.error('Error fetching user data:', error)
      } finally {
        setInitialLoading(false)
      }
    }
    fetchUserData()
  }, [supabase])

  const handleSaveProfile = async () => {
    setLoading(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Usuário não autenticado')

      const { error } = await supabase
        .from('users')
        .update({
          name: profile.name,
          phone: profile.phone,
          cpf: profile.document,
          address: profile.address,
          neighborhood: profile.neighborhood,
          city: profile.city,
          state: profile.state,
          zip_code: profile.zipCode,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id)

      if (error) throw error

      toast({
        title: 'Perfil atualizado',
        description: 'Suas informações foram salvas com sucesso.',
      })
    } catch (error: any) {
      toast({
        title: 'Erro ao salvar',
        description: error.message || 'Não foi possível salvar suas informações.',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSaveNotifications = async () => {
    setLoading(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Usuário não autenticado')

      const { error } = await supabase
        .from('users')
        .update({
          notification_preferences: notifications,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id)

      if (error) throw error

      toast({
        title: 'Preferências salvas',
        description: 'Suas preferências de notificação foram atualizadas.',
      })
    } catch (error: any) {
      toast({
        title: 'Erro ao salvar',
        description: error.message || 'Não foi possível salvar suas preferências.',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleChangePassword = async () => {
    if (passwords.new !== passwords.confirm) {
      toast({
        title: 'Senhas não coincidem',
        description: 'A nova senha e a confirmação devem ser iguais.',
        variant: 'destructive',
      })
      return
    }

    if (passwords.new.length < 8) {
      toast({
        title: 'Senha muito curta',
        description: 'A nova senha deve ter pelo menos 8 caracteres.',
        variant: 'destructive',
      })
      return
    }

    setLoading(true)
    try {
      const { error } = await supabase.auth.updateUser({
        password: passwords.new,
      })

      if (error) throw error

      setPasswords({ current: '', new: '', confirm: '' })
      toast({
        title: 'Senha alterada',
        description: 'Sua senha foi atualizada com sucesso.',
      })
    } catch (error: any) {
      toast({
        title: 'Erro ao alterar senha',
        description: error.message || 'Não foi possível alterar sua senha.',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  if (initialLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-gray-900">
          Configurações
        </h2>
        <p className="text-gray-600 mt-1">
          Gerencie suas informações pessoais e preferências
        </p>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="profile" className="space-y-4">
        <TabsList>
          <TabsTrigger value="profile">
            <User className="h-4 w-4 mr-2" />
            Perfil
          </TabsTrigger>
          <TabsTrigger value="notifications">
            <Bell className="h-4 w-4 mr-2" />
            Notificações
          </TabsTrigger>
          <TabsTrigger value="security">
            <Lock className="h-4 w-4 mr-2" />
            Segurança
          </TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Informações Pessoais</CardTitle>
              <CardDescription>
                Mantenha suas informações atualizadas para facilitar a comunicação
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome Completo</Label>
                  <Input
                    id="name"
                    value={profile.name}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="document">CPF/CNPJ</Label>
                  <Input
                    id="document"
                    value={profile.document}
                    onChange={(e) => setProfile({ ...profile, document: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">E-mail</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      value={profile.email}
                      onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Telefone</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="phone"
                      value={profile.phone}
                      onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t">
                <h4 className="font-medium text-gray-900 mb-4 flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Endereço
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="address">Logradouro</Label>
                    <Input
                      id="address"
                      value={profile.address}
                      onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="neighborhood">Bairro</Label>
                    <Input
                      id="neighborhood"
                      value={profile.neighborhood}
                      onChange={(e) => setProfile({ ...profile, neighborhood: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="zipCode">CEP</Label>
                    <Input
                      id="zipCode"
                      value={profile.zipCode}
                      onChange={(e) => setProfile({ ...profile, zipCode: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="city">Cidade</Label>
                    <Input
                      id="city"
                      value={profile.city}
                      onChange={(e) => setProfile({ ...profile, city: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="state">Estado</Label>
                    <Input
                      id="state"
                      value={profile.state}
                      onChange={(e) => setProfile({ ...profile, state: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <Button onClick={handleSaveProfile} disabled={loading}>
                  <Save className="h-4 w-4 mr-2" />
                  {loading ? 'Salvando...' : 'Salvar Alterações'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Preferências de Notificação</CardTitle>
              <CardDescription>
                Escolha como e quando deseja receber notificações
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">Atualizações de Processos</p>
                    <p className="text-sm text-gray-600">
                      Receba e-mails sobre movimentações nos seus processos
                    </p>
                  </div>
                  <Switch
                    checked={notifications.emailProcessUpdates}
                    onCheckedChange={(checked) =>
                      setNotifications({ ...notifications, emailProcessUpdates: checked })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">Prazos e Audiências</p>
                    <p className="text-sm text-gray-600">
                      Receba lembretes por e-mail sobre prazos próximos
                    </p>
                  </div>
                  <Switch
                    checked={notifications.emailDeadlines}
                    onCheckedChange={(checked) =>
                      setNotifications({ ...notifications, emailDeadlines: checked })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">Cobranças e Pagamentos</p>
                    <p className="text-sm text-gray-600">
                      Notificações sobre vencimentos e confirmações de pagamento
                    </p>
                  </div>
                  <Switch
                    checked={notifications.emailPayments}
                    onCheckedChange={(checked) =>
                      setNotifications({ ...notifications, emailPayments: checked })
                    }
                  />
                </div>

                <div className="pt-4 border-t">
                  <h4 className="font-medium text-gray-900 mb-4">Outros Canais</h4>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">SMS - Prazos Urgentes</p>
                        <p className="text-sm text-gray-600">
                          Receba SMS sobre prazos com menos de 48h
                        </p>
                      </div>
                      <Switch
                        checked={notifications.smsDeadlines}
                        onCheckedChange={(checked) =>
                          setNotifications({ ...notifications, smsDeadlines: checked })
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">WhatsApp - Atualizações</p>
                        <p className="text-sm text-gray-600">
                          Receba resumos semanais via WhatsApp
                        </p>
                      </div>
                      <Switch
                        checked={notifications.whatsappUpdates}
                        onCheckedChange={(checked) =>
                          setNotifications({ ...notifications, whatsappUpdates: checked })
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <Button onClick={handleSaveNotifications} disabled={loading}>
                  <Save className="h-4 w-4 mr-2" />
                  {loading ? 'Salvando...' : 'Salvar Preferências'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Alterar Senha</CardTitle>
              <CardDescription>
                Mantenha sua conta segura com uma senha forte
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="current-password">Senha Atual</Label>
                  <Input
                    id="current-password"
                    type="password"
                    placeholder="Digite sua senha atual"
                    value={passwords.current}
                    onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="new-password">Nova Senha</Label>
                  <Input
                    id="new-password"
                    type="password"
                    placeholder="Digite sua nova senha"
                    value={passwords.new}
                    onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
                  />
                  <p className="text-xs text-gray-500">
                    Mínimo de 8 caracteres, incluindo letras e números
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirmar Nova Senha</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    placeholder="Confirme sua nova senha"
                    value={passwords.confirm}
                    onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                  />
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <Button onClick={handleChangePassword} disabled={loading}>
                  <Lock className="h-4 w-4 mr-2" />
                  {loading ? 'Alterando...' : 'Alterar Senha'}
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Sessões Ativas</CardTitle>
              <CardDescription>
                Gerencie os dispositivos conectados à sua conta
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">Windows • Chrome</p>
                    <p className="text-sm text-gray-600">Maceió, AL • Agora</p>
                  </div>
                  <Badge variant="default">Atual</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
