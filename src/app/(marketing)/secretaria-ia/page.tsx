'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Check, Shield, Clock, Award, ArrowRight, Bot,
  MessageSquare, Users, Star, Zap, Calendar, TrendingUp, PhoneCall
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

export default function SecretariaIAPage() {
  const router = useRouter()

  const handleCTA = () => {
    router.push('/checkout?product=secretaria-ia')
  }

  return (
    <div className="min-h-screen">
      <SEOHead
        title="Secretária Virtual IA Para Advogados - Automação Jurídica"
        description="Atendimento automatizado 24h para escritórios de advocacia. IA que atende WhatsApp, qualifica leads e agenda consultas. Você foca no Direito."
        keywords={['secretária virtual', 'automação jurídica', 'chatbot advogado', 'IA para advogados', 'WhatsApp automático']}
        productName="Secretária Virtual IA"
        price={300000}
        category="automacao"
        canonicalUrl="https://garcezpalha.com.br/secretaria-ia"
      />

      <UrgencyBanner
        countdown={false}
        message="🤖 TESTE GRÁTIS 7 DIAS - Veja a IA trabalhando para você"
        discount="7 DIAS GRÁTIS"
        onCTA={handleCTA}
        ctaText="Começar Teste Gratuito"
      />

      <WhatsAppFloat
        phoneNumber="5511999999999"
        message="Olá! Quero saber mais sobre a Secretária Virtual IA para meu escritório."
        position="bottom-right"
        showTooltip={true}
      />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-violet-50 to-purple-50 dark:from-violet-950/20 dark:to-purple-950/20 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-violet-600 text-white px-4 py-2 rounded-full mb-6">
              <Bot className="h-5 w-5" />
              <span className="font-semibold">Tecnologia de IA Avançada</span>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Atendimento Automatizado Para Advogados<br />
              <span className="text-primary">IA Que Atende, Qualifica e Agenda</span>
            </h1>

            <p className="text-xl text-muted-foreground mb-8">
              Secretária virtual inteligente que trabalha 24/7 no seu WhatsApp.<br />
              Você foca no Direito, a IA cuida dos clientes.
            </p>

            <div className="bg-white dark:bg-gray-900 rounded-lg p-6 mb-8 border-l-4 border-violet-600">
              <div className="flex items-start gap-3 text-left">
                <MessageSquare className="h-6 w-6 text-violet-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold mb-2">Como Funciona?</h3>
                  <p className="text-muted-foreground">
                    Nossa IA atende automaticamente no WhatsApp, faz perguntas de qualificação,
                    identifica a área jurídica, explica seus serviços e agenda consultas.
                    Tudo sem você precisar pegar no celular.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="bg-white dark:bg-gray-900 px-4 py-3 rounded-lg border border-violet-200">
                <div className="text-3xl font-bold text-violet-600">24/7</div>
                <div className="text-sm">Atendimento Automático</div>
              </div>
              <div className="bg-white dark:bg-gray-900 px-4 py-3 rounded-lg border border-violet-200">
                <div className="text-3xl font-bold text-violet-600">5 seg</div>
                <div className="text-sm">Tempo de Resposta</div>
              </div>
              <div className="bg-white dark:bg-gray-900 px-4 py-3 rounded-lg border border-violet-200">
                <div className="text-3xl font-bold text-violet-600">+300%</div>
                <div className="text-sm">Aumento em Leads</div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="text-xl px-10 py-8 font-bold shadow-xl bg-violet-600 hover:bg-violet-700"
                onClick={handleCTA}
              >
                <Bot className="h-6 w-6 mr-2" />
                TESTAR GRÁTIS 7 DIAS
                <ArrowRight className="h-6 w-6 ml-2" />
              </Button>
            </div>

            <p className="mt-4 text-sm text-muted-foreground">
              ⚡ Sem cartão de crédito • Instalação em 48h • Cancelamento a qualquer momento
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
                <Users className="h-10 w-10 mx-auto mb-2 text-violet-600" />
                <div className="text-2xl font-bold">50+</div>
                <div className="text-sm text-muted-foreground">Escritórios Atendidos</div>
              </div>
              <div>
                <MessageSquare className="h-10 w-10 mx-auto mb-2 text-blue-600" />
                <div className="text-2xl font-bold">10k+</div>
                <div className="text-sm text-muted-foreground">Atendimentos/Mês</div>
              </div>
              <div>
                <Calendar className="h-10 w-10 mx-auto mb-2 text-green-600" />
                <div className="text-2xl font-bold">85%</div>
                <div className="text-sm text-muted-foreground">Taxa de Agendamento</div>
              </div>
              <div>
                <TrendingUp className="h-10 w-10 mx-auto mb-2 text-orange-600" />
                <div className="text-2xl font-bold">+200%</div>
                <div className="text-sm text-muted-foreground">ROI Médio</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <AgitationSection
        problem="Você está perdendo clientes agora mesmo porque não consegue responder rápido no WhatsApp. Cada mensagem sem resposta é dinheiro deixado na mesa."
        agitationPoints={[
          'Leads mandam mensagem fora do horário e você perde para concorrente que responde',
          'Você gasta 2-3 horas por dia respondendo perguntas repetitivas básicas',
          'Leads desqualificados tomam seu tempo que poderia estar em casos rentáveis',
          'Sem sistema, você esquece de fazer follow-up e perde vendas fáceis',
        ]}
      />

      <SolutionSection
        title="Como Nossa IA Revoluciona Seu Atendimento"
        subtitle="Tecnologia que trabalha enquanto você dorme"
        solutionSteps={[
          'Atendimento instantâneo 24/7 - IA responde em 5 segundos, qualquer hora do dia',
          'Qualificação inteligente - Faz perguntas estratégicas e identifica área jurídica',
          'Agendamento automático - Integra com sua agenda e marca consultas',
          'Follow-up automático - Reativa leads frios e aumenta conversão',
          'Dashboard de análise - Veja métricas, taxas de conversão e otimize',
          'Handoff humano - Passa para você apenas leads quentes prontos para fechar',
        ]}
        onCTA={handleCTA}
      />

      {/* Features Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-4">O Que a IA Faz Por Você</h2>
            <p className="text-center text-muted-foreground mb-12">
              Tudo que uma secretária top faria, mas 24/7 e sem custo fixo alto
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardContent className="pt-6">
                  <MessageSquare className="h-10 w-10 text-violet-600 mb-3" />
                  <h3 className="text-xl font-bold mb-2">Atendimento WhatsApp 24h</h3>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">Resposta instantânea em 5 segundos</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">Funciona finais de semana e feriados</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">Múltiplos atendimentos simultâneos</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <Users className="h-10 w-10 text-blue-600 mb-3" />
                  <h3 className="text-xl font-bold mb-2">Qualificação de Leads</h3>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">Identifica área jurídica do caso</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">Coleta informações essenciais</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">Filtra leads sem perfil</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <Calendar className="h-10 w-10 text-green-600 mb-3" />
                  <h3 className="text-xl font-bold mb-2">Agendamento Inteligente</h3>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">Integração com Google Calendar</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">Confirmação automática 24h antes</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">Reagendamento facilitado</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <TrendingUp className="h-10 w-10 text-orange-600 mb-3" />
                  <h3 className="text-xl font-bold mb-2">Follow-up Automático</h3>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">Mensagens programadas para reativar</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">Sequência de nutrição de leads</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">Recupera leads esquecidos</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-4">Investimento</h2>
            <p className="text-center text-muted-foreground mb-12">
              Menos que o salário de uma secretária, com resultado infinitamente superior
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
              {/* Setup */}
              <Card>
                <CardContent className="pt-6">
                  <h3 className="text-2xl font-bold mb-2">Setup Inicial</h3>
                  <p className="text-muted-foreground mb-4">Configuração e integração</p>
                  <div className="text-4xl font-bold text-primary mb-6">R$ 3.000</div>
                  <ul className="space-y-3 mb-6">
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">Instalação completa em 48h</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">Personalização fluxo de atendimento</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">Treinamento da IA com seus casos</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">Integração agenda e CRM</span>
                    </li>
                  </ul>
                  <p className="text-sm text-muted-foreground">Pagamento único</p>
                </CardContent>
              </Card>

              {/* Mensalidade */}
              <Card className="border-primary border-2 shadow-lg relative">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="bg-green-500 text-white px-4 py-2 rounded-full text-sm font-bold">
                    ⭐ RECORRENTE
                  </span>
                </div>
                <CardContent className="pt-6">
                  <h3 className="text-2xl font-bold mb-2">Mensalidade</h3>
                  <p className="text-muted-foreground mb-4">Manutenção e suporte</p>
                  <div className="text-4xl font-bold text-primary mb-2">R$ 500</div>
                  <div className="text-sm text-muted-foreground mb-4">/mês</div>
                  <ul className="space-y-3 mb-6">
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">Atendimentos ilimitados</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">Suporte técnico prioritário</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">Atualizações da IA incluídas</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">Dashboard de métricas</span>
                    </li>
                  </ul>
                  <Button className="w-full text-lg" onClick={handleCTA}>
                    <Zap className="h-5 w-5 mr-2" />
                    Começar Agora
                  </Button>
                </CardContent>
              </Card>
            </div>

            <div className="mt-8 p-4 bg-violet-50 dark:bg-violet-900/20 rounded-lg border-l-4 border-violet-500">
              <p className="text-sm">
                💡 <strong>Ideal para:</strong> Escritórios que recebem +50 contatos por mês.
                ROI médio de 200% já no primeiro mês de operação.
              </p>
            </div>
          </div>
        </div>
      </section>

      <CredentialsSection
        lawyerName="Garcez Palha Tech"
        experience="Pioneiros em IA para Advocacia"
        specialization="Automação Jurídica e Inteligência Artificial"
        stats={{
          years: 3,
          cases: 10000,
          successRate: 95,
          clients: 50,
        }}
      />

      <TestimonialsSection />

      <GuaranteeSection
        guaranteeTitle="Teste Grátis 7 Dias - Sem Risco"
        guaranteeDescription="Experimente por 7 dias sem compromisso. Se não gostar, cancelamento imediato sem perguntas."
        guaranteePeriod="7 dias"
        guaranteePoints={[
          'Sem cartão de crédito para testar',
          'Cancelamento a qualquer momento',
          'Suporte técnico durante teste',
          '100% sem risco',
        ]}
      />

      {/* Final CTA */}
      <section className="py-16 bg-gradient-to-r from-violet-600 to-purple-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Pare de Perder Clientes Por Não Responder Rápido
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Nossa IA trabalha 24/7 atendendo, qualificando e agendando consultas.
            <strong className="block mt-2">Teste Grátis 7 Dias • Instalação em 48h • Sem Compromisso</strong>
          </p>
          <Button
            size="lg"
            className="bg-white text-violet-900 hover:bg-gray-100 text-xl px-12 py-8 font-bold shadow-2xl"
            onClick={handleCTA}
          >
            <Bot className="h-6 w-6 mr-2" />
            COMEÇAR TESTE GRATUITO AGORA
            <ArrowRight className="h-6 w-6 ml-2" />
          </Button>
          <p className="mt-4 text-sm">
            Mais de 50 escritórios já automatizaram o atendimento
          </p>
        </div>
      </section>
    </div>
  )
}
