/**
 * Checkout Types
 * Tipos para o sistema de checkout e pagamentos
 * Catalogo unificado de solucoes juridicas
 */

export type SolutionCategory =
  | 'bancario'
  | 'imobiliario'
  | 'saude'
  | 'pericia'
  | 'criminal'
  | 'aeronautico'
  | 'automacao'
  | 'previdenciario'

export interface SolutionVariant {
  id: string
  name: string
  description: string
  price: number
  features?: string[]
  estimatedDelivery?: string
}

export interface Solution {
  id: string
  name: string
  description: string
  price: number // Preço base (mínimo)
  category: SolutionCategory
  icon: string
  features: string[]
  estimatedDelivery?: string
  isProductized?: boolean // Produto estruturado vs servico tradicional
  variants?: SolutionVariant[] // Subprodutos/variações
  hasVariants?: boolean // Se tem variantes para escolher
}

// Aliases para compatibilidade
export type ServiceCategory = SolutionCategory
export type Service = Solution

export interface CheckoutItem {
  service: Solution
  quantity: number
  subtotal: number
}

export interface CheckoutCart {
  items: CheckoutItem[]
  subtotal: number
  discount: number
  total: number
}

export interface CheckoutFormData {
  // Client Info
  name: string
  email: string
  phone: string
  cpfCnpj: string

  // Additional Info
  serviceDescription?: string
  urgency?: 'normal' | 'urgent' | 'express'

  // Payment
  paymentMethod: 'credit_card' | 'pix' | 'boleto'
}

export interface PaymentIntent {
  id: string
  amount: number
  currency: string
  status: 'pending' | 'processing' | 'succeeded' | 'failed' | 'canceled'
  clientSecret?: string // For Stripe
  pixQrCode?: string // For PIX
  boletoUrl?: string // For Boleto
}

