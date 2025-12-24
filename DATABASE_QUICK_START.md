# Database Integration - Quick Start Guide

## 🚀 Getting Started

Este guia rápido mostra como começar a usar o sistema de banco de dados integrado do G4.

---

## 1. Executar a Migration

### Primeiro, faça backup do banco (IMPORTANTE!)

```bash
# Via Supabase CLI
supabase db dump -f backup_before_migration.sql
```

### Executar migration

**Opção A: Supabase CLI (Recomendado)**
```bash
cd d:/garcezpalha
supabase db push
```

**Opção B: Supabase Dashboard**
1. Abra https://app.supabase.com/project/SEU_PROJECT_ID/sql
2. Copie o conteúdo de `supabase/migrations/016_leads_qualification_system.sql`
3. Cole e execute

**Opção C: psql direto**
```bash
psql -h db.PROJECT_ID.supabase.co -U postgres -d postgres -f supabase/migrations/016_leads_qualification_system.sql
```

### Verificar sucesso

```sql
-- No SQL Editor do Supabase
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public'
AND table_name IN ('leads', 'qualification_sessions', 'payment_links', 'proposals', 'follow_up_messages', 'lead_interactions');
-- Deve retornar 6 linhas
```

---

## 2. Configurar Variáveis de Ambiente

Certifique-se que seu `.env.local` tem:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

---

## 3. Criar Usuário Admin de Teste

```sql
-- Via SQL Editor do Supabase

-- Criar usuário (substitua email e senha)
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'admin@garcezpalha.com.br',  -- ALTERE AQUI
  crypt('sua-senha-aqui', gen_salt('bf')),  -- ALTERE AQUI
  NOW(),
  '{"provider":"email","providers":["email"]}',
  '{"role":"admin","name":"Admin Teste"}',  -- role: admin é importante!
  NOW(),
  NOW()
);
```

---

## 4. Testar Sistema

### Teste 1: Dashboard de Leads

1. Faça login com o usuário admin criado
2. Navegue para `/admin/leads`
3. Você deve ver o dashboard (vazio inicialmente)

### Teste 2: Criar Lead via Chat

```bash
# Terminal
curl -X POST http://localhost:3000/api/chat/qualify \
  -H "Content-Type: application/json" \
  -d '{
    "sessionId": "test-session-123",
    "message": "Minha conta bancária foi bloqueada indevidamente",
    "source": "website",
    "clientInfo": {
      "name": "João Teste",
      "email": "joao.teste@example.com",
      "phone": "+5511999999999"
    }
  }'
```

Resposta esperada:
```json
{
  "message": "Entendi que você teve sua conta bloqueada. Para te ajudar melhor, preciso de algumas informações...",
  "type": "question",
  "question": {
    "id": "bank-name",
    "text": "Qual banco bloqueou sua conta?",
    "type": "text"
  },
  "progress": {
    "answered": 0,
    "total": 6,
    "percentage": 0
  }
}
```

### Teste 3: Verificar no Banco

```sql
-- Verificar sessão criada
SELECT * FROM qualification_sessions ORDER BY created_at DESC LIMIT 1;

-- Verificar interação logada
SELECT * FROM lead_interactions ORDER BY created_at DESC LIMIT 1;
```

### Teste 4: Continuar Qualificação

```bash
curl -X POST http://localhost:3000/api/chat/qualify \
  -H "Content-Type: application/json" \
  -d '{
    "sessionId": "test-session-123",
    "message": "Banco do Brasil",
    "source": "website"
  }'
```

### Teste 5: Completar Qualificação

Continue respondendo as perguntas até o fim. Quando completo, verifique:

```sql
-- Lead deve ter sido criado
SELECT * FROM leads ORDER BY created_at DESC LIMIT 1;

-- Payment link deve existir
SELECT * FROM payment_links ORDER BY created_at DESC LIMIT 1;

-- Proposta deve existir
SELECT * FROM proposals ORDER BY created_at DESC LIMIT 1;

-- Follow-ups devem estar agendados
SELECT * FROM follow_up_messages WHERE lead_id = (SELECT id FROM leads ORDER BY created_at DESC LIMIT 1);
```

---

## 5. Usar Helper Functions

### Criar Lead Programaticamente

