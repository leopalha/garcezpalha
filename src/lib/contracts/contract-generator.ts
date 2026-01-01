/**
 * Contract Generator - Sistema Completo de Geração de Contratos
 * Integração: Templates + ClickSign API + Product Catalog
 *
 * Fluxo:
 * 1. Recebe dados da conversation (cliente + produto)
 * 2. Identifica template correto (template-mapper)
 * 3. Gera variáveis dinâmicas (product catalog)
 * 4. Gera contrato (base-contract + category-templates)
 * 5. Envia para ClickSign via API
 * 6. Retorna URL de assinatura
 */

import { getClickSignClient } from '../integrations/clicksign'
import { getProductBySlug } from '../products/catalog'
import type { Product } from '../products/types'
import {
  getTemplateForProduct,
  generateTemplateVariables,
  validateTemplateData,
  type TemplateType,
  type TemplateSpecificData,
} from './template-mapper'
import { generateBaseContract, type BaseContractData } from './templates/base-contract'
import { generateBancarioContract } from './templates/bancario-template'
import {
  gerarContratoPericiaDocumental,
  type PericiaDocumentalData,
} from './templates/pericia-documental'
import {
  gerarContratoPericaMedica,
  type PeriMedicaData,
} from './templates/pericia-medica'
import {
  gerarContratoAvaliacaoImoveis,
  type AvaliacaoImoveisData,
} from './templates/avaliacao-imoveis'
import { getCategorySpecificClauses } from './templates/category-templates'

/**
 * Input para geração de contrato
 */
export interface GenerateContractInput {
  // Dados da conversation
  conversationId: string
  productSlug: string

  // Dados do cliente
  clientName: string
  clientEmail: string
  clientCPF: string
  clientPhone: string
  clientAddress: string

  // Dados do pagamento/proposta
  amount: number // Valor em centavos
  paymentMethod: string
  paymentDate?: string

  // Dados específicos do caso (opcionais, dependem do produto)
  specificData?: TemplateSpecificData
}

/**
 * Output da geração de contrato
 */
export interface GenerateContractOutput {
  success: boolean
  documentKey: string
  signUrl: string
  templateType: TemplateType
  errors?: string[]
}

/**
 * Gera contrato completo e envia para ClickSign
 */
export async function generateContractForConversation(
  input: GenerateContractInput
): Promise<GenerateContractOutput> {
  try {
    console.log('[ContractGenerator] Starting contract generation for:', input.conversationId)

    // 1. Buscar produto do catálogo
    const product = getProductBySlug(input.productSlug)
    if (!product) {
      throw new Error(`Product not found: ${input.productSlug}`)
    }

    // 2. Identificar template correto
    const templateType = getTemplateForProduct(product)
    console.log('[ContractGenerator] Template type:', templateType)

    // 3. Preparar dados base do contrato
    const baseData: BaseContractData = {
      // Partes
      contratante_nome: input.clientName,
      contratante_cpf: input.clientCPF,
      contratante_endereco: input.clientAddress,
      contratante_email: input.clientEmail,
      contratante_telefone: input.clientPhone,

      // Advogado (dados fixos Garcez Palha)
      advogado_nome: 'Leonardo Mendonça Palha da Silva',
      advogado_oab: '219.390',
      advogado_email: 'contato@garcezpalha.com',

      // Serviço
      servico_nome: product.name,
      servico_descricao: product.description,
      categoria_servico: product.category,

      // Valores
      valor_total: input.amount / 100, // Converter centavos para reais
      forma_pagamento: input.paymentMethod,
      data_vencimento: input.paymentDate || new Date().toLocaleDateString('pt-BR'),
      prazo_estimado: product.timeline || '3-6 meses',

      // Metadados
      data_contrato: new Date().toLocaleDateString('pt-BR'),
      conversation_id: input.conversationId,
      product_id: product.id,
    }

    // 4. Validar dados
    const validation = validateTemplateData(baseData, input.specificData || {}, templateType)
    if (!validation.valid) {
      console.warn('[ContractGenerator] Missing fields:', validation.missingFields)
      // Continua mesmo com campos faltando (serão preenchidos com valores padrão)
    }

    // 5. Gerar contrato baseado no template
    const contractContent = await generateContractContent(
      baseData,
      input.specificData || {},
      templateType,
      product
    )

    // 6. Gerar variáveis para ClickSign
    const clicksignVariables = generateTemplateVariables(
      baseData,
      input.specificData || {},
      templateType
    )

    // 7. Enviar para ClickSign
    const clicksign = getClickSignClient()

    // 7.1. Criar documento (via template do ClickSign ou upload direto)
    const documentKey = await createClickSignDocument(
      clicksign,
      contractContent,
      baseData,
      product,
      clicksignVariables
    )

    if (!documentKey) {
      throw new Error('Failed to create document in ClickSign')
    }

    console.log('[ContractGenerator] Document created:', documentKey)

    // 7.2. Adicionar cliente como signatário
    await clicksign.addSigner({
      documentKey,
      signer: {
        email: input.clientEmail,
        name: input.clientName,
        phone_number: input.clientPhone,
        auths: input.clientPhone ? ['email', 'sms'] : ['email'],
        documentation: input.clientCPF,
        has_documentation: true,
      },
      message: `Olá ${input.clientName}! Seu pagamento foi confirmado. Por favor, assine o contrato para iniciarmos seu caso de ${product.name}.`,
    })

    console.log('[ContractGenerator] Signer added')

    // 7.3. Enviar para assinatura
    await clicksign.sendDocument(documentKey)

    console.log('[ContractGenerator] Document sent for signature')

    // 8. Retornar URL de assinatura
    const signUrl = `https://app.clicksign.com/sign/${documentKey}`

    return {
      success: true,
      documentKey,
      signUrl,
      templateType,
    }
  } catch (error: any) {
    console.error('[ContractGenerator] Error:', error)
    return {
      success: false,
      documentKey: '',
      signUrl: '',
      templateType: 'base',
      errors: [error.message],
    }
  }
}

