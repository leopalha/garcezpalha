#!/bin/bash

# P2 Automation - Production Smoke Tests
# Verifies all P2 endpoints in production

set -e

echo "🚀 P2 AUTOMATION - PRODUCTION SMOKE TESTS"
echo "=========================================="
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
PRODUCTION_URL="${PRODUCTION_URL:-https://garcezpalha.com}"

# Test counter
TESTS_PASSED=0
TESTS_FAILED=0

# Helper function to test endpoint
test_endpoint() {
  local name=$1
  local method=$2
  local url=$3
  local expected_status=$4

  echo -n "Testing $name... "

  response=$(curl -s -w "\n%{http_code}" -X $method "$url" 2>/dev/null || echo -e "\n000")

  http_code=$(echo "$response" | tail -n1)
  body=$(echo "$response" | sed '$d')

  if [ "$http_code" == "$expected_status" ]; then
    echo -e "${GREEN}✓ PASS${NC} (HTTP $http_code)"
    TESTS_PASSED=$((TESTS_PASSED + 1))

    # Show response preview for 200 OK
    if [ "$http_code" == "200" ] && [ ! -z "$body" ]; then
      preview=$(echo "$body" | head -c 100)
      echo "  Preview: $preview..."
    fi

    return 0
  else
    echo -e "${RED}✗ FAIL${NC} (HTTP $http_code, expected $expected_status)"

    if [ "$http_code" == "000" ]; then
      echo "  Error: Cannot connect to server"
    elif [ ! -z "$body" ]; then
      echo "  Response: $(echo $body | head -c 200)"
    fi

    TESTS_FAILED=$((TESTS_FAILED + 1))
    return 1
  fi
}

echo "1️⃣  CORE API TESTS"
echo "-------------------"

# Test 1: Health check
test_endpoint "Health Check" GET "$PRODUCTION_URL/api/health" "200"

echo ""
echo "2️⃣  P2-001: EMAIL SEQUENCES"
echo "----------------------------"

# Note: Cron endpoint requires auth, testing other endpoints
test_endpoint "Email Subscribe (OPTIONS)" OPTIONS "$PRODUCTION_URL/api/email/sequences/subscribe" "200"

echo ""
echo "3️⃣  P2-003: LEGAL DOCUMENTS"
echo "----------------------------"

# Test: Legal documents types
test_endpoint "Legal Documents Types" GET "$PRODUCTION_URL/api/documents/legal?types=true" "200"

echo ""
echo "4️⃣  P2-004: PROCESS MONITOR"
echo "----------------------------"

# Test: Process monitor
test_endpoint "Process Monitor API" GET "$PRODUCTION_URL/api/process-monitor" "200"

echo ""
echo "5️⃣  P2-005: REPORTS"
echo "--------------------"

# Test: Reports types
test_endpoint "Reports Types" GET "$PRODUCTION_URL/api/reports/generate?types=true" "200"

echo ""
echo "6️⃣  WEBHOOKS (Check existence)"
echo "-------------------------------"

# Test: Stripe webhook (should return 400/405 without proper payload)
test_endpoint "Stripe Webhook Exists" POST "$PRODUCTION_URL/api/webhooks/stripe" "400"

# Test: ClickSign webhook
test_endpoint "ClickSign Webhook Exists" POST "$PRODUCTION_URL/api/webhooks/clicksign" "400"

# Test: WhatsApp webhook (GET for verification)
test_endpoint "WhatsApp Webhook Exists" GET "$PRODUCTION_URL/api/webhooks/whatsapp" "400"

echo ""
echo "=========================================="
echo "📊 SMOKE TEST RESULTS"
echo "=========================================="
echo -e "${GREEN}Passed: $TESTS_PASSED${NC}"
echo -e "${RED}Failed: $TESTS_FAILED${NC}"
echo ""

if [ $TESTS_FAILED -eq 0 ]; then
  echo -e "${GREEN}✅ ALL SMOKE TESTS PASSED!${NC}"
  echo "Production deployment is healthy."
  echo ""
  echo "Next steps:"
  echo "1. Verify cron jobs in Vercel Dashboard"
  echo "2. Configure webhooks (Stripe, ClickSign, WhatsApp)"
  echo "3. Monitor logs for 24 hours"
  exit 0
else
  echo -e "${RED}❌ SOME TESTS FAILED${NC}"
  echo "Please investigate the errors."
  echo ""
  echo "Troubleshooting:"
  echo "1. Check Vercel deployment logs"
  echo "2. Verify environment variables"
  echo "3. Check function execution logs"
  exit 1
fi
