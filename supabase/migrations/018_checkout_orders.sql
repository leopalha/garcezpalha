-- Migration: Checkout Orders Table
-- Tabela para armazenar pedidos de checkout (Stripe e MercadoPago)

-- Criar tabela checkout_orders
CREATE TABLE IF NOT EXISTS public.checkout_orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Relacionamentos
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    lead_id UUID REFERENCES public.leads(id) ON DELETE SET NULL,

    -- Informações do serviço
    service_id TEXT NOT NULL,
    service_name TEXT NOT NULL,
    service_description TEXT,

    -- Valores
    amount BIGINT NOT NULL, -- Em centavos
    original_amount BIGINT NOT NULL,
    discount_amount BIGINT DEFAULT 0,
    discount_percentage INTEGER DEFAULT 0,

    -- Status do pedido
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'paid', 'failed', 'cancelled', 'refunded')),

    -- Informações de pagamento
    payment_provider TEXT CHECK (payment_provider IN ('stripe', 'mercadopago', 'pix')),
    payment_id TEXT, -- ID do pagamento no provider
    payment_method TEXT, -- card, pix, boleto, etc
    payment_details JSONB DEFAULT '{}',

    -- Informações do cliente
    customer_name TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    customer_phone TEXT,
    customer_cpf TEXT,

    -- Metadados
    metadata JSONB DEFAULT '{}',
    notes TEXT,

    -- Timestamps
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    paid_at TIMESTAMPTZ,
    cancelled_at TIMESTAMPTZ,
    refunded_at TIMESTAMPTZ,

    -- Stripe específico
    stripe_session_id TEXT,
    stripe_payment_intent_id TEXT,

    -- MercadoPago específico
    mercadopago_preference_id TEXT,
    mercadopago_payment_id TEXT,

    -- PIX específico
    pix_qr_code TEXT,
    pix_qr_code_base64 TEXT,
    pix_expires_at TIMESTAMPTZ
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_checkout_orders_user_id ON public.checkout_orders(user_id);
CREATE INDEX IF NOT EXISTS idx_checkout_orders_lead_id ON public.checkout_orders(lead_id);
CREATE INDEX IF NOT EXISTS idx_checkout_orders_status ON public.checkout_orders(status);
CREATE INDEX IF NOT EXISTS idx_checkout_orders_payment_provider ON public.checkout_orders(payment_provider);
CREATE INDEX IF NOT EXISTS idx_checkout_orders_created_at ON public.checkout_orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_checkout_orders_customer_email ON public.checkout_orders(customer_email);
CREATE INDEX IF NOT EXISTS idx_checkout_orders_stripe_session ON public.checkout_orders(stripe_session_id);
CREATE INDEX IF NOT EXISTS idx_checkout_orders_mercadopago_payment ON public.checkout_orders(mercadopago_payment_id);

-- Trigger para updated_at
CREATE TRIGGER update_checkout_orders_updated_at
    BEFORE UPDATE ON public.checkout_orders
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Habilitar RLS
ALTER TABLE public.checkout_orders ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "checkout_orders_service_all" ON public.checkout_orders
    FOR ALL TO service_role
    USING (true) WITH CHECK (true);

CREATE POLICY "checkout_orders_auth_select_own" ON public.checkout_orders
    FOR SELECT TO authenticated
    USING (user_id = auth.uid() OR customer_email = auth.jwt()->>'email');

CREATE POLICY "checkout_orders_auth_insert" ON public.checkout_orders
    FOR INSERT TO authenticated
    WITH CHECK (true);

CREATE POLICY "checkout_orders_anon_insert" ON public.checkout_orders
    FOR INSERT TO anon
    WITH CHECK (true);

-- Grants
GRANT ALL ON public.checkout_orders TO authenticated, service_role;
GRANT INSERT ON public.checkout_orders TO anon;

-- Comentário
COMMENT ON TABLE public.checkout_orders IS 'Pedidos de checkout - Stripe, MercadoPago, PIX';
