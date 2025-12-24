/**
 * WhatsApp Message Templates
 * Pre-defined message templates for lead follow-up based on qualification results
 */

import type { QualificationResult, LeadCategory, RecommendedAction } from './types'
import type { PaymentLink } from './payment-link-generator'

/**
 * Message template type
 */
export interface WhatsAppTemplate {
  name: string
  category: string
  message: string
  delayMinutes?: number
}

/**
 * Follow-up sequence configuration
 */
export interface FollowUpSequence {
  leadCategory: LeadCategory
  templates: WhatsAppTemplate[]
}

/**
 * Product name mapping
 */
const PRODUCT_NAMES: Record<string, string> = {
  'desbloqueio-conta': 'Desbloqueio de Conta Bancária',
  'golpe-pix': 'Recuperação de Valores - Golpe PIX',
  'negativacao-indevida': 'Remoção de Negativação Indevida',
  'defesa-execucao': 'Defesa em Execução',
  'plano-saude': 'Ação contra Plano de Saúde',
  'cirurgia-bariatrica': 'Autorização de Cirurgia Bariátrica',
  'tratamento-tea': 'Cobertura de Tratamento TEA',
  'pericia-medica': 'Perícia Médica',
  'bpc-loas': 'BPC/LOAS - Benefício Assistencial',
  'aposentadoria': 'Aposentadoria INSS',
  'direito-imobiliario': 'Consultoria Imobiliária',
  'usucapiao': 'Usucapião',
  'regularizacao-imovel': 'Regularização de Imóvel',
  'holding-familiar': 'Holding Familiar',
  'inventario': 'Inventário e Partilha',
  'avaliacao-imoveis': 'Avaliação de Imóveis',
  'pericia-documental': 'Perícia Documental',
  'grafotecnia': 'Perícia Grafotécnica',
  'laudo-tecnico': 'Laudo Técnico',
  'direito-criminal': 'Defesa Criminal',
  'direito-aeronautico': 'Direito Aeronáutico',
  'secretaria-remota': 'Automação Jurídica',
}

/**
 * Generate initial contact message based on qualification result
 */
export function generateInitialContactMessage(
  result: QualificationResult,
  clientName: string
): string {
  const productName = PRODUCT_NAMES[result.productId] || 'Serviço Jurídico'
  const category = result.score.category

  switch (category) {
    case 'hot':
      return generateHotLeadMessage(clientName, productName, result)
    case 'warm':
      return generateWarmLeadMessage(clientName, productName, result)
    case 'cold':
      return generateColdLeadMessage(clientName, productName, result)
    case 'unqualified':
      return generateUnqualifiedMessage(clientName, productName)
  }
}

/**
 * Hot lead message (immediate response, high urgency)
 */
function generateHotLeadMessage(
  clientName: string,
  productName: string,
  result: QualificationResult
): string {
  const urgency = result.score.urgency >= 80
    ? '🚨 *URGENTE*'
    : '⚡ *PRIORIDADE ALTA*'

  return `${urgency}

Olá ${clientName}! 👋

Analisamos seu caso de *${productName}* e identificamos que você precisa de atendimento *IMEDIATO*.

${result.score.reasoning.slice(0, 2).map(r => `✓ ${r}`).join('\n')}

*Próximos passos:*
1️⃣ Vou enviar sua proposta personalizada agora
2️⃣ Após confirmação do pagamento, agendaremos sua consulta para *hoje ou amanhã*
3️⃣ Início imediato dos procedimentos

⏰ Quanto antes começarmos, melhor será para você!

Pode confirmar que está disponível para conversarmos agora?

*Garcez Palha Advocacia*
🏛️ 364 anos de tradição em Direito`
}

/**
 * Warm lead message (qualified, good potential)
 */
function generateWarmLeadMessage(
  clientName: string,
  productName: string,
  result: QualificationResult
): string {
  return `Olá ${clientName}! 👋

Obrigado por compartilhar as informações sobre seu caso de *${productName}*.

Analisamos seu caso e temos boas notícias! ✅

${result.score.reasoning.slice(0, 2).map(r => `✓ ${r}`).join('\n')}

*Próximos passos:*
1️⃣ Vou enviar uma proposta personalizada
2️⃣ Você analisa com calma (sem pressa!)
3️⃣ Após confirmação, agendamos sua consulta

Preparamos condições especiais para você. Posso enviar a proposta?

*Garcez Palha Advocacia*
🏛️ 364 anos de tradição em Direito`
}

/**
 * Cold lead message (needs nurturing)
 */
function generateColdLeadMessage(
  clientName: string,
  productName: string,
  result: QualificationResult
): string {
  return `Olá ${clientName}! 👋

Obrigado pelo interesse em *${productName}*.

Para entender melhor seu caso e preparar uma proposta adequada, sugiro que conversemos um pouco mais.

*Posso ajudar com:*
✓ Análise detalhada do seu caso
✓ Explicação do processo jurídico
✓ Estimativa de prazos e valores
✓ Esclarecimento de dúvidas

Quando você tem disponibilidade para uma conversa rápida de 15 minutos?

Enquanto isso, vou enviar alguns materiais que podem te ajudar a entender melhor a situação.

*Garcez Palha Advocacia*
🏛️ 364 anos de tradição em Direito`
}

