/**
 * Financial Protection Agent - Specialized Tools
 * Export all financial protection and fraud investigation tools
 */

export { AccountBlocker, type AccountBlockingStrategy } from './account-blocker'
export { PixFraudInvestigator, type PixFraudInvestigation } from './pix-fraud-investigator'

// Usage example:
/*
import { AccountBlocker, PixFraudInvestigator } from '@/lib/ai/agents/legal/financial'

// 1. Evaluate account blocking strategy
const accountBlocker = new AccountBlocker()
const blockingStrategy = await accountBlocker.evaluateBlocking({
  motivoBloqueio: 'divida',
  valorCredito: 15000,
  devedorNome: 'João Silva',
  devedorCPF: '123.456.789-00',
  temTituloExecutivo: true,
  tipoTitulo: 'judicial',
  urgente: true,
})

// 2. Investigate PIX fraud
const pixInvestigator = new PixFraudInvestigator()
const fraudAnalysis = await pixInvestigator.investigateFraud({
  descricaoFraude: 'Golpe do WhatsApp - falso parente pedindo dinheiro',
  valorTransferido: 5000,
  dataHoraTransferencia: '2024-01-15T14:30:00',
  chavePIXDestino: '123.456.789-00',
  tipoChave: 'cpf',
  bancoOrigem: 'Banco do Brasil',
  bancoDestino: 'Nubank',
  comunicouBanco: true,
  registrouBO: false,
})
*/
