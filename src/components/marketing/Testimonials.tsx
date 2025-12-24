'use client'

import { motion } from 'framer-motion'
import { Quote, Star } from 'lucide-react'

const testimonials = [
  {
    quote: 'Acordei com minha conta bloqueada e não sabia o que fazer. Em 48 horas, meu salário estava liberado. Atendimento incrível, tudo pelo WhatsApp.',
    author: 'Maria S.',
    location: 'Rio de Janeiro',
    case: 'Desbloqueio de Conta',
    stars: 5,
  },
  {
    quote: 'Caí num golpe do PIX e achei que tinha perdido tudo. A Garcez Palha conseguiu recuperar R$ 15 mil. Profissionais de verdade.',
    author: 'João P.',
    location: 'São Paulo',
    case: 'Golpe do PIX',
    stars: 5,
  },
  {
    quote: 'Meu imóvel estava irregular há 20 anos. Conseguiram a usucapião em 4 meses. Finalmente tenho a escritura!',
    author: 'Carlos M.',
    location: 'Rio de Janeiro',
    case: 'Usucapião',
    stars: 5,
  },
  {
    quote: 'O plano negou minha cirurgia. Em 48 horas conseguiram a liminar. Salvaram minha vida, literalmente.',
    author: 'Ana L.',
    location: 'Rio de Janeiro',
    case: 'Plano de Saúde',
    stars: 5,
  },
]

export function Testimonials() {
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
            O que nossos clientes dizem
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Casos reais, resultados reais
          </p>
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.author}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="h-full p-6 bg-muted/50 rounded-xl border border-border/50 hover:shadow-md transition-shadow">
                {/* Quote Icon */}
                <div className="mb-4">
                  <Quote className="w-8 h-8 text-primary/30" />
                </div>

                {/* Quote Text */}
                <p className="text-foreground leading-relaxed mb-6">
                  &ldquo;{testimonial.quote}&rdquo;
                </p>

                {/* Author Info */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-foreground">
                      — {testimonial.author}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {testimonial.location}
                    </p>
                  </div>

                  {/* Case Type Badge */}
                  <div className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-full">
                    {testimonial.case}
                  </div>
                </div>

                {/* Stars */}
                <div className="flex gap-1 mt-4">
                  {Array.from({ length: testimonial.stars }).map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 fill-gold-500 text-gold-500"
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
