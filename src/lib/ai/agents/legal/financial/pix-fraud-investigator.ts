/**
 * PIX Fraud Investigator - Investigação de fraudes via PIX
 * Orienta sobre recuperação de valores e responsabilização
 */

export interface PixFraudInvestigation {
  tipoFraude: 'phishing' | 'golpe-whatsapp' | 'falso-funcionario' | 'invasao-conta' | 'qrcode-falso' | 'outro'
  gravidade: 'baixa' | 'media' | 'alta' | 'critica'
  responsabilidades: {
    golpista: {
      identificado: boolean
      dadosConhecidos: string[]
      localizacao?: string
    }
    banco: {
      responsavel: boolean
      fundamentacao: string[]
      percentualResponsabilidade: number
    }
    vitima: {
      culpaConcorrente: boolean
      fundamentacao: string[]
    }
  }
  recuperacaoValores: {
    viavel: boolean
    metodos: {
      metodo: string
      prazo: string
      probabilidadeSuccesso: 'alta' | 'media' | 'baixa'
      custos: number
    }[]
    valorRecuperavel: {
      minimo: number
      maximo: number
    }
  }
  medidasUrgentes: {
    medida: string
    prazo: string
    importancia: 'critica' | 'alta' | 'media'
  }[]
  acoesJudiciais: {
    civeis: string[]
    criminais: string[]
  }
  documentacao: {
    ja_possui: string[]
    necessaria: string[]
  }
  prazos: {
    acao: string
    prazo: string
    vencimento?: string
  }[]
}

export class PixFraudInvestigator {
  /**
   * Investiga fraude PIX e orienta recuperação
   */
  async investigateFraud(fraudData: {
    descricaoFraude: string
    valorTransferido: number
    dataHoraTransferencia: string
    chavePIXDestino: string
    tipoChave: 'cpf' | 'cnpj' | 'email' | 'telefone' | 'aleatoria'
    bancoOrigem: string
    bancoDestino: string
    comproante?: string
    comunicouBanco: boolean
    registrouBO: boolean
  }): Promise<PixFraudInvestigation> {
    // Identificar tipo de fraude
    const tipoFraude = this.identificarTipoFraude(fraudData)

    // Avaliar gravidade
    const gravidade = this.avaliarGravidade(fraudData)

    // Apurar responsabilidades
    const responsabilidades = this.apurarResponsabilidades(fraudData, tipoFraude)

    // Avaliar recuperação de valores
    const recuperacaoValores = this.avaliarRecuperacao(fraudData, responsabilidades)

    // Listar medidas urgentes
    const medidasUrgentes = this.listarMedidasUrgentes(fraudData)

    // Indicar ações judiciais
    const acoesJudiciais = this.indicarAcoesJudiciais(tipoFraude, responsabilidades)

    // Verificar documentação
    const documentacao = this.verificarDocumentacao(fraudData)

    // Calcular prazos
    const prazos = this.calcularPrazos(fraudData)

    return {
      tipoFraude,
      gravidade,
      responsabilidades,
      recuperacaoValores,
      medidasUrgentes,
      acoesJudiciais,
      documentacao,
      prazos,
    }
  }

  private identificarTipoFraude(fraudData: any): PixFraudInvestigation['tipoFraude'] {
    const desc = fraudData.descricaoFraude.toLowerCase()

    if (desc.includes('link') || desc.includes('site falso') || desc.includes('dados')) {
      return 'phishing'
    }
    if (desc.includes('whatsapp') || desc.includes('mensagem') || desc.includes('parente')) {
      return 'golpe-whatsapp'
    }
    if (desc.includes('funcionário') || desc.includes('ligação') || desc.includes('banco')) {
      return 'falso-funcionario'
    }
    if (desc.includes('invasão') || desc.includes('hackeado') || desc.includes('senha')) {
      return 'invasao-conta'
    }
    if (desc.includes('qr code') || desc.includes('boleto')) {
      return 'qrcode-falso'
    }

    return 'outro'
  }

  private avaliarGravidade(fraudData: any): PixFraudInvestigation['gravidade'] {
    const valor = fraudData.valorTransferido

    if (valor > 50000) return 'critica'
    if (valor > 10000) return 'alta'
    if (valor > 2000) return 'media'
    return 'baixa'
  }

