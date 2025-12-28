/**
 * Chat Formatters
 * Funções utilitárias para formatação de dados no chat
 */

/**
 * Formata timestamp para exibição no chat
 * Exemplo: "14:35" ou "Ontem às 09:20"
 */
export function formatTimestamp(date: Date): string {
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  // Hoje: apenas hora
  if (diffDays === 0) {
    return date.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  // Ontem
  if (diffDays === 1) {
    return `Ontem às ${date.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
    })}`
  }

  // Esta semana
  if (diffDays < 7) {
    const weekday = date.toLocaleDateString('pt-BR', { weekday: 'long' })
    const time = date.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
    })
    return `${weekday} às ${time}`
  }

  // Mais de 7 dias: data completa
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

/**
 * Formata duração em segundos para formato legível
 * Exemplo: formatDuration(90) => "1m 30s"
 */
export function formatDuration(seconds: number): string {
  if (seconds < 60) {
    return `${seconds}s`
  }

  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60

  if (remainingSeconds === 0) {
    return `${minutes}m`
  }

  return `${minutes}m ${remainingSeconds}s`
}

/**
 * Formata tamanho de arquivo
 * Exemplo: formatFileSize(1536) => "1.5 KB"
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B'

  const units = ['B', 'KB', 'MB', 'GB']
  const k = 1024
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return `${(bytes / Math.pow(k, i)).toFixed(1)} ${units[i]}`
}

/**
 * Trunca texto longo com reticências
 * Exemplo: truncate("Long text here", 10) => "Long te..."
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength) + '...'
}

/**
 * Formata número de mensagens
 * Exemplo: formatMessageCount(1523) => "1.5K"
 */
export function formatMessageCount(count: number): string {
  if (count < 1000) return count.toString()
  if (count < 1000000) return `${(count / 1000).toFixed(1)}K`
  return `${(count / 1000000).toFixed(1)}M`
}

/**
 * Formata score de qualificação (0-100) com cor
 */
export function formatQualificationScore(score: number): {
  value: string
  color: string
  label: string
} {
  const value = `${score}%`

  if (score >= 80) {
    return {
      value,
      color: 'text-green-500',
      label: 'Excelente',
    }
  }

  if (score >= 60) {
    return {
      value,
      color: 'text-yellow-500',
      label: 'Bom',
    }
  }

  if (score >= 40) {
    return {
      value,
      color: 'text-orange-500',
      label: 'Regular',
    }
  }

  return {
    value,
    color: 'text-red-500',
    label: 'Baixo',
  }
}

/**
 * Formata urgência para exibição
 */
export function formatUrgency(urgency: 'low' | 'medium' | 'high' | 'urgent'): {
  label: string
  color: string
  icon: string
} {
  const urgencyMap = {
    low: { label: 'Baixa', color: 'text-gray-500', icon: '○' },
    medium: { label: 'Média', color: 'text-yellow-500', icon: '◐' },
    high: { label: 'Alta', color: 'text-orange-500', icon: '◉' },
    urgent: { label: 'Urgente', color: 'text-red-500', icon: '●' },
  }

  return urgencyMap[urgency]
}

/**
 * Sanitiza nome de arquivo
 */
export function sanitizeFilename(filename: string): string {
  return filename
    .replace(/[^a-zA-Z0-9._-]/g, '_')
    .replace(/__+/g, '_')
    .substring(0, 255)
}

/**
 * Detecta tipo de arquivo pelo nome
 */
export function getFileType(filename: string): 'image' | 'document' | 'audio' | 'video' | 'other' {
  const ext = filename.split('.').pop()?.toLowerCase()

  const imageExts = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp']
  const docExts = ['pdf', 'doc', 'docx', 'txt', 'rtf', 'odt']
  const audioExts = ['mp3', 'wav', 'ogg', 'm4a', 'aac']
  const videoExts = ['mp4', 'webm', 'mov', 'avi', 'mkv']

  if (ext && imageExts.includes(ext)) return 'image'
  if (ext && docExts.includes(ext)) return 'document'
  if (ext && audioExts.includes(ext)) return 'audio'
  if (ext && videoExts.includes(ext)) return 'video'

  return 'other'
}

/**
 * Formata lista de itens com "e" final
 * Exemplo: formatList(['A', 'B', 'C']) => "A, B e C"
 */
export function formatList(items: string[]): string {
  if (items.length === 0) return ''
  if (items.length === 1) return items[0]
  if (items.length === 2) return `${items[0]} e ${items[1]}`

  const allButLast = items.slice(0, -1).join(', ')
  const last = items[items.length - 1]

  return `${allButLast} e ${last}`
}
