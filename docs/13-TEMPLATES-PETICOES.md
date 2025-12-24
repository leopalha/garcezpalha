# 13 - TEMPLATES DE PETIÇÕES
## Garcez Palha - Inteligência Jurídica

---

## 1. VISÃO GERAL

### 1.1 Estrutura dos Templates

```
CADA TEMPLATE CONTÉM:
├── Cabeçalho padrão
├── Qualificação das partes (variáveis)
├── Fatos (variáveis)
├── Fundamentos jurídicos (base fixa + variações)
├── Pedidos (fixos com variações)
├── Fechamento padrão
└── Documentos anexos (checklist)
```

### 1.2 Variáveis Comuns

```
{NOME_CLIENTE} - Nome completo
{CPF_CLIENTE} - CPF
{RG_CLIENTE} - RG
{ENDERECO_CLIENTE} - Endereço completo
{TELEFONE_CLIENTE} - Telefone
{EMAIL_CLIENTE} - Email
{BANCO_REU} - Nome do banco/empresa ré
{VALOR_CAUSA} - Valor da causa
{VALOR_BLOQUEADO} - Valor bloqueado/devido
{NUMERO_PROCESSO} - Número do processo origem
{DATA_FATO} - Data do acontecimento
{DATA_ATUAL} - Data de hoje
{CIDADE} - Cidade do foro
```

---

## 2. PROTEÇÃO FINANCEIRA

### 2.1 Desbloqueio de Conta

```
EXCELENTÍSSIMO(A) SENHOR(A) DOUTOR(A) JUIZ(A) DE DIREITO DA 
___ VARA CÍVEL DA COMARCA DE {CIDADE}/{ESTADO}

Processo nº: {NUMERO_PROCESSO}
Exequente: {NOME_EXEQUENTE}
Executado: {NOME_CLIENTE}

{NOME_CLIENTE}, brasileiro(a), {ESTADO_CIVIL}, {PROFISSAO}, 
portador(a) do RG nº {RG_CLIENTE} e CPF nº {CPF_CLIENTE}, 
residente e domiciliado(a) em {ENDERECO_CLIENTE}, vem, 
respeitosamente, à presença de Vossa Excelência, por seu 
advogado infra-assinado, com fundamento no art. 833, IV e X, 
do Código de Processo Civil, requerer

DESBLOQUEIO DE VALORES

com fundamento nos fatos e direitos a seguir expostos:

I - DOS FATOS

1. O(A) Requerente foi surpreendido(a) com o bloqueio de 
valores em sua conta bancária junto ao {BANCO}, no valor 
de R$ {VALOR_BLOQUEADO}, conforme extrato em anexo.

2. Ocorre que os valores bloqueados são provenientes de 
{ORIGEM_VALORES} (salário/aposentadoria/pensão/poupança), 
conforme demonstram os documentos anexos.

3. O bloqueio está causando graves prejuízos ao Requerente, 
que depende integralmente desses valores para sua subsistência 
e de sua família.

II - DO DIREITO

4. O artigo 833 do CPC estabelece expressamente a 
impenhorabilidade de:

"Art. 833. São impenhoráveis:
IV - os vencimentos, os subsídios, os soldos, os salários, 
as remunerações, os proventos de aposentadoria, as pensões, 
os pecúlios e os montepios, bem como as quantias recebidas 
por liberalidade de terceiro e destinadas ao sustento do 
devedor e de sua família, os ganhos de trabalhador autônomo 
e os honorários de profissional liberal;
X - a quantia depositada em caderneta de poupança, até o 
limite de 40 (quarenta) salários-mínimos."

5. A jurisprudência pátria é pacífica no sentido de que 
{JURISPRUDENCIA_APLICAVEL}

{SE_SALARIO}
6. Conforme contracheque anexo, o Requerente percebe 
salário mensal de R$ {VALOR_SALARIO}, sendo este o 
único meio de sustento próprio e de sua família.
{/SE_SALARIO}

{SE_APOSENTADORIA}
6. Conforme extrato do INSS anexo, o Requerente percebe 
aposentadoria/pensão mensal de R$ {VALOR_BENEFICIO}, 
sendo este seu único meio de sustento.
{/SE_APOSENTADORIA}

{SE_POUPANCA}
6. Conforme extrato anexo, os valores bloqueados estavam 
depositados em caderneta de poupança, dentro do limite 
legal de 40 salários mínimos.
{/SE_POUPANCA}

III - DO PEDIDO

Ante o exposto, requer a Vossa Excelência:

a) A IMEDIATA LIBERAÇÃO dos valores bloqueados na conta 
   do(a) Requerente junto ao {BANCO}, no valor de 
   R$ {VALOR_BLOQUEADO};

b) A expedição de ofício ao {BANCO} para cumprimento 
   imediato;

c) Subsidiariamente, caso não entenda pela liberação 
   total, a liberação de valores suficientes para a 
   subsistência do(a) Requerente.

Termos em que,
Pede deferimento.

{CIDADE}, {DATA_ATUAL}.

_________________________________
LEONARDO MENDONÇA PALHA DA SILVA
OAB/RJ 219.390

DOCUMENTOS ANEXOS:
1. Procuração e documentos pessoais
2. Extrato bancário com o bloqueio
3. {SE_SALARIO}Contracheque{/SE_SALARIO}
   {SE_APOSENTADORIA}Extrato INSS{/SE_APOSENTADORIA}
   {SE_POUPANCA}Extrato da poupança{/SE_POUPANCA}
4. Comprovante de residência
```

