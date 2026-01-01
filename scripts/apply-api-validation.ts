#!/usr/bin/env ts-node
/**
 * API Validation Migration Script
 * P1-011: Apply validation to all 150+ API routes
 *
 * This script analyzes all API routes and generates a report of which
 * routes need validation, rate limiting, and security hardening.
 */

import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs'
import { join, relative } from 'path'

interface APIRoute {
  path: string
  relativePath: string
  methods: string[]
  hasValidation: boolean
  hasRateLimit: boolean
  hasSanitize: boolean
  hasAuth: boolean
  category: string
  priority: 'critical' | 'high' | 'medium' | 'low'
}

// Categories and their priorities
const categoryPriority: Record<string, APIRoute['priority']> = {
  'auth': 'critical',
  'stripe': 'critical',
  'payment': 'critical',
  'mercadopago': 'critical',
  'clicksign': 'critical',
  'admin/settings': 'high',
  'admin/users': 'high',
  'admin/security': 'high',
  'admin/conversations': 'high',
  'chat': 'high',
  'ai': 'high',
  'leads': 'medium',
  'admin/leads': 'medium',
  'admin/analytics': 'medium',
  'analytics': 'low',
  'app': 'low',
}

function getAllAPIRoutes(dir: string, baseDir: string = dir): APIRoute[] {
  const routes: APIRoute[] = []
  const files = readdirSync(dir)

  for (const file of files) {
    const filePath = join(dir, file)
    const stat = statSync(filePath)

    if (stat.isDirectory()) {
      routes.push(...getAllAPIRoutes(filePath, baseDir))
    } else if (file === 'route.ts') {
      const content = readFileSync(filePath, 'utf-8')
      const relativePath = relative(baseDir, filePath)

      // Detect HTTP methods
      const methods: string[] = []
      if (/export\s+(const|async\s+function)\s+GET/.test(content)) methods.push('GET')
      if (/export\s+(const|async\s+function)\s+POST/.test(content)) methods.push('POST')
      if (/export\s+(const|async\s+function)\s+PUT/.test(content)) methods.push('PUT')
      if (/export\s+(const|async\s+function)\s+PATCH/.test(content)) methods.push('PATCH')
      if (/export\s+(const|async\s+function)\s+DELETE/.test(content)) methods.push('DELETE')

      // Detect security features
      const hasValidation = /withValidation/.test(content)
      const hasRateLimit = /withRateLimit/.test(content)
      const hasSanitize = /sanitize(Html|Text|Object)/.test(content)
      const hasAuth = /auth\.(getUser|getSession)/.test(content)

      // Determine category and priority
      let category = 'other'
      let priority: APIRoute['priority'] = 'low'

      for (const [cat, pri] of Object.entries(categoryPriority)) {
        if (relativePath.includes(cat)) {
          category = cat
          priority = pri
          break
        }
      }

      routes.push({
        path: filePath,
        relativePath,
        methods,
        hasValidation,
        hasRateLimit,
        hasSanitize,
        hasAuth,
        category,
        priority,
      })
    }
  }

  return routes
}

