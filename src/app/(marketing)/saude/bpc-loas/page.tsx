import { Metadata } from 'next'
import { ProductPageTemplate } from '@/components/marketing/templates'
import { getSolutionById, SOLUTIONS } from '@/types/checkout'

export const metadata: Metadata = {
  title: 'BPC LOAS | Garcez Palha Advogados',
  description:
    'Conseguir BPC LOAS para idosos e pessoas com deficiencia. Beneficio de 1 salario minimo mensal. Acao judicial quando INSS nega.',
  keywords: [
    'BPC LOAS',
    'beneficio assistencial',
    'INSS negou BPC',
    'idoso vulneravel',
    'pessoa com deficiencia',
    'um salario minimo',
  ],
}

export default function BPCLOASPage() {
  const solution = getSolutionById('bpc-loas')!

  const relatedProducts = SOLUTIONS.filter(
    (s) => s.category === 'saude' && s.id !== 'bpc-loas'
  ).slice(0, 3)

  return (
    <ProductPageTemplate
      heroTitle="Conquiste Seu BPC/LOAS"
      heroSubtitle="Beneficio assistencial de 1 salario minimo mensal para idosos com 65+ anos ou pessoas com deficiencia em situacao de vulnerabilidade social."
      heroProblem="INSS negou seu pedido de BPC/LOAS alegando que nao ha deficiencia ou que a renda familiar excede o limite? Muitas vezes a pericia esta errada ou a analise de renda e injusta. Podemos reverter."
      solution={solution}
      solutionBenefits={[
        'Analise completa dos requisitos: idade/deficiencia e renda',
        'Levantamento de documentacao medica e social',
        'Novo pedido administrativo ou acao judicial',
        'Acompanhamento de pericia medica do INSS',
        'Questionamento de laudos equivocados',
        'Calculo de atrasados desde a data do requerimento',
      ]}
      documentsRequired={[
        'RG e CPF do requerente',
        'Comprovante de residencia',
        'CPF de todos que moram na mesma casa',
        'Comprovantes de renda de todos do nucleo familiar',
        'Laudos medicos, exames, receitas (se pessoa com deficiencia)',
        'Protocolo de requerimento administrativo (se ja pediu)',
        'Carta de indeferimento do INSS (se houver)',
      ]}
      faqItems={[
        {
          question: 'Quem tem direito ao BPC/LOAS?',
          answer:
            'Idosos com 65 anos ou mais, OU pessoas com deficiencia de longo prazo (fisica, mental, intelectual ou sensorial) que as impeça de participar plena e efetivamente da sociedade. Em ambos os casos, renda familiar per capita deve ser inferior a 1/4 do salario minimo (atualmente ~R$ 353).',
        },
        {
          question: 'Como e calculada a renda familiar per capita?',
          answer:
            'Soma-se a renda de todos que moram na mesma casa (pais, filhos, conjuge, irmaos) e divide pelo numero de pessoas. MAS: jurisprudencia aceita nao contar rendas de outros beneficiarios de BPC, desconsiderar gastos com saude/medicamentos, e outras situacoes. Analisamos para maximizar suas chances.',
        },
        {
          question: 'Se a renda passar um pouco do limite, ainda posso tentar?',
          answer:
            'SIM! O criterio de 1/4 do salario minimo e muito rigido e desatualizado. Justica tem aceitado rendas ate meio salario minimo per capita quando comprovada vulnerabilidade social. Vale a pena tentar judicialmente mesmo se passar um pouco.',
        },
        {
          question: 'O que e considerado deficiencia para o BPC?',
          answer:
            'Impedimentos de longo prazo (minimo 2 anos) que em interacao com barreiras impedem participacao na sociedade: deficiencia fisica grave, mental, intelectual (como sindrome de Down), autismo, cegueira, surdez profunda, doencas degenerativas graves. A pericia deve avaliar nao so a doenca mas o impacto na vida.',
        },
        {
          question: 'Quanto tempo demora para conseguir o BPC?',
          answer:
            'Via administrativa (direto no INSS): 45 a 90 dias. Via judicial (quando negado): 12 a 24 meses, mas com possibilidade de antecipar o beneficio via liminar em casos de extrema necessidade. Recebe atrasados desde a data do primeiro requerimento administrativo.',
        },
        {
          question: 'Quanto custa a acao para BPC/LOAS?',
          answer:
            'Nosso pacote completo custa R$ 1.800,00 com possibilidade de parcelamento. Como o BPC e destinado a pessoas vulneraveis, temos condicoes especiais e flexibilidade. Consulte-nos. Quando ganha, recebe os atrasados que costumam ser varios meses de beneficio acumulado.',
        },
      ]}
      categoryName="Protecao de Saude"
      relatedProducts={relatedProducts}
    />
  )
}
