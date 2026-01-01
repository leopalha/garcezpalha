'use client'

import { notFound } from 'next/navigation'
import { ProductVSL } from '@/components/vsl'
import { getProductBySlug } from '@/lib/products/catalog'

export default function DiferencasSalariaisPage() {
  const product = getProductBySlug('diferencas-salariais')

  if (!product) {
    notFound()
  }

  return (
    <ProductVSL
      product={product}
      heroColor="green"
      heroIcon="DollarSign"
      agitationPoints={[
        'Empresa paga salário menor que o piso da categoria (convenção coletiva)',
        'Promoção sem aumento salarial correspondente',
        'Desvio de função: trabalha em cargo superior mas recebe como inferior',
        'Equiparação salarial: colegas fazem mesma função e ganham mais',
        'Descontos irregulares no salário (vale-transporte, uniforme)',
        'Empresa ignora reajuste anual previsto em convenção'
      ]}
      solutionSteps={[
        'Análise da convenção coletiva - Verificamos piso salarial da categoria',
        'Equiparação salarial - Provamos igualdade de função',
        'Cálculo de diferenças - 5 anos retroativos + reflexos',
        'Desvio de função - Se trabalha em cargo superior, recebe salário superior',
        'Reflexos em 13º, férias, FGTS - Valores são muito maiores',
        'Execução garantida - Penhora de bens da empresa se necessário'
      ]}
      urgencyMessage="💰 SALÁRIO MENOR QUE DEVERIA? Recupere diferenças de 5 anos"
      guaranteeTitle="Cálculo Gratuito + Honorários de Êxito"
      guaranteeDescription="Calculamos gratuitamente quanto você tem a receber. Honorários apenas sobre valor recuperado (20-30%)."
      stats={{
        years: 13,
        cases: 780,
        successRate: 87,
        clients: 680,
      }}
      customAlert={{
        title: "Diferenças salariais têm reflexos ENORMES!",
        description: "5 anos de diferença salarial + reflexos em 13º, férias, FGTS, horas extras podem resultar em R$ 20k a R$ 100k conforme salário. Não perca pela prescrição!"
      }}
    />
  )
}
