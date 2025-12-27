'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Check, Shield, Clock, Award, ArrowRight, AlertTriangle,
  TrendingUp, Users, Star, Zap, DollarSign, Heart, Activity, Ambulance
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

export default function AuxilioAcidentePage() {
  const router = useRouter()

  const handleCTA = () => {
    router.push('/checkout?product=auxilio-acidente')
  }

  return (
    <div className="min-h-screen">
      <SEOHead
        title="Auxílio-Acidente: Garanta Seu Direito | Garcez Palha"
        description="Sofreu acidente e ficou com sequela? Tem direito a auxílio-acidente de 50% do salário VITALÍCIO. INSS nega? Advogado especialista garante seu direito."
        keywords={[
          'auxílio-acidente',
          'sequela acidente trabalho',
          'indenização acidente',
          'auxílio-acidente negado',
          'redução capacidade laboral',
          'benefício vitalício inss',
          'advogado acidente trabalho',
          'perícia acidente',
        ]}
        productName="Auxílio-Acidente INSS"
        price={200000}
        category="previdenciario"
        canonicalUrl="https://garcezpalha.com/solucoes/previdenciario/auxilio-acidente"
      />

      <UrgencyBanner
        countdown={true}
        countdownMinutes={25}
        message="IMPORTANTE: Auxílio-acidente é VITALÍCIO - você recebe para sempre"
        discount="ANÁLISE GRATUITA"
        onCTA={handleCTA}
        ctaText="GARANTIR MEU DIREITO AGORA"
      />

      <WhatsAppFloat
        phoneNumber="5521995354010"
        message="Tive acidente e fiquei com sequela permanente. Tenho direito a auxílio-acidente?"
        position="bottom-right"
        showTooltip={true}
      />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50 dark:from-purple-950/20 dark:via-pink-950/20 dark:to-rose-950/20 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-full mb-6">
              <Activity className="h-5 w-5" />
              <span className="font-semibold">BENEFÍCIO VITALÍCIO</span>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Ficou com Sequela<br />
              <span className="text-purple-600">de Acidente de Trabalho?</span>
            </h1>

            <p className="text-xl text-muted-foreground mb-8">
              Você tem direito a <strong className="text-purple-600">AUXÍLIO-ACIDENTE VITALÍCIO</strong>.<br />
              50% do salário-benefício para SEMPRE + Acumula com salário.
            </p>

            <div className="bg-white dark:bg-gray-900 rounded-lg p-6 mb-8 border-l-4 border-purple-600">
              <div className="flex items-start gap-3 text-left">
                <Heart className="h-6 w-6 text-purple-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold mb-2 text-purple-600">AUXÍLIO-ACIDENTE É SEU DIREITO!</h3>
                  <p className="text-muted-foreground">
                    Se acidente de trabalho (ou trajeto) deixou sequela PERMANENTE que reduz sua capacidade,
                    você TEM DIREITO a auxílio-acidente. É 50% do salário-benefício, VITALÍCIO, e ACUMULA
                    com seu salário. INSS nega muito, mas 75% das ações ganham na justiça.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-white dark:bg-gray-900 px-4 py-3 rounded-lg border-2 border-purple-600">
                <div className="text-3xl font-bold text-purple-600">75%</div>
                <div className="text-sm">Taxa de Sucesso</div>
              </div>
              <div className="bg-white dark:bg-gray-900 px-4 py-3 rounded-lg border-2 border-pink-600">
                <div className="text-3xl font-bold text-pink-600">50%</div>
                <div className="text-sm">do Salário</div>
              </div>
              <div className="bg-white dark:bg-gray-900 px-4 py-3 rounded-lg border-2 border-rose-600">
                <div className="text-3xl font-bold text-rose-600">VITALÍCIO</div>
                <div className="text-sm">Para Sempre</div>
              </div>
              <div className="bg-white dark:bg-gray-900 px-4 py-3 rounded-lg border-2 border-orange-600">
                <div className="text-3xl font-bold text-orange-600">R$ 6.8M</div>
                <div className="text-sm">Concedidos</div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-purple-600 hover:bg-purple-700 text-xl px-10 py-8 font-bold shadow-xl"
                onClick={handleCTA}
              >
                <Activity className="h-6 w-6 mr-2" />
                GARANTIR MEU DIREITO AGORA
                <ArrowRight className="h-6 w-6 ml-2" />
              </Button>
            </div>

            <p className="mt-4 text-sm text-muted-foreground">
              Análise Gratuita • Benefício Vitalício • 75% Taxa de Sucesso
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
                <div className="text-2xl font-bold">R$ 6.8M</div>
                <div className="text-sm text-muted-foreground">Concedidos</div>
              </div>
              <div>
                <Users className="h-10 w-10 mx-auto mb-2 text-blue-600" />
                <div className="text-2xl font-bold">340+</div>
                <div className="text-sm text-muted-foreground">Benefícios Garantidos</div>
              </div>
              <div>
                <Award className="h-10 w-10 mx-auto mb-2 text-purple-600" />
                <div className="text-2xl font-bold">75%</div>
                <div className="text-sm text-muted-foreground">Taxa de Sucesso</div>
              </div>
              <div>
                <Clock className="h-10 w-10 mx-auto mb-2 text-orange-600" />
                <div className="text-2xl font-bold">10-16 meses</div>
                <div className="text-sm text-muted-foreground">Prazo Médio</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <AgitationSection
        problem="Você sofreu ACIDENTE DE TRABALHO, ficou com SEQUELA PERMANENTE, mas INSS NEGOU auxílio-acidente dizendo que 'sequela não é grave' ou 'não reduz capacidade'. Isso é INJUSTO!"
        agitationPoints={[
          'Sofreu acidente no trabalho ou no trajeto (ida/volta) e ficou com sequela',
          'Sequela PERMANENTE: dor crônica, limitação movimento, perda auditiva, cicatriz',
          'INSS nega dizendo que "sequela é leve" (MAS é permanente e atrapalha!)',
          'Perícia de 5 minutos não avalia REAL impacto da sequela no seu trabalho',
          'Você PERDE 50% do salário TODO MÊS pelo resto da vida se não lutar',
          'Auxílio-acidente ACUMULA com salário - é dinheiro extra VITALÍCIO',
        ]}
      />

      <SolutionSection
        title="Como Garantimos Seu Auxílio-Acidente Vitalício"
        subtitle="Prova da sequela + Perícia técnica + Nexo causal = Benefício concedido"
        solutionSteps={[
          'ANÁLISE GRATUITA - Verificamos se sequela dá direito a auxílio-acidente',
          'COLETA DE PROVAS - Laudos médicos, exames, CAT, atestados comprovando sequela',
          'ESTABELECER NEXO - Provamos que sequela foi CAUSADA pelo acidente de trabalho',
          'AÇÃO JUDICIAL - Pedimos concessão do auxílio-acidente com base técnica',
          'PERÍCIA JUDICIAL - Perito avalia REAL impacto da sequela na capacidade',
          'BENEFÍCIO VITALÍCIO - Auxílio concedido para SEMPRE + retroativo desde DER',
        ]}
        onCTA={handleCTA}
      />

      {/* Pricing Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-4">Investimento</h2>
            <p className="text-center text-muted-foreground mb-12">
              Modelo híbrido - Entrada baixa + percentual ao ganhar
            </p>

            <div className="grid grid-cols-1 md:grid-cols-1 gap-8 max-w-xl mx-auto">
              <Card className="border-4 border-purple-600">
                <CardContent className="p-8">
                  <h3 className="text-2xl font-bold mb-4">Pacote Auxílio-Acidente</h3>
                  <div className="mb-6">
                    <span className="text-4xl font-bold">R$ 2.000</span>
                    <span className="text-muted-foreground"> + 20% retroativo</span>
                  </div>
                  <ul className="space-y-3 mb-8">
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span>Análise gratuita da sequela</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span>Coleta completa de provas médicas</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span>Estabelecimento de nexo causal</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span>Ação judicial completa</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span>Acompanhamento perícia judicial</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span>Benefício vitalício + retroativo</span>
                    </li>
                  </ul>
                  <div className="bg-purple-50 dark:bg-purple-950/20 p-4 rounded-lg mb-6">
                    <p className="text-sm font-semibold mb-2">💰 Exemplo real:</p>
                    <p className="text-sm text-muted-foreground">
                      Salário-benefício: R$ 3.000<br />
                      Auxílio-acidente: R$ 1.500/mês (50%) VITALÍCIO<br />
                      Retroativo 2 anos: R$ 36.000<br />
                      Você paga: R$ 2.000 + R$ 7.200 (20%) = <strong className="text-purple-600">R$ 26.800 líquido</strong><br />
                      + R$ 1.500/mês para SEMPRE
                    </p>
                  </div>
                  <Button
                    onClick={handleCTA}
                    className="w-full bg-purple-600 hover:bg-purple-700"
                    size="lg"
                  >
                    GARANTIR AUXÍLIO-ACIDENTE AGORA
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
                  <h3 className="font-bold mb-2">Toda sequela dá direito a auxílio-acidente?</h3>
                  <p className="text-muted-foreground">
                    Não. Sequela precisa ser PERMANENTE (definitiva) e REDUZIR capacidade laboral.
                    Sequelas temporárias não dão direito. Fazemos análise gratuita do seu caso.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h3 className="font-bold mb-2">Auxílio-acidente acumula com salário?</h3>
                  <p className="text-muted-foreground">
                    SIM! É diferente de auxílio-doença (que substitui salário). Auxílio-acidente SOMA
                    com seu salário. Você continua trabalhando E recebe o auxílio.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h3 className="font-bold mb-2">Preciso ter CAT (Comunicação de Acidente)?</h3>
                  <p className="text-muted-foreground">
                    CAT ajuda MUITO mas NÃO é obrigatório. Se empresa não emitiu CAT, podemos comprovar
                    acidente de outras formas: testemunhas, atestados, boletim de ocorrência, etc.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h3 className="font-bold mb-2">Recebo retroativo?</h3>
                  <p className="text-muted-foreground">
                    SIM! Retroativo desde a DER (data do pedido no INSS) ou desde a data da consolidação
                    da lesão (quando sequela ficou permanente). Pode dar vários anos de retroativo.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h3 className="font-bold mb-2">Quanto tempo recebo o auxílio-acidente?</h3>
                  <p className="text-muted-foreground">
                    PARA SEMPRE! Auxílio-acidente é VITALÍCIO. Você recebe até aposentar (aí vira parte
                    do cálculo da aposentadoria). É dinheiro garantido pro resto da vida.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <CredentialsSection />
      <GuaranteeSection />
      <TestimonialsSection category="previdenciario" />

      {/* Final CTA */}
      <section className="py-16 bg-gradient-to-r from-purple-600 to-pink-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Não Deixe Sua Sequela Sem Indenização - É Direito Vitalício
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            50% do salário para SEMPRE + Acumula com trabalho + Retroativo.<br />
            Análise gratuita - descubra se tem direito.
          </p>
          <Button
            size="lg"
            onClick={handleCTA}
            className="bg-white text-purple-600 hover:bg-gray-100 text-xl px-12 py-8 font-bold"
          >
            <Activity className="h-6 w-6 mr-2" />
            GARANTIR BENEFÍCIO VITALÍCIO
            <ArrowRight className="h-6 w-6 ml-2" />
          </Button>
          <p className="mt-4 text-sm">
            Análise Gratuita • Benefício Vitalício • 75% Taxa de Sucesso
          </p>
        </div>
      </section>
    </div>
  )
}
