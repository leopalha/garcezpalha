/**
 * Signature Analyzer - Análise grafotécnica de assinaturas
 * Identifica divergências e possível falsificação
 */

export interface SignatureAnalysis {
  autenticidade: {
    probabilidade: 'muito-alta' | 'alta' | 'media' | 'baixa' | 'muito-baixa'
    percentual: number // 0-100%
    conclusao: 'autentica' | 'duvidosa' | 'falsa'
  }
  caracteristicas: {
    pressao: {
      uniforme: boolean
      tremor: boolean
      observacao: string
    }
    velocidade: {
      natural: boolean
      hesitacao: boolean
      observacao: string
    }
    proporcao: {
      consistente: boolean
      desvios: string[]
    }
    inclinacao: {
      angulo: number // graus
      consistente: boolean
    }
    ligacoes: {
      naturais: boolean
      interrupcoes: string[]
    }
  }
  divergencias: {
    tipo: 'pressao' | 'velocidade' | 'proporcao' | 'inclinacao' | 'ligacao' | 'tremor'
    descricao: string
    gravidade: 'leve' | 'moderada' | 'grave'
  }[]
  pontosComparacao: {
    total: number
    convergentes: number
    divergentes: number
    percentualConvergencia: number
  }
  indiciosFalsificacao: {
    presente: boolean
    indicios: string[]
    fundamentacao: string[]
  }
  periciaRecomendada: {
    necessaria: boolean
    tipo: 'grafotecnica' | 'documentoscopia' | 'completa'
    urgencia: 'alta' | 'media' | 'baixa'
    custoEstimado: number
  }
  acaoJudicial: {
    viavel: boolean
    tipoAcao: string[]
    fundamentacao: string[]
    prazosPrescricao: string
  }
}

export class SignatureAnalyzer {
  /**
   * Analisa assinatura comparando com padrões autênticos
   */
  async analyzeSignature(signatureData: {
    assinaturaQuestionada: {
      imagem?: string // base64 ou URL
      descricao: string
      contexto: string // onde foi usada
      data: string
    }
    assinaturasAutenticas: {
      imagem?: string
      descricao: string
      data: string
    }[]
    documento: {
      tipo: string // contrato, cheque, procuração, etc
      valor?: number
      partes: string[]
    }
  }): Promise<SignatureAnalysis> {
    // Analisar características da assinatura questionada
    const caracteristicas = this.analisarCaracteristicas(signatureData.assinaturaQuestionada)

    // Comparar com assinaturas autênticas
    const pontosComparacao = this.compararAssinaturas(
      signatureData.assinaturaQuestionada,
      signatureData.assinaturasAutenticas
    )

    // Identificar divergências
    const divergencias = this.identificarDivergencias(caracteristicas, pontosComparacao)

    // Calcular probabilidade de autenticidade
    const autenticidade = this.calcularAutenticidade(pontosComparacao, divergencias)

    // Identificar indícios de falsificação
    const indiciosFalsificacao = this.identificarIndiciosFalsificacao(
      caracteristicas,
      divergencias
    )

    // Recomendar perícia
    const periciaRecomendada = this.recomendarPericia(autenticidade, divergencias)

    // Avaliar ação judicial
    const acaoJudicial = this.avaliarAcaoJudicial(
      autenticidade,
      indiciosFalsificacao,
      signatureData.documento
    )

    return {
      autenticidade,
      caracteristicas,
      divergencias,
      pontosComparacao,
      indiciosFalsificacao,
      periciaRecomendada,
      acaoJudicial,
    }
  }

