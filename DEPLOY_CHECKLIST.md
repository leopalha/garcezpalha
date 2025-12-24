# 🚀 DEPLOY CHECKLIST - FASE 9

**Data:** 2024-12-23
**Prioridade:** 🔴 CRÍTICA
**Responsável:** DevOps
**Duração Estimada:** 1-2 semanas

---

## ✅ PRÉ-DEPLOY

### 1. Verificação Local

- [ ] **Build local funciona**
  ```bash
  npm run build
  # Deve: 0 erros, 146 rotas geradas
  ```

- [ ] **TypeScript sem erros**
  ```bash
  npx tsc --noEmit
  # Deve: 0 erros
  ```

- [ ] **Testes manuais passam**
  - [ ] Homepage carrega
  - [ ] Chat widget funciona
  - [ ] Páginas de produto abrem
  - [ ] Dashboard admin acessível

- [ ] **Variáveis de ambiente documentadas**
  - [ ] `.env.example` atualizado
  - [ ] Lista completa de env vars no README
  - [ ] Valores sensíveis não commitados

---

## 🗄️ DATABASE SETUP

### 2. Supabase Production

- [ ] **Projeto Supabase criado**
  - Project URL: `https://cpcnzkttcwodvfqyhkou.supabase.co`
  - Status: ✅ Ativo
  - Região: Escolhida (próxima aos usuários)

- [ ] **Executar migrations**

  **Opção A: Supabase CLI (Recomendado)**
  ```bash
  cd d:/garcezpalha
  supabase db push
  ```

  **Opção B: Supabase Dashboard**
  1. Abrir: https://supabase.com/dashboard/project/cpcnzkttcwodvfqyhkou/sql
  2. Copiar conteúdo de `supabase/migrations/016_leads_qualification_system.sql`
  3. Executar
  4. Copiar conteúdo de `supabase/migrations/017_generated_documents.sql`
  5. Executar

- [ ] **Verificar migrations executadas**
  ```sql
  -- No SQL Editor do Supabase
  SELECT table_name FROM information_schema.tables
  WHERE table_schema = 'public'
  AND table_name IN (
    'leads', 'qualification_sessions', 'payment_links',
    'proposals', 'follow_up_messages', 'lead_interactions',
    'generated_documents', 'review_queue',
    'document_templates', 'document_revisions'
  )
  ORDER BY table_name;
  -- Deve retornar: 10 linhas
  ```

- [ ] **Verificar RLS habilitado**
  ```sql
  SELECT tablename, rowsecurity FROM pg_tables
  WHERE schemaname = 'public';
  -- Todas devem ter rowsecurity = true
  ```

- [ ] **Verificar índices criados**
  ```sql
  SELECT tablename, indexname FROM pg_indexes
  WHERE schemaname = 'public'
  AND tablename LIKE '%lead%'
  ORDER BY tablename, indexname;
  -- Deve retornar: 15+ índices
  ```

- [ ] **Verificar funções PostgreSQL**
  ```sql
  SELECT proname FROM pg_proc
  WHERE proname IN ('get_lead_statistics', 'get_conversion_funnel');
  -- Deve retornar: 2 linhas
  ```

- [ ] **Testar função de estatísticas**
  ```sql
  SELECT * FROM get_lead_statistics();
  -- Deve retornar: 1 linha com todas métricas zeradas
  ```

### 3. Criar Usuário Admin

- [ ] **Criar primeiro usuário admin**
  ```sql
  -- No SQL Editor do Supabase
  INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at
  ) VALUES (
    '00000000-0000-0000-0000-000000000000',
    gen_random_uuid(),
    'authenticated',
    'authenticated',
    'admin@garcezpalha.com.br',  -- ALTERAR
    crypt('sua-senha-forte-aqui', gen_salt('bf')),  -- ALTERAR
    NOW(),
    '{"provider":"email","providers":["email"]}',
    '{"role":"admin","name":"Admin Principal"}',
    NOW(),
    NOW()
  );
  ```

- [ ] **Testar login admin**
  - Email: admin@garcezpalha.com.br
  - Senha: (definida acima)
  - Deve: Conseguir fazer login

---

## 🔑 VARIÁVEIS DE AMBIENTE

### 4. Configurar Vercel

- [ ] **Projeto Vercel criado**
  - Nome: garcezpalha-platform
  - Framework: Next.js
  - Git: Conectado ao repositório

