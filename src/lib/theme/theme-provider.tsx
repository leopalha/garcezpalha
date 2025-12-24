'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { ThemeName, themes } from './themes'

interface ThemeContextType {
  theme: ThemeName
  setTheme: (theme: ThemeName) => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

// Helper function to convert hex to HSL values (without hsl() wrapper)
function hexToHSL(hex: string): string {
  // Remove the # if present
  hex = hex.replace('#', '')

  // Parse the hex values
  const r = parseInt(hex.substring(0, 2), 16) / 255
  const g = parseInt(hex.substring(2, 4), 16) / 255
  const b = parseInt(hex.substring(4, 6), 16) / 255

  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  let h = 0
  let s = 0
  const l = (max + min) / 2

  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)

    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6
        break
      case g:
        h = ((b - r) / d + 2) / 6
        break
      case b:
        h = ((r - g) / d + 4) / 6
        break
    }
  }

  // Return HSL values as "h s% l%" for Tailwind
  return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<ThemeName>('navy') // Default: Navy Blue
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // Load theme from localStorage
    const savedTheme = localStorage.getItem('garcezpalha-theme') as ThemeName
    if (savedTheme && themes[savedTheme]) {
      setThemeState(savedTheme)
    }
  }, [])

  useEffect(() => {
    if (!mounted) return

    // Save to localStorage
    localStorage.setItem('garcezpalha-theme', theme)

    // Apply CSS variables
    const root = document.documentElement
    const themeColors = themes[theme].colors

    // Apply direct color variables (hex)
    root.style.setProperty('--color-primary', themeColors.primary)
    root.style.setProperty('--color-primary-foreground', themeColors.primaryForeground)
    root.style.setProperty('--color-secondary', themeColors.secondary)
    root.style.setProperty('--color-secondary-foreground', themeColors.secondaryForeground)
    root.style.setProperty('--color-accent', themeColors.accent)
    root.style.setProperty('--color-accent-foreground', themeColors.accentForeground)
    root.style.setProperty('--color-muted', themeColors.muted)
    root.style.setProperty('--color-muted-foreground', themeColors.mutedForeground)

    // Apply HSL variables for Tailwind (background, foreground, card, border)
    root.style.setProperty('--background', hexToHSL(themeColors.background))
    root.style.setProperty('--foreground', hexToHSL(themeColors.foreground))
    root.style.setProperty('--card', hexToHSL(themeColors.card))
    root.style.setProperty('--card-foreground', hexToHSL(themeColors.cardForeground))
    root.style.setProperty('--border', hexToHSL(themeColors.border))
    root.style.setProperty('--input', hexToHSL(themeColors.border))
    root.style.setProperty('--ring', hexToHSL(themeColors.primary))
  }, [theme, mounted])

  const setTheme = (newTheme: ThemeName) => {
    setThemeState(newTheme)
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}