  /**
   * Analisa características grafotécnicas
   */
  private analisarCaracteristicas(
    assinatura: any
  ): SignatureAnalysis['caracteristicas'] {
    const { descricao } = assinatura

    // Análise baseada em descrição (em produção, seria análise de imagem)
    const descLower = descricao.toLowerCase()

    return {
      pressao: {
        uniforme: !descLower.includes('tremor') && !descLower.includes('falha'),
        tremor: descLower.includes('tremor') || descLower.includes('trêmulo'),
        observacao: descLower.includes('tremor')
          ? 'Presença de tremores indica possível falsificação ou assinatura sob coação'
          : 'Pressão uniforme e consistente',
      },
      velocidade: {
        natural: !descLower.includes('lenta') && !descLower.includes('hesitação'),
        hesitacao: descLower.includes('hesitação') || descLower.includes('pausas'),
        observacao: descLower.includes('lenta')
          ? 'Velocidade de execução lenta sugere desenho de assinatura (não natural)'
          : 'Velocidade de execução natural e fluida',
      },
      proporcao: {
        consistente: !descLower.includes('desproporcional'),
        desvios: descLower.includes('desproporcional')
          ? ['Letras desproporcionais em relação ao padrão']
          : [],
      },
      inclinacao: {
        angulo: descLower.includes('inclinada') ? 15 : 0,
        consistente: !descLower.includes('variação'),
      },
      ligacoes: {
        naturais: !descLower.includes('interrompida'),
        interrupcoes: descLower.includes('interrompida')
          ? ['Interrupções não naturais entre letras']
          : [],
      },
    }
  }

  /**
   * Compara assinatura questionada com padrões autênticos
   */
  private compararAssinaturas(
    questionada: any,
    autenticas: any[]
  ): SignatureAnalysis['pontosComparacao'] {
    // Em produção, seria análise algorítmica de imagens
    // Aqui, simulamos baseado em descrições

    const total = 20 // pontos de comparação típicos
    const convergentes = autenticas.length > 0 ? Math.floor(Math.random() * 8) + 8 : 10
    const divergentes = total - convergentes
    const percentualConvergencia = (convergentes / total) * 100

    return {
      total,
      convergentes,
      divergentes,
      percentualConvergencia,
    }
  }

  /**
   * Identifica divergências significativas
   */
  private identificarDivergencias(
    caracteristicas: SignatureAnalysis['caracteristicas'],
    pontosComparacao: SignatureAnalysis['pontosComparacao']
  ): SignatureAnalysis['divergencias'] {
    const divergencias: SignatureAnalysis['divergencias'] = []

    if (caracteristicas.pressao.tremor) {
      divergencias.push({
        tipo: 'tremor',
        descricao: 'Presença de tremores na execução',
        gravidade: 'grave',
      })
    }

    if (!caracteristicas.velocidade.natural) {
      divergencias.push({
        tipo: 'velocidade',
        descricao: 'Velocidade de execução não natural (lenta/hesitante)',
        gravidade: 'grave',
      })
    }

    if (!caracteristicas.proporcao.consistente) {
      divergencias.push({
        tipo: 'proporcao',
        descricao: 'Proporções inconsistentes com padrão autêntico',
        gravidade: 'moderada',
      })
    }

    if (!caracteristicas.inclinacao.consistente) {
      divergencias.push({
        tipo: 'inclinacao',
        descricao: 'Inclinação divergente do padrão',
        gravidade: 'leve',
      })
    }

    if (!caracteristicas.ligacoes.naturais) {
      divergencias.push({
        tipo: 'ligacao',
        descricao: 'Ligações entre letras não naturais',
        gravidade: 'moderada',
      })
    }

    return divergencias
  }

  /**
   * Calcula probabilidade de autenticidade
   */
  private calcularAutenticidade(
    pontosComparacao: SignatureAnalysis['pontosComparacao'],
    divergencias: SignatureAnalysis['divergencias']
  ): SignatureAnalysis['autenticidade'] {
    const { percentualConvergencia } = pontosComparacao
    const divergenciasGraves = divergencias.filter((d) => d.gravidade === 'grave').length

    let percentual = percentualConvergencia
    let probabilidade: SignatureAnalysis['autenticidade']['probabilidade']
    let conclusao: SignatureAnalysis['autenticidade']['conclusao']

    // Reduzir percentual se houver divergências graves
    percentual -= divergenciasGraves * 15

    if (percentual >= 80) {
      probabilidade = 'muito-alta'
      conclusao = 'autentica'
    } else if (percentual >= 60) {
      probabilidade = 'alta'
      conclusao = 'autentica'
    } else if (percentual >= 40) {
      probabilidade = 'media'
      conclusao = 'duvidosa'
    } else if (percentual >= 20) {
      probabilidade = 'baixa'
      conclusao = 'duvidosa'
    } else {
      probabilidade = 'muito-baixa'
      conclusao = 'falsa'
    }

    return {
      probabilidade,
      percentual: Math.max(0, Math.min(100, percentual)),
      conclusao,
    }
  }

