# 📊 Status - Consolidação de Chat (Fase 1)

**Data**: 2025-12-28
**Fase**: 1 - Preparação (COMPLETA ✅)
**Commits**: 8 (1 desta fase)
**Próxima Fase**: 2 - Implementação

---

## ✅ Fase 1 - Preparação (Completa)

### Objetivo
Criar infraestrutura compartilhada (types, constants, utils, components auxiliares) para consolidar os 4 componentes de chat em um único componente unificado.

---

### Arquivos Criados

#### 1. Types Unificados
**Arquivo**: `src/types/chat.ts` (296 linhas)

**Conteúdo**:
- `ChatMode`: 'chat' | 'agent-flow' | 'realtime-voice'
- `MessageRole`: 'user' | 'assistant' | 'system'
- `Message`: Interface base para mensagens
- `AgentState`: 17 estados do agent-flow
- `QualificationData`: Dados de qualificação de leads
- `Classification`, `Proposal`: Dados do agent-flow
- `AgentFlowResponse`: Resposta completa da API
- `RealtimeMessage`, `RealtimeStatus`: Tipos para realtime voice
- `ChatFeatures`: Flags de features
- `ChatSettings`: Configurações de TTS, microfone, etc.
- Props de todos os componentes (Unified, Chat, Enhanced, AgentFlow, Realtime)
- Payloads e Responses das APIs

**Benefício**: Tipos compartilhados evitam duplicação e garantem consistência

---

#### 2. Constants de Estados
**Arquivo**: `src/constants/chat-states.ts` (175 linhas)

**Conteúdo**:
- `STATE_LABELS`: Labels em português para cada estado
- `STATE_ICONS`: Ícone Lucide para cada estado
- `STATE_COLORS`: Cor Tailwind para cada estado
- `STATE_BADGE_VARIANTS`: Variante de badge para cada estado
- `STATE_GROUPS`: Agrupamento lógico de estados
- Helper functions:
  - `getStateLabel(state)`
  - `getStateIcon(state)`
  - `getStateColor(state)`
  - `getStateBadgeVariant(state)`
  - `getStateGroup(state)`
  - `isTerminalState(state)`
  - `isActiveState(state)`
  - `requiresHumanIntervention(state)`

**Benefício**: Centraliza mapeamento de 17 estados do agent-flow

---

#### 3. Utilitários de Chat

**3.1. parseMarkdown.ts** (92 linhas)
- `parseMarkdown(text)`: Converte markdown para React elements
- `stripMarkdown(text)`: Remove markdown, retorna texto puro
- `hasMarkdown(text)`: Detecta se texto tem markdown
- Suporta: **bold**, *italic*, `code`, [links](url)

**3.2. conversationId.ts** (75 linhas)
- `generateConversationId(channel)`: Gera ID no formato `channel:timestamp-random`
- `parseConversationId(id)`: Parse ID para obter channel, timestamp, random
- `isValidConversationId(id)`: Valida formato
- `getChannelFromId(id)`: Extrai canal
- `getTimestampFromId(id)`: Extrai timestamp
- `getConversationAgeMinutes(id)`: Calcula idade em minutos
- `isConversationExpired(id, timeout)`: Verifica se expirou

**3.3. formatters.ts** (217 linhas)
- `formatTimestamp(date)`: "14:35", "Ontem às 09:20", "Segunda às 10:00"
- `formatDuration(seconds)`: "1m 30s"
- `formatFileSize(bytes)`: "1.5 KB"
- `truncate(text, max)`: Trunca com "..."
- `formatMessageCount(count)`: "1.5K"
- `formatQualificationScore(score)`: Retorna value, color, label
- `formatUrgency(urgency)`: Retorna label, color, icon
- `sanitizeFilename(name)`: Remove caracteres inválidos
- `getFileType(filename)`: Detecta tipo (image/document/audio/video/other)
- `formatList(items)`: "A, B e C"

**3.4. index.ts**: Barrel export de todos os utils

**Benefício**: Funções reutilizáveis em todos os componentes

---

#### 4. Componentes Auxiliares

**4.1. QualificationProgress.tsx** (68 linhas)

**Features**:
- Barra de progresso visual (Progress component)
- Mostra perguntas respondidas / total
- Badge "Qualificado" (verde com CheckCircle2)
- Badge de score com cor dinâmica
- Badge de flags (vermelho com AlertTriangle)
- Lista de flags expandida

**Props**:
```typescript
{
  data: QualificationData
  className?: string
}
```

**Uso**: Exclusivo para modo agent-flow

**Benefício**: Componente reutilizável extraído do AgentFlowChatWidget

---

### Estrutura de Diretórios Criada

```
src/
├── types/
│   └── chat.ts                     ⭐ NOVO (296 linhas)
├── constants/
│   └── chat-states.ts              ⭐ NOVO (175 linhas)
├── lib/
│   └── chat/
│       ├── parseMarkdown.ts        ⭐ NOVO (92 linhas)
│       ├── conversationId.ts       ⭐ NOVO (75 linhas)
│       ├── formatters.ts           ⭐ NOVO (217 linhas)
│       └── index.ts                ⭐ NOVO (6 linhas)
└── components/
    └── chat/
        └── components/
            └── QualificationProgress.tsx  ⭐ NOVO (68 linhas)
```

**Total**: 7 arquivos, 929 linhas

---

## 📊 Progresso Geral

### Fase 1 - Preparação ✅
- [x] Criar types/chat.ts com interfaces unificadas
- [x] Criar constants/chat-states.ts com mapeamento de estados
- [x] Criar utils de chat (parseMarkdown, conversationId, formatters)
- [x] Extrair componente QualificationProgress
- [x] Commit e documentação

