/**
 * Brazilian Formatting Utilities
 *
 * Centralized formatters for Brazilian-specific data formats:
 * - Phone numbers
 * - CPF/CNPJ (tax IDs)
 * - CEP (postal codes)
 * - Currency (BRL)
 * - Dates
 *
 * This eliminates duplicate formatter implementations across the codebase.
 */

/**
 * Formata número de telefone brasileiro
 * Suporta telefone fixo (10 dígitos) e celular (11 dígitos)
 *
 * @example
 * formatPhone('21987654321') => '(21) 98765-4321'
 * formatPhone('1133334444') => '(11) 3333-4444'
 */
export function formatPhone(value: string): string {
  const cleaned = value.replace(/\D/g, '')

  if (cleaned.length === 0) return ''

  if (cleaned.length <= 10) {
    // Telefone fixo: (XX) XXXX-XXXX
    return cleaned.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3')
  }

  // Celular: (XX) XXXXX-XXXX
  return cleaned.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3')
}

/**
 * Remove formatação de telefone, retorna apenas números
 *
 * @example
 * unformatPhone('(21) 98765-4321') => '21987654321'
 */
export function unformatPhone(value: string): string {
  return value.replace(/\D/g, '')
}

/**
 * Formata CPF (11 dígitos) ou CNPJ (14 dígitos)
 *
 * @example
 * formatCpfCnpj('12345678901') => '123.456.789-01'
 * formatCpfCnpj('12345678000190') => '12.345.678/0001-90'
 */
export function formatCpfCnpj(value: string): string {
  const cleaned = value.replace(/\D/g, '')

  if (cleaned.length === 0) return ''

  if (cleaned.length <= 11) {
    // CPF: XXX.XXX.XXX-XX
    return cleaned.replace(/(\d{3})(\d{3})(\d{3})(\d{0,2})/, '$1.$2.$3-$4')
  }

  // CNPJ: XX.XXX.XXX/XXXX-XX
  return cleaned.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{0,2})/, '$1.$2.$3/$4-$5')
}

/**
 * Remove formatação de CPF/CNPJ, retorna apenas números
 *
 * @example
 * unformatCpfCnpj('123.456.789-01') => '12345678901'
 */
export function unformatCpfCnpj(value: string): string {
  return value.replace(/\D/g, '')
}

/**
 * Formata CEP (código postal brasileiro)
 *
 * @example
 * formatCep('20040020') => '20040-020'
 */
export function formatCep(value: string): string {
  const cleaned = value.replace(/\D/g, '')

  if (cleaned.length === 0) return ''

  // CEP: XXXXX-XXX
  return cleaned.replace(/(\d{5})(\d{0,3})/, '$1-$2')
}

/**
 * Remove formatação de CEP, retorna apenas números
 *
 * @example
 * unformatCep('20040-020') => '20040020'
 */
export function unformatCep(value: string): string {
  return value.replace(/\D/g, '')
}

/**
 * Formata valor monetário para Real Brasileiro (BRL)
 *
 * @example
 * formatCurrency(1234.56) => 'R$ 1.234,56'
 * formatCurrency(1000) => 'R$ 1.000,00'
 */
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value)
}

/**
 * Formata data no padrão brasileiro
 *
 * @example
 * formatDate(new Date('2024-12-28')) => '28/12/2024'
 */
export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date

  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(d)
}

/**
 * Formata data e hora no padrão brasileiro
 *
 * @example
 * formatDateTime(new Date('2024-12-28T15:30:00')) => '28/12/2024 15:30'
 */
export function formatDateTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date

  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(d)
}

/**
 * Valida CPF brasileiro
 *
 * @example
 * isValidCpf('123.456.789-01') => true/false
 */
export function isValidCpf(cpf: string): boolean {
  const cleaned = cpf.replace(/\D/g, '')

  if (cleaned.length !== 11) return false

  // Elimina CPFs inválidos conhecidos
  if (/^(\d)\1+$/.test(cleaned)) return false

  // Validação do primeiro dígito verificador
  let sum = 0
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cleaned.charAt(i)) * (10 - i)
  }
  let digit = 11 - (sum % 11)
  if (digit > 9) digit = 0
  if (digit !== parseInt(cleaned.charAt(9))) return false

  // Validação do segundo dígito verificador
  sum = 0
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cleaned.charAt(i)) * (11 - i)
  }
  digit = 11 - (sum % 11)
  if (digit > 9) digit = 0
  if (digit !== parseInt(cleaned.charAt(10))) return false

  return true
}

/**
 * Valida CNPJ brasileiro
 *
 * @example
 * isValidCnpj('12.345.678/0001-90') => true/false
 */
export function isValidCnpj(cnpj: string): boolean {
  const cleaned = cnpj.replace(/\D/g, '')

  if (cleaned.length !== 14) return false

  // Elimina CNPJs inválidos conhecidos
  if (/^(\d)\1+$/.test(cleaned)) return false

  // Validação dos dígitos verificadores
  const calcDigit = (slice: string, factor: number): number => {
    let sum = 0
    let pos = slice.length - factor + 1

    for (let i = 0; i < slice.length; i++) {
      sum += parseInt(slice.charAt(i)) * pos
      pos--
      if (pos < 2) pos = 9
    }

    const result = sum % 11
    return result < 2 ? 0 : 11 - result
  }

  const digit1 = calcDigit(cleaned.substring(0, 12), 5)
  if (digit1 !== parseInt(cleaned.charAt(12))) return false

  const digit2 = calcDigit(cleaned.substring(0, 13), 6)
  if (digit2 !== parseInt(cleaned.charAt(13))) return false

  return true
}

/**
 * Valida CEP brasileiro (formato básico)
 *
 * @example
 * isValidCep('20040-020') => true
 * isValidCep('00000-000') => false
 */
export function isValidCep(cep: string): boolean {
  const cleaned = cep.replace(/\D/g, '')

  if (cleaned.length !== 8) return false
  if (cleaned === '00000000') return false

  return true
}
