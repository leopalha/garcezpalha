'use client'

import { notFound } from 'next/navigation'
import { ProductVSL } from '@/components/vsl'
import { getProductBySlug } from '@/lib/products/catalog'

export default function CartaoConsignadoRMCPage() {
  const product = getProductBySlug('cartao-consignado-rmc')

  if (!product) {
    notFound()
  }

  return (
    <ProductVSL
      product={product}
      heroColor="blue"
      heroIcon="DollarSign"
      agitationPoints={[
        'Cartão consignado com RMC de 5% descontado sem autorização clara',
        'Bancos cobram juros rotativos de até 180% ao ano sobre o limite não usado',
        'RMC não pode ultrapassar o limite de desconto em folha (margem consignável)',
        'Você paga mensalmente mesmo sem usar o cartão (taxa de manutenção)',
        'Desconto automático na folha dificulta o cancelamento do cartão',
        'Bancos se recusam a cancelar alegando "fidelidade contratual"'
      ]}
      solutionSteps={[
        'Análise GRATUITA - Verificamos se seu RMC está irregular',
        'Cancelamento judicial - Suspendemos descontos imediatos via liminar',
        'Restituição em dobro - Recuperamos valores pagos indevidamente',
        'Danos morais - Indenização por descontos abusivos (R$ 5k a R$ 10k)',
        'Bloqueio definitivo - Impedimos novos descontos sem autorização',
        'Sem custos antecipados - Você só paga se ganhar (sucumbência)'
      ]}
      urgencyMessage="🚨 DESCONTO IRREGULAR NA FOLHA? Suspensão em 48h via liminar"
      guaranteeTitle="Análise Gratuita + Liminar em 48h"
      guaranteeDescription="Analisamos seu contracheque gratuitamente. Se confirmarmos RMC irregular, entramos com liminar para suspender descontos em até 48h."
      stats={{
        years: 8,
        cases: 450,
        successRate: 92,
        clients: 420,
      }}
      customAlert={{
        title: "ATENÇÃO: Descontos irregulares podem ser suspensos AGORA!",
        description: "Se você não autorizou expressamente o RMC de 5% ou se o desconto ultrapassa sua margem consignável, podemos suspender via liminar em 48h. Cada mês de desconto irregular você perde dinheiro que pode ser recuperado em dobro."
      }}
    />
  )
}
