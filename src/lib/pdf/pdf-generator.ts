/**
 * PDF Generator Library
 * Universal PDF generation for proposals, invoices, contracts, reports, and compliance exports
 */

import { PDFDocument, rgb, StandardFonts } from 'pdf-lib'

interface PDFGenerationOptions {
  type: 'proposal' | 'invoice' | 'contract' | 'report' | 'compliance'
  data: any
  branding?: {
    logo?: string
    companyName?: string
    primaryColor?: string
  }
}

/**
 * Generate PDF from structured data
 */
export async function generatePDF(options: PDFGenerationOptions): Promise<Buffer> {
  const { type, data, branding } = options

  switch (type) {
    case 'proposal':
      return generateProposalPDF(data, branding)
    case 'invoice':
      return generateInvoicePDF(data, branding)
    case 'contract':
      return generateContractPDF(data, branding)
    case 'report':
      return generateReportPDF(data, branding)
    case 'compliance':
      return generateCompliancePDF(data, branding)
    default:
      throw new Error(`Unsupported PDF type: ${type}`)
  }
}

/**
 * Generate Proposal PDF
 */
async function generateProposalPDF(data: any, branding?: any): Promise<Buffer> {
  const pdfDoc = await PDFDocument.create()
  const page = pdfDoc.addPage([595, 842]) // A4 size
  const { width, height } = page.getSize()

  const font = await pdfDoc.embedFont(StandardFonts.Helvetica)
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold)

  // Header
  page.drawText(branding?.companyName || 'Garcez Palha', {
    x: 50,
    y: height - 50,
    size: 24,
    font: boldFont,
    color: rgb(0.2, 0.3, 0.5),
  })

  // Title
  page.drawText('PROPOSTA COMERCIAL', {
    x: 50,
    y: height - 100,
    size: 18,
    font: boldFont,
  })

  // Client Info
  let yPos = height - 150
  page.drawText(`Cliente: ${data.clientName}`, { x: 50, y: yPos, size: 12, font })
  yPos -= 20
  if (data.email) {
    page.drawText(`Email: ${data.email}`, { x: 50, y: yPos, size: 12, font })
    yPos -= 20
  }
  if (data.phone) {
    page.drawText(`Telefone: ${data.phone}`, { x: 50, y: yPos, size: 12, font })
    yPos -= 20
  }

  // Product/Service
  yPos -= 20
  page.drawText('SERVIÇO PROPOSTO', { x: 50, y: yPos, size: 14, font: boldFont })
  yPos -= 25
  page.drawText(data.productName || 'Serviço Jurídico', { x: 50, y: yPos, size: 12, font })
  yPos -= 20

  if (data.description) {
    const lines = wrapText(data.description, 80)
    for (const line of lines) {
      page.drawText(line, { x: 50, y: yPos, size: 10, font })
      yPos -= 15
    }
  }

  // Price
  yPos -= 20
  page.drawText('VALOR', { x: 50, y: yPos, size: 14, font: boldFont })
  yPos -= 25
  const price = formatCurrency(data.price || data.estimatedValue || 0)
  page.drawText(`R$ ${price}`, { x: 50, y: yPos, size: 16, font: boldFont, color: rgb(0, 0.5, 0) })

  // Payment Terms
  if (data.paymentTerms) {
    yPos -= 30
    page.drawText('CONDIÇÕES DE PAGAMENTO', { x: 50, y: yPos, size: 14, font: boldFont })
    yPos -= 25
    page.drawText(data.paymentTerms, { x: 50, y: yPos, size: 10, font })
  }

  // Validity
  yPos -= 30
  const validity = data.validityDays || 30
  page.drawText(`Proposta válida por ${validity} dias`, {
    x: 50,
    y: yPos,
    size: 10,
    font,
    color: rgb(0.5, 0.5, 0.5),
  })

  // Footer
  page.drawText('Garcez Palha Advocacia', {
    x: 50,
    y: 50,
    size: 8,
    font,
    color: rgb(0.5, 0.5, 0.5),
  })
  page.drawText(`Gerado em ${new Date().toLocaleDateString('pt-BR')}`, {
    x: width - 150,
    y: 50,
    size: 8,
    font,
    color: rgb(0.5, 0.5, 0.5),
  })

  const pdfBytes = await pdfDoc.save()
  return Buffer.from(pdfBytes)
}

/**
 * Generate Invoice PDF (NF-e style)
 */
