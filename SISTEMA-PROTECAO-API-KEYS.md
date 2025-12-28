# 🔐 Sistema de Proteção Automática de API Keys

## ✅ IMPLEMENTADO E ATIVO

Este sistema foi criado para resolver o problema recorrente de chaves de API expirando ou falhando sem aviso prévio.

---

## 🎯 O Que Este Sistema Faz

### 1. **Validação Automática**
- Valida formato das chaves (OpenAI deve começar com `sk-`, D-ID deve começar com `Basic `)
- Testa as chaves fazendo chamadas leves às APIs
- Detecta chaves expiradas ou inválidas **antes** de usá-las

### 2. **Cache Inteligente (5 minutos)**
- Armazena status de validação por 5 minutos
- Evita validar a mesma chave repetidamente
- Reduz latência e custo de requisições

### 3. **Recuperação Automática**
- Se uma requisição falhar com erro 401/403, invalida o cache
- Tenta novamente com validação forçada
- Se for timeout de rede, usa cache antigo (se disponível)

### 4. **Mensagens de Erro Claras**
- Informa exatamente qual chave está com problema
- Fornece links diretos para dashboards onde criar novas chaves
- Diferencia entre "não configurada" e "inválida/expirada"

---

## 📂 Arquitetura

### Arquivo Principal: [`src/lib/api/keys-manager.ts`](src/lib/api/keys-manager.ts)

```typescript
// Funções principais:
getOpenAIKey()      // Valida e retorna chave OpenAI
getDIDKey()         // Valida e retorna chave D-ID
invalidateKeyCache() // Força revalidação
getKeyStatus()      // Status atual do cache (debug)
validateAllKeys()   // Valida todas as chaves
withValidKey()      // Middleware com retry automático
```

### Integração nos Endpoints

Todos os endpoints de API agora usam o keys-manager:

#### ✅ OpenAI Endpoints
- [`/api/realtime/session`](src/app/api/realtime/session/route.ts)
- [`/api/diagnostic/openai`](src/app/api/diagnostic/openai/route.ts)

#### ✅ D-ID Endpoints
- [`/api/did/create-session`](src/app/api/did/create-session/route.ts)
- [`/api/did/talk`](src/app/api/did/talk/route.ts)
- [`/api/diagnostic/did`](src/app/api/diagnostic/did/route.ts)

---

## 🔄 Como Funciona (Fluxo)

### Chamada de API (Exemplo: `/api/realtime/session`)

```
1. Endpoint chama: await getOpenAIKey()
   ↓
2. Keys Manager verifica cache
   ↓
   ├─ Cache válido (< 5 min) → Retorna chave imediatamente ✅
   │
   └─ Cache expirado/inválido → Faz validação
      ↓
      ├─ Valida formato (sk-...)
      ├─ Testa com API OpenAI (GET /v1/models)
      ├─ Timeout? → Usa cache antigo (se disponível)
      │
      └─ Erro 401? → Lança erro com instruções claras ❌
         "OPENAI_API_KEY inválida. Crie uma nova em https://platform.openai.com/api-keys"
```

### D-ID Similar
```
getDIDKey() → Valida formato (Basic ...) → Testa com /credits → Cache/Erro
```

---

## 🧪 Como Testar

### 1. Teste Diagnóstico Completo
```bash
bash check-chat.sh
```

Resultado esperado (ANTES de configurar as chaves):
```
❌ OpenAI API com erro
   Erro: OPENAI_API_KEY inválida. Crie uma nova em https://platform.openai.com/api-keys

❌ D-ID API com erro
   Erro: DID_API_KEY não configurada. Configure em .env.local
```

### 2. Teste Manual via cURL

**OpenAI:**
```bash
curl http://localhost:3000/api/diagnostic/openai
```

**D-ID:**
```bash
curl http://localhost:3000/api/diagnostic/did
```

### 3. Teste de Cache (Performance)

Execute o mesmo endpoint 2 vezes seguidas:
```bash
time curl http://localhost:3000/api/diagnostic/openai
time curl http://localhost:3000/api/diagnostic/openai
```

A segunda deve ser **mais rápida** (usa cache).

---

## 🛠️ Configuração das Chaves

### Para Funcionar Corretamente:

#### 1. OpenAI
```bash
# .env.local
OPENAI_API_KEY="sk-proj-NOVA_CHAVE_AQUI"
```

**Como obter:**
1. Acesse: https://platform.openai.com/api-keys
2. Clique em "Create new secret key"
3. Copie a chave completa (começa com `sk-proj-`)
4. Cole no `.env.local`

#### 2. D-ID
```bash
# .env.local
DID_API_KEY="Basic SUA_CHAVE_BASE64_AQUI"
```

