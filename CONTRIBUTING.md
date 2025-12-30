# 🤝 Guia de Contribuição - Garcez Palha

Obrigado por considerar contribuir com o projeto Garcez Palha! Este documento fornece diretrizes para contribuir com o projeto.

---

## 📋 Índice

1. [Código de Conduta](#código-de-conduta)
2. [Como Contribuir](#como-contribuir)
3. [Configuração do Ambiente](#configuração-do-ambiente)
4. [Padrões de Código](#padrões-de-código)
5. [Processo de Pull Request](#processo-de-pull-request)
6. [Reportar Bugs](#reportar-bugs)
7. [Sugerir Melhorias](#sugerir-melhorias)
8. [Documentação](#documentação)

---

## 📜 Código de Conduta

Este projeto adota um Código de Conduta baseado no [Contributor Covenant](https://www.contributor-covenant.org/):

### Nossa Promessa
- Trataremos todos com respeito e dignidade
- Valorizamos a diversidade de perspectivas e experiências
- Não toleramos assédio, discriminação ou comportamento abusivo
- Focamos em construir um ambiente colaborativo e profissional

### Reporte Problemas
Se você presenciar ou experimentar comportamento inadequado, contate: leonardo@garcezpalha.com.br

---

## 🚀 Como Contribuir

### Tipos de Contribuição

#### 1. **Código**
- Correção de bugs
- Novas funcionalidades
- Melhorias de performance
- Refatoração de código legado

#### 2. **Documentação**
- Corrigir typos ou erros
- Melhorar explicações
- Adicionar exemplos
- Traduzir documentação

#### 3. **Design & UX**
- Melhorias de interface
- Protótipos de novas features
- Feedback de usabilidade
- Sugestões de acessibilidade

#### 4. **Testes**
- Escrever testes unitários
- Testes de integração
- Testes E2E
- Reportar bugs

---

## 🛠️ Configuração do Ambiente

### Pré-requisitos

```bash
Node.js 18+
npm ou yarn
Git
Conta Supabase (gratuita)
```

### Instalação

1. **Fork o repositório**
```bash
# Clone seu fork
git clone https://github.com/seu-usuario/garcezpalha.git
cd garcezpalha
```

2. **Instale dependências**
```bash
npm install
```

3. **Configure variáveis de ambiente**
```bash
# Copie o template
cp .env.example .env.local

# Edite .env.local com suas credenciais
# Mínimo obrigatório:
# - NEXT_PUBLIC_SUPABASE_URL
# - NEXT_PUBLIC_SUPABASE_ANON_KEY
# - SUPABASE_SERVICE_ROLE_KEY
# - NEXTAUTH_SECRET
# - OPENAI_API_KEY
```

4. **Execute migrations**
```bash
npm run db:push
```

5. **Inicie o servidor de desenvolvimento**
```bash
npm run dev
```

Acesse: http://localhost:3000

### Verificação do Ambiente

```bash
# Verificar TypeScript
npm run typecheck

# Verificar build
npm run build

# Executar testes
npm test
```

---

## 📝 Padrões de Código

### TypeScript

#### Convenções de Nomenclatura
```typescript
// ✅ BOM
const userId = 123
const fetchUserData = async () => {}
interface UserProfile {}
type UserId = string

// ❌ RUIM
const user_id = 123
const FetchUserData = async () => {}
interface userProfile {}
type userID = string
```

#### Tipagem Forte
```typescript
// ✅ BOM - Tipos explícitos
interface Product {
  id: string
  name: string
  price: number
}

function getProduct(id: string): Promise<Product> {
  // ...
}

// ❌ RUIM - Uso de any
function getProduct(id: any): any {
  // ...
}
```

#### Evite `any`
```typescript
// ✅ BOM - Use unknown ou generics
function processData<T>(data: T): T {
  return data
}

// ❌ RUIM
function processData(data: any): any {
  return data
}
```

### React/Next.js

#### Componentes Funcionais
```tsx
// ✅ BOM - Componente funcional com tipos
interface ButtonProps {
  label: string
  onClick: () => void
  variant?: 'primary' | 'secondary'
}

export function Button({ label, onClick, variant = 'primary' }: ButtonProps) {
  return (
    <button onClick={onClick} className={cn('btn', `btn-${variant}`)}>
      {label}
    </button>
  )
}

// ❌ RUIM - Props sem tipos
export function Button({ label, onClick }) {
  return <button onClick={onClick}>{label}</button>
}
```

#### Server vs Client Components
```tsx
// ✅ BOM - Especificar claramente
'use client' // Quando necessário interatividade

import { useState } from 'react'

export function Counter() {
  const [count, setCount] = useState(0)
  return <button onClick={() => setCount(count + 1)}>{count}</button>
}

// Server Component (padrão) - sem 'use client'
export async function UserList() {
  const users = await fetchUsers()
  return <ul>{users.map(u => <li key={u.id}>{u.name}</li>)}</ul>
}
```

#### Hooks Personalizados
```typescript
// ✅ BOM - Hook reutilizável com tipos
function useAuth() {
  const { data: session, status } = useSession()

  return {
    user: session?.user,
    isLoading: status === 'loading',
    isAuthenticated: status === 'authenticated'
  }
}

// Uso
const { user, isAuthenticated } = useAuth()
```

### Estrutura de Arquivos

```
src/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Grupo de rotas de autenticação
│   ├── (dashboard)/       # Grupo de rotas privadas
│   ├── (marketing)/       # Grupo de rotas públicas
│   └── api/               # API routes
├── components/
│   ├── ui/                # Componentes base (Shadcn)
│   ├── shared/            # Componentes compartilhados
│   └── [feature]/         # Componentes por feature
├── lib/
│   ├── ai/                # Lógica de IA
│   ├── auth/              # Autenticação
│   ├── db/                # Database
│   └── utils/             # Utilitários
└── types/                 # TypeScript types globais
```

### Commits

Usamos **Conventional Commits**:

```bash
# Formato
<type>(<scope>): <description>

# Tipos
feat:     Nova funcionalidade
fix:      Correção de bug
docs:     Mudanças em documentação
style:    Formatação (não afeta código)
refactor: Refatoração de código
perf:     Melhoria de performance
test:     Adicionar/corrigir testes
chore:    Manutenção (build, CI, etc)

# Exemplos
feat(auth): Adicionar login com Google
fix(chat): Corrigir erro ao enviar mensagem
docs(readme): Atualizar instruções de instalação
refactor(api): Simplificar lógica de qualificação
perf(images): Otimizar carregamento de imagens
```

### Mensagens de Commit

```bash
# ✅ BOM - Claro e descritivo
feat(chat): Adicionar suporte a áudio no chat

Implementado gravação de áudio usando Web Audio API
- Adicionar botão de gravação
- Transcrição via Whisper API
- Fallback para texto se áudio falhar

# ❌ RUIM - Vago
fix: bug
update: changes
wip
```

---

## 🔄 Processo de Pull Request

### 1. Crie uma Branch

```bash
# Formato: tipo/descricao-curta
git checkout -b feat/google-analytics
git checkout -b fix/chat-audio-bug
git checkout -b docs/contributing-guide
```

### 2. Faça suas Alterações

- Escreva código limpo e legível
- Adicione comentários quando necessário
- Mantenha commits atômicos e bem descritos
- Teste suas alterações localmente

### 3. Teste Suas Alterações

```bash
# TypeScript
npm run typecheck

# Build
npm run build

# Testes (quando disponíveis)
npm test

# Linter
npm run lint
```

### 4. Commit com Conventional Commits

```bash
git add .
git commit -m "feat(analytics): Adicionar Google Analytics

- Configurar GA4
- Adicionar tracking de eventos
- Implementar página de consentimento de cookies"
```

### 5. Push e Abra PR

```bash
# Push para seu fork
git push origin feat/google-analytics

# Abra PR no GitHub
# Preencha o template de PR
```

### Template de Pull Request

```markdown
## Descrição
Breve descrição das mudanças

## Tipo de Mudança
- [ ] Bug fix
- [ ] Nova feature
- [ ] Breaking change
- [ ] Documentação

## Checklist
- [ ] Código segue os padrões do projeto
- [ ] Commit messages seguem Conventional Commits
- [ ] Build passa sem erros
- [ ] TypeScript sem erros
- [ ] Testes adicionados/atualizados (se aplicável)
- [ ] Documentação atualizada (se aplicável)

## Screenshots (se aplicável)
[Cole screenshots aqui]

## Testes Realizados
Descreva os testes que você executou
```

### 6. Code Review

- Responda aos comentários de forma construtiva
- Faça as alterações solicitadas
- Mantenha a discussão focada e respeitosa
- Aprenda com o feedback

### 7. Merge

Após aprovação:
- Squash commits se necessário
- Merge via GitHub (squash and merge recomendado)
- Delete a branch após merge

---

## 🐛 Reportar Bugs

### Antes de Reportar

1. Verifique se o bug já foi reportado nas [Issues](https://github.com/garcezpalha/platform/issues)
2. Tente reproduzir o bug em versão mais recente
3. Colete informações relevantes

### Template de Bug Report

```markdown
**Descrição do Bug**
Descrição clara e concisa do problema

**Passos para Reproduzir**
1. Vá para '...'
2. Clique em '...'
3. Veja o erro

**Comportamento Esperado**
O que deveria acontecer

**Screenshots**
Se aplicável, adicione screenshots

**Ambiente:**
 - OS: [ex: Windows 10]
 - Browser: [ex: Chrome 120]
 - Versão: [ex: 0.1.0]

**Informações Adicionais**
Qualquer outra informação relevante

**Logs de Erro**
```
Cole logs aqui
```
```

---

## 💡 Sugerir Melhorias

### Template de Feature Request

```markdown
**A funcionalidade está relacionada a um problema?**
Descrição clara do problema. Ex: "Estou sempre frustrado quando..."

**Solução Proposta**
Descrição clara da solução que você gostaria

**Alternativas Consideradas**
Outras soluções que você considerou

**Contexto Adicional**
Screenshots, mockups, links relevantes
```

---

## 📚 Documentação

### Onde Documentar

| Tipo | Localização |
|------|-------------|
| Código | Comentários JSDoc |
| API | `docs/API.md` |
| Features | `docs/FEATURES.md` |
| Guias | `docs/guides/` |
| Arquitetura | `docs/ARCHITECTURE.md` |

### Padrões de Documentação

#### Comentários JSDoc
```typescript
/**
 * Qualifica um lead baseado em respostas do formulário
 *
 * @param answers - Respostas do usuário
 * @param productId - ID do produto de interesse
 * @returns Promise com resultado da qualificação (score 0-100)
 *
 * @example
 * ```typescript
 * const result = await qualifyLead({
 *   hasLawsuit: true,
 *   estimatedValue: 50000
 * }, 'usucapiao')
 * ```
 */
export async function qualifyLead(
  answers: QualificationAnswers,
  productId: string
): Promise<QualificationResult> {
  // ...
}
```

#### README de Features
```markdown
# Feature: Chat com IA

## Descrição
Sistema de chat inteligente com 3 modos...

## Componentes
- `ChatAssistant` - Componente principal
- `MessageBubble` - Exibe mensagens
- `ChatInput` - Input com áudio

## Uso
\`\`\`tsx
<ChatAssistant mode="agent-flow" productId="usucapiao" />
\`\`\`

## Configuração
...
```

---

## 🔐 Segurança

### Reportar Vulnerabilidades

**NÃO abra issues públicas para vulnerabilidades de segurança.**

Envie email para: security@garcezpalha.com.br

Inclua:
- Descrição da vulnerabilidade
- Passos para reproduzir
- Impacto potencial
- Sugestões de correção (se houver)

### Boas Práticas de Segurança

```typescript
// ✅ BOM - Validação de entrada
import { z } from 'zod'

const emailSchema = z.string().email()
const validatedEmail = emailSchema.parse(userInput)

// ✅ BOM - Sanitização
import DOMPurify from 'dompurify'
const clean = DOMPurify.sanitize(dirty)

// ❌ RUIM - Usar input direto
database.query(`SELECT * FROM users WHERE email = '${userInput}'`)

// ❌ RUIM - Hardcoded secrets
const API_KEY = 'sk-proj-abc123'
```

---

## 🎯 Prioridades de Contribuição

### Alto Impacto
1. **Performance** - Otimizações que melhoram UX
2. **Bugs Críticos** - Quebram funcionalidade principal
3. **Segurança** - Vulnerabilidades
4. **Acessibilidade** - Melhorias A11Y

### Médio Impacto
1. **Novas Features** - Funcionalidades planejadas
2. **Refatoração** - Melhora qualidade do código
3. **Testes** - Aumentar cobertura
4. **Documentação** - Guias e tutoriais

### Baixo Impacto
1. **Melhorias de UI** - Polimento visual
2. **Typos** - Correções de texto
3. **Comentários** - Melhorar documentação inline

---

## 📞 Contato

- **Email:** leonardo@garcezpalha.com.br
- **Website:** https://garcezpalha.com.br
- **GitHub Issues:** https://github.com/garcezpalha/platform/issues
- **WhatsApp:** +55 21 99535-4010

---

## 🙏 Agradecimentos

Obrigado por contribuir com o projeto Garcez Palha! Toda contribuição, grande ou pequena, é valorizada e faz diferença.

**Principais Contribuidores:**
- Leonardo Mendonça Palha da Silva - Fundador & Lead Developer
- Claude Sonnet 4.5 (MANUS v7.0) - AI Development Assistant

---

## 📜 Licença

Ao contribuir, você concorda que suas contribuições serão licenciadas sob a mesma licença do projeto (ver [LICENSE](LICENSE)).

---

**Última Atualização:** 29/12/2025
**Versão:** 1.0.0
**Gerado por:** MANUS v7.0