---

### 2.2 Golpe do PIX - Ação de Indenização

```
EXCELENTÍSSIMO(A) SENHOR(A) DOUTOR(A) JUIZ(A) DE DIREITO DO 
JUIZADO ESPECIAL CÍVEL DA COMARCA DE {CIDADE}/{ESTADO}

{NOME_CLIENTE}, brasileiro(a), {ESTADO_CIVIL}, {PROFISSAO}, 
portador(a) do RG nº {RG_CLIENTE} e CPF nº {CPF_CLIENTE}, 
residente e domiciliado(a) em {ENDERECO_CLIENTE}, vem, 
respeitosamente, propor

AÇÃO DE INDENIZAÇÃO POR DANOS MATERIAIS E MORAIS
c/c PEDIDO DE TUTELA DE URGÊNCIA

em face de {BANCO_REU}, pessoa jurídica de direito privado, 
inscrita no CNPJ sob nº {CNPJ_REU}, com sede em {ENDERECO_REU}, 
pelos fatos e fundamentos a seguir:

I - DOS FATOS

1. Em {DATA_FATO}, o(a) Autor(a) foi vítima de golpe, tendo 
sido induzido(a) a erro por criminosos que se passaram por 
{TIPO_GOLPE}.

2. Em razão da fraude, o(a) Autor(a) realizou transferência 
via PIX no valor de R$ {VALOR_GOLPE} para conta de terceiro 
criminoso.

3. Imediatamente após perceber a fraude, o(a) Autor(a) entrou 
em contato com o Réu ({BANCO_REU}), solicitando o bloqueio 
da transação e acionamento do Mecanismo Especial de Devolução 
(MED), conforme protocolo nº {PROTOCOLO}.

4. Entretanto, o Réu {RESPOSTA_BANCO}.

II - DO DIREITO

A) DA RESPONSABILIDADE OBJETIVA DO BANCO

5. O artigo 14 do CDC estabelece a responsabilidade objetiva 
do fornecedor de serviços:

"Art. 14. O fornecedor de serviços responde, independentemente 
da existência de culpa, pela reparação dos danos causados aos 
consumidores por defeitos relativos à prestação dos serviços."

6. A Súmula 479 do STJ é expressa:

"As instituições financeiras respondem objetivamente pelos 
danos gerados por fortuito interno relativo a fraudes e 
delitos praticados por terceiros no âmbito de operações 
bancárias."

B) DO MECANISMO ESPECIAL DE DEVOLUÇÃO (MED)

7. A Resolução BCB nº 103/2021 instituiu o MED, mecanismo 
que permite a devolução de valores em caso de fraude no PIX.

8. O banco tem o dever de acionar o MED imediatamente quando 
informado de suspeita de fraude, o que não foi observado no 
caso em tela.

C) DOS DANOS MORAIS

9. Além do prejuízo material, o(a) Autor(a) sofreu abalo 
emocional significativo, caracterizando dano moral indenizável.

III - DOS PEDIDOS

Ante o exposto, requer:

a) A concessão de TUTELA DE URGÊNCIA para determinar ao Réu 
   o bloqueio de eventuais valores ainda existentes na conta 
   destinatária da fraude;

b) A condenação do Réu ao pagamento de R$ {VALOR_GOLPE} a 
   título de DANOS MATERIAIS;

c) A condenação do Réu ao pagamento de indenização por 
   DANOS MORAIS em valor não inferior a R$ {VALOR_DANOS_MORAIS};

d) A inversão do ônus da prova;

e) Os benefícios da gratuidade de justiça.

Dá-se à causa o valor de R$ {VALOR_CAUSA}.

{CIDADE}, {DATA_ATUAL}.

_________________________________
LEONARDO MENDONÇA PALHA DA SILVA
OAB/RJ 219.390
```

