# 🚀 Deploy Baileys no Railway - Guia Completo

## ✅ Código Já Está no GitHub!

Repositório: https://github.com/leopalha/garcezpalha

A pasta `baileys-server/` está dentro do repositório principal.

---

## 📋 Deploy no Railway (5 minutos)

### Passo 1: Acessar Railway

Abra no navegador: **https://railway.app/new**

### Passo 2: Conectar GitHub

1. Clique em **"Deploy from GitHub repo"**
2. Se pedir autorização, clique em **"Configure GitHub App"**
3. Selecione o repositório: **leopalha/garcezpalha**
4. Clique em **"Deploy Now"**

### Passo 3: Configurar Root Directory

⚠️ **IMPORTANTE:** O Baileys está na pasta `baileys-server/` dentro do repo.

1. Depois que o deploy começar, clique no serviço criado
2. Vá em **"Settings"** (engrenagem no topo)
3. Role até **"Build"**
4. Configure:
   - **Root Directory:** `baileys-server`
   - **Build Command:** (deixe vazio)
   - **Start Command:** `npm start`

### Passo 4: Adicionar Variável de Ambiente

1. No serviço, clique em **"Variables"**
2. Clique em **"+ New Variable"**
3. Adicione:
   ```
   WEBHOOK_URL=https://garcezpalha.com/api/whatsapp/baileys/webhook
   ```
4. Clique em **"Add"**

### Passo 5: Aguardar Deploy

O Railway vai:
- Detectar Node.js automaticamente
- Rodar `npm install` (instala dependências)
- Rodar `npm start` (inicia o servidor)

Aguarde 2-3 minutos. Você vai ver os logs aparecendo.

### Passo 6: Gerar Domínio Público

1. No serviço, vá em **"Settings"**
2. Role até **"Networking"**
3. Clique em **"Generate Domain"**
4. Railway vai criar uma URL tipo:
   ```
   https://garcezpalha-production-xxxx.up.railway.app
   ```
5. **Copie essa URL!** Você vai precisar.

---

## 📱 Conectar WhatsApp

### Opção 1: Acessar QR Code Direto

Acesse no navegador:
```
https://SUA-URL-DO-RAILWAY.up.railway.app/qr
```

Você vai ver um JSON com o QR code em base64. Exemplo:
```json
{
  "qr": "data:image/png;base64,iVBORw0KGgo...",
  "status": "qr"
}
```

### Opção 2: Usar Página HTML (Recomendado)

Já existe um arquivo `qrcode.html` no projeto. Siga estes passos:

1. **Abra o arquivo:** `d:\garcezpalha\qrcode.html`

2. **Edite a linha 159:**
   ```javascript
   const RAILWAY_URL = 'https://SEU-PROJETO.up.railway.app'
   ```

   Substitua `SEU-PROJETO.up.railway.app` pela URL real do Railway.

3. **Salve o arquivo**

4. **Abra no navegador:**
   - Windows: duplo clique no arquivo
   - Ou arraste para o navegador
   - Ou abra com Chrome/Edge

5. **Aguarde o QR Code aparecer** (5-10 segundos)

6. **Escaneie com WhatsApp:**
   - Abra WhatsApp no celular
   - Menu → Dispositivos Conectados
   - Conectar dispositivo
   - Escaneie o QR Code

---

## ✅ Verificar Conexão

### Ver Status do Bot

Acesse:
```
https://SUA-URL-DO-RAILWAY.up.railway.app/status
```

Deve retornar:
```json
{
  "status": "connected",
  "qr": null
}
```

### Ver Logs no Railway

1. No painel do Railway, clique no serviço
2. Clique em **"Deployments"**
3. Clique no último deployment
4. Veja os logs em tempo real

Você deve ver mensagens como:
```
✓ WhatsApp connected successfully
✓ Server running on port 3001
✓ Webhook configured: https://garcezpalha.com/api/whatsapp/baileys/webhook
```

---

## 🧪 Testar o Bot

