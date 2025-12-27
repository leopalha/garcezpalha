/**
 * Product Catalog - Garcez Palha
 * Complete catalog of all legal services/products
 *
 * TOTAL: 47 produtos (25 existentes + 22 novos)
 */

import type { Product } from './types'

// ============================================================================
// CATEGORIA A: BANCÁRIO/FINANCEIRO (4 novos produtos)
// ============================================================================

export const PRODUTO_SEGURO_PRESTAMISTA: Product = {
  id: 'seguro-prestamista',
  name: 'Restituição de Seguro Prestamista',
  slug: 'seguro-prestamista',
  category: 'bancario',
  description: 'Seguro embutido no empréstimo sem autorização (venda casada). Restituição em dobro + danos morais.',
  price: { basic: 1500, complete: 2000 },
  successFee: 0.30,
  timeline: '3-6 meses',
  documents: ['Contrato de empréstimo', 'Extrato bancário', 'RG/CPF', 'Comprovante de residência'],
  keywords: [
    'seguro prestamista',
    'venda casada',
    'restituição seguro',
    'empréstimo consignado',
    'seguro obrigatório',
    'art 42 cdc',
    'tema 972 stj',
  ],
  priority: 5,
  automation: 90,
  demandPerMonth: 20000,
  features: [
    'Restituição em DOBRO do valor pago',
    'Danos morais R$ 3.000 a R$ 5.000',
    'Jurisprudência consolidada (STJ Tema 972)',
    'Análise gratuita do contrato',
    'Processo no JEC (sem custas iniciais)',
  ],
  crossSell: ['cartao-consignado-rmc', 'superendividamento', 'revisao-contrato-bancario'],
  isActive: true,
}

export const PRODUTO_REVISAO_CONTRATO_BANCARIO: Product = {
  id: 'revisao-contrato-bancario',
  name: 'Revisão de Contrato Bancário',
  slug: 'revisao-contrato-bancario',
  category: 'bancario',
  description: 'Identificação e restituição de tarifas ilegais (TAC, TEC) e juros abusivos em contratos bancários.',
  price: { basic: 2000, complete: 2500 },
  successFee: 0.25,
  timeline: '4-8 meses',
  documents: ['Contrato completo', 'Extratos bancários', 'Carnês/boletos', 'RG/CPF'],
  keywords: [
    'revisão contrato bancário',
    'tac tec ilegal',
    'juros abusivos',
    'reduzir parcela empréstimo',
    'calculadora jurídica',
    'taxa bacen',
  ],
  priority: 4,
  automation: 85,
  demandPerMonth: 15000,
  features: [
    'Análise com calculadora jurídica profissional',
    'Identificação de TAC, TEC, IOF financiado',
    'Comparação com taxa média BACEN',
    'Restituição em dobro das tarifas',
    'Redução do saldo devedor',
    'Recálculo de parcelas',
  ],
  crossSell: ['seguro-prestamista', 'portabilidade-credito'],
  isActive: true,
}

export const PRODUTO_PORTABILIDADE_CREDITO: Product = {
  id: 'portabilidade-credito',
  name: 'Portabilidade de Crédito Negada',
  slug: 'portabilidade-credito',
  category: 'bancario',
  description: 'Banco impede portabilidade de empréstimo para outra instituição com taxa menor.',
  price: { basic: 1500 },
  successFee: 0,
  timeline: '30-60 dias',
  documents: ['Contrato atual', 'Proposta novo banco', 'Protocolos de tentativa', 'RG/CPF'],
  keywords: [
    'portabilidade crédito negada',
    'banco não deixa portabilidade',
    'trocar banco empréstimo',
    'resolução bacen 4292',
  ],
  priority: 4,
  automation: 90,
  demandPerMonth: 8000,
  features: [
    'Notificação extrajudicial ao banco',
    'Reclamação formal ao BACEN',
    'Ação judicial se necessário',
    'Indenização por recusa injustificada',
    'Resolução em 30-60 dias',
  ],
  crossSell: ['revisao-contrato-bancario'],
  isActive: true,
}

