/**
 * Proposal Generator
 * Generates personalized proposals with dynamic pricing based on qualification results
 */

import type { QualificationResult, LeadCategory } from './types'
import type { PaymentLink } from './payment-link-generator'

/**
 * Proposal section
 */
export interface ProposalSection {
  title: string
  content: string
  order: number
}

/**
 * Complete proposal
 */
export interface Proposal {
  id: string
  leadId: string
  productId: string
  productName: string
  clientName: string
  sections: ProposalSection[]
  pricing: {
    basePrice: number
    adjustedPrice: number
    discount: number
    installments: number
    estimatedCaseValue: number
  }
  validUntil: Date
  createdAt: Date
  paymentLink?: PaymentLink
  metadata: {
    leadCategory: LeadCategory
    qualificationScore: number
    urgency: number
    probability: number
    complexity: number
  }
}

/**
 * Product base prices (in cents)
 */
const PRODUCT_BASE_PRICES: Record<string, number> = {
  'desbloqueio-conta': 150000, // R$ 1.500
  'golpe-pix': 200000, // R$ 2.000
  'negativacao-indevida': 120000, // R$ 1.200
  'defesa-execucao': 300000, // R$ 3.000
  'plano-saude': 250000, // R$ 2.500
  'cirurgia-bariatrica': 300000, // R$ 3.000
  'tratamento-tea': 280000, // R$ 2.800
  'pericia-medica': 150000, // R$ 1.500
  'bpc-loas': 180000, // R$ 1.800
  'aposentadoria': 220000, // R$ 2.200
  'direito-imobiliario': 400000, // R$ 4.000
  'usucapiao': 500000, // R$ 5.000
  'regularizacao-imovel': 350000, // R$ 3.500
  'holding-familiar': 800000, // R$ 8.000
  'inventario': 600000, // R$ 6.000
  'avaliacao-imoveis': 200000, // R$ 2.000
  'pericia-documental': 180000, // R$ 1.800
  'grafotecnia': 200000, // R$ 2.000
  'laudo-tecnico': 250000, // R$ 2.500
  'direito-criminal': 500000, // R$ 5.000
  'direito-aeronautico': 400000, // R$ 4.000
  'secretaria-remota': 100000, // R$ 1.000/month
}

/**
 * Product descriptions
 */
