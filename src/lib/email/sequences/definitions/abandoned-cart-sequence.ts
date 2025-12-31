/**
 * Sequência de Carrinho Abandonado
 *
 * Objetivo: Recuperar leads que iniciaram mas não completaram checkout
 * Duração: 7 dias
 * Emails: 3
 * Gatilho: Checkout iniciado mas não finalizado
 */

import type { EmailSequence } from '../types'

export const abandonedCartSequence: EmailSequence = {
  id: 'abandoned-checkout',
  name: 'Recuperação de Checkout Abandonado',
  description: 'Recuperar leads que abandonaram checkout',
  trigger: {
    type: 'custom',
    condition: 'checkout.status = "abandoned" AND hours_since_abandon >= 2',
  },
  steps: [
    {
      id: 'abandoned-1',
      stepNumber: 1,
      delay: 2, // 2 horas após abandono
      delayUnit: 'hours',
      templateId: 'abandoned-lembrete',
      subject: '{{firstName}}, você esqueceu algo? Seu processo está aqui 📋',
      condition: {
        type: 'always',
      },
    },
    {
      id: 'abandoned-2',
      stepNumber: 2,
      delay: 46, // 48h total
      delayUnit: 'hours',
      templateId: 'abandoned-duvidas',
      subject: 'Alguma dúvida sobre {{productName}}? Posso ajudar!',
      condition: {
        type: 'no_response',
        days: 2,
      },
    },
    {
      id: 'abandoned-3',
      stepNumber: 3,
      delay: 120, // 5 dias (total: 7 dias)
      delayUnit: 'hours',
      templateId: 'abandoned-urgencia',
      subject: '⚠️ Última chance: Análise gratuita expira em 24h',
      condition: {
        type: 'no_response',
        days: 5,
      },
    },
  ],
  status: 'active',
  createdAt: new Date('2025-01-01'),
  updatedAt: new Date('2025-01-01'),
}
