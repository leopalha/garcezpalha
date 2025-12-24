# Índice - Scripts de Migração de Produtos

## Início Rápido

🚀 **Quer migrar agora?** Leia: [`QUICK_START.md`](QUICK_START.md)

## Documentação

### Para Iniciantes
1. 📖 [`QUICK_START.md`](QUICK_START.md) - Início rápido (2 min de leitura)
2. 📖 [`../MIGRATION_GUIDE.md`](../MIGRATION_GUIDE.md) - Guia passo a passo (5 min)

### Para Desenvolvedores
3. 📖 [`README.md`](README.md) - Documentação técnica completa
4. 📖 [`MIGRATION_SUMMARY.md`](MIGRATION_SUMMARY.md) - Resumo detalhado da migração
5. 📖 [`product-example.json`](product-example.json) - Exemplo de estrutura de produto

## Scripts

### Principais
- [`migrate-products-to-db.mjs`](migrate-products-to-db.mjs) - Script principal de migração
- [`test-db-connection.mjs`](test-db-connection.mjs) - Teste de conexão
- [`verify-migration.mjs`](verify-migration.mjs) - Verificação pós-migração

### Comandos NPM
```bash
npm run test:db-connection  # Testa conexão
npm run migrate:products    # Executa migração
npm run verify:migration    # Verifica resultado
```

## Fluxo de Trabalho

```
┌─────────────────────┐
│  test-db-connection │ → Testa conexão e valida ambiente
└──────────┬──────────┘
           │
           ↓
┌─────────────────────┐
│  migrate-products   │ → Migra 22 produtos + 11 pacotes
└──────────┬──────────┘
           │
           ↓
┌─────────────────────┐
│  verify-migration   │ → Verifica e exibe estatísticas
└─────────────────────┘
```

## Arquivos por Tipo

### Scripts Executáveis (.mjs)
- `migrate-products-to-db.mjs` (20KB) - Migração principal
- `test-db-connection.mjs` (1.8KB) - Teste de conexão
- `verify-migration.mjs` (4KB) - Verificação

### Documentação (.md)
- `QUICK_START.md` (2.4KB) - Início rápido
- `README.md` (5KB) - Documentação técnica
- `MIGRATION_SUMMARY.md` (6.5KB) - Resumo detalhado
- `../MIGRATION_GUIDE.md` (5.1KB) - Guia passo a passo

### Referência (.json)
- `product-example.json` (2KB) - Estrutura de exemplo

## Por Onde Começar?

### Se você quer...

**...migrar agora (sem ler muito):**
→ [`QUICK_START.md`](QUICK_START.md)

**...entender o processo completo:**
→ [`../MIGRATION_GUIDE.md`](../MIGRATION_GUIDE.md)

**...detalhes técnicos:**
→ [`README.md`](README.md)

**...ver o que será migrado:**
→ [`MIGRATION_SUMMARY.md`](MIGRATION_SUMMARY.md)

**...criar um novo produto:**
→ [`product-example.json`](product-example.json)

## Checklist

- [ ] Ler `QUICK_START.md`
- [ ] Configurar `.env.local`
- [ ] Executar `npm run test:db-connection`
- [ ] Executar `npm run migrate:products`
- [ ] Executar `npm run verify:migration`
- [ ] Verificar produtos no Supabase Dashboard
- [ ] Atualizar aplicação para usar banco

## Estatísticas

| Métrica | Valor |
|---------|-------|
| Total de produtos | 22 |
| Total de pacotes | 11 |
| Categorias | 6 |
| Produtos em destaque | 5 |
| Tempo de migração | ~1 minuto |

## Suporte

Problemas? Consulte:
1. Seção Troubleshooting em [`QUICK_START.md`](QUICK_START.md)
2. Seção Troubleshooting em [`README.md`](README.md)
3. Seção Troubleshooting em [`../MIGRATION_GUIDE.md`](../MIGRATION_GUIDE.md)

---

**Última atualização:** 2025-12-24
**Versão:** 1.0.0
