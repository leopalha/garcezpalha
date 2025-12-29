# 🚀 SPRINT 7 - ETAPA 2: ESTRUTURA DE PRODUTOS

**Data Início**: 27/12/2025 17:30
**Estimativa**: 20-25 horas (5-6 dias)
**Prioridade**: 🟡 P1 (Alta)
**Status**: ⏳ PRONTO PARA INICIAR

---

## 🎯 OBJETIVO DA ETAPA 2

Adicionar 22 novos produtos ao sistema, configurando toda a estrutura de código necessária para suportar os novos nichos identificados na Etapa 1.

---

## 📋 ESCOPO COMPLETO

### Arquivos a Modificar:
1. `src/lib/ai/qualification/agent-product-mapping.ts`
2. `src/lib/ai/qualification/schemas/`
3. `src/server/api/routers/products.ts` (TRPC)
4. `src/lib/products/product-catalog.ts`

### Arquivos a Criar:
1. 22 schemas de validação em `schemas/`
2. 22 calculadoras de honorários (se necessário)
3. Testes unitários para novos produtos

---

## 🎨 PLANO DE IMPLEMENTAÇÃO

### FASE 1: TOP 5 PRIORITÁRIOS (8-10h)

Implementar os 5 nichos de prioridade máxima identificados:

#### 1. FIN-010: Seguro Prestamista ✅
**Estimativa**: 2h
**Tarefas**:
- [ ] Adicionar productId: `seguro-prestamista`
- [ ] Schema de validação (valor empréstimo, venda casada detectada)
- [ ] Calculadora: R$1.500 fixo + 30% recuperado
- [ ] Keywords: "seguro prestamista", "venda casada", "empréstimo forçado"
- [ ] Qualification flow (3 perguntas)
- [ ] Cross-sell: Revisão Contrato Bancário

#### 2. FIN-013: Fraude Consignado ✅
**Estimativa**: 2h
**Tarefas**:
- [ ] Adicionar productId: `fraude-consignado`
- [ ] Schema (valor empréstimo, desconto indevido, tempo)
- [ ] Calculadora: R$2.500 fixo + 30% recuperado
- [ ] Keywords: "fraude consignado", "desconto indevido", "empréstimo não solicitado"
- [ ] Qualification flow
- [ ] Cross-sell: Revisão Bancária, Negativação Indevida

#### 3. TEL-001: Cobrança Telefonia ✅
**Estimativa**: 1.5h
**Tarefas**:
- [ ] Adicionar productId: `cobranca-telefonia`
- [ ] Schema (operadora, valor cobrado, contestação)
- [ ] Calculadora: R$1.500 fixo
- [ ] Keywords: "conta telefone alta", "cobrança indevida telecom", "cancelar plano"
- [ ] Qualification flow
- [ ] Cross-sell: Negativação Indevida

#### 4. DIG-004: Assinaturas Digitais ✅
**Estimativa**: 1.5h
**Tarefas**:
- [ ] Adicionar productId: `assinaturas-digitais-indevidas`
- [ ] Schema (serviço, valor mensal, tempo cobrança)
- [ ] Calculadora: R$1.500 fixo
- [ ] Keywords: "cancelar assinatura", "Netflix cobrando", "Prime não cancelou"
- [ ] Qualification flow
- [ ] Cross-sell: Estorno Cartão, Negativação

#### 5. IMO-001: Distrato Imobiliário ✅
**Estimativa**: 2h
**Tarefas**:
- [ ] Adicionar productId: `distrato-imobiliario`
- [ ] Schema (construtora, valor pago, multa, parcelas)
- [ ] Calculadora: R$3.000 fixo + 20% recuperado
- [ ] Keywords: "cancelar contrato imóvel", "distrato", "devolução sinal"
- [ ] Qualification flow
- [ ] Cross-sell: Atraso Entrega Imóvel, Revisão Contrato

---

### FASE 2: BANCÁRIO/FINANCEIRO (6-8h)

Implementar 4 nichos bancários restantes:

#### 6. FIN-011: Revisão Contrato Bancário
**Estimativa**: 2h
- [ ] productId: `revisao-contrato-bancario`
- [ ] Schema completo
- [ ] Calculadora dinâmica

#### 7. FIN-012: Portabilidade Negada
**Estimativa**: 1.5h
- [ ] productId: `portabilidade-credito-negada`

#### 8. FIN-014: Dano Moral Bancário
**Estimativa**: 1.5h
- [ ] productId: `dano-moral-bancario`

#### 9. CRE-001: Recuperação de Valores
**Estimativa**: 2h
- [ ] productId: `recuperacao-valores-pagos`

---

### FASE 3: TELECOM & DIGITAL (4-5h)

