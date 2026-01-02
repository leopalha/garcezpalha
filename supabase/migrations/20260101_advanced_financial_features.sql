-- ============================================================================
-- FEAT-009: Advanced Financial Features
-- RPA Emission, Invoice Installments, Bank Import, Cash Flow Forecasting
-- ============================================================================

-- ============================================================================
-- 1. RPAs (Recibo de Pagamento Autônomo) Table
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.rpas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  rpa_number TEXT NOT NULL UNIQUE,
  case_id UUID REFERENCES public.cases(id) ON DELETE SET NULL,
  lawyer_id UUID NOT NULL REFERENCES auth.users(id),
  description TEXT NOT NULL,
  gross_value DECIMAL(12, 2) NOT NULL CHECK (gross_value > 0),
  net_value DECIMAL(12, 2) NOT NULL CHECK (net_value > 0),
  irrf_deduction DECIMAL(12, 2) NOT NULL DEFAULT 0,
  inss_deduction DECIMAL(12, 2) NOT NULL DEFAULT 0,
  iss_deduction DECIMAL(12, 2) NOT NULL DEFAULT 0,
  service_date TIMESTAMPTZ NOT NULL,
  payment_date TIMESTAMPTZ NOT NULL,
  observations TEXT,
  status TEXT NOT NULL DEFAULT 'pending_payment' CHECK (status IN ('pending_payment', 'paid', 'cancelled')),
  created_by UUID NOT NULL REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_rpas_lawyer_id ON public.rpas(lawyer_id);
CREATE INDEX idx_rpas_case_id ON public.rpas(case_id);
CREATE INDEX idx_rpas_status ON public.rpas(status);
CREATE INDEX idx_rpas_service_date ON public.rpas(service_date DESC);

-- ============================================================================
-- 2. Invoice Installments Table
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.invoice_installments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id UUID NOT NULL REFERENCES public.invoices(id) ON DELETE CASCADE,
  installment_number INTEGER NOT NULL CHECK (installment_number > 0),
  amount DECIMAL(12, 2) NOT NULL CHECK (amount > 0),
  due_date TIMESTAMPTZ NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'late', 'cancelled')),
  paid_amount DECIMAL(12, 2) DEFAULT 0,
  payment_date TIMESTAMPTZ,
  notes TEXT,
  created_by UUID NOT NULL REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT unique_invoice_installment UNIQUE (invoice_id, installment_number)
);

CREATE INDEX idx_installments_invoice_id ON public.invoice_installments(invoice_id);
CREATE INDEX idx_installments_status ON public.invoice_installments(status);
CREATE INDEX idx_installments_due_date ON public.invoice_installments(due_date);

-- ============================================================================
-- 3. Bank Transactions Table (Imported from statements)
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.bank_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bank_account TEXT NOT NULL,
  transaction_date TIMESTAMPTZ NOT NULL,
  description TEXT NOT NULL,
  amount DECIMAL(12, 2) NOT NULL CHECK (amount > 0),
  transaction_type TEXT NOT NULL CHECK (transaction_type IN ('credit', 'debit')),
  balance DECIMAL(12, 2),
  reference TEXT,
  transaction_hash TEXT NOT NULL UNIQUE, -- Prevent duplicates
  status TEXT NOT NULL DEFAULT 'pending_classification' CHECK (status IN ('pending_classification', 'classified', 'ignored')),
  category TEXT,
  expense_id UUID REFERENCES public.expenses(id),
  invoice_id UUID REFERENCES public.invoices(id),
  imported_by UUID NOT NULL REFERENCES auth.users(id),
  imported_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT unique_transaction UNIQUE (bank_account, transaction_hash)
);

CREATE INDEX idx_bank_transactions_account ON public.bank_transactions(bank_account);
CREATE INDEX idx_bank_transactions_date ON public.bank_transactions(transaction_date DESC);
CREATE INDEX idx_bank_transactions_type ON public.bank_transactions(transaction_type);
CREATE INDEX idx_bank_transactions_status ON public.bank_transactions(status);

-- ============================================================================
-- 4. Add Installment Flag to Invoices
-- ============================================================================

ALTER TABLE public.invoices
  ADD COLUMN IF NOT EXISTS installment_plan BOOLEAN DEFAULT FALSE;

CREATE INDEX idx_invoices_installment_plan ON public.invoices(installment_plan) WHERE installment_plan = TRUE;

-- ============================================================================
-- 5. RLS Policies
-- ============================================================================

-- RPAs
ALTER TABLE public.rpas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins and managers can view all RPAs"
  ON public.rpas FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid()
      AND role_name IN ('ADMIN', 'MANAGER')
    )
  );

CREATE POLICY "Lawyers can view their own RPAs"
  ON public.rpas FOR SELECT
  USING (lawyer_id = auth.uid());

CREATE POLICY "Admins and managers can create RPAs"
  ON public.rpas FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid()
      AND role_name IN ('ADMIN', 'MANAGER')
    )
  );

-- Invoice Installments
ALTER TABLE public.invoice_installments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view installments"
  ON public.invoice_installments FOR SELECT
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Admins and managers can manage installments"
  ON public.invoice_installments FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid()
      AND role_name IN ('ADMIN', 'MANAGER')
    )
  );

-- Bank Transactions
ALTER TABLE public.bank_transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins and managers can view bank transactions"
  ON public.bank_transactions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid()
      AND role_name IN ('ADMIN', 'MANAGER')
    )
  );

CREATE POLICY "Admins and managers can import transactions"
  ON public.bank_transactions FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid()
      AND role_name IN ('ADMIN', 'MANAGER')
    )
  );

-- ============================================================================
-- 6. Triggers for Updated_at
-- ============================================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_rpas_updated_at BEFORE UPDATE ON public.rpas
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_installments_updated_at BEFORE UPDATE ON public.invoice_installments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- 7. Comments
-- ============================================================================

COMMENT ON TABLE public.rpas IS 'Recibos de Pagamento Autônomo para advogados e profissionais';
COMMENT ON TABLE public.invoice_installments IS 'Parcelamento de faturas em múltiplas parcelas';
COMMENT ON TABLE public.bank_transactions IS 'Transações bancárias importadas de extratos OFX/CSV';

COMMENT ON COLUMN public.rpas.irrf_deduction IS 'Imposto de Renda Retido na Fonte (15%)';
COMMENT ON COLUMN public.rpas.inss_deduction IS 'INSS autônomo (11%)';
COMMENT ON COLUMN public.rpas.iss_deduction IS 'ISS municipal (varia por cidade, ~5%)';

COMMENT ON COLUMN public.bank_transactions.transaction_hash IS 'Hash único para evitar duplicatas na importação';
COMMENT ON COLUMN public.bank_transactions.status IS 'pending_classification: precisa categorizar, classified: categorizado, ignored: ignorar';
