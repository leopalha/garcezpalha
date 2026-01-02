import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'
import { logger } from '@/lib/logger'

export const dynamic = 'force-dynamic'

// ============================================================================
// RPA (Recibo de Pagamento Autônomo) Generation
// ============================================================================

const rpaSchema = z.object({
  caseId: z.string().uuid().optional(),
  lawyerId: z.string().uuid(),
  description: z.string().min(5).max(500),
  value: z.number().positive().max(999999999),
  serviceDate: z.string().datetime(),
  paymentDate: z.string().datetime(),
  irrf: z.boolean().default(false), // Imposto de Renda Retido na Fonte
  inss: z.boolean().default(false), // INSS deduction
  iss: z.boolean().default(false), // ISS municipal tax
  observations: z.string().max(1000).optional(),
})

// Tax rates (2026 Brazilian law - placeholder values)
const TAX_RATES = {
  IRRF: 0.15, // 15% for professionals
  INSS: 0.11, // 11% for autonomous
  ISS: 0.05, // 5% municipal (varies by city)
}

// ============================================================================
// POST /api/admin/financial/rpa - Generate RPA
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

    // Parse and validate request
    const body = await request.json()
    const data = rpaSchema.parse(body)

    // Calculate deductions
    let grossValue = data.value
    let netValue = grossValue

    const deductions: Record<string, number> = {}

    if (data.irrf) {
      const irrf = grossValue * TAX_RATES.IRRF
      deductions.IRRF = irrf
      netValue -= irrf
    }

    if (data.inss) {
      const inss = grossValue * TAX_RATES.INSS
      deductions.INSS = inss
      netValue -= inss
    }

    if (data.iss) {
      const iss = grossValue * TAX_RATES.ISS
      deductions.ISS = iss
      netValue -= iss
    }

    // Fetch lawyer details
    const { data: lawyer, error: lawyerError } = await supabase
      .from('users')
      .select('full_name, email, cpf_cnpj, address, oab_number')
      .eq('id', data.lawyerId)
      .single()

    if (lawyerError || !lawyer) {
      return NextResponse.json({ error: 'Advogado não encontrado' }, { status: 404 })
    }

    // Fetch case details if provided
    type ClientInfo = { full_name: string; cpf_cnpj: string; address: string }
    type CaseDetailsType = {
      case_number: string
      service_type: string
      client: ClientInfo | ClientInfo[] | null
    }
    let caseDetails: CaseDetailsType | null = null
    if (data.caseId) {
      const { data: caseData, error: caseError } = await supabase
        .from('cases')
        .select('case_number, service_type, client:client_id(full_name, cpf_cnpj, address)')
        .eq('id', data.caseId)
        .single()

      if (!caseError && caseData) {
        caseDetails = caseData as unknown as CaseDetailsType
      }
    }

    // Create RPA record
    const rpaNumber = `RPA-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`

    const { data: rpa, error: rpaError } = await supabase
      .from('rpas')
      .insert({
        rpa_number: rpaNumber,
        case_id: data.caseId || null,
        lawyer_id: data.lawyerId,
        description: data.description,
        gross_value: grossValue,
        net_value: netValue,
        irrf_deduction: deductions.IRRF || 0,
        inss_deduction: deductions.INSS || 0,
        iss_deduction: deductions.ISS || 0,
        service_date: data.serviceDate,
        payment_date: data.paymentDate,
        observations: data.observations || null,
        status: 'pending_payment',
        created_by: user.id,
      })
      .select()
      .single()

    if (rpaError) {
      logger.error('[POST /api/admin/financial/rpa] Create error:', rpaError)
      return NextResponse.json({ error: 'Erro ao criar RPA' }, { status: 500 })
    }

    // Generate PDF document
    const pdfData = {
      rpaNumber,
      lawyer: {
        name: lawyer.full_name,
        cpf: lawyer.cpf_cnpj,
        oab: lawyer.oab_number,
        address: lawyer.address,
      },
      client: (() => {
        if (!caseDetails?.client) return null
        const clientData = Array.isArray(caseDetails.client) ? caseDetails.client[0] : caseDetails.client
        return clientData ? { name: clientData.full_name, cpfCnpj: clientData.cpf_cnpj } : null
      })(),
      case: caseDetails
        ? {
            number: caseDetails.case_number,
            type: caseDetails.service_type,
          }
        : null,
      service: {
        description: data.description,
        date: new Date(data.serviceDate).toLocaleDateString('pt-BR'),
      },
      payment: {
        grossValue,
        deductions,
        netValue,
        date: new Date(data.paymentDate).toLocaleDateString('pt-BR'),
      },
      observations: data.observations,
      issuedAt: new Date().toLocaleString('pt-BR'),
    }

    // TODO: Generate actual PDF using pdf-lib or similar
    // For now, return the data structure

    return NextResponse.json(
      {
        message: 'RPA criado com sucesso',
        rpa: {
          id: rpa.id,
          rpaNumber,
          grossValue,
          netValue,
          deductions,
        },
        pdfData,
      },
      { status: 201 }
    )
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: 'Dados inválidos', details: err.format() }, { status: 400 })
    }

    logger.error('[POST /api/admin/financial/rpa] Error:', err)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}

// ============================================================================
// GET /api/admin/financial/rpa - List RPAs
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

    // Query parameters
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const lawyerId = searchParams.get('lawyerId')
    const caseId = searchParams.get('caseId')
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')

    let query = supabase
      .from('rpas')
      .select(
        `
        *,
        lawyer:lawyer_id(id, full_name, email, oab_number),
        case:case_id(id, case_number, service_type),
        creator:created_by(id, full_name)
      `
      )
      .order('created_at', { ascending: false })

    if (status) query = query.eq('status', status)
    if (lawyerId) query = query.eq('lawyer_id', lawyerId)
    if (caseId) query = query.eq('case_id', caseId)
    if (startDate) query = query.gte('service_date', startDate)
    if (endDate) query = query.lte('service_date', endDate)

    const { data, error } = await query

    if (error) {
      logger.error('[GET /api/admin/financial/rpa] Query error:', error)
      return NextResponse.json({ error: 'Erro ao buscar RPAs' }, { status: 500 })
    }

    return NextResponse.json({ rpas: data || [] })
  } catch (err) {
    logger.error('[GET /api/admin/financial/rpa] Error:', err)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}
