/**
 * Sequência de Upsell
 *
 * Objetivo: Oferecer serviços adicionais para clientes atuais
 * Duração: 30 dias
 * Emails: 5
 * Gatilho: Cliente converteu (processo em andamento)
 */

import type { EmailSequence } from '../types'

export const upsellSequence = {
  id: 'upsell-customers',
  name: 'Upsell para Clientes',
  description: 'Oferecer serviços adicionais complementares',
  trigger: {
    type: 'custom',
    condition: 'customer.status = "active" AND days_since_conversion >= 14',
  },
  steps: [
    {
      id: 'upsell-1',
      stepNumber: 1,
      delay: 0,
      delayUnit: 'hours',
      templateId: 'upsell-atualizacao',
      subject: 'Atualização do seu processo + Oportunidade importante',
      condition: {
        type: 'always',
      },
    },
    {
      id: 'upsell-2',
      stepNumber: 2,
      delay: 168, // 7 dias
      delayUnit: 'hours',
      templateId: 'upsell-servicos-relacionados',
      subject: '{{firstName}}, você sabia que também pode ter direito a isso?',
      condition: {
        type: 'email_opened',
        emailId: 'upsell-1',
      },
    },
    {
      id: 'upsell-3',
      stepNumber: 3,
      delay: 168, // 7 dias (total: 14 dias)
      delayUnit: 'hours',
      templateId: 'upsell-caso-estudo',
      subject: 'Como {{customerName}} somou R$ 35k com 2 processos diferentes',
      condition: {
        type: 'always',
      },
    },
    {
      id: 'upsell-4',
      stepNumber: 4,
      delay: 168, // 7 dias (total: 21 dias)
      delayUnit: 'hours',
      templateId: 'upsell-desconto-cliente',
      subject: '💎 Desconto VIP de 30% - Exclusivo para clientes',
      condition: {
        type: 'email_clicked',
        emailId: 'upsell-3',
      },
    },
    {
      id: 'upsell-5',
      stepNumber: 5,
      delay: 216, // 9 dias (total: 30 dias)
      delayUnit: 'hours',
      templateId: 'upsell-urgencia',
      subject: '⏰ Desconto VIP expira em 48h - Não perca!',
      condition: {
        type: 'no_response',
        days: 7,
      },
    },
  ],
  status: 'active',
  createdAt: new Date('2025-01-01'),
  updatedAt: new Date('2025-01-01'),
} as any as EmailSequence
