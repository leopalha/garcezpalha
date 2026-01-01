# 🎯 PLANO DE TESTES - CHAT ASSISTANT

**Data:** 31/12/2024
**Objetivo:** Validar funcionamento completo do Chat Assistant como "ligação telefônica" antes de integrar WhatsApp
**Prioridade:** P0 - Blocker para WhatsApp

---

## 📋 VISÃO GERAL

O Chat Assistant possui **3 modos** de operação:

1. **`chat`** - Chat tradicional (texto + arquivos + áudio)
2. **`agent-flow`** - Qualificação de leads com state machine (17 estados)
3. **`realtime-voice`** - Voz em tempo real (OpenAI Realtime API) **← FOCO PRINCIPAL**

**Meta:** Fazer o modo `realtime-voice` funcionar 100% como uma ligação telefônica com agentes IA.

---

## 🎤 MODO REALTIME-VOICE (Prioridade P0)

### Componente: `RealtimeVoiceAssistant.tsx`

#### ✅ **Checklist de Funcionalidades**

**Conexão & Áudio:**
- [ ] Conecta com OpenAI Realtime API
- [ ] Ativa microfone do usuário
- [ ] Transmite áudio em tempo real
- [ ] Recebe resposta de voz do assistente
- [ ] Avatar visual com lip sync (D-ID)

**Conversação:**
- [ ] Usuário fala, assistente escuta
- [ ] Assistente responde por voz naturalmente
- [ ] Suporta interrupções (usuário pode cortar assistente)
- [ ] Transcrição em tempo real (texto aparece na tela)
- [ ] Latência baixa (< 1s)

**Agentes Especializados:**
- [ ] Identifica qual agente legal usar (baseado no contexto)
- [ ] Chama agente especializado (ex: fraude-consignado, desbloqueio-conta)
- [ ] Agente retorna informações estruturadas
- [ ] Assistente fala as informações de forma natural

**Qualificação de Leads:**
- [ ] Coleta nome, telefone, email
- [ ] Identifica problema do cliente
- [ ] Qualifica urgência (baixa/média/alta)
- [ ] Calcula score de qualificação (0-100)
- [ ] Salva lead no Supabase

**UI/UX:**
- [ ] Botão para iniciar/parar conversa
- [ ] Indicador visual de "ouvindo" vs "falando"
- [ ] Transcrição da conversa em tempo real
- [ ] Avatar animado (optional - D-ID)
- [ ] Controles de volume

---

## 💬 MODO AGENT-FLOW (Prioridade P1)

### Componente: `ChatAssistant.tsx` (mode="agent-flow")

#### ✅ **Checklist de Funcionalidades**

**State Machine (17 Estados):**
- [ ] **greeting** - Saudação inicial
- [ ] **identifying** - Identificação do cliente (nome, contato)
- [ ] **classifying** - Classificação do problema
- [ ] **qualifying** - Qualificação detalhada
- [ ] **qualified** - Lead qualificado
- [ ] **proposing** - Proposta de serviço
- [ ] **rejected** - Lead rejeitado
- [ ] **escalated** - Escalado para humano
- [ ] **waiting_human** - Aguardando atendente
- [ ] **human** - Em atendimento humano
- [ ] **closed** - Conversa finalizada
- [ ] + 6 outros estados

**Qualificação Progressiva:**
- [ ] Barra de progresso visual
- [ ] Score aumenta conforme perguntas respondidas
- [ ] Flags de qualificação (urgente, alto valor, complexo)
- [ ] Auto-escalation para score >= 80

**Persistência:**
- [ ] Salva conversa no Supabase
- [ ] Salva estado atual
- [ ] Salva histórico de transições
- [ ] Recupera conversa em progresso

---

## 💻 MODO CHAT TRADICIONAL (Prioridade P2)

### Componente: `ChatAssistant.tsx` (mode="chat")

#### ✅ **Checklist de Funcionalidades**

**Mensagens:**
- [ ] Enviar texto
- [ ] Receber resposta do GPT-4
- [ ] Histórico de conversas
- [ ] Scroll automático

**Arquivos:**
- [ ] Upload de imagens (JPG, PNG)
- [ ] Upload de PDFs
- [ ] Upload de documentos (DOCX, TXT)
- [ ] Análise com GPT-4 Vision (imagens)
- [ ] Extração de texto (PDFs)
- [ ] Limite de 20 arquivos

