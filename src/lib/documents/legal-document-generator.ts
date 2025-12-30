/**
 * P2-003: Legal Document Generator
 * Sistema de geração de documentos jurídicos (petições, recursos, contestações)
 */

export type DocumentType =
  | 'peticao-inicial' // Petição inicial
  | 'contestacao' // Contestação
  | 'recurso-apelacao' // Apelação
  | 'recurso-agravo' // Agravo
  | 'embargos-declaracao' // Embargos de declaração
  | 'mandado-seguranca' // Mandado de Segurança
  | 'habeas-corpus' // Habeas Corpus
  | 'acao-revisional' // Ação Revisional
  | 'defesa-previa' // Defesa Prévia
  | 'memoriais' // Memoriais

export interface DocumentData {
  // Partes
  autor: { nome: string; cpf: string; endereco: string; profissao?: string }
  reu: { nome: string; cnpj?: string; cpf?: string; endereco: string }
  advogado: { nome: string; oab: string }

  // Dados processuais
  comarca: string
  vara?: string
  juiz?: string
  numeroProcesso?: string
  valorCausa?: number

  // Conteúdo
  fatos: string[] // Array de parágrafos descrevendo os fatos
  fundamentacao: string[] // Base legal e jurisprudência
  pedidos: string[] // Lista de pedidos

  // Metadados
  categoria: string // bancario, previdenciario, consumidor, etc.
  urgente?: boolean
  tutelaAntecipada?: boolean
}

export class LegalDocumentGenerator {
  /**
   * Método principal: gera documento baseado no tipo
   */
  generate(type: DocumentType, data: DocumentData): string {
    switch (type) {
      case 'peticao-inicial':
        return this.generatePeticaoInicial(data)
      case 'contestacao':
        return this.generateContestacao(data)
      case 'recurso-apelacao':
        return this.generateRecursoApelacao(data)
      case 'recurso-agravo':
        return this.generateRecursoAgravo(data)
      case 'embargos-declaracao':
        return this.generateEmbargosDeclaracao(data)
      case 'mandado-seguranca':
        return this.generateMandadoSeguranca(data)
      case 'habeas-corpus':
        return this.generateHabeasCorpus(data)
      case 'acao-revisional':
        return this.generateAcaoRevisional(data)
      case 'defesa-previa':
        return this.generateDefesaPrevia(data)
      case 'memoriais':
        return this.generateMemoriais(data)
      default:
        throw new Error(`Tipo de documento não suportado: ${type}`)
    }
  }

