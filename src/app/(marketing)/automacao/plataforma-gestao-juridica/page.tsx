'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Check, X, MessageCircle, TrendingUp, Users, Calendar,
  FileText, DollarSign, Zap, Crown, ChevronDown, Play,
  Star, Shield, Bot, Sparkles, ArrowRight, Clock,
} from 'lucide-react'
import Link from 'next/link'

export default function PlataformaGestaoJuridicaPage() {
  const [videoPlaying, setVideoPlaying] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState<'starter' | 'pro' | 'enterprise'>('pro')

  const plans = {
    starter: {
      name: 'Starter',
      price: 497,
      description: 'Ideal para advogados solo',
      icon: Zap,
      features: [
        'Secretária IA 24/7 (100 conversas/mês)',
        'Qualificação automática de leads',
        'Agendamento automático',
        'CRM básico (clientes + processos)',
        'Propostas com IA',
        'Templates de documentos',
        'Dashboard de métricas',
        '1 usuário',
        'Suporte por email',
        '30 dias grátis',
      ],
    },
    pro: {
      name: 'Pro',
      price: 997,
      description: 'Para escritórios em crescimento',
      icon: TrendingUp,
      recommended: true,
      features: [
        'Tudo do Starter',
        '500 conversas/mês',
        'Marketing Automation completo',
        '• Criação de conteúdo (Instagram, LinkedIn)',
        '• Calendário editorial mensal',
        '• Otimização de anúncios Google Ads',
        '• Analytics de performance',
        'WhatsApp Business integrado',
        'CRM avançado (pipeline, automações)',
        '5 usuários',
        'Notificações Telegram',
        'Relatórios semanais',
        'Suporte prioritário (WhatsApp)',
      ],
    },
    enterprise: {
      name: 'Enterprise',
      price: 1997,
      description: 'Solução enterprise completa',
      icon: Crown,
      features: [
        'Tudo do Pro',
        'Conversas ilimitadas',
        'Usuários ilimitados',
        'White-Label (sua marca)',
        '• Logo e cores personalizadas',
        '• Domínio próprio',
        '• Sem marca Garcez Palha',
        'API para integrações customizadas',
        'Treinamento de IA com seus casos',
        'Customização de workflows',
        'Onboarding assistido (call + setup)',
        'Suporte dedicado (WhatsApp + call mensal)',
        'SLA uptime 99.9%',
      ],
    },
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* SEÇÃO 1: HERO */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 text-white">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        <div className="container mx-auto px-4 py-20 relative">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-4 bg-blue-500/20 text-blue-100 border-blue-400/30 px-4 py-1">
              <Sparkles className="w-4 h-4 mr-2 inline" />
              Tecnologia Jurídica
            </Badge>

            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Sua Secretária Jurídica IA
              <span className="block text-blue-300 mt-2">Trabalha 24/7 para Você</span>
            </h1>

            <p className="text-xl md:text-2xl mb-8 text-blue-100 leading-relaxed">
              Capture e qualifique leads automaticamente enquanto você dorme.
              <span className="block mt-2 font-semibold">Fature 10x mais gastando menos tempo.</span>
            </p>

            {/* VSL Video Placeholder */}
            <div className="mb-8 rounded-2xl overflow-hidden shadow-2xl max-w-3xl mx-auto">
              <div className="relative bg-black aspect-video">
                {!videoPlaying ? (
                  <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-blue-900/90 to-indigo-900/90">
                    <button
                      onClick={() => setVideoPlaying(true)}
                      className="group flex flex-col items-center gap-4"
                    >
                      <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 transition-transform border-4 border-white/40">
                        <Play className="w-10 h-10 text-white ml-1" fill="white" />
                      </div>
                      <p className="text-white text-lg font-medium">Assistir Vídeo (4min30s)</p>
                    </button>
                  </div>
                ) : (
                  <div className="p-12 text-center">
                    <p className="text-white/60">[ Vídeo VSL será inserido aqui ]</p>
                  </div>
                )}
              </div>
            </div>

            <Button
              size="lg"
              className="text-lg px-8 py-6 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 shadow-xl"
              asChild
            >
              <Link href="#planos">
                Começar Teste Grátis - 30 Dias
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>

            <div className="flex items-center justify-center gap-6 mt-6 text-sm text-blue-200">
              <span className="flex items-center gap-2">
                <Check className="w-4 h-4" /> Sem cartão de crédito
              </span>
              <span className="flex items-center gap-2">
                <Check className="w-4 h-4" /> Cancele quando quiser
              </span>
              <span className="flex items-center gap-2">
                <Check className="w-4 h-4" /> Setup em 60 segundos
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* SEÇÃO 2: PROBLEMA */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold text-center mb-4">
              Você está passando por isso?
            </h2>
            <p className="text-xl text-muted-foreground text-center mb-12">
              Se você respondeu SIM para qualquer uma dessas perguntas, continue lendo...
            </p>

            <div className="grid md:grid-cols-2 gap-6">
              {[
                '❌ Perde 70% dos leads porque não consegue atender de madrugada?',
                '❌ Gasta R$ 3.000 em anúncios mas converte apenas 10%?',
                '❌ Não tem tempo para fazer marketing no Instagram/LinkedIn?',
                '❌ Seu WhatsApp está lotado e você não dá conta de qualificar todos?',
                '❌ Perde leads HOT porque demora para responder?',
                '❌ Não consegue escalar o escritório sem contratar mais gente?',
              ].map((problem, i) => (
                <Card key={i} className="border-red-200 bg-red-50/50">
                  <CardContent className="p-6">
                    <p className="text-lg">{problem}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SEÇÃO 3: AGITAÇÃO */}
      <section className="py-20 bg-slate-100">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold text-center mb-12 text-red-600">
              O que acontece se você não agir AGORA:
            </h2>

            <div className="space-y-6">
              {[
                {
                  icon: DollarSign,
                  title: 'Cada dia que passa = R$ 500 perdidos',
                  desc: 'Enquanto você não responde, seus concorrentes estão fechando seus clientes.',
                },
                {
                  icon: Clock,
                  title: 'Seu tempo está sendo desperdiçado',
                  desc: 'Você passa 4h/dia no WhatsApp quando poderia estar em audiências faturando.',
                },
                {
                  icon: TrendingUp,
                  title: 'Seu escritório não cresce',
                  desc: 'Sem automação, você está preso ao limite de horas do seu dia.',
                },
              ].map((item, i) => (
                <Card key={i} className="border-l-4 border-l-red-500">
                  <CardContent className="p-6 flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                      <item.icon className="w-6 h-6 text-red-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                      <p className="text-muted-foreground">{item.desc}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="mt-12 text-center">
              <p className="text-2xl font-semibold mb-2">Mas existe uma solução que você provavelmente não conhece...</p>
              <ChevronDown className="w-8 h-8 mx-auto animate-bounce text-blue-600" />
            </div>
          </div>
        </div>
      </section>

      {/* SEÇÃO 4: SOLUÇÃO */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <Badge className="mb-4 bg-green-100 text-green-700 border-green-300">
                <Shield className="w-4 h-4 mr-2" />
                A Solução Existe
              </Badge>
              <h2 className="text-5xl font-bold mb-4">
                Plataforma de Gestão Jurídica
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                O sistema completo que automatiza seu escritório e multiplica seus resultados
              </p>
            </div>

            <div className="grid md:grid-cols-5 gap-8 mb-16">
              {[
                { icon: Bot, title: 'Secretária IA 24/7', desc: 'Qualifica leads enquanto você dorme' },
                { icon: Users, title: 'CRM Completo', desc: 'Gestão de clientes e processos' },
                { icon: Sparkles, title: 'Marketing Auto', desc: 'Conteúdo e anúncios no piloto automático' },
                { icon: FileText, title: 'Documentos IA', desc: 'Propostas e contratos gerados automaticamente' },
                { icon: TrendingUp, title: 'Métricas Real-Time', desc: 'Dashboard com todos os números' },
              ].map((module, i) => (
                <Card key={i} className="text-center hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-4">
                      <module.icon className="w-8 h-8 text-blue-600" />
                    </div>
                    <h3 className="font-bold mb-2">{module.title}</h3>
                    <p className="text-sm text-muted-foreground">{module.desc}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SEÇÃO 5: COMO FUNCIONA */}
      <section className="py-20 bg-slate-100">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold text-center mb-16">
              Como Funciona (3 Passos Simples)
            </h2>

            <div className="space-y-8">
              {[
                {
                  step: '1',
                  title: 'Setup em 60 segundos',
                  desc: 'Crie sua conta, personalize suas cores e logo. Pronto, seu sistema está no ar.',
                },
                {
                  step: '2',
                  title: 'Integre com seu site',
                  desc: 'Copie e cole um código. Seu chat IA estará atendendo visitantes 24/7.',
                },
                {
                  step: '3',
                  title: 'Receba leads qualificados',
                  desc: 'Dashboard mostra HOT leads prontos para você fechar. ROI imediato.',
                },
              ].map((step, i) => (
                <div key={i} className="flex items-start gap-6">
                  <div className="w-16 h-16 rounded-full bg-blue-600 text-white flex items-center justify-center text-2xl font-bold flex-shrink-0">
                    {step.step}
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold mb-2">{step.title}</h3>
                    <p className="text-lg text-muted-foreground">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SEÇÃO 6: PROVA SOCIAL */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold text-center mb-4">
              O que nossos clientes dizem
            </h2>
            <p className="text-center text-muted-foreground mb-12">
              300+ advogados usando • 12.5k leads gerados • 89% taxa de retenção
            </p>

            <div className="grid md:grid-cols-2 gap-8">
              {[
                {
                  name: 'Dr. João Silva',
                  role: 'Advogado Trabalhista • SP',
                  text: 'Em 30 dias, 47 leads qualificados. 8 viraram clientes. Faturei R$ 32.000. Pago R$ 497, lucro R$ 31.500.',
                  rating: 5,
                },
                {
                  name: 'Dra. Maria Santos',
                  role: 'Escritório Civil • BH',
                  text: 'Melhor investimento que fiz. O sistema trabalha enquanto durmo. Acordo com 5 consultas agendadas todo dia.',
                  rating: 5,
                },
                {
                  name: 'Dr. Pedro Costa',
                  role: 'Advogado Criminal • RJ',
                  text: 'Cancelei chatbot de R$ 800 que não funcionava. Garcez Palha por R$ 497 converte 10x mais.',
                  rating: 5,
                },
                {
                  name: 'Dra. Ana Paula',
                  role: 'Direito de Família • SC',
                  text: 'O marketing automation é sensacional. Gera conteúdo para Instagram/LinkedIn. Meus anúncios convertendo 300% mais.',
                  rating: 5,
                },
              ].map((testimonial, i) => (
                <Card key={i}>
                  <CardContent className="p-6">
                    <div className="flex gap-1 mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <p className="mb-4 text-lg">"{testimonial.text}"</p>
                    <div>
                      <p className="font-bold">{testimonial.name}</p>
                      <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SEÇÃO 7: PLANOS (CTA PRINCIPAL) */}
      <section id="planos" className="py-20 bg-gradient-to-b from-blue-50 to-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                Escolha Seu Plano
              </h2>
              <p className="text-xl text-muted-foreground">
                30 dias grátis • Cancele quando quiser • Sem compromisso
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {(Object.keys(plans) as Array<keyof typeof plans>).map((key) => {
                const plan = plans[key]
                const Icon = plan.icon
                const isRecommended = "recommended" in plan && plan.recommended

                return (
                  <Card
                    key={key}
                    className={`relative ${
                      isRecommended ? 'border-blue-500 border-2 shadow-xl' : ''
                    }`}
                  >
                    {isRecommended && (
                      <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                        <Badge className="bg-blue-600 text-white px-4 py-1">
                          Mais Popular
                        </Badge>
                      </div>
                    )}

                    <CardContent className="p-8">
                      <div className="text-center mb-6">
                        <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-4">
                          <Icon className="w-8 h-8 text-blue-600" />
                        </div>
                        <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                        <p className="text-muted-foreground mb-4">{plan.description}</p>
                        <div className="text-4xl font-bold">
                          R$ {plan.price}
                          <span className="text-lg text-muted-foreground font-normal">/mês</span>
                        </div>
                      </div>

                      <ul className="space-y-3 mb-8">
                        {plan.features.map((feature, i) => (
                          <li key={i} className="flex items-start gap-2">
                            {feature.startsWith('•') ? (
                              <span className="text-sm text-muted-foreground ml-6">{feature}</span>
                            ) : (
                              <>
                                <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                                <span className="text-sm">{feature}</span>
                              </>
                            )}
                          </li>
                        ))}
                      </ul>

                      <Button
                        className={`w-full ${
                          isRecommended
                            ? 'bg-blue-600 hover:bg-blue-700'
                            : 'bg-slate-800 hover:bg-slate-900'
                        }`}
                        size="lg"
                        asChild
                      >
                        <Link href={`/checkout?product=plataforma-gestao-juridica&plan=${key}`}>
                          Começar Teste Grátis
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* SEÇÃO 8: FAQ */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl font-bold text-center mb-12">
              Perguntas Frequentes
            </h2>

            <div className="space-y-4">
              {[
                {
                  q: 'Quanto tempo demora para configurar?',
                  a: 'Menos de 60 segundos. Você cria conta, personaliza cores/logo e está no ar. Não precisa de conhecimento técnico.',
                },
                {
                  q: 'Preciso ter site próprio?',
                  a: 'Não. Fornecemos uma landing page pronta. Se tiver site, é só copiar/colar um código.',
                },
                {
                  q: 'A IA realmente qualifica bem os leads?',
                  a: 'Sim. Ela faz 103 perguntas especializadas por área do direito e dá um score de 0-100. Você só fala com leads qualificados.',
                },
                {
                  q: 'E se eu quiser cancelar?',
                  a: 'Pode cancelar quando quiser, sem multa. Seu acesso continua até o fim do período pago.',
                },
                {
                  q: 'Vocês atendem todo Brasil?',
                  a: 'Sim. O sistema funciona 100% online para qualquer estado.',
                },
              ].map((faq, i) => (
                <Card key={i}>
                  <CardContent className="p-6">
                    <h3 className="font-bold text-lg mb-2">{faq.q}</h3>
                    <p className="text-muted-foreground">{faq.a}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SEÇÃO 9: CTA FINAL */}
      <section className="py-20 bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Cada minuto que você espera é mais um lead perdido
            </h2>
            <p className="text-xl mb-8 text-blue-100">
              Seus concorrentes já estão usando IA. Não fique para trás.
            </p>

            <Button
              size="lg"
              className="text-lg px-12 py-8 bg-white text-blue-900 hover:bg-blue-50 shadow-2xl"
              asChild
            >
              <Link href="#planos">
                Começar Teste Grátis Agora - 30 Dias
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>

            <div className="flex items-center justify-center gap-6 mt-8 text-sm text-blue-200">
              <span className="flex items-center gap-2">
                <Check className="w-4 h-4" /> Setup em 60 segundos
              </span>
              <span className="flex items-center gap-2">
                <Check className="w-4 h-4" /> Sem cartão de crédito
              </span>
              <span className="flex items-center gap-2">
                <Check className="w-4 h-4" /> Cancele quando quiser
              </span>
            </div>

            <div className="mt-12 pt-8 border-t border-blue-700/30">
              <p className="text-sm text-blue-300">
                Garcez Palha Inteligência Jurídica • 364 anos de tradição jurídica
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* WhatsApp Flutuante */}
      <a
        href="https://wa.me/5521999999999?text=Olá! Quero saber mais sobre a Plataforma de Gestão Jurídica"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 w-16 h-16 bg-green-500 hover:bg-green-600 rounded-full flex items-center justify-center shadow-lg z-50 transition-transform hover:scale-110"
      >
        <MessageCircle className="w-8 h-8 text-white" />
      </a>
    </div>
  )
}
