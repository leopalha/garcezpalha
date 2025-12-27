#!/bin/bash

# ============================================================================
# GARCEZ PALHA - AGENTS TESTING SCRIPT
# Testa os 22 agentes em produção
# ============================================================================

echo "🤖 TESTANDO AGENTES DE IA..."
echo ""

BASE_URL="${DEPLOYMENT_URL:-http://localhost:3000}"
API_ENDPOINT="$BASE_URL/api/chat/agent-flow"

# Cores
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

PASSED=0
FAILED=0

# Função para testar agent
test_agent() {
    local agent_name=$1
    local test_message=$2
    local expected_agent=${3:-$agent_name}

    echo -n "Testing $agent_name... "

    response=$(curl -s -X POST \
        -H "Content-Type: application/json" \
        -d "{\"message\":\"$test_message\",\"productId\":\"test\",\"productName\":\"Test Product\"}" \
        "$API_ENDPOINT" 2>/dev/null)

    http_code=$(echo "$response" | jq -r '.status // "200"' 2>/dev/null)

    if [ -n "$response" ] && [ "$response" != "null" ]; then
        # Verifica se a resposta contém conteúdo
        content=$(echo "$response" | jq -r '.content // .reply // .message // empty' 2>/dev/null)

        if [ -n "$content" ] && [ "$content" != "null" ]; then
            echo -e "${GREEN}✓ PASS${NC} - Agent respondeu"
            ((PASSED++))

            # Mostra preview da resposta (primeiras 80 chars)
            preview=$(echo "$content" | head -c 80)
            echo "  └─ Response: ${preview}..."
            return 0
        fi
    fi

    echo -e "${RED}✗ FAIL${NC} - Sem resposta válida"
    ((FAILED++))
    return 1
}

echo "📍 Endpoint: $API_ENDPOINT"
echo ""

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "1. AGENTES JURÍDICOS (8 agents)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

test_agent "RealEstateAgent" "Preciso resolver um problema de usucapião" "imobiliario"
test_agent "DocumentForensicsAgent" "Suspeito que um documento foi falsificado" "pericia"
test_agent "PropertyValuationAgent" "Preciso avaliar um imóvel para herança" "avaliacao"
test_agent "MedicalExpertiseAgent" "Plano de saúde negou minha cirurgia" "saude"
test_agent "CriminalLawAgent" "Fui acusado injustamente de um crime" "criminal"
test_agent "FinancialProtectionAgent" "Minha conta foi bloqueada indevidamente" "bancario"
test_agent "HealthInsuranceAgent" "Convênio não autorizou meu tratamento" "plano-saude"
test_agent "SocialSecurityAgent" "Preciso dar entrada na aposentadoria" "previdenciario"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "2. AGENTES DE MARKETING (6 agents)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

test_agent "ContentAgent" "Crie um post sobre direito do consumidor" "content"
test_agent "SocialAgent" "Agende posts para esta semana" "social"
test_agent "AdsAgent" "Otimize campanhas Google Ads" "ads"
test_agent "SEOAgent" "Melhore o ranking da página de imóveis" "seo"
test_agent "VideoAgent" "Crie roteiro para vídeo sobre heranças" "video"
test_agent "DesignAgent" "Crie banner para campanha de saúde" "design"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "3. AGENTES EXECUTIVOS (4 agents)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

test_agent "CEOAgent" "Qual a estratégia de crescimento?" "ceo"
test_agent "CFOAgent" "Analise o faturamento deste mês" "cfo"
test_agent "CMOAgent" "Como aumentar conversões?" "cmo"
test_agent "COOAgent" "Otimize os processos operacionais" "coo"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "4. AGENTES DE INTELIGÊNCIA (2 agents)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

test_agent "PricingAgent" "Sugira o preço para consultoria imobiliária" "pricing"
test_agent "MarketIntelAgent" "Analise tendências do mercado jurídico" "market"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "5. AGENTES DE OPERAÇÕES (2 agents)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

test_agent "QAAgent" "Revise este contrato de compra e venda" "qa"
test_agent "AdminAgent" "Agende uma reunião para amanhã" "admin"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📊 RESULTADOS FINAIS"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

TOTAL=$((PASSED + FAILED))

if [ $TOTAL -eq 0 ]; then
    echo -e "${RED}No tests executed${NC}"
    exit 1
fi

SUCCESS_RATE=$((PASSED * 100 / TOTAL))

echo "Total Agents Tested: $TOTAL/22"
echo -e "${GREEN}Passed: $PASSED${NC}"
echo -e "${RED}Failed: $FAILED${NC}"
echo "Success Rate: $SUCCESS_RATE%"
echo ""

if [ $SUCCESS_RATE -ge 80 ]; then
    echo -e "${GREEN}✅ AGENTS VALIDATION PASSED!${NC}"
    echo ""
    exit 0
elif [ $SUCCESS_RATE -ge 50 ]; then
    echo -e "${YELLOW}⚠️  AGENTS PARTIALLY WORKING${NC}"
    echo ""
    exit 1
else
    echo -e "${RED}❌ AGENTS FAILING${NC}"
    echo ""
    exit 1
fi
