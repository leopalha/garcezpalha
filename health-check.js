#!/usr/bin/env node
/**
 * Comprehensive health check for Garcez Palha Lead Qualification System
 * Usage: node health-check.js
 */

const https = require('https');
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Load environment variables
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
const PRODUCTION_URL = 'https://garcezpalha-6yfwp8kna-leopalhas-projects.vercel.app';
const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = env.SUPABASE_SERVICE_ROLE_KEY;

function testEndpoint(path) {
  return new Promise((resolve) => {
    const url = new URL(path, PRODUCTION_URL);
    const options = {
      hostname: url.hostname,
      port: 443,
      path: url.pathname,
      method: 'GET',
    };

    const req = https.request(options, (res) => {
      resolve({ status: res.statusCode, ok: res.statusCode < 500 });
    });

    req.on('error', () => {
      resolve({ status: 0, ok: false });
    });

    req.setTimeout(10000, () => {
      req.destroy();
      resolve({ status: 0, ok: false });
    });

    req.end();
  });
}

async function runHealthCheck() {
  console.log('🏥 Garcez Palha - System Health Check\n');
  console.log('='.repeat(70));
  console.log(`📅 Date: ${new Date().toLocaleString('pt-BR')}\n`);

  const checks = {
    deployment: false,
    database: false,
    tables: false,
    apis: false,
    crons: false,
  };

  // 1. Check Deployment
  console.log('1️⃣  DEPLOYMENT STATUS\n');
  console.log(`   URL: ${PRODUCTION_URL}`);

  const deploymentTest = await testEndpoint('/');
  if (deploymentTest.ok) {
    console.log('   ✅ Site is live and responding');
    checks.deployment = true;
  } else {
    console.log('   ❌ Site is not responding');
  }

  // 2. Check Database Connection
  console.log('\n2️⃣  DATABASE CONNECTION\n');

  if (!supabaseUrl || !supabaseKey) {
    console.log('   ❌ Supabase credentials not found in .env.local');
  } else {
    console.log(`   URL: ${supabaseUrl}`);

    try {
      const supabase = createClient(supabaseUrl, supabaseKey);
      const { error } = await supabase.from('qualified_leads').select('id').limit(1);

      if (!error) {
        console.log('   ✅ Database connection successful');
        checks.database = true;
      } else {
        console.log(`   ❌ Database error: ${error.message}`);
      }
    } catch (err) {
      console.log(`   ❌ Connection error: ${err.message}`);
    }
  }

  // 3. Check Tables
  console.log('\n3️⃣  DATABASE TABLES\n');

  if (checks.database) {
    const supabase = createClient(supabaseUrl, supabaseKey);

    const tables = ['qualified_leads', 'follow_up_tasks'];
    let allTablesExist = true;

    for (const table of tables) {
      const { error } = await supabase.from(table).select('id').limit(1);
      if (!error) {
        console.log(`   ✅ ${table} - exists`);
      } else {
        console.log(`   ❌ ${table} - missing or error`);
        allTablesExist = false;
      }
    }

    checks.tables = allTablesExist;

    // Get record counts
    const { count: leadsCount } = await supabase
      .from('qualified_leads')
      .select('*', { count: 'exact', head: true });

    const { count: tasksCount } = await supabase
      .from('follow_up_tasks')
      .select('*', { count: 'exact', head: true });

    console.log(`\n   📊 Qualified Leads: ${leadsCount || 0}`);
    console.log(`   📊 Follow-up Tasks: ${tasksCount || 0}`);
  }

  // 4. Check API Protection
  console.log('\n4️⃣  API ENDPOINTS\n');

  const apis = [
    '/api/admin/leads/qualified',
    '/api/admin/analytics/leads',
    '/api/admin/follow-ups/process',
  ];

  let allApisProtected = true;
  for (const api of apis) {
    const result = await testEndpoint(api);
    if (result.status === 401) {
      console.log(`   ✅ ${api} - protected`);
    } else {
      console.log(`   ⚠️  ${api} - status ${result.status}`);
      allApisProtected = false;
    }
  }

  checks.apis = allApisProtected;

  // 5. Check Cron Configuration
  console.log('\n5️⃣  CRON JOBS\n');

  const cronConfig = JSON.parse(fs.readFileSync('vercel.json', 'utf8'));
  if (cronConfig.crons && cronConfig.crons.length > 0) {
    console.log(`   ✅ ${cronConfig.crons.length} cron jobs configured`);
    cronConfig.crons.forEach((cron, index) => {
      console.log(`\n   ${index + 1}. ${cron.path}`);
      console.log(`      Schedule: ${cron.schedule}`);

      // Parse schedule
      const parts = cron.schedule.split(' ');
      const hour = parts[1];
      const minute = parts[0];

      if (hour !== '*') {
        console.log(`      Next run: Daily at ${hour}:${minute.padStart(2, '0')}`);
      } else {
        console.log(`      Next run: Every hour at :${minute.padStart(2, '0')}`);
      }
    });
    checks.crons = true;
  } else {
    console.log('   ⚠️  No cron jobs configured');
  }

  // Summary
  console.log('\n' + '='.repeat(70));
  console.log('\n📊 HEALTH CHECK SUMMARY\n');

  const totalChecks = Object.keys(checks).length;
  const passedChecks = Object.values(checks).filter(Boolean).length;
  const healthPercentage = Math.round((passedChecks / totalChecks) * 100);

  console.log(`   Deployment:      ${checks.deployment ? '✅ OK' : '❌ FAIL'}`);
  console.log(`   Database:        ${checks.database ? '✅ OK' : '❌ FAIL'}`);
  console.log(`   Tables:          ${checks.tables ? '✅ OK' : '❌ FAIL'}`);
  console.log(`   APIs:            ${checks.apis ? '✅ OK' : '❌ FAIL'}`);
  console.log(`   Cron Jobs:       ${checks.crons ? '✅ OK' : '❌ FAIL'}`);

  console.log(`\n   Overall Health: ${healthPercentage}% (${passedChecks}/${totalChecks} checks passed)`);

  if (healthPercentage === 100) {
    console.log('\n   🎉 ALL SYSTEMS OPERATIONAL\n');
  } else if (healthPercentage >= 80) {
    console.log('\n   ⚠️  MINOR ISSUES DETECTED\n');
  } else {
    console.log('\n   ❌ CRITICAL ISSUES DETECTED\n');
  }

  console.log('='.repeat(70));

  // Next Actions
  console.log('\n📋 NEXT ACTIONS\n');

  if (checks.deployment && checks.database && checks.tables) {
    console.log('   ✅ System is ready for production use');
    console.log('\n   Recommended next steps:');
    console.log('   1. Test WhatsApp qualification flow');
    console.log('   2. Monitor cron job executions in Vercel Dashboard');
    console.log('   3. Check logs: vercel logs --follow');
    console.log('   4. Review PRODUCTION_VALIDATION.md checklist\n');
  } else {
    console.log('   ⚠️  System has issues that need attention\n');

    if (!checks.deployment) {
      console.log('   • Fix deployment issues in Vercel');
    }
    if (!checks.database) {
      console.log('   • Check Supabase credentials and connection');
    }
    if (!checks.tables) {
      console.log('   • Apply database migrations (see APPLY_MIGRATIONS_GUIDE.md)');
    }
    if (!checks.apis) {
      console.log('   • Review API authentication configuration');
    }
    if (!checks.crons) {
      console.log('   • Configure cron jobs in vercel.json');
    }
    console.log('');
  }

  console.log('='.repeat(70) + '\n');

  return healthPercentage;
}

runHealthCheck()
  .then((health) => {
    process.exit(health === 100 ? 0 : 1);
  })
  .catch((error) => {
    console.error('\n❌ Health check failed:', error.message);
    process.exit(1);
  });