- [ ] **Environment Variables configuradas**

  **Supabase:**
  ```env
  NEXT_PUBLIC_SUPABASE_URL=https://cpcnzkttcwodvfqyhkou.supabase.co
  NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
  SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
  ```

  **NextAuth:**
  ```env
  NEXTAUTH_URL=https://garcezpalha.com.br
  NEXTAUTH_SECRET=<gerar com: openssl rand -base64 32>
  ```

  **OpenAI:**
  ```env
  OPENAI_API_KEY=sk-proj-...
  ```

  **MercadoPago:**
  ```env
  MERCADOPAGO_ACCESS_TOKEN=APP_USR-...
  NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY=APP_USR-...
  ```

  **Stripe:**
  ```env
  STRIPE_SECRET_KEY=sk_live_...
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
  STRIPE_WEBHOOK_SECRET=whsec_...
  ```

  **WhatsApp Cloud API:**
  ```env
  WHATSAPP_CLOUD_TOKEN=EAAxx...
  WHATSAPP_PHONE_NUMBER_ID=123456789
  WHATSAPP_VERIFY_TOKEN=seu-verify-token
  ```

  **Resend:**
  ```env
  RESEND_API_KEY=re_...
  ```

  **Google Calendar:**
  ```env
  GOOGLE_CLIENT_ID=...apps.googleusercontent.com
  GOOGLE_CLIENT_SECRET=GOCSPX-...
  ```

- [ ] **Verificar todas env vars no Vercel**
  - Settings → Environment Variables
  - Total: ~15 variáveis
  - Todas definidas para: Production, Preview, Development

---

## 🚀 DEPLOY

### 5. First Deploy

- [ ] **Commit final**
  ```bash
  git add .
  git commit -m "chore: prepare for production deploy"
  git push origin main
  ```

- [ ] **Trigger deploy Vercel**
  - Auto-deploy deve iniciar
  - Ou: Manual deploy via Vercel Dashboard

- [ ] **Aguardar build**
  - Duração estimada: 2-5 min
  - Status: Building...
  - Logs: Verificar sem erros

- [ ] **Build completado**
  - Status: ✅ Ready
  - URL: https://garcezpalha-platform.vercel.app
  - Production: Ativo

### 6. Verificar Deploy

- [ ] **Homepage carrega**
  - URL: https://garcezpalha.com.br (ou Vercel URL)
  - Hero section visível
  - Componentes G4 renderizando
  - WhatsApp float aparece

- [ ] **Assets carregam**
  - Imagens renderizam
  - Fontes corretas
  - CSS aplicado
  - Animações funcionam

- [ ] **Erros no console**
  - F12 → Console
  - Deve: 0 erros críticos
  - Avisos: Aceitável

---

## 🧪 TESTES DE PRODUÇÃO

### 7. Teste Fluxo Completo

#### 7.1 Qualificação de Lead

- [ ] **Abrir chat widget**
  - Canto inferior direito
  - Botão WhatsApp aparece
  - Click abre chat

- [ ] **Enviar mensagem inicial**
  - Mensagem: "Minha conta foi bloqueada"
  - Deve: Bot responde em < 3s
  - Resposta: Pergunta relevante

- [ ] **Responder perguntas (mínimo 3)**
  - Exemplo: "Banco do Brasil"
  - Deve: Próxima pergunta aparece
  - Progresso: Atualiza

- [ ] **Completar qualificação**
  - Responder todas perguntas
  - Deve: Score calculado
  - Categoria: hot/warm/cold exibida

- [ ] **Verificar lead salvo em Supabase**
  ```sql
  SELECT * FROM leads ORDER BY created_at DESC LIMIT 1;
  -- Deve: 1 lead com dados corretos
  ```

- [ ] **Verificar session salva**
  ```sql
  SELECT * FROM qualification_sessions ORDER BY created_at DESC LIMIT 1;
  -- Deve: 1 session com status 'completed'
  ```

- [ ] **Verificar interações logadas**
  ```sql
  SELECT * FROM lead_interactions ORDER BY created_at DESC LIMIT 5;
  -- Deve: Várias interações registradas
  ```

#### 7.2 Payment Link & Proposta

- [ ] **Payment link gerado**
  ```sql
  SELECT * FROM payment_links ORDER BY created_at DESC LIMIT 1;
  -- Deve: 1 link com URL válida
  ```

