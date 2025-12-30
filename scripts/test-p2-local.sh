#!/bin/bash

# P2 Automation - Local Testing Script
# Tests all P2 endpoints before deploy

set -e

echo "🧪 P2 AUTOMATION - LOCAL TESTS"
echo "=============================="
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
BASE_URL="http://localhost:3000"
CRON_SECRET="${CRON_SECRET:-your_cron_secret}"

# Test counter
TESTS_PASSED=0
TESTS_FAILED=0

# Helper function to test endpoint
test_endpoint() {
  local name=$1
  local method=$2
  local url=$3
  local headers=$4
  local expected_status=$5

  echo -n "Testing $name... "

  if [ -z "$headers" ]; then
    response=$(curl -s -w "\n%{http_code}" -X $method "$url")
  else
    response=$(curl -s -w "\n%{http_code}" -X $method "$url" $headers)
  fi

  http_code=$(echo "$response" | tail -n1)
  body=$(echo "$response" | sed '$d')

  if [ "$http_code" == "$expected_status" ]; then
    echo -e "${GREEN}✓ PASS${NC} (HTTP $http_code)"
    TESTS_PASSED=$((TESTS_PASSED + 1))
    return 0
  else
    echo -e "${RED}✗ FAIL${NC} (HTTP $http_code, expected $expected_status)"
    echo "Response: $body"
    TESTS_FAILED=$((TESTS_FAILED + 1))
    return 1
  fi
}

echo "1️⃣  CORE API TESTS"
echo "-------------------"

# Test 1: Health check
test_endpoint "Health Check" GET "$BASE_URL/api/health" "" "200"

echo ""
echo "2️⃣  P2-001: EMAIL SEQUENCES"
echo "----------------------------"

# Test 2: Email sequences cron
test_endpoint "Email Sequences Cron" GET "$BASE_URL/api/email/sequences/cron" "-H 'Authorization: Bearer $CRON_SECRET'" "200"

# Test 3: Email sequences subscribe
test_endpoint "Email Subscribe Endpoint" GET "$BASE_URL/api/email/sequences/subscribe" "" "405"

echo ""
echo "3️⃣  P2-003: LEGAL DOCUMENTS"
echo "----------------------------"

# Test 4: Legal documents types
test_endpoint "Legal Documents Types" GET "$BASE_URL/api/documents/legal?types=true" "" "200"

echo ""
echo "4️⃣  P2-004: PROCESS MONITOR"
echo "----------------------------"

# Test 5: Process monitor cron
test_endpoint "Process Monitor Cron" GET "$BASE_URL/api/process-monitor/cron" "-H 'Authorization: Bearer $CRON_SECRET'" "200"

# Test 6: Process monitor endpoint
test_endpoint "Process Monitor API" GET "$BASE_URL/api/process-monitor" "" "200"

echo ""
echo "5️⃣  P2-005: REPORTS"
echo "--------------------"

# Test 7: Reports types
test_endpoint "Reports Types" GET "$BASE_URL/api/reports/generate?types=true" "" "200"

echo ""
echo "=============================="
echo "📊 TEST RESULTS"
echo "=============================="
echo -e "${GREEN}Passed: $TESTS_PASSED${NC}"
echo -e "${RED}Failed: $TESTS_FAILED${NC}"
echo ""

if [ $TESTS_FAILED -eq 0 ]; then
  echo -e "${GREEN}✅ ALL TESTS PASSED!${NC}"
  echo "You are ready to deploy to production."
  exit 0
else
  echo -e "${RED}❌ SOME TESTS FAILED${NC}"
  echo "Please fix the errors before deploying."
  exit 1
fi
