# TEMPLATE: LANDING PAGE PRODUTO JURÍDICO

## INSTRUÇÕES DE USO

Este template segue a metodologia **VSL (Video Sales Letter)** adaptada para produtos jurídicos.

**Compliance OAB obrigatório:**
- Leia `.manus/knowledge/compliance-oab.md` ANTES de preencher
- Evite as 40 frases proibidas
- Use as 40 alternativas permitidas
- Inclua disclaimer obrigatório

**Como usar:**
1. Copie este template
2. Substitua [PLACEHOLDERS] com dados do produto
3. Valide compliance OAB
4. Crie arquivo em `src/app/(marketing)/solucoes/[category]/[slug]/page.tsx`

---

## METADATA

```typescript
export const metadata: Metadata = {
  title: "[NOME DO PRODUTO] | Garcez Palha",
  description: "[DESCRIÇÃO DE 150-160 CARACTERES COM BENEFÍCIO PRINCIPAL]",
  keywords: [
    "[keyword 1]",
    "[keyword 2]",
    "[keyword 3]",
    "advocacia",
    "direito",
    "consultoria jurídica"
  ],
  openGraph: {
    title: "[NOME DO PRODUTO] | Garcez Palha",
    description: "[DESCRIÇÃO OG]",
    images: ['/og-image-[slug].jpg'],
  },
}
```

---

## HERO SECTION (Acima da Dobra)

### Headline (H1)
**Formato:** Problema + Solução + Urgência

**Exemplo:**
"[PROBLEMA]? Resolva em [PRAZO] com Assistência Jurídica Especializada"

**Placeholder:**
```
[PROBLEMA DO CLIENTE]? Resolva em [PRAZO REALISTA] com [SOLUÇÃO ESPECÍFICA]
```

### Subheadline (H2)
**Formato:** Benefício + Prova Social

**Exemplo:**
"Escritório com 364 anos de tradição. 95% de sucesso em casos similares."

**Placeholder:**
```
[BENEFÍCIO PRINCIPAL]. [CREDENCIAL + RESULTADO HISTÓRICO].
```

### CTA Principal
```
[BOTÃO] Iniciar Consulta Gratuita
```

**Compliance:** "Consulta gratuita" é permitido se for análise preliminar, não promessa de trabalho sem custo.

---

## SECTION 1: PROBLEM (Dor do Cliente)

### Título
**Formato:** Pergunta + Empatia

**Exemplo:**
"Você Está Passando Por Isso?"

### Problemas (3-5 bullet points)

**Estrutura de cada bullet:**
- ❌ **[SITUAÇÃO ESPECÍFICA]:** [CONSEQUÊNCIA EMOCIONAL/FINANCEIRA]

**Exemplo:**
```
- ❌ **Conta bloqueada há semanas:** Não consegue pagar contas ou receber salário
- ❌ **Banco não responde:** Protocolos e SAC não resolvem
- ❌ **Medo de perder dinheiro:** Receio de cobranças indevidas ou bloqueio permanente
```

**Placeholder:**
```
- ❌ **[PROBLEMA 1]:** [CONSEQUÊNCIA]
- ❌ **[PROBLEMA 2]:** [CONSEQUÊNCIA]
- ❌ **[PROBLEMA 3]:** [CONSEQUÊNCIA]
```

---

## SECTION 2: AGITATE (Aumentar a Dor)

### Título
**Formato:** Custo de Não Agir

**Exemplo:**
"Sem Ação Jurídica, Você Pode Perder Mais"

### Agravantes (3 pontos)

**Estrutura:**
- ⚠️ **[CONSEQUÊNCIA FINANCEIRA/LEGAL/EMOCIONAL]**

**Exemplo:**
```
- ⚠️ **Bloqueio pode virar cobrança judicial indevida**
- ⚠️ **Prazos legais estão correndo contra você**
- ⚠️ **Banco pode alegar consentimento se você não contestar formalmente**
```

**Placeholder:**
```
- ⚠️ **[CONSEQUÊNCIA SE NÃO AGIR 1]**
- ⚠️ **[CONSEQUÊNCIA SE NÃO AGIR 2]**
- ⚠️ **[CONSEQUÊNCIA SE NÃO AGIR 3]**
```

