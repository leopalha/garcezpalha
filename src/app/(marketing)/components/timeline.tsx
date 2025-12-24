'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { MapPin } from 'lucide-react'
import Link from 'next/link'

const events = [
  {
    year: 1661,
    title: 'Diogo Garcez Palha',
    description: 'Fundador da linhagem em Lisboa, Tesoureiro Geral dos Consulados, Cavaleiro da Ordem de Cristo',
    location: 'Lisboa, Portugal',
  },
  {
    year: 1775,
    title: 'Joaquim Mourão Garcez Palha',
    description: 'Governador de Goa, Diu e Macau. Libertou Macau de facciosos em 1822-23',
    location: 'Goa, Índia Portuguesa',
  },
  {
    year: 1810,
    title: '1º Visconde de Bucelas',
    description: 'Cândido José Mourão Garcez Palha - Coronel de Engenheiros, modernizador de Goa',
    location: 'Ribandar, Goa',
  },
  {
    year: 1842,
    title: 'Barão de Combarjúa',
    description: 'Tomás de Aquino - Defensor pioneiro da língua Konkani, preservação cultural',
    location: 'Ribandar, Goa',
  },
  {
    year: 1856,
    title: 'João Antônio Garcez Palha Filho',
    description: 'Estabelecimento da linha brasileira, aliança com família Leitão',
    location: 'Rio de Janeiro, Brasil',
  },
  {
    year: 1922,
    title: 'Zilka Garcez Palha',
    description: 'Matriarca centenária (98 anos), guardiã da memória familiar',
    location: 'Rio de Janeiro, Brasil',
  },
  {
    year: 1956,
    title: 'Humberto Garcez Palha da Silva',
    description: 'Filho de Zilka, 5ª geração brasileira, pai de Leonardo',
    location: 'Rio de Janeiro, Brasil',
  },
  {
    year: 1986,
    title: 'Leonardo Mendonça Palha da Silva',
    description: 'Advogado OAB/RJ, Perito CONPEJ/RJ, 6ª geração brasileira',
    location: 'Rio de Janeiro, Brasil',
  },
  {
    year: 2025,
    title: 'Era Digital',
    description: 'Tradição desde 1661 unida à tecnologia de ponta em advocacia e perícia',
    location: 'Brasil',
  },
]

export function Timeline() {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">Nossa História</h2>
          <p className="text-xl text-muted-foreground">
            364 anos de tradição, nobreza e serviço em três continentes: Portugal, Índia e Brasil
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="relative">
            {/* Linha vertical */}
            <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-0.5 bg-primary/20" />

            <div className="space-y-12">
              {events.map((event, index) => (
                <motion.div
                  key={event.year}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className={`relative flex items-center ${
                    index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                  }`}
                >
                  {/* Ponto na timeline */}
                  <div className="absolute left-8 md:left-1/2 w-4 h-4 -ml-2 rounded-full bg-primary border-4 border-background z-10" />

                  {/* Conteúdo */}
                  <div
                    className={`ml-16 md:ml-0 md:w-5/12 ${
                      index % 2 === 0 ? 'md:pr-12 md:text-right' : 'md:pl-12'
                    }`}
                  >
                    <div className="inline-block px-4 py-1 rounded-full bg-secondary/10 text-secondary font-semibold mb-2">
                      {event.year}
                    </div>
                    <h3 className="font-heading text-2xl font-bold mb-2">{event.title}</h3>
                    <p className="text-muted-foreground mb-1">{event.description}</p>
                    <p className="text-sm text-muted-foreground/60 flex items-center gap-1 justify-end md:justify-start">
                      <MapPin className="w-3 h-3" />
                      {event.location}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="mt-12 text-center">
            <Button size="lg" asChild>
              <Link href="/historia">Ver História Completa</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
