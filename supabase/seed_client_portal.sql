-- ============================================================================
-- SEED DATA: Client Portal Test Data
-- Description: Inserts realistic test data for the client portal
-- Usage: Execute AFTER running the main migration
-- ============================================================================

-- IMPORTANT: This script assumes you have users in auth.users table
-- You need to replace the UUIDs below with actual user IDs from your database

-- ============================================================================
-- STEP 1: Get your user IDs
-- ============================================================================
-- Run this query first to get your user IDs:
-- SELECT id, email, raw_user_meta_data->>'role' as role FROM auth.users;
-- Then replace the UUIDs in the variables below

DO $$
DECLARE
  client_user_id UUID;
  lawyer_user_id UUID;
  admin_user_id UUID;
  case_1_id UUID;
  case_2_id UUID;
  case_3_id UUID;
BEGIN
  -- ============================================================================
  -- CONFIGURAÇÃO: Substitua estes UUIDs pelos IDs reais dos seus usuários
  -- ============================================================================

  -- Buscar automaticamente o primeiro cliente, advogado e admin
  -- Se não existirem, o script vai avisar

  SELECT id INTO client_user_id
  FROM auth.users
  WHERE raw_user_meta_data->>'role' = 'client'
  LIMIT 1;

  SELECT id INTO lawyer_user_id
  FROM auth.users
  WHERE raw_user_meta_data->>'role' IN ('lawyer', 'admin')
  LIMIT 1;

  SELECT id INTO admin_user_id
  FROM auth.users
  WHERE raw_user_meta_data->>'role' = 'admin'
  LIMIT 1;

  -- Se não encontrou usuários, criar mensagem de erro
  IF client_user_id IS NULL THEN
    RAISE EXCEPTION 'Nenhum cliente encontrado! Crie um usuário com role=client primeiro.';
  END IF;

  IF lawyer_user_id IS NULL THEN
    RAISE EXCEPTION 'Nenhum advogado encontrado! Crie um usuário com role=lawyer ou admin primeiro.';
  END IF;

  RAISE NOTICE 'Usando cliente: %', client_user_id;
  RAISE NOTICE 'Usando advogado: %', lawyer_user_id;

  -- ============================================================================
  -- CASO 1: Divórcio Consensual (Em Andamento - 65%)
  -- ============================================================================

  INSERT INTO cases (
    client_id,
    lawyer_id,
    service_type,
    status,
    description,
    case_number,
    court,
    value,
    current_phase,
    progress,
    next_step,
    metadata
  ) VALUES (
    client_user_id,
    lawyer_user_id,
    'Divórcio Consensual',
    'em_andamento',
    'Processo de divórcio consensual com partilha de bens. Ambas as partes estão de acordo com a separação e divisão patrimonial.',
    '0001234-56.2024.8.26.0100',
    'Foro Central - São Paulo/SP',
    NULL,
    'Aguardando homologação judicial',
    65,
    'Aguardando homologação do juiz e assinatura do acordo',
    '{"oab": "OAB/SP 123456", "estimated_duration": "3-4 meses", "complexity": "baixa"}'::jsonb
  ) RETURNING id INTO case_1_id;

  -- Timeline do Caso 1
  INSERT INTO case_timeline (case_id, type, title, description, created_at) VALUES
    (case_1_id, 'created', 'Caso criado', 'Serviço contratado pelo cliente. Consulta inicial realizada.', NOW() - INTERVAL '60 days'),
    (case_1_id, 'lawyer_assigned', 'Advogado atribuído', 'Dr. João Silva assumiu o caso', NOW() - INTERVAL '59 days'),
    (case_1_id, 'document_submitted', 'Documentos pessoais enviados', 'Cliente enviou RG, CPF e certidão de casamento', NOW() - INTERVAL '58 days'),
    (case_1_id, 'status_changed', 'Status atualizado', 'Caso passou de "aguardando_documentos" para "em_analise"', NOW() - INTERVAL '55 days'),
    (case_1_id, 'document_submitted', 'Comprovantes enviados', 'Documentos de propriedade e extratos bancários recebidos', NOW() - INTERVAL '50 days'),
    (case_1_id, 'status_changed', 'Status atualizado', 'Caso passou de "em_analise" para "em_andamento"', NOW() - INTERVAL '45 days'),
    (case_1_id, 'meeting', 'Reunião realizada', 'Reunião com ambas as partes para definir termos do acordo', NOW() - INTERVAL '40 days'),
    (case_1_id, 'court_update', 'Petição protocolada', 'Petição inicial foi protocolada no tribunal', NOW() - INTERVAL '30 days'),
    (case_1_id, 'court_update', 'Processo distribuído', 'Processo recebeu número e foi distribuído', NOW() - INTERVAL '25 days'),
    (case_1_id, 'deadline', 'Prazo definido', 'Aguardando manifestação do MP - prazo de 15 dias', NOW() - INTERVAL '10 days');

  -- Documentos do Caso 1
  INSERT INTO case_documents (case_id, name, type, description, file_url, file_size, mime_type, status, uploaded_by, uploaded_at) VALUES
    (case_1_id, 'RG Frente e Verso.pdf', 'Documento Pessoal', 'RG do cliente - ambos os lados', '/documents/caso1/rg.pdf', 524288, 'application/pdf', 'approved', client_user_id, NOW() - INTERVAL '58 days'),
    (case_1_id, 'CPF.pdf', 'Documento Pessoal', 'CPF do cliente', '/documents/caso1/cpf.pdf', 204800, 'application/pdf', 'approved', client_user_id, NOW() - INTERVAL '58 days'),
    (case_1_id, 'Certidão de Casamento.pdf', 'Documento do Processo', 'Certidão de casamento atualizada', '/documents/caso1/certidao_casamento.pdf', 1048576, 'application/pdf', 'approved', client_user_id, NOW() - INTERVAL '58 days'),
    (case_1_id, 'Escritura do Imóvel.pdf', 'Documento Patrimonial', 'Escritura do imóvel em partilha', '/documents/caso1/escritura.pdf', 2097152, 'application/pdf', 'approved', client_user_id, NOW() - INTERVAL '50 days'),
    (case_1_id, 'Extrato Bancário.pdf', 'Documento Financeiro', 'Extratos dos últimos 3 meses', '/documents/caso1/extrato.pdf', 1536000, 'application/pdf', 'approved', client_user_id, NOW() - INTERVAL '50 days'),
    (case_1_id, 'Acordo de Partilha - Minuta.pdf', 'Documento do Processo', 'Minuta do acordo elaborada pelo advogado', '/documents/caso1/minuta_acordo.pdf', 3145728, 'application/pdf', 'approved', lawyer_user_id, NOW() - INTERVAL '35 days');

  -- ============================================================================
  -- CASO 2: Ação Trabalhista (Aguardando Documentos - 25%)
  -- ============================================================================

  INSERT INTO cases (
    client_id,
    lawyer_id,
    service_type,
    status,
    description,
    case_number,
    court,
    value,
    current_phase,
    progress,
    next_step,
    metadata
  ) VALUES (
    client_user_id,
    lawyer_user_id,
    'Trabalhista - Rescisão Indireta',
    'aguardando_documentos',
    'Rescisão indireta de contrato de trabalho por falta de pagamento de salários e FGTS. Pedido de verbas rescisórias e danos morais.',
    NULL,
    NULL,
    50000.00,
    'Coleta de documentos trabalhistas',
    25,
    'Enviar comprovantes de pagamento, contratos e comunicações com empresa',
    '{"oab": "OAB/SP 123456", "estimated_duration": "6-12 meses", "complexity": "média"}'::jsonb
  ) RETURNING id INTO case_2_id;

  -- Timeline do Caso 2
  INSERT INTO case_timeline (case_id, type, title, description, created_at) VALUES
    (case_2_id, 'created', 'Caso criado', 'Cliente solicitou consultoria trabalhista', NOW() - INTERVAL '15 days'),
    (case_2_id, 'lawyer_assigned', 'Advogado atribuído', 'Caso atribuído ao Dr. João Silva', NOW() - INTERVAL '14 days'),
    (case_2_id, 'meeting', 'Consulta inicial', 'Primeira reunião para entender o caso e definir estratégia', NOW() - INTERVAL '10 days'),
    (case_2_id, 'document_submitted', 'CTPS enviada', 'Cliente enviou cópia da Carteira de Trabalho', NOW() - INTERVAL '5 days');

  -- Documentos do Caso 2
  INSERT INTO case_documents (case_id, name, type, description, file_url, file_size, mime_type, status, uploaded_by, uploaded_at) VALUES
    (case_2_id, 'Carteira de Trabalho.pdf', 'Documento Trabalhista', 'CTPS completa - todas as páginas', '/documents/caso2/ctps.pdf', 4194304, 'application/pdf', 'approved', client_user_id, NOW() - INTERVAL '5 days'),
    (case_2_id, 'RG e CPF.pdf', 'Documento Pessoal', 'Documentos pessoais do trabalhador', '/documents/caso2/rg_cpf.pdf', 819200, 'application/pdf', 'under_review', client_user_id, NOW() - INTERVAL '4 days'),
    (case_2_id, 'Comprovante de Residência.pdf', 'Documento Pessoal', 'Conta de luz atualizada', '/documents/caso2/comprovante.pdf', 512000, 'application/pdf', 'pending', client_user_id, NOW() - INTERVAL '2 days');

  -- ============================================================================
  -- CASO 3: Direito do Consumidor (Concluído - 100%)
  -- ============================================================================

  INSERT INTO cases (
    client_id,
    lawyer_id,
    service_type,
    status,
    description,
    case_number,
    court,
    value,
    current_phase,
    progress,
    next_step,
    metadata,
    completed_at
  ) VALUES (
    client_user_id,
    lawyer_user_id,
    'Direito do Consumidor - Restituição',
    'concluido',
    'Restituição de valores pagos indevidamente em compra de produto defeituoso. Empresa se recusou a fazer devolução amigável.',
    '0007890-12.2023.8.26.0577',
    'JEC - São José dos Campos/SP',
    5000.00,
    'Processo concluído com acordo',
    100,
    'Caso encerrado - Pagamento recebido',
    '{"oab": "OAB/SP 123456", "estimated_duration": "2-3 meses", "complexity": "baixa", "resultado": "acordo_homologado"}'::jsonb,
    NOW() - INTERVAL '10 days'
  ) RETURNING id INTO case_3_id;

  -- Timeline do Caso 3
  INSERT INTO case_timeline (case_id, type, title, description, created_at) VALUES
    (case_3_id, 'created', 'Caso criado', 'Cliente buscou restituição de compra com defeito', NOW() - INTERVAL '120 days'),
    (case_3_id, 'lawyer_assigned', 'Advogado atribuído', 'Caso atribuído ao Dr. João Silva', NOW() - INTERVAL '119 days'),
    (case_3_id, 'document_submitted', 'Documentos enviados', 'Nota fiscal, fotos do produto e comunicações com loja', NOW() - INTERVAL '118 days'),
    (case_3_id, 'status_changed', 'Status atualizado', 'Documentação analisada e aprovada', NOW() - INTERVAL '115 days'),
    (case_3_id, 'court_update', 'Petição protocolada', 'Ação ajuizada no JEC', NOW() - INTERVAL '110 days'),
    (case_3_id, 'meeting', 'Audiência de conciliação', 'Primeira audiência - empresa não compareceu', NOW() - INTERVAL '80 days'),
    (case_3_id, 'court_update', 'Sentença publicada', 'Juiz condenou empresa ao pagamento', NOW() - INTERVAL '60 days'),
    (case_3_id, 'payment', 'Acordo aceito', 'Empresa propôs acordo antes da execução', NOW() - INTERVAL '30 days'),
    (case_3_id, 'payment', 'Pagamento recebido', 'Valor depositado na conta do cliente', NOW() - INTERVAL '10 days'),
    (case_3_id, 'status_changed', 'Caso concluído', 'Processo arquivado com êxito', NOW() - INTERVAL '10 days');

  -- Documentos do Caso 3
  INSERT INTO case_documents (case_id, name, type, description, file_url, file_size, mime_type, status, uploaded_by, uploaded_at) VALUES
    (case_3_id, 'Nota Fiscal.pdf', 'Comprovante de Compra', 'NF-e da compra do produto', '/documents/caso3/nf.pdf', 307200, 'application/pdf', 'approved', client_user_id, NOW() - INTERVAL '118 days'),
    (case_3_id, 'Fotos do Defeito.pdf', 'Evidência', 'Fotos mostrando o defeito do produto', '/documents/caso3/fotos.pdf', 5242880, 'application/pdf', 'approved', client_user_id, NOW() - INTERVAL '118 days'),
    (case_3_id, 'E-mails com Loja.pdf', 'Correspondência', 'Histórico de comunicação com SAC', '/documents/caso3/emails.pdf', 1048576, 'application/pdf', 'approved', client_user_id, NOW() - INTERVAL '118 days'),
    (case_3_id, 'Sentença.pdf', 'Documento Judicial', 'Sentença do juiz condenando a empresa', '/documents/caso3/sentenca.pdf', 2097152, 'application/pdf', 'approved', lawyer_user_id, NOW() - INTERVAL '60 days'),
    (case_3_id, 'Comprovante de Pagamento.pdf', 'Comprovante', 'Comprovante do depósito recebido', '/documents/caso3/comprovante_pgto.pdf', 614400, 'application/pdf', 'approved', client_user_id, NOW() - INTERVAL '10 days');

  -- ============================================================================
  -- NOTIFICAÇÕES DE TESTE
  -- ============================================================================

  -- Notificações recentes não lidas
  INSERT INTO notifications (user_id, type, title, description, link, read, created_at) VALUES
    (client_user_id, 'case_update', 'Prazo definido no seu caso', 'Divórcio Consensual: Aguardando manifestação do MP - prazo de 15 dias', '/cliente/casos/' || case_1_id, false, NOW() - INTERVAL '2 days'),
    (client_user_id, 'document', 'Documento pendente de envio', 'Trabalhista: Ainda faltam documentos importantes. Envie o quanto antes.', '/cliente/casos/' || case_2_id, false, NOW() - INTERVAL '1 day'),
    (client_user_id, 'message', 'Nova mensagem do advogado', 'Dr. João Silva enviou uma mensagem sobre seu caso de divórcio', '/cliente/mensagens', false, NOW() - INTERVAL '5 hours'),
    (client_user_id, 'deadline', 'Prazo se aproximando', 'Você tem 3 dias para enviar os documentos trabalhistas', '/cliente/casos/' || case_2_id, false, NOW() - INTERVAL '2 hours');

  -- Notificações antigas já lidas
  INSERT INTO notifications (user_id, type, title, description, link, read, read_at, created_at) VALUES
    (client_user_id, 'payment', 'Pagamento recebido', 'Restituição do caso de Direito do Consumidor foi depositada', '/cliente/casos/' || case_3_id, true, NOW() - INTERVAL '9 days', NOW() - INTERVAL '10 days'),
    (client_user_id, 'case_update', 'Caso concluído com sucesso', 'Seu caso de Direito do Consumidor foi encerrado', '/cliente/casos/' || case_3_id, true, NOW() - INTERVAL '9 days', NOW() - INTERVAL '10 days'),
    (client_user_id, 'document', 'Documento aprovado', 'Carteira de Trabalho foi aprovada pela equipe', '/cliente/casos/' || case_2_id, true, NOW() - INTERVAL '4 days', NOW() - INTERVAL '5 days');

  -- ============================================================================
  -- MENSAGEM DE SUCESSO
  -- ============================================================================

  RAISE NOTICE '✅ Dados de teste criados com sucesso!';
  RAISE NOTICE '📊 Resumo:';
  RAISE NOTICE '   - 3 casos criados (1 em andamento, 1 aguardando docs, 1 concluído)';
  RAISE NOTICE '   - 14 documentos anexados';
  RAISE NOTICE '   - 24 eventos na timeline';
  RAISE NOTICE '   - 7 notificações (4 não lidas)';
  RAISE NOTICE '';
  RAISE NOTICE '🔗 Acesse o portal em: /cliente/dashboard';
  RAISE NOTICE '👤 Faça login com o usuário: %', (SELECT email FROM auth.users WHERE id = client_user_id);

END $$;
