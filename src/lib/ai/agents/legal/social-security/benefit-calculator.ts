/**
 * Benefit Calculator - Calcula benefícios previdenciários
 * Orienta sobre aposentadorias, pensões e auxílios do INSS
 */

export interface BenefitCalculation {
  tipoBeneficio: 'aposentadoria-idade' | 'aposentadoria-tempo' | 'aposentadoria-especial' | 'pensao-morte' | 'auxilio-doenca' | 'auxilio-acidente' | 'salario-maternidade'
  elegibilidade: {
    elegivel: boolean
    requisitos: {
      requisito: string
      cumprido: boolean
      observacao: string
    }[]
    tempoFaltante?: {
      anos: number
      meses: number
    }
  }
  calculoValor: {
    salarioBeneficio: number
    aliquota: number
    valorEstimado: number
    teto: number
    limitado: boolean
  }
  regraTransicao: {
    aplicavel: boolean
    regra: string
    vantajosa: boolean
    fundamentacao: string[]
  }
  documentos: {
    obrigatorios: string[]
    complementares: string[]
  }
  procedimento: {
    etapa: string
    prazo: string
    observacao: string
  }[]
  simulacoes: {
    cenario: string
    idadeAposentadoria: number
    valorEstimado: number
    observacoes: string
  }[]
}

export class BenefitCalculator {
  /**
   * Calcula benefício previdenciário
   */
  async calculateBenefit(benefitData: {
    tipoBeneficio: string
    idade: number
    sexo: 'M' | 'F'
    tempoContribuicao: number // em meses
    salarios: number[] // últimos salários de contribuição
    atividadeEspecial?: boolean
    carenciaCumprida?: number // meses
  }): Promise<BenefitCalculation> {
    // Identificar tipo de benefício
    const tipoBeneficio = this.identificarTipoBeneficio(benefitData)

    // Verificar elegibilidade
    const elegibilidade = this.verificarElegibilidade(tipoBeneficio, benefitData)

    // Calcular valor do benefício
    const calculoValor = this.calcularValor(tipoBeneficio, benefitData)

    // Verificar regras de transição
    const regraTransicao = this.verificarRegraTransicao(tipoBeneficio, benefitData)

    // Listar documentos
    const documentos = this.listarDocumentos(tipoBeneficio)

    // Descrever procedimento
    const procedimento = this.descreverProcedimento(tipoBeneficio)

    // Gerar simulações
    const simulacoes = this.gerarSimulacoes(tipoBeneficio, benefitData, elegibilidade)

    return {
      tipoBeneficio,
      elegibilidade,
      calculoValor,
      regraTransicao,
      documentos,
      procedimento,
      simulacoes,
    }
  }

  private identificarTipoBeneficio(benefitData: any): BenefitCalculation['tipoBeneficio'] {
    const tipo = benefitData.tipoBeneficio.toLowerCase()

    if (tipo.includes('idade')) return 'aposentadoria-idade'
    if (tipo.includes('tempo')) return 'aposentadoria-tempo'
    if (tipo.includes('especial')) return 'aposentadoria-especial'
    if (tipo.includes('pensão') || tipo.includes('morte')) return 'pensao-morte'
    if (tipo.includes('doença')) return 'auxilio-doenca'
    if (tipo.includes('acidente')) return 'auxilio-acidente'
    if (tipo.includes('maternidade')) return 'salario-maternidade'

    return 'aposentadoria-idade'
  }

