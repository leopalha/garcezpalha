#!/usr/bin/env node
/**
 * Verify Supabase database tables and schema
 * Usage: node verify-database.js
 */

const { createClient } = require('@supabase/supabase-js');
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

const supabase = createClient(supabaseUrl, supabaseKey);

async function verifyTables() {
  console.log('🔍 Verifying Supabase Database Schema\n');
  console.log('='.repeat(70));
  console.log(`📍 Database: ${supabaseUrl}\n`);

  try {
    // Check qualified_leads table
    console.log('📋 Checking qualified_leads table...');
    const { data: leads, error: leadsError } = await supabase
      .from('qualified_leads')
      .select('*')
      .limit(1);

    if (leadsError) {
      console.log('   ❌ Table does NOT exist or has issues');
      console.log(`   Error: ${leadsError.message}\n`);
    } else {
      console.log('   ✅ Table exists and is accessible');
      console.log(`   Current records: ${leads.length}\n`);
    }

    // Check follow_up_tasks table
    console.log('📋 Checking follow_up_tasks table...');
    const { data: tasks, error: tasksError } = await supabase
      .from('follow_up_tasks')
      .select('*')
      .limit(1);

    if (tasksError) {
      console.log('   ❌ Table does NOT exist or has issues');
      console.log(`   Error: ${tasksError.message}\n`);
    } else {
      console.log('   ✅ Table exists and is accessible');
      console.log(`   Current records: ${tasks.length}\n`);
    }

    // Get total counts
    console.log('='.repeat(70));
    console.log('📊 Database Statistics\n');

    const { count: totalLeads, error: countLeadsError } = await supabase
      .from('qualified_leads')
      .select('*', { count: 'exact', head: true });

    const { count: totalTasks, error: countTasksError } = await supabase
      .from('follow_up_tasks')
      .select('*', { count: 'exact', head: true });

    if (!countLeadsError) {
      console.log(`   Total qualified leads: ${totalLeads}`);
    }
    if (!countTasksError) {
      console.log(`   Total follow-up tasks: ${totalTasks}`);
    }

    // Check recent leads
    console.log('\n📅 Recent Activity\n');
    const { data: recentLeads, error: recentError } = await supabase
      .from('qualified_leads')
      .select('id, client_name, phone, product_name, category, score_total, created_at')
      .order('created_at', { ascending: false })
      .limit(5);

    if (!recentError && recentLeads && recentLeads.length > 0) {
      console.log('   Recent leads:');
      recentLeads.forEach((lead, index) => {
        console.log(`   ${index + 1}. ${lead.client_name || 'Unknown'} - ${lead.product_name}`);
        console.log(`      Category: ${lead.category} | Score: ${lead.score_total}`);
        console.log(`      Created: ${new Date(lead.created_at).toLocaleString()}`);
      });
    } else if (!recentError) {
      console.log('   No leads found yet. System is ready to receive leads.');
    }

    console.log('\n' + '='.repeat(70));
    console.log('✅ Database verification complete!\n');

  } catch (error) {
    console.error('❌ Error verifying database:', error.message);
    process.exit(1);
  }
}

verifyTables();
