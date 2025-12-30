# AI-powered Legal Agents - Sistema Multi-Agente

**Versão**: 1.0
**Atualização**: 29/12/2025
**Total de Agentes**: 8 especializados + 1 orquestrador

---

## ARQUITETURA DO SISTEMA

```
Client Query
     ↓
AgentOrchestrator (routes query)
     ↓
┌────────────────────────────────────────────────────┐
│  Financial Protection  │  Social Security          │
│  Health Insurance      │  Real Estate              │
│  Valuation            │  Forensics                │
│  Medical              │  Criminal                 │
│  General              │                            │
└────────────────────────────────────────────────────┘
     ↓
Unified Response
```

---

## 1. AGENTES ESPECIALIZADOS (8)

### 1.1 Financial Protection Agent

**Arquivo**: `src/lib/ai/agents/financial-protection-agent.ts`
**Prompt**: `src/lib/ai/prompts/financial-protection-prompts.ts`
**Role**: `financial-protection`

**Produtos Cobertos** (11):
- desbloqueio-conta
- golpe-pix
- negativacao-indevida
- defesa-execucao
- seguro-prestamista ⭐
- revisao-contrato-bancario ⭐
- portabilidade-credito ⭐
- fraude-consignado ⭐
- assinaturas-digitais ⭐
- produto-vicio ⭐
- atraso-entrega ⭐

**Especialização**:
- Proteção bancária e financeira
- Direito do consumidor (relações bancárias)
- Fraudes e golpes financeiros
- Bloqueios e desbloqueios de conta
- Cobranças indevidas e negativações
- Contratos bancários abusivos
- Defesa em execuções fiscais e bancárias

**Capacidades**:
- Análise de contratos bancários
- Identificação de cláusulas abusivas
- Cálculo de restituição em dobro
- Pedidos de liminar urgente
- Estratégias de defesa em execução
- Negociação de acordos

**Status**: Ativo, Produção

---

### 1.2 Health Insurance Agent

**Arquivo**: `src/lib/ai/agents/health-insurance-agent.ts`
**Prompt**: `src/lib/ai/prompts/health-insurance-prompts.ts`
**Role**: `health-insurance`

**Produtos Cobertos** (3):
- plano-saude-negou
- cirurgia-bariatrica
- tea (Tratamento Autismo)

**Especialização**:
- Negativas de planos de saúde
- Cobertura de cirurgias e tratamentos
- Lei dos Planos de Saúde (9.656/98)
- ANS (Agência Nacional de Saúde)
- Doenças graves e urgentes
- Tratamentos especiais (TEA, bariátrica)

**Capacidades**:
- Análise de negativas de cobertura
- Pedidos de liminar urgente (24-72h)
- Cálculo de danos morais
- Multa diária contra plano
- Jurisprudência especializada
- Argumentação técnica médica

**Status**: Ativo, Produção

---

### 1.3 Social Security Agent

**Arquivo**: `src/lib/ai/agents/social-security-agent.ts`
**Prompt**: `src/lib/ai/prompts/social-security-prompts.ts`
**Role**: `social-security`

**Produtos Cobertos** (7):
- bpc-loas
- aposentadoria-invalidez
- auxilio-doenca
- aposentadoria
- revisao-aposentadoria ⭐
- beneficio-negado ⭐
- auxilio-acidente ⭐

**Especialização**:
- Benefícios do INSS
- Aposentadorias (tempo, idade, invalidez)
- Auxílios (doença, acidente)
- BPC/LOAS (assistencial)
- Revisões de benefícios
- Perícias médicas do INSS
- Atividade especial

**Capacidades**:
- Análise de tempo de contribuição
- Cálculo de benefícios
- Estratégias para perícia médica
- Revisão "da vida toda"
- Reconhecimento de atividade especial
- Tutela antecipada para benefícios
- Cálculo de atrasados

**Status**: Ativo, Produção

---

### 1.4 Real Estate Agent

