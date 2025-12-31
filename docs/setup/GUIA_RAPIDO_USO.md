# ⚡ GUIA RÁPIDO DE USO - CHAT + AGENTES

**Sistema**: Chat com IA + State Machine + Automações
**Desenvolvido**: 27/12/2025

---

## 🚀 COMEÇAR EM 3 PASSOS (5 MINUTOS)

### Passo 1: Aplicar Migration (30 segundos)

```bash
# Via Supabase Dashboard
# 1. Acesse: https://supabase.com/dashboard/project/[seu-projeto]/editor
# 2. Cole o conteúdo de: supabase/migrations/20251227000001_add_state_machine_columns.sql
# 3. Clique em "Run"
```

### Passo 2: Adicionar Chat em Uma Página (2 minutos)

```tsx
// app/(marketing)/imoveis/page.tsx (ou qualquer página)

import { EnhancedChatAssistant } from '@/components/chat/EnhancedChatAssistant'

export default function ImoveisPage() {
  return (
    <div>
      {/* Seu conteúdo existente */}
      <h1>Direito Imobiliário</h1>
      <p>Conteúdo...</p>

      {/* Adicione isso no final */}
      <EnhancedChatAssistant
        productId="consultoria-imobiliaria"
        productName="Consultoria Imobiliária"
        useStateMachine={true}
        autoOpen={false} // true = abre automaticamente
        openDelay={5000} // delay antes de abrir (ms)
      />
    </div>
  )
}
```

### Passo 3: Testar! (2 minutos)

1. Acesse a página
2. Clique no botão flutuante do chat
3. Digite uma mensagem
4. Teste gravar áudio (clique no microfone)
5. Teste as configurações (ícone de engrenagem)

---

## 🎯 FUNCIONALIDADES PRINCIPAIS

### 1. Chat com Texto
- Digite e envie mensagens
- Receba respostas inteligentes da IA
- Anexe documentos/imagens

### 2. Chat com Voz
- Clique no microfone 🎤
- Fale sua mensagem
- Ela será transcrita automaticamente
- Você pode editar antes de enviar

### 3. Ouvir Respostas da IA
- Respostas aparecem com botão de play ▶️
- Clique para ouvir a IA falando
- Ajuste velocidade nas configurações

### 4. Configurações
- Clique no ícone ⚙️ no header do chat
- Ative/desative voz
- Escolha voz (6 opções)
- Ajuste velocidade de fala
- Configure autoplay

### 5. Video Chat (Realtime API)
- Clique no ícone 📹
- Converse ao vivo com a IA
- Avatar digital D-ID sincronizado

---

## 🔧 CONFIGURAÇÕES DISPONÍVEIS

### Props do EnhancedChatAssistant

```tsx
<EnhancedChatAssistant
  productId="seu-produto-id"        // OBRIGATÓRIO
  productName="Nome do Produto"     // OBRIGATÓRIO
  useStateMachine={true}            // Usar novo sistema (recomendado)
  autoOpen={false}                  // Abrir automaticamente?
  openDelay={3000}                  // Delay antes de abrir (ms)
  onClose={() => console.log('Fechou')} // Callback ao fechar
/>
```

### Vozes Disponíveis

| Voice | Descrição |
|-------|-----------|
| `alloy` | Neutro, versátil |
| `echo` | Masculino suave |
| `fable` | Neutro expressivo |
| `onyx` | Masculino grave |
| `nova` | Feminino jovem |
| `shimmer` | Feminino suave (padrão) |

---

## 📱 COMO O USUÁRIO USA

### Fluxo Normal

1. **Abre o chat**
   - Clica no botão flutuante
   - Ou abre automaticamente

2. **IA saúda**
   - Mensagem de boas-vindas
   - Oferece opções (texto, voz, vídeo)

3. **Usuário descreve problema**
   - Por texto ou voz
   - Pode anexar documentos

4. **IA identifica e classifica**
   - Entende o problema
   - Atribui ao especialista correto

5. **IA qualifica**
   - Faz perguntas específicas
   - Calcula score de viabilidade

6. **IA propõe solução**
   - Gera proposta personalizada
   - Envia link de pagamento

7. **Usuário paga**
   - Recebe confirmação instantânea
   - Recebe contrato para assinar

8. **Caso ativo**
   - Advogado atribuído
   - Portal do cliente ativo
   - Acompanhamento em tempo real

---

