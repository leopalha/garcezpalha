# 🤖 Agente Autônomo com Claude API

Agente simples que usa a API da Anthropic para executar tarefas autonomamente.

## 🚀 Como Usar

### 1. Instalar

```bash
cd agente-autonomo
npm install
```

### 2. Configurar API Key

```bash
# Copiar exemplo
cp .env.example .env

# Editar .env e adicionar sua chave
# ANTHROPIC_API_KEY=sk-ant-sua-chave-aqui
```

### 3. Executar Agente Simples

```bash
npm run start
```

### 4. Executar com Tarefa Customizada

```bash
node agente.js "Liste os arquivos do diretório atual"
node agente.js "Crie um arquivo hello.txt com 'Hello World'"
node agente.js "Verifique o status do git"
```

## 🛠️ Ferramentas Disponíveis

O agente pode usar 3 ferramentas:

1. **executar_comando** - Roda comandos bash/shell
2. **ler_arquivo** - Lê arquivos do sistema
3. **escrever_arquivo** - Escreve arquivos

## 📋 Como Funciona

```javascript
// 1. Você dá uma tarefa
agente("Crie um arquivo teste.txt")

// 2. Claude decide usar ferramentas
// Ele pede: escrever_arquivo("teste.txt", "conteúdo")

// 3. Você executa a ferramenta
executarFerramenta("escrever_arquivo", {...})

// 4. Retorna resultado para Claude
// "Arquivo escrito com sucesso"

// 5. Claude responde
// "Pronto! Criei o arquivo teste.txt"
```

## 🎯 Exemplos de Tarefas

### Exemplo 1: Verificar Git Status
```bash
node agente.js "Verifique o status do repositório git"
```

### Exemplo 2: Criar Arquivo com Data
```bash
node agente.js "Crie um arquivo data.txt com a data e hora atual"
```

### Exemplo 3: Ler e Modificar Arquivo
```bash
node agente.js "Leia o package.json e me diga quais são as dependências"
```

## 🔧 Personalizar Ferramentas

Para adicionar uma nova ferramenta, edite `agente.js`:

```javascript
// 1. Adicionar à lista de ferramentas
const ferramentas = [
  // ... ferramentas existentes
  {
    name: 'nova_ferramenta',
    description: 'Descrição do que ela faz',
    input_schema: {
      type: 'object',
      properties: {
        parametro: {
          type: 'string',
          description: 'Descrição do parâmetro',
        },
      },
      required: ['parametro'],
    },
  },
]

// 2. Implementar a execução
async function executarFerramenta(nome, parametros) {
  switch (nome) {
    case 'nova_ferramenta':
      // Sua lógica aqui
      return 'resultado'
  }
}
```

## 🌐 Executar Continuamente (Cron)

### No Windows (Task Scheduler):
1. Criar arquivo `rodar-agente.bat`:
```batch
@echo off
cd D:\garcezpalha\agente-autonomo
node agente.js "Tarefa automática"
```

2. Agendar no Task Scheduler para rodar a cada X horas

### No Linux (Crontab):
```bash
# Editar crontab
crontab -e

# Adicionar linha (executar a cada hora)
0 * * * * cd /caminho/agente-autonomo && node agente.js "Tarefa automática"
```

## ⚠️ Limitações

- Não roda 24/7 sozinho (precisa de cron ou similar)
- Gasta créditos da API a cada execução
- Máximo de 10 iterações por padrão (configurável)
- Ferramentas limitadas (você precisa implementar mais)

## 💰 Custos Estimados

**Claude 3.5 Sonnet:**
- Input: $3.00 / 1M tokens
- Output: $15.00 / 1M tokens

**Exemplo:**
- 1 tarefa simples ≈ 500 tokens input + 200 tokens output
- Custo: ~$0.005 por tarefa
- 1000 tarefas/mês ≈ $5

## 🆘 Troubleshooting

### "ANTHROPIC_API_KEY not found"
- Crie arquivo `.env` com sua chave
- Verifique que copiou do `.env.example`

### "Permission denied"
- No Windows: Execute cmd como Administrador
- No Linux: `chmod +x agente.js`

### "Maximum iterations reached"
- Aumente o limite: `agente(tarefa, 20)`
- Simplifique a tarefa

## 📚 Próximos Passos

1. **Adicionar mais ferramentas**
   - Buscar na web
   - Enviar emails
   - Acessar banco de dados

2. **Integrar com seu site**
   - API endpoint que roda o agente
   - Webhook para tarefas programadas

3. **Logging e monitoramento**
   - Salvar histórico de execuções
   - Alertas de erro

4. **Interface web**
   - Dashboard para ver o agente trabalhando
   - Controles de pausa/retomar
