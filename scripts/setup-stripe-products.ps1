# Script de configuração automática de produtos Stripe
# Para Garcez Palha - Plataforma SaaS B2B
# PowerShell version

Write-Host "🚀 Configurando produtos e preços no Stripe..." -ForegroundColor Blue
Write-Host ""

# ============================================
# 1. CRIAR PRODUTOS
# ============================================

Write-Host "📦 Criando produtos..." -ForegroundColor Cyan

# Produto: Starter Plan
$starterProduct = stripe products create `
  --name="Starter Plan" `
  --description="Plano inicial para advogados iniciantes. 1 nicho, 3 produtos, 100 leads/mês." `
  --metadata[plan_id]="starter" `
  --metadata[tier]="basic" `
  --metadata[max_products]="3" `
  --metadata[max_leads]="100" `
  --metadata[max_conversations]="500" `
  --metadata[max_emails_per_month]="1000" `
  --output=json | ConvertFrom-Json

$starterProductId = $starterProduct.id
Write-Host "✅ Starter Product criado: $starterProductId" -ForegroundColor Green

# Produto: Pro Plan
$proProduct = stripe products create `
  --name="Pro Plan" `
  --description="Plano profissional para advogados em crescimento. 3 nichos, 10 produtos, 500 leads/mês." `
  --metadata[plan_id]="pro" `
  --metadata[tier]="professional" `
  --metadata[max_products]="10" `
  --metadata[max_leads]="500" `
  --metadata[max_conversations]="2000" `
  --metadata[max_emails_per_month]="5000" `
  --output=json | ConvertFrom-Json

$proProductId = $proProduct.id
Write-Host "✅ Pro Product criado: $proProductId" -ForegroundColor Green

# Produto: Enterprise Plan
$enterpriseProduct = stripe products create `
  --name="Enterprise Plan" `
  --description="Plano enterprise para escritórios. Nichos ilimitados, produtos ilimitados, leads ilimitados." `
  --metadata[plan_id]="enterprise" `
  --metadata[tier]="enterprise" `
  --metadata[max_products]="null" `
  --metadata[max_leads]="null" `
  --metadata[max_conversations]="null" `
  --metadata[max_emails_per_month]="null" `
  --output=json | ConvertFrom-Json

$enterpriseProductId = $enterpriseProduct.id
Write-Host "✅ Enterprise Product criado: $enterpriseProductId" -ForegroundColor Green

# Produto: Addon - Nicho Extra
$addonNicho = stripe products create `
  --name="Nicho Extra" `
  --description="Adicione mais um nicho ao seu plano (até 3 nichos adicionais)" `
  --metadata[addon_type]="nicho" `
  --metadata[is_addon]="true" `
  --output=json | ConvertFrom-Json

$addonNichoId = $addonNicho.id
Write-Host "✅ Addon Nicho Extra criado: $addonNichoId" -ForegroundColor Green

# Produto: Addon - Catálogo Premium
$addonCatalogo = stripe products create `
  --name="Catálogo Premium" `
  --description="Acesso ao catálogo completo de 47 nichos jurídicos pré-configurados" `
  --metadata[addon_type]="catalogo" `
  --metadata[is_addon]="true" `
  --output=json | ConvertFrom-Json

$addonCatalogoId = $addonCatalogo.id
Write-Host "✅ Addon Catálogo Premium criado: $addonCatalogoId" -ForegroundColor Green

Write-Host ""
Write-Host "💰 Criando preços..." -ForegroundColor Cyan

# ============================================
# 2. CRIAR PREÇOS (MENSAIS)
# ============================================

# Starter - Mensal (R$ 297/mês)
$starterMonthly = stripe prices create `
  --product="$starterProductId" `
  --currency=brl `
  --unit-amount=29700 `
  --recurring[interval]=month `
  --nickname="Starter Mensal" `
  --metadata[billing_cycle]="monthly" `
  --output=json | ConvertFrom-Json

$starterMonthlyId = $starterMonthly.id
Write-Host "✅ Starter Mensal criado: $starterMonthlyId (R$ 297/mês)" -ForegroundColor Green

# Pro - Mensal (R$ 697/mês)
$proMonthly = stripe prices create `
  --product="$proProductId" `
  --currency=brl `
  --unit-amount=69700 `
  --recurring[interval]=month `
  --nickname="Pro Mensal" `
  --metadata[billing_cycle]="monthly" `
  --output=json | ConvertFrom-Json

$proMonthlyId = $proMonthly.id
Write-Host "✅ Pro Mensal criado: $proMonthlyId (R$ 697/mês)" -ForegroundColor Green

# Enterprise - Mensal (R$ 1.997/mês)
$enterpriseMonthly = stripe prices create `
  --product="$enterpriseProductId" `
  --currency=brl `
  --unit-amount=199700 `
  --recurring[interval]=month `
  --nickname="Enterprise Mensal" `
  --metadata[billing_cycle]="monthly" `
  --output=json | ConvertFrom-Json

$enterpriseMonthlyId = $enterpriseMonthly.id
Write-Host "✅ Enterprise Mensal criado: $enterpriseMonthlyId (R$ 1.997/mês)" -ForegroundColor Green

# ============================================
# 3. CRIAR PREÇOS (ANUAIS) - 20% desconto
# ============================================

