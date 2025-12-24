-- Migration: Seed Remaining Products
-- Created: 2025-12-25
-- Description: Add 15 missing products with pricing packages across all categories

-- ============================================================================
-- CATEGORIA: FINANCEIRO
-- ============================================================================

-- 1. DESBLOQUEIO DE CONTA
INSERT INTO products (id, name, slug, category, description, hero_title, hero_subtitle, hero_problem, base_price, features, benefits, documents_required, faq_items, is_active)
VALUES (
  'desbloqueio-conta',
  'Desbloqueio de Conta Bancária',
  'desbloqueio-conta',
  'financeiro',
  'Desbloqueie sua conta em até 72 horas ou seu dinheiro de volta',
  'Sua Conta Foi Bloqueada? Desbloqueamos em 72 Horas',
  'Advogado especialista em Direito Bancário com 100+ casos resolvidos',
  'Sua conta foi bloqueada pelo banco sem aviso? Não consegue pagar contas? Art. 833 CPC protege salário até 50 salários mínimos.',
  250000,
  '["Análise gratuita em 5 minutos", "Petição urgente em 48h", "Proteção Art. 833 CPC", "Atendimento 100% online", "Resultado em 72h ou reembolso"]'::jsonb,
  '["95% de taxa de sucesso", "Garantia de 72h", "Suporte via WhatsApp 24/7", "Sem sair de casa", "Preço fixo sem surpresas"]'::jsonb,
  '["RG e CPF", "Extrato bancário", "Comprovante de renda", "Comprovante de residência"]'::jsonb,
  '[{"question": "Quanto tempo demora?", "answer": "24-72h após protocolo da petição urgente"}, {"question": "Funciona para qualquer banco?", "answer": "Sim, atendemos todos os bancos"}, {"question": "E se não conseguir?", "answer": "Reembolso 100% do valor pago"}]'::jsonb,
  true
);

INSERT INTO product_packages (product_id, name, description, price, features, is_recommended, order_index, is_active)
VALUES
  ('desbloqueio-conta', 'Essencial', 'Desbloqueio básico de conta', 199900, '["Petição de desbloqueio", "Protocolo urgente", "Acompanhamento por 30 dias"]'::jsonb, false, 1, true),
  ('desbloqueio-conta', 'Completo', 'Desbloqueio + Indenização', 349900, '["Tudo do Essencial", "Ação de danos morais", "Acompanhamento até sentença", "Garantia estendida 60 dias"]'::jsonb, true, 2, true),
  ('desbloqueio-conta', 'Premium', 'Proteção Total Bancária', 599900, '["Tudo do Completo", "Análise de outros bloqueios", "Revisão de contratos bancários", "Suporte prioritário vitalício"]'::jsonb, false, 3, true);

-- 2. NEGATIVAÇÃO INDEVIDA
INSERT INTO products (id, name, slug, category, description, hero_title, hero_subtitle, hero_problem, base_price, features, benefits, documents_required, faq_items, is_active)
VALUES (
  'negativacao-indevida',
  'Negativação Indevida',
  'negativacao-indevida',
  'financeiro',
  'Nome limpo + indenização de até R$ 15.000 em 90 dias',
  'Nome Sujo Sem Dever Nada? Direito a Indenização de até R$ 15.000',
  'Escritório especializado em reparação de danos - 89% de casos ganhos',
  'Seu nome foi negativado indevidamente? Está impedido de fazer financiamento? Perdeu oportunidades? Lei garante indenização.',
  180000,
  '["Consulta grátis de negativações", "Remoção em 7-15 dias", "Indenização R$ 5k-15k", "Sem custo inicial", "Sucesso fee 30%"]'::jsonb,
  '["89% casos ganhos", "Média R$ 12k indenização", "Nome limpo rápido", "Sem risco financeiro", "Equipe especializada"]'::jsonb,
  '["CPF", "Consulta Serasa/SPC", "Comprovante de quitação (se houver)", "Comprovante de renda (opcional)"]'::jsonb,
  '[{"question": "Preciso pagar para começar?", "answer": "R$ 1.800 entrada + 30% da indenização obtida"}, {"question": "Quanto vou receber?", "answer": "Entre R$ 5.000 e R$ 15.000 dependendo do caso"}, {"question": "E se não ganhar?", "answer": "Você paga apenas a entrada, sem custo adicional"}]'::jsonb,
  true
);

