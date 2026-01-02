-- ============================================================================
-- FINANCIAL MANAGEMENT SYSTEM
-- Sistema completo de gestão financeira com despesas, receitas e fluxo de caixa
-- ============================================================================

-- Create expenses table (despesas)
CREATE TABLE IF NOT EXISTS expenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Categorization
  type VARCHAR(50) NOT NULL, -- 'court_costs', 'travel', 'office', 'professional_fees', 'other'
  category VARCHAR(100) NOT NULL,
  description TEXT NOT NULL,

  -- Financial data
  amount DECIMAL(10,2) NOT NULL,
  payment_method VARCHAR(50), -- 'cash', 'credit_card', 'debit_card', 'bank_transfer', 'pix'
  payment_status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'paid', 'cancelled'

  -- Dates
  expense_date DATE NOT NULL,
  payment_date DATE,
  due_date DATE,

  -- Associations
  case_id UUID REFERENCES cases(id) ON DELETE SET NULL,
  client_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  responsible_id UUID REFERENCES profiles(id) ON DELETE SET NULL, -- quem fez a despesa

  -- Documentation
  receipt_url TEXT, -- link para comprovante
  notes TEXT,

  -- Reimbursement
  is_reimbursable BOOLEAN DEFAULT false,
  reimbursed BOOLEAN DEFAULT false,
  reimbursed_at TIMESTAMPTZ,
  reimbursed_by UUID REFERENCES profiles(id) ON DELETE SET NULL,

  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES profiles(id) ON DELETE SET NULL
);

-- Indexes for expenses
CREATE INDEX IF NOT EXISTS idx_expenses_type ON expenses(type);
CREATE INDEX IF NOT EXISTS idx_expenses_category ON expenses(category);
CREATE INDEX IF NOT EXISTS idx_expenses_status ON expenses(payment_status);
CREATE INDEX IF NOT EXISTS idx_expenses_case ON expenses(case_id);
CREATE INDEX IF NOT EXISTS idx_expenses_client ON expenses(client_id);
CREATE INDEX IF NOT EXISTS idx_expenses_date ON expenses(expense_date DESC);
CREATE INDEX IF NOT EXISTS idx_expenses_created ON expenses(created_at DESC);

-- Create financial_transactions table (transações financeiras)
CREATE TABLE IF NOT EXISTS financial_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Transaction type
  transaction_type VARCHAR(50) NOT NULL, -- 'income', 'expense', 'transfer'
  category VARCHAR(100) NOT NULL,
  description TEXT NOT NULL,

  -- Financial data
  amount DECIMAL(10,2) NOT NULL,
  balance_after DECIMAL(10,2), -- saldo após transação

  -- Source/Destination
  source VARCHAR(100), -- origem (ex: cliente, conta bancária)
  destination VARCHAR(100), -- destino

  -- References
  reference_type VARCHAR(50), -- 'invoice', 'expense', 'case', 'client'
  reference_id UUID, -- ID da referência

  -- Payment info
  payment_method VARCHAR(50),
  payment_status VARCHAR(50) DEFAULT 'completed',

  -- Dates
  transaction_date TIMESTAMPTZ NOT NULL,

  -- Metadata
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES profiles(id) ON DELETE SET NULL
);

-- Indexes for transactions
CREATE INDEX IF NOT EXISTS idx_transactions_type ON financial_transactions(transaction_type);
CREATE INDEX IF NOT EXISTS idx_transactions_category ON financial_transactions(category);
CREATE INDEX IF NOT EXISTS idx_transactions_date ON financial_transactions(transaction_date DESC);
CREATE INDEX IF NOT EXISTS idx_transactions_reference ON financial_transactions(reference_type, reference_id);

-- Create cash_flow_summary table (resumo de fluxo de caixa)
CREATE TABLE IF NOT EXISTS cash_flow_summary (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Period
  period_type VARCHAR(20) NOT NULL, -- 'daily', 'weekly', 'monthly', 'yearly'
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,

  -- Amounts
  total_income DECIMAL(10,2) DEFAULT 0,
  total_expenses DECIMAL(10,2) DEFAULT 0,
  net_cash_flow DECIMAL(10,2) DEFAULT 0,

  -- Breakdown
  income_breakdown JSONB, -- detalhamento por categoria
  expense_breakdown JSONB,

  -- Metadata
  calculated_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(period_type, period_start, period_end)
);

-- Index for cash flow
CREATE INDEX IF NOT EXISTS idx_cashflow_period ON cash_flow_summary(period_type, period_start);

