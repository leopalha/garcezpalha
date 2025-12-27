#!/bin/bash
# OAB_compliance_check.sh
# Valida documentação contra violações OAB (Resolução 02/2015)
# MANUS v6.0 - Garcez Palha

set -e

echo "🔍 MANUS v6.0 - OAB Compliance Check"
echo "======================================"
echo ""

# Frases proibidas pela OAB (Resolução 02/2015)
FORBIDDEN_PATTERNS=(
  "resolução em [0-9]+ (horas|dias|semanas|meses)"
  "resolvemos em [0-9]+"
  "garantia de resultado"
  "garantimos (o|a|que)"
  "100% de (aprovação|sucesso|vitória|recuperação)"
  "cem por cento"
  "recuperação garantida"
  "sucesso (garantido|assegurado|comprovado|certo)"
  "vitória garantida"
  "sempre ganhamos"
  "nunca perdemos"
  "número (1|um|one)"
  "o melhor escritório"
  "os melhores advogados"
  "campeão em"
  "campeões em"
  "sem risco"
  "risco zero"
  "processo sem custo"
  "grátis até ganhar"
  "só paga se ganhar"
  "aprovação em [0-9]+ dias"
  "aposentadoria em [0-9]+ dias"
  "resultado comprovado"
  "taxa de (100|cem)%"
)

EXIT_CODE=0
VIOLATIONS=0
FILES_WITH_ISSUES=0
TOTAL_FILES=0

# Determinar quais arquivos checar
if [ $# -eq 0 ]; then
  # Sem argumentos: checar todos os .md em docs/
  FILES_TO_CHECK=$(find docs/ -name "*.md" 2>/dev/null)
else
  # Com argumentos: checar arquivos específicos
  FILES_TO_CHECK="$@"
fi

# Checar cada arquivo
for file in $FILES_TO_CHECK; do
  if [ ! -f "$file" ]; then
    echo "⚠️  Arquivo não encontrado: $file"
    continue
  fi

  ((TOTAL_FILES++))
  FILE_HAS_ISSUES=false

  echo "📄 Analisando: $file"

  for pattern in "${FORBIDDEN_PATTERNS[@]}"; do
    if grep -qniE "$pattern" "$file" 2>/dev/null; then
      if [ "$FILE_HAS_ISSUES" = false ]; then
        ((FILES_WITH_ISSUES++))
        FILE_HAS_ISSUES=true
      fi

      echo "  ❌ VIOLAÇÃO: \"$pattern\""

      # Mostrar contexto (3 linhas ao redor)
      grep -niE --color=always -A 1 -B 1 "$pattern" "$file" 2>/dev/null | head -9 | sed 's/^/     /'
      echo ""

      EXIT_CODE=1
      ((VIOLATIONS++))
    fi
  done

  if [ "$FILE_HAS_ISSUES" = false ]; then
    echo "  ✅ Sem violações OAB"
  fi

  echo ""
done

# Resumo final
echo "======================================"
echo ""

if [ $EXIT_CODE -eq 0 ]; then
  echo "✅ COMPLIANCE OAB: 100% APROVADO"
  echo ""
  echo "   📊 Estatísticas:"
  echo "   - Arquivos analisados: $TOTAL_FILES"
  echo "   - Violações detectadas: 0"
  echo "   - Arquivos com problemas: 0"
  echo ""
  echo "   🎉 Todos os documentos estão em conformidade com a Resolução OAB 02/2015"
else
  echo "❌ COMPLIANCE OAB: REPROVADO"
  echo ""
  echo "   📊 Estatísticas:"
  echo "   - Arquivos analisados: $TOTAL_FILES"
  echo "   - Violações detectadas: $VIOLATIONS"
  echo "   - Arquivos com problemas: $FILES_WITH_ISSUES"
  echo ""
  echo "   📋 Próximos passos:"
  echo "   1. Revisar todas as violações acima"
  echo "   2. Consultar business/OAB_COMPLIANCE_GUIDE.md para alternativas"
  echo "   3. Substituir frases proibidas por alternativas permitidas"
  echo "   4. Re-executar este script até passar 100%"
  echo ""
  echo "   ⚖️  Base legal: Resolução OAB 02/2015"
  echo "   📖 Código de Ética e Disciplina da OAB"
fi

echo ""
echo "======================================"

exit $EXIT_CODE
