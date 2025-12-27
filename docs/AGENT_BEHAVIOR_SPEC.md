# 🧠 AGENT BEHAVIOR SPECIFICATION
## Garcez Palha - Especificação Completa de Comportamento dos Agentes
**Versão**: 1.0 | **Data**: 27/12/2025 | **Status**: DRAFT

---

## 1. VISÃO GERAL DA ARQUITETURA

```
╔══════════════════════════════════════════════════════════════════════════════╗
║                        SISTEMA MULTI-AGENTE GARCEZ PALHA                     ║
╠══════════════════════════════════════════════════════════════════════════════╣
║                                                                              ║
║                              ┌─────────────┐                                 ║
║                              │   USUÁRIO   │                                 ║
║                              └──────┬──────┘                                 ║
║                                     │                                        ║
║                      ┌──────────────┼──────────────┐                        ║
║                      │              │              │                        ║
║                      ▼              ▼              ▼                        ║
║               ┌──────────┐   ┌──────────┐   ┌──────────┐                   ║
║               │  SITE    │   │ WHATSAPP │   │ TELEGRAM │                   ║
║               │  CHAT    │   │   BOT    │   │   BOT    │                   ║
║               └────┬─────┘   └────┬─────┘   └────┬─────┘                   ║
║                    │              │              │                          ║
║                    └──────────────┼──────────────┘                          ║
║                                   │                                          ║
║                                   ▼                                          ║
║                    ┌──────────────────────────────┐                         ║
║                    │     🧠 ORQUESTRADOR MESTRE    │                         ║
║                    │   (Decision Engine Central)   │                         ║
║                    └──────────────┬───────────────┘                         ║
║                                   │                                          ║
║     ┌─────────────┬───────────────┼───────────────┬─────────────┐           ║
║     │             │               │               │             │           ║
║     ▼             ▼               ▼               ▼             ▼           ║
║  ┌──────┐    ┌──────┐       ┌──────────┐    ┌──────┐    ┌──────────┐       ║
║  │CLARA │    │ AGENTES      │  AGENTES  │    │REVIEW│    │ AGENTES  │       ║
║  │Triagem    │JURÍDICOS│    │DOCUMENTOS │    │HUMANA│    │MARKETING │       ║
║  └──────┘    └──────┘       └──────────┘    └──────┘    └──────────┘       ║
║                                                                              ║
║  LEGENDA:                                                                    ║
║  • CLARA = Agente de Triagem Universal (primeiro contato)                   ║
║  • AGENTES JURÍDICOS = Real Estate, Criminal, Medical, Valuation, Forensics ║
║  • AGENTES DOCUMENTOS = Gerador de Petições, Contratos, Procurações         ║
║  • REVIEW HUMANA = Notificação e fila para advogado                         ║
║  • AGENTES MARKETING = CMO, Ads, SEO, Content, Social, Video, Design        ║
║                                                                              ║
╚══════════════════════════════════════════════════════════════════════════════╝
```

---

## 2. MÁQUINA DE ESTADOS DOS AGENTES

