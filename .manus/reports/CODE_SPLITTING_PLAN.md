# PLANO DE CODE SPLITTING - AGENT CHAT
**Data:** 29/12/2025
**Tarefa:** P1 - Code Splitting Agent Chat 198KB → 120KB
**Impacto:** Performance Score +0.5 pontos

---

## 🎯 OBJETIVO

Reduzir bundle size do Agent Chat de **198KB → 120KB** (38% redução) através de:
1. Dynamic imports para componentes pesados
2. Lazy loading de funcionalidades opcionais
3. Tree shaking de dependências não usadas

---

## 📊 ANÁLISE ATUAL

### Componentes Chat (por tamanho)
```
ChatAssistant.original.tsx      24KB (deprecated)
EnhancedChatAssistant.deprecated 17KB (deprecated)
AgentFlowChatWidget.deprecated   15KB (deprecated)
ChatAssistant.tsx                12KB ← ATIVO
RealtimeVoiceAssistant.tsx       11KB ← ATIVO
ChatSettings.tsx                 8.3KB
VoicePlayer.tsx                  6.3KB
AudioRecorder.tsx                6.3KB
FloatingContactHub.tsx           5.5KB
```

**Total Deprecated:** 56KB (pode ser deletado)
**Total Ativo:** ~50KB

---

## ✅ AÇÕES RECOMENDADAS

### AÇÃO 1: Deletar Arquivos Deprecated (Alta Prioridade)
```bash
# Liberar 56KB imediatamente
rm src/components/chat/ChatAssistant.original.tsx
rm src/components/chat/EnhancedChatAssistant.deprecated.tsx
rm src/components/chat/AgentFlowChatWidget.deprecated.tsx
```

**Impacto:** -56KB bundle size ✅

### AÇÃO 2: Dynamic Import - RealtimeVoiceAssistant
```tsx
// src/components/chat/ChatAssistant.tsx
import dynamic from 'next/dynamic';

// ANTES
import { RealtimeVoiceAssistant } from './RealtimeVoiceAssistant';

// DEPOIS (lazy load apenas quando ativado)
const RealtimeVoiceAssistant = dynamic(
  () => import('./RealtimeVoiceAssistant'),
  {
    loading: () => <LoadingSpinner />,
    ssr: false, // não renderizar no servidor
  }
);
```

**Impacto:** -11KB do bundle inicial ✅

### AÇÃO 3: Code Split por Modo
```tsx
// src/components/chat/index.ts
import dynamic from 'next/dynamic';

// Lazy load por modo de chat
export const ChatAssistant = dynamic(() => import('./ChatAssistant'));
export const VoiceAssistant = dynamic(() => import('./RealtimeVoiceAssistant'));
export const AgentFlow = dynamic(() => import('./AgentFlowChat'));

// Componentes leves carregados normalmente
export { FloatingContactHub } from './FloatingContactHub';
export { ChatSettings } from './ChatSettings';
```

**Impacto:** Bundle dividido em chunks ✅

### AÇÃO 4: Tree Shaking - Revisar Imports
```tsx
// ANTES (importa tudo)
import * as Icons from 'lucide-react';

// DEPOIS (importa apenas o necessário)
import { MessageCircle, Send, Mic } from 'lucide-react';
```

**Impacto:** -5-10KB dependências não usadas ✅

### AÇÃO 5: Audio Recorder Opcional
```tsx
// src/components/chat/components/ChatInput.tsx
import dynamic from 'next/dynamic';

const AudioRecorder = dynamic(
  () => import('../AudioRecorder'),
  {
    loading: () => <MicIcon className="animate-pulse" />,
    ssr: false,
  }
);

// Só carrega quando usuário clica no botão de microfone
{isRecording && <AudioRecorder />}
```

**Impacto:** -6.3KB do bundle inicial ✅

---

## 📋 IMPLEMENTAÇÃO PASSO A PASSO

### PASSO 1: Limpar Arquivos Deprecated (5min)
```bash
cd d:\garcezpalha\src\components\chat

# Verificar se não há importações
grep -r "ChatAssistant.original" ../ --include="*.tsx"
grep -r "EnhancedChatAssistant.deprecated" ../ --include="*.tsx"
grep -r "AgentFlowChatWidget.deprecated" ../ --include="*.tsx"

# Se nenhuma importação, deletar
rm ChatAssistant.original.tsx
rm EnhancedChatAssistant.deprecated.tsx
rm AgentFlowChatWidget.deprecated.tsx

# Commit
git add .
git commit -m "chore: remove deprecated chat components (-56KB)"
```

