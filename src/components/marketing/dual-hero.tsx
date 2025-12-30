'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Building2,
  Scale,
  ArrowRight,
  CheckCircle,
  Users,
  Sparkles,
  TrendingUp,
  Zap,
} from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

type Audience = 'client' | 'lawyer' | null

export function DualHero() {
  const [selectedAudience, setSelectedAudience] = useState<Audience>(null)

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-background via-background to-muted pt-20 pb-16">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] dark:bg-grid-slate-700/25" />

      <div className="container relative z-10 px-4 mx-auto max-w-7xl">
        {/* Initial View - Dual Selector */}
        {selectedAudience === null && (
          <div className="text-center space-y-8 animate-in fade-in duration-700">
            <div className="space-y-4">
              <Badge variant="secondary" className="text-sm px-4 py-1">
                Escolha como podemos ajudar
              </Badge>
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
                Soluções Jurídicas
                <br />
                <span className="bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                  para Todos
                </span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Atendemos tanto clientes que precisam de serviços jurídicos quanto advogados que
                querem digitalizar seus escritórios
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto mt-12">
              {/* B2C - Clientes */}
              <Card
                className="cursor-pointer hover:shadow-2xl transition-all duration-300 hover:scale-105 border-2 hover:border-primary group"
                onClick={() => setSelectedAudience('client')}
              >
                <CardContent className="pt-8 pb-8 text-center">
                  <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30 group-hover:bg-blue-500 group-hover:scale-110 transition-all">
                    <Scale className="h-8 w-8 text-blue-600 group-hover:text-white" />
                  </div>

                  <h2 className="text-2xl font-bold mb-3">Preciso de Serviços Jurídicos</h2>
                  <p className="text-muted-foreground mb-6">
                    Resolva seu problema jurídico com advogados especializados. Rápido, seguro e
                    transparente.
                  </p>

                  <div className="space-y-2 text-left mb-6">
                    {[
                      'Desbloqueio de conta',
                      'Usucapião e imóveis',
                      'Plano de saúde negou',
                      'Defesa criminal',
                      'E muito mais...',
                    ].map((item) => (
                      <div key={item} className="flex items-center gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>

                  <Button className="w-full group-hover:bg-primary group-hover:scale-105 transition-all">
                    Ver Serviços
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>

                  <div className="mt-4 flex items-center justify-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      10.000+ atendidos
                    </span>
                    <span className="flex items-center gap-1">
                      <TrendingUp className="h-3 w-3" />
                      98% satisfação
                    </span>
                  </div>
                </CardContent>
              </Card>

              {/* B2B - Advogados */}
              <Card
                className="cursor-pointer hover:shadow-2xl transition-all duration-300 hover:scale-105 border-2 hover:border-primary group relative overflow-hidden"
                onClick={() => setSelectedAudience('lawyer')}
              >
                <div className="absolute top-4 right-4">
                  <Badge className="bg-gradient-to-r from-primary to-blue-600">
                    <Sparkles className="h-3 w-3 mr-1" />
                    Novidade
                  </Badge>
                </div>

                <CardContent className="pt-8 pb-8 text-center">
                  <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 group-hover:bg-primary group-hover:scale-110 transition-all">
                    <Building2 className="h-8 w-8 text-primary group-hover:text-primary-foreground" />
                  </div>

                  <h2 className="text-2xl font-bold mb-3">Sou Advogado(a)</h2>
                  <p className="text-muted-foreground mb-6">
                    Automatize seu escritório com IA, CRM, marketing e gestão completa. Tudo em uma
                    plataforma.
                  </p>

                  <div className="space-y-2 text-left mb-6">
                    {[
                      'Secretária IA 24/7',
                      'CRM + Marketing automation',
                      'Landing pages automáticas',
                      'White-label (sua marca)',
                      'De R$ 497/mês',
                    ].map((item) => (
                      <div key={item} className="flex items-center gap-2 text-sm">
                        <Zap className="h-4 w-4 text-primary flex-shrink-0" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>

                  <Button className="w-full bg-gradient-to-r from-primary to-blue-600 hover:opacity-90 group-hover:scale-105 transition-all">
                    Conhecer Plataforma
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>

                  <div className="mt-4 flex items-center justify-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      300+ advogados
                    </span>
                    <span className="flex items-center gap-1">
                      <TrendingUp className="h-3 w-3" />
                      847 leads/mês
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>

            <p className="text-sm text-muted-foreground mt-8">
              Não tem certeza? Fale conosco no{' '}
              <a
                href="https://wa.me/5511999999999"
                className="text-primary hover:underline font-medium"
                target="_blank"
                rel="noopener noreferrer"
              >
                WhatsApp
              </a>
            </p>
          </div>
        )}

        {/* B2C Selected - Clients View */}
        {selectedAudience === 'client' && (
          <div className="space-y-8 animate-in slide-in-from-bottom duration-700">
            <button
              onClick={() => setSelectedAudience(null)}
              className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-2 mb-4"
            >
              ← Voltar
            </button>

            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <Badge variant="secondary" className="text-sm px-4 py-1">
                  Serviços Jurídicos
                </Badge>

                <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
                  Resolva seu problema
                  <span className="block bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    com especialistas
                  </span>
                </h1>

                <p className="text-xl text-muted-foreground">
                  Atendimento rápido, transparente e com preço justo. Nossa equipe está pronta para
                  ajudar você em diversas áreas do direito.
                </p>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Button size="lg" className="text-lg px-8" asChild>
                    <Link href="#produtos">
                      Ver Todos os Serviços
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                  <Button size="lg" variant="outline" className="text-lg px-8" asChild>
                    <a
                      href="https://wa.me/5511999999999"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Falar no WhatsApp
                    </a>
                  </Button>
                </div>

                <div className="flex items-center gap-8 pt-4">
                  <div>
                    <p className="text-3xl font-bold text-primary">10.000+</p>
                    <p className="text-sm text-muted-foreground">Clientes atendidos</p>
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-primary">98%</p>
                    <p className="text-sm text-muted-foreground">Satisfação</p>
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-primary">24/7</p>
                    <p className="text-sm text-muted-foreground">Atendimento</p>
                  </div>
                </div>
              </div>

              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl blur-3xl opacity-20" />
                <Card className="relative border-2">
                  <CardContent className="p-8">
                    <h3 className="text-2xl font-bold mb-6">Áreas de Atuação</h3>
                    <div className="grid gap-4">
                      {[
                        { title: 'Direito Bancário', desc: 'Desbloqueio, PIX, negativação' },
                        { title: 'Direito Imobiliário', desc: 'Usucapião, regularização' },
                        { title: 'Direito da Saúde', desc: 'Plano de saúde, cirurgias' },
                        { title: 'Direito Criminal', desc: 'Defesa, habeas corpus' },
                        { title: 'Direito Previdenciário', desc: 'INSS, aposentadoria' },
                      ].map((area) => (
                        <div
                          key={area.title}
                          className="flex items-start gap-3 p-4 rounded-lg hover:bg-muted/50 transition-colors"
                        >
                          <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="font-semibold">{area.title}</p>
                            <p className="text-sm text-muted-foreground">{area.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        )}

        {/* B2B Selected - Lawyers View */}
        {selectedAudience === 'lawyer' && (
          <div className="space-y-8 animate-in slide-in-from-bottom duration-700">
            <button
              onClick={() => setSelectedAudience(null)}
              className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-2 mb-4"
            >
              ← Voltar
            </button>

            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <Badge className="text-sm px-4 py-1 bg-gradient-to-r from-primary to-blue-600">
                  <Sparkles className="h-3 w-3 mr-1" />
                  Plataforma para Advogados
                </Badge>

                <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
                  Seu escritório
                  <span className="block bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                    100% automatizado
                  </span>
                </h1>

                <p className="text-xl text-muted-foreground">
                  A mesma tecnologia que atende 10.000 clientes/mês. CRM, IA, Marketing e Gestão em
                  uma única plataforma white-label.
                </p>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    size="lg"
                    className="text-lg px-8 bg-gradient-to-r from-primary to-blue-600 hover:opacity-90"
                    asChild
                  >
                    <Link href="/app">
                      Ver a Plataforma
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                  <Button size="lg" variant="outline" className="text-lg px-8" asChild>
                    <Link href="/app/precos">Ver Planos e Preços</Link>
                  </Button>
                </div>

                <div className="flex items-center gap-8 pt-4">
                  <div>
                    <p className="text-3xl font-bold text-primary">300+</p>
                    <p className="text-sm text-muted-foreground">Advogados ativos</p>
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-primary">847</p>
                    <p className="text-sm text-muted-foreground">Leads/mês média</p>
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-primary">R$ 497</p>
                    <p className="text-sm text-muted-foreground">A partir de</p>
                  </div>
                </div>
              </div>

              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-primary to-blue-600 rounded-3xl blur-3xl opacity-20" />
                <Card className="relative border-2">
                  <CardContent className="p-8">
                    <h3 className="text-2xl font-bold mb-6">O que está incluído</h3>
                    <div className="grid gap-4">
                      {[
                        {
                          icon: Sparkles,
                          title: 'Secretária IA 24/7',
                          desc: 'Atende e qualifica leads automaticamente',
                        },
                        {
                          icon: Users,
                          title: 'CRM Completo',
                          desc: 'Gestão de leads, clientes e processos',
                        },
                        {
                          icon: TrendingUp,
                          title: 'Marketing Automation',
                          desc: 'Landing pages, VSL e automações',
                        },
                        {
                          icon: Building2,
                          title: 'White-Label',
                          desc: 'Sua marca, seu domínio, suas cores',
                        },
                        {
                          icon: Zap,
                          title: 'Ferramentas de Criação',
                          desc: 'Crie produtos, perguntas e propostas',
                        },
                      ].map((feature) => {
                        const Icon = feature.icon
                        return (
                          <div
                            key={feature.title}
                            className="flex items-start gap-3 p-4 rounded-lg hover:bg-muted/50 transition-colors"
                          >
                            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                              <Icon className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                              <p className="font-semibold">{feature.title}</p>
                              <p className="text-sm text-muted-foreground">{feature.desc}</p>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
