/**
 * Templates Customizados por Categoria
 * Sistema modular que gera cláusulas específicas baseado na categoria do produto
 *
 * Categorias cobertas:
 * - Telecom
 * - Consumidor
 * - Saúde
 * - Previdenciário
 * - Imobiliário
 * - Criminal
 * - Trabalhista
 */

import type { BaseContractData } from './base-contract'
import { formatCurrency } from './base-contract'

/**
 * TELECOM - Cláusulas específicas para operadoras
 */
export function generateTelecomServiceClause(data: {
  servico_nome: string
  operadora: string
  tipo_servico: string
  numero_linha?: string
  numero_protocolo?: string
}): string {
  return `
CLÁUSULA PRIMEIRA – DO OBJETO

1.1. O presente contrato tem por objeto a prestação de serviços advocatícios para ${data.servico_nome}, referente a serviço prestado pela operadora ${data.operadora}.

1.2. Tipo de serviço: ${data.tipo_servico}.

${data.numero_linha ? `1.3. Número da linha: ${data.numero_linha}.` : ''}

${data.numero_protocolo ? `1.4. Número de protocolo: ${data.numero_protocolo}.` : ''}

1.5. O CONTRATADO atuará judicialmente ou extrajudicialmente para solucionar o problema, incluindo:
   a) Cancelamento de cobranças indevidas;
   b) Restituição de valores pagos;
   c) Indenização por danos morais (quando aplicável);
   d) Cumprimento de obrigações contratuais pela operadora.
`.trim()
}

export function generateTelecomStrategyClause(data: { operadora: string }): string {
  return `
CLÁUSULA QUARTA – DA ATUAÇÃO JUNTO À OPERADORA

4.1. O CONTRATADO buscará primeiramente solução administrativa através de:
   a) Notificação extrajudicial à ${data.operadora};
   b) Reclamação na ANATEL (Agência Nacional de Telecomunicações);
   c) Plataforma Consumidor.gov.br.

4.2. Não havendo solução em 30 (trinta) dias, será ajuizada ação judicial.

4.3. A ação incluirá pedidos de:
   a) Declaração de inexistência de débito;
   b) Restituição em dobro de valores cobrados indevidamente (CDC art. 42);
   c) Indenização por danos morais (R$ 3.000 a R$ 10.000);
   d) Obrigação de fazer (portabilidade, religação, etc).

4.4. Acompanhamento de audiências conciliatórias e de instrução.
`.trim()
}

/**
 * CONSUMIDOR - Cláusulas para CDC geral
 */
export function generateConsumidorServiceClause(data: {
  servico_nome: string
  fornecedor: string
  produto_servico: string
  defeito_reclamado?: string
}): string {
  return `
CLÁUSULA PRIMEIRA – DO OBJETO

1.1. O presente contrato tem por objeto a prestação de serviços advocatícios para ${data.servico_nome}, fundamentado no Código de Defesa do Consumidor (Lei 8.078/90).

1.2. Fornecedor: ${data.fornecedor}.

1.3. Produto/Serviço: ${data.produto_servico}.

${data.defeito_reclamado ? `1.4. Problema identificado: ${data.defeito_reclamado}.` : ''}

1.5. O CONTRATADO atuará para:
   a) Reparação do produto ou devolução do valor pago;
   b) Indenização por danos materiais;
   c) Indenização por danos morais (quando aplicável);
   d) Cumprimento de garantia contratual ou legal.
`.trim()
}

export function generateConsumidorStrategyClause(): string {
  return `
CLÁUSULA QUARTA – DA ESTRATÉGIA CONSUMERISTA

4.1. Aplicação integral do Código de Defesa do Consumidor (CDC):
   a) Inversão do ônus da prova (art. 6º, VIII);
   b) Responsabilidade objetiva do fornecedor (art. 14);
   c) Solidariedade da cadeia de fornecimento;
   d) Garantia legal + contratual.

4.2. Tentativa de solução administrativa via:
   a) Procon;
   b) Consumidor.gov.br;
   c) SAC do fornecedor.

4.3. Ação judicial no Juizado Especial Cível (causas até 20 SM) ou Vara Cível.

4.4. Pedidos típicos:
   a) Devolução do valor pago com correção monetária;
   b) Restituição em dobro (art. 42, CDC);
   c) Danos morais (R$ 3.000 a R$ 15.000);
   d) Lucros cessantes (quando aplicável).
`.trim()
}

