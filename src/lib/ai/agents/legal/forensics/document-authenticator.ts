/**
 * Document Authenticator - Autenticação de documentos
 * Verifica autenticidade de documentos e identifica adulterações
 */

export interface DocumentAuthentication {
  autenticidade: {
    conclusao: 'autentico' | 'duvidoso' | 'falso' | 'adulterado'
    confianca: number // 0-100%
    fundamentacao: string[]
  }
  analiseVisual: {
    papel: {
      tipo: string
      gramatura: string
      marcaDagua: boolean
      observacoes: string[]
    }
    impressao: {
      tipo: 'laser' | 'jato-tinta' | 'offset' | 'tipografica' | 'desconhecido'
      qualidade: 'alta' | 'media' | 'baixa'
      irregularidades: string[]
    }
    selos: {
      presente: boolean
      tipo?: string
      autentico?: boolean
    }
  }
  adulteracoes: {
    detectadas: boolean
    tipos: {
      tipo: 'rasura' | 'emenda' | 'montagem' | 'substituicao-folha' | 'alteracao-digital'
      localizacao: string
      metodo: string
      evidencias: string[]
    }[]
  }
  elementosSeguranca: {
    presentes: string[]
    ausentes: string[]
    comprometidos: string[]
  }
  compatibilidadeTemporal: {
    compativel: boolean
    dataDocumento: string
    dataSupostaEmissao: string
    incompatibilidades: string[]
  }
  examesRecomendados: {
    exame: string
    finalidade: string
    custoEstimado: number
  }[]
  valorProbatorio: {
    nivel: 'pleno' | 'reduzido' | 'nulo'
    fundamentacao: string[]
    recomendacoes: string[]
  }
}

export class DocumentAuthenticator {
  /**
   * Autentica documento e identifica adulterações
   */
  async authenticateDocument(documentData: {
    tipo: string // RG, CNH, contrato, certidão, etc
    dataEmissao: string
    orgaoEmissor?: string
    numeroDocumento?: string
    descricaoFisica: string
    suspeitas: string[]
    imagemBase64?: string
  }): Promise<DocumentAuthentication> {
    // Análise visual do documento
    const analiseVisual = this.analisarAspectosFisicos(documentData)

    // Detectar adulterações
    const adulteracoes = this.detectarAdulteracoes(documentData, analiseVisual)

    // Verificar elementos de segurança
    const elementosSeguranca = this.verificarElementosSeguranca(
      documentData.tipo,
      analiseVisual
    )

    // Verificar compatibilidade temporal
    const compatibilidadeTemporal = this.verificarCompatibilidadeTemporal(
      documentData,
      analiseVisual
    )

    // Calcular autenticidade
    const autenticidade = this.calcularAutenticidade(
      analiseVisual,
      adulteracoes,
      elementosSeguranca,
      compatibilidadeTemporal
    )

    // Recomendar exames
    const examesRecomendados = this.recomendarExames(autenticidade, adulteracoes)

    // Avaliar valor probatório
    const valorProbatorio = this.avaliarValorProbatorio(autenticidade, adulteracoes)

    return {
      autenticidade,
      analiseVisual,
      adulteracoes,
      elementosSeguranca,
      compatibilidadeTemporal,
      examesRecomendados,
      valorProbatorio,
    }
  }

  /**
   * Analisa aspectos físicos do documento
   */
  private analisarAspectosFisicos(
    documentData: any
  ): DocumentAuthentication['analiseVisual'] {
    const { descricaoFisica } = documentData
    const descLower = descricaoFisica.toLowerCase()

    return {
      papel: {
        tipo: descLower.includes('moeda') ? 'Papel moeda' : 'Papel comum',
        gramatura: descLower.includes('fino') ? '75g/m²' : '90g/m²',
        marcaDagua: descLower.includes('marca d\'água') || descLower.includes('marca dagua'),
        observacoes: descLower.includes('amarelado')
          ? ['Papel amarelado - possível envelhecimento artificial']
          : [],
      },
      impressao: {
        tipo: descLower.includes('laser')
          ? 'laser'
          : descLower.includes('jato')
          ? 'jato-tinta'
          : 'offset',
        qualidade: descLower.includes('borrada') || descLower.includes('falha')
          ? 'baixa'
          : 'alta',
        irregularidades: descLower.includes('borrada')
          ? ['Impressão borrada em alguns trechos']
          : [],
      },
      selos: {
        presente: descLower.includes('selo'),
        tipo: descLower.includes('selo')
          ? 'Selo holográfico'
          : undefined,
        autentico: !descLower.includes('suspeito'),
      },
    }
  }

