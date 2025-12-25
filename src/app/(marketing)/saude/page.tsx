import { Metadata } from 'next'
import { SOLUTIONS } from '@/types/checkout'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Heart, ArrowRight } from 'lucide-react'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Direito da Saude | Garcez Palha Advogados',
  description:
    'Solucoes juridicas em direito da saude: planos de saude, cirurgias, tratamentos, INSS, BPC/LOAS e pericias medicas.',
  keywords: [
    'direito da saude',
    'direito a saude',
    'plano de saude negou',
    'cirurgia bariatrica',
    'tratamento TEA',
    'BPC LOAS',
    'pericia medica',
    'INSS',
  ],
}

export default function SaudePage() {
  const saudeSolutions = SOLUTIONS.filter((s) => s.category === 'saude')

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-primary/5 to-background py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
              <Heart className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold">
              Direito da Saude
            </h1>
            <p className="text-xl text-muted-foreground">
              Solucoes especializadas em direito da saude. Planos que negam cobertura, cirurgias,
              tratamentos, beneficios do INSS e pericias medicas.
            </p>
          </div>
        </div>
      </section>

      {/* Solutions Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {saudeSolutions.map((solution) => (
              <Card key={solution.id} className="flex flex-col">
                <CardHeader>
                  <CardTitle>{solution.name}</CardTitle>
                  <CardDescription>{solution.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex-1">
                  <div className="space-y-4">
                    <div className="text-3xl font-bold">
                      {new Intl.NumberFormat('pt-BR', {
                        style: 'currency',
                        currency: 'BRL',
                      }).format(solution.price)}
                    </div>
                    <ul className="space-y-2">
                      {solution.features.slice(0, 4).map((feature, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm">
                          <ArrowRight className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
                <CardFooter className="flex gap-2">
                  <Button asChild className="flex-1">
                    <Link href={`/saude/${solution.id}`}>
                      Saiba Mais
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary/5">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center space-y-6">
            <h2 className="text-3xl font-bold">
              Seu Tratamento Foi Negado?
            </h2>
            <p className="text-muted-foreground">
              Nao aceite a negativa do plano de saude. Nossa equipe especializada pode
              reverter a decisao e garantir seu direito ao tratamento.
            </p>
            <Button size="lg" asChild>
              <Link href="/contato">
                Fale com um Especialista
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