export const SOLUTIONS: Solution[] = [
  // ============================================
  // SOLUCOES - Produtos rapidos e estruturados
  // ============================================

  // Direito Bancario
  {
    id: 'desbloqueio-conta',
    name: 'Desbloqueio de Conta',
    description: 'Acao judicial para desbloqueio de conta bancaria ou poupanca',
    price: 150000, // R$ 1.500,00
    category: 'bancario',
    icon: 'Shield',
    features: [
      'Analise do bloqueio judicial',
      'Peticao de desbloqueio',
      'Acompanhamento do processo',
      'Recursos se necessario',
    ],
    estimatedDelivery: '5 dias uteis',
    isProductized: true,
  },
  {
    id: 'golpe-pix',
    name: 'Golpe do PIX',
    description: 'Recuperacao de valores perdidos em golpes via PIX',
    price: 120000, // R$ 1.200,00
    category: 'bancario',
    icon: 'AlertTriangle',
    features: [
      'Analise do caso',
      'Boletim de ocorrencia',
      'Notificacao ao banco',
      'Acao judicial de recuperacao',
    ],
    estimatedDelivery: '3 dias uteis',
    isProductized: true,
  },
  {
    id: 'negativacao-indevida',
    name: 'Negativacao Indevida',
    description: 'Remocao de nome do SPC/Serasa + indenizacao por danos morais',
    price: 100000, // R$ 1.000,00
    category: 'bancario',
    icon: 'BadgeDollarSign',
    features: [
      'Analise da negativacao',
      'Notificacao extrajudicial',
      'Acao de indenizacao',
      'Pedido de liminar',
    ],
    estimatedDelivery: '3 dias uteis',
    isProductized: true,
  },
  {
    id: 'defesa-execucao',
    name: 'Defesa em Execucao',
    description: 'Embargos a execucao e defesa em cobrancas judiciais',
    price: 180000, // R$ 1.800,00
    category: 'bancario',
    icon: 'Scale',
    features: [
      'Analise da execucao',
      'Embargos do devedor',
      'Impugnacao ao cumprimento',
      'Negociacao de acordo',
    ],
    estimatedDelivery: '5 dias uteis',
    isProductized: true,
  },

  // Direito Imobiliario
  {
    id: 'direito-imobiliario',
    name: 'Consultoria Imobiliaria',
    description: 'Assessoria completa em transacoes imobiliarias',
    price: 150000, // R$ 1.500,00
    category: 'imobiliario',
    icon: 'Building2',
    features: [
      'Analise de contrato de compra e venda',
      'Verificacao de matricula atualizada',
      'Analise de certidoes',
      'Calculo de ITBI e custos',
    ],
    estimatedDelivery: '3 dias uteis',
    isProductized: true,
  },
  {
    id: 'usucapiao',
    name: 'Usucapiao',
    description: 'Regularizacao de imovel por usucapiao judicial ou extrajudicial',
    price: 300000, // R$ 3.000,00
    category: 'imobiliario',
    icon: 'FileText',
    features: [
      'Analise de viabilidade',
      'Levantamento documental',
      'Peticao inicial ou requerimento',
      'Acompanhamento completo',
    ],
    estimatedDelivery: '10 dias uteis',
    isProductized: true,
  },
  {
    id: 'holding-familiar',
    name: 'Holding Familiar',
    description: 'Estruturacao de holding para protecao patrimonial',
    price: 500000, // R$ 5.000,00
    category: 'imobiliario',
    icon: 'Building2',
    features: [
      'Planejamento societario',
      'Constituicao da empresa',
      'Transferencia de bens',
      'Planejamento sucessorio',
    ],
    estimatedDelivery: '15 dias uteis',
    isProductized: true,
  },
  {
    id: 'inventario',
    name: 'Inventario',
    description: 'Inventario judicial ou extrajudicial para partilha de bens',
    price: 350000, // R$ 3.500,00
    category: 'imobiliario',
    icon: 'FileText',
    features: [
      'Levantamento de bens e dividas',
      'Calculo de impostos (ITCMD)',
      'Elaboracao da minuta',
      'Registro em cartorio',
    ],
    estimatedDelivery: '15 dias uteis',
    isProductized: true,
  },
  {
    id: 'regularizacao-imovel',
    name: 'Regularizacao de Imovel',
    description: 'Regularizacao documental de imoveis irregulares',
    price: 200000, // R$ 2.000,00
    category: 'imobiliario',
    icon: 'Home',
    features: [
      'Analise da situacao',
      'Retificacao de area',
      'Averbacao de construcao',
      'Desmembramento/unificacao',
    ],
    estimatedDelivery: '10 dias uteis',
    isProductized: true,
  },
  {
    id: 'avaliacao-imoveis',
    name: 'Avaliacao de Imoveis',
    description: 'Laudo de avaliacao conforme NBR 14653',
    price: 120000, // R$ 1.200,00
    category: 'imobiliario',
    icon: 'Home',
    features: [
      'Vistoria presencial',
      'Analise de mercado',
      'Laudo conforme NBR 14653',
      'Fotos e plantas detalhadas',
    ],
    estimatedDelivery: '10 dias uteis',
    isProductized: true,
  },

  // Direito da Saude
  {
    id: 'plano-saude',
    name: 'Plano de Saude Negou',
    description: 'Acao contra plano de saude por negativa de cobertura',
    price: 150000, // R$ 1.500,00
    category: 'saude',
    icon: 'Stethoscope',
    features: [
      'Analise da negativa',
      'Notificacao ao plano',
      'Acao com pedido de liminar',
      'Indenizacao por danos',
    ],
    estimatedDelivery: '3 dias uteis',
    isProductized: true,
  },
  {
    id: 'cirurgia-bariatrica',
    name: 'Cirurgia Bariatrica',
    description: 'Acao para obrigar plano a cobrir cirurgia bariatrica',
    price: 180000, // R$ 1.800,00
    category: 'saude',
    icon: 'Heart',
    features: [
      'Analise do contrato',
      'Parecer medico',
      'Acao com tutela de urgencia',
      'Acompanhamento ate a cirurgia',
    ],
    estimatedDelivery: '5 dias uteis',
    isProductized: true,
  },
  {
    id: 'tratamento-tea',
    name: 'Tratamento TEA',
    description: 'Acao para cobertura de tratamento de autismo (TEA)',
    price: 150000, // R$ 1.500,00
    category: 'saude',
    icon: 'Heart',
    features: [
      'Analise da negativa',
      'Laudos e relatorios medicos',
      'Acao com liminar',
      'Cobertura integral do tratamento',
    ],
    estimatedDelivery: '3 dias uteis',
    isProductized: true,
  },
  {
    id: 'bpc-loas',
    name: 'BPC / LOAS',
    description: 'Beneficio de Prestacao Continuada para idosos e deficientes',
    price: 120000, // R$ 1.200,00
    category: 'saude',
    icon: 'Shield',
    features: [
      'Analise de requisitos',
      'Requerimento administrativo',
      'Acao judicial se negado',
      'Acompanhamento do beneficio',
    ],
    estimatedDelivery: '5 dias uteis',
    isProductized: true,
  },
  {
    id: 'pericia-medica',
    name: 'Pericia Medica',
    description: 'Laudo pericial para processos de saude e previdencia',
    price: 250000, // R$ 2.500,00
    category: 'saude',
    icon: 'Stethoscope',
    features: [
      'Analise de laudos e exames',
      'Avaliacao de nexo causal',
      'Calculo de incapacidade',
      'Parecer tecnico fundamentado',
    ],
    estimatedDelivery: '15 dias uteis',
    isProductized: true,
  },
  {
    id: 'cannabis-medicinal',
    name: 'Cannabis Medicinal',
    description: 'Autorizacao Anvisa, HC cultivo e salvo conduto',
    price: 200000, // R$ 2.000,00
    category: 'saude',
    icon: 'Leaf',
    features: [
      'Autorizacao Anvisa (importacao)',
      'Habeas Corpus preventivo',
      'Salvo conduto (porte)',
      'Acao contra plano de saude',
    ],
    estimatedDelivery: '5-10 dias uteis',
    isProductized: true,
    hasVariants: true,
    variants: [
      {
        id: 'autorizacao-anvisa',
        name: 'Autorizacao Anvisa',
        description: 'Importacao de CBD/THC medicinal',
        price: 200000, // R$ 2.000,00
        features: [
          'Prescricao medica',
          'Protocolo na Anvisa',
          'Acompanhamento do processo',
          'Renovacao anual',
        ],
        estimatedDelivery: '5 dias uteis',
      },
      {
        id: 'hc-cultivo-cannabis',
        name: 'HC Preventivo - Cultivo',
        description: 'Habeas Corpus para cultivo medicinal',
        price: 350000, // R$ 3.500,00
        features: [
          'Analise do caso',
          'Laudos medicos',
          'HC preventivo',
          'Acompanhamento judicial',
        ],
        estimatedDelivery: '7 dias uteis',
      },
      {
        id: 'salvo-conduto-cannabis',
        name: 'Salvo Conduto',
        description: 'Autorizacao para porte de medicamento',
        price: 250000, // R$ 2.500,00
        features: [
          'Pedido judicial',
          'Documentacao medica',
          'Autorizacao de porte',
          'Validade nacional',
        ],
        estimatedDelivery: '5 dias uteis',
      },
      {
        id: 'plano-saude-cannabis',
        name: 'Plano de Saude - Cannabis',
        description: 'Cobertura de cannabis medicinal',
        price: 300000, // R$ 3.000,00
        features: [
          'Acao contra operadora',
          'Liminar para cobertura',
          'Reembolso de medicamento',
          'Danos morais',
        ],
        estimatedDelivery: '5 dias uteis',
      },
      {
        id: 'associacao-cannabis',
        name: 'Associacao Cannabis',
        description: 'Criacao/regularizacao de associacao',
        price: 500000, // R$ 5.000,00
        features: [
          'Criacao de estatuto',
          'Registro em cartorio',
          'Compliance legal',
          'Assessoria continuada',
        ],
        estimatedDelivery: '15 dias uteis',
      },
    ],
  },

  // Pericia e Documentos
  {
    id: 'pericia-documental',
    name: 'Pericia Documental',
    description: 'Analise grafotecnica e autenticidade de documentos',
    price: 200000, // R$ 2.000,00
    category: 'pericia',
    icon: 'FileCheck',
    features: [
      'Analise de autenticidade',
      'Deteccao de adulteracoes',
      'Comparacao grafotecnica',
      'Laudo tecnico pericial',
    ],
    estimatedDelivery: '7 dias uteis',
    isProductized: true,
  },
  {
    id: 'grafotecnia',
    name: 'Grafotecnia',
    description: 'Exame de assinaturas e manuscritos para comprovacao de autoria',
    price: 180000, // R$ 1.800,00
    category: 'pericia',
    icon: 'FileText',
    features: [
      'Coleta de padroes graficos',
      'Analise comparativa',
      'Laudo grafotecnico',
      'Atuacao como assistente tecnico',
    ],
    estimatedDelivery: '7 dias uteis',
    isProductized: true,
  },
  {
    id: 'laudo-tecnico',
    name: 'Laudo Tecnico',
    description: 'Laudos tecnicos para processos judiciais e extrajudiciais',
    price: 150000, // R$ 1.500,00
    category: 'pericia',
    icon: 'FileText',
    features: [
      'Analise tecnica especializada',
      'Fundamentacao legal',
      'Parecer conclusivo',
      'Defesa em audiencia',
    ],
    estimatedDelivery: '10 dias uteis',
    isProductized: true,
  },

  // Direito Criminal
  {
    id: 'defesa-criminal',
    name: 'Defesa Criminal',
    description: 'Defesa criminal completa em processos e inqueritos',
    price: 250000, // R$ 2.500,00 (preço base - inquérito)
    category: 'criminal',
    icon: 'Scale',
    features: [
      'Analise do inquerito/processo',
      'Estrategia de defesa',
      'Habeas Corpus se cabivel',
      'Acompanhamento de audiencias',
    ],
    estimatedDelivery: '5 dias uteis',
    isProductized: true,
    hasVariants: true,
    variants: [
      {
        id: 'inquerito-policial',
        name: 'Defesa em Inquerito Policial',
        description: 'Defesa tecnica durante investigacao policial',
        price: 250000, // R$ 2.500,00
        features: [
          'Acompanhamento de investigacao',
          'Orientacao em depoimentos',
          'Juntada de provas',
          'Requisi cao de diligencias',
        ],
        estimatedDelivery: '3 dias uteis',
      },
      {
        id: 'processo-criminal',
        name: 'Defesa em Processo Criminal',
        description: 'Defesa completa em acao penal',
        price: 500000, // R$ 5.000,00
        features: [
          'Defesa preliminar',
          'Acompanhamento de audiencias',
          'Apresentacao de provas',
          'Alegacoes finais',
        ],
        estimatedDelivery: '5 dias uteis',
      },
      {
        id: 'recurso-criminal',
        name: 'Recurso Criminal',
        description: 'Apelacao, RESE e outros recursos',
        price: 400000, // R$ 4.000,00
        features: [
          'Analise de sentenca',
          'Elaboracao de recurso',
          'Sustentacao oral',
          'Acompanhamento no tribunal',
        ],
        estimatedDelivery: '7 dias uteis',
      },
      {
        id: 'juri-popular',
        name: 'Defesa em Juri Popular',
        description: 'Defesa especializada em tribunal do juri',
        price: 1000000, // R$ 10.000,00
        features: [
          'Preparacao de defesa',
          'Selecao de jurados',
          'Sustentacao oral no juri',
          'Recursos se necessario',
        ],
        estimatedDelivery: '15 dias uteis',
      },
    ],
  },
  {
    id: 'habeas-corpus',
    name: 'Habeas Corpus',
    description: 'Pedido de liberdade e relaxamento de prisao',
    price: 300000, // R$ 3.000,00
    category: 'criminal',
    icon: 'Shield',
    features: [
      'Analise de legalidade da prisao',
      'Elaboracao de HC urgente',
      'Peticionamento imediato',
      'Sustentacao oral',
    ],
    estimatedDelivery: '24-48 horas',
    isProductized: true,
    hasVariants: true,
    variants: [
      {
        id: 'hc-preventivo',
        name: 'HC Preventivo',
        description: 'Prevencao de prisao antes do mandado',
        price: 300000, // R$ 3.000,00
        estimatedDelivery: '24 horas',
      },
      {
        id: 'hc-liberatorio',
        name: 'HC Liberatorio',
        description: 'Soltura de pessoa presa',
        price: 400000, // R$ 4.000,00
        estimatedDelivery: '24-48 horas',
      },
      {
        id: 'hc-relaxamento',
        name: 'Relaxamento de Prisao',
        description: 'Por prisao ilegal',
        price: 350000, // R$ 3.500,00
        estimatedDelivery: '24 horas',
      },
    ],
  },
  {
    id: 'crimes-economicos',
    name: 'Crimes Economicos',
    description: 'Defesa em estelionato, apropriacao indebita e fraudes',
    price: 400000, // R$ 4.000,00
    category: 'criminal',
    icon: 'BadgeDollarSign',
    features: [
      'Analise contabil',
      'Defesa tecnica especializada',
      'Negociacao de acordos',
      'Reparacao de danos',
    ],
    estimatedDelivery: '7 dias uteis',
    isProductized: true,
  },
  {
    id: 'crimes-honra',
    name: 'Crimes contra a Honra',
    description: 'Defesa em difamacao, calumia e injuria',
    price: 200000, // R$ 2.000,00
    category: 'criminal',
    icon: 'AlertTriangle',
    features: [
      'Analise de provas',
      'Defesa ou queixa-crime',
      'Retratacao',
      'Indenizacao',
    ],
    estimatedDelivery: '5 dias uteis',
    isProductized: true,
  },
  // Direito Aeronautico
  {
    id: 'consultoria-aeronautica',
    name: 'Consultoria Aeronautica',
    description: 'Consultoria e compliance para empresas de aviacao',
    price: 500000, // R$ 5.000,00
    category: 'aeronautico',
    icon: 'Plane',
    features: [
      'Consultoria regulatoria ANAC',
      'Compliance aeronautico',
      'Certificacoes e licencas',
      'Assessoria empresarial aviacao',
    ],
    estimatedDelivery: '10 dias uteis',
    isProductized: true,
  },

  // Automacao Juridica
  {
    id: 'secretaria-remota',
    name: 'Secretaria Remota',
    description: 'Gestao de prazos, peticoes e acompanhamento processual',
    price: 80000, // R$ 800,00/mes
    category: 'automacao',
    icon: 'Users',
    features: [
      'Monitoramento de prazos',
      'Alertas automaticos',
      'Protocolo de peticoes',
      'Relatorios mensais',
    ],
    estimatedDelivery: 'Servico recorrente',
    isProductized: true,
  },
  // Direito Previdenciario
  {
    id: 'aposentadoria',
    name: 'Aposentadoria',
    description: 'Analise e requerimento de aposentadoria junto ao INSS',
    price: 150000, // R$ 1.500,00
    category: 'previdenciario',
    icon: 'Shield',
    features: [
      'Analise de tempo de contribuicao',
      'Simulacao de beneficio',
      'Requerimento administrativo',
      'Acao judicial se negado',
    ],
    estimatedDelivery: '10 dias uteis',
    isProductized: true,
    hasVariants: true,
    variants: [
      {
        id: 'aposentadoria-tempo',
        name: 'Aposentadoria por Tempo de Contribuicao',
        description: 'Aposentadoria por tempo de servico',
        price: 150000, // R$ 1.500,00
        estimatedDelivery: '10 dias uteis',
      },
      {
        id: 'aposentadoria-idade',
        name: 'Aposentadoria por Idade',
        description: 'Aposentadoria por idade minima',
        price: 150000, // R$ 1.500,00
        estimatedDelivery: '10 dias uteis',
      },
      {
        id: 'aposentadoria-especial',
        name: 'Aposentadoria Especial',
        description: 'Insalubridade ou periculosidade',
        price: 200000, // R$ 2.000,00
        estimatedDelivery: '15 dias uteis',
      },
      {
        id: 'aposentadoria-invalidez',
        name: 'Aposentadoria por Invalidez',
        description: 'Incapacidade permanente para o trabalho',
        price: 180000, // R$ 1.800,00
        estimatedDelivery: '10 dias uteis',
      },
      {
        id: 'aposentadoria-rural',
        name: 'Aposentadoria Rural',
        description: 'Trabalhadores rurais',
        price: 180000, // R$ 1.800,00
        estimatedDelivery: '15 dias uteis',
      },
      {
        id: 'aposentadoria-professor',
        name: 'Aposentadoria do Professor',
        description: 'Tempo reduzido para professores',
        price: 150000, // R$ 1.500,00
        estimatedDelivery: '10 dias uteis',
      },
    ],
  },
  {
    id: 'beneficios-inss',
    name: 'Beneficios INSS',
    description: 'Auxilio-doenca, pensao, salario-maternidade e outros',
    price: 120000, // R$ 1.200,00
    category: 'previdenciario',
    icon: 'Heart',
    features: [
      'Analise de requisitos',
      'Requerimento INSS',
      'Acao judicial se negado',
      'Acompanhamento do beneficio',
    ],
    estimatedDelivery: '5 dias uteis',
    isProductized: true,
    hasVariants: true,
    variants: [
      {
        id: 'auxilio-doenca',
        name: 'Auxilio-Doenca',
        description: 'Beneficio por incapacidade temporaria',
        price: 120000, // R$ 1.200,00
        estimatedDelivery: '5 dias uteis',
      },
      {
        id: 'auxilio-acidente',
        name: 'Auxilio-Acidente',
        description: 'Indenizacao por sequela',
        price: 150000, // R$ 1.500,00
        estimatedDelivery: '7 dias uteis',
      },
      {
        id: 'pensao-morte',
        name: 'Pensao por Morte',
        description: 'Beneficio para dependentes',
        price: 150000, // R$ 1.500,00
        estimatedDelivery: '7 dias uteis',
      },
      {
        id: 'salario-maternidade',
        name: 'Salario-Maternidade',
        description: 'Beneficio maternidade',
        price: 100000, // R$ 1.000,00
        estimatedDelivery: '5 dias uteis',
      },
      {
        id: 'auxilio-reclusao',
        name: 'Auxilio-Reclusao',
        description: 'Beneficio para dependentes de preso',
        price: 120000, // R$ 1.200,00
        estimatedDelivery: '7 dias uteis',
      },
    ],
  },
  {
    id: 'revisao-beneficio',
    name: 'Revisao de Beneficio',
    description: 'Revisao de aposentadoria e outros beneficios',
    price: 200000, // R$ 2.000,00
    category: 'previdenciario',
    icon: 'RefreshCw',
    features: [
      'Analise de calculo',
      'Identificacao de erros',
      'Acao de revisao',
      'Recuperacao de atrasados',
    ],
    estimatedDelivery: '10 dias uteis',
    isProductized: true,
    hasVariants: true,
    variants: [
      {
        id: 'revisao-vida-toda',
        name: 'Revisao da Vida Toda',
        description: 'Inclusao de salarios pre-1994',
        price: 250000, // R$ 2.500,00
        estimatedDelivery: '15 dias uteis',
      },
      {
        id: 'revisao-teto',
        name: 'Revisao do Teto',
        description: 'Aplicacao correta do teto',
        price: 200000, // R$ 2.000,00
        estimatedDelivery: '10 dias uteis',
      },
      {
        id: 'revisao-dib',
        name: 'Revisao da DIB',
        description: 'Melhor data de inicio',
        price: 200000, // R$ 2.000,00
        estimatedDelivery: '10 dias uteis',
      },
      {
        id: 'revisao-atividade-especial',
        name: 'Revisao de Atividade Especial',
        description: 'Inclusao de tempo especial',
        price: 250000, // R$ 2.500,00
        estimatedDelivery: '15 dias uteis',
      },
    ],
  },
  {
    id: 'planejamento-previdenciario',
    name: 'Planejamento Previdenciario',
    description: 'Consultoria para melhor aposentadoria',
    price: 80000, // R$ 800,00
    category: 'previdenciario',
    icon: 'Calculator',
    features: [
      'Analise completa do historico',
      'Simulacao de cenarios',
      'Estrategia de contribuicao',
      'Orientacao ate aposentadoria',
    ],
    estimatedDelivery: '5 dias uteis',
    isProductized: true,
  },
]

// Alias para compatibilidade
export const SERVICES = SOLUTIONS

export function getSolutionById(id: string): Solution | undefined {
  return SOLUTIONS.find((solution) => solution.id === id)
}

// Busca variante específica de um produto
export function getSolutionVariant(productId: string, variantId: string): SolutionVariant | undefined {
  const solution = getSolutionById(productId)
  if (!solution || !solution.variants) return undefined
  return solution.variants.find((v) => v.id === variantId)
}

// Retorna preço correto (variante ou produto base)
export function getSolutionPrice(productId: string, variantId?: string): number {
  if (variantId) {
    const variant = getSolutionVariant(productId, variantId)
    if (variant) return variant.price
  }
  const solution = getSolutionById(productId)
  return solution?.price || 0
}

// Retorna nome completo (produto + variante se houver)
export function getSolutionFullName(productId: string, variantId?: string): string {
  const solution = getSolutionById(productId)
  if (!solution) return ''

  if (variantId) {
    const variant = getSolutionVariant(productId, variantId)
    if (variant) return `${solution.name} - ${variant.name}`
  }

  return solution.name
}

// Alias para compatibilidade
export const getServiceById = getSolutionById

export function formatCurrency(cents: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(cents / 100)
}
