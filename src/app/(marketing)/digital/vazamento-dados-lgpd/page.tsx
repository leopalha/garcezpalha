'use client'

import { notFound } from 'next/navigation'
import { ProductVSL } from '@/components/vsl'
import { getProductBySlug } from '@/lib/products/catalog'

export default function VazamentoDadosLGPDPage() {
  const product = getProductBySlug('vazamento-dados-lgpd')

  if (!product) {
    notFound()
  }

  return (
    <ProductVSL
      product={product}
      heroColor="red"
      heroIcon="Lock"
      agitationPoints={[
        'Seus dados pessoais (CPF, email, telefone) vazaram em site/empresa',
        'Dados expostos na dark web ou vendidos para terceiros',
        'Empresa não avisou sobre vazamento (obrigação legal LGPD)',
        'Você recebe golpes/spam por causa do vazamento',
        'Empresa se recusa a admitir responsabilidade',
        'Medo de fraudes, clonagem de cartão, abertura de contas em seu nome'
      ]}
      solutionSteps={[
        'Notificação à empresa - Exigimos providências imediatas',
        'Notificação à ANPD - Denunciamos vazamento ao órgão regulador',
        'Medidas preventivas - Orientamos proteção contra fraudes',
        'Danos morais - Indenização por vazamento (R$ 5k a R$ 20k)',
        'Multa à empresa - ANPD pode multar em até R$ 50 milhões',
        'Monitoramento - Acompanhamos uso indevido dos dados'
      ]}
      urgencyMessage="🔒 DADOS VAZADOS? Indenização de R$ 5k a R$ 20k por LGPD"
      guaranteeTitle="LGPD Protege Seus Dados"
      guaranteeDescription="Lei Geral de Proteção de Dados garante direito à indenização por vazamento. Empresa responde por negligência na proteção de dados."
      stats={{
        years: 4,
        cases: 280,
        successRate: 86,
        clients: 240,
      }}
      customAlert={{
        title: "Vazamento de dados gera indenização AUTOMÁTICA!",
        description: "LGPD estabelece responsabilidade objetiva: empresa responde por vazamento INDEPENDENTE de culpa. Só o fato de vazar já gera direito a danos morais. Empresas grandes pagam R$ 10k-20k por pessoa."
      }}
    />
  )
}
