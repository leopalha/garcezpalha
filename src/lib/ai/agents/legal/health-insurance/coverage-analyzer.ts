/**
 * Coverage Analyzer - Analisa cobertura de planos de saúde
 * Verifica negativas abusivas e direitos do beneficiário
 */

export interface CoverageAnalysis {
  procedimento: {
    nome: string
    codigo: string // TUSS
    tipo: 'consulta' | 'exame' | 'cirurgia' | 'internacao' | 'tratamento' | 'medicamento'
  }
  cobertura: {
    obrigatoria: boolean
    fundamentacao: string[]
    rol_ans: boolean
    urgente: boolean
  }
  negativa: {
    justificada: boolean
    motivoOperadora: string
    contraargumentos: string[]
    abusiva: boolean
  }
  direitos: {
    direito: string
    fundamentacao: string
  }[]
  acoesDisponiveis: {
    administrativa: {
      orgao: string
      prazo: string
      custos: number
    }[]
    judicial: {
      tipo: string
      urgencia: 'urgentissima' | 'urgente' | 'normal'
      chancesSuccesso: 'alta' | 'media' | 'baixa'
      custos: number
    }[]
  }
  jurisprudencia: {
    sumula: string
    aplicacao: string
  }[]
  valorCausa: {
    danosMateriais: number
    danosMorais: {
      min: number
      max: number
    }
    total: {
      min: number
      max: number
    }
  }
  prazos: {
    acao: string
    prazo: string
  }[]
}

export class CoverageAnalyzer {
  /**
   * Analisa cobertura e negativa de plano de saúde
   */
  async analyzeCoverage(coverageData: {
    nomePlano: string
    operadora: string
    tipoProcedimento: string
    codigoTUSS?: string
    motivoNegativa: string
    prescricaoMedica: boolean
    urgente: boolean
    valorProcedimento: number
    jaRealizou: boolean // Se já pagou particular
  }): Promise<CoverageAnalysis> {
    // Identificar procedimento
    const procedimento = this.identificarProcedimento(coverageData)

    // Verificar cobertura obrigatória
    const cobertura = this.verificarCobertura(procedimento, coverageData)

    // Analisar negativa
    const negativa = this.analisarNegativa(coverageData, cobertura)

    // Listar direitos do beneficiário
    const direitos = this.listarDireitos(cobertura, negativa)

    // Indicar ações disponíveis
    const acoesDisponiveis = this.indicarAcoes(coverageData, negativa)

    // Buscar jurisprudência
    const jurisprudencia = this.buscarJurisprudencia(procedimento, negativa)

    // Calcular valor da causa
    const valorCausa = this.calcularValorCausa(coverageData, negativa)

    // Calcular prazos
    const prazos = this.calcularPrazos(coverageData)

    return {
      procedimento,
      cobertura,
      negativa,
      direitos,
      acoesDisponiveis,
      jurisprudencia,
      valorCausa,
      prazos,
    }
  }

  private identificarProcedimento(coverageData: any): CoverageAnalysis['procedimento'] {
    const { tipoProcedimento, codigoTUSS } = coverageData

    let tipo: CoverageAnalysis['procedimento']['tipo'] = 'tratamento'
    const nome = tipoProcedimento.toLowerCase()

    if (nome.includes('consulta')) tipo = 'consulta'
    else if (nome.includes('exame') || nome.includes('ressonância') || nome.includes('tomografia')) tipo = 'exame'
    else if (nome.includes('cirurgia') || nome.includes('operação')) tipo = 'cirurgia'
    else if (nome.includes('internação') || nome.includes('uti')) tipo = 'internacao'
    else if (nome.includes('quimioterapia') || nome.includes('radioterapia')) tipo = 'tratamento'
    else if (nome.includes('medicamento') || nome.includes('remédio')) tipo = 'medicamento'

    return {
      nome: tipoProcedimento,
      codigo: codigoTUSS || 'Não informado',
      tipo,
    }
  }

  private verificarCobertura(
    procedimento: CoverageAnalysis['procedimento'],
    coverageData: any
  ): CoverageAnalysis['cobertura'] {
    const { prescricaoMedica, urgente } = coverageData
    const fundamentacao: string[] = []
    let obrigatoria = false
    let rol_ans = true

    // Verificar Rol ANS
    const procedimentosRolANS = [
      'consulta',
      'exame',
      'cirurgia',
      'internacao',
      'quimioterapia',
      'radioterapia',
      'hemodiálise',
      'tratamento oncológico',
    ]

    const estaNoRol = procedimentosRolANS.some((p) =>
      procedimento.nome.toLowerCase().includes(p)
    )

    if (estaNoRol) {
      obrigatoria = true
      fundamentacao.push('Procedimento consta no Rol de Procedimentos da ANS')
      fundamentacao.push('Lei 9.656/98 - Cobertura mínima obrigatória')
    }

    // Procedimento não está no Rol, mas há prescrição médica
    if (!estaNoRol && prescricaoMedica) {
      obrigatoria = true
      rol_ans = false
      fundamentacao.push('Súmula 102 do TJSP - Rol ANS é exemplificativo, não taxativo')
      fundamentacao.push('Havendo prescrição médica, cobertura é obrigatória')
      fundamentacao.push('Tema 1.062 STJ - Rol ANS não é taxativo')
    }

    // Urgência/emergência
    if (urgente) {
      obrigatoria = true
      fundamentacao.push('Resolução Normativa ANS 465/2021 - Cobertura de urgência/emergência')
      fundamentacao.push('Negativa em caso de urgência é abusiva (art. 51, CDC)')
    }

    return {
      obrigatoria,
      fundamentacao,
      rol_ans: estaNoRol,
      urgente,
    }
  }

