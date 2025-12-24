'use client'

import { useTheme } from '@/lib/theme/theme-provider'
import { themes } from '@/lib/theme/themes'

interface LogoProps {
  variant?: 'full' | 'compact' | 'horizontal'
  className?: string
}

export function Logo({ variant = 'compact', className = '' }: LogoProps) {
  const { theme: currentTheme } = useTheme()
  const theme = themes[currentTheme]

  if (variant === 'compact') {
    // Logo compacta para navbar - apenas o retângulo com GP
    return (
      <div
        className={`flex items-center justify-center ${className}`}
        style={{ fontFamily: "'Allrounder Monument', sans-serif" }}
      >
        <div
          className="w-[44px] h-[54px] flex items-center justify-center relative"
          style={{ backgroundColor: theme.colors.primary }}
        >
          <span
            className="text-[32px] font-normal tracking-[-1px] absolute -top-[2px]"
            style={{ color: theme.colors.primaryForeground }}
          >
            GP
          </span>
        </div>
      </div>
    )
  }

  if (variant === 'horizontal') {
    // Logo horizontal para header - retângulo GP + textos ao lado
    return (
      <div
        className={`flex items-center gap-2.5 ${className}`}
        style={{ fontFamily: "'Allrounder Monument', sans-serif" }}
      >
        {/* Retângulo com GP */}
        <div
          className="w-[44px] h-[54px] flex items-center justify-center relative flex-shrink-0"
          style={{ backgroundColor: theme.colors.primary }}
        >
          <span
            className="text-[32px] font-normal tracking-[-1px] absolute -top-[2px]"
            style={{ color: theme.colors.primaryForeground }}
          >
            GP
          </span>
        </div>

        {/* Textos ao lado */}
        <div className="flex flex-col items-start justify-center">
          {/* GARCEZ PALHA */}
          <h1
            className="text-[15px] font-normal tracking-[1.8px] leading-none whitespace-nowrap"
            style={{ color: theme.colors.primary }}
          >
            GARCEZ PALHA
          </h1>

          {/* INTELIGÊNCIA JURÍDICA */}
          <p
            className="text-[8.5px] font-normal tracking-[1.6px] leading-none mt-1 whitespace-nowrap"
            style={{ color: theme.colors.secondary }}
          >
            INTELIGÊNCIA JURÍDICA
          </p>
        </div>
      </div>
    )
  }

  // Logo completa
  return (
    <div
      className={`flex flex-col items-center ${className}`}
      style={{ fontFamily: "'Allrounder Monument', sans-serif" }}
    >
      {/* Retângulo com GP */}
      <div
        className="w-[220px] h-[270px] flex items-center justify-center mb-1 relative"
        style={{ backgroundColor: theme.colors.primary }}
      >
        <span
          className="text-[160px] font-normal tracking-[-5px] absolute -top-[10px]"
          style={{ color: theme.colors.primaryForeground }}
        >
          GP
        </span>
      </div>

      {/* GARCEZ PALHA */}
      <h2
        className="text-[74px] font-normal tracking-[12px] mb-4"
        style={{ color: theme.colors.primary }}
      >
        GARCEZ PALHA
      </h2>

      {/* INTELIGÊNCIA JURÍDICA */}
      <p
        className="text-[20px] font-normal tracking-[8px]"
        style={{ color: theme.colors.secondary }}
      >
        INTELIGÊNCIA JURÍDICA
      </p>
    </div>
  )
}
