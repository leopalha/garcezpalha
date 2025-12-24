'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Check, Shield, Clock, Award, ArrowRight, AlertTriangle,
  TrendingUp, Lock, Users, Star, Zap
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

export default function DesbloqueioContaPage() {
  const router = useRouter()

  const handleCTA = () => {
    router.push('/checkout?product=desbloqueio-conta')
  }

  return (
    <div className="min-h-screen">
      <SEOHead
        title="Desbloqueio de Conta Bancária em 72h"
        description="Conta bloqueada pelo banco? Desbloqueamos em até 72 horas ou seu dinheiro de volta. Art. 833 CPC protege seu salário."
        keywords={['desbloqueio conta bancária', 'conta bloqueada', 'advogado bancário', 'desbloquear conta']}
        productName="Desbloqueio de Conta Bancária"
        price={250000}
        category="financeiro"
        canonicalUrl="https://garcezpalha.com.br/desbloqueio-conta"
      />

      <UrgencyBanner
        countdown={true}
        countdownMinutes={30}
        message="🔥 Oferta Exclusiva: 10% OFF por tempo limitado"
        discount="10% OFF"
        onCTA={handleCTA}
        ctaText="Desbloquear Minha Conta Agora"
      />

      <WhatsAppFloat
        phoneNumber="5511999999999"
        message="Olá! Minha conta foi bloqueada e preciso de ajuda urgente."
        position="bottom-right"
        showTooltip={true}
      />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-950/20 dark:to-orange-950/20 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-full mb-6">
              <AlertTriangle className="h-5 w-5" />
              <span className="font-semibold">URGENTE: Conta Bloqueada</span>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Sua Conta Foi Bloqueada?<br />
              <span className="text-primary">Desbloqueamos em 72 Horas</span>
            </h1>

            <p className="text-xl text-muted-foreground mb-8">
              Advogado especialista em Direito Bancário com 100+ casos resolvidos.<br />
              Garantia de resultado ou seu dinheiro de volta.
            </p>

            <div className="bg-white dark:bg-gray-900 rounded-lg p-6 mb-8 border-l-4 border-red-600">
              <div className="flex items-start gap-3 text-left">
                <Shield className="h-6 w-6 text-red-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold mb-2">O Problema que Você Enfrenta Agora:</h3>
                  <p className="text-muted-foreground">
                    Sua conta foi bloqueada pelo banco sem aviso prévio? Não consegue pagar contas essenciais?
                    O Art. 833 do CPC protege seu salário até 50 salários mínimos. Você tem direitos!
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap justify-center gap-6 mb-8">
              <div className="flex items-center gap-2 bg-white dark:bg-gray-900 px-4 py-3 rounded-lg shadow">
                <Clock className="h-5 w-5 text-primary" />
                <span className="font-medium">Desbloqueio em 72h</span>
              </div>
              <div className="flex items-center gap-2 bg-white dark:bg-gray-900 px-4 py-3 rounded-lg shadow">
                <Award className="h-5 w-5 text-primary" />
                <span className="font-medium">95% Taxa de Sucesso</span>
              </div>
              <div className="flex items-center gap-2 bg-white dark:bg-gray-900 px-4 py-3 rounded-lg shadow">
                <Lock className="h-5 w-5 text-primary" />
                <span className="font-medium">Garantia Total</span>
              </div>
            </div>

            <Button size="lg" className="text-lg px-8 py-6" onClick={handleCTA}>
              <Zap className="h-5 w-5 mr-2" />
              Desbloquear Conta Agora - R$ 2.499
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
          </div>
        </div>
      </section>

      <AgitationSection
        problem="Sua conta bloqueada está impedindo você de viver normalmente. Cada dia que passa é mais um dia sem acesso ao seu próprio dinheiro."
        agitationPoints={[
          'Boletos vencendo e você sem poder pagar, gerando multas e juros',
          'Risco de ter nome negativado por débitos não pagos',
          'Impossibilidade de fazer compras essenciais para família',
        ]}
      />

      <SolutionSection
        title="Como Desbloqueamos Sua Conta em 72 Horas"
        subtitle="Processo jurídico comprovado e 100% online"
        solutionSteps={[
          'Análise gratuita em 5 minutos - Verificamos se seu caso se enquadra no Art. 833 CPC',
          'Petição urgente em 48h - Protocolo com pedido de tutela de urgência',
          'Proteção Art. 833 CPC - Garantimos impenhorabilidade do seu salário',
          'Atendimento 100% online - Sem sair de casa, por WhatsApp e videochamada',
          'Resultado em 72h ou reembolso - Garantia incondicional',
        ]}
        onCTA={handleCTA}
      />

      {/* Pricing Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-4">Escolha Seu Pacote</h2>
            <p className="text-center text-muted-foreground mb-12">
              Investimento acessível com pagamento facilitado
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Essencial */}
              <Card>
                <CardContent className="pt-6">
                  <h3 className="text-2xl font-bold mb-2">Essencial</h3>
                  <p className="text-muted-foreground mb-4">Desbloqueio básico</p>
                  <div className="text-4xl font-bold text-primary mb-6">R$ 1.999</div>
                  <ul className="space-y-3 mb-6">
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">Petição de desbloqueio</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">Protocolo urgente</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">Acompanhamento 30 dias</span>
                    </li>
                  </ul>
                  <Button variant="outline" className="w-full" onClick={handleCTA}>
                    Contratar Essencial
                  </Button>
                </CardContent>
              </Card>

              {/* Completo - RECOMENDADO */}
              <Card className="border-primary shadow-lg scale-105">
                <div className="bg-yellow-500 text-white text-center py-2 rounded-t-lg font-bold">
                  ⭐ MAIS ESCOLHIDO
                </div>
                <CardContent className="pt-6">
                  <h3 className="text-2xl font-bold mb-2">Completo</h3>
                  <p className="text-muted-foreground mb-4">Desbloqueio + Indenização</p>
                  <div className="text-4xl font-bold text-primary mb-6">R$ 3.499</div>
                  <ul className="space-y-3 mb-6">
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">Tudo do Essencial</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">Ação de danos morais</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">Acompanhamento até sentença</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">Garantia estendida 60 dias</span>
                    </li>
                  </ul>
                  <Button className="w-full" onClick={handleCTA}>
                    Contratar Completo
                  </Button>
                </CardContent>
              </Card>

              {/* Premium */}
              <Card>
                <CardContent className="pt-6">
                  <h3 className="text-2xl font-bold mb-2">Premium</h3>
                  <p className="text-muted-foreground mb-4">Proteção Total</p>
                  <div className="text-4xl font-bold text-primary mb-6">R$ 5.999</div>
                  <ul className="space-y-3 mb-6">
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">Tudo do Completo</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">Análise outros bloqueios</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">Revisão contratos bancários</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">Suporte prioritário vitalício</span>
                    </li>
                  </ul>
                  <Button variant="outline" className="w-full" onClick={handleCTA}>
                    Contratar Premium
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <CredentialsSection
        lawyerName="Dr. Garcez Palha"
        experience="15+ anos desbloqueando contas"
        specialization="Especialista em Direito Bancário"
        stats={{
          years: 15,
          cases: 300,
          successRate: 95,
          clients: 500,
        }}
      />

      <TestimonialsSection />

      <GuaranteeSection
        guaranteeTitle="Garantia Incondicional de 72 Horas"
        guaranteeDescription="Se não desbloquearmos sua conta em 72h, devolvemos 100% do valor"
        guaranteePeriod="72 horas"
      />

      {/* Final CTA */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Pronto para Desbloquear Sua Conta?</h2>
          <p className="text-xl mb-8 opacity-90">
            Não perca mais tempo. Cada hora conta quando sua conta está bloqueada.
          </p>
          <Button size="lg" variant="secondary" onClick={handleCTA} className="text-lg px-8 py-6">
            <Zap className="h-5 w-5 mr-2" />
            Desbloquear Agora - Garantia 72h
            <ArrowRight className="h-5 w-5 ml-2" />
          </Button>
        </div>
      </section>
    </div>
  )
}
