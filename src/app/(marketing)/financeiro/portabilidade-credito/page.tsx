'use client'

import { notFound } from 'next/navigation'
import { ProductVSL } from '@/components/vsl'
import { getProductBySlug } from '@/lib/products/catalog'

export default function PortabilidadeCreditoPage() {
  const product = getProductBySlug('portabilidade-credito')

  if (!product) {
    notFound()
  }

  return (
    <ProductVSL
      product={product}
      heroColor="green"
      heroIcon="RefreshCw"
      agitationPoints={[
        'Banco nega portabilidade sem justificativa legal mesmo com proposta melhor',
        'Você paga juros de 8% ao mês enquanto poderia pagar 3% em outro banco',
        'Recusa injustificada viola Resolução 4.292 do Banco Central',
        'Cada mês de recusa significa centenas ou milhares de reais perdidos',
        'Banco alega "análise de crédito" para barrar portabilidade vantajosa',
        'Cláusulas de fidelidade são usadas ilegalmente para impedir portabilidade'
      ]}
      solutionSteps={[
        'Análise da proposta - Verificamos se a recusa é ilegal',
        'Notificação extrajudicial - Damos prazo de 10 dias para aceitar',
        'Ação judicial - Liminar para forçar portabilidade em 48h',
        'Diferença retroativa - Recuperamos juros pagos a mais desde a recusa',
        'Danos morais - Indenização por recusa abusiva (R$ 5k a R$ 15k)',
        'Portabilidade garantida - Banco é obrigado a aceitar'
      ]}
      urgencyMessage="💰 ECONOMIZE ATÉ 60% EM JUROS - Portabilidade forçada via liminar"
      guaranteeTitle="Portabilidade Garantida ou Devolução"
      guaranteeDescription="Se não conseguirmos forçar a portabilidade via judicial, você não paga nada. Garantia total de resultado."
      stats={{
        years: 6,
        cases: 180,
        successRate: 95,
        clients: 170,
      }}
      customAlert={{
        title: "Cada mês sem portabilidade você PERDE DINHEIRO!",
        description: "Se você tem proposta de outro banco com juros menores e o banco atual recusou, isso é ILEGAL. A cada mês você paga centenas/milhares de reais a mais. Aja agora e recupere a diferença retroativamente."
      }}
    />
  )
}
