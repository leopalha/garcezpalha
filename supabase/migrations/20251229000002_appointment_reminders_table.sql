-- Migration: Create appointment_reminders table
-- Description: Tabela para agendar lembretes futuros de appointments
-- Date: 2025-12-29
-- Related: P1-008 Fluxo de Agendamento

-- =====================================================
-- 1. Create appointment_reminders table
-- =====================================================

CREATE TABLE IF NOT EXISTS appointment_reminders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  appointment_id UUID NOT NULL,
  reminder_time TIMESTAMPTZ NOT NULL,
  channel VARCHAR(20) NOT NULL CHECK (channel IN ('email', 'whatsapp', 'sms')),
  status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'failed', 'cancelled')),
  sent_at TIMESTAMPTZ,
  error_message TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Foreign key to appointments
  CONSTRAINT fk_appointment
    FOREIGN KEY (appointment_id)
    REFERENCES appointments(id)
    ON DELETE CASCADE
);

-- =====================================================
-- 2. Create indexes for performance
-- =====================================================

-- Index for finding pending reminders to send
CREATE INDEX IF NOT EXISTS idx_appointment_reminders_pending
ON appointment_reminders(status, reminder_time)
WHERE status = 'pending' AND reminder_time <= NOW();

-- Index for appointment lookup
CREATE INDEX IF NOT EXISTS idx_appointment_reminders_appointment
ON appointment_reminders(appointment_id);

-- Index for channel statistics
CREATE INDEX IF NOT EXISTS idx_appointment_reminders_channel
ON appointment_reminders(channel, status);

-- =====================================================
-- 3. Add comments for documentation
-- =====================================================

COMMENT ON TABLE appointment_reminders IS 'Agendamento de lembretes futuros para appointments';
COMMENT ON COLUMN appointment_reminders.appointment_id IS 'ID do appointment relacionado';
COMMENT ON COLUMN appointment_reminders.reminder_time IS 'Data/hora em que o lembrete deve ser enviado';
COMMENT ON COLUMN appointment_reminders.channel IS 'Canal de envio: email, whatsapp ou sms';
COMMENT ON COLUMN appointment_reminders.status IS 'Status do lembrete: pending, sent, failed, cancelled';
COMMENT ON COLUMN appointment_reminders.sent_at IS 'Timestamp de quando o lembrete foi enviado';
COMMENT ON COLUMN appointment_reminders.error_message IS 'Mensagem de erro se o envio falhou';

-- =====================================================
-- 4. Create function to automatically update updated_at
-- =====================================================

CREATE OR REPLACE FUNCTION update_appointment_reminders_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER appointment_reminders_updated_at
BEFORE UPDATE ON appointment_reminders
FOR EACH ROW
EXECUTE FUNCTION update_appointment_reminders_updated_at();

-- =====================================================
-- Migration Complete
-- =====================================================

-- Example usage:
--
-- Insert reminders for an appointment:
-- INSERT INTO appointment_reminders (appointment_id, reminder_time, channel)
-- VALUES
--   ('uuid-here', NOW() + INTERVAL '24 hours', 'email'),
--   ('uuid-here', NOW() + INTERVAL '2 hours', 'whatsapp');
--
-- Find pending reminders to send:
-- SELECT * FROM appointment_reminders
-- WHERE status = 'pending' AND reminder_time <= NOW()
-- ORDER BY reminder_time;
