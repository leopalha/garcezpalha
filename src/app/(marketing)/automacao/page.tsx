'use client'

import { Metadata } from 'next'
import { getAllSolutions } from '@/lib/products/checkout-adapter'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, ArrowRight } from 'lucide-react'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Automacao Juridica | Garcez Palha Advogados',
  description:
    'Servicos juridicos automatizados e escaláveis: secretaria remota para escritorios, aposentadoria e beneficios previdenciarios.',
  keywords: [
    'secretaria juridica remota',
    'automacao juridica',
    'aposentadoria',
    'INSS',
    'beneficio previdenciario',
    'terceirizacao juridica',
  ],
}

export default function AutomacaoPage() {
  const automacaoSolutions = getAllSolutions().filter((s) => s.category === 'automacao')

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-primary/5 to-background py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
              <Users className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold">
              Automacao Juridica
            </h1>
            <p className="text-xl text-muted-foreground">
              Solucoes juridicas escaláveis e automatizadas. Secretaria remota para
              advogados e conquista de aposentadorias e beneficios previdenciarios.
            </p>
          </div>
        </div>
      </section>

      {/* Solutions Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {automacaoSolutions.map((solution) => (
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
                    <Link href={`/automacao/${solution.id}`}>
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
              Quer Escalar Seu Escritorio?
            </h2>
            <p className="text-muted-foreground">
              Nossa secretaria remota e solucoes automatizadas permitem que voce foque
              no que faz de melhor enquanto cuidamos da operacao.
            </p>
            <Button size="lg" asChild>
              <Link href="/contato">
                Fale com Nosso Time
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