const PRODUCT_DESCRIPTIONS: Record<string, { name: string; description: string }> = {
  'desbloqueio-conta': {
    name: 'Desbloqueio de Conta Bancária',
    description:
      'Ação judicial para desbloqueio urgente de conta bancária bloqueada indevidamente. Inclui medida liminar para liberação imediata dos valores.',
  },
  'golpe-pix': {
    name: 'Recuperação de Valores - Golpe PIX',
    description:
      'Recuperação de valores transferidos via PIX em casos de golpe ou fraude. Ação com Medida de Bloqueio Judicial (MED) em até 7 dias.',
  },
  'negativacao-indevida': {
    name: 'Remoção de Negativação Indevida',
    description:
      'Ação para remoção de negativação indevida do CPF/CNPJ com pedido de indenização por danos morais e materiais.',
  },
  'defesa-execucao': {
    name: 'Defesa em Execução Judicial',
    description:
      'Defesa completa em processo de execução, com análise de vícios processuais e possibilidade de redução ou extinção da dívida.',
  },
  'plano-saude': {
    name: 'Ação contra Plano de Saúde',
    description:
      'Ação judicial para cobertura de procedimentos, tratamentos ou internações negadas pelo plano de saúde.',
  },
  'cirurgia-bariatrica': {
    name: 'Autorização de Cirurgia Bariátrica',
    description:
      'Ação específica para autorização de cirurgia bariátrica negada pelo plano de saúde, com pedido de tutela de urgência.',
  },
  'tratamento-tea': {
    name: 'Cobertura de Tratamento TEA/Autismo',
    description:
      'Ação para garantir cobertura integral de tratamento multidisciplinar para TEA (Transtorno do Espectro Autista).',
  },
  'pericia-medica': {
    name: 'Perícia Médica',
    description: 'Avaliação médica especializada para processos judiciais e administrativos.',
  },
  'bpc-loas': {
    name: 'BPC/LOAS - Benefício Assistencial',
    description:
      'Ação para concessão do Benefício de Prestação Continuada (BPC/LOAS) para idosos ou pessoas com deficiência.',
  },
  'aposentadoria': {
    name: 'Aposentadoria INSS',
    description:
      'Ação previdenciária para concessão, revisão ou restabelecimento de aposentadoria junto ao INSS.',
  },
  'direito-imobiliario': {
    name: 'Consultoria em Direito Imobiliário',
    description:
      'Consultoria jurídica especializada em questões imobiliárias, contratos, regularização e litígios.',
  },
  'usucapiao': {
    name: 'Usucapião',
    description:
      'Processo de usucapião para aquisição de propriedade por posse prolongada, incluindo todas as etapas até o registro.',
  },
  'regularizacao-imovel': {
    name: 'Regularização de Imóvel',
    description:
      'Regularização fundiária e documental de imóvel, incluindo averbações, retificações e registro.',
  },
  'holding-familiar': {
    name: 'Constituição de Holding Familiar',
    description:
      'Estruturação completa de holding familiar para proteção patrimonial, sucessão e planejamento tributário.',
  },
  'inventario': {
    name: 'Inventário e Partilha de Bens',
    description:
      'Processo de inventário judicial ou extrajudicial para partilha de herança entre herdeiros.',
  },
  'avaliacao-imoveis': {
    name: 'Avaliação de Imóveis',
    description:
      'Laudo técnico de avaliação imobiliária conforme NBR 14653, para fins judiciais ou extrajudiciais.',
  },
  'pericia-documental': {
    name: 'Perícia Documental',
    description:
      'Análise pericial de documentos para verificação de autenticidade, adulteração ou falsificação.',
  },
  'grafotecnia': {
    name: 'Perícia Grafotécnica',
    description:
      'Perícia especializada em assinaturas para verificação de autenticidade em documentos contestados.',
  },
  'laudo-tecnico': {
    name: 'Laudo Técnico Pericial',
    description: 'Elaboração de laudo técnico pericial para processos judiciais.',
  },
  'direito-criminal': {
    name: 'Defesa Criminal',
    description:
      'Defesa criminal completa, incluindo inquérito policial, ação penal, recursos e execução penal.',
  },
  'direito-aeronautico': {
    name: 'Direito Aeronáutico',
    description:
      'Assessoria jurídica especializada em direito aeronáutico, incluindo defesas em processos da ANAC.',
  },
  'secretaria-remota': {
    name: 'Automação e Secretaria Jurídica',
    description: 'Sistema de automação e gestão de secretaria jurídica remota.',
  },
}

/**
 * Generate complete proposal from qualification result
 */
export function generateProposal(
  result: QualificationResult,
  clientName: string,
  paymentLink?: PaymentLink
): Proposal {
  const productInfo = PRODUCT_DESCRIPTIONS[result.productId] || {
    name: 'Serviço Jurídico',
    description: 'Atendimento jurídico personalizado.',
  }

  const basePrice = PRODUCT_BASE_PRICES[result.productId] || 100000

  const sections = generateProposalSections(result, clientName, productInfo)

  return {
    id: `prop_${result.leadId}`,
    leadId: result.leadId,
    productId: result.productId,
    productName: productInfo.name,
    clientName,
    sections,
    pricing: {
      basePrice,
      adjustedPrice: result.recommendedAction.estimatedFee || 0,
      discount: basePrice - (result.recommendedAction.estimatedFee || 0),
      installments: result.score.category === 'hot' ? 1 : result.score.category === 'warm' ? 3 : 6,
      estimatedCaseValue: result.recommendedAction.estimatedValue || 0,
    },
    validUntil: new Date(Date.now() + getValidityHours(result.score.category) * 60 * 60 * 1000),
    createdAt: new Date(),
    paymentLink,
    metadata: {
      leadCategory: result.score.category,
      qualificationScore: result.score.total,
      urgency: result.score.urgency,
      probability: result.score.probability,
      complexity: result.score.complexity,
    },
  }
}

/**
 * Generate proposal sections based on qualification
 */
