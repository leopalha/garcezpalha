'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Settings,
  User,
  Bell,
  Lock,
  Mail,
  Phone,
  Globe,
  CreditCard,
  Shield,
  Palette,
  Zap,
  Save,
  CheckCircle2,
} from 'lucide-react'
import { useSession } from 'next-auth/react'

type SettingsTab = 'profile' | 'notifications' | 'security' | 'integrations' | 'billing' | 'appearance'

const tabs: { id: SettingsTab; label: string; icon: any }[] = [
  { id: 'profile', label: 'Perfil', icon: User },
  { id: 'notifications', label: 'Notificações', icon: Bell },
  { id: 'security', label: 'Segurança', icon: Lock },
  { id: 'integrations', label: 'Integrações', icon: Zap },
  { id: 'billing', label: 'Faturamento', icon: CreditCard },
  { id: 'appearance', label: 'Aparência', icon: Palette },
]

export default function ConfiguracoesPage() {
  const { data: session } = useSession()
  const [activeTab, setActiveTab] = useState<SettingsTab>('profile')
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    // In production, this would save via API
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Configurações</h2>
          <p className="text-muted-foreground">
            Gerencie as configurações da sua conta e preferências
          </p>
        </div>
        {saved && (
          <div className="flex items-center gap-2 text-green-600">
            <CheckCircle2 className="h-5 w-5" />
            <span className="text-sm font-medium">Salvo com sucesso!</span>
          </div>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-4">
        {/* Sidebar Navigation */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-base">Menu</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <nav className="space-y-1 p-2">
              {tabs.map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      activeTab === tab.id
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {tab.label}
                  </button>
                )
              })}
            </nav>
          </CardContent>
        </Card>

        {/* Settings Content */}
        <div className="lg:col-span-3 space-y-6">
          {/* Profile Settings */}
          {activeTab === 'profile' && (
            <Card>
              <CardHeader>
                <CardTitle>Informações do Perfil</CardTitle>
                <CardDescription>
                  Atualize suas informações pessoais e de contato
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nome Completo</Label>
                    <Input
                      id="name"
                      placeholder="Seu nome completo"
                      defaultValue={session?.user?.name || ''}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="seu@email.com"
                      defaultValue={session?.user?.email || ''}
                    />
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Telefone</Label>
                    <Input id="phone" placeholder="(21) 99999-9999" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="role">Cargo</Label>
                    <Input
                      id="role"
                      placeholder="Seu cargo"
                      defaultValue={session?.user?.role === 'admin' ? 'Administrador' : 'Advogado'}
                      disabled
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Biografia</Label>
                  <Textarea
                    id="bio"
                    placeholder="Conte um pouco sobre você..."
                    rows={4}
                  />
                </div>

                <Button onClick={handleSave}>
                  <Save className="h-4 w-4 mr-2" />
                  Salvar Alterações
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Notification Settings */}
          {activeTab === 'notifications' && (
            <Card>
              <CardHeader>
                <CardTitle>Preferências de Notificação</CardTitle>
                <CardDescription>
                  Configure como deseja receber notificações
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Novos Leads</Label>
                      <p className="text-sm text-muted-foreground">
                        Receber notificação quando um novo lead chegar
                      </p>
                    </div>
                    <input type="checkbox" defaultChecked className="h-4 w-4" />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Mensagens de Clientes</Label>
                      <p className="text-sm text-muted-foreground">
                        Notificar sobre novas mensagens de clientes
                      </p>
                    </div>
                    <input type="checkbox" defaultChecked className="h-4 w-4" />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Faturas Vencidas</Label>
                      <p className="text-sm text-muted-foreground">
                        Alertas sobre faturas que estão vencendo
                      </p>
                    </div>
                    <input type="checkbox" defaultChecked className="h-4 w-4" />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Agendamentos</Label>
                      <p className="text-sm text-muted-foreground">
                        Lembrete de compromissos agendados
                      </p>
                    </div>
                    <input type="checkbox" defaultChecked className="h-4 w-4" />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Newsletter</Label>
                      <p className="text-sm text-muted-foreground">
                        Receber atualizações e novidades
                      </p>
                    </div>
                    <input type="checkbox" className="h-4 w-4" />
                  </div>
                </div>

                <div className="border-t pt-4">
                  <Label className="mb-3 block">Canais de Notificação</Label>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <input type="checkbox" defaultChecked className="h-4 w-4" />
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Email</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <input type="checkbox" defaultChecked className="h-4 w-4" />
                      <Bell className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Notificações Push</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <input type="checkbox" className="h-4 w-4" />
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">SMS</span>
                    </div>
                  </div>
                </div>

                <Button onClick={handleSave}>
                  <Save className="h-4 w-4 mr-2" />
                  Salvar Preferências
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Security Settings */}
          {activeTab === 'security' && (
            <Card>
              <CardHeader>
                <CardTitle>Segurança da Conta</CardTitle>
                <CardDescription>
                  Gerencie a segurança e autenticação da sua conta
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <Label className="mb-3 block">Alterar Senha</Label>
                    <div className="space-y-3">
                      <Input type="password" placeholder="Senha atual" />
                      <Input type="password" placeholder="Nova senha" />
                      <Input type="password" placeholder="Confirmar nova senha" />
                      <Button>Atualizar Senha</Button>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <Label className="mb-3 block">Autenticação de Dois Fatores</Label>
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="space-y-0.5">
                        <p className="font-medium">2FA via SMS</p>
                        <p className="text-sm text-muted-foreground">
                          Adicione uma camada extra de segurança
                        </p>
                      </div>
                      <Button variant="outline">Ativar</Button>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <Label className="mb-3 block">Sessões Ativas</Label>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="text-sm font-medium">Chrome - Windows</p>
                          <p className="text-xs text-muted-foreground">Rio de Janeiro, Brasil - Agora</p>
                        </div>
                        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                          Atual
                        </span>
                      </div>
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="text-sm font-medium">Safari - iPhone</p>
                          <p className="text-xs text-muted-foreground">Rio de Janeiro, Brasil - 2h atrás</p>
                        </div>
                        <Button variant="ghost" size="sm">Encerrar</Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Integrations Settings */}
          {activeTab === 'integrations' && (
            <Card>
              <CardHeader>
                <CardTitle>Integrações</CardTitle>
                <CardDescription>
                  Conecte serviços externos e APIs
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 bg-green-100 rounded-lg flex items-center justify-center">
                        <Phone className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium">WhatsApp Business</p>
                        <p className="text-sm text-muted-foreground">Conectado</p>
                      </div>
                    </div>
                    <Button variant="outline">Configurar</Button>
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Mail className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium">Email (Resend)</p>
                        <p className="text-sm text-muted-foreground">Conectado</p>
                      </div>
                    </div>
                    <Button variant="outline">Configurar</Button>
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 bg-purple-100 rounded-lg flex items-center justify-center">
                        <CreditCard className="h-5 w-5 text-purple-600" />
                      </div>
                      <div>
                        <p className="font-medium">MercadoPago</p>
                        <p className="text-sm text-muted-foreground">Conectado</p>
                      </div>
                    </div>
                    <Button variant="outline">Configurar</Button>
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                        <Globe className="h-5 w-5 text-indigo-600" />
                      </div>
                      <div>
                        <p className="font-medium">Google Calendar</p>
                        <p className="text-sm text-muted-foreground">Não conectado</p>
                      </div>
                    </div>
                    <Button>Conectar</Button>
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 bg-slate-100 rounded-lg flex items-center justify-center">
                        <Zap className="h-5 w-5 text-slate-600" />
                      </div>
                      <div>
                        <p className="font-medium">Zapier</p>
                        <p className="text-sm text-muted-foreground">Não conectado</p>
                      </div>
                    </div>
                    <Button>Conectar</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Billing Settings */}
          {activeTab === 'billing' && (
            <Card>
              <CardHeader>
                <CardTitle>Faturamento e Pagamento</CardTitle>
                <CardDescription>
                  Gerencie suas informações de pagamento e faturas
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="p-4 bg-primary/5 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium">Plano Atual</p>
                    <span className="text-xs bg-primary text-primary-foreground px-2 py-1 rounded">
                      Premium
                    </span>
                  </div>
                  <p className="text-2xl font-bold">R$ 297/mês</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Próxima cobrança em 15 de Março de 2024
                  </p>
                </div>

                <div>
                  <Label className="mb-3 block">Método de Pagamento</Label>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <CreditCard className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="font-medium">•••• •••• •••• 4242</p>
                          <p className="text-sm text-muted-foreground">Expira em 12/2025</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">Editar</Button>
                    </div>
                  </div>
                  <Button variant="outline" className="mt-3">
                    Adicionar Novo Cartão
                  </Button>
                </div>

                <div className="border-t pt-4">
                  <Label className="mb-3 block">Histórico de Faturas</Label>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="text-sm font-medium">Fevereiro 2024</p>
                        <p className="text-xs text-muted-foreground">Pago em 15/02/2024</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-medium">R$ 297,00</span>
                        <Button variant="ghost" size="sm">PDF</Button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="text-sm font-medium">Janeiro 2024</p>
                        <p className="text-xs text-muted-foreground">Pago em 15/01/2024</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-medium">R$ 297,00</span>
                        <Button variant="ghost" size="sm">PDF</Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Appearance Settings */}
          {activeTab === 'appearance' && (
            <Card>
              <CardHeader>
                <CardTitle>Aparência</CardTitle>
                <CardDescription>
                  Personalize a aparência da plataforma
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label className="mb-3 block">Tema</Label>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="border-2 border-primary rounded-lg p-4 cursor-pointer">
                      <div className="h-20 bg-gradient-to-br from-slate-900 to-slate-700 rounded mb-2"></div>
                      <p className="text-sm font-medium text-center">Escuro</p>
                    </div>
                    <div className="border rounded-lg p-4 cursor-pointer hover:border-primary">
                      <div className="h-20 bg-gradient-to-br from-white to-slate-100 rounded mb-2 border"></div>
                      <p className="text-sm font-medium text-center">Claro</p>
                    </div>
                    <div className="border rounded-lg p-4 cursor-pointer hover:border-primary">
                      <div className="h-20 bg-gradient-to-br from-slate-900 via-slate-500 to-white rounded mb-2"></div>
                      <p className="text-sm font-medium text-center">Auto</p>
                    </div>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <Label className="mb-3 block">Cor de Destaque</Label>
                  <div className="grid grid-cols-6 gap-3">
                    <div className="h-10 bg-blue-600 rounded-lg cursor-pointer border-2 border-primary"></div>
                    <div className="h-10 bg-purple-600 rounded-lg cursor-pointer hover:border-2"></div>
                    <div className="h-10 bg-green-600 rounded-lg cursor-pointer hover:border-2"></div>
                    <div className="h-10 bg-orange-600 rounded-lg cursor-pointer hover:border-2"></div>
                    <div className="h-10 bg-red-600 rounded-lg cursor-pointer hover:border-2"></div>
                    <div className="h-10 bg-pink-600 rounded-lg cursor-pointer hover:border-2"></div>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Modo Compacto</Label>
                        <p className="text-sm text-muted-foreground">
                          Reduzir espaçamento entre elementos
                        </p>
                      </div>
                      <input type="checkbox" className="h-4 w-4" />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Animações</Label>
                        <p className="text-sm text-muted-foreground">
                          Ativar transições e animações
                        </p>
                      </div>
                      <input type="checkbox" defaultChecked className="h-4 w-4" />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Sidebar Recolhida</Label>
                        <p className="text-sm text-muted-foreground">
                          Iniciar com sidebar minimizada
                        </p>
                      </div>
                      <input type="checkbox" className="h-4 w-4" />
                    </div>
                  </div>
                </div>

                <Button onClick={handleSave}>
                  <Save className="h-4 w-4 mr-2" />
                  Salvar Preferências
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
