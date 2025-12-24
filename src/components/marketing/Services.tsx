'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Building2,
  Scale,
  FileCheck,
  Home,
  Stethoscope,
  Users,
  ArrowRight,
} from 'lucide-react'

const services = [
  {
    icon: Building2,
    title: 'Direito Imobiliario',
    description: 'Assessoria completa em transacoes imobiliarias, regularizacoes, usucapiao e conflitos.',
    href: '/servicos/direito-imobiliario',
  },
  {
    icon: Scale,
    title: 'Direito Criminal',
    description: 'Defesa tecnica qualificada em processos criminais e garantia de direitos.',
    href: '/servicos/direito-criminal',
  },
  {
    icon: FileCheck,
    title: 'Pericia Documental',
    description: 'Analise de autenticidade, grafotecnia e laudos tecnicos especializados.',
    href: '/servicos/pericia-documentos',
  },
  {
    icon: Home,
    title: 'Avaliacao de Imoveis',
    description: 'Laudos de avaliacao tecnica para compra, venda, financiamento e processos judiciais.',
    href: '/servicos/avaliacao-imoveis',
  },
  {
    icon: Stethoscope,
    title: 'Pericia Medica',
    description: 'Laudos especializados em acidentes de trabalho, doencas ocupacionais e planos de saude.',
    href: '/servicos/pericia-medica',
  },
  {
    icon: Users,
    title: 'Secretaria Remota',
    description: 'Automacao completa do atendimento e gestao do seu escritorio juridico.',
    href: '/servicos/secretaria-remota',
  },
]

export function Services() {
  return (
    <section className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto text-center mb-16"
        >
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
            Nossos Servicos
          </h2>
          <p className="text-xl text-muted-foreground">
            Solucoes juridicas e periciais completas, com a tradicao e excelencia
            que so 364 anos de historia podem oferecer.
          </p>
        </motion.div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => {
            const Icon = service.icon

            return (
              <motion.div
                key={service.href}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow group">
                  <CardHeader>
                    <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                      <Icon className="w-7 h-7 text-primary" />
                    </div>
                    <CardTitle className="font-heading text-xl">
                      {service.title}
                    </CardTitle>
                    <CardDescription className="text-base">
                      {service.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button variant="ghost" className="gap-2 p-0 group-hover:text-primary transition-colors" asChild>
                      <Link href={service.href}>
                        Saiba mais
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
