# 📝 API de Assinatura Digital - GOV.BR Assinador

## Visão Geral

Sistema de assinatura digital de documentos PDF usando certificado e-OAB ou e-CPF (ICP-Brasil) integrado com GOV.BR Assinador.

**Status**: ✅ Implementado - Aguardando certificado A1

---

## 🔐 Pré-requisitos

1. **Certificado Digital A1** (arquivo .pfx)
   - e-OAB A1 (recomendado para advogados)
   - e-CPF A1 (alternativa válida)
   - Validade: 1 ano
   - Custo: R$ 150-250

2. **Variáveis de Ambiente Configuradas**:
   ```bash
   CERTIFICADO_DIGITAL_BASE64=<certificado.pfx em base64>
   CERTIFICADO_DIGITAL_SENHA=<senha do certificado>
   ```

---

## 📋 Como Configurar

### Passo 1: Converter Certificado para Base64

**No Windows:**
```powershell
certutil -encode certificado.pfx certificado-base64.txt
```

**No Linux/Mac:**
```bash
base64 certificado.pfx > certificado-base64.txt
```

### Passo 2: Configurar no Vercel

```bash
# Adicionar certificado (cole TODO o conteúdo do arquivo base64)
cat certificado-base64.txt | vercel env add CERTIFICADO_DIGITAL_BASE64 production

# Adicionar senha
echo "SUA_SENHA_DO_CERTIFICADO" | vercel env add CERTIFICADO_DIGITAL_SENHA production
```

### Passo 3: Redeploy

```bash
vercel --prod
```

---

## 🚀 Endpoints da API

### 1. `POST /api/documents/sign`

Assina um documento PDF com certificado digital.

**Request:**
```http
POST /api/documents/sign
Content-Type: multipart/form-data

file: <arquivo.pdf>
reason: "Contrato de Prestação de Serviços" (opcional)
location: "São Paulo, Brasil" (opcional)
contactInfo: "contato@garcezpalha.com" (opcional)
```

**Response (Sucesso - 200):**
```http
Content-Type: application/pdf
Content-Disposition: attachment; filename="contrato_assinado.pdf"
X-Certificate-Subject: CN=LEONARDO PALHA, OAB=RJ123456
X-Certificate-Valid-Until: 2025-12-30T23:59:59Z
X-Signature-Timestamp: 2024-12-30T12:00:00Z

<PDF assinado em binário>
```

**Response (Erro - 500):**
```json
{
  "error": "Certificado digital não configurado",
  "message": "Configure CERTIFICADO_DIGITAL_BASE64 e CERTIFICADO_DIGITAL_SENHA"
}
```

**Exemplo de Uso (JavaScript/TypeScript):**
```typescript
async function signDocument(file: File) {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('reason', 'Contrato de Prestação de Serviços')
  formData.append('location', 'Rio de Janeiro, Brasil')

  const response = await fetch('/api/documents/sign', {
    method: 'POST',
    body: formData,
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message)
  }

  // Download do PDF assinado
  const blob = await response.blob()
  const url = window.URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'contrato_assinado.pdf'
  a.click()
}
```

**Exemplo de Uso (cURL):**
```bash
curl -X POST https://garcezpalha.com/api/documents/sign \
  -F "file=@contrato.pdf" \
  -F "reason=Contrato de Prestação de Serviços" \
  -F "location=Rio de Janeiro, Brasil" \
  -o contrato_assinado.pdf
```

---

### 2. `GET /api/documents/sign`

Retorna status do certificado digital.

**Response (200):**
```json
{
  "configured": true,
  "valid": true,
  "certificate": {
    "subject": "CN=LEONARDO PALHA, OAB=RJ123456, CPF=12345678901",
    "issuer": "CN=AC Certisign RFB G5, O=ICP-Brasil",
    "notBefore": "2024-01-01T00:00:00Z",
    "notAfter": "2025-01-01T23:59:59Z",
    "isValid": true,
    "daysUntilExpiration": 180,
    "oab": "RJ123456",
    "cpf": "12345678901"
  },
  "error": null
}
```