function generateProposalSections(
  result: QualificationResult,
  clientName: string,
  productInfo: { name: string; description: string }
): ProposalSection[] {
  const sections: ProposalSection[] = []

  // 1. Introduction
  sections.push({
    title: 'Prezado(a) ' + clientName,
    content: generateIntroduction(result, clientName, productInfo),
    order: 1,
  })

  // 2. Case Analysis
  sections.push({
    title: 'Análise do Caso',
    content: generateCaseAnalysis(result),
    order: 2,
  })

  // 3. Proposed Solution
  sections.push({
    title: 'Solução Proposta',
    content: generateProposedSolution(result, productInfo),
    order: 3,
  })

  // 4. Scope of Work
  sections.push({
    title: 'Escopo do Trabalho',
    content: generateScopeOfWork(result, productInfo),
    order: 4,
  })

  // 5. Timeline
  sections.push({
    title: 'Prazos Estimados',
    content: generateTimeline(result),
    order: 5,
  })

  // 6. Investment
  sections.push({
    title: 'Investimento',
    content: generateInvestment(result),
    order: 6,
  })

  // 7. Why Choose Us
  sections.push({
    title: 'Por que escolher Garcez Palha?',
    content: generateWhyChooseUs(),
    order: 7,
  })

  // 8. Next Steps
  sections.push({
    title: 'Próximos Passos',
    content: generateNextSteps(result),
    order: 8,
  })

  return sections
}

/**
 * Generate introduction section
 */
function generateIntroduction(
  result: QualificationResult,
  clientName: string,
  productInfo: { name: string; description: string }
): string {
  return `Agradecemos seu contato e confiança em nosso escritório.

Após análise detalhada das informações fornecidas, elaboramos esta proposta personalizada para atendimento do seu caso de **${productInfo.name}**.

**Garcez Palha Advocacia** é um escritório com mais de 364 anos de tradição, especializado em soluções jurídicas eficazes e personalizadas.`
}

/**
 * Generate case analysis section
 */
function generateCaseAnalysis(result: QualificationResult): string {
  const analysis = result.score.reasoning.map(r => `• ${r}`).join('\n')

  let urgencyLevel = ''
  if (result.score.urgency >= 80) {
    urgencyLevel = '**URGÊNCIA MÁXIMA** - Recomendamos início imediato dos procedimentos.'
  } else if (result.score.urgency >= 60) {
    urgencyLevel = '**URGÊNCIA ALTA** - Caso requer atenção prioritária.'
  } else if (result.score.urgency >= 40) {
    urgencyLevel = '**URGÊNCIA MODERADA** - Caso deve ser tratado com atenção.'
  } else {
    urgencyLevel = 'Caso pode ser tratado com planejamento adequado.'
  }

  return `Com base na análise preliminar do seu caso, identificamos os seguintes pontos relevantes:

${analysis}

**Nível de Urgência:** ${urgencyLevel}

**Avaliação Geral:** Caso com ${result.score.probability}% de probabilidade de sucesso, classificado como **${result.score.category.toUpperCase()}** em nossa escala de priorização.`
}

/**
 * Generate proposed solution section
 */
function generateProposedSolution(
  result: QualificationResult,
  productInfo: { name: string; description: string }
): string {
  return `${productInfo.description}

**Estratégia Recomendada:**

${getSolutionStrategy(result)}

Nossa abordagem é fundamentada em jurisprudência sólida e legislação específica, maximizando suas chances de êxito.`
}

/**
 * Get solution strategy based on product and case complexity
 */
function getSolutionStrategy(result: QualificationResult): string {
  const strategies: Record<string, string> = {
    'desbloqueio-conta':
      '1. Petição inicial com pedido de tutela de urgência\n2. Comprovação da ilegalidade do bloqueio\n3. Acompanhamento até liberação total dos valores',
    'golpe-pix':
      '1. Acionamento imediato da Medida de Bloqueio Judicial (MED)\n2. Notificação extrajudicial ao banco\n3. Ação judicial de ressarcimento\n4. Acompanhamento até recuperação dos valores',
    'negativacao-indevida':
      '1. Análise completa da negativação e documentação\n2. Notificação extrajudicial aos órgãos de proteção ao crédito\n3. Ação judicial com pedido de liminar\n4. Pedido de indenização por danos morais',
    'plano-saude':
      '1. Análise do contrato e negativa\n2. Notificação extrajudicial à operadora\n3. Ação judicial com pedido de tutela antecipada\n4. Acompanhamento até autorização do procedimento',
  }

  return strategies[result.productId] || '1. Análise detalhada do caso\n2. Estratégia personalizada\n3. Acompanhamento completo do processo'
}

