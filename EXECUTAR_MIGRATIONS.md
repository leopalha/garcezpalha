# 📋 INSTRUÇÕES: EXECUTAR MIGRATIONS PENDENTES

**Data:** 31/12/2024
**Status:** ⚠️ 3 migrations CRÍTICAS pendentes
**Tempo Estimado:** 5-10 minutos

---

## 🎯 OBJETIVO

Executar 3 migrations pendentes que criarão as tabelas necessárias para:
- ✅ Sistema de A/B Testing de emails
- ✅ Auto-segmentação de leads
- ✅ Políticas RLS (Row Level Security)

---

## 🔐 ACESSO AO SUPABASE DASHBOARD

**URL:** https://supabase.com/dashboard/project/cpcnzkttcwodvfqyhkou

**Credenciais:** Use sua conta Supabase conectada ao projeto

---

## 📝 MIGRATIONS A EXECUTAR (EM ORDEM)

### **Migration 1: A/B Testing System** (CRÍTICA) ✅ CORRIGIDA

**Arquivo:** `supabase/migrations/20251230000002_ab_testing_system.sql`

**Status:** ✅ UUID fix aplicado (commit fc8a1ae)

**O que faz:**
- Cria tabela `ab_tests` (testes A/B)
- Cria tabela `ab_test_variants` (variantes)
- Cria tabela `ab_test_assignments` (atribuições de leads)
- Adiciona índices e RLS policies
- Cria teste de exemplo com UUIDs corretos

**Como executar:**

1. Abra o Supabase Dashboard: https://supabase.com/dashboard/project/cpcnzkttcwodvfqyhkou

2. No menu lateral, clique em: **SQL Editor** → **New query**

3. Copie o conteúdo do arquivo `supabase/migrations/20251230000002_ab_testing_system.sql`

4. Cole no editor SQL

5. Clique em **Run** (ou pressione `Ctrl + Enter`)

6. Aguarde confirmação: "Success. No rows returned"

**Verificar criação:**
```sql
SELECT tablename FROM pg_tables
WHERE schemaname = 'public'
  AND tablename LIKE 'ab_test%';
```

**Resultado esperado:**
```
 tablename
--------------
 ab_tests
 ab_test_variants
 ab_test_assignments
(3 rows)
```

---

### **Migration 2: Lead Segmentation** (CRÍTICA)

**Arquivo:** `supabase/migrations/20251230000003_lead_segmentation.sql`

**O que faz:**
- Cria tabela `lead_segments` (segmentos definidos)
- Cria tabela `lead_segment_assignments` (leads → segmentos)
- Cria função `auto_segment_lead()` (segmentação automática)
- Adiciona índices e RLS policies

**Como executar:**

1. No mesmo SQL Editor, clique em **New query**

2. Copie o conteúdo de `supabase/migrations/20251230000003_lead_segmentation.sql`

3. Cole no editor e execute (**Run** ou `Ctrl + Enter`)

**Verificar criação:**
```sql
SELECT tablename FROM pg_tables
WHERE schemaname = 'public'
  AND tablename LIKE '%segment%';
```

**Resultado esperado:**
```
 tablename
--------------
 lead_segments
 lead_segment_assignments
(2 rows)
```

**Verificar função criada:**
```sql
SELECT proname FROM pg_proc
WHERE proname = 'auto_segment_lead';
```

---

### **Migration 3: RLS Policies** (IMPORTANTE) ✅ CORRIGIDA

**Arquivo:** `supabase/migrations/20251231000001_rls_policies_critical_tables.sql`

**Status:** ✅ tenant_id fix aplicado (commit 26f1439)

**O que faz:**
- Habilita Row Level Security em tabelas críticas
- Cria policies básicas para usuários autenticados
- Verifica existência de tabelas antes de aplicar policies
- Tratamento de erros gracioso (políticas duplicadas, tabelas inexistentes)

**Como executar:**

1. No SQL Editor, clique em **New query**

2. Copie o conteúdo de `supabase/migrations/20251231000001_rls_policies_critical_tables.sql`

3. Cole e execute

**Verificar RLS ativado:**
```sql
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename IN ('leads', 'conversations', 'products', 'contracts');
```

**Resultado esperado:**
```
 tablename     | rowsecurity
---------------+-------------
 leads         | t
 conversations | t
 products      | t
 contracts     | t
(4 rows)
```

---

## ✅ APÓS EXECUTAR AS MIGRATIONS

### 1. Verificar Tabelas Criadas

Execute no SQL Editor:

```sql
SELECT tablename, schemaname
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename IN (
    'ab_tests',
    'ab_test_variants',
    'ab_test_assignments',
    'lead_segments',
    'lead_segment_assignments'
  )
ORDER BY tablename;
```

**Resultado esperado:** 5 tabelas listadas

---

### 2. Testar Funcionalidades

Execute os scripts de teste:

```bash
# Teste A/B Testing
npx tsx scripts/test-ab-testing.ts

# Teste Auto-Segmentation
npx tsx scripts/test-segmentation.ts

# Teste ML Send-Time Optimizer
npx tsx scripts/test-ml-send-time.ts
```

**Resultado esperado:**
```
✅ Migration criou tabelas com sucesso
✅ Teste A/B testing funciona
✅ Segmentação automática funciona
```

---

## 🚨 TROUBLESHOOTING

### Erro: "relation already exists"

**Causa:** Migration já foi executada antes
**Solução:** Pule para a próxima migration

### Erro: "permission denied"

**Causa:** Usuário sem permissões de admin
**Solução:** Use uma conta com role `service_role` ou `postgres`

### Erro: "syntax error near..."

**Causa:** SQL mal formado (cópia incompleta)
**Solução:**
1. Certifique-se de copiar TODO o conteúdo do arquivo
2. Verifique se não há quebras de linha estranhas
3. Cole novamente e execute

---

## 📊 RESUMO DE ARQUIVOS

| Migration | Tabelas Criadas | Funções | Linhas SQL |
|-----------|-----------------|---------|------------|
| `20251230000002_ab_testing_system.sql` | 3 tables | 0 | 206 |
| `20251230000003_lead_segmentation.sql` | 2 tables | 1 func | 261 |
| `20251231000001_rls_policies_critical_tables.sql` | 0 (policies) | 0 | ~150 |

**Total:** 5 tabelas + 1 função + RLS policies

---

## 🎯 RESULTADO FINAL

Após executar as 3 migrations:

✅ **Sistema de A/B Testing pronto para uso**
- Criar testes A/B de subject lines
- Atribuir variantes automaticamente
- Calcular significância estatística
- Declarar vencedores

✅ **Auto-Segmentação funcionando**
- 8 segmentos pré-definidos (Hot, Warm, Cold, etc.)
- Segmentação automática por score
- Auto-subscription em sequências de email

✅ **Segurança Multi-Tenancy garantida**
- Dados isolados por tenant
- Acesso controlado por RLS
- Prevenção de vazamento de dados

---

## 📞 SUPORTE

Se encontrar problemas:

1. Verifique logs de erro no SQL Editor
2. Consulte documentação Supabase: https://supabase.com/docs
3. Revise [TEST_RESULTS_31DEC2024.md](.manus/reports/TEST_RESULTS_31DEC2024.md)

---

**✨ Após completar, execute os testes e verifique que tudo está funcionando!**

---

**Generated with Claude Code**
**Model:** Claude Sonnet 4.5
**Data:** 31/12/2024
