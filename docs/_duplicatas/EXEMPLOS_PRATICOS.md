# Exemplos Práticos - Garcez Palha

Exemplos de uso das automações e sistemas implementados.

## 📧 Email Sequences (P2-001)

### Exemplo 1: Inscrev lead na sequência de boas-vindas

```typescript
import { emailSequenceEngine } from '@/lib/email/sequences/engine'

// Quando lead preenche formulário
await emailSequenceEngine.subscribe('welcome-sequence', {
  event: 'lead_created',
  email: 'joao.silva@email.com',
  firstName: 'João',
  customData: {
    productId: 'revisao-contrato-bancario',
    source: 'google-ads',
  },
})

// Resultado:
// ✅ Email 1: Enviado imediatamente (Boas-vindas)
// ⏱️  Email 2: Agendado para daqui 48h (Por que escolher Garcez Palha)
// ⏱️  Email 3: Agendado para daqui 7 dias (Histórias de sucesso)
```

### Exemplo 2: API de inscrição

```bash
curl -X POST https://garcezpalha.com/api/email/sequences/subscribe \
  -H "Content-Type: application/json" \
  -d '{
    "sequenceId": "welcome-sequence",
    "email": "maria.santos@email.com",
    "firstName": "Maria",
    "customData": {
      "productId": "seguro-prestamista"
    }
  }'
```

## 💬 WhatsApp Automation (P2-002)

### Exemplo 1: Enviar mensagem de boas-vindas

```typescript
import { whatsAppEngine } from '@/lib/whatsapp/automation/engine'

// Após conversão de lead
await whatsAppEngine.sendWelcomeMessage(
  '5521999999999', // Número com código do país
  'João'
)

// Mensagem enviada:
// "Olá João! 👋
//
// Bem-vindo(a) à Garcez Palha - 364 anos de tradição jurídica.
//
// Seu caso foi recebido e já estamos analisando. Em até 24h um de nossos advogados entrará em contato.
//
// Enquanto isso, você pode acompanhar o andamento pelo link: ..."
```

### Exemplo 2: Notificação de pagamento

```typescript
// Após confirmação de pagamento
await whatsAppEngine.sendPaymentConfirmation(
  '5521999999999',
  'Maria',
  350000, // R$ 3.500,00 em centavos
  'CASO-2024-001'
)

// Mensagem enviada:
// "✅ Pagamento confirmado!
//
// Olá Maria,
//
// Recebemos seu pagamento de R$ 3.500,00.
//
// Seu caso #CASO-2024-001 está ativo e será distribuído em até 48h.
//
// Acompanhe em: ..."
```

### Exemplo 3: API de mensagens

```bash
curl -X POST https://garcezpalha.com/api/whatsapp/send \
  -H "Content-Type: application/json" \
  -d '{
    "to": "5521999999999",
    "type": "text",
    "text": {
      "body": "Seu processo foi atualizado! Acesse: https://garcezpalha.com/casos/123"
    }
  }'
```

## 📄 Legal Document Generator (P2-003)

### Exemplo 1: Gerar petição inicial

```typescript
import { legalDocumentGenerator } from '@/lib/documents/legal-document-generator'

const peticao = legalDocumentGenerator.generate('peticao-inicial', {
  autor: {
    nome: 'João da Silva',
    cpf: '123.456.789-00',
    endereco: 'Rua das Flores, 123 - Centro - Rio de Janeiro/RJ',
    profissao: 'Engenheiro',
  },
  reu: {
    nome: 'Banco XYZ S.A.',
    cnpj: '12.345.678/0001-90',
    endereco: 'Av. Paulista, 1000 - São Paulo/SP',
  },
  advogado: {
    nome: 'Dr. Roberto Garcez Palha',
    oab: '219.390',
  },
  comarca: 'Rio de Janeiro',
  vara: '1ª Vara Cível',
  fatos: [
    'O Autor firmou contrato de empréstimo com o Réu em 10/01/2023, no valor de R$ 50.000,00.',
    'Após análise detalhada do contrato, identificou-se cobrança de tarifas abusivas no montante de R$ 8.500,00.',
    'O Réu se recusou a revisar o contrato administrativamente, mesmo após notificação extrajudicial.',
  ],
  fundamentacao: [
    'O Código de Defesa do Consumidor (Lei 8.078/90) é aplicável às relações bancárias, conforme Súmula 297 do STJ.',
    'A Resolução CMN 3.919/2010 proíbe cobrança de tarifas não previstas em lei.',
    'Cabe repetição em dobro dos valores pagos indevidamente (art. 42, parágrafo único, CDC).',
  ],
  pedidos: [
    'Declarar a ilegalidade das tarifas cobradas indevidamente',
    'Condenar o Réu à restituição em dobro do valor de R$ 17.000,00',
    'Condenar o Réu ao pagamento de danos morais no valor de R$ 10.000,00',
  ],
  categoria: 'bancario',
  valorCausa: 27000,
  tutelaAntecipada: true,
})

console.log(peticao)
// Retorna documento completo formatado para protocolo judicial
```

