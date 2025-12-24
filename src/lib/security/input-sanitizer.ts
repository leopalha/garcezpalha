/**
 * Input Sanitization Utilities
 *
 * Protects against XSS, SQL injection, and other input-based attacks
 */

/**
 * Sanitize HTML to prevent XSS
 */
export function sanitizeHtml(input: string): string {
  if (!input) return ''

  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
}

/**
 * Sanitize string for database queries
 * Note: Always use parameterized queries with Supabase - this is an extra layer
 */
export function sanitizeForDb(input: string): string {
  if (!input) return ''

  return input
    .replace(/[\0\x08\x09\x1a\n\r"'\\\%]/g, (char) => {
      switch (char) {
        case '\0':
          return '\\0'
        case '\x08':
          return '\\b'
        case '\x09':
          return '\\t'
        case '\x1a':
          return '\\z'
        case '\n':
          return '\\n'
        case '\r':
          return '\\r'
        case '"':
        case "'":
        case '\\':
        case '%':
          return '\\' + char
        default:
          return char
      }
    })
}

/**
 * Sanitize phone number - only digits
 */
export function sanitizePhone(phone: string): string {
  if (!phone) return ''
  return phone.replace(/\D/g, '')
}

/**
 * Sanitize email - trim and lowercase
 */
export function sanitizeEmail(email: string): string {
  if (!email) return ''
  return email.trim().toLowerCase()
}

/**
 * Sanitize CPF/CNPJ - only digits
 */
export function sanitizeDocument(doc: string): string {
  if (!doc) return ''
  return doc.replace(/\D/g, '')
}

/**
 * Sanitize file name - remove dangerous characters
 */
export function sanitizeFileName(name: string): string {
  if (!name) return ''

  return name
    .replace(/[<>:"/\\|?*\x00-\x1f]/g, '') // Remove illegal chars
    .replace(/\.{2,}/g, '.') // No multiple dots
    .replace(/^\.+|\.+$/g, '') // No leading/trailing dots
    .slice(0, 255) // Max length
}

/**
 * Sanitize URL - validate and normalize
 */
export function sanitizeUrl(url: string): string | null {
  if (!url) return null

  try {
    const parsed = new URL(url)

    // Only allow http/https protocols
    if (!['http:', 'https:'].includes(parsed.protocol)) {
      return null
    }

    return parsed.toString()
  } catch {
    return null
  }
}

/**
 * Sanitize object recursively
 */
export function sanitizeObject<T extends Record<string, unknown>>(
  obj: T,
  options: { html?: boolean; trim?: boolean } = {}
): T {
  const { html = true, trim = true } = options
  const result = {} as T

  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'string') {
      let sanitized = value
      if (trim) sanitized = sanitized.trim()
      if (html) sanitized = sanitizeHtml(sanitized)
      ;(result as Record<string, unknown>)[key] = sanitized
    } else if (Array.isArray(value)) {
      ;(result as Record<string, unknown>)[key] = value.map((item) =>
        typeof item === 'string'
          ? html
            ? sanitizeHtml(trim ? item.trim() : item)
            : trim
            ? item.trim()
            : item
          : typeof item === 'object' && item !== null
          ? sanitizeObject(item as Record<string, unknown>, options)
          : item
      )
    } else if (typeof value === 'object' && value !== null) {
      ;(result as Record<string, unknown>)[key] = sanitizeObject(
        value as Record<string, unknown>,
        options
      )
    } else {
      ;(result as Record<string, unknown>)[key] = value
    }
  }

  return result
}

/**
 * Validate and sanitize process number (Brazilian format)
 */
export function sanitizeProcessNumber(processNumber: string): string | null {
  if (!processNumber) return null

  // Remove all non-digit characters
  const digits = processNumber.replace(/\D/g, '')

  // Brazilian process numbers have 20 digits
  if (digits.length !== 20) return null

  // Format: NNNNNNN-DD.AAAA.J.TR.OOOO
  return `${digits.slice(0, 7)}-${digits.slice(7, 9)}.${digits.slice(9, 13)}.${digits.slice(13, 14)}.${digits.slice(14, 16)}.${digits.slice(16, 20)}`
}

/**
 * Check for common injection patterns
 */
export function hasInjectionPatterns(input: string): boolean {
  if (!input) return false

  const patterns = [
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, // Script tags
    /javascript:/gi, // JS protocol
    /on\w+\s*=/gi, // Event handlers
    /data:\s*text\/html/gi, // Data URI with HTML
    /vbscript:/gi, // VBScript protocol
    /expression\s*\(/gi, // CSS expression
  ]

  return patterns.some((pattern) => pattern.test(input))
}

/**
 * Remove injection patterns from input
 */
export function removeInjectionPatterns(input: string): string {
  if (!input) return ''

  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '')
    .replace(/data:\s*text\/html/gi, '')
    .replace(/vbscript:/gi, '')
    .replace(/expression\s*\(/gi, '')
}
