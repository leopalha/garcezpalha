'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Check, Shield, Clock, Award, ArrowRight, AlertTriangle,
  TrendingUp, Users, Star, Zap, DollarSign, Ban, FileText, Calculator
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

export default function RevisaoContratoPage() {
  const router = useRouter()

  const handleCTA = () => {
    router.push('/checkout?product=revisao-contrato-bancario')
  }

  return (
    <div className="min-h-screen">
      <SEOHead
        title="Revisão de Contrato Bancário: Reduza Parcelas | Garcez Palha"
        description="Juros abusivos no empréstimo? Taxas ilegais como TAC e TEC? Advogado especialista em revisão de contratos bancários. Reduza parcelas e receba restituição."
        keywords={[
          'revisão contrato bancário',
          'juros abusivos',
          'TAC TEC ilegal',
          'reduzir parcela empréstimo',
          'advogado bancário',
          'revisão empréstimo',
          'ação revisional bancária',
          'restituição tarifas bancárias',
        ]}
        productName="Revisão de Contrato Bancário"
        price={200000}
        category="bancario"
        canonicalUrl="https://garcezpalha.com/solucoes/bancario/revisao-contrato-bancario"
      />

      <UrgencyBanner
        countdown={true}
        countdownMinutes={20}
        message="ANÁLISE GRATUITA: Descubra se seu contrato tem cobranças ilegais"
        discount="CALCULADORA JURÍDICA"
        onCTA={handleCTA}
        ctaText="ANALISAR MEU CONTRATO GRÁTIS"
      />

      <WhatsAppFloat
        phoneNumber="5521995354010"
        message="Tenho empréstimo com juros altos e quero revisar o contrato!"
        position="bottom-right"
        showTooltip={true}
      />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-950/20 dark:via-indigo-950/20 dark:to-purple-950/20 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-full mb-6 animate-pulse">
              <AlertTriangle className="h-5 w-5" />
              <span className="font-semibold">TARIFAS ILEGAIS NO SEU CONTRATO</span>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Seu Empréstimo Tem <span className="text-red-600">Taxas Abusivas?</span><br />
              Reduza Parcelas e Receba de Volta o Que Pagou a Mais
            </h1>

            <p className="text-xl text-muted-foreground mb-8">
              TAC, TEC, IOF financiado, juros abusivos: <strong className="text-red-600">cobranças ILEGAIS</strong>.<br />
              Recálculo do contrato + Restituição em dobro + Redução do saldo devedor.
            </p>

            <div className="bg-white dark:bg-gray-900 rounded-lg p-6 mb-8 border-l-4 border-red-600">
              <div className="flex items-start gap-3 text-left">
                <Calculator className="h-6 w-6 text-red-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold mb-2 text-red-600">VOCÊ PODE ESTAR PAGANDO MUITO MAIS!</h3>
                  <p className="text-muted-foreground">
                    Bancos incluem tarifas PROIBIDAS nos contratos: TAC e TEC são ilegais desde 2008.
                    Juros acima do dobro da média = ABUSIVOS. Você tem direito a recálculo e restituição.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-white dark:bg-gray-900 px-4 py-3 rounded-lg border-2 border-blue-600">
                <div className="text-3xl font-bold text-blue-600">75%</div>
                <div className="text-sm">Taxa de Sucesso</div>
              </div>
              <div className="bg-white dark:bg-gray-900 px-4 py-3 rounded-lg border-2 border-green-600">
                <div className="text-3xl font-bold text-green-600">30-50%</div>
                <div className="text-sm">Redução Média</div>
              </div>
              <div className="bg-white dark:bg-gray-900 px-4 py-3 rounded-lg border-2 border-orange-600">
                <div className="text-3xl font-bold text-orange-600">R$ 8.3M</div>
                <div className="text-sm">Economizados</div>
              </div>
              <div className="bg-white dark:bg-gray-900 px-4 py-3 rounded-lg border-2 border-purple-600">
                <div className="text-3xl font-bold text-purple-600">4-8 meses</div>
                <div className="text-sm">Prazo Médio</div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-blue-600 hover:bg-blue-700 text-xl px-10 py-8 font-bold shadow-xl"
                onClick={handleCTA}
              >
                <Calculator className="h-6 w-6 mr-2" />
                ANALISAR MEU CONTRATO GRÁTIS
                <ArrowRight className="h-6 w-6 ml-2" />
              </Button>
            </div>

            <p className="mt-4 text-sm text-muted-foreground">
              Análise Gratuita • Calculadora Jurídica • 75% Taxa de Sucesso
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
                <div className="text-2xl font-bold">R$ 8.3M</div>
                <div className="text-sm text-muted-foreground">Economizados</div>
              </div>
              <div>
                <Users className="h-10 w-10 mx-auto mb-2 text-blue-600" />
                <div className="text-2xl font-bold">520+</div>
                <div className="text-sm text-muted-foreground">Casos Revisados</div>
              </div>
              <div>
                <Award className="h-10 w-10 mx-auto mb-2 text-purple-600" />
                <div className="text-2xl font-bold">75%</div>
                <div className="text-sm text-muted-foreground">Taxa de Sucesso</div>
              </div>
              <div>
                <Clock className="h-10 w-10 mx-auto mb-2 text-orange-600" />
                <div className="text-2xl font-bold">4-8 meses</div>
                <div className="text-sm text-muted-foreground">Prazo Médio</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <AgitationSection
        problem="Seu contrato pode ter TAC (Tarifa de Abertura de Crédito) ILEGAL desde 2008, TEC (Tarifa de Emissão de Carnê) também ILEGAL, IOF financiado aumentando artificialmente a dívida, e juros MUITO ACIMA da média do Banco Central!"
        agitationPoints={[
          'TAC cobrada no contrato (R$ 500-2.000) é PROIBIDA desde 2008 - você tem direito à restituição',
          'TEC (Tarifa de Emissão de Carnê) é igualmente ILEGAL na maioria dos casos',
          'IOF financiado sobre tarifas ilegais gera cobrança de juros sobre imposto (ilícito!)',
          'Taxa de juros acima do DOBRO da média BACEN = ABUSIVA (STJ)',
          'Empréstimo de R$ 10.000 pode virar R$ 18.000 por conta dessas cobranças ilegais',
          'Bancos lucram R$ 8.000 extras com VOCÊ pagando tarifas que são PROIBIDAS',
        ]}
      />

      <SolutionSection
        title="Como Revisamos Seu Contrato e Reduzimos Sua Dívida"
        subtitle="Calculadora jurídica profissional identifica TODAS irregularidades e calcula valores a restituir"
        solutionSteps={[
          'ANÁLISE COMPLETA - Usamos calculadora jurídica para verificar TODAS tarifas do contrato',
          'COMPARAÇÃO BACEN - Confrontamos seus juros com taxa média do Banco Central',
          'LAUDO TÉCNICO - Produzimos relatório mostrando cada cobrança ilegal identificada',
          'AÇÃO REVISIONAL - Pedimos recálculo do contrato com exclusão de tarifas ilegais',
          'RESTITUIÇÃO DOBRADA - CDC garante devolução em DOBRO de cobranças indevidas',
          'REDUÇÃO SALDO - Parcelas menores + saldo devedor reduzido significativamente',
        ]}
        onCTA={handleCTA}
      />

      {/* Pricing Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-4">Investimento</h2>
            <p className="text-center text-muted-foreground mb-12">
              Você só paga o percentual SE economizar dinheiro
            </p>

            <div className="grid grid-cols-1 md:grid-cols-1 gap-8 max-w-xl mx-auto">
              <Card className="border-4 border-blue-600">
                <CardContent className="p-8">
                  <h3 className="text-2xl font-bold mb-4">Pacote Revisão Completa</h3>
                  <div className="mb-6">
                    <span className="text-4xl font-bold">R$ 2.000</span>
                    <span className="text-muted-foreground"> + 25% economizado</span>
                  </div>
                  <ul className="space-y-3 mb-8">
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span>Análise completa com calculadora jurídica</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span>Laudo técnico das irregularidades</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span>Comparativo com taxa média BACEN</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span>Ação revisional completa</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span>Pedido de recálculo + restituição em dobro</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span>Redução do saldo devedor</span>
                    </li>
                  </ul>
                  <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg mb-6">
                    <p className="text-sm font-semibold mb-2">Exemplo real:</p>
                    <p className="text-sm text-muted-foreground">
                      Financiamento R$ 30.000 | Tarifas ilegais R$ 3.500 | Juros acima média R$ 8.000<br />
                      <strong className="text-blue-600">Economia total: R$ 15.000</strong><br />
                      Você paga: R$ 2.000 + R$ 3.750 (25%) = <strong>R$ 9.250 líquido</strong>
                    </p>
                  </div>
                  <Button
                    onClick={handleCTA}
                    className="w-full bg-blue-600 hover:bg-blue-700"
                    size="lg"
                  >
                    REVISAR MEU CONTRATO AGORA
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
                  <h3 className="font-bold mb-2">Qualquer contrato pode ser revisado?</h3>
                  <p className="text-muted-foreground">
                    Contratos com menos de 10 anos podem ser revisados. Analisamos se há irregularidades
                    que justifiquem a ação: TAC, TEC, juros abusivos, seguro embutido, etc.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h3 className="font-bold mb-2">E se eu ainda estou pagando o empréstimo?</h3>
                  <p className="text-muted-foreground">
                    Pode revisar mesmo assim! Podemos pedir tutela para suspender cobranças abusivas
                    enquanto o processo corre. Você continua pagando o valor correto (recalculado).
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h3 className="font-bold mb-2">O banco pode cancelar meu crédito por eu processar?</h3>
                  <p className="text-muted-foreground">
                    NÃO! O banco não pode retaliar por você exercer um direito legal. Se fizer isso,
                    é mais um motivo para indenização por danos morais.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h3 className="font-bold mb-2">Quanto posso economizar?</h3>
                  <p className="text-muted-foreground">
                    Depende do contrato. Alguns clientes conseguiram reduzir a dívida em 30-50%.
                    Outros recuperaram valores já pagos. Fazemos a análise gratuita e te dizemos o valor exato.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h3 className="font-bold mb-2">Como funciona o cálculo?</h3>
                  <p className="text-muted-foreground">
                    Usamos calculadoras jurídicas homologadas que comparam seu contrato com as taxas
                    médias do Banco Central. Identificamos TODAS cobranças ilegais e calculamos o valor correto.
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
      <section className="py-16 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Pare de Pagar Tarifas Ilegais e Juros Abusivos
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Recalcule seu contrato + Reduza parcelas + Receba restituição em dobro.<br />
            Análise gratuita com calculadora jurídica em 48 horas.
          </p>
          <Button
            size="lg"
            onClick={handleCTA}
            className="bg-white text-blue-600 hover:bg-gray-100 text-xl px-12 py-8 font-bold"
          >
            <Calculator className="h-6 w-6 mr-2" />
            ANALISAR MEU CONTRATO GRÁTIS
            <ArrowRight className="h-6 w-6 ml-2" />
          </Button>
          <p className="mt-4 text-sm">
            Análise Gratuita • Sem Compromisso • 75% Taxa de Sucesso
          </p>
        </div>
      </section>
    </div>
  )
}
