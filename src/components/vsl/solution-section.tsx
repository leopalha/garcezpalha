'use client'

import { CheckCircle2, Zap, Target, TrendingUp } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface SolutionSectionProps {
  title?: string
  subtitle?: string
  solutionSteps?: string[]
  onCTA?: () => void
}

export function SolutionSection({
  title = 'Nossa Solução Comprovada',
  subtitle = 'Método testado e aprovado em centenas de casos',
  solutionSteps,
  onCTA,
}: SolutionSectionProps) {
  const defaultSteps = [
    'Análise completa do seu caso em até 24 horas',
    'Estratégia jurídica personalizada e eficiente',
    'Acompanhamento em tempo real de todas as etapas',
    'Transparência total em cada etapa do processo',
  ]

  const steps = solutionSteps || defaultSteps

  return (
    <section className="py-16 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-600 rounded-full mb-4">
              <Target className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-green-900 dark:text-green-100">
              {title}
            </h2>
            <p className="text-lg text-green-800 dark:text-green-200">
              {subtitle}
            </p>
          </div>

          <div className="space-y-6">
            {steps.map((step, index) => (
              <Card key={index} className="border-green-200 bg-white dark:bg-gray-900">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                        {index + 1}
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <CheckCircle2 className="h-5 w-5 text-green-600" />
                        <h3 className="font-semibold text-lg">Passo {index + 1}</h3>
                      </div>
                      <p className="text-gray-700 dark:text-gray-300">{step}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-12 text-center">
            <div className="inline-flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg mb-6">
              <Zap className="h-5 w-5" />
              <span className="font-semibold">Processo Rápido e Eficiente</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">24h</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Primeira Análise</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">2.500+</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Clientes Atendidos</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">95%+</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Taxa de Satisfação</div>
              </div>
            </div>
            {onCTA && (
              <Button size="lg" className="bg-green-600 hover:bg-green-700" onClick={onCTA}>
                <TrendingUp className="h-5 w-5 mr-2" />
                Começar Agora
              </Button>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