/**
 * Gera conteúdo do contrato baseado no template
 */
async function generateContractContent(
  baseData: BaseContractData,
  specificData: TemplateSpecificData,
  templateType: TemplateType,
  product: Product
): Promise<string> {
  switch (templateType) {
    case 'pericia-documental': {
      const data: PericiaDocumentalData = {
        contratante_nome: baseData.contratante_nome,
        contratante_cpf: baseData.contratante_cpf,
        contratante_endereco: baseData.contratante_endereco,
        contratado_nome: baseData.advogado_nome,
        contratado_oab: baseData.advogado_oab,
        contratado_especialidade: 'Perícia Documental e Grafotécnica',
        tipo_pericia: specificData.tipo_pericia || 'Grafotécnica',
        documentos_analisar: specificData.documentos_analisar || 'Documentos a serem informados',
        numero_documentos: specificData.numero_documentos || 1,
        objetivo_pericia: specificData.objetivo_pericia || 'Verificação de autenticidade',
        prazo_entrega_dias: 30,
        valor_total: baseData.valor_total,
        forma_pagamento: baseData.forma_pagamento,
        data_vencimento: baseData.data_vencimento,
        metodologia: specificData.metodologia || 'Análise grafotécnica comparativa',
        local_pericia: specificData.local_pericia || 'Escritório Garcez Palha',
        data_contrato: baseData.data_contrato,
      }
      return gerarContratoPericiaDocumental(data)
    }

    case 'pericia-medica': {
      const data: PeriMedicaData = {
        contratante_nome: baseData.contratante_nome,
        contratante_cpf: baseData.contratante_cpf,
        contratante_endereco: baseData.contratante_endereco,
        contratado_nome: baseData.advogado_nome,
        contratado_crm: specificData.contratado_crm || 'CRM a ser informado',
        contratado_especialidade: specificData.contratado_especialidade || 'Medicina do Trabalho',
        tipo_pericia: 'Trabalhista',
        objetivo_pericia: specificData.objetivo_pericia || 'Avaliação de incapacidade laboral',
        paciente_nome: specificData.paciente_nome || baseData.contratante_nome,
        paciente_cpf: specificData.paciente_cpf || baseData.contratante_cpf,
        patologia_investigada: specificData.patologia_investigada || 'A ser investigada',
        exames_necessarios: specificData.exames_necessarios || ['Exames clínicos gerais'],
        necessita_vistoria: false,
        local_pericia: specificData.local_pericia || 'Clínica credenciada',
        prazo_entrega_dias: 30,
        valor_total: baseData.valor_total,
        forma_pagamento: baseData.forma_pagamento,
        data_vencimento: baseData.data_vencimento,
        data_contrato: baseData.data_contrato,
      }
      return gerarContratoPericaMedica(data)
    }

    case 'avaliacao-imoveis': {
      const data: AvaliacaoImoveisData = {
        contratante_nome: baseData.contratante_nome,
        contratante_cpf: baseData.contratante_cpf,
        contratante_endereco: baseData.contratante_endereco,
        contratado_nome: baseData.advogado_nome,
        contratado_crea: 'CREA a ser informado',
        endereco_imovel: specificData.endereco_imovel || 'Endereço a ser informado',
        tipo_imovel: specificData.tipo_imovel || 'Apartamento',
        area_total_m2: specificData.area_total_m2 || 0,
        matricula_imovel: specificData.matricula_imovel,
        finalidade_avaliacao: specificData.finalidade_avaliacao || 'Compra e venda',
        metodo_avaliacao:
          specificData.metodo_avaliacao || 'Comparativo Direto de Dados de Mercado',
        nivel_precisao: specificData.nivel_precisao || 'Normal',
        necessita_vistoria: specificData.necessita_vistoria !== false,
        prazo_entrega_dias: 15,
        data_vistoria: specificData.data_vistoria,
        valor_total: baseData.valor_total,
        forma_pagamento: baseData.forma_pagamento,
        data_vencimento: baseData.data_vencimento,
        data_contrato: baseData.data_contrato,
      }
      return gerarContratoAvaliacaoImoveis(data)
    }

    case 'bancario': {
      const bancarioData = {
        ...baseData,
        instituicao_financeira: specificData.instituicao_financeira || 'Instituição a ser informada',
        numero_contrato: specificData.numero_contrato,
        tipo_operacao: specificData.tipo_operacao || 'Empréstimo consignado',
        valor_operacao: specificData.valor_operacao,
        data_contratacao: specificData.data_contratacao,
        tipo_problema: 'Tarifas abusivas e seguro prestamista',
        valor_cobrado_indevidamente: specificData.valor_operacao,
        documentos_fornecidos: ['Contrato bancário', 'Extratos'],
        forma_cobranca: 'ação judicial' as const,
        tribunal: 'Juizado Especial Cível',
      }
      return generateBancarioContract(bancarioData)
    }

    case 'telecom':
    case 'consumidor':
    case 'saude':
    case 'previdenciario':
    case 'imobiliario':
    case 'criminal':
    case 'trabalhista': {
      // Usa template base com cláusulas customizadas
      const categoryData = {
        ...baseData,
        ...specificData,
      }

      const clauses = getCategorySpecificClauses(product.category, categoryData)
      const customClauses = []

      if (clauses.serviceClause) customClauses.push(clauses.serviceClause)
      if (clauses.strategClause) customClauses.push(clauses.strategClause)
      if (clauses.additionalClause) customClauses.push(clauses.additionalClause)

      return generateBaseContract(baseData, customClauses.filter((c) => c !== ''))
    }

    case 'base':
    default:
      // Template genérico
      return generateBaseContract(baseData)
  }
}