export const PRODUTO_FRAUDE_CONSIGNADO: Product = {
  id: 'fraude-consignado',
  name: 'Fraude em Empréstimo Consignado',
  slug: 'fraude-consignado',
  category: 'bancario',
  description: 'Empréstimo feito no seu nome sem autorização. Cancelamento + devolução + indenização.',
  price: { basic: 2500, complete: 3000 },
  successFee: 0.30,
  timeline: '3-6 meses',
  documents: ['Extrato com desconto', 'Boletim de ocorrência', 'RG/CPF', 'Comprovante de residência'],
  keywords: [
    'fraude empréstimo consignado',
    'empréstimo que não fiz',
    'desconto indevido inss',
    'golpe consignado',
    'cancelar empréstimo fraudulento',
  ],
  priority: 5,
  automation: 85,
  demandPerMonth: 25000,
  features: [
    'Atendimento de emergência',
    'Liminar para parar descontos (5-15 dias)',
    'Cancelamento do empréstimo',
    'Devolução de tudo descontado',
    'Danos morais R$ 5.000 a R$ 15.000',
    'Responsabilidade objetiva do banco',
  ],
  crossSell: ['desbloqueio-conta', 'golpe-pix'],
  isActive: true,
}

// ============================================================================
// CATEGORIA B: TELECOMUNICAÇÕES (3 novos produtos)
// ============================================================================

export const PRODUTO_COBRANCA_TELEFONIA: Product = {
  id: 'cobranca-telefonia',
  name: 'Cobrança Indevida Telefonia/Internet',
  slug: 'cobranca-telefonia',
  category: 'telecom',
  description: 'Operadora cobra serviços não contratados (SVA, planos alterados, faturas acima do contratado).',
  price: { basic: 1500 },
  successFee: 0.25,
  timeline: '2-4 meses',
  documents: ['Faturas', 'Prints do plano contratado', 'Protocolos', 'RG/CPF'],
  keywords: [
    'cobrança indevida operadora',
    'vivo claro tim oi',
    'sva telefone',
    'serviço não contratado',
    'fatura alta celular',
  ],
  priority: 5,
  automation: 95,
  demandPerMonth: 30000,
  features: [
    'Cancelamento das cobranças',
    'Restituição em DOBRO',
    'Danos morais se negativou (R$ 3.000-10.000)',
    'Processo no JEC (rápido)',
    'Volume gigante - todo mundo tem celular',
  ],
  crossSell: ['negativacao-indevida', 'assinaturas-digitais'],
  isActive: true,
}

export const PRODUTO_MULTA_FIDELIDADE: Product = {
  id: 'multa-fidelidade',
  name: 'Multa de Fidelidade Abusiva',
  slug: 'multa-fidelidade',
  category: 'telecom',
  description: 'Operadora cobra multa para cancelar mas o serviço é ruim (internet lenta, quedas, falhas).',
  price: { basic: 1500 },
  successFee: 0,
  timeline: '2-3 meses',
  documents: ['Contrato fidelidade', 'Testes de velocidade', 'Protocolos de reclamação', 'RG/CPF'],
  keywords: [
    'multa fidelidade abusiva',
    'cancelar sem multa',
    'internet lenta quer cancelar',
    'serviço ruim operadora',
  ],
  priority: 4,
  automation: 90,
  demandPerMonth: 15000,
  features: [
    'Cancelamento SEM multa',
    'Restituição se já pagou',
    'Danos morais se negativou',
    'Anatel proíbe multa quando serviço falha',
  ],
  crossSell: ['cobranca-telefonia', 'portabilidade-numero'],
  isActive: true,
}

