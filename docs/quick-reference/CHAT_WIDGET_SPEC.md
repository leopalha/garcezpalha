# 🎙️ CHAT WIDGET SPECIFICATION
## Garcez Palha - Chat Completo com Áudio
**Versão**: 1.0 | **Data**: 27/12/2025 | **Status**: ⚠️ ROADMAP - NÃO IMPLEMENTADO

---

> **⚠️ IMPORTANTE:** Este documento descreve um widget de chat avançado planejado para o futuro.
> **Status atual:** Site usa links diretos para WhatsApp em todas as páginas.
> **Roadmap:** Chat widget com áudio será implementado em Q3 2026.

---

## 1. VISÃO GERAL

```
╔══════════════════════════════════════════════════════════════════════╗
║                      CHAT WIDGET COMPLETO                            ║
╠══════════════════════════════════════════════════════════════════════╣
║                                                                      ║
║   ┌────────────────────────────────────────────────────────────┐    ║
║   │  🏛️ Garcez Palha                              [─] [□] [×]  │    ║
║   ├────────────────────────────────────────────────────────────┤    ║
║   │                                                            │    ║
║   │  🤖 Clara • Online                                         │    ║
║   │  ─────────────────────────────────────────────             │    ║
║   │                                                            │    ║
║   │  ┌──────────────────────────────────────────┐              │    ║
║   │  │ Olá! 👋 Sou a Clara, assistente da       │ 🔊 10:30   │    ║
║   │  │ Garcez Palha. Como posso te ajudar?      │              │    ║
║   │  └──────────────────────────────────────────┘              │    ║
║   │                                                            │    ║
║   │                    ┌─────────────────────────────────────┐ │    ║
║   │                    │ Minha conta foi bloqueada          │ │    ║
║   │                    └─────────────────────────────────────┘ │    ║
║   │                                                            │    ║
║   │  ┌──────────────────────────────────────────┐              │    ║
║   │  │ Entendi! Vou te ajudar com isso.         │ 🔊 10:31   │    ║
║   │  │ O bloqueio foi judicial ou pelo banco?   │              │    ║
║   │  └──────────────────────────────────────────┘              │    ║
║   │                                                            │    ║
║   │  ⌨️ Clara está digitando...                                │    ║
║   │                                                            │    ║
║   ├────────────────────────────────────────────────────────────┤    ║
║   │ [📎] [Digite sua mensagem...              ] [🎤] [➤]       │    ║
║   └────────────────────────────────────────────────────────────┘    ║
║                                                                      ║
║   FUNCIONALIDADES:                                                   ║
║   ├── 💬 Texto: Digitação normal                                    ║
║   ├── 🎤 Entrada de Áudio: Gravar e transcrever                    ║
║   ├── 🔊 Saída de Voz: TTS das respostas                           ║
║   ├── 📎 Anexos: Upload de documentos/imagens                       ║
║   ├── 📞 Chamada: Voz ao vivo (Fase 2)                              ║
║   └── 💾 Histórico: Persistente entre sessões                       ║
║                                                                      ║
╚══════════════════════════════════════════════════════════════════════╝
```

---

## 2. ARQUITETURA TÉCNICA

### 2.1 Componentes do Frontend

```
src/components/chat/
├── ChatWidget.tsx              # Container principal
├── ChatHeader.tsx              # Cabeçalho com status
├── ChatMessages.tsx            # Lista de mensagens
├── ChatMessage.tsx             # Mensagem individual
├── ChatInput.tsx               # Input de texto/áudio
├── AudioRecorder.tsx           # Gravador de áudio
├── VoicePlayer.tsx             # Player TTS
├── TypingIndicator.tsx         # "Digitando..."
├── FileUpload.tsx              # Upload de arquivos
└── hooks/
    ├── useChat.ts              # Estado do chat
    ├── useAudioRecorder.ts     # Gravação
    ├── useVoicePlayer.ts       # Reprodução TTS
    └── useWebSocket.ts         # Conexão real-time
```

### 2.2 Fluxo de Dados

