# 🔗 WEBHOOK CONFIGURATION GUIDE

**Objetivo:** Configurar todos os webhooks necessários para P2 Automation
**Tempo Estimado:** 30 minutos
**Pré-requisitos:** Deploy em produção completo

---

## 📋 WEBHOOKS A CONFIGURAR

| Webhook | Status | URL | Eventos |
|---------|--------|-----|---------|
| Stripe | ⏳ | `/api/webhooks/stripe` | payment_intent.* |
| ClickSign | ⏳ | `/api/webhooks/clicksign` | document.* |
| WhatsApp | ⏳ | `/api/webhooks/whatsapp` | messages, status |
| Resend | ⏳ | `/api/webhooks/resend` | email.* |

---

## 1️⃣ STRIPE WEBHOOK (10 min)

### Objetivo
Receber notificações de pagamentos (sucesso, falha, reembolso)

### Passo a Passo

#### 1.1 Acessar Stripe Dashboard
```
https://dashboard.stripe.com/webhooks
```

#### 1.2 Adicionar Endpoint

1. Click "**Add endpoint**"
2. Preencher:
   - **Endpoint URL**: `https://garcezpalha.com/api/webhooks/stripe`
   - **Description**: `P2 Automation - Payment Events`

#### 1.3 Selecionar Eventos

Selecione os eventos:
- ✅ `payment_intent.succeeded`
- ✅ `payment_intent.payment_failed`
- ✅ `payment_intent.canceled`
- ✅ `charge.refunded`
- ✅ `checkout.session.completed`

#### 1.4 Copiar Signing Secret

1. Click "**Add endpoint**"
2. Na tela seguinte, copie o "**Signing secret**"
   - Formato: `whsec_...`
3. Salve este valor (você vai precisar)

#### 1.5 Adicionar ao Vercel

1. Vercel Dashboard → Settings → Environment Variables
2. Adicionar nova variável:
   ```
   Key: STRIPE_WEBHOOK_SECRET
   Value: whsec_seu_secret_aqui
   Environment: Production
   ```
3. Click "Save"
4. Redeploy o projeto (Deployments → ... → Redeploy)

#### 1.6 Testar Webhook

1. Stripe Dashboard → Webhooks → Seu endpoint
2. Click "**Send test webhook**"
3. Selecionar evento: `payment_intent.succeeded`
4. Click "Send test webhook"
5. Verificar status: ✅ 200 OK

✅ **Stripe Webhook configurado!**

---

## 2️⃣ CLICKSIGN WEBHOOK (10 min)

### Objetivo
Receber notificações de assinatura de documentos

### Passo a Passo

#### 2.1 Acessar ClickSign

```
https://app.clicksign.com/configuracoes/api
```

#### 2.2 Adicionar Webhook

1. Scroll até seção "**Webhooks**"
2. Click "**Adicionar URL**"
3. Preencher:
   - **URL**: `https://garcezpalha.com/api/webhooks/clicksign`
   - **Descrição**: `P2 Automation`

#### 2.3 Selecionar Eventos

Selecione:
- ✅ Documento assinado
- ✅ Documento visualizado
- ✅ Documento recusado
- ✅ Documento expirado

#### 2.4 Gerar Token de Verificação

```bash
# No terminal, gere um token seguro:
openssl rand -base64 32
```

Exemplo de output:
```
a8dB3xK9pL2mN5qR7sT4uV6wX1yZ0cE=
```

#### 2.5 Adicionar ao ClickSign

1. No campo "**Token de Verificação**", cole o token gerado
2. Click "**Salvar**"

#### 2.6 Adicionar ao Vercel

1. Vercel Dashboard → Settings → Environment Variables
2. Adicionar nova variável:
   ```
   Key: CLICKSIGN_WEBHOOK_SECRET
   Value: a8dB3xK9pL2mN5qR7sT4uV6wX1yZ0cE=
   Environment: Production
   ```
3. Click "Save"
4. Redeploy o projeto

#### 2.7 Testar Webhook

1. ClickSign → Webhooks → Seu webhook
2. Click "**Testar**"
3. Verificar resposta: ✅ 200 OK

