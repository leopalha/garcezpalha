# 📧 Resend DNS Setup - garcezpalha.com

**Domain:** garcezpalha.com
**Region:** São Paulo (sa-east-1)
**Status:** Aguardando configuração DNS

---

## 🎯 DNS Records para Adicionar

### 1. Domain Verification (OBRIGATÓRIO)
```
Type: TXT
Name: resend._domainkey
Value: p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCc8ULjL1KnP/SdZJAyB90JMe5KGdyMMJCht96OKYQnsvkWLIrt255tzTnv+qzoTi4jjdIDW9vJdYK5qakcCq7kZVAeQVkz6AAnOw7RUoFq98r44nWBXjpH2mQbNxgRaWfm9AchFvmI9amw5lBGJL64oarPmFLPM47Vwq1hbCHiFQIDAQAB
TTL: Auto (ou 3600)
```

### 2. SPF - Sending Permission (OBRIGATÓRIO)
```
Type: MX
Name: send
Value: feedback-smtp.sa-east-1.amazonses.com
Priority: 10
TTL: Auto

Type: TXT
Name: send
Value: v=spf1 include:amazonses.com ~all
TTL: Auto
```

### 3. DMARC - Email Authentication (RECOMENDADO)
```
Type: TXT
Name: _dmarc
Value: v=DMARC1; p=none;
TTL: Auto
```

### 4. MX - Receiving Emails (OPCIONAL - se quiser receber emails)
```
Type: MX
Name: @ (ou deixe em branco)
Value: inbound-smtp.sa-east-1.amazonaws.com
Priority: 10
TTL: Auto
```

---

## 📋 Onde Adicionar (seu provedor de DNS)

### Se usar **Cloudflare**:
1. Login em cloudflare.com
2. Selecione domínio `garcezpalha.com`
3. Vá em **DNS** → **Records**
4. Clique **+ Add record**
5. Adicione cada record acima

### Se usar **Registro.br**:
1. Login em registro.br
2. Painel de controle → DNS
3. Adicione cada record

### Se usar **GoDaddy**:
1. Login em godaddy.com
2. Meus produtos → DNS
3. Adicione cada record

---

## ✅ Verificação

Após adicionar os records:

1. **Aguarde 5-30 minutos** (propagação DNS)

2. **Teste no terminal:**
```bash
# Verificar TXT (DKIM)
nslookup -type=TXT resend._domainkey.garcezpalha.com

# Verificar MX (send)
nslookup -type=MX send.garcezpalha.com

# Verificar DMARC
nslookup -type=TXT _dmarc.garcezpalha.com
```

3. **No Resend Dashboard:**
   - Recarregue a página
   - Botão "Verify" deve ficar verde
   - Status: ✅ Verified

---

## 🎯 Após Verificação

### Atualizar EMAIL_FROM

No `.env.local`:
```bash
# De:
EMAIL_FROM=Garcez Palha <contato@garcezpalha.com>

# Para (com domínio verificado):
EMAIL_FROM=Garcez Palha <noreply@garcezpalha.com>
# ou
EMAIL_FROM=Leonardo Palha <leonardo@garcezpalha.com>
```

---

## 🧪 Testar Email

```typescript
import { sendEmail } from '@/lib/email/resend-client'

await sendEmail({
  to: 'seu-email@gmail.com',
  subject: 'Teste de Domínio Verificado',
  html: '<h1>Funcionou!</h1><p>Email enviado do domínio garcezpalha.com</p>',
  from: 'Garcez Palha <noreply@garcezpalha.com>'
})
```

---

## 📊 Limites

### Com domínio verificado:
- ✅ 3,000 emails/mês (free)
- ✅ 100 emails/dia (free)
- ✅ Sender personalizado (@garcezpalha.com)
- ✅ DKIM/SPF configurado (deliverability ++)

---

**Status:** ⏳ Aguardando você adicionar DNS records
**Tempo estimado:** 5-10 minutos para adicionar + 5-30 min propagação
**Next:** Configurar Railway Redis