/**
 * Unqualified lead message (educational approach)
 */
function generateUnqualifiedMessage(
  clientName: string,
  productName: string
): string {
  return `Olá ${clientName}! 👋

Obrigado pelo contato sobre *${productName}*.

Com base nas informações compartilhadas, sugiro que você:

1️⃣ Reúna mais documentação sobre o caso
2️⃣ Verifique prazos e condições específicas
3️⃣ Considere alternativas extrajudiciais (se aplicável)

Posso enviar materiais educativos que vão te ajudar a entender melhor seus direitos e opções?

Se precisar de uma consulta para avaliar o caso com mais detalhes, também podemos agendar (valor da consulta: R$ 150).

*Garcez Palha Advocacia*
🏛️ 364 anos de tradição em Direito`
}

/**
 * Generate proposal message with payment link
 */
export function generateProposalMessage(
  clientName: string,
  productName: string,
  paymentLink: PaymentLink
): string {
  const discount = paymentLink.discountApplied > 0
    ? `~R$ ${(paymentLink.originalAmount / 100).toFixed(2)}~ *R$ ${(paymentLink.amount / 100).toFixed(2)}*`
    : `*R$ ${(paymentLink.amount / 100).toFixed(2)}*`

  const installmentText = paymentLink.installments > 1
    ? `\n💳 Até *${paymentLink.installments}x* sem juros no cartão`
    : ''

  const expiresIn = Math.round(
    (paymentLink.expiresAt.getTime() - Date.now()) / (1000 * 60 * 60)
  )

  return `${clientName}, aqui está sua proposta personalizada! 📋

*${productName}*

💰 Investimento: ${discount}${installmentText}

*O que está incluso:*
✅ Análise completa do caso
✅ Elaboração de toda documentação jurídica
✅ Acompanhamento processual completo
✅ Atendimento prioritário
✅ Relatórios periódicos de andamento

⏰ *Proposta válida por ${expiresIn} horas*

🔐 Para garantir seu atendimento:
${paymentLink.url}

*Formas de pagamento:*
• PIX (aprovação imediata)
• Cartão de crédito${installmentText}
• Boleto bancário

Após a confirmação do pagamento, você recebe:
1️⃣ Acesso à área do cliente
2️⃣ Agendamento da consulta
3️⃣ Início imediato dos procedimentos

Ficou com alguma dúvida? Estou aqui! 😊

*Garcez Palha Advocacia*
🏛️ 364 anos de tradição em Direito`
}

/**
 * Generate document request message
 */
export function generateDocumentRequestMessage(
  clientName: string,
  documents: string[]
): string {
  return `${clientName}, para darmos continuidade ao seu caso, preciso que você envie os seguintes documentos: 📄

${documents.map((doc, i) => `${i + 1}️⃣ ${doc}`).join('\n')}

*Como enviar:*
• Pode enviar por aqui mesmo (WhatsApp)
• Ou fazer upload na área do cliente
• Ou enviar por e-mail

*Dica:* 📸 Fotos nítidas ou PDFs facilitam muito a análise!

Assim que recebermos, já começamos a trabalhar no seu caso.

Consegue enviar hoje?

*Garcez Palha Advocacia*`
}

/**
 * Generate follow-up message after payment
 */
export function generatePaymentConfirmationMessage(
  clientName: string,
  productName: string
): string {
  return `${clientName}, pagamento confirmado! ✅🎉

Bem-vindo(a) ao time Garcez Palha!

*Próximos passos:*

1️⃣ *Acesso liberado* à sua área do cliente
   👉 ${process.env.NEXT_PUBLIC_APP_URL}/login

2️⃣ *Agendar consulta*
   Vou enviar os horários disponíveis em instantes

3️⃣ *Documentação*
   Vou te passar a lista do que precisamos

Estou aqui para te acompanhar em todo o processo! 💪

Qualquer dúvida, é só chamar.

*Garcez Palha Advocacia*
🏛️ 364 anos de tradição em Direito`
}

/**
 * Follow-up sequences by category
 */
