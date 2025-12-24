-- Seed de produtos de exemplo

-- Produto 1: Aposentadoria por Invalidez
INSERT INTO products (id, name, slug, category, description, hero_title, hero_subtitle, hero_problem, base_price, features, benefits, documents_required, faq_items, is_active)
VALUES (
  'aposentadoria-invalidez',
  'Aposentadoria por Invalidez',
  'aposentadoria-invalidez',
  'previdenciario',
  'Conquiste sua aposentadoria por invalidez com segurança jurídica total',
  'Aposentadoria por Invalidez Garantida',
  'Especialistas em garantir seus direitos previdenciários com máxima agilidade',
  'Está incapacitado para o trabalho e não sabe como garantir sua aposentadoria por invalidez? Nós cuidamos de todo o processo para você, desde a perícia até a concessão do benefício.',
  0,
  '["Análise completa do seu caso", "Preparação para perícia médica", "Acompanhamento de todo o processo", "Recurso em caso de negativa", "Suporte jurídico completo"]',
  '["Segurança jurídica total", "Equipe especializada em INSS", "Agilidade no processo", "Acompanhamento personalizado", "Taxa de sucesso de 95%"]',
  '["RG e CPF", "Carteira de Trabalho", "Laudos médicos atualizados", "Exames complementares", "Comprovante de residência", "PIS/PASEP"]',
  '[
    {"question": "Quanto tempo demora o processo?", "answer": "Em média, o processo leva de 45 a 90 dias, dependendo da complexidade do caso e da agenda do INSS."},
    {"question": "Preciso comparecer pessoalmente?", "answer": "Apenas para a perícia médica do INSS. Todo o restante do processo é conduzido por nossa equipe."},
    {"question": "E se o INSS negar meu pedido?", "answer": "Entramos com recurso administrativo e, se necessário, judicial, sem custos adicionais no pacote completo."},
    {"question": "Quais doenças dão direito?", "answer": "Diversas condições podem dar direito, como problemas cardíacos, psiquiátricos, ortopédicos, entre outros. Fazemos a análise do seu caso gratuitamente."}
  ]',
  true
);

-- Pacotes para Aposentadoria por Invalidez
INSERT INTO product_packages (product_id, name, description, price, features, is_recommended, order_index, is_active)
VALUES
(
  'aposentadoria-invalidez',
  'Básico',
  'Para quem já tem toda documentação organizada',
  99900,
  '["Análise inicial do caso", "Orientação para perícia médica", "Protocolo do pedido no INSS", "1 revisão de documentos", "Suporte por e-mail"]',
  false,
  0,
  true
),
(
  'aposentadoria-invalidez',
  'Completo',
  'O mais escolhido pelos nossos clientes',
  199900,
  '["Tudo do plano Básico", "Acompanhamento de perícia", "Recurso administrativo incluso", "3 revisões de documentos", "Suporte prioritário WhatsApp", "Consultoria sobre benefícios acumulados"]',
  true,
  1,
  true
),
(
  'aposentadoria-invalidez',
  'Premium',
  'Máxima tranquilidade e agilidade',
  349900,
  '["Tudo do plano Completo", "Ação judicial inclusa se necessário", "Revisões ilimitadas", "Atendimento VIP exclusivo", "Acompanhamento presencial na perícia", "Consultoria financeira pós-concessão"]',
  false,
  2,
  true
);

