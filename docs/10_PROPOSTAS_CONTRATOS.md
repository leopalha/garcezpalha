# 10 - PROPOSTAS E CONTRATOS
## Garcez Palha - Inteligência Jurídica

---

## 1. FLUXO DE PROPOSTA

```
[QUALIFICADO] → [GERAR PROPOSTA] → [ENVIAR] → [OBJEÇÕES?] → [ACEITE] → [CONTRATO]
```

---

## 2. MODELO DE PROPOSTA (WhatsApp)

```
📋 PROPOSTA COMERCIAL
Garcez Palha Inteligência Jurídica
━━━━━━━━━━━━━━━━━━━━━━━━

Olá, {NOME}!

📌 RESUMO DO CASO
{RESUMO_PROBLEMA}

✅ SOLUÇÃO
{EXPLICACAO_SOLUCAO}

💰 INVESTIMENTO
Pacote {NOME_PACOTE}: R$ {VALOR}

Inclui:
• {ITEM_1}
• {ITEM_2}
• {ITEM_3}

💳 PAGAMENTO
• 50% agora: R$ {ENTRADA}
• 50% em até 3x: R$ {PARCELA}
• À vista com 5%: R$ {AVISTA}

⏱️ PRAZO
Primeira ação em até 72 horas.

━━━━━━━━━━━━━━━━━━━━━━━━

Quer começar? Confirma que mando o link!
```

---

## 3. CONTRATO PADRÃO

```
CONTRATO DE PRESTAÇÃO DE SERVIÇOS ADVOCATÍCIOS

CONTRATANTE:
Nome: {NOME_COMPLETO}
CPF: {CPF}
Endereço: {ENDERECO}
Telefone: {TELEFONE}

CONTRATADO:
LEONARDO MENDONÇA PALHA DA SILVA
OAB/RJ 219.390

CLÁUSULA 1ª - DO OBJETO
O CONTRATADO prestará serviços advocatícios consistentes em:
{DESCRICAO_SERVICOS}

CLÁUSULA 2ª - DOS HONORÁRIOS
Valor: R$ {VALOR_TOTAL} ({VALOR_EXTENSO})
Pagamento:
a) Entrada: R$ {ENTRADA}
b) Saldo: {PARCELAS}x de R$ {VALOR_PARCELA}

CLÁUSULA 3ª - OBRIGAÇÕES DO CONTRATANTE
a) Fornecer documentos necessários
b) Comparecer quando convocado
c) Manter dados atualizados
d) Efetuar pagamentos nas datas

CLÁUSULA 4ª - OBRIGAÇÕES DO CONTRATADO
a) Defender interesses com zelo
b) Manter CONTRATANTE informado
c) Praticar atos necessários
d) Guardar sigilo

CLÁUSULA 5ª - VIGÊNCIA
Até trânsito em julgado ou encerramento do caso.

CLÁUSULA 6ª - RESCISÃO
Pode ser rescindido por mútuo acordo, inadimplemento 
ou desistência (honorários proporcionais devidos).

CLÁUSULA 7ª - FORO
Comarca do Rio de Janeiro/RJ.

{CIDADE}, {DATA}

_______________________________
CONTRATANTE

_______________________________
CONTRATADO - OAB/RJ 219.390
```

---

## 4. ASSINATURA DIGITAL (ZapSign)

```
FLUXO:
1. Cliente aceita proposta
2. Sistema gera contrato (PDF)
3. Envia para ZapSign via API
4. Cliente recebe link
5. Assina pelo celular
6. Webhook notifica conclusão
7. Contrato salvo no sistema

CUSTO: ~R$ 0,50/documento
VALIDADE: Lei 14.063/2020
```

### API ZapSign

```javascript
async function createContract(clientData) {
  const response = await fetch('https://api.zapsign.com.br/api/v1/docs/', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${ZAPSIGN_TOKEN}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      name: `Contrato - ${clientData.name}`,
      url_pdf: contractPdfUrl,
      signers: [{
        name: clientData.name,
        phone_number: clientData.phone,
        auth_mode: 'sms',
        send_automatic_whatsapp: true
      }]
    })
  });
  return response.json();
}
```

---

## 5. MENSAGENS AUTOMÁTICAS

```
PAGAMENTO CONFIRMADO:
"Pagamento confirmado! ✅
Enviamos o contrato para assinatura.
Você recebe o link no WhatsApp. Leva 1 minuto!"

CONTRATO ASSINADO:
"Contrato assinado! 🎉
Agora preciso dos documentos:
📎 RG ou CNH
📎 CPF  
📎 Comprovante de residência
📎 {DOCS_ESPECIFICOS}
Pode mandar foto aqui mesmo!"

FOLLOW-UP (24h sem pagar):
"Oi {nome}! Vi que ainda não concluiu o pagamento.
Posso ajudar com alguma dúvida?
Link ainda ativo: {link}"
```

---

## 6. BANCO DE DADOS

```sql
CREATE TABLE contracts (
  id UUID PRIMARY KEY,
  contract_number VARCHAR(20) UNIQUE,
  lead_id UUID REFERENCES qualified_leads(id),
  client_name VARCHAR(100),
  client_cpf VARCHAR(14),
  service_type VARCHAR(50),
  total_value DECIMAL(10,2),
  payment_status VARCHAR(20),
  signature_status VARCHAR(20),
  zapsign_doc_id VARCHAR(100),
  pdf_url TEXT,
  signed_pdf_url TEXT,
  created_at TIMESTAMP,
  signed_at TIMESTAMP
);
```

---

## 7. COMPLIANCE

### OAB
```
CONTRATO DEVE TER:
✓ Identificação das partes
✓ Objeto (serviços)
✓ Valor dos honorários
✓ Forma de pagamento
✓ Cláusula de sigilo
✓ Foro
✓ Data e assinatura
```

### LGPD
```
CONSENTIMENTO:
"Autorizo coleta e processamento de dados pessoais 
para prestação dos serviços, conforme LGPD."
```

---

## 8. CHECKLIST

```
ANTES DA PROPOSTA:
[ ] Lead qualificado?
[ ] Dados coletados?
[ ] Produto identificado?
[ ] Preço calculado?

ANTES DO CONTRATO:
[ ] Pagamento confirmado?
[ ] Dados completos?
[ ] Descrição correta?
[ ] Valores conferidos?

APÓS ASSINATURA:
[ ] Contrato salvo?
[ ] Cliente notificado?
[ ] Onboarding iniciado?
[ ] Documentos solicitados?
```

---

*Documento: 10-PROPOSTAS-CONTRATOS.md*
*Versão: 1.0*
