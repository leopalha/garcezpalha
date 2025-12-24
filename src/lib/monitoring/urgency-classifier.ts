/**
 * Urgency Classifier
 * Automatic classification of process movements and deadlines
 *
 * Categories:
 * - CRITICAL: Sentences, arrest warrants, asset freezes
 * - HIGH: Summons with short deadlines, hearings
 * - MEDIUM: Regular deadlines, requests for documents
 * - LOW: Mere dispatches, certificate issuance
 */

export type UrgencyLevel = 'critical' | 'high' | 'medium' | 'low'

export interface ClassificationResult {
  level: UrgencyLevel
  score: number // 0-100
  reasons: string[]
  suggestedAction?: string
  deadlineDays?: number
}

// Keywords for critical movements (sentences, warrants, etc.)
const CRITICAL_KEYWORDS = [
  // Sentences and decisions
  'sentenca', 'sentença', 'acordao', 'acórdão', 'decisao final', 'decisão final',
  'transito em julgado', 'trânsito em julgado', 'transitou em julgado',
  'procedencia', 'procedência', 'improcedencia', 'improcedência',
  'parcial procedencia', 'parcial procedência',

  // Criminal urgent
  'mandado de prisao', 'mandado de prisão', 'ordem de prisao', 'ordem de prisão',
  'mandado de busca', 'busca e apreensao', 'busca e apreensão',

  // Asset related
  'bloqueio de bens', 'arresto', 'sequestro de bens', 'penhora online',
  'bloqueio judicial', 'bacen jud', 'sisbajud', 'constrição',

  // Execution
  'execucao de sentenca', 'execução de sentença', 'cumprimento de sentenca',
  'cumprimento de sentença', 'expedicao de precatorio', 'expedição de precatório',

  // Appeals results
  'recurso provido', 'recurso desprovido', 'negado provimento',
  'dado provimento', 'nao conhecimento', 'não conhecimento'
]

// Keywords for high urgency (summons, hearings)
const HIGH_KEYWORDS = [
  // Summons and citations
  'intimacao', 'intimação', 'citacao', 'citação', 'notificacao', 'notificação',
  'intimar', 'citar', 'notificar',

  // Hearings
  'audiencia', 'audiência', 'designada audiencia', 'designada audiência',
  'pauta de julgamento', 'sessao de julgamento', 'sessão de julgamento',

  // Urgent deadlines
  'prazo fatal', 'prazo peremptorio', 'prazo peremptório', 'ultimo dia',
  'último dia', 'prazo improrrogavel', 'prazo improrrogável',

  // Appeals deadlines
  'prazo para recurso', 'interposicao de recurso', 'interposição de recurso',
  'contrarrazoes', 'contrarrazões', 'razoes recursais', 'razões recursais',

  // Evidence
  'producao de provas', 'produção de provas', 'especificacao de provas',
  'especificação de provas', 'rol de testemunhas',

  // Preliminary injunctions
  'tutela de urgencia', 'tutela de urgência', 'liminar', 'antecipacao de tutela',
  'antecipação de tutela', 'efeito suspensivo'
]

// Keywords for medium urgency
const MEDIUM_KEYWORDS = [
  // Regular deadlines
  'prazo', 'manifestacao', 'manifestação', 'juntada', 'peticionamento',

  // Documents
  'documentos', 'procuracao', 'procuração', 'substabelecimento',
  'comprovante', 'certidao', 'certidão',

  // General requests
  'despacho', 'determinacao', 'determinação', 'providencias', 'providências',
  'cumprimento', 'diligencia', 'diligência',

  // Parties
  'vista as partes', 'vista às partes', 'ciencia', 'ciência',

  // Costs
  'custas', 'preparo', 'emolumentos', 'taxa judiciaria', 'taxa judiciária'
]

// Keywords for low urgency
const LOW_KEYWORDS = [
  // Simple dispatches
  'recebido', 'autuado', 'distribuido', 'distribuído', 'registrado',
  'protocolo', 'cadastrado', 'anexado',

  // Certificates
  'certidao expedida', 'certidão expedida', 'certidao emitida', 'certidão emitida',

  // Simple movements
  'conclusos', 'remetido', 'encaminhado', 'arquivado provisoriamente',
  'aguardando', 'sobrestado', 'suspenso',

  // Administrative
  'retificacao', 'retificação', 'correcao', 'correção', 'numeracao', 'numeração'
]