### 2.1 Estados Principais

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           ESTADOS DO AGENTE                                  │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────┐                                                            │
│  │   START     │ ◄── Entrada do usuário                                    │
│  └──────┬──────┘                                                            │
│         │                                                                   │
│         ▼                                                                   │
│  ┌─────────────┐     Primeira interação                                    │
│  │  GREETING   │ ──► "Olá! Sou Clara da Garcez Palha..."                  │
│  └──────┬──────┘                                                            │
│         │                                                                   │
│         ▼                                                                   │
│  ┌─────────────┐     Entendendo o problema                                 │
│  │IDENTIFYING  │ ──► "Conta pra mim o que está acontecendo..."            │
│  └──────┬──────┘                                                            │
│         │                                                                   │
│         ▼                                                                   │
│  ┌─────────────┐     Classificando área/produto                            │
│  │ CLASSIFYING │ ──► Detecta: Financeiro, Patrimonial, Saúde, Criminal    │
│  └──────┬──────┘                                                            │
│         │                                                                   │
│    ┌────┴────┐                                                              │
│    │         │                                                              │
│    ▼         ▼                                                              │
│  ┌─────────────┐  ┌─────────────┐                                          │
│  │QUALIFYING   │  │ ESCALATING  │ ──► Caso complexo → Advogado            │
│  │(Perguntas)  │  └─────────────┘                                          │
│  └──────┬──────┘                                                            │
│         │                                                                   │
│    ┌────┴────┐                                                              │
│    │         │                                                              │
│    ▼         ▼                                                              │
│  ┌─────────────┐  ┌─────────────┐                                          │
│  │ QUALIFIED   │  │  REJECTED   │ ──► "Infelizmente não podemos ajudar..." │
│  │   ✓        │  └─────────────┘                                          │
│  └──────┬──────┘                                                            │
│         │                                                                   │
│         ▼                                                                   │
│  ┌─────────────┐     Apresentando proposta                                 │
│  │  PROPOSING  │ ──► "Seu caso custa R$ X, inclui..."                     │
│  └──────┬──────┘                                                            │
│         │                                                                   │
│    ┌────┴────────────────┐                                                  │
│    │         │           │                                                  │
│    ▼         ▼           ▼                                                  │
│  ┌───────┐ ┌─────────┐ ┌────────────┐                                      │
│  │CLOSING│ │OBJECTION│ │  FOLLOWUP  │ ──► Não respondeu                   │
│  │   ✓   │ │HANDLING │ └────────────┘                                      │
│  └───┬───┘ └────┬────┘                                                      │
│      │          │                                                           │
│      ▼          │                                                           │
│  ┌─────────────┐│                                                           │
│  │  PAYMENT    │◄┘                                                          │
│  │  LINK SENT  │                                                            │
│  └──────┬──────┘                                                            │
│         │                                                                   │
│    ┌────┴────┐                                                              │
│    │         │                                                              │
│    ▼         ▼                                                              │
│  ┌─────────────┐  ┌─────────────┐                                          │
│  │    PAID     │  │ ABANDONED   │ ──► Follow-up automático               │
│  │     ✓      │  └─────────────┘                                          │
│  └──────┬──────┘                                                            │
│         │                                                                   │
│         ▼                                                                   │
│  ┌─────────────┐     Enviando contrato                                     │
│  │  CONTRACT   │ ──► ZapSign → Assinatura digital                         │
│  └──────┬──────┘                                                            │
│         │                                                                   │
│         ▼                                                                   │
│  ┌─────────────┐     Coletando documentos                                  │
│  │ONBOARDING   │ ──► "Agora preciso dos documentos..."                    │
│  └──────┬──────┘                                                            │
│         │                                                                   │
│         ▼                                                                   │
│  ┌─────────────┐     Caso em andamento                                     │
│  │  ACTIVE     │ ──► Notificações de andamento                            │
│  │   CASE      │                                                            │
│  └──────┬──────┘                                                            │
│         │                                                                   │
│         ▼                                                                   │
│  ┌─────────────┐                                                            │
│  │  COMPLETED  │ ──► "Seu caso foi resolvido! 🎉"                         │
│  └─────────────┘                                                            │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 2.2 Transições de Estado

```typescript
interface AgentState {
  current: StateType;
  data: ConversationData;
  history: Message[];
  score: QualificationScore;
  flags: QualificationFlags;
}

type StateType = 
  | 'greeting'
  | 'identifying'
  | 'classifying'
  | 'qualifying'
  | 'qualified'
  | 'rejected'
  | 'proposing'
  | 'objection_handling'
  | 'closing'
  | 'payment_pending'
  | 'paid'
  | 'contract_pending'
  | 'onboarding'
  | 'active_case'
  | 'completed'
  | 'escalated'
  | 'abandoned';

// Transições permitidas
const TRANSITIONS: Record<StateType, StateType[]> = {
  greeting: ['identifying'],
  identifying: ['classifying', 'escalated'],
  classifying: ['qualifying', 'escalated'],
  qualifying: ['qualified', 'rejected', 'escalated'],
  qualified: ['proposing'],
  rejected: [], // Estado final
  proposing: ['closing', 'objection_handling', 'abandoned'],
  objection_handling: ['closing', 'abandoned', 'escalated'],
  closing: ['payment_pending'],
  payment_pending: ['paid', 'abandoned'],
  paid: ['contract_pending'],
  contract_pending: ['onboarding'],
  onboarding: ['active_case'],
  active_case: ['completed', 'escalated'],
  completed: [], // Estado final
  escalated: [], // Estado final (humano assume)
  abandoned: [], // Estado final
};
```

