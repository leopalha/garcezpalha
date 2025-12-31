'use client'

import { notFound } from 'next/navigation'
import { ProductVSL } from '@/components/vsl'
import { getProductBySlug } from '@/lib/products/catalog'

export default function HorasExtrasPage() {
  const product = getProductBySlug('horas-extras')

  if (!product) {
    notFound()
  }

  return (
    <ProductVSL
      product={product}
      heroColor="orange"
      heroIcon="Clock"
      agitationPoints={[
        'Trabalha mais de 8h por dia mas não recebe horas extras',
        'Empresa exige disponibilidade 24h mas não paga sobreaviso',
        'Intervalo de almoço reduzido ou suprimido sem compensação',
        'Trabalho em fins de semana e feriados sem adicional correto',
        'Banco de horas irregular usado para não pagar horas extras',
        'Cargo de confiança usado indevidamente para negar direitos'
      ]}
      solutionSteps={[
        'Análise de jornada - Calculamos horas extras não pagas',
        'Coleta de provas - Orientamos sobre prints, e-mails, testemunhas',
        'Cálculo retroativo - 5 anos de horas extras + reflexos (13º, férias, FGTS)',
        'Negociação ou ação - Tentamos acordo antes de judicializar',
        'Perícia trabalhista - Comprovamos jornada excessiva',
        'Execução garantida - Acompanhamos até recebimento do valor'
      ]}
      urgencyMessage="⏰ TRABALHA MAIS DE 8H? Calcule suas horas extras não pagas"
      guaranteeTitle="Cálculo Gratuito + Honorários de Êxito"
      guaranteeDescription="Calculamos gratuitamente quanto você tem a receber. Honorários apenas sobre o valor recuperado (20-30%)."
      stats={{
        years: 12,
        cases: 850,
        successRate: 89,
        clients: 780,
      }}
      customAlert={{
        title: "Horas extras não pagas podem valer DEZENAS DE MILHARES!",
        description: "5 anos de horas extras não pagas + reflexos em 13º, férias, FGTS podem resultar em R$ 30k a R$ 150k dependendo do salário. Não perca seu direito pela prescrição!"
      }}
    />
  )
}
