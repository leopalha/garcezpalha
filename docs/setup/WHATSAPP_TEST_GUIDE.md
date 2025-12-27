# 📱 Guia de Teste Manual via WhatsApp

**Sistema de Qualificação de Leads - Garcez Palha**

Este guia explica passo a passo como testar o sistema de qualificação via WhatsApp.

---

## 🎯 Pré-Requisitos

Antes de testar, você precisa:

1. ✅ WhatsApp Business API configurada (Cloud API)
2. ✅ Número de telefone verificado
3. ✅ Webhook configurado no Meta Developer
4. ✅ Sistema em produção (Vercel)

---

## 🔍 Verificar Configuração Atual

### 1. Verificar Environment Variables

```bash
# Via Vercel CLI
vercel env ls

# Deve mostrar:
# WHATSAPP_ACCESS_TOKEN
# WHATSAPP_PHONE_NUMBER_ID
# WHATSAPP_BUSINESS_ACCOUNT_ID
# WHATSAPP_VERIFY_TOKEN
```

### 2. Verificar Webhook URL

**URL do Webhook**: `https://seu-dominio.vercel.app/api/webhooks/whatsapp`

No Meta Developer Console:
1. Acesse: https://developers.facebook.com/apps
2. Selecione seu app
3. WhatsApp > Configuration
4. Webhook URL deve estar configurada
5. Verify Token: confira se bate com `WHATSAPP_VERIFY_TOKEN`

### 3. Testar Webhook

```bash
# Enviar teste do Meta Developer
# Ou verificar logs:
vercel logs --filter=/api/webhooks/whatsapp --follow
```

---

## 📝 Como Fazer o Teste

### Opção 1: Via WhatsApp Business App (Recomendado)

#### Passo 1: Adicionar o Número de Teste

1. Abra o WhatsApp no seu celular
2. Adicione o número configurado na Cloud API
3. Inicie uma conversa

#### Passo 2: Enviar Mensagem de Teste

**Mensagem inicial** (qualquer uma destas):
```
Olá
Oi
Quero contratar
Preciso de ajuda
Tenho uma questão jurídica
```

#### Passo 3: Escolher Produto

O bot deve responder com:
```
Olá! Sou o assistente da Garcez Palha Advogados.

Vejo que você precisa de ajuda jurídica.
Para melhor atendê-lo, qual área você precisa?

1. Defesa Criminal
2. Habeas Corpus
3. Direito Imobiliário
4. Divórcio
... (lista completa de 18 produtos)

Digite o número ou nome do serviço.
```

**Responda com**:
```
1
```
ou
```
Defesa Criminal
```

#### Passo 4: Responder Questionário

O bot vai fazer perguntas como:

**Pergunta 1**:
```
Você já foi indiciado ou denunciado?
(sim/não)
```

**Responda**:
```
sim
```

**Pergunta 2**:
```
Há prazo processual urgente?
(sim/não)
```

**Responda**:
```
sim
```

Continue respondendo todas as perguntas. O bot mostrará:
```
Pergunta 3 de 8 [=========>          ] 37%
```

#### Passo 5: Conclusão

Ao final, o bot deve enviar:
```
✅ Qualificação concluída!

📊 Resultado:
• Score Total: 85/100
• Categoria: 🔥 HOT
• Urgência: 90
• Probabilidade: 80
• Complexidade: 85

Um de nossos advogados entrará em contato em breve.
```

---

## ✅ Validar Resultado

### 1. Verificar no Dashboard

```bash
# Abrir dashboard de leads
https://seu-dominio.vercel.app/admin/leads/qualificados
```

**Verificar**:
- [ ] Lead aparece na lista
- [ ] Score está correto (ex: 85)
- [ ] Categoria está correta (ex: HOT)
- [ ] Nome e telefone estão corretos
- [ ] Produto está correto (ex: Defesa Criminal)

### 2. Verificar no Database

```bash
# Executar query no Supabase
node verify-database.js

# Ou via SQL Editor:
SELECT * FROM qualified_leads
ORDER BY created_at DESC
LIMIT 1;
```

**Validar**:
```sql
-- Deve retornar 1 registro com:
{
  "id": "uuid...",
  "client_name": "Seu Nome",
  "phone": "5511999999999",
  "product_id": "defesa-criminal",
  "product_name": "Defesa Criminal",
  "score_total": 85,
  "score_urgency": 90,
  "score_probability": 80,
  "score_complexity": 85,
  "category": "hot",
  "status": "new",
  "created_at": "2024-12-24T..."
}
```

### 3. Verificar Follow-ups Agendados

```sql
SELECT * FROM follow_up_tasks
WHERE lead_id = 'uuid-do-lead'
ORDER BY scheduled_for ASC;
```

**Deve mostrar** (para lead HOT):
```
5 tasks agendadas:
1. +2 horas (hoje)
2. +6 horas (hoje)
3. +24 horas (amanhã)
4. +3 dias
5. +7 dias
```