  /**
   * Detecta adulterações no documento
   */
  private detectarAdulteracoes(
    documentData: any,
    analiseVisual: DocumentAuthentication['analiseVisual']
  ): DocumentAuthentication['adulteracoes'] {
    const { descricaoFisica, suspeitas } = documentData
    const descLower = descricaoFisica.toLowerCase()

    const tipos: DocumentAuthentication['adulteracoes']['tipos'] = []

    // Rasura
    if (descLower.includes('rasura') || descLower.includes('raspagem')) {
      tipos.push({
        tipo: 'rasura',
        localizacao: 'Campo de valor/data',
        metodo: 'Raspagem mecânica ou química',
        evidencias: [
          'Resíduos de raspagem visíveis',
          'Diferença de tonalidade do papel',
          'Fibras do papel rompidas',
        ],
      })
    }

    // Emenda
    if (descLower.includes('emenda') || descLower.includes('sobreposição')) {
      tipos.push({
        tipo: 'emenda',
        localizacao: 'Texto manuscrito',
        metodo: 'Sobreposição de texto/caracteres',
        evidencias: [
          'Traços sobrepostos',
          'Diferença de tinta',
          'Variação de pressão',
        ],
      })
    }

    // Montagem
    if (descLower.includes('montagem') || descLower.includes('recorte')) {
      tipos.push({
        tipo: 'montagem',
        localizacao: 'Fotografia ou campos específicos',
        metodo: 'Recorte e colagem de elementos',
        evidencias: [
          'Linha de corte visível',
          'Diferença de iluminação',
          'Tonalidade diferente',
        ],
      })
    }

    // Alteração digital
    if (descLower.includes('digital') || descLower.includes('photoshop')) {
      tipos.push({
        tipo: 'alteracao-digital',
        localizacao: 'Campos de texto e imagem',
        metodo: 'Edição digital (Photoshop ou similar)',
        evidencias: [
          'Pixels inconsistentes',
          'Compressão diferenciada',
          'Metadados suspeitos',
        ],
      })
    }

    // Checar suspeitas do usuário
    suspeitas.forEach((suspeita: string) => {
      const sLower = suspeita.toLowerCase()
      if (sLower.includes('data') && !tipos.some((t) => t.tipo === 'emenda')) {
        tipos.push({
          tipo: 'emenda',
          localizacao: 'Campo de data',
          metodo: 'Alteração de dígitos',
          evidencias: ['Suspeita relatada pelo usuário', 'Análise grafotécnica necessária'],
        })
      }
    })

    return {
      detectadas: tipos.length > 0,
      tipos,
    }
  }

  /**
   * Verifica elementos de segurança
   */
  private verificarElementosSeguranca(
    tipoDocumento: string,
    analiseVisual: DocumentAuthentication['analiseVisual']
  ): DocumentAuthentication['elementosSeguranca'] {
    const presentes: string[] = []
    const ausentes: string[] = []
    const comprometidos: string[] = []

    // Elementos esperados por tipo de documento
    const elementosEsperados: Record<string, string[]> = {
      'RG': ['Marca d\'água', 'Selo holográfico', 'Tinta UV', 'Microimpressão'],
      'CNH': ['Holografia', 'Código de barras 2D', 'MRZ', 'Tinta reativa UV'],
      'Certidão': ['Marca d\'água', 'Selo oficial', 'Tarja de segurança'],
      'Contrato': ['Assinatura', 'Reconhecimento de firma', 'Carimbo oficial'],
    }

    const esperados = elementosEsperados[tipoDocumento] || ['Assinatura', 'Carimbo']

    esperados.forEach((elemento) => {
      if (elemento === 'Marca d\'água' && analiseVisual.papel.marcaDagua) {
        presentes.push(elemento)
      } else if (elemento.includes('Selo') && analiseVisual.selos.presente) {
        if (analiseVisual.selos.autentico) {
          presentes.push(elemento)
        } else {
          comprometidos.push(elemento + ' (suspeito)')
        }
      } else if (
        !analiseVisual.papel.marcaDagua &&
        elemento === 'Marca d\'água'
      ) {
        ausentes.push(elemento)
      }
    })

    return {
      presentes,
      ausentes,
      comprometidos,
    }
  }

