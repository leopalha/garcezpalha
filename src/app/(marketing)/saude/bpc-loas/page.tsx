'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Check, Shield, Clock, Award, ArrowRight, AlertTriangle,
  TrendingUp, Users, Star, Zap, FileText, HandHeart, Scale
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

export default function BpcLoasPage() {
  const router = useRouter()

  const handleCTA = () => {
    router.push('/checkout?product=bpc-loas')
  }

  return (
    <div className="min-h-screen">
      <SEOHead
        title="BPC / LOAS - Benefício Assistencial de 1 Salário"
        description="Consiga BPC/LOAS de 1 salário mínimo por mês. Para idosos 65+ ou pessoas com deficiência de baixa renda. Especialistas em benefícios assistenciais."
        keywords={['BPC', 'LOAS', 'benefício assistencial', 'salário mínimo', 'idoso', 'deficiente']}
        productName="BPC / LOAS"
        price={200000}
        category="saude"
        canonicalUrl="https://garcezpalha.com.br/bpc-loas"
      />

      <UrgencyBanner
        countdown={true}
        countdownMinutes={60}
        message="💰 ANÁLISE GRATUITA - Veja se você tem direito a 1 salário por mês vitalício"
        discount="ANÁLISE GRÁTIS"
        onCTA={handleCTA}
        ctaText="Solicitar Análise"
      />

      <WhatsAppFloat
        phoneNumber="5511999999999"
        message="Olá! Gostaria de saber se tenho direito ao BPC/LOAS."
        position="bottom-right"
        showTooltip={true}
      />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-rose-50 to-pink-50 dark:from-rose-950/20 dark:to-pink-950/20 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-rose-600 text-white px-4 py-2 rounded-full mb-6">
              <HandHeart className="h-5 w-5" />
              <span className="font-semibold">Benefício Assistencial</span>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Receba 1 Salário Por Mês<br />
              <span className="text-rose-600">BPC / LOAS Vitalício</span>
            </h1>

            <p className="text-xl text-muted-foreground mb-8">
              Benefício de 1 salário mínimo por mês para idosos 65+ ou pessoas com deficiência.<br />
              Não precisa ter contribuído para o INSS. Conseguimos seu benefício rapidamente.
            </p>

            <div className="bg-white dark:bg-gray-900 rounded-lg p-6 mb-8 border-l-4 border-rose-600">
              <div className="flex items-start gap-3 text-left">
                <HandHeart className="h-6 w-6 text-rose-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold mb-2">Você Sabia?</h3>
                  <p className="text-muted-foreground">
                    O BPC/LOAS é um benefício de 1 salário mínimo por mês, vitalício, que NÃO exige contribuição ao INSS.
                    Basta ter 65+ anos OU deficiência e renda familiar abaixo de 1/4 do salário mínimo por pessoa.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="bg-white dark:bg-gray-900 px-4 py-3 rounded-lg border border-rose-200">
                <div className="text-3xl font-bold text-rose-600">R$ 2.000</div>
                <div className="text-sm">+ êxito (2 benefícios)</div>
              </div>
              <div className="bg-white dark:bg-gray-900 px-4 py-3 rounded-lg border border-rose-200">
                <div className="text-3xl font-bold text-rose-600">10+</div>
                <div className="text-sm">Anos Experiência</div>
              </div>
              <div className="bg-white dark:bg-gray-900 px-4 py-3 rounded-lg border border-rose-200">
                <div className="text-3xl font-bold text-rose-600">600+</div>
                <div className="text-sm">BPC Concedidos</div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="text-xl px-10 py-8 font-bold shadow-xl bg-rose-600 hover:bg-rose-700"
                onClick={handleCTA}
              >
                <HandHeart className="h-6 w-6 mr-2" />
                CONSEGUIR MEU BPC
                <ArrowRight className="h-6 w-6 ml-2" />
              </Button>
            </div>

            <p className="mt-4 text-sm text-muted-foreground">
              ⚡ Análise gratuita • Só paga se ganhar • Resultado garantido
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
                <HandHeart className="h-10 w-10 mx-auto mb-2 text-rose-600" />
                <div className="text-2xl font-bold">600+</div>
                <div className="text-sm text-muted-foreground">BPC Concedidos</div>
              </div>
              <div>
                <Users className="h-10 w-10 mx-auto mb-2 text-green-600" />
                <div className="text-2xl font-bold">700+</div>
                <div className="text-sm text-muted-foreground">Famílias Ajudadas</div>
              </div>
              <div>
                <TrendingUp className="h-10 w-10 mx-auto mb-2 text-pink-600" />
                <div className="text-2xl font-bold">R$ 1.412</div>
                <div className="text-sm text-muted-foreground">Valor Mensal (2025)</div>
              </div>
              <div>
                <Award className="h-10 w-10 mx-auto mb-2 text-orange-600" />
                <div className="text-2xl font-bold">91%</div>
                <div className="text-sm text-muted-foreground">Taxa de Sucesso</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <AgitationSection
        problem="Viver com 65+ anos ou com deficiência, sem renda, é uma luta diária. Você tem DIREITO a 1 salário mínimo por mês, mas o INSS frequentemente nega sem motivo."
        agitationPoints={[
          'Sem renda, você depende da família e passa necessidades',
          'INSS nega 60% dos pedidos de BPC mesmo quando há direito',
          'Cada mês sem o benefício são R$ 1.412 que você deixa de receber',
          'Sem advogado, as chances de conseguir caem drasticamente',
        ]}
      />

      <SolutionSection
        title="Como Conseguimos Seu BPC/LOAS"
        subtitle="Processo completo até a concessão do benefício"
        solutionSteps={[
          'Análise GRATUITA - Verificamos se você preenche os requisitos',
          'Documentação completa - Reunimos laudos, declarações e comprovantes',
          'Pedido administrativo - Protocolamos no INSS primeiro',
          'Ação judicial se negado - Entramos na justiça e conseguimos liminar',
          'Perícia médica ou social - Acompanhamos todo o processo',
          'Concessão e atrasados - Você recebe o benefício + valores retroativos',
        ]}
        onCTA={handleCTA}
      />

      {/* Services Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-4">Nossos Serviços</h2>
            <p className="text-center text-muted-foreground mb-12">
              Conquiste seu BPC/LOAS com segurança e agilidade
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Análise */}
              <Card>
                <CardContent className="pt-6">
                  <FileText className="h-12 w-12 text-rose-600 mb-4" />
                  <h3 className="text-2xl font-bold mb-2">Análise</h3>
                  <p className="text-muted-foreground mb-4">
                    Verificação gratuita dos requisitos
                  </p>
                  <ul className="space-y-2 mb-6">
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">Análise gratuita do caso</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">Verificação de requisitos</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">Orientação completa</span>
                    </li>
                  </ul>
                  <div className="text-2xl font-bold text-rose-600 mb-2">GRÁTIS</div>
                  <Button variant="outline" className="w-full" onClick={handleCTA}>
                    Solicitar Análise
                  </Button>
                </CardContent>
              </Card>

              {/* Completo */}
              <Card className="border-rose-600 border-2 shadow-lg relative">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="bg-yellow-500 text-white px-4 py-2 rounded-full text-sm font-bold">
                    ⭐ RECOMENDADO
                  </span>
                </div>
                <CardContent className="pt-6">
                  <HandHeart className="h-12 w-12 text-green-600 mb-4" />
                  <h3 className="text-2xl font-bold mb-2">Completo</h3>
                  <p className="text-muted-foreground mb-4">
                    Do pedido até a concessão
                  </p>
                  <ul className="space-y-2 mb-6">
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">Pedido administrativo</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">Ação judicial se necessário</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">Acompanhamento de perícia</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">Até a concessão do benefício</span>
                    </li>
                  </ul>
                  <div className="text-2xl font-bold text-rose-600 mb-1">R$ 2.000</div>
                  <div className="text-sm text-muted-foreground mb-4">+ 2 benefícios no êxito</div>
                  <Button className="w-full text-lg bg-rose-600 hover:bg-rose-700" onClick={handleCTA}>
                    <Zap className="h-5 w-5 mr-2" />
                    Contratar Agora
                  </Button>
                </CardContent>
              </Card>

              {/* Judicial */}
              <Card>
                <CardContent className="pt-6">
                  <Scale className="h-12 w-12 text-pink-600 mb-4" />
                  <h3 className="text-2xl font-bold mb-2">Judicial</h3>
                  <p className="text-muted-foreground mb-4">
                    Ação direta na justiça
                  </p>
                  <ul className="space-y-2 mb-6">
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">Para casos já negados</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">Pedido de liminar</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">Nova perícia judicial</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">Valores atrasados</span>
                    </li>
                  </ul>
                  <div className="text-2xl font-bold text-rose-600 mb-1">R$ 2.500</div>
                  <div className="text-sm text-muted-foreground mb-4">+ 2 benefícios no êxito</div>
                  <Button variant="outline" className="w-full" onClick={handleCTA}>
                    Saber Mais
                  </Button>
                </CardContent>
              </Card>
            </div>

            <div className="mt-8 p-4 bg-rose-50 dark:bg-rose-900/20 rounded-lg border-l-4 border-rose-500">
              <p className="text-sm">
                💡 <strong>Prazos:</strong> Administrativo: 3-6 meses • Judicial: 1-2 anos • Benefício vitalício após concessão
              </p>
            </div>
          </div>
        </div>
      </section>

      <CredentialsSection
        lawyerName="Equipe Garcez Palha"
        experience="10+ anos em Direito Previdenciário"
        specialization="Especialistas em BPC/LOAS e Benefícios Assistenciais"
        stats={{
          years: 10,
          cases: 600,
          successRate: 91,
          clients: 700,
        }}
      />

      <TestimonialsSection />

      <GuaranteeSection
        guaranteeTitle="Análise Gratuita do Seu Caso"
        guaranteeDescription="Analisamos gratuitamente se você tem direito ao BPC/LOAS. Só paga se conseguirmos seu benefício."
        guaranteePeriod="gratuito"
      />

      {/* Final CTA */}
      <section className="py-16 bg-gradient-to-r from-rose-600 to-pink-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Consiga Seu BPC/LOAS Agora
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Receba 1 salário mínimo por mês, vitalício. Você tem direito, nós garantimos.
            <strong className="block mt-2">Análise Gratuita • Só Paga se Ganhar • Resultado Garantido</strong>
          </p>
          <Button
            size="lg"
            className="bg-white text-rose-900 hover:bg-gray-100 text-xl px-12 py-8 font-bold shadow-2xl"
            onClick={handleCTA}
          >
            <HandHeart className="h-6 w-6 mr-2" />
            CONSEGUIR MEU BPC
            <ArrowRight className="h-6 w-6 ml-2" />
          </Button>
          <p className="mt-4 text-sm">
            Mais de 600 benefícios BPC/LOAS concedidos
          </p>
        </div>
      </section>
    </div>
  )
}
