# Como Aplicar as Migrations do Sistema de Produtos

## Opção 1: Via Supabase CLI (Recomendado)

### Passo 1: Verificar se o Supabase CLI está instalado
```bash
supabase --version
```

Se não estiver instalado:
```bash
npm install -g supabase
```

### Passo 2: Login no Supabase
```bash
supabase login
```

### Passo 3: Linkar com seu projeto
```bash
supabase link --project-ref SEU_PROJECT_REF
```

### Passo 4: Aplicar migrations
```bash
cd d:\garcezpalha
supabase db push
```

### Passo 5: Verificar
```bash
supabase db diff
```

---

## Opção 2: Via Supabase Dashboard (Mais Fácil)

### Passo 1: Acessar SQL Editor
1. Abra https://app.supabase.com
2. Selecione seu projeto
3. Vá em "SQL Editor" no menu lateral

### Passo 2: Criar Schema
1. Clique em "New Query"
2. Copie TODO o conteúdo de:
   ```
   d:\garcezpalha\supabase\migrations\20251224180414_create_products_system.sql
   ```
3. Cole no editor
4. Clique em "Run" (ou pressione Ctrl+Enter)
5. Aguarde a mensagem de sucesso

### Passo 3: Popular com Exemplos
1. Clique em "New Query" novamente
2. Copie TODO o conteúdo de:
   ```
   d:\garcezpalha\supabase\migrations\20251224180415_seed_products_examples.sql
   ```
3. Cole no editor
4. Clique em "Run"
5. Aguarde a mensagem de sucesso

### Passo 4: Verificar
1. Vá em "Table Editor"
2. Procure por tabelas `products` e `product_packages`
3. Veja os 4 produtos de exemplo cadastrados

---

## Opção 3: Via psql (Para Avançados)

### Requisitos
- PostgreSQL client instalado
- Credenciais de conexão do Supabase

### Comandos
```bash
# Schema
psql -h db.SEU_PROJECT.supabase.co -p 5432 -U postgres -d postgres -f "d:\garcezpalha\supabase\migrations\20251224180414_create_products_system.sql"

# Seed
psql -h db.SEU_PROJECT.supabase.co -p 5432 -U postgres -d postgres -f "d:\garcezpalha\supabase\migrations\20251224180415_seed_products_examples.sql"
```

---

## Verificação Pós-Migration

### 1. Verificar Tabelas Criadas
No SQL Editor do Supabase, execute:

```sql
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
AND table_name IN ('products', 'product_packages');
```

Deve retornar 2 linhas.

### 2. Verificar Produtos de Exemplo
```sql
SELECT id, name, category, is_active
FROM products;
```

Deve retornar 4 produtos:
- aposentadoria-invalidez
- plano-saude-cobertura
- usucapiao
- defesa-criminal

### 3. Verificar Pacotes
```sql
SELECT pp.id, pp.name, pp.price, p.name as product_name
FROM product_packages pp
JOIN products p ON pp.product_id = p.id
ORDER BY p.name, pp.order_index;
```

Deve retornar 11 pacotes no total.

### 4. Verificar Índices
```sql
SELECT indexname
FROM pg_indexes
WHERE tablename IN ('products', 'product_packages');
```

Deve mostrar os índices criados.

---

## Solução de Problemas

### Erro: "relation already exists"
**Causa**: Tabelas já foram criadas antes.

**Solução**:
```sql
-- Deletar tabelas antigas (CUIDADO: apaga dados!)
DROP TABLE IF EXISTS product_packages CASCADE;
DROP TABLE IF EXISTS products CASCADE;

-- Depois execute a migration novamente
```

### Erro: "permission denied"
**Causa**: Usuário sem permissão.

**Solução**: Use o usuário `postgres` (superuser) do Supabase.

### Erro: "syntax error"
**Causa**: Arquivo copiado incorretamente.

**Solução**:
1. Certifique-se de copiar TODO o arquivo
2. Não edite o SQL antes de executar
3. Execute em uma única query

### Tabelas criadas mas sem dados
**Causa**: Seed não foi executado.

**Solução**: Execute o arquivo `20251224180415_seed_products_examples.sql`

---

## Rollback (Reverter Migrations)

### Se precisar desfazer:

```sql
-- ATENÇÃO: Isso apaga TUDO!
DROP TABLE IF EXISTS product_packages CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP FUNCTION IF EXISTS update_updated_at_column();
```

---

## Próximos Passos Após Migration

1. ✅ Migrations aplicadas
2. ✅ Dados de exemplo no banco
3. 🔄 Reinicie o servidor dev: `npm run dev`
4. 🔄 Acesse: http://localhost:3000/admin/produtos
5. 🔄 Veja os produtos de exemplo
6. 🔄 Teste criar um novo produto
7. 🔄 Acesse uma VSL: http://localhost:3000/aposentadoria-invalidez

---

## Checklist

- [ ] Migration 20251224180414 aplicada
- [ ] Migration 20251224180415 aplicada (seed)
- [ ] Tabela `products` existe
- [ ] Tabela `product_packages` existe
- [ ] 4 produtos de exemplo cadastrados
- [ ] 11 pacotes de exemplo cadastrados
- [ ] Servidor dev reiniciado
- [ ] Página admin acessível
- [ ] VSL de exemplo acessível

---

## Suporte

Se encontrar qualquer problema:
1. Veja a seção "Solução de Problemas" acima
2. Consulte `docs/PRODUCTS_SYSTEM.md`
3. Verifique logs do Supabase
4. Entre em contato com o time de desenvolvimento
