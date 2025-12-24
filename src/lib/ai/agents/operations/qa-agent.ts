/**
 * QA Agent
 * Responsible for quality assurance and legal compliance verification
 */

import { EnhancedBaseAgent } from '../core/enhanced-base-agent'
import type { AgentRole, AgentContext, EnhancedAgentConfig } from '../core/agent-types'
import {
  QA_AGENT_SYSTEM_PROMPT,
  CONTENT_REVIEW_PROMPT,
  OAB_COMPLIANCE_PROMPT,
  LEGAL_ACCURACY_PROMPT,
  GRAMMAR_CHECK_PROMPT,
  BRAND_VOICE_PROMPT,
  SOCIAL_MEDIA_REVIEW_PROMPT,
  BLOG_ARTICLE_REVIEW_PROMPT,
  FINAL_APPROVAL_PROMPT,
  BATCH_REVIEW_PROMPT,
  getSeverityFromScore,
  getApprovalStatus,
  requiresOABReview,
} from '../../prompts/operations/qa-prompts'

// =============================================================================
// TYPES
// =============================================================================

export type IssueSeverity = 'critical' | 'high' | 'medium' | 'low'
export type IssueCategory = 'oab' | 'legal' | 'quality' | 'brand' | 'platform'
export type ApprovalDecision = 'approved' | 'minor_edits' | 'major_revision' | 'rejected'

export interface ContentIssue {
  severity: IssueSeverity
  category: IssueCategory
  description: string
  suggestion: string
  location?: string
}

export interface ContentCorrection {
  original: string
  corrected: string
  reason: string
}

export interface ReviewChecklist {
  oabCompliance: boolean
  technicalAccuracy: boolean
  grammarCorrect: boolean
  brandAligned: boolean
  platformOptimized: boolean
}

export interface ContentReview {
  approved: boolean
  score: number
  issues: ContentIssue[]
  corrections: ContentCorrection[]
  checklist: ReviewChecklist
  recommendation: ApprovalDecision
}

export interface OABViolation {
  article: string
  description: string
  excerpt: string
  severity: 'critical' | 'high' | 'medium'
}

export interface OABComplianceResult {
  compliant: boolean
  violations: OABViolation[]
  warnings: Array<{ concern: string; recommendation: string }>
  summary: string
}

export interface LegalReference {
  citation: string
  verified: boolean
  correction?: string
}

export interface LegalError {
  type: 'law' | 'jurisprudence' | 'procedure' | 'terminology'
  description: string
  correction: string
}

export interface LegalAccuracyResult {
  accurate: boolean
  legalReferences: LegalReference[]
  errors: LegalError[]
  suggestions: string[]
}

export interface GrammarError {
  type: 'spelling' | 'grammar' | 'punctuation' | 'style'
  original: string
  corrected: string
  explanation: string
}

export interface GrammarCheckResult {
  score: number
  errors: GrammarError[]
  suggestions: Array<{ original: string; improved: string; reason: string }>
  readabilityScore: number
  correctedText: string
}

export interface BrandVoiceAnalysis {
  aligned: boolean
  score: number
  analysis: {
    tone: 'professional' | 'casual' | 'too_formal' | 'appropriate'
    accessibility: number
    educationalValue: number
    brandConsistency: number
  }
  adjustments: Array<{ aspect: string; current: string; suggested: string }>
}

export interface FinalApproval {
  approved: boolean
  decision: 'approve' | 'approve_with_changes' | 'reject'
  finalScore: number
  checklist: {
    oabCompliance: { passed: boolean; notes: string }
    technicalAccuracy: { passed: boolean; notes: string }
    quality: { passed: boolean; notes: string }
    brandAlignment: { passed: boolean; notes: string }
    platformOptimization: { passed: boolean; notes: string }
  }
  requiredChanges: string[]
  optionalImprovements: string[]
  summary: string
  approvedContent?: string
}

export interface BatchReviewResult {
  totalReviewed: number
  approved: number
  needsRevision: number
  rejected: number
  results: Array<{
    contentId: string
    decision: 'approved' | 'revision' | 'rejected'
    score: number
    criticalIssues: number
    summary: string
  }>
  commonIssues: Array<{
    issue: string
    frequency: number
    recommendation: string
  }>
}

// =============================================================================
// QA AGENT CLASS
// =============================================================================

