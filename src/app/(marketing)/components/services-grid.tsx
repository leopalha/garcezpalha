'use client'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowRight, Building2, FileCheck, Home, Stethoscope, Users, Scale } from 'lucide-react'
import Link from 'next/link'
import { motion } from 'framer-motion'

const services = [
  {
    icon: Building2,
    title: 'Direito Imobiliário',
    description: 'Assessoria completa em transações imobiliárias, regularizações e conflitos.',
    href: '/servicos/direito-imobiliario',
    color: 'text-primary',
  },
  {
    icon: Scale,
    title: 'Direito Criminal',
    description: 'Defesa técnica qualificada em processos criminais e garantia de direitos.',
    href: '/servicos/direito-criminal',
    color: 'text-secondary',
  },
  {
    icon: FileCheck,
    title: 'Perícia Documental',
    description: 'Análise de autenticidade, grafotecnia e laudos técnicos especializados.',
    href: '/servicos/pericia-documentos',
    color: 'text-primary',
  },
  {
    icon: Home,
    title: 'Avaliação de Imóveis',
    description: 'Laudos de avaliação técnica para compra, venda e financiamento.',
    href: '/servicos/avaliacao-imoveis',
    color: 'text-secondary',
  },
  {
    icon: Stethoscope,
    title: 'Perícia Médica Trabalhista',
    description: 'Laudos especializados em acidentes de trabalho e doenças ocupacionais.',
    href: '/servicos/pericia-medica',
    color: 'text-primary',
  },
  {
    icon: Users,
    title: 'Secretária Remota',
    description: 'Automação completa do atendimento e gestão do seu escritório.',
    href: '/servicos/secretaria-remota',
    color: 'text-secondary',
  },
]

export function ServicesGrid() {
  return (
    <section className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">Nossos Serviços</h2>
          <p className="text-xl text-muted-foreground">
            Soluções jurídicas e periciais completas, com a tradição e excelência que só 364 anos
            de história podem oferecer.
          </p>
        </div>

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
                <Card className="h-full hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <Icon className={`w-12 h-12 mb-4 ${service.color}`} />
                    <CardTitle className="font-heading">{service.title}</CardTitle>
                    <CardDescription>{service.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button variant="ghost" className="gap-2 p-0" asChild>
                      <Link href={service.href}>
                        Saiba mais
                        <ArrowRight className="w-4 h-4" />
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