# Starter - Anual (R$ 2.970/ano)
$starterYearly = stripe prices create `
  --product="$starterProductId" `
  --currency=brl `
  --unit-amount=297000 `
  --recurring[interval]=year `
  --nickname="Starter Anual (20% off)" `
  --metadata[billing_cycle]="yearly" `
  --output=json | ConvertFrom-Json

$starterYearlyId = $starterYearly.id
Write-Host "✅ Starter Anual criado: $starterYearlyId (R$ 2.970/ano)" -ForegroundColor Green

# Pro - Anual (R$ 6.970/ano)
$proYearly = stripe prices create `
  --product="$proProductId" `
  --currency=brl `
  --unit-amount=697000 `
  --recurring[interval]=year `
  --nickname="Pro Anual (20% off)" `
  --metadata[billing_cycle]="yearly" `
  --output=json | ConvertFrom-Json

$proYearlyId = $proYearly.id
Write-Host "✅ Pro Anual criado: $proYearlyId (R$ 6.970/ano)" -ForegroundColor Green

# Enterprise - Anual (R$ 19.970/ano)
$enterpriseYearly = stripe prices create `
  --product="$enterpriseProductId" `
  --currency=brl `
  --unit-amount=1997000 `
  --recurring[interval]=year `
  --nickname="Enterprise Anual (20% off)" `
  --metadata[billing_cycle]="yearly" `
  --output=json | ConvertFrom-Json

$enterpriseYearlyId = $enterpriseYearly.id
Write-Host "✅ Enterprise Anual criado: $enterpriseYearlyId (R$ 19.970/ano)" -ForegroundColor Green

# ============================================
# 4. CRIAR PREÇOS DE ADDONS
# ============================================

# Addon Nicho Extra - Mensal (R$ 97/mês)
$addonNichoMonthly = stripe prices create `
  --product="$addonNichoId" `
  --currency=brl `
  --unit-amount=9700 `
  --recurring[interval]=month `
  --nickname="Nicho Extra Mensal" `
  --output=json | ConvertFrom-Json

$addonNichoMonthlyId = $addonNichoMonthly.id
Write-Host "✅ Addon Nicho Extra criado: $addonNichoMonthlyId (R$ 97/mês)" -ForegroundColor Green

# Addon Catálogo Premium - Mensal (R$ 197/mês)
$addonCatalogoMonthly = stripe prices create `
  --product="$addonCatalogoId" `
  --currency=brl `
  --unit-amount=19700 `
  --recurring[interval]=month `
  --nickname="Catálogo Premium Mensal" `
  --output=json | ConvertFrom-Json

$addonCatalogoMonthlyId = $addonCatalogoMonthly.id
Write-Host "✅ Addon Catálogo Premium criado: $addonCatalogoMonthlyId (R$ 197/mês)" -ForegroundColor Green

# ============================================
# 5. GERAR ARQUIVO .env COM OS IDs
# ============================================

Write-Host ""
Write-Host "📝 Gerando variáveis de ambiente..." -ForegroundColor Yellow

$envContent = @"
# ============================================
# STRIPE PRODUCTS & PRICES
# Gerado automaticamente em $(Get-Date -Format "yyyy-MM-dd HH:mm:ss")
# ============================================

# Products
STRIPE_PRODUCT_STARTER=$starterProductId
STRIPE_PRODUCT_PRO=$proProductId
STRIPE_PRODUCT_ENTERPRISE=$enterpriseProductId
STRIPE_PRODUCT_ADDON_NICHO=$addonNichoId
STRIPE_PRODUCT_ADDON_CATALOGO=$addonCatalogoId

# Prices - Monthly
NEXT_PUBLIC_STRIPE_PRICE_STARTER_MONTHLY=$starterMonthlyId
NEXT_PUBLIC_STRIPE_PRICE_PRO_MONTHLY=$proMonthlyId
NEXT_PUBLIC_STRIPE_PRICE_ENTERPRISE_MONTHLY=$enterpriseMonthlyId

# Prices - Yearly
NEXT_PUBLIC_STRIPE_PRICE_STARTER_YEARLY=$starterYearlyId
NEXT_PUBLIC_STRIPE_PRICE_PRO_YEARLY=$proYearlyId
NEXT_PUBLIC_STRIPE_PRICE_ENTERPRISE_YEARLY=$enterpriseYearlyId

# Addons
NEXT_PUBLIC_STRIPE_PRICE_ADDON_NICHO=$addonNichoMonthlyId
NEXT_PUBLIC_STRIPE_PRICE_ADDON_CATALOGO=$addonCatalogoMonthlyId
"@

$envContent | Out-File -FilePath ".env.stripe.local" -Encoding UTF8

Write-Host "✅ Arquivo .env.stripe.local criado!" -ForegroundColor Green
Write-Host ""
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "🎉 CONFIGURAÇÃO CONCLUÍDA COM SUCESSO!" -ForegroundColor Green
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "📋 Resumo dos produtos criados:" -ForegroundColor White
Write-Host ""
Write-Host "PLANOS:" -ForegroundColor Yellow
Write-Host "  • Starter:    $starterProductId"
Write-Host "  • Pro:        $proProductId"
Write-Host "  • Enterprise: $enterpriseProductId"
Write-Host ""
Write-Host "ADDONS:" -ForegroundColor Yellow
Write-Host "  • Nicho Extra:       $addonNichoId"
Write-Host "  • Catálogo Premium:  $addonCatalogoId"
Write-Host ""
Write-Host "📄 Copie as variáveis de .env.stripe.local para seu arquivo .env" -ForegroundColor Cyan
Write-Host ""
Write-Host "🔗 Próximos passos:" -ForegroundColor Yellow
Write-Host "  1. Copiar variáveis para .env"
Write-Host "  2. Configurar webhook: stripe listen --forward-to localhost:3000/api/stripe/webhook"
Write-Host "  3. Testar checkout em http://localhost:3000/app/checkout"
Write-Host ""
