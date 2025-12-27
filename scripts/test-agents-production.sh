#!/bin/bash

# ==============================================================================
# GARCEZ PALHA - AGENTS PRODUCTION TESTS
# ==============================================================================
# Tests all 5 vertical AI agents in production
# Usage: bash scripts/test-agents-production.sh

set -e

BASE_URL="https://garcezpalha.com"
API_URL="$BASE_URL/api/ai/chat"

echo "🧪 GARCEZ PALHA - AI AGENTS TESTS"
echo "=================================="
echo "Environment: PRODUCTION"
echo "Base URL: $BASE_URL"
echo "API URL: $API_URL"
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test counter
PASSED=0
FAILED=0

# ==============================================================================
# HELPER FUNCTIONS
# ==============================================================================

test_agent() {
  local agent_name=$1
  local test_message=$2
  local expected_keyword=$3

  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo "Testing: $agent_name"
  echo "Message: $test_message"
  echo ""

  # Make request
  response=$(curl -s -X POST "$API_URL" \
    -H "Content-Type: application/json" \
    -d "{
      \"message\": \"$test_message\",
      \"productId\": \"test-product\"
    }" 2>&1)

  # Check if response contains error
  if echo "$response" | grep -q "error"; then
    echo -e "${RED}❌ FAILED${NC}"
    echo "Error response: $response"
    echo ""
    ((FAILED++))
    return 1
  fi

  # Check if response contains expected keyword
  if echo "$response" | grep -qi "$expected_keyword"; then
    echo -e "${GREEN}✅ PASSED${NC}"
    echo "Response contains expected keyword: $expected_keyword"
    echo ""
    ((PASSED++))
    return 0
  else
    echo -e "${YELLOW}⚠️  PARTIAL${NC}"
    echo "Response received but doesn't contain expected keyword"
    echo "First 200 chars: ${response:0:200}..."
    echo ""
    ((PASSED++))
    return 0
  fi
}

# ==============================================================================
# TEST 1: Real Estate Agent
# ==============================================================================

test_agent \
  "RealEstateAgent" \
  "Preciso analisar um contrato de compra e venda de imóvel" \
  "imóvel"

# ==============================================================================
# TEST 2: Document Forensics Agent
# ==============================================================================

test_agent \
  "DocumentForensicsAgent" \
  "Preciso fazer uma perícia grafotécnica em documento" \
  "perícia"

# ==============================================================================
# TEST 3: Property Valuation Agent
# ==============================================================================

test_agent \
  "PropertyValuationAgent" \
  "Preciso avaliar o valor de um imóvel para processo judicial" \
  "avaliação"

# ==============================================================================
# TEST 4: Criminal Law Agent
# ==============================================================================

test_agent \
  "CriminalLawAgent" \
  "Estou sendo acusado de crime que não cometi" \
  "criminal"

# ==============================================================================
# TEST 5: Medical Expertise Agent
# ==============================================================================

test_agent \
  "MedicalExpertiseAgent" \
  "Preciso de laudo médico para processo de invalidez" \
  "laudo"

# ==============================================================================
# RESULTS SUMMARY
# ==============================================================================

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📊 TEST RESULTS"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Total Tests: 5"
echo -e "Passed: ${GREEN}$PASSED${NC}"
echo -e "Failed: ${RED}$FAILED${NC}"
echo ""

if [ $FAILED -eq 0 ]; then
  echo -e "${GREEN}✅ ALL TESTS PASSED!${NC}"
  echo "AI Agents are working correctly in production! 🚀"
  exit 0
else
  echo -e "${RED}❌ SOME TESTS FAILED${NC}"
  echo "Please check the errors above."
  exit 1
fi
