/**
 * Real Estate Agent - Specialized Tools
 * Export all real estate analysis tools
 */

export { ContractAnalyzer, type ContractAnalysis } from './contract-analyzer'
export { UsucapiaoEvaluator, type UsucapiaoEvaluation } from './usucapiao-evaluator'

// Usage example:
/*
import { ContractAnalyzer, UsucapiaoEvaluator } from '@/lib/ai/agents/legal/real-estate'

const contractAnalyzer = new ContractAnalyzer()
const usucapiaoEvaluator = new UsucapiaoEvaluator()

// 1. Analyze real estate contract
const contractAnalysis = await contractAnalyzer.analyzeContract(`
  CONTRATO DE COMPRA E VENDA DE IMÓVEL

  Pelo presente instrumento, as partes...
  Valor: R$ 500.000,00
  Matrícula: 12345
  ...
`)

console.log('Tipo:', contractAnalysis.tipoContrato)
console.log('Cláusulas ausentes:', contractAnalysis.clausulasObrigatorias.ausente)
console.log('Cláusulas abusivas:', contractAnalysis.clausulasAbusivas)
console.log('Parecer:', contractAnalysis.parecer)

// 2. Evaluate usucapião viability
const usucapiaoAnalysis = await usucapiaoEvaluator.evaluateUsucapiao({
  tempoPosse: 7, // anos
  areaMetros: 200,
  tipoImovel: 'urbano',
  possuiJustoTitulo: false,
  possuiBoaFe: true,
  moraNoimovel: true,
  possuiOutroImovel: false,
  utilizaProducao: false,
})

console.log('Modalidade:', usucapiaoAnalysis.modalidade)
console.log('Viabilidade:', usucapiaoAnalysis.viabilidade)
console.log('Requisitos:', usucapiaoAnalysis.requisitos)
console.log('Documentos necessários:', usucapiaoAnalysis.documentosNecessarios)
console.log('Custo estimado:', usucapiaoAnalysis.custos)
*/