export const FOLLOW_UP_SEQUENCES: FollowUpSequence[] = [
  {
    leadCategory: 'hot',
    templates: [
      {
        name: 'hot-immediate',
        category: 'initial-contact',
        message: 'Immediate contact (generated dynamically)',
        delayMinutes: 0,
      },
      {
        name: 'hot-proposal',
        category: 'proposal',
        message: 'Proposal with payment link (generated dynamically)',
        delayMinutes: 5,
      },
      {
        name: 'hot-reminder-1h',
        category: 'reminder',
        message: 'Viu a proposta? Qualquer dúvida, estou aqui! 😊',
        delayMinutes: 60,
      },
      {
        name: 'hot-reminder-4h',
        category: 'reminder',
        message: 'Só lembrando que sua proposta expira em poucas horas! ⏰\n\nQuer que eu esclareça alguma dúvida?',
        delayMinutes: 240,
      },
    ],
  },
  {
    leadCategory: 'warm',
    templates: [
      {
        name: 'warm-initial',
        category: 'initial-contact',
        message: 'Warm lead contact (generated dynamically)',
        delayMinutes: 0,
      },
      {
        name: 'warm-proposal',
        category: 'proposal',
        message: 'Proposal with payment link (generated dynamically)',
        delayMinutes: 30,
      },
      {
        name: 'warm-reminder-24h',
        category: 'reminder',
        message: 'Oi! Conseguiu dar uma olhada na proposta? 😊',
        delayMinutes: 1440, // 24h
      },
      {
        name: 'warm-reminder-48h',
        category: 'reminder',
        message: 'Ficou com alguma dúvida sobre a proposta? Posso ajudar! 💬',
        delayMinutes: 2880, // 48h
      },
    ],
  },
  {
    leadCategory: 'cold',
    templates: [
      {
        name: 'cold-initial',
        category: 'initial-contact',
        message: 'Cold lead contact (generated dynamically)',
        delayMinutes: 0,
      },
      {
        name: 'cold-educational-1',
        category: 'educational',
        message: 'Enviei alguns materiais sobre o tema. Dá uma olhada quando puder! 📚',
        delayMinutes: 120, // 2h
      },
      {
        name: 'cold-follow-up-3d',
        category: 'follow-up',
        message: 'E aí, os materiais ajudaram? Tem alguma dúvida? 🤔',
        delayMinutes: 4320, // 3 days
      },
      {
        name: 'cold-follow-up-7d',
        category: 'follow-up',
        message: 'Oi! Ainda tem interesse em resolver essa questão? Posso ajudar! 😊',
        delayMinutes: 10080, // 7 days
      },
    ],
  },
  {
    leadCategory: 'unqualified',
    templates: [
      {
        name: 'unqualified-initial',
        category: 'initial-contact',
        message: 'Unqualified message (generated dynamically)',
        delayMinutes: 0,
      },
      {
        name: 'unqualified-educational',
        category: 'educational',
        message: 'Enviei materiais que podem te ajudar a entender melhor o tema. Boa leitura! 📖',
        delayMinutes: 60,
      },
    ],
  },
]

/**
 * Get follow-up sequence for a lead category
 */
export function getFollowUpSequence(category: LeadCategory): WhatsAppTemplate[] {
  const sequence = FOLLOW_UP_SEQUENCES.find(s => s.leadCategory === category)
  return sequence?.templates || []
}

/**
 * Generate abandoned cart reminder
 */
export function generateAbandonedCartMessage(
  clientName: string,
  hoursRemaining: number
): string {
  if (hoursRemaining <= 2) {
    return `⏰ *ÚLTIMAS HORAS* ⏰

${clientName}, sua proposta expira em *${hoursRemaining} horas*!

Não perca essa oportunidade de resolver seu caso com condições especiais.

Finalize agora: [link]

Precisa de ajuda? Estou aqui! 😊`
  }

  return `Oi ${clientName}! 👋

Vi que você ainda não finalizou o pagamento da proposta.

Ficou com alguma dúvida? Posso ajudar! 💬

*Lembre-se:*
• Proposta expira em ${hoursRemaining} horas
• Condições especiais válidas apenas neste período
• Atendimento prioritário garantido

Vamos conversar? 😊`
}

/**
 * Generate consultation confirmation message
 */
export function generateConsultationConfirmationMessage(
  clientName: string,
  consultationDate: Date,
  consultationType: 'presencial' | 'online'
): string {
  const formattedDate = consultationDate.toLocaleString('pt-BR', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    hour: '2-digit',
    minute: '2-digit',
  })

  const typeInfo =
    consultationType === 'online'
      ? '💻 *Consulta Online* (link será enviado 15min antes)'
      : '🏛️ *Consulta Presencial* no escritório'

  return `✅ *Consulta Agendada*

${clientName}, sua consulta está confirmada!

📅 *${formattedDate}*
${typeInfo}

*Importante:*
• Tenha em mãos todos os documentos relacionados ao caso
• Chegue 10 minutos antes (presencial)
• Teste sua conexão antes (online)

*Endereço:*
Rua Exemplo, 123 - Centro
São Paulo/SP

Enviaremos um lembrete 24h antes.

Nos vemos lá! 😊

*Garcez Palha Advocacia*`
}

/**
 * Generate case update message
 */
export function generateCaseUpdateMessage(
  clientName: string,
  update: string,
  nextSteps?: string
): string {
  return `📢 *Atualização do seu caso*

${clientName}, temos novidades! ✨

${update}

${
  nextSteps
    ? `*Próximos passos:*\n${nextSteps}\n\n`
    : ''
}Qualquer dúvida, estou à disposição!

*Garcez Palha Advocacia*`
}