INSERT INTO product_packages (product_id, name, description, price, features, is_recommended, order_index, is_active)
VALUES
  ('negativacao-indevida', 'Limpeza Nome', 'Apenas remoção da negativação', 149900, '["Petição de remoção", "Acompanhamento 30 dias", "Certidão negativa"]'::jsonb, false, 1, true),
  ('negativacao-indevida', 'Nome + Indenização', 'Limpeza + processo indenizatório', 180000, '["Tudo do anterior", "Ação de indenização", "Acompanhamento até sentença", "30% sobre indenização"]'::jsonb, true, 2, true);

-- 3. DEFESA EM EXECUÇÃO
INSERT INTO products (id, name, slug, category, description, hero_title, hero_subtitle, hero_problem, base_price, features, benefits, documents_required, faq_items, is_active)
VALUES (
  'defesa-execucao',
  'Defesa em Execução Judicial',
  'defesa-execucao',
  'financeiro',
  'Proteja seu patrimônio contra penhora e bloqueios judiciais',
  'Sendo Executado na Justiça? Proteja Seu Patrimônio Agora',
  '15 anos defendendo patrimônios - Mais de 300 execuções suspensas',
  'Recebeu intimação de penhora? Conta bloqueada? Risco de perder imóvel ou carro? Defendemos seus bens com estratégias jurídicas sólidas.',
  300000,
  '["Análise urgente da execução", "Embargos à execução", "Pedido de impenhorabilidade", "Suspensão de penhora", "Acordo facilitado"]'::jsonb,
  '["Proteção imediata", "Redução de dívida até 70%", "Parcelamento facilitado", "Blindagem patrimonial", "Experiência comprovada"]'::jsonb,
  '["Carta de citação/intimação", "CPF/CNPJ", "Documentos dos bens", "Contratos relacionados", "Comprovante de renda"]'::jsonb,
  '[{"question": "Posso perder minha casa?", "answer": "Não se for bem de família. Atuamos para garantir impenhorabilidade"}, {"question": "Quanto custa?", "answer": "R$ 3.000 à vista ou 4x de R$ 750"}, {"question": "Consigo acordo?", "answer": "Sim, negociamos descontos de até 70%"}]'::jsonb,
  true
);

INSERT INTO product_packages (product_id, name, description, price, features, is_recommended, order_index, is_active)
VALUES
  ('defesa-execucao', 'Defesa Básica', 'Embargos à execução', 300000, '["Análise do processo", "Petição de embargos", "Acompanhamento 60 dias"]'::jsonb, false, 1, true),
  ('defesa-execucao', 'Defesa Completa', 'Embargos + Negociação', 450000, '["Tudo da Básica", "Negociação de acordo", "Pedido de impenhorabilidade", "Acompanhamento até acordo"]'::jsonb, true, 2, true),
  ('defesa-execucao', 'Blindagem Total', 'Proteção patrimonial completa', 800000, '["Tudo da Completa", "Planejamento patrimonial", "Consultoria preventiva 12 meses", "Prioridade máxima"]'::jsonb, false, 3, true);

-- ============================================================================
-- CATEGORIA: PATRIMONIAL
-- ============================================================================

-- 4. DIREITO IMOBILIÁRIO
INSERT INTO products (id, name, slug, category, description, hero_title, hero_subtitle, hero_problem, base_price, features, benefits, documents_required, faq_items, is_active)
VALUES (
  'direito-imobiliario',
  'Direito Imobiliário',
  'direito-imobiliario',
  'patrimonial',
  'Resolva conflitos de propriedade, contratos e documentação imobiliária',
  'Problemas com Imóvel? Regularize ou Resolva o Conflito',
  'Especialistas em litígios imobiliários - 200+ propriedades regularizadas',
  'Comprou imóvel com problema? Inventário travado? Vizinho invadindo? Documentação irregular? Resolvemos conflitos imobiliários complexos.',
  400000,
  '["Análise documental completa", "Regularização de escrituras", "Ações possessórias", "Despejo", "Revisão de contratos"]'::jsonb,
  '["Propriedade regularizada", "Valorização do imóvel", "Segurança jurídica", "Resolução em 90-180 dias", "Equipe multidisciplinar"]'::jsonb,
  '["Matrícula do imóvel", "Contratos relacionados", "RG/CPF", "Certidões negativas", "Documentos de posse"]'::jsonb,
  '[{"question": "Quanto tempo demora?", "answer": "90-180 dias dependendo da complexidade"}, {"question": "Consigo vender depois?", "answer": "Sim, após regularização o imóvel fica livre para venda"}, {"question": "Cobre inventário?", "answer": "Sim, temos pacote específico para inventários"}]'::jsonb,
  true
);