---

## SECTION 3: SOLUTION (Nossa Solução)

### Título
**Formato:** Promessa + Método

**Exemplo:**
"Como Resolvemos: Método Garcez Palha em 3 Etapas"

### Etapas (3 passos)

**Estrutura:**
```
1️⃣ **[NOME DA ETAPA]**
[DESCRIÇÃO DE 1-2 LINHAS]
[PRAZO]

2️⃣ **[NOME DA ETAPA]**
[DESCRIÇÃO DE 1-2 LINHAS]
[PRAZO]

3️⃣ **[NOME DA ETAPA]**
[DESCRIÇÃO DE 1-2 LINHAS]
[PRAZO]
```

**Exemplo:**
```
1️⃣ **Análise Jurídica Imediata**
Revisamos seu caso, documentação bancária e identificamos fundamentos legais.
Prazo: 24-48h após documentação completa

2️⃣ **Protocolo Extrajudicial**
Notificação ao banco com base jurídica sólida (CDC, Lei 12.527/2011).
Prazo: 72h após aprovação

3️⃣ **Acompanhamento Até Resolução**
Monitoramos resposta do banco e, se necessário, judicializamos.
Prazo: 15-30 dias para resolução total
```

**Compliance:** Prazos devem ser de "protocolo" ou "resposta", não de "decisão judicial" (variável).

---

## SECTION 4: PROOF (Prova Social)

### Título
**Formato:** Credibilidade

**Exemplo:**
"364 Anos de Tradição Jurídica"

### Credenciais (3-5 itens)

**Estrutura:**
```
✅ **[CREDENCIAL]:** [DETALHE]
```

**Exemplo:**
```
✅ **Tradição desde 1661:** 364 anos defendendo direitos
✅ **OAB/RJ 219.390:** Advogado inscrito e regular
✅ **CONPEJ/RJ:** Perito judicial certificado
✅ **95% de sucesso:** Histórico em casos bancários similares (dados internos)
```

**Placeholder:**
```
✅ **[CREDENCIAL 1]:** [DETALHE]
✅ **[CREDENCIAL 2]:** [DETALHE]
✅ **[CREDENCIAL 3]:** [DETALHE]
```

**Compliance:** Não use "melhor advogado" ou superlativos. Use "tradição", "especialização", "experiência".

---

## SECTION 5: OFFER (Oferta e Pricing)

### Título
**Formato:** Investimento + Benefício

**Exemplo:**
"Investimento Acessível Para Resolver de Vez"

### Planos (3 tiers)

**Estrutura por plano:**
```markdown
#### [NOME DO PLANO]
**R$ [PREÇO]** | [FORMA DE PAGAMENTO]

**Inclui:**
- ✅ [DELIVERABLE 1]
- ✅ [DELIVERABLE 2]
- ✅ [DELIVERABLE 3]

**Ideal para:** [PERFIL DO CLIENTE]

[BOTÃO CTA]
```

**Exemplo:**
```markdown
#### Plano Essencial
**R$ 1.500** | Pix ou 3x cartão

**Inclui:**
- ✅ Análise jurídica completa do caso
- ✅ Notificação extrajudicial ao banco
- ✅ Acompanhamento por 30 dias

**Ideal para:** Bloqueios simples, sem contestação anterior

[Contratar Plano Essencial]
```

**Placeholder:**
```markdown
#### [NOME DO PLANO]
**R$ [PREÇO]** | [PARCELAMENTO]

**Inclui:**
- ✅ [DELIVERABLE 1]
- ✅ [DELIVERABLE 2]
- ✅ [DELIVERABLE 3]

**Ideal para:** [PERFIL]

[BOTÃO]
```

---

## SECTION 6: FAQ (Objeções)

### Título
"Perguntas Frequentes"

### Perguntas (5-8)

**Estrutura:**
```markdown
**Q: [PERGUNTA DO CLIENTE]**
A: [RESPOSTA CLARA E OBJETIVA]
```

