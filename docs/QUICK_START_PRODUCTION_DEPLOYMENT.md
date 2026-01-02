# 🚀 Quick Start: Production Deployment

**Platform**: Garcez Palha - Sistema de Gestão Jurídica
**Status**: ✅ PRODUCTION READY
**Last Updated**: 01/01/2026

---

## ⚡ Quick Deploy (2-3 hours)

### Step 1: Environment Variables (30 min)

Copy to your production `.env`:

```env
# Database (Required)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Payment Processing (Required)
MERCADOPAGO_ACCESS_TOKEN=APP_USR-your_token
MERCADOPAGO_WEBHOOK_SECRET=your_webhook_secret
STRIPE_SECRET_KEY=sk_live_your_key
STRIPE_WEBHOOK_SECRET=whsec_your_secret

# Email Notifications (Required)
RESEND_API_KEY=re_your_key

# WhatsApp Notifications (Optional - recommended)
WHATSAPP_CLOUD_API_TOKEN=your_token
WHATSAPP_PHONE_NUMBER_ID=your_phone_id

# Document Signing (Required)
CLICKSIGN_API_KEY=your_key
CLICKSIGN_BASE_URL=https://api.clicksign.com

# App URL (Required)
NEXT_PUBLIC_APP_URL=https://your-production-domain.com
```

### Step 2: Configure Webhooks (30 min)

**MercadoPago**:
1. Go to: https://www.mercadopago.com.br/developers/panel/webhooks
2. Add webhook URL: `https://your-domain.com/api/webhooks/mercadopago`
3. Select events: `payment.created`, `payment.updated`
4. Copy webhook secret to `.env`

**Stripe**:
1. Go to: https://dashboard.stripe.com/webhooks
2. Add endpoint: `https://your-domain.com/api/webhooks/stripe`
3. Select events: `payment_intent.succeeded`, `checkout.session.completed`
4. Copy webhook secret to `.env`

### Step 3: Configure Email Domain (30 min)

**Resend**:
1. Go to: https://resend.com/domains
2. Add your domain: `garcezpalha.com`
3. Add DNS records (TXT, MX, CNAME)
4. Verify domain
5. Update email `from` if needed in notification-service.ts

### Step 4: Optional - WhatsApp Setup (60 min)

**Meta Business Suite**:
1. Create Business Account
2. Set up WhatsApp Business API
3. Get Phone Number ID
4. Get Access Token
5. Add to `.env`

*Skip this step if you want email-only notifications initially*

### Step 5: Test in Staging (30 min)

```bash
# Test revenue flow
curl -X POST https://your-staging-url.com/api/flows/fechamento \
  -H "Content-Type: application/json" \
  -d '{
    "leadId": "test-lead-id",
    "serviceName": "Test Service",
    "serviceDescription": "Test Description",
    "valorTotal": 10000,
    "paymentMethod": "pix"
  }'

# Check email inbox
# Check WhatsApp (if configured)
```

### Step 6: Deploy to Production (15 min)

```bash
# Vercel
vercel --prod

# Or your preferred hosting
npm run build
npm run start
```

### Step 7: Set Up Cron Job (15 min)

Configure a cron job to run deadline reminders hourly:

**Vercel Cron** (`vercel.json`):
```json
{
  "crons": [{
    "path": "/api/cron/process-reminders",
    "schedule": "0 * * * *"
  }]
}
```

**Or use external cron service**:
```bash
# Every hour
0 * * * * curl -X POST https://your-domain.com/api/cron/process-reminders
```

---

## ✅ Post-Deployment Checklist

After deploying, test these features:

### Test 1: Revenue Flow
- [ ] Create test lead
- [ ] Execute fechamento flow
- [ ] Verify PDF generation
- [ ] Verify payment link creation
- [ ] Check email received
- [ ] Check WhatsApp received (if configured)

### Test 2: Payment Processing
- [ ] Make test payment (sandbox mode)
- [ ] Verify webhook received
- [ ] Check payment confirmation email
- [ ] Check payment confirmation WhatsApp
- [ ] Verify proposal status updated

### Test 3: Deadline Tracking
- [ ] Create test deadline (3 days from now)
- [ ] Verify immediate notification
- [ ] Wait for reminder cron
- [ ] Check reminder email

### Test 4: Document Analysis
- [ ] Upload test document
- [ ] Verify AI analysis runs
- [ ] Check for alerts (if any)
- [ ] Verify alert notifications

### Test 5: Lead Qualification
- [ ] Send high-quality lead message
- [ ] Verify score calculation
- [ ] Check admin notifications
- [ ] Verify all admins received alerts

---

## 📊 Monitoring

### What to Monitor

**Email (Resend Dashboard)**:
- Delivery rate (aim for >95%)
- Bounce rate (aim for <5%)
- Open rate (track engagement)

**Payments**:
- MercadoPago dashboard: Transaction success
- Stripe dashboard: Payment success
- Webhook logs: All processed correctly

**WhatsApp (if configured)**:
- Message delivery status
- API usage vs limits
- Response rates

