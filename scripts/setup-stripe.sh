#!/bin/bash

# Stripe Setup Script - Creates all products and prices
# Color codes
GREEN='\033[0;32m'
CYAN='\033[0;36m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${CYAN}Starting Stripe product setup...${NC}"
echo ""

# Create Starter Product
echo -e "${CYAN}Creating Starter Plan...${NC}"
STARTER_JSON=$(stripe products create \
  --name="Starter Plan" \
  --description="Plano inicial para advogados. 3 produtos, 100 leads/mes" \
  -d "metadata[plan_id]=starter" \
  -d "metadata[tier]=basic" \
  -d "metadata[max_products]=3" \
  -d "metadata[max_leads]=100" \
  -d "metadata[max_conversations]=500")
STARTER_ID=$(echo "$STARTER_JSON" | grep '"id"' | head -1 | cut -d'"' -f4)
echo -e "${GREEN}SUCCESS: $STARTER_ID${NC}"

# Create Pro Product
echo -e "${CYAN}Creating Pro Plan...${NC}"
PRO_JSON=$(stripe products create \
  --name="Pro Plan" \
  --description="Plano profissional. 10 produtos, 500 leads/mes" \
  -d "metadata[plan_id]=pro" \
  -d "metadata[tier]=professional" \
  -d "metadata[max_products]=10" \
  -d "metadata[max_leads]=500" \
  -d "metadata[max_conversations]=2000")
PRO_ID=$(echo "$PRO_JSON" | grep '"id"' | head -1 | cut -d'"' -f4)
echo -e "${GREEN}SUCCESS: $PRO_ID${NC}"

# Create Enterprise Product
echo -e "${CYAN}Creating Enterprise Plan...${NC}"
ENTERPRISE_JSON=$(stripe products create \
  --name="Enterprise Plan" \
  --description="Plano enterprise. Produtos ilimitados, leads ilimitados" \
  -d "metadata[plan_id]=enterprise" \
  -d "metadata[tier]=enterprise" \
  -d "metadata[max_products]=null" \
  -d "metadata[max_leads]=null" \
  -d "metadata[max_conversations]=null")
ENTERPRISE_ID=$(echo "$ENTERPRISE_JSON" | grep '"id"' | head -1 | cut -d'"' -f4)
echo -e "${GREEN}SUCCESS: $ENTERPRISE_ID${NC}"

# Create Addon: Nicho Extra
echo -e "${CYAN}Creating Addon: Nicho Extra...${NC}"
ADDON_NICHO_JSON=$(stripe products create \
  --name="Addon: Nicho Extra" \
  --description="Adiciona 1 nicho adicional ao seu plano" \
  -d "metadata[addon_type]=nicho" \
  -d "metadata[adds_products]=1")
ADDON_NICHO_ID=$(echo "$ADDON_NICHO_JSON" | grep '"id"' | head -1 | cut -d'"' -f4)
echo -e "${GREEN}SUCCESS: $ADDON_NICHO_ID${NC}"

# Create Addon: Catalogo Premium
echo -e "${CYAN}Creating Addon: Catalogo Premium...${NC}"
ADDON_CATALOGO_JSON=$(stripe products create \
  --name="Addon: Catalogo Premium" \
  --description="47 nichos juridicos pre-configurados" \
  -d "metadata[addon_type]=catalogo" \
  -d "metadata[includes_niches]=47")
ADDON_CATALOGO_ID=$(echo "$ADDON_CATALOGO_JSON" | grep '"id"' | head -1 | cut -d'"' -f4)
echo -e "${GREEN}SUCCESS: $ADDON_CATALOGO_ID${NC}"

echo ""
echo -e "${CYAN}Creating prices...${NC}"

# Starter Monthly - R$ 297/month
STARTER_MONTHLY_JSON=$(stripe prices create \
  --product="$STARTER_ID" \
  --currency=brl \
  --unit-amount=29700 \
  -d "recurring[interval]=month" \
  --nickname="Starter Mensal")
STARTER_MONTHLY_ID=$(echo "$STARTER_MONTHLY_JSON" | grep '"id"' | head -1 | cut -d'"' -f4)
echo -e "${GREEN}Starter Monthly: $STARTER_MONTHLY_ID (R\$ 297/month)${NC}"

# Pro Monthly - R$ 697/month
PRO_MONTHLY_JSON=$(stripe prices create \
  --product="$PRO_ID" \
  --currency=brl \
  --unit-amount=69700 \
  -d "recurring[interval]=month" \
  --nickname="Pro Mensal")
PRO_MONTHLY_ID=$(echo "$PRO_MONTHLY_JSON" | grep '"id"' | head -1 | cut -d'"' -f4)
echo -e "${GREEN}Pro Monthly: $PRO_MONTHLY_ID (R\$ 697/month)${NC}"

# Enterprise Monthly - R$ 1,997/month
ENTERPRISE_MONTHLY_JSON=$(stripe prices create \
  --product="$ENTERPRISE_ID" \
  --currency=brl \
  --unit-amount=199700 \
  -d "recurring[interval]=month" \
  --nickname="Enterprise Mensal")
ENTERPRISE_MONTHLY_ID=$(echo "$ENTERPRISE_MONTHLY_JSON" | grep '"id"' | head -1 | cut -d'"' -f4)
echo -e "${GREEN}Enterprise Monthly: $ENTERPRISE_MONTHLY_ID (R\$ 1,997/month)${NC}"

