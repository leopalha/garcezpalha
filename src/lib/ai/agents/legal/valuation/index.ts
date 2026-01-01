/**
 * Property Valuation Agent - Specialized Tools
 * Export all property valuation and market analysis tools
 */

export { NBR14653Calculator, type PropertyValuation } from './nbr-14653-calculator'
export { MarketComparator, type MarketComparison } from './market-comparator'

// Usage example:
/*
import { NBR14653Calculator, MarketComparator } from '@/lib/ai/agents/legal/valuation'

// 1. Calculate property valuation using NBR 14653
const calculator = new NBR14653Calculator()
const valuation = await calculator.calculateValuation({
  tipoImovel: 'residencial',
  areaTotal: 200,
  areaConstruida: 150,
  quartos: 3,
  suites: 1,
  vagas: 2,
  idadeImovel: 10,
  endereco: 'Rua das Flores, 123',
  bairro: 'Jardins',
  cidade: 'São Paulo',
  finalidade: 'venda',
})

// 2. Compare with market
const comparator = new MarketComparator()
const marketAnalysis = await comparator.compareMarket({
  valorImovel: valuation.avaliacaoMercado.valorMedio,
  areaTotal: 200,
  bairro: 'Jardins',
  cidade: 'São Paulo',
  tipoImovel: 'residencial',
})
*/
