# Dependencies Audit - Garcez Palha

## Última Atualização
01/01/2026

## Processo de Auditoria

### 1. Auditoria Automática

```bash
# Rodar auditoria
npm audit

# Ver detalhes
npm audit --audit-level=moderate

# Fix automático (com cautela)
npm audit fix

# Fix breaking changes (cuidado!)
npm audit fix --force
```

### 2. Auditoria Manual

Verificar regularmente:
- Dependências desatualizadas
- Vulnerabilidades conhecidas
- Licenças incompatíveis
- Pacotes não utilizados

## Ferramentas

### npm-check-updates

```bash
# Instalar
npm install -g npm-check-updates

# Ver atualizações disponíveis
ncu

# Atualizar package.json (sem instalar)
ncu -u

# Instalar
npm install
```

### depcheck

```bash
# Instalar
npm install -g depcheck

# Rodar
depcheck

# Remove dependências não utilizadas
npm uninstall <package-name>
```

## Dependências Principais

### Core Framework
- `next`: ^14.x - Framework principal
- `react`: ^18.x - UI library
- `typescript`: ^5.x - Type safety

### Database & Auth
- `@supabase/supabase-js`: ^2.x - Database client
- `next-auth`: ^4.x - Authentication
- `zod`: ^3.x - Schema validation

### UI Components
- `@radix-ui/*`: Latest - Headless UI primitives
- `tailwindcss`: ^3.x - Utility-first CSS
- `lucide-react`: ^0.x - Icons

### Utils
- `date-fns`: ^3.x - Date manipulation
- `class-variance-authority`: ^0.x - Component variants
- `clsx`: ^2.x - Conditional classes
- `tailwind-merge`: ^2.x - Merge Tailwind classes

## Política de Atualizações

### Dependências de Produção

#### Críticas (Semanal)
- `next`
- `react`
- `@supabase/supabase-js`
- `next-auth`

Atualizar semanalmente para patches de segurança.

#### Importantes (Mensal)
- UI libraries (`@radix-ui/*`)
- Utilities (`date-fns`, `zod`)
- TypeScript

Atualizar mensalmente, testar em staging.

#### Outras (Trimestral)
- Demais dependências
- Dev dependencies

Atualizar trimestralmente, após testes completos.

### Dev Dependencies

Atualizar com menos urgência, mas manter razoavelmente atualizadas.

## Checklist de Atualização

Antes de atualizar qualquer dependência:

- [ ] Ler CHANGELOG da nova versão
- [ ] Verificar breaking changes
- [ ] Testar em ambiente local
- [ ] Rodar testes automatizados
- [ ] Testar principais fluxos manualmente
- [ ] Deploy em staging
- [ ] Monitorar por 24h em staging
- [ ] Deploy em produção
- [ ] Monitorar erros (Sentry/logs)

## Vulnerabilidades Conhecidas

### Processo de Resolução

1. **Avaliar Severidade**
   - Critical/High: Resolver imediatamente
   - Moderate: Resolver em 1 semana
   - Low: Resolver no próximo sprint

2. **Verificar Fix Disponível**
   ```bash
   npm audit fix
   ```

3. **Se não houver fix:**
   - Verificar se a vulnerabilidade afeta o código
   - Considerar alternativa
   - Documentar decisão de não atualizar

4. **Documentar**
   - Adicionar ao arquivo SECURITY.md
   - Criar issue no GitHub
   - Notificar time

## Licenças

### Licenças Permitidas
- MIT
- Apache 2.0
- BSD
- ISC

### Licenças a Evitar
- GPL (copyleft pode afetar licenciamento)
- Proprietárias sem clareza de uso

### Verificar Licenças

```bash
# Instalar license-checker
npm install -g license-checker

# Listar licenças
license-checker --summary

# Verificar licenças problemáticas
license-checker --onlyAllow 'MIT;Apache-2.0;BSD;ISC'
```

## Pacotes Deprecados

Substituir se encontrados:

- ❌ `moment` → ✅ `date-fns`
- ❌ `request` → ✅ `fetch` ou `axios`
- ❌ `@types/node` antigos → ✅ Versão compatível com Node LTS

## Monitoramento Contínuo

### GitHub Dependabot

Configurar `.github/dependabot.yml`:

```yaml
version: 2
updates:
  - package-ecosystem: "npm"
    directory: "/"
    schedule:
      interval: "weekly"
    open-pull-requests-limit: 10
    labels:
      - "dependencies"
    reviewers:
      - "tech-lead"
```

### Snyk

```bash
# Instalar
npm install -g snyk

# Autenticar
snyk auth

# Testar
snyk test

# Monitorar
snyk monitor
```

### npm outdated

```bash
# Ver dependências desatualizadas
npm outdated

# Formato JSON
npm outdated --json
```

## Ações Regulares

### Semanal
- [ ] `npm audit`
- [ ] Revisar PRs do Dependabot
- [ ] Atualizar dependências críticas

### Mensal
- [ ] `npm outdated`
- [ ] `depcheck` (remover não utilizadas)
- [ ] Atualizar dependências importantes

### Trimestral
- [ ] Auditoria completa de licenças
- [ ] Major version upgrades (se disponível)
- [ ] Review de dependências alternativas
- [ ] Limpeza de dev dependencies

## Tamanho do node_modules

### Objetivos
- Produção: < 100 MB
- Total (com dev): < 500 MB

### Reduzir Tamanho

```bash
# Ver tamanho por pacote
npm list --depth=0

# Usar pnpm (mais eficiente que npm)
npm install -g pnpm
pnpm install

# Limpar cache
npm cache clean --force
```

## Dependências Atuais (Principais)

```json
{
  "dependencies": {
    "next": "^14.0.4",
    "react": "^18.2.0",
    "@supabase/supabase-js": "^2.38.4",
    "next-auth": "^4.24.5",
    "tailwindcss": "^3.3.6",
    "zod": "^3.22.4",
    "date-fns": "^3.0.0",
    "lucide-react": "^0.294.0"
  }
}
```

## Status Atual

✅ Todas dependências atualizadas (Jan 2026)
✅ Zero vulnerabilidades críticas
✅ Licenças compatíveis
⚠️ 2 dependências com updates minor disponíveis (não urgente)

## Próximas Ações

1. Configurar Dependabot (se ainda não configurado)
2. Implementar CI check para `npm audit`
3. Documentar processo de atualização no README
4. Treinar time sobre política de atualizações

## Recursos

- [npm audit docs](https://docs.npmjs.com/cli/v9/commands/npm-audit)
- [Snyk](https://snyk.io/)
- [Dependabot](https://docs.github.com/en/code-security/dependabot)
- [npm-check-updates](https://github.com/raineorshine/npm-check-updates)
