# 🔐 Sistema de Proteção contra Commit de Secrets

## ✅ IMPLEMENTADO E ATIVO

Este hook Git previne automaticamente que API keys e outros secrets sejam commitados acidentalmente.

---

## 🎯 O Que Este Hook Faz

### Proteção Automática
- ✅ Bloqueia commits contendo API keys da OpenAI
- ✅ Bloqueia commits contendo API keys da D-ID
- ✅ Detecta chaves em formato de variáveis de ambiente
- ✅ Previne vazamento de secrets no histórico Git

### Padrões Detectados

```regex
sk-proj-[A-Za-z0-9_-]{20,}      # OpenAI keys (novo formato)
sk-[A-Za-z0-9]{20,}              # OpenAI keys (formato antigo)
Basic [A-Za-z0-9+/=]{20,}        # D-ID keys
OPENAI_API_KEY="sk-              # Keys em arquivos .env
DID_API_KEY="Basic               # D-ID em arquivos .env
```

---

## 🔧 Instalação

O hook já está instalado em `.git/hooks/pre-commit`.

Para reinstalar ou atualizar:

```bash
# Copiar o hook
cp .github/hooks/pre-commit .git/hooks/pre-commit

# Dar permissão de execução
chmod +x .git/hooks/pre-commit
```

---

## 🧪 Como Testar

### Teste 1: Tentar commitar uma chave OpenAI

```bash
echo 'OPENAI_API_KEY="sk-proj-test123"' > test.txt
git add test.txt
git commit -m "test"
```

**Resultado esperado:**
```
❌ SECRET DETECTADO em test.txt
🚫 COMMIT BLOQUEADO!
```

### Teste 2: Commit normal (sem secrets)

```bash
echo 'Hello World' > test.txt
git add test.txt
git commit -m "test"
```

**Resultado esperado:**
```
✅ Nenhum secret detectado. Commit permitido.
```

---

## 🚫 O Que Acontece Quando Bloqueado

Se você tentar commitar um arquivo com secrets:

```
🔍 Verificando secrets antes do commit...
❌ SECRET DETECTADO em arquivo.md
   Padrão encontrado: sk-proj-[A-Za-z0-9_-]{20,}

🚫 COMMIT BLOQUEADO!
📋 Secrets/API keys foram detectadas nos arquivos.

💡 Para resolver:
   1. Remova as chaves dos arquivos
   2. Use variáveis de ambiente (.env.local)
   3. Adicione arquivos sensíveis ao .gitignore
```

---

## 💡 Boas Práticas

### ✅ FAZER

```bash
# .env.local (NÃO commitado)
OPENAI_API_KEY="sk-proj-sua-chave-aqui"
DID_API_KEY="Basic sua-chave-aqui"

# No código
const apiKey = process.env.OPENAI_API_KEY
```

### ❌ NÃO FAZER

```typescript
// ❌ NUNCA hardcode keys no código
const apiKey = "sk-proj-12345..."

// ❌ NUNCA commite arquivos .env com keys
// .env.local (deve estar no .gitignore)
```

---

## 📂 Arquivos Protegidos

O hook verifica todos os arquivos staged, exceto:
- `node_modules/`
- `.next/`
- Arquivos binários

---

## 🔄 Bypass (Não Recomendado)

**⚠️ Use apenas em emergências:**

```bash
git commit --no-verify -m "mensagem"
```

**Mas lembre-se:** Isso desabilita a proteção e pode vazar secrets!

---

## 🛡️ Camadas de Proteção

Este projeto tem **3 camadas** de proteção:

1. **Pre-commit Hook** (este arquivo) - Previne commits locais
2. **GitHub Push Protection** - Bloqueia push com secrets
3. **Keys Manager** (runtime) - Valida keys antes de usar

---

## 📊 Status

- ✅ Pre-commit hook instalado
- ✅ Testado e funcionando
- ✅ Protege contra OpenAI keys
- ✅ Protege contra D-ID keys
- ✅ Mensagens claras de erro

---

## 🆘 Troubleshooting

### Hook não está executando

```bash
# Verificar se existe
ls -la .git/hooks/pre-commit

# Verificar permissões
chmod +x .git/hooks/pre-commit

# Testar manualmente
.git/hooks/pre-commit
```

### Hook detecta falso positivo

Edite `.git/hooks/pre-commit` e ajuste os padrões regex.

---

## 📝 Manutenção

### Adicionar Novo Padrão

Edite `.git/hooks/pre-commit` e adicione ao array `PATTERNS`:

```bash
PATTERNS=(
    "sk-proj-[A-Za-z0-9_-]{20,}"
    "seu-novo-padrao-aqui"
)
```

### Remover Padrão

Remova ou comente a linha correspondente no array `PATTERNS`.

---

_Sistema implementado em 2025-12-28 após incidente de vazamento de API key no GitHub._
_Previne que o histórico Git seja reescrito novamente devido a secrets commitados._
