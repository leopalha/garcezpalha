'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Check, X, Zap, TrendingUp, Crown, Bot, Plus,
  ArrowRight, Sparkles, Star, Home, Gavel, Heart,
  Briefcase, Users, Car, Globe, Code, Palette,
  MessageCircle, ChevronDown, Info
} from 'lucide-react'
import Link from 'next/link'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

const PLANS = {
  starter: {
    name: 'Starter',
    price: 497,
    icon: Zap,
    description: 'Ideal para advogados solo',
    popular: false,
    features: {
      agent: '1 Agent IA Especializado',
      agentDetail: 'Escolha 1 nicho OU Agent Genérico',
      produtos: 'Até 10 produtos',
      conversas: '100 conversas IA/mês',
      usuarios: '1 usuário',
      crm: 'CRM básico (100 clientes)',
      marketing: false,
      whitelabel: true,
      suporte: 'Email',
      extras: [
        'Landing page builder',
        'Editor de perguntas',
        'Gerador de propostas IA',
        'Domínio próprio',
        'SSL incluído',
      ]
    }
  },
  pro: {
    name: 'Pro',
    price: 997,
    icon: TrendingUp,
    description: 'Para escritórios em crescimento',
    popular: true,
    features: {
      agent: '3 Agents IA Especializados',
      agentDetail: 'Escolha 3 nichos + Agent Genérico incluído',
      produtos: 'Produtos ilimitados',
      conversas: '500 conversas IA/mês',
      usuarios: '5 usuários',
      crm: 'CRM avançado (1.000 clientes)',
      marketing: true,
      marketingDetail: [
        'Gerador de conteúdo IA (30 posts/mês)',
        'Calendário editorial',
        'Otimização Google Ads',
        'Analytics avançado'
      ],
      whitelabel: true,
      suporte: 'WhatsApp prioritário',
      extras: [
        'Tudo do Starter',
        'WhatsApp Business integrado',
        'Notificações Telegram',
        'Relatórios semanais',
        'API REST',
      ]
    }
  },
  enterprise: {
    name: 'Enterprise',
    price: 1997,
    icon: Crown,
    description: 'Solução enterprise completa',
    popular: false,
    features: {
      agent: 'TODOS os Agents (ilimitado)',
      agentDetail: 'Todos os nichos + Agent Genérico + Criar nichos customizados',
      produtos: 'Produtos ilimitados',
      conversas: 'Conversas ilimitadas',
      usuarios: 'Usuários ilimitados',
      crm: 'CRM enterprise (ilimitado)',
      marketing: true,
      marketingDetail: [
        'Tudo do Pro',
        'Criação de campanhas completas',
        'A/B testing automático',
        'Consultoria mensal (1h call)'
      ],
      whitelabel: true,
      whitelabelDetail: 'White-label TOTAL (zero marca Garcez Palha)',
      suporte: 'Suporte dedicado (WhatsApp + call mensal)',
      extras: [
        'Tudo do Pro',
        'Treinamento IA com seus casos',
        'Onboarding assistido (2h)',
        'API customizada',
        'SLA 99.9% uptime',
        'Gerente de conta dedicado',
      ]
    }
  }
}