### Exemplo 2: API de geração de documentos

```bash
curl -X POST https://garcezpalha.com/api/documents/legal \
  -H "Content-Type: application/json" \
  -d '{
    "type": "habeas-corpus",
    "data": {
      "autor": {
        "nome": "Pedro Santos",
        "cpf": "987.654.321-00",
        "endereco": "presentemente recolhido na Cadeia Pública de..."
      },
      "reu": {
        "nome": "MM. Juiz de Direito da 2ª Vara Criminal"
      },
      "advogado": {
        "nome": "Dr. Roberto Garcez Palha",
        "oab": "219.390"
      },
      "comarca": "Rio de Janeiro",
      "fatos": ["Prisão preventiva decretada sem fundamentação..."],
      "fundamentacao": ["Flagrante ilegalidade da prisão..."],
      "pedidos": ["Concessão de liminar para imediata soltura"]
    }
  }'
```

## ⚖️ Process Monitoring (P2-004)

### Exemplo 1: Monitorar processo

```typescript
import { processMonitor } from '@/lib/process-monitor/monitor-engine'

// Iniciar monitoramento
const session = await processMonitor.startMonitoring({
  numeroProcesso: '0123456-78.2024.8.19.0001',
  tribunal: 'TJ-RJ',
  comarca: 'Rio de Janeiro',
  vara: '1ª Vara Cível',
  status: 'em-andamento',
  dataDistribuicao: '2024-01-15',
  ultimaAtualizacao: '2024-12-20',
  assunto: 'Revisão de Contrato Bancário',
  classe: 'Procedimento Comum',
  autor: 'João da Silva',
  reu: 'Banco XYZ S.A.',
  monitoringEnabled: true,
  notificationChannels: ['email', 'whatsapp'],
  checkIntervalMinutes: 30, // Verifica a cada 30 minutos
  leadId: 'lead_123',
  conversationId: 'conv_456',
})

// Resultado:
// ✅ Monitoramento iniciado
// 🔔 Notificações por email e WhatsApp ativadas
// ⏱️  Próxima verificação em 30 minutos
```

### Exemplo 2: API de monitoramento

```bash
# Iniciar monitoramento
curl -X POST https://garcezpalha.com/api/process-monitor \
  -H "Content-Type: application/json" \
  -d '{
    "numeroProcesso": "0123456-78.2024.8.19.0001",
    "tribunal": "TJ-RJ",
    "comarca": "Rio de Janeiro",
    "vara": "1ª Vara Cível",
    "status": "em-andamento",
    "dataDistribuicao": "2024-01-15",
    "ultimaAtualizacao": "2024-12-20",
    "assunto": "Revisão de Contrato Bancário",
    "classe": "Procedimento Comum",
    "autor": "João da Silva",
    "reu": "Banco XYZ S.A.",
    "monitoringEnabled": true,
    "notificationChannels": ["email", "whatsapp"],
    "checkIntervalMinutes": 60
  }'

# Listar sessões ativas
curl https://garcezpalha.com/api/process-monitor

# Parar monitoramento
curl -X DELETE "https://garcezpalha.com/api/process-monitor?processo=0123456-78.2024.8.19.0001"
```

### Exemplo 3: Cron Job (Vercel)

```json
// vercel.json
{
  "crons": [
    {
      "path": "/api/process-monitor/cron",
      "schedule": "*/30 * * * *"
    }
  ]
}
```

## 📊 Automated Reports (P2-005)

### Exemplo 1: Gerar relatório de conversão

