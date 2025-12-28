# 🚀 Auditoria Automatizada - Quickstart

## ⚡ Uso em 1 Comando

```bash
npm run audit
```

**Isso vai:**
- ✅ Testar todas as APIs (OpenAI, D-ID, etc)
- ✅ Verificar Google Analytics
- ✅ Checar erros no Sentry
- ✅ Testar páginas críticas
- ✅ Verificar database
- ✅ Gerar relatório completo

**Tempo**: ~10 segundos
**Relatório**: `docs/audit-report-TIMESTAMP.md`

---

## 📊 O que você ganha?

### Antes (Manual):
- ❌ 2 horas checando tudo manualmente
- ❌ Esquece de testar algo
- ❌ Erros só descobertos em produção
- ❌ Sem histórico de auditorias

### Agora (Automatizado):
- ✅ **10 segundos** para auditoria completa
- ✅ **15 verificações** automáticas
- ✅ **Relatório detalhado** com timestamps
- ✅ **Histórico completo** em `docs/`

---

## 🎯 Principais Verificações

| Categoria | O que testa |
|-----------|-------------|
| **APIs** | OpenAI, D-ID conectividade |
| **Analytics** | Google Analytics dados |
| **SEO** | Search Console métricas |
| **Errors** | Sentry erros críticos |
| **Visual** | 4 páginas principais |
| **Database** | Supabase conexão |
| **WhatsApp** | Status da integração |
| **Endpoints** | 4 endpoints críticos |

---

## 📈 Exemplo de Relatório

```markdown
# Relatório de Auditoria
**Data**: 28/12/2025 13:26
**Status**: ⚠️ Atenção Necessária

## Resumo
- ✅ Sucessos: 7/15 (47%)
- ⚠️ Avisos: 3/15 (20%)
- ❌ Erros: 5/15 (33%)

## Ações Recomendadas
1. ❌ D-ID API: Key inválida - atualizar
2. ⚠️ WhatsApp: Desconectado - reconectar
3. ✅ Site: Todas as páginas OK
```

---

## 🔄 Workflows Automatizados

### 1. Auditoria Antes do Deploy

```bash
# Adicione ao seu workflow
git add .
npm run audit
git commit -m "..."
git push
```

### 2. Auditoria Diária

```bash
# Cron job (8h da manhã)
0 8 * * * cd /path/to/projeto && npm run audit
```

### 3. CI/CD Integration

```yaml
# .github/workflows/audit.yml
- name: Run Audit
  run: npm run audit
```

---

## 🎓 Documentação Completa

Para uso avançado e customização:
- 📖 [Guia Completo de MCP](docs/MCP_USAGE_GUIDE.md)
- 🔧 [Script de Auditoria](scripts/audit-automation.ts)
- 📊 [Relatórios Históricos](docs/audit-report-*.md)

---

## ⚡ Comandos Úteis

```bash
# Auditoria completa
npm run audit

# Ver último relatório
cat docs/audit-report-*.md | tail -100

# Contar auditorias executadas
ls -l docs/audit-report-*.md | wc -l

# Limpar relatórios antigos (>30 dias)
find docs/ -name "audit-report-*.md" -mtime +30 -delete
```

---

## 🆘 Problemas?

### Erro: "tsx not found"

```bash
npm install -g tsx
```

### Timeout nas verificações

```bash
# Aumente o timeout no script
# scripts/audit-automation.ts linha 180
timeout: 60000 // 60 segundos
```

---

## 💡 Próximos Passos

1. **Execute a primeira auditoria**: `npm run audit`
2. **Leia o relatório** em `docs/audit-report-*.md`
3. **Corrija os erros** encontrados
4. **Agende auditorias diárias**
5. **Integre no CI/CD**

---

**Economize 2 horas por dia com auditoria automatizada!** 🚀

*Para dúvidas, veja [MCP_USAGE_GUIDE.md](docs/MCP_USAGE_GUIDE.md)*
