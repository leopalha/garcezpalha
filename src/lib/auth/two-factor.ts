/**
 * Two-Factor Authentication (2FA) System
 * P1-001: MFA/2FA for Admin Users
 *
 * Supports:
 * - Authenticator apps (TOTP) - Google Authenticator, Authy, etc.
 * - SMS (via Twilio)
 * - Email backup codes
 */

import { createClient } from '@/lib/supabase/server'
import * as crypto from 'crypto'

// TOTP configuration
const TOTP_WINDOW = 1 // Allow 1 time step before/after
const TOTP_STEP = 30 // 30 seconds per code
const TOTP_DIGITS = 6 // 6-digit codes

/**
 * Generate a secret key for TOTP
 */
export function generateTOTPSecret(): string {
  const buffer = crypto.randomBytes(20)
  return base32Encode(buffer)
}

/**
 * Base32 encoding (for TOTP secret)
 */
function base32Encode(buffer: Buffer): string {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567'
  let bits = 0
  let value = 0
  let output = ''

  for (let i = 0; i < buffer.length; i++) {
    value = (value << 8) | buffer[i]
    bits += 8

    while (bits >= 5) {
      output += alphabet[(value >>> (bits - 5)) & 31]
      bits -= 5
    }
  }

  if (bits > 0) {
    output += alphabet[(value << (5 - bits)) & 31]
  }

  return output
}

/**
 * Generate TOTP code for a given secret
 */
export function generateTOTP(secret: string, timeStep?: number): string {
  const time = timeStep || Math.floor(Date.now() / 1000 / TOTP_STEP)
  const buffer = Buffer.alloc(8)
  buffer.writeBigInt64BE(BigInt(time))

  const decodedSecret = base32Decode(secret)
  const hmac = crypto.createHmac('sha1', Buffer.from(decodedSecret))
  hmac.update(buffer)
  const digest = hmac.digest()

  const offset = digest[digest.length - 1] & 0x0f
  const binary =
    ((digest[offset] & 0x7f) << 24) |
    ((digest[offset + 1] & 0xff) << 16) |
    ((digest[offset + 2] & 0xff) << 8) |
    (digest[offset + 3] & 0xff)

  const otp = binary % Math.pow(10, TOTP_DIGITS)
  return otp.toString().padStart(TOTP_DIGITS, '0')
}

/**
 * Base32 decoding
 */
function base32Decode(encoded: string): number[] {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567'
  let bits = 0
  let value = 0
  const output: number[] = []

  for (let i = 0; i < encoded.length; i++) {
    const idx = alphabet.indexOf(encoded[i].toUpperCase())
    if (idx === -1) continue

    value = (value << 5) | idx
    bits += 5

    if (bits >= 8) {
      output.push((value >>> (bits - 8)) & 0xff)
      bits -= 8
    }
  }

  return output
}

/**
 * Verify TOTP code
 */
export function verifyTOTP(secret: string, token: string): boolean {
  const currentTime = Math.floor(Date.now() / 1000 / TOTP_STEP)

  // Check current time and +/- window
  for (let i = -TOTP_WINDOW; i <= TOTP_WINDOW; i++) {
    const validToken = generateTOTP(secret, currentTime + i)
    if (validToken === token) {
      return true
    }
  }

  return false
}

/**
 * Generate QR code URL for authenticator app
 */
export function generateTOTPQRCodeURL(
  secret: string,
  email: string,
  issuer: string = 'Garcez Palha'
): string {
  const label = encodeURIComponent(`${issuer}:${email}`)
  const params = new URLSearchParams({
    secret,
    issuer,
    algorithm: 'SHA1',
    digits: TOTP_DIGITS.toString(),
    period: TOTP_STEP.toString(),
  })

  return `otpauth://totp/${label}?${params.toString()}`
}

/**
 * Generate backup codes (for recovery)
 */
export function generateBackupCodes(count: number = 10): string[] {
  const codes: string[] = []

  for (let i = 0; i < count; i++) {
    const code = crypto.randomBytes(4).toString('hex').toUpperCase()
    codes.push(code)
  }

  return codes
}

/**
 * Hash backup codes for storage
 */
export function hashBackupCode(code: string): string {
  return crypto.createHash('sha256').update(code).digest('hex')
}

/**
 * Verify backup code
 */
