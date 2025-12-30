/**
 * Template Base de Contrato - Garcez Palha
 * Cláusulas comuns OAB para todos os contratos
 *
 * Provimento 94/2000 OAB - Código de Ética e Disciplina
 * Lei 8.906/94 - Estatuto da Advocacia
 */

export interface BaseContractData {
  // Partes
  contratante_nome: string
  contratante_cpf: string
  contratante_endereco: string
  contratante_email: string
  contratante_telefone: string

  // Advogado
  advogado_nome: string
  advogado_oab: string
  advogado_email: string

  // Objeto do Contrato
  servico_nome: string
  servico_descricao: string
  categoria_servico: string // Bancário, Imobiliário, etc.

  // Valores e Prazos
  valor_total: number
  forma_pagamento: string
  data_vencimento: string
  prazo_estimado: string

  // Metadados
  data_contrato: string
  conversation_id: string
  product_id: string
}

/**
 * Gera header padrão do contrato
 */
export function generateContractHeader(data: BaseContractData): string {
  return `
CONTRATO DE PRESTAÇÃO DE SERVIÇOS ADVOCATÍCIOS
${data.servico_nome.toUpperCase()}

CONTRATANTE: ${data.contratante_nome}, CPF ${data.contratante_cpf}, residente e domiciliado em ${data.contratante_endereco}, e-mail ${data.contratante_email}, telefone ${data.contratante_telefone}.

CONTRATADO: ${data.advogado_nome}, OAB/RJ ${data.advogado_oab}, com escritório na Rua Buenos Aires, 68, sala 401 - Centro, Rio de Janeiro/RJ, CEP 20070-022, e-mail ${data.advogado_email}.

As partes acima qualificadas têm, entre si, justo e acertado o presente Contrato de Prestação de Serviços Advocatícios, que se regerá pelas cláusulas seguintes e pelas condições descritas no presente.
`.trim()
}

/**
 * Cláusula Primeira - Do Objeto (customizável)
 */
export function generateObjectClause(serviceName: string, serviceDescription: string): string {
  return `
CLÁUSULA PRIMEIRA – DO OBJETO

1.1. O presente contrato tem por objeto a prestação de serviços advocatícios para ${serviceName}.

1.2. O CONTRATADO prestará assessoria e consultoria jurídica na seguinte matéria: ${serviceDescription}.

1.3. Os serviços serão executados com observância dos princípios éticos da advocacia e da legislação vigente.
`.trim()
}

/**
 * Cláusula de Responsabilidades do Contratado (padrão OAB)
 */
export function generateLawyerResponsibilitiesClause(): string {
  return `
CLÁUSULA SEGUNDA – DAS RESPONSABILIDADES DO CONTRATADO

2.1. O CONTRATADO obriga-se a:
   a) Prestar os serviços advocatícios com zelo, dedicação e dentro dos padrões éticos da profissão;
   b) Informar o CONTRATANTE sobre o andamento dos trabalhos;
   c) Manter sigilo profissional sobre informações obtidas;
   d) Atuar com independência técnica e autonomia profissional;
   e) Utilizar os meios legais adequados para a defesa dos interesses do CONTRATANTE.

2.2. O CONTRATADO não se responsabiliza pelo êxito da demanda, comprometendo-se apenas com a prestação diligente dos serviços advocatícios.

2.3. O exercício profissional da advocacia será regido pelos princípios estabelecidos no Estatuto da Advocacia (Lei 8.906/94) e no Código de Ética e Disciplina da OAB.
`.trim()
}

/**
 * Cláusula de Responsabilidades do Contratante
 */
export function generateClientResponsibilitiesClause(): string {
  return `
CLÁUSULA TERCEIRA – DAS RESPONSABILIDADES DO CONTRATANTE

3.1. O CONTRATANTE obriga-se a:
   a) Fornecer todas as informações e documentos necessários à prestação dos serviços;
   b) Prestar informações verídicas e completas;
   c) Comparecer quando solicitado para consultas e reuniões;
   d) Efetuar o pagamento dos honorários na forma pactuada;
   e) Comunicar ao CONTRATADO qualquer alteração em seus dados de contato;
   f) Informar fatos novos relevantes para a condução do trabalho.

3.2. A omissão de informações relevantes pelo CONTRATANTE poderá prejudicar a prestação dos serviços.
`.trim()
}

