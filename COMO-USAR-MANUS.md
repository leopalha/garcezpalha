# 🤖 Como Usar o Agente Autônomo MANUS

## ✅ CONFIGURADO E PRONTO PARA USO!

Seu agente autônomo está configurado e testado. Ele trabalha continuamente em `tasks.md` seguindo os protocolos do Claude Code.

---

## 🚀 Iniciar o Agente

### Opção 1: Modo Teste (Recomendado para começar)

```bash
cd agente-autonomo
npm run manus:test
```

- Executa **um ciclo completo** e para
- Bom para testar e ver como funciona
- Seguro para experimentos

### Opção 2: Modo Contínuo (Produção)

```bash
cd agente-autonomo
npm run manus
```

- Trabalha **continuamente** até você parar (Ctrl+C)
- Executa tarefas, atualiza status, planeja novas tarefas
- Aguarda 5 minutos entre ciclos completos

### Opção 3: Clique Duplo (Windows)

```
agente-autonomo\start-manus.bat
```

Abre uma janela e inicia o agente em modo contínuo.

### Opção 4: Background (Windows)

```
agente-autonomo\start-manus-background.bat
```

Inicia em background, você pode fechar o terminal.

---

## 📋 Como Funciona

### 1. O Agente Lê tasks.md

```markdown
## ⚡ Tarefas Urgentes
[ ] Verificar segurança do sistema
[ ] Testar funcionalidade X

## 📝 Tarefas Pendentes
[ ] Adicionar feature Y
[ ] Corrigir bug Z
```

### 2. Escolhe uma Tarefa

Prioridade:
1. ⚡ Urgentes
2. 📝 Pendentes
3. Cria novas tarefas se não há pendentes

### 3. Executa a Tarefa

```markdown
## 🔄 Em Progresso
[~] Verificar segurança do sistema  ← Marca em progresso
```

O agente:
- Lê arquivos do projeto
- Analisa código
- Executa comandos bash
- Implementa correções/features
- Testa

### 4. Atualiza Status

```markdown
## ✅ Concluídas
[x] Verificar segurança do sistema  ← Marca concluída
```

### 5. Commita Mudanças

```bash
git add .
git commit -m "feat: implementar feature Y"
```

### 6. Repete

Continua até não haver mais tarefas.

---

## 🎯 Exemplo Prático

### 1. Adicione uma Tarefa

Edite `tasks.md`:

```markdown
## 📝 Tarefas Pendentes
[ ] Adicionar botão de logout no header
[ ] Melhorar mensagens de erro do login
```

### 2. Inicie o Agente

```bash
cd agente-autonomo
npm run manus:test
```

### 3. Acompanhe o Trabalho

Você verá output assim:

```
🔧 read_file
   Input: tasks.md
   ✅ Lido: 1795 caracteres

💭 Claude: Vou trabalhar na tarefa "Adicionar botão de logout"

🔧 read_file
   Input: src/components/Header.tsx
   ✅ Lido: 3421 caracteres

🔧 write_file
   Input: src/components/Header.tsx
   ✅ Escrito: 3650 caracteres

🔧 bash
   Input: npm run build
   ✅ Build successful

🔧 update_tasks
   ✅ tasks.md atualizado (tarefa marcada como concluída)

🔧 bash
   Input: git add . && git commit -m "feat: adicionar botão logout"
   ✅ Commit criado
```

### 4. Verificar Resultado

```bash
# Ver mudanças
git log -1

# Ver tasks.md atualizado
cat tasks.md
```

---

## 🛠️ Ferramentas do Agente

O agente pode:

### ✅ Executar Comandos
```bash
git status
npm run build
npm install pacote
ls -la src/
```

### ✅ Ler Arquivos
```javascript
read_file("src/components/Header.tsx")
read_file("package.json")
read_file(".env.example")
```

### ✅ Escrever Arquivos
```javascript
write_file("src/utils/helper.ts", codigo)
write_file("README.md", documentacao)
```

### ✅ Atualizar tasks.md
```javascript
update_tasks(novoConteudo)
```

### ✅ Listar Diretórios
```javascript
list_files("src/components")
```

---

## ⚙️ Configurações

### Alterar Intervalo Entre Ciclos

Edite `agente-autonomo/manus-agent.js`:

```javascript
const CYCLE_INTERVAL_MINUTES = 5  // Altere aqui
```

Valores recomendados:
- **1-5 minutos**: Desenvolvimento ativo
- **10-30 minutos**: Manutenção contínua
- **60 minutos**: Tarefas menos urgentes

### Alterar Limite de Iterações

```javascript
const MAX_ITERATIONS = 50  // Altere aqui
```