const ADDONS = [
  {
    id: 'nicho-extra',
    name: 'Nicho Extra',
    price: 97,
    type: 'monthly',
    icon: Bot,
    description: 'Adicione mais áreas de atuação',
    features: [
      'Agent IA especializado no nicho',
      'Perguntas pré-configuradas',
      'Templates de propostas',
      'Landing pages otimizadas'
    ],
    available: ['starter', 'pro']
  },
  {
    id: 'catalogo',
    name: 'Catálogo Garcez Palha',
    price: 297,
    type: 'monthly',
    icon: Star,
    badge: 'Mais Vendido',
    description: 'Clone nosso catálogo de 57 produtos prontos',
    features: [
      '57 produtos jurídicos validados',
      '57 landing pages VSL profissionais',
      'Scripts de qualificação prontos',
      'Propostas automáticas configuradas',
      'Economize 6 meses de trabalho'
    ],
    available: ['starter', 'pro', 'enterprise']
  },
  {
    id: 'vsl-profissional',
    name: 'VSL Profissional',
    price: 497,
    type: 'onetime',
    icon: Sparkles,
    description: 'Criamos seu vídeo de vendas 4min30s',
    features: [
      'Roteiro personalizado para seu nicho',
      'Edição profissional',
      'Narração com IA (ou humana)',
      'Legendas e thumbnails',
      'Hospedagem inclusa (1 ano)'
    ],
    available: ['starter', 'pro', 'enterprise']
  },
  {
    id: 'setup-completo',
    name: 'Setup Completo',
    price: 997,
    type: 'onetime',
    icon: Zap,
    description: 'Fazemos tudo pra você',
    features: [
      '5 produtos criados e configurados',
      'Landing pages personalizadas',
      'Integração WhatsApp Business',
      'Google Ads configurado',
      '2h de call de onboarding',
      'Entrega em 5 dias úteis'
    ],
    available: ['starter', 'pro']
  }
]

const FAQS = [
  {
    q: 'Como funciona o período gratuito de 30 dias?',
    a: 'Você cria sua conta, escolhe seu plano e tem 30 dias para testar TUDO sem pagar nada. Não pedimos cartão de crédito no cadastro. Após 30 dias, se gostar, você contrata. Se não gostar, cancela sem custo algum.'
  },
  {
    q: 'O que significa "1 nicho grátis" no Starter?',
    a: 'No onboarding você escolhe 1 área do direito (ex: Imobiliário, Criminal, Trabalhista). Nosso Agent IA já vem treinado naquela área, com perguntas especializadas e templates prontos. Se preferir não escolher nicho, pode usar o Agent Genérico que atende qualquer área.'
  },
  {
    q: 'Posso trocar de nicho depois?',
    a: 'Sim! Você pode trocar de nicho 1x por mês sem custo. Se precisar de mais nichos simultaneamente, adicione como add-on por R$ 97/mês cada.'
  },
  {
    q: 'Preciso ter site próprio?',
    a: 'Não. A plataforma já vem com landing page builder e você ganha um subdomínio (seunome.garcezpalha.app). Se quiser usar seu domínio próprio (escritoriosilva.com.br), é só apontar o DNS.'
  },
  {
    q: 'O Agent IA realmente funciona bem?',
    a: 'Sim. É a mesma IA que usamos no Garcez Palha e atende 10.000 clientes/mês. Taxa de qualificação acertada: 94%. Taxa de conversão média dos nossos clientes: 18% (vs 3% do mercado).'
  },
  {
    q: 'Posso cancelar quando quiser?',
    a: 'Sim, sem multa e sem burocracia. Você cancela pelo dashboard e seu acesso continua até o fim do período pago.'
  },
  {
    q: 'Qual a diferença entre Agent Especializado e Genérico?',
    a: 'Agent Especializado é treinado em 1 área específica (ex: Direito Imobiliário) e faz perguntas mais precisas. Agent Genérico atende qualquer área mas é menos especializado. Recomendamos o Especializado se você atua principalmente em 1 nicho.'
  },
  {
    q: 'O Catálogo Garcez Palha é obrigatório?',
    a: 'Não. É um add-on opcional. Você pode criar seus próprios produtos usando nossas ferramentas. O catálogo é pra quem quer começar vendendo HOJE sem ter que criar nada.'
  }
]

