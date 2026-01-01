/**
 * Account Blocker - Bloqueio de contas bancárias
 * Orienta sobre bloqueio judicial de contas e valores (SISBAJUD)
 */

export interface AccountBlockingStrategy {
  viabilidade: {
    possivel: boolean
    probabilidadeSuccesso: 'alta' | 'media' | 'baixa'
    fundamentacao: string[]
  }
  requisitos: {
    cumpridos: string[]
    pendentes: string[]
  }
  procedimento: {
    etapas: {
      numero: number
      descricao: string
      prazo: string
      custos?: string
    }[]
    urgencia: 'alta' | 'media' | 'baixa'
    modalidade: 'cautelar' | 'execucao' | 'tutela-antecipada'
  }
  alvos: {
    tipo: 'conta-corrente' | 'poupanca' | 'investimentos' | 'pix' | 'todos'
    instituicoes: string[]
    valorEstimado?: number
    valorBloqueavel: number
  }
  sisbajud: {
    aplicavel: boolean
    alcance: string[]
    prazoResposta: string
    custos: number
  }
  documentos: {
    obrigatorios: string[]
    complementares: string[]
  }
  alternativas: {
    opcao: string
    vantagens: string[]
    desvantagens: string[]
  }[]
  riscos: {
    tipo: string
    descricao: string
    mitigacao: string
  }[]
  custos: {
    item: string
    valor: string
  }[]
  prazoEstimado: string
}

export class AccountBlocker {
  /**
   * Avalia estratégia de bloqueio de conta bancária
   */
  async evaluateBlocking(blockingData: {
    motivoBloqueio: 'divida' | 'fraude' | 'pensao-alimenticia' | 'indenizacao' | 'outro'
    valorCredito: number
    devedorNome: string
    devedorCPF: string
    temTituloExecutivo: boolean
    tipoTitulo?: 'judicial' | 'extrajudicial'
    urgente: boolean
    instituicoesConhecidas?: string[]
  }): Promise<AccountBlockingStrategy> {
    // Avaliar viabilidade
    const viabilidade = this.avaliarViabilidade(blockingData)

    // Verificar requisitos
    const requisitos = this.verificarRequisitos(blockingData)

    // Definir procedimento
    const procedimento = this.definirProcedimento(blockingData)

    // Identificar alvos
    const alvos = this.identificarAlvos(blockingData)

    // Avaliar uso do SISBAJUD
    const sisbajud = this.avaliarSISBAJUD(blockingData)

    // Listar documentos
    const documentos = this.listarDocumentos(blockingData)

    // Sugerir alternativas
    const alternativas = this.sugerirAlternativas(blockingData)

    // Identificar riscos
    const riscos = this.identificarRiscos(blockingData)

    // Estimar custos
    const custos = this.estimarCustos(blockingData)

    // Estimar prazo
    const prazoEstimado = this.estimarPrazo(procedimento.modalidade)

    return {
      viabilidade,
      requisitos,
      procedimento,
      alvos,
      sisbajud,
      documentos,
      alternativas,
      riscos,
      custos,
      prazoEstimado,
    }
  }

  /**
   * Avalia viabilidade do bloqueio
   */
  private avaliarViabilidade(
    blockingData: any
  ): AccountBlockingStrategy['viabilidade'] {
    const { temTituloExecutivo, motivoBloqueio, valorCredito } = blockingData

    const fundamentacao: string[] = []
    let possivel = false
    let probabilidadeSuccesso: 'alta' | 'media' | 'baixa' = 'baixa'

    // Com título executivo = alta viabilidade
    if (temTituloExecutivo) {
      possivel = true
      probabilidadeSuccesso = 'alta'
      fundamentacao.push('Art. 854 do CPC - Bloqueio via SISBAJUD em execução')
      fundamentacao.push('Art. 835, I do CPC - Dinheiro é a primeira ordem de penhora')
    }
    // Sem título mas com urgência (cautelar ou tutela antecipada)
    else if (
      blockingData.urgente &&
      (motivoBloqueio === 'fraude' || motivoBloqueio === 'pensao-alimenticia')
    ) {
      possivel = true
      probabilidadeSuccesso = 'media'
      fundamentacao.push('Art. 300 do CPC - Tutela de urgência cautelar')
      fundamentacao.push('Art. 528, §3º do CPC - Penhora de alimentos')

      if (motivoBloqueio === 'pensao-alimenticia') {
        probabilidadeSuccesso = 'alta'
        fundamentacao.push('Súmula 309 do STJ - Prisão civil por dívida alimentar')
      }
    }
    // Sem título e sem urgência = inviável
    else {
      possivel = false
      fundamentacao.push(
        'Bloqueio judicial requer título executivo ou medida cautelar fundamentada'
      )
      fundamentacao.push('Necessário primeiro obter sentença judicial condenatória')
    }

    return {
      possivel,
      probabilidadeSuccesso,
      fundamentacao,
    }
  }