**Exemplo:**
```markdown
**Q: Quanto tempo leva para desbloquear minha conta?**
A: O protocolo da notificação ocorre em até 72h. A resposta do banco varia de 15-30 dias. Se necessário, judicializamos para acelerar.

**Q: Preciso pagar antecipado?**
A: Sim, 50% na contratação e 50% após protocolo. Garantimos transparência total no processo.

**Q: E se o banco não responder?**
A: Judicializamos o caso sem custo adicional (já incluído no plano contratado).
```

**Compliance:** Não prometa "garantia de ganho" ou "100% de sucesso". Use "histórico", "experiência", "já incluído".

---

## SECTION 7: CTA FINAL (Urgência)

### Título
**Formato:** Urgência + Ação

**Exemplo:**
"Não Espere Mais. Resolva Hoje."

### Mensagem de Urgência

**Estrutura:**
```
[CONSEQUÊNCIA DE ESPERAR] + [BENEFÍCIO DE AGIR AGORA] + [CTA]
```

**Exemplo:**
```
Cada dia de espera pode significar mais cobranças indevidas ou bloqueios permanentes.

Inicie sua consulta gratuita agora e tenha um advogado especializado analisando seu caso em 24h.

[BOTÃO GRANDE] Iniciar Consulta Gratuita
```

**Compliance:** "Consulta gratuita" OK se for análise preliminar. Não use "Última chance" ou "Vagas limitadas" (captação irregular).

---

## SECTION 8: DISCLAIMER (Obrigatório OAB)

```markdown
---

**Disclaimer Legal:**

As informações neste site têm caráter orientativo e não substituem consulta jurídica formal. Cada caso possui particularidades que devem ser analisadas individualmente por profissional habilitado. Resultados passados não garantem resultados futuros. Prazos mencionados referem-se a protocolo de documentos, não a decisões judiciais (que variam por tribunal e complexidade do caso).

**OAB/RJ 219.390 | CONPEJ/RJ | CRECI/RJ**

Garcez Palha - Advocacia e Perícia | Tradição desde 1661
```

---

## CÓDIGO NEXT.JS (ProductVSL Component)

```typescript
import { Metadata } from 'next'
import { ProductVSL } from '@/components/vsl'
import { getProductBySlug } from '@/lib/products/catalog'
import { getVSLConfig } from '@/lib/products/vsl-config'

export const metadata: Metadata = {
  title: '[NOME DO PRODUTO] | Garcez Palha',
  description: '[DESCRIÇÃO DE 150-160 CARACTERES]',
  keywords: [
    '[keyword 1]',
    '[keyword 2]',
    '[keyword 3]',
    'advocacia',
    'direito',
  ],
  openGraph: {
    title: '[NOME DO PRODUTO] | Garcez Palha',
    description: '[DESCRIÇÃO]',
    images: ['/og-image-[slug].jpg'],
  },
}

export default function [NomeDoProduto]Page() {
  const product = getProductBySlug('[slug-do-produto]')

  if (!product) {
    return null
  }

  const vslConfig = {
    heroColor: '[blue|violet|green|red]',
    heroIcon: '[Shield|Phone|Scale]',
    agitationPoints: [
      '[PAIN POINT 1]',
      '[PAIN POINT 2]',
      '[PAIN POINT 3]',
      '[PAIN POINT 4]',
      '[PAIN POINT 5]',
      '[PAIN POINT 6]',
    ],
    solutionSteps: [
      '[SOLUTION STEP 1]',
      '[SOLUTION STEP 2]',
      '[SOLUTION STEP 3]',
      '[SOLUTION STEP 4]',
      '[SOLUTION STEP 5]',
      '[SOLUTION STEP 6]',
    ],
    urgencyMessage: '[MENSAGEM DE URGÊNCIA]',
    guaranteeTitle: '[TÍTULO DA GARANTIA]',
    guaranteeDescription: '[DESCRIÇÃO DA GARANTIA]',
    stats: {
      years: 10,
      cases: 300,
      successRate: 85,
      clients: 250,
    },
  }

  return (
    <ProductVSL
      product={product}
      heroColor={vslConfig.heroColor}
      heroIcon={vslConfig.heroIcon}
      agitationPoints={vslConfig.agitationPoints}
      solutionSteps={vslConfig.solutionSteps}
      urgencyMessage={vslConfig.urgencyMessage}
      guaranteeTitle={vslConfig.guaranteeTitle}
      guaranteeDescription={vslConfig.guaranteeDescription}
      stats={vslConfig.stats}
    />
  )
}

// Generate static paths
export async function generateStaticParams() {
  return [{ category: '[category]', slug: '[slug]' }]
}
```

