'use client'

import { notFound } from 'next/navigation'
import { ProductVSL } from '@/components/vsl'
import { getProductBySlug } from '@/lib/products/catalog'

export default function AuxilioAcidentePage() {
  const product = getProductBySlug('auxilio-acidente')

  if (!product) {
    notFound()
  }

  return (
    <ProductVSL
      product={product}
      heroColor="blue"
      heroIcon="Shield"
      agitationPoints={[
        'INSS negou auxílio-acidente alegando que sequelas não são permanentes',
        'Médico perito não avaliou corretamente sua incapacidade',
        'Você tem sequelas que reduzem capacidade de trabalho mas não recebe benefício',
        'Perícia durou 5 minutos e não analisou exames/laudos médicos',
        'Perdeu prazo de recurso administrativo e acha que perdeu o direito',
        'Continua trabalhando com dor e limitações sem assistência do INSS'
      ]}
      solutionSteps={[
        'Análise médica - Avaliamos laudos e exames para comprovar sequelas',
        'Perícia judicial - Solicitamos nova perícia com médico imparcial',
        'Concessão judicial - Forçamos INSS a conceder benefício',
        'Retroativo - Recebe desde a data do requerimento administrativo',
        'Auxílio vitalício - 50% do salário de benefício até aposentadoria',
        'Acumulável - Pode receber junto com salário ou aposentadoria'
      ]}
      urgencyMessage="🏥 SEQUELAS PERMANENTES? Auxílio-acidente de 50% do salário"
      guaranteeTitle="Perícia Judicial Imparcial"
      guaranteeDescription="Nova perícia com médico especialista nomeado pelo juiz. Análise completa de todos os exames e laudos."
      stats={{
        years: 14,
        cases: 720,
        successRate: 82,
        clients: 590,
      }}
      customAlert={{
        title: "Auxílio-acidente é VITALÍCIO e ACUMULÁVEL!",
        description: "Diferente do auxílio-doença, o auxílio-acidente não tem prazo de validade. Você recebe 50% do salário de benefício ATÉ se aposentar, mesmo trabalhando. É cumulável com salário!"
      }}
    />
  )
}
