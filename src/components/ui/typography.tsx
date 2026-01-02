import { cn } from '@/lib/utils'
import { ReactNode } from 'react'

interface TypographyProps {
  children: ReactNode
  className?: string
}

export function H1({ children, className }: TypographyProps) {
  return (
    <h1 className={cn('text-4xl font-bold tracking-tight', className)}>
      {children}
    </h1>
  )
}

export function H2({ children, className }: TypographyProps) {
  return (
    <h2 className={cn('text-3xl font-semibold tracking-tight', className)}>
      {children}
    </h2>
  )
}

export function H3({ children, className }: TypographyProps) {
  return (
    <h3 className={cn('text-2xl font-semibold tracking-tight', className)}>
      {children}
    </h3>
  )
}

export function H4({ children, className }: TypographyProps) {
  return (
    <h4 className={cn('text-xl font-semibold tracking-tight', className)}>
      {children}
    </h4>
  )
}

export function P({ children, className }: TypographyProps) {
  return (
    <p className={cn('text-base font-normal leading-relaxed', className)}>
      {children}
    </p>
  )
}

export function Lead({ children, className }: TypographyProps) {
  return (
    <p className={cn('text-lg font-normal text-muted-foreground', className)}>
      {children}
    </p>
  )
}

export function Small({ children, className }: TypographyProps) {
  return (
    <small className={cn('text-sm font-normal leading-none', className)}>
      {children}
    </small>
  )
}

export function Muted({ children, className }: TypographyProps) {
  return (
    <p className={cn('text-sm text-muted-foreground', className)}>
      {children}
    </p>
  )
}

export function Code({ children, className }: TypographyProps) {
  return (
    <code className={cn('relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold', className)}>
      {children}
    </code>
  )
}