/**
 * Generate scope of work section
 */
function generateScopeOfWork(
  result: QualificationResult,
  productInfo: { name: string; description: string }
): string {
  return `**Serviços Inclusos:**

✓ Análise completa da documentação
✓ Elaboração de toda petição inicial e documentos processuais
✓ Protocolo da ação judicial (se aplicável)
✓ Acompanhamento processual completo
✓ Interposição de recursos necessários
✓ Comunicação regular sobre andamento do processo
✓ Atendimento prioritário via WhatsApp, e-mail e telefone
✓ Acesso à área do cliente para acompanhamento online

**Não Inclusos:**

✗ Custas judiciais e honorários periciais (se houver)
✗ Despesas com certidões e documentos de terceiros
✗ Recursos extraordinários (salvo acordo prévio)

**Obs:** Caso sejam necessários serviços adicionais não previstos neste escopo, você será comunicado previamente para autorização.`
}

/**
 * Generate timeline section
 */
function generateTimeline(result: QualificationResult): string {
  const timelines: Record<string, string> = {
    'desbloqueio-conta':
      '• **Protocolo inicial:** 24-48 horas após confirmação\n• **Liminar:** 3-7 dias úteis\n• **Liberação dos valores:** 10-30 dias (média)',
    'golpe-pix':
      '• **MED (bloqueio):** 24-48 horas\n• **Protocolo da ação:** 5-7 dias úteis\n• **Recuperação:** 30-90 dias (depende do banco)',
    'negativacao-indevida':
      '• **Notificação extrajudicial:** 3-5 dias úteis\n• **Protocolo judicial:** 7-10 dias úteis\n• **Liminar:** 15-30 dias\n• **Sentença:** 6-12 meses',
    'plano-saude':
      '• **Notificação à operadora:** 24-48 horas\n• **Protocolo judicial:** 5-7 dias úteis\n• **Tutela antecipada:** 7-15 dias\n• **Sentença:** 4-8 meses',
  }

  return (
    timelines[result.productId] ||
    '• **Início:** Imediato após confirmação\n• **Desenvolvimento:** Conforme complexidade\n• **Conclusão:** Estimativa será fornecida após análise completa'
  )
}

/**
 * Generate investment section
 */
function generateInvestment(result: QualificationResult): string {
  const basePrice = PRODUCT_BASE_PRICES[result.productId] || 100000
  const adjustedPrice = result.recommendedAction.estimatedFee || 0
  const discount = basePrice - adjustedPrice
  const estimatedValue = result.recommendedAction.estimatedValue || 0

  let installments = 1
  if (result.score.category === 'warm') installments = 3
  if (result.score.category === 'cold') installments = 6

  const hasDiscount = discount > 0

  let content = `**Valor do Serviço:**\n\n`

  if (hasDiscount) {
    content += `~~R$ ${(basePrice / 100).toFixed(2)}~~ **R$ ${(adjustedPrice / 100).toFixed(2)}**\n\n`
    content += `*Desconto especial de R$ ${(discount / 100).toFixed(2)} aplicado com base na análise do caso.*\n\n`
  } else {
    content += `**R$ ${(adjustedPrice / 100).toFixed(2)}**\n\n`
  }

  if (installments > 1) {
    const installmentValue = adjustedPrice / installments
    content += `**Parcelamento:** Até ${installments}x de R$ ${(installmentValue / 100).toFixed(2)} sem juros\n\n`
  }

  if (estimatedValue > 0) {
    content += `**Valor Estimado do Caso:** R$ ${(estimatedValue / 100).toFixed(2)}\n\n`
    const roi = ((estimatedValue / adjustedPrice - 1) * 100).toFixed(0)
    content += `*Retorno sobre investimento estimado: ${roi}%*\n\n`
  }

  content += `**Formas de Pagamento:**\n`
  content += `• PIX (aprovação imediata)\n`
  content += `• Cartão de crédito (parcelado)\n`
  content += `• Boleto bancário\n\n`

  if (result.score.category === 'hot') {
    const validHours = getValidityHours('hot')
    content += `⏰ **Proposta válida por ${validHours} horas** - Condições especiais para pagamento imediato.`
  }

  return content
}

/**
 * Generate why choose us section
 */