/**
 * Cláusula de Prazo (customizável)
 */
export function generateDeadlineClause(estimatedTimeline: string): string {
  return `
CLÁUSULA QUARTA – DO PRAZO

4.1. O prazo estimado para conclusão dos trabalhos é de ${estimatedTimeline}, contado da data de recebimento de toda documentação necessária.

4.2. Este prazo é meramente estimativo, podendo ser prorrogado em função de:
   a) Complexidade do caso;
   b) Necessidade de diligências adicionais;
   c) Fatores externos (feriados forenses, recesso judiciário);
   d) Alterações legislativas ou jurisprudenciais;
   e) Caso fortuito ou força maior.

4.3. O CONTRATADO manterá o CONTRATANTE informado sobre o andamento dos trabalhos.
`.trim()
}

/**
 * Cláusula de Honorários (OAB Compliance)
 */
export function generateFeesClause(data: {
  valor_total: number
  forma_pagamento: string
  data_vencimento: string
}): string {
  const valorFormatado = data.valor_total.toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    style: 'currency',
    currency: 'BRL',
  })

  return `
CLÁUSULA QUINTA – DOS HONORÁRIOS ADVOCATÍCIOS

5.1. Pelos serviços ora contratados, o CONTRATANTE pagará ao CONTRATADO honorários no valor total de ${valorFormatado}.

5.2. Forma de pagamento: ${data.forma_pagamento}.

5.3. Vencimento: ${data.data_vencimento}.

5.4. Os honorários ora pactuados referem-se exclusivamente aos serviços descritos na CLÁUSULA PRIMEIRA.

5.5. Não estão inclusos nos honorários:
   a) Custas judiciais e extrajudiciais;
   b) Despesas com certidões, cópias e autenticações;
   c) Taxas de registro e protocolo;
   d) Honorários periciais;
   e) Outras despesas processuais.

5.6. O inadimplemento dos honorários advocatícios ensejará a incidência de multa de 2% (dois por cento), juros de mora de 1% (um por cento) ao mês e correção monetária pelo INPC/IBGE.

5.7. Em caso de êxito na demanda, eventuais honorários de sucumbência serão devidos ao CONTRATADO nos termos dos artigos 22 e 23 do Código de Ética e Disciplina da OAB.
`.trim()
}

/**
 * Cláusula de Sigilo Profissional
 */
export function generateConfidentialityClause(): string {
  return `
CLÁUSULA SEXTA – DO SIGILO PROFISSIONAL

6.1. O CONTRATADO compromete-se a manter sigilo sobre todas as informações obtidas no exercício de suas funções, nos termos do artigo 34 do Código de Ética e Disciplina da OAB.

6.2. O sigilo profissional é direito e dever do advogado, persistindo mesmo após o término da relação contratual.

6.3. Informações protegidas pela LGPD (Lei Geral de Proteção de Dados) serão tratadas conforme legislação vigente.
`.trim()
}

/**
 * Cláusula de Rescisão
 */
export function generateTerminationClause(): string {
  return `
CLÁUSULA SÉTIMA – DA RESCISÃO

7.1. O presente contrato poderá ser rescindido:
   a) Por acordo entre as partes;
   b) Por renúncia do advogado, mediante comunicação prévia de 10 (dez) dias, preservando os interesses do cliente (art. 5º do Código de Ética OAB);
   c) Por revogação do mandato pelo cliente, a qualquer tempo;
   d) Por inadimplemento de quaisquer das obrigações assumidas.

7.2. Em caso de rescisão por iniciativa do CONTRATANTE sem justa causa, serão devidos os honorários proporcionais ao trabalho realizado, conforme artigo 48, § 3º do Código de Ética OAB.

7.3. A rescisão não exime o CONTRATANTE do pagamento dos valores vencidos até a data da rescisão.

7.4. Havendo rescisão com substituição de advogado, o CONTRATADO deverá entregar ao sucessor os autos e documentos relativos ao mandato, recebidos do constituinte (art. 11 do Código de Ética OAB).
`.trim()
}

/**
 * Cláusula de Foro
 */
export function generateJurisdictionClause(): string {
  return `
CLÁUSULA OITAVA – DO FORO

8.1. Fica eleito o foro da Comarca do Rio de Janeiro/RJ para dirimir quaisquer questões oriundas deste contrato, renunciando as partes a qualquer outro, por mais privilegiado que seja.
`.trim()
}