---

## 3. MEMÓRIA E CONTEXTO

### 3.1 Estrutura de Dados da Conversa

```typescript
interface ConversationData {
  // Identificação
  conversation_id: string;
  phone_number: string;
  channel: 'website' | 'whatsapp' | 'telegram';
  
  // Dados do Cliente
  client: {
    name?: string;
    cpf?: string;
    email?: string;
    state?: string;
    city?: string;
  };
  
  // Classificação
  classification: {
    area: 'financial' | 'property' | 'health' | 'criminal' | 'general';
    product?: string; // ex: 'account_unblock', 'pix_fraud', 'usucapion'
    agent_assigned: AgentRole;
    confidence: number; // 0-1
  };
  
  // Qualificação
  qualification: {
    status: 'in_progress' | 'qualified' | 'rejected';
    questions_answered: number;
    total_questions: number;
    score: QualificationScore;
    flags: QualificationFlags;
    rejection_reason?: string;
  };
  
  // Proposta
  proposal: {
    package?: 'essential' | 'complete' | 'premium';
    value?: number;
    discount?: number;
    payment_method?: 'pix' | 'credit_card' | 'boleto';
    installments?: number;
    payment_link?: string;
    sent_at?: Date;
  };
  
  // Status
  status: {
    state: StateType;
    updated_at: Date;
    escalation_reason?: string;
    assigned_lawyer?: string;
  };
  
  // Timestamps
  created_at: Date;
  last_message_at: Date;
}

interface QualificationScore {
  urgency: number;      // 0-100 (40% peso)
  probability: number;  // 0-100 (35% peso)
  complexity: number;   // 0-100 (25% peso)
  total: number;        // Calculado
  category: 'hot' | 'warm' | 'cold' | 'very-cold' | 'unqualified';
}

interface QualificationFlags {
  is_salary_protected: boolean;    // Para desbloqueio
  is_judicial_block: boolean;      // Para desbloqueio
  is_not_alimony: boolean;         // Para desbloqueio
  has_proof: boolean;              // Para golpes
  time_since_incident: number;     // Em dias
  has_medical_request: boolean;    // Para plano saúde
  has_formal_denial: boolean;      // Para plano saúde
  years_possession: number;        // Para usucapião
  // ... mais flags específicas por produto
}
```

### 3.2 Persistência no Supabase

```sql
-- Tabela principal de conversas
CREATE TABLE conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phone_number VARCHAR(20) NOT NULL,
  channel VARCHAR(20) NOT NULL,
  current_state VARCHAR(30) NOT NULL DEFAULT 'greeting',
  area VARCHAR(20),
  product VARCHAR(50),
  agent_assigned VARCHAR(30),
  
  -- Dados do cliente (JSONB para flexibilidade)
  client_data JSONB DEFAULT '{}',
  
  -- Qualificação
  qualification_status VARCHAR(20) DEFAULT 'pending',
  qualification_score JSONB DEFAULT '{}',
  qualification_flags JSONB DEFAULT '{}',
  
  -- Proposta
  proposal_data JSONB DEFAULT '{}',
  payment_status VARCHAR(20),
  
  -- Escalação
  escalated BOOLEAN DEFAULT false,
  escalation_reason TEXT,
  assigned_lawyer_id UUID,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  last_message_at TIMESTAMPTZ,
  
  -- Índices
  CONSTRAINT valid_state CHECK (current_state IN (
    'greeting', 'identifying', 'classifying', 'qualifying',
    'qualified', 'rejected', 'proposing', 'objection_handling',
    'closing', 'payment_pending', 'paid', 'contract_pending',
    'onboarding', 'active_case', 'completed', 'escalated', 'abandoned'
  ))
);

-- Índices para performance
CREATE INDEX idx_conversations_phone ON conversations(phone_number);
CREATE INDEX idx_conversations_state ON conversations(current_state);
CREATE INDEX idx_conversations_escalated ON conversations(escalated) WHERE escalated = true;
```

