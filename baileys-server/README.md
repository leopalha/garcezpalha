# Garcez Palha - WhatsApp Baileys Server

Servidor dedicado para conexão WhatsApp usando Baileys.

## 🚀 Deploy no Railway

### 1. Criar Projeto no Railway

```bash
# Login no Railway
railway login

# Criar novo projeto
railway init

# Link para o projeto
railway link
```

### 2. Configurar Variáveis de Ambiente

No painel do Railway, adicione:

```
WEBHOOK_URL=https://garcezpalha.com/api/whatsapp/baileys/webhook
PORT=3001
```

### 3. Deploy

```bash
railway up
```

## 📡 Endpoints

### GET /
Retorna status do serviço

### GET /status
Retorna status da conexão WhatsApp

### GET /qr
Retorna QR Code para conexão (base64)

### POST /send
Envia mensagem WhatsApp

```json
{
  "to": "5521999999999",
  "message": "Olá!"
}
```

### POST /disconnect
Desconecta do WhatsApp

## 🔧 Desenvolvimento Local

```bash
cd baileys-server
npm install
npm run dev
```

Acesse: http://localhost:3001

## 📱 Como Conectar

1. Acesse: `http://seu-railway-url/qr`
2. Copie o QR Code (base64)
3. Escaneie com WhatsApp
4. Pronto!

## 🔄 Integração com Next.js

O servidor envia mensagens recebidas para:
```
https://garcezpalha.com/api/whatsapp/baileys/webhook
```

Crie esse endpoint no seu Next.js para processar as mensagens.