  /**
   * Verifica compatibilidade temporal
   */
  private verificarCompatibilidadeTemporal(
    documentData: any,
    analiseVisual: DocumentAuthentication['analiseVisual']
  ): DocumentAuthentication['compatibilidadeTemporal'] {
    const { dataEmissao, tipo } = documentData
    const incompatibilidades: string[] = []

    // Exemplo: CNH modelo atual só existe após 2017
    if (tipo === 'CNH' && analiseVisual.selos.presente) {
      const anoEmissao = new Date(dataEmissao).getFullYear()
      if (anoEmissao < 2017) {
        incompatibilidades.push(
          'CNH com código QR não existia antes de 2017 (Resolução 598/2016 CONTRAN)'
        )
      }
    }

    // Exemplo: Papel moeda moderno em documento antigo
    if (
      analiseVisual.papel.tipo === 'Papel moeda' &&
      new Date(dataEmissao).getFullYear() < 2000
    ) {
      incompatibilidades.push(
        'Papel moeda com segurança moderna incompatível com data de emissão'
      )
    }

    // Impressão laser em documento muito antigo
    if (
      analiseVisual.impressao.tipo === 'laser' &&
      new Date(dataEmissao).getFullYear() < 1990
    ) {
      incompatibilidades.push(
        'Impressão laser não era comum em documentos oficiais antes de 1990'
      )
    }

    return {
      compativel: incompatibilidades.length === 0,
      dataDocumento: dataEmissao,
      dataSupostaEmissao: dataEmissao,
      incompatibilidades,
    }
  }

  /**
   * Calcula autenticidade final
   */
  private calcularAutenticidade(
    analiseVisual: DocumentAuthentication['analiseVisual'],
    adulteracoes: DocumentAuthentication['adulteracoes'],
    elementosSeguranca: DocumentAuthentication['elementosSeguranca'],
    compatibilidadeTemporal: DocumentAuthentication['compatibilidadeTemporal']
  ): DocumentAuthentication['autenticidade'] {
    let confianca = 100
    const fundamentacao: string[] = []

    // Reduzir confiança por adulterações
    if (adulteracoes.detectadas) {
      const gravesCount = adulteracoes.tipos.filter(
        (t) => t.tipo === 'montagem' || t.tipo === 'alteracao-digital'
      ).length
      confianca -= gravesCount * 40
      confianca -= (adulteracoes.tipos.length - gravesCount) * 20
      fundamentacao.push(
        `Detectadas ${adulteracoes.tipos.length} adulteração(ões) no documento`
      )
    }

    // Reduzir por elementos de segurança ausentes
    if (elementosSeguranca.ausentes.length > 0) {
      confianca -= elementosSeguranca.ausentes.length * 15
      fundamentacao.push(
        `${elementosSeguranca.ausentes.length} elemento(s) de segurança ausente(s)`
      )
    }

    // Reduzir por elementos comprometidos
    if (elementosSeguranca.comprometidos.length > 0) {
      confianca -= elementosSeguranca.comprometidos.length * 25
      fundamentacao.push(
        `${elementosSeguranca.comprometidos.length} elemento(s) de segurança comprometido(s)`
      )
    }

    // Reduzir por incompatibilidade temporal
    if (!compatibilidadeTemporal.compativel) {
      confianca -= 30
      fundamentacao.push('Incompatibilidade temporal detectada')
    }

    // Reduzir por qualidade de impressão
    if (analiseVisual.impressao.qualidade === 'baixa') {
      confianca -= 10
      fundamentacao.push('Qualidade de impressão incompatível com documento oficial')
    }

    confianca = Math.max(0, Math.min(100, confianca))

    let conclusao: DocumentAuthentication['autenticidade']['conclusao']
    if (adulteracoes.detectadas) {
      conclusao = 'adulterado'
    } else if (confianca >= 70) {
      conclusao = 'autentico'
    } else if (confianca >= 40) {
      conclusao = 'duvidoso'
    } else {
      conclusao = 'falso'
    }

    return {
      conclusao,
      confianca,
      fundamentacao,
    }
  }

