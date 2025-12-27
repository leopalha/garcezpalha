# 📊 Guia de Monitoramento e Validação

**Sistema de Qualificação de Leads - Garcez Palha**

Este guia explica como usar todas as ferramentas de monitoramento e validação do sistema.

---

## 🎯 Quick Start

### Verificação Completa (Recomendado)

```bash
npm run check:all
```

Executa sequencialmente:
1. Deployment check (7 validações)
2. Health check (5 validações)
3. Integrity check (31 validações)

**Tempo total**: ~10 segundos
**Score esperado**: 100% em todas

---

## 🛠️ Ferramentas Disponíveis

### 1. Deployment Check (Pré-Deploy)

**Quando usar**: Antes de fazer qualquer deploy para produção

```bash
# Via npm
npm run check:deploy

# Direto
node deployment-check.js
```

**O que verifica**:
- ✅ Git working tree limpo
- ✅ TypeScript sem erros
- ✅ Testes passando (42 testes)
- ✅ Environment variables configuradas
- ✅ Migrations presentes
- ✅ Vercel config válida
- ✅ Package scripts definidos

**Score esperado**: 7/7 (100%)

**Ação se falhar**: Não fazer deploy até corrigir

---

### 2. Health Check (Produção)

**Quando usar**: Após deploy ou diariamente para monitorar

```bash
# Via npm
npm run check:health

# Direto
node health-check.js
```

**O que verifica**:
- ✅ Site acessível (HTTP 200-499)
- ✅ Database conectado
- ✅ Tabelas existem (qualified_leads, follow_up_tasks)
- ✅ APIs protegidas (401)
- ✅ Cron jobs configurados

**Score esperado**: 5/5 (100%)

**Ação se falhar**: Investigar logs do Vercel

---

### 3. Database Verification

**Quando usar**: Após aplicar migrations ou para verificar dados

```bash
# Via npm
npm run check:db

# Direto
node verify-database.js
```

**O que verifica**:
- ✅ Conexão Supabase
- ✅ Tabela qualified_leads acessível
- ✅ Tabela follow_up_tasks acessível
- ✅ Contagem de registros
- ✅ Últimos 5 leads (se houver)

**Output esperado**:
```
✅ qualified_leads - exists
✅ follow_up_tasks - exists
Total qualified leads: N
Total follow-up tasks: N
```

---

### 4. API Testing

**Quando usar**: Após deploy para validar endpoints

```bash
# Via npm
npm run check:apis

# Direto
node test-production-apis.js
```

**O que testa**:
- / (homepage)
- /api/health
- /api/admin/leads/qualified
- /api/admin/analytics/leads
- /api/admin/follow-ups/process
- /blog

**Resultado esperado**: 5-6/6 testes passando
- Todas APIs admin devem retornar 401 (protegidas)
- Homepage pode ser 200 ou 401 (dependendo de auth)

---

### 5. Integrity Check

**Quando usar**: Semanalmente ou após mudanças significativas

```bash
# Via npm
npm run check:integrity

# Direto
node integrity-check.js
```

**O que verifica** (31 checks):
- ✅ 9 arquivos críticos
- ✅ Migrations (sem duplicatas)
- ✅ TypeScript config (strict mode)
- ✅ Dependencies principais
- ✅ Vercel cron limits
- ✅ 5 documentos principais
- ✅ 4 scripts de monitoramento

**Score esperado**: 30-31/31 (97-100%)

---

## 📅 Rotina de Monitoramento Recomendada

### Diário (Segunda a Sexta)

**Manhã (9h)**:
```bash
npm run check:health
```
Verificar se sistema está operacional.

**Tarde (14h)**:
```bash
npm run check:db
```
Conferir quantidade de leads do dia.

### Antes de Cada Deploy

```bash
npm run check:deploy
```
Garantir que está tudo OK antes de publicar.

### Após Cada Deploy

```bash
npm run check:health
npm run check:apis
```
Validar que deploy funcionou corretamente.

### Semanal (Segunda-feira)

```bash
npm run check:all
```
Validação completa do sistema.

### Mensal

```bash
npm run check:integrity
npm test
npm run typecheck
```
Verificação completa de integridade e testes.

---

## 🚨 Troubleshooting

### Deployment Check Falhando