# Starter Yearly - R$ 2,970/year (20% off)
STARTER_YEARLY_JSON=$(stripe prices create \
  --product="$STARTER_ID" \
  --currency=brl \
  --unit-amount=297000 \
  -d "recurring[interval]=year" \
  --nickname="Starter Anual")
STARTER_YEARLY_ID=$(echo "$STARTER_YEARLY_JSON" | grep '"id"' | head -1 | cut -d'"' -f4)
echo -e "${GREEN}Starter Yearly: $STARTER_YEARLY_ID (R\$ 2,970/year)${NC}"

# Pro Yearly - R$ 6,970/year (20% off)
PRO_YEARLY_JSON=$(stripe prices create \
  --product="$PRO_ID" \
  --currency=brl \
  --unit-amount=697000 \
  -d "recurring[interval]=year" \
  --nickname="Pro Anual")
PRO_YEARLY_ID=$(echo "$PRO_YEARLY_JSON" | grep '"id"' | head -1 | cut -d'"' -f4)
echo -e "${GREEN}Pro Yearly: $PRO_YEARLY_ID (R\$ 6,970/year)${NC}"

# Enterprise Yearly - R$ 19,970/year (20% off)
ENTERPRISE_YEARLY_JSON=$(stripe prices create \
  --product="$ENTERPRISE_ID" \
  --currency=brl \
  --unit-amount=1997000 \
  -d "recurring[interval]=year" \
  --nickname="Enterprise Anual")
ENTERPRISE_YEARLY_ID=$(echo "$ENTERPRISE_YEARLY_JSON" | grep '"id"' | head -1 | cut -d'"' -f4)
echo -e "${GREEN}Enterprise Yearly: $ENTERPRISE_YEARLY_ID (R\$ 19,970/year)${NC}"

# Addon Nicho - R$ 97/month
ADDON_NICHO_PRICE_JSON=$(stripe prices create \
  --product="$ADDON_NICHO_ID" \
  --currency=brl \
  --unit-amount=9700 \
  -d "recurring[interval]=month" \
  --nickname="Nicho Extra Mensal")
ADDON_NICHO_PRICE_ID=$(echo "$ADDON_NICHO_PRICE_JSON" | grep '"id"' | head -1 | cut -d'"' -f4)
echo -e "${GREEN}Nicho Extra: $ADDON_NICHO_PRICE_ID (R\$ 97/month)${NC}"

# Addon Catalogo - R$ 197/month
ADDON_CATALOGO_PRICE_JSON=$(stripe prices create \
  --product="$ADDON_CATALOGO_ID" \
  --currency=brl \
  --unit-amount=19700 \
  -d "recurring[interval]=month" \
  --nickname="Catalogo Premium Mensal")
ADDON_CATALOGO_PRICE_ID=$(echo "$ADDON_CATALOGO_PRICE_JSON" | grep '"id"' | head -1 | cut -d'"' -f4)
echo -e "${GREEN}Catalogo Premium: $ADDON_CATALOGO_PRICE_ID (R\$ 197/month)${NC}"

# Generate .env file
echo ""
echo -e "${CYAN}Generating .env.stripe.local...${NC}"
cat > .env.stripe.local << ENVEOF
# STRIPE PRODUCTS & PRICES
# Generated: $(date)

# PRODUCTS
STRIPE_PRODUCT_STARTER=$STARTER_ID
STRIPE_PRODUCT_PRO=$PRO_ID
STRIPE_PRODUCT_ENTERPRISE=$ENTERPRISE_ID
STRIPE_PRODUCT_ADDON_NICHO=$ADDON_NICHO_ID
STRIPE_PRODUCT_ADDON_CATALOGO=$ADDON_CATALOGO_ID

# MONTHLY PRICES
NEXT_PUBLIC_STRIPE_PRICE_STARTER_MONTHLY=$STARTER_MONTHLY_ID
NEXT_PUBLIC_STRIPE_PRICE_PRO_MONTHLY=$PRO_MONTHLY_ID
NEXT_PUBLIC_STRIPE_PRICE_ENTERPRISE_MONTHLY=$ENTERPRISE_MONTHLY_ID

# YEARLY PRICES
NEXT_PUBLIC_STRIPE_PRICE_STARTER_YEARLY=$STARTER_YEARLY_ID
NEXT_PUBLIC_STRIPE_PRICE_PRO_YEARLY=$PRO_YEARLY_ID
NEXT_PUBLIC_STRIPE_PRICE_ENTERPRISE_YEARLY=$ENTERPRISE_YEARLY_ID

# ADDON PRICES
NEXT_PUBLIC_STRIPE_PRICE_ADDON_NICHO=$ADDON_NICHO_PRICE_ID
NEXT_PUBLIC_STRIPE_PRICE_ADDON_CATALOGO=$ADDON_CATALOGO_PRICE_ID
ENVEOF

echo -e "${GREEN}SUCCESS: .env.stripe.local created!${NC}"
echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}STRIPE SETUP COMPLETED!${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo -e "${YELLOW}NEXT STEPS:${NC}"
echo "  1. Review .env.stripe.local"
echo "  2. Copy to .env: cat .env.stripe.local >> .env.local"
echo "  3. Test checkout at http://localhost:3000/app/checkout"
echo ""
