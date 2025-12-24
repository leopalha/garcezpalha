'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Check, Shield, Clock, Award, ArrowRight, AlertTriangle,
  TrendingUp, Lock, Users, Star, Zap, DollarSign, Timer
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

export default function GolpePixPage() {
  const router = useRouter()

  const handleCTA = () => {
    router.push('/checkout?product=golpe-pix')
  }

  return (
    <div className="min-h-screen">
      <SEOHead
        title="Golpe do PIX - Recupere Seu Dinheiro em 72h"
        description="Caiu em golpe do PIX? Bloqueio judicial urgente em 24h. 98% de sucesso na recuperação de valores. Advogados especializados em crimes digitais."
        keywords={['golpe pix', 'recuperar dinheiro pix', 'advogado golpe pix', 'bloqueio pix', 'fraude pix']}
        productName="Golpe do PIX - Recuperação"
        price={250000}
        category="financeiro"
        canonicalUrl="https://garcezpalha.com.br/golpe-pix"
      />

      <UrgencyBanner
        countdown={true}
        countdownMinutes={15}
        message="🚨 URGENTE: Cada minuto conta para bloquear o dinheiro!"
        discount="ATENDIMENTO 24H"
        onCTA={handleCTA}
        ctaText="Bloquear Agora - WhatsApp 24h"
      />

      <WhatsAppFloat
        phoneNumber="5511999999999"
        message="URGENTE! Cai em golpe do PIX e preciso bloquear o dinheiro AGORA!"
        position="bottom-right"
        showTooltip={true}
      />

      {/* Hero Section - URGÊNCIA MÁXIMA */}
      <section className="bg-gradient-to-br from-red-600 via-red-500 to-orange-500 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-yellow-400 text-red-900 px-6 py-3 rounded-full mb-6 animate-pulse">
              <Timer className="h-6 w-6" />
              <span className="font-bold text-lg">ATENDIMENTO 24 HORAS - AÇÃO IMEDIATA</span>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold mb-6 drop-shadow-lg">
              Caiu em Golpe do PIX?<br />
              <span className="text-yellow-300">Bloqueamos o Dinheiro em 24 Horas!</span>
            </h1>

            <p className="text-xl md:text-2xl mb-8 text-white/90">
              98% de sucesso em bloqueio judicial urgente.<br />
              Equipe especializada em crimes digitais atua 24/7.
            </p>

            <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 mb-8 border-2 border-yellow-300">
              <div className="flex items-start gap-3 text-left">
                <AlertTriangle className="h-8 w-8 text-yellow-300 flex-shrink-0 mt-1 animate-pulse" />
                <div>
                  <h3 className="font-bold text-xl mb-2 text-yellow-300">⏰ TEMPO É DINHEIRO!</h3>
                  <p className="text-lg">
                    Transferiu por engano? Caiu em golpe? Comprou produto falso?<br />
                    <strong>A cada hora que passa, o golpista move seu dinheiro!</strong><br />
                    Bloqueio judicial URGENTE é a única forma de recuperar.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="bg-white/10 backdrop-blur-sm px-4 py-3 rounded-lg border border-white/20">
                <div className="text-3xl font-bold text-yellow-300">24h</div>
                <div className="text-sm">Bloqueio Judicial</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm px-4 py-3 rounded-lg border border-white/20">
                <div className="text-3xl font-bold text-yellow-300">98%</div>
                <div className="text-sm">Taxa de Bloqueio</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm px-4 py-3 rounded-lg border border-white/20">
                <div className="text-3xl font-bold text-yellow-300">24/7</div>
                <div className="text-sm">Atendimento</div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-yellow-400 text-red-900 hover:bg-yellow-300 text-xl px-10 py-8 font-bold shadow-2xl"
                onClick={handleCTA}
              >
                <Zap className="h-6 w-6 mr-2" />
                BLOQUEAR AGORA - R$ 2.500
                <ArrowRight className="h-6 w-6 ml-2" />
              </Button>
            </div>

            <p className="mt-4 text-sm text-white/80">
              ⚡ Atendimento imediato pelo WhatsApp • Advogados de plantão 24h
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
                <DollarSign className="h-10 w-10 mx-auto mb-2 text-green-600" />
                <div className="text-2xl font-bold">R$ 2.5M+</div>
                <div className="text-sm text-muted-foreground">Recuperado em 2024</div>
              </div>
              <div>
                <Users className="h-10 w-10 mx-auto mb-2 text-blue-600" />
                <div className="text-2xl font-bold">300+</div>
                <div className="text-sm text-muted-foreground">Vítimas Ajudadas</div>
              </div>
              <div>
                <Clock className="h-10 w-10 mx-auto mb-2 text-orange-600" />
                <div className="text-2xl font-bold">18h</div>
                <div className="text-sm text-muted-foreground">Tempo Médio Bloqueio</div>
              </div>
              <div>
                <Award className="h-10 w-10 mx-auto mb-2 text-purple-600" />
                <div className="text-2xl font-bold">98%</div>
                <div className="text-sm text-muted-foreground">Sucesso em Bloqueios</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <AgitationSection
        problem="Cada minuto que passa, o golpista está transferindo seu dinheiro para outras contas. Depois de 72h, a chance de recuperação cai para menos de 20%."
        agitationPoints={[
          'Golpista já está movimentando o dinheiro para contas laranjas',
          'Sem bloqueio judicial, o dinheiro desaparece em horas',
          'Quanto mais você espera, menor a chance de recuperar',
        ]}
      />

      <SolutionSection
        title="Como Bloqueamos e Recuperamos Seu Dinheiro"
        subtitle="Processo jurídico comprovado com 98% de sucesso"
        solutionSteps={[
          'Análise imediata (5 minutos) - Verificamos viabilidade do bloqueio',
          'Petição urgente (24h) - Protocolo judicial com pedido de tutela antecipada',
          'Quebra de sigilo bancário - Rastreamos para onde o dinheiro foi',
          'Bloqueio judicial - Congelamos o valor na conta do golpista',
          'Execução e recuperação - Transferimos o dinheiro de volta para você',
        ]}
        onCTA={handleCTA}
      />

      {/* Pricing Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-4">Investimento</h2>
            <p className="text-center text-muted-foreground mb-12">
              Pagamento facilitado - Prioridade no atendimento
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Bloqueio Urgente */}
              <Card className="border-2">
                <CardContent className="pt-6">
                  <h3 className="text-2xl font-bold mb-2">Bloqueio Urgente</h3>
                  <p className="text-muted-foreground mb-4">Apenas bloqueio</p>
                  <div className="text-4xl font-bold text-primary mb-6">R$ 2.500</div>
                  <ul className="space-y-3 mb-6">
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">Petição urgente</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">Bloqueio em 24-48h</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">Quebra de sigilo bancário</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">Acompanhamento 30 dias</span>
                    </li>
                  </ul>
                  <Button variant="outline" className="w-full" onClick={handleCTA}>
                    Contratar Bloqueio
                  </Button>
                </CardContent>
              </Card>

              {/* Completo - RECOMENDADO */}
              <Card className="border-primary border-2 shadow-lg relative">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="bg-yellow-500 text-white px-4 py-2 rounded-full text-sm font-bold">
                    ⭐ RECOMENDADO
                  </span>
                </div>
                <CardContent className="pt-6">
                  <h3 className="text-2xl font-bold mb-2">Bloqueio + Recuperação</h3>
                  <p className="text-muted-foreground mb-4">Serviço completo</p>
                  <div className="text-4xl font-bold text-primary mb-2">R$ 2.500</div>
                  <div className="text-sm text-muted-foreground mb-4">+ 30% do valor recuperado</div>
                  <ul className="space-y-3 mb-6">
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm font-semibold">Tudo do Bloqueio Urgente</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">Execução para recuperar valores</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">Ação criminal contra golpista</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">Garantia de esforço máximo</span>
                    </li>
                  </ul>
                  <Button className="w-full text-lg" onClick={handleCTA}>
                    <Zap className="h-5 w-5 mr-2" />
                    Contratar Completo
                  </Button>
                </CardContent>
              </Card>
            </div>

            <div className="mt-8 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border-l-4 border-yellow-500">
              <p className="text-sm">
                💡 <strong>Importante:</strong> Quanto mais rápido agir, maior a chance de recuperação.
                Atendemos 24/7 incluindo finais de semana e feriados.
              </p>
            </div>
          </div>
        </div>
      </section>

      <CredentialsSection
        lawyerName="Equipe Garcez Palha"
        experience="Especialistas em crimes digitais"
        specialization="Bloqueio e Recuperação de Valores PIX"
        stats={{
          years: 5,
          cases: 300,
          successRate: 98,
          clients: 250,
        }}
      />

      <TestimonialsSection />

      <GuaranteeSection
        guaranteeTitle="Garantia de Atendimento 24 Horas"
        guaranteeDescription="Plantão jurídico permanente. Atendemos emergências a qualquer hora."
        guaranteePeriod="imediato"
      />

      {/* Final CTA - URGENTE */}
      <section className="py-16 bg-gradient-to-r from-red-600 to-orange-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            ⏰ Não Espere! Cada Minuto Conta
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Golpistas trabalham rápido. Quanto mais você espera, menor a chance de recuperar seu dinheiro.
            <strong className="block mt-2">Atendimento 24 horas • WhatsApp • Ação Imediata</strong>
          </p>
          <Button
            size="lg"
            className="bg-yellow-400 text-red-900 hover:bg-yellow-300 text-xl px-12 py-8 font-bold shadow-2xl"
            onClick={handleCTA}
          >
            <Zap className="h-6 w-6 mr-2" />
            BLOQUEAR MEU DINHEIRO AGORA
            <ArrowRight className="h-6 w-6 ml-2" />
          </Button>
          <p className="mt-4 text-sm">
            Plantão 24h ativa • Resposta em minutos
          </p>
        </div>
      </section>
    </div>
  )
}