async function generateInvoicePDF(data: any, branding?: any): Promise<Buffer> {
  const pdfDoc = await PDFDocument.create()
  const page = pdfDoc.addPage([595, 842])
  const { width, height } = page.getSize()

  const font = await pdfDoc.embedFont(StandardFonts.Helvetica)
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold)

  // Header
  page.drawText('NOTA FISCAL / RECIBO', {
    x: 50,
    y: height - 50,
    size: 20,
    font: boldFont,
  })

  // Invoice Number
  page.drawText(`Nº ${data.invoiceNumber || data.id || '000001'}`, {
    x: width - 150,
    y: height - 50,
    size: 14,
    font: boldFont,
  })

  let yPos = height - 100

  // Company Info
  page.drawText('EMITENTE', { x: 50, y: yPos, size: 12, font: boldFont })
  yPos -= 20
  page.drawText(branding?.companyName || 'Garcez Palha Advocacia', { x: 50, y: yPos, size: 10, font })
  yPos -= 15
  if (data.companyAddress) {
    page.drawText(data.companyAddress, { x: 50, y: yPos, size: 9, font })
    yPos -= 15
  }
  if (data.companyCNPJ) {
    page.drawText(`CNPJ: ${data.companyCNPJ}`, { x: 50, y: yPos, size: 9, font })
    yPos -= 15
  }

  // Client Info
  yPos -= 15
  page.drawText('DESTINATÁRIO', { x: 50, y: yPos, size: 12, font: boldFont })
  yPos -= 20
  page.drawText(data.clientName || data.customerName, { x: 50, y: yPos, size: 10, font })
  yPos -= 15
  if (data.clientCPF || data.clientCNPJ) {
    page.drawText(`CPF/CNPJ: ${data.clientCPF || data.clientCNPJ}`, { x: 50, y: yPos, size: 9, font })
    yPos -= 15
  }
  if (data.clientAddress) {
    page.drawText(data.clientAddress, { x: 50, y: yPos, size: 9, font })
    yPos -= 15
  }

  // Items Table
  yPos -= 30
  page.drawText('DESCRIÇÃO DOS SERVIÇOS', { x: 50, y: yPos, size: 12, font: boldFont })
  yPos -= 25

  // Table header
  page.drawRectangle({ x: 50, y: yPos - 5, width: width - 100, height: 20, color: rgb(0.9, 0.9, 0.9) })
  page.drawText('Descrição', { x: 60, y: yPos, size: 10, font: boldFont })
  page.drawText('Quantidade', { x: 300, y: yPos, size: 10, font: boldFont })
  page.drawText('Valor Unitário', { x: 380, y: yPos, size: 10, font: boldFont })
  page.drawText('Total', { x: 480, y: yPos, size: 10, font: boldFont })
  yPos -= 25

  // Items
  const items = data.items || [{ description: data.description || 'Serviço Jurídico', quantity: 1, price: data.amount }]
  for (const item of items) {
    page.drawText(truncateText(item.description, 30), { x: 60, y: yPos, size: 9, font })
    page.drawText(String(item.quantity || 1), { x: 320, y: yPos, size: 9, font })
    page.drawText(`R$ ${formatCurrency(item.price || item.unitPrice || 0)}`, { x: 380, y: yPos, size: 9, font })
    page.drawText(`R$ ${formatCurrency((item.quantity || 1) * (item.price || item.unitPrice || 0))}`, {
      x: 480,
      y: yPos,
      size: 9,
      font,
    })
    yPos -= 20
  }

  // Total
  yPos -= 20
  const total = data.amount || data.total || items.reduce((sum: number, item: any) => sum + (item.quantity || 1) * (item.price || item.unitPrice || 0), 0)
  page.drawText('VALOR TOTAL', { x: 380, y: yPos, size: 12, font: boldFont })
  page.drawText(`R$ ${formatCurrency(total)}`, {
    x: 480,
    y: yPos,
    size: 14,
    font: boldFont,
    color: rgb(0, 0.5, 0),
  })

  // Payment Info
  if (data.paymentMethod) {
    yPos -= 30
    page.drawText(`Forma de Pagamento: ${data.paymentMethod}`, { x: 50, y: yPos, size: 10, font })
  }
  if (data.dueDate) {
    yPos -= 15
    page.drawText(`Vencimento: ${new Date(data.dueDate).toLocaleDateString('pt-BR')}`, { x: 50, y: yPos, size: 10, font })
  }

  // Footer
  page.drawText(`Emitido em ${new Date().toLocaleDateString('pt-BR')}`, {
    x: 50,
    y: 50,
    size: 8,
    font,
    color: rgb(0.5, 0.5, 0.5),
  })

  const pdfBytes = await pdfDoc.save()
  return Buffer.from(pdfBytes)
}

/**
 * Generate Contract PDF
 */
