# 🚀 OTIMIZAR DEV SERVER - MELHORAR PERFORMANCE

**Data:** 31/12/2024
**Problema:** Dev server extremamente lento
**Objetivo:** Otimizar Next.js dev para performance aceitável

---

## 🎯 PROBLEMA IDENTIFICADO

**Sintomas:**
- ✅ API funciona (curl retorna em 2s)
- ❌ Navegador está lento (30s+ para responder)
- ❌ Webpack/Next.js está demorando muito para compilar

**Causa Provável:**
1. Webpack está compilando muitos arquivos desnecessários
2. Source maps grandes em desenvolvimento
3. HMR (Hot Module Replacement) com muitos módulos
4. Processos Node.js múltiplos rodando

---

## ✅ SOLUÇÕES RÁPIDAS

### 1. **Limpar Cache e .next**

```bash
# Parar servidor (Ctrl+C)

# Limpar cache
rm -rf .next
rm -rf node_modules/.cache

# Reiniciar
npm run dev
```

**Resultado esperado:** Build inicial mais rápido

---

### 2. **Usar Turbopack (Mais Rápido)**

O Next.js 14 suporta Turbopack (10x mais rápido que Webpack):

```bash
npm run dev -- --turbo
```

**OU edite `package.json`:**

```json
{
  "scripts": {
    "dev": "next dev --turbo"
  }
}
```

**Benefícios:**
- ✅ Compilação 10x mais rápida
- ✅ HMR instantâneo
- ✅ Menor uso de memória

---

### 3. **Desabilitar Source Maps em Dev**

Edite `next.config.js`:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  // ... outras configs

  // Desabilitar source maps em dev (mais rápido)
  productionBrowserSourceMaps: false,

  webpack: (config, { dev, isServer }) => {
    if (dev && !isServer) {
      config.devtool = 'eval-cheap-module-source-map' // Mais rápido
    }
    return config
  }
}
```

---

### 4. **Reduzir Escopo de Compilação**

Edite `next.config.js`:

```javascript
const nextConfig = {
  // Compilar apenas páginas acessadas
  experimental: {
    optimizePackageImports: [
      '@radix-ui/react-icons',
      'lucide-react',
      'recharts'
    ],
  },

  // Desabilitar features não usadas
  swcMinify: true,

  // Otimizar imports
  modularizeImports: {
    'lucide-react': {
      transform: 'lucide-react/dist/esm/icons/{{kebabCase member}}'
    }
  }
}
```

---

### 5. **Aumentar Heap Size do Node**

Edite `package.json`:

```json
{
  "scripts": {
    "dev": "NODE_OPTIONS='--max-old-space-size=4096' next dev --turbo"
  }
}
```

**No Windows (PowerShell):**
```powershell
$env:NODE_OPTIONS="--max-old-space-size=4096"
npm run dev
```

---

### 6. **Matar Processos Duplicados**

**No Windows (PowerShell):**
```powershell
# Listar processos Node
Get-Process | Where-Object {$_.ProcessName -like "*node*"}

# Matar todos
Get-Process | Where-Object {$_.ProcessName -like "*node*"} | Stop-Process -Force
```

**No Git Bash:**
```bash
# Listar
ps aux | grep node

# Matar por PID (substitua XXXX pelo PID)
taskkill //F //PID XXXX
```

---

### 7. **Usar .env.development**

Crie `.env.development` (apenas para dev):

```env
# Desabilitar analytics em dev
NEXT_TELEMETRY_DISABLED=1

# Modo de desenvolvimento
NODE_ENV=development

# Otimizações
NEXT_PRIVATE_STANDALONE=false
```

---

### 8. **Verificar Antivirus/Windows Defender**

Antivirus pode estar escaneando cada arquivo compilado!

**Adicione exceção para:**
- `d:\garcezpalha\node_modules\`
- `d:\garcezpalha\.next\`
- `node.exe` process

**Windows Defender:**
1. Configurações → Atualização e Segurança → Segurança do Windows
2. Proteção contra vírus e ameaças → Gerenciar configurações
3. Exclusões → Adicionar ou remover exclusões
4. Adicionar pasta: `d:\garcezpalha\`

---

## 🎯 SOLUÇÃO RECOMENDADA (COMBO)

Execute estes passos em ordem:

```bash
# 1. Parar servidor (Ctrl+C)

# 2. Limpar cache
rm -rf .next node_modules/.cache

# 3. Instalar dependencies (se necessário)
npm install

# 4. Rodar com Turbopack
npm run dev -- --turbo
```

**OU edite package.json uma vez:**

```json
{
  "scripts": {
    "dev": "NODE_OPTIONS='--max-old-space-size=4096' next dev --turbo",
    "dev:fast": "next dev --turbo"
  }
}
```

E rode:
```bash
npm run dev:fast
```

---

## 📊 COMPARAÇÃO DE PERFORMANCE

| Método | Build Inicial | HMR | Uso RAM |
|--------|---------------|-----|---------|
| Webpack padrão | ~60s | ~5s | ~800MB |
| Webpack otimizado | ~40s | ~3s | ~600MB |
| **Turbopack** | **~6s** | **~0.5s** | **~400MB** |

**Recomendação:** Usar Turbopack sempre

---

## 🔍 DIAGNÓSTICO

Se ainda estiver lento, verifique:

### 1. **Uso de CPU/RAM**

```bash
# Ver processos Node
ps aux | grep node

# No Windows Task Manager
# Ctrl+Shift+Esc → Detalhes → Procurar node.exe
```

**Esperado:**
- CPU: 10-30% durante compilação
- RAM: 300-600MB por processo

**Se estiver acima:**
- Múltiplos processos rodando (matar)
- Leak de memória (reiniciar)

### 2. **Webpack Stats**

Adicione ao `next.config.js`:

```javascript
const nextConfig = {
  webpack: (config, { dev }) => {
    if (dev) {
      config.stats = 'minimal' // Menos logs
    }
    return config
  }
}
```

### 3. **Verifique Disk I/O**

SSD vs HDD faz diferença ENORME:
- SSD: Build em ~6s com Turbopack
- HDD: Build em ~30s com Turbopack

---

## ⚡ RESULTADO ESPERADO

**Após otimizações:**

```
✓ Ready in 6.2s
✓ Compiled /api/chat/assistant in 234ms
✓ HMR complete in 0.5s
```

**Teste API:**
```bash
curl http://localhost:3000/api/chat/assistant
# Resposta em < 2s
```

---

## 🆘 ÚLTIMA ALTERNATIVA

Se NADA funcionar, rode em **produção otimizada**:

```bash
# Build production
npm run build

# Rodar production localmente
npm start
```

**Prós:**
- ✅ Muito mais rápido
- ✅ Código otimizado

**Contras:**
- ❌ Sem HMR (precisa rebuild para ver mudanças)
- ❌ Sem dev tools

---

**Status:** 🟡 Dev server lento identificado
**Próximo passo:** Aplicar otimizações acima
**Tempo estimado:** 5 minutos

---

🎯 **Generated with Claude Code**
**Model:** Claude Sonnet 4.5
**Data:** 31/12/2024
