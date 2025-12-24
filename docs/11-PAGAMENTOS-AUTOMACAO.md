# 11 - PAGAMENTOS E AUTOMAÇÃO
## Garcez Palha - Inteligência Jurídica

---

## 1. GATEWAY DE PAGAMENTO

### 1.1 Mercado Pago (Principal)

```
POR QUE MERCADO PAGO:
✓ Maior confiança no Brasil
✓ PIX integrado
✓ Parcelamento até 12x
✓ API robusta
✓ Checkout transparente

TAXAS:
├── Cartão de crédito: 4,99% + R$ 0,49
├── PIX: 0,99%
├── Boleto: R$ 3,99
└── Parcelado (cliente paga): varia
```

### 1.2 Configuração

```javascript
// Credenciais
const MP_ACCESS_TOKEN = process.env.MP_ACCESS_TOKEN;
const MP_PUBLIC_KEY = process.env.MP_PUBLIC_KEY;

// Criar preferência de pagamento
async function createPaymentLink(orderData) {
  const preference = {
    items: [{
      title: orderData.service,
      quantity: 1,
      unit_price: orderData.amount,
      currency_id: 'BRL'
    }],
    payer: {
      name: orderData.clientName,
      email: orderData.clientEmail,
      phone: { number: orderData.clientPhone }
    },
    payment_methods: {
      excluded_payment_types: [{ id: 'ticket' }], // sem boleto
      installments: 6 // máximo de parcelas
    },
    back_urls: {
      success: 'https://garcezpalha.com/pagamento/sucesso',
      failure: 'https://garcezpalha.com/pagamento/erro',
      pending: 'https://garcezpalha.com/pagamento/pendente'
    },
    auto_return: 'approved',
    external_reference: orderData.orderId,
    notification_url: 'https://api.garcezpalha.com/webhooks/mercadopago'
  };

  const response = await mercadopago.preferences.create(preference);
  return response.body.init_point; // URL do checkout
}
```

---

## 2. FLUXO DE PAGAMENTO

### 2.1 Fluxo Completo

```
[1] CLIENTE ACEITA PROPOSTA
    │
    ▼
[2] SISTEMA GERA LINK (Mercado Pago)
    │
    ▼
[3] ENVIA LINK VIA WHATSAPP
    │
    ├─── [CLIENTE PAGA]
    │         │
    │         ▼
    │    [4] WEBHOOK RECEBE NOTIFICAÇÃO
    │         │
    │         ▼
    │    [5] VALIDA PAGAMENTO
    │         │
    │         ├── APROVADO
    │         │      │
    │         │      ▼
    │         │   [6] ATUALIZA STATUS
    │         │      │
    │         │      ▼
    │         │   [7] DISPARA CONTRATO
    │         │      │
    │         │      ▼
    │         │   [8] NOTIFICA CLIENTE
    │         │
    │         └── PENDENTE/REJEITADO
    │                │
    │                ▼
    │            [FOLLOW-UP]
    │
    └─── [CLIENTE NÃO PAGA - 24h]
              │
              ▼
         [FOLLOW-UP AUTOMÁTICO]
```

### 2.2 Webhook Mercado Pago

```javascript
// n8n Workflow ou API própria
app.post('/webhooks/mercadopago', async (req, res) => {
  const { type, data } = req.body;
  
  if (type === 'payment') {
    const paymentId = data.id;
    
    // Buscar detalhes do pagamento
    const payment = await mercadopago.payment.get(paymentId);
    
    const { status, external_reference, transaction_amount } = payment.body;
    
    switch (status) {
      case 'approved':
        await handleApprovedPayment(external_reference, transaction_amount);
        break;
      case 'pending':
        await handlePendingPayment(external_reference);
        break;
      case 'rejected':
        await handleRejectedPayment(external_reference);
        break;
    }
  }
  
  res.status(200).send('OK');
});

async function handleApprovedPayment(orderId, amount) {
  // 1. Atualizar banco de dados
  await db.orders.update(orderId, { 
    status: 'paid', 
    paid_at: new Date(),
    amount_paid: amount 
  });
  
  // 2. Gerar contrato
  const contract = await generateContract(orderId);
  
  // 3. Enviar para assinatura (ZapSign)
  const signatureLink = await sendToZapSign(contract);
  
  // 4. Notificar cliente via WhatsApp
  await sendWhatsApp(orderId, 'payment_confirmed', { signatureLink });
  
  // 5. Notificar equipe
  await notifyTeam('new_payment', orderId);
}
```

---

## 3. TABELA DE PREÇOS E PARCELAMENTO

### 3.1 Regras de Parcelamento

```
PARCELAMENTO PADRÃO:
├── À vista (PIX/Cartão): 5% desconto
├── 2x: sem juros
├── 3x: sem juros
├── 4-6x: sem juros
├── 7-12x: cliente paga juros (MP)

ENTRADA + PARCELAMENTO:
├── Entrada: 50% no ato
├── Saldo: até 3x sem juros
└── Alternativa: 6x com entrada menor
```

