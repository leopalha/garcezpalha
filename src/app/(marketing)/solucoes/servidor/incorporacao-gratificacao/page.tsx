'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Check, Shield, Clock, Award, ArrowRight, AlertTriangle,
  TrendingUp, Users, Star, Zap, DollarSign, Briefcase, Building, TrendingUpIcon
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

export default function IncorporacaoGratificacaoPage() {
  const router = useRouter()

  const handleCTA = () => {
    router.push('/checkout?product=incorporacao-gratificacao')
  }

  return (
    <div className="min-h-screen">
      <SEOHead
        title="Incorporação de Gratificação ao Salário | Garcez Palha"
        description="Servidor público recebe função gratificada por mais de 5 anos? Tem direito a incorporação DEFINITIVA ao salário. Advogado especialista em direito administrativo."
        keywords={[
          'incorporação gratificação',
          'quinquênio função gratificada',
          'servidor público direitos',
          'função gratificada 5 anos',
          'incorporar gratificação salário',
          'advogado servidor público',
          'direito administrativo',
          'aumento salário servidor',
        ]}
        productName="Incorporação de Gratificação"
        price={350000}
        category="servidor"
        canonicalUrl="https://garcezpalha.com/solucoes/servidor/incorporacao-gratificacao"
      />

      <UrgencyBanner
        countdown={true}
        countdownMinutes={30}
        message="ATENÇÃO: Você pode estar perdendo R$ 500-2.000/mês em gratificação não incorporada"
        discount="CÁLCULO GRATUITO"
        onCTA={handleCTA}
        ctaText="CALCULAR INCORPORAÇÃO GRÁTIS"
      />

      <WhatsAppFloat
        phoneNumber="5521995354010"
        message="Sou servidor e recebo função gratificada há mais de 5 anos. Tenho direito a incorporação?"
        position="bottom-right"
        showTooltip={true}
      />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 dark:from-emerald-950/20 dark:via-teal-950/20 dark:to-cyan-950/20 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-full mb-6">
              <Briefcase className="h-5 w-5" />
              <span className="font-semibold">DIREITO DO SERVIDOR</span>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Função Gratificada<br />
              <span className="text-emerald-600">Há Mais de 5 Anos?</span>
            </h1>

            <p className="text-xl text-muted-foreground mb-8">
              Você tem direito a <strong className="text-emerald-600">INCORPORAÇÃO DEFINITIVA</strong> ao salário.<br />
              Quinquênio garante incorporação + Aumento PERMANENTE + Reflexos em aposentadoria.
            </p>

            <div className="bg-white dark:bg-gray-900 rounded-lg p-6 mb-8 border-l-4 border-emerald-600">
              <div className="flex items-start gap-3 text-left">
                <Building className="h-6 w-6 text-emerald-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold mb-2 text-emerald-600">QUINQUÊNIO = INCORPORAÇÃO DEFINITIVA!</h3>
                  <p className="text-muted-foreground">
                    Lei 8.112/90 e jurisprudência STJ garantem: servidor que exerce função gratificada por
                    5 ANOS ININTERRUPTOS tem direito a INCORPORAR a gratificação ao salário DEFINITIVAMENTE.
                    Mesmo que deixe a função, gratificação continua sendo paga. É AUMENTO PERMANENTE!
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-white dark:bg-gray-900 px-4 py-3 rounded-lg border-2 border-emerald-600">
                <div className="text-3xl font-bold text-emerald-600">90%</div>
                <div className="text-sm">Taxa de Sucesso</div>
              </div>
              <div className="bg-white dark:bg-gray-900 px-4 py-3 rounded-lg border-2 border-teal-600">
                <div className="text-3xl font-bold text-teal-600">5 anos</div>
                <div className="text-sm">Quinquênio</div>
              </div>
              <div className="bg-white dark:bg-gray-900 px-4 py-3 rounded-lg border-2 border-cyan-600">
                <div className="text-3xl font-bold text-cyan-600">DEFINITIVO</div>
                <div className="text-sm">Permanente</div>
              </div>
              <div className="bg-white dark:bg-gray-900 px-4 py-3 rounded-lg border-2 border-blue-600">
                <div className="text-3xl font-bold text-blue-600">R$ 12M</div>
                <div className="text-sm">Incorporados</div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-emerald-600 hover:bg-emerald-700 text-xl px-10 py-8 font-bold shadow-xl"
                onClick={handleCTA}
              >
                <TrendingUpIcon className="h-6 w-6 mr-2" />
                CALCULAR INCORPORAÇÃO GRÁTIS
                <ArrowRight className="h-6 w-6 ml-2" />
              </Button>
            </div>

            <p className="mt-4 text-sm text-muted-foreground">
              Cálculo Gratuito • Aumento Definitivo • 90% Taxa de Sucesso
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
                <div className="text-2xl font-bold">R$ 12M</div>
                <div className="text-sm text-muted-foreground">Incorporados</div>
              </div>
              <div>
                <Users className="h-10 w-10 mx-auto mb-2 text-blue-600" />
                <div className="text-2xl font-bold">280+</div>
                <div className="text-sm text-muted-foreground">Servidores Atendidos</div>
              </div>
              <div>
                <Award className="h-10 w-10 mx-auto mb-2 text-purple-600" />
                <div className="text-2xl font-bold">90%</div>
                <div className="text-sm text-muted-foreground">Taxa de Sucesso</div>
              </div>
              <div>
                <Clock className="h-10 w-10 mx-auto mb-2 text-orange-600" />
                <div className="text-2xl font-bold">12-18 meses</div>
                <div className="text-sm text-muted-foreground">Prazo Médio</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <AgitationSection
        problem="Você EXERCE função gratificada (FG, CD, FC) há MAIS DE 5 ANOS, mas administração RETIRA a função e você PERDE o valor! Isso é INJUSTO - quinquênio garante INCORPORAÇÃO DEFINITIVA."
        agitationPoints={[
          'Exerceu função gratificada por 5+ anos ininterruptos (quinquênio)',
          'Administração RETIRA função e gratificação SOME do contracheque',
          'Você PERDE R$ 500-2.000/mês de uma hora para outra',
          'Gratificação deveria ser INCORPORADA ao salário (Lei 8.112/90)',
          'Cada mês sem incorporação = MENOS R$ 500-2.000 no bolso',
          'Sem incorporação, aposentadoria também fica MENOR (perde reflexos)',
        ]}
      />

      <SolutionSection
        title="Como Garantimos a Incorporação Definitiva da Gratificação"
        subtitle="Comprovação do quinquênio + Base legal sólida + Jurisprudência favorável = Incorporação garantida"
        solutionSteps={[
          'ANÁLISE DO QUINQUÊNIO - Verificamos se você completou 5 anos ininterruptos na FG',
          'CÁLCULO DO VALOR - Calculamos quanto você tem direito a incorporar',
          'LEVANTAMENTO PROVAS - Pegamos portarias, contracheques, assentamentos funcionais',
          'AÇÃO JUDICIAL - Pedimos incorporação com base Lei 8.112/90 + STJ',
          'RETROATIVO - Você recebe diferença de quando quinquênio completou',
          'INCORPORAÇÃO DEFINITIVA - Gratificação passa a integrar salário PARA SEMPRE',
        ]}
        onCTA={handleCTA}
      />

      {/* Pricing Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-4">Investimento</h2>
            <p className="text-center text-muted-foreground mb-12">
              Modelo baseado em resultado - Você paga % ao ganhar
            </p>

            <div className="grid grid-cols-1 md:grid-cols-1 gap-8 max-w-xl mx-auto">
              <Card className="border-4 border-emerald-600">
                <CardContent className="p-8">
                  <h3 className="text-2xl font-bold mb-4">Pacote Incorporação FG</h3>
                  <div className="mb-6">
                    <span className="text-4xl font-bold">R$ 3.500</span>
                    <span className="text-muted-foreground"> + 20% retroativo</span>
                  </div>
                  <ul className="space-y-3 mb-8">
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span>Análise gratuita do quinquênio</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span>Cálculo exato do valor a incorporar</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span>Levantamento completo de provas</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span>Ação judicial especializada</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span>Recebimento de retroativo</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span>Incorporação definitiva ao salário</span>
                    </li>
                  </ul>
                  <div className="bg-emerald-50 dark:bg-emerald-950/20 p-4 rounded-lg mb-6">
                    <p className="text-sm font-semibold mb-2">💰 Exemplo real:</p>
                    <p className="text-sm text-muted-foreground">
                      FG: R$ 1.200/mês<br />
                      Retroativo 3 anos: R$ 43.200<br />
                      Você paga: R$ 3.500 + R$ 8.640 (20%) = <strong className="text-emerald-600">R$ 30.560 líquido</strong><br />
                      + R$ 1.200/mês DEFINITIVO no salário<br />
                      + Reflexos em férias, 13º, aposentadoria
                    </p>
                  </div>
                  <Button
                    onClick={handleCTA}
                    className="w-full bg-emerald-600 hover:bg-emerald-700"
                    size="lg"
                  >
                    GARANTIR INCORPORAÇÃO AGORA
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Perguntas Frequentes</h2>

            <div className="space-y-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-bold mb-2">Toda função gratificada pode ser incorporada?</h3>
                  <p className="text-muted-foreground">
                    Sim, SE você exerceu por 5 anos ininterruptos. Vale para FG, FC, CD.
                    Não importa se administração tirou a função - quinquênio garante incorporação.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h3 className="font-bold mb-2">E se troquei de função gratificada nesse período?</h3>
                  <p className="text-muted-foreground">
                    Se foram funções DIFERENTES, conta o tempo de cada uma separadamente.
                    Se foram valores DIFERENTES da MESMA função, conta tempo total. Analisamos seu caso.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h3 className="font-bold mb-2">Preciso estar ainda na função para pedir incorporação?</h3>
                  <p className="text-muted-foreground">
                    NÃO! Pode pedir até DEPOIS de sair da função. O direito nasce quando completa 5 anos.
                    Alguns servidores só descobrem o direito anos depois - ainda podem pedir.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h3 className="font-bold mb-2">A incorporação vale para aposentadoria?</h3>
                  <p className="text-muted-foreground">
                    SIM! Gratificação incorporada ao salário INTEGRA a base de cálculo da aposentadoria.
                    Você se aposenta com o valor MAIOR (salário + gratificação incorporada).
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h3 className="font-bold mb-2">Qual base legal da incorporação?</h3>
                  <p className="text-muted-foreground">
                    Lei 8.112/90 + Súmulas STJ + jurisprudência consolidada. Direito é SÓLIDO.
                    90% das ações ganham. Administração resiste mas justiça reconhece o direito.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <CredentialsSection />
      <GuaranteeSection />
      <TestimonialsSection />

      {/* Final CTA */}
      <section className="py-16 bg-gradient-to-r from-emerald-600 to-teal-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Não Perca Seu Direito - Quinquênio Garante Incorporação Definitiva
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            5 anos de FG = Direito a incorporar PARA SEMPRE.<br />
            Aumento permanente + Reflexos em aposentadoria.
          </p>
          <Button
            size="lg"
            onClick={handleCTA}
            className="bg-white text-emerald-600 hover:bg-gray-100 text-xl px-12 py-8 font-bold"
          >
            <TrendingUpIcon className="h-6 w-6 mr-2" />
            CALCULAR INCORPORAÇÃO GRÁTIS
            <ArrowRight className="h-6 w-6 ml-2" />
          </Button>
          <p className="mt-4 text-sm">
            Cálculo Gratuito • Aumento Definitivo • 90% Taxa de Sucesso
          </p>
        </div>
      </section>
    </div>
  )
}
