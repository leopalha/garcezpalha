/**
 * Sequência de Reativação (Reengagement)
 *
 * Objetivo: Reconquistar leads inativos há 30+ dias
 * Duração: 14 dias
 * Emails: 4
 * Gatilho: Sem interação há 30 dias
 */

import type { EmailSequence } from '../types'

export const reengagementSequence: EmailSequence = {
  id: 'reengagement-inactive',
  name: 'Reativação de Leads Inativos',
  description: 'Reconquistar leads que não interagem há 30+ dias',
  trigger: {
    type: 'custom',
    condition: 'days_since_last_interaction >= 30',
  },
  steps: [
    {
      id: 'reengagement-1',
      stepNumber: 1,
      delay: 0,
      delayUnit: 'hours',
      templateId: 'reengagement-sentimos-falta',
      subject: '{{firstName}}, sentimos sua falta... Ainda precisa de ajuda?',
      condition: {
        type: 'always',
      },
    },
    {
      id: 'reengagement-2',
      stepNumber: 2,
      delay: 96, // 4 dias
      delayUnit: 'hours',
      templateId: 'reengagement-novidades',
      subject: 'Novidades que podem te interessar (especialmente a 3ª)',
      condition: {
        type: 'email_opened',
        emailId: 'reengagement-1',
      },
    },
    {
      id: 'reengagement-3',
      stepNumber: 3,
      delay: 168, // 7 dias (total: 11 dias)
      delayUnit: 'hours',
      templateId: 'reengagement-desconto',
      subject: '🎁 Desconto especial para você que nos acompanha há tempo',
      condition: {
        type: 'no_response',
        days: 7,
      },
    },
    {
      id: 'reengagement-4',
      stepNumber: 4,
      delay: 72, // 3 dias (total: 14 dias)
      delayUnit: 'hours',
      templateId: 'reengagement-feedback',
      subject: 'Uma pergunta rápida: por que não seguimos em contato?',
      condition: {
        type: 'always',
      },
    },
  ],
  status: 'active',
  createdAt: new Date('2025-01-01'),
  updatedAt: new Date('2025-01-01'),
}