  private verificarElegibilidade(
    tipoBeneficio: BenefitCalculation['tipoBeneficio'],
    benefitData: any
  ): BenefitCalculation['elegibilidade'] {
    const requisitos: BenefitCalculation['elegibilidade']['requisitos'] = []
    let elegivel = true

    const tempoAnos = benefitData.tempoContribuicao / 12

    // Aposentadoria por idade
    if (tipoBeneficio === 'aposentadoria-idade') {
      const idadeMinima = benefitData.sexo === 'M' ? 65 : 62 // Pós-reforma 2019
      const tempoMinimoAnos = 15

      requisitos.push({
        requisito: `Idade mínima de ${idadeMinima} anos`,
        cumprido: benefitData.idade >= idadeMinima,
        observacao: `Idade atual: ${benefitData.idade} anos`,
      })

      requisitos.push({
        requisito: `${tempoMinimoAnos} anos de contribuição`,
        cumprido: tempoAnos >= tempoMinimoAnos,
        observacao: `Tempo de contribuição: ${tempoAnos.toFixed(1)} anos`,
      })

      requisitos.push({
        requisito: '180 meses de carência',
        cumprido: (benefitData.carenciaCumprida || 0) >= 180,
        observacao: `Carência: ${benefitData.carenciaCumprida || 0} meses`,
      })

      elegivel = requisitos.every((r) => r.cumprido)

      if (!elegivel) {
        const anosQueFaltam = Math.max(
          idadeMinima - benefitData.idade,
          tempoMinimoAnos - tempoAnos
        )
        return {
          elegivel: false,
          requisitos,
          tempoFaltante: {
            anos: Math.floor(anosQueFaltam),
            meses: Math.round((anosQueFaltam % 1) * 12),
          },
        }
      }
    }

    // Aposentadoria por tempo de contribuição
    if (tipoBeneficio === 'aposentadoria-tempo') {
      const tempoMinimo = benefitData.sexo === 'M' ? 35 : 30

      requisitos.push({
        requisito: `${tempoMinimo} anos de contribuição`,
        cumprido: tempoAnos >= tempoMinimo,
        observacao: `Tempo de contribuição: ${tempoAnos.toFixed(1)} anos`,
      })

      elegivel = requisitos.every((r) => r.cumprido)
    }

    // Aposentadoria especial
    if (tipoBeneficio === 'aposentadoria-especial') {
      const tempoEspecial = 25 // anos para atividade de risco médio

      requisitos.push({
        requisito: `${tempoEspecial} anos em atividade especial`,
        cumprido: tempoAnos >= tempoEspecial && benefitData.atividadeEspecial,
        observacao: `Atividade especial: ${benefitData.atividadeEspecial ? 'Sim' : 'Não'}`,
      })

      elegivel = requisitos.every((r) => r.cumprido)
    }

    return {
      elegivel,
      requisitos,
    }
  }

  private calcularValor(
    tipoBeneficio: BenefitCalculation['tipoBeneficio'],
    benefitData: any
  ): BenefitCalculation['calculoValor'] {
    const { salarios } = benefitData
    const teto = 7507.49 // Teto INSS 2024

    // Calcular média dos 80% maiores salários
    const salariosOrdenados = [...salarios].sort((a, b) => b - a)
    const top80Percent = Math.ceil(salariosOrdenados.length * 0.8)
    const salariosConsiderados = salariosOrdenados.slice(0, top80Percent)

    const salarioBeneficio = Math.min(
      salariosConsiderados.reduce((a, b) => a + b, 0) / salariosConsiderados.length,
      teto
    )

    // Alíquota conforme regra
    let aliquota = 0.6 // 60% base

    if (tipoBeneficio === 'aposentadoria-idade' || tipoBeneficio === 'aposentadoria-tempo') {
      const tempoAnos = benefitData.tempoContribuicao / 12
      const anosAdicional = Math.max(0, tempoAnos - 15) // Acima de 15 anos
      aliquota = 0.6 + (anosAdicional * 0.02) // +2% por ano acima de 15
      aliquota = Math.min(aliquota, 1.0) // Máximo 100%
    }

    if (tipoBeneficio === 'aposentadoria-especial') {
      aliquota = 1.0 // 100% do salário de benefício
    }

    const valorEstimado = Math.min(salarioBeneficio * aliquota, teto)

    return {
      salarioBeneficio: Math.round(salarioBeneficio),
      aliquota,
      valorEstimado: Math.round(valorEstimado),
      teto,
      limitado: salarioBeneficio >= teto,
    }
  }