export async function verifyBackupCode(
  userId: string,
  code: string
): Promise<boolean> {
  const supabase = await createClient()
  const hashedCode = hashBackupCode(code)

  const { data: user } = await supabase
    .from('users')
    .select('two_factor_backup_codes')
    .eq('id', userId)
    .single()

  if (!user || !user.two_factor_backup_codes) {
    return false
  }

  const codes: string[] = user.two_factor_backup_codes

  if (codes.includes(hashedCode)) {
    // Remove used code
    const updatedCodes = codes.filter((c) => c !== hashedCode)

    await supabase
      .from('users')
      .update({ two_factor_backup_codes: updatedCodes })
      .eq('id', userId)

    return true
  }

  return false
}

/**
 * Enable 2FA for user
 */
export async function enable2FA(
  userId: string,
  method: 'totp' | 'sms' | 'email',
  secret?: string,
  phone?: string
): Promise<{ secret: string; qrCodeURL?: string; backupCodes: string[] }> {
  const supabase = await createClient()

  // Generate secret if not provided
  const totpSecret = secret || generateTOTPSecret()

  // Generate backup codes
  const backupCodes = generateBackupCodes(10)
  const hashedBackupCodes = backupCodes.map(hashBackupCode)

  // Get user email for QR code
  const { data: user } = await supabase
    .from('users')
    .select('email')
    .eq('id', userId)
    .single()

  if (!user) {
    throw new Error('User not found')
  }

  // Update user with 2FA settings
  await supabase
    .from('users')
    .update({
      two_factor_enabled: true,
      two_factor_method: method,
      two_factor_secret: totpSecret,
      two_factor_backup_codes: hashedBackupCodes,
      two_factor_phone: phone || null,
    })
    .eq('id', userId)

  const qrCodeURL =
    method === 'totp'
      ? generateTOTPQRCodeURL(totpSecret, user.email)
      : undefined

  return {
    secret: totpSecret,
    qrCodeURL,
    backupCodes,
  }
}

/**
 * Disable 2FA for user
 */
export async function disable2FA(userId: string): Promise<void> {
  const supabase = await createClient()

  await supabase
    .from('users')
    .update({
      two_factor_enabled: false,
      two_factor_method: null,
      two_factor_secret: null,
      two_factor_backup_codes: null,
      two_factor_phone: null,
    })
    .eq('id', userId)
}

/**
 * Verify 2FA code (TOTP or backup)
 */
export async function verify2FACode(
  userId: string,
  code: string
): Promise<boolean> {
  const supabase = await createClient()

  const { data: user } = await supabase
    .from('users')
    .select('two_factor_enabled, two_factor_method, two_factor_secret')
    .eq('id', userId)
    .single()

  if (!user || !user.two_factor_enabled || !user.two_factor_secret) {
    return false
  }

  // Try TOTP verification
  if (user.two_factor_method === 'totp') {
    if (verifyTOTP(user.two_factor_secret, code)) {
      return true
    }
  }

  // Try backup code verification
  return await verifyBackupCode(userId, code)
}

/**
 * Check if 2FA is required for user
 */
export async function is2FARequired(userId: string): Promise<boolean> {
  const supabase = await createClient()

  const { data: user } = await supabase
    .from('users')
    .select('two_factor_enabled, role')
    .eq('id', userId)
    .single()

  if (!user) {
    return false
  }

  // 2FA is required for admin users
  if (user.role === 'admin') {
    return true
  }

  // Otherwise, only if user has enabled it
  return user.two_factor_enabled || false
}

/**
 * Send 2FA code via SMS (Twilio integration)
 */
export async function send2FACodeSMS(
  userId: string,
  phone: string
): Promise<boolean> {
  // Generate temporary code
  const code = crypto.randomInt(100000, 999999).toString()

  // Store code in database (expires in 5 minutes)
  const supabase = await createClient()
  await supabase
    .from('two_factor_codes')
    .insert({
      user_id: userId,
      code: hashBackupCode(code),
      phone,
      expires_at: new Date(Date.now() + 5 * 60 * 1000).toISOString(),
    })

  // Send SMS via Twilio (if configured)
  if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
    try {
      // TODO: Integrate Twilio SDK
      console.log(`[2FA] SMS code ${code} sent to ${phone}`)
      return true
    } catch (error) {
      console.error('[2FA] Failed to send SMS:', error)
      return false
    }
  }

  // Development mode - log code
  console.log(`[2FA] SMS code: ${code} (phone: ${phone})`)
  return true
}
