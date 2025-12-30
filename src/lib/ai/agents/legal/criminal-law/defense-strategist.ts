/**
 * Defense Strategist - Estratégias de defesa criminal
 * Analisa provas e sugere estratégias de defesa
 */

import { CrimeAnalysis } from './crime-analyzer'

export interface Evidence {
  tipo: 'testemunhal' | 'documental' | 'pericial' | 'material'
  descricao: string
  favoravel: boolean
  confiabilidade: 'alta' | 'media' | 'baixa'
}

export interface DefenseStrategy {
  estrategiaPrincipal: string
  teseDefensiva: string
  fundamentacao: string[]
  probas: {
    favoraveis: Evidence[]
    desfavoraveis: Evidence[]
  }
  viciosProcessuais: string[]
  recursosDisponiveis: string[]
  chancesAbsolvicao: 'alta' | 'media' | 'baixa'
  recomendacoes: string[]
}

export class DefenseStrategist {
  /**
   * Avalia evidências e propõe estratégia de defesa
   */
  async evaluateDefense(
    crimeAnalysis: CrimeAnalysis,
    evidences: Evidence[]
  ): Promise<DefenseStrategy> {
    // Classificar provas
    const probasFavoraveis = evidences.filter((e) => e.favoravel)
    const probasDesfavoraveis = evidences.filter((e) => !e.favoravel)

    // Determinar estratégia principal
    const estrategiaPrincipal = this.determinarEstrategia(crimeAnalysis, evidences)

    // Formular tese defensiva
    const teseDefensiva = this.formularTeseDefensiva(crimeAnalysis, estrategiaPrincipal)

    // Fundamentação jurídica
    const fundamentacao = this.construirFundamentacao(crimeAnalysis, estrategiaPrincipal)

    // Identificar vícios processuais
    const viciosProcessuais = this.identificarVicios(evidences)

    // Recursos disponíveis
    const recursosDisponiveis = this.listarRecursos(crimeAnalysis)

    // Avaliar chances de absolvição
    const chancesAbsolvicao = this.avaliarChances(probasFavoraveis, probasDesfavoraveis)

    // Recomendações estratégicas
    const recomendacoes = this.gerarRecomendacoes(
      crimeAnalysis,
      estrategiaPrincipal,
      chancesAbsolvicao
    )

    return {
      estrategiaPrincipal,
      teseDefensiva,
      fundamentacao,
      probas: {
        favoraveis: probasFavoraveis,
        desfavoraveis: probasDesfavoraveis,
      },
      viciosProcessuais,
      recursosDisponiveis,
      chancesAbsolvicao,
      recomendacoes,
    }
  }

  /**
   * Determina a melhor estratégia de defesa
   */
  private determinarEstrategia(
    crimeAnalysis: CrimeAnalysis,
    evidences: Evidence[]
  ): string {
    // Estratégia 1: Negativa de autoria
    const probasAutoria = evidences.filter(
      (e) => e.descricao.toLowerCase().includes('autoria') && !e.favoravel
    )
    if (provasAutoria.length === 0 || probasAutoria.every((e) => e.confiabilidade === 'baixa')) {
      return 'Negativa de Autoria'
    }

    // Estratégia 2: Excludente de ilicitude
    if (crimeAnalysis.tipoPerial.includes('lesão corporal')) {
      return 'Legítima Defesa (art. 25, CP)'
    }

    // Estratégia 3: Excludente de culpabilidade
    const temDoencaMental = evidences.some(
      (e) => e.tipo === 'pericial' && e.descricao.toLowerCase().includes('inimputável')
    )
    if (temDoencaMental) {
      return 'Inimputabilidade por Doença Mental (art. 26, CP)'
    }

    // Estratégia 4: Desclassificação
    if (crimeAnalysis.tipoPerial === 'homicídio') {
      return 'Desclassificação para Homicídio Culposo'
    }

    // Estratégia 5: Atipicidade
    if (crimeAnalysis.elementos.consumacao === 'impossivel') {
      return 'Atipicidade (Crime Impossível - art. 17, CP)'
    }

    // Estratégia padrão: Dosimetria
    return 'Redução da Pena (Dosimetria Favorável)'
  }

  /**
   * Formula a tese defensiva
   */
  private formularTeseDefensiva(
    crimeAnalysis: CrimeAnalysis,
    estrategia: string
  ): string {
    const teses: Record<string, string> = {
      'Negativa de Autoria': 'O réu não cometeu o crime. As provas da acusação são insuficientes para comprovar a autoria delitiva, devendo prevalecer o princípio da presunção de inocência.',

      'Legítima Defesa (art. 25, CP)': 'O réu agiu em legítima defesa, repelindo injusta agressão, atual ou iminente, utilizando moderadamente os meios necessários.',

      'Inimputabilidade por Doença Mental (art. 26, CP)': 'O réu é portador de doença mental que o torna inteiramente incapaz de entender o caráter ilícito do fato, devendo ser aplicada medida de segurança.',

      'Desclassificação para Homicídio Culposo': 'Não restou comprovado o dolo, devendo o crime ser desclassificado para homicídio culposo, com pena significativamente menor.',

      'Atipicidade (Crime Impossível - art. 17, CP)': 'O crime era impossível por absoluta ineficácia do meio ou impropriedade do objeto, devendo ser reconhecida a atipicidade.',

      'Redução da Pena (Dosimetria Favorável)': 'Aplicação de atenuantes, confissão espontânea e bons antecedentes do réu justificam pena mínima prevista em lei.',
    }

    return teses[estrategia] || 'Tese defensiva a ser desenvolvida conforme análise do caso concreto.'
  }

