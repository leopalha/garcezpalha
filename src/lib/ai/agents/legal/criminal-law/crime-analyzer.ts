/**
 * Crime Analyzer - Analisa crimes e suas características
 * Parte do Criminal Law Agent especializado
 */

export interface CrimeAnalysis {
  tipoPerial: string
  artigo: string
  elementos: {
    dolo: boolean
    culpa: boolean
    consumacao: 'consumado' | 'tentado' | 'impossivel'
  }
  circunstancias: {
    agravantes: string[]
    atenuantes: string[]
    qualificadoras: string[]
  }
  penaBase: {
    min: number
    max: number
    unidade: 'meses' | 'anos'
  }
  classificacao: {
    gravidade: 'leve' | 'medio' | 'grave' | 'gravissimo'
    natureza: 'patrimonial' | 'pessoa' | 'sexual' | 'droga' | 'economico' | 'outro'
  }
  prescricao: {
    prazo: number
    dataBase: string
  }
}

export class CrimeAnalyzer {
  /**
   * Analisa um crime baseado na descrição dos fatos
   */
  async analyzeCrime(facts: string): Promise<CrimeAnalysis> {
    // Identificar o tipo de crime pelos fatos narrados
    const tipoPerial = this.identificarTipoPenal(facts)

    // Buscar artigo do Código Penal
    const artigo = this.buscarArtigo(tipoPerial)

    // Analisar elementos do crime
    const elementos = this.analisarElementos(facts)

    // Identificar circunstâncias
    const circunstancias = this.identificarCircunstancias(facts)

    // Calcular pena base
    const penaBase = this.calcularPenaBase(tipoPerial)

    // Classificar crime
    const classificacao = this.classificarCrime(tipoPerial, facts)

    // Calcular prescrição
    const prescricao = this.calcularPrescricao(penaBase.max)

    return {
      tipoPerial,
      artigo,
      elementos,
      circunstancias,
      penaBase,
      classificacao,
      prescricao,
    }
  }

  /**
   * Identifica o tipo penal baseado nos fatos
   */
  private identificarTipoPenal(facts: string): string {
    const factsLower = facts.toLowerCase()

    // Crimes contra o patrimônio
    if (factsLower.includes('furto') || factsLower.includes('subtração')) {
      return 'furto'
    }
    if (factsLower.includes('roubo') || factsLower.includes('violência')) {
      return 'roubo'
    }
    if (factsLower.includes('estelionato') || factsLower.includes('fraude')) {
      return 'estelionato'
    }

    // Crimes contra a pessoa
    if (factsLower.includes('homicídio') || factsLower.includes('matou')) {
      return 'homicídio'
    }
    if (factsLower.includes('lesão corporal') || factsLower.includes('agrediu')) {
      return 'lesão corporal'
    }

    // Crimes contra a dignidade sexual
    if (factsLower.includes('estupro') || factsLower.includes('violência sexual')) {
      return 'estupro'
    }

    // Tráfico de drogas
    if (factsLower.includes('tráfico') || factsLower.includes('droga')) {
      return 'tráfico de drogas'
    }

    return 'crime não identificado'
  }

  /**
   * Busca o artigo do Código Penal correspondente
   */
  private buscarArtigo(tipoPenal: string): string {
    const artigos: Record<string, string> = {
      'furto': 'Art. 155 do Código Penal',
      'roubo': 'Art. 157 do Código Penal',
      'estelionato': 'Art. 171 do Código Penal',
      'homicídio': 'Art. 121 do Código Penal',
      'lesão corporal': 'Art. 129 do Código Penal',
      'estupro': 'Art. 213 do Código Penal',
      'tráfico de drogas': 'Art. 33 da Lei 11.343/2006',
    }

    return artigos[tipoPenal] || 'Artigo não identificado'
  }

  /**
   * Analisa elementos do crime (dolo, culpa, consumação)
   */
  private analisarElementos(facts: string): CrimeAnalysis['elementos'] {
    const factsLower = facts.toLowerCase()

    // Analisar dolo (intenção)
    const dolo = factsLower.includes('intenção') ||
                 factsLower.includes('queria') ||
                 factsLower.includes('planejou')

    // Analisar culpa (negligência)
    const culpa = factsLower.includes('imprudência') ||
                  factsLower.includes('negligência') ||
                  factsLower.includes('acidente')

    // Analisar consumação
    let consumacao: 'consumado' | 'tentado' | 'impossivel' = 'consumado'
    if (factsLower.includes('tentou') || factsLower.includes('tentativa')) {
      consumacao = 'tentado'
    }
    if (factsLower.includes('impossível') || factsLower.includes('não poderia')) {
      consumacao = 'impossivel'
    }

    return { dolo, culpa, consumacao }
  }