---

## 4. COMPORTAMENTO POR ESTADO

### 4.1 GREETING (Boas-vindas)

```yaml
GREETING:
  objetivo: "Acolher e iniciar conversa"
  
  trigger:
    - Primeira mensagem do usuário
    - Timeout > 24h da última interação
  
  resposta_padrao: |
    Olá! 👋 Sou a Clara, assistente da Garcez Palha.
    Como posso te ajudar hoje?
  
  regras:
    - Sempre usar nome do cliente se disponível
    - Tom acolhedor, nunca robótico
    - Máximo 2 emojis
    - Mensagem curta (WhatsApp-friendly)
  
  transicao:
    proximo_estado: identifying
    condicao: Usuário responde qualquer coisa
```

### 4.2 IDENTIFYING (Identificando o Problema)

```yaml
IDENTIFYING:
  objetivo: "Entender o problema do cliente"
  
  estrategia:
    - Fazer pergunta aberta
    - Deixar cliente explicar
    - Identificar palavras-chave
  
  perguntas:
    se_vago: "Pode me contar um pouco mais sobre o que está acontecendo?"
    se_confuso: "Deixa eu entender melhor... você está tendo problema com [X]?"
  
  analise_keywords:
    financial:
      - bloqueio, bloqueado, penhora, conta, salário
      - pix, golpe, fraude, transferência
      - negativado, serasa, spc, dívida
    property:
      - imóvel, casa, apartamento, terreno
      - usucapião, escritura, registro
      - holding, herança, inventário
    health:
      - plano, saúde, cirurgia, exame
      - negou, negativa, autorização
      - inss, auxílio, bpc, loas
    criminal:
      - preso, prisão, flagrante, delegacia
      - crime, penal, habeas corpus
  
  transicao:
    proximo_estado: classifying
    condicao: Keywords detectadas com confidence > 0.5
    
    escalation:
      condicao: Cliente confuso após 3 tentativas
      acao: Escalar para humano
```

### 4.3 CLASSIFYING (Classificando)

```yaml
CLASSIFYING:
  objetivo: "Determinar área e produto específico"
  
  mapeamento:
    financial:
      account_unblock:
        keywords: [bloqueio, penhora, judicial, salário, aposentadoria]
        agente: RealEstateAgent # Usa mesmo para questões financeiras
      pix_fraud:
        keywords: [pix, golpe, fraude, transferência, golpista]
        agente: GeneralAgent
      improper_negativation:
        keywords: [negativado, serasa, spc, não reconheço, indevida]
        agente: GeneralAgent
        
    property:
      usucapion:
        keywords: [usucapião, morar, anos, escritura, não tenho]
        agente: RealEstateAgent
      family_holding:
        keywords: [holding, patrimônio, proteção, herança, impostos]
        agente: RealEstateAgent
        
    health:
      health_plan_denial:
        keywords: [plano, negou, cirurgia, exame, autorização]
        agente: MedicalAgent
      bpc_loas:
        keywords: [bpc, loas, idoso, deficiente, benefício]
        agente: MedicalAgent
        
    criminal:
      criminal_defense:
        keywords: [preso, crime, delegacia, flagrante, acusação]
        agente: CriminalAgent
  
  resposta_confirmacao: |
    Entendi! Você está com um problema de {area_nome}.
    Vou fazer algumas perguntas para entender melhor seu caso...
  
  transicao:
    proximo_estado: qualifying
    condicao: Produto identificado
```

### 4.4 QUALIFYING (Qualificando)