  /**
   * Constrói fundamentação jurídica
   */
  private construirFundamentacao(
    crimeAnalysis: CrimeAnalysis,
    estrategia: string
  ): string[] {
    const fundamentacao: string[] = []

    // Princípios constitucionais
    fundamentacao.push('Princípio da Presunção de Inocência (art. 5º, LVII, CF/88)')
    fundamentacao.push('Princípio do In Dubio Pro Reo')

    // Fundamentação específica por estratégia
    if (estrategia.includes('Legítima Defesa')) {
      fundamentacao.push('Art. 25 do Código Penal - Legítima Defesa')
      fundamentacao.push('Súmula 575 do STJ - Legítima defesa real e putativa')
    }

    if (estrategia.includes('Inimputabilidade')) {
      fundamentacao.push('Art. 26 do Código Penal - Inimputabilidade')
      fundamentacao.push('Art. 149 do CPP - Incidente de insanidade mental')
    }

    // Jurisprudência
    fundamentacao.push('Jurisprudência consolidada do STJ e STF')

    // Doutrina
    fundamentacao.push('Doutrina majoritária (Nucci, Capez, Greco)')

    return fundamentacao
  }

  /**
   * Identifica vícios processuais
   */
  private identificarVicios(evidences: Evidence[]): string[] {
    const vicios: string[] = []

    // Provas ilícitas
    const provasIlicitas = evidences.filter(
      (e) => e.descricao.toLowerCase().includes('ilícita') ||
             e.descricao.toLowerCase().includes('sem mandado')
    )
    if (provasIlicitas.length > 0) {
      vicios.push('Provas ilícitas ou ilícitas por derivação (art. 5º, LVI, CF/88)')
    }

    // Cerceamento de defesa
    const semAdvogado = evidences.some(
      (e) => e.descricao.toLowerCase().includes('sem advogado')
    )
    if (semAdvogado) {
      vicios.push('Cerceamento de defesa - ausência de defesa técnica')
    }

    // Nulidades
    vicios.push('Verificar nulidades formais (arts. 564-573 do CPP)')

    return vicios
  }

  /**
   * Lista recursos disponíveis
   */
  private listarRecursos(crimeAnalysis: CrimeAnalysis): string[] {
    const recursos: string[] = []

    recursos.push('Apelação (art. 593 do CPP)')
    recursos.push('Recurso em Sentido Estrito (art. 581 do CPP)')
    recursos.push('Recurso Especial ao STJ (art. 105, III, CF/88)')
    recursos.push('Recurso Extraordinário ao STF (art. 102, III, CF/88)')

    // Habeas Corpus sempre disponível
    recursos.push('Habeas Corpus (art. 5º, LXVIII, CF/88)')

    return recursos
  }

  /**
   * Avalia chances de absolvição
   */
  private avaliarChances(
    probasFavoraveis: Evidence[],
    probasDesfavoraveis: Evidence[]
  ): 'alta' | 'media' | 'baixa' {
    const scoreProvas = probasFavoraveis.length - probasDesfavoraveis.length

    // Avaliar qualidade das provas
    const probasAltaConfiabilidade = probasDesfavoraveis.filter(
      (e) => e.confiabilidade === 'alta'
    ).length

    if (scoreProvas > 2 && probasAltaConfiabilidade === 0) {
      return 'alta'
    } else if (scoreProvas >= 0 || probasAltaConfiabilidade <= 1) {
      return 'media'
    } else {
      return 'baixa'
    }
  }

  /**
   * Gera recomendações estratégicas
   */
  private gerarRecomendacoes(
    crimeAnalysis: CrimeAnalysis,
    estrategia: string,
    chances: 'alta' | 'media' | 'baixa'
  ): string[] {
    const recomendacoes: string[] = []

    // Acordo de não persecução penal (ANPP)
    if (crimeAnalysis.penaBase.max <= 48 && crimeAnalysis.penaBase.unidade === 'meses') {
      recomendacoes.push('Avaliar possibilidade de Acordo de Não Persecução Penal (ANPP)')
    }

    // Suspensão condicional do processo
    if (crimeAnalysis.penaBase.min <= 12 && crimeAnalysis.penaBase.unidade === 'meses') {
      recomendacoes.push('Propor Suspensão Condicional do Processo (art. 89, Lei 9.099/95)')
    }

    // Confissão qualificada
    if (chances === 'baixa') {
      recomendacoes.push('Considerar confissão qualificada para obter atenuante')
    }

    // Produção de provas
    recomendacoes.push('Arrolar testemunhas de defesa')
    recomendacoes.push('Requerer perícias quando necessário')

    // Questionar provas
    if (estrategia.includes('Negativa')) {
      recomendacoes.push('Impugnar provas da acusação via contradita')
    }

    // Liberdade provisória
    recomendacoes.push('Requerer liberdade provisória se houver prisão cautelar')

    return recomendacoes
  }
}
