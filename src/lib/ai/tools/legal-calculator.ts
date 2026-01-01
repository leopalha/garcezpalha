/**
 * Legal Calculator - Cálculos jurídicos diversos
 * Correção monetária, juros, multas, prescrição, etc.
 */

export interface CalculationResult {
  valorOriginal: number
  valorAtualizado: number
  correcaoMonetaria: number
  juros: number
  multa?: number
  total: number
  periodo: {
    inicio: string
    fim: string
    dias: number
    meses: number
    anos: number
  }
  indices: {
    nome: string
    percentual: number
  }[]
  detalhamento: {
    data: string
    valorPrincipal: number
    correcao: number
    juros: number
    total: number
  }[]
}

export interface PrescricaoResult {
  prazo: number // anos
  dataInicio: string
  dataFim: string
  prescrito: boolean
  diasRestantes?: number
  fundamentacao: string[]
  tipo: 'civil' | 'penal' | 'trabalhista' | 'tributario'
}

export class LegalCalculator {
  /**
   * Calcula correção monetária + juros
   */
  async calculateMonetaryCorrection(params: {
    valorOriginal: number
    dataInicial: string
    dataFinal: string
    indice: 'IPCA' | 'INPC' | 'IGP-M' | 'SELIC' | 'TR'
    tipoJuros?: 'simples' | 'composto'
    taxaJuros?: number // % ao mês
    incluirMulta?: boolean
    percentualMulta?: number
  }): Promise<CalculationResult> {
    const inicio = new Date(params.dataInicial)
    const fim = new Date(params.dataFinal)

    const periodo = this.calcularPeriodo(inicio, fim)

    // Simular índices (em produção, consultar API do Banco Central)
    const indices = this.obterIndices(params.indice, periodo)

    // Calcular correção monetária
    let valorCorrigido = params.valorOriginal
    const detalhamento: CalculationResult['detalhamento'] = []

    indices.forEach((idx) => {
      const correcao = valorCorrigido * (idx.percentual / 100)
      valorCorrigido += correcao
    })

    const correcaoMonetaria = valorCorrigido - params.valorOriginal

    // Calcular juros
    const taxaMensal = params.taxaJuros || 1 // 1% ao mês padrão
    let jurosAcumulados = 0

    if (params.tipoJuros === 'composto') {
      // Juros compostos
      jurosAcumulados = valorCorrigido * (Math.pow(1 + taxaMensal / 100, periodo.meses) - 1)
    } else {
      // Juros simples (padrão)
      jurosAcumulados = valorCorrigido * (taxaMensal / 100) * periodo.meses
    }

    // Calcular multa (se aplicável)
    let multa = 0
    if (params.incluirMulta && params.percentualMulta) {
      multa = params.valorOriginal * (params.percentualMulta / 100)
    }

    const total = valorCorrigido + jurosAcumulados + multa

    return {
      valorOriginal: params.valorOriginal,
      valorAtualizado: Math.round(valorCorrigido * 100) / 100,
      correcaoMonetaria: Math.round(correcaoMonetaria * 100) / 100,
      juros: Math.round(jurosAcumulados * 100) / 100,
      multa: multa > 0 ? Math.round(multa * 100) / 100 : undefined,
      total: Math.round(total * 100) / 100,
      periodo,
      indices,
      detalhamento,
    }
  }

  /**
   * Calcula prescrição de dívida/direito
   */
  async calculatePrescription(params: {
    tipo: 'civil' | 'penal' | 'trabalhista' | 'tributario' | 'consumerista'
    natureza: string // tipo específico (ex: 'indenização', 'furto', 'fgts')
    dataFato: string
    dataAtual?: string
  }): Promise<PrescricaoResult> {
    const dataFato = new Date(params.dataFato)
    const dataAtual = params.dataAtual ? new Date(params.dataAtual) : new Date()

    const { prazo, fundamentacao, tipo } = this.obterPrazoPrescricao(params.tipo, params.natureza)

    const dataFim = new Date(dataFato)
    dataFim.setFullYear(dataFim.getFullYear() + prazo)

    const prescrito = dataAtual >= dataFim

    let diasRestantes: number | undefined
    if (!prescrito) {
      const diff = dataFim.getTime() - dataAtual.getTime()
      diasRestantes = Math.ceil(diff / (1000 * 60 * 60 * 24))
    }

    return {
      prazo,
      dataInicio: dataFato.toISOString().split('T')[0],
      dataFim: dataFim.toISOString().split('T')[0],
      prescrito,
      diasRestantes,
      fundamentacao,
      tipo,
    }
  }

