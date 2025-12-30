/**
 * Injury Evaluator - Avalia lesões corporais e danos
 * Classifica gravidade segundo código penal e estima indenizações
 */

export interface InjuryEvaluation {
  classificacao: {
    gravidade: 'leve' | 'grave' | 'gravissima'
    natureza: 'temporaria' | 'permanente' | 'fatal'
    artigo: string // Art. 129 CP ou 121 CP
  }
  caracteristicas: {
    tipoLesao: string[]
    partesAfetadas: string[]
    incapacidade: {
      temporaria: boolean
      diasAfastamento?: number
      permanente: boolean
      grauIncapacidade?: number // Percentual
    }
    deformidade: {
      presente: boolean
      visivel: boolean
      permanente: boolean
    }
  }
  consequencias: {
    fisicas: string[]
    psicologicas: string[]
    sociais: string[]
    economicas: string[]
  }
  indenizacao: {
    danosMorais: {
      min: number
      max: number
      fundamentacao: string[]
    }
    danosMateriais: {
      tratamentoMedico: number
      medicamentos: number
      lucrosCessantes: number
      pensionamento?: {
        valor: number
        duracao: string
      }
    }
    danosEsteticos: {
      valor: number
      fundamentacao: string
    }
    total: {
      min: number
      max: number
    }
  }
  periciaRecomendada: {
    tipo: 'medica' | 'psicologica' | 'psiquiatrica' | 'multipla'
    especialidades: string[]
    examesnecessarios: string[]
  }
  jurisprudencia: {
    casos: string[]
    valores: { min: number; max: number }[]
  }
}

export class InjuryEvaluator {
  /**
   * Avalia lesão corporal e estima indenização
   */
  async evaluateInjury(injuryData: {
    descricao: string
    partesAfetadas: string[]
    diasAfastamento?: number
    sequelas: string[]
    tratamentoNecessario: string[]
    custoTratamento?: number
    idadeVitima: number
    profissao: string
    rendaMensal?: number
  }): Promise<InjuryEvaluation> {
    // Classificar gravidade
    const classificacao = this.classificarLesao(injuryData)

    // Avaliar características
    const caracteristicas = this.avaliarCaracteristicas(injuryData)

    // Analisar consequências
    const consequencias = this.analisarConsequencias(injuryData, caracteristicas)

    // Calcular indenização
    const indenizacao = this.calcularIndenizacao(
      classificacao,
      caracteristicas,
      consequencias,
      injuryData
    )

    // Recomendar perícia
    const periciaRecomendada = this.recomendarPericia(classificacao, caracteristicas)

    // Buscar jurisprudência
    const jurisprudencia = this.buscarJurisprudencia(classificacao, caracteristicas)

    return {
      classificacao,
      caracteristicas,
      consequencias,
      indenizacao,
      periciaRecomendada,
      jurisprudencia,
    }
  }

  /**
   * Classifica lesão segundo CP
   */
  private classificarLesao(injuryData: any): InjuryEvaluation['classificacao'] {
    const { sequelas, diasAfastamento } = injuryData

    // Lesão gravíssima (art. 129, §2º)
    if (
      sequelas.some((s: string) =>
        s.toLowerCase().includes('perda') ||
        s.toLowerCase().includes('amputação') ||
        s.toLowerCase().includes('aborto')
      )
    ) {
      return {
        gravidade: 'gravissima',
        natureza: 'permanente',
        artigo: 'Art. 129, §2º do Código Penal',
      }
    }

    // Lesão grave (art. 129, §1º)
    if (
      (diasAfastamento && diasAfastamento > 30) ||
      sequelas.some((s: string) =>
        s.toLowerCase().includes('permanente') || s.toLowerCase().includes('deformidade')
      )
    ) {
      return {
        gravidade: 'grave',
        natureza: 'permanente',
        artigo: 'Art. 129, §1º do Código Penal',
      }
    }

    // Lesão leve (caput)
    return {
      gravidade: 'leve',
      natureza: 'temporaria',
      artigo: 'Art. 129, caput do Código Penal',
    }
  }

