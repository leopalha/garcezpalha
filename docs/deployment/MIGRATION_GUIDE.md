# Guia de Migração de Produtos

Este guia explica como migrar os produtos do arquivo TypeScript para o banco de dados Supabase.

## Passo a Passo

### 1. Verifique as Variáveis de Ambiente

Certifique-se de que o arquivo `.env.local` existe e contém:

```env
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
SUPABASE_SERVICE_ROLE_KEY=sua_service_role_key_aqui
```

> **Importante:** Use a `service_role_key`, não a `anon_key`, pois ela tem permissões administrativas necessárias para a migração.

### 2. Teste a Conexão

Antes de migrar, teste se tudo está configurado corretamente:

```bash
npm run test:db-connection
```

**Saída esperada:**
```
✅ Variáveis de ambiente encontradas
✅ Conexão bem-sucedida!
✅ Tabela 'products' está acessível
✅ Tabela 'product_packages' está acessível
🎉 Tudo pronto para a migração!
```

### 3. Execute a Migração

Se o teste passou, execute a migração:

```bash
npm run migrate:products
```

**Tempo estimado:** 30-60 segundos

**Saída esperada:**
```
🚀 Iniciando migração de produtos...

📦 Migrando produto: Desbloqueio de Conta Bancária
✅ Produto Desbloqueio de Conta Bancária migrado com sucesso
   📦 Migrando 2 pacotes...
   ✅ Pacote Análise Gratuita migrado
   ✅ Pacote Desbloqueio Completo migrado

... (mais 21 produtos)

==================================================
📊 RESUMO DA MIGRAÇÃO
==================================================
✅ Produtos migrados com sucesso: 22
❌ Produtos com erro: 0
📦 Total de produtos processados: 22
==================================================

🎉 Migração concluída com sucesso!
```

### 4. Verifique no Supabase

1. Acesse o [Supabase Dashboard](https://app.supabase.com)
2. Navegue até **Table Editor**
3. Verifique as tabelas:
   - `products` - Deve ter 22 registros
   - `product_packages` - Deve ter os pacotes configurados

## Produtos que Serão Migrados

### Proteção Financeira (4 produtos)
- ✅ Desbloqueio de Conta Bancária - R$ 1.500
- ✅ Recuperação de Golpe do PIX - R$ 1.200
- ✅ Negativação Indevida - R$ 1.000
- ✅ Defesa em Execução - R$ 1.800

### Proteção Patrimonial (6 produtos)
- ✅ Direito Imobiliário - R$ 1.500
- ✅ Usucapião - R$ 3.000
- ✅ Holding Familiar - R$ 5.000
- ✅ Inventário - R$ 3.500
- ✅ Regularização de Imóvel - R$ 2.000
- ✅ Avaliação de Imóveis - R$ 1.200

### Proteção de Saúde (5 produtos)
- ✅ Plano de Saúde Negou - R$ 1.500
- ✅ Cirurgia Bariátrica - R$ 1.800
- ✅ Tratamento TEA - R$ 1.500
- ✅ BPC/LOAS - R$ 1.200
- ✅ Perícia Médica - R$ 2.500

### Perícia e Documentos (3 produtos)
- ✅ Perícia Documental - R$ 2.000
- ✅ Grafotecnia - R$ 1.800
- ✅ Laudo Técnico - R$ 1.500

### Defesa Criminal (2 produtos)
- ✅ Direito Criminal - R$ 2.500
- ✅ Direito Aeronáutico - R$ 3.000

### Automação Jurídica (2 produtos)
- ✅ Secretaria Remota - R$ 800/mês
- ✅ Aposentadoria - R$ 1.500

## Pacotes Configurados

Alguns produtos têm múltiplos pacotes/planos:

### Desbloqueio de Conta
1. Análise Gratuita - R$ 0
2. **Desbloqueio Completo - R$ 1.500** (Recomendado)

### Golpe do PIX
1. Análise + Orientação - R$ 297
2. **Notificação Extrajudicial - R$ 697** (Recomendado)
3. Ação Judicial Completa - R$ 1.200

### Negativação Indevida
1. Notificação Extrajudicial - R$ 397
2. **Remoção com Liminar - R$ 897** (Recomendado)
3. Remoção + Indenização - R$ 1.000

### Plano de Saúde
1. Notificação Extrajudicial - R$ 497
2. **Ação com Liminar - R$ 1.500** (Recomendado)
3. Ação + Indenização - R$ 2.000

## Troubleshooting

### ❌ Erro: "NEXT_PUBLIC_SUPABASE_URL não está definida"

**Solução:** Crie ou edite o arquivo `.env.local` e adicione a URL do Supabase.

### ❌ Erro: "Tabela 'products' não encontrada"

**Solução:** Execute as migrações do banco:
```bash
npm run db:push
```

### ❌ Erro: "Permission denied"

**Solução:** Verifique se você está usando a `SUPABASE_SERVICE_ROLE_KEY` correta (não a anon key).

### ⚠️ Alguns produtos falharam

**Solução:** O script continua mesmo com erros. Verifique os logs, corrija o problema e execute novamente. Como usa `upsert`, não vai duplicar os que já funcionaram.

## Executar Novamente

Pode executar o script quantas vezes quiser:

```bash
npm run migrate:products
```

- Produtos existentes serão **atualizados**
- Novos produtos serão **inseridos**
- **Não haverá duplicação** de dados

## Próximos Passos

Depois de migrar os produtos:

1. ✅ Atualize a aplicação para ler do banco ao invés do arquivo TypeScript
2. ✅ Crie a página de gerenciamento de produtos no admin
3. ✅ Implemente a edição de produtos via interface
4. ✅ Configure os preços regionais se necessário

## Suporte

Se encontrar problemas:

1. Execute primeiro: `npm run test:db-connection`
2. Verifique os logs de erro detalhados
3. Consulte a documentação em `scripts/README.md`
4. Verifique o schema do banco no Supabase Dashboard

## Backup

Antes de executar em produção, faça backup do banco:

```bash
npm run backup
```

Ou através do Supabase Dashboard:
1. Settings → Database
2. Backups → Create Backup
