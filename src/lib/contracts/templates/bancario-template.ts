/**
 * Template de Contrato: Serviços Bancários/Financeiros
 * Provimento 94/2000 OAB + Código de Defesa do Consumidor
 *
 * Produtos cobertos:
 * - Revisão de contrato bancário
 * - Seguro prestamista
 * - Tarifas abusivas
 * - Cartão consignado (RMC)
 * - Superendividamento
 * - Negativação indevida
 * - Execução bancária
 * - Portabilidade negada
 */

import {
  generateBaseContract,
  type BaseContractData,
  generateObjectClause,
  formatCurrency,
} from './base-contract'

export interface BancarioContractData extends BaseContractData {
  // Dados bancários específicos
  instituicao_financeira: string
  numero_contrato?: string
  tipo_operacao: string // Empréstimo, Financiamento, Cartão, etc.
  valor_operacao?: number
  data_contratacao?: string

  // Situação específica
  tipo_problema: string // Tarifas abusivas, Seguro indevido, Negativação, etc.
  valor_cobrado_indevidamente?: number
  documentos_fornecidos: string[]

  // Estratégia jurídica
  forma_cobranca: 'ação judicial' | 'acordo extrajudicial' | 'defesa' | 'recurso'
  tribunal: string // JEC, Vara Cível, TJ-RJ, etc.
}

/**
 * Gera cláusula específica de serviços bancários
 */
export function generateBancarioServiceClause(data: BancarioContractData): string {
  const valorIndevido = data.valor_cobrado_indevidamente
    ? formatCurrency(data.valor_cobrado_indevidamente)
    : 'a ser apurado'

  return `
CLÁUSULA PRIMEIRA – DO OBJETO

1.1. O presente contrato tem por objeto a prestação de serviços advocatícios para ${data.servico_nome}, referente a operação bancária com a ${data.instituicao_financeira}.

1.2. Tipo de operação: ${data.tipo_operacao}.

${data.numero_contrato ? `1.3. Número do contrato bancário: ${data.numero_contrato}.` : ''}

${data.data_contratacao ? `1.4. Data da contratação: ${data.data_contratacao}.` : ''}

1.5. Problema identificado: ${data.tipo_problema}.

${data.valor_cobrado_indevidamente ? `1.6. Valor cobrado indevidamente: ${valorIndevido} (estimativa inicial, podendo variar conforme análise detalhada do contrato).` : ''}

1.7. Forma de atuação: ${data.forma_cobranca}.

1.8. ${data.tribunal ? `Tribunal/Instância: ${data.tribunal}.` : 'Juizado Especial Cível (JEC) ou Vara Cível, conforme valor da causa.'}
`.trim()
}

/**
 * Cláusula de documentação bancária
 */
export function generateBancarioDocumentationClause(data: BancarioContractData): string {
  const docsListados = data.documentos_fornecidos
    .map((doc, i) => `   ${String.fromCharCode(97 + i)}) ${doc};`)
    .join('\n')

  return `
CLÁUSULA TERCEIRA – DA DOCUMENTAÇÃO

3.1. O CONTRATANTE forneceu os seguintes documentos para análise:
${docsListados}

3.2. Caso sejam necessários documentos adicionais, o CONTRATANTE obriga-se a fornecê-los no prazo de 5 (cinco) dias úteis.

3.3. O CONTRATADO analisará o contrato bancário e extratos para identificar:
   a) Cobranças indevidas ou abusivas;
   b) Tarifas não previstas em lei (Resolução CMN 3.919/2010);
   c) Juros acima da média de mercado;
   d) Seguros não contratados ou venda casada;
   e) Outras irregularidades contratuais.

3.4. A análise inicial será apresentada ao CONTRATANTE no prazo de até 10 (dez) dias úteis.
`.trim()
}

/**
 * Cláusula de estratégia jurídica bancária
 */
