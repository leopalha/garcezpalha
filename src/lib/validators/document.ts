/**
 * Brazilian CPF and CNPJ validators
 * CPF: Cadastro de Pessoas Físicas (Individual Taxpayer Registry)
 * CNPJ: Cadastro Nacional da Pessoa Jurídica (National Registry of Legal Entities)
 */

/**
 * Validates a Brazilian CPF number
 * @param cpf - The CPF string (can include formatting characters)
 * @returns true if valid, false otherwise
 */
export function isValidCPF(cpf: string): boolean {
  // Remove non-numeric characters
  const cleanCPF = cpf.replace(/\D/g, '')

  // CPF must have 11 digits
  if (cleanCPF.length !== 11) {
    return false
  }

  // Check for known invalid patterns (all same digit)
  if (/^(\d)\1{10}$/.test(cleanCPF)) {
    return false
  }

  // Calculate first verification digit
  let sum = 0
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cleanCPF.charAt(i)) * (10 - i)
  }
  let remainder = (sum * 10) % 11
  if (remainder === 10 || remainder === 11) {
    remainder = 0
  }
  if (remainder !== parseInt(cleanCPF.charAt(9))) {
    return false
  }

  // Calculate second verification digit
  sum = 0
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cleanCPF.charAt(i)) * (11 - i)
  }
  remainder = (sum * 10) % 11
  if (remainder === 10 || remainder === 11) {
    remainder = 0
  }
  if (remainder !== parseInt(cleanCPF.charAt(10))) {
    return false
  }

  return true
}

/**
 * Validates a Brazilian CNPJ number
 * @param cnpj - The CNPJ string (can include formatting characters)
 * @returns true if valid, false otherwise
 */
export function isValidCNPJ(cnpj: string): boolean {
  // Remove non-numeric characters
  const cleanCNPJ = cnpj.replace(/\D/g, '')

  // CNPJ must have 14 digits
  if (cleanCNPJ.length !== 14) {
    return false
  }

  // Check for known invalid patterns (all same digit)
  if (/^(\d)\1{13}$/.test(cleanCNPJ)) {
    return false
  }

  // Calculate first verification digit
  const weights1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]
  let sum = 0
  for (let i = 0; i < 12; i++) {
    sum += parseInt(cleanCNPJ.charAt(i)) * weights1[i]
  }
  let remainder = sum % 11
  const digit1 = remainder < 2 ? 0 : 11 - remainder

  if (digit1 !== parseInt(cleanCNPJ.charAt(12))) {
    return false
  }

  // Calculate second verification digit
  const weights2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]
  sum = 0
  for (let i = 0; i < 13; i++) {
    sum += parseInt(cleanCNPJ.charAt(i)) * weights2[i]
  }
  remainder = sum % 11
  const digit2 = remainder < 2 ? 0 : 11 - remainder

  if (digit2 !== parseInt(cleanCNPJ.charAt(13))) {
    return false
  }

  return true
}

/**
 * Validates either CPF or CNPJ based on the length
 * @param document - The document string (CPF or CNPJ)
 * @returns Object with type and validity
 */
export function validateDocument(document: string): {
  type: 'cpf' | 'cnpj' | 'unknown'
  isValid: boolean
  formatted: string | null
} {
  const cleanDoc = document.replace(/\D/g, '')

  if (cleanDoc.length === 11) {
    return {
      type: 'cpf',
      isValid: isValidCPF(cleanDoc),
      formatted: formatCPF(cleanDoc),
    }
  }

  if (cleanDoc.length === 14) {
    return {
      type: 'cnpj',
      isValid: isValidCNPJ(cleanDoc),
      formatted: formatCNPJ(cleanDoc),
    }
  }

  return {
    type: 'unknown',
    isValid: false,
    formatted: null,
  }
}

/**
 * Formats a CPF string
 * @param cpf - The CPF (only digits)
 * @returns Formatted CPF (XXX.XXX.XXX-XX)
 */
export function formatCPF(cpf: string): string {
  const cleanCPF = cpf.replace(/\D/g, '')
  if (cleanCPF.length !== 11) return cpf
  return cleanCPF.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
}

/**
 * Formats a CNPJ string
 * @param cnpj - The CNPJ (only digits)
 * @returns Formatted CNPJ (XX.XXX.XXX/XXXX-XX)
 */
export function formatCNPJ(cnpj: string): string {
  const cleanCNPJ = cnpj.replace(/\D/g, '')
  if (cleanCNPJ.length !== 14) return cnpj
  return cleanCNPJ.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5')
}

/**
 * Formats a document (CPF or CNPJ) based on its length
 * @param document - The document string
 * @returns Formatted document or original if invalid length
 */
export function formatDocument(document: string): string {
  const cleanDoc = document.replace(/\D/g, '')

  if (cleanDoc.length === 11) {
    return formatCPF(cleanDoc)
  }

  if (cleanDoc.length === 14) {
    return formatCNPJ(cleanDoc)
  }

  return document
}

/**
 * Masks a CPF for display (shows only last 3 digits)
 * @param cpf - The CPF string
 * @returns Masked CPF (***.***.*XX-XX)
 */
export function maskCPF(cpf: string): string {
  const cleanCPF = cpf.replace(/\D/g, '')
  if (cleanCPF.length !== 11) return cpf
  return `***.***.*${cleanCPF.slice(7, 9)}-${cleanCPF.slice(9)}`
}

/**
 * Masks a CNPJ for display (shows only last 4 digits)
 * @param cnpj - The CNPJ string
 * @returns Masked CNPJ (**.***.*** followed by /XXXX-XX)
 */
export function maskCNPJ(cnpj: string): string {
  const cleanCNPJ = cnpj.replace(/\D/g, '')
  if (cleanCNPJ.length !== 14) return cnpj
  return `**.***.***/${cleanCNPJ.slice(8, 12)}-${cleanCNPJ.slice(12)}`
}
