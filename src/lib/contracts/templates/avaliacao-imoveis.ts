/**
 * Template de Contrato: Avaliação de Imóveis
 * Conformidade: NBR 14653 (ABNT - Avaliação de Bens)
 */

export interface AvaliacaoImoveisData {
  // Partes
  contratante_nome: string
  contratante_cpf: string
  contratante_endereco: string
  contratado_nome: string
  contratado_crea: string // CREA ou outro registro profissional

  // Imóvel
  endereco_imovel: string
  tipo_imovel: string // Apartamento, Casa, Terreno, etc
  area_total_m2: number
  matricula_imovel?: string
  finalidade_avaliacao: string // Compra, Venda, Financiamento, Judicial, etc

  // Metodologia
  metodo_avaliacao: string // Comparativo de Dados de Mercado, Renda, Custo
  nivel_precisao: string // Expedita, Normal, Rigorosa (NBR 14653)
  necessita_vistoria: boolean

  // Prazos e Valores
  prazo_entrega_dias: number
  data_vistoria?: string
  valor_total: number
  forma_pagamento: string
  data_vencimento: string
  data_contrato: string
}

export function gerarContratoAvaliacaoImoveis(data: AvaliacaoImoveisData): string {
  return `
CONTRATO DE PRESTAÇÃO DE SERVIÇOS DE AVALIAÇÃO DE IMÓVEIS

CONTRATANTE: ${data.contratante_nome}, CPF ${data.contratante_cpf}, residente e domiciliado em ${data.contratante_endereco}.

CONTRATADO: ${data.contratado_nome}, CREA ${data.contratado_crea}, profissional habilitado para realização de avaliações imobiliárias.

As partes acima qualificadas têm, entre si, justo e acertado o presente Contrato de Prestação de Serviços de Avaliação de Imóveis, que se regerá pelas cláusulas seguintes e pelas condições descritas no presente.

CLÁUSULA PRIMEIRA – DO OBJETO

1.1. O presente contrato tem por objeto a avaliação do imóvel localizado em: ${data.endereco_imovel}.

1.2. Tipo de imóvel: ${data.tipo_imovel}.

1.3. Área total: ${data.area_total_m2} m² (${extenso(data.area_total_m2)} metros quadrados).

${data.matricula_imovel ? `1.4. Matrícula: ${data.matricula_imovel}.` : ''}

1.5. Finalidade da avaliação: ${data.finalidade_avaliacao}.

CLÁUSULA SEGUNDA – DA METODOLOGIA

2.1. A avaliação será realizada em conformidade com a NBR 14653 da ABNT (Associação Brasileira de Normas Técnicas), partes pertinentes.

2.2. Método de avaliação: ${data.metodo_avaliacao}.

2.3. Grau de precisão: ${data.nivel_precisao}.

2.4. A avaliação incluirá:
   a) Análise de mercado imobiliário local;
   b) Pesquisa de preços de imóveis comparáveis;
   c) Aplicação de fatores de ajuste (localização, estado de conservação, etc);
   d) ${data.necessita_vistoria ? 'Vistoria técnica ao imóvel' : 'Análise documental'};
   e) Cálculo do valor de mercado;
   f) Emissão de laudo de avaliação técnico.

${data.necessita_vistoria && data.data_vistoria ? `2.5. Data prevista para vistoria: ${data.data_vistoria}.` : ''}

CLÁUSULA TERCEIRA – DAS RESPONSABILIDADES DO CONTRATADO

3.1. O CONTRATADO obriga-se a:
   a) Realizar a avaliação com técnica e zelo profissional;
   b) Observar rigorosamente as normas da NBR 14653;
   c) Emitir laudo de avaliação fundamentado tecnicamente;
   d) Responder pela veracidade das informações prestadas;
   e) Manter sigilo sobre informações obtidas;
   f) Cumprir o prazo estabelecido neste contrato.

3.2. O laudo de avaliação conterá, no mínimo:
   a) Identificação do solicitante e do avaliador;
   b) Objetivo da avaliação;
   c) Identificação e caracterização do imóvel;
   d) Indicação do método utilizado;
   e) Pesquisa de mercado e tratamento de dados;
   f) Cálculo do valor do imóvel;
   g) Resultado da avaliação;
   h) Data de referência da avaliação;
   i) Qualificação e assinatura do responsável técnico;
   j) Registro fotográfico (quando aplicável).

CLÁUSULA QUARTA – DAS RESPONSABILIDADES DO CONTRATANTE

4.1. O CONTRATANTE obriga-se a:
   a) Fornecer documentação do imóvel (matrícula, IPTU, etc);
   b) Permitir acesso ao imóvel para vistoria${data.necessita_vistoria ? '' : ' (se necessário)'};
   c) Prestar informações corretas e completas sobre o imóvel;
   d) Efetuar o pagamento na forma pactuada;
   e) Informar eventuais restrições ou gravames sobre o imóvel.

CLÁUSULA QUINTA – DO PRAZO

5.1. O prazo para entrega do laudo de avaliação é de ${data.prazo_entrega_dias} (${extenso(data.prazo_entrega_dias)}) dias úteis, contados da data de:
   ${data.necessita_vistoria ? 'realização da vistoria' : 'recebimento de toda documentação necessária'}.

5.2. O prazo poderá ser prorrogado mediante acordo entre as partes, em caso de:
   a) Dificuldade na obtenção de dados de mercado;
   b) Complexidade técnica superior à estimada;
   c) Caso fortuito ou força maior.

CLÁUSULA SEXTA – DO VALOR E FORMA DE PAGAMENTO

6.1. Pelos serviços ora contratados, o CONTRATANTE pagará ao CONTRATADO o valor total de R$ ${data.valor_total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} (${valorExtenso(data.valor_total)}).

6.2. Forma de pagamento: ${data.forma_pagamento}.

6.3. Vencimento: ${data.data_vencimento}.

6.4. O valor inclui:
   a) Pesquisa de mercado imobiliário;
   b) ${data.necessita_vistoria ? 'Vistoria técnica ao imóvel' : 'Análise documental'};
   c) Tratamento estatístico de dados (quando aplicável);
   d) Emissão do laudo de avaliação técnico;
   e) Uma via impressa e uma via digital do laudo.

6.5. Custos adicionais (deslocamento fora do município, laudos complementares) serão cobrados à parte, mediante aprovação prévia do CONTRATANTE.

CLÁUSULA SÉTIMA – DA VALIDADE DA AVALIAÇÃO

7.1. O laudo de avaliação terá validade de acordo com as normas da NBR 14653, sendo recomendada atualização periódica em função de alterações de mercado.

7.2. O valor apresentado refere-se às condições de mercado na data de referência da avaliação, podendo sofrer variações em função de alterações econômicas ou no imóvel.

CLÁUSULA OITAVA – DO SIGILO PROFISSIONAL

8.1. O CONTRATADO compromete-se a manter sigilo sobre todas as informações obtidas no exercício de suas funções.

8.2. O laudo e documentação produzida são de propriedade exclusiva do CONTRATANTE.

CLÁUSULA NONA – DA IMPARCIALIDADE

9.1. O CONTRATADO declara não possuir qualquer vínculo ou interesse que possa comprometer sua imparcialidade na realização da avaliação.

9.2. O CONTRATADO atuará com total independência técnica, emitindo conclusões baseadas exclusivamente em análise de mercado e critérios técnicos.

CLÁUSULA DÉCIMA – DA RESPONSABILIDADE TÉCNICA

10.1. O CONTRATADO responderá, nos termos da lei, pela exatidão das informações prestadas e pela correção técnica do laudo emitido.

10.2. O laudo será emitido com a devida Anotação de Responsabilidade Técnica (ART) do CREA, quando aplicável.

CLÁUSULA DÉCIMA PRIMEIRA – DA RESCISÃO

11.1. O presente contrato poderá ser rescindido:
   a) Por acordo entre as partes;
   b) Por inadimplemento de quaisquer das obrigações assumidas;
   c) Por impossibilidade superveniente de cumprimento.

11.2. Em caso de rescisão por culpa do CONTRATANTE, serão devidos os honorários proporcionais ao trabalho realizado.

CLÁUSULA DÉCIMA SEGUNDA – DAS DISPOSIÇÕES GERAIS

12.1. O presente contrato rege-se pelas normas da NBR 14653 da ABNT e pelo Código Civil Brasileiro.

12.2. Fica eleito o foro da Comarca do Rio de Janeiro para dirimir quaisquer questões oriundas deste contrato.

12.3. Este contrato é celebrado em caráter irrevogável e irretratável, obrigando as partes e seus sucessores.

E, por estarem assim justos e contratados, firmam o presente instrumento em 2 (duas) vias de igual teor e forma, na presença de 2 (duas) testemunhas.

Rio de Janeiro, ${data.data_contrato}.

_______________________________________
${data.contratante_nome}
CONTRATANTE

_______________________________________
${data.contratado_nome}
CREA ${data.contratado_crea}
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

// Funções auxiliares
function extenso(num: number): string {
  const numeros = ['zero', 'um', 'dois', 'três', 'quatro', 'cinco', 'seis', 'sete', 'oito', 'nove', 'dez']
  if (num <= 10) return numeros[num]
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
