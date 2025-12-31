# 🔐 Configuração de Certificado Digital e-OAB para Automação

## Objetivo
Configurar o certificado digital e-OAB em formato `.pfx` para uso com:
- Assinador GOV.BR (assinatura de documentos)
- PJe API (monitoramento de processos)

---

## PARTE 1: Exportar Certificado A3 (Token/Smartcard) para .PFX

### ⚠️ IMPORTANTE - Backup de Segurança
Seu certificado A3 (token USB ou smartcard) pode ser exportado UMA ÚNICA VEZ durante a instalação. Se você já instalou e não fez backup, precisará solicitar uma segunda via.

### Opção A: Se você AINDA NÃO instalou o certificado

#### 1. Instalar o certificado pela PRIMEIRA VEZ
1. Conecte seu token/smartcard no computador
2. Abra o **navegador** (Chrome, Edge, Firefox)
3. Acesse o site da sua **Autoridade Certificadora** (Serasa, Certisign, etc.)
4. Faça login na área do cliente
5. Localize a opção **"Instalar Certificado"** ou **"Primeira Instalação"**

#### 2. Durante a instalação - MARCAR A CAIXA IMPORTANTE:
```
⚠️ ATENÇÃO: Durante o processo de instalação, aparecerá uma tela perguntando:

☑️ "Marcar esta chave como exportável"
ou
☑️ "Permitir exportação da chave privada"

VOCÊ DEVE MARCAR ESTA OPÇÃO!
```

Sem marcar essa caixa, não será possível exportar o certificado depois.

#### 3. Após instalar, exportar imediatamente:

**No Windows:**
1. Pressione `Win + R`
2. Digite: `certmgr.msc` e pressione Enter
3. Navegue: `Pessoal` → `Certificados`
4. Encontre seu certificado e-OAB (nome: SEU NOME + OAB)
5. **Clique com botão direito** → `Todas as Tarefas` → `Exportar...`
6. Assistente de Exportação:
   - ✅ Marque: **"Sim, exportar a chave privada"**
   - Formato: **PKCS #12 (.PFX)**
   - ✅ Marque: **"Incluir todos os certificados no caminho"**
   - ✅ Marque: **"Exportar todas as propriedades estendidas"**
7. **CRIE UMA SENHA FORTE** (você precisará dela depois!)
8. Salve como: `e-oab-backup.pfx`

---

### Opção B: Se você JÁ instalou e NÃO marcou "exportável"

Você tem 3 alternativas:

#### Alternativa 1: Solicitar Segunda Via (RECOMENDADO)
1. Entre em contato com sua **Autoridade Certificadora**
2. Solicite uma **segunda via do certificado**
3. Custo: Geralmente 50-70% do valor original
4. Na nova instalação, LEMBRE DE MARCAR "exportável"!

#### Alternativa 2: Usar ferramentas de exportação forçada (⚠️ Avançado)
Ferramentas como **Jailbreak** podem tentar extrair a chave, mas:
- ⚠️ Risco de danificar o certificado
- ⚠️ Pode violar termos de uso
- ❌ Não recomendado

#### Alternativa 3: Usar diretamente o Token/Smartcard (Limitado)
- Manter o token conectado sempre que usar a automação
- ⚠️ Limita mobilidade
- ⚠️ Desgasta o token

---

### Opção C: Se você tem certificado A1 (arquivo)

Certificados A1 JÁ vêm em formato `.pfx`!

1. Localize o arquivo que você baixou ao comprar (geralmente `certificado.pfx` ou similar)
2. Você já tem a senha que criou na compra
3. ✅ Pode usar diretamente!

---

## PARTE 2: Testar o Certificado .PFX

### Verificar se o arquivo está OK:

**No Windows (PowerShell):**
```powershell
# Listar informações do certificado
certutil -dump "C:\caminho\para\e-oab-backup.pfx"

# Se pedir senha, digite a que você criou
# Deve mostrar: "Subject", "Issuer", "Valid from/to"
```

**Informações esperadas:**
- ✅ Nome: Seu nome completo
- ✅ OAB: Número da OAB/UF
- ✅ Validade: Data de expiração futura
- ✅ Tamanho: 2-5 KB (tipicamente)

---

## PARTE 3: Armazenar com Segurança

