import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/options'
import { createLogger } from '@/lib/logger'
import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'
import { formatZodErrors } from '@/lib/zod-helpers'

const logger = createLogger('api:admin:expenses:id')

const updateExpenseSchema = z.object({
  type: z.enum(['court_costs', 'travel', 'office', 'professional_fees', 'other']).optional(),
  category: z.string().min(3).max(100).optional(),
  description: z.string().min(3).optional(),
  amount: z.number().positive().optional(),
  payment_method: z.enum(['cash', 'credit_card', 'debit_card', 'bank_transfer', 'pix']).optional(),
  payment_status: z.enum(['pending', 'paid', 'cancelled']).optional(),
  expense_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  payment_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  due_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  receipt_url: z.string().url().optional(),
  notes: z.string().optional(),
  is_reimbursable: z.boolean().optional(),
  reimbursed: z.boolean().optional(),
})

/**
 * GET /api/admin/expenses/[id]
 * Get detailed information about an expense
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Auth check
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      logger.warn('Unauthorized access attempt')
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      )
    }

    const expenseId = params.id

    const supabase = await createClient()

    // Check if user is admin or lawyer
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', session.user.id)
      .single()

    if (!profile || !['admin', 'lawyer'].includes(profile.role)) {
      logger.warn('Unauthorized role tried to access expense', {
        userId: session.user.id,
        role: profile?.role
      })
      return NextResponse.json(
        { error: 'Acesso negado' },
        { status: 403 }
      )
    }

    logger.info('Fetching expense details', {
      userId: session.user.id,
      expenseId
    })

    // Get expense with relations
    const { data: expense, error: expenseError } = await supabase
      .from('expenses')
      .select(`
        *,
        case:cases(id, case_number, service_type, status),
        client:profiles!expenses_client_id_fkey(id, full_name, email),
        responsible:profiles!expenses_responsible_id_fkey(id, full_name, email),
        created_by_user:profiles!expenses_created_by_fkey(id, full_name),
        reimbursed_by_user:profiles!expenses_reimbursed_by_fkey(id, full_name)
      `)
      .eq('id', expenseId)
      .single()

    if (expenseError || !expense) {
      logger.warn('Expense not found', { expenseId })
      return NextResponse.json(
        { error: 'Despesa não encontrada' },
        { status: 404 }
      )
    }

    // If lawyer, verify they have access
    if (profile.role === 'lawyer' && expense.responsible_id !== session.user.id) {
      logger.warn('Lawyer tried to access expense from another lawyer', {
        userId: session.user.id,
        expenseId
      })
      return NextResponse.json(
        { error: 'Acesso negado' },
        { status: 403 }
      )
    }

    logger.info('Expense details retrieved successfully', {
      userId: session.user.id,
      expenseId
    })

    return NextResponse.json(expense)

  } catch (error) {
    logger.error('Error in expense GET', error)
    return NextResponse.json(
      { error: 'Erro ao carregar despesa' },
      { status: 500 }
    )
  }
}

/**
 * PATCH /api/admin/expenses/[id]
 * Update expense information
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Auth check
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      logger.warn('Unauthorized update attempt')
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      )
    }

    const expenseId = params.id

    const supabase = await createClient()

    // Check if user is admin or lawyer
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', session.user.id)
      .single()

    if (!profile || !['admin', 'lawyer'].includes(profile.role)) {
      logger.warn('Unauthorized role tried to update expense', {
        userId: session.user.id,
        role: profile?.role
      })
      return NextResponse.json(
        { error: 'Acesso negado' },
        { status: 403 }
      )
    }

    // Get existing expense
    const { data: existingExpense } = await supabase
      .from('expenses')
      .select('id, responsible_id, payment_status, amount, reimbursed')
      .eq('id', expenseId)
      .single()

    if (!existingExpense) {
      return NextResponse.json(
        { error: 'Despesa não encontrada' },
        { status: 404 }
      )
    }

    // If lawyer, verify they created this expense
    if (profile.role === 'lawyer' && existingExpense.responsible_id !== session.user.id) {
      logger.warn('Lawyer tried to update expense from another lawyer', {
        userId: session.user.id,
        expenseId
      })
      return NextResponse.json(
        { error: 'Você só pode editar suas próprias despesas' },
        { status: 403 }
      )
    }

    // Parse and validate request body
    const body = await request.json()
    const validatedData = updateExpenseSchema.parse(body)

    // Prepare update object
    const updateData: any = {
      ...validatedData,
      updated_at: new Date().toISOString()
    }

    // If marking as paid, set payment_date to now if not provided
    if (validatedData.payment_status === 'paid' && !validatedData.payment_date) {
      updateData.payment_date = new Date().toISOString().split('T')[0]
    }

    // If marking as reimbursed
    if (validatedData.reimbursed === true && !existingExpense.reimbursed) {
      updateData.reimbursed_at = new Date().toISOString()
      updateData.reimbursed_by = session.user.id
    }

    logger.info('Updating expense', {
      userId: session.user.id,
      expenseId,
      updates: Object.keys(validatedData)
    })

    // Update expense
    const { data: expense, error: updateError } = await supabase
      .from('expenses')
      .update(updateData)
      .eq('id', expenseId)
      .select()
      .single()

    if (updateError) {
      logger.error('Error updating expense', { error: updateError })
      throw new Error('Failed to update expense')
    }

    // If payment_status changed, update financial transaction
    if (validatedData.payment_status && validatedData.payment_status !== existingExpense.payment_status) {
      await supabase
        .from('financial_transactions')
        .update({
          payment_status: validatedData.payment_status,
          updated_at: new Date().toISOString()
        })
        .eq('reference_type', 'expense')
        .eq('reference_id', expenseId)
    }

    logger.info('Expense updated successfully', {
      userId: session.user.id,
      expenseId
    })

    return NextResponse.json(expense)

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: 'Dados inválidos',
          details: formatZodErrors(error),
        },
        { status: 400 }
      )
    }

    logger.error('Error in expense PATCH', error)
    return NextResponse.json(
      { error: 'Erro ao atualizar despesa' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/admin/expenses/[id]
 * Delete an expense
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Auth check
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      logger.warn('Unauthorized delete attempt')
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      )
    }

    const expenseId = params.id

    const supabase = await createClient()

    // Check if user is admin or lawyer
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', session.user.id)
      .single()

    if (!profile || !['admin', 'lawyer'].includes(profile.role)) {
      logger.warn('Unauthorized role tried to delete expense', {
        userId: session.user.id,
        role: profile?.role
      })
      return NextResponse.json(
        { error: 'Acesso negado' },
        { status: 403 }
      )
    }

    // Get existing expense
    const { data: existingExpense } = await supabase
      .from('expenses')
      .select('id, responsible_id, payment_status, reimbursed')
      .eq('id', expenseId)
      .single()

    if (!existingExpense) {
      return NextResponse.json(
        { error: 'Despesa não encontrada' },
        { status: 404 }
      )
    }

    // If lawyer, verify they created this expense
    if (profile.role === 'lawyer' && existingExpense.responsible_id !== session.user.id) {
      logger.warn('Lawyer tried to delete expense from another lawyer', {
        userId: session.user.id,
        expenseId
      })
      return NextResponse.json(
        { error: 'Você só pode excluir suas próprias despesas' },
        { status: 403 }
      )
    }

    // Prevent deletion of paid or reimbursed expenses (admins can override)
    if (profile.role === 'lawyer') {
      if (existingExpense.payment_status === 'paid') {
        return NextResponse.json(
          { error: 'Não é possível excluir uma despesa já paga' },
          { status: 400 }
        )
      }
      if (existingExpense.reimbursed) {
        return NextResponse.json(
          { error: 'Não é possível excluir uma despesa já reembolsada' },
          { status: 400 }
        )
      }
    }

    logger.info('Deleting expense', {
      userId: session.user.id,
      expenseId
    })

    // Soft delete: mark as cancelled instead of deleting
    const { error: updateError } = await supabase
      .from('expenses')
      .update({
        payment_status: 'cancelled',
        updated_at: new Date().toISOString()
      })
      .eq('id', expenseId)

    if (updateError) {
      logger.error('Error deleting expense', { error: updateError })
      throw new Error('Failed to delete expense')
    }

    // Update financial transaction
    await supabase
      .from('financial_transactions')
      .update({
        payment_status: 'cancelled',
        updated_at: new Date().toISOString()
      })
      .eq('reference_type', 'expense')
      .eq('reference_id', expenseId)

    logger.info('Expense deleted successfully', {
      userId: session.user.id,
      expenseId
    })

    return NextResponse.json({ success: true })

  } catch (error) {
    logger.error('Error in expense DELETE', error)
    return NextResponse.json(
      { error: 'Erro ao excluir despesa' },
      { status: 500 }
    )
  }
}

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