```yaml
QUALIFYING:
  objetivo: "Determinar se podemos ajudar e coletar dados"
  
  fluxo:
    1_eliminatorias:
      objetivo: "Verificar se caso é viável"
      continuar_se: Todas passam
      rejeitar_se: Qualquer falha crítica
      
    2_contexto:
      objetivo: "Entender detalhes do caso"
      obrigatorio: Sim
      
    3_coleta:
      objetivo: "Coletar dados pessoais"
      dados: [nome, cpf, estado]
  
  comportamento_perguntas:
    uma_por_vez: true
    validar_resposta: true
    reformular_se_invalido: true
    max_tentativas_por_pergunta: 3
    
  calculo_score:
    urgencia:
      peso: 0.40
      fatores:
        - tempo_desde_problema
        - impacto_financeiro
        - prazo_legal
    probabilidade:
      peso: 0.35
      fatores:
        - documentos_disponiveis
        - base_legal_forte
        - jurisprudencia_favoravel
    complexidade:
      peso: 0.25
      fatores:
        - multiplos_processos
        - partes_envolvidas
        - jurisdicoes
  
  categorias:
    hot: score >= 75
    warm: score >= 50 AND score < 75
    cold: score >= 25 AND score < 50
    very_cold: score < 25
    unqualified: flags.any_critical_fail
  
  transicao:
    qualified:
      condicao: score >= 25 AND NOT any_critical_fail
    rejected:
      condicao: any_critical_fail
      mensagem: Script de dispensa educada
```

### 4.5 PROPOSING (Fazendo Proposta)

```yaml
PROPOSING:
  objetivo: "Apresentar valor e convencer"
  
  calculo_preco:
    base_por_produto: true
    ajustes:
      - complexidade: +10-30%
      - urgencia: +10-20%
      - multiplos_casos: desconto 10%
  
  template_proposta: |
    📋 PROPOSTA
    
    Olá, {nome}!
    
    📌 RESUMO DO CASO
    {resumo_problema}
    
    ✅ SOLUÇÃO
    {explicacao_solucao}
    
    💰 INVESTIMENTO
    Pacote {pacote}: R$ {valor}
    
    Inclui:
    • {item_1}
    • {item_2}
    • {item_3}
    
    💳 PAGAMENTO
    • PIX com 5% desconto: R$ {valor_pix}
    • Cartão em até 6x: R$ {parcela}
    
    ⏱️ PRAZO
    Primeira ação em até 72 horas.
    
    Quer começar?
  
  transicao:
    closing:
      condicao: Cliente aceita
      acao: Gerar link de pagamento
    objection_handling:
      condicao: Cliente objeta
    abandoned:
      condicao: Sem resposta > 2h
      acao: Agendar follow-up
```

### 4.6 OBJECTION_HANDLING (Tratando Objeções)

```yaml
OBJECTION_HANDLING:
  objetivo: "Superar objeções e fechar"
  
  scripts:
    preco_alto:
      detectar: ["caro", "muito", "não tenho", "difícil"]
      resposta: |
        Entendo, {nome}. Mas pensa comigo:
        
        Quanto você perde por dia com esse problema?
        Quanto está pagando de juros, multas, stress?
        
        Nosso serviço se paga em dias.
        E ainda parcelo em até 6x sem juros.
        
        O que acha?
    
    vou_pensar:
      detectar: ["pensar", "ver", "depois", "não sei"]
      resposta: |
        Claro! Só lembra que cada dia que passa...
        é um dia a mais com o problema.
        
        Posso te mandar um resumo por escrito?
        Aí você analisa com calma e me diz.
    
    outro_advogado:
      detectar: ["outro", "advogado", "mais barato"]
      resposta: |
        Entendo! Mas considera isso:
        
        • 364 anos de tradição jurídica
        • Tecnologia que resolve em 72h
        • Acompanhamento pelo celular
        • Sem sair de casa
        
        O barato pode sair caro. 
        Confia na gente?
    
    desconfianca:
      detectar: ["golpe", "confiança", "garantia"]
      resposta: |
        Sua preocupação faz sentido!
        
        Somos registrados na OAB/RJ (219.390).
        Você pode verificar no site da OAB.
        
        O contrato é digital e assinado por ambas partes.
        Transparência total.
        
        Posso te mandar nosso registro?
  
  max_tentativas: 3
  
  transicao:
    closing:
      condicao: Cliente aceita após objeção
    escalated:
      condicao: Objeção não resolvida após 3 tentativas
      acao: Notificar advogado
```

---

## 5. AÇÕES AUTOMÁTICAS

### 5.1 Gatilhos e Ações