  /**
   * Calcula honorários advocatícios conforme tabela OAB
   */
  async calculateLegalFees(params: {
    valorCausa: number
    tipo: 'judicial' | 'extrajudicial' | 'consultoria'
    complexidade: 'baixa' | 'media' | 'alta'
    estado: string
  }): Promise<{
    honorariosMinimos: number
    honorariosSugeridos: number
    honorariosMaximos: number
    base: string
    observacoes: string[]
  }> {
    // Tabela OAB (valores simulados - em produção, consultar tabela oficial do estado)
    let percentualMin = 0.1 // 10%
    let percentualMed = 0.15 // 15%
    let percentualMax = 0.2 // 20%

    if (params.tipo === 'extrajudicial') {
      percentualMin = 0.08
      percentualMed = 0.12
      percentualMax = 0.15
    }

    if (params.complexidade === 'alta') {
      percentualMin *= 1.5
      percentualMed *= 1.5
      percentualMax *= 1.5
    }

    const honorariosMinimos = Math.max(params.valorCausa * percentualMin, 2000)
    const honorariosSugeridos = Math.max(params.valorCausa * percentualMed, 3000)
    const honorariosMaximos = params.valorCausa * percentualMax

    const observacoes = [
      'Valores baseados na Tabela de Honorários da OAB',
      'Percentuais podem variar conforme complexidade e estado',
      'Valores mínimos garantem sustentabilidade da advocacia',
      'Honorários de sucumbência são fixados pelo juiz (10-20% do valor da causa)',
    ]

    return {
      honorariosMinimos: Math.round(honorariosMinimos),
      honorariosSugeridos: Math.round(honorariosSugeridos),
      honorariosMaximos: Math.round(honorariosMaximos),
      base: `Tabela OAB ${params.estado}`,
      observacoes,
    }
  }

  /**
   * Calcula prazo processual
   */
  async calculateProcessDeadline(params: {
    dataPublicacao: string
    prazo: number // dias úteis
    tipo: 'intimacao' | 'citacao' | 'recurso' | 'contestacao'
    considerarFerias?: boolean
  }): Promise<{
    dataInicio: string
    dataFim: string
    diasUteis: number
    diasCorridos: number
    observacoes: string[]
  }> {
    const dataPubl = new Date(params.dataPublicacao)

    // Calcular dias úteis (excluindo sábados, domingos e feriados)
    let diasUteis = 0
    let diasCorridos = 0
    const dataAtual = new Date(dataPubl)

    while (diasUteis < params.prazo) {
      dataAtual.setDate(dataAtual.getDate() + 1)
      diasCorridos++

      const diaSemana = dataAtual.getDay()
      const ehDiaUtil = diaSemana !== 0 && diaSemana !== 6 // Não é sábado nem domingo

      if (ehDiaUtil && !this.ehFeriado(dataAtual)) {
        diasUteis++
      }
    }

    const observacoes = [
      'Art. 219 CPC - Prazos contados em dias úteis (exceto quando lei dispuser diferente)',
      'Não se computam sábados, domingos e feriados',
      'Prazo começa a correr no primeiro dia útil seguinte à publicação',
    ]

    if (params.considerarFerias) {
      observacoes.push('Férias forenses (20/dez a 20/jan): prazos suspensos')
    }

    return {
      dataInicio: dataPubl.toISOString().split('T')[0],
      dataFim: dataAtual.toISOString().split('T')[0],
      diasUteis: params.prazo,
      diasCorridos,
      observacoes,
    }
  }

  // Métodos auxiliares privados

