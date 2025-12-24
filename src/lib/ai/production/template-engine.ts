/**
 * Template Engine for Legal Documents
 * Manages document templates for automated generation
 *
 * Templates support:
 * - Variable substitution: {{VARIABLE_NAME}}
 * - Conditional blocks: {{#IF VARIABLE}}...{{/IF}}
 * - Loops: {{#EACH items}}...{{/EACH}}
 */

export interface DocumentTemplate {
  id: string
  type: string
  title: string
  category: 'financeiro' | 'imobiliario' | 'previdenciario' | 'criminal' | 'trabalhista' | 'consumidor' | 'geral'
  description: string
  content: string
  requiredVariables: string[]
  optionalVariables?: string[]
  requiresAI: boolean
  estimatedPages: number
  createdAt: Date
  updatedAt: Date
}

// Base templates for legal documents
const TEMPLATES: Map<string, DocumentTemplate> = new Map([
  // Financial Protection Templates
  ['peticao-desbloqueio-conta', {
    id: 'peticao-desbloqueio-conta',
    type: 'peticao-desbloqueio-conta',
    title: 'Petição de Desbloqueio de Conta Bancária',
    category: 'financeiro',
    description: 'Petição para desbloqueio de conta bancária indevidamente bloqueada',
    content: `EXCELENTÍSSIMO(A) SENHOR(A) DOUTOR(A) JUIZ(A) DE DIREITO DA {{VARA}} VARA CÍVEL DA COMARCA DE {{COMARCA}}

{{CLIENTE_NOME}}, {{CLIENTE_NACIONALIDADE}}, {{CLIENTE_ESTADO_CIVIL}}, {{CLIENTE_PROFISSAO}}, portador(a) do RG nº {{CLIENTE_RG}} e inscrito(a) no CPF sob o nº {{CLIENTE_CPF}}, residente e domiciliado(a) na {{CLIENTE_ENDERECO}}, vem, respeitosamente, à presença de Vossa Excelência, por seu advogado que esta subscreve (procuração anexa), com fundamento no art. 833, IV e X, do Código de Processo Civil, propor a presente

AÇÃO DE DESBLOQUEIO DE CONTA BANCÁRIA COM PEDIDO DE TUTELA DE URGÊNCIA

em face de {{BANCO_NOME}}, pessoa jurídica de direito privado, inscrita no CNPJ sob o nº {{BANCO_CNPJ}}, com sede na {{BANCO_ENDERECO}}, pelos fatos e fundamentos a seguir expostos:

I - DOS FATOS

{{NARRATIVA_FATOS}}

A conta corrente nº {{CONTA_NUMERO}}, agência {{CONTA_AGENCIA}}, foi bloqueada em {{DATA_BLOQUEIO}}, por motivo de {{MOTIVO_BLOQUEIO}}.

{{#IF VALOR_BLOQUEADO}}
O valor total bloqueado é de R$ {{VALOR_BLOQUEADO}} ({{VALOR_BLOQUEADO_EXTENSO}}).
{{/IF}}

II - DO DIREITO

O bloqueio de conta bancária, quando realizado de forma indevida ou desproporcional, viola direitos fundamentais do cidadão, especialmente o direito à dignidade da pessoa humana (art. 1º, III, CF) e à propriedade (art. 5º, XXII, CF).

O Código de Processo Civil, em seu art. 833, estabelece as hipóteses de impenhorabilidade, dentre as quais destacam-se:

"Art. 833. São impenhoráveis:
(...)
IV - os vencimentos, os subsídios, os soldos, os salários, as remunerações, os proventos de aposentadoria, as pensões, os pecúlios e os montepios, bem como as quantias recebidas por liberalidade de terceiro e destinadas ao sustento do devedor e de sua família, os ganhos de trabalhador autônomo e os honorários de profissional liberal;
(...)
X - a quantia depositada em caderneta de poupança, até o limite de 40 (quarenta) salários-mínimos;"

{{FUNDAMENTACAO_JURIDICA_ADICIONAL}}

III - DA TUTELA DE URGÊNCIA

Estão presentes os requisitos do art. 300 do CPC para concessão da tutela de urgência:

a) Probabilidade do direito: demonstrada pela ilegalidade do bloqueio, conforme exposto;

b) Perigo de dano: o bloqueio impede o(a) autor(a) de prover seu sustento e de sua família, causando danos irreparáveis.

IV - DOS PEDIDOS

Ante o exposto, requer:

a) A concessão de TUTELA DE URGÊNCIA para determinar o imediato desbloqueio da conta bancária nº {{CONTA_NUMERO}}, agência {{CONTA_AGENCIA}}, do {{BANCO_NOME}};

b) A citação do réu para, querendo, contestar a presente ação;

c) A procedência dos pedidos, confirmando a tutela de urgência e declarando a ilegalidade do bloqueio;

d) A condenação do réu ao pagamento de custas processuais e honorários advocatícios;

{{#IF DANOS_MORAIS}}
e) A condenação do réu ao pagamento de indenização por danos morais no valor de R$ {{VALOR_DANOS_MORAIS}};
{{/IF}}

f) A produção de todas as provas admitidas em direito.

Dá-se à causa o valor de R$ {{VALOR_CAUSA}}.

Termos em que,
Pede deferimento.

{{CIDADE}}, {{DATA_EXTENSO}}.

{{ADVOGADO_NOME}}
{{ADVOGADO_OAB}}`,
    requiredVariables: [
      'CLIENTE_NOME', 'CLIENTE_CPF', 'CLIENTE_RG', 'CLIENTE_ENDERECO',
      'BANCO_NOME', 'CONTA_NUMERO', 'CONTA_AGENCIA', 'DATA_BLOQUEIO',
      'NARRATIVA_FATOS', 'VALOR_CAUSA'
    ],
    optionalVariables: [
      'VALOR_BLOQUEADO', 'DANOS_MORAIS', 'VALOR_DANOS_MORAIS',
      'CLIENTE_NACIONALIDADE', 'CLIENTE_ESTADO_CIVIL', 'CLIENTE_PROFISSAO'
    ],
    requiresAI: true,
    estimatedPages: 4,
    createdAt: new Date('2025-01-01'),
    updatedAt: new Date('2025-01-01')
  }],

  ['peticao-golpe-pix', {
    id: 'peticao-golpe-pix',
    type: 'peticao-golpe-pix',
    title: 'Petição - Golpe PIX / Fraude Bancária',
    category: 'financeiro',
    description: 'Ação de indenização por golpe PIX ou fraude em conta bancária',
    content: `EXCELENTÍSSIMO(A) SENHOR(A) DOUTOR(A) JUIZ(A) DE DIREITO DO JUIZADO ESPECIAL CÍVEL DA COMARCA DE {{COMARCA}}

{{CLIENTE_NOME}}, {{CLIENTE_NACIONALIDADE}}, {{CLIENTE_ESTADO_CIVIL}}, {{CLIENTE_PROFISSAO}}, portador(a) do RG nº {{CLIENTE_RG}} e inscrito(a) no CPF sob o nº {{CLIENTE_CPF}}, residente e domiciliado(a) na {{CLIENTE_ENDERECO}}, e-mail: {{CLIENTE_EMAIL}}, telefone: {{CLIENTE_TELEFONE}}, vem, respeitosamente, à presença de Vossa Excelência, por seu advogado que esta subscreve (procuração anexa), propor a presente

AÇÃO DE INDENIZAÇÃO POR DANOS MATERIAIS E MORAIS C/C RESTITUIÇÃO DE VALORES COM PEDIDO DE TUTELA DE URGÊNCIA

em face de {{BANCO_NOME}}, pessoa jurídica de direito privado, inscrita no CNPJ sob o nº {{BANCO_CNPJ}}, com sede na {{BANCO_ENDERECO}}, pelos fatos e fundamentos a seguir expostos:

I - DOS FATOS

{{NARRATIVA_FATOS}}

Em {{DATA_FRAUDE}}, o(a) autor(a) foi vítima de fraude bancária, tendo sido realizadas as seguintes transações não autorizadas:

{{DESCRICAO_TRANSACOES}}

O valor total das transações fraudulentas é de R$ {{VALOR_FRAUDE}} ({{VALOR_FRAUDE_EXTENSO}}).

Imediatamente após constatar a fraude, o(a) autor(a) tomou as seguintes providências:
{{#IF REGISTROU_BO}}
- Registrou Boletim de Ocorrência (nº {{NUMERO_BO}});
{{/IF}}
- Contatou o banco réu através do canal {{CANAL_CONTATO}} em {{DATA_CONTATO}};
- Solicitou o bloqueio da conta e estorno dos valores;
{{OUTRAS_PROVIDENCIAS}}

No entanto, o banco réu {{RESPOSTA_BANCO}}.

II - DO DIREITO

A responsabilidade das instituições financeiras é objetiva, conforme estabelecido no Código de Defesa do Consumidor e na Súmula 479 do STJ:

"As instituições financeiras respondem objetivamente pelos danos gerados por fortuito interno relativo a fraudes e delitos praticados por terceiros no âmbito de operações bancárias."

O banco réu, ao não implementar mecanismos de segurança adequados para impedir transações atípicas, falhou em seu dever de proteção ao consumidor, nos termos dos arts. 14 e 17 do CDC.

{{FUNDAMENTACAO_JURIDICA_ADICIONAL}}

III - DA TUTELA DE URGÊNCIA

Presentes os requisitos do art. 300 do CPC, requer a concessão de tutela de urgência para:
a) Determinar que o réu se abstenha de incluir o nome do(a) autor(a) em cadastros de inadimplentes em razão dos débitos oriundos da fraude;
{{#IF CARTAO_CLONADO}}
b) Determinar o cancelamento imediato do cartão clonado e emissão de novo cartão;
{{/IF}}

IV - DOS DANOS

4.1 - DANOS MATERIAIS
O(A) autor(a) sofreu danos materiais no valor de R$ {{VALOR_FRAUDE}}, correspondente ao total das transações fraudulentas.

4.2 - DANOS MORAIS
Além dos danos materiais, o(a) autor(a) experimentou significativo abalo moral, caracterizado por:
{{DESCRICAO_DANOS_MORAIS}}

Assim, requer a condenação do réu ao pagamento de indenização por danos morais no valor de R$ {{VALOR_DANOS_MORAIS}}.

V - DOS PEDIDOS

Ante o exposto, requer:

a) A concessão de TUTELA DE URGÊNCIA nos termos acima requeridos;

b) A citação do réu para, querendo, contestar a presente ação;

c) A procedência dos pedidos para:
   c.1) Condenar o réu à restituição do valor de R$ {{VALOR_FRAUDE}}, devidamente corrigido;
   c.2) Condenar o réu ao pagamento de indenização por danos morais no valor de R$ {{VALOR_DANOS_MORAIS}};

d) A inversão do ônus da prova, nos termos do art. 6º, VIII, do CDC;

e) A condenação do réu ao pagamento de custas processuais e honorários advocatícios;

f) A produção de todas as provas admitidas em direito.

Dá-se à causa o valor de R$ {{VALOR_CAUSA}}.

Termos em que,
Pede deferimento.

{{CIDADE}}, {{DATA_EXTENSO}}.

{{ADVOGADO_NOME}}
{{ADVOGADO_OAB}}`,
    requiredVariables: [
      'CLIENTE_NOME', 'CLIENTE_CPF', 'CLIENTE_ENDERECO',
      'BANCO_NOME', 'DATA_FRAUDE', 'VALOR_FRAUDE', 'NARRATIVA_FATOS',
      'DESCRICAO_TRANSACOES', 'VALOR_DANOS_MORAIS', 'VALOR_CAUSA'
    ],
    optionalVariables: [
      'NUMERO_BO', 'CARTAO_CLONADO', 'CANAL_CONTATO', 'DATA_CONTATO'
    ],
    requiresAI: true,
    estimatedPages: 5,
    createdAt: new Date('2025-01-01'),
    updatedAt: new Date('2025-01-01')
  }],

  ['peticao-negativacao', {
    id: 'peticao-negativacao',
    type: 'peticao-negativacao',
    title: 'Petição - Negativação Indevida',
    category: 'consumidor',
    description: 'Ação de indenização por negativação indevida em cadastros de crédito',
    content: `EXCELENTÍSSIMO(A) SENHOR(A) DOUTOR(A) JUIZ(A) DE DIREITO DO JUIZADO ESPECIAL CÍVEL DA COMARCA DE {{COMARCA}}

{{CLIENTE_NOME}}, {{CLIENTE_NACIONALIDADE}}, {{CLIENTE_ESTADO_CIVIL}}, {{CLIENTE_PROFISSAO}}, portador(a) do RG nº {{CLIENTE_RG}} e inscrito(a) no CPF sob o nº {{CLIENTE_CPF}}, residente e domiciliado(a) na {{CLIENTE_ENDERECO}}, vem, respeitosamente, à presença de Vossa Excelência, por seu advogado que esta subscreve, propor a presente

AÇÃO DECLARATÓRIA DE INEXISTÊNCIA DE DÉBITO C/C INDENIZAÇÃO POR DANOS MORAIS COM PEDIDO DE TUTELA DE URGÊNCIA

em face de {{REU_NOME}}, pessoa jurídica de direito privado, inscrita no CNPJ sob o nº {{REU_CNPJ}}, com sede na {{REU_ENDERECO}}, pelos fatos e fundamentos a seguir expostos:

I - DOS FATOS

{{NARRATIVA_FATOS}}

O(A) autor(a) foi surpreendido(a) ao verificar a existência de restrição em seu nome junto aos órgãos de proteção ao crédito (SPC/SERASA), por suposto débito no valor de R$ {{VALOR_NEGATIVACAO}} com a empresa ré.

Ocorre que o(a) autor(a) NUNCA {{MOTIVO_INEXISTENCIA}}:
{{DETALHES_INEXISTENCIA}}

A negativação indevida ocorreu em {{DATA_NEGATIVACAO}}, conforme documento anexo.

II - DO DIREITO

A inclusão indevida do nome do consumidor em cadastros de inadimplentes gera dano moral in re ipsa, conforme pacífica jurisprudência:

"A inscrição indevida do nome do consumidor em órgãos de proteção ao crédito enseja indenização por danos morais, independentemente da prova do prejuízo." (STJ)

O réu violou os arts. 42 e 43 do Código de Defesa do Consumidor, que exigem a comunicação prévia ao consumidor antes de qualquer inscrição em cadastros de inadimplentes.

{{FUNDAMENTACAO_JURIDICA_ADICIONAL}}

III - DA TUTELA DE URGÊNCIA

Presentes os requisitos do art. 300 do CPC:
- Probabilidade do direito: inexistência da relação jurídica que fundamentou a negativação;
- Perigo de dano: manutenção da restrição impede o(a) autor(a) de exercer seus direitos como consumidor(a).

IV - DOS PEDIDOS

Ante o exposto, requer:

a) A concessão de TUTELA DE URGÊNCIA para determinar a imediata exclusão do nome do(a) autor(a) dos cadastros de inadimplentes (SPC/SERASA), sob pena de multa diária de R$ 500,00;

b) A citação do réu;

c) A procedência dos pedidos para:
   c.1) Declarar a inexistência do débito de R$ {{VALOR_NEGATIVACAO}};
   c.2) Condenar o réu ao pagamento de indenização por danos morais no valor de R$ {{VALOR_DANOS_MORAIS}};
   c.3) Tornar definitiva a tutela de urgência;

d) A condenação ao pagamento de custas e honorários advocatícios;

e) A produção de todas as provas admitidas em direito.

Dá-se à causa o valor de R$ {{VALOR_CAUSA}}.

Termos em que,
Pede deferimento.

{{CIDADE}}, {{DATA_EXTENSO}}.

{{ADVOGADO_NOME}}
{{ADVOGADO_OAB}}`,
    requiredVariables: [
      'CLIENTE_NOME', 'CLIENTE_CPF', 'CLIENTE_ENDERECO',
      'REU_NOME', 'VALOR_NEGATIVACAO', 'DATA_NEGATIVACAO',
      'MOTIVO_INEXISTENCIA', 'NARRATIVA_FATOS', 'VALOR_DANOS_MORAIS', 'VALOR_CAUSA'
    ],
    optionalVariables: ['REU_CNPJ', 'REU_ENDERECO', 'DETALHES_INEXISTENCIA'],
    requiresAI: true,
    estimatedPages: 4,
    createdAt: new Date('2025-01-01'),
    updatedAt: new Date('2025-01-01')
  }],

  // Real Estate Templates
  ['peticao-usucapiao', {
    id: 'peticao-usucapiao',
    type: 'peticao-usucapiao',
    title: 'Petição de Usucapião',
    category: 'imobiliario',
    description: 'Ação de usucapião extraordinária, ordinária ou especial',
    content: `EXCELENTÍSSIMO(A) SENHOR(A) DOUTOR(A) JUIZ(A) DE DIREITO DA {{VARA}} VARA CÍVEL DA COMARCA DE {{COMARCA}}

{{CLIENTE_NOME}}, {{CLIENTE_NACIONALIDADE}}, {{CLIENTE_ESTADO_CIVIL}}, {{CLIENTE_PROFISSAO}}, portador(a) do RG nº {{CLIENTE_RG}} e inscrito(a) no CPF sob o nº {{CLIENTE_CPF}}, residente e domiciliado(a) na {{CLIENTE_ENDERECO}}, vem, respeitosamente, perante Vossa Excelência, por seu advogado que esta subscreve, propor a presente

AÇÃO DE USUCAPIÃO {{MODALIDADE_USUCAPIAO}}

referente ao imóvel situado na {{IMOVEL_ENDERECO}}, pelos fatos e fundamentos a seguir expostos:

I - DO IMÓVEL

O imóvel objeto da presente ação possui as seguintes características:

- Endereço: {{IMOVEL_ENDERECO}}
- Área total: {{IMOVEL_AREA}} m²
- Matrícula/Transcrição: {{IMOVEL_MATRICULA}}
- Registro: {{IMOVEL_REGISTRO}}

Limites e confrontações:
{{IMOVEL_CONFRONTACOES}}

II - DOS FATOS

{{NARRATIVA_FATOS}}

O(A) autor(a) exerce a posse mansa, pacífica e ininterrupta do referido imóvel desde {{DATA_INICIO_POSSE}}, ou seja, há mais de {{TEMPO_POSSE}} anos.

Durante todo esse período:
- A posse foi exercida com animus domini (como se dono fosse);
- Não houve qualquer oposição ou contestação;
- O(A) autor(a) realizou benfeitorias no imóvel;
- Os tributos (IPTU) foram pagos pelo(a) autor(a);

{{DESCRICAO_BENFEITORIAS}}

III - DO DIREITO

{{#IF USUCAPIAO_EXTRAORDINARIA}}
Nos termos do art. 1.238 do Código Civil:
"Aquele que, por quinze anos, sem interrupção, nem oposição, possuir como seu um imóvel, adquire-lhe a propriedade, independentemente de título e boa-fé; podendo requerer ao juiz que assim o declare por sentença, a qual servirá de título para o registro no Cartório de Registro de Imóveis."
{{/IF}}

{{#IF USUCAPIAO_ORDINARIA}}
Nos termos do art. 1.242 do Código Civil:
"Adquire também a propriedade do imóvel aquele que, contínua e incontestadamente, com justo título e boa-fé, o possuir por dez anos."
{{/IF}}

{{#IF USUCAPIAO_ESPECIAL_URBANA}}
Nos termos do art. 1.240 do Código Civil e art. 183 da Constituição Federal:
"Aquele que possuir, como sua, área urbana de até duzentos e cinquenta metros quadrados, por cinco anos ininterruptamente e sem oposição, utilizando-a para sua moradia ou de sua família, adquirir-lhe-á o domínio, desde que não seja proprietário de outro imóvel urbano ou rural."
{{/IF}}

{{FUNDAMENTACAO_JURIDICA_ADICIONAL}}

IV - DOS PEDIDOS

Ante o exposto, requer:

a) A citação dos réus, se houver, dos confinantes e demais interessados, por edital;

b) A intimação dos representantes da Fazenda Pública (Federal, Estadual e Municipal);

c) A intimação do Ministério Público;

d) A procedência da ação para declarar a aquisição da propriedade do imóvel descrito pelo(a) autor(a), por usucapião;

e) A expedição de mandado para registro da sentença junto ao Cartório de Registro de Imóveis competente;

f) A condenação do réu (se houver) ao pagamento de custas e honorários advocatícios;

g) A produção de todas as provas admitidas em direito, especialmente documental, testemunhal e pericial.

Dá-se à causa o valor de R$ {{VALOR_CAUSA}}.

Termos em que,
Pede deferimento.

{{CIDADE}}, {{DATA_EXTENSO}}.

{{ADVOGADO_NOME}}
{{ADVOGADO_OAB}}`,
    requiredVariables: [
      'CLIENTE_NOME', 'CLIENTE_CPF', 'CLIENTE_ENDERECO',
      'IMOVEL_ENDERECO', 'IMOVEL_AREA', 'DATA_INICIO_POSSE',
      'TEMPO_POSSE', 'MODALIDADE_USUCAPIAO', 'NARRATIVA_FATOS', 'VALOR_CAUSA'
    ],
    optionalVariables: [
      'IMOVEL_MATRICULA', 'IMOVEL_REGISTRO', 'IMOVEL_CONFRONTACOES',
      'DESCRICAO_BENFEITORIAS'
    ],
    requiresAI: true,
    estimatedPages: 6,
    createdAt: new Date('2025-01-01'),
    updatedAt: new Date('2025-01-01')
  }],

  // Health Insurance Templates
  ['peticao-plano-saude', {
    id: 'peticao-plano-saude',
    type: 'peticao-plano-saude',
    title: 'Petição - Negativa de Plano de Saúde',
    category: 'consumidor',
    description: 'Ação contra negativa indevida de cobertura por plano de saúde',
    content: `EXCELENTÍSSIMO(A) SENHOR(A) DOUTOR(A) JUIZ(A) DE DIREITO DA {{VARA}} VARA CÍVEL DA COMARCA DE {{COMARCA}}

{{CLIENTE_NOME}}, {{CLIENTE_NACIONALIDADE}}, {{CLIENTE_ESTADO_CIVIL}}, {{CLIENTE_PROFISSAO}}, portador(a) do RG nº {{CLIENTE_RG}} e inscrito(a) no CPF sob o nº {{CLIENTE_CPF}}, residente e domiciliado(a) na {{CLIENTE_ENDERECO}}, vem, respeitosamente, à presença de Vossa Excelência, por seu advogado que esta subscreve, propor a presente

AÇÃO DE OBRIGAÇÃO DE FAZER C/C INDENIZAÇÃO POR DANOS MORAIS COM PEDIDO DE TUTELA DE URGÊNCIA

em face de {{OPERADORA_NOME}}, pessoa jurídica de direito privado, inscrita no CNPJ sob o nº {{OPERADORA_CNPJ}}, com sede na {{OPERADORA_ENDERECO}}, pelos fatos e fundamentos a seguir expostos:

I - DOS FATOS

O(A) autor(a) é beneficiário(a) do plano de saúde {{PLANO_NOME}}, nº {{PLANO_NUMERO}}, desde {{DATA_ADESAO}}.

{{NARRATIVA_FATOS}}

Em {{DATA_SOLICITACAO}}, o(a) autor(a) solicitou a realização de {{PROCEDIMENTO_NOME}}, conforme prescrição médica do Dr.(a) {{MEDICO_NOME}}, CRM {{MEDICO_CRM}}.

O procedimento é necessário para {{MOTIVO_MEDICO}}.

No entanto, a operadora ré negou a cobertura em {{DATA_NEGATIVA}}, sob a justificativa de: {{MOTIVO_NEGATIVA}}.

II - DO DIREITO

A negativa da operadora é ILEGAL pelos seguintes motivos:

1. O procedimento {{PROCEDIMENTO_NOME}} está previsto no Rol de Procedimentos da ANS;

2. A Súmula 102 do TJRJ estabelece: "Havendo expressa indicação médica, é abusiva a negativa de cobertura de custeio de tratamento sob o argumento da sua natureza experimental ou por não estar previsto no rol de procedimentos da ANS";

3. O art. 10, I, da Lei 9.656/98 veda a exclusão de cobertura de procedimentos considerados necessários ao tratamento;

{{FUNDAMENTACAO_JURIDICA_ADICIONAL}}

III - DA TUTELA DE URGÊNCIA

Estão presentes os requisitos do art. 300 do CPC:

a) Probabilidade do direito: há prescrição médica e a negativa é ilegal;
b) Perigo de dano: a demora pode causar {{RISCO_SAUDE}};

IV - DOS PEDIDOS

Ante o exposto, requer:

a) A concessão de TUTELA DE URGÊNCIA para determinar que a ré autorize e custeie imediatamente o procedimento {{PROCEDIMENTO_NOME}}, sob pena de multa diária de R$ {{VALOR_MULTA}};

b) A citação do réu;

c) A procedência dos pedidos para:
   c.1) Confirmar a tutela de urgência;
   c.2) Condenar a ré ao custeio integral do tratamento;
   c.3) Condenar a ré ao pagamento de indenização por danos morais no valor de R$ {{VALOR_DANOS_MORAIS}};

d) A inversão do ônus da prova;

e) A condenação ao pagamento de custas e honorários advocatícios.

Dá-se à causa o valor de R$ {{VALOR_CAUSA}}.

Termos em que,
Pede deferimento.

{{CIDADE}}, {{DATA_EXTENSO}}.

{{ADVOGADO_NOME}}
{{ADVOGADO_OAB}}`,
    requiredVariables: [
      'CLIENTE_NOME', 'CLIENTE_CPF', 'CLIENTE_ENDERECO',
      'OPERADORA_NOME', 'PLANO_NUMERO', 'PROCEDIMENTO_NOME',
      'MEDICO_NOME', 'DATA_NEGATIVA', 'MOTIVO_NEGATIVA',
      'NARRATIVA_FATOS', 'VALOR_DANOS_MORAIS', 'VALOR_CAUSA'
    ],
    optionalVariables: [
      'MEDICO_CRM', 'DATA_ADESAO', 'MOTIVO_MEDICO', 'RISCO_SAUDE'
    ],
    requiresAI: true,
    estimatedPages: 5,
    createdAt: new Date('2025-01-01'),
    updatedAt: new Date('2025-01-01')
  }],

  // Social Security Templates
  ['peticao-auxilio-doenca', {
    id: 'peticao-auxilio-doenca',
    type: 'peticao-auxilio-doenca',
    title: 'Petição - Auxílio-Doença/Aposentadoria por Invalidez',
    category: 'previdenciario',
    description: 'Ação para concessão de auxílio-doença ou aposentadoria por invalidez',
    content: `EXCELENTÍSSIMO(A) SENHOR(A) DOUTOR(A) JUIZ(A) FEDERAL DA {{VARA}} VARA FEDERAL DA SEÇÃO JUDICIÁRIA DE {{UF}}

{{CLIENTE_NOME}}, {{CLIENTE_NACIONALIDADE}}, {{CLIENTE_ESTADO_CIVIL}}, {{CLIENTE_PROFISSAO}}, portador(a) do RG nº {{CLIENTE_RG}}, inscrito(a) no CPF sob o nº {{CLIENTE_CPF}} e no NIT/PIS nº {{CLIENTE_NIT}}, residente e domiciliado(a) na {{CLIENTE_ENDERECO}}, vem, respeitosamente, à presença de Vossa Excelência, por seu advogado que esta subscreve, propor a presente

AÇÃO DE CONCESSÃO DE {{BENEFICIO_TIPO}} COM PEDIDO DE TUTELA ANTECIPADA

em face do INSTITUTO NACIONAL DO SEGURO SOCIAL - INSS, autarquia federal, pelos fatos e fundamentos a seguir expostos:

I - DOS FATOS

{{NARRATIVA_FATOS}}

O(A) autor(a) é portador(a) de {{DOENCA_NOME}} (CID {{DOENCA_CID}}), diagnosticada em {{DATA_DIAGNOSTICO}}.

A incapacidade para o trabalho teve início em {{DATA_INCAPACIDADE}}.

O(A) autor(a) requereu administrativamente o benefício em {{DATA_REQUERIMENTO}} (NB {{NUMERO_BENEFICIO}}), tendo sido {{RESULTADO_REQUERIMENTO}}.

{{HISTORICO_MEDICO}}

II - DO DIREITO

O art. 59 da Lei 8.213/91 estabelece os requisitos para concessão do auxílio-doença:
"O auxílio-doença será devido ao segurado que, havendo cumprido, quando for o caso, o período de carência exigido nesta Lei, ficar incapacitado para o seu trabalho ou para a sua atividade habitual por mais de 15 (quinze) dias consecutivos."

No presente caso:
a) Qualidade de segurado: comprovada por {{PROVA_QUALIDADE_SEGURADO}};
b) Carência: cumprida, com {{QUANTIDADE_CONTRIBUICOES}} contribuições;
c) Incapacidade: demonstrada pelos laudos médicos anexos;

{{FUNDAMENTACAO_JURIDICA_ADICIONAL}}

III - DA TUTELA ANTECIPADA

Presentes os requisitos do art. 300 do CPC:
- Probabilidade do direito: demonstrada pela documentação médica;
- Perigo de dano: o(a) autor(a) encontra-se sem renda, impossibilitado(a) de prover seu sustento.

IV - DOS PEDIDOS

Ante o exposto, requer:

a) A concessão de TUTELA ANTECIPADA para implantar o benefício de {{BENEFICIO_TIPO}};

b) A citação do INSS;

c) A procedência dos pedidos para:
   c.1) Condenar o INSS a conceder o benefício de {{BENEFICIO_TIPO}} desde {{DATA_DIB}};
   c.2) Condenar o INSS ao pagamento das parcelas vencidas, corrigidas e acrescidas de juros;

d) A designação de perícia médica judicial;

e) A gratuidade de justiça;

f) A condenação ao pagamento de honorários advocatícios.

Dá-se à causa o valor de R$ {{VALOR_CAUSA}}.

Termos em que,
Pede deferimento.

{{CIDADE}}, {{DATA_EXTENSO}}.

{{ADVOGADO_NOME}}
{{ADVOGADO_OAB}}`,
    requiredVariables: [
      'CLIENTE_NOME', 'CLIENTE_CPF', 'CLIENTE_NIT', 'CLIENTE_ENDERECO',
      'BENEFICIO_TIPO', 'DOENCA_NOME', 'DOENCA_CID', 'DATA_INCAPACIDADE',
      'NARRATIVA_FATOS', 'VALOR_CAUSA'
    ],
    optionalVariables: [
      'DATA_DIAGNOSTICO', 'DATA_REQUERIMENTO', 'NUMERO_BENEFICIO',
      'RESULTADO_REQUERIMENTO', 'HISTORICO_MEDICO'
    ],
    requiresAI: true,
    estimatedPages: 5,
    createdAt: new Date('2025-01-01'),
    updatedAt: new Date('2025-01-01')
  }],

  // General Templates
  ['contrato-honorarios', {
    id: 'contrato-honorarios',
    type: 'contrato-honorarios',
    title: 'Contrato de Honorários Advocatícios',
    category: 'geral',
    description: 'Contrato de prestação de serviços advocatícios',
    content: `CONTRATO DE PRESTAÇÃO DE SERVIÇOS ADVOCATÍCIOS

CONTRATANTE: {{CLIENTE_NOME}}, {{CLIENTE_NACIONALIDADE}}, {{CLIENTE_ESTADO_CIVIL}}, {{CLIENTE_PROFISSAO}}, portador(a) do RG nº {{CLIENTE_RG}} e inscrito(a) no CPF sob o nº {{CLIENTE_CPF}}, residente e domiciliado(a) na {{CLIENTE_ENDERECO}}.

CONTRATADO: {{ADVOGADO_NOME}}, advogado(a) inscrito(a) na {{ADVOGADO_OAB}}, com escritório profissional na {{ESCRITORIO_ENDERECO}}.

As partes acima qualificadas têm, entre si, justo e acordado o presente Contrato de Prestação de Serviços Advocatícios, que se regerá pelas cláusulas seguintes e pelas condições descritas:

CLÁUSULA PRIMEIRA - DO OBJETO

O presente contrato tem por objeto a prestação de serviços advocatícios pelo CONTRATADO ao CONTRATANTE, consistentes em:

{{DESCRICAO_SERVICOS}}

CLÁUSULA SEGUNDA - DOS HONORÁRIOS

2.1. Pelos serviços prestados, o CONTRATANTE pagará ao CONTRATADO:

{{#IF HONORARIOS_FIXOS}}
a) Honorários contratuais fixos no valor de R$ {{VALOR_HONORARIOS_FIXOS}} ({{VALOR_HONORARIOS_FIXOS_EXTENSO}}), a serem pagos da seguinte forma: {{FORMA_PAGAMENTO_FIXOS}};
{{/IF}}

{{#IF HONORARIOS_EXITO}}
b) Honorários de êxito no percentual de {{PERCENTUAL_EXITO}}% sobre o proveito econômico obtido, a serem pagos em até 5 (cinco) dias úteis após o recebimento;
{{/IF}}

2.2. Os valores acima não incluem custas processuais, taxas, emolumentos e despesas com terceiros (peritos, tradutores, etc.), que serão de responsabilidade do CONTRATANTE.

CLÁUSULA TERCEIRA - DAS OBRIGAÇÕES DO CONTRATADO

O CONTRATADO se obriga a:
a) Defender os interesses do CONTRATANTE com zelo, diligência e dedicação;
b) Manter o CONTRATANTE informado sobre o andamento do processo;
c) Guardar sigilo profissional sobre as informações recebidas;
d) Comparecer às audiências e praticar os atos processuais necessários.

CLÁUSULA QUARTA - DAS OBRIGAÇÕES DO CONTRATANTE

O CONTRATANTE se obriga a:
a) Fornecer todos os documentos e informações necessários;
b) Pagar os honorários nas datas acordadas;
c) Arcar com as custas processuais e despesas;
d) Comunicar qualquer mudança de endereço ou contato.

CLÁUSULA QUINTA - DA VIGÊNCIA

O presente contrato vigorará até a conclusão definitiva dos serviços contratados, incluindo eventuais recursos.

CLÁUSULA SEXTA - DA RESCISÃO

6.1. O CONTRATANTE poderá revogar os poderes outorgados a qualquer tempo, ficando obrigado ao pagamento dos honorários proporcionais ao trabalho realizado.

6.2. O CONTRATADO poderá renunciar ao mandato, observando o disposto no art. 5º, §3º, do Estatuto da OAB.

CLÁUSULA SÉTIMA - DO FORO

Fica eleito o Foro da Comarca de {{COMARCA}} para dirimir quaisquer dúvidas oriundas do presente contrato.

E, por estarem assim justos e acordados, firmam o presente instrumento em 2 (duas) vias de igual teor e forma.

{{CIDADE}}, {{DATA_EXTENSO}}.

_________________________________
{{CLIENTE_NOME}}
CONTRATANTE

_________________________________
{{ADVOGADO_NOME}}
{{ADVOGADO_OAB}}
CONTRATADO`,
    requiredVariables: [
      'CLIENTE_NOME', 'CLIENTE_CPF', 'CLIENTE_ENDERECO',
      'ADVOGADO_NOME', 'ADVOGADO_OAB', 'DESCRICAO_SERVICOS'
    ],
    optionalVariables: [
      'VALOR_HONORARIOS_FIXOS', 'PERCENTUAL_EXITO', 'FORMA_PAGAMENTO_FIXOS',
      'ESCRITORIO_ENDERECO'
    ],
    requiresAI: false,
    estimatedPages: 2,
    createdAt: new Date('2025-01-01'),
    updatedAt: new Date('2025-01-01')
  }],

  ['procuracao', {
    id: 'procuracao',
    type: 'procuracao',
    title: 'Procuração Ad Judicia',
    category: 'geral',
    description: 'Procuração para representação judicial',
    content: `PROCURAÇÃO AD JUDICIA

OUTORGANTE: {{CLIENTE_NOME}}, {{CLIENTE_NACIONALIDADE}}, {{CLIENTE_ESTADO_CIVIL}}, {{CLIENTE_PROFISSAO}}, portador(a) do RG nº {{CLIENTE_RG}}, inscrito(a) no CPF sob o nº {{CLIENTE_CPF}}, residente e domiciliado(a) na {{CLIENTE_ENDERECO}}.

OUTORGADO: {{ADVOGADO_NOME}}, advogado(a) inscrito(a) na {{ADVOGADO_OAB}}, com escritório profissional na {{ESCRITORIO_ENDERECO}}.

PODERES: Pelo presente instrumento particular de procuração, o(a) OUTORGANTE nomeia e constitui seu bastante procurador o(a) OUTORGADO(A) acima qualificado(a), a quem confere amplos poderes para o foro em geral, com a cláusula "ad judicia", em qualquer Juízo, Instância ou Tribunal, podendo propor contra quem de direito as ações competentes e defendê-lo(a) nas contrárias, seguindo umas e outras até final decisão, usando dos recursos legais e acompanhando-os, conferindo-lhe ainda, poderes especiais para confessar, reconhecer a procedência do pedido, transigir, desistir, renunciar ao direito sobre que se funda a ação, receber, dar quitação e firmar compromisso, {{PODERES_ESPECIAIS}} tudo podendo ser feito em conjunto ou separadamente, podendo ainda substabelecer com ou sem reservas de poderes, dando tudo por bom, firme e valioso.

{{#IF OBJETO_ESPECIFICO}}
O presente mandato é outorgado para {{OBJETO_ESPECIFICO}}.
{{/IF}}

{{CIDADE}}, {{DATA_EXTENSO}}.

_________________________________
{{CLIENTE_NOME}}
CPF: {{CLIENTE_CPF}}`,
    requiredVariables: [
      'CLIENTE_NOME', 'CLIENTE_CPF', 'CLIENTE_RG', 'CLIENTE_ENDERECO',
      'ADVOGADO_NOME', 'ADVOGADO_OAB'
    ],
    optionalVariables: [
      'ESCRITORIO_ENDERECO', 'PODERES_ESPECIAIS', 'OBJETO_ESPECIFICO'
    ],
    requiresAI: false,
    estimatedPages: 1,
    createdAt: new Date('2025-01-01'),
    updatedAt: new Date('2025-01-01')
  }],

  ['notificacao-extrajudicial', {
    id: 'notificacao-extrajudicial',
    type: 'notificacao-extrajudicial',
    title: 'Notificação Extrajudicial',
    category: 'geral',
    description: 'Notificação extrajudicial para diversas finalidades',
    content: `NOTIFICAÇÃO EXTRAJUDICIAL

NOTIFICANTE: {{CLIENTE_NOME}}, {{CLIENTE_NACIONALIDADE}}, {{CLIENTE_ESTADO_CIVIL}}, {{CLIENTE_PROFISSAO}}, portador(a) do RG nº {{CLIENTE_RG}} e inscrito(a) no CPF sob o nº {{CLIENTE_CPF}}, residente e domiciliado(a) na {{CLIENTE_ENDERECO}}.

NOTIFICADO: {{NOTIFICADO_NOME}}, {{NOTIFICADO_QUALIFICACAO}}, com endereço na {{NOTIFICADO_ENDERECO}}.

Pelo presente instrumento, o NOTIFICANTE, por seu advogado que esta subscreve, vem, respeitosamente, NOTIFICAR o NOTIFICADO acerca do seguinte:

I - DOS FATOS

{{NARRATIVA_FATOS}}

II - DA FUNDAMENTAÇÃO

{{FUNDAMENTACAO}}

III - DA NOTIFICAÇÃO

Diante do exposto, fica o(a) NOTIFICADO(A) formalmente NOTIFICADO(A) para, no prazo de {{PRAZO_DIAS}} ({{PRAZO_DIAS_EXTENSO}}) dias:

{{PROVIDENCIAS_REQUERIDAS}}

IV - DAS CONSEQUÊNCIAS

O não atendimento da presente notificação no prazo estipulado acarretará:

{{CONSEQUENCIAS}}

A presente notificação servirá como prova de ciência inequívoca do(a) NOTIFICADO(A) para todos os efeitos legais.

{{CIDADE}}, {{DATA_EXTENSO}}.

_________________________________
{{CLIENTE_NOME}}
NOTIFICANTE

_________________________________
{{ADVOGADO_NOME}}
{{ADVOGADO_OAB}}
Advogado(a) do(a) Notificante`,
    requiredVariables: [
      'CLIENTE_NOME', 'CLIENTE_CPF', 'CLIENTE_ENDERECO',
      'NOTIFICADO_NOME', 'NOTIFICADO_ENDERECO',
      'NARRATIVA_FATOS', 'PROVIDENCIAS_REQUERIDAS', 'PRAZO_DIAS'
    ],
    optionalVariables: [
      'NOTIFICADO_QUALIFICACAO', 'FUNDAMENTACAO', 'CONSEQUENCIAS'
    ],
    requiresAI: true,
    estimatedPages: 2,
    createdAt: new Date('2025-01-01'),
    updatedAt: new Date('2025-01-01')
  }]
])