/**
 * Cria documento no ClickSign
 */
async function createClickSignDocument(
  clicksign: any,
  contractContent: string,
  baseData: BaseContractData,
  product: Product,
  variables: Record<string, string>
): Promise<string | null> {
  // Verifica se ClickSign está configurado
  if (!clicksign.isConfigured()) {
    console.warn('[ContractGenerator] ClickSign not configured, skipping')
    throw new Error('ClickSign not configured')
  }

  // Tenta usar template do ClickSign se existir variável de ambiente
  const templateKey = process.env.CLICKSIGN_CONTRACT_TEMPLATE_KEY

  if (templateKey) {
    // Usa template do ClickSign com variáveis
    console.log('[ContractGenerator] Using ClickSign template:', templateKey)
    const response = await clicksign.createDocumentFromTemplate({
      templateKey,
      templateData: variables,
      filename: `contrato-${baseData.conversation_id}-${Date.now()}.pdf`,
    })

    return response?.document?.key || null
  } else {
    // Fallback: Upload contrato como texto/PDF
    // (Requer conversão para PDF - não implementado nesta versão)
    console.warn(
      '[ContractGenerator] No ClickSign template configured, contract content generated but not uploaded'
    )

    // TODO: Implementar conversão de texto para PDF e upload
    // Por enquanto, retorna erro
    throw new Error(
      'ClickSign template not configured. Set CLICKSIGN_CONTRACT_TEMPLATE_KEY in .env'
    )
  }
}

/**
 * Helper: Extrai dados específicos de uma conversation
 * (Para uso futuro quando integrar com conversation data)
 */
export function extractSpecificDataFromConversation(
  conversationData: any,
  product: Product
): TemplateSpecificData {
  const specificData: TemplateSpecificData = {}

  // Extrai dados do qualification flow
  if (conversationData.qualification) {
    const answers = conversationData.qualification.answers || {}

    // Mapeamento genérico de respostas → campos do template
    // TODO: Implementar mapeamento específico por produto
    Object.keys(answers).forEach((key) => {
      const value = answers[key]
      specificData[key as keyof TemplateSpecificData] = value
    })
  }

  // Extrai dados da proposta
  if (conversationData.proposal) {
    if (conversationData.proposal.custom_fields) {
      Object.assign(specificData, conversationData.proposal.custom_fields)
    }
  }

  return specificData
}
