#!/usr/bin/env node
/**
 * Apply database migrations to Supabase via SQL endpoint
 * Usage: node apply-migrations-http.js
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials in .env.local');
  process.exit(1);
}

// Extract project ref from URL
const projectRef = supabaseUrl.match(/https:\/\/([^.]+)/)?.[1];

function executeSQL(sql) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: `${projectRef}.supabase.co`,
      port: 443,
      path: '/rest/v1/rpc/exec_sql',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
        'Prefer': 'return=minimal'
      }
    };

    const req = https.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve({ success: true, data });
        } else {
          resolve({ success: false, error: data, statusCode: res.statusCode });
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.write(JSON.stringify({ query: sql }));
    req.end();
  });
}

async function applyMigration(filePath) {
  const fileName = path.basename(filePath);
  console.log(`\n📄 Processing: ${fileName}`);

  try {
    const sql = fs.readFileSync(filePath, 'utf8');
    console.log(`   Size: ${(sql.length / 1024).toFixed(2)} KB`);

    // Try to execute the entire file at once
    const result = await executeSQL(sql);

    if (result.success) {
      console.log(`   ✅ Applied successfully`);
      return true;
    } else {
      console.error(`   ❌ Failed (HTTP ${result.statusCode})`);
      console.error(`   Error:`, result.error);
      return false;
    }
  } catch (error) {
    console.error(`   ❌ Error:`, error.message);
    return false;
  }
}

async function main() {
  console.log('🚀 Supabase Migration Tool (HTTP Method)\n');
  console.log(`📍 Project: ${projectRef}`);
  console.log(`📍 Database: ${supabaseUrl}\n`);

  const migrationsDir = path.join(__dirname, 'supabase', 'migrations');
  const migrations = [
    '016_qualified_leads.sql',
    '017_follow_up_tasks.sql'
  ];

  console.log('⚠️  NOTE: Supabase may not support direct SQL execution via REST API.');
  console.log('    If this fails, please use one of these methods:\n');
  console.log('    1. Supabase Dashboard > SQL Editor');
  console.log('    2. supabase db push (after supabase login)');
  console.log('    3. Direct psql connection\n');
  console.log('='.repeat(60));

  let success = 0;
  let failed = 0;

  for (const migration of migrations) {
    const filePath = path.join(migrationsDir, migration);

    if (!fs.existsSync(filePath)) {
      console.log(`⚠️  Not found: ${migration}`);
      continue;
    }

    const result = await applyMigration(filePath);
    if (result) {
      success++;
    } else {
      failed++;
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log(`✅ Success: ${success}`);
  console.log(`❌ Failed: ${failed}`);
  console.log('='.repeat(60));

  if (failed > 0) {
    console.log('\n📋 Manual Migration Steps:');
    console.log('\n1. Go to: https://supabase.com/dashboard/project/' + projectRef + '/sql/new');
    console.log('2. Copy and paste the content of each migration file:');
    migrations.forEach(m => {
      console.log(`   - supabase/migrations/${m}`);
    });
    console.log('3. Click "Run" for each migration');
    console.log('\n💡 Alternative: Install and use Supabase CLI');
    console.log('   npm install -g supabase');
    console.log('   supabase login');
    console.log('   supabase link --project-ref ' + projectRef);
    console.log('   supabase db push');
  } else if (success > 0) {
    console.log('\n🎉 All migrations applied successfully!');
  }
}

main().catch(console.error);