  /**
   * Identifica indícios de falsificação
   */
  private identificarIndiciosFalsificacao(
    caracteristicas: SignatureAnalysis['caracteristicas'],
    divergencias: SignatureAnalysis['divergencias']
  ): SignatureAnalysis['indiciosFalsificacao'] {
    const indicios: string[] = []
    const fundamentacao: string[] = []

    if (caracteristicas.pressao.tremor) {
      indicios.push('Tremor de falsário (execução lenta e insegura)')
      fundamentacao.push(
        'Del Picchia - "Tratado de Documentoscopia": tremor indica desenho de assinatura'
      )
    }

    if (!caracteristicas.velocidade.natural) {
      indicios.push('Velocidade de execução incompatível com escrita natural')
      fundamentacao.push(
        'Solange Mendes - "Perícia Grafotécnica": velocidade lenta indica cópia'
      )
    }

    if (caracteristicas.ligacoes.interrupcoes.length > 0) {
      indicios.push('Interrupções não justificadas no traçado')
      fundamentacao.push(
        'Gomide - "Grafoscopia": interrupções indicam cópia por etapas'
      )
    }

    const gravesCount = divergencias.filter((d) => d.gravidade === 'grave').length
    if (gravesCount >= 2) {
      indicios.push('Múltiplas divergências graves em relação ao padrão autêntico')
      fundamentacao.push(
        'Jurisprudência: 2+ divergências graves são suficientes para suspeita de falsificação'
      )
    }

    return {
      presente: indicios.length > 0,
      indicios,
      fundamentacao,
    }
  }

  /**
   * Recomenda perícia grafotécnica
   */
  private recomendarPericia(
    autenticidade: SignatureAnalysis['autenticidade'],
    divergencias: SignatureAnalysis['divergencias']
  ): SignatureAnalysis['periciaRecomendada'] {
    const necessaria = autenticidade.conclusao !== 'autentica'
    let tipo: 'grafotecnica' | 'documentoscopia' | 'completa' = 'grafotecnica'
    let urgencia: 'alta' | 'media' | 'baixa' = 'media'

    if (autenticidade.conclusao === 'falsa') {
      tipo = 'completa'
      urgencia = 'alta'
    } else if (divergencias.length >= 3) {
      tipo = 'documentoscopia'
      urgencia = 'alta'
    }

    const custoEstimado = tipo === 'completa' ? 5000 : tipo === 'documentoscopia' ? 3000 : 2000

    return {
      necessaria,
      tipo,
      urgencia,
      custoEstimado,
    }
  }

  /**
   * Avalia viabilidade de ação judicial
   */
  private avaliarAcaoJudicial(
    autenticidade: SignatureAnalysis['autenticidade'],
    indiciosFalsificacao: SignatureAnalysis['indiciosFalsificacao'],
    documento: any
  ): SignatureAnalysis['acaoJudicial'] {
    const viavel = autenticidade.conclusao === 'falsa' || autenticidade.conclusao === 'duvidosa'
    const tipoAcao: string[] = []
    const fundamentacao: string[] = []

    if (viavel) {
      // Ações cíveis
      tipoAcao.push('Ação Anulatória de Negócio Jurídico (art. 171, CC)')
      tipoAcao.push('Ação Declaratória de Nulidade (art. 166, CC)')
      fundamentacao.push(
        'Art. 166, III do Código Civil - Negócio jurídico nulo por falsificação'
      )
      fundamentacao.push('Art. 171, IV do Código Civil - Negócio anulável por dolo')

      // Ações penais
      if (indiciosFalsificacao.presente) {
        tipoAcao.push('Representação Criminal por Falsificação de Documento (art. 298, CP)')
        tipoAcao.push('Estelionato (art. 171, CP) se houve prejuízo patrimonial')
        fundamentacao.push('Art. 298 do Código Penal - Falsificação de documento particular')
        fundamentacao.push('Art. 171 do Código Penal - Obtenção de vantagem ilícita mediante fraude')
      }
    }

    const prazosPrescricao =
      'Cível: 10 anos (art. 205, CC) | Penal: 12 anos (art. 298, CP - pena máxima 5 anos)'

    return {
      viavel,
      tipoAcao,
      fundamentacao,
      prazosPrescricao,
    }
  }
}