export const PRODUTO_PORTABILIDADE_NUMERO: Product = {
  id: 'portabilidade-numero',
  name: 'Portabilidade de Número Negada',
  slug: 'portabilidade-numero',
  category: 'telecom',
  description: 'Operadora cria obstáculos ou perde número durante migração entre operadoras.',
  price: { basic: 1500 },
  successFee: 0.25,
  timeline: '30-60 dias',
  documents: ['Protocolo portabilidade', 'Prints/emails', 'RG/CPF'],
  keywords: [
    'portabilidade número negada',
    'perdeu número portabilidade',
    'operadora não libera',
  ],
  priority: 3,
  automation: 90,
  demandPerMonth: 10000,
  features: [
    'Notificação às operadoras',
    'Reclamação na Anatel',
    'Recuperação do número',
    'Danos morais R$ 2.000-5.000',
    'Prazo legal: 3 dias úteis',
  ],
  crossSell: ['cobranca-telefonia', 'multa-fidelidade'],
  isActive: true,
}

// ============================================================================
// CATEGORIA C: ENERGIA ELÉTRICA (1 novo produto)
// ============================================================================

export const PRODUTO_COBRANCA_ENERGIA: Product = {
  id: 'cobranca-energia',
  name: 'Cobrança Indevida de Energia',
  slug: 'cobranca-energia',
  category: 'energia',
  description: 'Consumo estimado, troca de medidor com cobrança retroativa, débitos prescritos, corte indevido.',
  price: { basic: 1500 },
  successFee: 0.25,
  timeline: '3-6 meses',
  documents: ['Contas de luz', 'Histórico de consumo', 'Notificações', 'RG/CPF'],
  keywords: [
    'cobrança indevida energia',
    'conta luz alta',
    'consumo estimado',
    'corte luz indevido',
  ],
  priority: 3,
  automation: 85,
  demandPerMonth: 10000,
  features: [
    'Questionamento de consumo estimado',
    'Prescrição de débitos (+5 anos)',
    'Revisão de troca de medidor',
    'Restituição de corte indevido',
  ],
  crossSell: [],
  isActive: true,
}

// ============================================================================
// CATEGORIA D: CONSUMIDOR GERAL (5 novos produtos)
// ============================================================================

export const PRODUTO_DISTRATO_IMOBILIARIO: Product = {
  id: 'distrato-imobiliario',
  name: 'Distrato Imobiliário',
  slug: 'distrato-imobiliario',
  category: 'consumidor',
  description: 'Desistência de imóvel na planta. Devolução de até 75% ou 100% se culpa da construtora.',
  price: { basic: 3000, complete: 4000 },
  successFee: 0.20,
  timeline: '4-8 meses',
  documents: ['Contrato compra', 'Comprovantes de pagamento', 'Comunicações', 'RG/CPF'],
  keywords: [
    'distrato imobiliário',
    'cancelar imóvel planta',
    'devolver dinheiro construtora',
    'atraso entrega imóvel',
  ],
  priority: 5,
  automation: 80,
  demandPerMonth: 15000,
  features: [
    'Devolução de até 75% (Lei 13.786/2018)',
    'Se culpa construtora: 100% + perdas',
    'Danos morais por atraso',
    'Ticket alto - valores grandes',
  ],
  crossSell: ['usucapiao', 'inventario'],
  isActive: true,
}

export const PRODUTO_ASSINATURAS_DIGITAIS: Product = {
  id: 'assinaturas-digitais',
  name: 'Assinaturas Digitais Indevidas',
  slug: 'assinaturas-digitais',
  category: 'digital',
  description: 'Streaming/apps cobrando após cancelamento, renovação automática sem aviso, dificuldade de cancelar.',
  price: { basic: 1500 },
  successFee: 0.25,
  timeline: '2-4 meses',
  documents: ['Extratos cartão', 'Prints de cancelamento', 'Emails', 'RG/CPF'],
  keywords: [
    'assinatura digital indevida',
    'netflix spotify cobrando',
    'cancelei mas cobra',
    'trial virou cobrança',
  ],
  priority: 5,
  automation: 95,
  demandPerMonth: 20000,
  features: [
    'Cancelamento imediato',
    'Restituição em dobro',
    'Danos morais se negativou',
    'Todo mundo tem assinaturas',
    'Resolve rápido no JEC',
  ],
  crossSell: ['negativacao-indevida', 'cobranca-telefonia'],
  isActive: true,
}

