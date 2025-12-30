/**
 * Contract Analyzer - Analisa contratos imobiliários
 * Identifica cláusulas abusivas, verifica conformidade legal
 */

export interface ContractAnalysis {
  tipoContrato: 'compra-venda' | 'locacao' | 'permuta' | 'doacao' | 'usufruto' | 'outro'
  clausulasObrigatorias: {
    presente: string[]
    ausente: string[]
  }
  clausulasAbusivas: {
    clausula: string
    fundamentacao: string
    gravidade: 'alta' | 'media' | 'baixa'
  }[]
  conformidadeLGPD: {
    conforme: boolean
    problemas: string[]
    recomendacoes: string[]
  }
  riscos: {
    tipo: 'juridico' | 'financeiro' | 'registrario'
    descricao: string
    severidade: 'alta' | 'media' | 'baixa'
  }[]
  recomendacoes: string[]
  parecer: 'aprovado' | 'aprovado-com-ressalvas' | 'reprovado'
}

export class ContractAnalyzer {
  /**
   * Analisa um contrato imobiliário
   */
  async analyzeContract(contractText: string): Promise<ContractAnalysis> {
    const tipoContrato = this.identificarTipoContrato(contractText)

    const clausulasObrigatorias = this.verificarClausulasObrigatorias(
      contractText,
      tipoContrato
    )

    const clausulasAbusivas = this.identificarClausulasAbusivas(contractText)

    const conformidadeLGPD = this.verificarLGPD(contractText)

    const riscos = this.identificarRiscos(contractText, tipoContrato)

    const recomendacoes = this.gerarRecomendacoes(
      clausulasObrigatorias,
      clausulasAbusivas,
      riscos
    )

    const parecer = this.emitirParecer(clausulasAbusivas, riscos)

    return {
      tipoContrato,
      clausulasObrigatorias,
      clausulasAbusivas,
      conformidadeLGPD,
      riscos,
      recomendacoes,
      parecer,
    }
  }

  /**
   * Identifica o tipo de contrato
   */
  private identificarTipoContrato(text: string): ContractAnalysis['tipoContrato'] {
    const textLower = text.toLowerCase()

    if (textLower.includes('compra e venda') || textLower.includes('comprador')) {
      return 'compra-venda'
    }
    if (textLower.includes('locação') || textLower.includes('locador')) {
      return 'locacao'
    }
    if (textLower.includes('permuta')) {
      return 'permuta'
    }
    if (textLower.includes('doação') || textLower.includes('doador')) {
      return 'doacao'
    }
    if (textLower.includes('usufruto')) {
      return 'usufruto'
    }

    return 'outro'
  }

  /**
   * Verifica cláusulas obrigatórias
   */
  private verificarClausulasObrigatorias(
    text: string,
    tipo: ContractAnalysis['tipoContrato']
  ): ContractAnalysis['clausulasObrigatorias'] {
    const textLower = text.toLowerCase()
    const clausulasRequeridas = this.getClausulasRequeridas(tipo)

    const presente: string[] = []
    const ausente: string[] = []

    clausulasRequeridas.forEach((clausula) => {
      const keywords = this.getKeywords(clausula)
      const found = keywords.some((kw) => textLower.includes(kw.toLowerCase()))

      if (found) {
        presente.push(clausula)
      } else {
        ausente.push(clausula)
      }
    })

    return { presente, ausente }
  }

  /**
   * Define cláusulas requeridas por tipo de contrato
   */
  private getClausulasRequeridas(tipo: ContractAnalysis['tipoContrato']): string[] {
    const clausulas: Record<string, string[]> = {
      'compra-venda': [
        'Qualificação completa das partes',
        'Descrição do imóvel (matrícula, metragem, confrontações)',
        'Preço e forma de pagamento',
        'Prazo para entrega das chaves',
        'Cláusula de vistoria',
        'Responsabilidade por débitos anteriores',
        'Foro de eleição',
      ],
      'locacao': [
        'Qualificação de locador e locatário',
        'Descrição do imóvel',
        'Valor do aluguel e reajuste',
        'Prazo de locação',
        'Finalidade da locação',
        'Forma de pagamento',
        'Responsabilidade por reparos',
        'Multa por rescisão antecipada',
      ],
    }

    return clausulas[tipo] || []
  }

  /**
   * Keywords para identificar cláusulas
   */
  private getKeywords(clausula: string): string[] {
    const keywords: Record<string, string[]> = {
      'Qualificação completa das partes': ['qualificado', 'cpf', 'rg', 'endereço'],
      'Descrição do imóvel (matrícula, metragem, confrontações)': ['matrícula', 'metragem', 'confronta'],
      'Preço e forma de pagamento': ['preço', 'valor', 'pagamento'],
      'Prazo para entrega das chaves': ['prazo', 'entrega', 'chaves'],
      'Valor do aluguel e reajuste': ['aluguel', 'reajuste'],
    }

    return keywords[clausula] || [clausula.toLowerCase()]
  }