  /**
   * Verifica requisitos necessários
   */
  private verificarRequisitos(
    blockingData: any
  ): AccountBlockingStrategy['requisitos'] {
    const cumpridos: string[] = []
    const pendentes: string[] = []

    // CPF do devedor
    if (blockingData.devedorCPF) {
      cumpridos.push('CPF do devedor identificado')
    } else {
      pendentes.push('Obter CPF do devedor')
    }

    // Título executivo
    if (blockingData.temTituloExecutivo) {
      cumpridos.push('Título executivo judicial ou extrajudicial')
    } else {
      pendentes.push('Obter sentença judicial condenatória')
    }

    // Valor do crédito
    if (blockingData.valorCredito > 0) {
      cumpridos.push('Valor do crédito definido')
    } else {
      pendentes.push('Quantificar valor exato do débito')
    }

    // Instituições bancárias
    if (blockingData.instituicoesConhecidas && blockingData.instituicoesConhecidas.length > 0) {
      cumpridos.push('Instituições financeiras do devedor conhecidas')
    } else {
      pendentes.push(
        'Identificar instituições (ou usar busca via SISBAJUD em todos os bancos)'
      )
    }

    return {
      cumpridos,
      pendentes,
    }
  }

  /**
   * Define procedimento de bloqueio
   */
  private definirProcedimento(
    blockingData: any
  ): AccountBlockingStrategy['procedimento'] {
    const { temTituloExecutivo, urgente, motivoBloqueio } = blockingData

    let modalidade: 'cautelar' | 'execucao' | 'tutela-antecipada'
    let urgencia: 'alta' | 'media' | 'baixa'
    const etapas: AccountBlockingStrategy['procedimento']['etapas'] = []

    // Execução (com título)
    if (temTituloExecutivo) {
      modalidade = 'execucao'
      urgencia = urgente ? 'alta' : 'media'

      etapas.push({
        numero: 1,
        descricao: 'Protocolar ação de execução',
        prazo: '1-2 dias',
        custos: 'Custas judiciais',
      })

      etapas.push({
        numero: 2,
        descricao: 'Requerer bloqueio via SISBAJUD',
        prazo: '24-48 horas após despacho',
      })

      etapas.push({
        numero: 3,
        descricao: 'Bloqueio efetuado pelos bancos',
        prazo: '24 horas',
      })

      etapas.push({
        numero: 4,
        descricao: 'Conversão de bloqueio em penhora',
        prazo: '5 dias após resposta',
      })

      etapas.push({
        numero: 5,
        descricao: 'Transferência dos valores',
        prazo: '30-60 dias',
      })
    }
    // Tutela antecipada (urgente, sem título)
    else if (urgente) {
      modalidade = 'tutela-antecipada'
      urgencia = 'alta'

      etapas.push({
        numero: 1,
        descricao: 'Protocolar ação com pedido de tutela de urgência',
        prazo: '1-2 dias',
        custos: 'Custas judiciais',
      })

      etapas.push({
        numero: 2,
        descricao: 'Aguardar decisão liminar do juiz',
        prazo: '5-15 dias',
      })

      etapas.push({
        numero: 3,
        descricao: 'Se deferida, bloqueio via SISBAJUD',
        prazo: '24-48 horas',
      })

      etapas.push({
        numero: 4,
        descricao: 'Prosseguir com ação principal',
        prazo: 'Variável (6-24 meses)',
      })
    }
    // Cautelar
    else {
      modalidade = 'cautelar'
      urgencia = 'media'

      etapas.push({
        numero: 1,
        descricao: 'Protocolar medida cautelar de arresto',
        prazo: '1-2 dias',
      })

      etapas.push({
        numero: 2,
        descricao: 'Aguardar decisão judicial',
        prazo: '10-30 dias',
      })

      etapas.push({
        numero: 3,
        descricao: 'Protocolar ação principal no prazo',
        prazo: '30 dias após cautelar',
      })
    }

    return {
      etapas,
      urgencia,
      modalidade,
    }
  }

  /**
   * Identifica alvos do bloqueio
   */
  private identificarAlvos(blockingData: any): AccountBlockingStrategy['alvos'] {
    const { valorCredito, instituicoesConhecidas, motivoBloqueio } = blockingData

    // Valor bloqueável (pode ser maior que o crédito para cobrir custas)
    const valorBloqueavel = valorCredito * 1.2

    return {
      tipo: 'todos',
      instituicoes: instituicoesConhecidas || [
        'Todos os bancos (busca via SISBAJUD)',
      ],
      valorEstimado: valorCredito,
      valorBloqueavel,
    }
  }

  /**
   * Avalia uso do SISBAJUD
   */
  private avaliarSISBAJUD(blockingData: any): AccountBlockingStrategy['sisbajud'] {
    return {
      aplicavel: true,
      alcance: [
        'Contas correntes',
        'Contas poupança',
        'Investimentos',
        'Chaves PIX',
        'Aplicações financeiras',
      ],
      prazoResposta: '24 horas após ordem judicial',
      custos: 0, // Sistema gratuito
    }
  }

