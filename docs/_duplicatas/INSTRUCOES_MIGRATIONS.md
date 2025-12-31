# 📝 INSTRUÇÕES PARA RODAR MIGRATIONS NO SUPABASE

## Como Aplicar as Migrations Manualmente

Já que a conexão direta via CLI não funcionou, você pode rodar as migrations manualmente via **Supabase Dashboard**.

---

## PASSO 1: Acessar o Supabase Dashboard

1. Acesse: https://supabase.com/dashboard
2. Faça login
3. Selecione o projeto: `cpcnzkttcwodvfqyhkou`
4. Vá em **SQL Editor** (menu lateral esquerdo)

---

## PASSO 2: Rodar Migration de A/B Testing

1. Clique em **+ New Query**
2. Copie TODO o conteúdo do arquivo:
   ```
   supabase/migrations/20251230000002_ab_testing_system.sql
   ```
3. Cole no editor SQL
4. Clique em **RUN** (ou pressione Ctrl+Enter)
5. Aguarde sucesso (✅ Success)

**O que esta migration faz:**
- Cria tabelas: `ab_tests`, `ab_test_variants`, `ab_test_assignments`
- Cria função `calculate_variant_stats()`
- Cria função `update_variant_stats_trigger()`
- Insere teste de exemplo

---

## PASSO 3: Rodar Migration de Segmentação

1. Clique em **+ New Query** novamente
2. Copie TODO o conteúdo do arquivo:
   ```
   supabase/migrations/20251230000003_lead_segmentation.sql
   ```
3. Cole no editor SQL
4. Clique em **RUN**
5. Aguarde sucesso (✅ Success)

**O que esta migration faz:**
- Cria tabelas: `segments`, `lead_segments`
- Cria função `calculate_lead_email_stats()`
- Cria função `auto_segment_lead()`
- Insere 8 segmentos pré-definidos (hot-leads, warm-leads, etc.)

---

## PASSO 4: Verificar Instalação

### Verificar Tabelas Criadas:
```sql
-- Rodar no SQL Editor:
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
AND table_name IN (
  'ab_tests',
  'ab_test_variants',
  'ab_test_assignments',
  'segments',
  'lead_segments'
);
```

**Resultado esperado**: 5 tabelas listadas

### Verificar Segmentos Criados:
```sql
-- Rodar no SQL Editor:
SELECT id, name, priority, email_sequence
FROM segments
ORDER BY priority;
```

**Resultado esperado**: 8 segmentos (hot-leads, warm-leads, etc.)

### Verificar Funções Criadas:
```sql
-- Rodar no SQL Editor:
SELECT routine_name
FROM information_schema.routines
WHERE routine_schema = 'public'
AND routine_name IN (
  'calculate_variant_stats',
  'calculate_lead_email_stats',
  'auto_segment_lead'
);
```

**Resultado esperado**: 3 funções listadas

---

## PASSO 5: Testar Funcionalidades

### Teste 1: Criar Lead de Teste
```sql
INSERT INTO leads (id, email, name, score, created_at, last_contact_at, has_converted)
VALUES (
  'lead-test-1',
  'test@example.com',
  'Test Lead',
  85,
  NOW() - INTERVAL '30 days',
  NOW() - INTERVAL '2 days',
  false
);
```

### Teste 2: Auto-Segmentar Lead
```sql
SELECT auto_segment_lead('lead-test-1');
```

**Resultado esperado**: `{hot-leads, new-signups}` (ou similar)

### Teste 3: Ver Segmentos do Lead
```sql
SELECT s.name, s.email_sequence
FROM lead_segments ls
JOIN segments s ON s.id = ls.segment_id
WHERE ls.lead_id = 'lead-test-1';
```

**Resultado esperado**: Lista de segmentos atribuídos

---

## ERROS COMUNS E SOLUÇÕES

### Erro: "relation already exists"
**Solução**: Tabela já existe de execução anterior. É seguro ignorar.

### Erro: "function already exists"
**Solução**: Função já existe. É seguro ignorar.

### Erro: "column does not exist"
**Solução**: Migration 035 (email_sequences) não foi rodada. Execute:
```
supabase/migrations/035_email_sequences.sql
```

### Erro: "permission denied"
**Solução**: Certifique-se de estar logado como owner do projeto.

---

## VERIFICAÇÃO FINAL

Execute este comando para confirmar que TUDO foi instalado corretamente:

```sql
-- Verificação Completa
SELECT
  (SELECT COUNT(*) FROM ab_tests) as ab_tests_count,
  (SELECT COUNT(*) FROM ab_test_variants) as variants_count,
  (SELECT COUNT(*) FROM segments) as segments_count,
  (SELECT COUNT(*) FROM lead_segments) as lead_segments_count;
```

**Resultado esperado**:
```
ab_tests_count: 1 (teste de exemplo)
variants_count: 2 (2 variantes do teste de exemplo)
segments_count: 8 (8 segmentos pré-definidos)
lead_segments_count: 0+ (dependendo de testes)
```

---

## APÓS RODAR AS MIGRATIONS

### Próximos Passos:

1. **Testar Scripts**:
   ```bash
   npx tsx scripts/test-ab-testing.ts
   npx tsx scripts/test-segmentation.ts
   npx tsx scripts/test-ml-send-time.ts
   ```

2. **Acessar Admin UI**:
   - A/B Tests: http://localhost:3000/admin/automations/ab-tests
   - Analytics: http://localhost:3000/admin/automations/email-sequences/analytics
   - Send Time: http://localhost:3000/admin/automations/send-time-optimization

3. **Criar Primeiro Teste A/B**:
   - Ir para: http://localhost:3000/admin/automations/ab-tests/new
   - Criar teste com 2 variantes de subject line
   - Iniciar teste
   - Simular envios e aberturas
   - Ver vencedor declarado

4. **Configurar Cron Job**:
   ```typescript
   // src/app/api/cron/auto-segment/route.ts
   export async function GET(req: Request) {
     // Verificar CRON_SECRET
     const result = await autoSegmenter.segmentAllLeads()
     return Response.json(result)
   }
   ```

---

## 🎉 PRONTO!

As migrations foram aplicadas com sucesso. A plataforma agora possui:

✅ Sistema de A/B Testing completo
✅ Auto-Segmentação de Leads (8 segmentos)
✅ Machine Learning para horários
✅ Analytics avançado
✅ React Email Templates

**Enjoy!** 🚀