INSERT INTO product_packages (product_id, name, description, price, features, is_recommended, order_index, is_active)
VALUES
  ('direito-imobiliario', 'Análise + Consultoria', 'Diagnóstico completo', 150000, '["Análise documental", "Relatório de pendências", "Orientação jurídica", "Plano de ação"]'::jsonb, false, 1, true),
  ('direito-imobiliario', 'Regularização', 'Solução completa', 400000, '["Tudo da Análise", "Petições necessárias", "Acompanhamento processual", "Até obtenção de escritura"]'::jsonb, true, 2, true),
  ('direito-imobiliario', 'Premium Litigation', 'Litígio complexo', 800000, '["Tudo da Regularização", "Ações judiciais múltiplas", "Perícia técnica", "Suporte até trânsito em julgado"]'::jsonb, false, 3, true);

-- 5. USUCAPIÃO
INSERT INTO products (id, name, slug, category, description, hero_title, hero_subtitle, hero_problem, base_price, features, benefits, documents_required, faq_items, is_active)
VALUES (
  'usucapiao',
  'Usucapião',
  'usucapiao',
  'patrimonial',
  'Transforme posse em propriedade legal com segurança jurídica',
  'Mora no Imóvel Há Anos? Regularize e Vire Dono Legal',
  'Especialistas em usucapião - 85% de ações procedentes',
  'Mora em imóvel há mais de 5 anos? Paga IPTU? Não é proprietário oficial? Usucapião transforma sua posse em propriedade registrada.',
  500000,
  '["Análise de viabilidade", "Levantamento topográfico", "Notificação de interessados", "Petição inicial", "Acompanhamento até registro"]'::jsonb,
  '["Propriedade garantida", "Valorização patrimonial", "Pode vender/financiar", "Segurança jurídica", "Taxa de sucesso 85%"]'::jsonb,
  '["Comprovantes de posse (contas, IPTU)", "Testemunhas (3 min)", "Fotos do imóvel", "RG/CPF", "Certidão de objeto (se houver)"]'::jsonb,
  '[{"question": "Preciso de quantos anos de posse?", "answer": "5 anos (urbano) ou 10 anos (rural) dependendo do caso"}, {"question": "Quanto tempo demora?", "answer": "12-24 meses até registro final"}, {"question": "Posso perder?", "answer": "Analisamos viabilidade antes. 85% de aprovação"}]'::jsonb,
  true
);

INSERT INTO product_packages (product_id, name, description, price, features, is_recommended, order_index, is_active)
VALUES
  ('usucapiao', 'Viabilidade', 'Análise prévia', 80000, '["Estudo de caso", "Análise documental", "Relatório de viabilidade", "Orientação próximos passos"]'::jsonb, false, 1, true),
  ('usucapiao', 'Usucapião Completo', 'Do início ao registro', 500000, '["Tudo da Viabilidade", "Levantamento topográfico", "Processo judicial completo", "Até registro em cartório"]'::jsonb, true, 2, true),
  ('usucapiao', 'Usucapião Express', 'Extrajudicial acelerado', 350000, '["Para casos sem conflito", "Cartório direto", "Conclusão em 6-9 meses", "Sem processo judicial"]'::jsonb, false, 3, true);

-- 6. HOLDING FAMILIAR
INSERT INTO products (id, name, slug, category, description, hero_title, hero_subtitle, hero_problem, base_price, features, benefits, documents_required, faq_items, is_active)
VALUES (
  'holding-familiar',
  'Holding Familiar',
  'holding-familiar',
  'patrimonial',
  'Proteja patrimônio, reduza impostos e facilite sucessão familiar',
  'Proteja Seu Patrimônio: Economia de 70% em ITCMD',
  'Planejamento sucessório estratégico - 50+ holdings constituídas',
  'Patrimônio acima de R$ 1 milhão? Preocupado com inventário caro? Holding familiar reduz ITCMD de 4-8% para 0,5%, protege bens e evita brigas.',
  1200000,
  '["Constituição de holding", "Integralização de bens", "Governança familiar", "Proteção patrimonial", "Planejamento tributário"]'::jsonb,
  '["Economia 70-90% ITCMD", "Inventário evitado", "Proteção contra credores", "Sucessão organizada", "Privacidade garantida"]'::jsonb,
  '["Relação de bens", "Certidões negativas", "RG/CPF sócios", "Documentos dos imóveis", "Declaração IR"]'::jsonb,
  '[{"question": "Vale a pena para quanto?", "answer": "Ideal para patrimônios acima de R$ 1 milhão"}, {"question": "Quanto economizo?", "answer": "Redução de 70-90% no ITCMD (imposto de herança)"}, {"question": "Quanto tempo para constituir?", "answer": "30-60 dias até funcionamento completo"}]'::jsonb,
  true
);