---

## 🚨 Troubleshooting

### Problema: Bot não responde

**Possíveis causas**:
1. Webhook não configurado
2. Token inválido
3. Número não verificado

**Solução**:
```bash
# Ver logs
vercel logs --filter=/api/webhooks/whatsapp --follow

# Verificar configuração
vercel env ls | grep WHATSAPP

# Testar webhook manualmente
curl -X POST https://seu-dominio.vercel.app/api/webhooks/whatsapp \
  -H "Content-Type: application/json" \
  -d '{"test": true}'
```

---

### Problema: Lead não aparece no dashboard

**Verificar**:
1. Database connection
2. Lead foi salvo
3. Autenticação do dashboard

**Solução**:
```bash
# Verificar database
node verify-database.js

# Ver últimos leads
# SQL Editor:
SELECT COUNT(*) FROM qualified_leads;
```

---

### Problema: Follow-ups não foram agendados

**Verificar**:
```sql
SELECT COUNT(*) FROM follow_up_tasks;
```

**Se retornar 0**:
- Verificar código em `qualification-handler.ts`
- Verificar logs de erro
- Testar manualmente:

```bash
# Via logs
vercel logs --filter=follow_up --follow
```

---

## 📊 Cenários de Teste

### Teste 1: Lead HOT (Score Alto)

**Respostas que geram score alto**:
- Prazo urgente? SIM
- Já foi indiciado? SIM
- Tem advogado? NÃO
- Risco de prisão? SIM
- Complexidade? ALTA

**Resultado esperado**:
- Score: 75-100
- Categoria: HOT 🔥
- 5 follow-ups agendados

---

### Teste 2: Lead WARM (Score Médio)

**Respostas**:
- Prazo urgente? NÃO
- Já foi indiciado? SIM
- Tem advogado? NÃO
- Risco de prisão? NÃO
- Complexidade: MÉDIA

**Resultado esperado**:
- Score: 50-74
- Categoria: WARM ☀️
- 4 follow-ups agendados

---

### Teste 3: Lead COLD (Score Baixo)

**Respostas**:
- Prazo urgente? NÃO
- Já foi indiciado? NÃO
- Tem advogado? SIM
- Risco de prisão? NÃO
- Complexidade: BAIXA

**Resultado esperado**:
- Score: 25-49
- Categoria: COLD ❄️
- 3 follow-ups agendados

---

## ✅ Checklist Completo de Teste

### Pré-Teste
- [ ] Environment variables configuradas
- [ ] Webhook URL configurada no Meta
- [ ] Sistema em produção
- [ ] Database acessível

### Durante o Teste
- [ ] Bot responde à mensagem inicial
- [ ] Lista de produtos aparece
- [ ] Consegue selecionar produto
- [ ] Perguntas aparecem sequencialmente
- [ ] Barra de progresso funciona
- [ ] Bot entende respostas (sim/não)
- [ ] Qualificação conclui com sucesso

### Pós-Teste
- [ ] Lead aparece no dashboard
- [ ] Score calculado corretamente
- [ ] Categoria atribuída corretamente
- [ ] Dados salvos no database
- [ ] Follow-ups agendados (quantidade correta)
- [ ] Status inicial = "new"

---

## 🔄 Teste de Follow-up (Opcional)

### Testar Follow-up Manual

```bash
# Trigger manualmente via API
curl -X POST https://seu-dominio.vercel.app/api/admin/follow-ups/manual \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN" \
  -d '{
    "leadId": "uuid-do-lead",
    "message": "Olá! Como posso ajudar?"
  }'
```

**Verificar**:
- [ ] Mensagem enviada via WhatsApp
- [ ] `last_interaction_at` atualizado
- [ ] API retorna sucesso

---

## 📱 Número de Teste Sugerido

Se você não tem um número WhatsApp Business ainda:

1. **Criar conta teste gratuita**:
   - Meta Business Suite: https://business.facebook.com
   - WhatsApp Business API (Cloud)
   - Número de teste fornecido pelo Meta

2. **Usar número pessoal temporário**:
   - Pode usar seu número pessoal para testes
   - Depois migrar para número business

---

## 💡 Dicas

1. **Teste todos os 3 cenários** (HOT, WARM, COLD)
2. **Teste produtos diferentes** (Defesa Criminal, Divórcio, etc.)
3. **Monitore os logs** enquanto testa
4. **Documente qualquer erro** encontrado
5. **Verifique timing dos follow-ups** (2h, 6h, 24h)

---

## 📞 Próximos Passos Após Teste

1. ✅ Confirmar que sistema funciona end-to-end
2. ✅ Ajustar mensagens se necessário
3. ✅ Otimizar regras de scoring baseado em testes
4. ✅ Monitorar primeiro cron job (amanhã 9h e 12h)
5. ✅ Começar a capturar leads reais

---

**Data**: 24/12/2024
**Versão**: 1.0
**Status**: ✅ Pronto para teste