  /**
   * Gera petição inicial completa
   */
  generatePeticaoInicial(data: DocumentData): string {
    return `
EXCELENTÍSSIMO(A) SENHOR(A) DOUTOR(A) JUIZ(ÍZA) DE DIREITO DA ${data.vara || 'VARA CÍVEL'} DA COMARCA DE ${data.comarca.toUpperCase()}

${data.autor.nome}, ${data.autor.profissao || 'brasileiro(a)'}, ${this.getEstadoCivil()}, portador(a) do CPF nº ${this.formatCPF(data.autor.cpf)}, residente e domiciliado(a) em ${data.autor.endereco}, por seu advogado que esta subscreve (doc. 01 - procuração), com endereço profissional na Rua Buenos Aires, 68, sala 401, Centro, Rio de Janeiro/RJ, onde recebe intimações, vem, respeitosamente, à presença de Vossa Excelência, propor

AÇÃO ${this.getTipoAcao(data.categoria).toUpperCase()}

em face de ${data.reu.nome}, ${data.reu.cnpj ? `CNPJ nº ${this.formatCNPJ(data.reu.cnpj)}` : `CPF nº ${this.formatCPF(data.reu.cpf!)}`}, com sede/endereço em ${data.reu.endereco}, pelos fatos e fundamentos a seguir expostos:

I - DOS FATOS

${data.fatos.map((fato, i) => `${i + 1}. ${fato}`).join('\n\n')}

II - DO DIREITO

${data.fundamentacao.map((fund, i) => `${i + 1}. ${fund}`).join('\n\n')}

III - DO PEDIDO DE TUTELA ANTECIPADA ${data.tutelaAntecipada ? '' : '(SE APLICÁVEL)'}

${data.tutelaAntecipada ? this.generateTutelaAntecipada(data) : 'Não se aplica ao presente caso.'}

IV - DOS PEDIDOS

Diante do exposto, requer-se a Vossa Excelência:

${data.pedidos.map((pedido, i) => `${String.fromCharCode(97 + i)}) ${pedido};`).join('\n\n')}

Requer-se, por fim:

a) A citação do(a) Réu(Ré) no endereço declinado, para querendo, apresentar contestação, sob pena de revelia e confissão quanto à matéria de fato;

b) A procedência dos pedidos, nos termos da fundamentação e pedidos acima expostos;

c) A condenação do(a) Réu(Ré) ao pagamento de custas processuais e honorários advocatícios, nos termos do artigo 85 do CPC;

d) A produção de todos os meios de prova em direito admitidos, notadamente documental, pericial e testemunhal;

e) Seja deferido o benefício da justiça gratuita, por ser o(a) Autor(a) hipossuficiente economicamente.

Dá-se à causa o valor de R$ ${this.formatCurrency(data.valorCausa || 10000)}.

Termos em que,
Pede deferimento.

${data.comarca}, ${this.getCurrentDate()}.

_______________________________
${data.advogado.nome}
OAB/RJ ${data.advogado.oab}
Advogado do(a) Autor(a)
`.trim()
  }

  /**
   * Gera contestação
   */
  generateContestacao(data: DocumentData): string {
    return `
EXCELENTÍSSIMO(A) SENHOR(A) DOUTOR(A) JUIZ(ÍZA) DE DIREITO DA ${data.vara || 'VARA CÍVEL'} DA COMARCA DE ${data.comarca.toUpperCase()}

Processo nº ${data.numeroProcesso}

${data.reu.nome}, já qualificado(a) nos autos do processo em epígrafe, por seu advogado que esta subscreve, vem, respeitosamente, à presença de Vossa Excelência, apresentar

CONTESTAÇÃO

em face da ação movida por ${data.autor.nome}, pelas razões de fato e de direito a seguir expostas:

I - PRELIMINARES

[Inserir preliminares se aplicável: incompetência, ilegitimidade, etc.]

II - DO MÉRITO

${data.fatos.map((fato, i) => `${i + 1}. ${fato}`).join('\n\n')}

III - DO DIREITO

${data.fundamentacao.map((fund, i) => `${i + 1}. ${fund}`).join('\n\n')}

IV - DOS PEDIDOS

Diante do exposto, requer-se a Vossa Excelência:

${data.pedidos.map((pedido, i) => `${String.fromCharCode(97 + i)}) ${pedido};`).join('\n\n')}

Termos em que,
Pede deferimento.

${data.comarca}, ${this.getCurrentDate()}.

_______________________________
${data.advogado.nome}
OAB/RJ ${data.advogado.oab}
Advogado do(a) Réu(Ré)
`.trim()
  }

  /**
   * Gera recurso de apelação
   */
  generateRecursoApelacao(data: DocumentData): string {
    return `
EXCELENTÍSSIMO(A) SENHOR(A) DOUTOR(A) JUIZ(ÍZA) DE DIREITO DA ${data.vara || 'VARA CÍVEL'} DA COMARCA DE ${data.comarca.toUpperCase()}

Processo nº ${data.numeroProcesso}

${data.autor.nome}, já qualificado(a) nos autos do processo em epígrafe, inconformado(a) com a r. sentença proferida em ${this.getCurrentDate()}, vem, respeitosamente, por seu advogado que esta subscreve, interpor

RECURSO DE APELAÇÃO

com fundamento no artigo 1.009 do Código de Processo Civil, pelas razões de fato e de direito a seguir expostas:

I - DA TEMPESTIVIDADE

O presente recurso é tempestivo, tendo sido interposto dentro do prazo legal de 15 (quinze) dias, conforme artigo 1.003, §5º do CPC.

II - DO CABIMENTO

O recurso de apelação é cabível contra sentença, nos termos do artigo 1.009 do CPC.

III - DAS RAZÕES DO RECURSO

${data.fatos.map((fato, i) => `${i + 1}. ${fato}`).join('\n\n')}

IV - DO DIREITO

${data.fundamentacao.map((fund, i) => `${i + 1}. ${fund}`).join('\n\n')}

V - DOS PEDIDOS

Diante do exposto, requer-se:

${data.pedidos.map((pedido, i) => `${String.fromCharCode(97 + i)}) ${pedido};`).join('\n\n')}

Termos em que,
Pede deferimento.

${data.comarca}, ${this.getCurrentDate()}.

_______________________________
${data.advogado.nome}
OAB/RJ ${data.advogado.oab}
Advogado(a) do(a) Apelante
`.trim()
  }

  /**
   * Gera mandado de segurança
   */
  generateMandadoSeguranca(data: DocumentData): string {
    return `
EXCELENTÍSSIMO(A) SENHOR(A) DOUTOR(A) JUIZ(ÍZA) DE DIREITO DA ${data.vara || 'VARA DA FAZENDA PÚBLICA'} DA COMARCA DE ${data.comarca.toUpperCase()}

${data.autor.nome}, ${data.autor.profissao || 'brasileiro(a)'}, portador(a) do CPF nº ${this.formatCPF(data.autor.cpf)}, residente e domiciliado(a) em ${data.autor.endereco}, por seu advogado que esta subscreve, vem, respeitosamente, à presença de Vossa Excelência, impetrar

MANDADO DE SEGURANÇA

com pedido de LIMINAR, em face de ${data.reu.nome}, ${data.reu.cnpj ? `CNPJ nº ${this.formatCNPJ(data.reu.cnpj)}` : `CPF nº ${this.formatCPF(data.reu.cpf!)}`}, com sede/endereço em ${data.reu.endereco}, pelos fatos e fundamentos a seguir expostos:

I - DOS FATOS

${data.fatos.map((fato, i) => `${i + 1}. ${fato}`).join('\n\n')}

II - DO DIREITO LÍQUIDO E CERTO

${data.fundamentacao.map((fund, i) => `${i + 1}. ${fund}`).join('\n\n')}

III - DA LIMINAR

Requer-se a concessão de LIMINAR, com fundamento no artigo 7º, III da Lei 12.016/2009, pelos seguintes fundamentos:

a) Presença de relevância jurídica (fumus boni iuris): O direito líquido e certo do impetrante está devidamente demonstrado pelos documentos acostados aos autos;

b) Risco de dano irreparável (periculum in mora): A demora na concessão da ordem causará danos irreparáveis ou de difícil reparação ao impetrante;

c) Verossimilhança das alegações: Os fatos narrados encontram respaldo na documentação apresentada.

IV - DOS PEDIDOS

Diante do exposto, requer-se a Vossa Excelência:

a) A concessão de LIMINAR para determinar que a autoridade coatora ${data.pedidos[0] || 'suspenda imediatamente os efeitos do ato impugnado'};

${data.pedidos.slice(1).map((pedido, i) => `${String.fromCharCode(98 + i)}) ${pedido};`).join('\n\n')}

c) A notificação da autoridade coatora para prestar informações no prazo legal;

d) A audiência do representante judicial da pessoa jurídica interessada;

e) A oitiva do Ministério Público;

f) A procedência do pedido, confirmando-se a liminar concedida e concedendo-se a segurança em definitivo;

g) A condenação da autoridade coatora ao pagamento de custas e honorários advocatícios.

Termos em que,
Pede deferimento.

${data.comarca}, ${this.getCurrentDate()}.

_______________________________
${data.advogado.nome}
OAB/RJ ${data.advogado.oab}
Advogado(a) do(a) Impetrante
`.trim()
  }

  /**
   * Gera habeas corpus
   */
  generateHabeasCorpus(data: DocumentData): string {
    return `
EXCELENTÍSSIMO(A) SENHOR(A) DOUTOR(A) JUIZ(ÍZA) DE DIREITO DA ${data.vara || 'VARA CRIMINAL'} DA COMARCA DE ${data.comarca.toUpperCase()}

${data.advogado.nome}, OAB/RJ ${data.advogado.oab}, com endereço profissional na Rua Buenos Aires, 68, sala 401, Centro, Rio de Janeiro/RJ, vem, respeitosamente, à presença de Vossa Excelência, impetrar

HABEAS CORPUS

com pedido de LIMINAR, em favor de ${data.autor.nome}, ${data.autor.profissao || 'brasileiro(a)'}, CPF nº ${this.formatCPF(data.autor.cpf)}, atualmente ${data.autor.endereco}, em face de ilegalidade/abuso de poder praticado por ${data.reu.nome}, pelos fatos e fundamentos a seguir expostos:

I - DOS FATOS

${data.fatos.map((fato, i) => `${i + 1}. ${fato}`).join('\n\n')}

II - DO CONSTRANGIMENTO ILEGAL

${data.fundamentacao.map((fund, i) => `${i + 1}. ${fund}`).join('\n\n')}

III - DA LIMINAR

Requer-se a concessão de LIMINAR, com fundamento no artigo 660 do Código de Processo Penal, para:

a) Determinar a imediata soltura do paciente, cessando-se o constrangimento ilegal;

b) Revogar a prisão preventiva decretada ilegalmente;

c) Determinar que o paciente aguarde em liberdade o julgamento do presente writ.

A concessão da liminar se justifica pela presença dos requisitos do fumus boni iuris (flagrante ilegalidade da prisão) e do periculum in mora (risco de dano irreparável à liberdade individual).

IV - DOS PEDIDOS

Diante do exposto, requer-se a Vossa Excelência:

a) A concessão de LIMINAR para determinar a imediata soltura do paciente;

${data.pedidos.map((pedido, i) => `${String.fromCharCode(98 + i)}) ${pedido};`).join('\n\n')}

Requer-se, ainda:

- A notificação da autoridade coatora para prestar informações;
- A oitiva do Ministério Público;
- A concessão definitiva da ordem de habeas corpus, confirmando-se a liminar;
- A expedição do alvará de soltura em favor do paciente.

Termos em que,
Pede deferimento.

${data.comarca}, ${this.getCurrentDate()}.

_______________________________
${data.advogado.nome}
OAB/RJ ${data.advogado.oab}
Advogado(a) do(a) Paciente
`.trim()
  }

  /**
   * Gera embargos de declaração
   */
  generateEmbargosDeclaracao(data: DocumentData): string {
    return `
EXCELENTÍSSIMO(A) SENHOR(A) DOUTOR(A) JUIZ(ÍZA) DE DIREITO DA ${data.vara || 'VARA CÍVEL'} DA COMARCA DE ${data.comarca.toUpperCase()}

Processo nº ${data.numeroProcesso}

${data.autor.nome}, já qualificado(a) nos autos do processo em epígrafe, por seu advogado que esta subscreve, vem, respeitosamente, à presença de Vossa Excelência, opor

EMBARGOS DE DECLARAÇÃO

com fundamento no artigo 1.022 do Código de Processo Civil, em face da ${data.juiz ? `decisão/sentença proferida pelo MM. Juiz ${data.juiz}` : 'decisão/sentença proferida'}, pelos seguintes fundamentos:

I - DA TEMPESTIVIDADE

Os presentes embargos são tempestivos, tendo sido opostos dentro do prazo legal de 5 (cinco) dias, conforme artigo 1.023 do CPC.

II - DO CABIMENTO

Os embargos de declaração são cabíveis quando houver, na sentença ou no acórdão, obscuridade, contradição, omissão ou erro material (artigo 1.022 do CPC).

III - DA OBSCURIDADE/CONTRADIÇÃO/OMISSÃO

${data.fatos.map((fato, i) => `${i + 1}. ${fato}`).join('\n\n')}

IV - DO DIREITO

${data.fundamentacao.map((fund, i) => `${i + 1}. ${fund}`).join('\n\n')}

V - DOS PEDIDOS

Diante do exposto, requer-se a Vossa Excelência:

${data.pedidos.map((pedido, i) => `${String.fromCharCode(97 + i)}) ${pedido};`).join('\n\n')}

Requer-se, ainda, nos termos do artigo 1.023, §2º do CPC, que os presentes embargos sejam recebidos com efeitos infringentes, modificando-se a decisão embargada.

Termos em que,
Pede deferimento.

${data.comarca}, ${this.getCurrentDate()}.

_______________________________
${data.advogado.nome}
OAB/RJ ${data.advogado.oab}
Advogado(a) do(a) Embargante
`.trim()
  }

  /**
   * Gera recurso de agravo
   */
  generateRecursoAgravo(data: DocumentData): string {
    return `
EXCELENTÍSSIMO(A) SENHOR(A) DOUTOR(A) JUIZ(ÍZA) DE DIREITO DA ${data.vara || 'VARA CÍVEL'} DA COMARCA DE ${data.comarca.toUpperCase()}

Processo nº ${data.numeroProcesso}

${data.autor.nome}, já qualificado(a) nos autos do processo em epígrafe, por seu advogado que esta subscreve, vem, respeitosamente, à presença de Vossa Excelência, interpor

AGRAVO DE INSTRUMENTO

com fundamento no artigo 1.015 do Código de Processo Civil, em face da decisão interlocutória que ${data.fatos[0] || 'indeferiu o pedido'}, pelos seguintes fundamentos:

I - DA TEMPESTIVIDADE

O presente recurso é tempestivo, tendo sido interposto dentro do prazo legal de 15 (quinze) dias, conforme artigo 1.003, §5º do CPC.

II - DO CABIMENTO

O agravo de instrumento é cabível contra decisão interlocutória que verse sobre as hipóteses do artigo 1.015 do CPC, especialmente:

${data.fundamentacao[0] || 'tutelas provisórias (inciso I)'}

III - DOS FATOS

${data.fatos.map((fato, i) => `${i + 1}. ${fato}`).join('\n\n')}

IV - DO DIREITO

${data.fundamentacao.map((fund, i) => `${i + 1}. ${fund}`).join('\n\n')}

V - DO PEDIDO DE EFEITO SUSPENSIVO/ANTECIPAÇÃO DA TUTELA RECURSAL

Requer-se, com fundamento no artigo 1.019, I do CPC, a concessão de EFEITO SUSPENSIVO ao presente recurso, ou a ANTECIPAÇÃO DA TUTELA RECURSAL, para suspender os efeitos da decisão agravada até o julgamento final do recurso.

A medida se justifica pela presença dos requisitos legais:

a) Probabilidade de provimento do recurso;
b) Risco de dano grave, de difícil ou impossível reparação.

VI - DOS PEDIDOS

Diante do exposto, requer-se a Vossa Excelência:

a) O recebimento do presente agravo de instrumento;

b) A concessão de efeito suspensivo ou antecipação da tutela recursal;

${data.pedidos.map((pedido, i) => `${String.fromCharCode(99 + i)}) ${pedido};`).join('\n\n')}

Requer-se, ainda, a intimação da parte contrária para apresentar contraminuta no prazo legal.

Termos em que,
Pede deferimento.

${data.comarca}, ${this.getCurrentDate()}.

_______________________________
${data.advogado.nome}
OAB/RJ ${data.advogado.oab}
Advogado(a) do(a) Agravante
`.trim()
  }

  /**
   * Gera ação revisional
   */
  generateAcaoRevisional(data: DocumentData): string {
    return `
EXCELENTÍSSIMO(A) SENHOR(A) DOUTOR(A) JUIZ(ÍZA) DE DIREITO DA ${data.vara || 'VARA CÍVEL'} DA COMARCA DE ${data.comarca.toUpperCase()}

${data.autor.nome}, ${data.autor.profissao || 'brasileiro(a)'}, portador(a) do CPF nº ${this.formatCPF(data.autor.cpf)}, residente e domiciliado(a) em ${data.autor.endereco}, por seu advogado que esta subscreve, vem, respeitosamente, à presença de Vossa Excelência, propor

AÇÃO REVISIONAL DE CONTRATO BANCÁRIO
c/c REPETIÇÃO DE INDÉBITO E INDENIZAÇÃO POR DANOS MORAIS

em face de ${data.reu.nome}, ${data.reu.cnpj ? `CNPJ nº ${this.formatCNPJ(data.reu.cnpj)}` : `CPF nº ${this.formatCPF(data.reu.cpf!)}`}, com sede em ${data.reu.endereco}, pelos fatos e fundamentos a seguir expostos:

I - DOS FATOS

${data.fatos.map((fato, i) => `${i + 1}. ${fato}`).join('\n\n')}

II - DAS IRREGULARIDADES CONTRATUAIS

O contrato bancário firmado entre as partes apresenta diversas irregularidades que ensejam sua revisão judicial:

a) Cobrança de juros abusivos e acima da média de mercado;
b) Capitalização de juros (anatocismo) sem autorização legal;
c) Cobrança de tarifas não previstas em lei (Resolução CMN 3.919/2010);
d) Venda casada de produtos (seguros, cartões) em violação ao CDC;
e) Ausência de informações claras sobre encargos (CDC, art. 52).

III - DO DIREITO

${data.fundamentacao.map((fund, i) => `${i + 1}. ${fund}`).join('\n\n')}

IV - DA TUTELA ANTECIPADA

Requer-se, com fundamento no artigo 300 do CPC, a concessão de TUTELA DE URGÊNCIA ANTECIPADA para:

a) Determinar a revisão imediata do contrato, recalculando-se as parcelas com a exclusão das cobranças indevidas;
b) Determinar a suspensão da negativação do nome do autor junto aos órgãos de proteção ao crédito;
c) Autorizar o depósito judicial do valor incontroverso das parcelas.

V - DOS PEDIDOS

Diante do exposto, requer-se a Vossa Excelência:

${data.pedidos.map((pedido, i) => `${String.fromCharCode(97 + i)}) ${pedido};`).join('\n\n')}

Requer-se, por fim:

a) A citação do Réu para contestar, sob pena de revelia;
b) A procedência dos pedidos;
c) A condenação do Réu ao pagamento de custas e honorários advocatícios;
d) A produção de prova pericial contábil para apuração dos valores cobrados indevidamente;
e) A condenação do Réu ao pagamento de indenização por danos morais em valor não inferior a R$ 10.000,00.

Dá-se à causa o valor de R$ ${this.formatCurrency(data.valorCausa || 50000)}.

Termos em que,
Pede deferimento.

${data.comarca}, ${this.getCurrentDate()}.

_______________________________
${data.advogado.nome}
OAB/RJ ${data.advogado.oab}
Advogado(a) do(a) Autor(a)
`.trim()
  }

  /**
   * Gera defesa prévia
   */
  generateDefesaPrevia(data: DocumentData): string {
    return `
EXCELENTÍSSIMO(A) SENHOR(A) DOUTOR(A) JUIZ(ÍZA) DE DIREITO DA ${data.vara || 'VARA CRIMINAL'} DA COMARCA DE ${data.comarca.toUpperCase()}

Processo/Inquérito nº ${data.numeroProcesso}

${data.autor.nome}, ${data.autor.profissao || 'brasileiro(a)'}, portador(a) do CPF nº ${this.formatCPF(data.autor.cpf)}, residente em ${data.autor.endereco}, por seu advogado que esta subscreve, vem, respeitosamente, à presença de Vossa Excelência, apresentar

DEFESA PRÉVIA

nos termos do artigo 396-A do Código de Processo Penal, pelas razões de fato e de direito a seguir expostas:

I - DA PRELIMINAR DE ABSOLVIÇÃO SUMÁRIA

Requer-se, preliminarmente, a ABSOLVIÇÃO SUMÁRIA do acusado, com fundamento no artigo 397 do CPP, pelas seguintes razões:

${data.fatos.map((fato, i) => `${i + 1}. ${fato}`).join('\n\n')}

II - DA REJEIÇÃO DA DENÚNCIA

Subsidiariamente, requer-se a REJEIÇÃO DA DENÚNCIA, nos termos do artigo 395 do CPP, por:

a) Ser manifestamente inepta;
b) Faltar pressuposto processual ou condição para o exercício da ação penal;
c) Faltar justa causa para o exercício da ação penal.

III - DO MÉRITO

${data.fundamentacao.map((fund, i) => `${i + 1}. ${fund}`).join('\n\n')}

IV - DAS TESES DEFENSIVAS

A defesa sustenta as seguintes teses:

a) Ausência de materialidade delitiva;
b) Atipicidade da conduta imputada;
c) Ausência de dolo ou culpa;
d) Presença de excludente de ilicitude/culpabilidade;
e) Insuficiência probatória para condenação.

V - DOS PEDIDOS

Diante do exposto, requer-se a Vossa Excelência:

${data.pedidos.map((pedido, i) => `${String.fromCharCode(97 + i)}) ${pedido};`).join('\n\n')}

Requer-se, ainda:

- A absolvição sumária do acusado (art. 397 do CPP);
- Subsidiariamente, a rejeição da denúncia (art. 395 do CPP);
- A produção de provas em direito admitidas (testemunhal, documental, pericial);
- A oitiva de testemunhas arroladas pela defesa.

Termos em que,
Pede deferimento.

${data.comarca}, ${this.getCurrentDate()}.

_______________________________
${data.advogado.nome}
OAB/RJ ${data.advogado.oab}
Advogado(a) do(a) Acusado(a)
`.trim()
  }

  /**
   * Gera memoriais
   */
  generateMemoriais(data: DocumentData): string {
    return `
EXCELENTÍSSIMO(A) SENHOR(A) DOUTOR(A) JUIZ(ÍZA) DE DIREITO DA ${data.vara || 'VARA CÍVEL'} DA COMARCA DE ${data.comarca.toUpperCase()}

Processo nº ${data.numeroProcesso}

${data.autor.nome}, já qualificado(a) nos autos do processo em epígrafe, por seu advogado que esta subscreve, vem, respeitosamente, à presença de Vossa Excelência, apresentar

MEMORIAIS

nos termos do artigo 364, §2º do Código de Processo Civil, ratificando e reiterando os argumentos apresentados na inicial/contestação, acrescidos das provas produzidas ao longo da instrução processual.

I - BREVE SÍNTESE DOS FATOS

${data.fatos.map((fato, i) => `${i + 1}. ${fato}`).join('\n\n')}

II - DAS PROVAS PRODUZIDAS

Durante a instrução processual, restou amplamente demonstrado:

a) Prova documental: Os documentos acostados aos autos comprovam de forma inequívoca os fatos alegados na inicial;
b) Prova testemunhal: As testemunhas ouvidas confirmaram a versão apresentada pela parte;
c) Prova pericial: O laudo pericial atestou [descrever conclusões periciais];
d) Prova emprestada: [se aplicável].

III - DO DIREITO APLICÁVEL

${data.fundamentacao.map((fund, i) => `${i + 1}. ${fund}`).join('\n\n')}

IV - DA JURISPRUDÊNCIA

A matéria encontra amparo na jurisprudência dominante dos Tribunais Superiores:

[Citar jurisprudência relevante - STJ, STF, TJ-RJ]

V - DAS RAZÕES FINAIS

Analisando-se o conjunto probatório produzido nos autos, verifica-se que:

a) Os fatos alegados restaram plenamente comprovados;
b) O direito pleiteado encontra amparo na legislação vigente e na jurisprudência;
c) A parte contrária não conseguiu provar suas alegações;
d) Inexistem elementos que possam afastar a pretensão deduzida.

VI - DOS PEDIDOS

Diante de todo o exposto, requer-se a Vossa Excelência:

${data.pedidos.map((pedido, i) => `${String.fromCharCode(97 + i)}) ${pedido};`).join('\n\n')}

Requer-se, por fim, a TOTAL PROCEDÊNCIA dos pedidos formulados na inicial, condenando-se a parte contrária ao pagamento de custas processuais e honorários advocatícios.

Termos em que,
Pede deferimento.

${data.comarca}, ${this.getCurrentDate()}.

_______________________________
${data.advogado.nome}
OAB/RJ ${data.advogado.oab}
Advogado(a)
`.trim()
  }

  /**
   * Helpers
   */
  private getTipoAcao(categoria: string): string {
    const tipos: Record<string, string> = {
      bancario: 'REVISIONAL DE CONTRATO BANCÁRIO',
      previdenciario: 'PREVIDENCIÁRIA',
      consumidor: 'INDENIZATÓRIA POR DANOS MORAIS E MATERIAIS',
      saude: 'DE OBRIGAÇÃO DE FAZER C/C INDENIZAÇÃO',
      trabalhista: 'TRABALHISTA',
      imobiliario: 'DE RESCISÃO CONTRATUAL',
    }
    return tipos[categoria] || 'ORDINÁRIA'
  }

  private generateTutelaAntecipada(data: DocumentData): string {
    return `
Requer-se, com fundamento no artigo 300 do CPC, a concessão de TUTELA DE URGÊNCIA ANTECIPADA, pelos seguintes fundamentos:

a) PROBABILIDADE DO DIREITO: Conforme demonstrado nos documentos anexos e na fundamentação legal exposta, o direito do(a) Autor(a) é evidente e está amparado pela legislação vigente e jurisprudência consolidada;

b) PERIGO DE DANO: A demora na prestação jurisdicional causará danos irreparáveis ou de difícil reparação ao(à) Autor(a);

c) REVERSIBILIDADE: A medida pleiteada não causará danos irreversíveis à parte contrária.

Assim, requer-se a concessão LIMINAR da tutela antecipada, para determinar que o(a) Réu(Ré) [especificar medida urgente], sob pena de multa diária.
`.trim()
  }

  private formatCPF(cpf: string): string {
    const nums = cpf.replace(/\D/g, '')
    return nums.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
  }

  private formatCNPJ(cnpj: string): string {
    const nums = cnpj.replace(/\D/g, '')
    return nums.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5')
  }

  private formatCurrency(value: number): string {
    return value.toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
  }

  private getCurrentDate(): string {
    return new Date().toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    })
  }

  private getEstadoCivil(): string {
    return 'estado civil não informado'
  }
}

export const legalDocumentGenerator = new LegalDocumentGenerator()
