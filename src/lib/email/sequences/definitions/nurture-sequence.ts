/**
 * Sequência de Nutrição (Nurture)
 *
 * Objetivo: Educar leads que ainda não estão prontos para comprar
 * Duração: 21 dias
 * Emails: 6
 * Gatilho: Lead qualificado mas não converteu em 7 dias
 */

import type { EmailSequence } from '../types'

export const nurtureSequence: EmailSequence = {
  id: 'nurture-leads',
  name: 'Nutrição de Leads',
  description: 'Conteúdo educativo para leads não qualificados',
  trigger: {
    type: 'custom',
    condition: 'lead.score < 70 AND days_since_signup >= 7',
  },
  steps: [
    {
      id: 'nurture-1',
      stepNumber: 1,
      delay: 0, // Imediato após trigger
      delayUnit: 'hours',
      templateId: 'nurture-direitos',
      subject: '{{firstName}}, você conhece TODOS os seus direitos?',
      condition: {
        type: 'always',
      },
    },
    {
      id: 'nurture-2',
      stepNumber: 2,
      delay: 72, // 3 dias depois
      delayUnit: 'hours',
      templateId: 'nurture-casos-sucesso',
      subject: 'Como {{customerName}} recuperou R$ 15.000 que nem sabia ter direito',
      condition: {
        type: 'email_opened',
        emailId: 'nurture-1',
      },
    },
    {
      id: 'nurture-3',
      stepNumber: 3,
      delay: 168, // 7 dias (total: 10 dias)
      delayUnit: 'hours',
      templateId: 'nurture-mitos',
      subject: '5 mitos sobre processos jurídicos que te fazem perder dinheiro',
      condition: {
        type: 'always',
      },
    },
    {
      id: 'nurture-4',
      stepNumber: 4,
      delay: 168, // 7 dias (total: 17 dias)
      delayUnit: 'hours',
      templateId: 'nurture-urgencia',
      subject: '⚠️ {{firstName}}, prazos prescrevem. Não perca seus direitos!',
      condition: {
        type: 'no_response',
        days: 7,
      },
    },
    {
      id: 'nurture-5',
      stepNumber: 5,
      delay: 96, // 4 dias (total: 21 dias)
      delayUnit: 'hours',
      templateId: 'nurture-depoimentos',
      subject: 'Por que 847 pessoas confiaram em nós? [Depoimentos reais]',
      condition: {
        type: 'always',
      },
    },
    {
      id: 'nurture-6',
      stepNumber: 6,
      delay: 72, // 3 dias (total: 24 dias)
      delayUnit: 'hours',
      templateId: 'nurture-oferta-final',
      subject: '🎁 Análise gratuita do seu caso - Última chance',
      condition: {
        type: 'always',
      },
    },
  ],
  status: 'active',
  createdAt: new Date('2025-01-01'),
  updatedAt: new Date('2025-01-01'),
}
