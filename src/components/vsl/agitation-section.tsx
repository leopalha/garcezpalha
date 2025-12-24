'use client'

import { AlertTriangle, XCircle, TrendingDown } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

interface AgitationSectionProps {
  problem: string
  agitationPoints?: string[]
}

export function AgitationSection({ problem, agitationPoints }: AgitationSectionProps) {
  const defaultAgitationPoints = [
    'Cada dia que passa, o problema se agrava',
    'Você pode estar perdendo direitos importantes',
    'A situação pode afetar sua família e seu patrimônio',
  ]

  const points = agitationPoints || defaultAgitationPoints

  return (
    <section className="py-16 bg-red-50 dark:bg-red-950/20">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <AlertTriangle className="h-12 w-12 text-red-600 mx-auto mb-4" />
            <h2 className="text-3xl font-bold mb-4 text-red-900 dark:text-red-100">
              O Problema é Mais Grave do que Parece
            </h2>
            <p className="text-lg text-red-800 dark:text-red-200">
              {problem}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            {points.map((point, index) => (
              <Card key={index} className="border-red-200 bg-white dark:bg-gray-900">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                      {index === 0 && <TrendingDown className="h-6 w-6 text-red-600" />}
                      {index === 1 && <XCircle className="h-6 w-6 text-red-600" />}
                      {index === 2 && <AlertTriangle className="h-6 w-6 text-red-600" />}
                    </div>
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {point}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-8 p-6 bg-red-100 dark:bg-red-900/30 rounded-lg border-l-4 border-red-600">
            <p className="text-red-900 dark:text-red-100 font-semibold">
              ⚠️ Atenção: Quanto mais você espera, mais difícil e custoso fica resolver o problema.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
