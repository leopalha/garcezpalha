/**
 * Document Review Queue
 * Manages the review workflow for AI-generated legal documents
 *
 * Flow:
 * 1. Document generated -> Added to queue with status 'pending'
 * 2. Admin reviews document
 * 3. Admin approves/rejects with notes
 * 4. If approved -> Ready for client delivery
 * 5. If rejected -> Returns to generation with feedback
 */

import { createClient } from '@supabase/supabase-js'
import { documentGenerator, type GeneratedDocument } from './document-generator'
import { docxExporter } from './docx-exporter'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export interface ReviewQueueItem {
  id: string
  documentId: string
  leadId: string
  documentType: string
  title: string
  priority: 'high' | 'medium' | 'low'
  status: 'pending' | 'in_review' | 'approved' | 'rejected'
  assignedTo?: string
  createdAt: Date
  reviewedAt?: Date
  reviewedBy?: string
  reviewNotes?: string
}

export interface ReviewQueueFilters {
  status?: ReviewQueueItem['status']
  priority?: ReviewQueueItem['priority']
  assignedTo?: string
  documentType?: string
  limit?: number
  offset?: number
}

export interface ReviewStats {
  total: number
  pending: number
  inReview: number
  approved: number
  rejected: number
  avgReviewTimeMinutes: number
}

/**
 * Review Queue Manager
 */
export class ReviewQueueManager {
  /**
   * Get queue items with filters
   */
  async getQueueItems(filters: ReviewQueueFilters = {}): Promise<ReviewQueueItem[]> {
    let query = supabase
      .from('review_queue')
      .select('*')
      .order('created_at', { ascending: false })

    if (filters.status) {
      query = query.eq('status', filters.status)
    }
    if (filters.priority) {
      query = query.eq('priority', filters.priority)
    }
    if (filters.assignedTo) {
      query = query.eq('assigned_to', filters.assignedTo)
    }
    if (filters.documentType) {
      query = query.eq('document_type', filters.documentType)
    }
    if (filters.limit) {
      query = query.limit(filters.limit)
    }
    if (filters.offset) {
      query = query.range(filters.offset, filters.offset + (filters.limit || 10) - 1)
    }

    const { data, error } = await query

    if (error) {
      console.error('[ReviewQueue] Error fetching items:', error)
      return []
    }

    return data.map(this.mapDbToItem)
  }

  /**
   * Get pending items for review (prioritized)
   */
  async getPendingItems(limit: number = 20): Promise<ReviewQueueItem[]> {
    const { data, error } = await supabase
      .from('review_queue')
      .select('*')
      .eq('status', 'pending')
      .order('priority', { ascending: false }) // high first
      .order('created_at', { ascending: true }) // oldest first
      .limit(limit)

    if (error) {
      console.error('[ReviewQueue] Error fetching pending items:', error)
      return []
    }

    return data.map(this.mapDbToItem)
  }

  /**
   * Get item with full document content
   */
  async getItemWithDocument(itemId: string): Promise<{
    item: ReviewQueueItem
    document: GeneratedDocument
  } | null> {
    const { data: itemData, error: itemError } = await supabase
      .from('review_queue')
      .select('*')
      .eq('id', itemId)
      .single()

    if (itemError || !itemData) {
      return null
    }

    const document = await documentGenerator.getDocument(itemData.document_id)
    if (!document) {
      return null
    }

    return {
      item: this.mapDbToItem(itemData),
      document
    }
  }

  /**
   * Assign item to reviewer
   */
  async assignToReviewer(itemId: string, reviewerId: string): Promise<boolean> {
    const { error } = await supabase
      .from('review_queue')
      .update({
        assigned_to: reviewerId,
        status: 'in_review',
        updated_at: new Date().toISOString()
      })
      .eq('id', itemId)

    if (error) {
      console.error('[ReviewQueue] Error assigning item:', error)
      return false
    }

    return true
  }

  /**
   * Approve document
   */
  async approveDocument(
    itemId: string,
    reviewerId: string,
    notes?: string
  ): Promise<boolean> {
    // Update queue item
    const { data: queueItem, error: queueError } = await supabase
      .from('review_queue')
      .update({
        status: 'approved',
        reviewed_at: new Date().toISOString(),
        reviewed_by: reviewerId,
        review_notes: notes
      })
      .eq('id', itemId)
      .select()
      .single()

    if (queueError || !queueItem) {
      console.error('[ReviewQueue] Error approving item:', queueError)
      return false
    }

    // Update document status
    await documentGenerator.updateDocumentStatus(
      queueItem.document_id,
      'approved',
      reviewerId,
      notes
    )

    // Notify relevant parties (could trigger email/WhatsApp)
    await this.notifyApproval(queueItem.document_id, queueItem.lead_id)

    return true
  }

