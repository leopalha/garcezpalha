'use client'

import { Shield, CheckCircle2, RefreshCcw, Lock } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

interface GuaranteeSectionProps {
  guaranteeTitle?: string
  guaranteeDescription?: string
  guaranteePeriod?: string
  guaranteePoints?: string[]
}

export function GuaranteeSection({
  guaranteeTitle = 'Garantia de 100% de Satisfação',
  guaranteeDescription = 'Estamos tão confiantes no nosso trabalho que oferecemos garantia total',
  guaranteePeriod = '30 dias',
  guaranteePoints,
}: GuaranteeSectionProps) {
  const defaultPoints = [
    'Se não ficarmos satisfeitos com o resultado, devolvemos 100% do investimento',
    'Acompanhamento gratuito durante todo o período da garantia',
    'Sem letras miúdas: garantia clara e transparente',
    'Atendimento prioritário para clientes com garantia ativa',
  ]

  const points = guaranteePoints || defaultPoints

  return (
    <section className="py-16 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/20">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-emerald-600 rounded-full mb-6">
              <Shield className="h-10 w-10 text-white" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {guaranteeTitle}
            </h2>
            <p className="text-lg text-muted-foreground">
              {guaranteeDescription}
            </p>
          </div>

          {/* Main Guarantee Card */}
          <Card className="border-emerald-200 bg-white dark:bg-gray-900 shadow-xl mb-8">
            <CardContent className="pt-8 pb-8">
              <div className="text-center mb-6">
                <div className="inline-flex items-center gap-2 bg-emerald-100 dark:bg-emerald-900/30 px-6 py-3 rounded-full mb-4">
                  <Lock className="h-5 w-5 text-emerald-600" />
                  <span className="font-bold text-emerald-900 dark:text-emerald-100">
                    Garantia de {guaranteePeriod}
                  </span>
                </div>
                <h3 className="text-2xl font-bold mb-4">
                  Risco Zero para Você
                </h3>
                <p className="text-muted-foreground">
                  Você não arrisca nada. Se não alcançarmos o resultado prometido, devolvemos seu investimento.
                </p>
              </div>

              <div className="h-px bg-gradient-to-r from-transparent via-emerald-300 to-transparent my-8" />

              <div className="space-y-4">
                {points.map((point, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-1">
                      <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                    </div>
                    <p className="text-sm text-gray-700 dark:text-gray-300">{point}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* How Guarantee Works */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="border-emerald-200 bg-white dark:bg-gray-900">
              <CardContent className="pt-6 text-center">
                <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-xl font-bold text-emerald-600">1</span>
                </div>
                <h4 className="font-semibold mb-2">Contrate o Serviço</h4>
                <p className="text-sm text-muted-foreground">
                  Escolha o pacote ideal e inicie seu processo
                </p>
              </CardContent>
            </Card>

            <Card className="border-emerald-200 bg-white dark:bg-gray-900">
              <CardContent className="pt-6 text-center">
                <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-xl font-bold text-emerald-600">2</span>
                </div>
                <h4 className="font-semibold mb-2">Acompanhe o Resultado</h4>
                <p className="text-sm text-muted-foreground">
                  Receba atualizações constantes do andamento
                </p>
              </CardContent>
            </Card>

            <Card className="border-emerald-200 bg-white dark:bg-gray-900">
              <CardContent className="pt-6 text-center">
                <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <RefreshCcw className="h-6 w-6 text-emerald-600" />
                </div>
                <h4 className="font-semibold mb-2">Garantia Ativada</h4>
                <p className="text-sm text-muted-foreground">
                  Satisfação garantida ou seu dinheiro de volta
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="mt-8 p-6 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg text-center">
            <p className="text-emerald-900 dark:text-emerald-100 font-semibold">
              ✅ Garantia incondicional - Sem perguntas, sem complicações
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
