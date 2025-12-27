/**
 * Remaining State Behaviors
 * Implementation for states: qualified, rejected, proposing, objection_handling,
 * closing, payment_pending, paid, contract_pending, onboarding, active_case,
 * completed, escalated, abandoned
 */

import { StateBehavior, ConversationData } from '../types'
import { generatePaymentLink, generateProposal } from '../../../qualification'

// ============================================================================
// QUALIFIED STATE
// ============================================================================
export class QualifiedBehavior implements StateBehavior {
  state = 'qualified' as const

  async onEnter(data: ConversationData): Promise<ConversationData> {
    // Mark as qualified
    data.qualification.status = 'complete'
    return data
  }

  async handleMessage(message: string, data: ConversationData): Promise<{
    response: string
    nextState?: 'proposing'
    data: ConversationData
  }> {
    const response = `Ótimo! Com base nas suas respostas, seu caso foi qualificado com sucesso! ✅

**Score de Qualificação:** ${data.qualification.score}/100

Vou agora preparar uma proposta personalizada para você.`

    return {
      response,
      nextState: 'proposing',
      data,
    }
  }
}

// ============================================================================
// REJECTED STATE
// ============================================================================
export class RejectedBehavior implements StateBehavior {
  state = 'rejected' as const

  async onEnter(data: ConversationData): Promise<ConversationData> {
    data.qualification.status = 'rejected'
    return data
  }

  async handleMessage(message: string, data: ConversationData): Promise<{
    response: string
    nextState?: 'qualifying' | 'abandoned'
    data: ConversationData
  }> {
    const response = `Agradecemos seu contato.

Infelizmente, com base nas informações fornecidas, não conseguimos identificar viabilidade jurídica suficiente para prosseguir neste momento.

Isso não significa que seu caso não tenha mérito - apenas que precisaríamos de mais informações ou contexto.

Você gostaria de:
1. Fornecer mais detalhes
2. Falar com um advogado para avaliação manual
3. Explorar outras opções`

    return {
      response,
      data,
    }
  }
}

// ============================================================================
// PROPOSING STATE
// ============================================================================
export class ProposingBehavior implements StateBehavior {
  state = 'proposing' as const

  async onEnter(data: ConversationData): Promise<ConversationData> {
    // TODO: Integrate proposal generation with correct API
    // Current API signature: generateProposal(result: QualificationResult, clientName: string, paymentLink?: PaymentLink)
    // This code expects different parameters - needs refactoring

    // Generate proposal
    if (!data.proposal.proposal_text) {
      // Stubbed until API integration is completed
      data.proposal.proposal_text = 'Proposta pendente de geração - ver P0 blocker em tasks.md'
    }

    return data
  }

  async handleMessage(message: string, data: ConversationData): Promise<{
    response: string
    nextState?: 'closing' | 'objection_handling'
    data: ConversationData
  }> {
    const lowerMessage = message.toLowerCase()

    // Check for objections
    if (
      lowerMessage.includes('caro') ||
      lowerMessage.includes('preço') ||
      lowerMessage.includes('valor') ||
      lowerMessage.includes('prazo') ||
      lowerMessage.includes('tempo')
    ) {
      return {
        response: 'Entendo sua preocupação. Vou esclarecer melhor...',
        nextState: 'objection_handling',
        data,
      }
    }

    // Check for acceptance
    if (
      lowerMessage.includes('aceito') ||
      lowerMessage.includes('sim') ||
      lowerMessage.includes('ok') ||
      lowerMessage.includes('vamos') ||
      lowerMessage.includes('quero')
    ) {
      return {
        response: 'Perfeito! Vamos prosseguir com o fechamento.',
        nextState: 'closing',
        data,
      }
    }

    // Provide proposal
    return {
      response: data.proposal.proposal_text || 'Aguarde enquanto preparo sua proposta...',
      data,
    }
  }
}

// ============================================================================
// OBJECTION_HANDLING STATE
// ============================================================================
export class ObjectionHandlingBehavior implements StateBehavior {
  state = 'objection_handling' as const

  async handleMessage(message: string, data: ConversationData): Promise<{
    response: string
    nextState?: 'proposing' | 'closing' | 'escalated'
    data: ConversationData
  }> {
    // TODO: Implement sophisticated objection handling with AI
    const response = `Entendo perfeitamente suas preocupações.

Nossa proposta é baseada em:
- Análise detalhada do seu caso
- Expertise de 364 anos
- Histórico de casos similares

Posso ajustar alguns pontos ou você gostaria de falar com um especialista para esclarecer melhor?`

    return {
      response,
      data,
    }
  }
}

// ============================================================================
// CLOSING STATE
// ============================================================================
export class ClosingBehavior implements StateBehavior {
  state = 'closing' as const

  async onEnter(data: ConversationData): Promise<ConversationData> {
    // TODO: Integrate payment link generation with correct API
    // Type mismatch: generatePaymentLink returns PaymentLink object but data.proposal.payment_link expects string
    // Also: data.proposal.value doesn't exist in type

    // Generate payment link if not exists
    if (!data.proposal.payment_link) {
      // Stubbed until API integration is completed
      data.proposal.payment_link = 'https://payment.garcezpalha.com.br/pending'
    }

    return data
  }

