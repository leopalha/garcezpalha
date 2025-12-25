'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Check, Shield, Clock, Award, ArrowRight, AlertTriangle,
  TrendingUp, Users, Star, Zap, FileText, Scale, Gavel
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

export default function DefesaExecucaoPage() {
  const router = useRouter()

  const handleCTA = () => {
    router.push('/checkout?product=defesa-execucao')
  }

  return (
    <div className="min-h-screen">
      <SEOHead
        title="Defesa em Execução - Embargos e Impugnação"
        description="Sendo executado? Defenda-se com embargos à execução, exceção de pré-executividade e impugnação. Especialistas em defesa do executado."
        keywords={['embargos à execução', 'exceção de pré-executividade', 'impugnação', 'defesa execução', 'advogado execução']}
        productName="Defesa em Execução"
        price={300000}
        category="financeiro"
        canonicalUrl="https://garcezpalha.com.br/defesa-execucao"
      />

      <UrgencyBanner
        countdown={true}
        countdownMinutes={60}
        message="⚖️ CONSULTA GRATUITA - Analise suas chances de defesa na execução"
        discount="CONSULTA GRÁTIS"
        onCTA={handleCTA}
        ctaText="Solicitar Consulta Gratuita"
      />

      <WhatsAppFloat
        phoneNumber="5511999999999"
        message="Olá! Estou sendo executado e preciso de defesa urgente."
        position="bottom-right"
        showTooltip={true}
      />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-full mb-6">
              <Shield className="h-5 w-5" />
              <span className="font-semibold">Defesa do Executado</span>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Sendo Executado?<br />
              <span className="text-primary">Defenda-se Agora!</span>
            </h1>

            <p className="text-xl text-muted-foreground mb-8">
              Embargos à execução, exceção de pré-executividade e impugnação.<br />
              Proteja seu patrimônio com uma defesa técnica especializada.
            </p>

            <div className="bg-white dark:bg-gray-900 rounded-lg p-6 mb-8 border-l-4 border-blue-600">
              <div className="flex items-start gap-3 text-left">
                <AlertTriangle className="h-6 w-6 text-red-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold mb-2">Atenção: Prazos Curtos!</h3>
                  <p className="text-muted-foreground">
                    Você tem apenas 15 dias para opor embargos à execução após a intimação da penhora.
                    Perder esse prazo pode significar perder seu patrimônio. Aja rápido!
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="bg-white dark:bg-gray-900 px-4 py-3 rounded-lg border border-blue-200">
                <div className="text-3xl font-bold text-blue-600">15 dias</div>
                <div className="text-sm">Prazo para Embargos</div>
              </div>
              <div className="bg-white dark:bg-gray-900 px-4 py-3 rounded-lg border border-blue-200">
                <div className="text-3xl font-bold text-blue-600">10+</div>
                <div className="text-sm">Anos Experiência</div>
              </div>
              <div className="bg-white dark:bg-gray-900 px-4 py-3 rounded-lg border border-blue-200">
                <div className="text-3xl font-bold text-blue-600">200+</div>
                <div className="text-sm">Execuções Defendidas</div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="text-xl px-10 py-8 font-bold shadow-xl"
                onClick={handleCTA}
              >
                <Shield className="h-6 w-6 mr-2" />
                CONSULTA GRATUITA AGORA
                <ArrowRight className="h-6 w-6 ml-2" />
              </Button>
            </div>

            <p className="mt-4 text-sm text-muted-foreground">
              ⚡ Atendimento urgente 24h • Análise imediata • Proteja seu patrimônio
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
                <Shield className="h-10 w-10 mx-auto mb-2 text-blue-600" />
                <div className="text-2xl font-bold">200+</div>
                <div className="text-sm text-muted-foreground">Execuções Defendidas</div>
              </div>
              <div>
                <Users className="h-10 w-10 mx-auto mb-2 text-green-600" />
                <div className="text-2xl font-bold">150+</div>
                <div className="text-sm text-muted-foreground">Clientes Protegidos</div>
              </div>
              <div>
                <TrendingUp className="h-10 w-10 mx-auto mb-2 text-purple-600" />
                <div className="text-2xl font-bold">R$ 2M+</div>
                <div className="text-sm text-muted-foreground">Patrimônio Preservado</div>
              </div>
              <div>
                <Award className="h-10 w-10 mx-auto mb-2 text-orange-600" />
                <div className="text-2xl font-bold">85%</div>
                <div className="text-sm text-muted-foreground">Taxa de Sucesso</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <AgitationSection
        problem="Ser executado judicialmente pode significar a perda do seu patrimônio, penhora de bens, bloqueio de contas bancárias e até mesmo restrições comerciais. Sem defesa técnica adequada, você corre o risco de perder tudo."
        agitationPoints={[
          'Penhora de salário, contas bancárias e imóveis sem defesa adequada',
          'Valores cobrados indevidos ou com cálculos errados passam despercebidos',
          'Perda de prazos processuais resulta em impossibilidade de defesa',
          'Execuções prescritas ou nulas continuam correndo sem questionamento',
          'Patrimônio familiar em risco por falta de conhecimento técnico',
          'Acordos desvantajosos aceitos por desespero e falta de orientação'
        ]}
      />

      <SolutionSection
        title="Como Protegemos Seu Patrimônio na Execução"
        subtitle="Defesa técnica completa com todas as ferramentas processuais"
        solutionSteps={[
          'Análise URGENTE do processo - Verificamos prazos, valores e possibilidades de defesa',
          'Exceção de pré-executividade - Questionamos vícios sem necessidade de garantia',
          'Embargos à execução - Defesa completa com discussão de mérito e valores',
          'Impugnação ao cumprimento de sentença - Contestamos cálculos e excessos',
          'Redução de penhora - Buscamos substituir bens penhorados por menos onerosos',
          'Negociação estratégica - Acordos vantajosos quando apropriado'
        ]}
        onCTA={handleCTA}
      />

      {/* Services Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-4">Nossos Serviços de Defesa</h2>
            <p className="text-center text-muted-foreground mb-12">
              Soluções completas para proteger você na execução judicial
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Exceção */}
              <Card>
                <CardContent className="pt-6">
                  <FileText className="h-12 w-12 text-blue-600 mb-4" />
                  <h3 className="text-2xl font-bold mb-2">Exceção</h3>
                  <p className="text-muted-foreground mb-4">
                    Exceção de pré-executividade sem garantia
                  </p>
                  <ul className="space-y-2 mb-6">
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">Análise de vícios formais</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">Prescrição e nulidades</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">Sem necessidade de garantia</span>
                    </li>
                  </ul>
                  <div className="text-2xl font-bold text-primary mb-2">R$ 2.000</div>
                  <Button variant="outline" className="w-full" onClick={handleCTA}>
                    Opor Exceção
                  </Button>
                </CardContent>
              </Card>

              {/* Embargos */}
              <Card className="border-primary border-2 shadow-lg relative">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="bg-yellow-500 text-white px-4 py-2 rounded-full text-sm font-bold">
                    ⭐ MAIS COMPLETO
                  </span>
                </div>
                <CardContent className="pt-6">
                  <Shield className="h-12 w-12 text-green-600 mb-4" />
                  <h3 className="text-2xl font-bold mb-2">Embargos</h3>
                  <p className="text-muted-foreground mb-4">
                    Embargos à execução completos
                  </p>
                  <ul className="space-y-2 mb-6">
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">Defesa de mérito completa</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">Discussão de valores</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">Acompanhamento completo</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">Recursos se necessário</span>
                    </li>
                  </ul>
                  <div className="text-2xl font-bold text-primary mb-1">R$ 3.000</div>
                  <div className="text-sm text-muted-foreground mb-4">Pagamento facilitado</div>
                  <Button className="w-full text-lg" onClick={handleCTA}>
                    <Zap className="h-5 w-5 mr-2" />
                    Embargar Agora
                  </Button>
                </CardContent>
              </Card>

              {/* Impugnação */}
              <Card>
                <CardContent className="pt-6">
                  <Scale className="h-12 w-12 text-purple-600 mb-4" />
                  <h3 className="text-2xl font-bold mb-2">Impugnação</h3>
                  <p className="text-muted-foreground mb-4">
                    Impugnação ao cumprimento de sentença
                  </p>
                  <ul className="space-y-2 mb-6">
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">Contestação de cálculos</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">Verificação de excesso</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">Recálculo técnico</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">Defesa de penhoras</span>
                    </li>
                  </ul>
                  <div className="text-2xl font-bold text-primary mb-1">R$ 2.500</div>
                  <div className="text-sm text-muted-foreground mb-4">Prazo: 15 dias</div>
                  <Button variant="outline" className="w-full" onClick={handleCTA}>
                    Impugnar Cálculo
                  </Button>
                </CardContent>
              </Card>
            </div>

            <div className="mt-8 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border-l-4 border-red-500">
              <p className="text-sm">
                ⚠️ <strong>ATENÇÃO AOS PRAZOS:</strong> Exceção: a qualquer momento • Embargos: 15 dias após penhora • Impugnação: 15 dias após intimação
              </p>
            </div>
          </div>
        </div>
      </section>

      <CredentialsSection
        lawyerName="Equipe Garcez Palha"
        experience="10+ anos em Defesa de Execuções"
        specialization="Especialistas em Embargos e Proteção Patrimonial"
        stats={{
          years: 10,
          cases: 200,
          successRate: 85,
          clients: 150,
        }}
      />

      <TestimonialsSection />

      <GuaranteeSection
        guaranteeTitle="Consulta Gratuita de Viabilidade"
        guaranteeDescription="Analisamos seu processo gratuitamente e apresentamos todas as possibilidades de defesa."
        guaranteePeriod="gratuito"
      />

      {/* Final CTA */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Proteja Seu Patrimônio Agora
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Não deixe para depois. Os prazos são curtos e seu patrimônio está em risco.
            <strong className="block mt-2">Consulta Gratuita • Atendimento 24h • Resposta Imediata</strong>
          </p>
          <Button
            size="lg"
            className="bg-white text-blue-900 hover:bg-gray-100 text-xl px-12 py-8 font-bold shadow-2xl"
            onClick={handleCTA}
          >
            <Shield className="h-6 w-6 mr-2" />
            FAZER CONSULTA GRATUITA
            <ArrowRight className="h-6 w-6 ml-2" />
          </Button>
          <p className="mt-4 text-sm">
            Mais de 150 clientes já protegeram seu patrimônio conosco
          </p>
        </div>
      </section>
    </div>
  )
}
