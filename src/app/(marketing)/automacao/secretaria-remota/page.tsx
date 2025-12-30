
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Check, Shield, Clock, Award, ArrowRight, AlertTriangle,
  TrendingUp, Users, Star, Zap, FileText, Bot, DollarSign
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


export default function SecretariaRemotaPage() {
  const router = useRouter()

  const handleCTA = () => {
    router.push('/checkout?product=secretaria-remota')
  }

  return (
    <div className="min-h-screen">
      <SEOHead
        title="Secretaria Virtual IA - Atendimento 24/7 | Garcez Palha"
        description="Secretária virtual com IA para escritórios de advocacia. Atendimento automatizado 24/7, gestão de prazos e processos. R$ 3.000 setup + R$ 500/mês."
        keywords={['secretaria virtual', 'secretaria jurídica', 'atendimento automatizado', 'IA advocacia', 'gestão processos', 'backoffice jurídico']}
        productName="Secretaria Virtual IA"
        price={300000}
        category="automacao"
        canonicalUrl="https://garcezpalha.com.br/automacao/secretaria-remota"
      />

      <UrgencyBanner
        countdown={true}
        countdownMinutes={60}
        message="🤖 SECRETARIA VIRTUAL IA - Atendimento 24/7 com Automação Inteligente"
        discount="DEMONSTRAÇÃO GRÁTIS"
        onCTA={handleCTA}
        ctaText="Ver Demonstração"
      />


      {/* Hero Section */}
      <section className="bg-gradient-to-br from-fuchsia-50 to-pink-50 dark:from-fuchsia-950/20 dark:to-pink-950/20 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-fuchsia-600 text-white px-4 py-2 rounded-full mb-6">
              <Bot className="h-5 w-5" />
              <span className="font-semibold">Automação Inteligente</span>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Secretária Virtual com IA<br />
              <span className="text-fuchsia-600">Atendimento 24/7 Automatizado</span>
            </h1>

            <p className="text-xl text-muted-foreground mb-8">
              Sistema completo de secretariado virtual para escritórios de advocacia.<br />
              Gestão de prazos, atendimento a clientes e organização processual automatizada.
            </p>

            <div className="bg-white dark:bg-gray-900 rounded-lg p-6 mb-8 border-l-4 border-fuchsia-600">
              <div className="flex items-start gap-3 text-left">
                <AlertTriangle className="h-6 w-6 text-fuchsia-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold mb-2">Transforme Seu Escritório</h3>
                  <p className="text-muted-foreground">
                    Pare de gastar tempo com tarefas operacionais. Nossa secretária virtual cuida de
                    prazos, atendimento e organização enquanto você foca em casos complexos e captação.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-white dark:bg-gray-900 px-4 py-3 rounded-lg border border-fuchsia-200">
                <div className="text-3xl font-bold text-fuchsia-600">24/7</div>
                <div className="text-sm">Atendimento Contínuo</div>
              </div>
              <div className="bg-white dark:bg-gray-900 px-4 py-3 rounded-lg border border-fuchsia-200">
                <div className="text-3xl font-bold text-fuchsia-600">100%</div>
                <div className="text-sm">Automatizado</div>
              </div>
              <div className="bg-white dark:bg-gray-900 px-4 py-3 rounded-lg border border-fuchsia-200">
                <div className="text-3xl font-bold text-fuchsia-600">50+</div>
                <div className="text-sm">Escritórios Ativos</div>
              </div>
              <div className="bg-white dark:bg-gray-900 px-4 py-3 rounded-lg border border-fuchsia-200">
                <div className="text-3xl font-bold text-fuchsia-600">70%</div>
                <div className="text-sm">Redução de Custo</div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="text-xl px-10 py-8 font-bold shadow-xl bg-fuchsia-600 hover:bg-fuchsia-700"
                onClick={handleCTA}
              >
                <Bot className="h-6 w-6 mr-2" />
                VER DEMONSTRAÇÃO
                <ArrowRight className="h-6 w-6 ml-2" />
              </Button>
            </div>

            <p className="mt-4 text-sm text-muted-foreground">
              ⚡ Demonstração gratuita • Setup em 48h • Teste por 30 dias
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
                <Bot className="h-10 w-10 mx-auto mb-2 text-fuchsia-600" />
                <div className="text-2xl font-bold">50+</div>
                <div className="text-sm text-muted-foreground">Escritórios Ativos</div>
              </div>
              <div>
                <Clock className="h-10 w-10 mx-auto mb-2 text-green-600" />
                <div className="text-2xl font-bold">24/7</div>
                <div className="text-sm text-muted-foreground">Disponibilidade</div>
              </div>
              <div>
                <TrendingUp className="h-10 w-10 mx-auto mb-2 text-purple-600" />
                <div className="text-2xl font-bold">70%</div>
                <div className="text-sm text-muted-foreground">Redução de Custo</div>
              </div>
              <div>
                <Award className="h-10 w-10 mx-auto mb-2 text-orange-600" />
                <div className="text-2xl font-bold">98%</div>
                <div className="text-sm text-muted-foreground">Satisfação</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <AgitationSection
        problem="Escritório desorganizado, prazos perdidos, clientes sem resposta e você gastando mais tempo com burocracia do que advogando? Secretariado tradicional é caro, instável e limitado."
        agitationPoints={[
          'Prazos processuais perdidos por desorganização',
          'Clientes sem atendimento fora do horário comercial',
          'Alto custo com secretária (salário + encargos + infraestrutura)',
          'Dependência de pessoa física (férias, faltas, rotatividade)',
          'Tempo perdido com tarefas operacionais repetitivas',
          'Dificuldade para escalar atendimento sem aumentar custos',
        ]}
      />

      <SolutionSection
        title="Como Funciona Nossa Secretaria Virtual IA"
        subtitle="Sistema completo de automação para escritórios de advocacia"
        solutionSteps={[
          'Setup inicial em 48h - Configuramos sistema, integrações e treinamento',
          'Atendimento 24/7 automatizado - WhatsApp, telefone e e-mail respondidos',
          'Gestão automática de prazos - Alertas, acompanhamento e publicações DJe',
          'Organização de processos - Protocolos, documentos e histórico centralizado',
          'Relatórios gerenciais - Métricas de atendimento, processos e produtividade',
          'Suporte contínuo - Equipe disponível para ajustes e melhorias',
        ]}
        onCTA={handleCTA}
      />

      {/* Services Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-4">Planos de Secretaria Virtual</h2>
            <p className="text-center text-muted-foreground mb-12">
              Soluções para diferentes tamanhos de escritório
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Básico */}
              <Card>
                <CardContent className="pt-6">
                  <FileText className="h-12 w-12 text-fuchsia-600 mb-4" />
                  <h3 className="text-2xl font-bold mb-2">Plano Solo</h3>
                  <p className="text-muted-foreground mb-4">
                    Ideal para advogados autônomos
                  </p>
                  <ul className="space-y-2 mb-6">
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">Até 30 processos ativos</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">Atendimento WhatsApp IA</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">Gestão de prazos básica</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">Relatórios mensais</span>
                    </li>
                  </ul>
                  <div className="text-2xl font-bold text-fuchsia-600 mb-1">R$ 2.000</div>
                  <div className="text-sm text-muted-foreground mb-4">setup + R$ 300/mês</div>
                  <Button variant="outline" className="w-full" onClick={handleCTA}>
                    Contratar Solo
                  </Button>
                </CardContent>
              </Card>

              {/* Médio */}
              <Card className="border-fuchsia-600 border-2 shadow-lg relative">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="bg-yellow-500 text-white px-4 py-2 rounded-full text-sm font-bold">
                    ⭐ MAIS PROCURADO
                  </span>
                </div>
                <CardContent className="pt-6">
                  <Zap className="h-12 w-12 text-green-600 mb-4" />
                  <h3 className="text-2xl font-bold mb-2">Plano Escritório</h3>
                  <p className="text-muted-foreground mb-4">
                    Para escritórios pequenos e médios
                  </p>
                  <ul className="space-y-2 mb-6">
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">Até 100 processos ativos</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">WhatsApp + Telefone + E-mail IA</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">Gestão completa de prazos</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">Petições simples automatizadas</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">Integração com sistemas</span>
                    </li>
                  </ul>
                  <div className="text-2xl font-bold text-fuchsia-600 mb-1">R$ 3.000</div>
                  <div className="text-sm text-muted-foreground mb-4">setup + R$ 500/mês</div>
                  <Button className="w-full text-lg bg-fuchsia-600 hover:bg-fuchsia-700" onClick={handleCTA}>
                    <Zap className="h-5 w-5 mr-2" />
                    Contratar Agora
                  </Button>
                </CardContent>
              </Card>

              {/* Enterprise */}
              <Card>
                <CardContent className="pt-6">
                  <DollarSign className="h-12 w-12 text-purple-600 mb-4" />
                  <h3 className="text-2xl font-bold mb-2">Plano Enterprise</h3>
                  <p className="text-muted-foreground mb-4">
                    Para escritórios grandes
                  </p>
                  <ul className="space-y-2 mb-6">
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">Processos ilimitados</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">Tudo do Plano Escritório</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">Equipe remota dedicada</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">Customizações personalizadas</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">Prioridade no suporte</span>
                    </li>
                  </ul>
                  <div className="text-2xl font-bold text-fuchsia-600 mb-1">Sob consulta</div>
                  <div className="text-sm text-muted-foreground mb-4">Plano customizado</div>
                  <Button variant="outline" className="w-full" onClick={handleCTA}>
                    Solicitar Proposta
                  </Button>
                </CardContent>
              </Card>
            </div>

            <div className="mt-8 p-4 bg-fuchsia-50 dark:bg-fuchsia-900/20 rounded-lg border-l-4 border-fuchsia-500">
              <p className="text-sm">
                💡 <strong>Teste Grátis:</strong> Todos os planos incluem 30 dias de teste. Não gostou? Devolvemos 100% do valor do setup.
              </p>
            </div>
          </div>
        </div>
      </section>

      <CredentialsSection
        lawyerName="Equipe Garcez Palha Tech"
        experience="8+ anos em Automação Jurídica"
        specialization="Especialistas em IA e Sistemas para Advocacia"
        stats={{
          years: 8,
          cases: 50,
          successRate: 98,
          clients: 60,
        }}
      />

      <TestimonialsSection />

      <GuaranteeSection
        guaranteeTitle="Garantia de Satisfação - 30 Dias"
        guaranteeDescription="Teste por 30 dias sem compromisso. Se não ficar satisfeito, devolvemos 100% do valor do setup. Maioria dos clientes renova pois percebe economia e produtividade imediatas."
        guaranteePeriod="30 dias"
      />

      {/* Final CTA */}
      <section className="py-16 bg-gradient-to-r from-fuchsia-600 to-pink-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Automatize Seu Escritório Hoje
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Secretária virtual com IA que trabalha 24/7 por uma fração do custo.
            <strong className="block mt-2">50+ escritórios ativos • 70% redução de custo • Setup em 48h</strong>
          </p>
          <Button
            size="lg"
            className="bg-white text-fuchsia-900 hover:bg-gray-100 text-xl px-12 py-8 font-bold shadow-2xl"
            onClick={handleCTA}
          >
            <Bot className="h-6 w-6 mr-2" />
            VER DEMONSTRAÇÃO GRÁTIS
            <ArrowRight className="h-6 w-6 ml-2" />
          </Button>
          <p className="mt-4 text-sm">
            Demonstração gratuita • Teste 30 dias • Sem compromisso
          </p>
        </div>
      </section>
    </div>
  )
}
