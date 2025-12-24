/**
 * Export utilities for leads data
 */

export interface LeadExportData {
  id: string
  clientName: string
  phone: string
  email?: string
  productName: string
  category: string
  scoreTotal: number
  scoreUrgency: number
  scoreProbability: number
  scoreComplexity: number
  status: string
  source: string
  createdAt: string
  lastInteractionAt?: string
}

/**
 * Convert leads to CSV format
 */
export function exportToCSV(leads: LeadExportData[], filename = 'leads.csv'): void {
  // Define headers
  const headers = [
    'ID',
    'Nome',
    'Telefone',
    'Email',
    'Produto',
    'Categoria',
    'Score Total',
    'Urgência',
    'Probabilidade',
    'Complexidade',
    'Status',
    'Origem',
    'Data Criação',
    'Última Interação',
  ]

  // Convert data to CSV rows
  const rows = leads.map((lead) => [
    lead.id,
    lead.clientName,
    lead.phone,
    lead.email || '',
    lead.productName,
    lead.category.toUpperCase(),
    lead.scoreTotal,
    lead.scoreUrgency,
    lead.scoreProbability,
    lead.scoreComplexity,
    lead.status,
    lead.source,
    new Date(lead.createdAt).toLocaleString('pt-BR'),
    lead.lastInteractionAt
      ? new Date(lead.lastInteractionAt).toLocaleString('pt-BR')
      : '',
  ])

  // Combine headers and rows
  const csvContent = [
    headers.join(','),
    ...rows.map((row) =>
      row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(',')
    ),
  ].join('\n')

  // Create blob and download
  const blob = new Blob(['\uFEFF' + csvContent], {
    type: 'text/csv;charset=utf-8;',
  })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)

  link.setAttribute('href', url)
  link.setAttribute('download', filename)
  link.style.visibility = 'hidden'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

/**
 * Export to Excel format (using CSV as intermediate - compatible with Excel)
 */
export function exportToExcel(
  leads: LeadExportData[],
  filename = 'leads.xlsx'
): void {
  // For now, use CSV export with .xlsx extension
  // Excel will open CSV files automatically
  const csvFilename = filename.replace(/\.xlsx$/i, '.csv')
  exportToCSV(leads, csvFilename)
}

/**
 * Export analytics summary
 */
export interface AnalyticsSummary {
  totalLeads: number
  hotLeads: number
  warmLeads: number
  coldLeads: number
  convertedLeads: number
  avgScore: number
  conversionRate: number
  period: string
}

export function exportAnalyticsToCSV(
  summary: AnalyticsSummary,
  filename = 'analytics.csv'
): void {
  const headers = ['Métrica', 'Valor']
  const rows = [
    ['Total de Leads', summary.totalLeads],
    ['Leads Hot 🔥', summary.hotLeads],
    ['Leads Warm ☀️', summary.warmLeads],
    ['Leads Cold ❄️', summary.coldLeads],
    ['Leads Convertidos', summary.convertedLeads],
    ['Score Médio', summary.avgScore.toFixed(2)],
    ['Taxa de Conversão', `${summary.conversionRate.toFixed(2)}%`],
    ['Período', summary.period],
  ]

  const csvContent = [
    headers.join(','),
    ...rows.map((row) =>
      row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(',')
    ),
  ].join('\n')

  const blob = new Blob(['\uFEFF' + csvContent], {
    type: 'text/csv;charset=utf-8;',
  })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)

  link.setAttribute('href', url)
  link.setAttribute('download', filename)
  link.style.visibility = 'hidden'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

/**
 * Copy data to clipboard as formatted table
 */
export async function copyToClipboard(leads: LeadExportData[]): Promise<void> {
  const text = leads
    .map(
      (lead) =>
        `${lead.clientName}\t${lead.phone}\t${lead.productName}\t${lead.category}\t${lead.scoreTotal}`
    )
    .join('\n')

  try {
    await navigator.clipboard.writeText(text)
  } catch (err) {
    // Fallback for older browsers
    const textarea = document.createElement('textarea')
    textarea.value = text
    textarea.style.position = 'fixed'
    textarea.style.opacity = '0'
    document.body.appendChild(textarea)
    textarea.select()
    document.execCommand('copy')
    document.body.removeChild(textarea)
  }
}
