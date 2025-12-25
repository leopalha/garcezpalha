'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Check, Shield, Clock, Award, ArrowRight, AlertTriangle,
  TrendingUp, Users, Star, Zap, FileText, CreditCard, DollarSign
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

export default function NegativacaoIndevidaPage() {
  const router = useRouter()

  const handleCTA = () => {
    router.push('/checkout?product=negativacao-indevida')
  }

  return (
    <div className="min-h-screen">
      <SEOHead
        title="Negativação Indevida - Limpe seu Nome + Indenização | Garcez Palha"
        description="Nome sujo sem dever? Removemos negativação indevida em 48h e garantimos indenização de até R$ 15 mil. Limpeza definitiva do CPF/CNPJ."
        keywords={['negativação indevida', 'limpar nome', 'remover negativação', 'indenização serasa', 'spc indevido', 'danos morais negativação']}
        productName="Negativação Indevida"
        price={180000}
        category="financeiro"
        canonicalUrl="https://garcezpalha.com.br/financeiro/negativacao-indevida"
      />

      <UrgencyBanner
        countdown={true}
        countdownMinutes={60}
        message="⚠️ NOME SUJO INDEVIDAMENTE? Limpeza em 48h + Indenização até R$ 15 mil"
        discount="CONSULTA GRÁTIS"
        onCTA={handleCTA}
        ctaText="Limpar Meu Nome Agora"
      />

      <WhatsAppFloat
        phoneNumber="5511999999999"
        message="Olá! Meu nome está negativado indevidamente e preciso de ajuda."
        position="bottom-right"
        showTooltip={true}
      />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-full mb-6">
              <CreditCard className="h-5 w-5" />
              <span className="font-semibold">Limpeza de Nome</span>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Nome Sujo Sem Dever?<br />
              <span className="text-primary">Limpe + Receba Indenização</span>
            </h1>

            <p className="text-xl text-muted-foreground mb-8">
              Removemos negativação indevida em 48h e garantimos indenização de R$ 5 mil a R$ 15 mil.<br />
              Limpeza definitiva do CPF/CNPJ com pedido de danos morais.
            </p>

            <div className="bg-white dark:bg-gray-900 rounded-lg p-6 mb-8 border-l-4 border-blue-600">
              <div className="flex items-start gap-3 text-left">
                <AlertTriangle className="h-6 w-6 text-blue-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold mb-2">Você Sabia?</h3>
                  <p className="text-muted-foreground">
                    Negativação indevida gera direito a indenização por danos morais entre R$ 5.000 e R$ 15.000,
                    além da limpeza imediata do nome. Muitas pessoas têm esse direito e não sabem.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-white dark:bg-gray-900 px-4 py-3 rounded-lg border border-blue-200">
                <div className="text-3xl font-bold text-blue-600">48h</div>
                <div className="text-sm">Limpeza com Liminar</div>
              </div>
              <div className="bg-white dark:bg-gray-900 px-4 py-3 rounded-lg border border-blue-200">
                <div className="text-3xl font-bold text-blue-600">R$ 15k</div>
                <div className="text-sm">Indenização Máxima</div>
              </div>
              <div className="bg-white dark:bg-gray-900 px-4 py-3 rounded-lg border border-blue-200">
                <div className="text-3xl font-bold text-blue-600">800+</div>
                <div className="text-sm">Nomes Limpos</div>
              </div>
              <div className="bg-white dark:bg-gray-900 px-4 py-3 rounded-lg border border-blue-200">
                <div className="text-3xl font-bold text-blue-600">100%</div>
                <div className="text-sm">Online</div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="text-xl px-10 py-8 font-bold shadow-xl"
                onClick={handleCTA}
              >
                <CreditCard className="h-6 w-6 mr-2" />
                LIMPAR MEU NOME AGORA
                <ArrowRight className="h-6 w-6 ml-2" />
              </Button>
            </div>

            <p className="mt-4 text-sm text-muted-foreground">
              ⚡ Análise gratuita • Limpeza em 48h • Indenização garantida
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
                <CreditCard className="h-10 w-10 mx-auto mb-2 text-blue-600" />
                <div className="text-2xl font-bold">800+</div>
                <div className="text-sm text-muted-foreground">Nomes Limpos</div>
              </div>
              <div>
                <Clock className="h-10 w-10 mx-auto mb-2 text-green-600" />
                <div className="text-2xl font-bold">24-48h</div>
                <div className="text-sm text-muted-foreground">Limpeza Rápida</div>
              </div>
              <div>
                <DollarSign className="h-10 w-10 mx-auto mb-2 text-purple-600" />
                <div className="text-2xl font-bold">R$ 8,5k</div>
                <div className="text-sm text-muted-foreground">Indenização Média</div>
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
        problem="Nome negativado indevidamente impede financiamentos, empréstimos, compras parceladas e até oportunidades de emprego. Além do prejuízo financeiro, causa constrangimento e stress."
        agitationPoints={[
          'Não consegue fazer empréstimos ou financiamentos',
          'Compras parceladas recusadas em lojas',
          'Cartões de crédito negados ou cancelados',
          'Oportunidades de emprego perdidas por nome sujo',
          'Constrangimento ao ser recusado em estabelecimentos',
          'Dificuldade para alugar imóvel ou abrir conta bancária',
        ]}
      />

      <SolutionSection
        title="Como Limpamos Seu Nome e Garantimos Indenização"
        subtitle="Processo completo de limpeza e reparação por danos morais"
        solutionSteps={[
          'Análise GRATUITA da negativação - Verificamos se é indevida e seu direito',
          'Consulta completa Serasa/SPC/Boa Vista - Identificamos todas as negativações',
          'Petição com liminar urgente - Solicitamos limpeza imediata (24-48h)',
          'Pedido de indenização - Danos morais entre R$ 5.000 e R$ 15.000',
          'Limpeza definitiva do CPF/CNPJ - Nome limpo para crédito imediato',
          'Acompanhamento até indenização - Garantimos pagamento total',
        ]}
        onCTA={handleCTA}
      />

      {/* Services Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-4">Planos de Limpeza de Nome</h2>
            <p className="text-center text-muted-foreground mb-12">
              Escolha o plano ideal para sua situação
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Notificação */}
              <Card>
                <CardContent className="pt-6">
                  <FileText className="h-12 w-12 text-blue-600 mb-4" />
                  <h3 className="text-2xl font-bold mb-2">Notificação</h3>
                  <p className="text-muted-foreground mb-4">
                    Ideal para casos simples
                  </p>
                  <ul className="space-y-2 mb-6">
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">Análise da negativação</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">Notificação extrajudicial</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">Prazo 10 dias resposta</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">Suporte WhatsApp</span>
                    </li>
                  </ul>
                  <div className="text-2xl font-bold text-primary mb-2">R$ 397</div>
                  <Button variant="outline" className="w-full" onClick={handleCTA}>
                    Notificar Empresa
                  </Button>
                </CardContent>
              </Card>

              {/* Limpeza com Liminar */}
              <Card className="border-primary border-2 shadow-lg relative">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="bg-yellow-500 text-white px-4 py-2 rounded-full text-sm font-bold">
                    ⭐ MAIS PROCURADO
                  </span>
                </div>
                <CardContent className="pt-6">
                  <Zap className="h-12 w-12 text-green-600 mb-4" />
                  <h3 className="text-2xl font-bold mb-2">Limpeza Urgente</h3>
                  <p className="text-muted-foreground mb-4">
                    Remoção garantida em 24-48h
                  </p>
                  <ul className="space-y-2 mb-6">
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">Tudo da Notificação</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">Ação judicial com liminar</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">Limpeza em 24-48h</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">Certidão regularização</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">Garantia limpeza nome</span>
                    </li>
                  </ul>
                  <div className="text-2xl font-bold text-primary mb-1">R$ 897</div>
                  <div className="text-sm text-muted-foreground mb-4">ou 12x sem juros</div>
                  <Button className="w-full text-lg" onClick={handleCTA}>
                    <Zap className="h-5 w-5 mr-2" />
                    Limpar Agora
                  </Button>
                </CardContent>
              </Card>

              {/* Limpeza + Indenização */}
              <Card>
                <CardContent className="pt-6">
                  <DollarSign className="h-12 w-12 text-purple-600 mb-4" />
                  <h3 className="text-2xl font-bold mb-2">Limpeza + Indenização</h3>
                  <p className="text-muted-foreground mb-4">
                    Limpeza + R$ 5-15 mil de indenização
                  </p>
                  <ul className="space-y-2 mb-6">
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">Tudo da Limpeza Urgente</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">Pedido de danos morais</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">R$ 5.000 a R$ 15.000</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">Custas da empresa</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">Só paga se ganhar</span>
                    </li>
                  </ul>
                  <div className="text-2xl font-bold text-primary mb-1">R$ 1.800</div>
                  <div className="text-sm text-muted-foreground mb-4">+ 20% da indenização</div>
                  <Button variant="outline" className="w-full" onClick={handleCTA}>
                    Quero Indenização
                  </Button>
                </CardContent>
              </Card>
            </div>

            <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border-l-4 border-blue-500">
              <p className="text-sm">
                💡 <strong>Indenização Média:</strong> Nossos clientes recebem em média R$ 8.500 por negativação indevida + limpeza completa do nome.
              </p>
            </div>
          </div>
        </div>
      </section>

      <CredentialsSection
        lawyerName="Equipe Garcez Palha"
        experience="12+ anos em Direito do Consumidor"
        specialization="Especialistas em Negativação Indevida e Defesa do Consumidor"
        stats={{
          years: 12,
          cases: 800,
          successRate: 92,
          clients: 1000,
        }}
      />

      <TestimonialsSection />

      <GuaranteeSection
        guaranteeTitle="Limpeza Garantida em 48h ou Dinheiro de Volta"
        guaranteeDescription="Se não conseguirmos a liminar de limpeza do seu nome em 48h, devolvemos 100% do valor pago. Nossa taxa de sucesso é de 92%."
        guaranteePeriod="48 horas"
      />

      {/* Final CTA */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Limpe Seu Nome e Receba Indenização
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Nome limpo em 48h + indenização de R$ 5-15 mil por danos morais.
            <strong className="block mt-2">800+ nomes limpos • 92% de sucesso • 100% online</strong>
          </p>
          <Button
            size="lg"
            className="bg-white text-blue-900 hover:bg-gray-100 text-xl px-12 py-8 font-bold shadow-2xl"
            onClick={handleCTA}
          >
            <CreditCard className="h-6 w-6 mr-2" />
            LIMPAR MEU NOME AGORA
            <ArrowRight className="h-6 w-6 ml-2" />
          </Button>
          <p className="mt-4 text-sm">
            Análise gratuita • Sem compromisso • Resposta em 24h
          </p>
        </div>
      </section>
    </div>
  )
}
