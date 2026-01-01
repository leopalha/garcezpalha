# Troubleshooting - Chat com IA, Avatar e Reconhecimento de Voz

## 🔍 Problemas Identificados e Soluções

### 1. ⚠️ CRÍTICO: Autenticação D-ID API Incorreta

**Problema**: A D-ID API usa autenticação `Basic ${api_key}` mas a chave precisa estar no formato correto.

**Localização**:
- `src/app/api/did/create-session/route.ts:19`
- `src/app/api/did/talk/route.ts:19`
- `src/app/api/did/start-stream/route.ts` (similar)

**Como corrigir**:
A chave D-ID deve estar em Base64. Verifique no `.env.local`:

```bash
# ERRADO (chave não codificada)
DID_API_KEY=your-key-here

# CORRETO (precisa ser base64 de "username:password" ou já vir como base64)
DID_API_KEY=<base64_encoded_credentials>
```

Para gerar a chave correta:
```bash
echo -n "your_username:your_password" | base64
```

Ou use a chave que está no painel da D-ID (já vem codificada).

---

### 2. OpenAI Realtime API - WebSocket Headers

**Problem**: Headers do WebSocket podem estar incorretos.

**Localização**: `src/hooks/useRealtimeAPI.ts:49-50`

```typescript
// Código atual
const ws = new WebSocket(
  `wss://api.openai.com/v1/realtime?model=gpt-4o-realtime-preview-2024-12-17`,
  ['realtime', `openai-ephemeral-token.${client_secret}`.trim()]
)
```

**Verificar**:
1. O `client_secret` está vindo corretamente da API?
2. O formato do subprotocol está correto?
3. O modelo está disponível para sua conta?

---

### 3. Reconhecimento de Voz - Transcrição Incorreta

**Problema**: "ele identifica sempre algo que não falei"

**Possíveis causas**:
1. **VAD (Voice Activity Detection) muito sensível**
2. **Ruído de fundo** sendo capturado
3. **Echo cancellation** não funcionando

**Solução 1 - Ajustar VAD** (`src/app/api/realtime/session/route.ts:39-44`):
```typescript
turn_detection: {
  type: 'server_vad',
  threshold: 0.7,  // AUMENTAR de 0.5 para 0.7 (menos sensível)
  prefix_padding_ms: 300,
  silence_duration_ms: 700  // AUMENTAR de 500 para 700ms
}
```

**Solução 2 - Melhorar captura de áudio** (`src/hooks/useRealtimeAPI.ts:213-220`):
```typescript
const stream = await navigator.mediaDevices.getUserMedia({
  audio: {
    echoCancellation: true,
    noiseSuppression: true,
    autoGainControl: true,
    sampleRate: 24000,
    // ADICIONAR:
    channelCount: 1,  // Mono
    latency: 0,       // Menor latência
  }
})
```

---

### 4. Avatar D-ID - Lip Sync Não Funciona

**Problema**: Avatar não sincroniza lábios com a fala

**Verificar**:
1. A conexão WebRTC está estabelecida?
2. O stream_id está correto?
3. O texto está chegando no `useDIDAvatar.speakText()`?

**Debug**: Adicionar logs em `src/components/chat/RealtimeVoiceAssistant.tsx:132-155`:

```typescript
useEffect(() => {
  if (mode !== 'avatar' || !avatar.isConnected) {
    console.log('[DEBUG] Sync skipped - mode:', mode, 'connected:', avatar.isConnected)
    return
  }

  const lastMessage = realtime.messages[realtime.messages.length - 1]

  console.log('[DEBUG] Last message:', {
    role: lastMessage?.role,
    contentLength: lastMessage?.content?.length,
    id: lastMessage?.id,
    lastSpokenId: lastSpokenMessageIdRef.current
  })

  // ... resto do código
}, [mode, realtime.messages, avatar.isConnected, avatar])
```

---

## 🧪 Como Testar

### Teste 1: APIs Configuradas

```bash
# OpenAI
curl http://localhost:3000/api/diagnostic/openai

# D-ID
curl http://localhost:3000/api/diagnostic/did
```

**Respostas esperadas**:
```json
{
  "status": "success",
  "message": "OpenAI API is working correctly",
  "configured": true,
  "connection": "successful"
}
```

### Teste 2: Criar Sessão Realtime

```bash
curl -X POST http://localhost:3000/api/realtime/session \
  -H "Content-Type: application/json" \
  -d '{"productId":"test"}'
