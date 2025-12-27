#!/bin/bash
# validate_consistency.sh
# Valida consistência cross-document
# MANUS v6.0 - Garcez Palha

set -e

echo "🔍 MANUS v6.0 - Consistency Validation"
echo "======================================="
echo ""

EXIT_CODE=0
ISSUES=0

# Verificar se DADOS_MESTRES.md existe
if [ ! -f "business/DADOS_MESTRES.md" ]; then
  echo "⚠️  AVISO: business/DADOS_MESTRES.md não encontrado"
  echo "   Não é possível validar contra fonte única de verdade"
  echo ""
fi

# Test 1: Anos de tradição (deve ser 364, não 360)
echo "Test 1: Anos de Tradição..."
WRONG_YEARS=$(grep -rni "360 anos\|três séculos e meio" docs/ 2>/dev/null | grep -v "364 anos" || true)
if [ -n "$WRONG_YEARS" ]; then
  echo "  ❌ Inconsistência detectada: '360 anos' em vez de '364 anos'"
  echo "$WRONG_YEARS" | sed 's/^/     /'
  ((ISSUES++))
  EXIT_CODE=1
else
  echo "  ✅ Anos de tradição consistentes (364 anos)"
fi
echo ""

# Test 2: CNPJ - não deve ter "[A confirmar]" ou "XX.XXX"
echo "Test 2: CNPJ..."
PENDING_CNPJ=$(grep -rni "CNPJ.*\[A confirmar\]\|CNPJ.*XX\.XXX" docs/ business/ 2>/dev/null || true)
if [ -n "$PENDING_CNPJ" ]; then
  echo "  ⚠️  CNPJ ainda pendente de confirmação"
  echo "$PENDING_CNPJ" | head -5 | sed 's/^/     /'
  ((ISSUES++))
  EXIT_CODE=1
else
  echo "  ✅ CNPJ confirmado em todos os documentos"
fi
echo ""

# Test 3: MRR (deve ser R$ 75k, não R$ 30k)
echo "Test 3: MRR (Monthly Recurring Revenue)..."
WRONG_MRR=$(grep -rni "MRR.*30\.000\|MRR.*R\$ 30" docs/ 2>/dev/null || true)
if [ -n "$WRONG_MRR" ]; then
  echo "  ❌ Inconsistência: MRR deve ser R\$ 75.000, não R\$ 30.000"
  echo "$WRONG_MRR" | sed 's/^/     /'
  ((ISSUES++))
  EXIT_CODE=1
else
  echo "  ✅ MRR consistente (R\$ 75.000)"
fi
echo ""

# Test 4: Nome oficial (variações devem estar padronizadas)
echo "Test 4: Nome Oficial da Empresa..."
VARIATIONS=$(grep -rni "Garcez.*Palha" docs/ 2>/dev/null | \
  grep -vi "Garcez Palha Advogados Associados\|Garcez Palha\|garcezpalha\.com" | \
  head -5 || true)
if [ -n "$VARIATIONS" ]; then
  echo "  ⚠️  Variações do nome detectadas (verificar se estão corretas)"
  echo "$VARIATIONS" | sed 's/^/     /'
  ((ISSUES++))
else
  echo "  ✅ Nome oficial consistente"
fi
echo ""

# Test 5: WhatsApp (deve ser +55 21 99535-4010)
echo "Test 5: Número WhatsApp..."
WRONG_WHATS=$(grep -rni "WhatsApp.*[0-9]" docs/ 2>/dev/null | \
  grep -v "99535-4010\|99535 4010\|995354010" || true)
if [ -n "$WRONG_WHATS" ]; then
  echo "  ❌ Número WhatsApp inconsistente"
  echo "$WRONG_WHATS" | head -5 | sed 's/^/     /'
  ((ISSUES++))
  EXIT_CODE=1
else
  echo "  ✅ WhatsApp consistente (+55 21 99535-4010)"
fi
echo ""

# Test 6: Campos "[A confirmar]" ou "TODO" (devem ser minimizados)
echo "Test 6: Campos Pendentes..."
PENDING_FIELDS=$(grep -rni "\[A confirmar\]\|TODO:\|FIXME:\|XXX:" docs/ business/ 2>/dev/null | wc -l)
if [ "$PENDING_FIELDS" -gt 50 ]; then
  echo "  ⚠️  Muitos campos pendentes: $PENDING_FIELDS"
  echo "     Meta: reduzir para < 20"
  ((ISSUES++))
elif [ "$PENDING_FIELDS" -gt 0 ]; then
  echo "  ✅ Campos pendentes aceitáveis: $PENDING_FIELDS (meta: 0)"
else
  echo "  ✅ ZERO campos pendentes!"
fi
echo ""

# Test 7: Links quebrados internos
echo "Test 7: Links Internos..."
BROKEN_LINKS=0
for file in docs/*.md; do
  if [ ! -f "$file" ]; then continue; fi

  # Extrair links markdown [texto](caminho)
  grep -oP '\]\(\K[^)]+(?=\))' "$file" 2>/dev/null | while read link; do
    # Apenas links internos (começam com docs/, src/, business/)
    if [[ "$link" =~ ^(docs|src|business)/ ]]; then
      if [ ! -f "$link" ] && [ ! -d "$link" ]; then
        echo "  ❌ Link quebrado em $file: $link"
        ((BROKEN_LINKS++))
      fi
    fi
  done
done

if [ $BROKEN_LINKS -gt 0 ]; then
  echo "  ❌ Links quebrados detectados: $BROKEN_LINKS"
  ((ISSUES++))
  EXIT_CODE=1
else
  echo "  ✅ Todos os links internos válidos"
fi
echo ""

# Resumo
echo "======================================="
echo ""
if [ $EXIT_CODE -eq 0 ]; then
  echo "✅ CONSISTÊNCIA: 100% APROVADO"
  echo ""
  echo "   Todos os documentos estão consistentes entre si"
else
  echo "❌ CONSISTÊNCIA: REPROVADO"
  echo ""
  echo "   📊 Total de inconsistências: $ISSUES"
  echo ""
  echo "   📋 Próximos passos:"
  echo "   1. Corrigir as inconsistências acima"
  echo "   2. Garantir que business/DADOS_MESTRES.md é a fonte única de verdade"
  echo "   3. Atualizar todos os documentos para referenciar DADOS_MESTRES.md"
  echo "   4. Re-executar este script"
fi
echo ""

exit $EXIT_CODE