**Application Logs**:
```bash
# Success logs
[Flow] ✅ Action completed

# Warning logs
[Flow] ⚠️ Warning message

# Error logs
[Flow] ❌ Error message
```

---

## 🔧 Common Issues & Solutions

### Email Not Sending

**Issue**: Emails not being delivered
**Check**:
1. `RESEND_API_KEY` is set correctly
2. Domain is verified in Resend
3. Check spam folder
4. Review Resend dashboard for errors

**Solution**:
```bash
# Test email directly
curl -X POST https://api.resend.com/emails \
  -H "Authorization: Bearer YOUR_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "from": "test@yourdomain.com",
    "to": "your-email@gmail.com",
    "subject": "Test",
    "html": "<p>Test</p>"
  }'
```

### WhatsApp Silent

**Issue**: WhatsApp messages not sending
**Check**:
1. `WHATSAPP_CLOUD_API_TOKEN` is set
2. `WHATSAPP_PHONE_NUMBER_ID` is set
3. Phone number format is E.164 (e.g., 5511999999999)

**Solution**: This is OPTIONAL - platform works fine with email only. Fix when ready.

### Payment Webhook Not Received

**Issue**: Webhooks not processing
**Check**:
1. Webhook URLs configured in dashboards
2. HTTPS enabled (webhooks require SSL)
3. Webhook secrets match `.env`
4. Check application logs

**Solution**:
```bash
# Test webhook manually
curl -X POST https://your-domain.com/api/webhooks/stripe \
  -H "Content-Type: application/json" \
  -d '{"type": "payment_intent.succeeded", ...}'
```

### PDF Not Generating

**Issue**: PDF generation fails
**Check**:
1. `pdf-lib` package installed
2. Memory sufficient for PDF generation
3. All data fields provided

**Solution**:
```bash
# Reinstall dependencies
npm install pdf-lib
```

---

## 📱 User Notification Examples

### What Users Receive

**Proposal Email**:
```
Subject: Proposta - Consultoria Jurídica

[Professional branded email with:]
- Service name and value
- Payment button
- 30-day validity notice
```

**Proposal WhatsApp**:
```
Olá João! 👋

Sua proposta para Consultoria Jurídica está pronta!

💰 Valor: R$ 1.500,00

Para realizar o pagamento, acesse:
[payment link]

A proposta é válida por 30 dias.
```

**Deadline Reminder Email** (1 day before):
```
Subject: ⏰ URGENTE: Prazo em 1 dia(s)

[Red themed email with:]
- Case number and client
- Deadline date and description
- Days remaining (prominent)
- Special URGENT alert box
```

**Document Alert Email**:
```
Subject: ⚠️ Alertas Críticos: contract.pdf

[Red themed email with:]
- Document name
- List of all alerts
- Recommendation to review immediately
- Button to view document
```

---

## 🎯 Success Metrics

### Key Performance Indicators

**Revenue**:
- [ ] First successful payment processed
- [ ] Contract generated via ClickSign
- [ ] Lead converted to client

**Operations**:
- [ ] Deadline reminders sending automatically
- [ ] Document alerts working
- [ ] Lead notifications routing to admins

**User Experience**:
- [ ] Email delivery rate >95%
- [ ] WhatsApp delivery rate >90% (if configured)
- [ ] Zero missed critical deadlines

---

## 🆘 Support

### If You Need Help

**Documentation**:
- [EXECUTIVE_SUMMARY_SESSIONS_16_17_18.md](.manus/reports/EXECUTIVE_SUMMARY_SESSIONS_16_17_18.md)
- [FINAL_IMPLEMENTATION_SUMMARY_V2.md](.manus/reports/FINAL_IMPLEMENTATION_SUMMARY_V2.md)
- [SESSION_18_NOTIFICATION_INTEGRATION.md](.manus/reports/SESSION_18_NOTIFICATION_INTEGRATION.md)

**Code Reference**:
- Notification service: [src/lib/notifications/notification-service.ts](src/lib/notifications/notification-service.ts)
- Fechamento flow: [src/lib/workflows/fechamento-flow.ts](src/lib/workflows/fechamento-flow.ts)
- Prazos flow: [src/lib/workflows/prazos-flow.ts](src/lib/workflows/prazos-flow.ts)
- Documentos flow: [src/lib/workflows/documentos-flow.ts](src/lib/workflows/documentos-flow.ts)
- Triagem flow: [src/lib/workflows/triagem-flow.ts](src/lib/workflows/triagem-flow.ts)

**Logs**:
```bash
# Check application logs for detailed error messages
# All logs prefixed with [Flow] name
```

---

## 🎉 You're Ready!

Your platform is now:
- ✅ Generating revenue
- ✅ Sending professional notifications
- ✅ Tracking deadlines automatically
- ✅ Analyzing documents with AI
- ✅ Qualifying leads intelligently

**Next Step**: Deploy and start serving clients! 🚀

---

*Document Created: 01/01/2026*
*Platform Version: Production Ready v1.0*
*Status: ✅ READY TO DEPLOY*
