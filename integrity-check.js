#!/usr/bin/env node
/**
 * System integrity check - validates data consistency and configuration
 * Usage: node integrity-check.js
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 System Integrity Check\n');
console.log('='.repeat(70));

const issues = [];
const warnings = [];
const passed = [];

// 1. Check critical files exist
console.log('\n1️⃣  Critical Files\n');

const criticalFiles = [
  'package.json',
  'tsconfig.json',
  'next.config.js',
  'vercel.json',
  '.env.local',
  'src/lib/ai/qualification/index.ts',
  'src/lib/automation/follow-up-automation.ts',
  'src/app/(admin)/admin/leads/qualificados/page.tsx',
  'src/app/api/admin/leads/qualified/route.ts',
];

criticalFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`   ✅ ${file}`);
    passed.push(`File: ${file}`);
  } else {
    console.log(`   ❌ ${file} - MISSING`);
    issues.push(`Missing critical file: ${file}`);
  }
});

// 2. Check migrations consistency
console.log('\n2️⃣  Database Migrations\n');

const migrationsDir = path.join(__dirname, 'supabase', 'migrations');
if (fs.existsSync(migrationsDir)) {
  const migrations = fs.readdirSync(migrationsDir)
    .filter(f => f.endsWith('.sql'))
    .filter(f => !f.includes('APPLY_ALL'))
    .sort();

  // Check for duplicates
  const migrationNumbers = migrations
    .filter(m => /^\d{3}_/.test(m))
    .map(m => m.substring(0, 3));

  const duplicates = migrationNumbers.filter((num, idx) =>
    migrationNumbers.indexOf(num) !== idx
  );

  if (duplicates.length > 0) {
    console.log(`   ⚠️  Duplicate migration numbers found: ${duplicates.join(', ')}`);
    warnings.push(`Duplicate migrations: ${duplicates.join(', ')}`);
  } else {
    console.log(`   ✅ No duplicate migration numbers`);
    passed.push('Migrations: No duplicates');
  }

  // Check for qualified_leads and follow_up_tasks migrations
  const hasQualifiedLeads = migrations.some(m =>
    m.includes('qualified_leads') || m.includes('016_')
  );
  const hasFollowUpTasks = migrations.some(m =>
    m.includes('follow_up_tasks') || m.includes('017_')
  );

  if (hasQualifiedLeads) {
    console.log(`   ✅ qualified_leads migration found`);
    passed.push('Migration: qualified_leads');
  } else {
    console.log(`   ❌ qualified_leads migration missing`);
    issues.push('Missing qualified_leads migration');
  }

  if (hasFollowUpTasks) {
    console.log(`   ✅ follow_up_tasks migration found`);
    passed.push('Migration: follow_up_tasks');
  } else {
    console.log(`   ❌ follow_up_tasks migration missing`);
    issues.push('Missing follow_up_tasks migration');
  }

  console.log(`\n   Total migrations: ${migrations.length}`);
}

// 3. Check TypeScript configuration
console.log('\n3️⃣  TypeScript Configuration\n');

const tsconfigPath = 'tsconfig.json';
if (fs.existsSync(tsconfigPath)) {
  const tsconfig = JSON.parse(fs.readFileSync(tsconfigPath, 'utf8'));

  if (tsconfig.compilerOptions) {
    const strict = tsconfig.compilerOptions.strict;
    const skipLibCheck = tsconfig.compilerOptions.skipLibCheck;

    if (strict) {
      console.log(`   ✅ Strict mode enabled`);
      passed.push('TypeScript: Strict mode');
    } else {
      console.log(`   ⚠️  Strict mode disabled`);
      warnings.push('TypeScript strict mode disabled');
    }

    if (skipLibCheck) {
      console.log(`   ✅ skipLibCheck enabled (performance)`);
      passed.push('TypeScript: skipLibCheck');
    }

    const pathMappings = tsconfig.compilerOptions.paths || {};
    const hasAliases = Object.keys(pathMappings).length > 0;

    if (hasAliases) {
      console.log(`   ✅ Path aliases configured (${Object.keys(pathMappings).length})`);
      passed.push('TypeScript: Path aliases');
    }
  }
}

// 4. Check package.json dependencies
console.log('\n4️⃣  Dependencies\n');

const packagePath = 'package.json';
if (fs.existsSync(packagePath)) {
  const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));

  const criticalDeps = [
    'next',
    'react',
    '@supabase/supabase-js',
    'next-auth',
  ];

  criticalDeps.forEach(dep => {
    if (packageJson.dependencies && packageJson.dependencies[dep]) {
      console.log(`   ✅ ${dep}: ${packageJson.dependencies[dep]}`);
      passed.push(`Dependency: ${dep}`);
    } else if (packageJson.devDependencies && packageJson.devDependencies[dep]) {
      console.log(`   ⚠️  ${dep} in devDependencies (should be in dependencies)`);
      warnings.push(`${dep} in devDependencies`);
    } else {
      console.log(`   ❌ ${dep} - MISSING`);
      issues.push(`Missing dependency: ${dep}`);
    }
  });
}

// 5. Check Vercel configuration
console.log('\n5️⃣  Vercel Configuration\n');

const vercelConfigPath = 'vercel.json';
if (fs.existsSync(vercelConfigPath)) {
  const vercelConfig = JSON.parse(fs.readFileSync(vercelConfigPath, 'utf8'));

  if (vercelConfig.crons) {
    const cronCount = vercelConfig.crons.length;

    if (cronCount > 2) {
      console.log(`   ⚠️  ${cronCount} cron jobs (Hobby plan limit: 2)`);
      warnings.push(`Too many cron jobs for Hobby plan: ${cronCount}`);
    } else {
      console.log(`   ✅ ${cronCount} cron jobs (within Hobby limit)`);
      passed.push(`Cron jobs: ${cronCount}/2`);
    }

    // Check cron schedules are daily (Hobby requirement)
    vercelConfig.crons.forEach((cron, i) => {
      const isDailyOrLess = /^(\d+|\*) (\d+|\*) \* \* \*$/.test(cron.schedule)
        && !/\*\//.test(cron.schedule); // No */N patterns

      if (isDailyOrLess) {
        console.log(`   ✅ Cron ${i+1}: ${cron.schedule} (daily schedule)`);
        passed.push(`Cron ${i+1}: Daily schedule`);
      } else {
        console.log(`   ⚠️  Cron ${i+1}: ${cron.schedule} (may not work on Hobby)`);
        warnings.push(`Cron ${i+1} schedule may exceed Hobby limits`);
      }
    });
  } else {
    console.log(`   ⚠️  No cron jobs configured`);
    warnings.push('No cron jobs in vercel.json');
  }
}

