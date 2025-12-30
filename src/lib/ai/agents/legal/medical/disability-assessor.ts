/**
 * Disability Assessor - Avalia grau de incapacidade
 * Calcula percentual de incapacidade para fins previdenciários e indenizatórios
 */

export interface DisabilityAssessment {
  grauIncapacidade: number // Percentual (0-100%)
  classificacao: 'sem-incapacidade' | 'parcial-temporaria' | 'parcial-permanente' | 'total-temporaria' | 'total-permanente'
  tabela: 'susep' | 'dpvat' | 'inss' | 'outra'
  afericao: {
    funcoes: {
      funcao: string
      percentualPerda: number
      descricao: string
    }[]
    atividadesVidaDiaria: {
      atividade: string
      comprometida: boolean
      grau: 'leve' | 'moderado' | 'grave'
    }[]
  }
  impactoLaboral: {
    profissaoAtual: string
    podeExercer: boolean
    limitacoes: string[]
    necessitaReadaptacao: boolean
    profissoesCompativeis: string[]
  }
  beneficiosPrevidenciarios: {
    auxilioDoenca: {
      elegivel: boolean
      fundamentacao: string
    }
    aposentadoriaInvalidez: {
      elegivel: boolean
      fundamentacao: string
    }
    auxilioAcidente: {
      elegivel: boolean
      percentual?: number
      fundamentacao: string
    }
  }
  indenizacao: {
    valorBase: number
    multiplicador: number
    valorFinal: number
    fundamentacao: string[]
  }
  reabilitacao: {
    necessaria: boolean
    tipo: string[]
    duracaoEstimada: string
    custoEstimado: number
  }
}

export class DisabilityAssessor {
  /**
   * Avalia grau de incapacidade
   */
  async assessDisability(disabilityData: {
    tipoLesao: string
    partesAfetadas: string[]
    sequelas: string[]
    profissao: string
    idade: number
    rendaMensal?: number
    atividadesPrejudicadas: string[]
  }): Promise<DisabilityAssessment> {
    // Calcular grau de incapacidade
    const grauIncapacidade = this.calcularGrauIncapacidade(disabilityData)

    // Classificar incapacidade
    const classificacao = this.classificarIncapacidade(grauIncapacidade, disabilityData)

    // Determinar tabela aplicável
    const tabela = this.determinarTabela(disabilityData)

    // Aferir funções comprometidas
    const afericao = this.aferirFuncoes(disabilityData)

    // Avaliar impacto laboral
    const impactoLaboral = this.avaliarImpactoLaboral(disabilityData, grauIncapacidade)

    // Verificar benefícios previdenciários
    const beneficiosPrevidenciarios = this.verificarBeneficios(
      classificacao,
      grauIncapacidade,
      disabilityData
    )

    // Calcular indenização
    const indenizacao = this.calcularIndenizacao(
      grauIncapacidade,
      classificacao,
      disabilityData
    )

    // Avaliar necessidade de reabilitação
    const reabilitacao = this.avaliarReabilitacao(disabilityData, classificacao)

    return {
      grauIncapacidade,
      classificacao,
      tabela,
      afericao,
      impactoLaboral,
      beneficiosPrevidenciarios,
      indenizacao,
      reabilitacao,
    }
  }

  /**
   * Calcula grau de incapacidade conforme tabela SUSEP
   */
  private calcularGrauIncapacidade(disabilityData: any): number {
    const { tipoLesao, partesAfetadas, sequelas } = disabilityData

    // Tabela SUSEP (simplificada)
    const tabelaSUSEP: Record<string, number> = {
      // Membros superiores
      'perda total braço direito': 70,
      'perda total braço esquerdo': 60,
      'perda total mão direita': 60,
      'perda total mão esquerdo': 50,
      'perda polegar': 25,
      'perda indicador': 15,
      'perda dedo médio': 12,

      // Membros inferiores
      'perda total perna': 70,
      'perda total pé': 50,
      'perda dedos pé': 10,

      // Visão
      'perda visão ambos olhos': 100,
      'perda visão um olho': 30,
      'redução visão': 10,

      // Audição
      'perda audição ambos ouvidos': 50,
      'perda audição um ouvido': 20,

      // Coluna vertebral
      'paraplegia': 100,
      'tetraplegia': 100,
      'lesão coluna com limitação': 30,

      // Outros
      'deformidade facial grave': 25,
      'cicatriz facial': 10,
      'fratura consolidada com sequela': 15,
    }

    let percentual = 0

    // Procurar sequelas na tabela
    sequelas.forEach((sequela: string) => {
      const sequelaLower = sequela.toLowerCase()
      Object.keys(tabelaSUSEP).forEach((chave) => {
        if (sequelaLower.includes(chave)) {
          percentual = Math.max(percentual, tabelaSUSEP[chave])
        }
      })
    })

    // Se não encontrou na tabela, estimar
    if (percentual === 0) {
      if (tipoLesao.toLowerCase().includes('permanente')) {
        percentual = 25
      } else if (tipoLesao.toLowerCase().includes('temporária')) {
        percentual = 10
      }
    }

    return Math.min(100, percentual)
  }