- [ ] **Testar link MercadoPago**
  - Abrir URL do payment_link
  - Deve: Página de pagamento carrega
  - Valores: Corretos
  - Não pagar (apenas teste)

- [ ] **Proposta gerada**
  ```sql
  SELECT * FROM proposals ORDER BY created_at DESC LIMIT 1;
  -- Deve: 1 proposta com seções completas
  ```

#### 7.3 Follow-ups Agendados

- [ ] **Follow-ups criados**
  ```sql
  SELECT * FROM follow_up_messages
  WHERE lead_id = (SELECT id FROM leads ORDER BY created_at DESC LIMIT 1)
  ORDER BY scheduled_for;
  -- Deve: 3-5 mensagens agendadas
  ```

- [ ] **Canais corretos**
  - WhatsApp: Se phone existe
  - Email: Se email existe
  - Status: 'scheduled'

#### 7.4 Dashboard Admin

- [ ] **Login admin funciona**
  - URL: /login
  - Credenciais: admin criado no passo 3
  - Deve: Redireciona para /admin

- [ ] **Dashboard carrega**
  - URL: /admin
  - Métricas: Exibidas (podem estar zeradas)
  - Gráficos: Renderizam

- [ ] **Stats API funciona**
  ```bash
  curl https://garcezpalha.com.br/api/admin/leads/stats \
    -H "Cookie: next-auth.session-token=..."
  # Deve: JSON com estatísticas
  ```

- [ ] **Lista de leads**
  - URL: /admin/leads
  - Deve: Lead recém-criado aparece
  - Filtros: Funcionam
  - Paginação: OK

#### 7.5 Geração de Documentos

- [ ] **Acessar admin/documentos**
  - URL: /admin/documentos
  - Dashboard: Carrega
  - Templates: Listados

- [ ] **Gerar documento teste**
  - Selecionar: "Petição Desbloqueio Conta"
  - Preencher variáveis
  - Click: "Gerar Documento"
  - Deve: Documento gerado em < 5s

- [ ] **Verificar fila de revisão**
  ```sql
  SELECT * FROM review_queue ORDER BY created_at DESC LIMIT 1;
  -- Deve: 1 item pendente
  ```

- [ ] **Revisar documento**
  - Click: "Revisar"
  - Modal: Abre com preview
  - Aprovar ou Rejeitar
  - Deve: Status atualiza

- [ ] **Download DOCX**
  - Click: "Download DOCX"
  - Arquivo: Baixa
  - Abrir: Formatação correta (Times 12pt, 1.5 espaçamento)

#### 7.6 Mobile Responsivo

- [ ] **iPhone (Safari)**
  - Homepage: Layout mobile
  - Chat: Funciona
  - Forms: OK

- [ ] **Android (Chrome)**
  - Mesmos testes acima
  - Tudo responsivo

- [ ] **Tablet (iPad)**
  - Layout adapta corretamente

---

## 📊 MONITORING

### 8. Setup Monitoring

- [ ] **Vercel Analytics ativado**
  - Settings → Analytics
  - Enable
  - Web Vitals: Monitorando

- [ ] **Supabase Monitoring**
  - Dashboard → Database
  - Query Performance: OK
  - Connection Pool: Saudável
  - Storage: < 10% usado

- [ ] **Error Tracking (Opcional)**
  - Sentry configurado (se usando)
  - Test error: Capturado
  - Alerts: Configurados

- [ ] **Uptime Monitoring (Opcional)**
  - UptimeRobot ou similar
  - URL: https://garcezpalha.com.br
  - Check interval: 5 min
  - Alerts: Email configurado

### 9. Performance Check

- [ ] **Lighthouse Score**
  - Homepage: > 90 Performance
  - SEO: > 95
  - Accessibility: > 90
  - Best Practices: > 90

- [ ] **PageSpeed Insights**
  - Mobile: > 80
  - Desktop: > 90

- [ ] **Testes de carga (Opcional)**
  - 100 req/s: Sistema aguenta
  - Response time: < 200ms avg

---

## 🔒 SECURITY

### 10. Security Checklist

- [ ] **HTTPS ativo**
  - URL: Força https://
  - Redirect: HTTP → HTTPS
  - Certificate: Válido

