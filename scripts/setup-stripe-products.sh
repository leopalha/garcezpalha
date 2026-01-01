#!/bin/bash

# Script de configuração automática de produtos Stripe
# Para Garcez Palha - Plataforma SaaS B2B

echo "🚀 Configurando produtos e preços no Stripe..."
echo ""

# Cores para output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# ============================================
# 1. CRIAR PRODUTOS
# ============================================

echo -e "${BLUE}📦 Criando produtos...${NC}"

# Produto: Starter Plan
STARTER_PRODUCT=$(stripe products create \
  --name="Starter Plan" \
  --description="Plano inicial para advogados iniciantes. 1 nicho, 3 produtos, 100 leads/mês." \
  --metadata[plan_id]="starter" \
  --metadata[tier]="basic" \
  --metadata[max_products]="3" \
  --metadata[max_leads]="100" \
  --metadata[max_conversations]="500" \
  --metadata[max_emails_per_month]="1000" \
  --output=json)

STARTER_PRODUCT_ID=$(echo $STARTER_PRODUCT | grep -o '"id": "[^"]*"' | head -1 | cut -d'"' -f4)
echo -e "${GREEN}✅ Starter Product criado: ${STARTER_PRODUCT_ID}${NC}"

# Produto: Pro Plan
PRO_PRODUCT=$(stripe products create \
  --name="Pro Plan" \
  --description="Plano profissional para advogados em crescimento. 3 nichos, 10 produtos, 500 leads/mês." \
  --metadata[plan_id]="pro" \
  --metadata[tier]="professional" \
  --metadata[max_products]="10" \
  --metadata[max_leads]="500" \
  --metadata[max_conversations]="2000" \
  --metadata[max_emails_per_month]="5000" \
  --output=json)

PRO_PRODUCT_ID=$(echo $PRO_PRODUCT | grep -o '"id": "[^"]*"' | head -1 | cut -d'"' -f4)
echo -e "${GREEN}✅ Pro Product criado: ${PRO_PRODUCT_ID}${NC}"

# Produto: Enterprise Plan
ENTERPRISE_PRODUCT=$(stripe products create \
  --name="Enterprise Plan" \
  --description="Plano enterprise para escritórios. Nichos ilimitados, produtos ilimitados, leads ilimitados." \
  --metadata[plan_id]="enterprise" \
  --metadata[tier]="enterprise" \
  --metadata[max_products]="null" \
  --metadata[max_leads]="null" \
  --metadata[max_conversations]="null" \
  --metadata[max_emails_per_month]="null" \
  --output=json)

ENTERPRISE_PRODUCT_ID=$(echo $ENTERPRISE_PRODUCT | grep -o '"id": "[^"]*"' | head -1 | cut -d'"' -f4)
echo -e "${GREEN}✅ Enterprise Product criado: ${ENTERPRISE_PRODUCT_ID}${NC}"

# Produto: Addon - Nicho Extra
ADDON_NICHO=$(stripe products create \
  --name="Nicho Extra" \
  --description="Adicione mais um nicho ao seu plano (até 3 nichos adicionais)" \
  --metadata[addon_type]="nicho" \
  --metadata[is_addon]="true" \
  --output=json)

ADDON_NICHO_ID=$(echo $ADDON_NICHO | grep -o '"id": "[^"]*"' | head -1 | cut -d'"' -f4)
echo -e "${GREEN}✅ Addon Nicho Extra criado: ${ADDON_NICHO_ID}${NC}"

# Produto: Addon - Catálogo Premium
ADDON_CATALOGO=$(stripe products create \
  --name="Catálogo Premium" \
  --description="Acesso ao catálogo completo de 47 nichos jurídicos pré-configurados" \
  --metadata[addon_type]="catalogo" \
  --metadata[is_addon]="true" \
  --output=json)

ADDON_CATALOGO_ID=$(echo $ADDON_CATALOGO | grep -o '"id": "[^"]*"' | head -1 | cut -d'"' -f4)
echo -e "${GREEN}✅ Addon Catálogo Premium criado: ${ADDON_CATALOGO_ID}${NC}"

echo ""
echo -e "${BLUE}💰 Criando preços...${NC}"

# ============================================
# 2. CRIAR PREÇOS (MENSAIS)
# ============================================

# Starter - Mensal (R$ 297/mês)
STARTER_MONTHLY=$(stripe prices create \
  --product="${STARTER_PRODUCT_ID}" \
  --currency=brl \
  --unit-amount=29700 \
  --recurring[interval]=month \
  --nickname="Starter Mensal" \
  --metadata[billing_cycle]="monthly" \
  --output=json)

