import { notFound } from 'next/navigation'
import { ProductVSL } from '@/components/vsl'
import { getProductBySlug } from '@/lib/products/catalog'

// ISR: Revalidate every 1 hour (product pages rarely change)
export const revalidate = 3600

// Generate metadata for SEO





export default function CrimesEmpresariaisPage() {
  const product = getProductBySlug('crimes-empresariais')

  if (!product) {
    notFound()
  }

  return (
    <ProductVSL
      product={product}
      heroColor="violet"
      heroIcon="Shield"
      agitationPoints={[
        'Acusações de crimes empresariais podem resultar em prisão e perda total do patrimônio',
        'Inquéritos tributários e fiscais evoluem para processos criminais sem defesa',
        'Bloqueio de bens e contas bancárias paralisa totalmente sua empresa',
        'Sócios e administradores respondem criminalmente por débitos da empresa',
        'Condenação criminal impede contratos públicos e participação em licitações',
        'Reputação empresarial destruída afeta negócios atuais e futuros'
      ]}
      solutionSteps={[
        'Análise URGENTE do caso - Verificamos responsabilidades e estratégia defensiva',
        'Habeas Corpus preventivo - Evitamos prisão de sócios e administradores',
        'Defesa em inquéritos - Atuamos antes da denúncia criminal',
        'Contestação de bloqueios - Liberamos bens e contas essenciais ao negócio',
        'Defesa criminal completa - Absolvição ou desclassificação de crimes',
        'Acordo de delação premiada - Quando vantajoso para o cliente'
      ]}
      urgencyMessage="EMPRESA INVESTIGADA? Defesa criminal empresarial especializada"
      guaranteeTitle="Defesa Estratégica"
      guaranteeDescription="Proteção completa dos sócios, administradores e patrimônio empresarial em investigações criminais."
      stats={{
        years: 15,
        cases: 180,
        successRate: 85,
        clients: 150,
      }}
      customAlert={{
        title: "Crimes Empresariais Mais Comuns",
        description: "Apropriação indébita, fraude tributária, crimes contra ordem econômica, lavagem de dinheiro, estelionato empresarial. Todos com penas de reclusão e multas severas."
      }}
    />
  )
}