-- Function to calculate cash flow for a period
CREATE OR REPLACE FUNCTION calculate_cash_flow(
  p_start_date DATE,
  p_end_date DATE
)
RETURNS TABLE (
  total_income DECIMAL(10,2),
  total_expenses DECIMAL(10,2),
  net_cash_flow DECIMAL(10,2)
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    COALESCE(SUM(CASE WHEN transaction_type = 'income' THEN amount ELSE 0 END), 0) as total_income,
    COALESCE(SUM(CASE WHEN transaction_type = 'expense' THEN amount ELSE 0 END), 0) as total_expenses,
    COALESCE(
      SUM(CASE WHEN transaction_type = 'income' THEN amount ELSE 0 END) -
      SUM(CASE WHEN transaction_type = 'expense' THEN amount ELSE 0 END),
      0
    ) as net_cash_flow
  FROM financial_transactions
  WHERE transaction_date >= p_start_date::timestamptz
    AND transaction_date <= (p_end_date::timestamptz + INTERVAL '1 day' - INTERVAL '1 second');
END;
$$ LANGUAGE plpgsql;

-- Function to get expense summary by category
CREATE OR REPLACE FUNCTION get_expense_summary_by_category(
  p_start_date DATE,
  p_end_date DATE
)
RETURNS TABLE (
  category VARCHAR(100),
  total_amount DECIMAL(10,2),
  transaction_count BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    e.category,
    SUM(e.amount) as total_amount,
    COUNT(*) as transaction_count
  FROM expenses e
  WHERE e.expense_date >= p_start_date
    AND e.expense_date <= p_end_date
    AND e.payment_status != 'cancelled'
  GROUP BY e.category
  ORDER BY total_amount DESC;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update updated_at on expenses
CREATE OR REPLACE FUNCTION update_expenses_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_expenses_updated_at ON expenses;
CREATE TRIGGER trigger_expenses_updated_at
  BEFORE UPDATE ON expenses
  FOR EACH ROW
  EXECUTE FUNCTION update_expenses_updated_at();

-- RLS Policies for expenses
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;

-- Admins can do everything
DROP POLICY IF EXISTS expenses_admin_all ON expenses;
CREATE POLICY expenses_admin_all ON expenses
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Lawyers can view expenses for their cases
DROP POLICY IF EXISTS expenses_lawyer_select ON expenses;
CREATE POLICY expenses_lawyer_select ON expenses
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND role = 'lawyer'
      AND (
        id = expenses.responsible_id
        OR id IN (
          SELECT lawyer_id FROM cases WHERE id = expenses.case_id
        )
      )
    )
  );

-- Lawyers can insert expenses for their cases
DROP POLICY IF EXISTS expenses_lawyer_insert ON expenses;
CREATE POLICY expenses_lawyer_insert ON expenses
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'lawyer'
    )
  );

-- RLS Policies for financial_transactions
ALTER TABLE financial_transactions ENABLE ROW LEVEL SECURITY;

-- Admins can do everything
DROP POLICY IF EXISTS transactions_admin_all ON financial_transactions;
CREATE POLICY transactions_admin_all ON financial_transactions
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Lawyers can view transactions
DROP POLICY IF EXISTS transactions_lawyer_select ON financial_transactions;
CREATE POLICY transactions_lawyer_select ON financial_transactions
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'lawyer'
    )
  );

-- RLS Policies for cash_flow_summary
ALTER TABLE cash_flow_summary ENABLE ROW LEVEL SECURITY;

-- Admins and lawyers can view
DROP POLICY IF EXISTS cashflow_view ON cash_flow_summary;
CREATE POLICY cashflow_view ON cash_flow_summary
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role IN ('admin', 'lawyer')
    )
  );

-- Comments
COMMENT ON TABLE expenses IS 'Despesas do escritório (custas processuais, viagens, etc)';
COMMENT ON TABLE financial_transactions IS 'Todas as transações financeiras (receitas e despesas)';
COMMENT ON TABLE cash_flow_summary IS 'Resumo de fluxo de caixa por período';

COMMENT ON COLUMN expenses.type IS 'Tipo de despesa: court_costs, travel, office, professional_fees, other';
COMMENT ON COLUMN expenses.is_reimbursable IS 'Se a despesa é reembolsável (custas do cliente)';
COMMENT ON COLUMN financial_transactions.balance_after IS 'Saldo da conta após a transação';
