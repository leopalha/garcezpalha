import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/options'
import { createLogger } from '@/lib/logger'
import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'
import { formatZodErrors } from '@/lib/zod-helpers'

const logger = createLogger('api:admin:expenses')

const createExpenseSchema = z.object({
  type: z.enum(['court_costs', 'travel', 'office', 'professional_fees', 'other']),
  category: z.string().min(3, 'Categoria muito curta').max(100),
  description: z.string().min(3, 'Descrição muito curta'),
  amount: z.number().positive('Valor deve ser positivo'),
  payment_method: z.enum(['cash', 'credit_card', 'debit_card', 'bank_transfer', 'pix']).optional(),
  payment_status: z.enum(['pending', 'paid', 'cancelled']).default('pending'),
  expense_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Data inválida (use YYYY-MM-DD)'),
  payment_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Data inválida (use YYYY-MM-DD)').optional(),
  due_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Data inválida (use YYYY-MM-DD)').optional(),
  case_id: z.string().uuid().optional(),
  client_id: z.string().uuid().optional(),
  receipt_url: z.string().url().optional(),
  notes: z.string().optional(),
  is_reimbursable: z.boolean().default(false),
})

/**
 * GET /api/admin/expenses
 * List expenses with filters
 */
export async function GET(request: NextRequest) {
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

    const supabase = await createClient()

    // Check if user is admin or lawyer
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', session.user.id)
      .single()

    if (!profile || !['admin', 'lawyer'].includes(profile.role)) {
      logger.warn('Unauthorized role tried to access expenses', {
        userId: session.user.id,
        role: profile?.role
      })
      return NextResponse.json(
        { error: 'Acesso negado' },
        { status: 403 }
      )
    }

    // Get query parameters for filtering
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')
    const category = searchParams.get('category')
    const status = searchParams.get('status')
    const caseId = searchParams.get('case_id')
    const startDate = searchParams.get('start_date')
    const endDate = searchParams.get('end_date')
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')

    logger.info('Fetching expenses', {
      userId: session.user.id,
      filters: { type, category, status, caseId, startDate, endDate }
    })

    // Build query
    let query = supabase
      .from('expenses')
      .select(`
        *,
        case:cases(id, case_number, service_type),
        client:profiles!expenses_client_id_fkey(id, full_name),
        responsible:profiles!expenses_responsible_id_fkey(id, full_name)
      `, { count: 'exact' })

    // Apply filters
    if (type) query = query.eq('type', type)
    if (category) query = query.eq('category', category)
    if (status) query = query.eq('payment_status', status)
    if (caseId) query = query.eq('case_id', caseId)
    if (startDate) query = query.gte('expense_date', startDate)
    if (endDate) query = query.lte('expense_date', endDate)

    // If lawyer, only show their cases' expenses
    if (profile.role === 'lawyer') {
      query = query.eq('responsible_id', session.user.id)
    }

    // Execute query with pagination
    const { data: expenses, error: expensesError, count } = await query
      .order('expense_date', { ascending: false })
      .range(offset, offset + limit - 1)

    if (expensesError) {
      logger.error('Error fetching expenses', { error: expensesError })
      throw new Error('Failed to fetch expenses')
    }

    // Calculate totals
    const totalAmount = expenses?.reduce((sum, exp) => sum + parseFloat(exp.amount.toString()), 0) || 0
    const pendingAmount = expenses
      ?.filter(exp => exp.payment_status === 'pending')
      .reduce((sum, exp) => sum + parseFloat(exp.amount.toString()), 0) || 0

    logger.info('Expenses retrieved successfully', {
      userId: session.user.id,
      count: expenses?.length
    })

    return NextResponse.json({
      expenses: expenses || [],
      pagination: {
        total: count || 0,
        limit,
        offset,
        hasMore: (count || 0) > offset + limit
      },
      summary: {
        totalAmount,
        pendingAmount,
        paidAmount: totalAmount - pendingAmount
      }
    })

  } catch (error) {
    logger.error('Error in expenses GET', error)
    return NextResponse.json(
      { error: 'Erro ao carregar despesas' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/admin/expenses
 * Create a new expense
 */
export async function POST(request: NextRequest) {
  try {
    // Auth check
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      logger.warn('Unauthorized expense creation attempt')
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      )
    }

    const supabase = await createClient()

    // Check if user is admin or lawyer
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', session.user.id)
      .single()

    if (!profile || !['admin', 'lawyer'].includes(profile.role)) {
      logger.warn('Unauthorized role tried to create expense', {
        userId: session.user.id,
        role: profile?.role
      })
      return NextResponse.json(
        { error: 'Acesso negado' },
        { status: 403 }
      )
    }

    // Parse and validate request body
    const body = await request.json()
    const validatedData = createExpenseSchema.parse(body)

    logger.info('Creating new expense', {
      userId: session.user.id,
      type: validatedData.type,
      amount: validatedData.amount
    })

    // If case_id is provided, verify case exists and user has access
    if (validatedData.case_id) {
      const { data: caseData, error: caseError } = await supabase
        .from('cases')
        .select('id, lawyer_id, client_id')
        .eq('id', validatedData.case_id)
        .single()

      if (caseError || !caseData) {
        return NextResponse.json(
          { error: 'Caso não encontrado' },
          { status: 404 }
        )
      }

      // Lawyers can only create expenses for their own cases
      if (profile.role === 'lawyer' && caseData.lawyer_id !== session.user.id) {
        return NextResponse.json(
          { error: 'Você não tem permissão para adicionar despesas a este caso' },
          { status: 403 }
        )
      }

      // Auto-fill client_id from case if not provided
      if (!validatedData.client_id && caseData.client_id) {
        validatedData.client_id = caseData.client_id
      }
    }

    // Create expense
    const { data: expense, error: createError } = await supabase
      .from('expenses')
      .insert({
        ...validatedData,
        responsible_id: session.user.id,
        created_by: session.user.id
      })
      .select()
      .single()

    if (createError) {
      logger.error('Error creating expense', { error: createError })
      throw new Error('Failed to create expense')
    }

    // Create financial transaction record
    await supabase
      .from('financial_transactions')
      .insert({
        transaction_type: 'expense',
        category: validatedData.category,
        description: validatedData.description,
        amount: validatedData.amount,
        payment_method: validatedData.payment_method,
        payment_status: validatedData.payment_status,
        transaction_date: new Date(validatedData.expense_date).toISOString(),
        reference_type: 'expense',
        reference_id: expense.id,
        source: validatedData.case_id ? 'case' : 'office',
        created_by: session.user.id
      })

    logger.info('Expense created successfully', {
      userId: session.user.id,
      expenseId: expense.id
    })

    return NextResponse.json(expense, { status: 201 })

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

    logger.error('Error in expenses POST', error)
    return NextResponse.json(
      { error: 'Erro ao criar despesa' },
      { status: 500 }
    )
  }
}

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