// 6. Check documentation completeness
console.log('\n6️⃣  Documentation\n');

const docsToCheck = [
  'README_VALIDATION.md',
  'FINAL_REPORT.md',
  'EXECUTIVE_SUMMARY.md',
  'PRODUCTION_VALIDATION.md',
  'SESSION_COMPLETE.md',
];

docsToCheck.forEach(doc => {
  if (fs.existsSync(doc)) {
    const content = fs.readFileSync(doc, 'utf8');
    const lines = content.split('\n').length;
    console.log(`   ✅ ${doc} (${lines} lines)`);
    passed.push(`Doc: ${doc}`);
  } else {
    console.log(`   ⚠️  ${doc} - missing`);
    warnings.push(`Missing documentation: ${doc}`);
  }
});

// 7. Check monitoring scripts
console.log('\n7️⃣  Monitoring Scripts\n');

const scripts = [
  'health-check.js',
  'verify-database.js',
  'test-production-apis.js',
  'deployment-check.js',
];

scripts.forEach(script => {
  if (fs.existsSync(script)) {
    console.log(`   ✅ ${script}`);
    passed.push(`Script: ${script}`);
  } else {
    console.log(`   ❌ ${script} - MISSING`);
    issues.push(`Missing script: ${script}`);
  }
});

// Summary
console.log('\n' + '='.repeat(70));
console.log('\n📊 Integrity Check Summary\n');

console.log(`   ✅ Passed:   ${passed.length}`);
console.log(`   ⚠️  Warnings: ${warnings.length}`);
console.log(`   ❌ Issues:   ${issues.length}`);

const totalChecks = passed.length + warnings.length + issues.length;
const percentage = Math.round((passed.length / totalChecks) * 100);

console.log(`\n   Score: ${passed.length}/${totalChecks} (${percentage}%)`);

if (warnings.length > 0) {
  console.log('\n⚠️  Warnings:\n');
  warnings.forEach((w, i) => {
    console.log(`   ${i + 1}. ${w}`);
  });
}

if (issues.length > 0) {
  console.log('\n❌ Issues:\n');
  issues.forEach((iss, i) => {
    console.log(`   ${i + 1}. ${iss}`);
  });
}

console.log('\n' + '='.repeat(70));

if (percentage === 100) {
  console.log('\n🎉 Perfect! All integrity checks passed.\n');
  process.exit(0);
} else if (percentage >= 90) {
  console.log('\n✅ Good! System integrity is solid.\n');
  process.exit(0);
} else if (percentage >= 70) {
  console.log('\n⚠️  Fair. Review warnings and fix issues.\n');
  process.exit(1);
} else {
  console.log('\n❌ Critical issues found. Fix before proceeding.\n');
  process.exit(1);
}
