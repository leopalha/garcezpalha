/**
 * AI Legal Tools - Ferramentas jurídicas especializadas
 * Export all legal calculation, search, and compliance tools
 */

export { LegalCalculator, legalCalculator, type CalculationResult, type PrescricaoResult } from './legal-calculator'
export { JurisprudenceSearcher, jurisprudenceSearcher, type JurisprudenceResult, type JurisprudenceSearch } from './jurisprudence-searcher'
export { OABComplianceChecker, oabComplianceChecker, type ComplianceCheck } from './oab-compliance-checker'
export { RegistryConnector, registryConnector, type PropertyRegistryInfo, type CertidaoInfo } from './registry-connector'

// Usage example:
/*
import {
  legalCalculator,
  jurisprudenceSearcher,
  oabComplianceChecker,
  registryConnector,
} from '@/lib/ai/tools'

// 1. Calculate monetary correction
const correction = await legalCalculator.calculateMonetaryCorrection({
  valorOriginal: 10000,
  dataInicial: '2020-01-01',
  dataFinal: '2024-01-01',
  indice: 'IPCA',
  tipoJuros: 'simples',
  taxaJuros: 1,
})

// 2. Search jurisprudence
const jurisprudence = await jurisprudenceSearcher.searchJurisprudence({
  palavrasChave: 'plano de saúde negativa cobertura',
  tribunais: ['STJ', 'TJSP'],
})

// 3. Check OAB compliance
const compliance = await oabComplianceChecker.checkCompliance({
  tipoPeca: 'peticao',
  conteudo: 'Excelentíssimo Senhor Doutor Juiz...',
  destinatario: 'tribunal',
})

// 4. Consult property registry
const registry = await registryConnector.consultPropertyRegistry('12345', '1º RI')
*/
