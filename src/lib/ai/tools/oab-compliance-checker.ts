/**
 * OAB Compliance Checker - Verifica conformidade com Código de Ética da OAB
 * Valida documentos jurídicos antes de envio ao cliente
 */

export interface ComplianceCheck {
  conforme: boolean
  violacoes: {
    tipo: 'critica' | 'advertencia' | 'sugestao'
    regra: string
    descricao: string
    localizacao?: string
    sugestaoCorrecao: string
  }[]
  aprovado: boolean
  requerRevisaoHumana: boolean
  score: number // 0-100
  observacoes: string[]
}

export class OABComplianceChecker {
  /**
   * Verifica conformidade de peça jurídica com Código de Ética OAB
   */
  async checkCompliance(params: {
    tipoPeca: 'peticao' | 'contrato' | 'parecer' | 'procuracao' | 'outro'
    conteudo: string
    destinatario: 'cliente' | 'tribunal' | 'outro'
    valorCausa?: number
  }): Promise<ComplianceCheck> {
    const violacoes: ComplianceCheck['violacoes'] = []

    // Verificação 1: Promessa de resultado (proibida)
    const promessasResultado = this.verificarPromessasResultado(params.conteudo)
    if (promessasResultado.length > 0) {
      promessasResultado.forEach((promessa) => {
        violacoes.push({
          tipo: 'critica',
          regra: 'Art. 34, IV do Código de Ética - Proibição de promessa de resultado',
          descricao: 'Texto sugere garantia de vitória ou resultado específico',
          localizacao: promessa,
          sugestaoCorrecao: 'Substituir por "buscaremos o melhor resultado possível" ou similar',
        })
      })
    }

    // Verificação 2: Captação de clientela (proibida)
    const captacaoClientela = this.verificarCaptacaoClientela(params.conteudo)
    if (captacaoClientela) {
      violacoes.push({
        tipo: 'critica',
        regra: 'Art. 34, I do Código de Ética - Proibição de captação de clientela',
        descricao: 'Texto contém linguagem promocional ou comercial inadequada',
        sugestaoCorrecao: 'Remover linguagem de marketing e manter tom técnico-profissional',
      })
    }

    // Verificação 3: Honorários não especificados
    if (params.tipoPeca === 'contrato' && !params.conteudo.toLowerCase().includes('honorário')) {
      violacoes.push({
        tipo: 'advertencia',
        regra: 'Art. 35 do Código de Ética - Clareza nos honorários',
        descricao: 'Contrato de prestação de serviços sem menção clara aos honorários',
        sugestaoCorrecao: 'Incluir cláusula específica sobre honorários advocatícios',
      })
    }

    // Verificação 4: Sigilo profissional
    const violacaoSigilo = this.verificarViolacaoSigilo(params.conteudo, params.destinatario)
    if (violacaoSigilo) {
      violacoes.push({
        tipo: 'critica',
        regra: 'Art. 34, VII do Código de Ética - Dever de sigilo',
        descricao: 'Possível exposição de informações confidenciais do cliente',
        sugestaoCorrecao: 'Remover ou anonimizar informações sensíveis',
      })
    }

    // Verificação 5: Linguagem técnica adequada
    const linguagemInadequada = this.verificarLinguagem(params.conteudo)
    if (linguagemInadequada.length > 0) {
      linguagemInadequada.forEach((termo) => {
        violacoes.push({
          tipo: 'sugestao',
          regra: 'Boas práticas - Linguagem técnica e respeitosa',
          descricao: `Termo inadequado ou informal: "${termo}"`,
          localizacao: termo,
          sugestaoCorrecao: 'Utilizar linguagem técnica e respeitosa',
        })
      })
    }

    // Verificação 6: Dados obrigatórios
    const dadosFaltantes = this.verificarDadosObrigatorios(params.tipoPeca, params.conteudo)
    dadosFaltantes.forEach((dado) => {
      violacoes.push({
        tipo: 'advertencia',
        regra: 'Requisitos formais da peça',
        descricao: `Dado obrigatório ausente: ${dado}`,
        sugestaoCorrecao: `Incluir ${dado} na peça`,
      })
    })

    // Calcular score
    const violacoesCriticas = violacoes.filter((v) => v.tipo === 'critica').length
    const violacoesAdvertencia = violacoes.filter((v) => v.tipo === 'advertencia').length

    let score = 100
    score -= violacoesCriticas * 25
    score -= violacoesAdvertencia * 10
    score = Math.max(0, score)

    const conforme = violacoesCriticas === 0
    const aprovado = score >= 70
    const requerRevisaoHumana = violacoesCriticas > 0 || score < 80

    const observacoes: string[] = []
    if (requerRevisaoHumana) {
      observacoes.push('⚠️ ATENÇÃO: Documento requer revisão humana por advogado inscrito na OAB')
    }
    if (violacoesCriticas > 0) {
      observacoes.push(`${violacoesCriticas} violação(ões) crítica(s) detectada(s) - CORREÇÃO OBRIGATÓRIA`)
    }
    if (aprovado) {
      observacoes.push('✓ Documento aprovado para envio (score >= 70)')
    } else {
      observacoes.push('✗ Documento NÃO aprovado - requer correções')
    }

    return {
      conforme,
      violacoes,
      aprovado,
      requerRevisaoHumana,
      score,
      observacoes,
    }
  }