  /**
   * Lista documentos necessários
   */
  private listarDocumentos(
    blockingData: any
  ): AccountBlockingStrategy['documentos'] {
    const obrigatorios = [
      'CPF/CNPJ do devedor',
      'Título executivo (sentença, contrato com força executiva, etc.)',
      'Memória de cálculo atualizada do débito',
      'Procuração com poderes específicos',
      'Comprovante de qualificação do credor',
    ]

    const complementares = [
      'Comprovantes de tentativas amigáveis de cobrança',
      'Extratos ou documentos que comprovem a dívida',
      'Informações sobre endereço e trabalho do devedor',
      'Informações sobre patrimônio conhecido do devedor',
    ]

    if (blockingData.motivoBloqueio === 'pensao-alimenticia') {
      obrigatorios.push('Certidão de nascimento dos filhos')
      obrigatorios.push('Comprovação da necessidade alimentar')
    }

    return {
      obrigatorios,
      complementares,
    }
  }

  /**
   * Sugere alternativas
   */
  private sugerirAlternativas(
    blockingData: any
  ): AccountBlockingStrategy['alternativas'] {
    const alternativas: AccountBlockingStrategy['alternativas'] = []

    // Acordo extrajudicial
    alternativas.push({
      opcao: 'Acordo extrajudicial',
      vantagens: [
        'Mais rápido (dias vs meses)',
        'Sem custos judiciais',
        'Preserva relacionamento',
      ],
      desvantagens: [
        'Depende da boa vontade do devedor',
        'Sem garantia de cumprimento',
      ],
    })

    // Protesto
    alternativas.push({
      opcao: 'Protesto de título',
      vantagens: [
        'Rápido (5-10 dias)',
        'Barato (R$ 50-200)',
        'Negativação do devedor',
        'Facilita acordo',
      ],
      desvantagens: [
        'Não garante pagamento',
        'Devedor pode sustar por via judicial',
      ],
    })

    // Penhora de outros bens
    alternativas.push({
      opcao: 'Penhora de veículos ou imóveis',
      vantagens: ['Garantia real', 'Possível leilão'],
      desvantagens: ['Mais demorado', 'Custos de avaliação e leilão'],
    })

    return alternativas
  }

  /**
   * Identifica riscos
   */
  private identificarRiscos(
    blockingData: any
  ): AccountBlockingStrategy['riscos'] {
    const riscos: AccountBlockingStrategy['riscos'] = []

    riscos.push({
      tipo: 'Conta sem saldo',
      descricao: 'Devedor pode ter zerado as contas ou transferido valores',
      mitigacao: 'Agir com rapidez; requerer bloqueio liminar sem ciência prévia',
    })

    riscos.push({
      tipo: 'Bloqueio de valores impenhoráveis',
      descricao: 'Salários até 40 SM e benefícios previdenciários são impenhoráveis',
      mitigacao:
        'Especificar que o bloqueio não abrange valores impenhoráveis (art. 833 CPC)',
    })

    riscos.push({
      tipo: 'Fraude à execução',
      descricao: 'Devedor pode transferir bens para terceiros',
      mitigacao: 'Requerer bloqueio de imediato e investigar transferências recentes',
    })

    if (!blockingData.temTituloExecutivo) {
      riscos.push({
        tipo: 'Indeferimento da tutela antecipada',
        descricao: 'Juiz pode negar bloqueio sem título executivo definitivo',
        mitigacao: 'Fundamentar bem a urgência e risco de dano irreparável',
      })
    }

    return riscos
  }

  /**
   * Estima custos
   */
  private estimarCustos(blockingData: any): AccountBlockingStrategy['custos'] {
    const custos: AccountBlockingStrategy['custos'] = []

    custos.push({ item: 'Honorários advocatícios', valor: 'R$ 2.000,00 a R$ 5.000,00' })
    custos.push({ item: 'Custas judiciais', valor: '1% do valor da causa (mín. R$ 200)' })
    custos.push({ item: 'Taxa SISBAJUD', valor: 'Gratuito' })

    if (blockingData.urgente) {
      custos.push({ item: 'Urgência processual', valor: 'Acréscimo de 20-30% nos honorários' })
    }

    custos.push({ item: 'Total estimado', valor: 'R$ 2.500,00 a R$ 6.500,00' })

    return custos
  }

  /**
   * Estima prazo
   */
  private estimarPrazo(modalidade: string): string {
    const prazos: Record<string, string> = {
      'execucao': '30-60 dias (com SISBAJUD)',
      'tutela-antecipada': '15-45 dias (se deferida liminar)',
      'cautelar': '60-90 dias',
    }

    return prazos[modalidade] || '30-90 dias'
  }
}
