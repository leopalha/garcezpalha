#!/usr/bin/env node
/**
 * Apply database migrations to Supabase
 * Usage: node apply-migrations-simple.js
 */

const fs = require('fs');
const path = require('path');

// Read .env.local manually
function loadEnv() {
  const envPath = path.join(__dirname, '.env.local');
  const env = {};

  if (fs.existsSync(envPath)) {
    const content = fs.readFileSync(envPath, 'utf8');
    content.split('\n').forEach(line => {
      const match = line.match(/^([^=]+)=(.+)$/);
      if (match) {
        env[match[1].trim()] = match[2].trim();
      }
    });
  }

  return env;
}

const env = loadEnv();
const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials in .env.local');
  process.exit(1);
}

const projectRef = supabaseUrl.match(/https:\/\/([^.]+)/)?.[1];

console.log('🚀 Supabase Migration Instructions\n');
console.log('='.repeat(70));
console.log(`\n📍 Project: ${projectRef}`);
console.log(`📍 Database: ${supabaseUrl}\n`);

const migrationsDir = path.join(__dirname, 'supabase', 'migrations');
const migrations = [
  '016_qualified_leads.sql',
  '017_follow_up_tasks.sql'
];

console.log('📋 Migrations to apply:\n');

migrations.forEach((migration, index) => {
  const filePath = path.join(migrationsDir, migration);
  if (fs.existsSync(filePath)) {
    const sql = fs.readFileSync(filePath, 'utf8');
    const lines = sql.split('\n').length;
    const size = (sql.length / 1024).toFixed(2);
    console.log(`   ${index + 1}. ${migration}`);
    console.log(`      - Lines: ${lines}`);
    console.log(`      - Size: ${size} KB`);
    console.log(`      - Path: ${filePath}\n`);
  }
});

console.log('='.repeat(70));
console.log('\n🔧 How to apply these migrations:\n');

console.log('METHOD 1: Supabase Dashboard (Recommended)');
console.log('-'.repeat(70));
console.log(`1. Open: https://supabase.com/dashboard/project/${projectRef}/sql/new`);
console.log('2. For each migration file:');
migrations.forEach((m, i) => {
  console.log(`   ${i + 1}. Copy content from: supabase/migrations/${m}`);
  console.log(`      Paste into SQL Editor and click "Run"`);
});

console.log('\n\nMETHOD 2: Supabase CLI');
console.log('-'.repeat(70));
console.log('1. Install CLI: npm install -g supabase');
console.log('2. Login: supabase login');
console.log(`3. Link project: supabase link --project-ref ${projectRef}`);
console.log('4. Push migrations: supabase db push');

console.log('\n\nMETHOD 3: Direct PostgreSQL Connection');
console.log('-'.repeat(70));
console.log('1. Get connection string from Supabase Dashboard > Settings > Database');
console.log('2. Run: psql "postgresql://postgres:[PASSWORD]@db.*.supabase.co:5432/postgres"');
migrations.forEach((m, i) => {
  console.log(`${i + 1}. Execute: \\i supabase/migrations/${m}`);
});

console.log('\n' + '='.repeat(70));
console.log('\n📄 Migration Files Preview:\n');

migrations.forEach((migration, index) => {
  const filePath = path.join(migrationsDir, migration);
  if (fs.existsSync(filePath)) {
    console.log(`\n${'='.repeat(70)}`);
    console.log(`📄 ${migration}`);
    console.log('='.repeat(70));

    const sql = fs.readFileSync(filePath, 'utf8');
    const preview = sql.split('\n').slice(0, 20).join('\n');
    console.log(preview);

    const totalLines = sql.split('\n').length;
    if (totalLines > 20) {
      console.log(`\n... (${totalLines - 20} more lines) ...`);
    }
  }
});

console.log('\n\n' + '='.repeat(70));
console.log('✅ Review complete!');
console.log('='.repeat(70));
console.log('\n💡 Choose METHOD 1 for easiest application (copy/paste in browser)');
console.log('💡 Or use METHOD 2 if you have Supabase CLI installed\n');