#### 10-13: Telecomunicações (4 nichos)
- [ ] TEL-002: Velocidade Internet
- [ ] TEL-003: Portabilidade Telefone
- [ ] TEL-004: Multa Cancelamento

#### 14-17: Digital & Streaming (4 nichos)
- [ ] DIG-001: Fraude Cartão
- [ ] DIG-002: Estorno Compra Online
- [ ] DIG-003: Golpe WhatsApp

---

### FASE 4: OUTROS NICHOS (6-8h)

#### 18-22: Restantes (5 nichos)
- [ ] TRA-001: Atraso de Voo
- [ ] TRA-002: Extravio Bagagem
- [ ] LAB-001: Rescisão Indireta
- [ ] LAB-002: Acidente de Trabalho
- [ ] IMO-002: Atraso Entrega Imóvel

---

## 📐 TEMPLATE DE IMPLEMENTAÇÃO

### Estrutura Padrão para Cada Produto:

```typescript
// 1. agent-product-mapping.ts
export const PRODUCT_MAPPINGS: ProductMapping[] = [
  // ... existing ...
  {
    productId: 'novo-nicho',
    category: 'categoria',
    name: 'Nome do Nicho',
    description: 'Descrição completa',
    keywords: ['keyword1', 'keyword2', 'keyword3'],
    qualificationSteps: 3,
    averageTicket: 1500,
    successRate: 85,
    crossSell: ['produto-relacionado-1', 'produto-relacionado-2'],
  },
]

// 2. schemas/novo-nicho-schema.ts
import { z } from 'zod'

export const novoNichoSchema = z.object({
  campo1: z.string().min(1),
  campo2: z.number().positive(),
  campo3: z.enum(['opcao1', 'opcao2']),
  metadata: z.record(z.any()).optional(),
})

export type NovoNichoData = z.infer<typeof novoNichoSchema>

// 3. calculators/novo-nicho-calculator.ts
export function calculateNovoNichoFee(data: NovoNichoData): FeeCalculation {
  const fixedFee = 1500
  const percentageFee = data.valorRecuperado * 0.30

  return {
    totalFee: fixedFee + percentageFee,
    breakdown: {
      fixed: fixedFee,
      percentage: percentageFee,
    }
  }
}
```

---

## ✅ CHECKLIST DE VALIDAÇÃO

Para cada produto implementado:

- [ ] ProductId único adicionado
- [ ] Schema de validação criado
- [ ] Calculadora de honorários implementada
- [ ] Keywords mapeadas (min 3, max 10)
- [ ] Qualification flow definido (2-5 steps)
- [ ] Cross-sell configurado (min 1, max 3)
- [ ] Testes unitários criados
- [ ] Documentação atualizada

---

## 📊 MÉTRICAS DE SUCESSO

### Technical:
- [ ] 22 novos productIds mapeados
- [ ] 22 schemas validados
- [ ] Build: 0 erros TypeScript
- [ ] Testes: 100% coverage novos produtos

### Business:
- [ ] 474k+ buscas/mês cobertas
- [ ] Ticket médio: R$1.742
- [ ] Potencial anual: R$10M+

---

## 🚦 CRITÉRIOS DE ACEITE

**Etapa 2 será considerada COMPLETA quando**:

1. ✅ 22 novos produtos adicionados ao código
2. ✅ Todos schemas criados e validados
3. ✅ Calculadoras implementadas
4. ✅ Build passa sem erros
5. ✅ Testes unitários passando
6. ✅ Documentação atualizada

---

## 📅 CRONOGRAMA

### Semana 1 (28/12 - 03/01):
- Dias 1-2: FASE 1 (Top 5 prioritários)
- Dia 3: FASE 2 (Bancário)
- Dia 4: FASE 3 (Telecom)
- Dia 5: FASE 4 (Restantes)

### Validação:
- Dia 6: Testes + Documentação
- Dia 7: Review + Deploy

**Conclusão Estimada**: 04/01/2026

---

## 🔄 PRÓXIMA ETAPA

Após completar Etapa 2:

**Etapa 3**: Implementar agentes de qualificação
- Qualification flows interativos
- Calculadoras avançadas
- Cross-sell automático

**Estimativa Etapa 3**: 30-40h

---

## 🎯 COMANDO PARA INICIAR

Para iniciar a implementação:
```
"Iniciar Etapa 2 - Implementar TOP 5 prioritários"
```

Ou para ir direto ao trabalho:
```
"Implementar produto: seguro-prestamista"
```

---

**Status**: ⏸️ AGUARDANDO COMANDO
**Preparado por**: MANUS v6.0
**Data**: 27/12/2025 17:30
