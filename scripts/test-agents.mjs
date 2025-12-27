#!/usr/bin/env node
/**
 * Test script for all 5 vertical agents
 * Tests each agent individually with real scenarios
 */

import { config } from 'dotenv'
import { resolve } from 'path'

// Load environment variables
config({ path: resolve(process.cwd(), '.env.local') })

console.log('🤖 TESTING ALL VERTICAL AGENTS\n')
console.log('=' .repeat(60))

// Verify OpenAI API key is configured
const OPENAI_API_KEY = process.env.OPENAI_API_KEY
if (!OPENAI_API_KEY) {
  console.error('❌ OPENAI_API_KEY not configured in .env.local')
  process.exit(1)
}

console.log('✅ OpenAI API Key configured:', OPENAI_API_KEY.substring(0, 20) + '...')
console.log('=' .repeat(60))
console.log()

// Test scenarios
const tests = [
  {
    name: '🏠 Real Estate Agent',
    scenario: 'Análise de contrato de compra e venda',
    endpoint: '/api/ai/agents/real-estate',
    payload: {
      action: 'analyze_contract',
      contractText: 'Contrato de compra e venda de imóvel localizado na Rua das Flores, 123, Rio de Janeiro. Valor: R$ 500.000,00. Prazo: 30 dias.',
    },
  },
  {
    name: '🔍 Document Forensics Agent',
    scenario: 'Análise de autenticidade de documento',
    endpoint: '/api/ai/agents/document-forensics',
    payload: {
      action: 'analyze_authenticity',
      documentDescription: 'Procuração particular com assinatura suspeita e possíveis adulterações no texto.',
    },
  },
  {
    name: '📊 Property Valuation Agent',
    scenario: 'Avaliação de imóvel NBR 14653',
    endpoint: '/api/ai/agents/property-valuation',
    payload: {
      action: 'valuate_property',
      propertyData: {
        type: 'Apartamento',
        area: 80,
        location: 'Copacabana, Rio de Janeiro',
        bedrooms: 2,
        bathrooms: 1,
      },
    },
  },
  {
    name: '⚖️ Criminal Law Agent',
    scenario: 'Análise de caso criminal',
    endpoint: '/api/ai/agents/criminal-law',
    payload: {
      action: 'analyze_case',
      caseDescription: 'Acusação de furto simples. Réu primário, bons antecedentes. Pena prevista: 1 a 4 anos.',
    },
  },
  {
    name: '🏥 Medical Expertise Agent',
    scenario: 'Análise de nexo causal',
    endpoint: '/api/ai/agents/medical-expertise',
    payload: {
      action: 'analyze_causal_nexus',
      medicalReport: 'Paciente apresenta lesão no ombro direito após acidente de trabalho. Laudo médico indica tendinite e limitação de movimento.',
    },
  },
]

// Test Agent Orchestrator
console.log('🎭 TESTING AGENT ORCHESTRATOR\n')

const orchestratorTests = [
  { message: 'Preciso avaliar um imóvel em Copacabana', expectedAgent: 'property-valuation' },
  { message: 'Quero analisar um contrato de aluguel', expectedAgent: 'real-estate' },
  { message: 'Tenho dúvida sobre um documento que pode ser falso', expectedAgent: 'document-forensics' },
  { message: 'Sofri acidente de trabalho e preciso de perícia médica', expectedAgent: 'medical-expertise' },
  { message: 'Fui acusado de crime e preciso de defesa', expectedAgent: 'criminal-law' },
]

async function testOrchestrator() {
  console.log('Testing Agent Orchestrator keyword routing...\n')

  for (const test of orchestratorTests) {
    try {
      const response = await fetch('http://localhost:3000/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: test.message }),
      })

      const data = await response.json()

      const passed = data.agent?.includes(test.expectedAgent)
      const icon = passed ? '✅' : '❌'

      console.log(`${icon} "${test.message}"`)
      console.log(`   → Routed to: ${data.agent || 'ERROR'}`)
      console.log(`   → Confidence: ${data.confidence || 'N/A'}`)
      console.log()
    } catch (error) {
      console.error(`❌ Error testing: "${test.message}"`)
      console.error(`   → ${error.message}`)
      console.log()
    }
  }
}

// Test complex queries
async function testComplexQueries() {
  console.log('\n' + '='.repeat(60))
  console.log('🔬 TESTING COMPLEX QUERIES\n')

  const complexTests = [
    {
      name: '🏠 Contrato de Compra e Venda',
      message: 'Analise este contrato: Compra e venda de apartamento na Rua das Flores, 123, Rio de Janeiro. Valor: R$ 500.000,00. O comprador terá 30 dias para realizar o pagamento integral.',
    },
    {
      name: '🔍 Documento Suspeito',
      message: 'Tenho uma procuração particular onde a assinatura parece diferente das outras assinaturas do mesmo documento. Como posso verificar se é auténtica?',
    },
    {
      name: '📊 Avaliação de Imóvel',
      message: 'Preciso avaliar um apartamento de 80m² em Copacabana com 2 quartos e 1 banheiro. Quanto vale aproximadamente?',
    },
    {
      name: '⚖️ Caso Criminal',
      message: 'Fui acusado de furto simples, sou réu primário com bons antecedentes. Qual a pena prevista e posso ter direito a algum benefício?',
    },
    {
      name: '🏥 Perícia Médica',
      message: 'Sofri um acidente de trabalho e agora tenho lesão no ombro direito com tendinite e limitação de movimento. Como comprovar o nexo causal?',
    },
  ]

  for (const test of complexTests) {
    console.log(`${test.name}`)
    console.log()

    try {
      const response = await fetch('http://localhost:3000/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: test.message }),
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()

      if (data.success) {
        console.log('✅ SUCCESS')
        console.log(`   → Agent: ${data.agent}`)
        console.log(`   → Confidence: ${data.confidence}`)
        console.log(`   → Response preview: ${data.response.substring(0, 150)}...`)
      } else {
        console.error('❌ FAILED')
        console.error(`   → Error: ${data.error}`)
      }
      console.log()
    } catch (error) {
      console.error('❌ FAILED')
      console.error(`   → Error: ${error.message}`)
      console.log()
    }

    console.log('-'.repeat(60))
    console.log()
  }
}

// Main execution
async function main() {
  try {
    // Wait for server to be ready
    console.log('⏳ Waiting for server to be ready...\n')
    await new Promise(resolve => setTimeout(resolve, 5000))

    // Test orchestrator first
    await testOrchestrator()

    // Test complex queries
    await testComplexQueries()

    console.log('=' .repeat(60))
    console.log('🎉 ALL TESTS COMPLETED!')
    console.log('=' .repeat(60))
  } catch (error) {
    console.error('❌ Fatal error:', error)
    process.exit(1)
  }
}

main()