/**
 * SAÚDE - Plano de saúde (ANS)
 */
export function generateSaudeServiceClause(data: {
  servico_nome: string
  operadora_saude: string
  tipo_plano: string
  procedimento_negado?: string
}): string {
  return `
CLÁUSULA PRIMEIRA – DO OBJETO

1.1. O presente contrato tem por objeto a prestação de serviços advocatícios para ${data.servico_nome}, referente ao plano de saúde da operadora ${data.operadora_saude}.

1.2. Tipo de plano: ${data.tipo_plano}.

${data.procedimento_negado ? `1.3. Procedimento/Cobertura negada: ${data.procedimento_negado}.` : ''}

1.4. Fundamentação legal:
   a) Lei 9.656/98 (Lei dos Planos de Saúde);
   b) Resoluções da ANS (Agência Nacional de Saúde Suplementar);
   c) Código de Defesa do Consumidor (Lei 8.078/90);
   d) Súmula 102 do STJ (cobertura obrigatória).

1.5. O CONTRATADO atuará para garantir:
   a) Autorização do procedimento médico;
   b) Cobertura integral conforme rol ANS;
   c) Indenização por danos morais (se cabível);
   d) Reembolso de despesas médicas (se pagas pelo paciente).
`.trim()
}

export function generateSaudeStrategyClause(data: { operadora_saude: string }): string {
  return `
CLÁUSULA QUARTA – DA ATUAÇÃO JUNTO À OPERADORA E ANS

4.1. Fase administrativa:
   a) Notificação extrajudicial à ${data.operadora_saude};
   b) Reclamação na ANS (Agência Nacional de Saúde Suplementar);
   c) Solicitação de reanálise administrativa.

4.2. Fase judicial (se necessário):
   a) Ação com pedido de tutela de urgência (liberação imediata);
   b) Fundamentação em relatório médico;
   c) Pedido de danos morais (R$ 5.000 a R$ 20.000);
   d) Reembolso de despesas médicas suportadas pelo paciente.

4.3. Acompanhamento de urgência em casos de risco à saúde/vida.

4.4. Recurso administrativo na ANS (Notificação de Intermediação Preliminar - NIP).
`.trim()
}

/**
 * PREVIDENCIÁRIO - INSS
 */
export function generatePrevidenciarioServiceClause(data: {
  servico_nome: string
  tipo_beneficio: string
  numero_beneficio?: string
}): string {
  return `
CLÁUSULA PRIMEIRA – DO OBJETO

1.1. O presente contrato tem por objeto a prestação de serviços advocatícios para ${data.servico_nome}, referente a benefício previdenciário junto ao INSS.

1.2. Tipo de benefício: ${data.tipo_beneficio}.

${data.numero_beneficio ? `1.3. Número do benefício (NB): ${data.numero_beneficio}.` : ''}

1.4. Fundamentação legal:
   a) Lei 8.213/91 (Plano de Benefícios da Previdência Social);
   b) Lei 8.212/91 (Custeio da Previdência Social);
   c) Decreto 3.048/99 (Regulamento da Previdência Social).

1.5. O CONTRATADO atuará para:
   a) Concessão do benefício indeferido;
   b) Revisão do valor do benefício;
   c) Restabelecimento de benefício cessado;
   d) Recebimento de atrasados (valores retroativos).
`.trim()
}

export function generatePrevidenciarioStrategyClause(): string {
  return `
CLÁUSULA QUARTA – DA ATUAÇÃO PREVIDENCIÁRIA

4.1. Análise detalhada do CNIS (Cadastro Nacional de Informações Sociais).

4.2. Fase administrativa (quando cabível):
   a) Recurso administrativo ao INSS (prazo: 30 dias);
   b) Pedido de reconsideração;
   c) Juntada de documentos complementares.

4.3. Fase judicial:
   a) Ação em Juizado Especial Federal (causas até 60 SM) ou Vara Federal;
   b) Comprovação de tempo de contribuição;
   c) Prova de incapacidade laboral (quando aplicável);
   d) Perícia médica judicial;
   e) Implantação do benefício via liminar (quando urgente).

4.4. Pedido de tutela antecipada para pagamento imediato do benefício (casos de necessidade).

4.5. Cálculo de atrasados conforme Manual de Cálculos da Justiça Federal.

4.6. Honorários de sucumbência: até 20% sobre o valor das parcelas vencidas até a sentença (Súmula 111 STJ).
`.trim()
}