/**
 * Urgency Classifier Class
 */
export class UrgencyClassifier {
  /**
   * Classify a process movement or update
   */
  classifyMovement(text: string, deadlineDays?: number): ClassificationResult {
    const normalizedText = this.normalizeText(text)
    const reasons: string[] = []
    let baseScore = 0

    // Check critical keywords
    const criticalMatches = this.findMatches(normalizedText, CRITICAL_KEYWORDS)
    if (criticalMatches.length > 0) {
      baseScore = 90
      reasons.push(`Movimento critico detectado: ${criticalMatches.join(', ')}`)
    }

    // Check high keywords
    const highMatches = this.findMatches(normalizedText, HIGH_KEYWORDS)
    if (highMatches.length > 0 && baseScore < 70) {
      baseScore = Math.max(baseScore, 70)
      reasons.push(`Movimento de alta urgencia: ${highMatches.join(', ')}`)
    }

    // Check medium keywords
    const mediumMatches = this.findMatches(normalizedText, MEDIUM_KEYWORDS)
    if (mediumMatches.length > 0 && baseScore < 50) {
      baseScore = Math.max(baseScore, 50)
      reasons.push(`Movimento regular: ${mediumMatches.join(', ')}`)
    }

    // Check low keywords
    const lowMatches = this.findMatches(normalizedText, LOW_KEYWORDS)
    if (lowMatches.length > 0 && baseScore < 30) {
      baseScore = Math.max(baseScore, 25)
      reasons.push(`Movimento de rotina: ${lowMatches.join(', ')}`)
    }

    // Default if no matches
    if (baseScore === 0) {
      baseScore = 40
      reasons.push('Classificacao automatica: urgencia media por padrao')
    }

    // Adjust based on deadline
    if (deadlineDays !== undefined) {
      const deadlineAdjustment = this.getDeadlineAdjustment(deadlineDays)
      baseScore = Math.min(100, baseScore + deadlineAdjustment.adjustment)
      if (deadlineAdjustment.reason) {
        reasons.push(deadlineAdjustment.reason)
      }
    }

    // Determine level
    const level = this.scoreToLevel(baseScore)

    // Suggest action
    const suggestedAction = this.getSuggestedAction(level, criticalMatches, highMatches)

    return {
      level,
      score: Math.round(baseScore),
      reasons,
      suggestedAction,
      deadlineDays
    }
  }

  /**
   * Classify a deadline
   */
  classifyDeadline(deadlineType: string, daysRemaining: number): ClassificationResult {
    const normalizedType = this.normalizeText(deadlineType)
    const reasons: string[] = []
    let baseScore = 50 // Default medium

    // Check deadline type
    if (CRITICAL_KEYWORDS.some(k => normalizedType.includes(k))) {
      baseScore = 85
      reasons.push(`Prazo critico: ${deadlineType}`)
    } else if (HIGH_KEYWORDS.some(k => normalizedType.includes(k))) {
      baseScore = 70
      reasons.push(`Prazo importante: ${deadlineType}`)
    }

    // Adjust based on days remaining
    const deadlineAdjustment = this.getDeadlineAdjustment(daysRemaining)
    baseScore = Math.min(100, baseScore + deadlineAdjustment.adjustment)
    reasons.push(deadlineAdjustment.reason || `${daysRemaining} dias restantes`)

    const level = this.scoreToLevel(baseScore)

    return {
      level,
      score: Math.round(baseScore),
      reasons,
      suggestedAction: this.getDeadlineSuggestedAction(level, daysRemaining),
      deadlineDays: daysRemaining
    }
  }

  /**
   * Batch classify multiple movements
   */
  classifyBatch(movements: Array<{ text: string; deadlineDays?: number }>): ClassificationResult[] {
    return movements.map(m => this.classifyMovement(m.text, m.deadlineDays))
  }

  /**
   * Get overall urgency for a process based on all recent movements
   */
  getProcessUrgency(movements: ClassificationResult[]): ClassificationResult {
    if (movements.length === 0) {
      return {
        level: 'low',
        score: 25,
        reasons: ['Nenhuma movimentacao recente']
      }
    }

    // Get highest urgency movement
    const sorted = [...movements].sort((a, b) => b.score - a.score)
    const highest = sorted[0]

    // Aggregate reasons from top 3
    const topReasons = sorted
      .slice(0, 3)
      .flatMap(m => m.reasons)
      .filter((r, i, arr) => arr.indexOf(r) === i)
      .slice(0, 5)

    return {
      level: highest.level,
      score: highest.score,
      reasons: topReasons,
      suggestedAction: highest.suggestedAction,
      deadlineDays: highest.deadlineDays
    }
  }

