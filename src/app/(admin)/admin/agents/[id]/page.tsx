'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { AdminPageHeader } from '@/components/admin/AdminPageHeader'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Slider } from '@/components/ui/slider'
import { useToast } from '@/components/ui/use-toast'
import { Loader2, Save, Play } from 'lucide-react'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'

interface AgentConfig {
  id: string
  role: string
  category: string
  name: string
  description: string
  systemPrompt: string
  userPrompt: string
  model: string
  temperature: number
  maxTokens: number
  topP: number
  frequencyPenalty: number
  presencePenalty: number
  enabled: boolean
  requiresApproval: boolean
  tools: string[]
}

const AGENT_CONFIGS: Record<string, Partial<AgentConfig>> = {
  'real-estate': {
    id: 'real-estate',
    role: 'real-estate',
    category: 'legal',
    name: 'Especialista em Imóveis',
    description: 'Contratos, usucapião, registro de imóveis',
    systemPrompt: `Você é um especialista em Direito Imobiliário com profundo conhecimento em:
- Contratos de compra e venda
- Usucapião (urbana e rural)
- Registro de imóveis
- Alienação fiduciária
- Locação comercial e residencial
- Regularização fundiária

IMPORTANTE:
- Sempre cite a legislação aplicável (Código Civil, Lei de Registros Públicos)
- Verifique prazos prescricionais
- Alerte sobre necessidade de certidões
- Inclua disclaimer OAB em todas as respostas`,
    userPrompt: 'Analise o seguinte caso imobiliário e forneça orientação jurídica detalhada:',
    model: 'gpt-4-turbo',
    temperature: 0.3,
    maxTokens: 4000,
    topP: 1,
    frequencyPenalty: 0,
    presencePenalty: 0,
    enabled: true,
    requiresApproval: false,
    tools: ['registry-checker', 'legal-calculator', 'oab-compliance'],
  },
  'criminal': {
    id: 'criminal',
    role: 'criminal',
    category: 'legal',
    name: 'Direito Criminal',
    description: 'Análise penal, defesa criminal',
    systemPrompt: `Você é um especialista em Direito Penal com expertise em:
- Crimes contra o patrimônio (furto, roubo, estelionato)
- Crimes contra a pessoa (homicídio, lesão corporal)
- Crimes contra a dignidade sexual
- Tráfico de drogas
- Crimes econômicos

METODOLOGIA:
1. Identificar o tipo penal
2. Verificar elementos do crime (dolo, culpa, consumação)
3. Analisar circunstâncias agravantes/atenuantes
4. Calcular pena base e regime inicial
5. Avaliar possibilidade de defesa

SEMPRE:
- Cite artigos do Código Penal
- Mencione jurisprudência quando relevante
- Alerte sobre prazos recursais
- Presunção de inocência em todas as respostas`,
    userPrompt: 'Analise o seguinte caso criminal:',
    model: 'gpt-4-turbo',
    temperature: 0.3,
    maxTokens: 4000,
    topP: 1,
    frequencyPenalty: 0,
    presencePenalty: 0,
    enabled: true,
    requiresApproval: true,
    tools: ['legal-calculator', 'jurisprudence-search', 'oab-compliance'],
  },
  'ceo': {
    id: 'ceo',
    role: 'ceo',
    category: 'executive',
    name: 'CEO Agent',
    description: 'Estratégia e decisões executivas',
    systemPrompt: `Você é o CEO virtual da Garcez Palha, responsável por:
- Visão estratégica de longo prazo
- Decisões de alto impacto
- Alocação de recursos
- Priorização de iniciativas
- Análise de risco/retorno

FRAMEWORK DE DECISÃO:
1. Avaliar alinhamento com missão (democratizar acesso à justiça)
2. Analisar impacto financeiro (ROI, payback)
3. Considerar risco operacional
4. Verificar capacidade de execução
5. Priorizar por matriz impacto vs esforço

DADOS DISPONÍVEIS:
- Métricas de crescimento (leads, conversão, MRR)
- Performance de marketing (CAC, LTV, ROAS)
- Operações (SLA, NPS, churn)
- Finanças (receita, custos, margem)`,
    userPrompt: 'Como CEO da Garcez Palha, analise a seguinte situação e recomende ação:',
    model: 'gpt-4-turbo',
    temperature: 0.5,
    maxTokens: 4000,
    topP: 1,
    frequencyPenalty: 0,
    presencePenalty: 0,
    enabled: true,
    requiresApproval: true,
    tools: ['metrics-analyzer', 'forecast-model'],
  },
  'content': {
    id: 'content',
    role: 'content',
    category: 'marketing',
    name: 'Content Agent',
    description: 'Criação de conteúdo educativo',
    systemPrompt: `Você é especialista em criação de conteúdo jurídico educativo para:
- Blog posts (1000-2000 palavras)
- Artigos técnicos
- Guias práticos
- Ebooks
- Newsletters

ESTILO:
- Tom acessível mas profissional
- Evitar juridiquês excessivo
- Usar exemplos práticos
- Incluir CTAs estratégicos
- Otimizado para SEO

ESTRUTURA PADRÃO:
1. Título chamativo (H1)
2. Introdução com gancho
3. Desenvolvimento com subtítulos (H2, H3)
4. Exemplos e casos práticos
5. FAQ
6. CTA final

COMPLIANCE:
- Sempre incluir disclaimer OAB
- Não fazer promessas de resultado
- Citar fontes legais quando aplicável`,
    userPrompt: 'Crie conteúdo sobre o seguinte tema:',
    model: 'gpt-4-turbo',
    temperature: 0.8,
    maxTokens: 4000,
    topP: 1,
    frequencyPenalty: 0.3,
    presencePenalty: 0.3,
    enabled: true,
    requiresApproval: false,
    tools: ['seo-optimizer', 'readability-checker', 'oab-compliance'],
  },
}

