'use client'

import { notFound } from 'next/navigation'
import { ProductVSL } from '@/components/vsl'
import { getProductBySlug } from '@/lib/products/catalog'

export default function FiesRenegociacaoPage() {
  const product = getProductBySlug('fies-renegociacao')

  if (!product) {
    notFound()
  }

  return (
    <ProductVSL
      product={product}
      heroColor="blue"
      heroIcon="GraduationCap"
      agitationPoints={[
        'Dívida do FIES impagável que só cresce com juros',
        'Parcelas de R$ 500+ impossíveis de pagar com salário atual',
        'Nome negativado por inadimplência do FIES, crédito bloqueado',
        'FGTS bloqueado pela PGFN/União para pagar dívida',
        'Medo de penhora de salário ou bens futuros',
        'Você se formou mas não consegue emprego na área e não paga FIES'
      ]}
      solutionSteps={[
        'Renegociação com desconto - Até 92% de desconto em programas do governo',
        'Parcelamento em até 145 meses - Parcelas de acordo com renda',
        'Suspensão de negativação - Limpamos seu nome durante negociação',
        'Desbloqueio de FGTS - Liberamos saque do FGTS',
        'Análise de irregularidades - Questionamos juros abusivos e capitalização',
        'Defesa em execução - Se já foi executado, defendemos judicialmente'
      ]}
      urgencyMessage="🎓 DÍVIDA FIES? Renegocie com até 92% de desconto"
      guaranteeTitle="Renegociação Facilitada Garantida"
      guaranteeDescription="Orientamos sobre todos os programas de renegociação do governo. Parcelas de acordo com sua renda atual."
      stats={{
        years: 6,
        cases: 340,
        successRate: 91,
        clients: 310,
      }}
      customAlert={{
        title: "Programa de Renegociação 2024/2025 ativo!",
        description: "Governo abriu programa com desconto de até 92% da dívida do FIES. Parcelas podem ser reduzidas para R$ 50-200 conforme renda. Não perca esse prazo!"
      }}
    />
  )
}