export const PRODUTO_OVERBOOKING_VOO: Product = {
  id: 'overbooking-voo',
  name: 'Overbooking/Problemas com Voo',
  slug: 'overbooking-voo',
  category: 'aereo',
  description: 'Overbooking, voo cancelado, atraso +4h, perda de bagagem, perda de compromisso.',
  price: { basic: 2000 },
  successFee: 0.25,
  timeline: '3-6 meses',
  documents: ['Bilhete aéreo', 'Boarding pass', 'Protocolos', 'Comprovantes despesas', 'RG/CPF'],
  keywords: [
    'overbooking',
    'voo cancelado indenização',
    'atraso voo',
    'bagagem extraviada',
  ],
  priority: 4,
  automation: 90,
  demandPerMonth: 25000,
  features: [
    'Danos morais R$ 1.000-5.000',
    'Danos materiais (hotel, alimentação)',
    'Reembolso da passagem',
    'Resolução ANAC 400 + CDC',
  ],
  crossSell: [],
  isActive: true,
}

export const PRODUTO_PRODUTO_VICIO: Product = {
  id: 'produto-vicio',
  name: 'Produto com Vício (Não Troca)',
  slug: 'produto-vicio',
  category: 'consumidor',
  description: 'Produto com defeito e loja não troca. Assistência não resolve em 30 dias.',
  price: { basic: 1500 },
  successFee: 0.25,
  timeline: '2-4 meses',
  documents: ['Nota fiscal', 'Garantia', 'Protocolos assistência', 'Fotos/vídeos defeito', 'RG/CPF'],
  keywords: [
    'produto defeito loja não troca',
    'celular com defeito',
    'eletrodoméstico quebrado',
    'art 18 cdc',
  ],
  priority: 4,
  automation: 90,
  demandPerMonth: 40000,
  features: [
    'Troca por outro igual',
    'Restituição do valor',
    'Abatimento proporcional',
    'Danos morais se transtorno grave',
    'Processo no JEC',
  ],
  crossSell: ['atraso-entrega'],
  isActive: true,
}

export const PRODUTO_ATRASO_ENTREGA: Product = {
  id: 'atraso-entrega',
  name: 'Atraso na Entrega',
  slug: 'atraso-entrega',
  category: 'consumidor',
  description: 'Comprou online e não chegou no prazo. Presente para data específica, móvel essencial.',
  price: { basic: 1500 },
  successFee: 0.25,
  timeline: '2-3 meses',
  documents: ['Comprovante compra', 'Prints anúncio', 'Rastreio', 'Protocolos', 'RG/CPF'],
  keywords: [
    'atraso entrega',
    'comprei não chegou',
    'presente não chegou',
    'art 35 cdc',
  ],
  priority: 4,
  automation: 95,
  demandPerMonth: 35000,
  features: [
    'Cumprimento forçado da entrega',
    'Cancelamento + reembolso',
    'Danos morais (presente/data)',
    'Processo rápido no JEC',
  ],
  crossSell: ['produto-vicio'],
  isActive: true,
}

// ============================================================================
// CATEGORIA E: PREVIDENCIÁRIO (3 novos produtos)
// ============================================================================

export const PRODUTO_REVISAO_APOSENTADORIA: Product = {
  id: 'revisao-aposentadoria',
  name: 'Revisão de Aposentadoria',
  slug: 'revisao-aposentadoria',
  category: 'previdenciario',
  description: 'Atividade especial não reconhecida, período não computado, erro de cálculo do INSS.',
  price: { basic: 2000, complete: 2500 },
  successFee: 0.20,
  timeline: '6-12 meses',
  documents: ['Carta concessão', 'CNIS', 'PPP/LTCAT', 'Contratos trabalho', 'RG/CPF'],
  keywords: [
    'revisão aposentadoria',
    'atividade especial',
    'erro cálculo inss',
    'vida toda',
  ],
  priority: 4,
  automation: 80,
  demandPerMonth: 30000,
  features: [
    'Análise GRATUITA com calculadora',
    'Aumento no valor mensal',
    'Atrasados de até 5 anos',
    'Teses consolidadas',
  ],
  crossSell: ['auxilio-acidente', 'bpc-loas'],
  isActive: true,
}

