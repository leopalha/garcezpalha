import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'
import { logger } from '@/lib/logger'

export const dynamic = 'force-dynamic'

// ============================================================================
// Invoice Installment Management
// ============================================================================

const createInstallmentSchema = z.object({
  invoiceId: z.string().uuid(),
  numberOfInstallments: z.number().int().min(2).max(48),
  firstDueDate: z.string().datetime(),
  interestRate: z.number().min(0).max(10).default(0), // Monthly interest rate (%)
  notes: z.string().max(500).optional(),
})

const updateInstallmentSchema = z.object({
  status: z.enum(['pending', 'paid', 'late', 'cancelled']).optional(),
  paidAmount: z.number().positive().optional(),
  paymentDate: z.string().datetime().optional(),
  notes: z.string().max(500).optional(),
})

// ============================================================================
// POST /api/admin/financial/installments - Create installment plan
// ============================================================================

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    // Auth check
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })
    }

    // Verify admin role
    const { data: userRole } = await supabase
      .from('user_roles')
      .select('role_name')
      .eq('user_id', user.id)
      .single()

    if (!userRole || !['ADMIN', 'MANAGER'].includes(userRole.role_name)) {
      return NextResponse.json({ error: 'Acesso negado' }, { status: 403 })
    }

    // Parse and validate
    const body = await request.json()
    const data = createInstallmentSchema.parse(body)

    // Fetch invoice
    const { data: invoice, error: invoiceError } = await supabase
      .from('invoices')
      .select('id, total_amount, status')
      .eq('id', data.invoiceId)
      .single()

    if (invoiceError || !invoice) {
      return NextResponse.json({ error: 'Fatura não encontrada' }, { status: 404 })
    }

    if (invoice.status === 'paid') {
      return NextResponse.json({ error: 'Fatura já está paga' }, { status: 400 })
    }

    // Check if installment plan already exists
    const { data: existingPlan } = await supabase
      .from('invoice_installments')
      .select('id')
      .eq('invoice_id', data.invoiceId)
      .limit(1)

    if (existingPlan && existingPlan.length > 0) {
      return NextResponse.json({ error: 'Fatura já possui parcelamento' }, { status: 400 })
    }

    // Calculate installments
    const totalAmount = invoice.total_amount
    const numberOfInstallments = data.numberOfInstallments
    const monthlyInterest = data.interestRate / 100

    const installments = []
    let firstDueDate = new Date(data.firstDueDate)

    for (let i = 0; i < numberOfInstallments; i++) {
      // Calculate amount with interest
      const baseAmount = totalAmount / numberOfInstallments
      const accumulatedInterest = baseAmount * monthlyInterest * i
      const installmentAmount = Math.round((baseAmount + accumulatedInterest) * 100) / 100

      // Calculate due date (add i months)
      const dueDate = new Date(firstDueDate)
      dueDate.setMonth(dueDate.getMonth() + i)

      installments.push({
        invoice_id: data.invoiceId,
        installment_number: i + 1,
        amount: installmentAmount,
        due_date: dueDate.toISOString(),
        status: 'pending',
        created_by: user.id,
      })
    }

    // Insert all installments
    const { data: createdInstallments, error: createError } = await supabase
      .from('invoice_installments')
      .insert(installments)
      .select()

    if (createError) {
      logger.error('[POST /api/admin/financial/installments] Create error:', createError)
      return NextResponse.json({ error: 'Erro ao criar parcelamento' }, { status: 500 })
    }

    // Update invoice status
    await supabase
      .from('invoices')
      .update({ status: 'partially_paid', installment_plan: true })
      .eq('id', data.invoiceId)

    return NextResponse.json(
      {
        message: 'Parcelamento criado com sucesso',
        installments: createdInstallments,
        summary: {
          totalInstallments: numberOfInstallments,
          totalAmount: installments.reduce((sum, inst) => sum + inst.amount, 0),
          interestRate: data.interestRate,
          firstDueDate: installments[0].due_date,
          lastDueDate: installments[installments.length - 1].due_date,
        },
      },
      { status: 201 }
    )
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: 'Dados inválidos', details: err.format() }, { status: 400 })
    }

    logger.error('[POST /api/admin/financial/installments] Error:', err)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}

// ============================================================================
// GET /api/admin/financial/installments - List installments
// ============================================================================

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()

    // Auth check
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const invoiceId = searchParams.get('invoiceId')
    const status = searchParams.get('status')
    const dueBefore = searchParams.get('dueBefore')
    const dueAfter = searchParams.get('dueAfter')

    let query = supabase
      .from('invoice_installments')
      .select(
        `
        *,
        invoice:invoice_id(
          id,
          invoice_number,
          total_amount,
          client:client_id(id, full_name)
        )
      `
      )
      .order('due_date', { ascending: true })

    if (invoiceId) query = query.eq('invoice_id', invoiceId)
    if (status) query = query.eq('status', status)
    if (dueBefore) query = query.lte('due_date', dueBefore)
    if (dueAfter) query = query.gte('due_date', dueAfter)

    const { data, error } = await query

    if (error) {
      logger.error('[GET /api/admin/financial/installments] Query error:', error)
      return NextResponse.json({ error: 'Erro ao buscar parcelas' }, { status: 500 })
    }

    // Mark late installments
    const today = new Date().toISOString()
    const installmentsWithStatus = (data || []).map((inst) => ({
      ...inst,
      isLate: inst.status === 'pending' && inst.due_date < today,
    }))

    return NextResponse.json({ installments: installmentsWithStatus })
  } catch (err) {
    logger.error('[GET /api/admin/financial/installments] Error:', err)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}