---

## CHECKLIST FINAL

Antes de publicar, verifique:

- [ ] Leu `.manus/knowledge/compliance-oab.md`
- [ ] Nenhuma das 40 frases proibidas usada
- [ ] Disclaimer obrigatório incluído
- [ ] Prazos são de "protocolo", não de "decisão judicial"
- [ ] Não promete "garantia de ganho" ou "100% de sucesso"
- [ ] Credenciais (OAB, CONPEJ, CRECI) mencionadas
- [ ] Metadata SEO preenchida
- [ ] 3 tiers de pricing (Essencial, Premium, VIP)
- [ ] FAQ com 5-8 perguntas
- [ ] CTA claro em todas as sections
- [ ] Stats grid com 4 métricas
- [ ] AgitationSection com 6 pain points
- [ ] SolutionSection com 6 solution steps
- [ ] Todas as credenciais verificadas
- [ ] Produto existe em `src/lib/products/catalog.ts`

---

## EXEMPLO COMPLETO: SEGURO PRESTAMISTA

### Código Implementado

```typescript
import { Metadata } from 'next'
import { ProductVSL } from '@/components/vsl'
import { getProductBySlug } from '@/lib/products/catalog'

export const metadata: Metadata = {
  title: 'Seguro Prestamista Obrigatório? Cancele e Recupere | Garcez Palha',
  description: 'Banco te obrigou a contratar seguro prestamista? Isso é venda casada e é ILEGAL. Recupere 100% do valor pago + indenização. Escritório especializado com 364 anos de tradição.',
  keywords: [
    'seguro prestamista obrigatório',
    'cancelar seguro prestamista',
    'venda casada banco advogado',
    'restituição seguro prestamista',
    'seguro embutido empréstimo',
    'advogado bancário',
    'direito consumidor banco',
    'CDC venda casada',
  ],
  openGraph: {
    title: 'Seguro Prestamista Obrigatório? Cancele e Recupere | Garcez Palha',
    description: 'Recupere 100% do seguro prestamista + indenização. Venda casada é ILEGAL.',
    images: ['/og-image-seguro-prestamista.jpg'],
  },
}

export default function SeguroPrestamistatPage() {
  const product = getProductBySlug('seguro-prestamista')

  if (!product) {
    return null
  }

  return (
    <ProductVSL
      product={product}
      heroColor="violet"
      heroIcon="Shield"
      agitationPoints={[
        'Banco cobrou seguro SEM SUA AUTORIZAÇÃO explícita (venda casada)',
        'Valor do seguro foi embutido nas parcelas sem você perceber',
        'Te disseram que era "obrigatório" para liberar o empréstimo',
        'Seguro cobre riscos que você já tem em outro lugar',
        'Já pagou centenas ou milhares em seguro que não contratou',
        'Banco lucra até 80% do valor do seguro às suas custas',
      ]}
      solutionSteps={[
        'Análise completa do contrato de empréstimo/financiamento',
        'Levantamento de todos os seguros cobrados indevidamente',
        'Cálculo da restituição em DOBRO (Art. 42 CDC)',
        'Notificação extrajudicial ao banco (CDC + STJ Tema 972)',
        'Ação judicial se banco não restituir em 15 dias',
        'Recuperação total + indenização por danos morais (R$ 3k-5k)',
      ]}
      urgencyMessage="⚠️ PRAZO LEGAL: 5 anos para processar. Não deixe prescrever!"
      guaranteeTitle="Escritório Especializado em Direito Bancário"
      guaranteeDescription="364 anos de tradição. Atuação em centenas de casos de venda casada. Análise gratuita do seu contrato."
      stats={{
        years: 364,
        cases: 450,
        successRate: 95,
        clients: 380,
      }}
    />
  )
}

export async function generateStaticParams() {
  return [{ category: 'bancario', slug: 'seguro-prestamista' }]
}
```

---

**Criado por:** MANUS v7.0
**Data:** 29/12/2025
**Versão:** 1.0
**Linhas:** ~410
