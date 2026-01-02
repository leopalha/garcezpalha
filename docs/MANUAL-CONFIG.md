# Configuração Manual do Sistema

Se o script automático travar, siga estes passos manuais:

## 1. Virtual Memory (48-64GB)

1. Pressione `Win + Pause` ou clique com botão direito em "Este Computador" → Propriedades
2. Clique em "Configurações avançadas do sistema" (à esquerda)
3. Na aba "Avançado", clique em "Configurações" em **Desempenho**
4. Vá para a aba "Avançado"
5. Em "Memória virtual", clique em "Alterar"
6. **Desmarque** "Gerenciar automaticamente o tamanho do arquivo de paginação"
7. Selecione a unidade **C:**
8. Selecione "Tamanho personalizado"
9. Digite:
   - **Tamanho inicial**: `49152` (48GB)
   - **Tamanho máximo**: `65536` (64GB)
10. Clique em "Definir"
11. Clique em "OK" em todas as janelas
12. **Reinicie o computador**

## 2. Power Plan (Ultimate Performance)

### Opção A - Via PowerShell (Admin):
```powershell
powercfg -duplicatescheme e9a42b02-d5df-448d-aa00-03f14749eb61
powercfg /l
# Copie o GUID do Ultimate Performance
powercfg /setactive [GUID_COPIADO]
```

### Opção B - Via Interface:
1. Abra "Painel de Controle"
2. Vá em "Hardware e Som" → "Opções de Energia"
3. Clique em "Mostrar planos adicionais"
4. Selecione "Alto desempenho" ou "Ultimate Performance"

## 3. Windows Defender (Exclusões)

Execute no PowerShell como Admin:

```powershell
Add-MpPreference -ExclusionPath "d:\garcezpalha\.next"
Add-MpPreference -ExclusionPath "d:\garcezpalha\node_modules"
Add-MpPreference -ExclusionPath "d:\garcezpalha\.swc"
Add-MpPreference -ExclusionPath "d:\garcezpalha\coverage"
Add-MpPreference -ExclusionPath "d:\garcezpalha\.vercel"
Add-MpPreference -ExclusionPath "d:\garcezpalha\.npm-cache"
Add-MpPreference -ExclusionPath "d:\garcezpalha\.yarn-cache"
```

## 4. npm Cache

Já configurado! Mas se precisar refazer:

```powershell
npm config set cache "d:\garcezpalha\.npm-cache"
npm config set prefer-offline true
```

## Verificar Configurações

```powershell
# Ver Virtual Memory atual
Get-WmiObject Win32_PageFileSetting | Select-Object Name, InitialSize, MaximumSize

# Ver Power Plan ativo
powercfg /getactivescheme

# Ver exclusões do Defender
Get-MpPreference | Select-Object -ExpandProperty ExclusionPath

# Ver config npm
npm config list
```
