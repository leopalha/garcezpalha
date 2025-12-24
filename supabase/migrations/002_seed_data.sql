-- Garcez Palha Seed Data
-- Migration: 002_seed_data
-- Date: 2024-01-15
-- Purpose: Insert sample data for development and testing

-- ==========================================
-- ADMIN USER
-- ==========================================
-- Password: Admin@123 (hashed with bcrypt)
INSERT INTO users (id, email, name, password_hash, role, phone, email_verified, is_active) VALUES
('a0000000-0000-0000-0000-000000000001', 'admin@garcezpalha.com', 'Administrador', '$2b$10$K7L1OJ45/4Y2nIvhRVpCe.QewLqhI.lFxDfQnk6hMWJOoJ4HkzqHm', 'admin', '(21) 99999-0001', true, true)
ON CONFLICT (email) DO NOTHING;

-- ==========================================
-- SAMPLE PARTNERS
-- ==========================================
INSERT INTO users (id, email, name, password_hash, role, phone, document, email_verified, is_active) VALUES
('p0000000-0000-0000-0000-000000000001', 'parceiro1@example.com', 'João Silva', '$2b$10$K7L1OJ45/4Y2nIvhRVpCe.QewLqhI.lFxDfQnk6hMWJOoJ4HkzqHm', 'partner', '(21) 99999-0002', '123.456.789-00', true, true),
('p0000000-0000-0000-0000-000000000002', 'parceiro2@example.com', 'Maria Santos', '$2b$10$K7L1OJ45/4Y2nIvhRVpCe.QewLqhI.lFxDfQnk6hMWJOoJ4HkzqHm', 'partner', '(21) 99999-0003', '987.654.321-00', true, true),
('p0000000-0000-0000-0000-000000000003', 'parceiro3@example.com', 'Pedro Oliveira', '$2b$10$K7L1OJ45/4Y2nIvhRVpCe.QewLqhI.lFxDfQnk6hMWJOoJ4HkzqHm', 'partner', '(21) 99999-0004', '111.222.333-44', true, true)
ON CONFLICT (email) DO NOTHING;

INSERT INTO partners (user_id, company_name, pix_key, pix_key_type, bank_name, account_type, commission_rate, total_referrals, total_converted, total_earnings) VALUES
('p0000000-0000-0000-0000-000000000001', 'JS Indicações LTDA', 'parceiro1@example.com', 'email', 'Nubank', 'Conta Corrente', 10.00, 25, 12, 3600.00),
('p0000000-0000-0000-0000-000000000002', 'Maria Consultoria', '987.654.321-00', 'cpf', 'Itaú', 'Conta Corrente', 12.00, 18, 8, 2880.00),
('p0000000-0000-0000-0000-000000000003', 'Oliveira Network', '21999990004', 'phone', 'Bradesco', 'Conta Poupança', 10.00, 10, 5, 1500.00)
ON CONFLICT (user_id) DO NOTHING;

-- ==========================================
-- SAMPLE LEADS
-- ==========================================
INSERT INTO leads (name, email, phone, message, service_type, source, status, priority, created_at) VALUES
('Ana Costa', 'ana.costa@email.com', '(21) 98765-4321', 'Preciso de ajuda com cobrança indevida no cartão de crédito.', 'Direito do Consumidor', 'website', 'new', 'high', NOW() - INTERVAL '1 hour'),
('Roberto Lima', 'roberto.lima@email.com', '(21) 98765-4322', 'Fui demitido sem justa causa e não recebi todas as verbas.', 'Direito Trabalhista', 'chatbot', 'contacted', 'medium', NOW() - INTERVAL '2 days'),
('Fernanda Souza', 'fernanda.souza@email.com', '(21) 98765-4323', 'Estou me separando e preciso de orientação sobre guarda dos filhos.', 'Direito de Família', 'whatsapp', 'qualified', 'high', NOW() - INTERVAL '3 days'),
('Carlos Mendes', 'carlos.mendes@email.com', '(21) 98765-4324', 'Quero revisar um contrato de compra de imóvel.', 'Direito Imobiliário', 'website', 'proposal', 'medium', NOW() - INTERVAL '5 days'),
('Patrícia Alves', 'patricia.alves@email.com', '(21) 98765-4325', 'Produto com defeito e a loja não quer trocar.', 'Direito do Consumidor', 'social', 'converted', 'low', NOW() - INTERVAL '7 days'),
('Lucas Ferreira', 'lucas.ferreira@email.com', '(21) 98765-4326', 'Preciso de consultoria para abrir uma empresa.', 'Consultoria Jurídica', 'referral', 'new', 'medium', NOW() - INTERVAL '30 minutes'),
('Juliana Martins', 'juliana.martins@email.com', '(21) 98765-4327', 'Problemas com pensão alimentícia atrasada.', 'Direito de Família', 'website', 'contacted', 'urgent', NOW() - INTERVAL '4 hours'),
('André Rodrigues', 'andre.rodrigues@email.com', '(21) 98765-4328', 'Acidente de trabalho, preciso de orientação.', 'Direito Trabalhista', 'chatbot', 'new', 'high', NOW() - INTERVAL '6 hours')
ON CONFLICT DO NOTHING;

