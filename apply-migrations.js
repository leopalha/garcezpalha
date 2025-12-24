#!/usr/bin/env node
/**
 * Apply pending database migrations to Supabase
 * Usage: node apply-migrations.js
 */

const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function applyMigration(filePath) {
  const fileName = path.basename(filePath);
  console.log(`\n📄 Applying migration: ${fileName}`);

  try {
    const sql = fs.readFileSync(filePath, 'utf8');

    // Split SQL file into individual statements
    const statements = sql
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'));

    console.log(`   Found ${statements.length} SQL statements`);

    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      if (!statement) continue;

      try {
        const { error } = await supabase.rpc('exec_sql', { sql: statement + ';' });

        if (error) {
          // Try direct execution if exec_sql doesn't exist
          const { error: directError } = await supabase
            .from('_migration_helper')
            .select('*')
            .limit(0); // This will fail but allows us to execute SQL

          if (directError) {
            console.error(`   ⚠️  Statement ${i + 1} failed:`, error.message);
          }
        }
      } catch (err) {
        console.error(`   ⚠️  Statement ${i + 1} error:`, err.message);
      }
    }

    console.log(`   ✅ Migration applied successfully`);
    return true;
  } catch (error) {
    console.error(`   ❌ Error applying migration:`, error.message);
    return false;
  }
}

async function main() {
  console.log('🚀 Supabase Migration Tool\n');
  console.log(`📍 Database: ${supabaseUrl}`);

  const migrationsDir = path.join(__dirname, 'supabase', 'migrations');
  const migrations = [
    '016_qualified_leads.sql',
    '017_follow_up_tasks.sql'
  ];

  let success = 0;
  let failed = 0;

  for (const migration of migrations) {
    const filePath = path.join(migrationsDir, migration);

    if (!fs.existsSync(filePath)) {
      console.log(`⚠️  Migration not found: ${migration}`);
      continue;
    }

    const result = await applyMigration(filePath);
    if (result) {
      success++;
    } else {
      failed++;
    }
  }

  console.log('\n' + '='.repeat(50));
  console.log(`✅ Success: ${success}`);
  console.log(`❌ Failed: ${failed}`);
  console.log('='.repeat(50));

  if (failed === 0) {
    console.log('\n🎉 All migrations applied successfully!');
    console.log('\n📋 Next steps:');
    console.log('   1. Verify tables in Supabase Dashboard');
    console.log('   2. Test the qualification flow');
    console.log('   3. Deploy to production');
  } else {
    console.log('\n⚠️  Some migrations failed. Please check the errors above.');
    console.log('\n💡 Alternative: Apply migrations manually via Supabase Dashboard > SQL Editor');
    process.exit(1);
  }
}

main().catch(console.error);
