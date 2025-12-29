/**
 * Prompts Registry
 * Central registry for all agent prompts modules
 * Replaces dynamic imports to fix webpack bundling issues
 */

import * as criminalLawPrompts from './criminal-law-prompts'
import * as healthInsurancePrompts from './health-insurance-prompts'
import * as financialProtectionPrompts from './financial-protection-prompts'
import * as realEstatePrompts from './real-estate-prompts'
import * as socialSecurityPrompts from './social-security-prompts'
import * as medicalPrompts from './medical-prompts'
import * as forensicsPrompts from './forensics-prompts'
import * as valuationPrompts from './valuation-prompts'

export const PROMPTS_REGISTRY: Record<string, any> = {
  '@/lib/ai/prompts/criminal-law-prompts': criminalLawPrompts,
  '@/lib/ai/prompts/health-insurance-prompts': healthInsurancePrompts,
  '@/lib/ai/prompts/financial-protection-prompts': financialProtectionPrompts,
  '@/lib/ai/prompts/real-estate-prompts': realEstatePrompts,
  '@/lib/ai/prompts/social-security-prompts': socialSecurityPrompts,
  '@/lib/ai/prompts/medical-expertise-prompts': medicalPrompts,
  '@/lib/ai/prompts/document-forensics-prompts': forensicsPrompts,
  '@/lib/ai/prompts/property-valuation-prompts': valuationPrompts,
}

/**
 * Get prompts module by path
 * @param modulePath - Module path from agent config
 * @returns Prompts module or undefined if not found
 */
export function getPromptsModule(modulePath: string): any {
  return PROMPTS_REGISTRY[modulePath]
}
