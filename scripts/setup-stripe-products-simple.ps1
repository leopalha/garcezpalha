# Setup Stripe Products and Prices
# Creates 5 products and 10 prices for the SaaS platform

Write-Host "Starting Stripe product setup..." -ForegroundColor Cyan
Write-Host ""

# ============================================
# 1. CREATE PRODUCTS
# ============================================

Write-Host "Creating products..." -ForegroundColor Cyan

# Starter Plan
Write-Host "Creating Starter Plan..."
$starterProduct = stripe products create `
  --name="Starter Plan" `
  --description="Plano inicial para advogados iniciantes. 1 nicho, 3 produtos, 100 leads/mes." `
  --metadata[plan_id]="starter" `
  --metadata[tier]="basic" `
  --metadata[max_products]="3" `
  --metadata[max_leads]="100" `
  --metadata[max_conversations]="500" `
  --metadata[max_emails_per_month]="1000" `
  --output=json | ConvertFrom-Json

$starterProductId = $starterProduct.id
Write-Host "SUCCESS: Starter Product created: $starterProductId" -ForegroundColor Green

# Pro Plan
Write-Host "Creating Pro Plan..."
$proProduct = stripe products create `
  --name="Pro Plan" `
  --description="Plano profissional para advogados estabelecidos. 3 nichos, 10 produtos, 500 leads/mes." `
  --metadata[plan_id]="pro" `
  --metadata[tier]="professional" `
  --metadata[max_products]="10" `
  --metadata[max_leads]="500" `
  --metadata[max_conversations]="2000" `
  --metadata[max_emails_per_month]="5000" `
  --output=json | ConvertFrom-Json

$proProductId = $proProduct.id
Write-Host "SUCCESS: Pro Product created: $proProductId" -ForegroundColor Green

# Enterprise Plan
Write-Host "Creating Enterprise Plan..."
$enterpriseProduct = stripe products create `
  --name="Enterprise Plan" `
  --description="Plano enterprise para escritorios grandes. Nichos ilimitados, produtos ilimitados, leads ilimitados." `
  --metadata[plan_id]="enterprise" `
  --metadata[tier]="enterprise" `
  --metadata[max_products]="null" `
  --metadata[max_leads]="null" `
  --metadata[max_conversations]="null" `
  --metadata[max_emails_per_month]="null" `
  --output=json | ConvertFrom-Json

$enterpriseProductId = $enterpriseProduct.id
Write-Host "SUCCESS: Enterprise Product created: $enterpriseProductId" -ForegroundColor Green

# Addon: Nicho Extra
Write-Host "Creating Addon: Nicho Extra..."
$addonNicho = stripe products create `
  --name="Addon: Nicho Extra" `
  --description="Adiciona 1 nicho adicional ao seu plano atual." `
  --metadata[addon_type]="nicho" `
  --metadata[adds_products]="1" `
  --output=json | ConvertFrom-Json

$addonNichoId = $addonNicho.id
Write-Host "SUCCESS: Addon Nicho Extra created: $addonNichoId" -ForegroundColor Green

# Addon: Catalogo Premium
Write-Host "Creating Addon: Catalogo Premium..."
$addonCatalogo = stripe products create `
  --name="Addon: Catalogo Premium" `
  --description="47 nichos juridicos pre-configurados com IA especializada." `
  --metadata[addon_type]="catalogo" `
  --metadata[includes_niches]="47" `
  --output=json | ConvertFrom-Json

$addonCatalogoId = $addonCatalogo.id
Write-Host "SUCCESS: Addon Catalogo Premium created: $addonCatalogoId" -ForegroundColor Green

Write-Host ""
Write-Host "Creating prices..." -ForegroundColor Cyan

# ============================================
# 2. CREATE PRICES (MONTHLY)
# ============================================

# Starter - Monthly (R$ 297/month)
Write-Host "Creating Starter Monthly price..."
$starterMonthly = stripe prices create `
  --product="$starterProductId" `
  --currency=brl `
  --unit-amount=29700 `
  --recurring[interval]=month `
  --nickname="Starter Mensal" `
  --metadata[billing_cycle]="monthly" `
  --output=json | ConvertFrom-Json

$starterMonthlyId = $starterMonthly.id
Write-Host "SUCCESS: Starter Monthly: $starterMonthlyId (R$ 297/month)" -ForegroundColor Green

