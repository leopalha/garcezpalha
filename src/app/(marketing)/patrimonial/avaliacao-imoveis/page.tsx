import { Metadata } from 'next'
import { ProductPageTemplate } from '@/components/marketing/templates'
import { getSolutionById, SOLUTIONS } from '@/types/checkout'

export const metadata: Metadata = {
  title: 'Avaliacao de Imoveis NBR 14653 | Garcez Palha Advogados',
  description:
    'Laudo de avaliacao de imoveis conforme NBR 14653 para processos judiciais, inventario, partilha, financiamento e negociacoes.',
  keywords: [
    'avaliacao de imoveis',
    'laudo de avaliacao',
    'NBR 14653',
    'avaliacao judicial',
    'pericia imobiliaria',
    'valor de mercado',
  ],
}

export default function AvaliacaoImoveisPage() {
  const solution = getSolutionById('avaliacao-imoveis')!

  const relatedProducts = SOLUTIONS.filter(
    (s) => s.category === 'patrimonial' && s.id !== 'avaliacao-imoveis'
  ).slice(0, 3)

  return (
    <ProductPageTemplate
      heroTitle="Avaliacao Tecnica de Imoveis NBR 14653"
      heroSubtitle="Laudo profissional de avaliacao conforme normas da ABNT. Aceito em processos judiciais, inventarios, partilhas e negociacoes."
      heroProblem="Precisa de laudo tecnico para processo judicial? Inventario exige avaliacao dos imoveis? Quer saber o valor real de mercado antes de vender? Nossa equipe tecnica elabora laudos precisos e fundamentados."
      solution={solution}
      solutionBenefits={[
        'Vistoria tecnica completa do imovel',
        'Pesquisa de mercado e analise comparativa',
        'Laudo fundamentado conforme NBR 14653',
        'Documentacao fotografica detalhada',
        'Aceito em processos judiciais e orgaos publicos',
        'Assinatura de engenheiro ou arquiteto com ART/RRT',
        'Revisao e esclarecimentos inclusos',
      ]}
      documentsRequired={[
        'Endereco completo do imovel',
        'Matricula ou escritura (se houver)',
        'Planta ou croqui (se houver)',
        'IPTU do imovel',
        'Acesso ao imovel para vistoria',
        'Informacoes sobre area, idade e caracteristicas',
      ]}
      faqItems={[
        {
          question: 'O que e NBR 14653 e por que e importante?',
          answer:
            'NBR 14653 e a norma tecnica da ABNT para avaliacao de bens. Estabelece metodologia cientifica rigorosa que garante precisao e credibilidade. Laudos elaborados conforme esta norma tem aceitacao garantida em tribunais, bancos e orgaos publicos.',
        },
        {
          question: 'Qual a diferenca entre avaliacao e pericia?',
          answer:
            'Avaliacao e o laudo tecnico que determina o valor de mercado do imovel. Pericia e uma avaliacao feita durante processo judicial por determinacao do juiz. Nossos profissionais atuam em ambas as modalidades com a mesma qualidade tecnica.',
        },
        {
          question: 'Quanto custa uma avaliacao de imovel?',
          answer:
            'Valores a partir de R$ 1.800,00 para imoveis residenciais urbanos. Variam conforme: tipo de imovel, tamanho, localizacao, finalidade do laudo e prazo. Solicitamos informacoes basicas para fornecer orcamento exato.',
        },
        {
          question: 'Quanto tempo demora para ficar pronto?',
          answer:
            'Prazo padrao e de 10 a 15 dias uteis apos a vistoria. Laudos urgentes podem ser entregues em 5 dias uteis (com acrescimo de 50%). O prazo considera vistoria, pesquisa de mercado, elaboracao do laudo e revisao tecnica.',
        },
        {
          question: 'O laudo serve para financiamento bancario?',
          answer:
            'Depende do banco. Alguns aceitam laudos particulares, outros exigem avaliacao da propria instituicao. Nosso laudo e tecnicamente robusto e pode ser usado para negociacao de valores, mas consulte seu banco sobre aceitacao para aprovacao de credito.',
        },
        {
          question: 'Preciso estar presente na vistoria?',
          answer:
            'Nao e obrigatorio, mas e recomendavel. Se nao puder, basta autorizar acesso ao imovel (proprietario, inquilino ou terceiro com sua permissao). Para imoveis vagos, combinamos forma de acesso (chaves com portaria, imobiliaria, etc).',
        },
      ]}
      categoryName="Protecao Patrimonial"
      relatedProducts={relatedProducts}
    />
  )
}
