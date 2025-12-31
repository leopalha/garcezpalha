'use client'

import { notFound } from 'next/navigation'
import { ProductVSL } from '@/components/vsl'
import { getProductBySlug } from '@/lib/products/catalog'

export default function FraudeConsignadoPage() {
  const product = getProductBySlug('fraude-consignado')

  if (!product) {
    notFound()
  }

  return (
    <ProductVSL
      product={product}
      heroColor="red"
      heroIcon="AlertOctagon"
      agitationPoints={[
        'Desconto em folha de empréstimo que você NUNCA contratou',
        'Golpistas usam seus dados para contratar consignado fraudulento',
        'Banco/financeira se recusa a cancelar alegando "assinatura válida"',
        'Você perde até 35% do salário por fraude que não cometeu',
        'Perícia grafotécnica comprova falsificação mas banco ignora',
        'Negativação por empréstimo fraudulento prejudica crédito'
      ]}
      solutionSteps={[
        'Suspensão URGENTE - Liminar para parar descontos em 48h',
        'Boletim de ocorrência - Registramos fraude na polícia',
        'Perícia grafotécnica - Comprovamos falsificação da assinatura',
        'Cancelamento do contrato - Declaramos nulidade judicial',
        'Restituição em dobro - Recuperamos valores descontados indevidamente',
        'Danos morais - Indenização por fraude (R$ 10k a R$ 30k)'
      ]}
      urgencyMessage="🚨 EMPRÉSTIMO FRAUDULENTO? Suspensão em 48h + Devolução em dobro"
      guaranteeTitle="Suspensão Imediata Garantida"
      guaranteeDescription="Liminar para suspender descontos em até 48h. Perícia grafotécnica para comprovar fraude. Sem custos antecipados."
      stats={{
        years: 7,
        cases: 420,
        successRate: 96,
        clients: 400,
      }}
      customAlert={{
        title: "Cada dia de desconto é DINHEIRO PERDIDO!",
        description: "Se você NÃO contratou o empréstimo, o banco é responsável por verificar autenticidade. Descontos fraudulentos devem ser devolvidos em DOBRO + danos morais. Aja imediatamente!"
      }}
    />
  )
}
