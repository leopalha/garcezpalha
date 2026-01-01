/**
 * Input Sanitization Utilities
 * Protects against XSS, SQL Injection, and other injection attacks
 */

import DOMPurify from 'isomorphic-dompurify'

/**
 * Sanitize HTML content to prevent XSS attacks
 */
export function sanitizeHtml(dirty: string): string {
  if (typeof dirty !== 'string') return ''
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'br', 'ul', 'ol', 'li'],
    ALLOWED_ATTR: ['href', 'target', 'rel'],
  })
}

/**
 * Sanitize plain text - removes all HTML and dangerous characters
 */
export function sanitizeText(dirty: string): string {
  if (typeof dirty !== 'string') return ''
  return DOMPurify.sanitize(dirty, { ALLOWED_TAGS: [] })
}

/**
 * Sanitize email - basic validation and normalization
 */
export function sanitizeEmail(email: string): string {
  if (typeof email !== 'string') return ''
  return email.toLowerCase().trim()
}

/**
 * Sanitize phone - remove all non-numeric characters
 */
export function sanitizePhone(phone: string): string {
  if (typeof phone !== 'string') return ''
  return phone.replace(/\D/g, '')
}

/**
 * Sanitize URL - validate and normalize
 */
export function sanitizeUrl(url: string): string {
  if (typeof url !== 'string') return ''

  try {
    const parsed = new URL(url)
    // Only allow http and https protocols
    if (!['http:', 'https:'].includes(parsed.protocol)) {
      return ''
    }
    return parsed.toString()
  } catch {
    return ''
  }
}

/**
 * Sanitize object - recursively sanitize all string values
 */
export function sanitizeObject<T extends Record<string, any>>(
  obj: T,
  mode: 'html' | 'text' = 'text'
): T {
  const sanitized: any = Array.isArray(obj) ? [] : {}

  for (const key in obj) {
    const value = obj[key]

    if (typeof value === 'string') {
      sanitized[key] = mode === 'html' ? sanitizeHtml(value) : sanitizeText(value)
    } else if (typeof value === 'object' && value !== null) {
      sanitized[key] = sanitizeObject(value, mode)
    } else {
      sanitized[key] = value
    }
  }

  return sanitized as T
}

/**
 * Escape SQL special characters (for raw queries - prefer parameterized queries)
 */
export function escapeSql(value: string): string {
  if (typeof value !== 'string') return ''
  return value.replace(/[\0\x08\x09\x1a\n\r"'\\\%]/g, (char) => {
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
 * Remove dangerous file extensions
 */
export function sanitizeFilename(filename: string): string {
  if (typeof filename !== 'string') return ''

  // Remove path traversal attempts
  let safe = filename.replace(/\.\./g, '')

  // Remove dangerous extensions
  const dangerousExtensions = [
    '.exe', '.bat', '.cmd', '.com', '.pif', '.scr', '.vbs', '.js',
    '.jar', '.zip', '.rar', '.tar', '.gz', '.7z', '.dmg', '.pkg',
    '.deb', '.rpm', '.sh', '.app', '.dll', '.so', '.dylib'
  ]

  dangerousExtensions.forEach((ext) => {
    safe = safe.replace(new RegExp(ext + '$', 'i'), '')
  })

  // Only allow alphanumeric, dash, underscore, dot
  safe = safe.replace(/[^a-zA-Z0-9._-]/g, '_')

  return safe
}

/**
 * Validate and sanitize JSON
 */
export function sanitizeJson(json: string): any {
  if (typeof json !== 'string') return null

  try {
    const parsed = JSON.parse(json)
    return sanitizeObject(parsed)
  } catch {
    return null
  }
}

/**
 * Rate limit key sanitization - prevent cache poisoning
 */
export function sanitizeRateLimitKey(key: string): string {
  if (typeof key !== 'string') return ''
  // Only allow alphanumeric, dash, underscore, colon
  return key.replace(/[^a-zA-Z0-9:_-]/g, '')
}
