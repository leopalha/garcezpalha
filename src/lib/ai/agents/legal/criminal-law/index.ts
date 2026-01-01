/**
 * Criminal Law Agent - Specialized Tools
 * Export all criminal law analysis tools
 */

export { CrimeAnalyzer, type CrimeAnalysis } from './crime-analyzer'
export { SentencingCalculator, type SentenceCalculation } from './sentencing-calculator'
export { DefenseStrategist, type DefenseStrategy, type Evidence } from './defense-strategist'

// Usage example:
/*
import { CrimeAnalyzer, SentencingCalculator, DefenseStrategist } from '@/lib/ai/agents/legal/criminal-law'

const analyzer = new CrimeAnalyzer()
const calculator = new SentencingCalculator()
const strategist = new DefenseStrategist()

// 1. Analyze the crime
const crimeAnalysis = await analyzer.analyzeCrime("Réu subtraiu celular da vítima...")

// 2. Calculate sentence
const sentence = await calculator.calculateSentence(crimeAnalysis, {
  culpabilidade: 'media',
  antecedentes: 'bons',
  condutaSocial: 'boa',
  personalidade: 'favoravel',
  motivos: 'desfavoraveis',
  circunstancias: 'favoraveis',
  consequencias: 'leves',
  comportamentoVitima: 'favoravel'
})

// 3. Evaluate defense strategy
const evidences = [
  {
    tipo: 'testemunhal',
    descricao: 'Testemunha presenciou os fatos',
    favoravel: false,
    confiabilidade: 'media'
  }
]
const defense = await strategist.evaluateDefense(crimeAnalysis, evidences)
*/