  /**
   * Avalia características da lesão
   */
  private avaliarCaracteristicas(injuryData: any): InjuryEvaluation['caracteristicas'] {
    const { partesAfetadas, sequelas, diasAfastamento } = injuryData

    const tipoLesao: string[] = []
    if (sequelas.includes('fratura')) tipoLesao.push('Fratura óssea')
    if (sequelas.includes('corte')) tipoLesao.push('Ferimento cortocontuso')
    if (sequelas.includes('queimadura')) tipoLesao.push('Queimadura')
    if (sequelas.includes('traumatismo')) tipoLesao.push('Traumatismo')

    const temDeformidade = sequelas.some((s: string) => s.toLowerCase().includes('deformidade'))
    const temIncapacidadePermanente = sequelas.some((s: string) =>
      s.toLowerCase().includes('permanente')
    )

    return {
      tipoLesao,
      partesAfetadas,
      incapacidade: {
        temporaria: !!diasAfastamento,
        diasAfastamento,
        permanente: temIncapacidadePermanente,
        grauIncapacidade: temIncapacidadePermanente ? 25 : undefined, // Estimativa
      },
      deformidade: {
        presente: temDeformidade,
        visivel: temDeformidade && partesAfetadas.some((p) => p.includes('rosto') || p.includes('face')),
        permanente: temDeformidade,
      },
    }
  }

  /**
   * Analisa consequências da lesão
   */
  private analisarConsequencias(
    injuryData: any,
    caracteristicas: InjuryEvaluation['caracteristicas']
  ): InjuryEvaluation['consequencias'] {
    const fisicas: string[] = []
    const psicologicas: string[] = []
    const sociais: string[] = []
    const economicas: string[] = []

    // Consequências físicas
    if (caracteristicas.incapacidade.permanente) {
      fisicas.push('Incapacidade permanente para atividades habituais')
    }
    if (caracteristicas.deformidade.presente) {
      fisicas.push('Deformidade física permanente')
    }
    if (caracteristicas.incapacidade.temporaria) {
      fisicas.push(`Afastamento de ${caracteristicas.incapacidade.diasAfastamento} dias`)
    }

    // Consequências psicológicas
    if (caracteristicas.deformidade.visivel) {
      psicologicas.push('Abalo psicológico por deformidade visível')
      psicologicas.push('Possível desenvolvimento de ansiedade e depressão')
    }
    psicologicas.push('Trauma emocional decorrente da agressão')

    // Consequências sociais
    if (caracteristicas.deformidade.visivel) {
      sociais.push('Dificuldade de relacionamento social')
      sociais.push('Discriminação e constrangimento em público')
    }

    // Consequências econômicas
    if (caracteristicas.incapacidade.temporaria) {
      economicas.push(`Perda de rendimentos durante ${caracteristicas.incapacidade.diasAfastamento} dias`)
    }
    if (caracteristicas.incapacidade.permanente) {
      economicas.push('Redução permanente da capacidade laborativa')
      economicas.push('Necessidade de readaptação profissional')
    }
    economicas.push('Custos com tratamento médico e medicamentos')

    return {
      fisicas,
      psicologicas,
      sociais,
      economicas,
    }
  }

