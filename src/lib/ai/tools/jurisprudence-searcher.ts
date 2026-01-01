/**
 * Jurisprudence Searcher - Busca jurisprudência em tribunais
 * Consulta decisões do STF, STJ, TJs e súmulas relevantes
 */

export interface JurisprudenceResult {
  tribunal: 'STF' | 'STJ' | 'TST' | 'TRT' | 'TJSP' | 'TJRJ' | 'outro'
  tipo: 'sumula' | 'acordao' | 'repercussao-geral' | 'recurso-repetitivo' | 'tema'
  numero: string
  ementa: string
  dataJulgamento: string
  relator: string
  palavrasChave: string[]
  url?: string
  relevancia: 'alta' | 'media' | 'baixa'
}

export interface JurisprudenceSearch {
  consulta: string
  resultados: JurisprudenceResult[]
  sumulas: JurisprudenceResult[]
  temasRepercussao: JurisprudenceResult[]
  sugestoes: string[]
  totalEncontrado: number
}

export class JurisprudenceSearcher {
  /**
   * Busca jurisprudência por palavra-chave ou assunto
   */
  async searchJurisprudence(params: {
    palavrasChave: string
    tribunais?: ('STF' | 'STJ' | 'TST' | 'TRT' | 'TJSP' | 'TJRJ')[]
    dataInicio?: string
    dataFim?: string
    apenasVinculantes?: boolean
  }): Promise<JurisprudenceSearch> {
    // Simulação - em produção, consultar APIs dos tribunais
    const resultados = this.buscarJurisprudenciaSimulada(params.palavrasChave, params.tribunais)

    const sumulas = resultados.filter((r) => r.tipo === 'sumula')
    const temasRepercussao = resultados.filter((r) => r.tipo === 'repercussao-geral' || r.tipo === 'tema')

    const sugestoes = this.gerarSugestoes(params.palavrasChave)

    return {
      consulta: params.palavrasChave,
      resultados,
      sumulas,
      temasRepercussao,
      sugestoes,
      totalEncontrado: resultados.length,
    }
  }

  /**
   * Busca súmula específica
   */
  async searchSumula(params: {
    tribunal: 'STF' | 'STJ' | 'TST'
    numero: number
  }): Promise<JurisprudenceResult | null> {
    const sumulas = this.getSumulasBase()

    const chave = `${params.tribunal}-${params.numero}`
    return sumulas[chave] || null
  }

  /**
   * Busca tema de repercussão geral (STF) ou repetitivo (STJ)
   */
  async searchTema(params: {
    tribunal: 'STF' | 'STJ'
    numero: number
  }): Promise<JurisprudenceResult | null> {
    const temas = this.getTemasBase()

    const chave = `${params.tribunal}-${params.numero}`
    return temas[chave] || null
  }

  /**
   * Analisa jurisprudência aplicável a um caso
   */
  async analyzeApplicableCase(params: {
    descricaoCaso: string
    areaJuridica: 'civil' | 'penal' | 'trabalhista' | 'tributario' | 'consumidor'
  }): Promise<{
    jurisprudenciaRelevante: JurisprudenceResult[]
    argumentosDefesa: string[]
    argumentosAcusacao: string[]
    precedentesVinculantes: JurisprudenceResult[]
  }> {
    const palavrasChave = this.extrairPalavrasChave(params.descricaoCaso)
    const busca = await this.searchJurisprudence({ palavrasChave })

    const jurisprudenciaRelevante = busca.resultados.filter((r) => r.relevancia === 'alta')
    const precedentesVinculantes = busca.sumulas.concat(busca.temasRepercussao)

    const argumentosDefesa = this.gerarArgumentos(jurisprudenciaRelevante, 'defesa')
    const argumentosAcusacao = this.gerarArgumentos(jurisprudenciaRelevante, 'acusacao')

    return {
      jurisprudenciaRelevante,
      argumentosDefesa,
      argumentosAcusacao,
      precedentesVinculantes,
    }
  }

  // Métodos auxiliares privados