  // Métodos de verificação privados

  private verificarPromessasResultado(conteudo: string): string[] {
    const promessas: string[] = []
    const textoLower = conteudo.toLowerCase()

    const frasesProibidas = [
      'garantimos a vitória',
      'você vai ganhar',
      'certeza de êxito',
      'garantia de sucesso',
      'processo ganho',
      'vitória garantida',
      '100% de chance',
      'não tem como perder',
    ]

    frasesProibidas.forEach((frase) => {
      if (textoLower.includes(frase)) {
        promessas.push(frase)
      }
    })

    return promessas
  }

  private verificarCaptacaoClientela(conteudo: string): boolean {
    const textoLower = conteudo.toLowerCase()

    const frasesProibidas = [
      'melhor advogado',
      'maior especialista',
      'preço imbatível',
      'mais barato',
      'promoção',
      'desconto especial',
      'oferta limitada',
    ]

    return frasesProibidas.some((frase) => textoLower.includes(frase))
  }

  private verificarViolacaoSigilo(conteudo: string, destinatario: string): boolean {
    // Se destinatário é público (tribunal), não pode conter info sensível do cliente
    if (destinatario === 'tribunal') {
      const textoLower = conteudo.toLowerCase()

      // Verificar se contém informações médicas, financeiras sensíveis, etc
      const infoSensiveis = [
        'conta bancária:',
        'senha:',
        'histórico médico completo',
        'cpf completo',
      ]

      return infoSensiveis.some((info) => textoLower.includes(info))
    }

    return false
  }

  private verificarLinguagem(conteudo: string): string[] {
    const termosInadequados: string[] = []
    const textoLower = conteudo.toLowerCase()

    const termosProibidos = [
      'cara',
      'brother',
      'mano',
      'beleza?',
      'valeu',
      'fera',
      'top',
      'massa',
    ]

    termosProibidos.forEach((termo) => {
      if (textoLower.includes(termo)) {
        termosInadequados.push(termo)
      }
    })

    return termosInadequados
  }

  private verificarDadosObrigatorios(tipoPeca: string, conteudo: string): string[] {
    const dadosFaltantes: string[] = []
    const textoLower = conteudo.toLowerCase()

    if (tipoPeca === 'peticao') {
      if (!textoLower.includes('excelentíssimo') && !textoLower.includes('exmo')) {
        dadosFaltantes.push('Vocativo ao juiz (Excelentíssimo Senhor Doutor Juiz)')
      }
      if (!textoLower.includes('comarca') && !textoLower.includes('juízo')) {
        dadosFaltantes.push('Identificação da comarca ou juízo')
      }
    }

    if (tipoPeca === 'contrato') {
      if (!textoLower.includes('oab')) {
        dadosFaltantes.push('Número de inscrição OAB do advogado')
      }
    }

    if (tipoPeca === 'procuracao') {
      if (!textoLower.includes('poderes')) {
        dadosFaltantes.push('Especificação dos poderes outorgados')
      }
      if (!textoLower.includes('oab')) {
        dadosFaltantes.push('Número OAB do procurador')
      }
    }

    return dadosFaltantes
  }
}

// Singleton instance
export const oabComplianceChecker = new OABComplianceChecker()
