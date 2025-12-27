'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Check, Shield, Clock, Award, ArrowRight, AlertTriangle,
  TrendingUp, Users, Star, Zap, DollarSign, GraduationCap, FileText, Calculator
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

export default function FiesRenegociacaoPage() {
  const router = useRouter()

  const handleCTA = () => {
    router.push('/checkout?product=fies-renegociacao')
  }

  return (
    <div className="min-h-screen">
      <SEOHead
        title="FIES: Renegociação e Redução de Dívida | Garcez Palha"
        description="Dívida FIES impagável? Juros absurdos? Advogado especialista renegocia + reduz até 90% + para cobrança abusiva. Saia do vermelho do FIES."
        keywords={[
          'fies renegociação',
          'dívida fies alta',
          'reduzir dívida fies',
          'fies juros abusivos',
          'advogado fies',
          'parcelar fies',
          'negativado fies',
          'fies impagável',
        ]}
        productName="FIES - Renegociação de Dívida"
        price={250000}
        category="educacional"
        canonicalUrl="https://garcezpalha.com/solucoes/educacional/fies-renegociacao"
      />

      <UrgencyBanner
        countdown={true}
        countdownMinutes={20}
        message="FIES Renegociação 2025: Desconto de até 99% para dívidas antigas"
        discount="CONDIÇÕES ESPECIAIS"
        onCTA={handleCTA}
        ctaText="RENEGOCIAR FIES AGORA"
      />

      <WhatsAppFloat
        phoneNumber="5521995354010"
        message="Minha dívida FIES está impagável! Quero renegociar com desconto."
        position="bottom-right"
        showTooltip={true}
      />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-indigo-50 via-blue-50 to-sky-50 dark:from-indigo-950/20 dark:via-blue-950/20 dark:to-sky-950/20 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-full mb-6">
              <GraduationCap className="h-5 w-5" />
              <span className="font-semibold">RENEGOCIAÇÃO ESPECIAL 2025</span>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Dívida FIES<br />
              <span className="text-indigo-600">Ficou Impagável?</span>
            </h1>

            <p className="text-xl text-muted-foreground mb-8">
              Dívida de <strong className="text-indigo-600">R$ 50k virou R$ 200k</strong> com juros?<br />
              Renegocie + Reduza até 99% + Saia da negativação + Condições especiais 2025.
            </p>

            <div className="bg-white dark:bg-gray-900 rounded-lg p-6 mb-8 border-l-4 border-indigo-600">
              <div className="flex items-start gap-2 text-left">
                <Calculator className="h-6 w-6 text-indigo-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold mb-2 text-indigo-600">FIES 2025: DESCONTOS DE ATÉ 99%!</h3>
                  <p className="text-muted-foreground">
                    Governo lançou programa de renegociação FIES com descontos absurdos: até 99% para dívidas
                    antigas, até 77% para quem está inadimplente, condições ESPECIAIS. Mas tem PRAZO e regras
                    complexas. Advogado especialista te ajuda a conseguir MÁXIMO desconto possível.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-white dark:bg-gray-900 px-4 py-3 rounded-lg border-2 border-indigo-600">
                <div className="text-3xl font-bold text-indigo-600">99%</div>
                <div className="text-sm">Desconto Máximo</div>
              </div>
              <div className="bg-white dark:bg-gray-900 px-4 py-3 rounded-lg border-2 border-blue-600">
                <div className="text-3xl font-bold text-blue-600">150 meses</div>
                <div className="text-sm">Prazo Máximo</div>
              </div>
              <div className="bg-white dark:bg-gray-900 px-4 py-3 rounded-lg border-2 border-sky-600">
                <div className="text-3xl font-bold text-sky-600">R$ 85M</div>
                <div className="text-sm">Renegociados</div>
              </div>
              <div className="bg-white dark:bg-gray-900 px-4 py-3 rounded-lg border-2 border-cyan-600">
                <div className="text-3xl font-bold text-cyan-600">2.100+</div>
                <div className="text-sm">Alunos Atendidos</div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-indigo-600 hover:bg-indigo-700 text-xl px-10 py-8 font-bold shadow-xl"
                onClick={handleCTA}
              >
                <Calculator className="h-6 w-6 mr-2" />
                CALCULAR DESCONTO GRÁTIS
                <ArrowRight className="h-6 w-6 ml-2" />
              </Button>
            </div>

            <p className="mt-4 text-sm text-muted-foreground">
              Cálculo Gratuito • Até 99% Desconto • Condições Especiais 2025
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
                <div className="text-2xl font-bold">R$ 85M</div>
                <div className="text-sm text-muted-foreground">Renegociados</div>
              </div>
              <div>
                <Users className="h-10 w-10 mx-auto mb-2 text-blue-600" />
                <div className="text-2xl font-bold">2.100+</div>
                <div className="text-sm text-muted-foreground">Alunos Atendidos</div>
              </div>
              <div>
                <Award className="h-10 w-10 mx-auto mb-2 text-purple-600" />
                <div className="text-2xl font-bold">60-99%</div>
                <div className="text-sm text-muted-foreground">Desconto Médio</div>
              </div>
              <div>
                <Clock className="h-10 w-10 mx-auto mb-2 text-orange-600" />
                <div className="text-2xl font-bold">150 meses</div>
                <div className="text-sm text-muted-foreground">Prazo Máximo</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <AgitationSection
        problem="Sua dívida FIES explodiu com JUROS ABSURDOS! O que era R$ 50k virou R$ 200k. Você está NEGATIVADO, não consegue crédito, e parcelas são IMPAGÁVEIS. Governo lançou renegociação mas é COMPLEXA."
        agitationPoints={[
          'Dívida FIES cresceu 200-400% por causa de juros capitalizados',
          'Você está NEGATIVADO e não consegue crédito para NADA',
          'Parcelas são R$ 800-2.000/mês - IMPAGÁVEL com seu salário',
          'Cada mês atrasa, juros sobem MAIS - dívida não para de crescer',
          'Governo lançou renegociação MAS regras são complexas e tem PRAZO',
          'Se perder prazo, fica com dívida gigante sem chance de desconto',
        ]}
      />

      <SolutionSection
        title="Como Conseguimos Máximo Desconto na Renegociação FIES"
        subtitle="Análise da dívida + Enquadramento correto + Negociação estratégica = Desconto máximo"
        solutionSteps={[
          'ANÁLISE GRATUITA - Pegamos seu FIES e calculamos desconto que você tem direito',
          'ENQUADRAMENTO ESTRATÉGICO - Te enquadramos na faixa de MÁXIMO desconto (até 99%)',
          'DOCUMENTAÇÃO COMPLETA - Reunimos tudo necessário para renegociação',
          'NEGOCIAÇÃO COM FNDE - Negociamos em seu nome com Fundo Nacional',
          'PARCELAMENTO VIÁVEL - Conseguimos parcelas que CABEM no seu orçamento',
          'SAÍDA DA NEGATIVAÇÃO - Assim que renegocia, nome sai do Serasa/SPC',
        ]}
        onCTA={handleCTA}
      />

      {/* Pricing Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-4">Investimento</h2>
            <p className="text-center text-muted-foreground mb-12">
              Você só paga % do que economizar - Sem riscos
            </p>

            <div className="grid grid-cols-1 md:grid-cols-1 gap-8 max-w-xl mx-auto">
              <Card className="border-4 border-indigo-600">
                <CardContent className="p-8">
                  <h3 className="text-2xl font-bold mb-4">Pacote Renegociação FIES</h3>
                  <div className="mb-6">
                    <span className="text-4xl font-bold">R$ 2.500</span>
                    <span className="text-muted-foreground"> fixo</span>
                  </div>
                  <ul className="space-y-3 mb-8">
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span>Análise gratuita da dívida FIES</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span>Cálculo de desconto que tem direito</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span>Enquadramento estratégico (máximo desconto)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span>Documentação completa</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span>Negociação com FNDE</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span>Saída da negativação</span>
                    </li>
                  </ul>
                  <div className="bg-indigo-50 dark:bg-indigo-950/20 p-4 rounded-lg mb-6">
                    <p className="text-sm font-semibold mb-2">💰 Exemplo real:</p>
                    <p className="text-sm text-muted-foreground">
                      Dívida FIES: R$ 180.000<br />
                      Com desconto 92%: R$ 14.400<br />
                      <strong className="text-indigo-600">Economia: R$ 165.600</strong><br />
                      Parcelado: 150x R$ 96/mês<br />
                      Você paga advogado: R$ 2.500 fixo<br />
                      Vale MUITO a pena!
                    </p>
                  </div>
                  <Button
                    onClick={handleCTA}
                    className="w-full bg-indigo-600 hover:bg-indigo-700"
                    size="lg"
                  >
                    RENEGOCIAR FIES AGORA
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
                  <h3 className="font-bold mb-2">Quem tem direito à renegociação FIES 2025?</h3>
                  <p className="text-muted-foreground">
                    TODOS que têm dívida FIES! Mas desconto varia: até 99% para contratos antigos (até 2017),
                    até 77% para inadimplentes, até 40% para quem está em dia. Analisamos seu caso.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h3 className="font-bold mb-2">Como funciona o desconto de 99%?</h3>
                  <p className="text-muted-foreground">
                    Para contratos FIES até 2017 em situação especial (baixa renda, desemprego, etc).
                    Desconto incide sobre JUROS e parte do principal. Dívida de R$ 200k pode virar R$ 2-5k.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h3 className="font-bold mb-2">Posso parcelar depois do desconto?</h3>
                  <p className="text-muted-foreground">
                    SIM! Até 150 meses (12,5 anos). Parcela mínima R$ 200. Com desconto alto + parcelamento
                    longo, parcelas ficam MUITO baixas (R$ 50-300/mês).
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h3 className="font-bold mb-2">Meu nome sai do Serasa?</h3>
                  <p className="text-muted-foreground">
                    SIM! Assim que renegociação é formalizada e você paga primeira parcela, FNDE comunica
                    Serasa/SPC para RETIRAR negativação. Nome limpa em 5-10 dias úteis.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h3 className="font-bold mb-2">Tem prazo para renegociar?</h3>
                  <p className="text-muted-foreground">
                    Programa atual vai até 31/08/2025 (pode prorrogar). Mas quanto ANTES renegociar, melhor:
                    evita juros crescendo e garante desconto. Não deixe para última hora!
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <CredentialsSection />
      <GuaranteeSection />
      <TestimonialsSection category="educacional" />

      {/* Final CTA */}
      <section className="py-16 bg-gradient-to-r from-indigo-600 to-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Não Fique com Nome Sujo - Renegocie FIES com Até 99% Desconto
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Programa 2025 com condições ESPECIAIS.<br />
            Reduza dívida + Parcele em até 150 meses + Limpe nome.
          </p>
          <Button
            size="lg"
            onClick={handleCTA}
            className="bg-white text-indigo-600 hover:bg-gray-100 text-xl px-12 py-8 font-bold"
          >
            <Calculator className="h-6 w-6 mr-2" />
            CALCULAR DESCONTO GRÁTIS
            <ArrowRight className="h-6 w-6 ml-2" />
          </Button>
          <p className="mt-4 text-sm">
            Cálculo Gratuito • Até 99% Desconto • Prazo até 08/2025
          </p>
        </div>
      </section>
    </div>
  )
}