  private buscarJurisprudenciaSimulada(
    palavrasChave: string,
    tribunais?: string[]
  ): JurisprudenceResult[] {
    const resultados: JurisprudenceResult[] = []

    const palavras = palavrasChave.toLowerCase()

    // Súmulas relevantes por tema
    if (palavras.includes('plano de saúde') || palavras.includes('ans')) {
      resultados.push({
        tribunal: 'TJSP',
        tipo: 'sumula',
        numero: '102',
        ementa: 'Havendo expressa indicação médica, é abusiva a negativa de cobertura de custeio de tratamento sob o argumento da sua natureza experimental ou por não estar previsto no rol de procedimentos da ANS.',
        dataJulgamento: '2015-05-20',
        relator: 'Des. Diversos',
        palavrasChave: ['plano de saúde', 'ans', 'cobertura', 'rol'],
        relevancia: 'alta',
      })
    }

    if (palavras.includes('dano moral') || palavras.includes('indenização')) {
      resultados.push({
        tribunal: 'STJ',
        tipo: 'sumula',
        numero: '37',
        ementa: 'São cumuláveis as indenizações por dano material e dano moral oriundos do mesmo fato.',
        dataJulgamento: '1992-03-17',
        relator: 'Min. Diversos',
        palavrasChave: ['dano moral', 'dano material', 'cumulação'],
        relevancia: 'alta',
      })
    }

    if (palavras.includes('usucapião') || palavras.includes('posse')) {
      resultados.push({
        tribunal: 'STF',
        tipo: 'acordao',
        numero: 'RE 422.349',
        ementa: 'Usucapião especial urbano. Área superior a 250m². Inaplicabilidade do art. 183 da CF. Possibilidade de usucapião extraordinária.',
        dataJulgamento: '2010-06-15',
        relator: 'Min. Dias Toffoli',
        palavrasChave: ['usucapião', 'área', 'constitucional'],
        relevancia: 'alta',
      })
    }

    if (palavras.includes('pix') || palavras.includes('fraude')) {
      resultados.push({
        tribunal: 'TJSP',
        tipo: 'acordao',
        numero: 'Apelação 1023456-78.2023.8.26.0100',
        ementa: 'Responsabilidade do banco em fraude via PIX. Falha na segurança. Dever de ressarcimento integral. Danos morais configurados.',
        dataJulgamento: '2023-08-10',
        relator: 'Des. João Silva',
        palavrasChave: ['pix', 'fraude', 'banco', 'responsabilidade'],
        relevancia: 'alta',
      })
    }

    if (palavras.includes('aposentadoria') || palavras.includes('inss')) {
      resultados.push({
        tribunal: 'STF',
        tipo: 'tema',
        numero: '1.102',
        ementa: 'Tema 1.102: Revisão da vida toda. Possibilidade de utilizar salários anteriores a julho/1994 no cálculo de benefícios previdenciários.',
        dataJulgamento: '2022-12-01',
        relator: 'Min. Alexandre de Moraes',
        palavrasChave: ['previdenciário', 'revisão', 'vida toda'],
        relevancia: 'alta',
      })
    }

    if (palavras.includes('roubo') || palavras.includes('furto')) {
      resultados.push({
        tribunal: 'STJ',
        tipo: 'sumula',
        numero: '443',
        ementa: 'O aumento na terceira fase de aplicação da pena no crime de roubo circunstanciado exige fundamentação concreta, não sendo suficiente para a sua exasperação a mera indicação do número de majorantes.',
        dataJulgamento: '2010-04-28',
        relator: 'Min. Diversos',
        palavrasChave: ['roubo', 'dosimetria', 'pena'],
        relevancia: 'alta',
      })
    }

    return resultados
  }

