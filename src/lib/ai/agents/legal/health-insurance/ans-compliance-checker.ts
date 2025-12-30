/**
 * ANS Compliance Checker - Verifica conformidade com normas ANS
 * Identifica irregularidades de operadoras de saúde
 */

export interface ANSComplianceCheck {
  operadora: {
    nome: string
    registroANS: string
    situacao: 'ativa' | 'suspensa' | 'cancelada' | 'nao-encontrada'
  }
  irregularidades: {
    tipo: 'cancelamento-unilateral' | 'reajuste-abusivo' | 'carencia-irregular' | 'rede-insuficiente' | 'outra'
    descricao: string
    normaViolada: string
    gravidade: 'leve' | 'media' | 'grave'
  }[]
  indicadores: {
    indice: string
    valor: number
    status: 'satisfatorio' | 'alerta' | 'critico'
    explicacao: string
  }[]
  acoesRecomendadas: {
    acao: string
    prazo: string
    orgao: string
  }[]
  multas: {
    tipo: string
    valorEstimado: number
    fundamentacao: string
  }[]
  ressarcimento: {
    viavel: boolean
    valor: number
    procedimento: string[]
  }
}

export class ANSComplianceChecker {
  /**
   * Verifica conformidade da operadora com normas ANS
   */
  async checkCompliance(complianceData: {
    nomeOperadora: string
    registroANS?: string
    tipoIrregularidade: string
    descricaoProblema: string
    dataOcorrencia: string
    valorPrejuizo?: number
  }): Promise<ANSComplianceCheck> {
    // Verificar cadastro da operadora
    const operadora = this.verificarOperadora(complianceData)

    // Identificar irregularidades
    const irregularidades = this.identificarIrregularidades(complianceData)

    // Consultar indicadores (simulado - em produção, consultar API ANS)
    const indicadores = this.consultarIndicadores(operadora)

    // Recomendar ações
    const acoesRecomendadas = this.recomendarAcoes(irregularidades)

    // Calcular multas aplicáveis
    const multas = this.calcularMultas(irregularidades)

    // Avaliar ressarcimento
    const ressarcimento = this.avaliarRessarcimento(complianceData, irregularidades)

    return {
      operadora,
      irregularidades,
      indicadores,
      acoesRecomendadas,
      multas,
      ressarcimento,
    }
  }

  private verificarOperadora(complianceData: any): ANSComplianceCheck['operadora'] {
    // Em produção, consultar API ANS
    // Aqui, simulação básica
    return {
      nome: complianceData.nomeOperadora,
      registroANS: complianceData.registroANS || '123456',
      situacao: 'ativa',
    }
  }

  private identificarIrregularidades(
    complianceData: any
  ): ANSComplianceCheck['irregularidades'] {
    const irregularidades: ANSComplianceCheck['irregularidades'] = []
    const { tipoIrregularidade, descricaoProblema } = complianceData
    const descLower = descricaoProblema.toLowerCase()

    if (tipoIrregularidade.toLowerCase().includes('cancelamento') || descLower.includes('cancel')) {
      irregularidades.push({
        tipo: 'cancelamento-unilateral',
        descricao: 'Cancelamento unilateral sem justa causa',
        normaViolada: 'RN 195/2009 ANS - Proibição de cancelamento unilateral',
        gravidade: 'grave',
      })
    }

    if (tipoIrregularidade.toLowerCase().includes('reajuste') || descLower.includes('aumento')) {
      irregularidades.push({
        tipo: 'reajuste-abusivo',
        descricao: 'Reajuste acima do permitido pela ANS',
        normaViolada: 'RN 441/2018 ANS - Limite de reajuste por faixa etária',
        gravidade: 'media',
      })
    }

    if (descLower.includes('carência') || descLower.includes('carencia')) {
      irregularidades.push({
        tipo: 'carencia-irregular',
        descricao: 'Aplicação irregular de carências',
        normaViolada: 'RN 465/2021 ANS - Prazos máximos de carência',
        gravidade: 'media',
      })
    }

    if (descLower.includes('rede') || descLower.includes('credenciado')) {
      irregularidades.push({
        tipo: 'rede-insuficiente',
        descricao: 'Rede credenciada insuficiente',
        normaViolada: 'RN 259/2011 ANS - Garantia de atendimento',
        gravidade: 'grave',
      })
    }

    return irregularidades
  }

  private consultarIndicadores(
    operadora: ANSComplianceCheck['operadora']
  ): ANSComplianceCheck['indicadores'] {
    // Simulação - em produção, consultar API Dados Abertos ANS
    return [
      {
        indice: 'IDSS - Índice de Desempenho da Saúde Suplementar',
        valor: 0.65,
        status: 'alerta',
        explicacao: 'Entre 0.6-0.7 indica desempenho médio. Acima de 0.8 é satisfatório.',
      },
      {
        indice: 'Taxa de Reclamações (por 1000 beneficiários)',
        valor: 15,
        status: 'critico',
        explicacao: 'Acima de 10 é considerado crítico. Média do setor: 5.',
      },
      {
        indice: 'Tempo Médio de Atendimento (dias)',
        valor: 7,
        status: 'satisfatorio',
        explicacao: 'Dentro do padrão ANS (até 7 dias para consultas).',
      },
    ]
  }

  private recomendarAcoes(
    irregularidades: ANSComplianceCheck['irregularidades']
  ): ANSComplianceCheck['acoesRecomendadas'] {
    const acoes: ANSComplianceCheck['acoesRecomendadas'] = []

    acoes.push({
      acao: 'Protocolar reclamação formal na ANS',
      prazo: 'Imediato',
      orgao: 'ANS - Agência Nacional de Saúde',
    })

    if (irregularidades.some((i) => i.gravidade === 'grave')) {
      acoes.push({
        acao: 'Solicitar fiscalização da operadora',
        prazo: '7 dias',
        orgao: 'ANS - Fiscalização',
      })
    }

    acoes.push({
      acao: 'Registrar no PROCON',
      prazo: '15 dias',
      orgao: 'PROCON Estadual',
    })

    if (irregularidades.some((i) => i.tipo === 'cancelamento-unilateral')) {
      acoes.push({
        acao: 'Ação judicial para restabelecimento do plano',
        prazo: 'Urgente - 48h',
        orgao: 'Justiça Estadual',
      })
    }

    return acoes
  }

  private calcularMultas(
    irregularidades: ANSComplianceCheck['irregularidades']
  ): ANSComplianceCheck['multas'] {
    const multas: ANSComplianceCheck['multas'] = []

    irregularidades.forEach((irreg) => {
      let valor = 0
      if (irreg.gravidade === 'leve') valor = 5000
      else if (irreg.gravidade === 'media') valor = 20000
      else if (irreg.gravidade === 'grave') valor = 50000

      multas.push({
        tipo: irreg.tipo,
        valorEstimado: valor,
        fundamentacao: `${irreg.normaViolada} - ANS pode aplicar multa conforme gravidade`,
      })
    })

    return multas
  }

  private avaliarRessarcimento(
    complianceData: any,
    irregularidades: ANSComplianceCheck['irregularidades']
  ): ANSComplianceCheck['ressarcimento'] {
    const viavel = irregularidades.length > 0 && complianceData.valorPrejuizo > 0

    return {
      viavel,
      valor: complianceData.valorPrejuizo || 0,
      procedimento: [
        'Reunir documentação (comprovantes, e-mails, notificações)',
        'Protocolar reclamação na ANS',
        'Aguardar decisão administrativa (60-90 dias)',
        'Se indeferido, ingressar com ação judicial',
      ],
    }
  }
}
