/**
 * VSL Page Configuration
 * Customization data for each product VSL page
 */

export interface VSLConfig {
  heroColor: 'blue' | 'green' | 'red' | 'purple' | 'orange'
  heroIcon: string
  agitationPoints: string[]
  solutionSteps: string[]
  urgencyMessage: string
  guaranteeTitle: string
  guaranteeDescription: string
  stats: {
    years: number
    cases: number
    successRate: number
    clients: number
  }
}

/**
 * Default VSL configuration
 */
export const DEFAULT_VSL_CONFIG: VSLConfig = {
  heroColor: 'blue',
  heroIcon: 'Shield',
  agitationPoints: [
    "Problemas legais consomem seu tempo e dinheiro",
    "Empresas dificultam a resolução de conflitos",
    "Falta de conhecimento jurídico deixa você vulnerável",
    "Processos complexos geram ansiedade e incerteza",
    "Sem apoio profissional, seus direitos ficam em risco"
  ],
  solutionSteps: [
    "Análise gratuita do seu caso",
    "Estratégia jurídica personalizada",
    "Notificação extrajudicial",
    "Ação judicial se necessário",
    "Acompanhamento até resolução",
    "Garantia de resultado"
  ],
  urgencyMessage: "⚡ Atendimento prioritário - Análise gratuita do seu caso",
  guaranteeTitle: "Garantia de Resultado",
  guaranteeDescription: "Trabalhamos com honorários de êxito. Só cobramos se você ganhar.",
  stats: {
    years: 10,
    cases: 300,
    successRate: 85,
    clients: 250,
  }
}

/**
 * Product-specific VSL configurations
 * Overrides for specific products
 */
