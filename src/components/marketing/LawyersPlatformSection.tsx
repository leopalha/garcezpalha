'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Sparkles,
  Users,
  TrendingUp,
  Bot,
  Zap,
  Globe,
  BarChart3,
  ArrowRight,
} from 'lucide-react'

const platformFeatures = [
  {
    icon: Bot,
    title: 'Secretária IA 24/7',
    description: 'Atende e qualifica leads automaticamente',
  },
  {
    icon: Users,
    title: 'CRM Completo',
    description: 'Gestão de leads, clientes e processos',
  },
  {
    icon: TrendingUp,
    title: 'Marketing Automation',
    description: 'Landing pages, VSL e automações',
  },
  {
    icon: Globe,
    title: 'White-Label',
    description: 'Sua marca, seu domínio, suas cores',
  },
  {
    icon: Zap,
    title: 'Ferramentas de Criação',
    description: 'Crie produtos, perguntas e propostas',
  },
]

export function LawyersPlatformSection() {
  return (
    <section id="plataforma" className="py-24 bg-gradient-to-b from-muted/30 to-background">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 max-w-3xl mx-auto"
        >
          <Badge className="mb-4 bg-gradient-to-r from-primary to-blue-600">
            <Sparkles className="h-3 w-3 mr-1" />
            Plataforma para Advogados
          </Badge>
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
            Seu escritório
            <span className="block bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
              100% automatizado
            </span>
          </h2>
          <p className="text-xl text-muted-foreground">
            A mesma tecnologia que atende 10.000 clientes/mês. CRM, IA, Marketing e Gestão em uma
            única plataforma white-label.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12 max-w-5xl mx-auto">
          {platformFeatures.map((feature, index) => {
            const FeatureIcon = feature.icon
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="h-full hover:shadow-lg transition-all hover:scale-105 border-2 hover:border-primary/50">
                  <CardContent className="pt-6 pb-6">
                    <div className="flex items-start gap-4">
                      <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <FeatureIcon className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-bold mb-1">{feature.title}</h3>
                        <p className="text-sm text-muted-foreground">{feature.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}

          {/* Additional "Coming Soon" Feature */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <Card className="h-full border-2 border-dashed border-primary/30 bg-primary/5">
              <CardContent className="pt-6 pb-6">
                <div className="flex items-start gap-4">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <BarChart3 className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold mb-1">Analytics Avançado</h3>
                    <p className="text-sm text-muted-foreground">
                      Dashboards e relatórios completos (em breve)
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
        >
          <Button
            size="lg"
            className="text-lg px-8 bg-gradient-to-r from-primary to-blue-600 hover:opacity-90"
            asChild
          >
            <Link href="/automacao">
              Ver a Plataforma
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
          <Button size="lg" variant="outline" className="text-lg px-8" asChild>
            <Link href="/precos">Ver Planos e Preços</Link>
          </Button>
        </motion.div>

        {/* Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto"
        >
          <div className="text-center">
            <p className="text-4xl font-bold text-primary mb-2">300+</p>
            <p className="text-muted-foreground">Advogados ativos</p>
          </div>

          <div className="text-center">
            <p className="text-4xl font-bold text-primary mb-2">847</p>
            <p className="text-muted-foreground">Leads/mês média</p>
          </div>

          <div className="text-center">
            <p className="text-4xl font-bold text-primary mb-2">R$ 497</p>
            <p className="text-muted-foreground">A partir de</p>
          </div>
        </motion.div>

        {/* Additional Info */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 1 }}
          className="text-center mt-12"
        >
          <p className="text-sm text-muted-foreground">
            Planos mensais sem fidelidade • Suporte dedicado • Treinamento incluído
          </p>
        </motion.div>
      </div>
    </section>
  )
}