/**
 * Disposições Gerais
 */
export function generateGeneralProvisionsClause(): string {
  return `
CLÁUSULA NONA – DAS DISPOSIÇÕES GERAIS

9.1. O presente contrato rege-se pelo Estatuto da Advocacia (Lei 8.906/94), Código de Ética e Disciplina da OAB, e pelo Código Civil Brasileiro.

9.2. Este contrato é celebrado em caráter irrevogável e irretratável, obrigando as partes e seus sucessores.

9.3. Qualquer alteração ao presente contrato deverá ser formalizada por escrito e assinada por ambas as partes.

9.4. As comunicações entre as partes serão realizadas preferencialmente por e-mail, WhatsApp ou telefone.

9.5. O CONTRATANTE declara estar ciente de que:
   a) O advogado não garante resultado favorável, apenas a prestação diligente dos serviços;
   b) O êxito da demanda depende de fatores externos (provas, decisões judiciais, etc);
   c) Os prazos são estimativos e podem variar conforme complexidade do caso.
`.trim()
}

/**
 * Rodapé do Contrato (assinaturas)
 */
export function generateContractFooter(data: BaseContractData): string {
  return `

E, por estarem assim justos e contratados, firmam o presente instrumento eletronicamente, sendo válido e eficaz para todos os fins de direito.

Rio de Janeiro, ${data.data_contrato}.


__________________________________________________
${data.contratante_nome}
CPF ${data.contratante_cpf}
CONTRATANTE


__________________________________________________
${data.advogado_nome}
OAB/RJ ${data.advogado_oab}
CONTRATADO


---
GARCEZ PALHA - CONSULTORIA JURÍDICA & PERICIAL
364 anos de tradição jurídica
Rua Buenos Aires, 68, sala 401 - Centro - Rio de Janeiro/RJ
Tel: (21) 3942-0186 | contato@garcezpalha.com
OAB/RJ 219.390 | CONPEJ/RJ | CRECI/RJ

Contrato ID: ${data.conversation_id}
Produto: ${data.product_id}
Gerado digitalmente em ${data.data_contrato}
`.trim()
}

/**
 * Gera contrato completo usando template base
 */
export function generateBaseContract(data: BaseContractData, customClauses?: string[]): string {
  const sections = [
    generateContractHeader(data),
    '',
    generateObjectClause(data.servico_nome, data.servico_descricao),
    '',
    generateLawyerResponsibilitiesClause(),
    '',
    generateClientResponsibilitiesClause(),
    '',
    generateDeadlineClause(data.prazo_estimado),
    '',
    generateFeesClause({
      valor_total: data.valor_total,
      forma_pagamento: data.forma_pagamento,
      data_vencimento: data.data_vencimento,
    }),
    '',
    generateConfidentialityClause(),
    '',
  ]

  // Adiciona cláusulas customizadas se fornecidas
  if (customClauses && customClauses.length > 0) {
    customClauses.forEach((clause) => {
      sections.push(clause)
      sections.push('')
    })
  }

  sections.push(generateTerminationClause())
  sections.push('')
  sections.push(generateJurisdictionClause())
  sections.push('')
  sections.push(generateGeneralProvisionsClause())
  sections.push('')
  sections.push(generateContractFooter(data))

  return sections.join('\n')
}

/**
 * Helpers para formatação
 */
export function formatCurrency(value: number): string {
  return value.toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    style: 'currency',
    currency: 'BRL',
  })
}

export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })
}

export function extenso(num: number): string {
  const numeros = [
    'zero',
    'um',
    'dois',
    'três',
    'quatro',
    'cinco',
    'seis',
    'sete',
    'oito',
    'nove',
    'dez',
    'onze',
    'doze',
    'treze',
    'quatorze',
    'quinze',
    'dezesseis',
    'dezessete',
    'dezoito',
    'dezenove',
  ]

  const dezenas = [
    '',
    '',
    'vinte',
    'trinta',
    'quarenta',
    'cinquenta',
    'sessenta',
    'setenta',
    'oitenta',
    'noventa',
  ]

  if (num < 20) return numeros[num]
  if (num < 100) {
    const dezena = Math.floor(num / 10)
    const unidade = num % 10
    return unidade === 0 ? dezenas[dezena] : `${dezenas[dezena]} e ${numeros[unidade]}`
  }

  return num.toString()
}