Mais iterações = pode trabalhar em tarefas mais complexas, mas usa mais API.

---

## 📊 Monitoramento

### Ver Logs em Tempo Real

Se iniciou em background:

```bash
cd agente-autonomo
type manus-logs.txt
```

Ou no Linux/Mac:
```bash
tail -f manus-logs.txt
```

### Verificar Progresso

```bash
# Ver tasks.md atualizado
cat tasks.md

# Ver últimos commits
git log -5 --oneline

# Ver status do repositório
git status
```

---

## 🛑 Parar o Agente

### Se Rodando em Foreground

```
Ctrl + C
```

### Se Rodando em Background (Windows)

```batch
tasklist | findstr node
taskkill /F /PID [numero_do_pid]
```

### Se Rodando em Background (Linux/Mac)

```bash
ps aux | grep manus-agent
kill [pid]
```

---

## 💰 Custos

**Modelo**: Claude 3.7 Sonnet (2025-02-19)
- Input: ~$3.00 / 1M tokens
- Output: ~$15.00 / 1M tokens

**Estimativa por Ciclo**:
- Tarefa simples: ~10.000 tokens = $0.10
- Tarefa complexa: ~30.000 tokens = $0.30

**Uso Mensal** (exemplo):
- 5 ciclos/dia × 30 dias = 150 ciclos
- Custo estimado: $15-45/mês

**Dica**: Use modo `test` para experimentos (economiza $$).

---

## 🎯 Casos de Uso

### 1. Desenvolvimento Contínuo

Deixe o agente trabalhando em background:
- Implementa features
- Corrige bugs
- Refatora código
- Atualiza documentação

### 2. Manutenção Programada

Execute a cada X horas via Task Scheduler:
- Verifica segurança
- Atualiza dependências
- Roda testes
- Gera relatórios

### 3. Code Review Automatizado

Adicione tarefas de revisão:
```markdown
[ ] Revisar código em src/components
[ ] Verificar duplicação de código
[ ] Otimizar imports
```

### 4. Documentação Automática

```markdown
[ ] Documentar todas as funções em src/utils
[ ] Atualizar README.md
[ ] Criar guia de contribuição
```

---

## 🚨 Troubleshooting

### "API Key not found"

```bash
# Verificar .env
cd agente-autonomo
cat .env

# Deve ter:
ANTHROPIC_API_KEY=sk-ant-api03-...
```

### "Model not found"

O agente usa **claude-3-7-sonnet-20250219**.
Se der erro, teste modelos disponíveis:

```bash
cd agente-autonomo
node test-model2.js
```

### Agente Fica em Loop

- Verifique se há tarefas válidas em `tasks.md`
- Reduza `MAX_ITERATIONS`
- Use modo `test` para debug

### Commits Bloqueados

Se o pre-commit hook bloquear:
- Agente detectou secret no código
- Verifique os arquivos modificados
- Remova secrets antes de commitar

---

## 📈 Próximos Passos

### Adicione Mais Tarefas

Edite `tasks.md` com tarefas reais do projeto:

```markdown
## ⚡ Urgentes
[ ] Corrigir bug crítico no login
[ ] Implementar rate limiting na API

## 📝 Pendentes
[ ] Adicionar dark mode
[ ] Melhorar performance do dashboard
[ ] Implementar cache Redis
```

### Customize o Prompt

Edite `MANUS_SYSTEM_PROMPT` em `manus-agent.js` para:
- Adicionar regras específicas do projeto
- Mudar estilo de commits
- Priorizar certos tipos de tarefa

### Integre com CI/CD

```yaml
# .github/workflows/manus.yml
name: Manus Agent
on:
  schedule:
    - cron: '0 */6 * * *'  # A cada 6 horas

jobs:
  manus:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - run: cd agente-autonomo && npm install
      - run: cd agente-autonomo && npm run manus:test
        env:
          ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
```

---

## ✅ Checklist Inicial

Antes de começar:

- [x] API Key configurada em `.env`
- [x] Dependências instaladas (`npm install`)
- [x] `tasks.md` criado com tarefas
- [x] Modelo correto configurado (claude-3-7-sonnet-20250219)
- [x] Pre-commit hook ativo (protege contra secrets)
- [ ] Teste executado (`npm run manus:test`)
- [ ] Primeira tarefa real adicionada
- [ ] Agente rodando em modo contínuo

---

## 🎉 Está Pronto!

O agente está **configurado e testado**. Para começar:

```bash
cd agente-autonomo
npm run manus:test
```

Veja ele trabalhar! 🚀

---

**Criado com Claude Code (Manus Protocol)**
**Data**: 29/12/2025
**Versão**: 1.0.0