### 3.2 Exemplos de Cálculo

```
DESBLOQUEIO R$ 2.500:
├── PIX/À vista: R$ 2.375 (5% desc)
├── 2x cartão: 2x R$ 1.250
├── 3x cartão: 3x R$ 833,33
├── 50% + 3x: R$ 1.250 + 3x R$ 416,67

USUCAPIÃO R$ 7.000:
├── PIX/À vista: R$ 6.650 (5% desc)
├── 3x cartão: 3x R$ 2.333,33
├── 6x cartão: 6x R$ 1.166,67
├── 50% + 3x: R$ 3.500 + 3x R$ 1.166,67
```

---

## 4. MENSAGENS AUTOMÁTICAS

### 4.1 Envio do Link

```
"Perfeito! 🎉 Aqui está o link de pagamento:

{LINK_MERCADO_PAGO}

Formas de pagamento:
💳 Cartão de crédito (até 6x sem juros)
📱 PIX (5% de desconto)

Assim que confirmar, você recebe o contrato 
para assinar pelo celular.

Qualquer dúvida, estou aqui!"
```

### 4.2 Pagamento Confirmado

```
"Pagamento confirmado! ✅

Seu contrato já está a caminho. Você vai receber 
um link para assinar digitalmente (leva 1 minuto).

Enquanto isso, já pode ir separando os documentos:
📎 RG ou CNH
📎 CPF
📎 Comprovante de residência
📎 {DOCS_ESPECIFICOS}

Assim que assinar o contrato e enviar os docs, 
começamos a trabalhar no seu caso!"
```

### 4.3 Follow-up (Não Pagou)

```
// Após 2 horas
"Oi {nome}! Vi que você ainda está no processo de pagamento.

Teve algum problema? Posso ajudar?

O link ainda está ativo: {link}"

// Após 24 horas
"Oi {nome}! 👋

Passando pra lembrar que sua proposta ainda está disponível.

Cada dia que passa é um dia a mais com o problema.
Se quiser, posso gerar um novo link ou ajustar algo.

É só me avisar!"

// Após 72 horas
"Oi {nome}!

Sua proposta de R$ {valor} para {serviço} ainda está válida.

Se a situação mudou ou você tem alguma dúvida, 
é só me chamar. Sem compromisso.

Fico à disposição! 🙏"
```

---

## 5. GESTÃO FINANCEIRA

### 5.1 Banco de Dados

```sql
CREATE TABLE payments (
  id UUID PRIMARY KEY,
  order_id UUID REFERENCES orders(id),
  mercadopago_id VARCHAR(50),
  amount DECIMAL(10,2),
  status VARCHAR(20), -- pending, approved, rejected, refunded
  payment_method VARCHAR(30), -- credit_card, pix, debit
  installments INTEGER,
  payer_email VARCHAR(100),
  created_at TIMESTAMP,
  approved_at TIMESTAMP,
  metadata JSONB
);

CREATE TABLE orders (
  id UUID PRIMARY KEY,
  lead_id UUID REFERENCES qualified_leads(id),
  product VARCHAR(50),
  package VARCHAR(30),
  total_amount DECIMAL(10,2),
  discount_amount DECIMAL(10,2),
  final_amount DECIMAL(10,2),
  payment_status VARCHAR(20), -- pending, partial, paid
  contract_status VARCHAR(20), -- pending, sent, signed
  created_at TIMESTAMP,
  paid_at TIMESTAMP
);
```

### 5.2 Dashboard Financeiro

```
┌─────────────────────────────────────────────────────────────────────┐
│                    DASHBOARD FINANCEIRO                              │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  HOJE                          ESTE MÊS                             │
│  ├── Recebido: R$ ___          ├── Recebido: R$ ___                │
│  ├── Pendente: R$ ___          ├── Pendente: R$ ___                │
│  └── Contratos: ___            └── Contratos: ___                  │
│                                                                      │
│  MÉTODOS DE PAGAMENTO (MÊS)                                        │
│  ├── PIX: __% (R$ ___)                                             │
│  ├── Cartão: __% (R$ ___)                                          │
│  └── Outros: __% (R$ ___)                                          │
│                                                                      │
│  TAXAS PAGAS (MÊS)                                                 │
│  └── Total: R$ ___ (___% do faturamento)                           │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 6. AUTOMAÇÕES N8N

### 6.1 Workflow: Pagamento Aprovado

```
TRIGGER: Webhook Mercado Pago (payment.approved)
    │
    ▼
NODE 1: Extrair dados do pagamento
    │
    ▼
NODE 2: Buscar pedido no Supabase
    │
    ▼
NODE 3: Atualizar status para "paid"
    │
    ▼
NODE 4: Gerar PDF do contrato
    │
    ▼