**Arquivo**: `src/lib/ai/agents/real-estate-agent.ts`
**Prompt**: `src/lib/ai/prompts/real-estate-prompts.ts`
**Role**: `real-estate`

**Produtos Cobertos** (6):
- direito-imobiliario
- usucapiao
- regularizacao-imovel
- holding-familiar
- inventario
- distrato-imobiliario ⭐

**Especialização**:
- Contratos imobiliários
- Compra e venda
- Usucapião (todas as modalidades)
- Regularização fundiária
- Sucessões e inventários
- Holdings patrimoniais
- Distrato e devolução de imóveis

**Capacidades**:
- Análise de contratos imobiliários
- Due diligence de imóveis
- Requisitos de usucapião
- Planejamento sucessório
- Estruturação de holdings
- Cálculo de distrato (Lei 13.786/2018)
- Regularização documental

**Status**: Ativo, Produção

---

### 1.5 Property Valuation Agent

**Arquivo**: `src/lib/ai/agents/property-valuation-agent.ts`
**Prompt**: `src/lib/ai/prompts/valuation-prompts.ts`
**Role**: `valuation`

**Produtos Cobertos** (1):
- avaliacao-imoveis

**Especialização**:
- Avaliação técnica de imóveis
- NBR 14653 (ABNT)
- Laudos de avaliação
- Métodos comparativos
- Valor de mercado
- Depreciação e benfeitorias

**Capacidades**:
- Cálculo de valor de mercado
- Metodologia NBR 14653
- Análise de comparáveis
- Laudos técnicos para processos
- Avaliação de terrenos e edificações
- Consideração de localização e estado

**Status**: Ativo, Produção

---

### 1.6 Document Forensics Agent

**Arquivo**: `src/lib/ai/agents/document-forensics-agent.ts`
**Prompt**: `src/lib/ai/prompts/forensics-prompts.ts`
**Role**: `forensics`

**Produtos Cobertos** (3):
- pericia-documental
- grafotecnica
- laudo-tecnico

**Especialização**:
- Autenticidade de documentos
- Análise grafotécnica
- Falsificação de assinaturas
- Laudos periciais
- Criminalística documental

**Capacidades**:
- Identificação de falsificações
- Análise de assinaturas
- Comparação grafotécnica
- Laudos técnicos fundamentados
- Evidências documentais
- Suporte em fraudes

**Status**: Ativo, Produção

---

### 1.7 Medical Expertise Agent

**Arquivo**: `src/lib/ai/agents/medical-expertise-agent.ts`
**Prompt**: `src/lib/ai/prompts/medical-prompts.ts`
**Role**: `medical`

**Produtos Cobertos** (1):
- pericia-medica

**Especialização**:
- Perícias médicas judiciais
- Acidentes de trabalho
- Erro médico (responsabilidade civil)
- Avaliação de incapacidade
- Nexo causal
- Danos corporais

**Capacidades**:
- Análise de laudos médicos
- Avaliação de incapacidade laboral
- Nexo causal (acidente→sequela)
- Danos estéticos e funcionais
- Percentual de incapacidade
- Suporte em perícias do INSS

**Status**: Ativo, Produção

---

### 1.8 Criminal Law Agent

**Arquivo**: `src/lib/ai/agents/criminal-law-agent.ts`
**Prompt**: `src/lib/ai/prompts/criminal-law-prompts.ts`
**Role**: `criminal`

**Produtos Cobertos** (2):
- defesa-criminal
- habeas-corpus

**Especialização**:
- Defesa criminal
- Habeas corpus
- Código Penal e Processo Penal
- Medidas cautelares
- Recursos criminais
- Execução penal

**Capacidades**:
- Estratégias de defesa criminal
- Pedidos de liberdade provisória
- Habeas corpus preventivo/liberatório
- Análise de provas criminais
- Recursos (apelação, RESE, RHC)
- Execução penal

