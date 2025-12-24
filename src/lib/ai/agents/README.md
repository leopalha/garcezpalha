# AI Agents System - Garcez Palha

Complete AI-powered legal consultation system with specialized agents for different areas of law and expertise.

## 🎯 Overview

The AI Agents system provides intelligent routing of legal queries to specialized agents, each expert in their domain:

1. **Real Estate Agent** - Property law, contracts, transactions, usucapião
2. **Document Forensics Agent** - Signature analysis, document authentication
3. **Property Valuation Agent** - Real estate appraisal (NBR 14653)
4. **Medical Expertise Agent** - Medical-legal analysis, disability assessment

## 🏗️ Architecture

```
src/lib/ai/
├── prompts/                    # Specialized system prompts
│   ├── base-prompt.ts          # OAB-compliant base prompt
│   ├── real-estate-prompts.ts  # Real estate law
│   ├── forensics-prompts.ts    # Document forensics
│   ├── valuation-prompts.ts    # Property valuation
│   ├── medical-prompts.ts      # Medical expertise
│   └── index.ts                # Exports
├── agents/                     # Agent implementations
│   ├── types.ts                # Common types
│   ├── base-agent.ts           # Base agent class
│   ├── real-estate-agent.ts    # Real estate specialist
│   ├── document-forensics-agent.ts  # Forensics specialist
│   ├── property-valuation-agent.ts  # Valuation specialist
│   ├── medical-expertise-agent.ts   # Medical specialist
│   ├── agent-orchestrator.ts   # Intelligent routing
│   ├── index.ts                # Exports
│   └── README.md               # This file
└── openai-client.ts            # OpenRouter API client
```

## 🚀 Quick Start

### Simple Query (Recommended)

```typescript
import { processQuery } from '@/lib/ai/agents'

// Automatically routes to the right agent
const response = await processQuery("Quanto vale meu apartamento de 80m²?")

console.log(response.content)      // AI-generated answer
console.log(response.agentUsed)    // 'valuation'
console.log(response.confidence)   // 0.85
```

### With Conversation History

```typescript
import { processQuery } from '@/lib/ai/agents'

const history = [
  { role: 'user', content: 'Quero comprar um imóvel' },
  { role: 'assistant', content: 'Posso ajudá-lo com isso. Qual sua dúvida?' }
]

const response = await processQuery(
  "Quais documentos preciso verificar?",
  history
)
```

### Using the Orchestrator

```typescript
import { getOrchestrator } from '@/lib/ai/agents'

const orchestrator = getOrchestrator()

// Auto-routing
const response = await orchestrator.process("Como fazer usucapião?")

// Manual routing
const response2 = await orchestrator.processWithAgent(
  'real-estate',
  "Analise este contrato",
  history
)

// Get suggested agent without processing
const suggestion = orchestrator.suggestAgent("Assinatura falsa")
console.log(suggestion) // { role: 'forensics', confidence: 0.92 }
```

### Direct Agent Access

```typescript
import {
  RealEstateAgent,
  DocumentForensicsAgent,
  PropertyValuationAgent,
  MedicalExpertiseAgent
} from '@/lib/ai/agents'

// Create agent
const realEstateAgent = new RealEstateAgent()

// Use specialized methods
const response = await realEstateAgent.analyzeContract(contractText)
const costs = await realEstateAgent.calculateCosts("Imóvel de R$ 500.000")

// Or general chat
const answer = await realEstateAgent.chat("Como funciona o ITBI?")
```

## 📚 Agent Capabilities

### 1. Real Estate Agent

**Keywords**: imóvel, casa, apartamento, compra, venda, locação, usucapião, ITBI, IPTU, matrícula, despejo

**Specialized Methods**:
- `analyzeContract(contractText)` - Analyze real estate contract
- `checkProperty(propertyInfo)` - Verify property documentation
- `calculateCosts(transactionDetails)` - Calculate taxes and fees
- `draftLease(leaseDetails)` - Draft lease contract
- `analyzeUsucapiao(possessionDetails)` - Analyze usucapião feasibility

**Example**:
```typescript
const agent = new RealEstateAgent()

const analysis = await agent.analyzeContract(`
  CONTRATO DE COMPRA E VENDA
  Vendedor: João da Silva
  Comprador: Maria Santos
  Imóvel: Apartamento 301, Rua X, 123
  Valor: R$ 400.000,00
  ...
`)

console.log(analysis.content)
// Returns detailed analysis with risks, costs, and recommendations
```

### 2. Document Forensics Agent

**Keywords**: assinatura, falsificação, grafotécnica, perícia, autenticidade, laudo, adulteração

**Specialized Methods**:
- `analyzeSignature(signatureInfo)` - Analyze signature authenticity
- `detectAlterations(documentInfo)` - Detect document alterations
- `assessAuthenticity(documentDetails)` - Assess overall authenticity
- `prepareForensicCase(caseDetails)` - Prepare for forensic proceedings

**Example**:
```typescript
const agent = new DocumentForensicsAgent()

const analysis = await agent.analyzeSignature(`
  Tenho um contrato com assinatura suspeita.
  A assinatura parece tremida e tem retoques.
  Possuo 15 assinaturas autênticas para comparação.
`)

console.log(analysis.content)
// Returns analysis of authenticity indicators
```

### 3. Property Valuation Agent

**Keywords**: avaliação, valor, preço, quanto vale, NBR 14653, mercado, depreciação