NODE 5: Enviar para ZapSign
    │
    ▼
NODE 6: Enviar WhatsApp (confirmação)
    │
    ▼
NODE 7: Enviar notificação interna (Telegram/Email)
```

### 6.2 Workflow: Follow-up Pagamento

```
TRIGGER: Schedule (a cada 2 horas)
    │
    ▼
NODE 1: Buscar pedidos pendentes > 2h
    │
    ▼
NODE 2: Filtrar (não enviou follow-up ainda)
    │
    ▼
NODE 3: Para cada pedido:
    │
    ├── Se 2-6h: Enviar follow-up #1
    ├── Se 6-24h: Enviar follow-up #2
    ├── Se 24-72h: Enviar follow-up #3
    └── Se > 72h: Marcar como "abandoned"
    │
    ▼
NODE 4: Atualizar registro de follow-ups
```

---

## 7. REEMBOLSOS

### 7.1 Política

```
ANTES DO PROTOCOLO (72h):
└── 100% reembolso (menos taxas gateway)

APÓS PROTOCOLO, ANTES DECISÃO:
└── 50% reembolso

APÓS DECISÃO:
└── Sem reembolso (serviço concluído)
```

### 7.2 Processo de Reembolso

```javascript
async function processRefund(orderId, reason) {
  const order = await db.orders.get(orderId);
  const payment = await db.payments.getByOrderId(orderId);
  
  // Calcular valor do reembolso
  let refundAmount;
  if (order.protocol_date === null) {
    refundAmount = payment.amount; // 100%
  } else if (order.decision_date === null) {
    refundAmount = payment.amount * 0.5; // 50%
  } else {
    throw new Error('Não elegível para reembolso');
  }
  
  // Processar no Mercado Pago
  const refund = await mercadopago.refund.create({
    payment_id: payment.mercadopago_id,
    amount: refundAmount
  });
  
  // Registrar
  await db.refunds.create({
    order_id: orderId,
    payment_id: payment.id,
    amount: refundAmount,
    reason: reason,
    status: refund.status
  });
  
  // Notificar cliente
  await sendWhatsApp(order.lead_id, 'refund_processed', { 
    amount: refundAmount 
  });
}
```

---

## 8. RELATÓRIOS

### 8.1 Relatório Diário (Automático)

```
📊 RELATÓRIO DIÁRIO - {DATA}
Garcez Palha Inteligência Jurídica

PAGAMENTOS
├── Recebidos: {QTD} (R$ {VALOR})
├── Pendentes: {QTD} (R$ {VALOR})
└── Cancelados: {QTD}

CONTRATOS
├── Assinados: {QTD}
├── Aguardando: {QTD}
└── Iniciados: {QTD}

CONVERSÃO
├── Propostas enviadas: {QTD}
├── Propostas aceitas: {QTD} ({TAXA}%)
└── Ticket médio: R$ {VALOR}

PRÓXIMOS PASSOS
├── Docs pendentes: {QTD} clientes
├── Petições para protocolar: {QTD}
└── Follow-ups agendados: {QTD}
```

### 8.2 Métricas Chave

```
MONITORAR DIARIAMENTE:
├── Taxa de conversão proposta→pagamento
├── Tempo médio até pagamento
├── Taxa de abandono
├── Ticket médio
└── % por método de pagamento

MONITORAR SEMANALMENTE:
├── CAC (Custo de Aquisição)
├── LTV (Lifetime Value)
├── Margem líquida
└── Taxa de reembolso
```

---

## 9. SEGURANÇA

### 9.1 Boas Práticas

```
✓ Nunca armazenar dados de cartão
✓ Usar HTTPS em todas as URLs
✓ Validar webhooks (assinatura)
✓ Tokens em variáveis de ambiente
✓ Logs de todas as transações
✓ Backup diário do banco
```

### 9.2 Validação de Webhook

```javascript
function validateMercadoPagoWebhook(req) {
  const signature = req.headers['x-signature'];
  const requestId = req.headers['x-request-id'];
  
  // Validar assinatura
  const expectedSignature = crypto
    .createHmac('sha256', MP_WEBHOOK_SECRET)
    .update(requestId + JSON.stringify(req.body))
    .digest('hex');
  
  return signature === expectedSignature;
}
```

---

## 10. CHECKLIST

```
CONFIGURAÇÃO INICIAL:
[ ] Conta Mercado Pago criada
[ ] API Keys configuradas
[ ] Webhook URL registrada
[ ] URLs de retorno configuradas
[ ] Testes em sandbox realizados
[ ] Migrado para produção

MONITORAMENTO:
[ ] Alertas de falha configurados
[ ] Dashboard atualizado
[ ] Relatórios automáticos
[ ] Reconciliação diária
```

---

*Documento: 11-PAGAMENTOS-AUTOMACAO.md*
*Versão: 1.0*
