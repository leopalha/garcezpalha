import { z } from 'zod'

// ============================================================================
// ENUMS
// ============================================================================

export const taskPriorityEnum = z.enum(['low', 'medium', 'high', 'urgent'], {
  message: 'Prioridade inválida',
})

export const taskStatusEnum = z.enum(['todo', 'in_progress', 'blocked', 'completed', 'cancelled'], {
  message: 'Status inválido',
})

// ============================================================================
// TASK SCHEMAS
// ============================================================================

export const createTaskSchema = z.object({
  title: z.string().min(1, 'Título é obrigatório').max(200, 'Título muito longo'),
  description: z.string().max(2000, 'Descrição muito longa').optional().nullable(),
  status: taskStatusEnum.default('todo'),
  priority: taskPriorityEnum.default('medium'),
  caseId: z.string().uuid('ID do caso inválido').optional().nullable(),
  parentTaskId: z.string().uuid('ID da tarefa pai inválido').optional().nullable(),
  assignedTo: z.string().uuid('ID do usuário inválido').optional().nullable(),
  dueDate: z.string().datetime('Data inválida').optional().nullable(),
  tags: z.array(z.string()).optional(),
  estimatedHours: z.number().int().positive('Horas estimadas devem ser positivas').optional().nullable(),
})

export const updateTaskSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  description: z.string().max(2000).optional().nullable(),
  status: taskStatusEnum.optional(),
  priority: taskPriorityEnum.optional(),
  caseId: z.string().uuid().optional().nullable(),
  assignedTo: z.string().uuid().optional().nullable(),
  dueDate: z.string().datetime().optional().nullable(),
  tags: z.array(z.string()).optional(),
  estimatedHours: z.number().int().positive().optional().nullable(),
  actualHours: z.number().int().min(0, 'Horas reais não podem ser negativas').optional().nullable(),
})

export const listTasksQuerySchema = z.object({
  caseId: z.string().uuid().optional(),
  assignedTo: z.string().uuid().optional(),
  createdBy: z.string().uuid().optional(),
  status: taskStatusEnum.optional(),
  priority: taskPriorityEnum.optional(),
  parentTaskId: z.string().uuid().optional(),
  includeSubtasks: z.coerce.boolean().default(true),
  tags: z.string().optional(), // Comma-separated tags
  dueBefore: z.string().datetime().optional(),
  dueAfter: z.string().datetime().optional(),
  search: z.string().optional(),
  sortBy: z.enum(['created_at', 'updated_at', 'due_date', 'priority']).default('created_at'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
  limit: z.coerce.number().int().positive().max(100).default(50),
  offset: z.coerce.number().int().min(0).default(0),
})

export const taskParamsSchema = z.object({
  id: z.string().uuid('ID da tarefa inválido'),
})

// ============================================================================
// TASK COMMENT SCHEMAS
// ============================================================================

export const createTaskCommentSchema = z.object({
  taskId: z.string().uuid('ID da tarefa inválido'),
  content: z.string().min(1, 'Comentário não pode estar vazio').max(2000, 'Comentário muito longo'),
})

export const updateTaskCommentSchema = z.object({
  content: z.string().min(1).max(2000),
})

export const listTaskCommentsQuerySchema = z.object({
  taskId: z.string().uuid('ID da tarefa inválido'),
  limit: z.coerce.number().int().positive().max(100).default(50),
  offset: z.coerce.number().int().min(0).default(0),
})

// ============================================================================
// TASK ATTACHMENT SCHEMAS
// ============================================================================

export const createTaskAttachmentSchema = z.object({
  taskId: z.string().uuid('ID da tarefa inválido'),
  fileName: z.string().min(1).max(255),
  fileUrl: z.string().url('URL inválida'),
  fileSize: z.number().int().positive().max(10485760), // Max 10MB
  mimeType: z.string(),
})

// ============================================================================
// BULK OPERATIONS
// ============================================================================

export const bulkUpdateTasksSchema = z.object({
  taskIds: z.array(z.string().uuid()).min(1, 'Pelo menos uma tarefa deve ser selecionada').max(50),
  updates: z.object({
    status: taskStatusEnum.optional(),
    priority: taskPriorityEnum.optional(),
    assignedTo: z.string().uuid().optional().nullable(),
  }).refine((data) => Object.keys(data).length > 0, {
    message: 'Pelo menos um campo deve ser atualizado',
  }),
})

export const bulkDeleteTasksSchema = z.object({
  taskIds: z.array(z.string().uuid()).min(1).max(50),
})

// ============================================================================
// STATISTICS SCHEMAS
// ============================================================================

export const taskStatsQuerySchema = z.object({
  caseId: z.string().uuid().optional(),
  assignedTo: z.string().uuid().optional(),
  dateFrom: z.string().datetime().optional(),
  dateTo: z.string().datetime().optional(),
})

// ============================================================================
// TYPE EXPORTS
// ============================================================================

export type TaskPriority = z.infer<typeof taskPriorityEnum>
export type TaskStatus = z.infer<typeof taskStatusEnum>
export type CreateTaskInput = z.infer<typeof createTaskSchema>
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>
export type ListTasksQuery = z.infer<typeof listTasksQuerySchema>
export type CreateTaskCommentInput = z.infer<typeof createTaskCommentSchema>
export type UpdateTaskCommentInput = z.infer<typeof updateTaskCommentSchema>
export type BulkUpdateTasksInput = z.infer<typeof bulkUpdateTasksSchema>
export type BulkDeleteTasksInput = z.infer<typeof bulkDeleteTasksSchema>
export type TaskStatsQuery = z.infer<typeof taskStatsQuerySchema>