  /**
   * Reject document
   */
  async rejectDocument(
    itemId: string,
    reviewerId: string,
    reason: string
  ): Promise<boolean> {
    // Update queue item
    const { data: queueItem, error: queueError } = await supabase
      .from('review_queue')
      .update({
        status: 'rejected',
        reviewed_at: new Date().toISOString(),
        reviewed_by: reviewerId,
        review_notes: reason
      })
      .eq('id', itemId)
      .select()
      .single()

    if (queueError || !queueItem) {
      console.error('[ReviewQueue] Error rejecting item:', queueError)
      return false
    }

    // Update document status
    await documentGenerator.updateDocumentStatus(
      queueItem.document_id,
      'rejected',
      reviewerId,
      reason
    )

    return true
  }

  /**
   * Request revision (add feedback for regeneration)
   */
  async requestRevision(
    itemId: string,
    reviewerId: string,
    feedback: string
  ): Promise<boolean> {
    // Update queue item with feedback
    const { data: queueItem, error } = await supabase
      .from('review_queue')
      .update({
        status: 'pending',
        review_notes: feedback,
        assigned_to: null
      })
      .eq('id', itemId)
      .select()
      .single()

    if (error || !queueItem) {
      console.error('[ReviewQueue] Error requesting revision:', error)
      return false
    }

    // Add revision request to document
    await supabase
      .from('generated_documents')
      .update({
        status: 'draft',
        review_notes: feedback
      })
      .eq('id', queueItem.document_id)

    return true
  }

  /**
   * Get review statistics
   */
  async getStats(): Promise<ReviewStats> {
    const { data, error } = await supabase
      .from('review_queue')
      .select('status, created_at, reviewed_at')

    if (error || !data) {
      return {
        total: 0,
        pending: 0,
        inReview: 0,
        approved: 0,
        rejected: 0,
        avgReviewTimeMinutes: 0
      }
    }

    const stats = {
      total: data.length,
      pending: data.filter(d => d.status === 'pending').length,
      inReview: data.filter(d => d.status === 'in_review').length,
      approved: data.filter(d => d.status === 'approved').length,
      rejected: data.filter(d => d.status === 'rejected').length,
      avgReviewTimeMinutes: 0
    }

    // Calculate average review time
    const reviewedItems = data.filter(d => d.reviewed_at && d.created_at)
    if (reviewedItems.length > 0) {
      const totalMinutes = reviewedItems.reduce((sum, item) => {
        const created = new Date(item.created_at).getTime()
        const reviewed = new Date(item.reviewed_at).getTime()
        return sum + (reviewed - created) / 60000
      }, 0)
      stats.avgReviewTimeMinutes = Math.round(totalMinutes / reviewedItems.length)
    }

    return stats
  }

  /**
   * Export document to DOCX
   */
  async exportDocumentToDocx(documentId: string): Promise<{
    success: boolean
    buffer?: Buffer
    filename?: string
    error?: string
  }> {
    const document = await documentGenerator.getDocument(documentId)
    if (!document) {
      return { success: false, error: 'Document not found' }
    }

    return await docxExporter.exportToDocx({
      title: document.title,
      content: document.content,
      author: 'Garcez Palha - Inteligencia Juridica',
      lawyerName: document.variables.ADVOGADO_NOME,
      lawyerOab: document.variables.ADVOGADO_OAB,
      includeHeader: true,
      includeFooter: true,
      includePageNumbers: true
    })
  }

  /**
   * Notify approval (stub for future integration)
   */
  private async notifyApproval(documentId: string, leadId: string): Promise<void> {
    console.log(`[ReviewQueue] Document ${documentId} approved for lead ${leadId}`)
    // Future: Send WhatsApp/email notification
    // Future: Update lead status
    // Future: Trigger delivery workflow
  }

  /**
   * Map database record to ReviewQueueItem
   */
  private mapDbToItem(data: any): ReviewQueueItem {
    return {
      id: data.id,
      documentId: data.document_id,
      leadId: data.lead_id,
      documentType: data.document_type,
      title: data.title,
      priority: data.priority,
      status: data.status,
      assignedTo: data.assigned_to,
      createdAt: new Date(data.created_at),
      reviewedAt: data.reviewed_at ? new Date(data.reviewed_at) : undefined,
      reviewedBy: data.reviewed_by,
      reviewNotes: data.review_notes
    }
  }
}

// Export singleton
export const reviewQueueManager = new ReviewQueueManager()