export function generateBancarioStrategyClause(data: BancarioContractData): string {
  let estrategia = ''

  switch (data.forma_cobranca) {
    case 'ação judicial':
      estrategia = `
4.1. O CONTRATADO ajuizará ação judicial em face da ${data.instituicao_financeira} para:
   a) Declarar a ilegalidade das cobranças indevidas;
   b) Pleitear a restituição em dobro dos valores pagos indevidamente (art. 42, parágrafo único, CDC);
   c) Requerer indenização por danos morais (quando aplicável);
   d) Obter tutela antecipada para suspender cobranças.

4.2. A ação será proposta no ${data.tribunal || 'Juizado Especial Cível (JEC)'}.

4.3. O CONTRATADO acompanhará todas as audiências e fases processuais até trânsito em julgado.
`
      break

    case 'acordo extrajudicial':
      estrategia = `
4.1. O CONTRATADO buscará acordo extrajudicial com a ${data.instituicao_financeira} através de:
   a) Notificação extrajudicial;
   b) Negociação direta com setor jurídico do banco;
   c) Mediação/Conciliação no Procon;
   d) Plataforma Consumidor.gov.br.

4.2. Caso não haja acordo em 30 (trinta) dias, o CONTRATADO poderá ajuizar ação judicial, mediante aprovação do CONTRATANTE.
`
      break

    case 'defesa':
      estrategia = `
4.1. O CONTRATADO atuará na defesa do CONTRATANTE em ação judicial movida pela ${data.instituicao_financeira}, apresentando:
   a) Contestação com alegações de direito e defesas preliminares;
   b) Reconvenção para restituição de valores cobrados indevidamente;
   c) Provas documentais e técnicas;
   d) Recursos cabíveis.

4.2. A defesa incluirá análise completa do contrato bancário e identificação de vícios.
`
      break

    case 'recurso':
      estrategia = `
4.1. O CONTRATADO interporá recurso contra decisão judicial desfavorável, incluindo:
   a) Apelação;
   b) Embargos de declaração;
   c) Recurso especial/extraordinário (quando cabíveis).

4.2. Análise das chances recursais será apresentada ao CONTRATANTE antes da interposição.
`
      break
  }

  return `
CLÁUSULA QUARTA – DA ESTRATÉGIA JURÍDICA

${estrategia.trim()}

4.4. O CONTRATADO manterá o CONTRATANTE informado sobre todas as etapas processuais e decisões judiciais.
`.trim()
}

/**
 * Cláusula de honorários de sucesso (específica para bancário)
 */
export function generateBancarioSuccessFeesClause(): string {
  return `
CLÁUSULA SEXTA – DOS HONORÁRIOS DE SUCESSO

6.1. Em caso de êxito total ou parcial na ação, o CONTRATADO fará jus a 30% (trinta por cento) do valor efetivamente recebido pelo CONTRATANTE, a título de honorários de sucumbência ou êxito.

6.2. Os honorários de êxito são independentes dos honorários contratuais ora pactuados.

6.3. Considera-se êxito:
   a) Sentença favorável;
   b) Acordo judicial ou extrajudicial;
   c) Condenação do banco ao pagamento de valores;
   d) Reconhecimento de direitos do CONTRATANTE.

6.4. Os honorários de êxito serão descontados diretamente do valor recebido, antes do repasse ao CONTRATANTE.

6.5. Caso o banco seja condenado a pagar honorários sucumbenciais, estes pertencem integralmente ao CONTRATADO (artigos 22 e 23 do Código de Ética OAB).
`.trim()
}

/**
 * Cláusula de reembolso de custas bancárias
 */
export function generateBancarioCostsClause(): string {
  return `
CLÁUSULA SÉTIMA – DAS CUSTAS E DESPESAS PROCESSUAIS

7.1. No Juizado Especial Cível (JEC), não há custas iniciais para causas até 20 salários mínimos.

7.2. Eventuais custas e despesas processuais (perícias, certidões, etc.) serão de responsabilidade do CONTRATANTE, podendo ser parceladas mediante acordo.

7.3. Em caso de condenação do banco, as custas processuais serão reembolsadas ao CONTRATANTE.

7.4. O CONTRATADO não antecipará valores de custas e despesas, salvo acordo específico.
`.trim()
}

/**
 * Gera contrato completo de serviços bancários
 */
export function generateBancarioContract(data: BancarioContractData): string {
  const customClauses = [
    generateBancarioServiceClause(data),
    '',
    generateBancarioDocumentationClause(data),
    '',
    generateBancarioStrategyClause(data),
    '',
    generateBancarioSuccessFeesClause(),
    '',
    generateBancarioCostsClause(),
  ]

  // Usa base contract mas substitui cláusula primeira
  return generateBaseContract(data, customClauses.filter((c) => c !== ''))
}
