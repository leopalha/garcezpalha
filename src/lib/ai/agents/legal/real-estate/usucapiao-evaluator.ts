/**
 * Usucapião Evaluator - Avalia viabilidade de ação de usucapião
 * Analisa requisitos legais para diferentes modalidades
 */

export interface UsucapiaoEvaluation {
  modalidade: 'extraordinaria' | 'ordinaria' | 'especial-urbana' | 'especial-rural' | 'nao-aplicavel'
  requisitos: {
    nome: string
    cumprido: boolean
    observacao: string
  }[]
  prazoPosse: {
    anos: number
    suficiente: boolean
    prazoNecessario: number
  }
  animus: {
    presente: boolean
    evidencias: string[]
  }
  viabilidade: 'alta' | 'media' | 'baixa'
  documentosNecessarios: string[]
  procedimento: string[]
  custos: {
    item: string
    valor: string
  }[]
  prazoEstimado: string
  recomendacoes: string[]
}

export class UsucapiaoEvaluator {
  /**
   * Avalia viabilidade de usucapião
   */
  async evaluateUsucapiao(caseData: {
    tempoPosse: number // anos
    areaMetros: number
    tipoImovel: 'urbano' | 'rural'
    possuiJustoTitulo: boolean
    possuiBoaFe: boolean
    moraNoimovel: boolean
    possuiOutroImovel: boolean
    utilizaProducao: boolean
  }): Promise<UsucapiaoEvaluation> {
    // Determinar modalidade aplicável
    const modalidade = this.determinarModalidade(caseData)

    // Verificar requisitos
    const requisitos = this.verificarRequisitos(modalidade, caseData)

    // Avaliar prazo de posse
    const prazoPosse = this.avaliarPrazoPosse(modalidade, caseData.tempoPosse)

    // Verificar animus domini
    const animus = this.verificarAnimus(caseData)

    // Avaliar viabilidade
    const viabilidade = this.avaliarViabilidade(requisitos, prazoPosse)

    // Listar documentos necessários
    const documentosNecessarios = this.listarDocumentos(modalidade)

    // Descrever procedimento
    const procedimento = this.descreverProcedimento(modalidade)

    // Estimar custos
    const custos = this.estimarCustos(modalidade, caseData.areaMetros)

    // Estimar prazo
    const prazoEstimado = this.estimarPrazo(modalidade)

    // Gerar recomendações
    const recomendacoes = this.gerarRecomendacoes(
      modalidade,
      requisitos,
      viabilidade,
      caseData
    )

    return {
      modalidade,
      requisitos,
      prazoPosse,
      animus,
      viabilidade,
      documentosNecessarios,
      procedimento,
      custos,
      prazoEstimado,
      recomendacoes,
    }
  }

  /**
   * Determina modalidade de usucapião aplicável
   */
  private determinarModalidade(
    caseData: any
  ): UsucapiaoEvaluation['modalidade'] {
    // Usucapião Especial Urbana (art. 183, CF/88)
    if (
      caseData.tipoImovel === 'urbano' &&
      caseData.areaMetros <= 250 &&
      caseData.moraNoimovel &&
      !caseData.possuiOutroImovel
    ) {
      return 'especial-urbana'
    }

    // Usucapião Especial Rural (art. 191, CF/88)
    if (
      caseData.tipoImovel === 'rural' &&
      caseData.areaMetros <= 50000 && // 50 hectares = 500.000 m²
      caseData.moraNoimovel &&
      caseData.utilizaProducao &&
      !caseData.possuiOutroImovel
    ) {
      return 'especial-rural'
    }

    // Usucapião Ordinária (art. 1.242, CC)
    if (caseData.possuiJustoTitulo && caseData.possuiBoaFe) {
      return 'ordinaria'
    }

    // Usucapião Extraordinária (art. 1.238, CC)
    if (caseData.tempoPosse >= 15) {
      return 'extraordinaria'
    }

    return 'nao-aplicavel'
  }

