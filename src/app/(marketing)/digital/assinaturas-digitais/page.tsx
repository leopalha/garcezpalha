'use client'

import { notFound } from 'next/navigation'
import { ProductVSL } from '@/components/vsl'
import { getProductBySlug } from '@/lib/products/catalog'

export default function AssinaturasDigitaisPage() {
  const product = getProductBySlug('assinaturas-digitais')

  if (!product) {
    notFound()
  }

  return (
    <ProductVSL
      product={product}
      heroColor="purple"
      heroIcon="Lock"
      agitationPoints={[
        'Assinatura de serviço digital que você não consegue cancelar',
        'Site/app cobra renovação automática sem avisar',
        'Empresa ignora solicitações de cancelamento por email/chat',
        'Cobranças recorrentes no cartão mesmo após "cancelamento"',
        'Free trial se transforma em assinatura paga sem autorização clara',
        'Empresa dificulta cancelamento exigindo ligação ou carta registrada'
      ]}
      solutionSteps={[
        'Notificação extrajudicial - Exigimos cancelamento imediato',
        'Bloqueio de cobranças - Orientamos banco a recusar transações',
        'Cancelamento forçado - Ação judicial para cancelar assinatura',
        'Restituição em dobro - Recuperamos cobranças após pedido de cancelamento',
        'Danos morais - Indenização por cobrança abusiva (R$ 3k a R$ 8k)',
        'Precedentes STJ - Jurisprudência favorável ao consumidor'
      ]}
      urgencyMessage="🔒 ASSINATURA INDESEJADA? Cancele + Receba em dobro"
      guaranteeTitle="Cancelamento Garantido + Restituição"
      guaranteeDescription="Forçamos cancelamento via judicial. Valores cobrados após pedido de cancelamento devem ser devolvidos em DOBRO (Art. 42 CDC)."
      stats={{
        years: 5,
        cases: 560,
        successRate: 93,
        clients: 520,
      }}
      customAlert={{
        title: "Dificultar cancelamento é ILEGAL!",
        description: "CDC determina que cancelamento deve ser tão fácil quanto contratação. Se empresa exige telefone/carta/presencial, isso é PRÁTICA ABUSIVA. Você tem direito a cancelar e receber valores em dobro!"
      }}
    />
  )
}
