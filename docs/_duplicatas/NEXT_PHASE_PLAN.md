# PLANO DA PROXIMA FASE - REFATORACAO E MELHORIAS

**Data**: 2024-12-23
**Status**: AGUARDANDO APROVACAO
**Referencia**: AUDIT_REPORT.md

---

## 1. RESUMO

Este documento define o plano para a proxima fase de trabalho, focando em:
1. Corrigir problemas identificados na auditoria
2. Refatorar nomenclatura incorreta ("G4")
3. Executar migrations pendentes
4. Preparar para producao

---

## 2. FASE 9: REFATORACAO (PRIORIDADE CRITICA)

### 2.1 Tarefa: Renomear Pasta e Componentes G4

**Objetivo**: Remover todas as referencias a "G4" do codigo

**Arquivos Afetados**: 13 componentes + 20+ paginas

**Mapeamento de Renomeacao**:

| Arquivo Atual | Novo Nome |
|---------------|-----------|
| `src/components/g4/` | `src/components/marketing/` |
| `HeroG4.tsx` | `HeroSection.tsx` |
| `ProductsG4.tsx` | `ProductsCatalog.tsx` |
| `HowItWorksG4.tsx` | `HowItWorks.tsx` |
| `WhyUsG4.tsx` | `WhyChooseUs.tsx` |
| `CredentialsG4.tsx` | `Credentials.tsx` |
| `TestimonialsG4.tsx` | `Testimonials.tsx` |
| `FAQG4.tsx` | `FAQ.tsx` |
| `FinalCTAG4.tsx` | `FinalCTA.tsx` |
| `WhatsAppFloatG4.tsx` | `WhatsAppFloat.tsx` |
| `ServicesG4.tsx` | `Services.tsx` |
| `templates/ProductPageG4.tsx` | `templates/ProductPageTemplate.tsx` |

**Passos**:
1. [ ] Renomear pasta `g4` para `marketing`
2. [ ] Renomear cada arquivo de componente
3. [ ] Atualizar exports em `index.ts`
4. [ ] Atualizar imports em todas as paginas que usam
5. [ ] Remover comentarios que mencionam "G4 Model/System"
6. [ ] Atualizar/remover propriedade `isG4` em checkout.ts
7. [ ] Verificar build apos mudancas

**Paginas que Precisam de Update**:
- `src/app/(marketing)/page.tsx`
- `src/app/(marketing)/financeiro/desbloqueio-conta/page.tsx`
- `src/app/(marketing)/patrimonial/*.tsx` (6 arquivos)
- `src/app/(marketing)/saude/*.tsx` (5 arquivos)
- `src/app/(marketing)/pericia/*.tsx` (3 arquivos)
- `src/app/(marketing)/criminal/*.tsx` (2 arquivos)
- `src/app/(marketing)/automacao/*.tsx` (2 arquivos)

### 2.2 Tarefa: Executar Migrations

**Migrations Pendentes**:
1. `supabase/migrations/016_leads_qualification_system.sql`
2. `supabase/migrations/017_generated_documents.sql`

**Passos**:
1. [ ] Conectar ao Supabase Dashboard
2. [ ] Executar migration 016
3. [ ] Verificar tabelas criadas (6 tabelas)
4. [ ] Verificar RLS policies aplicadas
5. [ ] Executar migration 017
6. [ ] Verificar tabelas criadas (4 tabelas)
7. [ ] Testar endpoints que dependem dessas tabelas

### 2.3 Tarefa: Limpar Comentarios

**Arquivos com Comentarios a Remover**:
- `src/app/(marketing)/page.tsx` - "G4 Components", "Modelo G4"
- `src/app/api/whatsapp-cloud/webhook/route.ts` - "G4 Lead Qualification System"
- `src/components/g4/ProductsG4.tsx` - "Catalogo Unificado G4"
- `src/types/checkout.ts` - "SOLUCOES G4"

---

## 3. FASE 10: TESTES E VALIDACAO

### 3.1 Testes Manuais

**Fluxos a Testar**:
1. [ ] Chatbot: Enviar mensagem e receber resposta
2. [ ] Qualificacao: Completar fluxo de perguntas
3. [ ] Dashboard Admin: Verificar metricas
4. [ ] Geracao de Documento: Criar e exportar DOCX
5. [ ] Fila de Revisao: Aprovar/rejeitar documento
6. [ ] Checkout: Iniciar pagamento

### 3.2 Testes de Integracao

**APIs a Testar**:
- [ ] `POST /api/chat` - Mensagem ao chatbot
- [ ] `POST /api/chat/qualify` - Iniciar qualificacao
- [ ] `GET /api/admin/leads/stats` - Estatisticas
- [ ] `POST /api/documents/generate` - Gerar documento
- [ ] `GET /api/documents/export` - Exportar DOCX

---

## 4. FASE 11: MELHORIAS FUTURAS (OPCIONAL)

### 4.1 Relatorios Automaticos
- Diario: 8h via Telegram
- Semanal: Segunda via Email
- Mensal: Dia 1 via Email

### 4.2 Alertas de Metricas
- Taxa conversao < 15%
- CAC > R$ 200
- Prazo vencendo em 24h
- Lead sem resposta 4h

### 4.3 WebSockets Real-Time
- Dashboard com atualizacao automatica
- Notificacoes push
- Status de processamento

### 4.4 Integracao Judit.io
- Monitoramento automatico de processos
- Ativar quando >50 processos ativos

---

## 5. CRITERIOS DE SUCESSO

### Fase 9 Completa Quando:
- [ ] Nenhum arquivo com "G4" no nome
- [ ] Nenhum comentario menciona "G4"
- [ ] Build de producao OK
- [ ] Migrations executadas no Supabase

### Fase 10 Completa Quando:
- [ ] Todos os fluxos testados manualmente
- [ ] Todas as APIs respondendo corretamente
- [ ] Dashboard admin funcional

---

## 6. ESTIMATIVA DE ESFORCO

| Tarefa | Complexidade | Tempo Estimado |
|--------|--------------|----------------|
| Renomear componentes | Media | 1-2 horas |
| Atualizar imports | Alta | 1-2 horas |
| Executar migrations | Baixa | 15 minutos |
| Testes manuais | Media | 1 hora |
| Total | | 3-5 horas |

---

## 7. RISCOS

| Risco | Mitigacao |
|-------|-----------|
| Quebrar imports | Verificar build apos cada mudanca |
| Migration falhar | Testar em ambiente local primeiro |
| Testes descobrirem bugs | Corrigir antes de prosseguir |

---

## 8. DECISAO NECESSARIA

**Pergunta para o Usuario**:

Deseja que eu execute a Fase 9 (Refatoracao) agora?

**Opcoes**:
1. **Sim, executar agora** - Vou renomear todos os componentes e atualizar imports
2. **Apenas migrations** - Vou apenas executar as migrations no Supabase
3. **Nao, apenas documentar** - Manter o plano documentado para execucao futura
4. **Outra prioridade** - Especificar o que deve ser feito

---

## CHANGELOG

| Data | Mudanca |
|------|---------|
| 2024-12-23 | Criacao do plano |