**Status**: Ativo, Produção

---

## 2. AGENTE GERAL (General Agent)

**Role**: `general`

**Produtos Cobertos** (12):
- secretaria-remota
- cobranca-telefonia ⭐
- multa-fidelidade ⭐
- portabilidade-numero ⭐
- cobranca-energia ⭐
- overbooking-voo ⭐
- verbas-rescisoria ⭐
- horas-extras ⭐
- incorporacao-gratificacao ⭐
- diferencas-salariais ⭐
- fies-renegociacao ⭐
- cobranca-condominial ⭐

**Especialização**:
- Casos gerais e multidisciplinares
- Telecomunicações (Anatel)
- Trabalhista (casos simples)
- Servidor público
- Direito educacional
- Direito condominial
- Consumidor geral

**Capacidades**:
- Qualificação de leads
- Atendimento inicial
- Triagem de casos
- Encaminhamento a especialistas
- Casos sem agente específico

**Status**: Ativo, Produção

---

## 3. ORQUESTRADOR (Agent Orchestrator)

**Arquivo**: `src/lib/ai/agents/agent-orchestrator.ts`
**Core**: `src/lib/ai/agents/core/executive-orchestrator.ts`

**Função**: Roteamento inteligente de consultas para o agente correto

**Fluxo**:
1. Recebe query do usuário
2. Analisa contexto e palavras-chave
3. Identifica agente mais adequado
4. Roteia para agente especializado
5. Retorna resposta unificada

**Estratégia de Roteamento**:
- **Keywords**: Palavras-chave dos produtos
- **Context**: Histórico de conversa
- **Product mapping**: Consulta agent-product-mapping.ts
- **Fallback**: General Agent se incerto

**Capacidades**:
- Análise semântica de queries
- Decisão de roteamento
- Gerenciamento de contexto
- Agregação de respostas
- Logging e métricas

**Status**: Ativo, Produção

---

## 4. PROMPTS DO SISTEMA (29 arquivos)

### Base Prompts
1. `base-prompt.ts` - Prompt base para todos os agentes

### Agent-Specific Prompts (8)
2. `financial-protection-prompts.ts`
3. `health-insurance-prompts.ts`
4. `social-security-prompts.ts`
5. `real-estate-prompts.ts`
6. `valuation-prompts.ts`
7. `forensics-prompts.ts`
8. `medical-prompts.ts`
9. `criminal-law-prompts.ts`

### Diretórios de Prompts
- `src/lib/ai/prompts/executive/` - Prompts de gestão e orchestration
- `src/lib/ai/prompts/intelligence/` - Prompts de análise e qualificação
- `src/lib/ai/prompts/marketing/` - Prompts para geração de conteúdo
- `src/lib/ai/prompts/operations/` - Prompts operacionais

### Estrutura de Prompt

Cada agente tem:
- **SPECIALIZATION**: Definição de expertise
- **SYSTEM_PROMPT**: Instrução principal do agente
- **TASKS**: Tarefas que o agente executa

Exemplo (Financial Protection):
```typescript
export const FINANCIAL_PROTECTION_SPECIALIZATION = `
Você é um advogado especialista em:
- Direito bancário e financeiro
- Proteção do consumidor (relações bancárias)
- Contratos de empréstimo e financiamento
...
`

export const FINANCIAL_PROTECTION_SYSTEM_PROMPT = `
${BASE_PROMPT}
${FINANCIAL_PROTECTION_SPECIALIZATION}
...
`
```

---

## 5. QUESTION SETS (9 conjuntos)

**Localização**: `src/lib/ai/qualification/questions/`

### 5.1 banking-questions.ts
- Seguro prestamista
- Revisão de contrato
- Portabilidade de crédito
- Fraude consignado

### 5.2 criminal-questions.ts
- Defesa criminal
- Habeas corpus

### 5.3 expertise-questions.ts
- Perícias documentais
- Grafotécnica
- Laudos técnicos

