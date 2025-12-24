import express from 'express'
import cors from 'cors'
import QRCode from 'qrcode'
import { Boom } from '@hapi/boom'
import makeWASocket, {
  DisconnectReason,
  useMultiFileAuthState,
  fetchLatestBaileysVersion,
  makeCacheableSignalKeyStore
} from '@whiskeysockets/baileys'
import pino from 'pino'

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors())
app.use(express.json())

// Estado global
let sock = null
let qr = null
let connectionStatus = 'disconnected'
let webhookUrl = process.env.WEBHOOK_URL || 'https://garcezpalha.com/api/whatsapp-cloud/webhook'

const logger = pino({ level: 'silent' })

// =============================================================================
// BAILEYS CONNECTION
// =============================================================================

async function connectToWhatsApp() {
  const { state, saveCreds } = await useMultiFileAuthState('auth_info_baileys')
  const { version } = await fetchLatestBaileysVersion()

  sock = makeWASocket({
    version,
    logger,
    auth: {
      creds: state.creds,
      keys: makeCacheableSignalKeyStore(state.keys, logger),
    },
    getMessage: async (key) => {
      return { conversation: 'Hello' }
    }
  })

  // =============================================================================
  // CONNECTION EVENTS
  // =============================================================================

  sock.ev.on('connection.update', async (update) => {
    const { connection, lastDisconnect, qr: newQr } = update

    // QR Code gerado
    if (newQr) {
      console.log('[WhatsApp] QR Code gerado')
      qr = await QRCode.toDataURL(newQr)
      connectionStatus = 'qr'
    }

    // Conexão estabelecida
    if (connection === 'open') {
      console.log('[WhatsApp] Conectado!')
      qr = null
      connectionStatus = 'connected'
    }

    // Conexão fechada
    if (connection === 'close') {
      const shouldReconnect = (lastDisconnect?.error instanceof Boom)
        ? lastDisconnect.error.output.statusCode !== DisconnectReason.loggedOut
        : true

      console.log('[WhatsApp] Conexão fechada. Reconectar?', shouldReconnect)
      connectionStatus = 'disconnected'

      if (shouldReconnect) {
        setTimeout(() => connectToWhatsApp(), 3000)
      }
    }
  })

  // Salvar credenciais
  sock.ev.on('creds.update', saveCreds)

  // =============================================================================
  // MESSAGE HANDLER
  // =============================================================================

  sock.ev.on('messages.upsert', async ({ messages, type }) => {
    console.log('[DEBUG] messages.upsert triggered, type:', type, 'messages:', messages.length)

    if (type !== 'notify') {
      console.log('[DEBUG] Ignoring type:', type)
      return
    }

    const message = messages[0]
    console.log('[DEBUG] Message object:', JSON.stringify(message, null, 2))

    if (!message.message) {
      console.log('[DEBUG] No message content')
      return
    }
    if (message.key.fromMe) {
      console.log('[DEBUG] Message from me, ignoring')
      return
    }

    console.log('[WhatsApp] Mensagem recebida:', message.key.remoteJid)

    // Extrair dados da mensagem
    const from = message.key.remoteJid
    const messageText = message.message.conversation ||
      message.message.extendedTextMessage?.text ||
      ''

    console.log('[DEBUG] Texto da mensagem:', messageText)
    console.log('[DEBUG] Webhook URL:', webhookUrl)

    if (!messageText) {
      console.log('[DEBUG] Mensagem vazia, ignorando')
      return
    }

    // TEMPORÁRIO: Resposta direta (webhook não está funcionando no Vercel)
    const welcomeMessage = `Olá! 👋 Bem-vindo ao *Garcez Palha - Inteligência Jurídica*

364 anos de tradição, nobreza e excelência.

Como posso ajudá-lo hoje?

📋 *Áreas de Atuação:*
• Proteção Financeira (golpes PIX, conta bloqueada)
• Direito Imobiliário
• Perícias Técnicas
• Saúde e Previdência
• Defesa Criminal

Digite sua dúvida ou problema que vou direcioná-lo para o especialista adequado.`

    // Enviar resposta imediata
    try {
      await sock.sendMessage(from, { text: welcomeMessage })
      console.log('[WhatsApp] Resposta enviada com sucesso!')
    } catch (sendError) {
      console.error('[WhatsApp] Erro ao enviar mensagem:', sendError.message)
    }
  })
}

// =============================================================================
// REST API ENDPOINTS
// =============================================================================

// GET / - Status
app.get('/', (req, res) => {
  res.json({
    service: 'Garcez Palha WhatsApp Baileys Server',
    status: connectionStatus,
    version: '1.0.0',
    timestamp: new Date().toISOString()
  })
})

// GET /status - Connection status
app.get('/status', (req, res) => {
  res.json({
    connected: connectionStatus === 'connected',
    status: connectionStatus,
    hasQR: !!qr,
    timestamp: new Date().toISOString()
  })
})

// GET /qr - Get QR Code
app.get('/qr', (req, res) => {
  if (!qr) {
    return res.status(404).json({
      error: 'QR Code não disponível',
      status: connectionStatus
    })
  }

  res.json({
    qr,
    status: connectionStatus,
    timestamp: new Date().toISOString()
  })
})

// POST /send - Send message
app.post('/send', async (req, res) => {
  if (connectionStatus !== 'connected') {
    return res.status(503).json({
      error: 'WhatsApp não conectado',
      status: connectionStatus
    })
  }

  const { to, message } = req.body

  if (!to || !message) {
    return res.status(400).json({
      error: 'Campos "to" e "message" são obrigatórios'
    })
  }

  try {
    // Formatar número (adicionar @s.whatsapp.net se necessário)
    const jid = to.includes('@') ? to : `${to}@s.whatsapp.net`

    await sock.sendMessage(jid, { text: message })

    res.json({
      success: true,
      to: jid,
      message,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('[Send] Erro:', error)
    res.status(500).json({
      error: 'Erro ao enviar mensagem',
      details: error.message
    })
  }
})

// POST /disconnect - Logout
app.post('/disconnect', async (req, res) => {
  if (sock) {
    await sock.logout()
    connectionStatus = 'disconnected'
    qr = null

    res.json({
      success: true,
      message: 'Desconectado do WhatsApp'
    })
  } else {
    res.status(400).json({
      error: 'Nenhuma conexão ativa'
    })
  }
})

// =============================================================================
// START SERVER
// =============================================================================

app.listen(PORT, async () => {
  console.log(`🚀 Baileys Server rodando na porta ${PORT}`)
  console.log(`📱 Webhook URL: ${webhookUrl}`)
  console.log(`🔗 Iniciando conexão com WhatsApp...`)

  // Conectar ao WhatsApp
  await connectToWhatsApp()
})
