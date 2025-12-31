'use client'

import { notFound } from 'next/navigation'
import { ProductVSL } from '@/components/vsl'
import { getProductBySlug } from '@/lib/products/catalog'

export default function CobrancaTelefoniaPage() {
  const product = getProductBySlug('cobranca-telefonia')

  if (!product) {
    notFound()
  }

  return (
    <ProductVSL
      product={product}
      heroColor="purple"
      heroIcon="Phone"
      agitationPoints={[
        'Operadora cobra serviços não contratados (SMS premium, pacotes extras)',
        'Cobrança de fidelidade mesmo após 12 meses de contrato',
        'Valor da fatura muito acima do plano contratado sem justificativa',
        'Internet não funciona mas operadora se recusa a cancelar cobrança',
        'Negativação por conta de cobrança irregular',
        'Atendimento ignora reclamações e continua cobrando valores errados'
      ]}
      solutionSteps={[
        'Análise da fatura - Identificamos cobranças irregulares',
        'Suspensão de negativação - Liminar para limpar seu nome',
        'Cancelamento de serviços - Desobrigação de pagar valores indevidos',
        'Restituição em dobro - Recuperamos valores pagos a mais (Art. 42 CDC)',
        'Danos morais - Indenização por cobrança abusiva (R$ 3k a R$ 8k)',
        'Sem custos antecipados - Honorários apenas se ganhar'
      ]}
      urgencyMessage="📱 COBRANÇA IRREGULAR? Suspensão + Restituição em dobro"
      guaranteeTitle="Análise Gratuita + Restituição Garantida"
      guaranteeDescription="Analisamos sua fatura gratuitamente. Se identificarmos cobrança irregular, garantimos restituição em dobro + danos morais."
      stats={{
        years: 7,
        cases: 680,
        successRate: 91,
        clients: 620,
      }}
      customAlert={{
        title: "Cobrança indevida? Você tem direito a receber em DOBRO!",
        description: "O CDC (Art. 42) determina que cobranças indevidas devem ser restituídas em DOBRO. Se você pagou valores errados, pode recuperar o dobro + danos morais. Não deixe dinheiro na mão da operadora."
      }}
    />
  )
}