export class QAAgent extends EnhancedBaseAgent {
  constructor(config?: Partial<EnhancedAgentConfig>) {
    super(QA_AGENT_SYSTEM_PROMPT, 'qa', {
      timeout: 90000, // QA takes longer
      ...config,
    })
  }

  get name(): string {
    return 'QA Agent'
  }

  get role(): AgentRole {
    return 'qa'
  }

  isRelevant(input: string): boolean {
    const keywords = [
      'revisar', 'review', 'aprovar', 'approve', 'verificar', 'check',
      'oab', 'compliance', 'conformidade', 'qualidade', 'quality',
      'gramática', 'grammar', 'correção', 'correction', 'validar',
    ]
    const lowerInput = input.toLowerCase()
    return keywords.some(keyword => lowerInput.includes(keyword))
  }

  // ===========================================================================
  // CONTENT REVIEW
  // ===========================================================================

  /**
   * Perform complete content review
   */
  async reviewContent(
    content: string,
    contentType: string,
    platform?: string,
    context?: AgentContext
  ): Promise<ContentReview> {
    const prompt = `
${CONTENT_REVIEW_PROMPT}

CONTEÚDO PARA REVISÃO:
Tipo: ${contentType}
${platform ? `Plataforma: ${platform}` : ''}

---
${content}
---

Analise completamente e forneça a revisão no formato JSON especificado.
`

    const response = await this.processStructured<ContentReview>(prompt, context)
    return response
  }

  // ===========================================================================
  // OAB COMPLIANCE
  // ===========================================================================

  /**
   * Check OAB compliance
   */
  async checkOABCompliance(content: string, context?: AgentContext): Promise<OABComplianceResult> {
    const prompt = `
${OAB_COMPLIANCE_PROMPT}

CONTEÚDO PARA VERIFICAÇÃO:
---
${content}
---

Verifique conformidade OAB e forneça resultado no formato JSON especificado.
`

    const response = await this.processStructured<OABComplianceResult>(prompt, context)
    return response
  }

  /**
   * Quick OAB check - returns only pass/fail
   */
  async quickOABCheck(content: string): Promise<{ passed: boolean; criticalViolation?: string }> {
    const result = await this.checkOABCompliance(content)

    if (!result.compliant) {
      const critical = result.violations.find(v => v.severity === 'critical')
      return {
        passed: false,
        criticalViolation: critical?.description || result.violations[0]?.description,
      }
    }

    return { passed: true }
  }

  // ===========================================================================
  // LEGAL ACCURACY
  // ===========================================================================

  /**
   * Verify legal accuracy of content
   */
  async verifyLegalAccuracy(
    content: string,
    legalArea?: string,
    context?: AgentContext
  ): Promise<LegalAccuracyResult> {
    const prompt = `
${LEGAL_ACCURACY_PROMPT}

${legalArea ? `ÁREA JURÍDICA: ${legalArea}` : ''}

CONTEÚDO PARA VERIFICAÇÃO:
---
${content}
---

Verifique a precisão técnico-jurídica e forneça resultado no formato JSON especificado.
`

    const response = await this.processStructured<LegalAccuracyResult>(prompt, context)
    return response
  }

  // ===========================================================================
  // GRAMMAR & QUALITY
  // ===========================================================================

  /**
   * Check grammar and style
   */
  async checkGrammar(content: string, context?: AgentContext): Promise<GrammarCheckResult> {
    const prompt = `
${GRAMMAR_CHECK_PROMPT}

TEXTO PARA REVISÃO:
---
${content}
---

Revise gramática e estilo, fornecendo resultado no formato JSON especificado.
`

    const response = await this.processStructured<GrammarCheckResult>(prompt, context)
    return response
  }

  /**
   * Analyze brand voice alignment
   */
  async analyzeBrandVoice(content: string, context?: AgentContext): Promise<BrandVoiceAnalysis> {
    const prompt = `
${BRAND_VOICE_PROMPT}

CONTEÚDO PARA ANÁLISE:
---
${content}
---

Avalie o alinhamento com a marca e forneça resultado no formato JSON especificado.
`

    const response = await this.processStructured<BrandVoiceAnalysis>(prompt, context)
    return response
  }

  // ===========================================================================
  // PLATFORM-SPECIFIC REVIEWS
  // ===========================================================================