### 5.4 financial-protection-questions.ts
- Desbloqueio de conta
- Golpe PIX
- Negativação
- Defesa em execução

### 5.5 health-insurance-questions.ts
- Plano de saúde
- Bariátrica
- TEA

### 5.6 patrimonial-questions.ts
- Usucapião
- Holding familiar
- Inventário
- Regularização

### 5.7 previdenciario-servidor-questions.ts
- Incorporação gratificação
- Diferenças salariais

### 5.8 social-security-questions.ts
- BPC/LOAS
- Aposentadorias
- Auxílios
- Revisões

### 5.9 telecom-consumer-questions.ts
- Cobrança telefonia
- Multa fidelidade
- Portabilidade número
- Assinaturas digitais
- Overbooking
- Produto vício
- Atraso entrega
- Distrato imobiliário
- Energia
- Condominial
- FIES
- Verbas rescisórias
- Horas extras

---

## 6. SISTEMA DE QUALIFICAÇÃO

**Arquivo**: `src/lib/ai/qualification/question-engine.ts`

**Função**: Motor de perguntas dinâmicas para qualificar leads

**Fluxo**:
1. Identifica produto do lead
2. Carrega question set apropriado
3. Faz perguntas sequenciais
4. Coleta informações essenciais
5. Calcula score de qualificação
6. Gera proposta personalizada

**Exemplo de Pergunta**:
```typescript
{
  id: 'seguro-prestamista-1',
  text: 'Você tem o contrato do empréstimo em mãos?',
  type: 'yes_no',
  required: true,
  points: 10
}
```

---

## 7. GERAÇÃO DE PROPOSTAS

**Arquivo**: `src/lib/ai/qualification/proposal-generator.ts`

**Função**: Gera proposta comercial personalizada

**Inputs**:
- Produto identificado
- Respostas do questionário
- Score de qualificação
- Dados do lead

**Outputs**:
- Proposta formatada em Markdown
- Planos disponíveis (básico/completo/premium)
- Preços e formas de pagamento
- Próximos passos
- Link de pagamento (via payment-link-generator.ts)

---

## 8. FOLLOW-UP SCHEDULER

**Arquivo**: `src/lib/ai/qualification/follow-up-scheduler.ts`

**Função**: Agenda follow-ups automáticos

**Estratégias**:
- **Alta qualificação**: Follow-up em 24h
- **Média qualificação**: Follow-up em 48h
- **Baixa qualificação**: Nutrição de lead
- **Sem resposta**: Reengajamento em 7 dias

---

## 9. TEMPLATES WHATSAPP

**Arquivo**: `src/lib/ai/qualification/whatsapp-templates.ts`

**Função**: Templates de mensagens padronizadas para WhatsApp

**Tipos**:
- Boas-vindas
- Qualificação
- Proposta
- Follow-up
- Confirmação de pagamento
- Solicitação de documentos
- Agendamento de reunião

---

## 10. AGENT-PRODUCT MAPPING

**Arquivo**: `src/lib/ai/qualification/agent-product-mapping.ts`

**Função**: Mapeamento definitivo de qual agente atende qual produto

**Estrutura**:
```typescript
{
  agentRole: 'financial-protection',
  productIds: [
    'desbloqueio-conta',
    'golpe-pix',
    'seguro-prestamista',
    // ...
  ]
}
```

**Funções Utilitárias**:
- `getProductsForAgent(agentRole)` - Lista produtos do agente
- `getAgentForProduct(productId)` - Identifica agente responsável
- `doesAgentHandleProduct(agentRole, productId)` - Verifica se agente atende produto
- `getAllMappedProducts()` - Lista todos os produtos mapeados

---

## 11. MÉTRICAS E MONITORAMENTO

**Arquivo**: `src/lib/ai/agents/core/agent-metrics.ts`

**Métricas Coletadas**:
- Tempo de resposta por agente
- Taxa de acerto de roteamento
- Conversão por agente
- Queries por agente
- Erros e exceções

