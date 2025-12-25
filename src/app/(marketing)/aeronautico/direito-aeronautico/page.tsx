'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Check, Shield, Clock, Award, ArrowRight, AlertTriangle,
  TrendingUp, Users, Star, Zap, FileText, Plane, CircleDollarSign
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

export default function DireitoAeronauticoPage() {
  const router = useRouter()

  const handleCTA = () => {
    router.push('/checkout?product=direito-aeronautico')
  }

  return (
    <div className="min-h-screen">
      <SEOHead
        title="Direito Aeronáutico - Problemas com Companhias Aéreas"
        description="Voo cancelado, atraso ou bagagem extraviada? Indenização por danos em viagens aéreas. Especialistas em direito do consumidor aeronáutico."
        keywords={['direito aeronáutico', 'voo cancelado', 'atraso voo', 'bagagem extraviada', 'indenização companhia aérea', 'overbooking']}
        productName="Direito Aeronáutico"
        price={200000}
        category="aeronautico"
        canonicalUrl="https://garcezpalha.com.br/direito-aeronautico"
      />

      <UrgencyBanner
        countdown={true}
        countdownMinutes={60}
        message="✈️ ANÁLISE GRATUITA - Descubra se você tem direito a indenização"
        discount="ANÁLISE GRÁTIS"
        onCTA={handleCTA}
        ctaText="Verificar Meu Caso"
      />

      <WhatsAppFloat
        phoneNumber="5511999999999"
        message="Olá! Tive problemas com voo e quero verificar se tenho direito a indenização."
        position="bottom-right"
        showTooltip={true}
      />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-sky-50 to-blue-50 dark:from-sky-950/20 dark:to-blue-950/20 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-sky-600 text-white px-4 py-2 rounded-full mb-6">
              <Plane className="h-5 w-5" />
              <span className="font-semibold">Direito do Consumidor Aeronáutico</span>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Problemas com Voo?<br />
              <span className="text-sky-600">Você Tem Direito a Indenização!</span>
            </h1>

            <p className="text-xl text-muted-foreground mb-8">
              Voo cancelado, atraso, overbooking, bagagem extraviada ou danificada?<br />
              Especialistas em conseguir sua indenização de companhias aéreas.
            </p>

            <div className="bg-white dark:bg-gray-900 rounded-lg p-6 mb-8 border-l-4 border-sky-600">
              <div className="flex items-start gap-3 text-left">
                <CircleDollarSign className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold mb-2">Você Sabia?</h3>
                  <p className="text-muted-foreground">
                    Atrasos acima de 4 horas, cancelamentos e overbooking podem gerar indenizações de R$ 5.000 a R$ 30.000
                    por passageiro, dependendo do caso. E você só paga se ganhar!
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="bg-white dark:bg-gray-900 px-4 py-3 rounded-lg border border-sky-200">
                <div className="text-3xl font-bold text-sky-600">SÓ PAGA</div>
                <div className="text-sm">Se Ganhar</div>
              </div>
              <div className="bg-white dark:bg-gray-900 px-4 py-3 rounded-lg border border-sky-200">
                <div className="text-3xl font-bold text-sky-600">10+</div>
                <div className="text-sm">Anos Experiência</div>
              </div>
              <div className="bg-white dark:bg-gray-900 px-4 py-3 rounded-lg border border-sky-200">
                <div className="text-3xl font-bold text-sky-600">1000+</div>
                <div className="text-sm">Casos Ganhos</div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="text-xl px-10 py-8 font-bold shadow-xl bg-sky-600 hover:bg-sky-700"
                onClick={handleCTA}
              >
                <Plane className="h-6 w-6 mr-2" />
                VERIFICAR MEU CASO GRÁTIS
                <ArrowRight className="h-6 w-6 ml-2" />
              </Button>
            </div>

            <p className="mt-4 text-sm text-muted-foreground">
              ⚡ Análise gratuita em 24h • Sem custos antecipados • Só paga no êxito
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
                <div className="text-2xl font-bold">1000+</div>
                <div className="text-sm text-muted-foreground">Casos Ganhos</div>
              </div>
              <div>
                <Users className="h-10 w-10 mx-auto mb-2 text-green-600" />
                <div className="text-2xl font-bold">800+</div>
                <div className="text-sm text-muted-foreground">Passageiros Indenizados</div>
              </div>
              <div>
                <TrendingUp className="h-10 w-10 mx-auto mb-2 text-purple-600" />
                <div className="text-2xl font-bold">R$ 5M+</div>
                <div className="text-sm text-muted-foreground">Recuperado para Clientes</div>
              </div>
              <div>
                <Award className="h-10 w-10 mx-auto mb-2 text-orange-600" />
                <div className="text-2xl font-bold">93%</div>
                <div className="text-sm text-muted-foreground">Taxa de Sucesso</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <AgitationSection
        problem="As companhias aéreas lucram bilhões enquanto desrespeitam seus passageiros diariamente. Sem ação jurídica, você fica sem indenização e elas continuam descumprindo a lei impunemente."
        agitationPoints={[
          'Cancelamentos e atrasos sem assistência ou justificativa adequada',
          'Overbooking deixa você sem embarcar mesmo com passagem confirmada',
          'Bagagens extraviadas, danificadas ou com conteúdo furtado',
          'Recusa de reembolso ou remarcação gratuita em seus direitos',
          'Descaso e falta de respeito no atendimento ao passageiro',
          'Viagens arruinadas, compromissos perdidos e danos morais não reparados'
        ]}
      />

      <SolutionSection
        title="Como Conseguimos Sua Indenização"
        subtitle="Processo completo sem custos antecipados para você"
        solutionSteps={[
          'Análise GRATUITA do caso - Verificamos documentos e viabilidade',
          'Coleta de provas - Reunimos bilhetes, comprovantes e testemunhos',
          'Reclamação na ANAC - Registro formal antes da ação judicial',
          'Ação judicial estratégica - Processo fundamentado com jurisprudência favorável',
          'Acordo ou sentença - Negociação ou julgamento conforme melhor estratégia',
          'Recebimento da indenização - Você recebe e nos paga apenas a taxa de êxito'
        ]}
        onCTA={handleCTA}
      />

      {/* Services Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-4">Tipos de Casos que Atendemos</h2>
            <p className="text-center text-muted-foreground mb-12">
              Indenização em diversas situações de problemas aéreos
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Atraso/Cancelamento */}
              <Card>
                <CardContent className="pt-6">
                  <Clock className="h-12 w-12 text-sky-600 mb-4" />
                  <h3 className="text-2xl font-bold mb-2">Atraso/Cancelamento</h3>
                  <p className="text-muted-foreground mb-4">
                    Voo atrasado ou cancelado
                  </p>
                  <ul className="space-y-2 mb-6">
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">Atraso superior a 4 horas</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">Cancelamento sem aviso prévio</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">Falta de assistência adequada</span>
                    </li>
                  </ul>
                  <div className="text-2xl font-bold text-sky-600 mb-1">R$ 5k - R$ 15k</div>
                  <div className="text-sm text-muted-foreground mb-4">Indenização típica</div>
                  <Button variant="outline" className="w-full border-sky-600 text-sky-600 hover:bg-sky-50" onClick={handleCTA}>
                    Verificar Caso
                  </Button>
                </CardContent>
              </Card>

              {/* Overbooking */}
              <Card className="border-sky-600 border-2 shadow-lg relative">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="bg-yellow-500 text-white px-4 py-2 rounded-full text-sm font-bold">
                    ⭐ MAIOR INDENIZAÇÃO
                  </span>
                </div>
                <CardContent className="pt-6">
                  <AlertTriangle className="h-12 w-12 text-red-600 mb-4" />
                  <h3 className="text-2xl font-bold mb-2">Overbooking</h3>
                  <p className="text-muted-foreground mb-4">
                    Negativa de embarque por sobrevenda
                  </p>
                  <ul className="space-y-2 mb-6">
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">Recusa de embarque com reserva</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">Voo lotado propositalmente</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">Downgrade de classe</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">Perda de conexões importantes</span>
                    </li>
                  </ul>
                  <div className="text-2xl font-bold text-sky-600 mb-1">R$ 10k - R$ 30k</div>
                  <div className="text-sm text-muted-foreground mb-4">Indenização típica</div>
                  <Button className="w-full text-lg bg-sky-600 hover:bg-sky-700" onClick={handleCTA}>
                    <Zap className="h-5 w-5 mr-2" />
                    Processar Agora
                  </Button>
                </CardContent>
              </Card>

              {/* Bagagem */}
              <Card>
                <CardContent className="pt-6">
                  <FileText className="h-12 w-12 text-purple-600 mb-4" />
                  <h3 className="text-2xl font-bold mb-2">Bagagem</h3>
                  <p className="text-muted-foreground mb-4">
                    Extravio ou dano à bagagem
                  </p>
                  <ul className="space-y-2 mb-6">
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">Bagagem extraviada</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">Bagagem danificada ou violada</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">Atraso na entrega</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">Furto de conteúdo</span>
                    </li>
                  </ul>
                  <div className="text-2xl font-bold text-sky-600 mb-1">R$ 3k - R$ 10k</div>
                  <div className="text-sm text-muted-foreground mb-4">+ danos materiais</div>
                  <Button variant="outline" className="w-full border-sky-600 text-sky-600 hover:bg-sky-50" onClick={handleCTA}>
                    Reclamar Bagagem
                  </Button>
                </CardContent>
              </Card>
            </div>

            <div className="mt-8 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border-l-4 border-green-500">
              <p className="text-sm">
                💰 <strong>Modelo de Cobrança:</strong> Taxa fixa de R$ 2.000 + 30% do valor recuperado. Você só paga se ganhar!
              </p>
            </div>
          </div>
        </div>
      </section>

      <CredentialsSection
        lawyerName="Equipe Aeronáutica Garcez Palha"
        experience="10+ anos em Direito Aeronáutico"
        specialization="Especialistas em Indenização de Companhias Aéreas"
        stats={{
          years: 10,
          cases: 1000,
          successRate: 93,
          clients: 800,
        }}
      />

      <TestimonialsSection />

      <GuaranteeSection
        guaranteeTitle="Análise Gratuita + Só Paga Se Ganhar"
        guaranteeDescription="Analisamos seu caso gratuitamente e você só paga honorários se conseguirmos sua indenização. Sem riscos financeiros."
        guaranteePeriod="sem custos antecipados"
      />

      {/* Final CTA */}
      <section className="py-16 bg-gradient-to-r from-sky-600 to-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Você Merece Ser Indenizado
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Não deixe as companhias aéreas lucrarem com o desrespeito ao consumidor.
            <strong className="block mt-2">Análise Grátis • Sem Custos Antecipados • Só Paga Se Ganhar</strong>
          </p>
          <Button
            size="lg"
            className="bg-white text-sky-900 hover:bg-gray-100 text-xl px-12 py-8 font-bold shadow-2xl"
            onClick={handleCTA}
          >
            <Plane className="h-6 w-6 mr-2" />
            VERIFICAR MEU CASO GRÁTIS
            <ArrowRight className="h-6 w-6 ml-2" />
          </Button>
          <p className="mt-4 text-sm">
            Mais de 800 passageiros já foram indenizados - Total recuperado: R$ 5+ milhões
          </p>
        </div>
      </section>
    </div>
  )
}
