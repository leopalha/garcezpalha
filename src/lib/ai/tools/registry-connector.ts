/**
 * Registry Connector - Conecta com cartórios e registros públicos
 * Consulta matrículas, certidões e documentos (simulado - em produção usar APIs reais)
 */

export interface PropertyRegistryInfo {
  matricula: string
  cartorio: string
  imovel: {
    tipo: 'urbano' | 'rural'
    endereco: string
    area: number
    inscricaoIPTU?: string
  }
  proprietarios: {
    nome: string
    cpf: string
    percentual: number // % de propriedade
  }[]
  onus: {
    tipo: 'hipoteca' | 'penhora' | 'usufruto' | 'servidao' | 'outro'
    favorecido: string
    valor?: number
    dataRegistro: string
    ativo: boolean
  }[]
  averbacoes: {
    tipo: string
    descricao: string
    data: string
  }[]
  historicoProprietarios: {
    nome: string
    dataAquisicao: string
    dataAlienacao?: string
    formaAquisicao: 'compra-venda' | 'heranca' | 'doacao' | 'usucapiao' | 'outra'
  }[]
  regularidade: {
    regular: boolean
    problemas: string[]
    observacoes: string[]
  }
}

export interface CertidaoInfo {
  tipo: 'nascimento' | 'casamento' | 'obito' | 'negativa'
  numero: string
  dataEmissao: string
  cartorio: string
  pessoa: {
    nome: string
    cpf?: string
    dataNascimento?: string
  }
  valida: boolean
  observacoes: string[]
}

export class RegistryConnector {
  /**
   * Consulta matrícula de imóvel
   */
  async consultPropertyRegistry(matricula: string, cartorio?: string): Promise<PropertyRegistryInfo> {
    // Simulação - em produção, integrar com APIs de cartórios ou CRI
    // Possíveis integrações: SINTER (Sistema Nacional de Informações de Registro de Imóveis)

    const imovelSimulado: PropertyRegistryInfo = {
      matricula,
      cartorio: cartorio || '1º Ofício de Registro de Imóveis',
      imovel: {
        tipo: 'urbano',
        endereco: 'Rua das Flores, 123, Centro',
        area: 250,
        inscricaoIPTU: '123.456.789-0',
      },
      proprietarios: [
        {
          nome: 'João Silva',
          cpf: '123.456.789-00',
          percentual: 100,
        },
      ],
      onus: [],
      averbacoes: [],
      historicoProprietarios: [
        {
          nome: 'Maria Santos',
          dataAquisicao: '2000-01-15',
          dataAlienacao: '2010-05-20',
          formaAquisicao: 'compra-venda',
        },
        {
          nome: 'João Silva',
          dataAquisicao: '2010-05-20',
          formaAquisicao: 'compra-venda',
        },
      ],
      regularidade: {
        regular: true,
        problemas: [],
        observacoes: ['Matrícula atualizada', 'Sem pendências'],
      },
    }

    // Simular verificação de ônus
    const temOnus = Math.random() > 0.7
    if (temOnus) {
      imovelSimulado.onus.push({
        tipo: 'hipoteca',
        favorecido: 'Banco XYZ S.A.',
        valor: 300000,
        dataRegistro: '2015-03-10',
        ativo: true,
      })

      imovelSimulado.regularidade.regular = false
      imovelSimulado.regularidade.problemas.push('Imóvel com hipoteca ativa')
      imovelSimulado.regularidade.observacoes.push('Necessário quitação da hipoteca para venda')
    }

    return imovelSimulado
  }

  /**
   * Verifica se imóvel tem ônus ou gravames
   */
  async checkPropertyLiens(matricula: string): Promise<{
    temOnus: boolean
    tipos: string[]
    detalhes: PropertyRegistryInfo['onus']
    valorTotal: number
  }> {
    const registro = await this.consultPropertyRegistry(matricula)

    const onusAtivos = registro.onus.filter((o) => o.ativo)
    const valorTotal = onusAtivos.reduce((sum, o) => sum + (o.valor || 0), 0)

    return {
      temOnus: onusAtivos.length > 0,
      tipos: onusAtivos.map((o) => o.tipo),
      detalhes: onusAtivos,
      valorTotal,
    }
  }

