'use client'

/**
 * Chat Settings Panel
 * Allows users to configure chat preferences (voice, TTS, notifications, etc.)
 */

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { Settings, Volume2, Mic, Bell } from 'lucide-react'

interface ChatSettingsData {
  ttsEnabled: boolean
  ttsVoice: 'alloy' | 'echo' | 'fable' | 'onyx' | 'nova' | 'shimmer'
  ttsSpeed: number
  autoPlayResponses: boolean
  soundEnabled: boolean
  notificationsEnabled: boolean
  microphoneEnabled: boolean
}

const DEFAULT_SETTINGS: ChatSettingsData = {
  ttsEnabled: false,
  ttsVoice: 'shimmer',
  ttsSpeed: 1.0,
  autoPlayResponses: false,
  soundEnabled: true,
  notificationsEnabled: true,
  microphoneEnabled: true,
}

const STORAGE_KEY = 'garcezpalha_chat_settings'

interface ChatSettingsProps {
  onSettingsChange?: (settings: ChatSettingsData) => void
}

export function ChatSettings({ onSettingsChange }: ChatSettingsProps) {
  const [settings, setSettings] = useState<ChatSettingsData>(DEFAULT_SETTINGS)
  const [open, setOpen] = useState(false)

  // Load settings from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        setSettings({ ...DEFAULT_SETTINGS, ...parsed })
      } catch (err) {
        console.error('[ChatSettings] Error parsing settings:', err)
      }
    }
  }, [])

  // Save settings to localStorage when changed
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
    onSettingsChange?.(settings)
  }, [settings, onSettingsChange])

  const updateSetting = <K extends keyof ChatSettingsData>(
    key: K,
    value: ChatSettingsData[K]
  ) => {
    setSettings(prev => ({ ...prev, [key]: value }))
  }

  const resetToDefaults = () => {
    setSettings(DEFAULT_SETTINGS)
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" title="Configurações do Chat">
          <Settings className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Configurações do Chat</SheetTitle>
          <SheetDescription>
            Personalize sua experiência de atendimento
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* Text-to-Speech Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Volume2 className="h-4 w-4" />
                <Label htmlFor="tts-enabled">Text-to-Speech</Label>
              </div>
              <Switch
                id="tts-enabled"
                checked={settings.ttsEnabled}
                onCheckedChange={(checked) => updateSetting('ttsEnabled', checked)}
              />
            </div>

            {settings.ttsEnabled && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="tts-voice">Voz</Label>
                  <Select
                    value={settings.ttsVoice}
                    onValueChange={(value: any) => updateSetting('ttsVoice', value)}
                  >
                    <SelectTrigger id="tts-voice">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="alloy">Alloy (Neutro)</SelectItem>
                      <SelectItem value="echo">Echo (Masculino)</SelectItem>
                      <SelectItem value="fable">Fable (Neutro)</SelectItem>
                      <SelectItem value="onyx">Onyx (Masculino grave)</SelectItem>
                      <SelectItem value="nova">Nova (Feminino jovem)</SelectItem>
                      <SelectItem value="shimmer">Shimmer (Feminino suave)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>
                    Velocidade: {settings.ttsSpeed.toFixed(1)}x
                  </Label>
                  <Slider
                    value={[settings.ttsSpeed]}
                    onValueChange={([value]: number[]) => updateSetting('ttsSpeed', value)}
                    min={0.5}
                    max={2.0}
                    step={0.1}
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>0.5x</span>
                    <span>Normal</span>
                    <span>2.0x</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="auto-play">Reproduzir respostas automaticamente</Label>
                  <Switch
                    id="auto-play"
                    checked={settings.autoPlayResponses}
                    onCheckedChange={(checked) =>
                      updateSetting('autoPlayResponses', checked)
                    }
                  />
                </div>
              </>
            )}
          </div>

          {/* Microphone Section */}
          <div className="space-y-4 border-t pt-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Mic className="h-4 w-4" />
                <Label htmlFor="microphone-enabled">Gravação de Áudio</Label>
              </div>
              <Switch
                id="microphone-enabled"
                checked={settings.microphoneEnabled}
                onCheckedChange={(checked) =>
                  updateSetting('microphoneEnabled', checked)
                }
              />
            </div>
            {!settings.microphoneEnabled && (
              <p className="text-xs text-muted-foreground">
                Desabilitado. Você não poderá gravar mensagens de voz.
              </p>
            )}
          </div>

          {/* Notifications Section */}
          <div className="space-y-4 border-t pt-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bell className="h-4 w-4" />
                <Label htmlFor="notifications-enabled">Notificações</Label>
              </div>
              <Switch
                id="notifications-enabled"
                checked={settings.notificationsEnabled}
                onCheckedChange={(checked) =>
                  updateSetting('notificationsEnabled', checked)
                }
              />
            </div>
          </div>

          {/* Sound Effects */}
          <div className="space-y-4 border-t pt-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="sound-enabled">Sons de Interface</Label>
              <Switch
                id="sound-enabled"
                checked={settings.soundEnabled}
                onCheckedChange={(checked) => updateSetting('soundEnabled', checked)}
              />
            </div>
          </div>

          {/* Reset Button */}
          <div className="border-t pt-4">
            <Button
              variant="outline"
              className="w-full"
              onClick={resetToDefaults}
            >
              Restaurar Padrões
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}

// Hook to use chat settings
export function useChatSettings() {
  const [settings, setSettings] = useState<ChatSettingsData>(DEFAULT_SETTINGS)

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        setSettings({ ...DEFAULT_SETTINGS, ...parsed })
      } catch (err) {
        console.error('[useChatSettings] Error parsing settings:', err)
      }
    }
  }, [])

  return settings
}
