#!/usr/bin/env ts-node
/**
 * Automated Backup Script for Garcez Palha
 *
 * This script creates backups of:
 * - Database (Supabase)
 * - Environment configuration
 * - Important application files
 *
 * Usage:
 *   npx ts-node scripts/backup.ts
 *   npm run backup
 */

import { execSync } from 'child_process'
import * as fs from 'fs'
import * as path from 'path'

interface BackupConfig {
  outputDir: string
  timestamp: string
  supabaseProjectRef: string
  includeEnv: boolean
  compressionLevel: number
}

interface BackupResult {
  success: boolean
  files: string[]
  errors: string[]
  totalSize: number
  duration: number
}

const DEFAULT_CONFIG: BackupConfig = {
  outputDir: './backups',
  timestamp: new Date().toISOString().replace(/[:.]/g, '-'),
  supabaseProjectRef: process.env.SUPABASE_PROJECT_REF || '',
  includeEnv: true,
  compressionLevel: 9,
}

class BackupManager {
  private config: BackupConfig
  private backupDir: string
  private result: BackupResult

  constructor(config: Partial<BackupConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config }
    this.backupDir = path.join(this.config.outputDir, `backup-${this.config.timestamp}`)
    this.result = {
      success: true,
      files: [],
      errors: [],
      totalSize: 0,
      duration: 0,
    }
  }

  async run(): Promise<BackupResult> {
    const startTime = Date.now()
    console.log('🚀 Starting backup process...')
    console.log(`📁 Backup directory: ${this.backupDir}`)

    try {
      // Create backup directory
      this.createBackupDirectory()

      // Backup different components
      await this.backupDatabase()
      this.backupConfiguration()
      this.backupImportantFiles()
      this.createManifest()

      // Calculate total size
      this.result.totalSize = this.calculateDirectorySize(this.backupDir)

      console.log('✅ Backup completed successfully!')
    } catch (error) {
      this.result.success = false
      this.result.errors.push(`Critical error: ${error}`)
      console.error('❌ Backup failed:', error)
    }

    this.result.duration = Date.now() - startTime
    this.printSummary()

    return this.result
  }

  private createBackupDirectory(): void {
    if (!fs.existsSync(this.config.outputDir)) {
      fs.mkdirSync(this.config.outputDir, { recursive: true })
    }
    fs.mkdirSync(this.backupDir, { recursive: true })
    console.log('📂 Created backup directory')
  }

  private async backupDatabase(): Promise<void> {
    console.log('💾 Backing up database...')

    try {
      if (!this.config.supabaseProjectRef) {
        console.log('⚠️  Supabase project ref not configured, creating schema backup only')

        // Copy migration files as reference
        const migrationsDir = path.join(this.backupDir, 'migrations')
        fs.mkdirSync(migrationsDir, { recursive: true })

        const sourceMigrations = './supabase/migrations'
        if (fs.existsSync(sourceMigrations)) {
          const files = fs.readdirSync(sourceMigrations)
          files.forEach((file) => {
            const src = path.join(sourceMigrations, file)
            const dest = path.join(migrationsDir, file)
            fs.copyFileSync(src, dest)
            this.result.files.push(dest)
          })
          console.log(`   Copied ${files.length} migration files`)
        }
        return
      }

      // If Supabase CLI is available, create full database dump
      const dbBackupFile = path.join(this.backupDir, 'database.sql')

      try {
        execSync(`supabase db dump -f ${dbBackupFile}`, {
          cwd: process.cwd(),
          stdio: 'pipe',
        })
        this.result.files.push(dbBackupFile)
        console.log('   Database dump created')
      } catch {
        console.log('   Supabase CLI not available, skipping full DB dump')
        this.result.errors.push('Supabase CLI not available for database dump')
      }
    } catch (error) {
      this.result.errors.push(`Database backup error: ${error}`)
      console.error('   ❌ Database backup failed:', error)
    }
  }

  private backupConfiguration(): void {
    console.log('⚙️  Backing up configuration...')

    const configDir = path.join(this.backupDir, 'config')
    fs.mkdirSync(configDir, { recursive: true })

    // Files to backup
    const configFiles = [
      'package.json',
      'package-lock.json',
      'next.config.js',
      'tsconfig.json',
      'tailwind.config.ts',
      'postcss.config.mjs',
      '.eslintrc.json',
      '.prettierrc',
    ]

    configFiles.forEach((file) => {
      const src = path.join(process.cwd(), file)
      if (fs.existsSync(src)) {
        const dest = path.join(configDir, file)
        fs.copyFileSync(src, dest)
        this.result.files.push(dest)
      }
    })

    // Backup environment template (NOT actual .env file for security)
    if (this.config.includeEnv && fs.existsSync('.env.local.example')) {
      const envBackup = path.join(configDir, 'env-template.txt')
      fs.copyFileSync('.env.local.example', envBackup)
      this.result.files.push(envBackup)
    }

    // Create environment variables reference
    const envRef = path.join(configDir, 'env-reference.md')
    const envRefContent = `# Environment Variables Reference
Generated: ${new Date().toISOString()}

## Required Variables
- NEXT_PUBLIC_SUPABASE_URL
- NEXT_PUBLIC_SUPABASE_ANON_KEY
- SUPABASE_SERVICE_ROLE_KEY
- NEXTAUTH_URL
- NEXTAUTH_SECRET
- DATABASE_URL

## Optional Variables
- OPENAI_API_KEY
- STRIPE_SECRET_KEY
- STRIPE_PUBLISHABLE_KEY
- MERCADOPAGO_ACCESS_TOKEN
- RESEND_API_KEY
- NEXT_PUBLIC_GA4_ID

Note: Actual values are NOT included in this backup for security.
`
    fs.writeFileSync(envRef, envRefContent)
    this.result.files.push(envRef)

    console.log(`   Backed up ${configFiles.filter((f) => fs.existsSync(f)).length} config files`)
  }

  private backupImportantFiles(): void {
    console.log('📄 Backing up important files...')

    const filesDir = path.join(this.backupDir, 'docs')
    fs.mkdirSync(filesDir, { recursive: true })

    // Documentation files
    const docFiles = [
      'README.md',
      'PRD.md',
      'FLOWCHART.md',
      'CHANGELOG.md',
      'DEPLOYMENT.md',
      'PRODUCTION_CHECKLIST.md',
      'tasks.md',
      'CURRENT_STATUS.md',
    ]

    docFiles.forEach((file) => {
      const src = path.join(process.cwd(), file)
      if (fs.existsSync(src)) {
        const dest = path.join(filesDir, file)
        fs.copyFileSync(src, dest)
        this.result.files.push(dest)
      }
    })

    console.log(`   Backed up ${docFiles.filter((f) => fs.existsSync(f)).length} documentation files`)
  }

  private createManifest(): void {
    console.log('📋 Creating backup manifest...')

    const manifest = {
      version: '1.0.0',
      timestamp: this.config.timestamp,
      project: 'Garcez Palha Platform',
      nodeVersion: process.version,
      platform: process.platform,
      files: this.result.files.map((f) => ({
        path: path.relative(this.backupDir, f),
        size: fs.statSync(f).size,
      })),
      errors: this.result.errors,
      gitInfo: this.getGitInfo(),
    }

    const manifestPath = path.join(this.backupDir, 'manifest.json')
    fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2))
    this.result.files.push(manifestPath)

    console.log('   Manifest created')
  }

  private getGitInfo(): Record<string, string> {
    try {
      const branch = execSync('git rev-parse --abbrev-ref HEAD', { encoding: 'utf-8' }).trim()
      const commit = execSync('git rev-parse HEAD', { encoding: 'utf-8' }).trim()
      const commitDate = execSync('git log -1 --format=%cd', { encoding: 'utf-8' }).trim()

      return {
        branch,
        commit,
        commitDate,
      }
    } catch {
      return {
        branch: 'unknown',
        commit: 'unknown',
        commitDate: 'unknown',
      }
    }
  }

  private calculateDirectorySize(dir: string): number {
    let size = 0

    const items = fs.readdirSync(dir)
    items.forEach((item) => {
      const itemPath = path.join(dir, item)
      const stats = fs.statSync(itemPath)

      if (stats.isDirectory()) {
        size += this.calculateDirectorySize(itemPath)
      } else {
        size += stats.size
      }
    })

    return size
  }

  private formatBytes(bytes: number): string {
    const units = ['B', 'KB', 'MB', 'GB']
    let unitIndex = 0

    while (bytes >= 1024 && unitIndex < units.length - 1) {
      bytes /= 1024
      unitIndex++
    }

    return `${bytes.toFixed(2)} ${units[unitIndex]}`
  }

  private printSummary(): void {
    console.log('\n' + '='.repeat(50))
    console.log('📊 BACKUP SUMMARY')
    console.log('='.repeat(50))
    console.log(`Status: ${this.result.success ? '✅ Success' : '❌ Failed'}`)
    console.log(`Files backed up: ${this.result.files.length}`)
    console.log(`Total size: ${this.formatBytes(this.result.totalSize)}`)
    console.log(`Duration: ${(this.result.duration / 1000).toFixed(2)}s`)
    console.log(`Location: ${this.backupDir}`)

    if (this.result.errors.length > 0) {
      console.log('\n⚠️  Errors:')
      this.result.errors.forEach((err) => console.log(`   - ${err}`))
    }

    console.log('='.repeat(50) + '\n')
  }
}

