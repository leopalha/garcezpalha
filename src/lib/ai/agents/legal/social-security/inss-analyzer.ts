/**
 * INSS Analyzer - Analisa histórico contributivo e identifica problemas
 * Verifica CNIS, períodos faltantes e direitos não reconhecidos
 */

export interface INSSAnalysis {
  historicoContributivo: {
    tempoTotalReconhecido: {
      anos: number
      meses: number
      dias: number
    }
    periodosContribuicao: {
      inicio: string
      fim: string
      empregador: string
      tipo: 'CLT' | 'autonomo' | 'servidor' | 'rural' | 'contribuinte-individual'
      reconhecido: boolean
    }[]
    lacunas: {
      inicio: string
      fim: string
      mesesPerdidos: number
      recuperavel: boolean
      observacao: string
    }[]
  }
  problemas: {
    tipo: 'vinculos-nao-reconhecidos' | 'salarios-incorretos' | 'tempo-especial-nao-computado' | 'carencia-insuficiente' | 'outro'
    descricao: string
    impacto: 'alto' | 'medio' | 'baixo'
    solucao: string
  }[]
  oportunidades: {
    tipo: string
    beneficio: string
    valorEstimado: number
    documentosNecessarios: string[]
  }[]
  acoesCorretivas: {
    acao: string
    prazo: string
    custo: number
    prioridade: 'alta' | 'media' | 'baixa'
  }[]
  revisao: {
    viavel: boolean
    tipo: 'revisao-vida-toda' | 'revisao-teto' | 'inclusao-tempo-especial' | 'outra'
    incrementoEstimado: number
    fundamentacao: string[]
  }
}

export class INSSAnalyzer {
  /**
   * Analisa histórico do INSS e identifica problemas
   */
  async analyzeINSS(inssData: {
    cnis: {
      vinculos: {
        inicio: string
        fim: string
        empregador: string
        tipo: string
      }[]
    }
    beneficioAtual?: {
      tipo: string
      valor: number
      dataConcessao: string
    }
    idade: number
    atividadeEspecial?: boolean
  }): Promise<INSSAnalysis> {
    // Analisar histórico contributivo
    const historicoContributivo = this.analisarHistorico(inssData.cnis)

    // Identificar problemas
    const problemas = this.identificarProblemas(historicoContributivo, inssData)

    // Identificar oportunidades
    const oportunidades = this.identificarOportunidades(historicoContributivo, inssData)

    // Sugerir ações corretivas
    const acoesCorretivas = this.sugerirAcoes(problemas)

    // Avaliar viabilidade de revisão
    const revisao = this.avaliarRevisao(inssData)

    return {
      historicoContributivo,
      problemas,
      oportunidades,
      acoesCorretivas,
      revisao,
    }
  }

  private analisarHistorico(cnis: any): INSSAnalysis['historicoContributivo'] {
    const periodosContribuicao: INSSAnalysis['historicoContributivo']['periodosContribuicao'] = []
    const lacunas: INSSAnalysis['historicoContributivo']['lacunas'] = []

    let mesesTotais = 0

    cnis.vinculos.forEach((vinculo: any, index: number) => {
      const tipo = this.identificarTipoVinculo(vinculo.tipo)

      periodosContribuicao.push({
        inicio: vinculo.inicio,
        fim: vinculo.fim,
        empregador: vinculo.empregador,
        tipo,
        reconhecido: true,
      })

      // Calcular meses do período
      const inicio = new Date(vinculo.inicio)
      const fim = new Date(vinculo.fim)
      const meses =
        (fim.getFullYear() - inicio.getFullYear()) * 12 +
        (fim.getMonth() - inicio.getMonth())
      mesesTotais += meses

      // Identificar lacunas
      if (index > 0) {
        const fimAnterior = new Date(cnis.vinculos[index - 1].fim)
        const mesesLacuna =
          (inicio.getFullYear() - fimAnterior.getFullYear()) * 12 +
          (inicio.getMonth() - fimAnterior.getMonth())

        if (mesesLacuna > 1) {
          lacunas.push({
            inicio: fimAnterior.toISOString().split('T')[0],
            fim: inicio.toISOString().split('T')[0],
            mesesPerdidos: mesesLacuna,
            recuperavel: mesesLacuna <= 60, // Até 5 anos pode pagar em atraso
            observacao:
              mesesLacuna <= 60
                ? 'Pode pagar contribuições em atraso'
                : 'Lacuna muito antiga (não recuperável)',
          })
        }
      }
    })

    const anos = Math.floor(mesesTotais / 12)
    const meses = mesesTotais % 12

    return {
      tempoTotalReconhecido: {
        anos,
        meses,
        dias: 0,
      },
      periodosContribuicao,
      lacunas,
    }
  }

  private identificarTipoVinculo(tipo: string): 'CLT' | 'autonomo' | 'servidor' | 'rural' | 'contribuinte-individual' {
    const tipoLower = tipo.toLowerCase()
    if (tipoLower.includes('clt') || tipoLower.includes('empregado')) return 'CLT'
    if (tipoLower.includes('servidor') || tipoLower.includes('público')) return 'servidor'
    if (tipoLower.includes('rural')) return 'rural'
    if (tipoLower.includes('autônomo') || tipoLower.includes('autonomo')) return 'autonomo'
    return 'contribuinte-individual'
  }

