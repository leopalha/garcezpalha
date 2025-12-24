import { Metadata } from 'next'
import { ProductPageTemplate } from '@/components/marketing/templates'
import { getSolutionById, SOLUTIONS } from '@/types/checkout'

export const metadata: Metadata = {
  title: 'Pericia Documental | Garcez Palha Advogados',
  description:
    'Pericia documental para verificar autenticidade, adulteracao e falsificacao de documentos. Laudo tecnico para processos judiciais.',
  keywords: [
    'pericia documental',
    'documento falso',
    'adulteracao de documento',
    'laudo pericial documentoscopico',
    'analise de documentos',
  ],
}

export default function PericiaDocumentalPage() {
  const solution = getSolutionById('pericia-documental')!

  const relatedProducts = SOLUTIONS.filter(
    (s) => s.category === 'pericia' && s.id !== 'pericia-documental'
  ).slice(0, 3)

  return (
    <ProductPageTemplate
      heroTitle="Pericia Documental Especializada"
      heroSubtitle="Analise tecnica de documentos para verificar autenticidade, adulteracao, rasuras e falsificacao. Laudo pericial aceito em processos judiciais."
      heroProblem="Suspeita que um documento foi adulterado ou falsificado? Precisa comprovar autenticidade de contrato, recibo ou escritura? Verificar se houve raspagem, montagem ou alteracao digital? Fazemos a pericia."
      solution={solution}
      solutionBenefits={[
        'Exame documentoscopico completo',
        'Analise de elementos de seguranca (papel, tinta, impressao)',
        'Verificacao de adulteracoes e montagens',
        'Confronto com documentos originais',
        'Laudo tecnico fundamentado com fotos e diagramas',
        'Assinatura de perito criminalista habilitado',
      ]}
      documentsRequired={[
        'Documento questionado (original sempre que possivel)',
        'Documentos padroes para comparacao (se houver)',
        'Contexto: como obteve o documento, qual a suspeita',
        'Copias de outros documentos relacionados',
        'Informacoes sobre origem e historico do documento',
      ]}
      faqItems={[
        {
          question: 'O que a pericia documental consegue identificar?',
          answer:
            'Falsificacao de documentos (CNH, RG, diplomas), adulteracao de valores em contratos/recibos, rasuras e emendas, montagens fotograficas, alteracoes digitais impressas, troca de folhas, uso de papel inadequado, impressao falsa de carimbos e selos, e muito mais.',
        },
        {
          question: 'Preciso do documento original ou copia serve?',
          answer:
            'Idealmente o original, pois permite exames mais precisos (tinta, papel, relevo). Mas em muitos casos e possivel fazer analise em copias de alta qualidade, especialmente para montagens digitais e alteracoes grosseiras. Orientamos conforme o caso.',
        },
        {
          question: 'Quanto tempo demora a pericia documental?',
          answer:
            'De 10 a 20 dias uteis dependendo da complexidade. Exames simples (verificar se e original ou copia) sao mais rapidos. Casos complexos com multiplos documentos ou necessidade de reagentes quimicos podem levar mais tempo.',
        },
        {
          question: 'O laudo e aceito em processos judiciais?',
          answer:
            'Sim. Nossos peritos sao habilitados, com formacao em criminologia e documentoscopia. Laudos seguem metodologia cientifica reconhecida e sao aceitos em tribunais. Perito pode ser intimado para prestar esclarecimentos se necessario.',
        },
        {
          question: 'Quanto custa uma pericia documental?',
          answer:
            'A partir de R$ 2.000,00 para analise de 1 a 3 documentos. Valores variam conforme quantidade de documentos, complexidade dos exames necessarios (luz UV, microscopio, reagentes quimicos) e prazo. Solicitamos detalhes para orcamento preciso.',
        },
        {
          question: 'Posso fazer a pericia antes de entrar com processo?',
          answer:
            'Sim, e ate recomendavel. Pericia extrajudicial (antes do processo) permite avaliar se ha provas suficientes para acao judicial, evita surpresas, e o laudo ja fica pronto para juntar a inicial. Economiza tempo e da mais seguranca na estrategia.',
        },
      ]}
      categoryName="Pericia e Documentos"
      relatedProducts={relatedProducts}
    />
  )
}