**Logging**:
- **Arquivo**: `src/lib/ai/agents/core/agent-logger.ts`
- **Níveis**: info, warn, error, debug
- **Formato**: JSON estruturado

---

## 12. STATE MACHINE (Máquina de Estados)

**Diretório**: `src/lib/ai/agents/state-machine/`

**Estados do Lead**:
1. **new** - Lead novo, não qualificado
2. **qualifying** - Em processo de qualificação
3. **qualified** - Qualificado, aguardando proposta
4. **proposal_sent** - Proposta enviada
5. **negotiating** - Em negociação
6. **converted** - Convertido (pagou)
7. **lost** - Perdido
8. **nurturing** - Em nutrição

**Transições**:
- new → qualifying (início qualificação)
- qualifying → qualified (score alto)
- qualified → proposal_sent (proposta enviada)
- proposal_sent → negotiating (lead respondeu)
- negotiating → converted (pagamento confirmado)
- * → lost (desistiu)
- qualified → nurturing (score médio)

---

## 13. TESTES AUTOMATIZADOS

**Diretório**: `src/lib/ai/agents/__tests__/`

**Testes Disponíveis**:
- Testes unitários de cada agente
- Testes de roteamento do orquestrador
- Testes de geração de propostas
- Testes de question engine
- Testes de integração

---

## 14. USO PRÁTICO PARA MANUS

### Como MANUS usa os agentes:

1. **Recebe mensagem do usuário** (WhatsApp, Chat)
2. **Chama AgentOrchestrator.process(mensagem)**
3. **Orquestrador analisa e roteia para agente especializado**
4. **Agente processa e retorna resposta**
5. **MANUS envia resposta ao usuário**

### Exemplo de Código:

```typescript
import { processQuery } from '@/lib/ai/agents'

const userMessage = "Meu plano de saúde negou minha cirurgia"
const response = await processQuery(userMessage)

console.log(response.content) // Resposta do Health Insurance Agent
console.log(response.agentUsed) // 'health-insurance'
console.log(response.suggestedProduct) // 'plano-saude-negou'
```

### Qualificação de Lead:

```typescript
import { QuestionEngine } from '@/lib/ai/qualification/question-engine'

const engine = new QuestionEngine()
const questions = await engine.getQuestionsForProduct('seguro-prestamista')

// Fazer perguntas ao lead...
const answers = { /* respostas */ }

const score = await engine.calculateScore(answers)
const proposal = await engine.generateProposal('seguro-prestamista', answers)
```

---

## 15. CONFIGURAÇÕES E CONSTANTES

**Arquivo**: `src/lib/ai/agents/types.ts`

**Configurações Padrão**:
- **DEFAULT_MODEL**: `gpt-4o-mini` (ou Claude Sonnet 3.5)
- **DEFAULT_TEMPERATURE**: 0.7
- **DEFAULT_MAX_TOKENS**: 2000
- **TIMEOUT**: 30s

**AgentRole** (enum):
```typescript
type AgentRole =
  | 'financial-protection'
  | 'health-insurance'
  | 'social-security'
  | 'real-estate'
  | 'valuation'
  | 'forensics'
  | 'medical'
  | 'criminal'
  | 'general'
```

---

## RESUMO PARA MANUS

- **8 agentes especializados** + 1 geral + 1 orquestrador
- **57 produtos** mapeados para agentes
- **29 arquivos de prompts** customizados
- **9 question sets** para qualificação
- **Roteamento automático** via keywords e contexto
- **Geração de propostas** personalizada
- **Follow-up** agendado automaticamente
- **Templates WhatsApp** prontos
- **Métricas e logging** completos
- **State machine** para tracking de leads

**Status Geral**: Sistema 100% funcional e em produção

---

**Última atualização**: 29/12/2025
**Documentação técnica**: `src/lib/ai/agents/README.md`