```
┌─────────────────────────────────────────────────────────────────────┐
│                        FLUXO DE ÁUDIO                               │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ENTRADA (Usuário → Sistema):                                       │
│                                                                     │
│  [Usuário fala] → [MediaRecorder] → [Blob WAV/WebM]                │
│                           │                                         │
│                           ▼                                         │
│               [API /api/speech-to-text]                            │
│                           │                                         │
│                           ▼                                         │
│              [Whisper / AssemblyAI]                                │
│                           │                                         │
│                           ▼                                         │
│                    [Texto transcrito]                               │
│                           │                                         │
│                           ▼                                         │
│               [API /api/chat] (mesmo fluxo de texto)               │
│                                                                     │
│  ────────────────────────────────────────────────────────────────  │
│                                                                     │
│  SAÍDA (Sistema → Usuário):                                        │
│                                                                     │
│  [Resposta texto] → [API /api/text-to-speech]                      │
│                           │                                         │
│                           ▼                                         │
│              [ElevenLabs / OpenAI TTS]                             │
│                           │                                         │
│                           ▼                                         │
│                    [Audio MP3/WAV]                                  │
│                           │                                         │
│                           ▼                                         │
│               [VoicePlayer reproduz]                               │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 3. COMPONENTES DETALHADOS

### 3.1 AudioRecorder.tsx

```tsx
// src/components/chat/AudioRecorder.tsx

import { useState, useRef, useCallback } from 'react';
import { Mic, Square, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AudioRecorderProps {
  onTranscription: (text: string) => void;
  disabled?: boolean;
}

export function AudioRecorder({ onTranscription, disabled }: AudioRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });
      
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };
      
      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm' });
        await transcribeAudio(audioBlob);
        
        // Parar todas as tracks
        stream.getTracks().forEach(track => track.stop());
      };
      
      mediaRecorder.start(1000); // Chunk a cada 1s
      setIsRecording(true);
      
      // Timer visual
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
      
    } catch (error) {
      console.error('Erro ao iniciar gravação:', error);
      alert('Não foi possível acessar o microfone.');
    }
  }, []);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setRecordingTime(0);
      
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
  }, [isRecording]);

  const transcribeAudio = async (audioBlob: Blob) => {
    setIsTranscribing(true);
    
    try {
      const formData = new FormData();
      formData.append('audio', audioBlob, 'recording.webm');
      
      const response = await fetch('/api/speech-to-text', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) throw new Error('Erro na transcrição');
      
      const { text } = await response.json();
      onTranscription(text);
      
    } catch (error) {
      console.error('Erro na transcrição:', error);
      alert('Não foi possível transcrever o áudio.');
    } finally {
      setIsTranscribing(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex items-center gap-2">
      {isTranscribing ? (
        <Button variant="ghost" size="icon" disabled>
          <Loader2 className="h-5 w-5 animate-spin" />
        </Button>
      ) : isRecording ? (
        <>
          <span className="text-red-500 animate-pulse text-sm">
            ● {formatTime(recordingTime)}
          </span>
          <Button 
            variant="destructive" 
            size="icon"
            onClick={stopRecording}
          >
            <Square className="h-4 w-4" />
          </Button>
        </>
      ) : (
        <Button 
          variant="ghost" 
          size="icon"
          onClick={startRecording}
          disabled={disabled}
          title="Gravar áudio"
        >
          <Mic className="h-5 w-5" />
        </Button>
      )}
    </div>
  );
}
```

### 3.2 VoicePlayer.tsx

```tsx
// src/components/chat/VoicePlayer.tsx

import { useState, useRef, useEffect } from 'react';
import { Volume2, VolumeX, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface VoicePlayerProps {
  text: string;
  messageId: string;
  autoPlay?: boolean;
}

export function VoicePlayer({ text, messageId, autoPlay = false }: VoicePlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Gerar áudio quando necessário
  const generateAudio = async () => {
    if (audioUrl) return audioUrl; // Já gerado
    
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/text-to-speech', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          text,
          voice: 'clara', // Voz configurada
          messageId,
        }),
      });
      
      if (!response.ok) throw new Error('Erro ao gerar áudio');
      
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      setAudioUrl(url);
      
      return url;
      
    } catch (error) {
      console.error('Erro TTS:', error);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const togglePlay = async () => {
    if (isPlaying && audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
      return;
    }
    
    const url = audioUrl || await generateAudio();
    if (!url) return;
    
    if (!audioRef.current) {
      audioRef.current = new Audio(url);
      audioRef.current.onended = () => setIsPlaying(false);
    }
    
    await audioRef.current.play();
    setIsPlaying(true);
  };

  // Autoplay se configurado
  useEffect(() => {
    if (autoPlay && !audioUrl) {
      generateAudio().then(url => {
        if (url) {
          const audio = new Audio(url);
          audio.onended = () => setIsPlaying(false);
          audio.play();
          setIsPlaying(true);
          audioRef.current = audio;
        }
      });
    }
  }, [autoPlay]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (audioUrl) URL.revokeObjectURL(audioUrl);
    };
  }, [audioUrl]);

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={togglePlay}
      disabled={isLoading}
      className="h-6 w-6 p-0"
      title={isPlaying ? 'Pausar' : 'Ouvir'}
    >
      {isLoading ? (
        <Loader2 className="h-3 w-3 animate-spin" />
      ) : isPlaying ? (
        <VolumeX className="h-3 w-3" />
      ) : (
        <Volume2 className="h-3 w-3" />
      )}
    </Button>
  );
}
```

---

## 4. APIs BACKEND

### 4.1 Speech-to-Text API

```typescript
// src/app/api/speech-to-text/route.ts

