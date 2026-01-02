import { z } from 'zod'

// ============================================================================
// CLIENT CASE SCHEMAS
// ============================================================================

export const caseStatusEnum = z.enum([
  'aguardando_documentos',
  'em_analise',
  'em_andamento',
  'concluido',
  'cancelado'
], {
  message: 'Status inválido'
})

export const timelineEventTypeEnum = z.enum([
  'created',
  'document_submitted',
  'status_changed',
  'message',
  'deadline',
  'payment',
  'meeting'
], {
  message: 'Tipo de evento inválido'
})

export const documentStatusEnum = z.enum([
  'pending',
  'approved',
  'rejected',
  'under_review'
], {
  message: 'Status de documento inválido'
})

// Client Dashboard Schema
export const clientDashboardQuerySchema = z.object({
  userId: z.string().uuid().optional(),
})

// Client Cases List Schema
export const clientCasesQuerySchema = z.object({
  status: caseStatusEnum.optional(),
  search: z.string().optional(),
  limit: z.number().int().positive().max(100).default(20),
  offset: z.number().int().min(0).default(0),
})

// Client Case Detail Schema
export const clientCaseParamsSchema = z.object({
  id: z.string().uuid('ID do caso inválido'),
})

// Create Case Schema (for admin)
export const createCaseSchema = z.object({
  clientId: z.string().uuid('ID do cliente inválido'),
  lawyerId: z.string().uuid('ID do advogado inválido'),
  serviceType: z.string().min(3, 'Tipo de serviço é obrigatório').max(200),
  status: caseStatusEnum.default('aguardando_documentos'),
  description: z.string().max(1000).optional(),
  caseNumber: z.string().max(50).optional(), // número do processo judicial
  court: z.string().max(200).optional(), // tribunal
  value: z.number().positive().optional(), // valor da causa
})

// Update Case Schema
export const updateCaseSchema = z.object({
  status: caseStatusEnum.optional(),
  currentPhase: z.string().max(200).optional(),
  progress: z.number().int().min(0).max(100).optional(),
  nextStep: z.string().max(500).optional(),
  description: z.string().max(1000).optional(),
})

// Timeline Event Schema
export const createTimelineEventSchema = z.object({
  caseId: z.string().uuid('ID do caso inválido'),
  type: timelineEventTypeEnum,
  title: z.string().min(1).max(200),
  description: z.string().max(1000).optional(),
})

// Case Document Schema
export const createCaseDocumentSchema = z.object({
  caseId: z.string().uuid('ID do caso inválido'),
  name: z.string().min(1).max(255),
  type: z.string().max(100),
  fileUrl: z.string().url('URL do arquivo inválida'),
  fileSize: z.number().int().positive(),
  mimeType: z.string(),
})

// Update Document Status Schema
export const updateDocumentStatusSchema = z.object({
  status: documentStatusEnum,
  notes: z.string().max(500).optional(),
})

// ============================================================================
// CLIENT NOTIFICATIONS SCHEMAS
// ============================================================================

export const notificationTypeEnum = z.enum([
  'message',
  'document',
  'case_update',
  'deadline',
  'payment'
], {
  message: 'Tipo de notificação inválido'
})

export const createNotificationSchema = z.object({
  userId: z.string().uuid('ID do usuário inválido'),
  type: notificationTypeEnum,
  title: z.string().min(1).max(200),
  description: z.string().max(500).optional(),
  link: z.string().max(500).optional(),
  metadata: z.record(z.string(), z.any()).optional(),
})

export const markNotificationReadSchema = z.object({
  notificationIds: z.array(z.string().uuid()).min(1),
})

// ============================================================================
// CLIENT MESSAGES SCHEMAS
// ============================================================================

export const sendMessageSchema = z.object({
  caseId: z.string().uuid('ID do caso inválido').optional(),
  recipientId: z.string().uuid('ID do destinatário inválido'),
  content: z.string().min(1, 'Mensagem não pode estar vazia').max(5000),
  attachments: z.array(z.object({
    fileUrl: z.string().url(),
    fileName: z.string(),
    fileSize: z.number().int().positive(),
    mimeType: z.string(),
  })).optional(),
})

export const getMessagesQuerySchema = z.object({
  caseId: z.string().uuid().optional(),
  conversationId: z.string().uuid().optional(),
  limit: z.number().int().positive().max(100).default(50),
  before: z.string().datetime().optional(), // cursor-based pagination
})

// ============================================================================
// TYPE EXPORTS
// ============================================================================

export type CaseStatus = z.infer<typeof caseStatusEnum>
export type TimelineEventType = z.infer<typeof timelineEventTypeEnum>
export type DocumentStatus = z.infer<typeof documentStatusEnum>
export type NotificationType = z.infer<typeof notificationTypeEnum>
export type CreateCaseInput = z.infer<typeof createCaseSchema>
export type UpdateCaseInput = z.infer<typeof updateCaseSchema>
export type CreateTimelineEventInput = z.infer<typeof createTimelineEventSchema>
export type CreateCaseDocumentInput = z.infer<typeof createCaseDocumentSchema>
export type SendMessageInput = z.infer<typeof sendMessageSchema>