---

### 2.3 Negativação Indevida

```
EXCELENTÍSSIMO(A) SENHOR(A) DOUTOR(A) JUIZ(A) DE DIREITO DO 
JUIZADO ESPECIAL CÍVEL DA COMARCA DE {CIDADE}/{ESTADO}

{NOME_CLIENTE}, brasileiro(a), {ESTADO_CIVIL}, {PROFISSAO}, 
portador(a) do RG nº {RG_CLIENTE} e CPF nº {CPF_CLIENTE}, 
residente e domiciliado(a) em {ENDERECO_CLIENTE}, vem propor

AÇÃO DECLARATÓRIA DE INEXISTÊNCIA DE DÉBITO
c/c INDENIZAÇÃO POR DANOS MORAIS
c/c TUTELA DE URGÊNCIA

em face de {EMPRESA_RE}, pelos fatos e fundamentos a seguir:

I - DOS FATOS

1. O(A) Autor(a) tomou conhecimento de que seu nome foi 
inserido nos cadastros de inadimplentes (SPC/SERASA) por 
suposto débito no valor de R$ {VALOR_DIVIDA}, por ordem 
da Ré.

2. Ocorre que o(a) Autor(a) {MOTIVO_INEXISTENCIA}:
   {SE_NAO_RECONHECE}jamais contratou qualquer serviço ou 
   produto com a Ré{/SE_NAO_RECONHECE}
   {SE_JA_PAGOU}já quitou integralmente o débito, conforme 
   comprovantes anexos{/SE_JA_PAGOU}
   {SE_PRESCRITA}a dívida está prescrita há mais de 5 anos
   {/SE_PRESCRITA}

3. A negativação indevida causou constrangimento e prejuízos 
ao(à) Autor(a), que teve crédito negado.

II - DO DIREITO

4. O artigo 43 do CDC disciplina os cadastros de consumidores.

5. A Súmula 385 do STJ estabelece que o dano moral por 
negativação indevida é presumido (in re ipsa).

6. {SE_PRESCRITA}O artigo 206, §5º, I do CC estabelece 
prazo prescricional de 5 anos para cobrança de dívidas.
{/SE_PRESCRITA}

III - DOS PEDIDOS

Requer:

a) TUTELA DE URGÊNCIA para exclusão imediata da negativação;

b) DECLARAÇÃO de inexistência do débito;

c) Condenação ao pagamento de DANOS MORAIS de R$ {VALOR_DANOS};

d) Gratuidade de justiça.

Valor da causa: R$ {VALOR_CAUSA}.

{CIDADE}, {DATA_ATUAL}.

_________________________________
LEONARDO MENDONÇA PALHA DA SILVA
OAB/RJ 219.390
```

---

## 3. PROTEÇÃO PATRIMONIAL

### 3.1 Usucapião Extrajudicial (Requerimento)