  /**
   * Verifica requisitos conforme modalidade
   */
  private verificarRequisitos(
    modalidade: UsucapiaoEvaluation['modalidade'],
    caseData: any
  ): UsucapiaoEvaluation['requisitos'] {
    const requisitos: UsucapiaoEvaluation['requisitos'] = []

    if (modalidade === 'especial-urbana') {
      requisitos.push({
        nome: 'Área não superior a 250m²',
        cumprido: caseData.areaMetros <= 250,
        observacao: `Área atual: ${caseData.areaMetros}m²`,
      })

      requisitos.push({
        nome: 'Posse de 5 anos ininterruptos',
        cumprido: caseData.tempoPosse >= 5,
        observacao: `Tempo de posse: ${caseData.tempoPosse} anos`,
      })

      requisitos.push({
        nome: 'Utilização para moradia',
        cumprido: caseData.moraNoimovel,
        observacao: caseData.moraNoimovel ? 'Reside no imóvel' : 'Não reside no imóvel',
      })

      requisitos.push({
        nome: 'Não possuir outro imóvel',
        cumprido: !caseData.possuiOutroImovel,
        observacao: caseData.possuiOutroImovel
          ? 'Possui outro imóvel'
          : 'Não possui outro imóvel',
      })
    } else if (modalidade === 'especial-rural') {
      requisitos.push({
        nome: 'Área não superior a 50 hectares',
        cumprido: caseData.areaMetros <= 50000,
        observacao: `Área atual: ${(caseData.areaMetros / 10000).toFixed(2)} hectares`,
      })

      requisitos.push({
        nome: 'Posse de 5 anos ininterruptos',
        cumprido: caseData.tempoPosse >= 5,
        observacao: `Tempo de posse: ${caseData.tempoPosse} anos`,
      })

      requisitos.push({
        nome: 'Tornar a área produtiva',
        cumprido: caseData.utilizaProducao,
        observacao: caseData.utilizaProducao ? 'Área produtiva' : 'Área não produtiva',
      })

      requisitos.push({
        nome: 'Moradia no local',
        cumprido: caseData.moraNoimovel,
        observacao: caseData.moraNoimovel ? 'Reside no local' : 'Não reside',
      })

      requisitos.push({
        nome: 'Não possuir outro imóvel',
        cumprido: !caseData.possuiOutroImovel,
        observacao: caseData.possuiOutroImovel ? 'Possui outro imóvel' : 'Não possui',
      })
    } else if (modalidade === 'ordinaria') {
      requisitos.push({
        nome: 'Posse de 10 anos ininterruptos',
        cumprido: caseData.tempoPosse >= 10,
        observacao: `Tempo de posse: ${caseData.tempoPosse} anos`,
      })

      requisitos.push({
        nome: 'Justo título',
        cumprido: caseData.possuiJustoTitulo,
        observacao: caseData.possuiJustoTitulo ? 'Possui justo título' : 'Sem justo título',
      })

      requisitos.push({
        nome: 'Boa-fé',
        cumprido: caseData.possuiBoaFe,
        observacao: caseData.possuiBoaFe ? 'Demonstra boa-fé' : 'Sem boa-fé',
      })
    } else if (modalidade === 'extraordinaria') {
      requisitos.push({
        nome: 'Posse de 15 anos ininterruptos',
        cumprido: caseData.tempoPosse >= 15,
        observacao: `Tempo de posse: ${caseData.tempoPosse} anos (pode reduzir para 10 se morar ou realizar obras)`,
      })

      requisitos.push({
        nome: 'Posse mansa e pacífica',
        cumprido: true,
        observacao: 'Será verificado na instrução processual',
      })
    }

    return requisitos
  }

  /**
   * Avalia prazo de posse
   */
  private avaliarPrazoPosse(
    modalidade: UsucapiaoEvaluation['modalidade'],
    tempoPosse: number
  ): UsucapiaoEvaluation['prazoPosse'] {
    const prazos: Record<string, number> = {
      'especial-urbana': 5,
      'especial-rural': 5,
      'ordinaria': 10,
      'extraordinaria': 15,
    }

    const prazoNecessario = prazos[modalidade] || 0
    const suficiente = tempoPosse >= prazoNecessario

    return {
      anos: tempoPosse,
      suficiente,
      prazoNecessario,
    }
  }

  /**
   * Verifica animus domini (intenção de dono)
   */
  private verificarAnimus(caseData: any): UsucapiaoEvaluation['animus'] {
    const evidencias: string[] = []

    if (caseData.moraNoimovel) {
      evidencias.push('Reside no imóvel como se fosse proprietário')
    }

    if (caseData.utilizaProducao) {
      evidencias.push('Utiliza a área para produção agrícola')
    }

    evidencias.push('Realiza benfeitorias e melhorias')
    evidencias.push('Paga IPTU/ITR em seu nome')
    evidencias.push('Possui contas de consumo (luz, água) em seu nome')

    return {
      presente: evidencias.length >= 2,
      evidencias,
    }
  }

  /**
   * Avalia viabilidade geral
   */
  private avaliarViabilidade(
    requisitos: UsucapiaoEvaluation['requisitos'],
    prazoPosse: UsucapiaoEvaluation['prazoPosse']
  ): UsucapiaoEvaluation['viabilidade'] {
    const requisitosCumpridos = requisitos.filter((r) => r.cumprido).length
    const totalRequisitos = requisitos.length

    if (!prazoPosse.suficiente) {
      return 'baixa'
    }

    const percentualCumprimento = requisitosCumpridos / totalRequisitos

    if (percentualCumprimento === 1) {
      return 'alta'
    } else if (percentualCumprimento >= 0.7) {
      return 'media'
    } else {
      return 'baixa'
    }
  }

