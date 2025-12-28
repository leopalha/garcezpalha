'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Check, Shield, Clock, Award, ArrowRight, AlertTriangle,
  TrendingUp, Users, Star, Zap, FileText, Scale, Phone
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

export default function DireitoCriminalPage() {
  const router = useRouter()

  const handleCTA = () => {
    router.push('/checkout?product=direito-criminal')
  }

  return (
    <div className="min-h-screen">
      <SEOHead
        title="Direito Criminal - Defesa Técnica 24 Horas"
        description="Preso ou sendo investigado? Defesa criminal especializada 24 horas. Crimes econômicos, difamação, estelionato, furto, drogas. Atendimento urgente."
        keywords={['advogado criminal', 'defesa criminal', 'crimes econômicos', 'habeas corpus', 'inquérito policial', 'defesa técnica']}
        productName="Direito Criminal"
        price={500000}
        category="criminal"
        canonicalUrl="https://garcezpalha.com.br/direito-criminal"
      />

      <UrgencyBanner
        countdown={false}
        message="🚨 ATENDIMENTO 24 HORAS - Plantão criminal para casos urgentes"
        discount="PLANTÃO 24H"
        onCTA={handleCTA}
        ctaText="Falar com Advogado Agora"
      />

      <WhatsAppFloat
        phoneNumber="5511999999999"
        message="URGENTE! Preciso de advogado criminal agora."
        position="bottom-right"
        showTooltip={true}
      />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-violet-50 to-purple-50 dark:from-violet-950/20 dark:to-purple-950/20 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-violet-600 text-white px-4 py-2 rounded-full mb-6">
              <Shield className="h-5 w-5" />
              <span className="font-semibold">Direito Criminal</span>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Sendo Investigado ou Preso?<br />
              <span className="text-violet-600">Defesa Técnica 24 Horas</span>
            </h1>

            <p className="text-xl text-muted-foreground mb-8">
              Advogados criminalistas experientes para sua defesa imediata.<br />
              Inquérito policial, flagrante, habeas corpus e processos criminais.
            </p>

            <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-6 mb-8 border-l-4 border-red-600">
              <div className="flex items-start gap-3 text-left">
                <AlertTriangle className="h-6 w-6 text-red-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold mb-2 text-red-900 dark:text-red-100">ATENÇÃO: Não fale NADA sem advogado!</h3>
                  <p className="text-red-800 dark:text-red-200">
                    Tudo que você disser pode e será usado contra você. O direito ao silêncio é garantido pela Constituição.
                    Não preste depoimento, não assine nada e não faça acordo sem orientação de advogado criminalista.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="bg-white dark:bg-gray-900 px-4 py-3 rounded-lg border border-violet-200">
                <div className="text-3xl font-bold text-violet-600">24 HORAS</div>
                <div className="text-sm">Atendimento Urgente</div>
              </div>
              <div className="bg-white dark:bg-gray-900 px-4 py-3 rounded-lg border border-violet-200">
                <div className="text-3xl font-bold text-violet-600">15+</div>
                <div className="text-sm">Anos Experiência</div>
              </div>
              <div className="bg-white dark:bg-gray-900 px-4 py-3 rounded-lg border border-violet-200">
                <div className="text-3xl font-bold text-violet-600">400+</div>
                <div className="text-sm">Defesas Realizadas</div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="text-xl px-10 py-8 font-bold shadow-xl bg-violet-600 hover:bg-violet-700"
                onClick={handleCTA}
              >
                <Phone className="h-6 w-6 mr-2" />
                FALAR COM ADVOGADO AGORA
                <ArrowRight className="h-6 w-6 ml-2" />
              </Button>
            </div>

            <p className="mt-4 text-sm text-muted-foreground">
              ⚡ Atendimento imediato 24h • Sigilo absoluto • Defesa técnica completa
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
                <Shield className="h-10 w-10 mx-auto mb-2 text-violet-600" />
                <div className="text-2xl font-bold">400+</div>
                <div className="text-sm text-muted-foreground">Defesas Realizadas</div>
              </div>
              <div>
                <Users className="h-10 w-10 mx-auto mb-2 text-green-600" />
                <div className="text-2xl font-bold">350+</div>
                <div className="text-sm text-muted-foreground">Clientes Defendidos</div>
              </div>
              <div>
                <TrendingUp className="h-10 w-10 mx-auto mb-2 text-purple-600" />
                <div className="text-2xl font-bold">200+</div>
                <div className="text-sm text-muted-foreground">Absolvições</div>
              </div>
              <div>
                <Award className="h-10 w-10 mx-auto mb-2 text-orange-600" />
                <div className="text-2xl font-bold">88%</div>
                <div className="text-sm text-muted-foreground">Taxa de Sucesso</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <AgitationSection
        problem="Uma acusação criminal pode destruir sua vida, carreira e família. Sem defesa técnica adequada, você pode ser condenado injustamente ou receber uma pena muito maior do que deveria."
        agitationPoints={[
          'Prisão preventiva mantém você preso durante todo o processo sem defesa adequada',
          'Depoimentos sem advogado podem incriminar você mesmo sendo inocente',
          'Falta de conhecimento técnico resulta em perda de prazos e oportunidades de defesa',
          'Acordos prejudiciais aceitos por desespero e falta de orientação',
          'Condenações excessivas por ausência de estratégia defensiva',
          'Antecedentes criminais destroem oportunidades profissionais e pessoais'
        ]}
      />

      <SolutionSection
        title="Como Protegemos Você na Área Criminal"
        subtitle="Defesa técnica completa em todas as fases do processo"
        solutionSteps={[
          'Atendimento URGENTE 24h - Advogado disponível imediatamente para flagrantes',
          'Análise estratégica - Avaliamos todas as provas e possibilidades de defesa',
          'Habeas corpus - Liberdade provisória e relaxamento de prisão ilegal',
          'Defesa no inquérito - Acompanhamento policial e orientação em depoimentos',
          'Defesa processual - Estratégia completa no processo criminal',
          'Recursos e revisões - Atuação em todas as instâncias até o STJ/STF'
        ]}
        onCTA={handleCTA}
      />

      {/* Services Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-4">Nossos Serviços de Defesa Criminal</h2>
            <p className="text-center text-muted-foreground mb-12">
              Proteção completa em todas as fases do processo criminal
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Flagrante */}
              <Card>
                <CardContent className="pt-6">
                  <Phone className="h-12 w-12 text-violet-600 mb-4" />
                  <h3 className="text-2xl font-bold mb-2">Flagrante</h3>
                  <p className="text-muted-foreground mb-4">
                    Atendimento imediato em prisão
                  </p>
                  <ul className="space-y-2 mb-6">
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">Atendimento 24h na delegacia</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">Orientação em depoimento</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">Habeas corpus preventivo</span>
                    </li>
                  </ul>
                  <div className="text-2xl font-bold text-violet-600 mb-2">R$ 5.000+</div>
                  <Button variant="outline" className="w-full border-violet-600 text-violet-600 hover:bg-violet-50" onClick={handleCTA}>
                    Atendimento Urgente
                  </Button>
                </CardContent>
              </Card>

              {/* Defesa Completa */}
              <Card className="border-violet-600 border-2 shadow-lg relative">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="bg-yellow-500 text-white px-4 py-2 rounded-full text-sm font-bold">
                    ⭐ MAIS COMPLETO
                  </span>
                </div>
                <CardContent className="pt-6">
                  <Shield className="h-12 w-12 text-green-600 mb-4" />
                  <h3 className="text-2xl font-bold mb-2">Defesa Completa</h3>
                  <p className="text-muted-foreground mb-4">
                    Acompanhamento em todo o processo
                  </p>
                  <ul className="space-y-2 mb-6">
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">Defesa no inquérito policial</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">Atuação no processo criminal</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">Recursos em todas instâncias</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">Audiências e sustentações</span>
                    </li>
                  </ul>
                  <div className="text-2xl font-bold text-violet-600 mb-1">A partir de</div>
                  <div className="text-xl font-bold text-violet-600 mb-4">R$ 15.000</div>
                  <Button className="w-full text-lg bg-violet-600 hover:bg-violet-700" onClick={handleCTA}>
                    <Zap className="h-5 w-5 mr-2" />
                    Contratar Defesa
                  </Button>
                </CardContent>
              </Card>

              {/* Habeas Corpus */}
              <Card>
                <CardContent className="pt-6">
                  <Scale className="h-12 w-12 text-purple-600 mb-4" />
                  <h3 className="text-2xl font-bold mb-2">Habeas Corpus</h3>
                  <p className="text-muted-foreground mb-4">
                    Liberdade provisória e relaxamento
                  </p>
                  <ul className="space-y-2 mb-6">
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">Análise de legalidade da prisão</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">Elaboração de HC urgente</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">Peticionamento imediato</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">Sustentação oral</span>
                    </li>
                  </ul>
                  <div className="text-2xl font-bold text-violet-600 mb-1">R$ 8.000+</div>
                  <div className="text-sm text-muted-foreground mb-4">Urgência 24-48h</div>
                  <Button variant="outline" className="w-full border-violet-600 text-violet-600 hover:bg-violet-50" onClick={handleCTA}>
                    Solicitar HC
                  </Button>
                </CardContent>
              </Card>
            </div>

            <div className="mt-8 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border-l-4 border-red-500">
              <p className="text-sm">
                🚨 <strong>ATENÇÃO:</strong> Em caso de prisão em flagrante, entre em contato IMEDIATAMENTE. Os primeiros momentos são cruciais para sua defesa!
              </p>
            </div>
          </div>
        </div>
      </section>

      <CredentialsSection
        lawyerName="Equipe Criminal Garcez Palha"
        experience="15+ anos em Direito Criminal"
        specialization="Criminalistas Especializados em Defesas Complexas"
        stats={{
          years: 15,
          cases: 400,
          successRate: 88,
          clients: 350,
        }}
      />

      <TestimonialsSection />

      <GuaranteeSection
        guaranteeTitle="Atendimento 24 Horas"
        guaranteeDescription="Plantão criminal para casos urgentes. Advogado disponível imediatamente para atender flagrantes e situações emergenciais."
        guaranteePeriod="24 horas"
      />

      {/* Final CTA */}
      <section className="py-16 bg-gradient-to-r from-violet-600 to-purple-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Não Deixe Sua Liberdade em Risco
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Advogados criminalistas experientes prontos para sua defesa imediata.
            <strong className="block mt-2">Atendimento 24h • Sigilo Absoluto • Estratégia Defensiva Completa</strong>
          </p>
          <Button
            size="lg"
            className="bg-white text-violet-900 hover:bg-gray-100 text-xl px-12 py-8 font-bold shadow-2xl"
            onClick={handleCTA}
          >
            <Phone className="h-6 w-6 mr-2" />
            FALAR COM ADVOGADO AGORA
            <ArrowRight className="h-6 w-6 ml-2" />
          </Button>
          <p className="mt-4 text-sm">
            Mais de 350 clientes já tiveram sua liberdade e direitos protegidos
          </p>
        </div>
      </section>
    </div>
  )
}