### ⚠️ CRÍTICO - Segurança do Arquivo .PFX

O arquivo `.pfx` contém sua **identidade digital completa**. Trate-o como:
- 🔑 Senha do banco
- 🆔 RG/CPF digital
- ✍️ Sua assinatura original

### Regras de Ouro:

1. **NUNCA** envie por email não criptografado
2. **NUNCA** faça upload para nuvem pública (Google Drive, Dropbox pessoal)
3. **SEMPRE** use senha forte (mín. 12 caracteres)
4. **Backup em 2 locais seguros**:
   - Pendrive criptografado (guardado em local seguro)
   - HD externo com criptografia

### Para desenvolvimento/produção:

```bash
# Opção 1: Variável de ambiente Vercel (Base64)
# Converte o .pfx para base64
certutil -encode e-oab-backup.pfx e-oab-base64.txt

# No Linux/Mac:
base64 e-oab-backup.pfx > e-oab-base64.txt

# Copie TODO o conteúdo de e-oab-base64.txt
# Configure no Vercel:
cat e-oab-base64.txt | vercel env add CERTIFICADO_DIGITAL_BASE64 production

# Configure a senha separadamente:
echo "SUA_SENHA_DO_PFX" | vercel env add CERTIFICADO_DIGITAL_SENHA production
```

---

## PARTE 4: Usar com Assinador GOV.BR via API

### Biblioteca Node.js para assinar PDFs:

```typescript
// src/lib/signature/gov-br-signer.ts
import { readFileSync } from 'fs'
import forge from 'node-forge'

interface SignatureConfig {
  certificadoBase64: string
  senha: string
}

export async function assinarPDF(
  pdfBuffer: Buffer,
  config: SignatureConfig
): Promise<Buffer> {
  // 1. Decodificar certificado
  const pfxBase64 = config.certificadoBase64
  const pfxDer = Buffer.from(pfxBase64, 'base64')

  // 2. Carregar certificado
  const p12Asn1 = forge.asn1.fromDer(pfxDer.toString('binary'))
  const p12 = forge.pkcs12.pkcs12FromAsn1(p12Asn1, config.senha)

  // 3. Extrair chave privada e certificado
  const bags = p12.getBags({ bagType: forge.pki.oids.certBag })
  const certBag = bags[forge.pki.oids.certBag]![0]
  const certificate = certBag.cert!

  const keyBags = p12.getBags({ bagType: forge.pki.oids.pkcs8ShroudedKeyBag })
  const keyBag = keyBags[forge.pki.oids.pkcs8ShroudedKeyBag]![0]
  const privateKey = keyBag.key!

  // 4. Assinar PDF (usando biblioteca de assinatura PDF)
  // Exemplo: pdf-lib ou similar
  const signedPdf = await signPdfWithCertificate(
    pdfBuffer,
    certificate,
    privateKey
  )

  return signedPdf
}
```

---

## PARTE 5: Alternativa Simples - Integração com Assinador GOV.BR Web

Se não quiser fazer assinatura programática, você pode:

1. **Usar API do GOV.BR** (quando disponível)
2. **Usar bibliotecas de terceiros**:
   - [docassemble](https://docassemble.org/) (Python)
   - [SignServer](https://www.signserver.org/) (Java)
   - [pdf-signer](https://github.com/vbuch/node-signpdf) (Node.js)

---

## 📚 Próximos Passos

Depois de ter o `.pfx` configurado:

1. ✅ Testar assinatura local
2. ✅ Configurar variáveis de ambiente no Vercel
3. ✅ Implementar endpoint `/api/documents/sign`
4. ✅ Integrar com workflow de contratos

---

## 🆘 Problemas Comuns

### "Não consigo exportar a chave privada"
- **Causa**: Certificado instalado sem marcar "exportável"
- **Solução**: Solicitar segunda via

### "Senha incorreta ao tentar usar .pfx"
- **Causa**: Senha digitada errada ou corrompida
- **Solução**: Tentar resetar ou exportar novamente

### "Certificado expirado"
- **Causa**: Validade vencida (A1: 1 ano, A3: 1-3 anos)
- **Solução**: Renovar certificado

---

**Criado em**: 30/12/2024
**Atualizado**: 30/12/2024
**Autor**: Claude via garcezpalha.com