# Pro - Monthly (R$ 697/month)
Write-Host "Creating Pro Monthly price..."
$proMonthly = stripe prices create `
  --product="$proProductId" `
  --currency=brl `
  --unit-amount=69700 `
  --recurring[interval]=month `
  --nickname="Pro Mensal" `
  --metadata[billing_cycle]="monthly" `
  --output=json | ConvertFrom-Json

$proMonthlyId = $proMonthly.id
Write-Host "SUCCESS: Pro Monthly: $proMonthlyId (R$ 697/month)" -ForegroundColor Green

# Enterprise - Monthly (R$ 1,997/month)
Write-Host "Creating Enterprise Monthly price..."
$enterpriseMonthly = stripe prices create `
  --product="$enterpriseProductId" `
  --currency=brl `
  --unit-amount=199700 `
  --recurring[interval]=month `
  --nickname="Enterprise Mensal" `
  --metadata[billing_cycle]="monthly" `
  --output=json | ConvertFrom-Json

$enterpriseMonthlyId = $enterpriseMonthly.id
Write-Host "SUCCESS: Enterprise Monthly: $enterpriseMonthlyId (R$ 1,997/month)" -ForegroundColor Green

# ============================================
# 3. CREATE PRICES (YEARLY - 20% DISCOUNT)
# ============================================

# Starter - Yearly (R$ 2,970/year)
Write-Host "Creating Starter Yearly price..."
$starterYearly = stripe prices create `
  --product="$starterProductId" `
  --currency=brl `
  --unit-amount=297000 `
  --recurring[interval]=year `
  --nickname="Starter Anual" `
  --metadata[billing_cycle]="yearly" `
  --metadata[discount_percent]="20" `
  --output=json | ConvertFrom-Json

$starterYearlyId = $starterYearly.id
Write-Host "SUCCESS: Starter Yearly: $starterYearlyId (R$ 2,970/year - 20% off)" -ForegroundColor Green

# Pro - Yearly (R$ 6,970/year)
Write-Host "Creating Pro Yearly price..."
$proYearly = stripe prices create `
  --product="$proProductId" `
  --currency=brl `
  --unit-amount=697000 `
  --recurring[interval]=year `
  --nickname="Pro Anual" `
  --metadata[billing_cycle]="yearly" `
  --metadata[discount_percent]="20" `
  --output=json | ConvertFrom-Json

$proYearlyId = $proYearly.id
Write-Host "SUCCESS: Pro Yearly: $proYearlyId (R$ 6,970/year - 20% off)" -ForegroundColor Green

# Enterprise - Yearly (R$ 19,970/year)
Write-Host "Creating Enterprise Yearly price..."
$enterpriseYearly = stripe prices create `
  --product="$enterpriseProductId" `
  --currency=brl `
  --unit-amount=1997000 `
  --recurring[interval]=year `
  --nickname="Enterprise Anual" `
  --metadata[billing_cycle]="yearly" `
  --metadata[discount_percent]="20" `
  --output=json | ConvertFrom-Json

$enterpriseYearlyId = $enterpriseYearly.id
Write-Host "SUCCESS: Enterprise Yearly: $enterpriseYearlyId (R$ 19,970/year - 20% off)" -ForegroundColor Green

# ============================================
# 4. CREATE ADDON PRICES
# ============================================

# Addon Nicho Extra (R$ 97/month)
Write-Host "Creating Nicho Extra price..."
$addonNichoPrice = stripe prices create `
  --product="$addonNichoId" `
  --currency=brl `
  --unit-amount=9700 `
  --recurring[interval]=month `
  --nickname="Nicho Extra Mensal" `
  --output=json | ConvertFrom-Json

$addonNichoPriceId = $addonNichoPrice.id
Write-Host "SUCCESS: Nicho Extra: $addonNichoPriceId (R$ 97/month)" -ForegroundColor Green

# Addon Catalogo Premium (R$ 197/month)
Write-Host "Creating Catalogo Premium price..."
$addonCatalogoPrice = stripe prices create `
  --product="$addonCatalogoId" `
  --currency=brl `
  --unit-amount=19700 `
  --recurring[interval]=month `
  --nickname="Catalogo Premium Mensal" `
  --output=json | ConvertFrom-Json

