'use client'

import { notFound } from 'next/navigation'
import { ProductVSL } from '@/components/vsl'
import { getProductBySlug } from '@/lib/products/catalog'

export default function BeneficioNegadoPage() {
  const product = getProductBySlug('beneficio-negado')

  if (!product) {
    notFound()
  }

  return (
    <ProductVSL
      product={product}
      heroColor="red"
      heroIcon="X"
      agitationPoints={[
        'INSS negou aposentadoria mesmo tendo tempo/idade suficiente',
        'Benefício indeferido por "falta de qualidade de segurado"',
        'Períodos de trabalho não foram reconhecidos (rural, informal)',
        'Você perdeu prazo de recurso administrativo de 30 dias',
        'Sistema CNIS não mostra todos os vínculos empregatícios',
        'Sem renda e sem benefício, situação financeira desesperadora'
      ]}
      solutionSteps={[
        'Análise completa - Verificamos tempo de contribuição, idade, carência',
        'Busca de vínculos - Recuperamos períodos não reconhecidos (CNIS, CTPS)',
        'Comprovação de trabalho - Usamos testemunhas para períodos rurais/informais',
        'Ação judicial - Forçamos concessão do benefício',
        'Retroativo - Recebe desde a data do requerimento (até 5 anos)',
        'Implantação garantida - INSS é obrigado a implantar benefício'
      ]}
      urgencyMessage="❌ BENEFÍCIO NEGADO? Recupere seu direito via judicial"
      guaranteeTitle="Concessão Judicial Garantida"
      guaranteeDescription="Analisamos seu caso gratuitamente. Se você tem direito, garantimos concessão via judicial + retroativo."
      stats={{
        years: 16,
        cases: 1240,
        successRate: 86,
        clients: 1070,
      }}
      customAlert={{
        title: "Negativa do INSS NÃO é definitiva!",
        description: "85% das negativas do INSS são revertidas judicialmente. Mesmo que tenha perdido prazo de recurso administrativo, pode entrar na Justiça e receber retroativo de até 5 anos!"
      }}
    />
  )
}
