-- Migration: Add 4 Missing Products
-- Created: 2025-12-25
-- Description: Golpe PIX, Laudo Técnico, Secretaria IA, Aposentadoria

-- ============================================================================
-- FINANCEIRO - GOLPE PIX (PRIORIDADE MÁXIMA ⭐⭐⭐⭐⭐)
-- ============================================================================

INSERT INTO products (id, name, slug, category, description, hero_title, hero_subtitle, hero_problem, base_price, features, benefits, documents_required, faq_items, is_active)
VALUES (
  'golpe-pix',
  'Golpe do PIX - Recuperação',
  'golpe-pix',
  'financeiro',
  'Foi vítima de golpe do PIX? Recuperamos seu dinheiro em até 72 horas',
  'Golpe do PIX? Bloqueamos e Recuperamos Seu Dinheiro em 72h',
  'Advogado especialista com 98% de sucesso em bloqueio de valores',
  'Caiu em golpe do PIX? Transferiu por engano? A cada hora que passa, fica mais difícil recuperar. Bloqueio judicial urgente é essencial.',
  250000,
  '["Análise imediata do caso", "Bloqueio judicial em 24h", "Quebra de sigilo bancário", "Rastreamento do dinheiro", "Recuperação via execução"]'::jsonb,
  '["98% de bloqueios bem-sucedidos", "Ação em até 24h", "Sem custos iniciais em alguns casos", "Equipe especializada em crimes digitais", "Suporte 24/7"]'::jsonb,
  '["Comprovante da transferência PIX", "Boletim de ocorrência", "Prints das conversas", "RG/CPF", "Dados bancários"]'::jsonb,
  '[{"question": "Quanto tempo para bloquear?", "answer": "24 a 48 horas após protocolo judicial urgente"}, {"question": "Consigo recuperar tudo?", "answer": "Depende. Se o dinheiro ainda estiver na conta, sim. Se já foi transferido, precisamos rastrear."}, {"question": "Preciso pagar adiantado?", "answer": "R$ 2.500 pelo bloqueio. Recuperação: 30% do valor recuperado"}]'::jsonb,
  true
)
ON CONFLICT (id) DO NOTHING;

INSERT INTO product_packages (product_id, name, description, price, features, is_recommended, order_index, is_active)
VALUES
  ('golpe-pix', 'Bloqueio Urgente', 'Apenas bloqueio judicial', 250000, '["Petição urgente", "Bloqueio em 24-48h", "Quebra de sigilo", "Acompanhamento 30 dias"]'::jsonb, false, 1, true),
  ('golpe-pix', 'Bloqueio + Recuperação', 'Serviço completo', 250000, '["Tudo do Bloqueio Urgente", "Execução para recuperar valores", "Ação criminal contra golpista", "30% sobre valor recuperado", "Garantia de esforço máximo"]'::jsonb, true, 2, true)
ON CONFLICT DO NOTHING;

-- ============================================================================
-- PERÍCIA - LAUDO TÉCNICO
-- ============================================================================

INSERT INTO products (id, name, slug, category, description, hero_title, hero_subtitle, hero_problem, base_price, features, benefits, documents_required, faq_items, is_active)
VALUES (
  'laudo-tecnico',
  'Laudo Técnico Pericial',
  'laudo-tecnico',
  'pericia',
  'Precisa de laudo técnico com validade judicial? Perito credenciado',
  'Precisa de Laudo Técnico? Parecer de Perito Judicial Credenciado',
  'Perito judicial com 200+ laudos emitidos em diversos tribunais',
  'Processo judicial precisa de laudo técnico? Laudo mal feito pode comprometer seu caso. Perito credenciado garante aceitação.',
  200000,
  '["Análise técnica especializada", "Laudo com validade judicial", "Perito credenciado em tribunais", "Fundamentação técnica completa", "Disponibilidade para sustentação oral"]'::jsonb,
  '["Aceito em todos tribunais", "Credibilidade técnica", "Fundamentação robusta", "Entrega no prazo", "Suporte em audiências"]'::jsonb,
  '["Documentos do caso", "Quesitos técnicos", "Materiais para análise", "Prazo desejado"]'::jsonb,
  '[{"question": "Quanto tempo demora?", "answer": "15 a 30 dias dependendo da complexidade"}, {"question": "O laudo é aceito em qualquer vara?", "answer": "Sim, perito é credenciado no TJ-RJ e outros tribunais"}, {"question": "Pode auxiliar em audiência?", "answer": "Sim, oferecemos suporte para sustentação oral"}]'::jsonb,
  true
)
ON CONFLICT (id) DO NOTHING;

INSERT INTO product_packages (product_id, name, description, price, features, is_recommended, order_index, is_active)
VALUES
  ('laudo-tecnico', 'Laudo Simples', 'Análise básica', 200000, '["Laudo técnico", "Análise de documentos", "Parecer fundamentado", "Entrega 20 dias"]'::jsonb, false, 1, true),
  ('laudo-tecnico', 'Laudo Completo', 'Análise detalhada', 350000, '["Laudo extenso", "Análise aprofundada", "Fundamentação robusta", "Entrega 25 dias", "1 revisão incluída"]'::jsonb, true, 2, true),
  ('laudo-tecnico', 'Laudo + Assistência', 'Com suporte judicial', 500000, '["Tudo do Completo", "Assistência em audiência", "Esclarecimentos técnicos", "Revisões ilimitadas"]'::jsonb, false, 3, true)
ON CONFLICT DO NOTHING;

-- ============================================================================
-- AUTOMAÇÃO - SECRETARIA REMOTA IA
-- ============================================================================