**Como obter:**
1. Acesse: https://studio.d-id.com/account/api-keys
2. Copie a API Key (já vem com prefixo `Basic `)
3. Cole no `.env.local`

#### 3. Reiniciar Servidor
```bash
# Parar servidor (Ctrl+C)
npm run dev
```

---

## 📊 Monitoramento e Debug

### Ver Status do Cache (Console do Servidor)

O keys-manager imprime logs quando:
- Usa cache (timeout na validação)
- Detecta chave inválida
- Atualiza o cache

```
[Keys Manager] Usando cache OpenAI (timeout na validação)
```

### Invalidar Cache Manualmente

Se você trocar a chave no `.env.local`, pode forçar revalidação:

```typescript
import { invalidateKeyCache } from '@/lib/api/keys-manager'

// Invalida cache OpenAI
invalidateKeyCache('openai')

// Invalida cache D-ID
invalidateKeyCache('did')
```

Ou simplesmente **reinicie o servidor** (`npm run dev`).

---

## 🚨 Mensagens de Erro e Soluções

### Erro 1: "OPENAI_API_KEY inválida"
**Causa:** Chave expirada, revogada ou incorreta

**Solução:**
1. Acesse https://platform.openai.com/api-keys
2. **REVOGUE** a chave antiga
3. Crie uma **NOVA** chave
4. Atualize no `.env.local`
5. Reinicie o servidor

### Erro 2: "DID_API_KEY não configurada"
**Causa:** Variável não existe no `.env.local`

**Solução:**
1. Acesse https://studio.d-id.com/account/api-keys
2. Copie a chave (formato: `Basic ...`)
3. Adicione no `.env.local`: `DID_API_KEY="Basic ..."`
4. Reinicie o servidor

### Erro 3: "DID_API_KEY deve começar com 'Basic '"
**Causa:** Formato incorreto da chave

**Solução:**
Certifique-se de que a chave no `.env.local` tem o prefixo:
```bash
# ERRADO
DID_API_KEY="bW9lbDEyMzQ1Njc4OQ=="

# CORRETO
DID_API_KEY="Basic bW9lbDEyMzQ1Njc4OQ=="
```

### Erro 4: "Usando cache OpenAI (timeout na validação)"
**Causa:** Rede lenta ou instável

**Ação:** Nenhuma - sistema está usando cache válido como fallback. Isso é **normal e esperado** em redes lentas.

---

## ✨ Benefícios

### Antes (Sem Proteção)
❌ Chaves expiravam sem aviso
❌ Erros genéricos difíceis de debugar
❌ Validação apenas em runtime (muito tarde)
❌ Sem cache → requisições lentas

### Depois (Com Proteção)
✅ Validação automática antes de usar
✅ Mensagens claras com links de solução
✅ Cache de 5 minutos → melhor performance
✅ Retry automático em falhas temporárias
✅ Degradação graciosa (usa cache se rede falha)

---

## 🔒 Segurança

- Chaves **NUNCA** são expostas em logs
- Validação usa endpoints leves (não gasta créditos)
- Timeout de 5s para evitar travamentos
- Cache em memória (não persiste em disco)
- Formato validado antes de enviar para APIs externas

---

## 📝 Checklist de Verificação

Após configurar as chaves, execute:

- [ ] `bash check-chat.sh` → Todos os 6 testes passam?
- [ ] `/api/diagnostic/openai` → Retorna `status: "success"`?
- [ ] `/api/diagnostic/did` → Retorna `status: "success"`?
- [ ] Abrir DevTools (F12) → Sem erros de API no console?
- [ ] Testar chat no navegador → Funciona?

Se todos ✅, o sistema está **100% funcional**.

---

## 🎉 Resultado Final

Agora você tem um sistema que:

1. **Detecta problemas antes** que afetem o usuário
2. **Informa claramente** como resolver
3. **Se recupera automaticamente** de falhas temporárias
4. **Performa melhor** com cache inteligente

**Nunca mais** precisará "descobrir" que uma chave expirou debugando erros genéricos! 🚀

---

## 📞 Suporte

Se após seguir esta documentação o problema persistir:

1. Execute `bash check-chat.sh` e capture a saída completa
2. Verifique logs do servidor (terminal onde roda `npm run dev`)
3. Verifique `.env.local` tem AMBAS as chaves configuradas
4. Confirme que reiniciou o servidor após alterar `.env.local`

---

_Sistema implementado em 2025-12-28 para resolver problemas recorrentes de API keys._
_Arquivos modificados: 5 API routes + 1 novo arquivo (keys-manager.ts)_
