
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Check, Shield, Clock, Award, ArrowRight,
  TrendingUp, Users, Star, Zap, FileText, Plane, Building2, Scale
} from 'lucide-react'
import { getProductBySlug } from '@/lib/products/catalog'
import {
  AgitationSection,
  SolutionSection,
  CredentialsSection,
  GuaranteeSection,
  TestimonialsSection,
  UrgencyBanner,
  SEOHead,
} from '@/components/vsl'

// ISR: Revalidate every 1 hour (product pages rarely change)
export const revalidate = 3600

// Generate metadata for SEO


export default function DireitoAeronauticoPage() {
  const router = useRouter()

  const handleCTA = () => {
    router.push('/checkout?product=consultoria-aeronautica')
  }

  return (
    <div className="min-h-screen">
      <SEOHead
        title="Direito Aeronáutico Corporativo - Consultoria e Compliance"
        description="Consultoria jurídica especializada em aviação para empresas. Compliance ANAC, certificações, licenças, assessoria regulatória e defesa administrativa."
        keywords={['direito aeronáutico', 'consultoria aviação', 'compliance ANAC', 'certificação aeronáutica', 'regulação aviação', 'assessoria empresarial aviação']}
        productName="Consultoria Aeronáutica"
        price={500000}
        category="aeronautico"
        canonicalUrl="https://garcezpalha.com.br/direito-aeronautico"
      />

      <UrgencyBanner
        countdown={false}
        message="✈️ CONSULTORIA ESPECIALIZADA - Atendimento a empresas de aviação"
        discount="CONSULTA"
        onCTA={handleCTA}
        ctaText="Solicitar Consultoria"
      />


      {/* Hero Section */}
      <section className="bg-gradient-to-br from-sky-50 to-blue-50 dark:from-sky-950/20 dark:to-blue-950/20 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-sky-600 text-white px-4 py-2 rounded-full mb-6">
              <Plane className="h-5 w-5" />
              <span className="font-semibold">Direito Aeronáutico Corporativo</span>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Consultoria Jurídica<br />
              <span className="text-sky-600">para Empresas de Aviação</span>
            </h1>

            <p className="text-xl text-muted-foreground mb-8">
              Assessoria jurídica especializada em direito aeronáutico.<br />
              Compliance ANAC, certificações, licenças e defesa administrativa para sua empresa.
            </p>

            <div className="bg-white dark:bg-gray-900 rounded-lg p-6 mb-8 border-l-4 border-sky-600">
              <div className="flex items-start gap-3 text-left">
                <Building2 className="h-6 w-6 text-sky-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold mb-2">Atendimento Corporativo</h3>
                  <p className="text-muted-foreground">
                    Consultoria especializada para companhias aéreas, escolas de aviação, oficinas homologadas,
                    empresas de táxi aéreo, operadores de aeronaves e demais empresas do setor aeronáutico.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="bg-white dark:bg-gray-900 px-4 py-3 rounded-lg border border-sky-200">
                <div className="text-3xl font-bold text-sky-600">20+</div>
                <div className="text-sm">Anos Experiência</div>
              </div>
              <div className="bg-white dark:bg-gray-900 px-4 py-3 rounded-lg border border-sky-200">
                <div className="text-3xl font-bold text-sky-600">50+</div>
                <div className="text-sm">Empresas Atendidas</div>
              </div>
              <div className="bg-white dark:bg-gray-900 px-4 py-3 rounded-lg border border-sky-200">
                <div className="text-3xl font-bold text-sky-600">100%</div>
                <div className="text-sm">Compliance</div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="text-xl px-10 py-8 font-bold shadow-xl bg-sky-600 hover:bg-sky-700"
                onClick={handleCTA}
              >
                <Plane className="h-6 w-6 mr-2" />
                SOLICITAR CONSULTORIA
                <ArrowRight className="h-6 w-6 ml-2" />
              </Button>
            </div>

            <p className="mt-4 text-sm text-muted-foreground">
              ⚡ Atendimento especializado • Experiência ANAC • Soluções corporativas
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
                <Plane className="h-10 w-10 mx-auto mb-2 text-sky-600" />
                <div className="text-2xl font-bold">50+</div>
                <div className="text-sm text-muted-foreground">Empresas Atendidas</div>
              </div>
              <div>
                <Users className="h-10 w-10 mx-auto mb-2 text-green-600" />
                <div className="text-2xl font-bold">100+</div>
                <div className="text-sm text-muted-foreground">Certificações Obtidas</div>
              </div>
              <div>
                <Shield className="h-10 w-10 mx-auto mb-2 text-purple-600" />
                <div className="text-2xl font-bold">20+</div>
                <div className="text-sm text-muted-foreground">Anos Experiência</div>
              </div>
              <div>
                <Award className="h-10 w-10 mx-auto mb-2 text-orange-600" />
                <div className="text-2xl font-bold">95%</div>
                <div className="text-sm text-muted-foreground">Taxa de Sucesso</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <AgitationSection
        problem="O setor aeronáutico é altamente regulado. Empresas sem assessoria jurídica especializada correm risco de multas, suspensão de certificados, perda de licenças e até interdição das operações pela ANAC."
        agitationPoints={[
          'Certificações e licenças negadas ou suspensas por não conformidade',
          'Multas milionárias da ANAC por descumprimento de normas regulatórias',
          'Processos administrativos que podem paralisar operações',
          'Acidentes e incidentes sem defesa técnica adequada',
          'Contratos mal elaborados com fornecedores e parceiros',
          'Litígios trabalhistas complexos com tripulação e pessoal técnico'
        ]}
      />

      <SolutionSection
        title="Como Protegemos Sua Empresa Aeronáutica"
        subtitle="Consultoria jurídica completa para o setor de aviação"
        solutionSteps={[
          'Consultoria Regulatória ANAC - Orientação sobre RBAC, RBHA e demais normas',
          'Compliance Aeronáutico - Adequação e manutenção de conformidade regulatória',
          'Certificações e Licenças - Obtenção de CTA, CAT, certificados de homologação',
          'Defesa Administrativa - Representação em processos ANAC',
          'Contratos Aeronáuticos - Elaboração e revisão de contratos especializados',
          'Assessoria Empresarial - Consultoria jurídica permanente para sua operação'
        ]}
        onCTA={handleCTA}
      />

      {/* Services Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-4">Nossos Serviços Aeronáuticos</h2>
            <p className="text-center text-muted-foreground mb-12">
              Soluções completas para empresas do setor de aviação
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Consultoria Regulatória */}
              <Card>
                <CardContent className="pt-6">
                  <FileText className="h-12 w-12 text-sky-600 mb-4" />
                  <h3 className="text-2xl font-bold mb-2">Consultoria Regulatória</h3>
                  <p className="text-muted-foreground mb-4">
                    Orientação ANAC e normas
                  </p>
                  <ul className="space-y-2 mb-6">
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">Análise de conformidade</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">Interpretação de RBACs</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">Adequação regulatória</span>
                    </li>
                  </ul>
                  <div className="text-2xl font-bold text-sky-600 mb-2">Sob consulta</div>
                  <Button variant="outline" className="w-full border-sky-600 text-sky-600 hover:bg-sky-50" onClick={handleCTA}>
                    Solicitar Orçamento
                  </Button>
                </CardContent>
              </Card>

              {/* Certificações */}
              <Card className="border-sky-600 border-2 shadow-lg relative">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="bg-yellow-500 text-white px-4 py-2 rounded-full text-sm font-bold">
                    ⭐ MAIS PROCURADO
                  </span>
                </div>
                <CardContent className="pt-6">
                  <Shield className="h-12 w-12 text-green-600 mb-4" />
                  <h3 className="text-2xl font-bold mb-2">Certificações</h3>
                  <p className="text-muted-foreground mb-4">
                    Obtenção de licenças e certificados
                  </p>
                  <ul className="space-y-2 mb-6">
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">CTA (Certificado de Tipo Aeronáutico)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">CAT (Certificado de Aeronavegabilidade)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">Homologações ANAC</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">Licenças operacionais</span>
                    </li>
                  </ul>
                  <div className="text-2xl font-bold text-sky-600 mb-1">A partir de</div>
                  <div className="text-xl font-bold text-sky-600 mb-4">R$ 15.000</div>
                  <Button className="w-full text-lg bg-sky-600 hover:bg-sky-700" onClick={handleCTA}>
                    <Zap className="h-5 w-5 mr-2" />
                    Contratar Agora
                  </Button>
                </CardContent>
              </Card>

              {/* Defesa Administrativa */}
              <Card>
                <CardContent className="pt-6">
                  <Scale className="h-12 w-12 text-purple-600 mb-4" />
                  <h3 className="text-2xl font-bold mb-2">Defesa ANAC</h3>
                  <p className="text-muted-foreground mb-4">
                    Processos administrativos
                  </p>
                  <ul className="space-y-2 mb-6">
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">Defesa em auto de infração</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">Recursos administrativos</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">Suspensão de certificados</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">Acidentes e incidentes</span>
                    </li>
                  </ul>
                  <div className="text-2xl font-bold text-sky-600 mb-1">A partir de</div>
                  <div className="text-xl font-bold text-sky-600 mb-4">R$ 10.000</div>
                  <Button variant="outline" className="w-full border-sky-600 text-sky-600 hover:bg-sky-50" onClick={handleCTA}>
                    Consultar Valores
                  </Button>
                </CardContent>
              </Card>
            </div>

            <div className="mt-8 p-4 bg-sky-50 dark:bg-sky-900/20 rounded-lg border-l-4 border-sky-500">
              <p className="text-sm">
                ✈️ <strong>Assessoria Permanente:</strong> Oferecemos também contratos de consultoria jurídica permanente para empresas do setor aeronáutico. Entre em contato para orçamento personalizado.
              </p>
            </div>
          </div>
        </div>
      </section>

      <CredentialsSection
        lawyerName="Equipe Aeronáutica Garcez Palha"
        experience="20+ anos em Direito Aeronáutico"
        specialization="Especialistas em Compliance e Regulação Aeronáutica"
        stats={{
          years: 20,
          cases: 100,
          successRate: 95,
          clients: 50,
        }}
      />

      <TestimonialsSection />

      <GuaranteeSection
        guaranteeTitle="Consultoria Especializada"
        guaranteeDescription="Equipe com experiência comprovada em direito aeronáutico, regulação ANAC e compliance para empresas de aviação."
        guaranteePeriod="expertise comprovado"
      />

      {/* Final CTA */}
      <section className="py-16 bg-gradient-to-r from-sky-600 to-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Proteja Sua Empresa Aeronáutica
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Consultoria jurídica especializada para garantir compliance e segurança operacional.
            <strong className="block mt-2">Compliance ANAC • Certificações • Defesa Administrativa</strong>
          </p>
          <Button
            size="lg"
            className="bg-white text-sky-900 hover:bg-gray-100 text-xl px-12 py-8 font-bold shadow-2xl"
            onClick={handleCTA}
          >
            <Plane className="h-6 w-6 mr-2" />
            SOLICITAR CONSULTORIA
            <ArrowRight className="h-6 w-6 ml-2" />
          </Button>
          <p className="mt-4 text-sm">
            Mais de 50 empresas aeronáuticas já confiam em nossa assessoria jurídica
          </p>
        </div>
      </section>
    </div>
  )
}
