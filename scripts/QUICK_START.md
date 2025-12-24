# Quick Start - Migração de Produtos

## TL;DR

```bash
# 1. Teste a conexão
npm run test:db-connection

# 2. Migre os produtos
npm run migrate:products

# 3. Verifique o resultado
npm run verify:migration
```

## Comandos Disponíveis

| Comando | Descrição | Quando usar |
|---------|-----------|-------------|
| `npm run test:db-connection` | Testa conexão com Supabase | Antes da primeira migração |
| `npm run migrate:products` | Migra produtos para o banco | Executar migração |
| `npm run verify:migration` | Verifica resultado da migração | Após migração |

## O que será migrado?

- ✅ 22 produtos
- ✅ 11 pacotes
- ✅ 5 produtos em destaque
- ✅ 6 categorias

## Pré-requisitos

Arquivo `.env.local` com:
```env
NEXT_PUBLIC_SUPABASE_URL=https://...
SUPABASE_SERVICE_ROLE_KEY=...
```

## Saída Esperada

### 1. Test Connection
```
✅ Variáveis de ambiente encontradas
✅ Conexão bem-sucedida!
✅ Tabela 'products' está acessível
🎉 Tudo pronto para a migração!
```

### 2. Migrate Products
```
🚀 Iniciando migração de produtos...
✅ Produto Desbloqueio de Conta migrado
✅ Produto Golpe do PIX migrado
...
📊 RESUMO DA MIGRAÇÃO
✅ Produtos migrados: 22
❌ Produtos com erro: 0
🎉 Migração concluída com sucesso!
```

### 3. Verify Migration
```
📦 Total de produtos: 22

📂 Proteção Financeira (4 produtos)
✅ Desbloqueio de Conta - R$ 1.500,00
✅ Golpe do PIX - R$ 1.200,00
...

📦 Total de pacotes: 11
⭐ Produtos em destaque: 5
```

## Troubleshooting Rápido

| Erro | Solução |
|------|---------|
| Variável não encontrada | Verifique `.env.local` |
| Tabela não existe | Execute `npm run db:push` |
| Permissão negada | Use `SUPABASE_SERVICE_ROLE_KEY` |
| Produto falhou | Execute novamente (usa upsert) |

## Próximos Passos

1. ✅ Migração concluída
2. Atualizar app para ler do banco
3. Criar admin de produtos
4. Implementar cache

## Documentação Completa

- 📖 `MIGRATION_GUIDE.md` - Guia completo
- 📖 `scripts/README.md` - Docs técnicas
- 📖 `scripts/MIGRATION_SUMMARY.md` - Resumo detalhado
- 📖 `scripts/product-example.json` - Exemplo de produto

## Tempo Estimado

- Teste: 5 segundos
- Migração: 30-60 segundos
- Verificação: 5 segundos
- **Total: ~1 minuto**

---

💡 **Dica:** Pode executar `npm run migrate:products` quantas vezes quiser. Ele usa `upsert`, então não vai duplicar dados!