**Specialized Methods**:
- `estimateValue(propertyDetails)` - Estimate property value
- `comparativeAnalysis(propertyAndComparables)` - Market analysis
- `applyDepreciation(propertyInfo)` - Calculate depreciation
- `generateReport(fullPropertyData)` - Generate valuation report

**Example**:
```typescript
const agent = new PropertyValuationAgent()

const valuation = await agent.estimateValue(`
  Apartamento em Copacabana
  80m², 2 quartos, 1 vaga
  Andar 15, vista para o mar
  Prédio de 30 anos, bem conservado
`)

console.log(valuation.content)
// Returns estimated value with methodology
```

### 4. Medical Expertise Agent

**Keywords**: médico, acidente de trabalho, lesão, incapacidade, INSS, auxílio, DPVAT, invalidez, erro médico

**Specialized Methods**:
- `analyzeMedicalReport(reportContent)` - Analyze medical report
- `calculateDisability(injuryDetails)` - Calculate disability degree
- `estimateIndemnity(caseDetails)` - Estimate compensation value
- `analyzeWorkAccident(accidentDetails)` - Analyze work accident
- `assessMedicalError(errorDetails)` - Assess medical error case

**Example**:
```typescript
const agent = new MedicalExpertiseAgent()

const analysis = await agent.analyzeWorkAccident(`
  Funcionário sofreu queda de 3 metros em canteiro de obras.
  Fratura exposta na perna direita.
  Afastado há 6 meses, ainda com limitação de movimento.
  Empregador não forneceu EPI adequado.
`)

console.log(analysis.content)
// Returns analysis of rights, benefits, and compensation
```

## ⚙️ Configuration

### Custom AI Model

```typescript
import { getOrchestrator } from '@/lib/ai/agents'

const orchestrator = getOrchestrator({
  model: 'openai/gpt-4',  // or 'anthropic/claude-3-opus'
  temperature: 0.5,        // Lower = more deterministic
  maxTokens: 8000,
  stream: false
})
```

### Per-Agent Configuration

```typescript
import { RealEstateAgent } from '@/lib/ai/agents'

const agent = new RealEstateAgent({
  temperature: 0.3,  // More precise for legal analysis
  maxTokens: 6000
})
```

## 🔒 Ethics & Compliance

All agents are built with OAB (Brazilian Bar Association) ethics in mind:

- ✓ Maintain professional secrecy and confidentiality
- ✓ Never guarantee legal outcomes
- ✓ Cite applicable laws and regulations
- ✓ Recommend in-person consultation for complex cases
- ✓ Include mandatory disclaimers
- ✓ Refuse guidance on illegal activities

Every response includes:
- Legal basis (laws, codes, articles)
- Clear action steps
- Risk warnings
- Contact information for formal consultation
- Professional disclaimer

## 🧪 Testing

```typescript
import { getOrchestrator } from '@/lib/ai/agents'

// Test agent selection
const orchestrator = getOrchestrator()

const tests = [
  "Quanto custa o ITBI?",           // Should use real-estate
  "Assinatura falsa em contrato",   // Should use forensics
  "Quanto vale meu apartamento?",   // Should use valuation
  "Sofri acidente de trabalho",     // Should use medical
]

for (const query of tests) {
  const suggestion = orchestrator.suggestAgent(query)
  console.log(`"${query}" → ${suggestion.role} (${suggestion.confidence})`)
}
```

## 📊 Response Format

All agents return consistent response format:

```typescript
interface OrchestratorResponse {
  content: string          // AI-generated answer
  agentUsed: AgentRole     // 'real-estate' | 'forensics' | 'valuation' | 'medical' | 'general'
  confidence: number       // 0-1 confidence score
  tokensUsed?: number      // Total tokens consumed
  model?: string           // Model used
  finishReason?: string    // 'stop' | 'length' | etc
}
```

## 🔄 Integration with Existing Chatbot

To replace or enhance the existing chatbot in `src/lib/ai/chatbot.ts`:

```typescript
import { getOrchestrator } from './agents'

export async function chat(
  conversationId: string,
  message: string,
  history: Message[]
) {
  const orchestrator = getOrchestrator()

  const response = await orchestrator.process(message, history, {
    conversationId,
  })

  // Log agent used for analytics
  console.log(`[Chat] Used ${response.agentUsed} agent`)

  return response.content
}
```

## 🚧 Future Enhancements

### Planned Features:
- [ ] Function calling for real-time data (property searches, court records)
- [ ] Image analysis for documents and signatures
- [ ] Integration with external APIs (cartórios, DETRAN, INSS)
- [ ] Multi-turn conversation context management
- [ ] Agent collaboration (multiple agents on complex cases)
- [ ] Performance metrics and analytics dashboard
- [ ] RAG (Retrieval-Augmented Generation) with case law database

### Potential Integrations:
- [ ] Cartórios (property records)
- [ ] SINTEGRA (tax verification)
- [ ] DETRAN (vehicle records)
- [ ] INSS API (benefit verification)
- [ ] Google Calendar (deadline sync)
- [ ] WhatsApp Bot (client notifications)

## 📝 License & Disclaimer

This system is part of Garcez Palha's proprietary legal tech stack. All prompts and agent configurations are calibrated for Brazilian law (as of January 2025).

**⚖️ Legal Notice**: AI-generated responses are for informational purposes only and do not constitute legal advice. Always consult with a licensed attorney for specific legal matters.

---

**Questions or Issues?**
Contact: Leonardo Garcez Palha | contato@garcezpalha.com | (21) 97503-0018
