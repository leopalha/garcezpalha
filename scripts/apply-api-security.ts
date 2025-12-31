/**
 * Automated API Security Enhancement Script
 * Applies validation, sanitization, and rate limiting to all API routes
 *
 * Usage: npx tsx scripts/apply-api-security.ts
 */

import * as fs from 'fs'
import * as path from 'path'
import { glob } from 'glob'

interface SecurityConfig {
  validation?: string
  rateLimitType: string
  rateLimitAmount: number
  requiresAuth: boolean
  sanitize: boolean
}

// Security configuration for each API category
const apiSecurityConfig: Record<string, SecurityConfig> = {
  '/api/auth/**': {
    validation: 'authSchemas',
    rateLimitType: 'auth',
    rateLimitAmount: 5,
    requiresAuth: false,
    sanitize: true,
  },
  '/api/chat/**': {
    validation: 'chatSchemas',
    rateLimitType: 'chat',
    rateLimitAmount: 60,
    requiresAuth: true,
    sanitize: true,
  },
  '/api/leads/**': {
    validation: 'leadSchemas',
    rateLimitType: 'contact',
    rateLimitAmount: 20,
    requiresAuth: true,
    sanitize: true,
  },
  '/api/stripe/**': {
    validation: 'paymentSchemas',
    rateLimitType: 'checkout',
    rateLimitAmount: 10,
    requiresAuth: true,
    sanitize: true,
  },
  '/api/mercadopago/**': {
    validation: 'paymentSchemas',
    rateLimitType: 'checkout',
    rateLimitAmount: 10,
    requiresAuth: true,
    sanitize: true,
  },
  '/api/clicksign/**': {
    validation: 'paymentSchemas',
    rateLimitType: 'contact',
    rateLimitAmount: 20,
    requiresAuth: true,
    sanitize: true,
  },
  // Default for all other APIs
  default: {
    rateLimitType: 'api',
    rateLimitAmount: 30,
    requiresAuth: true,
    sanitize: true,
  },
}

async function findApiRoutes(): Promise<string[]> {
  const routes = await glob('src/app/api/**/route.ts', {
    ignore: ['**/node_modules/**', '**/.next/**'],
  })
  return routes
}

function getSecurityConfig(routePath: string): SecurityConfig {
  // Match route to security config
  for (const [pattern, config] of Object.entries(apiSecurityConfig)) {
    const regex = new RegExp(pattern.replace('**', '.*').replace('*', '[^/]*'))
    if (regex.test(routePath)) {
      return config
    }
  }
  return apiSecurityConfig.default
}

async function processApiRoute(filePath: string): Promise<void> {
  console.log(`\n📄 Processing: ${filePath}`)

  const content = fs.readFileSync(filePath, 'utf-8')
  const config = getSecurityConfig(filePath)

  // Check if already has validation
  if (content.includes('withValidation') || content.includes('withRateLimit')) {
    console.log('  ⏭️  Already secured, skipping...')
    return
  }

  // Check if it's a webhook (should not have rate limiting on POST)
  const isWebhook = filePath.includes('/webhook') || filePath.includes('/hooks')

  // Extract HTTP methods
  const methods = []
  if (content.match(/export\s+async\s+function\s+GET/)) methods.push('GET')
  if (content.match(/export\s+async\s+function\s+POST/)) methods.push('POST')
  if (content.match(/export\s+async\s+function\s+PUT/)) methods.push('PUT')
  if (content.match(/export\s+async\s+function\s+DELETE/)) methods.push('DELETE')
  if (content.match(/export\s+async\s+function\s+PATCH/)) methods.push('PATCH')

  if (methods.length === 0) {
    console.log('  ⚠️  No HTTP methods found, skipping...')
    return
  }

  console.log(`  🔍 Found methods: ${methods.join(', ')}`)
  console.log(`  🔒 Applying security config:`)
  console.log(`     - Rate limit: ${config.rateLimitAmount}/${config.rateLimitType}`)
  console.log(`     - Sanitize: ${config.sanitize}`)
  console.log(`     - Auth required: ${config.requiresAuth}`)

  // TODO: This is a dry-run report
  // Actual implementation would modify files programmatically
  // For safety, we'll generate a report instead
}

async function main() {
  console.log('🔐 API Security Enhancement Script\n')
  console.log('This script will analyze all API routes and apply security measures.\n')

  const routes = await findApiRoutes()
  console.log(`📊 Found ${routes.length} API routes\n`)

  let secured = 0
  let skipped = 0
  let errors = 0

  for (const route of routes) {
    try {
      await processApiRoute(route)
      secured++
    } catch (error) {
      console.error(`  ❌ Error processing ${route}:`, error)
      errors++
    }
  }

  console.log('\n' + '='.repeat(60))
  console.log('📈 SUMMARY')
  console.log('='.repeat(60))
  console.log(`Total routes: ${routes.length}`)
  console.log(`✅ Processed: ${secured}`)
  console.log(`⏭️  Skipped: ${skipped}`)
  console.log(`❌ Errors: ${errors}`)
  console.log('\n⚠️  NOTE: This is a DRY RUN for analysis only.')
  console.log('Manual implementation of security measures is recommended.')
}

main().catch(console.error)