/**
 * Get a template by type
 */
export function getTemplate(type: string): DocumentTemplate | null {
  return TEMPLATES.get(type) || null
}

/**
 * Get all templates
 */
export function getAllTemplates(): DocumentTemplate[] {
  return Array.from(TEMPLATES.values())
}

/**
 * Get templates by category
 */
export function getTemplatesByCategory(category: DocumentTemplate['category']): DocumentTemplate[] {
  return Array.from(TEMPLATES.values()).filter(t => t.category === category)
}

/**
 * Get available document types
 */
export function getAvailableDocumentTypes(): string[] {
  return Array.from(TEMPLATES.keys())
}

/**
 * Validate that all required variables are present
 */
export function validateVariables(
  template: DocumentTemplate,
  variables: Record<string, any>
): { valid: boolean; missing: string[] } {
  const missing: string[] = []

  for (const required of template.requiredVariables) {
    if (!variables[required] || variables[required] === `[${required}]`) {
      missing.push(required)
    }
  }

  return {
    valid: missing.length === 0,
    missing
  }
}

/**
 * Get template preview with sample data
 */
export function getTemplatePreview(type: string): string | null {
  const template = getTemplate(type)
  if (!template) return null

  // Return first 500 characters as preview
  return template.content.substring(0, 500) + '...'
}