- [ ] **Headers de segurança**
  - Content-Security-Policy
  - X-Frame-Options
  - X-Content-Type-Options
  - Verificar: https://securityheaders.com

- [ ] **RLS testado**
  - Tentar acesso sem auth
  - Deve: Negado
  - Policies: Funcionando

- [ ] **API rate limiting**
  - Múltiplas requests
  - Deve: Rate limit após threshold

- [ ] **Secrets rotacionados**
  - NEXTAUTH_SECRET: Novo
  - Stripe keys: Production
  - Outros: Não usar dev keys

---

## 📱 DOMÍNIO & DNS

### 11. Configurar Domínio

- [ ] **Domínio configurado no Vercel**
  - garcezpalha.com.br
  - www.garcezpalha.com.br
  - Status: ✅ Active

- [ ] **DNS Records**
  - A record: Vercel IP
  - CNAME www: garcezpalha-platform.vercel.app
  - Propagated: Verificar (dig/nslookup)

- [ ] **SSL Certificate**
  - Auto-generated Vercel
  - Status: ✅ Active
  - Expiration: Auto-renew

---

## ✅ POST-DEPLOY

### 12. Validação Final

- [ ] **Smoke tests passam**
  - [ ] Homepage abre
  - [ ] Chat funciona
  - [ ] Admin login OK
  - [ ] Database conectado
  - [ ] APIs respondem

- [ ] **Team notificado**
  - Email para equipe
  - URL de produção
  - Credenciais admin (seguro)
  - Documentação compartilhada

- [ ] **Backup inicial**
  ```bash
  supabase db dump -f backup_first_deploy_$(date +%Y%m%d).sql
  ```

- [ ] **Monitoring ativo**
  - Vercel Analytics: ✅
  - Supabase Monitoring: ✅
  - Error tracking: ✅ (se usando)

### 13. Documentar Deploy

- [ ] **Atualizar README.md**
  - Production URL
  - Deploy date
  - Version number

- [ ] **Git Tag**
  ```bash
  git tag -a v1.0.0 -m "Production release v1.0.0"
  git push origin v1.0.0
  ```

- [ ] **CHANGELOG.md criado**
  - Primeira versão documentada
  - Features listadas

---

## 🚨 ROLLBACK PLAN

### Se algo der errado:

1. **Reverter deploy Vercel**
   - Deployments → Previous deployment
   - Click "Promote to Production"

2. **Rollback database (se necessário)**
   ```bash
   # Usar backup criado
   psql -h db.xxx.supabase.co -U postgres -d postgres -f backup_file.sql
   ```

3. **Comunicar equipe**
   - Status page update
   - Email para stakeholders

---

## ✅ CHECKLIST RESUMIDO

**PRÉ-DEPLOY:**
- [ ] Build local funciona (0 erros)
- [ ] TypeScript compila (0 erros)
- [ ] Testes manuais passam

**DATABASE:**
- [ ] Supabase projeto criado
- [ ] Migrations executadas (10 tabelas)
- [ ] RLS verificado (todas tabelas)
- [ ] Usuário admin criado

**ENV VARS:**
- [ ] Todas 15 variáveis configuradas
- [ ] Vercel environment setup

**DEPLOY:**
- [ ] Git push → Auto-deploy
- [ ] Build sucesso (Vercel)
- [ ] Homepage carrega

**TESTES:**
- [ ] Qualificação completa funciona
- [ ] Payment link gerado
- [ ] Dashboard admin OK
- [ ] Documentos gerados
- [ ] Mobile responsivo

**MONITORING:**
- [ ] Vercel Analytics ativo
- [ ] Supabase monitoring OK
- [ ] Performance > 90

**SECURITY:**
- [ ] HTTPS ativo
- [ ] RLS testado
- [ ] Secrets em produção

**POST-DEPLOY:**
- [ ] Backup criado
- [ ] Team notificado
- [ ] Git tag criado

---

## 📞 CONTATOS DE EMERGÊNCIA

**Vercel Support:** support@vercel.com
**Supabase Support:** support@supabase.com
**DevOps Lead:** [Adicionar]

---

**IMPORTANTE:** Antes de marcar como completo, verificar que TODOS os itens críticos (🔴) estão ✅

---

*DEPLOY_CHECKLIST.md v1.0*
*Criado: 2024-12-23*
*Fase: 9 - Deploy & Testes*
*Status: 🟡 Pendente*