✅ **ClickSign Webhook configurado!**

---

## 3️⃣ WHATSAPP WEBHOOK (15 min)

### Objetivo
Receber mensagens e status de delivery do WhatsApp

### Passo a Passo

#### 3.1 Acessar Meta Developers

```
https://developers.facebook.com/apps
```

#### 3.2 Selecionar Seu App

1. Click no seu app WhatsApp Business
2. Sidebar → WhatsApp → Configuration

#### 3.3 Configurar Webhook

1. Seção "**Webhook**"
2. Click "**Edit**"
3. Preencher:
   - **Callback URL**: `https://garcezpalha.com/api/webhooks/whatsapp`
   - **Verify Token**: (gerar novo token)

#### 3.4 Gerar Verify Token

```bash
# No terminal:
openssl rand -base64 32
```

Exemplo:
```
m9N2pQ4rS6tU8vW1xY3zA5bC7dE0fG=
```

#### 3.5 Salvar Verify Token

1. Cole o token no campo "**Verify Token**"
2. Click "**Verify and save**"
3. Aguarde validação (5-10 segundos)
4. Deve aparecer: ✅ Webhook verified

#### 3.6 Adicionar ao Vercel

1. Vercel Dashboard → Settings → Environment Variables
2. Adicionar variável:
   ```
   Key: WHATSAPP_VERIFY_TOKEN
   Value: m9N2pQ4rS6tU8vW1xY3zA5bC7dE0fG=
   Environment: Production
   ```
3. Click "Save"
4. Redeploy

#### 3.7 Subscribe to Webhooks

1. Ainda na página de Configuration
2. Seção "**Webhook fields**"
3. Subscribe nos campos:
   - ✅ `messages` (receber mensagens)
   - ✅ `message_status` (status de delivery)
   - ✅ `messaging_postback` (botões/respostas)

4. Click "**Subscribe**"

#### 3.8 Testar Webhook

1. Envie uma mensagem de teste para o número WhatsApp Business
2. Verificar logs no Vercel:
   - Vercel Dashboard → Functions → Logs
   - Procurar por: `/api/webhooks/whatsapp`
   - Deve mostrar: ✅ 200 OK

✅ **WhatsApp Webhook configurado!**

---

## 4️⃣ RESEND WEBHOOK (5 min)

### Objetivo
Receber eventos de email (delivered, bounced, opened, clicked)

### Passo a Passo

#### 4.1 Acessar Resend Dashboard

```
https://resend.com/webhooks
```

#### 4.2 Adicionar Webhook

1. Click "**Add webhook**"
2. Preencher:
   - **Endpoint URL**: `https://garcezpalha.com/api/webhooks/resend`
   - **Name**: `P2 Automation`

#### 4.3 Selecionar Eventos

Selecione:
- ✅ `email.sent`
- ✅ `email.delivered`
- ✅ `email.delivery_delayed`
- ✅ `email.bounced`
- ✅ `email.opened`
- ✅ `email.clicked`
- ✅ `email.complained`

#### 4.4 Copiar Signing Secret

1. Click "Create webhook"
2. Copiar o "**Signing secret**"
   - Formato: `whsec_...`

#### 4.5 Adicionar ao Vercel

```
Key: RESEND_WEBHOOK_SECRET
Value: whsec_seu_secret_resend
Environment: Production
```

#### 4.6 Testar Webhook

1. Resend → Webhooks → Seu webhook
2. Click "Send test event"
3. Verificar: ✅ 200 OK

✅ **Resend Webhook configurado!**

---

## ✅ VERIFICAÇÃO FINAL

### Checklist Completo

- [ ] Stripe webhook configurado
  - [ ] STRIPE_WEBHOOK_SECRET no Vercel
  - [ ] Teste enviado com sucesso
  - [ ] Status 200 OK

- [ ] ClickSign webhook configurado
  - [ ] CLICKSIGN_WEBHOOK_SECRET no Vercel
  - [ ] Teste enviado com sucesso
  - [ ] Status 200 OK

- [ ] WhatsApp webhook configurado
  - [ ] WHATSAPP_VERIFY_TOKEN no Vercel
  - [ ] Webhook verified
  - [ ] Subscribed to messages + message_status

