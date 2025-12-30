/**
 * Market Comparator - Comparação de mercado imobiliário
 * Analisa tendências e oportunidades de compra/venda
 */

export interface MarketComparison {
  analiseRegional: {
    bairro: string
    cidade: string
    valorM2Medio: number
    tendencia: 'alta' | 'estavel' | 'queda'
    percentualVariacao: number // últimos 12 meses
  }
  oportunidade: {
    tipo: 'compra' | 'venda' | 'aguardar'
    confianca: 'alta' | 'media' | 'baixa'
    fundamentacao: string[]
  }
  comparativoPrecos: {
    imovelAvaliado: number
    mediaBairro: number
    mediaC idade: number
    desvioPercentual: number
    classificacao: 'abaixo-mercado' | 'no-mercado' | 'acima-mercado'
  }
  projecoes: {
    periodo: '6-meses' | '12-meses' | '24-meses'
    valorProjetado: number
    fundamentacao: string
  }[]
}

export class MarketComparator {
  /**
   * Compara imóvel com mercado local
   */
  async compareMarket(marketData: {
    valorImovel: number
    areaTotal: number
    bairro: string
    cidade: string
    tipoImovel: string
  }): Promise<MarketComparison> {
    const analiseRegional = this.analisarRegiao(marketData)
    const comparativoPrecos = this.compararPrecos(marketData, analiseRegional)
    const oportunidade = this.identificarOportunidade(comparativoPrecos, analiseRegional)
    const projecoes = this.projetarValores(marketData, analiseRegional)

    return {
      analiseRegional,
      oportunidade,
      comparativoPrecos,
      projecoes,
    }
  }

  private analisarRegiao(marketData: any): MarketComparison['analiseRegional'] {
    // Simulação - em produção, consultar APIs de mercado
    const valorM2Medio = 5000 + Math.random() * 3000

    return {
      bairro: marketData.bairro,
      cidade: marketData.cidade,
      valorM2Medio: Math.round(valorM2Medio),
      tendencia: 'alta',
      percentualVariacao: 8.5,
    }
  }

  private compararPrecos(
    marketData: any,
    analiseRegional: MarketComparison['analiseRegional']
  ): MarketComparison['comparativoPrecos'] {
    const valorM2Imovel = marketData.valorImovel / marketData.areaTotal
    const mediaBairro = analiseRegional.valorM2Medio
    const mediaC idade = mediaBairro * 0.95

    const desvioPercentual = ((valorM2Imovel - mediaBairro) / mediaBairro) * 100

    let classificacao: 'abaixo-mercado' | 'no-mercado' | 'acima-mercado'
    if (desvioPercentual < -10) classificacao = 'abaixo-mercado'
    else if (desvioPercentual > 10) classificacao = 'acima-mercado'
    else classificacao = 'no-mercado'

    return {
      imovelAvaliado: Math.round(valorM2Imovel),
      mediaBairro: Math.round(mediaBairro),
      mediaC idade: Math.round(mediaC idade),
      desvioPercentual: Math.round(desvioPercentual * 10) / 10,
      classificacao,
    }
  }

  private identificarOportunidade(
    comparativo: MarketComparison['comparativoPrecos'],
    analiseRegional: MarketComparison['analiseRegional']
  ): MarketComparison['oportunidade'] {
    const fundamentacao: string[] = []
    let tipo: 'compra' | 'venda' | 'aguardar'
    let confianca: 'alta' | 'media' | 'baixa'

    if (comparativo.classificacao === 'abaixo-mercado' && analiseRegional.tendencia === 'alta') {
      tipo = 'compra'
      confianca = 'alta'
      fundamentacao.push(`Imóvel ${Math.abs(comparativo.desvioPercentual)}% abaixo do mercado`)
      fundamentacao.push(`Região em valorização (+${analiseRegional.percentualVariacao}% ao ano)`)
    } else if (comparativo.classificacao === 'acima-mercado') {
      tipo = 'aguardar'
      confianca = 'media'
      fundamentacao.push(`Imóvel ${comparativo.desvioPercentual}% acima do mercado`)
    } else {
      tipo = 'venda'
      confianca = 'media'
      fundamentacao.push('Preço alinhado com mercado')
    }

    return { tipo, confianca, fundamentacao }
  }

  private projetarValores(
    marketData: any,
    analiseRegional: MarketComparison['analiseRegional']
  ): MarketComparison['projecoes'] {
    const valorAtual = marketData.valorImovel
    const taxaAnual = analiseRegional.percentualVariacao / 100

    return [
      {
        periodo: '6-meses',
        valorProjetado: Math.round(valorAtual * (1 + taxaAnual / 2)),
        fundamentacao: `Projeção baseada em taxa de ${analiseRegional.percentualVariacao}% ao ano`,
      },
      {
        periodo: '12-meses',
        valorProjetado: Math.round(valorAtual * (1 + taxaAnual)),
        fundamentacao: `Valorização estimada de ${analiseRegional.percentualVariacao}%`,
      },
      {
        periodo: '24-meses',
        valorProjetado: Math.round(valorAtual * Math.pow(1 + taxaAnual, 2)),
        fundamentacao: `Projeção composta para 2 anos`,
      },
    ]
  }
}
