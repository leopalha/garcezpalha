/**
 * Checkout Types
 * Tipos para o sistema de checkout e pagamentos
 * Catalogo unificado de solucoes juridicas
 */

export type SolutionCategory =
  | 'financeiro'
  | 'patrimonial'
  | 'saude'
  | 'pericia'
  | 'criminal'
  | 'automacao'

export interface Solution {
  id: string
  name: string
  description: string
  price: number
  category: SolutionCategory
  icon: string
  features: string[]
  estimatedDelivery?: string
  isProductized?: boolean // Produto estruturado vs servico tradicional
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

  // Protecao Financeira
  {
    id: 'desbloqueio-conta',
    name: 'Desbloqueio de Conta',
    description: 'Acao judicial para desbloqueio de conta bancaria ou poupanca',
    price: 150000, // R$ 1.500,00
    category: 'financeiro',
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
    category: 'financeiro',
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
    category: 'financeiro',
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
    category: 'financeiro',
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

  // Protecao Patrimonial
  {
    id: 'direito-imobiliario',
    name: 'Direito Imobiliario',
    description: 'Assessoria completa em transacoes imobiliarias',
    price: 150000, // R$ 1.500,00
    category: 'patrimonial',
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
    category: 'patrimonial',
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
    category: 'patrimonial',
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
    category: 'patrimonial',
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
    category: 'patrimonial',
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
    category: 'patrimonial',
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

  // Protecao de Saude
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

  // Defesa Criminal
  {
    id: 'direito-criminal',
    name: 'Direito Criminal',
    description: 'Defesa criminal completa em processos e inqueritos',
    price: 250000, // R$ 2.500,00
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
  },
  {
    id: 'direito-aeronautico',
    name: 'Direito Aeronautico',
    description: 'Assessoria juridica especializada em aviacao',
    price: 300000, // R$ 3.000,00
    category: 'criminal',
    icon: 'Plane',
    features: [
      'Consultoria regulatoria (ANAC)',
      'Acidentes e incidentes',
      'Licencas e certificados',
      'Defesa administrativa',
    ],
    estimatedDelivery: '7 dias uteis',
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
  {
    id: 'aposentadoria',
    name: 'Aposentadoria',
    description: 'Analise e requerimento de aposentadoria junto ao INSS',
    price: 150000, // R$ 1.500,00
    category: 'automacao',
    icon: 'Shield',
    features: [
      'Analise de tempo de contribuicao',
      'Simulacao de beneficio',
      'Requerimento administrativo',
      'Acao judicial se negado',
    ],
    estimatedDelivery: '10 dias uteis',
    isProductized: true,
  },
]

// Alias para compatibilidade
export const SERVICES = SOLUTIONS

export function getSolutionById(id: string): Solution | undefined {
  return SOLUTIONS.find((solution) => solution.id === id)
}

// Alias para compatibilidade
export const getServiceById = getSolutionById

export function formatCurrency(cents: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(cents / 100)
}