STARTER_MONTHLY_ID=$(echo $STARTER_MONTHLY | grep -o '"id": "[^"]*"' | head -1 | cut -d'"' -f4)
echo -e "${GREEN}✅ Starter Mensal criado: ${STARTER_MONTHLY_ID} (R$ 297/mês)${NC}"

# Pro - Mensal (R$ 697/mês)
PRO_MONTHLY=$(stripe prices create \
  --product="${PRO_PRODUCT_ID}" \
  --currency=brl \
  --unit-amount=69700 \
  --recurring[interval]=month \
  --nickname="Pro Mensal" \
  --metadata[billing_cycle]="monthly" \
  --output=json)

PRO_MONTHLY_ID=$(echo $PRO_MONTHLY | grep -o '"id": "[^"]*"' | head -1 | cut -d'"' -f4)
echo -e "${GREEN}✅ Pro Mensal criado: ${PRO_MONTHLY_ID} (R$ 697/mês)${NC}"

# Enterprise - Mensal (R$ 1.997/mês)
ENTERPRISE_MONTHLY=$(stripe prices create \
  --product="${ENTERPRISE_PRODUCT_ID}" \
  --currency=brl \
  --unit-amount=199700 \
  --recurring[interval]=month \
  --nickname="Enterprise Mensal" \
  --metadata[billing_cycle]="monthly" \
  --output=json)

ENTERPRISE_MONTHLY_ID=$(echo $ENTERPRISE_MONTHLY | grep -o '"id": "[^"]*"' | head -1 | cut -d'"' -f4)
echo -e "${GREEN}✅ Enterprise Mensal criado: ${ENTERPRISE_MONTHLY_ID} (R$ 1.997/mês)${NC}"

# ============================================
# 3. CRIAR PREÇOS (ANUAIS) - 20% desconto
# ============================================

# Starter - Anual (R$ 2.970/ano = R$ 247,50/mês)
STARTER_YEARLY=$(stripe prices create \
  --product="${STARTER_PRODUCT_ID}" \
  --currency=brl \
  --unit-amount=297000 \
  --recurring[interval]=year \
  --nickname="Starter Anual (20% off)" \
  --metadata[billing_cycle]="yearly" \
  --output=json)

STARTER_YEARLY_ID=$(echo $STARTER_YEARLY | grep -o '"id": "[^"]*"' | head -1 | cut -d'"' -f4)
echo -e "${GREEN}✅ Starter Anual criado: ${STARTER_YEARLY_ID} (R$ 2.970/ano)${NC}"

# Pro - Anual (R$ 6.970/ano = R$ 580,83/mês)
PRO_YEARLY=$(stripe prices create \
  --product="${PRO_PRODUCT_ID}" \
  --currency=brl \
  --unit-amount=697000 \
  --recurring[interval]=year \
  --nickname="Pro Anual (20% off)" \
  --metadata[billing_cycle]="yearly" \
  --output=json)

PRO_YEARLY_ID=$(echo $PRO_YEARLY | grep -o '"id": "[^"]*"' | head -1 | cut -d'"' -f4)
echo -e "${GREEN}✅ Pro Anual criado: ${PRO_YEARLY_ID} (R$ 6.970/ano)${NC}"

# Enterprise - Anual (R$ 19.970/ano = R$ 1.664,17/mês)
ENTERPRISE_YEARLY=$(stripe prices create \
  --product="${ENTERPRISE_PRODUCT_ID}" \
  --currency=brl \
  --unit-amount=1997000 \
  --recurring[interval]=year \
  --nickname="Enterprise Anual (20% off)" \
  --metadata[billing_cycle]="yearly" \
  --output=json)

ENTERPRISE_YEARLY_ID=$(echo $ENTERPRISE_YEARLY | grep -o '"id": "[^"]*"' | head -1 | cut -d'"' -f4)
echo -e "${GREEN}✅ Enterprise Anual criado: ${ENTERPRISE_YEARLY_ID} (R$ 19.970/ano)${NC}"

# ============================================
# 4. CRIAR PREÇOS DE ADDONS
# ============================================

# Addon Nicho Extra - Mensal (R$ 97/mês)
ADDON_NICHO_MONTHLY=$(stripe prices create \
  --product="${ADDON_NICHO_ID}" \
  --currency=brl \
  --unit-amount=9700 \
  --recurring[interval]=month \
  --nickname="Nicho Extra Mensal" \
  --output=json)

