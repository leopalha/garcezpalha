-- Email Templates Management System
-- Allows admin to edit and manage email templates via UI

CREATE TABLE IF NOT EXISTS email_templates (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('email', 'whatsapp', 'contract')),
  category TEXT NOT NULL,
  description TEXT,
  subject TEXT,
  content TEXT NOT NULL,
  variables TEXT[] DEFAULT '{}',
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'draft', 'archived')),
  usage_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  updated_by UUID REFERENCES auth.users(id)
);

-- Add RLS policies
ALTER TABLE email_templates ENABLE ROW LEVEL SECURITY;

-- Admin can do everything
CREATE POLICY "Admin full access to email_templates"
  ON email_templates
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'super_admin')
    )
  );

-- Regular users can only read active templates
CREATE POLICY "Users can read active email_templates"
  ON email_templates
  FOR SELECT
  USING (status = 'active');

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_email_templates_type ON email_templates(type);
CREATE INDEX IF NOT EXISTS idx_email_templates_status ON email_templates(status);
CREATE INDEX IF NOT EXISTS idx_email_templates_category ON email_templates(category);

-- Seed existing templates metadata
INSERT INTO email_templates (id, name, type, category, description, subject, content, variables, status, usage_count)
VALUES
  (
    'welcome-email',
    'Email de Boas-vindas',
    'email',
    'Onboarding',
    'Primeiro email enviado após cadastro de novo lead',
    'Bem-vindo ao Garcez Palha!',
    '<h2>Bem-vindo(a), {{name}}!</h2>
<p>Obrigado por se cadastrar na plataforma Garcez Palha. Estamos honrados em ter você conosco.</p>
<p>Somos uma das mais antigas e respeitadas firmas jurídicas do Brasil, com mais de 364 anos de tradição em serviços jurídicos de excelência.</p>
<div style="background-color: #f0f9ff; border-left: 4px solid #1E3A8A; padding: 15px; margin: 20px 0; border-radius: 0 4px 4px 0;">
  <p style="margin: 0 0 10px; color: #1e40af; font-weight: 600;">O que você pode fazer agora:</p>
  <ul style="margin: 10px 0 0; padding-left: 20px; color: #374151;">
    <li style="margin-bottom: 8px;">Agendar uma consulta gratuita com nossos especialistas</li>
    <li style="margin-bottom: 8px;">Explorar nossos serviços jurídicos completos</li>
    <li style="margin-bottom: 8px;">Acompanhar o andamento de seus processos</li>
    <li style="margin-bottom: 8px;">Entrar em contato direto via WhatsApp</li>
  </ul>
</div>
<p>Sua conta foi criada com o email: <strong>{{email}}</strong></p>
<p style="text-align: center; margin: 30px 0;">
  <a href="https://garcezpalha.com.br/contato" style="display: inline-block; padding: 12px 30px; background-color: #1E3A8A; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: 600;">Agendar Consulta</a>
</p>
<p>Se tiver qualquer dúvida, nossa equipe de atendimento está disponível de segunda a sexta, das 9h às 18h. Responderemos em até 24 horas úteis.</p>
<p style="margin-top: 30px;">Atenciosamente,<br><strong>Equipe Garcez Palha</strong></p>',
    ARRAY['name', 'email', 'service'],
    'active',
    1247
  ),
  (
    'appointment-confirmation',
    'Confirmação de Agendamento',
    'email',
    'Agendamento',
    'Email de confirmação com link do Google Meet',
    'Sua consulta foi agendada - Garcez Palha',
    '<h2>Consulta Agendada com Sucesso!</h2>
<p>Olá <strong>{{name}}</strong>,</p>
<p>Sua consulta jurídica foi confirmada para:</p>
<div style="background-color: #f0f9ff; border-left: 4px solid #1E3A8A; padding: 15px; margin: 20px 0; border-radius: 0 4px 4px 0;">
  <p><strong>Data:</strong> {{date}}</p>
  <p><strong>Horário:</strong> {{time}}</p>
  <p><strong>Advogado:</strong> {{lawyerName}}</p>
</div>
<p style="text-align: center; margin: 30px 0;">
  <a href="{{meetLink}}" style="display: inline-block; padding: 12px 30px; background-color: #1E3A8A; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: 600;">Entrar na Reunião</a>
</p>
<p><strong>Importante:</strong> Por favor, tenha em mãos todos os documentos relacionados ao seu caso.</p>
<p>Até breve!</p>',
    ARRAY['name', 'date', 'time', 'meetLink', 'lawyerName'],
    'active',
    583
  ),
  (
    'contract-signed',
    'Contrato Assinado',
    'email',
    'Contratos',
    'Notificação de contrato assinado com próximos passos',
    'Contrato assinado com sucesso',
    '<h2>Contrato Assinado! 🎉</h2>
<p>Olá <strong>{{name}}</strong>,</p>
<p>Confirmamos que seu contrato de <strong>{{contractType}}</strong> foi assinado digitalmente em {{signedDate}}.</p>
<p><strong>Próximos passos:</strong></p>
<ol>
  <li>Você receberá uma cópia do contrato assinado por email</li>
  <li>Nossa equipe iniciará os procedimentos acordados</li>
  <li>Você será atualizado sobre cada etapa do processo</li>
</ol>
<p>Obrigado pela confiança!</p>',
    ARRAY['name', 'contractType', 'signedDate'],
    'active',
    342
  ),
  (
    'lead-notification',
    'Notificação de Novo Lead',
    'email',
    'Admin',
    'Alerta para admin quando novo lead qualificado entra',
    'Novo lead qualificado - {{leadName}}',
    '<h2>Novo Lead Qualificado 🎯</h2>
<p><strong>Nome:</strong> {{leadName}}</p>
<p><strong>Email:</strong> {{leadEmail}}</p>
<p><strong>Telefone:</strong> {{leadPhone}}</p>
<p><strong>Serviço:</strong> {{service}}</p>
<p><strong>Score:</strong> {{qualificationScore}}/100</p>
<p style="text-align: center; margin: 30px 0;">
  <a href="https://garcezpalha.com.br/admin/leads" style="display: inline-block; padding: 12px 30px; background-color: #1E3A8A; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: 600;">Ver no Dashboard</a>
</p>',
    ARRAY['leadName', 'leadEmail', 'leadPhone', 'service', 'qualificationScore'],
    'active',
    892
  ),
  (
    'payment-receipt',
    'Recibo de Pagamento',
    'email',
    'Financeiro',
    'Confirmação de pagamento recebido',
    'Recibo de pagamento - Garcez Palha',
    '<h2>Pagamento Recebido ✅</h2>
<p>Olá <strong>{{name}}</strong>,</p>
<p>Confirmamos o recebimento do seu pagamento:</p>
<div style="background-color: #f0f9ff; border-left: 4px solid #1E3A8A; padding: 15px; margin: 20px 0; border-radius: 0 4px 4px 0;">
  <p><strong>Valor:</strong> {{amount}}</p>
  <p><strong>Data:</strong> {{paymentDate}}</p>
  <p><strong>Método:</strong> {{paymentMethod}}</p>
  <p><strong>Nota Fiscal:</strong> {{invoiceNumber}}</p>
</div>
<p>Obrigado pela preferência!</p>',
    ARRAY['name', 'amount', 'paymentDate', 'paymentMethod', 'invoiceNumber'],
    'active',
    456
  ),
  (
    'payment-reminder',
    'Lembrete de Pagamento',
    'email',
    'Financeiro',
    'Lembrete com 4 níveis de urgência e QR Code PIX',
    'Lembrete: Fatura vencendo em {{daysUntilDue}} dias',
    '<h2>Lembrete de Pagamento</h2>
<p>Olá <strong>{{name}}</strong>,</p>
<p>Sua fatura no valor de <strong>{{amount}}</strong> vence em {{dueDate}} ({{daysUntilDue}} dias).</p>
<p><strong>Pague via PIX:</strong></p>
<p style="text-align: center;">{{pixQrCode}}</p>
<p style="text-align: center; margin: 30px 0;">
  <a href="https://garcezpalha.com.br/faturas" style="display: inline-block; padding: 12px 30px; background-color: #1E3A8A; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: 600;">Ver Fatura</a>
</p>',
    ARRAY['name', 'amount', 'dueDate', 'daysUntilDue', 'pixQrCode', 'urgencyLevel'],
    'active',
    231
  ),
  (
    'nps-feedback',
    'Pesquisa NPS',
    'email',
    'Feedback',
    'Solicitação de feedback com escala 0-10',
    'Conte-nos sobre sua experiência',
    '<h2>Como foi sua experiência conosco?</h2>
<p>Olá <strong>{{name}}</strong>,</p>
<p>Gostaríamos de saber sua opinião sobre o serviço de <strong>{{service}}</strong> que prestamos.</p>
<p>Em uma escala de 0 a 10, o quanto você nos recomendaria?</p>
<p style="text-align: center; margin: 30px 0;">
  <a href="{{surveyLink}}" style="display: inline-block; padding: 12px 30px; background-color: #1E3A8A; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: 600;">Responder Pesquisa</a>
</p>
<p>Seu feedback é muito importante para continuarmos melhorando!</p>',
    ARRAY['name', 'service', 'surveyLink'],
    'active',
    178
  ),
  (
    'partner-welcome',
    'Boas-vindas Parceiro',
    'email',
    'Parcerias',
    'Email de onboarding para novos parceiros',
    'Bem-vindo à rede de parceiros Garcez Palha',
    '<h2>Bem-vindo à Nossa Rede de Parceiros! 🤝</h2>
<p>Olá <strong>{{partnerName}}</strong>,</p>
<p>É com grande satisfação que confirmamos sua entrada como parceiro Garcez Palha.</p>
<p><strong>Sua comissão:</strong> {{commissionRate}}</p>
<p><strong>Benefícios:</strong></p>
<ul>
  <li>Dashboard exclusivo para acompanhamento</li>
  <li>Suporte dedicado</li>
  <li>Material de divulgação</li>
  <li>Pagamentos mensais</li>
</ul>
<p style="text-align: center; margin: 30px 0;">
  <a href="{{dashboardLink}}" style="display: inline-block; padding: 12px 30px; background-color: #1E3A8A; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: 600;">Acessar Dashboard</a>
</p>',
    ARRAY['partnerName', 'commissionRate', 'dashboardLink'],
    'active',
    45
  )
ON CONFLICT (id) DO NOTHING;

-- Update function for updated_at
CREATE OR REPLACE FUNCTION update_email_templates_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for updated_at
CREATE TRIGGER email_templates_updated_at
  BEFORE UPDATE ON email_templates
  FOR EACH ROW
  EXECUTE FUNCTION update_email_templates_updated_at();

-- Increment usage count function
CREATE OR REPLACE FUNCTION increment_template_usage(template_id TEXT)
RETURNS VOID AS $$
BEGIN
  UPDATE email_templates
  SET usage_count = usage_count + 1
  WHERE id = template_id;
END;
$$ LANGUAGE plpgsql;
