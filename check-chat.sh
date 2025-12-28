#!/bin/bash
# Script de diagnóstico do Chat com IA/Avatar

echo "======================================"
echo "🔍 Diagnóstico de Chat com IA/Avatar"
echo "======================================"
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check .env.local
echo "1. Verificando Variáveis de Ambiente..."
if [ -f ".env.local" ]; then
  if grep -q "^OPENAI_API_KEY=" .env.local 2>/dev/null; then
    echo -e "${GREEN}✅ OPENAI_API_KEY configurada${NC}"
  else
    echo -e "${RED}❌ OPENAI_API_KEY NÃO configurada${NC}"
  fi

  if grep -q "^DID_API_KEY=" .env.local 2>/dev/null; then
    echo -e "${GREEN}✅ DID_API_KEY configurada${NC}"
  else
    echo -e "${RED}❌ DID_API_KEY NÃO configurada${NC}"
  fi
else
  echo -e "${RED}❌ Arquivo .env.local não encontrado${NC}"
fi

echo ""

# Check if server is running
echo "2. Verificando Servidor Next.js..."
if curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/api/health 2>/dev/null | grep -q "200\|404"; then
  echo -e "${GREEN}✅ Servidor Next.js está rodando${NC}"
else
  echo -e "${RED}❌ Servidor Next.js NÃO está rodando${NC}"
  echo -e "${YELLOW}   Execute: npm run dev${NC}"
  exit 1
fi

echo ""

# Test OpenAI API
echo "3. Testando OpenAI API..."
OPENAI_RESPONSE=$(curl -s http://localhost:3000/api/diagnostic/openai 2>/dev/null)
OPENAI_STATUS=$(echo "$OPENAI_RESPONSE" | jq -r '.status' 2>/dev/null)

if [ "$OPENAI_STATUS" = "success" ]; then
  echo -e "${GREEN}✅ OpenAI API funcionando${NC}"
  OPENAI_MODELS=$(echo "$OPENAI_RESPONSE" | jq -r '.availableModels[]' 2>/dev/null | head -3)
  echo "   Modelos disponíveis: $(echo $OPENAI_MODELS | tr '\n' ', ')"
else
  echo -e "${RED}❌ OpenAI API com erro${NC}"
  ERROR_MSG=$(echo "$OPENAI_RESPONSE" | jq -r '.message' 2>/dev/null)
  echo -e "${YELLOW}   Erro: $ERROR_MSG${NC}"
fi

echo ""

# Test D-ID API
echo "4. Testando D-ID API..."
DID_RESPONSE=$(curl -s http://localhost:3000/api/diagnostic/did 2>/dev/null)
DID_STATUS=$(echo "$DID_RESPONSE" | jq -r '.status' 2>/dev/null)

if [ "$DID_STATUS" = "success" ]; then
  echo -e "${GREEN}✅ D-ID API funcionando${NC}"
  DID_CREDITS=$(echo "$DID_RESPONSE" | jq -r '.credits' 2>/dev/null)
  echo "   Créditos: $DID_CREDITS"
else
  echo -e "${RED}❌ D-ID API com erro${NC}"
  ERROR_MSG=$(echo "$DID_RESPONSE" | jq -r '.message' 2>/dev/null)
  ERROR_CODE=$(echo "$DID_RESPONSE" | jq -r '.statusCode' 2>/dev/null)
  echo -e "${YELLOW}   Erro: $ERROR_MSG (HTTP $ERROR_CODE)${NC}"
  echo -e "${YELLOW}   Verifique se a chave D-ID está em Base64${NC}"
fi

echo ""

# Test Realtime Session Creation
echo "5. Testando Criação de Sessão Realtime..."
REALTIME_RESPONSE=$(curl -s -X POST http://localhost:3000/api/realtime/session \
  -H "Content-Type: application/json" \
  -d '{"productId":"test"}' 2>/dev/null)

if echo "$REALTIME_RESPONSE" | jq -e '.client_secret' > /dev/null 2>&1; then
  echo -e "${GREEN}✅ Sessão Realtime criada com sucesso${NC}"
  SECRET_PREFIX=$(echo "$REALTIME_RESPONSE" | jq -r '.client_secret' | cut -c1-10)
  echo "   Token: $SECRET_PREFIX..."
else
  echo -e "${RED}❌ Falha ao criar sessão Realtime${NC}"
  ERROR_MSG=$(echo "$REALTIME_RESPONSE" | jq -r '.error' 2>/dev/null)
  echo -e "${YELLOW}   Erro: $ERROR_MSG${NC}"
fi

echo ""

# Test D-ID Session Creation
echo "6. Testando Criação de Sessão D-ID..."
DID_SESSION_RESPONSE=$(curl -s -X POST http://localhost:3000/api/did/create-session \
  -H "Content-Type: application/json" \
  -d '{"source_url":"https://create-images-results.d-id.com/google-oauth2%7C111749261755268084846/upl_xF7eJLGPqDRXFQVUB-lH-/image.jpeg"}' 2>/dev/null)

if echo "$DID_SESSION_RESPONSE" | jq -e '.id' > /dev/null 2>&1; then
  echo -e "${GREEN}✅ Sessão D-ID criada com sucesso${NC}"
  SESSION_ID=$(echo "$DID_SESSION_RESPONSE" | jq -r '.id')
  echo "   Session ID: $SESSION_ID"
else
  echo -e "${RED}❌ Falha ao criar sessão D-ID${NC}"
  ERROR_MSG=$(echo "$DID_SESSION_RESPONSE" | jq -r '.error' 2>/dev/null)
  echo -e "${YELLOW}   Erro: $ERROR_MSG${NC}"
fi

echo ""
echo "======================================"
echo "📋 Resumo do Diagnóstico"
echo "======================================"

# Count successes
SUCCESS_COUNT=0
TOTAL_TESTS=6

if grep -q "^OPENAI_API_KEY=" .env.local 2>/dev/null; then ((SUCCESS_COUNT++)); fi
if grep -q "^DID_API_KEY=" .env.local 2>/dev/null; then ((SUCCESS_COUNT++)); fi
if curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/api/health 2>/dev/null | grep -q "200\|404"; then ((SUCCESS_COUNT++)); fi
if [ "$OPENAI_STATUS" = "success" ]; then ((SUCCESS_COUNT++)); fi
if [ "$DID_STATUS" = "success" ]; then ((SUCCESS_COUNT++)); fi
if echo "$REALTIME_RESPONSE" | jq -e '.client_secret' > /dev/null 2>&1; then ((SUCCESS_COUNT++)); fi

echo ""
echo "Testes passados: $SUCCESS_COUNT/$TOTAL_TESTS"

if [ $SUCCESS_COUNT -eq $TOTAL_TESTS ]; then
  echo -e "${GREEN}✅ Todos os testes passaram! O sistema está pronto.${NC}"
  echo ""
  echo "🚀 Para testar no navegador:"
  echo "   1. Acesse http://localhost:3000"
  echo "   2. Clique no botão flutuante de chat (canto inferior direito)"
  echo "   3. Escolha 'Chat com IA'"
  echo "   4. Escolha o modo (Áudio Puro ou Avatar Visual)"
  echo "   5. Permita o acesso ao microfone quando solicitado"
else
  echo -e "${YELLOW}⚠️  Alguns testes falharam. Verifique os erros acima.${NC}"
  echo ""
  echo "📖 Para mais informações, consulte:"
  echo "   d:\\garcezpalha\\TROUBLESHOOTING-CHAT.md"
fi

echo ""
