# 📊 Google Analytics 4 - Guia de Implementação

**Projeto:** Garcez Palha
**Versão:** MANUS v7.0
**Data:** 29/12/2025
**Status:** ✅ IMPLEMENTADO E ATIVO

---

## 📋 Sumário

1. [Visão Geral](#visão-geral)
2. [Configuração](#configuração)
3. [Eventos Rastreados](#eventos-rastreados)
4. [Como Usar](#como-usar)
5. [Compliance LGPD](#compliance-lgpd)
6. [Métricas Importantes](#métricas-importantes)
7. [Debugging](#debugging)

---

## 🎯 Visão Geral

Sistema completo de analytics com Google Analytics 4 (GA4) implementado para rastrear:
- Visualizações de página
- Eventos de conversão (leads, vendas)
- Interações com chat
- Submissões de formulários
- Comportamento do usuário

**Arquitetura:**
```
src/
├── components/analytics/
│   └── google-analytics-script.tsx    # Script GA4
├── lib/analytics/
│   └── google-analytics.tsx            # Tracking functions
└── app/
    └── layout.tsx                       # Integração global
```

---

## ⚙️ Configuração

### 1. Obter Measurement ID

1. Acesse [Google Analytics](https://analytics.google.com/)
2. Crie uma propriedade GA4 (se não tiver)
3. Navegue até: **Admin → Data Streams → Web**
4. Copie o **Measurement ID** (formato: `G-XXXXXXXXXX`)

### 2. Configurar Variável de Ambiente

**Arquivo:** `.env.local`

```bash
# Google Analytics 4
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

> ⚠️ **IMPORTANTE**: A variável DEVE começar com `NEXT_PUBLIC_` para ser acessível no cliente.

### 3. Verificar Instalação

O sistema já está integrado no `layout.tsx`:

```tsx
import { GoogleAnalyticsScript } from '@/components/analytics/google-analytics-script'
import { GoogleAnalyticsPageView } from '@/lib/analytics/google-analytics'

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <GoogleAnalyticsScript />  {/* ← Script GA4 */}
      <body>
        <Suspense fallback={null}>
          <GoogleAnalyticsPageView />  {/* ← Auto page tracking */}
          {children}
        </Suspense>
      </body>
    </html>
  )
}
```

---

## 📊 Eventos Rastreados

### Eventos Automáticos

| Evento | Quando ocorre |
|--------|---------------|
| `page_view` | Toda mudança de rota (automático) |
| `session_start` | Início de sessão (automático) |
| `first_visit` | Primeira visita do usuário (automático) |

### Eventos Personalizados Implementados

#### 1. Lead Generation

```typescript
import { trackLead } from '@/lib/analytics/google-analytics'

// Exemplo: Quando usuário preenche formulário
trackLead('desbloqueio-conta', 1500) // leadType, value (opcional)
```

**Parâmetros:**
- `lead_type`: Tipo do produto/serviço
- `value`: Valor estimado do lead em R$
- `currency`: BRL (fixo)

---

#### 2. Conversions (Vendas)

```typescript
import { trackPurchase } from '@/lib/analytics/google-analytics'

// Exemplo: Quando pagamento é confirmado
trackPurchase(
  'TRX-12345',     // transaction_id
  2500,            // value
  [                // items
    {
      item_id: 'desbloqueio-conta',
      item_name: 'Desbloqueio de Conta',
      price: 2500,
      quantity: 1
    }
  ]
)
```

**Parâmetros:**
- `transaction_id`: ID único da transação
- `value`: Valor total em R$
- `items`: Array de produtos/serviços

---

#### 3. Form Submissions

```typescript
import { trackFormSubmit } from '@/lib/analytics/google-analytics'

// Exemplo: Quando formulário de contato é enviado
function handleSubmit() {
  trackFormSubmit('contact-form')
  // ... resto da lógica
}
```

**Parâmetros:**
- `form_name`: Nome identificador do formulário

---

#### 4. Chat Interactions

```typescript
import { trackChatStart, trackChatMessage } from '@/lib/analytics/google-analytics'

// Quando chat é iniciado
trackChatStart('FinancialProtectionAgent')

// A cada mensagem enviada
trackChatMessage('user')     // Mensagem do usuário
trackChatMessage('assistant') // Resposta do AI
```

**Parâmetros:**
- `agent_type`: Tipo do agente AI usado
- `message_type`: 'user' ou 'assistant'

---

#### 5. Custom Events

```typescript
import { trackEvent } from '@/lib/analytics/google-analytics'

// Evento genérico com parâmetros customizados
trackEvent('button_click', {
  button_name: 'cta-whatsapp',
  page: '/solucoes/desbloqueio-conta',
  section: 'hero'
})
```

---

## 🔐 Compliance LGPD

### Configurações de Privacidade

O sistema está configurado para compliance com LGPD:

```typescript
gtag('config', GA_MEASUREMENT_ID, {
  cookie_flags: 'SameSite=None;Secure',
  anonymize_ip: true,  // ← Anonimiza IPs (LGPD)
})
```

### Comportamento

- ✅ **IPs anonimizados**: Últimos octetos removidos
- ✅ **Cookies seguros**: SameSite=None;Secure
- ✅ **Sem PII**: Não rastreamos dados pessoais identificáveis
- ✅ **Desenvolvimento OFF**: Tracking só ativo em produção

---

## 📈 Métricas Importantes

### Funil de Conversão

Rastrear o funil completo do usuário:

```typescript
// 1. Usuário acessa landing page
// (page_view automático)

// 2. Usuário inicia chat
trackChatStart('FinancialProtectionAgent')

// 3. Usuário envia mensagens (qualificação)
trackChatMessage('user')
trackChatMessage('assistant')
// ... múltiplas interações

// 4. Lead qualificado
trackLead('desbloqueio-conta', 2500)

// 5. Formulário preenchido
trackFormSubmit('qualification-form')

// 6. Pagamento realizado
trackPurchase('TRX-12345', 2500, [...])
```

### KPIs no GA4

Acesse **Reports → Engagement** para ver:

| Métrica | O que mede |
|---------|------------|
| **Users** | Visitantes únicos |
| **Sessions** | Sessões totais |
| **Page Views** | Visualizações de página |
| **generate_lead** | Leads gerados |
| **form_submit** | Formulários enviados |
| **purchase** | Conversões em vendas |
| **chat_start** | Chats iniciados |

---

## 🐛 Debugging

### 1. Verificar se GA4 está carregado

Abra o Console do navegador:

```javascript
// Deve retornar: function gtag() { ... }
console.log(window.gtag)

// Deve retornar array com eventos
console.log(window.dataLayer)
```

### 2. Verificar Measurement ID

```bash
# Deve exibir G-XXXXXXXXXX
echo $NEXT_PUBLIC_GA_MEASUREMENT_ID
```

### 3. Google Analytics DebugView

1. Instale extensão: [Google Analytics Debugger](https://chrome.google.com/webstore/detail/google-analytics-debugger/jnkmfdileelhofjcijamephohjechhna)
2. Acesse o site
3. Vá em GA4: **Admin → DebugView**
4. Eventos aparecem em tempo real

### 4. Verificar se está em produção

O tracking **NÃO funciona** em development:

```typescript
// src/components/analytics/google-analytics-script.tsx
if (!GA_MEASUREMENT_ID || process.env.NODE_ENV === 'development') {
  return null  // ← Não carrega em dev
}
```

**Para testar localmente:**
```bash
# Faça build de produção
npm run build

# Execute em modo produção
npm start

# Ou defina NODE_ENV
NODE_ENV=production npm run dev
```

---

## 🎯 Exemplos de Uso

### Exemplo 1: Landing Page de Produto

```tsx
// src/app/(marketing)/financeiro/desbloqueio-conta/page.tsx
'use client'
import { trackLead, trackFormSubmit } from '@/lib/analytics/google-analytics'

export default function DesbloqueioConta() {
  const handleCTAClick = () => {
    trackLead('desbloqueio-conta', 2500)
    // Abrir chat ou formulário
  }

  const handleFormSubmit = (data: any) => {
    trackFormSubmit('desbloqueio-form')
    // Enviar dados
  }

  return (
    <div>
      <button onClick={handleCTAClick}>
        Solicitar Desbloqueio
      </button>
      <form onSubmit={handleFormSubmit}>
        {/* ... campos ... */}
      </form>
    </div>
  )
}
```

### Exemplo 2: Chat Assistant

```tsx
// src/components/chat/ChatAssistant.tsx
import { trackChatStart, trackChatMessage } from '@/lib/analytics/google-analytics'

export function ChatAssistant({ productId }: Props) {
  const handleOpen = () => {
    trackChatStart(productId)
  }

  const handleSendMessage = (message: string) => {
    trackChatMessage('user')
    // Enviar mensagem
  }

  const handleReceiveMessage = (response: string) => {
    trackChatMessage('assistant')
    // Mostrar resposta
  }

  return (/* ... */)
}
```

### Exemplo 3: Checkout Flow

```tsx
// src/components/checkout/CheckoutModal.tsx
import { trackPurchase } from '@/lib/analytics/google-analytics'

export function CheckoutModal({ product }: Props) {
  const handlePaymentSuccess = (transactionId: string) => {
    trackPurchase(
      transactionId,
      product.price,
      [{
        item_id: product.id,
        item_name: product.name,
        price: product.price,
        quantity: 1,
        item_category: product.category,
      }]
    )
  }

  return (/* ... */)
}
```

---

## 📊 Relatórios Recomendados

### 1. Funil de Conversão

**GA4 → Explore → Funnel Exploration**

Crie funil:
```
1. page_view (/solucoes/desbloqueio-conta)
2. chat_start
3. generate_lead
4. form_submit
5. purchase
```

### 2. Produtos Mais Acessados

**GA4 → Reports → Engagement → Pages and Screens**

Filtrar por: `/solucoes/*`

### 3. ROI por Produto

**GA4 → Reports → Monetization → Purchase journey**

Agrupar por: `item_id`

### 4. Chat Performance

**GA4 → Explore → Free form**

Eventos:
- `chat_start` (total de chats iniciados)
- `chat_message` (engajamento)
- Correlação com `generate_lead`

---

## ✅ Checklist de Implementação

- [x] GA4 Measurement ID obtido
- [x] Variável `NEXT_PUBLIC_GA_MEASUREMENT_ID` configurada
- [x] Script GA4 carregado em `layout.tsx`
- [x] Page view tracking automático ativado
- [x] Eventos de lead implementados
- [x] Eventos de conversão implementados
- [x] Eventos de chat implementados
- [x] Eventos de formulário implementados
- [x] Compliance LGPD (anonymize_ip)
- [x] DebugView configurado (opcional)
- [ ] **Testes em produção** (aguardando deployment)
- [ ] **Relatórios personalizados** (criar no GA4)

---

## 📞 Suporte

**Documentação oficial:**
- [Google Analytics 4](https://support.google.com/analytics/answer/9304153)
- [Measurement Protocol](https://developers.google.com/analytics/devguides/collection/protocol/ga4)
- [gtag.js Reference](https://developers.google.com/tag-platform/gtagjs/reference)

**Arquivos do projeto:**
- `src/components/analytics/google-analytics-script.tsx`
- `src/lib/analytics/google-analytics.tsx`
- `.env.example` (variáveis necessárias)

---

**Última atualização:** 29/12/2025
**Status:** ✅ PRONTO PARA PRODUÇÃO
**Implementado por:** MANUS v7.0 - Session 3