  /**
   * Identifica cláusulas abusivas
   */
  private identificarClausulasAbusivas(text: string): ContractAnalysis['clausulasAbusivas'] {
    const textLower = text.toLowerCase()
    const abusivas: ContractAnalysis['clausulasAbusivas'] = []

    // Cláusula de renúncia de direitos
    if (textLower.includes('renuncia') && textLower.includes('direito')) {
      abusivas.push({
        clausula: 'Renúncia de direitos',
        fundamentacao: 'Art. 51, I, CDC - Cláusula que impossibilite, exonere ou atenue a responsabilidade do fornecedor',
        gravidade: 'alta',
      })
    }

    // Multa abusiva (> 50% do valor)
    if (textLower.includes('multa') && (textLower.includes('100%') || textLower.includes('200%'))) {
      abusivas.push({
        clausula: 'Multa excessiva',
        fundamentacao: 'Art. 413 do Código Civil - Multa superior a 50% é abusiva',
        gravidade: 'alta',
      })
    }

    // Cláusula de foro
    if (textLower.includes('foro') && !textLower.includes('domicílio')) {
      abusivas.push({
        clausula: 'Foro de eleição abusivo',
        fundamentacao: 'Súmula 381 do STJ - Cláusula de eleição de foro abusiva em contrato de adesão',
        gravidade: 'media',
      })
    }

    // Reajuste sem índice
    if (textLower.includes('reajuste') && !textLower.includes('igp') && !textLower.includes('ipca')) {
      abusivas.push({
        clausula: 'Reajuste sem índice oficial',
        fundamentacao: 'Lei 8.880/94 - Reajuste deve seguir índice oficial',
        gravidade: 'media',
      })
    }

    return abusivas
  }

  /**
   * Verifica conformidade com LGPD
   */
  private verificarLGPD(text: string): ContractAnalysis['conformidadeLGPD'] {
    const textLower = text.toLowerCase()
    const problemas: string[] = []
    const recomendacoes: string[] = []

    // Coleta de dados pessoais sem consentimento
    if (textLower.includes('dados pessoais') && !textLower.includes('consentimento')) {
      problemas.push('Coleta de dados pessoais sem cláusula de consentimento')
      recomendacoes.push('Incluir cláusula de consentimento para tratamento de dados pessoais (art. 7º, I, LGPD)')
    }

    // Finalidade não especificada
    if (textLower.includes('dados') && !textLower.includes('finalidade')) {
      problemas.push('Finalidade do tratamento de dados não especificada')
      recomendacoes.push('Especificar finalidade legítima e específica para coleta de dados (art. 6º, I, LGPD)')
    }

    // Direitos do titular não mencionados
    if (!textLower.includes('acesso') || !textLower.includes('correção')) {
      problemas.push('Direitos do titular não mencionados')
      recomendacoes.push('Informar direitos de acesso, correção e exclusão de dados (arts. 17-22, LGPD)')
    }

    const conforme = problemas.length === 0

    return { conforme, problemas, recomendacoes }
  }

  /**
   * Identifica riscos
   */
  private identificarRiscos(
    text: string,
    tipo: ContractAnalysis['tipoContrato']
  ): ContractAnalysis['riscos'] {
    const textLower = text.toLowerCase()
    const riscos: ContractAnalysis['riscos'] = []

    // Risco registrário
    if (!textLower.includes('matrícula')) {
      riscos.push({
        tipo: 'registrario',
        descricao: 'Ausência de número de matrícula do imóvel',
        severidade: 'alta',
      })
    }

    // Risco financeiro
    if (textLower.includes('financiamento') && !textLower.includes('aprovação')) {
      riscos.push({
        tipo: 'financeiro',
        descricao: 'Financiamento sem cláusula de condição suspensiva',
        severidade: 'media',
      })
    }

    // Risco jurídico
    if (!textLower.includes('certidão') && tipo === 'compra-venda') {
      riscos.push({
        tipo: 'juridico',
        descricao: 'Sem obrigação de apresentar certidões negativas',
        severidade: 'alta',
      })
    }

    return riscos
  }

  /**
   * Gera recomendações
   */
  private gerarRecomendacoes(
    clausulasObrigatorias: ContractAnalysis['clausulasObrigatorias'],
    clausulasAbusivas: ContractAnalysis['clausulasAbusivas'],
    riscos: ContractAnalysis['riscos']
  ): string[] {
    const recomendacoes: string[] = []

    // Recomendar inclusão de cláusulas ausentes
    clausulasObrigatorias.ausente.forEach((clausula) => {
      recomendacoes.push(`Incluir cláusula obrigatória: ${clausula}`)
    })

    // Recomendar remoção de cláusulas abusivas
    clausulasAbusivas.forEach((abusiva) => {
      if (abusiva.gravidade === 'alta') {
        recomendacoes.push(`URGENTE: Remover ou reformular - ${abusiva.clausula}`)
      } else {
        recomendacoes.push(`Revisar: ${abusiva.clausula}`)
      }
    })

    // Recomendar mitigação de riscos
    riscos.forEach((risco) => {
      if (risco.severidade === 'alta') {
        recomendacoes.push(`RISCO ALTO: ${risco.descricao}`)
      }
    })

    // Recomendações gerais
    recomendacoes.push('Solicitar certidões atualizadas (matrícula, IPTU, condomínio)')
    recomendacoes.push('Verificar regularidade da documentação do imóvel')

    return recomendacoes
  }

  /**
   * Emite parecer final
   */
  private emitirParecer(
    clausulasAbusivas: ContractAnalysis['clausulasAbusivas'],
    riscos: ContractAnalysis['riscos']
  ): ContractAnalysis['parecer'] {
    const abusivasAltas = clausulasAbusivas.filter((c) => c.gravidade === 'alta').length
    const riscosAltos = riscos.filter((r) => r.severidade === 'alta').length

    if (abusivasAltas > 0 || riscosAltos > 1) {
      return 'reprovado'
    } else if (clausulasAbusivas.length > 0 || riscos.length > 0) {
      return 'aprovado-com-ressalvas'
    } else {
      return 'aprovado'
    }
  }
}