export const PRODUTO_BENEFICIO_NEGADO: Product = {
  id: 'beneficio-negado',
  name: 'Benefício Negado/Cortado',
  slug: 'beneficio-negado',
  category: 'previdenciario',
  description: 'Auxílio-doença negado, aposentadoria negada, benefício cortado na perícia, BPC/LOAS cessado.',
  price: { basic: 2000, complete: 2500 },
  successFee: 0.25,
  timeline: '4-8 meses',
  documents: ['Negativa INSS', 'Laudos médicos', 'Exames', 'Atestados', 'RG/CPF'],
  keywords: [
    'inss negou benefício',
    'auxílio doença negado',
    'benefício cortado',
    'reverter decisão inss',
  ],
  priority: 5,
  automation: 85,
  demandPerMonth: 40000,
  features: [
    'Cliente DESESPERADO - fecha rápido',
    'Atrasados podem ser ALTOS',
    'Nova perícia médica',
    'Tutela antecipada possível',
  ],
  crossSell: ['bpc-loas', 'auxilio-acidente'],
  isActive: true,
}

export const PRODUTO_AUXILIO_ACIDENTE: Product = {
  id: 'auxilio-acidente',
  name: 'Auxílio-Acidente',
  slug: 'auxilio-acidente',
  category: 'previdenciario',
  description: 'Sequela permanente de acidente/doença. Benefício de 50% VITALÍCIO que cumula com salário.',
  price: { basic: 2000, complete: 2500 },
  successFee: 0.20,
  timeline: '6-12 meses',
  documents: ['Laudos sequela', 'CAT', 'Atestados', 'Exames', 'RG/CPF'],
  keywords: [
    'auxílio acidente',
    'sequela permanente',
    'benefício vitalício',
    'cumula salário',
  ],
  priority: 4,
  automation: 80,
  demandPerMonth: 15000,
  features: [
    '50% do salário de benefício',
    'VITALÍCIO (até aposentar)',
    'CUMULA com salário',
    'Atrasados podem valer R$ 50k+',
    'Pouca gente conhece',
  ],
  crossSell: ['beneficio-negado', 'revisao-aposentadoria'],
  isActive: true,
}

// ============================================================================
// CATEGORIA F: TRABALHISTA (2 novos produtos)
// ============================================================================

export const PRODUTO_VERBAS_RESCISORIA: Product = {
  id: 'verbas-rescisoria',
  name: 'Verbas Rescisórias Não Pagas',
  slug: 'verbas-rescisoria',
  category: 'trabalhista',
  description: 'Empresa não pagou rescisão completa, FGTS, seguro-desemprego não liberado.',
  price: { basic: 1500, complete: 2000 },
  successFee: 0.20,
  timeline: '4-8 meses',
  documents: ['CTPS', 'Termo rescisão', 'Extrato FGTS', 'Comprovantes', 'RG/CPF'],
  keywords: [
    'verbas rescisórias não pagas',
    'empresa não pagou rescisão',
    'fgts não liberado',
    'multa 40',
  ],
  priority: 4,
  automation: 85,
  demandPerMonth: 50000,
  features: [
    'Verbas completas + multa 40% FGTS',
    'Multa Art. 477 CLT (1 salário)',
    'Liberação de guias',
    'Apenas casos simples e claros',
  ],
  crossSell: [],
  isActive: true,
}

