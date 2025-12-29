/**
 * Password Hashing Migration Script
 * Hashes all legacy passwords in the users table
 *
 * Run with: npx ts-node scripts/hash-passwords.ts
 */

import bcrypt from 'bcryptjs'
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import path from 'path'

// Load environment variables
dotenv.config({ path: path.join(__dirname, '..', '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials in .env.local')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

/**
 * Legacy passwords that need to be migrated
 */
const LEGACY_PASSWORDS = [
  'admin123',
  'advogado123',
  'parceiro123',
  'cliente123'
]

async function hashPasswords() {
  console.log('🔐 Starting password hashing migration...\n')

  try {
    // Fetch all users
    const { data: users, error } = await supabase
      .from('users')
      .select('id, email, name, role')

    if (error) {
      throw error
    }

    if (!users || users.length === 0) {
      console.log('ℹ️  No users found in database')
      return
    }

    console.log(`Found ${users.length} users\n`)

    // Hash passwords based on role
    const SALT_ROUNDS = 10
    const hashedPasswords: Record<string, string> = {}

    for (const password of LEGACY_PASSWORDS) {
      hashedPasswords[password] = await bcrypt.hash(password, SALT_ROUNDS)
      console.log(`✓ Hashed password: ${password}`)
    }

    console.log('\n📝 Updating users...\n')

    // Update each user with hashed password based on their role
    for (const user of users) {
      let hashedPassword: string

      // Determine password based on role
      switch (user.role) {
        case 'admin':
          hashedPassword = hashedPasswords['admin123']
          break
        case 'lawyer':
          hashedPassword = hashedPasswords['advogado123']
          break
        case 'partner':
          hashedPassword = hashedPasswords['parceiro123']
          break
        case 'client':
          hashedPassword = hashedPasswords['cliente123']
          break
        default:
          hashedPassword = hashedPasswords['admin123']
      }

      const { error: updateError } = await supabase
        .from('users')
        .update({ password_hash: hashedPassword })
        .eq('id', user.id)

      if (updateError) {
        console.error(`❌ Failed to update user ${user.email}:`, updateError)
      } else {
        console.log(`✓ Updated: ${user.email} (${user.role})`)
      }
    }

    console.log('\n✅ Password migration completed successfully!')
    console.log('\n⚠️  NEXT STEPS:')
    console.log('1. Update src/lib/auth/options.ts to use bcrypt verification')
    console.log('2. Remove hardcoded passwords from the code')
    console.log('3. Test login with existing users')

  } catch (error) {
    console.error('\n❌ Migration failed:', error)
    process.exit(1)
  }
}

// Run migration
hashPasswords()
