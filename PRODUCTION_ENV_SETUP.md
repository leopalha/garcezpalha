# 🚀 Configuração de Variáveis de Ambiente - Produção

## ⚠️ Variáveis FALTANDO no Vercel

Execute os comandos abaixo para adicionar as variáveis que estão faltando na produção:

### 1. ClickSign (Assinatura de Contratos)

```bash
# API Key do ClickSign
vercel env add CLICKSIGN_API_KEY production

# Template Key para contratos
vercel env add CLICKSIGN_CONTRACT_TEMPLATE_KEY production
```

**Valores:**
- `CLICKSIGN_API_KEY`: Pegue no [ClickSign Dashboard → API](https://app.clicksign.com/api)
- `CLICKSIGN_CONTRACT_TEMPLATE_KEY`: Crie um template de contrato e copie a chave

---

## ✅ Variáveis JÁ CONFIGURADAS

Estas variáveis já estão no Vercel (não precisa adicionar):

- ✅ `NEXTAUTH_SECRET`
- ✅ `NEXTAUTH_URL`
- ✅ `NEXT_PUBLIC_SUPABASE_URL`
- ✅ `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- ✅ `SUPABASE_SERVICE_ROLE_KEY`
- ✅ `OPENAI_API_KEY`
- ✅ `NEXT_PUBLIC_OPENAI_API_KEY`
- ✅ `MERCADOPAGO_ACCESS_TOKEN`
- ✅ `NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY`
- ✅ `STRIPE_SECRET_KEY`
- ✅ `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- ✅ `STRIPE_WEBHOOK_SECRET`
- ✅ `WHATSAPP_BUSINESS_ACCOUNT_ID`
- ✅ `WHATSAPP_PHONE_NUMBER_ID`
- ✅ `WHATSAPP_VERIFY_TOKEN`
- ✅ `WHATSAPP_ACCESS_TOKEN`
- ✅ `TELEGRAM_BOT_TOKEN`
- ✅ `TWILIO_ACCOUNT_SID`
- ✅ `TWILIO_AUTH_TOKEN`
- ✅ `TWILIO_WHATSAPP_NUMBER`
- ✅ `DID_API_KEY`
- ✅ `RESEND_API_KEY`
- ✅ `CRON_SECRET`
- ✅ `GROQ_API_KEY`

---

## 🔄 Depois de Adicionar

1. **Verificar no Vercel Dashboard:**
   - Acesse: https://vercel.com/leopalhas-projects/garcezpalha/settings/environment-variables
   - Confirme que `CLICKSIGN_API_KEY` e `CLICKSIGN_CONTRACT_TEMPLATE_KEY` aparecem

2. **Re-deploy:**
   ```bash
   vercel --prod
   ```

---

## 📝 Notas

- As variáveis do ClickSign são opcionais - o sistema funciona sem elas, mas **não gerará contratos automaticamente**
- Se não configurar ClickSign agora, os webhooks de pagamento vão falhar silenciosamente ao tentar gerar contrato
- Você pode adicionar mais tarde sem problemas