  /**
   * Classifica tipo de incapacidade
   */
  private classificarIncapacidade(
    grau: number,
    disabilityData: any
  ): DisabilityAssessment['classificacao'] {
    const { sequelas } = disabilityData

    const isPermanente = sequelas.some((s: string) => s.toLowerCase().includes('permanente'))
    const isTotal = grau >= 70

    if (grau === 0) {
      return 'sem-incapacidade'
    } else if (isTotal && isPermanente) {
      return 'total-permanente'
    } else if (isTotal && !isPermanente) {
      return 'total-temporaria'
    } else if (!isTotal && isPermanente) {
      return 'parcial-permanente'
    } else {
      return 'parcial-temporaria'
    }
  }

  /**
   * Determina tabela de avaliação aplicável
   */
  private determinarTabela(disabilityData: any): DisabilityAssessment['tabela'] {
    // Por padrão, usar SUSEP (mais abrangente)
    return 'susep'
  }

  /**
   * Afere funções comprometidas
   */
  private aferirFuncoes(disabilityData: any): DisabilityAssessment['afericao'] {
    const { partesAfetadas, atividadesPrejudicadas } = disabilityData

    const funcoes: DisabilityAssessment['afericao']['funcoes'] = []

    // Funções físicas
    if (partesAfetadas.includes('mão') || partesAfetadas.includes('braço')) {
      funcoes.push({
        funcao: 'Preensão manual',
        percentualPerda: 40,
        descricao: 'Dificuldade para segurar objetos e realizar movimentos finos',
      })
    }

    if (partesAfetadas.includes('perna') || partesAfetadas.includes('pé')) {
      funcoes.push({
        funcao: 'Deambulação',
        percentualPerda: 50,
        descricao: 'Dificuldade para caminhar e manter equilíbrio',
      })
    }

    if (partesAfetadas.includes('coluna')) {
      funcoes.push({
        funcao: 'Mobilidade de tronco',
        percentualPerda: 30,
        descricao: 'Limitação para flexionar, estender e rotacionar tronco',
      })
    }

    // Atividades de vida diária
    const atividadesVidaDiaria: DisabilityAssessment['afericao']['atividadesVidaDiaria'] = [
      {
        atividade: 'Alimentação',
        comprometida: atividadesPrejudicadas.includes('comer'),
        grau: 'leve',
      },
      {
        atividade: 'Higiene pessoal',
        comprometida: atividadesPrejudicadas.includes('banho'),
        grau: 'moderado',
      },
      {
        atividade: 'Vestir-se',
        comprometida: atividadesPrejudicadas.includes('vestir'),
        grau: 'moderado',
      },
      {
        atividade: 'Locomoção',
        comprometida: atividadesPrejudicadas.includes('andar'),
        grau: 'grave',
      },
      {
        atividade: 'Trabalho',
        comprometida: atividadesPrejudicadas.includes('trabalhar'),
        grau: 'grave',
      },
    ]

    return {
      funcoes,
      atividadesVidaDiaria,
    }
  }