  private getSumulasBase(): Record<string, JurisprudenceResult> {
    return {
      'STJ-37': {
        tribunal: 'STJ',
        tipo: 'sumula',
        numero: '37',
        ementa: 'São cumuláveis as indenizações por dano material e dano moral oriundos do mesmo fato.',
        dataJulgamento: '1992-03-17',
        relator: 'Min. Diversos',
        palavrasChave: ['dano moral', 'dano material', 'cumulação'],
        relevancia: 'alta',
      },
      'STJ-469': {
        tribunal: 'STJ',
        tipo: 'sumula',
        numero: '469',
        ementa: 'Aplica-se o Código de Defesa do Consumidor aos contratos de plano de saúde.',
        dataJulgamento: '2012-03-14',
        relator: 'Min. Diversos',
        palavrasChave: ['plano de saúde', 'cdc', 'consumidor'],
        relevancia: 'alta',
      },
      'STJ-381': {
        tribunal: 'STJ',
        tipo: 'sumula',
        numero: '381',
        ementa: 'Nos contratos bancários, é vedado ao julgador conhecer, de ofício, da abusividade das cláusulas.',
        dataJulgamento: '2009-04-27',
        relator: 'Min. Diversos',
        palavrasChave: ['contrato bancário', 'abusividade'],
        relevancia: 'media',
      },
    }
  }

  private getTemasBase(): Record<string, JurisprudenceResult> {
    return {
      'STF-1102': {
        tribunal: 'STF',
        tipo: 'tema',
        numero: '1.102',
        ementa: 'Revisão da vida toda. Inclusão de salários anteriores a julho/1994 no cálculo de benefícios previdenciários.',
        dataJulgamento: '2022-12-01',
        relator: 'Min. Alexandre de Moraes',
        palavrasChave: ['previdenciário', 'revisão', 'vida toda'],
        url: 'https://portal.stf.jus.br/processos/detalhe.asp?incidente=5640755',
        relevancia: 'alta',
      },
      'STJ-1062': {
        tribunal: 'STJ',
        tipo: 'tema',
        numero: '1.062',
        ementa: 'Rol de procedimentos da ANS é exemplificativo (taxatividade mitigada).',
        dataJulgamento: '2022-06-08',
        relator: 'Min. Luis Felipe Salomão',
        palavrasChave: ['plano de saúde', 'rol ans', 'cobertura'],
        url: 'https://processo.stj.jus.br/repetitivos/temas_repetitivos/pesquisa.jsp?novaConsulta=true&tipo_pesquisa=T&sg_classe=REsp&num_processo_classe=1062',
        relevancia: 'alta',
      },
    }
  }

  private extrairPalavrasChave(descricao: string): string {
    // Simplificado - em produção, usar NLP
    const palavras = descricao.toLowerCase()
    const keywords: string[] = []

    if (palavras.includes('plano') && palavras.includes('saúde')) keywords.push('plano de saúde')
    if (palavras.includes('indenização')) keywords.push('indenização')
    if (palavras.includes('dano')) keywords.push('dano moral')
    if (palavras.includes('aposentadoria') || palavras.includes('inss')) keywords.push('aposentadoria')

    return keywords.join(' ') || palavras.slice(0, 50)
  }

  private gerarSugestoes(palavrasChave: string): string[] {
    const sugestoes = [
      'Refinar busca com operadores booleanos (AND, OR, NOT)',
      'Adicionar filtro por data de julgamento',
      'Buscar súmulas vinculantes do STF',
      'Consultar informativos de jurisprudência',
      'Verificar recursos repetitivos (STJ) e repercussão geral (STF)',
    ]

    return sugestoes
  }

  private gerarArgumentos(
    jurisprudencia: JurisprudenceResult[],
    lado: 'defesa' | 'acusacao'
  ): string[] {
    const argumentos: string[] = []

    jurisprudencia.forEach((j) => {
      if (lado === 'defesa') {
        argumentos.push(`Aplicar ${j.tribunal} ${j.tipo} ${j.numero}: "${j.ementa}"`)
      } else {
        argumentos.push(`Refutar aplicação de ${j.tribunal} ${j.numero} por distinção`)
      }
    })

    return argumentos
  }
}

// Singleton instance
export const jurisprudenceSearcher = new JurisprudenceSearcher()
