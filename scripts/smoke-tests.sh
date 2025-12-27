#!/bin/bash

# ============================================================================
# GARCEZ PALHA - SMOKE TESTS
# Verifica funcionalidades críticas em produção
# ============================================================================

echo "🔍 INICIANDO SMOKE TESTS..."
echo ""

# Cores para output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

BASE_URL="${DEPLOYMENT_URL:-http://localhost:3000}"
PASSED=0
FAILED=0

# Função para testar endpoint
test_endpoint() {
    local name=$1
    local url=$2
    local expected_status=${3:-200}

    echo -n "Testing $name... "

    response=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL$url" 2>/dev/null)

    if [ "$response" = "$expected_status" ]; then
        echo -e "${GREEN}✓ PASS${NC} (HTTP $response)"
        ((PASSED++))
        return 0
    else
        echo -e "${RED}✗ FAIL${NC} (Expected $expected_status, got $response)"
        ((FAILED++))
        return 1
    fi
}

# Função para testar API com JSON
test_api() {
    local name=$1
    local url=$2
    local method=${3:-GET}
    local data=${4:-"{}"}

    echo -n "Testing API $name... "

    if [ "$method" = "POST" ]; then
        response=$(curl -s -X POST \
            -H "Content-Type: application/json" \
            -d "$data" \
            -o /dev/null -w "%{http_code}" \
            "$BASE_URL$url" 2>/dev/null)
    else
        response=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL$url" 2>/dev/null)
    fi

    if [ "$response" -lt 500 ]; then
        echo -e "${GREEN}✓ PASS${NC} (HTTP $response)"
        ((PASSED++))
        return 0
    else
        echo -e "${RED}✗ FAIL${NC} (HTTP $response - Server Error)"
        ((FAILED++))
        return 1
    fi
}

echo "📍 Base URL: $BASE_URL"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "1. PÁGINAS PÚBLICAS"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

test_endpoint "Homepage" "/"
test_endpoint "Direito Bancário" "/areas/bancario"
test_endpoint "Direito Imobiliário" "/areas/imoveis"
test_endpoint "Direito Médico" "/areas/medico"
test_endpoint "Direito Criminal" "/areas/criminal"
test_endpoint "Precificação" "/pricing"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "2. API ENDPOINTS (PÚBLICOS)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

test_api "Health Check" "/api/health"
test_api "Products List" "/api/products"
test_api "Services List" "/api/services"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "3. CHAT & AGENTS (Requer Auth)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Estes endpoints retornam 401 (auth required) - esperado
test_api "Chat Endpoint" "/api/chat" "POST" '{"message":"test"}'
test_api "Agent Flow" "/api/chat/agent-flow" "POST" '{"message":"test"}'
test_api "Conversations List" "/api/conversations"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "4. REALTIME API (D-ID Avatar)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

test_api "D-ID Create Session" "/api/did/create-session" "POST"
test_api "D-ID Talk" "/api/did/talk" "POST"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "5. INTEGRAÇÕES (Devem retornar erro se não configuradas)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

test_api "WhatsApp Health" "/api/whatsapp/health"
test_api "ClickSign Health" "/api/clicksign/health"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📊 RESULTADOS FINAIS"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

TOTAL=$((PASSED + FAILED))
SUCCESS_RATE=$((PASSED * 100 / TOTAL))

echo "Total Tests: $TOTAL"
echo -e "${GREEN}Passed: $PASSED${NC}"
echo -e "${RED}Failed: $FAILED${NC}"
echo "Success Rate: $SUCCESS_RATE%"
echo ""

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}✅ ALL TESTS PASSED!${NC}"
    echo ""
    exit 0
else
    echo -e "${YELLOW}⚠️  SOME TESTS FAILED${NC}"
    echo ""
    exit 1
fi