-- ==========================================
-- SAMPLE REFERRALS
-- ==========================================
INSERT INTO referrals (partner_id, client_name, client_email, client_phone, service_type, status, potential_value, commission_rate, commission_amount, created_at)
SELECT
  p.id,
  'Cliente Indicado ' || generate_series,
  'cliente' || generate_series || '@email.com',
  '(21) 9' || LPAD((8000 + generate_series)::text, 4, '0') || '-' || LPAD(generate_series::text, 4, '0'),
  CASE (generate_series % 6)
    WHEN 0 THEN 'Consultoria Jurídica'
    WHEN 1 THEN 'Direito do Consumidor'
    WHEN 2 THEN 'Direito Trabalhista'
    WHEN 3 THEN 'Direito de Família'
    WHEN 4 THEN 'Contratos'
    ELSE 'Direito Imobiliário'
  END,
  CASE (generate_series % 5)
    WHEN 0 THEN 'pending'
    WHEN 1 THEN 'contacted'
    WHEN 2 THEN 'qualified'
    WHEN 3 THEN 'converted'
    ELSE 'paid'
  END,
  (1500 + (generate_series * 100))::decimal,
  p.commission_rate,
  ((1500 + (generate_series * 100)) * p.commission_rate / 100)::decimal,
  NOW() - (generate_series || ' days')::interval
FROM partners p
CROSS JOIN generate_series(1, 10);

-- ==========================================
-- SAMPLE PAYMENTS
-- ==========================================
INSERT INTO payments (user_id, amount, currency, payment_method, status, paid_at, created_at) VALUES
(NULL, 1500.00, 'BRL', 'pix', 'completed', NOW() - INTERVAL '10 days', NOW() - INTERVAL '10 days'),
(NULL, 2500.00, 'BRL', 'stripe', 'completed', NOW() - INTERVAL '8 days', NOW() - INTERVAL '8 days'),
(NULL, 800.00, 'BRL', 'pix', 'completed', NOW() - INTERVAL '5 days', NOW() - INTERVAL '5 days'),
(NULL, 3000.00, 'BRL', 'stripe', 'processing', NULL, NOW() - INTERVAL '1 day'),
(NULL, 500.00, 'BRL', 'pix', 'pending', NULL, NOW())
ON CONFLICT DO NOTHING;

-- ==========================================
-- SAMPLE NOTIFICATIONS
-- ==========================================
INSERT INTO notifications (user_id, type, title, message, read, created_at)
SELECT
  'p0000000-0000-0000-0000-000000000001',
  CASE (generate_series % 4)
    WHEN 0 THEN 'referral'
    WHEN 1 THEN 'payment'
    WHEN 2 THEN 'success'
    ELSE 'info'
  END,
  CASE (generate_series % 4)
    WHEN 0 THEN 'Nova indicação registrada'
    WHEN 1 THEN 'Comissão disponível'
    WHEN 2 THEN 'Indicação convertida!'
    ELSE 'Atualização do sistema'
  END,
  CASE (generate_series % 4)
    WHEN 0 THEN 'Sua indicação #' || generate_series || ' foi registrada com sucesso.'
    WHEN 1 THEN 'Você tem R$ ' || (150 * generate_series) || ' em comissões disponíveis.'
    WHEN 2 THEN 'Parabéns! Sua indicação foi convertida em cliente.'
    ELSE 'Confira as novidades da plataforma.'
  END,
  generate_series > 5,
  NOW() - (generate_series || ' days')::interval
FROM generate_series(1, 10);

-- ==========================================
-- UPDATE PARTNER STATISTICS
-- ==========================================
UPDATE partners SET
  total_referrals = (SELECT COUNT(*) FROM referrals WHERE referrals.partner_id = partners.id),
  total_converted = (SELECT COUNT(*) FROM referrals WHERE referrals.partner_id = partners.id AND referrals.status IN ('converted', 'paid')),
  total_earnings = COALESCE((SELECT SUM(commission_amount) FROM referrals WHERE referrals.partner_id = partners.id AND referrals.status = 'paid'), 0),
  pending_earnings = COALESCE((SELECT SUM(commission_amount) FROM referrals WHERE referrals.partner_id = partners.id AND referrals.status = 'converted'), 0);

-- ==========================================
-- ADD MORE REALISTIC AUDIT LOGS
-- ==========================================
INSERT INTO audit_logs (user_id, action, entity_type, entity_id, new_values, ip_address, created_at) VALUES
('a0000000-0000-0000-0000-000000000001', 'CREATE', 'service', NULL, '{"name": "Consultoria Jurídica"}', '127.0.0.1', NOW() - INTERVAL '30 days'),
('p0000000-0000-0000-0000-000000000001', 'CREATE', 'referral', NULL, '{"client_name": "Cliente 1"}', '192.168.1.100', NOW() - INTERVAL '10 days'),
('a0000000-0000-0000-0000-000000000001', 'UPDATE', 'lead', NULL, '{"status": "contacted"}', '127.0.0.1', NOW() - INTERVAL '5 days'),
('p0000000-0000-0000-0000-000000000002', 'CREATE', 'referral', NULL, '{"client_name": "Cliente 2"}', '192.168.1.101', NOW() - INTERVAL '3 days')
ON CONFLICT DO NOTHING;

-- ==========================================
-- VERIFY DATA INTEGRITY
-- ==========================================
DO $$
DECLARE
  user_count INTEGER;
  partner_count INTEGER;
  lead_count INTEGER;
  referral_count INTEGER;
  service_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO user_count FROM users;
  SELECT COUNT(*) INTO partner_count FROM partners;
  SELECT COUNT(*) INTO lead_count FROM leads;
  SELECT COUNT(*) INTO referral_count FROM referrals;
  SELECT COUNT(*) INTO service_count FROM services;

  RAISE NOTICE '=== Seed Data Summary ===';
  RAISE NOTICE 'Users: %', user_count;
  RAISE NOTICE 'Partners: %', partner_count;
  RAISE NOTICE 'Leads: %', lead_count;
  RAISE NOTICE 'Referrals: %', referral_count;
  RAISE NOTICE 'Services: %', service_count;
  RAISE NOTICE '=========================';
END $$;
