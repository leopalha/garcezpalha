# ESTRATEGIA DE TESTES

Este documento descreve a estrategia de testes para a plataforma Garcez Palha.

---

## STATUS ATUAL

**Testes Automatizados**: NAO IMPLEMENTADOS
**Tipo de Testes**: Manual
**Cobertura**: 0%

---

## ESTRATEGIA RECOMENDADA

### 1. TESTES UNITARIOS (Jest)

#### 1.1 Agentes IA

```typescript
// tests/agents/orchestrator.test.ts
describe('AgentOrchestrator', () => {
  describe('selectAgent', () => {
    it('should route real estate queries to RealEstateAgent', () => {
      const orchestrator = new AgentOrchestrator()
      const result = orchestrator.suggestAgent('Quero comprar um apartamento')
      expect(result.role).toBe('real-estate')
      expect(result.confidence).toBeGreaterThan(0.5)
    })

    it('should route criminal queries to CriminalAgent', () => {
      const orchestrator = new AgentOrchestrator()
      const result = orchestrator.suggestAgent('Fui preso em flagrante')
      expect(result.role).toBe('criminal')
    })

    it('should fallback to general for unknown queries', () => {
      const orchestrator = new AgentOrchestrator()
      const result = orchestrator.suggestAgent('Ola')
      expect(result.role).toBe('general')
    })
  })
})
```

#### 1.2 Utilitarios

```typescript
// tests/lib/rate-limit.test.ts
describe('Rate Limiter', () => {
  it('should allow requests under limit', async () => {
    // ...
  })

  it('should block requests over limit', async () => {
    // ...
  })
})
```

### 2. TESTES DE INTEGRACAO

#### 2.1 API Routes

```typescript
// tests/api/chat.test.ts
describe('POST /api/chat', () => {
  it('should return demo response when AI not configured', async () => {
    const response = await fetch('/api/chat', {
      method: 'POST',
      body: JSON.stringify({ message: 'Ola' })
    })
    const data = await response.json()
    expect(data.mode).toBe('demo')
  })

  it('should route to correct agent when AI configured', async () => {
    // Mock OpenAI
    // ...
  })
})
```

#### 2.2 tRPC Routers

```typescript
// tests/trpc/chat.test.ts
describe('chat router', () => {
  describe('createConversation', () => {
    it('should create conversation in database', async () => {
      // ...
    })
  })

  describe('sendMessageWithAgents', () => {
    it('should use orchestrator for routing', async () => {
      // ...
    })
  })
})
```

### 3. TESTES E2E (Cypress/Playwright)

#### 3.1 Fluxo de Chat

```typescript
// cypress/e2e/chat.cy.ts
describe('Chatbot Flow', () => {
  it('should open chat widget', () => {
    cy.visit('/')
    cy.get('[data-testid="chat-widget"]').click()
    cy.get('[data-testid="chat-input"]').should('be.visible')
  })

  it('should send message and receive response', () => {
    cy.get('[data-testid="chat-input"]').type('Preciso comprar um imovel')
    cy.get('[data-testid="send-button"]').click()
    cy.get('[data-testid="assistant-message"]').should('exist')
  })
})
```

#### 3.2 Fluxo de Checkout

```typescript
// cypress/e2e/checkout.cy.ts
describe('Checkout Flow', () => {
  it('should complete checkout with Stripe', () => {
    cy.visit('/checkout')
    cy.get('[data-testid="service-consultoria-imobiliaria"]').click()
    cy.get('[data-testid="next-step"]').click()
    // Fill form
    cy.get('input[name="name"]').type('Test User')
    cy.get('input[name="email"]').type('test@example.com')
    // ...
    cy.get('[data-testid="pay-button"]').click()
    // Mock Stripe
    cy.url().should('include', '/checkout/success')
  })
})
```

#### 3.3 Fluxo de Autenticacao

```typescript
// cypress/e2e/auth.cy.ts
describe('Authentication Flow', () => {
  it('should login with valid credentials', () => {
    cy.visit('/login')
    cy.get('input[name="email"]').type('admin@garcezpalha.com')
    cy.get('input[name="password"]').type('demo123')
    cy.get('button[type="submit"]').click()
    cy.url().should('include', '/admin')
  })

  it('should protect dashboard routes', () => {
    cy.visit('/dashboard')
    cy.url().should('include', '/login')
  })
})
```

---

## CONFIGURACAO

### Jest Setup

```javascript
// jest.config.js
module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/tests/setup.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
  ],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70,
    },
  },
}
```

### Cypress Setup

```javascript
// cypress.config.ts
import { defineConfig } from 'cypress'

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
    supportFile: 'cypress/support/e2e.ts',
  },
})
```

---

## TESTES MANUAIS

### Checklist de Teste Manual

#### Chat/Agentes
- [ ] Chat widget abre corretamente
- [ ] Mensagem e enviada e resposta recebida
- [ ] Agente correto e selecionado (verificar logs)
- [ ] Disclaimer OAB presente na resposta
- [ ] Rate limiting funciona (>20 msg/min)
- [ ] Modo demo funciona sem API key

#### Checkout
- [ ] Selecao de servico funciona
- [ ] Formulario valida campos
- [ ] Mascara de telefone funciona
- [ ] Mascara de CPF/CNPJ funciona
- [ ] Stripe redirect funciona
- [ ] Webhook atualiza banco

#### Autenticacao
- [ ] Login com credenciais validas
- [ ] Login com credenciais invalidas (erro)
- [ ] Rotas protegidas redirecionam
- [ ] Logout funciona
- [ ] Sessao persiste (refresh)

#### Dashboard
- [ ] Metricas carregam
- [ ] Lista de processos carrega
- [ ] Filtros funcionam
- [ ] Paginacao funciona

---

## METRICAS DE QUALIDADE

### Metas de Cobertura

| Area | Meta | Prioridade |
|------|------|------------|
| Agentes IA | 90% | Alta |
| API Routes | 80% | Alta |
| tRPC Routers | 80% | Alta |
| Components UI | 60% | Media |
| Utilitarios | 90% | Alta |

### KPIs de Teste

- Tempo de execucao dos testes < 5min
- Zero testes flakey
- Todos os testes passam no CI

---

## CI/CD PIPELINE

```yaml
# .github/workflows/test.yml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: '20'

      - name: Install dependencies
        run: npm ci

      - name: Type check
        run: npm run typecheck

      - name: Unit tests
        run: npm run test

      - name: E2E tests
        run: npm run test:e2e

      - name: Upload coverage
        uses: codecov/codecov-action@v3
```

---

## PROXIMOS PASSOS

1. **Semana 1**: Configurar Jest + setup basico
2. **Semana 2**: Testes unitarios para agentes IA
3. **Semana 3**: Testes de integracao para API
4. **Semana 4**: Configurar Cypress + testes E2E
5. **Semana 5**: CI/CD pipeline + cobertura

---

## FERRAMENTAS RECOMENDADAS

- **Jest**: Testes unitarios
- **Cypress**: Testes E2E
- **MSW**: Mock de APIs
- **Testing Library**: Testes de React
- **Codecov**: Cobertura de codigo
- **GitHub Actions**: CI/CD