**Exemplo de Uso:**
```typescript
const response = await fetch('/api/documents/sign')
const status = await response.json()

if (!status.configured) {
  console.log('Certificado não configurado')
} else if (!status.valid) {
  console.log('Certificado expirado ou inválido')
} else {
  console.log(`Certificado OK - Expira em ${status.certificate.daysUntilExpiration} dias`)
}
```

---

### 3. `GET /api/admin/certificate`

Endpoint administrativo com informações detalhadas do certificado.

**Response (200):**
```json
{
  "status": "ok",
  "configured": true,
  "valid": true,
  "certificate": {
    "subject": "CN=LEONARDO PALHA, OAB=RJ123456",
    "issuer": "CN=AC Certisign RFB G5",
    "serialNumber": "1234567890ABCDEF",
    "notBefore": "2024-01-01T00:00:00.000Z",
    "notAfter": "2025-01-01T23:59:59.000Z",
    "isValid": true,
    "daysUntilExpiration": 180,
    "oab": "RJ123456",
    "cpf": "12345678901",
    "warnings": []
  },
  "error": null
}
```

**Status possíveis:**
- `ok` - Certificado válido e funcionando
- `warning` - Certificado expira em até 30 dias
- `error` - Certificado expirado ou inválido
- `not_configured` - Certificado não configurado

**Exemplo de Uso:**
```typescript
const response = await fetch('/api/admin/certificate')
const data = await response.json()

switch (data.status) {
  case 'ok':
    console.log('✅ Certificado OK')
    break
  case 'warning':
    console.warn('⚠️ Certificado expira em breve:', data.certificate.warnings)
    break
  case 'error':
    console.error('❌ Erro no certificado:', data.error)
    break
  case 'not_configured':
    console.error('🔧 Certificado não configurado')
    console.log(data.instructions)
    break
}
```

---

## 🔍 Validação Automática

O sistema valida automaticamente:

1. ✅ Certificado configurado (variáveis de ambiente)
2. ✅ Certificado válido (não expirado)
3. ✅ Chave privada presente
4. ✅ Formato correto (PKCS#12 / .pfx)
5. ✅ Senha correta
6. ⚠️ Alerta se expira em até 30 dias
7. 🚨 Erro crítico se expira em até 7 dias

---

## 📊 Monitoramento

### Logs de Assinatura

Todos as assinaturas geram logs estruturados:

```
[Signature] ✅ PDF assinado com sucesso {
  certificateSubject: 'CN=LEONARDO PALHA, OAB=RJ123456',
  oab: 'RJ123456',
  expiresIn: '180 dias',
  pdfSize: '245678 bytes'
}
```

### Alertas de Expiração

O sistema emite alertas automáticos:

- **30 dias antes**: ⚠️ Warning nos logs
- **7 dias antes**: 🚨 Critical warning
- **Expirado**: ❌ Bloqueio de assinaturas

---

## 🛡️ Segurança

### Boas Práticas Implementadas

1. ✅ Certificado armazenado em variáveis de ambiente (nunca em código)
2. ✅ Base64 encoding para transporte seguro
3. ✅ Validação de senha antes de processar
4. ✅ Logs não expõem dados sensíveis
5. ✅ Chave privada nunca sai do servidor
6. ✅ Assinatura processada server-side apenas

### Avisos de Segurança

⚠️ **NUNCA**:
- Envie o .pfx por email não criptografado
- Commit o .pfx no Git
- Exponha a senha em logs
- Compartilhe o certificado com terceiros
- Use o mesmo certificado em múltiplos servidores

✅ **SEMPRE**:
- Mantenha backup do .pfx em local seguro
- Use senhas fortes (mín. 12 caracteres)
- Renove antes de expirar
- Monitore logs de uso
- Rotacione certificados anualmente

---

## 🧪 Testes

### Teste Manual via cURL

```bash
# 1. Verificar status do certificado
curl https://garcezpalha.com/api/documents/sign

# 2. Assinar um PDF de teste
curl -X POST https://garcezpalha.com/api/documents/sign \
  -F "file=@test.pdf" \
  -F "reason=Teste de Assinatura" \
  -o test_assinado.pdf

# 3. Verificar se o PDF foi gerado
ls -lh test_assinado.pdf
```

### Teste via Frontend

Exemplo de componente React:

```typescript
'use client'

import { useState } from 'react'

export function SignatureTest() {
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSign() {
    if (!file) return

    setLoading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('reason', 'Teste de Assinatura')

      const response = await fetch('/api/documents/sign', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const error = await response.json()
        alert(`Erro: ${error.message}`)
        return
      }

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'documento_assinado.pdf'
      a.click()
    } catch (error) {
      alert('Erro ao assinar documento')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <input
        type="file"
        accept=".pdf"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
      />
      <button onClick={handleSign} disabled={!file || loading}>
        {loading ? 'Assinando...' : 'Assinar PDF'}
      </button>
    </div>
  )
}
```

---

## 🔄 Integração com Outros Sistemas

### Assinatura Automática de Contratos

```typescript
import { signPDF } from '@/lib/signature/gov-br-signer'

async function generateAndSignContract(clientData: ClientData) {
  // 1. Gerar PDF do contrato
  const contractPdf = await generateContractPDF(clientData)

  // 2. Assinar automaticamente
  const result = await signPDF(contractPdf, {
    reason: 'Contrato de Prestação de Serviços Jurídicos',
    location: 'Rio de Janeiro, Brasil',
    contactInfo: 'contato@garcezpalha.com',
  })

  if (!result.success) {
    throw new Error(`Erro ao assinar: ${result.error}`)
  }

  // 3. Salvar no Supabase Storage
  const { data } = await supabase.storage
    .from('contracts')
    .upload(`${clientData.id}/contrato_assinado.pdf`, result.signedPdf!)

  return data.path
}
```

---

## ❓ Troubleshooting

### Erro: "Certificado digital não configurado"

**Solução:**
1. Verifique se as variáveis estão configuradas:
   ```bash
   vercel env ls
   ```
2. Se não estiverem, configure:
   ```bash
   vercel env add CERTIFICADO_DIGITAL_BASE64 production
   vercel env add CERTIFICADO_DIGITAL_SENHA production
   ```

### Erro: "Certificado expirado"

**Solução:**
1. Adquira novo certificado A1 (validade 1 ano)
2. Converta para base64 e reconfigure as variáveis
3. Faça redeploy

### Erro: "Senha incorreta"

**Solução:**
1. Verifique a senha do certificado
2. Reconfigure a variável:
   ```bash
   vercel env rm CERTIFICADO_DIGITAL_SENHA production
   vercel env add CERTIFICADO_DIGITAL_SENHA production
   ```

### Erro: "Chave privada não encontrada"

**Solução:**
1. O arquivo .pfx está corrompido ou incompleto
2. Exporte novamente do Windows Certificate Manager
3. OU solicite nova segunda via

---

## 📚 Referências

- [Documentação ICP-Brasil](https://www.gov.br/iti/pt-br/assuntos/icp-brasil)
- [GOV.BR Assinador](https://www.gov.br/governodigital/pt-br/assinador/)
- [Padrão PKCS#7](https://datatracker.ietf.org/doc/html/rfc2315)
- [Guia de Configuração de Certificado](./CONFIGURACAO_CERTIFICADO_DIGITAL.md)

---

**Criado em**: 30/12/2024
**Autor**: Sistema MANUS v7
**Status**: ✅ Pronto para produção (aguardando certificado A1)