```typescript
import { reportGenerator } from '@/lib/reports/report-generator'

// Registrar configuração
const config: ReportConfig = {
  id: 'conversao-mensal',
  type: 'leads-conversion',
  name: 'Relatório Mensal de Conversão',
  description: 'Análise completa de conversão de leads',
  frequency: 'monthly',
  format: 'html',
  enabled: true,
  timezone: 'America/Sao_Paulo',
  recipients: [
    { email: 'roberto@garcezpalha.com', name: 'Roberto Garcez', role: 'CEO' },
    { email: 'marketing@garcezpalha.com', name: 'Equipe Marketing', role: 'Marketing' },
  ],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
}

reportGenerator.registerReport(config)

// Gerar relatório
const report = await reportGenerator.generateReport('conversao-mensal')

// Resultado:
// ✅ Relatório gerado
// 📧 Enviado para 2 destinatários
// 📈 Taxa de conversão: 19.3%
// 💰 Receita: R$ 238.500,00
```

### Exemplo 2: API de relatórios

```bash
# Gerar relatório sob demanda
curl -X POST https://garcezpalha.com/api/reports/generate \
  -H "Content-Type: application/json" \
  -d '{
    "type": "revenue-monthly",
    "name": "Receita Dezembro 2024",
    "format": "json",
    "dateRange": {
      "start": "2024-12-01",
      "end": "2024-12-31"
    },
    "recipients": [
      {"email": "roberto@garcezpalha.com", "name": "Roberto Garcez"}
    ]
  }'

# Listar tipos disponíveis
curl https://garcezpalha.com/api/reports/generate?types=true
```

### Exemplo 3: Exportar em diferentes formatos

```typescript
// JSON
const jsonReport = await reportGenerator.exportReport(report, 'json')

// CSV
const csvReport = await reportGenerator.exportReport(report, 'csv')
// Métrica,Valor,Unidade,Tendência,Variação
// Taxa de Conversão,19.3,%,up,3.2
// Ticket Médio,R$ 3559.70,,up,8.5

// HTML (para email)
const htmlReport = await reportGenerator.exportReport(report, 'html')
// <html>... relatório completo formatado ...</html>
```

## 🔄 Fluxo Completo: Lead → Conversão → Processo

### Cenário: Cliente chega pelo Google Ads

```typescript
// 1. Lead preenche formulário
const lead = {
  name: 'Carlos Souza',
  email: 'carlos@email.com',
  phone: '5521987654321',
  product: 'revisao-contrato-bancario',
  source: 'google-ads',
}

// 2. Inscreve em sequência de emails
await emailSequenceEngine.subscribe('welcome-sequence', {
  event: 'lead_created',
  email: lead.email,
  firstName: lead.name.split(' ')[0],
  customData: {
    productId: lead.product,
    source: lead.source,
  },
})

// 3. Envia mensagem de boas-vindas no WhatsApp
await whatsAppEngine.sendWelcomeMessage(lead.phone, lead.name.split(' ')[0])

// 4. Cliente realiza pagamento
const payment = {
  leadId: 'lead_789',
  amount: 350000, // R$ 3.500,00
  caseNumber: 'CASO-2024-123',
}

await whatsAppEngine.sendPaymentConfirmation(
  lead.phone,
  lead.name.split(' ')[0],
  payment.amount,
  payment.caseNumber
)

// 5. Gera petição inicial
const peticao = legalDocumentGenerator.generate('peticao-inicial', {
  autor: {
    nome: lead.name,
    cpf: '123.456.789-00',
    endereco: 'Rua ...',
  },
  reu: {
    nome: 'Banco ABC',
    cnpj: '12.345.678/0001-90',
    endereco: 'Av. ...',
  },
  advogado: {
    nome: 'Dr. Roberto Garcez Palha',
    oab: '219.390',
  },
  comarca: 'Rio de Janeiro',
  vara: '1ª Vara Cível',
  fatos: ['...'],
  fundamentacao: ['...'],
  pedidos: ['...'],
  categoria: 'bancario',
  valorCausa: 50000,
})

// 6. Protocola processo e inicia monitoramento
const session = await processMonitor.startMonitoring({
  numeroProcesso: '0123456-78.2024.8.19.0001',
  tribunal: 'TJ-RJ',
  comarca: 'Rio de Janeiro',
  vara: '1ª Vara Cível',
  status: 'em-andamento',
  dataDistribuicao: new Date().toISOString(),
  ultimaAtualizacao: new Date().toISOString(),
  assunto: 'Revisão de Contrato Bancário',
  classe: 'Procedimento Comum',
  autor: lead.name,
  reu: 'Banco ABC',
  monitoringEnabled: true,
  notificationChannels: ['email', 'whatsapp'],
  checkIntervalMinutes: 60,
  leadId: 'lead_789',
  conversationId: payment.caseNumber,
})

// 7. Cliente recebe notificações automáticas quando:
// - Processo é citado
// - Há audiência marcada
// - Sentença é proferida
// - Recurso precisa ser interposto
// - Prazo está chegando ao fim
```