INSERT INTO product_packages (product_id, name, description, price, features, is_recommended, order_index, is_active)
VALUES
  ('holding-familiar', 'Consultoria', 'Planejamento inicial', 300000, '["Análise patrimonial", "Simulação tributária", "Minuta de estatuto", "Orientação estrutura"]'::jsonb, false, 1, true),
  ('holding-familiar', 'Holding Completa', 'Constituição total', 1200000, '["Tudo da Consultoria", "Registro de empresa", "Integralização bens", "Governança", "Suporte 12 meses"]'::jsonb, true, 2, true),
  ('holding-familiar', 'Premium + Gestão', 'Holding + assessoria contínua', 1800000, '["Tudo da Completa", "Assessoria jurídica vitalícia", "Revisões anuais", "Suporte contábil integrado"]'::jsonb, false, 3, true);

-- 7. INVENTÁRIO
INSERT INTO products (id, name, slug, category, description, hero_title, hero_subtitle, hero_problem, base_price, features, benefits, documents_required, faq_items, is_active)
VALUES (
  'inventario',
  'Inventário',
  'inventario',
  'patrimonial',
  'Inventário rápido, sem brigas e com economia tributária',
  'Inventário Travado? Desbloqueie em 90 Dias',
  'Especialistas em sucessões - 100+ inventários concluídos',
  'Familiar faleceu? Bens bloqueados? Herdeiros brigando? Fazemos inventário judicial ou extrajudicial com máxima economia e agilidade.',
  800000,
  '["Inventário extrajudicial (consenso)", "Inventário judicial (litígio)", "Avaliação de bens", "Quitação ITCMD", "Partilha e transferência"]'::jsonb,
  '["Conclusão 90-180 dias", "Máxima economia ITCMD", "Mediação de conflitos", "Bens liberados rápido", "Equipe experiente"]'::jsonb,
  '["Certidão de óbito", "RG/CPF herdeiros", "Documentos dos bens", "Certidão de casamento", "Testamento (se houver)"]'::jsonb,
  '[{"question": "Extrajudicial é mais rápido?", "answer": "Sim, 60-90 dias vs 12-24 meses judicial"}, {"question": "Quanto custa o ITCMD?", "answer": "4-8% do valor dos bens, mas otimizamos isso"}, {"question": "E se herdeiros brigarem?", "answer": "Fazemos mediação ou inventário judicial"}]'::jsonb,
  true
);

INSERT INTO product_packages (product_id, name, description, price, features, is_recommended, order_index, is_active)
VALUES
  ('inventario', 'Extrajudicial', 'Consenso entre herdeiros', 600000, '["Para casos sem conflito", "Cartório", "60-90 dias", "Mais econômico"]'::jsonb, true, 1, true),
  ('inventario', 'Judicial Simples', 'Com pequenos conflitos', 800000, '["Processo judicial", "Mediação", "Avaliação de bens", "12-18 meses"]'::jsonb, false, 2, true),
  ('inventario', 'Judicial Complexo', 'Litígio intenso', 1500000, '["Múltiplos herdeiros/bens", "Ações cautelares", "Perícias", "Até conclusão total"]'::jsonb, false, 3, true);

-- ============================================================================
-- CATEGORIA: SAÚDE
-- ============================================================================

