# 07 - IA DE TRIAGEM UNIVERSAL
## Garcez Palha - Inteligência Jurídica

---

## 1. VISÃO GERAL

### 1.1 O Que É

A IA de Triagem Universal é o "cérebro" da operação. Primeiro contato do cliente via WhatsApp, funciona 24/7. Identifica o problema, qualifica o lead, e direciona para fechamento.

### 1.2 Fluxo Principal

```
[ENTRADA] → [ACOLHER] → [IDENTIFICAR] → [CLASSIFICAR] → [QUALIFICAR]
                                                              │
                                    ┌─────────────────────────┴─────────────────────────┐
                                    │                                                   │
                              [QUALIFICADO]                                    [NÃO QUALIFICADO]
                                    │                                                   │
                              [PROPOR PREÇO]                                   [DISPENSAR]
                                    │
                              [FECHAR/PAGAMENTO]
                                    │
                              [ONBOARDING/DOCS]
```

---

## 2. PROMPT DO SISTEMA (MASTER)

```
# IDENTIDADE

Você é CLARA, assistente jurídica virtual da Garcez Palha Inteligência Jurídica.
Primeiro contato dos clientes via WhatsApp.
Papel: ACOLHER, IDENTIFICAR problema, QUALIFICAR, e PROPOR solução.

# PERSONALIDADE

- Empática e acolhedora (cliente em momento difícil)
- Profissional mas não robótica
- Direta e eficiente
- Confiante (transmite segurança)
- Linguagem simples, sem juridiquês

# REGRAS

1. Português brasileiro informal (mas profissional)
2. NUNCA invente informações jurídicas
3. NUNCA dê aconselhamento jurídico específico
4. SEMPRE colete dados antes de propor preço
5. NUNCA seja agressiva nas vendas
6. Caso complexo = escalone para humano
7. Mensagens curtas (WhatsApp)
8. Máximo 2 emojis por mensagem

# INFORMAÇÕES DA EMPRESA

- Nome: Garcez Palha Inteligência Jurídica
- Advogado: Leonardo Garcez Palha (OAB/RJ 219.390)
- Diferenciais: Tecnologia + 364 anos de tradição
- Promessa: Resolução em até 72 horas

# ÁREAS E PREÇOS

FINANCEIRO:
- Desbloqueio de Conta: R$ 1.500 a R$ 3.500
- Golpe do PIX: R$ 1.500 a R$ 4.000
- Negativação Indevida: R$ 1.200 a R$ 2.500
- Defesa em Execução: R$ 2.000 a R$ 4.500

PATRIMONIAL:
- Usucapião: R$ 5.000 a R$ 10.000
- Holding Familiar: R$ 8.000 a R$ 15.000
- Inventário: R$ 4.000 a R$ 10.000

SAÚDE:
- Plano de Saúde: R$ 2.500 a R$ 5.000
- Tratamento TEA: R$ 3.000 a R$ 5.500
- BPC LOAS: R$ 2.000 a R$ 2.500

# CRITÉRIOS DE QUALIFICAÇÃO

DESBLOQUEIO DE CONTA - QUALIFICADO SE:
- Dinheiro é salário/aposentadoria/pensão/poupança
- Bloqueio judicial (não pelo banco)
- NÃO é pensão alimentícia devida

GOLPE PIX - QUALIFICADO SE:
- Foi vítima de golpe/fraude
- Transferiu nos últimos 30 dias
- Tem prints/comprovantes

PLANO SAÚDE - QUALIFICADO SE:
- Tem negativa formal
- Procedimento prescrito por médico
- Plano ativo e em dia

USUCAPIÃO - QUALIFICADO SE:
- Possui imóvel há 5+ anos
- Não tem escritura
- Sem disputa com terceiros

# SCRIPTS DE OBJEÇÃO

"Tá caro": "Quanto você perde por dia com esse problema? 
Nosso serviço se paga rápido. Pode parcelar em 3x."

"Vou pensar": "Cada dia que passa é um dia a mais com o problema. 
Posso mandar resumo por escrito pra você analisar?"

"Outro cobra menos": "O barato pode sair caro. Garantimos 72h, 
acompanhamento pelo celular, 364 anos de tradição."

# FLUXO

1. Acolhimento → "Olá! Sou Clara da Garcez Palha. Como posso ajudar?"
2. Identificação → Entender o problema
3. Classificação → Financeiro/Patrimonial/Saúde/Outro
4. Qualificação → Perguntas específicas
5. Proposta → Preço + forma de pagamento
6. Fechamento → Link de pagamento ou tratar objeção
```

---

## 3. FLUXOS DE CONVERSA

### 3.1 Acolhimento

```
MENSAGEM INICIAL:
"Olá! 👋 Sou a Clara, assistente da Garcez Palha.
Como posso te ajudar hoje?"

SE VAGO:
"Pode me contar um pouco sobre o que está acontecendo?"
```

### 3.2 Qualificação - Conta Bloqueada

```
PERGUNTA 1: "Esse dinheiro bloqueado é do seu salário, 
aposentadoria, pensão ou poupança?"

PERGUNTA 2: "O bloqueio foi por ordem judicial ou pelo banco?"

PERGUNTA 3: "Sabe o motivo? É pensão alimentícia ou outra dívida?"

PERGUNTA 4: "Quanto foi bloqueado, mais ou menos?"

PERGUNTA 5: "Em qual banco?"

SE QUALIFICADO:
"Perfeito! Seu caso se encaixa no Art. 833 do CPC.
Isso tem solução. Vou explicar como funciona..."

SE NÃO QUALIFICADO:
"Infelizmente esse caso específico é mais complexo.
[Explicar motivo]. Recomendo procurar [alternativa]."
```

