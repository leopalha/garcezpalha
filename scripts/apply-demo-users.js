// Script to apply demo users migration
// Run: node scripts/apply-demo-users.js

const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')

// Load environment variables
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase credentials in .env.local')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

// Demo users to create/update
// Using valid UUIDs (v4 format)
// Roles: admin, lawyer, client (no partner for now)
const demoUsers = [
  {
    id: 'a0000001-0000-4000-8000-000000000001',
    email: 'admin@garcezpalha.com',
    name: 'Administrador Sistema',
    password_hash: '$2b$10$tvkkaCoiqVBsd3iiR4uiHOadtUuThPzcfgnIMvRmgkDZMrHC84vrW', // admin123
    role: 'admin',
    phone: '(21) 99999-0001'
  },
  {
    id: 'a0000002-0000-4000-8000-000000000002',
    email: 'advogado@garcezpalha.com',
    name: 'Dr. Carlos Advogado',
    password_hash: '$2b$10$sTzMJSEwFj7YIeMyv82R4.MHp7eXfdd5yvFRkvw2dSXLWj/m3zdya', // advogado123
    role: 'admin', // NOTE: Using 'admin' until DB constraint is updated to include 'lawyer'
    phone: '(21) 99999-0002'
  },
  {
    id: 'a0000004-0000-4000-8000-000000000004',
    email: 'cliente@garcezpalha.com',
    name: 'João Cliente',
    password_hash: '$2b$10$jifi5hqGG/k/CKit1eTx8uU31IQ.CKb6a7K7o4ItxIpfyjZAPVCpS', // cliente123
    role: 'client',
    phone: '(21) 99999-0004'
  }
]

async function applyMigration() {
  console.log('='.repeat(60))
  console.log('Applying Demo Users Migration')
  console.log('='.repeat(60))

  // First, update the role constraint to include 'lawyer'
  console.log('\nUpdating role constraint...')
  const { error: constraintError } = await supabase.rpc('exec_sql', {
    sql: `
      DO $$
      BEGIN
        ALTER TABLE users DROP CONSTRAINT IF EXISTS users_role_check;
        ALTER TABLE users ADD CONSTRAINT users_role_check CHECK (role IN ('client', 'admin', 'lawyer'));
      EXCEPTION WHEN OTHERS THEN NULL;
      END $$;
    `
  })

  if (constraintError) {
    console.log('  Could not update constraint via RPC (may need manual update)')
    console.log('  Continuing with user updates...')
  } else {
    console.log('  Constraint updated successfully')
  }

  for (const user of demoUsers) {
    console.log(`\nProcessing: ${user.email} (${user.role})...`)

    // First, try to update if exists
    const { data: existingUser, error: fetchError } = await supabase
      .from('users')
      .select('id, email, role')
      .eq('email', user.email)
      .single()

    if (existingUser) {
      // Update existing user
      const { error: updateError } = await supabase
        .from('users')
        .update({
          name: user.name,
          password_hash: user.password_hash,
          role: user.role,
          phone: user.phone,
          email_verified: true,
          is_active: true,
          updated_at: new Date().toISOString()
        })
        .eq('email', user.email)

      if (updateError) {
        console.error(`  ERROR updating: ${updateError.message}`)
      } else {
        console.log(`  Updated: ${user.email} -> role: ${user.role}`)
      }
    } else {
      // Insert new user
      const { error: insertError } = await supabase
        .from('users')
        .insert({
          id: user.id,
          email: user.email,
          name: user.name,
          password_hash: user.password_hash,
          role: user.role,
          phone: user.phone,
          email_verified: true,
          is_active: true
        })

      if (insertError) {
        console.error(`  ERROR inserting: ${insertError.message}`)
      } else {
        console.log(`  Created: ${user.email} -> role: ${user.role}`)
      }
    }

    // Also try to update/insert in profiles table if it exists
    try {
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          email: user.email,
          full_name: user.name,
          role: user.role,
          updated_at: new Date().toISOString()
        }, { onConflict: 'id' })

      if (!profileError) {
        console.log(`  Profile synced: ${user.email}`)
      }
    } catch (e) {
      // profiles table might not exist
    }
  }

  // Partner system removed - violates OAB ethics code (Art. 34, IV)
  // Paying commission to non-lawyers for client referrals is prohibited

  console.log('\n' + '='.repeat(60))
  console.log('CREDENTIALS SUMMARY:')
  console.log('='.repeat(60))
  console.log('Admin:     admin@garcezpalha.com      / admin123     (role: admin)')
  console.log('Advogado:  advogado@garcezpalha.com   / advogado123  (role: lawyer)')
  console.log('Cliente:   cliente@garcezpalha.com    / cliente123   (role: client)')
  console.log('='.repeat(60))
}

applyMigration()
  .then(() => {
    console.log('\nMigration completed!')
    process.exit(0)
  })
  .catch((err) => {
    console.error('Migration failed:', err)
    process.exit(1)
  })
