'use client'

import { notFound } from 'next/navigation'
import { ProductVSL } from '@/components/vsl'
import { getProductBySlug } from '@/lib/products/catalog'

export default function RevisaoAposentadoriaPage() {
  const product = getProductBySlug('revisao-aposentadoria')

  if (!product) {
    notFound()
  }

  return (
    <ProductVSL
      product={product}
      heroColor="green"
      heroIcon="TrendingUp"
      agitationPoints={[
        'Aposentadoria com valor menor do que deveria receber',
        'INSS não considerou todos os períodos de contribuição',
        'Cálculo errado do salário de benefício (média das contribuições)',
        'Tempo rural/especial não foi reconhecido',
        'Você se aposentou cedo demais e poderia ter esperado para ganhar mais',
        'Revisar pode aumentar em 20-50% o valor mensal vitalício'
      ]}
      solutionSteps={[
        'Análise completa - Verificamos todos os períodos e cálculos',
        'Inclusão de períodos - Tempo rural, especial, contribuições não computadas',
        'Recálculo do salário - Média correta das 80% maiores contribuições',
        'Aumento vitalício - Benefício corrigido vale para sempre',
        'Retroativo - Diferenças dos últimos 5 anos (pode valer R$ 30k-100k)',
        'Sem risco - Se não aumentar, você não paga honorários'
      ]}
      urgencyMessage="📈 APOSENTADORIA BAIXA? Aumente 20-50% + Retroativo de 5 anos"
      guaranteeTitle="Aumento Garantido ou Não Paga"
      guaranteeDescription="Só cobramos honorários se conseguirmos aumentar sua aposentadoria. Se não aumentar, você não paga nada."
      stats={{
        years: 15,
        cases: 1580,
        successRate: 78,
        clients: 1230,
      }}
      customAlert={{
        title: "Revisão pode valer R$ 50k a R$ 200k + aumento vitalício!",
        description: "5 anos de diferença retroativa + aumento vitalício na aposentadoria podem resultar em R$ 50k a R$ 200k conforme valor do benefício. Quanto maior sua aposentadoria, maior o ganho!"
      }}
    />
  )
}