async function generateContractPDF(data: any, branding?: any): Promise<Buffer> {
  const pdfDoc = await PDFDocument.create()
  const page = pdfDoc.addPage([595, 842])
  const { width, height } = page.getSize()

  const font = await pdfDoc.embedFont(StandardFonts.Helvetica)
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold)

  // Title
  page.drawText('CONTRATO DE PRESTAÇÃO DE SERVIÇOS', {
    x: 50,
    y: height - 50,
    size: 16,
    font: boldFont,
  })

  let yPos = height - 100

  // Parties
  page.drawText('CONTRATANTE:', { x: 50, y: yPos, size: 12, font: boldFont })
  yPos -= 20
  page.drawText(data.clientName || 'Cliente', { x: 50, y: yPos, size: 11, font })
  yPos -= 15
  if (data.clientCPF) {
    page.drawText(`CPF: ${data.clientCPF}`, { x: 50, y: yPos, size: 10, font })
    yPos -= 15
  }

  yPos -= 20
  page.drawText('CONTRATADA:', { x: 50, y: yPos, size: 12, font: boldFont })
  yPos -= 20
  page.drawText(branding?.companyName || 'Garcez Palha Advocacia', { x: 50, y: yPos, size: 11, font })
  yPos -= 20

  // Contract Text
  yPos -= 20
  const contractText = data.contractText || data.content || 'Texto do contrato será inserido aqui.'
  const lines = wrapText(contractText, 90)

  for (const line of lines) {
    if (yPos < 150) {
      // Need new page
      const newPage = pdfDoc.addPage([595, 842])
      yPos = height - 50
      newPage.drawText(line, { x: 50, y: yPos, size: 10, font })
    } else {
      page.drawText(line, { x: 50, y: yPos, size: 10, font })
    }
    yPos -= 15
  }

  // Signature area
  yPos -= 40
  page.drawText('_____________________________', { x: 50, y: yPos, size: 10, font })
  page.drawText('_____________________________', { x: 320, y: yPos, size: 10, font })
  yPos -= 15
  page.drawText('Contratante', { x: 80, y: yPos, size: 9, font })
  page.drawText('Contratada', { x: 360, y: yPos, size: 9, font })

  // Footer
  page.drawText(`Data: ${new Date().toLocaleDateString('pt-BR')}`, {
    x: 50,
    y: 50,
    size: 8,
    font,
    color: rgb(0.5, 0.5, 0.5),
  })

  const pdfBytes = await pdfDoc.save()
  return Buffer.from(pdfBytes)
}

/**
 * Generate Report PDF
 */
async function generateReportPDF(data: any, branding?: any): Promise<Buffer> {
  const pdfDoc = await PDFDocument.create()
  const page = pdfDoc.addPage([595, 842])
  const { width, height } = page.getSize()

  const font = await pdfDoc.embedFont(StandardFonts.Helvetica)
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold)

  // Title
  page.drawText(data.title || 'RELATÓRIO', {
    x: 50,
    y: height - 50,
    size: 20,
    font: boldFont,
  })

  // Subtitle
  if (data.subtitle) {
    page.drawText(data.subtitle, {
      x: 50,
      y: height - 75,
      size: 12,
      font,
      color: rgb(0.5, 0.5, 0.5),
    })
  }

  let yPos = height - 120

  // Report content
  if (data.sections) {
    for (const section of data.sections) {
      // Section title
      page.drawText(section.title, { x: 50, y: yPos, size: 14, font: boldFont })
      yPos -= 25

      // Section content
      if (section.content) {
        const lines = wrapText(section.content, 80)
        for (const line of lines) {
          page.drawText(line, { x: 50, y: yPos, size: 10, font })
          yPos -= 15
        }
      }

      // Metrics
      if (section.metrics) {
        yPos -= 10
        for (const metric of section.metrics) {
          page.drawText(`${metric.label}: ${metric.value}`, {
            x: 60,
            y: yPos,
            size: 10,
            font,
          })
          yPos -= 15
        }
      }

      yPos -= 20
    }
  }

  // Footer
  page.drawText(`Gerado em ${new Date().toLocaleDateString('pt-BR')} às ${new Date().toLocaleTimeString('pt-BR')}`, {
    x: 50,
    y: 50,
    size: 8,
    font,
    color: rgb(0.5, 0.5, 0.5),
  })

  const pdfBytes = await pdfDoc.save()
  return Buffer.from(pdfBytes)
}

/**
 * Generate Compliance/GDPR Data Export PDF
 */
