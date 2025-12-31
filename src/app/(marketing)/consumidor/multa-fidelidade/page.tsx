'use client'

import { notFound } from 'next/navigation'
import { ProductVSL } from '@/components/vsl'
import { getProductBySlug } from '@/lib/products/catalog'

export default function MultaFidelidadePage() {
  const product = getProductBySlug('multa-fidelidade')

  if (!product) {
    notFound()
  }

  return (
    <ProductVSL
      product={product}
      heroColor="orange"
      heroIcon="X"
      agitationPoints={[
        'Operadora cobra multa de fidelidade mesmo após 12 meses de contrato',
        'Multa proporcional não é aplicada (cobra valor cheio faltando 1 mês)',
        'Serviço não funciona mas operadora se recusa a cancelar sem multa',
        'Mudança de endereço sem cobertura mas operadora cobra multa',
        'Multa abusiva de R$ 1.000+ por cancelamento antecipado',
        'Você não foi informado claramente sobre fidelidade na contratação'
      ]}
      solutionSteps={[
        'Análise do contrato - Verificamos se fidelidade foi informada claramente',
        'Cancelamento sem multa - Questionamos fidelidade abusiva',
        'Multa proporcional - Reduzimos para valor justo (proporcional ao tempo restante)',
        'Falha no serviço - Cancelamos sem multa se serviço não funciona',
        'Restituição - Recuperamos multa paga indevidamente',
        'Danos morais - Indenização por cobrança abusiva (R$ 3k a R$ 6k)'
      ]}
      urgencyMessage="📵 MULTA ABUSIVA? Cancele sem multa ou pague proporcional"
      guaranteeTitle="Cancelamento Facilitado Garantido"
      guaranteeDescription="Se serviço não funciona ou você não foi informado sobre fidelidade, cancelamos sem multa. Se houver fidelidade válida, reduzimos para proporcional."
      stats={{
        years: 8,
        cases: 640,
        successRate: 89,
        clients: 570,
      }}
      customAlert={{
        title: "Multa deve ser PROPORCIONAL ao tempo restante!",
        description: "Se faltam 3 meses de fidelidade, você paga multa de 3 meses, NÃO 12 meses. Cobrar multa cheia é ABUSIVO. Além disso, se serviço não funciona, multa não pode ser cobrada."
      }}
    />
  )
}
