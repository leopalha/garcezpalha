'use client'

import { notFound } from 'next/navigation'
import { ProductVSL } from '@/components/vsl'
import { getProductBySlug } from '@/lib/products/catalog'

export default function PortabilidadeNumeroPage() {
  const product = getProductBySlug('portabilidade-numero')

  if (!product) {
    notFound()
  }

  return (
    <ProductVSL
      product={product}
      heroColor="purple"
      heroIcon="RefreshCw"
      agitationPoints={[
        'Operadora nega portabilidade sem justificativa legal',
        'Processo de portabilidade demora mais de 3 dias úteis (ilegal)',
        'Chip da nova operadora não ativa após portabilidade',
        'Número fica sem funcionar durante transição',
        'Perda de contatos, WhatsApp Business, verificações bancárias',
        'Operadora antiga cobra multa indevida para liberar número'
      ]}
      solutionSteps={[
        'Notificação à operadora - Exigimos portabilidade imediata',
        'Anatel + Procon - Denunciamos irregularidade aos órgãos',
        'Liminar judicial - Forçamos portabilidade em 24-48h',
        'Danos morais - Indenização por negativa ilegal (R$ 5k a R$ 12k)',
        'Multa diária - Operadora paga R$ 500-1000/dia de atraso',
        'Portabilidade garantida - Número é transferido judicialmente'
      ]}
      urgencyMessage="📱 PORTABILIDADE NEGADA? Force via judicial + Indenização"
      guaranteeTitle="Portabilidade em 48h ou Indenização"
      guaranteeDescription="Liminar para forçar portabilidade em até 48h. Se não cumprir, operadora paga multa diária + danos morais."
      stats={{
        years: 6,
        cases: 380,
        successRate: 94,
        clients: 360,
      }}
      customAlert={{
        title: "Portabilidade deve ocorrer em ATÉ 3 DIAS ÚTEIS!",
        description: "Resolução Anatel 460/2007: portabilidade deve ser concluída em 3 dias úteis. Atraso ou negativa injustificada gera direito a danos morais + multa diária."
      }}
    />
  )
}
