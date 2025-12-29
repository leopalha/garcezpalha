# 🤖 MANUS Autonomous Agent

Agente autônomo que segue os protocolos do Claude Code para trabalhar continuamente em tasks.md.

## 🎯 O Que Ele Faz

O Manus Agent é um trabalhador autônomo que:

1. **Lê tasks.md** - Identifica tarefas pendentes
2. **Executa tarefas** - Uma por vez, com qualidade
3. **Atualiza status** - Marca progresso em tempo real
4. **Planeja futuro** - Adiciona novas tarefas ao concluir
5. **Trabalha continuamente** - Loop infinito até você parar

## 🚀 Como Usar

### Modo 1: Execução Única (Teste)

```bash
cd agente-autonomo
node manus-agent.js test
```

Executa um ciclo completo e para. Bom para testar.

### Modo 2: Trabalho Contínuo (Produção)

```bash
node manus-agent.js
# ou
node manus-agent.js continuous
```

Trabalha continuamente até você parar (Ctrl+C).

### Modo 3: Background (Windows)

```batch
@echo off
cd D:\garcezpalha\agente-autonomo
start /B node manus-agent.js > logs.txt 2>&1
```

Salve como `start-manus.bat` e execute.

### Modo 4: Background (Linux/Mac)

```bash
cd agente-autonomo
nohup node manus-agent.js > logs.txt 2>&1 &
```

## 📋 tasks.md - Formato

O agente entende este formato:

```markdown
# Tarefas

## ⚡ Tarefas Urgentes
[ ] Tarefa urgente 1
[ ] Tarefa urgente 2

## 📝 Tarefas Pendentes
[ ] Tarefa pendente 1
[ ] Tarefa pendente 2

## 🔄 Em Progresso
[~] Tarefa em andamento

## ✅ Concluídas
[x] Tarefa concluída

## 🚫 Bloqueadas
[!] Tarefa bloqueada - Motivo: falta de acesso
```

**Legenda:**
- `[ ]` = Pendente
- `[~]` = Em progresso
- `[x]` = Concluída
- `[!]` = Bloqueada

## 🔧 Ferramentas Disponíveis

O agente tem acesso a:

### 1. bash(comando)
Executa comandos no terminal.

**Exemplos:**
- `git status`
- `npm run build`
- `git add . && git commit -m "feat: nova feature"`

### 2. read_file(caminho)
Lê arquivos do projeto.

**Exemplos:**
- `read_file("src/app/page.tsx")`
- `read_file("package.json")`
- `read_file("tasks.md")`

### 3. write_file(caminho, conteudo)
Escreve/modifica arquivos.

**Exemplos:**
- `write_file("src/utils/helper.ts", codigo)`
- `write_file("README.md", documentacao)`

### 4. update_tasks(conteudo)
Atualiza tasks.md.

**Exemplo:**
```javascript
update_tasks(`
# Tarefas
## ✅ Concluídas
[x] Implementar feature X
`)
```

### 5. list_files(diretorio)
Lista arquivos em um diretório.

**Exemplo:**
- `list_files("src/components")`

## 🧠 Protocolo Manus

O agente segue estes princípios:

### 1. Trabalho Incremental
- Uma tarefa por vez
- Commits frequentes
- Testes antes de avançar

### 2. Qualidade
- Lê código antes de modificar
- Mantém padrões do projeto
- Documenta quando necessário

### 3. Segurança
- NUNCA commita secrets
- Verifica .gitignore
- Usa .env para credenciais

### 4. Comunicação
- Explica o que está fazendo
- Reporta problemas
- Atualiza tasks.md constantemente

### 5. Planejamento
- Analisa projeto após concluir tarefas
- Identifica melhorias
- Adiciona novas tarefas
- Nunca fica ocioso

## 📊 Monitoramento

### Ver Logs em Tempo Real

```bash
# Se rodando em background
tail -f logs.txt
```

### Verificar tasks.md

```bash
cat ../tasks.md
```

### Parar o Agente