  /**
   * Recomenda exames técnicos
   */
  private recomendarExames(
    autenticidade: DocumentAuthentication['autenticidade'],
    adulteracoes: DocumentAuthentication['adulteracoes']
  ): DocumentAuthentication['examesRecomendados'] {
    const exames: DocumentAuthentication['examesRecomendados'] = []

    if (autenticidade.conclusao !== 'autentico') {
      exames.push({
        exame: 'Exame grafotécnico',
        finalidade: 'Análise de assinaturas e textos manuscritos',
        custoEstimado: 2000,
      })

      exames.push({
        exame: 'Exame documentoscópico',
        finalidade: 'Análise de papel, tintas e impressão',
        custoEstimado: 2500,
      })
    }

    if (adulteracoes.tipos.some((t) => t.tipo === 'alteracao-digital')) {
      exames.push({
        exame: 'Análise de metadados EXIF',
        finalidade: 'Verificar data de criação e edições digitais',
        custoEstimado: 1000,
      })

      exames.push({
        exame: 'Análise de compressão JPEG',
        finalidade: 'Detectar áreas editadas digitalmente',
        custoEstimado: 1500,
      })
    }

    if (adulteracoes.tipos.some((t) => t.tipo === 'rasura')) {
      exames.push({
        exame: 'Exame com luz UV e infravermelho',
        finalidade: 'Revelar rasuras e alterações químicas',
        custoEstimado: 1500,
      })
    }

    return exames
  }

  /**
   * Avalia valor probatório do documento
   */
  private avaliarValorProbatorio(
    autenticidade: DocumentAuthentication['autenticidade'],
    adulteracoes: DocumentAuthentication['adulteracoes']
  ): DocumentAuthentication['valorProbatorio'] {
    let nivel: DocumentAuthentication['valorProbatorio']['nivel']
    const fundamentacao: string[] = []
    const recomendacoes: string[] = []

    if (autenticidade.conclusao === 'autentico') {
      nivel = 'pleno'
      fundamentacao.push('Art. 405 do CPC - Documento particular com força probante')
      fundamentacao.push('Art. 215 do CC - Presunção de veracidade')
      recomendacoes.push('Documento pode ser usado como prova principal')
    } else if (autenticidade.conclusao === 'duvidoso') {
      nivel = 'reduzido'
      fundamentacao.push(
        'Art. 369 do CPC - Documento duvidoso tem valor probatório reduzido'
      )
      fundamentacao.push('Necessária confirmação por outros meios de prova')
      recomendacoes.push('Requerer perícia grafotécnica/documentoscópica')
      recomendacoes.push('Produzir provas complementares (testemunhas, documentos)')
    } else {
      nivel = 'nulo'
      fundamentacao.push('Art. 429 do CPC - Documento falso/adulterado não tem valor probante')
      fundamentacao.push('Art. 304 do CP - Uso de documento falso é crime')
      recomendacoes.push('NÃO utilizar como prova (pode configurar crime)')
      recomendacoes.push('Comunicar autoridades sobre falsificação')

      if (adulteracoes.detectadas) {
        recomendacoes.push('Preservar documento para perícia criminal')
      }
    }

    return {
      nivel,
      fundamentacao,
      recomendacoes,
    }
  }
}