export default function PrecosPage() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly')
  const [selectedPlan, setSelectedPlan] = useState<'starter' | 'pro' | 'enterprise'>('pro')

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* HEADER (mesmo do /app) */}
      <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-white/80 border-b border-slate-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/app" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center">
                <span className="text-white font-bold text-xl">GP</span>
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-lg">Garcez Palha</span>
                <span className="text-xs text-muted-foreground">Plataforma para Advogados</span>
              </div>
            </Link>

            <nav className="hidden md:flex items-center gap-6">
              <Link href="/app/recursos" className="text-sm hover:text-blue-600 transition">
                Recursos
              </Link>
              <Link href="/app/nichos" className="text-sm hover:text-blue-600 transition">
                Nichos
              </Link>
              <Link href="/app/precos" className="text-sm font-semibold text-blue-600">
                Preços
              </Link>
              <Link href="/app/casos" className="text-sm hover:text-blue-600 transition">
                Casos
              </Link>
              <Link href="/app/demo" className="text-sm hover:text-blue-600 transition">
                Demo
              </Link>
            </nav>

            <div className="flex items-center gap-4">
              <Link href="/login">
                <Button variant="ghost" size="sm">Login</Button>
              </Link>
              <Link href="#planos">
                <Button size="sm" className="bg-gradient-to-r from-blue-600 to-indigo-600">
                  Teste Grátis
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="pt-32 pb-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-6 bg-blue-100 text-blue-700 border-blue-200 px-4 py-2">
              <Sparkles className="w-4 h-4 mr-2 inline" />
              30 Dias Grátis • Sem Cartão • Cancele Quando Quiser
            </Badge>

            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Escolha Seu Plano
            </h1>

            <p className="text-xl text-muted-foreground mb-8">
              Todos os planos incluem Agent IA, ferramentas completas e white-label.
              <br />
              <strong>Comece grátis e só pague se gostar.</strong>
            </p>
          </div>
        </div>
      </section>

      {/* PRICING CARDS */}
      <section id="planos" className="pb-20">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8 mb-16">
              {(Object.keys(PLANS) as Array<keyof typeof PLANS>).map((key) => {
                const plan = PLANS[key]
                const Icon = plan.icon
                const isPopular = plan.popular

                return (
                  <Card
                    key={key}
                    className={`relative ${
                      isPopular ? 'border-blue-500 border-2 shadow-xl scale-105' : ''
                    }`}
                  >
                    {isPopular && (
                      <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                        <Badge className="bg-blue-600 text-white px-4 py-1.5 text-sm">
                          ⭐ Mais Popular
                        </Badge>
                      </div>
                    )}

                    <CardHeader className="text-center pb-8">
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center mx-auto mb-4">
                        <Icon className="w-8 h-8 text-blue-600" />
                      </div>
                      <CardTitle className="text-2xl mb-2">{plan.name}</CardTitle>
                      <p className="text-sm text-muted-foreground mb-4">{plan.description}</p>
                      <div className="text-5xl font-bold">
                        R$ {plan.price}
                        <span className="text-lg text-muted-foreground font-normal">/mês</span>
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-6">
                      {/* Agent IA */}
                      <div className="border-t pt-6">
                        <div className="flex items-start gap-3 mb-2">
                          <Bot className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="font-semibold">{plan.features.agent}</p>
                            <p className="text-sm text-muted-foreground">
                              {plan.features.agentDetail}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Features principais */}
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <Check className="w-5 h-5 text-green-600 flex-shrink-0" />
                          <span className="text-sm">{plan.features.produtos}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <Check className="w-5 h-5 text-green-600 flex-shrink-0" />
                          <span className="text-sm">{plan.features.conversas}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <Check className="w-5 h-5 text-green-600 flex-shrink-0" />
                          <span className="text-sm">{plan.features.usuarios}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <Check className="w-5 h-5 text-green-600 flex-shrink-0" />
                          <span className="text-sm">{plan.features.crm}</span>
                        </div>

                        {/* Marketing */}
                        {plan.features.marketing ? (
                          <div className="border-l-2 border-blue-500 pl-3 bg-blue-50 -ml-3 p-3 rounded">
                            <p className="font-semibold text-sm mb-2 flex items-center gap-2">
                              <TrendingUp className="w-4 h-4 text-blue-600" />
                              Marketing Automation
                            </p>
                            {plan.features.marketingDetail?.map((item, i) => (
                              <p key={i} className="text-xs text-muted-foreground pl-6">
                                • {item}
                              </p>
                            ))}
                          </div>
                        ) : (
                          <div className="flex items-center gap-3 opacity-50">
                            <X className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                            <span className="text-sm">Marketing Automation</span>
                          </div>
                        )}

                        {/* Extras */}
                        {plan.features.extras.map((extra, i) => (
                          <div key={i} className="flex items-center gap-3">
                            <Check className="w-5 h-5 text-green-600 flex-shrink-0" />
                            <span className="text-sm">{extra}</span>
                          </div>
                        ))}

                        {/* Suporte */}
                        <div className="flex items-center gap-3">
                          <MessageCircle className="w-5 h-5 text-blue-600 flex-shrink-0" />
                          <span className="text-sm">Suporte: {plan.features.suporte}</span>
                        </div>
                      </div>

                      <Button
                        className={`w-full ${
                          isPopular
                            ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700'
                            : 'bg-slate-800 hover:bg-slate-900'
                        }`}
                        size="lg"
                        asChild
                      >
                        <Link href={`/app/checkout?plan=${key}`}>
                          Começar Teste Grátis
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>

                      <p className="text-xs text-center text-muted-foreground">
                        30 dias grátis • Sem cartão • Cancele fácil
                      </p>
                    </CardContent>
                  </Card>
                )
              })}
            </div>

            {/* Comparação de Planos */}
            <div className="text-center mb-12">
              <Button variant="link" className="text-blue-600">
                Ver comparação completa de planos
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ADD-ONS */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4">Turbine Sua Plataforma</h2>
              <p className="text-xl text-muted-foreground">
                Add-ons opcionais para acelerar seus resultados
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {ADDONS.map((addon) => {
                const Icon = addon.icon
                return (
                  <Card key={addon.id} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-8">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center">
                            <Icon className="w-6 h-6 text-blue-600" />
                          </div>
                          <div>
                            <h3 className="font-bold text-lg">{addon.name}</h3>
                            {addon.badge && (
                              <Badge className="mt-1 bg-amber-100 text-amber-700 border-amber-200">
                                {addon.badge}
                              </Badge>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-3xl font-bold">R$ {addon.price}</p>
                          <p className="text-sm text-muted-foreground">
                            {addon.type === 'monthly' ? '/mês' : 'único'}
                          </p>
                        </div>
                      </div>

                      <p className="text-muted-foreground mb-6">{addon.description}</p>

                      <ul className="space-y-2 mb-6">
                        {addon.features.map((feature, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm">
                            <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>

                      <Button variant="outline" className="w-full">
                        Adicionar ao Plano
                        <Plus className="ml-2 h-4 w-4" />
                      </Button>

                      <p className="text-xs text-center text-muted-foreground mt-2">
                        Disponível para: {addon.available.map(p => PLANS[p as keyof typeof PLANS].name).join(', ')}
                      </p>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4">Perguntas Frequentes</h2>
            </div>

            <Accordion type="single" collapsible className="space-y-4">
              {FAQS.map((faq, i) => (
                <AccordionItem key={i} value={`item-${i}`} className="border rounded-lg px-6">
                  <AccordionTrigger className="text-left font-semibold hover:no-underline">
                    {faq.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {faq.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="py-20 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Pronto para Começar?
            </h2>
            <p className="text-xl mb-8 text-blue-100">
              Teste 30 dias grátis. Sem cartão. Sem compromisso.
            </p>

            <Link href="/app/checkout?plan=pro">
              <Button size="lg" className="text-lg px-12 py-8 bg-white text-blue-900 hover:bg-blue-50">
                Criar Minha Plataforma Grátis
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>

            <p className="mt-6 text-sm text-blue-200">
              300+ advogados já estão usando • 10k clientes/mês • Taxa conversão 18%
            </p>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-12 bg-slate-900 text-slate-400">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <p className="text-sm">
              Garcez Palha © 2025 • Plataforma para Advogados
            </p>
            <div className="flex items-center justify-center gap-4 mt-4 text-xs">
              <Link href="/termos" className="hover:text-white transition">Termos de Uso</Link>
              <span>•</span>
              <Link href="/privacidade" className="hover:text-white transition">Privacidade</Link>
              <span>•</span>
              <Link href="/contato" className="hover:text-white transition">Contato</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
