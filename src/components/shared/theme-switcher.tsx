'use client'

import { useState } from 'react'
import { Palette, Check } from 'lucide-react'
import { useTheme } from '@/lib/theme/theme-provider'
import { themes, ThemeName } from '@/lib/theme/themes'
import { Button } from '@/components/ui/button'

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme()
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="relative">
      <Button
        variant="outline"
        size="icon"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Alternar tema"
      >
        <Palette className="h-5 w-5" />
      </Button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />

          {/* Dropdown */}
          <div className="absolute right-0 mt-2 w-64 rounded-lg border bg-background shadow-lg z-50 p-2">
            <div className="text-sm font-semibold mb-2 px-2">Escolha o Tema</div>
            <div className="space-y-1">
              {Object.values(themes).map((t) => (
                <button
                  key={t.name}
                  onClick={() => {
                    setTheme(t.name)
                    setIsOpen(false)
                  }}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-md hover:bg-muted/50 transition-colors text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex gap-1">
                      <div
                        className="w-4 h-4 rounded-full border"
                        style={{ backgroundColor: t.colors.primary }}
                      />
                      <div
                        className="w-4 h-4 rounded-full border"
                        style={{ backgroundColor: t.colors.secondary }}
                      />
                      <div
                        className="w-4 h-4 rounded-full border"
                        style={{ backgroundColor: t.colors.background }}
                        title="Background"
                      />
                    </div>
                    <span className="text-sm">{t.label}</span>
                  </div>
                  {theme === t.name && (
                    <Check className="h-4 w-4 text-primary" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