  /**
   * Consulta certidão (nascimento, casamento, óbito)
   */
  async consultCertidao(params: {
    tipo: 'nascimento' | 'casamento' | 'obito' | 'negativa'
    numero?: string
    nomePessoa?: string
    cpf?: string
  }): Promise<CertidaoInfo> {
    // Simulação - em produção, integrar com CRC (Central de Registro Civil)

    const certidaoSimulada: CertidaoInfo = {
      tipo: params.tipo,
      numero: params.numero || '123456-01-55-2024-1-00001-01',
      dataEmissao: new Date().toISOString().split('T')[0],
      cartorio: 'Cartório de Registro Civil',
      pessoa: {
        nome: params.nomePessoa || 'Pessoa Teste',
        cpf: params.cpf,
        dataNascimento: '1990-01-15',
      },
      valida: true,
      observacoes: ['Certidão válida', 'Emitida eletronicamente'],
    }

    return certidaoSimulada
  }

  /**
   * Verifica autenticidade de certidão
   */
  async verifyCertidaoAuthenticity(numero: string): Promise<{
    autentica: boolean
    motivo: string
    recomendacao: string
  }> {
    // Simulação de verificação via QR Code ou código de validação
    // Em produção, consultar API do CNJ ou cartório emissor

    const autentica = !numero.includes('FAKE')

    if (autentica) {
      return {
        autentica: true,
        motivo: 'Certidão localizada na base de dados do cartório',
        recomendacao: 'Certidão autêntica e válida para uso',
      }
    } else {
      return {
        autentica: false,
        motivo: 'Número de certidão não localizado ou inválido',
        recomendacao: 'Solicitar segunda via do cartório emissor ou verificar possível falsificação',
      }
    }
  }

  /**
   * Consulta débitos de IPTU
   */
  async consultIPTU(inscricao: string, cidade: string): Promise<{
    inscricao: string
    proprietario: string
    endereco: string
    valorVenal: number
    debitosAbertos: {
      ano: number
      tipo: 'IPTU' | 'Multa' | 'Juros'
      valor: number
      vencimento: string
    }[]
    totalDebitos: number
    emDivida: boolean
  }> {
    // Simulação - em produção, integrar com prefeitura
    const temDebitos = Math.random() > 0.6

    const debitos = temDebitos
      ? [
          {
            ano: 2023,
            tipo: 'IPTU' as const,
            valor: 1500,
            vencimento: '2023-02-10',
          },
          {
            ano: 2024,
            tipo: 'IPTU' as const,
            valor: 1600,
            vencimento: '2024-02-10',
          },
        ]
      : []

    return {
      inscricao,
      proprietario: 'João Silva',
      endereco: 'Rua das Flores, 123',
      valorVenal: 450000,
      debitosAbertos: debitos,
      totalDebitos: debitos.reduce((sum, d) => sum + d.valor, 0),
      emDivida: temDebitos,
    }
  }

  /**
   * Consulta processos judiciais relacionados ao imóvel
   */
  async consultPropertyLawsuits(matricula: string): Promise<{
    temProcessos: boolean
    processos: {
      numero: string
      tipo: 'execucao' | 'possessoria' | 'usucapiao' | 'inventario' | 'outro'
      status: 'ativo' | 'arquivado' | 'suspenso'
      dataDistribuicao: string
      tribunal: string
    }[]
  }> {
    // Simulação - em produção, consultar CNJ ou TJs
    const temProcessos = Math.random() > 0.8

    return {
      temProcessos,
      processos: temProcessos
        ? [
            {
              numero: '1234567-89.2024.8.26.0100',
              tipo: 'execucao',
              status: 'ativo',
              dataDistribuicao: '2024-01-15',
              tribunal: 'TJSP',
            },
          ]
        : [],
    }
  }
}

// Singleton instance
export const registryConnector = new RegistryConnector()