  private identificarProblemas(
    historico: INSSAnalysis['historicoContributivo'],
    inssData: any
  ): INSSAnalysis['problemas'] {
    const problemas: INSSAnalysis['problemas'] = []

    // Lacunas recuperáveis
    const lacunasRecuperaveis = historico.lacunas.filter((l) => l.recuperavel)
    if (lacunasRecuperaveis.length > 0) {
      const mesesPerdidos = lacunasRecuperaveis.reduce((sum, l) => sum + l.mesesPerdidos, 0)
      problemas.push({
        tipo: 'carencia-insuficiente',
        descricao: `${mesesPerdidos} meses de contribuição faltantes (períodos sem contribuição)`,
        impacto: mesesPerdidos > 12 ? 'alto' : 'medio',
        solucao: 'Pagar contribuições em atraso para completar carência',
      })
    }

    // Tempo especial não computado
    if (inssData.atividadeEspecial) {
      problemas.push({
        tipo: 'tempo-especial-nao-computado',
        descricao: 'Atividade especial pode não estar reconhecida no CNIS',
        impacto: 'alto',
        solucao: 'Solicitar conversão de tempo especial em comum (acréscimo de 40% para homens, 20% para mulheres)',
      })
    }

    // Vínculos não reconhecidos (simulação)
    if (historico.periodosContribuicao.length < 3) {
      problemas.push({
        tipo: 'vinculos-nao-reconhecidos',
        descricao: 'Possíveis vínculos empregatícios não constam no CNIS',
        impacto: 'medio',
        solucao: 'Apresentar CTPS, contratos e recibos para inclusão de vínculos',
      })
    }

    return problemas
  }

  private identificarOportunidades(
    historico: INSSAnalysis['historicoContributivo'],
    inssData: any
  ): INSSAnalysis['oportunidades'] {
    const oportunidades: INSSAnalysis['oportunidades'] = []

    const tempoAnos = historico.tempoTotalReconhecido.anos

    // Aposentadoria por tempo de contribuição (se perto)
    if (tempoAnos >= 30 && tempoAnos < 35 && !inssData.beneficioAtual) {
      oportunidades.push({
        tipo: 'Aposentadoria por tempo de contribuição',
        beneficio: `Faltam ${35 - tempoAnos} anos para aposentadoria`,
        valorEstimado: 3000,
        documentosNecessarios: ['CNIS atualizado', 'CTPS', 'PPP (se atividade especial)'],
      })
    }

    // Conversão de tempo especial
    if (inssData.atividadeEspecial) {
      oportunidades.push({
        tipo: 'Conversão de tempo especial',
        beneficio: 'Acréscimo de 40% no tempo de atividade especial',
        valorEstimado: 500,
        documentosNecessarios: ['PPP - Perfil Profissiográfico Previdenciário', 'Laudos técnicos'],
      })
    }

    return oportunidades
  }

  private sugerirAcoes(problemas: INSSAnalysis['problemas']): INSSAnalysis['acoesCorretivas'] {
    const acoes: INSSAnalysis['acoesCorretivas'] = []

    problemas.forEach((problema) => {
      if (problema.tipo === 'carencia-insuficiente') {
        acoes.push({
          acao: 'Pagar contribuições em atraso',
          prazo: '30-60 dias',
          custo: 1500,
          prioridade: 'alta',
        })
      }

      if (problema.tipo === 'tempo-especial-nao-computado') {
        acoes.push({
          acao: 'Solicitar PPP e protocolar pedido de reconhecimento de tempo especial',
          prazo: '60-90 dias',
          custo: 800,
          prioridade: 'alta',
        })
      }

      if (problema.tipo === 'vinculos-nao-reconhecidos') {
        acoes.push({
          acao: 'Reunir CTPS e documentos para inclusão de vínculos',
          prazo: '15-30 dias',
          custo: 500,
          prioridade: 'media',
        })
      }
    })

    return acoes
  }

  private avaliarRevisao(inssData: any): INSSAnalysis['revisao'] {
    if (!inssData.beneficioAtual) {
      return {
        viavel: false,
        tipo: 'outra',
        incrementoEstimado: 0,
        fundamentacao: ['Não há benefício ativo para revisar'],
      }
    }

    // Revisão da Vida Toda (incluir salários pré-1994)
    const dataConcessao = new Date(inssData.beneficioAtual.dataConcessao)
    const anoConcessao = dataConcessao.getFullYear()

    if (anoConcessao >= 1999) {
      return {
        viavel: true,
        tipo: 'revisao-vida-toda',
        incrementoEstimado: 800,
        fundamentacao: [
          'Tema 1.102 STF - Direito de incluir salários anteriores a julho/1994',
          'Pode aumentar média salarial em 15-30%',
          'Prazo decadencial: 10 anos da concessão',
        ],
      }
    }

    return {
      viavel: false,
      tipo: 'outra',
      incrementoEstimado: 0,
      fundamentacao: ['Benefício muito antigo - prazo decadencial expirado'],
    }
  }
}
