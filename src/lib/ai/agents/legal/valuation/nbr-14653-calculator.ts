/**
 * NBR 14653 Calculator - Avaliação de imóveis conforme ABNT NBR 14653
 * Calcula valor de mercado para fins judiciais e extrajudiciais
 */

export interface PropertyValuation {
  imovel: {
    tipo: 'residencial' | 'comercial' | 'rural' | 'terreno'
    caracteristicas: {
      areaTotal: number
      areaConstruida?: number
      quartos?: number
      suites?: number
      vagas?: number
      idade?: number
    }
    localizacao: {
      endereco: string
      bairro: string
      cidade: string
      zona: 'central' | 'intermediaria' | 'periferica'
    }
  }
  metodologia: {
    metodo: 'comparativo' | 'renda' | 'custo' | 'evolutivo'
    grauPrecisao: 'I' | 'II' | 'III'
    fundamentacao: string[]
  }
  avaliacaoMercado: {
    valorMinimo: number
    valorMedio: number
    valorMaximo: number
    unidade: 'total' | 'm²'
  }
  comparaveis: {
    endereco: string
    areaTotal: number
    valor: number
    distancia: number // km
    similaridade: number // 0-100%
    ajustes: {
      fator: string
      percentual: number
    }[]
  }[]
  fatoresValor: {
    fator: string
    impacto: 'positivo' | 'negativo' | 'neutro'
    percentual: number
    descricao: string
  }[]
  laudoTecnico: {
    necessario: boolean
    finalidade: string
    profissional: 'engenheiro' | 'arquiteto' | 'perito-avaliador'
    custoEstimado: number
  }
  aplicacoes: {
    tipo: string
    viavel: boolean
    observacoes: string
  }[]
}

export class NBR14653Calculator {
  /**
   * Calcula valor de imóvel conforme NBR 14653
   */
  async calculateValuation(valuationData: {
    tipoImovel: 'residencial' | 'comercial' | 'rural' | 'terreno'
    areaTotal: number
    areaConstruida?: number
    quartos?: number
    suites?: number
    vagas?: number
    idadeImovel?: number
    endereco: string
    bairro: string
    cidade: string
    finalidade: 'venda' | 'inventario' | 'partilha' | 'desapropriacao' | 'garantia'
  }): Promise<PropertyValuation> {
    // Estruturar dados do imóvel
    const imovel = this.estruturarImovel(valuationData)

    // Definir metodologia
    const metodologia = this.definirMetodologia(valuationData)

    // Buscar comparáveis (simulado)
    const comparaveis = this.buscarComparaveis(imovel)

    // Identificar fatores de valor
    const fatoresValor = this.identificarFatoresValor(imovel)

    // Calcular avaliação
    const avaliacaoMercado = this.calcularAvaliacao(
      imovel,
      comparaveis,
      fatoresValor
    )

    // Verificar necessidade de laudo
    const laudoTecnico = this.verificarLaudo(valuationData.finalidade)

    // Listar aplicações
    const aplicacoes = this.listarAplicacoes(valuationData.finalidade, avaliacaoMercado)

    return {
      imovel,
      metodologia,
      avaliacaoMercado,
      comparaveis,
      fatoresValor,
      laudoTecnico,
      aplicacoes,
    }
  }

  private estruturarImovel(valuationData: any): PropertyValuation['imovel'] {
    const zona: 'central' | 'intermediaria' | 'periferica' =
      valuationData.bairro.toLowerCase().includes('centro') ? 'central' : 'intermediaria'

    return {
      tipo: valuationData.tipoImovel,
      caracteristicas: {
        areaTotal: valuationData.areaTotal,
        areaConstruida: valuationData.areaConstruida,
        quartos: valuationData.quartos,
        suites: valuationData.suites,
        vagas: valuationData.vagas,
        idade: valuationData.idadeImovel,
      },
      localizacao: {
        endereco: valuationData.endereco,
        bairro: valuationData.bairro,
        cidade: valuationData.cidade,
        zona,
      },
    }
  }

  private definirMetodologia(
    valuationData: any
  ): PropertyValuation['metodologia'] {
    let metodo: PropertyValuation['metodologia']['metodo'] = 'comparativo'
    let grauPrecisao: PropertyValuation['metodologia']['grauPrecisao'] = 'II'
    const fundamentacao: string[] = []

    // Método comparativo (mais comum)
    if (valuationData.tipoImovel === 'residencial' || valuationData.tipoImovel === 'terreno') {
      metodo = 'comparativo'
      fundamentacao.push('ABNT NBR 14653-2 - Método Comparativo Direto de Dados de Mercado')
      fundamentacao.push('Utiliza imóveis similares comercializados na região')
    }

    // Método da renda (imóveis comerciais)
    if (valuationData.tipoImovel === 'comercial') {
      metodo = 'renda'
      fundamentacao.push('ABNT NBR 14653-2 - Método da Renda')
      fundamentacao.push('Baseado na capacidade de geração de renda do imóvel')
    }

    // Grau de precisão conforme finalidade
    if (valuationData.finalidade === 'desapropriacao' || valuationData.finalidade === 'partilha') {
      grauPrecisao = 'I' // Mais rigoroso
      fundamentacao.push('Grau de Precisão I requerido para finalidade judicial')
    }

    return {
      metodo,
      grauPrecisao,
      fundamentacao,
    }
  }