```
EXCELENTÍSSIMO(A) SENHOR(A) OFICIAL DO {NUMERO_CARTORIO}º 
CARTÓRIO DE REGISTRO DE IMÓVEIS DA COMARCA DE {CIDADE}/{ESTADO}

{NOME_CLIENTE}, brasileiro(a), {ESTADO_CIVIL}, {PROFISSAO}, 
portador(a) do RG nº {RG_CLIENTE} e CPF nº {CPF_CLIENTE}, 
residente e domiciliado(a) em {ENDERECO_CLIENTE}, vem, por 
seu advogado, com fundamento no art. 216-A da Lei 6.015/73, 
requerer

RECONHECIMENTO EXTRAJUDICIAL DE USUCAPIÃO

do imóvel a seguir descrito:

I - DO IMÓVEL

Imóvel situado em {ENDERECO_IMOVEL}, com as seguintes 
características:
- Área: {AREA} m²
- Dimensões: {DIMENSOES}
- Confrontações: {CONFRONTACOES}
- {SE_CONSTRUIDO}Construção: {DESCRICAO_CONSTRUCAO}{/SE_CONSTRUIDO}

II - DA POSSE

1. O(A) Requerente exerce posse mansa, pacífica e 
ininterrupta sobre o imóvel há {TEMPO_POSSE} anos, 
desde {DATA_INICIO_POSSE}.

2. Durante todo esse período, o(a) Requerente {ATOS_POSSE}:
   - Pagou todos os impostos (IPTU)
   - Realizou benfeitorias
   - Manteve o imóvel como sua moradia
   - Exerceu todos os atos de dono

III - DO DIREITO

3. O artigo 1.238 do Código Civil estabelece:

"Aquele que, por quinze anos, sem interrupção, nem oposição, 
possuir como seu um imóvel, adquire-lhe a propriedade, 
independentemente de título e boa-fé."

{SE_10_ANOS}
4. O parágrafo único reduz o prazo para 10 anos se o 
possuidor houver estabelecido no imóvel a sua moradia 
habitual ou nele realizado obras ou serviços de caráter 
produtivo.
{/SE_10_ANOS}

IV - DOS DOCUMENTOS

Juntam-se os seguintes documentos:
a) Ata notarial atestando tempo e forma de posse
b) Planta e memorial descritivo
c) Certidões negativas
d) Comprovantes de pagamento de IPTU
e) Contas de serviços públicos
f) Declarações de confrontantes
g) {OUTROS_DOCUMENTOS}

V - DO PEDIDO

Ante o exposto, requer:

a) O processamento do pedido de usucapião extrajudicial;
b) As notificações de praxe;
c) O registro da propriedade em nome do(a) Requerente.

{CIDADE}, {DATA_ATUAL}.

_________________________________
LEONARDO MENDONÇA PALHA DA SILVA
OAB/RJ 219.390
```

---

## 4. PROTEÇÃO SAÚDE

### 4.1 Plano de Saúde - Tutela de Urgência

```
EXCELENTÍSSIMO(A) SENHOR(A) DOUTOR(A) JUIZ(A) DE DIREITO DA 
___ VARA CÍVEL DA COMARCA DE {CIDADE}/{ESTADO}

{NOME_CLIENTE}, brasileiro(a), {ESTADO_CIVIL}, {PROFISSAO}, 
portador(a) do RG nº {RG_CLIENTE} e CPF nº {CPF_CLIENTE}, 
residente e domiciliado(a) em {ENDERECO_CLIENTE}, vem propor

AÇÃO DE OBRIGAÇÃO DE FAZER
c/c INDENIZAÇÃO POR DANOS MORAIS
c/c TUTELA DE URGÊNCIA

em face de {OPERADORA_PLANO}, pelos fatos e fundamentos:

I - DOS FATOS

1. O(A) Autor(a) é beneficiário(a) do plano de saúde 
operado pela Ré, contrato nº {NUMERO_CONTRATO}.

2. Em {DATA_PEDIDO}, o médico assistente Dr.(a) {NOME_MEDICO}, 
CRM {CRM}, prescreveu a realização de {PROCEDIMENTO} em 
razão de {DIAGNOSTICO}.

3. O(A) Autor(a) solicitou a autorização junto à Ré, que 
NEGOU a cobertura, conforme documento anexo, alegando 
{MOTIVO_NEGATIVA}.

4. A negativa é abusiva e coloca em risco a saúde do(a) 
Autor(a).

II - DO DIREITO

A) DA OBRIGATORIEDADE DA COBERTURA

5. {SE_ROL_ANS}O procedimento consta expressamente do 
Rol de Procedimentos da ANS.{/SE_ROL_ANS}

6. A Súmula 302 do STJ estabelece que "é abusiva a cláusula 
contratual de plano de saúde que limita no tempo a 
internação hospitalar do segurado."

7. O artigo 35-C da Lei 9.656/98 obriga a cobertura de 
atendimento nos casos de emergência e urgência.

B) DA URGÊNCIA

8. A situação de saúde do(a) Autor(a) é {GRAVIDADE}, 
conforme laudo médico anexo.

9. O retardo no tratamento pode causar {CONSEQUENCIAS}.

C) DOS DANOS MORAIS

10. A negativa abusiva causa sofrimento e angústia, 
configurando dano moral indenizável.

III - DOS PEDIDOS

Requer:

a) TUTELA DE URGÊNCIA para determinar que a Ré autorize 
   e custeie imediatamente o procedimento de {PROCEDIMENTO}, 
   sob pena de multa diária de R$ {MULTA};

b) A CONFIRMAÇÃO da tutela em sentença definitiva;

c) Condenação em DANOS MORAIS de R$ {VALOR_DANOS};

d) Inversão do ônus da prova.

Valor da causa: R$ {VALOR_CAUSA}.

{CIDADE}, {DATA_ATUAL}.

_________________________________
LEONARDO MENDONÇA PALHA DA SILVA
OAB/RJ 219.390

DOCUMENTOS:
1. Contrato do plano
2. Carteirinha
3. Negativa por escrito
4. Pedido médico
5. Laudos e exames
6. Protocolo ANS (se houver)
```

