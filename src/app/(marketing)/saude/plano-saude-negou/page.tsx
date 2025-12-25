'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Check, Shield, Clock, Award, ArrowRight, AlertTriangle,
  TrendingUp, Users, Star, Zap, FileText, Heart, DollarSign
} from 'lucide-react'
import {
  AgitationSection,
  SolutionSection,
  CredentialsSection,
  GuaranteeSection,
  TestimonialsSection,
  UrgencyBanner,
  WhatsAppFloat,
  SEOHead,
} from '@/components/vsl'

export default function PlanoSaudePage() {
  const router = useRouter()

  const handleCTA = () => {
    router.push('/checkout?product=plano-saude-negou')
  }

  return (
    <div className="min-h-screen">
      <SEOHead
        title="Plano de Saúde Negou? Liminar em 24-72h | Garcez Palha"
        description="Plano negou cirurgia, exame ou tratamento? Revertemos negativas em 24-72h com liminar urgente. Especialistas em ações contra planos de saúde."
        keywords={['plano de saúde negou', 'negativa plano de saúde', 'ação contra plano', 'cirurgia negada', 'tratamento negado', 'liminar plano saúde']}
        productName="Plano de Saúde Negou"
        price={350000}
        category="saude"
        canonicalUrl="https://garcezpalha.com.br/saude/plano-saude-negou"
      />

      <UrgencyBanner
        countdown={true}
        countdownMinutes={60}
        message="🏥 PLANO NEGOU? Liminar em 24-72h para Cirurgia, Exame ou Tratamento"
        discount="CONSULTA GRÁTIS"
        onCTA={handleCTA}
        ctaText="Reverter Negativa Agora"
      />

      <WhatsAppFloat
        phoneNumber="5511999999999"
        message="Olá! Meu plano de saúde negou um procedimento e preciso de ajuda urgente."
        position="bottom-right"
        showTooltip={true}
      />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-rose-50 to-pink-50 dark:from-rose-950/20 dark:to-pink-950/20 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-rose-600 text-white px-4 py-2 rounded-full mb-6">
              <Heart className="h-5 w-5" />
              <span className="font-semibold">Saúde em Primeiro Lugar</span>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Plano de Saúde Negou?<br />
              <span className="text-rose-600">Liminar em 24-72h</span>
            </h1>

            <p className="text-xl text-muted-foreground mb-8">
              Revertemos negativas de planos de saúde com ação judicial urgente.<br />
              Cirurgias, exames, internações e tratamentos autorizados rapidamente.
            </p>

            <div className="bg-white dark:bg-gray-900 rounded-lg p-6 mb-8 border-l-4 border-rose-600">
              <div className="flex items-start gap-3 text-left">
                <AlertTriangle className="h-6 w-6 text-rose-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold mb-2">Negativa Ilegal?</h3>
                  <p className="text-muted-foreground">
                    Na maioria das vezes, a negativa do plano é ILEGAL e pode ser revertida rapidamente
                    com liminar judicial. Você paga mensalidade há anos e tem direito ao procedimento.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-white dark:bg-gray-900 px-4 py-3 rounded-lg border border-rose-200">
                <div className="text-3xl font-bold text-rose-600">24-72h</div>
                <div className="text-sm">Liminar Urgente</div>
              </div>
              <div className="bg-white dark:bg-gray-900 px-4 py-3 rounded-lg border border-rose-200">
                <div className="text-3xl font-bold text-rose-600">600+</div>
                <div className="text-sm">Liminares Obtidas</div>
              </div>
              <div className="bg-white dark:bg-gray-900 px-4 py-3 rounded-lg border border-rose-200">
                <div className="text-3xl font-bold text-rose-600">94%</div>
                <div className="text-sm">Taxa de Sucesso</div>
              </div>
              <div className="bg-white dark:bg-gray-900 px-4 py-3 rounded-lg border border-rose-200">
                <div className="text-3xl font-bold text-rose-600">100%</div>
                <div className="text-sm">Online</div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="text-xl px-10 py-8 font-bold shadow-xl bg-rose-600 hover:bg-rose-700"
                onClick={handleCTA}
              >
                <Heart className="h-6 w-6 mr-2" />
                REVERTER NEGATIVA AGORA
                <ArrowRight className="h-6 w-6 ml-2" />
              </Button>
            </div>

            <p className="mt-4 text-sm text-muted-foreground">
              ⚡ Análise gratuita • Liminar urgente • Atendimento 24/7
            </p>
          </div>
        </div>
      </section>

      {/* Stats & Social Proof */}
      <section className="py-12 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div>
                <Heart className="h-10 w-10 mx-auto mb-2 text-rose-600" />
                <div className="text-2xl font-bold">600+</div>
                <div className="text-sm text-muted-foreground">Liminares Obtidas</div>
              </div>
              <div>
                <Clock className="h-10 w-10 mx-auto mb-2 text-green-600" />
                <div className="text-2xl font-bold">24-72h</div>
                <div className="text-sm text-muted-foreground">Prazo Liminar</div>
              </div>
              <div>
                <TrendingUp className="h-10 w-10 mx-auto mb-2 text-purple-600" />
                <div className="text-2xl font-bold">94%</div>
                <div className="text-sm text-muted-foreground">Taxa de Sucesso</div>
              </div>
              <div>
                <Award className="h-10 w-10 mx-auto mb-2 text-orange-600" />
                <div className="text-2xl font-bold">R$ 12k</div>
                <div className="text-sm text-muted-foreground">Danos Morais Médio</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <AgitationSection
        problem="Plano de saúde negou cirurgia, exame, internação ou tratamento que você precisa urgentemente? Alegou que é experimental, não está coberto ou exigiu carência já cumprida? Isso pode ser ILEGAL."
        agitationPoints={[
          'Cirurgia urgente negada colocando sua saúde em risco',
          'Tratamento necessário recusado sem justificativa válida',
          'Exames essenciais negados mesmo com pedido médico',
          'Internação ou UTI recusada em caso de emergência',
          'Materiais e próteses obrigatórios não autorizados',
          'Carência exigida mesmo já tendo sido cumprida',
        ]}
      />

      <SolutionSection
        title="Como Revertemos a Negativa em 24-72h"
        subtitle="Processo judicial especializado com tutela de urgência"
        solutionSteps={[
          'Análise GRATUITA do caso - Verificamos se a negativa é ilegal',
          'Reunião de documentação - Pedido médico, contrato, carta de negativa',
          'Petição com tutela de urgência - Solicitamos liminar ao juiz plantonista',
          'Liminar concedida em 24-72h - Plano obrigado a autorizar',
          'Acompanhamento da autorização - Garantimos cumprimento imediato',
          'Pedido de danos morais - Indenização por sofrimento (R$ 5-30 mil)',
        ]}
        onCTA={handleCTA}
      />

      {/* Services Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-4">Planos de Ação contra Plano de Saúde</h2>
            <p className="text-center text-muted-foreground mb-12">
              Soluções para diferentes níveis de urgência e complexidade
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Análise */}
              <Card>
                <CardContent className="pt-6">
                  <FileText className="h-12 w-12 text-rose-600 mb-4" />
                  <h3 className="text-2xl font-bold mb-2">Análise Gratuita</h3>
                  <p className="text-muted-foreground mb-4">
                    Avaliação completa da negativa
                  </p>
                  <ul className="space-y-2 mb-6">
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">Análise do contrato</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">Verificação de ilegalidade</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">Estratégia sugerida</span>
                    </li>
                  </ul>
                  <div className="text-2xl font-bold text-rose-600 mb-2">GRÁTIS</div>
                  <Button variant="outline" className="w-full" onClick={handleCTA}>
                    Analisar Meu Caso
                  </Button>
                </CardContent>
              </Card>

              {/* Liminar Urgente */}
              <Card className="border-rose-600 border-2 shadow-lg relative">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="bg-yellow-500 text-white px-4 py-2 rounded-full text-sm font-bold">
                    ⭐ MAIS PROCURADO
                  </span>
                </div>
                <CardContent className="pt-6">
                  <Zap className="h-12 w-12 text-green-600 mb-4" />
                  <h3 className="text-2xl font-bold mb-2">Liminar Urgente</h3>
                  <p className="text-muted-foreground mb-4">
                    Autorização em 24-72h
                  </p>
                  <ul className="space-y-2 mb-6">
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">Tudo da Análise Gratuita</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">Petição com tutela urgente</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">Liminar em 24-72h</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">Acompanhamento autorização</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">100% online</span>
                    </li>
                  </ul>
                  <div className="text-2xl font-bold text-rose-600 mb-1">R$ 2.500</div>
                  <div className="text-sm text-muted-foreground mb-4">ou 12x sem juros</div>
                  <Button className="w-full text-lg bg-rose-600 hover:bg-rose-700" onClick={handleCTA}>
                    <Zap className="h-5 w-5 mr-2" />
                    Obter Liminar
                  </Button>
                </CardContent>
              </Card>

              {/* Completo */}
              <Card>
                <CardContent className="pt-6">
                  <DollarSign className="h-12 w-12 text-purple-600 mb-4" />
                  <h3 className="text-2xl font-bold mb-2">Liminar + Indenização</h3>
                  <p className="text-muted-foreground mb-4">
                    Autorização + danos morais
                  </p>
                  <ul className="space-y-2 mb-6">
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">Tudo da Liminar Urgente</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">Pedido de danos morais</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">R$ 5.000 a R$ 30.000</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">Custas do plano</span>
                    </li>
                  </ul>
                  <div className="text-2xl font-bold text-rose-600 mb-1">R$ 3.500</div>
                  <div className="text-sm text-muted-foreground mb-4">+ 20% da indenização</div>
                  <Button variant="outline" className="w-full" onClick={handleCTA}>
                    Quero Indenização
                  </Button>
                </CardContent>
              </Card>
            </div>

            <div className="mt-8 p-4 bg-rose-50 dark:bg-rose-900/20 rounded-lg border-l-4 border-rose-500">
              <p className="text-sm">
                💡 <strong>Casos Urgentes:</strong> Cirurgias e internações urgentes têm prioridade máxima. Conseguimos liminares em até 12h com juiz plantonista.
              </p>
            </div>
          </div>
        </div>
      </section>

      <CredentialsSection
        lawyerName="Equipe Garcez Palha"
        experience="15+ anos em Direito da Saúde"
        specialization="Especialistas em Ações contra Planos de Saúde"
        stats={{
          years: 15,
          cases: 600,
          successRate: 94,
          clients: 800,
        }}
      />

      <TestimonialsSection />

      <GuaranteeSection
        guaranteeTitle="Liminar em 72h ou Dinheiro de Volta"
        guaranteeDescription="Se não conseguirmos a liminar em até 72h (casos urgentes) ou 5 dias (casos eletivos), devolvemos 100% do valor pago. Nossa taxa de sucesso é de 94%."
        guaranteePeriod="72 horas"
      />

      {/* Final CTA */}
      <section className="py-16 bg-gradient-to-r from-rose-600 to-pink-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Sua Saúde Não Pode Esperar
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Revertemos negativas de planos de saúde em 24-72h com liminar judicial.
            <strong className="block mt-2">600+ liminares obtidas • 94% de sucesso • 100% online</strong>
          </p>
          <Button
            size="lg"
            className="bg-white text-rose-900 hover:bg-gray-100 text-xl px-12 py-8 font-bold shadow-2xl"
            onClick={handleCTA}
          >
            <Heart className="h-6 w-6 mr-2" />
            REVERTER NEGATIVA AGORA
            <ArrowRight className="h-6 w-6 ml-2" />
          </Button>
          <p className="mt-4 text-sm">
            Análise gratuita • Liminar urgente • Resposta em 24h
          </p>
        </div>
      </section>
    </div>
  )
}
