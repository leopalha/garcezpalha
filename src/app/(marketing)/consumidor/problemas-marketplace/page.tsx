'use client'

import { notFound } from 'next/navigation'
import { ProductVSL } from '@/components/vsl'
import { getProductBySlug } from '@/lib/products/catalog'

export default function ProblemasMarketplacePage() {
  const product = getProductBySlug('problemas-marketplace')

  if (!product) {
    notFound()
  }

  return (
    <ProductVSL
      product={product}
      heroColor="orange"
      heroIcon="AlertOctagon"
      agitationPoints={[
        'Produto não chegou mas marketplace não devolve dinheiro',
        'Vendedor sumiu e marketplace alega "não ser responsável"',
        'Produto chegou errado/defeituoso e marketplace dificulta troca',
        'Conta bloqueada indevidamente com saldo retido',
        'Reembolso prometido mas não cai na conta há meses',
        'Atendimento ignora reclamações e processos no site não avançam'
      ]}
      solutionSteps={[
        'Responsabilização solidária - Marketplace responde junto com vendedor',
        'Reembolso imediato - Liminar para devolução em 48h',
        'Danos morais - Indenização por produto não entregue/defeituoso (R$ 3k a R$ 10k)',
        'Restituição em dobro - Valor pago + mesmo valor de indenização',
        'Desbloqueio de conta - Liberação de saldo retido',
        'Processo no JEC - Rápido e sem custas iniciais'
      ]}
      urgencyMessage="🛒 PROBLEMA EM MARKETPLACE? Reembolso + Indenização garantidos"
      guaranteeTitle="Marketplace Responde Solidariamente"
      guaranteeDescription="CDC determina que marketplace (OLX, Mercado Livre, Shopee) responde junto com vendedor. Não aceite \"não somos responsáveis\"."
      stats={{
        years: 5,
        cases: 820,
        successRate: 92,
        clients: 760,
      }}
      customAlert={{
        title: "Marketplace É RESPONSÁVEL mesmo sem ser vendedor!",
        description: "STJ decidiu que marketplaces respondem solidariamente por produtos vendidos em suas plataformas. Você pode processar marketplace + vendedor e receber de quem pagar primeiro."
      }}
    />
  )
}