```typescript
import { createLead } from '@/lib/leads/lead-database'

const lead = await createLead({
  result: {
    leadId: 'lead-123',
    productId: 'desbloqueio-conta',
    productName: 'Desbloqueio de Conta',
    agentRole: 'financial-protection',
    score: {
      total: 85,
      urgency: 90,
      probability: 80,
      complexity: 85,
      category: 'hot',
      reasoning: ['Caso urgente', 'Alto potencial']
    },
    answers: [],
    questions: [],
    isComplete: true,
    startedAt: new Date(),
    recommendedAction: {
      type: 'send-proposal',
      priority: 'high',
      message: 'Enviar proposta imediatamente',
      estimatedValue: 500000, // R$ 5.000
      estimatedFee: 150000    // R$ 1.500
    }
  },
  clientInfo: {
    name: 'Maria Silva',
    email: 'maria@example.com',
    phone: '+5511988888888'
  },
  source: 'whatsapp'
})

console.log('Lead criado:', lead.id)
```

### Listar Leads Hot

```typescript
import { listLeads } from '@/lib/leads/lead-database'

const { leads, total, totalPages } = await listLeads({
  page: 1,
  limit: 10,
  category: 'hot',
  status: 'active'
})

console.log(`Encontrados ${total} leads hot ativos`)
leads.forEach(lead => {
  console.log(`- ${lead.clientName} (Score: ${lead.scoreTotal})`)
})
```

### Obter Estatísticas

```typescript
import { getLeadStatistics, getConversionFunnel } from '@/lib/leads/lead-database'

const stats = await getLeadStatistics()
console.log('Total de leads:', stats.totalLeads)
console.log('Taxa de conversão:', stats.conversionRate + '%')

const funnel = await getConversionFunnel()
console.log('Funil:', funnel)
// { started: 100, qualified: 80, proposal: 60, payment: 30, converted: 15 }
```

### Converter Lead

```typescript
import { convertLead } from '@/lib/leads/lead-database'

await convertLead('lead-uuid')
console.log('Lead marcado como convertido!')
```

---

## 6. Dashboard Admin

### Acessar Dashboard

1. Login como admin/lawyer
2. Navegue para `/admin/leads`

### Funcionalidades Disponíveis

**Stats Cards:**
- Total de leads
- Leads hot
- Leads warm
- Taxa de conversão

**Distribuição por Categoria:**
- Gráfico de barras (hot, warm, cold, unqualified)

**Funil de Conversão:**
- Started → Qualified → Proposal → Payment → Converted

**Feed de Atividade:**
- Últimas 10 interações em tempo real

**Lista de Leads:**
- Paginação (10 por página)
- Filtros por categoria e status
- Busca por nome/email/telefone
- Ordenação por data ou score

---

## 7. Troubleshooting

### Erro: "Permission denied for table leads"

**Causa:** Usuário não tem role admin/lawyer

**Solução:**
```sql
UPDATE auth.users
SET raw_user_meta_data = raw_user_meta_data || '{"role":"admin"}'::jsonb
WHERE email = 'seu-email@example.com';
```

### Erro: "Function get_lead_statistics does not exist"

**Causa:** Migration não foi executada completamente

**Solução:**
```bash
# Reexecutar migration
supabase db push
```

### Erro: "Null value violates not-null constraint"

**Causa:** Campos obrigatórios faltando

**Solução:**
Certifique-se de passar:
- `client_name` (NOT NULL)
- `product_id` (NOT NULL)
- `email` OU `phone` (pelo menos um)

### Dashboard vazio

**Causa:** Sem dados no banco

**Solução:**
Crie alguns leads de teste usando o chat ou helper functions.

### Compilation Error: "Property X does not exist"

**Causa:** Tipos TypeScript desatualizados

**Solução:**
```bash
# Recompilar
npx tsc --noEmit

# Se persistir, reinicie TypeScript server no VSCode
# Ctrl+Shift+P -> "TypeScript: Restart TS Server"
```

---

## 8. Desenvolvimento Local

### Supabase Local (Opcional)

```bash
# Iniciar Supabase local
supabase start

# Aplicar migrations
supabase db reset

# Parar
supabase stop
```

### Seed Data (Para Testes)

