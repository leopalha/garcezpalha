import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { logger } from '@/lib/logger'

export const dynamic = 'force-dynamic'

// ============================================================================
// Bank Statement Import - OFX/CSV Parser
// ============================================================================

type ParsedTransaction = {
  date: string
  description: string
  amount: number
  type: 'credit' | 'debit'
  balance?: number
  reference?: string
}

// ============================================================================
// POST /api/admin/financial/bank-import - Import bank statement
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

    // Parse form data
    const formData = await request.formData()
    const file = formData.get('file') as File
    const bankAccount = formData.get('bankAccount') as string
    const format = formData.get('format') as 'ofx' | 'csv' | 'auto'

    if (!file) {
      return NextResponse.json({ error: 'Arquivo não fornecido' }, { status: 400 })
    }

    if (!bankAccount) {
      return NextResponse.json({ error: 'Conta bancária não especificada' }, { status: 400 })
    }

    // Read file content
    const content = await file.text()

    // Parse based on format
    let transactions: ParsedTransaction[] = []

    const detectedFormat = format === 'auto' ? detectFormat(content) : format

    if (detectedFormat === 'ofx') {
      transactions = parseOFX(content)
    } else if (detectedFormat === 'csv') {
      transactions = parseCSV(content)
    } else {
      return NextResponse.json({ error: 'Formato de arquivo não suportado' }, { status: 400 })
    }

    if (transactions.length === 0) {
      return NextResponse.json({ error: 'Nenhuma transação encontrada no arquivo' }, { status: 400 })
    }

    // Check for duplicates
    const existingHashes = new Set<string>()
    const { data: existingTransactions } = await supabase
      .from('bank_transactions')
      .select('transaction_hash')
      .eq('bank_account', bankAccount)
      .in(
        'transaction_date',
        transactions.map((t) => t.date)
      )

    if (existingTransactions) {
      existingTransactions.forEach((t) => existingHashes.add(t.transaction_hash))
    }

    // Insert new transactions
    const newTransactions = []

    for (const tx of transactions) {
      const hash = generateTransactionHash(bankAccount, tx)

      if (!existingHashes.has(hash)) {
        newTransactions.push({
          bank_account: bankAccount,
          transaction_date: tx.date,
          description: tx.description,
          amount: tx.amount,
          transaction_type: tx.type,
          balance: tx.balance || null,
          reference: tx.reference || null,
          transaction_hash: hash,
          imported_by: user.id,
          status: 'pending_classification', // Needs manual classification
        })
      }
    }

    if (newTransactions.length === 0) {
      return NextResponse.json({
        message: 'Todas as transações já foram importadas anteriormente',
        imported: 0,
        duplicates: transactions.length,
      })
    }

    const { data: importedTransactions, error: importError } = await supabase
      .from('bank_transactions')
      .insert(newTransactions)
      .select()

    if (importError) {
      logger.error('[POST /api/admin/financial/bank-import] Import error:', importError)
      return NextResponse.json({ error: 'Erro ao importar transações' }, { status: 500 })
    }

    return NextResponse.json(
      {
        message: 'Extrato importado com sucesso',
        imported: importedTransactions.length,
        duplicates: transactions.length - newTransactions.length,
        summary: {
          totalCredits: transactions.filter((t) => t.type === 'credit').length,
          totalDebits: transactions.filter((t) => t.type === 'debit').length,
          periodStart: transactions[0]?.date,
          periodEnd: transactions[transactions.length - 1]?.date,
        },
      },
      { status: 201 }
    )
  } catch (err) {
    logger.error('[POST /api/admin/financial/bank-import] Error:', err)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}

// ============================================================================
// Helper Functions
// ============================================================================

function detectFormat(content: string): 'ofx' | 'csv' | 'unknown' {
  if (content.includes('<OFX>') || content.includes('OFXHEADER')) {
    return 'ofx'
  }
  if (content.includes(',') && content.includes('\n')) {
    return 'csv'
  }
  return 'unknown'
}

function parseOFX(content: string): ParsedTransaction[] {
  const transactions: ParsedTransaction[] = []

  // Simple OFX parser - extracts STMTTRN blocks
  const stmtTrnRegex = /<STMTTRN>([\s\S]*?)<\/STMTTRN>/g
  const matches = content.matchAll(stmtTrnRegex)

  for (const match of matches) {
    const block = match[1]

    const dateMatch = block.match(/<DTPOSTED>(\d{8})/)?.[1]
    const amountMatch = block.match(/<TRNAMT>([-\d.]+)/)?.[1]
    const memoMatch = block.match(/<MEMO>(.*?)<\/MEMO>/)?.[1] || block.match(/<NAME>(.*?)<\/NAME>/)?.[1]
    const typeMatch = block.match(/<TRNTYPE>(\w+)/)?.[1]
    const refMatch = block.match(/<FITID>(.*?)<\/FITID>/)?.[1]

    if (dateMatch && amountMatch) {
      const amount = parseFloat(amountMatch)
      const date = new Date(
        parseInt(dateMatch.slice(0, 4)),
        parseInt(dateMatch.slice(4, 6)) - 1,
        parseInt(dateMatch.slice(6, 8))
      )

      transactions.push({
        date: date.toISOString(),
        description: memoMatch || 'Transação bancária',
        amount: Math.abs(amount),
        type: amount >= 0 ? 'credit' : 'debit',
        reference: refMatch,
      })
    }
  }

  return transactions.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
}

function parseCSV(content: string): ParsedTransaction[] {
  const transactions: ParsedTransaction[] = []
  const lines = content.split('\n').filter((line) => line.trim())

  // Skip header
  for (let i = 1; i < lines.length; i++) {
    const parts = lines[i].split(',').map((p) => p.trim().replace(/['"]/g, ''))

    // Common CSV format: Date, Description, Debit, Credit, Balance
    // Adapt based on your bank's format
    if (parts.length >= 4) {
      const [dateStr, description, debitStr, creditStr, balanceStr] = parts

      const debit = parseFloat(debitStr) || 0
      const credit = parseFloat(creditStr) || 0

      if (debit > 0 || credit > 0) {
        // Parse date (assumes DD/MM/YYYY format)
        const [day, month, year] = dateStr.split('/')
        const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day))

        transactions.push({
          date: date.toISOString(),
          description: description || 'Transação bancária',
          amount: debit > 0 ? debit : credit,
          type: debit > 0 ? 'debit' : 'credit',
          balance: balanceStr ? parseFloat(balanceStr) : undefined,
        })
      }
    }
  }

  return transactions.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
}

function generateTransactionHash(bankAccount: string, tx: ParsedTransaction): string {
  const data = `${bankAccount}|${tx.date}|${tx.amount}|${tx.description.slice(0, 50)}`
  // Simple hash - in production, use crypto.createHash
  return Buffer.from(data).toString('base64')
}
