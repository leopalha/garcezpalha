# 🔧 RLS TROUBLESHOOTING GUIDE

**Problema:** Erro ao executar script RLS
**Erro comum:** `trigger "qualified_leads_updated_at" for relation "qualified_leads" already exists`

---

## ✅ SOLUÇÃO RÁPIDA

### Use este script ao invés do anterior:

**Arquivo:** [`supabase/APPLY_RLS_POLICIES_ONLY.sql`](supabase/APPLY_RLS_POLICIES_ONLY.sql)

**Por que este é diferente:**
- ✅ Apenas aplica RLS policies
- ✅ NÃO tenta criar triggers (já existem)
- ✅ NÃO tenta criar tabelas (já existem)
- ✅ É idempotente (pode rodar múltiplas vezes sem erro)
- ✅ Usa `DO $$` blocks para evitar erros

### Como executar:

1. **Abrir:** [Supabase Dashboard](https://supabase.com/dashboard)
2. **Ir em:** SQL Editor
3. **Cole:** Todo conteúdo de `APPLY_RLS_POLICIES_ONLY.sql`
4. **Execute:** Clique em "Run"

### Saída esperada:

```
NOTICE: ✅ 4 RLS policies aplicadas na tabela LEADS
NOTICE: ✅ 4 RLS policies aplicadas na tabela CONVERSATIONS
NOTICE: ✅ 4 RLS policies aplicadas na tabela QUALIFIED_LEADS
NOTICE: ✅ 4 RLS policies aplicadas na tabela CONTRACTS
NOTICE: ✅ 4 RLS policies aplicadas na tabela MESSAGES
NOTICE: ==============================================
NOTICE: VERIFICAÇÃO DE RLS POLICIES
NOTICE: ==============================================
NOTICE: ✅ leads - RLS ENABLED - 4 policies
NOTICE: ✅ conversations - RLS ENABLED - 4 policies
NOTICE: ✅ qualified_leads - RLS ENABLED - 4 policies
NOTICE: ✅ contracts - RLS ENABLED - 4 policies
NOTICE: ✅ messages - RLS ENABLED - 4 policies
NOTICE: ==============================================
NOTICE: RLS POLICIES APLICADAS COM SUCESSO!
NOTICE: ==============================================

status: "RLS Policies aplicadas com sucesso! ✅"
```

---

## 🔍 POR QUE O ERRO ACONTECEU?

### Você executou anteriormente:
`APPLY_ALL_MIGRATIONS.sql` que já criou:
- ✅ Tabelas (`qualified_leads`, `follow_up_tasks`)
- ✅ Triggers (`qualified_leads_updated_at`)
- ✅ Functions (`update_qualified_leads_updated_at()`)
- ✅ Indexes
- ⚠️ Mas **NÃO** criou RLS policies de multi-tenant

### O que faltava:
Apenas as **RLS policies de multi-tenant** para garantir isolamento entre tenants.

---

## 📊 VERIFICAR RLS APÓS APLICAR

### Query para verificar policies:

```sql
SELECT
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;
```

### Resultado esperado (parcial):

| tablename | policyname | cmd |
|-----------|-----------|-----|
| leads | Users can view leads from their tenant | SELECT |
| leads | Users can insert leads for their tenant | INSERT |
| leads | Users can update leads from their tenant | UPDATE |
| leads | Users can delete leads from their tenant | DELETE |
| conversations | Users can view conversations from their tenant | SELECT |
| ... | ... | ... |

**Total esperado:** ~24 policies (4 por tabela × 6 tabelas)

---

## 🧪 TESTAR ISOLAMENTO MULTI-TENANT

### Teste 1: Verificar tenant_id nas tabelas

```sql
-- Verificar se coluna tenant_id existe
SELECT
  table_name,
  column_name,
  data_type
FROM information_schema.columns
WHERE table_schema = 'public'
  AND column_name = 'tenant_id'
ORDER BY table_name;
```

**⚠️ IMPORTANTE:** Se a coluna `tenant_id` NÃO existir, as RLS policies não vão funcionar!

### Se tenant_id não existir, adicionar:

```sql
-- Adicionar coluna tenant_id nas tabelas (se não existir)
ALTER TABLE leads ADD COLUMN IF NOT EXISTS tenant_id UUID REFERENCES tenants(id);
ALTER TABLE conversations ADD COLUMN IF NOT EXISTS tenant_id UUID REFERENCES tenants(id);
ALTER TABLE qualified_leads ADD COLUMN IF NOT EXISTS tenant_id UUID REFERENCES tenants(id);
ALTER TABLE contracts ADD COLUMN IF NOT EXISTS tenant_id UUID REFERENCES tenants(id);
ALTER TABLE messages ADD COLUMN IF NOT EXISTS tenant_id UUID REFERENCES conversations(tenant_id);

-- Criar indexes
CREATE INDEX IF NOT EXISTS idx_leads_tenant ON leads(tenant_id);
CREATE INDEX IF NOT EXISTS idx_conversations_tenant ON conversations(tenant_id);
CREATE INDEX IF NOT EXISTS idx_qualified_leads_tenant ON qualified_leads(tenant_id);
CREATE INDEX IF NOT EXISTS idx_contracts_tenant ON contracts(tenant_id);
```

### Teste 2: Simular 2 tenants

```sql
-- Inserir dados de teste (se tabela tenants existir)
INSERT INTO tenants (id, name, email) VALUES
  ('00000000-0000-0000-0000-000000000001', 'Tenant A', 'a@test.com'),
  ('00000000-0000-0000-0000-000000000002', 'Tenant B', 'b@test.com')
ON CONFLICT DO NOTHING;

-- Inserir leads de teste
INSERT INTO leads (tenant_id, name, email) VALUES
  ('00000000-0000-0000-0000-000000000001', 'Lead A1', 'a1@test.com'),
  ('00000000-0000-0000-0000-000000000002', 'Lead B1', 'b1@test.com');

-- Verificar isolamento (com user do tenant A, só deve ver Lead A1)
SELECT * FROM leads WHERE tenant_id = '00000000-0000-0000-0000-000000000001';
```

---

## ❌ ERROS COMUNS & SOLUÇÕES

### Erro 1: "column tenant_id does not exist"

**Causa:** Tabelas não têm coluna `tenant_id`

**Solução:**
```sql
ALTER TABLE leads ADD COLUMN tenant_id UUID REFERENCES tenants(id);
ALTER TABLE conversations ADD COLUMN tenant_id UUID REFERENCES tenants(id);
-- ... repetir para outras tabelas
```

### Erro 2: "policy already exists"

**Causa:** Tentou criar policy que já existe

**Solução:** Script `APPLY_RLS_POLICIES_ONLY.sql` já tem `DROP POLICY IF EXISTS`, então não deve dar esse erro. Se der, execute:

```sql
-- Drop all policies manualmente
DROP POLICY IF EXISTS "Users can view leads from their tenant" ON leads;
DROP POLICY IF EXISTS "Users can insert leads for their tenant" ON leads;
-- ... etc
```

### Erro 3: "RLS is enabled but user can see all data"

**Causa:** Usando service_role key (bypassa RLS)

**Solução:**
- ✅ Frontend: Use `NEXT_PUBLIC_SUPABASE_ANON_KEY` (respeita RLS)
- ❌ Backend admin: Use `SUPABASE_SERVICE_ROLE_KEY` (bypassa RLS - apenas para admin)

---

## 📚 RECURSOS ADICIONAIS

- **Docs Supabase RLS:** https://supabase.com/docs/guides/auth/row-level-security
- **Policy Examples:** https://supabase.com/docs/guides/database/postgres/row-level-security
- **Multi-tenancy Guide:** https://supabase.com/docs/guides/database/postgres/row-level-security#multi-tenancy

---

## ✅ CHECKLIST FINAL

Após executar `APPLY_RLS_POLICIES_ONLY.sql`:

- [ ] Script executou sem erros
- [ ] Viu mensagens "✅ RLS policies aplicadas"
- [ ] Todas tabelas têm coluna `tenant_id`
- [ ] Policies aparecem em `pg_policies`
- [ ] RLS está ENABLED (`relrowsecurity = true`)
- [ ] Testou isolamento com 2 tenants diferentes

**Se todos ✅ acima:** Sistema está seguro para multi-tenancy! 🎉

---

**Criado por:** MANUS v7.0 DevOps
**Data:** 31/12/2024
**Versão:** 2.0 (sem triggers)
