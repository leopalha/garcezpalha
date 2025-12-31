# ✅ QUICK TEST CHECKLIST - Chat Assistant

**Tempo estimado:** 15-20 minutos
**Objetivo:** Validar funcionalidades críticas do Chat Assistant

---

## 🚀 PREPARAÇÃO (2 min)

1. **Iniciar servidor:**
   ```bash
   npm run dev
   ```

2. **Aguardar compilação:**
   - Esperar até ver: `✓ Ready in X.Xs`
   - Servidor em: `http://localhost:3000`

---

## ✅ TESTE 1: Página Demo Carrega (2 min)

**URL:** `http://localhost:3000/demo/agent-chat`

**Checklist:**
- [ ] Página carrega sem erro 500
- [ ] Não há erros no console do browser (F12)
- [ ] Botão flutuante de chat aparece
- [ ] Hero section com título "Teste o Assistente Virtual" aparece

**❌ Se falhar:**
- Verificar terminal do servidor para erro específico
- Verificar se variáveis de ambiente estão setadas (.env.local)

---

## ✅ TESTE 2: Chat Abre e Fecha (1 min)

**Passos:**
1. Clicar no botão flutuante azul (canto inferior direito)
2. Chat deve abrir com animação
3. Clicar no X no canto superior direito
4. Chat deve fechar

**Checklist:**
- [ ] Botão flutuante responde ao clique
- [ ] Chat abre suavemente (animação Framer Motion)
- [ ] Header mostra "Desbloqueio de Conta Bancária"
- [ ] Mensagem inicial aparece: "Olá! Como posso ajudar você hoje?"
- [ ] Botão X fecha o chat

---

## ✅ TESTE 3: Enviar Mensagem de Texto (3 min)

**Passos:**
1. Abrir chat
2. Digitar: "Olá, meu nome é João Silva"
3. Clicar em enviar (ou Enter)

**Checklist:**
- [ ] Input aceita texto
- [ ] Mensagem aparece como "user" (bolha azul à direita)
- [ ] Indicador de "digitando..." aparece
- [ ] Resposta do assistente chega em < 3s
- [ ] Resposta aparece como "assistant" (bolha cinza à esquerda)
- [ ] Scroll automático para última mensagem

**Resposta esperada:**
> "Olá João Silva! Prazer em conhecê-lo. Vejo que você está interessado em desbloquear sua conta bancária..."

---

## ✅ TESTE 4: Qualificação de Lead (5 min)

**Conversa completa:**
```
Você: Olá, meu nome é João Silva
Bot: [Resposta de saudação]

Você: Meu CPF é 123.456.789-00 e meu email é joao@email.com
Bot: [Solicita mais informações]

Você: Minha conta foi bloqueada há 3 dias sem motivo
Bot: [Classifica o problema]

Você: Banco Bradesco, agência 1234, conta 56789-0
Bot: [Qualifica e pode solicitar documentos]
```

**Checklist:**
- [ ] Bot faz perguntas sequenciais
- [ ] Bot entende contexto (não repete perguntas respondidas)
- [ ] Bot classifica o serviço corretamente
- [ ] Barra de progresso de qualificação aparece (se score >= 60)
- [ ] Se score >= 80, deve aparecer mensagem de escalação

---

## ✅ TESTE 5: Estado da Conversação (2 min)

**Abrir DevTools (F12) → Console:**

Digitar:
```javascript
// Ver estado atual da conversação
localStorage.getItem('chat-conversation-id')
```

**Checklist:**
- [ ] Conversation ID é gerado (formato: website_timestamp)
- [ ] Estado persiste ao recarregar página (F5)
- [ ] Mensagens anteriores são restauradas

---

## ✅ TESTE 6: Limpar Histórico (1 min)

**Passos:**
1. No chat aberto, clicar no ícone de configurações (⚙️) ou limpar
2. Confirmar limpeza

**Checklist:**
- [ ] Popup de confirmação aparece
- [ ] Ao confirmar, todas mensagens são removidas
- [ ] Chat volta ao estado inicial
- [ ] Nova conversa pode ser iniciada

---