  private analisarNegativa(
    coverageData: any,
    cobertura: CoverageAnalysis['cobertura']
  ): CoverageAnalysis['negativa'] {
    const { motivoNegativa } = coverageData
    const motivoLower = motivoNegativa.toLowerCase()
    const contraargumentos: string[] = []
    let justificada = false
    let abusiva = false

    // Negativas comuns e contraargumentos
    if (motivoLower.includes('carência')) {
      if (cobertura.urgente) {
        abusiva = true
        contraargumentos.push('Carência não se aplica a urgências/emergências (RN 465/2021)')
        contraargumentos.push('Cobertura parcial temporária (CPT) deve ser respeitada')
      } else {
        justificada = true
        contraargumentos.push('Verificar se carência contratual é compatível com legislação')
      }
    }

    if (motivoLower.includes('doença preexistente') || motivoLower.includes('dcp')) {
      abusiva = true
      contraargumentos.push('Operadora deve provar má-fé do beneficiário (ônus da prova)')
      contraargumentos.push('Cobertura Parcial Temporária (CPT) limitada a 24 meses')
      contraargumentos.push('Súmula 105 do TJSP - Negativa por DCP após CPT é abusiva')
    }

    if (motivoLower.includes('experimental') || motivoLower.includes('sem comprovação')) {
      if (cobertura.rol_ans || motivoNegativa.includes('prescrição')) {
        abusiva = true
        contraargumentos.push('Rol ANS é exemplificativo (Tema 1.062 STJ)')
        contraargumentos.push('Havendo prescrição médica fundamentada, deve ser coberto')
      }
    }

    if (motivoLower.includes('não consta no rol') || motivoLower.includes('fora do rol')) {
      abusiva = true
      contraargumentos.push('Súmula 102 TJSP - Rol ANS é exemplificativo')
      contraargumentos.push('Tema 1.062 STJ - Rol não é taxativo')
      contraargumentos.push('Prescrição médica prevalece sobre Rol ANS')
    }

    if (motivoLower.includes('fora da rede') || motivoLower.includes('credenciamento')) {
      if (cobertura.urgente || motivoLower.includes('indisponibilidade')) {
        abusiva = true
        contraargumentos.push('Ausência de profissional na rede credenciada obriga reembolso')
        contraargumentos.push('Súmula 469 STJ - Reembolso integral se não há credenciado')
      }
    }

    if (!justificada && contraargumentos.length > 0) {
      abusiva = true
    }

    return {
      justificada,
      motivoOperadora: motivoNegativa,
      contraargumentos,
      abusiva,
    }
  }

  private listarDireitos(
    cobertura: CoverageAnalysis['cobertura'],
    negativa: CoverageAnalysis['negativa']
  ): CoverageAnalysis['direitos'] {
    const direitos: CoverageAnalysis['direitos'] = []

    direitos.push({
      direito: 'Cobertura conforme prescrição médica',
      fundamentacao: 'Art. 51, IV do CDC - Cláusula que coloca consumidor em desvantagem é nula',
    })

    if (cobertura.urgente) {
      direitos.push({
        direito: 'Atendimento imediato em casos de urgência/emergência',
        fundamentacao: 'RN 465/2021 ANS - Cobertura de urgência sem carência',
      })
    }

    direitos.push({
      direito: 'Informação clara sobre coberturas e exclusões',
      fundamentacao: 'Art. 6º, III do CDC - Direito à informação adequada',
    })

    if (negativa.abusiva) {
      direitos.push({
        direito: 'Indenização por danos morais e materiais',
        fundamentacao: 'Súmula 37 STJ - Cumulação de danos morais e materiais',
      })

      direitos.push({
        direito: 'Reembolso de despesas pagas particularmente',
        fundamentacao: 'Art. 42, parágrafo único do CDC - Devolução em dobro (se má-fé)',
      })
    }

    return direitos
  }