## 🎯 Integração com Estado da Conversação

```typescript
import { updateConversationState } from '@/lib/ai/conversation/state-machine'

// Quando processo tem movimentação importante
async function handleProcessMovement(movement: ProcessMovement) {
  if (movement.tipo === 'sentenca') {
    // Atualiza estado da conversação
    await updateConversationState(movement.conversationId, {
      currentState: 'SENTENCA_RECEBIDA',
      metadata: {
        dataMovimento: movement.data,
        descricao: movement.descricao,
        requiresAction: movement.requiresAction,
        prazoFatal: movement.prazoFatal,
      },
    })

    // Notifica cliente via WhatsApp
    await whatsAppEngine.sendMessage({
      to: conversation.leadPhone,
      type: 'text',
      text: {
        body: `🎉 Boa notícia, ${conversation.leadName}!

Sentença proferida no seu processo!

${movement.descricao}

Acesse para ver detalhes: https://garcezpalha.com/casos/${conversation.id}`,
      },
    })

    // Se houver prazo fatal, agenda email de lembrete
    if (movement.prazoFatal) {
      await emailSequenceEngine.subscribe('prazo-fatal-reminder', {
        event: 'prazo_fatal_detected',
        email: conversation.leadEmail,
        firstName: conversation.leadName.split(' ')[0],
        customData: {
          numeroProcesso: movement.numeroProcesso,
          prazo: movement.prazoFatal,
          descricao: movement.descricao,
        },
      })
    }
  }
}
```

## 📈 Dashboards e Métricas

```typescript
// Gerar dashboard completo
const dashboard = {
  leads: await reportGenerator.generateReport('leads-conversion'),
  revenue: await reportGenerator.generateReport('revenue-monthly'),
  cases: await reportGenerator.generateReport('cases-status'),
  products: await reportGenerator.generateReport('product-performance'),
  agents: await reportGenerator.generateReport('agent-performance'),
  payments: await reportGenerator.generateReport('payment-analysis'),
  operations: await reportGenerator.generateReport('operational-metrics'),
}

// Resultado: Dashboard completo com todos os KPIs do negócio
```

## 🔐 Compliance e Segurança

```typescript
// Verificação automática de compliance OAB
const complianceReport = await reportGenerator.generateReport('compliance-oab')

// Identifica:
// ✅ Frases proibidas em contratos
// ✅ Garantias de resultado
// ✅ Descumprimento do Código de Ética
// ✅ Ausência de disclaimers obrigatórios

// Gera recomendações automáticas
```

---

## 📚 Próximos Passos

1. **Configurar Cron Jobs** no Vercel para:
   - Email sequences (verificar a cada 15 min)
   - Process monitoring (verificar a cada 30 min)
   - Reports (gerar diariamente às 8h)

2. **Configurar Webhooks** para:
   - Pagamentos (Stripe)
   - Assinaturas de contratos (ClickSign)
   - Processos (tribunais que suportam)

3. **Implementar MCP Servers** (P2-006):
   - JusBrasil
   - PJe
   - CNJ
   - ClickSign
   - Stripe
   - Google Analytics
   - Facebook Ads
   - Google Ads
   - HubSpot
   - Intercom

4. **Dashboards Visuais**:
   - Criar componentes React para visualização
   - Integrar com Recharts/Chart.js
   - Adicionar filtros e drill-down

5. **Testes**:
   - Testes unitários para cada sistema
   - Testes de integração
   - Testes de carga (stress testing)

---

**Última atualização:** 29/12/2024
**Versão:** 1.0
**Status:** ✅ Implementado