**Áudio:**
- [ ] Gravar áudio (microfone)
- [ ] Transcrição com Whisper API
- [ ] Enviar como mensagem de texto
- [ ] Text-to-Speech (TTS) nas respostas
- [ ] Auto-play das respostas (opcional)

**Configurações:**
- [ ] Habilitar/desabilitar TTS
- [ ] Escolher voz (alloy, echo, fable, onyx, nova, shimmer)
- [ ] Velocidade da fala (1x, 1.5x, 2x)
- [ ] Habilitar/desabilitar microfone
- [ ] Auto-play respostas

---

## 🤖 AGENTES IA ESPECIALIZADOS (24 Total)

### Componente: `/lib/ai/agents/`

#### ✅ **Checklist por Categoria**

**Direito Bancário (5 agentes):**
- [ ] **fraude-consignado** - Análise de fraude em empréstimo consignado
- [ ] **fraude-cartao** - Fraude em cartão de crédito
- [ ] **desbloqueio-conta** - Desbloqueio de conta bancária
- [ ] **seguro-prestamista** - Contestação seguro prestamista
- [ ] **juros-abusivos** - Análise de juros abusivos

**Direito do Consumidor (4 agentes):**
- [ ] **negativacao** - Negativação indevida
- [ ] **cobranca-abusiva** - Cobrança abusiva
- [ ] **golpe-pix** - Golpe via PIX
- [ ] **danos-morais** - Cálculo de danos morais

**Direito Previdenciário (3 agentes):**
- [ ] **aposentadoria** - Elegibilidade para aposentadoria
- [ ] **benefit-calculator** - Cálculo de benefícios INSS
- [ ] **auxilio-doenca** - Análise auxílio-doença

**Direito Imobiliário (3 agentes):**
- [ ] **usucapiao** - Análise de usucapião
- [ ] **market-comparator** - Comparador de mercado imobiliário
- [ ] **regularizacao-imovel** - Regularização de imóveis

**Direito Trabalhista (2 agentes):**
- [ ] **verbas-rescisórias** - Cálculo de verbas rescisórias
- [ ] **horas-extras** - Cálculo de horas extras

**Direito Criminal (2 agentes):**
- [ ] **habeas-corpus** - Análise de cabimento de HC
- [ ] **defesa-criminal** - Estratégia de defesa

**Outros (5 agentes):**
- [ ] **plano-saude** - Contestação plano de saúde
- [ ] **inventario** - Planejamento sucessório
- [ ] **holding-familiar** - Estruturação de holding
- [ ] **pericia** - Análise pericial
- [ ] **documentos** - Análise de documentos (GPT-4 Vision)

---

## 🧪 CENÁRIOS DE TESTE

### Cenário 1: Ligação Completa (Realtime Voice)

**Fluxo:**
1. Usuário abre chat
2. Clica em "Iniciar Conversa por Voz"
3. Permite microfone
4. Diz: "Minha conta foi bloqueada injustamente"
5. Assistente responde naturalmente
6. Agente **desbloqueio-conta** é acionado
7. Assistente pergunta: banco, motivo, valor bloqueado
8. Coleta informações
9. Gera qualificação automática
10. Propõe serviço
11. Salva lead no Supabase

**Expectativa:**
- ✅ Conversa fluida como ligação telefônica
- ✅ Sem delays perceptíveis
- ✅ Transcrição precisa
- ✅ Agente identifica corretamente o problema
- ✅ Lead salvo com score >= 70

---

### Cenário 2: Qualificação com Agent-Flow

**Fluxo:**
1. Usuário abre chat (mode="agent-flow")
2. Digita: "Sofri um golpe PIX"
3. Estado muda: greeting → identifying → classifying → qualifying
4. Assistente pergunta: valor, quando aconteceu, banco
5. Score aumenta progressivamente
6. Ao atingir score >= 80, auto-escalate
7. Notificação para admin

**Expectativa:**
- ✅ Barra de progresso atualiza
- ✅ Estados transitam corretamente
- ✅ Agente **golpe-pix** identifica informações relevantes
- ✅ Auto-escalation funciona
- ✅ Conversa salva no Supabase

---