-- Produto 2: Plano de Saúde - Cobertura Negada
INSERT INTO products (id, name, slug, category, description, hero_title, hero_subtitle, hero_problem, base_price, features, benefits, documents_required, faq_items, is_active)
VALUES (
  'plano-saude-cobertura',
  'Cobertura Negada - Plano de Saúde',
  'plano-saude-cobertura',
  'saude',
  'Force seu plano de saúde a cobrir o tratamento que você precisa',
  'Seu Plano de Saúde NEGOU a Cobertura?',
  'Nós obrigamos a operadora a custear seu tratamento em até 48 horas',
  'Seu médico solicitou um tratamento, cirurgia ou exame e o plano de saúde negou? Isso é ILEGAL! Temos 98% de sucesso em reverter negativas e você só paga se conseguirmos.',
  0,
  '["Análise gratuita do caso", "Ação judicial em 24h", "Liminar para tratamento urgente", "Processo 100% online", "Você só paga se ganhar"]',
  '["Resultado em até 48h em casos urgentes", "98% de taxa de sucesso", "Sem custos antecipados", "Equipe especializada em saúde", "Acompanhamento humanizado"]',
  '["RG e CPF", "Contrato do plano de saúde", "Carta de negativa da operadora", "Pedido médico", "Exames e laudos médicos"]',
  '[
    {"question": "Quanto tempo demora?", "answer": "Em casos urgentes, conseguimos liminar em 24-48 horas. Casos não urgentes levam de 7 a 15 dias."},
    {"question": "Só pago se ganhar?", "answer": "Sim! Trabalhamos com honorários de êxito. Se não conseguirmos reverter a negativa, você não paga nada."},
    {"question": "Qualquer tipo de negativa pode ser revertida?", "answer": "A maioria sim, mas analisamos cada caso. Negativas de cirurgias, exames, tratamentos e até home care têm alta taxa de reversão."},
    {"question": "O plano pode me punir por processar?", "answer": "Não! É ilegal qualquer retaliação. Você continua com todos os seus direitos garantidos."}
  ]',
  true
);

-- Pacotes para Plano de Saúde
INSERT INTO product_packages (product_id, name, description, price, features, is_recommended, order_index, is_active)
VALUES
(
  'plano-saude-cobertura',
  'Urgente',
  'Para tratamentos que não podem esperar',
  79900,
  '["Análise em até 2 horas", "Protocolo judicial em 24h", "Pedido de liminar urgente", "Acompanhamento diário", "Honorários de êxito: 20%"]',
  false,
  0,
  true
),
(
  'plano-saude-cobertura',
  'Padrão',
  'Melhor custo-benefício',
  49900,
  '["Análise em até 24 horas", "Protocolo judicial em 7 dias", "Acompanhamento do processo", "Todas as medidas cabíveis", "Honorários de êxito: 15%"]',
  true,
  1,
  true
);

-- Produto 3: Usucapião
INSERT INTO products (id, name, slug, category, description, hero_title, hero_subtitle, hero_problem, base_price, features, benefits, documents_required, faq_items, is_active)
VALUES (
  'usucapiao',
  'Usucapião - Regularização de Imóveis',
  'usucapiao',
  'patrimonial',
  'Regularize seu imóvel e tenha a escritura definitiva em seu nome',
  'Transforme Posse em Propriedade',
  'Regularize seu imóvel através de usucapião de forma rápida e segura',
  'Está morando há anos em um imóvel mas não tem a escritura? Pagou mas o antigo dono sumiu? Herdou mas não consegue regularizar? A usucapião é a solução legal para você se tornar proprietário de direito.',
  0,
  '["Análise de viabilidade gratuita", "Levantamento de documentação", "Processo judicial completo", "Acompanhamento de perícia", "Registro em cartório incluso"]',
  '["Escritura definitiva em seu nome", "Valorização do imóvel", "Possibilidade de venda legal", "Segurança jurídica total", "Fim de problemas com herdeiros"]',
  '["RG e CPF", "Comprovantes de residência antigos", "Contas de água/luz em seu nome", "IPTU (se houver)", "Fotos do imóvel", "Testemunhas (vizinhos)"]',
  '[
    {"question": "Quanto tempo de posse é necessário?", "answer": "Depende do tipo de usucapião: pode ser de 2 a 15 anos. Analisamos seu caso para identificar a melhor modalidade."},
    {"question": "Preciso do dono anterior?", "answer": "Não! A usucapião é justamente para quando não há como contatar o proprietário anterior ou quando há abandono."},
    {"question": "Quanto tempo demora o processo?", "answer": "Em média 12 a 24 meses, dependendo da comarca e complexidade. Com a reforma processual, muitos casos têm sido resolvidos em menos de 1 ano."},
    {"question": "Posso fazer de imóvel rural?", "answer": "Sim! Atendemos tanto imóveis urbanos quanto rurais, cada um com suas especificidades legais."}
  ]',
  true
);