function generateReport(routes: APIRoute[]): string {
  const stats = {
    total: routes.length,
    withValidation: routes.filter((r) => r.hasValidation).length,
    withRateLimit: routes.filter((r) => r.hasRateLimit).length,
    withSanitize: routes.filter((r) => r.hasSanitize).length,
    withAuth: routes.filter((r) => r.hasAuth).length,
    critical: routes.filter((r) => r.priority === 'critical').length,
    high: routes.filter((r) => r.priority === 'high').length,
    medium: routes.filter((r) => r.priority === 'medium').length,
    low: routes.filter((r) => r.priority === 'low').length,
  }

  const needsWork = routes.filter(
    (r) =>
      !r.hasValidation || !r.hasRateLimit || (r.methods.some((m) => m !== 'GET') && !r.hasSanitize)
  )

  let report = `# API Security Audit Report
Generated: ${new Date().toISOString()}

## Summary
- **Total API Routes**: ${stats.total}
- **With Validation**: ${stats.withValidation} (${((stats.withValidation / stats.total) * 100).toFixed(1)}%)
- **With Rate Limiting**: ${stats.withRateLimit} (${((stats.withRateLimit / stats.total) * 100).toFixed(1)}%)
- **With Sanitization**: ${stats.withSanitize} (${((stats.withSanitize / stats.total) * 100).toFixed(1)}%)
- **With Auth Check**: ${stats.withAuth} (${((stats.withAuth / stats.total) * 100).toFixed(1)}%)

## Priority Distribution
- **Critical**: ${stats.critical} routes (payments, auth)
- **High**: ${stats.high} routes (admin, chat, AI)
- **Medium**: ${stats.medium} routes (leads, analytics)
- **Low**: ${stats.low} routes (read-only, public)

## Routes Needing Work
${needsWork.length} routes need security improvements:

`

  const priorities: APIRoute['priority'][] = ['critical', 'high', 'medium', 'low']
  for (const priority of priorities) {
    const routesInPriority = needsWork.filter((r) => r.priority === priority)
    if (routesInPriority.length === 0) continue

    report += `### ${priority.toUpperCase()} Priority (${routesInPriority.length} routes)\n\n`

    for (const route of routesInPriority) {
      const missing: string[] = []
      if (!route.hasValidation) missing.push('validation')
      if (!route.hasRateLimit) missing.push('rate limiting')
      if (route.methods.some((m) => m !== 'GET') && !route.hasSanitize) missing.push('sanitization')

      report += `- **${route.relativePath}**\n`
      report += `  - Methods: ${route.methods.join(', ')}\n`
      report += `  - Missing: ${missing.join(', ')}\n`
      report += `  - Has Auth: ${route.hasAuth ? 'Yes' : 'No'}\n\n`
    }
  }

  report += `## Fully Protected Routes (${routes.length - needsWork.length})\n\n`
  const fullyProtected = routes.filter((r) => !needsWork.includes(r))
  for (const route of fullyProtected) {
    report += `- ${route.relativePath} (${route.methods.join(', ')})\n`
  }

  return report
}

function generateMigrationTasks(routes: APIRoute[]): string {
  const needsWork = routes.filter(
    (r) =>
      !r.hasValidation || !r.hasRateLimit || (r.methods.some((m) => m !== 'GET') && !r.hasSanitize)
  )

  let tasks = `# API Security Migration Tasks

## Phase 1: Critical Routes (${needsWork.filter((r) => r.priority === 'critical').length} routes)
Must be completed immediately - handles payments and authentication.

`

  const critical = needsWork.filter((r) => r.priority === 'critical')
  for (const route of critical) {
    tasks += `- [ ] ${route.relativePath}\n`
  }

  tasks += `\n## Phase 2: High Priority (${needsWork.filter((r) => r.priority === 'high').length} routes)
Admin functions, chat, and AI endpoints.

`

  const high = needsWork.filter((r) => r.priority === 'high')
  for (const route of high) {
    tasks += `- [ ] ${route.relativePath}\n`
  }

  tasks += `\n## Phase 3: Medium Priority (${needsWork.filter((r) => r.priority === 'medium').length} routes)
CRM, leads, and analytics.

`

  const medium = needsWork.filter((r) => r.priority === 'medium')
  for (const route of medium) {
    tasks += `- [ ] ${route.relativePath}\n`
  }

  tasks += `\n## Phase 4: Low Priority (${needsWork.filter((r) => r.priority === 'low').length} routes)
Read-only and public endpoints.

`

  const low = needsWork.filter((r) => r.priority === 'low')
  for (const route of low) {
    tasks += `- [ ] ${route.relativePath}\n`
  }

  return tasks
}

// Main execution
const apiDir = join(process.cwd(), 'src/app/api')
const routes = getAllAPIRoutes(apiDir)

// Generate reports
const report = generateReport(routes)
const tasks = generateMigrationTasks(routes)

// Write reports
writeFileSync('reports/api-security-audit.md', report)
writeFileSync('reports/api-migration-tasks.md', tasks)

console.log('✅ API Security Audit Complete!')
console.log(`📊 Report saved to: reports/api-security-audit.md`)
console.log(`📋 Tasks saved to: reports/api-migration-tasks.md`)
console.log(`\n📈 Summary:`)
console.log(`   Total Routes: ${routes.length}`)
console.log(
  `   Need Work: ${routes.filter((r) => !r.hasValidation || !r.hasRateLimit).length}`
)
console.log(`   Fully Protected: ${routes.filter((r) => r.hasValidation && r.hasRateLimit).length}`)
