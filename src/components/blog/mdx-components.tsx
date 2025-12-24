/**
 * Custom MDX Components
 * Enhanced components for blog post rendering
 */

import React from 'react'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AlertCircle, Info, CheckCircle, AlertTriangle } from 'lucide-react'

export const MDXComponents = {
  // Enhanced headings with anchor links
  h1: ({ children, ...props }: React.HTMLProps<HTMLHeadingElement>) => (
    <h1
      className="font-display text-4xl md:text-5xl font-bold mt-12 mb-6 first:mt-0"
      {...props}
    >
      {children}
    </h1>
  ),
  h2: ({ children, ...props }: React.HTMLProps<HTMLHeadingElement>) => (
    <h2
      className="font-display text-3xl md:text-4xl font-bold mt-10 mb-5 scroll-mt-20"
      {...props}
    >
      {children}
    </h2>
  ),
  h3: ({ children, ...props }: React.HTMLProps<HTMLHeadingElement>) => (
    <h3
      className="font-heading text-2xl md:text-3xl font-semibold mt-8 mb-4 scroll-mt-20"
      {...props}
    >
      {children}
    </h3>
  ),
  h4: ({ children, ...props }: React.HTMLProps<HTMLHeadingElement>) => (
    <h4 className="font-heading text-xl md:text-2xl font-semibold mt-6 mb-3 scroll-mt-20" {...props}>
      {children}
    </h4>
  ),

  // Paragraphs
  p: ({ children, ...props }: React.HTMLProps<HTMLParagraphElement>) => (
    <p className="text-lg leading-relaxed mb-6 text-muted-foreground" {...props}>
      {children}
    </p>
  ),

  // Lists
  ul: ({ children, ...props }: React.HTMLProps<HTMLUListElement>) => (
    <ul className="list-disc list-inside space-y-3 mb-6 ml-4 text-lg text-muted-foreground" {...props}>
      {children}
    </ul>
  ),
  ol: ({ children, ...props }: React.OlHTMLAttributes<HTMLOListElement>) => (
    <ol className="list-decimal list-inside space-y-3 mb-6 ml-4 text-muted-foreground text-lg" {...props}>
      {children}
    </ol>
  ),
  li: ({ children, ...props }: React.HTMLProps<HTMLLIElement>) => (
    <li className="ml-2" {...props}>
      {children}
    </li>
  ),

  // Links
  a: ({ children, href, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement>) => {
    const isExternal = href?.startsWith('http')
    const isAnchor = href?.startsWith('#')

    if (isExternal) {
      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:text-primary/80 underline font-medium"
          {...props}
        >
          {children}
        </a>
      )
    }

    if (isAnchor) {
      return (
        <a
          href={href}
          className="text-primary hover:text-primary/80 underline font-medium"
          {...props}
        >
          {children}
        </a>
      )
    }

    return (
      <Link
        href={href || '#'}
        className="text-primary hover:text-primary/80 underline font-medium"
        {...props}
      >
        {children}
      </Link>
    )
  },

  // Blockquotes
  blockquote: ({ children, ...props }: React.HTMLProps<HTMLQuoteElement>) => (
    <blockquote
      className="border-l-4 border-primary/50 pl-6 py-2 my-6 italic text-xl text-muted-foreground"
      {...props}
    >
      {children}
    </blockquote>
  ),

  // Code
  code: ({ children, ...props }: React.HTMLProps<HTMLElement>) => (
    <code
      className="bg-muted px-2 py-1 rounded text-sm font-mono text-foreground"
      {...props}
    >
      {children}
    </code>
  ),
  pre: ({ children, ...props }: React.HTMLProps<HTMLPreElement>) => (
    <pre
      className="bg-muted p-4 rounded-lg overflow-x-auto my-6 text-sm"
      {...props}
    >
      {children}
    </pre>
  ),

  // Tables
  table: ({ children, ...props }: React.HTMLProps<HTMLTableElement>) => (
    <div className="overflow-x-auto my-6">
      <table className="w-full border-collapse" {...props}>
        {children}
      </table>
    </div>
  ),
  thead: ({ children, ...props }: React.HTMLProps<HTMLTableSectionElement>) => (
    <thead className="bg-muted" {...props}>
      {children}
    </thead>
  ),
  tbody: ({ children, ...props }: React.HTMLProps<HTMLTableSectionElement>) => (
    <tbody className="divide-y divide-border" {...props}>
      {children}
    </tbody>
  ),
  th: ({ children, ...props }: React.HTMLProps<HTMLTableCellElement>) => (
    <th
      className="px-4 py-3 text-left font-semibold text-foreground"
      {...props}
    >
      {children}
    </th>
  ),
  td: ({ children, ...props }: React.HTMLProps<HTMLTableCellElement>) => (
    <td className="px-4 py-3 text-muted-foreground" {...props}>
      {children}
    </td>
  ),

  // Horizontal Rule
  hr: (props: React.HTMLProps<HTMLHRElement>) => (
    <hr className="my-8 border-border" {...props} />
  ),

  // Strong and Emphasis
  strong: ({ children, ...props }: React.HTMLProps<HTMLElement>) => (
    <strong className="font-bold text-foreground" {...props}>
      {children}
    </strong>
  ),
  em: ({ children, ...props }: React.HTMLProps<HTMLElement>) => (
    <em className="italic" {...props}>
      {children}
    </em>
  ),

  // Custom Components
  Callout: ({ children, type = 'info', title }: {
    children: React.ReactNode
    type?: 'info' | 'warning' | 'success' | 'error'
    title?: string
  }) => {
    const icons = {
      info: Info,
      warning: AlertTriangle,
      success: CheckCircle,
      error: AlertCircle,
    }

    const Icon = icons[type]

    return (
      <Alert className="my-6" variant={type === 'error' ? 'destructive' : 'default'}>
        <Icon className="h-4 w-4" />
        {title && <AlertTitle>{title}</AlertTitle>}
        <AlertDescription>{children}</AlertDescription>
      </Alert>
    )
  },

  HighlightBox: ({ children, ...props }: { children: React.ReactNode }) => (
    <Card className="my-6 border-primary/50 bg-primary/5" {...props}>
      <CardContent className="p-6">
        {children}
      </CardContent>
    </Card>
  ),
}