-- 8. PLANO DE SAÚDE NEGOU
INSERT INTO products (id, name, slug, category, description, hero_title, hero_subtitle, hero_problem, base_price, features, benefits, documents_required, faq_items, is_active)
VALUES (
  'plano-saude-negou',
  'Plano de Saúde Negou Cobertura',
  'plano-saude-negou',
  'saude',
  'Obrigue o plano a custear tratamento + indenização por danos',
  'Plano de Saúde Negou? Garantimos Cobertura em 48h',
  'Especialistas em Direito da Saúde - 92% de liminares concedidas',
  'Plano negou cirurgia? Tratamento? Internação? Lei obriga cobertura. Conseguimos liminar em 24-48h + indenização por dano moral.',
  280000,
  '["Análise gratuita do contrato", "Liminar urgente 24-48h", "Cobertura garantida", "Indenização dano moral", "Sem custo inicial"]'::jsonb,
  '["92% liminares concedidas", "Tratamento liberado rápido", "Indenização R$ 5k-20k", "Sem pagar adiantado", "Equipe especializada"]'::jsonb,
  '["Negativa do plano (por escrito)", "Contrato do plano", "Pedido médico", "RG/CPF", "Relatório médico"]'::jsonb,
  '[{"question": "Quanto tempo para liminar?", "answer": "24-48h após protocolo do pedido urgente"}, {"question": "Preciso pagar antes?", "answer": "Não, cobramos apenas se ganharmos"}, {"question": "Qual valor da indenização?", "answer": "R$ 5.000 a R$ 20.000 dependendo do caso"}]'::jsonb,
  true
);

INSERT INTO product_packages (product_id, name, description, price, features, is_recommended, order_index, is_active)
VALUES
  ('plano-saude-negou', 'Liminar Urgente', 'Apenas liberação do tratamento', 200000, '["Pedido de liminar", "Acompanhamento até liberação", "30 dias suporte"]'::jsonb, false, 1, true),
  ('plano-saude-negou', 'Completo', 'Liberação + Indenização', 280000, '["Tudo da Liminar", "Ação de indenização", "Até sentença final", "Sem custo inicial"]'::jsonb, true, 2, true);

-- 9. CIRURGIA BARIÁTRICA
INSERT INTO products (id, name, slug, category, description, hero_title, hero_subtitle, hero_problem, base_price, features, benefits, documents_required, faq_items, is_active)
VALUES (
  'cirurgia-bariatrica',
  'Cirurgia Bariátrica pelo Plano',
  'cirurgia-bariatrica',
  'saude',
  'Obrigue o plano a custear sua cirurgia bariátrica',
  'Plano Negou Bariátrica? Consiga Liminar em 48h',
  'Especialistas em saúde suplementar - 88% de cirurgias liberadas',
  'IMC acima de 40 ou acima de 35 com comorbidades? Plano negou cobertura? ANS obriga cobertura. Conseguimos liminar rápida.',
  250000,
  '["Análise de elegibilidade", "Reunião de laudos médicos", "Liminar 24-48h", "Acompanhamento pré e pós-cirurgia", "Indenização se negativa abusiva"]'::jsonb,
  '["88% de aprovações", "Cirurgia garantida", "Sem custo cirúrgico", "Suporte completo", "Indenização possível"]'::jsonb,
  '["Negativa do plano", "Laudos médicos", "Exames (IMC, comorbidades)", "Contrato plano", "RG/CPF"]'::jsonb,
  '[{"question": "Quem tem direito?", "answer": "IMC ≥40 ou IMC ≥35 com diabetes/hipertensão"}, {"question": "Plano sempre nega?", "answer": "Sim, mas 88% conseguimos reverter judicialmente"}, {"question": "Quanto tempo?", "answer": "Liminar em 24-48h, cirurgia em 30-60 dias"}]'::jsonb,
  true
);

INSERT INTO product_packages (product_id, name, description, price, features, is_recommended, order_index, is_active)
VALUES
  ('cirurgia-bariatrica', 'Liberação Cirurgia', 'Foco na liminar', 250000, '["Análise elegibilidade", "Liminar urgente", "Até realização cirurgia"]'::jsonb, true, 1, true),
  ('cirurgia-bariatrica', 'Completo + Indenização', 'Cirurgia + danos morais', 350000, '["Tudo anterior", "Ação indenizatória", "Suporte pós-cirúrgico 6 meses"]'::jsonb, false, 2, true);