## 🎨 PERSONALIZAÇÃO

### Cores

O chat usa cores do tema do site automaticamente.
Para customizar, edite em `EnhancedChatAssistant.tsx`:

```tsx
// Linha ~280
className="bg-gradient-to-r from-blue-600 to-blue-700"

// Mude para:
className="bg-gradient-to-r from-purple-600 to-purple-700"
```

### Mensagem de Boas-Vindas

```tsx
// Linha ~80 em EnhancedChatAssistant.tsx
content: `Olá! 👋 Sou o assistente especializado em **${productName}**.

// Customize conforme quiser
```

### Tamanho do Chat

```tsx
// Linha ~266
className="w-[420px] max-w-[calc(100vw-8rem)]"

// Mude largura:
className="w-[500px] max-w-[calc(100vw-8rem)]"
```

---

## 🐛 RESOLUÇÃO DE PROBLEMAS

### Chat não aparece

1. Verifique se adicionou o component na página
2. Verifique console do browser (F12)
3. Confirme que migration foi aplicada

### Áudio não grava

1. Permita acesso ao microfone no browser
2. Verifique se `microphoneEnabled` está true nas settings
3. Teste em HTTPS (localhost funciona)

### TTS não funciona

1. Verifique OpenAI API key em `.env.local`:
   ```
   OPENAI_API_KEY=sk-...
   ```
2. Confirme que TTS está ativado nas settings
3. Verifique console para erros

### State Machine não funciona

1. Confirme migration foi aplicada
2. Verifique `useStateMachine={true}` no component
3. Veja logs no console da API (`/api/chat/agent-flow`)

---

## 📊 MONITORAMENTO

### Ver conversas no Supabase

```sql
-- Ver todas conversas
SELECT * FROM conversations
WHERE conversation_id LIKE 'website:%'
ORDER BY created_at DESC
LIMIT 10;

-- Ver estado atual
SELECT
  conversation_id,
  state_status->>'state' as estado,
  created_at
FROM conversations
WHERE conversation_id LIKE 'website:%'
ORDER BY created_at DESC;

-- Ver qualificação
SELECT
  conversation_id,
  client->>'name' as nome,
  qualification->>'score' as score,
  classification->>'area' as area
FROM conversations
WHERE qualification->>'status' = 'complete'
ORDER BY created_at DESC;
```

### Logs da API

```bash
# Durante desenvolvimento
npm run dev

# Verifique terminal para logs:
# [StateMachine] Transitioning: greeting → identifying
# [AutomatedAction] Sending payment confirmation email
```

---

## 🚀 DEPLOYMENT

### Variáveis de Ambiente Necessárias

```env
# .env.local
OPENAI_API_KEY=sk-proj-...              # Obrigatório
NEXT_PUBLIC_SUPABASE_URL=https://...    # Já existe
NEXT_PUBLIC_SUPABASE_ANON_KEY=...       # Já existe
```

### Build e Deploy

```bash
# Local
npm run build
npm run start

# Vercel (automático via Git)
git add .
git commit -m "feat: Chat com State Machine completo"
git push origin main
```

---

## 📞 SUPORTE

### Documentação Completa

- [SPRINT_6_CHAT_AGENTS_IMPLEMENTATION.md](SPRINT_6_CHAT_AGENTS_IMPLEMENTATION.md) - Arquitetura
- [ENTREGA_FINAL_CHAT_AGENTS_27_12_2025.md](ENTREGA_FINAL_CHAT_AGENTS_27_12_2025.md) - Resumo

### Arquivos Principais

- `src/components/chat/EnhancedChatAssistant.tsx` - Chat completo
- `src/lib/ai/agents/state-machine/state-machine.ts` - Core logic
- `src/app/api/chat/agent-flow/route.ts` - API endpoint

---

## ✅ CHECKLIST DE VALIDAÇÃO

- [ ] Migration aplicada no Supabase
- [ ] EnhancedChatAssistant adicionado em pelo menos 1 página
- [ ] Chat abre e envia mensagem de texto
- [ ] Gravação de áudio funciona
- [ ] TTS funciona (ouvir resposta)
- [ ] Settings salva preferências
- [ ] Video mode abre (Realtime API)
- [ ] Deploy em produção OK

---

**🎉 Sistema pronto para uso! Qualquer dúvida, consulte a documentação completa.**

*Guia criado em: 27/12/2025*
*Sistema: MANUS v6.0*