export const PRODUTO_HORAS_EXTRAS: Product = {
  id: 'horas-extras',
  name: 'Horas Extras Não Pagas',
  slug: 'horas-extras',
  category: 'trabalhista',
  description: 'Horas extras não pagas com PROVA CLARA (ponto, mensagens, emails, testemunhas).',
  price: { basic: 2000, complete: 2500 },
  successFee: 0.20,
  timeline: '6-12 meses',
  documents: ['Registro ponto', 'Mensagens/emails', 'Testemunhas', 'CTPS', 'RG/CPF'],
  keywords: [
    'horas extras não pagas',
    'banco de horas irregular',
    'trabalho fora horário',
  ],
  priority: 3,
  automation: 70,
  demandPerMonth: 30000,
  features: [
    'APENAS casos com prova clara',
    'Registro de ponto obrigatório',
    'Mensagens/emails fora horário',
    'Evitar audiências complexas',
  ],
  crossSell: ['verbas-rescisoria'],
  isActive: true,
}

// ============================================================================
// CATEGORIA G: SERVIDOR PÚBLICO (2 novos produtos)
// ============================================================================

export const PRODUTO_INCORPORACAO_GRATIFICACAO: Product = {
  id: 'incorporacao-gratificacao',
  name: 'Incorporação de Gratificação',
  slug: 'incorporacao-gratificacao',
  category: 'servidor',
  description: 'Servidor recebeu gratificação por 5+ anos e ao perder cargo perdeu benefício.',
  price: { basic: 2500, complete: 3000 },
  successFee: 0.25,
  timeline: '6-12 meses',
  documents: ['Contracheques', 'Atos nomeação', 'Histórico funcional', 'RG/CPF'],
  keywords: [
    'incorporação gratificação',
    'quintos décimos',
    'perdeu cargo comissionado',
    'servidor público',
  ],
  priority: 4,
  automation: 85,
  demandPerMonth: 10000,
  features: [
    'Incorporação definitiva ao salário',
    'Atrasados desde quando deveria ter',
    'Reflexos 13º, férias, previdência',
    'Valores podem passar R$ 100k',
  ],
  crossSell: ['diferencas-salariais'],
  isActive: true,
}

export const PRODUTO_DIFERENCAS_SALARIAIS: Product = {
  id: 'diferencas-salariais',
  name: 'Diferenças Salariais (Reajustes)',
  slug: 'diferencas-salariais',
  category: 'servidor',
  description: 'Reajuste concedido mas não pago corretamente, índices incorretos, promoções não implementadas.',
  price: { basic: 2000, complete: 2500 },
  successFee: 0.20,
  timeline: '6-12 meses',
  documents: ['Contracheques', 'Legislação reajuste', 'Cálculos', 'RG/CPF'],
  keywords: [
    'diferenças salariais servidor',
    'reajuste não pago',
    'índice correção errado',
  ],
  priority: 3,
  automation: 80,
  demandPerMonth: 8000,
  features: [
    'Cálculo de diferenças retroativas',
    'Atrasados limitados a 5 anos',
    'Professores, militares, servidores',
  ],
  crossSell: ['incorporacao-gratificacao'],
  isActive: true,
}

// ============================================================================
// CATEGORIA H: EDUCACIONAL (1 novo produto)
// ============================================================================

export const PRODUTO_FIES: Product = {
  id: 'fies-renegociacao',
  name: 'Renegociação/Revisão FIES',
  slug: 'fies-renegociacao',
  category: 'educacional',
  description: '🔥 NOVIDADE 2025: Renegociação com 100% desconto juros. Resolução MEC 64/2025.',
  price: { basic: 1500 },
  successFee: 0,
  timeline: '3-6 meses',
  documents: ['Contrato FIES', 'Boletos', 'Comprovante matrícula', 'RG/CPF'],
  keywords: [
    'renegociação fies 2025',
    'dívida fies',
    'desconto fies',
    'parcelar fies',
    'resolução 64 mec',
  ],
  priority: 4,
  automation: 85,
  demandPerMonth: 15000,
  features: [
    'Desconto 100% encargos moratórios',
    'Parcelamento até 180 meses',
    'Parcela mínima R$ 200',
    'Contratos a partir de 2018',
    'Renegociação até dez/2026',
  ],
  crossSell: ['superendividamento', 'negativacao-indevida'],
  isActive: true,
}