**Status**: COMPLETA ✅

---

### Fase 2 - Implementação ⏳
- [ ] Extrair componente MessageBubble
- [ ] Extrair componente ChatHeader
- [ ] Extrair componente ChatInput
- [ ] Criar UnifiedChatAssistant.tsx (base)
- [ ] Adicionar modo 'chat'
- [ ] Adicionar modo 'agent-flow'
- [ ] Adicionar modo 'realtime-voice'
- [ ] Implementar adaptadores de API
- [ ] Sistema de features flags

**Estimativa**: 3-4 dias

---

### Fase 3 - Testes ⏸️
- [ ] Teste modo chat
- [ ] Teste modo agent-flow
- [ ] Teste modo realtime-voice
- [ ] Teste de integração
- [ ] Teste de acessibilidade

**Estimativa**: 2-3 dias

---

### Fase 4 - Migração ⏸️
- [ ] Criar aliases no barrel export
- [ ] Migrar ProductPageTemplate.tsx
- [ ] Migrar FloatingContactHub.tsx
- [ ] Migrar demo/agent-chat/page.tsx
- [ ] Testes em produção

**Estimativa**: 1-2 dias

---

### Fase 5 - Deprecação ⏸️
- [ ] Renomear arquivos antigos (.deprecated.tsx)
- [ ] Atualizar documentação
- [ ] Remover imports antigos
- [ ] Deploy final

**Estimativa**: 1 dia

---

## 🎯 Próximos Passos Imediatos

### 1. Extrair MessageBubble Component
Criar `src/components/chat/components/MessageBubble.tsx`:
- Renderiza bolha de mensagem (user/assistant/system)
- Avatar
- Timestamp
- Markdown parsing
- VoicePlayer (se TTS enabled)
- Props configuráveis

### 2. Extrair ChatHeader Component
Criar `src/components/chat/components/ChatHeader.tsx`:
- Nome do produto
- Estado atual (se agent-flow)
- Botões: Settings, Clear History, Video Mode, Close
- Status indicator (realtime-voice)

### 3. Extrair ChatInput Component
Criar `src/components/chat/components/ChatInput.tsx`:
- Input text area
- Botões: Attach, AudioRecorder, Send
- Preview de arquivos
- Loading indicator

### 4. Criar UnifiedChatAssistant.tsx
Componente principal que:
- Usa MessageBubble, ChatHeader, ChatInput
- Gerencia estado unificado
- Implementa adapter pattern para APIs
- Suporta 3 modos (chat, agent-flow, realtime-voice)
- Sistema de features flags

---

## 📝 Decisões de Arquitetura

### 1. Adapter Pattern para APIs
```typescript
const apiConfig = {
  'chat': {
    url: '/api/chat/assistant',
    payload: { productId, message, history }
  },
  'agent-flow': {
    url: '/api/chat/agent-flow',
    payload: { conversationId, message, channel }
  }
}
```

**Vantagem**: Suporta múltiplos backends sem duplicar código

---

### 2. Features Flags
```typescript
features: {
  fileUpload: boolean
  audioRecording: boolean
  textToSpeech: boolean
  videoMode: boolean
  qualificationTracking: boolean
}
```

**Vantagem**: Componentes podem ter features ligadas/desligadas

---

### 3. Lazy Loading de Realtime API
```typescript
const realtimeAPI = mode === 'realtime-voice'
  ? useRealtimeAPI(productId)
  : null
```

**Vantagem**: Bundle size menor quando não usa realtime

---

### 4. Componentes Modulares
- MessageBubble: Reutilizável
- ChatHeader: Configurável
- ChatInput: Composição de AudioRecorder + file upload

**Vantagem**: Fácil testar e manter

---

## 🔍 Análise de Impacto

### Redução de Código (Estimada)

**Atual**:
- ChatAssistant.tsx: 673 linhas
- EnhancedChatAssistant.tsx: 489 linhas
- AgentFlowChatWidget.tsx: 457 linhas
- RealtimeVoiceAssistant.tsx: 290 linhas
- **Total**: 1909 linhas

**Após Consolidação** (estimado):
- UnifiedChatAssistant.tsx: ~500 linhas
- MessageBubble.tsx: ~80 linhas
- ChatHeader.tsx: ~100 linhas
- ChatInput.tsx: ~120 linhas
- Infraestrutura (types, utils, constants): 929 linhas
- **Total**: ~1729 linhas

**Redução**: ~180 linhas (-9%)

**Mas o benefício real é**:
- 1 componente ao invés de 4 para manter
- Código reutilizável (utils, components)
- API consistente
- Testes centralizados

---

## 💡 Lições Aprendidas (Fase 1)

1. **Types primeiro**: Definir tipos antes facilita implementação
2. **Util functions isoladas**: parseMarkdown, formatters são reutilizáveis
3. **Constants centralizados**: 17 estados mapeados em um só lugar
4. **Componentes pequenos**: QualificationProgress é focado e testável

---

## 🚀 Próxima Sessão

**Foco**: Fase 2 - Implementação
- Criar MessageBubble, ChatHeader, ChatInput
- Começar UnifiedChatAssistant.tsx
- Implementar modo 'chat' (feature parity com ChatAssistant)

**Estimativa**: 2-3 horas de trabalho

---

**Status Geral**: 🟢 No prazo
**Bloqueios**: Nenhum
**Riscos**: Baixo (infraestrutura sólida criada)