Envie uma mensagem para o número do WhatsApp conectado:
```
Olá
```

O bot deve responder automaticamente com o menu de produtos!

---

## 🔧 Comandos Úteis

### Desconectar WhatsApp

```bash
curl -X POST https://SUA-URL-DO-RAILWAY.up.railway.app/disconnect
```

### Enviar Mensagem de Teste

```bash
curl -X POST https://SUA-URL-DO-RAILWAY.up.railway.app/send \
  -H "Content-Type: application/json" \
  -d '{
    "to": "5521999999999",
    "message": "Teste do bot!"
  }'
```

### Ver Status

```bash
curl https://SUA-URL-DO-RAILWAY.up.railway.app/status
```

---

## 🆘 Troubleshooting

### QR Code não aparece

**Solução:**
1. Aguarde 30-60 segundos após o deploy
2. Verifique os logs no Railway
3. Tente acessar `/status` primeiro
4. Se necessário, faça **Redeploy** no Railway

### "Cannot GET /qr"

**Solução:**
- O servidor ainda está iniciando
- Aguarde mais 10-20 segundos
- Verifique os logs para erros

### Mensagens não chegam no Next.js

**Solução:**
1. Verifique se `WEBHOOK_URL` está correta nas variáveis
2. Teste o webhook:
   ```bash
   curl -X POST https://garcezpalha.com/api/whatsapp/baileys/webhook \
     -H "Content-Type: application/json" \
     -d '{
       "from": "5521999999999",
       "message": "teste",
       "messageId": "123",
       "timestamp": "1234567890",
       "type": "text"
     }'
   ```
3. Veja os logs no Railway e no Vercel

### Desconexões frequentes

**Normal nas primeiras horas.**

Soluções:
- O Baileys reconecta automaticamente
- Verifique se o Railway não está em **sleep mode** (plano Hobby dorme após 30min de inatividade)
- Considere upgrade para plano Developer ($5/mês) para servidor sempre ativo

---

## 💰 Custos Railway

- **Hobby Plan (Grátis):**
  - $5 de crédito grátis/mês
  - Servidor dorme após 30min inativo
  - Bom para testes

- **Developer Plan ($5/mês):**
  - Servidor sempre ativo
  - Sem sleep mode
  - Recomendado para produção

---

## 📊 Monitoramento

### Ver métricas no Railway

1. Clique no serviço
2. Vá em **"Metrics"**
3. Veja CPU, memória, network

### Alertas

Configure no Railway:
1. **Settings** → **Notifications**
2. Adicione seu email
3. Receba alertas de crashes

---

## 🎯 Próximos Passos

Depois de conectar o WhatsApp:

1. ✅ Servidor rodando no Railway
2. ✅ WhatsApp conectado via QR Code
3. ✅ Bot recebendo mensagens
4. ✅ Sistema de qualificação processando
5. ✅ Respostas automáticas funcionando

---

## ⚠️ Avisos Importantes

- **Baileys não é oficial** do WhatsApp
- Conta pode ser **banida** se usar de forma abusiva
- Use com **moderação** e respeite os limites
- Para produção em grande escala, prefira **WhatsApp Cloud API oficial**
- Baileys é **perfeito para testes** e pequenos volumes

---

## 🔗 Links Úteis

- **Repositório:** https://github.com/leopalha/garcezpalha
- **Railway Dashboard:** https://railway.app/dashboard
- **Baileys Docs:** https://whiskeysockets.github.io/Baileys/

---

## ✅ Checklist Final

- [ ] Deploy feito no Railway
- [ ] Root directory configurado: `baileys-server`
- [ ] Variável WEBHOOK_URL adicionada
- [ ] Domínio público gerado
- [ ] QR Code acessado
- [ ] WhatsApp conectado
- [ ] Mensagem de teste enviada
- [ ] Bot respondeu automaticamente

---

**🎉 Pronto! Seu bot WhatsApp está rodando!**

Qualquer dúvida, veja os logs no Railway ou teste os endpoints da API.