**Problema**: Git working tree not clean
**Solução**:
```bash
git status
git add .
git commit -m "fix: your changes"
```

**Problema**: TypeScript errors
**Solução**:
```bash
npx tsc --noEmit
# Corrigir erros mostrados
```

**Problema**: Tests failing
**Solução**:
```bash
npm test
# Ver qual teste falhou e corrigir
```

---

### Health Check Falhando

**Problema**: Site não acessível
**Solução**:
```bash
# Ver status no Vercel
vercel ls

# Ver logs
vercel logs --follow
```

**Problema**: Database não conecta
**Solução**:
- Verificar env vars no Vercel Dashboard
- Testar conexão: `npm run check:db`
- Verificar Supabase Dashboard

**Problema**: APIs não protegidas
**Solução**:
- Verificar configuração NextAuth
- Checar middleware.ts
- Revisar route handlers

---

### Database Verification Falhando

**Problema**: Tabelas não existem
**Solução**:
```bash
# Aplicar migrations manualmente
# Ver APPLY_MIGRATIONS_GUIDE.md
```

**Problema**: Erro de conexão
**Solução**:
- Verificar SUPABASE_SERVICE_ROLE_KEY em .env.local
- Verificar URL do Supabase
- Testar no Supabase Dashboard

---

### API Testing Falhando

**Problema**: Endpoints retornam 500
**Solução**:
```bash
# Ver logs detalhados
vercel logs --filter=error --follow
```

**Problema**: Todas retornam 401 (até homepage)
**Solução**: Verificar se autenticação está muito restritiva

**Problema**: APIs não retornam 401 (sem proteção)
**Solução**: Adicionar autenticação nas route handlers

---

## 📊 Interpretando os Resultados

### Score 100%
✅ **Perfeito!** Sistema em ótimo estado.
- Continuar monitorando
- Manter rotina de checks

### Score 90-99%
⚠️ **Bom, mas atenção aos warnings**
- Revisar warnings
- Planejar correções
- Não urgente

### Score 70-89%
⚠️ **Atenção necessária**
- Corrigir issues identificados
- Revisar todos os warnings
- Planejar refatoração se necessário

### Score < 70%
❌ **Ação imediata necessária**
- Parar novos deploys
- Corrigir todos os issues
- Fazer audit completo

---

## 💡 Dicas e Boas Práticas

### 1. Automatize

Adicione ao CI/CD:
```yaml
# .github/workflows/validate.yml
- name: Run checks
  run: npm run check:all
```

### 2. Monitore Tendências

Mantenha log dos scores:
```bash
echo "$(date): $(npm run check:health 2>&1 | grep Score)" >> health-log.txt
```

### 3. Alerts

Configure alertas para falhas:
```bash
# Se health check falhar, enviar notificação
npm run check:health || curl -X POST webhook-url
```

### 4. Dashboard

Considere criar dashboard visual:
- Uptime Robot para monitorar URL
- Supabase para queries de analytics
- Vercel Analytics para performance

---

## 🔗 Links Relacionados

### Documentação
- [EXECUTIVE_SUMMARY.md](EXECUTIVE_SUMMARY.md) - Visão geral completa
- [README_VALIDATION.md](README_VALIDATION.md) - Guia rápido
- [FINAL_REPORT.md](FINAL_REPORT.md) - Relatório detalhado
- [PRODUCTION_VALIDATION.md](PRODUCTION_VALIDATION.md) - Checklist produção

### Dashboards
- [Vercel](https://vercel.com/leopalhas-projects/garcezpalha)
- [Supabase](https://supabase.com/dashboard/project/cpcnzkttcwodvfqyhkou)
- Site: https://garcezpalha-6yfwp8kna-leopalhas-projects.vercel.app

### Comandos Úteis
```bash
# Ver deployments
vercel ls

# Logs em tempo real
vercel logs --follow

# Inspecionar deployment
vercel inspect URL

# Rollback se necessário
vercel rollback
```

---

## 📞 Suporte

Se encontrar problemas não documentados:

1. Verificar logs: `vercel logs --follow`
2. Verificar Vercel Dashboard
3. Verificar Supabase Dashboard
4. Consultar documentação completa
5. Revisar código das ferramentas

---

**Última atualização**: 23/12/2024 23:00 BRT
**Versão**: 1.0.0
**Status**: ✅ Todas as ferramentas operacionais
