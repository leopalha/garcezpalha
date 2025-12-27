'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Check, Shield, Clock, Award, ArrowRight, AlertTriangle,
  TrendingUp, Users, Star, Zap, DollarSign, Calculator, FileText, TrendingDown
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

export default function RevisaoAposentadoriaPage() {
  const router = useRouter()

  const handleCTA = () => {
    router.push('/checkout?product=revisao-aposentadoria')
  }

  return (
    <div className="min-h-screen">
      <SEOHead
        title="Revisão de Aposentadoria: Aumente Seu Benefício | Garcez Palha"
        description="Aposentadoria calculada errado? INSS ignora tempo rural, especial, insalubridade? Revise e aumente seu benefício em até 80%. Especialistas em direito previdenciário."
        keywords={[
          'revisão aposentadoria',
          'aumentar aposentadoria',
          'recalculo inss',
          'tempo rural não reconhecido',
          'atividade especial aposentadoria',
          'RMI errada inss',
          'advogado previdenciário',
          'revisão benefício inss',
        ]}
        productName="Revisão de Aposentadoria"
        price={300000}
        category="previdenciario"
        canonicalUrl="https://garcezpalha.com/solucoes/previdenciario/revisao-aposentadoria"
      />

      <UrgencyBanner
        countdown={true}
        countdownMinutes={20}
        message="ANÁLISE GRATUITA: Descubra se você tem direito a aumento no benefício"
        discount="CALCULADORA PREVIDENCIÁRIA"
        onCTA={handleCTA}
        ctaText="CALCULAR MEU AUMENTO GRÁTIS"
      />

      <WhatsAppFloat
        phoneNumber="5521995354010"
        message="Minha aposentadoria está baixa e acho que o INSS calculou errado. Quero revisar!"
        position="bottom-right"
        showTooltip={true}
      />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50 dark:from-blue-950/20 dark:via-cyan-950/20 dark:to-teal-950/20 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-orange-600 text-white px-4 py-2 rounded-full mb-6 animate-pulse">
              <AlertTriangle className="h-5 w-5" />
              <span className="font-semibold">INSS CALCULA ERRADO EM 70% DOS CASOS</span>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Sua Aposentadoria Está<br />
              <span className="text-orange-600">Calculada Errado?</span>
            </h1>

            <p className="text-xl text-muted-foreground mb-8">
              INSS ignora <strong className="text-orange-600">tempo rural, especial, insalubridade</strong>.<br />
              Revise + Aumente até 80% + Receba atrasados desde a concessão.
            </p>

            <div className="bg-white dark:bg-gray-900 rounded-lg p-6 mb-8 border-l-4 border-orange-600">
              <div className="flex items-start gap-3 text-left">
                <Calculator className="h-6 w-6 text-orange-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold mb-2 text-orange-600">70% DAS APOSENTADORIAS TÊM ERRO DE CÁLCULO!</h3>
                  <p className="text-muted-foreground">
                    INSS não considera tempo rural, atividade especial, insalubridade, salários maiores.
                    Períodos são "esquecidos" no cálculo. Você pode estar perdendo R$ 500-2.000/mês.
                    Tem 10 ANOS para revisar desde a concessão!
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-white dark:bg-gray-900 px-4 py-3 rounded-lg border-2 border-blue-600">
                <div className="text-3xl font-bold text-blue-600">85%</div>
                <div className="text-sm">Taxa de Sucesso</div>
              </div>
              <div className="bg-white dark:bg-gray-900 px-4 py-3 rounded-lg border-2 border-green-600">
                <div className="text-3xl font-bold text-green-600">+R$ 680</div>
                <div className="text-sm">Aumento Médio/Mês</div>
              </div>
              <div className="bg-white dark:bg-gray-900 px-4 py-3 rounded-lg border-2 border-orange-600">
                <div className="text-3xl font-bold text-orange-600">R$ 18M</div>
                <div className="text-sm">Recuperados</div>
              </div>
              <div className="bg-white dark:bg-gray-900 px-4 py-3 rounded-lg border-2 border-purple-600">
                <div className="text-3xl font-bold text-purple-600">8-14m</div>
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
                CALCULAR MEU AUMENTO GRÁTIS
                <ArrowRight className="h-6 w-6 ml-2" />
              </Button>
            </div>

            <p className="mt-4 text-sm text-muted-foreground">
              Análise Gratuita • Calculadora Previdenciária • 85% Taxa de Sucesso
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
                <div className="text-2xl font-bold">R$ 18M</div>
                <div className="text-sm text-muted-foreground">Recuperados</div>
              </div>
              <div>
                <Users className="h-10 w-10 mx-auto mb-2 text-blue-600" />
                <div className="text-2xl font-bold">1.200+</div>
                <div className="text-sm text-muted-foreground">Revisões Feitas</div>
              </div>
              <div>
                <Award className="h-10 w-10 mx-auto mb-2 text-purple-600" />
                <div className="text-2xl font-bold">85%</div>
                <div className="text-sm text-muted-foreground">Taxa de Sucesso</div>
              </div>
              <div>
                <Clock className="h-10 w-10 mx-auto mb-2 text-orange-600" />
                <div className="text-2xl font-bold">8-14 meses</div>
                <div className="text-sm text-muted-foreground">Prazo Médio</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <AgitationSection
        problem="O INSS CALCULOU SUA APOSENTADORIA IGNORANDO períodos que AUMENTARIAM seu benefício! Tempo rural sem registro, atividade especial sem PPP, insalubridade não considerada, salários maiores 'esquecidos'."
        agitationPoints={[
          'INSS "esquece" tempo rural sem registro (mas que você pode PROVAR com testemunhas)',
          'Atividade especial/insalubridade ignorada por falta de PPP (mesmo com direito)',
          'Salários maiores não entram no cálculo (média pega salários MENORES)',
          'Cada mês "esquecido" = MENOS R$ 50-200/mês pro resto da vida',
          'Você tem APENAS 10 ANOS desde concessão para revisar - depois PERDE o direito!',
          'Aposentadoria R$ 1.500 deveria ser R$ 2.200 = R$ 700/mês perdidos = R$ 8.400/ANO',
        ]}
      />

      <SolutionSection
        title="Como Revisamos e Aumentamos Sua Aposentadoria"
        subtitle="Calculadora previdenciária profissional + Análise completa CNIS + PPP + CTPS"
        solutionSteps={[
          'ANÁLISE COMPLETA - Pegamos CNIS, carta concessão, CTPS, contracheques',
          'BUSCA DE PERÍODOS - Investigamos tempo rural, especial, insalubridade não computado',
          'RECÁLCULO CORRETO - Usamos calculadora homologada para recalcular RMI',
          'AÇÃO REVISIONAL - Pedimos recálculo judicial com TODOS os períodos',
          'ATRASADOS - Você recebe diferença retroativa desde a data da concessão',
          'AUMENTO VITALÍCIO - Benefício corrigido para sempre + reajustes futuros maiores',
        ]}
        onCTA={handleCTA}
      />

      {/* Pricing Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-4">Investimento</h2>
            <p className="text-center text-muted-foreground mb-12">
              Você só paga SE conseguirmos aumentar seu benefício
            </p>

            <div className="grid grid-cols-1 md:grid-cols-1 gap-8 max-w-xl mx-auto">
              <Card className="border-4 border-blue-600">
                <CardContent className="p-8">
                  <h3 className="text-2xl font-bold mb-4">Pacote Revisão Completa</h3>
                  <div className="mb-6">
                    <span className="text-4xl font-bold">R$ 3.000</span>
                    <span className="text-muted-foreground"> + 25% aumento</span>
                  </div>
                  <ul className="space-y-3 mb-8">
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span>Análise completa CNIS + carta concessão</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span>Busca de períodos não computados</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span>Recálculo com calculadora homologada</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span>Ação revisional completa</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span>Recebimento de atrasados</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span>Aumento vitalício no benefício</span>
                    </li>
                  </ul>
                  <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg mb-6">
                    <p className="text-sm font-semibold mb-2">💰 Exemplo real:</p>
                    <p className="text-sm text-muted-foreground">
                      Aposentadoria atual: R$ 1.500/mês<br />
                      Aposentadoria revisada: R$ 2.200/mês<br />
                      <strong className="text-blue-600">Aumento: R$ 700/mês vitalício</strong><br />
                      Atrasados 3 anos: R$ 25.200<br />
                      Você paga: R$ 3.000 + R$ 6.300 (25%) = <strong>R$ 15.900 líquido</strong>
                    </p>
                  </div>
                  <Button
                    onClick={handleCTA}
                    className="w-full bg-blue-600 hover:bg-blue-700"
                    size="lg"
                  >
                    REVISAR MINHA APOSENTADORIA AGORA
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
                  <h3 className="font-bold mb-2">Toda aposentadoria pode ser revisada?</h3>
                  <p className="text-muted-foreground">
                    Sim, SE você tiver concedida há MENOS de 10 anos. Depois de 10 anos, perde o direito (decadência).
                    Por isso a urgência em revisar AGORA.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h3 className="font-bold mb-2">Quais erros mais comuns do INSS?</h3>
                  <p className="text-muted-foreground">
                    1) Ignorar tempo rural sem CTPS; 2) Não considerar atividade especial sem PPP;
                    3) Usar salários menores na média (quando há maiores); 4) Não aplicar fator previdenciário
                    corretamente; 5) Erros no PBC (período base de cálculo).
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h3 className="font-bold mb-2">Preciso de documentos originais?</h3>
                  <p className="text-muted-foreground">
                    Não! Precisamos de: CNIS (pega no Meu INSS), carta de concessão, CTPS (foto serve),
                    contracheques antigos se tiver. Tempo rural provamos com testemunhas + início de prova material.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h3 className="font-bold mb-2">Quanto posso aumentar?</h3>
                  <p className="text-muted-foreground">
                    Depende dos períodos não computados. Varia de 10% a 80%. Média dos nossos casos: +R$ 680/mês.
                    Fazemos análise gratuita e te dizemos o valor EXATO do aumento esperado.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h3 className="font-bold mb-2">E se não conseguir aumentar?</h3>
                  <p className="text-muted-foreground">
                    Você NÃO PAGA NADA. Nosso modelo é: só cobramos SE conseguirmos aumentar. Se análise mostrar
                    que não tem como aumentar, avisamos ANTES de entrar com ação (sem custo).
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
      <section className="py-16 bg-gradient-to-r from-blue-600 to-cyan-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Não Deixe Dinheiro na Mesa - INSS Não Vai Corrigir Sozinho
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Revise AGORA antes de perder o prazo de 10 anos.<br />
            Aumente até 80% + Receba atrasados desde a concessão.
          </p>
          <Button
            size="lg"
            onClick={handleCTA}
            className="bg-white text-blue-600 hover:bg-gray-100 text-xl px-12 py-8 font-bold"
          >
            <Calculator className="h-6 w-6 mr-2" />
            CALCULAR MEU AUMENTO GRÁTIS
            <ArrowRight className="h-6 w-6 ml-2" />
          </Button>
          <p className="mt-4 text-sm">
            Análise Gratuita • Sem Riscos • 85% Taxa de Sucesso
          </p>
        </div>
      </section>
    </div>
  )
}
