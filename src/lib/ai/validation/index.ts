/**
 * AI Validation - Sistema de validação Human-in-the-Loop
 * Export all validation and approval workflow tools
 */

export { LegalReviewQueue, legalReviewQueue, type ReviewQueueItem } from './legal-review-queue'
export { ApprovalWorkflow, approvalWorkflow, type DocumentWorkflow, type WorkflowStep } from './approval-workflow'

// Usage example:
/*
import { legalReviewQueue, approvalWorkflow } from '@/lib/ai/validation'
import { oabComplianceChecker } from '@/lib/ai/tools'

// Complete workflow: Generation → Validation → Review → Approval → Send

// 1. Generate document with AI agent
const document = await realEstateAgent.generateContract(...)

// 2. Start approval workflow
const workflow = await approvalWorkflow.startWorkflow({
  documentoId: document.id,
  tipo: 'contrato',
  conteudo: document.content,
  leadId: 'lead_123',
  agenteCriador: 'real-estate-agent',
  autoApproveThreshold: 90, // Auto-approve if score >= 90
})

// If workflow.requerRevisaoHumana === true:
// 3. Human reviewer checks the queue
const pendingReviews = await legalReviewQueue.getPendingReviews({
  prioridade: 'alta',
})

// 4. Reviewer approves or rejects
await legalReviewQueue.approveDocument({
  itemId: pendingReviews[0].id,
  revisorId: 'revisor_1',
  observacoes: 'Documento aprovado após correções',
})

// 5. Workflow resumes and sends to client
await approvalWorkflow.resumeAfterReview({
  workflowId: workflow.id,
  aprovado: true,
  revisorId: 'revisor_1',
  revisorNome: 'Dr. João Silva',
})
*/
