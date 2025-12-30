# 🔧 Inngest Setup Guide

## O que é Inngest?

Inngest é uma plataforma de orquestração de eventos que permite criar:
- **Cron jobs** confiáveis (melhor que Vercel Cron)
- **Event-driven workflows** (ex: quando lead é criado → enviar email)
- **Background jobs** com retry automático
- **Funções com steps** para workflows complexos

## Por que usar Inngest?

1. ✅ **Cron jobs confiáveis** - Não dependem do Vercel estar acordado
2. ✅ **Retry automático** - Se falhar, tenta novamente
3. ✅ **Visual debugging** - Dashboard mostra execuções em tempo real
4. ✅ **Event-driven** - Trigger workflows via eventos customizados
5. ✅ **Free tier generoso** - 50k step runs/mês grátis

## Setup Passo a Passo

### 1. Criar conta no Inngest

1. Acesse: https://app.inngest.com
2. Crie conta (pode usar GitHub login)
3. Crie um novo app: "Garcez Palha"

### 2. Obter API Keys

1. No dashboard do Inngest, vá em: **Settings → Keys**
2. Copie as seguintes keys:
   - **Event Key** - Para enviar eventos ao Inngest
   - **Signing Key** - Para validar requisições do Inngest

### 3. Configurar Environment Variables

Adicione ao seu `.env.local`:

```bash
# Inngest
INNGEST_EVENT_KEY=your_event_key_here
INNGEST_SIGNING_KEY=signkey_prod_your_signing_key_here
```

Em **Vercel** (produção):
1. Settings → Environment Variables
2. Adicione as mesmas variáveis
3. Deploy novamente

### 4. Sync Functions com Inngest

Depois de fazer deploy, você precisa registrar suas functions no Inngest:

**Opção A: Via Inngest Dashboard (Recomendado)**

1. No Inngest Dashboard, vá em: **Apps → Garcez Palha**
2. Clique em **Sync**
3. Cole a URL do seu app: `https://garcezpalha.com.br/api/inngest`
4. Inngest vai descobrir automaticamente suas functions

**Opção B: Via CLI**

```bash
# Instalar Inngest CLI
npm install -g inngest-cli

# Sync functions
inngest-cli dev
```

### 5. Verificar Functions Registradas

No dashboard do Inngest, você deve ver 4 functions:

1. **process-email-sequences** - Cron: a cada 15 minutos
2. **trigger-welcome-sequence** - Event: `lead/created`
3. **handle-email-event** - Event: `email/event`
4. **generate-sequence-report** - Cron: diariamente às 9h

## Functions Criadas

### 1. Process Email Sequences (Cron)

**Arquivo**: `src/lib/jobs/email-sequences.ts`

**Função**: Processa emails agendados a cada 15 minutos

**Trigger**: Cron `*/15 * * * *`

**O que faz**:
1. Busca subscriptions ativas no Supabase
2. Determina próximo email a enviar (baseado em delay)
3. Envia email via Resend
4. Atualiza métricas no banco

### 2. Trigger Welcome Sequence (Event)

**Trigger**: Evento `lead/created`

**Payload**:
```typescript
{
  leadId: string
  email: string
  name: string
  source?: string
  produto?: string
}
```

**O que faz**:
1. Inscreve lead na sequência de boas-vindas
2. Primeiro email enviado imediatamente
3. Próximos emails agendados conforme delays

**Como usar**:
```typescript
import { inngest } from '@/lib/jobs/email-sequences'

// Quando criar novo lead
await inngest.send({
  name: 'lead/created',
  data: {
    leadId: 'lead_123',
    email: 'cliente@example.com',
    name: 'João Silva',
    source: 'website',
    produto: 'usucapiao',
  },
})
```

### 3. Handle Email Event (Event)

**Trigger**: Evento `email/event`

**Payload**:
```typescript
{
  type: 'email.opened' | 'email.clicked' | 'email.bounced' | 'email.complained'
  email_id: string
  email: string
  timestamp: string
  link?: string // apenas para 'clicked'
}
```

**O que faz**:
1. Processa webhook do Resend
2. Atualiza métricas (opens, clicks, bounces)
3. Ações condicionais:
   - **Clicked** → Notifica equipe de vendas (high intent)
   - **Bounced/Complained** → Marca lead como inativo

### 4. Generate Sequence Report (Cron)

**Trigger**: Cron `0 9 * * *` (diariamente às 9h)

**O que faz**:
1. Calcula métricas de todas as sequências
2. Formata relatório com open rate, click rate, bounce rate
3. (TODO) Envia relatório via email/Slack

## Testes Locais

Para testar Inngest localmente:

```bash
# Terminal 1: Rodar Inngest Dev Server
npx inngest-cli dev

# Terminal 2: Rodar Next.js
npm run dev
```

Acesse o Inngest Dev UI: http://localhost:8288

Você pode:
- Ver funções registradas
- Executar manualmente
- Simular eventos
- Ver logs em tempo real

## Enviar Eventos Programaticamente

### Exemplo 1: Trigger Welcome Sequence

Quando criar um lead:

```typescript
// src/app/api/leads/route.ts
import { inngest } from '@/lib/jobs/email-sequences'

export async function POST(req: Request) {
  const { email, name } = await req.json()

  // Criar lead no Supabase
  const { data: lead } = await supabase
    .from('leads')
    .insert({ email, name })
    .select()
    .single()

  // Trigger welcome sequence
  await inngest.send({
    name: 'lead/created',
    data: {
      leadId: lead.id,
      email: lead.email,
      name: lead.name,
    },
  })

  return Response.json({ success: true })
}
```

### Exemplo 2: Email Event (já implementado)

O webhook do Resend já dispara eventos automáticos:

```typescript
// src/app/api/webhooks/resend/route.ts
await inngest.send({
  name: 'email/event',
  data: {
    type: 'email.opened',
    email_id: event.data.email_id,
    email: event.data.to,
    timestamp: event.created_at,
  },
})
```

## Monitoramento e Debugging

### Dashboard do Inngest

1. Acesse: https://app.inngest.com
2. Veja todas execuções em: **Functions → [Nome da função] → Runs**
3. Cada run mostra:
   - Timestamp
   - Status (success/failed/running)
   - Duration
   - Payload
   - Logs
   - Stack trace (se falhou)

### Métricas Importantes

- **Success Rate** - Percentual de execuções bem-sucedidas
- **Average Duration** - Tempo médio de execução
- **Error Rate** - Taxa de erros
- **Retry Count** - Quantas vezes retentou

### Alertas (Opcional)

Configure alertas no Inngest:
1. **Settings → Alerts**
2. Configure Slack/Email para:
   - Funções falhando > 5% do tempo
   - Cron jobs não executando

## Troubleshooting

### Function não aparece no dashboard

1. Verifique se `.env` tem `INNGEST_EVENT_KEY` e `INNGEST_SIGNING_KEY`
2. Rode `npm run build` para verificar erros
3. Faça deploy e acesse: `https://garcezpalha.com.br/api/inngest`
4. Deve retornar JSON com lista de functions

### Cron job não está rodando

1. Verifique timezone (cron usa UTC por padrão)
2. No dashboard, vá em **Functions → process-email-sequences → Schedule**
3. Veja próxima execução programada
4. Force execução manual para testar

### Eventos não estão sendo processados

1. Verifique se `inngest.send()` está sendo chamado
2. No dashboard, vá em **Events** para ver todos eventos recebidos
3. Verifique se event name está correto (ex: `lead/created`)

### Função falhando com erro

1. No dashboard, clique na execução falhada
2. Veja **Stack Trace** completo
3. Verifique **Payload** recebido
4. Teste localmente com `inngest-cli dev`

## Custos

### Free Tier (Atual)
- ✅ **50,000 step runs/mês** grátis
- ✅ Unlimited functions
- ✅ Unlimited events
- ✅ 30 days logs retention

### Estimativa de Uso

**Cron Jobs**:
- `process-email-sequences`: 4 runs/hora × 24h × 30 dias = **2,880 runs/mês**
- `generate-sequence-report`: 1 run/dia × 30 dias = **30 runs/mês**

**Event-driven**:
- `trigger-welcome-sequence`: 1 run por lead criado (estimado 100/mês)
- `handle-email-event`: ~4 eventos por email enviado (opened, clicked, etc)
  - 100 leads × 4 emails × 4 eventos = **1,600 runs/mês**

**Total estimado**: ~4,600 runs/mês (9% do free tier)

### Quando Pagar?

Se ultrapassar 50k steps/mês:
- **Pro Plan**: $20/mês para 100k steps
- A cada 10k steps adicionais: +$2

Com 1000 leads/mês, ainda estaria no free tier.

## Próximos Passos

1. ✅ Functions criadas e commitadas
2. ⏳ Configurar env vars no Vercel
3. ⏳ Deploy para produção
4. ⏳ Sync functions no Inngest Dashboard
5. ⏳ Testar cron job rodando
6. ⏳ Criar primeiro lead e verificar welcome sequence

## Referências

- Documentação: https://www.inngest.com/docs
- Dashboard: https://app.inngest.com
- CLI: https://www.inngest.com/docs/cli
- Examples: https://github.com/inngest/inngest-js/tree/main/examples
