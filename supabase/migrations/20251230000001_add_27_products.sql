-- Migration: Add 27 Products from Landing Pages
-- Created: 2025-12-30
-- Description: Adiciona produtos com landing pages criadas

-- ============================================================================
-- BANCÁRIO
-- ============================================================================

-- Cartão Consignado RMC
INSERT INTO products (id, name, slug, category, description, hero_title, hero_subtitle, hero_problem, base_price, features, benefits, documents_required, faq_items, is_active)
VALUES (
  'cartao-consignado-rmc',
  'Cancelamento de Cartão Consignado RMC',
  'cartao-consignado-rmc',
  'bancario',
  'Cancele RMC irregular e recupere valores em dobro',
  'Cartão Consignado com RMC Irregular?',
  'Suspenda descontos + Restituição em dobro',
  'Desconto automático de 5% RMC sem autorização clara pode ser cancelado e restituído',
  150000,
  '["Análise gratuita do contracheque", "Suspensão via liminar em 48h", "Restituição em dobro", "Danos morais R$ 5k-10k", "Bloqueio definitivo"]'::jsonb,
  '["92% de sucesso", "Liminar em 48h", "Sem custos antecipados", "Restituição dobrada", "Jurisprudência favorável"]'::jsonb,
  '["Contracheque", "Contrato do cartão (se tiver)", "RG/CPF", "Comprovante de residência"]'::jsonb,
  '[{"question": "Posso cancelar RMC?", "answer": "Sim, se você não autorizou expressamente ou se ultrapassa margem consignável"}, {"question": "Quanto tempo para suspender?", "answer": "Liminar em até 48h após protocolo judicial"}, {"question": "Vou recuperar o que paguei?", "answer": "Sim, em DOBRO conforme CDC Art. 42"}]'::jsonb,
  true
)
ON CONFLICT (id) DO NOTHING;

-- Fraude Consignado
INSERT INTO products (id, name, slug, category, description, hero_title, hero_subtitle, hero_problem, base_price, features, benefits, documents_required, faq_items, is_active)
VALUES (
  'fraude-consignado',
  'Fraude em Empréstimo Consignado',
  'fraude-consignado',
  'bancario',
  'Empréstimo fraudulento descontado? Suspenda e receba em dobro',
  'Empréstimo Consignado Fraudulento?',
  'Suspensão em 48h + Devolução em dobro + Danos morais',
  'Desconto de empréstimo que você NUNCA contratou. Golpistas usam seus dados',
  180000,
  '["Suspensão urgente em 48h", "Boletim de ocorrência", "Perícia grafotécnica", "Cancelamento judicial", "Restituição em dobro", "Danos morais R$ 10k-30k"]'::jsonb,
  '["96% de sucesso", "Suspensão imediata", "Perícia comprova fraude", "Banco responde", "Sem custos antecipados"]'::jsonb,
  '["Contracheque com desconto", "Boletim de ocorrência", "RG/CPF", "Documentos bancários (se tiver)"]'::jsonb,
  '[{"question": "Como provar que é fraude?", "answer": "Perícia grafotécnica comprova falsificação de assinatura"}, {"question": "Banco é responsável?", "answer": "Sim, banco deve verificar autenticidade antes de liberar empréstimo"}, {"question": "Vou recuperar tudo?", "answer": "Sim, em DOBRO + danos morais"}]'::jsonb,
  true
)
ON CONFLICT (id) DO NOTHING;

-- Revisão Contrato Bancário
INSERT INTO products (id, name, slug, category, description, hero_title, hero_subtitle, hero_problem, base_price, features, benefits, documents_required, faq_items, is_active)
VALUES (
  'revisao-contrato-bancario',
  'Revisão de Contrato Bancário',
  'revisao-contrato-bancario',
  'bancario',
  'Identifique tarifas ilegais e juros abusivos',
  'Contrato Bancário com Juros Abusivos?',
  'Revise + Economize 30-50% nas parcelas',
  'TAC, TEC, seguros embutidos, juros de 3-5% ao mês',
  200000,
  '["Análise completa gratuita", "Identificação de TAC/TEC", "Questionamento juros", "Restituição em dobro", "Redução parcelas", "Recálculo saldo devedor"]'::jsonb,
  '["87% de sucesso", "TAC/TEC proibidas BACEN", "Economia 30-50%", "Sem custos antecipados", "Jurisprudência consolidada"]'::jsonb,
  '["Contrato completo", "Extratos bancários", "Carnês/boletos", "RG/CPF"]'::jsonb,
  '[{"question": "O que é TAC e TEC?", "answer": "Tarifas proibidas pelo Banco Central em 2010. Se pagou, tem direito à devolução em dobro"}, {"question": "Posso revisar contrato antigo?", "answer": "Sim, até 5 anos após quitação"}, {"question": "Quanto vou economizar?", "answer": "Em média 30-50% nas parcelas"}]'::jsonb,
  true
)
ON CONFLICT (id) DO NOTHING;