ADDON_NICHO_MONTHLY_ID=$(echo $ADDON_NICHO_MONTHLY | grep -o '"id": "[^"]*"' | head -1 | cut -d'"' -f4)
echo -e "${GREEN}✅ Addon Nicho Extra criado: ${ADDON_NICHO_MONTHLY_ID} (R$ 97/mês)${NC}"

# Addon Catálogo Premium - Mensal (R$ 197/mês)
ADDON_CATALOGO_MONTHLY=$(stripe prices create \
  --product="${ADDON_CATALOGO_ID}" \
  --currency=brl \
  --unit-amount=19700 \
  --recurring[interval]=month \
  --nickname="Catálogo Premium Mensal" \
  --output=json)

ADDON_CATALOGO_MONTHLY_ID=$(echo $ADDON_CATALOGO_MONTHLY | grep -o '"id": "[^"]*"' | head -1 | cut -d'"' -f4)
echo -e "${GREEN}✅ Addon Catálogo Premium criado: ${ADDON_CATALOGO_MONTHLY_ID} (R$ 197/mês)${NC}"

# ============================================
# 5. GERAR ARQUIVO .env COM OS IDs
# ============================================

echo ""
echo -e "${YELLOW}📝 Gerando variáveis de ambiente...${NC}"

cat > .env.stripe.local << EOF
# ============================================
# STRIPE PRODUCTS & PRICES
# Gerado automaticamente em $(date)
# ============================================

# Products
STRIPE_PRODUCT_STARTER=${STARTER_PRODUCT_ID}
STRIPE_PRODUCT_PRO=${PRO_PRODUCT_ID}
STRIPE_PRODUCT_ENTERPRISE=${ENTERPRISE_PRODUCT_ID}
STRIPE_PRODUCT_ADDON_NICHO=${ADDON_NICHO_ID}
STRIPE_PRODUCT_ADDON_CATALOGO=${ADDON_CATALOGO_ID}

# Prices - Monthly
NEXT_PUBLIC_STRIPE_PRICE_STARTER_MONTHLY=${STARTER_MONTHLY_ID}
NEXT_PUBLIC_STRIPE_PRICE_PRO_MONTHLY=${PRO_MONTHLY_ID}
NEXT_PUBLIC_STRIPE_PRICE_ENTERPRISE_MONTHLY=${ENTERPRISE_MONTHLY_ID}

# Prices - Yearly
NEXT_PUBLIC_STRIPE_PRICE_STARTER_YEARLY=${STARTER_YEARLY_ID}
NEXT_PUBLIC_STRIPE_PRICE_PRO_YEARLY=${PRO_YEARLY_ID}
NEXT_PUBLIC_STRIPE_PRICE_ENTERPRISE_YEARLY=${ENTERPRISE_YEARLY_ID}

# Addons
NEXT_PUBLIC_STRIPE_PRICE_ADDON_NICHO=${ADDON_NICHO_MONTHLY_ID}
NEXT_PUBLIC_STRIPE_PRICE_ADDON_CATALOGO=${ADDON_CATALOGO_MONTHLY_ID}
EOF

echo -e "${GREEN}✅ Arquivo .env.stripe.local criado!${NC}"
echo ""
echo -e "${BLUE}============================================${NC}"
echo -e "${GREEN}🎉 CONFIGURAÇÃO CONCLUÍDA COM SUCESSO!${NC}"
echo -e "${BLUE}============================================${NC}"
echo ""
echo "📋 Resumo dos produtos criados:"
echo ""
echo "PLANOS:"
echo "  • Starter:    ${STARTER_PRODUCT_ID}"
echo "  • Pro:        ${PRO_PRODUCT_ID}"
echo "  • Enterprise: ${ENTERPRISE_PRODUCT_ID}"
echo ""
echo "ADDONS:"
echo "  • Nicho Extra:       ${ADDON_NICHO_ID}"
echo "  • Catálogo Premium:  ${ADDON_CATALOGO_ID}"
echo ""
echo "📄 Copie as variáveis de .env.stripe.local para seu arquivo .env"
echo ""
echo "🔗 Próximos passos:"
echo "  1. Copiar variáveis para .env"
echo "  2. Configurar webhook: stripe listen --forward-to localhost:3000/api/stripe/webhook"
echo "  3. Testar checkout em http://localhost:3000/app/checkout"
echo ""
