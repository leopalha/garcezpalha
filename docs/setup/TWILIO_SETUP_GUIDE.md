# 🚀 Twilio WhatsApp - Guia Completo de Setup

**Data:** 24 de dezembro de 2025
**Vantagem:** 100x mais estável que Baileys - nunca desconecta!

---

## ✅ Por Que Twilio?

### Problemas do Baileys:
- ❌ Desconecta em todo deploy no Railway
- ❌ Perde sessão frequentemente
- ❌ Não é oficial do WhatsApp (risco de ban)
- ❌ Precisa escanear QR Code sempre

### Vantagens do Twilio:
- ✅ **Nunca desconecta** - servidor sempre estável
- ✅ **API oficial** via Meta Business Platform
- ✅ **Número dedicado** WhatsApp Business
- ✅ **Sem QR Code** - setup via API
- ✅ **Logs e métricas** profissionais
- ✅ **Suporte oficial** Twilio

---

## 📋 Pré-requisitos

Você disse que já tem conta Twilio - perfeito! ✅

Você vai precisar de:
1. **Twilio Account SID** (começa com AC...)
2. **Twilio Auth Token** (token secreto)
3. **Número WhatsApp** (sandbox ou número próprio)

---

## 🔧 Setup Passo a Passo

### Passo 1: Obter Credenciais Twilio

1. **Acesse:** https://www.twilio.com/console

2. **Na Dashboard, copie:**
   - **Account SID:** ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   - **Auth Token:** (clique no ícone de olho para revelar)

3. **Salve em arquivo temporário** (vamos usar via CLI depois)

### Passo 2: Configurar WhatsApp Sandbox (RÁPIDO - 5 minutos)

**Opção A: Sandbox (Teste Imediato)**

1. **Acesse:** https://console.twilio.com/us1/develop/sms/try-it-out/whatsapp-learn

2. **Você verá algo como:**
   ```
   join <palavra-código>
   ```
   Exemplo: `join modern-tree`

3. **No seu WhatsApp pessoal:**
   - Adicione número: **+1 415 523 8886** (número sandbox Twilio)
   - Envie mensagem: `join modern-tree` (use seu código)

4. **Aguarde confirmação:**
   ```
   Twilio Sandbox: You are all set! 🎉
   ```

5. **Copie o número sandbox:**
   ```
   whatsapp:+14155238886
   ```

**Opção B: Número WhatsApp Próprio (Produção)**

Para produção, você pode solicitar número próprio:
1. https://console.twilio.com/us1/develop/sms/settings/whatsapp-sender-registration
2. Preencher formulário Meta Business
3. Aprovação em 1-3 dias úteis

**Recomendação:** Comece com Sandbox para testar!

### Passo 3: Configurar Variáveis de Ambiente

**Via CLI (que você preferiu):**

```bash
# Abra o terminal e execute:

# Para Windows (PowerShell):
$env:TWILIO_ACCOUNT_SID="ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
$env:TWILIO_AUTH_TOKEN="seu_auth_token_aqui"
$env:TWILIO_WHATSAPP_NUMBER="whatsapp:+14155238886"

# Para Linux/Mac:
export TWILIO_ACCOUNT_SID="ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
export TWILIO_AUTH_TOKEN="seu_auth_token_aqui"
export TWILIO_WHATSAPP_NUMBER="whatsapp:+14155238886"
```

**Ou adicione no .env.local:**

```bash
# Abra: d:\garcezpalha\.env.local
# Adicione no final:

TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=seu_auth_token_aqui
TWILIO_WHATSAPP_NUMBER=whatsapp:+14155238886
```

### Passo 4: Configurar Webhook no Twilio (Via CLI)

**Instale Twilio CLI:**

```bash
# Windows (via npm):
npm install -g twilio-cli

# Ou via Scoop:
scoop install twilio-cli

# Ou baixe instalador:
# https://www.twilio.com/docs/twilio-cli/getting-started/install
```

**Autentique:**

```bash
twilio login
# Vai pedir Account SID e Auth Token
```

**Configure webhook:**

```bash
twilio api:core:incoming-phone-numbers:list

# Copie o SID do número WhatsApp (começa com PN...)

twilio api:core:incoming-phone-numbers:update \
  --sid=PNxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx \
  --sms-url=https://garcezpalha.com/api/whatsapp/twilio/webhook
```

**Ou via Console Web:**

1. https://console.twilio.com/us1/develop/phone-numbers/manage/incoming
2. Clique no número WhatsApp
3. Em **"Messaging Configuration"** → **"A message comes in"**:
   - **Webhook:** `https://garcezpalha.com/api/whatsapp/twilio/webhook`
   - **HTTP Method:** POST
4. **Save**

### Passo 5: Deploy no Vercel

Como você já tem deploy no Vercel, precisa adicionar as variáveis:

**Via CLI (Vercel):**

```bash
# Instale Vercel CLI se não tiver:
npm install -g vercel

# Adicione variáveis:
vercel env add TWILIO_ACCOUNT_SID
# Cole o valor quando pedir

vercel env add TWILIO_AUTH_TOKEN
# Cole o valor quando pedir

vercel env add TWILIO_WHATSAPP_NUMBER
# Cole: whatsapp:+14155238886

# Redeploy:
vercel --prod
```

**Ou via Dashboard Vercel:**

1. https://vercel.com/leopalha/garcezpalha/settings/environment-variables
2. Adicione:
   - `TWILIO_ACCOUNT_SID` = ACxxx...
   - `TWILIO_AUTH_TOKEN` = seu_token
   - `TWILIO_WHATSAPP_NUMBER` = whatsapp:+14155238886
3. **Redeploy** para aplicar

---

## ✅ Testar Integração

### Teste 1: Enviar Mensagem (CLI)

