'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import {
  Palette,
  Upload,
  Save,
  Eye,
  Globe,
  Mail,
  Phone,
  MapPin,
  Facebook,
  Instagram,
  Linkedin,
  Twitter,
  Check,
  AlertCircle,
  Sparkles,
  RefreshCw,
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface BrandConfig {
  // Logo & Visual Identity
  logoUrl: string
  faviconUrl: string
  primaryColor: string
  secondaryColor: string
  accentColor: string
  fontFamily: string

  // Firm Information
  firmName: string
  oabNumber: string
  cnpj: string
  tagline: string
  description: string

  // Contact
  email: string
  phone: string
  whatsapp: string
  address: string
  city: string
  state: string
  zipCode: string

  // Social Media
  facebook: string
  instagram: string
  linkedin: string
  twitter: string

  // Domain
  customDomain: string
  domainConfigured: boolean
}

const defaultConfig: BrandConfig = {
  logoUrl: '/logo-placeholder.png',
  faviconUrl: '/favicon-placeholder.png',
  primaryColor: '#0066CC',
  secondaryColor: '#003366',
  accentColor: '#FFB84D',
  fontFamily: 'Inter',

  firmName: 'Silva & Advogados',
  oabNumber: 'OAB/SP 123.456',
  cnpj: '12.345.678/0001-00',
  tagline: 'Excelência Jurídica para Você',
  description:
    'Escritório de advocacia especializado em direito imobiliário, bancário e da saúde. Atendemos você com tecnologia e humanização.',

  email: 'contato@silvaadvogados.com.br',
  phone: '(11) 3456-7890',
  whatsapp: '5511987654321',
  address: 'Av. Paulista, 1000 - Sala 1001',
  city: 'São Paulo',
  state: 'SP',
  zipCode: '01310-100',

  facebook: 'https://facebook.com/silvaadvogados',
  instagram: 'https://instagram.com/silvaadvogados',
  linkedin: 'https://linkedin.com/company/silvaadvogados',
  twitter: '',

  customDomain: 'silvaadvogados.com.br',
  domainConfigured: true,
}

const fontOptions = [
  { value: 'Inter', label: 'Inter (Moderno)' },
  { value: 'Roboto', label: 'Roboto (Profissional)' },
  { value: 'Playfair Display', label: 'Playfair Display (Elegante)' },
  { value: 'Montserrat', label: 'Montserrat (Clean)' },
  { value: 'Lora', label: 'Lora (Clássico)' },
]

