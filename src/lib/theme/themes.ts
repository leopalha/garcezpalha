export type ThemeName = 'classic' | 'navy' | 'corporate' | 'prussian' | 'slate' | 'emerald' | 'burgundy' | 'charcoal'

export interface Theme {
  name: ThemeName
  label: string
  colors: {
    primary: string
    primaryForeground: string
    secondary: string
    secondaryForeground: string
    accent: string
    accentForeground: string
    muted: string
    mutedForeground: string
    background: string
    foreground: string
    card: string
    cardForeground: string
    border: string
  }
}

export const themes: Record<ThemeName, Theme> = {
  classic: {
    name: 'classic',
    label: 'Clássico (Vinho + Dourado)',
    colors: {
      primary: '#8B1538',
      primaryForeground: '#F5F5F5',
      secondary: '#D4AF37',
      secondaryForeground: '#0A0A0A',
      accent: '#C9A961',
      accentForeground: '#0A0A0A',
      muted: '#F1F5F9',
      mutedForeground: '#64748B',
      background: '#FEF7F8',
      foreground: '#1C1917',
      card: '#FFFFFF',
      cardForeground: '#1C1917',
      border: '#E7E5E4',
    },
  },
  navy: {
    name: 'navy',
    label: 'Navy Blue + Gold',
    colors: {
      primary: '#1E3A8A',
      primaryForeground: '#FFFFFF',
      secondary: '#D4AF37',
      secondaryForeground: '#0A0A0A',
      accent: '#3B82F6',
      accentForeground: '#FFFFFF',
      muted: '#F1F5F9',
      mutedForeground: '#64748B',
      background: '#F8FAFC',
      foreground: '#0F172A',
      card: '#FFFFFF',
      cardForeground: '#0F172A',
      border: '#E2E8F0',
    },
  },
  corporate: {
    name: 'corporate',
    label: 'Corporate (Dark Blue + Dourado)',
    colors: {
      primary: '#0F172A',
      primaryForeground: '#FFFFFF',
      secondary: '#D4AF37',
      secondaryForeground: '#0A0A0A',
      accent: '#1E40AF',
      accentForeground: '#FFFFFF',
      muted: '#F8FAFC',
      mutedForeground: '#475569',
      background: '#FFFFFF',
      foreground: '#0F172A',
      card: '#FFFFFF',
      cardForeground: '#0F172A',
      border: '#E2E8F0',
    },
  },
  prussian: {
    name: 'prussian',
    label: 'Prussian Blue + Silver',
    colors: {
      primary: '#003153',
      primaryForeground: '#FFFFFF',
      secondary: '#C0C0C0',
      secondaryForeground: '#0A0A0A',
      accent: '#0EA5E9',
      accentForeground: '#FFFFFF',
      muted: '#F0F9FF',
      mutedForeground: '#64748B',
      background: '#F0F9FF',
      foreground: '#0C4A6E',
      card: '#FFFFFF',
      cardForeground: '#0C4A6E',
      border: '#BAE6FD',
    },
  },
  slate: {
    name: 'slate',
    label: 'Slate + Amber',
    colors: {
      primary: '#1E293B',
      primaryForeground: '#FFFFFF',
      secondary: '#F59E0B',
      secondaryForeground: '#0A0A0A',
      accent: '#0284C7',
      accentForeground: '#FFFFFF',
      muted: '#F1F5F9',
      mutedForeground: '#64748B',
      background: '#F8FAFC',
      foreground: '#1E293B',
      card: '#FFFFFF',
      cardForeground: '#1E293B',
      border: '#CBD5E1',
    },
  },
  emerald: {
    name: 'emerald',
    label: 'Verde Esmeralda + Dourado',
    colors: {
      primary: '#064E3B',
      primaryForeground: '#FFFFFF',
      secondary: '#D4AF37',
      secondaryForeground: '#0A0A0A',
      accent: '#10B981',
      accentForeground: '#FFFFFF',
      muted: '#F0FDF4',
      mutedForeground: '#6B7280',
      background: '#F0FDF4',
      foreground: '#064E3B',
      card: '#FFFFFF',
      cardForeground: '#064E3B',
      border: '#D1FAE5',
    },
  },
  burgundy: {
    name: 'burgundy',
    label: 'Bordô + Creme',
    colors: {
      primary: '#7C2D12',
      primaryForeground: '#FFF7ED',
      secondary: '#EA580C',
      secondaryForeground: '#0A0A0A',
      accent: '#F97316',
      accentForeground: '#FFFFFF',
      muted: '#FFF7ED',
      mutedForeground: '#78716C',
      background: '#FFF7ED',
      foreground: '#7C2D12',
      card: '#FFFFFF',
      cardForeground: '#7C2D12',
      border: '#FED7AA',
    },
  },
  charcoal: {
    name: 'charcoal',
    label: 'Cinza Carvão + Bronze',
    colors: {
      primary: '#27272A',
      primaryForeground: '#FAFAF9',
      secondary: '#A16207',
      secondaryForeground: '#FAFAF9',
      accent: '#D97706',
      accentForeground: '#FFFFFF',
      muted: '#F5F5F4',
      mutedForeground: '#71717A',
      background: '#FAFAF9',
      foreground: '#27272A',
      card: '#FFFFFF',
      cardForeground: '#27272A',
      border: '#E7E5E4',
    },
  },
}