```bash
# Com Twilio CLI:
twilio api:core:messages:create \
  --from "whatsapp:+14155238886" \
  --to "whatsapp:+5521995354010" \
  --body "Teste do bot Garcez Palha!"
```

### Teste 2: Enviar via cURL

```bash
curl -X POST "https://api.twilio.com/2010-04-01/Accounts/ACxxx.../Messages.json" \
  --data-urlencode "From=whatsapp:+14155238886" \
  --data-urlencode "To=whatsapp:+5521995354010" \
  --data-urlencode "Body=Teste!" \
  -u ACxxx...:seu_auth_token
```

### Teste 3: Receber Mensagem

1. **No seu WhatsApp**, envie mensagem para: **+1 415 523 8886**
2. **Digite:** `Olá`
3. **Bot deve responder** com menu de produtos!

### Teste 4: Verificar Logs

```bash
# Logs Twilio:
twilio api:core:messages:list --limit 10

# Logs Vercel (nossa aplicação):
vercel logs --prod
```

---

## 🐛 Troubleshooting

### Erro: "The number +5521... is not a valid WhatsApp number"

**Solução:**
- Número precisa estar registrado no WhatsApp
- No sandbox, você precisa enviar `join <código>` primeiro
- Para produção, configure número verificado

### Erro: "Could not send message from whatsapp:+14155238886"

**Solução:**
1. Verifique se está usando sandbox corretamente
2. Envie `join <código>` do seu número antes de receber
3. Confira se Account SID e Auth Token estão corretos

### Webhook não recebe mensagens

**Solução:**
1. Verifique URL: https://garcezpalha.com/api/whatsapp/twilio/webhook
2. Teste endpoint:
   ```bash
   curl https://garcezpalha.com/api/whatsapp/twilio/webhook
   # Deve retornar: {"service":"Twilio WhatsApp Webhook","status":"active"}
   ```
3. Confira webhook no Twilio Console
4. Veja logs no Vercel

### Bot não responde

**Solução:**
1. Verifique variáveis no Vercel
2. Redeploy após adicionar variáveis
3. Teste com mensagem simples: "Olá"
4. Veja logs:
   ```bash
   vercel logs --prod
   ```

---

## 💰 Custos Twilio

### Sandbox (Grátis):
- ✅ **Grátis para testes**
- ✅ Até 5 números podem participar
- ✅ Mensagens ilimitadas
- ❌ Precisa `join <código>` antes
- ❌ Mostra "Sandbox" nas mensagens

### Produção (Pago):
- **Trial Account:** $15 crédito grátis
- **WhatsApp Business:** $0.005/mensagem (meio centavo USD)
- **Número WhatsApp:** Varia por país
  - Brasil: ~$2/mês
  - EUA: ~$1/mês

**Exemplo de custo:**
- 1000 mensagens/mês = $5
- 10.000 mensagens/mês = $50

Muito mais barato e estável que manter servidor Baileys!

---

## 🎯 Checklist Final

### Configuração Inicial:
- [ ] Conta Twilio criada ✅ (você já tem!)
- [ ] Account SID copiado
- [ ] Auth Token copiado
- [ ] WhatsApp Sandbox ativado
- [ ] Enviado `join <código>` no WhatsApp

### Configuração Variáveis:
- [ ] TWILIO_ACCOUNT_SID adicionado no .env.local
- [ ] TWILIO_AUTH_TOKEN adicionado no .env.local
- [ ] TWILIO_WHATSAPP_NUMBER adicionado no .env.local
- [ ] Variáveis adicionadas no Vercel
- [ ] Redeploy feito no Vercel

### Configuração Webhook:
- [ ] Webhook configurado no Twilio Console
- [ ] URL: https://garcezpalha.com/api/whatsapp/twilio/webhook
- [ ] Endpoint respondendo (teste com cURL)

### Testes:
- [ ] Mensagem enviada via CLI com sucesso
- [ ] Mensagem recebida no WhatsApp
- [ ] Bot respondeu automaticamente
- [ ] Qualificação de leads funcionando

---

## 🔗 Links Úteis

- **Twilio Console:** https://www.twilio.com/console
- **WhatsApp Sandbox:** https://console.twilio.com/us1/develop/sms/try-it-out/whatsapp-learn
- **Twilio CLI Docs:** https://www.twilio.com/docs/twilio-cli
- **Pricing:** https://www.twilio.com/en-us/whatsapp/pricing
- **Support:** https://support.twilio.com/

---

## 📊 Comparação: Baileys vs Twilio

| Feature | Baileys | Twilio |
|---------|---------|--------|
| **Estabilidade** | ❌ Cai toda hora | ✅ 99.95% uptime |
| **Setup** | QR Code manual | API automática |
| **Custo** | $5/mês Railway | ~$5-10/mês uso |
| **Oficial** | ❌ Não oficial | ✅ Parceiro Meta |
| **Suporte** | Comunidade | Oficial Twilio |
| **Produção** | ❌ Não recomendado | ✅ Empresarial |
| **Disconnects** | ❌ Frequentes | ✅ Nunca |

**Conclusão:** Twilio é muito superior para produção! 🎉

---

## 🚀 Próximos Passos

Depois de configurar o Twilio:

1. ✅ Migrar completamente do Baileys para Twilio
2. ✅ Desativar servidor Railway (economizar $5/mês)
3. ✅ Testar bot com clientes reais
4. ✅ Monitorar métricas no Twilio Console
5. ✅ Upgrade para número próprio quando aprovar

---

**🎉 Pronto! Agora você tem WhatsApp estável e profissional!**

Qualquer dúvida, consulte a documentação oficial do Twilio ou veja os logs no Vercel.

---

**Última atualização:** 24 de dezembro de 2025, 03:00 BRT
