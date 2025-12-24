'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { MessageCircle, Brain, FileCheck, ArrowRight } from 'lucide-react'
import Link from 'next/link'

const steps = [
  {
    number: 1,
    icon: MessageCircle,
    title: 'Contato',
    description: 'Voce nos conta seu problema pelo WhatsApp ou telefone. Entendemos sua situacao e tiramos suas duvidas.',
    color: 'bg-primary',
  },
  {
    number: 2,
    icon: Brain,
    title: 'Analise',
    description: 'Analisamos seu caso detalhadamente e montamos a melhor estrategia. Voce recebe uma proposta clara.',
    color: 'bg-primary',
  },
  {
    number: 3,
    icon: FileCheck,
    title: 'Atuacao',
    description: 'Atuamos no seu caso com total dedicacao. Voce acompanha cada passo em tempo real.',
    color: 'bg-primary',
  },
]

export function HowItWorks() {
  const whatsappNumber = '5521995054553'
  const whatsappMessage = encodeURIComponent('Ola! Preciso de ajuda juridica.')
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
            Como Funciona
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Um processo simples e transparente
          </p>
        </motion.div>

        {/* Steps */}
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Connection Line (desktop only) */}
            <div className="hidden md:block absolute top-16 left-1/6 right-1/6 h-0.5 bg-primary/30" />

            {steps.map((step, index) => {
              const Icon = step.icon

              return (
                <motion.div
                  key={step.number}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                  className="relative"
                >
                  <div className="flex flex-col items-center text-center">
                    {/* Number Circle */}
                    <div
                      className={`relative z-10 w-28 h-28 ${step.color} rounded-full flex items-center justify-center mb-6 shadow-lg`}
                    >
                      <div className="absolute -top-2 -right-2 w-10 h-10 bg-background border-2 border-primary rounded-full flex items-center justify-center shadow-md">
                        <span className="text-xl font-bold text-primary">
                          {step.number}
                        </span>
                      </div>
                      <Icon className="w-12 h-12 text-primary-foreground" />
                    </div>

                    {/* Title */}
                    <h3 className="font-heading text-2xl font-bold mb-3">
                      {step.title}
                    </h3>

                    {/* Description */}
                    <p className="text-muted-foreground leading-relaxed">
                      {step.description}
                    </p>
                  </div>

                  {/* Arrow between steps (mobile only) */}
                  {index < steps.length - 1 && (
                    <div className="md:hidden flex justify-center py-4">
                      <ArrowRight className="w-6 h-6 text-muted-foreground rotate-90" />
                    </div>
                  )}
                </motion.div>
              )
            })}
          </div>
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center mt-12"
        >
          <Button
            size="lg"
            className="gap-2 text-lg px-8 py-6 bg-[#25D366] hover:bg-[#128C7E] text-white shadow-lg hover:shadow-xl transition-all"
            asChild
          >
            <Link href={whatsappLink} target="_blank" rel="noopener noreferrer">
              <MessageCircle className="w-5 h-5" />
              Iniciar Atendimento
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  )
}
