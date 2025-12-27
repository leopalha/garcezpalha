# 🚀 Deploy Baileys - Passo a Passo AGORA

## ✅ Commit Já Foi Feito!

O código já está commitado localmente. Agora precisa fazer deploy.

## 📋 Deploy no Railway (5 minutos)

### Opção 1: Via Interface Web (Mais Fácil)

1. **Acesse:** https://railway.app/new

2. **Clique em "Empty Project"**

3. **Clique em "+ New" → "Empty Service"**

4. **Clique em "Settings"**
   - Em **Source**, clique em "Connect Repo"
   - OU clique em "Deploy from GitHub"
   - Selecione o repositório (se aparecer)

5. **Configure Root Directory:**
   - Em **Settings** → **Build**
   - Root Directory: `baileys-server`
   - Build Command: (deixe vazio)
   - Start Command: `npm start`

6. **Adicione Variáveis de Ambiente:**
   - Clique em **Variables**
   - Adicione:
     ```
     WEBHOOK_URL=https://garcezpalha.com/api/whatsapp/baileys/webhook
     ```

7. **Deploy!**
   - Railway vai detectar automaticamente
   - Aguarde 2-3 minutos

### Opção 2: Via Railway CLI (Você Faz)

```bash
# 1. Instalar Railway CLI (se não tiver)
npm install -g @railway/cli

# 2. Login
railway login

# 3. Deploy
cd baileys-server
railway init
railway up

# 4. Adicionar variável
railway variables --set WEBHOOK_URL=https://garcezpalha.com/api/whatsapp/baileys/webhook

# 5. Ver logs
railway logs
```

### Opção 3: Upload Manual

Se nada funcionar:

1. Compacte a pasta `baileys-server/` em um ZIP

2. Acesse: https://railway.app/new

3. Clique em "Deploy from ZIP"

4. Faça upload do ZIP

5. Adicione as variáveis de ambiente

## 🔗 Depois do Deploy

1. **Pegue a URL do projeto:**
   - No painel do Railway, copie a URL (ex: `https://seu-projeto.up.railway.app`)

2. **Acesse o QR Code:**
   ```
   https://seu-projeto.up.railway.app/qr
   ```

3. **Ou crie esta página HTML localmente:**

Salve como `qr.html` e abra no navegador:

```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>WhatsApp QR Code - Garcez Palha</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      margin: 0;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
    }
    .container {
      background: white;
      padding: 2rem;
      border-radius: 1rem;
      box-shadow: 0 10px 40px rgba(0,0,0,0.2);
      text-align: center;
      color: #333;
    }
    h1 { color: #667eea; margin-bottom: 1rem; }
    #qr img {
      max-width: 400px;
      width: 100%;
      border: 3px solid #667eea;
      border-radius: 0.5rem;
      margin: 1rem 0;
    }
    #status {
      font-size: 1.2rem;
      margin: 1rem 0;
      padding: 1rem;
      background: #f0f0f0;
      border-radius: 0.5rem;
    }
    .loading {
      animation: pulse 2s infinite;
    }
    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.5; }
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>📱 Conectar WhatsApp</h1>
    <p>Garcez Palha Advogados Associados</p>

    <div id="status">🔄 Buscando QR Code...</div>
    <div id="qr"></div>

    <div style="margin-top: 1rem; font-size: 0.9rem; color: #666;">
      <p><strong>Como conectar:</strong></p>
      <ol style="text-align: left; max-width: 300px; margin: 0 auto;">
        <li>Abra o WhatsApp no celular</li>
        <li>Vá em Menu → Dispositivos Conectados</li>
        <li>Toque em "Conectar dispositivo"</li>
        <li>Aponte para este QR Code</li>
      </ol>
    </div>
  </div>

  <script>
    const RAILWAY_URL = 'https://SEU-PROJETO.up.railway.app' // ALTERE AQUI!

    async function getQR() {
      try {
        const response = await fetch(`${RAILWAY_URL}/qr`)
        const data = await response.json()

        if (data.qr) {
          document.getElementById('status').innerHTML = '✅ QR Code Disponível'
          document.getElementById('qr').innerHTML =
            `<img src="${data.qr}" alt="QR Code WhatsApp">`
        } else {
          document.getElementById('status').innerHTML =
            `⏳ Status: ${data.status || 'Gerando QR Code...'}`
          document.getElementById('qr').innerHTML = ''
          setTimeout(getQR, 3000)
        }
      } catch (error) {
        document.getElementById('status').innerHTML =
          `❌ Erro: ${error.message}<br><small>Verifique se a URL está correta</small>`
        setTimeout(getQR, 5000)
      }
    }

    getQR()
    setInterval(getQR, 10000)
  </script>
</body>
</html>
```

**NÃO ESQUEÇA:** Alterar `SEU-PROJETO.up.railway.app` pela URL real do Railway!

## ✅ Checklist

- [ ] Deploy feito no Railway
- [ ] Variável WEBHOOK_URL configurada
- [ ] URL do projeto copiada
- [ ] QR Code acessado
- [ ] WhatsApp escaneado
- [ ] Bot conectado!

## 🆘 Problemas?

### QR Code não aparece

Aguarde 30-60 segundos após o deploy. O Baileys demora um pouco para iniciar.

Ver logs:
```bash
railway logs
```

### "Cannot GET /qr"

O servidor ainda está iniciando. Aguarde mais um pouco.

### Railway não aceita

Tente a Opção 3 (upload de ZIP).

## 📞 Próximo Passo

Depois que conectar, envie uma mensagem para o número do WhatsApp conectado e veja o bot responder automaticamente!

🎉 **Está tudo pronto!** Só falta fazer o deploy!
