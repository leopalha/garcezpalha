'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Shield,
  AlertTriangle,
  BadgeDollarSign,
  Scale,
  ArrowRight,
  Banknote,
  ChevronRight,
} from 'lucide-react'
import { SOLUTIONS, formatCurrency } from '@/types/checkout'

const financeiroSolutions = SOLUTIONS.filter((s) => s.category === 'bancario')

const categoryInfo = {
  title: 'Direito Bancario',
  description:
    'Solucoes juridicas especializadas para proteger suas financas, recuperar valores e defender seus direitos em questoes bancarias e de credito.',
  icon: Banknote,
}

const icons: Record<string, typeof Shield> = {
  'desbloqueio-conta': Shield,
  'golpe-pix': AlertTriangle,
  'negativacao-indevida': BadgeDollarSign,
  'defesa-execucao': Scale,
}

export default function FinanceiroPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
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
            <span className="text-foreground">Protecao Financeira</span>
          </motion.div>

          <div className="max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="flex items-center gap-4 mb-6"
            >
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                <categoryInfo.icon className="w-8 h-8 text-primary" />
              </div>
              <Badge variant="outline" className="text-base py-1 px-3">
                {financeiroSolutions.length} solucoes
              </Badge>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="font-display text-4xl md:text-6xl font-bold mb-6"
            >
              {categoryInfo.title}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-xl text-muted-foreground"
            >
              {categoryInfo.description}
            </motion.p>
          </div>
        </div>
      </section>

      {/* Solutions Grid */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {financeiroSolutions.map((solution, index) => {
              const Icon = icons[solution.id] || Shield
              return (
                <motion.div
                  key={solution.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="h-full hover:shadow-lg transition-all group">
                    <CardHeader>
                      <div className="flex items-start justify-between gap-4">
                        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                          <Icon className="w-6 h-6 text-primary" />
                        </div>
                        <Badge variant="secondary">{solution.estimatedDelivery}</Badge>
                      </div>
                      <CardTitle className="text-xl mt-4">{solution.name}</CardTitle>
                      <CardDescription className="text-base">
                        {solution.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <ul className="space-y-2">
                        {solution.features.slice(0, 3).map((feature, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                            <ArrowRight className="w-4 h-4 mt-0.5 flex-shrink-0 text-primary" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>

                      <div className="flex items-center justify-between pt-4 border-t">
                        <span className="text-2xl font-bold text-primary">
                          {formatCurrency(solution.price)}
                        </span>
                        <Button asChild>
                          <Link href={`/financeiro/${solution.id}`}>
                            Saiba mais
                            <ArrowRight className="w-4 h-4 ml-2" />
                          </Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto text-center"
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
              Nao encontrou o que procura?
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Fale com um de nossos especialistas e conte seu caso. Temos solucoes para
              diversas situacoes financeiras.
            </p>
            <Button size="lg" asChild>
              <Link
                href="https://wa.me/5521995054553?text=Ola!%20Preciso%20de%20ajuda%20com%20uma%20questao%20financeira."
                target="_blank"
                rel="noopener noreferrer"
              >
                Falar com Especialista
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
