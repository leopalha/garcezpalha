'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Check, Shield, Clock, Award, ArrowRight, AlertTriangle,
  TrendingUp, Users, Star, Zap, DollarSign, Ban, RefreshCw, FileCheck
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

export default function PortabilidadeCreditoPage() {
  const router = useRouter()

  const handleCTA = () => {
    router.push('/checkout?product=portabilidade-credito')
  }

  return (
    <div className="min-h-screen">
      <SEOHead
        title="Portabilidade de Crédito Negada? Advogado Resolve | Garcez Palha"
        description="Banco não deixa fazer portabilidade? Isso é ilegal. Advogado especialista resolve em 30 dias. Portabilidade é seu direito garantido pelo BACEN."
        keywords={[
          'portabilidade crédito negada',
          'banco não deixa portabilidade',
          'advogado bancário',
          'direito portabilidade',
          'resolução bacen 4292',
          'forçar portabilidade',
          'mudar empréstimo banco',
          'portabilidade consignado',
        ]}
        productName="Portabilidade de Crédito Negada"
        price={150000}
        category="bancario"
        canonicalUrl="https://garcezpalha.com/solucoes/bancario/portabilidade-credito"
      />

      <UrgencyBanner
        countdown={true}
        countdownMinutes={15}
        message="URGENTE: Banco está impedindo você de economizar dinheiro"
        discount="RESOLUÇÃO RÁPIDA"
        onCTA={handleCTA}
        ctaText="FORÇAR PORTABILIDADE AGORA"
      />

      <WhatsAppFloat
        phoneNumber="5521995354010"
        message="Banco não deixa fazer portabilidade do meu empréstimo! Preciso de ajuda urgente."
        position="bottom-right"
        showTooltip={true}
      />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-green-950/20 dark:via-emerald-950/20 dark:to-teal-950/20 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-full mb-6 animate-pulse">
              <AlertTriangle className="h-5 w-5" />
              <span className="font-semibold">ILEGAL IMPEDIR PORTABILIDADE</span>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Banco Não Deixa Você<br />
              <span className="text-red-600">Fazer Portabilidade?</span>
            </h1>

            <p className="text-xl text-muted-foreground mb-8">
              Isso é <strong className="text-red-600">ILEGAL</strong>. Portabilidade é seu DIREITO garantido pelo BACEN.<br />
              Resolva em até 30 dias + Indenização se necessário.
            </p>

            <div className="bg-white dark:bg-gray-900 rounded-lg p-6 mb-8 border-l-4 border-red-600">
              <div className="flex items-start gap-3 text-left">
                <Ban className="h-6 w-6 text-red-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold mb-2 text-red-600">BANCO ESTÁ VIOLANDO SEU DIREITO!</h3>
                  <p className="text-muted-foreground">
                    A Resolução BACEN 4.292/2013 garante seu direito à portabilidade. O banco NÃO PODE criar
                    obstáculos, demorar, ou cobrar taxas. Se fizerem isso, estão ILEGALMENTE impedindo você
                    de economizar dinheiro.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-white dark:bg-gray-900 px-4 py-3 rounded-lg border-2 border-green-600">
                <div className="text-3xl font-bold text-green-600">90%</div>
                <div className="text-sm">Taxa de Sucesso</div>
              </div>
              <div className="bg-white dark:bg-gray-900 px-4 py-3 rounded-lg border-2 border-blue-600">
                <div className="text-3xl font-bold text-blue-600">30-60d</div>
                <div className="text-sm">Prazo Médio</div>
              </div>
              <div className="bg-white dark:bg-gray-900 px-4 py-3 rounded-lg border-2 border-orange-600">
                <div className="text-3xl font-bold text-orange-600">100%</div>
                <div className="text-sm">Sem Riscos</div>
              </div>
              <div className="bg-white dark:bg-gray-900 px-4 py-3 rounded-lg border-2 border-purple-600">
                <div className="text-3xl font-bold text-purple-600">R$ 3.2M</div>
                <div className="text-sm">Economizados</div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-green-600 hover:bg-green-700 text-xl px-10 py-8 font-bold shadow-xl"
                onClick={handleCTA}
              >
                <RefreshCw className="h-6 w-6 mr-2" />
                FORÇAR PORTABILIDADE AGORA
                <ArrowRight className="h-6 w-6 ml-2" />
              </Button>
            </div>

            <p className="mt-4 text-sm text-muted-foreground">
              Resolução Rápida • 90% Taxa de Sucesso • Sem Riscos
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
                <div className="text-2xl font-bold">R$ 3.2M</div>
                <div className="text-sm text-muted-foreground">Economizados</div>
              </div>
              <div>
                <Users className="h-10 w-10 mx-auto mb-2 text-blue-600" />
                <div className="text-2xl font-bold">180+</div>
                <div className="text-sm text-muted-foreground">Casos Resolvidos</div>
              </div>
              <div>
                <Award className="h-10 w-10 mx-auto mb-2 text-purple-600" />
                <div className="text-2xl font-bold">90%</div>
                <div className="text-sm text-muted-foreground">Taxa de Sucesso</div>
              </div>
              <div>
                <Clock className="h-10 w-10 mx-auto mb-2 text-orange-600" />
                <div className="text-2xl font-bold">30-60 dias</div>
                <div className="text-sm text-muted-foreground">Prazo Médio</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <AgitationSection
        problem="O banco está ILEGALMENTE criando obstáculos para impedir sua portabilidade! Eles não querem perder seu contrato (e os juros altos que estão ganhando com você)."
        agitationPoints={[
          'Banco diz que "não é possível" fazer portabilidade (MENTIRA - é direito seu!)',
          'Pedem documentos intermináveis que não existem (TÁTICA de impedimento)',
          'Demoram semanas para responder (BACEN determina 5 DIAS ÚTEIS)',
          'Cobram "taxa" para liberar portabilidade (ILEGAL - não podem cobrar)',
          'Você PERDE dinheiro TODO MÊS enquanto banco enrola e não libera',
          'Quanto mais tempo banco demora, mais juros ABUSIVOS você paga',
        ]}
      />

      <SolutionSection
        title="Como Forçamos o Banco a Liberar Sua Portabilidade"
        subtitle="Estratégia jurídica especializada com base na Resolução BACEN 4.292/2013"
        solutionSteps={[
          'NOTIFICAÇÃO FORMAL - Enviamos ao banco com prazo de 5 DIAS para liberar',
          'RECLAMAÇÃO BACEN - Acionamos Banco Central se banco não cumprir prazo',
          'AÇÃO JUDICIAL - Se necessário, obrigamos judicialmente a portabilidade',
          'INDENIZAÇÃO - Pedimos danos morais pelo transtorno e impedimento ilegal',
          'ACOMPANHAMENTO - Monitoramos até portabilidade estar 100% concluída',
          'ECONOMIA GARANTIDA - Você finalmente paga juros menores no novo banco',
        ]}
        onCTA={handleCTA}
      />

      {/* Pricing Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-4">Investimento</h2>
            <p className="text-center text-muted-foreground mb-12">
              Valor fixo - Maioria resolve SEM processo judicial
            </p>

            <div className="grid grid-cols-1 md:grid-cols-1 gap-8 max-w-xl mx-auto">
              <Card className="border-4 border-green-600">
                <CardContent className="p-8">
                  <h3 className="text-2xl font-bold mb-4">Pacote Portabilidade Negada</h3>
                  <div className="mb-6">
                    <span className="text-4xl font-bold">R$ 1.500</span>
                    <span className="text-muted-foreground"> ou 3x R$ 500</span>
                  </div>
                  <ul className="space-y-3 mb-8">
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span>Notificação formal ao banco</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span>Reclamação ao BACEN</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span>Ação judicial (se necessário)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span>Pedido de danos morais</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span>Acompanhamento até conclusão</span>
                    </li>
                  </ul>
                  <div className="bg-green-50 dark:bg-green-950/20 p-4 rounded-lg mb-6">
                    <p className="text-sm font-semibold mb-2">⚡ Resolução rápida:</p>
                    <p className="text-sm text-muted-foreground">
                      80% dos casos resolvem com notificação + BACEN em até 15 dias.
                      Banco não quer problema com Banco Central.
                    </p>
                  </div>
                  <Button
                    onClick={handleCTA}
                    className="w-full bg-green-600 hover:bg-green-700"
                    size="lg"
                  >
                    FORÇAR PORTABILIDADE AGORA
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
                  <h3 className="font-bold mb-2">O banco pode me impedir de fazer portabilidade?</h3>
                  <p className="text-muted-foreground">
                    NÃO! A Resolução BACEN 4.292/2013 garante seu direito à portabilidade. O banco
                    TEM que liberar em até 5 dias úteis. Qualquer obstáculo é ILEGAL.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h3 className="font-bold mb-2">O banco pode cobrar taxa para liberar?</h3>
                  <p className="text-muted-foreground">
                    NÃO! Portabilidade é GRATUITA por lei. O banco não pode cobrar NADA para liberar.
                    Se cobrarem, é mais uma ilegalidade que aumenta indenização.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h3 className="font-bold mb-2">Quanto tempo demora para resolver?</h3>
                  <p className="text-muted-foreground">
                    Média 30-60 dias. Com notificação formal + reclamação BACEN, 80% resolvem em 15 dias.
                    Casos que vão para justiça levam até 60 dias.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h3 className="font-bold mb-2">Posso receber indenização?</h3>
                  <p className="text-muted-foreground">
                    SIM! Se o banco criou obstáculos ilegais, você tem direito a danos morais pelo transtorno.
                    Valores variam conforme gravidade da negativa.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h3 className="font-bold mb-2">E se o banco já negou várias vezes?</h3>
                  <p className="text-muted-foreground">
                    Melhor ainda! Cada negativa ilegal é prova do abuso. Isso fortalece seu caso e aumenta
                    chances de indenização maior. Guarde TODOS os protocolos.
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
      <section className="py-16 bg-gradient-to-r from-green-600 to-emerald-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Não Deixe o Banco Te Impedir de Economizar Dinheiro
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Portabilidade é SEU DIREITO. Banco que nega está violando a lei.<br />
            Resolva em até 30 dias e comece a pagar juros menores.
          </p>
          <Button
            size="lg"
            onClick={handleCTA}
            className="bg-white text-green-600 hover:bg-gray-100 text-xl px-12 py-8 font-bold"
          >
            <RefreshCw className="h-6 w-6 mr-2" />
            FORÇAR PORTABILIDADE AGORA
            <ArrowRight className="h-6 w-6 ml-2" />
          </Button>
          <p className="mt-4 text-sm">
            Resolução Rápida • 90% Taxa de Sucesso • Sem Riscos
          </p>
        </div>
      </section>
    </div>
  )
}