async function generateCompliancePDF(data: any, branding?: any): Promise<Buffer> {
  const pdfDoc = await PDFDocument.create()
  const page = pdfDoc.addPage([595, 842])
  const { width, height } = page.getSize()

  const font = await pdfDoc.embedFont(StandardFonts.Helvetica)
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold)

  // Title
  page.drawText('EXPORTAÇÃO DE DADOS PESSOAIS', {
    x: 50,
    y: height - 50,
    size: 18,
    font: boldFont,
  })

  page.drawText('Conforme Lei Geral de Proteção de Dados (LGPD)', {
    x: 50,
    y: height - 75,
    size: 10,
    font,
    color: rgb(0.5, 0.5, 0.5),
  })

  let yPos = height - 120

  // User Info
  page.drawText('DADOS DO TITULAR', { x: 50, y: yPos, size: 12, font: boldFont })
  yPos -= 25

  if (data.profile) {
    page.drawText(`Nome: ${data.profile.name || 'N/A'}`, { x: 50, y: yPos, size: 10, font })
    yPos -= 15
    page.drawText(`Email: ${data.profile.email || 'N/A'}`, { x: 50, y: yPos, size: 10, font })
    yPos -= 15
    if (data.profile.phone) {
      page.drawText(`Telefone: ${data.profile.phone}`, { x: 50, y: yPos, size: 10, font })
      yPos -= 15
    }
  }

  // Data Categories
  yPos -= 20
  const categories = [
    { key: 'conversations', label: 'Conversas' },
    { key: 'leads', label: 'Leads' },
    { key: 'appointments', label: 'Agendamentos' },
    { key: 'documents', label: 'Documentos' },
    { key: 'payments', label: 'Pagamentos' },
  ]

  for (const category of categories) {
    if (data[category.key] && data[category.key].length > 0) {
      page.drawText(`${category.label}: ${data[category.key].length} registros`, {
        x: 50,
        y: yPos,
        size: 10,
        font,
      })
      yPos -= 15
    }
  }

  // Data processing info
  yPos -= 20
  page.drawText('INFORMAÇÕES SOBRE O PROCESSAMENTO', { x: 50, y: yPos, size: 12, font: boldFont })
  yPos -= 25
  page.drawText('Seus dados são processados para prestação de serviços jurídicos.', { x: 50, y: yPos, size: 9, font })
  yPos -= 15
  page.drawText('Base legal: Execução de contrato e consentimento.', { x: 50, y: yPos, size: 9, font })
  yPos -= 15
  page.drawText('Período de retenção: Conforme legislação aplicável.', { x: 50, y: yPos, size: 9, font })

  // Rights
  yPos -= 30
  page.drawText('SEUS DIREITOS', { x: 50, y: yPos, size: 12, font: boldFont })
  yPos -= 25
  const rights = [
    'Confirmação da existência de tratamento',
    'Acesso aos dados',
    'Correção de dados incompletos, inexatos ou desatualizados',
    'Anonimização, bloqueio ou eliminação de dados',
    'Portabilidade dos dados',
    'Revogação do consentimento',
  ]

  for (const right of rights) {
    page.drawText(`• ${right}`, { x: 50, y: yPos, size: 9, font })
    yPos -= 15
  }

  // Footer
  page.drawText(`Exportado em ${new Date().toLocaleDateString('pt-BR')} às ${new Date().toLocaleTimeString('pt-BR')}`, {
    x: 50,
    y: 50,
    size: 8,
    font,
    color: rgb(0.5, 0.5, 0.5),
  })

  const pdfBytes = await pdfDoc.save()
  return Buffer.from(pdfBytes)
}

// Helper functions

function formatCurrency(value: number): string {
  return (value / 100).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

function wrapText(text: string, maxChars: number): string[] {
  const words = text.split(' ')
  const lines: string[] = []
  let currentLine = ''

  for (const word of words) {
    if ((currentLine + word).length > maxChars) {
      lines.push(currentLine.trim())
      currentLine = word + ' '
    } else {
      currentLine += word + ' '
    }
  }

  if (currentLine.trim()) {
    lines.push(currentLine.trim())
  }

  return lines
}

function truncateText(text: string, maxChars: number): string {
  if (text.length <= maxChars) return text
  return text.substring(0, maxChars - 3) + '...'
}

/**
 * Save PDF to storage and return URL
 */
export async function savePDFToStorage(pdfBuffer: Buffer, filename: string): Promise<string> {
  // TODO: Upload to Supabase Storage
  // For now, return a placeholder URL
  // In production, implement:
  // const { data, error } = await supabase.storage.from('pdfs').upload(filename, pdfBuffer)
  // return data.publicUrl

  return `/api/pdfs/${filename}`
}