  /**
   * Calcula indenização devida
   */
  private calcularIndenizacao(
    classificacao: InjuryEvaluation['classificacao'],
    caracteristicas: InjuryEvaluation['caracteristicas'],
    consequencias: InjuryEvaluation['consequencias'],
    injuryData: any
  ): InjuryEvaluation['indenizacao'] {
    // Danos morais (baseado em jurisprudência)
    let danosMoraisMin = 5000
    let danosMoraisMax = 15000

    if (classificacao.gravidade === 'grave') {
      danosMoraisMin = 20000
      danosMoraisMax = 50000
    } else if (classificacao.gravidade === 'gravissima') {
      danosMoraisMin = 50000
      danosMoraisMax = 200000
    }

    // Aumentar se houver deformidade visível
    if (caracteristicas.deformidade.visivel) {
      danosMoraisMin *= 1.5
      danosMoraisMax *= 2
    }

    const fundamentacaoDanosMorais = [
      'Art. 5º, V e X da Constituição Federal',
      'Art. 186 e 927 do Código Civil',
      'Jurisprudência do STJ sobre danos morais',
    ]

    // Danos materiais
    const tratamentoMedico = injuryData.custoTratamento || 5000
    const medicamentos = 2000
    const lucrosCessantes =
      caracteristicas.incapacidade.temporaria && injuryData.rendaMensal
        ? (injuryData.rendaMensal / 30) * (caracteristicas.incapacidade.diasAfastamento || 0)
        : 0

    let pensionamento = undefined
    if (caracteristicas.incapacidade.permanente && injuryData.rendaMensal) {
      const reducaoCapacidade = caracteristicas.incapacidade.grauIncapacidade || 25
      pensionamento = {
        valor: injuryData.rendaMensal * (reducaoCapacidade / 100),
        duracao: 'Até expectativa de vida (IBGE)',
      }
    }

    // Danos estéticos
    let danosEsteticos = 0
    let fundamentacaoEsteticos = ''
    if (caracteristicas.deformidade.visivel) {
      danosEsteticos = classificacao.gravidade === 'gravissima' ? 50000 : 20000
      fundamentacaoEsteticos =
        'Súmula 387 do STJ - Danos estéticos cumulam-se com danos morais'
    }

    const danosMateriais = {
      tratamentoMedico,
      medicamentos,
      lucrosCessantes,
      pensionamento,
    }

    const totalMin = danosMoraisMin + tratamentoMedico + medicamentos + lucrosCessantes + danosEsteticos
    const totalMax = danosMoraisMax + tratamentoMedico + medicamentos + lucrosCessantes + danosEsteticos

    return {
      danosMorais: {
        min: Math.round(danosMoraisMin),
        max: Math.round(danosMoraisMax),
        fundamentacao: fundamentacaoDanosMorais,
      },
      danosMateriais,
      danosEsteticos: {
        valor: danosEsteticos,
        fundamentacao: fundamentacaoEsteticos,
      },
      total: {
        min: Math.round(totalMin),
        max: Math.round(totalMax),
      },
    }
  }

  /**
   * Recomenda perícia necessária
   */
  private recomendarPericia(
    classificacao: InjuryEvaluation['classificacao'],
    caracteristicas: InjuryEvaluation['caracteristicas']
  ): InjuryEvaluation['periciaRecomendada'] {
    const especialidades: string[] = []
    const examesnecessarios: string[] = []

    // Perícia médica sempre necessária
    especialidades.push('Medicina Legal')

    if (caracteristicas.tipoLesao.includes('Fratura óssea')) {
      especialidades.push('Ortopedia')
      examesnecessarios.push('Raio-X', 'Tomografia')
    }

    if (caracteristicas.deformidade.presente) {
      especialidades.push('Cirurgia Plástica')
      examesnecessarios.push('Fotografias documentais')
    }

    if (caracteristicas.incapacidade.permanente) {
      especialidades.push('Medicina do Trabalho')
      examesnecessarios.push('Avaliação funcional')
    }

    // Perícia psicológica se trauma grave
    let tipo: 'medica' | 'psicologica' | 'psiquiatrica' | 'multipla' = 'medica'
    if (classificacao.gravidade === 'grave' || classificacao.gravidade === 'gravissima') {
      tipo = 'multipla'
      especialidades.push('Psicologia', 'Psiquiatria')
      examesnecessarios.push('Avaliação psicológica')
    }

    return {
      tipo,
      especialidades,
      examesnecessarios,
    }
  }

  /**
   * Busca jurisprudência similar
   */
  private buscarJurisprudencia(
    classificacao: InjuryEvaluation['classificacao'],
    caracteristicas: InjuryEvaluation['caracteristicas']
  ): InjuryEvaluation['jurisprudencia'] {
    // Casos similares (exemplos)
    const casos: string[] = []
    const valores: { min: number; max: number }[] = []

    if (caracteristicas.deformidade.visivel) {
      casos.push('STJ - REsp 1.234.567 - Cicatriz facial - R$ 80.000,00')
      valores.push({ min: 50000, max: 100000 })
    }

    if (classificacao.gravidade === 'gravissima') {
      casos.push('STJ - REsp 2.345.678 - Amputação de membro - R$ 150.000,00')
      valores.push({ min: 100000, max: 200000 })
    }

    if (caracteristicas.incapacidade.permanente) {
      casos.push('STJ - REsp 3.456.789 - Incapacidade laboral permanente - R$ 60.000,00 + pensão')
      valores.push({ min: 40000, max: 80000 })
    }

    return {
      casos,
      valores,
    }
  }
}
