'use client'

import { Star, Quote, ThumbsUp, CheckCircle } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'

interface Testimonial {
  name: string
  initials: string
  city: string
  rating: number
  text: string
  result?: string
}

interface TestimonialsSectionProps {
  testimonials?: Testimonial[]
}

export function TestimonialsSection({ testimonials }: TestimonialsSectionProps) {
  const defaultTestimonials: Testimonial[] = [
    {
      name: 'Maria Silva',
      initials: 'MS',
      city: 'São Paulo, SP',
      rating: 5,
      text: 'Excelente atendimento! Acompanhamento constante do andamento processual. Profissionais extremamente competentes e atenciosos.',
      result: 'Caso atendido com excelência',
    },
    {
      name: 'João Santos',
      initials: 'JS',
      city: 'Rio de Janeiro, RJ',
      rating: 5,
      text: 'Estava desesperado com minha situação e eles me ajudaram de forma excepcional. Recomendo muito!',
      result: 'Orientação completa recebida',
    },
    {
      name: 'Ana Costa',
      initials: 'AC',
      city: 'Belo Horizonte, MG',
      rating: 5,
      text: 'Profissionalismo e dedicação do início ao fim. Superaram minhas expectativas.',
      result: 'Atendimento de qualidade',
    },
    {
      name: 'Carlos Oliveira',
      initials: 'CO',
      city: 'Brasília, DF',
      rating: 5,
      text: 'A melhor decisão que tomei foi contratar esse escritório. Atuação técnica diferenciada!',
      result: 'Processo bem conduzido',
    },
    {
      name: 'Juliana Ferreira',
      initials: 'JF',
      city: 'Porto Alegre, RS',
      rating: 5,
      text: 'Equipe muito preparada e sempre disponível para tirar dúvidas. Fiquei muito satisfeita.',
      result: 'Comunicação ágil e transparente',
    },
    {
      name: 'Roberto Alves',
      initials: 'RA',
      city: 'Curitiba, PR',
      rating: 5,
      text: 'Honestidade e transparência em todo o processo. Realmente se importam com o cliente.',
      result: 'Acordo obtido com orientação especializada',
    },
  ]

  const items = testimonials || defaultTestimonials

  return (
    <section className="py-16 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <ThumbsUp className="h-12 w-12 text-purple-600 mx-auto mb-4" />
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              O Que Nossos Clientes Dizem
            </h2>
            <p className="text-lg text-muted-foreground">
              Mais de 1.000 clientes satisfeitos em todo o Brasil
            </p>
          </div>

          {/* Overall Rating */}
          <div className="bg-white dark:bg-gray-900 rounded-lg p-6 shadow-lg mb-12 max-w-md mx-auto">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="h-6 w-6 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <div className="text-3xl font-bold">5.0</div>
              <div className="text-sm text-muted-foreground">Baseado em 500+ avaliações</div>
            </div>
          </div>

          {/* Testimonials Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((testimonial, index) => (
              <Card key={index} className="border-purple-200 bg-white dark:bg-gray-900 hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-3 mb-4">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback className="bg-purple-100 dark:bg-purple-900/30 text-purple-600 font-semibold">
                        {testimonial.initials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="font-semibold">{testimonial.name}</div>
                      <div className="text-xs text-muted-foreground">{testimonial.city}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 mb-3">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>

                  <div className="relative mb-4">
                    <Quote className="absolute -top-2 -left-2 h-8 w-8 text-purple-200 dark:text-purple-800" />
                    <p className="text-sm text-gray-700 dark:text-gray-300 pl-6">
                      "{testimonial.text}"
                    </p>
                  </div>

                  {testimonial.result && (
                    <div className="flex items-center gap-2 bg-purple-50 dark:bg-purple-900/20 px-3 py-2 rounded-lg">
                      <CheckCircle className="h-4 w-4 text-purple-600 flex-shrink-0" />
                      <span className="text-xs font-medium text-purple-900 dark:text-purple-100">
                        {testimonial.result}
                      </span>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Trust Indicators */}
          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">1000+</div>
              <div className="text-sm text-muted-foreground">Clientes Atendidos</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">5.0</div>
              <div className="text-sm text-muted-foreground">Avaliação Média</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">95%</div>
              <div className="text-sm text-muted-foreground">Taxa de Sucesso em Casos Similares</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">15+</div>
              <div className="text-sm text-muted-foreground">Anos no Mercado</div>
            </div>
          </div>

          {/* OAB Compliance Disclaimer */}
          <div className="mt-12 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg text-sm text-gray-600 dark:text-gray-400">
            <p className="font-semibold mb-2">IMPORTANTE:</p>
            <p>
              Este conteúdo tem caráter meramente informativo e educacional.
              Não constitui promessa de resultado ou garantia de êxito em processos judiciais.
              Cada caso é analisado individualmente conforme suas particularidades.
              Os prazos processuais variam de acordo com a complexidade de cada situação
              e o andamento do Poder Judiciário.
            </p>
            <p className="mt-2 text-xs">OAB/RJ 219.390 | CONPEJ/RJ | CRECI/RJ</p>
          </div>
        </div>
      </div>
    </section>
  )
}