export default function WhiteLabelPage() {
  const [config, setConfig] = useState<BrandConfig>(defaultConfig)
  const [hasChanges, setHasChanges] = useState(false)
  const [previewMode, setPreviewMode] = useState(false)

  const updateConfig = (key: keyof BrandConfig, value: any) => {
    setConfig((prev) => ({ ...prev, [key]: value }))
    setHasChanges(true)
  }

  const handleSave = () => {
    // TODO: Save to backend API
    setHasChanges(false)
  }

  const handleReset = () => {
    setConfig(defaultConfig)
    setHasChanges(false)
  }

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Palette className="h-8 w-8 text-primary" />
            White-Label
          </h1>
          <p className="text-muted-foreground mt-1">
            Personalize a plataforma com a identidade visual do seu escritório
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={handleReset} disabled={!hasChanges}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Restaurar Padrão
          </Button>
          <Button onClick={() => setPreviewMode(!previewMode)} variant="outline">
            <Eye className="h-4 w-4 mr-2" />
            {previewMode ? 'Sair da Prévia' : 'Visualizar'}
          </Button>
          <Button onClick={handleSave} disabled={!hasChanges}>
            <Save className="h-4 w-4 mr-2" />
            Salvar Alterações
          </Button>
        </div>
      </div>

      {hasChanges && (
        <div className="bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 flex items-center gap-3">
          <AlertCircle className="h-5 w-5 text-yellow-600" />
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

      {previewMode && (
        <Card className="bg-gradient-to-br from-primary/5 to-blue-500/5 border-primary/20">
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Sparkles className="h-5 w-5 text-primary" />
                <div>
                  <h3 className="font-semibold">Modo de Prévia Ativo</h3>
                  <p className="text-sm text-muted-foreground">
                    Veja como suas alterações ficam em tempo real
                  </p>
                </div>
              </div>
              {/* Preview would go here */}
              <div className="rounded-lg border-2 border-dashed border-primary/30 p-8 text-center bg-background/50">
                <Globe className="h-12 w-12 mx-auto mb-4 text-primary/50" />
                <p className="text-sm text-muted-foreground">
                  A prévia do site será exibida aqui com suas configurações aplicadas
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Configuration */}
        <div className="lg:col-span-2 space-y-6">
          {/* Visual Identity */}
          <Card>
            <CardHeader>
              <CardTitle>Identidade Visual</CardTitle>
              <CardDescription>Logo, cores e tipografia do seu escritório</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Logo Upload */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Logo Principal</Label>
                  <div className="border-2 border-dashed rounded-lg p-6 text-center hover:border-primary transition-colors cursor-pointer">
                    <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      Clique ou arraste para enviar
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">PNG ou SVG, max 2MB</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Favicon</Label>
                  <div className="border-2 border-dashed rounded-lg p-6 text-center hover:border-primary transition-colors cursor-pointer">
                    <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      Clique ou arraste para enviar
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">PNG 32x32 ou 64x64</p>
                  </div>
                </div>
              </div>

              {/* Colors */}
              <div>
                <Label className="mb-3 block">Paleta de Cores</Label>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="primary-color" className="text-sm">
                      Cor Primária
                    </Label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        id="primary-color"
                        value={config.primaryColor}
                        onChange={(e) => updateConfig('primaryColor', e.target.value)}
                        className="h-10 w-16 rounded border cursor-pointer"
                      />
                      <Input
                        value={config.primaryColor}
                        onChange={(e) => updateConfig('primaryColor', e.target.value)}
                        className="flex-1"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="secondary-color" className="text-sm">
                      Cor Secundária
                    </Label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        id="secondary-color"
                        value={config.secondaryColor}
                        onChange={(e) => updateConfig('secondaryColor', e.target.value)}
                        className="h-10 w-16 rounded border cursor-pointer"
                      />
                      <Input
                        value={config.secondaryColor}
                        onChange={(e) => updateConfig('secondaryColor', e.target.value)}
                        className="flex-1"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="accent-color" className="text-sm">
                      Cor de Destaque
                    </Label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        id="accent-color"
                        value={config.accentColor}
                        onChange={(e) => updateConfig('accentColor', e.target.value)}
                        className="h-10 w-16 rounded border cursor-pointer"
                      />
                      <Input
                        value={config.accentColor}
                        onChange={(e) => updateConfig('accentColor', e.target.value)}
                        className="flex-1"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Font */}
              <div className="space-y-2">
                <Label htmlFor="font">Tipografia</Label>
                <select
                  id="font"
                  value={config.fontFamily}
                  onChange={(e) => updateConfig('fontFamily', e.target.value)}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  {fontOptions.map((font) => (
                    <option key={font.value} value={font.value}>
                      {font.label}
                    </option>
                  ))}
                </select>
              </div>
            </CardContent>
          </Card>

          {/* Firm Information */}
          <Card>
            <CardHeader>
              <CardTitle>Informações do Escritório</CardTitle>
              <CardDescription>Dados legais e institucionais</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firm-name">Nome do Escritório *</Label>
                  <Input
                    id="firm-name"
                    value={config.firmName}
                    onChange={(e) => updateConfig('firmName', e.target.value)}
                    placeholder="Ex: Silva & Advogados"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="oab">Número OAB *</Label>
                  <Input
                    id="oab"
                    value={config.oabNumber}
                    onChange={(e) => updateConfig('oabNumber', e.target.value)}
                    placeholder="Ex: OAB/SP 123.456"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="cnpj">CNPJ</Label>
                <Input
                  id="cnpj"
                  value={config.cnpj}
                  onChange={(e) => updateConfig('cnpj', e.target.value)}
                  placeholder="Ex: 12.345.678/0001-00"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tagline">Slogan/Tagline</Label>
                <Input
                  id="tagline"
                  value={config.tagline}
                  onChange={(e) => updateConfig('tagline', e.target.value)}
                  placeholder="Ex: Excelência Jurídica para Você"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  value={config.description}
                  onChange={(e) => updateConfig('description', e.target.value)}
                  placeholder="Descreva seu escritório, áreas de atuação e diferenciais..."
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle>Informações de Contato</CardTitle>
              <CardDescription>Endereço, telefone, email e redes sociais</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      value={config.email}
                      onChange={(e) => updateConfig('email', e.target.value)}
                      className="pl-9"
                      placeholder="contato@escritorio.com.br"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Telefone *</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="phone"
                      value={config.phone}
                      onChange={(e) => updateConfig('phone', e.target.value)}
                      className="pl-9"
                      placeholder="(11) 3456-7890"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="whatsapp">WhatsApp (com DDI)</Label>
                <Input
                  id="whatsapp"
                  value={config.whatsapp}
                  onChange={(e) => updateConfig('whatsapp', e.target.value)}
                  placeholder="5511987654321"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Endereço Completo</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="address"
                    value={config.address}
                    onChange={(e) => updateConfig('address', e.target.value)}
                    className="pl-9"
                    placeholder="Av. Paulista, 1000 - Sala 1001"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">Cidade</Label>
                  <Input
                    id="city"
                    value={config.city}
                    onChange={(e) => updateConfig('city', e.target.value)}
                    placeholder="São Paulo"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="state">Estado</Label>
                  <Input
                    id="state"
                    value={config.state}
                    onChange={(e) => updateConfig('state', e.target.value)}
                    placeholder="SP"
                    maxLength={2}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="zip">CEP</Label>
                  <Input
                    id="zip"
                    value={config.zipCode}
                    onChange={(e) => updateConfig('zipCode', e.target.value)}
                    placeholder="01310-100"
                  />
                </div>
              </div>

              {/* Social Media */}
              <div className="pt-4 border-t">
                <Label className="mb-3 block">Redes Sociais</Label>
                <div className="space-y-3">
                  <div className="relative">
                    <Facebook className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      value={config.facebook}
                      onChange={(e) => updateConfig('facebook', e.target.value)}
                      className="pl-9"
                      placeholder="https://facebook.com/seuescritorio"
                    />
                  </div>

                  <div className="relative">
                    <Instagram className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      value={config.instagram}
                      onChange={(e) => updateConfig('instagram', e.target.value)}
                      className="pl-9"
                      placeholder="https://instagram.com/seuescritorio"
                    />
                  </div>

                  <div className="relative">
                    <Linkedin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      value={config.linkedin}
                      onChange={(e) => updateConfig('linkedin', e.target.value)}
                      className="pl-9"
                      placeholder="https://linkedin.com/company/seuescritorio"
                    />
                  </div>

                  <div className="relative">
                    <Twitter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      value={config.twitter}
                      onChange={(e) => updateConfig('twitter', e.target.value)}
                      className="pl-9"
                      placeholder="https://twitter.com/seuescritorio"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Custom Domain */}
          <Card>
            <CardHeader>
              <CardTitle>Domínio Personalizado</CardTitle>
              <CardDescription>Configure seu próprio domínio</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="domain">Seu Domínio</Label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="domain"
                      value={config.customDomain}
                      onChange={(e) => updateConfig('customDomain', e.target.value)}
                      className="pl-9"
                      placeholder="seuescritorio.com.br"
                    />
                  </div>
                  <Button variant="outline">Verificar DNS</Button>
                </div>
              </div>

              {config.domainConfigured ? (
                <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                  <div className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="text-sm font-medium text-green-900 dark:text-green-100">
                        Domínio configurado com sucesso!
                      </p>
                      <p className="text-xs text-green-700 dark:text-green-300 mt-1">
                        Seu site está acessível em: https://{config.customDomain}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                        Configure seu DNS
                      </p>
                      <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                        Adicione estes registros no seu provedor de domínio:
                      </p>
                      <div className="mt-2 p-2 bg-blue-100 dark:bg-blue-900/30 rounded text-xs font-mono">
                        <div>Tipo: A</div>
                        <div>Nome: @</div>
                        <div>Valor: 76.76.21.21</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Preview & Status */}
        <div className="space-y-6">
          {/* Live Preview Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Prévia ao Vivo</CardTitle>
            </CardHeader>
            <CardContent>
              <div
                className="rounded-lg border p-6 text-center space-y-4"
                style={{
                  borderColor: config.primaryColor,
                  backgroundColor: `${config.primaryColor}10`,
                }}
              >
                <div className="h-16 w-16 mx-auto rounded-full flex items-center justify-center border-2" style={{ borderColor: config.primaryColor }}>
                  <Palette className="h-8 w-8" style={{ color: config.primaryColor }} />
                </div>
                <div>
                  <h3
                    className="text-xl font-bold mb-1"
                    style={{ fontFamily: config.fontFamily }}
                  >
                    {config.firmName}
                  </h3>
                  <p className="text-sm text-muted-foreground">{config.tagline}</p>
                </div>
                <div className="flex justify-center gap-2">
                  <div
                    className="h-8 w-8 rounded"
                    style={{ backgroundColor: config.primaryColor }}
                  />
                  <div
                    className="h-8 w-8 rounded"
                    style={{ backgroundColor: config.secondaryColor }}
                  />
                  <div
                    className="h-8 w-8 rounded"
                    style={{ backgroundColor: config.accentColor }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Checklist */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Checklist de Configuração</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { label: 'Logo e Favicon', done: false },
                  { label: 'Cores da Marca', done: true },
                  { label: 'Informações do Escritório', done: true },
                  { label: 'Contatos e Endereço', done: true },
                  { label: 'Redes Sociais', done: true },
                  { label: 'Domínio Personalizado', done: config.domainConfigured },
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-2">
                    {item.done ? (
                      <Check className="h-4 w-4 text-green-600" />
                    ) : (
                      <div className="h-4 w-4 rounded-full border-2" />
                    )}
                    <span
                      className={cn(
                        'text-sm',
                        item.done ? 'text-foreground' : 'text-muted-foreground'
                      )}
                    >
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">💡 Dica</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Após configurar sua marca, todas as landing pages e emails serão automaticamente
                personalizados com sua identidade visual.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
