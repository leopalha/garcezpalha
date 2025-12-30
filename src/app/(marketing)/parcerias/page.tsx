'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CheckCircle, TrendingUp, Users, Zap, DollarSign, Target, Award } from 'lucide-react'
import Link from 'next/link'

export default function ParceriasPage() {
  const benefits = [
    {
      icon: DollarSign,
      title: 'Comissões Atrativas',
      description: 'Até 30% de comissão recorrente em cada cliente indicado',
    },
    {
      icon: Target,
      title: 'Leads Qualificados',
      description: 'Sistema de IA qualifica automaticamente os leads para você',
    },
    {
      icon: Zap,
      title: 'Tecnologia Incluída',
      description: 'Acesso à nossa plataforma de automação para seus clientes',
    },
    {
      icon: Users,
      title: 'Suporte Completo',
      description: 'Time dedicado para ajudar você e seus clientes',
    },
    {
      icon: TrendingUp,
      title: 'Crescimento Escalável',
      description: 'Quanto mais você indica, maior sua comissão',
    },
    {
      icon: Award,
      title: 'Marca de Prestígio',
      description: '364 anos de tradição agregando valor à sua marca',
    },
  ]

  const profiles = [
    {
      title: 'Advogados',
      description:
        'Expanda seus serviços oferecendo perícia, avaliação e automação para seus clientes.',
      benefits: [
        'Comissão de 25% nos primeiros 6 meses',
        'Dashboard exclusivo de gestão',
        'Material de marketing personalizado',
        'Treinamento completo incluído',
      ],
    },
    {
      title: 'Peritos',
      description:
        'Ofereça serviços complementares e tecnologia de automação para outros profissionais.',
      benefits: [
        'Comissão de 30% recorrente',
        'Acesso à nossa rede de clientes',
        'Sistema de agendamento compartilhado',
        'Certificação Garcez Palha',
      ],
    },
    {
      title: 'Corretores de Imóveis',
      description:
        'Agregue valor oferecendo avaliação técnica e consultoria jurídica aos seus clientes.',
      benefits: [
        'Comissão de 20% por indicação',
        'Prioridade no atendimento',
        'Material exclusivo para clientes',
        'Selo de parceiro certificado',
      ],
    },
    {
      title: 'Desenvolvedores',
      description: 'Revenda nossa plataforma de automação white-label para outros escritórios.',
      benefits: [
        'Até 40% de comissão',
        'API completa para integração',
        'Customização permitida',
        'Suporte técnico prioritário',
      ],
    },
  ]

  const howItWorks = [
    {
      step: 1,
      title: 'Cadastro',
      description: 'Preencha o formulário e aguarde aprovação (geralmente 24h)',
    },
    {
      step: 2,
      title: 'Treinamento',
      description: 'Participe do treinamento online sobre nossos serviços e plataforma',
    },
    {
      step: 3,
      title: 'Materiais',
      description: 'Receba links personalizados e materiais de divulgação',
    },
    {
      step: 4,
      title: 'Indique',
      description: 'Compartilhe seus links e indique clientes',
    },
    {
      step: 5,
      title: 'Receba',
      description: 'Comissões pagas mensalmente via PIX ou transferência',
    },
  ]

  return (
    <div className="py-16">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h1 className="font-display text-5xl md:text-6xl font-bold mb-6">
            Programa de Parcerias
          </h1>
          <p className="text-xl text-muted-foreground mb-4">
            Seja um parceiro Garcez Palha e ofereça serviços premium com 364 anos de tradição
          </p>
          <p className="text-lg">
            Ganhe comissões recorrentes, acesso à tecnologia de ponta e agregue valor aos seus
            clientes.
          </p>
        </div>

        {/* Benefícios */}
        <div className="max-w-6xl mx-auto mb-16">
          <h2 className="font-display text-3xl font-bold mb-8 text-center">
            Por que ser um parceiro?
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((benefit) => {
              const Icon = benefit.icon
              return (
                <Card key={benefit.title} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <Icon className="w-10 h-10 mb-3 text-primary" />
                    <CardTitle className="font-heading text-xl">{benefit.title}</CardTitle>
                    <CardDescription>{benefit.description}</CardDescription>
                  </CardHeader>
                </Card>
              )
            })}
          </div>
        </div>

        {/* Perfis de Parceiros */}
        <div className="max-w-6xl mx-auto mb-16">
          <h2 className="font-display text-3xl font-bold mb-8 text-center">
            Perfis de Parceiros Ideais
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {profiles.map((profile) => (
              <Card key={profile.title}>
                <CardHeader>
                  <CardTitle className="font-heading text-2xl">{profile.title}</CardTitle>
                  <CardDescription className="text-base">{profile.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {profile.benefits.map((benefit, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <CheckCircle className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" />
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Como Funciona */}
        <div className="max-w-4xl mx-auto mb-16">
          <h2 className="font-display text-3xl font-bold mb-12 text-center">Como Funciona</h2>
          <div className="space-y-6">
            {howItWorks.map((item) => (
              <Card key={item.step}>
                <CardContent className="p-6 flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-xl">
                    {item.step}
                  </div>
                  <div>
                    <h3 className="font-heading text-xl font-bold mb-1">{item.title}</h3>
                    <p className="text-muted-foreground">{item.description}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Comissões */}
        <div className="max-w-4xl mx-auto mb-16">
          <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-secondary/5">
            <CardHeader>
              <CardTitle className="font-display text-3xl text-center">
                Estrutura de Comissões
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center p-6 bg-background rounded-lg">
                  <div className="text-4xl font-bold text-primary mb-2">20-25%</div>
                  <div className="text-sm font-semibold mb-2">Serviços Pontuais</div>
                  <div className="text-xs text-muted-foreground">
                    Perícias, avaliações, consultorias
                  </div>
                </div>
                <div className="text-center p-6 bg-background rounded-lg border-2 border-primary">
                  <div className="text-xs font-semibold text-primary mb-1">RECORRENTE</div>
                  <div className="text-4xl font-bold text-primary mb-2">30-40%</div>
                  <div className="text-sm font-semibold mb-2">Plataforma de Automação</div>
                  <div className="text-xs text-muted-foreground">Comissão mensal recorrente</div>
                </div>
                <div className="text-center p-6 bg-background rounded-lg">
                  <div className="text-4xl font-bold text-secondary mb-2">Bônus</div>
                  <div className="text-sm font-semibold mb-2">Performance</div>
                  <div className="text-xs text-muted-foreground">Metas mensais e trimestrais</div>
                </div>
              </div>

              <div className="text-center space-y-2">
                <p className="text-sm">
                  <strong>Exemplo:</strong> Indicando 10 clientes para automação (R$ 997/mês):
                </p>
                <p className="text-2xl font-bold text-primary">
                  R$ 2.991/mês em comissões recorrentes
                </p>
                <p className="text-xs text-muted-foreground">
                  Comissão de 30% × R$ 997 × 10 clientes = R$ 2.991/mês
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* FAQ */}
        <div className="max-w-4xl mx-auto mb-16">
          <h2 className="font-display text-3xl font-bold mb-8 text-center">
            Perguntas Frequentes
          </h2>
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="font-heading text-lg">Preciso ser advogado?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Não! Aceitamos parceiros de diversas áreas: advogados, peritos, corretores,
                  desenvolvedores, consultores e outros profissionais que tenham contato com nosso
                  público-alvo.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="font-heading text-lg">Como recebo as comissões?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  As comissões são calculadas mensalmente e pagas via PIX ou transferência bancária
                  até o dia 10 do mês seguinte. Você acompanha tudo em tempo real pelo dashboard.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="font-heading text-lg">
                  Há custo para ser parceiro?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Não! O programa de parcerias é 100% gratuito. Você só ganha, nunca paga nada.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="font-heading text-lg">
                  Posso indicar para todo o Brasil?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Sim! Nossa plataforma atende clientes em todo o território nacional. Serviços
                  presenciais são focados no Rio de Janeiro, mas perícias e automação são 100%
                  remotos.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* CTA */}
        <div className="max-w-2xl mx-auto text-center bg-gradient-to-br from-primary/5 to-secondary/5 rounded-2xl p-8">
          <h3 className="font-display text-3xl font-bold mb-4">Pronto para ser um parceiro?</h3>
          <p className="text-muted-foreground mb-6">
            Preencha o formulário de interesse e nossa equipe entrará em contato em até 24 horas.
          </p>
          <Button size="lg" asChild>
            <Link href="/contato">Quero Ser Parceiro</Link>
          </Button>
          <p className="text-sm text-muted-foreground mt-4">
            Ou envie um email para: parcerias@garcezpalha.com
          </p>
        </div>
      </div>
    </div>
  )
}