-- 10. TEA (Transtorno do Espectro Autista)
INSERT INTO products (id, name, slug, category, description, hero_title, hero_subtitle, hero_problem, base_price, features, benefits, documents_required, faq_items, is_active)
VALUES (
  'tea',
  'TEA - Direitos e Tratamento',
  'tea',
  'saude',
  'Garanta tratamento completo para TEA pelo plano ou Estado',
  'Plano Negou Tratamento TEA? Garanta Terapias Agora',
  'Especialistas em direitos de autistas - 100+ famílias atendidas',
  'Filho diagnosticado com TEA? Plano negando ABA, fonoaudiologia, terapia ocupacional? Lei Berenice Piana garante tratamento completo.',
  300000,
  '["Cobertura ilimitada terapias", "ABA intensivo", "Fono + TO + Psico", "Acompanhante terapêutico", "Liminar em 48h"]'::jsonb,
  '["Tratamento garantido", "Sem limite sessões ANS", "Desenvolvimento acelerado", "Equipe multidisciplinar", "Suporte familiar"]'::jsonb,
  '["Laudo médico TEA", "Negativa do plano", "Contrato plano", "Prescrição terapias", "RG/CPF responsável"]'::jsonb,
  '[{"question": "Quantas sessões tenho direito?", "answer": "Ilimitadas conforme prescrição médica (Lei 12.764)"}, {"question": "ABA é coberto?", "answer": "Sim, obrigatório desde 2019 (Rol ANS)"}, {"question": "E se não tenho plano?", "answer": "Processo contra Estado para tratamento SUS"}]'::jsonb,
  true
);

INSERT INTO product_packages (product_id, name, description, price, features, is_recommended, order_index, is_active)
VALUES
  ('tea', 'Plano de Saúde', 'Contra plano particular', 300000, '["Liminar urgente", "Todas as terapias", "Acompanhamento contínuo"]'::jsonb, true, 1, true),
  ('tea', 'Estado/Município', 'Tratamento pelo SUS', 250000, '["Ação vs poder público", "Centro especializado", "Medicamentos"]'::jsonb, false, 2, true),
  ('tea', 'Educação Inclusiva', 'Direito escolar TEA', 200000, '["Acompanhante na escola", "Adaptação curricular", "Sala de recursos"]'::jsonb, false, 3, true);

-- 11. BPC/LOAS
INSERT INTO products (id, name, slug, category, description, hero_title, hero_subtitle, hero_problem, base_price, features, benefits, documents_required, faq_items, is_active)
VALUES (
  'bpc-loas',
  'BPC/LOAS',
  'bpc-loas',
  'saude',
  'Consiga benefício de 1 salário mínimo mensal vitalício',
  'BPC Negado? Consiga 1 Salário Mínimo Mensal Vitalício',
  'Especialistas previdenciários - 78% de BPCs concedidos judicialmente',
  'Pessoa com deficiência ou idoso 65+ em vulnerabilidade? INSS negou BPC? Judicialmente conseguimos reverter em 70% dos casos.',
  220000,
  '["Análise de elegibilidade", "Recurso administrativo", "Ação judicial se necessário", "Perícia médica/social", "Retroativo desde negativa"]'::jsonb,
  '["R$ 1.412/mês vitalício", "78% aprovação judicial", "Retroativo", "Sem contribuição necessária", "Reavaliação a cada 2 anos"]'::jsonb,
  '["Laudo médico (se deficiência)", "RG/CPF", "Comprovante renda familiar", "Comprovante residência", "CadÚnico atualizado"]'::jsonb,
  '[{"question": "Quem tem direito?", "answer": "Deficientes ou idosos 65+ com renda per capita < 1/4 salário mínimo"}, {"question": "Quanto tempo demora?", "answer": "Judicial: 12-18 meses com retroativo"}, {"question": "Precisa contribuir INSS?", "answer": "Não, BPC é assistencial"}]'::jsonb,
  true
);

INSERT INTO product_packages (product_id, name, description, price, features, is_recommended, order_index, is_active)
VALUES
  ('bpc-loas', 'Recurso Administrativo', 'Tentativa no INSS', 120000, '["Recurso ao INSS", "Organização documentos", "Acompanhamento até decisão"]'::jsonb, false, 1, true),
  ('bpc-loas', 'Ação Judicial', 'Processo contra INSS', 220000, '["Petição inicial", "Perícia judicial", "Até concessão do benefício", "Retroativo garantido"]'::jsonb, true, 2, true);

-- ============================================================================
-- CATEGORIA: PERÍCIA
-- ============================================================================

