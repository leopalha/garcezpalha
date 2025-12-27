/**
 * Template de Contrato: Perícia Médica
 * Conformidade: CFM (Conselho Federal de Medicina) e Código de Ética Médica
 */

export interface PeriMedicaData {
  // Partes
  contratante_nome: string
  contratante_cpf: string
  contratante_endereco: string
  contratado_nome: string
  contratado_crm: string
  contratado_especialidade: string

  // Objeto da Perícia
  tipo_pericia: string // Trabalhista, Previdenciária, Cível, Criminal
  objetivo_pericia: string
  paciente_nome: string
  paciente_cpf: string
  patologia_investigada: string

  // Exames e Procedimentos
  exames_necessarios: string[]
  necessita_vistoria: boolean
  local_pericia: string

  // Prazos e Valores
  prazo_entrega_dias: number
  data_pericia?: string
  valor_total: number
  forma_pagamento: string
  data_vencimento: string
  data_contrato: string
}

export function gerarContratoPericaMedica(data: PeriMedicaData): string {
  return `
CONTRATO DE PRESTAÇÃO DE SERVIÇOS DE PERÍCIA MÉDICA

CONTRATANTE: ${data.contratante_nome}, CPF ${data.contratante_cpf}, residente e domiciliado em ${data.contratante_endereco}.

CONTRATADO: ${data.contratado_nome}, CRM ${data.contratado_crm}, médico especialista em ${data.contratado_especialidade}.

As partes acima qualificadas têm, entre si, justo e acertado o presente Contrato de Prestação de Serviços de Perícia Médica, que se regerá pelas cláusulas seguintes e pelas condições descritas no presente.

CLÁUSULA PRIMEIRA – DO OBJETO

1.1. O presente contrato tem por objeto a realização de perícia médica ${data.tipo_pericia}.

1.2. Objetivo da perícia: ${data.objetivo_pericia}.

1.3. Paciente (periciando): ${data.paciente_nome}, CPF ${data.paciente_cpf}.

1.4. Patologia investigada: ${data.patologia_investigada}.

CLÁUSULA SEGUNDA – DA METODOLOGIA E PROCEDIMENTOS

2.1. A perícia será realizada em conformidade com:
   a) Código de Ética Médica do CFM;
   b) Resoluções do Conselho Federal de Medicina;
   c) Normas técnicas e científicas aplicáveis;
   d) Princípios da bioética médica.

2.2. A perícia incluirá:
   a) Anamnese detalhada do periciando;
   b) Exame físico específico;
   c) Análise de documentação médica prévia;
   d) Análise de exames complementares;
   e) ${data.necessita_vistoria ? 'Vistoria ao local do acidente/trabalho (se aplicável)' : 'Análise documental'};
   f) Correlação clínico-pericial;
   g) Emissão de laudo pericial médico.

${data.exames_necessarios.length > 0 ? `2.3. Exames complementares necessários:\n${data.exames_necessarios.map((e, i) => `   ${String.fromCharCode(97 + i)}) ${e};`).join('\n')}` : ''}

2.4. Local da perícia: ${data.local_pericia}.

${data.data_pericia ? `2.5. Data prevista para a perícia: ${data.data_pericia}.` : ''}

CLÁUSULA TERCEIRA – DAS RESPONSABILIDADES DO CONTRATADO

3.1. O CONTRATADO obriga-se a:
   a) Realizar a perícia com zelo, técnica e ética profissional;
   b) Atuar com total imparcialidade e independência técnica;
   c) Manter sigilo médico sobre informações obtidas;
   d) Emitir laudo pericial fundamentado cientificamente;
   e) Responder quesitos formulados de forma clara e técnica;
   f) Cumprir o prazo estabelecido neste contrato;
   g) Respeitar a dignidade e privacidade do periciando.

3.2. O laudo pericial médico conterá, no mínimo:
   a) Identificação do solicitante e do perito;
   b) Identificação do periciando;
   c) Objetivo da perícia e quesitos formulados;
   d) Histórico clínico (anamnese);
   e) Descrição do exame físico realizado;
   f) Análise de documentação médica e exames;
   g) Discussão médico-pericial;
   h) Conclusões médicas fundamentadas;
   i) Respostas aos quesitos;
   j) Avaliação de nexo causal (quando aplicável);
   k) Avaliação de grau de incapacidade (quando aplicável);
   l) Data e assinatura do perito médico.

CLÁUSULA QUARTA – DO NEXO CAUSAL E INCAPACIDADE

4.1. Quando aplicável, o laudo incluirá:
   a) Análise do nexo de causalidade entre patologia e evento alegado;
   b) Avaliação do grau de incapacidade (temporária/permanente, parcial/total);
   c) Prognóstico médico;
   d) Necessidade de tratamento e reabilitação.

4.2. As conclusões serão baseadas em evidências científicas e correlação clínico-pericial objetiva.

CLÁUSULA QUINTA – DAS RESPONSABILIDADES DO CONTRATANTE

5.1. O CONTRATANTE obriga-se a:
   a) Fornecer todos os documentos médicos do periciando;
   b) Garantir a presença do periciando na data agendada;
   c) Informar histórico médico completo e verídico;
   d) Fornecer resultados de exames complementares;
   e) Efetuar o pagamento na forma pactuada;
   f) Respeitar a independência técnica do perito.

5.2. O periciando deverá:
   a) Comparecer à perícia na data e horário agendados;
   b) Portar documento de identidade com foto;
   c) Apresentar-se em condições de ser examinado;
   d) Colaborar com o exame médico;
   e) Fornecer informações verídicas sobre seu estado de saúde.

CLÁUSULA SEXTA – DO PRAZO

6.1. O prazo para entrega do laudo pericial médico é de ${data.prazo_entrega_dias} (${extenso(data.prazo_entrega_dias)}) dias úteis, contados da data de realização da perícia.

6.2. Caso sejam necessários exames complementares, o prazo será contado a partir do recebimento dos resultados dos exames.

6.3. O prazo poderá ser prorrogado mediante acordo entre as partes, em caso de:
   a) Necessidade de exames complementares não previstos;
   b) Complexidade médica superior à estimada;
   c) Caso fortuito ou força maior.

CLÁUSULA SÉTIMA – DO VALOR E FORMA DE PAGAMENTO

7.1. Pelos serviços ora contratados, o CONTRATANTE pagará ao CONTRATADO o valor total de R$ ${data.valor_total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} (${valorExtenso(data.valor_total)}).

7.2. Forma de pagamento: ${data.forma_pagamento}.

7.3. Vencimento: ${data.data_vencimento}.

7.4. O valor inclui:
   a) Consulta pericial médica;
   b) Análise de documentação médica;
   c) Emissão do laudo pericial médico;
   d) Respostas a quesitos (até 10 quesitos);
   e) Uma via impressa e uma via digital do laudo.

7.5. Não estão inclusos no valor:
   a) Exames complementares laboratoriais ou de imagem;
   b) Quesitos adicionais (acima de 10);
   c) Deslocamentos fora do município;
   d) Comparecimento em audiência judicial (cobrado separadamente).

CLÁUSULA OITAVA – DO SIGILO MÉDICO

8.1. O CONTRATADO compromete-se a manter sigilo médico sobre todas as informações obtidas no exercício de suas funções, nos termos do Código de Ética Médica.

8.2. O laudo pericial será entregue exclusivamente ao CONTRATANTE ou à autoridade competente.

8.3. Dados sensíveis do periciando serão protegidos conforme LGPD (Lei Geral de Proteção de Dados).

CLÁUSULA NONA – DA IMPARCIALIDADE E ÉTICA

9.1. O CONTRATADO declara:
   a) Não possuir vínculo ou interesse que comprometa sua imparcialidade;
   b) Não ter relação pessoal ou profissional com o periciando;
   c) Atuará com total independência técnica;
   d) Emitirá conclusões baseadas exclusivamente em análise médica e científica.

9.2. O CONTRATADO seguirá rigorosamente os princípios éticos da medicina pericial:
   a) Veracidade;
   b) Imparcialidade;
   c) Fundamentação científica;
   d) Respeito à dignidade humana.

CLÁUSULA DÉCIMA – DA RESPONSABILIDADE TÉCNICA

10.1. O CONTRATADO responderá, nos termos da lei e do Código de Ética Médica, pela exatidão das informações prestadas e pela correção técnica do laudo emitido.

10.2. O laudo terá validade conforme legislação vigente e prática médico-pericial.

CLÁUSULA DÉCIMA PRIMEIRA – DA AUSÊNCIA DO PERICIANDO

11.1. Caso o periciando não compareça à perícia agendada sem justificativa prévia e fundada:
   a) Será agendada nova data (mediante disponibilidade);
   b) Poderá ser cobrada taxa de remarcação;
   c) Em caso de segunda ausência injustificada, o contrato poderá ser rescindido com ônus para o CONTRATANTE.

CLÁUSULA DÉCIMA SEGUNDA – DA RESCISÃO

12.1. O presente contrato poderá ser rescindido:
   a) Por acordo entre as partes;
   b) Por inadimplemento de quaisquer das obrigações assumidas;
   c) Por impossibilidade superveniente de cumprimento;
   d) Por impedimento ético do perito.

12.2. Em caso de rescisão por culpa do CONTRATANTE, serão devidos os honorários proporcionais ao trabalho realizado.

CLÁUSULA DÉCIMA TERCEIRA – DAS DISPOSIÇÕES GERAIS

13.1. O presente contrato rege-se pelo Código de Ética Médica do CFM, Resoluções do CFM e pelo Código Civil Brasileiro.

13.2. Fica eleito o foro da Comarca do Rio de Janeiro para dirimir quaisquer questões oriundas deste contrato.

13.3. Este contrato é celebrado em caráter irrevogável e irretratável, obrigando as partes e seus sucessores.

E, por estarem assim justos e contratados, firmam o presente instrumento em 2 (duas) vias de igual teor e forma, na presença de 2 (duas) testemunhas.

Rio de Janeiro, ${data.data_contrato}.

_______________________________________
${data.contratante_nome}
CONTRATANTE

_______________________________________
${data.contratado_nome}
CRM ${data.contratado_crm}
CONTRATADO (PERITO MÉDICO)

TESTEMUNHAS:

_______________________________________
Nome:
CPF:

_______________________________________
Nome:
CPF:
`.trim()
}

// Funções auxiliares
function extenso(num: number): string {
  const numeros = ['zero', 'um', 'dois', 'três', 'quatro', 'cinco', 'seis', 'sete', 'oito', 'nove', 'dez',
    'onze', 'doze', 'treze', 'quatorze', 'quinze']
  if (num <= 15) return numeros[num]
  if (num < 100) {
    const dezenas = ['', '', 'vinte', 'trinta', 'quarenta', 'cinquenta', 'sessenta', 'setenta', 'oitenta', 'noventa']
    const dezena = Math.floor(num / 10)
    const unidade = num % 10
    return unidade === 0 ? dezenas[dezena] : `${dezenas[dezena]} e ${numeros[unidade]}`
  }
  return num.toString()
}

function valorExtenso(valor: number): string {
  return `${extenso(Math.floor(valor))} reais`
}