  private buscarComparaveis(
    imovel: PropertyValuation['imovel']
  ): PropertyValuation['comparaveis'] {
    // Simulação - em produção, consultar bases de dados (ZAP, VivaReal, CRECI)
    const valorBase = this.estimarValorBase(imovel)

    const comparaveis: PropertyValuation['comparaveis'] = []

    for (let i = 1; i <= 3; i++) {
      const variacaoArea = (Math.random() * 40) - 20 // -20% a +20%
      const area = imovel.caracteristicas.areaTotal * (1 + variacaoArea / 100)

      comparaveis.push({
        endereco: `${imovel.localizacao.bairro}, Rua ${i}`,
        areaTotal: Math.round(area),
        valor: valorBase * area * (1 + ((Math.random() * 20) - 10) / 100),
        distancia: Math.random() * 2, // até 2km
        similaridade: 85 + Math.random() * 10, // 85-95%
        ajustes: [
          {
            fator: 'Área',
            percentual: variacaoArea > 0 ? -5 : 5,
          },
          {
            fator: 'Conservação',
            percentual: Math.random() > 0.5 ? 3 : -3,
          },
        ],
      })
    }

    return comparaveis
  }

  private estimarValorBase(imovel: PropertyValuation['imovel']): number {
    // Valores aproximados por m² (simulação)
    const valoresPorZona: Record<string, number> = {
      'central': 8000,
      'intermediaria': 5000,
      'periferica': 3000,
    }

    let valorM2 = valoresPorZona[imovel.localizacao.zona]

    // Ajustar por tipo
    if (imovel.tipo === 'comercial') valorM2 *= 1.3
    if (imovel.tipo === 'rural') valorM2 *= 0.3
    if (imovel.tipo === 'terreno') valorM2 *= 0.7

    return valorM2
  }

  private identificarFatoresValor(
    imovel: PropertyValuation['imovel']
  ): PropertyValuation['fatoresValor'] {
    const fatores: PropertyValuation['fatoresValor'] = []

    // Localização
    if (imovel.localizacao.zona === 'central') {
      fatores.push({
        fator: 'Localização central',
        impacto: 'positivo',
        percentual: 20,
        descricao: 'Proximidade a comércio, serviços e transporte público',
      })
    }

    // Idade do imóvel
    if (imovel.caracteristicas.idade && imovel.caracteristicas.idade > 20) {
      fatores.push({
        fator: 'Idade do imóvel',
        impacto: 'negativo',
        percentual: -15,
        descricao: 'Imóvel antigo requer reformas e manutenção',
      })
    }

    // Suítes
    if (imovel.caracteristicas.suites && imovel.caracteristicas.suites >= 2) {
      fatores.push({
        fator: 'Múltiplas suítes',
        impacto: 'positivo',
        percentual: 10,
        descricao: 'Suítes aumentam valor de mercado',
      })
    }

    // Vagas
    if (imovel.caracteristicas.vagas && imovel.caracteristicas.vagas >= 2) {
      fatores.push({
        fator: 'Múltiplas vagas de garagem',
        impacto: 'positivo',
        percentual: 8,
        descricao: 'Vagas são valorizadas em áreas urbanas',
      })
    }

    return fatores
  }

  private calcularAvaliacao(
    imovel: PropertyValuation['imovel'],
    comparaveis: PropertyValuation['comparaveis'],
    fatoresValor: PropertyValuation['fatoresValor']
  ): PropertyValuation['avaliacaoMercado'] {
    // Calcular valor médio dos comparáveis ajustados
    let somaValores = 0
    let somaAreas = 0

    comparaveis.forEach((comp) => {
      const valorM2 = comp.valor / comp.areaTotal
      somaValores += valorM2
      somaAreas += 1
    })

    let valorM2Medio = somaValores / somaAreas

    // Aplicar fatores de valor
    fatoresValor.forEach((fator) => {
      valorM2Medio *= (1 + fator.percentual / 100)
    })

    const areaRef = imovel.caracteristicas.areaConstruida || imovel.caracteristicas.areaTotal
    const valorMedio = valorM2Medio * areaRef

    return {
      valorMinimo: Math.round(valorMedio * 0.9),
      valorMedio: Math.round(valorMedio),
      valorMaximo: Math.round(valorMedio * 1.1),
      unidade: 'total',
    }
  }

  private verificarLaudo(
    finalidade: string
  ): PropertyValuation['laudoTecnico'] {
    const necessarioParaJudicial = ['inventario', 'partilha', 'desapropriacao'].includes(finalidade)

    return {
      necessario: necessarioParaJudicial,
      finalidade,
      profissional: 'engenheiro',
      custoEstimado: necessarioParaJudicial ? 2500 : 1500,
    }
  }

  private listarAplicacoes(
    finalidade: string,
    avaliacao: PropertyValuation['avaliacaoMercado']
  ): PropertyValuation['aplicacoes'] {
    const aplicacoes: PropertyValuation['aplicacoes'] = []

    aplicacoes.push({
      tipo: 'Venda pelo valor de mercado',
      viavel: true,
      observacoes: `Valor sugerido: R$ ${avaliacao.valorMedio.toLocaleString('pt-BR')}`,
    })

    aplicacoes.push({
      tipo: 'Partilha em divórcio/inventário',
      viavel: finalidade === 'partilha' || finalidade === 'inventario',
      observacoes: 'Requer laudo técnico oficial',
    })

    aplicacoes.push({
      tipo: 'Garantia para financiamento',
      viavel: true,
      observacoes: 'Bancos financiam até 70-80% do valor de avaliação',
    })

    aplicacoes.push({
      tipo: 'Desapropriação',
      viavel: finalidade === 'desapropriacao',
      observacoes: 'Valor justo de indenização conforme Decreto-Lei 3.365/41',
    })

    return aplicacoes
  }
}
