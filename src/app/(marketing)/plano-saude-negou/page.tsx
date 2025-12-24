'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Check, Shield, Clock, Award, ArrowRight, Heart,
  AlertTriangle, Users, Star, Zap, Activity, Ban
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

export default function PlanoSaudeNegouPage() {
  const router = useRouter()

  const handleCTA = () => {
    router.push('/checkout?product=plano-saude-negou')
  }

  return (
    <div className="min-h-screen">
      <SEOHead
        title="Plano de Saúde Negou Tratamento - Liminar em 24-72h"
        description="Plano negou cirurgia, medicamento ou exame? Conseguimos liminar judicial em 24-72h + danos morais. Especialistas em Direito da Saúde."
        keywords={['plano de saúde negou', 'liminar plano saúde', 'advogado saúde', 'cirurgia negada', 'medicamento negado']}
        productName="Plano de Saúde Negou"
        price={350000}
        category="saude"
        canonicalUrl="https://garcezpalha.com.br/plano-saude-negou"
      />

      <UrgencyBanner
        countdown={true}
        countdownMinutes={20}
        message="🚨 URGENTE: Casos de saúde têm prioridade máxima na Justiça!"
        discount="LIMINAR 24-72H"
        onCTA={handleCTA}
        ctaText="Conseguir Liminar Agora"
      />

      <WhatsAppFloat
        phoneNumber="5511999999999"
        message="URGENTE! Meu plano de saúde negou meu tratamento e preciso de liminar judicial."
        position="bottom-right"
        showTooltip={true}
      />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-rose-50 to-pink-50 dark:from-rose-950/20 dark:to-pink-950/20 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-rose-600 text-white px-4 py-2 rounded-full mb-6">
              <Heart className="h-5 w-5" />
              <span className="font-semibold">EMERGÊNCIA MÉDICA - Prioridade Judicial</span>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Plano Negou Seu Tratamento?<br />
              <span className="text-primary">Liminar Judicial em 24-72h</span>
            </h1>

            <p className="text-xl text-muted-foreground mb-8">
              Cirurgia negada? Medicamento não autorizado? Internação recusada?<br />
              Conseguimos liminar judicial obrigando o plano + processo de danos morais.
            </p>

            <div className="bg-white dark:bg-gray-900 rounded-lg p-6 mb-8 border-l-4 border-rose-600">
              <div className="flex items-start gap-3 text-left">
                <Ban className="h-6 w-6 text-rose-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold mb-2">O Plano Negou Algum Destes?</h3>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>❌ Cirurgia que o médico indicou</li>
                    <li>❌ Medicamento de alto custo (oncológico, etc.)</li>
                    <li>❌ Internação em UTI</li>
                    <li>❌ Exame essencial para diagnóstico</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="bg-white dark:bg-gray-900 px-4 py-3 rounded-lg border border-rose-200">
                <div className="text-3xl font-bold text-rose-600">24-72h</div>
                <div className="text-sm">Liminar Concedida</div>
              </div>
              <div className="bg-white dark:bg-gray-900 px-4 py-3 rounded-lg border border-rose-200">
                <div className="text-3xl font-bold text-rose-600">98%</div>
                <div className="text-sm">Taxa de Sucesso</div>
              </div>
              <div className="bg-white dark:bg-gray-900 px-4 py-3 rounded-lg border border-rose-200">
                <div className="text-3xl font-bold text-rose-600">R$ 20k+</div>
                <div className="text-sm">Danos Morais Médio</div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="text-xl px-10 py-8 font-bold shadow-xl bg-rose-600 hover:bg-rose-700"
                onClick={handleCTA}
              >
                <Activity className="h-6 w-6 mr-2" />
                CONSEGUIR LIMINAR AGORA
                <ArrowRight className="h-6 w-6 ml-2" />
              </Button>
            </div>

            <p className="mt-4 text-sm text-muted-foreground">
              ⚡ Atendimento 24h • Protocolo urgente • + ação de danos morais
            </p>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div>
                <Heart className="h-10 w-10 mx-auto mb-2 text-rose-600" />
                <div className="text-2xl font-bold">300+</div>
                <div className="text-sm text-muted-foreground">Liminares Concedidas</div>
              </div>
              <div>
                <Users className="h-10 w-10 mx-auto mb-2 text-blue-600" />
                <div className="text-2xl font-bold">250+</div>
                <div className="text-sm text-muted-foreground">Vidas Salvas</div>
              </div>
              <div>
                <Clock className="h-10 w-10 mx-auto mb-2 text-green-600" />
                <div className="text-2xl font-bold">36h</div>
                <div className="text-sm text-muted-foreground">Tempo Médio</div>
              </div>
              <div>
                <Award className="h-10 w-10 mx-auto mb-2 text-purple-600" />
                <div className="text-2xl font-bold">98%</div>
                <div className="text-sm text-muted-foreground">Sucesso Liminares</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <AgitationSection
        problem="Você ou alguém que você ama está com a saúde em risco porque o plano se recusa a cobrir o tratamento necessário. Cada dia sem tratamento pode ser fatal."
        agitationPoints={[
          'Doença avançando enquanto plano arrasta negativa',
          'Médico já indicou tratamento mas plano inventa desculpas',
          'Você tendo que pagar do bolso valores impossíveis',
          'Risco de sequelas permanentes ou até morte por demora',
        ]}
      />

      <SolutionSection
        title="Como Conseguimos Liminar em 24-72 Horas"
        subtitle="Processo urgente com prioridade máxima na Justiça"
        solutionSteps={[
          'Análise imediata (2 horas) - Avaliamos documentação médica e contrato do plano',
          'Petição urgente - Protocolo com pedido de tutela antecipada fundamentada',
          'Liminar concedida (24-72h) - Juiz obriga plano a cobrir o tratamento IMEDIATAMENTE',
          'Plano é obrigado a cumprir - Descumprimento gera multa diária pesada',
          'Ação de danos morais - Processamos plano pela recusa indevida',
          'Indenização - R$ 10.000 a R$ 50.000 conforme gravidade do caso',
        ]}
        onCTA={handleCTA}
      />

      {/* Pricing */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-4">Investimento</h2>
            <p className="text-center text-muted-foreground mb-12">
              Sua saúde não tem preço. Facilitamos o pagamento.
            </p>

            <Card className="border-primary border-2 shadow-lg relative max-w-xl mx-auto">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                <span className="bg-rose-500 text-white px-4 py-2 rounded-full text-sm font-bold">
                  ⭐ PACOTE COMPLETO
                </span>
              </div>
              <CardContent className="pt-6">
                <h3 className="text-2xl font-bold mb-2">Liminar + Danos Morais</h3>
                <p className="text-muted-foreground mb-4">Obriga plano E processa por danos</p>
                <div className="flex items-baseline gap-2 mb-2">
                  <div className="text-4xl font-bold text-primary">R$ 3.500</div>
                </div>
                <div className="text-lg text-muted-foreground mb-6">ou 4x de R$ 875 + 20% dos danos morais</div>

                <ul className="space-y-3 mb-6">
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-sm">Análise imediata em 2 horas</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-sm">Liminar em 24 a 72 horas</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-sm">Ação de danos morais completa</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-sm">Acompanhamento até sentença final</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-sm">Atendimento 24 horas (casos urgentes)</span>
                  </li>
                </ul>

                <Button className="w-full text-lg py-6" onClick={handleCTA}>
                  <Zap className="h-5 w-5 mr-2" />
                  Contratar Agora - 4x R$ 875
                </Button>
              </CardContent>
            </Card>

            <div className="mt-6 p-4 bg-rose-50 dark:bg-rose-900/20 rounded-lg border-l-4 border-rose-500">
              <p className="text-sm">
                💡 <strong>Urgências médicas:</strong> Atendemos 24 horas incluindo finais de semana.
                Liminar média em 36 horas. Indenizações de R$ 10k a R$ 50k conforme gravidade.
              </p>
            </div>
          </div>
        </div>
      </section>

      <CredentialsSection
        lawyerName="Equipe Garcez Palha"
        experience="Especialistas em Direito da Saúde"
        specialization="Liminares contra Planos de Saúde"
        stats={{
          years: 10,
          cases: 300,
          successRate: 98,
          clients: 250,
        }}
      />

      <TestimonialsSection />

      <GuaranteeSection
        guaranteeTitle="Garantia de Liminar em 72 Horas"
        guaranteeDescription="Se não conseguirmos a liminar em 72h (casos urgentes), devolvemos 100% do valor"
        guaranteePeriod="72 horas"
      />

      {/* Final CTA */}
      <section className="py-16 bg-gradient-to-r from-rose-600 to-pink-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Sua Saúde Não Pode Esperar!
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Conseguimos liminar obrigando o plano em 24-72h + processo de danos morais.
            <strong className="block mt-2">Atendimento 24h • Pagamento Facilitado • 98% Sucesso</strong>
          </p>
          <Button
            size="lg"
            className="bg-white text-rose-900 hover:bg-gray-100 text-xl px-12 py-8 font-bold shadow-2xl"
            onClick={handleCTA}
          >
            <Heart className="h-6 w-6 mr-2" />
            CONSEGUIR LIMINAR AGORA
            <ArrowRight className="h-6 w-6 ml-2" />
          </Button>
          <p className="mt-4 text-sm">
            Mais de 250 vidas salvas • Atendimento imediato 24/7
          </p>
        </div>
      </section>
    </div>
  )
}