  /**
   * Identifica circunstâncias agravantes, atenuantes e qualificadoras
   */
  private identificarCircunstancias(facts: string): CrimeAnalysis['circunstancias'] {
    const factsLower = facts.toLowerCase()

    const agravantes: string[] = []
    const atenuantes: string[] = []
    const qualificadoras: string[] = []

    // Agravantes
    if (factsLower.includes('reincidência') || factsLower.includes('reincidente')) {
      agravantes.push('Reincidência (art. 61, I, CP)')
    }
    if (factsLower.includes('menor') || factsLower.includes('criança')) {
      agravantes.push('Contra menor de 14 anos (art. 61, II, h, CP)')
    }
    if (factsLower.includes('noite') || factsLower.includes('madrugada')) {
      agravantes.push('Crime praticado à noite (art. 61, II, j, CP)')
    }

    // Atenuantes
    if (factsLower.includes('confessou') || factsLower.includes('confissão')) {
      atenuantes.push('Confissão espontânea (art. 65, III, d, CP)')
    }
    if (factsLower.includes('menor de 21') || factsLower.includes('jovem')) {
      atenuantes.push('Menor de 21 anos (art. 65, I, CP)')
    }
    if (factsLower.includes('primeira vez') || factsLower.includes('primário')) {
      atenuantes.push('Réu primário (art. 65)')
    }

    // Qualificadoras (aumentam a pena base)
    if (factsLower.includes('arma') || factsLower.includes('armado')) {
      qualificadoras.push('Uso de arma')
    }
    if (factsLower.includes('morte') && factsLower.includes('roubo')) {
      qualificadoras.push('Latrocínio (roubo seguido de morte)')
    }

    return { agravantes, atenuantes, qualificadoras }
  }

  /**
   * Calcula a pena base do crime
   */
  private calcularPenaBase(tipoPenal: string): CrimeAnalysis['penaBase'] {
    const penas: Record<string, CrimeAnalysis['penaBase']> = {
      'furto': { min: 12, max: 48, unidade: 'meses' },
      'roubo': { min: 4, max: 10, unidade: 'anos' },
      'estelionato': { min: 12, max: 60, unidade: 'meses' },
      'homicídio': { min: 6, max: 20, unidade: 'anos' },
      'lesão corporal': { min: 3, max: 12, unidade: 'meses' },
      'estupro': { min: 6, max: 10, unidade: 'anos' },
      'tráfico de drogas': { min: 5, max: 15, unidade: 'anos' },
    }

    return penas[tipoPenal] || { min: 0, max: 0, unidade: 'meses' }
  }

  /**
   * Classifica o crime por gravidade e natureza
   */
  private classificarCrime(tipoPenal: string, facts: string): CrimeAnalysis['classificacao'] {
    const factsLower = facts.toLowerCase()

    // Determinar gravidade
    let gravidade: CrimeAnalysis['classificacao']['gravidade'] = 'medio'

    if (['homicídio', 'estupro', 'latrocínio'].includes(tipoPenal)) {
      gravidade = 'gravissimo'
    } else if (['roubo', 'tráfico de drogas'].includes(tipoPenal)) {
      gravidade = 'grave'
    } else if (['furto', 'estelionato'].includes(tipoPenal)) {
      gravidade = 'medio'
    } else if (['lesão corporal'].includes(tipoPenal)) {
      gravidade = 'leve'
    }

    // Determinar natureza
    let natureza: CrimeAnalysis['classificacao']['natureza'] = 'outro'

    if (['furto', 'roubo', 'estelionato'].includes(tipoPenal)) {
      natureza = 'patrimonial'
    } else if (['homicídio', 'lesão corporal'].includes(tipoPenal)) {
      natureza = 'pessoa'
    } else if (['estupro'].includes(tipoPenal)) {
      natureza = 'sexual'
    } else if (['tráfico de drogas'].includes(tipoPenal)) {
      natureza = 'droga'
    }

    return { gravidade, natureza }
  }

  /**
   * Calcula o prazo de prescrição
   */
  private calcularPrescricao(penaMaxima: number): CrimeAnalysis['prescricao'] {
    let prazo = 20 // anos

    if (penaMaxima < 1) {
      prazo = 3
    } else if (penaMaxima < 2) {
      prazo = 4
    } else if (penaMaxima < 4) {
      prazo = 8
    } else if (penaMaxima < 8) {
      prazo = 12
    } else if (penaMaxima < 12) {
      prazo = 16
    } else {
      prazo = 20
    }

    return {
      prazo,
      dataBase: new Date().toISOString().split('T')[0],
    }
  }
}
