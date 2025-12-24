# 🚀 Guia de Deploy - Baileys WhatsApp Server

## ✅ O Que Foi Criado

Servidor Baileys standalone que roda no Railway e se comunica com seu Next.js na Vercel.

**Arquivos criados:**
- `baileys-server/` - Servidor Node.js com Baileys
- `src/app/api/whatsapp/baileys/webhook/route.ts` - Webhook no Next.js

## 📋 Passo a Passo para Deploy

### 1. Fazer Deploy no Railway

**Opção A: Via GitHub (Recomendado)**

1. Commit o código do Baileys:
```bash
git add baileys-server/
git commit -m "feat: Add Baileys WhatsApp server"
git push
```

2. Acesse: https://railway.app/new
3. Clique em **"Deploy from GitHub repo"**
4. Selecione o repositório `garcezpalha`
5. Em **Root Directory**, coloque: `baileys-server`
6. Clique em **"Deploy"**

**Opção B: Via Railway CLI**

```bash
# Instalar Railway CLI
npm install -g @railway/cli

# Login
railway login

# Deploy
cd baileys-server
railway init
railway up
```

### 2. Configurar Variáveis de Ambiente no Railway

No painel do Railway, vá em **Variables** e adicione:

```
WEBHOOK_URL=https://garcezpalha.com/api/whatsapp/baileys/webhook
```

### 3. Obter URL do Railway

Após o deploy, você terá uma URL como:
```
https://seu-projeto.up.railway.app
```

### 4. Conectar WhatsApp

1. Acesse: `https://seu-projeto.up.railway.app/qr`
2. Copie o código QR (será em base64)
3. Decodifique e escaneie com WhatsApp

**Ou use esta página para visualizar:**

```html
<!DOCTYPE html>
<html>
<head>
  <title>WhatsApp QR Code</title>
</head>
<body>
  <h1>Conectar WhatsApp</h1>
  <div id="qr"></div>

  <script>
    async function getQR() {
      const response = await fetch('https://seu-projeto.up.railway.app/qr')
      const data = await response.json()

      if (data.qr) {
        document.getElementById('qr').innerHTML =
          `<img src="${data.qr}" alt="QR Code" style="width:400px">`
      } else {
        document.getElementById('qr').innerHTML =
          `<p>Status: ${data.status}</p>`
        setTimeout(getQR, 2000)
      }
    }

    getQR()
    setInterval(getQR, 5000)
  </script>
</body>
</html>
```

## 🔄 Como Funciona

```
WhatsApp User
    ↓
Baileys Server (Railway)
    ↓ POST /api/whatsapp/baileys/webhook
Next.js (Vercel)
    ↓
Message Handler
    ↓
Qualification System
    ↓
Response enviada via Cloud API
```

## 🧪 Testar

### 1. Verificar Status

```bash
curl https://seu-projeto.up.railway.app/status
```

### 2. Enviar Mensagem de Teste

```bash
curl -X POST https://seu-projeto.up.railway.app/send \
  -H "Content-Type: application/json" \
  -d '{
    "to": "5521999999999",
    "message": "Teste do bot!"
  }'
```

### 3. Ver Logs

No painel do Railway, clique em **"View Logs"**

## ⚙️ Manutenção

### Reconectar WhatsApp

Se desconectar, acesse novamente:
```
https://seu-projeto.up.railway.app/qr
```

### Desconectar

```bash
curl -X POST https://seu-projeto.up.railway.app/disconnect
```

### Ver Status

```bash
curl https://seu-projeto.up.railway.app/status
```

## 🎯 Próximos Passos

Depois de conectar:

1. ✅ Servidor rodando no Railway
2. ✅ WhatsApp conectado via QR Code
3. ✅ Mensagens sendo recebidas
4. ✅ Sistema de qualificação processando
5. ✅ Respostas automáticas funcionando

## 🆘 Troubleshooting

### QR Code não aparece

- Aguarde 10-15 segundos após o deploy
- Verifique os logs no Railway
- Tente acessar `/status` primeiro

### Mensagens não chegam

- Verifique se o WEBHOOK_URL está correto
- Veja os logs no Railway
- Teste o endpoint: `https://garcezpalha.com/api/whatsapp/baileys/webhook`

### Desconexões frequentes

- Normal nas primeiras horas
- O Baileys reconecta automaticamente
- Verifique se o Railway não está em sleep mode

## 📝 Notas Importantes

- ⚠️ Baileys **não é oficial** do WhatsApp
- ⚠️ Conta pode ser **banida** se usar de forma abusiva
- ✅ Use com **moderação**
- ✅ Ideal para **testes** e desenvolvimento
- ✅ Para produção, prefira **Cloud API oficial**