```typescript
interface AutomatedAction {
  trigger: Trigger;
  action: Action;
  conditions?: Condition[];
}

const AUTOMATED_ACTIONS: AutomatedAction[] = [
  // 1. Gerar link de pagamento quando aceita
  {
    trigger: { state: 'closing', event: 'client_accepted' },
    action: {
      type: 'generate_payment_link',
      provider: 'mercadopago',
      params: {
        value: '${proposal.value}',
        description: '${proposal.description}',
        payer_email: '${client.email}',
        payer_name: '${client.name}',
      }
    }
  },
  
  // 2. Enviar link de pagamento
  {
    trigger: { event: 'payment_link_generated' },
    action: {
      type: 'send_message',
      channel: '${channel}',
      template: 'payment_link',
      params: {
        link: '${payment_link}',
        value: '${proposal.value}',
        pix_discount: '${proposal.pix_discount}',
      }
    }
  },
  
  // 3. Pagamento confirmado → Gerar contrato
  {
    trigger: { event: 'payment_confirmed' },
    action: {
      type: 'generate_contract',
      template: '${product}_contract',
      send_to: 'zapsign',
    }
  },
  
  // 4. Contrato assinado → Solicitar documentos
  {
    trigger: { event: 'contract_signed' },
    action: {
      type: 'send_message',
      template: 'request_documents',
      params: {
        documents_list: '${product.required_documents}',
      }
    }
  },
  
  // 5. Documentos recebidos → Notificar advogado
  {
    trigger: { event: 'documents_received', conditions: ['all_required_received'] },
    action: {
      type: 'notify_lawyer',
      channel: 'telegram',
      template: 'new_case_ready',
      params: {
        client_name: '${client.name}',
        product: '${product.name}',
        documents_link: '${documents_folder_link}',
      }
    }
  },
  
  // 6. Follow-up se não pagou (2h)
  {
    trigger: { 
      state: 'payment_pending', 
      condition: 'time_since_state > 2h' 
    },
    action: {
      type: 'send_message',
      template: 'followup_payment_1',
    }
  },
  
  // 7. Follow-up se não pagou (24h)
  {
    trigger: { 
      state: 'payment_pending', 
      condition: 'time_since_state > 24h' 
    },
    action: {
      type: 'send_message',
      template: 'followup_payment_2',
    }
  },
  
  // 8. Marcar como abandonado (72h)
  {
    trigger: { 
      state: 'payment_pending', 
      condition: 'time_since_state > 72h AND no_response' 
    },
    action: {
      type: 'update_state',
      new_state: 'abandoned',
    }
  },
  
  // 9. Escalonar se cliente pede humano
  {
    trigger: { 
      event: 'message_received', 
      contains: ['humano', 'pessoa', 'advogado', 'falar com'] 
    },
    action: {
      type: 'escalate',
      reason: 'client_requested_human',
      notify: ['telegram', 'email'],
    }
  },
];
```

### 5.2 Fluxo de Notificação do Advogado

```
┌──────────────────────────────────────────────────────────────────────┐
│                    NOTIFICAÇÕES PARA O ADVOGADO                      │
├──────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  🔔 TELEGRAM (Imediato):                                            │
│     ├── Novo pagamento confirmado                                   │
│     ├── Contrato assinado                                           │
│     ├── Documentos recebidos (caso pronto)                          │
│     ├── Escalonamento solicitado                                    │
│     └── Cliente irritado/reclamação                                 │
│                                                                      │
│  📧 EMAIL (Diário):                                                 │
│     ├── Resumo de leads do dia                                      │
│     ├── Casos aguardando revisão                                    │
│     ├── Petições para protocolar                                    │
│     └── Relatório financeiro                                        │
│                                                                      │
│  📱 DASHBOARD (Sempre disponível):                                  │
│     ├── Fila de revisão                                             │
│     ├── Casos ativos                                                │
│     ├── Métricas em tempo real                                      │
│     └── Histórico de conversas                                      │
│                                                                      │
└──────────────────────────────────────────────────────────────────────┘
```

---

## 6. REGRAS DE ESCALONAMENTO

### 6.1 Quando Escalar para Humano