  private apurarResponsabilidades(
    fraudData: any,
    tipoFraude: string
  ): PixFraudInvestigation['responsabilidades'] {
    let bancoResponsavel = false
    let percentualBanco = 0
    const fundamentacaoBanco: string[] = []
    const fundamentacaoVitima: string[] = []
    let culpaConcorrente = false

    // Responsabilidade do banco
    if (!fraudData.comunicouBanco) {
      // Se não comunicou, banco tem menos responsabilidade
      percentualBanco = 0
    } else {
      // Comunicou banco mas não bloqueou = responsabilidade
      const horasAposTransferencia =
        (new Date().getTime() - new Date(fraudData.dataHoraTransferencia).getTime()) /
        (1000 * 60 * 60)

      if (horasAposTransferencia < 24) {
        bancoResponsavel = true
        percentualBanco = 50
        fundamentacaoBanco.push(
          'Resolução BCB 4.753/2019 - Banco deve ter mecanismos de bloqueio de fraudes'
        )
        fundamentacaoBanco.push(
          'Comunicação em até 24h permite bloqueio - banco falhou em agir'
        )
      }
    }

    // Phishing = maior responsabilidade do banco
    if (tipoFraude === 'phishing') {
      bancoResponsavel = true
      percentualBanco = Math.max(percentualBanco, 70)
      fundamentacaoBanco.push(
        'Banco deve implementar autenticação forte e alertas de segurança'
      )
    }

    // Invasão de conta = responsabilidade do banco
    if (tipoFraude === 'invasao-conta') {
      bancoResponsavel = true
      percentualBanco = 100
      fundamentacaoBanco.push('Falha de segurança do banco permitiu invasão')
      fundamentacaoBanco.push('Art. 14 do CDC - Responsabilidade objetiva por falha de segurança')
    }

    // Culpa concorrente da vítima
    if (tipoFraude === 'golpe-whatsapp' || tipoFraude === 'falso-funcionario') {
      culpaConcorrente = true
      fundamentacaoVitima.push('Vítima forneceu dados ou autorizou transferência')
      fundamentacaoVitima.push('Culpa concorrente reduz indenização (art. 945 CC)')
    }

    return {
      golpista: {
        identificado: fraudData.tipoChave === 'cpf' || fraudData.tipoChave === 'cnpj',
        dadosConhecidos: [
          `Chave PIX: ${fraudData.chavePIXDestino}`,
          `Tipo: ${fraudData.tipoChave}`,
          `Banco: ${fraudData.bancoDestino}`,
        ],
      },
      banco: {
        responsavel: bancoResponsavel,
        fundamentacao: fundamentacaoBanco,
        percentualResponsabilidade: percentualBanco,
      },
      vitima: {
        culpaConcorrente,
        fundamentacao: fundamentacaoVitima,
      },
    }
  }

  private avaliarRecuperacao(
    fraudData: any,
    responsabilidades: any
  ): PixFraudInvestigation['recuperacaoValores'] {
    const metodos: PixFraudInvestigation['recuperacaoValores']['metodos'] = []

    // Método 1: MED - Mecanismo Especial de Devolução
    metodos.push({
      metodo: 'MED - Mecanismo Especial de Devolução (Banco Central)',
      prazo: '7 a 30 dias',
      probabilidadeSuccesso: responsabilidades.banco.responsavel ? 'media' : 'baixa',
      custos: 0,
    })

    // Método 2: Bloqueio judicial urgente
    const horasAposTransferencia =
      (new Date().getTime() - new Date(fraudData.dataHoraTransferencia).getTime()) /
      (1000 * 60 * 60)

    if (horasAposTransferencia < 72) {
      metodos.push({
        metodo: 'Bloqueio judicial via SISBAJUD (urgente)',
        prazo: '24-48 horas',
        probabilidadeSuccesso: 'alta',
        custos: 2000,
      })
    }

    // Método 3: Ação cível contra banco
    if (responsabilidades.banco.responsavel) {
      metodos.push({
        metodo: 'Ação indenizatória contra banco',
        prazo: '12-18 meses',
        probabilidadeSuccesso: 'alta',
        custos: 3000,
      })
    }

    // Método 4: Ação penal + reparação de danos
    metodos.push({
      metodo: 'Ação penal + pedido de reparação de danos',
      prazo: '18-36 meses',
      probabilidadeSuccesso: responsabilidades.golpista.identificado ? 'media' : 'baixa',
      custos: 1500,
    })

    const valorRecuperavel = {
      minimo: responsabilidades.banco.responsavel
        ? fraudData.valorTransferido * (responsabilidades.banco.percentualResponsabilidade / 100)
        : 0,
      maximo: fraudData.valorTransferido,
    }

    return {
      viavel: metodos.length > 0,
      metodos,
      valorRecuperavel,
    }
  }

