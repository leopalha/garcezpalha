/**
 * Template de Contrato: Perícia Documental / Grafotécnica
 * OAB Compliance: Provimento 94/2000 OAB
 */

export interface PericiaDocumentalData {
  // Partes
  contratante_nome: string
  contratante_cpf: string
  contratante_endereco: string
  contratado_nome: string
  contratado_oab: string
  contratado_especialidade: string

  // Objeto
  tipo_pericia: string // Grafotécnica, Documentoscopia, etc
  documentos_analisar: string
  numero_documentos: number
  objetivo_pericia: string

  // Prazos e Valores
  prazo_entrega_dias: number
  valor_total: number
  forma_pagamento: string
  data_vencimento: string

  // Detalhes
  metodologia: string
  local_pericia: string
  data_contrato: string
}

export function gerarContratoPericiaDocumental(data: PericiaDocumentalData): string {
  return `
CONTRATO DE PRESTAÇÃO DE SERVIÇOS DE PERÍCIA DOCUMENTAL

CONTRATANTE: ${data.contratante_nome}, CPF ${data.contratante_cpf}, residente e domiciliado em ${data.contratante_endereco}.

CONTRATADO: ${data.contratado_nome}, OAB/RJ ${data.contratado_oab}, especialista em ${data.contratado_especialidade}.

As partes acima qualificadas têm, entre si, justo e acertado o presente Contrato de Prestação de Serviços de Perícia Documental, que se regerá pelas cláusulas seguintes e pelas condições descritas no presente.

CLÁUSULA PRIMEIRA – DO OBJETO

1.1. O presente contrato tem por objeto a realização de ${data.tipo_pericia} nos seguintes documentos: ${data.documentos_analisar}.

1.2. Total de ${data.numero_documentos} documento(s) a serem periciados.

1.3. Objetivo da perícia: ${data.objetivo_pericia}.

CLÁUSULA SEGUNDA – DA METODOLOGIA

2.1. A perícia será realizada mediante análise técnica especializada, utilizando metodologia ${data.metodologia}.

2.2. A análise incluirá:
   a) Exame grafotécnico comparativo;
   b) Análise de características individualizadoras;
   c) Verificação de sinais de adulteração ou contrafação;
   d) Comparação com padrões de referência fornecidos.

2.3. O local de realização da perícia será: ${data.local_pericia}.

CLÁUSULA TERCEIRA – DAS RESPONSABILIDADES DO CONTRATADO

3.1. O CONTRATADO obriga-se a:
   a) Realizar a perícia com técnica e zelo profissional;
   b) Emitir laudo pericial fundamentado tecnicamente;
   c) Apresentar conclusões com base em análise científica;
   d) Manter sigilo sobre informações obtidas;
   e) Cumprir o prazo estabelecido neste contrato.

3.2. O laudo pericial conterá:
   a) Quesitos respondidos;
   b) Metodologia empregada;
   c) Material examinado;
   d) Análise técnica detalhada;
   e) Conclusões fundamentadas;
   f) Documentação fotográfica (quando aplicável).

CLÁUSULA QUARTA – DAS RESPONSABILIDADES DO CONTRATANTE

4.1. O CONTRATANTE obriga-se a:
   a) Fornecer todos os documentos objeto da perícia;
   b) Fornecer padrões de comparação autênticos;
   c) Prestar informações relevantes para a perícia;
   d) Efetuar o pagamento na forma pactuada;
   e) Garantir a integridade dos documentos fornecidos.

CLÁUSULA QUINTA – DO PRAZO

5.1. O prazo para entrega do laudo pericial é de ${data.prazo_entrega_dias} (${extenso(data.prazo_entrega_dias)}) dias corridos, contados da data de recebimento de todos os documentos necessários.

5.2. O prazo poderá ser prorrogado mediante acordo entre as partes, em caso de:
   a) Complexidade técnica superior à estimada;
   b) Necessidade de exames complementares;
   c) Caso fortuito ou força maior.

CLÁUSULA SEXTA – DO VALOR E FORMA DE PAGAMENTO

6.1. Pelos serviços ora contratados, o CONTRATANTE pagará ao CONTRATADO o valor total de R$ ${data.valor_total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} (${valorExtenso(data.valor_total)}).

6.2. Forma de pagamento: ${data.forma_pagamento}.

6.3. Vencimento: ${data.data_vencimento}.

6.4. O valor inclui:
   a) Análise técnica dos documentos;
   b) Emissão do laudo pericial;
   c) Uma reunião de apresentação de resultados (se solicitada).

6.5. Custos adicionais (deslocamentos, exames complementares laboratoriais) serão cobrados à parte, mediante aprovação prévia do CONTRATANTE.

CLÁUSULA SÉTIMA – DO SIGILO PROFISSIONAL

7.1. O CONTRATADO compromete-se a manter sigilo sobre todas as informações obtidas no exercício de suas funções, nos termos do Código de Ética e Disciplina da OAB.

7.2. O laudo e documentação produzida são de propriedade exclusiva do CONTRATANTE.

CLÁUSULA OITAVA – DA IMPARCIALIDADE

8.1. O CONTRATADO declara não possuir qualquer vínculo ou interesse que possa comprometer sua imparcialidade na realização da perícia.

8.2. O CONTRATADO atuará com total independência técnica, emitindo conclusões baseadas exclusivamente em análise científica.

CLÁUSULA NONA – DA RESCISÃO

9.1. O presente contrato poderá ser rescindido:
   a) Por acordo entre as partes;
   b) Por inadimplemento de quaisquer das obrigações assumidas;
   c) Por impossibilidade superveniente de cumprimento.

9.2. Em caso de rescisão por culpa do CONTRATANTE, serão devidos os honorários proporcionais ao trabalho realizado.

CLÁUSULA DÉCIMA – DAS DISPOSIÇÕES GERAIS

10.1. O presente contrato rege-se pelo Código de Ética e Disciplina da OAB e pelo Código Civil Brasileiro.

10.2. Fica eleito o foro da Comarca do Rio de Janeiro para dirimir quaisquer questões oriundas deste contrato.

10.3. Este contrato é celebrado em caráter irrevogável e irretratável, obrigando as partes e seus sucessores.

E, por estarem assim justos e contratados, firmam o presente instrumento em 2 (duas) vias de igual teor e forma, na presença de 2 (duas) testemunhas.

Rio de Janeiro, ${data.data_contrato}.

_______________________________________
${data.contratante_nome}
CONTRATANTE

_______________________________________
${data.contratado_nome}
OAB/RJ ${data.contratado_oab}
CONTRATADO

TESTEMUNHAS:

_______________________________________
Nome:
CPF:

_______________________________________
Nome:
CPF:
`.trim()
}

// Função auxiliar para converter número em extenso (simplificada)
function extenso(num: number): string {
  const numeros = ['zero', 'um', 'dois', 'três', 'quatro', 'cinco', 'seis', 'sete', 'oito', 'nove', 'dez',
    'onze', 'doze', 'treze', 'quatorze', 'quinze', 'dezesseis', 'dezessete', 'dezoito', 'dezenove', 'vinte',
    'trinta', 'quarenta', 'cinquenta', 'sessenta', 'setenta', 'oitenta', 'noventa']

  if (num <= 20) return numeros[num]
  if (num < 100) {
    const dezena = Math.floor(num / 10)
    const unidade = num % 10
    return unidade === 0 ? numeros[18 + dezena] : `${numeros[18 + dezena]} e ${numeros[unidade]}`
  }
  return num.toString()
}

function valorExtenso(valor: number): string {
  // Implementação simplificada
  return `${extenso(Math.floor(valor))} reais`
}
