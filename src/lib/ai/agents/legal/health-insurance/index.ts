/**
 * Health Insurance Agent - Specialized Tools
 * Export all health insurance and ANS compliance tools
 */

export { CoverageAnalyzer, type CoverageAnalysis } from './coverage-analyzer'
export { ANSComplianceChecker, type ANSComplianceCheck } from './ans-compliance-checker'

// Usage example:
/*
import { CoverageAnalyzer, ANSComplianceChecker } from '@/lib/ai/agents/legal/health-insurance'

// 1. Analyze coverage denial
const coverageAnalyzer = new CoverageAnalyzer()
const analysis = await coverageAnalyzer.analyzeCoverage({
  nomePlano: 'Amil 500',
  operadora: 'Amil',
  tipoProcedimento: 'Ressonância magnética',
  motivoNegativa: 'Procedimento não consta no Rol ANS',
  prescricaoMedica: true,
  urgente: false,
  valorProcedimento: 1500,
  jaRealizou: true,
})

// 2. Check ANS compliance
const complianceChecker = new ANSComplianceChecker()
const compliance = await complianceChecker.checkCompliance({
  nomeOperadora: 'Amil',
  tipoIrregularidade: 'Cancelamento unilateral',
  descricaoProblema: 'Operadora cancelou plano sem justa causa',
  dataOcorrencia: '2024-01-15',
  valorPrejuizo: 5000,
})
*/