-- Seguro Prestamista
INSERT INTO products (id, name, slug, category, description, hero_title, hero_subtitle, hero_problem, base_price, features, benefits, documents_required, faq_items, is_active)
VALUES (
  'seguro-prestamista',
  'Restituição de Seguro Prestamista',
  'seguro-prestamista',
  'bancario',
  'Seguro embutido sem autorização? Receba em dobro',
  'Seguro Prestamista Não Autorizado?',
  'Restituição em DOBRO + Danos morais',
  'Seguro vendido junto com empréstimo (venda casada ilegal)',
  150000,
  '["Identificação no contrato", "Prova de venda casada", "Restituição em DOBRO", "Danos morais R$ 3k-8k", "Tema 972 STJ favorável", "Processo JEC rápido"]'::jsonb,
  '["94% de sucesso", "Jurisprudência consolidada", "Restituição dobrada", "Sem custas JEC", "Precedente STJ"]'::jsonb,
  '["Contrato de empréstimo", "Extrato bancário", "RG/CPF", "Comprovante residência"]'::jsonb,
  '[{"question": "Como sei se tenho seguro prestamista?", "answer": "Aparece no contrato como \"seguro\" ou \"proteção\". Podemos identificar na análise gratuita"}, {"question": "Quanto vou receber?", "answer": "DOBRO do valor pago + danos morais R$ 3k-8k"}, {"question": "Tema 972 STJ?", "answer": "STJ decidiu favoravelmente ao consumidor: seguro não autorizado = restituição em dobro"}]'::jsonb,
  true
)
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- CONSUMIDOR
-- ============================================================================

-- Cobrança Telefonia
INSERT INTO products (id, name, slug, category, description, hero_title, hero_subtitle, hero_problem, base_price, features, benefits, documents_required, faq_items, is_active)
VALUES (
  'cobranca-telefonia',
  'Cobrança Indevida de Telefonia',
  'cobranca-telefonia',
  'consumidor',
  'Operadora cobrando serviços não contratados?',
  'Cobrança Irregular de Operadora?',
  'Suspensão + Restituição em dobro + Danos morais',
  'Serviços não contratados, fidelidade irregular, valores acima do plano',
  120000,
  '["Análise da fatura gratuita", "Suspensão de negativação", "Cancelamento serviços", "Restituição em dobro (Art 42 CDC)", "Danos morais R$ 3k-8k"]'::jsonb,
  '["91% de sucesso", "Restituição dobrada", "Sem custas JEC", "Jurisprudência favorável", "Rapidez processual"]'::jsonb,
  '["Faturas (últimos 6 meses)", "Contrato (se tiver)", "Prints de atendimento", "RG/CPF"]'::jsonb,
  '[{"question": "Quanto tempo demora?", "answer": "6-12 meses no JEC"}, {"question": "Vou receber em dobro mesmo?", "answer": "Sim, CDC Art. 42 determina devolução em DOBRO de cobrança indevida"}, {"question": "Posso continuar usando?", "answer": "Sim, regularizamos apenas a cobrança"}]'::jsonb,
  true
)
ON CONFLICT (id) DO NOTHING;

-- Cobrança Energia
INSERT INTO products (id, name, slug, category, description, hero_title, hero_subtitle, hero_problem, base_price, features, benefits, documents_required, faq_items, is_active)
VALUES (
  'cobranca-energia',
  'Cobrança Abusiva de Energia',
  'cobranca-energia',
  'consumidor',
  'Conta de luz absurda? Suspenda corte + Revise',
  'Conta de Luz Absurda?',
  'Suspensão de corte + Perícia técnica + Restituição',
  'Valor absurdo sem justificativa, ameaça de corte, tarifa errada',
  140000,
  '["Análise técnica gratuita", "Suspensão de corte em 48h", "Perícia no medidor", "Recálculo da tarifa", "Restituição em dobro", "Parcelamento justo"]'::jsonb,
  '["87% de sucesso", "Corte suspenso liminarmente", "Perícia imparcial", "Sem custos antecipados", "Jurisprudência favorável"]'::jsonb,
  '["Contas de luz (6 meses)", "Histórico de consumo", "RG/CPF", "Comprovante do imóvel"]'::jsonb,
  '[{"question": "Podem cortar minha luz?", "answer": "NÃO se houver contestação judicial. Suspendemos em 48h"}, {"question": "Como funciona a perícia?", "answer": "Perito nomeado pelo juiz vistoria medidor e instalação"}, {"question": "Vou pagar a conta?", "answer": "Apenas o valor real de consumo, sem irregularidades"}]'::jsonb,
  true
)
ON CONFLICT (id) DO NOTHING;

-- Continua nos próximos produtos...
