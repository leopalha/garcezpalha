'use client'

import { motion } from 'framer-motion'
import { Bot, ScrollText, CheckCircle2 } from 'lucide-react'

const features = [
  {
    icon: Bot,
    title: 'Tecnologia',
    description: 'Inteligencia artificial que trabalha 24 horas por dia. Respostas rapidas e precisas.',
    color: 'text-primary',
    bgColor: 'bg-primary/10',
  },
  {
    icon: ScrollText,
    title: 'Tradicao',
    description: '364 anos de historia juridica. De governadores coloniais a advogados do seculo XXI.',
    color: 'text-primary',
    bgColor: 'bg-primary/10',
  },
  {
    icon: CheckCircle2,
    title: 'Resultado',
    description: 'Transparencia total em cada etapa. Voce acompanha cada movimento do seu processo.',
    color: 'text-primary',
    bgColor: 'bg-primary/10',
  },
]

export function WhyChooseUs() {
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
            Por que a Garcez Palha?
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            A combinacao unica que faz a diferenca
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {features.map((feature, index) => {
            const Icon = feature.icon

            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                className="text-center"
              >
                <div className="flex flex-col items-center">
                  {/* Icon */}
                  <div
                    className={`w-20 h-20 ${feature.bgColor} rounded-2xl flex items-center justify-center mb-6`}
                  >
                    <Icon className={`w-10 h-10 ${feature.color}`} />
                  </div>

                  {/* Title */}
                  <h3 className="font-heading text-2xl font-bold mb-3">
                    {feature.title}
                  </h3>

                  {/* Description */}
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
