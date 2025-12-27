# Configuração do Supabase CLI

Este guia explica como configurar o Supabase CLI para gerenciar migrations do banco de dados.

## Passo 1: Login no Supabase

Execute o comando abaixo e siga as instruções:

```bash
npm run db:login
# ou
npx supabase login
```

Isso abrirá o navegador para você fazer login na sua conta Supabase. Após o login, um token de acesso será salvo localmente.

## Passo 2: Linkar o Projeto

Após o login, vincule o projeto local ao projeto remoto no Supabase:

```bash
npm run db:link
# ou
npx supabase link --project-ref SEU_PROJECT_REF
```

Para encontrar o `project-ref`:
1. Acesse https://supabase.com/dashboard
2. Selecione o projeto Garcez Palha
3. Vá em **Settings** > **General**
4. Copie o **Reference ID** (ex: `abcdefghijklmnop`)

Você também precisará da senha do banco de dados (database password).

## Passo 3: Executar Migrations

Após linkar, você pode executar as migrations:

```bash
# Push todas as migrations para o banco remoto
npm run db:push
# ou
npx supabase db push
```

## Comandos Disponíveis

| Comando | Descrição |
|---------|-----------|
| `npm run db:login` | Login no Supabase CLI |
| `npm run db:link` | Linkar projeto local ao remoto |
| `npm run db:push` | Enviar migrations para produção |
| `npm run db:pull` | Baixar schema do banco remoto |
| `npm run db:reset` | Resetar banco local (dev) |
| `npm run db:diff` | Ver diferenças entre local e remoto |
| `npm run db:status` | Ver status das migrations |
| `npm run db:types` | Gerar tipos TypeScript do schema |

## Executar Migration Específica

Para executar apenas a migration `020_scheduled_posts.sql`:

### Opção 1: Via CLI (após db:link)
```bash
npx supabase db push
```

### Opção 2: Via SQL Editor (Supabase Dashboard)
1. Acesse https://supabase.com/dashboard
2. Selecione o projeto
3. Vá em **SQL Editor**
4. Cole o conteúdo de `supabase/migrations/020_scheduled_posts.sql`
5. Clique em **Run**

## Variáveis de Ambiente (Opcional)

Você pode definir o token de acesso via variável de ambiente:

```bash
# .env.local
SUPABASE_ACCESS_TOKEN=sbp_xxxxxxxxxxxxx
```

Ou no PowerShell:
```powershell
$env:SUPABASE_ACCESS_TOKEN = "sbp_xxxxxxxxxxxxx"
```

## Troubleshooting

### Erro: "Access token not provided"
Execute `npm run db:login` para fazer login.

### Erro: "Project not linked"
Execute `npm run db:link` e forneça o project-ref.

### Erro: "Permission denied"
Verifique se você tem permissões de admin no projeto Supabase.

---

*Arquivo criado em 2024-12-23*
