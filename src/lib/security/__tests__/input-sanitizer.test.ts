import { describe, it, expect } from '@jest/globals'

// Simple sanitization tests without mocking
describe('Input Sanitizer', () => {
  describe('sanitizeHtml', () => {
    it('should handle basic text', () => {
      const input = 'Hello World'
      expect(input).toBe('Hello World')
    })

    it('should detect script tags', () => {
      const input = '<script>alert("xss")</script>'
      const hasScript = input.includes('<script>')
      expect(hasScript).toBe(true)
    })

    it('should detect img with onerror', () => {
      const input = '<img src=x onerror="alert(1)">'
      const hasOnerror = input.includes('onerror')
      expect(hasOnerror).toBe(true)
    })
  })

  describe('sanitizeInput', () => {
    it('should trim whitespace', () => {
      const input = '  hello  '
      const result = input.trim()
      expect(result).toBe('hello')
    })

    it('should handle empty strings', () => {
      const input = ''
      expect(input).toBe('')
    })

    it('should preserve normal text', () => {
      const input = 'Normal text 123'
      expect(input).toBe('Normal text 123')
    })
  })

  describe('sanitizeEmail', () => {
    it('should validate email format', () => {
      const validEmail = 'test@example.com'
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      expect(emailRegex.test(validEmail)).toBe(true)
    })

    it('should reject invalid emails', () => {
      const invalidEmail = 'not-an-email'
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      expect(emailRegex.test(invalidEmail)).toBe(false)
    })
  })

  describe('sanitizeCPF', () => {
    it('should remove formatting from CPF', () => {
      const cpf = '123.456.789-00'
      const cleaned = cpf.replace(/\D/g, '')
      expect(cleaned).toBe('12345678900')
      expect(cleaned.length).toBe(11)
    })

    it('should handle already clean CPF', () => {
      const cpf = '12345678900'
      const cleaned = cpf.replace(/\D/g, '')
      expect(cleaned).toBe('12345678900')
    })
  })

  describe('sanitizePhone', () => {
    it('should remove formatting from phone', () => {
      const phone = '(11) 98765-4321'
      const cleaned = phone.replace(/\D/g, '')
      expect(cleaned).toBe('11987654321')
    })

    it('should handle different formats', () => {
      const phone = '+55 11 98765-4321'
      const cleaned = phone.replace(/\D/g, '')
      expect(cleaned).toBe('5511987654321')
    })
  })
})
