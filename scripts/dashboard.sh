#!/bin/bash
# dashboard.sh
# Dashboard de progresso MANUS v6.0
# Garcez Palha - Score 78 → 100

clear
echo "╔════════════════════════════════════════════════════════════╗"
echo "║      MANUS v6.0 - Garcez Palha Progress Dashboard         ║"
echo "║          Multi-Agent Network for Unified Systems           ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

# Data/hora
echo "📅 $(date '+%d/%m/%Y %H:%M:%S')"
echo ""

# Fase atual
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📍 FASE ATUAL: 1 - EMERGÊNCIA OAB (Dias 1-7)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Score estimado (placeholder - será calculado dinamicamente)
echo "🎯 SCORE"
echo "   Baseline:  78/100 (BOM)"
echo "   Atual:     [Calculando...]"
echo "   Meta:      100/100 (PERFEITO)"
echo ""

# OAB Compliance (crítico!)
echo "⚖️  OAB COMPLIANCE (CRÍTICO)"
if [ -f "scripts/OAB_compliance_check.sh" ]; then
  OAB_COUNT=$(bash scripts/OAB_compliance_check.sh 2>&1 | grep -c "VIOLAÇÃO" || echo "0")
  if [ "$OAB_COUNT" == "0" ]; then
    echo "   Status: ✅ ZERO VIOLAÇÕES"
  else
    echo "   Status: ❌ $OAB_COUNT VIOLAÇÕES DETECTADAS"
    echo "   Ação:  URGENTE - Corrigir antes de continuar"
  fi
else
  echo "   Status: ⏳ Script de validação pendente"
fi
echo ""

# Prioridades P0/P1/P2
echo "📊 PRIORIDADES"
if [ -f ".manus/GAPS_E_INCONSISTENCIAS.md" ]; then
  P0_TOTAL=$(grep -c "^\*\*GAP-.*P0" .manus/GAPS_E_INCONSISTENCIAS.md 2>/dev/null || echo "15")
  P1_TOTAL=$(grep -c "^\*\*GAP-.*P1" .manus/GAPS_E_INCONSISTENCIAS.md 2>/dev/null || echo "23")
  P2_TOTAL=$(grep -c "^\*\*GAP-.*P2" .manus/GAPS_E_INCONSISTENCIAS.md 2>/dev/null || echo "41")

  echo "   P0 (Bloqueadores):  [0/$P0_TOTAL] ⏳ Em andamento"
  echo "   P1 (Alta):          [0/$P1_TOTAL] ⏸️  Pendente"
  echo "   P2 (Melhoria):      [0/$P2_TOTAL] ⏸️  Pendente"
else
  echo "   ⏳ Aguardando auditoria completa"
fi
echo ""

# Documentos
echo "📄 DOCUMENTOS"
TOTAL_DOCS=$(find docs -name "*.md" 2>/dev/null | wc -l)
echo "   Existentes:  $TOTAL_DOCS/62"
echo "   Meta:        62 (52 existentes + 10 novos)"
echo ""

# Agents rodando
echo "🤖 AGENTS ATIVOS"
AGENTS_RUNNING=0

# Verificar agents em background (buscar processos claude)
if command -v pgrep &> /dev/null; then
  AGENTS_RUNNING=$(pgrep -f "claude.*agent" 2>/dev/null | wc -l)
fi

if [ "$AGENTS_RUNNING" -gt 0 ]; then
  echo "   Status: 🏃 $AGENTS_RUNNING agent(s) rodando"
  echo "   Ação:  Aguardar conclusão"
else
  echo "   Status: ⏸️  Nenhum agent rodando"
  echo "   Ação:  Lançar agents para correções"
fi
echo ""

# Arquivos criados recentemente
echo "📝 ÚLTIMAS ATUALIZAÇÕES"
if [ -d ".manus" ]; then
  RECENT_FILES=$(find .manus business docs -name "*.md" -mmin -60 2>/dev/null | sort -r | head -5)
  if [ -n "$RECENT_FILES" ]; then
    echo "$RECENT_FILES" | while read file; do
      MTIME=$(stat -c %y "$file" 2>/dev/null | cut -d. -f1 || stat -f "%Sm" -t "%Y-%m-%d %H:%M:%S" "$file" 2>/dev/null)
      echo "   📄 $file"
      echo "      ⏰ $MTIME"
    done
  else
    echo "   ℹ️  Nenhuma atualização na última hora"
  fi
else
  echo "   ⏳ Diretório .manus ainda não criado"
fi
echo ""

# Próxima ação recomendada
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "⏭️  PRÓXIMA AÇÃO"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if [ "$OAB_COUNT" != "0" ] && [ "$OAB_COUNT" != "" ]; then
  echo "   🔴 URGENTE: Corrigir $OAB_COUNT violações OAB"
  echo "   📋 Ver: .manus/PLANO_EXECUCAO_100_PERCENT.md (TASK-003 a TASK-006)"
elif [ "$AGENTS_RUNNING" -gt 0 ]; then
  echo "   ⏳ Aguardar conclusão dos agents em andamento"
  echo "   📊 Monitorar progresso: tail -f .manus/*.log"
else
  echo "   ▶️  Validar outputs dos agents concluídos"
  echo "   📋 Executar: scripts/validate_phase1.sh"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📚 Documentação MANUS:"
echo "   • .manus/AUDITORIA_COMPLETA_MANUS.md      (Auditoria inicial)"
echo "   • .manus/GAPS_E_INCONSISTENCIAS.md        (65 problemas)"
echo "   • .manus/ROADMAP_100_PERCENT.md           (Roadmap 30 dias)"
echo "   • .manus/PLANO_EXECUCAO_100_PERCENT.md    (Tasks detalhadas)"
echo ""
echo "🔄 Atualizar dashboard: bash scripts/dashboard.sh"
echo ""