  /**
   * Normalize text for matching
   */
  private normalizeText(text: string): string {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remove accents
      .replace(/[^a-z0-9\s]/g, ' ') // Keep only alphanumeric
      .replace(/\s+/g, ' ') // Normalize spaces
      .trim()
  }

  /**
   * Find matching keywords
   */
  private findMatches(text: string, keywords: string[]): string[] {
    const normalizedKeywords = keywords.map(k =>
      k.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    )
    return normalizedKeywords.filter(k => text.includes(k))
  }

  /**
   * Get deadline adjustment
   */
  private getDeadlineAdjustment(days: number): { adjustment: number; reason?: string } {
    if (days <= 0) {
      return { adjustment: 25, reason: 'PRAZO VENCIDO - Acao imediata necessaria' }
    }
    if (days === 1) {
      return { adjustment: 20, reason: 'Prazo vence AMANHA' }
    }
    if (days <= 3) {
      return { adjustment: 15, reason: `Prazo vence em ${days} dias` }
    }
    if (days <= 5) {
      return { adjustment: 10, reason: `Prazo vence em ${days} dias` }
    }
    if (days <= 7) {
      return { adjustment: 5, reason: `Prazo vence em ${days} dias` }
    }
    if (days <= 15) {
      return { adjustment: 0, reason: `${days} dias para o prazo` }
    }
    return { adjustment: -5, reason: `Prazo distante: ${days} dias` }
  }

  /**
   * Convert score to urgency level
   */
  private scoreToLevel(score: number): UrgencyLevel {
    if (score >= 85) return 'critical'
    if (score >= 65) return 'high'
    if (score >= 40) return 'medium'
    return 'low'
  }

  /**
   * Get suggested action based on level
   */
  private getSuggestedAction(
    level: UrgencyLevel,
    criticalMatches: string[],
    highMatches: string[]
  ): string {
    switch (level) {
      case 'critical':
        if (criticalMatches.some(m => m.includes('sentenc') || m.includes('acordao'))) {
          return 'Analisar decisao e comunicar cliente imediatamente'
        }
        if (criticalMatches.some(m => m.includes('bloqueio') || m.includes('penhora'))) {
          return 'Verificar valores bloqueados e tomar medidas urgentes'
        }
        if (criticalMatches.some(m => m.includes('prisao'))) {
          return 'URGENTE: Contatar cliente e preparar defesa'
        }
        return 'Analise critica necessaria - prioridade maxima'

      case 'high':
        if (highMatches.some(m => m.includes('audiencia'))) {
          return 'Agendar audiencia e preparar cliente'
        }
        if (highMatches.some(m => m.includes('intimacao') || m.includes('citacao'))) {
          return 'Verificar prazo e preparar resposta'
        }
        if (highMatches.some(m => m.includes('recurso'))) {
          return 'Analisar cabimento de recurso'
        }
        return 'Atencao prioritaria necessaria'

      case 'medium':
        return 'Acompanhar e tomar providencias no prazo'

      case 'low':
        return 'Monitorar normalmente'
    }
  }

  /**
   * Get deadline-specific suggested action
   */
  private getDeadlineSuggestedAction(level: UrgencyLevel, days: number): string {
    if (days <= 0) {
      return 'PRAZO VENCIDO - Verificar possibilidade de justificativa ou recurso'
    }
    if (days === 1) {
      return 'Prazo AMANHA - Finalizar e protocolar urgente'
    }
    if (days <= 3) {
      return 'Revisar e finalizar peca processual'
    }
    if (days <= 7) {
      return 'Iniciar preparacao da peca processual'
    }
    return 'Programar elaboracao da peca'
  }
}

// Export singleton
export const urgencyClassifier = new UrgencyClassifier()

// Export helper function
export function classifyUrgency(text: string, deadlineDays?: number): ClassificationResult {
  return urgencyClassifier.classifyMovement(text, deadlineDays)
}