  /**
   * Review social media content
   */
  async reviewSocialMedia(
    content: string,
    platform: 'instagram' | 'linkedin' | 'facebook' | 'twitter',
    context?: AgentContext
  ): Promise<{
    platformCompliant: boolean
    characterCount: number
    issues: Array<{ type: string; description: string; fix: string }>
    optimizedContent: string
    score: number
  }> {
    const prompt = SOCIAL_MEDIA_REVIEW_PROMPT.replace('{platform}', platform) + `

CONTEÚDO PARA REVISÃO:
---
${content}
---

Revise para ${platform} e forneça resultado no formato JSON especificado.
`

    const response = await this.processStructured<{
      platformCompliant: boolean
      characterCount: number
      issues: Array<{ type: string; description: string; fix: string }>
      optimizedContent: string
      score: number
    }>(prompt, context)

    return response
  }

  /**
   * Review blog article
   */
  async reviewBlogArticle(
    content: string,
    targetKeyword?: string,
    context?: AgentContext
  ): Promise<{
    qualityScore: number
    seoScore: number
    readabilityScore: number
    structure: {
      hasTitle: boolean
      hasIntro: boolean
      hasSubheadings: boolean
      hasConclusion: boolean
      hasCTA: boolean
    }
    seoIssues: Array<{ issue: string; fix: string }>
    contentIssues: Array<{ issue: string; fix: string }>
    suggestedMetaDescription: string
    suggestedInternalLinks: string[]
  }> {
    const prompt = `
${BLOG_ARTICLE_REVIEW_PROMPT}

${targetKeyword ? `PALAVRA-CHAVE ALVO: ${targetKeyword}` : ''}

ARTIGO PARA REVISÃO:
---
${content}
---

Revise o artigo e forneça resultado no formato JSON especificado.
`

    const response = await this.processStructured<{
      qualityScore: number
      seoScore: number
      readabilityScore: number
      structure: {
        hasTitle: boolean
        hasIntro: boolean
        hasSubheadings: boolean
        hasConclusion: boolean
        hasCTA: boolean
      }
      seoIssues: Array<{ issue: string; fix: string }>
      contentIssues: Array<{ issue: string; fix: string }>
      suggestedMetaDescription: string
      suggestedInternalLinks: string[]
    }>(prompt, context)

    return response
  }

  // ===========================================================================
  // APPROVAL WORKFLOW
  // ===========================================================================

  /**
   * Perform final approval check
   */
  async finalApproval(
    content: string,
    contentType: string,
    platform?: string,
    context?: AgentContext
  ): Promise<FinalApproval> {
    const prompt = `
${FINAL_APPROVAL_PROMPT}

CONTEÚDO PARA APROVAÇÃO FINAL:
Tipo: ${contentType}
${platform ? `Plataforma: ${platform}` : ''}

---
${content}
---

Realize a aprovação final e forneça resultado no formato JSON especificado.
`

    const response = await this.processStructured<FinalApproval>(prompt, context)
    return response
  }

  /**
   * Complete QA pipeline - runs all checks
   */
  async runFullQAPipeline(
    content: string,
    contentType: string,
    platform?: string,
    legalArea?: string
  ): Promise<{
    oabResult: OABComplianceResult
    legalResult: LegalAccuracyResult
    grammarResult: GrammarCheckResult
    brandResult: BrandVoiceAnalysis
    finalApproval: FinalApproval
    overallScore: number
    canPublish: boolean
  }> {
    // Run checks in parallel where possible
    const [oabResult, legalResult, grammarResult, brandResult] = await Promise.all([
      this.checkOABCompliance(content),
      this.verifyLegalAccuracy(content, legalArea),
      this.checkGrammar(content),
      this.analyzeBrandVoice(content),
    ])

    // Critical: If OAB fails, cannot proceed
    if (!oabResult.compliant) {
      return {
        oabResult,
        legalResult,
        grammarResult,
        brandResult,
        finalApproval: {
          approved: false,
          decision: 'reject',
          finalScore: 0,
          checklist: {
            oabCompliance: { passed: false, notes: 'Violação OAB detectada' },
            technicalAccuracy: { passed: legalResult.accurate, notes: '' },
            quality: { passed: grammarResult.score >= 70, notes: '' },
            brandAlignment: { passed: brandResult.aligned, notes: '' },
            platformOptimization: { passed: false, notes: 'N/A' },
          },
          requiredChanges: oabResult.violations.map(v => `Corrigir ${v.article}: ${v.description}`),
          optionalImprovements: [],
          summary: 'BLOQUEADO: Violação do Código de Ética da OAB detectada',
        },
        overallScore: 0,
        canPublish: false,
      }
    }

    // Get final approval
    const finalApprovalResult = await this.finalApproval(content, contentType, platform)

    // Calculate overall score
    const scores = [
      oabResult.compliant ? 100 : 0,
      legalResult.accurate ? 100 : 50,
      grammarResult.score,
      brandResult.score,
      finalApprovalResult.finalScore,
    ]
    const overallScore = scores.reduce((a, b) => a + b, 0) / scores.length

    return {
      oabResult,
      legalResult,
      grammarResult,
      brandResult,
      finalApproval: finalApprovalResult,
      overallScore,
      canPublish: finalApprovalResult.decision !== 'reject' && oabResult.compliant,
    }
  }

