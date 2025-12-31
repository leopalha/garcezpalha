# 🔍 QUICK DEBUG - Erro 500 na página /demo/agent-chat

## ✅ PROBLEMA RESOLVIDO!

### Erro Observado:
```
GET http://localhost:3000/demo/agent-chat 500 (Internal Server Error)
```

### Causa Raiz Identificada:
**API Contract Mismatch** - A API `/api/chat/agent-flow` estava retornando `response` mas o frontend `apiAdapter.ts` esperava `message`.

### Solução Aplicada:
```typescript
// ANTES (src/app/api/chat/agent-flow/route.ts:22)
return NextResponse.json({
  response: result.response,  // ❌ Campo errado
  state: result.data.status.state,
  // ...
})

// DEPOIS
return NextResponse.json({
  message: result.response,  // ✅ Campo correto
  state: result.data.status.state,
  // ...
})
```

**Commit:** `6348eeb` - fix(agent-flow): Change API response field 'response' to 'message'

---

## Histórico Original - Possíveis Causas Investigadas:

### 1. **Falta de Variáveis de Ambiente**
Verificar se todas as variáveis necessárias estão configuradas:

```bash
# No terminal, rode:
npm run dev

# Se o servidor mostrar algum erro específico, copie aqui
```

**Variáveis críticas para Chat Assistant:**
- ✅ `OPENAI_API_KEY` - OpenAI API (GPT-4)
- ✅ `NEXT_PUBLIC_OPENAI_API_KEY` - OpenAI Realtime API (client-side)
- ✅ `NEXT_PUBLIC_SUPABASE_URL` - Supabase URL
- ✅ `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase Anon Key
- ⚠️ `DID_API_KEY` - D-ID Avatar (opcional)

### 2. **Import Error**
Algum componente está falhando ao importar:

```typescript
// Linha 8: import { ChatAssistant } from '@/components/chat'
```

Verificar se `ChatAssistant.tsx` existe e compila:

```bash
# Verificar se arquivo existe
ls src/components/chat/ChatAssistant.tsx

# Verificar se tem erros TypeScript
npx tsc --noEmit
```

### 3. **Dependência Faltando**
Algum pacote npm pode estar faltando:

```bash
# Reinstalar dependências
npm install

# Verificar se todas estão instaladas
npm ls framer-motion
npm ls openai
npm ls @supabase/supabase-js
```

### 4. **Server Component vs Client Component**
A página usa `'use client'` corretamente (linha 1).

Mas o `ChatAssistant` pode estar tentando usar algo server-side.

## ✅ PASSOS PARA RESOLVER:

### Passo 1: Ver o Erro Real no Terminal
No terminal onde está rodando `npm run dev`, procurar por:
- ❌ "Error:"
- ❌ "TypeError:"
- ❌ "Cannot find module"
- ❌ "undefined"

### Passo 2: Verificar Build
```bash
# Limpar build cache
rm -rf .next

# Rebuildar
npm run dev
```

### Passo 3: Testar Página Simples
Criar uma página de teste super simples para isolar o problema:

```typescript
// src/app/test-simple/page.tsx
'use client'

export default function TestPage() {
  return (
    <div>
      <h1>Test Page</h1>
      <p>Se você ver isso, Next.js está funcionando</p>
    </div>
  )
}
```

Acessar: `http://localhost:3000/test-simple`

Se funcionar → problema está no `ChatAssistant`
Se NÃO funcionar → problema está no Next.js/setup

### Passo 4: Testar ChatAssistant Isolado
```typescript
// src/app/test-chat/page.tsx
'use client'

import { ChatAssistant } from '@/components/chat'

export default function TestChatPage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl mb-4">Test Chat</h1>
      <ChatAssistant
        productId="geral"
        productName="Teste"
        mode="chat"
        autoOpen={false}
      />
    </div>
  )
}
```

Acessar: `http://localhost:3000/test-chat`

## 🐛 ERROS COMUNS:

### Erro: "Cannot find module '@/components/chat'"
**Solução:** Verificar se `tsconfig.json` tem o alias configurado:
```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

### Erro: "OpenAI API key not found"
**Solução:** Adicionar no `.env.local`:
```
OPENAI_API_KEY=sk-proj-...
NEXT_PUBLIC_OPENAI_API_KEY=sk-proj-...
```

### Erro: "Cannot use import statement outside a module"
**Solução:** Algum componente está tentando usar ESM imports incorretamente.
Verificar se todos os componentes têm extensão `.tsx` (não `.ts`).

### Erro: "Hydration failed"
**Solução:** Algum componente está renderizando diferente no servidor vs cliente.
Usar `dynamic()` import para componentes client-only:

```typescript
const ChatAssistant = dynamic(
  () => import('@/components/chat').then(mod => ({ default: mod.ChatAssistant })),
  { ssr: false }
)
```

## 📝 PRÓXIMOS PASSOS:

1. **Rodar** `npm run dev`
2. **Copiar** o erro completo do terminal
3. **Compartilhar** o erro aqui
4. **Então** podemos fazer o fix específico

---

**Criado por:** MANUS Debugging Assistant
**Data:** 31/12/2024