  async handleMessage(message: string, data: ConversationData): Promise<{
    response: string
    nextState?: 'payment_pending'
    data: ConversationData
  }> {
    const response = `Excelente! Para iniciarmos o atendimento, precisamos apenas confirmar o pagamento.

**Link de Pagamento:** ${data.proposal.payment_link}

Você pode pagar via:
- PIX (desconto de 5%)
- Cartão de crédito (parcelado em até 6x)

Assim que o pagamento for confirmado, você receberá:
✅ Acesso ao portal do cliente
✅ Contrato digital para assinatura
✅ Atribuição do advogado responsável

Qualquer dúvida, estou aqui!`

    return {
      response,
      nextState: 'payment_pending',
      data,
    }
  }
}

// ============================================================================
// PAYMENT_PENDING STATE
// ============================================================================
export class PaymentPendingBehavior implements StateBehavior {
  state = 'payment_pending' as const

  async handleMessage(message: string, data: ConversationData): Promise<{
    response: string
    data: ConversationData
  }> {
    const response = `Aguardando confirmação do pagamento...

**Link:** ${data.proposal.payment_link}

Assim que identificarmos o pagamento (geralmente instantâneo), você receberá uma notificação e prosseguiremos automaticamente!

📱 Alguma dúvida sobre o pagamento?`

    return {
      response,
      data,
    }
  }
}

// ============================================================================
// PAID STATE
// ============================================================================
export class PaidBehavior implements StateBehavior {
  state = 'paid' as const

  async onEnter(data: ConversationData): Promise<ConversationData> {
    // Trigger payment confirmation actions
    console.log('[Paid] Payment confirmed, triggering workflows')
    return data
  }

  async handleMessage(message: string, data: ConversationData): Promise<{
    response: string
    nextState?: 'contract_pending'
    data: ConversationData
  }> {
    const response = `🎉 Pagamento confirmado com sucesso!

Próximos passos:
1. ✅ Você receberá um email com o contrato digital (ClickSign)
2. ⏳ Assine o contrato eletronicamente
3. 🚀 Iniciaremos o atendimento imediatamente após

Tempo estimado: 5-10 minutos

Enviando contrato agora...`

    return {
      response,
      nextState: 'contract_pending',
      data,
    }
  }
}

// ============================================================================
// CONTRACT_PENDING STATE
// ============================================================================
export class ContractPendingBehavior implements StateBehavior {
  state = 'contract_pending' as const

  async handleMessage(message: string, data: ConversationData): Promise<{
    response: string
    data: ConversationData
  }> {
    const response = `Aguardando assinatura do contrato digital.

📧 Você deve ter recebido um email de contratos@garcezpalha.adv.br

**Não recebeu?**
- Verifique sua caixa de spam
- Confirme seu email: ${data.client.email || 'não informado'}

Posso reenviar se necessário!`

    return {
      response,
      data,
    }
  }
}

// ============================================================================
// ONBOARDING STATE
// ============================================================================
export class OnboardingBehavior implements StateBehavior {
  state = 'onboarding' as const

  async handleMessage(message: string, data: ConversationData): Promise<{
    response: string
    nextState?: 'active_case'
    data: ConversationData
  }> {
    const response = `Bem-vindo oficialmente à Garcez Palha! 🎉

**Seu caso foi atribuído ao Dr./Dra. [Nome do Advogado]**

Próximos passos:
1. Envie os documentos necessários via portal
2. Agende uma consulta (se necessário)
3. Acompanhe o andamento em tempo real

**Portal do Cliente:** https://garcezpalha.adv.br/dashboard

Estamos prontos para começar!`

    return {
      response,
      nextState: 'active_case',
      data,
    }
  }
}

// ============================================================================
// ACTIVE_CASE STATE
// ============================================================================
export class ActiveCaseBehavior implements StateBehavior {
  state = 'active_case' as const

  async handleMessage(message: string, data: ConversationData): Promise<{
    response: string
    data: ConversationData
  }> {
    const response = `Seu caso está em andamento.

**Status Atual:** Em análise jurídica

Você pode:
- Consultar andamento no portal
- Enviar documentos adicionais
- Fazer perguntas sobre o processo

Como posso ajudar hoje?`

    return {
      response,
      data,
    }
  }
}

// ============================================================================
// COMPLETED STATE
// ============================================================================
export class CompletedBehavior implements StateBehavior {
  state = 'completed' as const

  async handleMessage(message: string, data: ConversationData): Promise<{
    response: string
    data: ConversationData
  }> {
    const response = `Seu caso foi concluído com sucesso! ✅

Obrigado por confiar na Garcez Palha.

Você pode:
- Baixar documentos finais no portal
- Solicitar certidões
- Iniciar um novo atendimento

Como posso ajudar?`

    return {
      response,
      data,
    }
  }
}

// ============================================================================
// ESCALATED STATE
// ============================================================================
export class EscalatedBehavior implements StateBehavior {
  state = 'escalated' as const

  async handleMessage(message: string, data: ConversationData): Promise<{
    response: string
    data: ConversationData
  }> {
    const response = `Seu atendimento foi encaminhado para um especialista.

**Motivo:** ${data.status.escalation_reason || 'Análise especializada necessária'}

Um membro da nossa equipe entrará em contato em breve.

⏰ Tempo estimado de resposta: 2-4 horas úteis`

    return {
      response,
      data,
    }
  }
}

// ============================================================================
// ABANDONED STATE
// ============================================================================
export class AbandonedBehavior implements StateBehavior {
  state = 'abandoned' as const

  async handleMessage(message: string, data: ConversationData): Promise<{
    response: string
    nextState?: 'greeting'
    data: ConversationData
  }> {
    const response = `Olá novamente! 👋

Vi que você havia iniciado um atendimento anteriormente.

Gostaria de:
1. Continuar de onde paramos
2. Iniciar um novo atendimento
3. Falar com um especialista`

    return {
      response,
      data,
    }
  }
}
