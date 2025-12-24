/**
 * AI Prompts Index
 * Central exports for all specialized agent prompts
 */

// Base prompt exports
export {
  BASE_PROMPT,
  SYSTEM_ROLE,
  USER_ROLE,
  ASSISTANT_ROLE,
  createBaseSystemMessage,
} from './base-prompt'

// Real Estate Agent
export {
  REAL_ESTATE_SPECIALIZATION,
  REAL_ESTATE_SYSTEM_PROMPT,
  REAL_ESTATE_TASKS,
} from './real-estate-prompts'

// Forensics Agent
export {
  FORENSICS_SPECIALIZATION,
  FORENSICS_SYSTEM_PROMPT,
  FORENSICS_TASKS,
} from './forensics-prompts'

// Property Valuation Agent
export {
  VALUATION_SPECIALIZATION,
  VALUATION_SYSTEM_PROMPT,
  VALUATION_TASKS,
} from './valuation-prompts'

// Medical Expertise Agent
export {
  MEDICAL_SPECIALIZATION,
  MEDICAL_SYSTEM_PROMPT,
  MEDICAL_TASKS,
} from './medical-prompts'

// Criminal Law Agent
export {
  CRIMINAL_LAW_SPECIALIZATION,
  CRIMINAL_LAW_SYSTEM_PROMPT,
  CRIMINAL_LAW_TASKS,
} from './criminal-law-prompts'

// Financial Protection Agent
export {
  FINANCIAL_PROTECTION_SPECIALIZATION,
  FINANCIAL_PROTECTION_SYSTEM_PROMPT,
  FINANCIAL_PROTECTION_TASKS,
} from './financial-protection-prompts'

// Health Insurance Agent
export {
  HEALTH_INSURANCE_SPECIALIZATION,
  HEALTH_INSURANCE_SYSTEM_PROMPT,
  HEALTH_INSURANCE_TASKS,
} from './health-insurance-prompts'

// Social Security Agent
export {
  SOCIAL_SECURITY_SPECIALIZATION,
  SOCIAL_SECURITY_SYSTEM_PROMPT,
  SOCIAL_SECURITY_TASKS,
} from './social-security-prompts'
