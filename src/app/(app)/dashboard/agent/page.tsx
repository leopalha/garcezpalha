'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Sparkles,
  MessageSquare,
  Zap,
  Brain,
  Save,
  RotateCcw,
  Settings,
  TestTube,
  Eye,
  Clock,
  Languages,
  Shield,
  Users,
  FileText,
  Send,
} from 'lucide-react'
import { cn } from '@/lib/utils'

type AgentType = 'generic' | 'specialized'
type Tone = 'professional' | 'friendly' | 'formal' | 'casual'
type ResponseLength = 'concise' | 'balanced' | 'detailed'

interface AgentConfig {
  name: string
  type: AgentType
  specialization: string
  description: string
  tone: Tone
  responseLength: ResponseLength
  language: string
  enabled: boolean
  autoQualify: boolean
  autoProposal: boolean
  businessHoursOnly: boolean
  maxResponseTime: number
  greeting: string
  fallbackMessage: string
  qualificationThreshold: number
}

const defaultConfig: AgentConfig = {
  name: 'Assistente Jurídico',
  type: 'generic',
  specialization: '',
  description: 'Assistente especializado em atendimento jurídico',
  tone: 'professional',
  responseLength: 'balanced',
  language: 'pt-BR',
  enabled: true,
  autoQualify: true,
  autoProposal: false,
  businessHoursOnly: false,
  maxResponseTime: 30,
  greeting:
    'Olá! Sou o assistente jurídico virtual. Como posso ajudá-lo hoje? Por favor, descreva sua situação.',
  fallbackMessage:
    'Desculpe, não consegui entender sua pergunta. Poderia reformular ou fornecer mais detalhes?',
  qualificationThreshold: 70,
}

const specializations = [
  { value: 'imobiliario', label: 'Direito Imobiliário', icon: '🏠' },
  { value: 'bancario', label: 'Direito Bancário', icon: '🏦' },
  { value: 'saude', label: 'Direito da Saúde', icon: '⚕️' },
  { value: 'criminal', label: 'Direito Criminal', icon: '⚖️' },
  { value: 'trabalhista', label: 'Direito Trabalhista', icon: '👔' },
  { value: 'previdenciario', label: 'Direito Previdenciário', icon: '🏛️' },
  { value: 'consumidor', label: 'Direito do Consumidor', icon: '🛒' },
  { value: 'familia', label: 'Direito de Família', icon: '👨‍👩‍👧' },
]