/**
 * IMOBILIÁRIO - Compra, venda, locação, usucapião
 */
export function generateImobiliarioServiceClause(data: {
  servico_nome: string
  tipo_negocio: string
  endereco_imovel?: string
}): string {
  return `
CLÁUSULA PRIMEIRA – DO OBJETO

1.1. O presente contrato tem por objeto a prestação de serviços advocatícios para ${data.servico_nome}.

1.2. Tipo de negócio: ${data.tipo_negocio}.

${data.endereco_imovel ? `1.3. Imóvel: ${data.endereco_imovel}.` : ''}

1.4. Fundamentação legal:
   a) Código Civil Brasileiro (Lei 10.406/02);
   b) Lei 8.245/91 (Lei do Inquilinato) - quando aplicável;
   c) Lei 6.766/79 (Parcelamento do Solo Urbano);
   d) Lei 4.591/64 (Condomínios e Incorporações).

1.5. O CONTRATADO prestará consultoria e assessoria jurídica imobiliária, incluindo:
   a) Análise de documentação do imóvel;
   b) Elaboração/revisão de contratos;
   c) Registro de escrituras;
   d) Regularização de imóveis;
   e) Ações judiciais relacionadas.
`.trim()
}

export function generateImobiliarioResponsibilitiesClause(): string {
  return `
CLÁUSULA QUARTA – DAS RESPONSABILIDADES ESPECÍFICAS

4.1. O CONTRATADO realizará:
   a) Análise de matrícula atualizada do imóvel;
   b) Verificação de ônus, penhoras e restrições;
   c) Certidões negativas (Distribuidor, INSS, Trabalhista);
   d) Análise de regularidade fiscal (IPTU, taxas condominiais);
   e) Verificação de documentação pessoal das partes.

4.2. O CONTRATADO não se responsabiliza por:
   a) Vícios ocultos não aparentes na documentação;
   b) Informações inverídicas prestadas pelas partes;
   c) Débitos não informados ou descobertos posteriormente.

4.3. Recomenda-se contratação de seguro de título para maior segurança.
`.trim()
}

/**
 * CRIMINAL - Defesa criminal
 */
export function generateCriminalServiceClause(data: {
  servico_nome: string
  tipo_crime: string
  vara_criminal?: string
}): string {
  return `
CLÁUSULA PRIMEIRA – DO OBJETO

1.1. O presente contrato tem por objeto a prestação de serviços advocatícios de defesa criminal para ${data.servico_nome}.

1.2. Tipo penal: ${data.tipo_crime}.

${data.vara_criminal ? `1.3. Vara Criminal: ${data.vara_criminal}.` : ''}

1.4. Fundamentação legal:
   a) Código Penal (Decreto-Lei 2.848/40);
   b) Código de Processo Penal (Decreto-Lei 3.689/41);
   c) Lei 9.099/95 (Juizados Especiais Criminais);
   d) Lei 13.964/19 (Pacote Anticrime);
   e) Constituição Federal (garantias processuais).

1.5. O CONTRATADO atuará para garantir ampla defesa e devido processo legal, incluindo:
   a) Defesa em inquérito policial;
   b) Defesa em ação penal;
   c) Recursos cabíveis;
   d) Habeas corpus (quando necessário);
   e) Negociação de acordo de não persecução penal (ANPP).
`.trim()
}

export function generateCriminalStrategyClause(): string {
  return `
CLÁUSULA QUARTA – DA ESTRATÉGIA DE DEFESA

4.1. Fase de inquérito policial:
   a) Acompanhamento de depoimentos;
   b) Apresentação de provas de defesa;
   c) Requerimento de diligências;
   d) Pedido de arquivamento (quando cabível).

4.2. Fase processual:
   a) Defesa prévia;
   b) Alegações finais;
   c) Sustentação oral em júri (crimes dolosos contra a vida);
   d) Recursos (apelação, embargos, especial, extraordinário).

4.3. Medidas cautelares:
   a) Pedido de liberdade provisória;
   b) Revogação de prisão preventiva;
   c) Substituição por medidas alternativas;
   d) Habeas corpus preventivo ou liberatório.

4.4. Benefícios legais:
   a) Transação penal (crimes de menor potencial ofensivo);
   b) Suspensão condicional do processo;
   c) Acordo de não persecução penal (ANPP);
   d) Súmula 444 STJ (fixação de regime inicial).

4.5. O CONTRATADO manterá absoluto sigilo profissional sobre fatos narrados pelo CONTRATANTE.
`.trim()
}