  private calcularPeriodo(inicio: Date, fim: Date): CalculationResult['periodo'] {
    const diffTime = Math.abs(fim.getTime() - inicio.getTime())
    const dias = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    const meses = Math.floor(dias / 30)
    const anos = Math.floor(meses / 12)

    return {
      inicio: inicio.toISOString().split('T')[0],
      fim: fim.toISOString().split('T')[0],
      dias,
      meses,
      anos,
    }
  }

  private obterIndices(
    indice: string,
    periodo: CalculationResult['periodo']
  ): CalculationResult['indices'] {
    // Simulação - em produção, consultar API do Banco Central
    const indices: CalculationResult['indices'] = []

    const taxaMensal = indice === 'IPCA' ? 0.5 : indice === 'SELIC' ? 1.0 : 0.6

    for (let i = 0; i < periodo.meses; i++) {
      indices.push({
        nome: `${indice} - Mês ${i + 1}`,
        percentual: taxaMensal,
      })
    }

    return indices
  }

  private obterPrazoPrescricao(
    tipo: string,
    natureza: string
  ): { prazo: number; fundamentacao: string[]; tipo: PrescricaoResult['tipo'] } {
    const prazos: Record<string, { prazo: number; fundamentacao: string[] }> = {
      // Civil
      'civil-indenizacao': {
        prazo: 3,
        fundamentacao: ['Art. 206, §3º, V do Código Civil - Pretensão de reparação civil'],
      },
      'civil-divida': {
        prazo: 5,
        fundamentacao: ['Art. 206, §5º do Código Civil - Dívida líquida'],
      },
      'civil-geral': {
        prazo: 10,
        fundamentacao: ['Art. 205 do Código Civil - Prazo geral'],
      },

      // Penal
      'penal-furto': {
        prazo: 8,
        fundamentacao: ['Art. 109, IV do CP - Crime com pena máxima de 4 anos'],
      },
      'penal-roubo': {
        prazo: 12,
        fundamentacao: ['Art. 109, III do CP - Crime com pena máxima de 8 anos'],
      },
      'penal-homicidio': {
        prazo: 20,
        fundamentacao: ['Art. 109, I do CP - Crime com pena superior a 12 anos'],
      },

      // Trabalhista
      'trabalhista-fgts': {
        prazo: 30,
        fundamentacao: ['Art. 23, §5º da Lei 8.036/90 - Prescrição trintenária do FGTS'],
      },
      'trabalhista-verbas': {
        prazo: 5,
        fundamentacao: ['Art. 7º, XXIX da CF/88 - Prescrição quinquenal'],
      },

      // Tributário
      'tributario-cobranca': {
        prazo: 5,
        fundamentacao: ['Art. 174 do CTN - Prescrição da cobrança tributária'],
      },

      // Consumidor
      'consumerista-vicio': {
        prazo: 0.25, // 90 dias
        fundamentacao: ['Art. 26, II do CDC - Vício em produto durável'],
      },
    }

    const chave = `${tipo}-${natureza.toLowerCase()}`
    const resultado = prazos[chave] || prazos[`${tipo}-geral`] || { prazo: 10, fundamentacao: ['Prazo geral de 10 anos'] }

    return {
      ...resultado,
      tipo: tipo as PrescricaoResult['tipo'],
    }
  }

  private ehFeriado(data: Date): boolean {
    // Feriados nacionais fixos (simulação simplificada)
    const mes = data.getMonth() + 1
    const dia = data.getDate()

    const feriadosFixos = [
      { mes: 1, dia: 1 }, // Ano Novo
      { mes: 4, dia: 21 }, // Tiradentes
      { mes: 5, dia: 1 }, // Trabalho
      { mes: 9, dia: 7 }, // Independência
      { mes: 10, dia: 12 }, // Nossa Senhora
      { mes: 11, dia: 2 }, // Finados
      { mes: 11, dia: 15 }, // Proclamação
      { mes: 12, dia: 25 }, // Natal
    ]

    return feriadosFixos.some((f) => f.mes === mes && f.dia === dia)
  }
}

// Singleton instance
export const legalCalculator = new LegalCalculator()