  // ===========================================================================
  // BATCH OPERATIONS
  // ===========================================================================

  /**
   * Review multiple contents in batch
   */
  async batchReview(
    contents: Array<{ id: string; content: string; contentType: string }>,
    context?: AgentContext
  ): Promise<BatchReviewResult> {
    const contentList = contents
      .map((c, i) => `
[Conteúdo ${i + 1} - ID: ${c.id}]
Tipo: ${c.contentType}
---
${c.content}
---
`)
      .join('\n\n')

    const prompt = `
${BATCH_REVIEW_PROMPT}

CONTEÚDOS PARA REVISÃO EM LOTE:

${contentList}

Revise todos os conteúdos e forneça resultado consolidado no formato JSON especificado.
`

    const response = await this.processStructured<BatchReviewResult>(prompt, context)
    return response
  }

  /**
   * Quick batch OAB check
   */
  async batchOABCheck(
    contents: Array<{ id: string; content: string }>
  ): Promise<Array<{ id: string; passed: boolean; violation?: string }>> {
    const results: Array<{ id: string; passed: boolean; violation?: string }> = []

    // Process in parallel batches
    const batchSize = 3
    for (let i = 0; i < contents.length; i += batchSize) {
      const batch = contents.slice(i, i + batchSize)
      const checks = await Promise.all(
        batch.map(async (c) => {
          const result = await this.quickOABCheck(c.content)
          return { id: c.id, passed: result.passed, violation: result.criticalViolation }
        })
      )
      results.push(...checks)
    }

    return results
  }

  // ===========================================================================
  // HELPER METHODS
  // ===========================================================================

  /**
   * Get severity from score
   */
  getSeverity(score: number): IssueSeverity {
    return getSeverityFromScore(score)
  }

  /**
   * Get approval status from score
   */
  getApproval(score: number): ApprovalDecision {
    return getApprovalStatus(score)
  }

  /**
   * Check if content type requires OAB review
   */
  needsOABReview(contentType: string): boolean {
    return requiresOABReview(contentType)
  }

  /**
   * Auto-fix common issues
   */
  async autoFix(
    content: string,
    issues: ContentIssue[],
    context?: AgentContext
  ): Promise<{ fixedContent: string; fixesApplied: string[] }> {
    const lowAndMediumIssues = issues.filter(
      (i) => i.severity === 'low' || i.severity === 'medium'
    )

    if (lowAndMediumIssues.length === 0) {
      return { fixedContent: content, fixesApplied: [] }
    }

    const prompt = `
Corrija automaticamente os seguintes problemas no conteúdo:

PROBLEMAS:
${lowAndMediumIssues.map((i) => `- ${i.description}: ${i.suggestion}`).join('\n')}

CONTEÚDO:
---
${content}
---

Forneça resposta em JSON:
{
  "fixedContent": "conteúdo corrigido",
  "fixesApplied": ["correção 1", "correção 2"]
}
`

    const response = await this.processStructured<{
      fixedContent: string
      fixesApplied: string[]
    }>(prompt, context)

    return response
  }
}

// =============================================================================
// FACTORY FUNCTION
// =============================================================================

/**
 * Create a new QA Agent instance
 */
export function createQAAgent(config?: Partial<EnhancedAgentConfig>): QAAgent {
  return new QAAgent(config)
}

// =============================================================================
// EXPORTS
// =============================================================================

export { getSeverityFromScore, getApprovalStatus, requiresOABReview }
