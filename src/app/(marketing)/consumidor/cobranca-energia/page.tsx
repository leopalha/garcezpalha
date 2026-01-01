'use client'

import { notFound } from 'next/navigation'
import { ProductVSL } from '@/components/vsl'
import { getProductBySlug } from '@/lib/products/catalog'

export default function CobrancaEnergiaPage() {
  const product = getProductBySlug('cobranca-energia')

  if (!product) {
    notFound()
  }

  return (
    <ProductVSL
      product={product}
      heroColor="yellow"
      heroIcon="Zap"
      agitationPoints={[
        'Conta de luz com valor absurdo sem justificativa técnica',
        'Companhia alega "consumo médio" sem vistoria no local',
        'Ameaça de corte de energia por fatura irregular',
        'Tarifa cobrada errada (residencial como comercial)',
        'Cobrança de débitos prescritos (mais de 5 anos)',
        'Negativa de parcelamento ou renegociação da dívida'
      ]}
      solutionSteps={[
        'Análise técnica - Verificamos se a cobrança é legítima',
        'Suspensão de corte - Liminar para manter energia ligada',
        'Perícia técnica - Solicitamos vistoria do medidor',
        'Recálculo da tarifa - Corrigimos classificação errada',
        'Restituição em dobro - Recuperamos valores pagos a mais',
        'Parcelamento justo - Negociamos débitos reais'
      ]}
      urgencyMessage="⚡ CONTA ABSURDA? Suspensão de corte + Revisão técnica"
      guaranteeTitle="Suspensão de Corte em 48h"
      guaranteeDescription="Liminar para impedir corte de energia em até 48h. Perícia técnica para comprovar irregularidade na cobrança."
      stats={{
        years: 9,
        cases: 540,
        successRate: 87,
        clients: 470,
      }}
      customAlert={{
        title: "Corte de energia é ILEGAL se a cobrança for irregular!",
        description: "Mesmo com débito, a companhia NÃO pode cortar energia se houver contestação judicial. Podemos suspender o corte em 48h via liminar enquanto discutimos a cobrança."
      }}
    />
  )
}
