/**
 * Template Mapper - Mapeamento Produto → Template Contrato
 * Sistema que determina qual template usar para cada produto
 */

import type { Product } from '../products/types'
import type { BaseContractData } from './templates/base-contract'

export type TemplateType =
  | 'base' // Template genérico
  | 'pericia-documental' // Perícia grafotécnica
  | 'pericia-medica' // Perícia médica
  | 'avaliacao-imoveis' // Avaliação imobiliária
  | 'bancario' // Serviços bancários/financeiros
  | 'telecom' // Telecomunicações
  | 'consumidor' // Direito do consumidor
  | 'saude' // Plano de saúde
  | 'previdenciario' // INSS/Previdência
  | 'imobiliario' // Imobiliário geral
  | 'criminal' // Direito criminal
  | 'trabalhista' // Direito trabalhista

/**
 * Mapeamento categoria → template
 */
const CATEGORY_TEMPLATE_MAP: Record<string, TemplateType> = {
  bancario: 'bancario',
  telecom: 'telecom',
  consumidor: 'consumidor',
  saude: 'saude',
  previdenciario: 'previdenciario',
  imobiliario: 'imobiliario',
  criminal: 'criminal',
  trabalhista: 'trabalhista',
  digital: 'base', // Usa template genérico
  servidor: 'trabalhista', // Servidor público usa template trabalhista
  educacional: 'consumidor', // Educacional usa template consumidor
  aeronautico: 'consumidor', // Aeronáutico usa template consumidor
  patrimonial: 'imobiliario', // Patrimonial usa template imobiliário
  pericia: 'base', // Perícia geral usa template base (específicos têm override)
}

/**
 * Mapeamento produto específico → template
 * Override para produtos que precisam de template específico
 */
const PRODUCT_TEMPLATE_MAP: Record<string, TemplateType> = {
  // Perícias - Templates específicos já existentes
  'pericia-grafotecnica': 'pericia-documental',
  'pericia-documental': 'pericia-documental',
  'pericia-medica': 'pericia-medica',
  'pericia-medica-judicial': 'pericia-medica',
  'avaliacao-imoveis': 'avaliacao-imoveis',
  'avaliacao-judicial': 'avaliacao-imoveis',

  // Produtos que precisam de template específico
  // (adicionar aqui conforme novos templates específicos forem criados)
}

/**
 * Determina qual template usar para um produto
 */
export function getTemplateForProduct(product: Product): TemplateType {
  // 1. Verifica se existe mapeamento específico por product ID
  if (PRODUCT_TEMPLATE_MAP[product.id]) {
    return PRODUCT_TEMPLATE_MAP[product.id]
  }

  // 2. Verifica se existe mapeamento específico por slug
  if (PRODUCT_TEMPLATE_MAP[product.slug]) {
    return PRODUCT_TEMPLATE_MAP[product.slug]
  }

  // 3. Usa mapeamento por categoria
  if (CATEGORY_TEMPLATE_MAP[product.category]) {
    return CATEGORY_TEMPLATE_MAP[product.category]
  }

  // 4. Fallback para template base
  return 'base'
}

/**
 * Interface para dados específicos de cada tipo de template
 */
export interface TemplateSpecificData {
  // Perícia Documental
  tipo_pericia?: string
  documentos_analisar?: string
  numero_documentos?: number
  objetivo_pericia?: string
  metodologia?: string
  local_pericia?: string

  // Perícia Médica
  paciente_nome?: string
  paciente_cpf?: string
  patologia_investigada?: string
  exames_necessarios?: string[]
  contratado_crm?: string
  contratado_especialidade?: string

  // Avaliação Imóveis
  endereco_imovel?: string
  tipo_imovel?: string
  area_total_m2?: number
  matricula_imovel?: string
  finalidade_avaliacao?: string
  metodo_avaliacao?: string
  nivel_precisao?: string
  necessita_vistoria?: boolean
  data_vistoria?: string

  // Bancário
  numero_contrato?: string
  instituicao_financeira?: string
  tipo_operacao?: string
  valor_operacao?: number
  data_contratacao?: string

  // Telecom
  operadora?: string
  numero_linha?: string
  numero_protocolo?: string
  tipo_servico?: string

  // Consumidor
  fornecedor?: string
  produto_servico?: string
  numero_nf?: string
  data_compra?: string
  defeito_reclamado?: string

  // Saúde
  operadora_saude?: string
  numero_carteirinha?: string
  tipo_plano?: string
  procedimento_negado?: string

  // Previdenciário
  numero_beneficio?: string
  tipo_beneficio?: string
  data_indeferimento?: string
  data_inicio_contribuicao?: string

  // Imobiliário
  tipo_negocio?: string // Compra, venda, locação
  valor_negocio?: number
  cep?: string

  // Criminal
  tipo_crime?: string
  vara_criminal?: string
  numero_inquerito?: string