-- 12. PERÍCIA DOCUMENTAL
INSERT INTO products (id, name, slug, category, description, hero_title, hero_subtitle, hero_problem, base_price, features, benefits, documents_required, faq_items, is_active)
VALUES (
  'pericia-documental',
  'Perícia Documental',
  'pericia-documental',
  'pericia',
  'Análise técnica de autenticidade documental com laudo pericial',
  'Documento Falso? Perícia Técnica com Validade Judicial',
  'Perito judicial credenciado - 200+ laudos emitidos',
  'Suspeita de documento falso? Assinatura adulterada? Contrato fraudado? Perícia documental determina autenticidade com validade jurídica.',
  180000,
  '["Análise grafotécnica", "Exame de papel e tinta", "Fotodocumentação técnica", "Laudo pericial judicial", "Perito certificado"]'::jsonb,
  '["Validade judicial", "Aceito em processos", "Laudos técnicos", "Credibilidade comprovada", "Entrega 15-30 dias"]'::jsonb,
  '["Documento questionado (original)", "Padrões de assinatura", "Contexto do caso", "Documentos relacionados"]'::jsonb,
  '[{"question": "Laudo tem validade judicial?", "answer": "Sim, perito é credenciado em tribunais"}, {"question": "Quanto tempo?", "answer": "15-30 dias dependendo complexidade"}, {"question": "Funciona para que?", "answer": "Contratos, cheques, assinaturas, documentos adulterados"}]'::jsonb,
  true
);

INSERT INTO product_packages (product_id, name, description, price, features, is_recommended, order_index, is_active)
VALUES
  ('pericia-documental', 'Análise Simples', '1 documento', 180000, '["1 documento", "Laudo básico", "Entrega 15 dias"]'::jsonb, false, 1, true),
  ('pericia-documental', 'Análise Completa', 'Até 5 documentos', 350000, '["Até 5 documentos", "Laudo detalhado", "Entrega 20 dias", "Consultoria incluída"]'::jsonb, true, 2, true),
  ('pericia-documental', 'Complexa + Assistência', 'Ilimitado + suporte judicial', 600000, '["Documentos ilimitados", "Laudo extenso", "Assistência em audiência", "Revisões ilimitadas"]'::jsonb, false, 3, true);

-- 13. GRAFOTECNIA (mantendo para diferenciação)
INSERT INTO products (id, name, slug, category, description, hero_title, hero_subtitle, hero_problem, base_price, features, benefits, documents_required, faq_items, is_active)
VALUES (
  'grafotecnia',
  'Grafotecnia',
  'grafotecnia',
  'pericia',
  'Perícia grafotécnica especializada em assinaturas',
  'Assinatura Falsa? Perícia Grafotécnica Definitiva',
  'Especialista em falsificação - Aceito em todos tribunais',
  'Alguém falsificou sua assinatura? Contrato adulterado? Cheque clonado? Grafotecnia identifica autoria com 99% de precisão.',
  220000,
  '["Análise microscópica", "Comparação padrões", "Software especializado", "Laudo detalhado", "Garantia técnica"]'::jsonb,
  '["99% precisão", "Aceito STF/STJ", "Provas irrefutáveis", "Perito renomado", "Entrega 10-20 dias"]'::jsonb,
  '["Documento questionado", "5-10 assinaturas verdadeiras", "Contexto do caso"]'::jsonb,
  '[{"question": "Diferença de perícia documental?", "answer": "Grafotecnia é específica para assinaturas manuscritas"}, {"question": "Preciso original?", "answer": "Preferencialmente, mas trabalhamos com cópias de alta qualidade"}, {"question": "Serve para processo?", "answer": "Sim, amplamente aceito em todo judiciário"}]'::jsonb,
  true
);

INSERT INTO product_packages (product_id, name, description, price, features, is_recommended, order_index, is_active)
VALUES
  ('grafotecnia', 'Básica', '1 assinatura', 220000, '["1 assinatura analisada", "Laudo técnico", "Entrega 10 dias"]'::jsonb, false, 1, true),
  ('grafotecnia', 'Avançada', 'Até 3 assinaturas', 400000, '["Até 3 assinaturas", "Laudo detalhado", "Análise comparativa", "Entrega 15 dias"]'::jsonb, true, 2, true);

-- ============================================================================
-- CATEGORIA: CRIMINAL
-- ============================================================================