  /**
   * Lista documentos necessários
   */
  private listarDocumentos(
    modalidade: UsucapiaoEvaluation['modalidade']
  ): string[] {
    const documentosComuns = [
      'RG e CPF do autor',
      'Certidão de casamento ou nascimento',
      'Comprovante de residência',
      'Certidão de matrícula do imóvel (se houver)',
      'Planta/croqui do imóvel com medidas',
      'Fotos atuais do imóvel',
      'Contas de consumo (água, luz) dos últimos 5-15 anos',
      'Recibos de IPTU/ITR pagos',
      'Declarações de testemunhas (mínimo 3)',
      'Certidão negativa de propriedade de imóveis',
    ]

    const documentosEspecificos: Record<string, string[]> = {
      'especial-urbana': [
        'Declaração de que não possui outro imóvel',
        'Comprovante de que usa para moradia',
      ],
      'especial-rural': [
        'Comprovante de produção agrícola',
        'Declaração de que não possui outro imóvel rural',
        'CAR (Cadastro Ambiental Rural)',
      ],
      'ordinaria': [
        'Justo título (escritura, contrato, etc.)',
        'Prova da boa-fé',
      ],
    }

    return [
      ...documentosComuns,
      ...(documentosEspecificos[modalidade] || []),
    ]
  }

  /**
   * Descreve procedimento
   */
  private descreverProcedimento(
    modalidade: UsucapiaoEvaluation['modalidade']
  ): string[] {
    return [
      '1. Consulta inicial com advogado especializado',
      '2. Reunião de documentação comprobatória',
      '3. Levantamento topográfico do imóvel',
      '4. Coleta de declarações de testemunhas',
      '5. Protocolo da ação judicial (ou extrajudicial se possível)',
      '6. Citação dos confrontantes e Município/União',
      '7. Audiência de justificação de posse',
      '8. Perícia técnica judicial',
      '9. Manifestação do Ministério Público',
      '10. Sentença judicial',
      '11. Registro da sentença no Cartório de Imóveis',
    ]
  }

  /**
   * Estima custos
   */
  private estimarCustos(
    modalidade: UsucapiaoEvaluation['modalidade'],
    areaMetros: number
  ): UsucapiaoEvaluation['custos'] {
    return [
      { item: 'Honorários advocatícios', valor: 'R$ 5.000,00 a R$ 15.000,00' },
      { item: 'Levantamento topográfico', valor: 'R$ 1.500,00 a R$ 3.000,00' },
      { item: 'Custas judiciais', valor: 'R$ 500,00 a R$ 2.000,00' },
      { item: 'Registro da sentença', valor: 'R$ 1.000,00 a R$ 3.000,00' },
      { item: 'Perícia judicial (se necessário)', valor: 'R$ 2.000,00 a R$ 5.000,00' },
      { item: 'Total estimado', valor: 'R$ 10.000,00 a R$ 28.000,00' },
    ]
  }

  /**
   * Estima prazo
   */
  private estimarPrazo(
    modalidade: UsucapiaoEvaluation['modalidade']
  ): string {
    if (modalidade === 'especial-urbana' || modalidade === 'especial-rural') {
      return '12 a 24 meses (extrajudicial pode ser mais rápido)'
    }
    return '18 a 36 meses (via judicial)'
  }

  /**
   * Gera recomendações
   */
  private gerarRecomendacoes(
    modalidade: UsucapiaoEvaluation['modalidade'],
    requisitos: UsucapiaoEvaluation['requisitos'],
    viabilidade: UsucapiaoEvaluation['viabilidade'],
    caseData: any
  ): string[] {
    const recomendacoes: string[] = []

    // Requisitos não cumpridos
    requisitos
      .filter((r) => !r.cumprido)
      .forEach((r) => {
        recomendacoes.push(`⚠️ PENDENTE: ${r.nome} - ${r.observacao}`)
      })

    // Recomendações por viabilidade
    if (viabilidade === 'alta') {
      recomendacoes.push('✅ Caso com alta viabilidade. Recomenda-se prosseguir com a ação.')
    } else if (viabilidade === 'media') {
      recomendacoes.push('⚠️ Caso com viabilidade média. Recomenda-se fortalecer provas antes de propor a ação.')
    } else {
      recomendacoes.push('❌ Caso com baixa viabilidade. Aguardar cumprimento de mais requisitos.')
    }

    // Usucapião extrajudicial
    if (modalidade === 'especial-urbana' || modalidade === 'especial-rural') {
      recomendacoes.push('💡 Avaliar possibilidade de usucapião extrajudicial (mais rápido e econômico)')
    }

    // Documentação
    recomendacoes.push('📄 Iniciar coleta de documentação desde já')
    recomendacoes.push('👥 Identificar e conversar com testemunhas potenciais')

    // Estratégia
    if (caseData.tempoPosse < 5) {
      recomendacoes.push(`⏳ Aguardar ${5 - caseData.tempoPosse} anos para completar prazo mínimo`)
    }

    return recomendacoes
  }
}
