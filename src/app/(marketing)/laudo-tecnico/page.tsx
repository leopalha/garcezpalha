'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Check, Shield, Clock, Award, ArrowRight, FileText,
  Scale, Users, Star, Zap, Search, BadgeCheck
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

export default function LaudoTecnicoPage() {
  const router = useRouter()

  const handleCTA = () => {
    router.push('/checkout?product=laudo-tecnico')
  }

  return (
    <div className="min-h-screen">
      <SEOHead
        title="Laudo Técnico Pericial - Perito Judicial Credenciado"
        description="Precisa de laudo técnico? Perito judicial credenciado CONPEJ/RJ. Laudos para processos judiciais, avaliações técnicas e perícias especializadas."
        keywords={['laudo técnico', 'perito judicial', 'perícia técnica', 'laudo pericial', 'CONPEJ']}
        productName="Laudo Técnico Pericial"
        price={200000}
        category="pericia"
        canonicalUrl="https://garcezpalha.com.br/laudo-tecnico"
      />

      <UrgencyBanner
        countdown={false}
        message="🎯 Perito Judicial Credenciado CONPEJ/RJ - Laudos com Validade Legal"
        discount="CONSULTA GRÁTIS"
        onCTA={handleCTA}
        ctaText="Solicitar Orçamento"
      />

      <WhatsAppFloat
        phoneNumber="5511999999999"
        message="Olá! Preciso de um laudo técnico pericial. Gostaria de mais informações."
        position="bottom-right"
        showTooltip={true}
      />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-slate-50 to-gray-50 dark:from-slate-950/20 dark:to-gray-950/20 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-slate-700 text-white px-4 py-2 rounded-full mb-6">
              <BadgeCheck className="h-5 w-5" />
              <span className="font-semibold">Perito Judicial Credenciado CONPEJ/RJ</span>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Precisa de Laudo Técnico?<br />
              <span className="text-primary">Parecer de Perito Judicial</span>
            </h1>

            <p className="text-xl text-muted-foreground mb-8">
              Laudos periciais com validade legal para processos judiciais,<br />
              avaliações técnicas e perícias especializadas.
            </p>

            <div className="bg-white dark:bg-gray-900 rounded-lg p-6 mb-8 border-l-4 border-slate-600">
              <div className="flex items-start gap-3 text-left">
                <Scale className="h-6 w-6 text-slate-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold mb-2">Por Que Nossos Laudos São Diferentes?</h3>
                  <p className="text-muted-foreground">
                    Como perito judicial credenciado pelo CONPEJ/RJ, nossos laudos têm reconhecimento legal
                    e são aceitos por tribunais em todo o país. Experiência em centenas de perícias judiciais.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="bg-white dark:bg-gray-900 px-4 py-3 rounded-lg border border-slate-200">
                <div className="text-3xl font-bold text-slate-600">CONPEJ</div>
                <div className="text-sm">Credenciado RJ</div>
              </div>
              <div className="bg-white dark:bg-gray-900 px-4 py-3 rounded-lg border border-slate-200">
                <div className="text-3xl font-bold text-slate-600">15-30</div>
                <div className="text-sm">Dias para Entrega</div>
              </div>
              <div className="bg-white dark:bg-gray-900 px-4 py-3 rounded-lg border border-slate-200">
                <div className="text-3xl font-bold text-slate-600">200+</div>
                <div className="text-sm">Laudos Realizados</div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="text-xl px-10 py-8 font-bold shadow-xl"
                onClick={handleCTA}
              >
                <FileText className="h-6 w-6 mr-2" />
                SOLICITAR ORÇAMENTO
                <ArrowRight className="h-6 w-6 ml-2" />
              </Button>
            </div>

            <p className="mt-4 text-sm text-muted-foreground">
              ⚡ Orçamento gratuito • Prazo garantido • Laudos com validade legal
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
                <FileText className="h-10 w-10 mx-auto mb-2 text-slate-600" />
                <div className="text-2xl font-bold">200+</div>
                <div className="text-sm text-muted-foreground">Laudos Elaborados</div>
              </div>
              <div>
                <Scale className="h-10 w-10 mx-auto mb-2 text-blue-600" />
                <div className="text-2xl font-bold">150+</div>
                <div className="text-sm text-muted-foreground">Perícias Judiciais</div>
              </div>
              <div>
                <Clock className="h-10 w-10 mx-auto mb-2 text-green-600" />
                <div className="text-2xl font-bold">20 dias</div>
                <div className="text-sm text-muted-foreground">Prazo Médio Entrega</div>
              </div>
              <div>
                <BadgeCheck className="h-10 w-10 mx-auto mb-2 text-purple-600" />
                <div className="text-2xl font-bold">100%</div>
                <div className="text-sm text-muted-foreground">Aceitos em Juízo</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <AgitationSection
        problem="Um laudo técnico mal elaborado ou sem credibilidade pode comprometer todo o seu processo judicial ou negociação. Você precisa de um documento que seja tecnicamente sólido e legalmente válido."
        agitationPoints={[
          'Laudos sem credencial pericial são questionados e desvalorizados em juízo',
          'Perícia mal feita pode fazer você perder o processo',
          'Prazo estourado pode gerar prejuízos e multas',
          'Falta de fundamentação técnica adequada enfraquece seus argumentos',
        ]}
      />

      <SolutionSection
        title="Como Elaboramos Laudos Técnicos de Excelência"
        subtitle="Metodologia pericial reconhecida pelos tribunais"
        solutionSteps={[
          'Análise preliminar gratuita - Avaliamos a viabilidade e complexidade do caso',
          'Vistoria técnica detalhada - Inspeção minuciosa com registro fotográfico',
          'Pesquisa e fundamentação - Base técnica sólida com normas e legislação aplicável',
          'Elaboração do laudo - Documento técnico completo com conclusões fundamentadas',
          'Quesitos e esclarecimentos - Resposta a questionamentos das partes',
          'Apresentação em juízo - Suporte durante audiência se necessário',
        ]}
        onCTA={handleCTA}
      />

      {/* Types of Reports */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-4">Tipos de Laudos</h2>
            <p className="text-center text-muted-foreground mb-12">
              Perícias especializadas para diferentes necessidades
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Laudo Técnico Geral */}
              <Card>
                <CardContent className="pt-6">
                  <FileText className="h-10 w-10 text-blue-600 mb-3" />
                  <h3 className="text-xl font-bold mb-2">Laudo Técnico Geral</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Análise técnica de documentos, processos, situações ou equipamentos
                  </p>
                  <ul className="space-y-2 mb-4">
                    <li className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">Avaliação técnica completa</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">Fundamentação legal</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">Conclusões objetivas</span>
                    </li>
                  </ul>
                  <div className="text-xl font-bold text-primary">A partir de R$ 2.000</div>
                </CardContent>
              </Card>

              {/* Perícia Documental */}
              <Card>
                <CardContent className="pt-6">
                  <Search className="h-10 w-10 text-purple-600 mb-3" />
                  <h3 className="text-xl font-bold mb-2">Perícia Documental</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Análise de autenticidade de documentos e verificação de adulterações
                  </p>
                  <ul className="space-y-2 mb-4">
                    <li className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">Exame documentoscópico</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">Detecção de adulterações</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">Laudo pericial detalhado</span>
                    </li>
                  </ul>
                  <div className="text-xl font-bold text-primary">A partir de R$ 2.500</div>
                </CardContent>
              </Card>

              {/* Grafotecnia */}
              <Card>
                <CardContent className="pt-6">
                  <Award className="h-10 w-10 text-orange-600 mb-3" />
                  <h3 className="text-xl font-bold mb-2">Grafotecnia</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Exame grafotécnico para verificação de autenticidade de assinaturas
                  </p>
                  <ul className="space-y-2 mb-4">
                    <li className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">Comparação de assinaturas</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">Análise grafoscópica</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">Conclusão técnica fundamentada</span>
                    </li>
                  </ul>
                  <div className="text-xl font-bold text-primary">A partir de R$ 3.000</div>
                </CardContent>
              </Card>

              {/* Avaliação Imobiliária */}
              <Card>
                <CardContent className="pt-6">
                  <Scale className="h-10 w-10 text-green-600 mb-3" />
                  <h3 className="text-xl font-bold mb-2">Avaliação Imobiliária</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Laudo de avaliação com credencial CRECI para processos judiciais
                  </p>
                  <ul className="space-y-2 mb-4">
                    <li className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">Vistoria presencial</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">Metodologia NBR 14653</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">Laudo CRECI credenciado</span>
                    </li>
                  </ul>
                  <div className="text-xl font-bold text-primary">A partir de R$ 1.500</div>
                </CardContent>
              </Card>
            </div>

            <div className="mt-8 p-4 bg-slate-50 dark:bg-slate-900/20 rounded-lg border-l-4 border-slate-500">
              <p className="text-sm">
                💡 <strong>Prazo de Entrega:</strong> 15 a 30 dias úteis dependendo da complexidade do laudo.
                Laudos urgentes podem ter prazo reduzido mediante taxa adicional.
              </p>
            </div>
          </div>
        </div>
      </section>

      <CredentialsSection
        lawyerName="Dr. Garcez Palha"
        experience="Perito Judicial Credenciado"
        specialization="CONPEJ/RJ • OAB/RJ 219.390 • CRECI/RJ"
        stats={{
          years: 10,
          cases: 200,
          successRate: 100,
          clients: 150,
        }}
      />

      <TestimonialsSection />

      <GuaranteeSection
        guaranteeTitle="Garantia de Qualidade Técnica"
        guaranteeDescription="Laudos elaborados com rigor técnico e científico, aceitos em todos os tribunais"
        guaranteePeriod="vitalício"
        guaranteePoints={[
          'Fundamentação técnica sólida',
          'Credenciamento CONPEJ/RJ',
          'Prazo de entrega garantido',
          'Suporte durante processo judicial',
        ]}
      />

      {/* Final CTA */}
      <section className="py-16 bg-gradient-to-r from-slate-700 to-gray-700 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Precisa de um Laudo Técnico Confiável?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Perito judicial credenciado pelo CONPEJ/RJ com centenas de laudos aceitos em juízo.
            <strong className="block mt-2">Orçamento Gratuito • Prazo Garantido • Validade Legal</strong>
          </p>
          <Button
            size="lg"
            className="bg-white text-slate-900 hover:bg-gray-100 text-xl px-12 py-8 font-bold shadow-2xl"
            onClick={handleCTA}
          >
            <FileText className="h-6 w-6 mr-2" />
            SOLICITAR ORÇAMENTO AGORA
            <ArrowRight className="h-6 w-6 ml-2" />
          </Button>
          <p className="mt-4 text-sm">
            Resposta em até 24 horas • Atendimento profissional
          </p>
        </div>
      </section>
    </div>
  )
}