-- Pacotes para Usucapião
INSERT INTO product_packages (product_id, name, description, price, features, is_recommended, order_index, is_active)
VALUES
(
  'usucapiao',
  'Essencial',
  'Para casos mais simples',
  2999900,
  '["Processo judicial completo", "Até 2 audiências", "Documentação básica", "Registro em cartório", "Prazo: 18-24 meses"]',
  false,
  0,
  true
),
(
  'usucapiao',
  'Completo',
  'Mais vendido',
  4499900,
  '["Tudo do Essencial", "Audiências ilimitadas", "Levantamento completo de docs", "Georeferenciamento se necessário", "Suporte para inventário se houver", "Prazo: 12-18 meses"]',
  true,
  1,
  true
),
(
  'usucapiao',
  'Premium',
  'Máxima agilidade',
  6999900,
  '["Tudo do Completo", "Processo prioritário", "Equipe dedicada exclusiva", "Reuniões presenciais", "Consultoria patrimonial inclusa", "Suporte pós-registro", "Prazo: 8-12 meses"]',
  false,
  2,
  true
);

-- Produto 4: Defesa Criminal
INSERT INTO products (id, name, slug, category, description, hero_title, hero_subtitle, hero_problem, base_price, features, benefits, documents_required, faq_items, is_active)
VALUES (
  'defesa-criminal',
  'Defesa Criminal',
  'defesa-criminal',
  'criminal',
  'Defesa jurídica especializada em processos criminais',
  'Defesa Criminal Estratégica',
  'Proteja seus direitos com advogados especializados em direito criminal',
  'Está respondendo a processo criminal ou foi indiciado? Precisa de defesa técnica especializada? Nossa equipe tem ampla experiência em tribunais e alta taxa de absolvições e redução de penas.',
  0,
  '["Defesa técnica especializada", "Análise completa do processo", "Estratégia personalizada", "Acompanhamento em audiências", "Recursos em todas instâncias"]',
  '["Advogados com experiência em júri", "Atendimento 24/7 emergencial", "Sigilo absoluto", "Estratégia agressiva de defesa", "Parceria com peritos"]',
  '["RG e CPF", "Boletim de ocorrência", "Intimações recebidas", "Provas que possua", "Testemunhas"]',
  '[
    {"question": "Atendem em casos urgentes?", "answer": "Sim! Temos plantão 24/7 para prisões em flagrante e casos urgentes."},
    {"question": "Posso trocar de advogado no meio do processo?", "answer": "Sim, você pode nos contratar a qualquer momento do processo."},
    {"question": "Qual a taxa de sucesso?", "answer": "Temos 78% de absolvições ou acordos favoráveis em nossos casos."},
    {"question": "Atendem em júri popular?", "answer": "Sim! Temos especialistas em defesas em tribunal do júri."}
  ]',
  true
);

-- Pacotes para Defesa Criminal
INSERT INTO product_packages (product_id, name, description, price, features, is_recommended, order_index, is_active)
VALUES
(
  'defesa-criminal',
  'Inquérito',
  'Fase de investigação',
  3499900,
  '["Defesa no inquérito policial", "Até 3 diligências", "Acompanhamento de depoimentos", "Análise de provas", "Estratégia de defesa"]',
  false,
  0,
  true
),
(
  'defesa-criminal',
  'Processo Completo',
  'Da denúncia ao fim',
  8999900,
  '["Defesa em todas as fases", "Recursos ilimitados", "Audiências e sustentações", "Perícias técnicas", "Equipe multidisciplinar", "Relatórios periódicos"]',
  true,
  1,
  true
),
(
  'defesa-criminal',
  'Júri Popular',
  'Para crimes dolosos contra a vida',
  14999900,
  '["Tudo do Processo Completo", "Preparação específica para júri", "Advogado experiente em júri", "Estratégia de persuasão", "Simulações de júri", "Contratação de assistentes"]',
  false,
  2,
  true
);