```yaml
ESCALATION_RULES:
  automatico:
    - cliente_pede_humano: true
    - cliente_irritado: detectar_sentimento == 'angry'
    - caso_complexo: complexity_score > 80
    - valor_alto: proposal.value > 10000
    - area_nao_suportada: area == 'unknown'
    - tentativas_esgotadas: objection_attempts >= 3
    - tempo_excedido: time_in_qualifying > 30min
    
  manual:
    - advogado_assume: lawyer_takeover == true
    - admin_intervem: admin_intervention == true
    
  notificacao:
    telegram:
      template: |
        🚨 ESCALONAMENTO
        
        📱 Tel: {phone}
        👤 Nome: {name}
        📋 Área: {area}
        📝 Motivo: {reason}
        
        📊 Score: {score}
        💬 Última msg: {last_message}
        
        [Ver conversa]({conversation_link})
      
    email:
      subject: "[URGENTE] Escalonamento - {client_name}"
      priority: high
```

### 6.2 Handoff para Humano

```typescript
async function escalateToHuman(conversationId: string, reason: string) {
  // 1. Atualizar estado
  await db.conversations.update(conversationId, {
    current_state: 'escalated',
    escalated: true,
    escalation_reason: reason,
    escalation_time: new Date(),
  });
  
  // 2. Gerar resumo da conversa
  const summary = await generateConversationSummary(conversationId);
  
  // 3. Notificar advogados
  await notifyLawyers({
    type: 'escalation',
    conversation_id: conversationId,
    summary,
    reason,
    urgency: calculateUrgency(reason),
  });
  
  // 4. Mensagem para cliente
  await sendMessage(conversationId, {
    template: 'escalation_to_human',
    params: {
      estimated_time: '30 minutos',
      lawyer_name: 'Dr. Leonardo',
    }
  });
}
```

---

## 7. MÉTRICAS E MONITORAMENTO

### 7.1 KPIs por Estado

```yaml
METRICS:
  greeting:
    - response_rate: % que respondem após greeting
    - time_to_response: tempo médio de resposta
    
  identifying:
    - classification_accuracy: % classificados corretamente
    - time_to_classify: tempo para classificar
    
  qualifying:
    - qualification_rate: % qualificados
    - rejection_rate: % rejeitados
    - avg_questions_to_qualify: média de perguntas
    
  proposing:
    - proposal_acceptance_rate: % que aceitam proposta
    - avg_time_to_decision: tempo para decidir
    
  closing:
    - conversion_rate: % que pagam
    - avg_ticket: ticket médio
    - payment_method_distribution: PIX vs Cartão
    
  overall:
    - lead_to_client_rate: % do total que vira cliente
    - avg_conversation_time: tempo médio de conversa
    - escalation_rate: % escalonados
    - abandonment_rate: % abandonados
    - customer_satisfaction: NPS
```

### 7.2 Alertas

```yaml
ALERTS:
  critical:
    - conversion_rate < 10%: "Conversão muito baixa!"
    - escalation_rate > 40%: "Muitos escalonamentos!"
    - avg_response_time > 5min: "Respostas lentas!"
    
  warning:
    - qualification_rate < 40%: "Taxa de qualificação baixa"
    - abandonment_rate > 30%: "Muitos abandonos"
    - avg_ticket < 1500: "Ticket médio caindo"
    
  info:
    - new_lead_spike: "Pico de novos leads"
    - payment_received: "Pagamento confirmado"
```

---

## 8. IMPLEMENTAÇÃO TÉCNICA

### 8.1 Estrutura de Arquivos

