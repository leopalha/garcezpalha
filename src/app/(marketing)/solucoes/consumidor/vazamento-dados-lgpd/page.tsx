'use client'

import { ProductVSL } from '@/components/vsl/ProductVSL'
import { SEOHead, UrgencyBanner } from '@/components/vsl'
import { PRODUTO_VAZAMENTO_DADOS_LGPD } from '@/lib/products/catalog'

export default function VazamentoDadosLGPDPage() {
  return (
    <div className="min-h-screen">
      <SEOHead
        title={PRODUTO_VAZAMENTO_DADOS_LGPD.name}
        description={PRODUTO_VAZAMENTO_DADOS_LGPD.description}
        keywords={PRODUTO_VAZAMENTO_DADOS_LGPD.keywords}
        productName={PRODUTO_VAZAMENTO_DADOS_LGPD.name}
        price={PRODUTO_VAZAMENTO_DADOS_LGPD.price.basic || 0}
        category={PRODUTO_VAZAMENTO_DADOS_LGPD.category}
      />

      <ProductVSL
        product={PRODUTO_VAZAMENTO_DADOS_LGPD}
        heroColor="purple"
        heroIcon="Lock"
        agitationPoints={[
          'Vazamento de dados pessoais expõe CPF, telefone e endereço',
          'Seus dados são vendidos na dark web e usados em golpes',
          'Aumento de spam, ligações e tentativas de fraude',
          'Risco de abertura de contas e empréstimos fraudulentos',
          'Empresa responsável não informa nem indeniza vítimas',
          'LGPD garante indenização por danos morais e materiais'
        ]}
        solutionSteps={[
          'Identificação do vazamento - verificação em bases públicas',
          'Notificação à empresa responsável - pedido de explicações (LGPD)',
          'Reclamação à ANPD - Autoridade Nacional de Proteção de Dados',
          'Ação judicial de indenização - danos morais R$ 5k a R$ 15k',
          'Medidas de proteção - orientação sobre segurança de dados',
          'Acompanhamento até sentença - garantia de indenização'
        ]}
        stats={{
          years: 5,
          cases: 280,
          successRate: 87,
          clients: 250
        }}
        urgencyMessage="Seus dados vazaram? LGPD garante indenização de até R$ 15 mil"
        guaranteeTitle="Proteção LGPD"
        guaranteeDescription="Especialistas em vazamento de dados e LGPD. Notificação às empresas, reclamação à ANPD e ação judicial para indenização."
        customAlert={{
          title: "Seus dados pessoais estão na internet?",
          description: "Vazamento de dados é violação grave da LGPD. Empresas devem informar, proteger e indenizar vítimas. CPF, telefone e dados pessoais expostos geram direito à indenização."
        }}
      />
    </div>
  )
}