import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const audioFile = formData.get('audio') as File;
    
    if (!audioFile) {
      return NextResponse.json(
        { error: 'Arquivo de áudio não fornecido' },
        { status: 400 }
      );
    }
    
    // Converter para formato aceito pelo Whisper
    const buffer = Buffer.from(await audioFile.arrayBuffer());
    
    // Criar File object para a API
    const file = new File([buffer], 'audio.webm', { 
      type: audioFile.type 
    });
    
    // Transcrição com Whisper
    const transcription = await openai.audio.transcriptions.create({
      file,
      model: 'whisper-1',
      language: 'pt', // Português brasileiro
      response_format: 'text',
    });
    
    return NextResponse.json({
      text: transcription,
      language: 'pt-BR',
    });
    
  } catch (error) {
    console.error('Erro STT:', error);
    return NextResponse.json(
      { error: 'Erro na transcrição' },
      { status: 500 }
    );
  }
}

export const config = {
  api: {
    bodyParser: false, // Necessário para FormData
  },
};
```

### 4.2 Text-to-Speech API

```typescript
// src/app/api/text-to-speech/route.ts

import { NextRequest, NextResponse } from 'next/server';

// Opção 1: OpenAI TTS
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Opção 2: ElevenLabs (melhor qualidade)
const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;
const ELEVENLABS_VOICE_ID = process.env.ELEVENLABS_VOICE_ID || 'EXAVITQu4vr4xnSDxMaL'; // Bella

export async function POST(request: NextRequest) {
  try {
    const { text, voice = 'clara', provider = 'openai' } = await request.json();
    
    if (!text) {
      return NextResponse.json(
        { error: 'Texto não fornecido' },
        { status: 400 }
      );
    }
    
    let audioBuffer: Buffer;
    
    if (provider === 'elevenlabs') {
      // ElevenLabs - Qualidade superior
      const response = await fetch(
        `https://api.elevenlabs.io/v1/text-to-speech/${ELEVENLABS_VOICE_ID}`,
        {
          method: 'POST',
          headers: {
            'Accept': 'audio/mpeg',
            'Content-Type': 'application/json',
            'xi-api-key': ELEVENLABS_API_KEY!,
          },
          body: JSON.stringify({
            text,
            model_id: 'eleven_multilingual_v2',
            voice_settings: {
              stability: 0.5,
              similarity_boost: 0.75,
            }
          }),
        }
      );
      
      if (!response.ok) throw new Error('ElevenLabs error');
      
      audioBuffer = Buffer.from(await response.arrayBuffer());
      
    } else {
      // OpenAI TTS - Mais barato
      const mp3 = await openai.audio.speech.create({
        model: 'tts-1',
        voice: 'nova', // Voz feminina brasileira-friendly
        input: text,
        response_format: 'mp3',
      });
      
      audioBuffer = Buffer.from(await mp3.arrayBuffer());
    }
    
    // Retornar áudio
    return new NextResponse(audioBuffer, {
      headers: {
        'Content-Type': 'audio/mpeg',
        'Content-Length': audioBuffer.length.toString(),
      },
    });
    
  } catch (error) {
    console.error('Erro TTS:', error);
    return NextResponse.json(
      { error: 'Erro na síntese de voz' },
      { status: 500 }
    );
  }
}
```

---

## 5. CHAT INPUT COMPLETO

### 5.1 ChatInput.tsx

```tsx
// src/components/chat/ChatInput.tsx

