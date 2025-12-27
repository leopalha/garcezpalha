'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Check, Shield, Clock, Award, ArrowRight, AlertTriangle,
  TrendingUp, Users, Star, Zap, DollarSign, Ban, FileX, Scale
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

export default function BeneficioNegadoPage() {
  const router = useRouter()

  const handleCTA = () => {
    router.push('/checkout?product=beneficio-negado')
  }

  return (
    <div className="min-h-screen">
      <SEOHead
        title="Benefício INSS Negado? Reverta a Decisão | Garcez Palha"
        description="INSS negou aposentadoria, auxílio-doença, BPC? Perícia médica injusta? Advogado especialista reverte 80% das negativas. Recurso administrativo + judicial."
        keywords={[
          'benefício inss negado',
          'inss negou aposentadoria',
          'recurso inss',
          'perícia médica negada',
          'auxílio-doença negado',
          'bpc negado advogado',
          'reverter decisão inss',
          'ação contra inss',
        ]}
        productName="Benefício INSS Negado - Recurso e Reversão"
        price={250000}
        category="previdenciario"
        canonicalUrl="https://garcezpalha.com/solucoes/previdenciario/beneficio-negado"
      />

      <UrgencyBanner
        countdown={true}
        countdownMinutes={15}
        message="URGENTE: Você tem apenas 30 DIAS para recorrer da negativa do INSS"
        discount="RECURSO RÁPIDO"
        onCTA={handleCTA}
        ctaText="REVERTER NEGATIVA AGORA"
      />

      <WhatsAppFloat
        phoneNumber="5521995354010"
        message="INSS negou meu benefício! Preciso recorrer URGENTE antes do prazo acabar!"
        position="bottom-right"
        showTooltip={true}
      />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 dark:from-red-950/20 dark:via-orange-950/20 dark:to-yellow-950/20 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-full mb-6 animate-pulse">
              <AlertTriangle className="h-5 w-5" />
              <span className="font-semibold">30 DIAS PARA RECORRER!</span>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              INSS Negou Seu<br />
              <span className="text-red-600">Benefício Sem Motivo?</span>
            </h1>

            <p className="text-xl text-muted-foreground mb-8">
              Perícia médica <strong className="text-red-600">INJUSTA</strong>, documentos "insuficientes", carência "não cumprida".<br />
              Revertemos 80% das negativas + Você recebe retroativo desde o pedido inicial.
            </p>

            <div className="bg-white dark:bg-gray-900 rounded-lg p-6 mb-8 border-l-4 border-red-600">
              <div className="flex items-start gap-3 text-left">
                <Ban className="h-6 w-6 text-red-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold mb-2 text-red-600">INSS NEGA POR QUALQUER MOTIVO!</h3>
                  <p className="text-muted-foreground">
                    Perícia de 5 minutos nega doença GRAVE. Perito nem olha exames. Exigem documentos que não existem.
                    Dizem que "falta carência" quando você TEM. VOCÊ TEM DIREITO - precisa PROVAR na justiça.
                    Prazo: 30 DIAS para recurso administrativo, senão perde tempo.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-white dark:bg-gray-900 px-4 py-3 rounded-lg border-2 border-red-600">
                <div className="text-3xl font-bold text-red-600">80%</div>
                <div className="text-sm">Taxa de Reversão</div>
              </div>
              <div className="bg-white dark:bg-gray-900 px-4 py-3 rounded-lg border-2 border-orange-600">
                <div className="text-3xl font-bold text-orange-600">6-10m</div>
                <div className="text-sm">Prazo Médio</div>
              </div>
              <div className="bg-white dark:bg-gray-900 px-4 py-3 rounded-lg border-2 border-yellow-600">
                <div className="text-3xl font-bold text-yellow-600">R$ 23M</div>
                <div className="text-sm">Liberados</div>
              </div>
              <div className="bg-white dark:bg-gray-900 px-4 py-3 rounded-lg border-2 border-green-600">
                <div className="text-3xl font-bold text-green-600">100%</div>
                <div className="text-sm">Retroativo</div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-red-600 hover:bg-red-700 text-xl px-10 py-8 font-bold shadow-xl animate-pulse"
                onClick={handleCTA}
              >
                <Zap className="h-6 w-6 mr-2" />
                REVERTER NEGATIVA AGORA
                <ArrowRight className="h-6 w-6 ml-2" />
              </Button>
            </div>

            <p className="mt-4 text-sm text-muted-foreground">
              Recurso Urgente • 80% Taxa de Reversão • Retroativo Garantido
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
                <div className="text-2xl font-bold">R$ 23M</div>
                <div className="text-sm text-muted-foreground">Benefícios Liberados</div>
              </div>
              <div>
                <Users className="h-10 w-10 mx-auto mb-2 text-blue-600" />
                <div className="text-2xl font-bold">980+</div>
                <div className="text-sm text-muted-foreground">Negativas Revertidas</div>
              </div>
              <div>
                <Award className="h-10 w-10 mx-auto mb-2 text-purple-600" />
                <div className="text-2xl font-bold">80%</div>
                <div className="text-sm text-muted-foreground">Taxa de Reversão</div>
              </div>
              <div>
                <Clock className="h-10 w-10 mx-auto mb-2 text-orange-600" />
                <div className="text-2xl font-bold">6-10 meses</div>
                <div className="text-sm text-muted-foreground">Prazo Médio</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <AgitationSection
        problem="INSS NEGOU seu benefício com desculpas ABSURDAS! Perícia de 5 minutos sem olhar exames, exigência de documentos impossíveis, 'falta carência' quando você TEM, qualquer motivo para NÃO PAGAR."
        agitationPoints={[
          'Perícia médica INJUSTA: 5 minutos, perito nem lê seus exames, nega doença GRAVE',
          'INSS exige documentos que NÃO EXISTEM ou são IMPOSSÍVEIS de conseguir',
          'Dizem "falta carência" quando você COMPROVA tempo de contribuição',
          'Negam por "incapacidade temporária" quando você está PERMANENTEMENTE incapaz',
          'Você PRECISA do benefício para SOBREVIVER mas INSS nega sem dó',
          'Cada mês sem benefício = mais dívidas, mais sofrimento, mais desespero',
        ]}
      />

      <SolutionSection
        title="Como Revertemos a Negativa e Conseguimos Seu Benefício"
        subtitle="Estratégia dupla: Recurso administrativo + Ação judicial simultânea para acelerar"
        solutionSteps={[
          'ANÁLISE URGENTE - Verificamos motivo da negativa e chances de reversão (gratuito)',
          'RECURSO ADMINISTRATIVO - Entramos em 30 dias para não perder prazo',
          'AÇÃO JUDICIAL SIMULTÂNEA - Não esperamos INSS demorar, entramos na justiça JÁ',
          'NOVA PERÍCIA JUDICIAL - Perito imparcial, você leva TODOS exames',
          'TUTELA ANTECIPADA - Pedimos liberação do benefício antes da sentença final',
          'RETROATIVO TOTAL - Você recebe TUDO desde a DER (data do pedido inicial)',
        ]}
        onCTA={handleCTA}
      />

      {/* Pricing Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-4">Investimento</h2>
            <p className="text-center text-muted-foreground mb-12">
              Facilidade de pagamento - Parcelado enquanto aguarda benefício
            </p>

            <div className="grid grid-cols-1 md:grid-cols-1 gap-8 max-w-xl mx-auto">
              <Card className="border-4 border-red-600">
                <CardContent className="p-8">
                  <h3 className="text-2xl font-bold mb-4">Pacote Reversão Completa</h3>
                  <div className="mb-6">
                    <span className="text-4xl font-bold">R$ 2.500</span>
                    <span className="text-muted-foreground"> ou 5x R$ 500</span>
                  </div>
                  <ul className="space-y-3 mb-8">
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span>Análise gratuita da negativa</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span>Recurso administrativo (30 dias)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span>Ação judicial simultânea</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span>Nova perícia médica judicial</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span>Pedido de tutela antecipada</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span>Recebimento de retroativo</span>
                    </li>
                  </ul>
                  <div className="bg-red-50 dark:bg-red-950/20 p-4 rounded-lg mb-6">
                    <p className="text-sm font-semibold mb-2">⚡ Facilidade de pagamento:</p>
                    <p className="text-sm text-muted-foreground">
                      Parcelamos em até 5x enquanto você aguarda. Entendemos que se INSS negou,
                      você está sem renda. Nosso objetivo é CONSEGUIR seu benefício.
                    </p>
                  </div>
                  <Button
                    onClick={handleCTA}
                    className="w-full bg-red-600 hover:bg-red-700"
                    size="lg"
                  >
                    REVERTER NEGATIVA AGORA
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
                  <h3 className="font-bold mb-2">Perdi o prazo de 30 dias para recurso. E agora?</h3>
                  <p className="text-muted-foreground">
                    Ainda pode entrar direto com ação judicial! Prazo de recurso administrativo serve para
                    tentar reverter no próprio INSS, mas você SEMPRE pode ir para justiça.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h3 className="font-bold mb-2">Por que fazer recurso E ação ao mesmo tempo?</h3>
                  <p className="text-muted-foreground">
                    Recurso administrativo demora 6-12 MESES. Ação judicial demora 6-10 meses. Se entrar
                    só com recurso, perde 1 ano esperando INSS negar de novo. Fazendo junto, acelera.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h3 className="font-bold mb-2">Como funciona a nova perícia judicial?</h3>
                  <p className="text-muted-foreground">
                    Perito médico judicial é IMPARCIAL (não trabalha pro INSS). Você pode levar TODOS exames,
                    laudos médicos, relatórios. Perícia dura 30-60 minutos (vs 5 min do INSS).
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h3 className="font-bold mb-2">Posso receber benefício antes da sentença final?</h3>
                  <p className="text-muted-foreground">
                    SIM! Com tutela antecipada. Se situação é urgente (doença grave, sem renda), juiz pode
                    mandar INSS liberar benefício ANTES de julgar o mérito. Conseguimos em 40% dos casos.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h3 className="font-bold mb-2">Vou receber os meses que fiquei sem benefício?</h3>
                  <p className="text-muted-foreground">
                    SIM! Você recebe TUDO desde a DER (data do requerimento inicial). Se pediu há 1 ano e
                    INSS negou, ao ganhar você recebe 12 meses retroativos de uma vez.
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
      <section className="py-16 bg-gradient-to-r from-red-600 to-orange-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Não Aceite a Negativa do INSS - Reverta e Receba Seu Benefício
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            80% das negativas são INJUSTAS. Revertemos + Você recebe retroativo.<br />
            Atendimento urgente para não perder prazo.
          </p>
          <Button
            size="lg"
            onClick={handleCTA}
            className="bg-white text-red-600 hover:bg-gray-100 text-xl px-12 py-8 font-bold"
          >
            <Zap className="h-6 w-6 mr-2" />
            REVERTER AGORA - 30 DIAS!
            <ArrowRight className="h-6 w-6 ml-2" />
          </Button>
          <p className="mt-4 text-sm">
            Análise Gratuita • Parcelado 5x • 80% Taxa de Reversão
          </p>
        </div>
      </section>
    </div>
  )
}