function generateWhyChooseUs(): string {
  return `🏛️ **364 Anos de Tradição em Direito**

Somos um dos escritórios mais tradicionais do Brasil, com história que remonta ao século XVII.

**Diferenciais:**

✓ **Especialização** - Equipe altamente qualificada em diversas áreas do Direito
✓ **Tecnologia** - Sistema próprio de gestão e acompanhamento de processos
✓ **Transparência** - Você acompanha tudo em tempo real
✓ **Resultados** - Mais de 85% de êxito em nossas ações
✓ **Atendimento Humanizado** - Você não é um número, é nosso parceiro

**Reconhecimentos:**

• OAB/SP - Registro ativo
• Especializações em todas as áreas de atuação
• Centenas de clientes atendidos com sucesso`
}

/**
 * Generate next steps section
 */
function generateNextSteps(result: QualificationResult): string {
  if (result.score.category === 'hot') {
    return `Para darmos início imediato ao seu caso:

1️⃣ **Confirme seu interesse** respondendo esta mensagem
2️⃣ **Efetue o pagamento** através do link que enviaremos
3️⃣ **Agende sua consulta** para hoje ou amanhã
4️⃣ **Receba acesso** à área do cliente
5️⃣ **Início imediato** dos procedimentos

⚡ **Atendimento Prioritário** - Casos urgentes têm início em até 24 horas!

Podemos começar agora?`
  }

  return `Para darmos prosseguimento:

1️⃣ **Analise esta proposta** com calma
2️⃣ **Esclareça dúvidas** se tiver alguma
3️⃣ **Confirme seu interesse** quando estiver pronto(a)
4️⃣ **Efetue o pagamento** através do link que enviaremos
5️⃣ **Agendaremos** sua consulta inicial
6️⃣ **Início** dos trabalhos

Estou à disposição para esclarecer qualquer dúvida! 😊`
}

/**
 * Get proposal validity hours by category
 */
function getValidityHours(category: LeadCategory): number {
  const hours = {
    hot: 24,
    warm: 72,
    cold: 168,
    unqualified: 48,
  }
  return hours[category]
}

/**
 * Format proposal as WhatsApp message
 */
export function formatProposalForWhatsApp(proposal: Proposal): string {
  let message = ''

  for (const section of proposal.sections.sort((a, b) => a.order - b.order)) {
    message += `*${section.title}*\n\n${section.content}\n\n---\n\n`
  }

  return message.trim()
}

/**
 * Format proposal as HTML email
 */
export function formatProposalAsHTML(proposal: Proposal): string {
  let html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 800px; margin: 0 auto; padding: 20px; }
    h1 { color: #0066cc; border-bottom: 3px solid #0066cc; padding-bottom: 10px; }
    h2 { color: #004499; margin-top: 30px; }
    .highlight { background-color: #fff3cd; padding: 15px; border-left: 4px solid #ffc107; margin: 20px 0; }
    .price { font-size: 32px; color: #28a745; font-weight: bold; }
    .old-price { text-decoration: line-through; color: #999; font-size: 24px; }
    .footer { margin-top: 40px; padding-top: 20px; border-top: 2px solid #ddd; text-align: center; color: #666; }
    ul { padding-left: 20px; }
    li { margin-bottom: 8px; }
  </style>
</head>
<body>
  <h1>Proposta Comercial - ${proposal.productName}</h1>
`

  for (const section of proposal.sections.sort((a, b) => a.order - b.order)) {
    html += `
  <h2>${section.title}</h2>
  <div>${section.content.replace(/\n/g, '<br>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\*(.*?)\*/g, '<em>$1</em>')}</div>
`
  }

  html += `
  <div class="footer">
    <p><strong>Garcez Palha Advocacia</strong><br>
    364 anos de tradição em Direito<br>
    <a href="${process.env.NEXT_PUBLIC_APP_URL}">www.garcezpalha.com.br</a></p>
    <p><small>Proposta válida até ${proposal.validUntil.toLocaleDateString('pt-BR')}</small></p>
  </div>
</body>
</html>
`

  return html
}

/**
 * Format proposal as PDF (returns HTML that can be converted)
 */
export function formatProposalForPDF(proposal: Proposal): string {
  // This would integrate with a PDF generation library
  // For now, returns the same HTML as email but optimized for PDF
  return formatProposalAsHTML(proposal)
}