  private listarMedidasUrgentes(
    fraudData: any
  ): PixFraudInvestigation['medidasUrgentes'] {
    const medidas: PixFraudInvestigation['medidasUrgentes'] = []

    if (!fraudData.comunicouBanco) {
      medidas.push({
        medida: 'Comunicar imediatamente o banco de origem (Central de Atendimento)',
        prazo: 'IMEDIATO',
        importancia: 'critica',
      })
    }

    if (!fraudData.registrouBO) {
      medidas.push({
        medida: 'Registrar Boletim de Ocorrência (online ou presencial)',
        prazo: 'Nas próximas 24 horas',
        importancia: 'critica',
      })
    }

    medidas.push({
      medida: 'Acionar MED do Banco Central (via app ou site)',
      prazo: 'Até 80 dias após a fraude',
      importancia: 'alta',
    })

    medidas.push({
      medida: 'Guardar todos os comprovantes e prints de conversas',
      prazo: 'Imediato',
      importancia: 'alta',
    })

    const horasAposTransferencia =
      (new Date().getTime() - new Date(fraudData.dataHoraTransferencia).getTime()) /
      (1000 * 60 * 60)

    if (horasAposTransferencia < 72) {
      medidas.push({
        medida: 'Protocolar ação judicial urgente para bloqueio de valores',
        prazo: 'Próximas 48-72 horas',
        importancia: 'critica',
      })
    }

    return medidas
  }

  private indicarAcoesJudiciais(
    tipoFraude: string,
    responsabilidades: any
  ): PixFraudInvestigation['acoesJudiciais'] {
    const civeis: string[] = []
    const criminais: string[] = []

    // Ações cíveis
    if (responsabilidades.banco.responsavel) {
      civeis.push('Ação de indenização por danos materiais e morais contra banco')
      civeis.push('Tutela de urgência para bloqueio de valores')
    }

    civeis.push('Ação de reparação de danos contra golpista (se identificado)')

    // Ações criminais
    criminais.push('Estelionato (art. 171 do Código Penal)')

    if (tipoFraude === 'invasao-conta') {
      criminais.push('Invasão de dispositivo informático (art. 154-A do CP)')
    }

    if (tipoFraude === 'phishing') {
      criminais.push('Furto mediante fraude (art. 155, §4º, II do CP)')
    }

    criminais.push('Uso de documento falso (art. 304 do CP) se aplicável')

    return {
      civeis,
      criminais,
    }
  }

  private verificarDocumentacao(
    fraudData: any
  ): PixFraudInvestigation['documentacao'] {
    const ja_possui: string[] = []
    const necessaria: string[] = []

    if (fraudData.comprovante) {
      ja_possui.push('Comprovante da transferência PIX')
    } else {
      necessaria.push('Comprovante da transferência PIX (solicitar ao banco)')
    }

    if (fraudData.registrouBO) {
      ja_possui.push('Boletim de Ocorrência')
    } else {
      necessaria.push('Boletim de Ocorrência')
    }

    necessaria.push('Prints de conversas (WhatsApp, SMS, e-mails)')
    necessaria.push('Protocolo de atendimento do banco')
    necessaria.push('Comprovante de acionamento do MED')
    necessaria.push('Extratos bancários (antes e depois da fraude)')
    necessaria.push('Identificação da chave PIX destino (DICT)')

    return {
      ja_possui,
      necessaria,
    }
  }

  private calcularPrazos(fraudData: any): PixFraudInvestigation['prazos'] {
    const dataFraude = new Date(fraudData.dataHoraTransferencia)
    const prazos: PixFraudInvestigation['prazos'] = []

    // MED
    const prazoMED = new Date(dataFraude)
    prazoMED.setDate(prazoMED.getDate() + 80)
    prazos.push({
      acao: 'Acionar MED do Banco Central',
      prazo: '80 dias',
      vencimento: prazoMED.toLocaleDateString('pt-BR'),
    })

    // Ação cível
    const prazoCivel = new Date(dataFraude)
    prazoCivel.setFullYear(prazoCivel.getFullYear() + 3)
    prazos.push({
      acao: 'Ação cível de indenização',
      prazo: '3 anos (art. 206, §3º, V do CC)',
      vencimento: prazoCivel.toLocaleDateString('pt-BR'),
    })

    // Ação penal
    const prazoPenal = new Date(dataFraude)
    prazoPenal.setFullYear(prazoPenal.getFullYear() + 8)
    prazos.push({
      acao: 'Representação criminal (estelionato)',
      prazo: '8 anos (prescrição art. 171 CP)',
      vencimento: prazoPenal.toLocaleDateString('pt-BR'),
    })

    return prazos
  }
}
