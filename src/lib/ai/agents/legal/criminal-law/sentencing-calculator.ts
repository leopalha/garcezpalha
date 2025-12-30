/**
 * Sentencing Calculator - Calcula penas criminais
 * Aplica o método trifásico de dosimetria da pena
 */

import { CrimeAnalysis } from './crime-analyzer'

export interface SentenceCalculation {
  penaBase: {
    valor: number
    unidade: 'meses' | 'anos'
    fundamentacao: string
  }
  penaIntermediariaAgravantes: {
    valor: number
    unidade: 'meses' | 'anos'
    aumento: number
    fundamentacao: string[]
  }
  penaIntermediariaAtenuantes: {
    valor: number
    unidade: 'meses' | 'anos'
    reducao: number
    fundamentacao: string[]
  }
  penaFinal: {
    valor: number
    unidade: 'meses' | 'anos'
    causasAumento: string[]
    causasDiminuicao: string[]
  }
  regimeInicial: 'fechado' | 'semiaberto' | 'aberto'
  substituicaoPossivel: boolean
  suspensaoCondicional: boolean
}

export class SentencingCalculator {
  /**
   * Calcula a pena usando o método trifásico
   * 1ª Fase: Pena base (circunstâncias judiciais - art. 59)
   * 2ª Fase: Pena intermediária (agravantes e atenuantes)
   * 3ª Fase: Pena final (causas de aumento e diminuição)
   */
  async calculateSentence(
    crimeAnalysis: CrimeAnalysis,
    circunstanciasJudiciais?: {
      culpabilidade: 'baixa' | 'media' | 'alta'
      antecedentes: 'bons' | 'ruins'
      condutaSocial: 'boa' | 'ruim'
      personalidade: 'favoravel' | 'desfavoravel'
      motivos: 'favoraveis' | 'desfavoraveis'
      circunstancias: 'favoraveis' | 'desfavoraveis'
      consequencias: 'leves' | 'graves'
      comportamentoVitima: 'favoravel' | 'desfavoravel'
    }
  ): Promise<SentenceCalculation> {
    // 1ª Fase: Pena Base
    const penaBase = this.calcularPenaBase(crimeAnalysis, circunstanciasJudiciais)

    // 2ª Fase: Pena Intermediária - Agravantes
    const penaAgravantes = this.aplicarAgravantes(penaBase.valor, crimeAnalysis)

    // 2ª Fase: Pena Intermediária - Atenuantes
    const penaAtenuantes = this.aplicarAtenuantes(penaAgravantes.valor, crimeAnalysis)

    // 3ª Fase: Pena Final
    const penaFinal = this.aplicarCausasAumentoEDiminuicao(penaAtenuantes.valor, crimeAnalysis)

    // Calcular regime inicial
    const regimeInicial = this.calcularRegimeInicial(
      penaFinal.valor,
      circunstanciasJudiciais?.antecedentes === 'bons'
    )

    // Verificar possibilidade de substituição
    const substituicaoPossivel = this.verificarSubstituicao(penaFinal.valor, crimeAnalysis)

    // Verificar suspensão condicional (sursis)
    const suspensaoCondicional = this.verificarSuspensao(penaFinal.valor, crimeAnalysis)

    return {
      penaBase,
      penaIntermediariaAgravantes: penaAgravantes,
      penaIntermediariaAtenuantes: penaAtenuantes,
      penaFinal,
      regimeInicial,
      substituicaoPossivel,
      suspensaoCondicional,
    }
  }

  /**
   * 1ª Fase: Calcula pena base conforme art. 59 do CP
   */
  private calcularPenaBase(
    crimeAnalysis: CrimeAnalysis,
    circunstanciasJudiciais?: any
  ): SentenceCalculation['penaBase'] {
    const { min, max, unidade } = crimeAnalysis.penaBase

    // Calcular ponto médio
    let penaBase = (min + max) / 2

    // Ajustar conforme circunstâncias judiciais
    if (circunstanciasJudiciais) {
      let ajuste = 0

      if (circunstanciasJudiciais.culpabilidade === 'alta') ajuste += 0.1
      if (circunstanciasJudiciais.culpabilidade === 'baixa') ajuste -= 0.1

      if (circunstanciasJudiciais.antecedentes === 'ruins') ajuste += 0.1
      if (circunstanciasJudiciais.condutaSocial === 'ruim') ajuste += 0.05
      if (circunstanciasJudiciais.consequencias === 'graves') ajuste += 0.1

      penaBase = Math.max(min, Math.min(max, penaBase * (1 + ajuste)))
    }

    const fundamentacao = `Pena base fixada em ${penaBase} ${unidade}, considerando as circunstâncias judiciais do art. 59 do CP.`

    return {
      valor: Math.round(penaBase),
      unidade,
      fundamentacao,
    }
  }