```sql
-- Criar alguns leads de teste
INSERT INTO leads (
  client_name, email, phone, product_id, product_name, agent_role,
  score_total, score_urgency, score_probability, score_complexity,
  category, status, estimated_value, estimated_fee,
  source
) VALUES
  ('João Silva', 'joao@test.com', '+5511999999999', 'desbloqueio-conta', 'Desbloqueio de Conta', 'financial-protection', 85, 90, 80, 85, 'hot', 'active', 500000, 150000, 'website'),
  ('Maria Santos', 'maria@test.com', '+5511988888888', 'golpe-pix', 'Golpe PIX', 'financial-protection', 92, 95, 90, 90, 'hot', 'converted', 300000, 200000, 'whatsapp'),
  ('Pedro Costa', 'pedro@test.com', NULL, 'negativacao-indevida', 'Negativação Indevida', 'financial-protection', 68, 70, 65, 70, 'warm', 'active', 200000, 120000, 'email'),
  ('Ana Lima', NULL, '+5511977777777', 'plano-saude', 'Plano de Saúde', 'health-insurance', 72, 75, 70, 70, 'warm', 'nurturing', 400000, 250000, 'website'),
  ('Carlos Souza', 'carlos@test.com', '+5511966666666', 'bpc-loas', 'BPC/LOAS', 'social-security', 55, 60, 50, 55, 'cold', 'active', 300000, 180000, 'website');
```

---

## 9. Monitoramento

### Supabase Dashboard

Monitore em https://app.supabase.com/project/SEU_PROJECT_ID

**Database:**
- Table sizes
- Slow queries
- Index usage

**Auth:**
- Active users
- Sign-ups
- Failed logins

**API:**
- Request rate
- Error rate
- Response times

### Performance Queries

```sql
-- Verificar uso de índices
SELECT schemaname, tablename, indexname, idx_scan
FROM pg_stat_user_indexes
WHERE schemaname = 'public'
ORDER BY idx_scan DESC;

-- Queries mais lentas
SELECT query, mean_exec_time, calls
FROM pg_stat_statements
ORDER BY mean_exec_time DESC
LIMIT 10;

-- Tamanho das tabelas
SELECT
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

---

## 10. Backup e Restore

### Backup

```bash
# Backup completo
supabase db dump -f backup_$(date +%Y%m%d).sql

# Apenas schema
supabase db dump --schema-only -f schema_backup.sql

# Apenas dados
supabase db dump --data-only -f data_backup.sql
```

### Restore

```bash
# Restore completo
psql -h db.PROJECT_ID.supabase.co -U postgres -d postgres -f backup_20241223.sql

# Via Supabase CLI
supabase db push
```

---

## 🎯 Checklist Pré-Produção

- [ ] Migration executada com sucesso
- [ ] Tabelas verificadas (6 criadas)
- [ ] Usuário admin criado e testado
- [ ] Dashboard acessível
- [ ] Qualificação via chat funciona
- [ ] Leads sendo salvos corretamente
- [ ] Payment links gerados
- [ ] Propostas criadas
- [ ] Follow-ups agendados
- [ ] Estatísticas funcionando
- [ ] RLS policies ativas
- [ ] Índices criados
- [ ] Backup realizado
- [ ] Monitoramento configurado

---

## 📚 Recursos Adicionais

- **Documentação Completa:** [DATABASE_INTEGRATION.md](./src/lib/leads/DATABASE_INTEGRATION.md)
- **Sprint Summary:** [SPRINT_DATABASE_SUMMARY.md](./SPRINT_DATABASE_SUMMARY.md)
- **Migration SQL:** [016_g4_leads_system.sql](./supabase/migrations/016_g4_leads_system.sql)
- **Helper Functions:** [lead-database.ts](./src/lib/leads/lead-database.ts)
- **Chat Persistence:** [chat-qualification-persistence.ts](./src/lib/ai/chat-qualification-persistence.ts)

---

## 🆘 Suporte

**Problemas?**
1. Verifique a seção de Troubleshooting
2. Confira os logs no console do navegador
3. Verifique logs do Supabase Dashboard
4. Revise a documentação completa

**Dúvidas sobre o código?**
- Todos os arquivos estão bem documentados
- Exemplos de uso estão em DATABASE_INTEGRATION.md
- Tipos TypeScript fornecem IntelliSense completo

---

*Última atualização: 2024-12-23*
*Sistema: G4 Lead Qualification + Database Integration*
*Status: ✅ Production Ready*