// Cleanup old backups
function cleanupOldBackups(outputDir: string, keepCount: number = 10): void {
  console.log('🧹 Cleaning up old backups...')

  if (!fs.existsSync(outputDir)) {
    return
  }

  const backups = fs
    .readdirSync(outputDir)
    .filter((f) => f.startsWith('backup-'))
    .map((f) => ({
      name: f,
      path: path.join(outputDir, f),
      time: fs.statSync(path.join(outputDir, f)).mtime.getTime(),
    }))
    .sort((a, b) => b.time - a.time)

  if (backups.length > keepCount) {
    const toDelete = backups.slice(keepCount)
    toDelete.forEach((backup) => {
      fs.rmSync(backup.path, { recursive: true, force: true })
      console.log(`   Deleted: ${backup.name}`)
    })
    console.log(`   Removed ${toDelete.length} old backup(s)`)
  } else {
    console.log('   No old backups to remove')
  }
}

// Main execution
async function main() {
  console.log('🔐 Garcez Palha Backup Tool')
  console.log('============================\n')

  const backupManager = new BackupManager()
  const result = await backupManager.run()

  // Cleanup old backups (keep last 10)
  cleanupOldBackups('./backups', 10)

  // Exit with appropriate code
  process.exit(result.success ? 0 : 1)
}

main().catch((error) => {
  console.error('Fatal error:', error)
  process.exit(1)
})