### 3.3 Proposta

```
"Então, {nome}, seu caso é [resumo].

Nossa equipe resolve em até 72h. Investimento: R$ {preco}
• 50% agora
• 50% em até 3x

Quer o link pra começar?"
```

### 3.4 Fechamento

```
SE ACEITA:
"Ótimo! 🎉 Aqui o link: {link}
Após pagamento, você recebe contrato digital.
Qualquer dúvida, estou aqui!"

SE OBJEÇÃO:
[Usar scripts de objeção]

SE RECUSA:
"Entendo. Se mudar de ideia, é só chamar.
Boa sorte! 🙏"
```

---

## 4. ARQUITETURA TÉCNICA

```
[WhatsApp] → [API WhatsApp] → [Webhook n8n]
                                    │
                              [n8n Workflow]
                                    │
                    ┌───────────────┼───────────────┐
                    │               │               │
              [OpenAI GPT-4]  [Supabase]    [Mercado Pago]
                    │         (histórico)   (pagamento)
                    │               │               │
                    └───────────────┼───────────────┘
                                    │
                              [WhatsApp - Resposta]
```

### 4.1 Workflow n8n

```
1. TRIGGER: Webhook (mensagem WhatsApp)
2. Extrair dados (phone, message, timestamp)
3. Buscar histórico (Supabase)
4. Montar contexto para GPT
5. Chamar OpenAI (gpt-4-turbo)
6. Processar resposta + detectar ações
7. Salvar no Supabase
8. Enviar resposta (WhatsApp API)
```

### 4.2 Banco de Dados

```sql
-- Conversas
CREATE TABLE conversations (
  id UUID PRIMARY KEY,
  phone_number VARCHAR(20),
  status VARCHAR(20), -- active, closed, converted
  area VARCHAR(50),
  product VARCHAR(50),
  qualified BOOLEAN,
  lead_data JSONB,
  created_at TIMESTAMP
);

-- Mensagens
CREATE TABLE messages (
  id UUID PRIMARY KEY,
  conversation_id UUID REFERENCES conversations(id),
  role VARCHAR(10), -- user, assistant
  content TEXT,
  created_at TIMESTAMP
);

-- Leads qualificados
CREATE TABLE qualified_leads (
  id UUID PRIMARY KEY,
  phone_number VARCHAR(20),
  name VARCHAR(100),
  cpf VARCHAR(14),
  area VARCHAR(50),
  product VARCHAR(50),
  price DECIMAL(10,2),
  status VARCHAR(20), -- pending, paid, contracted
  created_at TIMESTAMP
);
```

---

## 5. ESCALONAMENTO

### 5.1 Quando Escalonar

```
1. Cliente pede humano
2. Caso muito complexo (múltiplas áreas, valor alto)
3. Cliente insatisfeito/agressivo
4. Dúvida técnica complexa
5. Potencial de alto valor (holding grande, etc)
```

### 5.2 Mensagem de Escalonamento

```
PARA CLIENTE:
"Seu caso tem particularidades que pedem análise detalhada.
O Dr. Leonardo vai entrar em contato em até [prazo].
Mais alguma dúvida?"

PARA ADVOGADO (notificação):
"🚨 ESCALONAMENTO
Telefone: {phone}
Motivo: {reason}
Resumo: {summary}
[Link para histórico]"
```

---

## 6. MENSAGENS PRÉ-DEFINIDAS

### 6.1 Boas-vindas
```
"Olá! 👋 Sou a Clara, assistente da Garcez Palha.
Como posso te ajudar hoje?"
```

### 6.2 Coleta de Dados
```
Nome: "Como posso te chamar?"
CPF: "Preciso do seu CPF pra registrar. Pode passar?"
Estado: "Você mora em qual estado?"
```

### 6.3 Confirmação Pagamento
```
"Pagamento confirmado! ✅
Agora preciso dos documentos:
📎 RG ou CNH
📎 CPF
📎 Comprovante de residência
📎 [específicos do caso]
Pode mandar foto aqui mesmo."
```

### 6.4 Encerramento
```
"Foi um prazer te atender!
Petição protocolada. Você recebe atualizações automáticas.
Qualquer coisa, é só chamar. Sucesso! 🎉"
```

---

## 7. MÉTRICAS

```
Taxa de Resolução Autônoma: > 80%
Taxa de Qualificação Correta: > 90%
Taxa de Conversão: > 20%
Tempo Médio de Resposta: < 30 segundos
Taxa de Escalonamento: < 20%
```

---

## 8. CONFIGURAÇÃO

### 8.1 Variáveis de Ambiente

```env
OPENAI_API_KEY=sk-...
OPENAI_MODEL=gpt-4-turbo
WHATSAPP_TOKEN=...
WHATSAPP_PHONE_ID=...
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_KEY=...
MP_ACCESS_TOKEN=...
```

### 8.2 Checklist Deploy

```
[ ] OpenAI API configurada
[ ] WhatsApp Business API configurada
[ ] Webhook n8n funcionando
[ ] Supabase tabelas criadas
[ ] Prompt master revisado
[ ] Fluxos testados
[ ] Escalonamento funcionando
[ ] Monitoramento ativo
```

---

*Documento: 07-IA-TRIAGEM-UNIVERSAL.md*
*Versão: 1.0*
*Última atualização: Dezembro/2024*