export const VSL_CONFIGS: Record<string, Partial<VSLConfig>> = {
  // ============== BANCÁRIO ==============
  'fraude-consignado': {
    heroColor: 'blue',
    agitationPoints: [
      "Tarifas e juros abusivos consomem seu dinheiro sem você perceber",
      "Contratos bancários complexos escondem cobranças ilegais",
      "Bancos dificultam portabilidade e revisão de contratos",
      "Seguros embutidos sem autorização geram prejuízos",
      "Falta de transparência mantém você pagando mais"
    ],
    solutionSteps: [
      "Análise detalhada do contrato e extratos bancários",
      "Identificação de cobranças ilegais e juros abusivos",
      "Cálculo de valores a restituir",
      "Notificação extrajudicial ao banco",
      "Ação judicial para restituição em dobro",
      "Acompanhamento até recuperação total"
    ],
  },

  'seguro-prestamista': {
    heroColor: 'blue',
    agitationPoints: [
      "Seguro prestamista embutido sem autorização (venda casada)",
      "Bancos cobram seguro desnecessário em empréstimos",
      "Valores mensais despercebidos que acumulam prejuízo",
      "Direito à restituição em DOBRO (Art 42 CDC)",
      "Jurisprudência consolidada favorável (STJ Tema 972)"
    ],
    solutionSteps: [
      "Análise gratuita do contrato de empréstimo",
      "Identificação do seguro prestamista indevido",
      "Cálculo da restituição em DOBRO",
      "Ação no Juizado Especial (sem custas)",
      "Pedido de danos morais (R$ 3k-5k)",
      "Acompanhamento até pagamento"
    ],
  },

  'revisao-contrato-bancario': {
    heroColor: 'blue',
    agitationPoints: [
      "Tarifas ilegais (TAC, TEC) cobradas indevidamente",
      "Juros abusivos acima do permitido por lei",
      "CET (Custo Efetivo Total) divergente do contratado",
      "Capitalização de juros ilegal",
      "Falta de transparência nos contratos bancários"
    ],
    solutionSteps: [
      "Análise técnica do contrato e extratos",
      "Identificação de ilegalidades (TAC, TEC, juros)",
      "Cálculo de valores a restituir",
      "Revisão judicial do contrato",
      "Restituição de valores pagos a mais",
      "Redução de parcelas futuras"
    ],
  },

  'cartao-consignado-rmc': {
    heroColor: 'blue',
    agitationPoints: [
      "Cartão consignado com RMC (Reserva de Margem Consignável) abusiva",
      "Descontos mensais sem utilização do cartão",
      "Dificuldade para cancelar o cartão e estornar valores",
      "Bancos se recusam a devolver valores da RMC",
      "Aposentados e pensionistas prejudicados"
    ],
    solutionSteps: [
      "Análise do contrato de cartão consignado",
      "Identificação da RMC abusiva",
      "Cancelamento do cartão",
      "Ação para estorno da RMC",
      "Restituição em DOBRO dos valores",
      "Danos morais se idoso ou vulnerável"
    ],
  },

  'portabilidade-credito': {
    heroColor: 'blue',
    agitationPoints: [
      "Banco dificulta a portabilidade de crédito",
      "Taxas abusivas para transferência",
      "Demora injustificada no processo",
      "Perda de oportunidade de juros menores",
      "Direito à livre escolha de instituição financeira"
    ],
    solutionSteps: [
      "Análise da proposta de portabilidade",
      "Notificação ao banco recalcitrante",
      "Ação judicial para compelir portabilidade",
      "Pedido de danos morais",
      "Conclusão forçada da portabilidade",
      "Indenização por atraso"
    ],
  },

  // ============== CONSUMIDOR ==============
  'atraso-entrega': {
    heroColor: 'green',
    agitationPoints: [
      "Produtos com defeito e loja se recusa a trocar",
      "Entrega atrasada sem previsão ou compensação",
      "Assinaturas digitais impossíveis de cancelar",
      "Promessas não cumpridas em compras",
      "Empresa ignora seus direitos como consumidor"
    ],
    solutionSteps: [
      "Análise da compra, nota fiscal e garantia",
      "Protocolo no Procon",
      "Notificação à empresa",
      "Ação no JEC (sem custas iniciais)",
      "Restituição, troca ou abatimento",
      "Danos morais se produto essencial"
    ],
  },

  'produto-defeituoso': {
    heroColor: 'green',
    agitationPoints: [
      "Produto novo apresentou defeito logo após compra",
      "Loja/fabricante se recusa a trocar ou consertar",
      "Prazo de garantia não é respeitado",
      "Assistência técnica demora meses sem resolver",
      "Produto essencial parado prejudica sua rotina"
    ],
    solutionSteps: [
      "Análise da nota fiscal e termo de garantia",
      "Notificação extrajudicial à loja/fabricante",
      "Protocolo no Procon",
      "Ação judicial para troca ou restituição",
      "Pedido de danos morais se produto essencial",
      "Execução forçada da sentença"
    ],
  },

  'assinaturas-digitais': {
    heroColor: 'green',
    agitationPoints: [
      "Assinatura digital impossível de cancelar",
      "Cobranças mesmo após pedido de cancelamento",
      "Empresa dificulta acesso ao suporte",
      "Reembolso negado sem justificativa",
      "Práticas abusivas de renovação automática"
    ],
    solutionSteps: [
      "Análise do contrato de assinatura",
      "Tentativa de cancelamento amigável",
      "Notificação formal à empresa",
      "Chargeback no cartão se necessário",
      "Ação judicial para cancelamento + danos morais",
      "Restituição de valores cobrados indevidamente"
    ],
  },

  // ============== TRABALHISTA ==============
  'horas-extras': {
    heroColor: 'orange',
    agitationPoints: [
      "Horas extras não pagas ou mal calculadas",
      "Trabalho em finais de semana e feriados sem adicional",
      "Jornada excessiva sem compensação",
      "Banco de horas irregular",
      "Direitos trabalhistas desrespeitados"
    ],
    solutionSteps: [
      "Análise dos holerites e jornada de trabalho",
      "Cálculo das horas extras devidas",
      "Tentativa de acordo extrajudicial",
      "Reclamação trabalhista na Justiça do Trabalho",
      "Pedido de verbas rescisórias corrigidas",
      "Execução da sentença"
    ],
  },

  'verbas-rescisoria': {
    heroColor: 'orange',
    agitationPoints: [
      "Demissão sem justa causa e verbas não pagas",
      "Aviso prévio não indenizado",
      "FGTS não depositado corretamente",
      "Multa de 40% do FGTS não paga",
      "Saldo de salário e férias proporcionais retidos"
    ],
    solutionSteps: [
      "Análise do termo de rescisão e documentos",
      "Cálculo das verbas devidas",
      "Notificação ao empregador",
      "Reclamação trabalhista",
      "Pedido de correção monetária e juros",
      "Execução forçada do pagamento"
    ],
  },

  // ============== PREVIDENCIÁRIO ==============
  'beneficio-negado': {
    heroColor: 'purple',
    agitationPoints: [
      "Benefício do INSS negado sem justificativa clara",
      "Perícia médica superficial ignorou seu estado de saúde",
      "Incapacidade para trabalho não reconhecida",
      "Documentos médicos ignorados pelo perito",
      "Sem renda para sustento enquanto aguarda"
    ],
    solutionSteps: [
      "Análise do processo administrativo (NB)",
      "Levantamento de provas médicas",
      "Ação judicial para concessão do benefício",
      "Nova perícia médica judicial",
      "Antecipação de tutela (receber enquanto processo)",
      "Retroativo desde o requerimento administrativo"
    ],
  },

  'revisao-aposentadoria': {
    heroColor: 'purple',
    agitationPoints: [
      "Aposentadoria calculada errado pelo INSS",
      "Tempo de contribuição não computado",
      "Salários de contribuição desconsiderados",
      "Benefício inferior ao que tem direito",
      "INSS dificulta a revisão administrativa"
    ],
    solutionSteps: [
      "Análise do CNIS e carta de concessão",
      "Identificação de períodos não computados",
      "Cálculo do valor correto do benefício",
      "Requerimento administrativo de revisão",
      "Ação judicial se INSS negar",
      "Pagamento retroativo dos últimos 5 anos"
    ],
  },

  'auxilio-acidente': {
    heroColor: 'purple',
    agitationPoints: [
      "Acidente de trabalho ou doença ocupacional",
      "Sequela permanente que reduz capacidade laboral",
      "INSS nega auxílio-acidente indevidamente",
      "Perícia não reconheceu nexo causal",
      "Sem compensação pela redução de capacidade"
    ],
    solutionSteps: [
      "Análise de CAT e documentos médicos",
      "Prova do nexo causal (trabalho → doença/acidente)",
      "Laudo técnico pericial",
      "Ação judicial para concessão do auxílio-acidente",
      "Cumulação com aposentadoria",
      "Retroativo desde o requerimento"
    ],
  },

  // ============== DIGITAL/TELECOM ==============
  'cobranca-telefonia': {
    heroColor: 'blue',
    agitationPoints: [
      "Cobranças indevidas em conta de telefone/internet",
      "Serviços não contratados aparecem na fatura",
      "Valores muito acima do contratado",
      "Operadora dificulta contestação",
      "Ameaça de negativação por cobrança indevida"
    ],
    solutionSteps: [
      "Análise das faturas e contrato",
      "Identificação de cobranças ilegais",
      "Protocolo na Anatel",
      "Notificação à operadora",
      "Ação judicial para restituição em DOBRO",
      "Danos morais se houve negativação"
    ],
  },

  'multa-fidelidade': {
    heroColor: 'blue',
    agitationPoints: [
      "Multa de fidelidade abusiva ao cancelar serviço",
      "Operadora não informou sobre fidelização",
      "Cláusula abusiva no contrato",
      "Direito de arrependimento não respeitado",
      "Cobrança desproporcional"
    ],
    solutionSteps: [
      "Análise do contrato e termo de adesão",
      "Verificação de cláusulas abusivas",
      "Notificação para cancelamento sem multa",
      "Ação no JEC para anular multa",
      "Restituição se já foi paga",
      "Danos morais se negativação"
    ],
  },

  // ============== CONDOMÍNIO ==============
  'cobranca-condominial': {
    heroColor: 'blue',
    agitationPoints: [
      "Cobrança de taxa de condomínio abusiva",
      "Rateio de despesas incorreto",
      "Obras sem aprovação em assembleia",
      "Multas e juros desproporcionais",
      "Falta de transparência nas contas"
    ],
    solutionSteps: [
      "Análise das atas de assembleia e balancetes",
      "Identificação de cobranças ilegais",
      "Contestação administrativa",
      "Ação de prestação de contas",
      "Redução ou anulação de cobrança",
      "Restituição de valores pagos a mais"
    ],
  },

  // ============== SERVIDOR PÚBLICO ==============
  'diferencas-salariais': {
    heroColor: 'blue',
    agitationPoints: [
      "Reajuste salarial não aplicado corretamente",
      "Gratificações não pagas ou calculadas errado",
      "Progressão funcional negada indevidamente",
      "Diferenças acumuladas há anos",
      "Órgão público dificulta correção"
    ],
    solutionSteps: [
      "Análise de holerites e legislação aplicável",
      "Cálculo das diferenças devidas",
      "Requerimento administrativo",
      "Ação judicial se negativa",
      "Pagamento retroativo dos últimos 5 anos",
      "Correção para parcelas futuras"
    ],
  },

  'incorporacao-gratificacao': {
    heroColor: 'blue',
    agitationPoints: [
      "Gratificação paga há anos não incorporada aos proventos",
      "Quinquênio, sexta-parte não incorporados",
      "Aposentadoria calculada sem as gratificações devidas",
      "Perda de valores significativos mensalmente",
      "Direito adquirido não respeitado"
    ],
    solutionSteps: [
      "Análise da legislação e tempo de percepção",
      "Comprovação do direito adquirido",
      "Requerimento administrativo de incorporação",
      "Ação judicial mandamental",
      "Incorporação definitiva aos proventos",
      "Pagamento das diferenças retroativas"
    ],
  },

  // ============== EDUCAÇÃO ==============
  'mensalidade-escolar': {
    heroColor: 'green',
    agitationPoints: [
      "Reajuste de mensalidade escolar abusivo",
      "Aumento acima da inflação sem justificativa",
      "Cobrança de taxa de matrícula ilegal",
      "Serviços não prestados durante a pandemia",
      "Material didático supervalorizado"
    ],
    solutionSteps: [
      "Análise do contrato de prestação de serviços",
      "Verificação de reajuste dentro do permitido",
      "Notificação ao Procon",
      "Ação para revisão de mensalidade",
      "Restituição de valores pagos a mais",
      "Indenização por danos morais se abuso grave"
    ],
  },
}

/**
 * Get VSL config for a product
 * Merges product-specific config with defaults
 */
export function getVSLConfig(productSlug: string): VSLConfig {
  const customConfig = VSL_CONFIGS[productSlug] || {}
  return {
    ...DEFAULT_VSL_CONFIG,
    ...customConfig,
  }
}
