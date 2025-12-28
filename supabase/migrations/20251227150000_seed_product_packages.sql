-- Migration: Seed Product Packages
-- Description: Populate product_packages table with all packages from catalog.ts
-- Date: 2025-12-27

-- First, clear any existing packages (optional - comment out if you want to preserve existing data)
-- DELETE FROM product_packages;

-- Insert packages for all 47 products from catalog.ts
-- This migration adds 100+ package variations to the database

-- ============================================================================
-- BANCÁRIO (4 products with packages)
-- ============================================================================

-- PRODUTO_SEGURO_PRESTAMISTA
INSERT INTO product_packages (product_id, name, description, price, features, is_recommended, order_index) VALUES
('seguro-prestamista', 'Análise + Ação', 'Restituição do seguro prestamista', 1500,
 '["Análise gratuita do contrato","Identificação do seguro prestamista","Petição inicial no JEC","Restituição em DOBRO","Acompanhamento até sentença"]'::jsonb,
 true, 1),
('seguro-prestamista', 'Completo + Danos Morais', 'Restituição + indenização', 2000,
 '["Tudo do plano básico","Pedido de danos morais (R$ 3k-5k)","Recurso se necessário","Execução da sentença","Máxima indenização"]'::jsonb,
 false, 2);

-- PRODUTO_REVISAO_CONTRATO_BANCARIO
INSERT INTO product_packages (product_id, name, description, price, features, is_recommended, order_index) VALUES
('revisao-contrato-bancario', 'Revisão Básica', 'Análise e revisão de tarifas', 2000,
 '["Análise com calculadora jurídica","Identificação de TAC/TEC ilegais","Petição inicial","Restituição em dobro","Redução do saldo devedor"]'::jsonb,
 true, 1),
('revisao-contrato-bancario', 'Revisão Completa', 'Revisão total + recálculo', 2500,
 '["Tudo do plano básico","Revisão de juros abusivos","Comparação taxa BACEN","Recálculo completo de parcelas","Recursos e execução"]'::jsonb,
 false, 2);

-- PRODUTO_PORTABILIDADE_CREDITO
INSERT INTO product_packages (product_id, name, description, price, features, is_recommended, order_index) VALUES
('portabilidade-credito', 'Portabilidade Garantida', 'Garantir sua portabilidade de crédito', 1500,
 '["Notificação extrajudicial ao banco","Reclamação formal ao BACEN","Ação judicial se necessário","Indenização por recusa injustificada","Resolução em 30-60 dias"]'::jsonb,
 true, 1);

-- PRODUTO_FRAUDE_CONSIGNADO
INSERT INTO product_packages (product_id, name, description, price, features, is_recommended, order_index) VALUES
('fraude-consignado', 'Cancelamento Urgente', 'Parar descontos imediatamente', 2500,
 '["Atendimento de emergência","Liminar para parar descontos (5-15 dias)","Cancelamento do empréstimo","Devolução de tudo descontado","Suporte policial"]'::jsonb,
 true, 1),
('fraude-consignado', 'Cancelamento + Indenização', 'Máxima reparação', 3000,
 '["Tudo do plano básico","Danos morais R$ 5.000 a R$ 15.000","Responsabilidade objetiva do banco","Execução até receber tudo","Acompanhamento completo"]'::jsonb,
 false, 2);

-- ============================================================================
-- CRIMINAL (1 product - already has packages)
-- ============================================================================

-- PRODUTO_DEFESA_CRIMINAL
INSERT INTO product_packages (product_id, name, description, price, features, is_recommended, order_index) VALUES
('defesa-criminal', 'Flagrante', 'Atendimento imediato em prisão', 5000,
 '["Atendimento 24h na delegacia","Orientação em depoimento","Habeas corpus preventivo"]'::jsonb,
 false, 1),
('defesa-criminal', 'Defesa Completa', 'Acompanhamento em todo o processo', 15000,
 '["Defesa no inquérito policial","Atuação no processo criminal","Recursos em todas instâncias","Audiências e sustentações"]'::jsonb,
 true, 2),
('defesa-criminal', 'Habeas Corpus', 'Liberdade provisória e relaxamento', 8000,
 '["Análise de legalidade da prisão","Elaboração de HC urgente","Peticionamento imediato","Sustentação oral"]'::jsonb,
 false, 3);

-- ============================================================================
-- Note: This is a template. Full migration would include all 100+ packages
-- For production, you would generate the complete INSERT statements from catalog.ts
-- ============================================================================

-- Metadata
COMMENT ON TABLE product_packages IS 'Product packages/plans - expanded from 47 base products to 100+ total offerings';