/**
 * TRABALHISTA - Ações trabalhistas
 */
export function generateTrabalhistaServiceClause(data: {
  servico_nome: string
  empresa: string
  cargo_funcao: string
  data_demissao?: string
}): string {
  return `
CLÁUSULA PRIMEIRA – DO OBJETO

1.1. O presente contrato tem por objeto a prestação de serviços advocatícios para ${data.servico_nome}.

1.2. Empresa (reclamada): ${data.empresa}.

1.3. Cargo/Função: ${data.cargo_funcao}.

${data.data_demissao ? `1.4. Data da demissão: ${data.data_demissao}.` : ''}

1.5. Fundamentação legal:
   a) CLT - Consolidação das Leis do Trabalho (Decreto-Lei 5.452/43);
   b) Constituição Federal (art. 7º - direitos dos trabalhadores);
   c) Lei 13.467/17 (Reforma Trabalhista);
   d) Súmulas e OJs do TST.

1.6. O CONTRATADO ajuizará reclamação trabalhista para pleitear:
   a) Verbas rescisórias não pagas;
   b) Horas extras;
   c) Diferenças salariais;
   d) Adicional de insalubridade/periculosidade;
   e) FGTS + multa 40%;
   f) Danos morais (quando aplicável);
   g) Outros direitos trabalhistas devidos.
`.trim()
}

export function generateTrabalhistaStrategyClause(): string {
  return `
CLÁUSULA QUARTA – DA ATUAÇÃO TRABALHISTA

4.1. Ajuizamento de reclamação trabalhista na Vara do Trabalho competente.

4.2. Audiências:
   a) Audiência inicial (tentativa de conciliação);
   b) Audiência de instrução (colheita de provas);
   c) Sustentação oral (quando necessário).

4.3. Provas:
   a) Testemunhas (até 3 por fato);
   b) Documentos (contracheques, contratos, comunicações);
   c) Perícia técnica (insalubridade, periculosidade, acidente).

4.4. Recursos:
   a) Recurso ordinário (TRT);
   b) Recurso de revista (TST);
   c) Embargos de declaração.

4.5. Execução:
   a) Cálculos de liquidação;
   b) Penhora de bens da empresa;
   c) Bloqueio de contas (SISBAJUD).

4.6. Honorários sucumbenciais: 5% a 15% sobre o valor da condenação (art. 791-A da CLT).

4.7. Custas processuais: Apenas em caso de perda (art. 790-B da CLT + Reforma Trabalhista).
`.trim()
}

/**
 * Factory function - Retorna cláusulas customizadas por categoria
 */
export function getCategorySpecificClauses(
  category: string,
  data: any
): { serviceClause: string; strategClause?: string; additionalClause?: string } {
  switch (category) {
    case 'telecom':
      return {
        serviceClause: generateTelecomServiceClause(data),
        strategClause: generateTelecomStrategyClause(data),
      }

    case 'consumidor':
      return {
        serviceClause: generateConsumidorServiceClause(data),
        strategClause: generateConsumidorStrategyClause(),
      }

    case 'saude':
      return {
        serviceClause: generateSaudeServiceClause(data),
        strategClause: generateSaudeStrategyClause(data),
      }

    case 'previdenciario':
      return {
        serviceClause: generatePrevidenciarioServiceClause(data),
        strategClause: generatePrevidenciarioStrategyClause(),
      }

    case 'imobiliario':
      return {
        serviceClause: generateImobiliarioServiceClause(data),
        additionalClause: generateImobiliarioResponsibilitiesClause(),
      }

    case 'criminal':
      return {
        serviceClause: generateCriminalServiceClause(data),
        strategClause: generateCriminalStrategyClause(),
      }

    case 'trabalhista':
      return {
        serviceClause: generateTrabalhistaServiceClause(data),
        strategClause: generateTrabalhistaStrategyClause(),
      }

    default:
      return {
        serviceClause: '',
      }
  }
}
