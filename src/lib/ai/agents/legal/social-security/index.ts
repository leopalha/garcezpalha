/**
 * Social Security Agent - Specialized Tools
 * Export all social security and INSS analysis tools
 */

export { BenefitCalculator, type BenefitCalculation } from './benefit-calculator'
export { INSSAnalyzer, type INSSAnalysis } from './inss-analyzer'

// Usage example:
/*
import { BenefitCalculator, INSSAnalyzer } from '@/lib/ai/agents/legal/social-security'

// 1. Calculate retirement benefit
const benefitCalc = new BenefitCalculator()
const benefit = await benefitCalc.calculateBenefit({
  tipoBeneficio: 'aposentadoria por idade',
  idade: 65,
  sexo: 'M',
  tempoContribuicao: 240, // 20 anos em meses
  salarios: [3000, 3200, 3100, 3300, 3250], // Últimos salários
  carenciaCumprida: 200,
})

// 2. Analyze INSS history
const inssAnalyzer = new INSSAnalyzer()
const analysis = await inssAnalyzer.analyzeINSS({
  cnis: {
    vinculos: [
      {
        inicio: '2000-01-01',
        fim: '2010-12-31',
        empregador: 'Empresa ABC',
        tipo: 'CLT',
      },
      {
        inicio: '2012-01-01',
        fim: '2023-12-31',
        empregador: 'Empresa XYZ',
        tipo: 'CLT',
      },
    ],
  },
  idade: 60,
  atividadeEspecial: true,
})
*/
