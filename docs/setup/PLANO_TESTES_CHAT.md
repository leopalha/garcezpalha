# PLANO COMPLETO DE TESTES - SISTEMA DE CHAT
## Garcez Palha Platform - Chat Testing Strategy

Data: 2025-01-06
Responsável: Claude Code
Status: PLANEJAMENTO

---

## 📋 ÍNDICE

1. [Componentes a Testar](#componentes-a-testar)
2. [Testes de Funcionalidade](#testes-de-funcionalidade)
3. [Testes de Integração](#testes-de-integração)
4. [Testes de Performance](#testes-de-performance)
5. [Testes de Erro](#testes-de-erro)
6. [Testes de UX](#testes-de-ux)
7. [Checklist Final](#checklist-final)

---

## 1. COMPONENTES A TESTAR

### 1.1 ChatAssistant.tsx
- [ ] Envio de mensagens de texto
- [ ] Recebimento de respostas do assistente
- [ ] Gravação de áudio
- [ ] Transcrição de áudio
- [ ] Reprodução de TTS
- [ ] Anexo de arquivos (imagens, PDFs, docs)
- [ ] Botão limpar chat
- [ ] Abertura/fechamento do chat
- [ ] Auto-open com delay
- [ ] Modo vídeo (switch para RealtimeVoiceAssistant)
- [ ] Histórico de mensagens
- [ ] Timestamps das mensagens
- [ ] Preview de anexos

### 1.2 VoicePlayer.tsx
- [ ] Play/Pause
- [ ] Controle de velocidade (1x, 1.5x, 2x)
- [ ] Botão mute/unmute
- [ ] Waveform animation durante reprodução
- [ ] 6 opções de voz (alloy, echo, fable, onyx, nova, shimmer)
- [ ] Auto-play opcional
- [ ] Tratamento de erro de reprodução
- [ ] Indicador visual de loading

### 1.3 AudioRecorder.tsx
- [ ] Permissão de microfone
- [ ] Iniciar gravação
- [ ] Timer durante gravação
- [ ] Parar gravação
- [ ] Transcrição automática
- [ ] Feedback visual (ícone pulsando)
- [ ] Tratamento de erro de permissão
- [ ] Qualidade de áudio (44.1kHz, noise suppression)

### 1.4 RealtimeVoiceAssistant.tsx
- [ ] Modo Audio Pure (waveform)
- [ ] Modo Avatar Visual (D-ID)
- [ ] Seletor de modo inicial
- [ ] Conexão OpenAI Realtime API
- [ ] Conexão D-ID Avatar
- [ ] Transcrição em tempo real (user + assistant)
- [ ] Sincronização de áudio/vídeo
- [ ] Histórico de conversação
- [ ] Botão encerrar conversa
- [ ] Tratamento de desconexão

### 1.5 FloatingContactHub.tsx
- [ ] Botão flutuante visível
- [ ] Animação de pulse
- [ ] Menu expansível
- [ ] Opção "Chat com IA" funcional
- [ ] Opção "WhatsApp" funcional
- [ ] Fechar menu ao selecionar
- [ ] Posição fixa na tela

### 1.6 EnhancedChatAssistant.tsx
- [ ] Todas as funcionalidades do ChatAssistant
- [ ] Painel ChatSettings
- [ ] Integração com State Machine (opcional)
- [ ] Display de estado do agente
- [ ] Persistência de conversationId

### 1.7 AgentFlowChatWidget.tsx
- [ ] 17 estados do fluxo
- [ ] Barra de progresso de qualificação
- [ ] Badges de estado (cores corretas)
- [ ] Auto-escalação (casos complexos)
- [ ] Tracking de canal (website, WhatsApp, etc.)
- [ ] Callbacks (onConversationStart, onQualificationComplete)
- [ ] Persistência no Supabase

### 1.8 ChatSettings.tsx
- [ ] Seleção de voz (6 opções)
- [ ] Slider de velocidade (0.5x - 2.0x)
- [ ] Toggle auto-play
- [ ] Toggle microfone
- [ ] Toggle notificações
- [ ] Toggle sound effects
- [ ] Persistência em localStorage
- [ ] Botão reset to defaults

---

## 2. TESTES DE FUNCIONALIDADE

### 2.1 Envio de Mensagens de Texto

#### Teste 1: Mensagem simples
- **Ação**: Digitar "Olá" e enviar
- **Esperado**:
  - Mensagem aparece no chat do usuário
  - Loading indicator durante processamento
  - Resposta do assistente em 3-5s
  - VoicePlayer aparece abaixo da resposta
- **Verificar**:
  - [ ] Mensagem enviada corretamente
  - [ ] Loading aparece
  - [ ] Resposta recebida
  - [ ] TTS disponível

#### Teste 2: Mensagem longa (500+ caracteres)
- **Ação**: Enviar parágrafo extenso
- **Esperado**:
  - Texto quebra corretamente (whitespace-pre-wrap)
  - Resposta adequada ao contexto
- **Verificar**:
  - [ ] Formatação correta
  - [ ] Resposta relevante

#### Teste 3: Mensagens rápidas (spam)
- **Ação**: Enviar 5 mensagens em 2 segundos
- **Esperado**:
  - Todas as mensagens são enfileiradas
  - Respostas chegam em ordem
  - Sem travamento da UI
- **Verificar**:
  - [ ] Ordem mantida
  - [ ] UI responsiva

#### Teste 4: Caracteres especiais
- **Ação**: Enviar: `!@#$%^&*()_+{}[]|:;"'<>,.?/~\``
- **Esperado**:
  - Caracteres renderizados corretamente
  - Sem XSS ou injection
- **Verificar**:
  - [ ] Renderização segura
  - [ ] Sem erros de console

#### Teste 5: Emoji e Unicode
- **Ação**: Enviar: "😀🎉👍 Olá 你好 مرحبا"
- **Esperado**: Renderização correta de todos os caracteres
- **Verificar**:
  - [ ] Emojis exibidos
  - [ ] Unicode exibido

### 2.2 Gravação e Transcrição de Áudio

#### Teste 6: Gravação básica
- **Pré-requisito**: Fechar TODAS as abas com áudio/vídeo
- **Ação**:
  1. Clicar no ícone de microfone
  2. Falar: "Preciso de ajuda com um problema jurídico"
  3. Parar gravação
- **Esperado**:
  - Permissão de microfone solicitada (primeira vez)
  - Timer inicia (00:01, 00:02, ...)
  - Ícone muda para "Stop"
  - Após parar: loading de transcrição
  - Texto transcrito aparece no input
  - Transcrição correta (sem "Para mais vídeos...")
- **Verificar**:
  - [ ] Permissão solicitada
  - [ ] Timer funcional
  - [ ] Transcrição correta
  - [ ] Texto inserido no input

#### Teste 7: Gravação longa (60s+)
- **Ação**: Gravar por 60 segundos
- **Esperado**:
  - Timer continua (01:00, 01:01, ...)
  - Transcrição completa ao final
  - Sem perda de áudio
- **Verificar**:
  - [ ] Timer não trava
  - [ ] Transcrição completa
  - [ ] Qualidade mantida

#### Teste 8: Cancelar gravação
- **Ação**: Iniciar gravação → fechar chat antes de parar
- **Esperado**:
  - Gravação é interrompida
  - Microfone é liberado
  - Sem vazamento de recursos
- **Verificar**:
  - [ ] Microfone desligado
  - [ ] Sem erros

#### Teste 9: Gravação sem permissão
- **Ação**: Bloquear microfone → tentar gravar
- **Esperado**: Mensagem de erro clara: "Permissão de microfone negada"
- **Verificar**:
  - [ ] Erro exibido
  - [ ] UI não trava

#### Teste 10: Ruído de fundo
- **Ação**: Gravar com música/vídeo tocando em outra aba
- **Esperado**: Whisper transcreve áudio do sistema (problema conhecido)
- **Verificar**:
  - [ ] Transcrição detecta áudio de fundo
  - [ ] Usuário informado para fechar mídias

#### Teste 11: Áudio vazio (silêncio)
- **Ação**: Gravar 3s sem falar nada
- **Esperado**:
  - Erro: "Nenhum áudio detectado. Fale mais alto..."
  - Blob size > 0 mas transcrição vazia
- **Verificar**:
  - [ ] Erro específico
  - [ ] Não envia mensagem vazia

### 2.3 Reprodução de TTS

#### Teste 12: Reprodução básica
- **Ação**: Enviar mensagem → aguardar resposta
- **Esperado**:
  - VoicePlayer aparece abaixo da resposta
  - Botão Play disponível
  - Clicar Play → áudio reproduz
- **Verificar**:
  - [ ] Player renderizado
  - [ ] Áudio reproduz corretamente
  - [ ] Sincronização com texto

#### Teste 13: Controle de velocidade
- **Ação**:
  1. Clicar Play
  2. Clicar no botão "1x"
  3. Verificar mudança para "1.5x"
  4. Clicar novamente → "2x"
  5. Clicar novamente → volta para "1x"
- **Esperado**:
  - Velocidade muda em tempo real
  - Áudio acelera/desacelera sem interrupção
  - Indicador visual atualiza
- **Verificar**:
  - [ ] Ciclo 1x → 1.5x → 2x → 1x
  - [ ] Áudio aplica velocidade
  - [ ] Visual feedback claro

#### Teste 14: Múltiplos players
- **Ação**: Enviar 3 mensagens seguidas
- **Esperado**:
  - 3 VoicePlayers renderizados
  - Clicar Play no segundo → só ele toca
  - Players independentes
- **Verificar**:
  - [ ] Múltiplos players funcionam
  - [ ] Independência entre eles

#### Teste 15: Mute durante reprodução
- **Ação**:
  1. Iniciar reprodução
  2. Clicar botão Mute
  3. Desclicar Mute
- **Esperado**:
  - Áudio silencia instantaneamente
  - Waveform continua animando
  - Áudio retorna ao desclicar
- **Verificar**:
  - [ ] Mute funcional
  - [ ] Waveform continua
  - [ ] Unmute restaura volume

#### Teste 16: Pause e resume
- **Ação**:
  1. Iniciar reprodução
  2. Pausar no meio
  3. Aguardar 5s
  4. Retomar
- **Esperado**:
  - Áudio pausa exatamente onde estava
  - Resume do ponto pausado
  - Sem pular partes
- **Verificar**:
  - [ ] Pausa precisa
  - [ ] Resume correto

#### Teste 17: Erro de TTS
- **Ação**: Desativar OpenAI API temporariamente
- **Esperado**: Mensagem de erro no player
- **Verificar**:
  - [ ] Erro tratado gracefully
  - [ ] Mensagem clara ao usuário

### 2.4 Anexo de Arquivos

#### Teste 18: Anexar imagem (PNG)
- **Ação**: Clicar clip → selecionar imagem.png (< 5MB)
- **Esperado**:
  - Preview da imagem aparece
  - Thumbnail renderizado
  - Ícone de remoção disponível
  - Ao enviar: imagem incluída na mensagem
- **Verificar**:
  - [ ] Preview correto
  - [ ] Envio bem-sucedido
  - [ ] Ícone de remoção funciona

#### Teste 19: Anexar PDF
- **Ação**: Anexar documento.pdf
- **Esperado**:
  - Ícone de PDF exibido
  - Nome do arquivo visível
  - Envio funcional
- **Verificar**:
  - [ ] Ícone correto
  - [ ] Nome exibido
  - [ ] Envio OK

#### Teste 20: Múltiplos anexos (até 20)
- **Ação**: Anexar 20 arquivos (mix de imagens e PDFs)
- **Esperado**:
  - Todos os previews renderizados
  - Scroll se necessário
  - Limite de 20 respeitado
- **Verificar**:
  - [ ] 20 anexos aceitos
  - [ ] 21º anexo rejeitado

#### Teste 21: Arquivo muito grande (> 10MB)
- **Ação**: Tentar anexar arquivo de 15MB
- **Esperado**: Erro: "Arquivo muito grande (máx 10MB)"
- **Verificar**:
  - [ ] Validação de tamanho
  - [ ] Mensagem de erro clara

#### Teste 22: Tipo de arquivo inválido (.exe)
- **Ação**: Tentar anexar executável.exe
- **Esperado**: Rejeitado (apenas imagens, PDFs, docs permitidos)
- **Verificar**:
  - [ ] Validação de tipo
  - [ ] Erro informativo

#### Teste 23: Remover anexo
- **Ação**: Anexar 3 arquivos → remover o do meio
- **Esperado**:
  - Arquivo removido da lista
  - Outros permanecem
  - Envio só inclui restantes
- **Verificar**:
  - [ ] Remoção funcional
  - [ ] Outros mantidos

### 2.5 Botão Limpar Chat

#### Teste 24: Limpar chat vazio
- **Ação**: Abrir chat limpo → clicar botão lixeira
- **Esperado**: Confirmação aparece mesmo vazio
- **Verificar**:
  - [ ] Confirmação exibida

#### Teste 25: Limpar chat com mensagens
- **Ação**:
  1. Enviar 5 mensagens
  2. Clicar lixeira
  3. Confirmar
- **Esperado**:
  - Popup: "Limpar todas as mensagens?"
  - Ao confirmar: todas as mensagens removidas
  - Array vazio
- **Verificar**:
  - [ ] Confirmação funciona
  - [ ] Mensagens limpas
  - [ ] UI limpa

#### Teste 26: Cancelar limpeza
- **Ação**: Clicar lixeira → Cancelar
- **Esperado**: Mensagens permanecem
- **Verificar**:
  - [ ] Cancelamento funcional
  - [ ] Mensagens mantidas

### 2.6 Histórico e Persistência

#### Teste 27: Histórico de conversação
- **Ação**:
  1. Enviar 10 mensagens
  2. Scroll para cima
  3. Verificar mensagens antigas
- **Esperado**:
  - Scroll suave
  - Mensagens antigas visíveis
  - Timestamps corretos
- **Verificar**:
  - [ ] Scroll funcional
  - [ ] Histórico completo
  - [ ] Timestamps precisos

#### Teste 28: Fechar e reabrir chat
- **Ação**:
  1. Enviar 3 mensagens
  2. Fechar chat
  3. Reabrir
- **Esperado**:
  - Mensagens mantidas (se em memória)
  - OU limpas (se não houver persistência)
- **Verificar**:
  - [ ] Comportamento consistente

#### Teste 29: Reload da página
- **Ação**:
  1. Enviar mensagens
  2. F5 (reload)
  3. Reabrir chat
- **Esperado**: Mensagens perdidas (sem persistência em localStorage)
- **Verificar**:
  - [ ] Comportamento esperado

---

## 3. TESTES DE INTEGRAÇÃO

### 3.1 API /api/chat/assistant

#### Teste 30: productId genérico
- **Request**: `POST /api/chat/assistant { productId: "geral", message: "Olá" }`
- **Esperado**:
  - 200 OK
  - Response: `{ message: "...", audioUrl: null, productInfo: null }`
  - GPT-4 responde com contexto geral
- **Verificar**:
  - [ ] Status 200
  - [ ] Resposta coerente
  - [ ] Sem erro de produto não encontrado

#### Teste 31: productId específico (UUID válido)
- **Request**: `POST /api/chat/assistant { productId: "<uuid-real>", message: "Quanto custa?" }`
- **Esperado**:
  - Busca produto no Supabase
  - Resposta contextualizada com preço
  - productInfo incluído
- **Verificar**:
  - [ ] Produto encontrado
  - [ ] Contexto aplicado
  - [ ] productInfo presente

#### Teste 32: productId inválido (UUID inexistente)
- **Request**: `POST /api/chat/assistant { productId: "00000000-0000-0000-0000-000000000000", message: "Olá" }`
- **Esperado**:
  - 404 Not Found
  - Erro: "Produto não encontrado"
- **Verificar**:
  - [ ] Status 404
  - [ ] Erro específico

#### Teste 33: Mensagem vazia
- **Request**: `POST /api/chat/assistant { productId: "geral", message: "" }`
- **Esperado**:
  - 400 Bad Request
  - Erro: "productId and message são obrigatórios"
- **Verificar**:
  - [ ] Status 400
  - [ ] Validação funcionando

#### Teste 34: Histórico de conversação
- **Request**:
```json
POST /api/chat/assistant
{
  "productId": "geral",
  "message": "E quanto ao prazo?",
  "history": [
    { "role": "user", "content": "Quanto custa?" },
    { "role": "assistant", "content": "Os valores variam..." }
  ]
}
```
- **Esperado**: Resposta considera contexto anterior
- **Verificar**:
  - [ ] Contexto mantido
  - [ ] Resposta coerente com histórico

### 3.2 API /api/chat/transcribe

#### Teste 35: Transcrição básica (webm)
- **Request**: `POST /api/chat/transcribe` com FormData (audio.webm)
- **Esperado**:
  - 200 OK
  - Response: `{ text: "texto transcrito", success: true }`
- **Verificar**:
  - [ ] Status 200
  - [ ] Texto correto

#### Teste 36: Formato MP3
- **Request**: Enviar audio.mp3
- **Esperado**: Transcrição bem-sucedida
- **Verificar**:
  - [ ] MP3 aceito
  - [ ] Transcrição OK

#### Teste 37: Formato WAV
- **Request**: Enviar audio.wav
- **Esperado**: Transcrição bem-sucedida
- **Verificar**:
  - [ ] WAV aceito
  - [ ] Transcrição OK

#### Teste 38: Formato inválido (.txt)
- **Request**: Enviar arquivo.txt como audio
- **Esperado**:
  - 400 Bad Request
  - Erro: "Invalid audio type"
- **Verificar**:
  - [ ] Status 400
  - [ ] Validação de tipo

#### Teste 39: Arquivo muito grande (> 25MB)
- **Request**: Enviar áudio de 30MB
- **Esperado**:
  - 413 Payload Too Large
  - Erro: "Audio file too large (max 25MB)"
- **Verificar**:
  - [ ] Status 413
  - [ ] Limite respeitado

#### Teste 40: Sem arquivo
- **Request**: `POST /api/chat/transcribe` sem FormData
- **Esperado**:
  - 400 Bad Request
  - Erro: "No audio file provided"
- **Verificar**:
  - [ ] Status 400
  - [ ] Erro específico

### 3.3 API /api/chat/text-to-speech

#### Teste 41: TTS básico (voz shimmer)
- **Request**: `POST /api/chat/text-to-speech { text: "Olá, tudo bem?", voice: "shimmer" }`
- **Esperado**:
  - 200 OK
  - Content-Type: audio/mpeg
  - Blob de áudio reproduzível
- **Verificar**:
  - [ ] Status 200
  - [ ] Áudio válido
  - [ ] Reprodução funcional

#### Teste 42: 6 vozes diferentes
- **Ação**: Testar cada voz (alloy, echo, fable, onyx, nova, shimmer)
- **Esperado**: Todas retornam áudio válido
- **Verificar**:
  - [ ] alloy
  - [ ] echo
  - [ ] fable
  - [ ] onyx
  - [ ] nova
  - [ ] shimmer

#### Teste 43: Velocidade 0.5x
- **Request**: `{ text: "Teste", speed: 0.5 }`
- **Esperado**: Áudio mais lento
- **Verificar**:
  - [ ] Áudio lento
  - [ ] Sem distorção

#### Teste 44: Velocidade 4.0x
- **Request**: `{ text: "Teste", speed: 4.0 }`
- **Esperado**: Áudio mais rápido
- **Verificar**:
  - [ ] Áudio rápido
  - [ ] Sem distorção

#### Teste 45: Texto muito longo (> 4096 chars)
- **Request**: Texto com 5000 caracteres
- **Esperado**:
  - 400 Bad Request
  - Erro sobre limite de caracteres
- **Verificar**:
  - [ ] Validação de tamanho
  - [ ] Erro claro

#### Teste 46: Texto vazio
- **Request**: `{ text: "" }`
- **Esperado**: 400 Bad Request
- **Verificar**:
  - [ ] Validação funcionando

### 3.4 API /api/chat/agent-flow

#### Teste 47: Iniciar fluxo (estado greeting)
- **Request**: `POST /api/chat/agent-flow { conversationId: "test-123", message: "Olá", channel: "website" }`
- **Esperado**:
  - 200 OK
  - Response inclui: `{ response, state: "greeting", ... }`
- **Verificar**:
  - [ ] Estado inicial correto
  - [ ] Resposta de boas-vindas

#### Teste 48: Progressão de estados
- **Ação**: Simular fluxo completo (greeting → identifying → classifying → qualifying)
- **Esperado**: Estado progride corretamente
- **Verificar**:
  - [ ] greeting → identifying
  - [ ] identifying → classifying
  - [ ] classifying → qualifying

#### Teste 49: Qualificação completa
- **Ação**: Responder todas as perguntas de qualificação
- **Esperado**:
  - Estado muda para "qualified"
  - Score calculado
  - Proposal gerada
- **Verificar**:
  - [ ] Estado qualified
  - [ ] Score presente
  - [ ] Proposal presente

#### Teste 50: Escalação automática (caso complexo)
- **Ação**: Mencionar "processo judicial complexo"
- **Esperado**:
  - Estado muda para "escalated"
  - Motivo: "Caso complexo"
- **Verificar**:
  - [ ] Escalação detectada
  - [ ] Estado correto

#### Teste 51: GET conversation state
- **Request**: `GET /api/chat/agent-flow?conversationId=test-123`
- **Esperado**: Retorna estado atual da conversa
- **Verificar**:
  - [ ] Estado retornado
  - [ ] Dados corretos

#### Teste 52: PUT manual state transition
- **Request**: `PUT /api/chat/agent-flow { conversationId: "test-123", newState: "escalated", reason: "Admin override" }`
- **Esperado**: Estado muda manualmente
- **Verificar**:
  - [ ] Mudança manual funciona
  - [ ] Reason registrado

---

## 4. TESTES DE PERFORMANCE

#### Teste 53: Latência de resposta (texto)
- **Ação**: Enviar mensagem e medir tempo até resposta
- **Esperado**: < 5s (95th percentile)
- **Verificar**:
  - [ ] Média < 3s
  - [ ] P95 < 5s

#### Teste 54: Latência de transcrição
- **Ação**: Gravar 10s de áudio e medir tempo de transcrição
- **Esperado**: < 5s
- **Verificar**:
  - [ ] Transcrição rápida

#### Teste 55: Latência de TTS
- **Ação**: Gerar áudio de 100 palavras e medir tempo
- **Esperado**: < 3s
- **Verificar**:
  - [ ] Geração rápida

#### Teste 56: Renderização de 100 mensagens
- **Ação**: Carregar 100 mensagens no histórico
- **Esperado**:
  - Renderização < 1s
  - Scroll suave
  - Sem lag
- **Verificar**:
  - [ ] Performance OK
  - [ ] UI responsiva

#### Teste 57: Múltiplos players simultâneos
- **Ação**: 10 mensagens com TTS → tocar 3 players ao mesmo tempo
- **Esperado**: Áudio independente sem lag
- **Verificar**:
  - [ ] Múltiplos áudios
  - [ ] Sem travamento

---

## 5. TESTES DE ERRO

#### Teste 58: OpenAI API offline
- **Ação**: Desconectar API → enviar mensagem
- **Esperado**: Erro: "Erro ao processar mensagem"
- **Verificar**:
  - [ ] Erro tratado
  - [ ] UI não trava

#### Teste 59: Whisper API offline
- **Ação**: Desconectar API → gravar áudio
- **Esperado**: Erro de transcrição exibido
- **Verificar**:
  - [ ] Erro específico
  - [ ] Áudio não perdido (se possível)

#### Teste 60: TTS API offline
- **Ação**: Desconectar API → clicar Play
- **Esperado**: Player exibe erro
- **Verificar**:
  - [ ] Erro no player
  - [ ] Mensagem clara

#### Teste 61: Supabase offline
- **Ação**: Desconectar DB → tentar productId específico
- **Esperado**: 500 ou 404 com erro genérico
- **Verificar**:
  - [ ] Erro tratado
  - [ ] Não expõe detalhes internos

#### Teste 62: Rede offline
- **Ação**: Desconectar internet → enviar mensagem
- **Esperado**: Erro de rede
- **Verificar**:
  - [ ] Detecção de offline
  - [ ] Mensagem clara

#### Teste 63: Timeout de request (> 30s)
- **Ação**: Simular request lento
- **Esperado**: Timeout após 30s
- **Verificar**:
  - [ ] Timeout funciona
  - [ ] Erro exibido

---

## 6. TESTES DE UX

#### Teste 64: Responsividade mobile
- **Ação**: Abrir chat em mobile (375px)
- **Esperado**:
  - Chat preenche tela
  - Botões acessíveis
  - Texto legível
- **Verificar**:
  - [ ] Layout adaptado
  - [ ] Usabilidade OK

#### Teste 65: Responsividade tablet
- **Ação**: Abrir em tablet (768px)
- **Esperado**: Layout intermediário funcional
- **Verificar**:
  - [ ] Layout OK

#### Teste 66: Responsividade desktop
- **Ação**: Abrir em desktop (1920px)
- **Esperado**: Chat em tamanho fixo, não ocupa tela inteira
- **Verificar**:
  - [ ] Largura adequada

#### Teste 67: Acessibilidade (teclado)
- **Ação**: Navegar chat apenas com Tab e Enter
- **Esperado**:
  - Todos os botões acessíveis
  - Enter envia mensagem
- **Verificar**:
  - [ ] Navegação por teclado
  - [ ] Enter funciona

#### Teste 68: Acessibilidade (screen reader)
- **Ação**: Usar screen reader (NVDA/JAWS)
- **Esperado**: Elementos anunciados corretamente
- **Verificar**:
  - [ ] ARIA labels
  - [ ] Anúncios corretos

#### Teste 69: Dark mode
- **Ação**: Ativar dark mode do sistema
- **Esperado**: Chat adapta cores
- **Verificar**:
  - [ ] Dark mode funcional
  - [ ] Contraste adequado

#### Teste 70: Animações suaves
- **Ação**: Observar animações (waveform, loading, etc.)
- **Esperado**: 60 FPS, sem jank
- **Verificar**:
  - [ ] Animações suaves
  - [ ] Performance OK

---

## 7. CHECKLIST FINAL

### 7.1 Funcionalidades Críticas
- [ ] Envio de mensagens de texto
- [ ] Respostas do assistente
- [ ] Gravação de áudio
- [ ] Transcrição de áudio
- [ ] TTS do assistente
- [ ] Controle de velocidade TTS
- [ ] Botão limpar chat
- [ ] Anexo de arquivos

### 7.2 APIs
- [ ] /api/chat/assistant (geral)
- [ ] /api/chat/assistant (productId específico)
- [ ] /api/chat/transcribe
- [ ] /api/chat/text-to-speech
- [ ] /api/chat/agent-flow

### 7.3 Integrações
- [ ] OpenAI Chat Completions
- [ ] OpenAI Whisper
- [ ] OpenAI TTS
- [ ] OpenAI Realtime API
- [ ] D-ID Avatar (opcional)
- [ ] Supabase (products)

### 7.4 Tratamento de Erros
- [ ] API offline
- [ ] Rede offline
- [ ] Permissão negada (microfone)
- [ ] Arquivo inválido
- [ ] Timeout

### 7.5 Performance
- [ ] Latência < 5s
- [ ] UI responsiva
- [ ] Sem memory leaks
- [ ] Múltiplos players funcionam

### 7.6 UX
- [ ] Mobile responsivo
- [ ] Acessibilidade
- [ ] Dark mode
- [ ] Animações suaves

---

## 8. EXECUÇÃO DOS TESTES

### Ordem Recomendada:
1. **Testes de Funcionalidade** (1-29) - CRÍTICO
2. **Testes de Integração** (30-52) - CRÍTICO
3. **Testes de Erro** (58-63) - IMPORTANTE
4. **Testes de Performance** (53-57) - IMPORTANTE
5. **Testes de UX** (64-70) - DESEJÁVEL

### Prioridades:
- **P0 (Bloqueador)**: Testes 1-29, 30-46
- **P1 (Importante)**: Testes 47-52, 53-57, 58-63
- **P2 (Desejável)**: Testes 64-70

---

## 9. RELATÓRIO DE BUGS

### Template de Bug Report:
```
ID: BUG-XXX
Título: [Breve descrição]
Teste: [Número do teste]
Severidade: [P0/P1/P2]
Passos para Reproduzir:
1. ...
2. ...
3. ...
Resultado Esperado: ...
Resultado Atual: ...
Screenshots/Logs: ...
Status: [OPEN/IN_PROGRESS/FIXED/WONTFIX]
```

---

**Total de Testes**: 70
**Tempo Estimado**: 4-6 horas
**Responsável**: Claude Code
**Data de Início**: 2025-01-06