```bash
# Se rodando em foreground
Ctrl+C

# Se rodando em background (Linux/Mac)
ps aux | grep manus-agent
kill [PID]

# Se rodando em background (Windows)
tasklist | findstr node
taskkill /PID [PID] /F
```

## ⚙️ Configuração

### Intervalo entre Ciclos

Edite `manus-agent.js`:

```javascript
const CYCLE_INTERVAL_MINUTES = 5 // Altere aqui
```

### Limite de Iterações por Ciclo

```javascript
const MAX_ITERATIONS = 50 // Altere aqui
```

### Modelo do Claude

```javascript
model: 'claude-3-5-sonnet-20241022', // Altere aqui
// Opções: claude-3-5-sonnet-20241022, claude-3-opus-20240229
```

## 💰 Custos Estimados

**Claude 3.5 Sonnet:**
- Input: $3.00 / 1M tokens
- Output: $15.00 / 1M tokens

**Cenário Típico:**
- 1 ciclo completo ≈ 10.000 tokens (input + output)
- Custo por ciclo ≈ $0.10
- 10 ciclos/dia ≈ $1.00/dia
- Mês (300 ciclos) ≈ $30.00

**Otimização:**
- Use `test` mode para experimentos
- Ajuste `CYCLE_INTERVAL_MINUTES` para espaçar mais
- Use modelo mais barato se necessário

## 🎯 Exemplos de Tarefas

### Exemplo 1: Adicionar Feature

Em `tasks.md`:
```markdown
[ ] Adicionar botão de logout no header
```

O agente vai:
1. Ler tasks.md
2. Marcar como [~] em progresso
3. Ler src/components/Header.tsx
4. Adicionar botão de logout
5. Testar build
6. Marcar como [x] concluída
7. Commitar mudanças

### Exemplo 2: Corrigir Bug

```markdown
[ ] Corrigir erro de autenticação no login
```

O agente vai:
1. Investigar código de autenticação
2. Identificar o problema
3. Implementar correção
4. Testar
5. Commitar com mensagem "fix: corrigir erro de autenticação"

### Exemplo 3: Otimização

```markdown
[ ] Otimizar performance do bundle Next.js
```

O agente vai:
1. Analisar tamanho do bundle
2. Identificar dependências grandes
3. Implementar code splitting
4. Verificar melhoria
5. Documentar resultados

## 🚨 Troubleshooting

### Agente não inicia

**Erro:** `ANTHROPIC_API_KEY not found`
```bash
# Verificar .env
cat .env
# Deve ter: ANTHROPIC_API_KEY=sk-ant-...
```

### Agente não encontra tasks.md

```bash
# Criar manualmente
touch ../tasks.md

# Ou deixar o agente criar automaticamente
node manus-agent.js test
```

### Agente fica em loop infinito

- Verifique se há tarefas válidas em tasks.md
- Reduza `MAX_ITERATIONS`
- Use modo `test` para debug

### Erros de permissão

```bash
# Linux/Mac
chmod +x manus-agent.js

# Windows
# Execute cmd como Administrador
```

## 📈 Melhorias Futuras

Recursos planejados:

- [ ] Interface web para monitorar
- [ ] Webhooks para notificações
- [ ] Integração com GitHub Issues
- [ ] Sistema de priorização inteligente
- [ ] Métricas de produtividade
- [ ] Multi-projeto (vários tasks.md)

## 🤝 Contribuir

Para adicionar novas ferramentas:

1. Adicione à lista `tools`:
```javascript
{
  name: 'nova_ferramenta',
  description: 'O que ela faz',
  input_schema: { /* schema */ }
}
```

2. Implemente em `executeTool()`:
```javascript
case 'nova_ferramenta':
  // Sua lógica
  return resultado
```

3. Documente no system prompt

## 📝 Licença

MIT - Use livremente!

---

**Desenvolvido com Claude Code (Manus Protocol)**
**Versão**: 1.0.0
**Última atualização**: ${new Date().toLocaleString('pt-BR')}