  private indicarAcoes(
    coverageData: any,
    negativa: CoverageAnalysis['negativa']
  ): CoverageAnalysis['acoesDisponiveis'] {
    const administrativa: CoverageAnalysis['acoesDisponiveis']['administrativa'] = []
    const judicial: CoverageAnalysis['acoesDisponiveis']['judicial'] = []

    // Ações administrativas
    administrativa.push({
      orgao: 'Ouvidoria da Operadora',
      prazo: '7 dias para resposta',
      custos: 0,
    })

    administrativa.push({
      orgao: 'ANS - Agência Nacional de Saúde Suplementar',
      prazo: '30-60 dias para análise',
      custos: 0,
    })

    administrativa.push({
      orgao: 'PROCON',
      prazo: '15-30 dias',
      custos: 0,
    })

    // Ações judiciais
    if (coverageData.urgente) {
      judicial.push({
        tipo: 'Tutela de Urgência (liminar para autorização imediata)',
        urgencia: 'urgentissima',
        chancesSuccesso: negativa.abusiva ? 'alta' : 'media',
        custos: 2000,
      })
    }

    judicial.push({
      tipo: 'Ação de Obrigação de Fazer + Indenização',
      urgencia: coverageData.urgente ? 'urgente' : 'normal',
      chancesSuccesso: negativa.abusiva ? 'alta' : 'media',
      custos: 3000,
    })

    if (coverageData.jaRealizou) {
      judicial.push({
        tipo: 'Ação de Restituição de Valores + Danos Morais',
        urgencia: 'normal',
        chancesSuccesso: negativa.abusiva ? 'alta' : 'media',
        custos: 3500,
      })
    }

    return {
      administrativa,
      judicial,
    }
  }

  private buscarJurisprudencia(
    procedimento: CoverageAnalysis['procedimento'],
    negativa: CoverageAnalysis['negativa']
  ): CoverageAnalysis['jurisprudencia'] {
    const jurisprudencia: CoverageAnalysis['jurisprudencia'] = []

    jurisprudencia.push({
      sumula: 'Súmula 102 do TJSP',
      aplicacao: 'Havendo expressa indicação médica, é abusiva a negativa de cobertura de custeio de tratamento sob o argumento da sua natureza experimental ou por não estar previsto no rol de procedimentos da ANS',
    })

    if (negativa.motivoOperadora.toLowerCase().includes('doença preexistente')) {
      jurisprudencia.push({
        sumula: 'Súmula 105 do TJSP',
        aplicacao: 'Não prevalece a negativa de cobertura às doenças e às lesões preexistentes se a operadora não submeteu o beneficiário a exames prévios',
      })
    }

    jurisprudencia.push({
      sumula: 'Tema 1.062 STJ',
      aplicacao: 'Rol de procedimentos da ANS é exemplificativo (taxatividade mitigada), devendo cobrir tratamentos prescritos por médico',
    })

    jurisprudencia.push({
      sumula: 'Súmula 469 STJ',
      aplicacao: 'Aplica-se o CDC aos contratos de plano de saúde',
    })

    return jurisprudencia
  }

  private calcularValorCausa(
    coverageData: any,
    negativa: CoverageAnalysis['negativa']
  ): CoverageAnalysis['valorCausa'] {
    const { valorProcedimento, jaRealizou } = coverageData

    const danosMateriais = jaRealizou ? valorProcedimento : 0

    let danosMoraisMin = 0
    let danosMoraisMax = 0

    if (negativa.abusiva) {
      // Danos morais conforme jurisprudência
      if (coverageData.urgente) {
        danosMoraisMin = 10000
        danosMoraisMax = 30000
      } else {
        danosMoraisMin = 5000
        danosMoraisMax = 15000
      }

      // Aumentar se cirurgia ou tratamento grave
      if (coverageData.tipoProcedimento.toLowerCase().includes('cirurgia') ||
          coverageData.tipoProcedimento.toLowerCase().includes('câncer')) {
        danosMoraisMin *= 1.5
        danosMoraisMax *= 2
      }
    }

    return {
      danosMateriais,
      danosMorais: {
        min: Math.round(danosMoraisMin),
        max: Math.round(danosMoraisMax),
      },
      total: {
        min: Math.round(danosMateriais + danosMoraisMin),
        max: Math.round(danosMateriais + danosMoraisMax),
      },
    }
  }

  private calcularPrazos(coverageData: any): CoverageAnalysis['prazos'] {
    const prazos: CoverageAnalysis['prazos'] = []

    prazos.push({
      acao: 'Reclamação na ANS',
      prazo: 'A qualquer momento',
    })

    prazos.push({
      acao: 'Ação judicial',
      prazo: '5 anos (art. 27 do CDC)',
    })

    if (coverageData.urgente) {
      prazos.push({
        acao: 'Tutela de urgência',
        prazo: 'IMEDIATO - Protocolar em até 24-48h',
      })
    }

    return prazos
  }
}
