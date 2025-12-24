'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Check, Shield, Clock, Award, ArrowRight, AlertTriangle,
  TrendingUp, Users, Star, Zap, FileText, Calculator, Scale
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

export default function AposentadoriaPage() {
  const router = useRouter()

  const handleCTA = () => {
    router.push('/checkout?product=aposentadoria')
  }

  return (
    <div className="min-h-screen">
      <SEOHead
        title="Aposentadoria INSS - Análise Gratuita"
        description="Quer se aposentar? Análise gratuita do seu INSS. Planejamento, concessão e revisão. Especialistas em direito previdenciário com anos de experiência."
        keywords={['aposentadoria', 'INSS', 'planejamento previdenciário', 'revisão aposentadoria', 'advogado previdenciário']}
        productName="Aposentadoria INSS"
        price={250000}
        category="previdenciario"
        canonicalUrl="https://garcezpalha.com.br/aposentadoria"
      />

      <UrgencyBanner
        countdown={true}
        countdownMinutes={60}
        message="📊 ANÁLISE GRATUITA DO SEU INSS - Descubra quando você pode se aposentar"
        discount="ANÁLISE GRÁTIS"
        onCTA={handleCTA}
        ctaText="Solicitar Análise Gratuita"
      />

      <WhatsAppFloat
        phoneNumber="5511999999999"
        message="Olá! Gostaria de fazer a análise gratuita do meu INSS para aposentadoria."
        position="bottom-right"
        showTooltip={true}
      />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-full mb-6">
              <FileText className="h-5 w-5" />
              <span className="font-semibold">Análise Gratuita do INSS</span>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Quer Se Aposentar?<br />
              <span className="text-primary">Análise Gratuita do Seu INSS</span>
            </h1>

            <p className="text-xl text-muted-foreground mb-8">
              Descubra quando você pode se aposentar e qual o melhor momento.<br />
              Planejamento completo, concessão e revisão de benefícios.
            </p>

            <div className="bg-white dark:bg-gray-900 rounded-lg p-6 mb-8 border-l-4 border-blue-600">
              <div className="flex items-start gap-3 text-left">
                <Calculator className="h-6 w-6 text-blue-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold mb-2">Você Sabia?</h3>
                  <p className="text-muted-foreground">
                    Muitas pessoas se aposentam no momento errado e perdem até R$ 500 por mês para o resto da vida.
                    Uma análise correta do CNIS pode aumentar significativamente o valor do seu benefício.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="bg-white dark:bg-gray-900 px-4 py-3 rounded-lg border border-blue-200">
                <div className="text-3xl font-bold text-blue-600">GRÁTIS</div>
                <div className="text-sm">Análise do CNIS</div>
              </div>
              <div className="bg-white dark:bg-gray-900 px-4 py-3 rounded-lg border border-blue-200">
                <div className="text-3xl font-bold text-blue-600">15+</div>
                <div className="text-sm">Anos Experiência</div>
              </div>
              <div className="bg-white dark:bg-gray-900 px-4 py-3 rounded-lg border border-blue-200">
                <div className="text-3xl font-bold text-blue-600">500+</div>
                <div className="text-sm">Benefícios Concedidos</div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="text-xl px-10 py-8 font-bold shadow-xl"
                onClick={handleCTA}
              >
                <Calculator className="h-6 w-6 mr-2" />
                ANÁLISE GRATUITA AGORA
                <ArrowRight className="h-6 w-6 ml-2" />
              </Button>
            </div>

            <p className="mt-4 text-sm text-muted-foreground">
              ⚡ Resposta em até 24 horas • 100% online • Sem compromisso
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
                <FileText className="h-10 w-10 mx-auto mb-2 text-blue-600" />
                <div className="text-2xl font-bold">500+</div>
                <div className="text-sm text-muted-foreground">Benefícios Concedidos</div>
              </div>
              <div>
                <Users className="h-10 w-10 mx-auto mb-2 text-green-600" />
                <div className="text-2xl font-bold">1000+</div>
                <div className="text-sm text-muted-foreground">Clientes Atendidos</div>
              </div>
              <div>
                <TrendingUp className="h-10 w-10 mx-auto mb-2 text-purple-600" />
                <div className="text-2xl font-bold">R$ 300+</div>
                <div className="text-sm text-muted-foreground">Aumento Médio/Mês</div>
              </div>
              <div>
                <Award className="h-10 w-10 mx-auto mb-2 text-orange-600" />
                <div className="text-2xl font-bold">92%</div>
                <div className="text-sm text-muted-foreground">Taxa de Sucesso</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <AgitationSection
        problem="Aposentar-se no momento errado pode significar perder centenas de reais por mês pelo resto da vida. E erros no CNIS podem reduzir drasticamente o valor do seu benefício."
        agitationPoints={[
          'Aposentando muito cedo, você recebe menos do que poderia',
          'Erros no CNIS (períodos não reconhecidos, salários errados) reduzem o benefício',
          'INSS frequentemente nega benefícios que são devidos por direito',
          'Sem planejamento, você pode perder a melhor regra de transição',
        ]}
      />

      <SolutionSection
        title="Como Garantimos o Melhor Benefício Para Você"
        subtitle="Processo completo de planejamento, concessão e revisão"
        solutionSteps={[
          'Análise GRATUITA do CNIS - Verificamos todos os seus vínculos e contribuições',
          'Simulações detalhadas - Calculamos todas as regras possíveis (idade, tempo, pontos)',
          'Planejamento estratégico - Indicamos o melhor momento para se aposentar',
          'Correção de erros - Ajustamos períodos e salários não reconhecidos pelo INSS',
          'Pedido administrativo ou judicial - Protocolamos da forma mais vantajosa',
          'Acompanhamento completo - Até a concessão do benefício',
        ]}
        onCTA={handleCTA}
      />

      {/* Services Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-4">Nossos Serviços</h2>
            <p className="text-center text-muted-foreground mb-12">
              Soluções completas para todas as fases da sua aposentadoria
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Planejamento */}
              <Card>
                <CardContent className="pt-6">
                  <Calculator className="h-12 w-12 text-blue-600 mb-4" />
                  <h3 className="text-2xl font-bold mb-2">Planejamento</h3>
                  <p className="text-muted-foreground mb-4">
                    Análise completa do CNIS e simulações de todas as regras
                  </p>
                  <ul className="space-y-2 mb-6">
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">Análise CNIS gratuita</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">Simulações detalhadas</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">Orientação estratégica</span>
                    </li>
                  </ul>
                  <div className="text-2xl font-bold text-primary mb-2">GRÁTIS</div>
                  <Button variant="outline" className="w-full" onClick={handleCTA}>
                    Solicitar Análise
                  </Button>
                </CardContent>
              </Card>

              {/* Concessão */}
              <Card className="border-primary border-2 shadow-lg relative">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="bg-yellow-500 text-white px-4 py-2 rounded-full text-sm font-bold">
                    ⭐ MAIS PROCURADO
                  </span>
                </div>
                <CardContent className="pt-6">
                  <FileText className="h-12 w-12 text-green-600 mb-4" />
                  <h3 className="text-2xl font-bold mb-2">Concessão</h3>
                  <p className="text-muted-foreground mb-4">
                    Pedido administrativo ou judicial do benefício
                  </p>
                  <ul className="space-y-2 mb-6">
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">Tudo do Planejamento</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">Pedido administrativo ou judicial</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">Acompanhamento até concessão</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">Recursos se necessário</span>
                    </li>
                  </ul>
                  <div className="text-2xl font-bold text-primary mb-1">R$ 2.500</div>
                  <div className="text-sm text-muted-foreground mb-4">+ 2 benefícios no êxito</div>
                  <Button className="w-full text-lg" onClick={handleCTA}>
                    <Zap className="h-5 w-5 mr-2" />
                    Contratar Agora
                  </Button>
                </CardContent>
              </Card>

              {/* Revisão */}
              <Card>
                <CardContent className="pt-6">
                  <Scale className="h-12 w-12 text-purple-600 mb-4" />
                  <h3 className="text-2xl font-bold mb-2">Revisão</h3>
                  <p className="text-muted-foreground mb-4">
                    Corrigir erros e aumentar valor do benefício
                  </p>
                  <ul className="space-y-2 mb-6">
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">Análise de erros no cálculo</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">Inclusão de períodos</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">Recálculo do benefício</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">Atrasados retroativos</span>
                    </li>
                  </ul>
                  <div className="text-2xl font-bold text-primary mb-1">R$ 2.000</div>
                  <div className="text-sm text-muted-foreground mb-4">+ 30% dos atrasados</div>
                  <Button variant="outline" className="w-full" onClick={handleCTA}>
                    Revisar Benefício
                  </Button>
                </CardContent>
              </Card>
            </div>

            <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border-l-4 border-blue-500">
              <p className="text-sm">
                💡 <strong>Prazos Reais:</strong> Administrativo: 3 a 6 meses • Judicial: 1 a 3 anos (dependendo da complexidade)
              </p>
            </div>
          </div>
        </div>
      </section>

      <CredentialsSection
        lawyerName="Equipe Garcez Palha"
        experience="15+ anos em Direito Previdenciário"
        specialization="Especialistas em Aposentadoria e Benefícios INSS"
        stats={{
          years: 15,
          cases: 500,
          successRate: 92,
          clients: 1000,
        }}
      />

      <TestimonialsSection />

      <GuaranteeSection
        guaranteeTitle="Análise Gratuita Sem Compromisso"
        guaranteeDescription="Faça a análise do seu CNIS gratuitamente. Só contrata se quiser prosseguir."
        guaranteePeriod="gratuito"
      />

      {/* Final CTA */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Descubra Quando Você Pode Se Aposentar
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Análise gratuita do seu CNIS. Descubra o melhor momento e o maior valor possível.
            <strong className="block mt-2">100% Online • Sem Compromisso • Resposta em 24h</strong>
          </p>
          <Button
            size="lg"
            className="bg-white text-blue-900 hover:bg-gray-100 text-xl px-12 py-8 font-bold shadow-2xl"
            onClick={handleCTA}
          >
            <Calculator className="h-6 w-6 mr-2" />
            FAZER ANÁLISE GRATUITA
            <ArrowRight className="h-6 w-6 ml-2" />
          </Button>
          <p className="mt-4 text-sm">
            Mais de 1000 clientes já garantiram seus benefícios
          </p>
        </div>
      </section>
    </div>
  )
}
