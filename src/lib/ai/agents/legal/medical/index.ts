/**
 * Medical Expertise Agent - Specialized Tools
 * Export all medical and disability assessment tools
 */

export { InjuryEvaluator, type InjuryEvaluation } from './injury-evaluator'
export { DisabilityAssessor, type DisabilityAssessment } from './disability-assessor'

// Usage example:
/*
import { InjuryEvaluator, DisabilityAssessor } from '@/lib/ai/agents/legal/medical'

const injuryEvaluator = new InjuryEvaluator()
const disabilityAssessor = new DisabilityAssessor()

// 1. Evaluate injury and estimate compensation
const injuryAnalysis = await injuryEvaluator.evaluateInjury({
  descricao: 'Vítima sofreu fratura exposta na perna direita',
  partesAfetadas: ['perna direita'],
  diasAfastamento: 90,
  sequelas: ['fratura', 'cicatriz permanente'],
  tratamentoNecessario: ['cirurgia', 'fisioterapia'],
  custoTratamento: 15000,
  idadeVitima: 35,
  profissao: 'Motorista',
  rendaMensal: 3000,
})

console.log('Gravidade:', injuryAnalysis.classificacao.gravidade)
console.log('Indenização total:', injuryAnalysis.indenizacao.total)
console.log('Perícia recomendada:', injuryAnalysis.periciaRecomendada)

// 2. Assess disability percentage
const disabilityAnalysis = await disabilityAssessor.assessDisability({
  tipoLesao: 'Perda parcial da visão',
  partesAfetadas: ['olho direito'],
  sequelas: ['redução visão 50%'],
  profissao: 'Motorista',
  idade: 40,
  rendaMensal: 3500,
  atividadesPrejudicadas: ['dirigir', 'trabalhar'],
})

console.log('Grau de incapacidade:', disabilityAnalysis.grauIncapacidade + '%')
console.log('Classificação:', disabilityAnalysis.classificacao)
console.log('Pode exercer profissão:', disabilityAnalysis.impactoLaboral.podeExercer)
console.log('Benefícios elegíveis:', disabilityAnalysis.beneficiosPrevidenciarios)
*/
