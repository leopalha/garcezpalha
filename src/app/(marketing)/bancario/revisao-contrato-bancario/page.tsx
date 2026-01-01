'use client'

import { notFound } from 'next/navigation'
import { ProductVSL } from '@/components/vsl'
import { getProductBySlug } from '@/lib/products/catalog'

export default function RevisaoContratoBancarioPage() {
  const product = getProductBySlug('revisao-contrato-bancario')

  if (!product) {
    notFound()
  }

  return (
    <ProductVSL
      product={product}
      heroColor="blue"
      heroIcon="FileText"
      agitationPoints={[
        'Banco cobra tarifas ilegais (TAC, TEC) proibidas pelo Banco Central',
        'Juros abusivos muito acima da média do mercado',
        'Capitalização de juros (juros sobre juros) não autorizada',
        'Você paga R$ 500+ de juros em contrato de R$ 5.000',
        'Seguro embutido sem autorização clara (venda casada)',
        'Desespero financeiro impede questionamento das cláusulas'
      ]}
      solutionSteps={[
        'Análise completa do contrato - Identificamos todas as irregularidades',
        'Cálculo de restituição - TAC, TEC, seguros, juros abusivos',
        'Ação revisional - Reduzimos juros para taxa justa',
        'Restituição em dobro - Recuperamos tarifas ilegais (Art. 42 CDC)',
        'Redução das parcelas - Recálculo com juros corretos',
        'Parcelamento do saldo devedor - Acordo vantajoso após revisão'
      ]}
      urgencyMessage="💰 CONTRATO BANCÁRIO ABUSIVO? Revise + Economize 30-50%"
      guaranteeTitle="Revisão Completa Garantida"
      guaranteeDescription="Analisamos 100% do contrato gratuitamente. Se encontrarmos irregularidades, reduzimos parcelas e recuperamos valores em dobro."
      stats={{
        years: 11,
        cases: 940,
        successRate: 87,
        clients: 820,
      }}
      customAlert={{
        title: "TAC e TEC foram PROIBIDAS pelo Banco Central!",
        description: "Resolução CMN 3.919/2010 proibiu cobrança de TAC (Tarifa de Abertura de Crédito) e TEC (Tarifa de Emissão de Carnê). Se você pagou, tem direito à restituição em DOBRO!"
      }}
    />
  )
}
