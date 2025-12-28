# 🔐 Como Criar Usuário Admin

## O Problema do 401

O erro `401 Unauthorized` em `/api/auth/callback/credentials` acontece porque:
1. ✅ O código de autenticação está correto e deployado
2. ❌ **Você ainda não criou um usuário admin no Supabase**

---

## ✅ Solução: Criar Admin em 3 Passos

### **Passo 1: Criar usuário no Supabase Auth**

1. Acesse: https://supabase.com/dashboard/project/cpcnzkttcwodvfqyhkou
2. Menu lateral → **Authentication** → **Users**
3. Clique em **"Add User"** (ou "Invite user")
4. Preencha:
   - **Email:** `leonardo.palha@gmail.com`
   - **Password:** Escolha uma senha forte (ex: `Admin2025!`)
   - **Email Confirm:** Deixe marcado se quiser confirmar email automaticamente
5. Clique em **"Create User"**
6. **IMPORTANTE:** Copie o **UUID** do usuário criado (exemplo: `c8c9bbe7-dd8f-4faa-9f1c-d59a290b8aa1`)

---

### **Passo 2: Adicionar perfil admin na tabela profiles**

1. No Supabase Dashboard, vá em: **SQL Editor**
2. Clique em **"New Query"**
3. Cole o SQL abaixo (substituindo o UUID):

```sql
-- Substitua 'UUID-DO-USUARIO' pelo UUID que você copiou no Passo 1
INSERT INTO public.profiles (id, role, email, full_name)
VALUES ('UUID-DO-USUARIO', 'admin', 'leonardo.palha@gmail.com', 'Leonardo Palha')
ON CONFLICT (id) DO UPDATE SET
  role = 'admin',
  email = 'leonardo.palha@gmail.com',
  full_name = 'Leonardo Palha';
```

4. Clique em **"Run"** (ou pressione `Ctrl+Enter`)
5. Deve aparecer: **"Success. No rows returned"**

---

### **Passo 3: Verificar se funcionou**

Execute este SQL para confirmar:

```sql
SELECT id, role, email, full_name, created_at
FROM public.profiles
WHERE role = 'admin';
```

**Resultado esperado:**
```
id                                   | role  | email                    | full_name
-------------------------------------|-------|--------------------------|---------------
c8c9bbe7-dd8f-4faa-9f1c-d59a290b8aa1 | admin | leonardo.palha@gmail.com | Leonardo Palha
```

---

## 🎯 Testar o Login

1. Acesse: https://garcezpalha.com/login
2. Login com:
   - **Email:** `leonardo.palha@gmail.com`
   - **Senha:** A senha que você criou no Passo 1
3. Se tudo funcionou, você será redirecionado para: `/admin`

---

## ⚠️ Se Você Já Tinha Criado o Profile Antes

Se você já tinha executado:
```sql
INSERT INTO public.profiles (id, role, email, full_name)
VALUES ('c8c9bbe7-dd8f-4faa-9f1c-d59a290b8aa1', 'admin', 'leonardo.palha@gmail.com', 'Leonardo');
```

Então você precisa criar o usuário no **Supabase Auth** com esse **mesmo UUID**:

### Opção A: Via Dashboard (Mais Fácil)
1. Authentication → Users → Add User
2. **Email:** `leonardo.palha@gmail.com`
3. **Password:** Escolha uma senha
4. Depois de criar, **NÃO VAI FUNCIONAR** porque o UUID será diferente
5. Delete esse usuário e siga a Opção B

### Opção B: Via SQL (Recomendado)
```sql
-- Cria usuário no auth.users com UUID específico
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  recovery_sent_at,
  last_sign_in_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  'c8c9bbe7-dd8f-4faa-9f1c-d59a290b8aa1',  -- SEU UUID EXISTENTE
  'authenticated',
  'authenticated',
  'leonardo.palha@gmail.com',
  crypt('Admin2025!', gen_salt('bf')),  -- MUDE A SENHA AQUI
  NOW(),
  NOW(),
  NOW(),
  '{"provider":"email","providers":["email"]}',
  '{}',
  NOW(),
  NOW(),
  '',
  '',
  '',
  ''
);
```

⚠️ **ATENÇÃO:** A Opção B é avançada. Se tiver dúvidas, use a Opção A e recrie o profile com o novo UUID.

---

## 🔍 Troubleshooting

### Erro: "Email já existe"
**Solução:** Já existe um usuário com esse email. Delete-o primeiro em Authentication → Users.

### Erro: "duplicate key value violates unique constraint"
**Solução:** Já existe um profile com esse UUID. Execute:
```sql
DELETE FROM public.profiles WHERE id = 'UUID-DO-USUARIO';
-- E tente novamente
```

### Erro: "relation auth.users does not exist"
**Solução:** Você não tem permissão para inserir diretamente em `auth.users`. Use a Opção A (Dashboard).

---

## 📚 Resumo

1. ✅ **Criar usuário** no Supabase Auth (Dashboard)
2. ✅ **Copiar UUID** do usuário criado
3. ✅ **Inserir profile** na tabela `public.profiles` com role='admin'
4. ✅ **Testar login** em https://garcezpalha.com/login

Depois disso, o erro 401 vai desaparecer! 🎉