```

**Resposta esperada**:
```json
{
  "client_secret": "eph_xxx...",
  "expires_at": 1234567890
}
```

### Teste 3: Criar Sessão D-ID

```bash
curl -X POST http://localhost:3000/api/did/create-session \
  -H "Content-Type: application/json" \
  -d '{
    "source_url": "https://create-images-results.d-id.com/google-oauth2%7C111749261755268084846/upl_xF7eJLGPqDRXFQVUB-lH-/image.jpeg"
  }'
```

**Resposta esperada**:
```json
{
  "id": "str-xxx",
  "stream_id": "str-xxx",
  "offer": { "type": "offer", "sdp": "..." },
  "ice_servers": [...]
}
```

---

## 🔧 Checklist de Diagnóstico

- [ ] `.env.local` tem `OPENAI_API_KEY` configurada?
- [ ] `.env.local` tem `DID_API_KEY` configurada (em Base64)?
- [ ] Servidor Next.js está rodando (`npm run dev`)?
- [ ] Browser console mostra erros de WebSocket?
- [ ] Browser console mostra erros de WebRTC?
- [ ] Microfone tem permissão concedida?
- [ ] Teste `/api/diagnostic/openai` retorna success?
- [ ] Teste `/api/diagnostic/did` retorna success?
- [ ] Network tab mostra chamadas para `/api/realtime/session`?
- [ ] Network tab mostra chamadas para `/api/did/create-session`?

---

## 📋 Logs Importantes

### Browser Console (Pressione F12)

Procure por:
```
[useRealtimeAPI] Creating ephemeral session...
[useRealtimeAPI] WebSocket connected
[D-ID] Creating session...
[D-ID] Session created: str-xxx
[D-ID] ICE state: connected
```

### Erros Comuns

**1. "OpenAI API key not configured"**
→ Faltou configurar no `.env.local`

**2. "DID_API_KEY not configured"**
→ Faltou configurar no `.env.local`

**3. "WebSocket error"**
→ Chave OpenAI inválida ou modelo não disponível

**4. "ICE connection failed"**
→ Problema de rede ou firewall bloqueando WebRTC

**5. "Failed to create D-ID session"**
→ Chave D-ID inválida ou formato incorreto

---

## 🚀 Quick Fix Script

```bash
#!/bin/bash
# Execute este script para verificar configuração

echo "=== Verificando Configuração ==="

# Check env vars
if grep -q "OPENAI_API_KEY=" .env.local 2>/dev/null; then
  echo "✅ OPENAI_API_KEY configurada"
else
  echo "❌ OPENAI_API_KEY NÃO configurada"
fi

if grep -q "DID_API_KEY=" .env.local 2>/dev/null; then
  echo "✅ DID_API_KEY configurada"
else
  echo "❌ DID_API_KEY NÃO configurada"
fi

# Check if server is running
if curl -s http://localhost:3000/api/health > /dev/null 2>&1; then
  echo "✅ Servidor Next.js rodando"
else
  echo "❌ Servidor Next.js NÃO está rodando - execute 'npm run dev'"
fi

# Test APIs
echo ""
echo "=== Testando APIs ==="

OPENAI_RESULT=$(curl -s http://localhost:3000/api/diagnostic/openai | jq -r '.status' 2>/dev/null)
if [ "$OPENAI_RESULT" = "success" ]; then
  echo "✅ OpenAI API funcionando"
else
  echo "❌ OpenAI API com erro: $OPENAI_RESULT"
fi

DID_RESULT=$(curl -s http://localhost:3000/api/diagnostic/did | jq -r '.status' 2>/dev/null)
if [ "$DID_RESULT" = "success" ]; then
  echo "✅ D-ID API funcionando"
else
  echo "❌ D-ID API com erro: $DID_RESULT"
fi

echo ""
echo "=== Diagnóstico Completo ==="
```

Salve como `check-chat.sh` e execute: `bash check-chat.sh`

---

## 💡 Próximos Passos

1. **Execute o script de diagnóstico** acima
2. **Verifique os logs no browser console** (F12)
3. **Teste cada endpoint** individualmente
4. **Ajuste os parâmetros de VAD** se a transcrição estiver incorreta
5. **Verifique a chave D-ID** se o avatar não funcionar

---

## 📞 Suporte

Se após seguir todos os passos o problema persistir:

1. Capture os logs completos do browser (F12 → Console → Copy All)
2. Capture a resposta dos endpoints `/api/diagnostic/*`
3. Verifique se as chaves de API estão válidas nos respectivos dashboards:
   - OpenAI: https://platform.openai.com/api-keys
   - D-ID: https://studio.d-id.com/account/api-keys
