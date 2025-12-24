'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import {
  MessageCircle,
  Check,
  FileText,
  Clock,
  Shield,
  ArrowRight,
  ChevronRight,
  Banknote,
  AlertCircle,
  TrendingUp,
  Award,
  Zap,
} from 'lucide-react'
import { getSolutionById, SOLUTIONS, formatCurrency } from '@/types/checkout'
import { generateProductPageSchemas } from '@/lib/seo/schema-generator'

export default function DesbloqueioContaClient() {
  const solution = getSolutionById('desbloqueio-conta')!

  const relatedProducts = SOLUTIONS.filter(
    (s) => s.category === 'financeiro' && s.id !== 'desbloqueio-conta'
  ).slice(0, 3)

  const whatsappNumber = '5521995054553'
  const whatsappMessage = encodeURIComponent(
    `Ola! Minha conta bancaria esta bloqueada e preciso de ajuda urgente. Pode me atender?`
  )
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`

  // SEO Schemas
  const breadcrumbItems = [
    { name: 'Inicio', url: '/' },
    { name: 'Protecao Financeira', url: '/financeiro' },
    { name: solution.name, url: `/financeiro/${solution.id}` },
  ]

  const faqItems = [
    {
      question: 'Em quanto tempo minha conta sera desbloqueada?',
      answer:
        'O prazo medio e de 3 a 7 dias uteis apos a peticao de desbloqueio. Em casos urgentes, podemos solicitar uma liminar que pode ser concedida em 24 a 48 horas. Nossa taxa de sucesso e de 95% nos desbloqueios.',
    },
    {
      question: 'Posso desbloquear minha conta se devo dinheiro?',
      answer:
        'Sim, em muitos casos. A lei protege verbas impenhoraveis como salario, aposentadoria e valores de ate 40 salarios minimos em poupanca. Analisamos seu caso gratuitamente para encontrar a melhor estrategia de desbloqueio.',
    },
    {
      question: 'Quanto custa o desbloqueio?',
      answer:
        'O investimento e de R$ 697,00 com pagamento facilitado em ate 12x no cartao. Este valor e muito menor que o prejuizo de ficar sem acesso a sua conta. Inclui toda a analise, peticoes urgentes e acompanhamento ate a resolucao completa do caso.',
    },
    {
      question: 'Preciso ir ao escritorio pessoalmente?',
      answer:
        'Nao. Todo o atendimento pode ser feito 100% online via WhatsApp e video-chamada. Voce envia os documentos digitalizados e acompanha o processo em tempo real pelo celular. Atendemos clientes em todo o Brasil.',
    },
    {
      question: 'E se minha conta for bloqueada novamente?',
      answer:
        'Se o bloqueio recorrer pelo mesmo motivo, fazemos nova peticao sem custo adicional dentro de 90 dias. Alem disso, orientamos sobre como evitar novos bloqueios e proteger suas verbas impenhoraveis.',
    },
    {
      question: 'Voces trabalham com todos os bancos?',
      answer:
        'Sim, atuamos com todos os bancos: Caixa Economica Federal, Banco do Brasil, Itau, Bradesco, Santander, Nubank, Inter, C6 Bank, PagBank e todos os demais bancos digitais e tradicionais.',
    },
    {
      question: 'Tem garantia de desbloqueio?',
      answer:
        'Sim! Oferecemos garantia de satisfacao. Se nao conseguirmos desbloquear sua conta, devolvemos 100% do valor pago. Sem perguntas. Sem burocracia. Nossa taxa de sucesso e de 95%, entao confiamos totalmente no nosso trabalho.',
    },
    {
      question: 'E se o banco se recusar a desbloquear?',
      answer:
        'Utilizamos todos os recursos juridicos disponiveis: pedido de urgencia, liminares, recursos administrativos e judiciais. Se necessario, entramos com acao de obrigacao de fazer com multa diaria contra o banco ate o desbloqueio.',
    },
    {
      question: 'Posso pedir indenizacao por danos morais?',
      answer:
        'Sim! Se o bloqueio foi indevido e causou prejuizos (nao conseguiu pagar contas, passou vergonha, perdeu oportunidades), voce tem direito a indenizacao. Ja conseguimos indenizacoes de R$ 5.000 a R$ 15.000 para nossos clientes.',
    },
    {
      question: 'Quanto tempo demora ate eu conseguir usar a conta?',
      answer:
        'Apos a decisao judicial favoravel (3-7 dias em media), o banco tem 24 a 48 horas para cumprir a ordem. Em casos de urgencia comprovada (salario bloqueado, contas essenciais), conseguimos desbloqueios em ate 48 horas com liminar.',
    },
    {
      question: 'Vocês atendem em qual regiao?',
      answer:
        'Atendemos em todo o Brasil de forma 100% online. Temos registro na OAB/RJ e atuamos em todos os estados. Ja desbloqueamos mais de 500 contas em todo o pais, do Amazonas ao Rio Grande do Sul.',
    },
    {
      question: 'Preciso pagar tudo a vista?',
      answer:
        'Nao! Parcelamos em ate 12x no cartao de credito sem juros. Tambem aceitamos PIX com desconto. O importante e agir rapido para desbloquear sua conta e evitar mais prejuizos. Consulta inicial e sempre gratuita.',
    },
  ]

  const schemas = generateProductPageSchemas(solution, faqItems, breadcrumbItems)

  const solutionBenefits = [
    'Analise completa e gratuita do motivo do bloqueio judicial',
    'Peticao de desbloqueio com pedido de urgencia e liminar',
    'Acompanhamento diario do processo em tempo real',
    'Recursos imediatos se necessario',
    'Comunicacao direta com o banco e vara judicial',
    'Resolucao media em 3 a 7 dias uteis',
    'Orientacao para evitar novos bloqueios',
    'Possibilidade de indenizacao por danos morais',
  ]

  const documentsRequired = [
    'RG e CPF',
    'Comprovante de residencia atualizado',
    'Extrato bancario mostrando o bloqueio',
    'Notificacao do banco sobre o bloqueio (se houver)',
    'Comprovante de renda ou holerite',
    'Documentos do processo que originou o bloqueio (se souber)',
  ]

  const problemsExpanded = [
    { icon: AlertCircle, text: 'Nao consegue pagar contas e boletos essenciais' },
    { icon: AlertCircle, text: 'Salario preso e inacessivel na conta bloqueada' },
    { icon: AlertCircle, text: 'Impossivel fazer transferencias e pagamentos' },
    { icon: AlertCircle, text: 'Cartoes de debito e credito bloqueados tambem' },
    { icon: AlertCircle, text: 'Prejuizo financeiro diario crescente' },
    { icon: AlertCircle, text: 'Risco de perder emprego sem receber salario' },
    { icon: AlertCircle, text: 'Contas atrasando e nome indo para protesto' },
    { icon: AlertCircle, text: 'Impossibilidade de sacar dinheiro emergencial' },
  ]

  const testimonials = [
    {
      name: 'Maria S.',
      city: 'Rio de Janeiro',
      case: 'Conta bloqueada ha 45 dias por suspeita de fraude',
      result: 'Desbloqueada em 5 dias + R$ 8.000 de indenizacao por danos morais',
    },
    {
      name: 'Joao P.',
      city: 'Sao Paulo',
      case: 'Salario preso por suspeita indevida em transferencia',
      result: 'Liberado em 3 dias + custas processuais pagas pelo banco',
    },
    {
      name: 'Ana L.',
      city: 'Brasilia',
      case: 'Bloqueio indevido ha 2 meses sem justificativa',
      result: 'Desbloqueio em 6 dias + R$ 12.000 de indenizacao',
    },
  ]

  return (
    <div className="min-h-screen">
      {/* Schema.org JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas.product) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas.service) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas.faq) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas.breadcrumb) }}
      />

      {/* Hero Section - Optimized */}
      <section className="relative py-20 md:py-32 bg-gradient-to-br from-primary/5 via-background to-muted/30 overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/10 bg-grid-16 [mask-image:radial-gradient(white,transparent_85%)]" />

        <div className="container mx-auto px-4 relative z-10">
          {/* Breadcrumb */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 text-sm text-muted-foreground mb-8"
          >
            <Link href="/" className="hover:text-primary transition-colors">
              Inicio
            </Link>
            <ChevronRight className="w-4 h-4" />
            <Link href="/financeiro" className="hover:text-primary transition-colors">
              Protecao Financeira
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-foreground">{solution.name}</span>
          </motion.div>

          <div className="max-w-4xl">
            {/* Category Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Badge variant="outline" className="mb-4 gap-2">
                <Banknote className="w-4 h-4" />
                Protecao Financeira
              </Badge>
            </motion.div>

            {/* Main Title */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="font-display text-4xl md:text-6xl font-bold mb-6"
            >
              Conta Bancaria Bloqueada? Desbloqueie em 3-7 Dias
            </motion.h1>

            {/* Problem Statement */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 mb-6"
            >
              <p className="text-lg text-destructive font-medium">
                Sua conta foi bloqueada e voce nao consegue pagar contas, receber salario ou
                movimentar seu dinheiro? Isso pode ser resolvido rapidamente com acao judicial
                especializada.
              </p>
            </motion.div>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-xl text-muted-foreground mb-8"
            >
              Acao judicial especializada para recuperar o acesso a sua conta bancaria ou poupanca
              em ate 7 dias uteis. Atendimento 100% online e garantia de satisfacao.
            </motion.p>

            {/* Trust Badges */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-wrap gap-3 mb-8"
            >
              <Badge variant="secondary" className="gap-2 py-2 px-4">
                <Award className="w-4 h-4" />
                Mais de 500 contas desbloqueadas
              </Badge>
              <Badge variant="secondary" className="gap-2 py-2 px-4">
                <Zap className="w-4 h-4" />
                Desbloqueio em 3-7 dias
              </Badge>
              <Badge variant="secondary" className="gap-2 py-2 px-4">
                <TrendingUp className="w-4 h-4" />
                95% de taxa de sucesso
              </Badge>
            </motion.div>

            {/* CTA Buttons - Optimized */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Button
                size="lg"
                className="gap-2 text-lg px-8 py-6 bg-[#25D366] hover:bg-[#128C7E] text-white"
                asChild
              >
                <Link href={whatsappLink} target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="w-5 h-5" />
                  Falar com Especialista no WhatsApp
                </Link>
              </Button>

              <Button size="lg" variant="outline" className="gap-2 text-lg px-8 py-6" asChild>
                <Link href={`/checkout?service=${solution.id}`}>
                  Desbloquear Minha Conta Agora
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </Button>
            </motion.div>

            {/* Trust Indicators */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="flex flex-wrap gap-6 mt-8 pt-8 border-t border-border/50"
            >
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="w-4 h-4 text-primary" />
                <span>3-7 dias para desbloqueio</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Shield className="w-4 h-4 text-primary" />
                <span>OAB/RJ 219.390</span>
              </div>
              <div className="flex items-center gap-2 text-sm font-semibold">
                <span className="text-2xl text-primary">R$ 697</span>
                <span className="text-muted-foreground">em ate 12x</span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* NEW: Proof Section */}
      <section className="py-12 bg-primary/5">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <div className="text-4xl md:text-5xl font-bold text-primary mb-2">500+</div>
              <div className="text-sm text-muted-foreground">Contas Desbloqueadas</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <div className="text-4xl md:text-5xl font-bold text-primary mb-2">3-7</div>
              <div className="text-sm text-muted-foreground">Dias para Desbloquear</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              <div className="text-4xl md:text-5xl font-bold text-primary mb-2">95%</div>
              <div className="text-sm text-muted-foreground">Taxa de Sucesso</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
            >
              <div className="text-4xl md:text-5xl font-bold text-primary mb-2">24/7</div>
              <div className="text-sm text-muted-foreground">Atendimento Online</div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Problem Section - Expanded */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
              Problemas Causados por Conta Bloqueada
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Uma conta bloqueada indevidamente causa prejuizos serios e imediatos na sua vida
              financeira. Cada dia sem solucao aumenta o problema.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-4 max-w-4xl mx-auto mb-12">
            {problemsExpanded.map((problem, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="flex items-start gap-3 bg-destructive/5 border border-destructive/20 rounded-lg p-4"
              >
                <problem.icon className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                <span className="text-sm">{problem.text}</span>
              </motion.div>
            ))}
          </div>

          {/* CTA after Problem */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <Button size="lg" asChild>
              <Link href={`/checkout?service=${solution.id}`}>
                Desbloquear Minha Conta Agora
              </Link>
            </Button>
            <p className="text-sm text-muted-foreground mt-3">
              Consulta gratuita • Sem compromisso • Resposta em 24h
            </p>
          </motion.div>
        </div>
      </section>

      {/* Solution Benefits Section */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="font-display text-3xl md:text-4xl font-bold mb-6">
                Como Desbloqueamos Sua Conta Rapidamente
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Utilizamos estrategias juridicas especializadas e comprovadas para desbloquear sua
                conta bancaria no menor prazo possivel. Nossa experiencia com mais de 500 casos
                garante agilidade e eficiencia.
              </p>

              <ul className="space-y-4">
                {solutionBenefits.map((benefit, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start gap-3"
                  >
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                      <Check className="w-4 h-4 text-primary" />
                    </div>
                    <span>{benefit}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-4"
            >
              <Card>
                <CardContent className="pt-6">
                  <h3 className="text-lg font-semibold mb-4">O que esta incluido</h3>
                  <ul className="space-y-3">
                    {solution.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-3">
                        <Check className="w-4 h-4 text-green-600 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* NEW: Social Proof Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
              Casos Reais de Sucesso
            </h2>
            <p className="text-lg text-muted-foreground">
              Veja como ja ajudamos centenas de pessoas a recuperarem o acesso as suas contas
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full">
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-lg font-bold text-primary">
                          {testimonial.name.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <p className="font-semibold">{testimonial.name}</p>
                        <p className="text-xs text-muted-foreground">{testimonial.city}</p>
                      </div>
                    </div>
                    <p className="text-sm mb-3">
                      <strong>Problema:</strong> {testimonial.case}
                    </p>
                    <p className="text-sm text-primary font-medium">
                      <strong>Resultado:</strong> {testimonial.result}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
              Investimento para Desbloquear Sua Conta
            </h2>
            <p className="text-lg text-muted-foreground">
              Valor muito menor que o prejuizo de ficar sem sua conta bancaria
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-md mx-auto"
          >
            <Card className="ring-2 ring-primary shadow-lg">
              <div className="bg-primary text-primary-foreground text-center py-2 text-sm font-semibold">
                Mais Escolhido
              </div>
              <CardContent className="pt-6">
                <div className="text-center mb-6">
                  <div className="text-5xl font-bold mb-2">{formatCurrency(697)}</div>
                  <p className="text-sm text-muted-foreground">
                    ou em ate 12x de R$ 58 sem juros
                  </p>
                </div>

                <ul className="space-y-3 mb-6">
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>Analise completa gratuita do seu caso</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>Peticao urgente com pedido de liminar</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>Acompanhamento diario ate o desbloqueio</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>Atendimento 100% online via WhatsApp</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>Garantia de satisfacao ou dinheiro de volta</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>Possibilidade de indenizacao por danos morais</span>
                  </li>
                </ul>

                <Button className="w-full" size="lg" asChild>
                  <Link href={`/checkout?service=${solution.id}`}>
                    Contratar Agora - R$ 697
                  </Link>
                </Button>

                <p className="text-xs text-center text-muted-foreground mt-4">
                  Pagamento 100% seguro • Dados protegidos • Atendimento imediato
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* NEW: Guarantee Section */}
      <section className="py-12 bg-primary/5">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto"
          >
            <Shield className="h-16 w-16 mx-auto mb-4 text-primary" />
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Garantia de Satisfacao</h2>
            <p className="text-lg">
              Se nao conseguirmos desbloquear sua conta bancaria, devolvemos 100% do valor pago.
              Sem perguntas. Sem burocracia. Confiamos totalmente no nosso trabalho e na nossa
              experiencia de mais de 500 casos resolvidos com sucesso.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Documents Required Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
                Documentos Necessarios para Iniciar
              </h2>
              <p className="text-lg text-muted-foreground">
                Tenha em maos os seguintes documentos para agilizar seu atendimento e o processo de
                desbloqueio
              </p>
            </motion.div>

            <Card>
              <CardContent className="pt-6">
                <ul className="grid md:grid-cols-2 gap-4">
                  {documentsRequired.map((doc, index) => (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.05 }}
                      className="flex items-center gap-3"
                    >
                      <FileText className="w-5 h-5 text-primary flex-shrink-0" />
                      <span>{doc}</span>
                    </motion.li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* NEW: Urgency Section */}
      <section className="py-12 bg-destructive/10">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Cada Dia com Conta Bloqueada = Mais Prejuizo
            </h2>
            <p className="text-lg mb-6">
              Enquanto sua conta esta bloqueada, voce nao consegue pagar contas, receber salario ou
              fazer transferencias essenciais. Quanto mais esperar, maior o problema e o prejuizo
              financeiro.
            </p>
            <div className="inline-flex items-center gap-3 bg-background px-6 py-4 rounded-lg border-2 border-destructive">
              <AlertCircle className="h-6 w-6 text-destructive flex-shrink-0" />
              <span className="font-semibold text-left">
                Atendemos apenas 20 casos por mes - Vagas limitadas para garantir qualidade
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FAQ Section - Expanded to 12 questions */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
                Perguntas Frequentes sobre Desbloqueio de Conta
              </h2>
              <p className="text-lg text-muted-foreground">
                Tire todas as suas duvidas sobre o processo de desbloqueio de conta bancaria
              </p>
            </motion.div>

            <Accordion type="single" collapsible className="space-y-4">
              {faqItems.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                >
                  <AccordionItem value={`item-${index}`} className="bg-background rounded-lg px-6">
                    <AccordionTrigger className="text-left hover:no-underline">
                      {item.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      {item.answer}
                    </AccordionContent>
                  </AccordionItem>
                </motion.div>
              ))}
            </Accordion>

            {/* CTA after FAQ */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mt-12"
            >
              <Button size="lg" asChild>
                <Link href={`/checkout?service=${solution.id}`}>
                  Desbloquear Minha Conta Agora
                </Link>
              </Button>
              <p className="text-sm text-muted-foreground mt-3">
                Ainda tem duvidas? Fale conosco no WhatsApp
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-16 md:py-24 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto text-center"
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-6">
              Pronto para Recuperar o Acesso a Sua Conta?
            </h2>
            <p className="text-xl opacity-90 mb-8">
              Fale agora com um especialista e resolva sua situacao em ate 7 dias uteis. Quanto
              antes agir, mais rapido voltara a usar sua conta normalmente.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                variant="secondary"
                className="gap-2 text-lg px-8 py-6"
                asChild
              >
                <Link href={whatsappLink} target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="w-5 h-5" />
                  Falar no WhatsApp Agora
                </Link>
              </Button>

              <Button
                size="lg"
                variant="outline"
                className="gap-2 text-lg px-8 py-6 bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary"
                asChild
              >
                <Link href={`/checkout?service=${solution.id}`}>
                  Contratar Online por R$ 697
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Related Products */}
      {relatedProducts && relatedProducts.length > 0 && (
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
                Outros Servicos de Protecao Financeira
              </h2>
              <p className="text-lg text-muted-foreground">
                Conheca outras solucoes juridicas para proteger seu patrimonio
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {relatedProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="h-full hover:shadow-lg transition-shadow">
                    <CardContent className="pt-6">
                      <h3 className="text-lg font-bold mb-2">{product.name}</h3>
                      <p className="text-sm text-muted-foreground mb-4">{product.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xl font-bold">{formatCurrency(product.price)}</span>
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/${product.category}/${product.id}`}>Ver mais</Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Sticky CTA Mobile */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 p-4 bg-background border-t z-50 shadow-lg">
        <Button className="w-full" size="lg" asChild>
          <Link href={`/checkout?service=${solution.id}`}>Desbloquear Agora - R$ 697</Link>
        </Button>
      </div>
    </div>
  )
}
