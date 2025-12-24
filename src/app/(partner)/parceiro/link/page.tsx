'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Copy,
  CheckCircle,
  ExternalLink,
  QrCode,
  Share2,
  BarChart3,
  MousePointerClick,
  Users,
} from 'lucide-react'

const mockPartnerData = {
  partnerCode: 'PARCEIRO123',
  customSlug: null as string | null,
  linkStats: {
    totalClicks: 245,
    uniqueVisitors: 189,
    conversions: 15,
    conversionRate: 7.9,
    clicksBySource: [
      { source: 'WhatsApp', clicks: 120 },
      { source: 'Instagram', clicks: 65 },
      { source: 'Facebook', clicks: 35 },
      { source: 'Email', clicks: 15 },
      { source: 'Outros', clicks: 10 },
    ],
    clicksByMonth: [
      { month: 'Out', clicks: 45 },
      { month: 'Nov', clicks: 78 },
      { month: 'Dez', clicks: 52 },
      { month: 'Jan', clicks: 70 },
    ],
  },
}

export default function LinkPage() {
  const [copied, setCopied] = useState<string | null>(null)
  const [customSlug, setCustomSlug] = useState(mockPartnerData.customSlug || '')
  const [showQR, setShowQR] = useState(false)

  const baseUrl = 'https://garcezpalha.com'
  const referralLink = mockPartnerData.customSlug
    ? `${baseUrl}/${mockPartnerData.customSlug}`
    : `${baseUrl}?ref=${mockPartnerData.partnerCode}`

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text)
    setCopied(type)
    setTimeout(() => setCopied(null), 2000)
  }

  const shareLinks = [
    {
      name: 'WhatsApp',
      url: `https://wa.me/?text=Precisa de ajuda jurídica? Confira os serviços da Garcez Palha: ${referralLink}`,
      color: 'bg-green-500',
    },
    {
      name: 'Facebook',
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(referralLink)}`,
      color: 'bg-blue-600',
    },
    {
      name: 'Twitter',
      url: `https://twitter.com/intent/tweet?url=${encodeURIComponent(referralLink)}&text=Recomendo os serviços jurídicos da Garcez Palha!`,
      color: 'bg-sky-500',
    },
    {
      name: 'LinkedIn',
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(referralLink)}`,
      color: 'bg-blue-700',
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Link de Referência</h2>
        <p className="text-muted-foreground">
          Gerencie seu link de indicação e acompanhe estatísticas
        </p>
      </div>

      {/* Main Link Card */}
      <Card className="bg-primary/5 border-primary/20">
        <CardHeader>
          <CardTitle className="text-primary">Seu Link de Indicação</CardTitle>
          <CardDescription>
            Compartilhe este link para ganhar comissões por cada cliente convertido
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="flex-1 bg-background border rounded-lg p-3 font-mono text-sm truncate">
              {referralLink}
            </div>
            <Button
              onClick={() => copyToClipboard(referralLink, 'link')}
              variant="outline"
              size="icon"
            >
              {copied === 'link' ? (
                <CheckCircle className="h-4 w-4 text-green-500" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
            <Button variant="outline" size="icon" asChild>
              <a href={referralLink} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4" />
              </a>
            </Button>
            <Button variant="outline" size="icon" onClick={() => setShowQR(!showQR)}>
              <QrCode className="h-4 w-4" />
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Código do parceiro</p>
              <p className="font-mono font-bold">{mockPartnerData.partnerCode}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Taxa de comissão</p>
              <p className="font-bold text-green-600">10% por conversão</p>
            </div>
          </div>

          {showQR && (
            <div className="flex justify-center p-4 bg-background border rounded-lg">
              <div className="text-center">
                <div className="w-48 h-48 bg-muted flex items-center justify-center rounded">
                  <QrCode className="h-24 w-24 text-muted-foreground" />
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  QR Code será gerado automaticamente
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Link Statistics */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Cliques</CardTitle>
            <MousePointerClick className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockPartnerData.linkStats.totalClicks}</div>
            <p className="text-xs text-muted-foreground">Cliques totais no link</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Visitantes Únicos</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockPartnerData.linkStats.uniqueVisitors}</div>
            <p className="text-xs text-muted-foreground">Pessoas diferentes</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversões</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockPartnerData.linkStats.conversions}</div>
            <p className="text-xs text-muted-foreground">Clientes convertidos</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Conversão</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockPartnerData.linkStats.conversionRate}%</div>
            <p className="text-xs text-muted-foreground">Visitantes → Clientes</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Share Buttons */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Share2 className="h-5 w-5" />
              Compartilhar
            </CardTitle>
            <CardDescription>Compartilhe seu link nas redes sociais</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              {shareLinks.map((link) => (
                <Button
                  key={link.name}
                  variant="outline"
                  className="w-full"
                  asChild
                >
                  <a href={link.url} target="_blank" rel="noopener noreferrer">
                    {link.name}
                  </a>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Custom Slug */}
        <Card>
          <CardHeader>
            <CardTitle>Link Personalizado</CardTitle>
            <CardDescription>Crie um link mais fácil de lembrar</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm text-muted-foreground">{baseUrl}/</span>
                <Input
                  placeholder="seu-nome"
                  value={customSlug}
                  onChange={(e) => setCustomSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                  className="flex-1"
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Use apenas letras minúsculas, números e hífens
              </p>
            </div>
            <Button className="w-full" disabled={!customSlug || customSlug === mockPartnerData.customSlug}>
              Salvar Link Personalizado
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Clicks by Source */}
      <Card>
        <CardHeader>
          <CardTitle>Cliques por Origem</CardTitle>
          <CardDescription>De onde vêm os cliques no seu link</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockPartnerData.linkStats.clicksBySource.map((source) => {
              const percentage = (source.clicks / mockPartnerData.linkStats.totalClicks) * 100
              return (
                <div key={source.source}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium">{source.source}</span>
                    <span className="text-sm text-muted-foreground">
                      {source.clicks} cliques ({percentage.toFixed(1)}%)
                    </span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full transition-all"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Marketing Materials */}
      <Card>
        <CardHeader>
          <CardTitle>Materiais de Marketing</CardTitle>
          <CardDescription>Textos prontos para compartilhar</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-muted rounded-lg">
            <p className="text-sm mb-2">
              🏛️ Precisa de ajuda jurídica de qualidade? Conheça a Garcez Palha! Atendimento
              personalizado e advogados especializados. Acesse: {referralLink}
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                copyToClipboard(
                  `🏛️ Precisa de ajuda jurídica de qualidade? Conheça a Garcez Palha! Atendimento personalizado e advogados especializados. Acesse: ${referralLink}`,
                  'text1'
                )
              }
            >
              {copied === 'text1' ? (
                <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
              ) : (
                <Copy className="h-4 w-4 mr-2" />
              )}
              Copiar
            </Button>
          </div>

          <div className="p-4 bg-muted rounded-lg">
            <p className="text-sm mb-2">
              ⚖️ Recomendo! Escritório de advocacia com excelente atendimento e resultados
              comprovados. Trabalhista, Cível, Família e mais. {referralLink}
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                copyToClipboard(
                  `⚖️ Recomendo! Escritório de advocacia com excelente atendimento e resultados comprovados. Trabalhista, Cível, Família e mais. ${referralLink}`,
                  'text2'
                )
              }
            >
              {copied === 'text2' ? (
                <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
              ) : (
                <Copy className="h-4 w-4 mr-2" />
              )}
              Copiar
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
