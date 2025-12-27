# 🔴 BLOQUEADOR: OpenAI API Key Inválida

**Data**: 27/12/2025 16:00
**Prioridade**: 🔴 P0 CRÍTICO
**Status**: ⏳ BLOQUEANDO TESTES

---

## 🚨 PROBLEMA

### Erro em Produção:
```
401 Incorrect API key provided: sk-svcac***...KQwA
You can find your API key at https://platform.openai.com/account/api-keys
```

### Endpoint Afetado:
- `/api/ai/chat` - Todos os 5 agents IA
- `/api/chat/assistant` - Chat assistant
- `/api/chat/text-to-speech` - TTS
- `/api/chat/transcribe` - Whisper

### Impact:
- ❌ **Agents IA não funcionam** em produção
- ❌ **Chat com voz não funciona**
- ❌ **Qualificação automática bloqueada**
- ❌ **State Machine pode falhar** (usa OpenAI)

---

## 🔍 DIAGNÓSTICO

### Key Atual:
```
OPENAI_API_KEY=sk-svcacct-***REDACTED***
```
**Nota**: Key atual é inválida/expirada

### Problemas Identificados:
1. **Key pode estar expirada** - Service account keys podem expirar
2. **Formato correto** - Key foi corrigida (removido `\n`)
3. **Vercel configurado** - Env var atualizada em production
4. **Redeploy feito** - Deploy completo executado

### Testes Realizados:
1. ✅ Endpoint `/api/ai/chat` responde (200 OK)
2. ✅ Lista 8 agents disponíveis
3. ❌ POST com mensagem retorna 401

---

## ✅ SOLUÇÃO

### Opção 1: Gerar Nova Service Account Key (RECOMENDADO)

1. Acessar: https://platform.openai.com/api-keys
2. Criar nova Service Account key
3. Copiar key completa (sk-svcacct-...)
4. Atualizar no Vercel:
   ```bash
   echo "NEW_KEY_HERE" | vercel env add OPENAI_API_KEY production --force
   echo "NEW_KEY_HERE" | vercel env add NEXT_PUBLIC_OPENAI_API_KEY production --force
   vercel --prod --yes
   ```

### Opção 2: Usar User API Key (Temporário)

1. Acessar: https://platform.openai.com/api-keys
2. Criar nova User key (sk-proj-...)
3. Seguir mesmo processo acima

### Opção 3: Usar Groq como Fallback (Alternativa)

O sistema já suporta Groq como fallback:
```bash
echo "GROQ_KEY_HERE" | vercel env add GROQ_API_KEY production --force
vercel --prod --yes
```

**Nota**: Groq é mais rápido mas tem modelos limitados

---

## 📋 CHECKLIST DE VALIDAÇÃO

Após obter nova key:

- [ ] Atualizar `OPENAI_API_KEY` no Vercel
- [ ] Atualizar `NEXT_PUBLIC_OPENAI_API_KEY` no Vercel
- [ ] Fazer redeploy: `vercel --prod --yes`
- [ ] Aguardar 1-2 minutos
- [ ] Testar endpoint:
  ```bash
  curl -X POST https://garcezpalha.com/api/ai/chat \
    -H "Content-Type: application/json" \
    -d '{"message":"teste","productId":"test"}'
  ```
- [ ] Verificar que resposta não contém erro 401
- [ ] Testar 5 agents verticais
- [ ] Testar chat com voz (TTS)
- [ ] Testar State Machine

---

## 🎯 TAREFAS BLOQUEADAS

### P0 - Bloqueadas até resolver:
1. ❌ Testar 5 agents em produção (BLOQUEADO)
2. ❌ Validar Orchestrator (BLOQUEADO)
3. ❌ Testar State Machine (BLOQUEADO)
4. ❌ Fluxo Triagem completo (BLOQUEADO)

### Pode continuar:
1. ✅ Validar pagamentos (Stripe + MercadoPago)
2. ✅ Configurar webhooks externos
3. ✅ Implementar notificação admin
4. ✅ Templates de contrato

---

## ⏱️ TEMPO ESTIMADO

- **Obter nova key**: 5 minutos
- **Atualizar Vercel**: 2 minutos
- **Redeploy**: 2 minutos
- **Testar validação**: 5 minutos
- **Total**: ~15 minutos

---

## 📊 WORKAROUND TEMPORÁRIO

Enquanto não resolver:

### Testar localmente:
```bash
# Com key válida em .env.local
npm run dev
# Testar em http://localhost:3000
```

### Usar Groq:
- Groq não requer pagamento
- Modelos: llama-3.3-70b-versatile, mixtral-8x7b
- Mais rápido mas menos preciso que GPT-4

---

## 🔗 LINKS ÚTEIS

- OpenAI API Keys: https://platform.openai.com/api-keys
- OpenAI Docs: https://platform.openai.com/docs
- Groq Console: https://console.groq.com/keys
- Vercel Env Vars: https://vercel.com/leopalhas-projects/garcezpalha/settings/environment-variables

---

**Status**: ⏳ AGUARDANDO RESOLUÇÃO
**Bloqueio**: CRÍTICO (sem IA, sem negócio)
**Prioridade**: 🔴 P0 - RESOLVER AGORA

*Última atualização: 27/12/2025 16:00*