-- 14. DIREITO CRIMINAL
INSERT INTO products (id, name, slug, category, description, hero_title, hero_subtitle, hero_problem, base_price, features, benefits, documents_required, faq_items, is_active)
VALUES (
  'direito-criminal',
  'Defesa Criminal',
  'direito-criminal',
  'criminal',
  'Defesa estratégica em processos criminais com foco em absolvição',
  'Acusado Criminalmente? Defesa Técnica Especializada',
  'Criminalista com 12 anos de atuação - 70%+ absolvições',
  'Foi acusado? Indiciado? Denunciado? Preso? Defesa criminal exige experiência e estratégia. Atuamos desde inquérito até STJ.',
  500000,
  '["Defesa em inquérito", "Habeas Corpus urgente", "Defesa processual", "Recursos tribunais superiores", "Assessoria permanente"]'::jsonb,
  '["70% absolvições", "Liberdade preservada", "Estratégia personalizada", "Disponibilidade 24/7", "Sigilo absoluto"]'::jsonb,
  '["Boletim de ocorrência", "Intimações", "RG/CPF", "Testemunhas", "Documentos do caso"]'::jsonb,
  '[{"question": "Atende qual tipo de crime?", "answer": "Todos, exceto crimes hediondos com evidências robustas"}, {"question": "Consigo liberdade?", "answer": "Dependendo do caso, HC pode garantir liberdade provisória"}, {"question": "Quanto custa?", "answer": "Varia: R$ 5k (inquérito) até R$ 50k (júri complexo)"}]'::jsonb,
  true
);

INSERT INTO product_packages (product_id, name, description, price, features, is_recommended, order_index, is_active)
VALUES
  ('direito-criminal', 'Defesa em Inquérito', 'Fase policial', 500000, '["Acompanhamento delegacia", "Petições ao delegado", "Estratégia investigativa"]'::jsonb, false, 1, true),
  ('direito-criminal', 'Processo Completo', 'Ação penal até sentença', 1500000, '["Defesa preliminar", "Alegações finais", "Até sentença 1ª instância", "Recursos"]'::jsonb, true, 2, true),
  ('direito-criminal', 'Júri Popular', 'Crimes dolosos contra vida', 3000000, '["Preparação tese defensiva", "Quesitação", "Sustentação oral", "Até 5 dias de júri"]'::jsonb, false, 3, true);

-- 15. DIREITO AERONÁUTICO
INSERT INTO products (id, name, slug, category, description, hero_title, hero_subtitle, hero_problem, base_price, features, benefits, documents_required, faq_items, is_active)
VALUES (
  'direito-aeronautico',
  'Direito Aeronáutico',
  'direito-aeronautico',
  'criminal',
  'Defesa especializada em infrações e processos aeronáuticos',
  'Piloto ou Proprietário de Aeronave? Defesa Especializada',
  'Advogado especialista em aviação - Único no estado',
  'Infração ANAC? Suspensão de licença? Acidente aeronáutico? Apreensão de aeronave? Defendemos com conhecimento técnico e jurídico.',
  800000,
  '["Defesa administrativa ANAC", "Recursos JRAA", "Acidentes e incidentes", "Homologação aeronaves", "Consultoria regulatória"]'::jsonb,
  '["Especialista único", "Conhecimento técnico", "Licença preservada", "Aeronave liberada", "Consultoria preventiva"]'::jsonb,
  '["Auto de infração ANAC", "CHT (licença)", "Documentos aeronave", "Relatórios técnicos", "RG/CPF"]'::jsonb,
  '[{"question": "Atende todo Brasil?", "answer": "Sim, ANAC e JRAA são âmbito federal"}, {"question": "Quanto tempo?", "answer": "Defesa ANAC: 30-60 dias; JRAA: 6-12 meses"}, {"question": "Consigo suspensão?", "answer": "Sim, em muitos casos conseguimos efeito suspensivo"}]'::jsonb,
  true
);

INSERT INTO product_packages (product_id, name, description, price, features, is_recommended, order_index, is_active)
VALUES
  ('direito-aeronautico', 'Defesa Administrativa', 'ANAC', 600000, '["Defesa escrita", "Documentação técnica", "Recurso ANAC"]'::jsonb, false, 1, true),
  ('direito-aeronautico', 'Recurso JRAA', 'Tribunal especializado', 800000, '["Recurso ao JRAA", "Sustentação oral", "Até decisão final"]'::jsonb, true, 2, true),
  ('direito-aeronautico', 'Consultoria Regulatória', 'Preventivo', 1200000, '["Análise de conformidade", "Adequação RBAC", "Suporte 12 meses", "Auditorias periódicas"]'::jsonb, false, 3, true);

-- ============================================================================
-- INDICES PARA PERFORMANCE
-- ============================================================================

-- Indexes já existentes na migration inicial, mas garantindo:
-- CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
-- CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
-- CREATE INDEX IF NOT EXISTS idx_products_active ON products(is_active);
-- CREATE INDEX IF NOT EXISTS idx_packages_product ON product_packages(product_id);