import { useState, useRef, FormEvent, KeyboardEvent } from 'react';
import { Send, Paperclip, Mic, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { AudioRecorder } from './AudioRecorder';
import { FileUpload } from './FileUpload';

interface ChatInputProps {
  onSendMessage: (message: string, files?: File[]) => Promise<void>;
  disabled?: boolean;
  placeholder?: string;
}

export function ChatInput({ 
  onSendMessage, 
  disabled,
  placeholder = 'Digite sua mensagem...' 
}: ChatInputProps) {
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = async (e?: FormEvent) => {
    e?.preventDefault();
    
    const trimmedMessage = message.trim();
    if (!trimmedMessage && files.length === 0) return;
    
    setIsSending(true);
    
    try {
      await onSendMessage(trimmedMessage, files.length > 0 ? files : undefined);
      setMessage('');
      setFiles([]);
      textareaRef.current?.focus();
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    // Enter para enviar, Shift+Enter para nova linha
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleTranscription = (text: string) => {
    setMessage(prev => prev + (prev ? ' ' : '') + text);
    textareaRef.current?.focus();
  };

  const handleFilesSelected = (newFiles: File[]) => {
    setFiles(prev => [...prev, ...newFiles]);
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="border-t p-4">
      {/* Preview de arquivos */}
      {files.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-2">
          {files.map((file, index) => (
            <div 
              key={index}
              className="flex items-center gap-1 bg-muted px-2 py-1 rounded text-sm"
            >
              <span className="truncate max-w-[150px]">{file.name}</span>
              <button 
                onClick={() => removeFile(index)}
                className="text-muted-foreground hover:text-foreground"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
      
      {/* Input principal */}
      <form onSubmit={handleSubmit} className="flex items-end gap-2">
        {/* Upload de arquivo */}
        <FileUpload onFilesSelected={handleFilesSelected}>
          <Button 
            type="button"
            variant="ghost" 
            size="icon"
            disabled={disabled}
            title="Anexar arquivo"
          >
            <Paperclip className="h-5 w-5" />
          </Button>
        </FileUpload>
        
        {/* Textarea */}
        <div className="flex-1 relative">
          <Textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={disabled || isSending}
            className="min-h-[44px] max-h-[120px] resize-none pr-10"
            rows={1}
          />
        </div>
        
        {/* Gravador de áudio */}
        <AudioRecorder 
          onTranscription={handleTranscription}
          disabled={disabled || isSending}
        />
        
        {/* Botão enviar */}
        <Button 
          type="submit"
          size="icon"
          disabled={disabled || isSending || (!message.trim() && files.length === 0)}
        >
          {isSending ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <Send className="h-5 w-5" />
          )}
        </Button>
      </form>
    </div>
  );
}
```

---

## 6. MENSAGEM COM PLAYER DE VOZ

### 6.1 ChatMessage.tsx

```tsx
// src/components/chat/ChatMessage.tsx

import { cn } from '@/lib/utils';
import { VoicePlayer } from './VoicePlayer';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface ChatMessageProps {
  message: {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
    attachments?: Attachment[];
  };
  showVoice?: boolean;
  autoPlayVoice?: boolean;
}

interface Attachment {
  type: 'image' | 'document';
  url: string;
  name: string;
}

export function ChatMessage({ 
  message, 
  showVoice = true,
  autoPlayVoice = false 
}: ChatMessageProps) {
  const isUser = message.role === 'user';
  
  return (
    <div className={cn(
      'flex gap-3 p-4',
      isUser ? 'flex-row-reverse' : 'flex-row'
    )}>
      {/* Avatar */}
      <Avatar className="h-8 w-8 shrink-0">
        {isUser ? (
          <AvatarFallback>U</AvatarFallback>
        ) : (
          <>
            <AvatarImage src="/clara-avatar.png" alt="Clara" />
            <AvatarFallback>C</AvatarFallback>
          </>
        )}
      </Avatar>
      
      {/* Conteúdo */}
      <div className={cn(
        'flex flex-col max-w-[80%]',
        isUser ? 'items-end' : 'items-start'
      )}>
        {/* Balão de mensagem */}
        <div className={cn(
          'rounded-2xl px-4 py-2',
          isUser 
            ? 'bg-primary text-primary-foreground' 
            : 'bg-muted'
        )}>
          {/* Texto */}
          <p className="whitespace-pre-wrap">{message.content}</p>
          
          {/* Anexos */}
          {message.attachments && message.attachments.length > 0 && (
            <div className="mt-2 flex flex-col gap-2">
              {message.attachments.map((att, i) => (
                att.type === 'image' ? (
                  <img 
                    key={i}
                    src={att.url} 
                    alt={att.name}
                    className="max-w-[200px] rounded"
                  />
                ) : (
                  <a 
                    key={i}
                    href={att.url}
                    target="_blank"
                    className="text-sm underline"
                  >
                    📎 {att.name}
                  </a>
                )
              ))}
            </div>
          )}
        </div>
        
        {/* Footer: hora + player */}
        <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
          <span>
            {format(message.timestamp, 'HH:mm', { locale: ptBR })}
          </span>
          
          {/* Player de voz apenas para mensagens do assistente */}
          {!isUser && showVoice && (
            <VoicePlayer 
              text={message.content}
              messageId={message.id}
              autoPlay={autoPlayVoice}
            />
          )}
        </div>
      </div>
    </div>
  );
}
```

---

## 7. CONFIGURAÇÕES E PREFERÊNCIAS

### 7.1 Configurações do Usuário

```typescript
// src/lib/chat/settings.ts

export interface ChatSettings {
  // Áudio
  autoPlayVoice: boolean;        // Tocar voz automaticamente
  voiceEnabled: boolean;         // Habilitar TTS
  voiceSpeed: number;            // Velocidade (0.5-2.0)
  voiceVolume: number;           // Volume (0-1)
  
  // Notificações
  soundEnabled: boolean;         // Som de notificação
  desktopNotifications: boolean; // Notificações push
  
  // Interface
  compactMode: boolean;          // Modo compacto
  darkMode: boolean;             // Tema escuro
  fontSize: 'small' | 'medium' | 'large';
  
  // Privacidade
  saveHistory: boolean;          // Salvar histórico
  typingIndicator: boolean;      // Mostrar "digitando"
}

export const DEFAULT_SETTINGS: ChatSettings = {
  autoPlayVoice: false,
  voiceEnabled: true,
  voiceSpeed: 1.0,
  voiceVolume: 0.8,
  soundEnabled: true,
  desktopNotifications: false,
  compactMode: false,
  darkMode: false,
  fontSize: 'medium',
  saveHistory: true,
  typingIndicator: true,
};

// Persistir no localStorage
export function saveSettings(settings: Partial<ChatSettings>) {
  const current = loadSettings();
  const updated = { ...current, ...settings };
  localStorage.setItem('chat_settings', JSON.stringify(updated));
  return updated;
}

export function loadSettings(): ChatSettings {
  try {
    const saved = localStorage.getItem('chat_settings');
    if (saved) {
      return { ...DEFAULT_SETTINGS, ...JSON.parse(saved) };
    }
  } catch (e) {}
  return DEFAULT_SETTINGS;
}
```

### 7.2 Componente de Configurações

```tsx
// src/components/chat/ChatSettings.tsx

import { useState } from 'react';
import { Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { ChatSettings, saveSettings, loadSettings } from '@/lib/chat/settings';

export function ChatSettingsPanel() {
  const [settings, setSettings] = useState<ChatSettings>(loadSettings);

  const updateSetting = <K extends keyof ChatSettings>(
    key: K, 
    value: ChatSettings[K]
  ) => {
    const updated = saveSettings({ [key]: value });
    setSettings(updated);
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon">
          <Settings className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Configurações do Chat</SheetTitle>
        </SheetHeader>
        
        <div className="space-y-6 mt-6">
          {/* Áudio */}
          <div className="space-y-4">
            <h3 className="font-medium">Áudio</h3>
            
            <div className="flex items-center justify-between">
              <span>Voz habilitada</span>
              <Switch
                checked={settings.voiceEnabled}
                onCheckedChange={(v) => updateSetting('voiceEnabled', v)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <span>Reproduzir automaticamente</span>
              <Switch
                checked={settings.autoPlayVoice}
                onCheckedChange={(v) => updateSetting('autoPlayVoice', v)}
                disabled={!settings.voiceEnabled}
              />
            </div>
            
            <div className="space-y-2">
              <span>Velocidade da voz</span>
              <Slider
                value={[settings.voiceSpeed]}
                onValueChange={([v]) => updateSetting('voiceSpeed', v)}
                min={0.5}
                max={2}
                step={0.1}
                disabled={!settings.voiceEnabled}
              />
            </div>
          </div>
          
          {/* Notificações */}
          <div className="space-y-4">
            <h3 className="font-medium">Notificações</h3>
            
            <div className="flex items-center justify-between">
              <span>Sons</span>
              <Switch
                checked={settings.soundEnabled}
                onCheckedChange={(v) => updateSetting('soundEnabled', v)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <span>Notificações desktop</span>
              <Switch
                checked={settings.desktopNotifications}
                onCheckedChange={(v) => updateSetting('desktopNotifications', v)}
              />
            </div>
          </div>
          
          {/* Privacidade */}
          <div className="space-y-4">
            <h3 className="font-medium">Privacidade</h3>
            
            <div className="flex items-center justify-between">
              <span>Salvar histórico</span>
              <Switch
                checked={settings.saveHistory}
                onCheckedChange={(v) => updateSetting('saveHistory', v)}
              />
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
```

---

## 8. CUSTO ESTIMADO

### 8.1 Tabela de Custos

| Serviço | Custo | Volume Esperado | Custo Mensal |
|---------|-------|-----------------|--------------|
| **Whisper (STT)** | $0.006/min | 500 min/mês | $3.00 |
| **OpenAI TTS** | $0.015/1k chars | 100k chars/mês | $1.50 |
| **ElevenLabs** | $22/mês | - | $22.00 |
| **Total (OpenAI)** | - | - | ~$4.50/mês |
| **Total (ElevenLabs)** | - | - | ~$25/mês |

### 8.2 Otimizações de Custo

```typescript
// Estratégias para reduzir custos:

// 1. Cache de áudio gerado
const audioCache = new Map<string, string>();

async function getOrGenerateAudio(text: string, messageId: string) {
  const cacheKey = `${messageId}_${text.substring(0, 50)}`;
  
  if (audioCache.has(cacheKey)) {
    return audioCache.get(cacheKey)!;
  }
  
  const audioUrl = await generateAudio(text);
  audioCache.set(cacheKey, audioUrl);
  
  return audioUrl;
}

// 2. Gerar áudio apenas sob demanda (não autoplay)
// 3. Limitar tamanho do texto para TTS (max 500 chars)
// 4. Comprimir áudio antes de enviar para transcrição
```

---

## 9. CHECKLIST DE IMPLEMENTAÇÃO

### Fase 1: Gravação de Áudio (3-4h)
- [ ] Componente AudioRecorder
- [ ] API /api/speech-to-text
- [ ] Integração com Whisper
- [ ] Indicador visual de gravação
- [ ] Teste em mobile e desktop

### Fase 2: Text-to-Speech (2-3h)
- [ ] Componente VoicePlayer
- [ ] API /api/text-to-speech
- [ ] Integração com OpenAI TTS ou ElevenLabs
- [ ] Botão de play em cada mensagem
- [ ] Configuração de autoplay

### Fase 3: Chat Input Completo (2-3h)
- [ ] ChatInput com texto + áudio
- [ ] Upload de arquivos
- [ ] Preview de anexos
- [ ] Atalhos de teclado

### Fase 4: Configurações (1-2h)
- [ ] Painel de configurações
- [ ] Persistência em localStorage
- [ ] Preferências de voz

### Fase 5: Polimento (2-3h)
- [ ] Testes de usabilidade
- [ ] Otimização de performance
- [ ] Cache de áudio
- [ ] Fallbacks de erro

**TOTAL: 10-15 horas**

---

*Documento criado em 27/12/2025*
*Versão 1.0 - DRAFT*