### PASSO 2: Implementar Dynamic Imports (30min)
```tsx
// src/components/chat/ChatAssistant.tsx
import dynamic from 'next/dynamic';
import { useState } from 'react';

// Lazy load componentes pesados
const RealtimeVoiceAssistant = dynamic(
  () => import('./RealtimeVoiceAssistant'),
  { ssr: false }
);

const AudioRecorder = dynamic(
  () => import('./AudioRecorder'),
  { ssr: false }
);

export function ChatAssistant() {
  const [mode, setMode] = useState<'text' | 'voice'>('text');
  const [isRecording, setIsRecording] = useState(false);

  return (
    <div>
      {mode === 'text' && <TextChat />}
      {mode === 'voice' && <RealtimeVoiceAssistant />}
      {isRecording && <AudioRecorder />}
    </div>
  );
}
```

### PASSO 3: Atualizar next.config.js (10min)
```javascript
// next.config.js
module.exports = {
  webpack: (config, { isServer }) => {
    // Enable tree shaking
    config.optimization = {
      ...config.optimization,
      usedExports: true,
      sideEffects: false,
    };

    // Split chunks
    if (!isServer) {
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          chat: {
            name: 'chat',
            test: /[\\/]src[\\/]components[\\/]chat[\\/]/,
            priority: 10,
          },
        },
      };
    }

    return config;
  },
};
```

### PASSO 4: Teste de Bundle Size (10min)
```bash
# Build de produção
npm run build

# Analisar bundle
npx @next/bundle-analyzer

# Verificar tamanho do chunk 'chat'
# Meta: <120KB
```

---

## 📊 IMPACTO ESPERADO

### Bundle Size
| Componente | Antes | Depois | Redução |
|-----------|-------|--------|---------|
| **Deprecated files** | 56KB | 0KB | **-100%** ✅ |
| **Initial bundle** | 198KB | 95KB | **-52%** ✅ |
| **Voice Assistant** | 11KB inline | 11KB lazy | **0KB inicial** ✅ |
| **Audio Recorder** | 6.3KB inline | 6.3KB lazy | **0KB inicial** ✅ |
| **Total Final** | 198KB | **~120KB** | **-39%** ✅ |

### Performance
- **First Load JS:** 198KB → 120KB (-39%)
- **Time to Interactive:** -0.3s
- **Performance Score:** +0.5 pontos

---

## ✅ CHECKLIST

### Fase 1: Limpeza (5min)
- [ ] Verificar imports de arquivos deprecated
- [ ] Deletar ChatAssistant.original.tsx
- [ ] Deletar EnhancedChatAssistant.deprecated.tsx
- [ ] Deletar AgentFlowChatWidget.deprecated.tsx
- [ ] Commit: `chore: remove deprecated chat components`

### Fase 2: Dynamic Imports (30min)
- [ ] Implementar dynamic import RealtimeVoiceAssistant
- [ ] Implementar dynamic import AudioRecorder
- [ ] Adicionar loading states
- [ ] Testar funcionalidade em dev
- [ ] Commit: `perf: lazy load chat components`

### Fase 3: Configuração (10min)
- [ ] Atualizar next.config.js (splitChunks)
- [ ] Configurar tree shaking
- [ ] Build de teste

### Fase 4: Validação (15min)
- [ ] Executar `npm run build`
- [ ] Analisar bundle com @next/bundle-analyzer
- [ ] Verificar chunk 'chat' <120KB
- [ ] Testar em produção
- [ ] Lighthouse audit

---

## 🎯 CRITÉRIOS DE SUCESSO

✅ **Bundle inicial chat:** <120KB
✅ **Deprecated files:** Deletados (0KB)
✅ **Lazy loading:** Voice + Audio funcionando
✅ **Build sem erros:** OK
✅ **Funcionalidade:** 100% preservada

---

**Status:** PRONTO PARA EXECUÇÃO
**Prioridade:** P1 (ALTA)
**Tempo Estimado:** 1h
**Bloqueadores:** Nenhum