## ✅ TESTE 7: Múltiplos Produtos (3 min)

**URLs para testar:**

1. **BPC/LOAS:** `http://localhost:3000/saude/bpc-loas`
   - [ ] Chat Assistant aparece
   - [ ] Título correto: "BPC/LOAS"

2. **Plano de Saúde:** `http://localhost:3000/saude/plano-saude-negou`
   - [ ] Chat Assistant aparece
   - [ ] Título correto: "Plano de Saúde Negou"

3. **Usucapião:** `http://localhost:3000/patrimonial/usucapiao`
   - [ ] Chat Assistant aparece
   - [ ] Título correto: "Usucapião"

**Checklist:**
- [ ] Cada página tem chat com produto correto
- [ ] Bot contextualiza respostas para o produto específico
- [ ] Agente especializado é selecionado (verificar no console)

---

## ⚠️ TESTES OPCIONAIS (Se tempo disponível)

### OPCIONAL 1: Upload de Arquivo (3 min)

**Requer:** `features.fileUpload: true` no ChatAssistant

1. Clicar no ícone de clipe de papel
2. Selecionar um arquivo PDF ou imagem
3. Enviar

**Checklist:**
- [ ] Input de arquivo abre
- [ ] Preview do arquivo aparece
- [ ] Arquivo é enviado junto com mensagem
- [ ] Bot confirma recebimento

### OPCIONAL 2: Gravação de Áudio (3 min)

**Requer:** `features.audioRecording: true` no ChatAssistant

1. Clicar no ícone de microfone
2. Permitir acesso ao microfone
3. Gravar 5 segundos
4. Enviar

**Checklist:**
- [ ] Permissão de microfone solicitada
- [ ] Indicador de gravação aparece
- [ ] Forma de onda visualizada
- [ ] Áudio é transcrito para texto
- [ ] Bot responde ao conteúdo transcrito

---

## 🐛 PROBLEMAS COMUNS & SOLUÇÕES

### ❌ Erro 500 ao carregar página
**Solução:**
- Verificar logs do servidor (terminal)
- Confirmar .env.local tem todas variáveis
- Restartar servidor: Ctrl+C → npm run dev

### ❌ Bot não responde
**Solução:**
- Verificar OPENAI_API_KEY no .env.local
- Verificar quota da API OpenAI
- Verificar Network tab (F12) para erro de API

### ❌ "Conversation not found"
**Solução:**
- Limpar localStorage: F12 → Console → `localStorage.clear()`
- Recarregar página

### ❌ Chat não abre
**Solução:**
- Verificar console para erros JavaScript
- Verificar se Framer Motion está instalado: `npm ls framer-motion`
- Limpar cache do browser: Ctrl+Shift+Del

---

## ✅ CRITÉRIOS DE SUCESSO

**Sistema está OK se:**
- ✅ 5/7 testes básicos passam
- ✅ Bot responde em < 3 segundos
- ✅ Sem erros 500 ou console errors
- ✅ Qualificação de lead funciona
- ✅ Estado persiste entre reloads

**Sistema precisa de atenção se:**
- ⚠️ Latência > 5 segundos
- ⚠️ Erros intermitentes no console
- ⚠️ Bot não contextualiza por produto

**BLOCKER se:**
- 🔴 Página não carrega (erro 500)
- 🔴 Bot nunca responde
- 🔴 Erro crítico no console

---

## 📊 RELATÓRIO RÁPIDO

Após completar os testes, preencha:

```
Data: ___/___/2024
Testes passando: ___/7
Latência média: ___s
Bugs encontrados: ___
Status: [ ] OK  [ ] Atenção  [ ] Blocker
```

**Próximo passo se OK:**
- ✅ Marcar TESTE 2 como completo
- ✅ Prosseguir para TESTE 3 (Sentry)

**Se houver bugs:**
- 🐛 Reportar bugs encontrados
- 🔧 Priorizar correções antes de Sentry

---

**Criado por:** MANUS v7.0 QA System
**Baseado em:** CHAT_ASSISTANT_TEST_PLAN.md
**Tempo total:** ~15-20 min