### Cenário 3: Upload de Documento (Chat Mode)

**Fluxo:**
1. Usuário abre chat (mode="chat")
2. Anexa imagem de RG
3. GPT-4 Vision analisa
4. Extrai: Nome, CPF, RG, Data de nascimento
5. Retorna informações estruturadas

**Expectativa:**
- ✅ Upload funciona
- ✅ GPT-4 Vision extrai dados corretamente
- ✅ Dados aparecem formatados no chat

---

## 📊 MÉTRICAS DE SUCESSO

### Performance:
- ⏱️ **Latência Voz:** < 1s (do usuário parar de falar até assistente começar)
- ⏱️ **Latência Texto:** < 2s (enviar mensagem → receber resposta)
- 📊 **Taxa de Transcrição:** >= 95% precisão
- 🎯 **Taxa de Qualificação:** >= 80% dos leads qualificados corretamente

### Funcionalidade:
- ✅ **100% dos 3 modos** funcionando
- ✅ **100% dos 24 agentes** respondendo
- ✅ **100% das conversas** salvas no Supabase
- ✅ **Auto-escalation** funcionando para score >= 80

### UX:
- 😊 **Satisfação:** Conversa natural, sem robótica
- 🔊 **Áudio:** Claro e sem ruídos
- 📱 **Responsivo:** Funciona em mobile e desktop
- 🎨 **UI:** Intuitiva e profissional

---

## 🚀 PLANO DE EXECUÇÃO

### Fase 1: Setup & Validação (1h)
1. Verificar variáveis de ambiente:
   - `OPENAI_API_KEY` ✅
   - `NEXT_PUBLIC_OPENAI_API_KEY` ✅
   - `DID_API_KEY` (avatar)
   - `NEXT_PUBLIC_SUPABASE_URL` ✅
   - `SUPABASE_SERVICE_ROLE_KEY` ✅

2. Rodar aplicação localmente:
   ```bash
   npm run dev
   ```

3. Acessar página de demo:
   ```
   http://localhost:3000/demo/agent-chat
   ```

### Fase 2: Testes Manuais (2-3h)
1. Testar Cenário 1 (Realtime Voice)
2. Testar Cenário 2 (Agent-Flow)
3. Testar Cenário 3 (Upload Documento)
4. Testar 5-10 agentes mais importantes
5. Verificar Supabase (conversas salvas?)

### Fase 3: Ajustes (1-2h)
1. Corrigir bugs encontrados
2. Melhorar prompts de agentes se necessário
3. Ajustar latência/performance
4. Polir UX

### Fase 4: Documentação (30min)
1. Documentar problemas encontrados
2. Listar melhorias futuras
3. Marcar como ✅ ou ⚠️ cada item do checklist

---

## 🐛 PROBLEMAS CONHECIDOS (A Investigar)

1. **Realtime API:** Pode ter delay se API estiver sobrecarregada
2. **D-ID Avatar:** Requer chave API específica (opcional)
3. **Transcrição:** Whisper pode errar nomes próprios
4. **Agentes:** Podem precisar de fine-tuning nos prompts
5. **Supabase:** RLS policies podem bloquear inserts (aplicar migration RLS)

---

## ✅ CRITÉRIOS DE ACEITAÇÃO

**Para considerar COMPLETO:**

1. ✅ Modo `realtime-voice` funciona como ligação telefônica
2. ✅ Usuário consegue falar naturalmente e assistente responde
3. ✅ Pelo menos 10 agentes IA estão respondendo corretamente
4. ✅ Conversas são salvas no Supabase
5. ✅ Auto-escalation funciona para leads qualificados
6. ✅ Latência < 2s na maioria dos casos
7. ✅ UI é intuitiva e sem bugs visuais

**Quando aprovado:** ✅ Podemos então integrar WhatsApp

---

## 📝 PRÓXIMOS PASSOS

Após Chat Assistant 100% funcional:

1. Aplicar migration RLS no Supabase
2. Testar isolamento multi-tenant
3. Deploy staging para testes
4. **Então:** Integrar WhatsApp Cloud API
5. **Então:** Implementar deduplicação de webhooks WhatsApp (SECURITY-003)

---

**Gerado por:** MANUS v7.0 Test Planning
**Data:** 31/12/2024
**Próxima Atualização:** Após testes manuais
