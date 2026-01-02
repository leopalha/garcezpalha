'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  IconBanknote,
  IconHome,
  IconHeart,
  IconShield,
  IconArrowRight,
  IconMessageCircle,
  IconUsers,
  IconTrendingUp,
  IconClock,
} from './icons'

const topServices = [
  {
    icon: IconBanknote,
    title: 'Bancário',
    description: 'Desbloqueio de conta, Golpe PIX, Negativação indevida',
    href: '/solucoes?categoria=bancario',
  },
  {
    icon: IconHome,
    title: 'Imóveis',
    description: 'Usucapião, Regularização, Inventário',
    href: '/solucoes?categoria=imobiliario',
  },
  {
    icon: IconHeart,
    title: 'Saúde',
    description: 'Plano de saúde, Cirurgia bariátrica, TEA/Autismo',
    href: '/solucoes?categoria=saude',
  },
  {
    icon: IconShield,
    title: 'Criminal',
    description: 'Defesa criminal, Habeas corpus, Audiência de custódia',
    href: '/solucoes?categoria=criminal',
  },
]

export function ClientsSection() {
  const whatsappNumber = '5521995354010'
  const whatsappMessage = encodeURIComponent('Olá! Preciso de ajuda jurídica.')
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`

  return (
    <section id="servicos" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 max-w-3xl mx-auto"
        >
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
            Serviços Jurídicos
          </h2>
          <p className="text-xl text-muted-foreground mb-6">
            Resolva seu problema com especialistas
          </p>
          <p className="text-muted-foreground">
            Atendimento rápido, transparente e com preço justo. Nossa equipe está pronta para
            ajudar você em diversas áreas do direito.
          </p>
        </motion.div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {topServices.map((service, index) => {
            const ServiceIcon = service.icon
            return (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Link href={service.href}>
                  <Card className="h-full hover:shadow-lg transition-all hover:scale-105 cursor-pointer group">
                    <CardContent className="pt-8 pb-8 text-center">
                      <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 group-hover:bg-primary group-hover:scale-110 transition-all">
                        <ServiceIcon className="h-7 w-7 text-primary group-hover:text-primary-foreground transition-colors" />
                      </div>
                      <h3 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors">
                        {service.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">{service.description}</p>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            )
          })}
        </div>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
        >
          <Button size="lg" className="text-lg px-8" asChild>
            <Link href="/solucoes">
              Ver Todos os Serviços
              <IconArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="text-lg px-8 gap-2 bg-[#25D366] hover:bg-[#128C7E] text-white border-0"
            asChild
          >
            <Link href={whatsappLink} target="_blank" rel="noopener noreferrer">
              <IconMessageCircle className="h-5 w-5" />
              Falar no WhatsApp
            </Link>
          </Button>
        </motion.div>

        {/* Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto"
        >
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4">
              <IconUsers className="w-6 h-6 text-primary" />
            </div>
            <p className="text-4xl font-bold text-primary mb-2">10.000+</p>
            <p className="text-muted-foreground">Clientes atendidos</p>
          </div>

          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4">
              <IconTrendingUp className="w-6 h-6 text-primary" />
            </div>
            <p className="text-4xl font-bold text-primary mb-2">98%</p>
            <p className="text-muted-foreground">Satisfação</p>
          </div>

          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4">
              <IconClock className="w-6 h-6 text-primary" />
            </div>
            <p className="text-4xl font-bold text-primary mb-2">24/7</p>
            <p className="text-muted-foreground">Atendimento</p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