export default function AgentConfigPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const [config, setConfig] = useState<AgentConfig | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const agentId = params.id as string

  useEffect(() => {
    loadConfig()
  }, [agentId])

  const loadConfig = async () => {
    setLoading(true)
    try {
      // Get default config or fetch from API
      const defaultConfig = AGENT_CONFIGS[agentId]
      if (!defaultConfig) {
        toast({
          title: 'Agente não encontrado',
          variant: 'destructive',
        })
        router.push('/admin/agents')
        return
      }

      // In production, fetch from API
      // const response = await fetch(`/api/admin/agents/${agentId}`)
      // if (response.ok) {
      //   const data = await response.json()
      //   setConfig(data)
      // }

      setConfig(defaultConfig as AgentConfig)
    } catch (error) {
      console.error('Error loading agent config:', error)
      toast({
        title: 'Erro ao carregar configuração',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    if (!config) return

    setSaving(true)
    try {
      const response = await fetch(`/api/admin/agents/${agentId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config),
      })

      if (response.ok) {
        toast({
          title: 'Configuração salva',
          description: 'O agente foi atualizado com sucesso.',
        })
      } else {
        throw new Error('Failed to save config')
      }
    } catch (error) {
      console.error('Error saving config:', error)
      toast({
        title: 'Erro ao salvar',
        description: 'Não foi possível salvar a configuração.',
        variant: 'destructive',
      })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!config) {
    return null
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title={`Configurar: ${config.name}`}
        description={`Categoria: ${config.category} • Role: ${config.role}`}
        breadcrumbs={[
          { label: 'Agentes', href: '/admin/agents' },
          { label: config.name, href: `/admin/agents/${agentId}` },
        ]}
        action={
          <Button asChild variant="outline">
            <Link href={`/admin/agents/${agentId}/playground`}>
              <Play className="h-4 w-4 mr-2" />
              Testar Agente
            </Link>
          </Button>
        }
      />

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Config */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info */}
          <Card>
            <CardHeader>
              <CardTitle>Informações Básicas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome do Agente</Label>
                  <Input
                    id="name"
                    value={config.name}
                    onChange={(e) => setConfig({ ...config, name: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <Input id="role" value={config.role} disabled className="bg-muted" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  value={config.description}
                  onChange={(e) => setConfig({ ...config, description: e.target.value })}
                  rows={2}
                />
              </div>
            </CardContent>
          </Card>

          {/* Prompts */}
          <Card>
            <CardHeader>
              <CardTitle>Prompts do Sistema</CardTitle>
              <CardDescription>
                Configure as instruções que guiam o comportamento do agente
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="system-prompt">System Prompt</Label>
                <Textarea
                  id="system-prompt"
                  value={config.systemPrompt}
                  onChange={(e) => setConfig({ ...config, systemPrompt: e.target.value })}
                  rows={12}
                  className="font-mono text-sm"
                />
                <p className="text-xs text-muted-foreground">
                  Instrução permanente que define a personalidade e comportamento do agente
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="user-prompt">User Prompt Template</Label>
                <Textarea
                  id="user-prompt"
                  value={config.userPrompt}
                  onChange={(e) => setConfig({ ...config, userPrompt: e.target.value })}
                  rows={3}
                  className="font-mono text-sm"
                />
                <p className="text-xs text-muted-foreground">
                  Template usado para formatar a entrada do usuário
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Model Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Configurações do Modelo</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="model">Modelo</Label>
                  <Input
                    id="model"
                    value={config.model}
                    onChange={(e) => setConfig({ ...config, model: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="max-tokens">Max Tokens</Label>
                  <Input
                    id="max-tokens"
                    type="number"
                    value={config.maxTokens}
                    onChange={(e) =>
                      setConfig({ ...config, maxTokens: parseInt(e.target.value) })
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Temperature: {config.temperature}</Label>
                <Slider
                  value={[config.temperature]}
                  onValueChange={([value]) => setConfig({ ...config, temperature: value })}
                  min={0}
                  max={2}
                  step={0.1}
                  className="w-full"
                />
                <p className="text-xs text-muted-foreground">
                  0 = Determinístico, 2 = Muito criativo
                </p>
              </div>

              <div className="space-y-2">
                <Label>Top P: {config.topP}</Label>
                <Slider
                  value={[config.topP]}
                  onValueChange={([value]) => setConfig({ ...config, topP: value })}
                  min={0}
                  max={1}
                  step={0.1}
                  className="w-full"
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Frequency Penalty: {config.frequencyPenalty}</Label>
                  <Slider
                    value={[config.frequencyPenalty]}
                    onValueChange={([value]) =>
                      setConfig({ ...config, frequencyPenalty: value })
                    }
                    min={0}
                    max={2}
                    step={0.1}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Presence Penalty: {config.presencePenalty}</Label>
                  <Slider
                    value={[config.presencePenalty]}
                    onValueChange={([value]) =>
                      setConfig({ ...config, presencePenalty: value })
                    }
                    min={0}
                    max={2}
                    step={0.1}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status */}
          <Card>
            <CardHeader>
              <CardTitle>Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="enabled">Agente Ativo</Label>
                <Switch
                  id="enabled"
                  checked={config.enabled}
                  onCheckedChange={(checked) => setConfig({ ...config, enabled: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="approval">Requer Aprovação</Label>
                <Switch
                  id="approval"
                  checked={config.requiresApproval}
                  onCheckedChange={(checked) =>
                    setConfig({ ...config, requiresApproval: checked })
                  }
                />
              </div>
            </CardContent>
          </Card>

          {/* Tools */}
          <Card>
            <CardHeader>
              <CardTitle>Ferramentas Disponíveis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {config.tools?.map((tool) => (
                  <Badge key={tool} variant="secondary">
                    {tool}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Ações</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button onClick={handleSave} disabled={saving} className="w-full">
                {saving ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Salvar Configuração
                  </>
                )}
              </Button>

              <Button variant="outline" className="w-full" asChild>
                <Link href={`/admin/agents/${agentId}/playground`}>
                  <Play className="h-4 w-4 mr-2" />
                  Testar no Playground
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