INSERT INTO products (id, name, slug, category, description, hero_title, hero_subtitle, hero_problem, base_price, features, benefits, documents_required, faq_items, is_active)
VALUES (
  'secretaria-ia',
  'Secretaria Remota com IA',
  'secretaria-ia',
  'automacao',
  'Atendimento automatizado 24h para advogados. IA que atende, qualifica e agenda',
  'Atendimento Automatizado Para Advogados - IA Que Atende 24h',
  'Sistema de IA que atende WhatsApp, qualifica leads e agenda consultas automaticamente',
  'Perdendo clientes porque não consegue atender 24h? Gastando tempo com perguntas repetitivas? Secretária virtual IA resolve isso.',
  300000,
  '["Atende WhatsApp 24/7", "Qualificação automática de leads", "Agendamento inteligente", "Integração com seu calendário", "Relatórios de atendimento"]'::jsonb,
  '["Nunca perde um lead", "Economia de tempo", "Atendimento padronizado", "Trabalha enquanto você dorme", "ROI comprovado"]'::jsonb,
  '["Número WhatsApp Business", "Calendário Google/Outlook", "Informações do escritório", "Produtos/serviços oferecidos"]'::jsonb,
  '[{"question": "Preciso de conhecimento técnico?", "answer": "Não, fazemos toda configuração e treinamento"}, {"question": "Quanto tempo para implementar?", "answer": "2 a 3 semanas da contratação até estar 100% funcional"}, {"question": "Vale para quantos atendimentos?", "answer": "Ilimitado. Ideal para escritórios com +50 contatos/mês"}]'::jsonb,
  true
)
ON CONFLICT (id) DO NOTHING;

INSERT INTO product_packages (product_id, name, description, price, features, is_recommended, order_index, is_active)
VALUES
  ('secretaria-ia', 'Setup Inicial', 'Implementação', 300000, '["Configuração completa", "Treinamento da IA", "Integração WhatsApp", "Integração calendário", "Suporte 30 dias"]'::jsonb, false, 1, true),
  ('secretaria-ia', 'Setup + 3 Meses', 'Pacote inicial', 450000, '["Tudo do Setup", "3 meses de mensalidade", "Ajustes ilimitados", "Suporte prioritário"]'::jsonb, true, 2, true),
  ('secretaria-ia', 'Setup + 12 Meses', 'Anual com desconto', 900000, '["Tudo do Setup", "12 meses de mensalidade", "2 meses grátis", "Atualizações incluídas", "Suporte VIP"]'::jsonb, false, 3, true)
ON CONFLICT DO NOTHING;

-- ============================================================================
-- PREVIDENCIÁRIO - APOSENTADORIA
-- ============================================================================

INSERT INTO products (id, name, slug, category, description, hero_title, hero_subtitle, hero_problem, base_price, features, benefits, documents_required, faq_items, is_active)
VALUES (
  'aposentadoria',
  'Aposentadoria - Planejamento e Concessão',
  'aposentadoria',
  'previdenciario',
  'Quer se aposentar? Análise gratuita do seu INSS com planejamento completo',
  'Quer Se Aposentar? Análise Gratuita do Seu INSS',
  'Especialistas em direito previdenciário com centenas de aposentadorias concedidas',
  'Trabalhando há anos mas não sabe quando pode se aposentar? INSS negou seu pedido? Benefício menor que deveria? Análise especializada identifica seus direitos.',
  250000,
  '["Análise GRATUITA do CNIS", "Simulação de aposentadoria", "Planejamento previdenciário", "Pedido administrativo ou judicial", "Revisão de benefício"]'::jsonb,
  '["Análise sem custo", "Identifica melhor opção", "Maximiza valor do benefício", "Acompanhamento completo", "Expertise comprovada"]'::jsonb,
  '["CNIS atualizado", "Documentos pessoais", "Comprovantes de vínculos", "Contracheques (se tiver)", "Carnês de contribuição"]'::jsonb,
  '[{"question": "A análise é realmente grátis?", "answer": "Sim, 100% gratuita. Só cobra se contratar o serviço"}, {"question": "Quanto tempo demora?", "answer": "Administrativo: 3-6 meses. Judicial: 1-3 anos com retroativo"}, {"question": "Como é a cobrança?", "answer": "R$ 2.500 + 2 parcelas do benefício concedido"}]'::jsonb,
  true
)
ON CONFLICT (id) DO NOTHING;

INSERT INTO product_packages (product_id, name, description, price, features, is_recommended, order_index, is_active)
VALUES
  ('aposentadoria', 'Análise + Planejamento', 'Consultoria', 0, '["Análise CNIS completa", "Simulações", "Planejamento personalizado", "Orientações", "100% GRATUITO"]'::jsonb, false, 1, true),
  ('aposentadoria', 'Concessão Administrativa', 'Pedido no INSS', 250000, '["Tudo da Análise", "Pedido administrativo", "Recursos", "Até concessão", "+ 2 benefícios no êxito"]'::jsonb, true, 2, true),
  ('aposentadoria', 'Concessão Judicial', 'Ação judicial', 250000, '["Tudo da Análise", "Ação judicial completa", "Até sentença", "Retroativo garantido", "+ 2 benefícios no êxito"]'::jsonb, false, 3, true),
  ('aposentadoria', 'Revisão de Benefício', 'Aumentar valor', 200000, '["Análise de erros", "Ação de revisão", "Cálculos atualizados", "+ 30% dos atrasados"]'::jsonb, false, 4, true)
ON CONFLICT DO NOTHING;