  /**
   * 2ª Fase: Aplica agravantes
   */
  private aplicarAgravantes(
    penaBase: number,
    crimeAnalysis: CrimeAnalysis
  ): SentenceCalculation['penaIntermediariaAgravantes'] {
    const { agravantes } = crimeAnalysis.circunstancias
    let penaFinal = penaBase
    const fundamentacao: string[] = []
    let aumentoTotal = 0

    agravantes.forEach((agravante) => {
      const aumento = 0.1 // 1/6 da pena (aproximadamente 16%)
      penaFinal *= (1 + aumento)
      aumentoTotal += aumento
      fundamentacao.push(`Agravante: ${agravante} (aumento de 1/6)`)
    })

    return {
      valor: Math.round(penaFinal),
      unidade: crimeAnalysis.penaBase.unidade,
      aumento: aumentoTotal,
      fundamentacao,
    }
  }

  /**
   * 2ª Fase: Aplica atenuantes
   */
  private aplicarAtenuantes(
    penaIntermediaria: number,
    crimeAnalysis: CrimeAnalysis
  ): SentenceCalculation['penaIntermediariaAtenuantes'] {
    const { atenuantes } = crimeAnalysis.circunstancias
    let penaFinal = penaIntermediaria
    const fundamentacao: string[] = []
    let reducaoTotal = 0

    atenuantes.forEach((atenuante) => {
      const reducao = 0.1 // 1/6 da pena
      penaFinal *= (1 - reducao)
      reducaoTotal += reducao
      fundamentacao.push(`Atenuante: ${atenuante} (redução de 1/6)`)
    })

    return {
      valor: Math.round(penaFinal),
      unidade: crimeAnalysis.penaBase.unidade,
      reducao: reducaoTotal,
      fundamentacao,
    }
  }

  /**
   * 3ª Fase: Aplica causas de aumento e diminuição
   */
  private aplicarCausasAumentoEDiminuicao(
    penaIntermediaria: number,
    crimeAnalysis: CrimeAnalysis
  ): SentenceCalculation['penaFinal'] {
    let penaFinal = penaIntermediaria
    const causasAumento: string[] = []
    const causasDiminuicao: string[] = []

    // Tentativa (diminuição de 1/3 a 2/3)
    if (crimeAnalysis.elementos.consumacao === 'tentado') {
      penaFinal *= 0.67 // Redução de 1/3
      causasDiminuicao.push('Tentativa (art. 14, II, CP - redução de 1/3)')
    }

    // Crime impossível (não há pena)
    if (crimeAnalysis.elementos.consumacao === 'impossivel') {
      penaFinal = 0
      causasDiminuicao.push('Crime impossível (art. 17, CP - não há pena)')
    }

    // Qualificadoras
    crimeAnalysis.circunstancias.qualificadoras.forEach((qualificadora) => {
      penaFinal *= 1.5 // Aumento de 50%
      causasAumento.push(`${qualificadora} (aumento de 1/2)`)
    })

    return {
      valor: Math.round(penaFinal),
      unidade: crimeAnalysis.penaBase.unidade,
      causasAumento,
      causasDiminuicao,
    }
  }

  /**
   * Calcula regime inicial de cumprimento de pena
   */
  private calcularRegimeInicial(
    penaMeses: number,
    primario: boolean
  ): SentenceCalculation['regimeInicial'] {
    const penaAnos = penaMeses / 12

    if (penaAnos > 8) {
      return 'fechado'
    } else if (penaAnos > 4) {
      return primario ? 'semiaberto' : 'fechado'
    } else {
      return primario ? 'aberto' : 'semiaberto'
    }
  }

  /**
   * Verifica possibilidade de substituição por penas restritivas de direitos
   */
  private verificarSubstituicao(
    penaMeses: number,
    crimeAnalysis: CrimeAnalysis
  ): boolean {
    const penaAnos = penaMeses / 12

    // Art. 44 do CP: pena não superior a 4 anos
    if (penaAnos > 4) return false

    // Crime sem violência ou grave ameaça
    if (crimeAnalysis.tipoPerial.includes('roubo')) return false
    if (crimeAnalysis.tipoPerial.includes('estupro')) return false

    return true
  }

  /**
   * Verifica possibilidade de suspensão condicional (sursis)
   */
  private verificarSuspensao(
    penaMeses: number,
    crimeAnalysis: CrimeAnalysis
  ): boolean {
    const penaAnos = penaMeses / 12

    // Art. 77 do CP: pena não superior a 2 anos
    if (penaAnos > 2) return false

    // Não pode ser reincidente em crime doloso
    const temReincidencia = crimeAnalysis.circunstancias.agravantes.some(
      (a) => a.includes('Reincidência')
    )
    if (temReincidencia) return false

    return true
  }
}