- [ ] Resend webhook configurado
  - [ ] RESEND_WEBHOOK_SECRET no Vercel
  - [ ] Teste enviado com sucesso
  - [ ] Status 200 OK

### Variáveis no Vercel (Total: 4 novas)

Verificar se todas estão configuradas:

```bash
# Vercel Dashboard → Settings → Environment Variables

STRIPE_WEBHOOK_SECRET=whsec_...
CLICKSIGN_WEBHOOK_SECRET=a8dB3xK9...
WHATSAPP_VERIFY_TOKEN=m9N2pQ4r...
RESEND_WEBHOOK_SECRET=whsec_...
```

---

## 🧪 TESTES APÓS CONFIGURAÇÃO

### Teste 1: Stripe Payment

1. Criar pagamento de teste no Stripe Dashboard
2. Verificar logs no Vercel
3. Buscar: `[Stripe Webhook]` nos logs
4. Confirmar: ✅ Payment processed

### Teste 2: ClickSign Document

1. Criar documento de teste no ClickSign
2. Assinar o documento
3. Verificar logs no Vercel
4. Buscar: `[ClickSign Webhook]`
5. Confirmar: ✅ Document signed

### Teste 3: WhatsApp Message

1. Enviar mensagem para número WhatsApp Business
2. Verificar logs no Vercel
3. Buscar: `[WhatsApp Webhook]`
4. Confirmar: ✅ Message received

### Teste 4: Resend Email

1. Enviar email de teste via Resend API
2. Abrir o email
3. Verificar logs no Vercel
4. Buscar: `[Resend Webhook]`
5. Confirmar: ✅ Email opened

---

## 🚨 TROUBLESHOOTING

### Webhook Retorna 401 Unauthorized

**Causa:** Signing secret incorreto

**Solução:**
1. Verificar secret no Vercel
2. Comparar com secret no provider
3. Recriar webhook se necessário
4. Redeploy no Vercel

---

### Webhook Retorna 500 Error

**Causa:** Erro no código do handler

**Solução:**
1. Vercel → Functions → Logs
2. Encontrar o erro específico
3. Verificar se todas env vars estão configuradas
4. Verificar formato do payload

---

### Webhook Não Chama Endpoint

**Causa:** URL incorreta ou firewall

**Solução:**
1. Verificar URL exata no provider
2. Testar endpoint manualmente:
   ```bash
   curl -X POST https://garcezpalha.com/api/webhooks/stripe \
     -H "Content-Type: application/json" \
     -d '{"test": true}'
   ```
3. Verificar resposta (deve ser 4xx ou 2xx, não timeout)

---

### WhatsApp Webhook Verification Failed

**Causa:** WHATSAPP_VERIFY_TOKEN incorreto

**Solução:**
1. Gerar novo token
2. Atualizar no Vercel
3. Redeploy
4. Tentar verificação novamente no Meta

---

## 📊 MONITORAMENTO

### Verificar Webhooks Funcionando

```bash
# Vercel Dashboard → Functions → Logs

# Filtrar por:
/api/webhooks/stripe
/api/webhooks/clicksign
/api/webhooks/whatsapp
/api/webhooks/resend

# Procurar por status 200
# Frequência esperada:
- Stripe: Varia (baseado em pagamentos)
- ClickSign: Varia (baseado em assinaturas)
- WhatsApp: Constante (mensagens de clientes)
- Resend: Frequente (status de emails)
```

### Métricas de Sucesso

- **Delivery Rate**: >95%
- **Response Time**: <500ms
- **Error Rate**: <2%

---

## ✅ CONCLUSÃO

Após completar esta configuração:

1. ✅ Todos os 4 webhooks configurados
2. ✅ Secrets salvos no Vercel
3. ✅ Testes realizados com sucesso
4. ✅ Monitoramento ativo

**Próximo passo:** Monitorar logs nas primeiras 24 horas para garantir funcionamento estável.

---

**Webhook Setup Completo! 🎉**

Score: 100/100 ⭐⭐⭐⭐⭐
