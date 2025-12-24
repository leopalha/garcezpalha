import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, CheckCircle, Calendar, Bot, Mail, Phone, FileText, Clock } from 'lucide-react'
import Link from 'next/link'

export default function SecretariaRemotaPage() {
  const features = [
    {
      icon: Bot,
      title: 'Chatbot Inteligente',
      description: 'Atendimento automático 24/7 com IA para qualificação de leads',
    },
    {
      icon: Phone,
      title: 'Integração WhatsApp',
      description: 'Sistema completo de atendimento via WhatsApp Business',
    },
    {
      icon: Mail,
      title: 'Email Automatizado',
      description: 'Envio automático de confirmações, lembretes e follow-ups',
    },
    {
      icon: Calendar,
      title: 'Agendamento Inteligente',
      description: 'Sincronização com Google Calendar e lembretes automáticos',
    },
    {
      icon: FileText,
      title: 'Gestão de Documentos',
      description: 'Organização e armazenamento seguro de documentos',
    },
    {
      icon: Clock,
      title: 'Disponibilidade Total',
      description: 'Seus clientes são atendidos mesmo fora do horário comercial',
    },
  ]

  const benefits = [
    'Redução de até 80% no tempo de atendimento',
    'Qualificação automática de leads',
    'Nenhum cliente fica sem resposta',
    'Integração com seu sistema atual',
    'Dashboard completo de métricas',
    'Personalização total do atendimento',
    'Custo fixo mensal previsível',
    'Escalabilidade ilimitada',
  ]

  return (
    <div className="py-16">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="max-w-4xl mx-auto text-center mb-16">
          <Users className="w-20 h-20 text-primary mx-auto mb-6" />
          <h1 className="font-display text-5xl font-bold mb-4">Secretária Remota com IA</h1>
          <p className="text-xl text-muted-foreground">
            Sistema completo de automação para escritórios de advocacia. Atendimento 24/7, gestão
            de agenda, qualificação de leads e muito mais.
          </p>
        </div>

        {/* Introdução */}
        <div className="max-w-4xl mx-auto mb-16">
          <Card className="border-primary/20 bg-primary/5">
            <CardHeader>
              <CardTitle className="font-heading text-2xl">
                Transforme seu escritório com IA
              </CardTitle>
              <CardDescription className="text-base">
                A mesma tecnologia que revolucionou o Garcez Palha Advogados
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                Desenvolvemos uma plataforma completa de automação que nos permitiu atender mais
                clientes, reduzir custos operacionais e melhorar a experiência de todos os
                envolvidos.
              </p>
              <p className="font-semibold text-primary">
                Agora oferecemos essa mesma tecnologia para outros escritórios de advocacia.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Features */}
        <div className="max-w-6xl mx-auto mb-16">
          <h2 className="font-display text-3xl font-bold mb-8 text-center">
            Recursos Principais
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => {
              const Icon = feature.icon
              return (
                <Card key={feature.title} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <Icon className="w-10 h-10 mb-3 text-primary" />
                    <CardTitle className="font-heading text-xl">{feature.title}</CardTitle>
                    <CardDescription>{feature.description}</CardDescription>
                  </CardHeader>
                </Card>
              )
            })}
          </div>
        </div>

        {/* Como Funciona */}
        <div className="max-w-4xl mx-auto mb-16">
          <h2 className="font-display text-3xl font-bold mb-8 text-center">Como Funciona</h2>
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="font-heading flex items-center gap-3">
                  <span className="flex-shrink-0 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                    1
                  </span>
                  Cliente entra em contato
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Via WhatsApp, site, Instagram ou qualquer outro canal configurado.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="font-heading flex items-center gap-3">
                  <span className="flex-shrink-0 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                    2
                  </span>
                  IA qualifica automaticamente
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Chatbot conversa com o cliente, identifica a necessidade, urgência e perfil.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="font-heading flex items-center gap-3">
                  <span className="flex-shrink-0 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                    3
                  </span>
                  Agenda consulta automaticamente
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Sistema verifica sua agenda, oferece horários disponíveis e confirma o
                  agendamento.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="font-heading flex items-center gap-3">
                  <span className="flex-shrink-0 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                    4
                  </span>
                  Envia lembretes e confirmações
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Lembretes automáticos 24h e 1h antes, confirmações por email e WhatsApp.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="font-heading flex items-center gap-3">
                  <span className="flex-shrink-0 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                    5
                  </span>
                  Você atende preparado
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Dashboard com todas as informações do cliente e histórico de conversas.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Benefícios */}
        <div className="max-w-4xl mx-auto mb-16">
          <h2 className="font-display text-3xl font-bold mb-8 text-center">
            Benefícios para seu Escritório
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-center gap-3 p-4 rounded-lg bg-muted/30">
                <CheckCircle className="w-5 h-5 text-secondary flex-shrink-0" />
                <span>{benefit}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Planos */}
        <div className="max-w-6xl mx-auto mb-16">
          <h2 className="font-display text-3xl font-bold mb-8 text-center">Planos</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="font-heading text-2xl">Básico</CardTitle>
                <CardDescription>Para escritórios pequenos</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold">R$ 497</span>
                  <span className="text-muted-foreground">/mês</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-primary" />
                    <span className="text-sm">Chatbot WhatsApp</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-primary" />
                    <span className="text-sm">Até 500 conversas/mês</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-primary" />
                    <span className="text-sm">Agendamento automático</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-primary" />
                    <span className="text-sm">1 advogado</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-primary shadow-lg scale-105">
              <CardHeader>
                <div className="text-xs font-semibold text-primary mb-2">MAIS POPULAR</div>
                <CardTitle className="font-heading text-2xl">Profissional</CardTitle>
                <CardDescription>Para escritórios em crescimento</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold">R$ 997</span>
                  <span className="text-muted-foreground">/mês</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-primary" />
                    <span className="text-sm">Tudo do Básico</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-primary" />
                    <span className="text-sm">Até 2000 conversas/mês</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-primary" />
                    <span className="text-sm">Email marketing</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-primary" />
                    <span className="text-sm">Até 5 advogados</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-primary" />
                    <span className="text-sm">Dashboard completo</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="font-heading text-2xl">Enterprise</CardTitle>
                <CardDescription>Para grandes escritórios</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold">Custom</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-primary" />
                    <span className="text-sm">Tudo do Profissional</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-primary" />
                    <span className="text-sm">Conversas ilimitadas</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-primary" />
                    <span className="text-sm">Advogados ilimitados</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-primary" />
                    <span className="text-sm">Integrações customizadas</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-primary" />
                    <span className="text-sm">Suporte prioritário</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* CTA */}
        <div className="max-w-2xl mx-auto text-center bg-gradient-to-br from-primary/5 to-secondary/5 rounded-2xl p-8">
          <h3 className="font-display text-3xl font-bold mb-4">
            Pronto para automatizar seu escritório?
          </h3>
          <p className="text-muted-foreground mb-6">
            Agende uma demonstração gratuita e veja a plataforma em ação.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="gap-2" asChild>
              <Link href="/contato">
                <Calendar className="w-4 h-4" />
                Agendar Demonstração
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/parcerias">Seja um Parceiro</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