---

## 5. DOCUMENTOS AUXILIARES

### 5.1 Procuração

```
PROCURAÇÃO AD JUDICIA ET EXTRA

OUTORGANTE: {NOME_CLIENTE}, brasileiro(a), {ESTADO_CIVIL}, 
{PROFISSAO}, portador(a) do RG nº {RG_CLIENTE} e inscrito(a) 
no CPF sob nº {CPF_CLIENTE}, residente e domiciliado(a) em 
{ENDERECO_CLIENTE}.

OUTORGADO: LEONARDO MENDONÇA PALHA DA SILVA, advogado, 
inscrito na OAB/RJ sob nº 219.390, com escritório na 
{ENDERECO_ESCRITORIO}.

PODERES: Representar o(a) Outorgante em juízo ou fora dele, 
podendo propor ações, contestar, recorrer, transigir, 
desistir, dar e receber quitação, substabelecer com ou 
sem reservas, e praticar todos os atos necessários ao 
fiel cumprimento deste mandato.

FINALIDADE: {TIPO_ACAO}

{CIDADE}, {DATA_ATUAL}.

_________________________________
{NOME_CLIENTE}
```

### 5.2 Declaração de Hipossuficiência

```
DECLARAÇÃO DE HIPOSSUFICIÊNCIA

Eu, {NOME_CLIENTE}, brasileiro(a), portador(a) do RG nº 
{RG_CLIENTE} e CPF nº {CPF_CLIENTE}, DECLARO, para os 
devidos fins e sob as penas da lei, que não possuo 
condições de arcar com as custas processuais e honorários 
advocatícios sem prejuízo do sustento próprio e de minha 
família.

Declaro ainda estar ciente de que a falsidade desta 
declaração configura crime de falsidade ideológica, 
previsto no art. 299 do Código Penal.

{CIDADE}, {DATA_ATUAL}.

_________________________________
{NOME_CLIENTE}
```

---

## 6. ORGANIZAÇÃO DOS TEMPLATES

### 6.1 Estrutura de Arquivos

```
/templates
├── /financeiro
│   ├── desbloqueio-conta.md
│   ├── golpe-pix.md
│   ├── negativacao-indevida.md
│   └── defesa-execucao.md
├── /patrimonial
│   ├── usucapiao-extrajudicial.md
│   ├── usucapiao-judicial.md
│   └── inventario.md
├── /saude
│   ├── plano-saude-liminar.md
│   ├── tea-sessoes-ilimitadas.md
│   └── bpc-loas.md
├── /auxiliares
│   ├── procuracao.md
│   ├── hipossuficiencia.md
│   └── substabelecimento.md
└── /cabecalhos
    ├── vara-civel.md
    ├── juizado-especial.md
    └── cartorio.md
```

---

*Documento: 13-TEMPLATES-PETICOES.md*
*Versão: 1.0*
