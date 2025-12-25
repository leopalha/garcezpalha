'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Check, Shield, Clock, Award, ArrowRight, AlertTriangle,
  TrendingUp, Users, Star, Zap, FileText, Home, Key
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

export default function DireitoImobiliarioPage() {
  const router = useRouter()

  const handleCTA = () => {
    router.push('/checkout?product=direito-imobiliario')
  }

  return (
    <div className="min-h-screen">
      <SEOHead
        title="Direito Imobiliário - Compra, Venda e Regularização"
        description="Problemas com imóvel? Compra, venda, regularização, usucapião e questões condominiais. Advogados especializados em direito imobiliário."
        keywords={['direito imobiliário', 'advogado imobiliário', 'compra venda imóvel', 'usucapião', 'regularização imóvel']}
        productName="Direito Imobiliário"
        price={50000}
        category="patrimonial"
        canonicalUrl="https://garcezpalha.com.br/direito-imobiliario"
      />

      <UrgencyBanner
        countdown={true}
        countdownMinutes={60}
        message="🏠 CONSULTA IMOBILIÁRIA - R$ 500 - Análise completa do seu caso"
        discount="CONSULTA R$ 500"
        onCTA={handleCTA}
        ctaText="Agendar Consulta"
      />

      <WhatsAppFloat
        phoneNumber="5511999999999"
        message="Olá! Preciso de orientação sobre direito imobiliário."
        position="bottom-right"
        showTooltip={true}
      />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/20 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-full mb-6">
              <Home className="h-5 w-5" />
              <span className="font-semibold">Direito Imobiliário</span>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Problemas com Imóvel?<br />
              <span className="text-emerald-600">Proteja Seu Patrimônio</span>
            </h1>

            <p className="text-xl text-muted-foreground mb-8">
              Compra, venda, regularização, usucapião e questões condominiais.<br />
              Consultoria especializada para proteger seu maior investimento.
            </p>

            <div className="bg-white dark:bg-gray-900 rounded-lg p-6 mb-8 border-l-4 border-emerald-600">
              <div className="flex items-start gap-3 text-left">
                <AlertTriangle className="h-6 w-6 text-yellow-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold mb-2">Cuidado com Negócios Imobiliários!</h3>
                  <p className="text-muted-foreground">
                    Comprar ou vender um imóvel sem assessoria jurídica pode resultar em prejuízos de centenas de milhares de reais.
                    Vícios ocultos, documentação irregular e cláusulas abusivas são armadilhas comuns.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="bg-white dark:bg-gray-900 px-4 py-3 rounded-lg border border-emerald-200">
                <div className="text-3xl font-bold text-emerald-600">R$ 500</div>
                <div className="text-sm">Consulta Especializada</div>
              </div>
              <div className="bg-white dark:bg-gray-900 px-4 py-3 rounded-lg border border-emerald-200">
                <div className="text-3xl font-bold text-emerald-600">15+</div>
                <div className="text-sm">Anos Experiência</div>
              </div>
              <div className="bg-white dark:bg-gray-900 px-4 py-3 rounded-lg border border-emerald-200">
                <div className="text-3xl font-bold text-emerald-600">300+</div>
                <div className="text-sm">Casos Resolvidos</div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="text-xl px-10 py-8 font-bold shadow-xl bg-emerald-600 hover:bg-emerald-700"
                onClick={handleCTA}
              >
                <Home className="h-6 w-6 mr-2" />
                AGENDAR CONSULTA R$ 500
                <ArrowRight className="h-6 w-6 ml-2" />
              </Button>
            </div>

            <p className="mt-4 text-sm text-muted-foreground">
              ⚡ Atendimento presencial ou online • Análise de documentos • Orientação completa
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
                <Home className="h-10 w-10 mx-auto mb-2 text-emerald-600" />
                <div className="text-2xl font-bold">300+</div>
                <div className="text-sm text-muted-foreground">Casos Resolvidos</div>
              </div>
              <div>
                <Users className="h-10 w-10 mx-auto mb-2 text-green-600" />
                <div className="text-2xl font-bold">250+</div>
                <div className="text-sm text-muted-foreground">Clientes Satisfeitos</div>
              </div>
              <div>
                <TrendingUp className="h-10 w-10 mx-auto mb-2 text-purple-600" />
                <div className="text-2xl font-bold">R$ 50M+</div>
                <div className="text-sm text-muted-foreground">Patrimônio Protegido</div>
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
        problem="Negócios imobiliários envolvem valores altíssimos e podem gerar problemas que duram anos. Sem orientação jurídica adequada, você pode perder seu patrimônio ou ficar preso em litígios intermináveis."
        agitationPoints={[
          'Comprar imóvel com documentação irregular ou dívidas ocultas',
          'Contratos com cláusulas abusivas que prejudicam o comprador',
          'Problemas de usucapião e posse não regularizada',
          'Vizinhos invasivos e questões de condomínio mal resolvidas',
          'Imóveis herdados sem inventário ou partilha regularizada',
          'Atrasos em obras e descumprimento de construtoras'
        ]}
      />

      <SolutionSection
        title="Como Protegemos Seu Patrimônio Imobiliário"
        subtitle="Consultoria completa em todas as fases do negócio"
        solutionSteps={[
          'Análise de documentação - Verificamos certidões, matrículas e regularidade do imóvel',
          'Due diligence completa - Investigamos débitos, ônus e restrições',
          'Elaboração de contratos - Documentos seguros que protegem seus interesses',
          'Regularização de imóveis - Usucapião, retificação de área, averbações',
          'Questões condominiais - Defesa em assembleias e cobrança de taxas',
          'Acompanhamento judicial - Resolução de litígios imobiliários'
        ]}
        onCTA={handleCTA}
      />

      {/* Services Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-4">Nossos Serviços Imobiliários</h2>
            <p className="text-center text-muted-foreground mb-12">
              Soluções completas para proteger seu patrimônio
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Consultoria */}
              <Card>
                <CardContent className="pt-6">
                  <FileText className="h-12 w-12 text-emerald-600 mb-4" />
                  <h3 className="text-2xl font-bold mb-2">Consultoria</h3>
                  <p className="text-muted-foreground mb-4">
                    Análise e orientação especializada
                  </p>
                  <ul className="space-y-2 mb-6">
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">Análise de documentação</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">Orientação jurídica</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">Parecer técnico</span>
                    </li>
                  </ul>
                  <div className="text-2xl font-bold text-emerald-600 mb-2">R$ 500</div>
                  <Button variant="outline" className="w-full border-emerald-600 text-emerald-600 hover:bg-emerald-50" onClick={handleCTA}>
                    Agendar Consulta
                  </Button>
                </CardContent>
              </Card>

              {/* Contratos */}
              <Card className="border-emerald-600 border-2 shadow-lg relative">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="bg-yellow-500 text-white px-4 py-2 rounded-full text-sm font-bold">
                    ⭐ MAIS PROCURADO
                  </span>
                </div>
                <CardContent className="pt-6">
                  <Key className="h-12 w-12 text-green-600 mb-4" />
                  <h3 className="text-2xl font-bold mb-2">Compra/Venda</h3>
                  <p className="text-muted-foreground mb-4">
                    Assessoria completa em negociação
                  </p>
                  <ul className="space-y-2 mb-6">
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">Due diligence completa</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">Elaboração de contratos</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">Acompanhamento no cartório</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">Garantia pós-venda</span>
                    </li>
                  </ul>
                  <div className="text-2xl font-bold text-emerald-600 mb-1">1% do valor</div>
                  <div className="text-sm text-muted-foreground mb-4">Mínimo R$ 3.000</div>
                  <Button className="w-full text-lg bg-emerald-600 hover:bg-emerald-700" onClick={handleCTA}>
                    <Zap className="h-5 w-5 mr-2" />
                    Contratar Agora
                  </Button>
                </CardContent>
              </Card>

              {/* Regularização */}
              <Card>
                <CardContent className="pt-6">
                  <Shield className="h-12 w-12 text-purple-600 mb-4" />
                  <h3 className="text-2xl font-bold mb-2">Regularização</h3>
                  <p className="text-muted-foreground mb-4">
                    Usucapião e regularização fundiária
                  </p>
                  <ul className="space-y-2 mb-6">
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">Usucapião judicial/extrajudicial</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">Retificação de área</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">Registro de construções</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">Averbações diversas</span>
                    </li>
                  </ul>
                  <div className="text-2xl font-bold text-emerald-600 mb-1">A partir de</div>
                  <div className="text-xl font-bold text-emerald-600 mb-4">R$ 5.000</div>
                  <Button variant="outline" className="w-full border-emerald-600 text-emerald-600 hover:bg-emerald-50" onClick={handleCTA}>
                    Regularizar Imóvel
                  </Button>
                </CardContent>
              </Card>
            </div>

            <div className="mt-8 p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg border-l-4 border-emerald-500">
              <p className="text-sm">
                💡 <strong>Dica Importante:</strong> Sempre faça uma consulta jurídica ANTES de assinar qualquer contrato imobiliário. Prevenir é muito mais barato que remediar!
              </p>
            </div>
          </div>
        </div>
      </section>

      <CredentialsSection
        lawyerName="Equipe Garcez Palha"
        experience="15+ anos em Direito Imobiliário"
        specialization="Especialistas em Transações e Regularização Imobiliária"
        stats={{
          years: 15,
          cases: 300,
          successRate: 95,
          clients: 250,
        }}
      />

      <TestimonialsSection />

      <GuaranteeSection
        guaranteeTitle="Consulta Especializada por R$ 500"
        guaranteeDescription="Análise completa da sua situação com parecer técnico detalhado. Investimento que pode economizar milhares de reais."
        guaranteePeriod="1 hora de consultoria"
      />

      {/* Final CTA */}
      <section className="py-16 bg-gradient-to-r from-emerald-600 to-teal-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Proteja Seu Patrimônio Imobiliário
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Não arrisque seu maior investimento. Consultoria especializada por apenas R$ 500.
            <strong className="block mt-2">Presencial ou Online • Análise Completa • Parecer Técnico</strong>
          </p>
          <Button
            size="lg"
            className="bg-white text-emerald-900 hover:bg-gray-100 text-xl px-12 py-8 font-bold shadow-2xl"
            onClick={handleCTA}
          >
            <Home className="h-6 w-6 mr-2" />
            AGENDAR CONSULTA R$ 500
            <ArrowRight className="h-6 w-6 ml-2" />
          </Button>
          <p className="mt-4 text-sm">
            Mais de 250 clientes já protegeram seus imóveis conosco
          </p>
        </div>
      </section>
    </div>
  )
}
