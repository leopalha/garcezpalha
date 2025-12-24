#!/usr/bin/env node
/**
 * Pre-deployment validation checklist
 * Run this before deploying to production
 * Usage: node deployment-check.js
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Pre-Deployment Validation Checklist\n');
console.log('='.repeat(70));

const checks = [];

// 1. Check Git Status
console.log('\n1️⃣  Git Status\n');
try {
  const gitStatus = execSync('git status --porcelain', { encoding: 'utf8' });
  if (gitStatus.trim() === '') {
    console.log('   ✅ Working tree is clean');
    checks.push({ name: 'Git Status', passed: true });
  } else {
    console.log('   ⚠️  Uncommitted changes found:');
    console.log(gitStatus.split('\n').slice(0, 5).map(l => '      ' + l).join('\n'));
    checks.push({ name: 'Git Status', passed: false });
  }
} catch (error) {
  console.log('   ❌ Error checking git status');
  checks.push({ name: 'Git Status', passed: false });
}

// 2. Check TypeScript
console.log('\n2️⃣  TypeScript Compilation\n');
try {
  execSync('npx tsc --noEmit', { encoding: 'utf8', stdio: 'pipe' });
  console.log('   ✅ TypeScript compiled without errors');
  checks.push({ name: 'TypeScript', passed: true });
} catch (error) {
  console.log('   ❌ TypeScript compilation errors found');
  checks.push({ name: 'TypeScript', passed: false });
}

// 3. Check Tests
console.log('\n3️⃣  Unit Tests\n');
try {
  const testOutput = execSync('npm test -- --passWithNoTests', { encoding: 'utf8', stdio: 'pipe' });
  const passMatch = testOutput.match(/(\d+) passed/);
  if (passMatch) {
    console.log(`   ✅ ${passMatch[1]} tests passing`);
    checks.push({ name: 'Tests', passed: true });
  } else {
    console.log('   ✅ Tests passed');
    checks.push({ name: 'Tests', passed: true });
  }
} catch (error) {
  console.log('   ❌ Tests failed');
  checks.push({ name: 'Tests', passed: false });
}

// 4. Check Environment Variables
console.log('\n4️⃣  Environment Variables\n');
const envPath = path.join(__dirname, '.env.local');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  const requiredVars = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    'SUPABASE_SERVICE_ROLE_KEY',
    'NEXTAUTH_SECRET',
    'NEXTAUTH_URL',
  ];

  let allFound = true;
  requiredVars.forEach(varName => {
    if (envContent.includes(varName)) {
      console.log(`   ✅ ${varName}`);
    } else {
      console.log(`   ❌ ${varName} - MISSING`);
      allFound = false;
    }
  });

  checks.push({ name: 'Environment Variables', passed: allFound });
} else {
  console.log('   ❌ .env.local file not found');
  checks.push({ name: 'Environment Variables', passed: false });
}

// 5. Check Database Migrations
console.log('\n5️⃣  Database Migrations\n');
const migrationsDir = path.join(__dirname, 'supabase', 'migrations');
if (fs.existsSync(migrationsDir)) {
  const migrations = fs.readdirSync(migrationsDir)
    .filter(f => f.endsWith('.sql'))
    .filter(f => !f.includes('APPLY_ALL'));

  console.log(`   ✅ ${migrations.length} migration files found`);
  migrations.forEach(m => {
    console.log(`      - ${m}`);
  });
  checks.push({ name: 'Migrations', passed: true });
} else {
  console.log('   ⚠️  Migrations directory not found');
  checks.push({ name: 'Migrations', passed: false });
}

// 6. Check Vercel Configuration
console.log('\n6️⃣  Vercel Configuration\n');
const vercelConfigPath = path.join(__dirname, 'vercel.json');
if (fs.existsSync(vercelConfigPath)) {
  const vercelConfig = JSON.parse(fs.readFileSync(vercelConfigPath, 'utf8'));
  if (vercelConfig.crons) {
    console.log(`   ✅ ${vercelConfig.crons.length} cron jobs configured`);
    vercelConfig.crons.forEach((cron, i) => {
      console.log(`      ${i + 1}. ${cron.path} - ${cron.schedule}`);
    });
    checks.push({ name: 'Vercel Config', passed: true });
  } else {
    console.log('   ⚠️  No cron jobs configured');
    checks.push({ name: 'Vercel Config', passed: true });
  }
} else {
  console.log('   ⚠️  vercel.json not found');
  checks.push({ name: 'Vercel Config', passed: false });
}

// 7. Check Package.json Scripts
console.log('\n7️⃣  Package Scripts\n');
const packagePath = path.join(__dirname, 'package.json');
if (fs.existsSync(packagePath)) {
  const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
  const requiredScripts = ['dev', 'build', 'start', 'test'];

  let allScriptsFound = true;
  requiredScripts.forEach(script => {
    if (packageJson.scripts && packageJson.scripts[script]) {
      console.log(`   ✅ ${script}`);
    } else {
      console.log(`   ❌ ${script} - MISSING`);
      allScriptsFound = false;
    }
  });

  checks.push({ name: 'Package Scripts', passed: allScriptsFound });
} else {
  console.log('   ❌ package.json not found');
  checks.push({ name: 'Package Scripts', passed: false });
}

// Summary
console.log('\n' + '='.repeat(70));
console.log('\n📊 Validation Summary\n');

const passedChecks = checks.filter(c => c.passed).length;
const totalChecks = checks.length;
const percentage = Math.round((passedChecks / totalChecks) * 100);

checks.forEach(check => {
  console.log(`   ${check.passed ? '✅' : '❌'} ${check.name}`);
});

console.log(`\n   Score: ${passedChecks}/${totalChecks} (${percentage}%)`);

console.log('\n' + '='.repeat(70));

if (percentage === 100) {
  console.log('\n🎉 All checks passed! Ready for deployment.\n');
  console.log('Next steps:');
  console.log('   1. Commit any pending changes');
  console.log('   2. Push to repository: git push origin main');
  console.log('   3. Deploy: vercel --prod');
  console.log('   4. Verify: node health-check.js\n');
  process.exit(0);
} else if (percentage >= 70) {
  console.log('\n⚠️  Some checks failed. Review and fix before deploying.\n');
  process.exit(1);
} else {
  console.log('\n❌ Multiple checks failed. Fix issues before deploying.\n');
  process.exit(1);
}
