# 🔐 Segurança e Proteção de Secrets

Este projeto implementa múltiplas camadas de proteção para prevenir vazamento de API keys e secrets.

---

## 🛡️ Camadas de Proteção

### 1. Pre-commit Hook (Local)
**Arquivo:** `.git/hooks/pre-commit`

Bloqueia commits contendo:
- ✅ Chaves OpenAI (`sk-proj-...`, `sk-...`)
- ✅ Chaves D-ID (`Basic ...`)
- ✅ Variáveis de ambiente com secrets

**Como funciona:**
```bash
git add arquivo-com-secret.txt
git commit -m "test"
# ❌ COMMIT BLOQUEADO! Secret detectado.
```

### 2. GitHub Push Protection
Bloqueia push de commits contendo secrets conhecidos.

Se você receber erro ao fazer push:
```
! [remote rejected] main -> main (push declined due to repository rule violations)
```

**Solução:** Remova o secret do histórico (não faça bypass!)

### 3. Runtime Key Validation
**Arquivo:** `src/lib/api/keys-manager.ts`

Valida chaves antes de usar:
- ✅ Verifica formato correto
- ✅ Testa conectividade com API
- ✅ Cache de 5 minutos
- ✅ Mensagens claras de erro

---

## 📝 Boas Práticas

### ✅ FAZER

1. **Use variáveis de ambiente**
   ```bash
   # .env.local (nunca commitado)
   OPENAI_API_KEY="sk-proj-sua-chave"
   DID_API_KEY="Basic sua-chave"
   ```

2. **No código, leia do ambiente**
   ```typescript
   const apiKey = process.env.OPENAI_API_KEY
   ```

3. **Mantenha .env.local no .gitignore**
   ```gitignore
   .env.local
   .env*.local
   ```

### ❌ NÃO FAZER

1. **Nunca hardcode chaves**
   ```typescript
   // ❌ ERRADO
   const apiKey = "sk-proj-12345..."
   ```

2. **Nunca commite arquivos com secrets**
   ```bash
   # ❌ ERRADO
   git add .env.local
   git add SETUP-API-KEYS.md
   ```

3. **Nunca faça bypass do hook**
   ```bash
   # ❌ PERIGOSO
   git commit --no-verify
   ```

---

## 🔧 Instalação do Hook

O hook já está instalado. Para reinstalar:

```bash
# Copiar do backup
cp .github/hooks/pre-commit .git/hooks/pre-commit

# Dar permissão
chmod +x .git/hooks/pre-commit

# Testar
.git/hooks/pre-commit
```

---

## 🧪 Testar Proteção

```bash
# 1. Criar arquivo com secret
echo 'OPENAI_API_KEY="sk-proj-test"' > test.txt

# 2. Tentar commitar
git add test.txt
git commit -m "test"

# 3. Resultado esperado:
# ❌ SECRET DETECTADO
# 🚫 COMMIT BLOQUEADO!

# 4. Limpar
rm test.txt
```

---

## 🚨 O Que Fazer Se Commitou um Secret

### Se ainda não fez push:

```bash
# Desfazer último commit
git reset HEAD~1

# Remover secret do arquivo
# ... edite o arquivo ...

# Commitar novamente
git add .
git commit -m "mensagem"
```

### Se já fez push:

**Você precisará reescrever o histórico** (complexo!):

```bash
# Remover arquivo de TODO o histórico
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch ARQUIVO.md" \
  --prune-empty --tag-name-filter cat -- --all

# Force push (CUIDADO!)
git push origin main --force
```

**⚠️ Melhor:** Prevenir com os hooks!

---

## 📊 Arquivos Protegidos

### Sempre no .gitignore:
```gitignore
.env.local
.env*.local
SETUP-*.md
BLOQUEADOR_*.md
SISTEMA-*.md
*.md com API keys
```

### Nunca commitar:
- Arquivos `.env` com valores reais
- Documentação com chaves de exemplo reais
- Screenshots mostrando keys
- Logs com tokens

---

## 🔍 Verificação Manual

Para verificar se há secrets commitados:

```bash
# Buscar padrões suspeitos
git log -S "sk-proj-" --all
git log -S "OPENAI_API_KEY=" --all

# Ver conteúdo de commit específico
git show COMMIT_HASH
```

---

## 📚 Documentação Completa

- **Pre-commit Hook:** [.github/PRE-COMMIT-HOOK.md](.github/PRE-COMMIT-HOOK.md)
- **Keys Manager:** [src/lib/api/keys-manager.ts](src/lib/api/keys-manager.ts)

---

## ✅ Checklist de Segurança

Antes de commitar:

- [ ] Arquivo não contém API keys?
- [ ] Variáveis de ambiente estão em `.env.local`?
- [ ] `.env.local` está no `.gitignore`?
- [ ] Pre-commit hook está instalado?
- [ ] Testou o commit (sem `--no-verify`)?

Antes de fazer push:

- [ ] Nenhum secret no histórico?
- [ ] GitHub Push Protection não bloqueou?
- [ ] Revisou arquivos modificados?

---

## 🆘 Suporte

Se você:
- Commitou um secret acidentalmente
- Recebeu erro do GitHub Push Protection
- Precisa remover secret do histórico

**Não tente bypass!** Entre em contato para suporte.

---

_Sistema implementado em 2025-12-28._
_3 camadas de proteção: Pre-commit Hook + GitHub Protection + Runtime Validation._