// ============================================================================
// CATEGORIA I: CONDOMINIAL (1 novo produto)
// ============================================================================

export const PRODUTO_COBRANCA_CONDOMINIAL: Product = {
  id: 'cobranca-condominial',
  name: 'Cobrança Condominial Abusiva',
  slug: 'cobranca-condominial',
  category: 'condominial',
  description: 'Multas condominiais abusivas (+2% mês), juros acima legal, rateios sem aprovação assembleia.',
  price: { basic: 1500 },
  successFee: 0.25,
  timeline: '3-6 meses',
  documents: ['Boletos condomínio', 'Convenção', 'Atas assembleias', 'RG/CPF'],
  keywords: [
    'multa condomínio abusiva',
    'juros condomínio alto',
    'rateio irregular',
  ],
  priority: 3,
  automation: 85,
  demandPerMonth: 8000,
  features: [
    'Revisão de multas abusivas',
    'Limite legal: 2% ao mês',
    'Restituição de valores pagos',
    'Rateios devem ter aprovação',
  ],
  crossSell: [],
  isActive: true,
}

// ============================================================================
// EXPORT DO CATÁLOGO COMPLETO
// ============================================================================

/**
 * Catálogo completo de produtos
 * Total: 22 novos produtos
 */
export const NEW_PRODUCTS: Product[] = [
  // BANCÁRIO (4)
  PRODUTO_SEGURO_PRESTAMISTA,
  PRODUTO_REVISAO_CONTRATO_BANCARIO,
  PRODUTO_PORTABILIDADE_CREDITO,
  PRODUTO_FRAUDE_CONSIGNADO,

  // TELECOM (3)
  PRODUTO_COBRANCA_TELEFONIA,
  PRODUTO_MULTA_FIDELIDADE,
  PRODUTO_PORTABILIDADE_NUMERO,

  // ENERGIA (1)
  PRODUTO_COBRANCA_ENERGIA,

  // CONSUMIDOR (5)
  PRODUTO_DISTRATO_IMOBILIARIO,
  PRODUTO_ASSINATURAS_DIGITAIS,
  PRODUTO_OVERBOOKING_VOO,
  PRODUTO_PRODUTO_VICIO,
  PRODUTO_ATRASO_ENTREGA,

  // PREVIDENCIÁRIO (3)
  PRODUTO_REVISAO_APOSENTADORIA,
  PRODUTO_BENEFICIO_NEGADO,
  PRODUTO_AUXILIO_ACIDENTE,

  // TRABALHISTA (2)
  PRODUTO_VERBAS_RESCISORIA,
  PRODUTO_HORAS_EXTRAS,

  // SERVIDOR (2)
  PRODUTO_INCORPORACAO_GRATIFICACAO,
  PRODUTO_DIFERENCAS_SALARIAIS,

  // EDUCACIONAL (1)
  PRODUTO_FIES,

  // CONDOMINIAL (1)
  PRODUTO_COBRANCA_CONDOMINIAL,
]

/**
 * Buscar produto por ID
 */
export function getProductById(id: string): Product | undefined {
  return NEW_PRODUCTS.find(p => p.id === id)
}

/**
 * Buscar produto por slug
 */
export function getProductBySlug(slug: string): Product | undefined {
  return NEW_PRODUCTS.find(p => p.slug === slug)
}

/**
 * Buscar produtos por categoria
 */
export function getProductsByCategory(category: string): Product[] {
  return NEW_PRODUCTS.filter(p => p.category === category)
}

/**
 * Buscar produtos por prioridade
 */
export function getProductsByPriority(minPriority: number = 4): Product[] {
  return NEW_PRODUCTS.filter(p => p.priority >= minPriority)
    .sort((a, b) => b.priority - a.priority)
}

/**
 * TOP 5 produtos de maior prioridade
 */
export const TOP_5_PRODUTOS = getProductsByPriority(5)
