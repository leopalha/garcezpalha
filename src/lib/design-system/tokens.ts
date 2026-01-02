/**
 * Design System Tokens
 * Garcez Palha - Legal Tech Platform
 *
 * Central source of truth for design decisions
 */

export const designTokens = {
  // Color Palette
  colors: {
    primary: {
      50: 'hsl(210, 100%, 97%)',
      100: 'hsl(210, 100%, 94%)',
      200: 'hsl(210, 100%, 87%)',
      300: 'hsl(210, 100%, 78%)',
      400: 'hsl(210, 100%, 67%)',
      500: 'hsl(210, 100%, 50%)', // Main brand color #0080ff
      600: 'hsl(210, 100%, 40%)',
      700: 'hsl(210, 100%, 32%)',
      800: 'hsl(210, 90%, 24%)',
      900: 'hsl(210, 80%, 16%)',
    },
    secondary: {
      50: 'hsl(220, 14%, 96%)',
      100: 'hsl(220, 13%, 91%)',
      200: 'hsl(216, 12%, 84%)',
      300: 'hsl(218, 11%, 65%)',
      400: 'hsl(220, 9%, 46%)',
      500: 'hsl(215, 16%, 27%)',
      600: 'hsl(215, 19%, 22%)',
      700: 'hsl(215, 25%, 17%)',
      800: 'hsl(217, 33%, 12%)',
      900: 'hsl(222, 47%, 8%)',
    },
    accent: {
      hot: '#ef4444',     // red-500
      warm: '#f59e0b',    // amber-500
      cold: '#3b82f6',    // blue-500
      success: '#22c55e', // green-500
      warning: '#eab308', // yellow-500
      error: '#dc2626',   // red-600
      info: '#3b82f6',    // blue-500
    },
    semantic: {
      background: {
        primary: '#ffffff',
        secondary: '#f9fafb',
        tertiary: '#f3f4f6',
        dark: '#111827',
        darkSecondary: '#1f2937',
      },
      text: {
        primary: '#111827',
        secondary: '#6b7280',
        tertiary: '#9ca3af',
        inverse: '#ffffff',
        muted: '#6b7280',
      },
      border: {
        light: '#e5e7eb',
        default: '#d1d5db',
        dark: '#9ca3af',
      },
    },
  },

  // Typography
  typography: {
    fontFamily: {
      sans: 'var(--font-inter), -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      mono: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
    },
    fontSize: {
      xs: '0.75rem',     // 12px
      sm: '0.875rem',    // 14px
      base: '1rem',      // 16px
      lg: '1.125rem',    // 18px
      xl: '1.25rem',     // 20px
      '2xl': '1.5rem',   // 24px
      '3xl': '1.875rem', // 30px
      '4xl': '2.25rem',  // 36px
      '5xl': '3rem',     // 48px
      '6xl': '3.75rem',  // 60px
    },
    fontWeight: {
      light: '300',
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
      extrabold: '800',
    },
    lineHeight: {
      none: '1',
      tight: '1.25',
      snug: '1.375',
      normal: '1.5',
      relaxed: '1.625',
      loose: '2',
    },
  },

  // Spacing
  spacing: {
    0: '0',
    px: '1px',
    0.5: '0.125rem',  // 2px
    1: '0.25rem',     // 4px
    1.5: '0.375rem',  // 6px
    2: '0.5rem',      // 8px
    2.5: '0.625rem',  // 10px
    3: '0.75rem',     // 12px
    3.5: '0.875rem',  // 14px
    4: '1rem',        // 16px
    5: '1.25rem',     // 20px
    6: '1.5rem',      // 24px
    7: '1.75rem',     // 28px
    8: '2rem',        // 32px
    9: '2.25rem',     // 36px
    10: '2.5rem',     // 40px
    11: '2.75rem',    // 44px
    12: '3rem',       // 48px
    14: '3.5rem',     // 56px
    16: '4rem',       // 64px
    20: '5rem',       // 80px
    24: '6rem',       // 96px
    28: '7rem',       // 112px
    32: '8rem',       // 128px
    36: '9rem',       // 144px
    40: '10rem',      // 160px
    44: '11rem',      // 176px
    48: '12rem',      // 192px
    52: '13rem',      // 208px
    56: '14rem',      // 224px
    60: '15rem',      // 240px
    64: '16rem',      // 256px
    72: '18rem',      // 288px
    80: '20rem',      // 320px
    96: '24rem',      // 384px
  },

  // Border Radius
  borderRadius: {
    none: '0',
    sm: '0.125rem',   // 2px
    DEFAULT: '0.25rem', // 4px
    md: '0.375rem',   // 6px
    lg: '0.5rem',     // 8px
    xl: '0.75rem',    // 12px
    '2xl': '1rem',    // 16px
    '3xl': '1.5rem',  // 24px
    full: '9999px',
  },

  // Shadows
  boxShadow: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    DEFAULT: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
    '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
    inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
    none: 'none',
  },

  // Breakpoints
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },

  // Z-Index
  zIndex: {
    0: '0',
    10: '10',
    20: '20',
    30: '30',
    40: '40',
    50: '50',
    auto: 'auto',
    dropdown: '1000',
    sticky: '1020',
    fixed: '1030',
    modalBackdrop: '1040',
    modal: '1050',
    popover: '1060',
    tooltip: '1070',
  },

  // Transitions
  transition: {
    duration: {
      fast: '150ms',
      base: '200ms',
      slow: '300ms',
      slower: '500ms',
    },
    timing: {
      linear: 'linear',
      ease: 'ease',
      easeIn: 'ease-in',
      easeOut: 'ease-out',
      easeInOut: 'ease-in-out',
    },
  },
} as const

// Component-specific tokens
export const componentTokens = {
  button: {
    height: {
      sm: '32px',
      md: '40px',
      lg: '48px',
    },
    padding: {
      sm: '0 12px',
      md: '0 16px',
      lg: '0 24px',
    },
  },
  input: {
    height: {
      sm: '32px',
      md: '40px',
      lg: '48px',
    },
    borderRadius: designTokens.borderRadius.md,
  },
  card: {
    borderRadius: designTokens.borderRadius.lg,
    padding: designTokens.spacing[6],
    shadow: designTokens.boxShadow.md,
  },
} as const

export type DesignTokens = typeof designTokens
export type ComponentTokens = typeof componentTokens
