import {
  isValidCPF,
  isValidCNPJ,
  validateDocument,
  formatCPF,
  formatCNPJ,
  formatDocument,
  maskCPF,
  maskCNPJ,
} from '../document'

describe('CPF Validation', () => {
  it('should validate a correct CPF', () => {
    expect(isValidCPF('529.982.247-25')).toBe(true)
    expect(isValidCPF('52998224725')).toBe(true)
  })

  it('should reject invalid CPF', () => {
    expect(isValidCPF('111.111.111-11')).toBe(false)
    expect(isValidCPF('123.456.789-00')).toBe(false)
    expect(isValidCPF('000.000.000-00')).toBe(false)
  })

  it('should reject CPF with wrong length', () => {
    expect(isValidCPF('1234567890')).toBe(false)
    expect(isValidCPF('123456789012')).toBe(false)
    expect(isValidCPF('')).toBe(false)
  })
})

describe('CNPJ Validation', () => {
  it('should validate a correct CNPJ', () => {
    expect(isValidCNPJ('11.222.333/0001-81')).toBe(true)
    expect(isValidCNPJ('11222333000181')).toBe(true)
  })

  it('should reject invalid CNPJ', () => {
    expect(isValidCNPJ('11.111.111/1111-11')).toBe(false)
    expect(isValidCNPJ('00.000.000/0000-00')).toBe(false)
    expect(isValidCNPJ('12.345.678/0001-00')).toBe(false)
  })

  it('should reject CNPJ with wrong length', () => {
    expect(isValidCNPJ('1234567890123')).toBe(false)
    expect(isValidCNPJ('123456789012345')).toBe(false)
    expect(isValidCNPJ('')).toBe(false)
  })
})

describe('validateDocument', () => {
  it('should detect and validate CPF', () => {
    const result = validateDocument('529.982.247-25')
    expect(result.type).toBe('cpf')
    expect(result.isValid).toBe(true)
    expect(result.formatted).toBe('529.982.247-25')
  })

  it('should detect and validate CNPJ', () => {
    const result = validateDocument('11.222.333/0001-81')
    expect(result.type).toBe('cnpj')
    expect(result.isValid).toBe(true)
    expect(result.formatted).toBe('11.222.333/0001-81')
  })

  it('should return unknown for invalid length', () => {
    const result = validateDocument('12345')
    expect(result.type).toBe('unknown')
    expect(result.isValid).toBe(false)
    expect(result.formatted).toBeNull()
  })
})

describe('Formatting', () => {
  it('should format CPF correctly', () => {
    expect(formatCPF('52998224725')).toBe('529.982.247-25')
  })

  it('should format CNPJ correctly', () => {
    expect(formatCNPJ('11222333000181')).toBe('11.222.333/0001-81')
  })

  it('should format document based on length', () => {
    expect(formatDocument('52998224725')).toBe('529.982.247-25')
    expect(formatDocument('11222333000181')).toBe('11.222.333/0001-81')
    expect(formatDocument('12345')).toBe('12345')
  })
})

describe('Masking', () => {
  it('should mask CPF correctly', () => {
    expect(maskCPF('529.982.247-25')).toBe('***.***.*47-25')
  })

  it('should mask CNPJ correctly', () => {
    expect(maskCNPJ('11.222.333/0001-81')).toBe('**.***.***' + '/0001-81')
  })
})