  private verificarRegraTransicao(
    tipoBeneficio: BenefitCalculation['tipoBeneficio'],
    benefitData: any
  ): BenefitCalculation['regraTransicao'] {
    const fundamentacao: string[] = []

    // Regras de transição pós-Reforma 2019
    const regrasTransicao = [
      'Regra de Transição por Pontos',
      'Regra de Transição da Idade Mínima Progressiva',
      'Regra de Transição do Pedágio de 50%',
      'Regra de Transição do Pedágio de 100%',
    ]

    const aplicavel = benefitData.idade >= 50 // Simplificado

    if (aplicavel) {
      fundamentacao.push('EC 103/2019 - Reforma da Previdência')
      fundamentacao.push('Direito adquirido preservado para quem já cumpria requisitos em 13/11/2019')
      fundamentacao.push('Avaliar qual regra de transição é mais vantajosa')
    }

    return {
      aplicavel,
      regra: regrasTransicao[0],
      vantajosa: true,
      fundamentacao,
    }
  }

  private listarDocumentos(
    tipoBeneficio: BenefitCalculation['tipoBeneficio']
  ): BenefitCalculation['documentos'] {
    const obrigatorios = [
      'RG e CPF',
      'Comprovante de residência',
      'Carteira de trabalho (todas)',
      'PIS/PASEP',
      'Carnês de contribuição (autônomos)',
      'CNIS - Cadastro Nacional de Informações Sociais',
    ]

    const complementares = [
      'Certidão de tempo de contribuição (servidores públicos)',
      'PPP - Perfil Profissiográfico Previdenciário (atividade especial)',
      'Comprovantes de vínculos informais (contratos, recibos)',
    ]

    if (tipoBeneficio === 'pensao-morte') {
      obrigatorios.push('Certidão de óbito')
      obrigatorios.push('Certidão de casamento ou união estável')
    }

    if (tipoBeneficio === 'salario-maternidade') {
      obrigatorios.push('Certidão de nascimento da criança')
    }

    return {
      obrigatorios,
      complementares,
    }
  }

  private descreverProcedimento(
    tipoBeneficio: BenefitCalculation['tipoBeneficio']
  ): BenefitCalculation['procedimento'] {
    return [
      {
        etapa: 'Reunir documentação completa',
        prazo: '1-2 semanas',
        observacao: 'Solicitar CNIS no Meu INSS',
      },
      {
        etapa: 'Agendar perícia médica (se necessário)',
        prazo: '30-60 dias',
        observacao: 'Apenas para auxílio-doença e aposentadoria por invalidez',
      },
      {
        etapa: 'Protocolar requerimento via Meu INSS ou presencial',
        prazo: '1 dia',
        observacao: 'Preferir canal digital (mais rápido)',
      },
      {
        etapa: 'Aguardar análise do INSS',
        prazo: '45-90 dias',
        observacao: 'Prazo legal: 45 dias (nem sempre cumprido)',
      },
      {
        etapa: 'Receber resposta (deferimento ou indeferimento)',
        prazo: 'Variável',
        observacao: 'Se indeferido, cabe recurso administrativo em 30 dias',
      },
    ]
  }

  private gerarSimulacoes(
    tipoBeneficio: BenefitCalculation['tipoBeneficio'],
    benefitData: any,
    elegibilidade: BenefitCalculation['elegibilidade']
  ): BenefitCalculation['simulacoes'] {
    const simulacoes: BenefitCalculation['simulacoes'] = []

    if (!elegibilidade.elegivel && elegibilidade.tempoFaltante) {
      const anosQueFaltam = elegibilidade.tempoFaltante.anos

      simulacoes.push({
        cenario: 'Aposentadoria imediata (se elegível)',
        idadeAposentadoria: benefitData.idade,
        valorEstimado: 0,
        observacoes: 'Não elegível ainda',
      })

      simulacoes.push({
        cenario: `Aposentadoria em ${anosQueFaltam} anos`,
        idadeAposentadoria: benefitData.idade + anosQueFaltam,
        valorEstimado: this.calcularValor(tipoBeneficio, {
          ...benefitData,
          tempoContribuicao: benefitData.tempoContribuicao + anosQueFaltam * 12,
        }).valorEstimado,
        observacoes: 'Cumprindo requisitos mínimos',
      })
    } else {
      simulacoes.push({
        cenario: 'Aposentadoria imediata',
        idadeAposentadoria: benefitData.idade,
        valorEstimado: this.calcularValor(tipoBeneficio, benefitData).valorEstimado,
        observacoes: 'Elegível agora',
      })
    }

    return simulacoes
  }
}