  // Trabalhista
  empresa?: string
  cnpj?: string
  cargo_funcao?: string
  periodo_trabalho?: string
  data_demissao?: string
}

/**
 * Gera variáveis específicas para ClickSign baseado no template
 */
export function generateTemplateVariables(
  baseData: BaseContractData,
  specificData: TemplateSpecificData,
  templateType: TemplateType
): Record<string, string> {
  // Variáveis base presentes em todos os contratos
  const baseVariables: Record<string, string> = {
    // Cliente
    contratante_nome: baseData.contratante_nome,
    contratante_cpf: baseData.contratante_cpf,
    contratante_endereco: baseData.contratante_endereco,
    contratante_email: baseData.contratante_email,
    contratante_telefone: baseData.contratante_telefone,

    // Advogado
    advogado_nome: baseData.advogado_nome,
    advogado_oab: baseData.advogado_oab,
    advogado_email: baseData.advogado_email,

    // Serviço
    servico_nome: baseData.servico_nome,
    servico_descricao: baseData.servico_descricao,
    categoria_servico: baseData.categoria_servico,

    // Valores
    valor_total: formatCurrency(baseData.valor_total),
    valor_total_numerico: baseData.valor_total.toString(),
    forma_pagamento: baseData.forma_pagamento,
    data_vencimento: baseData.data_vencimento,
    prazo_estimado: baseData.prazo_estimado,

    // Metadados
    data_contrato: baseData.data_contrato,
    data_contrato_extenso: formatDateExtended(baseData.data_contrato),

    // Compliance OAB
    disclaimer_oab:
      'As informações têm caráter orientativo. O advogado não garante resultado favorável, apenas a prestação diligente dos serviços.',
  }

  // Adiciona variáveis específicas baseado no tipo de template
  const specificVariables = getSpecificVariables(specificData, templateType)

  return { ...baseVariables, ...specificVariables }
}

/**
 * Extrai variáveis específicas para cada tipo de template
 */
function getSpecificVariables(
  data: TemplateSpecificData,
  templateType: TemplateType
): Record<string, string> {
  const variables: Record<string, string> = {}

  switch (templateType) {
    case 'pericia-documental':
      if (data.tipo_pericia) variables.tipo_pericia = data.tipo_pericia
      if (data.documentos_analisar) variables.documentos_analisar = data.documentos_analisar
      if (data.numero_documentos) variables.numero_documentos = data.numero_documentos.toString()
      if (data.objetivo_pericia) variables.objetivo_pericia = data.objetivo_pericia
      if (data.metodologia) variables.metodologia = data.metodologia
      if (data.local_pericia) variables.local_pericia = data.local_pericia
      break

    case 'pericia-medica':
      if (data.paciente_nome) variables.paciente_nome = data.paciente_nome
      if (data.paciente_cpf) variables.paciente_cpf = data.paciente_cpf
      if (data.patologia_investigada) variables.patologia_investigada = data.patologia_investigada
      if (data.exames_necessarios)
        variables.exames_necessarios = data.exames_necessarios.join(', ')
      if (data.contratado_crm) variables.contratado_crm = data.contratado_crm
      if (data.contratado_especialidade)
        variables.contratado_especialidade = data.contratado_especialidade
      break

    case 'avaliacao-imoveis':
      if (data.endereco_imovel) variables.endereco_imovel = data.endereco_imovel
      if (data.tipo_imovel) variables.tipo_imovel = data.tipo_imovel
      if (data.area_total_m2) variables.area_total_m2 = data.area_total_m2.toString()
      if (data.matricula_imovel) variables.matricula_imovel = data.matricula_imovel
      if (data.finalidade_avaliacao) variables.finalidade_avaliacao = data.finalidade_avaliacao
      if (data.metodo_avaliacao) variables.metodo_avaliacao = data.metodo_avaliacao
      if (data.nivel_precisao) variables.nivel_precisao = data.nivel_precisao
      if (data.necessita_vistoria !== undefined)
        variables.necessita_vistoria = data.necessita_vistoria ? 'Sim' : 'Não'
      if (data.data_vistoria) variables.data_vistoria = data.data_vistoria
      break

    case 'bancario':
      if (data.numero_contrato) variables.numero_contrato = data.numero_contrato
      if (data.instituicao_financeira) variables.instituicao_financeira = data.instituicao_financeira
      if (data.tipo_operacao) variables.tipo_operacao = data.tipo_operacao
      if (data.valor_operacao) variables.valor_operacao = formatCurrency(data.valor_operacao)
      if (data.data_contratacao) variables.data_contratacao = data.data_contratacao
      break

    case 'telecom':
      if (data.operadora) variables.operadora = data.operadora
      if (data.numero_linha) variables.numero_linha = data.numero_linha
      if (data.numero_protocolo) variables.numero_protocolo = data.numero_protocolo
      if (data.tipo_servico) variables.tipo_servico = data.tipo_servico
      break

    case 'consumidor':
      if (data.fornecedor) variables.fornecedor = data.fornecedor
      if (data.produto_servico) variables.produto_servico = data.produto_servico
      if (data.numero_nf) variables.numero_nf = data.numero_nf
      if (data.data_compra) variables.data_compra = data.data_compra
      if (data.defeito_reclamado) variables.defeito_reclamado = data.defeito_reclamado
      break

    case 'saude':
      if (data.operadora_saude) variables.operadora_saude = data.operadora_saude
      if (data.numero_carteirinha) variables.numero_carteirinha = data.numero_carteirinha
      if (data.tipo_plano) variables.tipo_plano = data.tipo_plano
      if (data.procedimento_negado) variables.procedimento_negado = data.procedimento_negado
      break

    case 'previdenciario':
      if (data.numero_beneficio) variables.numero_beneficio = data.numero_beneficio
      if (data.tipo_beneficio) variables.tipo_beneficio = data.tipo_beneficio
      if (data.data_indeferimento) variables.data_indeferimento = data.data_indeferimento
      if (data.data_inicio_contribuicao)
        variables.data_inicio_contribuicao = data.data_inicio_contribuicao
      break

    case 'imobiliario':
      if (data.tipo_negocio) variables.tipo_negocio = data.tipo_negocio
      if (data.valor_negocio) variables.valor_negocio = formatCurrency(data.valor_negocio)
      if (data.endereco_imovel) variables.endereco_imovel = data.endereco_imovel
      if (data.cep) variables.cep = data.cep
      break

    case 'criminal':
      if (data.tipo_crime) variables.tipo_crime = data.tipo_crime
      if (data.vara_criminal) variables.vara_criminal = data.vara_criminal
      if (data.numero_inquerito) variables.numero_inquerito = data.numero_inquerito
      break

    case 'trabalhista':
      if (data.empresa) variables.empresa = data.empresa
      if (data.cnpj) variables.cnpj = data.cnpj
      if (data.cargo_funcao) variables.cargo_funcao = data.cargo_funcao
      if (data.periodo_trabalho) variables.periodo_trabalho = data.periodo_trabalho
      if (data.data_demissao) variables.data_demissao = data.data_demissao
      break

    case 'base':
    default:
      // Template base não precisa de variáveis adicionais
      break
  }

  return variables
}

