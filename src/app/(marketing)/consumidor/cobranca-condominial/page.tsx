'use client'

import { notFound } from 'next/navigation'
import { ProductVSL } from '@/components/vsl'
import { getProductBySlug } from '@/lib/products/catalog'

export default function CobrancaCondominialPage() {
  const product = getProductBySlug('cobranca-condominial')

  if (!product) {
    notFound()
  }

  return (
    <ProductVSL
      product={product}
      heroColor="blue"
      heroIcon="Building2"
      agitationPoints={[
        'Condomínio cobra taxa de obra/reforma que você não aprovou em assembleia',
        'Multa e juros abusivos por atraso (10% multa + 2% juros ao mês)',
        'Cobrança de serviços não prestados ou benfeitorias inexistentes',
        'Ameaça de penhora do apartamento por dívida condominial',
        'Condomínio inclui despesas pessoais do síndico na taxa',
        'Assembleia fraudulenta que aprovou gastos sem quórum válido'
      ]}
      solutionSteps={[
        'Análise das cobranças - Identificamos irregularidades',
        'Suspensão de penhora - Impedimos perda do imóvel',
        'Contestação em assembleia - Questionamos gastos não aprovados',
        'Redução de multa/juros - Limitamos a 2% multa + 1% juros',
        'Parcelamento justo - Negociamos débito real',
        'Anulação de assembleia - Se houve fraude no quórum'
      ]}
      urgencyMessage="🏢 COBRANÇA CONDOMINIAL ABUSIVA? Conteste + Reduza multa"
      guaranteeTitle="Defesa Completa Garantida"
      guaranteeDescription="Analisamos todas as cobranças e atas de assembleia. Se houver irregularidade, reduzimos ou anulamos débito."
      stats={{
        years: 11,
        cases: 420,
        successRate: 85,
        clients: 360,
      }}
      customAlert={{
        title: "Multa condominial não pode passar de 2%!",
        description: "Código Civil limita multa moratória em 2% + juros de 1% ao mês. Se condomínio cobra 10% de multa, isso é ABUSIVO e pode ser reduzido judicialmente."
      }}
    />
  )
}