```
src/lib/ai/
├── agents/
│   ├── orchestrator/
│   │   ├── agent-orchestrator.ts      # Orquestrador principal
│   │   ├── state-machine.ts           # Máquina de estados
│   │   ├── context-manager.ts         # Gerenciador de contexto
│   │   └── action-dispatcher.ts       # Disparador de ações
│   │
│   ├── specialized/
│   │   ├── clara-triage-agent.ts      # CLARA (triagem)
│   │   ├── real-estate-agent.ts       # Imobiliário
│   │   ├── criminal-agent.ts          # Criminal
│   │   ├── medical-agent.ts           # Médico
│   │   ├── forensics-agent.ts         # Perícia
│   │   └── valuation-agent.ts         # Avaliação
│   │
│   ├── behaviors/
│   │   ├── greeting-behavior.ts
│   │   ├── qualifying-behavior.ts
│   │   ├── proposing-behavior.ts
│   │   ├── objection-behavior.ts
│   │   └── closing-behavior.ts
│   │
│   └── types/
│       ├── state-types.ts
│       ├── action-types.ts
│       └── conversation-types.ts
│
├── automation/
│   ├── follow-up-scheduler.ts
│   ├── payment-processor.ts
│   ├── contract-generator.ts
│   ├── document-collector.ts
│   └── notification-service.ts
│
└── prompts/
    ├── base-prompt.ts
    ├── qualification-prompts/
    │   ├── account-unblock.ts
    │   ├── pix-fraud.ts
    │   ├── usucapion.ts
    │   └── ...
    └── conversation-prompts/
        ├── greeting.ts
        ├── proposal.ts
        ├── objection-handlers.ts
        └── ...
```

### 8.2 Exemplo de Implementação

```typescript
// src/lib/ai/agents/orchestrator/state-machine.ts

export class AgentStateMachine {
  private state: AgentState;
  private context: ConversationContext;
  
  constructor(conversationId: string) {
    this.context = new ConversationContext(conversationId);
  }
  
  async processMessage(message: string): Promise<AgentResponse> {
    // 1. Carregar estado atual
    this.state = await this.context.load();
    
    // 2. Determinar ação baseada no estado
    const behavior = this.getBehaviorForState(this.state.current);
    
    // 3. Processar mensagem
    const result = await behavior.process(message, this.context);
    
    // 4. Verificar transições
    const nextState = this.evaluateTransitions(result);
    
    // 5. Executar ações automáticas
    await this.executeActions(result.actions);
    
    // 6. Atualizar estado
    if (nextState !== this.state.current) {
      await this.transition(nextState);
    }
    
    // 7. Salvar contexto
    await this.context.save();
    
    // 8. Retornar resposta
    return result.response;
  }
  
  private getBehaviorForState(state: StateType): Behavior {
    const behaviors = {
      greeting: new GreetingBehavior(),
      identifying: new IdentifyingBehavior(),
      classifying: new ClassifyingBehavior(),
      qualifying: new QualifyingBehavior(),
      proposing: new ProposingBehavior(),
      objection_handling: new ObjectionBehavior(),
      closing: new ClosingBehavior(),
      // ...
    };
    
    return behaviors[state] || new DefaultBehavior();
  }
  
  private evaluateTransitions(result: BehaviorResult): StateType {
    const transitions = TRANSITIONS[this.state.current];
    
    for (const nextState of transitions) {
      if (this.shouldTransition(nextState, result)) {
        return nextState;
      }
    }
    
    return this.state.current;
  }
  
  private async executeActions(actions: Action[]) {
    for (const action of actions) {
      await ActionDispatcher.execute(action, this.context);
    }
  }
}
```

---

## 9. CHECKLIST DE IMPLEMENTAÇÃO

### Fase 1: Core (Semana 1-2)
- [ ] StateMachine básica funcionando
- [ ] CLARA (triagem) com estados greeting → qualifying
- [ ] Persistência de contexto no Supabase
- [ ] Transições entre estados

### Fase 2: Qualificação (Semana 2-3)
- [ ] Behavior de qualificação por produto
- [ ] Cálculo de score automático
- [ ] Detecção de flags de qualificação
- [ ] Scripts de rejeição

### Fase 3: Proposta (Semana 3-4)
- [ ] Cálculo dinâmico de preço
- [ ] Geração de proposta
- [ ] Tratamento de objeções
- [ ] Geração de link de pagamento

### Fase 4: Automação (Semana 4-5)
- [ ] Webhooks de pagamento
- [ ] Geração de contrato automático
- [ ] Integração ZapSign
- [ ] Coleta de documentos

### Fase 5: Monitoramento (Semana 5-6)
- [ ] Dashboard de métricas
- [ ] Notificações Telegram
- [ ] Alertas automáticos
- [ ] Relatórios diários

---

*Documento criado em 27/12/2025*
*Versão 1.0 - DRAFT*
*Próxima revisão: Após implementação Fase 1*