/**
 * Helpers de formatação
 */
function formatCurrency(value: number): string {
  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
  })
}

function formatDateExtended(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })
}

/**
 * Valida se todos os campos obrigatórios estão presentes
 */
export function validateTemplateData(
  baseData: BaseContractData,
  specificData: TemplateSpecificData,
  templateType: TemplateType
): { valid: boolean; missingFields: string[] } {
  const missingFields: string[] = []

  // Valida campos base obrigatórios
  const requiredBaseFields = [
    'contratante_nome',
    'contratante_cpf',
    'contratante_endereco',
    'contratante_email',
    'advogado_nome',
    'advogado_oab',
    'servico_nome',
    'servico_descricao',
    'valor_total',
    'data_contrato',
  ]

  requiredBaseFields.forEach((field) => {
    if (!baseData[field as keyof BaseContractData]) {
      missingFields.push(field)
    }
  })

  // Valida campos específicos obrigatórios por template
  const requiredSpecificFields = getRequiredSpecificFields(templateType)
  requiredSpecificFields.forEach((field) => {
    if (!specificData[field as keyof TemplateSpecificData]) {
      missingFields.push(field)
    }
  })

  return {
    valid: missingFields.length === 0,
    missingFields,
  }
}

/**
 * Retorna campos obrigatórios para cada tipo de template
 */
function getRequiredSpecificFields(templateType: TemplateType): string[] {
  switch (templateType) {
    case 'pericia-documental':
      return ['tipo_pericia', 'documentos_analisar', 'objetivo_pericia']

    case 'pericia-medica':
      return ['paciente_nome', 'paciente_cpf', 'patologia_investigada']

    case 'avaliacao-imoveis':
      return ['endereco_imovel', 'tipo_imovel', 'area_total_m2', 'finalidade_avaliacao']

    case 'bancario':
      return ['instituicao_financeira', 'tipo_operacao']

    case 'telecom':
      return ['operadora', 'tipo_servico']

    case 'consumidor':
      return ['fornecedor', 'produto_servico']

    case 'saude':
      return ['operadora_saude', 'tipo_plano']

    case 'previdenciario':
      return ['tipo_beneficio']

    case 'imobiliario':
      return ['tipo_negocio', 'endereco_imovel']

    case 'criminal':
      return ['tipo_crime']

    case 'trabalhista':
      return ['empresa', 'cargo_funcao']

    case 'base':
    default:
      return []
  }
}
