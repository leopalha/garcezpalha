import { Metadata } from 'next'
import { ProductPageTemplate } from '@/components/marketing/templates'
import { getSolutionById, SOLUTIONS } from '@/types/checkout'

export const metadata: Metadata = {
  title: 'Holding Familiar | Garcez Palha Advogados',
  description:
    'Estruture uma holding familiar para proteger seu patrimonio, reduzir impostos e facilitar sucessao. Planejamento patrimonial e sucessorio completo.',
  keywords: [
    'holding familiar',
    'planejamento patrimonial',
    'planejamento sucessorio',
    'protecao patrimonial',
    'reducao de impostos',
    'blindagem patrimonial',
  ],
}

export default function HoldingFamiliarPage() {
  const solution = getSolutionById('holding-familiar')!

  const relatedProducts = SOLUTIONS.filter(
    (s) => s.category === 'patrimonial' && s.id !== 'holding-familiar'
  ).slice(0, 3)

  return (
    <ProductPageTemplate
      heroTitle="Proteja Seu Patrimonio com Holding Familiar"
      heroSubtitle="Planejamento patrimonial e sucessorio completo. Reduza impostos, proteja bens e facilite a transmissao de patrimonio para seus herdeiros."
      heroProblem="Preocupado com impostos de sucessao? Quer proteger seu patrimonio de credores e processos? Deseja evitar brigas familiares no futuro? A holding familiar e a solucao."
      solution={solution}
      solutionBenefits={[
        'Analise completa do patrimonio familiar',
        'Estruturacao juridica da holding (sociedade limitada ou SA)',
        'Elaboracao de contrato social e estatuto',
        'Planejamento tributario para reducao legal de impostos',
        'Integralizacao de bens imoveis e moveis',
        'Registro na Junta Comercial e Receita Federal',
        'Assessoria continua pos-constituicao',
      ]}
      documentsRequired={[
        'RG e CPF de todos os socios (familia)',
        'Comprovante de residencia de todos',
        'Certidao de casamento ou uniao estavel',
        'Relacao completa de bens (imoveis, veiculos, empresas, investimentos)',
        'Escrituras e documentos dos imoveis',
        'Certidoes negativas (Receita Federal, trabalhista, distribuidores)',
      ]}
      faqItems={[
        {
          question: 'O que e uma holding familiar e como funciona?',
          answer:
            'Holding familiar e uma empresa criada para administrar o patrimonio da familia. Os bens sao transferidos para a empresa, e os membros da familia se tornam socios. Isso permite melhor gestao, protecao patrimonial, reducao de impostos e sucessao planejada sem inventario.',
        },
        {
          question: 'Quanto posso economizar em impostos com uma holding?',
          answer:
            'A economia varia conforme o patrimonio, mas pode ser significativa. No inventario, o ITCMD pode chegar a 8% do patrimonio. Com holding, a sucessao se da por doacao de cotas (isento ou aliquota reduzida) e planejamento tributario pode reduzir imposto de renda sobre alugueis e vendas.',
        },
        {
          question: 'Quais bens podem ser colocados na holding?',
          answer:
            'Praticamente qualquer tipo de patrimonio: imoveis residenciais e comerciais, veiculos, participacoes em outras empresas, investimentos financeiros, direitos autorais, patentes, etc. Analisamos caso a caso para definir a melhor estrutura.',
        },
        {
          question: 'A holding protege meus bens de processos e credores?',
          answer:
            'Sim, quando estruturada preventivamente e de forma legal. Separa o patrimonio pessoal do empresarial, dificulta penhoras e garante protecao juridica. Importante: nao pode ser usada para fraudar credores existentes, apenas como protecao preventiva legitima.',
        },
        {
          question: 'Quanto custa criar uma holding familiar?',
          answer:
            'Nosso pacote completo custa R$ 8.000,00 e inclui toda a estruturacao juridica, registro e assessoria inicial. Custos adicionais incluem taxas de registro (variam por estado) e eventual ITBI na integralizacao de imoveis (depende do municipio - alguns concedem isencao).',
        },
        {
          question: 'Quanto tempo leva para constituir a holding?',
          answer:
            'De 30 a 60 dias em media, considerando elaboracao de documentos, registro na Junta Comercial, CNPJ na Receita Federal e integralizacao dos bens. O prazo pode variar conforme a complexidade do patrimonio e burocracia local.',
        },
      ]}
      categoryName="Protecao Patrimonial"
      relatedProducts={relatedProducts}
    />
  )
}
