'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Check, Shield, Clock, Award, ArrowRight, AlertTriangle,
  TrendingUp, Users, Star, Zap, DollarSign, AlertOctagon, PhoneCall, BanIcon
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

export default function FraudeConsignadoPage() {
  const router = useRouter()

  const handleCTA = () => {
    router.push('/checkout?product=fraude-consignado')
  }

  return (
    <div className="min-h-screen">
      <SEOHead
        title="Fraude em Empréstimo Consignado | Cancele e Recupere | Garcez Palha"
        description="Fizeram empréstimo no seu nome sem você saber? É CRIME! Cancele o empréstimo + Pare descontos + Recupere tudo + Indenização. Atendimento de emergência."
        keywords={[
          'fraude empréstimo consignado',
          'empréstimo que não fiz',
          'desconto inss não reconheço',
          'golpe consignado advogado',
          'cancelar empréstimo fraudulento',
          'fraude consignado aposentado',
          'empréstimo no meu nome',
          'desconto indevido salário',
        ]}
        productName="Fraude em Empréstimo Consignado"
        price={250000}
        category="bancario"
        canonicalUrl="https://garcezpalha.com/solucoes/bancario/fraude-consignado"
      />

      <UrgencyBanner
        countdown={true}
        countdownMinutes={30}
        message="EMERGÊNCIA: Pare os descontos fraudulentos AGORA - Atendimento em 2 HORAS"
        discount="LIMINAR URGENTE"
        onCTA={handleCTA}
        ctaText="PARAR DESCONTOS AGORA"
      />

      <WhatsAppFloat
        phoneNumber="5521995354010"
        message="URGENTE: Descobri desconto no meu benefício de empréstimo que NUNCA pedi! Preciso parar isso AGORA!"
        position="bottom-right"
        showTooltip={true}
      />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-red-50 via-orange-50 to-red-100 dark:from-red-950/30 dark:via-orange-950/30 dark:to-red-950/30 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-red-700 text-white px-4 py-2 rounded-full mb-6 animate-pulse">
              <AlertOctagon className="h-5 w-5" />
              <span className="font-semibold">ATENDIMENTO DE EMERGÊNCIA</span>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Fizeram Empréstimo<br />
              <span className="text-red-600">No Seu Nome Sem Você Saber?</span>
            </h1>

            <p className="text-xl text-muted-foreground mb-8">
              Isso é <strong className="text-red-600">CRIME e FRAUDE BANCÁRIA</strong>.<br />
              Cancele IMEDIATO + Pare os descontos + Recupere TUDO + Indenização de R$ 5k-15k.
            </p>

            <div className="bg-white dark:bg-gray-900 rounded-lg p-6 mb-8 border-l-4 border-red-600">
              <div className="flex items-start gap-3 text-left">
                <AlertOctagon className="h-6 w-6 text-red-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold mb-2 text-red-600">VOCÊ É A VÍTIMA - O BANCO É RESPONSÁVEL!</h3>
                  <p className="text-muted-foreground">
                    Golpistas usaram seus dados para fazer empréstimo consignado. Você NÃO assinou, NÃO recebeu
                    o dinheiro, mas está PAGANDO todo mês! STJ é claro: banco responde OBJETIVAMENTE por fraudes.
                    Você tem direito a cancelamento + devolução TOTAL + indenização.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-white dark:bg-gray-900 px-4 py-3 rounded-lg border-2 border-red-600">
                <div className="text-3xl font-bold text-red-600">80%</div>
                <div className="text-sm">Taxa de Sucesso</div>
              </div>
              <div className="bg-white dark:bg-gray-900 px-4 py-3 rounded-lg border-2 border-orange-600">
                <div className="text-3xl font-bold text-orange-600">5-15 dias</div>
                <div className="text-sm">Liminar Média</div>
              </div>
              <div className="bg-white dark:bg-gray-900 px-4 py-3 rounded-lg border-2 border-yellow-600">
                <div className="text-3xl font-bold text-yellow-600">R$ 8.7M</div>
                <div className="text-sm">Recuperados</div>
              </div>
              <div className="bg-white dark:bg-gray-900 px-4 py-3 rounded-lg border-2 border-green-600">
                <div className="text-3xl font-bold text-green-600">2h</div>
                <div className="text-sm">Tempo Resposta</div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-red-600 hover:bg-red-700 text-xl px-10 py-8 font-bold shadow-xl animate-pulse"
                onClick={handleCTA}
              >
                <Zap className="h-6 w-6 mr-2" />
                PARAR DESCONTOS AGORA
                <ArrowRight className="h-6 w-6 ml-2" />
              </Button>
            </div>

            <p className="mt-4 text-sm text-muted-foreground">
              Atendimento em 2h • Liminar em 5-15 dias • 80% Taxa de Sucesso
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
                <div className="text-2xl font-bold">R$ 8.7M</div>
                <div className="text-sm text-muted-foreground">Recuperados</div>
              </div>
              <div>
                <Users className="h-10 w-10 mx-auto mb-2 text-blue-600" />
                <div className="text-2xl font-bold">420+</div>
                <div className="text-sm text-muted-foreground">Vítimas Ajudadas</div>
              </div>
              <div>
                <Award className="h-10 w-10 mx-auto mb-2 text-purple-600" />
                <div className="text-2xl font-bold">80%</div>
                <div className="text-sm text-muted-foreground">Taxa de Sucesso</div>
              </div>
              <div>
                <Clock className="h-10 w-10 mx-auto mb-2 text-orange-600" />
                <div className="text-2xl font-bold">5-15 dias</div>
                <div className="text-sm text-muted-foreground">Liminar Média</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <AgitationSection
        problem="Você descobriu um DESCONTO no seu salário ou benefício de um empréstimo que NUNCA pediu! Golpistas usaram seus dados e o banco LIBEROU sem verificar. Agora VOCÊ está pagando uma dívida que NÃO É SUA!"
        agitationPoints={[
          'Desconto TODO MÊS no seu salário/benefício que você PRECISA para VIVER',
          'Você NÃO viu esse dinheiro - foi para conta de golpista/laranja',
          'Banco diz que você "assinou" mas você SABE que não assinou NADA',
          'Pode ser R$ 600-800/mês descontando por 84 meses = R$ 50.400+ roubados!',
          'Vítima mais comum: APOSENTADOS e IDOSOS (alvos preferidos dos golpistas)',
          'Banco ganha comissão do empréstimo fraudulento e não quer devolver',
        ]}
      />

      <SolutionSection
        title="Como Paramos os Descontos e Recuperamos Seu Dinheiro"
        subtitle="Súmula 479 STJ: Banco responde OBJETIVAMENTE por fraudes - Você NÃO paga dívida fraudulenta"
        solutionSteps={[
          'ATENDIMENTO URGENTE - Resposta em até 2 HORAS para casos de emergência',
          'BOLETIM + CONTESTAÇÃO - Orientamos fazer B.O. e contestar no banco imediatamente',
          'LIMINAR URGENTE - Ação com pedido de tutela para PARAR descontos em 5-15 dias',
          'CANCELAMENTO TOTAL - Empréstimo fraudulento declarado NULO (dívida NÃO é sua)',
          'DEVOLUÇÃO INTEGRAL - Banco devolve TUDO que foi descontado indevidamente',
          'INDENIZAÇÃO ALTA - R$ 5.000 a R$ 15.000 por danos morais (idosos recebem mais)',
        ]}
        onCTA={handleCTA}
      />

      {/* Pricing Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-4">Investimento</h2>
            <p className="text-center text-muted-foreground mb-12">
              Facilidade para aposentados - Entrada baixa + saldo após ganhar
            </p>

            <div className="grid grid-cols-1 md:grid-cols-1 gap-8 max-w-xl mx-auto">
              <Card className="border-4 border-red-600">
                <CardContent className="p-8">
                  <h3 className="text-2xl font-bold mb-4">Pacote Fraude Consignado</h3>
                  <div className="mb-6">
                    <span className="text-4xl font-bold">R$ 2.500</span>
                    <span className="text-muted-foreground"> + 30% recuperado</span>
                  </div>
                  <ul className="space-y-3 mb-8">
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span>Atendimento de emergência (2h resposta)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span>Orientação B.O. + contestação banco</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span>Ação com liminar urgente</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span>Suspensão dos descontos</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span>Cancelamento do empréstimo</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span>Devolução de valores</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span>Danos morais R$ 5k-15k</span>
                    </li>
                  </ul>
                  <div className="bg-red-50 dark:bg-red-950/20 p-4 rounded-lg mb-6">
                    <p className="text-sm font-semibold mb-2">💰 Facilidade para aposentados:</p>
                    <p className="text-sm text-muted-foreground">
                      Entrada de apenas R$ 500 + restante quando receber a indenização.
                      Entendemos que se você está nessa situação, dinheiro está curto.
                    </p>
                  </div>
                  <Button
                    onClick={handleCTA}
                    className="w-full bg-red-600 hover:bg-red-700"
                    size="lg"
                  >
                    PARAR DESCONTOS AGORA
                  </Button>
                </CardContent>
              </Card>
            </div>

            <div className="mt-8 bg-yellow-50 dark:bg-yellow-950/20 p-6 rounded-lg border-l-4 border-yellow-600 max-w-xl mx-auto">
              <h3 className="font-bold mb-2">⚡ Exemplo real:</h3>
              <p className="text-sm text-muted-foreground">
                Desconto: R$ 800/mês × 12 meses = R$ 9.600 descontados<br />
                Devolução: R$ 9.600 + Indenização: R$ 8.000 = <strong className="text-yellow-600">R$ 17.600</strong><br />
                Você paga: R$ 2.500 + R$ 5.280 (30%) = <strong>R$ 9.820 líquido</strong>
              </p>
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
                  <h3 className="font-bold mb-2">Como sei se é fraude ou se eu esqueci?</h3>
                  <p className="text-muted-foreground">
                    Se você NÃO reconhece a contratação, NÃO recebeu o dinheiro, e NÃO assinou NADA,
                    É FRAUDE. O banco tem que PROVAR que foi você quem contratou. Ônus da prova é deles.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h3 className="font-bold mb-2">Preciso fazer Boletim de Ocorrência?</h3>
                  <p className="text-muted-foreground">
                    RECOMENDAMOS SIM! B.O. fortalece a prova de que você é vítima de crime. Mas podemos
                    entrar com ação mesmo sem B.O. - orientamos você no processo.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h3 className="font-bold mb-2">O banco diz que tenho que pagar...</h3>
                  <p className="text-muted-foreground">
                    O banco vai dizer MUITA coisa para não devolver. Mas a lei é CLARA: se foi fraude,
                    VOCÊ NÃO DEVE NADA. Súmula 479 STJ garante isso. NÃO pague. NÃO aceite acordo.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h3 className="font-bold mb-2">Quanto tempo para parar os descontos?</h3>
                  <p className="text-muted-foreground">
                    Com LIMINAR, em média 5-15 dias. Alguns juízes concedem em 48 HORAS em casos urgentes
                    (idosos, necessidade do benefício para sobrevivência).
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h3 className="font-bold mb-2">E se já descontaram muito?</h3>
                  <p className="text-muted-foreground">
                    Pedimos devolução de TUDO que foi descontado indevidamente, corrigido monetariamente,
                    MAIS danos morais de R$ 5.000 a R$ 15.000. Quanto mais desconto, maior a indenização.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <CredentialsSection />
      <GuaranteeSection />
      <TestimonialsSection category="bancario" />

      {/* Final CTA */}
      <section className="py-16 bg-gradient-to-r from-red-600 to-orange-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Não Continue Pagando Por Um Empréstimo Que Você Nunca Fez
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Você é a VÍTIMA. Banco é RESPONSÁVEL.<br />
            Pare os descontos AGORA + Recupere TUDO + Ganhe indenização.
          </p>
          <Button
            size="lg"
            onClick={handleCTA}
            className="bg-white text-red-600 hover:bg-gray-100 text-xl px-12 py-8 font-bold"
          >
            <Zap className="h-6 w-6 mr-2" />
            ATENDIMENTO DE EMERGÊNCIA
            <PhoneCall className="h-6 w-6 ml-2" />
          </Button>
          <p className="mt-4 text-sm">
            Resposta em 2h • Liminar 5-15 dias • Facilidade para Aposentados
          </p>
        </div>
      </section>
    </div>
  )
}