export default function AgentConfigPage() {
  const [config, setConfig] = useState<AgentConfig>(defaultConfig)
  const [testMessage, setTestMessage] = useState('')
  const [testResponse, setTestResponse] = useState('')
  const [isTesting, setIsTesting] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)

  const updateConfig = (key: keyof AgentConfig, value: any) => {
    setConfig((prev) => ({ ...prev, [key]: value }))
    setHasChanges(true)
  }

  const handleSave = () => {
    // Here you would save to your backend
    console.log('Saving config:', config)
    setHasChanges(false)
  }

  const handleReset = () => {
    setConfig(defaultConfig)
    setHasChanges(false)
  }

  const handleTest = async () => {
    if (!testMessage.trim()) return

    setIsTesting(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    setTestResponse(
      `Entendi que você precisa de ajuda com ${testMessage}. Para melhor atendê-lo, preciso de algumas informações:\n\n1. Qual é o seu nome completo?\n2. Qual é o seu email?\n3. Poderia me fornecer mais detalhes sobre sua situação?`
    )
    setIsTesting(false)
  }

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Sparkles className="h-8 w-8 text-primary" />
            Configuração do Agent IA
          </h1>
          <p className="text-muted-foreground mt-1">
            Personalize o comportamento e as respostas do seu assistente virtual
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={handleReset} disabled={!hasChanges}>
            <RotateCcw className="h-4 w-4 mr-2" />
            Restaurar Padrão
          </Button>
          <Button onClick={handleSave} disabled={!hasChanges}>
            <Save className="h-4 w-4 mr-2" />
            Salvar Alterações
          </Button>
        </div>
      </div>

      {hasChanges && (
        <div className="bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 flex items-center gap-3">
          <Settings className="h-5 w-5 text-yellow-600" />
          <div className="flex-1">
            <p className="text-sm font-medium text-yellow-900 dark:text-yellow-100">
              Você tem alterações não salvas
            </p>
            <p className="text-xs text-yellow-700 dark:text-yellow-300">
              Lembre-se de salvar suas configurações antes de sair da página
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Configuration */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5" />
                Informações Básicas
              </CardTitle>
              <CardDescription>Configure a identidade e o comportamento do seu agent</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome do Agent</Label>
                  <Input
                    id="name"
                    value={config.name}
                    onChange={(e) => updateConfig('name', e.target.value)}
                    placeholder="Ex: Assistente Jurídico"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="type">Tipo</Label>
                  <Select
                    value={config.type}
                    onValueChange={(v) => updateConfig('type', v as AgentType)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="generic">Genérico (todas as áreas)</SelectItem>
                      <SelectItem value="specialized">Especializado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {config.type === 'specialized' && (
                <div className="space-y-2">
                  <Label htmlFor="specialization">Especialização</Label>
                  <Select
                    value={config.specialization}
                    onValueChange={(v) => updateConfig('specialization', v)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma área do direito" />
                    </SelectTrigger>
                    <SelectContent>
                      {specializations.map((spec) => (
                        <SelectItem key={spec.value} value={spec.value}>
                          <span className="flex items-center gap-2">
                            <span>{spec.icon}</span>
                            <span>{spec.label}</span>
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  value={config.description}
                  onChange={(e) => updateConfig('description', e.target.value)}
                  placeholder="Descreva o propósito do seu agent..."
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Behavior */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Comportamento de Conversa
              </CardTitle>
              <CardDescription>Defina como o agent se comunica com os clientes</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="tone">Tom de Voz</Label>
                  <Select value={config.tone} onValueChange={(v) => updateConfig('tone', v as Tone)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="professional">Profissional</SelectItem>
                      <SelectItem value="friendly">Amigável</SelectItem>
                      <SelectItem value="formal">Formal</SelectItem>
                      <SelectItem value="casual">Casual</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="responseLength">Tamanho das Respostas</Label>
                  <Select
                    value={config.responseLength}
                    onValueChange={(v) => updateConfig('responseLength', v as ResponseLength)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="concise">Concisas</SelectItem>
                      <SelectItem value="balanced">Balanceadas</SelectItem>
                      <SelectItem value="detailed">Detalhadas</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="greeting">Mensagem de Saudação</Label>
                <Textarea
                  id="greeting"
                  value={config.greeting}
                  onChange={(e) => updateConfig('greeting', e.target.value)}
                  placeholder="A primeira mensagem que o cliente verá..."
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="fallback">Mensagem de Fallback</Label>
                <Textarea
                  id="fallback"
                  value={config.fallbackMessage}
                  onChange={(e) => updateConfig('fallbackMessage', e.target.value)}
                  placeholder="Quando o agent não entender a pergunta..."
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Automation */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Automações
              </CardTitle>
              <CardDescription>Configure o que o agent pode fazer automaticamente</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <Label htmlFor="auto-qualify" className="text-base cursor-pointer">
                      Qualificação Automática
                    </Label>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    O agent qualifica leads automaticamente com base nas respostas
                  </p>
                </div>
                <Switch
                  id="auto-qualify"
                  checked={config.autoQualify}
                  onCheckedChange={(v) => updateConfig('autoQualify', v)}
                />
              </div>

              {config.autoQualify && (
                <div className="ml-4 pl-4 border-l-2 space-y-2">
                  <Label htmlFor="threshold">Score Mínimo para Qualificação: {config.qualificationThreshold}%</Label>
                  <input
                    type="range"
                    id="threshold"
                    min="0"
                    max="100"
                    value={config.qualificationThreshold}
                    onChange={(e) => updateConfig('qualificationThreshold', parseInt(e.target.value))}
                    className="w-full"
                  />
                  <p className="text-xs text-muted-foreground">
                    Leads com score acima de {config.qualificationThreshold}% serão marcados como qualificados
                  </p>
                </div>
              )}

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <Label htmlFor="auto-proposal" className="text-base cursor-pointer">
                      Proposta Automática
                    </Label>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Enviar proposta automaticamente após qualificação completa
                  </p>
                </div>
                <Switch
                  id="auto-proposal"
                  checked={config.autoProposal}
                  onCheckedChange={(v) => updateConfig('autoProposal', v)}
                />
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <Label htmlFor="business-hours" className="text-base cursor-pointer">
                      Apenas Horário Comercial
                    </Label>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Ativo apenas em horário comercial (9h - 18h, Seg-Sex)
                  </p>
                </div>
                <Switch
                  id="business-hours"
                  checked={config.businessHoursOnly}
                  onCheckedChange={(v) => updateConfig('businessHoursOnly', v)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Advanced */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Configurações Avançadas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="language">Idioma</Label>
                  <Select
                    value={config.language}
                    onValueChange={(v) => updateConfig('language', v)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pt-BR">Português (BR)</SelectItem>
                      <SelectItem value="en-US">English (US)</SelectItem>
                      <SelectItem value="es-ES">Español</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="max-response">Tempo Máximo de Resposta (segundos)</Label>
                  <Input
                    id="max-response"
                    type="number"
                    min="5"
                    max="120"
                    value={config.maxResponseTime}
                    onChange={(e) => updateConfig('maxResponseTime', parseInt(e.target.value))}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Status & Testing */}
        <div className="space-y-6">
          {/* Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-0.5">
                  <Label htmlFor="enabled" className="text-base cursor-pointer">
                    Agent Ativo
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    {config.enabled ? 'Atendendo clientes' : 'Pausado'}
                  </p>
                </div>
                <Switch
                  id="enabled"
                  checked={config.enabled}
                  onCheckedChange={(v) => updateConfig('enabled', v)}
                />
              </div>

              {config.enabled && (
                <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                    <p className="text-sm font-medium text-green-900 dark:text-green-100">
                      Agent Online
                    </p>
                  </div>
                  <p className="text-xs text-green-700 dark:text-green-300">
                    Seu agent está atendendo clientes 24/7
                  </p>
                </div>
              )}

              {!config.enabled && (
                <div className="bg-gray-50 dark:bg-gray-950/20 border border-gray-200 dark:border-gray-800 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="h-2 w-2 rounded-full bg-gray-500" />
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      Agent Pausado
                    </p>
                  </div>
                  <p className="text-xs text-gray-700 dark:text-gray-300">
                    Ative o agent para começar a atender
                  </p>
                </div>
              )}

              <div className="space-y-2 pt-4 border-t">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Conversas hoje</span>
                  <span className="font-semibold">24</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Tempo médio de resposta</span>
                  <span className="font-semibold">2.3s</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Taxa de satisfação</span>
                  <span className="font-semibold text-green-600">94.5%</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Test */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TestTube className="h-5 w-5" />
                Testar Agent
              </CardTitle>
              <CardDescription>Veja como o agent responde</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="test-message">Mensagem de Teste</Label>
                <Textarea
                  id="test-message"
                  value={testMessage}
                  onChange={(e) => setTestMessage(e.target.value)}
                  placeholder="Digite uma mensagem para testar..."
                  rows={4}
                />
              </div>

              <Button onClick={handleTest} disabled={isTesting || !testMessage.trim()} className="w-full">
                {isTesting ? (
                  <>
                    <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Processando...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Enviar Teste
                  </>
                )}
              </Button>

              {testResponse && (
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Eye className="h-4 w-4" />
                    Resposta do Agent
                  </Label>
                  <div className="bg-muted rounded-lg p-4">
                    <p className="text-sm whitespace-pre-wrap">{testResponse}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Tips */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">💡 Dicas Rápidas</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span>Use um tom profissional mas amigável para melhor engajamento</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span>Configure a qualificação automática para economizar tempo</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span>Teste regularmente para garantir respostas adequadas</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span>Agents especializados convertem melhor que genéricos</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