  /**
   * Avalia impacto laboral
   */
  private avaliarImpactoLaboral(
    disabilityData: any,
    grau: number
  ): DisabilityAssessment['impactoLaboral'] {
    const { profissao } = disabilityData

    const podeExercer = grau < 70
    const limitacoes: string[] = []
    const necessitaReadaptacao = grau >= 25 && grau < 70
    const profissoesCompativeis: string[] = []

    // Avaliar limitações específicas por profissão
    if (profissao.toLowerCase().includes('motorista') && disabilityData.partesAfetadas.includes('perna')) {
      limitacoes.push('Incapacidade para dirigir veículos profissionalmente')
      profissoesCompativeis.push('Atendente', 'Telefonista', 'Operador de telemarketing')
    }

    if (profissao.toLowerCase().includes('pedreiro') && disabilityData.partesAfetadas.includes('braço')) {
      limitacoes.push('Incapacidade para carregar peso')
      limitacoes.push('Dificuldade para trabalhos manuais pesados')
      profissoesCompativeis.push('Porteiro', 'Vigilante', 'Almoxarife')
    }

    if (profissao.toLowerCase().includes('digitador') && disabilityData.partesAfetadas.includes('mão')) {
      limitacoes.push('Incapacidade para digitação prolongada')
      profissoesCompativeis.push('Atendente', 'Recepcionista')
    }

    return {
      profissaoAtual: profissao,
      podeExercer,
      limitacoes,
      necessitaReadaptacao,
      profissoesCompativeis,
    }
  }

  /**
   * Verifica elegibilidade para benefícios previdenciários
   */
  private verificarBeneficios(
    classificacao: DisabilityAssessment['classificacao'],
    grau: number,
    disabilityData: any
  ): DisabilityAssessment['beneficiosPrevidenciarios'] {
    return {
      auxilioDoenca: {
        elegivel: classificacao === 'total-temporaria' || classificacao === 'parcial-temporaria',
        fundamentacao:
          'Art. 59 da Lei 8.213/91 - Incapacidade temporária superior a 15 dias',
      },
      aposentadoriaInvalidez: {
        elegivel: classificacao === 'total-permanente',
        fundamentacao:
          'Art. 42 da Lei 8.213/91 - Incapacidade total e permanente para o trabalho',
      },
      auxilioAcidente: {
        elegivel: classificacao === 'parcial-permanente' && grau >= 25,
        percentual: 50, // 50% do salário de benefício
        fundamentacao:
          'Art. 86 da Lei 8.213/91 - Sequela que implica redução da capacidade laborativa',
      },
    }
  }

  /**
   * Calcula indenização baseada no grau de incapacidade
   */
  private calcularIndenizacao(
    grau: number,
    classificacao: DisabilityAssessment['classificacao'],
    disabilityData: any
  ): DisabilityAssessment['indenizacao'] {
    // Valor base conforme jurisprudência
    let valorBase = 50000

    // Multiplicador conforme grau
    const multiplicador = grau / 100

    // Ajustar por classificação
    if (classificacao === 'total-permanente') {
      valorBase = 200000
    } else if (classificacao === 'parcial-permanente') {
      valorBase = 100000
    }

    const valorFinal = valorBase * multiplicador

    const fundamentacao = [
      'Art. 949 do Código Civil - Indenização por incapacidade',
      'Súmula 37 do STJ - Cumulação de danos morais e materiais',
      `Grau de incapacidade: ${grau}% conforme Tabela SUSEP`,
      'Jurisprudência consolidada dos Tribunais',
    ]

    return {
      valorBase,
      multiplicador,
      valorFinal: Math.round(valorFinal),
      fundamentacao,
    }
  }

  /**
   * Avalia necessidade de reabilitação
   */
  private avaliarReabilitacao(
    disabilityData: any,
    classificacao: DisabilityAssessment['classificacao']
  ): DisabilityAssessment['reabilitacao'] {
    const necessaria = classificacao !== 'sem-incapacidade'
    const tipo: string[] = []
    let duracaoEstimada = ''
    let custoEstimado = 0

    if (necessaria) {
      tipo.push('Fisioterapia')
      duracaoEstimada = '6 a 12 meses'
      custoEstimado = 5000

      if (disabilityData.partesAfetadas.includes('mão')) {
        tipo.push('Terapia ocupacional')
        custoEstimado += 3000
      }

      if (classificacao === 'total-permanente' || classificacao === 'parcial-permanente') {
        tipo.push('Reabilitação profissional')
        duracaoEstimada = '12 a 24 meses'
        custoEstimado += 8000
      }
    }

    return {
      necessaria,
      tipo,
      duracaoEstimada,
      custoEstimado,
    }
  }
}