$addonCatalogoPriceId = $addonCatalogoPrice.id
Write-Host "SUCCESS: Catalogo Premium: $addonCatalogoPriceId (R$ 197/month)" -ForegroundColor Green

# ============================================
# 5. GENERATE .env FILE
# ============================================

Write-Host ""
Write-Host "Generating .env.stripe.local file..." -ForegroundColor Cyan

$envContent = @"
# ============================================
# STRIPE PRODUCTS & PRICES
# Generated: $(Get-Date -Format "yyyy-MM-dd HH:mm:ss")
# ============================================

# PRODUCTS
STRIPE_PRODUCT_STARTER=$starterProductId
STRIPE_PRODUCT_PRO=$proProductId
STRIPE_PRODUCT_ENTERPRISE=$enterpriseProductId
STRIPE_PRODUCT_ADDON_NICHO=$addonNichoId
STRIPE_PRODUCT_ADDON_CATALOGO=$addonCatalogoId

# MONTHLY PRICES
NEXT_PUBLIC_STRIPE_PRICE_STARTER_MONTHLY=$starterMonthlyId
NEXT_PUBLIC_STRIPE_PRICE_PRO_MONTHLY=$proMonthlyId
NEXT_PUBLIC_STRIPE_PRICE_ENTERPRISE_MONTHLY=$enterpriseMonthlyId

# YEARLY PRICES (20% discount)
NEXT_PUBLIC_STRIPE_PRICE_STARTER_YEARLY=$starterYearlyId
NEXT_PUBLIC_STRIPE_PRICE_PRO_YEARLY=$proYearlyId
NEXT_PUBLIC_STRIPE_PRICE_ENTERPRISE_YEARLY=$enterpriseYearlyId

# ADDON PRICES
NEXT_PUBLIC_STRIPE_PRICE_ADDON_NICHO=$addonNichoPriceId
NEXT_PUBLIC_STRIPE_PRICE_ADDON_CATALOGO=$addonCatalogoPriceId

# ============================================
# USAGE:
# 1. Copy these variables to your .env or .env.local file
# 2. Or run: type .env.stripe.local >> .env.local
# ============================================
"@

$envContent | Out-File -FilePath ".env.stripe.local" -Encoding UTF8

Write-Host "SUCCESS: .env.stripe.local created!" -ForegroundColor Green

# ============================================
# 6. SUMMARY
# ============================================

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "STRIPE SETUP COMPLETED SUCCESSFULLY!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "PRODUCTS CREATED (5):" -ForegroundColor Cyan
Write-Host "  1. Starter Plan: $starterProductId"
Write-Host "  2. Pro Plan: $proProductId"
Write-Host "  3. Enterprise Plan: $enterpriseProductId"
Write-Host "  4. Addon Nicho Extra: $addonNichoId"
Write-Host "  5. Addon Catalogo Premium: $addonCatalogoId"
Write-Host ""
Write-Host "PRICES CREATED (10):" -ForegroundColor Cyan
Write-Host "  Monthly:"
Write-Host "    - Starter: $starterMonthlyId (R$ 297/month)"
Write-Host "    - Pro: $proMonthlyId (R$ 697/month)"
Write-Host "    - Enterprise: $enterpriseMonthlyId (R$ 1,997/month)"
Write-Host "  Yearly (20% off):"
Write-Host "    - Starter: $starterYearlyId (R$ 2,970/year)"
Write-Host "    - Pro: $proYearlyId (R$ 6,970/year)"
Write-Host "    - Enterprise: $enterpriseYearlyId (R$ 19,970/year)"
Write-Host "  Addons:"
Write-Host "    - Nicho Extra: $addonNichoPriceId (R$ 97/month)"
Write-Host "    - Catalogo Premium: $addonCatalogoPriceId (R$ 197/month)"
Write-Host ""
Write-Host "NEXT STEPS:" -ForegroundColor Yellow
Write-Host "  1. Review .env.stripe.local file"
Write-Host "  2. Copy variables to .env.local: type .env.stripe.local >> .env.local"
Write-Host "  3. Configure webhook: stripe listen --forward-to localhost:3000/api/stripe/webhook"
Write-Host "  4. Test checkout at http://localhost:3000/app/checkout"
Write-Host ""
Write-Host "For production setup, run: stripe login --live" -ForegroundColor Yellow
Write-Host ""
